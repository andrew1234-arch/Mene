import { describe, expect, it } from "vitest"
import type { AdvisoryRecord, AttestationRecord } from "../src/quorum"
import { resolveStatus } from "../src/quorum"

const A = "0xaaaa000000000000000000000000000000000001"
const B = "0xbbbb000000000000000000000000000000000002"
const C = "0xcccc000000000000000000000000000000000003"
const EVIL = "0xeeee000000000000000000000000000000000004"
const ADV = "0xad00000000000000000000000000000000000000000000000000000000000001"
const issuers = [A, B, C]

let n = 0
const att = (issuer: string, verdict: "confirm" | "withdraw", block: number): AttestationRecord => ({
  key: `0x${(++n).toString(16).padStart(64, "0")}`,
  advisory: ADV,
  issuer,
  verdict,
  createdAt: block,
  attestedAt: block,
})
const adv = { key: ADV, creator: A, owner: "0x000000000000000000000000000000000000dead", createdAt: 1, expiresAt: 999, readonly: true, permissionlessExtension: true, osv: {} } as unknown as AdvisoryRecord
const live = { [ADV]: adv }

describe("resolveStatus", () => {
  it("1 of 2 is pending", () => {
    const { statuses } = resolveStatus({ issuers, threshold: 2, liveAttestations: [att(A, "confirm", 1)], liveAdvisories: live })
    expect(statuses[0]).toMatchObject({ status: "PENDING", label: "PENDING 1/2", enforced: false })
  })
  it("2 of 3 is active", () => {
    const { statuses } = resolveStatus({ issuers, threshold: 2, liveAttestations: [att(A, "confirm", 1), att(B, "confirm", 2)], liveAdvisories: live })
    expect(statuses[0]).toMatchObject({ status: "ACTIVE", enforced: true })
  })
  it("ignores untrusted issuers (forgery never counts)", () => {
    const { statuses } = resolveStatus({ issuers, threshold: 2, liveAttestations: [att(A, "confirm", 1), att(EVIL, "confirm", 2)], liveAdvisories: live })
    expect(statuses[0]!.status).toBe("PENDING")
    expect(statuses[0]!.confirmers).toEqual([A])
  })
  it("same issuer twice counts once", () => {
    const { statuses } = resolveStatus({ issuers, threshold: 2, liveAttestations: [att(A, "confirm", 1), att(A, "confirm", 2)], liveAdvisories: live })
    expect(statuses[0]!.status).toBe("PENDING")
  })
  it("latest verdict per issuer wins; 2 withdrawals withdraw", () => {
    const { statuses } = resolveStatus({
      issuers, threshold: 2,
      liveAttestations: [att(A, "confirm", 1), att(B, "confirm", 2), att(A, "withdraw", 3), att(B, "withdraw", 4)],
      liveAdvisories: live,
    })
    expect(statuses[0]).toMatchObject({ status: "WITHDRAWN", enforced: false })
  })
  it("one stolen key cannot bury an ACTIVE advisory by withdrawing", () => {
    const { statuses } = resolveStatus({
      issuers, threshold: 2,
      liveAttestations: [att(A, "confirm", 1), att(B, "confirm", 2), att(A, "withdraw", 3)],
      liveAdvisories: live,
    })
    expect(statuses[0]).toMatchObject({ status: "ACTIVE", enforced: true, withdrawers: [A], confirmers: [B] })
  })
  it("a witness can retract its own confirmation before the quorum is reached", () => {
    const { statuses } = resolveStatus({
      issuers, threshold: 2,
      liveAttestations: [att(A, "confirm", 1), att(A, "withdraw", 2), att(B, "confirm", 3)],
      liveAdvisories: live,
    })
    expect(statuses[0]).toMatchObject({ status: "PENDING", label: "PENDING 1/2", enforced: false })
  })
  it("a deleted confirm still counts from the cache (anti-burial)", () => {
    const a = att(A, "confirm", 1)
    const b = att(B, "confirm", 2)
    const first = resolveStatus({ issuers, threshold: 2, liveAttestations: [a, b], liveAdvisories: live })
    const second = resolveStatus({ issuers, threshold: 2, liveAttestations: [b], liveAdvisories: live, state: first.state })
    expect(second.statuses[0]).toMatchObject({ status: "ACTIVE", enforced: true })
    expect(second.statuses[0]!.vanished.map((v) => v.key)).toEqual([a.key])
  })
  it("a vanished advisory becomes MISSING (was ACTIVE) and stays enforced", () => {
    const atts = [att(A, "confirm", 1), att(B, "confirm", 2)]
    const first = resolveStatus({ issuers, threshold: 2, liveAttestations: atts, liveAdvisories: live })
    const second = resolveStatus({ issuers, threshold: 2, liveAttestations: atts, liveAdvisories: {}, state: first.state })
    expect(second.statuses[0]).toMatchObject({ status: "MISSING", was: "ACTIVE", enforced: true, label: "MISSING (was ACTIVE)" })
    expect(second.statuses[0]!.advisory).toBeDefined()
    const third = resolveStatus({ issuers, threshold: 2, liveAttestations: atts, liveAdvisories: {}, state: second.state })
    expect(third.statuses[0]).toMatchObject({ status: "MISSING", was: "ACTIVE" })
  })
})
