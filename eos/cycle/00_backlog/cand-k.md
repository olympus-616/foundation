# CAND-K — SOC2 evidence trail exists and the auditor engagement is real

> File: `cand-k.md` (00_backlog proposed candidate — Business/Legal Class — not yet attested)

| | |
|---|---|
| **Candidate id** | `CAND-K` |
| **Phase** | Compliance |
| **Status** | `Proposed` — awaiting Greg's accept/reject + EOS-number assignment |
| **Witness / Entity** | Greg Cook · CloudPremise LLC |
| **Go-live target** | 2026-07-17 |
| **Master backlog** | [`../GOALS.md`](../GOALS.md) |
| **Launch-critical** | No (harden) |

## Proposed attestation (drafted in witness's voice)

> *"I attest that a SOC2 evidence trail exists and the auditor engagement is confirmed."*

## Why

The Eos witness records from EOS-1 onward already constitute most of the trail. Open blocker: auditor engagement undocumented. This attests it is real and committed.

## Done when

Auditor engagement documented; SOC2 evidence trail (Eos witness records + procedural artifacts) is present and queryable; Greg witnesses.

## Cross-cycle dependencies

- Builds on every prior EOS (1-12) — each shipped cycle's witness record is SOC2 evidence.
- Pairs with **CAND-J** (terms/privacy) — both are compliance artifacts.
- The `06_shipped/` cycle docs are the canonical evidence-trail format.

## Promotion path

When Greg accepts this candidate:
1. Assign next EOS ordinal
2. `git mv` to `00_backlog/brain_1.7.eos-N.md`
3. Update [`../GOALS.md`](../GOALS.md) to mark as Attested with EOS number
4. Follow standard EOS promotion path

Or Greg may reject or defer.
