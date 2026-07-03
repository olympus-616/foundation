# Tithe integrity + first-dollar-through — every dollar of net settlement writes an idempotent, reconciled, reversible 7% tithe row against the payer's chosen Cause

> File name: `brain_1.7.eos-5.3.md` — third sub-ordinal off `brain_1.7.eos-5` covering the operational preconditions between READINESS and first-dollar-through-with-integrity.

| | |
|---|---|
| **Branch family** | `brain/1.7.x.x` |
| **Cycle ordinal** | `eos-5.3` (sibling to `eos-5`, opened 2026-07-03 at Steward direction) |
| **Status** | `Draft` — awaiting Steward §1-§5 authoring |
| **Opened** | 2026-07-03 |
| **Closed** | — |
| **Prior cycle** | `brain_1.7.eos-5` (READINESS attested; 5.3 is the "before we accept money" operational gate that turns READINESS into first-dollar-integrity) |
| **Theme** | Between READINESS and first-dollar-through — the tithe trigger, cause resolution, reconciliation, refund handling, and payout architecture that must be operational BEFORE the first paying customer's dollar so that the platform's core covenant (7% net-settlement → cause) is empirically true from the first cent. Steward verbatim 2026-07-03: *"when we do this right we are not just selling a good software platform we are selling impact generators."* |
| **Feedback inputs** | Steward direction 2026-07-03: *"open 5.3 cycle to cover this and any other recommended triage that we are closing by closing the eos-5 primary document. Basically anything you want before i accept money needs to be listed in 5.1, 5.2, or 5.3. you have seen how the system works very closely and i want senior platform engineering support on what remains."* + EOS-5 §13.0 close criterion (READINESS ≠ integrity — 5.3 closes the gap) + GAP-28 (`Identity.PrimaryCause__c` missing) + memory `project_tithe_fires_at_settlement_not_payment.md` (canonical event trigger = settlement, not consumption) |
| **Estimated effort** | TBD by Steward at §5 approval — plausibly 60-100h agent + 15-25h Steward + legal counsel time (Donor-Advised Fund architecture decision) |
| **Actual effort** | — |

---

## Why this cycle exists — the honest tension

EOS-5 attests **READINESS to accept money** — every surface is wired signup → dedup → AP Active → cause chosen. That's a real threshold. But READINESS is not integrity. Between "customer's card charges $10" and "$0.70 lands in a real cause's bank account" sit a dozen operational concerns that don't fail READINESS but DO fail the platform's covenant if not landed:

- **Cause resolution** — GAP-28 leaves `Identity.PrimaryCause__c` non-existent. The tithe canon reads from Identity, not AP. Without resolution the first tithe row null-attributes.
- **Trigger existence** — Per memory 2026-06-29, the tithe trigger doesn't exist yet ("Don't build the trigger until real settlement payloads are in hand"). Now they're in hand (or will be within days).
- **Idempotency** — Stripe / Apple retry webhooks. A duplicate tithe row breaks reconciliation forever.
- **Reversibility** — Refunds and chargebacks reverse the settlement; the tithe row must reverse in lockstep or the sum-of-tithes stops equaling 7%-of-net.
- **Reconciliation** — SOC-2 CC5.2 requires provable completeness/accuracy — someone (or something) has to attest monthly that sum(tithe) = 7% × sum(net_settlement).
- **Payout to Cause** — This is the load-bearing legal architecture. If CloudPremise LLC receives $10 and sends $0.70 to a 501(c)(3), that is potentially money transmission unless structured as a Donor-Advised Fund (DAF) donation. Regulatory decision must precede operational implementation.
- **Public transparency** — Per `foundation/GUARDIANS-LAUNCH-COMPLIANCE.md` §9, a `/tithe` URL exposes monthly rollup. That URL needs a real source-of-truth.

**Setting these aside is not "post-close operational" — it's "post-first-settlement failure."** Because settlement events fire 2-7 days after charge (Stripe payout batching) / monthly (Apple proceeds), there's a natural window but not an indefinite one. This cycle closes that gap.

The Steward-locked framing 2026-07-03: *"we are not just selling a good software platform we are selling impact generators."* If the 7% doesn't reach real causes with a clean audit trail, we're selling the software but not the impact — and the differentiation collapses.

## Scope split — what lives HERE vs. what lives in EOS-5.1 (compliance) vs. EOS-5.2 (perimeter)

