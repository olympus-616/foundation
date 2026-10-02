---
pitch: "Ledger survives server kills — not one dollar lost"
---

# Plutus HUD W2 — three-tier ring buffer + SIGTERM last-gasp + `cluster_name → domain` rename — per-repo attestation for PR #42

> File: `brain_2.7.eos-1.3.md` — **third sub-attestation of `brain_2.7.eos-1`** (hostile-universe defense). Peer of `eos-1.1` (ares) + `eos-1.2` (hermes). Slices the **plutus** leg out of the HUD cascade.
>
> ⚠ **PR #42 straddles two cycles.** The same PR carries the HUD W2 slice (this doc) AND the EOS-5 attribution subledger slice (`brain_1.7.eos-5.10.md`). **Both tickets close together on PR #42 merge.** Neither can close without the other. This is per Steward direction 2026-09-25: *"Create/refresh two board rows"* despite one reviewable diff.
>
> Source: Steward-provided plutus in-progress reconciliation 2026-09-25 (*"Plutus open-work reconciliation — snapshot vs brain/2.7.x.x"*).

| | |
|---|---|
| **Branch family** | `brain/2.7.x.x` (== `brain/1.7.x.x` tip at snapshot; the 2.7 rebrand is a fresh pointer, not a divergence) |
| **Cycle ordinal** | `eos-1.3` — third per-repo sub-attestation of `brain_2.7.eos-1` (HUD umbrella). Peer of `eos-1.1` (ares W3+W4) + `eos-1.2` (hermes §11.5). |
| **Status** | `In Development` — reconciliation cycle. PR #42 open on `brain/2.7.x.x` since 2026-08-31 (7 commits, 18 files, +2,120 / −120); `MERGEABLE` / `CLEAN`. Tree clean; on PR #42 head. Steward verbal §5 ratification 2026-09-25 via direction to open the two board rows. Formal §5 checkboxes pending. |
| **Opened** | 2026-09-25 |
| **Closed** | — |
| **Prior cycle** | `brain_2.7.eos-1` (HUD umbrella; §6.A W2 row explicitly names plutus #42 as the ring-buffer + SIGTERM + insert-with-duplicate-catch wave) |
| **Theme** | HUD-scoped scope of PR #42: three-tier ring buffer (`critical / important / recon`) + tier-priority drain + SIGTERM last-gasp flush + insert-with-duplicate-catch writer (immutable ledger, NOT upsert per v2.3 correction 4) + `cluster_name → domain` wire-schema rename (matches HUD §L7's identity refactor). Commits `d87c419` + `a65cfae` + `a9648c5`. |
| **Feedback inputs** | Steward reconciliation snapshot 2026-09-25; PR #42 body test plan; brain_2.7.eos-1 §6.A W2 row; sibling attestations for ares (`brain_2.7.eos-1.1`) + hermes (`brain_2.7.eos-1.2`) |
| **Estimated effort** | Implementation landed (3 of 7 PR commits are HUD scope; +403 net on `batch-accumulator.ts`, +181 new unit test file, plus the domain rename cross-cutting through types + ledger-sync + batch-accumulator + routes/ingest). Remaining: PR-body test-plan check-off, cross-repo coordination with ares/zeus, HUD coordinated merge sequence, post-merge domain-reference grep. |
| **Actual effort** | — |
| **Sibling ticket** | [`brain_1.7.eos-5.10.md`](brain_1.7.eos-5.10.md) — EOS-5 attribution subledger + message-lifecycle metering slice of the same PR. **CLOSES-TOGETHER contract, see §1.6.** |

---

## Why this doc exists

`brain_2.7.eos-1.md` §6.A W2 row names plutus #42 as the ring-buffer + writer discipline wave of the HUD cascade, and explicitly labels the attribution subledger as **co-traveling delta governed by `brain_1.7.eos-5.md`, NOT this cycle**. This doc closes the HUD-side loop: names the HUD-scoped acceptance criteria, the coordinated-merge sequence with ares W3+W4 + zeus W5+W7b + olympus-grid W1, and the ring-buffer + SIGTERM + duplicate-catch + domain-rename observability.

**Why two tickets for one PR.** The Steward's 2026-09-25 direction is explicit: *"Create/refresh two board rows: 1) EOS-5 slice, 2) HUD v2.3 W2. Note on the board that #42 collapses TWO cycle themes into one reviewable diff. When it merges, both rows close together."* Two governance surfaces, one implementation surface. This ticket owns the HUD half; `brain_1.7.eos-5.10.md` owns the EOS-5 half. Split-for-review-ergonomics remains possible (§10.5) — commits are chronologically ordered so a rewind + resubmit can cleanly separate them if PR #42 needs to become two PRs. Neither ticket closes without the other on the current shared-PR trajectory.

---

## Discipline principle

> *The ring buffer is an **immutable ledger primitive**, not a queue. Duplicate arrivals catch as success (insert-with-DUPLICATE_VALUE = success; NOT upsert per v2.3 correction 4). SIGTERM drains critical-tier BEFORE recon-tier — never in FIFO order. If the writer becomes silently mutating under any load or shutdown path, the immutability claim collapses and the entire ledger's forensic value collapses with it. The `cluster_name → domain` rename is a hard cutover with no graceful degradation — downstream consumers must be verified zero at merge time.*

Two consequences enforced across sections:

1. **Insert-with-DUPLICATE_VALUE catches as success — never as an upsert.** External-webhook replays (Stripe `event_id`, Apple `transaction_id`) derive stable IDs so duplicates arrive; catching them as success preserves immutability without mutation. This is Correction 4 of the sealed HUD v2.3 design.
2. **`cluster_name → domain` rename is hard.** No fallback. Any downstream consumer (dashboards, saved SOQL, iris queries, argos search terms) grouping by `cluster_name` breaks post-merge. **Zero external references** verified before green-light.

---

# § Steward-authored (top half)

## Canonical attestation statement

> *"I attest that plutus PR #42's HUD-scoped scope lands the three-tier ring buffer (critical / important / recon) with tier-priority drain and SIGTERM last-gasp flush; that the ledger writer catches `DUPLICATE_VALUE` as success without mutating existing rows (immutable ledger property preserved); that the `cluster_name → domain` wire-schema rename matches HUD §L7's identity refactor across `api/src/types.ts`, `ledger-sync.ts`, `batch-accumulator.ts`, and `routes/ingest.ts`; that zero downstream consumers grouping by `cluster_name` remain at merge time; that the coordinated merge sequence with olympus-grid #345 (W1) + ares #66 (W3+W4) + zeus #45 (W5+W7b) + hermes #62 (§11.5) holds per HUD `brain_2.7.eos-1.md` §10.2; and that the sibling ticket `brain_1.7.eos-5.10.md` (attribution subledger) closes on the same PR #42 merge."*

## §1 User story

- **§1.1** As **the plutus service under load** I want **critical-tier events (`payment.*`, `settlement.*`, `tithe.*`, `cluster.status.poll.*`, `api.audit.*`) drained ahead of recon-tier events** so that **revenue-attributing events never wait behind observability noise**.
- **§1.2** As **the plutus service on SIGTERM** I want **critical-tier events flushed to persistence before the process exits** so that **an orderly rolling deploy never drops a revenue row**.
- **§1.3** As **any external-webhook caller (Stripe / Apple)** I want **replays to arrive idempotently — duplicates caught as success without mutation** so that **the ledger's immutable-history claim holds under real-world replay conditions**.
- **§1.4** As **HUD's L7 cluster-identity refactor** I want **plutus emits carrying `domain` (not `cluster_name`) so that** **the fleet's single L7-identity migration lands atomically across the six-PR HUD cascade**.
- **§1.5** As **the fleet's saved-query surface (argos, iris dashboards, SOQL)** I want **zero remaining `cluster_name` references at merge time** so that **the hard cutover does not break downstream analytics silently**.
- **§1.6 (CLOSES-TOGETHER contract with `brain_1.7.eos-5.10.md`)** As **the fleet governance layer** I want **explicit acknowledgment that PR #42 also carries the EOS-5 attribution subledger + message-lifecycle metering** governed by the sibling ticket **`brain_1.7.eos-5.10.md`** so that **neither ticket closes without the other on the shared-PR merge trajectory**. If PR #42 splits for review ergonomics, both tickets retarget to their respective successor PRs and continue to close together.

## §2 Acceptance criteria

Each criterion maps to one HUD-umbrella §9.HUD observable signal plus plutus-specific §9.PLU signals.

### §2.A Three-tier ring buffer (maps to HUD §9.HUD-11 + §9.HUD-11a)

- **§2.1 (Tier classification)** — every event emitted to the ring buffer is classified `critical | important | recon` per the closed event registry (ares `event-registry.ts`, cross-repo dependency). Unknown types reject at ares boundary before reaching plutus.
- **§2.2 (Tier-priority drain)** — under a scripted mixed-load burst, the plutus drain processes ALL critical events before ANY recon events. Verifiable by planted timestamps + drain-order log.
- **§2.3 (SIGTERM last-gasp — critical drained)** — on plutus SIGTERM under load with events in the ring buffer, the last-gasp path flushes all `critical`-tier events before process exit. Recon-tier events MAY drop with metric — never silent. Matches HUD §9.HUD-11.
- **§2.4 (Capacity ceiling never inflates heap)** — under sustained excess load, `recon`-tier events drop at the ceiling with metric; `critical`-tier events queue up to the retry-TTL then drop with `api.critical_drop` EMF metric (matches HUD §9.HUD-11a via ares' side; plutus emits the mirror signal).

### §2.B Insert-with-duplicate-catch writer (maps to HUD §9.HUD-10)

- **§2.5 (DUPLICATE_VALUE = success, NOT upsert)** — on receiving a duplicate insert (same stable ID), the writer catches `DUPLICATE_VALUE` and returns success without mutating the existing row. Verified by planted duplicate insert + row-hash-unchanged check. This is v2.3 Correction 4.
- **§2.6 (External-webhook stable IDs)** — Stripe events derive stable ID `stripe:{event_id}`; Apple events derive `apple:{transaction_id}`. Replays reach the writer with the same ID and are idempotent by construction. Verified by planted webhook replay + one-row-count check.

### §2.C `cluster_name → domain` wire-schema cutover

- **§2.7 (Emit payload carries `domain`)** — every plutus-emitted event's cluster-identity field is `domain` on the wire; `cluster_name` is NOT present. Verified by grep on live wire capture from `brain/2.7.x.x`-deployed plutus.
- **§2.8 (Types + ledger-sync + batch-accumulator + routes/ingest all renamed)** — `api/src/types.ts`, `api/src/ledger-sync.ts`, `api/src/metering/batch-accumulator.ts`, and `api/src/routes/ingest.ts` all use `domain` (not `cluster_name`). Verified by codebase grep for `cluster_name` / `CLUSTER_NAME` — zero results outside the rename commit `a65cfae` + follow-up `a9648c5`.
- **§2.9 (Zero downstream consumers reference `cluster_name` — MERGE GATE)** — fleet-wide grep across argos search terms, iris saved-query snippets, SOQL dashboards, and any other query surface for `cluster_name` groupings returns zero non-historical hits. This is the merge-gate check flagged in the PR body test plan.

### §2.D Coordinated-merge sequence (per HUD `brain_2.7.eos-1.md` §10.2)

- **§2.10 (Plutus + zeus in parallel per HUD §10.2 step 3)** — plutus #42 + zeus #45 merge in parallel after olympus-grid #345 (W1) lands. Both are independent of each other and of ares.
- **§2.11 (Ares reads post-plutus)** — ares #66 (W3+W4) merges AFTER plutus + zeus per HUD §10.2 step 4. Ares reads `Cluster__c.AllowedIpv4Cidrs__c` from the schema anchor (W1) and reports status via the plutus emit pipeline (W2). Verified by HUD §10.2 discipline held.
- **§2.12 (Hermes #62 merges no later than ares)** — per HUD §10.2 step 5. Hermes §11.5 unblocks the Ares → Plutus → SF audit trail (fixes HTTP 420).

### §2.E CLOSES-TOGETHER with `brain_1.7.eos-5.10.md`

- **§2.13 (Sibling attribution ticket closes on same merge)** — `brain_1.7.eos-5.10.md` (attribution subledger + message-lifecycle metering) reaches its §5 sign-off state before PR #42 merges. Neither ticket closes without the other.

## §3 Non-functional requirements

- **§3.1 (Ring-buffer memory bounded)** — under sustained excess load, plutus process RSS does NOT grow linearly with input rate. The capacity ceiling holds; overflow drops with metric.
- **§3.2 (Immutability preserved via writer discipline)** — no code path in `batch-accumulator.ts` or the writer performs an UPDATE on `LedgerEntry__c` (or the equivalent local store). Verified by grep for `UPDATE` DML on `LedgerEntry`.
- **§3.3 (Additive change — clean revert path)** — the ring-buffer overhaul + duplicate-catch writer changes shape but not semantics of existing rows. Revert = restore prior batch-accumulator + upsert writer; existing rows unaffected.
- **§3.4 (Domain-rename hard cutover — no fallback)** — the wire schema post-rename is `domain` only. No legacy-compat branch reads `cluster_name`. This forces the merge-gate discipline.
- **§3.5 (Cross-repo dependency window)** — plutus #42 merge is coordinated with the other 5 HUD PRs per HUD §10.2. Merging plutus alone with a stale ares W3+W4 produces mismatch on the emit-pipeline classify contract — falls back to metadata but the primary dimension breaks.
- **§3.6 (Rollback bounded)** — full PR revert is single-commit squash-revert. Non-revertable: `LedgerEntry` rows written post-merge are immutable (correct behavior).

## §4 Feedback inputs

| FB# | Title | Body excerpt / evidence |
|-----|-------|-------------------------|
| — | Steward plutus reconciliation 2026-09-25 | Snapshot of PR #42 vs brain/2.7.x.x; enumerates 7 commits, 18 files, cross-repo train, load-bearing risks |
| — | PR #42 body test plan | Four unchecked items: `npm test` in api/, live `/meter-messaging` smoke, live attribution 7% write smoke, final `cluster_name`-reference grep |
| — | HUD umbrella `brain_2.7.eos-1.md` §6.A W2 row | Names plutus #42 as the W2 HUD-required wave; attribution subledger explicitly labeled co-traveling and governed by `brain_1.7.eos-5.md` NOT this cycle |
| — | HUD sealed design v2.3 Correction 4 | Insert-with-duplicate-catch writer (NOT upsert); immutable ledger preserved |
| — | HUD sealed design v2.3 Post-Seal Correction 3 | `cluster_name → domain` rename; identity is bare host, transport layered by caller |
| — | Sibling per-repo attestations | ares `brain_2.7.eos-1.1.md`, hermes `brain_2.7.eos-1.2.md`, and (this PR's own) sibling `brain_1.7.eos-5.10.md` |

## §5 Steward approval gate

- [ ] Discipline principle acknowledged (immutable ledger via duplicate-catch; hard cutover on domain rename)
- [ ] Canonical attestation statement locked
- [ ] Story locked (§1.1 – §1.6)
- [ ] Acceptance criteria locked (§2.1 – §2.13)
- [ ] NFRs locked (§3.1 – §3.6)
- [ ] **CLOSES-TOGETHER contract with `brain_1.7.eos-5.10.md` acknowledged (§1.6)**
- [ ] **PR-body test-plan check-off confirmed** — `npm test` green, live smokes green, `cluster_name` grep clean
- [ ] Coordinated merge with HUD siblings per §2.10 – §2.12 confirmed
- [ ] Approved to execute — signed: **__________** **__________**

---

# § Agent-authored (bottom half)

## §6 Layer impact map

Single-repo × single-HUD-slice (plutus scope of PR #42). Cross-repo coordination named.

| Criterion | plutus | ares | zeus | olympus-grid | hermes |
|---|---|---|---|---|---|
| §2.1–§2.4 ring buffer + SIGTERM | `metering/batch-accumulator.ts` + unit tests | consumes classify contract | — | — | — |
| §2.5–§2.6 duplicate-catch writer | writer path + stable-ID derivation for Stripe/Apple | — | — | — | — |
| §2.7–§2.9 domain rename | `types.ts` + `ledger-sync.ts` + `batch-accumulator.ts` + `routes/ingest.ts` | reads Cluster__c.Domain__c per L7 | — | ships `Cluster__c.Domain__c` in #345 | — |
| §2.10–§2.12 coordinated merge | this PR | ares #66 (W3+W4) after plutus | zeus #45 (W5+W7b) parallel plutus | #345 W1 first | #62 §11.5 no later than ares |

## §7 Schema deltas

### §7.1 Ring-buffer internals (plutus-only, no wire visible)
Three tiers (`critical | important | recon`), tier-priority drain, SIGTERM last-gasp. Not exposed on wire; internal contract.

### §7.2 Writer path (plutus-only)
Insert-with-duplicate-catch — `catch (DuplicateValueError) → return success`. NO upsert. External-webhook stable-ID derivation surface (per §7.4 of HUD umbrella): `stripe:{event_id}`, `apple:{transaction_id}`.

### §7.3 Wire-schema rename (cross-repo)
`cluster_name → domain` on:
- Plutus emit payload cluster-identity field
- Plutus ingest route (`routes/ingest.ts`)
- Ledger-sync internal type
- Batch-accumulator internal type

Cross-consumers: ares reads `domain` (per ares 1.1 §2.5), olympus-grid ships `Cluster__c.Domain__c` (per HUD W1), argos search terms + iris dashboards + SOQL groupings verified zero-`cluster_name` at merge time.

## §8 Service contracts

### §8.1 Plutus ingest contract (`POST /v1/plutus/ingest`)
Cluster identity carried in `domain` (bare host), NOT `cluster_name`. Cross-repo consumers already renamed on their side per ares 1.1 §2.5 + omens 5.9 §7.2.

### §8.2 Ring-buffer contract (internal, plutus-only)
Three-tier admission from the ares emit pipeline (L1–L5). Tier classification determined by event-registry lookup on ares side (§7.3 HUD umbrella); plutus consumes classified events.

## §9 Telemetry assertions

### §9.PLU Plutus-side HUD attestation
- **§9.PLU-1 through §9.PLU-4** — one per §2.1–§2.4 (tier classification / drain order / SIGTERM critical-first / capacity ceiling with metric).
- **§9.PLU-5** — `DUPLICATE_VALUE` catch path exercised via planted duplicate insert; row count remains N (not N+1).
- **§9.PLU-6** — External-webhook stable-ID replay: two Stripe `event_id`-identical POSTs → one `LedgerEntry` row.
- **§9.PLU-7** — Emit payload wire capture grep for `"cluster_name"`: zero hits.
- **§9.PLU-8** — Codebase grep across plutus for `cluster_name` / `CLUSTER_NAME` outside commit `a65cfae` + `a9648c5`: zero hits.
- **§9.PLU-9** — Fleet-wide grep for `cluster_name` in downstream consumers (argos, iris queries, SOQL): zero non-historical hits.

### §9.OP Operational hygiene
- **§9.OP-1** — PR-body test plan check-off complete: `npm test` green in api/, `/meter-messaging` live smoke 200, attribution 7% smoke green (§9.OP-1 for §5.10 sibling), final `cluster_name` grep clean.
- **§9.OP-2** — CI actually ran green on head SHA (anti-pattern gate — same as ares 1.1 + hermes 1.2 §9.OP).

### §9.HUD Umbrella signals plutus contributes to
- HUD §9.HUD-10 (Plutus duplicate-catch) — closed by §9.PLU-5 / §9.PLU-6 above.
- HUD §9.HUD-11 (SIGTERM critical-first) — closed by §9.PLU-3.
- HUD §9.HUD-12 (Cluster lifecycle rows immutable) — partial contribution via §9.PLU-8 (writer never UPDATEs).
- HUD §9.OP-1 (Ares → Plutus → SF audit trail) — end-to-end verification depends on this cycle plus hermes 1.2.

## §10 Execution plan

### §10.1 Pre-merge author-owned
1. `cd api && npm test` — batch-accumulator unit suite green. Closes PR test plan #1.
2. Local `/meter-messaging` smoke returns 200. Closes PR test plan #2.
3. Attribution 7% smoke (governed by sibling `brain_1.7.eos-5.10.md` — cross-close).
4. Final `cluster_name` / `CLUSTER_NAME` grep across the fleet — zero non-historical hits. Closes §9.PLU-8 + §9.PLU-9.

### §10.2 CI + coordinated merge (per HUD §10.2)
5. **§5 rulings signed** on this ticket AND on `brain_1.7.eos-5.10.md`. No merge before both.
6. CI re-triggered on PR #42; green rollup on head. Closes §9.OP-2.
7. **HUD §10.2 sequence:**
   - Step 2 (HUD): olympus-grid #345 merges first (schema anchor).
   - Step 3 (HUD): plutus #42 (this PR) + zeus #45 merge in parallel.
   - Step 4 (HUD): ares #66 merges after plutus + zeus.
   - Step 5 (HUD): hermes #62 merges no later than ares.
8. Docker rebuild → ECR push (automatic).
9. Parent olympus-616 submodule pointer bump for plutus per `[Submodule Pointer Bump Discipline]` — explicit-attested-SHAs.
10. Steward `[prod needs approval]` for parent merge → CDK deploy.

### §10.3 Post-merge attestation
11. Wire capture + grep for §9.PLU-7 (`cluster_name` absent).
12. Planted duplicate + replay smoke for §9.PLU-5 / §9.PLU-6.
13. SIGTERM under-load smoke for §9.PLU-3.
14. Fleet-wide `cluster_name` audit re-run for §9.PLU-9.

### §10.4 Sibling coordination (this cycle + `brain_1.7.eos-5.10.md`)
15. `git mv 04_in_development → 06_shipped` for BOTH tickets on the same commit (or paired commits) at PR #42 merge close. Neither closes alone.

### §10.5 Split path (if PR #42 splits for review ergonomics)
Commits are chronologically ordered:
- EOS-5 attribution commits precede HUD W2 commits: `c48bad4` → `0e13335` → `b865448` → `d24849a` (EOS-5) then `d87c419` → `a65cfae` → `a9648c5` (HUD).
- Rewind + resubmit can cleanly split the PR. Each ticket retargets to its respective successor PR; sibling ticket updated in lockstep.

### §10.6 Deferred to future cycles
- Move to `cycle/eos-<N>` shared branch pattern — next plutus increment.
- Fleet-wide CLAUDE.md brain-family sweep (1.7 → 2.7) — housekeeping cycle (already in FOLLOW-UPS).
- Plutus storage-adapter contract (Argos↔Plutus per `brain_2.7.eos-3` argos RFC-C) — future cycle, blocked on Argos design ratification.

## §11 Verification protocol

### §11.1 Without iPhone (this cycle's entire scope)
- `npm test` in `api/`.
- Local `/meter-messaging` + `/attribution` smokes (attribution smoke governed by sibling ticket).
- Fleet-wide grep for `cluster_name` outside rename commits.
- Wire-capture grep on emit payloads.
- Planted duplicate + replay + SIGTERM smokes against int-cluster plutus.

## §12 Rollback plan

- **PR #42 full revert.** Squash-merge is single-commit revert. Both this ticket AND sibling `brain_1.7.eos-5.10.md` revert together.
- **Ring-buffer isolated revert.** Not feasible in isolation — the domain rename cross-cuts the same files. Prefer full-PR revert.
- **Sibling attribution isolated revert.** Attribution changes are additive; theoretically separable, but the commit chain is unified. Prefer full-PR revert.
- **Non-revertable elements.** `LedgerEntry` rows written post-merge with `domain` field + duplicate-catch semantics are immutable. Downstream analytics that migrated to `domain` will need dual-shape support briefly if revert lands. Prefer forward-fix.

## §13 Closeout

*Filled at end of cycle — closes together with `brain_1.7.eos-5.10.md`.*

### What shipped
- …

### What deferred (and why)
- Move to `cycle/eos-<N>` — future plutus increment.
- Plutus storage-adapter contract for Argos — blocked on Argos RFC-C.

### What surprised
- …

### Verification evidence
- Link to `npm test` output (api/, batch-accumulator suite).
- Link to `/meter-messaging` + attribution smokes.
- Link to fleet-wide `cluster_name` audit output.
- Link to `brain/2.7.x.x` post-merge plutus SHA + parent submodule bump SHA + CDK deploy log.
- Link to sibling `brain_1.7.eos-5.10.md` closeout evidence.

### Feedback that emerged from THIS cycle (seed for the next one)
- …

### Memory updates
- Confirm existing memory `feedback_mergeable_is_not_works.md` remains canonical.
- New memory candidate: two-tickets-one-PR pattern for cross-cycle-straddling reconciliations.

### Cycle close commit
- PR #42 merge SHA + parent submodule bump SHA + CDK deploy log.
- Steward sign-off: **__________** **__________**

---

## §9-observed appendix — 2026-09-30 production deploy (code-identity attestation)

**Deploy record:** [`../DEPLOY-2026-09-30.md`](../DEPLOY-2026-09-30.md) — parent `841c222` · plutus submodule ptr `2da7c8e` · Steward-verified 2026-09-29.

**Code identity for plutus (HUD W2 scope):** ✓ VERIFIED — boot log shows `PLUTUS ONLINE, /v1/plutus/api/ingest, /v1/plutus/api/ledger, /v1/plutus/api/stripe/*, live request traffic on /v1/plutus/api/ingest`.

**§9 behavior signals: NOT YET TESTED.** Per Steward direction 2026-09-29 (*"especially related to the security updates"*), every §9.PLU / §9.HUD signal remains unverified. Three-tier drain order, SIGTERM critical-first flush, insert-with-duplicate-catch under replay, `cluster_name → domain` fleet-wide grep-zero-hits — all pending. Attestation pass per DEPLOY-2026-09-30 priority sequence **step 3**. **Twin closes-together with `brain_1.7.eos-5.10`.**

**Ticket-specific follow-ups from deploy:**
- **Designed-behavior observation** (not a defect): boot log shows `critical event dropped, reason: retry_ttl_expired` — this IS the W2 tier-drain behavior per §9.PLU-4 (bounded capacity ceiling with metric). Not an error; contributes toward §9.PLU-4 evidence when captured formally.

---

## References

- **Umbrella cycle:** [`brain_2.7.eos-1.md`](brain_2.7.eos-1.md) — HUD hostile-defense; §6.A W2 row names plutus #42.
- **Sibling per-repo attestations (HUD cascade):** [`brain_2.7.eos-1.1.md`](brain_2.7.eos-1.1.md) (ares W3+W4) · [`brain_2.7.eos-1.2.md`](brain_2.7.eos-1.2.md) (hermes §11.5).
- **CLOSES-TOGETHER sibling (same PR):** [`brain_1.7.eos-5.10.md`](brain_1.7.eos-5.10.md) — attribution subledger + message-lifecycle metering scope of PR #42.
- **Plutus PR #42:** [`feat(plutus): consolidate attribution subledger (eos-5) + W2 ring buffer (hostile-universe-defense v2.3)`](https://github.com/olympus-616/plutus/pull/42)
- **HUD sealed design canon:** `olympus-grid/docs/hostile-universe-defense-design-v2.3-SEALED-2026-07-23.md`
- **Source reconciliation snapshot:** Steward direction 2026-09-25 (in session).
- **EOS operating manual:** [`../README.md`](../README.md)
- **Submodule Pointer Bump Discipline:** olympus-616 parent `CLAUDE.md`
