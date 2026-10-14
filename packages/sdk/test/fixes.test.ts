import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"
import { directDependencies } from "../src/lockfile"
import { type Match, planFixes } from "../src/match"

const m = (pkg: string, path: string, safe?: string): Match => ({
  advisoryId: "X",
  advisoryKey: "0x1",
  package: pkg,
  installed: "1.0.0",
  path,
  severity: "critical",
  status: "ACTIVE",
  safeVersion: safe,
  summary: "",
})

describe("planFixes", () => {
  it("pins direct deps, overrides transitive ones, lists unknowns", () => {
    const plan = planFixes(
      [
        m("chalk", "node_modules/chalk", "5.6.0"),
        m("debug", "node_modules/express/node_modules/debug", "4.4.1"),
        m("evil", "node_modules/evil"),
      ],
      new Set(["chalk"]),
    )
    expect(plan).toEqual({ install: "npm install chalk@5.6.0", overrides: { debug: "4.4.1" }, unresolved: ["evil"] })
  })
  it("uses $name when a direct dep also has nested copies", () => {
    const plan = planFixes(
      [m("chalk", "node_modules/chalk", "5.6.0"), m("chalk", "node_modules/a/node_modules/chalk", "5.6.0")],
      new Set(["chalk"]),
    )
    expect(plan.overrides).toEqual({ chalk: "$chalk" })
  })
  it("uses $name when only nested copies of a direct dep are affected", () => {
    const plan = planFixes([m("debug", "node_modules/express/node_modules/debug", "4.4.1")], new Set(["debug"]))
    expect(plan).toEqual({ install: null, overrides: { debug: "$debug" }, unresolved: [] })
  })
  it("never suggests a safe version another advisory flags", () => {
    const adv = (versions: string[]) =>
      ({
        key: "0x2",
        status: "ACTIVE",
        advisory: { affected: [{ package: { ecosystem: "npm", name: "chalk" }, versions }] },
      }) as never
    const ms = [m("chalk", "node_modules/chalk", "5.6.2"), m("chalk", "node_modules/chalk", "5.6.0")]
    expect(planFixes(ms, null, [adv(["5.6.1", "5.6.2"])]).install).toBe("npm install chalk@5.6.0")
    expect(planFixes([ms[0]!], null, [adv(["5.6.2"])]).unresolved).toEqual(["chalk"])
  })
  it("reads root dependencies from the fixture", () => {
    const text = readFileSync(new URL("../../../examples/chalk-attack/package-lock.json", import.meta.url), "utf8")
    expect([...directDependencies(text)!].sort()).toEqual(["chalk", "debug", "express"])
  })
})
