---
pitch: "Enforce + visualize per-app plutus quotas"
---

# CAND-N — Enforce + visualize per-app plutus quotas

> File: `cand-n.md` (00_backlog proposed candidate — not yet attested or EOS-numbered)

| | |
|---|---|
| **Candidate id** | `CAND-N` |
| **Phase** | Resilience / Governance |
| **Status** | `Proposed` — awaiting Greg's accept/reject + EOS-number assignment |
| **Witness / Entity** | Greg Cook · CloudPremise LLC |
| **Go-live target** | 2026-07-17 |
| **Master backlog** | [`../GOALS.md`](../GOALS.md) |
| **Launch-critical** | No (harden) |

## Proposed attestation (drafted in witness's voice)

> *"I attest per-app Plutus quotas are enforced at ingest-time and visualized on the admin surface, so that no AppKey can exceed its allocated metering ceiling, the `quota.exceeded` event drives the right operator action, and the operator sees per-app consumption vs ceiling in real time."*

## Why

The §9.Q9–Q10 scope from the PR #42 delta analysis — once per-app `AppKey__c` is a non-null column on every MeteringEvent (per `brain_2.7.eos-13`) and `quota.exceeded` is an emitted event signature (per `brain_2.7.eos-14`), the ceiling-enforcement layer becomes buildable. Enforcement runs at plutus ingest, before the ledger row is minted, so a runaway surface is capped at its allocation rather than discovered after the fact. Visualization runs on the admin surface (iris or portal admin), showing per-app consumption vs ceiling with the quota-exceeded event feed in the operator view.

Without this, the fleet has no per-app budget cap — a buggy or hostile surface can burn through the shared metering pool with no backpressure until external billing surfaces the pain. With this, each app has a declared ceiling, the ceiling is enforced at wire-speed, and the operator sees the pressure build before anything breaks.

## Done when

Three apps have declared quotas (one each at `turtleshell`, `guardians`, `portal`), one surface deliberately exceeds its ceiling, the plutus ingest rejects the overage with a `quota.exceeded` event, the admin visualization renders the per-app consumption + ceiling + the overage event in real time, no `LedgerEntry__c` row lands for the over-ceiling attempt, and the Steward observes the correct operator response (suspend / raise / investigate). Greg witnesses.

## Cross-cycle dependencies

- **Hard dependency on `brain_2.7.eos-13`** (MeteringEvent trace widening) — quota enforcement reads `AppKey__c` + `ApiKey__c` from every ingested event; both must be non-null and canonical.
- **Hard dependency on `brain_2.7.eos-14`** (event vocabulary) — the `quota.exceeded` emission signature must exist in `BILLABLE_EVENTS`.
- Sharpens **`brain_2.7.eos-1`** (HUD) — HUD L10 budget-cap verification depends on `quota.exceeded` as the kill-switch signal.
- Complements **`brain_1.7.eos-5`** (umbrella accounting) — per-app observability without per-app enforcement is diagnostics without governance.

## Promotion path

When Greg accepts this candidate:
1. Confirm `brain_2.7.eos-13` + `brain_2.7.eos-14` are at least in `04_in_development/` (hard deps).
2. Assign next EOS ordinal.
3. `git mv` to `00_backlog/brain_2.7.eos-N.md` (rename to attested format).
4. Update [`../GOALS.md`](../GOALS.md) to mark as Attested with EOS number.
5. Follow standard EOS promotion path when ready for planning.

Or Greg may reject or defer.
