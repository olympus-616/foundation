# EOS-7 — Least privilege; access granted only via Identity__c

> File: `brain_1.7.eos-7.md` (00_backlog card — Attested but not yet promoted to planning)

| | |
|---|---|
| **Cycle ordinal** | `eos-7` |
| **Phase** | Authority |
| **Status** | `Attested` (Steward 2026-06-10) — card in `00_backlog/`, not yet promoted to `01_planning/` |
| **Witness / Entity** | Greg Cook · CloudPremise LLC |
| **Go-live target** | 2026-07-17 |
| **Master backlog** | [`../GOALS.md`](../GOALS.md) |

## Canonical attestation

> *"I attest the system is designed with the principle of least privilege, and that no Olympus-Grid resources are available unless specifically granted by a super-user admin of Olympus-Grid as defined in the Identity__c table."*

## Done when

No resource is reachable by default; access exists only where a super-user admin has granted it in Identity__c; an ungranted access attempt is denied; Greg witnesses.

## Cross-cycle dependencies

- The `Identity__c` SObject is the authorization root. Per memory `project_api_int_canonical_cluster.md`, the platform identity exists in the alpha-org with `SuperAdmin__c=true` for canonical seeded rows.
- Pairs with **CAND-F** (Identity is verified, not merely authorized) — authn precedes authz; both must hold.
- Pairs with **CAND-E** (tenant isolation) — cross-tenant access denials enforce the PoLP boundary across tenants.

## Promotion path

When promoted to `01_planning/`, the Steward authors §1-§5 per [`../TEMPLATE.md`](../TEMPLATE.md):
- §1.1 forever-intent reflects the canonical attestation above
- §1.2 slice defines the access-matrix audit + denial-test slice
- §2 acceptance criteria operationalize the done_when (every resource access path checks Identity__c grant before allowing)
- §3 NFRs (grant-check latency budget, audit-log completeness)
- §4 feedback inputs (any prior access-control gaps surfaced in production)
- §5 Steward approval gate

Then `git mv` to `01_planning/brain_1.7.eos-7.md`.
