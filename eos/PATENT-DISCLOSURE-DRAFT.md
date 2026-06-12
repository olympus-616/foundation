# Patent Disclosure Draft — EOS Cycle Methodology

> **Status:** DRAFT — not yet submitted to IP counsel
> **Author:** Gregory W. Homer (Cloudpremise LLC / non-profit foundation TBD)
> **Date opened:** 2026-05-24
> **Working title:** "System and method for governed atomic cross-repository deployment of AI-authored software changes with karmic cost accounting"

This document captures the inventive concepts of the EOS Cycle methodology in form suitable for handing to IP counsel for evaluation. It is NOT a patent application — it is a structured disclosure of the invention from which counsel can draft claims.

---

## 1. Background — the problem

Modern software systems span many independent repositories, organizations, and runtime platforms. Each repository typically has its own:
- Source-control history
- Branch-protection rules
- CI pipeline
- Deployment cadence
- Code-owner approvals

Coordinating a feature that crosses N repositories has historically required either:
- (a) Monorepo consolidation (Google, Meta) — solves coordination by collapsing the boundary, but constrains organizational independence and operational autonomy.
- (b) Multi-repo PR linking (Atlassian, GitLab, etc.) — manual coordination via cross-references; no atomicity guarantee; no governance binding.
- (c) Release-train methodologies (SAFe, scheduled releases) — time-boxed cadence; no coupling between feature coherence and the unit of release.

**AI-authored code generation breaks all three.** A coordinated AI agent can rewrite cross-platform systems in hours — frontend, backend, schema, infrastructure, telemetry simultaneously. Without a coordination primitive that matches that velocity AND imposes governance, the result is uncontrolled chaos: half-finished features, drifting schemas across services, billing logic that doesn't reconcile, deployments that race.

The EOS cycle methodology is the coordination primitive that resolves this.

---

## 2. The invention — the EOS Cycle

An **EOS Cycle** is a logical feature branch that spans every repository in a multi-repo system, governed by a single immutable document that travels through a kanban-style approval pipeline, deployed atomically across all constituent repositories upon completion, and verified by self-asserting telemetry signals captured from the running system after deployment.

### 2.1 Constituent elements

1. **Single governing document per cycle.** A markdown file with a strict two-half schema:
   - Top half (governance): user story, acceptance criteria with observable post-conditions, non-functional requirements, feedback inputs from prior cycles, explicit approval gate signed by governing stakeholders.
   - Bottom half (engineering): layer impact map across constituent repos, schema deltas, service contracts, **telemetry assertions** (specific log/data signatures that MUST appear in the next play cycle to prove cycle correctness), ordered execution plan, verification protocol, rollback plan, post-shipment closeout.

2. **Kanban approval lifecycle.** The document physically moves through numbered folder stages: backlog → planning → design → ready → executing → verifying → shipped. Each transition is a `git mv` operation; the folder location IS the cycle state.

3. **Single-open-cycle global mutex.** Across the entire universe of repositories, only one cycle may occupy stages `01_planning` through `05_verifying` at any time. The folder tree enforces this constraint structurally. The next cycle cannot enter `01_planning` until the prior reaches `06_shipped`.

4. **Atomic cross-repo squash-merge promotion.** A cycle's completion is signaled by a coordinated set of squash-merges to a designated "deployment-pointer" branch (in this implementation: `brain/1.7.x.x`) in every constituent repository simultaneously. The HEAD SHA of that branch IS the system state at any moment in time.

5. **Karmic cost accounting.** Each end-user action that occurs after cycle deployment creates a `Cycle` ledger entry that attributes cost (compute, LLM tokens, monetary spend, philanthropic tithe routing) to the action's intent chain. Ledger entries are cycle-stamped, so post-deployment SOQL/SQL/etc. queries can attribute observed system cost to the EOS cycle that introduced the capability.

6. **Self-verifying deployment.** The cycle is declared complete when, AND ONLY WHEN, the §9 telemetry assertions (machine-readable signatures in the post-deployment session logs) are satisfied. Human QA approval is not required; the system attests to its own correctness via observable signals it was instructed to emit.

### 2.2 The lifecycle (figure for IP counsel)

```
   Prior cycle's play cycle produces feedback rows
                       ↓
   Triage agent files structured root-cause tasks
                       ↓
   Governance party authors top half of new cycle doc
                       ↓
   Governance approval gate (today: single steward;
                              tomorrow: multi-party vote)
                       ↓
   AI agent authors bottom half across all repos in scope
                       ↓
   Engineering approval gate
                       ↓
   Cycle moves to executing — constituent-repo branches
   spawn, AI agent implements per the layer impact map
                       ↓
   Atomic coordinated squash-merge to deployment-pointer
   branch in every constituent repo
                       ↓
   Next play cycle's session log captured + assertions
   validated
                       ↓
   Cycle moves to shipped (immutable); closeout written;
   any emergent feedback seeds the next cycle
```

### 2.3 Distinguishing properties not found in prior art

