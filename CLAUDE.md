# CLAUDE.md — Mene

You are building **Mene**, a censorship-resistant, quorum-signed npm compromise advisory system on Arkiv, for the Arkiv Global Tour Stop hackathon. Read docs/SPEC.md (what), docs/DESIGN.md (web pages), docs/TASKS.md (order), arkiv/schema.md (data contract). The hackathon's agent guide (https://github.com/Arkiv-Network/global-tour-stop-pre-devcon/blob/main/AGENTS.md) overrides this file if they conflict.

**Scope: do everything you can.** Code, tests, seeding, the CLI, the Action, every web page and its copy, docs, README, demo video script, and drafted Devfolio answers. Only stop to ask the user for things you cannot do: funding wallets, recording the video, submitting on Devfolio, or a SPIKE fallback that changes the product promise.

## Scoring strategy (from docs/scoring-rubric.md — read it)
- Judges score **how and why** each Arkiv feature is used, **not how many**. A feature claimed but not found on chain or in code **counts against us**. Never add a feature for show.
- Every Arkiv feature used must change something the user sees, and `arkiv/schema.md` must say why we chose it.
- Friction report = 25/100. Every spike result goes in with expected vs actual, versions and repro steps; smooth paths documented that rigorously score the same as bugs.
- Ties go to "Why Arkiv?" and then "How you use Arkiv". The seal plus `$creator` story is our "falls apart without Arkiv" argument; lead with it.
- Minimum 50/100 to win. We enter three tracks: Security, Censorship Resistance, Open Source.

## Hard deadline
Submissions close **18 Oct 2026, 22:59 UTC** (23:59 London / 23:59 Lagos). Judges grade the commit SHA at the deadline. **Never rewrite git history** (it disqualifies the entry). Code freeze: 18 Oct 18:00 UTC.

## Gates (fail any = not scored)
Public deployment on Tiramisu that judges can use without asking for access · reproducible steps + exact queries · public repo, MIT · `/arkiv/schema.md` · `/arkiv/friction.md` · wallet addresses that create entities · demo video ≤ 3 min · built 9–18 Oct. A CLI alone fails "it works": the web app is mandatory.

## Network & SDK (verified)
- Tiramisu testnet, chain ID `7738577` (`0x7614d1`)
- HTTP RPC `https://rpc.tiramisu.db-chain.testnet.arkiv.network` · WS `wss://rpc.tiramisu.db-chain.testnet.arkiv.network`
- Explorer `https://tiramisu.explorer.arkiv.network` · Docs `https://docs.arkiv.network/networks/tiramisu/` (faucet linked there)
- `@arkiv-network/sdk` **0.8.x** (0.8.1 verified); `viem@^2` is a required peer dependency.

## SDK facts — do not reinvent (verified in 0.8.1 types)
- Imports:
  - `createPublicClient, createWalletClient, ExpirationTime, jsonToPayload, NoEntityFoundError` from `@arkiv-network/sdk`
  - `tiramisu` from `@arkiv-network/sdk/chains`
  - `and, or, eq, ne, gt, gte, lt, lte, not, exists, startsWith` from `@arkiv-network/sdk/query`
  - `str, i32, u64, u256, dec, addr, key, bytes32, bool` from `@arkiv-network/sdk/attr`
  - `http, webSocket, keccak256, toBytes` from `viem`; `privateKeyToAccount` from `viem/accounts`
- Queries: `pub.select("*").where(and(...)).createdBy(addr).limit(n).fetch()` → `{ entities, cursor, blockNumber }`; page with `result.next()`. **No server-side ordering.** Max 200 per page. Ranges only on numeric types. **Payload is not queryable.**
- Limits: `str` ≤ 128 bytes · ≤ 32 attributes · attribute name ≤ 32 bytes · payload ≤ 131072 bytes.
- `createEntity({ payload, contentType, expires, attributes, flags, salt })`. `flags: { readonly, permissionlessExtension }` are fixed for life.
  - `readonly`: payload and attributes can never change. Extend, ownership transfer and **delete still work** for the owner.
  - `permissionlessExtension`: **any** address may extend the expiry; nobody else can modify.
- `executeBatch({ creates, patches, deletes, extensions, ownershipChanges })` is atomic → `{ txHash, createdEntities, ... }`.
- `pub.predictEntityKeys({ owner, count })` → `[{ key, salt }]`. It is on the **public** client, not the wallet client. Pass the same `salt` into each create.
- `extendEntity` **sets** a new expiry counted from now, and reverts if it isn't later than the current one.
- `ExpirationTime.fromDays/fromYears/atDate/atBlock/permanent()`; durations are approximate (2 s nominal block time).
- Trust comes from `$creator` (immutable). `$owner` is mutable. Anyone can write our attribute labels, so **every read is pinned with `.createdBy(trustedIssuer)`**.
- `watchEntityEvents` opens a real socket only with `webSocket()` and **no `fromBlock`**; over HTTP it silently polls.
- `getEntity(key)` throws `NoEntityFoundError` for never-existed, deleted and expired alike.
- Deletion and expiry are not erasure: the creating transaction's payload stays in chain history.
- The SDK depends on `brotli-wasm`. Browser bundling is **SPIKE S7**.

## Vocabulary (organizers require it)
Say "Entity Expiration", "Lifetime Extension", "Arkiv entities", "the Web3 database". **Never say TTL.**

## Security rules
- Keys only in env vars (`MENE_ISSUER_A_KEY` …). Never in code, entities, logs, commits or docs.
- No real personal data in Arkiv. The false-alarm demo uses a synthetic package name.
- The demo **never installs** malicious versions; it only scans fixture lockfiles.

## Working rules
- Update `/arkiv/friction.md` as you hit things (expected vs actual, versions, repro). Invented complaints score 0; rigorously documented smooth paths score the same as issues.
- Every Arkiv feature used must change something the user sees.
- When a SPIKE fails, apply its fallback, log it in friction.md, and keep going.
- Commit small and often to `main`.
