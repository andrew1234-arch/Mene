import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs"
import { homedir } from "node:os"
import { dirname, join, resolve } from "node:path"
import { DEFAULT_THRESHOLD, emptyState, migrateState, type MeneState, normalizeSeverity, type Severity } from "@mene/sdk"
import { DEMO_WITNESSES } from "./witnesses"

export interface MeneConfig {
  issuers: string[]
  threshold: number
  minSeverity: Severity
  rpcUrl?: string
}

const ADDRESS = /^0x[0-9a-fA-F]{40}$/

/**
 * Precedence for every field: explicit --config file > ./mene.config.json > env (MENE_ISSUERS,
 * MENE_THRESHOLD, MENE_RPC_URL) > built-in defaults (demo witnesses, 2, Tiramisu).
 * `overrides` (explicit GitHub Action inputs) beat everything.
 */
export function loadConfig(path?: string, overrides: Partial<MeneConfig> = {}): MeneConfig {
  const file = path ? resolve(path) : resolve("mene.config.json")
  let raw: Partial<MeneConfig> = {}
  if (existsSync(file)) raw = JSON.parse(readFileSync(file, "utf8"))
  else if (path) throw new Error(`config file not found: ${path}`)
  for (const [k, v] of Object.entries(overrides)) if (v !== undefined) (raw as Record<string, unknown>)[k] = v

  let issuers = raw.issuers?.length ? raw.issuers : undefined
  if (!issuers && process.env.MENE_ISSUERS) issuers = process.env.MENE_ISSUERS.split(/[\s,]+/).filter(Boolean)
  issuers ??= DEMO_WITNESSES.map((w) => w.address)
  for (const i of issuers) if (!ADDRESS.test(i)) throw new Error(`invalid issuer address: ${i}`)

  const threshold = Number(raw.threshold ?? process.env.MENE_THRESHOLD ?? DEFAULT_THRESHOLD)
  if (!Number.isInteger(threshold) || threshold < 1) throw new Error("threshold must be a positive integer")
  if (issuers.length > 0 && threshold > issuers.length) throw new Error("threshold exceeds the number of issuers")
  const minSeverity = normalizeSeverity(raw.minSeverity ?? "low")
  if (!minSeverity) throw new Error(`invalid minSeverity: ${raw.minSeverity} (use low, moderate, high or critical)`)
  return { issuers, threshold, minSeverity, rpcUrl: raw.rpcUrl ?? process.env.MENE_RPC_URL }
}

export function cachePath(): string {
  const dir = process.env.MENE_CACHE_DIR ?? join(process.env.XDG_CACHE_HOME ?? join(homedir(), ".cache"), "mene")
  return join(dir, "state.json")
}

export function loadState(): MeneState | undefined {
  const p = cachePath()
  if (!existsSync(p)) return undefined
  let s: MeneState
  try {
    s = JSON.parse(readFileSync(p, "utf8")) as MeneState
  } catch {
    // Never silently drop the anti-burial memory: that would un-count deleted confirmations.
    throw new Error(`cache ${p} is corrupt; inspect or delete it deliberately (fail closed)`)
  }
  const migrated = migrateState(s)
  if (!migrated) throw new Error(`cache ${p} is malformed or from an unknown version; inspect or delete it deliberately (fail closed)`)
  return migrated
}

export function saveState(s: MeneState): void {
  const p = cachePath()
  mkdirSync(dirname(p), { recursive: true })
  const tmp = `${p}.${process.pid}.tmp`
  writeFileSync(tmp, JSON.stringify(s, null, 2))
  renameSync(tmp, p)
}
