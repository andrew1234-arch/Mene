import semver from "semver"
import { type OsvAdvisory, parseOsv } from "./osv"

export const OSSF_REPO = "https://github.com/ossf/malicious-packages"
export const OSSF_RAW = "https://raw.githubusercontent.com/ossf/malicious-packages/main"

/**
 * Curated: npm account-takeover compromises of established packages, starting with every package
 * the phished maintainer `qix` published malware into on 8 Sep 2025 (versions per the OpenSSF
 * records; each compromised version was later removed from npm). Bulk typosquat records are
 * deliberately skipped: they add volume, not value, and each entity costs gas.
 */
export const CURATED: { name: string; version: string; incident: string }[] = [
  ["chalk", "5.6.1"], ["debug", "4.4.2"], ["ansi-styles", "6.2.2"], ["supports-color", "10.2.1"],
  ["strip-ansi", "7.1.1"], ["ansi-regex", "6.2.1"], ["wrap-ansi", "9.0.1"], ["color-convert", "3.1.1"],
  ["color-name", "2.0.1"], ["is-arrayish", "0.3.3"], ["slice-ansi", "7.1.1"], ["color", "5.0.1"],
  ["color-string", "2.1.1"], ["simple-swizzle", "0.2.3"], ["supports-hyperlinks", "4.1.1"], ["has-ansi", "6.0.1"],
  ["chalk-template", "1.1.1"], ["backslash", "0.2.1"], ["error-ex", "1.3.3"],
].map(([name, version]) => ({ name: name!, version: version!, incident: "qix-2025-09-08" }))

const EMAIL = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi

/** Redacts e-mail addresses in every string of a JSON value. */
function scrub(v: unknown): unknown {
  if (typeof v === "string") return v.replace(EMAIL, "[redacted]")
  if (Array.isArray(v)) return v.map(scrub)
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, scrub(x)]))
  return v
}

/**
 * Turns an OpenSSF malicious-packages record into a Mene advisory: the original OSV JSON, minus
 * `credits` (finder names and contact e-mails are personal data, and Arkiv entities are public and
 * can't be erased), plus `database_specific.mene` with severity, recommended version and source.
 */
export function mirrorRecord(raw: unknown, opts: { path: string; recommended?: string }): OsvAdvisory {
  const rec = structuredClone(raw) as Record<string, unknown>
  delete rec.credits
  const clean = scrub(rec) as Record<string, unknown>
  const ds = (clean.database_specific ?? {}) as Record<string, unknown>
  clean.database_specific = {
    ...ds,
    mene: {
      // Malicious code (CWE-506) in a published release: always critical.
      severity: "critical",
      ...(opts.recommended ? { recommended: opts.recommended } : {}),
      source: { repo: OSSF_REPO, path: opts.path, license: "Apache-2.0" },
    },
  }
  return parseOsv(clean)
}

/** Does this OpenSSF record cover the curated compromised version? */
export function coversVersion(raw: { affected?: { package?: { name?: string }; versions?: string[] }[] }, name: string, version: string) {
  return (raw.affected ?? []).some((a) => a.package?.name === name && (a.versions ?? []).includes(version))
}

/** Highest published version below the compromised one: the version to install instead. */
export function recommendedVersion(published: string[], compromised: string): string | undefined {
  return semver.maxSatisfying(published.filter((v) => semver.valid(v) && !semver.prerelease(v)), `<${compromised}`) ?? undefined
}
