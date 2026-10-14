import { appendFileSync } from "node:fs"
import { loadConfig, matchTable, runCheck } from "@mene/cli/lib"
import { normalizeSeverity } from "@mene/sdk"

const input = (name: string) => (process.env[`INPUT_${name.replace(/ /g, "_").toUpperCase()}`] ?? "").trim()
const summary = (md: string) =>
  process.env.GITHUB_STEP_SUMMARY && appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${md}\n`)
const output = (k: string, v: string) =>
  process.env.GITHUB_OUTPUT && appendFileSync(process.env.GITHUB_OUTPUT, `${k}=${v}\n`)

async function main() {
  process.env.MENE_CACHE_DIR ??= `${process.env.RUNNER_TEMP ?? "/tmp"}/mene-cache`
  const sevInput = input("min-severity")
  const sev = sevInput ? normalizeSeverity(sevInput) : undefined
  if (sevInput && !sev) throw new Error(`invalid min-severity ${sevInput} (use low, moderate, high or critical)`)
  const lockfile = input("lockfile") || "package-lock.json"

  const cfg = loadConfig(undefined, {
    issuers: input("issuers")
      ? input("issuers")
          .split(/[\s,]+/)
          .filter(Boolean)
      : undefined,
    threshold: input("threshold") ? Number(input("threshold")) : undefined,
    minSeverity: sev,
    rpcUrl: input("rpc-url") || undefined,
  })
  const r = await runCheck(cfg, lockfile)
  for (const w of r.warnings) console.log(`::warning::${w}`)
  output("matches", String(r.matches.length))
  const head = `### Mene · \`${lockfile}\`\n${r.statuses.length} advisories, ${r.statuses.filter((s) => s.enforced).length} enforced · quorum ${cfg.threshold}/${cfg.issuers.length} · source: ${r.source}${r.blockNumber ? ` @ block ${r.blockNumber}` : ""}\n`
  if (r.matches.length === 0) {
    summary(`${head}\n✅ **Clean** — no enforced advisory matches this lockfile.`)
    console.log("Mene: clean")
    return
  }
  summary(`${head}\n❌ **${r.matches.length} poisoned package(s)**\n\n${matchTable(r.matches)}`)
  for (const m of r.matches) {
    console.log(
      `::error file=${lockfile}::${m.package}@${m.installed} is flagged by ${m.advisoryId} (${m.status})${m.safeVersion ? `; use ${m.safeVersion}` : ""}`,
    )
  }
  process.exitCode = 1
}

main().catch((err) => {
  console.log(`::error::Mene failed closed: ${(err as Error).message.split("\n")[0]}`)
  summary(`### Mene\n⚠️ **Failed closed**: ${(err as Error).message.split("\n")[0]}`)
  process.exitCode = 2
})
