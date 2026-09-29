# Olympus-Brain Genesis — operational digital twin v1 shipping through the agent-app extension

> File: `brain_2.7.eos-5.md` — **fifth primary EOS cycle on the `brain/2.7.x.x` family** (after HUD `eos-1`, aeon `eos-2`, argos `eos-3`, kronos `eos-4`). Source-of-truth feature file: [`olympus-grid/docs/features/04_in_development/olympus-brain-genesis.md`](../../../../olympus-grid/docs/features/04_in_development/olympus-brain-genesis.md) — **`FT-BRAIN-GENESIS`**, priority `high`, effort `XL`, owner `@alchemisthomer`. Primary contract: `olympus-grid/docs/olympus-brain-spec-athena-2.7-2026-09-01.md` (Steward-authored spec, re-read at every session entry).
>
> **⚠ NAMING-COLLISION WARNING.** The doc filename `brain_2.7.eos-5.md` uses "brain" as the branch-family prefix (`brain/2.7.x.x` = deployment branch). The **subject** of this cycle is **Olympus-Brain Genesis** — a distinct product concept named "brain" for biological-cognition reasons. These are different uses of the word "brain" that MUST NOT entangle. See §1.6 for the explicit non-entanglement contract with `brain_2.7.eos-1.md` (HUD hostile-defense — SAME version family, UNRELATED concern).

| | |
|---|---|
| **Branch family** | `brain/2.7.x.x` |
| **Cycle ordinal** | `eos-5` (fifth primary on 2.7 family; not to be confused with `brain_1.7.eos-5` which is the FROZEN transactional-accounting cycle in the 1.7 family) |
| **Status** | `In Development` — reconciliation cycle. Implementation substantially landed 2026-09-03 (port ship into agent app) + 2026-09-10 (Mind Map). Feature-tracker `FT-BRAIN-GENESIS` authored 2026-09-25 in the olympus-grid repo. This EOS doc absorbs both into the fleet's kanban. Direct-to-execution under single-Steward mode (README §270-273); §5 checkboxes pending Steward signature. |
| **Opened** | 2026-09-25 (this EOS doc); underlying spec 2026-09-01; Steward supersedes 2026-09-02; ported into agent app 2026-09-03; Mind Map 2026-09-10 |
| **Closed** | — |
| **Prior cycle** | `brain_2.7.eos-4` (kronos — the loyal adversary). Kronos will eventually attest §9 assertions of THIS cycle from the outside; brain-genesis produces the observable behaviors, kronos independently verifies them. |
| **Theme** | Ship the smallest working Olympus-Brain that lets the Steward manage his real life (finances, obligations, relationships, property, projects) through Olympus-Grid **today**, delivered as an **extension** of `iris/reactforce/agent/` (NOT a new iris child app), reachable by drilling in from the agent hero. Data lives locally under `olympus-grid/.agent/localdata/` behind a **Proteus local-file substrate**. Four Pantheon lenses (Proteus / Hestia / Plutus / Chronos) render one selected Neuron. **Mobile Chrome on iPhone is a launch requirement, not a follow-up.** |
| **Feedback inputs** | Steward spec 2026-09-01 (`olympus-brain-spec-athena-2.7-2026-09-01.md`); Steward direction 2026-09-02 (agent-app extension, not new iris child app); prior session ports 2026-09-03 + 2026-09-10; feature-tracker `FT-BRAIN-GENESIS` 2026-09-25 |
| **Estimated effort** | XL (per source). Remaining scope: verify + Proteus wiring + PerspectiveBar four-lens tab switcher + Today view + at least one real 2026-09-01-forward Genesis financial fact + iPhone demo on real device. |
| **Actual effort** | — |

---

## Why this doc exists

`FT-BRAIN-GENESIS` in `olympus-grid/docs/features/04_in_development/` is the **implementation-tracker**. This EOS doc is the **governance layer** — the attestation loop, cross-cycle non-entanglement contract, and §9 telemetry assertions that turn the feature-tracker's 15 acceptance criteria into cycle-close criteria.

Two properties this EOS doc adds on top of `FT-BRAIN-GENESIS`:

