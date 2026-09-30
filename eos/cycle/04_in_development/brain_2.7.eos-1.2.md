# Hermes hostile-defense attestation — per-repo in-flight state for PR #62 (§11.5 URL normalize + unmounted route modules)

> File: `brain_2.7.eos-1.2.md` — **second sub-attestation of `brain_2.7.eos-1`** (hostile-universe defense). Slices the **hermes** leg out of the cross-repo HUD cascade so the reviewer's split-vs-ship recommendation is captured as a governed §5 ruling, and the §11.5 audit-trail-unblock ships on the timeline HUD needs. Peer of ares' `brain_2.7.eos-1.1.md`.
>
> Companion source: Steward-provided reviewer's report *"here is the hermes info PR #62 — reconciliation review"* (2026-09-25); this cycle doc absorbs it into EOS canon.

| | |
|---|---|
| **Branch family** | `brain/2.7.x.x` |
| **Cycle ordinal** | `eos-1.2` — second per-repo sub-attestation of `brain_2.7.eos-1`; peer of `eos-1.1` (ares). |
| **Status** | `In Development` — reconciliation cycle. PR #62 in flight since 2026-08-31 (`MERGEABLE` / `CLEAN`); **zero CI checks recorded** (`gh pr checks 62` returns no checks). Steward verbal §5 ratification 2026-09-25 via direction to open the ticket AND the note *"this is in progress."* Formal §5 checkboxes pending. |
| **Opened** | 2026-09-25 |
| **Closed** | — |
| **Prior cycle** | `brain_2.7.eos-1` (umbrella — HUD; hermes #62 is §11.5 URL normalize wave; §6.A row explicitly names #62) |
| **Theme** | Hermes ships two units of work under one PR: (a) §11.5 `OLYMPUS_GRID_MASTER_URL` normalize — a P0 forensic-audit-trail unblock, +12/-1 in `server.ts` (**strong defense, cleared to ship**); (b) three unmounted route modules for sms/email/register — +737 lines of dark code with the "Research spike — not reviewed" self-warning (**weak defense, reviewer recommends split**). |
| **Feedback inputs** | Steward-provided reviewer's report 2026-09-25; PR #62 body; hostile-universe-defense v2.3 UAT 2026-08-02 (root-cause context); parent + hermes `CLAUDE.md` (branch-family + doc-obligation baselines) |
| **Estimated effort** | If SPLIT (recommended): §11.5 ships today as a P0 fix, +12/-1, cannot regress. Follow-up PR for route modules with mounts + Ares forward.ts + smoke tests + docs. If SHIPPED-AS-IS: base-branch alignment + CI proof + docs-debt acknowledgment in merge commit. **Steward ruling required (§5).** |
| **Actual effort** | — |

---

## Why this doc exists

`brain_2.7.eos-1.md` §6.A names hermes #62 as the §11.5 wave of the HUD cascade — audit-trail unblock. What it does NOT do is track hermes' own attestation loop OR resolve the reviewer-identified split-vs-ship decision + CI gap + docs-debt.

This doc is that hermes-scoped loop. It rides under the umbrella of `brain_2.7.eos-1` (no independent L-layer semantics), captures the reviewer's three meta concerns as §5 rulings, and provides the two-track close path.

The reviewer's recommendation is captured verbatim as the default position: **ship §11.5 today as a P0 fix; defer the route modules to a follow-up PR that discharges the discipline obligations**. §5 is the Steward's opportunity to override.

---

## Discipline principle

> *A PR body claiming a defense exists is implementation evidence. A green CI run is verification evidence. Production telemetry showing the forensic audit trail carries the expected `LedgerEntry__c` payload is attestation evidence. **A "Research spike — not reviewed, disabled for production" self-warning inside a merge candidate is a design smell — it means implementation and attestation are being confused.***

Two consequences enforced across sections:

1. **Dark code doesn't ship in an attestation-track PR.** If a route is disabled for production and lacks smoke tests + docs + Ares forward.ts entries, it belongs in a follow-up PR or on a research branch, not the audit-trail-unblock merge.
2. **CI proof is table stakes.** A "MERGEABLE" state with no checks recorded is not equivalent to green. Force a re-push or verify why the workflow didn't fire.

---

# § Steward-authored (top half)

## Canonical attestation statement

> *"I attest that hermes' §11.5 `OLYMPUS_GRID_MASTER_URL` normalize fix restores the Ares → Plutus → SF forensic audit trail broken by the HTTP 420 pathology observed 2026-08-02 during hostile-universe-defense v2.3 UAT; that the fix is idempotent for bare-form input and cannot regress a previously-working bare-form deployment; that CI has actually run green against the merge head; and that any co-traveling unmounted route modules are either dropped from the merge OR carry an explicit docs-debt acknowledgment in the merge commit body."*

## §1 User story

- **§1.1** As **the Steward** I want **the §11.5 URL-normalize fix to ship today as its own reviewable P0 unit** so that **the Ares → Plutus → SF forensic audit trail is unblocked without waiting on the unrelated route-module research spike**.
- **§1.2** As **the alchemisthomer agent** I want **the split-vs-ship decision to be captured as an explicit §5 ruling** so that **the reviewer's recommendation is not silently overridden by an "ok fine merge it all"** — either option is defensible; **only the choice must be recorded**.
- **§1.3** As **the ops team** I want **CI to have actually run green on the merge head** so that **the "MERGEABLE" state is backed by build+test proof and not by the absence of checks**.
- **§1.4** As **the Steward** I want **the base-branch question resolved** — `brain/1.7.x.x` vs `brain/2.7.x.x` — so that **whichever is production tip is named explicitly** and every downstream parent-repo submodule pointer + CDK deploy trigger follows the same choice.
- **§1.5** As **the hermes agent** I want **the legacy `@alchemisthomer/neuralpathway/…` branch grandfathered for this one merge** so that **the squash-merge collapses the naming inconsistency at brain level; next hermes increment moves to shared `cycle/eos-<N>` per parent CLAUDE.md**.

## §2 Acceptance criteria

Each criterion is observable end-to-end and closes one reviewer-identified obligation.

### §2.A §11.5 URL normalize (strong defense — ships)

- **§2.1 (Idempotent normalize behavior)** — **Given** `OLYMPUS_GRID_MASTER_URL` is set with any of the following shapes:
  - `https://host/portal/services/apexrest`
  - `http://host/portal/services/apexrest`
  - `host/portal` (bare form)
  **when** the normalize in `server.ts:598-601` fires **then** the operative URL in the hermes grid-master proxy is `host/portal` (idempotent for bare-form; strips scheme + `/services/apexrest` suffix from fully-qualified form).
- **§2.2 (No regression on bare-form deployments)** — The normalize is idempotent for bare-form input; **cannot regress any previously-working bare-form deployment**. Verified by unit test with bare-form input → identity output.
- **§2.3 (Ares → Plutus → SF audit trail unblocked)** — **Given** a curl-through-ngrok → Ares `pathAllowlist` 404 → `emitToPlutus` → Plutus batch drain → Ares proxy → Hermes → SF Site Guest **when** the full chain runs against the merged image **then** a `LedgerEntry__c` row lands with the full forensic payload. Closes UAT item 8 in `olympus-grid/docs/handoff-domain-refactor-status-2026-08-02.md` §7.

### §2.B Unmounted route modules (weak defense — Steward split-vs-ship ruling required)

- **§2.4 (Verify unmounted at merge)** — **Given** commit `63cd404` adds `email.ts`, `sms.ts`, `register.ts` totaling +737 lines **when** the merge lands **then** the imports in `hermes/api/src/server.ts` lines 26-28 and the `app.use` calls at lines 554-556 remain COMMENTED OUT. Verified pre-merge. **This closes the "verified unmounted" claim from `brain_2.7.eos-1.md` §6.A hermes co-traveling row.**
- **§2.5 (Reviewer recommendation — SPLIT)** — Ship §11.5 as its own PR (cherry-pick / rebase to isolate commit `cb6e71d`); defer commit `63cd404` to a follow-up PR that adds:
  - Mounts uncommented (imports + `app.use`)
  - Ares `forward.ts` entries for the new public-facing surfaces (register endpoint, inbound SMS webhook)
  - Twilio + SendGrid signature verification
  - Smoke tests for each route
  - Mirror docs under `docs/api/src/routes/{email,sms,register}.md`
  - `CHANGELOG.md` entry
  - `README.md` manifest update
  - Security review sign-off on the public-ingress surfaces
- **§2.6 (Alternative — SHIP-AS-IS with acknowledgment)** — If Steward overrides the split recommendation and ships PR #62 as-is:
  - Base-branch alignment resolved (§2.7 below)
  - CI has actually run green (§2.8 below)
  - Merge commit body **explicitly acknowledges** the +737-line docs-debt AND names the follow-up cycle where mounts + Ares entries + tests + docs will land

### §2.C Meta concerns (three, all reviewer-flagged)

- **§2.7 (Base-branch resolved)** — **Given** the PR targets `brain/2.7.x.x` AND `origin/brain/1.7.x.x` and `origin/brain/2.7.x.x` currently point at the same commit (`ae21237`) — the choice is cosmetic AT THE MOMENT but must not remain implicit. Steward ruling:
  - (a) `brain/2.7.x.x` is the new production tip — CLAUDE.md updated across parent + hermes; every submodule pointer + CDK deploy trigger follows.
  - (b) `brain/2.7.x.x` was a mistake — retarget PR #62 to `brain/1.7.x.x`; postpone the 2.7 rollout to a coordinated cycle.
- **§2.8 (CI actually ran green)** — **Given** `gh pr checks 62` currently returns "no checks reported" **when** a re-push OR manual workflow re-trigger fires the `pr.yml` (or successor) workflow **then** the head SHA carries a non-empty `statusCheckRollup` with all green. **Both source PRs (#59, #61) had green CI on their own branches; this consolidation branch must earn the same evidence, not inherit it.**
- **§2.9 (Documentation obligations discharged — hermes CLAUDE.md contract)** — Per hermes `CLAUDE.md`: *"A PR that modifies source without updating corresponding documentation is incomplete."* If SPLIT: §11.5 gets a minimal mirror-docs update; route modules are deferred. If SHIP-AS-IS: mirror docs under `docs/api/src/routes/{email,sms,register}.md` + `CHANGELOG.md` entry + `README.md` manifest update land in the same merge.

### §2.D Branch discipline

- **§2.10 (Grandfathered branch pattern)** — Head branch `@alchemisthomer/neuralpathway/ae21237-eb20e1e-20260831143540-hermes-missing-routes-and-11-5-normalize-consolidation` predates the `cycle/eos-<N>` convention. Squash-merge collapses the naming inconsistency at brain level; future hermes increments move to `cycle/eos-<N>` per parent CLAUDE.md.

## §3 Non-functional requirements

- **§3.1 (Normalize idempotency invariant)** — `normalizeUrl(normalizeUrl(x)) === normalizeUrl(x)` for every input `x`. Enforced by unit test.
- **§3.2 (No hidden action from unmounted code)** — Any code in the merged image that is imported but not routed by `app.use` MUST NOT be reachable from any HTTP path. Verified pre-merge by grep + smoke.
- **§3.3 (Public-ingress-safety gate for route modules)** — If §2.6 (SHIP-AS-IS) is chosen, the follow-up cycle that MOUNTS these routes MUST land Twilio/SendGrid signature verification + Ares forward.ts entries + security-review sign-off BEFORE the mount lines are uncommented. Merged-but-unmounted is one thing; mounted-without-verification is unacceptable.
- **§3.4 (Base-branch coherence)** — Whichever branch is chosen at §2.7, CLAUDE.md at parent + hermes MUST name it as production tip. Ambiguity forces per-agent guessing on future cycles.
- **§3.5 (Documentation completeness in the shipped scope)** — Per hermes CLAUDE.md; any modified route's docs update ships in the same PR as the code.
- **§3.6 (Test coverage — §11.5 fix)** — Unit test for normalize idempotency AND integration test for the full Ares → Hermes chain closing UAT item 8.

## §4 Feedback inputs

| FB# | Title | Body excerpt / evidence |
|-----|-------|-------------------------|
| — | Steward reviewer's report 2026-09-25 | *"here is the hermes info PR #62 — reconciliation review"* — full contents + split-vs-ship recommendation |
| — | PR #62 body | Consolidates #59 + #61; discloses "Research spike — not reviewed, disabled for production" for route modules |
| — | HUD v2.3 UAT 2026-08-02 | HTTP 420 pathology on every Plutus ledger POST → SF Site Guest; motivating incident for §11.5 |
| — | `olympus-grid/docs/handoff-domain-refactor-status-2026-08-02.md` §7 | UAT item 8 (audit-trail forensic payload) closed by §11.5 |
| — | HUD umbrella `brain_2.7.eos-1.md` §6.A | Names hermes #62 as §11.5 wave; verified-unmounted assertion is inherited here (§2.4) |
| — | Ares sibling `brain_2.7.eos-1.1.md` §2.6 (CI-has-run) | Same anti-pattern (green PR body + empty statusCheckRollup) flagged in the ares sibling; hermes gets the same treatment |
| — | Parent + hermes CLAUDE.md | Branch naming (`brain/1.7.x.x` vs `brain/2.7.x.x`) + documentation obligation baselines |

## §5 Steward approval gate

- [ ] Discipline principle acknowledged (dark code doesn't ship in an attestation-track PR; CI proof is table stakes)
- [ ] Canonical attestation statement locked
- [ ] Story locked (§1.1 – §1.5)
- [ ] Acceptance criteria locked (§2.1 – §2.10)
- [ ] NFRs locked (§3.1 – §3.6)
- [ ] **Ruling on §2.5 vs §2.6** — split PR (SHIP §11.5 alone, defer route modules to follow-up) OR ship-as-is with docs-debt acknowledgment:
  - [ ] (a) SPLIT — recommended by reviewer; §11.5 ships today as its own PR
  - [ ] (b) SHIP-AS-IS — override with docs-debt named in merge commit + follow-up cycle scheduled
- [ ] **Ruling on §2.7 base branch** — resolve `brain/1.7.x.x` vs `brain/2.7.x.x`:
  - [ ] (a) `brain/2.7.x.x` is production tip — CLAUDE.md updates + submodule pointer + CDK follow
  - [ ] (b) retarget to `brain/1.7.x.x` — postpone 2.7 to coordinated cycle
- [ ] **Confirmation on §2.8** — CI re-triggered and green on head SHA
- [ ] Approved to execute — signed: **__________** **__________**

---

# § Agent-authored (bottom half)

## §6 Layer impact map

Single-repo × single-HUD-slice (hermes). Coordination with ares called out.

| Criterion | hermes | ares | plutus (as consumer of audit trail) |
|---|---|---|---|
| §2.1–§2.3 §11.5 normalize | `server.ts:598-601` idempotent normalize + integration test | consumes Hermes proxy in ares → plutus chain | receives ledger POSTs with restored forensic payload |
| §2.4 unmounted verification | grep + smoke on merged image | — | — |
| §2.5 SPLIT (recommended path) | cherry-pick `cb6e71d` to new PR; commit `63cd404` deferred | — | — |
| §2.6 SHIP-AS-IS (override path) | mirror docs + CHANGELOG + README update in same PR | — | — |
| §2.7 base branch | retarget or align | — | — |
| §2.8 CI | re-trigger workflow | — | — |
| §2.9 docs | mirror docs under `docs/api/src/routes/*` | — | — |
| §2.10 branch grandfathering | squash-merge collapses branch shape | — | — |

## §7 Schema deltas

None. This cycle is code-hygiene + a config normalize; no schema changes on either side of the Ares → Hermes → SF chain.

## §8 Service contracts

### §8.1 `OLYMPUS_GRID_MASTER_URL` normalize (§11.5)

Input shapes accepted (equivalence class):
- `https://host/portal/services/apexrest` → normalized to `host/portal`
- `http://host/portal/services/apexrest`  → normalized to `host/portal`
- `host/portal`                             → normalized to `host/portal` (identity)

Behavior contract: `normalizeUrl(normalizeUrl(x)) === normalizeUrl(x)` for every `x`.

### §8.2 Unmounted route modules (dark code — no contract until mounted)

`email.ts` / `sms.ts` / `register.ts` are imported but not `app.use`-mounted. Their contracts activate only when mounts are uncommented in a follow-up PR that also lands Ares forward.ts entries + signature verification. This cycle intentionally does NOT define their public HTTP contracts.

## §9 Telemetry assertions (the close-out gate)

### §9.HRM Hermes-specific verification

- **§9.HRM-1 (normalize idempotency)** — Unit test file `hermes/api/src/util/normalizeUrl.test.ts` (path indicative; actual location per hermes agent) runs green with idempotency invariant + all three input shapes covered.
- **§9.HRM-2 (audit trail restored)** — Full-chain integration smoke against int cluster: `curl → ngrok → ares pathAllowlist 404 → emitToPlutus → plutus batch drain → ares proxy → hermes → SF Site Guest → LedgerEntry__c`. Query for the LedgerEntry row via SOQL; verify forensic payload fields (`request_id`, `path`, `client_ip`, `plutus_meta`, timestamp) present.
- **§9.HRM-3 (unmounted stays unmounted)** — On the merged image, `grep -E "app\.use\(['\"]/(?:email|sms|register)" hermes/api/src/server.ts` returns zero matches. Curl to `POST /email`, `POST /sms`, `POST /register` returns 404 (route not mounted).
- **§9.HRM-4 (CI green on head)** — `gh pr checks 62` (or successor PR number if SPLIT) shows non-empty `statusCheckRollup` with all green on the merge head SHA.
- **§9.HRM-5 (base-branch coherence)** — After §2.7 ruling, parent CLAUDE.md + hermes CLAUDE.md name the same production-tip branch. `grep` across CLAUDE.md files returns consistent naming.
- **§9.HRM-6 (docs discharged)** — For every source file modified in the merge scope, a corresponding mirror doc exists under `docs/api/src/**` OR the merge commit body explicitly acknowledges docs-debt (SHIP-AS-IS path only).

### §9.OP Operational hygiene (inherits from ares sibling)

- **§9.OP-1** — Anti-pattern gate: any hermes PR with `mergeStateStatus: CLEAN` AND empty `statusCheckRollup` is refused merge until CI runs green. (Recorded as a memory candidate for future PRs.)

## §10 Execution plan

### §10.1 Steward rulings (blocking)

1. §5 rulings resolved: (§2.5 SPLIT vs SHIP-AS-IS), (§2.7 base-branch), (§2.8 CI proof planned).

### §10.2A If SPLIT (reviewer-recommended path)

2a. **Cherry-pick or rebase commit `cb6e71d`** to a fresh branch (`cycle/eos-<N>` per parent CLAUDE.md, or grandfathered branch per §2.10).
3a. **Open new PR** — §11.5 URL normalize alone. Body links this EOS doc.
4a. **Trigger CI** on the new PR. Close §9.HRM-4.
5a. **Add unit test + mirror doc** for the normalize in the same PR.
6a. **Merge new PR** to base per §2.7 ruling. Close §2.1–§2.3.
7a. **Close PR #62** with a comment linking the new PR + noting the route modules are deferred to a follow-up cycle (§10.4).

### §10.2B If SHIP-AS-IS (override path)

2b. **Verify unmounted** on the current PR head. Close §2.4.
3b. **Add mirror docs** for `email.ts` / `sms.ts` / `register.ts` under `docs/api/src/routes/*` — describing them as dark code pending mount + Ares entries + verification. Explicitly documented as deferred.
4b. **Add CHANGELOG entry** + `README.md` manifest update.
5b. **Trigger CI** on the PR head. Close §9.HRM-4.
6b. **Merge PR #62** to `brain/2.7.x.x` (or per §2.7 ruling) with merge-commit body explicitly acknowledging the 737-line docs-debt + naming the follow-up cycle (§10.4).

### §10.3 Post-merge fleet promotion (either path)

7. **Docker rebuild → ECR push** fires automatically on merge.
8. **Parent submodule pointer bump** on olympus-616 (parent PR #198 or successor). Explicit-attested-SHA per `[Submodule Pointer Bump Discipline]`.
9. **CDK deploy** promotes to int. Steward `[prod needs approval]` gates prod promotion.
10. **Int smoke** — §9.HRM-2 full-chain audit-trail verification against the deployed int cluster.

### §10.4 Follow-up cycle (if SPLIT — recommended; or if SHIP-AS-IS with docs-debt named)

11. **New cycle: hermes public-ingress mount** — uncomments imports + `app.use`; adds Ares forward.ts entries; adds Twilio + SendGrid signature verification; adds smoke tests; adds mirror docs; security-review sign-off. Opens as its own EOS doc when ready.

### §10.5 Deferred

- Move to `cycle/eos-<N>` shared branch pattern for the next hermes increment (§2.10).
- CLAUDE.md base-branch sweep across parent + hermes + every mentioning god — housekeeping cycle after §2.7 ruling.

## §11 Verification protocol

### §11.1 Without iPhone (this cycle's entire scope)

- `npm test` on hermes for §9.HRM-1 normalize idempotency invariant.
- `gh pr checks <N>` for §9.HRM-4 CI green.
- Manual curl chain (or scripted) against int cluster for §9.HRM-2 audit-trail restoration.
- `curl` to unmounted routes for §9.HRM-3 (expect 404).
- `grep` across CLAUDE.md files for §9.HRM-5 base-branch coherence.

### §11.2 With iPhone

Not required for this cycle. Hermes chain is server-side.

## §12 Rollback plan

- **PR revert (either path).** Squash-merge is single-commit revert. Middleware chain returns to pre-consolidation shape. The bare-form `OLYMPUS_GRID_MASTER_URL` reverts to the pre-normalize condition (audit-trail HTTP 420 pathology resumes; UAT item 8 re-opens).
- **Config workaround if code revert is undesirable.** Since the fix is idempotent, redeploying with `OLYMPUS_GRID_MASTER_URL=host/portal` (bare form) has the same effect as the normalize; a revert can be worked around via env-var change without re-deploy.
- **Non-revertable elements to be honest about:**
  - **`LedgerEntry__c` rows written after merge** with the restored forensic payload are immutable per Plutus discipline (`brain_2.7.eos-1` §2.15). Rollback restores schema but leaves history in place — correct behavior.
  - **CLAUDE.md renames** (if §2.7 (a) is chosen) span multiple repos; a partial revert leaves the fleet with mixed CLAUDE.md branch naming. Revert the CLAUDE.md changes as a bundle or not at all.

## §13 Closeout

*Filled at end of cycle.*

### What shipped
- …

### What deferred (and why)
- Route-module mount + Ares forward.ts + signature verification + docs + security review → follow-up cycle (§10.4).
- Move to `cycle/eos-<N>` shared branch — next hermes increment.
- CLAUDE.md base-branch sweep across fleet — housekeeping cycle.

### What surprised
- …

### Verification evidence
- Link to §9.HRM-1 unit test run.
- Link to §9.HRM-2 int-cluster audit-trail smoke.
- Link to §9.HRM-3 unmounted-route grep + curl-404 evidence.
- Link to green `gh pr checks` output on merge head (§9.HRM-4).
- Link to CLAUDE.md consistency grep (§9.HRM-5).
- Link to `brain/<production-tip>` post-merge hermes SHA + parent submodule bump SHA + CDK deploy log.

### Feedback that emerged from THIS cycle (seed for the next one)
- Anti-pattern gate memory: green PR body claim + empty `statusCheckRollup` is not evidence.
- Base-branch coherence sweep needed across fleet CLAUDE.md files.

### Memory updates
- Anti-pattern: "MERGEABLE = merges cleanly, NOT that CI ran green." Same as the existing `MERGEABLE ≠ works` memory but extended for CI-never-ran case.

### Cycle close commit
- PR #62 (or SPLIT successor) merge SHA + parent submodule bump SHA + CDK deploy log.
- Steward sign-off: **__________** **__________**

---

## §9-observed appendix — 2026-09-30 production deploy (code-identity attestation)

**Deploy record:** [`../DEPLOY-2026-09-30.md`](../DEPLOY-2026-09-30.md) — parent `841c222` · hermes submodule ptr `b9e46fe` · Steward-verified 2026-09-29.

**Code identity for hermes:** ✓ VERIFIED — boot log shows `Hermes.server Version: 1.7.4, Boot Complete, God proxy ready: 33 routes` + `facade.ready mount=/omens, catalog.loaded universes=15 books=18 chapters=346 scenes=1040 from /app/omens/content` (Heracles canon facade) + `persona.ready codename=logos name=Logos routes=[.well-known/cosmos-logos.json, cosmos-logos.json, chat]` (Logos persona facade).

**§9 behavior signals: NOT YET TESTED.** Per Steward direction 2026-09-29 (*"especially related to the security updates"*), every §9.HRM signal remains unverified against the deployed state. §11.5 URL-normalize behavior + full-chain audit-trail restoration + unmounted-routes-return-404 smokes all pending. Attestation pass per DEPLOY-2026-09-30 priority sequence **step 3**.

**Deploy carried the §11.5 HUD-required scope.** The unmounted route modules disposition (split-vs-ship per §5) remains open and does not affect deploy.

**Ticket-specific follow-ups from deploy:** none directly (hermes not implicated in the surfaced findings).

---

## References

- **Umbrella cycle:** [`brain_2.7.eos-1.md`](brain_2.7.eos-1.md) — HUD L1–L14 cascade; hermes #62 is the §11.5 wave (§6.A row); this doc is its per-repo attestation loop.
- **Peer sub-attestation (ares):** [`brain_2.7.eos-1.1.md`](brain_2.7.eos-1.1.md) — same shape for ares W3+W4.
- **Hermes PR #62:** [`fix(hermes): consolidate missing sms/email/register route modules (#61) + §11.5 OLYMPUS_GRID_MASTER_URL normalize (#59)`](https://github.com/olympus-616/hermes/pull/62)
- **HUD v2.3 UAT 2026-08-02:** `olympus-grid/docs/uat-sweep-2026-08-03.md` — UAT item 8 closed by §11.5.
- **Handoff:** `olympus-grid/docs/handoff-domain-refactor-status-2026-08-02.md` §7 — audit-trail forensic payload.
- **EOS operating manual:** [`../README.md`](../README.md)
- **Submodule Pointer Bump Discipline:** olympus-616 parent `CLAUDE.md`
