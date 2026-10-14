---
title: FAQ
---

**Does Mene see my dependencies?**
No. The CLI, the Action and the web page download advisories and match them locally. Queries contain only Mene's labels and witness addresses.

**Why not just use GitHub Advisories / OSV?**
Use them too. Mene adds two things they can't provide: advisories that no operator or hijacked account can edit or delete, and a quorum, so no single source decides.

**Who are the witnesses?**
In this hackathon demo they are three testnet wallets controlled by the team. That is a stated limitation. You choose your own witnesses on the [Witnesses](../../witnesses) page or in `mene.config.json`.

**What if Arkiv is down?**
The CLI and Action use their cache and warn you. With no cache they exit `2` and fail closed.

**Is this production-ready?**
No. It runs on the Tiramisu testnet.
