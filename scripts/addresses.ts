// Prints the public addresses for the configured keys. Never prints a key.
import { privateKeyToAccount } from "viem/accounts"
import { loadEnv } from "./env"

loadEnv()
for (const n of ["MENE_ISSUER_A_KEY", "MENE_ISSUER_B_KEY", "MENE_ISSUER_C_KEY", "MENE_FORGER_KEY", "MENE_KEEPER_KEY"]) {
  const k = process.env[n]
  console.log(`${n.replace("_KEY", "").padEnd(18)} ${k ? privateKeyToAccount((k.startsWith("0x") ? k : `0x${k}`) as `0x${string}`).address : "(not set)"}`)
}
