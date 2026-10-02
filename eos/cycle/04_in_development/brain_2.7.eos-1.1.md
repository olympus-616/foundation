---
pitch: "Gateway refuses hostile traffic before it costs us money"
---

# Ares hostile-defense attestation — per-repo in-flight state for PR #66 (W3+W4 + §11.1 + CF_SECRET localhost exempt)

> File: `brain_2.7.eos-1.1.md` — **first sub-attestation of `brain_2.7.eos-1`** (hostile-universe defense). Slices the **ares** leg out of the cross-repo HUD cascade so ares-specific verification, cross-repo dependencies, and merge readiness are tracked in a single-authority doc. Umbrella semantics (L1–L14 cascade, §9.HUD-1…13 assertions) remain in the parent cycle; this doc is the ares-scoped attestation loop.
>
> Companion source: Steward-dictated in-flight-state record `Ares — In-Flight State for EOS Update` (2026-09-25); this cycle doc absorbs it into EOS canon.

| | |
|---|---|
| **Branch family** | `brain/2.7.x.x` |
| **Cycle ordinal** | `eos-1.1` — sub-attestation of `brain_2.7.eos-1` (per README §60-64 `.{M}` form). Ares is one of five per-repo slices of the HUD cascade; this is the first to be extracted as its own attestation loop. |
| **Status** | `In Development` — reconciliation cycle. PR #66 in flight since 2026-08-31 (consolidation of #62 / #63 / #65); `MERGEABLE` / `CLEAN`; **no CI ever run against this PR** (`statusCheckRollup: []`). Steward verbal §5 ratification 2026-09-25 via direction to open the ticket. Formal §5 checkboxes pending. |
| **Opened** | 2026-09-25 |
| **Closed** | — |
| **Prior cycle** | `brain_2.7.eos-1` (umbrella — the six-PR HUD cascade; ares #66 is the W3+W4 wave) |
| **Theme** | Ares middleware chain enforces L1 (priority classification + producer authority) → L5 (critical retry) plutus-emit pipeline, L7 cluster-status kill switch, §11.1 native IP allowlist, and CF_SECRET origin-boundary with localhost-exempt — all bounded-by-construction defenses that refuse to convert traffic into cost. |
| **Feedback inputs** | Steward-dictated in-flight state record 2026-09-25; ares PR #66 body + commit series; brain_2.7.eos-1 §6.A W3+W4 row |
| **Estimated effort** | Implementation landed (22 files, +3,560 / −52, 7 commits). Remaining: re-verify build + test locally, confirm olympus-grid + plutus counterparties, coordinate merge window, int deploy, four smoke items, prod promotion. |
| **Actual effort** | — |

---

## Why this doc exists

`brain_2.7.eos-1.md` names ares #66 as the W3+W4 wave of the HUD cascade in §6.A and defines the L1–L7 + L13 + §2.16 CF_SECRET criteria in §2 + observability in §9.HUD-*. What it does NOT do is track the ares-specific attestation loop — the verification items that are ares' own to close, the cross-repo dependencies as ares sees them, the int-deploy → smoke → prod-promote sequence for this one PR.

This doc is that ares-scoped loop. It rides under the umbrella of `brain_2.7.eos-1` (no independent L-layer semantics; those live upstairs), and it closes when ares' four unverified smokes + build/test re-verification + prod promotion sequence complete.

**Multi-cascade context.** The other four HUD PRs (olympus-grid #345, plutus #42, zeus #45, hermes #62) may each acquire their own `brain_2.7.eos-1.{M}` sub-attestation for the same reason. This ordinal (`.1`) is the ares slice by first-out convention; ordinals for the other repos would be assigned as their per-repo tickets open.

---

## Discipline principle

> *A PR body claiming green tests is a claim, not evidence. A GitHub Actions run is evidence of build + test. A production smoke against `brain/2.7.x.x`-deployed ares is evidence of behavior. **This cycle closes only on the third.***

The PR body claims `npm run build && npm test` are 94/94 green as of 2026-08-31. The CI check rollup for this PR is empty. The gap between "claimed" and "attested" is what §10 closes.

---

# § Steward-authored (top half)

## Canonical attestation statement

> *"I attest that ares' L1–L5 plutus-emit pipeline, L7 cluster-status kill switch, §11.1 IP allowlist, CF_SECRET origin-boundary middleware (with localhost-exempt for developer surfaces), and cluster-identity refactor from `CLUSTER_NAME` to `CLUSTER_DOMAIN` are landed in production on the `brain/2.7.x.x` image, observably enforce the HUD §9.HUD-1 through §9.HUD-13 assertions from ares' side of the chain, and interoperate correctly with the olympus-grid + plutus counterparties merged in the same window."*

## §1 User story

- **§1.1** As **the Steward** I want **ares' HUD middleware chain to be independently attestable per-repo** — its own verification, its own smokes, its own build/test evidence — so that **when the HUD umbrella closes, I can point to a per-repo attestation loop that says "ares held its side" without inference from the fleet-wide §9.HUD matrix**.
- **§1.2** As **operators of the ares service** I want **the `MERGEABLE` / `CLEAN` state on PR #66 to become a merged + int-deployed + smoke-verified state** so that **there is no window in which ares sits in a green-on-paper / never-run-in-CI condition**.
- **§1.3** As **the ares repo's future maintainers** I want **the four unverified smoke items (W3 emit-drops observable, W4 status-gate flip re-verified post-consolidation, §11.1 IP allowlist 403 out-of-range, CF_SECRET localhost exempt) captured as first-class §9 obligations for this cycle** so that **each has a named closing evidence artifact rather than a rolled-up "smokes passed" claim**.
- **§1.4** As **the alchemisthomer agent** I want **the legacy `@alchemisthomer/neuralpathway/…` branch used by this PR to be explicitly grandfathered for this one merge** so that **the squash-merge erases the naming inconsistency at brain level and future ares increments move to the shared `cycle/eos-<N>` pattern per the parent CLAUDE.md**.

## §2 Acceptance criteria

Each criterion maps back to an L-layer defined in `brain_2.7.eos-1.md` §2 (the umbrella), plus an ares-specific verification-evidence obligation.

- **§2.1 (W3 admission pipeline — maps to umbrella L1–L5)** — **Given** the ares service running the merged image **when** an actor bursts recon-tier events at 10× the token ceiling **then** each admission stage (classify → rate cap → circuit breaker → capacity ceiling → retry) drops with a named `LedgerEntry api.rate_capped` / `api.critical_drop` / `ares.circuit.open` **and** critical-tier events in the same window write cleanly through the pipeline unaffected. Observable via `plutus-emit-pipeline.test` locally + int-deploy smoke.
- **§2.2 (W4 cluster-status kill switch — maps to umbrella L7)** — **Given** `Cluster__c.Status__c` flips `Live → Suspended → Live` in Salesforce **when** the ares `clusterStatusPoll.ts` next observes the change **then** business traffic is refused within the umbrella's kill-switch SLO with `api.blocked.cluster_gate`; `/health` continues 200; and when Salesforce is unreachable > 10 min the gate emits `api.blocked.cluster_gate.sf_unreachable`. Chaos knob `ARES_CLUSTER_GATE_DISABLE=1` verified. Fail-closed per HUD axiom 2.
- **§2.3 (§11.1 IP allowlist — maps to umbrella L13)** — **Given** `Cluster__c.AllowedIpv4Cidrs__c` is populated on the cluster row **when** a request originates from a non-CIDR-listed IP **then** ares returns HTTP 403 with no info leak **and** emits `api.blocked.ip_not_allowed` with `rule`, `path`, `client_ip`, `cluster_id`. **AND when** the allowlist is empty **then** requests pass (public cluster; fail-open to prevent self-DoS on config drift). `ARES_TRUST_PROXY ∈ {none | ngrok | cloudfront}` must match deploy topology or client IP is spoofable — verified per environment.
- **§2.4 (CF_SECRET localhost exempt — maps to umbrella §2.16)** — **Given** an external ingress request hits ares over CloudFront without the correct `X-Origin-Secret` **then** ares rejects with HTTP 403 + `api.blocked.origin_bypass` (unchanged from umbrella §2.16). **AND given** a same-host internal service-to-service call on localhost **when** it arrives without the `X-Origin-Secret` header **then** ares admits it (the +4 line localhost-exempt in `middleware/cfSecretGuard.ts`). Both cases observably verified.
- **§2.5 (Domain refactor — `CLUSTER_NAME → CLUSTER_DOMAIN`)** — **Given** the merged image and the coordinated olympus-grid + plutus counterparts **when** ares emits any cluster-scoped event **then** the payload's cluster-identity field is `domain` (not `cluster_name`) **and** the EMF dimension renamed to `ClusterDomain` **and** the poll URL is `/v1/grid/clusters/status/{domain}`. Requires olympus-grid `ApiRouteClusters.handleStatusByDomain` + `Cluster__c.Domain__c` + plutus #42 domain-rename all live in the same window.
- **§2.6 (CI has actually run)** — **Given** PR #66 pre-merge **when** the branch is pushed with a trivial re-touch (or CI is manually re-triggered) **then** the GitHub Actions build + test run completes green on the actual head SHA. `statusCheckRollup` must be non-empty and green before merge. **The claim of 94/94 pass in the PR body is not evidence — a fresh CI run is.**
- **§2.7 (Branch pattern grandfathering)** — **Given** the head branch `@alchemisthomer/neuralpathway/8c82513-66569e9-20260831151123-ares-hud-v2-3-W3-W4-plus-cf-localhost-exempt-consolidation` predates the `cycle/eos-<N>` convention **when** the squash-merge lands on `brain/2.7.x.x` **then** the merge commit collapses the legacy branch shape into a single per-cycle brain commit; the branch is grandfathered for this one merge, and the next ares increment must use `cycle/eos-<N>` per parent CLAUDE.md.

## §3 Non-functional requirements

- **Fail-mode invariants (from the source record).**
  - L7 status gate: **fail-closed** on `Cluster__c.Status__c ∉ {Live, Degraded}` or stale poll cache > 10 min.
  - §11.1 IP allowlist: **fail-open on empty allowlist** (public cluster / config drift = admit, not deny). Prevents self-DoS.
  - CF_SECRET external: **fail-closed** on missing / mismatched header.
  - CF_SECRET localhost: **admit** without header (dev-surface convenience).
- **Trust-boundary correctness.** `ARES_TRUST_PROXY` MUST be set correctly per environment (`none` locally, `ngrok` in tunnel dev, `cloudfront` in prod). If unset or wrong, `X-Forwarded-For` is spoofable and §11.1 allowlist has no real teeth. Steward-owned per-env config; verified at first request into each env.
- **Poll-cost bound.** Ares polls olympus-grid every N seconds per cluster (current per-cluster poll); §3 of `brain_2.7.eos-1.md` calls out that this is only acceptable up to a Steward-set cluster count. This cycle inherits that budget; the L7 poll-implementation ruling (Platform Event push vs shared batched pull) is a `brain_2.7.eos-1` §5 ruling, not this cycle's.
- **Test coverage.** Ares middleware chain (L1–L5 + L7 + §11.1 + CF_SECRET) ≥ 80% branch coverage — aligned to `brain_2.7.eos-1` §3. The 94/94 claim in the PR body is test count, not branch percentage; branch-coverage attestation is TBD.
- **Cross-repo dependency window.** Ares #66 must land in the same coordinated window as plutus #42 (W2 domain-rename event schema) and zeus #45 (W5+W7b CDK side). Merging ares alone with a stale plutus produces `cluster_name`-emit / `domain`-consumer mismatch — primary dimension breaks, falls back to metadata (per Steward record).
- **Rollback bounded by revert.** Squash-merge is single-commit revert; middleware chain returns to pre-v2.3 shape. No destructive schema on the ares side.

## §4 Feedback inputs

| FB# | Title | Body excerpt / evidence |
|-----|-------|-------------------------|
| — | Steward in-flight state record 2026-09-25 | *"Ares — In-Flight State for EOS Update"* — full scope + attestation status table + cross-repo dependencies + risk/rollback + recommended next actions |
| — | PR #66 body | Claims 94/94 `npm test` pass; MergeStateStatus CLEAN as of 2026-09-25 |
| — | UAT sweep 2026-08-02 (`olympus-grid/docs/uat-sweep-2026-08-03.md`) | W4 status-gate flip verified pre-consolidation; **not re-verified post-consolidation** — one of the four unverified smokes owed by this cycle |
| — | `brain_2.7.eos-1.md` §6.A W3+W4 row | Names ares #66 head SHA `4ad89ed`; supersedes #62 / #63 / #65 |
| — | `brain_2.7.eos-1.md` §9.HUD-1 through §9.HUD-13 | Umbrella observability contract; every §2.1–§2.4 assertion above must fire matching signals in the umbrella's matrix |

## §5 Steward approval gate

- [ ] Discipline principle acknowledged
- [ ] Canonical attestation statement locked
- [ ] Story locked (§1.1 – §1.4)
- [ ] Acceptance criteria locked (§2.1 – §2.7)
- [ ] NFRs locked (§3)
- [ ] Umbrella rulings in `brain_2.7.eos-1.md` §5 must be ticked before this cycle's §10 merge steps execute (§2.15 DELETE-prevention, §3 L7-poll implementation)
- [ ] Approved to execute — signed: **__________** **__________**

---

# § Agent-authored (bottom half)

## §6 Layer impact map

Single-repo × single-EOS-slice (ares only). Cross-repo counterparties named for dependency clarity.

| Criterion | ares | olympus-grid | plutus | zeus |
|---|---|---|---|---|
| §2.1 W3 admission pipeline | `util/plutus-emit-pipeline.ts`, `util/event-registry.ts`, 5 test files | — | receives events post-pipeline (schema per plutus #42) | — |
| §2.2 W4 cluster-status kill switch | `middleware/clusterStatusGate.ts`, `util/clusterStatusPoll.ts`, `killSwitch.test` | `ApiRouteClusters.handleStatusByDomain` in `/status` response | — | — |
| §2.3 §11.1 IP allowlist | `middleware/ipAllowlistGate.ts`, `util/cidrMatch.ts`, `ipAllowlistGate.test` (26 tests) | `Cluster__c.AllowedIpv4Cidrs__c` in `/status` response | — | — |
| §2.4 CF_SECRET localhost exempt | `middleware/cfSecretGuard.ts` (+4 lines) | — | — | secret provisioning via `cluster.sh` (zeus #45) |
| §2.5 Domain refactor | `util/cluster-identity.ts`, poll URL, emit payload, EMF dimension | `Cluster__c.Domain__c` + `handleStatusByDomain` | `cluster_name → domain` in event schema (plutus #42) | — |
| §2.6 CI actually run | GitHub Actions workflow trigger | — | — | — |
| §2.7 Branch grandfathering | squash-merge collapses branch shape | — | — | — |

## §7 Schema deltas (ares scope)

- **Emit payload cluster-identity field:** `cluster_name → domain`. Coordinated with plutus #42 domain-rename.
- **EMF dimension:** `ClusterName → ClusterDomain`.
- **Poll URL:** `/v1/grid/clusters/status/{domain}` (was `/{cluster_name}`).
- **Closed event registry (`util/event-registry.ts`):** finite set of admissible emit types; ESLint enforces no raw `event_type` strings outside registry.
- **New env vars:** `ARES_TRUST_PROXY ∈ {none | ngrok | cloudfront}`, `ARES_CLUSTER_GATE_DISABLE` (chaos knob).

## §8 Service contracts (ares scope)

### §8.1 Inbound request boundary (unchanged shape; middleware chain reordered)
Middleware order enforced in `server.ts`:
1. `cfSecretGuard` (§2.4) — localhost-exempt + external requires `X-Origin-Secret`
2. `clusterStatusGate` (§2.2) — refuse all non-health traffic on non-Live status
3. `ipAllowlistGate` (§2.3) — enforce `AllowedIpv4Cidrs__c` if populated
4. (existing) rate limit, auth, business routes

`/health` explicitly bypasses gates 1–3 for ALB liveness.

### §8.2 Outbound plutus emit pipeline (§8.1 in umbrella terms → ares-side §7 contract)
5-stage: classify → rate cap → circuit breaker → capacity ceiling → retry. Each stage emits a named metric on drop. Registry-enforced event types.

### §8.3 Poll to olympus-grid
`GET /v1/grid/clusters/status/{domain}` — expects response body carrying `{ status, statusAsOf, allowedIpv4Cidrs }` for the resolving cluster. Domain-scoped route from olympus-grid #345.

## §9 Telemetry assertions (the close-out gate)

**Ares-specific §9 assertions layered on top of `brain_2.7.eos-1` §9.HUD-*.** Every umbrella HUD assertion that names ares' side of the chain must ALSO fire in the ares-scoped run. This cycle's close depends on both the fleet-wide Kronos matrix (from the umbrella) AND these ares-scoped local smokes.

### §9.ARES Local + int-deploy verification

- **§9.ARES-1 (build re-verified)** — `npm run build` on the current PR head exits 0 with zero TypeScript errors. Attestation artifact: build log tail.
- **§9.ARES-2 (test re-verified)** — `npm test` on the current PR head reports 94/94 green (or > 94 if new tests added; must be N/N green). Attestation artifact: vitest output tail.
- **§9.ARES-3 (CI has actually run)** — GitHub Actions rollup on PR #66 shows a green build + test run against the actual head SHA. `statusCheckRollup` non-empty + all green.
- **§9.ARES-4 (W3 emit-pipeline drops observable — int)** — After int deploy, a scripted burst of recon-tier events beyond token ceiling produces `LedgerEntry api.rate_capped` rows in plutus, observable by SOQL query against the int cluster's plutus ledger.
- **§9.ARES-5 (W4 status-gate flip re-verified post-consolidation — int)** — Flip `Cluster__c.Status__c` on the int cluster `Live → Suspended` in olympus-grid; observe that ares refuses business traffic within the umbrella's kill-switch SLO with `api.blocked.cluster_gate`; `/health` still returns 200; flip back to `Live`; observe traffic resumes. **Re-verified post-consolidation, not carried forward from the 2026-08-02 pre-consolidation UAT.**
- **§9.ARES-6 (§11.1 IP allowlist 403 out-of-range — int)** — Populate `Cluster__c.AllowedIpv4Cidrs__c` on int cluster with a specific CIDR; issue a request from an out-of-range IP; observe 403 with `api.blocked.ip_not_allowed` in plutus. Then empty the allowlist and issue the same request; observe pass (fail-open).
- **§9.ARES-7 (CF_SECRET external reject + localhost admit — int)** — Curl to the int ares over CloudFront without `X-Origin-Secret` → 403 + `api.blocked.origin_bypass`. Same curl from same-host localhost → 200. Both observable.
- **§9.ARES-8 (Trust-boundary correctness — int)** — Set `ARES_TRUST_PROXY=cloudfront` in the int deploy config; issue a request via CloudFront with a spoofed `X-Forwarded-For`; verify that ares uses the CloudFront-verified client IP (not the spoofed header) for §11.1 evaluation.
- **§9.ARES-9 (Domain refactor coherence — int)** — After coordinated deploy of ares + plutus #42 + olympus-grid domain-route: verify emit payloads carry `domain` (not `cluster_name`); plutus rows have `domain` field populated; EMF metric dimension is `ClusterDomain`. `grep 'cluster_name'` on the int ares access log for the window returns zero hits.

### §9.OP Operational hygiene

- **§9.OP-1 (branch coverage ≥ 80%)** — Ares middleware chain branch coverage per vitest coverage report; artifact attached at close.
- **§9.OP-2 (`ARES_TRUST_PROXY` unset behavior)** — On boot with `ARES_TRUST_PROXY` unset, ares logs a warning; does not silently trust `X-Forwarded-For`. Observable in stdout.

## §10 Execution plan

Ordered, with dependencies on `brain_2.7.eos-1` §10.2 umbrella sequence surfaced.

### §10.1 Pre-merge ares-scoped verification

1. **`npm run build` + `npm test` re-verified locally** on the current PR head. Capture output. Closes §9.ARES-1 + §9.ARES-2. *(Steward's recommended action A-1.)*
2. **Confirm olympus-grid counterparty is merged.** Verify `ApiRouteClusters.handleStatusByDomain` + `Cluster__c.Domain__c` + `AllowedIpv4Cidrs__c` in `/v1/grid/clusters/status/{domain}` response on int cluster. If not merged, `brain_2.7.eos-1` §10.2 step 2 (olympus-grid #345 first) is upstream — do not merge ares before olympus-grid.
3. **Trigger CI on PR #66** (empty commit or manual re-run). Closes §9.ARES-3.

### §10.2 Coordinated merge window (dependent on umbrella §10.2)

4. **Umbrella §5 rulings ticked** on `brain_2.7.eos-1.md`. No ares merge before this.
5. **olympus-grid #345 merged** (umbrella §10.2 step 2). Ares depends on schema anchor.
6. **plutus #42 merged** (umbrella §10.2 step 3, parallel with zeus #45). Coordinates domain-rename event schema.
7. **zeus #45 merged** (umbrella §10.2 step 3, parallel with plutus #42).
8. **Ares #66 squash-merged to `brain/2.7.x.x`.** Grandfathered branch pattern per §2.7. Closes §2.7.
9. **Docker rebuild → ECR push.** Fires automatically on merge via `ares/.github/workflows/post-merge-docker.yml`.
10. **Hermes #62 merged** no later than ares merge (umbrella §10.2 step 5) — unblocks the Ares → Plutus → SF audit trail.

### §10.3 Post-merge int-deploy smokes (this cycle's four unverified items)

11. **Parent submodule pointer bump on olympus-616 parent.** Explicit-attested-SHA per `[Submodule Pointer Bump Discipline]` — ares' post-merge `brain/2.7.x.x` tip. Requires umbrella §10.2 step 6 discipline.
12. **Steward `[prod needs approval]` for CDK deploy.** Parent merge triggers Zeus CDK pipeline; ares image promoted to int cluster.
13. **Run §9.ARES-4 through §9.ARES-9 int smokes** against the newly-deployed int cluster. Capture artifact per assertion.
14. **Trust-boundary sanity check** — `ARES_TRUST_PROXY=cloudfront` set correctly in int deploy config (§9.ARES-8).

### §10.4 Prod promotion (only after int smokes green)

15. **Steward approves prod promotion.** Umbrella `brain_2.7.eos-1` §10.2 step 7 gate.
16. **CDK prod deploy** completes.
17. **Kronos harness (from umbrella §10.2 step 9)** validates §9.HUD-* fleet-wide including ares-side signals.
18. **`git mv` this doc** from `04_in_development/` to `05_verifying/` when umbrella moves, or directly to `06_shipped/` if this ares-scoped cycle closes independently at prod (umbrella close remains contingent on full Kronos matrix).

### §10.5 Deferred to a future cycle

- **Move ares to `cycle/eos-<N>` shared branch pattern** — this PR is grandfathered per §2.7; next ares increment uses the cycle branch pattern per parent CLAUDE.md.
- **CLAUDE.md sweep** — parent + ares CLAUDE.md still name `brain/1.7.x.x` as main; refresh to `brain/2.7.x.x` post-prod. Not blocking this cycle.
- **L7 poll-implementation ruling** (Platform Event push vs shared batched pull) — belongs to umbrella `brain_2.7.eos-1` §5, not here.

## §11 Verification protocol

### §11.1 Without iPhone (this cycle's entire scope)

- **`npm run build` + `npm test`** locally (§9.ARES-1, §9.ARES-2).
- **`gh pr checks 66`** to observe CI rollup after re-trigger (§9.ARES-3).
- **`curl` int cluster over CloudFront + directly** for CF_SECRET + IP allowlist + trust-boundary smokes (§9.ARES-6, §9.ARES-7, §9.ARES-8).
- **`sf data query`** into int cluster's plutus ledger for W3 admission-pipeline drops + W4 kill-switch + §11.1 rejects + domain-refactor coherence (§9.ARES-4, §9.ARES-5, §9.ARES-6, §9.ARES-9).
- **`aws logs`** on int-cluster ares CloudWatch log group for `api.blocked.*` / `api.rate_capped` / `api.critical_drop` structured entries.

### §11.2 With iPhone

Not required for this cycle. iPhone attestation surfaces (SIWA / StoreKit / device-specific) are governed by BYOK cycle `brain_1.7.eos-5.5.md`, not the HUD cascade.

## §12 Rollback plan

- **PR #66 full revert.** Squash-merge is single-commit revert; middleware chain returns to pre-v2.3 shape. Feasible even after CDK deploy (revert commit on `brain/2.7.x.x` triggers a redeploy). Deploy-time is the primary risk window.
- **Feature-flag disable per L-layer.**
  - `ARES_CLUSTER_GATE_DISABLE=1` — disables L7 kill switch.
  - Removing `AllowedIpv4Cidrs__c` value from `Cluster__c` — effectively disables §11.1 (fail-open on empty).
  - Removing `OriginSecretFingerprint__c` from `Cluster__c` — disables CF_SECRET check for that cluster (fail-open on absent).
- **Cross-repo revert coupling.** Ares depends on plutus #42's domain-rename schema. If plutus is reverted alone, ares emits carry `domain` field plutus doesn't understand → falls back to metadata but primary dimension breaks. Revert coupling: either revert ares first, then plutus, OR revert both in the same window.
- **Non-revertable elements to be honest about:**
  - **Plutus rows written after merge** with the new `domain` field are immutable per Plutus ledger discipline. Rollback of the emit shape does not delete historical rows; downstream analytics must handle both forms.
  - **CDK deploy state** — a CDK revert re-triggers deploy but does not roll back Secrets Manager / SSM parameter changes that may have been applied out-of-band. Verify environment parity before considering rollback complete.

## §13 Closeout

*Filled at end of cycle. Cycle moves to `05_verifying/` after int smokes green (§10.3) and to `06_shipped/` after prod promotion + umbrella Kronos matrix green (§10.4 + umbrella §10.2 step 10).*

### What shipped
- …

### What deferred (and why)
- Move to `cycle/eos-<N>` branch pattern — future ares increment.
- CLAUDE.md brain-family sweep — post-prod docs cycle.
- L7 poll-implementation ruling — umbrella cycle.

### What surprised
- …

### Verification evidence
- Link to local `npm run build && npm test` output + sha256 (E-1, E-2).
- Link to green GitHub Actions run on PR #66 head SHA (E-3).
- Link to int-cluster plutus SOQL query outputs for §9.ARES-4 / §9.ARES-5 / §9.ARES-6 / §9.ARES-9.
- Link to `curl` capture for §9.ARES-7 (CF_SECRET) + §9.ARES-8 (trust boundary).
- Link to `brain/2.7.x.x` post-merge ares SHA + submodule bump commit on parent.
- Link to CDK int deploy log + prod deploy log confirming ares image promotion.
- Link to umbrella Kronos matrix run showing ares-side §9.HUD-* signals fired.

### Feedback that emerged from THIS cycle (seed for the next one)
- …

### Memory updates
- Consider a memory note on the CI-never-ran-against-PR pattern (green PR body claim + empty `statusCheckRollup`) as an anti-pattern gate for future consolidation PRs.

### Cycle close commit
- PR #66 merge SHA + parent bump SHA + CDK deploy logs.
- Steward sign-off: **__________** **__________**

---

## §9-observed appendix — 2026-09-30 production deploy (code-identity attestation)

**Deploy record:** [`../DEPLOY-2026-09-30.md`](../DEPLOY-2026-09-30.md) — parent `841c222` · ares submodule ptr `1203f77` · Steward-verified 2026-09-29.

**Code identity for ares (W3+W4 + §11.1):** ✓ VERIFIED — boot log shows CloudWatch EMF metric `AresGateRefusal` emitting live under Namespace `Olympus/Ares` with `ClusterDomain=api-int.turtleshell.ai` (metric exists ONLY in W3 code path — proof of code identity) + `Policy bootstrapped — version=0 policy_id=compiled-strict-v1` + `Policy floor: ip.mode=deny-only, per_ip=0A/0D, rpm=600/300/600, inflight=500, kill_all=false`.

**§9 behavior signals: NOT YET TESTED.** Per Steward direction 2026-09-29 (*"especially related to the security updates"*), every §9.ARES / §9.HUD signal remains unverified. **No defeating-attack probe has fired against the deployed ares.** Rate-cap burst, cluster-status-flip, IP-allowlist 403 out-of-range, CF_SECRET external-vs-localhost, trust-boundary-spoof — all pending. Attestation pass per DEPLOY-2026-09-30 priority sequence **step 3**.

**Ticket-specific follow-ups from deploy:**
- `ARES_VERSION` env var missing from ECS task-def — cosmetic; boot banner shows `Version: unknown`. Not a code issue.

### Supplementary attestation observation — Steward egress 403 from external CF probes (2026-09-30)

**Steward's egress IP** (not a GHA-runner IP) → direct-to-CloudFront probes to `/health` and `/v1/ares/status` on `api-int.turtleshell.ai` returned **HTTP 403**. Same probes from GHA-runner-egress during the Verify Deployment job → **passed**.

This empirically demonstrates partial activation of the HUD defense chain against external direct-to-CF traffic:
- **§2.3 / §9.ARES-6** (§11.1 IP allowlist 403 out-of-range) — Steward egress not in allowed set; refused.
- **§2.4 / §9.ARES-7** (CF_SECRET external reject) — direct-to-CF without `X-Origin-Secret` header refused.

**Not a scripted defeating-attack probe** — this is observational, not an end-to-end §9.ARES signal fire. But it's attestation-reinforcing evidence that the defense is active rather than inert. The scripted probes per §11 verification protocol still owed before close.

---

## References

- **Umbrella cycle:** [`brain_2.7.eos-1.md`](brain_2.7.eos-1.md) — HUD L1–L14 cascade; ares #66 is the W3+W4 wave (§6.A); this doc is its per-repo attestation loop.
- **Ares PR #66:** [`feat(ares): consolidate hostile-universe-defense v2.3 W3+W4 + §11.1 IP allowlist + refactors + CF_SECRET localhost exempt`](https://github.com/olympus-616/ares/pull/66)
- **Coordinated cross-repo PRs:**
  - olympus-grid #345 — schema anchor (W1)
  - plutus #42 — event-schema domain rename (W2)
  - zeus #45 — CDK WAF + secret metadata (W5+W7b)
  - hermes #62 — audit-trail unblock (§11.5)
  - parent olympus-616 #198 — submodule pointer coordination
- **UAT sweep (pre-consolidation W4):** `olympus-grid/docs/uat-sweep-2026-08-03.md` — verified before this consolidation; not carried forward as evidence for §9.ARES-5.
- **Ares self-DoS verification brief:** `docs/handoff-ares-self-dos-verification-brief.md`
- **HUD sealed design canon:** `olympus-grid/docs/hostile-universe-defense-design-v2.3-SEALED-2026-07-23.md`
- **Submodule Pointer Bump Discipline:** olympus-616 parent `CLAUDE.md`
- **EOS operating manual:** [`../README.md`](../README.md)
