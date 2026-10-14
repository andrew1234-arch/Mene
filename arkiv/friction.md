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

### ⏳ Pending on-chain spikes (S0–S6)
`scripts/spike.ts` is ready; results will be recorded here with tx hashes.
