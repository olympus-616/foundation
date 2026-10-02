---
pitch: "Agent workspace scaffolding into main"
---

# iris PR #135 — 2.7 pre-transition consolidation carrying agent workspace scaffolding

> File: `brain_2.7.eos-5.2.md` — second sub-attestation of `brain_2.7.eos-5` (brain-genesis). Scope: iris PR #135 merge decision — it carries the entire `iris/reactforce/agent/` workspace scaffolding.
>
> Source: Steward agent-entry-point survey 2026-09-25 (ITEM 2). **Cross-reference:** [`brain_2.7.eos-7.md`](brain_2.7.eos-7.md) already tracks PR #135 in the iris fleet inventory; this ticket adds the agent-scoped closure obligation on top.

| | |
|---|---|
| **Branch family** | `brain/2.7.x.x` |
| **Cycle ordinal** | `eos-5.2` — second sub of brain-genesis. |
| **Status** | `In Development` — PR #135 opened 2026-08-31, still OPEN as of 2026-09-25 (~25 days). Awaiting Steward review + squash-merge decision. Also flagged as branch-convention violation — see `brain_2.7.eos-5.5`. |
| **Opened** | 2026-09-25 |
| **Prior cycle** | `brain_2.7.eos-5` (brain-genesis primary) |
| **Theme** | The iris `reactforce/agent/` workspace scaffolding — `AgentEntry/ClusterResolver.tsx`, `AgentBuilder/AgentBuilder.tsx` + `pantheonModules.ts`, `AgentGithub/AgentGithub.tsx`, `AgentHome/AgentHome.tsx` — lives on PR #135. Brain-Genesis attestation depends on this landing. |
| **Feedback inputs** | Steward survey 2026-09-25 (ITEM 2); PR #135 body ("4 kept commits from Aug 31 consolidation"); iris fleet ticket `brain_2.7.eos-7.md` |
| **Owner** | iris-agent |
| **PR** | [olympus-616/iris #135](https://github.com/olympus-616/iris/pull/135) |
| **Estimated effort** | Consolidation of 4 kept + 8 dropped thought-branches. Merge is squash. Post-merge: iris cycle branch reset per `brain_2.7.eos-5.5`. |
| **Actual effort** | — |

---

## §1 User story

- **§1.1** As **the Brain-Genesis attestation loop** I want **iris PR #135 to land the `reactforce/agent/` workspace scaffolding** so that **the agent-app extension exists on `brain/2.7.x.x` where Brain-Genesis lives**.
- **§1.2** As **the Steward reviewing PR #135** I want **the drift beyond the "4 kept commits" title acknowledged** — the PR accumulated 3+ weeks of work across three workspaces (agent Brain plugin, varent, cloudpremise) — so that **the merge is not accidentally endorsing content beyond the PR body's claim**.

## §2 Acceptance criteria

- **§2.1 (Agent workspace files land on `brain/2.7.x.x`)** — post-merge, `iris/reactforce/agent/src/{AgentEntry,AgentBuilder,AgentGithub,AgentHome}/*` all present on brain tip.
- **§2.2 (Drift disposition per `brain_2.7.eos-7`)** — the varent + cloudpremise workspaces riding on PR #135 are dispositioned per iris fleet cycle `brain_2.7.eos-7.md` §5 ruling (ship-together, split, or close-and-recut).
- **§2.3 (Squash-merge grandfathered)** — the legacy `@alchemisthomer/neuralpathway/9f29407-…-iris_2_7_consolidation` branch is grandfathered for this one merge; next iris increment moves to `cycle/eos-<N>` per parent CLAUDE.md (see sibling `brain_2.7.eos-5.5`).

## §5 Steward approval gate

- [ ] Merge decision for PR #135 — merge as-is / split / close-and-recut (per `brain_2.7.eos-7` §5 disposition ruling)
- [ ] Branch grandfathering acknowledged for this one merge (see `brain_2.7.eos-5.5`)
- [ ] Approved to merge — signed: **__________** **__________**

## §6 Layer impact

Single-repo (iris) — but PR #135 spans multiple workspaces per `brain_2.7.eos-7` §6.A inventory.

## §9 Telemetry assertions

- **§9.PR135-1** — Post-merge: `iris/reactforce/agent/src/AgentHome/AgentHome.tsx` (and siblings) exist on `origin/brain/2.7.x.x` tip.
- **§9.PR135-2** — Squash-merge lands as single per-cycle commit on brain; head branch closed.

## §10 Execution plan

1. **§5 ruling** on PR #135 disposition (co-owned by iris-fleet ticket `brain_2.7.eos-7` §5).
2. **Merge / split / re-cut** per ruling.
3. **Post-merge**: iris bundle ceremony green (per `brain_2.7.eos-5.1`), then real bundleId pin for `/agent` production ship.
4. **§13 closeout** — link merged SHA.

## §12 Rollback

Revert PR #135 → agent workspace disappears from brain tip; Brain-Genesis attestation blocked until re-ship.

## §13 Closeout

*Filled at end of cycle.*

---

## References

- **Primary umbrella:** [`brain_2.7.eos-5.md`](brain_2.7.eos-5.md) — Brain-Genesis
- **iris fleet cycle (co-owner):** [`brain_2.7.eos-7.md`](brain_2.7.eos-7.md) — PR #135 also captured there in workspace inventory
- **iris PR #135:** https://github.com/olympus-616/iris/pull/135
- **Branch convention sibling:** [`brain_2.7.eos-5.5.md`](brain_2.7.eos-5.5.md)
- **Source:** Steward agent-entry-point survey 2026-09-25 (ITEM 2)
