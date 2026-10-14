import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"
import { nameFromPath, parseLockfile } from "../src/lockfile"

const fixture = (p: string) => readFileSync(new URL(`../../../examples/${p}`, import.meta.url), "utf8")

describe("parseLockfile", () => {
  it("reads v3 packages including nested copies", () => {
    const pkgs = parseLockfile(fixture("chalk-attack/package-lock.json"))
    expect(pkgs).toContainEqual({ name: "chalk", version: "5.6.1", path: "node_modules/chalk" })
    expect(pkgs).toContainEqual({ name: "debug", version: "2.6.9", path: "node_modules/express/node_modules/debug" })
    expect(pkgs.find((p) => p.path === "")).toBeUndefined()
  })
  it("reads v1 dependencies", () => {
    const v1 = JSON.stringify({
      lockfileVersion: 1,
      dependencies: { a: { version: "1.0.0", dependencies: { "@s/b": { version: "2.0.0" } } } },
    })
    expect(parseLockfile(v1)).toEqual([
      { name: "a", version: "1.0.0", path: "node_modules/a" },
      { name: "@s/b", version: "2.0.0", path: "node_modules/a/node_modules/@s/b" },
    ])
  })
  it("rejects garbage", () => {
    expect(() => parseLockfile("nope")).toThrow(/JSON/)
    expect(() => parseLockfile("{}")).toThrow(/unsupported/)
  })
  it("derives names from paths", () => {
    expect(nameFromPath("node_modules/@scope/pkg")).toBe("@scope/pkg")
    expect(nameFromPath("node_modules/a/node_modules/b")).toBe("b")
    expect(nameFromPath("packages/app")).toBeNull()
  })
})
