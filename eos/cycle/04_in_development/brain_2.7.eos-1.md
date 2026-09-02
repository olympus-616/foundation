# Hostile-universe defense — the platform survives adversarial exploitation of its own cost, capacity, and reachability primitives

> File: `brain_2.7.eos-1.md` — the first EOS cycle on the `brain/2.7.x.x` deployment branch family. The 1.7-family docs in `04_in_development/` (`brain_1.7.eos-5*`) roll forward into `brain/2.7.x.x` without rename per Steward direction 2026-09-01.

| | |
|---|---|
| **Branch family** | `brain/2.7.x.x` |
| **Cycle ordinal** | `eos-1` (first on the 2.7 family; branch-family rollover from 1.7 per README §60-64) |
| **Status** | `In Development` — reconciliation cycle. Implementation predates the doc; direct-to-execution under single-Steward mode (README §270-273). Steward verbal §5 ratification 2026-09-01: *"we need a single authority on the state of hostile defense."* Formal §5 checkboxes pending Steward signature. |
| **Opened** | 2026-09-01 |
| **Closed** | — |
| **Prior cycle** | `brain_1.7.eos-4.1` (last cycle formally shipped to `06_shipped/`; `brain_1.7.eos-5*` sub-attestations remain in `04_in_development/` and roll forward without rename) |
| **Theme** | Hostile-universe defense — reconciliation and single-authority attestation of post-7/17 countermeasures across the fleet |
| **Feedback inputs** | 2026-07-17 $131B AWS billing-alert incident; four-round external LLM adversarial-review chain (Claude / ChatGPT / Grok / Gemini) across `hostile-universe-defense-design` v1 → v2 → v2.1 → v2.2 → v2.3-SEALED; alpha-org empirical audit 2026-07-22; Kronos redteam plan 2026-07-24 |
| **Estimated effort** | Implementation largely landed across six open PRs (see §10); reconciliation + Kronos harness + coordinated merge remaining |
| **Actual effort** | — |

---

## Why this doc exists

On **2026-07-17** the platform absorbed an adversarial event that surfaced as a **$131 billion AWS billing alert** from Amazon. The intended global launch that day was postponed indefinitely; tentative next launch **2026-07-17 → 2027-07-17**.

Between 2026-07-22 and 2026-08-31 the Steward + agents designed and implemented a **fourteen-layer defense cascade** (L1–L14) — provider-neutral defensive primitives (L1–L7) plus an AWS provider profile (L8–L12) plus SF-side control-plane hardening (L13–L14). The design ran four external-LLM adversarial-review rounds and was sealed as **v2.3-SEALED** on 2026-07-23. Implementation shipped as six coordinated open PRs across olympus-grid, ares, plutus, zeus, hermes, and the parent, plus a semantically-overlapping BYOK / sovereign-AI cascade in athena, apollo, omens, turtleshell-web, and turtleshell-ios.

**All of this work was carried out without an EOS cycle to hold it.** No governance artifact exists that names the six PRs as one atomic promotion, no §9 telemetry-assertion set exists that says "the defense HELD," and no single authority answers "what is the state of hostile defense?"

This document is that authority. It reconciles the shipped-but-un-EOS'd work into a single governed cycle, sets the §9 assertion contract that must hold before merge to `brain/2.7.x.x`, and defines the coordinated merge sequence. The doc catches up to reality — same pattern as `brain_1.7.eos-5.5.md`.

---

# § Steward-authored (top half)

## Canonical attestation statement

> *"I attest that following the 2026-07-17 incident of adversarial cost exploitation, the platform has been hardened at every layer where an adversary can convert traffic into cost — WAF coarse rate cap, AWS Managed Rules, IP allowlist, Bot Control, VPC Security Group lockdown, per-cluster IP allowlist, per-cluster status kill switch, in-flight request ceiling, circuit breaker, rate cap token bucket, priority-tier classification, tier-priority ring buffer with SIGTERM last-gasp drain, adaptive insert-with-duplicate-catch writer, and reference-in-SF value-in-vault origin secrets — and that the state of hostile defense is a single-authority attestation traceable to one EOS cycle across six repositories."*
>
> — Steward direction 2026-09-01 (proposed; refine before ticking §5)

## §1 User story

