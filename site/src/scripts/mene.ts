import {
  type AdvisoryStatus,
  DEFAULT_THRESHOLD,
  emptyState,
  explorer,
  type MeneState,
  publicClient,
  readLive,
  resolveStatus,
} from "@mene/sdk"
import defaultWitnesses from "../data/witnesses.json"

export const BASE = import.meta.env.BASE_URL.replace(/\/$/, "")

export interface Trust {
  issuers: { name: string; address: string }[]
  threshold: number
}

const store = {
  get<T>(k: string): T | undefined {
    try {
      const v = localStorage.getItem(k)
      return v ? (JSON.parse(v) as T) : undefined
    } catch {
      return undefined
    }
  },
  set(k: string, v: unknown) {
    try {
      localStorage.setItem(k, JSON.stringify(v))
    } catch {
      /* private mode: run stateless */
    }
  },
}

export function getTrust(): Trust {
  const t = store.get<Trust>("mene:trust")
  if (t?.issuers?.length) return t
  return { issuers: defaultWitnesses as Trust["issuers"], threshold: DEFAULT_THRESHOLD }
}
export function setTrust(t: Trust | null) {
  if (t === null) {
    try {
      localStorage.removeItem("mene:trust")
    } catch {}
  } else store.set("mene:trust", t)
}

/** The browser's own anti-burial memory: what this browser has seen before. */
export function getState(): MeneState | undefined {
  const s = store.get<MeneState>("mene:state")
  return s?.version === 1 ? { ...emptyState(), ...s } : undefined
}

let _pub: ReturnType<typeof publicClient> | undefined
export const pub = () => (_pub ??= publicClient())

export interface Wall {
  statuses: AdvisoryStatus[]
  blockNumber: bigint
  invalid: Record<string, string>
  trust: Trust
}

export async function loadWall(): Promise<Wall> {
  const trust = getTrust()
  if (!trust.issuers.length) throw new Error("No witnesses configured yet. Add some on the Witnesses page.")
  const live = await readLive(pub(), trust.issuers.map((i) => i.address))
  const out = resolveStatus({
    issuers: trust.issuers.map((i) => i.address),
    threshold: trust.threshold,
    liveAttestations: live.attestations,
    liveAdvisories: live.advisories,
    state: getState(),
  })
  store.set("mene:state", out.state)
  return { statuses: out.statuses, blockNumber: live.blockNumber, invalid: live.invalid, trust }
}

export const esc = (s: unknown) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!)

export const short = (a: string) => (a.length > 14 ? `${a.slice(0, 6)}…${a.slice(-4)}` : a)

export function witnessName(address: string, trust = getTrust()): string | undefined {
  return trust.issuers.find((i) => i.address.toLowerCase() === address.toLowerCase())?.name
}

/** Address/key with explorer link and copy button. */
export function addrHtml(a: string, kind: "address" | "entity" | "tx" = "address", label?: string) {
  return `<a class="addr" href="${explorer[kind](a)}" target="_blank" rel="noopener" title="${esc(a)}">${esc(label ?? short(a))}</a><button class="copy" data-copy="${esc(a)}" aria-label="Copy ${esc(a)}">⧉</button>`
}

export function chip(s: AdvisoryStatus) {
  return `<span class="chip ${s.status}">${esc(s.label)}</span>`
}

document.addEventListener("click", (e) => {
  const btn = (e.target as HTMLElement).closest<HTMLButtonElement>("[data-copy]")
  if (!btn) return
  void navigator.clipboard?.writeText(btn.dataset.copy!).then(() => {
    const old = btn.textContent
    btn.textContent = "✓"
    setTimeout(() => (btn.textContent = old), 900)
  })
})

export function showError(el: HTMLElement, err: unknown) {
  const msg = (err as Error)?.message?.split("\n")[0] ?? String(err)
  el.innerHTML = `<p class="error">Couldn't read Arkiv: ${esc(msg)}</p><p class="muted small">Mene has no server to fall back to — that's the point. Check your connection to <code>rpc.tiramisu.db-chain.testnet.arkiv.network</code> and reload.</p>`
}

/** Approximate seconds left at the nominal 2 s block time. */
export function blocksToHuman(blocks: bigint | number): string {
  const s = Number(blocks) * 2
  if (s <= 0) return "expired"
  const d = Math.floor(s / 86400)
  if (d >= 1) return `~${d} day${d === 1 ? "" : "s"}`
  const h = Math.floor(s / 3600)
  return h >= 1 ? `~${h} h` : `~${Math.ceil(s / 60)} min`
}

export const advisoryUrl = (key: string) => `${BASE}/advisory/?key=${key}`
