# EOS Cycles — End-of-Session continual-improvement loop

> "Each EOS cycle will be a continual improvement loop triggered by human or simulated feedback at the end of a play cycle." — Steward, 2026-05-24

## What an EOS cycle is

An **EOS cycle** is the smallest unit of dev work that moves the **entire system** — backend, frontend, portals, services, schemas, telemetry, accounting — coherently through one user-visible slice of capability.

It maps 1:1 to a **karmic cycle** in the live system: a chain of player intent → server response → state mutation → ledger entry → outcome. Every EOS cycle ships at least one new traceable karmic cycle, AND verifies the trace end-to-end on the next play.

EOS cycles are the dev-side mirror of play cycles. Each one closes by leaving the system measurably better than the prior play cycle revealed.

## Why EOS cycles live under `foundation/`

The non-profit governance of olympus-616 determines which cycles run. Cycles are **governance artifacts**, not just engineering tickets. Today the Steward is the sole approver (§5 gate); as stakeholders are seated, the gate becomes a multi-party vote with the cycle's ROI / completion accounting visible to all signers.

**The cycle as rate limiter for AI chaos.** AI can generate code at velocities that break normal software engineering — a cross-platform system can effectively build itself in the dev environment in hours. Without governance, that velocity becomes chaos: half-finished features, schemas that drift across services, billing logic that doesn't reconcile, deployments that race.

The EOS cycle is the metronome against that chaos. Three rules make it work:

1. **One theme per cycle** — coherent intent, not scattered fixes.
2. **§5 approval gate is non-negotiable** — the agent does not begin layer-impact decomposition without it; does not execute without it; does not deploy without it.
3. **Atomic deployment per cycle** — the entire cross-platform system iterates in the dev environment until the §9 telemetry assertions pass, then promotes as a SINGLE squash-merge to `brain/1.7.x.x`. Backend schema, server handlers, omens client, iris portal, turtleshell-web, SDK — all of it lands together or none of it lands.

## `brain/1.7.x.x` = the latest deployed system state

The branch name is a pointer. The HEAD SHA of `brain/1.7.x.x` IS the version of the entire olympus-grid system that's currently live across all surfaces. Every cycle = one squash merge that advances that SHA. The atomic-promotion property of this branch is what makes karmic accounting tractable — every `Cycle__c` row in production was minted by exactly one well-defined system version, and you can SOQL-join cycle outcomes to system versions over time.

This is also why §5 cannot be skipped: it's the moment governance and engineering converge into one commitment.

## EOS cycle = the cross-repo logical feature branch

An EOS cycle is **one conceptual feature branch that spans every repo in the olympus-grid universe** — the olympus-616 parent, every god submodule (athena, apollo, chronos, plutus, ares, hermes, mnemosyne, poseidon, hephaestus, zeus, iris, mnemosyne, etc.), the olympus-grid Salesforce managed package, and the cosmos-logos org's client repos (turtleshell-web, turtleshell-ios, turtleshell-offgrid). Each constituent repo evolves on its own physical branch (`@alchemisthomer/neuralpathway/...`), but all those branches are choreographed by **one** EOS cycle document.

**Rule of single-open-cycle.** There must NEVER be more than one open EOS cycle across the system at any given time. The system has one active evolution path. Two open cycles guarantee unresolvable conflicts at the squash-merge boundary in multiple repos simultaneously, and break the karmic accounting tractability that the single-SHA-per-state model provides.

A new cycle can enter `01_planning/` only when the prior cycle has reached `06_shipped/`. The folder tree itself enforces this — the kanban is a global mutex across the universe.

**Sub-agents stay scoped to their repo.** The `cosmicturtle` agent (cosmos-logos / turtleshell-web), the iris agent (managed-package portal), and the per-god agents (chronos dev agent, etc.) all work within their own repos under the coordination of the active EOS cycle. They don't open their own EOS cycles. The alchemisthomer agent (olympus-616 platform scope) is the cycle orchestrator and the only agent that decomposes work across repos.

## Why this combination is novel

The EOS cycle pattern is the conjunction of six properties that, taken together, are not present in any prior software engineering methodology this author is aware of:

