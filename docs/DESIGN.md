# Mene — Web pages, design and references

## Framework (decided)
- **Astro** (static multi-page, islands), deployed to **GitHub Pages** via Actions. There is no backend; every page reads Arkiv directly from the browser. This is the Censorship Resistance proof.
- No docs site: the README and `arkiv/schema.md` are the docs (judges read those).
- Interactive pieces (wall, check, live feed) are vanilla TS islands, or Preact if state grows. Shared logic is imported from `@mene/sdk`.
- **SPIKE S7:** bundle `@arkiv-network/sdk` in the browser (it depends on `brotli-wasm`).
  - Fallback 1: `vite-plugin-wasm`.
  - Fallback 2: call the `arkiv_query` JSON-RPC directly with `fetch` from the browser.

## Pages
1. `/` **Landing**
   - Hero headline: "The writing on the wall for poisoned packages."
   - Sub: "On 8 September 2025 one phished maintainer turned chalk and debug into malware. The warnings lived where they could be edited or deleted. Mene writes them where they can't be."
   - Three panels: *Mene — numbered*, *Tekel — weighed*, *Upharsin — divided* (see SPEC).
   - Live counters: active advisories, witnesses, last inscription block.
   - Quorum diagram, a 30-second CLI + Action snippet, CTAs: "Read the wall", "Check your lockfile", "Add to CI".
2. `/wall` **The Wall** (advisory ledger)
   - Table/cards: id, package, affected, severity, status chip (ACTIVE / PENDING n/k / WITHDRAWN / MISSING), witnesses, inscribed block.
   - Filters: status, severity range (range query), date (`publishedAt` range).
   - Package-name search filters **client-side only**, so no package name ever goes on the wire. Show that as a small note.
   - **Live strip** at the top: WebSocket events (inscriptions, confirmations, withdrawals, extensions); **deletion alarms in red**.
   - Source tag per row: "OpenSSF mirror" or "Mene original".
3. `/advisory/?key=0x…` **Advisory**
   - OSV summary, affected versions, recommended version, references, raw OSV JSON toggle.
   - **Witness timeline:** each attestation with creator address, verdict, block, tx link.
   - Badges: Inscribed (readonly), Sealed (owner = burn), Kept alive by 0x…, Entity Expiration countdown.
   - **Verify it yourself:** the exact SDK query and an equivalent RPC call.
4. `/check` **Check your lockfile**
   - Drag-drop `package-lock.json`; parsed and matched in the browser. "Your lockfile never leaves this page."
   - Result table plus a copyable CI snippet.
5. `/witnesses` **Witnesses** (read-only) — the 3 trusted witness addresses, attestation counts, links to the explorer, and how to change trust (the `mene.config.json` / Action inputs).

Landing carries the Daniel 5 line (in the footer) and the threat model as a carousel of attacker → what happens, with live counters beneath it. There are no `/live`, `/about` or `/docs` pages.

## Visual direction: "the wall"
- **Mood:** a calm, light product page. Soft lavender-to-pink panels with rounded corners frame each section; faint outlined tiles at the panel edges are the wall the warnings are written on.
  - Light mode (follows the system by default): near-white background, white cards with soft violet shadows, a single **deep-violet** accent for primary actions.
  - Dark mode: deep indigo panels, lavender accent.
- **Layout:** a floating pill nav; centered section heads (pill badge → headline → one-line lede); the home page offers three "ways to use Mene" cards with a developers/witnesses toggle, a "works with" strip, the quorum diagram, the threat carousel and a lockfile-check call to action; a column footer.
- **Type:**
  - Inter Tight for headlines, Inter for body (Google Fonts).
  - **Mono for every hash, address, key and version** (JetBrains Mono).
- **Motifs:** pill badges with a small icon tile; a `) + (` ornament divider; check-mark feature lists; seal badges for Sealed/Inscribed; status chips (ACTIVE = accent, PENDING = muted, WITHDRAWN = struck-through text, MISSING = red).
- **Rules:**
  - Respect `prefers-color-scheme` and offer a toggle; responsive down to 360 px; WCAG AA contrast.
  - Addresses truncated as `0x1234…abcd` with copy buttons; every on-chain item links to the Tiramisu explorer.
  - No stock illustrations: typography and data carry the page.

## Reference sites (verified to exist; study, don't copy)
| Site | Take from it |
|---|---|
| **osv.dev** (list + e.g. `osv.dev/vulnerability/GHSA-4x49-vf9v-38px`) | Advisory list → detail structure, affected-versions layout, raw-JSON view, the OSV data model |
| **search.sigstore.dev** (source: github.com/sigstore/rekor-search-ui; Next.js deployed to GitHub Pages) | Transparency-log search UX: search by identifier, entry detail with verification data. Closest analogue to "verify it yourself" |
| **GitHub advisory page** `github.com/debug-js/debug/security/advisories/GHSA-4x49-vf9v-38px` | Severity header, affected/patched versions block, references list |
| **socket.dev/blog/npm-author-qix-compromised-in-major-supply-chain-attack** | Incident narrative and tone for the landing page's story section |
| **docs.arkiv.network** | Clarity standard for README and schema.md |
| **tiramisu.explorer.arkiv.network** | Link targets for every key, tx and address |

## Copy rules
Short declarative sentences. Never claim more than the code does. Every security claim on the landing page links to the docs page that explains it.
