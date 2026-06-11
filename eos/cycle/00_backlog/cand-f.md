# CAND-F — Identity is verified, not merely authorized

> File: `cand-f.md` (00_backlog proposed candidate — not yet attested or EOS-numbered)

| | |
|---|---|
| **Candidate id** | `CAND-F` |
| **Phase** | Authority |
| **Status** | `Proposed` — awaiting Greg's accept/reject + EOS-number assignment |
| **Witness / Entity** | Greg Cook · CloudPremise LLC |
| **Go-live target** | 2026-07-17 |
| **Master backlog** | [`../GOALS.md`](../GOALS.md) |
| **Launch-critical** | No (harden) |

## Proposed attestation (drafted in witness's voice)

> *"I attest that identity is verified, not merely authorized — sessions and tokens cannot be forged or hijacked, and are validated at the node boundary."*

## Why

EOS-7 is authorization (least privilege via Identity__c). This is authentication: Ares validating JWT at the boundary, Apple Sign In integrity across surfaces. Authz on unverified authn has no foundation.

## Done when

A forged/replayed token is rejected at the node boundary; valid identity passes; Greg witnesses.

## Cross-cycle dependencies

- Pairs with **EOS-7** (PoLP) — authn precedes authz; both must hold.
- Pairs with **EOS-10** (no committed secrets) — JWT signing keys protected per EOS-10.
- Tests: Ares JWT validation (per memory `project_offgrid_cert_injection.md`), Apple Sign In token integrity, replay attack rejection.

## Promotion path

When Greg accepts this candidate:
1. Assign next EOS ordinal
2. `git mv` to `00_backlog/brain_1.7.eos-N.md`
3. Update [`../GOALS.md`](../GOALS.md) to mark as Attested with EOS number
4. Follow standard EOS promotion path

Or Greg may reject or defer.
