---
pitch: "Every API call attributed to a paying account"
---

# Plutus attribution subledger + message-lifecycle metering — per-repo attestation for PR #42 (EOS-5 slice)

> File: `brain_1.7.eos-5.10.md` — **tenth sub-attestation of EOS-5**. Peer of `eos-5.7` (apollo) + `eos-5.8` (athena) + `eos-5.9` (omens). Slices the **attribution / message-lifecycle** scope of plutus PR #42 out of the EOS-5 primary (transactional accounting) and eos-5.3 (tithe integrity) territory.
>
> ⚠ **PR #42 straddles two cycles.** The same PR carries the EOS-5 attribution slice (this doc) AND the HUD W2 slice (`brain_2.7.eos-1.3.md`). **Both tickets close together on PR #42 merge.** Neither can close without the other. This is per Steward direction 2026-09-25: *"Create/refresh two board rows"* despite one reviewable diff.
>
> Source: Steward-provided plutus in-progress reconciliation 2026-09-25 (*"Plutus open-work reconciliation — snapshot vs brain/2.7.x.x"*).

| | |
|---|---|
| **Branch family** | `brain/1.7.x.x` (rolls forward into `brain/2.7.x.x` without rename per Steward direction 2026-09-01; PR #42 base is `brain/2.7.x.x`) |
| **Cycle ordinal** | `eos-5.10` — peer sub-attestation of EOS-5. Sits next to apollo `5.7`, athena `5.8`, omens `5.9`. |
| **Status** | `In Development` — reconciliation cycle. PR #42 open on `brain/2.7.x.x` since 2026-08-31 (7 commits, 18 files, +2,120 / −120); `MERGEABLE` / `CLEAN`. Steward verbal §5 ratification 2026-09-25 via direction to open the two board rows. Formal §5 checkboxes pending. |
| **Opened** | 2026-09-25 |
| **Closed** | — |
| **Prior cycle** | **`brain_1.7.eos-5.md`** (EOS-5 primary — *"System-wide transactional accounting + autonomous revenue path"* — FROZEN 2026-07-02); scope-adjacent to **`brain_1.7.eos-5.3.md`** (Draft — *"Tithe integrity + first-dollar-through"*). The attribution subledger is the plutus-side mechanism the frozen primary + draft 5.3 both require. |
| **Theme** | EOS-5-scoped scope of PR #42: attribution subledger module (~745 lines) with 7% floor + reversal + orion trigger; Stripe + Apple payment paths wired to attribution (7% floor + refund reversal); `/ledger` read-path extension carrying `appSource / transactionId / referenceId` forward + `clusterId / clusterName` surface; new `/meter-messaging` endpoint. Commits `c48bad4` + `0e13335` + `b865448` + `d24849a`. |
| **Feedback inputs** | Steward reconciliation snapshot 2026-09-25; PR #42 body test plan; frozen EOS-5 primary + eos-5b-triage; Draft eos-5.3 tithe integrity |
| **Estimated effort** | Implementation landed (4 of 7 PR commits are attribution/message-lifecycle scope; +745 lines attribution subledger module, +447 attribution route, +138 meter-messaging route). Remaining: `npm test` in api/, live `/meter-messaging` smoke, live attribution 7% write smoke via `/attribution` routes. |
| **Actual effort** | — |
| **Sibling ticket** | [`brain_2.7.eos-1.3.md`](brain_2.7.eos-1.3.md) — HUD W2 slice (ring buffer + SIGTERM + `cluster_name → domain` rename) of the same PR. **CLOSES-TOGETHER contract, see §1.6.** |

---

## Why this doc exists

The EOS-5 primary (`brain_1.7.eos-5.md`) is FROZEN, but the attribution subledger inside plutus PR #42 is the **plutus-side mechanism** the frozen primary + Draft eos-5.3 both require. Rather than push through a frozen doc's §5-gate, this per-repo peer sub-attestation slices out the plutus-scope-of-EOS-5 into its own attestable unit. Same pattern as apollo (5.7) + athena (5.8) sliced out of the BYOK umbrella (5.5) — this ticket slices attribution out of the accounting umbrella.

**Why two tickets for one PR.** Steward direction 2026-09-25 is explicit: *"Create/refresh two board rows: 1) EOS-5 slice, 2) HUD v2.3 W2. Note on the board that #42 collapses TWO cycle themes into one reviewable diff. When it merges, both rows close together."* Two governance surfaces, one implementation surface. This ticket owns the EOS-5 attribution half; `brain_2.7.eos-1.3.md` owns the HUD W2 half. Split-for-review-ergonomics remains possible — commits are chronologically ordered so a rewind + resubmit can cleanly separate them if PR #42 needs to become two PRs.

---

## Discipline principle

> *The attribution subledger is where the 7% tithe covenant becomes empirically true. Every payment event MUST produce an attribution row with a floor calculation, and every refund event MUST produce a reversal row that mirrors the original. **The 7% is not a rounding target — it is an exact-cents floor calculation on the settlement amount, verifiable row-by-row against a canonical hash function.** Attribution is additive to the ledger; no existing row is mutated. This preserves the immutable-ledger property while adding the operational-integrity claim EOS-5.3 attests.*

Two consequences enforced across sections:

1. **Attribution rows are additive — never mutations.** The subledger writes new rows; the base `LedgerEntry` rows remain untouched. Immutability preserved; attribution stands as its own timeline.
2. **7% is a floor, computed exactly per canonical hash.** `attribution/hash.ts` codifies the calculation; every attribution row references its hash so downstream reconciliation can prove the arithmetic. Refund reversals mirror the original attribution with the negative amount.

---

# § Steward-authored (top half)

## Canonical attestation statement

> *"I attest that plutus PR #42's EOS-5-scoped scope lands the attribution subledger module (`attribution/{engine,hash,orion-trigger,reversal,subledger}.ts`) with 7% floor + reversal + orion trigger; that Stripe (`routes/stripe.ts`) and Apple (`routes/apple.ts`) payment paths are wired to the attribution floor and refund reversal; that the `/ledger` read path forwards `appSource / transactionId / referenceId` and surfaces `clusterId / clusterName` (soon `clusterDomain` per sibling W2 rename); that the new `/meter-messaging` endpoint scaffolds message-lifecycle metering; that all changes are additive — no mutation of existing metering rows; that the `npm test` in api/, live `/meter-messaging` smoke, and live attribution 7% write smoke via `/attribution` routes all pass before merge; and that the sibling ticket `brain_2.7.eos-1.3.md` (HUD W2) closes on the same PR #42 merge."*

## §1 User story

- **§1.1** As **the platform's covenant of 7% tithe of net settlement to a Cause** I want **every payment settlement to produce an attribution row with a canonical hash-verifiable 7% floor** so that **the covenant is empirically true per row, not aspirationally true per quarter**.
- **§1.2** As **any refund path (Stripe chargeback, Apple refund, manual reversal)** I want **the attribution row to mirror-reverse** so that **the covenant does not leak value when a payment reverses — the tithe row reverses in exact parity with the payment row**.
- **§1.3** As **any /ledger consumer** I want **`appSource / transactionId / referenceId` forwarded** so that **cross-surface attribution is queryable end-to-end without joining across multiple systems**.
- **§1.4** As **any message-lifecycle emitter (hermes SMS, hermes email, iris in-app)** I want **`/meter-messaging` to record per-message metering** so that **message-cost attribution can be reconciled against Plutus's revenue side over the same time window**.
- **§1.5** As **the additive-only-mutation discipline** I want **the attribution subledger to write new rows without touching existing metering rows** so that **the base ledger's immutability claim remains provable and revert is clean**.
- **§1.6 (CLOSES-TOGETHER contract with `brain_2.7.eos-1.3.md`)** As **the fleet governance layer** I want **explicit acknowledgment that PR #42 also carries the HUD W2 scope** governed by the sibling ticket **`brain_2.7.eos-1.3.md`** so that **neither ticket closes without the other on the shared-PR merge trajectory**. If PR #42 splits for review ergonomics, both tickets retarget to their respective successor PRs and continue to close together.

## §2 Acceptance criteria

### §2.A Attribution subledger — 7% floor + reversal + orion (maps to future EOS-5 §9.T)

- **§2.1 (Attribution engine writes a subledger row per settlement)** — every Stripe / Apple settlement path in `routes/stripe.ts` + `routes/apple.ts` produces exactly one attribution row on success. Row carries `settlement_amount_cents`, `tithe_amount_cents`, `cause_slug`, `hash`.
- **§2.2 (7% floor exact via canonical hash)** — `tithe_amount_cents = floor(settlement_amount_cents * 0.07)`. `attribution/hash.ts` produces a hash over `(settlement_id, settlement_amount_cents, tithe_amount_cents, cause_slug)` that reproduces byte-identically on replay. Verified by planted-settlement + hash-recompute check.
- **§2.3 (Refund reversal mirrors)** — every Stripe / Apple refund produces a reversal row referencing the original attribution row's hash; `tithe_amount_cents` is the exact negative of the original. Full-refund → full reversal; partial-refund → proportional reversal with hash-verifiable arithmetic.
- **§2.4 (Orion trigger scaffold)** — attribution engine emits an orion trigger on settle + on reverse; the trigger downstream (`brain_1.7.eos-5.3` scope) will drive Cause disbursement. This PR ships the trigger emission; the disbursement automation is a downstream cycle.

### §2.B `/ledger` read-path extensions

- **§2.5 (`appSource / transactionId / referenceId` forwarded)** — every `/ledger` response carries these three fields when present in the underlying row. Verified by `curl` against a planted row.
- **§2.6 (`clusterId / clusterName` surfaced)** — read path exposes cluster identity. Once sibling `brain_2.7.eos-1.3.md` W2 rename lands, this surface migrates to `clusterId / clusterDomain`. Backward compat during migration window per sibling §3.4.

### §2.C `/meter-messaging` endpoint

- **§2.7 (`POST /v1/plutus/meter-messaging` returns 200)** — endpoint scaffolds message-lifecycle metering. Accepts message-lifecycle event payloads (hermes SMS / email / iris in-app senders); persists to metering table. Live smoke returns 200.
- **§2.8 (Message-lifecycle metering additive)** — no mutation of existing metering rows; new rows only.

### §2.D Additive-only-mutation discipline

- **§2.9 (No mutation of existing metering rows)** — the attribution subledger + message-lifecycle metering write NEW rows only. Verified by DB-level check on any test-planted existing row: hash unchanged post-attribution-run.

### §2.E CLOSES-TOGETHER with `brain_2.7.eos-1.3.md`

- **§2.10 (Sibling HUD W2 ticket closes on same merge)** — `brain_2.7.eos-1.3.md` (ring buffer + SIGTERM + domain rename) reaches its §5 sign-off state before PR #42 merges. Neither ticket closes without the other.

## §3 Non-functional requirements

- **§3.1 (Hash function stable + reproducible)** — `attribution/hash.ts` is deterministic; two runs against identical inputs produce byte-identical output. No timestamp / random seeded input.
- **§3.2 (Orion trigger emission cost bounded)** — attribution engine calls orion trigger per settle / per reverse; the call is fire-and-forget with a bounded retry per plutus's normal ares emit pipeline.
- **§3.3 (Attribution table growth bounded by settlement rate)** — one attribution row per settlement + one reversal per refund; growth is O(settlements + refunds). No unbounded growth from platform-internal events.
- **§3.4 (Additive changes — clean revert path)** — attribution + message-lifecycle metering are new tables/rows; existing metering unaffected. Revert = drop the new tables + revert code. Historical data unaffected.
- **§3.5 (Test coverage — attribution engine + hash)** — attribution engine + `attribution/hash.ts` covered by unit tests; live smokes cover Stripe + Apple wire paths.
- **§3.6 (Cross-webhook stable-ID via HUD W2)** — the sibling HUD W2 slice's insert-with-duplicate-catch discipline (`stripe:{event_id}`, `apple:{transaction_id}`) applies to attribution writes too — replays are idempotent. This is coupled to sibling ticket §2.5–§2.6.
- **§3.7 (Frozen-primary compatibility)** — `brain_1.7.eos-5.md` primary is FROZEN 2026-07-02; this per-repo sub does NOT reopen the primary. When the Steward returns to unfreeze EOS-5, this cycle's shipped attestation feeds directly into the primary's §9.A + §9.T assertion matrix.

## §4 Feedback inputs

| FB# | Title | Body excerpt / evidence |
|-----|-------|-------------------------|
| — | Steward plutus reconciliation 2026-09-25 | Snapshot of PR #42 vs brain/2.7.x.x; 7 commits, 18 files; explicit "two board rows" direction |
| — | PR #42 body test plan | Four unchecked items: `npm test` in api/, `/meter-messaging` smoke, attribution 7% write smoke, `cluster_name` grep |
| — | EOS-5 primary `brain_1.7.eos-5.md` | FROZEN 2026-07-02; attribution subledger is the plutus-side mechanism the primary requires |
| — | eos-5b-triage `04_in_development/eos-5b-triage.md` | Companion gap tracker for EOS-5; attribution + message-lifecycle relevant to multiple gaps |
| — | eos-5.3 Draft `brain_1.7.eos-5.3.md` | Tithe integrity + first-dollar-through (Draft); this ticket is the plutus-side implementation prerequisite |
| — | HUD umbrella `brain_2.7.eos-1.md` §6.A W2 row | Explicitly labels attribution subledger as "co-traveling delta governed by `brain_1.7.eos-5.md`, NOT this cycle" — this ticket is that governance instance |
| — | Sibling per-repo attestations (BYOK cascade) | apollo `brain_1.7.eos-5.7.md`, athena `brain_1.7.eos-5.8.md`, omens `brain_1.7.eos-5.9.md` — same pattern of per-repo peer subs of EOS-5 |

## §5 Steward approval gate

- [ ] Discipline principle acknowledged (additive-only; 7% floor exact per canonical hash; reversal mirrors)
- [ ] Canonical attestation statement locked
- [ ] Story locked (§1.1 – §1.6)
- [ ] Acceptance criteria locked (§2.1 – §2.10)
- [ ] NFRs locked (§3.1 – §3.7)
- [ ] **CLOSES-TOGETHER contract with `brain_2.7.eos-1.3.md` acknowledged (§1.6)**
- [ ] **PR-body test-plan check-off confirmed** — `npm test` green, `/meter-messaging` live smoke 200, attribution 7% write smoke green
- [ ] Approved to execute — signed: **__________** **__________**

---

# § Agent-authored (bottom half)

## §6 Layer impact map

Single-repo × single-EOS-slice (plutus attribution scope of PR #42). Cross-repo coordination named.

| Criterion | plutus | ares | hermes | Cause registry (SF, downstream) |
|---|---|---|---|---|
| §2.1–§2.4 attribution engine + hash + orion | `api/src/attribution/{engine,hash,orion-trigger,reversal,subledger}.ts` + `routes/attribution.ts` | consumes attribution emits via normal pipeline | — | disbursement automation (downstream cycle) |
| §2.5–§2.6 /ledger read path | `routes/ledger.ts` extension | — | — | — |
| §2.7–§2.8 /meter-messaging | `routes/meter-messaging.ts` | receives message-lifecycle telemetry via normal pipeline | senders POST to /meter-messaging | — |
| §2.9 additive-only | writer discipline | — | — | — |
| §2.10 CLOSES-TOGETHER | coordinated with sibling ticket | — | — | — |

## §7 Schema deltas

### §7.1 Attribution subledger (new tables/rows, no mutation of existing)
- Attribution row: `(hash, settlement_id, settlement_amount_cents, tithe_amount_cents, cause_slug, created_at, source_app, source_ref)`
- Reversal row: `(hash, original_hash, settlement_id, reversal_amount_cents, tithe_reversal_amount_cents, created_at)`
- Orion trigger event: fired on settle + on reverse; scaffolds downstream disbursement automation.

### §7.2 /ledger read-path extension
- Existing `LedgerEntry` fields already carry `appSource / transactionId / referenceId` where present; read path now forwards them (was previously masked in response projection).
- `clusterId / clusterName` surfaced in read response; migrates to `clusterId / clusterDomain` on sibling `brain_2.7.eos-1.3.md` W2 rename landing.

### §7.3 /meter-messaging endpoint (new table/rows)
- Message-lifecycle metering row: `(message_id, sender_god, recipient_channel, message_kind, cost_estimate_cents, actual_cost_cents, timestamp)`
- Additive; no mutation of existing metering.

## §8 Service contracts

### §8.1 `POST /v1/plutus/attribution` (new route)
Attribution engine surface. Verified by live smoke per PR test plan item 3.

### §8.2 `GET /v1/plutus/ledger` (extended)
Existing route; response now forwards `appSource / transactionId / referenceId` + surfaces cluster identity.

### §8.3 `POST /v1/plutus/meter-messaging` (new route)
Message-lifecycle metering ingest. Verified by live smoke per PR test plan item 2.

## §9 Telemetry assertions

### §9.ATT Attribution attestation
- **§9.ATT-1** — Every Stripe/Apple settlement in test env produces exactly one attribution row.
- **§9.ATT-2** — `tithe_amount_cents = floor(settlement_amount_cents * 0.07)` for every attribution row; verified against canonical hash reproduction.
- **§9.ATT-3** — Every refund produces a reversal row referencing the original attribution row's hash; reversal `tithe_amount_cents` is exact negative of original.
- **§9.ATT-4** — Orion trigger emitted on settle + reverse; observable in orion queue.

### §9.LED /ledger read-path attestation
- **§9.LED-1** — `curl /v1/plutus/ledger?…` response carries `appSource / transactionId / referenceId` fields.
- **§9.LED-2** — Response carries cluster identity (`clusterId / clusterName` today; migrates to `clusterId / clusterDomain` on sibling W2 rename).

### §9.MSG /meter-messaging attestation
- **§9.MSG-1** — `POST /v1/plutus/meter-messaging` returns 200 on well-formed input; writes a metering row.
- **§9.MSG-2** — Message-lifecycle metering additive: existing metering rows unmutated (verified by row-hash preservation).

### §9.OP Operational hygiene
- **§9.OP-1** — PR-body test plan check-off complete: `npm test` green, `/meter-messaging` live 200, `/attribution` live smoke green.
- **§9.OP-2** — CI actually ran green on head SHA (anti-pattern gate).

## §10 Execution plan

### §10.1 Pre-merge author-owned
1. `cd api && npm test` — attribution engine + hash + batch-accumulator suites green (batch-accumulator lives in sibling scope; unit test file counted here for completeness).
2. Local `/meter-messaging` smoke returns 200 on a planted payload. Closes §9.MSG-1.
3. Live attribution 7% write smoke via `/attribution` routes — planted settlement produces attribution row with hash-verified 7% floor. Closes §9.ATT-1 + §9.ATT-2.
4. Live refund → reversal smoke. Closes §9.ATT-3.

### §10.2 CI + coordinated merge (per sibling `brain_2.7.eos-1.3.md` §10.2)
5. **§5 rulings signed** on this ticket AND on `brain_2.7.eos-1.3.md`. No merge before both.
6. CI re-triggered on PR #42; green rollup. Closes §9.OP-2.
7. **HUD §10.2 coordinated merge sequence** (sibling ticket owns this; both tickets close together on PR #42 merge).

### §10.3 Post-merge attestation
8. Live production attribution smoke: real (or planted) Stripe / Apple event produces attribution row; orion trigger visible.
9. Live production `/meter-messaging` smoke: hermes SMS/email emit produces metering row.
10. Reversal smoke: refund path produces reversal row with hash-verified mirror.

### §10.4 Sibling coordination
11. `git mv 04_in_development → 06_shipped` for BOTH tickets at PR #42 merge close. Neither closes alone.

### §10.5 Feed-forward to frozen EOS-5 primary
12. When Steward unfreezes `brain_1.7.eos-5.md` for closeout: this cycle's shipped evidence feeds directly into primary §9.A + §9.T (attribution + tithe assertions). No re-work; the attestation stands.

### §10.6 Deferred to future cycles
- Downstream Cause disbursement automation — future cycle; orion trigger emission is scaffold today.
- Attribution reconciliation dashboard — argos-scoped once argos observability plane lands (`brain_2.7.eos-3`).
- Attribution table cold-storage archival — bounded by plutus retention policy; future cycle.
- Full closure of `brain_1.7.eos-5.md` primary — Steward's return-to-work sequence.

## §11 Verification protocol

### §11.1 Without iPhone (this cycle's entire scope)
- `npm test` in `api/` (attribution + hash + orion-trigger + reversal + subledger + meter-messaging suites).
- `curl POST /v1/plutus/meter-messaging` → 200.
- `curl POST /v1/plutus/attribution` planted-settlement → response with hash + attribution row visible in DB.
- Planted refund → reversal row visible; hash-mirror verified.
- `curl GET /v1/plutus/ledger?…` → response carries `appSource / transactionId / referenceId + clusterId / clusterName`.

## §12 Rollback plan

- **PR #42 full revert.** Squash-merge is single-commit revert; both this ticket AND sibling `brain_2.7.eos-1.3.md` revert together.
- **Attribution isolated revert.** Attribution changes are additive; theoretically separable. Rewind commits `c48bad4` + `0e13335` + `b865448` + `d24849a`; HUD W2 commits stay. Prefer forward-fix.
- **Non-revertable elements.** Attribution rows written post-merge are immutable (correct behavior for ledger discipline). Rollback drops the WRITER but leaves the ROWS. Any downstream (Cause disbursement) that migrated to attribution rows will need dual-shape tolerance briefly if revert lands.

## §13 Closeout

*Filled at end of cycle — closes together with `brain_2.7.eos-1.3.md`.*

### What shipped
- …

### What deferred (and why)
- Downstream Cause disbursement automation — future cycle.
- Attribution dashboard — future argos-scoped cycle.
- Full closure of `brain_1.7.eos-5.md` primary — Steward-owned unfreeze.

### What surprised
- …

### Verification evidence
- Link to `npm test` output (attribution + related suites).
- Link to `/meter-messaging` + `/attribution` live smoke outputs.
- Link to planted settlement + reversal DB row check.
- Link to `brain/2.7.x.x` post-merge plutus SHA + parent submodule bump SHA + CDK deploy log.
- Link to sibling `brain_2.7.eos-1.3.md` closeout evidence.

### Feedback that emerged from THIS cycle (seed for the next one)
- Downstream Cause disbursement — natural next cycle.
- Argos attribution-reconciliation dashboard — after argos observability plane ships.
- Message-lifecycle metering feedback loop with hermes senders — after hermes 1.2 §11.5 lands.

### Memory updates
- Confirm existing memory `project_tithe_fires_at_settlement_not_payment.md` remains canonical; attribution engine embodies exactly this semantics.
- New memory candidate: two-tickets-one-PR pattern for cross-cycle-straddling reconciliations (same as sibling ticket).

### Cycle close commit
- PR #42 merge SHA + parent submodule bump SHA + CDK deploy log.
- Steward sign-off: **__________** **__________**

---

## §9-observed appendix — 2026-09-30 production deploy (code-identity attestation)

**Deploy record:** [`../DEPLOY-2026-09-30.md`](../DEPLOY-2026-09-30.md) — parent `841c222` · plutus submodule ptr `2da7c8e` · Steward-verified 2026-09-29.

**Code identity for plutus (attribution scope):** ✓ VERIFIED — boot log shows `PLUTUS ONLINE, /v1/plutus/api/ingest, /v1/plutus/api/ledger, /v1/plutus/api/stripe/*, live request traffic on /v1/plutus/api/ingest`.

**§9 behavior signals: NOT YET TESTED.** Per Steward direction 2026-09-29 (*"especially related to the security updates"*), every §9.ATT / §9.LED / §9.MSG signal remains unverified. Live attribution 7% write smoke, refund reversal, `/meter-messaging` scaffold all pending. Attestation pass per DEPLOY-2026-09-30 priority sequence **step 3**. **Twin closes-together with `brain_2.7.eos-1.3`.**

**Ticket-specific follow-ups from deploy:** none directly for attribution scope (the observed `retry_ttl_expired` W2 event belongs to the HUD-W2 twin — see `brain_2.7.eos-1.3` §9-observed appendix).

---

## References

- **EOS-5 primary (frozen):** [`brain_1.7.eos-5.md`](brain_1.7.eos-5.md) — system-wide transactional accounting + autonomous revenue path.
- **eos-5b-triage:** [`eos-5b-triage.md`](eos-5b-triage.md) — companion gap tracker.
- **Adjacent Draft:** [`brain_1.7.eos-5.3.md`](brain_1.7.eos-5.3.md) — Tithe integrity + first-dollar-through.
- **Peer per-repo sub-attestations of EOS-5:** [`brain_1.7.eos-5.7.md`](brain_1.7.eos-5.7.md) (apollo) · [`brain_1.7.eos-5.8.md`](brain_1.7.eos-5.8.md) (athena) · [`brain_1.7.eos-5.9.md`](brain_1.7.eos-5.9.md) (omens).
- **CLOSES-TOGETHER sibling (same PR):** [`brain_2.7.eos-1.3.md`](brain_2.7.eos-1.3.md) — HUD W2 slice of PR #42.
- **Plutus PR #42:** [`feat(plutus): consolidate attribution subledger (eos-5) + W2 ring buffer (hostile-universe-defense v2.3)`](https://github.com/olympus-616/plutus/pull/42)
- **HUD umbrella §6.A W2 row:** [`brain_2.7.eos-1.md`](brain_2.7.eos-1.md) — explicitly names attribution as co-traveling; this ticket is that governance instance.
- **Tithe-fires-at-settlement memory:** `project_tithe_fires_at_settlement_not_payment.md`.
- **Source reconciliation snapshot:** Steward direction 2026-09-25 (in session).
- **EOS operating manual:** [`../README.md`](../README.md)
- **Submodule Pointer Bump Discipline:** olympus-616 parent `CLAUDE.md`
