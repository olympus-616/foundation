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
├── 04_executing/                  ← in flight; §10 plan being worked through
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
   │  Agent claims doc → git mv 04_executing/, ships §10 plan        │
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

## Inventory

- [`TEMPLATE.md`](TEMPLATE.md) — empty scaffold; copy when starting a new cycle.
- [`01_planning/brain_1.7.eos-1.md`](01_planning/brain_1.7.eos-1.md) — **OPEN** · the first EOS cycle on `brain/1.7.x.x` · **system is not go-live ready until this ships**.

## Reference

- Operating-model memory: `~/.claude/projects/-Users-gregory-dev-repos-olympus-616/memory/project_eos_cycle.md`
- Feedback object: `olympus-grid/force-app/applications/default/objects/Feedback__c/`
- Backend admin API: `olympus-grid/force-app/applications/default/classes/ApiRouteFeedback.cls`
- (To be created in EOS-001) Cycle object: `olympus-grid/force-app/applications/default/objects/Cycle__c/`
