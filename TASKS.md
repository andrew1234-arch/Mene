# Tasks — in order, with acceptance criteria. Log Arkiv surprises in /arkiv/friction.md as they happen.

> NOTE: the hand-off message was truncated part-way through Task 0 (S0). The remainder of this file needs to be re-supplied; the agent continues with best judgement from SPEC.md/DESIGN.md meanwhile.

## Task 0 — Environment (≤ 30 min)
- Scaffold the monorepo (SPEC), MIT LICENSE, `.gitignore` (incl. `.env`), `.env.example`.
- **S0:** `curl -s -X POST $RPC -H 'content-type: application/json' -d '{"jsonrpc":"2.0","id":1,"method":"eth_chainId","params":[]}'` → `0x7614d1`
