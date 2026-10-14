/**
 * On-chain spikes. Run: `npm run spike` (needs .env with funded MENE_ISSUER_A_KEY and MENE_KEEPER_KEY).
 * Each spike prints PASS/FAIL with the evidence (tx hash / error) to paste into arkiv/friction.md.
 */
import { ExpirationTime, jsonToPayload } from "@arkiv-network/sdk"
import { str } from "@arkiv-network/sdk/attr"
import { eq } from "@arkiv-network/sdk/query"
import { BURN_ADDRESS, publicClient, TIRAMISU, walletClient } from "../packages/sdk/src/index"
import { loadEnv, need } from "./env"

loadEnv()
const results: Array<{ id: string; ok: boolean; note: string }> = []
async function spike(id: string, fn: () => Promise<string>) {
  try {
    const note = await fn()
    results.push({ id, ok: true, note })
    console.log(`PASS ${id}: ${note}`)
  } catch (e) {
    results.push({ id, ok: false, note: (e as Error).message.split("\n")[0]! })
    console.log(`FAIL ${id}: ${(e as Error).message.split("\n")[0]}`)
  }
}
const expectRevert = async (p: Promise<unknown>) => {
  try {
    await p
  } catch (e) {
    return (e as Error).message.split("\n")[0]!
  }
  throw new Error("expected a revert, but the transaction succeeded")
}

const pub = publicClient()
const issuer = walletClient(need("MENE_ISSUER_A_KEY"))
const keeper = walletClient(need("MENE_KEEPER_KEY"))
const me = issuer.account!.address
const base = (salt?: bigint) => ({
  payload: jsonToPayload({ spike: true, at: Date.now() }),
  contentType: "application/json",
  expires: ExpirationTime.fromDays(1),
  attributes: { project: str("mene-spike"), type: str("spike") },
  flags: { readonly: true, permissionlessExtension: true },
  ...(salt !== undefined ? { salt } : {}),
})

await spike("S0 chainId", async () => {
  const id = await pub.getChainId()
  if (id !== TIRAMISU.chainId) throw new Error(`chain id ${id}`)
  return `chain ${id} (0x${id.toString(16)})`
})

let sealedKey: `0x${string}` | undefined
await spike("S1 create + seal to burn address in one batch", async () => {
  const [k] = await pub.predictEntityKeys({ owner: me, count: 1 })
  const r = await issuer.executeBatch({ creates: [base(k.salt)], ownershipChanges: [{ entityKey: k.key, newOwner: BURN_ADDRESS }] })
  if (r.createdEntities[0]?.toLowerCase() !== k.key.toLowerCase()) throw new Error(`predicted ${k.key} got ${r.createdEntities[0]}`)
  const e = await pub.getEntity(k.key)
  if (e.owner.toLowerCase() !== BURN_ADDRESS.toLowerCase()) throw new Error(`owner is ${e.owner}`)
  sealedKey = k.key
  return `key ${k.key} owner=burn tx ${r.txHash}`
})

await spike("S2 issuer cannot delete a sealed entity", async () => {
  if (!sealedKey) throw new Error("S1 failed")
  return `reverted: ${await expectRevert(issuer.deleteEntity({ entityKey: sealedKey }))}`
})

await spike("S3 a stranger can extend (permissionlessExtension)", async () => {
  if (!sealedKey) throw new Error("S1 failed")
  const r = await keeper.extendEntity({ entityKey: sealedKey, expires: ExpirationTime.fromDays(2) })
  return `keeper ${keeper.account!.address} tx ${r.txHash}`
})

await spike("S4 readonly entity cannot be patched by owner", async () => {
  const r = await issuer.createEntity(base())
  const why = await expectRevert(issuer.patchEntity({ entityKey: r.entityKey, set: { type: str("tampered") } }))
  return `reverted: ${why}`
})

await spike("S5 stranger cannot delete an unsealed readonly entity", async () => {
  const r = await issuer.createEntity(base())
  return `reverted: ${await expectRevert(keeper.deleteEntity({ entityKey: r.entityKey }))}`
})

await spike("S6 createdBy filter excludes other creators", async () => {
  const page = await pub.select({ key: true, creator: true }).where(eq("project", "mene-spike")).createdBy(keeper.account!.address).limit(10).fetch()
  if (page.entities.some((e) => e.creator.toLowerCase() !== keeper.account!.address.toLowerCase())) throw new Error("foreign creator leaked")
  return `${page.entities.length} rows, all from keeper`
})

console.log("\nSummary:")
for (const r of results) console.log(`- ${r.ok ? "✅" : "❌"} ${r.id} — ${r.note}`)
process.exit(results.every((r) => r.ok) ? 0 : 1)
