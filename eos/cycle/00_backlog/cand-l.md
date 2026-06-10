# CAND-L — Production state is reproducible and version-provenanced

> File: `cand-l.md` (00_backlog proposed candidate — Business/Legal Class — not yet attested)

| | |
|---|---|
| **Candidate id** | `CAND-L` |
| **Phase** | Foundation / Compliance |
| **Status** | `Proposed` — awaiting Greg's accept/reject + EOS-number assignment |
| **Witness / Entity** | Greg Cook · CloudPremise LLC |
| **Go-live target** | 2026-07-17 |
| **Master backlog** | [`../GOALS.md`](../GOALS.md) |
| **Launch-critical** | No (harden) |

## Proposed attestation (drafted in witness's voice)

> *"I attest that production state is reproducible and version-provenanced — the exact running version (e.g. brain/1.7.x.x) can be named and rebuilt."*

## Why

Extends EOS-3/4 — you can say precisely what is running and reconstruct it.

## Done when

The currently-running production state has a precise named version pointer (brain SHA + managed-package version + cluster image SHA); the version can be rebuilt deterministically from source; Greg witnesses.

## Cross-cycle dependencies

- Sharpens **EOS-3** (reproducible from source) and **EOS-4** (deploy by merge) — CAND-L attests that the inverse mapping (production → exact source SHA) is also true.
- The `prod.brain_equals_production` assertion shape from EOS-4 §2.8 is the closure signal.

## Promotion path

When Greg accepts this candidate:
1. Assign next EOS ordinal
2. `git mv` to `00_backlog/brain_1.7.eos-N.md`
3. Update [`../GOALS.md`](../GOALS.md) to mark as Attested with EOS number
4. Follow standard EOS promotion path

Or Greg may reject or defer.
