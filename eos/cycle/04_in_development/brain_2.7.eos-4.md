---
pitch: "AI-authored adversarial testing of any platform"
---

# Kronos — Universal Adversarial Assurance Platform framework buildout

> File: `brain_2.7.eos-4.md` — **fourth primary EOS cycle on the `brain/2.7.x.x` family** (after HUD `eos-1`, aeon `eos-2`, argos `eos-3`). Source: Steward `--eos` prompt 2026-09-25 authorizing this ticket, plus the on-disk kronos framework at `kronos/`.
>
> **Section structure is non-standard for this cycle.** Kronos is a **framework-buildout cycle**, not an attestation cycle — the standard TEMPLATE §-headings (user story / criteria / NFRs / feedback / approval gate / impact map / schema / contracts / telemetry / execution / verification / rollback / closeout) fit an attestation loop poorly. Per Steward direction, §1–§9 are re-shaped to *Purpose · Scope · Approach · Attack surfaces · Guardrails · Deliverables · Handoffs · Evidence posture · Attestation claims produced*. Reverts to standard shape are non-goals — kronos will produce attestations that other cycles absorb into their §9, not attestations of its own on the standard schema.

| | |
|---|---|
| **Branch family** | `brain/2.7.x.x` (kronos's own `brain/2.7.x.x` on `git@alchemisthomer:alchemisthomer/kronos.git` — not the olympus-616 `brain/2.7.x.x`; the two branches share a name convention but not history) |
| **Cycle ordinal** | `eos-4` (fourth primary on 2.7 family; peer of HUD / aeon / argos) |
| **Status** | `In Development` — framework buildout cycle. Ticket authored by `--eos` per Steward direction 2026-09-25 as a listening-then-ticketing pass; `--kronos` owns implementation on its own repo's git discipline. §5-gate mutex on single-open-cycle does NOT apply between olympus-616 kanban cycles and kronos-repo work — different repos, no contention. |
| **Opened** | 2026-09-25 |
| **Closed** | — |
| **Prior cycle** | `brain_2.7.eos-3` (argos — the loyal watcher; kronos is the loyal adversary — together the fleet is both observed AND probed) |
| **Theme** | UAAP — the technology- and platform-agnostic adversarial assurance framework whose distinguishing property is **architectural awareness** (models target's architecture before firing tests), **platform-agnostic core + target-specific adapters**, and **reproducible signed attestable runs**. First dogfooding target: olympus-grid + the pantheon. |
| **Feedback inputs** | Steward `--eos` prompt 2026-09-25 (self-contained context); on-disk kronos framework at `kronos/` (methodology suite × 13 docs + 10 tools + content-isolation guardrails); `SECURITY.md` incident log entry `pcm.kronos-1` 2026-09-21 (framework-only rule enforcement history); `methodology/INVENTIVE-CONCEPT-CANDIDATES.md` (patent surface seed). |
| **Estimated effort** | Multi-cycle. This ticket **opens** the framework track and enumerates the seven attack surfaces; concrete implementation work happens on kronos's own repo, each slice may or may not warrant its own downstream EOS cycle depending on whether it produces claims that other cycles' §9 need to consume. |
| **Actual effort** | — |
| **Repo relationship** | kronos is **NOT** an olympus-616 submodule. The folder `kronos/` exists locally inside the olympus-616 working tree but is untracked by the parent (`?? kronos/` in parent `git status`) and points at its own remote. This is intentional and load-bearing per the framework-only rule: kronos never inherits olympus-616's git conventions, submodule pointers, or CDK deploys. |

---

## Discipline principle

> ***Kronos is the loyal adversary.*** *It says nothing false about the fleet, tests only what it has been authorized to test, and refuses to admit into its own repository any evidence, identity, or artifact that names a real target. Every run produces a signed, reproducible attestation manifest — the third evidence class (per HUD `brain_2.7.eos-1.md` discipline: PR-body-claim → CI-green → production-observed → **kronos-attested**). The fleet's §9 assertions ripen into attestation ONLY when an independent kronos run signs off. **Self-graded attestation is not attestation.***

Two consequences enforced across all sections:

1. **The framework repo is a public template. Real engagement content NEVER lives in `alchemisthomer/kronos`.** Enforced by four layers (gitignore + pre-commit + GH Action + review). This rule overrides every "let's just put it under kronos/engagements/" impulse. Prior incident `pcm.kronos-1` on 2026-09-21 demonstrates that even single-slip commits leave residue in git history that cannot be walked back — the rule holds absolutely.
2. **Ethics gate before every external target.** Every external target requires a signed `AUTHORIZATION.md` at the engagement location (scope in/out, timeframe, contact of record, ROE, Steward signature) BEFORE a single request is fired. The olympus-616 universe is Steward-authorized by construction; external targets are not.

---

## §1 Purpose / claim being pursued

**Claim.** Kronos is the Universal Adversarial Assurance Platform: a technology- and platform-agnostic security-testing + penetration-testing framework whose runs produce reproducible signed attestation manifests that turn cycle §9 telemetry assertions into third-party-verifiable claims.

**Three distinguishing properties** that make UAAP different from generic scanners (Burp / ZAP / nmap / semgrep):

1. **Architectural awareness.** Kronos ingests first-class target-model formats (OpenAPI, cosmos-logos.json manifests, Salesforce metadata, MCP tool descriptors, generic asset graphs) BEFORE it fires tests, and generates test plans aligned to the threat model implied by that architecture. Contrast with fuzz-endpoints-in-isolation.
2. **Platform-agnostic core + target-specific adapters.** The core reasons about architecture and threat models generically; adapters translate abstract test-plans into concrete requests for that stack (Salesforce, AWS, MCP, cosmos-logos, etc.).
3. **Reproducible + attestable.** Every UAAP run is a signed manifest carrying target, scope, ROE, tests, findings, evidence. This is what turns adversarial assurance into a claim the Steward can attach to an EOS §9 assertion or a customer engagement report.

**Why now.** Every god's §9 attestation today is self-graded — the god that wrote the code writes the attestation. Kronos is the independent adversary. Without it, the platform's attestation claims have no external witness; the first serious customer or auditor will ask "who verified this?" and the honest answer is "no one." Kronos becomes that witness — internally first (dogfooded against olympus-grid + the pantheon), then externally under signed authorization.

**Position in the 2.7 family.** HUD (`eos-1`) proves cost is bounded. Aeon (`eos-2`) proves the loop is self-improving. Argos (`eos-3`) proves the fleet is observed. Kronos (`eos-4`) proves the fleet is **probed by an independent adversary** — the fourth constructive property that makes the platform safe to run open-loop with real users and real money.

---

## §2 Scope

### §2.A In scope for this cycle

- **Framework buildout.** Promote the three stub subsystems currently sitting as README-only:
  - `runner/` — the runtime engine that executes assurance runs.
  - `oauth-server/` — the target-tenant OAuth handoff for authorized non-olympus targets.
  - `actions/` — the continuous-assurance automation surface.
- **Methodology hardening.** The 13-doc methodology suite (`OPERATING-MANUAL`, `SCORECARD`, `ORACLE`, `EVIDENCE`, `CATALOG`, `TOOL-BINDING`, `DOMAIN-MODEL`, `AUTONOMOUS-AUTHORIZATION`, `PLAUSIBILITY-MONITOR`, `CONTINUOUS-ASSURANCE`, `INDUSTRY-ALIGNMENT`, `INVENTIVE-CONCEPT-CANDIDATES`, `TEMPLATE`) exists but is not fully load-bearing on real runs. Each doc gets exercised against a real adapter cycle so gaps surface.
- **Tool catalog growth.** Current inventory (10 tools, 9 SF REST primitives + 1 reverse data loader). Grow the catalog under `tools/` for the surfaces enumerated in §4.
- **First olympus-grid adapter + playbook.** One target adapter + one full end-to-end playbook against a real fleet surface (Steward picks which surface per §3 open decision).
- **Evidence signing + reproducibility.** Every run emits a signed manifest per `EVIDENCE.md`; runs are byte-identically reproducible from the manifest.

### §2.B Out of scope for this cycle

- **Engagement content of any kind inside `alchemisthomer/kronos`.** Framework-only rule (§5); any engagement lives in the client's repo, a private operator repo, or a local operator workspace.
- **Remediation of findings in target repos.** Kronos surfaces findings; the owning god's agent (ares agent, hermes agent, athena agent, etc.) fixes them per §7 handoff.
- **Anything requiring an external target without an `AUTHORIZATION.md`.** Non-negotiable.
- **Kronos-in-CI wiring.** This cycle runs kronos manually + on operator command; CI-driven continuous assurance is a downstream cycle after the runner is stable.

---

## §3 Approach / open decisions

**Three decisions the Steward will pick before implementation resumes — this cycle records them as open, does NOT resolve them.**

### §3.1 Vocabulary reconciliation (unsettled — Steward-only decision)

Kronos was designed twice with divergent vocabularies. The framework must pick one surviving vocabulary before further code lands, or it will bifurcate:

| Concept | Steward's original design | kronos wake-prompt |
|---|---|---|
| Framework surface | `methodology/` | `core/` |
| Test packages | `tools/` | `adapters/` |
| Attack execution units | `runner/`+`actions/` | `playbooks/` |
| Engagement location | `templates/engagement/` (empty-kanban template) | `engagements/` (framework-side) — **rejected by framework-only rule** |
| Attestation output shape | scorecard + oracle + evidence primitives | `finding-schema` |

The Steward's original vocabulary is on disk and load-bearing (13 methodology docs, `tools/` inventory of 10). The wake-prompt vocabulary is unimplemented. **Default disposition:** keep the on-disk vocabulary; migrate any wake-prompt terminology that has semantic content the on-disk vocabulary lacks (e.g., `finding-schema` if evidence primitives don't cover it). **This is a §5 Steward ruling, not a §10 agent decision.**

### §3.2 Which stub to promote first

Three README-only stubs; the order matters because each unblocks different downstream work:

- (a) **`runner/`** first — the runtime engine. Everything else waits on the engine. If this is chosen, the first adapter dogfoods against olympus-grid the moment the engine can execute one test.
- (b) **`oauth-server/`** first — target-tenant OAuth handoff. Blocks external-target work; if the near-term plan is external customer engagements, this unlocks them. But olympus-grid is Steward-authorized-by-construction and doesn't need this.
- (c) **`actions/`** first — continuous-assurance automation. Value-multiplies once the runner exists; low value beforehand.

**Default recommendation for Steward review:** (a) `runner/` — unblocks olympus-grid dogfooding immediately; oauth-server and actions layer on top once the engine emits signed manifests.

### §3.3 Which olympus-grid surface for the first adapter

Seven surfaces enumerated in §4. One of them is the first target. Trade-offs:

| Surface | Strong bet if | Weak bet if |
|---|---|---|
| Ares perimeter (WAF + rate + IP allowlist) | HUD `brain_2.7.eos-1` §9.HUD assertions need independent witness fast | ares is stable and needs less adversarial pressure than newer surfaces |
| cosmos-logos envelope handshake | Cross-god crypto is the most subtle and most important attestation | Envelope code paths are among the newest → coverage may not exist yet |
| Ares → Hermes → Athena/Poseidon chain | Multi-hop trust is where 90% of real-world compromises land | Chain observability may not be ready to score adversary success |
| Salesforce spine (ApiRoute Apex + Site Guest + FLS) | SF is the ledger of record; SF compromise is game-over | Salesforce authorization is well-covered by native gates already |
| Ledger / telemetry (`LedgerEntry__c`, silent-drop on envelope key mismatch) | Directly attacks the "immutable ledger" claim | Requires production data to be probeable; may be too intrusive for dogfood |
| MCP tool boundary (Poseidon 50+ tools) | Every new MCP tool is a new attack surface; tests scale with catalog | Tool-boundary attacks are less mature in the industry |
| Deploy chain (GHA → ECR → CDK → ECS) | Supply chain is the highest-consequence surface | Requires infra-adjacent scope; may need Steward pre-approval per deploy target |

**Default recommendation for Steward review:** cosmos-logos envelope handshake — it's the load-bearing primitive under §9.HUD-8 (Steward's "sealed at capture" claim) and every BYOK cycle's `key_source` truth-claim. If envelope discipline fails, every downstream truth-claim collapses; if kronos verifies envelope discipline holds, every downstream cycle's §9 gains a witness by construction.

