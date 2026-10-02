---
pitch: "Expand MeteringEvent to carry the full trace"
---

# I attest every MeteringEvent carries cycleId, jwtSub, apiKey, requestId, and the canonical AppKey of the emitting surface.

> File: `brain_2.7.eos-13.md`
>
> **Ordinal collision note (2026-10-02):** Originally pitched as `brain_2.7.eos-12`; shifted +1 after `eos-11` was consumed by the env-loader planning stub (PR #85). See `brain_2.7.eos-12.md` sibling for the hotfix card.
>
> **Scope origin:** PR #42 (plutus) delta-analysis 2026-10-02. Twin cards `brain_1.7.eos-5.10` + `brain_2.7.eos-1.3` stay narrowly scoped to what PR #42 delivers; this card absorbs the cross-cutting MeteringEvent schema-widening delta that is NOT covered by those twins and is a precondition for §9.A + §9.Q telemetry on tithe + per-app accounting.
>
> **Dependents.** This card unblocks:
> - `brain_2.7.eos-14.md` (Plutus event vocabulary) — new events emit the new trace fields on day one, so the schema widening must land first.
> - The §9 chains on `brain_1.7.eos-5.3` (tithe integrity) and `brain_1.7.eos-5.6` (durable shell balance) — both assume full-trace attribution per MeteringEvent for reconciliation and divergence rollup.
> - `cand-n.md` (per-app plutus quotas) — quota enforcement depends on `apiKey` + canonical `AppKey` on every event.

| | |
|---|---|
| **Branch family** | `brain/2.7.x.x` |
| **Cycle ordinal** | `eos-13` (thirteenth primary on 2.7 family) |
| **Status** | `Draft — Pre-§5.` Schema-widening prerequisite surfaced by PR #42 delta analysis 2026-10-02. §1–§5 Steward-authored; §6–§13 agent-authored below. |
| **Opened** | 2026-10-02 |
| **Closed** | — |
| **Prior cycle** | `brain_2.7.eos-12` (anon-Stripe-leak hotfix — unrelated theme; sibling in the PR #42 delta cluster) |
| **Theme** | MeteringEvent schema widening — every event carries `cycleId`, `jwtSub`, `apiKey`, `requestId`, canonical `appKey`. Not a bug; a cross-cutting prerequisite for tithe + per-app accounting telemetry. |
| **Feedback inputs** | 2026-10-02 PR #42 scope-delta analysis + `04_in_development/eos-5b-triage.md` GAP-01 / GAP-45 / GAP-46 / GAP-77 / GAP-83 (all 5-tuple-attribution shaped) |
| **Estimated effort** | TBD (post-§5 decomposition — plausibly medium: TypeScript type widening + ingest validator + fleet-wide emitter sweep + olympus-grid column adds + FLS) |
| **Actual effort** | — |

---

# § Steward-authored (top half)

## §1 User story

> *Steward placeholder — edit when §5-ratifying.*
>
> As the **plutus operator** I want **every MeteringEvent landing in the ledger to carry the full attribution trace (`cycleId`, `jwtSub`, `apiKey`, `requestId`, canonical `appKey`)** so that **per-cycle, per-identity, per-app, per-request, per-surface rollups are empirically computable via SOQL / SQL at any point in time**.

## §2 Acceptance criteria

- §2.1 *Steward placeholder — edit when §5-ratifying.*
  **Given** any Pantheon service emits a MeteringEvent, **when** that event lands in `LedgerEntry__c`, **then** `CycleId__c`, `IdentitySub__c`, `ApiKey__c`, `RequestId__c`, and `AppKey__c` are ALL non-null **and** `AppKey__c` matches one of the canonical AppKey values enumerated in `ApplicationProfile__c.AppKey__c`.

## §3 Non-functional requirements

- **Compatibility:** backwards-compatible ingest during the fleet sweep — the ingest route accepts events missing the new fields for the duration of the migration window and emits a `metering.trace_incomplete` warning per such event. Hard-reject (400) switches on after the sweep completes.
- **Observability:** every MeteringEvent emission site is enumerable from a single grep across the fleet (`BILLABLE_EVENTS` / `MeteringEvent` constructors). Migration dashboard reports per-god coverage percent against the enumeration.
- **Privacy:** `jwtSub` is the subject claim (opaque identifier), NOT the user's email or name. `apiKey` is the key id (`ak_...`), NOT the raw secret.
- **Performance:** the five new columns on `LedgerEntry__c` are indexed where needed for the §9 queries (`CycleId__c`, `IdentitySub__c`, `AppKey__c` likely indexed; `RequestId__c` + `ApiKey__c` indexed only if query shape demands it).
- **Reversibility:** per-god, per-event emission can revert to the pre-widening shape via one commit. The schema columns are additive; dropping them is a separate destructive-deploy cycle.

## §4 Feedback inputs

| Source | Signal |
|---|---|
| PR #42 (plutus) 2026-10-02 delta analysis | MeteringEvent shape is too narrow for tithe + per-app accounting §9 assertions |
| `04_in_development/eos-5b-triage.md` GAP-01 | `LedgerEntry.TenantId="default"` hardcoded; tenant primitive missing |
| `04_in_development/eos-5b-triage.md` GAP-45 | Pattern 1 emitter does not stamp 5-tuple attribution columns |
| `04_in_development/eos-5b-triage.md` GAP-46 | `LedgerEntry.AccountId__c` inconsistent across emitters |
| `04_in_development/eos-5b-triage.md` GAP-77 | `cluster.*` events need per-event 5-tuple |
| `04_in_development/eos-5b-triage.md` GAP-83 | `feedback.submitted` doesn't stamp 5-tuple |

## §5 Steward approval gate

- [ ] Story locked
- [ ] Criteria locked
- [ ] NFRs locked
- [ ] Approved to execute — signed: **___** **___**

---

# § Agent-authored (bottom half)

## §6 Layer impact map

| Criterion | Salesforce (olympus-grid) | Pantheon services | omens / turtleshell / iris | SDK / protocol |
|---|---|---|---|---|
| §2.1 full-trace columns | `LedgerEntry__c` adds `CycleId__c`, `IdentitySub__c`, `ApiKey__c`, `RequestId__c`, `AppKey__c` (if not already present) + FLS on `Olympus_Grid_Admin` + `TRG_HND_LedgerEntryEmitter` + `LedgerWriterPeHandler` + `LedgerEntryEmitter` persist the fields | plutus `api/src/types.ts` MeteringEvent type widening; plutus `api/src/routes/ingest.ts` validator accepts new fields (soft-warn during migration, hard-reject after sweep); every Pantheon emitter (athena, apollo, hermes, poseidon, ares, chronos, hephaestus, mnemosyne, prometheus, …) populates the new fields | event-emitting client surfaces must pass `apiKey` + canonical `appKey` headers / body fields on every metered action | HTTP envelope convention adds `X-Api-Key` + `X-App-Key` headers alongside existing `X-Cycle-ID` + `X-Request-ID` + `x-user-identity` |

## §7 Schema deltas

- **SObjects:** `LedgerEntry__c` adds the five fields (where not already present): `CycleId__c` (text 36), `IdentitySub__c` (text 128, indexed), `ApiKey__c` (text 64), `RequestId__c` (text 36), `AppKey__c` (text 32, indexed, picklist pattern-matching canonical `ApplicationProfile__c.AppKey__c`).
- **Permset:** `Olympus_Grid_Admin` + `Olympus_Grid_Platform` get FLS on all five.
- **Plugin__mdt:** none.

## §8 Service contracts

### MeteringEvent — current (narrow) shape

```typescript
interface MeteringEvent {
  shellId: string;
  eventType: string;        // one of BILLABLE_EVENTS
  amount: number;           // debit in shells
  tenantId?: string;        // defaults to "default" per GAP-01
  // ... other narrow fields
}
```

### MeteringEvent — post-widening shape

```typescript
interface MeteringEvent {
  shellId: string;
  eventType: string;        // one of BILLABLE_EVENTS
  amount: number;

  // Full attribution trace — NON-OPTIONAL post-migration:
  cycleId: string;          // ties event to the EOS cycle that minted the capability
  jwtSub: string;           // JWT 'sub' claim — opaque identity id
  apiKey: string;           // 'ak_...' id — NEVER the raw secret
  requestId: string;        // correlates to HTTP envelope
  appKey: AppKey;           // canonical: 'turtleshell' | 'guardians' | 'portal' | 'servicedesk' | 'eos' | …

  // Tenant primitive — supersedes GAP-01 hardcode:
  tenantId: string;         // non-'default' once GAP-01 absorbed; fallback allowed during migration window only
}
```

### Ingest route behavior

```
POST /v1/plutus/api/ingest
  Headers: X-Api-Key, X-App-Key, X-Cycle-ID, X-Request-ID, x-user-identity
  Body: MeteringEvent

  During migration window (soft-warn):
    202 Accepted — with warn log `metering.trace_incomplete fields=<missing-list>` if any widening field is null
  Post-migration (hard-reject):
    202 Accepted when all widening fields present
    400 Bad Request + `metering.trace_rejected fields=<missing-list>` otherwise
```

## §9 Telemetry assertions (the close-out gate)

- **§9.a.** For 24h after fleet sweep completes, 100% of new `LedgerEntry__c` rows have `CycleId__c IS NOT NULL AND IdentitySub__c IS NOT NULL AND ApiKey__c IS NOT NULL AND RequestId__c IS NOT NULL AND AppKey__c IS NOT NULL`. SOQL: `SELECT COUNT() FROM LedgerEntry__c WHERE CreatedDate > :sweep_complete_ts AND (CycleId__c = null OR IdentitySub__c = null OR ApiKey__c = null OR RequestId__c = null OR AppKey__c = null)` → `0`.
- **§9.b.** `metering.trace_incomplete` emission count drops to zero within the 24h window across every Pantheon service's access log.
- **§9.c.** Per-Pantheon-god coverage dashboard reports 100% emission-site compliance (every emitter populates all five fields).
- **§9.d.** `AppKey__c` value distribution across the 24h window maps 1:1 to the canonical `ApplicationProfile__c.AppKey__c` picklist — no unknown values, no null-equivalents.

## §10 Execution plan

1. **Schema deploy to `dev_enterprise` scratch.** `LedgerEntry__c` field adds + FLS + permset. (Blocks: §5 approval.)
2. **plutus ingest validator widen.** Accept new fields; emit `metering.trace_incomplete` soft-warn on missing. (Blocks: §10.1.)
3. **plutus MeteringEvent type widen.** Non-optional interface + migration-window exception. (Blocks: §10.2.)
4. **Fleet emitter sweep.** Every Pantheon service's MeteringEvent emission site stamps the five fields. One sub-task per god; coverage dashboard tracks completion. (Blocks: §10.3.)
5. **olympus-grid Pattern 1 emitter sweep.** `LedgerEntryEmitter` + `TRG_HND_*` triggers stamp the five fields on Apex-origin emissions. Absorbs GAP-45 + GAP-83 + GAP-77. (Blocks: §10.1.)
6. **Soft-warn → hard-reject flip.** After coverage dashboard reads 100% + §9.a holds for 24h, flip ingest to hard-reject. (Blocks: §10.4 + §10.5.)
7. **§9 verification.** Run the four SOQL / log queries; capture evidence into §13. (Blocks: §10.6.)

## §11 Verification protocol

- **Without iPhone:** SOQL queries against `dev_enterprise` scratch for §9.a / §9.d; curl probes against the dev plutus deploy for §9.b (synthetic ingest with and without the new fields → observe soft-warn then hard-reject behavior).
- **With iPhone (not required):** omens iOS metered events (one `llm.turn`, one `attempt`) land in the ledger with all five fields non-null.

## §12 Rollback plan

- **Schema:** the five new `LedgerEntry__c` fields are additive; leaving them in place after rollback is harmless (NULL on legacy rows is the pre-cycle state).
- **plutus ingest:** revert the validator to accept the narrow shape; the soft-warn / hard-reject logic is a single commit.
- **Fleet emitters:** per-god, per-emission-site revert. Each god's emitter changes land as separate commits for isolated rollback.
- **Migration-window buffer:** the soft-warn period means a rollback at any point before the hard-reject flip costs zero data integrity — the fleet gracefully degrades to pre-widening attribution.

## §13 Closeout

*Filled at close.*

### What shipped
- (TBD)

### What deferred (and why)
- `cand-n.md` (per-app plutus quotas) ships as its own cycle after this one — quota enforcement reads `AppKey__c` + `ApiKey__c` from the widened MeteringEvent; it is a downstream consumer, not part of this cycle's close.
- `cand-m.md` (BYO-Stripe webhooks) — separate scope; this cycle is schema-wide only.

### Verification evidence
- (TBD — SOQL output for §9.a + log aggregation for §9.b)

### Feedback that emerged from THIS cycle (seed for the next one)
- (TBD)

### Memory updates
- (TBD)

### Cycle close commit
- (TBD)
- Steward sign-off: **___** **___**
