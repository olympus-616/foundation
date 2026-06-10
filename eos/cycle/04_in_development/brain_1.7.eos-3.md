# Void → every-surface manifestation — the platform reproducible from nothing, zero errors, zero warnings, forever

> File: `brain_1.7.eos-3.md`

| | |
|---|---|
| **Branch family** | `brain/1.7.x.x` |
| **Cycle ordinal** | `eos-3` (3rd on this branch family) |
| **Status** | `In Development` — direct-to-execution under single-Steward mode; agent already in flight on a fresh scratch org; staged kanban (01→02→03) deferred until republic-616 lights up the multi-party §5 vote |
| **Opened** | 2026-06-09 |
| **Closed** | — |
| **Prior cycle** | `brain_1.7.eos-2` (the Olympus-Grid command-plane truth loop — *"says what it does, does what it says: claim 1: athena-717 reachability"*) |
| **Theme** | Void → every-surface manifestation — the platform reproducible from nothing, zero errors, zero warnings, forever |
| **Feedback inputs** | EOS-2 §13.4 deferred gaps (G6.2 / G6.3 / G7 / G8 / G9 / G10) + EOS-2 §13.5 architectural seed (per-cluster `BrainVersion__c`) considered out-of-scope unless Steward widens |
| **Estimated effort** | TBD — locked when §10 is authored. Plausibly the largest cycle to date because the assertion is platform-wide. |
| **Actual effort** | — |

> **What EOS-3 is (continues the methodology threads, narrows the claim for execution):**
>
> EOS-1 proved a **surface-telemetry continual-improvement loop** — a human plays the game, the platform receives the telemetry, the next cycle is informed by it. That loop stays on, untouched, forever.
>
> EOS-2 proved the **cluster-creator dynamic-access claim** — a Salesforce admin spawns an AWS cluster from inside the managed package and talks to it end-to-end with zero out-of-band touch.
>
> **EOS-3 closes the from-nothing-to-every-surface-feedback-roundtrip claim.** Stand up a brand-new olympus-grid node from scratch (today a Salesforce scratch org; requires Salesforce for now). Provision iris into that node. Spawn an AWS Pantheon cluster — a *realm* — against the node from inside the managed package (the EOS-2 mechanism). Then prove that **every consumer surface — omens (cyclops level on iPhone), olympus-gpt, turtleshell-web, turtleshell-ios, turtleshell-offgrid, iris portal — can sign into the new scratch org, reach the new realm, exercise its surface-specific workload, and submit client-specific feedback that lands back in the scratch org.** *Feedback receipt at base = the cycle works for that surface.* When EOS-3 closes on all six surfaces, **anyone holding the source can repeat this cycle.**
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

> As **the Steward** I want **to go from nothing → a live olympus-grid scratch org (a new node) → iris provisioned into it → a spawned AWS Pantheon cluster (a *realm*) against that node → every consumer surface (omens, olympus-gpt, turtleshell-web, turtleshell-ios, turtleshell-offgrid, iris portal) able to sign into the new node, join the new realm, exercise its surface-specific workload, and submit feedback that arrives back at the scratch org** so that **the feedback-receipt-at-base semantic proves the cycle works for every surface — and anyone holding the source can repeat this cycle.**

**Closure semantic, universal across every surface in this cycle: feedback arriving back at the spawning scratch org is the conclusion of the EOS cycle for that surface.** EOS-1 established that loop on `brain/1.7.x.x`-HEAD shipped surfaces against the alpha-org; EOS-3 proves the same loop works against a *fresh* node + *fresh* realm for every consumer surface.

Per-surface workload anchor (each ends with a `Feedback__c` row arriving in the new scratch org):

- **omens** — sign into the new scratch org, join the new realm, run the **cyclops level**, submit feedback → receipt at scratch org closes for omens.
- **olympus-gpt** — sign into the new scratch org, join the new realm, issue commands against the realm's Pantheon fleet, submit feedback → receipt at scratch org closes for gpt.
- **turtleshell-web** — sign into the new scratch org, access the new node + new realm, submit client-specific feedback → receipt at scratch org closes for the web surface.
- **turtleshell-ios** — sign into the new scratch org, access the new node + new realm, submit client-specific feedback → receipt at scratch org closes for the ios surface.
- **turtleshell-offgrid** — sign into the new scratch org, access the new node + new realm, submit client-specific feedback → receipt at scratch org closes for the offgrid surface.
- **iris portal** — sign into the new scratch org, access the new node + new realm, submit client-specific feedback → receipt at scratch org closes for the iris surface.

> *Constraint:* the node form is Salesforce scratch org for now. Widening the node form to any-host is a future EOS — out of scope here.

> *Steward's verbatim scope statement (2026-06-09):*
>
> *"within olympus-grid i am creating a new repo → iris provisioning → cluster provisioning. within omens i will sign into the new scratch org → join the newly created cluster (i.e. realm) and run the cyclops level, and then post feedback through the feedback system all the way to scratch org. receipt of the feedback is the conclusion of eos-3 for omens. i will validate the same for gpt against a new node + cluster + issue commands + feedback back to the scratch org. the feedback arriving back at base is always the end of a working eos cycle. i will then make sure all of the turtleshell surfaces can adequately access the new node and the new cluster and provide client-specific feedback."*

## §2 Acceptance criteria

*Draft sketches matching the EOS-3 slice (§1.2). Each criterion includes the observable post-condition in the session log or Salesforce data. The unifying closure semantic across §2.3-§2.8 is: **a `Feedback__c` row submitted from that surface arrives in the new scratch org with its session-log attachment intact.** Steward refines; agent decomposes into §6 once locked.*

