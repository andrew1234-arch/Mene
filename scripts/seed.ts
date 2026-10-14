/**
 * Seeds the Mene-original demo flows on Tiramisu and records every address/tx in arkiv/evidence.md.
 * Run `npm run mirror` first: chalk and debug come from the OpenSSF mirror (docs/TASKS.md, Task 4).
 *   C inscribes MENE-2026-0001 (synthetic package) → A confirms → A and C withdraw → WITHDRAWN
 *   The keeper (an untrusted wallet) publishes a forged advisory → never appears for trusted readers
 * Then writes the witness addresses into the CLI defaults and the site, and rebuilds the Action.
 */
import { execSync } from "node:child_process"
import { appendFileSync, readFileSync, writeFileSync } from "node:fs"
import { and, eq } from "@arkiv-network/sdk/query"
import {
  PROJECT,
  attest,
  ensureSealed,
  explorer,
  latestVerdict,
  publicClient,
  publishAdvisory,
  walletClient,
} from "../packages/sdk/src/index"
import { loadEnv, need } from "./env"

loadEnv()
const SEAL = (process.env.MENE_SEAL_MODE || "batch") as "batch" | "separate" | "none"
if (!["batch", "separate", "none"].includes(SEAL))
  throw new Error(`MENE_SEAL_MODE must be batch, separate or none, got ${SEAL}`)
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

/** Already inscribed by this wallet? Re-runs must not create duplicate (sealed, undeletable) copies. */
async function inscribed(w: typeof A, id: string) {
  const page = await pub
    .select({ key: true })
    .where(and(eq("project", PROJECT), eq("type", "advisory"), eq("advisoryId", id)))
    .createdBy(addr(w))
    .limit(1)
    .fetch()
  return page.entities[0]?.key
}

const fa = JSON.parse(readFileSync("advisories/MENE-2026-0001-false-alarm.osv.json", "utf8"))
// Every step is resumable: an interrupted run picks up where it stopped.
let fakeKey = await inscribed(C, fa.id)
if (fakeKey) {
  out(`- MENE-2026-0001 already inscribed by C as \`${fakeKey}\`; resuming`)
  if (SEAL !== "none") {
    const sealTx = await ensureSealed(pub, C, fakeKey)
    if (sealTx) note("C seals MENE-2026-0001 (resumed)", sealTx)
  }
} else {
  const fake = await publishAdvisory(pub, C, fa, { sealMode: SEAL })
  fakeKey = fake.advisoryKey
  note(`C inscribes MENE-2026-0001 (synthetic false alarm) → \`${fake.advisoryKey}\``, fake.txHash)
}
const reason = "synthetic package, demo false alarm"
// A confirms first (so the withdrawal has something to undo), then A and C withdraw.
if ((await latestVerdict(pub, addr(A), fakeKey)) === undefined)
  note("A confirms MENE-2026-0001", (await attest(A, fakeKey, "confirm")).txHash)
if ((await latestVerdict(pub, addr(A), fakeKey)) !== "withdraw")
  note("A withdraws MENE-2026-0001", (await attest(A, fakeKey, "withdraw", reason)).txHash)
if ((await latestVerdict(pub, addr(C), fakeKey)) !== "withdraw")
  note("C withdraws MENE-2026-0001", (await attest(C, fakeKey, "withdraw", reason)).txHash)

const now = new Date().toISOString().replace(/\.\d+Z$/, "Z")
const existingForged = await inscribed(K, "FORGED-0001")
if (existingForged) out(`- FORGED-0001 already published by the keeper as \`${existingForged}\`; skipped`)
else {
  const forged = await publishAdvisory(
    pub,
    K,
    {
      schema_version: "1.6.0",
      id: "FORGED-0001",
      published: now,
      modified: now,
      summary: "FORGED: chalk 5.6.0 is malicious (it is not)",
      affected: [{ package: { ecosystem: "npm", name: "chalk" }, versions: ["5.6.0"] }],
      database_specific: { mene: { severity: "critical" } },
    },
    { sealMode: "none" },
  )
  note(`Keeper (untrusted) publishes a forged advisory \`${forged.advisoryKey}\` (must never appear)`, forged.txHash)
}

writeFileSync(
  "packages/cli/src/witnesses.ts",
  `/** The three demo witnesses (team-controlled Tiramisu testnet wallets), written by scripts/seed.ts. */\nexport const DEMO_WITNESSES: { name: string; address: string }[] = ${JSON.stringify(witnesses, null, 2)}\n`,
)
writeFileSync("site/src/data/witnesses.json", `${JSON.stringify(witnesses, null, 2)}\n`)
// The Action bundles DEMO_WITNESSES at build time; rebuild so action/dist carries the real addresses.
execSync("npm run build:action", { stdio: "inherit" })
console.log("\nWrote arkiv/evidence.md, packages/cli/src/witnesses.ts, site/src/data/witnesses.json, action/dist")
