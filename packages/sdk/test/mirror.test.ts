import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"
import { advisoryAttributes } from "../src/arkiv"
import { matchLockfile } from "../src/match"
import { coversVersion, CURATED, mirrorRecord, recommendedVersion } from "../src/mirror"
import { sourceLabel } from "../src/osv"

// Real record from ossf/malicious-packages (osv/malicious/npm/debug/MAL-2025-46974.json), Apache-2.0.
const raw = JSON.parse(readFileSync(new URL("./fixtures/ossf-MAL-2025-46974.json", import.meta.url), "utf8"))
const path = "osv/malicious/npm/debug/MAL-2025-46974.json"

describe("OpenSSF mirror", () => {
  const osv = mirrorRecord(raw, { path, recommended: "4.4.1" })
  it("keeps the record as-is apart from credits, and adds mene metadata", () => {
    expect(osv.id).toBe("MAL-2025-46974")
    expect(osv.schema_version).toBe("1.5.0")
    expect(osv.aliases).toContain("GHSA-4x49-vf9v-38px")
    expect(osv.affected[0]!.versions).toEqual(["4.4.2"])
    expect(osv.database_specific["malicious-packages-origins"]).toBeDefined()
    expect(osv.database_specific.mene).toEqual({
      severity: "critical",
      recommended: "4.4.1",
      source: { repo: "https://github.com/ossf/malicious-packages", path, license: "Apache-2.0" },
    })
    expect(sourceLabel(osv)).toBe("OpenSSF mirror")
  })
  it("removes personal data (credits with e-mail contacts)", () => {
    expect(raw.credits?.length).toBeGreaterThan(0)
    expect(osv.credits).toBeUndefined()
    expect(JSON.stringify(osv)).not.toMatch(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)
  })
  it("is matched against a lockfile like any advisory", () => {
    const m = matchLockfile([{ name: "debug", version: "4.4.2", path: "node_modules/debug" }], [{ key: "0x1", status: "ACTIVE", advisory: osv }])
    expect(m[0]).toMatchObject({ advisoryId: "MAL-2025-46974", safeVersion: "4.4.1", severity: "critical" })
  })
  it("fits Arkiv limits", () => {
    expect(new TextEncoder().encode(JSON.stringify(osv)).length).toBeLessThan(131072)
    const attrs = advisoryAttributes(osv)
    expect(Object.keys(attrs).length).toBeLessThanOrEqual(32)
    expect(attrs.pkg?.value).toBe("debug")
    expect(attrs.pkgId.value).toMatch(/^0x[0-9a-f]{64}$/)
  })
  it("selects records by the curated compromised version", () => {
    expect(coversVersion(raw, "debug", "4.4.2")).toBe(true)
    expect(coversVersion(raw, "debug", "4.4.1")).toBe(false)
    expect(CURATED.find((c) => c.name === "debug")?.version).toBe("4.4.2")
  })
  it("recommends the highest published version below the compromised one", () => {
    expect(recommendedVersion(["4.3.7", "4.4.0", "4.4.1", "4.4.3", "5.0.0-beta.1"], "4.4.2")).toBe("4.4.1")
  })
})