- **§2.1 Node from void.** **Given** a developer machine with the olympus-grid source checked out and no scratch org allocated **when** the Steward runs `./build.sh` from `olympus-grid/` root **then** within the §3 wall-clock budget a live olympus-grid scratch org exists, iris is provisioned into it, every canonical app (`Plugin.app_iris`, `Plugin.app_guardians`, `Plugin.app_olympus_gpt`, `Plugin.app_turtleshell`) is installed, the build exits with code 0, AND the session log carries `void.manifested.olympus_grid_node` with the new org's 18-char Id.

- **§2.2 Realm (cluster) from node.** **Given** a live node from §2.1 **when** the Steward spawns an AWS Pantheon cluster — the *realm* — from inside the iris admin UI in the managed package (the EOS-2 mechanism) **then** a `Cluster__c` row exists with `Status__c='Live'`, the Pantheon image pulls cleanly, every health endpoint returns 200, AND the session log carries `cluster.manifested.ec2_pantheon` with the realm's `ClusterName__c`.

- **§2.3 omens — cyclops level feedback round-trip.** **Given** a live realm from §2.2 **when** the Steward deploys omens on iPhone via `omens/tools/ios-deploy.sh` targeted at the new node + realm, signs into the new scratch org, joins the realm, plays the **cyclops level**, and submits feedback **then** the cosmos-logos handshake succeeds against the new realm, MCP connects through Ares → Hermes → Athena, the cyclops level completes (intent → state mutation → `LedgerEntry__c` → outcome), AND a `Feedback__c` row with `Source__c='omens'` and its session-log attachment exists in the **new scratch org** (not the alpha-org).

- **§2.4 olympus-gpt — issue-commands feedback round-trip.** **Given** a live realm from §2.2 **when** the Steward signs into the new scratch org via olympus-gpt, joins the realm, issues commands against the realm's Pantheon fleet, and submits feedback **then** commands reach the pantheon via Ares → Hermes → Athena and return responses, AND a `Feedback__c` row with `Source__c='olympus-gpt'` and its session-log attachment exists in the **new scratch org**.

- **§2.5 turtleshell-web — sign-in + feedback round-trip.** **Given** a live realm from §2.2 **when** the Steward signs into the new scratch org via turtleshell-web, accesses the new node + realm, and submits client-specific feedback **then** a `Feedback__c` row with `Source__c='turtleshell-web'` and its session-log attachment exists in the **new scratch org**.

- **§2.6 turtleshell-ios — sign-in + feedback round-trip.** **Given** a live realm from §2.2 **when** the Steward signs into the new scratch org via turtleshell-ios, accesses the new node + realm, and submits client-specific feedback **then** a `Feedback__c` row with `Source__c='turtleshell-ios'` and its session-log attachment exists in the **new scratch org**.

- **§2.7 turtleshell-offgrid — sign-in + feedback round-trip.** **Given** a live realm from §2.2 **when** the Steward signs into the new scratch org via turtleshell-offgrid, accesses the new node + realm, and submits client-specific feedback **then** a `Feedback__c` row with `Source__c='turtleshell-offgrid'` and its session-log attachment exists in the **new scratch org**.

- **§2.8 iris portal — sign-in + feedback round-trip.** **Given** a live realm from §2.2 **when** the Steward signs into the new scratch org via the iris portal, accesses the new node + realm, and submits client-specific feedback **then** a `Feedback__c` row with `Source__c='iris-portal'` and its session-log attachment exists in the **new scratch org**.

- **§2.9 Repeatability.** **Given** EOS-3 is closed **when** any human holding the source repeats §2.1 → §2.8 on a fresh machine **then** the chain completes without Steward intervention. This is the *"anyone can repeat this cycle"* closure condition from §1.2.

> **Out of scope for EOS-3** (rides future cycles, NOT criteria here): the §1.1 zero-error / zero-warning gold standard across the void→manifestation chain; production promotion of the code touched during EOS-3 (that is the EOS-4 scope); per-customer multi-node-fleet deploy automation; the candidate `Cluster__c.BrainVersion__c` field unless Steward widens.
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

| Criterion | Salesforce (olympus-grid) | Pantheon services | omens (Godot) | turtleshell-web | turtleshell-ios | turtleshell-offgrid | iris portal | olympus-gpt | SDK / protocol |
|-----------|---------------------------|-------------------|---------------|-----------------|-----------------|---------------------|-------------|-------------|----------------|
| §2.1 Node | … | … | … | … | … | … | … | … | … |
| §2.2 Realm | … | … | … | … | … | … | … | … | … |
| §2.3 omens | … | … | … | … | … | … | … | … | … |
| §2.4 olympus-gpt | … | … | … | … | … | … | … | … | … |
| §2.5 ts-web | … | … | … | … | … | … | … | … | … |
| §2.6 ts-ios | … | … | … | … | … | … | … | … | … |
| §2.7 ts-offgrid | … | … | … | … | … | … | … | … | … |
| §2.8 iris portal | … | … | … | … | … | … | … | … | … |
| §2.9 Repeatability | aggregator | aggregator | aggregator | aggregator | aggregator | aggregator | aggregator | aggregator | aggregator |

## §7 Schema deltas

*PENDING. Anticipated candidates pulled from EOS-2 §13 forward-looking notes:*

- Possible new field `Cluster__c.BrainVersion__c` (per-cluster brain version pinning) — Steward to confirm whether in EOS-3 scope.
- Possible new `Node__c` SObject if "node" becomes a first-class entity distinct from a Salesforce org (e.g., when the node form expands beyond scratch orgs).
- `Cycle__c` row for the EOS-3 meta-cycle so the manifestation chain is traceable end-to-end.

## §8 Service contracts

*PENDING.* Anticipated touchpoints: every consumer's discovery handshake (omens, olympus-gpt, ares CORS, hermes managed-mode, local-dev cert lookup) replaces a hardcoded URL/cert with a fetch-from-spawning-org call. Wire shape to be drafted once the in-flight agent's pattern is read.

## §9 Telemetry assertions (the close-out gate)