| Concern | Owner | Note |
|---|---|---|
| Terms of Service disclosure of 7% tithe | **5.1** | Legal disclosure in ToS + Privacy Policy |
| Money transmitter licensing analysis | **5.1** | Regulatory / legal opinion — DAF vs. MTL vs. donation model |
| Cause organization vetting (501(c)(3) validation, sanctions screening) | **5.1** | Compliance / KYC on causes |
| Guest-access lockdown on revenue endpoints | **5.2** | Prevents unattributed billing (anonymous chat → default cause) |
| API-key registry + per-key rate limiting | **5.2** | GAP-A through GAP-E |
| `Identity.PrimaryCause__c` schema + resolution rule | **5.3** | GAP-28 close |
| Tithe trigger implementation | **5.3** | Settlement-event Apex |
| Stripe webhook handler (payout + refund) | **5.3** | Signature verification + idempotency |
| Apple monthly proceeds ingest | **5.3** | File processor + reconciliation |
| Reconciliation / backfill mechanism | **5.3** | Prove sum(tithe) = 7% × sum(net_settlement) |
| Refund + chargeback reversal | **5.3** | Compensating LedgerEntry rows |
| Currency normalization + snapshot policy | **5.3** | Cause-at-charge-time vs. amount-at-settlement-time |
| DAF operational integration (which DAF, what API) | **5.3** | Depends on 5.1 legal architecture decision |
| `/tithe` public ledger UI | **5.3** | Referenced by 5.1 as a compliance surface |
| GAP-16 field-hoist (payload.shell_id → Sub__c) | **5.3** | Needed so SOQL reporting on tithe attribution works |
| GAP-01 tenant primitive full propagation | **5.3** | Multi-tenant tithe attribution requires clean tenant stamping |
| GAP-02 LedgerEntry.Application__c FK | **5.3** | Per-app tithe reporting requires FK not string |

---

# § Steward-authored (top half)

## §1 User story

*Steward to author. Suggested framing:*

> As **CloudPremise LLC / the Steward** I want **every dollar of net settlement (from Stripe or Apple) to automatically write an idempotent, reversible, reconciled, publicly-auditable 7% tithe row against the payer's chosen Cause** so that **the first paying customer's dollar generates real impact via the Cosmic-7 mechanism — and every subsequent dollar keeps generating it — with the audit trail that lets a regulator, an auditor, or a curious dust dancer verify sum(tithe) = 7% × sum(net_settlement) at any point.**
>
> *"we are not just selling a good software platform we are selling impact generators" — Steward 2026-07-03.*

## §2 Acceptance criteria

*Steward to author. Suggested Gherkin seeds:*

### §2.1 group — Cause resolution + trigger

- **§2.1.1** — Given `Identity__c.PrimaryCause__c` field is deployed with picklist matching the AP.Cause__c picklist AND the cause-copy rule fires when an AP's `Cause__c` is first set (populates Identity.PrimaryCause__c if null; leaves alone if already set — no clobber) **then** every Identity with at least one active AP has a resolvable cause snapshot.
- **§2.1.2** — Given a paying customer with `Identity.PrimaryCause__c = "Food & Nutrition"` **when** Stripe fires `payout.paid` webhook for a $10 charge **then** within 60s a `settlement.stripe.payout` LedgerEntry lands with `Sub__c = payer.sub`, `Application__c = payer's AP.Application`, `Amount = $10 net`, `PaymentProvider__c = 'stripe'` **AND** immediately a `tithe.disbursement` LedgerEntry follows with `Cause__c = "Food & Nutrition"`, `CausePercent__c = 7`, `TitheAmount__c = $0.70`, `PaymentProvider__c = 'stripe'`, `RelatedSettlementId__c = <settlement event_id>`.
- **§2.1.3** — Given the payer's `Identity.PrimaryCause__c` was `"Food & Nutrition"` at charge-time (2026-07-04) **when** they change it to `"Clean Water for All"` at 2026-07-06 AND a settlement fires 2026-07-08 for the original charge **then** the tithe row uses the CHARGE-TIME snapshot ("Food & Nutrition") — not the settlement-time value ("Clean Water"). Snapshot is enforced via IdentityToken__c or a snapshot column on the settlement row.
- **§2.1.4** — Given `Identity.PrimaryCause__c` is null at charge-time (edge case — user pays before selecting cause) **when** settlement fires **then** the tithe row writes with `Cause__c = <platform default> ` (Steward to choose default) AND a `tithe.attribution.default` warning event fires for operator visibility.

### §2.2 group — Idempotency

- **§2.2.1** — Given a Stripe webhook is replayed with the same `event_id` **when** the second delivery hits `/v1/webhooks/stripe` **then** no duplicate `settlement.stripe.payout` OR `tithe.disbursement` LedgerEntry writes; response is HTTP 200 idempotent-replay.
- **§2.2.2** — Given the Apple monthly proceeds file is re-processed **when** the same `transaction_id`s are seen **then** no duplicate rows; response is a reconciliation report showing zero-delta.
- **§2.2.3** — Idempotency implemented via `LedgerEntry__c.ReferenceId__c` unique-constraint on `<provider>_<event_id>` composite.

