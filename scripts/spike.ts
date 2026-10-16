/**
 * On-chain spikes. Run: `npm run spike` (needs funded MENE_ISSUER_A_KEY and
 * MENE_KEEPER_KEY). Prints PASS/FAIL, evidence (tx hash / revert reason) and GLM spent per
 * operation, then appends a markdown summary to arkiv/friction.md.
 */
import { appendFileSync } from "node:fs"
import { ExpirationTime, jsonToPayload } from "@arkiv-network/sdk"
import { i32, str } from "@arkiv-network/sdk/attr"
import { and, eq, gte } from "@arkiv-network/sdk/query"
import { type Hex, formatEther } from "viem"
import { BURN_ADDRESS, TIRAMISU, publicClient, walletClient } from "../packages/sdk/src/index"
import { loadEnv, need } from "./env"

loadEnv()
const SDK = "@arkiv-network/sdk 0.8.1"
const rows: string[] = []
let ok = true
const pub = publicClient()
const ws = publicClient({ ws: true })
const A = walletClient(need("MENE_ISSUER_A_KEY"))
const K = walletClient(need("MENE_KEEPER_KEY"))
const me = A.account!.address

async function cost(tx: Hex) {
  const r = await pub.getTransactionReceipt({ hash: tx })
  return `${formatEther(r.gasUsed * r.effectiveGasPrice)} GLM (gas ${r.gasUsed})`
}
async function spike(id: string, expected: string, fn: () => Promise<string>) {
  try {
    const actual = await fn()
    rows.push(`| ${id} | ✅ | ${expected} | ${actual} |`)
    console.log(`PASS ${id}: ${actual}`)
  } catch (e) {
    ok = false
    const msg = (e as Error).message.split("\n")[0]!
    rows.push(`| ${id} | ❌ | ${expected} | ${msg} |`)
    console.log(`FAIL ${id}: ${msg}`)
  }
}
const revertOf = async (p: Promise<unknown>) => {
  try {
    await p
  } catch (e) {
    return (e as Error).message.split("\n")[0]!
  }
  throw new Error("expected a revert, but the transaction succeeded")
}
const base = (days = 1, flags = { readonly: true, permissionlessExtension: true }, salt?: bigint) => ({
  payload: jsonToPayload({ spike: true, at: Date.now() }),
  contentType: "application/json",
  expires: ExpirationTime.fromDays(days),
  attributes: { project: str("mene-spike"), type: str("spike"), severity: i32(3) },
  flags,
  ...(salt !== undefined ? { salt } : {}),
})

await spike("S0 chain", "chain id 7738577", async () => {
  const id = await pub.getChainId()
  if (id !== TIRAMISU.chainId) throw new Error(`chain id ${id}`)
  return `chain ${id}`
})

let sealed: Hex | undefined
await spike(
  "S1 seal in one batch",
  "create advisory + attestation + ownership → burn in one executeBatch; owner = 0x…dEaD",
  async () => {
    const [adv, att] = await pub.predictEntityKeys({ owner: me, count: 2 })
    const r = await A.executeBatch({
      creates: [
        base(1, undefined, adv.salt),
        { ...base(1, undefined, att.salt), attributes: { project: str("mene-spike"), type: str("spike-att") } },
      ],
      ownershipChanges: [{ entityKey: adv.key, newOwner: BURN_ADDRESS }],
    })
    if (r.createdEntities[0]?.toLowerCase() !== adv.key.toLowerCase())
      throw new Error(`predicted ${adv.key}, got ${r.createdEntities[0]}`)
    const e = await pub.getEntity(adv.key)
    if (e.owner.toLowerCase() !== BURN_ADDRESS.toLowerCase()) throw new Error(`owner is ${e.owner}`)
    sealed = adv.key
    return `tx ${r.txHash}, owner burn, ${await cost(r.txHash)}`
  },
)
await spike("S1b original key deletes sealed entity", "revert", async () => {
  if (!sealed) throw new Error("S1 failed")
  return `reverted: ${await revertOf(A.deleteEntity({ entityKey: sealed }))}`
})

