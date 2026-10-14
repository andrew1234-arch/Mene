#!/usr/bin/env node
import { readFileSync } from "node:fs"
import {
  attest,
  attestationQuery,
  BURN_ADDRESS,
  explorer,
  keepalive,
  publicClient,
  publishAdvisory,
  readAdvisory,
  readLive,
  resolveStatus,
  walletClient,
} from "@mene/sdk"
import { Command, Option } from "commander"
import { cachePath, loadConfig, loadState } from "./config"
import { loadStatuses, matchTable, runCheck } from "./check"

const program = new Command()
program
  .name("mene")
  .description("The writing on the wall for poisoned packages — quorum-witnessed npm advisories on Arkiv.")
  .version("0.1.0")
  .option("--config <path>", "path to mene.config.json")

const json = (v: unknown) =>
  JSON.stringify(v, (_k, x) => (typeof x === "bigint" ? x.toString() : x), 2)

function requireKey(name: string): string {
  const k = process.env[name]
  if (!k) {
    console.error(`error: set ${name} to a testnet private key (never commit it)`)
    process.exit(2)
  }
  return k
}

const short = (a: string) => `${a.slice(0, 6)}…${a.slice(-4)}`

program
  .command("check")
  .description("match a package-lock.json against ACTIVE/MISSING advisories (exit 1 on a match)")
  .option("--lockfile <path>", "lockfile to scan", "package-lock.json")
  .addOption(new Option("--min-severity <level>", "lowest severity that fails").choices(["low", "moderate", "high", "critical"]))
  .option("--json", "machine-readable output")
  .option("--offline", "use only the local cache")
  .action(async (o) => {
    try {
      const cfg = loadConfig(program.opts().config)
      const r = await runCheck(cfg, o.lockfile, { offline: o.offline, minSeverity: o.minSeverity })
      if (o.json) console.log(json(r))
      else {
        for (const w of r.warnings) console.error(`warning: ${w}`)
        const active = r.statuses.filter((s) => s.enforced).length
        console.log(`Mene · ${r.statuses.length} advisories (${active} enforced) · source: ${r.source}${r.blockNumber ? ` @ block ${r.blockNumber}` : ""} · quorum ${cfg.threshold}/${cfg.issuers.length}`)
        if (r.matches.length === 0) console.log("✓ clean — no enforced advisory matches this lockfile")
        else {
          console.log(`✗ ${r.matches.length} poisoned package(s):\n`)
          for (const m of r.matches) {
            console.log(`  ${m.package}@${m.installed}  [${m.severity}] ${m.advisoryId} (${m.status})`)
            console.log(`    at ${m.path}${m.safeVersion ? `  → use ${m.safeVersion}` : ""}`)
            console.log(`    ${m.summary}`)
          }
        }
      }
      process.exit(r.matches.length > 0 ? 1 : 0)
    } catch (err) {
      console.error(`error: ${(err as Error).message}`)
      process.exit(2)
    }
  })

program
  .command("list")
  .description("list advisories and their quorum status")
  .addOption(new Option("--status <s>", "filter").choices(["active", "pending", "withdrawn", "missing", "all"]).default("all"))
  .option("--json", "machine-readable output")
  .action(async (o) => {
    try {
      const cfg = loadConfig(program.opts().config)
      const r = await loadStatuses(cfg)
      const rows = r.statuses.filter((s) => o.status === "all" || s.status === o.status.toUpperCase())
      if (o.json) return console.log(json(rows))
      for (const w of r.warnings) console.error(`warning: ${w}`)
      if (!rows.length) return console.log("no advisories")
      for (const s of rows) {
        const osv = s.advisory?.osv
        console.log(`${s.label.padEnd(22)} ${osv?.id ?? "?"}  ${osv?.affected.map((a) => a.package.name).join(", ") ?? ""}  [${osv?.database_specific.mene.severity ?? "?"}]`)
        console.log(`  ${s.key}  witnesses: ${s.witnesses.map((w) => `${short(w.issuer)}:${w.verdict}`).join(" ")}`)
      }
    } catch (err) {
      console.error(`error: ${(err as Error).message}`)
      process.exit(2)
    }
  })

