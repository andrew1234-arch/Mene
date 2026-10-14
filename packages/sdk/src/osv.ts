import semver from "semver"
import { isSeverity, type Severity } from "./constants"

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
  database_specific?: { safe_version?: string }
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
  database_specific: {
    mene_version: 1
    severity: Severity
  }
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
      if (!r || !Array.isArray(r.events) || r.events.length === 0) fail(`affected[${i}].ranges[${j}].events must be a non-empty array`)
      if (r.type !== "SEMVER") continue
      for (const ev of r.events) {
        for (const [k, v] of Object.entries(ev ?? {})) {
          if (!["introduced", "fixed", "last_affected"].includes(k)) fail(`affected[${i}].ranges[${j}] has unknown event "${k}"`)
          if (typeof v !== "string" || (v !== "0" && !semver.valid(v))) fail(`affected[${i}].ranges[${j}] event ${k}="${String(v)}" is not semver`)
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
  const ds = a.database_specific as OsvAdvisory["database_specific"] | undefined
  if (!ds || ds.mene_version !== 1) fail("database_specific.mene_version must be 1")
  if (!isSeverity(String(ds!.severity))) fail("database_specific.severity must be low|medium|high|critical")
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

/** The first affected package — used for the `package` display attribute. */
export function primaryPackage(a: OsvAdvisory): string {
  return a.affected[0]!.package.name
}
