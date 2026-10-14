/**
 * PREVIEW BUILDS ONLY (PUBLIC_MENE_PREVIEW=1). Answers Arkiv RPC calls in the browser from
 * clearly-labelled sample data so the site can be tried where Arkiv isn't reachable. Never part
 * of the production build: every page shows a "sample data" banner while this is active.
 */
import { mirrorRecord } from "@mene/sdk"
import fake from "../../../advisories/MENE-2026-0001-false-alarm.osv.json"
import chalk from "../../../packages/sdk/test/fixtures/chalk.osv.json"
// A real OpenSSF malicious-packages record, converted exactly as scripts/mirror.ts does.
import ossfDebug from "../../../packages/sdk/test/fixtures/ossf-MAL-2025-46974.json"

const debug = mirrorRecord(ossfDebug, { path: "osv/malicious/npm/debug/MAL-2025-46974.json", recommended: "4.4.1" })

export const SAMPLE_WITNESSES = [
  { name: "Sample witness A", address: "0xa11ce00000000000000000000000000000000001" },
  { name: "Sample witness B", address: "0xb0b0000000000000000000000000000000000002" },
  { name: "Sample witness C", address: "0xc4a1e00000000000000000000000000000000003" },
]
const [A, B, C] = SAMPLE_WITNESSES.map((w) => w.address) as [string, string, string]
const HEAD = 1_500_000
const k = (n: number) => `0x${n.toString(16).padStart(64, "0")}`
const hex = (s: string) => `0x${Array.from(new TextEncoder().encode(s), (b) => b.toString(16).padStart(2, "0")).join("")}`
const pending = {
  ...chalk,
  id: "SAMPLE-2026-0042",
  summary: "ansi-styles 6.2.2 published with an obfuscated postinstall payload (sample)",
  published: "2026-10-12T09:00:00Z",
  details: "Sample advisory for the preview. Only one witness has confirmed it, so it is pending.",
  aliases: [],
  affected: [{ package: { ecosystem: "npm", name: "ansi-styles" }, versions: ["6.2.2"] }],
  database_specific: { mene: { severity: "high", recommended: "6.2.1" } },
}
const advs = [
  { key: k(1), creator: A, osv: chalk, at: 1_000_100 },
  { key: k(2), creator: A, osv: debug, at: 1_000_200 },
  { key: k(3), creator: C, osv: fake, at: 1_400_000 },
  { key: k(4), creator: B, osv: pending, at: 1_490_000 },
]
const atts = (
  [
    [A, k(1), "confirm", 1_000_100], [B, k(1), "confirm", 1_000_400], [C, k(1), "confirm", 1_000_450],
    [A, k(2), "confirm", 1_000_200], [B, k(2), "confirm", 1_000_500], [C, k(2), "confirm", 1_000_550],
    [C, k(3), "confirm", 1_400_000], [A, k(3), "confirm", 1_400_100], [A, k(3), "withdraw", 1_400_500], [C, k(3), "withdraw", 1_400_600],
    [B, k(4), "confirm", 1_490_000],
  ] as const
).map(([creator, adv, verdict, at], i) => ({ key: k(100 + i), creator, adv, verdict, at }))

const S = (name: string, value: unknown) => ({ name, type: "str", value })
const SEV = ["low", "moderate", "high", "critical"]
const flags = { readonly: true, permissionlessExtension: true, raw: 3 }
const blk = (n: number) => `0x${n.toString(16)}`

function advEntity(a: (typeof advs)[number]) {
  return {
    key: a.key, owner: "0x000000000000000000000000000000000000dead", creator: a.creator,
    createdAt: blk(a.at), updatedAt: blk(a.at), expiresAt: blk(a.at + 15_768_000), creationFlags: flags,
    contentType: "application/json", payload: hex(JSON.stringify(a.osv)),
    attributes: [
      S("project", "mene-v1"), S("type", "advisory"), { name: "schemaVersion", type: "i32", value: 1 }, S("advisoryId", a.osv.id),
      S("ecosystem", "npm"), S("pkg", a.osv.affected[0]!.package.name),
      { name: "severity", type: "i32", value: SEV.indexOf(a.osv.database_specific.mene.severity) + 1 },
      { name: "publishedAt", type: "u64", value: String(Math.floor(Date.parse(a.osv.published) / 1000)) },
    ],
  }
}
function attEntity(t: (typeof atts)[number]) {
  return {
    key: t.key, owner: t.creator, creator: t.creator, createdAt: blk(t.at), updatedAt: blk(t.at), expiresAt: blk(t.at + 15_768_000),
    creationFlags: flags, contentType: "application/json",
    payload: hex(JSON.stringify(t.verdict === "withdraw" ? { reason: "synthetic package, demo false alarm" } : {})),
    attributes: [S("project", "mene-v1"), S("type", "attestation"), { name: "advisory", type: "key", value: t.adv }, S("verdict", t.verdict), { name: "attestedAt", type: "u64", value: String(t.at) }],
  }
}

type Req = { id: number; method: string; params?: unknown[] }
function answer({ id, method, params = [] }: Req) {
  const ok = (result: unknown) => ({ jsonrpc: "2.0", id, result })
  switch (method) {
    case "eth_chainId": return ok("0x7614d1")
    case "eth_blockNumber": return ok(blk(HEAD))
    case "eth_call": return ok(`0x${"00".repeat(32)}`)
    case "arkiv_getBlockTiming": return ok({ current_block: HEAD, current_block_time: Math.floor(Date.now() / 1000), duration: 2 })
    case "arkiv_query": {
      const q = String(params[0])
      const creator = q.match(/\$creator = addr\((0x[0-9a-fA-F]+)\)/)?.[1]?.toLowerCase()
      const key = q.match(/\$key = key\((0x[0-9a-fA-F]+)\)/)?.[1]?.toLowerCase()
      let data: unknown[] = []
      if (key) data = advs.filter((a) => a.key === key).map(advEntity)
      else if (q.includes("'attestation'")) data = atts.filter((t) => t.creator === creator).map(attEntity)
      else if (q.includes("'advisory'")) {
        const sev = Number(q.match(/severity >= i32\((\d+)\)/)?.[1] ?? 0)
        const since = Number(q.match(/publishedAt >= u64\((\d+)\)/)?.[1] ?? 0)
        data = advs.filter((a) => a.creator === creator).map(advEntity)
          .filter((e) => (e.attributes.find((x) => x.name === "severity")!.value as number) >= sev && Number(e.attributes.find((x) => x.name === "publishedAt")!.value) >= since)
      }
      return ok({ data, blockNumber: blk(HEAD) })
    }
    default:
      return { jsonrpc: "2.0", id, error: { code: -32601, message: `Not available in the preview: ${method}` } }
  }
}

const RPC = "https://rpc.tiramisu.db-chain.testnet.arkiv.network"
const realFetch = window.fetch.bind(window)
window.fetch = async (input, init) => {
  const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url
  if (!url.startsWith(RPC)) return realFetch(input, init)
  const body = JSON.parse(String(init?.body ?? "{}")) as Req | Req[]
  const res = Array.isArray(body) ? body.map(answer) : answer(body)
  await new Promise((r) => setTimeout(r, 250))
  return new Response(JSON.stringify(res), { status: 200, headers: { "content-type": "application/json" } })
}
