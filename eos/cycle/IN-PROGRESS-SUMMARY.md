# EOS in-progress board — summary of all open work

> **Snapshot as of 2026-09-27.** All 27 files currently in `foundation/eos/cycle/04_in_development/` — every governance ticket the fleet has open on the EOS kanban. This is a **snapshot**, not a live index; regenerate by walking `04_in_development/` when reality drifts.
>
> Companion files at cycle root: [`README.md`](README.md) (operating manual) · [`TEMPLATE.md`](TEMPLATE.md) (scaffold) · [`GOALS.md`](GOALS.md) (master kanban canon) · [`FOLLOW-UPS.md`](FOLLOW-UPS.md) (deferred-work index).

## Legend

- **✓** = ticket authored + committed
- **§5 pending** = Steward approval-gate checkboxes not yet ticked
- **BLOCKED** = named external blocker documented in ticket §5 or §10
- **TWIN** = closes-together contract with a sibling ticket (both must close on the same PR merge)
- **primary** = first-class capability cycle (peer of HUD / aeon / argos / etc.)
- **sub-attestation** = per-repo or per-concern slice of a primary

---

## Fleet-view — 27 tickets grouped by cluster

### HUD cascade (7 tickets) — hostile-universe defense

Primary: `brain_2.7.eos-1` names the six-PR cascade + fourteen-layer L1–L14 defense across the fleet. Each per-repo sub owns its own attestation loop; all merge in the HUD-defined sequence (§10.2 of the umbrella).

| Ticket | Repo / scope | Status | Blocker |
|---|---|---|---|
| `brain_2.7.eos-1.md` | HUD umbrella (fleet) | In Development · §5 pending | §5 rulings: §2.15 DELETE-prevention + §3 L7-poll implementation |
| `brain_2.7.eos-1.1.md` | ares (W3+W4 + §11.1) — PR #66 | In Development · MERGEABLE/CLEAN | Steward §5 sign + CI actually run + coordinated merge slot |
| `brain_2.7.eos-1.2.md` | hermes (§11.5 URL normalize + unmounted routes) — PR #62 | In Development · MERGEABLE/CLEAN | **SPLIT vs SHIP-AS-IS** ruling; base-branch resolution; CI actually run |
| `brain_2.7.eos-1.3.md` | plutus (HUD W2: ring buffer + `cluster_name→domain`) — PR #42 · **TWIN** with `1.7.eos-5.10` | In Development · MERGEABLE/CLEAN | PR-body test-plan check-off; sibling ticket closes together |
| `brain_2.7.eos-1.4.md` | olympus-grid (W1 schema anchor + drift) — PR #345 | In Development · **UNSTABLE CI** | **4 hard blockers** (CI deploy red, `.forceignore` un-ignore, cosmos-logos.json placeholder pubkey, dual OG_Signing_Key.crt location) + 3-path disposition (A/B/C) |
| `brain_2.7.eos-1.5.md` | parent olympus-616 (coordinator) — PRs #198 + #199 + WT drift | In Development · both MERGEABLE/CLEAN | Prod-CDK-triggering merges need `[prod deploy approval]`; WT-drift disposition; 5 stale submodule pointers as separate follow-up |
| `brain_2.7.eos-1.6.md` | zeus (W5+W7b: WAF + secret metadata) — PR #45 | In Development · stalled ~2 months | Steward review; Bot Control cost acknowledgment; coordinated merge slot; L10 deferred |

### EOS-5 / BYOK cascade (10 tickets) — financial integrity + sovereign-AI

Primary FROZEN 2026-07-02. Per-repo peer sub-attestations of EOS-5 slice specific BYOK / sovereign-AI / accounting concerns out; companion triage doc tracks gaps.

| Ticket | Repo / scope | Status | Blocker |
|---|---|---|---|
| `brain_1.7.eos-5.md` | System-wide transactional accounting + autonomous revenue path | **FROZEN 2026-07-02** | Steward-owned unfreeze after client-work window |
| `brain_1.7.eos-5.1.md` | Compliance-ready-globally (Apple channels) | Draft — awaiting §1-§5 | Steward authors top half |
| `brain_1.7.eos-5.2.md` | Guest-access lockdown | Draft — awaiting §1-§5 | Steward authors top half |
| `brain_1.7.eos-5.3.md` | Tithe integrity + first-dollar-through | Draft — awaiting §1-§5 | Steward authors top half |
| `brain_1.7.eos-5.5.md` | Sealed-at-capture credential sovereignty (BYOK umbrella) | In Development · §5 pending | Umbrella covering apollo/athena/omens/turtleshell-{web,ios}/cluster-BYOK cascade |
| `brain_1.7.eos-5.7.md` | apollo (voice mirror of the sovereign-AI wire) — PR #30 | In Development · MERGEABLE/CLEAN | G-1 red-gate CORS `exposedHeaders` fix; R-1/R-2/R-3 rulings; E-4/E-5/E-6/E-7 evidence capture |
| `brain_1.7.eos-5.8.md` | athena (anchor reference impl of sovereign-AI wire) — PR #106 | In Development · MERGEABLE, zero CI | 11 local gates + 2 hygiene + §2.15 manifest ruling + SSM key rotation lockstep + client-side rollout notice cascade |
| `brain_1.7.eos-5.9.md` | omens (sovereign envelope v2 primitives + domain cutover) — PR #60 | In Development · MERGEABLE/CLEAN | **BLOCKED** on olympus-grid `/v1/grid/master/grid/clusters/me` returning `"domain"` + backfill non-null |
| `brain_1.7.eos-5.10.md` | plutus (attribution subledger + `/meter-messaging`) — PR #42 · **TWIN** with `2.7.eos-1.3` | In Development · MERGEABLE/CLEAN | PR-body test plan; sibling closes together |
| `eos-5b-triage.md` | EOS-5 gap tracker (companion, not a cycle doc) | Active companion | Ongoing gap-log for EOS-5 primary reopen |

