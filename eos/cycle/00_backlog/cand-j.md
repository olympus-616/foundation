# CAND-J — Terms, privacy, and customer agreement accepted at signup

> File: `cand-j.md` (00_backlog proposed candidate — Business/Legal Class — not yet attested)

| | |
|---|---|
| **Candidate id** | `CAND-J` |
| **Phase** | Compliance |
| **Status** | `Proposed` — awaiting Greg's accept/reject + EOS-number assignment |
| **Witness / Entity** | Greg Cook · CloudPremise LLC |
| **Go-live target** | 2026-07-17 |
| **Master backlog** | [`../GOALS.md`](../GOALS.md) |
| **Launch-critical** | No (harden) |

## Proposed attestation (drafted in witness's voice)

> *"I attest that terms, privacy policy, and customer agreement are present and accepted at signup."*

## Why

Defines the EOS-11 data-handler boundary contractually, not only technically.

## Done when

Every new customer at signup is presented with and affirmatively accepts terms + privacy + customer agreement; record of acceptance is durable; Greg witnesses.

## Cross-cycle dependencies

- Complements **EOS-11** (steward not data handler) — EOS-11 is the technical boundary; CAND-J is the contractual boundary that ratifies it.
- Pairs with **CAND-K** (SOC2) — terms/privacy are SOC2 evidence-trail artifacts.
- Existing iris portal Privacy + Terms + Security views (per memory `feedback_cosmic_seven_canonical.md`) are the seed.

## Promotion path

When Greg accepts this candidate:
1. Assign next EOS ordinal
2. `git mv` to `00_backlog/brain_1.7.eos-N.md`
3. Update [`../GOALS.md`](../GOALS.md) to mark as Attested with EOS number
4. Follow standard EOS promotion path

Or Greg may reject or defer.
