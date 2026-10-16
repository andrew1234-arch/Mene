# Tasks — in order, with acceptance criteria. Log Arkiv surprises in /arkiv/friction.md as they happen.

## Task 0 — Environment (≤ 30 min)
- Scaffold the monorepo (SPEC), MIT LICENSE, `.gitignore` (incl. `.env`), `.env.example`.
- **S0:** `curl -s -X POST $RPC -H 'content-type: application/json' -d '{"jsonrpc":"2.0","id":1,"method":"eth_chainId","params":[]}'` → `0x7614d1`.
  - Fallback if blocked: tell the user, keep building with mocks and tests, and put on-chain steps in `scripts/` for the user to run locally.
- Done when `npm test` and `npm run build` pass on the skeleton.

## Task 1 — SPIKES (`scripts/spike.ts`, ≤ 2 h). Results go in friction.md, including GLM spent per operation.
- **S1 seal:**
  - One `executeBatch`: create advisory (readonly + permissionlessExtension) + attestation + `ownershipChanges` advisory → burn. Then the original key tries `deleteEntity` → expect revert.
  - Fallback A: transfer in a second tx.
  - Fallback B: no seal; rely on cache + alarms + chain history, and drop the Sealed badge everywhere.
- **S2:** the keeper extends a permissionless entity → success; the keeper extends a normal entity → revert.
- **S3:** patching a readonly entity → revert.
- **S4:** `createdBy()` excludes a look-alike entity from an untrusted wallet; `gte("severity", i32(3))` works; cursor paging works.
- **S5:** `watchEntityEvents` over `webSocket()` without `fromBlock` receives create + delete.
- **S6:** `ExpirationTime.fromDays(365)` accepted. Compare its cost with 30 days; if too costly, use 90 days plus keepalive.
- **S7:** the SDK runs in an Astro/Vite browser bundle. Fallback 1: `vite-plugin-wasm`; fallback 2: direct `arkiv_query` JSON-RPC via `fetch`.

## Task 2 — @mene/sdk
- OSV payload types and validation, attribute builders, `PROJECT="mene-v1"`, `BURN_ADDRESS`, severity map (low 1 · moderate 2 · high 3 · critical 4).
- Arkiv layer: `publishAdvisory` (single batch), `attest`, `keepalive`, `fetchAttestations` (paged), `fetchAdvisory`.
- `resolveStatus` exactly per SPEC, with the cache merge; lockfile v2/v3 parser; matcher.
- Done when tests cover:
  - 2-of-3 confirm then 1 deletion with cache
  - a confirm→withdraw flip by the same issuer
  - an untrusted creator ignored
  - a non-readonly advisory rejected
  - parsing a real v3 lockfile

## Task 3 — CLI
All SPEC commands, a pretty table and `--json`, exit codes per SPEC. Done when `mene check --lockfile examples/chalk-attack/package-lock.json` exits 1 once chalk is ACTIVE on Tiramisu.

## Task 4 — Seed real data, record everything in `arkiv/evidence.md`
- **Mirror first (`scripts/mirror.ts`):** import the Sept 2025 qix-incident npm records from `ossf/malicious-packages` as-is (see SPEC "Real data"). A inscribes, B confirms. Then add other npm account-takeover records, curated, if budget allows.
- Mene-original entries (`seed.ts`) for the demo flows:
  - **MENE-2025-0001 chalk** (skip if the mirror already covers chalk; then use the mirrored record for the demo) — affected `5.6.1`, recommended `5.6.0`, critical. A inscribes, B confirms.
  - Look up chalk's GHSA/MAL aliases on osv.dev and include them only if confirmed there.
  - **MENE-2025-0002 debug** (same rule) — affected `4.4.2`, recommended `4.4.1`, critical.
  - Aliases: `GHSA-4x49-vf9v-38px`, `CVE-2025-59144`, `MAL-2025-46974`.
  - References: the GHSA, `https://socket.dev/blog/npm-author-qix-compromised-in-major-supply-chain-attack`, `https://github.com/debug-js/debug/issues/1005`.
  - B inscribes, C confirms.
- **MENE-2026-0001** — synthetic package `mene-demo-false-alarm`. C inscribes, A confirms, then A and C withdraw.
- Add other packages from the incident only with versions confirmed on osv.dev or the package's own advisory.
- `evidence.md`: every wallet address and role, entity keys, tx hashes, explorer links.

## Task 5 — Fixtures + Action
- `examples/chalk-attack/package-lock.json`: valid lockfileVersion 3 with chalk 5.6.1, debug 4.4.2 and a few benign deps.
- `examples/clean`: the same but with safe versions.
- Both folders get a README saying "never install".
- The Action plus demo workflow: red on attack, green on clean, with the table in the job summary.

## Task 6 — Site (DESIGN.md, every page)
- Build all 5 pages with the drafted copy, both themes, responsive.
- Deploy to Vercel (static output, `vercel.json`).
- Done when the public URL works with no backend, `/check` works offline after load, and the Wall's live strip updates on a new attestation.

## Task 7 — Docs, README, submission kit
- README: what/why, 60-second quickstart, CLI and Action usage, trust model, limitations, links (site, explorer, video).
- Finalize `arkiv/schema.md` and `arkiv/friction.md` against what is actually deployed.
- `VIDEO.md`: a shot-by-shot script for the SPEC demo, ≤ 3:00, with on-screen commands.
- `SUBMISSION.md`: three "Why this pillar?" answers (Security, CR, Open Source), then drafted answers to every Devfolio question (hackathon `docs/submission-checklist.md`, Q1–Q17). Pre-existing work: None. LLMs: Claude.
- Code freeze 18 Oct 18:00 UTC. No history rewrites.