### §2.3 group — Reversibility

- **§2.3.1** — Given a customer refund at $10 (full refund) **when** Stripe fires `charge.refunded` **then** a `settlement.stripe.refund` LedgerEntry writes AND a `tithe.reversal` LedgerEntry with `TitheAmount__c = -$0.70` matched to the original tithe row via `RelatedSettlementId__c`.
- **§2.3.2** — Given a chargeback **when** Stripe fires `charge.dispute.funds_withdrawn` **then** same compensating chain.
- **§2.3.3** — Given a partial refund ($3 of $10) **when** the refund event lands **then** the tithe reversal is prorated ($0.21).

### §2.4 group — Reconciliation

- **§2.4.1** — Given the monthly close job runs on the 1st of each month at 00:00 UTC **when** it executes **then** it produces a `ReconciliationReport__c` (or output file) showing: sum(gross_settlement), sum(net_settlement), sum(tithe.disbursement), sum(tithe.reversal), computed 7%×net vs. actual tithe, and delta. Delta must be $0.00 (within rounding tolerance).
- **§2.4.2** — Given the reconciliation delta is non-zero **when** the job runs **then** ops-alert fires + tithe row backfill runbook triggers automatically.
- **§2.4.3** — Reconciliation report is exportable to CSV and stored durably (S3 with retention).

### §2.5 group — Payout to Cause (depends on 5.1 legal architecture)

- **§2.5.1** — Given the DAF partner (5.1 decision) is `<TBD DAF>` **when** the monthly tithe rollup completes **then** an ACH / API disbursement executes to the DAF partner with per-Cause allocation matching `sum(tithe.disbursement) - sum(tithe.reversal)` grouped by Cause__c.
- **§2.5.2** — Given the DAF disbursement completes **when** the confirmation lands **then** a `tithe.disbursement.confirmed` LedgerEntry writes with DAF transaction ID.
- **§2.5.3** — Given the disbursement fails **when** the DAF API returns error **then** a `tithe.disbursement.failed` LedgerEntry writes + ops alert + retry policy.

### §2.6 group — Public transparency

- **§2.6.1** — Given the `/tithe` marketing-site URL exists (per GUARDIANS-LAUNCH-COMPLIANCE §9) **when** a visitor loads it **then** it renders the current month's cause-level rollup (sum by Cause__c) + a downloadable historical CSV of all confirmed disbursements.
- **§2.6.2** — Given a curious auditor **when** they hit an authenticated endpoint (Steward or vetted-role only) **then** they can drill from Cause-rollup → month → transaction-level with all supporting LedgerEntry references.

### §2.7 group — Attribution completeness (depends on GAP-16, GAP-01, GAP-02 close)

- **§2.7.1** — Given `LedgerEntry__c.Sub__c` first-class column is populated on every `settlement.*` and `tithe.*` row (hoisted from `payload.shell_id`) **when** SOQL queries run for "all tithes for user X" **then** they return correct results without needing to grep Payload__c JSON.
- **§2.7.2** — Given `LedgerEntry__c.TenantId__c` is populated on every settlement + tithe row **when** SOQL runs "all tithes for tenant Y" **then** returns tenant-scoped results.
- **§2.7.3** — Given `LedgerEntry__c.Application__c` reference (not just string) exists on every settlement + tithe row **when** SOQL runs "all tithes for Application Z" **then** returns via FK join.

### §2.8 group — Failure modes

- **§2.8.1** — Given the tithe trigger throws (Apex governor limit, callout timeout, etc.) **when** it fires **then** the settlement LedgerEntry STILL lands (never lose the settlement) + `tithe.trigger.failed` event writes + ops-alert fires + manual backfill runbook is documented.
- **§2.8.2** — Given webhook signature verification fails **when** an inbound arrives **then** HTTP 401 + `webhook.signature.invalid` event + no state mutation.
- **§2.8.3** — Given webhook arrives before the payer's Identity is resolvable (race condition) **when** the trigger runs **then** it queues for retry with exponential backoff; after 24h without resolution, fires `tithe.orphan.settlement` event + ops-alert.

## §3 Non-functional requirements

*Steward to author. Suggested spine:*

