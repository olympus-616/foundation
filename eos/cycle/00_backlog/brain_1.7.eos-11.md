# EOS-11 — Steward is not a data handler without customer-provisioned access

> File: `brain_1.7.eos-11.md` (00_backlog card — Attested but not yet promoted to planning)

| | |
|---|---|
| **Cycle ordinal** | `eos-11` |
| **Phase** | Sovereignty |
| **Status** | `Attested` (Steward 2026-06-10) — card in `00_backlog/`, not yet promoted to `01_planning/` |
| **Witness / Entity** | Greg Cook · CloudPremise LLC |
| **Go-live target** | 2026-07-17 |
| **Master backlog** | [`../GOALS.md`](../GOALS.md) |

## Canonical attestation

> *"I attest that the system steward has no access to customer data within the node or the cluster without customer permission and customers provisioning access to the system steward. This ensures we are not data handlers — unless they choose to use the primary Olympus-Grid alpha node and the instances of clusters managed by CloudPremise LLC."*

## Done when

Steward cannot reach customer data in node or cluster absent an explicit customer-provisioned grant; the data-handler exception (alpha node + CloudPremise-managed clusters) is the only case where handling attaches; Greg witnesses.

## Cross-cycle dependencies

- Pairs with **EOS-7** (PoLP via Identity__c) — steward grant must flow through Identity__c, not implicit through repo or AWS access.
- Pairs with **EOS-10** (no committed secrets) — sovereignty discipline both axes (data + keys).
- Pairs with **CAND-J** (terms/privacy/agreement) — defines the data-handler boundary contractually.

## Promotion path

When promoted to `01_planning/`, the Steward authors §1-§5 per [`../TEMPLATE.md`](../TEMPLATE.md):
- §1.1 forever-intent reflects the canonical attestation above
- §1.2 slice defines the steward-data-access audit (try to access customer data from each privileged path → expect denied; flip on customer-provisioned grant → expect allowed; revoke → expect denied again)
- §2 acceptance criteria operationalize the done_when
- §3 NFRs (grant-check latency, audit completeness)
- §4 feedback inputs
- §5 Steward approval gate

Then `git mv` to `01_planning/brain_1.7.eos-11.md`.
