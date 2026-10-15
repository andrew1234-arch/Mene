# Mene — Web pages, design and references

## Framework (decided)
- **Astro** (static multi-page, islands), deployed to **GitHub Pages** via Actions. There is no backend; every page reads Arkiv directly from the browser. This is the Censorship Resistance proof.
- No docs site: the README and `arkiv/schema.md` are the docs (judges read those).
- Interactive pieces (wall, check, live feed) are vanilla TS islands, or Preact if state grows. Shared logic is imported from `@mene/sdk`.
- **SPIKE S7:** bundle `@arkiv-network/sdk` in the browser (it depends on `brotli-wasm`).
  - Fallback 1: `vite-plugin-wasm`.
  - Fallback 2: call the `arkiv_query` JSON-RPC directly with `fetch` from the browser.

## Pages
The page list follows the product directive in [PRODUCT.md](PRODUCT.md): the product layer gets a visitor to an answer in one or two steps, and the proof lives one click deeper (/trust and each advisory's "Verify this advisory" panel).

1. `/` **Home**: "Warnings that can't be erased." with the check box in the hero (drop a lockfile or paste a GitHub repo URL), the 5 newest confirmed advisories, three value points linking to /trust, and a 4-line CI snippet.
2. `/check`: file, public GitHub repo URL (raw.githubusercontent.com, main then master) or the chalk example; a report with each hijacked package, its safe version and a copyable `npm install`, or a clean result; Copy summary and Download report. Deep links `?repo=` and `?example=`.
3. `/setup`: GitHub Actions (default), CLI and Other CI tabs; options rewrite the workflow live; an example failing job summary.
4. `/advisories` and `/advisories/?id=<OSV id>`: search, status, severity and date filters (range queries on Arkiv), show-withdrawn toggle, live activity; detail leads with what to do, with the proof collapsed under "Verify this advisory".
5. `/packages/?name=<pkg>`: every advisory for a package and the safe version, filtered from the loaded snapshot so the name never goes on the wire.
6. `/trust`: six plain-language answers, each with "verify it yourself" detail; absorbs the quorum diagram, threat table and Daniel 5 story.
7. `/witnesses`: who the witnesses are, what each confirmed, and how to become one.

Old `/wall` and `/advisory/?key=` links redirect; `404.html` resolves `/advisories/<id>` and `/packages/<name>`.

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
