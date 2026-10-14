import { spawnSync } from "node:child_process"
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"
import { parseOsv, resolveStatus, type AdvisoryRecord, type AttestationRecord } from "@mene/sdk"

const root = fileURLToPath(new URL("../../../", import.meta.url))
const A = "0x1111111111111111111111111111111111111111"
const B = "0x2222222222222222222222222222222222222222"
const KEY = `0x${"0".repeat(63)}1`

/** A cache in which chalk 5.6.1 is ACTIVE (2 of 2 confirmations). */
function cacheWithActiveChalk(): string {
  const dir = mkdtempSync(join(tmpdir(), "mene-cli-"))
  const osv = parseOsv(JSON.parse(readFileSync(join(root, "packages/sdk/test/fixtures/chalk.osv.json"), "utf8")))
  const adv: AdvisoryRecord = { key: KEY, creator: A, owner: "0x000000000000000000000000000000000000dead", createdAt: 1, expiresAt: 9e9, readonly: true, permissionlessExtension: true, osv }
  const att = (issuer: string, n: number): AttestationRecord => ({ key: `0x${"0".repeat(62)}a${n}`, advisory: KEY, issuer, verdict: "confirm", createdAt: n, attestedAt: n })
  const { state } = resolveStatus({ issuers: [A, B], threshold: 2, liveAttestations: [att(A, 1), att(B, 2)], liveAdvisories: { [KEY]: adv } })
  writeFileSync(join(dir, "state.json"), JSON.stringify(state))
  return dir
}

function mene(args: string[], cacheDir: string) {
  return spawnSync("npx", ["tsx", "packages/cli/src/index.ts", ...args], {
    cwd: root,
    encoding: "utf8",
    env: { ...process.env, MENE_CACHE_DIR: cacheDir, MENE_ISSUERS: `${A},${B}`, MENE_THRESHOLD: "2" },
  })
}

describe("mene check exit codes (offline, from cache)", { timeout: 60_000 }, () => {
  const cache = cacheWithActiveChalk()
  it("exits 1 and names the fix on the poisoned fixture", () => {
    const r = mene(["check", "--offline", "--lockfile", "examples/chalk-attack/package-lock.json"], cache)
    expect(r.status).toBe(1)
    expect(r.stdout).toContain("chalk@5.6.1")
    expect(r.stdout).toContain("use 5.6.0")
  })
  it("exits 0 on the clean fixture", () => {
    expect(mene(["check", "--offline", "--lockfile", "examples/clean/package-lock.json"], cache).status).toBe(0)
  })
  it("respects --min-severity", () => {
    // chalk is critical, so even the strictest threshold still fails
    expect(mene(["check", "--offline", "--min-severity", "critical", "--lockfile", "examples/chalk-attack/package-lock.json"], cache).status).toBe(1)
  })
  it("accepts the old word 'medium' and rejects unknown severities", () => {
    expect(mene(["check", "--offline", "--min-severity", "medium", "--lockfile", "examples/chalk-attack/package-lock.json"], cache).status).toBe(1)
    const bad = mene(["check", "--offline", "--min-severity", "urgent", "--lockfile", "examples/clean/package-lock.json"], cache)
    expect(bad.status).not.toBe(0)
    expect(bad.stderr).toContain("low, moderate, high or critical")
  })
  it("--json output is machine-readable", () => {
    const r = mene(["check", "--offline", "--json", "--lockfile", "examples/chalk-attack/package-lock.json"], cache)
    expect(JSON.parse(r.stdout).matches).toHaveLength(1)
  })
  it("fails closed (exit 2) with no cache and --offline", () => {
    const empty = mkdtempSync(join(tmpdir(), "mene-empty-"))
    const r = mene(["check", "--offline", "--lockfile", "examples/clean/package-lock.json"], empty)
    expect(r.status).toBe(2)
    expect(r.stderr).toContain("fail closed")
  })
})
