import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"
import { toAdvisoryRecord, InvalidAdvisoryError } from "../src/arkiv"
import { parseLockfile } from "../src/lockfile"
import { inRange } from "../src/match"
import { isSafeUrl, parseOsv } from "../src/osv"

const chalk = JSON.parse(readFileSync(new URL("./fixtures/chalk.osv.json", import.meta.url), "utf8"))

describe("review fixes", () => {
  it("rejects javascript: reference URLs", () => {
    expect(isSafeUrl("javascript:alert(1)")).toBe(false)
    expect(isSafeUrl("https://osv.dev")).toBe(true)
    expect(() => parseOsv({ ...chalk, references: [{ type: "WEB", url: "javascript:alert(1)" }] })).toThrow(/http/)
  })
  it("rejects non-semver range bounds instead of crashing the matcher", () => {
    const bad = { ...chalk, affected: [{ package: { ecosystem: "npm", name: "x" }, ranges: [{ type: "SEMVER", events: [{ introduced: "0" }, { fixed: "5.6" }] }] }] }
    expect(() => parseOsv(bad)).toThrow(/semver/)
    expect(inRange({ type: "SEMVER", events: [{ introduced: "0" }, { fixed: "5.6" }] }, "1.0.0")).toBe(true)
    expect(inRange({ type: "SEMVER" } as never, "1.0.0")).toBe(false)
  })
  it("treats a non-JSON payload as an invalid advisory, not a read failure", () => {
    const e = {
      key: "0x01", creator: "0x02", owner: "0x03",
      creationFlags: { readonly: true, permissionlessExtension: true },
      attributes: { project: { value: "mene-v1" }, type: { value: "advisory" } },
      toJson: () => JSON.parse("not json"),
    }
    expect(() => toAdvisoryRecord(e as never)).toThrow(InvalidAdvisoryError)
  })
  it("reads npm aliases in v1 lockfiles", () => {
    const v1 = JSON.stringify({ lockfileVersion: 1, dependencies: { "my-chalk": { version: "npm:chalk@5.6.1" }, s: { version: "npm:@a/b@1.0.0" } } })
    expect(parseLockfile(v1)).toEqual([
      { name: "chalk", version: "5.6.1", path: "node_modules/my-chalk" },
      { name: "@a/b", version: "1.0.0", path: "node_modules/s" },
    ])
  })
})

import { migrateState } from "../src/quorum"
import { normalizeSeverity } from "../src/constants"
import { mirrorRecord, PersonalDataError } from "../src/mirror"
import { recommendedOf } from "../src/osv"

describe("review fixes (hand-off v2)", () => {
  it("migrates v1 state: keeps attestations, drops old-format advisories", () => {
    const v1 = {
      version: 1,
      advisories: { "0xa": { osv: { database_specific: { mene_version: 1, severity: "critical" } } }, "0xb": { osv: { database_specific: { mene: { severity: "high" } } } } },
      attestations: { "0xc": { key: "0xc", advisory: "0xa", issuer: "0x1", verdict: "confirm", createdAt: 5, issuedAt: 7 } },
      lastStatus: { "0xa": "ACTIVE" },
    }
    const s = migrateState(v1)!
    expect(s.version).toBe(2)
    expect(Object.keys(s.advisories)).toEqual(["0xb"])
    expect(s.attestations["0xc"]!.attestedAt).toBe(7)
    expect(migrateState({ version: 9 })).toBeUndefined()
  })
  it("accepts 'medium' as 'moderate'", () => {
    expect(normalizeSeverity("medium")).toBe("moderate")
    expect(normalizeSeverity("bogus")).toBeUndefined()
  })
  it("never rewrites mirrored text: skips records that contain an e-mail address", () => {
    const raw = JSON.parse(readFileSync(new URL("./fixtures/ossf-MAL-2025-46974.json", import.meta.url), "utf8"))
    const ok = mirrorRecord({ ...raw, details: "install debug@4.4.2.tgz from git@github.com:x/y" }, { path: "p" })
    expect(ok.details).toBe("install debug@4.4.2.tgz from git@github.com:x/y")
    expect(() => mirrorRecord({ ...raw, details: "contact jane.doe@example.org" }, { path: "p" })).toThrow(PersonalDataError)
  })
  it("recommended version applies only to the primary package", () => {
    const a = { ...chalk, affected: [...chalk.affected, { package: { ecosystem: "npm", name: "chalk-template" }, versions: ["1.1.1"] }] }
    expect(recommendedOf(a, "chalk")).toBe("5.6.0")
    expect(recommendedOf(a, "chalk-template")).toBeUndefined()
  })
})
