# Product directive: from proof page to product

**Status:** binding. It overrides the page list in DESIGN.md; the look and the brand kit (`brand/`) stay as they are.

## The problem
The site read like evidence for a concept: it explained the mechanism, showed test data and talked to judges. A product starts from what a visitor came to do and gets them to a result in one or two steps. The proof still matters for judging, but it moves one click deeper: available on every item, never in the way.

**Test for every screen:** a developer who has never heard of Arkiv lands here. Within 10 seconds, do they know what Mene does for them and what to click? Within 60 seconds, have they got an answer about their own project?

## Who uses it and what they came to do
| Visitor | Job | Where |
|---|---|---|
| Developer | "Is my project affected right now?" | `/check`: drop a lockfile or paste a public GitHub repo URL |
| Developer | "Is this package/version safe?" | Header search → `/packages/<name>` |
| Team lead | "Stop this from ever shipping again." | `/setup`: copy-paste CI setup in under 2 minutes |
| Anyone | "What's been compromised lately?" | `/advisories` |
| Security team | "How do I publish or confirm warnings?" | `/witnesses` |
| Skeptic or judge | "Why should I trust this?" | `/trust` plus "Verify" on every advisory |

## Information architecture
Header: logo · Search packages · Check · Advisories · Set up CI · Trust · GitHub. Footer: Witnesses, Docs (README), License, "Data lives on Arkiv".

1. **`/` Home.** Headline "Warnings that can't be erased." Sub: "Mene tells you if your project uses a hijacked npm package, and blocks it in CI. Warnings are confirmed by independent witnesses and stored where no one can delete them." The check (drop zone + GitHub URL + Check) is in the hero. Then the 5 newest confirmed advisories with "View all"; three value points (Can't be deleted / One hacked account can't fake or hide a warning / Your code never leaves your machine) linking to `/trust`; a 4-line CI snippet with copy → `/setup`. No mechanism diagrams, quorum math, entity terminology, test data or judge-facing text.
2. **`/check`.** Inputs: a dropped or chosen `package-lock.json`; a public GitHub repo URL (fetched from `raw.githubusercontent.com` in the browser, `main` then `master`); "Try an example" (`examples/chalk-attack`). The result is a report: affected (count, then per hit: package, installed version, advisory, severity, safe version and a copyable `npm install pkg@safe`) or clean ("No known compromised versions in N packages", "Checked against N active advisories, updated at block X", then a prompt to protect CI). Errors say what happened and the fix. Privacy line under the input. Download report (JSON) and Copy summary (markdown).
3. **`/advisories` and `/advisories/<id>`.** List with status, severity and date filters, client-side search, newest first, withdrawn struck through behind "Show withdrawn". Detail: plain summary, affected and safe versions, "Am I affected?", "Block this in CI", references; the proof (witness timeline, seal, expiry and extensions, exact query, raw OSV, explorer links) collapsed under "Verify this advisory".
4. **`/packages/<name>`.** Every advisory for the package, affected and safe versions, the safe version to install; "No known compromised versions of <name>." otherwise; always "Last checked at block X". Filtered client-side; the name never goes in a network request.
5. **`/setup`.** Tabs GitHub Actions (default) · CLI · Other CI. A complete workflow with copy, 3 steps, what a failing run looks like. Severity, threshold and witness list rewrite the snippet live. CLI: `npx mene-check`, exit codes, `--json`.
6. **`/trust`.** Who confirms a warning? What if a witness is hacked? Can anyone delete a warning? What do you see about me? Where is the data? Limitations. Each answered in plain words, then "verify it yourself".
7. **`/witnesses`.** Who they are, addresses, what each confirmed, "Become a witness".

## Quality bar
- No internal jargon in the product layer ("entity", "batch", "spike", "payload", "attribute", "$creator", "evidence", "judges", "demo") outside `/trust` and the Verify panels.
- Real data first; test advisories only on `/advisories`, tagged "Test advisory".
- Every data view has loading (skeleton), empty, error (with retry) and stale ("Showing saved data from <time>; Arkiv unreachable") states.
- The last advisory snapshot is cached in localStorage, rendered instantly, then refreshed live.
- Every action shows a result (copy → "Copied"; the check shows progress).
- Deep links for every advisory, package and check example; refreshes don't 404.
- Mobile first at 360 px; labels on every input; visible focus; statuses always as words; the drop zone is also a file button.
- Head tags from `brand/head-snippet.html`; titles like "debug 4.4.2 compromised · Mene".

## Release
- The CLI is published to npm as **`mene-check`** (bin `mene`), so `npx mene-check` works. The maintainer runs `npm login` and `npm publish`.
- `action.yml` at the repo root, with tags `v0.1.0` and a moving `v1`, so workflows write `uses: andrew1234-arch/mene@v1`. New tags only; history is never rewritten.
- The README top mirrors Home.

Done when a stranger can go from Home to "your project is affected, here's the fix" in under 60 seconds, and from Home to a working CI check in under 2 minutes, without reading about Arkiv.
