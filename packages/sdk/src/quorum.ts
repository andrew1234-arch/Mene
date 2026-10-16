import type { OsvAdvisory } from "./osv"

export type Verdict = "confirm" | "withdraw"

/** An attestation as read from Arkiv. JSON-safe so it can live in the anti-burial cache. */
export interface AttestationRecord {
  key: string
  advisory: string
  issuer: string
  verdict: Verdict
  /** Block the attestation entity was created at. */
  createdAt: number
  /** Unix seconds, from the `attested_at` attribute; tie-breaker within a block. */
  attestedAt: number
  reason?: string
}

/** An advisory entity as read from Arkiv. */
export interface AdvisoryRecord {
  key: string
  creator: string
  owner: string
  createdAt: number
  expiresAt: number
  readonly: boolean
  permissionlessExtension: boolean
  osv: OsvAdvisory
}

/** Persistent client-side memory of everything ever seen; see SPEC "Anti-burial cache". */
export interface MeneState {
  version: 2
  advisories: Record<string, AdvisoryRecord>
  attestations: Record<string, AttestationRecord>
  /** Last status computed per advisory, so a disappearance can be reported as "was ACTIVE". */
  lastStatus: Record<string, StatusKind>
  /** For advisories currently MISSING: the status they had while still readable. */
  wasStatus: Record<string, StatusKind>
}

export function emptyState(): MeneState {
  return { version: 2, advisories: {}, attestations: {}, lastStatus: {}, wasStatus: {} }
}

const isRecord = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v)

/**
 * Converts a v1 advisory body (`database_specific: { mene_version, severity }`, per-package
 * `safe_version`) to the current format. The cached copy is the anti-burial backstop for an
 * advisory that may no longer exist on chain, so it is converted, never dropped.
 */
function upgradeOsv(osv: unknown): OsvAdvisory | undefined {
  if (!isRecord(osv)) return undefined
  const ds = isRecord(osv.database_specific) ? osv.database_specific : {}
  if (isRecord(ds.mene)) return osv as unknown as OsvAdvisory
  const sev = ds.severity === "medium" ? "moderate" : ds.severity
  const affected = Array.isArray(osv.affected) ? (osv.affected as Record<string, unknown>[]) : []
  const safe = affected
    .map((a) => (isRecord(a?.database_specific) ? a.database_specific.safe_version : undefined))
    .find((v) => typeof v === "string")
  const { mene_version: _v, severity: _s, ...rest } = ds
  return {
    ...(osv as object),
    affected: affected.map((a) => {
      if (!isRecord(a?.database_specific)) return a
      const { safe_version: _sv, ...keep } = a.database_specific
      return { ...a, database_specific: keep }
    }),
    database_specific: {
      ...rest,
      mene: { severity: typeof sev === "string" ? sev : "critical", ...(safe ? { recommended: safe } : {}) },
    },
  } as unknown as OsvAdvisory
}

/**
 * Validates and upgrades saved state (CLI cache file or browser storage). Returns undefined for
 * anything unrecognised or malformed, so callers fail closed instead of silently forgetting.
 */
export function migrateState(raw: unknown): MeneState | undefined {
  if (!isRecord(raw)) return undefined
  const { version } = raw
  if (version !== 1 && version !== 2) return undefined
  for (const f of ["advisories", "attestations", "lastStatus", "wasStatus"] as const) {
    if (raw[f] !== undefined && !isRecord(raw[f])) return undefined
  }
  const advisories: MeneState["advisories"] = {}
  for (const [k, a] of Object.entries((raw.advisories as Record<string, AdvisoryRecord>) ?? {})) {
    if (!isRecord(a)) return undefined
    const osv = version === 1 ? upgradeOsv(a.osv) : (a.osv as OsvAdvisory)
    if (!osv) return undefined
    advisories[k] = { ...a, osv }
  }
  const attestations: MeneState["attestations"] = {}
  for (const [k, a] of Object.entries(
    (raw.attestations as Record<string, AttestationRecord & { issuedAt?: number }>) ?? {},
  )) {
    if (!isRecord(a) || typeof a.advisory !== "string" || typeof a.issuer !== "string") return undefined
    attestations[k] = { ...a, attestedAt: a.attestedAt ?? a.issuedAt ?? 0 }
  }
  return {
    version: 2,
    advisories,
    attestations,
    lastStatus: (raw.lastStatus as MeneState["lastStatus"]) ?? {},
    wasStatus: (raw.wasStatus as MeneState["wasStatus"]) ?? {},
  }
}

export type StatusKind = "ACTIVE" | "PENDING" | "WITHDRAWN" | "MISSING"

export interface AdvisoryStatus {
  key: string
  status: StatusKind
  /** For MISSING: the status the advisory had before it disappeared. */
  was?: StatusKind
  /** Trusted witnesses whose latest verdict is confirm. */
  confirmers: string[]
  /** Trusted witnesses whose latest verdict is withdraw. */
  withdrawers: string[]
  /** Reached k simultaneous confirmations at some point; stays ACTIVE until a withdrawal quorum. */
  activated: boolean
  threshold: number
  /** Latest attestation per trusted issuer. */
  witnesses: AttestationRecord[]
  /** Attestations remembered from the cache that are no longer on-chain (deleted or expired). */
  vanished: AttestationRecord[]
  advisory?: AdvisoryRecord
  /** True when the advisory entity is no longer readable on-chain. */
  advisoryGone: boolean
  /** Whether the CLI/Action should enforce it (ACTIVE, or MISSING that was ACTIVE). */
  enforced: boolean
  label: string
}