---

## §4 Attack-surface inventory (olympus-grid + pantheon)

Each surface below becomes a candidate playbook/adapter in a later cycle. This inventory is the enumerated superset — not every surface gets a first-round adapter; §3.3 picks one to open with.

| # | Surface | Key primitives | Adversarial questions |
|---|---|---|---|
| 1 | **Ares perimeter** | WAF (5 rate/managed/IPSet/BotControl rules), L1–L5 admission pipeline, L7 cluster-status gate, §11.1 IP allowlist, §2.16 CF_SECRET boundary | Can any of the 14 HUD layers be bypassed? Can rate-cap or bot-control be evaded from residential proxies or attacker-controlled CloudFront? |
| 2 | **cosmos-logos envelope handshake** | Ed25519 signing, X25519 sealed envelopes, v1 flat + v2 nested storage-inner, apple-cryptokit variant, envelope-storage-stale kill-switch, provider allowlist | Can a stale envelope be replayed? Can the god-key-rotation kill-switch be defeated? Can `x-og-provenance` be spoofed by a legitimate but malicious client? |
| 3 | **Ares → Hermes → Athena/Poseidon routing chain** | ApiRoute → Ares → Hermes → downstream god, per-hop cosmos-logos-verified, X-Cycle-ID trace, Plutus emit envelope | Can trace be forged? Can a downstream god be reached bypassing Ares? Can cross-hop identity be laundered? |
| 4 | **Salesforce spine** | ApiRoute* Apex + Site Guest User + FLS, `Cluster__c` + `Identity__c` + `LedgerEntry__c`, Platform Event triggers, IDP + JWT issuance | Can Site Guest be escalated? Can FLS be bypassed via a permset audit hole? Can a validation rule be circumvented via the API? |
| 5 | **Ledger / telemetry** | `LedgerEntry__c` insert-with-duplicate-catch, `MessageEvent__c`, silent-drop on envelope key mismatch, cluster-lifecycle immutability, per-cluster `Cycle__c` FK | Can a false positive be planted in the ledger? Can a real entry be silently dropped? Can immutable-ledger DELETE-prevention gap (per HUD §2.15) be exploited by an admin threat? |
| 6 | **MCP tool boundary** | Poseidon 50+ tools, cosmos-logos-envelope-verified per-tool, per-tool token-scope, dynamic tool-server registration | Can a tool be invoked outside its declared scope? Can a malicious MCP server be registered by exploiting `Plugin__mdt` gating? Can a legitimate tool call be replayed with a substituted token? |
| 7 | **Deploy chain** | GHA post-merge Docker → ECR → CDK → ECS, SSM key injection, submodule pointer bump discipline | Can a submodule pointer be manipulated to smuggle unmerged code into a CDK deploy? Can an SSM key rotation be un-lockstepped to break BYOK on merge (per athena `brain_1.7.eos-5.8` §2.16)? |

