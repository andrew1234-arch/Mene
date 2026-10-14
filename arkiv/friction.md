# Arkiv friction log

Format: what we expected · what happened · version · repro. Smooth paths are logged too.

## 2026-10-14 — @arkiv-network/sdk 0.8.1, viem 2.57.5, Node 22

### ✅ SDK ships its TypeScript sources
`node_modules/@arkiv-network/sdk/src` is published alongside `dist`, with doc comments on every action. We answered every API question (batch shape, `predictEntityKeys` tuple typing, `PatchEntityParameters` = `set`/`unset`, event payloads) by reading source, without docs round-trips. Our whole SDK layer typechecked first try under `strict` + `noUncheckedIndexedAccess`.

### ✅ Query builder is inspectable
`builder.toString()` returns the exact query text the node parses (e.g. `project = str('mene-v1') AND type = str('attestation') AND $creator = addr(0x…)`). We use it in `mene verify` and on the advisory page's "Verify it yourself" box. Viem's error message also prints the full `arkiv_query` request body, which gave us the raw-RPC equivalent for free.

### ℹ️ `ExpiryExtendedEvent.owner` is the owner, not the extender
Expected: the event tells us who applied a permissionless Lifetime Extension. Actual: the doc comment says it carries the **owner**; the extender must be read from the transaction's `from`. For the "kept alive by 0x…" badge we fetch the tx. Not a bug, but a common need.

### ℹ️ Compression is Node-zlib first, brotli-wasm only as fallback
`utils/compression.ts` uses `node:zlib` in Node and lazily imports `brotli-wasm` only in the browser/fallback path. So bundling the CLI/Action needs nothing special (our Action bundle runs from a bare directory with no node_modules). Relevant for SPIKE S7 (browser).

### ✅ Browser writes need no wasm
Expected (SPIKE S7): `brotli-wasm` would need special bundling for browser writes. Actual: in 0.8.1, `utils/compression.ts` (the only `brotli-wasm` importer) is not imported by any action, so payloads go out uncompressed and Vite bundles the SDK with no plugin. Our Astro site reads and writes (publish / attest / keepalive through an injected EIP-1193 wallet via viem `custom()`) with stock config. Verified in Chromium: the wallet receives `wallet_addEthereumChain` for chain `0x7614d1`, then one `eth_sendTransaction` to the Arkiv contract carrying the whole batch.

### ✅ Injected wallets work unchanged
`createWalletClient({ chain: tiramisu, transport: custom(window.ethereum), account: address })` is all it takes; `executeBatch` goes through viem `writeContract`, which uses `eth_sendTransaction` for JSON-RPC accounts. viem's `assertCurrentChain` rejects the write if the wallet is on another chain, so we call `wallet_switchEthereumChain` / `wallet_addEthereumChain` (4902) first.

### ✅ Live node accepts every Mene query (read-only smoke test)
Run 2026-10-14 12:24 UTC from a GitHub Actions runner (ubuntu-latest, Node 22), `@arkiv-network/sdk` 0.8.1, viem 2.57.5, script `scripts/smoke.ts`, workflow `arkiv-smoke` ([run 38563462245](https://github.com/andrew1234-arch/Mene/actions/runs/38563462245)).

| Call | Result | Latency |
|---|---|---|
| `eth_chainId` | `7738577` | 4142 ms (first request, includes TLS/DNS warm-up) |
| `eth_blockNumber` | `565449` | 151 ms |
| `arkiv_getBlockTiming` | `{ currentBlock: 565449, blockDuration: 2 }` | 155 ms |
| attestations query `project = str('mene-v1') AND type = str('attestation') AND $creator = addr(…)` | 0 rows, `cursor: null` | 172 ms |
| issuer-lease query (`type = str('issuer')` + `createdBy`) | 0 rows | 153 ms |
| range query `severity >= i32(3) AND publishedAt >= u64(1700000000)` + `createdBy` | 0 rows | 165 ms |
| `getEntity` on a key that never existed | throws `NoEntityFoundError`, as documented | 153 ms |

Expected: the rendered query strings (from `builder.toString()`) parse on the node, range predicates on `i32`/`u64` are accepted with `$creator`, and an empty result has no cursor. Actual: all as expected. Note: `getBlockTiming()` returns camelCase fields (`currentBlock`, `currentBlockTime`, `blockDuration`); the RPC schema type in `types/rpcSchema.ts` names them `current_block`, `current_block_time`, `duration` (the action maps them). Worth knowing if you call `arkiv_getBlockTiming` by raw JSON-RPC.

Repro: `npx tsx scripts/smoke.ts 0x<any address>`.

### ⏳ Pending on-chain spikes (S0–S6)
`scripts/spike.ts` is ready; results will be recorded here with tx hashes.
