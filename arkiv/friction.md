# Friction report — Mene
Format: **Surface · Version · Expected · Actual · Repro · Suggested fix**. Added throughout the build; smooth paths are documented with the same rigour.

## 1. `predictEntityKeys` lives on the public client, not the wallet client
- **Surface:** TypeScript SDK
- **Version:** @arkiv-network/sdk 0.8.1, viem 2.x, TS 5.x
- **Expected:** to call it on the wallet client that sends the batch. The JSDoc uses a generic `client.predictEntityKeys(...)` beside `client.executeBatch(...)`.
- **Actual:** `TS2339: Property 'predictEntityKeys' does not exist` on the wallet client. It works on `createPublicClient(...)`. Confirmed in source: `clients/decorators/arkivWallet.ts` exposes only create/patch/delete/extend/changeOwnership/executeBatch.
- **Repro:** `createWalletClient({ chain: tiramisu, transport: http(), account }).predictEntityKeys({ owner, count: 2 })`
- **Fix:** expose it on the wallet client, or name the client type in the JSDoc.

## 2. "readonly" does not prevent deletion
- **Surface:** SDK types/docs (`CreationFlags`)
- **Version:** 0.8.1
- **Expected (from the name):** immutable for the entity's lifetime.
- **Actual (type docs, `entity/flags.ts`):** "The entity's attributes and payload can never be changed — only its expiry extended, its ownership transferred, and the entity deleted." Tamper-evident apps must handle deletion separately (we seal via ownership transfer; SPIKE S1).
- **Fix:** state "readonly ≠ undeletable" prominently, and document whether transfer to an unspendable address is a supported sealing pattern.

