import semver from "semver"
import { type Severity, isSeverity } from "./constants"

/**
 * The subset of the OpenSSF OSV schema (https://ossf.github.io/osv-schema/) that Mene writes and
 * reads. Mene-specific fields live under `database_specific`, as the schema intends.
 */
export interface OsvRange {
  type: "SEMVER" | "ECOSYSTEM"
  events: Array<{ introduced?: string; fixed?: string; last_affected?: string }>
}

export interface OsvAffected {
  package: { ecosystem: "npm"; name: string; purl?: string }
  ranges?: OsvRange[]
  versions?: string[]
  database_specific?: Record<string, unknown>
}

/** Mene's own fields, under `database_specific.mene`. Everything else in the record is plain OSV. */
export interface MeneMeta {
  severity: Severity
  /** The version to install instead of the primary (first) affected package. */
  recommended?: string
  /** Set on records mirrored from another OSV database. */
  source?: { repo: string; path: string; license: string }
}

export interface OsvAdvisory {
  schema_version: string
  id: string
  modified: string
  published: string
  withdrawn?: string
  aliases?: string[]
  summary: string
  details?: string
  affected: OsvAffected[]
  references?: Array<{ type: string; url: string }>
  credits?: unknown[]
  database_specific: { mene: MeneMeta; [key: string]: unknown }
}

export class OsvValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "OsvValidationError"
  }
}

/** Validates an unknown value as a Mene OSV advisory. Throws {@link OsvValidationError}. */
export function parseOsv(raw: unknown): OsvAdvisory {
  const fail = (m: string): never => {
    throw new OsvValidationError(m)
  }
  if (!raw || typeof raw !== "object") fail("advisory must be an object")
  const a = raw as Record<string, unknown>
  for (const f of ["schema_version", "id", "modified", "published", "summary"]) {
    if (typeof a[f] !== "string" || !(a[f] as string).length) fail(`missing string field "${f}"`)
  }
  if ((a.id as string).length > 64) fail("id longer than 64 characters")
  if (!Array.isArray(a.affected) || a.affected.length === 0) fail("affected must be a non-empty array")
  for (const [i, aff] of (a.affected as unknown[]).entries()) {
    const p = (aff as OsvAffected | undefined)?.package
    if (!p || p.ecosystem !== "npm" || typeof p.name !== "string" || !p.name) {
      fail(`affected[${i}].package must be an npm package`)
    }
    for (const [j, r] of ((aff as OsvAffected).ranges ?? []).entries()) {
      if (!r || !Array.isArray(r.events) || r.events.length === 0)
        fail(`affected[${i}].ranges[${j}].events must be a non-empty array`)
      if (r.type !== "SEMVER") continue
      for (const ev of r.events) {
        for (const [k, v] of Object.entries(ev ?? {})) {
          if (!["introduced", "fixed", "last_affected"].includes(k))
            fail(`affected[${i}].ranges[${j}] has unknown event "${k}"`)
          if (typeof v !== "string" || (v !== "0" && !semver.valid(v)))
            fail(`affected[${i}].ranges[${j}] event ${k}="${String(v)}" is not semver`)
        }
      }
    }
    const v = (aff as OsvAffected).versions
    if (v !== undefined && (!Array.isArray(v) || v.some((x) => typeof x !== "string"))) {
      fail(`affected[${i}].versions must be strings`)
    }
  }
  if (a.references !== undefined) {
    if (!Array.isArray(a.references)) fail("references must be an array")
    for (const r of a.references as Array<{ url?: unknown }>) {
      if (typeof r?.url !== "string" || !isSafeUrl(r.url)) fail(`reference URL must be http(s): ${String(r?.url)}`)
    }
  }
  const mene = (a.database_specific as { mene?: MeneMeta } | undefined)?.mene
  if (!mene || typeof mene !== "object") fail("database_specific.mene is required")
  if (!isSeverity(String(mene!.severity))) fail("database_specific.mene.severity must be low|moderate|high|critical")
  if (mene!.recommended !== undefined && !semver.valid(mene!.recommended))
    fail("database_specific.mene.recommended must be a version")
  const src = mene!.source
  if (
    src !== undefined &&
    (typeof src.repo !== "string" || typeof src.path !== "string" || typeof src.license !== "string")
  ) {
    fail("database_specific.mene.source must have repo, path and license")
  }
  return raw as OsvAdvisory
}

/** Only http(s) links may be rendered from advisory content. */
export function isSafeUrl(url: string): boolean {
  try {
    const u = new URL(url)
    return u.protocol === "https:" || u.protocol === "http:"
  } catch {
    return false
  }
}

// OsvAdvisory values have passed parseOsv, which guarantees database_specific.mene.
export const severityOf = (a: OsvAdvisory): Severity => a.database_specific.mene.severity
/** The version to install instead of `pkg` (defaults to the advisory's primary package). */
export const recommendedOf = (a: OsvAdvisory, pkg = primaryPackage(a)): string | undefined =>
  pkg === primaryPackage(a) ? a.database_specific.mene.recommended : undefined
/** "OpenSSF mirror" when mirrored from ossf/malicious-packages, else "Mene original". */
export const sourceLabel = (a: OsvAdvisory): string =>
  a.database_specific.mene.source?.repo.includes("ossf/malicious-packages")
    ? "OpenSSF mirror"
    : a.database_specific.mene.source
      ? "Mirror"
      : "Mene original"

/** The first affected package — used for the `package` display attribute. */
export function primaryPackage(a: OsvAdvisory): string {
  return a.affected[0]!.package.name
}