### Brain-Genesis cascade (6 tickets) — Olympus-Brain agent-app extension

Primary: `brain_2.7.eos-5` ships the smallest working Olympus-Brain via `iris/reactforce/agent/` extension. Sub-attestations slice out specific agent-entry-point concerns.

| Ticket | Scope | Status | Blocker |
|---|---|---|---|
| `brain_2.7.eos-5.md` | Brain-Genesis primary (digital twin v1 on iPhone Chrome) | In Development · §5 pending | Verify + Proteus wiring + PerspectiveBar + Today view + real Genesis fact + iPhone demo |
| `brain_2.7.eos-5.1.md` | `/agent` surface production ship | **BLOCKED** on Steward go | Local sentinel bundleId `.dev.priv45`; needs `deployAlphaAgent` + 4-way bundleId pin + iris + olympus-grid PR pair |
| `brain_2.7.eos-5.2.md` | iris PR #135 merge decision (carries agent workspace scaffolding) | In Development · PR MERGEABLE | Co-owned with iris fleet `2.7.eos-7`; drift disposition + squash-merge |
| `brain_2.7.eos-5.3.md` | Canonical design docs port to `iris_2_7_consolidation` | In Development · §5 pending | Port `OLYMPUS_AGENT_MVP.md` + `OLYMPUS_BRAIN_ARCHITECTURE.md` + `TEMPLEATHENA_KEY_MANAGEMENT.md` from stale `olympus-agent-mvp` branch; Steward review vs. newer primary contract |
| `brain_2.7.eos-5.4.md` | Templeathena / Logos key routing | **BLOCKED** cross-repo | Path A (rotate SSM) OR Path B (per-cluster routing per spec); athena backend change owner unassigned |
| `brain_2.7.eos-5.5.md` | Cycle branch convention violation (fleet-wide) | **BLOCKED** on Steward | Path A (grandfather this batch) OR Path B (migrate to `cycle/eos-<N>`); needs active EOS cycle N confirmation |

### 2.7 primary cycles (4 tickets) — first-class capabilities

Each opens a new capability surface on the 2.7 branch family.

