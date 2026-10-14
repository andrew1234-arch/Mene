import { readFileSync } from "node:fs"
import {
  type AdvisoryStatus,
  type Match,
  type Severity,
  matchLockfile,
  parseLockfile,
  publicClient,
  readLive,
  resolveStatus,
} from "@mene/sdk"
import { type MeneConfig, loadState, saveState } from "./config"

export interface CheckResult {
  matches: Match[]
  statuses: AdvisoryStatus[]
  source: "live" | "cache"
  warnings: string[]
  blockNumber?: bigint
}

/** Reads advisories (live, falling back to the cache) and resolves quorum. Throws if neither works. */
export async function loadStatuses(
  cfg: MeneConfig,
  opts: { offline?: boolean } = {},
): Promise<Omit<CheckResult, "matches">> {
  const warnings: string[] = []
  const state = loadState()
  if (cfg.issuers.length === 0) throw new Error("no trusted issuers configured (mene.config.json or MENE_ISSUERS)")

  if (!opts.offline) {
    try {
      const live = await readLive(publicClient({ rpcUrl: cfg.rpcUrl }), cfg.issuers)
      for (const [k, why] of Object.entries(live.invalid)) warnings.push(`ignored invalid advisory ${k}: ${why}`)
      const out = resolveStatus({
        issuers: cfg.issuers,
        threshold: cfg.threshold,
        liveAttestations: live.attestations,
        liveAdvisories: live.advisories,
        state,
      })
      saveState(out.state)
      return { statuses: out.statuses, source: "live", warnings, blockNumber: live.blockNumber }
    } catch (err) {
      if (!state) throw new Error(`cannot reach Arkiv and no cache exists (fail closed): ${(err as Error).message}`)
      warnings.push(`cannot reach Arkiv, using cache: ${(err as Error).message}`)
    }
  }
  if (!state) throw new Error("--offline needs a cache; run `mene check` online once (fail closed)")
  // Offline: treat everything remembered as still live.
  const out = resolveStatus({
    issuers: cfg.issuers,
    threshold: cfg.threshold,
    liveAttestations: Object.values(state.attestations),
    liveAdvisories: state.advisories,
    state,
  })
  return { statuses: out.statuses, source: "cache", warnings }
}

export async function runCheck(
  cfg: MeneConfig,
  lockfilePath: string,
  opts: { offline?: boolean; minSeverity?: Severity } = {},
): Promise<CheckResult> {
  const installed = parseLockfile(readFileSync(lockfilePath, "utf8"))
  const loaded = await loadStatuses(cfg, opts)
  const enforced = loaded.statuses
    .filter((s) => s.enforced)
    .flatMap((s) => {
      if (!s.advisory) {
        loaded.warnings.push(
          `advisory ${s.key} is ${s.label} but its content was never cached; read it from chain history`,
        )
        return []
      }
      return [{ key: s.key, status: s.label, advisory: s.advisory.osv }]
    })
  const matches = matchLockfile(installed, enforced, opts.minSeverity ?? cfg.minSeverity)
  return { ...loaded, matches }
}

export function matchTable(matches: Match[]): string {
  const rows = [
    "| Package | Installed | Safe version | Severity | Advisory | Status |",
    "|---|---|---|---|---|---|",
    ...matches.map(
      (m) =>
        `| \`${m.package}\` | \`${m.installed}\` | ${m.safeVersion ? `\`${m.safeVersion}\`` : "—"} | ${m.severity} | ${m.advisoryId} | ${m.status} |`,
    ),
  ]
  return rows.join("\n")
}