Each entry is intentionally worded as adversarial questions — the playbook that eventually attacks that surface answers those questions with a signed evidence manifest.

---

## §5 Guardrails / gates

All gates are structurally enforced (validator + hook + GH Action) — this section documents what MUST hold, not what someone might remember to check.

### §5.A Framework-only isolation (load-bearing; violation = existential risk)

- **G1** — Content-isolation validator (`kronos/scripts/verify-no-client-content.sh`) must stay green on every commit + every PR. Validator flags real SF org Ids (`00D...`), user Ids (`005...`), real tenant hostnames (`*.my.salesforce.com` / `*.my.site.com`), real credential files under `credentials/`, and any root-level `engagement/` folder.
- **G2** — Pre-commit hook (`kronos/.githooks/pre-commit`) invokes the validator on staged files. **Never bypassed with `--no-verify`.**
- **G3** — GitHub Action (`kronos/.github/workflows/content-isolation.yml`) invokes the validator on every PR. Cannot be locally bypassed.
- **G4** — `alchemisthomer/kronos` is a public template. Any operator request to author engagement content inside kronos triggers the escalation protocol in `kronos/CLAUDE.md` §"Escalation protocol" — pause, ask where the work should live, wait for a specific external path, proceed there.

### §5.B Ethics gate (external targets)

