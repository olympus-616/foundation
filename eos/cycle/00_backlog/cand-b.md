# CAND-B — System is observed; degradation surfaces before customer impact

> File: `cand-b.md` (00_backlog proposed candidate — not yet attested or EOS-numbered)

| | |
|---|---|
| **Candidate id** | `CAND-B` |
| **Phase** | Resilience |
| **Status** | `Proposed` — awaiting Greg's accept/reject + EOS-number assignment |
| **Witness / Entity** | Greg Cook · CloudPremise LLC |
| **Go-live target** | 2026-07-17 |
| **Master backlog** | [`../GOALS.md`](../GOALS.md) |
| **Launch-critical** | No (harden) |

## Proposed attestation (drafted in witness's voice)

> *"I attest that the system is observed — that degradation, failure, and anomaly surface through telemetry and alerting before customer impact."*

## Why

EOS-5 monitors the data. This monitors the system. You must know prod is breaking without a customer telling you. Argos logs; this attests something watches.

## Done when

An induced degradation raises an alert before any customer-visible failure; Greg witnesses.

## Cross-cycle dependencies

- Distinct from **EOS-5** (per-record data integrity) — EOS-5 monitors DATA correctness; CAND-B monitors SYSTEM health.
- Argos / Mnemosyne / CloudWatch are the existing observability primitives; this candidate attests their alerting completeness.

## Promotion path

When Greg accepts this candidate:
1. Assign next EOS ordinal
2. `git mv` to `00_backlog/brain_1.7.eos-N.md`
3. Update [`../GOALS.md`](../GOALS.md) to mark as Attested with EOS number
4. Follow standard EOS promotion path

Or Greg may reject or defer.
