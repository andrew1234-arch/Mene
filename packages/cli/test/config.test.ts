import { mkdtempSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { afterEach, describe, expect, it } from "vitest"
import { loadConfig, loadState, saveState } from "../src/config"
import { emptyState } from "@mene/sdk"

const A = "0x1111111111111111111111111111111111111111"
const B = "0x2222222222222222222222222222222222222222"
const C = "0x3333333333333333333333333333333333333333"
afterEach(() => {
  delete process.env.MENE_THRESHOLD
  delete process.env.MENE_CACHE_DIR
})

describe("config precedence", () => {
  it("file threshold beats env; overrides beat file", () => {
    const dir = mkdtempSync(join(tmpdir(), "mene-"))
    const f = join(dir, "mene.config.json")
    writeFileSync(f, JSON.stringify({ issuers: [A, B, C], threshold: 3, minSeverity: "high" }))
    process.env.MENE_THRESHOLD = "2"
    expect(loadConfig(f)).toMatchObject({ threshold: 3, minSeverity: "high" })
    expect(loadConfig(f, { threshold: 1, minSeverity: undefined })).toMatchObject({ threshold: 1, minSeverity: "high" })
  })
})

describe("cache", () => {
  it("fails closed on a corrupt cache and writes atomically", () => {
    process.env.MENE_CACHE_DIR = mkdtempSync(join(tmpdir(), "mene-cache-"))
    saveState(emptyState())
    expect(loadState()).toEqual(emptyState())
    writeFileSync(join(process.env.MENE_CACHE_DIR, "state.json"), '{"version":1,"adv')
    expect(() => loadState()).toThrow(/corrupt/)
  })
})