- **G5** — Every external target requires a signed `AUTHORIZATION.md` at the engagement location BEFORE a single request is fired. AUTHORIZATION.md carries scope in/out, timeframe, contact of record, ROE, Steward signature.
- **G6** — olympus-616 universe is Steward-authorized-by-construction; internal dogfood runs against pantheon surfaces do NOT require per-run authorization but MUST NOT probe surfaces named as "out of scope for internal dogfooding" (list TBD when the first playbook lands).

### §5.C Kronos git discipline (not olympus-616's)

- **G7** — Kronos default branch is `brain/2.7.x.x` — kronos's own, not olympus-616's. Do NOT treat kronos as an olympus-616 submodule; do NOT bump a parent submodule pointer to a kronos SHA; do NOT include kronos in a coordinated cross-repo cycle-branch merge.
- **G8** — Kronos uses per-thought branches (`@alchemisthomer/neuralpathway/<sha>-<ts>-<slug>`) per current on-disk convention. Do NOT force kronos onto the olympus-616 `cycle/eos-<N>` shared-branch pattern (which is an olympus-616-fleet convention).

### §5.D EOS-kanban discipline (this ticket's home)

- **G9** — This ticket lives in `foundation/eos/cycle/04_in_development/`. The single-open-cycle mutex on same-repo cycles does NOT apply between olympus-616 kanban cycles and kronos-repo work — different repos, no contention. This cycle may coexist with any olympus-grid or EOS-N cycle in the kanban.

