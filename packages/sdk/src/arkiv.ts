import {
  createPublicClient,
  createWalletClient,
  ExpirationTime,
  jsonToPayload,
  NoEntityFoundError,
  type PublicArkivClient,
  type WalletArkivClient,
} from "@arkiv-network/sdk"
import { i32, key as keyAttr, str, u64 } from "@arkiv-network/sdk/attr"
import { tiramisu } from "@arkiv-network/sdk/chains"
import { and, eq } from "@arkiv-network/sdk/query"
import { type Hex, http, webSocket } from "viem"
import { privateKeyToAccount } from "viem/accounts"
import {
  ADVISORY_LIFETIME_DAYS,
  ATTESTATION_LIFETIME_DAYS,
  BURN_ADDRESS,
  ISSUER_LEASE_DAYS,
  PROJECT,
  SCHEMA_VERSION,
  severityToInt,
  TIRAMISU,
} from "./constants"
import { type OsvAdvisory, parseOsv, primaryPackage } from "./osv"
import type { AdvisoryRecord, AttestationRecord, Verdict } from "./quorum"

export type MenePublicClient = PublicArkivClient
export type MeneWalletClient = WalletArkivClient

export function publicClient(opts: { rpcUrl?: string; ws?: boolean } = {}): MenePublicClient {
  const transport = opts.ws
    ? webSocket(opts.rpcUrl ?? TIRAMISU.wsUrl)
    : http(opts.rpcUrl ?? TIRAMISU.rpcUrl)
  return createPublicClient({ chain: tiramisu, transport }) as MenePublicClient
}

export function walletClient(privateKey: string, opts: { rpcUrl?: string } = {}): MeneWalletClient {
  const pk = (privateKey.startsWith("0x") ? privateKey : `0x${privateKey}`) as Hex
  return createWalletClient({
    chain: tiramisu,
    transport: http(opts.rpcUrl ?? TIRAMISU.rpcUrl),
    account: privateKeyToAccount(pk),
  }) as MeneWalletClient
}

const PAGE = 200

// ---------------------------------------------------------------- queries (exported for "verify it yourself")

/** The exact filter used to read one issuer's attestations. Contains no package name. */
export function attestationQuery(pub: MenePublicClient, issuer: string) {
  return pub
    .select("*")
    .where(and(eq("project", PROJECT), eq("type", "attestation")))
    .createdBy(issuer as Hex)
    .limit(PAGE)
}

// ---------------------------------------------------------------- reads

type AnyEntity = {
  key?: Hex
  creator?: Hex
  owner?: Hex
  createdAt?: bigint
  expiresAt?: bigint
  creationFlags?: { readonly: boolean; permissionlessExtension: boolean }
  attributes?: Readonly<Record<string, { value: unknown }>>
  payload?: Uint8Array
  toJson?: () => unknown
}

function attr(e: AnyEntity, name: string): unknown {
  return e.attributes?.[name]?.value
}

export function toAttestationRecord(e: AnyEntity): AttestationRecord | null {
  const verdict = attr(e, "verdict")
  const advisory = attr(e, "advisory")
  if (!e.key || !e.creator || (verdict !== "confirm" && verdict !== "withdraw")) return null
  if (typeof advisory !== "string") return null
  let reason: string | undefined
  try {
    const p = e.toJson?.() as { reason?: unknown } | undefined
    if (p && typeof p.reason === "string") reason = p.reason
  } catch {
    // payload is optional for attestations
  }
  return {
    key: e.key.toLowerCase(),
    advisory: advisory.toLowerCase(),
    issuer: e.creator.toLowerCase(),
    verdict,
    createdAt: Number(e.createdAt ?? 0n),
    issuedAt: Number((attr(e, "issuedAt") as bigint | undefined) ?? 0n),
    reason,
  }
}

/** Every attestation created by each trusted issuer, paging through all results. */
export async function readAttestations(
  pub: MenePublicClient,
  issuers: string[],
): Promise<{ attestations: AttestationRecord[]; blockNumber: bigint }> {
  const out: AttestationRecord[] = []
  let blockNumber = 0n
  for (const issuer of issuers) {
    let page = await attestationQuery(pub, issuer).fetch()
    for (;;) {
      if (page.blockNumber > blockNumber) blockNumber = page.blockNumber
      for (const e of page.entities) {
        const r = toAttestationRecord(e as AnyEntity)
        if (r) out.push(r)
      }
      if (!page.hasNextPage()) break
      page = await page.next()
    }
  }
  return { attestations: out, blockNumber }
}

export class InvalidAdvisoryError extends Error {}