- **Documents-as-folder-state.** The kanban is implemented in the filesystem, not in a separate workflow tool. The repo's folder tree IS the project-management state. Git history of the move operations IS the audit log.
- **Telemetry assertions as the close criterion.** Other methodologies use human QA, test coverage, or release-time approval. Here the close criterion is a structured query against post-deployment session-log data — the system attests to itself.
- **Stakeholder voting on AI-authored work units.** Future-extensible: §5 gate becomes multi-signature; on-chain or off-chain voting; ROI of completed cycle becomes inputs to the vote on the next cycle.
- **Karmic cycle ↔ EOS cycle isomorphism.** The dev-side unit of work (EOS cycle) is intentionally isomorphic to the user-side unit of experience (karmic cycle in the live system). Every dev cycle exists to enable a new class of karmic cycle; every karmic cycle is attributable to the dev cycle that minted it.
- **Cross-platform atomicity without monorepo.** The system maintains the independence of constituent repos (their own branch protection, their own CI, their own deployment pipeline) while coordinating them as a single atomic unit via the EOS cycle document.

---

## 3. Inventive claims (rough — for counsel refinement)

A non-exhaustive list of concepts that may form independent or dependent claims:

1. **Method of coordinating software changes across N independent repositories** via a single governance document that progresses through a folder-state kanban, where the folder location is the project state, and atomic completion is signaled by coordinated squash-merges to a designated deployment-pointer branch in every constituent repository.

2. **Method of verifying deployed software correctness via self-emitted telemetry assertions**, where the deployment unit specifies (in advance) the machine-readable signatures that must appear in post-deployment runtime logs, and the deployment is declared complete only when those signatures are observed.

3. **Method of attributing per-user-action cost** in a distributed AI system, by stamping each user-initiated intent chain with a unique cycle identifier propagated through all participating microservices via HTTP header conventions, and writing cost-attribution ledger entries keyed to that identifier.

4. **Method of governing AI-authored software changes** via a two-stage human approval gate, where the first stage approves the conceptual scope (governance gate) BEFORE the AI decomposes the work, and the second stage approves the decomposition (engineering gate) BEFORE the AI executes it, with each stage producing immutable artifacts in version control.

5. **System for capturing end-user feedback** as structured records with attached runtime session logs, automatically promoted by a governance party into new units of governed software change, closing the loop between observed user experience and the next deployment.

6. **Method of maintaining global single-cycle-mutex across N repositories** via a folder-tree state machine, ensuring at most one in-flight cross-repo change exists at any time, eliminating merge-conflict and accounting-attribution ambiguity that would otherwise occur from concurrent atomic deployments.

---

## 4. Embodiments

### 4.1 The instant embodiment (olympus-grid / olympus-616)

- ~30 constituent god-service repositories (Pantheon services on AWS ECS)
- Salesforce managed package (olympus-grid)
- Three client surfaces: omens (Godot/iOS), turtleshell-web (React), turtleshell-ios (Swift native)
- Iris portal (React SPA hosted inside Salesforce Experience Cloud)
- Deployment-pointer branch: `brain/1.7.x.x`
- Cycle SObject in Salesforce: `Cycle__c` (master-detail to `ApplicationProfile__c`)
- Cost ledger SObject: `LedgerEntry__c` with `Cycle__c` lookup
- Telemetry pipeline: JSONL session logs attached as ContentVersion to `Feedback__c` records
- Governance: today sole-steward (`alchemisthomer` GitHub identity); tomorrow multi-party non-profit board

### 4.2 Generalizable embodiments

- Enterprise SaaS with multiple microservices + mobile + web clients
- Open-source projects with plug-in ecosystems
- Hardware-software co-design where firmware repositories must coordinate with cloud + client repositories
- Multi-tenant platforms where customer-instance changes must coordinate with shared-infrastructure changes
- Federated systems with autonomous deployments per node, coordinated at the protocol layer

---

## 5. Prior art to distinguish against

- Trunk-based development (single branch, frequent merges) — does not address cross-repo
- Monorepo coordination (Bazel, Google's Piper, Meta's Mercurial) — solves cross-repo by removing the repo boundary
- GitOps / ArgoCD — config-driven; doesn't bind to application code changes
- Release trains (SAFe, scheduled releases) — time-boxed, not feature-coherence-bound
- Multi-repo PR linking (Atlassian, GitLab) — manual coordination, no atomicity
- Kanban project management (Trello, Jira) — separates project management from version control
- Conway's Law (Mel Conway, 1968) — observation, not coordination methodology
- Chaos engineering (Netflix, 2010s) — fault injection, not deployment coordination
- BDD / observable acceptance tests (Cucumber, 2008+) — assertion in test environment, not in live post-deployment system

The combination of (a) folder-state kanban, (b) cross-repo atomic deployment, (c) self-verifying via runtime telemetry assertions, (d) AI-authored implementation under human-governance gate, (e) cycle-stamped karmic accounting, and (f) single-open-cycle mutex is not present in any of the above.

---

## 5b. Claim 7 stub — GitHub-folder-as-governance-kanban (opened 2026-06-11 by EOS-4.1)