program
  .command("verify <advisoryKey>")
  .description("show creator, owner, flags, expiry and witnesses for one advisory, with explorer links")
  .option("--json", "machine-readable output")
  .action(async (key: string, o) => {
    try {
      const cfg = loadConfig(program.opts().config)
      const pub = publicClient({ rpcUrl: cfg.rpcUrl })
      const [adv, live, head] = await Promise.all([readAdvisory(pub, key), readLive(pub, cfg.issuers), pub.getBlockNumber()])
      const { statuses } = resolveStatus({ issuers: cfg.issuers, threshold: cfg.threshold, liveAttestations: live.attestations, liveAdvisories: live.advisories, state: loadState() })
      const s = statuses.find((x) => x.key === key.toLowerCase())
      if (o.json) return console.log(json({ advisory: adv, status: s, head }))
      if (!adv) console.log(`advisory ${key}: NOT READABLE on-chain (deleted, expired or never existed)`)
      else {
        const sealed = adv.owner.toLowerCase() === BURN_ADDRESS.toLowerCase()
        const blocksLeft = BigInt(adv.expiresAt) - head
        console.log(`${adv.osv.id} — ${adv.osv.summary}`)
        console.log(`  key        ${adv.key}  ${explorer.entity(adv.key)}`)
        console.log(`  creator    ${adv.creator}  ${explorer.address(adv.creator)}`)
        console.log(`  owner      ${adv.owner}${sealed ? "  (SEALED — burn address, no one can delete it)" : ""}`)
        console.log(`  flags      readonly=${adv.readonly} permissionlessExtension=${adv.permissionlessExtension}`)
        console.log(`  expires    block ${adv.expiresAt} (~${Math.round(Number(blocksLeft) * 2 / 86400)} days at 2 s/block)`)
      }
      console.log(`  status     ${s?.label ?? "no trusted attestations"}`)
      for (const w of s?.witnesses ?? []) {
        console.log(`  witness    ${w.issuer} ${w.verdict} @ block ${w.createdAt}  ${explorer.entity(w.key)}${s?.vanished.some((v) => v.key === w.key) ? "  (VANISHED — counted from cache)" : ""}`)
      }
      console.log(`\n  query      ${attestationQuery(pub, cfg.issuers[0] ?? "0x0000000000000000000000000000000000000000").toString()}`)
    } catch (err) {
      console.error(`error: ${(err as Error).message}`)
      process.exit(2)
    }
  })

program
  .command("publish <file>")
  .description("inscribe an OSV advisory (issuer; env MENE_ISSUER_KEY)")
  .addOption(new Option("--seal <mode>", "seal to the burn address").choices(["batch", "separate", "none"]).default("batch"))
  .action(async (file: string, o) => {
    try {
      const cfg = loadConfig(program.opts().config)
      const pub = publicClient({ rpcUrl: cfg.rpcUrl })
      const wallet = walletClient(requireKey("MENE_ISSUER_KEY"), { rpcUrl: cfg.rpcUrl })
      const r = await publishAdvisory(pub, wallet, JSON.parse(readFileSync(file, "utf8")), { sealMode: o.seal })
      console.log(json({ ...r, explorer: explorer.tx(r.txHash) }))
    } catch (err) {
      console.error(`error: ${(err as Error).message}`)
      process.exit(2)
    }
  })

program
  .command("attest <advisoryKey>")
  .description("confirm or withdraw an advisory (issuer; env MENE_ISSUER_KEY)")
  .option("--confirm")
  .option("--withdraw")
  .option("--reason <text>")
  .action(async (key: string, o) => {
    if (!!o.confirm === !!o.withdraw) {
      console.error("error: pass exactly one of --confirm / --withdraw")
      process.exit(2)
    }
    try {
      const cfg = loadConfig(program.opts().config)
      const pub = publicClient({ rpcUrl: cfg.rpcUrl })
      const wallet = walletClient(requireKey("MENE_ISSUER_KEY"), { rpcUrl: cfg.rpcUrl })
      const r = await attest(wallet, key, o.confirm ? "confirm" : "withdraw", o.reason)
      console.log(json({ ...r, explorer: explorer.tx(r.txHash) }))
    } catch (err) {
      console.error(`error: ${(err as Error).message}`)
      process.exit(2)
    }
  })

program
  .command("keepalive [key]")
  .description("permissionless Lifetime Extension for one entity or --all advisories+attestations (env MENE_KEEPER_KEY)")
  .option("--all")
  .option("--days <n>", "new lifetime in days, counted from now", "365")
  .action(async (key: string | undefined, o) => {
    try {
      const cfg = loadConfig(program.opts().config)
      let keys: string[]
      if (o.all) {
        const live = await readLive(publicClient({ rpcUrl: cfg.rpcUrl }), cfg.issuers)
        keys = [...Object.keys(live.advisories), ...live.attestations.map((a) => a.key)]
      } else if (key) keys = [key]
      else throw new Error("pass an entity key or --all")
      if (!keys.length) return console.log("nothing to extend")
      const days = Number(o.days)
      if (!Number.isFinite(days) || days <= 0) throw new Error("--days must be a positive number")
      const r = await keepalive(publicClient({ rpcUrl: cfg.rpcUrl }), walletClient(requireKey("MENE_KEEPER_KEY"), { rpcUrl: cfg.rpcUrl }), keys, days)
      console.log(json({ ...r, explorer: r.txHash ? explorer.tx(r.txHash) : null }))
    } catch (err) {
      console.error(`error: ${(err as Error).message}`)
      process.exit(2)
    }
  })

program
  .command("cache")
  .description("print the anti-burial cache location")
  .action(() => console.log(cachePath()))

program.parseAsync()
