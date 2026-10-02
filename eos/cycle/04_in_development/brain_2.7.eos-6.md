---
pitch: "AI tools register themselves at runtime"
---

# Poseidon — dynamic MCP router (v2 control plane) — framework cutover + tool re-introduction cascade

> File: `brain_2.7.eos-6.md` — **sixth primary EOS cycle on the `brain/2.7.x.x` family** (after HUD `eos-1`, aeon `eos-2`, argos `eos-3`, kronos `eos-4`, brain-genesis `eos-5`). Source: Steward-provided poseidon open-work summary 2026-09-25.
>
> Poseidon is the fleet's MCP-tool provider. PR #40 replaces the previous static-tool exposure with a **dynamic control plane** driven by `handler.type` — `PoseidonRelay` implemented; `Apex` and `Flow` handler types stubbed. The 49 pre-v2 tools are preserved verbatim in `mcp/src/deprecated/` awaiting per-integration re-introduction as the SF↔poseidon bridge contract lands.

| | |
|---|---|
| **Branch family** | `brain/2.7.x.x` |
| **Cycle ordinal** | `eos-6` (sixth primary on 2.7 family) |
| **Status** | `In Development` — reconciliation cycle. PR #40 open since 2026-06-12, last updated 2026-08-23; MERGEABLE, CLEAN, PR CI green, no review decision yet. Steward verbal §5 ratification 2026-09-25 via direction to add poseidon to the board. Formal §5 checkboxes pending. |
| **Opened** | 2026-09-25 |
| **Closed** | — |
| **Prior cycle** | `brain_2.7.eos-5` (brain-genesis — sibling primary on 2.7 family) |
| **Theme** | v2 control plane: routing driven by `handler.type` (PoseidonRelay / Apex / Flow); 49-tool legacy inventory preserved verbatim in `mcp/src/deprecated/` awaiting per-integration re-introduction; ships weather-only end-to-end. Companion PRs: olympus-grid #288 (Plugin__mdt-defined MCP servers), athena PR TBD. |
| **Feedback inputs** | Steward summary 2026-09-25; poseidon PR #40 body; `mcp/src/deprecated/README.md` (per-tool migration checklist); memory `project_dynamic_mcp_endpoints_sf_framework.md` (SF-side framework wiring); existing POS-001 + POS-002 feature-pipeline tickets in `poseidon/docs/features/06_test_ready/` |
| **Estimated effort** | PR #40 landed; remaining scope: rebase-vs-#41 check, three-PR co-merge with olympus-grid #288 + athena PR, then 49-tool re-introduction cascade across 8 integration cohorts (blocked on SF↔poseidon bridge contract) |
| **Actual effort** | — |

---

## Discipline principle

> *Tools MUST NOT be re-added until the SF↔poseidon bridge/callback contract lands.* The v2 control-plane refactor is a hoist that reduces static exposure; the bridge contract is what unlocks per-integration re-migration. Adding a tool without the bridge produces a control-plane advertising authenticated integrations that can't authenticate — a strictly worse posture than the legacy shape. **The 2026-07-17 Salesforce cutover deadline has passed; Steward reset required.**

---

# § Steward-authored (top half)

## Canonical attestation statement

> *"I attest that poseidon PR #40 lands the dynamic MCP router (v2 control plane) with `handler.type` dispatch — `PoseidonRelay` implemented end-to-end, `Apex` and `Flow` returning typed 'not yet implemented' ToolResults — replacing the previous static-tool exposure; that the 49 pre-v2 tools are preserved verbatim in `mcp/src/deprecated/legacy-mcp.ts` (excluded from build) with a per-tool migration checklist in `mcp/src/deprecated/README.md`; that the metering middleware still emits `mcp.tool.call` correctly after the router hoist (verified against brain/2.7.x.x post-PR-#41); that the three-PR co-merge (poseidon #40, olympus-grid #288, athena PR TBD) completes atomically; and that no tool is re-added until the SF↔poseidon bridge contract lands under separate cycle governance."*

