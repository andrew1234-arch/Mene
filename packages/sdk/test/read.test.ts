import { readFileSync } from "node:fs"
import { NoEntityFoundError } from "@arkiv-network/sdk"
import { describe, expect, it } from "vitest"
import { type MenePublicClient, readLive } from "../src/arkiv"
import { PROJECT } from "../src/constants"

const osv = JSON.parse(readFileSync("packages/sdk/test/fixtures/chalk.osv.json", "utf8"))
const A = "0x00000000000000000000000000000000000000aa"
const B = "0x00000000000000000000000000000000000000bb"
const STRANGER = "0x00000000000000000000000000000000000000cc"

type E = Record<string, unknown>
const attestation = (key: string, creator: string, advisory: string): E => ({
  key,
  creator,
  createdAt: 1n,
  attributes: {
    project: { value: PROJECT },
    type: { value: "attestation" },
    verdict: { value: "confirm" },
    advisory: { value: advisory },
  },
  toJson: () => ({}),
})
const advisory = (key: string, creator: string, readonly = true): E => ({
  key,
  creator,
  owner: "0x000000000000000000000000000000000000dEaD",
  createdAt: 1n,
  expiresAt: 2n,
  creationFlags: { readonly, permissionlessExtension: true },
  attributes: { project: { value: PROJECT }, type: { value: "advisory" } },
  toJson: () => osv,
})

/** A stand-in public client that counts arkiv_query calls (fetch, next and getEntity). */
function fakeClient(entities: E[]) {
  let queries = 0
  const page = (rows: E[]) => ({
    entities: rows,
    blockNumber: 7n,
    hasNextPage: () => false,
    next: async () => page([]),
  })
  const client = {
    select: () => {
      let type = ""
      let creator = ""
      const q = {
        where: (w: { toString(): string }) => {
          type = String(w).includes("attestation") ? "attestation" : "advisory"
          return q
        },
        createdBy: (c: string) => {
          creator = c.toLowerCase()
          return q
        },
        limit: () => q,
        fetch: async () => {
          queries++
          return page(
            entities.filter(
              (e) => (e.attributes as E & { type: { value: string } }).type.value === type && e.creator === creator,
            ),
          )
        },
      }
      return q
    },
    getEntity: async (key: string) => {
      queries++
      const e = entities.find((x) => x.key === key)
      if (!e) throw new NoEntityFoundError(key as `0x${string}`)
      return e
    },
  }
  return { pub: client as unknown as MenePublicClient, count: () => queries }
}

describe("readLive", () => {
  it("reads advisories in one query per witness, not one per advisory", async () => {
    const advs = Array.from({ length: 20 }, (_, i) => advisory(`0x${(i + 1).toString(16).padStart(2, "0")}`, A))
    const atts = advs.flatMap((a, i) => [
      attestation(`0xa${i}`, A, a.key as string),
      attestation(`0xb${i}`, B, a.key as string),
    ])
    const { pub, count } = fakeClient([...advs, ...atts])
    const live = await readLive(pub, [A, B])
    expect(Object.keys(live.advisories)).toHaveLength(20)
    expect(live.attestations).toHaveLength(40)
    expect(count()).toBe(4) // attestations + advisories, for each of 2 witnesses
  })

  it("falls back to getEntity for attested advisories a witness didn't create, and skips gone ones", async () => {
    const foreign = advisory("0xf1", STRANGER)
    const { pub, count } = fakeClient([
      foreign,
      attestation("0xa1", A, "0xf1"),
      attestation("0xa2", A, "0xdead01"), // advisory deleted or expired
    ])
    const live = await readLive(pub, [A])
    expect(Object.keys(live.advisories)).toEqual(["0xf1"])
    expect(live.advisories["0xf1"]!.creator).toBe(STRANGER)
    expect(count()).toBe(4) // 2 queries + 2 fallback reads
  })

  it("marks an advisory that isn't readonly as invalid without a second read", async () => {
    const { pub, count } = fakeClient([advisory("0x01", A, false), attestation("0xa1", A, "0x01")])
    const live = await readLive(pub, [A])
    expect(live.advisories).toEqual({})
    expect(live.invalid["0x01"]).toMatch(/readonly/)
    expect(count()).toBe(2)
  })
})