1. **AI-author + human-governance pairing** — the AI decomposes high-level requirements into multi-layer implementations; humans approve the unit of work, not the implementation details.
2. **Cycle as cross-repo logical branch** — work spans isolated repos but is coordinated by one immutable governance document, not by tooling.
3. **Karmic accounting at the cycle level** — every cycle has measurable cost, outcome, tithe attribution via the `Cycle__c` SObject and `LedgerEntry__c.Cycle__c` FK.
4. **§9 telemetry assertions as the close-criteria** — the system VERIFIES its own deployment correctness via observable signals in the next play cycle's session log, not via human QA approval.
5. **Atomic cross-platform deployment** — backend schema + server handlers + mobile clients + web clients + SDK all promote together via a coordinated set of squash-merges to `brain/1.7.x.x` in each constituent repo.
6. **Single-open-cycle global mutex** — the kanban folder tree enforces "one active evolution path" across the universe, making the system state a single tractable pointer (`brain/1.7.x.x` HEAD SHA).

The Steward has identified this combination as potentially patentable subject matter. A disclosure draft is being maintained at `foundation/eos/PATENT-DISCLOSURE-DRAFT.md` for eventual IP counsel review. Until that review concludes, treat the methodology as a confidential operational discipline — share publicly only at the conceptual level, not the precise lifecycle and assertion mechanics.

## The single working document

Every EOS cycle lives in **one markdown file** that travels through the kanban folders below as the work progresses.

**File naming convention:** `brain_{major.minor}.eos-{N}.md` where `{major.minor}` is the deployment-branch family this cycle ships on, and `{N}` is the ordinal of the EOS cycle within that branch family. Example: `brain_1.7.eos-1.md` is the first EOS cycle on the `brain/1.7.x.x` branch family.

This name is **stable across the cycle's lifecycle** (no date drift, no patch-version churn — we don't know in advance whether a cycle ships as `1.7.17` vs `1.7.18` vs `1.8.0`), **self-documenting about the deployment branch family**, and **monotonically ordered within that family** so cycles read naturally in chronological order.

The next ordinal is determined by reading the highest `eos-{N}` across all stage folders (planning through shipped) on the current branch family and adding one. Branch-family rollovers (e.g., `brain/1.7 → brain/1.8`) happen only at Steward direction (major schema migrations, breaking protocol revision, deployment-pointer-branch rename). On rollover, EOS numbering restarts at `eos-1` for the new family.

**Sub-attestation form (added 2026-06-11 by EOS-4.1):** when a cycle's subject matter is a *recursive property* of a prior cycle — a property that can only be expressed by the artifact that prior cycle delivered — the cycle takes the form `brain_{major.minor}.eos-{N}.{M}.md`. The `.{M}` slot is reserved for sub-attestations of cycle N. Example: `brain_1.7.eos-4.1.md` is the first sub-attestation of EOS-4 (it uses the EOS-4-delivered artifact — the brain-IS-production property — to attest that property recursively by deploying an EOS-process-management tool that then attests its own deployment). The monotone integer ordering (`eos-1, eos-2, …`) still applies for primary cycles; the `.{M}` slot is **not** consumed when counting the next primary ordinal. A primary cycle and its sub-attestations all squash-merge to `brain/1.7.x.x` like any other cycle. Sub-attestation cycles do NOT bypass the single-open-cycle mutex — they participate in it as ordinary cycles for purposes of `01_planning` → `06_shipped` flow.

The file is the single source of truth from the moment the cycle opens until it closes. Steward writes the top half (the **what + why**). The alchemisthomer agent writes the bottom half (the **how + verify**). Both edit in place; both keep the doc up to date until the cycle is shipped + verified.

When the cycle closes, the doc moves to `06_shipped/` and becomes **immutable history** — future cycles reference it but don't edit it.

## Kanban folder structure

```
foundation/eos/cycle/
├── README.md                      ← this file (operating manual)
├── TEMPLATE.md                    ← empty scaffold; copy when starting a new cycle
├── 00_backlog/                    ← cycle ideas, not yet planned
├── 01_planning/                   ← Steward is authoring §1-§5 (story/criteria/NFRs)
├── 02_design/                     ← Agent is decomposing §6-§12 (Steward reviewing)
├── 03_ready/                      ← Steward approved §5 + Agent approved §6-§12; ready to execute
├── 04_in_development/             ← in flight; §10 plan being worked through (formerly `04_executing/`)
├── 05_verifying/                  ← code shipped; §9 telemetry assertions being validated
├── 06_shipped/                    ← closed out + immutable
└── 07_aborted/                    ← Steward killed pre-shipment; rationale recorded in §13
```

