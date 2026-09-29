# Hostile-universe defense — the platform survives adversarial exploitation of its own cost, capacity, and reachability primitives

> File: `brain_2.7.eos-1.md` — the first EOS cycle on the `brain/2.7.x.x` deployment branch family. The 1.7-family docs in `04_in_development/` (`brain_1.7.eos-5*`) roll forward into `brain/2.7.x.x` without rename per Steward direction 2026-09-01.

| | |
|---|---|
| **Branch family** | `brain/2.7.x.x` |
| **Cycle ordinal** | `eos-1` (first on the 2.7 family; branch-family rollover from 1.7 per README §60-64) |
| **Status** | `In Development` — reconciliation cycle. Implementation predates the doc; direct-to-execution under single-Steward mode (README §270-273). Steward verbal §5 ratification 2026-09-01: *"we need a single authority on the state of hostile defense."* Steward pre-§5 corrections received 2026-09-01 (`goat://` feedback + rulings block) — landed in this revision. Formal §5 checkboxes pending Steward signature. |
| **Opened** | 2026-09-01 |
| **Closed** | — |
| **Prior cycle** | `brain_1.7.eos-4.1` (last cycle formally shipped to `06_shipped/`; `brain_1.7.eos-5*` sub-attestations remain in `04_in_development/` and roll forward without rename) |
| **Theme** | Hostile-universe defense — reconciliation and single-authority attestation of post-7/17 countermeasures across the fleet |
| **Feedback inputs** | 2026-07-17 $131B AWS billing-alert incident; four-round external LLM adversarial-review chain (Claude / ChatGPT / Grok / Gemini) across `hostile-universe-defense-design` v1 → v2 → v2.1 → v2.2 → v2.3-SEALED; alpha-org empirical audit 2026-07-22; Kronos redteam plan 2026-07-24; Steward pre-§5 review 2026-09-01 |
| **Estimated effort** | Implementation largely landed across six open PRs (see §10); Kronos harness NOT YET BUILT (only plan doc exists); reconciliation + Kronos authoring + coordinated merge remaining |
| **Actual effort** | — |

---

## Why this doc exists

On **2026-07-17** the platform absorbed an adversarial event that surfaced as a **$131 billion AWS billing alert** from Amazon. The intended global launch that day was postponed indefinitely; tentative next launch **2027-07-17**.

Between 2026-07-22 and 2026-08-31 the Steward + agents designed and implemented a **fourteen-layer defense cascade** (L1–L14) — provider-neutral defensive primitives (L1–L7) plus an AWS provider profile (L8–L12) plus SF-side control-plane hardening (L13–L14). The design ran four external-LLM adversarial-review rounds and was sealed as **v2.3-SEALED** on 2026-07-23. Implementation shipped as six coordinated open PRs across olympus-grid, ares, plutus, zeus, hermes, and the parent. A semantically-related BYOK / sovereign-AI cascade is in flight across athena, apollo, omens, turtleshell-web, and turtleshell-ios — that work is governed by `brain_1.7.eos-5.5.md` (also in `04_in_development/`), not by this cycle.

**All of the hostile-defense work was carried out without an EOS cycle to hold it.** No governance artifact exists that names the six PRs as one atomic promotion, no §9 telemetry-assertion set exists that says "the defense HELD," and no single authority answers "what is the state of hostile defense?"

This document is that authority. It reconciles the shipped-but-un-EOS'd work into a single governed cycle, sets the §9 assertion contract that must hold before merge to `brain/2.7.x.x`, and defines the coordinated merge sequence. The doc catches up to reality — same pattern as `brain_1.7.eos-5.5.md`.

---

## Discipline principle (governs the whole cycle)

> *A PR saying a defense exists is implementation evidence. A test saying the code passes is verification evidence. Production telemetry showing the adversarial action was refused is attestation evidence. **Only the third closes hostile defense.***

This cycle does not ship on green Apex tests or on green CI. It ships on a green Kronos-driven §9 telemetry matrix run against the `brain/2.7.x.x`-deployed environment. The three evidence-classes are not substitutes for each other. This prevents the failure pattern of an agent saying *"looks secure"* while a global TransactionContext sits underneath it.

---

# § Steward-authored (top half)

## Canonical attestation statement (refined for lock 2026-09-01)

> *"I attest that following the 2026-07-17 adversarial cost event, every layer at which an adversary can convert traffic into cost is bounded by construction across a fourteen-layer cascade (L1–L14), implemented in six coordinated pull requests spanning olympus-grid, ares, plutus, zeus, hermes, and the parent; that the state of hostile defense is answerable from this single EOS cycle; and that this attestation becomes final only upon a green Kronos run of every §9 assertion."*

## §1 User story

- **§1.1** As **the Steward and every future dust dancer running their own olympus-grid node** I want **every layer at which an adversary can convert traffic into cost to be bounded by construction — not by monitoring, not by alerting, not by post-hoc discovery, but by a defensive primitive that refuses to admit unbounded work** so that **a 2026-07-17-class event cannot recur, and the platform's operational sovereignty extends to its own cost surface**.
- **§1.2** As **the Steward** I want **one authoritative document that names the current state of hostile defense** — which layers exist, which PRs implement them, which assertions verify them, which redteam attacks validate them — so that **when the next adversarial event probes any layer, the answer to "is this layer live in production?" is a single SOQL/git query, not a room-of-agents scramble**.
- **§1.3** As **the platform** I want **each defensive layer's telemetry to be observable in production** so that **an adversary probing the cascade generates a visible signal on every fired defense — not a silent success — and Kronos can verify each layer end-to-end against attacks designed to defeat the layer if the layer were absent**.
- **§1.4** As **the Steward** I want **the six-PR cascade to promote as one atomic coordinated merge** — with schema anchor first, dependents second, coordinator last — so that **no intermediate state exists where one layer's runtime references a field that its dependency hasn't landed, and no CDK deploy triggers with a submodule pointer at a SHA that never made it to `brain/2.7.x.x`** (per `[Submodule Pointer Bump Discipline]`).

## §2 Acceptance criteria

Each criterion is observable end-to-end and maps to one L-layer of the sealed design (`olympus-grid/docs/hostile-universe-defense-design-v2.3-SEALED-2026-07-23.md`). Kronos (`olympus-grid/docs/hostile-universe-defense-kronos-redteam-plan-2026-07-24.md`) executes the negative-case verification for each.

### §2.A Provider-neutral cascade (L1–L7 — ares + plutus + olympus-grid)