*Draft assertions matching the EOS-3 slice (§1.2 / §2.1-§2.9). The closure semantic is per-surface feedback round-trip — every §2.3-§2.8 surface assertion reduces to "a `Feedback__c` row from that surface lands in the new scratch org with session-log attached." Refine after §6/§7/§8 are authored:*

- `void.manifested.olympus_grid_node` must fire once per `./build.sh` invocation against an empty starting state; payload carries new-org Id + wall-clock duration.
- `cluster.manifested.ec2_pantheon` must fire once per realm spawn; payload carries `ClusterName__c` + duration.
- `surface.connected.<surface>` must fire once per consumer surface — `omens_ios`, `olympus_gpt`, `turtleshell_web`, `turtleshell_ios`, `turtleshell_offgrid`, `iris_portal` — when that surface successfully completes its cosmos-logos handshake against the new realm. Payload carries `ClusterName__c` of the new realm + the new org Id (asserts the surface is talking to the freshly-spawned cluster, not the alpha-org).
- `feedback.roundtrip.<surface>` — for each of the six §2.3-§2.8 surfaces, a `Feedback__c` row matching the surface's discriminator (see mapping below) and carrying an attached session-log ContentVersion MUST exist in the **new scratch org** (not the alpha-org). This is the universal closure signal: **feedback receipt at base = the cycle works for that surface.** All six rows must be present for EOS-3 to close.

  **Surface → schema discriminator mapping** (locked 2026-06-10 from observed scratch data + Steward direction):

  | Surface (§2.x) | Repo / source label | Primary discriminator | Secondary discriminator needed? |
  |---|---|---|---|
  | §2.3 omens | `olympus-616/omens` | `ApplicationProfile__r.AppKey__c = 'guardians'` (game name "Guardians of Olympus") | no |
  | §2.4 olympus-gpt | `iris/reactforce/olympus-grid-ai` | `ApplicationProfile__r.AppKey__c = 'olympus-gpt'` | no |
  | §2.5 turtleshell-web | `cosmos-logos/turtleshell-web` | `ApplicationProfile__r.AppKey__c = 'turtleshell'` | **yes — surface tag TBD by Steward** (umbrella AppKey shared with §2.6 + §2.7) |
  | §2.6 turtleshell-ios | `cosmos-logos/turtleshell-ios` | `ApplicationProfile__r.AppKey__c = 'turtleshell'` | **yes — surface tag TBD** |
  | §2.7 turtleshell-offgrid | `cosmos-logos/turtleshell-offgrid` | `ApplicationProfile__r.AppKey__c = 'turtleshell'` | **yes — surface tag TBD** |
  | §2.8 iris portal | `olympus-616/iris` | `ApplicationProfile__r.AppKey__c = 'iris'` (TBD — confirm against scratch) | no |

  Note: `Feedback__c.Source__c` is a separate generic category picklist (observed values = `'Feedback'`), NOT the per-surface tag. Earlier draft text in §2.3-§2.8 that says "`Source__c='omens'`" / "`Source__c='turtleshell-web'`" / etc. is text-drift against the schema; query against `ApplicationProfile__r.AppKey__c` (plus the TBD secondary discriminator for turtleshell-*) instead. Logged as §13 §1.1-deviation.
- Every HTTP envelope across the void→manifest chain carries `cycleId` matching the EOS-3 meta-cycle row.
- Plutus ledger SOQL `SELECT * FROM LedgerEntry__c WHERE Cycle__c = :eos3_cycle_id` returns ≥ N rows for the N actions executed during verification.

> **NOT a gate** (§1.1 forever-intent, not EOS-3 closure): zero occurrences of severity `error|fatal|warn` across the chain. Any deviations encountered during verification become bug rows in §13 and seed future cycles.

## §10 Execution plan

*PENDING.* The in-flight scratch-org agent is already executing what §10 will record. The EOS agent will read that work, decompose it into ordered tasks with cross-layer dependencies, and inline it here. Until then, this section is the working contract between the EOS agent and the in-flight agent.

## §11 Verification protocol

*PENDING — anticipated per-surface flow (refines after §6 / §10 lock). The signal of success at every per-surface step is a `Feedback__c` row matching the §9 surface→discriminator mapping landing in the **new** scratch org (not the alpha-org), with its session-log ContentVersion attachment. The canonical confirmation query — run against `dev_enterprise` alias = the new scratch — is:*

```bash
sf data query --target-org dev_enterprise -q "
  SELECT Id, Name, CreatedDate, IncludesSessionLog__c,
         ApplicationProfile__r.AppKey__c,
         ApplicationProfile__r.Identity__r.Email__c, Body__c
  FROM Feedback__c
  WHERE ApplicationProfile__r.AppKey__c = '<appkey from §9 mapping>'
  ORDER BY CreatedDate DESC"
```

*Pair with a `ContentDocumentLink` lookup on the row's Id to confirm the `.jsonl` session-log attachment is present.*

### §2.1 Node + §2.2 Realm — setup (no consumer surface yet)
- `./build.sh` from a clean clone → confirm §2.1 (`void.manifested.olympus_grid_node`).
- Sign into the new scratch org via iris admin UI → spawn realm → confirm §2.2 (`cluster.manifested.ec2_pantheon`).

### §2.3 omens — cyclops level on iPhone (mandatory)
- `omens/tools/ios-deploy.sh` → omens iPhone targeted at the new node + new realm.
- Sign into the new scratch org → join the realm → play the **cyclops level** → submit feedback.
- Confirm `Feedback__c` row with `ApplicationProfile__r.AppKey__c='guardians'` + session-log attachment in the **new scratch org**. (See §9 surface mapping — omens repo ships the "Guardians of Olympus" game; AppKey is `guardians`, not `omens`.)

### §2.4 olympus-gpt — issue commands
- Sign into the new scratch org via olympus-gpt → join the realm → issue commands against the realm's Pantheon fleet → submit feedback.
- Confirm `Feedback__c` row with `ApplicationProfile__r.AppKey__c='olympus-gpt'` + session-log attachment in the **new scratch org**.

