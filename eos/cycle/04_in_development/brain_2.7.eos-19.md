---
pitch: "Open the agent — see every constellation, program every intention"
---

# I attest the olympus-grid operator opens the Aeon plugin at beta.olympus-grid.com/agent and sees every constellation, every star, and the kernel's state intact after any scratch rebuild + full olympus-grid redeploy, with zero manual re-entry.

> File: `brain_2.7.eos-19.md`
>
> **Opened:** 2026-10-13. Authored by Merlyn (advisor) as a handoff for alchemisthomer execution.
>
> **Authoritative handoff:** [`/docs/handoff-aeon-v1-processor.md`](../../../../docs/handoff-aeon-v1-processor.md) — the master spec (11 sections, every ruling applied, execution guidance, prototype + existing-plugin appendices).
>
> **Authoritative seed:** [`/docs/aeon-v1-seed.json`](../../../../docs/aeon-v1-seed.json) — the canonical JSON extract (6 constellations, 21 stars, operator-state) loaded into Hestia + Chronos on first boot.
>
> **Prototype reference (dies at migration):** `/.aeon-local/dashboard.html` — open locally for visual + behavioral reference; do not propagate.
>
> **Existing plugin (starting point for refactor):** `iris/reactforce/agent/src/plugins/aeon/` — ~1800-line single page, mock-backed, carries the six-lens contract + Concentric pattern. Refactor, don't rebuild.