> **Status:** STUB — pending fuller decomposition once EOS-4.1 ships and the EOS app is observable in production. Treat the precise mechanics below as confidential operational discipline until IP counsel reviews this claim alongside Claims 1-6.

**Working title:** *"System and method for governance-as-code on a version-control substrate — using folder structure as kanban state, repository visibility as authorization model, and version-control pull requests as the atomic unit of governance transition."*

**The inventive combination claimed:**

1. **Folder-as-lane.** A version-control folder containing other folders is rendered as a kanban board where each subfolder is a swimlane and each file within is a card. The folder tree IS the kanban state — there is no separate database holding lane membership.

2. **Repository-visibility-as-authorization.** Read access to the kanban is identical to read access to the underlying repository, inherited automatically from the version-control system's existing security model (public repository = public kanban; private repository = signed-in-with-repository-access kanban). No separate ACL is maintained.

3. **Pull-request-as-transition.** Every kanban state transition — dragging a card from one lane to another, editing a card's contents, creating a new card — is committed to the repository as a pull request against the kanban's base branch. The PR becomes the durable, attributable, reviewable, and revertible record of the governance action.

4. **AI-attestation-as-PR-comment.** Autonomous AI agents publish attestations (state-change claims with evidence references) as comments on the relevant pull request via the version-control system's commenting API, creating a unified human + AI audit log on the same artifact.

5. **Frontmatter-as-control-mapping.** Each card carries YAML frontmatter listing the compliance controls (e.g., SOC-2 CC1.1, CC7.2) it touches. A dashboard reads frontmatter across the entire kanban to render a control × cycle coverage heatmap with each cell linking to the cycle's evidence section as the auditable source.

6. **Self-referential governance.** The kanban tool itself is governed by an instance of itself — the repository containing the kanban app's source has its own `eos/cycle/` folder which is the kanban that governs the app's evolution. Auditors observe that the governance tool's compliance is governed by the same controls it is auditing.

**Combined with Claims 1-6, the result is:** a governance methodology (Claims 1-6) for which the working artifact (Claim 7) is the kanban itself, the kanban is governed by the methodology, and the artifact-of-the-artifact (the kanban tool deployed via the methodology) attests its own deployment by being used to manage its own cycle.

**Prior art to distinguish from (initial pass; counsel to expand):**
- GitHub Projects / GitLab Boards — separate state store outside the repository; not folder-as-lane; not edit-as-PR.
- ZenHub / Jira on top of GitHub issues — issues are the cards, not files in folders; no folder-as-state property.
- GitBook / VuePress / mdBook — rendered docs from repository markdown; no kanban semantics; no governance transitions.
- "Wiki" features on GitHub / GitLab — pages, not folders-as-lanes; no PR-as-edit semantics (most wikis bypass PR review).
- Docusaurus or similar docs-as-code platforms — viewer, not interactive governance tool.

**Why this combination is novel:** the conjunction of (a) folder-as-state, (b) visibility-inheritance for authorization, (c) PR-as-transition, (d) AI-attestation as first-class participant, (e) frontmatter-as-compliance-mapping, and (f) self-referential governance is not present in any prior tooling we are aware of. Counsel to confirm.

**Filing strategy:** consider filing Claim 7 as a CIP (continuation-in-part) of the main EOS methodology application once provisional priority is established, OR as a separate divisional if counsel deems the kanban-tooling claim sufficiently distinct from the methodology claim to warrant its own family.

**Steward operational note (2026-06-11):** EOS-4.1 is the cycle that operationalizes Claim 7. The cycle's §13 closure (verified by the cycle itself moving through the kanban in the live app) becomes the working demonstration of inventive utility, suitable for inclusion in a continuation-in-part filing as enablement evidence.

---

## 6. Suggested next steps

1. Counsel review (US, then PCT for international).
2. Provisional filing to establish priority date (recommend ASAP given AI industry velocity).
3. Trade-secret discipline in the interim — share at conceptual level only; do not publish §9-assertion mechanics or the cross-repo coordination protocol publicly until provisional is on file.
4. Identify defensive publication strategy for portions deliberately released to the community (the methodology) vs. the proprietary tooling that automates it.
5. Trademark considerations: "EOS Cycle," "karmic cycle," "olympus-grid," "cosmos-logos" — clear the marks.

---

## 7. Working notes (operational, not for filing)

- The methodology became visible 2026-05-24 in conversation between Gregory W. Homer and the alchemisthomer AI agent, after the first EOS cycle (portal lifecycle + cycle tracking) was scoped. Prior dev cycles in this codebase had similar properties incidentally but not formally; this was the moment the pattern was named, scoped, and documented.
- The methodology builds on the recently shipped (2026-05-23/24) telemetry pipeline that captures structured session logs with HTTP envelopes, correlation IDs, and per-god content events.
- The methodology presumes the existence of an AI agent with cross-repo write authority, telemetry-pipeline understanding, and governance-document-authoring capability — i.e., a Claude-class agent operating with `alchemisthomer` credentials.