1. **Kronos-attestable §9 assertions.** Brain-Genesis §9 signals get lifted into observable shape here so kronos (`brain_2.7.eos-4`) can eventually witness them from outside the agent-app process — no self-graded attestation.
2. **Cross-cycle non-entanglement contract with `brain_2.7.eos-1` (HUD).** Both live in the same 2.7 family; the "brain" prefix collision in filenames is load-bearing to disambiguate. §1.6 captures the contract; §9.NENT observes non-entanglement empirically.

The source feature-tracker remains the authoritative artifact for the 14 FRs, 8 NFRs, 15 ACs, cross-repo map, and change log. **This doc references it, does not duplicate it.**

---

## Discipline principle

> ***Brain-Genesis is a real digital twin, not a demo.*** *Every Signal carries provenance (`DECLARED / OBSERVED / IMPORTED / DERIVED / INFERRED / PROJECTED`). Every Plutus balance and every Chronos date is either real or explicitly unknown — never invented, never fabricated, never "reasonable-looking placeholder." At least one real 2026-09-01-forward financial fact ships in v1; at least one real future obligation drives the Plutus forecast. If the twin lies, the twin has failed — better to render `unknown` than to render a plausible fiction.*

Two consequences enforced across all sections:

1. **No fabrication.** Unknown values render as `unknown`. Derived/inferred values never silently overwrite declared/observed. The user experience preserves the difference between "we know X" and "we're guessing X" at every render.
2. **Mobile Chrome on iPhone IS v1.** Not desktop-first-then-mobile-later. Every UI change is verified on the real device via LAN before it counts as done. DevTools emulation is preview, not proof.

---

# § Steward-authored (top half)

## Canonical attestation statement

> *"I attest that Olympus-Brain v1 is operational as an extension of `iris/reactforce/agent/` — reachable from the agent hero on iPhone mobile Chrome by the Steward using his real personal data (finances, obligations, relationships, property, projects); that data flows through a Proteus local-file substrate at `olympus-grid/.agent/localdata/` with human-readable Git-diff-friendly Markdown representation; that the four Pantheon lenses (Proteus / Hestia / Plutus / Chronos) render one selected Neuron without changing selection on tab switch; that no Plutus balance or Chronos date is invented — unknown values render as unknown; that at least one real 2026-09-01-forward financial fact is represented and at least one real future obligation drives the Plutus forecast; that the full four-lens Neuron experience is interactive and readable via touch on a real iPhone; and that no unrelated fleet work has been broken by the Brain-Genesis land — specifically, `brain_2.7.eos-1` hostile-defense remains untouched, varent/modernize entry-points remain untouched, and the templeathena/turtleshell portals remain unaffected."*

## §1 User story

The source feature-tracker's §2 (Business Context) enumerates the stakeholder needs. Story summary here for §5-gate approval convenience:

