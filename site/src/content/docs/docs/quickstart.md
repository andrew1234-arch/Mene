---
title: Quickstart
description: Check a lockfile against Mene in under a minute.
---

Mene stores npm compromise advisories on Arkiv. A quorum of trusted witnesses must confirm each one before it counts. Matching happens on your machine.

## In the browser
Open **[Check your lockfile](../../check)** and drop your `package-lock.json`. The file is parsed in the page and never uploaded.

## From the command line
```bash
git clone https://github.com/andrew1234-arch/Mene && cd Mene
npm ci && npm run build
node packages/cli/dist/index.js check --lockfile ../my-app/package-lock.json
```

| Exit code | Meaning |
|---|---|
| `0` | Clean. No enforced advisory matches. |
| `1` | At least one installed version is flagged at or above `--min-severity`. |
| `2` | Mene couldn't verify: no network and no cache, bad config, or unreadable lockfile. Mene fails closed. |

## In CI
See [GitHub Action](../action/).

## Try the demo fixtures
```bash
node packages/cli/dist/index.js check --lockfile examples/chalk-attack/package-lock.json   # exits 1
node packages/cli/dist/index.js check --lockfile examples/clean/package-lock.json          # exits 0
```
The fixtures are scanned, never installed.
