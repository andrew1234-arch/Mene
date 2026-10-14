import {
  type AdvisoryStatus,
  DEFAULT_THRESHOLD,
  migrateState,
  explorer,
  type MeneState,
  publicClient,
  readLive,
  resolveStatus,
  severityOf,
  sourceLabel,
} from "@mene/sdk"
import defaultWitnessesJson from "../data/witnesses.json"
// Resolves to src/preview/sample.ts in preview builds and to an empty module in production.
import { SAMPLE_WITNESSES } from "mene:preview"

export const PREVIEW = import.meta.env.PUBLIC_MENE_PREVIEW === "1"

/** The README and arkiv/schema.md are the docs. */
export const REPO = "https://github.com/andrew1234-arch/Mene"
export const DOCS = {
  quickstart: `${REPO}#quickstart`,
  cli: `${REPO}#cli`,
  action: `${REPO}#github-action`,
  trust: `${REPO}#trust-model`,
  threats: `${REPO}#threat-model`,
  schema: `${REPO}/blob/main/arkiv/schema.md`,
  friction: `${REPO}/blob/main/arkiv/friction.md`,
  evidence: `${REPO}/blob/main/arkiv/evidence.md`,
}
const defaultWitnesses = PREVIEW ? SAMPLE_WITNESSES : defaultWitnessesJson

/** Site root. Preview builds use relative files, so the root is found from this chunk's URL. */
export const BASE = PREVIEW
  ? new URL("../", import.meta.url).pathname.replace(/\/$/, "")
  : import.meta.env.BASE_URL.replace(/\/$/, "")

/** URL of a site page: "/wall" in production, "wall.html" in preview builds. */
export const route = (page: string) => (PREVIEW ? `${BASE}/${page || "home"}.html` : `${BASE}/${page}`)

export interface Trust {
  issuers: { name: string; address: string }[]
  threshold: number
}

type Area = "local" | "session"
// Touching window.localStorage itself can throw (blocked site data), so resolve it inside try.
const area = (a: Area): Storage => (a === "session" ? window.sessionStorage : window.localStorage)
export const store = {
  get<T>(k: string, a: Area = "local"): T | undefined {
    try {
      const v = area(a).getItem(k)
      return v ? (JSON.parse(v) as T) : undefined
    } catch {
      return undefined
    }
  },
  set(k: string, v: unknown, a: Area = "local") {
    try {
      area(a).setItem(k, JSON.stringify(v, (_k, x) => (typeof x === "bigint" ? x.toString() : x)))
    } catch {
      /* private mode: run stateless */
    }
  },
  del(k: string, a: Area = "local") {
    try {
      area(a).removeItem(k)
    } catch {}
  },
}

/** The site trusts the three demo witnesses. Change trust in mene.config.json or the Action inputs. */
export function getTrust(): Trust {
  return { issuers: defaultWitnesses as Trust["issuers"], threshold: DEFAULT_THRESHOLD }
}
export const isTrusted = (a: string) => getTrust().issuers.some((i) => i.address.toLowerCase() === a.toLowerCase())

/** The browser's own anti-burial memory: what this browser has seen before. */
export function getState(): MeneState | undefined {
  return migrateState(store.get<unknown>("mene:state"))
}

let _pub: ReturnType<typeof publicClient> | undefined
export const pub = () => (_pub ??= publicClient())

export interface Wall {
  statuses: AdvisoryStatus[]
  blockNumber: string
  invalid: Record<string, string>
  trust: Trust
  at: number
  v: 2
}

let inflight: Promise<Wall> | undefined