- **§1.1** As **the Steward (user #1)** I want **a digital twin usable on my iPhone today — one URL, four lenses, real facts, no fabrication** so that **my life state (finances, obligations, relationships, property, projects) has one operational view answering the four questions: *what do I need to know · what is important · what can be done · what am I forgetting***.
- **§1.2** As **Olympus-Grid the platform** I want **the Brain model exercised against a real workload for the first time** so that **the four-lens invariant is validated end-to-end and the first non-synthetic Proteus adapter usage exists on disk**.
- **§1.3** As **the Steward talking to a prospect** I want **the iPhone demo to work reliably** — open `app.olympus-grid.com/agent`, sign in, tap Brain, walk a real Neuron across four lenses — so that **"this is how my AI works" is a truthful narrative, not vaporware**.
- **§1.4** As **the iris + agent-app + proteus + hestia + plutus + chronos + ares + hermes + athena agents** I want **explicit cross-repo scope and branch discipline** so that **eleven repos coordinate on one feature without stepping on each other's cycles**.
- **§1.5** As **future Brain sessions** I want **the on-disk `.agent/localdata/` representation to be human-readable, git-diff-friendly, deterministic, rehydratable, portable, independent of Salesforce record IDs, based on stable logical GUIDs** so that **the substrate can later become S3 / Salesforce / Dynamo / Cosmos without rewriting the UI or invalidating the Genesis data**.
- **§1.6** As **the fleet governance layer** I want **an explicit non-entanglement contract with `brain_2.7.eos-1` (HUD hostile-defense)** so that **the "brain" naming collision (branch-family prefix vs. product concept) does NOT cause the two cycles to entangle at merge, at attestation, or in operator mental model**. Non-entanglement is verified per §9.NENT.

## §2 Acceptance criteria

**Source of truth: `FT-BRAIN-GENESIS` §3.3 (AC-1 through AC-15) + spec `§17`.**

Rather than duplicate the 15 ACs here (they belong to the implementation-tracker), this cycle inherits them wholesale and lifts each into telemetry-observable shape in §9 below. The AC → §9-signal mapping is:

| Source AC | §9 signal | One-line summary |
|---|---|---|
| AC-1 through AC-6 | §9.GEN-1 through §9.GEN-6 | Build + drill-in + six-view + Proteus load + CRUD + persistence |
| AC-7 through AC-9 | §9.LEN-1 through §9.LEN-3 | Four-lens invariant + no-fabrication + Today view |
| AC-10 through AC-13 | §9.FACT-1 through §9.FACT-4 | Real facts + Chronos obligation + Plutus forecast dependency + git diffs no secrets |
| AC-14 | §9.iOS-1 | Real-device iPhone Chrome demo |
| AC-15 | §9.NENT-1 through §9.NENT-3 | Non-entanglement with HUD + varent/modernize + templeathena/turtleshell |

## §3 Non-functional requirements

**Source of truth: `FT-BRAIN-GENESIS` §3.2 (NFR-1 through NFR-8).** Additional cycle-scoped NFRs that the source doesn't carry (because they're EOS-governance-level, not implementation-level):

- **§3.9 (Iris bundle ceremony gate — MANDATORY per olympus-grid CLAUDE.md)** — every PR that touches `olympus-grid/force-app/ui/portal/**/staticresources/**` or `Plugin.iris_deployment_*.md-meta.xml` MUST pass `olympus-grid/scripts/validate-iris-bundles.sh` locally BEFORE opening the PR. The three invariants (Routeable · Bundle-match · No-orphans) all hold or the ceremony blocks ship. Brain-Genesis rides in the agent app's static-resource bundle; the ceremony applies.
- **§3.10 (Agent-bundle-deploy discipline)** — `iris/reactforce/agent/` publishes via `npm run publishAgent` per memory `agent bundle deploy`; alpha-org for testing, `dev_enterprise` scratch for next managed package. Namespace collision → `?bundleDomain=` workaround.
- **§3.11 (Mobile viewport discipline — hard NOs)** — per memory `mobile.scss don't lock body` and `no user-scalable=no`: do NOT re-add `html/body { height: var(--vv-height) }` or `body { padding-top: var(--vv-top) }` in the agent app's mobile.scss; do NOT add `user-scalable=no` to the viewport meta. Both break iOS Safari chrome (visualViewport / safe-area shift, URL bar stops collapsing). Accept ungrabbed pinch-zoom instead. **These constraints override any "just fix the mobile chrome" instinct.**
- **§3.12 (Kronos-attestable observability)** — every §9 signal below is externally observable (log line, Proteus file, response header, Plutus row) so that kronos (`brain_2.7.eos-4`) can independently verify it without needing to instrument the agent app.
- **§3.13 (Alpha-org compatibility)** — Brain-Genesis runs against the current alpha-org managed package namespace (`og_node_beta_1`). No breaking changes to `Neuron__c / Signal__c / NeuralPathway__c` or their permsets — the feature consumes the existing canonical brain model per source doc §NFR-6, does not modify it.

## §4 Feedback inputs

