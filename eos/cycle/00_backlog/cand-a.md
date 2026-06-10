# CAND-A — Roll back a faulty production deploy without data loss

> File: `cand-a.md` (00_backlog proposed candidate — not yet attested or EOS-numbered)

| | |
|---|---|
| **Candidate id** | `CAND-A` |
| **Phase** | Resilience |
| **Status** | `Proposed` — awaiting Greg's accept/reject + EOS-number assignment |
| **Witness / Entity** | Greg Cook · CloudPremise LLC |
| **Go-live target** | 2026-07-17 |
| **Master backlog** | [`../GOALS.md`](../GOALS.md) |
| **Launch-critical** | **YES** — one of the four load-bearing candidates |

## Proposed attestation (drafted in witness's voice)

> *"I attest that a faulty deployment to production can be rolled back to the last known-good state without data loss."*

## Why

EOS-4 deploys on merge; EOS-6 survives total destruction. Neither covers the ordinary case — a bad merge reaches prod and must be reversed. CI/CD without rollback is a loaded gun.

## Done when

A deliberately faulty deploy is reverted to last known-good with zero data loss; Greg witnesses.

## Cross-cycle dependencies

- Complements **EOS-4** (deploy on merge) — rollback is the inverse, equally important.
- Distinct from **EOS-6** (survive total destruction) — rollback is the ordinary path; EOS-6 is the catastrophic path.
- EOS-4 §2.12 mentions "Rollback by `git revert`" as the closure path — this candidate formalizes that as an attested standalone.

## Promotion path

When Greg accepts this candidate:
1. Assign next EOS ordinal (e.g., EOS-13)
2. `git mv` to `00_backlog/brain_1.7.eos-N.md` (rename to attested format)
3. Update [`../GOALS.md`](../GOALS.md) to mark as Attested with EOS number
4. Follow standard EOS promotion path when ready for planning

Or Greg may reject or defer.