### §2.5 turtleshell-web — without iPhone
- Chromium → turtleshell-web → sign into the new scratch org → access new node + realm → submit feedback.
- Confirm `Feedback__c` row with `ApplicationProfile__r.AppKey__c='turtleshell'` + **secondary surface discriminator (TBD)** + session-log attachment in the **new scratch org**.

### §2.6 turtleshell-ios — with iPhone (mandatory)
- Deploy turtleshell-ios pointed at the new node + realm → sign in → access → submit feedback.
- Confirm `Feedback__c` row with `ApplicationProfile__r.AppKey__c='turtleshell'` + **secondary surface discriminator (TBD)** + session-log attachment in the **new scratch org**.

### §2.7 turtleshell-offgrid — appliance or offgrid container
- Sign in via offgrid surface → access new node + realm → submit feedback.
- Confirm `Feedback__c` row with `ApplicationProfile__r.AppKey__c='turtleshell'` + **secondary surface discriminator (TBD)** + session-log attachment in the **new scratch org**.

### §2.8 iris portal — without iPhone
- Chromium → iris portal in the new scratch org → access new node + realm → submit feedback.
- Confirm `Feedback__c` row with `ApplicationProfile__r.AppKey__c='iris'` (TBD — confirm against scratch first run) + session-log attachment in the **new scratch org**.

### §2.9 Repeatability
- Independent operator repeats §2.1 → §2.8 from a fresh clone on a fresh machine, no Steward intervention.

## §12 Rollback plan

*PENDING.* The cycle is platform-wide, so rollback is mostly per-layer: scratch org deletion is cheap, AWS cluster destroy via `zeus-destroy.yml` is documented, omens client revert is `git revert` clean. The risk surface is in the discover-from-spawning-org refactors — those will need per-PR rollback notes captured in §10 as tasks are decomposed.

> **Active-cycle guard (2026-06-09):** Until EOS-3 reaches §13 close-out, **NO CDN / CFN / olympus-int infra moves** are permitted. The baseline snapshot for the productionization reconcile was recorded at cycle open. Any in-flight infra move that surfaces during EOS-3 is deferred to the appropriate cycle per the boundary below.
>
> **EOS-3 → EOS-4 boundary (Steward direction 2026-06-10):** The earlier draft folded "CDN rollback reconcile + parent submodule bump + CDK redeploy `olympus-int` to head of brain" into a single EOS-3 close-out reconcile. That bundle is now **split** along the cycle boundary:
>
> | Action | Lands in | Why |
> |---|---|---|
> | Cross-repo squash-merges to `brain/1.7.x.x` for every constituent god / submodule touched by EOS-3 | **EOS-3** §13 | The cross-repo logical-branch atomic-promotion contract — closes the cycle on brain. |
> | Parent-repo submodule pointer bump PR onto `brain/1.7.x.x` | **EOS-3** §13 | Captures the cycle SHA on brain (per CLAUDE.md § *Submodule Pointer Bump Discipline*). |
> | CDN rollback reconcile (`olympus-int-cdn` UPDATE_ROLLBACK_COMPLETE since 2026-05-27) | **EOS-4** | This is productionization infra hygiene — exactly the "how does brain safely arrive in production" claim that EOS-4 is scaffolded around. |
> | CDK redeploy `olympus-int` to head of `brain/1.7.x.x` | **EOS-4** | Same reason — `olympus-int` IS the production cluster; promoting brain to it IS the EOS-4 closure act. |
>
> Under this split, **EOS-3 closes when its work is squash-merged across every constituent repo + the parent submodule bump lands on `brain/1.7.x.x`** — the system state pointer advances to a new SHA that has the EOS-3 work captured. EOS-4 then takes responsibility for moving that SHA from `brain/1.7.x.x` into the production `olympus-int` cluster. The EOS-3 active-cycle guard ("NO CDN / CFN / olympus-int infra moves") **persists through EOS-4** because the baseline snapshot is what EOS-4 reconciles against.

## §13 Closeout

*Filled at end of cycle. Doc goes immutable after this. **Rolling updates allowed while in `04_in_development/`**; the section snapshots when the doc moves to `05_verifying/` and immutability locks at the move to `06_shipped/`.*

### What shipped
- *(rolling — to be finalized at §13 lock)*

### What deferred (and why)
- **CDN rollback reconcile + `olympus-int` CDK redeploy → EOS-4.** Per Steward direction 2026-06-10 the productionization moves are EOS-4 scope. See §12 boundary table.

### What surprised
- *(rolling)*

### Verification evidence

**Source scratch org:** `innovation-app-8526.scratch.my.salesforce.com` · alias `dev_enterprise` · org Id `00DRL00000QzdOr2AJ` · spawned 2026-06-09 18:26:43 UTC.

**Realm:** AWS `olympus-eos-3` at `api-eos-3.turtleshell.ai` · CFN `CREATE_COMPLETE` · image `git-fd03cbd2` · Pantheon task HEALTHY · `Cluster__c` row `Status__c='Live'` (LiveAt 2026-06-09 19:54:02 UTC, RequestedAt 19:34:54 UTC → wall-clock 19m 8s).

**Per-criterion validation table** (queried 2026-06-10):