/** Reads Arkiv and resolves quorum. Results are shared across pages for 20 s via sessionStorage. */
export async function loadWall(opts: { fresh?: boolean } = {}): Promise<Wall> {
  if (!opts.fresh) {
    const cached = store.get<Wall>("mene:wall", "session")
    if (cached && cached.v === 2 && Date.now() - cached.at < 20_000) return cached
  }
  inflight ??= (async () => {
    try {
      const trust = getTrust()
      if (!trust.issuers.length) throw new NoWitnessesError()
      const live = await readLive(pub(), trust.issuers.map((i) => i.address))
      const out = resolveStatus({
        issuers: trust.issuers.map((i) => i.address),
        threshold: trust.threshold,
        liveAttestations: live.attestations,
        liveAdvisories: live.advisories,
        state: getState(),
      })
      store.set("mene:state", out.state)
      const wall: Wall = { statuses: out.statuses, blockNumber: live.blockNumber.toString(), invalid: live.invalid, trust, at: Date.now(), v: 2 }
      store.set("mene:wall", wall, "session")
      setConnection({ ok: true, block: wall.blockNumber })
      return wall
    } catch (err) {
      if (!(err instanceof NoWitnessesError)) setConnection({ ok: false })
      throw err
    } finally {
      inflight = undefined
    }
  })()
  return inflight
}

/** A wall that renders now and re-renders once a fresh read lands. Retries on failure. */
export function watchWall(render: (w: Wall) => void, onError: (err: unknown, retry: () => void) => void) {
  const c = store.get<Wall>("mene:wall", "session")
  const cached = c?.v === 2 ? c : undefined
  if (cached) render(cached)
  let timer: ReturnType<typeof setTimeout> | undefined
  const run = () => {
    clearTimeout(timer)
    loadWall({ fresh: true })
      .then(render)
      .catch((err) => {
        if (!cached) onError(err, run)
        if (!(err instanceof NoWitnessesError)) timer = setTimeout(run, 10_000)
      })
  }
  run()
  return run
}

export class NoWitnessesError extends Error {
  constructor() {
    super("No witnesses configured")
  }
}

// ------------------------------------------------------------------ connection indicator

type Conn = { ok: boolean; block?: string }
const connListeners = new Set<(c: Conn) => void>()
let conn: Conn | undefined
export function setConnection(c: Conn) {
  conn = c
  for (const l of connListeners) l(c)
}
export function onConnection(l: (c: Conn) => void) {
  connListeners.add(l)
  if (conn) l(conn)
}

// ------------------------------------------------------------------ rendering helpers

export const esc = (s: unknown) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!)

export const short = (a: string) => (a.length > 14 ? `${a.slice(0, 6)}…${a.slice(-4)}` : a)

export function witnessName(address: string, trust = getTrust()): string | undefined {
  return trust.issuers.find((i) => i.address.toLowerCase() === address.toLowerCase())?.name || undefined
}

/** Address/key with explorer link and copy button. */
export function addrHtml(a: string, kind: "address" | "entity" | "tx" = "address", label?: string) {
  return `<span class="addr-wrap"><a class="addr" href="${explorer[kind](a)}" target="_blank" rel="noopener" title="${esc(a)}">${esc(label ?? short(a))}</a><button class="copy" data-copy="${esc(a)}" aria-label="Copy ${esc(a)}" title="Copy">⧉</button></span>`
}

export function chip(s: Pick<AdvisoryStatus, "status" | "label">) {
  return `<span class="chip ${s.status}">${esc(s.label)}</span>`
}

export function sevBadge(sev: string | undefined) {
  return sev ? `<span class="sev sev-${esc(sev)}">${esc(sev)}</span>` : ""
}

export function toast(msg: string, kind: "ok" | "err" = "ok") {
  let host = document.getElementById("toasts")
  if (!host) {
    host = document.createElement("div")
    host.id = "toasts"
    host.setAttribute("role", "status")
    document.body.append(host)
  }
  const t = document.createElement("div")
  t.className = `toast ${kind}`
  t.textContent = msg
  host.append(t)
  setTimeout(() => t.remove(), 3500)
}

export async function copyText(text: string, what = "Copied") {
  try {
    await navigator.clipboard.writeText(text)
    toast(`${what} to clipboard`)
  } catch {
    toast("Couldn't access the clipboard", "err")
  }
}

