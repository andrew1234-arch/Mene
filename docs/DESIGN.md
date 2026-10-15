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

## Visual direction: ink and amber (brand kit in `brand/`)
- **Brand:** the Quorum mark (three witness bars, two lit amber and one unlit, which also read as an M) and the outlined Archivo wordmark. Follow `brand/README.md`: clear space of one bar width, never recolour the bars, never put the amber mark on white.
- **Colour:** Ink `#0B0E17` background and Light ink `#E8EBF4` text in dark mode (the default on dark systems); Amber `#F5B83D` for lit bars, witness lamps and primary actions. Light mode swaps to a near-white background with Deep amber `#9A6A0A` for lit elements and ink buttons. Threat red (`#FF5C5C` dark, `#D7261E` light) is used only for ACTIVE advisories and alarms, never for branding.
- **Layout:** full-width header of three floating pills (Arkiv status · mark and links, the current page filled amber with the active-advisory count · wallet); edge-to-edge section panels; a bold centered hero with pill buttons and a stacked product preview (terminal, the Wall, the witness lamps) rising from its bottom edge; then three ways to use Mene with a developers/witnesses toggle, a works-with strip, the quorum diagram, the threat carousel over live counters, and the lockfile checker as the call to action. The footer is a framed card (CI one-liner, link columns, source and theme icons) ending in a giant lockup; a matching 404 page shows a ghosted "404".
- **Type:** Archivo, heavy and slightly wide, for headlines (it matches the wordmark); Inter for body; **JetBrains Mono for every hash, address, key and version**.
- **Motifs:** pill badges; a `) + (` ornament divider; check-mark feature lists; amber seal badges for Sealed/Inscribed; status chips (ACTIVE = red, PENDING = muted, WITHDRAWN = struck-through, MISSING = red).
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
