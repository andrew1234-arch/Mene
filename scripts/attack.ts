/**
 * The "stolen key" demo, run after `npm run seed`. Uses witness A's key as the attacker and a
 * forger wallet, then shows what Mene concludes. Appends every tx to arkiv/evidence.md.
 *   1. delete the sealed chalk advisory with A's key   -> must revert (owner is the burn address)
 *   2. delete A's own chalk confirmation               -> succeeds; clients that saw it keep counting it
 *   3. withdraw chalk with A's key                     -> one withdrawal is not a quorum: still ACTIVE
 *   4. forger publishes "chalk 5.6.0 is malicious"     -> never appears for trusted readers
 */
import { appendFileSync } from "node:fs"
import {
  attest,
  explorer,
  publicClient,
  publishAdvisory,
  readLive,
  resolveStatus,
  walletClient,
} from "../packages/sdk/src/index"
import { loadEnv, need } from "./env"

loadEnv()
const pub = publicClient()
const A = walletClient(need("MENE_ISSUER_A_KEY"))
const B = walletClient(need("MENE_ISSUER_B_KEY"))
const C = walletClient(need("MENE_ISSUER_C_KEY"))
const F = walletClient(need("MENE_FORGER_KEY"))
const issuers = [A, B, C].map((w) => w.account!.address)
const log: string[] = [`\n## Attack demo ${new Date().toISOString()}\n`]
const say = (s: string) => {
  console.log(s)
  log.push(s)
}
const status = async (state?: Parameters<typeof resolveStatus>[0]["state"]) => {
  const live = await readLive(pub, issuers)
  return resolveStatus({ issuers, threshold: 2, liveAttestations: live.attestations, liveAdvisories: live.advisories, state })
}

const before = await status()
const chalk = before.statuses.find((s) => s.advisory?.osv.id === "MENE-2025-0001")
if (!chalk) throw new Error("chalk advisory not found: run `npm run seed` first")
say(`- Before: chalk ${chalk.key} is **${chalk.label}** (confirmed by ${chalk.confirmers.length} witnesses)`)

try {
  const r = await A.deleteEntity({ entityKey: chalk.key as `0x${string}` })
  say(`- ⚠️ Deleting the sealed advisory with A's key SUCCEEDED: [\`${r.txHash}\`](${explorer.tx(r.txHash)}). The seal did not hold; see friction.md.`)
} catch (e) {
  say(`- A's key tries to delete the sealed advisory: **reverted** (${(e as Error).message.split("\n")[0]})`)
}

const mine = chalk.witnesses.find((w) => w.issuer === issuers[0]!.toLowerCase())
if (mine) {
  const r = await A.deleteEntity({ entityKey: mine.key as `0x${string}` })
  say(`- A's key deletes A's own confirmation ${mine.key}: [\`${r.txHash}\`](${explorer.tx(r.txHash)})`)
}
const afterDelete = await status(before.state)
const c2 = afterDelete.statuses.find((s) => s.key === chalk.key)!
say(`- Mene with memory of the confirmation: **${c2.label}**, ${c2.vanished.length} vanished confirmation(s) still counted`)
const fresh = (await status()).statuses.find((s) => s.key === chalk.key)
say(`- A fresh reader with no memory: **${fresh?.label ?? "not visible"}** (chain history still holds the deleted confirmation's creation tx)`)

const w = await attest(pub, A, chalk.key, "withdraw", "attacker with stolen key")
say(`- A's key withdraws chalk: [\`${w.txHash}\`](${explorer.tx(w.txHash)})`)
const afterWithdraw = (await status(afterDelete.state)).statuses.find((s) => s.key === chalk.key)!
say(`- After one withdrawal: **${afterWithdraw.label}** (a withdrawal needs a quorum too)`)

const forged = await publishAdvisory(pub, F, {
  schema_version: "1.6.0", id: "FORGED-0002", published: new Date().toISOString(), modified: new Date().toISOString(),
  summary: "FORGED: chalk 5.6.0 is malicious (it is not)",
  affected: [{ package: { ecosystem: "npm", name: "chalk" }, versions: ["5.6.0"] }],
  database_specific: { mene_version: 1, severity: "critical" },
}, { sealMode: "none" })
say(`- Forger ${F.account!.address} publishes a fake advisory ${forged.advisoryKey} with its own confirmation: [\`${forged.txHash}\`](${explorer.tx(forged.txHash)})`)
const visible = (await status()).statuses.some((s) => s.key === forged.advisoryKey.toLowerCase())
say(`- Visible to readers who trust A, B, C: **${visible ? "YES (bug!)" : "no"}**`)

appendFileSync("arkiv/evidence.md", `${log.join("\n")}\n`)
