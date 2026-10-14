# Demo video script (≤ 3:00)

Record the browser at 1280×800 (one take per scene is fine). Before recording:
- run `npm run seed`, then open each page once so this browser remembers the confirmations (needed for scene 4);
- open `/live` in a second tab;
- have a terminal ready in the repo root, with the `.env` keys loaded.

Spoken lines are in quotes. Keep the cursor on what is being said.

---

### 1 · The problem — 0:00–0:20
**Screen:** Home page hero.
> "On 8 September 2025, one phished npm maintainer turned chalk and debug into crypto-stealing malware: billions of weekly downloads. The warnings lived on websites that one operator, one takedown or one more hacked account can edit or delete. Mene writes them where nobody can."

### 2 · Check a lockfile — 0:20–0:50
**Screen:** Home → click **Try an example: poisoned**.
> "This is a lockfile from that week. Mene checks it right here in the page. The file never leaves the browser, and the network requests contain no package names."

Point at the two red packages, then the **Fix it** box.
> "Two poisoned packages, and the exact fix: chalk 5.6.0, debug 4.4.1. Copy, paste, done."

Click **Check another lockfile** → **clean** → green.

### 3 · Where warnings come from — 0:50–1:25
**Screen:** The Wall → open **MENE-2025-0001** (chalk).
> "Every advisory is an Arkiv entity. It's readonly, so its content can never change, and in the same transaction it's sealed to the burn address. Not even its author can delete it."

Point at the **Content frozen** and **Sealed** badges, then the witness meter.
> "It only counts when two of three independent witnesses confirm it. Mene reads attestations filtered by their on-chain creator, which nobody can fake."

Expand **Verify it yourself**.
> "Here's the exact query. Anyone can run it against Arkiv with no Mene server in between."

### 4 · The attack — 1:25–2:15
**Screen:** split: terminal left, `/live` right. Run `npm run attack`.
> "Now Witness A's key is stolen."

As each line prints, point at it:
1. *Delete the sealed advisory → reverted.* "The thief can't delete the warning. It's sealed."
2. *Delete A's own confirmation → succeeded.* `/live` shows the red **DELETION ALARM**. "They can delete A's confirmation, but every client that saw it keeps counting it, and everyone gets an alarm."
3. *Withdraw with A's key → still ACTIVE.* "Withdrawing doesn't help either. Undoing a warning needs a quorum too."
4. *Forger publishes 'chalk 5.6.0 is malicious' → not visible.* Switch to the Wall: it isn't there. "And a fake warning from an unknown wallet never shows up."

### 5 · False alarms and CI — 2:15–2:40
**Screen:** Wall → **Withdrawn** tab → the synthetic false alarm.
> "Mistakes happen. Two witnesses withdrew this false alarm. It's no longer enforced, and its history stays on the wall."

Cut to GitHub Actions: **chalk-attack-demo** run, red job for the poisoned lockfile with the summary table, green job for the clean one.
> "Add one step to CI and a poisoned install fails the build."

### 6 · Close — 2:40–2:55
**Screen:** an advisory page → **Keep alive**, or the CLI `mene keepalive --all`.
> "Advisories live for a year, and any stranger's wallet can extend them. Nobody can change them. Numbered, weighed, divided. Mene: the writing on the wall for poisoned packages."

---

**Checklist after recording:** ≤ 3:00 · no private keys visible in the terminal (`cat .env` never on screen) · upload, then paste the link into Devfolio and the README.
