# EOS-10 — No committed secrets; keys injected at start-up; steward holds no copies

> File: `brain_1.7.eos-10.md` (00_backlog card — Attested but not yet promoted to planning)

| | |
|---|---|
| **Cycle ordinal** | `eos-10` |
| **Phase** | Sovereignty |
| **Status** | `Attested` (Steward 2026-06-10) — card in `00_backlog/`, not yet promoted to `01_planning/` |
| **Witness / Entity** | Greg Cook · CloudPremise LLC |
| **Go-live target** | 2026-07-17 |
| **Master backlog** | [`../GOALS.md`](../GOALS.md) |

## Canonical attestation

> *"I attest that the system does not contain any secrets committed to the repositories; that all production keys are injected into the system at start-up; and that each customer may inject their own provider keys for the related services. All keys for development accounts are adequately injected into the system at start-up, not saved into the code repositories, and there are no copies of keys managed by the system steward, and the system keys can be replaced by someone other than the system steward."*

## Done when

Repositories contain no secrets; production and dev keys inject at start-up; customers inject their own provider keys; steward holds no key copies; keys are rotatable by someone other than the steward; Greg witnesses.

## Cross-cycle dependencies

- Pairs with **EOS-7** (PoLP via Identity__c) — key rotation requires authorized identity, not the steward by default.
- Pairs with **EOS-11** (steward not a data handler) — sovereignty discipline; steward absence applies to keys AND data.
- Production keys currently inject via AWS SSM Parameter Store + Secrets Manager → Pantheon container env vars (per CLAUDE.md `cluster-stack.ts`). Dev keys per `cosmos-logos.json` discipline.

## Promotion path

When promoted to `01_planning/`, the Steward authors §1-§5 per [`../TEMPLATE.md`](../TEMPLATE.md):
- §1.1 forever-intent reflects the canonical attestation above
- §1.2 slice defines the repo-scan + key-injection audit + steward-isolation drill
- §2 acceptance criteria operationalize the done_when (`gitleaks`/`trufflehog` clean across all repos, every key path traces to SSM/Secrets injection, steward has no kept copies)
- §3 NFRs (rotation latency, audit-log completeness)
- §4 feedback inputs
- §5 Steward approval gate

Then `git mv` to `01_planning/brain_1.7.eos-10.md`.