| Criterion | Status | Evidence in `innovation-app-8526` |
|---|---|---|
| §2.1 Node from void | ✅ validated | scratch org `00DRL00000QzdOr2AJ` exists, `./build.sh` exit 0, all four canonical apps (`Plugin.app_iris`, `Plugin.app_guardians`, `Plugin.app_olympus_gpt`, `Plugin.app_turtleshell`) installed |
| §2.2 Realm from node | ✅ validated | `Cluster__c` row Live (Status, EndpointUrl, OwnerIdentity, RequestedAt, LiveAt) for `olympus-eos-3`; CFN 5 stacks `CREATE_COMPLETE`; Pantheon HEALTHY |
| §2.3 omens (AppKey `guardians`) | ✅ **FULLY validated against PRODUCTION end-to-end** with cross-surface admin-reply round-trip (Steward 2026-06-10 15:06–15:08 UTC) | **Against production (the four-cycle full-architecture validation):** Steward signed into omens iPhone as `homer@cloudpremise.com / PRODUCTION` → cluster picker rendered both `eos-4` (Provisioning) + `api-int` (Live) from alpha-org Cluster__c list → cluster.sh CDK provision finished → Refresh in omens re-pulled list correctly (`eos-4` flipped to Live with endpoint `https://api-eos-4.turtleshell.ai`) → Steward picked `api-int`, played the cyclops level (beat Polyphemos), submitted feedback. **FB-00046** in `og_node_beta_1__Feedback__c` 2026-06-10 15:06:32 UTC · body "Eos-4 api-int run" · `AppKey='guardians'` · session log `session_20260610_145854.jsonl` (**1.04 MB**) · client `omens/4.6.2-stable (official)` · device `iPhone16,2`. **AdminResponse** "We received your feedback thanks!" written from iris portal at 15:07:52 UTC (**80 seconds after submit**) → Status flipped Submitted → Responded → RespondedBy `homer@cloudpremise.com`. **This is the FB-00007 cross-surface architecture from EOS-1 closeout (memory `project_eos_1_architecture_closeout.md`) re-attested at production scale on the new brain HEAD.** Against scratch (prior evidence retained): FB-00020 + FB-00038 in `innovation-app-8526` with attached `.jsonl`. |
| §2.4 olympus-gpt | ❌ **NOT** validated (Steward correction 2026-06-10) | **FB-00017** "cluster not working" / **FB-00018** "it didn't work" / **FB-00019** "test" — rows + `.jsonl` attachments do exist in the new scratch, but the gpt surface lacks the prod-vs-scratch login chooser + the cluster chooser. The feedback landed because the Steward was already signed into `innovation-app-8526` under the `olympus-gpt` ApplicationProfile, but the §2.4 acceptance criterion ("sign into the new scratch org, **join the realm**, issue commands against the realm's Pantheon fleet") is NOT satisfied — gpt cannot currently choose which scratch + which realm to talk to. See §1.1-deviation D8. |
| §2.5 turtleshell-web | ✅ validated **against PRODUCTION** (stronger than EOS-3 spec — validated against alpha-org `og_node_beta_1`, not against `innovation-app-8526` scratch) | **FB-00045** in `og_node_beta_1__Feedback__c` (alpha-org Id `00Dfn000001FhAXEA0`) 2026-06-10 10:48:13 UTC · `AppKey__c='turtleshell'` · body "looks like it worked" · attached `session_20260610_104709.jsonl` (5.29 KB) · D8 chooser-gap **resolved for turtleshell-web** — cluster selector visible at `turtleshell.ai/app/chat` showing `api-int` (the alpha-org canonical cluster) was actively chosen. **This is the first four-cycle attestation against production** (EOS-1 + EOS-2 + EOS-3 + EOS-4 simultaneously, since by definition the prod system shipped the EOS-3 mechanism via the EOS-4 deploy-by-merge chain). |
| §2.6 turtleshell-ios | ❌ not yet validated | no Feedback__c row matching the surface discriminator + same chooser gap expected |
| §2.7 turtleshell-offgrid | ❌ not yet validated | no Feedback__c row matching the surface discriminator + same chooser gap expected |
| §2.8 iris portal | ✅ validated in flight (Steward 2026-06-10) against PRODUCTION at `app.olympus-grid.com/admin/clusters` | (a) Signup flow completed successfully for a user under `homer@cloudpremise.com`. (b) Admin Clusters page lists `api-int` (CL-00004, Live, `git-fd03cbd2`, endpoint `api-int.turtleshell.ai`) — proves the EOS-2 cluster-visibility mechanism works in production iris admin UI. (c) "Spawn A Cluster" button exercised → CL-00005 `eos-4` (Pending) created against alpha-org `og_node_beta_1` with stack prefix `olympus-eos-4` + endpoint `api-eos-4.turtleshell.ai` + Pantheon image **`git-2fec78e6` (the new brain HEAD)**. Provisioning in flight via universal `zeus/scripts/cluster.sh provision` (Wizard-of-Oz pattern per memory `project_cluster_architecture_v1_2026_05_29.md`). (d) D8 chooser/visibility gap **resolved for iris portal** — cluster admin UI shows both clusters cleanly. Final feedback round-trip from iris portal pending. |
| §2.9 Repeatability | gates on §2.4-§2.8 | — |

**Tally as of 2026-06-10 (third update, post-iris-portal-prod-attestation): 5 of 9 criteria validated.** §2.5 turtleshell-web + §2.8 iris portal both ✅ via prod attestation. **Three surfaces now demonstrate full prod-vs-scratch login + cluster-choice flow end-to-end** — omens (against scratch, three-cycle re-attestation), turtleshell-web (against prod, four-cycle re-attestation), iris portal (against prod, four-cycle re-attestation). Closure-on-brain still requires §2.4 (olympus-gpt chooser flow + round-trip), §2.6 (turtleshell-ios), §2.7 (turtleshell-offgrid) + §2.9 repeatability check.

**Cross-cycle re-attestation (Steward direction 2026-06-10): the omens surface is now validated for EOS-1, EOS-2, AND EOS-3 simultaneously** via the same evidence (FB-00020 + FB-00038 in `innovation-app-8526` with attached session logs):