## §1 User story

- **§1.1** As **any client requesting the MCP tool catalog** I want **the catalog rendered from a dynamic control plane (`handler.type`-driven) rather than a static static list** so that **new tools appear when their `Plugin__mdt` rows exist and disappear when disabled, without requiring a poseidon redeploy**.
- **§1.2** As **the operator migrating the 49 pre-v2 tools** I want **a per-tool checklist under `mcp/src/deprecated/README.md`** so that **the re-introduction cascade is legible: 8 integration cohorts (Salesforce 14 · Google 9 · HubSpot 6 · Workday 2 · GitHub 2 · Proteus 10 · Mnemosyne 5 · Prometheus 1) with priority + blocking-dependency per cohort**.
- **§1.3** As **the fleet's revenue-attribution surface** I want **`mcp.tool.call` events to continue firing with §9.A attribution correctly** after the router hoist, so that **the EOS-5b Sprint D metering work (`brain_1.7.eos-5.md` scope, PR #41 on poseidon's own base) is not silently broken by this refactor**.
- **§1.4** As **the Steward with a passed 2026-07-17 Salesforce cutover deadline** I want **a fresh cutover date reset per cohort** so that **the "priority 1 · past deadline" state does not silently rot**.

## §2 Acceptance criteria

- **§2.1 (Router dispatches on handler.type)** — `core/router.ts` routes to `PoseidonRelay` for `handler.type=PoseidonRelay`; returns typed `ToolResult` with `"not yet implemented"` for `handler.type in {Apex, Flow}`. Verified by unit tests + `curl` against dynamic catalog.
- **§2.2 (Weather-only end-to-end)** — the sole tool wired end-to-end is `weather`. Verified by MCP tool-list response filtered against build inventory.
- **§2.3 (49-tool legacy preserved verbatim)** — `mcp/src/deprecated/legacy-mcp.ts` contains the pre-v2 tool set unmodified; excluded from build (`tsconfig.json` exclude); `README.md` catalogs per-tool migration state.
- **§2.4 (PR #41 metering compatibility)** — `mcp.tool.call` event fires with §9.A attribution correctly on the merged image. Verified by planted MCP call → check plutus `LedgerEntry` for the attribution row.
- **§2.5 (Three-PR co-merge)** — poseidon #40 + olympus-grid #288 + athena PR merge together on the same coordinated day; none merges alone.
- **§2.6 (Rebase-vs-#41 verified)** — before merge, PR #40 is rebased on current `brain/2.7.x.x` (which now contains PR #41's mcp.tool.call attribution); metering middleware re-verified on rebased head.

## §3 Non-functional requirements

- **§3.1 (Additive-only for 49-tool legacy)** — the deprecated inventory stays present in git history; deletion is a future cycle after successful re-introduction.
- **§3.2 (`@ts-nocheck` in `core/mcp.ts`)** — persists per the MCP SDK + Zod TS2589 issue. Removal is a future cycle contingent on upstream fix.
- **§3.3 (STDIO transport bounded)** — currently loads hardcoded weather entry only. Dynamic/authenticated STDIO out of scope until designed.
- **§3.4 (Handler-type completeness deferred)** — `Apex` and `Flow` implementations blocked on SF↔poseidon bridge contract (owned by another agent per Steward direction).

## §4 Feedback inputs

| FB# | Title | Body excerpt / evidence |
|-----|-------|-------------------------|
| — | Steward open-work summary 2026-09-25 | Full context: PR #40 status, 49-tool checklist, 4 uncovered work items, feature-pipeline tickets |
| — | `mcp/src/deprecated/README.md` | Per-tool migration checklist across 8 integration cohorts |
| — | Memory `project_dynamic_mcp_endpoints_sf_framework.md` | SF-side framework: `/v1/mcp/servers` + `Plugin__mdt`-defined MCP servers; PoseidonRelay wired, Apex/Flow + gating pending |
| — | Steward direction on cutover date | 2026-07-17 Salesforce cutover date is past; reset required |
| — | Existing poseidon feature tickets | POS-001 (Structured Logging Framework) + POS-002 (Architecture Documentation Update) both in `poseidon/docs/features/06_test_ready/` |

## §5 Steward approval gate

- [ ] Discipline principle acknowledged (no tools re-added without bridge contract)
- [ ] Canonical attestation statement locked
- [ ] Story locked (§1.1 – §1.4)
- [ ] Acceptance criteria locked (§2.1 – §2.6)
- [ ] NFRs locked (§3.1 – §3.4)
- [ ] **Cutover-date reset** for Salesforce cohort (original 2026-07-17 is past)
- [ ] **Three-PR co-merge coordinator identified** (olympus-grid #288 + athena PR TBD; who owns the co-merge?)
- [ ] Approved to execute — signed: **__________** **__________**

---

# § Agent-authored (bottom half)

## §6 Layer impact map + follow-up cascade

### §6.A Cutover (this cycle)
| Repo | PR | Role |
|---|---|---|
| poseidon | #40 | Dynamic MCP router (v2 control plane) — this ticket's primary attestation |
| olympus-grid | #288 | Plugin__mdt-defined MCP servers (Plugin__mdt rows + gating) — companion |
| athena | TBD | Token-scope wiring for authenticated MCP calls — companion |

### §6.B 49-tool re-introduction cohorts (BLOCKED on bridge contract; each becomes its own downstream cycle)
| Cohort | Count | Priority | Blocking dependency |
|---|---|---|---|
| Salesforce | 14 | P1 (deadline was 2026-07-17, past — needs reset) | SF↔poseidon bridge contract |
| Google Workspace | 9 | P2 | Per-surface OAuth + Athena token-scope wiring |
| HubSpot | 6 | P3 | Bridge contract + OAuth |
| Workday | 2 | P3 | Bridge contract + OAuth |
| GitHub | 2 | P3 | Bridge contract + OAuth |
| Proteus | 10 | P3 | Bridge contract |
| Mnemosyne | 5 | P3 | Bridge contract |
| Prometheus | 1 | P3 | Bridge contract |

### §6.C Uncovered work — filed as follow-ups
- **Handler-type completeness** — `Apex` and `Flow` handlers return "not yet implemented"; unblocks on bridge contract. Own downstream cycle.
- **STDIO transport — dynamic-catalog support** — nice-to-have, no active consumer. Backlog.
- **Remove `@ts-nocheck` from `core/mcp.ts`** — contingent on upstream MCP SDK + Zod TS2589 fix. Backlog.

## §7–§8 Schema + service contracts

Router dispatches on `handler.type ∈ {PoseidonRelay, Apex, Flow}`. Dynamic tool catalog exposed via `/tools/list` (MCP protocol). Wire contract unchanged; internal routing hoisted.

## §9 Telemetry assertions

- **§9.PSD-1** — PR #40 CI green on head SHA post-rebase against `brain/2.7.x.x` (containing PR #41).
- **§9.PSD-2** — MCP tool-list response shows `weather` only in build inventory; grep of deprecated/ contents zero-referenced from active build tree.
- **§9.PSD-3** — `curl` against dynamic catalog with `handler.type=Apex` request → typed `not yet implemented` ToolResult (not a crash).
- **§9.PSD-4** — Planted MCP tool call produces `mcp.tool.call` event with §9.A attribution row in plutus.
- **§9.PSD-5** — Three-PR co-merge SHAs published together; no merge lands alone.

## §10 Execution plan

1. **§5 rulings signed** (cutover-date reset, co-merge coordinator identified).
2. **Rebase PR #40** on current `brain/2.7.x.x` tip (with PR #41 merged).
3. **Verify metering middleware** still emits `mcp.tool.call` correctly on rebased head. Closes §9.PSD-4.
4. **Coordinated three-PR co-merge**: poseidon #40 + olympus-grid #288 + athena PR TBD.
5. **Post-merge fleet promotion**: Docker → ECR → parent submodule bump → CDK deploy.
6. **§13 closeout**. `git mv → 06_shipped`.
7. **Open follow-up cycles** for the 8 tool cohorts as bridge contract lands (one cohort per cycle, or bundled by dependency shape).

## §11–§12 Verification + rollback

Verification: `curl` against deployed dynamic catalog; MCP tool-list inspection; plutus `LedgerEntry` row check for mcp.tool.call attribution.

Rollback: revert the three PRs as a unit (co-merged, co-reverted). Legacy `mcp/src/deprecated/` inventory remains available for re-inclusion in build if full revert is needed.

## §13 Closeout
*Filled at end of cycle.* Feedback: cutover-date reset outcome per cohort; bridge contract handoff timing; whether the "not yet implemented" typed returns satisfy Apex/Flow scenarios pending real bridge.

---

## §9-observed appendix — 2026-09-30 production deploy (code-identity attestation)

**Deploy record:** [`../DEPLOY-2026-09-30.md`](../DEPLOY-2026-09-30.md) — parent `841c222` · poseidon submodule ptr `fcd1174` · Steward-verified 2026-09-29.

**Code identity for poseidon (v2 dynamic MCP router scope):** ✓ VERIFIED — boot log shows `Dynamic MCP catalog (proxies olympus-grid)` at `/v1/poseidon/mcp/servers` + per-codename route at `/v1/poseidon/mcp/:codename`. **v2 control plane observably active in prod.**

**Salesforce is reachable through this router.** Per Steward direction 2026-09-29: *"we have salesforce working through sovereign cosmos-logos"* — the SF-scoped MCP path via poseidon is the **CURRENT ATTESTED BASELINE** the rest of the fleet must be brought up to per DEPLOY-2026-09-30 priority sequence.

**§9 behavior signals: NOT YET TESTED.** Per Steward direction 2026-09-29 (*"especially related to the security updates"*), every §9.PSD signal in this ticket remains unverified. Rebase-vs-#41 metering-middleware re-verification + three-PR co-merge coordination (olympus-grid #288 + athena PR TBD) + tool re-introduction cohorts — all pending. Attestation pass per DEPLOY-2026-09-30 priority sequence **step 1** (stabilize — the SF-via-poseidon baseline informs everything else).

**Related finding — belongs to sibling ticket:** The same poseidon submodule (`fcd1174`) has a manifest publicKey-derivation blocker (`[cosmos-logos] Poseidon fingerprint compute failed: invalid seed length`) that affects the **sealed-envelope sibling ticket [`brain_1.7.eos-5.11.md`](brain_1.7.eos-5.11.md)**. This dynamic-MCP-router ticket is not directly blocked by that finding, but both poseidon tickets share the same deployed binary.

---

## References

- **Poseidon PR #40:** [`feat(poseidon): dynamic MCP router (v2 control plane)`](https://github.com/olympus-616/poseidon/pull/40)
- **Companion PRs:** olympus-grid #288 · athena PR TBD (`gh pr list --repo olympus-616/athena --search "mcp catalog"`)
- **Migration checklist:** `poseidon/mcp/src/deprecated/README.md`
- **Existing feature tickets:** `poseidon/docs/features/06_test_ready/POS-001.md` + `POS-002.md`
- **Memory:** `project_dynamic_mcp_endpoints_sf_framework.md`
- **Follow-ups filed:** `FOLLOW-UPS.md` (Poseidon cascade — 8 cohorts + handler-type + STDIO + @ts-nocheck)
- **Sibling primary cycles (2.7 family):** [`brain_2.7.eos-1.md`](brain_2.7.eos-1.md) HUD · [`brain_2.7.eos-2.md`](../02_design/brain_2.7.eos-2.md) aeon · [`brain_2.7.eos-3.md`](../02_design/brain_2.7.eos-3.md) argos · [`brain_2.7.eos-4.md`](brain_2.7.eos-4.md) kronos · [`brain_2.7.eos-5.md`](brain_2.7.eos-5.md) brain-genesis
- **EOS operating manual:** [`../README.md`](../README.md)