| | |
|---|---|
| **Branch family** | `brain/2.7.x.x` |
| **Cycle ordinal** | `eos-19` (nineteenth primary on 2.7 family) |
| **Status** | `Executing — work observed in flight.` Promoted `00_backlog/` → `04_in_development/` on 2026-10-13 after Merlyn observed substantial Aeon-v1 execution on iris branch (iris PR #139 open since 2026-10-07, 5 recent commits on 2026-10-13). Formal §5 signature pending retro-ratification; execution authority confirmed by Steward (Aeon work shipped to olympus-grid). |
| **Opened** | 2026-10-13 (card authored) |
| **Promoted to in-development** | 2026-10-13 (upon observation of iris PR #139 + in-flight commits) |
| **Closed** | — |
| **Prior cycle** | `brain_2.7.eos-18` |
| **Theme** | Promote the local prototype into a production application running inside the iris agent plugin: constellations (Hestia entities) + stars (Chronos entities) + operator-state (Hestia) + Sky view + Calendar view + kernel strip — the primary interface for the olympus-grid operator. |
| **Feedback inputs** | 2026-10-13 Merlyn-authored handoff doc; prototype dashboard at `/.aeon-local/`; existing plugin audit at `iris/reactforce/agent/src/plugins/aeon/`; sibling-cycle overlap with EOS-16 (invoice-studio grid-export surface) and EOS-1 (HUD operator-dashboard shell); 2026-10-13 20:22–20:43 observed iris branch commits; iris PR #139 (open since 2026-10-07) |
| **Related PR** | **iris #139** — `feat(agent): ATH-001 prometheus + aeon dashboard rebuild on Proteus primitives` |
| **Estimated effort** | ~3–4 weeks wall-clock parallelized, ~5–6 weeks serial (per preliminary §1a recon in handoff Appendix D). Long pole: Hestia entity system (currently stub). |
| **Actual effort** | In flight — not yet accrued at closeout |

---

## 📍 In-flight observation (2026-10-13)

Merlyn observed via iris repo survey that Aeon v1 execution has been underway since **2026-10-07** on branch:

> `@alchemisthomer/neuralpathway/cd7308b-f669744-20261007062931-agent-ath001-prometheus-plugin-pair-mouth-wire-watchdog`
>
> **iris PR #139** — open since 2026-10-07T12:30:52Z — Steward-confirmed as the active vehicle for this work.

**Observed commits** (last 5, chronological, 2026-10-13 20:22–20:43):

| Commit | Message |
|---|---|
| `49504e6` | feat(agent): **aeon rung 2b** — neuron lens panel slide in right; dynamic tabs from Proteus lens shapes registry; Chronos attach/edit/detach wired through substrate (SF `ChronosLens__c` / localhost chronos lens); 'Discuss with Merlyn' stub button; Overview + Proteus tabs |
| `df03c99` | fix(agent): lens panel — attach button actually fires attach + refetches; lens tabs appear only after attachment; snap back to Overview on detach |
| `754f5cb` | feat(agent): proteus tab shows substrate-native row id — SF Record Id · NEUR-x · a0i… for sf-sobject, UUID for localhost |
| `3c92f9e` | feat(agent): hestia + aeon lens attach; generic `useLensMutation` hook replaces per-lens hooks; drops `useChronosLens`; dispatch table pattern — adding future lens types is one entry + one tab component |
| `7015802` | feat(agent): **aeon dashboard rebuild on Proteus primitives + /aeon-orig frozen clone** |

**What this tells us**:

- The six-lens contract (§5 of handoff) is being wired through Proteus-abstracted substrate — the original `useChronosLens` was replaced by a generic `useLensMutation` hook with a dispatch table pattern (preserves §4 "Aeon only knows grid primitives" ruling).
- The OLD aeon code has been preserved at `/aeon-orig` route as a frozen clone — rollback surface available until the new build attests.
- The "Discuss with Merlyn" stub button is already placed in the UI — operator-advisor integration surface scaffolded.
- Substrate neutrality is demonstrated: Proteus tab renders substrate-native row IDs differently for SF vs localhost adapters (SF Record Id for `sf-sobject`, UUID for localhost) — matches §4 "Aeon doesn't know what Salesforce is."
- Branch is in sync with origin (0 ahead, 0 behind) — work is pushed; iris PR #139 reflects the latest.

**Correlation with the plan**:

- Execution began 2026-10-07 (iris PR #139), ~6 days before the formal handoff + card were authored. The handoff is a retroactive formalization of in-progress direction; the card is a retroactive governance artifact.
- No conflict detected. Observed commits align with handoff §4 (grid primitives only), §5 (lens-owner API shape), §6 (vocabulary direction toward constellations/stars/intentions).
- Reconciliation action: on next session, formally sign §5 OR annotate the card as retroactively opened (currently reflects the latter).

---

---

# § Steward-authored (top half)

## §1 User story

> *Pre-drafted by Merlyn; Steward ratifies at §5.*

- §1.1 As the **olympus-grid operator** I want **one surface where I see every constellation, every star within it (tasks / events / intentions), and the kernel's current state (slots burning, dispatcher position, deadlines pending, core health)** so that **I can orient my attention and choose what to burn next without opening six different tools**.
- §1.2 As the **olympus-grid operator** I want **my operator-state (which constellation is in focus, which calendar mode I was in, where my cursor sat) preserved across every rebuild and redeploy** so that **the agent is a stable home, not a dev-cycle casualty**.
- §1.3 As the **sovereign of the grid** I want **Aeon to call only grid primitives (Chronos, Hestia, Proteus) and never know Salesforce exists** so that **the next storage migration (SF → Dynamo → anything) is a Proteus directive, not a developer operation**.

## §2 Acceptance criteria

- §2.1 **Given** a fresh scratch-org rebuild + full olympus-grid redeploy has just completed, **when** the Steward opens `https://beta.olympus-grid.com/agent` and navigates to Aeon, **then** he sees all 21 stars across 6 constellations from the seed artifact (`/docs/aeon-v1-seed.json`) intact, **and** operator-state (focus=navitus, calMode=week, calCursor=2026-10-13, pattern=concentric) matches the pre-rebuild snapshot, **and** the session log carries `aeon.boot` with `constellationCount=6` + `starCount=21`.
- §2.2 **Given** the Aeon plugin is loaded in the agent, **when** the Steward clicks any constellation chip or SVG stroke, **then** the Sky view's accent + the Calendar view's event filter + the Right Panel's star list all narrow to that constellation's data in one render pass, **and** the session log carries `aeon.focus.change` with `fromKey → toKey`.
- §2.3 **Given** the Steward opens the Chart Constellation modal and submits a new constellation, **when** the mutation completes, **then** the constellation appears in the Sky view at the next concentric altitude, the focus strip, and persists via `/v1/hestia/entities` (POST), **and** the session log carries `aeon.mutation.create.constellation` with the new key.
- §2.4 **Given** the Steward creates a star of each kind (task, event, intention), **when** he reloads the page, **then** all three appear under the correct constellation with correct kind-chip rendering, and (for events) at the correct chronos.when position in the Calendar view.
- §2.5 **Given** the full Aeon plugin surface, **when** a static grep over `iris/reactforce/agent/src/plugins/aeon/` runs, **then** zero occurrences of `ring`, `tier`, `workstream`, `program`, `Nervous system`, `AeonRing__mdt`, `AeonTask__c` remain in production code or UI strings (vocabulary audit — §6.1 of handoff is locked).
- §2.6 **Given** the Steward edits context on `pcm-001` (the Workday_Worker debug block), **when** he reloads, **then** the full context JSON (rootCause, workdayResponse, codePath, scopeCheck, fixOptions, caveats, sensitiveData) renders in its collapsible block exactly as persisted — cold-session recall works end-to-end.
- §2.7 **Given** the operator-state primitive (Hestia) persists focus / cal mode / cursor, **when** the Steward reloads the page, **then** he lands on the exact view he last had (no re-selection required).

## §3 Non-functional requirements

- **Cycle latency:** composite `GET /v1/aeon/neurons` serves full dashboard snapshot in **p50 ≤ 400 ms**, **p95 ≤ 800 ms** against cp-biz production load. Dashboard first-paint ≤ 1 s on a warm cache.
- **Cost budget:** no new SOQL hot-paths; composite endpoint is one query (Hestia constellations) + one query (Chronos stars) + one query (Hestia operator-state) per page load. No per-star N+1.
- **Compatibility:** the existing six-lens contract at `iris/reactforce/agent/src/plugins/aeon/src/state/contracts.ts` is preserved verbatim. The `DataSource` interface swap point stays intact — Phase 2+ (brain-read, Platform Events) continues to drop in without UI rewrite.
- **Observability:** every Aeon mutation carries `X-Cycle-ID` and resolves to a `LedgerEntry__c` row via Plutus (per EOS-14 event vocabulary). Session log signatures per §9.
- **Privacy:** operator-state is OwnerId-scoped (Steward-only in v1 per multi-tenant deferral); no leakage across users. Context payloads containing sensitive data (per `pcm-001.context.sensitiveData`) must never be transmitted outside the operator's session (no logs, no telemetry, no diagnostics include it).
- **Performance:** Sky view SVG renders ≤ 50 ring strokes without jank; Calendar Week view renders a 7×17 grid with 12-week recurrence expansion in a single paint; focus-switch re-render is incremental, never a full tree swap.
- **Backend-agnostic:** the Aeon plugin code contains zero references to Salesforce, SObjects, CMDT, Metadata API, or Site Guest Apex. All storage addressed through Hestia / Chronos / Proteus abstractions. Verification: static grep over the plugin directory.

## §4 Feedback inputs

| Source | Signal |
|---|---|
| 2026-10-13 Merlyn-authored handoff doc (`/docs/handoff-aeon-v1-processor.md`) | 11 sections, every ruling applied, cross-repo scope, acceptance URL defined |
| 2026-10-13 Prototype (`/.aeon-local/dashboard.html`) | Visual + behavioral reference; 21 stars across 6 constellations; two context blocks; mixed MST/local timezone data |
| 2026-10-13 Existing plugin audit (`iris/reactforce/agent/src/plugins/aeon/`) | Six-lens contract preserved; Concentric pattern present; mock-backed; vocabulary needs migration (ring→constellation, program→intention, workstream removal) |
| `04_in_development/brain_2.7.eos-16.md` (invoice-studio) §7.2 | Grid-platform export surface (React component library, Hermes bus client, ApiRoute framework, Plugin registry) — overlaps with Aeon plugin needs; coordination required |
| `04_in_development/brain_2.7.eos-1.md` (HUD) | Operator-dashboard shell concerns — Aeon may land as the interior lens of HUD, or beside it; alignment needed before §6 decomposition |
| `04_in_development/brain_2.7.eos-17.md` (Prometheus spawn) | Agent isolation model for spawned sessions; informs how Aeon interacts with per-session state (Phase 2+) |

## §5 Steward approval gate

Status: **retro-ratification pending.** Execution began 2026-10-07 (iris PR #139). Card promoted to `04_in_development/` on 2026-10-13 to reflect reality rather than block already-underway work. Steward confirmed the iris code shipped to olympus-grid.

- [⏳] Story locked (observed consistent in commit intent)
- [⏳] Criteria locked (observed `/aeon-orig` frozen as rollback surface — attests §2.1 state-preservation intent)
- [⏳] NFRs locked (observed Proteus-primitive routing — attests backend-agnostic NFR)
- [⏳] Vocabulary (§6.1 of handoff doc) locked (observed "lens" terminology survives from existing contracts; constellation/star rename status TBD by iris survey)
- [⏳] Rulings 10.1–10.11 (handoff §10) resolved OR explicitly deferred to §6 decomposition
- [⏳] Dependencies with EOS-16 / EOS-1 / EOS-17 reconciled (coordination plan agreed)
- [✓] §1a preliminary complete (handoff Appendix D); observed branch already proceeding on grid-primitive consumption (lens attach through substrate)
- [ ] Retro-ratification signed: **___** **___**

---

# § Agent-authored (bottom half)

> The handoff doc is the authoritative source for §6–§13 content. The sections below are pointers + the few assertions that must be concretely written here for §9 verification. Agents (alchemisthomer, chronos-agent, hestia-agent, hermes-agent, olympus-grid-agent, iris-agent) read the handoff for their respective slices.

## §6 Layer impact map

| Criterion | olympus-grid (Apex) | chronos | hestia | hermes | iris agent plugin | Proteus |
|-----------|---------------------|---------|--------|--------|-------------------|---------|
| §2.1 | Site Guest Apex handlers for `/v1/aeon/*` | Star entity shape (kind, when, endsAt, recurs, tz) | Constellation entity, operator-state entity, context payload | Composite BFF route `/v1/aeon/neurons`; dispatch route `/v1/aeon/dispatch`; pass-throughs to chronos/hestia | Replace `mockDataSource.ts` → live datasource; preserve six-lens contract + `DataSource` interface | Routes storage calls to cp-biz production backend; invisible to Aeon |
| §2.2 | — | Query filters by `constellationKey` | Query filters by entity type | Focus-filtered neuron list | Sky view accent + Calendar event filter + Right Panel narrow in one render | — |
| §2.3 | Metadata API or SObject writes depending on 10.1 ruling | — | Entity creation handler | POST `/v1/hestia/entities` wiring | Chart Constellation modal + optimistic UI | — |
| §2.4 | — | Star kind enum + validation | Context payload acceptance | POST `/v1/chronos/tasks` + context PUT | Add Star modal with kind selector; Calendar renders events immediately | — |
| §2.5 | — | — | — | — | Vocabulary migration pass (static grep gate) | — |
| §2.6 | — | — | Context payload persistence (JSON blob) | PUT `/v1/hestia/tasks/:id/context` | Collapsible context block in Right Panel | — |
| §2.7 | — | — | Operator-state upsert handler | PUT `/v1/hestia/operator-state` | Focus / cal mode / cursor hooks + load-restore | — |

## §7 Schema deltas

See handoff §4 (data model) + §5 (API surface) + §1a (readiness audit — PRE-REQUISITE for this section being concrete).

**Chronos** (if audit surfaces deltas):
- Star kinds: `task` / `event` / `intention`
- `when: datetime (nullable)` — Chronos-native
- `endsAt: datetime (nullable)`
- `recurs: enum('none','daily','weekdays','weekly')` — v1 scope; RRULE deferred to Phase 2
- `timezone: string` — UTC-in-store, tz-tag-for-display per ruling 10.5
- `constellationKey: string` — the structural tag linking a star to its constellation

**Hestia** (if audit surfaces deltas):
- Entity type `constellation` with fields: `key`, `name`, `color`, `locked`, `declared`, `position`, `role`
- Entity type `operator-state` keyed by OwnerId with fields: `focus`, `calMode`, `calCursor`, `pattern`
- Context payload (JSON blob) attachable to any Chronos star

## §8 Service contracts

See handoff §5. Composite reads at `/v1/aeon/*`. Lens-owner writes at `/v1/chronos/*` + `/v1/hestia/*`. The one Aeon-owned write is `/v1/aeon/dispatch` for state + queue operations.

## §9 Telemetry assertions (the close-out gate)

Concrete signatures that MUST appear in production telemetry for this cycle to close.

**On mount / boot:**
- `Events.aeon.boot` with `{constellationCount: 6, starCount: 21, focus: "navitus", pattern: "concentric"}` must fire within 2 s of the Aeon route loading post-rebuild. Steward opens the URL → event fires → §2.1 satisfied.

**On focus change:**
- `Events.aeon.focus.change` with `{fromKey, toKey}` on every chip click, SVG click, or arrow-key cycle. Zero re-renders without this event. §2.2 trace.

**On mutation (any kind):**
- `Events.aeon.mutation.create.constellation` on Chart Constellation submit.
- `Events.aeon.mutation.edit.constellation` on Rename submit.
- `Events.aeon.mutation.delete.constellation` on Dissolve.
- `Events.aeon.mutation.create.star` with `{kind: task|event|intention}` on Add Star submit.
- `Events.aeon.mutation.edit.star` on any field edit (identity, time, context).
- `Events.aeon.mutation.delete.star` on delete.
- Each mutation emits a corresponding Plutus `LedgerEntry__c` row with full trace per EOS-13 widening (`cycleId`, `jwtSub`, `apiKey`, `requestId`, `appKey`) and `EventType__c` matching the event signature. §2.3, §2.4, §2.6 trace.

**On operator-state save:**
- `Events.aeon.operatorstate.persist` on debounced autosave of focus / cal mode / cursor. §2.7 trace.

**On rebuild acceptance:**
- Pre-rebuild snapshot: `Events.aeon.state.snapshot` fires with a stable hash of (constellation count + star IDs + operator-state).
- Post-rebuild snapshot: `Events.aeon.state.snapshot` fires with the identical hash.
- Zero divergence → §2.1 satisfied end-to-end.

**Vocabulary audit (static — not runtime):**
- Zero occurrences of `/ring\b|/tier\b|/workstream\b|/program\b|/Nervous system|AeonRing__mdt|AeonTask__c` in `iris/reactforce/agent/src/plugins/aeon/` under production build output. CI-enforced grep. §2.5 trace.

**Backend-agnostic audit (static):**
- Zero occurrences of `Salesforce`, `SObject`, `CMDT`, `Metadata API`, `Site Guest`, `AeonRing__mdt`, `AeonTask__c` in Aeon plugin source. CI-enforced grep. NFR trace.

## §10 Execution plan

See handoff §8 — 12 ordered deliverables **1a** through **1l**. Reproduced here as a pointer:

1. **1a** — Grid primitive readiness audit · *Preliminary Merlyn-mode recon filed as Appendix D of handoff. Verdict: **Chronos NEEDS MEDIUM additions**, **Hestia BLOCKING** (stub — build entity system from scratch), **Proteus ASPIRATIONAL** (Chronos/Hestia not yet wired; storage-swap capability is Phase 2). ✓ **Observed on iris PR #139: grid-primitive consumption already underway via lens attach through substrate (SF `ChronosLens__c` / localhost chronos lens).**
2. **1b** — Grid schema extensions (if any)
3. **1c** — Aeon API surface (composite reads + dispatch + pass-throughs)
4. **1d** — Datasource swap in existing plugin (mock → live)
5. **1e** — Vocabulary migration
6. **1f** — Sky view (merge TierDiagram + prototype's concentric SVG)
7. **1g** — Calendar view (4 perspectives, now-line, recurrence expansion)
8. **1h** — Right panel + context collapsibles
9. **1i** — Star CRUD modals (form-based; no composer in MVP)
10. **1j** — Operator state persistence
11. **1k** — Kernel strip (slots, dispatcher, pass, core health)
12. **1l** — Rebuild/refresh acceptance test → MVP COMPLETE

Dependencies: 1b blocks until 1a lists deltas; 1c blocks on 1b; 1d blocks on 1c; 1e–1k parallelize once 1d lands.

**Observed execution status (iris PR #139 as of 2026-10-13)**:

- **1a** ✓ preliminary complete (Merlyn Appendix D); formal re-run deferred to closeout evidence
- **1b** ⏳ in flight — observed `ChronosLens__c` SObject + localhost chronos lens adapters; Hestia entity system progress unknown from iris-side alone (needs chronos/hestia repo survey next)
- **1c** ⏳ partial — observed `useLensMutation` hook with dispatch table pattern suggests API layer in progress
- **1d** ✓ observed — datasource is actively consuming substrate-neutral lens APIs (Proteus tab renders substrate-native row IDs)
- **1e** ⏳ partial — vocabulary pass pending (observed "lens" survives; constellation/star rename TBD)
- **1f** ⏳ in flight — aeon dashboard rebuilt on Proteus primitives (commit `7015802`); Sky-view parity with prototype TBD
- **1g** ⏳ unknown — Calendar view port status not surfaced in observed commits
- **1h** ⏳ in flight — neuron lens panel slide-in observed (`49504e6`); context collapsibles TBD
- **1i** ⏳ in flight — attach/edit/detach wired for Chronos; constellation CRUD modals TBD
- **1j** ⏳ unknown — operator-state persistence not surfaced
- **1k** ⏳ unknown — kernel strip (slots/dispatcher/core-health) status not surfaced
- **1l** ⏳ gated — acceptance test awaits visible completion of 1e–1k

## §11 Verification protocol

### Without special environment

1. `curl` the composite `GET /v1/aeon/neurons` against cp-biz with the Steward's auth; verify shape per §5 of handoff.
2. `curl` `POST /v1/hestia/entities` to create a test constellation; verify it appears via subsequent GET.
3. `curl` `POST /v1/chronos/tasks` with each kind (task, event, intention); verify kinds persist.
4. Load `https://beta.olympus-grid.com/agent` → navigate to Aeon → inspect network tab for the composite neuron fetch and the operator-state fetch.
5. Static-grep audit per §9 vocabulary + backend-agnostic assertions.

### Acceptance test (§1l of handoff)

1. Snapshot current state via `/v1/aeon/stream` or SOQL dump; stash the hash.
2. Teardown scratch org used for integration smoke.
3. Rebuild scratch; redeploy olympus-grid.
4. (Does NOT affect cp-biz prod — this test proves the Aeon surface against prod is unaffected by scratch churn, which is the actual MVP bar.)
5. Reload `https://beta.olympus-grid.com/agent` → Aeon → compare state hash. Match → §2.1 satisfied.

## §12 Rollback plan

- **Feature flag** on the Aeon plugin route (`/aeon`). If any §9 assertion fails post-deploy, flip the flag → route falls back to the existing mock-backed plugin (pre-datasource-swap state). Rollback = config change, no code revert.
- **Grid schema changes** (if §1b deployed) are additive-only (new fields, new entity types, new recurrence values); none drop existing data. Rollback leaves fields in place; UI simply stops reading them.
- **Hermes routes**: pass-throughs can revert cleanly (new routes removed; existing chronos/hestia routes unchanged).
- **Operator-state regression**: if operator-state corruption is suspected, revert by clearing the operator-state entity for the Steward's OwnerId; Aeon re-initializes defaults (focus=null, calMode=week, pattern=concentric).

## §13 Closeout

> Filled at end of cycle. Doc goes immutable on move to `06_shipped/`.

### What shipped
> —

### What deferred (and why)
> See handoff §9 (Deferred Phase 2+) for the pre-known deferral list: composer, intention runner, pattern plug-ins, trust decay, notifications, RRULE, overlapping event layout, attestation evidence, FlexQueue integration, Platform Events, multi-tenant, multi-store resilience.

### What surprised
> —

### Verification evidence
> Session-log excerpts proving each §9 signature fired. SOQL / API proof of §2.1 state-hash equivalence pre/post rebuild. Static-grep audit output showing zero vocabulary violations.

### Feedback that emerged from THIS cycle (seed for the next one)
> —

### Memory updates
> Expected: feedback memory on "Aeon lives in agent plugin; capstone user of grid; never knows storage"; project memory on "Aeon v1 production ships at beta.olympus-grid.com/agent"; reference memory on handoff doc location.

### Cycle close commit
> Branch / PR link: —
> Steward sign-off: **___** **___**

---

## Observation log

| Date | Event |
|---|---|
| 2026-10-07 | iris PR #139 opened by alchemisthomer — Aeon v1 execution begins |
| 2026-10-13 | Card authored in `00_backlog/`. Full §1–§13 pre-drafted from Merlyn handoff |
| 2026-10-13 | Preliminary §1a reconnaissance filed as handoff Appendix D |
| 2026-10-13 | Prototype durable copy stored at `docs/aeon-v1-prototype-dashboard.html` for alchemisthomer port reference |
| 2026-10-13 | Observed in-flight execution on iris PR #139 — 5 commits on 2026-10-13 show aeon rebuild on Proteus primitives, lens-attach substrate neutrality, `/aeon-orig` rollback surface. Card promoted `00_backlog/` → `04_in_development/` |
| 2026-10-13 | Steward confirmed iris code shipped to olympus-grid |

## Cross-reference notes for sibling cycles

**Not editing those cards from here** (owned by their respective agents in flight) — these are recommendations for alchemisthomer / card owners to apply:

- **`brain_2.7.eos-16.md` (invoice-studio) §7.2** — grid platform export surface (React component library, Hermes bus client, ApiRoute framework, Plugin registry) overlaps with Aeon v1 needs. Suggest cross-link: "This cycle's platform exports also serve as foundation for EOS-19 (Aeon v1 processor); coordinate deliverable order so Aeon doesn't rebuild wheels invoice-studio already ships."

- **`brain_2.7.eos-1.md` (HUD)** — if HUD is the operator-dashboard shell, Aeon may land as its interior lens (one route inside HUD) or as a sibling route. Alignment required before EOS-19 §6 decomposition can commit to a layout. Suggest cross-link: "HUD and Aeon converge at the operator surface; EOS-19 depends on this card's shell decisions."

- **`brain_2.7.eos-17.md` (Prometheus spawn)** — agent isolation model for spawned sessions. If Aeon state needs to be per-session (future), EOS-17's isolation primitives are the base. Suggest cross-link: "Phase 2+ Aeon multi-session support depends on this card's spawn-isolation model."

- **`brain_2.7.eos-14.md` (Plutus event vocabulary)** — EOS-19's §9 asserts `aeon.*` event signatures. Ensure the `aeon.*` family (boot, focus.change, mutation.*, operatorstate.persist, state.snapshot, dispatch.*) is included in EOS-14's additive enum expansion, or declared out-of-scope with a separate narrow extension in EOS-19 itself.
