import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"
import { parseLockfile } from "../src/lockfile"
import { inRange, matchLockfile } from "../src/match"
import { parseOsv } from "../src/osv"

const read = (p: string) => readFileSync(new URL(`../../../${p}`, import.meta.url), "utf8")
const chalk = parseOsv(JSON.parse(read("advisories/MENE-2025-0001-chalk.osv.json")))
const debug = parseOsv(JSON.parse(read("advisories/MENE-2025-0002-debug.osv.json")))
const fake = parseOsv(JSON.parse(read("advisories/MENE-2026-9001-false-alarm.osv.json")))
const enforced = [
  { key: "0x01", status: "ACTIVE", advisory: chalk },
  { key: "0x02", status: "ACTIVE", advisory: debug },
]

describe("matchLockfile", () => {
  it("flags the chalk attack fixture", () => {
    const m = matchLockfile(parseLockfile(read("examples/chalk-attack/package-lock.json")), enforced)
    expect(m.map((x) => `${x.package}@${x.installed}`).sort()).toEqual(["chalk@5.6.1", "debug@4.4.2"])
    expect(m.find((x) => x.package === "chalk")?.safeVersion).toBe("5.6.0")
  })
  it("passes the clean fixture", () => {
    expect(matchLockfile(parseLockfile(read("examples/clean/package-lock.json")), enforced)).toEqual([])
  })
  it("respects min severity", () => {
    const m = matchLockfile([{ name: "@mene-demo/false-alarm", version: "1.0.1", path: "x" }], [
      { key: "0x03", status: "ACTIVE", advisory: fake },
    ], "high")
    expect(m).toEqual([])
  })
})

describe("OSV SEMVER ranges", () => {
  const r = { type: "SEMVER" as const, events: [{ introduced: "1.0.0" }, { fixed: "1.0.3" }] }
  it.each([
    ["0.9.9", false],
    ["1.0.0", true],
    ["1.0.2", true],
    ["1.0.3", false],
  ])("%s → %s", (v, want) => expect(inRange(r, v)).toBe(want))
  it("handles introduced 0 and last_affected", () => {
    const r2 = { type: "SEMVER" as const, events: [{ introduced: "0" }, { last_affected: "2.0.0" }] }
    expect(inRange(r2, "2.0.0")).toBe(true)
    expect(inRange(r2, "2.0.1")).toBe(false)
  })
})

describe("parseOsv", () => {
  it("rejects bad severity", () => {
    expect(() => parseOsv({ ...chalk, database_specific: { mene_version: 1, severity: "meh" } })).toThrow(/severity/)
  })
  it("rejects non-npm", () => {
    expect(() => parseOsv({ ...chalk, affected: [{ package: { ecosystem: "PyPI", name: "x" } }] })).toThrow(/npm/)
  })
})
