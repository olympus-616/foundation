# Void → omens manifestation — the platform reproducible from nothing, zero errors, zero warnings, forever

> File: `brain_1.7.eos-3.md`

| | |
|---|---|
| **Branch family** | `brain/1.7.x.x` |
| **Cycle ordinal** | `eos-3` (3rd on this branch family) |
| **Status** | `In Development` — direct-to-execution under single-Steward mode; agent already in flight on a fresh scratch org; staged kanban (01→02→03) deferred until republic-616 lights up the multi-party §5 vote |
| **Opened** | 2026-06-09 |
| **Closed** | — |
| **Prior cycle** | `brain_1.7.eos-2` (the Olympus-Grid command-plane truth loop — *"says what it does, does what it says: claim 1: athena-717 reachability"*) |
| **Theme** | Void → omens manifestation — the platform reproducible from nothing, zero errors, zero warnings, forever |
| **Feedback inputs** | EOS-2 §13.4 deferred gaps (G6.2 / G6.3 / G7 / G8 / G9 / G10) + EOS-2 §13.5 architectural seed (per-cluster `BrainVersion__c`) considered out-of-scope unless Steward widens |
| **Estimated effort** | TBD — locked when §10 is authored. Plausibly the largest cycle to date because the assertion is platform-wide. |
| **Actual effort** | — |

> **What EOS-3 is (continues the methodology threads, narrows the claim for execution):**
>
> EOS-1 proved a **surface-telemetry continual-improvement loop** — a human plays the game, the platform receives the telemetry, the next cycle is informed by it. That loop stays on, untouched, forever.
>
> EOS-2 proved the **cluster-creator dynamic-access claim** — a Salesforce admin spawns an AWS cluster from inside the managed package and talks to it end-to-end with zero out-of-band touch.
>
> **EOS-3 closes the from-nothing-to-iPhone-running-omens claim.** Stand up a brand-new olympus-grid node from scratch (today a Salesforce scratch org; requires Salesforce for now). Spawn an AWS cluster against it. Run **omens on an iPhone** against that cluster end-to-end. When EOS-3 closes, **anyone holding the source can repeat this cycle.**
>
> EOS-3 does **not** require the §1.1 zero-error / zero-warning gold standard on each component and process. Bugs against §1.1 are tracked and prioritized across future cycles, not gating EOS-3 closure. The §1.1 ideal is the **forever intent** of the platform; EOS-3 is one concrete slice that proves the path exists.
>
> **The EOS-1 → EOS-2 → EOS-3 → EOS-4 culmination** is: the olympus-grid node, the spawned olympus pantheon, the gpt language to access it, the omens game to utilize it, the iris portal to support it, the turtleshell-web and turtleshell-ios to demonstrate it — **fully backed, A to Z, for a sovereign AI system to run with or without the Steward**. EOS-4 (already scaffolded in `01_planning/`) carries the productionization half of that culmination: *how does EOS-3 safely arrive in production*.

---

# § Steward-authored (top half)

## §1 User story

### §1.1 The reproducible platform from the void (the FOREVER intent)

> As **the Steward — and eventually any dust dancer** I want **to stand up a brand-new olympus-grid node from scratch (today a Salesforce scratch org; tomorrow any host that can run `./build.sh`), watch it come to life, spawn AWS clusters against it, and have every client surface (omens, turtleshell-web, turtleshell-ios, iris portal, olympus-gpt) connect and run a real karmic cycle against it — with zero errors and zero warnings across the whole void→manifestation chain** so that **the platform proves it can be re-created from nothing, forever, by anyone holding the source, as a single reproducible command — and every surface inherits the EOS-1 continual-improvement telemetry loop and the EOS-2 cluster-creator dynamic-discovery contract by construction.**

**§1.1 is intent. Short of §1.1 is a bug.** If there is an error, if there is a warning, it is a bug — we will fix it, we will get to it, prioritization is across cycles. EOS-3 is one slice of §1.1's path; future cycles continue along it.

### §1.2 The EOS-3 slice (what we actually ship this cycle)

> As **the Steward** I want **to go from nothing → a live olympus-grid scratch org → a spawned AWS Pantheon cluster → omens running on an iPhone connected to that cluster end-to-end** so that **anyone holding the source can repeat this cycle**.

EOS-3 explicitly carves out turtleshell-web, turtleshell-ios (broadly), iris portal as a surface goal, and olympus-gpt — those are §1.1 surfaces and ride future cycles. **EOS-3 ships when the omens iPhone surface is alive on a freshly-provisioned cluster.**

> *Constraint:* the node form is Salesforce scratch org for now. Widening the node form to any-host is a future EOS — out of scope here.

## §2 Acceptance criteria

*Draft sketches matching the EOS-3 slice (§1.2). Each criterion includes the observable post-condition in the session log or Salesforce data. Steward refines; agent decomposes into §6 once locked.*

