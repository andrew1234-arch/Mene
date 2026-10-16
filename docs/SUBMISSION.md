# Devfolio submission — draft answers

Paste into the Devfolio project form. Replace every **TODO**. Code links point at `main` (what judges grade), so merge the working branch before the deadline: **18 Oct 2026, 22:59 UTC**.

## Standard fields
- **Project name:** Mene
- **Tagline:** Warnings that can't be erased.
- **Tracks:** Security · Censorship Resistance · Open Source
- **Repo:** https://github.com/andrew1234-arch/Mene
- **Demo video:** TODO (≤ 3:00, script in [VIDEO.md](VIDEO.md))

### The problem it solves *
On 8 September 2025, the npm maintainer `qix` was phished. Malicious versions of 18 packages with more than 2.6 billion weekly downloads went out, including `chalk@5.6.1` and `debug@4.4.2`, which redirected crypto transactions in browsers. Teams learned about it from warnings on GitHub, npm and vendor blogs: platforms where one operator, one takedown or one more compromised account can edit, delete or fake a warning. A CI pipeline that trusts one advisory feed inherits that single point of failure.

Mene puts npm compromise advisories on Arkiv:
- **Sealed:** each advisory is a readonly entity sealed to the burn address, so nobody can edit or delete it, including its author.
- **Quorum:** it counts only when 2 of 3 independent witnesses confirm, and Mene reads confirmations by their immutable `$creator`.
- **Local:** your lockfile is matched in the browser, the CLI or a GitHub Action. It never leaves your machine, and the queries contain no package names.
- **Real from day one:** the qix-incident records are mirrored from OpenSSF malicious-packages, so it protects real projects now.

### Challenges I ran into *
- **Making "nobody can delete it" true.** `readonly` freezes content but still lets the owner delete. We move ownership to the burn address in the same atomic batch that creates the advisory. Keys are predicted with `predictEntityKeys` so the publisher's confirmation can point at the advisory in that same transaction.
- **A quorum hole found while writing the attack demo.** Counting only each witness's latest verdict let one stolen key withdraw and drop an ACTIVE advisory below quorum. Verdicts are now replayed in chain order: once 2 witnesses confirm at the same time the advisory is active, and only a withdrawal quorum undoes it. A witness can still retract a mistaken confirm before that (tests in `packages/sdk/test/quorum.test.ts`).
- **Personal data in public advisories.** OpenSSF records carry finder contact e-mails in `credits`. Arkiv entities are public and deletion isn't erasure, so the mirror drops `credits` and links the source record.
- **No backend, on purpose.** Every page, including the live feed and browser-wallet actions, runs from a static site straight against Tiramisu.

## Why this pillar? (one per track)
**Security.** Who is misled today: every team whose CI trusts one advisory source. One compromised maintainer or platform account can fake a warning or delete a real one, and readers can't tell. Mene shows and filters advisories only by their on-chain `$creator` and requires 2 of 3 trusted witnesses. Here is what that does to an attacker:
- **A forged advisory from an unknown wallet** never appears.
- **One stolen witness key** can't create a warning on its own, and can't withdraw an active one.
- **Deleting the advisory** reverts, because it's sealed.
- **Deleting a confirmation** raises a deletion alarm, and clients that saw it keep counting it.

From day one, a judge's own lockfile is checked against the real qix-incident records.

**Censorship Resistance.** Who is censored today: anyone relying on an advisory that a platform takes down or a hijacked account edits. With Mene, anyone can read and verify advisories straight from Arkiv: the static site, the CLI, the Action, or a raw `arkiv_query` (each advisory page shows the exact query and a `curl`). There is no Mene backend to shut down. Any wallet can pay to keep a warning alive past its 365-day Entity Expiration, and nobody can change it.

