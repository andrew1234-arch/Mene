import { appendFileSync } from "node:fs"
import { isSeverity } from "@mene/sdk"
import { matchTable, runCheck } from "../../packages/cli/src/check"
import { loadConfig } from "../../packages/cli/src/config"

const input = (name: string) => (process.env[`INPUT_${name.replace(/ /g, "_").toUpperCase()}`] ?? "").trim()
const summary = (md: string) => process.env.GITHUB_STEP_SUMMARY && appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${md}\n`)
const output = (k: string, v: string) => process.env.GITHUB_OUTPUT && appendFileSync(process.env.GITHUB_OUTPUT, `${k}=${v}\n`)

async function main() {
  if (input("issuers")) process.env.MENE_ISSUERS = input("issuers")
  if (input("threshold")) process.env.MENE_THRESHOLD = input("threshold")
  if (input("rpc-url")) process.env.MENE_RPC_URL = input("rpc-url")
  process.env.MENE_CACHE_DIR ??= `${process.env.RUNNER_TEMP ?? "/tmp"}/mene-cache`
  const sev = input("min-severity") || "low"
  if (!isSeverity(sev)) throw new Error(`invalid min-severity ${sev}`)
  const lockfile = input("lockfile") || "package-lock.json"

  const cfg = loadConfig()
  const r = await runCheck(cfg, lockfile, { minSeverity: sev })
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
    console.log(`::error file=${lockfile}::${m.package}@${m.installed} is flagged by ${m.advisoryId} (${m.status})${m.safeVersion ? `; use ${m.safeVersion}` : ""}`)
  }
  process.exitCode = 1
}

main().catch((err) => {
  console.log(`::error::Mene failed closed: ${(err as Error).message.split("\n")[0]}`)
  summary(`### Mene\n⚠️ **Failed closed**: ${(err as Error).message.split("\n")[0]}`)
  process.exitCode = 2
})
