# CAND-I — System stays out of PCI scope

> File: `cand-i.md` (00_backlog proposed candidate — Business/Legal Class — not yet attested)

| | |
|---|---|
| **Candidate id** | `CAND-I` |
| **Phase** | Money / Compliance |
| **Status** | `Proposed` — awaiting Greg's accept/reject + EOS-number assignment |
| **Witness / Entity** | Greg Cook · CloudPremise LLC |
| **Go-live target** | 2026-07-17 |
| **Master backlog** | [`../GOALS.md`](../GOALS.md) |
| **Launch-critical** | No (harden) |

## Proposed attestation (drafted in witness's voice)

> *"I attest that the system stays out of PCI scope — card data never touches or persists in the grid."*

## Why

Natural complement to EOS-12; keeps Stripe/Apple as the only custodians and the PCI surface minimal.

## Done when

A PCI-scope audit confirms no card data resides in the grid; Stripe/Apple alone hold the card-data surface; Greg witnesses.

## Cross-cycle dependencies

- Complements **EOS-12** (trusted payment providers) — EOS-12 says only Stripe + Apple touch money; CAND-I says specifically NO card data leaks into the grid.
- Tests: scan all SObjects + logs + databases for card-data patterns → expect zero hits.

## Promotion path

When Greg accepts this candidate:
1. Assign next EOS ordinal
2. `git mv` to `00_backlog/brain_1.7.eos-N.md`
3. Update [`../GOALS.md`](../GOALS.md) to mark as Attested with EOS number
4. Follow standard EOS promotion path

Or Greg may reject or defer.
