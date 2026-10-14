# Mene

> *Mene, Mene, Tekel, Upharsin*: the writing on the wall.

**The writing on the wall for poisoned packages.** Mene stores npm compromise advisories on [Arkiv](https://arkiv.network). Each one is quorum-witnessed and lives where no registry, company or hacked account can erase it. Mene matches advisories against your lockfile locally and enforces them in CI.

Tracks: **Security** (primary) · **Censorship Resistance** · Open Source (OSV data contract).

| | |
|---|---|
| Web app | GitHub Pages: `https://andrew1234-arch.github.io/Mene/`. A static site that reads and writes Arkiv from the browser: check a lockfile, browse advisories, publish/confirm/withdraw/keep alive with a browser wallet, watch live events |
| Network | Arkiv Tiramisu testnet, chain `7738577` |
| Data contract | [`arkiv/schema.md`](arkiv/schema.md) |
| Friction log | [`arkiv/friction.md`](arkiv/friction.md) |
| Wallets & txs | [`arkiv/evidence.md`](arkiv/evidence.md) |

## Why
On 8 Sep 2025 the npm maintainer `qix` was phished. The attacker published `chalk@5.6.1`, `debug@4.4.2` and 16 more packages with a crypto-stealing payload. The warnings lived on sites that an operator, a takedown or another compromised account could edit or delete.

Mene's answer:
- **Mene (numbered).** Each advisory is a readonly Arkiv entity, sealed to the burn address.
- **Tekel (weighed).** It counts only when *k* of *n* trusted witnesses confirm. Trust comes from the immutable `$creator`.
- **Upharsin (divided).** Your lockfile is matched locally, and CI fails on a match.

## Quickstart
```bash
npm ci && npm run build
node packages/cli/dist/index.js check --lockfile examples/chalk-attack/package-lock.json  # exit 1
node packages/cli/dist/index.js check --lockfile examples/clean/package-lock.json         # exit 0
npm test
```

## Reproduce the demo state
```bash
cp .env.example .env
npx tsx scripts/keys.ts      # generates 5 testnet wallets into .env and prints addresses only
# fund them at the faucet linked from https://docs.arkiv.network/networks/tiramisu/
npm run spike                # on-chain checks S0–S6 (seal, delete-after-seal, permissionless extension…)
npm run seed                 # publishes chalk/debug/false-alarm/forgery, writes arkiv/evidence.md
```

## Repo layout
```
packages/sdk   @mene/sdk: OSV types, lockfile parser, matcher, quorum, Arkiv read/write
packages/cli   mene CLI (check · list · verify · publish · attest · issuer · keepalive)
action/        GitHub Action (bundled, node20)
site/          Astro + Starlight static site (Wall, Advisory, Check, Witnesses, Live, About, Docs)
examples/      fixture lockfiles: scanned, never installed
advisories/    seed OSV advisories
arkiv/         schema.md · friction.md · evidence.md
scripts/       keys.ts · spike.ts · seed.ts
```

## Honest limitations
- The demo witnesses are 3 team-controlled testnet wallets. In production they would be independent organisations.
- Testnet only.
- The anti-burial cache protects only clients that saw a confirmation. Chain history remains the backstop.

MIT licensed.