---

## §6 Deliverables (initial slate — Steward will refine)

Each deliverable is a concrete artifact whose completion is verifiable; further deliverables get added as §3 decisions land.

- **D-1** — **Vocabulary decision recorded.** ADR under `kronos/docs/adr/` capturing §3.1 Steward ruling. Blocks D-2 through D-6.
- **D-2** — **`runner/` prototype.** Executes one target-agnostic assurance run end-to-end: load target model → generate test plan → invoke tool → collect observables → emit signed evidence manifest per `EVIDENCE.md`. Minimal but complete round-trip.
- **D-3** — **One olympus-grid adapter.** Dogfoods a real fleet surface (per §3.3 Steward ruling). Emits a real signed manifest that concludes something material about the surface's assurance state.
- **D-4** — **Patent surface published.** `kronos/PATENT-DISCLOSURE-DRAFT.md` authored from `methodology/INVENTIVE-CONCEPT-CANDIDATES.md`. Same DRAFT / not-yet-submitted-to-IP-counsel status as `foundation/eos/PATENT-DISCLOSURE-DRAFT.md`. Treated as attestation-critical.
- **D-5** — **Evidence-manifest signing key provisioned.** Ed25519 key generated + fingerprinted; public key published in `kronos/methodology/EVIDENCE.md`; private key held per operator's own key discipline (never in-repo). Every D-3 run signs against this key.
- **D-6** — **Continuous-assurance authoring pattern.** One `actions/` scaffold demonstrating how a signed manifest gets replayed on a schedule. README-plus-example, not full implementation — real automation is a downstream cycle.

Further deliverables (D-7, D-8, ...) get added as §3.3 opens additional surfaces beyond the first.

---

## §7 Dependencies / handoffs

### §7.A Owning agents

| Agent | Owns |
|---|---|
| `--eos` | This cycle's mechanics: kanban placement, §5 rulings, cross-cycle attestation-linking |
| `--kronos` | Framework implementation on kronos's own repo; adversarial runs; catalog + adapter authorship |
| `--olympus-grid`, `--ares`, `--hermes`, `--athena`, `--poseidon`, `--zeus`, etc. | Fixes to findings surfaced by kronos runs — kronos never patches the target |
| Steward | §3 rulings; §5 authorization; engagement content location for any non-fleet target |

### §7.B Cross-cycle attestation linking

Kronos-produced attestations flow into OTHER cycles' §9 sections, not this cycle's:

- **`brain_2.7.eos-1` (HUD)** §9.HUD assertions ripen to "kronos-attested" when a kronos run confirms the layer holds against a defeating attack. Currently self-graded; kronos closes that gap.
- **`brain_1.7.eos-5.5` (BYOK umbrella)** + `5.7` (apollo) + `5.8` (athena) §9.SOV assertions ripen when kronos confirms envelope discipline holds under adversarial pressure.
- **Future EOS-5 (builtsy §9.B / §9.T financial-integrity)** — kronos becomes the independent verifier of tithe integrity + first-dollar-through claims.
- **Every future cycle** — the standing pattern is: cycle authors self-grade §9 assertions; kronos attests them independently; cycle §13 closeout links the kronos run manifest.

### §7.C Handoff protocol for findings

When a kronos run surfaces a finding in a fleet god:

1. `--kronos` writes the finding into its evidence manifest (signed).
2. `--eos` opens (or updates) the appropriate cycle in `foundation/eos/cycle/` with the finding folded into §13 feedback OR §10 remediation.
3. `--<owning-god>` agent (e.g., `--ares` for an ares finding) patches the target repo per its own git discipline.
4. `--kronos` re-runs the playbook post-fix; second signed manifest attests the fix.
5. `--eos` moves the cycle forward on the double-manifest evidence.

