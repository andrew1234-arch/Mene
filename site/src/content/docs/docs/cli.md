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
mene keepalive [<key> | --all] [--days 365]                       # env MENE_KEEPER_KEY; skips entities that already live longer
mene cache
```

## Configuration
`mene.config.json` in the working directory, or `--config <path>`:
```json
{ "issuers": ["0x…", "0x…", "0x…"], "threshold": 2, "minSeverity": "low" }
```
Precedence for every field: the config file, then environment variables (`MENE_ISSUERS` comma-separated, `MENE_THRESHOLD`, `MENE_RPC_URL`), then built-in defaults (the demo witnesses, 2, Tiramisu).
If the cache file is corrupt, Mene refuses to run (exit `2`) instead of silently forgetting what it has seen.

## The cache
`mene check` remembers every advisory and attestation it has seen in `~/.cache/mene/state.json` (override with `MENE_CACHE_DIR`). This is the anti-burial memory:
- If a witness deletes a confirmation, the confirmation still counts. Only a withdrawal quorum overrides it.
- If an ACTIVE advisory disappears, it becomes `MISSING (was ACTIVE)` and is still enforced.
- If Arkiv is unreachable, `check` warns and uses the cache. With no cache it exits `2`.

## `verify`
Prints the advisory's creator, owner (and whether it is sealed), creation flags, Entity Expiration block, each witness's latest verdict with explorer links, and the exact query string Mene sent.
