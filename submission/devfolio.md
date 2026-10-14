# Devfolio submission — draft answers

Paste these into the Devfolio project form. Replace every **TODO**. Code links point at `main`, which is what judges grade, so merge the working branch before the deadline (18 Oct 2026, 22:59 UTC).

## Standard fields

- **Project name:** Mene
- **Tagline:** The writing on the wall for poisoned packages.
- **Tracks:** Security (primary), Censorship Resistance, Open Source
- **Repo:** https://github.com/andrew1234-arch/Mene
- **Demo video:** TODO (≤ 3 min; script in [demo-script.md](demo-script.md))

### The problem it solves *
On 8 September 2025, the npm maintainer `qix` was phished. Within hours, malicious versions of 18 packages with more than 2.6 billion weekly downloads were published, including `chalk@5.6.1` and `debug@4.4.2`, which redirected crypto transactions in browsers.

Teams found out from warnings on GitHub, npm and vendor blogs. Those are platforms where one operator, one takedown request or one more compromised account can edit, delete or fake a warning. A CI pipeline that trusts one advisory feed inherits that single point of failure.

Mene puts npm compromise advisories on Arkiv:
- **Readonly and sealed:** each advisory is a readonly entity sealed to the burn address, so nobody can edit or delete it, including its author.
- **Quorum:** an advisory counts only when *k* of *n* independent witnesses confirm it. Mene reads it filtered by the witnesses' immutable `$creator`.
- **Local matching:** your lockfile is matched in the browser, CLI or GitHub Action. It never leaves your machine, and the queries contain no package names.

One hacked witness can neither forge a warning nor bury a real one.

### Challenges I ran into *
- **Making "nobody can delete it" true.** `readonly` freezes content, but the owner can still delete. We transfer ownership to the burn address in the same atomic batch that creates the advisory. Keys are predicted with `predictEntityKeys` so the confirmation can point at the advisory in that same transaction.
- **A quorum hole we found while writing the attack demo.** With "latest verdict per witness", one stolen key could withdraw and drop an ACTIVE advisory below quorum. Confirmations are now sticky until a withdrawal quorum exists (regression test in `packages/sdk/test/quorum.test.ts`).
- **Anti-burial.** A witness can still delete its own confirmation. Clients remember what they've seen and keep counting it, and the site raises a deletion alarm.
- **No backend, on purpose.** Everything, including browser-wallet publishing, runs from a static site straight against Tiramisu.

## Arkiv questions

### 1. Live app URL *
TODO: https://andrew1234-arch.github.io/Mene/ (after merging to `main` and enabling GitHub Pages → Source: GitHub Actions)

### 2. Does any team member hold Indian nationality? *
TODO

### 3. Why Arkiv? *
The whole point of Mene is that no single party controls the warning. Here's what breaks elsewhere:
- **Postgres or our own API:** we, a host, or whoever steals our credentials can edit or delete an advisory, and readers can't tell. That's exactly the failure mode of today's advisory feeds.
- **IPFS:** content-addressing stops edits, but you can't query "attestations created by these witnesses" or "advisories with severity ≥ high since date X". Nothing proves who wrote what without extra infrastructure, and there's no lifetime model.
- **A subgraph:** needs a contract plus an indexer someone keeps running, which is another operator to trust or censor.

What we get only from Arkiv, in one layer:
- typed, queryable attributes (numeric ranges for severity and date);
- an immutable `$creator` to pin trust on;
- `readonly` entities plus ownership transfer (sealing);
- `permissionlessExtension`, so any stranger can pay to keep a warning alive;
- atomic batches, so a publish never lands half-done;
- WebSocket entity events for live deletion alarms.

**Deliberately off Arkiv:** lockfiles, dependency lists, which packages anyone uses, users' trust settings, and keys. Queries carry only Mene's fixed labels and witness addresses, never a package name. The lockfile is matched locally.

