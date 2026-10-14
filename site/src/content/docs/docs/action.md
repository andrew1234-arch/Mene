---
title: GitHub Action
---

```yaml
name: mene
on: [push, pull_request]
jobs:
  mene:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/cache@v4        # optional: keeps the anti-burial memory between runs
        with:
          path: ${{ runner.temp }}/mene-cache
          key: mene-${{ github.run_id }}
          restore-keys: mene-
      - uses: andrew1234-arch/Mene/action@main
        with:
          lockfile: package-lock.json
          threshold: 2
          # issuers: 0xA…,0xB…,0xC…   # defaults to the Mene demo witnesses
          # min-severity: high
```

| Input | Default | |
|---|---|---|
| `lockfile` | `package-lock.json` | path to scan |
| `issuers` | config file, else demo witnesses | comma-separated trusted addresses |
| `threshold` | config file, else `2` | confirmations needed |
| `min-severity` | config file, else `low` | `low` · `medium` · `high` · `critical` |
| `rpc-url` | config file, else Tiramisu | Arkiv HTTP RPC |

Inputs you set explicitly override the repository's `mene.config.json`. Inputs you leave empty fall back to it.

The Action writes a table of matches to the job summary and adds an error annotation on the lockfile for each poisoned package. It fails the job when anything matches. If it can't reach Arkiv and has no cache, it fails closed.

The Action is a single bundled file (`action/dist/index.mjs`) that runs on Node 24. Nothing is installed at run time.