| FB# | Title | Body excerpt / evidence |
|-----|-------|-------------------------|
| — | Steward spec 2026-09-01 | `olympus-grid/docs/olympus-brain-spec-athena-2.7-2026-09-01.md` — primary contract, re-read at every session entry |
| — | Steward direction 2026-09-02 | Agent-app extension, not new iris child app; supersedes the spec §6 `iris/reactforce/brain/` path |
| — | Prior session port 2026-09-03 | Absorbed `olympus-grid/ui/` prototype into `iris/reactforce/agent/src/plugins/brain/` |
| — | Mind Map session 2026-09-10 | Continuation of the port + Mind Map view work |
| — | Feature-tracker 2026-09-25 | `FT-BRAIN-GENESIS` authored in olympus-grid; source-of-truth for the 14/8/15 breakdown |
| — | Canonical brain model | `olympus-grid/docs/canonical-brain/` — Neuron / Signal / Neural Pathway / Phenotype / Receptor / Assembly design that has never before been made operational against real personal data |
| — | Steward memory `brain_agent_app_extension` | Handoff at `iris/reactforce/agent/docs/BRAIN_SESSION_HANDOFF.md` — read first |

## §5 Steward approval gate

- [ ] Discipline principle acknowledged (no fabrication; mobile-Chrome-on-iPhone IS v1)
- [ ] Canonical attestation statement locked
- [ ] Non-entanglement contract with `brain_2.7.eos-1` acknowledged (§1.6)
- [ ] Story locked (§1.1 – §1.6)
- [ ] Acceptance criteria inheritance from `FT-BRAIN-GENESIS` §3.3 (AC-1 through AC-15) confirmed
- [ ] NFRs locked — source §3.2 (NFR-1 through NFR-8) + cycle-scoped §3.9 through §3.13
- [ ] Approved to execute — signed: **__________** **__________**

---

# § Agent-authored (bottom half)

## §6 Layer impact map

**Source of truth: `FT-BRAIN-GENESIS` §4.2 (Components Affected).** 11 repos in the cross-repo map. This section captures the cross-cycle attestation dependencies not in the source.

### §6.A Repos on the critical path (11)

Refer to source §4.2 for the components-affected table. Roles in one line each:

| Repo | Role for Brain-Genesis |
|---|---|
| `iris` | Host app (`iris/reactforce/agent/`); brain plugin scaffold + PerspectiveBar + Today view + mobile fixes |
| `olympus-grid` | `.agent/localdata/` Genesis content; canonical brain model reference; iris bundle ceremony gate; feature-tracker home |
| `proteus` | Local-file adapter extending to Neuron / Signal / Pathway shapes |
| `hestia` | Model authority — Phenotypes / Receptors / Neural Pathways consumed; NOT modified |
| `plutus` | Value lens data source (real 2026-09-01-forward financial fact requirement) |
| `chronos` | Time lens data source (real future obligation requirement) |
| `athena` | Register `brain.*` tool schemas when the slice reaches Athena addressability |
| `hermes` | Route registration for new Brain endpoints |
| `ares` | Verify only — no security perimeter policy change expected |
| olympus-616 parent | Submodule pointer bump for iris + olympus-grid + proteus (+ any others touched) once each lands |
| foundation | This EOS cycle doc + `FOLLOW-UPS.md` update |

### §6.B Cross-cycle attestation linkage

- **`brain_2.7.eos-4` (kronos)** — kronos will attest §9.GEN + §9.LEN + §9.FACT + §9.iOS signals independently once its runner exists (per kronos §7 handoff protocol). Cross-cycle link: kronos-attested manifest sha256 → this cycle's §13 closeout.
- **`brain_2.7.eos-1` (HUD)** — **non-entanglement**, not linkage (§1.6). §9.NENT observes non-entanglement holds.
- **`brain_2.7.eos-3` (argos)** — argos observes every request from the brain plugin to Proteus / Athena / plutus / chronos; the observability is a side-benefit of argos landing, not a hard dependency.
- **`brain_1.7.eos-5.5` (BYOK)** — if Brain-Genesis Athena tool surface ever uses BYOK, the envelope discipline attested there applies here. Not a slice-1 dependency (v1 goes through the standard chat-turn wire).

## §7 Schema deltas

**No SObject schema changes.** Source `FT-BRAIN-GENESIS` §4.3 is explicit: existing canonical brain model in `olympus-grid/docs/canonical-brain/` is authoritative. `Neuron__c / Signal__c / NeuralPathway__c` + their permsets consumed as-is.

On-disk representation under `olympus-grid/.agent/localdata/` follows the source-mandated invariants: human-readable Markdown, git-diff-friendly, deterministic, rehydratable, portable, independent of Salesforce record IDs, based on stable logical GUIDs.

