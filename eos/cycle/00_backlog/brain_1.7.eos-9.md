# EOS-9 — Global horizontal scale via Fargate, governed by provisioning authority

> File: `brain_1.7.eos-9.md` (00_backlog card — Attested but not yet promoted to planning)

| | |
|---|---|
| **Cycle ordinal** | `eos-9` |
| **Phase** | Reach |
| **Status** | `Attested` (Steward 2026-06-10) — card in `00_backlog/`, not yet promoted to `01_planning/` |
| **Witness / Entity** | Greg Cook · CloudPremise LLC |
| **Go-live target** | 2026-07-17 |
| **Master backlog** | [`../GOALS.md`](../GOALS.md) |

## Canonical attestation

> *"I attest the system can scale workloads globally using horizontally scaled microservice clusters that can be deployed via Fargate across any AWS region, based upon the context, privileges, and authority of the provisioning user."*

## Done when

Horizontal microservice clusters deploy via Fargate to any AWS region, scoped to the provisioning user's context, privileges, and authority per Identity__c; Greg witnesses.

## Cross-cycle dependencies

- Generalizes **EOS-2** (cluster spawn) to multi-region Fargate, scoped by user authority (depends on **EOS-7** PoLP via Identity__c).
- Pairs with **EOS-8** (global accessibility) — reach + scale together.
- The `zeus/scripts/cluster.sh provision` mechanism is the canonical spawn path; multi-region requires region-parameterization.

## Promotion path

When promoted to `01_planning/`, the Steward authors §1-§5 per [`../TEMPLATE.md`](../TEMPLATE.md):
- §1.1 forever-intent reflects the canonical attestation above
- §1.2 slice defines the multi-region spawn drill (spawn cluster in N AWS regions for N different users with N different authority contexts)
- §2 acceptance criteria operationalize the done_when (each user's spawn lands in correct region with correct privileges enforced)
- §3 NFRs (per-region spawn latency budget, cost-per-region)
- §4 feedback inputs (region-distribution observations from production cluster history)
- §5 Steward approval gate

Then `git mv` to `01_planning/brain_1.7.eos-9.md`.
