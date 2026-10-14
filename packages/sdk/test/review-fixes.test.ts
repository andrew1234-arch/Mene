import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"
import { toAdvisoryRecord, InvalidAdvisoryError } from "../src/arkiv"
import { parseLockfile } from "../src/lockfile"
import { inRange } from "../src/match"
import { isSafeUrl, parseOsv } from "../src/osv"

const chalk = JSON.parse(readFileSync(new URL("../../../advisories/MENE-2025-0001-chalk.osv.json", import.meta.url), "utf8"))

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