## §8 Service contracts

**Source of truth: `FT-BRAIN-GENESIS` §4.2 (component-level contracts) + spec §16 for the Athena tool surface.** Delta-relevant contracts:

### §8.1 Proteus REST surface (v1 target)
```
GET  /v1/proteus/read    { path }              → { record }
POST /v1/proteus/write   { path, record }      → { ok, adapter }
POST /v1/proteus/update  { path, patch }       → { ok, adapter }
POST /v1/proteus/search  { query }             → { records[] }
```
Adapter dispatch: `LocalFileAdapter` → `olympus-grid/.agent/localdata/{neurons,signals,pathways}/*.md`. **Higher layers never see filesystem paths; Proteus never leaks physical paths to Athena.**

### §8.2 Athena tool surface (brain.*)
Per source FR-14: `brain.search / getNeuron / createNeuron / updateNeuron / archiveNeuron / getSignals / setSignal / supersedeSignal / getPathways / connectNeurons / disconnectNeurons / getHestiaView / getProteusView / getPlutusView / getChronosView / getToday / getFinancialSummary / getUpcoming / getUnknowns`. All address logical GUIDs, never physical paths.

### §8.3 Iris deploy contract
Per §3.9 + §3.10: iris bundle ceremony + `publishAgent` discipline. No new Salesforce metadata surface; existing `Plugin.iris_deployment_path_agent` handles route.

## §9 Telemetry assertions (the close-out gate)

Every §2 AC lifted to observable shape. Signals appear during a scripted end-to-end walk of the Genesis scenario on the deployed agent app.

### §9.GEN Genesis fundamentals (AC-1 through AC-6)

- **§9.GEN-1 (Build clean)** — `iris/reactforce/agent/` builds green with Brain plugin present; `npm run build` exits 0.
- **§9.GEN-2 (Six-view render)** — Launcher / Topology / Mind Map / Node Registry / Environments / Health Matrix all render inside `Agent > Brain > …` sidenav; each view's root component mounts without React error boundary.
- **§9.GEN-3 (Drill-in from hero on mobile Chrome)** — `EntryPointRouter` (or new tile) in `AgentHome.tsx` navigates to Brain workspace; touch target ≥44pt per §NFR-1.
- **§9.GEN-4 (Proteus load — mock replaced)** — Brain reads Neurons / Signals / Pathways from `.agent/localdata/` via `/v1/proteus/read`; grep on running agent app for `mock.ts` imports returns zero hits; Proteus request logs show real file reads.
- **§9.GEN-5 (CRUD end-to-end)** — search / browse / create Neuron / update Signal / connect+disconnect Neural Pathway / archive Neuron all succeed from UI and produce readable git diffs under `.agent/localdata/`.
- **§9.GEN-6 (Persistence)** — browser reload preserves Brain state; agent-app restart preserves Brain state; both verified by identical UI rendering post-restart against a specific Neuron GUID.

### §9.LEN Four-lens invariant (AC-7 through AC-9)

- **§9.LEN-1 (Lens tab preserves selection)** — with Neuron GUID `N` selected, `PerspectiveBar` tab switches (Proteus / Hestia / Plutus / Chronos) all render `N`; the selected GUID does not change on switch. Load-bearing invariant.
- **§9.LEN-2 (No fabrication)** — each lens renders only what it truly knows. Verified by planted `unknown` values in `.agent/localdata/`: UI renders "unknown", not a fabricated placeholder. `grep` on Plutus rendered output for known-planted-unknown-values returns "unknown"; no invented balances.
- **§9.LEN-3 (Today answers four questions)** — `/brain/today` route renders four sections: *what I need to know · what is important · what can be done · what am I forgetting* — each populated from actual Brain data, not templated demo content.

### §9.FACT Genesis-content correctness (AC-10 through AC-13)

