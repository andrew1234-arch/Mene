import {
  ExpirationTime,
  NoEntityFoundError,
  type PublicArkivClient,
  type WalletArkivClient,
  createPublicClient,
  createWalletClient,
  jsonToPayload,
} from "@arkiv-network/sdk"
import { bytes32, i32, key as keyAttr, str, u64 } from "@arkiv-network/sdk/attr"
import { tiramisu } from "@arkiv-network/sdk/chains"
import { and, eq } from "@arkiv-network/sdk/query"
import { http, type Hex, keccak256, toBytes, webSocket } from "viem"
import { privateKeyToAccount } from "viem/accounts"
import {
  ADVISORY_LIFETIME_DAYS,
  ATTESTATION_LIFETIME_DAYS,
  BURN_ADDRESS,
  PROJECT,
  SCHEMA_VERSION,
  TIRAMISU,
  severityToInt,
} from "./constants"
import { type OsvAdvisory, parseOsv, primaryPackage, severityOf } from "./osv"
import type { AdvisoryRecord, AttestationRecord, Verdict } from "./quorum"

export type MenePublicClient = PublicArkivClient
export type MeneWalletClient = WalletArkivClient

/**
 * Tiramisu answers bursts with JSON-RPC -32005 "Request exceeds defined limit" (rate limiting;
 * see arkiv/friction.md). viem retries that code, but its default backoff (3 tries from 150 ms)
 * gives up within a second, so reads and writes back off for up to ~25 s instead.
 */
const RETRY = { retryCount: 6, retryDelay: 400 } as const

export function publicClient(opts: { rpcUrl?: string; ws?: boolean } = {}): MenePublicClient {
  const transport = opts.ws
    ? webSocket(opts.rpcUrl ?? TIRAMISU.wsUrl, RETRY)
    : http(opts.rpcUrl ?? TIRAMISU.rpcUrl, RETRY)
  return createPublicClient({ chain: tiramisu, transport }) as MenePublicClient
}