document.addEventListener("click", (e) => {
  const btn = (e.target as HTMLElement).closest<HTMLElement>("[data-copy]")
  if (btn) void copyText(btn.dataset.copy!)
  const from = (e.target as HTMLElement).closest<HTMLElement>("[data-copy-from]")
  if (from) void copyText(document.getElementById(from.dataset.copyFrom!)?.textContent ?? "")
})

/** Friendly network error with a retry button. */
export function errorHtml(err: unknown): string {
  if (err instanceof NoWitnessesError) {
    return `<div class="empty"><p><strong>No witnesses configured yet.</strong></p><p class="muted">The demo witnesses are added when the advisories are seeded. See <a href="${route("witnesses")}">Witnesses</a>.</p></div>`
  }
  return `<div class="empty"><p><strong>Can't reach the Arkiv network right now.</strong></p><p class="muted">Mene reads Arkiv directly from your browser, with no server in between. We'll keep retrying.</p><button class="btn" data-retry>Retry now</button></div>`
}
export function showError(el: HTMLElement, err: unknown, retry?: () => void) {
  el.innerHTML = errorHtml(err)
  el.querySelector("[data-retry]")?.addEventListener("click", () => {
    el.innerHTML = skeleton(3)
    retry?.()
  })
}

export const skeleton = (n = 3) => `<div class="sk-list">${'<div class="sk"></div>'.repeat(n)}</div>`

/** Approximate time left at the nominal 2 s block time. */
export function blocksToHuman(blocks: bigint | number): string {
  const s = Number(blocks) * 2
  if (s <= 0) return "expired"
  const d = Math.floor(s / 86400)
  if (d >= 1) return `${d} day${d === 1 ? "" : "s"}`
  const h = Math.floor(s / 3600)
  return h >= 1 ? `${h} h` : `${Math.ceil(s / 60)} min`
}

export const advisoryUrl = (key: string) => (PREVIEW ? `${route("advisory")}#${key}` : `${BASE}/advisory/?key=${key}`)

export function fmtDate(iso: string | undefined) {
  if (!iso) return ""
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
}

/** "5.6.1" / "≥1.0.0 <1.0.3" style summary of an OSV affected entry. */
export function affectedText(a: { versions?: string[]; ranges?: { events: Record<string, string>[] }[] }) {
  const parts = [...(a.versions ?? [])]
  for (const r of a.ranges ?? []) {
    const bits: string[] = []
    for (const e of r.events) {
      if (e.introduced !== undefined) bits.push(e.introduced === "0" ? "all" : `≥${e.introduced}`)
      if (e.fixed !== undefined) bits.push(`<${e.fixed}`)
      if (e.last_affected !== undefined) bits.push(`≤${e.last_affected}`)
    }
    parts.push(bits.join(" "))
  }
  return parts.join(", ")
}

/** One advisory as a clickable card (wall, home). */
export function advCard(s: AdvisoryStatus): string {
  const o = s.advisory?.osv
  const pkgs = o?.affected.map((a) => `${a.package.name} ${affectedText(a as never)}`).join(" · ") ?? "content not readable"
  const confirms = s.confirmers.length
  return `<li><a class="adv ${s.status === "WITHDRAWN" ? "withdrawn" : ""}" href="${advisoryUrl(s.key)}">
    <div class="t"><span class="pk">${esc(pkgs)}</span>${sevBadge(o ? severityOf(o) : undefined)}${o ? `<span class="src-tag">${esc(sourceLabel(o))}</span>` : ""}</div>
    <div class="right">${chip(s)}<span class="wit">${confirms} of ${getTrust().issuers.length} witnesses confirm</span></div>
    <div class="sum"><span class="id">${esc(o?.id ?? short(s.key))}</span> · ${esc(o?.summary ?? "")}${o?.published ? ` · ${esc(fmtDate(o.published))}` : ""}</div>
  </a></li>`
}
