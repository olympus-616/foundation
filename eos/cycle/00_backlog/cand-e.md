# CAND-E — Tenant isolation across nodes and clusters

> File: `cand-e.md` (00_backlog proposed candidate — not yet attested or EOS-numbered)

| | |
|---|---|
| **Candidate id** | `CAND-E` |
| **Phase** | Sovereignty |
| **Status** | `Proposed` — awaiting Greg's accept/reject + EOS-number assignment |
| **Witness / Entity** | Greg Cook · CloudPremise LLC |
| **Go-live target** | 2026-07-17 |
| **Master backlog** | [`../GOALS.md`](../GOALS.md) |
| **Launch-critical** | **YES** — one of the four load-bearing candidates |

## Proposed attestation (drafted in witness's voice)

> *"I attest that no customer can reach another customer's data or compute — tenant isolation holds across nodes and clusters."*

## Why

EOS-7/10/11 govern authority, keys, and steward access. None says customer A cannot touch customer B. For a multi-tenant platform taking money, this is what a security review fails you for if missing.

## Done when

A cross-tenant access attempt is denied at every boundary; Greg witnesses. (Load-bearing for launch.)

## Cross-cycle dependencies

- Builds on **EOS-7** (PoLP via Identity__c) — tenant isolation is PoLP applied at the tenant boundary.
- Pairs with **EOS-11** (steward not data handler) — both define data sovereignty boundaries.
- Tests: cross-Node, cross-Cluster, cross-ApplicationProfile, cross-Identity access attempts, all expected to fail.

## Promotion path

When Greg accepts this candidate:
1. Assign next EOS ordinal (likely first of the launch-critical four)
2. `git mv` to `00_backlog/brain_1.7.eos-N.md`
3. Update [`../GOALS.md`](../GOALS.md) to mark as Attested with EOS number
4. Follow standard EOS promotion path

Or Greg may reject or defer.