- **§2.1 Node from void.** **Given** a developer machine with the olympus-grid source checked out and no scratch org allocated **when** the Steward runs `./build.sh` from `olympus-grid/` root **then** within the §3 wall-clock budget a live olympus-grid scratch org exists, every canonical app (`Plugin.app_iris`, `Plugin.app_guardians`, `Plugin.app_olympus_gpt`, `Plugin.app_turtleshell`) is installed, the build exits with code 0, AND the session log carries `void.manifested.olympus_grid_node` with the new org's 18-char Id.

- **§2.2 Cluster from node.** **Given** a live node from §2.1 **when** the Steward spawns an AWS Pantheon cluster from inside the managed package (the EOS-2 mechanism) **then** a `Cluster__c` row exists with `Status__c='Live'`, the Pantheon image pulls cleanly, every health endpoint returns 200, AND the session log carries `cluster.manifested.ec2_pantheon` with the cluster's `ClusterName__c`.

- **§2.3 omens on iPhone against cluster.** **Given** a live cluster from §2.2 **when** the Steward opens omens on iPhone (deployed via `omens/tools/ios-deploy.sh`) targeted at that cluster's URL **then** the cosmos-logos handshake succeeds, MCP connects through Ares → Hermes → Athena, the player completes one karmic cycle (intent → state mutation → `LedgerEntry__c` → outcome), telemetry lands in `Feedback__c`, AND the EOS-1 surface-telemetry continual-improvement loop is active (`Feedback__c` row present with session-log attached).

- **§2.4 Repeatability.** **Given** EOS-3 is closed **when** any human holding the source repeats §2.1 → §2.3 on a fresh machine **then** the chain completes without Steward intervention. This is the *"anyone can repeat this cycle"* closure condition from §1.2.