Movement between folders is `git mv` only — preserves history. Commit message convention:

```
chore(eos): move {filename} from {source-stage} to {target-stage}
```

## The document's two halves

### Top half — Steward-authored (the requirements)

1. **User story** — "As a … I want … so that …"
2. **Acceptance criteria** — "Given … when … then …" — must include observable post-conditions in the session log or Salesforce data
3. **Non-functional requirements** — cycle latency budget, cost budget, observability assertions, compatibility windows, privacy, performance
4. **Feedback inputs** — links to `Feedback__c` records that motivated this cycle
5. **Approval gate** — explicit checkboxes the Steward ticks to unlock execution

### Bottom half — Agent-authored (the decomposition + execution)

6. **Layer impact map** — which subsystem each acceptance criterion touches
7. **Schema deltas** — SObjects/columns/picklists/Plugin__mdt changes
8. **Service contracts** — HTTP envelope changes per service
9. **Telemetry assertions** — the events that must appear in the next play cycle's log to prove the cycle closed correctly
10. **Execution plan** — ordered task list with cross-layer dependencies
11. **Verification protocol** — how to validate without iPhone (Godot simulator + curl + apex anonymous) and with iPhone
12. **Rollback plan** — what we'll revert if things go sideways
13. **Closeout** — what shipped, what deferred, what surprised, what feedback emerged, memory updates

## The lifecycle of an EOS cycle

```
   ┌─────────────────────────────────────────────────────────────────┐
   │  play cycle (human or simulated player) generates feedback      │
   └────────────────────────────┬────────────────────────────────────┘
                                ▼  Feedback__c rows + attached logs
   ┌─────────────────────────────────────────────────────────────────┐
   │  Triage: Agent files FB#N tasks, surfaces themes                │
   └────────────────────────────┬────────────────────────────────────┘
                                ▼
   ┌─────────────────────────────────────────────────────────────────┐
   │  Steward picks bundle, drops new {date}-cycle{N}.md             │
   │  in 01_planning/, writes §1-§5                                  │
   └────────────────────────────┬────────────────────────────────────┘
                                ▼  git mv to 02_design/
   ┌─────────────────────────────────────────────────────────────────┐
   │  Agent decomposes §6-§12, iterates with Steward                 │
   └────────────────────────────┬────────────────────────────────────┘
                                ▼  git mv to 03_ready/ (both halves signed)
   ┌─────────────────────────────────────────────────────────────────┐
   │  Agent claims doc → git mv 04_in_development/, ships §10 plan  │
   └────────────────────────────┬────────────────────────────────────┘
                                ▼  git mv to 05_verifying/
   ┌─────────────────────────────────────────────────────────────────┐
   │  Next play cycle's session log validated against §9 assertions  │
   └────────────────────────────┬────────────────────────────────────┘
                                ▼  git mv to 06_shipped/
   ┌─────────────────────────────────────────────────────────────────┐
   │  §13 closeout written. Doc immutable. Memory updated.           │
   │  Any feedback that emerged seeds the next cycle.                │
   └─────────────────────────────────────────────────────────────────┘
```

## Operating principles

