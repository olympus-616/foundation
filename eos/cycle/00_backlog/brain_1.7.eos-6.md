# EOS-6 — Survive total destruction except the alpha node

> File: `brain_1.7.eos-6.md` (00_backlog card — Attested but not yet promoted to planning)

| | |
|---|---|
| **Cycle ordinal** | `eos-6` |
| **Phase** | Resilience |
| **Status** | `Attested` (Steward 2026-06-10) — card in `00_backlog/`, not yet promoted to `01_planning/` |
| **Witness / Entity** | Greg Cook · CloudPremise LLC |
| **Go-live target** | 2026-07-17 |
| **Master backlog** | [`../GOALS.md`](../GOALS.md) |

## Canonical attestation

> *"I attest the system can withstand full destruction of all resources except for the Olympus-Grid alpha node, and maintain data integrity across future deployments based upon the immutability of the Olympus-Grid alpha node."*

## Done when

All resources except the alpha node are destroyed; the system reconstitutes future deployments from the alpha node with integrity intact; Greg witnesses.

## Cross-cycle dependencies

- Builds on **EOS-2** (destroy compute without integrity loss) — generalizes from single-cluster destruction to full-system destruction-except-alpha-node.
- Builds on **EOS-3** (construct entire app from public source) — the reconstitution path is the EOS-3 path.
- The alpha node is the canonical immutable anchor — the `olympus-grid-alpha-1.my.salesforce.com` instance.

## Promotion path

When promoted to `01_planning/`, the Steward authors §1-§5 per [`../TEMPLATE.md`](../TEMPLATE.md):
- §1.1 forever-intent reflects the canonical attestation above
- §1.2 slice defines the specific destroy-and-reconstitute drill (test cluster + test node, then reconstitute from alpha-node-source)
- §2 acceptance criteria operationalize the done_when (data integrity preserved across reconstitution)
- §3 NFRs (reconstitution wall-clock budget, alpha-node availability)
- §4 feedback inputs (EOS-2 D19 destroy-with-integrity validation procedure is the seed)
- §5 Steward approval gate

Then `git mv` to `01_planning/brain_1.7.eos-6.md`.
