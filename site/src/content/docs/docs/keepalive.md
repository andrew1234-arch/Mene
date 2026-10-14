---
title: Keepalive
---

Every Arkiv entity has an Entity Expiration. Mene advisories and attestations are created with `permissionlessExtension`, so **any wallet** can pay for their Lifetime Extension. Nobody else can change them.

```bash
export MENE_KEEPER_KEY=0x…   # any funded testnet wallet
mene keepalive --all         # extend every trusted advisory + attestation to 365 days from now
mene keepalive 0xKEY --days 730
```

Arkiv's `extendEntity` sets a new expiry counted from now. It reverts if that isn't later than the current one. The advisory page shows the countdown and who last paid for an extension.
