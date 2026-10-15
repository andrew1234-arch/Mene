<h1>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="brand/png/mene-lockup-on-dark-800w.png">
    <img src="brand/png/mene-lockup-on-light-800w.png" alt="Mene" width="320">
  </picture>
</h1>

**Warnings that can't be erased.** Mene tells you if your project uses a hijacked npm package, and blocks it in CI.

**Check your project now:** https://andrew1234-arch.github.io/Mene/check/ (drop `package-lock.json` or paste a GitHub repo URL; nothing is uploaded)

**Protect CI** (add to any workflow job):
```yaml
- uses: actions/checkout@v4
- uses: andrew1234-arch/mene@v1
  with:
    lockfile: package-lock.json
```

**From the terminal:**
```bash
npx mene-check check        # exit 0 clean · 1 hijacked package found · 2 can't verify (fails closed)
```

Warnings are confirmed by independent witnesses and stored on [Arkiv](https://arkiv.network), the Web3 database, where no registry, company or hacked account can edit or delete them. Matching runs on your machine.

> *Mene, Mene, Tekel, Upharsin*: the writing on the wall.

Tracks: **Security** · **Censorship Resistance** · **Open Source**

| | |
|---|---|
| Web app | https://andrew1234-arch.github.io/Mene/ (static; reads Arkiv straight from the browser) |
| Network | Arkiv Tiramisu testnet, chain `7738577` · [explorer](https://tiramisu.explorer.arkiv.network) |
| Data contract | [`arkiv/schema.md`](arkiv/schema.md) |
| Friction report | [`arkiv/friction.md`](arkiv/friction.md) |
| Wallets & transactions | [`arkiv/evidence.md`](arkiv/evidence.md) |
| Demo video | TODO |

## Why
On 8 September 2025, the npm maintainer `qix` was phished through a fake `npmjs.help` 2FA email. Malicious versions of 18 packages with more than 2.6 billion weekly downloads followed, including `chalk@5.6.1` and `debug@4.4.2`, which redirected crypto transactions in browsers. The warnings lived on websites that one operator, one takedown or one more hacked account can edit or delete.

- **Mene: numbered.** Every advisory is written to Arkiv as a readonly entity and sealed to the burn address, so nobody can delete it, not even its author.
- **Tekel: weighed.** It counts only when 2 of 3 witnesses confirm. Mene reads confirmations by the wallet that signed them (`$creator`), never by labels.
- **Upharsin: divided.** Your lockfile is matched locally, and CI fails until you install the safe version.

**Real data from day one.** Mene mirrors the qix-incident records from [OpenSSF malicious-packages](https://github.com/ossf/malicious-packages) (Apache-2.0), so `mene check` protects your project today.

## Quickstart
```bash
npm ci && npm run build
node packages/cli/dist/index.js check --lockfile path/to/package-lock.json
# demo fixtures (scanned, never installed):
node packages/cli/dist/index.js check --lockfile examples/chalk-attack/package-lock.json   # exit 1
node packages/cli/dist/index.js check --lockfile examples/clean/package-lock.json          # exit 0
```
Or open the web app's **Check** page and drop your lockfile. It is parsed in the page and never uploaded.

## CLI
```
mene check   [--lockfile ./package-lock.json] [--config mene.config.json] [--min-severity low] [--json] [--offline]
mene list    [--status active|pending|withdrawn|missing|all] [--json]
mene verify  <advisoryKey>                        # creator, owner, flags, expiry, witnesses, explorer links
mene publish <advisory.osv.json>                  # witness; env MENE_ISSUER_KEY
mene attest  <advisoryKey> --confirm | --withdraw [--reason "..."]
mene keepalive [--all | <key>] [--days 365]       # permissionless Lifetime Extension; env MENE_KEEPER_KEY
```
Exit codes: `0` clean · `1` a match at or above `--min-severity` · `2` can't verify (no network and no cache, bad config, unreadable lockfile). Mene fails closed.

`mene.config.json`: `{ "issuers": ["0x…","0x…","0x…"], "threshold": 2, "minSeverity": "low" }`. Without one, Mene uses the three demo witnesses. Order of precedence: the config file, then the `MENE_ISSUERS` / `MENE_THRESHOLD` / `MENE_RPC_URL` environment variables, then the defaults.

The CLI remembers every advisory and confirmation it has seen in `~/.cache/mene/state.json` (or `MENE_CACHE_DIR`). That memory is what makes deletion pointless; see the trust model.

## GitHub Action
```yaml
- uses: actions/checkout@v4
- uses: actions/cache@v4            # keeps Mene's memory between runs
  with: { path: "${{ runner.temp }}/mene-cache", key: "mene-${{ github.run_id }}", restore-keys: "mene-" }
- uses: andrew1234-arch/Mene/action@main
  with:
    lockfile: package-lock.json
    # issuers: 0xA…,0xB…,0xC…      # defaults to mene.config.json, then the demo witnesses
    # threshold: 2
    # min-severity: high
```
The Action writes a table of matches and safe versions to the job summary, annotates the lockfile, and fails the job on a match. It is one bundled file on Node 24; nothing is installed at run time. The [chalk-attack-demo](.github/workflows/chalk-attack-demo.yml) workflow runs it against a poisoned lockfile (must fail) and a clean one (must pass).

## Trust model
- **Trust comes from `$creator`.** Anyone can create an Arkiv entity labelled `project = "mene-v1"`. Every read is pinned to a trusted witness with `createdBy()`, and an entity's creator can never change.
- **Quorum.** For each advisory, Mene replays the witnesses' verdicts in chain order. It becomes **ACTIVE** once 2 witnesses confirm at the same time. After that, only a withdrawal quorum undoes it (**WITHDRAWN**), so one stolen key can't bury a warning by withdrawing. Before that it is **PENDING n/2**, and a witness may take back its own mistaken confirmation.
- **Readonly + sealed.** Advisories and attestations are `readonly`: their content can never change. In the same transaction that creates it, an advisory's ownership moves to `0x000000000000000000000000000000000000dEaD`, so no key can delete it.
- **Anti-burial memory.** A witness can still delete its own confirmation. Every client that saw it keeps counting it unless a withdrawal quorum exists. An advisory that disappears becomes **MISSING (was ACTIVE)** and stays enforced. The Wall raises a red deletion alarm.
- **Off-chain on purpose.** Lockfiles, dependency lists, which packages you use, trust settings and keys never touch Arkiv. Queries carry Mene's fixed labels and witness addresses, never a package name.

## Threat model
| Attacker | Tries to | What happens |
|---|---|---|
| Anyone | Publish a fake advisory with Mene's labels | Never shown: reads are pinned to the witnesses' wallets |
| One stolen witness key | Force a false warning | Stays PENDING 1/2 |
| One stolen witness key | Withdraw a real warning | One withdrawal isn't a quorum: stays ACTIVE |
| The advisory's author | Edit or delete it | Readonly: no edit. Sealed: delete reverts |
| A witness | Delete their own confirmation | Clients that saw it keep counting it; deletion alarm |
| Mene's authors | Take the site down | No server: the CLI and any copy of the site read Arkiv directly |
| Time | Let advisories expire | Any wallet can pay for a Lifetime Extension (`mene keepalive`) |

## Honest limitations
- The demo witnesses are three testnet wallets controlled by the team. In production they would be independent organisations.
- Testnet only.
- The memory protects only clients that saw a confirmation before it was deleted; for everyone else, chain history is the backstop.
- npm and `package-lock.json` (v1–v3) only.

## Reproduce the on-chain state
All on-chain steps can run from GitHub Actions (**arkiv-onchain** workflow, tasks `spike` → `mirror` → `seed` → `attack`) with four funded testnet keys stored as repository secrets, or locally:
```bash
cp .env.example .env
npm run keys                 # generates 4 testnet wallets into .env, prints addresses only
# fund them at the faucet linked from https://docs.arkiv.network/networks/tiramisu/
npm run spike                # S0–S6 on-chain checks; results appended to arkiv/friction.md
npm run mirror -- --dry-run  # preview the OpenSSF records that will be inscribed (mirror-out/)
npm run mirror               # A inscribes the qix-incident records, B confirms (C too for chalk and debug)
npm run seed                 # false alarm flow + an untrusted forgery; writes witness addresses
npm run attack               # stolen-key demo
npm run smoke                # read-only checks against the live node
```

## Repo layout
```
packages/
  sdk/           @mene/sdk: OSV types, Arkiv reads/writes, quorum, lockfile parser, matcher, OpenSSF mirror
  cli/           mene-check (npm): the `mene` binary, plus `mene-check/lib` (check + config) used by the Action
action/          @mene/action: GitHub Action (action.yml + committed bundle in dist/)
site/            Astro static site → GitHub Pages
  src/pages/     landing · wall · advisory · check · witnesses
  tools/         preview-build helpers
arkiv/           schema.md · friction.md · evidence.md (hackathon deliverables)
docs/            SPEC · DESIGN · TASKS · SUBMISSION (Devfolio answers) · VIDEO (demo script)
scripts/         on-chain tooling: keys · spike · mirror · seed · attack · smoke
advisories/      Mene-original advisories (the synthetic false alarm)
examples/        demo lockfiles: scanned, never installed
brand/           logo, app icons and social images (see brand/README.md)
```

## Development
```bash
npm ci
npm run lint        # Biome: formatting + lint
npm run knip        # unused files, exports and dependencies
npm run typecheck
npm test
npm run build       # sdk → cli → action bundle
npm run site:build
```
CI runs all of these, plus actionlint on the workflows and a check that the committed Action bundle matches its source.

MIT licensed. Mirrored records come from OpenSSF malicious-packages under Apache-2.0; each keeps its source path in `database_specific.mene.source`.
