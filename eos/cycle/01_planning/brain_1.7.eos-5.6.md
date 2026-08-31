# Durable shell balance — every user's sea-shell balance is correct, atomic, and observable on Identity and Profile

| | |
|---|---|
| **Branch family** | `brain/1.7.x.x` |
| **Cycle ordinal** | `eos-5.6` (sixth sub-attestation of EOS-5) |
| **Status** | `Draft` — awaiting Steward §1-§5 authoring/ratification |
| **Opened** | 2026-07-09 (observation surfaced during frozen EOS-5 development; captured as sub-attestation) |
| **Closed** | — |
| **Prior cycle** | `brain_1.7.eos-5` (umbrella, frozen) — sibling sub-attestations `brain_1.7.eos-5.1` (globally deployable), `brain_1.7.eos-5.2` (guest-access lockdown), `brain_1.7.eos-5.3` (tithe integrity), `brain_1.7.eos-5.4` (substrate-choice sovereignty), `brain_1.7.eos-5.5` (sealed-credential sovereignty, in-development) |
| **Theme** | Every user's sea-shell balance is durably, correctly, and atomically tracked in olympus-grid — observable via both Identity and Profile — with no divergence between UI-displayed value, SF-persisted value, and Plutus-ledger-implied value |
| **Feedback inputs** | Steward observation dictated 2026-07-09; supersedes-and-upgrades `eos-5b-triage.md` GAP-86 (previously "non-blocker, log-only") |
| **Estimated effort** | TBD (post-§5 decomposition) |
| **Actual effort** | — |

**Cross-reference to GAP-86 in triage** (`eos-5b-triage.md` line 5590): GAP-86 was authored under the empirical belief that the "1,000 sea shells starting balance" + "0 shells given to Education & Literacy" UI counter had no SF-side substrate — the schema search reported "only false-positive matches on TurtleshellProfile pattern." The reality is that `TurtleshellProfile__c.ShellBalance__c` (Integer, `trackHistory=true`, default 0) and `TurtleshellProfile__c.ShellsGiven__c` (Decimal scale 4, `trackHistory=true`) DO exist and ARE the source-of-truth per the comment in `ApiRouteTurtleshellBilling.cls:11`. GAP-86's "no substrate exists" framing is factually wrong; the correct framing (this cycle's claim) is that the substrate exists but is not durably maintained across all mutation paths, and there is no mirror on `Identity__c`. GAP-86 is subsumed by this sub-attestation and re-scoped from non-blocker to critical component of EOS-5.

**Cross-reference to sibling cycles**:
- EOS-5.3 (tithe integrity, planning) is the *disbursement* side: 7% of net settlement writes a tithe row to a Cause. This cycle (5.6) is the *accumulation and consumption* side: the balance from which shells are metered and against which app-owner shell-consumption events resolve. Both must hold for the full ledger loop.
- The `LedgerEntry__c.ShellId__c` field suggests per-shell ID granularity in the ledger; whether the balance-on-Profile should be a materialized aggregate of ledger rows OR the source-of-truth-with-ledger-as-audit is a §7/§8 design decision (Agent-authored, post-§5).

---

# § Steward-authored (top half)

## Canonical attestation statement (working — refine before §5 lock)

> *"I attest that every user's sea-shell balance is durably tracked in olympus-grid — the value shown in the UI, the value persisted on the user's Identity/Profile records, and the value implied by the sum of Plutus ledger rows all agree at all times. Balance mutations are atomic (no lost debits, no double-spends, no race-window drift under concurrent consumption). Balance survives every durability boundary the system claims — restart, scratch org rotation, cluster destroy-and-rebuild, managed-package version bump. Balance is observable from both Identity__c and TurtleshellProfile__c (whichever record class an API caller starts from), and the two views are provably-equal at every read moment."*
>
> — Steward, 2026-07-09 (working; refine before §5 lock)

## §1 User story

- §1.1 As a **dust dancer paying with sea shells** I want my **balance to be correct at every moment I check it** so that **I can trust the number I see in the UI and plan my consumption against it**.
- §1.2 As a **dust dancer** I want my **balance to survive every operational event the platform performs on my behalf** — scratch org rotations, cluster destroys/rebuilds, managed-package upgrades, service restarts — so that **shells I earned or purchased cannot silently disappear because of an internal maintenance event**.
- §1.3 As an **app owner metering platform-feature consumption** I want to **debit a user's shell balance atomically** so that **concurrent requests from the same user cannot each observe "sufficient balance" and both succeed when only one should**.
- §1.4 As a **caller of the olympus-grid API** I want to **read the balance from either Identity__c or TurtleshellProfile__c and get the same answer**, so that **API surfaces do not have to know which record class is the "real" substrate**.
- §1.5 As the **platform** I want **balance to be reconcilable end-to-end** — UI-displayed value ↔ Profile-persisted value ↔ Identity-persisted value ↔ sum of Plutus ledger rows for that user — so that **no reconciliation ambiguity can hide a lost shell or a phantom shell**.

