---
title: Becoming a witness
---

A witness is just a wallet that other people choose to trust.

## From the browser
Connect any Ethereum wallet (MetaMask, Rabby…) with the button in the top bar. Mene adds the Arkiv Tiramisu testnet to your wallet if it isn't there yet.
- **[Publish](../../publish)** — fill in the form; the OSV JSON preview is exactly what gets stored.
- **Advisory page → Actions** — Confirm or Withdraw (only shown to your trusted witnesses), or Keep alive (anyone).
- **[Witnesses](../../witnesses) → Act as a witness** — open or renew your 30-day lease.

## From the CLI

```bash
export MENE_ISSUER_KEY=0x…          # testnet key, never commit it
mene issuer "Acme Security"         # opens your 30-day lease
mene publish advisories/my.osv.json # advisory + your confirm + seal, in one transaction
mene attest 0xADVISORY --confirm    # confirm someone else's advisory
mene attest 0xADVISORY --withdraw --reason "false positive"
```

## What publish does
One atomic `executeBatch`:
1. Creates the advisory, readonly and permissionlessly extendable. Its key is predicted with `predictEntityKeys`.
2. Creates your `confirm` attestation pointing at that key.
3. Transfers the advisory's ownership to the burn address, so nobody can delete it.
4. Extends your issuer lease.

Either all four happen or none do. There is never a half-published advisory.

## Withdrawing
Withdrawals are new attestations. They never edit or delete anything. A single withdrawal doesn't un-enforce an active advisory. Once *k* witnesses' latest verdicts are `withdraw`, the advisory shows as WITHDRAWN. Its history stays on the wall.
