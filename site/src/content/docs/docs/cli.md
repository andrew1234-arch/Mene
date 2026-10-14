---
title: CLI reference
---

```
mene check   [--lockfile ./package-lock.json] [--config mene.config.json] [--min-severity low] [--json] [--offline]
mene list    [--status active|pending|withdrawn|missing|all] [--json]
mene verify  <advisoryKey> [--json]
mene publish <advisory.osv.json> [--seal batch|separate|none]     # env MENE_ISSUER_KEY
mene attest  <advisoryKey> --confirm | --withdraw [--reason "..."] # env MENE_ISSUER_KEY
mene issuer  <name>                                               # env MENE_ISSUER_KEY
mene keepalive [<key> | --all] [--days 365]                       # env MENE_KEEPER_KEY
mene cache
```

## Configuration
`mene.config.json` in the working directory, or `--config <path>`:
```json
{ "issuers": ["0x…", "0x…", "0x…"], "threshold": 2, "minSeverity": "low" }
```
If there's no file, Mene uses `MENE_ISSUERS` (comma-separated), then the built-in demo witnesses.
`MENE_THRESHOLD` and `MENE_RPC_URL` override the file.

## The cache
`mene check` remembers every advisory and attestation it has seen in `~/.cache/mene/state.json` (override with `MENE_CACHE_DIR`). This is the anti-burial memory:
- If a witness deletes a confirmation, the confirmation still counts. Only a withdrawal quorum overrides it.
- If an ACTIVE advisory disappears, it becomes `MISSING (was ACTIVE)` and is still enforced.
- If Arkiv is unreachable, `check` warns and uses the cache. With no cache it exits `2`.

## `verify`
Prints the advisory's creator, owner (and whether it is sealed), creation flags, Entity Expiration block, each witness's latest verdict with explorer links, and the exact query string Mene sent.
