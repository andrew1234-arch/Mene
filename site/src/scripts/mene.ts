// Resolves to src/preview/sample.ts in preview builds and to an empty module in production.
import { SAMPLE_WITNESSES } from "mene:preview"
import {
  type AdvisoryStatus,
  DEFAULT_THRESHOLD,
  type MeneState,
  explorer,
  migrateState,
  publicClient,
  readLive,
  resolveStatus,
  severityOf,
} from "@mene/sdk"
import defaultWitnessesJson from "../data/witnesses.json"

const PREVIEW = import.meta.env.PUBLIC_MENE_PREVIEW === "1"

const defaultWitnesses = PREVIEW ? SAMPLE_WITNESSES : defaultWitnessesJson

/** Site root. Preview builds use relative files, so the root is found from this chunk's URL. */
const BASE = PREVIEW
  ? new URL("../", import.meta.url).pathname.replace(/\/$/, "")
  : import.meta.env.BASE_URL.replace(/\/$/, "")

/** URL of a site page: "/check" in production, "check.html" in preview builds. */
const route = (page: string) => (PREVIEW ? `${BASE}/${page || "home"}.html` : `${BASE}/${page}`)

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
      area(a).setItem(
        k,
        JSON.stringify(v, (_k, x) => (typeof x === "bigint" ? x.toString() : x)),
      )
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
export function pub() {
  if (!_pub) _pub = publicClient()
  return _pub
}

export interface Wall {
  statuses: AdvisoryStatus[]
  blockNumber: string
  invalid: Record<string, string>
  trust: Trust
  at: number
  v: 2
}

let inflight: Promise<Wall> | undefined

const WALL_KEY = "mene:wall"
/** The last advisory snapshot this browser read, whatever its age (localStorage). */
export function savedWall(): Wall | undefined {
  const w = store.get<Wall>(WALL_KEY)
  return w?.v === 2 && Array.isArray(w.statuses) ? w : undefined
}
export const forgetWall = () => store.del(WALL_KEY)

