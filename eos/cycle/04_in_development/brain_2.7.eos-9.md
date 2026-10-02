---
pitch: "Run the Steward's own business on the platform"
---

# cp-biz production-readiness — delete `deprecate/` + raise test coverage to ≥75% org-wide + validate-push pipeline

> File: `brain_2.7.eos-9.md` — **ninth primary EOS cycle on the `brain/2.7.x.x` family** (after HUD `eos-1`, aeon `eos-2`, argos `eos-3`, kronos `eos-4`, brain-genesis `eos-5`, poseidon `eos-6`, iris `eos-7`, olympus-gpt `eos-8`). Hardening cycle, not a feature cycle.
>
> Source: Steward authorization 2026-09-30 — *"we are making cp-biz the production version of olympus-grid to shorten deployment times but we have to work on test coverage first."*

| | |
|---|---|
| **Branch family** | `brain/2.7.x.x` |
| **Cycle ordinal** | `eos-9` (ninth primary on 2.7 family) |
| **Status** | `In Development` — Steward verbal §5 ratification 2026-09-30 + Steward started Part 1 (deprecate/ deletion) and Part 2 (coverage) on a `cycle/eos-9` olympus-grid branch concurrent with this ticket authoring. Formal §5 checkboxes pending. |
| **Opened** | 2026-09-30 |
| **Closed** | — |
| **Prior cycle** | `brain_2.7.eos-8` (olympus-gpt — sibling 2.7 primary) |
| **Theme** | cp-biz (`cloudpremise.my.salesforce.com`, Enterprise Edition PRODUCTION, OrgId `00D3k000000tHlJEAU`) becomes the **early-beta production environment** the Steward will run his business from — ahead of alpha-org's namespace-sharded multi-tenant design. Scratch orgs don't enforce 75% test coverage; cp-biz does. 15 Apex classes/triggers below threshold must reach ≥75% before validate can pass. `force-app/deprecate/**` gets removed from source + cp-biz. New `validate-push-cp-biz.yaml` workflow mirrors PR #350/#351 split-step pattern. |
| **Feedback inputs** | Steward authorization 2026-09-30; validate run `0AfPj000002HOETKA4` 2026-10-01 (the 15 coverage gaps that proved the gate); cp-biz prep state (og_pcm + backend packages uninstalled, orphan `test` permset deleted, SoqlPluginTest fix landed, backup CSV at `logs/cp-biz-cleanup-2026-09-30/`); PR #350/#351 split-step CI pattern |
| **PR** | olympus-grid cycle branch TBD (Steward starts implementation concurrent with ticket); foundation campaign PR [#84](https://github.com/olympus-616/foundation/pull/84) carries this governance ticket |
| **Estimated effort** | Part 1 (deprecate/ delete): small, mechanical. Part 2 (15 test files author): medium — 15 classes × meaningful-assertion test authoring. Part 3 (workflow): small, mirrors existing pattern. Not scoped to grow — strict adherence to the 15-class list + the deprecate/ tree + the one workflow file. |
| **Actual effort** | — |

---

## Discipline principle

> *This is a hardening cycle, not a feature cycle.* Its close criterion is binary: `sf project deploy validate --source-dir force-app --target-org cp-biz --test-level RunLocalTests --wait 60` returns status Succeeded. No new feature code. Coverage without assertions is anti-pattern — every test authored must assert on behavior that would catch a regression, not just execute lines. `deprecate/` deletion is additive-to-DELETE (not refactor-first): the folder is already excluded from packaging via `.forceignore.olympus_grid`, no active path depends on it, Steward authorized the strategic direction — execute cleanly.

**Scope lock:** three parts, enumerated in §2. Not every low-coverage class in the olympus-grid tree — the exact 15 from validate run `0AfPj000002HOETKA4`. Not every workflow fix — the one `validate-push-cp-biz.yaml`. Not a refactor pass — delete + author tests + add workflow + validate.

---

# § Steward-authored (top half)

## Canonical attestation statement

> *"I attest that `cp-biz` (cloudpremise.my.salesforce.com, Enterprise Edition PRODUCTION, OrgId 00D3k000000tHlJEAU) is prepared as the early-beta production environment for olympus-grid: that `force-app/deprecate/**` is deleted from `brain/2.7.x.x` source and destructively removed from cp-biz; that every Apex class and trigger in `olympus-grid/force-app` meets the Salesforce 75% test coverage threshold via meaningful assertions (not coverage-only execution); that `sf project deploy validate --source-dir force-app --target-org cp-biz --test-level RunLocalTests --wait 60` returns status Succeeded with 0 component errors + 0 test failures + 0 coverage violations; and that a `validate-push-cp-biz.yaml` GitHub workflow lands at `olympus-grid/.github/workflows/`, mirroring the PR #350/#351 split-step pattern (Create Validate `continue-on-error: true` + Python-based Verify), appending the Deploy ID to the brain commit's GitHub Release body with Quick Deploy instructions."*

## §1 User story

- **§1.1** As **the Steward operating his cloudpremise business today** I want **cp-biz as my early-beta production environment** so that **I can run my business on olympus-grid `brain/2.7.x.x` directly, ahead of the namespace-sharded multi-tenant design that alpha-org embodies**.
- **§1.2** As **the Steward iterating on olympus-grid changes** I want **shortened deployment times via unmanaged direct-deploy to cp-biz** so that **I don't wait on the 50-60 min alpha-org managed-package pipeline for every change — cp-biz is the fast-feedback production surface for my own business operations**.
- **§1.3** As **the olympus-grid codebase facing a REAL production org** I want **every Apex class and trigger to meet the 75% test coverage threshold Salesforce Enterprise Edition enforces** so that **validate-deploys to cp-biz pass by construction — scratch orgs don't enforce this; cp-biz does, and the gate is non-negotiable**.
- **§1.4** As **the fleet's test-authorship discipline** I want **every new test to carry meaningful assertions** so that **the coverage number isn't a Potemkin village — the tests actually catch regressions, not just execute lines**.
- **§1.5** As **the `brain/2.7.x.x` deploy pipeline** I want **a `validate-push-cp-biz.yaml` workflow mirroring PR #350/#351 split-step pattern** so that **every brain commit auto-validates against cp-biz and the resulting Deploy ID is attached to the GitHub Release body with Quick Deploy instructions — I can promote with one click when I'm ready**.

## §2 Acceptance criteria

### §2.A — Delete `deprecate/` code (Part 1)

- **§2.1 (Source deletion)** — `olympus-grid/force-app/deprecate/**` entirely removed from `brain/2.7.x.x`. Includes the following known contents: `AccountTriggerHandlerTest`, `LeadTriggerHandlerTest`, `SearchSocialSupportCtrlTest`, `SmearchAPIScheduled_TEST`, `SmearchAPIServiceTest` (the 5 ambient-RecordType failures), `AccountVersionTriggerHandlerTest`, `ActivityEventTriggerHandlerTest`, `AccountBatchTest`, `AccountQueriesTest`, `ApexJobControllerTest`, plus everything under `deprecate/notsure/`, `deprecate/old_enterprise/`, `deprecate/casequeues/`, `deprecate/send/`, `deprecate/eventmonitoring/`, `deprecate/enterprise/`.
- **§2.2 (Destructive deploy against cp-biz)** — `destructiveChanges.xml` built listing all equivalent Apex classes that got deployed to cp-biz via past managed/unmanaged pushes; destructive deploy executed against cp-biz AFTER source deletion merges. Post-deploy query confirms the deprecated classes no longer exist on cp-biz.
- **§2.3 (Additive-to-DELETE discipline)** — no refactor-first; no "move then edit"; no coverage-shuffling to preserve classes under deprecate/. Pure deletion.

### §2.B — Raise coverage to ≥75% on 15 named classes/triggers (Part 2)

Classes/triggers below 75% per validate run `0AfPj000002HOETKA4` (2026-10-01):

| Class / Trigger | Current | Needed |
|---|---|---|
| `HttpPlugin` | 0% | ≥75% |
| `HttpPluginEntry` | 0% | ≥75% |
| `HermesEmailSenderJob` | 0% | ≥75% |
| `ProcessQueueBatch` | 0% | ≥75% |
| `GoogleUserContext` | 31.52% | ≥75% |
| `GithubUserContext` | 35.56% | ≥75% |
| `FacebookUserContext` | 36.11% | ≥75% |
| `IdpCtrlExt` | 61.18% | ≥75% |
| `IPluginAbstractEntryPoint` | 66.67% | ≥75% |
| `ISoql` | 70.22% | ≥75% |
| `MicrosoftUserContext` | 70.45% | ≥75% |
| Trigger: `Identity` | 73.08% | ≥75% |
| Trigger: `ProcessQueueTrig` | 73.08% | ≥75% |
| Trigger: `ProcessTaskTrigger` | 73.08% | ≥75% |
| Trigger: `ProfileRelationshp` | 73.08% | ≥75% |
| Trigger: `TSFeedback` | 73.08% | ≥75% |
| Trigger: `Thread` | 73.08% | ≥75% |
| Trigger: `TurtleshellProfile` | 73.08% | ≥75% |

- **§2.4 (Coverage threshold)** — each named class/trigger reaches ≥75% branch coverage per `sf apex run test --test-level RunLocalTests` output against a target org.
- **§2.5 (Meaningful assertions)** — each `*Test.cls` authored or extended contains assertions on observable behavior that would catch regressions; code review rejects coverage-only tests (lines executed without assertions). Prefer negative-case assertions.
- **§2.6 (No new feature code)** — only test files authored or extended. Source Apex classes/triggers not modified in Part 2 unless strictly required to make existing behavior testable (e.g., exposing a method as `@TestVisible` — allowed; adding business logic — not).
- **§2.7 (Namespace-prefix hygiene)** — per standing memory `handler_name_namespace_prefix`, ApiRoute handler-name tests use `PackageUtil.objectDotPrefix()`; bare literals pass scratch but fail the package build. Discipline held in any new tests touching ApiRoute-adjacent code.

### §2.C — `validate-push-cp-biz.yaml` workflow (Part 3)

- **§2.8 (New workflow file lands)** — `olympus-grid/.github/workflows/validate-push-cp-biz.yaml` committed to `brain/2.7.x.x` with split-step architecture mirroring PR #350/#351 pattern: Create Validate step with `continue-on-error: true` + Python-based Verify step that parses the Validate output and asserts on it.
- **§2.9 (Deploy ID in Release body)** — on `workflow_dispatch` run against `brain/2.7.x.x`, the workflow appends the resulting Deploy ID to the brain commit's GitHub Release body with Quick Deploy instructions (per Steward direction 2026-09-30). Release body is Steward-readable + Steward-actionable via one-click promotion.

### §2.D — Close criterion (binary)

- **§2.10 (Validate passes)** — `sf project deploy validate --source-dir force-app --target-org cp-biz --test-level RunLocalTests --wait 60` returns **status Succeeded** with **0 component errors + 0 test failures + 0 coverage violations**. Deploy ID captured.

## §3 Non-functional requirements

- **§3.1 (Beta Package Build pipeline stays green)** — the existing managed-package Beta Build pipeline on `brain/2.7.x.x` MUST NOT regress during this cycle. Deletions in `deprecate/` were already .forceignored for the managed package per `.forceignore.olympus_grid`, so beta build is unaffected by Part 1; Part 2 test additions are additive and only improve the Beta Build's coverage posture; Part 3 workflow is a separate pipeline that doesn't touch the Beta Build.
- **§3.2 (`.forceignore` discipline per standing memory)** — the `.forceignore.olympus_grid` file (used by the managed-package build) is Steward-owned env config and off-limits for this cycle. Per the standing memory `olympus_grid_forceignore_environment_specific`, don't touch.
- **§3.3 (Discipline: additive-to-DELETE, not refactor-first)** — if a test under `deprecate/` happens to also provide coverage for a class under `force-app/applications/`, delete the test anyway and author a replacement in Part 2. Do not migrate `deprecate/` content into the active tree.
- **§3.4 (SF-side cleanup auditable)** — the destructive deploy against cp-biz MUST produce a deployment log Steward can inspect post-execution. No silent class deletion.
- **§3.5 (One-click promotion target)** — the Release-body Quick Deploy instructions must enable Steward to go from "validate passed" to "deploy to cp-biz" with one click or one command, no re-build.

## §4 Feedback inputs

| FB# | Title | Body excerpt |
|-----|-------|--------------|
| — | Steward authorization 2026-09-30 | *"we are making cp-biz the production version of olympus-grid to shorten deployment times but we have to work on test coverage first"* |
| — | Validate run `0AfPj000002HOETKA4` 2026-10-01 | Failed on exactly the 15 coverage gaps above. This cycle's §2.4 close criterion is one succeeding validate referencing this failing one. |
| — | cp-biz prep state 2026-09-30 (Steward session) | og_pcm managed package UNINSTALLED (via scripted Flow deactivation + permset deletion + Site reference strip + uninstall); backend package UNINSTALLED; 5x 1GP packages pending Steward UI uninstall (Lightning Buddy, GettingStarted, SF Connected Apps, SF CRM Dashboards, Sales Insights — CLI can't touch 1GP, non-blocking); Olympus_Grid Experience Cloud Site deactivated + stripped of og_pcm refs; orphan `test` PermissionSet `0PS3k000001EMkgGAG` (2020) deleted (was colliding with testCustomPermission's DUPLICATE_MASTER_LABEL); SoqlPluginTest.testgetGroupMemberWithUser fix landed on `brain/2.7.x.x` (ambient-state assertion like PR #349's testgetGroupMemberWithoutUserWithoutGroup); backup CSV of 9 og_pcm records at `logs/cp-biz-cleanup-2026-09-30/`. |
| — | PR #350 / #351 split-step pattern | `main-beta-package-build.yaml`'s split-step architecture: Create Validate (`continue-on-error: true`) + Python-based Verify step. Pattern mirrored in §2.8. |
| — | Standing memory `handler_name_namespace_prefix` | ApiRoute handler-name tests need `PackageUtil.objectDotPrefix()`. Discipline held in any new Part 2 tests touching ApiRoute-adjacent code. |

## §5 Steward approval gate

- [ ] Discipline principle acknowledged (hardening-not-feature; meaningful-assertions; scope-locked)
- [ ] Canonical attestation statement locked
- [ ] Story locked (§1.1 – §1.5)
- [ ] Acceptance criteria locked (§2.1 – §2.10)
- [ ] NFRs locked (§3.1 – §3.5)
- [ ] **Part 1 destructive deploy against cp-biz authorized** — destructive-changes against a REAL production org, Steward sign-off per standing memory `prod_deploy_approval`
- [ ] **No-new-feature-code discipline for Part 2 acknowledged** — any surface changes beyond `@TestVisible` exposure require explicit Steward override
- [ ] Approved to execute — signed: **__________** **__________**

---

# § Agent-authored (bottom half)

## §6 Layer impact map

Single-primary-repo (olympus-grid) with target cp-biz. Cross-repo touches limited to foundation (this governance ticket).

| Repo / surface | Change |
|---|---|
| olympus-grid `force-app/deprecate/` | **DELETE all** (Part 1 source) |
| olympus-grid `force-app/applications/.../classes/` + `triggers/` | **Add tests** for the 15 named classes/triggers (Part 2) — new `*Test.cls` files OR extensions to existing test files |
| olympus-grid `.github/workflows/validate-push-cp-biz.yaml` | **New workflow** (Part 3) — split-step mirroring PR #350/#351 |
| cp-biz (SF target org) | **Destructive deploy** of deprecated classes (Part 1 target); validate-deploy run (close criterion); production deploy via Quick Deploy from Release body (post-close) |
| GitHub Releases on olympus-616/olympus-grid | Deploy ID appended to brain commit's Release body with Quick Deploy instructions (Part 3 output) |
| foundation (this ticket) | Governance only — this doc + §13 closeout evidence links |

## §7 Schema deltas

**None.** This is code deletion + test authorship + workflow addition. No SObject, Plugin__mdt, or other schema changes.

## §8 Service contracts

**None.** No new HTTP endpoints, no cross-service contracts. The `validate-push-cp-biz.yaml` workflow is a CI contract (GitHub Actions pattern), not an API contract.

## §9 Telemetry assertions (the close-criterion gate)

Single-command close. The §9 shape is binary — pass or fail.

- **§9.CP-1 (validate succeeds)** — `sf project deploy validate --source-dir force-app --target-org cp-biz --test-level RunLocalTests --wait 60` returns `status Succeeded`.
- **§9.CP-2 (zero component errors)** — validate output: `componentErrors == 0`.
- **§9.CP-3 (zero test failures)** — validate output: `testFailures == 0`.
- **§9.CP-4 (zero coverage violations)** — validate output: `coverageViolations == 0`; every class in `force-app/` reports ≥75%.
- **§9.CP-5 (Deploy ID captured)** — the Succeeded run's Deploy ID is appended to the brain commit's GitHub Release body with Quick Deploy instructions.
- **§9.CP-6 (deprecate/ gone from cp-biz)** — post-destructive-deploy, SOQL query against cp-biz for the deleted Apex class names returns zero rows.
- **§9.CP-7 (`validate-push-cp-biz.yaml` runs green on dispatch)** — `workflow_dispatch` of the new workflow against `brain/2.7.x.x` tip produces a Succeeded Validate step + a Verify step that asserts on the Validate output + a Release-body annotation.

### Supplementary — assertion-quality gate (not binary, but required)

- **§9.CP-Q (meaningful-assertion review)** — every test file authored or extended in Part 2 is reviewed; the review verifies assertions reference observable behavior (not just method execution). Steward or secondary agent gate.

## §9.1 Per-merge §9.CP-* evidence log (accumulating during cycle)

Every merge to `brain/2.7.x.x` passes through `.github/workflows/deploy-push-cp-biz.yaml` and exercises the §9.CP-1..CP-5 shape against cp-biz. This log accumulates per-merge evidence as the cycle progresses toward the Part 3 validate-close in §2.4. **Each row is an attestation of the §9 SHAPE holding on a specific brain SHA — not a cycle close.** Cycle close now requires §9.CP-6 (attested below in §9.2 — destructive deploy on PR #355 commit `24466fc7`, 2026-10-02) + §9.CP-7 (attested as-built below in §9.3 — Steward direction 2026-10-02) + §9.CP-Q (assertion-quality review — Steward or secondary-agent gate, still open) + §5 formal checkbox tick + §13 closeout authoring.

**Note on deploy-vs-validate wording.** §9.CP-1's canonical formulation references `sf project deploy validate`; `deploy-push-cp-biz.yaml` runs `sf project deploy start`. The §9.CP-1..CP-4 assertion SHAPE (`status==Succeeded` · `componentErrors==0` · `testFailures==0` · `coverageViolations==0`) is identical under both; a full deploy achieving the shape is strictly stronger than validate alone — the changes actually land on cp-biz. §9.CP-5 is natively a deploy artifact (Release annotation with Deploy ID), so the deploy workflow is where it's canonically produced.

| Date (UTC) | Merge SHA · PR | Deploy ID | §9.CP-1 | §9.CP-2 | §9.CP-3 | §9.CP-4 | §9.CP-5 | Duration | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| 2026-10-02 21:34:13 | [`6954f07`](https://github.com/olympus-616/olympus-grid/commit/6954f075288eb491141ceec90ef59aa4e53522fb) · [PR #356](https://github.com/olympus-616/olympus-grid/pull/356) | `0AfPj000002HcSjKAK` | ✅ Succeeded | ✅ 1548/1548 (0 errors) | ✅ 2024/2024 (0 failures) | ✅ 0 warnings | ✅ Release [`cp-biz-deploy-6954f07`](https://github.com/olympus-616/olympus-grid/releases/tag/cp-biz-deploy-6954f07) | 1297s | [workflow run 37067617179](https://github.com/olympus-616/olympus-grid/actions/runs/37067617179) + [PR follow-up comment](https://github.com/olympus-616/olympus-grid/pull/356#issuecomment-cp-biz-deploy-post-merge) |

**Independent org-side verification (2026-10-02).** Steward verified the above row by navigating cp-biz Setup → Deployment Status directly against `cloudpremise.my.salesforce.com` (OrgId `00D3k000000tHlJEAU`). The org-side record shows: Name `0AfPj000002HcSj` · Type API · Deployed By Greg Cook · Start 3:35 PM / End 3:56 PM (21-min wall-clock, matches CI 1297s) · Number of Files 1,753 · Total Unzipped Size 44,084,215 bytes (44.08 MB) · Deploy Components 1548/1548 · Run Apex Tests 2024/2024 · Deployment Succeeded. Independent of the CI side — the GitHub Actions run observed a Succeeded status via `sf project deploy start --json`; the Salesforce org observed the same artifact via its own deployment subsystem. Both paths concur on every metric. §9.CP-1..CP-5 attested on commit `6954f07` with a two-path witness — CI emission ↔ org receipt.

**Third witness — public-side live surface rendering (2026-10-02).** Steward loaded `cloudpremise.my.salesforce-sites.com/portal/landing` in a fresh incognito session and confirmed the iris portal rendered end-to-end: tab title "Iris | Olympus-Grid", hero + body copy ("Welcome to Olympus-Grid · The Sovereign Enterprise Intelligence Layer"), sign-in panel with magic-link + Terms-of-Service checkbox, OAuth providers surfaced (Apple / Google / GitHub / Microsoft / Cognito — Coming Soon). Runtime-functional verification on the public user-facing surface — static resources propagated via Site Guest permissions, Experience Cloud Site routing resolved, auth-flow LWC wired.

**Fourth witness — admin-side version advancement (2026-10-02).** Steward loaded `cloudpremise.lightning.force.com/lightning/n/Olympus_Grid_Home` (authenticated Lightning Experience inside cp-biz) and confirmed the Olympus-Grid admin app rendered with the Grid Control Plane version banner reading **v2.7.0.2** — the version counter advanced from pre-merge state via this deploy. The "CONNECT" surface rendered with "Systems standing by..." subtitle. This proves the deployed metadata produced a user-visible version jump on the admin surface, not just a passive propagation of static assets.

**Fifth witness — EOS portal self-render (2026-10-02).** Steward loaded `cloudpremise.my.salesforce-sites.com/portal/eos/github.com/olympus-616/foundation/tree/brain%2F2.7.x.x/eos/cycle` and confirmed the EOS kanban (shipped artifact of [`brain_1.7.eos-4.1`](../06_shipped/brain_1.7.eos-4.1.md)) renders end-to-end on cp-biz: all five lanes populated (Backlog 24 · Planning 3 · Design 3 · In Development 29 · Shipped 5), SOC-2 control chips bar visible (`CC1.1`, `CC1.4`, `CC1.5` … `CC8.1`, plus `A1.1`-`A1.3` + `PI1.1`-`PI1.3`), Activity panel polling at 30s cadence surfacing recent PRs including **the open PR #89 that attests this very witness**. The three new backlog primaries from PR #86 ([`eos-12`](../00_backlog/brain_2.7.eos-12.md) anon Stripe leak · [`eos-13`](../00_backlog/brain_2.7.eos-13.md) MeteringEvent trace · [`eos-14`](../00_backlog/brain_2.7.eos-14.md) Plutus event vocabulary) render with their stored pitches as card titles — proof the `.eos/cards.json` display-metadata index is wired. **This is Patent Claim 7 (self-referential governance — "the governance tool is governed by an instance of itself") holding on a non-DevHub-connected production SF org for the first time.** The EOS kanban renders on cp-biz, including the card about the merge that deployed it.

Five witnesses concur on commit `6954f07`: CI emission (workflow outputs) · org receipt (Deployment Status UI) · public-side render (portal landing) · admin-side version advancement (Lightning Experience v2.7.0.2) · EOS portal self-render (recursive-self-attestation on new org). **The hardening story (§1) is empirically true on cp-biz across every surface: deploy infrastructure + public portal + admin app + the governance surface itself.** Formal cycle close now gated only by §9.CP-Q (assertion-quality review) + §5 formal checkbox tick + §13 closeout authoring — §9.CP-6 attested below in §9.2; §9.CP-7 attested as-built below in §9.3 per Steward direction 2026-10-02. The fifth witness also constitutes append-only evidence for [`brain_1.7.eos-4.1`](../06_shipped/brain_1.7.eos-4.1.md)'s recursive-self-attestation claim — captured there in a separate follow-up PR.

## §9.2 Part 1 attestation — §9.CP-6 (deprecate/ gone from cp-biz)

**Attested 2026-10-02 via PR [#355](https://github.com/olympus-616/olympus-grid/pull/355) · merge commit [`24466fc7`](https://github.com/olympus-616/olympus-grid/commit/24466fc76f9c10e118dfc1bde765ed5dcce991d2) merged 2026-10-02T19:44:51Z.**

Scope of the destructive manifest ([`manifest/destructiveChanges-cp-biz-deprecate.xml`](https://github.com/olympus-616/olympus-grid/blob/24466fc7/manifest/destructiveChanges-cp-biz-deprecate.xml)):

- **14 ApexClass** (the §2.1 enumerated set)
- **3 LightningComponentBundle**
- **1 AuraDefinitionBundle**
- **1 ApexPage**
- **1 CustomTab**

**Executed by** `deploy-push-cp-biz.yaml` run [37056119313](https://github.com/olympus-616/olympus-grid/actions/runs/37056119313) · **Deploy ID `0AfPj000002HbEvKAK`** · Succeeded · 1548/1548 components · 2024/2024 tests · 0 coverage warnings · 27-min wall-clock (19:44:54Z → 20:12:00Z). Release [`cp-biz-deploy-24466fc`](https://github.com/olympus-616/olympus-grid/releases/tag/cp-biz-deploy-24466fc) carries the Deploy ID + metrics.

**SOQL verification (2026-10-02 against cp-biz, OrgId `00D3k000000tHlJEAU`):**

```sql
SELECT Name FROM ApexClass WHERE NamespacePrefix = null AND Name IN
  ('AccountBatch','AccountBatchTest','AccountQueriesTest','AccountTriggerHandlerTest',
   'ApexJobController','ApexJobControllerTest','FutureHandlerJobs','LeadTriggerHandlerTest',
   'SearchSocialSupportCtrl','SearchSocialSupportCtrlTest','SmearchAPIScheduled',
   'SmearchAPIScheduled_TEST','SmearchAPIService','SmearchAPIServiceTest')
→ 0 rows
```

All 14 deprecate/ ApexClass names are gone from cp-biz. **§9.CP-6 attested.**

**Note on Deploy ID lineage.** The subsequent re-deploy on commit `6954f07` (PR #356, §9.1 above) produced a different Deploy ID (`0AfPj000002HcSjKAK`) — same `Succeeded` shape, destructive manifest a no-op the second time because source was already clean. §9.CP-6's canonical evidence is the FIRST destructive-deploy run on `24466fc7`.

## §9.3 Part 3 as-built attestation — §9.CP-7 (validate workflow)

**Attested as-built 2026-10-02 per Steward direction** — Steward verbatim: *"1 - fine as built · 2 - fine as built"* on the two §9.CP-7 gap items raised in the olympus-grid-agent close-evidence report (workflow_dispatch trigger + Release-annotation with Quick Deploy).

**As-shipped ensemble** (landed in PR [#355](https://github.com/olympus-616/olympus-grid/pull/355) commit [`24466fc7`](https://github.com/olympus-616/olympus-grid/commit/24466fc76f9c10e118dfc1bde765ed5dcce991d2)):

| Workflow | Trigger | Role |
|---|---|---|
| [`.github/workflows/validate-pr-cp-biz.yaml`](https://github.com/olympus-616/olympus-grid/blob/brain/2.7.x.x/.github/workflows/validate-pr-cp-biz.yaml) | `pull_request` | Pre-merge validate against cp-biz — gates every PR touching force-app paths |
| [`.github/workflows/deploy-push-cp-biz.yaml`](https://github.com/olympus-616/olympus-grid/blob/brain/2.7.x.x/.github/workflows/deploy-push-cp-biz.yaml) | `push` on `brain/2.7.x.x` | Post-merge full deploy with RunLocalTests + Release annotation (§9.1 log) |

**Deviations from strict §2.9 wording (both Steward-accepted 2026-10-02):**

1. No separate `validate-push-cp-biz.yaml` with `workflow_dispatch` trigger — the ensemble above covers the gate (pre-merge + post-merge).
2. No Release-body annotation with Quick Deploy (`sf project deploy quick --job-id`) snippet on validate runs — Steward promotes to cp-biz via next merge rather than mid-cycle Quick Deploy, so the one-click affordance is not required.

**Rationale accepted by Steward:**

- Pre-merge gate (`validate-pr-cp-biz`) catches PRs that would break the deploy; post-merge gate (`deploy-push-cp-biz`) performs the full deploy with Release annotation.
- The §9.CP-1..CP-5 shape is attested per-merge in §9.1 above via `deploy-push-cp-biz`; `validate-pr-cp-biz` catches regressions pre-merge.
- No mid-cycle on-demand validate is needed under the current operational cadence.

**Last pre-merge green validate run** (on PR #355's final SHA chain): run [37052731948](https://github.com/olympus-616/olympus-grid/actions/runs/37052731948) on `16ca3b69` (2026-10-02 19:13:48Z → 19:42:38Z, Succeeded).

**§9.CP-7 attested as-built.**

## §10 Execution plan

### §10.1 Pre-work verification
1. **Confirm cp-biz state** — og_pcm uninstalled, backend uninstalled, Experience Cloud Site deactivated, orphan permset gone, backup CSV present. (Already done per Steward session 2026-09-30; verify with `sf org list auth` + a `sf apex run` quick probe.)
2. **Confirm validate run `0AfPj000002HOETKA4`** is the authoritative failure baseline — the 15-class list derives from it.

### §10.2 Part 1 — delete deprecate/
3. `git rm -rf olympus-grid/force-app/deprecate/` on the `cycle/eos-9` olympus-grid branch.
4. Author `olympus-grid/manifest/destructiveChanges-cp-biz-deprecate.xml` (name indicative) listing every Apex class that got deployed to cp-biz from the deleted tree.
5. Commit the deletion + destructive-changes XML; push to cycle/eos-9 branch; open PR.
6. Deploy destructively against cp-biz: `sf project deploy start --manifest manifest/package.xml --pre-destructive-changes manifest/destructiveChanges-cp-biz-deprecate.xml --target-org cp-biz --test-level RunLocalTests` — Steward authorization gate per §5.
7. Verify §9.CP-6 post-deploy.

### §10.3 Part 2 — raise coverage to ≥75% on the 15 classes
For each of the 15 classes/triggers in §2.B's table:
8. Author or extend `<ClassName>Test.cls` with meaningful assertions covering the paths that are currently uncovered.
9. For the four 0%-current classes (`HttpPlugin`, `HttpPluginEntry`, `HermesEmailSenderJob`, `ProcessQueueBatch`), the full test suite is new.
10. For the four UserContext classes (`GoogleUserContext`, `GithubUserContext`, `FacebookUserContext`, `MicrosoftUserContext`), extend the existing test files with provider-specific paths.
11. For the triggers (7 trigger: Identity / ProcessQueueTrig / ProcessTaskTrigger / ProfileRelationshp / TSFeedback / Thread / TurtleshellProfile), author or extend the TRG_HND_* test file matching each.
12. Run `sf apex run test --test-level RunLocalTests --code-coverage --target-org dev_enterprise` iteratively; each class must reach ≥75% in the output before moving on.
13. Namespace-prefix hygiene per §2.7 — any new ApiRoute-touching test uses `PackageUtil.objectDotPrefix()`.

### §10.4 Part 3 — `validate-push-cp-biz.yaml` workflow
14. Author `olympus-grid/.github/workflows/validate-push-cp-biz.yaml` mirroring the PR #350/#351 split-step pattern:
    - **Create Validate** step: `sf project deploy validate --source-dir force-app --target-org cp-biz --test-level RunLocalTests --wait 60 --json`; `continue-on-error: true`
    - **Verify** step: Python script that parses the JSON output; asserts `status == Succeeded` + `componentErrors == 0` + `testFailures == 0` + `coverageViolations == 0`; fails the workflow if any assertion fails
    - **Annotate Release** step: on Succeeded, append the Deploy ID + Quick Deploy instructions to the GitHub Release body for the triggering brain commit
15. Trigger `workflow_dispatch` once post-merge to confirm green.

### §10.5 Close
16. Re-run `sf project deploy validate --source-dir force-app --target-org cp-biz --test-level RunLocalTests --wait 60`. Verify §9.CP-1 through §9.CP-5 all green.
17. Capture Deploy ID; verify Release body annotation per §9.CP-5.
18. Steward promotes cp-biz via Quick Deploy from Release body (post-close production step, not part of this cycle's close criterion but enabled by it).
19. **§13 closeout.** `git mv 04_in_development/brain_2.7.eos-9.md → 06_shipped/`. Steward signs.

### §10.6 Deferred to future cycles
- **cp-biz-uat as sandbox alternative** — Steward chose cp-biz prod as primary; sandbox is deferred.
- **1GP uninstalls** (Lightning Buddy, GettingStarted, SF Connected Apps, SF CRM Dashboards, Sales Insights) — Steward UI action, non-blocking for this cycle.
- **Experience Cloud Site deletion** — not required for validate success; can stay inactive.
- **Deployment-precedence memory refresh** — now cp-biz joins alpha-org as a production target with a distinct semantic (business-production vs. managed-package-production). Memory `project_deployment_precedence` should capture the dual-target reality in a future housekeeping cycle.
- **`project_salesforce_alpha_org` memory refinement** — alpha-org remains the managed-package production; cp-biz is the Steward's business production. Not stale, but the complementary context needs capturing.

## §11 Verification protocol

### §11.1 Single-command close
```bash
sf project deploy validate --source-dir force-app --target-org cp-biz --test-level RunLocalTests --wait 60
```
Succeeded = closed per §2.10 / §9.CP-1 – §9.CP-4.

### §11.2 Supporting verification
- SOQL on cp-biz for deprecated class names → 0 rows (§9.CP-6)
- `workflow_dispatch` of `validate-push-cp-biz.yaml` → green (§9.CP-7)
- Release body annotation visible on GitHub (§9.CP-5)
- Assertion-quality review per §9.CP-Q

## §12 Rollback plan

- **Part 1 (deprecate/ deletion)** — `git revert` restores source. **cp-biz destructive deploy is NOT clean-rollbackable** by git revert alone (classes have been deleted from the org); recovery requires re-deploying from source if any deleted class turns out to still be needed. This is why Steward §5 sign-off per §5 is required for the destructive step.
- **Part 2 (test authorship)** — `git revert` cleanly removes test files; no org-side effect.
- **Part 3 (workflow)** — `git revert` removes the YAML file; no running state to roll back.
- **cp-biz validate pipeline** — if the Succeeded validate reveals bugs post-promotion, the standard SF revert pattern applies (deploy an earlier Deploy ID as a Quick Deploy). This cycle doesn't own that revert mechanism; it only produces the first Succeeded Deploy ID.

**Non-revertable elements to be honest about:**
- Destructively-deleted Apex classes on cp-biz are gone from the org; recovery requires re-deploy from source.
- Historical validate failures (like `0AfPj000002HOETKA4`) remain in GitHub Actions history as the pre-close baseline — not revertable, correct behavior for an audit trail.

## §13 Closeout

*Filled at end of cycle.*

### What shipped
- …

### What deferred (and why)
- cp-biz-uat sandbox alternative — Steward chose prod as primary.
- 1GP uninstalls — Steward UI action, non-blocking.
- Experience Cloud Site deletion — not required.
- Deployment-precedence memory refresh — captured as feedback-for-next-cycle below.
- `project_salesforce_alpha_org` complementary memory update — same.

### What surprised
- …

### Verification evidence

Evidence accumulated during cycle; the "What shipped / What deferred / What surprised / Feedback" subsections above fill at Steward-authored §13 closeout.

**§9.CP-6 (deprecate/ gone from cp-biz):**
- Destructive-changes manifest: [`manifest/destructiveChanges-cp-biz-deprecate.xml`](https://github.com/olympus-616/olympus-grid/blob/24466fc7/manifest/destructiveChanges-cp-biz-deprecate.xml) on commit `24466fc7` — 14 ApexClass + 3 LightningComponentBundle + 1 AuraDefinitionBundle + 1 ApexPage + 1 CustomTab
- Destructive-deploy run: [37056119313](https://github.com/olympus-616/olympus-grid/actions/runs/37056119313) · Deploy ID `0AfPj000002HbEvKAK` · 27-min wall-clock
- GitHub Release carrying the Deploy ID + metrics: [`cp-biz-deploy-24466fc`](https://github.com/olympus-616/olympus-grid/releases/tag/cp-biz-deploy-24466fc)
- SOQL verification against cp-biz (OrgId `00D3k000000tHlJEAU`): 0 rows for the 14 named ApexClass (query reproduced in §9.2 above)

**§9.CP-7 (validate workflow as-built per Steward 2026-10-02):**
- Pre-merge validate workflow: [`.github/workflows/validate-pr-cp-biz.yaml`](https://github.com/olympus-616/olympus-grid/blob/brain/2.7.x.x/.github/workflows/validate-pr-cp-biz.yaml) on brain tip
- Post-merge deploy workflow: [`.github/workflows/deploy-push-cp-biz.yaml`](https://github.com/olympus-616/olympus-grid/blob/brain/2.7.x.x/.github/workflows/deploy-push-cp-biz.yaml) on brain tip
- Last pre-merge green validate run on PR #355's final SHA: [37052731948](https://github.com/olympus-616/olympus-grid/actions/runs/37052731948) on `16ca3b69` (2026-10-02T19:13:48Z–19:42:38Z, Succeeded)

**§9.CP-1 through §9.CP-5 (per-merge SHAPE evidence) — see §9.1 log above.**

**§9.CP-4 per-class coverage ≥75% (§2.4 / §2.B) — attested via deploy-log** `codeCoverageWarnings: []` on both runs 37056119313 (Deploy ID `0AfPj000002HbEvKAK`, commit `24466fc7`) and 37067617179 (Deploy ID `0AfPj000002HcSjKAK`, commit `6954f07`). SF enforces per-class ≥75% under `RunLocalTests`; an empty warnings array is the durable attestation of the ≥75% bar across every class in `force-app/`. Steward 2026-10-02 accepted this evidence shape as sufficient (decision #3). Current `ApexCodeCoverageAggregate` SOQL snapshot is drift-prone (aggregate gets wiped by subsequent org activity); the deploy-log is the authoritative witness.

**Part 2 merge commits in attestation window** (git log `--since=2026-10-01 brain/2.7.x.x -- '**/*Test.cls'`):
- Commit [`24466fc7`](https://github.com/olympus-616/olympus-grid/commit/24466fc76f9c10e118dfc1bde765ed5dcce991d2) — "feat(olympus-grid): cp-biz CI — PR validate + brain-push full deploy ([brain_2.7.eos-9](https://github.com/olympus-616/olympus-grid/pull/355))" — squashed-in: `580c3c76` (raise coverage on 11 under-75% classes) · `09745dd7` (loosen assertions + extend social-auth coverage) · `16ca3b69` (ctx-vs-resp assertion fix)

**Pre-close baseline:**
- SF Deploy ID `0AfPj000002HOETKA4` (2026-10-01) — the failing validate against cp-biz on the 15-class coverage gaps that this cycle closed. Referenced in `manifest/destructiveChanges-cp-biz-deprecate.xml` header comment as the audit-trail anchor.

### Feedback that emerged from THIS cycle (seed for the next one)
- Dual-target production reality (alpha-org = managed-package prod; cp-biz = Steward's business prod) needs memory + CLAUDE.md capture.
- Assertion-quality gate (§9.CP-Q) — if it reveals systematic coverage-only patterns elsewhere in the codebase, that's a seed for a wider test-authorship-review cycle.

### Memory updates
- Update `project_deployment_precedence` to reflect dual production targets.
- Refine `project_salesforce_alpha_org` to clarify the complementary cp-biz target.
- Note the PR #350/#351 split-step CI pattern as the fleet standard for validate workflows.

### Cycle close commit
- olympus-grid Part 1 + Part 2 + Part 3 merge SHAs on `brain/2.7.x.x`.
- cp-biz Deploy ID + Release body annotation link.
- foundation §13 closeout commit on this ticket.
- Steward sign-off: **__________** **__________**

---

## References

- **cp-biz target org:** `cloudpremise.my.salesforce.com` · Enterprise Edition PRODUCTION · OrgId `00D3k000000tHlJEAU`
- **Pre-close baseline:** Validate run `0AfPj000002HOETKA4` 2026-10-01 — the failing run whose 15 coverage gaps this cycle closes
- **CI pattern reference:** PR #350 / #351 split-step architecture in `main-beta-package-build.yaml`
- **Steward prep session artifacts:** `logs/cp-biz-cleanup-2026-09-30/` (backup CSV of 9 og_pcm records)
- **Standing memories applied:**
  - `olympus_grid_forceignore_environment_specific` — `.forceignore.olympus_grid` off-limits (per §3.2)
  - `handler_name_namespace_prefix` — PackageUtil.objectDotPrefix in ApiRoute tests (per §2.7)
  - `prod_deploy_approval` — Steward sign-off for prod-targeting destructive deploy (per §5)
  - `salesforce_alpha_org` — alpha-org remains managed-package prod (complementary, not superseded)
  - `deployment_precedence` — needs refinement post-close (per §13 feedback)
- **Sibling 2.7 primaries:** [`brain_2.7.eos-1.md`](brain_2.7.eos-1.md) HUD · [`brain_2.7.eos-2.md`](../02_design/brain_2.7.eos-2.md) aeon · [`brain_2.7.eos-3.md`](../02_design/brain_2.7.eos-3.md) argos · [`brain_2.7.eos-4.md`](brain_2.7.eos-4.md) kronos · [`brain_2.7.eos-5.md`](brain_2.7.eos-5.md) brain-genesis · [`brain_2.7.eos-6.md`](brain_2.7.eos-6.md) poseidon · [`brain_2.7.eos-7.md`](brain_2.7.eos-7.md) iris · [`brain_2.7.eos-8.md`](brain_2.7.eos-8.md) olympus-gpt
- **Campaign context:** [`../ATTESTATION-CAMPAIGN-2026-09-30.md`](../ATTESTATION-CAMPAIGN-2026-09-30.md) — this ticket is a stabilize-step-1 production-readiness addition to the campaign scope
- **EOS operating manual:** [`../README.md`](../README.md)
