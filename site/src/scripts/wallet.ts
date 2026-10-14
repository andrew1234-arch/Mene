import { createWalletClient } from "@arkiv-network/sdk"
import { tiramisu } from "@arkiv-network/sdk/chains"
import { type MeneWalletClient, TIRAMISU } from "@mene/sdk"
import { type EIP1193Provider, custom } from "viem"
import { isTrusted, store, toast } from "./mene"

declare global {
  interface Window {
    ethereum?: EIP1193Provider
  }
}

const CHAIN_HEX = `0x${TIRAMISU.chainId.toString(16)}`
type Listener = (address: string | null) => void
const listeners = new Set<Listener>()
let current: string | null = null

export const hasWallet = () => typeof window !== "undefined" && !!window.ethereum
export const connectedAddress = () => current
export function onWallet(l: Listener) {
  listeners.add(l)
  l(current)
}
function set(a: string | null) {
  current = a
  if (a) store.set("mene:wallet", true)
  else store.del("mene:wallet")
  for (const l of listeners) l(a)
}

async function ensureChain(eth: EIP1193Provider) {
  const id = (await eth.request({ method: "eth_chainId" })) as string
  if (id?.toLowerCase() === CHAIN_HEX) return
  try {
    await eth.request({ method: "wallet_switchEthereumChain", params: [{ chainId: CHAIN_HEX }] })
  } catch (err) {
    if ((err as { code?: number }).code !== 4902) throw err
    await eth.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: CHAIN_HEX,
          chainName: "Arkiv Tiramisu testnet",
          nativeCurrency: tiramisu.nativeCurrency,
          rpcUrls: [TIRAMISU.rpcUrl],
          blockExplorerUrls: [TIRAMISU.explorer],
        },
      ],
    })
  }
}

export async function connect(): Promise<string> {
  const eth = window.ethereum
  if (!eth) throw new Error("No browser wallet found. Install one (e.g. MetaMask or Rabby), or use the CLI.")
  const [a] = (await eth.request({ method: "eth_requestAccounts" })) as string[]
  if (!a) throw new Error("The wallet returned no account")
  await ensureChain(eth)
  set(a.toLowerCase())
  return a.toLowerCase()
}

export function disconnect() {
  set(null)
}

/** A wallet client for Arkiv writes, signed by the browser wallet. Switches chain if needed. */
export async function wallet(): Promise<MeneWalletClient> {
  const eth = window.ethereum
  if (!eth) throw new Error("No browser wallet found")
  const a = current ?? (await connect())
  await ensureChain(eth)
  return createWalletClient({
    chain: tiramisu,
    transport: custom(eth),
    account: a as `0x${string}`,
  }) as unknown as MeneWalletClient
}

/** Human message for wallet/transaction failures. */
function txError(err: unknown): string {
  const e = err as { code?: number; shortMessage?: string; message?: string }
  if (e.code === 4001 || /rejected|denied/i.test(e.message ?? "")) return "You rejected the request in your wallet."
  if (/insufficient funds/i.test(e.message ?? ""))
    return "This wallet has no testnet GLM for gas. Use the Tiramisu faucet."
  return (e.shortMessage ?? e.message ?? String(err)).split("\n")[0]!
}

export async function withTx<T>(
  btn: HTMLButtonElement | null,
  label: string,
  fn: () => Promise<T>,
): Promise<T | undefined> {
  const old = btn?.textContent
  if (btn) {
    btn.disabled = true
    btn.textContent = `${label}…`
  }
  try {
    return await fn()
  } catch (err) {
    console.error(err)
    toast(txError(err), "err")
    return undefined
  } finally {
    if (btn) {
      btn.disabled = false
      btn.textContent = old ?? ""
    }
  }
}

export const isWitness = () => !!current && isTrusted(current)

// Silent reconnect (no prompt) when the user connected before.
if (hasWallet()) {
  const eth = window.ethereum!
  if (store.get("mene:wallet")) {
    eth.request({ method: "eth_accounts" }).then(
      (accs) => {
        const a = (accs as string[])[0]
        if (a) set(a.toLowerCase())
      },
      () => {},
    )
  }
  eth.on?.("accountsChanged", (accs: string[]) => {
    if (current !== null || store.get("mene:wallet")) set(accs[0]?.toLowerCase() ?? null)
  })
}