| Ticket | God / capability | Status | Blocker |
|---|---|---|---|
| `brain_2.7.eos-4.md` | kronos — Universal Adversarial Assurance Platform (loyal adversary red-team) | In Development · §5 pending | 3 §3 open decisions: vocabulary reconciliation, first-stub promotion, first-surface adapter; framework-only rule non-negotiable |
| `brain_2.7.eos-6.md` | poseidon — dynamic MCP router v2 control plane — PR #40 | In Development · MERGEABLE/CLEAN · **rebase risk** vs PR #41 | Cutover-date reset (2026-07-17 past); three-PR co-merge coordinator (olympus-grid #288 + athena PR TBD); 49-tool re-introduction blocked on SF↔poseidon bridge contract |
| `brain_2.7.eos-7.md` | iris — portal delivery fleet (PRs #135 + #136 + workspace inventory) | In Development · both PRs MERGEABLE | PR #135 drift disposition (agent + varent + cloudpremise); varent local dirty; `.dev` bundleId sentinel |
| `brain_2.7.eos-8.md` | olympus-gpt.ai — developer portal + 224-route forecasted API surface | In Development · initiative tracker | 5 Steward decisions: PR #136 disposition + 3 handoff owners + vision refresh + DNS cutover + branch discipline |

### 02_design column — 2 design-stage cycles

Not in 04_in_development but tightly related — future 2.7 primaries currently in design authoring.

| Ticket | Column | God | Status |
|---|---|---|---|
| `brain_2.7.eos-2.md` | 02_design | **aeon** — loop kernel; task queue as fleet programming language | Design · §5 pending; §5.A open questions Q-1…Q-6 for republic-616 |
| `brain_2.7.eos-3.md` | 02_design | **argos** — loyal watcher observability; storage-by-policy; Pi/ECS parity | Design · §5.B RFCs A/B/C required before code lands |

---

## Closes-together contracts (both must close on same merge)

- **plutus PR #42** carries two cycles' scope:
  - `brain_2.7.eos-1.3.md` (HUD W2 — ring buffer + SIGTERM + `cluster_name→domain`)
  - `brain_1.7.eos-5.10.md` (EOS-5 attribution subledger + `/meter-messaging`)
  Neither closes without the other. Merge sequence per HUD `brain_2.7.eos-1` §10.2 step 3 (parallel with zeus after olympus-grid W1).

## Steward-pending rulings across the board

Named § decisions that block closes and belong to the Steward's chair:

| Ticket | Ruling | Options |
|---|---|---|
| `brain_2.7.eos-1` §5 | `§2.15` DELETE-prevention | (a) `LedgerEntry.trigger before delete` guard · (b) permset-only-visibility |
| `brain_2.7.eos-1` §5 | `§3` L7-poll implementation | (a) SF Platform Event push · (b) shared batched pull |
| `brain_2.7.eos-1.2` §5 | hermes SPLIT vs SHIP-AS-IS (PR #62 route modules) | (a) split — ship §11.5 alone · (b) ship-as-is with docs-debt named |
| `brain_2.7.eos-1.2` §5 | hermes base-branch resolution | (a) confirm `brain/2.7.x.x` as prod tip · (b) retarget to `brain/1.7.x.x` |
| `brain_2.7.eos-1.4` §5 | olympus-grid PR #345 disposition | (A) fix blockers in place · (B) split PR · (C) close and re-cut Wave 1 only |
| `brain_2.7.eos-1.4` §5 | 4 hard blockers each need clearance | CI deploy · `.forceignore` · pubkey · cert location |
| `brain_1.7.eos-5.5` §5 | Whether to close a per-god sealed-cred sub-cycle now | umbrella wide open |
| `brain_1.7.eos-5.7` §5 | apollo R-1 mirror docs location | (a) fold into PR #30 · (b) separate docs PR |
| `brain_1.7.eos-5.7` §5 | apollo R-2 branch pattern exception | (a) accept for this cycle · (b) rebase to `cycle/eos-<N>` |
| `brain_1.7.eos-5.7` §5 | apollo R-3 revenue applicability | (a) closes with this cycle · (b) carry forward |
| `brain_1.7.eos-5.8` §5 | athena §2.15 manifest capability declaration | (a) accept as-is · (b) add declaration + version bump |
| `brain_2.7.eos-2` §5.A | aeon Q-1…Q-6 for republic-616 | future governance body's first agenda |
| `brain_2.7.eos-3` §5.B | argos RFC-A (cold storage format) · RFC-B (AQL grammar) · RFC-C (Argos↔Plutus contract) | irreversible; must publish before code lands |
| `brain_2.7.eos-4` §3 | kronos vocabulary reconciliation, first-stub choice, first-surface choice | 3 open decisions |
| `brain_2.7.eos-5` §5 | brain-genesis §5 top half sign-off | acceptance criteria + NFRs lock |
| `brain_2.7.eos-5.1` §5 | `/agent` ship green-light | authorized to `deployAlphaAgent` |
| `brain_2.7.eos-5.4` §5 | Templeathena keys path | (A) rotate SSM · (B) per-cluster routing |
| `brain_2.7.eos-5.5` §5 | Branch convention path | (A) grandfather this batch · (B) migrate to `cycle/eos-<N>` |
| `brain_2.7.eos-8` §5 | 5 gpt-initiative decisions | PR #136 disposition · handoff owners · vision refresh · DNS cutover · branch discipline |

## Two open branches still without EOS tickets

- **kronos-legacy-local** on `@…/c7f42a7-…-login-history-tool*` — engagement content per framework-only rule; likely intentionally off-EOS-board scope
- **prometheus** dirty on `brain/2.7.x.x*` — no per-thought branch; needs source doc to author attestation cycle

## Snapshot summary

- **27 tickets** in `04_in_development/`
- **6 sub-attestations** of HUD (`brain_2.7.eos-1`) — 6 repos on the coordinated cascade
- **4 primary cycles + 4 sub-attestations + companion triage** in EOS-5 / BYOK cluster
- **5 sub-attestations** of Brain-Genesis (`brain_2.7.eos-5`) covering agent-entry-point concerns
- **4 first-class 2.7 primaries** (kronos · poseidon · iris · olympus-gpt) beyond HUD + brain-genesis
- **1 companion doc** (eos-5b-triage.md)
- **2 design-stage cycles** in `02_design/` (aeon · argos)

**Snapshot commit:** [foundation PR #83](https://github.com/olympus-616/foundation/pull/83) — cycle-2.7-eos-1 branch → `brain/2.7.x.x`.

---

## References

- **EOS operating manual:** [`README.md`](README.md)
- **Follow-ups index:** [`FOLLOW-UPS.md`](FOLLOW-UPS.md)
- **Master kanban canon:** [`GOALS.md`](GOALS.md)
- **Ticket scaffold:** [`TEMPLATE.md`](TEMPLATE.md)
- **Patent disclosure:** [`../PATENT-DISCLOSURE-DRAFT.md`](../PATENT-DISCLOSURE-DRAFT.md)
