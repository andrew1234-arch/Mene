# Arkiv schema — Mene

Network Tiramisu (7738577) · SDK `@arkiv-network/sdk` 0.8.1
Namespace on every entity: `project = "mene-v1"` (str).
Trust: entities are trusted **only** via `$creator` matched against the reader's witness list. Attribute values are never trusted on their own, because anyone can write our labels.

## advisory
Flags: `readonly`, `permissionlessExtension` · Entity Expiration 365 d (renewable by anyone) · owner after publish: `0x000000000000000000000000000000000000dEaD` (verified on chain: friction.md S1/S1b; the stolen-key delete reverts in evidence.md) · contentType `application/json`

| attribute | type | purpose |
|---|---|---|
| project | str | namespace |
| type | str | `"advisory"` |
| schema_version | i32 | `1` |
| advisory_id | str | OSV id: `MAL-2025-46974` (OpenSSF mirror) or `MENE-2026-0001` (Mene original) |
| ecosystem | str | `"npm"` |
| pkg | str | package name (omitted if > 128 bytes) |
| pkg_id | bytes32 | `keccak256("npm:" + name)`, always set |
| severity | i32 | 1 low · 2 moderate · 3 high · 4 critical |
| published_at | u64 | unix seconds of OSV `published` |

Payload: OSV JSON (≤ 128 KB). Mene's fields live under `database_specific.mene`:
```json
{
  "schema_version": "1.6.0",
  "id": "MENE-2026-0001",
  "summary": "DEMO: false alarm on a synthetic package (withdrawn by quorum)",
  "published": "2026-10-14T00:00:00Z",
  "affected": [{ "package": { "ecosystem": "npm", "name": "mene-demo-false-alarm" },
                 "ranges": [{ "type": "SEMVER", "events": [{ "introduced": "1.0.0" }, { "fixed": "1.0.3" }] }] }],
  "database_specific": { "mene": { "severity": "moderate", "recommended": "1.0.3" } }
}
```
| `database_specific.mene` field | meaning |
|---|---|
| `severity` | required; `low` · `moderate` · `high` · `critical` (mirrored malware records are `critical`) |
| `recommended` | optional; the version to install instead |
| `source` | mirrored records only: `{ "repo": "https://github.com/ossf/malicious-packages", "path": "osv/malicious/npm/debug/MAL-2025-46974.json", "license": "Apache-2.0" }` |

Mirrored records keep their original OSV JSON and `schema_version` (verified: 1.5.0 in ossf/malicious-packages), with one deliberate removal: the `credits` block, which holds finder names and contact e-mail addresses (personal data must not go on Arkiv; see friction.md #7). Code: [`packages/sdk/src/mirror.ts`](../packages/sdk/src/mirror.ts).

## attestation
Flags: `readonly`, `permissionlessExtension` · 365 d · contentType `application/json` (`{ "reason": "…" }` or `{}`)

| attribute | type | purpose |
|---|---|---|
| project | str | namespace |
| type | str | `"attestation"` |
| advisory | key | advisory entity key |
| verdict | str | `"confirm"` or `"withdraw"` |
| attested_at | u64 | unix seconds; tie-break within a block |

## Writes
- **Publish** = one atomic `executeBatch`: create the advisory (salted; key predicted with `pub.predictEntityKeys`) + create the publisher's `confirm` attestation pointing at that predicted key + `ownershipChanges` of the advisory to the burn address. Code: `publishAdvisory` in [`arkiv.ts`](../packages/sdk/src/arkiv.ts).
- **Attest** = `createEntity` of one attestation.
- **Keepalive** = one `executeBatch` of `extensions`, signed by **any** wallet; entities already living longer are skipped so one can't revert the batch.

## Queries the app runs
1. Attestations per witness (repeated per trusted witness, paged with the cursor):
   `select("*").where(and(eq("project","mene-v1"), eq("type","attestation"))).createdBy(W).limit(200)`
   → `project = str('mene-v1') AND type = str('attestation') AND $creator = addr(W)`
2. Advisories per witness, payloads included (one paged query per trusted witness; friction.md #12):
   `select("*").where(and(eq("project","mene-v1"), eq("type","advisory"))).createdBy(W).limit(200)`
   An attested key this doesn't return falls back to `getEntity(key)` (`NoEntityFoundError` = deleted, expired or never existed); the advisory page also reads its own advisory by key.
3. Wall range filters, pinned per witness:
   `select({ key: true }).where(and(eq("project","mene-v1"), eq("type","advisory"), gte("severity", i32(N)), gte("published_at", u64(T)))).createdBy(W)`
4. Mirror idempotency (scripts only): `eq("advisory_id", id)` + `createdBy(A)`.
5. Live feed: `watchEntityEvents` over `webSocket()` without `fromBlock`, filtered client-side.

No query ever contains a package name. Raw JSON-RPC equivalent of query 1:
```bash
curl -s https://rpc.tiramisu.db-chain.testnet.arkiv.network -H 'content-type: application/json' -d '{
  "jsonrpc":"2.0","id":1,"method":"arkiv_query",
  "params":["project = str('"'"'mene-v1'"'"') AND type = str('"'"'attestation'"'"') AND $creator = addr(0x9bEBE1512c9f4E9F04B7DC45824b116985013238)",
            {"select":{"key":true,"creator":true,"createdAt":true,"attributes":true,"payload":true},"limit":"0xc8"}]}'
```

## Status rule
`WITHDRAWN` if ≥ k witnesses' latest verdict is `withdraw`; else `ACTIVE` once k witnesses have confirmed at the same time (replaying verdicts in chain order), after which only a withdrawal quorum undoes it; else `PENDING n/k`. An attested advisory that is no longer readable is `MISSING (was …)` and stays enforced if it was ACTIVE. Code: [`quorum.ts`](../packages/sdk/src/quorum.ts).

## Why each Arkiv feature (and what the user sees)
| Feature | Why we chose it | Visible as |
|---|---|---|
| Typed attributes vs payload | Severity and date must be range-filterable (`i32`, `u64`); the OSV document is only read, never filtered, so it stays in the payload | Wall severity and date filters |
| `createdBy()` on every read | Labels are writable by anyone; only the immutable creator identifies a witness | Forged advisories never appear; witness addresses on every confirmation |
| Cursor pagination | A witness's attestations can exceed 200 | Complete wall regardless of size |
| `readonly` | Witnesses confirm a fixed text: the advisory they signed off on can never change under them | "Content frozen" badge |
| Ownership transfer to the burn address | `readonly` still lets the owner delete; sealing removes the last key that could | "Sealed" badge; the stolen-key demo's delete reverts |
| `permissionlessExtension` | A warning must outlive its publisher; any stranger can pay to keep it, nobody can change it | "Kept alive by 0x…", "Keep alive" button, `mene keepalive` |
| Entity Expiration 365 d | Long enough for slow-moving supply chains; renewable by anyone, so no forced maintenance by the author | Expiry countdown on every advisory |
| Atomic `executeBatch` | An advisory without its publisher's confirmation, or an unsealed one, must never exist even briefly | No half-published advisory |
| `predictEntityKeys` | The confirmation must reference the advisory created in the same batch | One-transaction publish |
| WebSocket entity events | Witness activity and deletions should be seen as they happen, without polling | Live strip and red deletion alarms on the Wall |

## Deliberately off Arkiv
Lockfiles, dependency lists, which packages anyone uses, trust settings, CI results, keys.