- **Attribution correctness**: 100% of net settlements must produce a matching tithe row within SLO. Zero settlements-without-tithe on the monthly reconciliation report.
- **Idempotency**: Webhook replay must be safe; unique-constraint on provider event ID.
- **Reconciliation SLO**: Monthly close job produces zero-delta reconciliation report by end of Day 1 of the following month.
- **Observability**: Every tithe row carries full attribution (Sub, App, Tenant, Cause, RelatedSettlementId). Every failure has a named LedgerEntry event.
- **Public transparency**: `/tithe` URL updates monthly (or realtime — Steward choice) with cause-level rollup.
- **Auditability**: SOC-2 CC5.2 (completeness + accuracy of processing) evidence trail. External auditor can reconstruct any monthly tithe distribution from LedgerEntry alone.
- **Legal compliance**: Payout architecture matches 5.1 legal decision (DAF vs. direct grant vs. MTL). No un-licensed money transmission.
- **Currency handling**: All amounts stored in a single canonical currency (USD?) with snapshot rate at charge-time for multi-currency support (future).
- **Latency**: Settlement → tithe write within 60s (P95).
- **Disbursement cadence**: Monthly or per-Cause-threshold (Steward choice). No perpetual accumulation without payout.

## §4 Feedback inputs

| FB# | Title | Body excerpt |
|-----|-------|--------------|
| — | Steward 2026-07-03 (open 5.3) | *"open 5.3 cycle to cover this and any other recommended triage that we are closing by closing the eos-5 primary document. Basically anything you want before i accept money needs to be listed in 5.1, 5.2, or 5.3."* |
| — | Steward 2026-07-03 (impact framing) | *"when we do this right we are not just selling a good software platform we are selling impact generators"* |
| — | Memory 2026-06-29 (settlement not payment) | *"Tithe fires at SETTLEMENT, not payment authorization. Tithe = 7% of NET settlement money in bank (Stripe payout.paid, Apple monthly proceeds)."* |
| — | EOS-5 GAP-28 | `Identity.PrimaryCause__c` missing; tithe canon reads from Identity; fails-closed on null. |
| — | EOS agent senior-engineering recommendation 2026-07-03 | Tithe trigger + Identity.PrimaryCause__c + reconciliation + refund reversal + DAF payout architecture ALL must land before first real settlement fires or the platform's core covenant breaks silently. |

## §5 Steward approval gate

- [ ] Story locked
- [ ] Criteria locked
- [ ] NFRs locked
- [ ] Approved to execute — signed: **{Steward initials}** **{date}**

---

# § Agent-authored (bottom half — DO NOT populate until §5 is signed)

Sections §6-§13 are held blank per EOS discipline: no decomposition, execution plan, telemetry assertions, or rollback until the Steward has locked §1-§5. When §5 signs, the agent-half will be authored against the acceptance-criterion groups above, with cross-references to memory `project_tithe_fires_at_settlement_not_payment.md`, `project_no_data_without_purpose_axiom.md`, and the resolved 5.1 legal architecture decision.

## §13 close-criterion preview (for §5 approval context)

The cycle closes GREEN when the **first real Stripe `payout.paid` webhook** (or Apple monthly proceeds file) lands in production AND all of the following empirically hold within the next hour:
1. A `settlement.stripe.payout` (or `.apple.proceeds`) LedgerEntry writes with full attribution.
2. A `tithe.disbursement` LedgerEntry writes immediately after with correct Cause snapshot + 7% amount.
3. The reconciliation report for the current period shows zero-delta.
4. The `/tithe` public URL reflects the new tithe row in its next update.
5. A monthly close job successfully executes a DAF disbursement matching the sum of confirmed-and-net-of-reversals tithes for the month.

`06_shipped/brain_1.7.eos-5.3.md` becomes canon for **"the platform accepts money and correctly generates real impact via the Cosmic-7 mechanism, from the first dollar."**

## Post-close forward pointer

When 5.3 closes, remaining Cosmic-7 evolution moves into standing cycles:
- Per-cause donation history at user profile level (dashboard feature)
- Cause-registry admin UI (adjacent to GAP-50 Application creation UI)
- International payout support (DAF partners outside US)
- Non-Salesforce tenants (Proteus objects for tenant primitive) — noted in EOS-5 GAP-01

## Senior-engineering caveat

The Steward-directed framing of this cycle (*"anything you want before i accept money"*) puts the EOS agent in a proposing seat, not a decreeing seat. The scope above is the agent's honest read after extensive receiver-mode attestation, including the 6-surface READINESS run 2026-07-02/03 and the auth-matrix test 2026-07-03. **Every §2 criterion is negotiable at §5 approval.** The load-bearing ones — cause resolution, trigger existence, reconciliation, DAF architecture — are the ones the agent most strongly recommends locking. The rest can slip to a follow-on cycle if Steward tolerance for first-dollar-integrity risk allows.