/** Reads Arkiv and resolves quorum. The snapshot is saved in localStorage and reused for 20 s. */
export async function loadWall(opts: { fresh?: boolean } = {}): Promise<Wall> {
  if (!opts.fresh) {
    const cached = savedWall()
    if (cached && Date.now() - cached.at < 20_000) return cached
  }
  inflight ??= (async () => {
    try {
      const trust = getTrust()
      if (!trust.issuers.length) throw new NoWitnessesError()
      const live = await readLive(
        pub(),
        trust.issuers.map((i) => i.address),
      )
      const out = resolveStatus({
        issuers: trust.issuers.map((i) => i.address),
        threshold: trust.threshold,
        liveAttestations: live.attestations,
        liveAdvisories: live.advisories,
        state: getState(),
      })
      store.set("mene:state", out.state)
      const wall: Wall = {
        statuses: out.statuses,
        blockNumber: live.blockNumber.toString(),
        invalid: live.invalid,
        trust,
        at: Date.now(),
        v: 2,
      }
      store.set(WALL_KEY, wall)
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

export type Freshness = "saved" | "live" | "stale"

/**
 * Renders the saved snapshot at once (if any), then refreshes live from Arkiv and renders again.
 * When Arkiv is unreachable it keeps the saved data and reports it as stale; it retries every 10 s.
 */
export function watchWall(render: (w: Wall, f: Freshness) => void, onError: (err: unknown, retry: () => void) => void) {
  const cached = savedWall()
  if (cached) render(cached, "saved")
  let timer: ReturnType<typeof setTimeout> | undefined
  const run = () => {
    clearTimeout(timer)
    loadWall({ fresh: true })
      .then((w) => render(w, "live"))
      .catch((err) => {
        const saved = savedWall()
        if (saved) render(saved, "stale")
        else onError(err, run)
        if (!(err instanceof NoWitnessesError)) timer = setTimeout(run, 10_000)
      })
  }
  run()
  return run
}

/** "Updated just now" / "Showing saved data from 14:02; Arkiv unreachable" line for data views. */
export function freshnessHtml(w: Wall, f: Freshness): string {
  const t = new Date(w.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  if (f === "stale")
    return `<p class="fresh is-stale" role="status">Showing saved data from ${esc(t)}; Arkiv unreachable. Retrying…</p>`
  if (f === "saved") return `<p class="fresh" role="status">Saved at ${esc(t)} · updating…</p>`
  return `<p class="fresh is-live" role="status">Updated just now · block ${esc(w.blockNumber)}</p>`
}

class NoWitnessesError extends Error {
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
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  )

export const short = (a: string) => (a.length > 14 ? `${a.slice(0, 6)}…${a.slice(-4)}` : a)

export function witnessName(address: string, trust = getTrust()): string | undefined {
  return trust.issuers.find((i) => i.address.toLowerCase() === address.toLowerCase())?.name || undefined
}

/** Address/key with explorer link and copy button. */
export function addrHtml(a: string, kind: "address" | "entity" | "tx" = "address", label?: string) {
  return `<span class="addr-wrap"><a class="addr" href="${explorer[kind](a)}" target="_blank" rel="noopener" title="${esc(a)}">${esc(label ?? short(a))}</a><button class="copy" data-copy="${esc(a)}" aria-label="Copy ${esc(a)}" title="Copy">⧉</button></span>`
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

/** Copies text and shows "Copied" on the button that asked for it. */
export async function copyText(text: string, btn?: HTMLElement) {
  try {
    await navigator.clipboard.writeText(text)
    if (btn && !btn.classList.contains("copy")) {
      const was = btn.textContent
      btn.textContent = "Copied"
      btn.classList.add("copied")
      setTimeout(() => {
        btn.textContent = was
        btn.classList.remove("copied")
      }, 1600)
    } else toast("Copied to clipboard")
  } catch {
    toast("Couldn't access the clipboard", "err")
  }
}

document.addEventListener("click", (e) => {
  const btn = (e.target as HTMLElement).closest<HTMLElement>("[data-copy]")
  if (btn) void copyText(btn.dataset.copy!, btn)
  const from = (e.target as HTMLElement).closest<HTMLElement>("[data-copy-from]")
  if (from) void copyText(document.getElementById(from.dataset.copyFrom!)?.textContent ?? "", from)
})

/** Friendly network error with a retry button. */
export function errorHtml(err: unknown): string {
  if (err instanceof NoWitnessesError) {
    return `<div class="empty"><p><strong>No witnesses are set up yet.</strong></p><p class="muted">Advisories appear here once witnesses publish and confirm them. See <a href="${route("witnesses")}">Witnesses</a>.</p></div>`
  }
  return `<div class="empty"><p><strong>Can't load advisories right now.</strong></p><p class="muted">The advisory network (Arkiv) didn't answer. Mene keeps retrying every 10 seconds.</p><button class="btn" data-retry>Retry now</button></div>`
}
export function showError(el: HTMLElement, err: unknown, retry?: () => void) {
  el.innerHTML = errorHtml(err)
  el.querySelector("[data-retry]")?.addEventListener("click", () => {
    el.innerHTML = skeleton(3)
    retry?.()
  })
}

const skeleton = (n = 3) => `<div class="sk-list">${'<div class="sk"></div>'.repeat(n)}</div>`

/** Approximate time left at the nominal 2 s block time. */
export function blocksToHuman(blocks: bigint | number): string {
  const s = Number(blocks) * 2
  if (s <= 0) return "expired"
  const d = Math.floor(s / 86400)
  if (d >= 1) return `${d} day${d === 1 ? "" : "s"}`
  const h = Math.floor(s / 3600)
  return h >= 1 ? `${h} h` : `${Math.ceil(s / 60)} min`
}

/**
 * Shareable page links. Production uses query strings (/advisories/?id=…); preview bundles are plain
 * files, so they carry the same parameters in the hash (advisories.html#id=…).
 */
export function link(page: string, params: Record<string, string> = {}): string {
  const q = new URLSearchParams(params).toString()
  if (PREVIEW) return `${route(page)}${q ? `#${q}` : ""}`
  return `${BASE}/${page}${page ? "/" : ""}${q ? `?${q}` : ""}`
}
/** Page parameters from the query string or, in preview bundles, the hash. */
export function params(): URLSearchParams {
  const p = new URLSearchParams(location.search)
  for (const [k, v] of new URLSearchParams(location.hash.slice(1))) if (!p.has(k)) p.set(k, v)
  return p
}

type Osv = NonNullable<AdvisoryStatus["advisory"]>["osv"]
/** Advisory pages are addressed by their OSV id; the entity key works too. */
export const advisoryUrl = (keyOrId: string, wall?: Wall) => {
  const s = wall?.statuses.find((x) => x.key === keyOrId.toLowerCase())
  return link("advisories", { id: s?.advisory?.osv.id ?? keyOrId })
}
const advisoryHref = (s: AdvisoryStatus) => link("advisories", { id: s.advisory?.osv.id ?? s.key })
export const packageHref = (name: string) => link("packages", { name })

/** Find an advisory by OSV id, alias or entity key. */
export function findAdvisory(w: Wall, idOrKey: string): AdvisoryStatus | undefined {
  const q = idOrKey.toLowerCase()
  return w.statuses.find(
    (s) =>
      s.key === q ||
      s.advisory?.osv.id.toLowerCase() === q ||
      s.advisory?.osv.aliases?.some((a) => a.toLowerCase() === q),
  )
}

/** Advisories written only to exercise the system (synthetic packages, preview samples). */
export function isTest(o: Osv | undefined): boolean {
  if (!o) return false
  return (
    o.id.startsWith("SAMPLE-") ||
    /^DEMO\b/i.test(o.summary) ||
    o.affected.some((a) => a.package.name.startsWith("mene-demo-"))
  )
}

/** Product wording for a status: always a word, never colour alone. */
export function statusWord(s: Pick<AdvisoryStatus, "status" | "label" | "confirmers" | "threshold">): string {
  switch (s.status) {
    case "ACTIVE":
      return "Confirmed"
    case "PENDING":
      return `Awaiting confirmation ${s.confirmers.length}/${s.threshold}`
    case "WITHDRAWN":
      return "Withdrawn"
    default:
      return "Removed from Arkiv · still enforced"
  }
}
export function statusChip(s: AdvisoryStatus) {
  return `<span class="chip ${s.status}">${esc(statusWord(s))}</span>`
}
export const pkgNames = (o: Osv | undefined) => [...new Set(o?.affected.map((a) => a.package.name) ?? [])]
export const publishedAt = (s: AdvisoryStatus) => Date.parse(s.advisory?.osv.published ?? "") || 0

export function fmtDate(iso: string | undefined) {
  if (!iso) return ""
  const d = new Date(iso)
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
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

/** One advisory as a row: package, version, severity, status in words, witnesses. */
export function advRow(s: AdvisoryStatus, opts: { compact?: boolean } = {}): string {
  const o = s.advisory?.osv
  const pk =
    o?.affected.map((a) => `${a.package.name} ${affectedText(a as never)}`).join(" · ") ?? "Content not readable"
  const test = isTest(o) ? `<span class="src-tag">Test advisory</span>` : ""
  return `<li><a class="adv ${s.status === "WITHDRAWN" ? "withdrawn" : ""}" href="${advisoryHref(s)}">
    <div class="t"><span class="pk">${esc(pk)}</span>${sevBadge(o ? severityOf(o) : undefined)}${test}</div>
    <div class="right">${statusChip(s)}<span class="wit">${s.confirmers.length} of ${getTrust().issuers.length} witnesses</span></div>
    ${opts.compact ? "" : `<div class="sum">${esc(o?.summary ?? "")}${o?.published ? ` · ${esc(fmtDate(o.published))}` : ""}</div>`}
  </a></li>`
}