- **§2.1 (L1 — Priority Classification with producer authority)** — **Given** an inbound event with `event_type` **when** it passes through `ares/api/src/util/event-registry.ts` **then** (a) unknown event types reject at the boundary; (b) `event_type` values with `critical`-tier prefixes (`payment.*`, `settlement.*`, `tithe.*`, `cluster.status.poll.*`, `api.audit.*`) are only admitted from a trusted producer identity — an unauthenticated or untrusted caller submitting `payment.credit` cannot self-elevate its tier; (c) `classifyTier` returns exactly one of `critical | important | recon` per the closed registry; (d) source-code invariant: no raw `event_type` string literal exists outside `event-registry.ts` (ESLint enforced). Provenance semantics are the load-bearing part — the ESLint invariant alone does not prevent tier-elevation by an adversary submitting a legal event name.
- **§2.2 (L2 — Rate Cap Token Bucket)** — **Given** a burst of `recon`-tier events **when** the rate exceeds the tier's per-second token ceiling **then** excess events are dropped with `LedgerEntry api.rate_capped` **and** `critical`-tier events in the same window are admitted unaffected.
- **§2.3 (L3 — Circuit Breaker)** — **Given** downstream failure at Plutus (>N consecutive HTTP 5xx or timeouts) **when** the breaker opens **then** subsequent emits fast-fail without a downstream call **and** the breaker probes at exponential backoff **and** transitions half-open → closed on N consecutive successes.
- **§2.4 (L4 — In-Flight Ceiling)** — **Given** the in-flight-emit counter is at ceiling **when** a new emit is attempted **then** the emit is queued (if `critical`) or dropped (if `recon`) with a metric — never allowed to inflate ares heap without bound.
- **§2.5 (L5 — Ares Critical Retry Queue + Drop-Summary + EMF)** — **Given** a `critical`-tier emit fails after primary + retry **when** the critical retry queue TTL expires **then** the event drops with an EMF metric + `api.critical_drop` counter — no S3 spill (per v2.3 correction 3).
- **§2.6 (L6 — Plutus Buffer + Insert-With-Duplicate-Catch Writer)** — **Given** an inbound event arrives at Plutus **when** the writer attempts insert **then** on `DUPLICATE_VALUE` the writer treats it as success (immutable ledger; NOT upsert per v2.3 correction 4); **and** external webhooks derive stable IDs (`stripe:{event_id}`, `apple:{transaction_id}`) so replays are idempotent by construction; **and** the three-tier ring buffer drains tier-priority (critical first) with SIGTERM last-gasp flush.
- **§2.7 (L7 — Cluster Status Kill Switch)** — **Given** `Cluster__c.Status__c` flips to `Suspended` or `Failed` in Salesforce **when** the L7 gate next observes the change (via poll or Platform Event push per §3 poll-cost NFR) **then** within the kill-switch SLO (§3) ares `clusterStatusGate` middleware rejects all business traffic with `api.blocked.cluster_gate` **and** `/health` continues to answer 200 for ALB (per v2.3 correction 2 — no `/liveness` `/readiness` split; gate does business-traffic refusal). **And** when Salesforce is unreachable, the gate uses stale cached state up to the stale-cache SLO (§3), after which it fails closed with `api.blocked.cluster_gate.sf_unreachable` (a Salesforce outage becoming a fleet-wide kill switch is intentional but bounded).

### §2.B AWS provider profile (L8–L12 — zeus CDK)

- **§2.8 (L8 — WAF Coarse Rate Rule)** — **Given** any source IP **when** it exceeds 5000 requests / 5-minute rolling window **then** the WAF `RateLimit-Coarse-5min` rule BLOCKs (day-one BLOCK-mode per v2.3 correction 5; no burst rule).
- **§2.9 (L9 — WAF AWS Managed Rules)** — **Given** a request matching AWSManagedRulesAnonymousIpList (Tor exit, VPN provider, hosting/cloud origin) **when** the rule fires **then** the request is BLOCKed at edge; **and** WAF sampled-request logs record the match.
- **§2.10 (L10 — WAF IPSet Enforcement)** — **Given** an IPSet-listed IP (steward-curated block list) **when** any request originates from it **then** the request is BLOCKed at edge with rule name in log.
- **§2.11 (L11 — WAF Bot Control)** — **Given** a request classified `signal:automated_browser` or `signal:non_browser_user_agent` by `AWSManagedRulesBotControlRuleSet` (COMMON tier) **when** the classification fires **then** the request is BLOCKed at edge (day-one BLOCK for pre-user platform).
- **§2.12 (L12 — VPC Security Group Lockdown)** — **Given** a probe of any Pantheon-adjacent AWS resource (RDS, ElastiCache, ECS host, internal ALB) **when** the probe originates from any IP not in the Steward-curated egress allowlist **then** the SG rejects the packet at the VPC boundary.

### §2.C SF-side control-plane (L13–L14 — olympus-grid schema)

- **§2.13 (L13 — Per-Cluster IP Allowlist)** — **Given** `Cluster__c.AllowedIpv4Cidrs__c` is populated on a cluster's row **when** an ares request reaches that cluster's origin **then** the ares §11.1 IP allowlist middleware admits requests only from CIDR-listed sources with dual-family (IPv4/IPv6) parsing and leading-zero-octal defense; **and** on rejection emits `api.blocked.ip_not_allowed` with `rule`, `path`, `client_ip`, `cluster_id`.
- **§2.14 (L14 — Per-Cluster Origin Secret via Reference-in-SF, Value-in-Vault, Rotation-via-New-Cluster)** — **Given** `zeus/scripts/cluster.sh` provisions the cf-secret in AWS Secrets Manager for a new cluster **when** the cluster row is committed **then** `Cluster__c.OriginSecretRef__c` + `OriginSecretVersion__c` + `OriginSecretFingerprint__c` are populated with reference + version + SHA-256 fingerprint respectively. **And** once `Cluster__c.Status__c` leaves `Pending/Provisioning`, `Cluster__c` validation rules `AllowlistImmutableWhenLive` + `OriginSecretImmutableWhenLive` reject any UI/API attempt to mutate the allowlist or origin-secret triplet on that row (fingerprint is immutable for the lifetime of the cluster row). **And** the rotation model is **spawn-new-cluster** (provision new `Cluster__c` row with fresh cf-secret → cut Iris over → destroy old row); there is no in-place rotation on a Live cluster. **And** the origin-secret value is never persisted to Salesforce, logs, telemetry, Git, configuration files, or durable process state — runtime exposure is ephemeral (in-memory at CloudFront edge only, redacted from all sinks).

### §2.D Immutable-ledger cluster lifecycle

- **§2.15 (Cluster-schema lifecycle invariant — NOT a new L-layer)** — **Given** a cluster transitions state (`Pending → Provisioning → Live → Suspended → Failed → Destroyed`) **when** the transition commits **then** an immutable `LedgerEntry cluster.status.poll.{transition}` writes via `LedgerEntryEmitter` with `cluster_id`, `prior_status`, `new_status`, `actor`, `reason`, `provider_run_id`. **UPDATE-prevention** on those rows is enforced by permission-set architecture (no non-admin permset carries `edit` FLS on the mutation fields). **DELETE-prevention** is an open gap in #345 as of 2026-09-01 — no `LedgerEntry.trigger` exists; SF validation rules do not fire on DELETE. Closure options for §10: (a) add a `LedgerEntry.trigger` `before delete` guard to #345 or its own follow-up PR before merge; or (b) rely on permset-only-visibility (revoke `delete` object permission from every permset except System Administrator, and accept that a SF admin retains break-glass delete authority). Ruling required at §5. Either way, the defensible claim is *no supported application/API path deletes cluster history*; break-glass admin action requires explicit metadata change and produces its own audit trail.

### §2.E Origin-bypass defense (the actual 7/17-class attack)

