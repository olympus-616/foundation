---
pitch: "Receive Stripe webhooks for BYO-Stripe tenants"
---

# CAND-M — Receive Stripe webhooks for BYO-Stripe tenants

> File: `cand-m.md` (00_backlog proposed candidate — not yet attested or EOS-numbered)

| | |
|---|---|
| **Candidate id** | `CAND-M` |
| **Phase** | Money / Multi-tenant |
| **Status** | `Proposed` — awaiting Greg's accept/reject + EOS-number assignment |
| **Witness / Entity** | Greg Cook · CloudPremise LLC |
| **Go-live target** | 2026-07-17 |
| **Master backlog** | [`../GOALS.md`](../GOALS.md) |
| **Launch-critical** | No (harden — pending collection-mechanism direction) |

## Proposed attestation (drafted in witness's voice)

> *"I attest the platform receives and processes Stripe webhooks for BYO-Stripe tenants without ever observing the raw tenant secret, routing settlement events to the tenant's own attribution subledger and triggering the tithe reversal engine with zero cross-tenant leakage."*

## Why

The §9.M2–M4 scope from the PR #42 delta analysis — BYO-Stripe tenants (an app owner connects their own Stripe account to receive payment on their surface) require inbound webhook reception at plutus so the platform can mint attribution rows + fire the tithe engine against the tenant's own settlements. Today's single-Stripe-account path routes everything through one platform-owned secret; BYO-Stripe routing adds a per-tenant signing-secret dimension that must never leave the SSM / sealed-credential store, must verify webhook signatures per-tenant, and must land in the tenant's own ledger slice (not the platform-aggregate).

Parks as a candidate pending Steward decision on **collection-mechanism direction** — specifically whether BYO-Stripe uses Stripe Connect (platform-mediated), direct charge forwarding, or a pull-based reconciliation model. Each has different webhook / tithe / audit trade-offs.

## Done when

Three BYO-Stripe tenants have connected their Stripe accounts, each sends a representative payment event through their own webhook endpoint, plutus validates the signature against the tenant-specific secret (never-decrypted-in-logs), the attribution subledger stamps the row with the tenant's `AppKey__c` / `TenantId__c` (per `brain_2.7.eos-13` trace widening), the tithe engine fires against the tenant's settlement, and no cross-tenant row appears in SOQL. Greg witnesses.

## Cross-cycle dependencies

- Depends on **`brain_2.7.eos-13`** (MeteringEvent trace widening) — tenant-slice attribution requires `TenantId__c` + `AppKey__c` to be real, not `"default"`.
- Depends on **`brain_2.7.eos-14`** (event vocabulary) — `payment.*` + `settlement.*` + `tithe.*` families must exist as emitted event signatures.
- Depends on **`04_in_development/eos-5b-triage.md` GAP-01** (tenant primitive) — the tenant data-isolation boundary must land first.
- Sharpens **EOS-12** (Money moves only through trusted payment providers) — this candidate extends EOS-12 to the multi-tenant case where the provider is tenant-owned.
- Complements **`brain_1.7.eos-5.3`** (tithe integrity) — the tithe trigger must fire at tenant-settlement, not platform-aggregate settlement.

## Promotion path

When Greg accepts this candidate:
1. Confirm the collection-mechanism direction (Stripe Connect / direct charge / pull-reconciliation).
2. Assign next EOS ordinal.
3. `git mv` to `00_backlog/brain_2.7.eos-N.md` (rename to attested format).
4. Update [`../GOALS.md`](../GOALS.md) to mark as Attested with EOS number.
5. Follow standard EOS promotion path when ready for planning.

Or Greg may reject or defer.
