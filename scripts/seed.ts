/**
 * Seeds the demo state on Tiramisu and records every address/tx in arkiv/evidence.md.
 *   A publishes chalk + debug (sealed) → B confirms both → ACTIVE
 *   C publishes the synthetic false alarm → A confirms (ACTIVE) → A and C withdraw → WITHDRAWN
 *   Forger publishes a fake advisory → never appears (not a trusted creator)
 * Run: `npm run seed` (needs .env from `npx tsx scripts/keys.ts`, funded).
 */
import { appendFileSync, readFileSync, writeFileSync } from "node:fs"
import {
  attest,
  explorer,
  publicClient,
  publishAdvisory,
  upsertIssuerProfile,
  walletClient,
} from "../packages/sdk/src/index"
import { loadEnv, need } from "./env"

loadEnv()
const SEAL = (process.env.MENE_SEAL_MODE ?? "batch") as "batch" | "separate" | "none"
const pub = publicClient()
const A = walletClient(need("MENE_ISSUER_A_KEY"))
const B = walletClient(need("MENE_ISSUER_B_KEY"))
const C = walletClient(need("MENE_ISSUER_C_KEY"))
const F = walletClient(need("MENE_FORGER_KEY"))
const addr = (w: typeof A) => w.account!.address
const osv = (f: string) => JSON.parse(readFileSync(`advisories/${f}`, "utf8"))
const log: string[] = [`\n## Seed run ${new Date().toISOString()}\n`]
const note = (label: string, tx: string, extra = "") => {
  const line = `- ${label}: [\`${tx}\`](${explorer.tx(tx)})${extra}`
  log.push(line)
  console.log(line)
}

const witnesses = [
  { name: "Witness A", address: addr(A) },
  { name: "Witness B", address: addr(B) },
  { name: "Witness C", address: addr(C) },
]
log.push("| Role | Address |", "|---|---|")
for (const w of witnesses) log.push(`| ${w.name} | [\`${w.address}\`](${explorer.address(w.address)}) |`)
log.push(`| Forger (untrusted) | [\`${addr(F)}\`](${explorer.address(addr(F))}) |`, "")

for (const [w, name] of [[A, "Witness A"], [B, "Witness B"], [C, "Witness C"]] as const) {
  const r = await upsertIssuerProfile(pub, w, name)
  note(`${name} profile ${r.key}`, r.txHash)
}

const chalk = await publishAdvisory(pub, A, osv("MENE-2025-0001-chalk.osv.json"), { sealMode: SEAL })
note(`A publishes chalk advisory ${chalk.advisoryKey}`, chalk.txHash)
const debug = await publishAdvisory(pub, A, osv("MENE-2025-0002-debug.osv.json"), { sealMode: SEAL })
note(`A publishes debug advisory ${debug.advisoryKey}`, debug.txHash)
note("B confirms chalk", (await attest(pub, B, chalk.advisoryKey, "confirm")).txHash)
note("B confirms debug", (await attest(pub, B, debug.advisoryKey, "confirm")).txHash)

const fake = await publishAdvisory(pub, C, osv("MENE-2026-9001-false-alarm.osv.json"), { sealMode: SEAL })
note(`C publishes false alarm ${fake.advisoryKey}`, fake.txHash)
note("A confirms false alarm", (await attest(pub, A, fake.advisoryKey, "confirm")).txHash)
note("A withdraws false alarm", (await attest(pub, A, fake.advisoryKey, "withdraw", "synthetic package, demo false alarm")).txHash)
note("C withdraws false alarm", (await attest(pub, C, fake.advisoryKey, "withdraw", "synthetic package, demo false alarm")).txHash)

const forged = await publishAdvisory(pub, F, { ...osv("MENE-2025-0001-chalk.osv.json"), id: "FORGED-0001", summary: "FORGED: chalk 5.6.0 is malicious (it is not)" }, { sealMode: "none" })
note(`Forger publishes fake advisory ${forged.advisoryKey} (must never appear)`, forged.txHash)

appendFileSync("arkiv/evidence.md", `${log.join("\n")}\n`)
writeFileSync(
  "packages/cli/src/witnesses.ts",
  `/** The three demo witnesses (team-controlled Tiramisu testnet wallets), written by scripts/seed.ts. */\nexport const DEMO_WITNESSES: { name: string; address: string }[] = ${JSON.stringify(witnesses, null, 2)}\n`,
)
writeFileSync("site/src/data/witnesses.json", `${JSON.stringify(witnesses, null, 2)}\n`)
console.log("\nWrote arkiv/evidence.md, packages/cli/src/witnesses.ts, site/src/data/witnesses.json")