- **§2.16 (CF_SECRET origin enforcement — this is the attack surface that motivated L14)** — **Given** an attacker constructs their own CloudFront distribution pointing at the public ALB origin, or hits the origin directly bypassing WAF **when** they issue any request without the correct `X-Origin-Secret` header (matching the `Cluster__c.OriginSecretFingerprint__c` in force for this cluster) **then** ares' CF_SECRET middleware rejects with HTTP 403 **before any business processing occurs** — not at authentication, not at authorization, at the ingress boundary. **And** the rejection emits `api.blocked.origin_bypass` with `rule`, `client_ip`, `presented_secret_fingerprint_prefix` (first 8 chars only, never full value), `cluster_id`. **And** during local development the CF_SECRET check is exempted per the localhost-exempt provision in ares #66. L14 protects storage of the secret; §2.16 proves the secret protects the origin. Both must pass for the origin-bypass defense to be attested.

## §3 Non-functional requirements

- **Provider portability** — L1–L7 have zero AWS dependency (portable to Azure, GCP, Linux, off-grid appliance). L8–L12 are AWS-specific; other providers must implement equivalents in their own adapter (out of scope for this cycle).
- **Cost surface — bounded, not eliminated** — request-processing surfaces (L1–L14) admit only bounded work. WAF (including Bot Control) is itself metered per request evaluated — edge rejection **minimizes** rather than eliminates metered edge cost. Beyond request admission, two additional ceilings are required for the cost claim to hold:
  - **Autoscaling hard ceiling** — ECS service max-task count per Pantheon environment is set at a Steward-approved fixed maximum (documented per environment in zeus CDK). No autoscaling policy may exceed this ceiling regardless of demand signal. A bounded request rate multiplied by unbounded horizontal autoscaling is still unbounded cost.
  - **Downstream provider daily-spend ceiling** — for every paid downstream provider (OpenAI, Anthropic, Google, xAI, ElevenLabs, and future providers), a per-day cumulative-spend ceiling is configured in the ARES policy overlay (or equivalent gating). Once hit, the provider slot returns HTTP 429 with a specific rejection code for the remainder of the day. BYOK traffic bypasses this ceiling (per `brain_1.7.eos-5.5.md`); platform-funded inference is bounded.