## §2 Acceptance criteria

Each criterion observable end-to-end; adversarial (double-spend, race, restart) cases required.

**§2.1 — UI ↔ SF parity at every read moment (from §1.1)**
- **Given** a user, **when** any surface (turtleshell-web · turtleshell-ios · iris portal · omens) reads their balance, **then** the returned integer equals `TurtleshellProfile__c.ShellBalance__c` at read time (accounting for the atomic-debit lock window). No client-side stale caching across a debit/credit event.

**§2.2 — Durability across operational boundaries (from §1.2)**
- **Given** a user with balance N, **when** the platform undergoes a scratch-org rebuild (`build.sh` destructive), a cluster destroy/rebuild, a Pantheon container restart, or a managed-package version bump, **then** balance N is preserved OR (if the operation intentionally invalidates SF-side data) the user is notified before the operation and their balance is restorable from Plutus ledger history.
- **Note:** current `build.sh` behavior deletes the scratch entirely. This criterion may need to distinguish between "developer scratch loss (acceptable if reproducible from ledger)" vs "production data loss (unacceptable)." Steward to refine before §5 lock.

**§2.3 — Atomic debit under concurrency (from §1.3)**
- **Given** a user with balance N and two concurrent shell-consumption requests each requiring K shells (N ≥ K but N < 2K), **when** both requests race, **then** exactly one succeeds and one fails-with-insufficient-balance. No path exists where both succeed. Verified by concurrent-load test against `ApiRouteTurtleshellBilling.cls` debit endpoint.
- **Given** the atomic-debit path in `ApiRouteTurtleshellBilling.cls` uses `FOR UPDATE`, verify this is the ONLY mutation path — any other write path to `ShellBalance__c` must be identified and either routed through the atomic path or documented as a controlled-admin-only path with its own lock discipline.

**§2.4 — Identity ↔ Profile parity (from §1.4)**
- **Given** a user with an Identity__c record and a TurtleshellProfile__c record, **when** an API caller reads balance from either record class, **then** the two return the same integer. This requires either (a) mirror the balance onto Identity__c with a trigger keeping the two in sync, or (b) expose a formula/lookup on Identity that projects Profile.ShellBalance__c, or (c) canonicalize on ONE record class and document the API surface to read only from that one. §7/§8 design decision.

**§2.5 — Ledger reconcilability (from §1.5)**
- **Given** a user, **when** the sum of `LedgerEntry__c` rows where `SubjectIdentity__c = <user>` and `EventType__c` in the shell-affecting set is computed, **then** the result equals `TurtleshellProfile__c.ShellBalance__c` (adjusted for starting bonus + any admin credits). Any divergence emits `ledger.balance_divergence` telemetry with the delta.
- Reconciliation-check runs as scheduled Orion job (frequency TBD, likely nightly at low ceremony + on-demand from admin surface).

**§2.6 — No silent balance mutations**
- Every mutation of `ShellBalance__c` produces a corresponding `LedgerEntry__c` row that records the delta, cause, and cycle. Direct-DML writes to `ShellBalance__c` from anywhere other than the atomic debit/credit paths must fail (either enforced by validation rule, trigger guard, or code review discipline). Adversarial verification: attempt to write via anonymous Apex outside the sanctioned path → expected fail.

**§2.7 — Balance visible on both records at admin surfaces**
- **Given** an admin viewing an Identity__c page, **when** they view the record, **then** ShellBalance is visible on the layout. Same for TurtleshellProfile__c page. No "hidden substrate" — the durable value is visible in both admin contexts.

## §3 Non-functional requirements