- **§9.FACT-1 (Real 2026-09-01-forward financial fact)** — at least one Signal in `.agent/localdata/` represents a real financial fact dated 2026-09-01 or later. Verified by direct file inspection during attestation; account name is an alias (`OPERATING`, `RESERVE`, `HOUSE`, `TAX`, `BROKERAGE`, `CARD_PRIMARY`) not a real account number per §NFR-3.
- **§9.FACT-2 (Real future obligation in Chronos)** — at least one Signal with `PROJECTED` or `DERIVED` provenance represents a real obligation with a real due date. Verified by direct file inspection.
- **§9.FACT-3 (Obligation affects Plutus forecast)** — the §9.FACT-2 obligation appears in the Plutus lens cash-flow-effect surface for the correct Neuron. Verified by scripted assertion against the Plutus view output.
- **§9.FACT-4 (No secrets in git diffs)** — `git diff` on `.agent/localdata/` output run against a fresh commit shows aliases only. `olympus-grid/scripts/validate-iris-bundles.sh`-analogous content check for secrets returns zero hits (no account numbers, credentials, tokens, SSNs, private keys).

### §9.iOS Real-device iPhone demo (AC-14)

- **§9.iOS-1 (Real iPhone Chrome flow)** — on a real iPhone (not DevTools emulation, not simulator), navigating to `app.olympus-grid.com/agent`, signing in, tapping Brain from the hero, rendering the complex UI, and interacting with the four-lens Neuron detail via touch — all succeeds. **Verified via LAN + screenshot artifact attached to §13**. Required per source §NFR-1 + §AC-14.

### §9.NENT Non-entanglement with `brain_2.7.eos-1` HUD + adjacent work (AC-15)

- **§9.NENT-1 (HUD untouched)** — no file in `ares/api/src/`, `ares/api/tests/`, `plutus/api/src/`, `zeus/cdk/`, `hermes/api/src/server.ts §11.5-normalize`, or `olympus-grid/force-app/**/Cluster__c/**` is modified by any Brain-Genesis commit. Verified by scripted grep + git-diff scope check on the merge commit.
- **§9.NENT-2 (varent/modernize entry-points untouched)** — no varent or modernize entry-point file is modified.
- **§9.NENT-3 (templeathena / turtleshell portals unaffected)** — the templeathena iris-portal-app at `app.olympus-grid.com/templeathena` and the turtleshell portals continue to function; smoke-tested pre- and post-Brain-Genesis merge.

### §9.OP Operational hygiene

- **§9.OP-1 (Iris bundle ceremony green)** — `validate-iris-bundles.sh` returns exit 0 on the pre-merge state of any olympus-grid PR touching static resources.
- **§9.OP-2 (Mobile viewport constraints held)** — `agent/src/**/*.scss` grep for the forbidden patterns (`html/body { height: var(--vv-height) }`, `body { padding-top: var(--vv-top) }`) returns zero hits; agent viewport meta grep for `user-scalable=no` returns zero hits.
- **§9.OP-3 (No parallel Neuron/Signal/Pathway schema)** — grep of the agent-app + Proteus code paths for any `Neuron__c` / `Signal__c` / `NeuralPathway__c` shape divergence from the canonical model returns zero hits.

## §10 Execution plan

Ordered task list. Cross-repo work per source §4.2. Reconciliation cycle — implementation substantially landed; remaining work is finishing + verifying.

### §10.1 Remaining implementation (per source's "continuation posture")

1. **Verify existing port state.** Boot `iris/reactforce/agent/` on brain/2.7.x.x; confirm the ported prototype is present + rendering. Close §9.GEN-1, §9.GEN-2.
2. **Proteus wiring.** Extend `LocalFileAdapter` if needed for Neuron / Signal / Pathway shapes; wire brain plugin selectors + thunks to `/v1/proteus/*`; remove `mock.ts`. Close §9.GEN-4.
3. **PerspectiveBar four-lens tab switcher.** Implement the tab-switch-preserves-GUID invariant. Close §9.LEN-1.
4. **Today view.** Route `/brain/today` renders four questions from actual data. Close §9.LEN-3.
5. **Genesis content (real facts).** Author at least one real 2026-09-01-forward financial fact + real future obligation into `.agent/localdata/`. Close §9.FACT-1, §9.FACT-2, §9.FACT-3.
6. **No-fabrication audit.** Grep each lens's render path; confirm `unknown` renders instead of placeholder. Close §9.LEN-2.
7. **Mobile Chrome fixes on real iPhone.** Test on LAN; iterate on touch-target + pan-zoom + sidebar collapse + TopBar shrink per §NFR-1. Close §9.iOS-1.

