# CAND-H — The recursive loop is bounded and governed

> File: `cand-h.md` (00_backlog proposed candidate — not yet attested or EOS-numbered)

| | |
|---|---|
| **Candidate id** | `CAND-H` |
| **Phase** | Foundation |
| **Status** | `Proposed` — awaiting Greg's accept/reject + EOS-number assignment |
| **Witness / Entity** | Greg Cook · CloudPremise LLC |
| **Go-live target** | 2026-07-17 |
| **Master backlog** | [`../GOALS.md`](../GOALS.md) |
| **Launch-critical** | **YES** — one of the four load-bearing candidates |

## Proposed attestation (drafted in witness's voice)

> *"I attest that the recursive loop is bounded and governed — agents cannot spawn or self-modify production beyond limits and gates defined by policy and witnessed authority."*

## Why

EOS-1 is a recursive loop of AI-generated software visible to its builder. In production, self-modifying infrastructure needs an attested governor: spawn rate-limiting and batch logic, plus a human or policy gate on what the recursion may do to prod. This is the attestation that lets the steward sleep while the grid runs.

## Done when

An attempt to exceed spawn/self-modification limits in prod is gated; authorized recursion proceeds within bounds; Greg witnesses. (Load-bearing for launch.)

## Cross-cycle dependencies

- Governs **EOS-1** (recursive AI loop) — caps the recursion that EOS-1 enables.
- Pairs with **EOS-7** (PoLP via Identity__c) — bounded recursion enforced via Identity__c-scoped agents.
- Tests: rate-limit triggers when agent exceeds spawn budget; policy gate denies prod-modifying operations from unauthorized agents.

## Promotion path

When Greg accepts this candidate:
1. Assign next EOS ordinal (likely among the launch-critical four)
2. `git mv` to `00_backlog/brain_1.7.eos-N.md`
3. Update [`../GOALS.md`](../GOALS.md) to mark as Attested with EOS number
4. Follow standard EOS promotion path

Or Greg may reject or defer.
