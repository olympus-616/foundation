# CAND-G — The accounted royalty is actually disbursed to the cause

> File: `cand-g.md` (00_backlog proposed candidate — not yet attested or EOS-numbered)

| | |
|---|---|
| **Candidate id** | `CAND-G` |
| **Phase** | Money |
| **Status** | `Proposed` — awaiting Greg's accept/reject + EOS-number assignment |
| **Witness / Entity** | Greg Cook · CloudPremise LLC |
| **Go-live target** | 2026-07-17 |
| **Master backlog** | [`../GOALS.md`](../GOALS.md) |
| **Launch-critical** | **YES** — one of the four load-bearing candidates (identity-critical) |

## Proposed attestation (drafted in witness's voice)

> *"I attest that the accounted royalty is disbursed — the accumulated 7% actually reaches the named 501(c)(3) partner for the chosen cause, not merely accrues in ShellsGiven__c."*

## Why

EOS-5 attests the tithe is accounted. Accounting is not giving. The tithe is load-bearing to product identity; the open blocker is unnamed 501(c)(3) partners. The loop is not whole until the money leaves the ledger and lands at the cause.

## Done when

Accumulated tithe is disbursed to the named 501(c)(3) for a chosen cause and confirmed received; Greg witnesses. (Identity-critical.)

## Cross-cycle dependencies

- Closes the loop **EOS-5** opens — EOS-5 accounts the tithe; CAND-G disburses it. EOS-5 §2.A-ROY.4 (royalty disbursement) is the implementation point.
- Pairs with **EOS-12** (Stripe + Apple as trusted providers) — money-in via Stripe/Apple; money-out via 501(c)(3) disbursement.
- **Open blocker:** named 501(c)(3) partner per cause must be identified before this can close.

## Promotion path

When Greg accepts this candidate:
1. Assign next EOS ordinal (likely among the launch-critical four)
2. `git mv` to `00_backlog/brain_1.7.eos-N.md`
3. Update [`../GOALS.md`](../GOALS.md) to mark as Attested with EOS number
4. Follow standard EOS promotion path

Or Greg may reject or defer.
