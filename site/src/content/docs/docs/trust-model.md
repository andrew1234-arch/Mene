---
title: Trust model & quorum
---

## Where trust comes from
Anyone can create an Arkiv entity labelled `project = "mene-v1"`, so Mene never trusts labels. It trusts **`$creator`**. The creator is the address that signed the creating transaction, and it can never change. Every read is pinned to a trusted witness:

```ts
pub.select("*").where(and(eq("project","mene-v1"), eq("type","attestation"))).createdBy(WITNESS)
```

A forged advisory from an unknown wallet is never returned, because no trusted witness attests to it.

## Quorum
With trusted witnesses *T* and threshold *k* (default 2 of 3):
1. Read every attestation created by each witness in *T*.
2. Take each witness's **latest** verdict per advisory (by block, then `issuedAt`).
3. **WITHDRAWN** if at least *k* latest verdicts are `withdraw`. Otherwise **ACTIVE** if, replaying verdicts in chain order, *k* witnesses were confirming at the same time. Otherwise **PENDING n/k**, where *n* is how many witnesses confirm now.

Once an advisory is active, only a withdrawal quorum undoes it. Suppose A and B confirm and C stays silent. If a thief withdraws with A's stolen key, the advisory stays ACTIVE: undoing a warning needs a quorum, just like creating one. Before an advisory is active, a witness can freely take back its own confirmation.
4. Read the advisory entity by key. Its own creator need not be trusted. It is readonly, and the attestations commit to its key, so its content can't change after witnesses sign off on it. Mene rejects advisories that aren't readonly or aren't valid OSV.

## Anti-burial
Clients remember everything they've seen (the CLI in `~/.cache/mene`, CI via `actions/cache`, the site in `localStorage`).
- If a confirmation is deleted, it still counts unless a withdrawal quorum exists.
- If an advisory is no longer readable, it shows as **MISSING (was ACTIVE)** and is still enforced. Mene fails closed.
- The site raises a deletion alarm. Chain history keeps the original transaction either way.

## Sealing
Arkiv's `readonly` flag freezes content, but the owner can still delete the entity. So the publish batch moves the advisory's ownership to `0x000000000000000000000000000000000000dEaD`. After that no key can delete it. `permissionlessExtension` means anyone can still keep it alive.

## What Mene keeps off-chain
Lockfiles, dependency lists, which packages you use, your trust settings and keys. Queries carry witness addresses and Mene's fixed labels only. They never carry a package name.