- **§1.1** As **the Steward and every future dust dancer running their own olympus-grid node** I want **every layer at which an adversary can convert traffic into cost to be bounded by construction — not by monitoring, not by alerting, not by post-hoc discovery, but by a defensive primitive that refuses to admit unbounded work** so that **a 2026-07-17-class event cannot recur, and the platform's operational sovereignty extends to its own cost surface**.
- **§1.2** As **the Steward** I want **one authoritative document that names the current state of hostile defense** — which layers exist, which PRs implement them, which assertions verify them, which redteam attacks validate them — so that **when the next adversarial event probes any layer, the answer to "is this layer live in production?" is a single SOQL/git query, not a room-of-agents scramble**.
- **§1.3** As **the platform** I want **each defensive layer's telemetry to be observable in production** so that **an adversary probing the cascade generates a visible signal on every fired defense — not a silent success — and Kronos can verify each layer end-to-end against attacks designed to defeat the layer if the layer were absent**.
- **§1.4** As **the Steward** I want **the six-PR cascade to promote as one atomic coordinated merge** — with schema anchor first, dependents second, coordinator last — so that **no intermediate state exists where one layer's runtime references a field that its dependency hasn't landed, and no CDK deploy triggers with a submodule pointer at a SHA that never made it to `brain/2.7.x.x`** (per `[Submodule Pointer Bump Discipline]`).

## §2 Acceptance criteria

Each criterion is observable end-to-end and maps to one L-layer of the sealed design (`olympus-grid/docs/hostile-universe-defense-design-v2.3-SEALED-2026-07-23.md`). Kronos (`olympus-grid/docs/hostile-universe-defense-kronos-redteam-plan-2026-07-24.md`) will execute the negative-case verification for each.

### §2.A Provider-neutral cascade (L1–L7 — ares + plutus + olympus-grid)

- **§2.1 (L1 — Priority Classification)** — **Given** an inbound event with `event_type` **when** it passes through `ares/api/src/util/event-registry.ts` **then** `classifyTier` returns exactly one of `critical | important | recon` per the closed event registry; **and** no raw `event_type` string literal exists outside the registry (ESLint enforced).
- **§2.2 (L2 — Rate Cap Token Bucket)** — **Given** a burst of `recon`-tier events **when** the rate exceeds the tier's per-second token ceiling **then** excess events are dropped with `LedgerEntry api.rate_capped` **and** `critical`-tier events in the same window are admitted unaffected.
- **§2.3 (L3 — Circuit Breaker)** — **Given** downstream failure at Plutus (>N consecutive HTTP 5xx or timeouts) **when** the breaker opens **then** subsequent emits fast-fail without a downstream call **and** the breaker probes at exponential backoff **and** transitions half-open → closed on N consecutive successes.
- **§2.4 (L4 — In-Flight Ceiling)** — **Given** the in-flight-emit counter is at ceiling **when** a new emit is attempted **then** the emit is queued (if `critical`) or dropped (if `recon`) with a metric — never allowed to inflate ares heap without bound.
- **§2.5 (L5 — Ares Critical Retry Queue + Drop-Summary + EMF)** — **Given** a `critical`-tier emit fails after primary + retry **when** the critical retry queue TTL expires **then** the event drops with an EMF metric + `api.critical_drop` counter — no S3 spill (per v2.3 correction 3).
- **§2.6 (L6 — Plutus Buffer + Insert-With-Duplicate-Catch Writer)** — **Given** an inbound event arrives at Plutus **when** the writer attempts insert **then** on `DUPLICATE_VALUE` the writer treats it as success (immutable ledger; NOT upsert per v2.3 correction 4); **and** external webhooks derive stable IDs (`stripe:{event_id}`, `apple:{transaction_id}`) so replays are idempotent by construction; **and** the three-tier ring buffer drains tier-priority (critical first) with SIGTERM last-gasp flush.
- **§2.7 (L7 — Cluster Status Kill Switch)** — **Given** `Cluster__c.Status__c` flips to `Suspended` or `Failed` in Salesforce **when** the L7 poll (self-scheduled, single-flight, LastModifiedDate-ordered; sub-cycle 2×5s+3s inside 20s interval) next fires **then** within 60s ares `clusterStatusGate` middleware rejects all business traffic with `api.blocked.cluster_gate` **and** `/health` continues to answer 200 for ALB (per v2.3 correction 2 — no `/liveness` `/readiness` split; gate does business-traffic refusal).

### §2.B AWS provider profile (L8–L12 — zeus CDK)

- **§2.8 (L8 — WAF Coarse Rate Rule)** — **Given** any source IP **when** it exceeds 5000 requests / 5-minute rolling window **then** the WAF `RateLimit-Coarse-5min` rule BLOCKs (day-one BLOCK-mode per v2.3 correction 5; no burst rule).
- **§2.9 (L9 — WAF AWS Managed Rules)** — **Given** a request matching AWSManagedRulesAnonymousIpList (Tor exit, VPN provider, hosting/cloud origin) **when** the rule fires **then** the request is BLOCKed at edge; **and** WAF sampled-request logs record the match.
- **§2.10 (L10 — WAF IPSet Enforcement)** — **Given** an IPSet-listed IP (steward-curated block list) **when** any request originates from it **then** the request is BLOCKed at edge with rule name in log.
- **§2.11 (L11 — WAF Bot Control)** — **Given** a request classified `signal:automated_browser` or `signal:non_browser_user_agent` by `AWSManagedRulesBotControlRuleSet` (COMMON tier) **when** the classification fires **then** the request is BLOCKed at edge (day-one BLOCK for pre-user platform).
- **§2.12 (L12 — VPC Security Group Lockdown)** — **Given** a probe of any Pantheon-adjacent AWS resource (RDS, ElastiCache, ECS host, internal ALB) **when** the probe originates from any IP not in the Steward-curated egress allowlist **then** the SG rejects the packet at the VPC boundary.