> **Out of scope for EOS-3** (rides future cycles, NOT criteria here): turtleshell-web surface, turtleshell-ios surface (broadly — note iPhone is in scope ONLY as the omens runtime, not as the turtleshell-ios app), iris portal as a surface goal (iris's admin UI is the §2.2 mechanism, not the §2.3 surface claim), olympus-gpt surface, the §1.1 zero-error / zero-warning gold standard.
>
> **§1.1 deviations encountered during EOS-3 execution become bug entries**, logged inline in §13 and triaged into future cycles by priority. They do NOT gate this cycle.

## §3 Non-functional requirements

*Categories pre-stubbed for Steward to fill. Pre-stub note: every EOS-3 budget is a baseline; the cycle's value is partly that those budgets become baselines for future regression checks.*

- **Cycle latency budget** — wall-clock budget for `./build.sh` to "live node" (§2.1). Wall-clock budget for cluster spawn (§2.2). End-to-end wall-clock budget for void → first karmic cycle complete (§2.1 → §2.3).
- **Cost budget** — AWS spend per cluster spawn (relevant for dev iteration cadence). Scratch org allocation count per Steward / per dust dancer.
- **Observability** — every void → manifest action emits a `CycleId`-tagged log line traceable from client → server → Plutus ledger. `Cycle__c` row exists for the meta-cycle (the EOS-3 manifestation cycle itself) referenced by every nested action.
- **Compatibility** — cluster naming convention from EOS-2 (`api-int`, `api-prod`, etc.) preserved. cosmos-logos handshake protocol unchanged. Existing shipped surfaces (`brain/1.7.x.x` HEAD) remain functional during transition.
- **Privacy** — no PII in build logs. No secret material (private keys, OAuth tokens) ever logged.
- **Performance** — frame budgets on omens unchanged. iris portal initial paint ≤ N seconds. cluster spawn does not exceed N parallel AWS API calls (rate-limit hygiene).

## §4 Feedback inputs

This cycle is forward-looking (not feedback-driven from a specific play cycle), but it directly closes the deferred gaps from EOS-2's closeout:

| Source | Gap | Pattern |
|--------|-----|---------|
| EOS-2 §13.4 | **G6.2 / G6.3** — source-controlled cert files load-bearing for local dev boot | discover at boot, fail-loud on missing |
| EOS-2 §13.4 | **G7** — olympus-gpt `apiBase` hardcoded | discover from spawning org |
| EOS-2 §13.4 | **G8** — Ares CORS not sovereign-org-aware | discover allowed origins from cluster row |
| EOS-2 §13.4 | **G9** — omens client `AuthUrl` hardcoded (spec at `docs/handoff-omens-dynamic-cluster-discovery.md`) | discover from spawning org |
| EOS-2 §13.4 | **G10** — hermes `unmanaged` fix uncommitted | permanent hermes PR |
| EOS-2 §13.5 | **`Cluster__c.BrainVersion__c`** — per-cluster brain version pinning for mixed-version customer fleets | candidate; Steward decides if EOS-3 or EOS-4 |

The unifying primitive across all five EOS-2-deferred gaps: **discover state from the spawning org, cache at the consumer, fail-loud on missing.** EOS-3's §6 decomposition operationalizes that primitive as a platform-wide invariant.

## §5 Steward approval gate

- [ ] Story locked (§1)
- [ ] Criteria locked (§2)
- [ ] NFRs locked (§3)
- [ ] Approved to execute — signed: **{Steward initials}** **{date}**

> *Single-Steward mode.* Until republic-616 ships, §5 is a single Steward sign-off and the cycle proceeds directly within `04_in_development/`. When the multi-party vote lands, this checkbox becomes a vote record and the doc walks through `03_ready/` before entering `04_in_development/`.

---

# § Agent-authored (bottom half)

> **State of §6-§12 as of 2026-06-09:** *PENDING.* An agent is already in flight against a fresh scratch org doing the actual platform work that §10 will codify. The EOS agent will sync with that in-flight work and author §6-§12 inline once the §5 gate is ticked. The doc itself becomes the coordination layer between the EOS agent and the in-flight scratch-org agent.

## §6 Layer impact map

*PENDING. To be authored after §5 sign-off, in sync with the in-flight scratch-org agent.*

| Criterion | Salesforce (olympus-grid) | Pantheon services | omens (Godot) | turtleshell-web | iris portal | SDK / protocol |
|-----------|---------------------------|-------------------|---------------|-----------------|-------------|----------------|
| §2.1 | … | … | … | … | … | … |
| §2.2 | … | … | … | … | … | … |
| §2.3 | … | … | … | … | … | … |
| §2.4 | … | … | … | … | … | … |
| §2.5 | … | … | … | … | … | … |
| §2.6 | aggregator | aggregator | aggregator | aggregator | aggregator | aggregator |

## §7 Schema deltas

*PENDING. Anticipated candidates pulled from EOS-2 §13 forward-looking notes:*

- Possible new field `Cluster__c.BrainVersion__c` (per-cluster brain version pinning) — Steward to confirm whether in EOS-3 scope.
- Possible new `Node__c` SObject if "node" becomes a first-class entity distinct from a Salesforce org (e.g., when the node form expands beyond scratch orgs).
- `Cycle__c` row for the EOS-3 meta-cycle so the manifestation chain is traceable end-to-end.

## §8 Service contracts

*PENDING.* Anticipated touchpoints: every consumer's discovery handshake (omens, olympus-gpt, ares CORS, hermes managed-mode, local-dev cert lookup) replaces a hardcoded URL/cert with a fetch-from-spawning-org call. Wire shape to be drafted once the in-flight agent's pattern is read.

## §9 Telemetry assertions (the close-out gate)

*Draft assertions matching the EOS-3 slice (§1.2 / §2.1-§2.4) — refine after §6/§7/§8 are authored:*

- `void.manifested.olympus_grid_node` must fire once per `./build.sh` invocation against an empty starting state; payload carries new-org Id + wall-clock duration.
- `cluster.manifested.ec2_pantheon` must fire once per cluster spawn; payload carries `ClusterName__c` + duration.
- `surface.connected.omens_ios` must fire once when omens on iPhone successfully completes its cosmos-logos handshake against a freshly-spawned cluster.
- Every HTTP envelope across the void→manifest chain carries `cycleId` matching the EOS-3 meta-cycle row.
- Plutus ledger SOQL `SELECT * FROM LedgerEntry__c WHERE Cycle__c = :eos3_cycle_id` returns ≥ N rows for the N actions executed during verification.

> **NOT a gate** (§1.1 forever-intent, not EOS-3 closure): zero occurrences of severity `error|fatal|warn` across the chain. Any deviations encountered during verification become bug rows in §13 and seed future cycles.

## §10 Execution plan

*PENDING.* The in-flight scratch-org agent is already executing what §10 will record. The EOS agent will read that work, decompose it into ordered tasks with cross-layer dependencies, and inline it here. Until then, this section is the working contract between the EOS agent and the in-flight agent.

## §11 Verification protocol

*PENDING.* Anticipated:

### Without iPhone
- `./build.sh` from a clean clone → confirm §2.1
- iris admin UI flow → confirm §2.2
- turtleshell-web in Chromium → confirm §2.4
- iris portal in Chromium → confirm §2.5
- omens Godot desktop → partial §2.3

### With iPhone (required for §2.3 if turtleshell-ios is in scope)
- `omens/tools/ios-deploy.sh` → omens iPhone targeted at the new cluster

## §12 Rollback plan

*PENDING.* The cycle is platform-wide, so rollback is mostly per-layer: scratch org deletion is cheap, AWS cluster destroy via `zeus-destroy.yml` is documented, omens client revert is `git revert` clean. The risk surface is in the discover-from-spawning-org refactors — those will need per-PR rollback notes captured in §10 as tasks are decomposed.

## §13 Closeout

*Filled at end of cycle. Doc goes immutable after this.*

### What shipped
- …

### What deferred (and why)
- …

### What surprised
- …

### Verification evidence
- …

### §1.1 deviations observed during EOS-3 (the bug accumulator)

> Every error / warning surfaced during EOS-3 verification gets logged here as a §1.1-deviation bug row. Each row points to a future-cycle slot for triage. EOS-3 does NOT gate on this list — it gates on §2.1-§2.4 / §9.

| Bug | Where surfaced | Severity | Triage target | Notes |
|-----|----------------|----------|---------------|-------|
| … | … | … | EOS-? | … |

### Feedback that emerged from THIS cycle (seed for the next one)
- …

### Memory updates
- …

### Cycle close commit
- …
- Steward sign-off: **{Steward initials}** **{date}**
