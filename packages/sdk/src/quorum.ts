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
  /** Unix seconds, from the `issuedAt` attribute; tie-breaker within a block. */
  issuedAt: number
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
  version: 1
  advisories: Record<string, AdvisoryRecord>
  attestations: Record<string, AttestationRecord>
  /** Last status computed per advisory, so a disappearance can be reported as "was ACTIVE". */
  lastStatus: Record<string, StatusKind>
  /** For advisories currently MISSING: the status they had while still readable. */
  wasStatus: Record<string, StatusKind>
}

export function emptyState(): MeneState {
  return { version: 1, advisories: {}, attestations: {}, lastStatus: {}, wasStatus: {} }
}

export type StatusKind = "ACTIVE" | "PENDING" | "WITHDRAWN" | "MISSING"

export interface AdvisoryStatus {
  key: string
  status: StatusKind
  /** For MISSING: the status the advisory had before it disappeared. */
  was?: StatusKind
  confirmers: string[]
  withdrawers: string[]
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

/** Is attestation `a` newer than `b`? Block first, then issuedAt, then key for determinism. */
function newer(a: AttestationRecord, b: AttestationRecord): boolean {
  if (a.createdAt !== b.createdAt) return a.createdAt > b.createdAt
  if (a.issuedAt !== b.issuedAt) return a.issuedAt > b.issuedAt
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
    version: 1,
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
    const vanished = atts.filter((a) => !liveKeys.has(a.key))

    let quorum: StatusKind
    if (withdrawers.length >= k) quorum = "WITHDRAWN"
    else if (confirmers.length >= k) quorum = "ACTIVE"
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

    const enforced =
      status === "ACTIVE" || (status === "MISSING" && (was === "ACTIVE" || quorum === "ACTIVE"))
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