### 4. How do you use Arkiv? * (feature → how/why → code)
- **Attributes vs payload.** The OSV advisory JSON is the payload. Everything we filter on is a typed attribute: `severity` i32 (1–4) and `publishedAt` u64 for range filters; `advisory` key and `verdict` str on attestations. → [arkiv.ts#L183-L194](https://github.com/andrew1234-arch/Mene/blob/main/packages/sdk/src/arkiv.ts#L184-L193), [arkiv/schema.md](https://github.com/andrew1234-arch/Mene/blob/main/arkiv/schema.md)
- **Queries with `createdBy()`.** Every read is pinned to a trusted witness: `project = 'mene-v1' AND type = 'attestation' AND $creator = addr(W)`. Forged advisories with our labels never appear. → [arkiv.ts#L52](https://github.com/andrew1234-arch/Mene/blob/main/packages/sdk/src/arkiv.ts#L52)
- **Cursor pagination.** We page every witness's attestations until `hasNextPage()` is false. → [arkiv.ts#L102-L121](https://github.com/andrew1234-arch/Mene/blob/main/packages/sdk/src/arkiv.ts#L102-L121)
- **Range queries.** The Wall's "minimum severity" and "published since" filters run `gte("severity", i32)` and `gte("publishedAt", u64)` on Arkiv, also pinned per witness. → [wall.astro](https://github.com/andrew1234-arch/Mene/blob/main/site/src/pages/wall.astro)
- **Creation flags.** Advisories and attestations are `readonly`, so witnesses sign off on content that can never change, shown as a "Content frozen" badge. They're also `permissionlessExtension`, so anyone can run `mene keepalive` or press "Keep alive". → [arkiv.ts#L279](https://github.com/andrew1234-arch/Mene/blob/main/packages/sdk/src/arkiv.ts#L279)
- **`$creator` / `$owner` and ownership transfer.** Trust comes from `$creator`. In the publish batch, advisory ownership moves to `0x…dEaD`, so even the author's key can't delete it ("Sealed" badge). → [arkiv.ts#L284](https://github.com/andrew1234-arch/Mene/blob/main/packages/sdk/src/arkiv.ts#L284)
- **Batch writes.** Publishing is one atomic `executeBatch`: advisory, the publisher's confirmation (pointing at the predicted key via `predictEntityKeys`), seal, and issuer-lease renewal. → [arkiv.ts#L261-L292](https://github.com/andrew1234-arch/Mene/blob/main/packages/sdk/src/arkiv.ts#L261-L292)
- **Entity Expiration per type.** Advisories and attestations last 365 days. Issuer profiles hold a 30-day lease. → [constants.ts](https://github.com/andrew1234-arch/Mene/blob/main/packages/sdk/src/constants.ts)
- **Lifetime Extension as a lease.** Every publish and attestation renews the witness's 30-day lease in the same batch. Witnesses whose lease lapses show as inactive. → [arkiv.ts#L226-L241](https://github.com/andrew1234-arch/Mene/blob/main/packages/sdk/src/arkiv.ts#L226-L241), [witnesses.astro](https://github.com/andrew1234-arch/Mene/blob/main/site/src/pages/witnesses.astro)
- **Permissionless Lifetime Extension.** `keepalive` lets any wallet extend advisories, skipping ones that already live longer. The advisory page shows who last paid for an extension. → [arkiv.ts#L314](https://github.com/andrew1234-arch/Mene/blob/main/packages/sdk/src/arkiv.ts#L314)
- **WebSocket entity events.** `/live` uses `watchEntityEvents` over a `webSocket()` transport with no `fromBlock`. It shows inscriptions, confirmations, seals and extensions as they land, and raises a red alarm when a remembered advisory or confirmation is deleted. → [live.astro](https://github.com/andrew1234-arch/Mene/blob/main/site/src/pages/live.astro)

### 5. Friction report *
https://github.com/andrew1234-arch/Mene/blob/main/arkiv/friction.md

### 6. Wallet addresses that create your Arkiv entities *
TODO: copy from [arkiv/evidence.md](https://github.com/andrew1234-arch/Mene/blob/main/arkiv/evidence.md) after seeding:
- Witness A: publishes the chalk and debug advisories, confirms the false alarm, then withdraws it
- Witness B: confirms chalk and debug
- Witness C: publishes the synthetic false alarm and withdraws it
- Forger (untrusted): publishes forged advisories that must never appear
- Keeper: any wallet; demonstrates permissionless Lifetime Extension

### 7. Link to /arkiv/schema.md *
https://github.com/andrew1234-arch/Mene/blob/main/arkiv/schema.md

### 8. How can judges reproduce your Arkiv usage? *
1. Open the live app, then **The Wall**. chalk 5.6.1 and debug 4.4.2 show **ACTIVE** (2 of 2 confirmations); the false alarm shows **WITHDRAWN**.
2. On the home page, click **Try an example: poisoned**. It finds chalk 5.6.1 and debug 4.4.2 and gives `npm install debug@4.4.1 chalk@5.6.0`.
3. Open an advisory and expand **Verify it yourself**. It shows the exact query; run it with the SDK or the `curl` shown:
   `project = str('mene-v1') AND type = str('attestation') AND $creator = addr(<witness>)`
4. On the explorer, the advisory's owner is `0x000000000000000000000000000000000000dEaD` and its creation flags are readonly + permissionlessExtension.
5. The forger's advisory exists on chain (see evidence.md) but never appears on the Wall.
6. CLI: `npm ci && npm run build && node packages/cli/dist/index.js check --lockfile examples/chalk-attack/package-lock.json` exits 1; the `clean` fixture exits 0.
7. CI: run the **chalk-attack-demo** workflow. The poisoned lockfile fails and the clean one passes.

### 9. Pre-existing work you reused *
None. Everything was written during the hackathon (repo history starts on 14 Oct 2026). Third-party libraries only: @arkiv-network/sdk, viem, semver, commander, Astro + Starlight, vitest, tsup.

### 10. Arkiv surfaces you used *
TypeScript SDK, Direct JSON-RPC (documented curl in "Verify it yourself"), WebSocket events, Docs, Faucet, Block Explorer

### 12. How long until your first Arkiv entity? *
TODO (depends on when the wallets got funded)

### 13. Which LLMs did you use? *
Claude (Claude Code)

### 14. The one thing Arkiv should improve first *
TODO — candidates from friction.md once the on-chain spikes have run. For example: `ExpiryExtendedEvent` doesn't say who paid for an extension, so apps must fetch the transaction to credit keepers.

### 15–17
TODO (feedback call yes/no; confirm team work 9–18 Oct; confirm public MIT repo)