**Open Source.** Who benefits: anyone building security tooling, without asking permission. The data contract is the OpenSSF OSV format plus documented Arkiv attributes ([arkiv/schema.md](https://github.com/andrew1234-arch/Mene/blob/main/arkiv/schema.md)), with an MIT SDK (`@mene/sdk`) for reading, matching and the quorum rule. Mirrored OpenSSF records keep their Apache-2.0 attribution and source path in `database_specific.mene.source`.

## Arkiv questions

### 1. Live app URL *
TODO: the Vercel production URL (after the first deploy)

### 2. Does any team member hold Indian nationality? *
TODO

### 3. Why Arkiv? *
The whole point of Mene is that no single party controls a warning. Here's what breaks elsewhere:
- **Postgres or our own API:** we, a host or whoever steals our credentials can edit or delete an advisory, and readers can't tell. That's exactly how today's feeds fail.
- **IPFS:** content-addressing stops edits, but you can't query "attestations created by these witnesses" or "advisories with severity ≥ high since date X". Nothing proves who wrote what without extra infrastructure, and there's no lifetime model.
- **A subgraph:** needs a contract plus an indexer someone keeps running: another operator to trust or censor.

Without Arkiv, Mene falls apart at two points:
- The immutable `$creator` is the only thing that identifies a witness.
- `readonly` plus a transfer to the burn address is what makes an advisory undeletable.

Arkiv also gives us, in one layer:
- typed, range-queryable attributes;
- `permissionlessExtension`, so anyone can keep a warning alive;
- atomic batches, so a publish never lands half-done;
- WebSocket events for live deletion alarms.

**Deliberately off Arkiv:** lockfiles, dependency lists, which packages anyone uses, trust settings, CI results and keys. Queries carry only Mene's labels and witness addresses, never a package name.

### 4. How do you use Arkiv? * (feature → how and why → code)
- **Attributes vs payload.** OSV JSON in the payload. Everything we filter on is a typed attribute: `severity` i32 and `published_at` u64 for ranges; `advisory` key and `verdict` str on attestations. → [arkiv.ts#L186](https://github.com/andrew1234-arch/Mene/blob/main/packages/sdk/src/arkiv.ts#L193 "export function advisoryAttributes"), [schema.md](https://github.com/andrew1234-arch/Mene/blob/main/arkiv/schema.md)
- **`createdBy()` on every read.** Attestations are read per trusted witness, so forged look-alikes never appear. → [arkiv.ts#L51](https://github.com/andrew1234-arch/Mene/blob/main/packages/sdk/src/arkiv.ts#L58 "export function attestationQuery")
- **Cursor pagination.** Each witness's attestations are paged until `hasNextPage()` is false. → [arkiv.ts#L102](https://github.com/andrew1234-arch/Mene/blob/main/packages/sdk/src/arkiv.ts#L109 "export async function readAttestations")
- **Range queries.** The Advisories page's minimum-severity and published-since filters run `gte("severity", i32)` and `gte("published_at", u64)` on Arkiv, also pinned per witness. → [advisories/index.astro](https://github.com/andrew1234-arch/Mene/blob/main/site/src/pages/advisories/index.astro)
- **Creation flags.** `readonly`: witnesses confirm text that can never change ("Content frozen" badge). `permissionlessExtension`: anyone can extend ("Keep alive", `mene keepalive`). → [arkiv.ts#L214](https://github.com/andrew1234-arch/Mene/blob/main/packages/sdk/src/arkiv.ts#L221 "flags: { readonly: true, permissionlessExtension: true }")
- **`$owner` transfer (seal).** In the publish batch, ownership moves to `0x…dEaD` ("Sealed" badge; the stolen-key delete reverts). → [arkiv.ts#L256](https://github.com/andrew1234-arch/Mene/blob/main/packages/sdk/src/arkiv.ts#L263 "ownershipChanges: sealMode")
- **Atomic batch + `predictEntityKeys`.** Advisory, the publisher's confirmation pointing at the predicted key, and the seal land in one transaction. → [arkiv.ts#L234](https://github.com/andrew1234-arch/Mene/blob/main/packages/sdk/src/arkiv.ts#L241 "export async function publishAdvisory")
- **Entity Expiration + permissionless Lifetime Extension.** Advisories and attestations live 365 days; any wallet can renew them. Keepalive skips entities that already live longer, so one can't revert the batch. Each advisory's Verify panel shows the countdown and who last paid. → [arkiv.ts#L279](https://github.com/andrew1234-arch/Mene/blob/main/packages/sdk/src/arkiv.ts#L286 "export async function keepalive")
- **WebSocket entity events.** The Advisories page's live activity panel uses `watchEntityEvents` over `webSocket()` with no `fromBlock`. It shows new advisories, confirmations, seals and extensions as they land, raises red deletion alarms, and re-reads the list without a refresh. → [advisories/index.astro](https://github.com/andrew1234-arch/Mene/blob/main/site/src/pages/advisories/index.astro)

### 5. Friction report *
https://github.com/andrew1234-arch/Mene/blob/main/arkiv/friction.md

### 6. Wallet addresses that create your Arkiv entities *
TODO, from [arkiv/evidence.md](https://github.com/andrew1234-arch/Mene/blob/main/arkiv/evidence.md) after the mirror and seed runs:
- **Witness A:** inscribes the mirrored OpenSSF records; confirms then withdraws the false alarm.
- **Witness B:** confirms every mirrored record.
- **Witness C:** confirms chalk and debug; inscribes and withdraws the synthetic false alarm.
- **Keeper (untrusted):** permissionless Lifetime Extension; publishes the forged advisory that must never appear.

### 7. Link to /arkiv/schema.md *
https://github.com/andrew1234-arch/Mene/blob/main/arkiv/schema.md

### 8. How can judges reproduce your Arkiv usage? *
Start at **/trust** on the live app: it answers who confirms a warning, what a hacked witness can and can't do, why a warning can't be deleted, what Mene sees about you, and where the data lives, each with a "verify it yourself" panel and the raw `arkiv_query`.
1. **Advisories**: the qix-incident records (`MAL-2025-…`, OpenSSF mirror) show **Confirmed**; tick *Show withdrawn* to see `MENE-2026-0001` (tagged *Test advisory*) as **Withdrawn**.
2. Open one advisory → **Verify this advisory**: the witness timeline (each verdict with block and explorer link), *Content frozen* and *Sealed* badges, Entity Expiration countdown and "Kept alive by", and the exact SDK query and `curl`:
   `project = str('mene-v1') AND type = str('attestation') AND $creator = addr(<witness>)`
3. **Check** → *Try an example*. It finds chalk 5.6.1 and debug 4.4.2 and gives `npm install chalk@5.6.0` and `npm install debug@4.4.1`. Or paste a public GitHub repo URL, or drop your own `package-lock.json`.
4. On the explorer, an advisory's owner is `0x000000000000000000000000000000000000dEaD` and its flags are readonly + permissionlessExtension.
5. The keeper's forged advisory exists on chain (evidence.md) but never appears in Advisories.
6. CLI: `npx mene-check check` in any project (or from the repo: `npm ci && npm run build && node packages/cli/dist/index.js check --lockfile examples/chalk-attack/package-lock.json` exits 1; `examples/clean` exits 0).
7. CI: run the **chalk-attack-demo** workflow. The poisoned lockfile fails and the clean one passes.

### 9. Pre-existing work you reused *
None. All code was written during the hackathon (repo history starts 14 Oct 2026). Third-party libraries: @arkiv-network/sdk, viem, semver, commander, Astro, vitest, tsup. Data: OpenSSF malicious-packages records (Apache-2.0), mirrored with attribution.

### 10. Arkiv surfaces you used *
TypeScript SDK, Direct JSON-RPC, WebSocket events, Docs, Faucet, Block Explorer

### 12. How long until your first Arkiv entity? *
TODO (depends on when the wallets were funded)

### 13. Which LLMs did you use? *
Claude (Claude Code)

### 14. The one thing Arkiv should improve first *
TODO: pick from friction.md after the spikes. Current candidate: "readonly ≠ undeletable" should be stated prominently, with sealing (transfer to an unspendable address) documented as a supported pattern.

### 15–18
TODO: feedback call yes/no; confirm team work 9–18 Oct; confirm public MIT repo; Devcon (optional).
