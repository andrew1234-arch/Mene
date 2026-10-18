/**
 * Read-only measurement of what one full Mene read costs on the public RPC (friction.md #12).
 * Counts every JSON-RPC call readLive makes and prints the rate-limit headers the node returns.
 *
 *   npx tsx scripts/budget.ts 0xWitnessA 0xWitnessB 0xWitnessC
 */
import { TIRAMISU, publicClient, readLive } from "@mene/sdk"

const witnesses = process.argv.slice(2)
if (!witnesses.length) throw new Error("usage: tsx scripts/budget.ts <witness address>…")

const calls: Record<string, number> = {}
const headers = new Map<string, string>()
const realFetch = globalThis.fetch
globalThis.fetch = async (input, init) => {
  const res = await realFetch(input, init)
  if (String(input instanceof Request ? input.url : input).startsWith(TIRAMISU.rpcUrl)) {
    const body = typeof init?.body === "string" ? JSON.parse(init.body) : undefined
    for (const m of [body].flat()) if (m?.method) calls[m.method] = (calls[m.method] ?? 0) + 1
    res.headers.forEach((v, k) => {
      if (/rate|limit|cost|retry|quota/i.test(k)) headers.set(k, v)
    })
  }
  return res
}

const live = await readLive(publicClient(), witnesses)
console.log(
  `readLive: ${Object.keys(live.advisories).length} advisories, ${live.attestations.length} attestations at block ${live.blockNumber}`,
)
console.log(`RPC calls: ${JSON.stringify(calls)}`)
console.log(
  `Rate-limit headers on the last response: ${headers.size ? JSON.stringify(Object.fromEntries(headers)) : "(none)"}`,
)
process.stdout.write("", () => process.exit())
