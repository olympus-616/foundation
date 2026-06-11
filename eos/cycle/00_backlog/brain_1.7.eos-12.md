# EOS-12 — Money moves only through trusted payment providers

> File: `brain_1.7.eos-12.md` (00_backlog card — Attested but not yet promoted to planning)

| | |
|---|---|
| **Cycle ordinal** | `eos-12` |
| **Phase** | Money |
| **Status** | `Attested` (Steward 2026-06-10) — card in `00_backlog/`, not yet promoted to `01_planning/` |
| **Witness / Entity** | Greg Cook · CloudPremise LLC |
| **Go-live target** | 2026-07-17 |
| **Master backlog** | [`../GOALS.md`](../GOALS.md) |

## Canonical attestation

> *"I attest that no money moves throughout the network without going through trusted payment providers, for which Stripe and Apple Pay are the first payment providers."*

## Done when

No funds move on system-internal rails; every transaction passes through a trusted provider; Stripe and Apple Pay live as the first two; Greg witnesses.

## Cross-cycle dependencies

- Feeds **EOS-5** Block A-RAILS — Stripe + Apple are the payment-event source for the royalty engine.
- Pairs with **CAND-G** (royalty disbursement) — money in via Stripe/Apple; money out via 501(c)(3) disbursement. Same money-truth-loop, both ends.
- Pairs with **CAND-I** (PCI scope) — Stripe + Apple are the only card-data custodians.

## Promotion path

When promoted to `01_planning/`, the Steward authors §1-§5 per [`../TEMPLATE.md`](../TEMPLATE.md):
- §1.1 forever-intent reflects the canonical attestation above
- §1.2 slice defines the Stripe-and-Apple wiring + denial of internal-rail payment attempts
- §2 acceptance criteria operationalize the done_when (every payment event in `LedgerEntry__c` traces back to a Stripe or Apple transaction ID; internal-rail attempts are blocked)
- §3 NFRs (provider-fee budget, settlement timing)
- §4 feedback inputs (paused revenue-path sprint `docs/sprint-plan-revenue-path-2026-05-16.md` is the seed)
- §5 Steward approval gate

Then `git mv` to `01_planning/brain_1.7.eos-12.md`.
