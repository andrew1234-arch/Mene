# Mene — Spec

## One-liner
Quorum-witnessed npm compromise advisories, written on Arkiv where no registry, company or hacked account can erase them, matched locally against your lockfile and enforced in CI.

## Tracks
Enter **three**: **Security**, **Censorship Resistance**, **Open Source**. Only "Why this pillar?" is scored per track; the other three criteria are shared. One prize max per team.

## Problem (verified)
- On 8 Sep 2025, maintainer Josh Junon (npm `qix`) was phished via a fake `npmjs.help` 2FA email. Malicious versions of 18 packages (>2.6B combined weekly downloads) were published, including **chalk@5.6.1** and **debug@4.4.2**.
- debug@4.4.2's payload redirected crypto transactions in browsers. It is tracked as GHSA-4x49-vf9v-38px / CVE-2025-59144 / MAL-2025-46974. The owner later published a clean patch version above the compromised one.
- Known-good downgrades: chalk 5.6.0, debug 4.4.1.
- Today's warnings live on GitHub/npm/vendor sites that an operator, a takedown or a compromised account can edit or delete.

## The name (for landing copy)
In Daniel 5 a hand writes four words on the palace wall during a feast: *Mene* (numbered), *Tekel* (weighed), *Upharsin* (divided). Mene maps them to the product:
- **Mene — numbered:** every advisory is written to Arkiv and counted.
- **Tekel — weighed:** independent witnesses weigh it; 2 of 3 must confirm.
- **Upharsin — divided:** the poisoned version is cut from your build.

## Pitch answers (draft for Devfolio)
- **Why Security?** Teams whose CI trusts one advisory source can be misled: one compromised maintainer or platform account can fake a warning or delete a real one. Mene shows and filters advisories by on-chain `$creator` and requires 2-of-3 trusted issuers, so one hacked issuer can neither forge nor bury a warning.
- **Why Censorship Resistance?** Anyone can read and verify advisories straight from Arkiv, via the CLI or the static site. There is no Mene backend to shut down.
- **Why Open Source?** Anyone can build on the advisory dataset without asking permission. The data contract is the OpenSSF OSV format plus documented Arkiv attributes (arkiv/schema.md) and an MIT SDK. Records mirrored from OpenSSF malicious-packages keep their Apache-2.0 attribution.
- **Why Arkiv / what breaks elsewhere?**
  - Postgres or our own API: the operator can edit or delete.
  - IPFS: no queries by issuer or status, no ownership, no Entity Expiration semantics.
  - A subgraph: needs a contract plus an indexer we run.
  - Arkiv gives queryable typed attributes, an immutable `$creator`, readonly entities, permissionless Lifetime Extension and atomic batches in one layer.
- **Deliberately off Arkiv:** lockfiles, dependency lists, which packages a user runs, trust lists, keys. Queries never contain a package name.

## Architecture
npm workspaces, TypeScript strict, Node ≥ 20, vitest, tsup.
```
packages/sdk     @mene/sdk  — OSV payload types, attributes, Arkiv read/write, quorum, lockfile, matcher
packages/cli     @mene/cli  — bin: mene
action/          GitHub Action (action.yml + bundled dist/, node20)
site/            Astro static site → GitHub Pages (see DESIGN.md)
examples/chalk-attack/package-lock.json   fixture, never installed
examples/clean/package-lock.json          control fixture
arkiv/           schema.md, friction.md, evidence.md
scripts/         spike.ts, seed.ts, mirror.ts
```

## Advisory format: OSV-compatible
The advisory payload follows the OpenSSF **OSV schema** (the format used by osv.dev and the GitHub Advisory Database), with Mene fields under `database_specific`. OSV already has `withdrawn`, `aliases`, `affected[].package`, `versions` and `references`, so Mene advisories can be consumed by OSV tooling. That is the Open Source pillar's "documented data contract".

## Data model (full contract in arkiv/schema.md)
| Entity | Flags | Lifetime | Notes |
|---|---|---|---|
| **advisory** | readonly, permissionlessExtension | 365 days | sealed to the burn address (SPIKE S1) |
| **attestation** | readonly, permissionlessExtension | 365 days | `verdict: confirm \| withdraw`, points at an advisory key |

**Publish is one atomic `executeBatch`:**
1. create the advisory
2. create the publisher's own `confirm` attestation
3. (SPIKE S1) transfer advisory ownership to `0x000000000000000000000000000000000000dEaD`, so even the issuer's key can't delete it

### Arkiv features → what the user sees
| Feature | Use | Visible as |
|---|---|---|
| Typed attributes vs payload | Filters in attributes (`severity` i32, `publishedAt` u64), OSV JSON in the payload | Severity and date range filters |
| `createdBy()` | Every query pinned to a trusted issuer | Untrusted forgeries never appear; witness badges show creator addresses |
| readonly | An attestation commits to an advisory whose content can never change | "Inscribed — content frozen" badge |
| permissionlessExtension | Anyone runs `mene keepalive` | Expiry countdown and "kept alive by 0x…" |
| Entity Expiration | 365 d, renewable by anyone (warnings must outlive their publisher) | Expiry countdown on every advisory |
| Ownership transfer (SPIKE) | Sealed to the burn address | "Sealed — no one can erase it" badge |
| Batch writes | Publish lands atomically | No half-published advisory ever exists |
| WebSocket events | Live strip on the Wall plus deletion alarms | Wall updates without refresh |

