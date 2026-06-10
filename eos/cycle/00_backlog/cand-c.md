# CAND-C — Partial failure degrades cleanly, no cascade

> File: `cand-c.md` (00_backlog proposed candidate — not yet attested or EOS-numbered)

| | |
|---|---|
| **Candidate id** | `CAND-C` |
| **Phase** | Resilience |
| **Status** | `Proposed` — awaiting Greg's accept/reject + EOS-number assignment |
| **Witness / Entity** | Greg Cook · CloudPremise LLC |
| **Go-live target** | 2026-07-17 |
| **Master backlog** | [`../GOALS.md`](../GOALS.md) |
| **Launch-critical** | No (harden) |

## Proposed attestation (drafted in witness's voice)

> *"I attest that partial failure degrades cleanly without cascade or data loss — a failed provider, region, node, or LLM route does not take the system down with it."*

## Why

Generalizes the van-node requirement (survives flaky connectivity, clean failure) to the whole grid.

## Done when

A provider/region/node/route is failed in isolation; the system degrades cleanly with no cascade and no data loss; Greg witnesses.

## Cross-cycle dependencies

- Distinct from **EOS-6** (full destruction except alpha node) — CAND-C is the partial-failure case (one provider, one region, one route).
- Distinct from **CAND-A** (rollback) — CAND-C is runtime failure, not deployment failure.
- Tests Athena LLM-route fallback, multi-provider Pantheon resilience, alpha-node disconnection tolerance.

## Promotion path

When Greg accepts this candidate:
1. Assign next EOS ordinal
2. `git mv` to `00_backlog/brain_1.7.eos-N.md`
3. Update [`../GOALS.md`](../GOALS.md) to mark as Attested with EOS number
4. Follow standard EOS promotion path

Or Greg may reject or defer.