- **One theme per cycle.** Bundle related fixes; never scattergun. A cycle named "portal lifecycle" should only touch portal lifecycle code, not also Hermes UI.
- **A theme must cross EVERY layer it touches, in ONE cycle.** If a cycle's theme is "feedback system refactor," that cycle must update Salesforce schema + every Pantheon service that emits feedback + omens client + turtleshell-web + turtleshell-ios + iris portal — all atomically. Splitting a cross-cutting theme across two cycles is forbidden: it instantly creates technical debt in whichever layers ship first, with no recovery path because the in-flight second cycle is blocked by the single-open-cycle mutex. The choice is "ship every layer in one cycle" or "don't open the cycle."
- **All changes must be verifiable WITHOUT iPhone if possible.** Godot desktop simulator + curl against `dev_enterprise` scratch + apex anonymous cover ~90% of cases. Reserve iPhone deploys for cycles that need StoreKit, SIWA, or device-specific behavior.
- **Every cycle ships at least one telemetry assertion.** "The next session log must show zero `portal.misconfigured` warnings" is a closed-form contract.
- **Every cycle has cycle-tracking observable.** From the day `Cycle__c` infrastructure ships (EOS-001's NFR), every cycle is automatically observable end-to-end. Query Salesforce for `Cycle__c WHERE OpenedAt > {start-of-test}` and see the exact karmic chains.
- **Do not commit/push without explicit Steward approval.** Stage + verify + report. Always.
- **Update CLAUDE.md / memory** when a cycle introduces a new architectural pattern.
- **Keep the doc current.** If reality diverges (estimate doubles, a missed layer surfaces, new feedback emerges mid-cycle), the doc moves first. The doc is the contract.

## The Feedback → Story → Cycle promotion pipeline

`Feedback__c` rows become EOS cycles through this pipeline:

1. **Capture** — player taps "Send Feedback" in-app; row + attached session log lands.
2. **Triage** — Agent reads the log, files `FB#N` task with root-cause analysis.
3. **Promote** — Steward picks a coherent bundle of `FB#N` items, copies `TEMPLATE.md` to `01_planning/{date}-cycle{N}.md`, writes the user story.
4. **Approve** — Steward ticks §5 gate. `git mv` to `03_ready/`. Cycle execution begins.
5. **Ship** — Agent executes, `git mv` to `05_verifying/`, validates §9 assertions.
6. **Close** — `git mv` to `06_shipped/`. §13 closeout. Memory + CLAUDE.md updated.

By a small-N EOS cycle, we'll have a Lightning Web Component for batch-promoting feedback into a draft cycle doc (placeholder TBD; see relevant EOS cycle when scheduled).

## Canonical Steward attestation statements — the EOS-1 through EOS-12 family

> **Master backlog: [`GOALS.md`](GOALS.md)** — the kanban canon of all twelve attested goals + twelve proposed candidates + launch-critical ranking, witnessed by Greg Cook (CloudPremise LLC), go-live target 2026-07-17.

Each EOS cycle is anchored by a single one-or-two-sentence attestation statement. These are authoritative:

| Cycle | Phase | Canonical attestation |
|---|---|---|
| **EOS-1** | Foundation | *"I attest the software creates a recursive loop of AI-generated software that is visible to the AI that built it."* |
| **EOS-2** | Foundation | *"I attest the software can create the necessary resources in order for it to scale. I attest the compute resources can be destroyed without losing data integrity of the system."* |
| **EOS-3** | Foundation | *"I attest the entire application can be constructed by accessing public GitHub repositories and following the instructions therein."* |
| **EOS-4** | Foundation | *"I attest the entire application can be deployed to production by the merging of code into the main repository branches."* |
| **EOS-5** | Integrity | *"I attest the entire application has data integrity for each database record that is created, so that we can manage, monitor, and optimize the work that was created. I further attest the system properly accounts for an algorithmic royalty disbursement system, of which the first royalty to go into production is a 7% tithe tied to the reduction of human suffering."* |
| **EOS-6** | Resilience | *"I attest the system can withstand full destruction of all resources except for the Olympus-Grid alpha node, and maintain data integrity across future deployments based upon the immutability of the Olympus-Grid alpha node."* |
| **EOS-7** | Authority | *"I attest the system is designed with the principle of least privilege, and that no Olympus-Grid resources are available unless specifically granted by a super-user admin of Olympus-Grid as defined in the Identity__c table."* |
| **EOS-8** | Reach | *"I attest the system is globally accessible by all networks accessible by the Olympus-Grid alpha node, currently hosted on salesforce.com."* |
| **EOS-9** | Reach | *"I attest the system can scale workloads globally using horizontally scaled microservice clusters that can be deployed via Fargate across any AWS region, based upon the context, privileges, and authority of the provisioning user."* |
| **EOS-10** | Sovereignty | *"I attest that the system does not contain any secrets committed to the repositories; that all production keys are injected into the system at start-up; ..."* (full statement in [`00_backlog/brain_1.7.eos-10.md`](00_backlog/brain_1.7.eos-10.md)) |
| **EOS-11** | Sovereignty | *"I attest that the system steward has no access to customer data within the node or the cluster without customer permission..."* (full statement in [`00_backlog/brain_1.7.eos-11.md`](00_backlog/brain_1.7.eos-11.md)) |
| **EOS-12** | Money | *"I attest that no money moves throughout the network without going through trusted payment providers, for which Stripe and Apple Pay are the first payment providers."* |

Together these twelve attestations describe a self-building, self-deploying, self-reproducing, self-managing, self-monetizing, self-defending, globally-reachable, sovereign AI platform — the olympus-grid claim shape.

**Plus twelve proposed candidates (CAND-A through CAND-L)** capturing the hardening + table-stakes + closure-loop attestations needed before go-live. Launch-critical four (load-bearing for 2026-07-17): **CAND-A** (rollback) · **CAND-E** (tenant isolation) · **CAND-G** (royalty disbursement) · **CAND-H** (bounded recursion). All listed in [`GOALS.md`](GOALS.md).

## Attestation scope is dimensional — cross-repo × single-EOS vs single-repo × multi-EOS

> **Steward direction 2026-06-10 verbatim:** *"we can go cross repo against a single eos attestation or we can go a single repo against multiple attestations."*

An EOS cycle's attestation matrix is NOT fixed at "all repos for all five claims." It is dimensional:

- **Cross-repo × single-EOS** (what EOS-1/2/3/4 have done): a broad theme spans many repos coordinating on ONE attestation claim. Example: EOS-3 "void → manifestation" required olympus-616 + olympus-grid + iris + cosmos-logos repos all contributing to a single from-void reproducibility attestation.
- **Single-repo × multi-EOS**: one repo individually attested against multiple EOS claims. Example: the **omens** repo on its own carries EOS-1 (recursive AI loop visible in its session logs) + EOS-2 (its `eos/tools/*.sh` scripts spawn/destroy clusters) + EOS-3 (omens is reproducible from its repo + parent's) + EOS-4 (the iPhone binary deploys via brain-merge → image build → device install). The omens repo *alone* is EOS-1-4 attestable.

**Practical implication:** the single-open-cycle global mutex still applies at the cycle level (one cycle in 04 at a time, or two in parallel under the 2026-06-10 relaxation). But the **attestation scope per cycle** is a design choice — broad theme across many repos OR deep attestation set within fewer repos. Future cycles pick the dimension that fits the work.

## One `git newthought` per repo per EOS cycle — multi-agent fix-in-flight discipline

> **Steward direction 2026-06-10 verbatim:** *"its just that once there is an active branch from git newthought, other agents shoudl add to that if we are in the midst of an eos cycle so there is always just the one git newthought."*

When an EOS cycle is in flight across multiple repos and multiple agents are working in parallel (the cross-agent fix-in-flight pattern proven by D16 / D17 / D18 in the EOS-3+4 session), the branch-discipline is:

1. **One `git newthought` per repo per EOS cycle.** The cycle's working branch in each repo is created ONCE at cycle open (or whenever the cycle first touches that repo) and STAYS the single working branch for the duration of the cycle.
2. **All in-cycle commits go through `git savethought`** — alchemisthomer commits in `foundation/`, turtleshell agent commits in `cosmos-logos/turtleshell-web`, iris agent commits in `olympus-616/iris`, gpt agent commits in `iris/reactforce/olympus-grid-ai`, etc. Each agent works in its own repo but ADDS to that repo's existing one-cycle working branch via `git savethought` — no second `git newthought` until the cycle ships.
3. **`git commit` is NEVER used by the alchemisthomer agent** for EOS work. (Ceremony of Binding is the only exception — Steward-dictated literal `-m` message on a separate manifesto file, per memory `feedback_ceremony_commit_messages_literal.md`.)
4. After the cycle ships: `git mainbrain && git pull && git cleanthoughts` — the working branch is squashed-merged into `brain/1.7.x.x`, the in-cycle savethought commits collapse to one canonical merge commit (the EOS cycle's atomic-promotion record), and the next cycle starts fresh with its own one `git newthought`.

The result: each EOS cycle leaves exactly ONE squash commit on `brain/1.7.x.x` per touched repo, regardless of how many agents collaborated or how many fix iterations landed. The brain history reads as a clean per-cycle log.

## Inventory

- [`TEMPLATE.md`](TEMPLATE.md) — empty scaffold; copy when starting a new cycle.
- [`GOALS.md`](GOALS.md) — master kanban canon: all twelve attested goals + twelve proposed candidates + launch-critical ranking.

### `06_shipped/` — immutable closed cycles

- [`06_shipped/brain_1.7.eos-1.md`](06_shipped/brain_1.7.eos-1.md) — **SHIPPED** (2026-05-31) · portal lifecycle + cycle tracking infrastructure · the consumer feedback loop on turtleshell + guardians; the baseline of stable application across all repos. Canonical statement: *"recursive loop of AI-generated software that is visible to the AI that built it."*
- [`06_shipped/brain_1.7.eos-2.md`](06_shipped/brain_1.7.eos-2.md) — **SHIPPED** (parent PR #166) · *Says what it does, does what it says — claim 1: athena-717 reachability* · Salesforce admin spawns an AWS cluster and talks to it end-to-end. **Both halves attested 2026-06-10 via D19 closure (destroy-with-data-integrity).**
- [`06_shipped/brain_1.7.eos-3.md`](06_shipped/brain_1.7.eos-3.md) — **SHIPPED** (2026-06-11) · *Void → every-surface manifestation* · 5 surfaces formally pass four cycles (omens + turtleshell-web + turtleshell-ios + olympus-gpt + iris-portal-via-iris-turtleshell-popup). Canonical statement: *"entire application can be constructed by accessing public GitHub repositories and following the instructions therein."*
- [`06_shipped/brain_1.7.eos-4.md`](06_shipped/brain_1.7.eos-4.md) — **SHIPPED** (2026-06-11, co-closed with EOS-3 per Steward 2026-06-10 mutex relaxation) · *Checking into `brain/1.7.x.x` IS the production deployment* · merge-is-deploy across both Pantheon-side (CDK → `olympus-int`) AND SF-side (managed-package → `og_node_beta_1` + `og_node_beta_2`).

### `04_in_development/` — in flight

- [`04_in_development/brain_1.7.eos-4.1.md`](04_in_development/brain_1.7.eos-4.1.md) — **IN DEVELOPMENT** (opened 2026-06-11) · *Recursive self-attestation — the EOS tool deployed by the EOS process attests the EOS process itself* · first sub-attestation cycle (new `eos-{N}.{M}` form). Operationalizes EOS-1-through-4 as a public iris-portal app at `app.olympus-grid.com/eos` and uses that app to attest its own §13 closure. v1 ships read + edit-via-PR + drag-drop-git-mv + SOC-2 control filter + auditor dashboard + activity stream.

### `01_planning/` — Steward authoring

- [`01_planning/brain_1.7.eos-5.md`](01_planning/brain_1.7.eos-5.md) — **PLANNING** · *Per-record data integrity + algorithmic royalty disbursement* · two co-equal halves: every-SObject data integrity (manage/monitor/optimize) + generalized algorithmic royalty engine (tithe is first configured row). Cannot enter `04_in_development/` until EOS-4.1 reaches `06_shipped/`.

### `00_backlog/` — attested-but-roadmap cycles + proposed candidates

**Attested roadmap (cards for EOS-6 through EOS-12):**

- [`00_backlog/brain_1.7.eos-6.md`](00_backlog/brain_1.7.eos-6.md) — Resilience · Survive total destruction except the alpha node
- [`00_backlog/brain_1.7.eos-7.md`](00_backlog/brain_1.7.eos-7.md) — Authority · Least privilege; access granted only via Identity__c
- [`00_backlog/brain_1.7.eos-8.md`](00_backlog/brain_1.7.eos-8.md) — Reach · Global accessibility via the alpha node's networks
- [`00_backlog/brain_1.7.eos-9.md`](00_backlog/brain_1.7.eos-9.md) — Reach · Global horizontal scale via Fargate
- [`00_backlog/brain_1.7.eos-10.md`](00_backlog/brain_1.7.eos-10.md) — Sovereignty · No committed secrets; keys injected at start-up
- [`00_backlog/brain_1.7.eos-11.md`](00_backlog/brain_1.7.eos-11.md) — Sovereignty · Steward not a data handler without customer-provisioned access
- [`00_backlog/brain_1.7.eos-12.md`](00_backlog/brain_1.7.eos-12.md) — Money · Money moves only through trusted payment providers (Stripe + Apple Pay first)

**Proposed candidates (cards for CAND-A through CAND-L — pending Greg's accept/reject + EOS-number assignment). Launch-critical four marked ⚡:**

- [`00_backlog/cand-a.md`](00_backlog/cand-a.md) ⚡ — Resilience · Roll back a faulty production deploy without data loss
- [`00_backlog/cand-b.md`](00_backlog/cand-b.md) — Resilience · System is observed; degradation surfaces before customer impact
- [`00_backlog/cand-c.md`](00_backlog/cand-c.md) — Resilience · Partial failure degrades cleanly, no cascade
- [`00_backlog/cand-d.md`](00_backlog/cand-d.md) — Resilience · Customer data is durable and recoverable
- [`00_backlog/cand-e.md`](00_backlog/cand-e.md) ⚡ — Sovereignty · Tenant isolation across nodes and clusters
- [`00_backlog/cand-f.md`](00_backlog/cand-f.md) — Authority · Identity is verified, not merely authorized
- [`00_backlog/cand-g.md`](00_backlog/cand-g.md) ⚡ — Money · The accounted royalty is actually disbursed to the cause (identity-critical)
- [`00_backlog/cand-h.md`](00_backlog/cand-h.md) ⚡ — Foundation · The recursive loop is bounded and governed
- [`00_backlog/cand-i.md`](00_backlog/cand-i.md) — Money / Compliance · System stays out of PCI scope
- [`00_backlog/cand-j.md`](00_backlog/cand-j.md) — Compliance · Terms, privacy, and customer agreement accepted at signup
- [`00_backlog/cand-k.md`](00_backlog/cand-k.md) — Compliance · SOC2 evidence trail exists and the auditor engagement is real
- [`00_backlog/cand-l.md`](00_backlog/cand-l.md) — Foundation / Compliance · Production state is reproducible and version-provenanced

## Note on the column rename and direct-to-execution path (single-Steward mode)

Through EOS-2, the in-flight column was named `04_executing/`. From EOS-3 forward, it is **`04_in_development/`** — the name better matches how the work actually feels (live development across every repo) rather than just "executing a pre-decomposed plan."

EOS-3 was also placed directly into `04_in_development/` without walking through `01_planning → 02_design → 03_ready`. The staged kanban is the **multi-party governance flow** that lights up when republic-616 ships and dust dancers vote on §5. Until then, under single-Steward mode, the Steward may place a cycle directly into `04_in_development/` after approving its theme — the §1-§5 + §6-§13 sections are still authored (the document is still the contract), but they evolve inside the in-development column rather than via inter-column promotions. When republic-616 lands, the kanban progression becomes mandatory again because the multi-party §5 vote requires a discrete "ready for vote" state.

**Single-open-cycle global mutex — relaxation under single-Steward mode.** The canonical rule is that at most one cycle may occupy stages `01_planning` through `05_verifying` at any time across the universe. Under single-Steward mode the Steward may also **scaffold the next cycle's planning doc in `01_planning/` while the current cycle is in `04_in_development/`** — the Steward holds the cross-cycle coherence constraint themselves rather than relying on the folder tree as a structural mutex. The next cycle still cannot enter `04_in_development/` until the prior reaches `06_shipped/`. When republic-616 lands, the strict mutex re-engages: `01_planning/` empty whenever `04_in_development/` is occupied, because a multi-party body cannot reliably hold the coherence constraint mentally the way a single Steward can. (Patent claim 6 covers the strict mutex; the relaxation here is a single-author-mode optimization, not a removal of the claim.)

## Reference

- Operating-model memory: `~/.claude/projects/-Users-gregory-dev-repos-olympus-616/memory/project_eos_cycle.md`
- Feedback object: `olympus-grid/force-app/applications/default/objects/Feedback__c/`
- Backend admin API: `olympus-grid/force-app/applications/default/classes/ApiRouteFeedback.cls`
- (To be created in EOS-001) Cycle object: `olympus-grid/force-app/applications/default/objects/Cycle__c/`