### §10.2 Governance + attestation

8. **Iris bundle ceremony** — run `olympus-grid/scripts/validate-iris-bundles.sh` local + verify all three invariants pre-PR. Close §9.OP-1.
9. **Non-entanglement scoped commits.** Ensure no commit touches HUD, varent/modernize, or templeathena/turtleshell scope per §9.NENT-1/2/3.
10. **§5 rulings signed and locked.** No merge before this.

### §10.3 Cross-repo merge sequence

11. **Iris merge** — brain plugin + Proteus wiring + PerspectiveBar + Today + mobile fixes to `iris` `brain/2.7.x.x`.
12. **olympus-grid merge** — Genesis content in `.agent/localdata/` + feature-tracker move to `05_test_ready/` (or later stage per olympus-grid discipline) to olympus-grid `brain/2.7.x.x`.
13. **Proteus merge** (if adapter changed) — to proteus `brain/2.7.x.x`.
14. **Parent submodule bumps** — olympus-616 parent gets iris + olympus-grid + proteus pointer bumps per `[Submodule Pointer Bump Discipline]` (explicit-attested-SHAs; auto-latest forbidden).
15. **Steward `[prod needs approval]`** for parent merge → CDK deploy.

### §10.4 Post-merge attestation

16. **End-to-end walk on real iPhone.** Steward-executed; screenshot attached to §13.
17. **Kronos independent attestation (optional in-cycle, target of a follow-up)** — once kronos runner exists (`brain_2.7.eos-4` D-2), a playbook attests §9.GEN + §9.LEN + §9.FACT + §9.iOS independently.
18. **§13 closeout.** `git mv 04_in_development → 06_shipped`. Steward signs.

### §10.5 Deferred to future cycles

- **Salesforce adapter for Proteus** — same interface, different backing; enables Brain-Genesis on real SF data.
- **BYOK-envelope wire for Athena tool surface** — when the brain.* tools graduate to sovereign-AI-BYOK (per `brain_1.7.eos-5.5`).
- **Additional lens views** — v1 is Proteus / Hestia / Plutus / Chronos only; future lenses (Aeon/Argos/Hermes as governance/observability/comm) are separate cycles.
- **Deprecation of six-view prototype's obsolete parts** — Node Registry / Environments / Health Matrix may fold or split in v2.
- **Kronos playbook for Brain-Genesis** — kronos-attests §9 signals; its own cycle authoring per kronos §7 handoff.

## §11 Verification protocol

### §11.1 Without iPhone (dev-loop)
- Local `npm run build` + `npm test` on `iris/reactforce/agent/`.
- Local dev server (`npm run agent` per iris pattern) rendering the six views.
- Scripted CRUD run against local `.agent/localdata/` producing readable git diffs.
- Grep-based non-fabrication + non-entanglement + no-secrets checks.

### §11.2 With iPhone (mandatory for close per §NFR-1 + §AC-14)
- Real iPhone on LAN connecting to the local agent-app OR to `app.olympus-grid.com/agent` post-deploy.
- Sign-in through iris auth.
- Tap Brain from hero → six-view + PerspectiveBar + Today rendered + interactive via touch.
- Screenshot per view attached to §13.

### §11.3 Kronos-attestable (post-merge, optional in-cycle)
- Kronos playbook (once runner exists) runs the §9 assertion matrix against the deployed agent app; signed manifest attached to §13.

## §12 Rollback plan

