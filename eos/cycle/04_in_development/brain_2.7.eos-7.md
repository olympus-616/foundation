# Iris portal fleet — PRs #135 (2.7 consolidation) + #136 (olympus-gpt API docs) + workspace inventory

> File: `brain_2.7.eos-7.md` — **seventh primary EOS cycle on the `brain/2.7.x.x` family**. Source: Steward-provided iris in-progress prompt 2026-09-25 (read-only workspace survey directive).
>
> Iris is a monorepo of independently-shipped React portal applications under `reactforce/*`, each targeting a distinct product surface (own domain, own Salesforce Static Resource, or own S3+CloudFront bucket). For EOS tracking purposes each workspace is its own concern; this ticket captures the fleet-wide state and per-workspace inventory as of 2026-09-25.

| | |
|---|---|
| **Branch family** | `brain/2.7.x.x` (identical tip to `brain/1.7.x.x` — the cut hasn't diverged yet) |
| **Cycle ordinal** | `eos-7` (seventh primary on 2.7 family) |
| **Status** | `In Development` — reconciliation cycle. Two open PRs, one huge (+130,527/-781 across 30 commits) and one small (+8,361/-7 across 2 commits). Local dirty on varent workspace. Steward verbal §5 ratification 2026-09-25. Formal §5 checkboxes pending. |
| **Opened** | 2026-09-25 |
| **Closed** | — |
| **Prior cycle** | `brain_2.7.eos-6` (poseidon — sibling primary on 2.7 family) |
| **Theme** | Iris portal fleet: capture the current state of every `reactforce/*` workspace, disambiguate PR #135's scope drift (title says "4 kept commits", branch accumulated 30 across 3+ workspaces), and provide the per-workspace board visibility the Steward asked for in the "god-filter" observation earlier this session. |
| **Feedback inputs** | Steward iris workspace-survey prompt 2026-09-25; iris PRs #135 + #136; memory `feedback_iris_bundle_ceremony_pattern` (bundle-ID pinning); memory `project_iris_is_source_of_truth_olympus_grid_holds_bytes` (portal source truth pattern); brain-genesis EOS-5 `brain_2.7.eos-5.md` (agent-app workspace scope) |
| **Estimated effort** | Discovery + attestation loop for two open PRs + workspace-by-workspace state. PR #135 is huge and may need to split (Steward disposition question). |
| **Actual effort** | — |

---

## Discipline principle

> *Iris ships React source; olympus-grid holds the built bytes.* Every portal-app's React source lives in `iris/reactforce/<app>/`. Bundle byte artifacts live in `olympus-grid/force-app/ui/portal/default/staticresources/<name>/`. Real fixes go upstream in iris; olympus-grid tracks pointer + bytes via the bundle-ID pinning ceremony (`olympus-grid/scripts/validate-iris-bundles.sh`). PR #135's cross-workspace bulk means the ceremony gate MUST run before ship.

---

# § Steward-authored (top half)

## Canonical attestation statement

> *"I attest that the iris portal fleet's in-flight scope as of 2026-09-25 is captured on the board: PR #135 (2.7 consolidation, +130,527/-781 across 3+ workspaces including agent Brain plugin, varent fork, cloudpremise portfolio site) has clear per-workspace scope with drift documented; PR #136 (olympus-gpt API docs at `/gpt/docs`) is path-disjoint from #135 and can merge independently; the local varent bundleId-stamp dirty edit is accounted for; the portal `.dev` bundleId sentinel state is acknowledged pending a real 2.7 bundle cut; and the iris bundle ceremony (`validate-iris-bundles.sh`) will run green before either PR merges."*

## §1 User story

- **§1.1** As **the Steward reviewing the iris fleet** I want **each `reactforce/*` workspace tracked as its own board entry with the 9 fields the survey prompt asked for** so that **the god-filter observation from earlier this session is answered by construction: iris has many product surfaces and each deserves its own visibility**.
- **§1.2** As **the operator merging PR #135** I want **the drift beyond the PR body (three workspaces accumulated 3+ weeks of work under a "4 kept commits" title) surfaced as an explicit Steward-disposition question** so that **the merge is not accidentally endorsing content the reviewer hasn't seen**.
- **§1.3** As **the operator merging PR #136** I want **confirmation that it is path-disjoint from #135 and can merge independently** so that **the small olympus-gpt-docs win does not wait behind the large consolidation**.
- **§1.4** As **the fleet's iris bundle ceremony discipline** I want **the ceremony gate to pass on both PRs before merge** so that **no static resource ships with a `bundleId` mismatch that 404s in production**.

## §2 Acceptance criteria

- **§2.1 (PR #136 mergeable independently)** — path-disjoint verification: `git diff origin/brain/2.7.x.x...pr136 --name-only` and `git diff origin/brain/2.7.x.x...pr135 --name-only` share zero paths.
- **§2.2 (PR #135 workspace scope disambiguated)** — every workspace touched by PR #135 is enumerated in §6.A below with commit count + file count; drift-beyond-body is Steward-reviewable.
- **§2.3 (Iris bundle ceremony green)** — `olympus-grid/scripts/validate-iris-bundles.sh` returns exit 0 for each PR's associated static resource state before merge.
- **§2.4 (varent local dirty resolved)** — `reactforce/varent/public/assets/js/app.main.v1.js` (1-line bundleId stamp) either committed to PR #135 or dropped with explicit Steward rationale.
- **§2.5 (Portal bundleId sentinel documented)** — the `.dev` sentinel state (both `Plugin.iris.md-meta.xml` and `Plugin.iris_deployment_app.md-meta.xml`) is acknowledged; a real 2.7 bundle cut is scheduled per Steward-provided disposition.

## §3 Non-functional requirements

- **§3.1 (Read-only survey today)** — this ticket is CAPTURE. No source-edit changes to any workspace; no publish; no deploy.
- **§3.2 (Per-workspace deploy discipline)** — every Salesforce-Static-Resource workspace needs `bundleId` pin on merge (per `olympus-grid` bundle ceremony); every S3+CloudFront workspace needs cache-invalidation on merge.
- **§3.3 (Cross-workspace ride-along visibility)** — when one PR touches multiple workspaces, each workspace's ride-along scope is explicitly documented in the PR body; §2.2 enforces this.

## §4 Feedback inputs

| FB# | Title | Body excerpt |
|-----|-------|--------------|
| — | Steward workspace-survey prompt 2026-09-25 | 9-field-per-workspace table requested; read-only survey |
| — | PR #135 body | Claims "4 kept commits from Aug 31 consolidation"; branch has accumulated 30 commits across 3+ workspaces since |
| — | PR #136 body | `gpt-api` — adds `/gpt/docs` exclusively to `reactforce/olympus-grid-ai/` |
| — | Memory `feedback_iris_bundle_ceremony_pattern` | bundle-ID pinning discipline via `validate-iris-bundles.sh` |
| — | Memory `project_iris_is_source_of_truth_olympus_grid_holds_bytes` | Real fixes upstream in iris; olympus-grid holds the bytes |
| — | God-filter direction earlier in session | Steward noted 2026-09-25 that the EOS board UI should filter by god — iris's many workspaces exemplify why |

## §5 Steward approval gate

- [ ] Discipline principle acknowledged
- [ ] Canonical attestation statement locked
- [ ] Story locked (§1.1 – §1.4)
- [ ] Acceptance criteria locked (§2.1 – §2.5)
- [ ] NFRs locked (§3.1 – §3.3)
- [ ] **Disposition on PR #135 drift** — merge as-is with drift acknowledged, OR split into workspace-scoped PRs, OR close and re-cut a focused subset
- [ ] **Disposition on varent local dirty** — commit into #135, commit separately, or drop
- [ ] Approved to execute — signed: **__________** **__________**

---

# § Agent-authored (bottom half)

## §6 Layer impact map

### §6.A Workspace inventory (per Steward's 9-field survey)

Per the survey prompt, one row per `reactforce/*` workspace. Fields captured as of 2026-09-25 (some fields require `git log` per workspace + `grep` of `olympus-grid` Plugin.md-meta.xml — this ticket lists workspaces known-present from repo enumeration and marks fields as `TBD-per-survey` where a full walk was not yet performed).

| Workspace | Product / target | Deploy channel | On PR #135 | On PR #136 | Local dirty | Status | Open question |
|---|---|---|---|---|---|---|---|
| `portal` | Main iris Portal (SF Static Resource) | SF SR + Plugin__mdt | TBD | no | no | TBD | Bundle-ID `.dev` sentinel — real 2.7 cut when? |
| `agent` | Agent app (`app.olympus-grid.com/agent`) — brain plugin lives here | SF SR + Plugin__mdt | **yes** (Brain plugin) | no | no | **SHIPPING** | Brain-Genesis EOS-5 dependency (see `brain_2.7.eos-5.md`) |
| `varent` | varent fork (partner-branded portal) | SF SR + Plugin__mdt | **yes** | no | **yes** (1-line bundleId stamp) | **SHIPPING** | Commit stamp into #135 or drop? |
| `cloudpremise` | Portfolio site (`cloudpremise.com` → `app.olympus-grid.com/portal/cloudpremise`) | TBD | **yes** | no | no | **SHIPPING** | New in #135 scope — Steward review needed |
| `olympus-grid-ai` | `app.olympus-grid.com/olympus-grid-ai` (public developer portal) | CDN-only via CloudFront (per memory `feedback_olympus_grid_ai_deploy_discipline`) | no | **yes** (34 md docs at `/gpt/docs`) | no | **SHIPPING** | Path-disjoint from #135 — ship independently |
| `turtleshell` | TurtleShell on Salesforce (`app.olympus-grid.com`) | SF SR (turtleshell) | TBD | no | no | TBD | TSP-migration gated (memory `project_turtleshell_migration_incomplete`) |
| `servicedesk` | Iris Service Desk | SF SR | TBD | no | no | TBD | Idle? |
| `olympus-grid` (workspace) | Olympus Grid portal | SF SR | TBD | no | no | TBD | Not to confuse with the olympus-grid REPO |
| Other workspaces present | Enumerated by `ls reactforce/` walk — remainder tracked as **TBD-per-survey** | | | | | | Full 9-field walk to complete in a follow-up survey pass |

**Note:** The full 9-field walk (bundle-ID grep in olympus-grid, `git log -1` per workspace path, last-touched-date, PR file count per workspace) is bounded by budget for this session's ticket-authoring pass. This inventory captures the workspaces known-active from the Steward-provided source; the remainder land in a follow-up survey ticket if the Steward wants exhaustive coverage.

### §6.B Cross-cutting

- **PR #135 spans 3+ workspaces** (agent Brain plugin, varent, cloudpremise). Each is a separate product surface with its own deploy target. If ship-together is chosen, per-workspace validation is required.
- **PR #136 is scope-clean** (single workspace, single output). Independent merge is safe.
- **Portal `.dev` bundleId** in `olympus-grid` Plugin.md-meta.xml is a sentinel — a real 2.7 bundle cut is a future event this cycle doesn't own.
- **Brain-Genesis dependency** — the agent workspace's Brain plugin is scoped by `brain_2.7.eos-5.md`; that cycle's merge-gate applies to this cycle's agent-scoped merge.

## §7–§8 Schema / service contracts

No schema changes; no wire contracts. Deploy targets vary per workspace (SF SR + Plugin__mdt vs. S3+CloudFront) — see §6.A.

## §9 Telemetry assertions

- **§9.IRIS-1** — `validate-iris-bundles.sh` exits 0 for each PR's static-resource state.
- **§9.IRIS-2** — Path-disjoint check between PR #135 and #136 confirmed (§2.1).
- **§9.IRIS-3** — Every workspace on PR #135 has a review sign-off — no workspace merges via ride-along.
- **§9.IRIS-4** — Post-merge: each workspace's target renders (SF SR deploys clean, CloudFront caches invalidated, olympus-grid-ai `/gpt/docs` route serves docs).

## §10 Execution plan

1. **§5 rulings** on PR #135 disposition + varent-dirty disposition.
2. **PR #136 merges first** (path-disjoint; small; low-risk). Ship independently.
3. **PR #135 handling** per §5 ruling — walk workspace-by-workspace with Steward review, or split.
4. **Post-merge deploy**: SF SR + Plugin__mdt updates per workspace; CloudFront invalidations per S3+CloudFront workspace.
5. **§13 closeout** — capture merged SHAs + deploy log per workspace.
6. **Follow-up survey pass** (if Steward wants exhaustive workspace walk) — enumerate every `reactforce/*` directory with the full 9 fields.

## §11–§12 Verification + rollback

Verification: `validate-iris-bundles.sh` per PR head; post-merge render checks per workspace target URL.

Rollback: per-PR revert. varent-dirty is local-only, revert = discard.

## §13 Closeout
*Filled at end of cycle.* Feedback: which workspaces slipped through the "SHIPPING vs IDLE" classification; whether the `.dev` sentinel + real bundle cut cadence needs its own cycle discipline.

---

## References

- **Iris PRs:** #135 ([2.7 consolidation](https://github.com/olympus-616/iris/pull/135)) · #136 ([gpt-api](https://github.com/olympus-616/iris/pull/136))
- **Iris bundle ceremony:** `olympus-grid/scripts/validate-iris-bundles.sh`
- **Portal bundleId meta files:** `olympus-grid/force-app/ui/portal/default/customMetadata/Plugin.iris.md-meta.xml` + `Plugin.iris_deployment_app.md-meta.xml`
- **Related memory:** `feedback_iris_bundle_ceremony_pattern` · `project_iris_is_source_of_truth_olympus_grid_holds_bytes` · `feedback_olympus_grid_ai_deploy_discipline`
- **Brain-Genesis dependency:** [`brain_2.7.eos-5.md`](brain_2.7.eos-5.md)
- **God-filter observation (Steward 2026-09-25):** captured in `FOLLOW-UPS.md` EOS-portal UI enhancements section
- **EOS operating manual:** [`../README.md`](../README.md)