## Real data from day one: OpenSSF mirror
- Source: `github.com/ossf/malicious-packages` (Apache-2.0, OSV format; npm records under `osv/malicious/npm/<package>/MAL-*.json`). Verified to contain `MAL-2025-46974` (debug 4.4.2, schema_version 1.5.0).
- `scripts/mirror.ts` imports a **curated** set: npm **account-takeover** compromises of established packages, starting with every package from the Sept 2025 qix incident. Skip the bulk typosquat records: cost per entity, and they add volume, not value.
- Records are inscribed **as-is**: original OSV JSON in the payload, plus `database_specific.mene.source = { repo, path, license: "Apache-2.0" }`. Then they are confirmed by a second witness.
- Result: a judge runs `mene check` on their own project and is protected by real data today. This is the "what changes from day one" answer.

## Quorum algorithm (`resolveStatus`)
Inputs: trusted issuers T, threshold k (default 2).
1. For each t ∈ T, page `select("*").where(and(eq("project","mene-v1"), eq("type","attestation"))).createdBy(t)`.
2. Group by `advisory` key. Keep each issuer's **latest** attestation per advisory (highest `createdAt`).
3. confirmers = distinct issuers whose latest verdict is `confirm`; withdrawers = those with `withdraw`.
4. Status: `WITHDRAWN` if |withdrawers| ≥ k; else `ACTIVE` if |confirmers| ≥ k; else `PENDING n/k`.
   *Amendment (found while writing the attack demo, 14 Oct):* with "latest verdict" alone, one stolen key can withdraw and drop an ACTIVE advisory below quorum. The code replays verdicts in chain order: once k witnesses confirm at the same time the advisory is activated, and only a withdrawal quorum (step 4's WITHDRAWN) undoes it. Before activation, a witness can still retract its own confirm. Tests: `packages/sdk/test/quorum.test.ts`.
5. `getEntity(key)` for each advisory. Its creator need not be trusted: readonly plus key-pinned attestations make that safe. Reject it if not readonly or schema-invalid.
6. **Anti-burial cache** (`~/.cache/mene/state.json`; `actions/cache` in CI):
   - Store every advisory and confirm ever seen.
   - A vanished confirm still counts unless a withdraw quorum exists.
   - A seen advisory that disappears becomes `MISSING (was ACTIVE)` and is still enforced (fail closed).
   - The site raises `EntityDeleted` alarms.

## Matching
- Parse `package-lock.json` v2/v3 (`packages` map; `node_modules/<name>`, nested and scoped). v1 is a stretch goal.
- Match if `semver.satisfies(installed, range)` or exact `versions[]` contains it, for ACTIVE/MISSING npm advisories with the same package name.
- Exit codes: `0` clean · `1` match ≥ `--min-severity` · `2` error. No network and no cache → exit 2 (fail closed). Network down with a cache → warn and use the cache.

## CLI (`mene`)
```
mene check   [--lockfile ./package-lock.json] [--config mene.config.json] [--min-severity low] [--json] [--offline]
mene list    [--status active|pending|withdrawn|all] [--json]
mene verify  <advisoryKey>          # creator, owner, flags, expiry, witnesses + tx hashes, explorer links
mene publish <advisory.osv.json>    # issuer; env MENE_ISSUER_KEY
mene attest  <advisoryKey> --confirm | --withdraw [--reason "..."]
mene keepalive [--all | <key>]      # permissionless Lifetime Extension; env MENE_KEEPER_KEY
```
`mene.config.json`: `{ "issuers": ["0x…","0x…","0x…"], "threshold": 2, "minSeverity": "low" }`. The default config ships with the 3 demo witness addresses.

## GitHub Action
`action.yml` (node20, committed `dist/index.js`). Inputs: `lockfile`, `issuers`, `threshold`, `min-severity`. Writes the match table to the job summary and fails on a match. Demo workflow `.github/workflows/chalk-attack-demo.yml` runs on `examples/chalk-attack` (red) and `examples/clean` (green).

## Demo script (≤ 3 min)
1. 20 s — the chalk/debug story; warnings live where they can be edited or deleted.
2. 30 s — witness A inscribes the chalk advisory (one tx). The wall shows PENDING 1/2. CI passes.
3. 30 s — witness B confirms. The wall flips to ACTIVE live. CI goes **red**: chalk 5.6.1 → 5.6.0.
4. 30 s — attack: A's key is "stolen".
   - Deleting the advisory fails (sealed).
   - Deleting A's attestation: Mene still counts it from the cache and the wall shows a deletion alarm.
   - A forged advisory from an untrusted wallet never appears.
5. 25 s — false alarm (synthetic package) withdrawn by 2 witnesses → WITHDRAWN, history intact.
6. 25 s — real data: the Wall shows the mirrored OpenSSF records. Drop a real lockfile on `/check` (it stays local; queries carry no package names). A stranger's wallet keeps an advisory alive. Close.

## Honest limitations (README)
- Demo witnesses are 3 team-controlled testnet wallets; in production they'd be independent organisations.
- Testnet only.
- The cache protects only clients that saw a confirmation; chain history remains the backstop.
