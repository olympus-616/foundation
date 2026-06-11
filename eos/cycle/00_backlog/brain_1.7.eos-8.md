# EOS-8 — Global accessibility via the alpha node's networks

> File: `brain_1.7.eos-8.md` (00_backlog card — Attested but not yet promoted to planning)

| | |
|---|---|
| **Cycle ordinal** | `eos-8` |
| **Phase** | Reach |
| **Status** | `Attested` (Steward 2026-06-10) — card in `00_backlog/`, not yet promoted to `01_planning/` |
| **Witness / Entity** | Greg Cook · CloudPremise LLC |
| **Go-live target** | 2026-07-17 |
| **Master backlog** | [`../GOALS.md`](../GOALS.md) |

## Canonical attestation

> *"I attest the system is globally accessible by all networks accessible by the Olympus-Grid alpha node, currently hosted on salesforce.com."*

## Done when

The system is reachable across all networks the alpha node can reach; reach is demonstrated from the salesforce.com-hosted alpha node; Greg witnesses.

## Cross-cycle dependencies

- The alpha node is the canonical immutable anchor (`olympus-grid-alpha-1.my.salesforce.com`).
- Pairs with **EOS-9** (Fargate horizontal scale across any AWS region) — the alpha node reaches global; clusters scale to where users are.
- Reach implies CDN / CloudFront / Route53 + AWS-region coverage; depends on cluster CFN stacks shipping clean.

## Promotion path

When promoted to `01_planning/`, the Steward authors §1-§5 per [`../TEMPLATE.md`](../TEMPLATE.md):
- §1.1 forever-intent reflects the canonical attestation above
- §1.2 slice defines the cross-network reach demonstration (probe from N distinct global networks → expect 200)
- §2 acceptance criteria operationalize the done_when (HTTP 200 from probes across continents)
- §3 NFRs (latency budgets per region, availability SLA)
- §4 feedback inputs
- §5 Steward approval gate

Then `git mv` to `01_planning/brain_1.7.eos-8.md`.