Kronos NEVER patches target repos directly. Findings are read-only outputs.

---

## §8 Evidence / signing / reproducibility posture

Kronos's unique contribution to fleet governance is that every run is a **third-party-verifiable claim**, not just an internal test result. Three properties this cycle must hold from D-2 onward:

### §8.A Signed manifests

Every run emits a manifest carrying: target model, scope, ROE, tests fired, observations collected, oracle verdicts, findings, evidence blobs, cleanup receipts. Manifest is signed with kronos's Ed25519 key (D-5). Signature is verifiable independently by any relying party (Steward, customer, auditor, republic-616).

### §8.B Reproducibility

Given a signed manifest + the target's declared model at the run's timestamp, another operator can byte-identically re-execute the run and produce an equivalent manifest (up to volatile fields like timestamps and remote-request-ids). This is what turns kronos runs from "we ran a test" into "here is the run; you run it yourself and see."

### §8.C Attestation flows into other cycles

Kronos manifests are the material other cycles link in their §13 closeouts. This cycle does NOT produce standalone attestation claims — its §9 lists the *categories* of claims kronos will attest, but the actual attestation ripens inside each linking cycle. **This is intentional: kronos's value is measured by how many other cycles' §9 assertions it converts from self-graded to independently-verified.**

### §8.D Non-observability posture

Kronos runs against the fleet are themselves observable — argos (`brain_2.7.eos-3`) will pick up every kronos-generated request. This is by design: the loyal watcher (argos) sees the loyal adversary (kronos) probing the fleet, and any surprise divergence between what kronos claims and what argos observes is itself a finding. **Argos + kronos + hermes(signal→act) = the fleet's full trust triangle**: observed, probed, notifiable.

---

## §9 Attestation claims this cycle will produce

Placeholder categories — actual claims ripen inside linking cycles per §8.C. Each row below names the *shape* of attestation kronos will produce; the specific claim text is authored per-run in the linking cycle's §9 or §13.

| Category | Shape of the kronos-produced attestation | Linking cycle(s) |
|---|---|---|
| **Perimeter defense (HUD)** | *"Kronos ran playbook `<name>` against ares perimeter at `<timestamp>`; attack `<defeating action>` was refused with signal `<name>` matching umbrella §9.HUD-N. Manifest sha256: `<hash>`. Signed by kronos key `<fingerprint>`."* | `brain_2.7.eos-1` §9.HUD-1…13, §9.OP; `brain_2.7.eos-1.1` §9.ARES-*; `brain_2.7.eos-1.2` §9.HRM-* |
| **Envelope discipline (BYOK)** | *"Kronos submitted `<envelope-shape>` to `<endpoint>` at `<timestamp>`; response was `<result>` matching §9.SOV-N. Manifest sha256: `<hash>`."* | `brain_1.7.eos-5.5` §9; `brain_1.7.eos-5.7` §9.SOV; `brain_1.7.eos-5.8` §9.ATH |
| **Ledger integrity** | *"Kronos attempted `<insert / update / delete>` on `LedgerEntry__c` from `<identity>` at `<timestamp>`; result was `<expected>`. Manifest sha256: `<hash>`."* | Future EOS-5 §9.T; `brain_2.7.eos-1` §9.HUD-9, §9.HUD-12 |
| **MCP tool boundary** | *"Kronos invoked `<tool>` outside its declared scope at `<timestamp>`; boundary held / failed with signal `<name>`. Manifest sha256: `<hash>`."* | Future poseidon-scoped cycle |
| **Deploy-chain integrity** | *"Kronos manipulated `<submodule pointer OR SSM key OR ECR tag>` at `<timestamp>`; deploy chain refused / propagated with signal `<name>`. Manifest sha256: `<hash>`."* | Future deploy-hardening cycle |
| **Non-fleet target (external, authorized)** | *"Kronos ran playbook `<name>` against `<target>` at `<timestamp>` under `AUTHORIZATION.md` sha256 `<hash>`. Findings summary: `<summary>`. Full evidence manifest sha256: `<hash>`."* | External engagement location, not this kanban |

**None of the above claim text lives in this cycle.** The attestation lands in the linking cycle when the run happens. This cycle's `§13` closeout links the framework-level milestones (D-1 through D-6 completion) but not the per-run attestations.