export function toAdvisoryRecord(e: AnyEntity): AdvisoryRecord {
  if (!e.key || !e.creator || !e.owner) throw new InvalidAdvisoryError("entity is missing metadata")
  if (attr(e, "project") !== PROJECT || attr(e, "type") !== "advisory") {
    throw new InvalidAdvisoryError("entity is not a mene-v1 advisory")
  }
  if (!e.creationFlags?.readonly) throw new InvalidAdvisoryError("advisory is not readonly")
  let osv: OsvAdvisory
  try {
    osv = parseOsv(e.toJson?.())
  } catch (err) {
    throw new InvalidAdvisoryError(`invalid OSV payload: ${(err as Error).message}`)
  }
  return {
    key: e.key.toLowerCase(),
    creator: e.creator.toLowerCase(),
    owner: e.owner.toLowerCase(),
    createdAt: Number(e.createdAt ?? 0n),
    expiresAt: Number(e.expiresAt ?? 0n),
    readonly: e.creationFlags.readonly,
    permissionlessExtension: e.creationFlags.permissionlessExtension,
    osv,
  }
}

/** Reads one advisory. `null` if it does not exist (deleted, expired or never existed). */
export async function readAdvisory(pub: MenePublicClient, key: string): Promise<AdvisoryRecord | null> {
  try {
    const e = await pub.getEntity(key as Hex)
    return toAdvisoryRecord(e as unknown as AnyEntity)
  } catch (err) {
    if (err instanceof NoEntityFoundError) return null
    throw err
  }
}

/** One full read: trusted attestations, then every advisory they point at. */
export async function readLive(pub: MenePublicClient, issuers: string[]) {
  const { attestations, blockNumber } = await readAttestations(pub, issuers)
  const keys = [...new Set(attestations.map((a) => a.advisory))]
  const advisories: Record<string, AdvisoryRecord> = {}
  const invalid: Record<string, string> = {}
  await Promise.all(
    keys.map(async (k) => {
      try {
        const a = await readAdvisory(pub, k)
        if (a) advisories[k] = a
      } catch (err) {
        if (err instanceof InvalidAdvisoryError) {
          invalid[k] = (err as Error).message
        } else throw err
      }
    }),
  )
  return { attestations, advisories, invalid, blockNumber }
}

// ---------------------------------------------------------------- writes

function advisoryAttributes(osv: OsvAdvisory) {
  return {
    project: str(PROJECT),
    type: str("advisory"),
    v: i32(SCHEMA_VERSION),
    osvId: str(osv.id),
    ecosystem: str("npm"),
    package: str(primaryPackage(osv).slice(0, 128)),
    severity: i32(severityToInt(osv.database_specific.severity)),
    publishedAt: u64(BigInt(Math.floor(Date.parse(osv.published) / 1000))),
  }
}

function attestationCreate(advisoryKey: Hex, verdict: Verdict, reason?: string, salt?: bigint) {
  return {
    payload: jsonToPayload({ advisory: advisoryKey, verdict, reason: reason ?? null }),
    contentType: "application/json",
    expires: ExpirationTime.fromDays(ATTESTATION_LIFETIME_DAYS),
    attributes: {
      project: str(PROJECT),
      type: str("attestation"),
      v: i32(SCHEMA_VERSION),
      advisory: keyAttr(advisoryKey),
      verdict: str(verdict),
      issuedAt: u64(BigInt(Math.floor(Date.now() / 1000))),
    },
    flags: { readonly: true, permissionlessExtension: true },
    ...(salt !== undefined ? { salt } : {}),
  }
}

/** The issuer's profile entity key, if it has one that is still alive. */
export async function findIssuerProfile(pub: MenePublicClient, issuer: string): Promise<Hex | null> {
  const page = await pub
    .select({ key: true, expiresAt: true })
    .where(and(eq("project", PROJECT), eq("type", "issuer")))
    .createdBy(issuer as Hex)
    .limit(1)
    .fetch()
  return (page.entities[0]?.key as Hex | undefined) ?? null
}

/** Creates or renews the issuer's 30-day lease profile. */
export async function upsertIssuerProfile(
  pub: MenePublicClient,
  wallet: MeneWalletClient,
  name: string,
): Promise<{ key: Hex; txHash: Hex }> {
  const me = wallet.account!.address
  const existing = await findIssuerProfile(pub, me)
  if (existing) {
    const r = await wallet.extendEntity({ entityKey: existing, expires: ExpirationTime.fromDays(ISSUER_LEASE_DAYS) })
    return { key: existing, txHash: r.txHash }
  }
  const r = await wallet.createEntity({
    payload: jsonToPayload({ name }),
    contentType: "application/json",
    expires: ExpirationTime.fromDays(ISSUER_LEASE_DAYS),
    attributes: { project: str(PROJECT), type: str("issuer"), v: i32(SCHEMA_VERSION), name: str(name.slice(0, 128)) },
  })
  return { key: r.entityKey, txHash: r.txHash }
}