export interface ResolveInput {
  issuers: string[]
  threshold: number
  /** Attestations read live, already pinned per trusted issuer with createdBy(). */
  liveAttestations: AttestationRecord[]
  /** Advisory entities read live, by key. Absent = not readable (deleted, expired or never existed). */
  liveAdvisories: Record<string, AdvisoryRecord>
  /** Previous state; omit for a stateless read (e.g. a first-time browser visit). */
  state?: MeneState
}

export interface ResolveOutput {
  statuses: AdvisoryStatus[]
  state: MeneState
}

const lc = (s: string) => s.toLowerCase()

/** Is attestation `a` newer than `b`? Block first, then attestedAt, then key for determinism. */
function newer(a: AttestationRecord, b: AttestationRecord): boolean {
  if (a.createdAt !== b.createdAt) return a.createdAt > b.createdAt
  if (a.attestedAt !== b.attestedAt) return a.attestedAt > b.attestedAt
  return a.key > b.key
}

/**
 * The quorum algorithm. Pure: no network, no clock. Given what is on-chain now and what was seen
 * before, decides each advisory's status and returns the updated state.
 */
export function resolveStatus(input: ResolveInput): ResolveOutput {
  const trusted = new Set(input.issuers.map(lc))
  const k = input.threshold
  const prev = input.state ?? emptyState()
  const state: MeneState = {
    version: 2,
    advisories: { ...prev.advisories },
    attestations: { ...prev.attestations },
    lastStatus: { ...prev.lastStatus },
    wasStatus: { ...(prev.wasStatus ?? {}) },
  }

  const liveKeys = new Set<string>()
  for (const a of input.liveAttestations) {
    if (!trusted.has(lc(a.issuer))) continue
    liveKeys.add(lc(a.key))
    state.attestations[lc(a.key)] = { ...a, key: lc(a.key), advisory: lc(a.advisory), issuer: lc(a.issuer) }
  }
  for (const [key, adv] of Object.entries(input.liveAdvisories)) {
    state.advisories[lc(key)] = adv
  }

  // Group every attestation ever seen (live + remembered) by advisory.
  const byAdvisory = new Map<string, AttestationRecord[]>()
  for (const a of Object.values(state.attestations)) {
    if (!trusted.has(a.issuer)) continue
    const list = byAdvisory.get(a.advisory) ?? []
    list.push(a)
    byAdvisory.set(a.advisory, list)
  }
  // Advisories remembered without any trusted attestation still get a row (e.g. trust list changed).
  for (const key of Object.keys(state.advisories)) if (!byAdvisory.has(key)) byAdvisory.set(key, [])

  const statuses: AdvisoryStatus[] = []
  for (const [advKey, atts] of byAdvisory) {
    const latest = new Map<string, AttestationRecord>()
    for (const a of atts) {
      const cur = latest.get(a.issuer)
      if (!cur || newer(a, cur)) latest.set(a.issuer, a)
    }
    const witnesses = [...latest.values()].sort((a, b) => a.createdAt - b.createdAt)
    const confirmers = witnesses.filter((w) => w.verdict === "confirm").map((w) => w.issuer)
    const withdrawers = witnesses.filter((w) => w.verdict === "withdraw").map((w) => w.issuer)
    // Replay verdicts in chain order. Once k witnesses confirm at the same time the advisory is
    // activated, and from then on only a withdrawal quorum undoes it: one stolen key can't bury a
    // live warning by withdrawing. Before activation, a witness may freely retract its confirm.
    const replay = new Map<string, Verdict>()
    let activated = false
    for (const a of [...atts].sort((x, y) => (newer(x, y) ? 1 : newer(y, x) ? -1 : 0))) {
      replay.set(a.issuer, a.verdict)
      if ([...replay.values()].filter((v) => v === "confirm").length >= k) activated = true
    }
    const vanished = atts.filter((a) => !liveKeys.has(a.key))

    let quorum: StatusKind
    if (withdrawers.length >= k) quorum = "WITHDRAWN"
    else if (activated) quorum = "ACTIVE"
    else quorum = "PENDING"

    const advisoryGone = !input.liveAdvisories[advKey]
    const advisory = state.advisories[advKey]
    const before = prev.lastStatus[advKey]
    let status: StatusKind = quorum
    let was: StatusKind | undefined
    if (advisoryGone && quorum !== "WITHDRAWN" && (advisory || before || atts.length > 0)) {
      // Attested or seen before, unreadable now: fail closed.
      status = "MISSING"
      was = before === "MISSING" ? (state.wasStatus[advKey] ?? quorum) : (before ?? quorum)
      state.wasStatus[advKey] = was
    } else {
      delete state.wasStatus[advKey]
    }
    state.lastStatus[advKey] = status

    const enforced = status === "ACTIVE" || (status === "MISSING" && (was === "ACTIVE" || quorum === "ACTIVE"))
    const label =
      status === "PENDING"
        ? `PENDING ${confirmers.length}/${k}`
        : status === "MISSING"
          ? `MISSING (was ${was ?? quorum})`
          : status
    statuses.push({
      key: advKey,
      status,
      was,
      confirmers,
      withdrawers,
      activated,
      threshold: k,
      witnesses,
      vanished,
      advisory,
      advisoryGone,
      enforced,
      label,
    })
  }
  statuses.sort((a, b) => (b.advisory?.createdAt ?? 0) - (a.advisory?.createdAt ?? 0))
  return { statuses, state }
}