await spike("S2a keeper extends permissionless entity", "success", async () => {
  if (!sealed) throw new Error("S1 failed")
  const r = await K.extendEntity({ entityKey: sealed, expires: ExpirationTime.fromDays(2) })
  return `tx ${r.txHash}, ${await cost(r.txHash)}`
})
await spike("S2b keeper extends a normal entity", "revert", async () => {
  const r = await A.createEntity(base(1, { readonly: false, permissionlessExtension: false }))
  return `reverted: ${await revertOf(K.extendEntity({ entityKey: r.entityKey, expires: ExpirationTime.fromDays(2) }))}`
})

await spike("S3 patch readonly entity", "revert", async () => {
  const r = await A.createEntity(base())
  return `reverted: ${await revertOf(A.patchEntity({ entityKey: r.entityKey, set: { type: str("tampered") } }))}`
})

await spike(
  "S4 createdBy, range, cursor",
  "look-alike from keeper excluded; gte(severity, i32(3)) matches; cursor pages",
  async () => {
    await K.createEntity(base()) // look-alike from an untrusted wallet
    await A.createEntity(base())
    const q = () =>
      pub
        .select({ key: true, creator: true })
        .where(and(eq("project", "mene-spike"), gte("severity", i32(3))))
        .createdBy(me)
        .limit(1)
    let page = await q().fetch()
    const all = [...page.entities]
    let pages = 1
    while (page.hasNextPage() && pages < 5) {
      page = await page.next()
      all.push(...page.entities)
      pages++
    }
    const n = all.length
    const foreign = all.some((e) => e.creator.toLowerCase() !== me.toLowerCase())
    if (foreign) throw new Error("a foreign creator leaked through createdBy()")
    if (pages < 2) throw new Error("expected more than one page at limit(1)")
    return `${n} rows over ${pages} pages (limit 1), all created by A`
  },
)

await spike(
  "S5 WebSocket events",
  "watchEntityEvents over webSocket(), no fromBlock, receives create + delete",
  async () => {
    const seen: string[] = []
    const stop = ws.watchEntityEvents({
      onEntityCreated: (e) => seen.push(`created ${e.entityKey}`),
      onEntityDeleted: (e) => seen.push(`deleted ${e.entityKey}`),
      onError: () => {},
    })
    await new Promise((r) => setTimeout(r, 2000))
    const c = await A.createEntity(base(1, { readonly: false, permissionlessExtension: false }))
    await A.deleteEntity({ entityKey: c.entityKey })
    const deadline = Date.now() + 30_000
    while (Date.now() < deadline && !seen.some((s) => s === `deleted ${c.entityKey}`))
      await new Promise((r) => setTimeout(r, 500))
    stop()
    const got = seen.filter((s) => s.endsWith(c.entityKey))
    if (got.length < 2) throw new Error(`only saw: ${got.join(", ") || "nothing"}`)
    return got.map((g) => g.split(" ")[0]).join(" + ")
  },
)

await spike("S6 365-day Entity Expiration cost", "accepted; cost compared with 30 days", async () => {
  const r30 = await A.createEntity(base(30))
  const r365 = await A.createEntity(base(365))
  return `30 d: ${await cost(r30.txHash)} · 365 d: ${await cost(r365.txHash)}`
})

const report = `\n## Spike results ${new Date().toISOString()} (${SDK}, Tiramisu)\n\n| Spike | Result | Expected | Actual (evidence, GLM spent) |\n|---|---|---|---|\n${rows.join("\n")}\n\nRepro: \`npm run spike\` (scripts/spike.ts). S7 (browser bundle) is covered in entry 4.\n`
appendFileSync("arkiv/friction.md", report)
console.log(report)
process.exit(ok ? 0 : 1)
