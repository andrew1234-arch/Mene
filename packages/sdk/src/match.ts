import semver from "semver"
import { type Severity, SEVERITIES } from "./constants"
import type { InstalledPackage } from "./lockfile"
import type { OsvAdvisory, OsvAffected, OsvRange } from "./osv"

export interface Match {
  advisoryId: string
  advisoryKey: string
  package: string
  installed: string
  path: string
  severity: Severity
  status: string
  safeVersion?: string
  summary: string
}

/** Whether `version` is affected by one OSV `affected` entry (exact versions list or SEMVER ranges). */
export function isAffected(aff: OsvAffected, version: string): boolean {
  if (aff.versions?.includes(version)) return true
  if (!semver.valid(version)) return false
  return (aff.ranges ?? []).some((r) => inRange(r, version))
}

/** Evaluates an OSV SEMVER range: sorted introduced/fixed/last_affected events. */
export function inRange(range: OsvRange, version: string): boolean {
  if (range.type !== "SEMVER" || !Array.isArray(range.events)) return false
  const ok = (v: string | undefined) => v !== undefined && (v === "0" || semver.valid(v) !== null)
  let affected = false
  const events = [...range.events].sort((a, b) => {
    const va = eventVersion(a)
    const vb = eventVersion(b)
    return semver.compare(va, vb)
  })
  for (const ev of events) {
    if (ev.introduced !== undefined) {
      if (!ok(ev.introduced)) continue
      const v = ev.introduced === "0" ? "0.0.0" : ev.introduced
      if (semver.gte(version, v)) affected = true
    } else if (ev.fixed !== undefined) {
      if (!ok(ev.fixed)) continue
      if (semver.gte(version, ev.fixed)) affected = false
    } else if (ev.last_affected !== undefined) {
      if (!ok(ev.last_affected)) continue
      if (semver.gt(version, ev.last_affected)) affected = false
    }
  }
  return affected
}

function eventVersion(ev: { introduced?: string; fixed?: string; last_affected?: string }): string {
  const v = ev.introduced ?? ev.fixed ?? ev.last_affected ?? "0.0.0"
  return v === "0" ? "0.0.0" : (semver.valid(v) ?? "0.0.0")
}

export interface EnforcedAdvisory {
  key: string
  status: string
  advisory: OsvAdvisory
}

/**
 * Matches installed packages against advisories that are enforced (ACTIVE or MISSING). Matching runs
 * entirely locally: no package name ever leaves the machine.
 */
export function matchLockfile(
  installed: InstalledPackage[],
  advisories: EnforcedAdvisory[],
  minSeverity: Severity = "low",
): Match[] {
  const min = SEVERITIES.indexOf(minSeverity)
  const byName = new Map<string, InstalledPackage[]>()
  for (const p of installed) {
    const list = byName.get(p.name) ?? []
    list.push(p)
    byName.set(p.name, list)
  }
  const out: Match[] = []
  for (const { key, status, advisory } of advisories) {
    const severity = advisory.database_specific.severity
    if (SEVERITIES.indexOf(severity) < min) continue
    if (advisory.withdrawn) continue
    for (const aff of advisory.affected) {
      for (const p of byName.get(aff.package.name) ?? []) {
        if (!isAffected(aff, p.version)) continue
        out.push({
          advisoryId: advisory.id,
          advisoryKey: key,
          package: p.name,
          installed: p.version,
          path: p.path,
          severity,
          status,
          safeVersion: aff.database_specific?.safe_version,
          summary: advisory.summary,
        })
      }
    }
  }
  return out
}

export interface FixPlan {
  /** `npm install a@1.0.0 b@2.0.0` for direct dependencies, or null if none. */
  install: string | null
  /** Entries for package.json "overrides" (transitive copies). */
  overrides: Record<string, string>
  /** Packages flagged with no known safe version. */
  unresolved: string[]
}

/**
 * Turns matches into copy-pasteable remediation: direct deps get pinned, transitive ones overridden.
 * Pass the enforced advisories so a suggested safe version is never one another advisory flags.
 */
export function planFixes(matches: Match[], direct: Set<string> | null, advisories: EnforcedAdvisory[] = []): FixPlan {
  const byPkg = new Map<string, Match[]>()
  for (const m of matches) byPkg.set(m.package, [...(byPkg.get(m.package) ?? []), m])
  const install: string[] = []
  const overrides: Record<string, string> = {}
  const unresolved: string[] = []
  for (const [pkg, ms] of byPkg) {
    const flagged = (v: string) =>
      advisories.some((a) => a.advisory.affected.some((aff) => aff.package.name === pkg && isAffected(aff, v)))
    const candidates = [...new Set(ms.map((m) => m.safeVersion).filter((v): v is string => !!v))]
    const safe = candidates.find((v) => !flagged(v))
    if (!safe) {
      unresolved.push(pkg)
      continue
    }
    const topMatched = ms.some((m) => m.path === `node_modules/${pkg}`)
    const nested = ms.some((m) => m.path !== `node_modules/${pkg}`)
    const isDirect = direct === null ? topMatched : direct.has(pkg)
    if (topMatched) install.push(`${pkg}@${safe}`)
    // npm rejects an override that conflicts with a direct dependency unless it is written "$name".
    if (nested) overrides[pkg] = isDirect ? `$${pkg}` : safe
  }
  return { install: install.length ? `npm install ${install.join(" ")}` : null, overrides, unresolved }
}
