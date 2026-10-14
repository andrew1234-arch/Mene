---
title: Data contract
---

Mene advisories are [OSV](https://ossf.github.io/osv-schema/) documents, the format used by osv.dev and the GitHub Advisory Database. That means OSV tooling can consume them. Mene-specific fields live under `database_specific`. Arkiv attributes hold what needs to be queryable.

The canonical contract is [`arkiv/schema.md`](https://github.com/andrew1234-arch/Mene/blob/main/arkiv/schema.md) in the repository. In short:

| Entity | Flags | Entity Expiration | Key attributes |
|---|---|---|---|
| `advisory` | readonly, permissionlessExtension | 365 days | `osvId` str · `package` str · `severity` i32 (1–4) · `publishedAt` u64 |
| `attestation` | readonly, permissionlessExtension | 365 days | `advisory` key · `verdict` str (`confirm`/`withdraw`) · `issuedAt` u64 |
| `issuer` | none | 30-day lease | `name` str |

All three carry `project = "mene-v1"`, `type` and `v = 1`.

## Example advisory payload
```json
{
  "schema_version": "1.6.0",
  "id": "MENE-2025-0001",
  "published": "2025-09-08T18:00:00Z",
  "modified": "2025-09-08T18:00:00Z",
  "summary": "chalk 5.6.1 published from a phished maintainer account",
  "affected": [{
    "package": { "ecosystem": "npm", "name": "chalk" },
    "versions": ["5.6.1"],
    "database_specific": { "safe_version": "5.6.0" }
  }],
  "database_specific": { "mene_version": 1, "severity": "critical" }
}
```
Version matching uses OSV semantics: an exact `versions[]` entry, or `SEMVER` `ranges` with `introduced` / `fixed` / `last_affected` events.
