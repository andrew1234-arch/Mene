# Demo video — shot-by-shot (≤ 3:00)

Record at 1280×800. Before recording:
- run `mirror` and `seed` (see README). Open the Wall and an advisory once in the recording browser, so it remembers the confirmations (scene 4).
- Have a terminal in the repo root with `.env` loaded. **Never show `.env`.**

Spoken lines are in quotes.

### 1 · The story — 0:00–0:20
**Screen:** landing page hero.
> "On 8 September 2025 one phished npm maintainer turned chalk and debug into crypto-stealing malware: billions of weekly downloads. The warnings lived where one operator or one hacked account could edit or delete them. Mene writes them where nobody can."

### 2 · Inscribe — 0:20–0:50
**Screen:** terminal left, the Wall right (live strip visible).
`mene publish advisories/MENE-2026-0001-false-alarm.osv.json` with witness A's key, or point at a mirrored record's history.
> "A witness inscribes an advisory: one transaction creates it, adds their confirmation and seals it to the burn address."

The live strip shows *Inscribed* and *Sealed*. The row shows **PENDING 1/2**.
> "One witness isn't enough. It's pending, and CI still passes."

### 3 · Weighed — 0:50–1:20
`mene attest <key> --confirm` with witness B's key. The live strip shows *Confirmed*; the row flips to **ACTIVE** with no refresh.
Cut to GitHub Actions → **chalk-attack-demo**: the poisoned job is red with the summary table (chalk 5.6.1 → 5.6.0), the clean job is green.
> "A second witness confirms. Now it's binding, and CI goes red with the fix."

### 4 · The attack — 1:20–1:55
**Screen:** terminal + Wall. `npm run attack`.
> "Witness A's key is stolen."
1. *Delete the sealed advisory → reverted.* "The thief can't delete the warning."
2. *Delete A's confirmation → succeeded.* The live strip shows a red **DELETION ALARM**. "Every client that saw it keeps counting it."
3. *Withdraw with A's key → still ACTIVE.* "Undoing a warning needs a quorum too."
4. *The keeper's forged 'chalk 5.6.0 is malicious' → not on the Wall.* "A fake from an unknown wallet never shows up."

### 5 · False alarm — 1:55–2:15
**Screen:** Wall → *Withdrawn* tab → MENE-2026-0001 → its history.
> "Mistakes happen. Two witnesses withdrew this false alarm. It's no longer enforced, and its history stays on the wall."

### 6 · Real data, private check, keep alive — 2:15–2:55
**Screen:** Wall filtered to *OpenSSF mirror* rows → **Check** → drop a real `package-lock.json`.
> "The September incident is already here, mirrored from OpenSSF. Drop your lockfile: it's checked in the page, and the queries carry no package names."

On an advisory page, press **Keep alive** with the keeper wallet (or run `mene keepalive --all`). The live strip shows *Lifetime Extension paid by* the keeper.
> "Any stranger's wallet can keep a warning alive, and nobody can change it. Numbered, weighed, divided. Mene."

**After recording:** check it's ≤ 3:00 and no key is visible, then paste the link into the README and SUBMISSION.md.
