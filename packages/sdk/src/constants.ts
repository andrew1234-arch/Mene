export const PROJECT = "mene-v1"
export const SCHEMA_VERSION = 1

export const TIRAMISU = {
  chainId: 7738577,
  rpcUrl: "https://rpc.tiramisu.db-chain.testnet.arkiv.network",
  wsUrl: "wss://rpc.tiramisu.db-chain.testnet.arkiv.network",
  explorer: "https://tiramisu.explorer.arkiv.network",
} as const

/** Advisories are sealed to this address so no key, including the issuer's, can delete them. */
export const BURN_ADDRESS = "0x000000000000000000000000000000000000dEaD" as const

export const ADVISORY_LIFETIME_DAYS = 365
export const ATTESTATION_LIFETIME_DAYS = 365

export const DEFAULT_THRESHOLD = 2

/** OSV/GHSA severity words. Stored as i32 1-4 so range queries work. */
export const SEVERITIES = ["low", "moderate", "high", "critical"] as const
export type Severity = (typeof SEVERITIES)[number]

/** Severity is stored as an i32 attribute so range queries work. */
export function severityToInt(s: Severity): number {
  return SEVERITIES.indexOf(s) + 1
}

export function intToSeverity(n: number): Severity {
  const s = SEVERITIES[n - 1]
  if (!s) throw new Error(`Unknown severity level ${n}`)
  return s
}

export function isSeverity(s: string): s is Severity {
  return (SEVERITIES as readonly string[]).includes(s)
}

export const explorer = {
  address: (a: string) => `${TIRAMISU.explorer}/address/${a}`,
  tx: (h: string) => `${TIRAMISU.explorer}/tx/${h}`,
  entity: (k: string) => `${TIRAMISU.explorer}/entity/${k}`,
}
