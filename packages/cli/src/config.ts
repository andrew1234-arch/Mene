import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { homedir } from "node:os"
import { dirname, join, resolve } from "node:path"
import { DEFAULT_THRESHOLD, emptyState, isSeverity, type MeneState, type Severity } from "@mene/sdk"
import { DEMO_WITNESSES } from "./witnesses"

export interface MeneConfig {
  issuers: string[]
  threshold: number
  minSeverity: Severity
  rpcUrl?: string
}

const ADDRESS = /^0x[0-9a-fA-F]{40}$/

/** Precedence: explicit file > ./mene.config.json > env MENE_ISSUERS > built-in demo witnesses. */
export function loadConfig(path?: string): MeneConfig {
  const file = path ? resolve(path) : resolve("mene.config.json")
  let raw: Partial<MeneConfig> = {}
  if (existsSync(file)) raw = JSON.parse(readFileSync(file, "utf8"))
  else if (path) throw new Error(`config file not found: ${path}`)

  let issuers = raw.issuers?.length ? raw.issuers : undefined
  if (!issuers && process.env.MENE_ISSUERS) issuers = process.env.MENE_ISSUERS.split(/[\s,]+/).filter(Boolean)
  issuers ??= DEMO_WITNESSES.map((w) => w.address)
  for (const i of issuers) if (!ADDRESS.test(i)) throw new Error(`invalid issuer address: ${i}`)

  const threshold = Number(process.env.MENE_THRESHOLD ?? raw.threshold ?? DEFAULT_THRESHOLD)
  if (!Number.isInteger(threshold) || threshold < 1) throw new Error("threshold must be a positive integer")
  if (issuers.length > 0 && threshold > issuers.length) throw new Error("threshold exceeds the number of issuers")
  const minSeverity = raw.minSeverity ?? "low"
  if (!isSeverity(minSeverity)) throw new Error(`invalid minSeverity: ${minSeverity}`)
  return { issuers, threshold, minSeverity, rpcUrl: process.env.MENE_RPC_URL ?? raw.rpcUrl }
}

export function cachePath(): string {
  const dir = process.env.MENE_CACHE_DIR ?? join(process.env.XDG_CACHE_HOME ?? join(homedir(), ".cache"), "mene")
  return join(dir, "state.json")
}

export function loadState(): MeneState | undefined {
  const p = cachePath()
  if (!existsSync(p)) return undefined
  try {
    const s = JSON.parse(readFileSync(p, "utf8")) as MeneState
    return s.version === 1 ? { ...emptyState(), ...s } : undefined
  } catch {
    return undefined
  }
}

export function saveState(s: MeneState): void {
  const p = cachePath()
  mkdirSync(dirname(p), { recursive: true })
  writeFileSync(p, JSON.stringify(s, null, 2))
}
