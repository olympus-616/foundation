# Guest-access lockdown — no revenue-attributing endpoint admits an unattributed request

> File name: `brain_1.7.eos-5.2.md` — second sub-ordinal off `brain_1.7.eos-5` covering the "properly locked down from guest access" attestation.

| | |
|---|---|
| **Branch family** | `brain/1.7.x.x` |
| **Cycle ordinal** | `eos-5.2` (sibling to `eos-5`, parallel-open per single-Steward mutex relaxation) |
| **Status** | `Draft` — awaiting Steward §1-§5 authoring |
| **Opened** | 2026-07-03 |
| **Closed** | — |
| **Prior cycle** | `brain_1.7.eos-5` (READINESS attestation — the platform is *wired* to accept money; 5.2 proves the *perimeter is locked down* so guest access can't ride the wire) |
| **Theme** | Prove no revenue-attributing endpoint admits an unattributed request — reconcile EOS agent's empirical `/v1/athena/chat` no-auth finding with backend-agent's api-key-pipeline audit; land GAP-A through GAP-E; produce the definitive answer that eliminates guest-billing exposure before first dollar |
| **Feedback inputs** | Steward direction 2026-07-03 (verbatim): *"we cannot accept money until we have proven that the platform is properly locked down from guest access. this would be eos-5.2 ... we will need a definitive answer to triage against on eos-5.2 but we can do that after eos-5 is complete because we are almost done."* + EOS-5 triage `eos-5b-triage.md` §5.10 (reconciliation scope) + backend-agent api-key audit (GAP-A through GAP-E) |
| **Estimated effort** | TBD by Steward at §5 approval — likely 20-40h agent + 5-10h Steward |
| **Actual effort** | — |

---

## Source specification

Two documents converge as the executable spec:

1. **[`../04_in_development/eos-5b-triage.md`](../04_in_development/eos-5b-triage.md) §5.9 + §5.10** — the empirical auth-matrix test (4 unauthenticated cells × `/v1/athena/chat` = 4× HTTP 200 with GPT-4o response) + the reconciliation scope note recording the disagreement between the empirical finding and the backend-agent pipeline audit.
2. **Backend-agent api-key pipeline audit (2026-07-03)** — traced `apiKeyMiddleware.ts:115-155` → SHA-256 hash → 5-min LRU → `ApiRouteIdentityKeyResolver.cls:38-132` → JWT mint → rate limiter → kill switch. Correct header is `x-og-key` (NOT `Authorization: Bearer`). Backend-agent-named gaps: **GAP-A** (`RateLimit__c` display theater), **GAP-B** (revoked_keys not auto-synced), **GAP-C** (WAF no `x-og-key` ByteMatch), **GAP-D** (resolver auth header-only), **GAP-E** (no Ares tests).

## Why this doesn't fold into EOS-5

EOS-5 attests READINESS — every revenue-accepting surface is *wired* signup → dedup → AP Active → cause chosen. That's the payment-integration precondition. **EOS-5.2 attests the perimeter around those wires** — that no anonymous request can piggyback on the revenue-attributing routes. The two claims interlock: without 5.2's guarantee, 5's claim leaks (an anonymous chat turn burns money attributed to `default` cause; a valid but non-registered key does the same). Closing one without the other creates a data-integrity void the moment traffic scales.

Under `republic-616`, this attestation shape becomes the multi-party-audited "least-authority ingress" claim.

---

# § Steward-authored (top half)

## §1 User story

*Steward to author. Suggested framing:*

> As **CloudPremise LLC / the Steward** I want **every revenue-attributing endpoint at the Ares perimeter to reject any request that does not resolve to a real Identity/Application/Tenant** so that **no customer, developer, or attacker can generate billable god-service usage without their traffic being attributable to a payer, a cause, and a tenant.**

## §2 Acceptance criteria

*Steward to author. Suggested Gherkin seeds:*

- **§2.1** — Given `POST /v1/athena/chat` **when** no `Authorization` header AND no `x-og-key` header present **then** HTTP 401 (or 403) **and** LedgerEntry `api.blocked.auth_required` fires **and** no downstream god emit happens **and** zero LLM tokens consumed.
- **§2.2** — Given the same endpoint **when** an unknown / revoked / expired `x-og-key` present **then** HTTP 401 **and** `api.blocked.invalid_key` fires **and** counter for per-IP rate-limit-on-invalid-key increments.
- **§2.3** — Given a valid `x-og-key` **when** the endpoint is hit **then** Ares resolves the key via `ApiRouteIdentityKeyResolver`, mints internal JWT, injects `x-user-identity` + `x-og-key-id` + `x-og-key-derived: 1` **and** the resulting LedgerEntry rows carry `payload.shell_id={sub}` + `payload.tenant_id={tenant}` + `payload.application_id={app}` matching the key's registered Identity/App/Tenant.
- **§2.4** — Given a valid key with `IdentityKey__c.RateLimit__c = 5000 rpm` **when** the endpoint is hit at 4999 rpm **then** all requests admitted; **when** hit at 5001 rpm **then** requests over ceiling reject with HTTP 429 **and** `api.blocked.rate_limit_per_key` fires. (**GAP-A close**)
- **§2.5** — Given `IdentityKey__c.Active__c` flips false→true in Salesforce **when** the change is committed **then** the Ares kill-switch's `revoked_keys` list updates within 60 seconds via Platform Event pipeline **and** the next request with that key is blocked at kill-switch (bypasses cache TTL). (**GAP-B close**)
- **§2.6** — Given a rapid random-key spray (10k req/s of `og_live_${random}`) **when** the requests hit CloudFront **then** WAF rate-limit-on-`x-og-key` blocks the spray at edge **and** the Salesforce resolver sees ≤ N calls (some floor number, TBD). (**GAP-C close**)
- **§2.7** — Given a request to `POST https://olympus-grid-alpha-1.my.salesforce.com/services/apexrest/v1/grid/master/internal/identity/key-resolve` **when** the caller does NOT provide the shared HMAC signature (or SSM-managed shared bearer) **then** HTTP 403 **and** Apex log records the unauthorized attempt. (**GAP-D close**)
- **§2.8** — Given the Ares middleware stack (`apiKeyMiddleware.ts`, `rateLimiter.ts`, `killSwitch.ts`, `policy-loader.ts`, `resolver-client.ts`) **when** `npm test` runs in `ares/api` **then** > 80% branch coverage across those files **and** all critical paths (valid key, invalid key, no key, revoked, expired, rate-limited, resolver timeout) have named tests. (**GAP-E close**)
- **§2.9 — cross-endpoint audit** — Given ALL Ares-fronted routes (Athena chat, Athena analyze, Athena tools, Poseidon MCP, Mnemosyne search, Apollo TTS, Apollo music, Plutus quota, Heracles content) **when** the auth-matrix test suite runs (5 auth cells × N routes) **then** for every revenue-attributing route: no-auth → 401; garbage → 401; valid → 200 with correct attribution stamped in payload.
- **§2.10 — GAP-51 empirical reconciliation** — Given the exact 4-cell test that EOS agent ran 2026-07-03 (`Authorization: Bearer og_live_...`, `Authorization: Bearer og_live_INVALID_...`, `Authorization: Bearer totally_not_a_key`, no header) **when** it re-runs post-5.2 **then** cells 1-3 return 401 (bearer format isn't the canonical auth) **and** cell 4 returns 401; when the same test runs with `x-og-key: og_live_...` (correct header) it returns 200 with fully-attributed rows.

## §3 Non-functional requirements

*Steward to author. Suggested spine:*

- **Perimeter uniformity** — no route may be a special case; the enforcement rule is "auth-required=true unless listed public" (allow-list-public not deny-list-private).
- **Latency budget** — key resolution 95p ≤ 50ms cache-hit / ≤ 300ms cache-miss (SF resolver).
- **Cost budget** — SF resolver Apex governor consumption ≤ N per hour; monitor per-org limits.
- **Observability** — every `api.blocked.*` event carries `rule`, `path`, `client_ip`, `key_id_hash` (never raw key).
- **Reversibility** — enforcement can be toggled per-route via policy overlay without redeploy.
- **Kill-switch SLO** — < 60s from `Active__c=false` to enforcement.
- **Test-suite gate** — Ares CI blocks merge if middleware coverage drops below 80%.

## §4 Feedback inputs

| FB# | Title | Body excerpt |
|-----|-------|--------------|
| — | Steward 2026-07-03 (open EOS-5.2) | *"we cannot accept money until we have proven that the platform is properly locked down from guest access. this would be eos-5.2."* |
| — | Steward 2026-07-03 (reconciliation deferred) | *"we will need a definitive answer to triage against on eos-5.2 but we can do that after eos-5 is complete because we are almost done."* |
| — | EOS agent empirical 2026-07-03 | 4-cell auth-matrix against `POST /v1/athena/chat` → all 4 cells HTTP 200 streaming GPT-4o; zero `api.blocked.*` events fired |
| — | Backend-agent pipeline audit 2026-07-03 | `x-og-key` pipeline traced end-to-end + GAP-A/B/C/D/E named as real gaps |

## §5 Steward approval gate

- [ ] Story locked
- [ ] Criteria locked
- [ ] NFRs locked
- [ ] Approved to execute — signed: **{Steward initials}** **{date}**

---

# § Agent-authored (bottom half — DO NOT populate until §5 is signed)

Sections §6-§13 are held blank per EOS discipline: no decomposition, execution plan, telemetry assertions, or rollback until the Steward has locked §1-§5. When §5 signs, the agent-half will be authored against the two source docs above (eos-5b-triage.md §5.10 + backend-agent audit).

## §13 close-criterion preview (for §5 approval context)

The cycle closes GREEN when the auth-matrix suite (§2.9) runs against every revenue-attributing route and every anonymous-mode cell returns 401 with `api.blocked.*` fired — and every valid-key cell returns 200 with correctly-attributed payload. Definitive reconciliation of GAP-51 lands as the §2.10 evidence. GAP-A through GAP-E each attest their own §2 criterion. `06_shipped/brain_1.7.eos-5.2.md` becomes canon for "the platform's revenue perimeter admits no anonymous request."