- **Feature-flag disable.** `AGENT_BRAIN_ENABLED=false` in iris agent env removes the Brain drill-in from hero + hides the plugin. UI reverts to pre-Brain agent app; no data loss.
- **Iris + olympus-grid separate reverts.** Squash-merges on each repo are single-commit reverts. Iris agent reverts to the pre-Brain-Genesis commit; `.agent/localdata/` content persists on disk in olympus-grid but is unreferenced.
- **Proteus adapter revert** (if extended) — squash-merge revert.
- **Parent submodule pointer revert.** Rolls back the CDK deploy.
- **Non-revertable elements to be honest about.**
  - `.agent/localdata/` Markdown files, once committed to olympus-grid `brain/2.7.x.x`, live in git history forever. If secrets were accidentally committed there (which §9.FACT-4 exists to prevent), rotation is required — git-history purge does not fix a public-repo leak. Prevention > cure.
  - Any Neuron / Signal / Pathway created via UI during a live session is real data; a revert of the UI does not delete the on-disk files. This is correct behavior for the digital-twin claim.

## §13 Closeout

*Filled at end of cycle.*

### What shipped
- …

### What deferred (and why)
- Salesforce Proteus adapter — future cycle.
- BYOK for brain.* tools — future cycle (`brain_1.7.eos-5.5`).
- Kronos playbook for Brain-Genesis — future cycle (`brain_2.7.eos-4` follow-up).

### What surprised
- …

### Verification evidence
- Link to `iris/reactforce/agent/` merge SHA on `brain/2.7.x.x`.
- Link to `olympus-grid` `.agent/localdata/` Genesis-content merge SHA.
- Link to `proteus` adapter merge SHA (if changed).
- Link to parent `olympus-616` submodule-pointer-bump SHA + CDK deploy log.
- Screenshots per §11.2 (real iPhone walk).
- Optional: link to kronos-attested manifest sha256 (if kronos playbook ran in-cycle).
- Link to `validate-iris-bundles.sh` exit-0 output pre-merge.

### Feedback that emerged from THIS cycle (seed for the next one)
- …

### Memory updates
- Confirm existing memory `project_brain_agent_app_extension.md` remains canonical; append v1-attestation-shipped note.
- Confirm existing memory `project_agent_bundle_deploy.md` remains canonical.
- Confirm existing memories `feedback_agent_mobile_scss_do_not_lock_body.md` and `feedback_agent_viewport_no_user_scalable.md` were honored (§9.OP-2 verified).

### Cycle close commit
- Merge SHAs: iris + olympus-grid + proteus (+ any others touched) + parent submodule bump SHA + CDK deploy log.
- Steward sign-off: **__________** **__________**

---

## References

- **Source-of-truth feature-tracker:** [`olympus-grid/docs/features/04_in_development/olympus-brain-genesis.md`](../../../../olympus-grid/docs/features/04_in_development/olympus-brain-genesis.md) (`FT-BRAIN-GENESIS`)
- **Primary contract (spec):** `olympus-grid/docs/olympus-brain-spec-athena-2.7-2026-09-01.md` (Steward-authored 2026-09-01; re-read at every session)
- **Canonical brain model:** `olympus-grid/docs/canonical-brain/` — Neuron / Signal / Neural Pathway / Phenotype / Receptor / Assembly
- **Prior-session handoff:** `iris/reactforce/agent/docs/BRAIN_SESSION_HANDOFF.md` — read first per memory `project_brain_agent_app_extension.md`
- **Non-entanglement sibling:** [`brain_2.7.eos-1.md`](brain_2.7.eos-1.md) — HUD hostile-defense; same version family, unrelated concern
- **Complementary cycles in the 2.7 family:**
  - [`brain_2.7.eos-2.md`](../02_design/brain_2.7.eos-2.md) — aeon (loop kernel)
  - [`brain_2.7.eos-3.md`](../02_design/brain_2.7.eos-3.md) — argos (observability)
  - [`brain_2.7.eos-4.md`](brain_2.7.eos-4.md) — kronos (independent adversary — will attest §9 assertions of THIS cycle post-slice-1)
- **Iris bundle ceremony:** `olympus-grid/scripts/validate-iris-bundles.sh` — mandatory per olympus-grid CLAUDE.md
- **Agent-bundle-deploy discipline:** memory `project_agent_bundle_deploy.md`
- **Mobile constraints (hard NOs):** memories `feedback_agent_mobile_scss_do_not_lock_body.md` + `feedback_agent_viewport_no_user_scalable.md`
- **EOS operating manual:** [`../README.md`](../README.md)
- **Submodule Pointer Bump Discipline:** olympus-616 parent `CLAUDE.md`
