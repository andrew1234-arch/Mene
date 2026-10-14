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

// An e-mail address: domain labels start with a letter, so `debug@4.4.2.tgz` is not one.
const EMAIL = /[A-Z0-9._%+-]+@[A-Z][A-Z0-9-]*(\.[A-Z][A-Z0-9-]*)*\.[A-Z]{2,}/i
// Not personal: git remotes and npm's own addresses.
const NOT_PERSONAL = /^(git@github\.com|git@gitlab\.com|support@npmjs\.com|security@npmjs\.com)$/i

export class PersonalDataError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "PersonalDataError"
  }
}

/** Finds an e-mail-like string anywhere in a JSON value (path for the error message). */
function findEmail(v: unknown, path = "$"): string | undefined {
  if (typeof v === "string") {
    for (const m of v.matchAll(new RegExp(EMAIL.source, "gi"))) if (!NOT_PERSONAL.test(m[0])) return `${path}: ${m[0]}`
    return undefined
  }
  if (Array.isArray(v)) {
    for (const [i, x] of v.entries()) {
      const f = findEmail(x, `${path}[${i}]`)
      if (f) return f
    }
    return undefined
  }
  if (v && typeof v === "object") {
    for (const [k, x] of Object.entries(v)) {
      const f = findEmail(x, `${path}.${k}`)
      if (f) return f
    }
  }
  return undefined
}

/**
 * Turns an OpenSSF malicious-packages record into a Mene advisory: the original OSV JSON, minus
 * `credits` (finder names and contact e-mails are personal data, and Arkiv entities are public and
 * can't be erased), plus `database_specific.mene` with severity, recommended version and source.
 * Nothing else is rewritten: if an e-mail address appears anywhere else, it throws
 * {@link PersonalDataError} and the record is skipped rather than altered.
 */
export function mirrorRecord(raw: unknown, opts: { path: string; recommended?: string }): OsvAdvisory {
  const clean = structuredClone(raw) as Record<string, unknown>
  delete clean.credits
  const found = findEmail(clean)
  if (found) throw new PersonalDataError(`record contains an e-mail address (${found}); not mirrored`)
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
