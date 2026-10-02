---
pitch: "Ship the missing Plutus event vocabulary"
---

# I attest the Plutus event namespace covers payment, settlement, tithe, cluster, api.audit, credential, envelope, and quota lifecycles so that every §9 assertion in open cycles has a concrete signature to match.

> File: `brain_2.7.eos-14.md`
>
> **Ordinal collision note (2026-10-02):** Originally pitched as `brain_2.7.eos-13`; shifted +1 after `eos-11` was consumed by the env-loader planning stub (PR #85). See `brain_2.7.eos-12.md` + `brain_2.7.eos-13.md` siblings for the hotfix + trace-widening cards.
>
> **Scope origin:** PR #42 (plutus) delta-analysis 2026-10-02. Twin cards `brain_1.7.eos-5.10` + `brain_2.7.eos-1.3` stay narrowly scoped to what PR #42 delivers; this card absorbs the event-vocabulary expansion delta that is NOT covered by those twins. Without this card, several open §9 assertions have no concrete signature to match against.
>
> **Hard dependency:** `brain_2.7.eos-13` (MeteringEvent trace widening) must ship first OR concurrently. Every new event emitted under this cycle MUST carry the full trace fields on day one — no backfill, no exceptions. Scheduling this before `eos-13` closes would ship events with incomplete attribution and bake-in GAP-45-shape debt.

| | |
|---|---|
| **Branch family** | `brain/2.7.x.x` |
| **Cycle ordinal** | `eos-14` (fourteenth primary on 2.7 family) |
| **Status** | `Draft — Pre-§5.` Additive enum + emission wire-up. §1–§5 Steward-authored; §6–§13 agent-authored below. |
| **Opened** | 2026-10-02 |
| **Closed** | — |
| **Prior cycle** | `brain_2.7.eos-13` (MeteringEvent trace widening — hard dependency; events emit the new trace fields on day one) |
| **Theme** | Ship the missing Plutus event families: `payment.*`, `settlement.*`, `tithe.*`, `cluster.*`, `api.audit.*`, `credential.unsealed`, `envelope.decrypt_failed`, `quota.exceeded`. Additive enum work, no breaking changes. |
| **Feedback inputs** | 2026-10-02 PR #42 scope-delta analysis — open §9 assertions on `brain_1.7.eos-5.3` (tithe), `brain_1.7.eos-5.5` + `brain_1.7.eos-5.8` (credential + envelope), `brain_2.7.eos-1` (HUD api.audit + quota), `cand-n.md` (quota.exceeded) all reference signatures that do not exist in `BILLABLE_EVENTS` yet |
| **Estimated effort** | TBD (post-§5 decomposition — plausibly medium: enum extension + 8 family emission sites + §9 verification per family) |
| **Actual effort** | — |

---

# § Steward-authored (top half)

## §1 User story

> *Steward placeholder — edit when §5-ratifying.*
>
> As the **operator attesting an open EOS cycle** I want **every §9 assertion in that cycle to have a concrete Plutus event signature to match against in the live ledger** so that **the attestation close-gate is empirically testable (SOQL/grep returns a row) instead of waiting on a future event-vocabulary expansion**.

## §2 Acceptance criteria

- §2.1 *Steward placeholder — edit when §5-ratifying.*
  **Given** the full post-cycle event families (`payment.*`, `settlement.*`, `tithe.*`, `cluster.*`, `api.audit.*`, `credential.unsealed`, `envelope.decrypt_failed`, `quota.exceeded`) are enumerated in `BILLABLE_EVENTS` and emitted by their respective sites, **when** a corresponding runtime action occurs, **then** a `LedgerEntry__c` row with the appropriate `EventType__c` exists within 24h and carries the full trace (per `brain_2.7.eos-13` closure).

## §3 Non-functional requirements

- **Compatibility:** additive only. Existing `BILLABLE_EVENTS` entries are unchanged; existing emitters continue to emit their existing types.
- **Namespacing discipline:** family prefixes (`payment.`, `settlement.`, `tithe.`, `cluster.`, `api.audit.`, `credential.`, `envelope.`, `quota.`) are the ONLY new top-level prefixes. Specific event types within a family (`payment.authorized`, `payment.captured`, `payment.refunded`, …) are an open decomposition for §6 — but no new top-level prefix sneaks in without a §5-approved amendment.
- **Observability:** every new event emission site also appears in `foundation/eos/cycle/.../event-vocabulary-matrix.md` (new doc, created by this cycle) mapping event-type → emitting-god → §9-assertion-anchors-that-depend-on-it.
- **Trace completeness:** every emitted new event carries the full `eos-13` trace fields (`cycleId`, `jwtSub`, `apiKey`, `requestId`, `appKey`). Hard dependency.

## §4 Feedback inputs

| Source | Signal |
|---|---|
| PR #42 (plutus) 2026-10-02 delta analysis | Open §9 assertions reference event signatures that don't exist |
| `04_in_development/brain_1.7.eos-5.3.md` §9 | Tithe integrity requires `tithe.*` family — not emitted today |
| `04_in_development/brain_1.7.eos-5.5.md` §9 | BYOK sealed-credential closure requires `credential.unsealed` + `envelope.decrypt_failed` — not emitted today |
| `04_in_development/brain_2.7.eos-1.md` §9 (HUD) | L4/L10 require `api.audit.*` + `quota.exceeded` — not emitted today |
| `cand-n.md` (per-app quotas) | Quota enforcement needs `quota.exceeded` emission at ingest-time |
| `04_in_development/eos-5b-triage.md` GAP-90 | `athena.analyze` has no cost/token metering — gpt-4o-vision cost unaccounted; `metering.vision.*` family (or absorbed into `payment.consumption.*`) closes the gap |

## §5 Steward approval gate

- [ ] Story locked
- [ ] Criteria locked
- [ ] NFRs locked
- [ ] Approved to execute — signed: **___** **___**

---

# § Agent-authored (bottom half)

## §6 Layer impact map

| Family | Emitting god(s) | Trigger | §9-assertion anchors |
|---|---|---|---|
| `payment.*` | plutus (Stripe webhook handler, Apple IAP receipt validator) | Payment-provider webhook or receipt verification | `brain_1.7.eos-5.3` §9 tithe trigger; `brain_1.7.eos-5` §9 autonomous-revenue proof |
| `settlement.*` | plutus (settlement engine) | Stripe payout / Apple settlement notification | `brain_1.7.eos-5.3` §9 "fires at settlement not authorization" |
| `tithe.*` | plutus (tithe engine) | Per-settlement tithe row minted (`tithe.minted`), per-cause payout (`tithe.disbursed`), refund reversal (`tithe.reversed`) | `brain_1.7.eos-5.3` §9 all three criteria |
| `cluster.*` | plutus (cluster-lifecycle emitter) + ares (cluster provisioner emitter) | Cluster `.spawned`, `.active`, `.destroyed`, `.suspended` | `brain_1.7.eos-5.3` §9 cluster-cost attribution; `brain_2.7.eos-1` §9 HUD L6 ring-buffer verification |
| `api.audit.*` | ares (admission events) + hermes (routing events) + per-god (optional) | Admit / deny / rate-limit / policy-match | `brain_2.7.eos-1` §9 HUD L4 admission control |
| `credential.unsealed` | plutus (sealed-credential-unseal site) + any god that unseals BYOK | A sealed credential is unwrapped and used | `brain_1.7.eos-5.5` §9 sealed-credential sovereignty |
| `envelope.decrypt_failed` | hermes (fallback-path emitter) + apollo + athena (cosmos-logos handshake failure) | Decryption of a sealed envelope fails | `brain_1.7.eos-5.5` §9 sovereignty-failure visibility; HUD L2 adversary signal |
| `quota.exceeded` | plutus (ingest validator) | Per-app quota ceiling hit during metering | `cand-n.md` quota attestation; `brain_2.7.eos-1` §9 HUD L10 budget cap |

## §7 Schema deltas

- **plutus:** `BILLABLE_EVENTS` enum extension in `api/src/types.ts`. Each new family contributes 2–5 specific event-type strings (final decomposition deferred to §10.1).
- **olympus-grid:** no new column — events are rows in `LedgerEntry__c`. `EventType__c` is already a text field accepting any string.
- **Plugin__mdt:** none.

## §8 Service contracts

Additive — new `EventType__c` values. Existing API consumers that filter on specific event types will NOT see new families unless they opt in. Breakage surface is zero.

```
LedgerEntry__c {
  EventType__c: string  // existing values + new values from this cycle:
                        //   payment.authorized, payment.captured, payment.refunded, payment.failed, …
                        //   settlement.landed, settlement.reversed, …
                        //   tithe.minted, tithe.disbursed, tithe.reversed, …
                        //   cluster.spawned, cluster.active, cluster.destroyed, cluster.suspended, …
                        //   api.audit.admit, api.audit.deny, api.audit.rate_limited, api.audit.policy_matched, …
                        //   credential.unsealed
                        //   envelope.decrypt_failed
                        //   quota.exceeded
}
```

## §9 Telemetry assertions (the close-out gate)

- **§9.a.** For 24h after the full emission sweep lands, at least one `LedgerEntry__c` row per new family exists (one `payment.*`, one `settlement.*`, one `tithe.*`, one `cluster.*`, one `api.audit.*`, one `credential.unsealed`, one `envelope.decrypt_failed`, one `quota.exceeded`). SOQL: `SELECT EventType__c, COUNT(Id) FROM LedgerEntry__c WHERE CreatedDate > :sweep_complete_ts GROUP BY EventType__c` returns rows for each family-prefix.
- **§9.b.** Every new-family row carries the full `eos-13` trace (hard dependency verification): `SELECT COUNT() FROM LedgerEntry__c WHERE CreatedDate > :sweep_complete_ts AND EventType__c LIKE 'payment.%' AND (CycleId__c = null OR IdentitySub__c = null OR ApiKey__c = null OR RequestId__c = null OR AppKey__c = null)` → `0`. Repeat per family.
- **§9.c.** The event-vocabulary matrix doc (new) enumerates every emitter + §9-anchor combination; auditor walks the matrix top-to-bottom and confirms each row has evidence.
- **§9.d.** For every event family, the dependent §9 assertion on the referencing cycle (`eos-5.3`, `eos-5.5`, `eos-2.7.1`, `cand-n`) now resolves to a non-empty row set — the assertion is empirically testable, not pending-vocabulary.

## §10 Execution plan

1. **Enum decomposition.** Author the full `EventType__c` enumeration per family (likely 25–40 specific strings total). Publish to `foundation/eos/cycle/event-vocabulary-matrix.md` (new) for Steward review before any emitter wires up. (Blocks: §5 approval + §10 of `eos-13`.)
2. **plutus `BILLABLE_EVENTS` extension.** Additive-only in `plutus/api/src/types.ts`. (Blocks: §10.1.)
3. **Emitter wire-up per family.** One sub-task per family / per emitting god (listed in §6). Each emission site stamps the full `eos-13` trace. (Blocks: §10.2.)
4. **§9 anchor migration.** For each dependent cycle (`eos-5.3`, `eos-5.5`, `eos-2.7.1`, `cand-n`), re-express the §9 assertion with the now-existing event signature. Does NOT re-open those cycles' §5 — this is agent-side evidence substitution only. (Blocks: §10.3.)
5. **§9 verification.** Run the SOQL + log queries; capture evidence into §13. (Blocks: §10.3.)

## §11 Verification protocol

- **Without iPhone:** SOQL per family + apex anonymous emission probes against `dev_enterprise`.
- **With iPhone (optional):** omens IAP → `payment.captured` → `settlement.landed` → `tithe.minted` chain observable in the ledger within one app-session.

## §12 Rollback plan

- **Enum:** safe to leave. Unused `EventType__c` values are inert — zero `LedgerEntry__c` rows reference them.
- **Emission sites:** per-god, per-family revert. Each family's emission sites land as a separate commit set for isolated rollback.
- **§9 anchor migration (§10.4):** reversible by git-reverting the dependent-cycle §9 edits. The agent-side-only nature of §10.4 means no §5 re-ratification required.

## §13 Closeout

*Filled at close.*

### What shipped
- (TBD)

### What deferred (and why)
- `cand-n.md` (per-app plutus quotas) — enforcement + visualization is a downstream consumer of `quota.exceeded`; ships as its own cycle after this one.
- Chain-backed olympus-coin transition (per `FOLLOW-UPS.md` aeon fanout) — unaffected by this cycle's additive scope; stays in the backlog.
- `metering.vision.*` sub-family (GAP-90) — proposed to absorb into `payment.consumption.*` with `provider=athena` discriminator; final shape locked at §10.1.

### Verification evidence
- (TBD — SOQL per family + the event-vocabulary matrix doc)

### Feedback that emerged from THIS cycle (seed for the next one)
- (TBD)

### Memory updates
- (TBD)

### Cycle close commit
- (TBD)
- Steward sign-off: **___** **___**
