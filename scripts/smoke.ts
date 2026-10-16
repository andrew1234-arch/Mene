/**
 * Read-only check against the live Tiramisu node: runs every query Mene sends and prints what the
 * node returns. Needs no keys. Run: `npx tsx scripts/smoke.ts [witness addresses...]`.
 */
import { i32, u64 } from "@arkiv-network/sdk/attr"
import { and, eq, gte } from "@arkiv-network/sdk/query"
import { PROJECT, TIRAMISU, attestationQuery, publicClient, readLive, resolveStatus } from "../packages/sdk/src/index"

const pub = publicClient()
const ws = (
  process.argv.slice(2).length ? process.argv.slice(2) : ["0x0000000000000000000000000000000000000001"]
) as `0x${string}`[]
const t0 = Date.now()
const step = async (name: string, fn: () => Promise<unknown>) => {
  const s = Date.now()
  try {
    // A hung request must fail the step, not the whole job (the attack demo once stalled here).
    const r = await Promise.race([
      fn(),
      new Promise((_, reject) => setTimeout(() => reject(new Error("timed out after 90 s")), 90_000)),
    ])
    console.log(
      `PASS ${name} (${Date.now() - s} ms): ${JSON.stringify(r, (_k, v) => (typeof v === "bigint" ? v.toString() : v))}`,
    )
  } catch (e) {
    console.log(`FAIL ${name}: ${(e as Error).message.split("\n").slice(0, 3).join(" | ")}`)
    process.exitCode = 1
  }
}

await step("eth_chainId", async () => {
  const id = await pub.getChainId()
  if (id !== TIRAMISU.chainId) throw new Error(`unexpected chain ${id}`)
  return id
})
await step("eth_blockNumber", () => pub.getBlockNumber())
await step("arkiv_getBlockTiming", () => pub.getBlockTiming())
await step("query: attestations per witness (exact Mene query)", async () => {
  const q = attestationQuery(pub, ws[0]!)
  const page = await q.fetch()
  return { query: q.toString(), rows: page.entities.length, block: page.blockNumber, cursor: page.cursor ?? null }
})
await step("query: wall range filter (severity i32 + publishedAt u64)", async () => {
  const q = pub
    .select({ key: true })
    .where(
      and(
        eq("project", PROJECT),
        eq("type", "advisory"),
        gte("severity", i32(3)),
        gte("published_at", u64(1_700_000_000n)),
      ),
    )
    .createdBy(ws[0]!)
    .limit(200)
  const page = await q.fetch()
  return { query: q.toString(), rows: page.entities.length }
})
await step("getEntity on a key that does not exist -> NoEntityFoundError", async () => {
  try {
    await pub.getEntity(`0x${"00".repeat(31)}01`)
    return "unexpectedly found"
  } catch (e) {
    return (e as Error).name
  }
})
await step("readLive + resolveStatus end to end", async () => {
  const live = await readLive(pub, ws)
  const { statuses } = resolveStatus({
    issuers: ws,
    threshold: Math.min(2, ws.length),
    liveAttestations: live.attestations,
    liveAdvisories: live.advisories,
  })
  return {
    attestations: live.attestations.length,
    advisories: Object.keys(live.advisories).length,
    statuses: statuses.map((s) => `${s.advisory?.osv.id ?? s.key}:${s.label}`),
  }
})
await step("forged advisories stay invisible (keeper wallet is not a witness)", async () => {
  const live = await readLive(pub, ws)
  const forged = Object.values(live.advisories).filter((a) => a.osv.id.startsWith("FORGED"))
  if (forged.length) throw new Error(`forged advisory visible: ${forged.map((a) => a.key).join(", ")}`)
  return { advisoriesRead: Object.keys(live.advisories).length, forgedVisible: 0 }
})
// MENE_SNAPSHOT=1 prints the resolved statuses as one JSON line, for offline screenshots of the site.
if (process.env.MENE_SNAPSHOT === "1") {
  const live = await readLive(pub, ws)
  const { statuses } = resolveStatus({
    issuers: ws,
    threshold: Math.min(2, ws.length),
    liveAttestations: live.attestations,
    liveAdvisories: live.advisories,
  })
  const json = JSON.stringify({ statuses, blockNumber: live.blockNumber }, (_k, v) =>
    typeof v === "bigint" ? v.toString() : v,
  )
  // GitHub truncates log lines at 64 KB, so the base64 is printed in numbered chunks.
  const b64 = Buffer.from(json).toString("base64")
  const size = 60_000
  const n = Math.ceil(b64.length / size)
  for (let i = 0; i < n; i++) console.log(`SNAPSHOT ${i + 1}/${n} ${b64.slice(i * size, (i + 1) * size)}`)
}
console.log(`done in ${Date.now() - t0} ms`)
// Exit once stdout has drained: process.exit() alone can cut off piped output.
process.stdout.write("", () => process.exit())
