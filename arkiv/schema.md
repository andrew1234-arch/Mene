# Mene data contract on Arkiv

Project namespace: every Mene entity carries `project = "mene-v1"`. Network: Tiramisu testnet (chain `7738577`).
Advisory payloads are [OSV](https://ossf.github.io/osv-schema/) JSON; everything queryable lives in typed attributes.
**Trust is never taken from attributes** — anyone can write these labels. Every read is pinned with
`.createdBy(<trusted issuer>)` (i.e. `$creator = addr(...)`), and `$creator` is immutable.

## Entity types

### `advisory`
| | |
|---|---|
| Payload | OSV advisory JSON (`application/json`), see `packages/sdk/src/osv.ts` |
| Flags | `readonly: true`, `permissionlessExtension: true` |
| Entity Expiration | 365 days at creation; anyone may apply Lifetime Extension (`mene keepalive`) |
| Owner | sealed to `0x000000000000000000000000000000000000dEaD` in the publish batch (SPIKE S1) |

| Attribute | Type | Example | Purpose |
|---|---|---|---|
| `project` | str | `mene-v1` | namespace |
| `type` | str | `advisory` | entity kind |
| `v` | i32 | `1` | schema version |
| `osvId` | str | `MENE-2025-0001` | OSV id |
| `ecosystem` | str | `npm` | always npm in v1 |
| `package` | str | `chalk` | display only — **never queried** (matching is local) |
| `severity` | i32 | `4` | 1 low · 2 medium · 3 high · 4 critical — range-filterable |
| `publishedAt` | u64 | `1757354400` | unix seconds of OSV `published` — range-filterable |

### `attestation`
| | |
|---|---|
| Payload | `{ "advisory": "0x…", "verdict": "confirm" \| "withdraw", "reason": string \| null }` |
| Flags | `readonly: true`, `permissionlessExtension: true` |
| Entity Expiration | 365 days; anyone may extend |
| Owner | the witness (left unsealed so `mene` can demonstrate the anti-burial cache) |

| Attribute | Type | Purpose |
|---|---|---|
| `project` | str | `mene-v1` |
| `type` | str | `attestation` |
| `v` | i32 | `1` |
| `advisory` | key | key of the advisory this attests to |
| `verdict` | str | `confirm` or `withdraw` |
| `issuedAt` | u64 | unix seconds; tie-break within a block |

### `issuer`
| | |
|---|---|
| Payload | `{ "name": "Witness A" }` |
| Flags | none (mutable, extendable only by the owner) |
| Entity Expiration | 30-day lease, renewed in the same batch as every publish/attest |
| Meaning | alive = "active witness"; expired = "silent witness" |

| Attribute | Type | Purpose |
|---|---|---|
| `project` / `type` / `v` | str / str / i32 | `mene-v1` / `issuer` / `1` |
| `name` | str | display name |

## Writes
- **Publish** — one atomic `executeBatch`: create advisory (salted, key predicted with `predictEntityKeys`) + create the publisher's `confirm` attestation pointing at the predicted key + ownership change of the advisory to the burn address + extension of the issuer lease.
- **Attest** — one `executeBatch`: create attestation + extend issuer lease.
- **Keepalive** — one `executeBatch` of `extensions` signed by any wallet.

## Exact queries (reproducible)
Every query Mene sends. None contains a package name.

```ts
// 1. All attestations of one trusted witness (repeated per witness, paged 200 at a time)
pub.select("*")
  .where(and(eq("project", "mene-v1"), eq("type", "attestation")))
  .createdBy(WITNESS)
  .limit(200)
  .fetch()
// rendered: project = str('mene-v1') AND type = str('attestation') AND $creator = addr(0xWITNESS)

// 2. Each advisory those attestations point at
pub.getEntity(ADVISORY_KEY)

// 3. A witness's lease
pub.select({ key: true, expiresAt: true })
  .where(and(eq("project", "mene-v1"), eq("type", "issuer")))
  .createdBy(WITNESS).limit(1).fetch()

// 4. Wall filters (optional, numeric ranges)
pub.select("*").where(and(eq("project","mene-v1"), eq("type","advisory"), gte("severity", i32(3)), gte("publishedAt", u64(T))))
```

Equivalent raw JSON-RPC (what the SDK sends — useful with `curl`):
```bash
curl -s https://rpc.tiramisu.db-chain.testnet.arkiv.network -H 'content-type: application/json' -d '{
  "jsonrpc":"2.0","id":1,"method":"arkiv_query",
  "params":["project = str('"'"'mene-v1'"'"') AND type = str('"'"'attestation'"'"') AND $creator = addr(0xWITNESS)",
            {"select":{"key":true,"creator":true,"createdAt":true,"attributes":true,"payload":true},"limit":"0xc8"}]}'
```

## Status rule
See SPEC.md "Quorum algorithm". `WITHDRAWN` if ≥ k trusted witnesses' latest verdict is withdraw; else `ACTIVE` if ≥ k confirm; else `PENDING n/k`. An attested advisory that is no longer readable is `MISSING (was …)` and stays enforced when it was ACTIVE.

## What is deliberately NOT on Arkiv
Lockfiles, dependency lists, which packages a user runs, trust lists, private keys.