export interface PublishResult {
  txHash: Hex
  advisoryKey: Hex
  attestationKey: Hex
  sealed: boolean
  sealTxHash?: Hex
}

/**
 * Publishes an advisory in one atomic batch: advisory + the publisher's own confirm attestation +
 * (optionally) the seal to the burn address + the issuer-lease extension.
 *
 * `sealMode`: "batch" seals in the same transaction (SPIKE S1), "separate" seals in a follow-up
 * transaction, "none" leaves the issuer as owner.
 */
export async function publishAdvisory(
  pub: MenePublicClient,
  wallet: MeneWalletClient,
  osvInput: unknown,
  opts: { sealMode?: "batch" | "separate" | "none" } = {},
): Promise<PublishResult> {
  const osv = parseOsv(osvInput)
  const sealMode = opts.sealMode ?? "batch"
  const me = wallet.account!.address
  const [adv, att] = await pub.predictEntityKeys({ owner: me, count: 2 })
  const profile = await findIssuerProfile(pub, me)
  const r = await wallet.executeBatch({
    creates: [
      {
        payload: jsonToPayload(osv),
        contentType: "application/json",
        expires: ExpirationTime.fromDays(ADVISORY_LIFETIME_DAYS),
        attributes: advisoryAttributes(osv),
        flags: { readonly: true, permissionlessExtension: true },
        salt: adv.salt,
      },
      attestationCreate(adv.key, "confirm", "publisher", att.salt),
    ],
    ownershipChanges: sealMode === "batch" ? [{ entityKey: adv.key, newOwner: BURN_ADDRESS }] : [],
    extensions: profile ? [{ entityKey: profile, expires: ExpirationTime.fromDays(ISSUER_LEASE_DAYS) }] : [],
  })
  const advisoryKey = (r.createdEntities[0] ?? adv.key) as Hex
  const attestationKey = (r.createdEntities[1] ?? att.key) as Hex
  let sealTxHash: Hex | undefined
  if (sealMode === "separate") {
    sealTxHash = (await wallet.changeOwnership({ entityKey: advisoryKey, newOwner: BURN_ADDRESS })).txHash
  }
  return { txHash: r.txHash, advisoryKey, attestationKey, sealed: sealMode !== "none", sealTxHash }
}

/** Writes a confirm or withdraw attestation (and renews the issuer lease in the same batch). */
export async function attest(
  pub: MenePublicClient,
  wallet: MeneWalletClient,
  advisoryKey: string,
  verdict: Verdict,
  reason?: string,
): Promise<{ txHash: Hex; attestationKey: Hex }> {
  const me = wallet.account!.address
  const profile = await findIssuerProfile(pub, me)
  const r = await wallet.executeBatch({
    creates: [attestationCreate(advisoryKey as Hex, verdict, reason)],
    extensions: profile ? [{ entityKey: profile, expires: ExpirationTime.fromDays(ISSUER_LEASE_DAYS) }] : [],
  })
  return { txHash: r.txHash, attestationKey: r.createdEntities[0] as Hex }
}

/** Permissionless Lifetime Extension: any wallet can keep advisories and attestations alive. */
export async function keepalive(
  pub: MenePublicClient,
  wallet: MeneWalletClient,
  keys: string[],
  days = ADVISORY_LIFETIME_DAYS,
): Promise<{ txHash?: Hex; extended: Hex[]; skipped: Hex[] }> {
  if (!Number.isFinite(days) || days <= 0) throw new Error("days must be a positive number")
  // extendEntity reverts unless the new expiry is later than the current one, and one revert sinks
  // the whole batch, so leave out anything that already lives at least that long (with 1 h margin).
  const head = await pub.getBlockNumber()
  const target = head + BigInt(Math.floor((days * 86400) / 2)) - 1800n
  const extend: Hex[] = []
  const skipped: Hex[] = []
  for (const k of keys) {
    try {
      const e = await pub.getEntity(k as Hex)
      ;(e.expiresAt < target ? extend : skipped).push(k as Hex)
    } catch (err) {
      if (err instanceof NoEntityFoundError) skipped.push(k as Hex)
      else throw err
    }
  }
  if (!extend.length) return { extended: [], skipped }
  const r = await wallet.executeBatch({
    extensions: extend.map((k) => ({ entityKey: k, expires: ExpirationTime.fromDays(days) })),
  })
  return { txHash: r.txHash, extended: r.extendedEntities, skipped }
}