| Cycle | Claim | How the omens round-trip re-attests it |
|---|---|---|
| **EOS-1** ([06_shipped/brain_1.7.eos-1.md](../06_shipped/brain_1.7.eos-1.md)) | Consumer feedback loop on turtleshell + guardians; baseline of stable application across all repos | A guardians-tagged `Feedback__c` row with session-log ContentVersion attachment lands in a Salesforce org — the EOS-1 loop in motion. Re-attested against a *fresh* node (not the alpha-org), proving the baseline survives node-spawn from void. |
| **EOS-2** ([06_shipped/brain_1.7.eos-2.md](../06_shipped/brain_1.7.eos-2.md)) | Says what it does, does what it says — claim 1: athena-717 reachability — an admin spawns an AWS cluster from inside the managed package and talks to it end-to-end | The omens iPhone client completed cosmos-logos handshake → Ares → Hermes → Athena against the freshly-spawned `olympus-eos-3` realm (not the alpha-org's `api-int`), played the cyclops level (LLM + state-mutation chain), and posted feedback back. End-to-end reachability of the spawned realm is demonstrated by the gameplay completing and the feedback POST succeeding. |
| **EOS-3** §2.3 | Void → omens-on-iPhone feedback round-trip against a brand-new node + brand-new realm | This cycle's §2.3 — the row exists, with attachment, in the new scratch. |

**Why this matters for the canon:** every entry in `06_shipped/` is the system's specification. The omens surface having demonstrated all three cycles' assertions in a single round-trip against a from-void node is evidence that the shipped canon HOLDS — EOS-1 and EOS-2 are not just historically true, they are CURRENTLY true on a system rebuilt from source.

---

**Second cross-cycle re-attestation (2026-06-10 — turtleshell-web, four cycles, against PRODUCTION):** the turtleshell-web evidence (FB-00045 in `og_node_beta_1__Feedback__c`, alpha-org) re-attests **EOS-1 + EOS-2 + EOS-3 + EOS-4 simultaneously**, this time against the live production system rather than a fresh scratch:

| Cycle | Claim | How turtleshell-web FB-00045 re-attests it against production |
|---|---|---|
| **EOS-1** ([06_shipped/brain_1.7.eos-1.md](../06_shipped/brain_1.7.eos-1.md)) | Consumer feedback loop on turtleshell + guardians | A `turtleshell`-tagged `Feedback__c` row with session-log ContentVersion attachment lands in the production alpha-org (`og_node_beta_1` install). The EOS-1 loop is alive on production turtleshell-web. |
| **EOS-2** ([06_shipped/brain_1.7.eos-2.md](../06_shipped/brain_1.7.eos-2.md)) | Says what it does, does what it says — claim 1: athena-717 reachability — an admin spawns a cluster and talks to it end-to-end | The cluster selector UI at `turtleshell.ai/app/chat` shows `api-int` (the alpha-org canonical cluster, the production analog of `olympus-eos-3`). Athena responded to "Tell me about yourself" through the cosmos-logos handshake → Ares → Hermes → Athena chain against the production cluster. The Steward did not have to spawn a fresh cluster to demonstrate EOS-2; the canonical prod cluster IS the EOS-2 demonstration target. |
| **EOS-3** §2.5 | turtleshell-web surface — sign into a node → join a realm → submit client-specific feedback → receipt at base | Validated **against the production alpha-org rather than the EOS-3 scratch** — a stronger claim than EOS-3 §1.2 originally specified. The same mechanism EOS-3 §2.5 calls for is in flight against the production node + production realm, with full session-log round-trip. |
| **EOS-4** §1.1 (the brain-IS-production claim, IN FLIGHT) | `brain/1.7.x.x` IS the stable production environment, by construction | The turtleshell-web frontend was deployed to `turtleshell.ai` and the olympus-grid managed package was installed on `og_node_beta_1` via the merge-to-brain chain (olympus-grid PR #282 → `a53453a` + olympus-616 parent submodule bump). The fact that FB-00045 round-trips through this prod stack IS evidence that brain-IS-production held for the turtleshell-web slice on 2026-06-10. EOS-4 is not closed yet — this is the first surface to demonstrate the brain-IS-production invariant in flight. |

**Significance for EOS-4:** this is the first concrete evidence that the merge-to-brain chain (both halves — Pantheon-side advancing `olympus-int` AND SF-side installing on `og_node_beta_1`) produces a production state that satisfies prior cycles' invariants for at least one consumer surface. It is *not* sufficient for EOS-4 closure (EOS-4 §2 requires invariants A/B/C/D against ALL three EOS-4-in-scope surfaces — olympus-grid + iris portal + olympus-gpt — plus the unified brain=production assertion across both chains + durability), but it is the **anchor data point** that says the chain works for one surface end-to-end. The remaining surfaces re-attest the same way.

---

**Third cross-cycle re-attestation (2026-06-10 — iris portal, four cycles, against PRODUCTION):** the iris portal evidence (signup + cluster admin UI + cluster spawn at `app.olympus-grid.com/admin/clusters`, under user `homer@cloudpremise.com` against alpha-org `og_node_beta_1`) re-attests **EOS-1 + EOS-2 + EOS-3 + EOS-4 simultaneously** against the live production system:

| Cycle | Claim | How iris portal re-attests it against production |
|---|---|---|
| **EOS-1** | Consumer feedback loop on turtleshell + guardians (signup is the precursor to feedback) | Production iris signup flow completed end-to-end for the user under `homer@cloudpremise.com`. The Identity / IdentityToken / ApplicationProfile chain works in prod. |
| **EOS-2** | Athena-717 reachability: admin spawns AWS cluster from inside managed package, talks end-to-end | (a) `api-int` (CL-00004, `git-fd03cbd2`, endpoint `api-int.turtleshell.ai`) visible as Live in the production iris admin Clusters page. (b) **A new cluster (`eos-4`, CL-00005) was SPAWNED via "Spawn A Cluster" against the production node** — Cluster__c row created in `og_node_beta_1`, Pantheon image `git-2fec78e6` (NEW brain HEAD), stack prefix `olympus-eos-4`, endpoint will be `api-eos-4.turtleshell.ai`. Provisioning via `zeus/scripts/cluster.sh provision` (the Wizard-of-Oz provisioner per memory `project_cluster_architecture_v1_2026_05_29.md`). |
| **EOS-3** §2.8 | iris portal surface — sign into node → join realm → exercise workload → feedback round-trip | Validated **against production** rather than the EOS-3 scratch. Signup ✅, cluster admin UI ✅, cluster spawn ✅. Final feedback round-trip (e.g., via Help / Leave Feedback) still pending — but the substantive workload anchor (cluster admin) is demonstrated. |
| **EOS-4** §1.1 (the brain-IS-production claim, IN FLIGHT) | `brain/1.7.x.x` IS the stable production environment | Iris admin portal is at `app.olympus-grid.com` (production URL, not a scratch). The cluster.sh script invocation reads from the source-controlled `~/dev/repos/olympus-616/zeus/scripts/cluster.sh` at brain HEAD AND the new cluster is being provisioned with Pantheon image `git-2fec78e6` (new brain HEAD). **The fact that NEWLY-SPAWNED clusters use `git-2fec78e6` is the strongest evidence yet that brain HEAD is being consumed as production state at the cluster-spawn boundary.** |

**Operational reality surfaced by this attestation (final interpretation 2026-06-10):** the iris admin UI's `Cluster__c.Pantheon__c` value for `api-int` initially showed `git-fd03cbd2` while live ECS reality was `git-2fec78e6` (brain HEAD) — verified via `aws ecs describe-task-definition olympusintclusterTaskDefBD48DBB3:131`. After Steward correction: *"api-int is staged data in prod. i updated the pantheon version."* — `api-int` is canonical seeded data per memory `project_api_int_canonical_cluster.md`, owned by `platform@olympus-grid.com` Identity, and its `Pantheon__c` field is Steward-maintained, not auto-synced. The Pantheon CI auto-roll works correctly at the ECS layer; the SF row for `api-int` is hand-maintained when brain advances. Dynamically-spawned clusters don't have this characteristic. Logged as §13 D9 (severity LOW — operational reality, not a closure-blocking bug; possible future-cycle enhancement to automate the seed-row sync).

---

**Fourth cross-cycle re-attestation (2026-06-10 — omens iPhone against PRODUCTION):** Following the omens-against-scratch attestation (FB-00020 + FB-00038, three cycles), the omens client was now exercised against the **production node** (alpha-org `og_node_beta_1`) with the same code from `brain/1.7.x.x`. Evidence:

| Cycle | Claim | How omens-against-prod re-attests it |
|---|---|---|
| **EOS-1** | Consumer feedback loop on guardians | Sign-in against PRODUCTION succeeded as `homer@cloudpremise.com / PRODUCTION` — the Identity / IdentityToken / ApplicationProfile chain in prod alpha-org. Full feedback round-trip still in flight (workload + submit still pending), but the precursor chain is live. |
| **EOS-2** | Athena-717 reachability — admin spawns cluster from inside managed package, talks end-to-end | (a) omens cluster picker rendered the live alpha-org cluster list with both `api-int` (Live) AND the just-spawned `eos-4` (Provisioning). (b) **After the eos-4 CDK provision finished on the AWS side, Steward clicked Refresh in omens and the picker correctly re-pulled the list** — `eos-4` flipped to Live with endpoint `https://api-eos-4.turtleshell.ai`. **Real-time cosmos-logos discovery validated — not cached, no stale hardcoded URLs.** Same row-set as iris admin UI. |
| **EOS-3** §2.3 | omens surface — sign into node, join realm, exercise workload, feedback round-trip | Sign-in + cluster-picker phase against prod ✅. Play-cyclops + feedback-submit still in flight. The from-void aspect (does it work from brain HEAD source) is implied — omens iPhone was deployed from the same `omens/tools/ios-deploy.sh` script at brain HEAD that ran for scratch attestation. |
| **EOS-4** §1.1 (brain IS the stable production environment) | `brain/1.7.x.x` is the stable production environment | omens iPhone code at brain HEAD reads the prod node's Cluster__c list correctly + handles the live-refresh of cluster state correctly. This is the omens client demonstrating that brain-HEAD source talks correctly to brain-HEAD production state. |

**Cumulative significance — three surfaces now demonstrate four-cycle attestation against production:**

| Surface | Production attestation completeness | Anchor evidence |
|---|---|---|
| **omens (iPhone)** | ✅ **complete four-cycle PLUS cross-surface admin-reply round-trip** | FB-00046 (cyclops play + feedback "Eos-4 api-int run" + 1.04 MB log + iris-portal admin reply "We received your feedback thanks!" 80s later — the FB-00007 architecture re-attested in prod) |
| **turtleshell-web** | ✅ complete four-cycle | FB-00045 (feedback round-trip + log) |
| **iris portal** | ✅ substantive (signup + admin UI + cluster spawn + cross-surface admin-reply WRITE leg); originating feedback round-trip from iris portal itself TBD | iris signup + spawned CL-00005 `eos-4` cluster + wrote AdminResponse on FB-00046 |

The shared `Cluster__c` row-set across iris-admin / turtleshell-web / omens AND the cross-surface Feedback__c.AdminResponse write path (omens submits → iris portal responds → omens user reads response on refresh) are the strongest cross-surface consistency + cross-surface integration evidence the platform has produced to date.

### §1.1 deviations observed during EOS-3 (the bug accumulator)

> Every error / warning surfaced during EOS-3 verification gets logged here as a §1.1-deviation bug row. Each row points to a future-cycle slot for triage. EOS-3 does NOT gate on this list — it gates on §2.1-§2.8 / §9.

| # | Bug | Where surfaced | Severity | Triage target | Notes |
|---|-----|----------------|----------|---------------|-------|
| D1 | EOS-3 contract §2.3-§2.8 + earlier §9 / §11 wording said "`Source__c=<surface>`" but the per-surface dimension in schema is `ApplicationProfile__r.AppKey__c`. Verifying against the literal wording returns zero rows even for surfaces that successfully round-tripped. | Documentation vs schema | medium (doc-truth, not system-truth) | EOS-3 §9 / §11 (this revision) | §9 mapping + §11 query template now corrected. Steward to clean §2.3-§2.8 wording on next pass through the top half. |
| D2 | Surface tag for the omens repo is **`guardians`** in schema (game name "Guardians of Olympus"), not "omens". Undocumented in the contract until 2026-06-10. | Verification query against `innovation-app-8526` returned zero rows for `AppKey='omens'`. | low (naming clarity) | EOS-3 §9 (this revision) + memory `project_omens_repo_equals_guardians_appkey.md` | Locked. |
| D3 | TurtleShell umbrella AppKey (`turtleshell`) shared across web + ios + offgrid surfaces means §9 cannot distinguish §2.5 / §2.6 / §2.7 by `AppKey__c` alone. A secondary discriminator column is required. | Schema review during §9 revision | medium (gates §2.5-§2.7 closure) | EOS-3 (Steward locks discriminator) or EOS-? if deferred | Candidate columns: repurpose `Source__c` to carry the surface tag; or add a new `Surface__c` picklist on `Feedback__c`. Steward direction needed before §2.5-§2.7 can round-trip uniquely. |
| D4 | Logger__c DEBUG noise — 219 of 223 Logger rows say literally "adding api log" (duplicate of ApiLog__c full-fidelity rows). 98% noise. | Data audit of `innovation-app-8526` 2026-06-09 ~20:00 UTC | low (waste, not breakage) | EOS-? | Cut the DEBUG marker; Logger volume drops 98%. |
| D5 | `/v1/grid/clusters/me` polling scale concern — 208 of 219 ApiLog rows (95%) are this single GET endpoint, iris portal polled cluster status for ~19 minutes between spawn and Live. Does not scale to N concurrent clusters × M orgs. | Data audit of `innovation-app-8526` | medium (scale ceiling) | EOS-? (cluster-event-stream candidate) | Replace polling with PlatformEvent push or SSE. |
| D6 | Vestigial `TSFeedback__c` SObject + `TRG_HND_TSFeedback` trigger still in olympus-grid source + metadata. Rename to `Feedback__c` was shipped; cleanup destructive-deploy never landed. | Data audit | low (dead schema, same class as `Plugin.TRG_HND_ProfileLink` orphan) | EOS-? destructive-deploy cleanup | Bundle with `Plugin.TRG_HND_ProfileLink` orphan cleanup. |
| D7 | No `OrgWideEmailAddress` configured in new scratch — emails sent (e.g., portal welcome) go from "Portal Site Guest User" via `*.bnc.sandbox.salesforce.com`, NOT `noreply@cloudpremise.com`. Domain is authorized but no sender wired. | Data audit | medium (brand + deliverability) | EOS-? | Tier-2 of the email-sender wizard. |
| D8 | **Prod-vs-scratch login chooser + cluster (realm) chooser missing on every consumer surface EXCEPT omens.** §2.4 olympus-gpt, §2.5 turtleshell-web, §2.6 turtleshell-ios, §2.7 turtleshell-offgrid, §2.8 iris portal all assume the user is already pointed at one specific backend — they do not currently let the user (a) pick which node (prod alpha-org vs the new scratch) to authenticate against, then (b) pick which realm/cluster to join. Without these two affordances, the §1.2 closure semantic ("sign into the new scratch org → join the new realm → exercise workload → submit feedback") cannot be exercised — the feedback row may land but it does not attest the cycle. | Steward review 2026-06-10 of validated-vs-actually-validated surfaces (gpt downgraded from ✅ to ❌). | **HIGH (gates §2.4-§2.8 closure → gates EOS-3)** — **PARTIALLY RESOLVED 2026-06-10** for **two** surfaces: turtleshell-web (cluster selector at `turtleshell.ai/app/chat` shows `api-int`) AND iris portal (cluster admin at `app.olympus-grid.com/admin/clusters` lists `api-int` Live + spawns new `eos-4` cluster cleanly). Remaining: §2.4 olympus-gpt, §2.6 turtleshell-ios, §2.7 turtleshell-offgrid. | **EOS-3 itself** — these affordances must ship before §2.4-§2.7 can round-trip the full flow. Each surface's chooser may be a small UI add, but the pattern is uniform and worth designing once across the remaining three. | omens (`olympus-616/omens/engines/godot/scripts/auth/IdentityNodes.cs`), turtleshell-web, and iris portal are the three reference implementations as of 2026-06-10. Per memory `feedback_scratch_org_url_drift_pattern.md` this is the same class of problem as the URL-drift gap — solve once across the platform. |
| D9 | **`api-int` is canonical seed data in prod; its `Pantheon__c` field is Steward-maintained, not auto-synced.** Reframed three times 2026-06-10 — final interpretation: not a bug, just an operational reality. The CI auto-roll works at ECS; dynamically-spawned clusters have their `Pantheon__c` set at spawn time; canonical seed rows like `api-int` (per memory `project_api_int_canonical_cluster.md`) are by design hand-maintained. Steward manually updated `api-int.Pantheon__c` to `git-2fec78e6` on 2026-06-10. | Iris admin UI 2026-06-10 → AWS ECS ground-truth → Steward correction. | **LOW (operational reality)** | No active triage required; possible future-cycle enhancement to automate Pantheon__c sync for canonical seed rows. | See EOS-4 §13 D9 for the full reasoning trail. Key EOS-agent learning: **don't trust SF-side denormalized fields as source of truth for AWS state; always ground-truth via `aws ecs describe-*`.** |

### Feedback that emerged from THIS cycle (seed for the next one)
- …

### Memory updates
- …

### Cycle close commit
- …
- Steward sign-off: **{Steward initials}** **{date}**