## 3. ✅ Live node accepts every Mene query (read-only smoke test)
- **Surface:** JSON-RPC `arkiv_query`, `eth_chainId`, `arkiv_getBlockTiming`, SDK query builder
- **Version:** @arkiv-network/sdk 0.8.1, viem 2.57.5, Node 22, GitHub Actions ubuntu-latest; 2026-10-14 12:24 UTC ([run 38563462245](https://github.com/andrew1234-arch/Mene/actions/runs/38563462245))
- **Expected:** the rendered query strings (`builder.toString()`) parse on the node; range predicates on `i32`/`u64` combine with `$creator`; an empty result has no cursor; `getEntity` on an unknown key throws `NoEntityFoundError`.
- **Actual:** all as expected.

  | Call | Result | Latency |
  |---|---|---|
  | `eth_chainId` | `7738577` | 4142 ms (first request, includes TLS/DNS warm-up) |
  | `eth_blockNumber` | `565449` | 151 ms |
  | `arkiv_getBlockTiming` | `{ currentBlock: 565449, blockDuration: 2 }` | 155 ms |
  | `project = str('mene-v1') AND type = str('attestation') AND $creator = addr(…)` | 0 rows, `cursor: null` | 172 ms |
  | `… type = str('advisory') AND severity >= i32(3) AND publishedAt >= u64(1700000000) AND $creator = addr(…)` | 0 rows | 165 ms |
  | `getEntity(0x…01)` (never existed) | `NoEntityFoundError` | 153 ms |
- **Repro:** `npx tsx scripts/smoke.ts 0x<any address>` or run the `arkiv-smoke` workflow.
- **Fix:** none needed. One naming note: `getBlockTiming()` returns camelCase (`currentBlock`, `currentBlockTime`, `blockDuration`) while `types/rpcSchema.ts` types the raw RPC as `current_block`, `current_block_time`, `duration`. Callers of raw `arkiv_getBlockTiming` should expect the snake_case form.

## 4. ✅ Browser bundle needs no wasm plugin (SPIKE S7)
- **Surface:** SDK in an Astro 7 / Vite browser build
- **Version:** @arkiv-network/sdk 0.8.1, astro 7.3.8
- **Expected:** `brotli-wasm` (a dependency) would need `vite-plugin-wasm` or a fallback to raw `fetch`.
- **Actual:** `utils/compression.ts` (the only `brotli-wasm` importer) is not imported by any action in 0.8.1, and in Node it uses `node:zlib` first. A stock Astro build bundles the SDK; reads and browser-wallet writes work with no plugin. Verified in Chromium: the query builder runs, and an injected EIP-1193 wallet receives `wallet_addEthereumChain` for `0x7614d1` and then one `eth_sendTransaction` to the Arkiv contract carrying the whole batch.
- **Repro:** `npm run site:build`, open any page; for writes see `site/src/scripts/wallet.ts` (`createWalletClient({ chain: tiramisu, transport: custom(window.ethereum), account })`).
- **Fix:** none needed. If compression is intended for writes, it is currently dead code; if not, `brotli-wasm` could be dropped from `dependencies`.

## 5. ✅ Injected wallets need the chain switched first
- **Surface:** SDK `executeBatch` via viem `writeContract` with a JSON-RPC account
- **Version:** 0.8.1, viem 2.57.5
- **Expected:** a browser wallet on another chain would be prompted to switch by the SDK.
- **Actual:** viem's `assertCurrentChain` rejects the write (surfacing as `EntityMutationError: Transaction failed: Execution error without revert data`) when the wallet reports another chain. We call `wallet_switchEthereumChain`, then `wallet_addEthereumChain` on error 4902, before writing.
- **Repro:** connect a wallet on mainnet and call `executeBatch` through `custom(window.ethereum)`.
- **Fix:** surface viem's `ChainMismatchError` message instead of the generic "Execution error without revert data".

## 6. `ExpiryExtendedEvent.owner` is not who paid for the extension
- **Surface:** `watchEntityEvents` event types
- **Version:** 0.8.1
- **Expected:** to credit the wallet that applied a permissionless Lifetime Extension from the event.
- **Actual:** the doc comment says `owner` is the entity's owner, not the extender; we read the transaction's `from` to show "Kept alive by 0x…".
- **Repro:** extend a `permissionlessExtension` entity from a third wallet and watch `onExpiryExtended`.
- **Fix:** add the sender to `ExpiryExtendedEvent`.

## 7. Mirrored OpenSSF records contain personal contact data
- **Surface:** data hygiene (hackathon rule: no real personal data on Arkiv)
- **Version:** ossf/malicious-packages `main`, record `osv/malicious/npm/debug/MAL-2025-46974.json` (schema_version 1.5.0)
- **Expected:** OSV records to be safe to inscribe as-is.
- **Actual:** `credits[].contact` holds a finder's email address. Because Arkiv entities are public and deletion is not erasure, `scripts/mirror.ts` drops `credits` before inscribing and links the source record instead.
- **Repro:** `curl -s https://raw.githubusercontent.com/ossf/malicious-packages/main/osv/malicious/npm/debug/MAL-2025-46974.json | jq .credits`
- **Fix (Arkiv docs):** a short "what never to put in a payload" checklist, since immutable public storage makes this mistake permanent.

<!-- Spike results S0–S7 below -->

## Spike results 2026-10-16T19:07:31.580Z (@arkiv-network/sdk 0.8.1, Tiramisu)

| Spike | Result | Expected | Actual (evidence, GLM spent) |
|---|---|---|---|
| S0 chain | ✅ | chain id 7738577 | chain 7738577 |
| S1 seal in one batch | ✅ | create advisory + attestation + ownership → burn in one executeBatch; owner = 0x…dEaD | tx 0x58ea58ad799b7cda2e13d9e07fead7578709c19daf5585dfbfdefe5c887a6087, owner burn, 0.000206568000413136 GLM (gas 206568) |
| S1b original key deletes sealed entity | ✅ | revert | reverted: Transaction failed: entity 0xd0519e2d…ed0251 is owned by 0x000000000000000000000000000000000000dEaD, not 0x9bEBE1512c9f4E9F04B7DC45824b116985013238 |
| S2a keeper extends permissionless entity | ✅ | success | tx 0xcab6b63e69d41c73032db34c38de7f943bb31f457fd3529aeb1792eeb8220925, 0.00002524000005048 GLM (gas 25240) |
| S2b keeper extends a normal entity | ✅ | revert | reverted: Transaction failed: entity 0x8f0dc79e…f6a2d7 is owned by 0x9bEBE1512c9f4E9F04B7DC45824b116985013238, not 0xf1b10AdC2eE7946998E86D390d14e2460C4C7b42 |
| S3 patch readonly entity | ✅ | revert | reverted: Transaction failed: entity 0x87a1d764…a5e9b6 was created readonly, so its contents can never change. Its expiry can still be extended, and it can be transferred or deleted |
| S4 createdBy, range, cursor | ❌ | look-alike from keeper excluded; gte(severity, i32(3)) matches; cursor pages | Query rejected (cursor, -32005): Request exceeds defined limit.. Query: project = str('mene-spike') AND severity >= i32(3) AND $creator = addr(0x9bEBE1512c9f4E9F04B7DC45824b116985013238) |
| S5 WebSocket events | ✅ | watchEntityEvents over webSocket(), no fromBlock, receives create + delete | created + deleted |
| S6 365-day Entity Expiration cost | ✅ | accepted; cost compared with 30 days | 30 d: 0.000095784000191568 GLM (gas 95784) · 365 d: 0.000095784000191568 GLM (gas 95784) |

Repro: `npm run spike` (scripts/spike.ts). S7 (browser bundle) is covered in entry 4.

## Spike results 2026-10-16T19:09:59.396Z (@arkiv-network/sdk 0.8.1, Tiramisu)

| Spike | Result | Expected | Actual (evidence, GLM spent) |
|---|---|---|---|
| S0 chain | ✅ | chain id 7738577 | chain 7738577 |
| S1 seal in one batch | ✅ | create advisory + attestation + ownership → burn in one executeBatch; owner = 0x…dEaD | tx 0xed6f6d92a9ad573ab4f956763cd7ebd3c6ad55175c2b2b398a332ebc7d089354, owner burn, 0.000206568000413136 GLM (gas 206568) |
| S1b original key deletes sealed entity | ✅ | revert | reverted: Transaction failed: entity 0x6ab8ee7c…9a29aa is owned by 0x000000000000000000000000000000000000dEaD, not 0x9bEBE1512c9f4E9F04B7DC45824b116985013238 |
| S2a keeper extends permissionless entity | ✅ | success | tx 0x6b63d9ed520f8365cc37437f235d3edab3b2e577e0d1176d62c9bf2fd415f64d, 0.00002524000005048 GLM (gas 25240) |
| S2b keeper extends a normal entity | ✅ | revert | reverted: Transaction failed: entity 0x49c6b575…12f15f is owned by 0x9bEBE1512c9f4E9F04B7DC45824b116985013238, not 0xf1b10AdC2eE7946998E86D390d14e2460C4C7b42 |
| S3 patch readonly entity | ✅ | revert | reverted: Transaction failed: entity 0x90d4fa69…f023ce was created readonly, so its contents can never change. Its expiry can still be extended, and it can be transferred or deleted |
| S4 createdBy, range, cursor | ✅ | look-alike from keeper excluded; gte(severity, i32(3)) matches; cursor pages | 5 rows over 5 pages (limit 1), all created by A |
| S5 WebSocket events | ✅ | watchEntityEvents over webSocket(), no fromBlock, receives create + delete | created + deleted |
| S6 365-day Entity Expiration cost | ✅ | accepted; cost compared with 30 days | 30 d: 0.000095784000191568 GLM (gas 95784) · 365 d: 0.000095784000191568 GLM (gas 95784) |

Repro: `npm run spike` (scripts/spike.ts). S7 (browser bundle) is covered in entry 4.
