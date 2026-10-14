/**
 * Seeds the Mene-original demo flows on Tiramisu and records every address/tx in arkiv/evidence.md.
 * Run `npm run mirror` first: chalk and debug come from the OpenSSF mirror (TASKS.md, Task 4).
 *   C inscribes MENE-2026-0001 (synthetic package) → A confirms → A and C withdraw → WITHDRAWN
 *   The keeper (an untrusted wallet) publishes a forged advisory → never appears for trusted readers
 * Then writes the witness addresses into the CLI defaults and the site, and rebuilds the Action.
 */
import { execSync } from "node:child_process"
import { appendFileSync, readFileSync, writeFileSync } from "node:fs"
import { attest, explorer, publicClient, publishAdvisory, walletClient } from "../packages/sdk/src/index"
import { loadEnv, need } from "./env"

loadEnv()
const SEAL = (process.env.MENE_SEAL_MODE || "batch") as "batch" | "separate" | "none"
if (!["batch", "separate", "none"].includes(SEAL)) throw new Error(`MENE_SEAL_MODE must be batch, separate or none, got ${SEAL}`)
const pub = publicClient()
const A = walletClient(need("MENE_ISSUER_A_KEY"))
const B = walletClient(need("MENE_ISSUER_B_KEY"))
const C = walletClient(need("MENE_ISSUER_C_KEY"))
const K = walletClient(need("MENE_KEEPER_KEY"))
const addr = (w: typeof A) => w.account!.address

appendFileSync("arkiv/evidence.md", `\n## Seed run ${new Date().toISOString()}\n\n`)
const out = (s: string) => {
  console.log(s)
  appendFileSync("arkiv/evidence.md", `${s}\n`)
}
const note = (label: string, tx: string) => out(`- ${label}: [\`${tx}\`](${explorer.tx(tx)})`)

const witnesses = [
  { name: "Witness A", address: addr(A) },
  { name: "Witness B", address: addr(B) },
  { name: "Witness C", address: addr(C) },
]
out("| Role | Address |\n|---|---|")
for (const w of witnesses) out(`| ${w.name} (trusted) | [\`${w.address}\`](${explorer.address(w.address)}) |`)
out(`| Keeper (untrusted: Lifetime Extension, forgery demo) | [\`${addr(K)}\`](${explorer.address(addr(K))}) |\n`)

const fa = JSON.parse(readFileSync("advisories/MENE-2026-0001-false-alarm.osv.json", "utf8"))
fa.published = fa.modified = new Date().toISOString().replace(/\.\d+Z$/, "Z")
const fake = await publishAdvisory(pub, C, fa, { sealMode: SEAL })
note(`C inscribes MENE-2026-0001 (synthetic false alarm) → \`${fake.advisoryKey}\``, fake.txHash)
note("A confirms MENE-2026-0001", (await attest(A, fake.advisoryKey, "confirm")).txHash)
note("A withdraws MENE-2026-0001", (await attest(A, fake.advisoryKey, "withdraw", "synthetic package, demo false alarm")).txHash)
note("C withdraws MENE-2026-0001", (await attest(C, fake.advisoryKey, "withdraw", "synthetic package, demo false alarm")).txHash)

const now = new Date().toISOString().replace(/\.\d+Z$/, "Z")
const forged = await publishAdvisory(pub, K, {
  schema_version: "1.6.0", id: "FORGED-0001", published: now, modified: now,
  summary: "FORGED: chalk 5.6.0 is malicious (it is not)",
  affected: [{ package: { ecosystem: "npm", name: "chalk" }, versions: ["5.6.0"] }],
  database_specific: { mene: { severity: "critical" } },
}, { sealMode: "none" })
note(`Keeper (untrusted) publishes a forged advisory \`${forged.advisoryKey}\` (must never appear)`, forged.txHash)

writeFileSync(
  "packages/cli/src/witnesses.ts",
  `/** The three demo witnesses (team-controlled Tiramisu testnet wallets), written by scripts/seed.ts. */\nexport const DEMO_WITNESSES: { name: string; address: string }[] = ${JSON.stringify(witnesses, null, 2)}\n`,
)
writeFileSync("site/src/data/witnesses.json", `${JSON.stringify(witnesses, null, 2)}\n`)
// The Action bundles DEMO_WITNESSES at build time; rebuild so action/dist carries the real addresses.
execSync("npm run build:action", { stdio: "inherit" })
console.log("\nWrote arkiv/evidence.md, packages/cli/src/witnesses.ts, site/src/data/witnesses.json, action/dist")