- **Correctness > performance.** If the atomic-debit path adds latency, that is acceptable. Balance drift is not.
- **Auditability.** Every mutation is a ledger row with `Cycle__c` FK. Karmic accounting at the cycle level (patent claim 3) requires this.
- **No client-side truth.** The UI never *asserts* the balance — it only *displays* the server-authoritative value. Client-side optimistic UI is permitted for latency (show pending-debit spinner) but must reconcile against server response before persisting.
- **Backfill safety.** If `Identity__c.ShellBalance__c` mirror is added (per §2.4 option a), the migration from "Profile-only" to "Identity-and-Profile" must not race with active users. Design assumes a maintenance window OR a lockstep-mirror trigger from cycle start.
- **Testability.** Concurrent-debit race test must be runnable as an Apex integration test + as an external HTTP load-test hitting the API.
- **Observability.** Reconciliation-check emits both success (`ledger.balance_reconciled: OK`) and divergence (`ledger.balance_divergence`) events; success is not silent (silent-happy-path is a §9 anti-pattern per GAP-45 lesson).

## §4 Feedback inputs

- Steward observation dictated 2026-07-09 — verbatim: *"it was observed in development during eos-5 that the users balance of sea shells is not properly tracked durably in olympus-grid on the identity or the profile. this is a critical component of eos-5 that will need to be fixed"*
- `eos-5b-triage.md` GAP-86 (subsumed and re-scoped by this cycle from non-blocker to critical component)
- Empirical evidence base (Agent-side schema survey 2026-07-09):
  - `olympus-grid/force-app/turtleshell/default/objects/TurtleshellProfile__c/fields/ShellBalance__c.field-meta.xml` — Integer, `trackHistory=true`, default 0
  - `olympus-grid/force-app/turtleshell/default/objects/TurtleshellProfile__c/fields/ShellsGiven__c.field-meta.xml` — Decimal scale 4, `trackHistory=true`, default 0
  - `olympus-grid/force-app/ledger/default/objects/LedgerEntry__c/fields/ShellId__c.field-meta.xml` — per-shell ID in ledger
  - `olympus-grid/force-app/turtleshell/default/classes/ApiRouteTurtleshellBilling.cls:11` — source-of-truth comment naming `TurtleshellProfile__c.ShellBalance__c`
  - `olympus-grid/force-app/turtleshell/default/classes/ApiRouteTurtleshellBilling.cls:210-215` — `FOR UPDATE` atomic-debit path
  - `olympus-grid/force-app/turtleshell/default/classes/ApiRouteTurtleshellProfile.cls:205-215` — `SIGNUP_BONUS_SHELLS` signup path
  - **NEGATIVE finding:** no `ShellBalance__c` field on `Identity__c`. All balance persistence today is Profile-only.

## §5 Steward approval gate

- [ ] Canonical attestation statement locked
- [ ] §2.2 durability boundary refined — scratch-loss vs prod-loss distinction confirmed
- [ ] §2.4 Identity ↔ Profile parity mechanism chosen (mirror-trigger · formula-lookup · single-record canon)
- [ ] Story locked (§1.1 - §1.5)
- [ ] Acceptance criteria locked (§2.1 - §2.7)
- [ ] NFRs locked (§3)
- [ ] Approved to execute — signed: **__________** **__________**

---

# § Agent-authored (bottom half) — DEFERRED

§6 through §13 authored by the EOS agent AFTER Steward ratifies §5. Per operating manual (`foundation/eos/cycle/README.md`), the §5 gate is non-negotiable — the agent does NOT decompose into layer impact, schema deltas, service contracts, telemetry assertions, execution plan, verification protocol, rollback plan, or closeout until the Steward locks the top half.

**Candidate decomposition seeds** (Steward to review post-§5, not commitments):

- §7 schema deltas — likely candidate: `Identity__c.ShellBalance__c` (formula OR real field with sync trigger from Profile). Ledger event-type additions for `ledger.balance_reconciled` + `ledger.balance_divergence`. Validation rule / trigger guard on ShellBalance__c to prevent unsanctioned direct-DML.
- §9 telemetry assertions — reconciliation event emit on every scheduled check; `ledger.balance_divergence` alert routing to Steward + on-call admin.
- §10 execution plan — Phase 1: audit all `ShellBalance__c` write paths in olympus-grid Apex (survey turned up billing + profile-creation; check for any anon-Apex admin utilities, batch classes, or triggers). Phase 2: enforce single mutation path via trigger guard. Phase 3: Identity mirror (mechanism chosen in §5). Phase 4: reconciliation job. Phase 5: adversarial concurrent-debit + restart-durability tests.
- §11 verification protocol — concurrent-load test against billing endpoint; scratch-org destroy-and-restore test; ledger-sum-vs-Profile-value SOQL check; anon-Apex direct-write attempt (expected fail).
- §12 rollback plan — this cycle is on the critical path for revenue; rollback of the atomic-debit lock is dangerous (would open race windows). Rollback strategy: if new discipline breaks a legitimate mutation path, add that path to the sanctioned list rather than remove the guard.