### §2.C SF-side control-plane (L13–L14 — olympus-grid schema)

- **§2.13 (L13 — Per-Cluster IP Allowlist)** — **Given** `Cluster__c.AllowedIpv4Cidrs__c` is populated on a cluster's row **when** an ares request reaches that cluster's origin **then** the ares §11.1 IP allowlist middleware admits requests only from CIDR-listed sources with dual-family (IPv4/IPv6) parsing and leading-zero-octal defense; **and** on rejection emits `api.blocked.ip_not_allowed` with `rule`, `path`, `client_ip`, `cluster_id`.
- **§2.14 (L14 — Per-Cluster Origin Secret via Reference-in-SF, Value-in-Vault)** — **Given** `Cluster__c.OriginSecretRef__c` + `OriginSecretVersion__c` + `OriginSecretFingerprint__c` are populated after `zeus/scripts/cluster.sh` provisions the cf-secret in AWS Secrets Manager **when** any process reads the cluster row **then** it sees only the reference + version + SHA-256 fingerprint — never the raw secret. **And** a grep of any log dump, Plutus ledger dump, Salesforce data dump, or process-memory dump for the secret value returns zero hits. **And** the immutability validation rules on `Cluster__c` reject any UI/API attempt to mutate `OriginSecretFingerprint__c` after write (the raw secret never leaves Secrets Manager).

### §2.D Immutable-ledger cluster lifecycle

- **§2.15** — **Given** a cluster transitions state (`Pending → Provisioning → Live → Suspended → Failed → Destroyed`) **when** the transition commits **then** an immutable `LedgerEntry cluster.status.poll.{transition}` writes with `cluster_id`, `prior_status`, `new_status`, `actor`, `reason`, `provider_run_id` **and** the row cannot be updated or deleted (validation rule + FLS) — cluster history is append-only forever.

## §3 Non-functional requirements