export function walletClient(privateKey: string, opts: { rpcUrl?: string } = {}): MeneWalletClient {
  const pk = (privateKey.startsWith("0x") ? privateKey : `0x${privateKey}`) as Hex
  return createWalletClient({
    chain: tiramisu,
    transport: http(opts.rpcUrl ?? TIRAMISU.rpcUrl, RETRY),
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
    // Payload is `{ "reason": "…" }` or `{}`.
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
    attestedAt: Number((attr(e, "attested_at") as bigint | undefined) ?? 0n),
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

const READ_CONCURRENCY = 4

/** One full read: trusted attestations, then every advisory they point at. */
export async function readLive(pub: MenePublicClient, issuers: string[]) {
  const { attestations, blockNumber } = await readAttestations(pub, issuers)
  const keys = [...new Set(attestations.map((a) => a.advisory))]
  const advisories: Record<string, AdvisoryRecord> = {}
  const invalid: Record<string, string> = {}
  // At most READ_CONCURRENCY reads in flight: a burst of one request per advisory trips the node's
  // rate limit, and every throttled request then retries in lockstep (friction.md #8).
  let next = 0
  const worker = async () => {
    while (next < keys.length) {
      const k = keys[next++]!
      try {
        const a = await readAdvisory(pub, k)
        if (a) advisories[k] = a
      } catch (err) {
        if (err instanceof InvalidAdvisoryError) {
          invalid[k] = (err as Error).message
        } else throw err
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(READ_CONCURRENCY, keys.length) }, worker))
  return { attestations, advisories, invalid, blockNumber }
}

// ---------------------------------------------------------------- writes

const utf8Len = (s: string) => new TextEncoder().encode(s).length

/** Attributes per arkiv/schema.md. Everything a query filters on; the OSV JSON goes in the payload. */
export function advisoryAttributes(osv: OsvAdvisory) {
  const name = primaryPackage(osv)
  return {
    project: str(PROJECT),
    type: str("advisory"),
    schema_version: i32(SCHEMA_VERSION),
    advisory_id: str(osv.id),
    ecosystem: str("npm"),
    // str is capped at 128 bytes; pkg_id always identifies the package.
    ...(utf8Len(name) <= 128 ? { pkg: str(name) } : {}),
    pkg_id: bytes32(keccak256(toBytes(`npm:${name}`))),
    severity: i32(severityToInt(severityOf(osv))),
    published_at: u64(BigInt(Math.floor(Date.parse(osv.published) / 1000))),
  }
}

function attestationCreate(advisoryKey: Hex, verdict: Verdict, reason?: string, salt?: bigint) {
  return {
    payload: jsonToPayload(reason ? { reason } : {}),
    contentType: "application/json",
    expires: ExpirationTime.fromDays(ATTESTATION_LIFETIME_DAYS),
    attributes: {
      project: str(PROJECT),
      type: str("attestation"),
      advisory: keyAttr(advisoryKey),
      verdict: str(verdict),
      attested_at: u64(BigInt(Math.floor(Date.now() / 1000))),
    },
    flags: { readonly: true, permissionlessExtension: true },
    ...(salt !== undefined ? { salt } : {}),
  }
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
 * (optionally) the seal to the burn address.
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
      attestationCreate(adv.key, "confirm", undefined, att.salt),
    ],
    ownershipChanges: sealMode === "batch" ? [{ entityKey: adv.key, newOwner: BURN_ADDRESS }] : [],
  })
  const advisoryKey = (r.createdEntities[0] ?? adv.key) as Hex
  const attestationKey = (r.createdEntities[1] ?? att.key) as Hex
  let sealTxHash: Hex | undefined
  if (sealMode === "separate") {
    sealTxHash = (await wallet.changeOwnership({ entityKey: advisoryKey, newOwner: BURN_ADDRESS })).txHash
  }
  return { txHash: r.txHash, advisoryKey, attestationKey, sealed: sealMode !== "none", sealTxHash }
}

/** Writes a confirm or withdraw attestation. */
export async function attest(
  wallet: MeneWalletClient,
  advisoryKey: string,
  verdict: Verdict,
  reason?: string,
): Promise<{ txHash: Hex; attestationKey: Hex }> {
  const r = await wallet.createEntity(attestationCreate(advisoryKey as Hex, verdict, reason))
  return { txHash: r.txHash, attestationKey: r.entityKey }
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

/** A witness's latest verdict on one advisory (by block, then attestedAt), or undefined. */
export async function latestVerdict(
  pub: MenePublicClient,
  witness: string,
  advisoryKey: string,
): Promise<Verdict | undefined> {
  let page = await pub
    .select("*")
    .where(and(eq("project", PROJECT), eq("type", "attestation"), eq("advisory", keyAttr(advisoryKey as Hex))))
    .createdBy(witness as Hex)
    .limit(PAGE)
    .fetch()
  const all: AttestationRecord[] = []
  for (;;) {
    for (const e of page.entities) {
      const r = toAttestationRecord(e as AnyEntity)
      if (r) all.push(r)
    }
    if (!page.hasNextPage()) break
    page = await page.next()
  }
  all.sort((a, b) => a.createdAt - b.createdAt || a.attestedAt - b.attestedAt)
  return all.at(-1)?.verdict
}

/** Seals an advisory to the burn address if it isn't already. Returns the tx hash if it sealed. */
export async function ensureSealed(
  pub: MenePublicClient,
  wallet: MeneWalletClient,
  advisoryKey: string,
): Promise<Hex | undefined> {
  const e = await pub.getEntity(advisoryKey as Hex)
  if (e.owner.toLowerCase() === BURN_ADDRESS.toLowerCase()) return undefined
  return (await wallet.changeOwnership({ entityKey: advisoryKey as Hex, newOwner: BURN_ADDRESS })).txHash
}