---

## §10 Execution plan (kronos-repo git discipline)

*This cycle is opened in the EOS kanban but the actual code work happens on kronos's own repo. The plan below is a coarse sequencing hint — `--kronos` owns the fine-grained execution and per-thought branches on kronos's `brain/2.7.x.x`.*

1. **Steward rulings** on §3.1 (vocabulary), §3.2 (first stub), §3.3 (first surface). Blocks all subsequent steps.
2. **Vocabulary ADR** authored + committed to `kronos/docs/adr/`. Closes D-1.
3. **`runner/` prototype** (assuming §3.2 = runner-first) built + tested against a mock target. Closes D-2.
4. **Ed25519 signing key** provisioned per §8.A + D-5. Public key published in `kronos/methodology/EVIDENCE.md`.
5. **First olympus-grid adapter** (per §3.3 ruling) authored under `kronos/tools/` and `kronos/methodology/CATALOG.md`.
6. **First end-to-end dogfood run** against the chosen surface. Produces a signed evidence manifest per D-3.
7. **Manifest linked from the appropriate cycle's §9** — e.g., if envelope is the first surface, `brain_1.7.eos-5.5` §13 or `brain_1.7.eos-5.7` §13 gains a "kronos-attested" line with the manifest sha256.
8. **Patent disclosure draft** authored from `INVENTIVE-CONCEPT-CANDIDATES.md`. Closes D-4.
9. **Continuous-assurance authoring pattern** scaffold under `actions/`. Closes D-6.
10. **§13 closeout** on THIS ticket. `git mv 04_in_development/ → 06_shipped/`. Steward signs.

### §10.1 What NOT to do in this cycle (explicit non-goals)

- Do NOT author any engagement content inside `alchemisthomer/kronos` — framework-only rule.
- Do NOT open a per-repo cycle branch on kronos matching olympus-616's `cycle/eos-<N>` convention. Kronos uses its own per-thought pattern.
- Do NOT bump the olympus-616 parent submodule pointer to include kronos. It's untracked; keep it that way.
- Do NOT block any olympus-616 cycle on kronos completion. Cross-cycle attestation is *additive* to those cycles' close criteria, not a *replacement* for their existing §9 assertions.

---

## §11 Verification protocol

- **§11.1** — Content-isolation validator green on every kronos commit + PR (§5.A structural enforcement).
- **§11.2** — Signed manifest verification: given any manifest emitted by kronos, `openssl` (or an in-repo verify script) confirms signature against the published Ed25519 public key.
- **§11.3** — Reproducibility spot-check: for at least one D-3 run, a second operator (or the same operator on a clean machine) re-executes the manifest and produces an equivalent one. Byte-identical up to volatile fields.
- **§11.4** — Cross-cycle attestation linking: at least one olympus-616 cycle's §13 closeout gains a "kronos-attested" line with a valid manifest sha256 before this ticket closes.

---

## §12 Rollback plan

Kronos is additive to fleet governance — it never mutates target state (barring authorized destructive tests, which are I2/I3 impact-class per `EVIDENCE.md`). Rollback options:

- **Framework-level rollback.** `alchemisthomer/kronos` at any prior commit remains usable; git-revert is single-commit clean since kronos is a distinct repo without submodule dependencies.
- **Cross-cycle attestation link rollback.** If a kronos manifest is later found to be defective (bug in playbook, misapplied oracle, false positive), the linking cycle's §13 gains an appended correction row per the append-only-evidence property (per README §66-70). Prior claim is not deleted; the new evidence supersedes.
- **Non-revertable elements.** Signed manifests published to any relying party (customer, auditor, republic-616) remain evidence of what kronos claimed at that timestamp, even if later corrected. Correction is by additional evidence, not by unpublishing. This is correct behavior for an attestation framework.

---

## §13 Closeout

*Filled at end of cycle when D-1 through D-6 have completed and at least one cross-cycle attestation link has been established.*

### What shipped
- …

### What deferred (and why)
- Continuous-assurance CI wiring — after runner is stable, downstream cycle.
- Additional olympus-grid adapters beyond the first — downstream cycles, one per surface.
- External-target engagements — separate ethics-gate authorized cycles per target, engagement content lives outside kronos.
- `oauth-server/` fleshout — layered on top of runner + external-target-scoped work.

### What surprised
- …