- **Provider portability** — L1–L7 have zero AWS dependency (portable to Azure, GCP, Linux, off-grid appliance). L8–L12 are AWS-specific; other providers must implement equivalents in their own adapter (out of scope for this cycle).
- **Cost surface bounded by construction** — no defensive layer relies on billing alerts, threshold monitoring, or human intervention to bound cost. Each layer's admission control makes unbounded work impossible before it is measured.
- **Latency budget** — WAF adds < 5ms p95 at edge. Ares middleware chain (L1–L4 + L7 gate + L13 IP allowlist) adds < 10ms p95 to admitted requests. L6 Plutus writer < 50ms p95 in the happy path; < 5s hard timeout under failure.
- **Kill-switch SLO** — < 60s from `Cluster__c.Status__c` flip in Salesforce to enforcement at ares (L7 poll interval 20s + gate propagation < 2s).
- **Immutability** — cluster-lifecycle ledger rows and `Cluster__c.OriginSecretFingerprint__c` are append-only after first write (validation rules enforce). No admin path to mutate.
- **Observability** — every fired defense emits a `LedgerEntry api.blocked.*` or `api.rate_capped` row with `rule`, `path`, `client_ip` (redacted if PII), `cluster_id`, `key_id_hash` (never raw key). No silent-drop.
- **Kronos verifiability** — every §2 claim must be either provable by Kronos-driven adversarial test (§11) or provable by telemetry emit — never by inspection or trust.
- **Rollback bounded by SF row edits, not code redeploy** — L7, L13, L14 defenses toggle via `Cluster__c` field updates (validation exempted for `Status__c` flip). Ares picks up within one poll cycle.
- **Test coverage** — ares middleware chain (L1–L7 + L13) ≥ 80% branch coverage. Zeus CDK WAF rules ≥ smoke-tested with `curl` from IPSet + non-IPSet source. Olympus-grid Cluster__c fields covered by Apex tests (already 50/50 pass in PR #345).

## §4 Feedback inputs

| FB# | Title | Body excerpt / evidence |
|-----|-------|-------------------------|
| — | Incident 2026-07-17 | $131 billion AWS billing alert. Root cause + fingerprint analysis retained in Steward's private incident log. |
| — | External LLM adversarial-review chain | Four rounds (Claude / ChatGPT / Grok / Gemini) reviewed `hostile-universe-defense-design` v1 → v2 → v2.1 → v2.2. Iterative refinement produced v2.3-SEALED 2026-07-23. Chain-of-review recorded in the sealed doc's header. |
| — | Alpha-org empirical audit 2026-07-22 | Three companion docs — `alpha-org-audit-2026-07-22.md`, `alpha-org-blocked-ips-analysis-2026-07-22.md`, `alpha-org-blocked-paths-taxonomy-2026-07-22.md`, `alpha-org-purge-decision-matrix-2026-07-22.md` — enumerate what the alpha-org saw during and immediately after the incident window. |
| — | Kronos redteam plan 2026-07-24 | Per-layer attack playbooks + verification matrix spec. Kronos is the harness Steward is building to validate each L against a defeating attack in a controlled environment. |
| — | Ares self-DoS verification brief | `docs/handoff-ares-self-dos-verification-brief.md` — brief for confirming ares does not self-DoS under L2/L3/L4/L5/L7 cascade activation. |
| — | Ares EOS-5 machine-migration handoff | `ares/HANDOFF-eos-5.md` — 525-line attestation-state capture at machine-migration cutover during the hostile-defense implementation window. |
| — | Sovereign-AI seam reference | `docs/sovereign-ai-seam-cross-surface-reference.md` — cross-surface reference for the BYOK / sovereign-AI adjunct (athena / apollo / omens / turtleshell-*). |
| — | Steward direction 2026-09-01 | Verbatim: *"we need a single authority on the state of hostile defense, and then you and i will work across the repos to clean up all in development work, starting with brain_2.7.eos-1.md so that we can get all of the open work tested and checked in and validated against main branch which is now brain/2.7.x.x."* |

## §5 Steward approval gate

- [ ] Canonical attestation statement locked
- [ ] Story locked (§1.1 – §1.4)
- [ ] Acceptance criteria locked (§2.1 – §2.15)
- [ ] NFRs locked (§3)
- [ ] Approved to execute — signed: **__________** **__________**

**Note on direct-to-execution:** the six-PR cascade is already implemented; verbal Steward ratification 2026-09-01 authorized the doc to be opened in `04_in_development/`. §5 checkboxes remain formally to be ticked. Merge of the coordinated cascade to `brain/2.7.x.x` is gated on §5 tick.

---

# § Agent-authored (bottom half)

## §6 Layer impact map

Six coordinated open PRs form the cascade. All last-touched 2026-08-31 as the "consolidation sweep." Semantically-overlapping BYOK/sovereign-AI cascade is separate; it may promote independently or bundle with the cascade depending on §10.

### §6.A Core hostile-defense cascade (six PRs)

| Wave | Repo | PR | Head SHA | L-layers | Scope summary |
|------|------|----|----------|----------|---------------|
| **W1 (schema anchor)** | olympus-grid | **#345** | `0d59b20f` | L13, L14, L15 | `Cluster__c` fields (`AllowedIpv4Cidrs__c` dual-family CIDR w/ leading-zero-octal defense; `OriginSecretRef__c` / `OriginSecretVersion__c` / `OriginSecretFingerprint__c` triplet); immutability validation rules; W1 public `/v1/grid/clusters/status` route; immutable-ledger cluster lifecycle events; `EndpointUrl → Domain` rename (cross-cuts all six repos). 50/50 Apex tests pass. Supersedes #312 / #322 / #294. |
| **W2** | plutus | **#42** | `a9648c5` | L6 | Three-tier ring buffer (critical / important / recon); tier-priority drain; SIGTERM last-gasp flush; insert-with-duplicate-catch writer (immutable ledger; NOT upsert per v2.3 correction 4). Also carries EOS-5 attribution subledger (7% floor + reversal + orion trigger + Stripe/Apple wiring). Cluster_name→domain rename. Supersedes #38 / #39; closes #41. |
| **W3+W4** | ares | **#66** | `4ad89ed` | L1, L2, L3, L4, L5, L7, L13 | W3 five-stage plutus emit pipeline (classify → rate cap → circuit → ceiling → retry — `plutus-emit-pipeline.ts`). W4 L7 `clusterStatusGate` middleware + `clusterStatusPoll.ts` (self-scheduled, single-flight, LastModifiedDate-ordered; kills business traffic when SF unreachable or `Cluster__c.Status__c ∈ {Suspended, Failed}`). §11.1 IP allowlist middleware reads `Cluster__c.AllowedIpv4Cidrs__c`. CF_SECRET localhost-exempt fix. `HANDOFF-eos-5.md` (525 lines) captures EOS-5 attestation state at machine-migration cutover. 94/94 tests pass. Supersedes #62 / #63 / #65. |
| **W5+W7b** | zeus | **#45** | `7bafd02` | L8, L9, L10, L11, L12, L14 | W5 WAF hardening: `RateLimit-Coarse-5min` (5000/5min/IP) + `AWSManagedRulesAnonymousIpList` (Tor/VPN/hosting) + `AWSManagedRulesBotControlRuleSet` COMMON tier — **all BLOCK-mode day one** (v2.3 correction 5). W7b `cluster.sh` writes ARN + version + SHA-256 fingerprint of cf-secret back to Cluster__c (raw secret never leaves Secrets Manager). VPC SG lockdown baseline. |
| **§11.5 (unblocker)** | hermes | **#62** | `cb6e71d` | — | Normalizes `OLYMPUS_GRID_MASTER_URL` (fixes HTTP 420 that silently broke the Ares → Plutus → SF audit trail during HUD v2.3 UAT — stale scratch-org URL cached in env). Adjacent: new sms/email/register modules ship unmounted (research spike). Supersedes #61 / #59. |
| **coordinator** | parent (olympus-616) | **#198** | `054ea3e` (branch `carryover/launcher-scratchorg-client-modes`) | — | Consolidates launcher client-modes + `scratchOrg` carryover + `eos-5-Ἀκεραιότης` (9 single-god agent modes for `alchemisthomer.sh`). **Explicitly excludes** the 12 submodule pointer bumps from #189 — marks them as prod-CDK-triggering, needs explicit Steward approval per `[prod needs approval]`. |

### §6.B Semantically-overlapping BYOK / sovereign-AI cascade

Pre-incident designed; overlaps hostile-defense semantically because `byok=true → tithed=false, billed=0` removes the cost surface entirely for BYOK'd users. Promotion order can be independent or bundled with §6.A depending on §10.

| Repo | PR | Head SHA | Scope summary |
|------|----|----------|---------------|
| athena | **#106** | `ad23e84` | BYOK sovereign envelope decrypt (`sovereign-envelope.ts` +434 lines); `POST /v1/athena/byok/test` probe; provider precedence `ctx.byokProvider > aiTypeOverride > ATHENA_AI_TYPE`; gemini `maxTokens 300→4096`; grok error handler rewrite; provenance idempotent emit. Package cut to `2.7.0.0`. Retires #102 / #103 / #104 / #105. |
| apollo | **#30** | `02e8bb0` | BYOK for `/speak` + `/music`; OpenAI TTS + ElevenLabs + XTTS; Plutus attribution schema `byok=true → tithed=false, billed=0`; `x-og-provenance` response header. Attested end-to-end on iPhone. |
| omens | **#60** | `0bf2195` | Sovereign envelope v2 primitives (`SealForStorageAsync` + `SealForWireAsync` on `SovereignEnvelopeSealer.cs`). Depends on olympus-grid `/v1/grid/master/grid/clusters/me` domain rename shipping first. |
| turtleshell-web | **#74** | `59e860f` (cosmos-logos org) | No-plaintext-BYOK-anywhere; `crypto_box_seal` at paste time → god-only decrypt; IndexedDB storage of ciphertext; wipe on god-key rotation. Pre-incident (2026-07-07); pending Steward attestation. |
| turtleshell-ios | **#32** | `08ee9a8` (cosmos-logos org) | Companion to turtleshell-web #74; CryptoKit + Keychain (`kSecAttrAccessibleWhenUnlockedThisDeviceOnly`). Pre-incident (2026-07-07); pending Steward attestation. |

### §6.C Repos not participating in this cycle

- **cosmos-logos** — silent since 2026-07-07 (ten days pre-incident). No client-side hostile-defense work exists. Explicitly deferred to a future cycle. Client-side defensive posture (request throttling, backoff, billing-anomaly telemetry) is a gap noted for the next 2.7-family cycle.
- **turtleshell-offgrid** — dormant since 2026-04-10. No sovereign-AI-v2 companion PR exists. Deferred.
- **agora, homework-buddy, thoth, alpha, resolver2, team-journal, .github** — dormant client repos. Deferred.

## §7 Schema deltas

### §7.1 New `Cluster__c` fields (olympus-grid #345)

| Field | Type | Purpose |
|-------|------|---------|
| `AllowedIpv4Cidrs__c` | Long Text Area | Dual-family CIDR list (IPv4 + IPv6); ares reads for L13 IP allowlist middleware. Parser defends against leading-zero-octal ambiguity. |
| `OriginSecretRef__c` | Text | Secrets Manager ARN of the CloudFront-origin secret for this cluster. |
| `OriginSecretVersion__c` | Text | Secrets Manager version-id of the currently-active secret. |
| `OriginSecretFingerprint__c` | Text (64) | SHA-256 fingerprint of the current secret value. Immutable after first write. |

### §7.2 New validation rules

- `Cluster__c.OriginSecretFingerprint__c` — no UI/API mutation once set; immutability enforced by validation rule.
- `LedgerEntry cluster.status.poll.{transition}` rows — no update, no delete (append-only cluster history).

### §7.3 Closed event registry (ares)

- `ares/api/src/util/event-registry.ts` — canonical enum of every legal `event_type` string. ESLint rule forbids raw `event_type` string literals outside this file. `classifyTier` operates exclusively over registry entries.

### §7.4 Plutus ledger discipline

- Insert-with-duplicate-catch (NOT upsert) — immutable ledger property preserved.
- External-webhook stable-id derivation: `stripe:{event_id}`, `apple:{transaction_id}`.

## §8 Service contracts

### §8.1 Public — `GET /v1/grid/clusters/status/{clusterId}`
No auth required (Site Guest User pattern). Returns `{status, statusAsOf, cluster_id}` — the L7 poll target. Referenced by ares `clusterStatusPoll.ts`.

### §8.2 `GET /health` (ALB)
Continues to answer 200 for ALB health checks even when the L7 kill switch is engaged. Business-traffic refusal happens at the middleware layer, not at `/health` (per v2.3 correction 2 — no `/liveness` `/readiness` split).

### §8.3 WAF rules (zeus CDK)
- `RateLimit-Coarse-5min` — 5000 requests / 5-minute rolling window / source IP. BLOCK.
- `AWSManagedRulesAnonymousIpList` — Tor / VPN / hosting-origin sources. BLOCK.
- `AWSManagedRulesBotControlRuleSet` COMMON tier — automated-browser / non-browser UA. BLOCK.
- IPSet enforcement — steward-curated IP block list. BLOCK.

### §8.4 `x-og-provenance` response header (apollo #30, athena #106)
Voice + LLM response provenance header naming `byok=true|false`, `provider`, `god_key_used` (Ed25519 pubkey fingerprint of the god that unsealed the envelope), `request_id`.

## §9 Telemetry assertions (the close-out gate)

Concrete log-line + LedgerEntry signatures that MUST appear (or MUST NOT appear) in production telemetry during the Kronos verification run. If they don't, the cycle isn't closed.

### §9.HUD Hostile-defense observability

- **§9.HUD-1** — When Kronos exceeds 5000 req/5min from one IP, `WAF sampled-request logs` show `RateLimit-Coarse-5min BLOCK` **and** ares access logs show zero admits for that IP in the window.
- **§9.HUD-2** — When Kronos originates from Tor / a known VPN provider / a hosting cloud, WAF logs show `AWSManagedRulesAnonymousIpList BLOCK`.
- **§9.HUD-3** — When Kronos submits a `POST /v1/athena/chat` with `event_type=payment.credit` in body, ares rejects at L1 boundary — no raw registry-outside `event_type` ever reaches classify.
- **§9.HUD-4** — When Kronos bursts `recon`-tier events at 10× the token ceiling, `LedgerEntry api.rate_capped` fires for excess **and** `critical`-tier events in the same window write cleanly.
- **§9.HUD-5** — When Plutus is intentionally 503-mocked, ares circuit breaker opens after N failures, subsequent emits fast-fail, and `LedgerEntry ares.circuit.open` writes once per state change.
- **§9.HUD-6** — When `Cluster__c.Status__c` flips to `Suspended`, ares middleware rejects business traffic within 60s **and** emits `api.blocked.cluster_gate`; `/health` continues to return 200.
- **§9.HUD-7** — When Kronos originates from a non-CIDR-listed IP against a cluster whose `Cluster__c.AllowedIpv4Cidrs__c` is populated, ares rejects with `api.blocked.ip_not_allowed` carrying `rule`, `path`, `client_ip`, `cluster_id`.
- **§9.HUD-8** — When `zeus/scripts/cluster.sh` provisions a cf-secret, `Cluster__c.OriginSecretFingerprint__c` is populated with a 64-hex-char SHA-256 within N seconds **and** grep of any log/ledger/dump for the raw secret value returns zero hits.
- **§9.HUD-9** — When Kronos attempts to mutate `Cluster__c.OriginSecretFingerprint__c` via UI or API, the immutability validation rule rejects with a specific error code.
- **§9.HUD-10** — When Plutus receives a duplicate external-webhook `event_id` (Stripe or Apple replay), the writer catches `DUPLICATE_VALUE` and treats it as success; no duplicate LedgerEntry writes.
- **§9.HUD-11** — When ares receives SIGTERM under load with tier-1 events in the ring buffer, the last-gasp drain flushes all `critical`-tier events before exit; `recon`-tier events may drop with metric.
- **§9.HUD-12** — Cluster lifecycle: every `Pending → Provisioning → Live → Suspended → Failed → Destroyed` transition writes an immutable `LedgerEntry cluster.status.poll.{transition}` row that cannot be updated or deleted.

### §9.BYOK Sovereign-AI observability (adjunct, if bundled)

- **§9.BYOK-1** — When a user submits a BYOK LLM key sealed with athena's cosmos-logos public key, `x-og-provenance` response header carries `byok=true`, `god_key_used=<athena_fingerprint>`, and Plutus ledger row carries `tithed=false, billed=0`.
- **§9.BYOK-2** — When a BYOK envelope arrives at the wrong god (e.g., apollo-sealed envelope reaches athena), decryption fails loudly with `envelope.decrypt_failed` — the request rejects rather than continuing with a null credential.

### §9.OP Operational hygiene (no regression)

- **§9.OP-1** — Ares → Plutus → SF audit trail carries `user_identity` (Sub__c) as canonical (no `anonymous` post-auth on revenue-attributing routes). This is the EOS-5b GAP-16 that was already closed pre-2.7; the cascade must not regress it.
- **§9.OP-2** — 100% of ares middleware branch coverage per §3; zeus WAF rules smoke-tested from IPSet + non-IPSet sources.

## §10 Execution plan

Ordered task list. Cross-layer dependencies surfaced. **This is a coordinated merge sequence — not independent PR merges.**

### §10.1 Pre-merge sync (submodule pointer discipline — MANDATORY)

Per `[Submodule Pointer Bump Discipline]`, the parent has 5 STALE submodule pointers as of 2026-09-01: `foundation`, `iris`, `olympus-grid`, `olympus-grid-www`, `proteus`. Before staging any parent commit, in each affected submodule:

```bash
cd <submodule>
git mainbrain && git pull
```

Then verify with the verification snippet in `CLAUDE.md § Submodule Pointer Bump Discipline`. Only after every submodule points at its remote `brain/2.7.x.x` tip may parent staging proceed.

### §10.2 Coordinated merge sequence

1. **Land schema anchor first — olympus-grid #345.** All downstream repos read `Cluster__c` fields introduced here. Merging any dependent PR first creates runtime-references-nonexistent-field failures. (Block: nothing.)
2. **Land plutus #42 + zeus #45 in parallel.** Both are independent of each other and of ares. (Block: §10.2.1.)
3. **Land ares #66.** Reads `Cluster__c.AllowedIpv4Cidrs__c` (from #345) and reports status to Plutus (from #42). (Block: §10.2.1 + §10.2.2.)
4. **Land hermes #62.** Unblocks the Ares → Plutus → SF audit trail (fixes HTTP 420). Order-independent but should not be deferred past ares merge or UAT will surface HTTP 420 again. (Block: nothing.)
5. **Land parent #198 with coordinated submodule pointer bump.** Explicit Steward approval per `[prod needs approval]` — parent merge triggers Zeus CDK deploy which promotes all Pantheon submodules to prod. Pre-flight: rerun the STALE/OK pointer verification snippet from §10.1.
6. **Post-merge: Kronos harness run.** Execute §11 verification against `brain/2.7.x.x`-deployed environment. Every §9 assertion must fire green.
7. **Post-Kronos: BYOK/sovereign-AI cascade merge decision** — athena #106, apollo #30, omens #60. Bundle with §6.A or promote as a separate cycle at Steward direction.
8. **§13 closeout** — write closeout, `git mv` to `05_verifying/` for the Kronos post-merge validation window, then `git mv` to `06_shipped/` on green.

### §10.3 Deferred to next cycle

- Client-side hostile-defense (cosmos-logos: turtleshell-web / turtleshell-ios / turtleshell-offgrid — request throttling, backoff, billing-anomaly telemetry).
- turtleshell-web #74 + turtleshell-ios #32 sovereign-AI-v2 formal Steward attestation.
- Kronos harness continuous-integration wiring (this cycle runs Kronos manually against the post-merge deploy; automating it into CI is a later cycle).
- L11 Bot Control tuning (day-one BLOCK is intentional for pre-user platform; tuning belongs post-launch).

## §11 Verification protocol

Verification is the **Kronos** harness, specified in `olympus-grid/docs/hostile-universe-defense-kronos-redteam-plan-2026-07-24.md`.

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

For each L1–L14, Kronos runs:
1. An attack that would defeat the layer if the layer were absent.
2. Verification the defense fired (log signature, LedgerEntry row, WAF sampled-request entry).
3. Verification legitimate traffic in the same window was not collaterally damaged.

Output: an N×M verification matrix (attacks × observable signals). Green = layer held. Red = layer failed OR telemetry was silent — both are critical bugs (silent success is unacceptable for §9 assertion contract).

### §11.3 Without-iPhone validation
Kronos is server-side. All §2 criteria except §9.BYOK verifiable via `curl` + apex anonymous + Kronos-driven load / adversarial harness against the `brain/2.7.x.x`-deployed environment.

### §11.4 With-iPhone validation
- §9.BYOK-1 (BYOK provenance header) — end-to-end apple-iOS BYOK key paste → athena decrypt → provenance in response. Requires the turtleshell-ios sovereign-AI-v2 PR (#32) merged first.

## §12 Rollback plan

Each PR is independently revertable. The coordinated-merge order (§10.2) means rollback proceeds in reverse:

- **hermes #62** — pure config normalize; revert = restore prior `OLYMPUS_GRID_MASTER_URL` handling.
- **ares #66** — full middleware chain revert. Feature-flaggable per L (L1–L7 gate each toggleable via env var); prefer feature-flag disable over full revert.
- **zeus #45** — CDK stack update; revert = WAF rules revert to prior baseline (weaker defense; only justified if a WAF rule is producing false-positive customer traffic block).
- **plutus #42** — ring-buffer + writer changes; revert = restore prior upsert writer (loses immutability property; strong preference for forward-fix over revert).
- **olympus-grid #345** — schema fields are additive; the risky irreversible element is the immutability validation rule on `OriginSecretFingerprint__c`. If the rule needs to be relaxed, add a destructive changes package (Steward approval per `[prod needs approval]`).
- **parent #198** — coordinator revert = submodule pointer bump reverse. Triggers CDK re-deploy of prior Pantheon image.

**Non-revertable elements to be honest about:**
- `LedgerEntry cluster.status.poll.*` rows written after merge cannot be deleted (append-only by design). Rollback restores schema but leaves history rows in place — this is correct behavior for immutable ledger.
- The `EndpointUrl → Domain` rename cross-cuts all six repos. Rollback of one repo without the others creates cluster-resolution failure. **Do not partial-revert this rename** — either all repos revert together or the rename stays.

## §13 Closeout

*Filled at end of cycle. Cycle moves to `05_verifying/` after §10.2 step 5 (parent merge + CDK deploy) and Kronos-harness pass; then to `06_shipped/` after full §9 assertion green run.*

### What shipped
- …

### What deferred (and why)
- …

### What surprised
- …

### Verification evidence
- Link to Kronos verification-matrix output (green rows for all §9 assertions).
- Link to `brain/2.7.x.x` post-merge SHA in each of the six repos.
- Link to CDK deploy log confirming the parent-merge-triggered Pantheon promotion.

### Feedback that emerged from THIS cycle (seed for the next one)
- Client-side hostile defense (cosmos-logos) — open cycle.
- Kronos-in-CI — open cycle.

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
- [`hostile-universe-defense-kronos-redteam-plan-2026-07-24.md`](../../../../olympus-grid/docs/hostile-universe-defense-kronos-redteam-plan-2026-07-24.md) — Kronos verification harness spec

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
- [`docs/sovereign-ai-seam-cross-surface-reference.md`](../../../../docs/sovereign-ai-seam-cross-surface-reference.md) — BYOK / sovereign-AI cross-surface reference

**Related olympus-grid canon:**

- [`2_7_migation.md`](../../../../olympus-grid/docs/2_7_migation.md) — brain/1.7 → brain/2.7 migration record
- [`ARCHITECTURE.md`](../../../../olympus-grid/docs/ARCHITECTURE.md) — olympus-grid architecture reference
- [`DEFINITION_OF_DONE.md`](../../../../olympus-grid/docs/DEFINITION_OF_DONE.md) — olympus-grid DoD reference

**Cascade PRs (as of 2026-09-01):**

- olympus-grid #345 — [`consolidated hostile-universe-defense v2.3 + dynamic-MCP tracker`](https://github.com/olympus-616/olympus-grid/pull/345) (W1 anchor)
- ares #66 — [`consolidate hostile-universe-defense v2.3 W3+W4 + §11.1 IP allowlist`](https://github.com/olympus-616/ares/pull/66)
- plutus #42 — [`consolidate attribution subledger (eos-5) + W2 ring buffer`](https://github.com/olympus-616/plutus/pull/42)
- zeus #45 — [`W5 + W7b — WAF hardening + origin secret metadata`](https://github.com/olympus-616/zeus/pull/45)
- hermes #62 — [`consolidate missing sms/email/register + §11.5 normalize`](https://github.com/olympus-616/hermes/pull/62)
- olympus-616 (parent) #198 — [`consolidate launcher client-modes + scratchOrg + eos-5-Ἀκεραιότης`](https://github.com/olympus-616/olympus-616/pull/198)

**BYOK / sovereign-AI adjunct PRs:**

- athena #106 — `feat(athena): 2.7.0.0 — EOS-5.4 sovereign AI consolidation`
- apollo #30 — `feat(apollo): EOS-5.4 sovereign AI — BYOK envelope decrypt`
- omens #60 — `consolidation 2.7 — sovereign envelope v2 primitives`
- cosmos-logos/turtleshell-web #74 — `sovereign AI v2 — no plaintext BYOK anywhere`
- cosmos-logos/turtleshell-ios #32 — `sovereign AI v2 — no plaintext BYOK, Keychain-sealed inner`

**Cross-repo canon:**

- `CLAUDE.md § Submodule Pointer Bump Discipline` (olympus-616 parent) — MANDATORY pre-flight for §10.1
- `foundation/eos/cycle/README.md` — EOS operating manual
- `foundation/eos/PATENT-DISCLOSURE-DRAFT.md` — patent disclosure covering the EOS-cycle methodology (§9 telemetry assertions as close-criteria; the pattern this doc embodies)