- **L7 poll cost bound** — the L7 kill-switch check may not scale linearly with cluster count. A 20-second poll per cluster is 4,320 requests / day / cluster; at 1000 clusters that is 4.32M requests / day of hostile-defense infrastructure traffic before a single customer request. The layer must be O(1) not O(clusters). Ruling required at §5 between two implementations: (a) SF Platform Event push (CometD / Streaming API) — state change pushed to ares; (b) single shared batched pull — one ares node polls a `/v1/grid/clusters/status/batch` endpoint returning all cluster statuses in one round-trip and broadcasts to peers via local IPC. Either bounds the layer. The current per-cluster poll is only acceptable up to a Steward-set cluster count.
- **Kill-switch SLO** — `Cluster__c.Status__c` flip to enforcement at ares: ≤ 60s under happy path (poll interval + gate propagation ≤ 2s).
- **Stale-cache SLO** — when Salesforce is unreachable, the L7 gate uses cached cluster status up to 5 minutes (bounded); beyond that it fails closed with `api.blocked.cluster_gate.sf_unreachable`. A SF outage becomes a fleet-wide kill switch after 5 minutes — intentional but bounded.
- **Latency budget** — WAF adds < 5ms p95 at edge. Ares middleware chain (L1–L4 + L7 gate + L13 IP allowlist + §2.16 CF_SECRET) adds < 10ms p95 to admitted requests. L6 Plutus writer < 50ms p95 in the happy path; < 5s hard timeout under failure.
- **Immutability semantics** — `Cluster__c` allowlist + origin-secret triplet: immutable-for-lifetime-of-cluster via VR (rotation via spawn-new-cluster). Cluster-lifecycle `LedgerEntry cluster.status.poll.*` rows: UPDATE-prevented via permset architecture; DELETE-prevention gap open per §2.15. The defensible claim is *no supported application/API mutation path*; a SF admin retains break-glass authority via explicit metadata change, which itself produces audit evidence in SF setup audit trail.
- **Observability** — every fired defense emits a `LedgerEntry api.blocked.*` or `api.rate_capped` row with `rule`, `path`, `client_ip` (redacted if PII), `cluster_id`, `key_id_hash` (never raw key). No silent-drop.
- **Kronos verifiability** — every §2 claim must be either provable by Kronos-driven adversarial test (§11) or provable by telemetry emit — never by inspection or trust.
- **Rollback bounded by SF row edits, not code redeploy** — L7, L13, L14 defenses toggle via `Cluster__c` field updates (validation exempted for `Status__c` flip). Ares picks up within one poll cycle.
- **Test coverage** — ares middleware chain (L1–L7 + L13 + §2.16 CF_SECRET) ≥ 80% branch coverage. Zeus CDK WAF rules smoke-tested with `curl` from IPSet + non-IPSet source. Olympus-grid Cluster__c fields covered by Apex tests (50/50 pass in PR #345 head).

## §4 Feedback inputs

| FB# | Title | Body excerpt / evidence |
|-----|-------|-------------------------|
| — | Incident 2026-07-17 | $131 billion AWS billing alert. Root cause + fingerprint analysis retained in Steward's private incident log. |
| — | External LLM adversarial-review chain | Four rounds (Claude / ChatGPT / Grok / Gemini) reviewed `hostile-universe-defense-design` v1 → v2 → v2.1 → v2.2. Iterative refinement produced v2.3-SEALED 2026-07-23. Chain-of-review recorded in the sealed doc's header. |
| — | Alpha-org empirical audit 2026-07-22 | Four companion docs — `alpha-org-audit-2026-07-22.md`, `alpha-org-blocked-ips-analysis-2026-07-22.md`, `alpha-org-blocked-paths-taxonomy-2026-07-22.md`, `alpha-org-purge-decision-matrix-2026-07-22.md` — enumerate what the alpha-org saw during and immediately after the incident window. |
| — | Kronos redteam plan 2026-07-24 | Per-layer attack playbooks + verification matrix spec. Kronos is the harness Steward is building to validate each L against a defeating attack in a controlled environment. **Only the plan doc exists as of 2026-09-01; harness itself not yet built** (§10 §10.2.6 owns the build). |
| — | Ares self-DoS verification brief | `docs/handoff-ares-self-dos-verification-brief.md` — brief for confirming ares does not self-DoS under L2/L3/L4/L5/L7 cascade activation. |
| — | Ares EOS-5 machine-migration handoff | `ares/HANDOFF-eos-5.md` — 525-line attestation-state capture at machine-migration cutover during the hostile-defense implementation window. |
| — | Sovereign-AI seam reference | `docs/sovereign-ai-seam-cross-surface-reference.md` — cross-surface reference for the BYOK / sovereign-AI cascade (now governed by `brain_1.7.eos-5.5.md`, not this cycle). |
| — | Steward direction 2026-09-01 (open cycle) | Verbatim: *"we need a single authority on the state of hostile defense, and then you and i will work across the repos to clean up all in development work, starting with brain_2.7.eos-1.md so that we can get all of the open work tested and checked in and validated against main branch which is now brain/2.7.x.x."* |
| — | Steward direction 2026-09-01 (`goat://` pre-§5 review) | Eight blockers folded into the doc: L14 rotation model, missing origin-bypass §2 assertion, L7 poll cost, L1 provenance semantics, LedgerEntry delete-prevention truthfulness, §10.1 pointer discipline via explicit-attested-SHAs, entire-cost-surface framing, internal contradictions. Governance: HUD-required vs co-traveling delta noted per PR (§6.A). BYOK cascade governed by `brain_1.7.eos-5.5.md`, not this cycle. Discipline principle at top. |
| — | Steward direction 2026-09-01 (rulings) | §9.OP-2 aligned to ≥80%; §9.HUD-8 dumps enumerated; BYOK deferred to `brain_1.7.eos-5.5.md`; Kronos build state confirmed = plan doc only. |

## §5 Steward approval gate

- [ ] Discipline principle acknowledged
- [ ] Canonical attestation statement locked
- [ ] Story locked (§1.1 – §1.4)
- [ ] Acceptance criteria locked (§2.1 – §2.16)
- [ ] NFRs locked (§3)
- [ ] Ruling on §2.15 DELETE-prevention: **(a) add `LedgerEntry.trigger before delete` guard, or (b) permset-only-visibility with SF-admin break-glass** — mark choice below
  - [ ] (a) trigger before merge
  - [ ] (b) permset-only-visibility
- [ ] Ruling on §3 L7-poll implementation: **(a) SF Platform Event push, or (b) single shared batched pull** — mark choice below
  - [ ] (a) Platform Event push
  - [ ] (b) shared batched pull
- [ ] Approved to execute — signed: **__________** **__________**

**Note on direct-to-execution:** the six-PR cascade is already implemented; verbal Steward ratification 2026-09-01 authorized the doc to be opened in `04_in_development/`. §5 checkboxes remain formally to be ticked. Merge of the coordinated cascade to `brain/2.7.x.x` is gated on §5 tick.

---

# § Agent-authored (bottom half)

## §6 Layer impact map

Six coordinated open PRs form the cascade. All last-touched 2026-08-31 as the "consolidation sweep." Each PR carries some HUD-required delta and some co-traveling delta (pre-incident work or unrelated 2.7-transition mechanics that ride along). The two columns must not be conflated — a green HUD attestation does not attest the co-traveling delta.

### §6.A Core hostile-defense cascade (six PRs)

| Wave | Repo | PR | Head SHA | L-layers | HUD-required delta | Co-traveling delta |
|------|------|----|----------|----------|--------------------|--------------------|
| **W1 (schema anchor)** | olympus-grid | **#345** | `0d59b20f` | L13, L14, §2.15 (cluster lifecycle invariant), §2.16 (CF_SECRET boundary via `X-Origin-Secret` header contract) | `Cluster__c` fields (`AllowedIpv4Cidrs__c` dual-family CIDR w/ leading-zero-octal defense; `OriginSecretRef__c` / `OriginSecretVersion__c` / `OriginSecretFingerprint__c` triplet); immutability validation rules `AllowlistImmutableWhenLive` + `OriginSecretImmutableWhenLive` (fire once Status leaves Pending/Provisioning; rotation model = spawn-new-cluster); W1 public `/v1/grid/clusters/status` route; immutable-ledger cluster lifecycle events via `LedgerEntryEmitter`. 50/50 Apex tests pass. Supersedes #312 / #322. | `EndpointUrl → Domain` rename (cross-cuts all six repos); dynamic-MCP tracker (part of `brain_1.7.eos-5*` scope, not HUD). |
| **W2** | plutus | **#42** | `a9648c5` | L6 | Three-tier ring buffer (critical / important / recon); tier-priority drain; SIGTERM last-gasp flush; insert-with-duplicate-catch writer (immutable ledger; NOT upsert per v2.3 correction 4). Supersedes #38 / #39; closes #41. | EOS-5 attribution subledger (7% floor + reversal + orion trigger + Stripe/Apple wiring) — **governed by `brain_1.7.eos-5.md` / eos-5.3**, not this cycle; cluster_name→domain rename. |
| **W3+W4** | ares | **#66** | `4ad89ed` | L1, L2, L3, L4, L5, L7, L13, §2.16 (CF_SECRET middleware) | W3 five-stage plutus emit pipeline (classify → rate cap → circuit → ceiling → retry — `plutus-emit-pipeline.ts`). W4 L7 `clusterStatusGate` middleware + `clusterStatusPoll.ts` (self-scheduled, single-flight, LastModifiedDate-ordered; kills business traffic when SF unreachable > stale-cache SLO or `Cluster__c.Status__c ∈ {Suspended, Failed}`). §11.1 IP allowlist middleware reads `Cluster__c.AllowedIpv4Cidrs__c`. CF_SECRET origin-boundary middleware with localhost-exempt. 94/94 tests pass (test count, not branch coverage — see §9.OP-2). Supersedes #62 / #63 / #65. | `HANDOFF-eos-5.md` (525 lines) — attestation-state capture at machine-migration cutover during the HUD window; documentation only. |
| **W5+W7b** | zeus | **#45** | `7bafd02` | L8, L9, L10, L11, L12, L14 | W5 WAF hardening: `RateLimit-Coarse-5min` (5000/5min/IP) + `AWSManagedRulesAnonymousIpList` (Tor/VPN/hosting) + `AWSManagedRulesBotControlRuleSet` COMMON tier — **all BLOCK-mode day one** (v2.3 correction 5). W7b `cluster.sh` writes ARN + version + SHA-256 fingerprint of cf-secret back to Cluster__c (raw secret never leaves Secrets Manager). VPC SG lockdown baseline. | — (this PR is tight HUD scope) |
| **§11.5 (unblocker)** | hermes | **#62** | `cb6e71d` | — (dependency-unblocker for L7 audit trail) | §11.5 normalize `OLYMPUS_GRID_MASTER_URL` — fixes HTTP 420 that silently broke the Ares → Plutus → SF audit trail during HUD v2.3 UAT 2026-08-02 (13-line change to `api/src/server.ts`). | Pre-incident `add missing sms/email/register` route modules ride along in tree — **VERIFIED UNMOUNTED** in `hermes/api/src/server.ts` lines 26–28, 554–556 (import + `app.use` calls are commented out; ships as dark code). Confirm unmounted at merge time. |
| **coordinator** | parent (olympus-616) | **#198** | `054ea3e` (branch `carryover/launcher-scratchorg-client-modes`) | — (submodule pointer coordination) | Parent-side pointer bump per §10.1 — explicit-attested-SHAs only, not automatic latest-brain-tip. **Excludes** the 12 submodule pointer bumps from #189 — those are prod-CDK-triggering, need explicit Steward approval per `[prod needs approval]`. | Launcher client-modes + `scratchOrg` carryover + `eos-5-Ἀκεραιότης` (9 single-god agent modes for `alchemisthomer.sh`) — dev-tooling, not HUD; ride-along scoped to Steward-only dev surface. |

### §6.B BYOK / sovereign-AI cascade — governed by `brain_1.7.eos-5.5.md`, NOT this cycle

The BYOK / sovereign-AI cascade (athena #106, apollo #30, omens #60, cosmos-logos/turtleshell-web #74, cosmos-logos/turtleshell-ios #32) is real, in-flight, and semantically related to hostile defense (`byok=true → tithed=false, billed=0` removes the platform's cost surface for BYOK'd traffic — see §3 downstream-provider ceiling exception). It is NOT within this cycle's attestation scope. Governing document: **[`brain_1.7.eos-5.5.md`](../04_in_development/brain_1.7.eos-5.5.md)** — sealed-at-capture credential sovereignty; verbal §5 ratification 2026-07-08. §11.4 iPhone dependency for BYOK attestation belongs there, not here.

Dependency crossing this cycle: **omens #60** depends on olympus-grid `/v1/grid/master/grid/clusters/me` domain rename shipping first. That domain rename is bundled in olympus-grid #345 (W1) and will be satisfied once §10.2 step 1 completes. No other cross-cycle dependency.

### §6.C Repos not participating in this cycle

- **cosmos-logos** — silent since 2026-07-07 (ten days pre-incident) for hostile-defense purposes. Client-side hostile defense (request throttling, backoff, billing-anomaly telemetry) is a gap noted in §10.3 for a future 2.7-family cycle. Client-side BYOK sealing is governed by `brain_1.7.eos-5.5.md`.
- **turtleshell-offgrid** — dormant since 2026-04-10 for both cycles. Deferred.
- **agora, homework-buddy, thoth, alpha, resolver2, team-journal, .github** — dormant client repos. Deferred.

## §7 Schema deltas

### §7.1 New `Cluster__c` fields (olympus-grid #345)

| Field | Type | Purpose |
|-------|------|---------|
| `AllowedIpv4Cidrs__c` | Long Text Area | Dual-family CIDR list (IPv4 + IPv6); ares reads for L13 IP allowlist middleware. Parser defends against leading-zero-octal ambiguity. |
| `OriginSecretRef__c` | Text | Secrets Manager ARN of the CloudFront-origin secret for this cluster. |
| `OriginSecretVersion__c` | Text | Secrets Manager version-id of the cluster's initial-provision secret. Immutable-per-cluster-row (rotation = new cluster). |
| `OriginSecretFingerprint__c` | Text (64) | SHA-256 fingerprint of the cluster's initial-provision secret value. Immutable-per-cluster-row. |
| `Domain__c` | Text | The `EndpointUrl → Domain` rename target. Cross-cuts ares/plutus/zeus/omens/hermes. |

### §7.2 Validation rules (olympus-grid #345)

- `Cluster__c.AllowlistImmutableWhenLive` — rejects mutation of `AllowedIpv4Cidrs__c` once `Status__c` leaves `Pending/Provisioning`.
- `Cluster__c.OriginSecretImmutableWhenLive` — rejects mutation of `OriginSecretRef__c` / `OriginSecretVersion__c` / `OriginSecretFingerprint__c` once `Status__c` leaves `Pending/Provisioning`.
- **No validation rule protects `LedgerEntry__c` `cluster.status.poll.*` rows.** UPDATE protection is via permset architecture (no non-admin permset carries `edit` FLS on the mutation fields). DELETE protection is an OPEN GAP — §5 ruling required per §2.15.

### §7.3 Closed event registry with producer authority (ares)

- `ares/api/src/util/event-registry.ts` — canonical enum of every legal `event_type` string. ESLint rule forbids raw `event_type` string literals outside this file. `classifyTier` operates exclusively over registry entries.
- **Producer authority** — critical-tier prefixes (`payment.*`, `settlement.*`, `tithe.*`, `cluster.status.poll.*`, `api.audit.*`) may only be minted by an internal-caller identity carrying the producer-authority header/proof. An external HTTP caller submitting a critical-tier event name receives HTTP 401 at L1 boundary; the registry check without producer semantics is insufficient (an adversary can submit a legal event name to self-elevate tier — §2.1).

### §7.4 Plutus ledger discipline

- Insert-with-duplicate-catch (NOT upsert) — immutable ledger property preserved.
- External-webhook stable-id derivation: `stripe:{event_id}`, `apple:{transaction_id}`.

## §8 Service contracts

### §8.1 Public — `GET /v1/grid/clusters/status/{clusterId}` (per-cluster) OR `GET /v1/grid/clusters/status/batch` (shared-batched pull, per §3 poll-cost NFR ruling)
No auth required (Site Guest User pattern). Per-cluster returns `{status, statusAsOf, cluster_id}`. Batch returns `[{status, statusAsOf, cluster_id}...]` for all known clusters — the L7 poll target when the shared-batched-pull option is chosen. Referenced by ares `clusterStatusPoll.ts`.

### §8.2 `GET /health` (ALB)
Continues to answer 200 for ALB health checks even when the L7 kill switch is engaged. Business-traffic refusal happens at the middleware layer, not at `/health` (per v2.3 correction 2 — no `/liveness` `/readiness` split).

### §8.3 WAF rules (zeus CDK)
- `RateLimit-Coarse-5min` — 5000 requests / 5-minute rolling window / source IP. BLOCK.
- `AWSManagedRulesAnonymousIpList` — Tor / VPN / hosting-origin sources. BLOCK.
- `AWSManagedRulesBotControlRuleSet` COMMON tier — automated-browser / non-browser UA. BLOCK.
- IPSet enforcement — steward-curated IP block list. BLOCK.

### §8.4 CF_SECRET origin contract (ares §2.16)
CloudFront-origin requests carry `X-Origin-Secret: <value>`. Ares middleware SHA-256s the header value and compares against `Cluster__c.OriginSecretFingerprint__c` for the resolving cluster. Match → admit; mismatch or missing → HTTP 403 with `api.blocked.origin_bypass`. Localhost-exempt for dev.

## §9 Telemetry assertions (the close-out gate)

Concrete log-line + LedgerEntry signatures that MUST appear (or MUST NOT appear) in production telemetry during the Kronos verification run. If they don't, the cycle isn't closed. Silent success is red.

### §9.HUD Hostile-defense observability

- **§9.HUD-1** — When Kronos exceeds 5000 req/5min from one IP, WAF sampled-request logs show `RateLimit-Coarse-5min BLOCK`. **After** the rate rule has entered BLOCK state for that source IP, ares access logs show zero admits for that IP for the remainder of the window (requests establishing the threshold necessarily precede enforcement by construction and are counted separately).
- **§9.HUD-2** — When Kronos originates from Tor / a known VPN provider / a hosting cloud, WAF logs show `AWSManagedRulesAnonymousIpList BLOCK`.
- **§9.HUD-3** — When Kronos submits a `POST /v1/athena/chat` with `event_type=payment.credit` in body from an unauthenticated caller, ares rejects at L1 boundary with HTTP 401 — no raw registry-outside `event_type` reaches classify AND no legal-registry critical-tier event is admitted without producer authority.
- **§9.HUD-4** — When Kronos bursts `recon`-tier events at 10× the token ceiling, `LedgerEntry api.rate_capped` fires for excess **and** `critical`-tier events in the same window write cleanly.
- **§9.HUD-5** — When Plutus is intentionally 503-mocked, ares circuit breaker opens after N failures, subsequent emits fast-fail, and `LedgerEntry ares.circuit.open` writes once per state change.
- **§9.HUD-6** — When `Cluster__c.Status__c` flips to `Suspended`, ares middleware rejects business traffic within the kill-switch SLO (§3) **and** emits `api.blocked.cluster_gate`; `/health` continues to return 200. When SF is unreachable beyond the stale-cache SLO (§3), ares emits `api.blocked.cluster_gate.sf_unreachable`.
- **§9.HUD-7** — When Kronos originates from a non-CIDR-listed IP against a cluster whose `Cluster__c.AllowedIpv4Cidrs__c` is populated, ares rejects with `api.blocked.ip_not_allowed` carrying `rule`, `path`, `client_ip`, `cluster_id`.
- **§9.HUD-8** — When `zeus/scripts/cluster.sh` provisions a cf-secret, `Cluster__c.OriginSecretFingerprint__c` is populated with a 64-hex-char SHA-256 within N seconds. **AND** grep of the following enumerated sinks for the raw secret value returns zero hits: (a) ares stdout / CloudWatch log groups for all ECS tasks in the window; (b) Plutus ledger export (`LedgerEntry__c` CSV via SF data export); (c) Salesforce weekly data export (all objects); (d) WAF sampled-request logs (S3); (e) Zeus CDK outputs + CloudFormation stack events. Assertion is bounded to this enumerated set — sinks added later require a §9.HUD-8 amendment.
- **§9.HUD-9** — When Kronos attempts to mutate any of `Cluster__c.AllowedIpv4Cidrs__c` / `OriginSecretRef__c` / `OriginSecretVersion__c` / `OriginSecretFingerprint__c` on a cluster whose `Status__c` is not `Pending` or `Provisioning`, the immutability validation rule rejects with the specific rule name in the error message.
- **§9.HUD-10** — When Plutus receives a duplicate external-webhook `event_id` (Stripe or Apple replay), the writer catches `DUPLICATE_VALUE` and treats it as success; no duplicate LedgerEntry writes.
- **§9.HUD-11** — When **Plutus** receives SIGTERM under load with events in the ring buffer, the last-gasp drain flushes all `critical`-tier events before exit; `recon`-tier events may drop with metric. (Ring buffer lives in Plutus per §6 assignment, not in Ares.)
- **§9.HUD-11a** — When ares receives SIGTERM under load, in-flight critical retry-queue events either (a) drain within TTL or (b) drop with `api.critical_drop` EMF metric — never silent (§2.5).
- **§9.HUD-12** — Cluster lifecycle: every `Pending → Provisioning → Live → Suspended → Failed → Destroyed` transition writes an immutable `LedgerEntry cluster.status.poll.{transition}` row. UPDATE via any non-admin permset fails with FLS error; DELETE assertion contingent on §5 ruling for §2.15 — either (a) `LedgerEntry.trigger before delete` guard rejects OR (b) permset-only-visibility means only System Administrator can delete AND every delete produces SF setup audit trail evidence.
- **§9.HUD-13** — Origin-bypass rejection. When Kronos issues a request to the public ALB origin either directly OR via an attacker-owned CloudFront distribution WITHOUT the correct `X-Origin-Secret` header, ares rejects at the CF_SECRET middleware boundary with HTTP 403 **before any business processing**. Rejection emits `api.blocked.origin_bypass` with `rule`, `client_ip`, `presented_secret_fingerprint_prefix` (first 8 chars only), `cluster_id`. Kronos must specifically construct the attacker-owned-CF path (which AWS allows any account to point at any public ALB); passing the WAF check but failing the CF_SECRET check is the load-bearing negative case.

### §9.OP Operational hygiene (no regression)

- **§9.OP-1** — Ares → Plutus → SF audit trail carries `user_identity` (Sub__c) as canonical (no `anonymous` post-auth on revenue-attributing routes). This is the EOS-5b GAP-16 that was already closed pre-2.7; the cascade must not regress it.
- **§9.OP-2** — Ares middleware branch coverage ≥ 80% (aligned to §3; the 94/94 in PR #66 is test count, not branch percentage). Zeus WAF rules smoke-tested from IPSet + non-IPSet sources.

## §10 Execution plan

Ordered task list. Cross-layer dependencies surfaced. **This is a coordinated merge sequence — not independent PR merges.**

### §10.1 Pre-merge sync (explicit-attested-SHA pointer discipline)

Per `[Submodule Pointer Bump Discipline]` AND the 2026-09-01 pre-§5 correction: **do not auto-latest submodule pointers to remote brain tips.** Auto-latest smuggles unrelated 2.7 work into the parent commit that triggers CDK prod deploy — the exact pointer-trap that hit PR #126. Instead, for each submodule that will move on this cycle, pin an **explicit attested SHA** in §6.A above, and stage only that SHA.

As of 2026-09-01 the parent has 5 stale submodule pointers (`foundation`, `iris`, `olympus-grid`, `olympus-grid-www`, `proteus`). Of those, only **olympus-grid** is HUD-required (moves to whichever SHA is #345's merge commit). The other four are **unrelated stale pointers** — leave unchanged unless independently reconciled and approved:

- `foundation`: 42 commits ahead (Ceremony-of-Binding + eos-5 doc updates + this cycle branch itself). Independent reconciliation cycle if promoted.
- `iris`: 8 commits ahead including **olympus-gpt v1 go-live** and the **EOS-portal workspace scaffold**. NOT part of hostile-defense scope; independent reconciliation cycle before promotion.
- `olympus-grid-www`: 1 commit (nav fix). Trivial but out-of-scope for this cycle.
- `proteus`: 1 commit (pre-2.7 transition save). Trivial but out-of-scope for this cycle.

**Only olympus-grid's pointer moves in this cycle.** The other four stale pointers remain pinned at their currently-parent-recorded SHAs. If the Steward decides during §10.2 to also promote one of the other four, that pointer decision is captured separately in the ruling record before staging.

Verification snippet (run before staging the parent commit):

```bash
cd olympus-616  # parent
for s in foundation iris olympus-grid olympus-grid-www proteus apollo ares athena hermes omens plutus poseidon zeus; do
  [ -d "$s" ] || continue
  parent_ptr=$(git ls-tree HEAD "$s" | awk '{print $3}' | cut -c1-7)
  (cd "$s" && git fetch origin brain/2.7.x.x --quiet 2>/dev/null)
  remote_tip=$(cd "$s" && git rev-parse --short origin/brain/2.7.x.x 2>/dev/null)
  # For each stale pointer, compare parent_ptr against the *explicit-attested SHA* in §6.A of this doc,
  # NOT against remote_tip. Auto-latest is forbidden.
  printf "  %-18s parent=%s  remote=%s\n" "$s" "$parent_ptr" "$remote_tip"
done
```

### §10.2 Coordinated merge sequence

1. **§5 rulings resolved and locked.** Ticks in §5 (attestation, story, criteria, NFRs, §2.15 DELETE choice, §3 L7-poll choice, sign). No merge before this.
2. **Land schema anchor first — olympus-grid #345.** All downstream repos read `Cluster__c` fields introduced here. Also delivers the `EndpointUrl → Domain` cross-cutting rename. Merging any dependent PR first creates runtime-references-nonexistent-field failures. (Block: §10.2.1.)
3. **Land plutus #42 + zeus #45 in parallel.** Both are independent of each other and of ares. (Block: §10.2.2.)
4. **Land ares #66.** Reads `Cluster__c.AllowedIpv4Cidrs__c` (from #345) and reports status to Plutus (from #42). Verifies §2.16 CF_SECRET middleware behavior against olympus-grid `X-Origin-Secret` contract. (Block: §10.2.2 + §10.2.3.)
5. **Land hermes #62** no later than ares merge. Unblocks the Ares → Plutus → SF audit trail (fixes HTTP 420). Verify sms/email/register modules ship UNMOUNTED per §6.A footnote. (Block: §10.2.2.)
6. **Construct parent #198 pointer commit using ONLY §10.1-approved SHAs.** After the merges above, olympus-grid's new brain-tip SHA becomes the pointer target. Rerun the §10.1 verification snippet immediately before staging. Refresh §6.A parent-PR "Head SHA" column to reflect the post-pointer-commit parent HEAD (attested SHA field is not stable until this point).
7. **Steward production approval per `[prod needs approval]`.** Parent merge triggers Zeus CDK deploy which promotes all Pantheon submodules to prod. This is the gate.
8. **CDK deploy completes.** `git mv brain_2.7.eos-1.md` from `04_in_development/` to `05_verifying/`.
9. **BUILD Kronos harness.** As of 2026-09-01 only the plan doc exists — no code, no CLI, no CI job. Author the harness per `hostile-universe-defense-kronos-redteam-plan-2026-07-24.md`. This is a real authoring effort, not a wire-up. (Effort: TBD — likely the largest single work item in this cycle after the merges.)
10. **Run Kronos § 11 playbooks against deployed `brain/2.7.x.x`.** Fill the N×M attacks × observable signals matrix. Every §9.HUD-1 through §9.HUD-13 + §9.OP-1 + §9.OP-2 must fire green. Silent success is red.
11. **§13 closeout.** Write shipped / deferred / surprised. Link Kronos matrix + six merge SHAs + CDK deploy log. `git mv` this doc to `06_shipped/`. Steward signs.

### §10.3 Deferred to next cycle

- Client-side hostile-defense (cosmos-logos: turtleshell-web / turtleshell-ios / turtleshell-offgrid — request throttling, backoff, billing-anomaly telemetry).
- Kronos harness continuous-integration wiring (this cycle runs Kronos manually against the post-merge deploy; automating it into CI is a later cycle).
- L11 Bot Control tuning (day-one BLOCK is intentional for pre-user platform; tuning belongs post-launch).
- Rotation-with-in-place-key-rotation (this cycle uses spawn-new-cluster; in-place rotation deferred until a later cycle that redesigns for it if needed).

## §11 Verification protocol

Verification is the **Kronos** harness, specified in `olympus-grid/docs/hostile-universe-defense-kronos-redteam-plan-2026-07-24.md`. **The harness itself does not yet exist as of 2026-09-01 — only the plan doc.** §10.2 step 9 owns the build.

### §11.1 Kronos attack model (adversary capabilities)

Per the plan doc, Kronos assumes an adversary who can:
- Rotate source IPs freely (botnets, VPN chains, residential proxies)
- Forge HTTP request bodies including `event_type` strings
- Route around WAF via attacker-owned CloudFront pointing at the public ALB
- Replay legitimate cookies / JWTs briefly after logout
- Cause Plutus to fail intermittently (network conditions / mock-503 injection)
- Cause Salesforce endpoint to become unreachable (DNS override / SG block)
- Submit slow-loris-style stalls (long-lived TCP with dribbled bytes)

Kronos does **NOT** assume the adversary has AWS IAM access, Salesforce admin credentials, physical ECS-host access, or Secrets Manager access.

### §11.2 Per-L-layer attack playbooks

For each L1–L14 + §2.15 + §2.16, Kronos runs:
1. An attack that would defeat the layer if the layer were absent.
2. Verification the defense fired (log signature, LedgerEntry row, WAF sampled-request entry).
3. Verification legitimate traffic in the same window was not collaterally damaged.

Output: an N×M verification matrix (attacks × observable signals). Green = layer held. Red = layer failed OR telemetry was silent — both are critical bugs (silent success is unacceptable for §9 assertion contract).

### §11.3 Server-side validation (this cycle)

Kronos is entirely server-side. All §2 criteria in this cycle verifiable via `curl` + apex anonymous + Kronos-driven load / adversarial harness against the `brain/2.7.x.x`-deployed environment. No iPhone required. BYOK / iPhone attestation lives in `brain_1.7.eos-5.5.md`, not here.

## §12 Rollback plan

Each PR is independently revertable. The coordinated-merge order (§10.2) means rollback proceeds in reverse:

- **hermes #62** — pure config normalize; revert = restore prior `OLYMPUS_GRID_MASTER_URL` handling.
- **ares #66** — full middleware chain revert. Feature-flaggable per L (L1–L7 gate + §2.16 CF_SECRET each toggleable via env var); prefer feature-flag disable over full revert.
- **zeus #45** — CDK stack update; revert = WAF rules revert to prior baseline (weaker defense; only justified if a WAF rule is producing false-positive customer traffic block).
- **plutus #42** — ring-buffer + writer changes; revert = restore prior upsert writer (loses immutability property; strong preference for forward-fix over revert).
- **olympus-grid #345** — schema fields are additive; the risky irreversible element is the immutability validation rules on `Cluster__c`. If a rule needs to be relaxed, add a destructive changes package (Steward approval per `[prod needs approval]`).
- **parent #198** — coordinator revert = submodule pointer bump reverse. Triggers CDK re-deploy of prior Pantheon image.

**Non-revertable elements to be honest about:**
- `LedgerEntry cluster.status.poll.*` rows written after merge cannot be deleted via any supported application path (per §2.15 ruling). Rollback restores schema but leaves history rows in place — this is correct behavior for immutable ledger. A SF admin can break-glass-delete via explicit metadata action; that action itself is audit-logged in SF setup audit trail.
- The `EndpointUrl → Domain` rename cross-cuts all six repos. Rollback of one repo without the others creates cluster-resolution failure. **Do not partial-revert this rename** — either all repos revert together or the rename stays.

## §13 Closeout

*Filled at end of cycle. Cycle moves to `05_verifying/` after §10.2 step 8 (CDK deploy) and remains there through Kronos build + run; then to `06_shipped/` on full green §9 matrix.*

### What shipped
- …

### What deferred (and why)
- …

### What surprised
- …

### Verification evidence
- Link to Kronos verification-matrix output (green rows for all §9.HUD + §9.OP assertions).
- Link to `brain/2.7.x.x` post-merge SHA in each of the six repos.
- Link to CDK deploy log confirming the parent-merge-triggered Pantheon promotion.
- Link to the specific ruling record for §2.15 DELETE-prevention (trigger PR or permset architecture) and §3 L7-poll implementation (Platform Event push or shared-batched pull).

### Feedback that emerged from THIS cycle (seed for the next one)
- Client-side hostile defense (cosmos-logos) — open cycle.
- Kronos-in-CI — open cycle.
- **EOS-portal URL-parser gaps (surfaced 2026-09-01 during this cycle's own doc opening)** — `app.olympus-grid.com/eos/github.com/{owner}/{repo}/{tree|blob}/<ref>/<path>` currently requires the ref segment to be fully percent-encoded (`@` → `%40`, `/` → `%2F`) and requires the caller to know a-priori that `/tree/` is for folders and `/blob/` is for files. Unencoded ref characters return `FOLDER NOT FOUND · repo not found on this ref`; using `/tree/` on a file returns the same. GitHub itself is more permissive (walks successively-longer ref prefixes to disambiguate slash-containing refs; accepts raw `@`; auto-redirects `/tree/` on a file to `/blob/`). Every alias-produced `@<user>/neuralpathway/<sha>-<ts>-<slug>` branch — i.e. every EOS-cycle branch in the fleet — trips this. Fixes (all three needed): (a) walk `GET /repos/{owner}/{repo}/git/refs/heads/{prefix}` with successively-longer prefixes and treat the suffix as path; (b) accept `%40`/`%2F`-encoded and unencoded forms interchangeably; (c) auto-redirect `/tree/<ref>/<file>` → `/blob/<ref>/<file>` (and inverse for folders). Until fixed, the EOS portal cannot dogfood itself against its own most-common branch-name shape. Candidate for a small iris-scoped cycle after §10.2 lands.
- **EOS-portal anonymous-mode GitHub-rate-limit exhaustion (surfaced 2026-09-01)** — a modest session of URL corrections + folder walks + file views burned through GitHub's 60/hr anonymous REST-API cap in a few minutes (reset lag ~48 min). The app correctly prompts *"sign in to lift the 60/hr anonymous limit to 5000/hr"* via a `+ Pilgrim` header button, but the 60/hr anonymous ceiling is so low that any public reader lands on `RATE LIMITED` within one non-trivial exploration session. Design considerations for the fix cycle: (a) aggressive server-side caching of `refs/heads/*`, tree, and blob responses with sensible TTL (blobs at a resolved SHA are immutable — cache forever); (b) coalesce the Activity-panel poll cadence so idle tabs don't burn quota; (c) consider a shared server-side GitHub App identity so anonymous public reads don't consume per-IP quota at all — this is how docs.github.com itself operates; (d) surface remaining quota + reset-at time in the header so operators know when they'll hit the wall before they hit it. Same iris-scoped candidate cycle as the parser gaps above.
- **`LedgerEntry.trigger` delete-prevention gap (surfaced 2026-09-01 during pre-§5 audit)** — #345's immutability model covers UPDATE via permset FLS but not DELETE via trigger. §5 ruling required; closure path folded into §10.2.

### Memory updates
- Added `~/.claude/projects/-Users-gregory-dev-repos-olympus-616/memory/project_hostile_universe_defense.md` (single-authority-doc pointer + $131B incident summary).
- Updated `MEMORY.md` index.

### Cycle close commit
- Coordinated cascade SHAs (per §10.2 outcomes).
- Steward sign-off: **__________** **__________**

---

## References — documents used to design and implement hostile-universe defense

**Sealed design chain (olympus-grid/docs/, in review order):**

- [`hostile-universe-defense-design-2026-07-22.md`](../../../../olympus-grid/docs/hostile-universe-defense-design-2026-07-22.md) — v1, motivating axioms + initial 14-layer cascade
- [`hostile-universe-defense-design-v2-2026-07-23.md`](../../../../olympus-grid/docs/hostile-universe-defense-design-v2-2026-07-23.md) — v2 after LLM adversarial-review round 1
- [`hostile-universe-defense-design-v2.1-2026-07-23.md`](../../../../olympus-grid/docs/hostile-universe-defense-design-v2.1-2026-07-23.md) — v2.1 after review round 2
- [`hostile-universe-defense-design-v2.2-2026-07-23.md`](../../../../olympus-grid/docs/hostile-universe-defense-design-v2.2-2026-07-23.md) — v2.2 after review round 3
- [`hostile-universe-defense-design-v2.3-SEALED-2026-07-23.md`](../../../../olympus-grid/docs/hostile-universe-defense-design-v2.3-SEALED-2026-07-23.md) — **canonical sealed design**; five Steward-walkthrough corrections applied
- [`hostile-universe-defense-kronos-redteam-plan-2026-07-24.md`](../../../../olympus-grid/docs/hostile-universe-defense-kronos-redteam-plan-2026-07-24.md) — Kronos verification harness spec (harness itself not yet built; §10.2 step 9)

**Alpha-org empirical audit (2026-07-22 post-incident):**

- [`alpha-org-audit-2026-07-22.md`](../../../../olympus-grid/docs/alpha-org-audit-2026-07-22.md)
- [`alpha-org-blocked-ips-analysis-2026-07-22.md`](../../../../olympus-grid/docs/alpha-org-blocked-ips-analysis-2026-07-22.md)
- [`alpha-org-blocked-paths-taxonomy-2026-07-22.md`](../../../../olympus-grid/docs/alpha-org-blocked-paths-taxonomy-2026-07-22.md)
- [`alpha-org-purge-decision-matrix-2026-07-22.md`](../../../../olympus-grid/docs/alpha-org-purge-decision-matrix-2026-07-22.md)

**UAT / handoff / cross-surface reference:**

- [`uat-sweep-2026-08-03.md`](../../../../olympus-grid/docs/uat-sweep-2026-08-03.md) — HUD v2.3 UAT sweep
- [`handoff-domain-refactor-status-2026-08-02.md`](../../../../olympus-grid/docs/handoff-domain-refactor-status-2026-08-02.md) — `EndpointUrl → Domain` refactor status
- [`ares/HANDOFF-eos-5.md`](../../../../ares/HANDOFF-eos-5.md) — 525-line EOS-5 attestation state at machine-migration cutover
- [`docs/handoff-ares-self-dos-verification-brief.md`](../../../../docs/handoff-ares-self-dos-verification-brief.md) — ares self-DoS verification brief
- [`docs/sovereign-ai-seam-cross-surface-reference.md`](../../../../docs/sovereign-ai-seam-cross-surface-reference.md) — BYOK / sovereign-AI cross-surface reference (governed by `brain_1.7.eos-5.5.md`, not this cycle)

**Related olympus-grid canon:**

- [`2_7_migation.md`](../../../../olympus-grid/docs/2_7_migation.md) — brain/1.7 → brain/2.7 migration record
- [`ARCHITECTURE.md`](../../../../olympus-grid/docs/ARCHITECTURE.md) — olympus-grid architecture reference
- [`DEFINITION_OF_DONE.md`](../../../../olympus-grid/docs/DEFINITION_OF_DONE.md) — olympus-grid DoD reference

**Sibling in-flight cycle (BYOK / sovereign-AI):**

- [`../04_in_development/brain_1.7.eos-5.5.md`](brain_1.7.eos-5.5.md) — sealed-at-capture credential sovereignty; the athena/apollo/omens/turtleshell-web/turtleshell-ios cascade is attested there, not here.

**Cascade PRs (as of 2026-09-01):**

- olympus-grid #345 — [`consolidated hostile-universe-defense v2.3 + dynamic-MCP tracker`](https://github.com/olympus-616/olympus-grid/pull/345) (W1 anchor)
- ares #66 — [`consolidate hostile-universe-defense v2.3 W3+W4 + §11.1 IP allowlist`](https://github.com/olympus-616/ares/pull/66)
- plutus #42 — [`consolidate attribution subledger (eos-5) + W2 ring buffer`](https://github.com/olympus-616/plutus/pull/42)
- zeus #45 — [`W5 + W7b — WAF hardening + origin secret metadata`](https://github.com/olympus-616/zeus/pull/45)
- hermes #62 — [`consolidate missing sms/email/register + §11.5 normalize`](https://github.com/olympus-616/hermes/pull/62)
- olympus-616 (parent) #198 — [`consolidate launcher client-modes + scratchOrg + eos-5-Ἀκεραιότης`](https://github.com/olympus-616/olympus-616/pull/198)

**Cross-repo canon:**

- `CLAUDE.md § Submodule Pointer Bump Discipline` (olympus-616 parent) — MANDATORY pre-flight for §10.1
- `foundation/eos/cycle/README.md` — EOS operating manual
- `foundation/eos/PATENT-DISCLOSURE-DRAFT.md` — patent disclosure covering the EOS-cycle methodology (§9 telemetry assertions as close-criteria; the pattern this doc embodies)