### Verification evidence
- Link to vocabulary ADR (D-1).
- Link to `runner/` prototype commits + test run output (D-2).
- Link to first olympus-grid adapter (D-3) + signed manifest sha256.
- Link to `kronos/PATENT-DISCLOSURE-DRAFT.md` (D-4).
- Link to Ed25519 key fingerprint published in `EVIDENCE.md` (D-5).
- Link to `actions/` scaffold (D-6).
- Link to at least one olympus-616 cycle §13 that now names a kronos-attested manifest.

### Feedback that emerged from THIS cycle (seed for the next one)
- Vocabulary-reconciliation outcome + implications.
- First-surface adapter learnings that reshape the next surface's playbook.
- Any catalog governance gaps surfaced by the first real playbook.

### Memory updates
- Confirm existing memory `feedback_kronos_repo_is_framework_only.md` remains canonical (framework-only rule, `pcm.kronos-1` incident).
- New memory candidate: kronos runs are the third evidence class (PR body → CI green → prod observed → kronos-attested). Update the anti-pattern-gate discussion accordingly.

### Cycle close commit
- Framework milestone SHAs on kronos's `brain/2.7.x.x`; ADR SHA; patent-disclosure-draft SHA; signing-key fingerprint.
- Steward sign-off: **__________** **__________**

---

## References

- **Kronos repo:** `git@alchemisthomer:alchemisthomer/kronos.git` — public template; on-disk at `/Users/gregory/dev/repos/olympus-616/kronos/` (untracked by parent).
- **Kronos on-disk canon:**
  - `kronos/README.md` — public-facing summary
  - `kronos/DESIGN.md` — 94 KB design canon
  - `kronos/SECURITY.md` — content-isolation policy + `pcm.kronos-1` incident record
  - `kronos/CLAUDE.md` — operator-agent rules (loaded fresh at each session)
  - `kronos/methodology/{README, OPERATING-MANUAL, SCORECARD, ORACLE, EVIDENCE, CATALOG, TOOL-BINDING, DOMAIN-MODEL, AUTONOMOUS-AUTHORIZATION, PLAUSIBILITY-MONITOR, CONTINUOUS-ASSURANCE, INDUSTRY-ALIGNMENT, INVENTIVE-CONCEPT-CANDIDATES, TEMPLATE}.md`
  - `kronos/templates/engagement/` — empty-kanban engagement template (populated outside this repo)
  - `kronos/tools/*/manifest.yaml` — 9 SF REST primitives + 1 reverse data loader
  - `kronos/runner/README.md`, `kronos/oauth-server/README.md`, `kronos/actions/README.md` — README-only stubs
  - `kronos/scripts/verify-no-client-content.sh`
  - `kronos/.githooks/pre-commit`
  - `kronos/.github/workflows/content-isolation.yml`
- **Cycles that will consume kronos attestations:**
  - [`brain_2.7.eos-1.md`](brain_2.7.eos-1.md) — HUD (§9.HUD-*)
  - [`brain_2.7.eos-1.1.md`](brain_2.7.eos-1.1.md) — ares (§9.ARES-*)
  - [`brain_2.7.eos-1.2.md`](brain_2.7.eos-1.2.md) — hermes (§9.HRM-*)
  - [`brain_1.7.eos-5.5.md`](brain_1.7.eos-5.5.md) — BYOK umbrella
  - [`brain_1.7.eos-5.7.md`](brain_1.7.eos-5.7.md) — apollo (§9.SOV-*)
  - [`brain_1.7.eos-5.8.md`](brain_1.7.eos-5.8.md) — athena (§9.ATH-*, §9.INFRA-*, §9.PROD-*)
  - Future EOS-5 §9.B/§9.T (builtsy financial integrity)
- **Complementary primary cycles in the 2.7 family:**
  - [`brain_2.7.eos-2.md`](../02_design/brain_2.7.eos-2.md) — aeon (the self-improving loop)
  - [`brain_2.7.eos-3.md`](../02_design/brain_2.7.eos-3.md) — argos (the loyal watcher)
- **EOS operating manual:** [`../README.md`](../README.md)
- **Standing memory:** `feedback_kronos_repo_is_framework_only.md` — the FIRST RULE for kronos.
- **Founding incident:** `kronos/SECURITY.md` → `pcm.kronos-1` on 2026-09-21 (real engagement committed to framework repo, remediation record).
