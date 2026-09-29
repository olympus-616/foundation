# Parent olympus-616 — HUD coordinator scope (PR #198) + olympus-gpt docs (PR #199) + working-tree drift

> File: `brain_2.7.eos-1.5.md` — **fifth sub-attestation of `brain_2.7.eos-1`** (hostile-universe defense). Peer of `eos-1.1` (ares), `eos-1.2` (hermes), `eos-1.3` (plutus HUD W2), `eos-1.4` (olympus-grid W1). Slices the **parent olympus-616** leg — the HUD coordinator + non-HUD co-travelers + working-tree drift.
>
> Source: Steward-provided parent-repo status 2026-09-25.

| | |
|---|---|
| **Branch family** | `brain/2.7.x.x` |
| **Cycle ordinal** | `eos-1.5` — fifth per-repo sub-attestation of `brain_2.7.eos-1` (HUD umbrella). |
| **Status** | `In Development` — reconciliation cycle. Two open PRs (both MERGEABLE/CLEAN); working-tree drift NOT staged in either PR; 5 stale submodule pointers vs. `brain/2.7.x.x` tip; local operational incident 2026-09-25T22:00:53Z (supervisor exit). Steward verbal §5 ratification 2026-09-25. Formal §5 checkboxes pending. |
| **Opened** | 2026-09-25 |
| **Closed** | — |
| **Prior cycle** | `brain_2.7.eos-1` (HUD umbrella; §6.A coordinator row names parent #198) |
| **Theme** | Parent-repo scope of HUD cascade + orthogonal olympus-gpt docs + working-tree drift + submodule pointer staleness. Two open PRs; both MERGEABLE. `zeus-deploy.yml` triggers CDK prod deploy chain on push to `brain/2.7.x.x` — every merge is prod-CDK-triggering. |
| **Feedback inputs** | Steward status 2026-09-25; PRs #198 + #199 bodies; parent submodule status diff; ops-event log 2026-09-25T22:00:53Z (supervisor exit); standing rule `kronos repo = framework only` |
| **Estimated effort** | Both PRs landing-ready; working-tree drift needs Steward disposition; 5 pointer bumps need separate approval per `[prod deploy approval]` memory. |
| **Actual effort** | — |

---

## Discipline principle

> *Any merge to `brain/2.7.x.x` on the parent fires CDK prod deploy.* Per `zeus-deploy.yml`, push to `brain/2.7.x.x` triggers the CDK chain (Foundation → Network → Cluster/ECS → CDN/DNS via zeus/cdk). This means every parent merge is prod-CDK-triggering by construction. PR #198 explicitly EXCLUDES submodule pointer bumps (per PR body); PR #199 is docs-only. Neither PR itself changes deployable code — but the merges still trigger CDK. **Docker images do not rebuild since no submodule pointer moves; CDK re-plans against current images.** The 5 stale pointer bumps are captured as a separate follow-up ticket requiring distinct Steward approval per `[prod deploy approval]`.

---

# § Steward-authored (top half)

## Canonical attestation statement

> *"I attest that parent olympus-616 PR #198 lands the launcher / scratchOrg / eos-5-Ἀκεραιότης consolidation (21 single-god flags, launcher API + UI, 13 god-launch scripts, 3 doc files, gitignore hygiene) with an explicit exclusion of submodule pointer bumps; that PR #199 lands the olympus-gpt API specification v1.1 (10 files, +11,802 / −0, docs-only) with no code changes and no submodule pointer moves; that the working-tree drift (alchemisthomer.sh --brain and --cloudpremise agent modes, +260 lines) is scoped separately and not conflated with either PR; that the untracked `kronos/` and `kronos-legacy-local/` directories remain untracked per the standing framework-only rule; that the 5 stale submodule pointers (iris, proteus, foundation, olympus-grid, olympus-grid-www) are captured as a separate follow-up requiring distinct `[prod deploy approval]`; and that the 2026-09-25T22:00:53Z supervisor exit-code-137 orphan event is noted as an ops-hardening candidate."*

## §1 User story

- **§1.1** As **the fleet's HUD coordinator role for the parent repo** I want **PR #198 explicitly named as the coordinator per HUD §6.A** so that **the six-PR cascade sequence (olympus-grid #345 → plutus #42 + zeus #45 → ares #66 → hermes #62 → parent #198) has an unambiguous last-in-line merge candidate**.
- **§1.2** As **the Steward reviewing PR #198** I want **the explicit "EXCLUDES submodule pointer bumps" declaration honored** so that **no accidental pointer smuggle rides along** — Docker images don't rebuild + CDK re-plans against current images, keeping this merge lightweight.
- **§1.3** As **the operator merging PR #199** I want **it treated as an orthogonal docs-only merge** so that **the olympus-gpt API spec v1.1 lands without waiting on HUD coordination**.
- **§1.4** As **the fleet's discipline layer** I want **the 5 stale submodule pointers (iris, proteus, foundation, olympus-grid, olympus-grid-www) captured as a distinct prod-CDK-triggering follow-up** so that **the pointer bump gets its own `[prod deploy approval]` sign-off, not smuggled with these two PRs**.
- **§1.5** As **the operator with untracked local dirs** I want **`kronos/` and `kronos-legacy-local/` explicitly acknowledged as OFF-LIMITS for parent commits** so that **the framework-only rule holds and the 2026-09-21 `pcm.kronos-1` incident is not re-litigated**.
- **§1.6** As **the launcher operator** I want **the 2026-09-25T22:00:53Z supervisor exit-137 event captured** so that **the "attempt #2 retry never fired" behavior is filed for hardening**.

## §2 Acceptance criteria

### §2.A PR #198 — HUD coordinator (launcher + client-modes + eos-5-Ἀκεραιότης)

- **§2.1 (PR #198 MERGEABLE/CLEAN maintained)** — until merge; CI green on head.
- **§2.2 (Submodule pointer bump exclusion honored)** — PR #198 diff against `brain/2.7.x.x` tip contains ZERO submodule pointer changes. Verified by `git diff origin/brain/2.7.x.x...pr198 -- iris proteus foundation olympus-grid olympus-grid-www apollo ares athena hermes omens plutus poseidon zeus`.
- **§2.3 (13 god-launch scripts + launcher API/UI landed)** — content per PR body scope.
- **§2.4 (Nested .env gitignore hygiene applied)** — no accidental .env commits.

### §2.B PR #199 — orthogonal docs-only

- **§2.5 (Path-disjoint from #198)** — `git diff origin/brain/2.7.x.x...pr199 --name-only` shares zero paths with #198. Independent merge.
- **§2.6 (Documentation only, no code)** — 10 files under `docs/olympus-gpt/`, all markdown + one PDF. No `.ts`/`.sh`/`.tsx`/`.cls` modifications.

### §2.C Working-tree drift (NOT in either PR)

- **§2.7 (--brain + --cloudpremise agent modes)** — alchemisthomer.sh local +260 line edit adding two agent modes; Steward decides scope-into-own-PR OR fold-into-#198 OR discard.
- **§2.8 (Untracked kronos dirs remain untracked)** — `kronos/` and `kronos-legacy-local/` stay untracked per framework-only rule; not committed to parent under any circumstance. Grep on parent staging area for `kronos/` returns zero hits.

### §2.D Stale submodule pointers (SEPARATE follow-up, NOT in this PR)

- **§2.9 (5 pointer bumps captured as follow-up)** — iris, proteus, foundation, olympus-grid, olympus-grid-www stale pointers listed in FOLLOW-UPS as a distinct prod-CDK-triggering ticket requiring `[prod deploy approval]` per memory.

### §2.E Ops hardening candidate (informational, not blocker)

- **§2.10 (Supervisor exit-137 event noted)** — 2026-09-25T22:00:53Z: launcher api child exited SIGKILL; supervisor exited too, orphaned UI on :616 → 20 min of ECONNREFUSED spam. Not a blocker for these PRs; filed as hardening candidate.

## §3 Non-functional requirements

- **§3.1 (Every parent merge fires CDK)** — per `zeus-deploy.yml`; Steward approval per `[prod deploy approval]` for every merge to `brain/2.7.x.x`.
- **§3.2 (Docker images do NOT rebuild)** — neither PR bumps submodule pointers; CDK re-plans against current images idempotently.
- **§3.3 (Framework-only rule for kronos)** — non-negotiable per memory + `pcm.kronos-1` incident.
- **§3.4 (Nested `.env` never committed)** — gitignore hygiene held.

## §4 Feedback inputs

| FB# | Title | Body excerpt |
|-----|-------|--------------|
| — | Steward parent-repo status 2026-09-25 | Both PRs + working-tree drift + stale pointers + ops event captured |
| — | PR #198 body | Explicitly EXCLUDES submodule pointer bumps |
| — | PR #199 body | Documentation only, no code, no submodule pointer moves |
| — | Standing memory `feedback_kronos_repo_is_framework_only.md` | kronos NEVER committed to olympus-616 parent |
| — | Standing memory `feedback_prod_deploy_approval.md` | Prod-CDK-triggering actions need explicit Steward approval |

## §5 Steward approval gate

- [ ] Discipline principle acknowledged
- [ ] Canonical attestation statement locked
- [ ] Story locked (§1.1 – §1.6)
- [ ] Acceptance criteria locked (§2.1 – §2.10)
- [ ] NFRs locked (§3.1 – §3.4)
- [ ] **PR #198 merge approval** (prod-CDK-triggering per §3.1)
- [ ] **PR #199 merge approval** (prod-CDK-triggering per §3.1)
- [ ] **Working-tree drift disposition** (§2.7 — --brain + --cloudpremise agent modes)
- [ ] **Stale pointer bump follow-up scheduled** — separate PR, separate `[prod deploy approval]`
- [ ] Approved to execute — signed: **__________** **__________**

---

# § Agent-authored (bottom half)

## §6 Layer impact map

| Criterion | parent olympus-616 | Submodules (this PR does NOT bump) |
|---|---|---|
| PR #198 launcher/client-modes | 39 files, +5826/−606, 7 commits — alchemisthomer.sh, launcher API/UI, 13 god-launch scripts, 3 doc files, gitignore | none |
| PR #199 olympus-gpt docs | 10 files, +11802/−0, 2 commits — markdown + PDF under docs/olympus-gpt/ | none |
| Working-tree drift | alchemisthomer.sh +260 (--brain + --cloudpremise); untracked kronos/ + kronos-legacy-local/ | none |
| Stale pointer follow-up | iris, proteus, foundation, olympus-grid, olympus-grid-www — SEPARATE PR | 5 subs |

## §7 Schema deltas

No SObject or wire-schema changes. Parent-only scope; nested launcher API surface changes stay within launcher.

## §8 Service contracts

Launcher API surface changes (per PR #198 scope): new routes for `scratchOrg` + `godEnvMap`; registry + spawner updates. All localhost-only, not fleet-wire-contract.

## §9 Telemetry assertions

- **§9.PAR-1** — PR #198 CI green on head SHA; MERGEABLE maintained until merge.
- **§9.PAR-2** — PR #199 CI green (doc-check only); MERGEABLE maintained until merge.
- **§9.PAR-3** — PR #198 submodule-pointer-diff empty (§2.2 verification).
- **§9.PAR-4** — PR #199 path-disjoint from #198 (§2.5 verification).
- **§9.PAR-5** — Post-merge CDK deploy chain (all 4 stack stages `UPDATE_COMPLETE`) — inherits from HUD umbrella §9.HUD close on cascade completion.

## §10 Execution plan

1. **§5 rulings signed** — both merge approvals + working-tree drift disposition + stale-pointer follow-up scheduled.
2. **PR #199 merges first** — orthogonal docs-only, low-risk. CDK deploy fires (idempotent on Docker images).
3. **HUD cascade merges per HUD umbrella §10.2** — olympus-grid #345 → plutus #42 + zeus #45 → ares #66 → hermes #62 → **PR #198 (this coordinator, LAST in cascade)**.
4. **CDK deploy fires on PR #198 merge** — inherits current Docker images; no image rebuild.
5. **Follow-up pointer-bump PR** — separate `[prod deploy approval]` for iris + proteus + foundation + olympus-grid + olympus-grid-www pointer bumps → CDK deploy chain with new images.
6. **Working-tree drift disposition** — Steward-directed; may become its own PR post-CDK, or absorbed into a future launcher-scope cycle.
7. **§13 closeout** — link merged SHAs + CDK deploy log + follow-up-PR reference.

## §11–§12 Verification + rollback

Verification: `gh pr view 198` + `gh pr view 199` — mergeable checks; `git diff` for §2.2 + §2.5; CDK deploy log inspection post-merge.

Rollback: revert either PR (single-commit squash-revert); CDK re-deploys prior state. Non-revertable: git history retains commits; CDK deploy plans are re-executable idempotently against prior submodule pointers.

## §13 Closeout

*Filled at end of cycle.*

Ops-event note: 2026-09-25T22:00:53Z supervisor exit-code-137 orphan event. Attempt #2 retry never fired; supervisor-hardening candidate for a future ops-scope cycle.

---

## References

- **Umbrella cycle:** [`brain_2.7.eos-1.md`](brain_2.7.eos-1.md) — HUD; §6.A coordinator row names parent #198.
- **Sibling per-repo attestations:** [`brain_2.7.eos-1.1.md`](brain_2.7.eos-1.1.md) ares · [`brain_2.7.eos-1.2.md`](brain_2.7.eos-1.2.md) hermes · [`brain_2.7.eos-1.3.md`](brain_2.7.eos-1.3.md) plutus HUD W2 · [`brain_2.7.eos-1.4.md`](brain_2.7.eos-1.4.md) olympus-grid W1
- **PR #198:** [`feat(olympus-616): consolidate launcher client-modes + scratchOrg carryover from #189 + eos-5-Ἀκεραιότης`](https://github.com/olympus-616/olympus-616/pull/198)
- **PR #199:** [`docs(olympus-gpt): API specification v1.1 for brain/2.7.x.x`](https://github.com/olympus-616/olympus-616/pull/199)
- **`zeus-deploy.yml`** — parent CDK trigger on push to `brain/2.7.x.x`.
- **Standing memories:** `feedback_kronos_repo_is_framework_only.md` · `feedback_prod_deploy_approval.md` · `project_ssm_securestring_trap.md`
- **EOS operating manual:** [`../README.md`](../README.md)
