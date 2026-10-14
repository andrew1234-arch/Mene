/**
 * Generates the demo wallets into .env (gitignored) and prints ONLY their addresses, so they can be
 * funded from the Tiramisu faucet. Refuses to overwrite existing keys.
 */
import { appendFileSync, existsSync, readFileSync } from "node:fs"
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts"

const names = ["MENE_ISSUER_A_KEY", "MENE_ISSUER_B_KEY", "MENE_ISSUER_C_KEY", "MENE_KEEPER_KEY"]
const env = existsSync(".env") ? readFileSync(".env", "utf8") : ""
for (const n of names) {
  const m = env.match(new RegExp(`^${n}=(0x[0-9a-fA-F]{64})`, "m"))
  let key = m?.[1]
  if (!key) {
    key = generatePrivateKey()
    appendFileSync(".env", `${n}=${key}\n`)
  }
  console.log(`${n.replace("_KEY", "").padEnd(18)} ${privateKeyToAccount(key as `0x${string}`).address}`)
}
console.log("\nFund each address at the faucet linked from https://docs.arkiv.network/networks/tiramisu/")
