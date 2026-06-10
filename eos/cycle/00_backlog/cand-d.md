# CAND-D — Customer data is durable and recoverable

> File: `cand-d.md` (00_backlog proposed candidate — not yet attested or EOS-numbered)

| | |
|---|---|
| **Candidate id** | `CAND-D` |
| **Phase** | Resilience |
| **Status** | `Proposed` — awaiting Greg's accept/reject + EOS-number assignment |
| **Witness / Entity** | Greg Cook · CloudPremise LLC |
| **Go-live target** | 2026-07-17 |
| **Master backlog** | [`../GOALS.md`](../GOALS.md) |
| **Launch-critical** | No (harden) |

## Proposed attestation (drafted in witness's voice)

> *"I attest that customer data is durable and recoverable — integrity preserved is also integrity restorable after corruption or loss."*

## Why

EOS-5 is integrity, EOS-6 is reconstitution from the alpha node. Neither says a customer's data plane can be restored if it corrupts. Integrity is not durability.

## Done when

A customer data store is corrupted/lost in test and restored intact; Greg witnesses.

## Cross-cycle dependencies

- Distinct from **EOS-5** (per-record integrity at write time) — CAND-D is *recoverability* (restorability after loss).
- Distinct from **EOS-6** (system reconstitution from alpha node) — CAND-D is customer-data-specific, not full-system.
- Salesforce backup/restore + AWS RDS snapshots + ECR image history are existing primitives; this candidate attests their completeness for customer data.

## Promotion path

When Greg accepts this candidate:
1. Assign next EOS ordinal
2. `git mv` to `00_backlog/brain_1.7.eos-N.md`
3. Update [`../GOALS.md`](../GOALS.md) to mark as Attested with EOS number
4. Follow standard EOS promotion path

Or Greg may reject or defer.
