/**
 * Mirrors curated npm account-takeover records from OpenSSF malicious-packages onto Arkiv.
 * Witness A inscribes each record (sealed), witness B confirms it. For chalk and debug, witness C
 * confirms too, so the stolen-key demo (scripts/attack.ts) still leaves 2 of 3.
 *
 *   npm run mirror -- --dry-run      # fetch + transform only; writes mirror-out/*.json, no keys needed
 *   npm run mirror                   # inscribe (needs MENE_ISSUER_A/B/C_KEY, funded)
 *   npm run mirror -- --only chalk,debug
 *
 * Listing a package's records uses the GitHub contents API (set GITHUB_TOKEN to raise the rate
 * limit); records are then fetched from raw.githubusercontent.com. Re-runs skip records A already
 * inscribed (matched by the advisoryId attribute, never by package name).
 */
import { appendFileSync, mkdirSync, writeFileSync } from "node:fs"
import { and, eq } from "@arkiv-network/sdk/query"
import {
  CURATED,
  OSSF_RAW,
  PROJECT,
  attest,
  coversVersion,
  ensureSealed,
  explorer,
  latestVerdict,
  mirrorRecord,
  publicClient,
  publishAdvisory,
  recommendedVersion,
  walletClient,
} from "../packages/sdk/src/index"
import { loadEnv, need } from "./env"

loadEnv()
const args = process.argv.slice(2)
const dry = args.includes("--dry-run")
const only = args.includes("--only") ? new Set(args[args.indexOf("--only") + 1]!.split(",")) : null
const SEAL = (process.env.MENE_SEAL_MODE || "batch") as "batch" | "separate" | "none"

async function getJson<T>(url: string, headers: Record<string, string> = {}): Promise<T> {
  const r = await fetch(url, { headers: { "user-agent": "mene-mirror", ...headers } })
  if (!r.ok) throw new Error(`${r.status} ${url}`)
  return (await r.json()) as T
}

async function listRecords(name: string): Promise<string[]> {
  const headers: Record<string, string> = { accept: "application/vnd.github+json" }
  if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  const dir = `osv/malicious/npm/${name}`
  const items = await getJson<{ name: string; path: string }[]>(
    `https://api.github.com/repos/ossf/malicious-packages/contents/${dir}`,
    headers,
  )
  return items.filter((i) => /^MAL-.*\.json$/.test(i.name)).map((i) => i.path)
}

const prepared: { name: string; path: string; osv: ReturnType<typeof mirrorRecord> }[] = []
for (const c of CURATED.filter((c) => !only || only.has(c.name))) {
  try {
    const paths = await listRecords(c.name)
    const npm = await getJson<{ versions: Record<string, unknown> }>(`https://registry.npmjs.org/${c.name}`)
    const recommended = recommendedVersion(Object.keys(npm.versions), c.version)
    let found = false
    let skipped = 0
    for (const path of paths) {
      const raw = await getJson<Parameters<typeof coversVersion>[0]>(`${OSSF_RAW}/${path}`)
      if (!coversVersion(raw, c.name, c.version)) continue
      try {
        prepared.push({ name: c.name, path, osv: mirrorRecord(raw, { path, recommended }) })
        found = true
      } catch (e) {
        skipped++
        console.log(`! ${path}: ${(e as Error).message}`)
      }
    }
    const status = found
      ? "record found"
      : skipped
        ? `skipped: ${skipped} matching record(s) contain personal data`
        : "no OpenSSF record for this version"
    console.log(
      `${found ? "✓" : skipped ? "✗" : "·"} ${c.name}@${c.version}: ${status} (recommended ${recommended ?? "none"})`,
    )
    // A curated incident that couldn't be mirrored must not look like success.
    if (!found && skipped) process.exitCode = 1
  } catch (e) {
    console.log(`✗ ${c.name}: ${(e as Error).message}`)
    process.exitCode = 1
  }
}

if (dry) {
  mkdirSync("mirror-out", { recursive: true })
  for (const p of prepared) writeFileSync(`mirror-out/${p.osv.id}.json`, `${JSON.stringify(p.osv, null, 2)}\n`)
  console.log(`\nDry run: wrote ${prepared.length} records to mirror-out/. Nothing was inscribed.`)
  process.exit()
}

const pub = publicClient()
const A = walletClient(need("MENE_ISSUER_A_KEY"))
const B = walletClient(need("MENE_ISSUER_B_KEY"))
const C = walletClient(need("MENE_ISSUER_C_KEY"))
appendFileSync("arkiv/evidence.md", `\n## OpenSSF mirror run ${new Date().toISOString()}\n\n`)
const note = (s: string) => {
  console.log(s)
  appendFileSync("arkiv/evidence.md", `${s}\n`)
}
for (const p of prepared) {
  const existing = await pub
    .select({ key: true })
    .where(and(eq("project", PROJECT), eq("type", "advisory"), eq("advisoryId", p.osv.id)))
    .createdBy(A.account!.address)
    .limit(1)
    .fetch()
  let advisoryKey: string
  if (existing.entities.length) {
    advisoryKey = existing.entities[0]!.key
    console.log(`${p.osv.id} (${p.name}): already inscribed as ${advisoryKey}; checking seal and confirmations`)
    // An interrupted run (or seal mode "separate") may have left it unsealed.
    if (SEAL !== "none") {
      const sealTx = await ensureSealed(pub, A, advisoryKey)
      if (sealTx) note(`  - A seals ${p.osv.id} (resumed): [\`${sealTx}\`](${explorer.tx(sealTx)})`)
    }
  } else {
    const r = await publishAdvisory(pub, A, p.osv, { sealMode: SEAL })
    advisoryKey = r.advisoryKey
    note(`- A inscribes ${p.osv.id} (${p.name}) → \`${r.advisoryKey}\`: [\`${r.txHash}\`](${explorer.tx(r.txHash)})`)
  }
  // Resumable: add any confirmation a previous, interrupted run didn't get to.
  const confirmers = [B, ...(p.name === "chalk" || p.name === "debug" ? [C] : [])]
  for (const w of confirmers) {
    // Done only if the witness's latest verdict is confirm (a later withdrawal undoes it).
    const latest = await latestVerdict(pub, w.account!.address, advisoryKey)
    if (latest === "confirm") continue
    const label = w === B ? "B" : "C"
    if (latest === "withdraw") console.log(`  ${label}'s latest verdict on ${p.osv.id} is withdraw; confirming again`)
    const t = await attest(w, advisoryKey, "confirm")
    note(`  - ${label} confirms ${p.osv.id}: [\`${t.txHash}\`](${explorer.tx(t.txHash)})`)
  }
}
