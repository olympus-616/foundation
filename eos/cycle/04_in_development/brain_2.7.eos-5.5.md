# Iris agent work living on neuralpathway/thought branches instead of `cycle/eos-<N>`

> File: `brain_2.7.eos-5.5.md` — fifth sub-attestation of `brain_2.7.eos-5` (brain-genesis). Scope: cycle-branch convention violation. Iris agent work lives on `@alchemisthomer/neuralpathway/…iris_2_7_consolidation` — a per-thought branch — not on the shared `cycle/eos-<N>` per parent CLAUDE.md.
>
> Source: Steward agent-entry-point survey 2026-09-25 (ITEM 5).

| | |
|---|---|
| **Branch family** | `brain/2.7.x.x` |
| **Cycle ordinal** | `eos-5.5` — fifth sub of brain-genesis. |
| **Status** | `In Development` — BLOCKED on Steward confirmation of which EOS cycle number is currently active. Iris in-flight branch: `@alchemisthomer/neuralpathway/9f29407-9b1d432-20260831010054-iris_2_7_consolidation`. Not on `cycle/eos-<N>`. Same violation applies fleet-wide (see §3). |
| **Opened** | 2026-09-25 |
| **Prior cycle** | `brain_2.7.eos-5` (brain-genesis primary — the concern surfaced from agent-scope work) |
| **Theme** | Decide: merge-as-grandfathered under pre-cycle-rule legacy, OR migrate branches to `cycle/eos-<N>` before merge. Concern is fleet-wide but iris is the immediate case per Steward survey. |
| **Feedback inputs** | Steward survey 2026-09-25 (ITEM 5); parent olympus-616 CLAUDE.md § "Branch Workflow — ONE Cycle Branch per EOS Cycle"; sibling per-repo tickets have all noted branch-grandfathering (ares 1.1 §2.7, hermes 1.2 §2.10, plutus 1.3 §2.12, athena 5.8 §2.23, apollo 5.7 implicit) |
| **Owner** | iris-agent for iris specifically; fleet-wide decision is Steward |
| **Estimated effort** | Grandfathering approach = zero work per PR (squash-merge erases). Migration approach = per-repo rebase + branch rename. |
| **Actual effort** | — |

---

## §1 User story

- **§1.1** As **the fleet's branch-workflow discipline (per parent CLAUDE.md § Branch Workflow)** I want **iris agent work migrated to `cycle/eos-<N>` OR explicitly grandfathered** so that **the pre-cycle-rule legacy isn't silently normalized**.
- **§1.2** As **the Steward** I want **the active EOS cycle number confirmed** so that **`cycle/eos-<N>` migration (if chosen) has a concrete target name and doesn't fork the fleet across guesses**.
- **§1.3** As **the Steward reviewing the fleet-view** I want **fleet-wide branch-convention state acknowledged** — many submodules (apollo, ares, athena, hermes, iris, kronos, olympus-grid, omens, plutus, poseidon, zeus) all sit on per-thought neuralpathway branches per the 2026-09-25 fleet-view screenshot — so that **the decision is applied uniformly, not iris-only**.

## §2 Acceptance criteria

Two paths (Steward picks):

### §2.A — Path A: Grandfather per-cycle for this batch

- **§2.1 (Squash-merge collapses each)** — every open PR (iris #135, apollo #30, ares #66, athena #106, hermes #62, olympus-grid #345, omens #60, plutus #42, poseidon #40, zeus #45, parent #198, parent #199) squash-merges cleanly; single per-cycle commit lands on brain per repo; naming inconsistency erased at brain level.
- **§2.2 (Next-cycle migration mandated)** — every repo's NEXT increment starts on `cycle/eos-<N>` per parent CLAUDE.md.

### §2.B — Path B: Migrate branches now

- **§2.3 (Active EOS cycle N confirmed)** — Steward names the current active cycle number (probably N=1 for brain/2.7 family? Or continuing 1.7-family numbering?).
- **§2.4 (Rebase / rename each open PR's branch)** — per-repo rebase from `@alchemisthomer/neuralpathway/…` → `cycle/eos-<N>` on the same head SHA; PR base + head updated; CI re-runs.
- **§2.5 (Fleet consistency verified)** — grep of fleet-view branch state shows only `cycle/eos-<N>` and `brain/*` — zero `@alchemisthomer/neuralpathway/…` per-thought branches for active work.

## §5 Steward approval gate

- [ ] Active EOS cycle number confirmed (Path B) OR grandfather-all approved (Path A)
- [ ] Fleet-wide scope acknowledged (not iris-only)
- [ ] Path chosen — A (grandfather) / B (migrate)
- [ ] Approved to execute — signed: **__________** **__________**

## §6 Layer impact

Fleet-wide. Every submodule with an open per-thought PR — see acceptance criteria §2.1 for enumeration.

## §9 Telemetry assertions

- **§9.BRN-1 (Path A)** — Each squash-merge commit message shows single per-cycle summary; head branch closed / deleted.
- **§9.BRN-2 (Path B)** — Fleet-view grep shows zero active-work per-thought branches; all on `cycle/eos-<N>` or `brain/*`.

## §10 Execution plan

### Path A (grandfather)
1. **§5 Path A approval.**
2. **Sibling attestation tickets already carry branch-grandfathering criteria** — ares 1.1 §2.7, hermes 1.2 §2.10, plutus 1.3 §2.12, athena 5.8 §2.23, apollo 5.7 (implicit) — each closes on its own merge.
3. **Next-cycle-migration norm** codified in `CLAUDE.md` (already present) + reinforced in this ticket's §13 closeout memory update.
4. **§13 closeout.**

### Path B (migrate)
1. **§5 Path B approval** + active cycle N confirmed.
2. **Per-repo rebase**: `git checkout -b cycle/eos-<N> @alchemisthomer/neuralpathway/…`; push; update PR base + head.
3. **Re-trigger CI** on each renamed branch.
4. **Fleet-view verification** per §2.5.
5. **§13 closeout.**

## §12 Rollback

Path A: no rollback needed — grandfathering is the null-op path.
Path B: revert branch rename → restore per-thought branch (git allows recovery from reflog).

## §13 Closeout

*Filled at end of cycle.*

Memory update on close: reinforce parent CLAUDE.md § Branch Workflow — one shared `cycle/eos-<N>` branch per repo per cycle, plain `git commit -m` (not `git savethought`) for cycle work.

---

## References

- **Primary umbrella:** [`brain_2.7.eos-5.md`](brain_2.7.eos-5.md) — Brain-Genesis
- **Parent CLAUDE.md branch workflow:** § "Branch Workflow — ONE Cycle Branch per EOS Cycle"
- **Sibling per-repo grandfathering criteria:** [`brain_2.7.eos-1.1.md`](brain_2.7.eos-1.1.md) §2.7 (ares) · [`brain_2.7.eos-1.2.md`](brain_2.7.eos-1.2.md) §2.10 (hermes) · [`brain_2.7.eos-1.3.md`](brain_2.7.eos-1.3.md) §2.12 (plutus) · [`brain_1.7.eos-5.8.md`](brain_1.7.eos-5.8.md) §2.23 (athena)
- **Source:** Steward agent-entry-point survey 2026-09-25 (ITEM 5)
