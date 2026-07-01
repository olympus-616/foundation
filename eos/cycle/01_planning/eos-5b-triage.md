# EOS-5 Attestation Triage — `eos-5b-triage.md`

> **Purpose:** This document is the minimum closure criteria for the EOS-5 attestation statement —
> *"I attest the entire application has data integrity for each database record that is created, so that we can manage, monitor, and optimize the work that was created. I further attest the system properly accounts for an algorithmic royalty disbursement system, of which the first royalty to go into production is a 7% tithe tied to the reduction of human suffering."*
>
> **Steward framing 2026-06-27:** *"this document will be the minimum criteria by which we would ever attest, we can safely take your money. and i mean it. i plan to move trillions through these pipes."*
>
> Each gap below is a specific contract that must be empirically verified closed in production telemetry before EOS-5 can advance to `06_shipped/`. No gap may be left "deferred-but-acceptable" if it threatens `§9.A` (attribution) or `§9.T` (tithe). The acceptance criteria are binary and testable.
>
> **Companion document:** [`brain_1.7.eos-5.md`](brain_1.7.eos-5.md) — the EOS-5 cycle doc itself. Appendix A of that doc captures the in-flight gap log; this doc is the structured triage + closure tracker.
>
> **Replay instruction:** every gap entry contains the production scenario, the real SObject IDs / payload JSON / timestamps that proved it, the expected behavior, and the acceptance criteria. A future development agent can read any gap entry standalone and reproduce the test that surfaced it.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Test Environment + Provenance](#2-test-environment--provenance)
3. [Triage Buckets — Summary Table](#3-triage-buckets--summary-table)
4. [Gap Inventory — Sequential Detail](#4-gap-inventory--sequential-detail)
5. [Cross-Cutting Patterns](#5-cross-cutting-patterns)
6. [Execution Plan — Minimum Technical Solutions Per Fix](#6-execution-plan--minimum-technical-solutions-per-fix)
7. [Closure Tracking Table](#7-closure-tracking-table)
8. [Replay Instructions for Future Agent](#8-replay-instructions-for-future-agent)

---

## 1. Executive Summary

### 1.1 What was tested

A receiver-mode validation run on **2026-06-27** against the **alpha-org** production Salesforce instance (`olympus-grid-alpha-1.my.salesforce.com`, managed-package namespace `og_node_beta_1`) plus production AWS clusters (account 842485730943, regions us-east-1). The Steward acted as the test user (homer@cloudpremise.com); the EOS agent observed system state changes via SOQL queries and logged every gap between expected and actual behavior.

Three use cases were planned:

| Use case | Scope | Status |
|---|---|---|
| **UC-1** Sign-up across all surfaces | iris · olympus-gpt · turtleshell-web · turtleshell-ios · guardians-iOS · both Apple SIWA and email-link methods | **COMPLETE** — 8 distinct signin events across 5 surfaces |
| **UC-2** Cluster provisioning | Spawn new `eos-5` cluster via iris admin, observe Pending → Provisioning → Live lifecycle | **PARTIAL** — went Live then surfaced second non-operational bug |
| **UC-3** Cluster utilization end-to-end | Drive llm.turn / mcp.tool.call / image.recognition / pdf.recognition through eos-5, validate full 5-tuple attribution | **NOT RUN** — blocked on cluster fix |

### 1.2 What is empirically sound

- **Identity primitive** — one homer across 8 auth events (Apple + email, web + iOS, all 5 surfaces) → exactly one `Identity__c` row, one stable `Sub`, one stable `AppleUserId`. Cross-method cross-platform continuity is rock-solid.
- **ApplicationProfile dedup** — composite natural key `<IdentityId>_<AppKey>` (External ID, unique constraint) produced exactly one AP row per (user × app). Four sign-ups produced four AP rows: AP-00090 (iris), AP-00091 (gpt), AP-00092 (turtleshell — shared web + ios), AP-00093 (guardians).
- **Per-app email template branding** — every AppKey emits per-app-themed waitlist/approved/magicLink email subjects from `Application__c.EmailTemplates__c` JSON. Each app's voice is distinct (Olympus-Grid Admin / olympus-gpt.ai / TurtleShell.ai / Guardians of Olympus).
- **AppKey consolidation pattern** — turtleshell-web + turtleshell-ios share one AppKey, one AP, one Identity. Cross-platform surfaces correctly converge on one record.
- **Apple SIWA on web path** — `/v1/auth/apple/verify-only` correctly emits `api.inbound` LedgerEntry through Ares.

### 1.3 What is empirically broken (the BLOCKER chain)

| Failure mode | Evidence |
|---|---|
| Apex emits ZERO LedgerEntries for any state transition | 4 AP-status transitions + 1 SuperAdmin grant + 1 cluster Pending→Live → 0 LedgerEntry rows from Apex |
| Email-link auth bypasses Ares entirely (4-of-4 surfaces) | every `POST /v1/auth/email/link/{request,verify}` produced 0 `api.inbound` rows |
| Guardians-iOS auth bypasses Ares — BOTH methods | the 7/17 launch spine surface has ZERO visibility for any authentication event |
| `LedgerEntry.user_id="anonymous"` post-auth on most endpoints | apollo / chronos / proteus / heracles all anonymous even when signed in; only plutus/quota carries sub |
| SuperAdmin grant has zero audit footprint | `Identity.SuperAdmin__c` flipped false→true with no LedgerEntry, no Logger row, no email — only LastModifiedDate timestamp |
| Cause attribution: canon-read field `Identity.PrimaryCause__c` does not exist | onboarding writes to `AP.ProfileData.cause`; tithe canon reads from `Identity.PrimaryCause__c`; field absent from schema; per-AP causes already diverged (gpt="Save the Oceans" vs turtleshell="Clean Water for All") |
| `Cluster__c.Status='Live'` divorced from actual reachability | SF says Live; HTTP probe returns 000 in 36ms |

### 1.4 §9 letter chain coverage status

| §9 letter | Domain | Coverage from this run |
|---|---|---|
| **§9.V** (Visibility) | every surface can be reached and used | ✓ 5-of-5 surfaces reachable; ⚠ olympus-gpt bundle is stale (templeathena content visible at `/gpt`) |
| **§9.A** (Attribution) | every event attributable to actor × app × cluster × tenant × key | ✗ **FAIL** — 7 active BLOCKERS in §9.A bucket |
| **§9.Q** (Quality) | data integrity per record | partial — schemas hold; attribution gaps fail quality at the record level |
| **§9.F** (Feedback) | feedback loop closes from user to system | not exercised in this run (0 Feedback__c rows) |
| **§9.T** (Tithe) | 7% cosmic-7 royalty attribution | ✗ **FAIL** — `Identity.PrimaryCause__c` field doesn't exist; canon-read would fail closed |
| **§9.R** (Royalty/Disbursement) | ShellsGiven__c per-cause rollup | not exercised |
| **§9.S** (Sovereignty / multi-tenancy) | tenant isolation | not exercised; tenant axis hardcoded to "default" |
| **§9.HM** (Hermes/Messaging audit) | MessageEvent__c per webhook | ✗ object not deployed in alpha-org |

**EOS-5 cannot close §13 until §9.A and §9.T pass.** Both are currently failing.

---

## 2. Test Environment + Provenance

| Component | Value |
|---|---|
| Salesforce alpha-org | `zeus.alpha.1@olympus-grid.com` · `https://olympus-grid-alpha-1.my.salesforce.com` |
| Managed package namespace | `og_node_beta_1` |
| Pantheon clusters | `api-int` (CL-00004, Live, owner=Platform, endpoint `https://api-int.turtleshell.ai`) · `eos-5` (CL-00006, spawned during run, owner=homer, endpoint `https://api-eos-5.turtleshell.ai`) |
| AWS account | 842485730943 (us-east-1) |
| Test user — Identity row | `a1OaZ000006N5JhUAK` (homer@cloudpremise.com) · Sub `9ba1f82f-9621-45fc-bfdc-3356f7157dc9` · AppleUserId `000732.58f4f1222d104be8b9b68cb21e1d4154.0417` · SuperAdmin=true (granted manually 2026-06-27 17:41:33) |
| Platform canonical Identity (preserved by wipe) | `a1OaZ000005iwWrUAI` · Sub `platform-canonical-system-1780335545316` · SuperAdmin=false · system account, JWT issuance intentionally never wired |
| Test methodology | Steward executes UI/CLI actions on each surface; agent runs SOQL queries observing state delta; gaps recorded between expected and actual |
| Test cycle start | 2026-06-27 ~17:30 UTC (post-wipe of homer Identity) |
| Test cycle pause | 2026-06-27 ~19:45 UTC (cluster provisioning bug, deferred to fix loop) |

### Pre-test baseline (post-wipe state)

```
Identity__c            1   Platform canonical only
Application__c         4   iris · guardians · olympus-gpt · turtleshell
Cluster__c             1   api-int (CL-00004) Live
ApplicationProfile__c  0   clean
LedgerEntry__c         0   Plutus clean
Feedback__c            0   clean
Messages__c            0   clean
Logger__c              0   clean
ContentDocument        3   brand assets only (PNG)
```

### End-of-run telemetry counts

```
Identity__c            2   +1 (homer)
Application__c         4   unchanged
ApplicationProfile__c  4   +4 (one per surface for homer)
Cluster__c             2   +1 (eos-5)
LedgerEntry__c       ~585  ~538 heracles fetches (anonymous) · ~20 plutus quota polls · ~7 api.inbound
IdentityToken__c      23   Apple SIWA mints 2 / event · email-link mints 3 / event
Logger__c             12   only Identity.trigger fires (double-fire pattern on email-verify)
Messages__c            0   GAP-09 — auth emails went SF-native EmailMessage rail
EmailMessage          +9   per-app branded waitlist/approved/magic-link
```

---

## 3. Triage Buckets — Summary Table

| # | Title | Bucket | §9 letter | Detected |
|---|---|---|---|---|
| 01 | Tenant primitive missing; `LedgerEntry.TenantId="default"` hardcoded | 🟠 must-close | A · S | 2026-06-15 (canon) · 2026-06-27 (live, architecture locked) |
| 02 | `LedgerEntry__c.Application__c` lookup missing; AppKey must be FK-rooted | 🟠 must-close | A | 2026-06-27 (reframed) |
| 03 | Cluster owner ≠ Platform (pre-deletion) | 🟢 RETIRED | — | resolved on Identity wipe |
| 04 | `MessageEvent__c` not deployed in alpha-org | 🔴 BLOCKER | HM | 2026-06-27 |
| 05 | Email templates inlined as JSON | 🟡 defer | — | 2026-06-27 |
| 06 | TurtleShell surface discriminator missing | 🟡 defer (partial in 39) | A | prior canon |
| 07 | Cluster name mismatch (`int` vs `api-int`) | 🟠 must-close | A | 2026-06-27 |
| 08 | ApplicationProfile junction restructure + JWT `cid` binding + Application__c central authority | 🔴 BLOCKER | A · S | 2026-06-27 (un-retired + promoted) |
| 09 | Auth email uses SF-native EmailMessage rail | 🟠 must-close | HM | 2026-06-27 |
| 10 | `TransactionContext.resolvedIdentity` semantic ambiguity (rename → `actorIdentityId` + `actorApplicationId` as GAP-12 pre-condition) | 🟡 defer | — | 2026-06-27 |
| 11 | Identity trigger double-fires (hard pre-condition for GAP-12 Pattern 1; classify A/B/C + per-phase event_type semantics + emitter dedup invariant) | 🟡 defer | — | 2026-06-27 |
| 12 | Apex emits no LedgerEntries — **Pattern 1** (`LedgerEntryEmitter` + event-type registry + per-phase trigger wiring); closes 13/14/15/16/18 through it | 🔴 BLOCKER · spine | A (+S/Q/F/T/R rollups) | 2026-06-27 |
| 13 | AP `profile.created` + `profile.status.changed` event types + subject-vs-actor disambiguation (closes through GAP-12) | 🔴 BLOCKER | A | 2026-06-27 |
| 14 | AP Logger row missing (precondition for GAP-12 RESOLVED inline — trigger exists; remaining sub-question is non-§9 instrumentation) | 🟡 defer · non-§9 | — | 2026-06-27 |
| 15 | SuperAdmin grant audit (`identity.privilege.granted/revoked` event types + SOC2 CC6.1 payload with sfUserId anchor); closes through GAP-12 | 🔴 BLOCKER · SOC2 CC6.1 | §7 + SOC2 | 2026-06-27 |
| 16 | `LedgerEntry.user_id="anonymous"` on Ares-emitted `api.inbound` (owner: **Ares agent**; olympus-grid contributes schema-readiness only; full close depends on GAP-01/02/08) | 🔴 BLOCKER | A | 2026-06-27 |
| 17 | Last-sign-in / activity tracking — defers; closes by non-action (post-GAP-16 LedgerEntry timeline suffices); denormalize only when UI latency breaches at scale | 🟡 defer · §9.U | U | 2026-06-27 |
| 18 | AP Approved→Active audit — SUBSUMED by GAP-13 §5 activation test; no independent work | 🟢 SUBSUMED | A | 2026-06-27 |
| 19 | Email-link auth bypasses Ares (4-of-4 surfaces) — **PERIMETER BREACH** + attribution gap; multi-repo (iris/turtleshell client refactor + Ares route confirm + Apex `auth.email.*` event_types via Pattern 1) | 🔴 BLOCKER · §3.AR | A + §3.AR | 2026-06-27 |
| 20 | `EmailLastVerified__c` semantics — doc-only field-description update for EOS-5; formula field deferred until a real consumer surfaces; anti-rec against Apple writing this field | 🟡 defer · low (hygiene) | — | 2026-06-27 |
| 21 | ~~Cluster.Application Lookup~~ → REVISED 2026-06-28: no Cluster__c column added; audit closes through Pattern 1's `cluster.requested` LedgerEntry → ApplicationId__c stamp. Creating-app and runtime-app are distinct; cluster is application-agnostic at runtime. | 🟡 closes-through-Pattern-1 (no schema change) | A | 2026-06-27 (revised 2026-06-28) |
| 22 | `Cluster.OwnerIdentity__c` semantic ambiguity — closes by non-action (actor = LedgerEntry.Sub__c on `cluster.requested`; subject = OwnerIdentity); doc-only for EOS-5 | 🟡 defer · doc-only | §7 | 2026-06-27 |
| 23 | Cluster state-history audit — Cluster trigger framework must be CREATED (scaffolding doesn't exist); `cluster.requested` + `cluster.status.changed` event types; GAP-21 invariant test enforces Cluster.Application__c = LedgerEntry.Application__c | 🟠 must-close · scope-creep flagged | A | 2026-06-27 |
| 24 | Cluster provision SendGrid hard-dep + silent failure — decouple at zeus (provisioner refactor); audit half FREE via GAP-23 (no new event_type); anti-rec on `cluster.provision.failed` | 🟠 must-close · multi-repo | A | 2026-06-27 |
| 25 | olympus_gpt bundle has stale templeathena content — iris strip half-done; 4-way pin update (path has ONE Plugin record, not two) | 🟠 must-close · §9.V | V | 2026-06-27 |
| 26 | iris Application filter hardcoded — Apex route `GET /v1/app/admin/applications` already exists; pure iris-side React refactor; anti-rec on auditing the query | 🟠 must-close · §9.V | V (admin) | 2026-06-27 |
| 27 | Per-app admin role — shape LOCKED on GAP-08 junction (`ApplicationProfile.Role__c` picklist); SuperAdmin stays global escape hatch; Pattern 1 hook (`profile.role.changed`) ready | 🟡 defer · §7 | §7 | 2026-06-27 |
| 28 | **`Identity.PrimaryCause__c` missing — Option A locked-in (Identity-level only) by agent rec, Steward to confirm; tithe fails-closed on null cause; `identity.cause.changed` event_type via Pattern 1; divergence-resolution UI on second signup** | 🔴 BLOCKER · §9.T | T | 2026-06-27 |
| 29 | IdentityToken per-signin count is by-design (2 Apple, 3 email, 8 gpt-onboarding-burst); real gap is unbounded accumulation (no cleanup job); EOS-5 doc-only; cleanup job deferred to operational-hygiene cycle | 🟡 defer · hygiene | — | 2026-06-27 |
| 30 | Cosmos-logos handshake asymmetric — client-side only (server already serves uniformly); Steward intent commit needed (mandatory vs opt-in-with-equivalence); offgrid is the non-negotiable mandatory case | 🟡 defer · awaiting Steward | §3 NFR | 2026-06-27 |
| 31 | gpt background polling — NOT a code defect; attestation report-tooling categorizes at query time (EOS agent owns; olympus-grid contribution = none); 3 anti-recs prevent over-engineering | 🟡 defer · EOS-tooling | — | 2026-06-27 |
| 32 | Apple SIWA reliability bounded by Apple (4-mode visibility table; 3 invisible, 1 capturable); EOS-5 = §3 NFR doc; forward = `auth.apple.verify_failed` event_type symmetric with GAP-19 | 🟡 defer · NFR | §3.AP NFR | 2026-06-27 |
| 33 | ProfileData lift-out: `onboardingComplete` → `AP.OnboardingComplete__c` Checkbox first-class; lands with GAP-28; closes GAP-34 through it; per-app residual JSON stays as-is (anti-rec on cross-app validation) | 🟠 must-close (lift-out) · 🟡 defer (residual validation) | §6 | 2026-06-27 |
| 34 | turtleshell-web UI re-prompts onboarding (reads client cache, not server state); iOS already correct; closes through GAP-33's `AP.OnboardingComplete__c` lift-out; anti-rec on pre-fill UI here | 🟠 must-close · UX | — | 2026-06-27 |
| 35 | Double `/api/auth/logout` fire on turtleshell-web email signin — React useEffect / event-handler dup (NOT same as GAP-11 Apex trigger); cosmos-logos/turtleshell-web owns; olympus-grid contribution = none | 🟡 defer · info | — | 2026-06-27 |
| 36 | IdentityToken Apple=2 / email=3 — SUBSUMED by GAP-29 (documented protocol, not a bug; `verification` token is the magic code Apple doesn't need) | 🟢 SUBSUMED | — | 2026-06-27 |
| 37 | Apple SIWA Service ID mismatch (pre-flight) | 🟢 RETIRED | — | did not manifest |
| 38 | iOS skips cosmos-logos handshake — SUBSUMED by GAP-30 (iOS-scoped sub-case); closes via GAP-30's Steward intent commit and multi-repo iOS client work | 🟢 SUBSUMED | §3 NFR | 2026-06-27 |
| 39 | Surface discriminator — shape LOCKED (`LedgerEntry.ClientType__c` Picklist; Ares-stamped via `X-Client-Type` header; Apex defaults `system`); closes GAP-06 through it; 3 anti-recs prevent redesign | 🟡 defer · shape locked | A | 2026-06-27 |
| 40 | heracles content — 3-scenario intent map (A public / B analytics-only / C royalty); mixed catalog expected; Scenario B closes through GAP-16; Scenario C deferred to §9.R; perimeter access via §3.AR | 🟡 defer · intent commit needed | A · T · R | 2026-06-27 |
| 41 | **guardians-iOS auth invisible to Ares (BOTH Apple SIWA + email)** — strictly worse than turtleshell-ios; 7/17 launch spine; closes through GAP-19 (omens Swift native-bridge refactor; olympus-grid contribution = none) | 🔴 BLOCKER · 7/17 spine | A | 2026-06-27 |
| 42 | Cluster Status divorced from reachability — add `Degraded` to picklist + zeus health-check loop + iris badge; audit covered by GAP-23 (`cluster.status.changed`); anti-rec on new event types | 🔴 BLOCKER · multi-repo | A · UX truth | 2026-06-27 |
| 47 | **No Application Owner notification trail on user signup/waitlist** — every signup is invisible to the platform operator; chain `App.OwnerIdentity → Identity.Email` (canonical, deployment-layer forwards `platform@olympus-grid.com` to a live inbox per Steward 2026-06-30); rides Hermes/SendGrid `Messages__c` rail + `notification.appowner.waitlist` LedgerEntry; depends on GAP-09 + GAP-44 + GAP-04 + GAP-12 + GAP-45 | 🔴 BLOCKER · Tier 1 operability | A · HM | 2026-06-30 |

**Bucket counts:** 🔴 BLOCKER = 11 · 🟠 must-close = 10 · 🟡 defer = 20 · 🟢 retired = 2 → **41 active**
*(GAP-01 promoted defer → must-close 2026-06-27. GAP-08 un-retired + promoted retired → BLOCKER 2026-06-27 after Steward architecture reversal: Application__c is the central runtime authority, ApplicationProfile is a junction, JWT is Application-scoped via `cid` claim. GAP-47 added 2026-06-30 after Steward observation that homer's guardians signup generated zero owner-notification — "the noise from the void must be treated with respect and anchor.")*

---

## 4. Gap Inventory — Sequential Detail

### GAP-01 — Tenant primitive missing; `LedgerEntry.TenantId="default"` hardcoded across the stack

- **Severity:** 🟠 must-close (promoted from 🟡 defer 2026-06-27 — the tenant primitive is the foundational data-isolation boundary; deferring past EOS-5 would bake the `"default"` hardcode into every Pattern 1 emit site and force a sweep across hundreds of rows later)
- **§9 letter:** A · S (multi-tenancy)
- **Detected:** 2026-06-15 (canon clarification) · 2026-06-27 (live confirmation) · 2026-06-27 (architecture locked, plan drafted)
- **Owner — olympus-grid agent:** schema + seeds + JWT issuance + Apex emit + SOQL discipline
- **Owner — Ares agent:** JWT verification middleware → `x-tenant-id` header on inbound routing
- **Owner — each god agent** (Athena, Hermes, Apollo, Poseidon, Chronos, Heracles, etc.): consume `x-tenant-id` from inbound HTTP and stamp on every LedgerEntry emit; internal data queries filter by tenant where applicable
- **Owner — frontend clients (iris, turtleshell-web/ios, omens):** optional `tid` claim read for UI binding; required behavior is "don't break when the claim arrives"

**Production use case:** Tenant is the data-isolation security boundary. Every `LedgerEntry__c`, every tenant-scoped SObject row, every backend query is filtered by `tenantId` resolved from the JWT. Defense-in-depth — even with an Apex bug or admin misconfiguration, the query layer pre-filters by tenant before any application logic runs, so cross-tenant data leakage is structurally impossible from a single buggy code path. CloudPremise LLC is the org-owner tenant, pre-seeded as the canonical baseline in both dev scratch and alpha-org. Future state: a single account (e.g., CloudPremise) can own multiple `Tenant__c` rows; the tenant primitive is not entity-specific; eventual migration to Proteus objects for non-Salesforce-resident tenants.

**Empirical evidence:** Every `LedgerEntry__c` row examined in this run carries `tenant_id: "default"` as a hardcoded string in the payload JSON. Example (LE-209961 at 17:33:58):

```json
{
  "event_id": "14f60645-2bcf-46bb-9c83-5913c17d4693",
  "tenant_id": "default",
  "agent_id": "ares",
  "user_id": "anonymous",
  "event_type": "api.inbound",
  "metadata": { "path": "/v1/auth/apple/verify-only" },
  "cluster_name": "int"
}
```

No actual resolution logic exists. The `TenantId__c` column on the SObject is populated with `"default"` literally. No `Tenant__c` SObject exists. No `Identity.Tenant__c` lookup. No `tid` claim in any issued JWT.

**Why this matters:** Without a tenant primitive resolved end-to-end, no per-tenant data filter can exist at the JWT verification layer, no per-tenant billing aggregation, no per-tenant `Application__c` ownership lookup. For the trillion-dollar pipeline, this is the layer that prevents cross-tenant data leakage even when other layers have bugs. It is also the seam at which tenants migrate off Salesforce onto Proteus when that work lands — the slug-based `TenantKey__c` is portable, the SF Id is not.

**Confirmed architecture (Steward 2026-06-27):**

1. `Tenant__c` is the canonical SObject primitive in the olympus-grid managed package. `Identity__c` is a REQUIRED-lookup child of `Tenant__c` (every Identity belongs to exactly one Tenant from inception — no nullable interim state since alpha-org has no critical data to preserve; backfill is trivial). `Identity.Sub__c` remains globally unique across the system; future multi-tenant-Identity is not in EOS-5 scope.
2. JWT issuance includes the tenant slug as a `tid` claim — human-readable (e.g. `"cloudpremise"`), not the SF Id. The slug survives migration off Salesforce; SF Ids don't.
3. Sentinel values for non-user contexts:
   - `"anonymous"` for pre-auth traffic (`/v1/auth/*` endpoints before a JWT exists)
   - `"system"` for Apex-internal calls with no resolvable Identity (Plugin__mdt evaluations, system bootstraps)
4. No data-conversion interim state needed. Field is REQUIRED from inception. Alpha-org wipe + canonical baseline keep this clean.

**Implementation outline — olympus-grid scope (commits, not necessarily separate PRs):**

- `Tenant__c` SObject — folder picked at commit time, either `force-app/applications/default/objects/Tenant__c/` or a new `force-app/tenancy/default/objects/Tenant__c/`
  - autonumber `TEN-{00000}`
  - `TenantKey__c` text, External Id, Unique (the slug, e.g. `"cloudpremise"`)
  - `DisplayName__c` text (e.g. `"CloudPremise LLC"`)
  - `Active__c` checkbox, default true
  - `OwnerIdentity__c` lookup to `Identity__c` (the platform Identity of the entity owning this tenant)
  - `Description__c` long text
  - `<sharingModel>Private</sharingModel>` (tenant boundary at the OWD layer)
- `Tenant__c` custom tab (mirrors the `Olympus-Grid: …` Application__c / Cluster__c / Feedback__c tab pattern, icon `Olympus_Grid/OG_6060`)
- `Olympus_Grid_Admin` permset additions: objectPermissions (full CRUD + viewAll/modifyAll), tabSettings (Visible), FLS for `TenantKey__c` / `DisplayName__c` / `Active__c` / `Description__c` (omit `OwnerIdentity__c` if treated as required at the schema layer per the existing required-field omit rule)
- `Identity__c.Tenant__c` Lookup to `Tenant__c`, REQUIRED
- `LedgerEntry__c.TenantId__c` Text column (stamped both as a queryable column AND inside the payload JSON for redundancy)
- `Cluster__c.TenantId__c` Text column (parity — every cluster belongs to a tenant)
- `Application__c.Tenant__c` Lookup to `Tenant__c` (each Application belongs to a tenant; multi-tenant Apps not in EOS-5 scope)
- All other tenant-scoped SObjects get a `TenantId__c` column in the same deploy: `MessageEvent__c` / `Messages__c` / `Feedback__c` / `Conversation__c` / `Memory__c` / `Task__c` / `TaskList__c` / `DynamicObject__c` / `ProfileRelationship__c` / `ApplicationProfile__c` / `IdentityToken__c` / `IdentityKey__c`
- `dev-org-data-seed.apex` + `alpha-org-data-seed.apex`: seed canonical `Tenant__c[TenantKey='cloudpremise', DisplayName='CloudPremise LLC']` row owned by the platform Identity; backfill all existing Identity + Application + Cluster + other tenant-scoped rows to point at this Tenant before the REQUIRED flag flips on Identity (or just create with it required from inception since there's no data to preserve)
- `dev-org-data-wipe.apex` + `alpha-org-full-wipe.apex`: Tenant__c added to carve-out set (preserves `cloudpremise` Tenant alongside `platform@olympus-grid.com` Identity + `api-int` Cluster)
- JWT issuance path (`JwtUtil` + `ApiRouteAuth` + any Apple-SIWA verify path): read `Identity.Tenant__r.TenantKey__c`, include as `tid` claim
- `ApiContext` (the resolved-request-context primitive): expose `resolvedTenantKey` for every Apex handler to read
- `LedgerEntryEmitter` helper (lands with Pattern 1 — see GAP-12): auto-stamps `TenantId__c` from `ApiContext.resolvedTenantKey` on every emit; sentinels (`"anonymous"`, `"system"`) for null contexts where structurally unavoidable
- SOQL discipline in `ApiHandler.AbstractApiHandler`: code-review convention requires every tenant-scoped read to inject `WHERE Tenant__c = :resolvedTenantKey`. Possibly a `Soql`-class wrapper that fails-closed if a route reads from a tenant-scoped object without the filter

**Implementation outline — handoff packaging to other agents:**

- **Ares** (consumer of JWT, edge enforcement): middleware extracts `tid` from validated JWT → sets `x-tenant-id` HTTP header on the proxied request. Each `api.inbound` LedgerEntry emit stamps `TenantId__c` column + payload from the header. Pre-auth requests emit `TenantId__c="anonymous"`.
- **Each god** (Athena, Hermes, Apollo, Poseidon, Chronos, Heracles, etc.): reads `x-tenant-id` from inbound request → stamps on every LedgerEntry emit. Internal data queries filter by tenant where applicable.
- **Frontend clients (iris, turtleshell-web/ios, omens):** optional — read `tid` from the JWT for any UI binding (future tenant-switcher, "you're signed in as X to tenant Y" indicators). Required behavior for EOS-5 acceptance: don't break when the claim arrives.

**Acceptance criteria — binary, testable:**

1. `Tenant__c` SObject deployed to alpha-org. `SELECT COUNT() FROM og_node_beta_1__Tenant__c` returns ≥ 1.
2. Custom tab `Olympus-Grid: Tenant` visible to System Administrator profile + `Olympus_Grid_Admin` permset.
3. Seeded canonical row exists: `SELECT TenantKey__c, DisplayName__c FROM og_node_beta_1__Tenant__c WHERE TenantKey__c = 'cloudpremise'` returns one row with DisplayName=`"CloudPremise LLC"` in both dev scratch and alpha-org.
4. `Identity__c.Tenant__c` is REQUIRED. Apex `insert new Identity__c(...)` without `Tenant__c` set fails with a `REQUIRED_FIELD_MISSING` error.
5. Every existing Identity row has `Tenant__c` populated post-seed backfill. `SELECT COUNT() FROM og_node_beta_1__Identity__c WHERE Tenant__c = null` returns 0.
6. JWT issued from any auth flow (email-link OR Apple SIWA) contains a `tid` claim matching the authenticated user's `Identity.Tenant__r.TenantKey__c` value.
7. Frontend clients (iris, turtleshell-web at minimum) decode `tid` from the JWT without error and tolerate its presence.
8. Ares' inbound middleware extracts `tid` from the validated JWT and sets the `x-tenant-id` HTTP header on the proxied request. Curl probe with a valid JWT against any god endpoint shows the header arriving at the god.
9. Every `LedgerEntry__c` row written by Ares or any god during a sample window of live traffic carries `TenantId__c` matching the request's resolved tenant (NOT the literal string `"default"`). For unauthenticated requests, `TenantId__c="anonymous"`.
10. Every Apex-emitted `LedgerEntry__c` row (post-Pattern-1) carries `TenantId__c` from `ApiContext.resolvedTenantKey`. Sentinels (`"anonymous"`, `"system"`) populate where structurally unavoidable.
11. **Cross-tenant data leak test (the load-bearing one):** spawn a second `Tenant__c[TenantKey='test-tenant-b']` row + a second Identity scoped to it + an ApplicationProfile + a Conversation under that Identity. Sign in as homer (cloudpremise tenant). Make a request that returns ApplicationProfile / Conversation / LedgerEntry data via an API route. Verify the response contains **zero** rows belonging to the `test-tenant-b` Identity, even though raw unfiltered SOQL would return them. The query-layer pre-filter on `WHERE Tenant__c = :resolvedTenantKey` is what this criterion proves.
12. SOQL audit: `SELECT COUNT() FROM og_node_beta_1__LedgerEntry__c WHERE TenantId__c = 'default' AND CreatedDate >= LAST_N_DAYS:7` returns 0 over a 7-day window post-rollout. (Confirms the legacy hardcode is fully retired.)

**Closure dependencies on other gaps:**

- GAP-02 (`LedgerEntry.AppKey__c` missing): same schema deploy slot. Land together.
- GAP-12 (`LedgerEntryEmitter` helper): consumes `resolvedTenantKey` from `ApiContext`. The emitter design must include the tenant stamp.
- GAP-21 (`Cluster.AppKey__c` missing): parity with `Cluster.TenantId__c`. Same schema deploy slot.

**Steward feedback:** _(initial architecture confirmed 2026-06-27 — slug in JWT, "anonymous" + "system" sentinels, REQUIRED from inception, no interim nullable state, no data-conversion intermediate. Implementation not yet started.)_

---

### GAP-02 — `LedgerEntry__c.Application__c` lookup missing; AppKey discipline must be FK-rooted, not text-only

- **Severity:** 🟠 must-close
- **§9 letter:** A
- **Detected:** 2026-06-27 (reframed 2026-06-27 after Steward architecture correction — see GAP-08)
- **Owner — olympus-grid agent:** schema (`LedgerEntry__c.Application__c` Lookup + derived `AppKey__c` formula) + Apex emit via `ApiContext`
- **Owner — Ares agent:** resolve issuing `Application__c` on every inbound request (from JWT `cid` claim post-auth, from request body `clientId` / `x-app-key` header pre-auth); stamp on `api.inbound` LedgerEntry
- **Owner — each god agent:** read resolved Application identifier from `x-app-key` HTTP header → stamp on every emit
- **Owner — frontend clients:** send `x-app-key` HTTP header (or rely on the JWT-bound `cid` claim post-auth)

**Production use case:** UC-1 sign-up — the `POST /v1/auth/apple/verify-only` request initiated by the iris portal must be attributable to the iris `Application__c` row at the Plutus ledger level, so per-application revenue / consumption / impact reporting can roll up to the correct `Application__c.OwnerIdentity__c` (the tithe payer).

**Empirical evidence:** LE-209961 (the only signup-related Ares-side LedgerEntry):

```json
{
  "agent_id": "ares",
  "event_type": "api.inbound",
  "metadata": {
    "method": "POST",
    "path": "/v1/auth/apple/verify-only",
    "service_to_service": false,
    "source_service": null,
    "request_bytes": 877
  }
}
```

No `application_id` field. No `app_key` field. Payload metadata has the path string but no application name. The row cannot be joined to `Application__c` by any means other than text-parse on the path.

**Why this matters:** Tithe attribution rolls up per-`Application__c.OwnerIdentity__c`. Per memory `project_olympus_grid_is_tithe_funded_not_take_rate.md`: *"7% lives on Application Owner's metered platform-feature consumption (shells), NOT on end-user payments."* Without `Application__c` on every LedgerEntry, the rollup cannot run.

**Confirmed architecture (Steward 2026-06-27 — sets the pattern across GAP-02 / GAP-08 / GAP-21):**

`Application__c` is a high-level runtime authority — parallel to `Tenant__c`. Tenant-application-scoped objects carry `Application__c` Lookup as the canonical foreign key. `AppKey__c` becomes a derived formula (`Application__r.AppKey__c`) on those objects, read-only. The Lookup is the source of truth; the formula gives ergonomic text access without denormalization.

**Implementation outline — olympus-grid scope:**

- `LedgerEntry__c.Application__c` Lookup to `Application__c` (REQUIRED — same no-nullable-interim discipline as `Identity.Tenant__c`; no LedgerEntry can ever exist without an Application stamp once GAP-08 lands)
- `LedgerEntry__c.AppKey__c` Formula text reading `Application__r.AppKey__c` (for filter / GROUP BY ergonomics without forcing a join in every query)
- `LedgerEntryEmitter` helper (Pattern 1 — see GAP-12) auto-resolves `Application__c` Id from `ApiContext.resolvedApplicationId` and stamps every emit
- Sentinel values (when `ApiContext` cannot resolve an Application):
  - **No sentinel rows allowed on LedgerEntry** because `Application__c` is REQUIRED. Apex emit sites that can't resolve an Application must route through a `Application__c[AppKey='system']` row (seeded by the data-seed script alongside the existing 4 user-facing Apps)
  - System Application row in seed: `Application__c[AppKey='system', Name='Olympus-Grid System', Active=false]` — Active=false so it doesn't appear in user-facing pickers; serves only as the FK target for system/anonymous events
  - Anonymous pre-auth: same row OR separate `Application__c[AppKey='anonymous', Active=false]` row (recommend separate so anonymous traffic is filterable from system events)
- `Olympus_Grid_Admin` permset: FLS for `Application__c` lookup (Lookup fields don't need FLS but the formula `AppKey__c` does)

**Implementation outline — handoff packaging:**

- **Ares**: resolution priority on every inbound request:
  1. **Post-auth**: `cid` claim from validated JWT → SOQL `Application__c WHERE ClientId__c = :cid LIMIT 1` → Application Id
  2. **Pre-auth**: `x-app-key` HTTP header → SOQL `Application__c WHERE AppKey__c = :header LIMIT 1` → Application Id
  3. **Pre-auth fallback**: `clientId` field in request body (legacy email-link flows) → same SOQL on `ClientId__c`
  4. Failure: stamp `Application__c[AppKey='anonymous']` Id and emit a warning log line `app_resolution_failed` for the dashboard
- **Each god**: read `x-app-key` from inbound HTTP (set by Ares from the resolution) → resolve to Application Id once at request-handler entry → reuse for every LedgerEntry emit during the request
- **Frontend clients**: send `x-app-key` HTTP header on every authenticated request (mandatory in client SDK going forward); body-`clientId` allowed during migration but deprecated

**Acceptance criteria — binary, testable:**

1. `LedgerEntry__c.Application__c` Lookup deployed to alpha-org. SOQL `SELECT Application__c FROM og_node_beta_1__LedgerEntry__c LIMIT 1` succeeds.
2. `LedgerEntry__c.AppKey__c` Formula text deployed, derives `Application__r.AppKey__c`. `SELECT AppKey__c, Application__c FROM og_node_beta_1__LedgerEntry__c LIMIT 1` returns a row with both populated.
3. `Application__c.ClientId__c` Text (External Id, Unique) field exists, populated on all 4 canonical app rows in alpha-org.
4. System + anonymous sentinel Application rows seeded: `SELECT AppKey__c FROM og_node_beta_1__Application__c WHERE AppKey__c IN ('system', 'anonymous')` returns 2 rows.
5. Ares emits `Application__c` on every `api.inbound` LedgerEntry, resolved per the priority chain above. No row over a 7-day window has null Application (post-rollout).
6. Apex-emitted LedgerEntry (post-Pattern-1) carries `Application__c` from `ApiContext.resolvedApplicationId`. Apex system-context emits use the `system` sentinel row.
7. SOQL `SELECT AppKey__c, COUNT(Id) FROM og_node_beta_1__LedgerEntry__c GROUP BY AppKey__c` returns non-empty per-app counts for at least 24h of live traffic, with the 4 user-facing app rows visible (iris / guardians / olympus-gpt / turtleshell) and `system`/`anonymous` only when expected.
8. **Cross-application attribution test**: signed-in homer on iris fires an `api.inbound` event. The resulting LedgerEntry has `Application__c` resolving to the iris row, NOT to the turtleshell row, even though homer has an ApplicationProfile on both apps. Proof: JWT `cid` claim correctly scopes the request to its issuing Application.

**Closure dependencies:**

- **GAP-08** (ApplicationProfile junction restructure) — prerequisite. `Application__c` Lookups on child objects are only meaningful once ApplicationProfile is properly junctioned and the JWT `cid` claim is wired.
- **GAP-01** (Tenant primitive) — parallel schema deploy; `Tenant__c` + `Application__c` stamps land in the same SObject-schema slot.
- **GAP-12** (`LedgerEntryEmitter`) — consumes `resolvedApplicationId` from `ApiContext`.
- **GAP-21** (`Cluster__c.Application__c` lookup) — same pattern applied to Cluster__c.

**Steward feedback:** _(architecture confirmed 2026-06-27 — Application__c is the central runtime authority, AppKey derived from FK; no separate text column. Implementation not yet started.)_

---

### GAP-03 — Cluster owner ≠ Platform (resolved via manual reassignment + new seed-script enforcement) — RETIRED

- **Severity:** 🟢 RETIRED
- **Detected:** 2026-06-27 pre-test
- **Resolution:** field was force-updated manually 2026-06-27 (homer's Id → platform's Id), then codified into the new `scripts/alpha-org-data-seed.apex` which idempotently asserts `api-int.OwnerIdentity = platform Identity` on every seed run. The wipe script's carve-out preserves the row across wipes; the seed asserts ownership remains canonical.

**Production use case:** Pre-test, `Cluster__c.OwnerIdentity__c` on the api-int row pointed at homer's pre-deletion Identity row. Per memory canon api-int should be Platform-owned (system, no JWT issuance).

**Empirical evidence:** Before homer wipe, query returned `OwnerIdentity__c = "a1OaZ000005ixSvUAI"` (homer's then-current Id). After manual reassignment 2026-06-27 via `sf data update record` (during the alpha-org canonicalization pass), query returned `OwnerIdentity__c = "a1OaZ000005iwWrUAI"` (Platform). The `alpha-org-data-seed.apex` script added the same session encodes this as the canonical idempotent post-condition.

**Acceptance criteria:** None — retired. The seed script is the durable mechanism preventing drift; no hidden trigger exists.

**Steward feedback:** _(reserved)_

---

### GAP-04 — `MessageEvent__c` SObject not deployed in alpha-org

- **Severity:** 🔴 BLOCKER
- **§9 letter:** HM (Hermes/Messaging audit chain)
- **Detected:** 2026-06-27
- **Owner — olympus-grid agent:** schema (SObject + fields + tab + permset) — *largely done on eos-5b 2026-06-27, see Implementation status*
- **Owner — Hermes agent:** SendGrid webhook receiver endpoint + ECDSA signature verification + write `MessageEvent__c` child rows per event

**Production use case:** Per memory `project_hermes_sendgrid_eos_5_nfr_contract.md`, the EOS-5 §3.HM contract specifies an outbound→status webhook chain: `Messages__c` (outbound queue row) → SendGrid send → ECDSA-signed webhook back → `MessageEvent__c` child row stamping `processed` / `delivered` / `open` / `bounce` events with three join keys (HermesId on the parent, Messages__c.Id, ProviderMessageId on the child) all traceable end-to-end.

**Empirical evidence:**

```
sf data query "SELECT COUNT() FROM og_node_beta_1__MessageEvent__c" --target-org alpha-org
ERROR: sObject type 'og_node_beta_1__MessageEvent__c' is not supported
```

Object not present in the alpha-org's deployed managed-package version, even though the contract memory was written 2026-06-15/16. Same query for siblings (`Cycle__c`) confirms the object isn't there — not a permission or namespace issue, it just doesn't exist.

**Why this matters:** Every outbound email in this test cycle went through the SF-native `EmailMessage` rail (see GAP-09) because there's no MessageEvent__c on the alpha-org for the SendGrid lane to write status events into. Without it, the entire §9.HM webhook audit chain cannot be exercised in production.

**Implementation status (olympus-grid side, 2026-06-27):**

- ✅ `MessageEvent__c` SObject restored from history (commit `52dfccbe` — was reverted out of PR #292's scope during the messaging-gateway deferral; brought back on eos-5b)
- ✅ `<sharingModel>ControlledByParent</sharingModel>` added to the metadata (was missing in the original — caused the original deploy to fail; fixed on eos-5b)
- ✅ Custom tab `Olympus-Grid: Message Event` created (`force-app/bus/bus-api/tabs/MessageEvent__c.tab-meta.xml`)
- ✅ `Olympus_Grid_Admin` permset updated: objectPermissions + tabSettings + FLS for non-required fields (`ProviderMessageId__c`, `RawPayload__c`)
- ✅ Deployed successfully to dev_enterprise scratch 2026-06-27
- ⏳ Pending: add `WebhookSignatureVerified__c` Checkbox field (see acceptance criterion 2)
- ⏳ Pending: `Tenant__c` + `Application__c` traversal as Formula fields via the M-D parent (depends on GAP-01 + GAP-08 landing on `Messages__c` first; formula derives `Message__r.Tenant__c` / `Message__r.Application__c`)
- ⏳ Pending: eos-5b commit → cycle PR → brain merge → next beta managed-package release → install on alpha-org
- ⏳ Pending: Hermes-side webhook handler writes MessageEvent rows on inbound events (Hermes-scope, not olympus-grid)

**Actual restored fields (vs original GAP-04 doc which used speculative names):**

| Field | Type | Required | Acceptance-criteria reconciliation |
|---|---|---|---|
| `Message__c` | Master-Detail to Messages__c | true (M-D) | the parent lookup |
| `Type__c` | Picklist | true | acceptance doc earlier called this `EventType__c` — actual is `Type__c` |
| `OccurredAt__c` | DateTime | true | acceptance doc earlier called this `Timestamp__c` — actual is `OccurredAt__c` |
| `ProviderMessageId__c` | Text | false | acceptance doc earlier called this `SendGridMessageId__c` — actual is `ProviderMessageId__c` (provider-agnostic — survives a SendGrid swap) |
| `RawPayload__c` | LongTextArea | false | raw webhook payload archive |
| `WebhookSignatureVerified__c` | Checkbox | — | **NOT YET PRESENT — add** |

**Acceptance criteria — binary, testable:**

1. `MessageEvent__c` SObject deployed to alpha-org. SOQL `SELECT COUNT() FROM og_node_beta_1__MessageEvent__c` returns 0 or N (not error).
2. Required EOS-5 §3.HM fields present on the SObject:
   - `Message__c` Master-Detail to `Messages__c` (parent link, cascades on delete, inherits sharing) ✓ restored
   - `Type__c` Picklist with values: `processed`, `delivered`, `open`, `click`, `bounce`, `spam_report`, `unsubscribe`, `dropped` ✓ restored (verify picklist values match)
   - `OccurredAt__c` DateTime ✓ restored
   - `ProviderMessageId__c` Text (provider's message ID; SendGrid today) ✓ restored
   - `RawPayload__c` LongTextArea (full webhook payload archive) ✓ restored
   - `WebhookSignatureVerified__c` Checkbox (true if ECDSA signature verified at receive time; false if signature missing or invalid) ⏳ **must add**
3. Hermes/SendGrid webhook endpoint (`POST /v1/hermes/messaging/webhooks/sendgrid` or similar) writes `MessageEvent__c` rows on event arrival, with `WebhookSignatureVerified__c` reflecting the ECDSA verification result.
4. At least one round-trip (outbound `Messages__c` → SendGrid → inbound webhook → `MessageEvent__c` child) verified end-to-end in alpha-org telemetry.
5. The three join keys all resolvable bidirectionally:
   - `Messages__c.HermesId__c` (existing External Id) on the parent
   - `Messages__c.Id` (SF Id) on the parent
   - `MessageEvent__c.ProviderMessageId__c` on the child
   SOQL traverse from parent to children: `SELECT Id, (SELECT Type__c, OccurredAt__c FROM Events__r) FROM Messages__c WHERE HermesId__c = :id` returns the parent + all child events.
6. **Application + Tenant inheritance verified:** After GAP-01 + GAP-08 land `Tenant__c` + `Application__c` on `Messages__c`, MessageEvent__c queries surface those values via formula fields (`Message__r.Tenant__c.TenantKey__c`, `Message__r.Application__r.AppKey__c`). Cross-tenant + cross-app data leakage is structurally impossible because M-D inherits OWD from the parent.

**Closure dependencies:**

- **GAP-08** (ApplicationProfile junction + Application__c central authority) — MessageEvent's `Application__c` access is a formula field on the M-D parent; depends on `Messages__c.Application__c` landing first.
- **GAP-01** (Tenant primitive) — same pattern for `Tenant__c`.
- **GAP-09** (Auth emails on SF-native EmailMessage rail) — Hermes-side fix that routes auth emails through `Messages__c`-based flow makes this gap's webhook chain testable. Without auth emails on the Hermes lane, MessageEvent has no production traffic to validate against.

**Steward feedback:** _(olympus-grid schema work largely complete on eos-5b uncommitted; one field add + 2 formula fields pending. Hermes-side webhook handler is separate handoff.)_

---

### GAP-05 — Email templates inlined as JSON in `Application.EmailTemplates__c`

- **Severity:** 🟡 defer (acceptable until A/B template-rev needs surface)
- **§9 letter:** —
- **Detected:** 2026-06-27
- **Suggested owner:** olympus-grid (template storage refactor — future cycle)

**Production use case:** Per-app email template branding. Each `Application__c` row carries an `EmailTemplates__c` Long Text field holding a single JSON blob with four templates: `waitlist`, `approved`, `welcome`, `magicLink`, each with `subject`, `plainTextBody`, `htmlBody`.

**Empirical evidence:** Direct query of `Application__c.EmailTemplates__c` returns a 6KB+ JSON blob per row. Example for `olympus-gpt`:

```json
{
  "welcome": { "subject":"olympus-gpt.ai · welcome to the console", "htmlBody":"<div>...500+ chars...</div>", "plainTextBody":"..." },
  "approved": { "subject":"olympus-gpt.ai · your console is open", ... },
  "waitlist": { "subject":"olympus-gpt.ai · you're on the early-access list", ... },
  "magicLink": { "subject":"olympus-gpt.ai · your sign-in code", "htmlBody":"...{code}..." }
}
```

This works empirically (the run produced 9 per-app-branded EmailMessage rows, all correct subjects).

**Why this matters:** Acceptable for current scope. The JSON-on-SObject pattern is **consistent with `Plugin__mdt.Configuration__c`** (which also stores config as JSON in a single text field) — the architectural precedent is intentional. Becomes friction if:

- A/B testing templates per surface (no template versioning today)
- Per-environment template overrides (dev vs prod want different copy; e.g. dev should never look indistinguishable from real customer mail)
- Granular permissioning ("template editor can change copy but not Application config")

**Forward consideration (multi-tenancy, post-GAP-01):** when `Tenant__c` lands, email templates may need to become tenant-scoped — CloudPremise's tenant could have one set of templates; a future commissioned tenant could have different per-app templates. Worth noting now so the eventual `EmailTemplate__c` SObject is designed with `Tenant__c` lookup from inception (not retrofitted later).

**Acceptance criteria for this attestation:** None — defer. (Future cycle: dedicated `EmailTemplate__c` SObject with versioning, per-environment override capability, tenant-scoped lookup matching the GAP-01 hierarchy.)

**Steward feedback:** _(defer confirmed 2026-06-27 — olympus-grid agent agrees, JSON-on-SObject is intentional precedent matching `Plugin__mdt.Configuration__c`. Reframe to `EmailTemplate__c` SObject deferred to a post-EOS-5 cycle.)_

---

### GAP-06 — TurtleShell web/ios/offgrid surface discriminator missing (partial answer in GAP-39)

- **Severity:** 🟡 defer (URL path is de-facto discriminator today; first-class `Surface__c` field deferred to GAP-39)
- **§9 letter:** A (per-surface analytics)
- **Detected:** pre-test (canon memory `project_omens_repo_equals_guardians_appkey.md`)
- **Suggested owner:** olympus-grid schema OR analytics pipeline parses path

**Production use case:** turtleshell-web + turtleshell-ios + turtleshell-offgrid share `AppKey='turtleshell'`. Distinguishing per-platform usage (web vs ios vs offgrid) for analytics needs another axis.

**Empirical evidence:** AP-00092 has `AppKey='turtleshell'` and `ClientId__c='turtleshell-web'` — even though both turtleshell-web AND turtleshell-ios signups landed on this AP. The ClientId reflects the originating client of the AP at creation time, not the current accessing platform.

The de-facto discriminator IS in the URL path of LedgerEntry payloads: `/v1/grid/master/app/profile/turtleshell-ios/me` carries `turtleshell-ios` in the path. So per-platform analytics is *possible* via path string-parse, just not via a first-class field.

**Why this matters:** Reporting on "how many DAU on iOS vs web" requires path-string parsing rather than a clean GROUP BY. Operations friction.

**Interaction with GAP-08 (Application__c restructure) — needs Steward decision before GAP-39 implements:**

GAP-08 places `ClientId__c` on `Application__c` (one per row). After the 2026-06-27 turtleshell-web + turtleshell-ios consolidation, there is ONE Application row with AppKey='turtleshell'. Two ways the surface dimension can live:

1. **`x-client-surface` HTTP header** at signin (no schema change) — each frontend hardcodes its surface (`web`/`ios`/`offgrid`/`android`). Backend captures it on AP at creation as a separate column. JWT carries `surface` claim alongside `cid`. Surface flows through to LedgerEntry stamping (GAP-39's first-class `Surface__c` field). **Simplest interim path; no junction needed.**
2. **`ApplicationClient__c` junction** — each Application has multiple child rows, each `(Application, ClientId, Surface)`. Frontend hardcodes its surface's ClientId. Backend resolves ClientId → Application + Surface. Schema-richer but adds an SObject.

Option 1 is the cleaner interim. Option 2 becomes attractive only if surface-specific access controls or surface-specific credential rotation become real requirements — neither is on the EOS-5 critical path.

**Acceptance criteria for this attestation:** None — defer. GAP-39 resolution (first-class `Surface__c` or `ClientType__c` on LedgerEntry, populated from `x-client-surface` header / JWT claim) addresses this. Analytics tooling does path-parse in the interim.

**Steward feedback:** _(defer confirmed 2026-06-27. Surface dimension recommendation: Option 1 — `x-client-surface` header + JWT claim, no junction. Pending Steward signal if Option 2 ever becomes warranted.)_

---

### GAP-07 — Cluster name mismatch (`int` vs `api-int`)

- **Severity:** 🟠 must-close
- **§9 letter:** A
- **Detected:** 2026-06-27
- **Owner — olympus-grid agent:** Cluster__c canonical row (`api-int` is already correct in seed scripts), eventual Apex emit of `Cluster__c` Lookup via Pattern 1
- **Owner — Ares agent:** stop emitting `"int"`; emit the canonical long form `"api-int"` (better: resolve from Cluster__c row by EndpointUrl match at startup, no hardcoded string)

**Production use case:** Joining `LedgerEntry__c` rows to `Cluster__c` for per-cluster reporting requires a stable join key. Currently the join is by name string; the names don't match.

**Empirical evidence:**

| Source | Value |
|---|---|
| `LedgerEntry__c.ClusterName__c` (Ares emit) | `"int"` |
| `Cluster__c.ClusterName__c` (canonical row, set by `alpha-org-data-seed.apex` + `dev-org-data-seed.apex`) | `"api-int"` |

SOQL `SELECT Id FROM og_node_beta_1__LedgerEntry__c WHERE ClusterName__c IN (SELECT ClusterName__c FROM og_node_beta_1__Cluster__c)` returns zero rows for the entire run.

**Why this matters:** Per-cluster cost rollups, per-cluster billing, per-cluster admin reports — all require the join. Currently the join is broken silently.

**Canonical decision:** `"api-int"` is the canonical long form. Rationale:

1. `Cluster__c.EndpointUrl__c = "https://api-int.turtleshell.ai"` — the URL already uses the long form
2. Both seed scripts (`alpha-org-data-seed.apex` + `dev-org-data-seed.apex`) seed `ClusterName__c = "api-int"` — multiple call sites already agree on this form
3. The DNS / customer-visible URL is what humans see in admin UIs; using a different shortened internal alias breaks intuition
4. Future clusters use long forms too (`eos-5`, etc.) — consistency

Ares is the side that changes. The shortest fix: change the Ares-side string constant from `"int"` to `"api-int"`. The cleanest fix: Ares looks up the active Cluster__c row by EndpointUrl match at startup and uses `Cluster__c.ClusterName__c` as the source of truth — no hardcoded string at all.

**Long-term path (parallel to GAP-08 / GAP-02 discipline):**

The proper data model is `LedgerEntry__c.Cluster__c` Lookup (FK to `Cluster__c`) with `ClusterName__c` as a derived Formula text reading `Cluster__r.ClusterName__c`. Same pattern as Application__c (GAP-02) and Tenant__c (GAP-01). When Pattern 1 (`LedgerEntryEmitter`, GAP-12) lands, the helper resolves the active cluster and stamps the Lookup. Ares emits stamp the Lookup too via Cluster Id from its `Cluster__c` lookup-by-EndpointUrl at startup.

In that end state, the string `"int"` vs `"api-int"` mismatch becomes architecturally impossible — there's one Cluster Id and the slug is derived. For EOS-5 acceptance, the immediate fix (Ares string update) closes this gap; the FK promotion lands with Pattern 1 / GAP-21 schema work.

**Acceptance criteria — binary, testable:**

1. Ares stops emitting `"int"`. Either by string-constant update OR (preferred) by resolving Cluster__c at startup via `EndpointUrl__c` match.
2. SOQL `SELECT ClusterName__c, COUNT(Id) FROM og_node_beta_1__LedgerEntry__c WHERE CreatedDate >= LAST_N_DAYS:1 GROUP BY ClusterName__c` returns rows where every `ClusterName__c` value matches a row in `Cluster__c.ClusterName__c` over a 24h sample window. Zero rows with `ClusterName__c = "int"` post-rollout.
3. The eos-5 cluster (when operational, GAP-42 closed): LedgerEntry emits with `ClusterName__c = "eos-5"` matching `Cluster__c.ClusterName__c = "eos-5"`.
4. (Long-term, lands with Pattern 1 / GAP-21 schema): `LedgerEntry__c.Cluster__c` Lookup populated, `ClusterName__c` becomes a Formula text derived from `Cluster__r.ClusterName__c`. The mismatch class becomes architecturally impossible.

**Closure dependencies:**

- **GAP-21** (`Cluster__c.Application__c` lookup) — same schema deploy slot; recommend bundling the `LedgerEntry__c.Cluster__c` Lookup addition into the same migration so the FK-rooted discipline lands once, not piecemeal.
- **GAP-12** (`LedgerEntryEmitter`) — when the helper lands, it consumes a resolved Cluster Id rather than a string.

**Steward feedback:** _(reserved — recommend `"api-int"` as canonical; Ares-side string update is the immediate must-close; FK promotion lands with Pattern 1.)_

---

### GAP-08 — ApplicationProfile must be a true junction object; Application__c is the central runtime authority; JWT must be Application-scoped via `cid` claim

- **Severity:** 🔴 BLOCKER (un-retired + promoted 2026-06-27 — Steward architecture reversal; foundational for every Application-scoped record and the entire cross-application JWT-isolation contract)
- **§9 letter:** A (foundational) · S (cross-application leakage prevention)
- **Detected:** 2026-06-27 (reframed from earlier retirement)
- **Owner — olympus-grid agent:** ApplicationProfile schema restructure + `Application__c.ClientId__c` + JWT issuance + ApiContext resolution + tenant-application-scoped object lookups
- **Owner — Ares agent:** JWT verification reads `cid` claim → resolves Application → propagates `x-app-key` header (parallel to `x-tenant-id` from GAP-01)
- **Owner — each god agent:** consume `x-app-key` from inbound HTTP and stamp on every LedgerEntry emit
- **Owner — frontend clients:** send their hardcoded `ClientId__c` value during signin; tolerate `cid` claim in JWT

**Production use case:** A JWT issued via the iris portal for homer should NOT confer capability on the turtleshell-web portal for the same homer Identity. Cross-application JWT use is a security boundary, parallel to cross-tenant. The `Application__c` row is the central authority for a service on olympus-grid — every JWT is bound to the issuing Application via the ApplicationProfile junction, and every Application-scoped record carries an `Application__c` Lookup so query-layer pre-filtering blocks cross-application data leakage.

**Earlier (RETIRED) framing — now reversed:**

Initial observation: `ApplicationProfile__c.AppKey__c` is text-only, no `Application__c` lookup. Considered a referential-integrity gap. Earlier Steward direction confirmed by-design: *"there is a data link to the application record but it is not a foreign key in the database... i wonder if it would include the application__c itself but the current design keeps there from being duplicates i'm pretty sure"*. Retired on the argument that composite text-key dedup was sufficient.

**Steward correction 2026-06-27 — un-retired:**

*"the Appliation__c object is not being used. … Application__c should be the central authority for a service on olympus-grid. the app key should live at THAT layer, not the jwt. each jwt is valid at the appliationId from which it was issued, so that a jwt from one appliation (turtleshell-web, for example) does not necessarily claim cabability to the same identity on a different app. … when we sign into an application, the application client id from the application (hardcoded when it requests the login) should validate against the ApplicationProfile__c (as it does today) but that Application__c whould be an actual master detail on the ApplicationProfile__c making it a true jucctoin object with the Identity__c. when the jwt is issued the ApplicationProfile__r.Application__c.AppKey__c is what should be used to tag each record in the resulting logs and tables etc."*

The retired argument (text-key dedup sufficient) addressed the wrong concern. The actual requirement is **runtime authority**: `Application__c` is the high-level attribute parallel to `Tenant__c`, not just a config-metadata pointer.

**Empirical evidence:** Current schema state on alpha-org:

```
og_node_beta_1__ApplicationProfile__c:
    AppKey__c        Text          (used for dedup + manual joins)
    Identity__c      Lookup        (NOT Master-Detail)
    ClientId__c      Text          (per-AP, not normalized to Application__c)
    (no Application__c relationship of any kind)

og_node_beta_1__Application__c:
    AppKey__c        Text (External Id, Unique)
    (no ClientId__c — clients hardcode per-app values but there's no canonical row to validate against)
```

JWTs issued today carry `sub` (Identity), no Application binding. A JWT from turtleshell-web for homer is structurally identical to a JWT from iris for homer — the per-app security boundary doesn't exist at the JWT layer.

**Why this matters:** The 5-tuple attribution model (Tenant · Application · Identity sub · Cluster · ApiKey) collapses to a 4-tuple without proper Application binding. Cross-application data leakage is possible whenever an Apex route doesn't manually filter by AppKey. With proper junction + JWT scoping, the query layer enforces the boundary automatically.

**Confirmed architecture (Steward 2026-06-27):**

1. **`ApplicationProfile__c` becomes a true junction object.** Master-Detail to BOTH `Application__c` AND `Identity__c`. Both REQUIRED via M-D. Uniqueness is enforced by the M-D pair (each AP unique per Identity × Application). The existing text `AppKey__c` field becomes a derived formula (`Application__r.AppKey__c`) or is dropped entirely in favor of FK traversal.
2. **`Application__c.ClientId__c`** Text (External Id, Unique) field added. Each frontend hardcodes its ClientId. Signin flow validates `ClientId__c` → resolves to `Application__c.Id` → links the new (or existing) AP under that Application.
3. **JWT issuance binds to the issuing Application.** On signin via AP-X (which links to Application-A), JWT claims include `cid` (the Application's `ClientId__c` value, OR alternatively `aid` = AppKey slug — either works as long as it's a stable identifier resolvable to Application Id).
4. **JWT verification at Ares** extracts `cid` → resolves to Application Id → sets `x-app-key` HTTP header (carrying the AppKey slug for downstream services) for the proxied request. Parallel pattern to `x-tenant-id` from GAP-01.
5. **Hierarchy of record scoping** (confirmed by Steward):
   - **universal** — no Tenant, no Application
   - **tenant-specific** — `Tenant__c` only
   - **tenant-application-specific** — `Tenant__c` + `Application__c`
   - **tenant-application-user-specific** — `Tenant__c` + `Application__c` + `Identity__c`
6. **Sentinel Application rows** (mirroring GAP-01's tenant sentinels): seed `Application__c[AppKey='system', Active=false]` and `Application__c[AppKey='anonymous', Active=false]` for events where no real Application resolves. Active=false keeps them out of user-facing pickers.

**Implementation outline — olympus-grid scope:**

- `ApplicationProfile__c.Identity__c` field type change: Lookup → Master-Detail (REQUIRED via M-D)
- `ApplicationProfile__c.Application__c` field type change: NEW Master-Detail to `Application__c` (REQUIRED via M-D)
- `ApplicationProfile__c.AppKey__c` either removed OR converted to Formula text (`Application__r.AppKey__c`) — recommend formula for query-time convenience
- `ApplicationProfile__c.ClientId__c` either removed OR converted to Formula text (`Application__r.ClientId__c`) — same reasoning
- `ApplicationProfile__c.IdentityApplicationKey__c` (the existing text external-id dedup key) can be removed; M-D pair enforces uniqueness structurally
- `Application__c.ClientId__c` Text field added (External Id, Unique). Backfill all 4 canonical app rows with distinct ClientId values (e.g. `iris-portal-prod`, `turtleshell-web-prod`, `olympus-gpt-prod`, `guardians-ios-prod`).
- Seed scripts (`dev-org-data-seed.apex` + `alpha-org-data-seed.apex`):
  - Add `ClientId__c` to each seeded Application__c row
  - Add 2 sentinel Application__c rows: `system` and `anonymous` (both Active=false)
- JWT issuance (`JwtUtil` + `ApiRouteAuth`): read AP's `Application__r.ClientId__c` → include as `cid` claim. Both email-link + Apple SIWA paths.
- `ApiContext.resolvedApplicationId` and `ApiContext.resolvedApplicationClientId` exposed for Apex handlers
- All Apex routes that take a client-supplied `clientId` (e.g. `/v1/auth/email/link/request` body) must validate it against `Application__c.ClientId__c` before resolving the AP
- Every tenant-application-scoped SObject gets an `Application__c` Lookup (REQUIRED): `LedgerEntry__c` (GAP-02), `Cluster__c` (GAP-21), `MessageEvent__c` / `Messages__c` / `Feedback__c` / `Conversation__c` / `Memory__c` / `Task__c` / `TaskList__c` / `DynamicObject__c` / `IdentityToken__c` / `IdentityKey__c`
- `ApiHandler.AbstractApiHandler`: code-review convention to auto-inject `WHERE Application__c = :resolvedApplicationId` on every tenant-application-scoped read (parallel to the tenant filter from GAP-01)

**Implementation outline — handoff packaging:**

- **Ares**: JWT verification middleware extracts `cid` from validated JWT → resolves Application via cached SOQL (`SELECT Id, AppKey__c FROM Application__c WHERE ClientId__c = :cid LIMIT 1`) → sets `x-app-key` HTTP header on proxied request (parallel pattern to `x-tenant-id`). Pre-auth flows resolve via `clientId` in request body OR `x-app-key` header.
- **Each god**: reads `x-app-key` from inbound HTTP → stamps `Application__c` Lookup on every LedgerEntry emit (resolved via cached lookup of AppKey slug → Application Id).
- **Frontend clients**: send hardcoded `ClientId` in signin body (existing); long-term, send `x-app-key` HTTP header on every authenticated request. JWT consumers tolerate `cid` claim arriving.

**Acceptance criteria — binary, testable:**

1. `ApplicationProfile__c.Identity__c` field type is **Master-Detail** to `Identity__c`. Apex `insert new ApplicationProfile__c(...)` without `Identity__c` fails with M-D-required error.
2. `ApplicationProfile__c.Application__c` field type is **Master-Detail** to `Application__c`. Same insert failure when omitted.
3. ApplicationProfile uniqueness enforced by the M-D pair: attempting to insert two APs for the same (Identity, Application) fails with `DUPLICATE_VALUE` or equivalent (relies on M-D + Unique constraint composite).
4. `Application__c.ClientId__c` Text field exists, External Id, Unique. All 4 user-facing canonical rows have distinct populated values; the 2 sentinel rows (`system`, `anonymous`) have null or sentinel ClientIds.
5. Seeded sentinel rows present in both dev scratch + alpha-org: `SELECT AppKey__c FROM og_node_beta_1__Application__c WHERE Active__c = false ORDER BY AppKey__c` returns `anonymous` + `system`.
6. JWT issued from any auth flow contains a `cid` claim matching the issuing AP's `Application__r.ClientId__c`. Verified by decoding a sample JWT.
7. **Cross-application JWT isolation test (load-bearing):** sign in to iris as homer (JWT-1, `cid=iris-portal-prod`). Sign in to turtleshell-web as homer (JWT-2, `cid=turtleshell-web-prod`). Use JWT-1 to call a turtleshell-scoped endpoint that requires Application scope match → request is rejected (401 or 403) because JWT-1's `cid` doesn't match the requested Application. Use JWT-2 for the same call → succeeds.
8. **Cross-application data leakage test:** create a Conversation__c row scoped to homer×turtleshell. Sign in as homer with JWT-1 (`cid=iris-portal-prod`). Hit a `/v1/conversations/me` route. Response contains ZERO rows belonging to homer×turtleshell, even though raw SOQL would return them. The query-layer pre-filter on `WHERE Application__c = :resolvedApplicationId` is what this criterion proves.
9. Ares' inbound middleware extracts `cid` → resolves Application → sets `x-app-key` HTTP header on the proxied request. Curl probe shows header arriving at the god.
10. Every `LedgerEntry__c` row written by Ares or any god during a sample window carries `Application__c` resolving to the request's issuing Application (NOT null, NOT a hardcoded value, NOT the wrong Application).

**Closure dependencies — GAP-08 is upstream of:**

- GAP-02 (`LedgerEntry__c.Application__c` lookup) — only meaningful once AP is properly junctioned and JWT carries `cid`
- GAP-21 (`Cluster__c.Application__c` lookup) — same pattern
- GAP-12 (`LedgerEntryEmitter`) — consumes `resolvedApplicationId` from `ApiContext`

**Steward feedback:** _(reversal confirmed 2026-06-27 — earlier retirement was based on the wrong question. Application__c is the central runtime authority, ApplicationProfile is the junction, JWT is Application-scoped via `cid`. Implementation not yet started.)_

---

### GAP-09 — Auth-flow outbound emails ride SF-native `EmailMessage` rail (not Hermes/SendGrid `Messages__c`)

- **Severity:** 🟠 must-close
- **§9 letter:** HM
- **Detected:** 2026-06-27
- **Owner — olympus-grid agent:** restore `MessagingGateway` + `MessagingGatewayJob` + `Plugin.messaging.md-meta.xml` + `Messages__c.ProviderMessageId__c` + `ApiRouteHermesMessages` SELECT fix from history (commit `52dfccbe`); rewrite `ApiRouteAuth` to enqueue via the gateway; update the regressing test; stamp Tenant + Application on every Messages__c row at emit time
- **Owner — Zeus agent:** per-cluster SendGrid SSM keys (`SENDGRID_API_KEY`, `WEBHOOK_VERIFICATION_KEY`, `FROM_EMAIL`, `FROM_NAME`) deployed per environment; alpha-org's are seeded; future-cluster provisioning needs sentinel-or-real values (see GAP-24)
- **Owner — Hermes agent:** SendGrid webhook receiver endpoint (this is the inbound half — closes the §3.HM round trip alongside GAP-04)

**Production use case:** Every email in the auth flow (waitlist, approved, magicLink) — emitted by Apex `TurtleshellProfileTrgHnd` or equivalent at AP state transitions and email-link request.

**Empirical evidence:** All 9 EmailMessages in the run landed in standard `EmailMessage` (511 historical rows pre-existed; 9 added this run). Zero `Messages__c` rows over the entire run despite 5 magic-link emails fired:

```
EmailMessage rows in run:
  18:33:58  "Olympus-Grid Admin · access request received"
  17:44:13  "Olympus-Grid Admin · your access is ready"
  17:52:10  "Olympus-Grid Admin · your sign-in code"
  18:19:35  "olympus-gpt.ai · you're on the early-access list"
  18:23:47  "olympus-gpt.ai · your console is open"
  18:25:06  "olympus-gpt.ai · your sign-in code"
  18:30:13  "TurtleShell.ai · you're on the waitlist"
  18:36:49  "TurtleShell.ai · welcome to the Ocean"
  18:46:44  "TurtleShell.ai · your sign-in code"
  18:53:35  "TurtleShell.ai · your sign-in code"
  19:37:20  "Guardians of Olympus · the threshold is not yet open"
  19:37:59  "Guardians of Olympus · the threshold opens"
  19:39:20  "Guardians of Olympus · your sign-in code"

Messages__c rows: 0
```

**Why this matters:** §3.HM contract says SendGrid is the dual-lane outbound provider; switchable via `Plugin.messaging.Configuration__c.default_provider`. The auth path apparently doesn't go through `MessagingGateway` — it calls SF's native email API directly. This skips the `Messages__c` queue, skips the per-cluster SendGrid SSM keys, skips the webhook-event audit chain (GAP-04), skips the three-key traceability.

**Implementation status (this session):**

All the gateway plumbing was BUILT in commit `52dfccbe` during the EOS-5 cycle work, then **REVERTED out of PR #292** at scope-trim time (the messaging gateway was deferred because Poseidon-side webhook wasn't merged + the unit test regression below). The code lives in the per-thought branch history at `5e32bd77` / `52dfccbe`. Restoration is straightforward — same pattern as GAP-04's MessageEvent revival.

Files to restore from history:
- `force-app/bus/bus-api/classes/MessagingGateway.cls` + meta
- `force-app/bus/bus-api/classes/MessagingGatewayJob.cls` + meta (Queueable + AllowsCallouts; defers callouts past DML)
- `force-app/bus/bus-api/customMetadata/Plugin.messaging.md-meta.xml` (`Configuration__c` JSON: `default_provider`, `hermes.url`, `secure_serviceSecret`)
- `force-app/bus/bus-api/objects/Messages__c/fields/ProviderMessageId__c.field-meta.xml`
- `force-app/bus/bus-api/objects/Messages__c/fields/Status__c.field-meta.xml` (picklist extension for status taxonomy)
- `force-app/idp/idp-api/default/classes/ApiRouteAuth.cls` — magic-link + waitlist email helpers rewritten to enqueue `MessagingGatewayJob` instead of synchronous `Messaging.sendEmail`
- `force-app/bus/bus-api/classes/ApiRouteHermesMessages.cls` — the SELECT fix from `b06ec46a`

**Known test regression to fix during restoration:**

`ApiRouteAuthTest.testEmailLinkRequest_WaitlistEmailFiresOncePerProfile` (`force-app/idp/idp-api/default/classes/ApiRouteAuthTest.cls`) currently asserts `Limits.getEmailInvocations()` in-context. With the gateway routing, the email send happens inside the Queueable's later transaction — `Limits.getEmailInvocations()` measured in the original context returns 0. The test fails closed even though the system is working correctly.

Fix: pivot the assertion to `[SELECT COUNT() FROM Messages__c WHERE Body__c LIKE '%waitlist-spam-check%']` post-`Test.stopTest()` (which flushes the Queueable). The canonical post-cycle proof is "did the queue row land", not "did Limits-counter tick" — the latter was a sync-send artifact.

**GAP-08 / GAP-01 stamping requirement (folds into the restoration):**

Every `Messages__c` row written by the gateway must carry:
- `Tenant__c` Lookup (REQUIRED per GAP-01) — resolved from the requesting Identity's `Tenant__c`
- `Application__c` Lookup (REQUIRED per GAP-08) — resolved from the issuing AP's `Application__c` (the auth flow's clientId mapping)

Without these, `Messages__c` becomes the audit chain's own attribution gap — the messaging rail must follow the same 5-tuple discipline as `LedgerEntry__c`.

**Acceptance criteria — binary, testable:**

1. `MessagingGateway` + `MessagingGatewayJob` + `Plugin.messaging.md-meta.xml` + `Messages__c.ProviderMessageId__c` restored from history to eos-5b cycle branch and deployed to alpha-org.
2. `ApiRouteAuth` magic-link + waitlist email helpers route through `MessagingGatewayJob.enqueue(...)` — no remaining `Messaging.sendEmail` calls in those code paths.
3. `Messages__c` row written per auth email; `Plugin.messaging.Configuration__c.default_provider="sendgrid"` honored.
4. Every `Messages__c` row carries `Tenant__c` + `Application__c` per GAP-01 / GAP-08 discipline. `SELECT COUNT() FROM Messages__c WHERE Tenant__c = null OR Application__c = null AND CreatedDate >= LAST_N_DAYS:1` returns 0.
5. Per-cluster SendGrid SSM keys (`SENDGRID_API_KEY`, `WEBHOOK_VERIFICATION_KEY`, `FROM_EMAIL`, `FROM_NAME`) seeded in alpha-org's namespace, consumed at send time. (Zeus-scope but verifiable from olympus-grid: `Plugin.messaging.Configuration__c` reads these via env-substituted references.)
6. `ApiRouteAuthTest.testEmailLinkRequest_WaitlistEmailFiresOncePerProfile` updated to assert on `[SELECT COUNT() FROM Messages__c ...]` post-`Test.stopTest()`. Test passes green on dev_enterprise scratch.
7. On a representative live signup (email-link → magic-link sent → user verifies), the chain materializes end-to-end: `Messages__c` row with `default_provider="sendgrid"`, then `MessageEvent__c` child rows (depends on GAP-04 close + Hermes webhook receiver) for `processed` / `delivered` / `open`.
8. SF-native `EmailMessage` rail still functional as a fallback (per dual-lane design); switching `Plugin.messaging.Configuration__c.default_provider` to `salesforce` routes auth emails through the legacy path without regression.

**Closure dependencies:**

- **GAP-01** (Tenant primitive) — `Messages__c.Tenant__c` stamping requires the field to exist
- **GAP-08** (Application junction + `cid` claim) — `Messages__c.Application__c` stamping requires the field + the auth flow's resolved Application Id
- **GAP-04** (MessageEvent__c + ECDSA-verified webhook) — closes the inbound half of the §3.HM contract; without it, only the outbound `Messages__c` half is testable
- **GAP-24** (cluster provisioning hard-depends on SendGrid SSM) — for future-cluster spawning to work cleanly, the SSM seeding pattern must either be optional or come with sentinel defaults

**Steward feedback:** _(restoration path is well-understood — the messaging gateway code is in commit history, the test fix is a 1-line pivot, the GAP-08 stamping wires in cleanly when ApplicationProfile is junctioned. Implementation not yet started.)_

---

### GAP-10 — `TransactionContext.resolvedIdentity=null` despite Identity created in same transaction

- **Severity:** 🟡 defer · suspect (with a forward-pointer to GAP-12)
- **§9 letter:** —
- **Detected:** 2026-06-27
- **Owner — olympus-grid agent:** Apex Logger / `TransactionContext` wiring + semantic clarification of what `resolvedIdentity` means

**Production use case:** First-time iris signup at 17:33:58. Apex Identity.trigger fires (twice, see GAP-11) and writes to Logger__c with full TransactionContext serialized. The new Identity row was created in this same transaction — TransactionContext should reflect it.

**Empirical evidence:** Logger row at 17:34:00:

```json
{
  "xUserJwtToken": null,
  "userContext": {
    "userType": "Guest",
    "userName": "iris@olympus-grid.com",
    "userId": "005fn0000007wnFAAQ",
    "organizationId": "00Dfn000001FhAXEA0"
  },
  "transactionId": "74e0f8ee-82cc-4c55-8991-ada391dbfa67",
  "rolledBackApiResponse": null,
  "resolvedIdentity": null,
  "isSavePointNeeded": true,
  "isAsync": false,
  "customPermission": "Olympus_Grid_Least_Privilege",
  "args": null
}
```

`resolvedIdentity: null` even though `Identity__c.a1OaZ000006N5JhUAK` (homer) was inserted in the same transaction.

**Why this matters:** If any downstream consumer of TransactionContext relies on `resolvedIdentity` for attribution decisions (e.g., audit row writes, cross-trigger cross-reference), they'll receive null and either skip the attribution or write incorrect data. Currently no consumer is empirically visible.

**Olympus-grid agent triage (2026-06-27)**

The field `TransactionContext.resolvedIdentity` is **semantically ambiguous as currently named** and the Logger evidence cannot be diagnosed without resolving that ambiguity first. Two valid readings exist:

| Reading | Meaning | Signup transaction value |
|---|---|---|
| **Actor** | The JWT-authenticated Identity making the request | `null` (pre-auth signup is anonymous to the JWT validator) |
| **Subject** | The Identity row being created or modified (`Trigger.newMap` row) | Post-insert: the new Identity Id |

The Logger row shows `userContext.userType: "Guest"` — confirming the request hit Apex as the Site Guest user, no JWT. Under the **actor** reading, `resolvedIdentity: null` is **correct**: there is no authenticated identity yet at this exact moment in the transaction.

Under the **subject** reading, `resolvedIdentity: null` is a **bug** IF the Logger row was written in the after-insert phase (the Identity Id exists; subject is resolvable). Whether it was written pre- or post-insert depends on which trigger phase serialized `TransactionContext`, which we cannot determine without reading the trigger.

**Why this stays defer for EOS-5:**
1. No downstream consumer today reads `resolvedIdentity` to make an attribution decision (empirically verifiable; grep before closure).
2. Pattern 1 (`LedgerEntryEmitter`, GAP-12) has NOT landed yet. The lock-in risk this gap warns about is purely forward-looking.
3. The rename/split required to remove the ambiguity is small (5–10 lines in `TransactionContext` + sites) but cosmetically scattered; it pollutes EOS-5 diff scope without unblocking any §9 acceptance criterion.

**Forward direction (NOT for EOS-5, blocking pre-condition for GAP-12 Pattern 1 closure):**

Rename and split `TransactionContext.resolvedIdentity` into two explicit fields with §9.A-aligned semantics:

- **`actorIdentityId`** — the canonical `sub` for §9.A attribution. Resolved from the JWT before trigger fire. For pre-auth signup, it becomes the new Identity Id in the after-insert phase (the user IS the Identity that was just created — they're authoring their own row).
- **`subjectIdentityId`** _(optional, only if a real consumer emerges)_ — the row being affected, when distinct from the actor (e.g., admin updating another user's profile). Defaults to `actorIdentityId`. Do NOT add until a real consumer exists; speculative pre-design.

When GAP-08's Application-scoping work lands, add a parallel **`actorApplicationId`** (resolved from JWT `cid` claim) so the LedgerEntryEmitter has both `sub` AND Application available without re-querying.

**Pattern 1 must not depend on the legacy field.** Per GAP-12 closure: `LedgerEntryEmitter.emit(...)` accepts explicit `actorIdentityId` + `actorApplicationId` params, OR reads them from a `TransactionContext` whose semantics are unambiguous. Never read `resolvedIdentity` directly during EOS-5.

**Refined acceptance criteria (binary):**
1. [defer] Grep `force-app/` for `resolvedIdentity` usages outside the Logger serialization path → ZERO consumers reading it for attribution. Add a code-comment on `TransactionContext.resolvedIdentity` warning callers about the ambiguity until the rename lands.
2. [forward] `LedgerEntryEmitter` API (GAP-12) accepts `actorIdentityId` as an EXPLICIT param, not via `resolvedIdentity` lookup.
3. [forward, GAP-08 follow-on] `TransactionContext` exposes `actorApplicationId` resolved from JWT `cid`; old `resolvedIdentity` field deprecated with a runtime warning when read.

**Closure dependency:** none for EOS-5 defer. Reopens as a hard pre-condition the moment GAP-12 Pattern 1 work begins.

**Steward feedback:** _(reserved)_

---

### GAP-11 — Identity trigger double-fires on Apple SIWA / email-verify (CLASSIFIED 2026-06-28)

- **Severity:** 🟡 defer · info — now CLASSIFIED ROOT CAUSE A · BENIGN
- **§9 letter:** —
- **Detected:** 2026-06-27 · Classified 2026-06-28 (Sprint 4.2)
- **Owner — olympus-grid agent:** classification complete; Pattern 1 wiring spec for `IdentityTrgHnd` documented in code-comment + this entry

#### Classification (Sprint 4.2, 2026-06-28)

**Root Cause A — INSERT + UPDATE in same tx — BENIGN.** Confirmed by full code inspection of `force-app/idp/default/classes/IdentityTrgHnd.cls` (59 lines):

- Handler overrides ONLY `onBeforeInsert` + `onBeforeUpdate`. **No after-phase code.**
- Only in-memory `sobj.put()` mutations during before-phases (Sub__c default; autoFillNameFromEmail). **No `update` DML inside the handler.**
- Root Cause C (recursive `update identityRow`) **ruled out** by code inspection.
- Root Cause B (workflow / orderable re-fire) **ruled out** — handler doesn't write fields that trigger workflows; no orderable-class registrations.

The double-fire is the **Apple-SIWA upsert pattern**: `AppleIdentityResolver.findOrCreateFromClaims(...)` INSERTs a new Identity (trigger fires lifecycle 1), then `ApiRouteAuth.handleAppleSiwa` UPDATEs `EmailLastVerified__c = now` on the same row (trigger fires lifecycle 2). **Two semantically distinct DML operations on the same row in one transaction.**

Permanent classification record landed as a code-comment at the top of `IdentityTrgHnd.cls` so future agents reading the trigger see the rationale.

#### Implication for Pattern 1 (Sprint 5 / GAP-12)

- `onAfterInsert` → emit `IDENTITY_CREATED`
- `onAfterUpdate` with field-change guards → emit:
  - `IDENTITY_EMAIL_VERIFIED` when `OLD.EmailLastVerified__c == null && NEW.EmailLastVerified__c != null`
  - `IDENTITY_PRIVILEGE_GRANTED` / `IDENTITY_PRIVILEGE_REVOKED` when `OLD.SuperAdmin__c != NEW.SuperAdmin__c`
  - etc. per the GAP-12 event-type registry
- The 2 trigger fires produce **2 semantically distinct LedgerEntry events** (`identity.created` + `identity.email_verified`) — NOT duplicates.
- `LedgerEntryEmitter` dedup invariant on `(transactionId, eventType, targetSObjectId)` is belt-and-suspenders — not strictly required for THIS trigger, but worthwhile protection against unknown future C-class bugs in other triggers.

**Production use case:** Any Identity create or update that causes EmailLastVerified or AppleUserId mutation. Pattern observed 6 times in run.

**Empirical evidence:** Logger query for the iris signup transaction `74e0f8ee-82cc-4c55-8991-ada391dbfa67`:

```
17:34:00  INFO  tx=74e0f8ee  Identity.trigger Completed Successfully
17:34:00  INFO  tx=74e0f8ee  Identity.trigger Completed Successfully
```

Two rows, same transaction ID, same exact log message, same timestamp. Pattern repeats for:
- gpt email-verify (tx `98dcbb72` at 17:54:37)
- turtleshell-web email-verify (tx `fe53d94c` at 18:46:58)
- turtleshell-ios email-verify (tx `936aaac5` at 18:54:00)
- guardians-iOS email-verify (tx untracked, +2 Logger rows at 19:39:41 expected)

**Why this matters:** Three possible root causes, only one is benign — the current "likely INSERT + UPDATE" framing is a guess, not a finding. Logger rows say only "Completed Successfully" so telemetry cannot distinguish:

| Cause | Mechanism | Verdict |
|---|---|---|
| **A. INSERT + UPDATE in same tx** | Apple-SIWA upsert pattern: find-or-create by AppleUserId, then write `EmailLastVerified` in a separate DML inside the same tx | Benign — two semantically distinct events (`identity.created` + `identity.email_verified`) |
| **B. Trigger orderable re-fire** | A workflow / process / flow field-update re-fires the trigger after its own DML | Mostly benign; emission must be phase-aware to avoid stamping the wrong event_type |
| **C. Recursive `update identityRow` inside after-insert handler** | Handler mutates its own row → re-fires AFTER UPDATE on the same logical event | **Bug.** Produces duplicate LedgerEntries for one user-visible event once GAP-12 lands. |

**Olympus-grid agent triage (2026-06-27)**

This stays defer for EOS-5 attestation because GAP-12 hasn't landed yet — no LedgerEntries are being emitted today, so duplication has zero §9 consequence in the current production state. The moment GAP-12 Pattern 1 starts emitting per-trigger-fire, this becomes a hard correctness issue.

**Hard pre-conditions for GAP-12 closure (the EOS-5+1 cycle that lands Pattern 1):**

1. **Classify the root cause as A, B, or C with code citation.** Read `IdentityTrgHnd` (or whichever class binds the Identity trigger) and the call chain emanating from after-insert. The classification must be empirical, not inferred.
2. **If A or B (benign):** every `LedgerEntryEmitter.emit(...)` call from the Identity trigger must encode the **semantic event type per phase** — `identity.created` on after-insert; `identity.email_verified` on after-update guarded by `OLD.EmailLastVerified == null && NEW.EmailLastVerified != null`; `identity.apple_linked` on after-update guarded by AppleUserId field-change; etc. Two trigger fires becomes two semantically distinct LedgerEntries, NOT duplicates.
3. **If C (bug):** fix the recursive mutation. Use a static `Set<Id> alreadyProcessed` guard inside the trigger handler before issuing DML on `Trigger.new` rows. Prefer single-pass write-through.
4. **Belt-and-suspenders dedup at the emitter layer:** `LedgerEntryEmitter.emit(...)` enforces a dedup invariant keyed on `(transactionId, event_type, target_sobject_id)`. Second emit with the same key is silently dropped. This protects even C-class bugs from corrupting Plutus rollups.

**Refined acceptance criteria (binary):**
1. [defer for EOS-5] No LedgerEntry emissions exist yet, so the double-fire has no observable §9 consequence in this cycle.
2. [forward — GAP-12 pre-condition] Root cause classified A / B / C with the relevant trigger-handler class + line cited; "likely" is not acceptable.
3. [forward — GAP-12 pre-condition] Per-phase event_type wiring such that two trigger fires produce either (a) two SEMANTICALLY DIFFERENT event_types, or (b) one event + one suppressed (dedup-key collision) — never an identical duplicate.
4. [forward — GAP-12 design contract] `LedgerEntryEmitter.emit(...)` enforces dedup on `(transactionId, event_type, target_sobject_id)` as a runtime invariant; an attempt to emit a duplicate row logs a Warn but does not insert a second LedgerEntry.

**Closure dependency:** none for EOS-5 (deferred). Hard pre-condition for GAP-12 Pattern 1 — cannot close GAP-12 without GAP-11 root cause classified and event_type semantics resolved.

**Steward feedback:** _(reserved)_

---

### GAP-12 — Apex emits no LedgerEntries (entire SF-side chain invisible to Plutus) — Pattern 1 lands here

- **Severity:** 🔴 BLOCKER · the spine of EOS-5 attestation
- **§9 letter:** A (with rollups into S · Q · F · T · R for downstream event types)
- **Detected:** 2026-06-27
- **Owner — olympus-grid agent:** `LedgerEntryEmitter` class + event-type registry + per-trigger emission wiring
- **Closes through this gap (SF-side only):** GAP-13 (AP status transitions), GAP-14 (Logger row on AP trigger — already resolved inline), GAP-15 (SuperAdmin audit), GAP-18 (AP Approved→Active audit). These are not separate work; they are the specific event_types registered + the triggers extended in this gap. **NOT closed through this gap:** GAP-16 (user_id=anonymous on Ares-emitted `api.inbound` rows) — that lives in Ares middleware code paths separate from Apex `TransactionContext`; tracked under the Ares agent's scope.

**Production use case:** Every Apex-handled state transition in the full lifecycle: Identity creation, ApplicationProfile creation, AP AccountStatus transitions (Waitlist → Approved → Active), SuperAdmin grant, Cluster spawn, Cluster Status transitions (Pending → Provisioning → Live → Failed).

**Empirical evidence:** Of the entire homer × {iris, gpt, turtleshell-web, turtleshell-ios, guardians} sign-up chain (8 signins, 4 AP creations, 3 AP approvals, 1 SuperAdmin grant, 1 cluster spawn, multiple cluster transitions):

```
LedgerEntry__c rows from Apex side:  0
LedgerEntry__c rows from Ares side:  3 (api.inbound on /v1/auth/apple/verify-only for iris-Apple-signup, iris-Apple-signin, turtleshell-web-Apple-signup) plus ~538 heracles content fetches and ~20 quota polls
```

Only Ares emits. SF-side actions are completely invisible to Plutus. EmailMessages were sent (so Apex DID fire), and Logger rows for Identity.trigger were written (so triggers DID run) — but no LedgerEntry rows from any Apex handler.

**Why this matters:** §9.A "every action attributable" requires every state transition produce an auditable event. Currently we have:
- 4 AP creations (Waitlist) → 0 ledger events
- 3 AP approvals (Waitlist → Approved) → 0 ledger events
- 4 AP activations (Approved → Active on first signin) → 0 ledger events
- 1 SuperAdmin grant → 0 ledger events (also see GAP-15)
- 1 cluster spawn → 0 ledger events
- 4 cluster state transitions (Pending → Provisioning → Live → Provisioning(bug) → ?) → 0 ledger events

The Apex side is silent. Auditors cannot reconstruct who-did-what-when from Plutus alone.

**Olympus-grid agent triage (2026-06-27)**

GAP-12 is the spine of EOS-5. Every prior architectural decision flows through here as a precondition. The current acceptance criteria capture the WHAT correctly; what's missing is the architectural contract that lets a code-reviewer verify "this trigger emits the right event with the right attribution" without re-deriving from scratch each time. Pattern 1 = the named pattern.

#### Pattern 1 contract — the emitter API surface

```apex
LedgerEntryEmitter.emit(
    String eventType,            // 'identity.created', 'profile.status.changed', …
    Id targetSObjectId,          // the row this event is about
    Map<String, Object> payload  // event-specific facts (oldStatus, newStatus, reason, …)
);
```

The emitter auto-stamps the **5-tuple** from `TransactionContext` — callers never pass attribution params, callers never reason about attribution:

| LedgerEntry field | Source | Notes |
|---|---|---|
| `Tenant__c` (lookup) | `TransactionContext.tenantId` — JWT `tid` claim OR `Identity.Tenant__c` on the actor | GAP-01 precondition; null only on pre-tenant bootstrap |
| `Application__c` (lookup) | `TransactionContext.actorApplicationId` — JWT `cid` claim | GAP-08 precondition; null only on pre-auth signup |
| `Identity__c` + `Sub__c` | `TransactionContext.actorIdentityId` — explicit-param fallback for triggers that authored the actor in the same tx | GAP-10 precondition |
| `Cluster__c` (lookup) | `TransactionContext.clusterId` — request routing context or `ApplicationProfile.Cluster__c` | Null until the request is cluster-scoped |
| `ApiKey__c` (lookup) | `TransactionContext.apiKeyId` — set only on API-key-auth | Null on JWT-auth |

#### Pattern 1 contract — dedup invariant (from GAP-11)

The emitter enforces a runtime invariant: **same `(transactionId, eventType, targetSObjectId)` → second call is a no-op + Warn log, never a second insert.** Implementation: a static `Set<String>` scoped per Apex transaction. This protects even C-class trigger bugs from poisoning Plutus rollups.

#### Pattern 1 contract — event_type registry

Event types live in a **single canonical Apex enum OR `LedgerEventType__mdt` Custom Metadata Type** — NOT scattered string literals in trigger handlers. Each registered event_type declares:
- canonical name (`identity.created`)
- target SObject API name (`Identity__c`)
- payload schema declaration (JSON-schema or doc-only at first)
- §9 letter mapping (most → A; some → S/Q/F/T/R)

Registry is the ONLY place new event types can be added — code-review can verify "every state transition has a corresponding event_type before the trigger ships."

#### Triggers declare which event_type they emit per phase

Per GAP-11 per-phase wiring, each trigger handler is declarative:

```apex
// IdentityTrgHnd — illustrative
override void emitLedgerEntries() {
    if (Trigger.isAfter && Trigger.isInsert) {
        LedgerEntryEmitter.emit(EventType.IDENTITY_CREATED, row.Id, new Map<String, Object>{});
    }
    if (Trigger.isAfter && Trigger.isUpdate) {
        if (oldRow.EmailLastVerified__c == null && newRow.EmailLastVerified__c != null) {
            LedgerEntryEmitter.emit(EventType.IDENTITY_EMAIL_VERIFIED, row.Id,
                new Map<String, Object>{ 'verifiedAt' => newRow.EmailLastVerified__c });
        }
        if (oldRow.SuperAdmin__c != newRow.SuperAdmin__c) {
            LedgerEntryEmitter.emit(EventType.IDENTITY_PRIVILEGE_GRANTED, row.Id,
                new Map<String, Object>{ 'old' => oldRow.SuperAdmin__c, 'new' => newRow.SuperAdmin__c });
        }
    }
}
```

This pattern repeats verbatim for `ApplicationProfileTrgHnd`, `ClusterTrgHnd`. The trigger handler is purely declarative about WHICH event_type maps to WHICH phase+field-change; attribution stamping is the emitter's job.

#### Closure dependencies (must land in order)

1. **GAP-01** — Tenant primitive exists so `TransactionContext.tenantId` resolves.
2. **GAP-02** — `LedgerEntry__c.Application__c` lookup field deployed.
3. **GAP-08** — JWT `cid` claim + `ApplicationProfile__c` junction + `TransactionContext.actorApplicationId` resolved.
4. **GAP-10** — `TransactionContext.actorIdentityId` semantics locked (replaces ambiguous `resolvedIdentity`).
5. **GAP-11** — Double-fire root cause classified (A/B/C with code citation); per-phase event_type wiring decided.

#### Refined acceptance criteria (binary)

1. **`LedgerEntryEmitter` class lands** under `force-app/core/` with the contract above. Unit-tested: a single `emit()` call inserts exactly one `LedgerEntry__c` row with full 5-tuple stamped from `TransactionContext`.
2. **Dedup invariant verified** by unit test: `emit()` × 2 with same `(transactionId, eventType, targetSObjectId)` → exactly one row + one Warn log.
3. **Event-type registry exists** (Apex enum OR `LedgerEventType__mdt`). Every event_type any trigger emits is declared in the registry. No string-literal event types in handler code.
4. **Triggers extended** on `Identity__c`, `ApplicationProfile__c`, `Cluster__c` with per-phase + per-field-change event_type wiring per the GAP-11 contract.
5. **Specific event types observed end-to-end** in the EOS-5 attestation run:
   - `identity.created` on Identity insert
   - `identity.email_verified` on `EmailLastVerified__c` null→not-null transition
   - `identity.privilege.granted` on `SuperAdmin__c` field change (closes GAP-15)
   - `profile.created` on `ApplicationProfile__c` insert with initial status in payload
   - `profile.status.changed` on `ApplicationProfile.AccountStatus__c` update with `old`/`new` in payload (closes GAP-13 and GAP-18)
   - `cluster.requested` on `Cluster__c` insert
   - `cluster.status.changed` on `Cluster.Status__c` update with `old`/`new` in payload
6. **Full 5-tuple verification**: for the EOS-5 attestation run (homer × {iris, gpt, turtleshell-web, turtleshell-ios, guardians} signup chain), every emitted `LedgerEntry__c` row has `Tenant__c`, `Application__c`, `Identity__c`/`Sub__c`, `Cluster__c` (where applicable), `ApiKey__c` (where applicable) populated. The only acceptable null is `Identity__c`/`Sub__c` on a pre-auth signup event, and only if the actor cannot exist at that exact phase of the trigger.
7. **End-to-end attestation test**: in alpha-org, drive a full signup → approval → activation → spawn-cluster chain for one new user. Expected row count: N transitions = N LedgerEntries. Verified by `[SELECT EventType__c, COUNT(Id) FROM LedgerEntry__c WHERE Identity__c = :testId GROUP BY EventType__c]` matching the GAP-12 §5 event-type table exactly.
8. **SF-side anonymous-post-auth scoped**: once `TransactionContext.actorIdentityId` resolves correctly, no LedgerEntry row emitted FROM APEX may carry `Sub__c = null` if the request was JWT-authenticated. Verified by `[SELECT COUNT(Id) FROM LedgerEntry__c WHERE Sub__c = null AND Source__c = 'apex' AND EventType__c NOT IN (preauth_event_set)]` = 0. (Note: GAP-16 covers the Ares-side equivalent of this rule — anonymous-post-auth on `api.inbound` rows emitted by the Ares middleware. That fix lives in the Ares agent's scope, NOT olympus-grid's; see GAP-16.)

#### Scope discipline for EOS-5

Pattern 1 + the seven event types in criterion 5 ARE EOS-5. Consumption events (`mcp.tool.call`, `llm.turn`, `email.send`) already emit from Ares/Hermes/Plutus per §9.Q and are out of scope here — this gap is about the SF-side state-machine audit trail only.

**Steward feedback:** _(reserved)_

---

### GAP-13 — No LedgerEntry on `AP.AccountStatus__c` transitions (closes through GAP-12)

- **Severity:** 🔴 BLOCKER (sub-case of GAP-12)
- **§9 letter:** A
- **Detected:** 2026-06-27
- **Owner — olympus-grid agent:** `ApplicationProfileTrgHnd` per-phase event_type wiring; the actual `LedgerEntryEmitter` infrastructure lands in GAP-12

**Production use case:** Admin approval workflow: Steward in iris admin UI sets `AP.AccountStatus__c = 'Approved'` (Waitlist → Approved). Subsequent first user signin transitions Approved → Active. These are admin actions of meaningful consequence (granting access, enabling consumption).

**Empirical evidence:** Three approval events fired:

| Time | AP | Transition |
|---|---|---|
| 17:44:13 | AP-00090 iris | Waitlist → Approved |
| 18:23:47 | AP-00091 gpt | Waitlist → Approved |
| 19:37:59 | AP-00093 guardians | Waitlist → Approved (auto/manual, in 39s) |

Four activation events fired:

| Time | AP | Transition |
|---|---|---|
| 17:48:42 | AP-00090 | Approved → Active (on first iris signin) |
| 18:25:35 | AP-00091 | Approved → Active (on first gpt signin + onboarding) |
| 18:48:07 | AP-00092 | Approved → Active (on first turtleshell signin + onboarding) |
| 19:39:41 | AP-00093 | Approved → Active (on first guardians email signin) |

All 7 state transitions: 0 LedgerEntry rows. The only proof these happened is `AP.LastModifiedDate` plus the corresponding outbound EmailMessage (where applicable).

**Why this matters:** Same as GAP-12 — admin and state-machine actions are invisible to Plutus.

**Olympus-grid agent triage (2026-06-27)**

This gap closes through Pattern 1 (GAP-12); no separate `LedgerEntryEmitter` infrastructure lands here. What this gap owns is (a) the per-phase event-type wiring inside `ApplicationProfileTrgHnd`, and (b) the actor-vs-subject disambiguation that AP-status changes specifically require (admin acting on another user's row).

The current criterion 2 conflated payload with attribution. **The 5-tuple is the emitter's job** (GAP-12 contract); payload carries only event-specific facts.

#### Payload contracts

```apex
// profile.created (AP insert)
{ "initialStatus": "Waitlist", "requiresWaitlist": true }
// `requiresWaitlist` snapshots the parent Application__c.RequiresWaitlist__c at create-time

// profile.status.changed (AccountStatus__c update)
{ "old": "Waitlist", "new": "Approved", "reason": null }
// `reason` is optional and computable from context (e.g., "admin-approval",
// "first-signin-activation"). Null is acceptable.
```

#### Subject-vs-actor disambiguation

For admin-driven AP changes (actor = admin, subject ≠ actor), the LedgerEntry row carries `Sub__c = actor` (per GAP-12 5-tuple stamping) AND an extra payload field `subjectIdentityId = AP.Identity__c` so audit can reconstruct "who acted on whose row." For self-driven transitions (Approved → Active on first signin: actor = subject), the field is omitted.

This is the only AP-specific addition to the Pattern 1 contract. Cluster transitions (GAP-07/GAP-12 § cluster events) may need an equivalent pattern if admins ever spawn clusters on behalf of others — currently they don't.

#### Refined acceptance criteria (binary; closes through GAP-12)

1. `ApplicationProfileTrgHnd` after-insert emits `profile.created` with payload `{initialStatus, requiresWaitlist}`.
2. `ApplicationProfileTrgHnd` after-update guarded by `oldRow.AccountStatus__c != newRow.AccountStatus__c` emits `profile.status.changed` with payload `{old, new, reason?, subjectIdentityId?}`.
3. **Subject-vs-actor captured**: when `TransactionContext.actorIdentityId != AP.Identity__c`, payload includes `subjectIdentityId = AP.Identity__c`. When they match, the field is omitted.
4. **Approval test**: in alpha-org, an admin (homer) approves a new waitlisted user → exactly 1 LedgerEntry row under homer's `Sub__c` with `EventType__c = "profile.status.changed"` + payload `{old: "Waitlist", new: "Approved", subjectIdentityId: <target>}`.
5. **Activation test**: target user signs in for the first time → exactly 1 LedgerEntry row under TARGET's `Sub__c` with `EventType__c = "profile.status.changed"` + payload `{old: "Approved", new: "Active"}` (no `subjectIdentityId`).
6. **Roll-up verification**: across the EOS-5 attestation run, the count of `profile.status.changed` rows equals the count of distinct `AccountStatus__c` transitions in `ApplicationProfileHistory` (the SF system-managed history) for the same time window.

**Closure dependency:** GAP-12 — Pattern 1 + `ApplicationProfileTrgHnd` wiring lives there. GAP-13 is the AP-specific spec layered on top.

**Steward feedback:** _(reserved)_

---

### GAP-14 — No Logger row on AP trigger fire (precondition question resolved inline)

- **Severity:** 🟡 defer · non-§9 instrumentation gap
- **§9 letter:** — (Logger rows are operational debug logs; §9 audit trail rides on `LedgerEntry__c`, not `Logger__c`)
- **Detected:** 2026-06-27
- **Owner — olympus-grid agent:** non-blocking follow-up — inspect `Plugin.TRG_HND_ApplicationProfile.md-meta.xml` Logger flag once Pattern 1 ships

**Production use case:** AP triggers DO fire (the row gets updated, the email gets sent). But unlike Identity.trigger which writes Logger rows on every fire, AP triggers write nothing.

**Empirical evidence:**

| Trigger fired | Logger rows produced |
|---|---|
| Identity.trigger (signup signin) | 2 per email-verify event (the double-fire pattern, GAP-11) |
| AP trigger (4 inserts, 3 approvals, 4 activations, 2 ProfileData updates = 13 events) | 0 |

Either the trigger doesn't write to Logger, OR the trigger doesn't exist (the AP status change is a direct field update with no trigger handler).

**Olympus-grid agent triage (2026-06-27)**

Inline investigation resolved the GAP-12 precondition question. Findings:

| Artifact | Path | Exists? | Notes |
|---|---|---|---|
| AP trigger | `force-app/applications/default/triggers/ApplicationProfile.trigger` | ✅ | 39 lines |
| AP trigger handler | `force-app/applications/default/classes/ApplicationProfileTrgHnd.cls` | ✅ | 205 lines, `public without sharing class ApplicationProfileTrgHnd extends ISObjectAbstractTriggerHandler` |
| Plugin__mdt registration | `force-app/applications/default/customMetadata/Plugin.TRG_HND_ApplicationProfile.md-meta.xml` | ✅ | Same handler-registration pattern as Identity |
| Identity trigger handler (comparison) | `force-app/idp/default/classes/IdentityTrgHnd.cls` | ✅ | Same abstract base `ISObjectAbstractTriggerHandler` |

**Both handlers extend the same abstract base.** Yet empirically Identity writes Logger rows and AP doesn't. The Logger-gating mechanism must live in either (a) `Plugin.TRG_HND_ApplicationProfile.md` Configuration JSON missing a flag that `Plugin.TRG_HND_Identity.md` has, or (b) the abstract base reads some other discriminator. Either way it's a 5-minute follow-up after Pattern 1 ships.

**Why this stays defer:** Logger rows are operational debug logs. The §9 audit trail rides on `LedgerEntry__c`. GAP-12 Pattern 1 emits LedgerEntries regardless of whether Logger rows fire — so Logger-silence on the AP trigger has **zero §9.A impact**.

**Important consequence: GAP-12 scope question is resolved.** The AP trigger already exists. GAP-12 Pattern 1 work **EXTENDS** `ApplicationProfileTrgHnd.cls` with `LedgerEntryEmitter.emit(...)` calls per phase + field-change predicate (per GAP-13's spec). It does NOT create a new trigger from scratch. Scope-creep on GAP-12 is bounded.

#### Refined acceptance criteria (binary)

1. **[resolved 2026-06-27]** AP trigger empirically exists; GAP-12 scope = EXTEND, not CREATE. No further work on GAP-14 is required for EOS-5 attestation.
2. **[defer — non-§9 follow-up]** Identify the Logger-gating discriminator that lets Identity log but suppresses AP. Likely a `Configuration__c` JSON field on the `Plugin__mdt` record. Resolution is a 5-minute code-read after Pattern 1 ships.
3. **[forward — optional]** Once root cause identified, decide whether to enable Logger on AP for parity with Identity, OR leave OFF if Identity's logging is itself excessive (GAP-11 double-fire produces 2 Logger rows per signup signin — operationally noisy without any §9 use).

**Closure dependency:** none. Resolved inline.

**Steward feedback:** _(reserved)_

---

### GAP-15 — Identity.SuperAdmin grant has zero audit footprint (closes through GAP-12)

- **Severity:** 🔴 BLOCKER · SOC2 CC6.1 anchor
- **§9 letter:** §7 (Least Privilege) + SOC2 CC6.1 (logical access)
- **Detected:** 2026-06-27
- **Owner — olympus-grid agent:** `IdentityTrgHnd` after-update field-change wiring; Pattern 1 infrastructure lands in GAP-12
- **Verified inline 2026-06-27:** `Identity__c.SuperAdmin__c` field exists at `force-app/core/default/objects/Identity__c/fields/SuperAdmin__c.field-meta.xml`. `IdentityTrgHnd.cls` exists and extends the same abstract base as the AP handler. **EXTEND, not CREATE.**

**Production use case:** Manual privileged-permission grant via SF admin UI. Steward toggled `Identity[homer].SuperAdmin__c = true` at 17:41:33 to make homer a system admin.

**Empirical evidence:**

```
Identity[homer] LastModifiedDate:  17:41:33   ← only proof it happened
LedgerEntry rows:                    0
Logger rows:                         0
EmailMessage rows:                   0
Outbound notification to anyone:     none
```

No audit trail anywhere. If 6 months from now a security incident asks "when did homer become SuperAdmin and who granted it," the answer is: we don't know — only that the `LastModifiedDate` timestamp says 17:41:33 on 2026-06-27 and the modifying SF user can be looked up.

**Why this matters:** Privileged-grant audit is foundational to §7 (Least Privilege) and SOC2 trust criteria CC6.1 (logical access). For the trillion-dollar pipeline, any actor with SuperAdmin can in principle move money — that grant must be auditable.

**Olympus-grid agent triage (2026-06-27)**

This gap closes through Pattern 1 (GAP-12). Two SOC2-specific wrinkles the original criteria missed:

#### Wrinkle 1 — SF-admin-UI changes don't flow through cosmos-logos auth

The Steward toggled homer's SuperAdmin via the SF admin UI at 17:41:33. That's a Salesforce-side change with `LastModifiedById` = an SF User Id; it does NOT carry a cosmos-logos JWT. `TransactionContext.actorIdentityId` may be null (no JWT context) OR may fall back to an SF-User → Identity mapping if such mapping is configured.

**SOC2 CC6.1 requires tamper-evident attribution.** `Salesforce.LastModifiedById` is system-managed and tamper-evident — that's the SOC2 anchor. Payload must capture **both** `actorIdentityId` (cosmos-logos attribution, may be null) AND `sfUserId` (SF system attribution, always available) so the audit chain holds even when cosmos-logos attribution is unavailable.

#### Wrinkle 2 — Logger row is NOT §9 / SOC2 audit

Per GAP-14 finding: Logger rows are operational debug logs. The audit-of-record for §9.A / §7 / SOC2 is `LedgerEntry__c`. Drop the "Logger row also written" criterion — it adds noise without adding audit value.

#### Payload contract

```apex
// identity.privilege.granted (SuperAdmin__c false→true)
{
  "old": false,
  "new": true,
  "subjectIdentityId": "<homer's Identity Id>",       // actor ≠ subject per GAP-13 pattern
  "sfUserId": "<LastModifiedById — SOC2 anchor>",
  "sfUserName": "zeus.alpha.1@olympus-grid.com",
  "reason": null                                       // free-text; null until reason-capture UI ships
}

// identity.privilege.revoked (SuperAdmin__c true→false)
// same shape; { "old": true, "new": false, ... }
```

The `sfUserId` field lives in PAYLOAD, NOT in `Sub__c`. `Sub__c` is the cosmos-logos sub claim, semantically distinct from an SF User Id. Conflating them breaks attribution semantics.

#### Refined acceptance criteria (binary; closes through GAP-12)

1. `IdentityTrgHnd.cls` after-update guarded by `oldRow.SuperAdmin__c != newRow.SuperAdmin__c` emits via `LedgerEntryEmitter`:
   - `EventType.IDENTITY_PRIVILEGE_GRANTED` on false→true.
   - `EventType.IDENTITY_PRIVILEGE_REVOKED` on true→false.
2. Payload carries `{old, new, subjectIdentityId, sfUserId, sfUserName, reason?}` per the contract above.
3. 5-tuple stamping per GAP-12: `Sub__c` = `TransactionContext.actorIdentityId` if resolvable, else null. SOC2 anchor (`sfUserId`) lives in payload, NOT `Sub__c`.
4. Logger row NOT required for §9 / SOC2. (If the abstract base writes one, fine; it is not the audit-of-record.)
5. **End-to-end attestation test**: toggle SuperAdmin on a test Identity via SF admin UI. Verify exactly 1 LedgerEntry row appears with correct event_type, full payload, and `LastModifiedById`-derived `sfUserId` populated.
6. **SOC2 audit query** (the CC6.1 query): `SELECT Id, CreatedDate, EventType__c, Sub__c, Payload__c FROM og_node_beta_1__LedgerEntry__c WHERE EventType__c IN ('identity.privilege.granted','identity.privilege.revoked') ORDER BY CreatedDate DESC` returns one row per grant/revoke in chronological order, immutable.
7. **Backfill stance**: the existing homer-SuperAdmin grant at 17:41:33 (2026-06-27) has NO ledger entry. Pre-fix audit gap is **accepted** (option b); backfilling synthetic rows is forensically dubious. Path forward: document this grant as pre-EOS-5 in the cycle close-out, then once Pattern 1 ships, REVOKE + RE-GRANT homer's SuperAdmin to produce two real ledger rows that re-anchor the audit chain. (Operationally trivial; rotates the grant timestamp into the post-EOS-5 audit window.)

**Closure dependency:** GAP-12 — Pattern 1 + `IdentityTrgHnd` extension lives there. GAP-15 is the privileged-grant spec + SOC2 wrinkles layered on top.

**Steward feedback:** _(reserved)_

---

### GAP-16 — `LedgerEntry.user_id="anonymous"` post-auth on most endpoints — **owner: Ares agent**

- **Severity:** 🔴 BLOCKER (partial — quota endpoint already correct)
- **§9 letter:** A (user-level)
- **Detected:** 2026-06-27
- **Owner — Ares agent:** middleware auth-context propagation + per-service route-handler stamping
- **Olympus-grid agent role:** schema-readiness verification only (no Apex fix — Ares emits LedgerEntries via its own emit path, distinct from Apex `TransactionContext`)

**Production use case:** Once homer is signed in (has a valid JWT cookie), every subsequent API call should carry his sub in LedgerEntry attribution. Otherwise user-level reporting is impossible.

**Empirical evidence:** Post-auth LedgerEntries from the gpt console after homer's signin:

```
18:25:42  api.inbound  user=anonymous       path=/v1/apollo/providers
18:25:42  api.inbound  user=anonymous       path=/v1/apollo/voices
18:25:42  api.inbound  user=anonymous       path=/v1/chronos/api/lists
18:25:42  api.inbound  user=anonymous       path=/v1/proteus/api/types
18:25:43  api.inbound  user=9ba1f82f-...    path=/v1/plutus/quota/9ba1f82f-9621-45fc-bfdc-3356f7157dc9
18:26:00  api.inbound  user=9ba1f82f-...    path=/v1/plutus/quota/9ba1f82f-9621-45fc-bfdc-3356f7157dc9
[...5 more plutus/quota polls, all carrying sub correctly...]
```

And for guardians-iOS post-launch heracles fetches:

```
19:00:52  api.inbound  user=anonymous       path=/v1/heracles/omens/universes
19:00:52  api.inbound  user=anonymous       path=/v1/heracles/omens/books/ramayana
[...535 more heracles fetches, ALL anonymous...]
```

Pattern: only `/v1/plutus/quota/<sub>` carries the sub. Apollo, Chronos, Proteus, Heracles all return anonymous even when the user is authenticated. The discrepancy is per-endpoint, not per-method.

**Why this matters:** "Who consumed what" requires sub on every event. Without it, billing rollups fail, per-user analytics fail, abuse detection fails. Of homer's 8 signin events plus all post-auth navigation, zero rows in LedgerEntry carry his sub on the authentication-related events themselves; only the plutus/quota path carries it on poll events.

**Olympus-grid agent triage (2026-06-27)**

This gap lives in **Ares middleware**, not Apex. The fix is a different codebase from the Pattern 1 spine. From the olympus-grid agent perspective:

1. **§9.A end-to-end requires BOTH gaps to close.** GAP-12 closes SF-side (Apex emits with `TransactionContext.actorIdentityId`). GAP-16 closes Ares-side (Ares emits `api.inbound` with `req.user_id` from validated JWT). Both code paths are independent; closing one does not close the other. (This corrects an earlier GAP-12 criterion that over-promised.)
2. **Cross-cutting forward-pointer to GAP-08.** Once `cid` + `tid` JWT claims land (GAP-08, GAP-01), the Ares-side fix must extend beyond just `Sub__c` to stamp **the full 5-tuple at the perimeter**: `Application__c` (from `cid`), `Tenant__c` (from `tid`), `Cluster__c` (from request routing context), `ApiKey__c` (if API-key auth). Otherwise plutus rollups remain incomplete.
3. **SF schema readiness** is olympus-grid's only direct contribution. `LedgerEntry__c` already receives sub-stamping on the plutus/quota path; needs Tenant__c (GAP-01) and Application__c (GAP-02) lookup fields deployed before the Ares fix can stamp the full 5-tuple. Those land under GAP-01/GAP-02; no additional schema work required for GAP-16 itself.

#### Refined acceptance criteria (binary; Ares-agent owns implementation)

1. **[Ares agent]** Auth-context middleware extracts sub from validated JWT (already works on plutus/quota path); propagates to every downstream route handler via `req.user_id`.
2. **[Ares agent]** Per-service route handlers (`/v1/apollo/*`, `/v1/chronos/*`, `/v1/proteus/*`, `/v1/heracles/*`) preserve `req.user_id` when emitting `api.inbound` LedgerEntries. Currently only `/v1/plutus/quota/<sub>` does this correctly.
3. **[Ares agent, forward to GAP-08/GAP-01]** Once `cid` and `tid` JWT claims land, Ares middleware also stamps `Application__c` (from `cid`), `Tenant__c` (from `tid`), `Cluster__c` (from request routing context) on every `api.inbound` LedgerEntry. Full 5-tuple stamping at the perimeter.
4. **[olympus-grid agent — schema readiness only]** `LedgerEntry__c` field metadata contains all 5-tuple fields (Tenant__c via GAP-01; Application__c via GAP-02; Sub__c, Cluster__c, ApiKey__c already exist). Verified by `sf sobject describe og_node_beta_1__LedgerEntry__c` listing each lookup field.
5. **End-to-end attestation test**: signed-in homer makes one request each to apollo, chronos, proteus, heracles. Each resulting LedgerEntry row has `Sub__c = homer's sub` (NOT null/anonymous). Once GAP-08 lands, also: `Application__c` populated from `cid`, `Tenant__c` populated from `tid`.
6. **[Ares agent]** Documented null cases for `api.inbound.Sub__c`: pre-auth `/v1/auth/*` endpoints, `/.well-known/*` discovery, health checks. All other endpoints MUST carry sub when JWT is valid.

#### Closure dependency

- **GAP-01** — Tenant__c primitive must exist for Ares to stamp `Tenant__c`.
- **GAP-02** — `LedgerEntry__c.Application__c` lookup field must exist for Ares to stamp it.
- **GAP-08** — JWT must carry `cid` (and `tid`) claims for Ares to read them. Without GAP-08, Ares can fix `Sub__c` only; full 5-tuple stamping is impossible.

Partial close on `Sub__c`-only is acceptable as an interim step (eliminates `user=anonymous` immediately, even before 5-tuple stamping lands). Full close requires the chain above.

**Steward feedback:** _(reserved)_

---

### GAP-17 — No last-sign-in / last-activity tracking on `Identity__c` (closes by non-action; post-GAP-16 timeline suffices)

- **Severity:** 🟡 defer · §9.U (user-observability, not §9.A attribution)
- **§9 letter:** U
- **Detected:** 2026-06-27
- **Owner — olympus-grid agent:** documentation only for EOS-5; schema + Apex denormalization deferred to a future §9.U cycle if/when latency budget breaches at production scale

**Production use case:** Operational questions: "When did homer last sign in?" "How many active users in the last 24h?" "Who hasn't signed in in 30 days?"

**Empirical evidence:** `Identity__c.LastModifiedDate` only advances when a tracked field changes. Apple SIWA on an existing Identity is a no-op on the row (only the AP gets updated). Email signin advances LastModifiedDate ONLY because EmailLastVerified__c is updated.

```
Apple SIWA signin (homer on iris @17:48:42):  Identity LastMod did NOT advance
Email signin (homer on iris @17:54:35):       Identity LastMod advanced (because EmailLastVerified advanced)
Apple SIWA signin (homer on turtleshell-web @18:40:16):  Identity LastMod did NOT advance
```

Session count, last-activity, last-active-platform — none tracked.

**Why this matters:** Becomes important for §9.U observability, customer success ("user A hasn't logged in for 14 days"), and security ("user B is signing in unusually frequently from new locations").

**Olympus-grid agent triage (2026-06-27)**

The information is already in the system — or will be once GAP-16 lands. This gap is about **query shape** (timeline vs snapshot), not about missing data.

Once GAP-16 (Ares-side `api.inbound.Sub__c` stamping) closes, every authenticated request row carries `Sub__c`. That means the operational questions are derivable from `LedgerEntry__c` directly:

| Question | Query (post-GAP-16) |
|---|---|
| When did homer last sign in? | `SELECT MAX(CreatedDate) FROM LedgerEntry__c WHERE Sub__c = :id AND Path__c LIKE '/v1/auth/%'` |
| When was homer's last activity? | `SELECT MAX(CreatedDate) FROM LedgerEntry__c WHERE Sub__c = :id` |
| How many sign-ins in 24h? | `SELECT COUNT(Id) FROM LedgerEntry__c WHERE Sub__c = :id AND Path__c LIKE '/v1/auth/%' AND CreatedDate = LAST_N_DAYS:1` |
| Who hasn't signed in in 30 days? | Identity rows with no LedgerEntry in last 30 days (left join) |

The original "cheap add" (denormalized `LastSignInAt__c` + `SignInCount__c` fields) is **denormalization for UI speed**, not new information. Premature until iris admin UI demonstrably breaches its latency budget at scale.

#### Refined acceptance criteria (binary)

1. **[defer for EOS-5; closes by non-action]** Post-GAP-16 LedgerEntry timeline serves operational queries for last-activity, sign-in counts, and inactivity reports. Document the canonical SOQL patterns in the EOS-5 close-out (the table above) so admins query without denormalization.
2. **[forward — reopens on trigger]** If iris admin UI breaches latency budget on inline timeline queries at production scale, add `Identity.LastSignInAt__c` (Datetime) — written by either (a) `ApiRouteAuth.cls` directly on successful verify, OR (b) an `Identity__c` rollup trigger that watches `LedgerEntry__c` inserts with `Path__c LIKE '/v1/auth/%'`. Decision deferred to that moment.
3. **[forward — opportunistic]** If GAP-12's Pattern 1 registry adds an explicit `identity.signed_in` event_type for analytical reasons unrelated to GAP-17 (e.g., per-session sign-in-method tracking), then this gap closes as a free byproduct of that work. **Do not add `identity.signed_in` solely to serve GAP-17** — tail wagging dog.

**Closure dependency:** GAP-16 (Ares-side sub stamping). Otherwise none.

**Olympus-grid agent contribution for EOS-5:** documentation only. No schema, no Apex, no FLS.

**Steward feedback:** _(reserved)_

---

### GAP-18 — AP Approved→Active transition has no audit footprint (SUBSUMED by GAP-13)

- **Severity:** 🟢 SUBSUMED — no independent work
- **§9 letter:** A
- **Detected:** 2026-06-27
- **Owner:** subsumed entirely by GAP-13 / GAP-12 (Pattern 1)

**Production use case:** First user signin after approval. `AP.AccountStatus__c` auto-flips Approved → Active.

**Empirical evidence:** AP-00090 transitioned Approved → Active at 17:48:42. Zero LedgerEntry, zero Logger row, only `LastModifiedDate`.

**Olympus-grid agent triage (2026-06-27)**

GAP-18 is the **Approved→Active leg** of GAP-13's transition coverage. It was tracked separately in the original triage because the earlier session distinguished approval (admin-acts-on-subject) from activation (subject-acts-on-self) — two sub-cases with different actor-vs-subject payload shapes. GAP-13's refined spec is now explicit on that distinction (criterion 5: "activation test, payload `{old: 'Approved', new: 'Active'}` with NO `subjectIdentityId` because actor = subject"), so GAP-18 is a pure duplicate with no separate acceptance criterion or verification.

**Closure:** automatic when GAP-13 §5 holds. Verification:

```sql
SELECT Id, CreatedDate, Sub__c, Payload__c
FROM og_node_beta_1__LedgerEntry__c
WHERE EventType__c = 'profile.status.changed'
  AND Payload__c LIKE '%"new":"Active"%'
  AND Payload__c LIKE '%"old":"Approved"%'
```
Expected: one row per `Approved → Active` AP transition during the EOS-5 attestation run.

**Closure dependency:** GAP-13 (which closes through GAP-12). No independent path.

**Steward feedback:** _(reserved)_

---

### GAP-19 — Email-link auth bypasses Ares entirely (4-of-4 surfaces) — **PERIMETER BREACH, not just attribution gap**

- **Severity:** 🔴 BLOCKER · §3.AR perimeter violation + §9.A attribution gap
- **§9 letter:** A (attribution) + §3.AR (Ares ingress-hardening NFR contract)
- **Detected:** 2026-06-27
- **Owner (multi-repo):**
  - **iris agent + cosmos-logos turtleshell agents** — client refactor to call Ares instead of SF Site URL
  - **Ares agent** — confirm `/v1/auth/email/link/*` route exists, proxies to Apex, emits `api.inbound`
  - **olympus-grid agent** — add `auth.email.*` event_types to Pattern 1 registry; emit from `ApiRouteAuth.cls`

**Production use case:** Email-link signup or signin on any web surface. User enters email, frontend posts to backend, backend sends magic link, user clicks code, backend verifies.

**Empirical evidence:** Each email-link auth event across 4 surfaces (iris, gpt, turtleshell-web, turtleshell-ios):

| Surface | Email request time | Email verify time | LedgerEntry rows for these calls |
|---|---|---|---|
| iris | 17:52:10 | 17:54:35 | **0** |
| gpt | 18:19:35 | 18:25:23 | **0** |
| turtleshell-web | 18:46:44 | 18:46:57 | **0** |
| turtleshell-ios | 18:53:35 | 18:53:59 | **0** |

Total: 8 email-link auth events, 0 LedgerEntries. Compare Apple SIWA on same surfaces: every Apple verify call produced 1 `api.inbound` LedgerEntry (anonymous, but present).

Most likely mechanism: the iris React UI posts email-link requests directly to the Salesforce Site URL (`olympus-grid-alpha-1.my.site.com/portal/services/apexrest/...`) rather than routing through `https://api-int.turtleshell.ai/v1/auth/email/link/{request,verify}`. Apple SIWA must go through Ares (server-side token verification). Email-link can short-circuit.

**Why this matters:** Auth events are the foundation of attribution. If email auth is invisible at the edge, you cannot:
- Count auth attempts (for rate limiting, abuse detection)
- Attribute the first post-signin request to the right cluster
- Tie email-based signin to its emitting cluster for per-cluster billing

**Olympus-grid agent triage (2026-06-27)**

The original two-option framing (route through Ares OR Apex emits) presents these as equivalent. They are not. **Option B alone leaves the perimeter breached.**

#### Why "Option A or B" is the wrong framing

Per the **Ares ingress-hardening NFR contract (§3.AR, 2026-06-15)**, Ares IS the security perimeter:
- 5-layer policy overlay (kill switch, revoked subs, revoked keys, denied paths)
- 3-axis rate limit (per-IP / per-key / per-sub, LRU-capped 50k)
- `api.blocked.<rule>` Plutus events with full policy metadata

If email-link auth bypasses Ares, **none of that applies to email-link traffic**:
- Rate-limit on email-link spam can't fire — Ares doesn't see the call
- Revoked sub can't be blocked at the perimeter — call never hits perimeter
- Kill-switch on `/v1/auth/email/link/*` doesn't fire — call doesn't route through Ares
- No `api.inbound` row at the network level

**The correct fix is BOTH Option A AND Option B in tandem** — they capture different facts:

| Layer | Emitter | Event | Captures |
|---|---|---|---|
| Network | Ares middleware | `api.inbound` on `/v1/auth/email/link/{request,verify}` | IP, cluster, latency, policy result |
| Business | Apex `ApiRouteAuth` via Pattern 1 (GAP-12) | `auth.email.request_sent`, `auth.email.verify_succeeded`, `auth.email.verify_failed` | Identity created/updated, JWT issued/declined, AP transitioned |

Complementary, not redundant. Both feed Plutus from different vantage points.

#### Forward-pointer to GAP-08

When GAP-08 lands (JWT carries `cid` for Application-scoped attribution), the email-link `/verify` endpoint must accept an `app_key` / `applicationId` parameter so the **issued JWT is bound to the originating Application**. iris-portal verify mints `cid=iris`; turtleshell-web verify mints `cid=turtleshell`. Today's flow has no such binding because there's no Application-authority concept in JWT yet.

#### Refined acceptance criteria (binary; multi-repo)

1. **[iris agent + cosmos-logos turtleshell agents]** Client frontends call `POST https://{cluster}/v1/auth/email/link/request` and `POST https://{cluster}/v1/auth/email/link/verify`. No direct `*.my.site.com/portal/services/apexrest/...` POSTs for auth.
2. **[Ares agent]** Ares route `/v1/auth/email/link/*` exists, proxies to Apex `ApiRouteAuth`, emits `api.inbound` LedgerEntry per call. Pre-auth case: `Sub__c` null acceptable on `/request`; on `/verify` success, Ares stamps `Sub__c` from the JWT-mint response (or emits a follow-up attribution-stamped row).
3. **[olympus-grid agent]** Three event_types added to the Pattern 1 registry (GAP-12) and emitted from `ApiRouteAuth.cls`:
   - On `/request`: `auth.email.request_sent`, payload `{email, applicationId, deliveryProvider}`. No sub yet — pre-auth event.
   - On `/verify` success: `auth.email.verify_succeeded`, payload `{email, applicationId, identityCreatedThisRequest: bool, apTransitions: [...]}`. Sub__c stamped from the freshly-minted JWT.
   - On `/verify` failure: `auth.email.verify_failed`, payload `{email, applicationId, reason}`. Sub__c null.
4. **End-to-end test (per surface)**: trigger an email-link signup + signin on each of iris, gpt, turtleshell-web, turtleshell-ios. Per signup, expect **6 LedgerEntry rows**:
   - 1 Ares `api.inbound` on `/request`
   - 1 Apex `auth.email.request_sent`
   - 1 Ares `api.inbound` on `/verify`
   - 1 Apex `auth.email.verify_succeeded`
   - 1 Apex `identity.created` (per GAP-12)
   - 1 Apex `profile.created` (per GAP-13)
5. **Method-symmetry test**: Apple SIWA signin and email-link signin on the same surface for the same user produce equivalent LedgerEntry shapes — equivalent event_types (`auth.apple.verify_succeeded` vs `auth.email.verify_succeeded`), equivalent 5-tuple stamping.
6. **Perimeter policy verified (the §3.AR proof)**: a manually-issued `api.blocked.path_denied` kill-switch on `/v1/auth/email/link/verify` produces an `api.blocked` event AND prevents `ApiRouteAuth` from being reached. Confirms email-link traffic NOW honors the §3.AR policy overlay.

#### Closure dependencies

- **iris client refactor + cosmos-logos turtleshell-web/ios refactor** — clients must call Ares URL before Ares-side audit is meaningful.
- **GAP-12** — Pattern 1 must land before the Apex side emits `auth.email.*` event_types.
- **GAP-08 (forward-pointer)** — full Application binding on issued JWT requires `cid` claim. Without GAP-08, `applicationId` in payload is best-effort (from request body, not cryptographically bound to the issued JWT).

**Steward feedback:** _(reserved)_

---

### GAP-20 — `EmailLastVerified__c` semantics divergent across auth methods (defer; doc-only)

- **Severity:** 🟡 defer · low (operational hygiene)
- **§9 letter:** — (no §9 letter, no SOC2 anchor)
- **Detected:** 2026-06-27
- **Owner — olympus-grid agent:** field-description metadata only for EOS-5; formula field deferred until a real consumer surfaces

**Production use case:** `Identity.EmailLastVerified__c` is intuitively "last time we verified the user controls this email."

**Empirical evidence:**

| Auth method | Updates EmailLastVerified? |
|---|---|
| Apple SIWA (homer's first iris signup at 17:33:58) | NO (field stayed null until email-link signin later) |
| Email-link verify (homer's iris signin at 17:54:35) | YES (set to 17:54:35) |
| Subsequent Apple SIWA signins | NO (field unchanged) |
| Subsequent email-link verifies | YES (advances each time) |

Field is strictly "last time we sent and verified a magic-link code." Could be ambiguous — Apple SIWA also verifies email possession (Apple confirmed the email belongs to the Apple ID owner).

**Why this matters:** If a downstream consumer trusts EmailLastVerified to mean "email was verified somehow," they'll get false-negative for Apple-only users.

**Olympus-grid agent triage (2026-06-27)**

The three original options aren't equivalent — one of them actively destroys information:

| Option | Verdict |
|---|---|
| Document strict semantics | ✅ cheapest, honest, no info loss |
| Rename to `MagicLinkLastVerifiedAt__c` | ❌ disproportionate cost (metadata rename + every consumer + managed-package implications) for low-severity §0 gap |
| Apple SIWA handler also writes the field | ❌ **destroys signal distinction** — can no longer tell real-time mailbox proof from Apple-attested proof |

Apple SIWA and email-link verify prove **different things**:

| Proof | Strength | Captures |
|---|---|---|
| Email-link verify | Real-time mailbox access | User controls mailbox at THIS moment |
| Apple SIWA | Apple-attested ownership | Apple's records say user owns the email (when paired) |

Both are "verification" in a loose sense, but the security claims differ. For password-reset-eligible auth, real-time access is stronger; for general communications, both are equivalent. The field should NOT conflate them.

#### Better option missing from the original framing — Option 4 (preserve both signals)

Keep `EmailLastVerified__c` narrow ("last magic-link verification"). Add a `Checkbox` formula field on `Identity__c` if a real consumer surfaces:

```
EmailVerifiedAnyMethod__c (Checkbox formula) =
    NOT(ISBLANK(EmailLastVerified__c)) || NOT(ISBLANK(AppleUserId__c))
```

Trivial cost: zero storage, zero trigger logic, zero migration. **Do not add proactively** — adds noise to the schema without a consumer.

#### Refined acceptance criteria (binary)

1. **[EOS-5 deliverable; doc-only]** `Identity__c.EmailLastVerified__c` field-description metadata updated to: *"Last successful magic-link code verification. Apple SIWA does NOT update this field; Apple-attested email ownership is captured via `AppleUserId__c` presence. For 'email verified by any method,' query both fields."*
2. **[forward — opportunistic]** If a downstream consumer surfaces needing the unified signal, add `EmailVerifiedAnyMethod__c` formula field per the snippet above. Cost is negligible; defer until justified.
3. **[anti-recommendation, written explicitly to prevent future drift]** Do NOT have Apple SIWA write to `EmailLastVerified__c`. Destroys the signal distinction. If a single unified timestamp is ever needed, add a NEW field (`EmailVerifiedAnyMethodAt__c`), do NOT clobber the existing one.

**Closure dependency:** none.

**Steward feedback:** _(reserved)_

---

### GAP-21 — ~~`Cluster__c` missing initiating-Application FK~~ REVISED 2026-06-28: closes through Pattern 1 audit chain; no Cluster__c column added

> **Revision note (2026-06-28):** Steward direction — *"the point is most would be gpt as the creating application but then they would create their own application and run it on the cluster. so i don't see the value but if its just to audit tag the creation fine, but dont over engineer and this is low priority in my mind."*
>
> **Decision:** No `Cluster__c.Application__c` column added. The audit tag is captured by Pattern 1's `cluster.requested` LedgerEntry row → `ApplicationId__c` stamp (Sprint 1.1 field). Cluster is application-agnostic at runtime — the "creating app" (the surface the user clicked spawn on, typically olympus-gpt console) is distinct from the "runtime app" (the user's own application later registered to run on the cluster). The previous Lookup-with-Restrict design would have implied a runtime ownership relationship that does not exist.
>
> **Closure path:** Sprint 5 (GAP-12) Pattern 1 lands. `cluster.requested` event_type emits from `ClusterTrgHnd.cls` after-insert; emitter stamps `LedgerEntry.ApplicationId__c` from `TransactionContext.actorApplicationId` (resolved from JWT cid post-GAP-08). To answer "which app did this user spawn from": `SELECT ApplicationId__c FROM og_node_beta_1__LedgerEntry__c WHERE EventType__c = 'cluster.requested' AND ClusterId__c = :clusterId LIMIT 1`.

### GAP-21 — original triage entry (superseded; kept for traceability) — `Cluster__c` missing initiating-Application FK

- **Severity:** 🟠 must-close
- **§9 letter:** A
- **Detected:** 2026-06-27
- **Owner — olympus-grid agent:** schema (`Cluster__c.Application__c` lookup) + FLS + `ApiRouteClusters.spawn` handler wiring

**Production use case:** Steward (via iris admin UI) spawns a new cluster. Should be auditable which application initiated the spawn request — e.g., "iris admin spawned eos-5 for homer."

**Empirical evidence:** CL-00006 (eos-5) row at creation:

```json
{
  "Name": "CL-00006",
  "ClusterName__c": "eos-5",
  "Status__c": "Pending",
  "OwnerIdentity__c": "a1OaZ000006N5JhUAK",  // homer
  "Region__c": "us-east-1",
  "Runtime__c": "cloudpremise-aws",
  "PantheonVersion__c": "brain/1.7.x.x",
  "RequestedAt__c": "2026-06-27T18:00:35.000+0000"
}
```

No `AppKey__c` field. No record of which app (iris) initiated the spawn. OwnerIdentity is "for whom" not "via which app."

**Why this matters:** Per-app cluster-spawn cost attribution, audit ("who spawned this cluster via which surface"), and analytics ("most clusters spawned via iris admin"). Without AppKey, the audit chain breaks at the cluster-lifecycle boundary.

**Olympus-grid agent triage (2026-06-27)**

The original "add `AppKey__c` text field" proposal violates the canonical pattern locked under **GAP-02** (FK-rooted AppKey discipline — per-row attribution to an Application uses a **lookup**, not free-text) and **GAP-08** (Application__c is the central runtime authority; JWT carries `cid` claim cryptographically bound to its issuing Application).

**Correct fix: `Cluster__c.Application__c` as Lookup(Application__c). No text field.**

#### Cluster__c attribution model (after this gap + GAP-12 close)

| Field | Semantic | Source |
|---|---|---|
| `OwnerIdentity__c` (existing) | **Subject** — whose cluster this is | Request body or admin assignment |
| `Application__c` (NEW) | **Via which app** the spawn was initiated | JWT `cid` (post-GAP-08) or request body (interim) |
| `LedgerEntry.Sub__c` on `cluster.requested` (per GAP-12) | **Actor** — who initiated the spawn | `TransactionContext.actorIdentityId` |

Three-axis attribution: actor (who clicked) · subject (whose cluster) · application (which surface). No information loss.

#### Canonical/system-spawned clusters: Application = null acceptable

`api-int` (alpha) and `Local Dev Tunnel` (dev scratch) are platform-owned canonical clusters created by seed scripts, not user-initiated. `Application__c` stays null on these. The seed scripts (`alpha-org-data-seed.apex`, `dev-org-data-seed.apex`) leave the field unset on insert; field-description metadata captures the carve-out so future agents don't try to "fix" it.

User-spawned clusters (CL-00006 / eos-5 / spawned by homer via iris admin): `Application__c` MUST be populated.

#### Refined acceptance criteria (binary)

1. **Schema**: `Cluster__c.Application__c` Lookup(`Application__c`) field exists. NO text `AppKey__c` field on `Cluster__c` — that pattern is retired per GAP-02.
2. **FLS**: `force-app/home/default/permissionsets/Olympus_Grid_Admin.permissionset-meta.xml` grants R/W to `Cluster__c.Application__c` in the SAME PR as the field (per the 2026-05-30 canonical FLS rule).
3. **Apex spawn handler** (`ApiRouteClusters.spawn`) populates `Cluster.Application__c` on insert:
   - **Post-GAP-08**: from `TransactionContext.actorApplicationId` (resolved at perimeter from JWT `cid`).
   - **Interim (before GAP-08)**: from request body `applicationId` parameter, validated server-side against caller's permissible apps (reject requests where `applicationId` doesn't match the caller's session-resolvable surface).
4. **System-spawn carve-out documented**: seed scripts leave `Application__c` null on `api-int` and `Local Dev Tunnel`. Field-description metadata: *"Application that initiated the spawn. NULL on canonical platform clusters (e.g., api-int, Local Dev Tunnel) — those are system-spawned, not user-initiated."*
5. **`cluster.requested` LedgerEntry payload reconciliation** (GAP-12): payload need NOT include `applicationId` separately — it's already stamped on the LedgerEntry row via the 5-tuple emitter from `TransactionContext.actorApplicationId`. Payload remains event-specific facts only: `{clusterName, runtime, region, pantheonVersion}`.
6. **End-to-end test**: spawn a cluster via iris admin UI as homer. Verify:
   - `Cluster__c.Application__c` = iris Application Id (matches the surface that issued the spawn).
   - LedgerEntry with `EventType__c = "cluster.requested"`, `Application__c` = iris Id (via 5-tuple stamping), `Sub__c` = homer's sub.
   - SOQL `SELECT Application__r.AppKey__c, COUNT(Id) FROM og_node_beta_1__Cluster__c WHERE Application__c != null GROUP BY Application__r.AppKey__c` returns at least one non-null group per user-spawn surface across the EOS-5 attestation run.

#### Closure dependencies

- **GAP-02** — FK-rooted pattern this gap follows. Already a precondition (`Application__c` SObject + lookups exist after GAP-02).
- **GAP-08** (forward-pointer) — full cryptographic Application binding via JWT `cid`. Without GAP-08, spawn handler reads `applicationId` from request body, less tamper-evident. Interim fix acceptable.
- **GAP-12** — `cluster.requested` LedgerEntry stamping relies on 5-tuple emitter. Schema lookup must exist on `LedgerEntry__c.Application__c` (already required by GAP-02).

**Steward feedback:** _(reserved)_

---

### GAP-22 — `Cluster.OwnerIdentity` ambiguous (requester vs target) — closes by non-action post-GAP-12/21

- **Severity:** 🟡 defer · §7 (resolved by Pattern 1 + GAP-21 three-axis attribution; doc-only for EOS-5)
- **§9 letter:** §7
- **Detected:** 2026-06-27
- **Owner — olympus-grid agent:** field-description metadata only for EOS-5; denormalized `RequestedByIdentity__c` lookup deferred until a real query-latency demand emerges

**Production use case:** When a SuperAdmin spawns a cluster on behalf of another user (homer spawns for a customer), `OwnerIdentity` should be the customer; "who actually pressed the button" should be a separate field.

**Empirical evidence:** Current schema has only `OwnerIdentity__c` and no `RequestedBy__c` or `ActorIdentity__c`. Cannot distinguish "homer spawned this cluster for himself" vs "homer spawned this cluster for tenant-X."

**Why this matters:** SOC2 attestation distinguishes ownership from actor of operation. For least-privilege audit.

**Olympus-grid agent triage (2026-06-27)**

The ambiguity is already resolved by the GAP-12 / GAP-21 framework — no separate "RequestedBy" field is needed. The three-axis attribution model locked under GAP-21:

| Field | Semantic | Source |
|---|---|---|
| `Cluster.OwnerIdentity__c` (existing) | **Subject** — whose cluster this is | Request body or admin assignment |
| `Cluster.Application__c` (GAP-21) | **Via which app** the spawn was initiated | JWT `cid` (post-GAP-08) or request body (interim) |
| `LedgerEntry.Sub__c` on `cluster.requested` (GAP-12) | **Actor** — who initiated the spawn | `TransactionContext.actorIdentityId` |

The actor identity ("who pressed the button") is captured by Pattern 1's `cluster.requested` LedgerEntry row. To answer "who actually spawned this cluster":

```sql
SELECT Sub__c, CreatedDate
FROM og_node_beta_1__LedgerEntry__c
WHERE EventType__c = 'cluster.requested'
  AND Cluster__c = :clusterId
ORDER BY CreatedDate ASC LIMIT 1
```

The original "add `RequestedByIdentity__c` lookup" proposal would be a **denormalization** of the same value — same anti-pattern as GAP-17's denormalized `LastSignInAt__c`. Premature until UI latency demands it.

#### Refined acceptance criteria (binary)

1. **[EOS-5 deliverable; doc-only]** `Cluster__c.OwnerIdentity__c` field-description metadata updated to: *"Subject — whose cluster this is (the identity it was spawned FOR). To find the actor who initiated the spawn, query the `cluster.requested` LedgerEntry row for this Cluster — `LedgerEntry.Sub__c` is the actor. Admin-on-behalf-of spawns are detectable as actor ≠ subject."*
2. **[forward — opportunistic, reopens on trigger]** Add denormalized `Cluster.RequestedByIdentity__c` lookup ONLY when:
   - iris admin cluster-list UI breaches latency budget on the inline LedgerEntry join at production scale, OR
   - A cross-cluster analytics query (e.g., "show all clusters homer spawned for others") drives the denormalization need.
   Until then, the LedgerEntry timeline serves the use case.
3. **[anti-recommendation]** Do NOT rename `OwnerIdentity__c` to disambiguate. The semantic is already "subject"; renaming costs a managed-package metadata change for cosmetic clarity. Field-description metadata is sufficient.

#### Closure dependencies

- **GAP-12** — `cluster.requested` event_type emitted with proper 5-tuple stamping. Without this, the "who spawned" question has no answer regardless of schema design.
- **GAP-21** — `Cluster.Application__c` Lookup completes the three-axis model.

**Olympus-grid agent contribution for EOS-5:** field-description metadata only.

**Steward feedback:** _(reserved)_

---

### GAP-23 — No state-history audit on Cluster transitions (closes through GAP-12; SCOPE-CREEP — trigger framework must be CREATED, not extended)

- **Severity:** 🟠 must-close · expanded scope vs. original triage
- **§9 letter:** A
- **Detected:** 2026-06-27
- **Owner — olympus-grid agent:** CREATE Cluster trigger + handler + Plugin__mdt registration + tests; per-phase event_type emission via Pattern 1
- **Verified inline 2026-06-27:** `Cluster.trigger` ❌ does NOT exist; `ClusterTrgHnd.cls` ❌ does NOT exist; `Plugin.TRG_HND_Cluster.md-meta.xml` ❌ does NOT exist. Unlike Identity / ApplicationProfile, Cluster has NO trigger framework today — this is **create-from-scratch**, not extend.

**Production use case:** Cluster eos-5 lifecycle within this run: Pending (18:00:35) → Provisioning (18:04:47) → Live (18:31:00) → ? (currently non-operational per Steward).

**Empirical evidence:** All four transitions visible only via `Cluster__c.Status__c` current value + `LastModifiedDate` snapshots taken during the run. Zero LedgerEntry rows. Zero history of who/when/why per transition. The Steward had to verbally report "cluster failed because of SendGrid SSM dep" — no audit captures that.

**Why this matters:** Cluster lifecycle audit is foundational for capacity planning, incident analysis, and per-cluster cost attribution. Without state history, every cluster failure investigation starts from scratch.

**Olympus-grid agent triage (2026-06-27)**

Inline investigation surfaced a scope-creep finding: unlike Identity and AP (which both have trigger handlers extending `ISObjectAbstractTriggerHandler`), Cluster has NO trigger framework today. The Cluster side of Pattern 1 work requires **creating scaffolding from scratch**:

| New artifact | Path |
|---|---|
| `Cluster.trigger` | `force-app/applications/default/triggers/Cluster.trigger` |
| `ClusterTrgHnd.cls` + `-meta.xml` | `force-app/applications/default/classes/` |
| `Plugin.TRG_HND_Cluster.md-meta.xml` | `force-app/applications/default/customMetadata/` |
| `ClusterTrgHndTest.cls` + `-meta.xml` | `force-app/applications/default/classes/` (85%+ coverage per olympus-grid quality bar) |

#### Per-phase event_type wiring (mirrors GAP-13 AP pattern)

```apex
public without sharing class ClusterTrgHnd extends ISObjectAbstractTriggerHandler {
    public override String getHandlerName() { return ClusterTrgHnd.class.getName(); }

    public override void onAfterInsert(ISObjectTrigger.TriggerContext ctx) {
        for (SObject sobj : ctx.newList) {
            Cluster__c c = (Cluster__c) sobj;
            LedgerEntryEmitter.emit(
                EventType.CLUSTER_REQUESTED,
                c.Id,
                new Map<String, Object>{
                    'clusterName' => c.ClusterName__c,
                    'runtime' => c.Runtime__c,
                    'region' => c.Region__c,
                    'pantheonVersion' => c.PantheonVersion__c
                }
            );
        }
    }

    public override void onAfterUpdate(ISObjectTrigger.TriggerContext ctx) {
        for (Id id : ctx.newMap.keySet()) {
            Cluster__c oldC = (Cluster__c) ctx.oldMap.get(id);
            Cluster__c newC = (Cluster__c) ctx.newMap.get(id);
            if (oldC.Status__c != newC.Status__c) {
                LedgerEntryEmitter.emit(
                    EventType.CLUSTER_STATUS_CHANGED,
                    newC.Id,
                    new Map<String, Object>{
                        'old' => oldC.Status__c,
                        'new' => newC.Status__c,
                        'reason' => newC.ErrorMessage__c   // surface ErrorMessage on transitions to Failed
                    }
                );
            }
        }
    }
}
```

#### Reconciliation with GAP-21 + GAP-22

- **GAP-21**: `cluster.requested` LedgerEntry stamps `Application__c` from `TransactionContext.actorApplicationId` via Pattern 1. **Invariant**: for user-spawned clusters, `Cluster.Application__c` on the row MUST equal `LedgerEntry.Application__c` on the matching `cluster.requested` row. Unit-test enforces.
- **GAP-22**: actor-vs-subject pattern. System-driven Status transitions (Pantheon health-check writes Status updates) produce LedgerEntry rows with `Sub__c = null` — correct, signals "system transition." User-driven transitions carry the admin's sub. Same pattern as GAP-13 AP transitions.

#### LedgerEntry already has `ClusterId__c` + `ClusterName__c`

Both fields exist on `LedgerEntry__c` today. Pattern 1's emitter populates `ClusterId__c` from `TransactionContext.clusterId` or, when emitting from a Cluster trigger, from the row itself. No additional schema work for cluster attribution on LedgerEntry.

#### Refined acceptance criteria (binary)

1. **Trigger scaffolding created**: `Cluster.trigger` (after-insert + after-update), `ClusterTrgHnd.cls`, `Plugin.TRG_HND_Cluster.md-meta.xml`. Test class with 85%+ coverage per olympus-grid CLAUDE.md quality bar.
2. **`cluster.requested`** emits on after-insert with payload `{clusterName, runtime, region, pantheonVersion}`. 5-tuple stamping per Pattern 1.
3. **`cluster.status.changed`** emits on `Status__c` field change in after-update with payload `{old, new, reason}`. `reason` populated from `ErrorMessage__c` when transitioning to `Failed`; null otherwise.
4. **GAP-21 invariant test**: for user-spawned clusters, `Cluster.Application__c` MUST equal the `LedgerEntry.Application__c` on the matching `cluster.requested` row. Unit test enforces.
5. **System-driven transitions accepted with null `Sub__c`**: when Pantheon / Argos / async provisioner writes Status updates, `Sub__c` on the resulting `cluster.status.changed` row is null. Field-description metadata on `LedgerEntry.Sub__c` documents this carve-out for cluster events.
6. **End-to-end attestation**: spawn a test Cluster, drive Pending → Provisioning → Live. Query `SELECT EventType__c, CreatedDate, Sub__c, Payload__c FROM og_node_beta_1__LedgerEntry__c WHERE Cluster__c = :clusterId ORDER BY CreatedDate ASC`. Expect:
   - 1 row `cluster.requested` (actor's Sub, full 5-tuple, payload with clusterName/runtime/region/pantheonVersion).
   - 1 row `cluster.status.changed` with `{old: "Pending", new: "Provisioning"}`.
   - 1 row `cluster.status.changed` with `{old: "Provisioning", new: "Live"}`.
   - For failure scenarios: row with `new=Failed` + `reason=<ErrorMessage>`.

#### Closure dependencies

- **GAP-12** — `LedgerEntryEmitter` + event-type registry. `cluster.requested` and `cluster.status.changed` already in the GAP-12 §5 list.
- **GAP-21** — `Cluster.Application__c` Lookup landed (invariant test 4 depends on it).

**Steward feedback:** _(reserved)_

---

### GAP-24 — Cluster provisioning hard-depends on SendGrid SSM keys; fails silently (multi-repo; audit half free via GAP-23)

- **Severity:** 🟠 must-close · multi-repo
- **§9 letter:** A
- **Detected:** 2026-06-27
- **Owner (multi-repo):**
  - **zeus agent** — `provision-cluster.sh` failure-handling + SSM pre-flight rationalization + decoupling SendGrid from cluster lifecycle
  - **olympus-grid agent** — none beyond GAP-23 (`ClusterTrgHnd` fires `cluster.status.changed` on Status→Failed automatically; no new event_type needed)

**Production use case:** Spawn cluster `eos-5` (Steward direction 2026-06-27 18:00:35). Zeus runs `provision-cluster.sh` which calls CDK to deploy Pantheon to AWS. Initial run failed because `/olympus/eos-5/keys/SENDGRID_*` SSM keys weren't seeded for the new cluster's namespace.

**Empirical evidence:**

- Cluster row at 18:00:35: `Status="Pending"`
- Cluster row at 18:04:47: `Status="Provisioning"` (script started)
- ~Some time later: provisioning failed (out-of-band, no SF state change)
- Cluster row state during failure: still `"Provisioning"` (stuck)
- Cluster row at 18:31:00: `Status="Live"` (Steward fixed SendGrid SSM dep and re-ran)

Audit footprint of the failure: ZERO. No LedgerEntry, no Logger row, no `Status="Failed"` transition. Only Steward's verbal report indicated the failure happened.

**Why this matters:** Silent failures + no observability = production incidents that take forever to diagnose. For automated provisioning (post-launch), this becomes load-bearing: an unattended provisioner that fails silently with no record means orphaned AWS resources, no alerts, no recovery path.

Additionally, the SendGrid dep itself is out-of-scope for cluster provisioning (per Steward 2026-06-27: *"sendgrid is out of scope of this cycle test but it broke the cluster provision"*) — the provisioner shouldn't be hard-dependent on something the customer doesn't yet need.

**Olympus-grid agent triage (2026-06-27)**

Two structural corrections to the original criteria:

#### Correction 1 — no new event_type; reuse GAP-23's `cluster.status.changed`

The original criterion 2 proposed adding `cluster.provision.failed` to the event-type registry. **Don't.** GAP-23's `ClusterTrgHnd` already emits `cluster.status.changed` whenever `Status__c` flips — including transitions to Failed. The payload `{old: "Provisioning", new: "Failed", reason: ErrorMessage__c}` carries the same information. Adding a parallel event_type bloats the registry without adding semantic value. **Anti-rec: do NOT add `cluster.provision.failed`.**

#### Correction 2 — decouple SendGrid from cluster lifecycle entirely

Per §3.HM Hermes/SendGrid contract (locked 2026-06-15/16), SendGrid is a **per-cluster messaging provider** configured via `Plugin.messaging.Configuration__c.default_provider`. Hermes lazy-initializes the SendGrid client when the first email actually needs to send. A cluster without SendGrid keys is still a functional cluster — it just can't deliver via SendGrid (falls back to Salesforce-native or surfaces a Hermes config error).

Steward direction 2026-06-27 makes this explicit: *"sendgrid is out of scope of this cycle test but it broke the cluster provision."* The fix is **not** "auto-seed sentinel SendGrid values" (the original criterion 4); the fix is **"stop checking SendGrid SSM during provision."** Hermes detects it at first-send-time.

#### Refined acceptance criteria (binary)

1. **[zeus agent]** `provision-cluster.sh` removes hard-dependency on `SENDGRID_*` SSM keys. SendGrid init becomes Hermes's first-email-send concern, not the provisioner's.
2. **[zeus agent]** Provisioner failure-handling: genuine provisioning failures (CDK error, ECS placement failure, missing REQUIRED keys, etc.) write `Cluster__c.Status__c = 'Failed'` + `Cluster__c.ErrorMessage__c = '<specific reason>'` via SF API, then exit non-zero. No more silent stuck-at-Provisioning.
3. **[olympus-grid agent — already covered by GAP-23]** `ClusterTrgHnd` after-update fires `cluster.status.changed` with payload `{old, new: "Failed", reason: ErrorMessage__c}`. **No new event_type added** — Pattern 1 registry stays minimal.
4. **[zeus agent]** SSM pre-flight check for REQUIRED keys only (NOT SendGrid). Required = `COSMOS_LOGOS_*` private keys for the gods, `OG_SIGNING_CERT`. Missing required keys → Status=Failed + ErrorMessage naming the missing paths.
5. **End-to-end test (cluster lifecycle independent of SendGrid)**: spawn a fresh cluster with intentionally-absent SendGrid SSM. Expected outcome:
   - Cluster reaches `Status='Live'` (not stuck, not Failed).
   - LedgerEntry: `cluster.status.changed` rows Pending→Provisioning→Live; NO Failed transition.
   - First email-send attempt post-Live: Hermes surfaces a config error; cluster stays Live.
6. **End-to-end test (genuine failure mode)**: spawn a cluster, manually delete a REQUIRED SSM key mid-deploy. Expected outcome:
   - Cluster transitions `Provisioning → Failed` with `ErrorMessage__c` naming the missing required key.
   - LedgerEntry `cluster.status.changed` row with `{old: "Provisioning", new: "Failed", reason: "<key path>"}`.

#### Closure dependencies

- **GAP-12** — Pattern 1 infrastructure.
- **GAP-23** — `ClusterTrgHnd` framework created; `cluster.status.changed` fires automatically on Status→Failed.
- **Zeus agent work** — provisioner refactor; not blocking on olympus-grid.

**Olympus-grid agent contribution for EOS-5:** none beyond GAP-23. The audit half is automatic once GAP-23's trigger framework lands.

**Steward feedback:** _(reserved — Steward direction 2026-06-27: SendGrid out of scope for cluster provision)_

---

### GAP-25 — `olympus_gpt` static-resource bundle still contains templeathena content (4-way pin update)

- **Severity:** 🟠 must-close · §9.V UI
- **§9 letter:** V
- **Detected:** 2026-06-27 (Steward-confirmed during test)
- **Owner (multi-repo):**
  - **iris agent** — complete templeathena strip in `reactforce/olympus-gpt/src/` + run `publishOlympusGpt`
  - **olympus-grid agent** — update `Plugin.iris_deployment_path_gpt.md-meta.xml` pin + 4-way consistency check + deploy
- **Verified inline 2026-06-27:** static resource exists, Plugin pin = `.dev.uqoj`, templeathena strings still present in `index.html` + `static/js/main.bundle.dev.uqoj.js`

**Production use case:** User navigates to `https://app.olympus-grid.com/gpt` expecting the olympus-gpt console UI. Gets the templeathena UI (Greek "ΕΙΣΕΛΘΕ" — "Enter" — with statue and halo background) instead.

**Empirical evidence:**

- `Plugin.iris_deployment_path_gpt.md-meta.xml` pins `bundleId=".dev.uqoj"` for the `/gpt` path.
- Currently-deployed bundle at `staticresources/olympus_gpt/static/js/main.bundle.dev.uqoj.js` contains templeathena strings (grep hit).
- Last published 2026-06-15 in PR #283 ("ship olympus_gpt bundle .dev.glcb — Temple front door").
- Per memory `project_eos_5_session_handoff_20260619.md`: templeathena strip was attempted but bundle .js reverts left templeathena in. Fix lives in iris React source; `publishOlympusGpt` needs to re-run.

Screenshot confirmation from Steward 2026-06-27.

**Why this matters:** The actual olympus-gpt entry UI is missing in production. Users see the wrong app. For 7/17 launch, gpt is one of the four "children of guardians" surfaces and must present its correct UI.

**Olympus-grid agent triage (2026-06-27)**

Two structural notes the original criteria missed:

#### Note 1 — 4-way consistency, NOT 5-way

The main iris portal release (CLAUDE.md / olympus-616) requires 5-way bundle-id consistency because it has TWO Plugin records (`Plugin.iris.md` main + `Plugin.iris_deployment_app.md` domain override). The `/gpt` path uses **only one Plugin record** (`Plugin.iris_deployment_path_gpt.md`) and therefore has 4 places to keep in sync:

```bash
grep -oE "main\.bundle\.dev\.[a-z]+" iris/reactforce/olympus-gpt/build/index.html
grep -oE "main\.bundle\.dev\.[a-z]+" olympus-grid/force-app/ui/portal/default/staticresources/olympus_gpt/index.html
grep reactBundleId olympus-grid/force-app/ui/portal/default/staticresources/olympus_gpt/app.main.js
grep -oE 'bundleId&quot;:&quot;\.dev\.[a-z]+' olympus-grid/force-app/ui/portal/default/customMetadata/Plugin.iris_deployment_path_gpt.md-meta.xml
```

All four must report identical bundle ID after publish.

#### Note 2 — templeathena strip is half-done in iris source (memory: 2026-06-19 handoff)

Per `project_eos_5_session_handoff_20260619.md`: 4 source files reverted, 2 file deletes staged. **The iris React source still contains templeathena strings.** Running `publishOlympusGpt` against the current iris source produces a new bundle ID that STILL contains templeathena content — re-publish alone does NOT close this gap. The strip MUST complete in iris source first.

#### Refined acceptance criteria (binary)

1. **[iris agent]** Complete templeathena strip in `iris/reactforce/olympus-gpt/src/`. Verify: `grep -lE "templeathena|TempleAthena|ΕΙΣΕΛΘΕ" iris/reactforce/olympus-gpt/src/ -r` returns 0 results.
2. **[iris agent]** Run `cd iris && npm run publishOlympusGpt`. Capture the new bundle ID (format `main.bundle.dev.<8char>`).
3. **[olympus-grid agent]** Update `Plugin.iris_deployment_path_gpt.md-meta.xml` `bundleId` value (inside the JSON-encoded `Configuration__c` value) to match the new ID. Same PR as the static-resource delta from iris's publish step.
4. **4-way consistency check** by the grep commands above — all four locations report identical bundle ID. Block PR merge if any disagree.
5. **Content grep verifies strip on built artifact**: `grep -lE "templeathena|TempleAthena|ΕΙΣΕΛΘΕ" olympus-grid/force-app/ui/portal/default/staticresources/olympus_gpt -r` returns 0 results post-publish.
6. **Production verification**: visit `https://app.olympus-grid.com/gpt`, hard-refresh. UI shows olympus-gpt console landing, NOT temple of Athena. Steward visual confirmation.
7. **Deploy targets**: scratch (`dev_enterprise`) for verification first via `sf project deploy start --source-dir olympus-grid/force-app/ui/portal/default/staticresources/olympus_gpt --source-dir olympus-grid/force-app/ui/portal/default/customMetadata/Plugin.iris_deployment_path_gpt.md-meta.xml --target-org dev_enterprise --ignore-conflicts`; alpha-org via the standard managed-package release path OR fast-track `deployAlphaOlympusGpt` (if exists) with explicit @alchemisthomer approval per olympus-616/CLAUDE.md.

#### Closure dependencies

None — standalone gap.

#### Olympus-grid agent contribution

- Plugin pin update + 4-way consistency verification + scratch/alpha deploy.

**Steward feedback:** _(reserved — confirmed 2026-06-27: bundle is the pre-strip version)_

---

### GAP-26 — iris portal Application filter dropdown is hardcoded, not driven by `Application__c` SOQL (Apex route already exists; pure iris-side fix)

- **Severity:** 🟠 must-close · §9.V
- **§9 letter:** V (admin UI)
- **Detected:** 2026-06-27
- **Owner (multi-repo):**
  - **iris agent** — React refactor: remove hardcoded list (including stale `templeathena`); consume `GET /v1/app/admin/applications`
  - **olympus-grid agent** — verify route returns expected shape; no Apex change needed
- **Verified inline 2026-06-27:** `ApiRouteApplicationAdmin.listApplications()` already exists at `force-app/applications/default/classes/ApiRouteApplicationAdmin.cls`. Route `GET /v1/app/admin/applications` registered via `Plugin.v1_app_admin.md-meta.xml`. Returns `Application__c` rows filtered by `Active__c = true`. Iris just needs to consume it.

**Production use case:** iris admin navigates to "Core Plugins" → Application filter dropdown. Should show the currently-deployed Application__c records.

**Empirical evidence:** Dropdown shows 5 options: `guardians`, `iris`, `olympus-gpt`, **`templeathena`**, `turtleshell` — all with "waitlist" badges. The alpha-org `Application__c` table contains 4 rows: iris, guardians, olympus-gpt, turtleshell. **`templeathena` exists in the dropdown but NOT in the SObject table** — proving the dropdown is hardcoded.

```
sf data query "SELECT og_node_beta_1__AppKey__c FROM og_node_beta_1__Application__c" --target-org alpha-org
→ Returns: iris, guardians, olympus-gpt, turtleshell  (4 rows; NO templeathena)
```

**Why this matters:** When a new application is added to the platform (or removed), the admin UI doesn't reflect it. For a system designed to onboard new third-party apps (AIAAS demonstration via builtsy), this is a friction point. The user can also select "templeathena waitlist" and see 0 results, never approve anything — confusing UX.

**Olympus-grid agent triage (2026-06-27)**

Apex side is already done. The Apex route `GET /v1/app/admin/applications` exists, returns `Application__c WHERE Active__c=true`, and is registered via `Plugin.v1_app_admin.md`. The "templeathena" entry in the dropdown is a stale hardcoded string in iris React — it has never been in the SObject (seed scripts only ever wrote iris/guardians/olympus-gpt/turtleshell on alpha; +builtsy on dev).

#### Anti-rec — don't audit this query

Admin reads of the application catalog are low-sensitivity (just "what apps exist") and high-frequency (dropdown loads on every admin page render). A `LedgerEntry` per query would be noise. **Do NOT add `auth.applications.listed` to the Pattern 1 registry.** The Ares `api.inbound` row on `/v1/app/admin/applications` already captures the event at the network level — sufficient for any "is someone probing the admin endpoints" detection later.

#### Forward-pointer to GAP-08

Post-GAP-08, the list could be filtered by what the caller's Application is permitted to see (per-app admin scoping: builtsy-scoped admins see only builtsy apps; iris admins see all). For EOS-5, every authenticated admin sees the full `Active__c=true` list — no per-app filtering. GAP-08 forward-work could add `WHERE Id IN :allowedAppIds` sourced from JWT `cid` permitted-apps set. Not in scope here.

#### Refined acceptance criteria (binary)

1. **[iris agent]** iris admin React component calls `GET /v1/app/admin/applications` via Ares; removes hardcoded list including stale `templeathena`.
2. **[iris agent]** Dropdown populated dynamically. Each option shape: `{ id: Application__c.Id, appKey: og_node_beta_1__AppKey__c, name: Name }`.
3. **[olympus-grid agent]** Verify `ApiRouteApplicationAdmin.listApplications()` payload shape matches iris's consumer expectations during integration test. Expected outcome: no Apex change needed.
4. **Test (alpha-org baseline)**: dropdown shows 4 options (iris, guardians, olympus-gpt, turtleshell). No templeathena.
5. **Live-update test (proves SOQL-driven, not hardcoded)**: insert a 5th `Application__c` row in alpha (e.g., `AppKey__c='builtsy'`). Refresh iris admin UI without code change — dropdown shows 5 options including builtsy.
6. **Anti-test (templeathena fully expunged from iris source)**: `grep -lE "templeathena|TempleAthena" iris/reactforce/portal/src/ -r` returns 0 results post-fix.

#### Closure dependencies

None — standalone. Apex side already done.

#### Olympus-grid agent contribution

- Sanity-check `listApplications()` payload shape during iris integration test.
- No Apex change expected.

**Steward feedback:** _(reserved)_

---

### GAP-27 — No app-scoped admin role (SuperAdmin is global only) — shape LOCKED on the GAP-08 junction

- **Severity:** 🟡 defer · §7 (architectural shape locked; field + audit work belongs to a post-GAP-08 cycle)
- **§9 letter:** §7
- **Detected:** 2026-06-27
- **Owner — olympus-grid agent:** documentation only for EOS-5; full implementation defers to a post-GAP-08 cycle (likely with republic-616 governance)

**Production use case:** Granting "homer is admin on iris but not on gpt." Currently impossible — `Identity.SuperAdmin__c` is a global boolean.

**Empirical evidence:** Schema inspection: `Identity__c.SuperAdmin__c` is the only admin field. No per-AP `IsAdmin__c`, no role table. When Steward granted SuperAdmin to homer at 17:41:33 it took effect across all 4 apps automatically.

**Why this matters:** For multi-tenant SaaS where Application Owners need to admin their own users without seeing the platform-wide control plane.

**Olympus-grid agent triage (2026-06-27)**

The natural home for per-app role is the **ApplicationProfile junction (GAP-08)**. Post-GAP-08:

```
ApplicationProfile__c
├── Identity__c        (Master-Detail to Identity)
├── Application__c     (Master-Detail to Application)
├── AccountStatus__c   (existing — Waitlist/Approved/Active/...)
├── Role__c            (NEW: 'Owner' | 'Admin' | 'Member' | 'ReadOnly')
└── ProfileData__c     (existing per-app extensible JSON)
```

Per-app role check then becomes a one-line SOQL against the junction; combined with JWT `cid` claim binding (also from GAP-08), every authenticated request resolves to exactly one `ApplicationProfile.Role__c` — the caller's per-app authority.

#### SuperAdmin stays as the global escape hatch

`Identity.SuperAdmin__c` is NOT replaced. It remains the **platform-level admin role** (Steward + future republic-616 delegated platform admins). Per-app `Role__c` is for Application Owners administering their own user pools.

| Authority axis | Field | Concern |
|---|---|---|
| Global platform | `Identity.SuperAdmin__c` (existing) | Rare. Audited per GAP-15 (`identity.privilege.granted/revoked`). |
| Per-app | `ApplicationProfile.Role__c` (new, post-GAP-08) | Common. Audited via new `profile.role.changed` event_type. |

#### Pattern 1 hook ready

When the role-per-app cycle opens, audit is one event_type registration + one trigger-handler block. Mirrors GAP-13's `profile.status.changed` shape verbatim:

```apex
if (oldRow.Role__c != newRow.Role__c) {
    LedgerEntryEmitter.emit(
        EventType.PROFILE_ROLE_CHANGED,
        newRow.Id,
        new Map<String, Object>{
            'old' => oldRow.Role__c,
            'new' => newRow.Role__c,
            'subjectIdentityId' => newRow.Identity__c
        }
    );
}
```

#### Refined acceptance criteria (binary)

1. **[defer for EOS-5; doc-only]** `Identity.SuperAdmin__c` field-description metadata clarifies the limitation: *"Global platform-level admin authority across all Applications. Per-app admin scoping ('homer is admin on iris but not on gpt') requires the post-GAP-08 ApplicationProfile.Role__c field; deferred to a future cycle."*
2. **[forward — shape LOCKED]** Per-app role lives on `ApplicationProfile.Role__c` (picklist on the GAP-08 junction). Documented here so the future cycle doesn't redesign as a new SObject / related list / separate role table / permset-per-app.
3. **[forward — Pattern 1 prep]** Add `profile.role.changed` event_type to GAP-12 registry; fire from `ApplicationProfileTrgHnd` on `Role__c` field change. One event_type + one trigger block. Audit automatic via Pattern 1.
4. **[anti-rec]** Do NOT replace `Identity.SuperAdmin__c` with role-per-app. Two coexist: SuperAdmin = global platform; Role__c = per-app. Different concerns, different audit footprints, different governance paths.

#### Closure dependencies

- **GAP-08** — ApplicationProfile must be a true junction. Cannot land per-app role until the junction is real.
- **GAP-12** — Pattern 1 + `ApplicationProfileTrgHnd` extended (GAP-13 already covers AP trigger framework).

#### Olympus-grid agent contribution for EOS-5

Field-description metadata text update on `Identity.SuperAdmin__c` only.

**Steward feedback:** _(reserved)_

---

### GAP-28 — `Identity.PrimaryCause__c` missing (BLOCKER for §9.T) — Option A is the only sound choice

- **Severity:** 🔴 BLOCKER · §9.T tithe attribution fail-closed
- **§9 letter:** T (tithe attribution)
- **Detected:** 2026-06-27
- **Owner — olympus-grid agent:** schema (`Identity.PrimaryCause__c` Picklist) + onboarding apex wiring + tithe-trigger read + migration script + Pattern 1 `identity.cause.changed` audit hook
- **Architectural decision (Task #2):** **Option A — Identity-level only**. My agent vote: B and C both lose at tithe time. Steward to confirm.

**Production use case:** During app-specific onboarding (e.g., gpt or turtleshell), user picks a cause from the cosmic-7 list ("Save the Oceans", "Clean Water for All", "Healthcare", etc.). When a payment lands later, the tithe trigger snapshots the user's cause for tithe attribution.

**Empirical evidence:**

`AP-00091.ProfileData__c` (gpt) after onboarding:
```json
{ "cause": "Save the Oceans", "onboardingComplete": true }
```

`AP-00092.ProfileData__c` (turtleshell) after onboarding:
```json
{
  "configuredGuides": ["athena"],
  "username": "homer",
  "displayName": "homer",
  "cause": "Clean Water for All",
  "guideAgent": "athena",
  "profilePublic": false,
  "onboardingComplete": true
}
```

**Same Identity (homer), two contradictory causes.** Empirical proof that per-AP storage allows incoherent per-user state.

Canonical read path per memory `project_tithe_trigger_is_payment_event_not_consumption.md`:
> *"$10 revenue → $0.70 tithe-attribution row written immediately with `Cause__c` = user's `Identity__c.PrimaryCause__c` snapshot"*

Empirical query for the canon-read field:
```
sf data query "SELECT og_node_beta_1__PrimaryCause__c FROM og_node_beta_1__Identity__c" --target-org alpha-org
ERROR: No such column 'og_node_beta_1__PrimaryCause__c' on entity 'og_node_beta_1__Identity__c'
```

**Triple-broken:**
1. Canonical read field doesn't exist on schema
2. Onboarding writes to AP.ProfileData.cause (per-app, divergent per-app)
3. Tithe attribution code (if it ran today) would read null Identity.PrimaryCause and write a tithe row with no Cause attribution

**Why this matters:** Tithe attribution is the heart of EOS-5. Cosmic-7 royalty disbursement depends on knowing which cause each user picked. If the tithe row's Cause__c column is null, no disbursement can be calculated, the 7% never reaches the intended cause. **The system would silently fail to give money to the people it promised to give money to.**

**Olympus-grid agent triage (2026-06-27)**

#### Why Option A is structurally the only sound choice

The §9.T canon (memory `project_tithe_trigger_is_payment_event_not_consumption.md`, locked 2026-06-15) and the later "7% tithe is of builtsy USER" lock (memory `project_eos_5_canonical_attestation_and_spine.md`) define tithe attribution as **user-level, single-axis**. One Identity → one PrimaryCause → one disbursement target.

| Option | Failure mode at tithe time |
|---|---|
| **A — Identity-level only** | None at tithe time. Onboarding UX must surface prior-selection on second-surface signup (pre-fill + "Keep, or change for all apps?"). |
| **B — AP-level only** | When user has divergent AP.cause across apps (homer's empirical case: "Save the Oceans" on gpt vs "Clean Water for All" on turtleshell), tithe trigger has no principled way to choose. Either requires per-payment Application origin (only cryptographic post-GAP-08), or fail-closed silent drop. |
| **C — Hybrid (Identity default + AP override)** | Hides ambiguity behind a fallback; divergence-detection problem identical to B. |

#### The Option-A UX wrinkle (not a reason to reject A)

If onboarding on a second surface silently overwrites `Identity.PrimaryCause__c`, users who think "I picked X for gpt and Y for turtleshell" are surprised. **Fix in onboarding UI**, not schema: pre-fill the cause picker with existing `Identity.PrimaryCause__c`, surface *"You previously selected Save the Oceans for your giving. Keep this, or change for all apps?"* Explicit user choice. No silent overwrite.

#### Reconciliation with Pattern 1 (GAP-12)

New event_type for the registry: `identity.cause.changed`. Fires from `IdentityTrgHnd` after-update guarded by `oldRow.PrimaryCause__c != newRow.PrimaryCause__c`. Payload: `{old, new, source}` where `source` names the surface that drove the change (`onboarding:turtleshell`, `migration`, `admin-edit`, etc.). 5-tuple stamping per Pattern 1.

#### Reconciliation with GAP-08

Post-GAP-08, the ApplicationProfile junction does NOT fragment the cause. Per-app `ProfileData.cause` either deprecates entirely or is repurposed as an audit-only "what cause did user pick at first onboarding on THIS app" record. **Single source of truth at tithe time = `Identity.PrimaryCause__c`.**

#### Cosmic-7 + fail-closed at tithe

Picklist values = the 7 canonical causes + (optional) `"Not Yet Selected"` placeholder for users who skip onboarding. **Tithe attribution on a payment with `PrimaryCause__c IN (null, "Not Yet Selected")` MUST fail-closed**: write tithe LedgerEntry with `Cause__c = null` AND emit `tithe.attribution.deferred` so the disbursement engine can re-attribute when cause is later picked. **Do NOT silently route 7% to a default cause** — that violates the user's explicit "did not yet choose" state.

#### Migration of existing divergent data

Homer has `AP-00091.ProfileData.cause = "Save the Oceans"` (gpt) AND `AP-00092.ProfileData.cause = "Clean Water for All"` (turtleshell). Migration rules:

1. Identity has exactly one AP with cause → write that to `Identity.PrimaryCause__c`.
2. Multiple APs with agreeing causes → write the agreed value.
3. Multiple APs with divergent causes → set `Identity.PrimaryCause__c = null` AND emit `migration.cause.divergent` LedgerEntry naming both. Next signin on any surface triggers a divergence-resolution UI prompt.
4. Homer specifically (Steward = subject) — Steward picks one in the migration script directly. No UI prompt needed for the pre-Pattern-1 row.

#### Refined acceptance criteria (binary)

1. **[architectural commit]** Steward confirms Option A. (Agent vote: A.)
2. **[schema]** `Identity__c.PrimaryCause__c` Picklist field exists with cosmic-7 values + optional placeholder. FLS granted to `Olympus_Grid_Admin` in the same PR (per 2026-05-30 FLS rule).
3. **[Apex onboarding]** Onboarding handler writes the picked cause to `Identity.PrimaryCause__c`. `AP.ProfileData.cause` deprecates or stays audit-only.
4. **[Apex tithe trigger]** Payment-event handler reads `Identity.PrimaryCause__c`. Null/placeholder → emits `tithe.attribution.deferred` LedgerEntry; does NOT silently route to default.
5. **[Pattern 1 audit hook]** `identity.cause.changed` event_type added to GAP-12 registry; fires from `IdentityTrgHnd` after-update with `PrimaryCause__c` field-change guard.
6. **[end-to-end test]** New user signs up → picks "Healthcare" on turtleshell onboarding → signs in on gpt → fires payment event → tithe LedgerEntry has `Cause__c = "Healthcare"` (NOT null, NOT "Save the Oceans," NOT "Clean Water for All").
7. **[divergence-handling test]** Homer's existing pre-migration state: divergence-resolution UI on next signin surfaces both prior selections and asks user to pick one for all apps. `Identity.PrimaryCause__c` set; subsequent payment events attribute correctly.
8. **[migration script]** One-off Apex run-once script walks every Identity, applies migration rules. Logs row counts per outcome (one-AP, agreed-multi-AP, divergent-multi-AP, no-AP-with-cause). Idempotent.
9. **[fail-closed verification]** Manually clear `Identity.PrimaryCause__c` on a test user, fire a payment event. LedgerEntry: `tithe.attribution.deferred` event with payload identifying user + unrouted amount. Disbursement engine recomputes when cause is later set.

#### Closure dependencies

- **Steward architectural commit on Option A** — load-bearing decision; no code starts until locked.
- **GAP-12** — `identity.cause.changed` event_type registry entry + `IdentityTrgHnd` extension. Also `tithe.attribution.deferred` may need its own event_type — TBD when the Plutus side of §9.T lands.
- **No GAP-08 dependency** for the Identity field itself; the schema work is independent.

**Steward feedback:** _(reserved — Task #2 parked; agent recommendation = Option A)_

---

### GAP-29 — IdentityToken__c minted ×8 for one signin event (operational hygiene; per-signin count is by design, accumulation is the real gap)

- **Severity:** 🟡 defer · operational hygiene
- **§9 letter:** — (no §9 letter; the per-signin token count is documented protocol, not a bug)
- **Detected:** 2026-06-27
- **Owner — olympus-grid agent:** field-description metadata for EOS-5 (doc-only); cleanup-job batch deferred to a future operational-hygiene cycle
- **Verified inline 2026-06-27:** `IdentityToken__c.TokenType__c` is a restricted picklist (`verification` / `auth_request` / `access` / `refresh`); `ValidUntil__c` has 1-hour TTL default. **NO scheduled cleanup job exists** — rows accumulate forever. Revocation logic (`t.ValidUntil__c = DateTime.now()`) marks tokens expired but doesn't delete them.

**Production use case:** Signing in to a surface should mint some number of `IdentityToken__c` rows. We saw 8 per signin in the gpt console signin — high number.

**Empirical evidence:**

| Event | IdentityToken count before | after | delta |
|---|---|---|---|
| Pre-test | — | 0 | — |
| After gpt email signin + onboarding | 0 | 8 | +8 |
| After turtleshell-web Apple signin | 8 | 10 | +2 |
| After turtleshell-web email signin | 10 | 13 | +3 |
| After turtleshell-ios Apple signin | 13 | 15 | +2 |
| After turtleshell-ios email signin | 15 | 18 | +3 |
| After guardians-iOS Apple signin | 18 | 20 | +2 |
| After guardians-iOS email signin | 20 | 23 | +3 |

Pattern: Apple SIWA mints **2** per signin; email-link mints **3** per signin. The gpt initial signin minted **8** — anomaly explained by the gpt console doing more initial work (multiple service-token mints during onboarding + agent + key generation).

**Why this matters:** Token rows accumulate quickly (~5 per signin per active user). For trillion-dollar throughput with many users, the table grows large. Unknown if tokens are TTL-cleaned. Unknown what each token is for.

**Olympus-grid agent triage (2026-06-27)**

Inline investigation resolved both original questions:

#### Per-signin token counts are documented protocol (NOT a bug)

| Auth method | Tokens minted | Composition |
|---|---|---|
| Apple SIWA | 2 | `access` + `refresh` (no `verification` — Apple's assertion IS the verification) |
| Email-link | 3 | `verification` (magic code) + `access` + `refresh` |
| gpt initial onboarding | 8 | One-time burst: 2-3 signin tokens + service-token mints (athena handle, MCP servers). Not a per-signin recurrence — happens only on first onboarding. |

#### TTL exists, cleanup does NOT

- `IdentityToken__c.ValidUntil__c` default = `NOW() + (1/24)` (1 hour) ✅
- No scheduled cleanup job found ❌
- `ApiRouteApplicationAuth.cls` has revocation (mark token expired) but no row deletion

**Rows accumulate forever.** At trillion-dollar pipeline scale: ~5 tokens/signin × N DAU × 365 = N × 1825 rows/year per user. 100k DAU = 182.5M rows/year. Salesforce per-org limits + query-selectivity degradation hit around the 10M-row mark.

#### Anti-rec: do NOT add a per-token-mint event_type to Pattern 1

Token mints are auditable state transitions but **not individually worth a LedgerEntry row** — they're a noisy by-product of every signin, already implicitly captured by GAP-19's `auth.email.verify_succeeded` and `auth.apple.verify_succeeded` event types. Adding `identity.token.minted` would double LedgerEntry volume for zero new attribution information.

The `verification` token (magic code) overlap with GAP-19's `auth.email.request_sent` event is intentional — GAP-19 captures the security-sensitive fact. **Stick with GAP-19; don't add parallel token-mint events.**

#### Refined acceptance criteria (binary)

1. **[EOS-5 deliverable; doc-only]** `IdentityToken__c.TokenType__c` field-description metadata documents purpose per value:
   - `verification` — magic-link code; consumed once on `/verify`; 1-hour TTL.
   - `auth_request` — pending auth-request placeholder; consumed on completion.
   - `access` — JWT access token; 1-hour TTL by default; refreshable.
   - `refresh` — refresh token for renewing access; longer TTL.
2. **[EOS-5 deliverable; doc-only]** `IdentityToken__c.ValidUntil__c` field-description metadata documents the TTL contract + accumulation caveat: *"Token invalid after this DateTime. Expired rows are NOT auto-deleted; a scheduled cleanup job is planned for a future operational-hygiene cycle."*
3. **[forward — future operational-hygiene cycle]** Add `IdentityTokenCleanupJob` (Schedulable + Batchable) that deletes rows where `ValidUntil__c < NOW() - 30 days` (30-day forensic retention window). Runs daily. Logs `system.cleanup.identity_tokens` LedgerEntry with row count deleted. **NOT in EOS-5 scope.**
4. **[anti-rec, explicit]** Do NOT add `identity.token.minted` to Pattern 1 registry. Per-signin doubling of LedgerEntry rows with zero new attribution. The signin event_types already cover token-mint provenance.
5. **[anti-rec, explicit]** Do NOT delete `ApiRouteApplicationAuth.cls` revocation logic (`t.ValidUntil__c = DateTime.now()`). That's active-token revocation — a different concern from expired-row cleanup.
6. **[future test, once cleanup job lands]** Insert 1000 rows with `ValidUntil__c = NOW() - 31 days`. Run cleanup job. Verify all 1000 deleted; LedgerEntry `system.cleanup.identity_tokens` carries `{rowsDeleted: 1000}`.

#### Closure dependencies

None for EOS-5 (defer). Future cleanup-job work is standalone — no Pattern 1 / GAP-08 / GAP-12 dependency.

#### Olympus-grid agent contribution for EOS-5

Field-description metadata text updates only. No schema change, no Apex.

**Steward feedback:** _(reserved)_

---

### GAP-30 — Cosmos-logos handshake asymmetric across surfaces — client-side; server already serves uniformly

- **Severity:** 🟡 defer · awaiting Steward intent commit
- **§9 letter:** §3 NFR (cryptographic agent verification)
- **Detected:** 2026-06-27
- **Owner (multi-repo, conditional on Steward intent):**
  - **iris agent** — iris + gpt React handshake (if mandatory)
  - **cosmos-logos/turtleshell-ios agent** — handshake via apple-cryptokit (if mandatory)
  - **omens agent** — guardians-iOS handshake via apple-cryptokit (if mandatory)
  - **olympus-grid agent — NONE beyond server-side manifest** (already verified working)

**Production use case:** Per CLAUDE.md "Cosmos-Logos Protocol", every god service exposes `/.well-known/cosmos-logos.json` and clients perform X25519 sealed-box handshake to verify agent identity before authenticating users.

**Empirical evidence:**

| Surface | Cosmos-logos handshake fired per signin? |
|---|---|
| iris | NO |
| olympus-gpt | NO |
| turtleshell-web | YES (per session — observed at 18:29:34 pre-Apple-signup and 18:46:58 pre-email-signin) |
| turtleshell-ios | NO |
| guardians-iOS | NO |

Only turtleshell-web fetches `/v1/athena/.well-known/cosmos-logos.json` before authenticating. Other surfaces skip the cryptographic agent verification entirely.

**Why this matters:** If the cosmos-logos handshake is a security guarantee (it is, per CLAUDE.md design), then surfaces that skip it have weaker security posture. Either: (a) the handshake should be mandatory and other surfaces need to add it, OR (b) the handshake is opt-in and surfaces have equivalent guarantees (e.g., baked-in pinned manifest).

**Olympus-grid agent triage (2026-06-27)**

#### Scope correction — this is client-side, not server-side

Cosmos-logos handshake is a **client-initiated protocol**: clients fetch the manifest + perform sealed-box verify. The server-side responsibility (serving `/.well-known/cosmos-logos.json` + handling envelope-verify) is **already proven working** by turtleshell-web's successful handshake at 18:29:34. The asymmetry is entirely in **client implementations** — iris, gpt, turtleshell-ios, guardians-iOS skip the handshake. Olympus-grid has nothing to fix.

#### The intent question (load-bearing — Steward must commit)

| Stance | Implication |
|---|---|
| **Mandatory** | Every client surface MUST handshake before authenticating. Skipping = non-conforming. |
| **Opt-in with equivalence** | Surfaces with equivalent trust guarantees (TLS pinning + app integrity, in-SF trust zone) can skip; equivalence documented explicitly. |

Agent framing (not a recommendation): mandatory for hostile-network surfaces (turtleshell-offgrid, mobile in arbitrary networks); opt-in-with-equivalence for in-SF surfaces (iris inside Salesforce TLS termination) and trusted-TLS surfaces. **This is a security-posture commitment with §3 NFR downstream effects — Steward call.**

#### Reconciliation with GAP-19 (Ares perimeter)

Cosmos-logos handshake is **distinct from Ares perimeter**:

| Protocol | What it proves |
|---|---|
| Ares perimeter (§3.AR) | The request reached the right cluster; rate limits applied; policy overlay enforced |
| Cosmos-logos handshake | The GOD service inside that cluster is the expected one (cryptographic identity proof) |

Both apply together. For mobile/off-grid (hostile network), both matter — Ares perimeter assumes the client trusts the path; cosmos-logos removes that assumption.

#### Reconciliation with apple-cryptokit envelope

Per olympus-616/CLAUDE.md, iOS uses `format: "apple-cryptokit"` (ECDH + HKDF + ChaCha20-Poly1305). Both Athena and Poseidon support this via `cryptokit-unseal.js`. iOS surfaces have **server-side support** — they just need client-side handshake code.

#### Refined acceptance criteria (binary)

1. **[Steward decision required first]** Commit to one stance: mandatory or opt-in-with-equivalence.
2. **[olympus-grid agent — already done]** Server-side manifest endpoint + envelope-verify endpoint work. Turtleshell-web's successful handshake confirms. No olympus-grid work needed.
3. **[if mandatory; multi-repo client work]**:
   - **iris agent** — handshake in iris React before first authenticated request.
   - **iris agent (gpt sibling)** — same for gpt.
   - **cosmos-logos/turtleshell-ios** — handshake via apple-cryptokit envelope.
   - **omens (guardians-iOS)** — handshake via apple-cryptokit envelope.
4. **[if opt-in; documentation deliverable per surface]**:
   - iris: *"Inside Salesforce Experience Cloud TLS termination + Lightning trust zone — equivalent to handshake-verified."*
   - turtleshell-ios: *"TLS pinning + Apple app integrity attestation — equivalent."*
   - guardians-iOS: same as turtleshell-ios.
   - turtleshell-offgrid: ❗ **NO equivalence path; MUST do handshake** (potentially hostile network). Non-negotiable per the offgrid threat model.
5. **[end-to-end test, if mandatory]** Sign in to each of iris, gpt, turtleshell-web, turtleshell-ios, guardians-iOS. Verify `/v1/athena/.well-known/cosmos-logos.json` fetched + envelope-verify POSTed per signin on each surface.

#### Closure dependencies

- **Steward intent commit** — load-bearing decision. No implementation starts until locked.

#### Olympus-grid agent contribution for EOS-5

None beyond confirming server-side already serves uniformly (already verified).

**Steward feedback:** _(reserved — intent commit needed)_

---

### GAP-31 — gpt background polling — attestation-tooling concern, not a code defect

- **Severity:** 🟡 defer · info (NOT olympus-grid territory)
- **§9 letter:** — (operational/reporting hygiene, no §9 letter)
- **Detected:** 2026-06-27
- **Owner — EOS agent** (attestation report-generation tooling; categorizes Path__c at query time)
- **Olympus-grid agent contribution: NONE.** This gap doesn't touch olympus-grid code paths.

**Production use case:** Test user signs in to gpt, completes onboarding, leaves the tab open. Steward then tests other surfaces. gpt tab keeps polling.

**Empirical evidence:** From signin at 18:25 to end of run at ~19:45, gpt console polled `/v1/plutus/quota/<homer-sub>` approximately every 30-60 seconds, accumulating ~20 quota-poll LedgerEntries. These were noise in the LedgerEntry stream when analyzing other surfaces' activity.

**Why this matters:** Not a defect per se — quota polling is intentional. But for attestation reports that look at "LedgerEntries fired during test X", the background polls need to be filtered out or correctly attributed to "gpt background activity."

**Olympus-grid agent triage (2026-06-27)**

Background quota polling on `/v1/plutus/quota/<sub>` is **intentional design** — Plutus rollups depend on the client periodically pulling its current spend balance. The gap is purely about **report-side signal-vs-noise** when reading LedgerEntry rows during attestation analysis.

#### Where the fix actually lives — report-side, not emit-side

```sql
-- Attestation report classifies at query time:
SELECT EventType__c, Path__c, COUNT(Id),
       CASE WHEN Path__c LIKE '/v1/plutus/quota/%' THEN 'background-polling'
            WHEN Path__c LIKE '/v1/auth/%'         THEN 'auth-event'
            WHEN Path__c IS NULL                    THEN 'apex-emitted'
            ELSE 'foreground-action' END AS Class
FROM og_node_beta_1__LedgerEntry__c
WHERE Sub__c = :testUserId AND CreatedDate >= :testStartTime
GROUP BY EventType__c, Path__c, Class
```

Reports surface `foreground-action` rows as primary attestation evidence; `background-polling` rows as filterable noise footnote.

#### Refined acceptance criteria (binary)

1. **[defer for EOS-5; EOS agent owns]** Attestation report-generation tooling categorizes LedgerEntry rows by `Path__c` into `foreground-action` / `auth-event` / `background-polling` / `apex-emitted`. Reports surface foreground as primary; background as filterable noise.
2. **[anti-rec, explicit]** Do NOT suppress quota-poll LedgerEntries at Ares emit time. They are §9.A audit data; suppressing destroys auditability for report ergonomics. Bad tradeoff.
3. **[anti-rec, explicit]** Do NOT stop the polling. Quota UI depends on it.
4. **[anti-rec, explicit]** Do NOT add Path__c-prefix filter logic to Ares emit code. Cross-cutting concern at the wrong layer.

#### Closure dependency

EOS-attestation report tooling — owned by EOS agent, not olympus-grid.

#### Olympus-grid agent contribution for EOS-5

None.

**Steward feedback:** _(reserved)_

---

### GAP-32 — Apple SIWA reliability is external — NFR documentation + opportunistic Pattern 1 hook

- **Severity:** 🟡 defer · NFR documentation
- **§9 letter:** §3.AP NFR (Apple Sign-In Availability)
- **Detected:** 2026-06-27 (Steward incognito session failure)
- **Owner — olympus-grid agent:** §3 NFR contract doc + `auth.apple.verify_failed` event_type forward-hook (symmetric with GAP-19's email-side)

**Production use case:** User attempts Apple SIWA. Apple's auth page can fail (password rejection, 2FA challenge mismatch, anti-abuse signals, rate limits) — failures happen on Apple's domain, no token returned, our system sees nothing.

**Empirical evidence:** Steward attempted Apple SIWA on turtleshell-web in an incognito browser session 2026-06-27. Apple rejected with "Failed to verify your identity. Try again." No token returned to turtleshell-web. Backend saw zero — no LedgerEntry, no Identity update, no attempt log. Steward had to switch to a non-incognito session for it to work.

**Why this matters:** Sign-in reliability is bounded by Apple's availability + anti-abuse policies. Cannot be guaranteed by our system. If 7/17 demos rely on Apple SIWA succeeding, we need a fallback documented (email-link is the natural fallback, but per GAP-19 that path is invisible too).

**Olympus-grid agent triage (2026-06-27)**

#### 4-mode visibility table

| Failure mode | Visibility |
|---|---|
| User cancellation (Apple redirects back with `?error=user_cancelled_authorize`) | ✅ Visible to our client |
| Apple anti-abuse / "Failed to verify identity" (incognito case) | ❌ Stays on Apple's domain |
| Password rejection / 2FA failure | ❌ Stays on Apple's domain |
| Apple service outage | ❌ Request never makes it |

**Only user-cancellation is capturable. 3 of 4 modes are genuinely invisible.** The NFR contract documents the bound; email-link is the fallback for the invisible failure region.

#### Pattern 1 reconciliation — symmetric with GAP-19's email-side

`auth.apple.verify_failed` event_type added to Pattern 1 (mirrors GAP-19's `auth.email.verify_failed`). Two sources fire it:

| Source | When | Payload |
|---|---|---|
| Client-error capture endpoint (`POST /v1/auth/apple/client-error`) | Client receives `?error=` param from Apple redirect | `{source: 'apple-redirect', reason: 'user_cancelled_authorize'}` |
| Server-side verification path | Apple returned `id_token` but signature/audience/etc. verification failed | `{source: 'server-verify', reason: '<verification-error>'}` |

**Don't add `auth.apple.cancelled` as a separate event** — it's a sub-case of `auth.apple.verify_failed`. Symmetric vocabulary across auth methods keeps the registry small.

#### Anti-rec — don't try to capture the invisible

No reliable browser-side signal exists for anti-abuse / password-rejection / outage failures. Heartbeats, timeout instrumentation, "Apple unreachable" probes add complexity without reliable signal. **NFR documents the bound; users fall back to email-link.** Operational answer beats heroic instrumentation.

#### Refined acceptance criteria (binary)

1. **[EOS-5 deliverable; doc-only]** §3 NFR contract documents Apple SIWA dependency with the 4-mode visibility table above. Email-link explicitly named as the fallback.
2. **[multi-repo, UX, EOS-5]** Surface frontends (iris, gpt, turtleshell-web/ios, guardians-iOS) present "Sign in with Email" as equal-weight option alongside "Sign in with Apple." Users hitting invisible Apple failure fall back without leaving the surface.
3. **[forward — depends on GAP-19's `auth.email.verify_failed` shipping]** Add `auth.apple.verify_failed` to Pattern 1 registry. Two firing sources documented above. Client-error capture endpoint (`POST /v1/auth/apple/client-error`) added to consume `?error=` param.
4. **[anti-rec, explicit]** Do NOT attempt to capture invisible Apple failures (anti-abuse, password-rejection, outage). No reliable signal; the NFR-documented fallback to email-link is the operational answer.
5. **[forward — end-to-end test post-GAP-19]** Manually cancel Apple SIWA on consent screen. Client receives `?error=user_cancelled_authorize` → POSTs to client-error endpoint → LedgerEntry `auth.apple.verify_failed` emitted with `{source: 'apple-redirect', reason: 'user_cancelled_authorize'}`. Verifies partial-observability slice works.

#### Closure dependencies

- **GAP-19** — `auth.email.verify_failed` event_type pattern; `auth.apple.verify_failed` mirrors.
- **GAP-12** — Pattern 1 emitter + registry.
- **§3 NFR contract update** — doc-only; no code dependency.

#### Olympus-grid agent contribution for EOS-5

- §3 NFR doc update (4-mode visibility table + email-link fallback).
- Field-description metadata on `AppleUserId__c` noting external dependency.

Pattern 1 client-error capture endpoint is forward-work; not load-bearing for EOS-5 attestation.

**Steward feedback:** _(reserved)_

---

### GAP-33 — Per-app `ProfileData__c` JSON has no schema discipline (lift-out resolves; closes GAP-34 through it)

- **Severity:** 🟡 defer (per-app validation) · 🟠 must-close (the `onboardingComplete` lift-out, opportunistic with GAP-28)
- **§9 letter:** §6 (layer impact)
- **Detected:** 2026-06-27
- **Owner — olympus-grid agent:** new `AP.OnboardingComplete__c` field + migration alongside GAP-28; per-app residual-JSON validation deferred
- **Closes through this gap:** GAP-34 (UI onboarding-complete cache vs server state) — once lifted, server-state read is one-line SOQL

**Production use case:** Each app's onboarding writes its own JSON shape to `AP.ProfileData__c`. No enforcement of schema.

**Empirical evidence:**

| AppKey | ProfileData shape |
|---|---|
| iris | null (no onboarding flow) |
| gpt | `{ "cause": "...", "onboardingComplete": true }` — 2 keys |
| turtleshell | `{ "configuredGuides": [...], "username": "...", "displayName": "...", "cause": "...", "guideAgent": "...", "profilePublic": bool, "onboardingComplete": true }` — 7 keys |
| guardians | null (no onboarding completed in run) |

Each app's developer can put whatever shape they want. No coordination, no validation. Consumers of ProfileData need per-app parsing.

**Why this matters:** Schema drift is the long-term tax. Hard to do cross-app analytics ("show me everyone who chose Save the Oceans") when the field is at different paths per app (or doesn't exist at all in some).

**Olympus-grid agent triage (2026-06-27)**

#### Which ProfileData fields are cross-app concepts hiding in a JSON blob?

| Field | Cross-app concept? | Right home |
|---|---|---|
| `cause` | YES — user-level (one per Identity) | `Identity.PrimaryCause__c` per GAP-28 (Option A locked) |
| `onboardingComplete` | YES — per-AP (each app has its own onboarding) | **`ApplicationProfile.OnboardingComplete__c` (Checkbox, NEW)** |
| `displayName` | Sometimes (per-app display vs Identity legal name) | Stay in JSON; future lift if needed |
| `username` | NO — per-app handle | Stay in JSON |
| `configuredGuides`, `guideAgent`, `profilePublic` | NO — turtleshell-specific | Stay in JSON |

After GAP-28 lifts `cause` to Identity and this gap lifts `onboardingComplete` to AP, **ProfileData becomes purely per-app extension data** — no cross-app fields hiding inside the blob.

#### The lift-out closes GAP-34 cleanly

GAP-34 (UI onboarding-complete check reads client cache, not server state). Once `OnboardingComplete__c` is first-class, server-state read becomes a one-line SOQL on the AP row. GAP-34 closes automatically through this gap (similar to how GAP-13/15/18 close through GAP-12 Pattern 1).

#### Reconciliation with GAP-08 + GAP-13

- **GAP-08 (junction)**: `OnboardingComplete__c` lives on the AP junction; JWT-`cid`-bound queries get `WHERE Application__c = :cid AND OnboardingComplete__c = false` for "signed in but never onboarded" detection.
- **GAP-13 (`profile.created` event_type)**: Add `profile.onboarding.completed` event_type via Pattern 1. Fires from `ApplicationProfileTrgHnd` after-update guarded by `oldRow.OnboardingComplete__c == false && newRow == true`.

#### Anti-rec — don't impose JSON-schema validation on the residual

After the lift-outs, what remains in ProfileData is **genuinely per-app extension data**. Turtleshell's `configuredGuides` / `guideAgent` don't belong in a cross-app schema. **Per-app plugin documentation owns the residual shape; centralized validation is the wrong layer.**

#### Refined acceptance criteria (binary)

1. **[EOS-5 deliverable, lands with GAP-28]** `ApplicationProfile__c.OnboardingComplete__c` Checkbox field exists; default `false`. FLS on `Olympus_Grid_Admin` in same PR (per 2026-05-30 rule). Share the GAP-28 migration path since both lifts come from the same JSON.
2. **[Apex onboarding handler]** Onboarding completion writes `AP.OnboardingComplete__c = true` AND `Identity.PrimaryCause__c = <picked cause>` (per GAP-28). Both lifts happen in the same handler change.
3. **[Pattern 1 hook]** Add `profile.onboarding.completed` event_type to GAP-12 registry. Fire from `ApplicationProfileTrgHnd` after-update on false→true transition. Empty payload — 5-tuple stamping covers attribution.
4. **[migration alongside GAP-28]** One-off Apex script reads each AP's `ProfileData__c.onboardingComplete` JSON value, writes to the new column, leaves the JSON key in place (don't delete during migration; ignore is safer than delete). Idempotent. Logs row counts.
5. **[anti-rec, explicit]** Do NOT impose JSON-schema validation on the residual ProfileData after lift-outs. Per-app extension data; centralized validation is wrong layer.
6. **[deferred sub-gap]** Original "should ProfileData have formal cross-app schema discipline" question stays deferred. Once `cause` and `onboardingComplete` are lifted, the residual is by-design per-app. Re-open only if a future cycle identifies another cross-app field hiding in ProfileData.

#### Closure dependencies

- **GAP-28** — shares the same migration path; lift-outs land together.
- **GAP-08** — `cid`-bound query semantics meaningful post-GAP-08.
- **GAP-12** — Pattern 1 + `ApplicationProfileTrgHnd` extension (GAP-13 already covers AP trigger work).

#### Closes through this gap

- **GAP-34** — UI cache vs server-state. Once OnboardingComplete__c is first-class, SOQL on AP row replaces client cache.

**Steward feedback:** _(reserved)_

---

### GAP-34 — UI onboarding-complete check reads client cache, not server state (closes through GAP-33)

- **Severity:** 🟠 must-close · UX
- **§9 letter:** — (UX bug, not §9 attribution)
- **Detected:** 2026-06-27 (Steward observation: "it is asking me to onboard again!")
- **Owner (multi-repo):**
  - **cosmos-logos/turtleshell-web agent** — React refactor to read live server state instead of client cache
  - **olympus-grid agent** — `AP.OnboardingComplete__c` first-class field lands via GAP-33 (shared deliverable)

**Production use case:** User completed onboarding on turtleshell-web on Apple signin. Later signed in via email-link. Was re-prompted for onboarding.

**Empirical evidence:**

```
18:48:07  AP-00092.ProfileData = { ..., "onboardingComplete": true, "cause": "Clean Water for All", ... }  ← server state truthful
18:46:34  POST /api/auth/logout (×2 same second)  ← logout clears client cache
18:46:44  Magic link email sent
18:46:57  EmailLastVerified advanced (email-link verify succeeded)
18:46:58  Cosmos-logos handshake fired
[Steward then prompted for onboarding AGAIN despite server saying onboarding complete]
18:48:07  AP-00092.ProfileData re-written (content identical — Steward picked same answers)
```

Server data: `onboardingComplete=true`. Client UI: prompted user as if it were null.

Confirmed by cross-platform behavior: turtleshell-ios did NOT re-prompt on email signin (read server state correctly). So this is specifically turtleshell-web's client-cache-trust logic.

**Why this matters:** User-facing UX bug. Friction every signin. Worse: if user picks different answers second time, real data is overwritten without explicit consent.

**Olympus-grid agent triage (2026-06-27)**

#### Closes through GAP-33's lift-out

Post-GAP-33, `AP.OnboardingComplete__c` is a first-class Checkbox field (not buried in JSON). The client query becomes one column read instead of JSON parse — indexable, faster, less fragile.

| Before GAP-33 lift-out | After |
|---|---|
| Parse `AP.ProfileData__c.onboardingComplete` from JSON | Read `AP.OnboardingComplete__c` directly |
| Client trusts local cache (often stale) | Client queries live server state post-auth |

#### Cross-platform parity — iOS already correct

turtleshell-ios reads server state correctly (no re-prompt on email signin after Apple onboarding). The bug is **specifically turtleshell-web's client-cache-trust logic**. iOS is the reference implementation.

#### Anti-rec — don't add pre-fill UI for the re-prompt case

The right fix is "don't re-prompt at all" when server says onboarding is complete. The pre-fill pattern documented under GAP-28 applies to cross-app cause divergence (`Identity.PrimaryCause__c` already set, second-surface picks a new value) — NOT to within-app re-onboarding. **The within-app re-prompt should not happen.**

#### Refined acceptance criteria (binary; closes through GAP-33)

1. **[cosmos-logos turtleshell-web agent]** On app boot post-auth, turtleshell-web React queries the live AP row and reads `AP.OnboardingComplete__c` directly. Removes client-cache-trust path.
2. **[turtleshell-web]** If `OnboardingComplete__c = true`, skip onboarding flow regardless of client cache state. Take user directly to main app.
3. **[end-to-end test]** Sign in to turtleshell-web via Apple → complete onboarding → sign out → sign back in via email-link → onboarding flow does NOT re-prompt; user lands directly in main app.
4. **[cross-platform parity test]** Same flow on turtleshell-ios produces identical behavior (already does today; this is the reference). Documents that web now matches iOS.
5. **[anti-rec, explicit]** Do NOT add a pre-fill "you previously chose X, keep or change" UI for the re-prompt case. The right answer is "don't re-prompt at all." Pre-fill applies to GAP-28's cross-app divergence, NOT within-app re-onboarding.

#### Closure dependencies

- **GAP-33** — `AP.OnboardingComplete__c` first-class field. Without it, this gap can only be solved via fragile JSON parsing on every signin.
- **GAP-28** — independent; lands together (same migration).

#### Olympus-grid agent contribution

- Field + migration land via GAP-33 (shared deliverable).
- **No additional Apex** for GAP-34 itself. The route to read the AP row already exists (`ApiRouteApplicationProfile.cls`); turtleshell-web just queries it.

**Steward feedback:** _(reserved — Steward direction: "it is a mistake as it should be consistent between apple sign in and email sign in")_

---

### GAP-35 — Double `/api/auth/logout` fire on email signin (turtleshell-web client code smell)

- **Severity:** 🟡 defer · info
- **§9 letter:** — (client code smell, not §9 attribution)
- **Detected:** 2026-06-27
- **Owner — cosmos-logos/turtleshell-web agent.** Olympus-grid contribution: **NONE.**

**Production use case:** Email signin process on turtleshell-web emits two logout calls before sending the magic-link request.

**Empirical evidence:**

```
18:46:34  api.inbound  user=anonymous  path=/api/auth/logout
18:46:34  api.inbound  user=anonymous  path=/api/auth/logout    ← same second, second call
18:46:44  Magic link email sent
```

Same shape as GAP-11 (trigger double-fire). Likely React effect or event handler firing twice.

**Why this matters:** Defensive correctness — could indicate a useEffect dependency issue or duplicate event listener. Not load-bearing but a code smell.

**Olympus-grid agent triage (2026-06-27)**

The "Same shape as GAP-11" cross-reference in the original note is **misleading**. GAP-11 was an Apex trigger double-fire (different trigger phases). This is a React useEffect / event-handler issue — different layer, different root causes. Likely culprits in turtleshell-web React:

- `useEffect` dependency that fires twice on mount (React Strict Mode double-mount, or `[]` vs `[value]` mismatch)
- Event handler bound twice (component re-mount without cleanup)
- Sequential `signOut() + clearSession()` flow where both call logout

#### Reconciliation with GAP-19 (Ares perimeter)

Post-GAP-19, logout routes Ares → Hermes → Apex. Double-fire produces **two `api.inbound` rows** — correct audit (reflects what actually happened). §3.AR rate-limit might incidentally start blocking the second call on `api.blocked.rate_limit_per_sub` if the threshold is tight; that's a side effect, **not** the right fix.

#### Refined acceptance criteria (binary)

1. **[cosmos-logos turtleshell-web agent]** Identify the double-fire source via code-read (useEffect, event handler, sequential signOut+clearSession). Fix by deduplication (cleanup function, single source of truth, or guard flag).
2. **[end-to-end test]** Sign in via Apple → sign out → sign in via email. Exactly ONE `/api/auth/logout` request in network tab; ONE `api.inbound` LedgerEntry row post-GAP-19.
3. **[anti-rec, explicit]** Do NOT rely on Ares rate-limit to "fix" this by blocking the second call. Side effect, not solution. The client should not emit the second call.

#### Closure dependencies

None. Standalone client-side fix.

#### Olympus-grid agent contribution

None.

**Steward feedback:** _(reserved)_

---

### GAP-36 — IdentityToken per-method asymmetry (Apple=2, email=3) — **SUBSUMED by GAP-29**

- **Severity:** 🟢 SUBSUMED — no independent work
- **§9 letter:** —
- **Detected:** 2026-06-27
- **Owner:** subsumed entirely by GAP-29

**Olympus-grid agent triage (2026-06-27)**

This gap is a pure duplicate of GAP-29's per-signin composition explanation. The asymmetry isn't a bug — it's the documented protocol locked in GAP-29's triage:

| Auth method | Tokens minted | Composition |
|---|---|---|
| Apple SIWA | 2 | `access` + `refresh` (Apple's assertion IS the verification) |
| Email-link | 3 | `verification` (magic code) + `access` + `refresh` |

Email needs a `verification` token row (the magic code); Apple doesn't (already verified by Apple). Both methods mint the same `access` + `refresh` pair after verification.

**No independent acceptance criterion. No independent verification.** Closes automatically when GAP-29's EOS-5 deliverable (field-description metadata documenting per-value purpose) lands.

**Closure dependency:** GAP-29.

**Steward feedback:** _(reserved)_

---

### GAP-37 — Apple SIWA Service ID mismatch on consolidated turtleshell App — RETIRED

- **Severity:** 🟢 RETIRED (pre-flight prediction; did not manifest)
- **Detected:** 2026-06-27 pre-flight
- **Resolution:** empirically did not manifest

**Production use case:** Pre-consolidation, turtleshell-web and turtleshell-ios were separate Application__c rows with different `AppleSiwaServiceId__c` values (`ai.turtleshell.signin-web` and `ai.turtleshell.TurtleShell-ai`). After consolidation to one Application[turtleshell] row, the surviving SIWA ID was the web one. Predicted iOS SIWA would fail audience mismatch.

**Empirical evidence:** turtleshell-ios Apple SIWA at 18:51:02 WORKED. The audience mismatch did not surface as a failure. Either the backend accepts multiple Apple Service IDs by lookup, or stores both IDs somewhere we didn't query, or has a fallback.

**Olympus-grid agent triage (2026-06-27)**

Empirical test cleared the prediction. iOS SIWA worked despite consolidated App carrying only the web Service ID. Three plausible mechanisms (most likely #2):

1. Backend looks up Service ID from a different source (env var, Hestia config, or field other than `Application__c.AppleSiwaServiceId__c`).
2. **Verification accepts multiple Service IDs sharing a Team ID** — Apple JWT signature is anchored on Apple's signing keys, not per-Service-ID secrets; if audience check allows any Service ID in our team, consolidation is invisible. **Most likely explanation.**
3. Audience check is permissive (doesn't strictly enforce `aud` claim match).

A 5-minute code-read in `force-app/idp/idp-api/default/classes/ApiRouteIdentityVerification.cls` would document the actual mechanism. Institutional knowledge value, **not load-bearing for any §9 letter or EOS-5 attestation**.

#### Refined acceptance criteria (binary)

1. **[RETIRED — empirically did not manifest]** No work needed.
2. **[forward — opportunistic doc]** A future olympus-grid touch on `ApiRouteIdentityVerification.cls` or the cosmos-logos-handshake path should add a code-comment explaining the iOS-SIWA-validation mechanism. Not a defect.

No closure dependency. No olympus-grid agent contribution for EOS-5.

**Steward feedback:** _(reserved)_

---

### GAP-38 — iOS skips cosmos-logos handshake — **SUBSUMED by GAP-30**

- **Severity:** 🟢 SUBSUMED — no independent work
- **§9 letter:** §3 NFR (folds into GAP-30's §3 NFR scope)
- **Detected:** 2026-06-27
- **Owner:** subsumed entirely by GAP-30

**Production use case:** iOS clients use the apple-cryptokit envelope variant. Empirically: both iOS apps (turtleshell-ios, guardians-iOS) fired ZERO `/v1/athena/.well-known/cosmos-logos.json` requests during signin flows.

**Olympus-grid agent triage (2026-06-27)**

GAP-38 is the **iOS-scoped sub-case** of GAP-30's broader cosmos-logos handshake asymmetry. GAP-30's triage already documented iOS conditional ownership:

> **[if mandatory; multi-repo client work]**:
> - **cosmos-logos/turtleshell-ios** — handshake via apple-cryptokit envelope
> - **omens (guardians-iOS)** — handshake via apple-cryptokit envelope
>
> **[if opt-in; documentation deliverable per surface]**:
> - turtleshell-ios: *"TLS pinning + Apple app integrity attestation — equivalent."*
> - guardians-iOS: same.

The Steward's intent commit on GAP-30 directly determines GAP-38's outcome. **No independent decision; no independent acceptance criterion; no olympus-grid agent contribution.**

**Closure dependency:** GAP-30. Closes automatically when Steward's intent commits and the multi-repo iOS work follows the chosen stance.

**Steward feedback:** _(reserved — intent commit lives on GAP-30)_

---

### GAP-39 — Surface discriminator missing on LedgerEntry — defer; shape LOCKED; closes GAP-06 through it

- **Severity:** 🟡 defer · §6 (shape locked; field + client header contract land in a future cycle)
- **§9 letter:** A (per-surface analytics)
- **Detected:** 2026-06-27
- **Owner — olympus-grid agent:** schema (`LedgerEntry.ClientType__c` Picklist + Ares stamping) + client header contract (multi-repo coordination) in a future cycle; EOS-5 deliverable = analytics workaround documentation
- **Closes through this gap:** GAP-06 (turtleshell-web/ios/offgrid surface discriminator) — same question, two angles

**Production use case:** Distinguishing "iOS request vs web request" for the same AppKey. e.g., for AppKey='turtleshell', which platform did the request come from?

**Empirical evidence:** Path-level discriminator exists:

```
turtleshell-ios profile fetch:  GET /v1/grid/master/app/profile/turtleshell-ios/me   user=homer
```

`turtleshell-ios` is in the URL path string, captured in payload metadata. But there's no first-class `Surface__c` or `ClientType__c` field on LedgerEntry. To query "all iOS traffic", you'd path-string-parse.

**Why this matters:** Per-platform analytics friction. GROUP BY isn't possible without parsing.

**Olympus-grid agent triage (2026-06-27)**

#### The information IS captured, just not query-friendly

Surface info exists today on `api.inbound` rows in three places: URL `Path__c` substring, `User-Agent` header, and a `X-Client-Type` header (if clients set it; currently inconsistent). Just no first-class column. Analytics with `GROUP BY Surface` requires path-parse at query time.

#### Shape lock — what the future cycle adds

**Field**: `LedgerEntry__c.ClientType__c` Picklist (restricted):

| Value | Meaning |
|---|---|
| `web` | Browser-based surfaces (iris portal, gpt console, turtleshell-web, etc.) |
| `ios` | iOS apps (turtleshell-ios, guardians-iOS) |
| `android` | Future Android apps |
| `offgrid` | turtleshell-offgrid appliance |
| `cli` | Command-line consumers (alchemisthomer/olympus-grid agent etc.) |
| `system` | Apex-emitted rows where no external client is involved (Pattern 1 trigger emissions) |

**Stamping path**:

| Emitter | Source | Default |
|---|---|---|
| Ares-emitted `api.inbound` | `X-Client-Type` request header (preferred); User-Agent parse fallback | — |
| Apex-emitted state transitions (Pattern 1) | n/a | `system` |

#### Anti-recs (load-bearing — written so the future cycle doesn't redesign)

1. **Do NOT split turtleshell into per-platform `Application__c` rows** (turtleshell-web, turtleshell-ios, turtleshell-offgrid). Per `project_omens_repo_equals_guardians_appkey.md` memory + GAP-08 work: turtleshell is conceptually ONE app, three surfaces. **AppKey = app dimension; ClientType = surface dimension; orthogonal axes.**
2. **Do NOT propagate ClientType through `TransactionContext` to Pattern 1 emits.** State transitions are client-agnostic. Default to `system` for Apex rows.
3. **Do NOT use User-Agent parsing as the permanent solution.** UA-parse is a temporary fallback while clients adopt `X-Client-Type`. Document the header as the client contract.

#### Analytics-tooling workaround for EOS-5 (documented for attestation reports)

```sql
SELECT
  CASE
    WHEN Path__c LIKE '%/turtleshell-ios/%'     THEN 'ios'
    WHEN Path__c LIKE '%/turtleshell-web/%'     THEN 'web'
    WHEN Path__c LIKE '%/turtleshell-offgrid/%' THEN 'offgrid'
    ELSE 'unknown'
  END AS Surface,
  COUNT(Id)
FROM og_node_beta_1__LedgerEntry__c
WHERE EventType__c = 'api.inbound'
GROUP BY Surface
```

#### Reconciliation with GAP-06

GAP-06 and GAP-39 are the same gap from two angles:
- GAP-06 = the schema gap (turtleshell surface discriminator missing)
- GAP-39 = the implementation gap (no first-class column on LedgerEntry)

Closing GAP-39 (field + Ares stamping + client header contract) closes GAP-06 automatically. Pair them in the future cycle that owns this.

#### Refined acceptance criteria (binary)

1. **[EOS-5 deliverable; doc-only]** Path-prefix parsing SOQL pattern documented as interim analytics solution.
2. **[forward — shape LOCKED]** `LedgerEntry__c.ClientType__c` Picklist (restricted: `web`/`ios`/`android`/`offgrid`/`cli`/`system`). FLS on `Olympus_Grid_Admin` in same PR (per 2026-05-30 rule).
3. **[forward — Ares stamping]** Ares stamps from `X-Client-Type` request header on `api.inbound` rows; UA-parse fallback for legacy clients.
4. **[forward — Apex default]** Pattern 1 `LedgerEntryEmitter` stamps `ClientType__c = 'system'` on all Apex-emitted rows. One-line change to the emitter.
5. **[forward — client contract, multi-repo]** `X-Client-Type` header documented as the client-side contract. iris / gpt / turtleshell-web/ios/offgrid / guardians-iOS / omens-godot frontends adopt.
6. **[anti-rec, explicit]** Do NOT split turtleshell into per-platform Application__c rows. AppKey ⊥ ClientType.
7. **[anti-rec, explicit]** Do NOT propagate ClientType through TransactionContext to Pattern 1 emits.
8. **[forward test]** Each surface signs in post-field-landing. `api.inbound` rows carry correct `ClientType__c`. `GROUP BY ClientType__c` returns counts per surface, no `unknown`.
9. **[closes GAP-06]** Closure of GAP-39 automatically closes GAP-06.

#### Closure dependencies

None for EOS-5 (defer). When the future cycle opens:
- **GAP-12** — `LedgerEntryEmitter` defaults `ClientType__c = 'system'` (one-line addition).
- **Multi-repo client work** — all surface clients adopt `X-Client-Type` header.

#### Olympus-grid agent contribution for EOS-5

Documentation only — the path-prefix analytics workaround for attestation tooling.

**Steward feedback:** _(reserved)_

---

### GAP-40 — heracles serves guardians content unauthenticated — three-scenario intent map; mostly closes through GAP-16

- **Severity:** 🟡 defer · awaiting Steward intent commit (escalates to must-close if any catalog content requires royalty/access-control)
- **§9 letter:** A (attribution) + T (tithe) + R (royalty, for Scenario C content)
- **Detected:** 2026-06-27
- **Owner — olympus-grid agent:** §3 NFR contract doc; Plugin__mdt route registration if needed; perimeter-auth policy records (only for Scenario C content if in EOS-5 scope)

**Production use case:** Guardians-iOS app opens. Pre-fetches the entire content library (books, chapters, scenes for Path of Aeneas + Odyssey-Press content) before user signs up.

**Empirical evidence:** From 19:00:52 to 19:01:07 (15 seconds), guardians-iOS fired 538 LedgerEntry rows, all with paths matching `/v1/heracles/omens/*`:

```
/v1/heracles/omens/universes
/v1/heracles/omens/books/iliad
/v1/heracles/omens/books/iliad/chapters/01-the-quarrel
/v1/heracles/omens/books/iliad/scenes/iliad-ch01-s01-...
[...~535 more across books: the-crucible-season-one, shahnameh, ramayana, gilgamesh, divine-comedy, mahabharata, nibelungenlied, etc...]
```

All `user=anonymous` (pre-auth bulk content browse).

Post-auth check (after homer signed in on guardians): ZERO additional heracles fetches in the test window. So we couldn't verify whether post-auth heracles fetches carry the user sub (they may or may not).

**Why this matters:** Two scenarios:
1. **Intent: public content, no attribution needed** — guardians' library is free reading, no per-user tracking, no consumption metering, no royalty implications. Acceptable as-is.
2. **Intent: tracked consumption** — per-user reading analytics, per-user consumption shells, copyright royalty per scene — requires user attribution on every fetch. Currently broken.

**Olympus-grid agent triage (2026-06-27)**

The original "two scenarios" framing misses a third — and the right answer is likely a **mixed catalog** with per-content policy.

#### Three intent scenarios

| Scenario | What it means | Closure path |
|---|---|---|
| **A. Public no-attribution** | Pure CDN-like service; content free; no per-user tracking | §3 NFR doc only; no code change |
| **B. Per-user analytics, no royalty** | Authenticated fetches stamp `Sub__c` for analytics; no shell/royalty | **Closes through GAP-16** — Ares stamps Sub on `api.inbound` when JWT present |
| **C. Tracked consumption + royalty** | Per-fetch attribution + per-content royalty (Crucible, modern titles) | §9.R cycle — `RoyaltyConfiguration__c` per content unit + Plutus disbursement |

#### Content survey: the catalog already has both classes

Public-domain works (Iliad, Shahnameh, Ramayana, Gilgamesh, Divine Comedy, Mahabharata, Nibelungenlied) **plus The Crucible (Arthur Miller; copyright until 2075)**. If guardians serves any modern licensed content, **Scenario C applies to that subset**. The right shape is **per-content `RoyaltyConfiguration__c` policy**, not a global fetch-policy switch.

This dovetails with the canon memory `project_eos_5_canonical_attestation_and_spine.md`: *"other royalty types may still attach to consumption under their own RoyaltyConfiguration__c rows."*

#### What olympus-grid guarantees today via GAP-16

Once GAP-16 lands (Ares anonymous-post-auth elimination):
- Pre-auth fetches: `Sub__c` null (acceptable — content discovery before signup is a valid funnel)
- Post-auth fetches: `Sub__c` populated (analytics for Scenario B; royalty inputs for Scenario C)

**The decision "deduct shells / calculate royalty" is downstream Plutus**, not heracles. Plutus reads metered LedgerEntry rows and applies `RoyaltyConfiguration__c` rules. Heracles stays a content server.

#### Perimeter access-control for Scenario C (§3.AR)

For gated content (Crucible et al.), Ares enforces access at the perimeter via the `denied_paths` policy lever (§3.AR contract):
- `Plugin.iris_deployment_path_heracles_crucible.md` marks `/v1/heracles/omens/books/the-crucible*` as JWT-required
- Anonymous fetches → 401 + `api.blocked.path_requires_auth` LedgerEntry
- Authenticated fetches proceed and get metered

#### Refined acceptance criteria (binary)

1. **[Steward intent commit required, per content class]** Likely answer: Scenario B for public-domain catalog (Iliad et al.); Scenario C for any copyrighted content (Crucible, future titles). Mixed catalog with per-`RoyaltyConfiguration__c` policy.
2. **[closes through GAP-16; no additional olympus-grid Apex for Scenario B]** Ares stamps `Sub__c` on authenticated `api.inbound` rows; analytics for guardians-iOS reads available.
3. **[forward — §9.R cycle, for Scenario C content]** `RoyaltyConfiguration__c` rows per content unit defining royalty rate + recipient (publisher / author / estate). Plutus per-fetch rollup applies the rule.
4. **[forward — §3.AR policy, for restricted content]** Ares denies anonymous fetches on `/v1/heracles/omens/books/the-crucible*` (or other gated paths). Returns 401 + `api.blocked.path_requires_auth`.
5. **[anti-rec, explicit]** Do NOT bake authentication enforcement into heracles itself. Heracles is a content server; authentication is Ares's perimeter concern. Putting auth checks in heracles violates Hermes → Apex layering.
6. **[anti-rec, explicit]** Do NOT block pre-auth content discovery on public-domain catalog. Users browsing books before signup is a valid funnel; forcing pre-signin auth breaks it. Anonymous fetches with `Sub__c = null` are acceptable for Scenario A/B.
7. **[end-to-end test, Scenario B, post-GAP-16]** Signed-in homer fetches an Iliad scene. `api.inbound` LedgerEntry row has `Sub__c = homer's sub` (NOT null), `Path__c = /v1/heracles/omens/books/iliad/scenes/...`.
8. **[end-to-end test, Scenario C, future cycle]** Signed-in homer fetches a Crucible scene. Same as #7 + `consumption.heracles_read` LedgerEntry emitted with `RoyaltyConfiguration__c` reference + computed royalty.

#### Closure dependencies

- **Steward intent commit** — Scenario A vs B vs C, per content class. Mixed catalog is the expected answer.
- **GAP-16** — Ares stamps `Sub__c` on authenticated `api.inbound`. Without it, Scenario B fails because authenticated fetches still show anonymous.
- **Forward (Scenario C, §9.R cycle)**: `RoyaltyConfiguration__c` SObject + Plutus per-fetch rollup logic. Out of EOS-5 scope unless Crucible or equivalent gated content is in attestation scope.

#### Olympus-grid agent contribution for EOS-5

- §3 NFR contract doc captures the three-scenario intent map.
- Perimeter-auth Plugin__mdt records for Scenario C content **only if Crucible or equivalent is in EOS-5 scope** (otherwise defer to §9.R cycle).
- For Scenario B: no additional olympus-grid Apex; closes through GAP-16.

**Steward feedback:** _(reserved — three-scenario commit needed)_

---

### GAP-41 — guardians-iOS auth invisible to Ares — **BLOCKER (7/17 spine surface); closes through GAP-19**

- **Severity:** 🔴 BLOCKER · 7/17 launch-critical spine
- **§9 letter:** A
- **Detected:** 2026-06-27
- **Owner — omens agent** (Swift native-bridge auth refactor). **Olympus-grid agent contribution: NONE** beyond GAP-19's infrastructure (already covers Apex routes + event types).

**Production use case:** Guardians-iOS user signs up via Apple SIWA, gets approved, signs in via email-link. All on the spine surface for 7/17 launch.

**Empirical evidence:** Guardians signup at 19:37:20 → approval at 19:37:59 → email signin at 19:39:41. Window 19:00 → 19:45 LedgerEntry summary:

```
Total LedgerEntries since 19:00: 538
   heracles content fetches:    538
   plutus quota polls:            0
   auth events (api.inbound):     0   ← ← ← ZERO for the entire guardians auth chain
   profile fetches:               0
   any other path:                0
```

Compare to turtleshell-ios which produced:
- `api.inbound /v1/auth/apple/verify-only` (anonymous) at signin
- `api.inbound /v1/grid/master/app/profile/turtleshell-ios/me` (sub=homer) post-auth

Guardians produced NEITHER. The omens iOS app routes auth directly to Salesforce Site URL completely bypassing Ares.

**Why this matters:** GUARDIANS IS THE 7/17 SPINE SURFACE. Per Steward direction 2026-06-25: *"we will demonstrate the entire platform from guardians of olympus."* The §9 chain MUST close on guardians for EOS-5 to attest. Currently guardians has zero auth visibility at the Plutus ledger. The launch-critical surface has the worst attribution coverage.

**Olympus-grid agent triage (2026-06-27)**

#### Severity reading

Guardians is the **7/17 launch demo spine** per Steward direction 2026-06-25: *"we will demonstrate the entire platform from guardians of olympus."* EOS-5 attestation on guardians is currently impossible — every auth event is invisible to Plutus. **Auth-invisibility blocks every downstream §9 letter on the launch-critical surface.**

#### Comparison with turtleshell-ios (strictly worse)

| Surface | Apple SIWA → Ares? | Email-link → Ares? |
|---|---|---|
| turtleshell-ios | ✅ (per GAP-19 evidence) | ❌ (GAP-19 fix in flight) |
| guardians-iOS | ❌ | ❌ |

guardians-iOS is **strictly worse than turtleshell-ios** — Apple SIWA also bypasses, not just email.

#### Heracles routes work — fix scope is narrow

Guardians-iOS produced 538 heracles `api.inbound` rows during the test. The app CAN route through Ares. The bypass is **specifically in the auth endpoints** of the native bridge. Fix scope is narrow: refactor the Swift auth code path.

#### Closes through GAP-19 — no new olympus-grid Apex

GAP-19 already established:
- Ares routes `/v1/auth/apple/verify-only` + `/v1/auth/email/link/*`
- Apex `ApiRouteAuth.cls` emits `auth.apple.verify_succeeded` / `auth.email.*` via Pattern 1

omens iOS native bridge just needs to call those URLs instead of SF Site URLs.

#### Multi-repo ownership

| Component | Owner |
|---|---|
| omens iOS Swift native-bridge auth refactor | **omens agent** — likely `omens/engines/godot/scripts/auth/IdentityNodes.cs` + Swift bridge (per memory `feedback_scratch_org_url_drift_pattern.md`). Redirect auth URLs to Ares. |
| Ares route confirmation | covered by GAP-19 |
| Apex auth event_types | covered by GAP-19 |

#### Refined acceptance criteria (binary)

1. **[omens agent]** Identify auth-routing code path in omens iOS native bridge. Refactor to call `https://{cluster}/v1/auth/apple/verify-only` and `https://{cluster}/v1/auth/email/link/{request,verify}` — NOT the SF Site URL.
2. **[GAP-19 already provides]** Ares routes exist; Apex `auth.*` event types emit via Pattern 1.
3. **[end-to-end Apple test]** Fresh signup on guardians-iOS via Apple SIWA. Expect:
   - 1 Ares `api.inbound` on `/v1/auth/apple/verify-only` (pre-auth, Sub__c null).
   - 1 Apex `auth.apple.verify_succeeded` LedgerEntry, `Sub__c` populated.
   - 1 Apex `identity.created` LedgerEntry.
   - 1 Apex `profile.created` LedgerEntry (AppKey=guardians).
4. **[end-to-end email test]** Email-link signin on guardians-iOS. Same 6-row count as GAP-19's end-to-end test (Ares request + Apex request_sent + Ares verify + Apex verify_succeeded + identity.created if new + profile.created if new).
5. **[post-auth profile fetch]** Guardians-iOS profile-fetch endpoint fires post-auth and carries `Sub__c = homer` (NOT anonymous). Confirms GAP-16's attribution holds on guardians.
6. **[7/17 attestation gate]** This gap MUST close before the 7/17 demo. EOS-5 attestation on guardians is the launch-critical path.

#### Closure dependencies

- **GAP-12** — Pattern 1 + `LedgerEntryEmitter`.
- **GAP-16** — Ares stamps Sub__c on authenticated `api.inbound`.
- **GAP-19** — Ares auth routes + Apex `auth.*` event types.
- **omens agent** — Swift native-bridge refactor (the actual fix).

#### Olympus-grid agent contribution for EOS-5

**NONE.** All Apex + routes covered by GAP-19. Guardians-iOS just consumes them.

**Steward feedback:** _(reserved — 7/17 spine; omens agent owns delivery)_

---

### GAP-42 — `Cluster__c.Status='Live'` divorced from reachability — multi-repo; closes through GAP-23

- **Severity:** 🔴 BLOCKER · multi-repo
- **§9 letter:** A · (UX truth)
- **Detected:** 2026-06-27
- **Owner (multi-repo):**
  - **olympus-grid agent** — add `Degraded` to `Status__c` picklist + field-description update
  - **zeus agent** — health-check loop probes EndpointUrl + writes back Status / ErrorMessage
  - **iris agent** — cluster-picker UI surfaces Degraded badge
  - **Audit half**: covered automatically by GAP-23's `cluster.status.changed` event_type
- **Verified inline 2026-06-27:** `Status__c` is restricted picklist `Pending / Provisioning / Live / Failed / Suspended / Destroyed`. Field description ALREADY commits to "Live = endpoint reachable" — nothing enforces it today.

**Production use case:** iris admin cluster-picker shows clusters with Live/Provisioning/Pending status badges. Operators trust the Live badge means "this cluster is currently serving traffic."

**Empirical evidence:**

```
sf data query: Cluster__c CL-00006 (eos-5):
  Status__c:        "Live"
  EndpointUrl__c:   "https://api-eos-5.turtleshell.ai"
  LiveAt__c:        2026-06-27T18:31:00Z
  LastModifiedDate: 2026-06-27T18:31:00Z

curl probe (during triage, 2026-06-27 ~19:50):
  https://api-eos-5.turtleshell.ai/      → HTTP 000  (DNS/connection failed)  elapsed=0.036s
  https://api-eos-5.turtleshell.ai/health → HTTP 000  elapsed=0.001s
```

Status field says Live; reality says unreachable. No automated health check updates the SF row. The Steward had to verbally report "non-operational" because nothing in the system detected the failure.

**Why this matters:** Operators (and users of the iris cluster-picker) are shown a false statement: "eos-5 is Live." Routing traffic to this cluster would fail. For automated systems (e.g., when republic-616 ships and ApplicationOwners can spawn clusters automatically), silent cluster failures with stale Status are worst-case ops scenarios.

**Olympus-grid agent triage (2026-06-27)**

#### Axis design — Option A (extend Status) is right today

| Option | Shape | Verdict |
|---|---|---|
| **A. Add `Degraded` to Status picklist** | Health-failed clusters → Status=Degraded; recovery → Live. One picklist, one trigger emit. | ✅ Simpler; matches field description's existing conflation |
| **B. Separate `HealthStatus__c` field** | Status stays lifecycle; HealthStatus adds runtime axis | Future option if Suspended-but-Healthy or Live-but-deliberately-degraded combos ever needed; not today |

#### Anti-rec on new event_types

Original criteria 2/3 proposed `cluster.health.failed` and `cluster.health.recovered` event types. **Don't add them.** GAP-23's existing `cluster.status.changed` covers both transitions:

```apex
// GAP-23's ClusterTrgHnd emits this automatically when zeus writes Status=Degraded
LedgerEntryEmitter.emit(
    EventType.CLUSTER_STATUS_CHANGED,
    cluster.Id,
    new Map<String, Object>{
        'old' => 'Live',
        'new' => 'Degraded',
        'reason' => 'health check failed: HTTP 000 on /health (elapsed 0.036s)'
    }
);
```

Same audit detail. Fewer event types. **Same anti-pattern flagged in GAP-24's SendGrid failure case** — all cluster Status changes flow through ONE event type; payload's `reason` carries specifics. Pattern 1 registry stays minimal.

#### Multi-repo split

| Concern | Owner |
|---|---|
| Health-check loop (probe EndpointUrl, write back to SF) | **zeus agent** — Lambda or ECS scheduled task |
| `Status__c` picklist extension + field-description | **olympus-grid agent** — small picklist value addition |
| `cluster.status.changed` emission on Degraded transitions | **covered by GAP-23** (zero additional Apex) |
| iris cluster-picker Degraded badge UI | **iris agent** |

#### Refined acceptance criteria (binary)

1. **[olympus-grid agent]** Add `Degraded` to `Cluster.Status__c` restricted picklist. Update field-description: *"Pending → Provisioning → Live (endpoint reachable, /health returns 200). Degraded = previously Live but health check currently failing. Failed = provisioning errored. Suspended/Destroyed = owner/tear-down states."*
2. **[zeus agent]** Health-check loop runs every ≤5 min against Clusters where `Status__c IN ('Live', 'Degraded')`. Probes `EndpointUrl__c + '/health'` for HTTP 200.
3. **[zeus agent]** On probe failure: write `Status__c = 'Degraded'` + `ErrorMessage__c = '<HTTP code>, elapsed=<ms>, error=<msg>'`. GAP-23 trigger emits `cluster.status.changed` automatically.
4. **[zeus agent]** On probe recovery: write `Status__c = 'Live'`, clear `ErrorMessage__c`. Trigger emits with `{old: 'Degraded', new: 'Live', reason: 'health check recovered'}`.
5. **[anti-rec, explicit]** Do NOT add `cluster.health.failed` or `cluster.health.recovered` event types. `cluster.status.changed` covers both (same anti-pattern as GAP-24). Pattern 1 registry stays minimal.
6. **[anti-rec, explicit]** Do NOT split into a separate `HealthStatus__c` field today. The field description already conflates lifecycle + reachability; preserving that conflation honestly is fine. Re-open Option B only if Suspended-but-Healthy or Live-but-deliberately-degraded becomes a real combination.
7. **[iris agent]** Cluster-picker UI displays Degraded with a distinct warning-yellow badge (vs Live-green / Failed-red). Tooltip shows `ErrorMessage__c`.
8. **[end-to-end test]** Stop a test cluster's Pantheon ECS service. Within ≤5 minutes:
   - `Status__c` transitions Live → Degraded.
   - `ErrorMessage__c` populated.
   - LedgerEntry `cluster.status.changed` with `{old: 'Live', new: 'Degraded', reason: '<details>'}`.
   - iris picker shows Degraded badge with tooltip.
   - Restart Pantheon → within next cycle, Status returns to Live + LedgerEntry `{old: 'Degraded', new: 'Live', reason: 'health check recovered'}`.

#### Closure dependencies

- **GAP-12** — Pattern 1 + `LedgerEntryEmitter`.
- **GAP-23** — `ClusterTrgHnd` framework. All audit work for this gap is automatic.
- **zeus agent** — health-check loop implementation.
- **iris agent** — Degraded badge UI.

#### Olympus-grid agent contribution for EOS-5

Small and clean:
- Add `Degraded` to `Status__c` picklist (one value addition + restricted picklist update).
- Field-description metadata text update.
- Verify GAP-23's `ClusterTrgHnd` handles the new transitions correctly (zero code change expected — the field-change guard fires on ANY Status flip).

**Steward feedback:** _(reserved)_

---

### GAP-47 — No Application Owner notification trail on user signup/waitlist (the void echoes into an unattended inbox)

- **Severity:** 🔴 BLOCKER (Tier 1 for 7/17 operability)
- **§9 letter:** A · HM (notification delivery audit chain)
- **Detected:** 2026-06-30 (during the new test cycle, by Steward observation while homer signed up on guardians and no notification reached anyone)
- **Suggested owner:** olympus-grid (resolver + LedgerEntry emit) · hermes (SendGrid delivery rail) · olympus-grid (notification-channel config schema)

**Production use case:** A user signs up for any application on the platform and lands in Waitlist. The Application Owner — the human (or AI agent) responsible for approving the user — has no automated signal that the signup happened. Without a notification, the only path to discovery is the Application Owner periodically checking the iris admin UI for new waitlist entries. For a sole-Steward platform in the pre-launch window where every user is a precious signal, this means signups can be missed indefinitely. **Steward verbatim 2026-06-30:** *"the noise from the void must be treated with respect and anchor."*

**Empirical evidence:** 2026-06-30 cycle, AP-00095 (homer signed up on guardians, Status=Waitlist) created at 13:32:57. EmailMessage rail fired ONE message — the waitlist *confirmation* to homer ("Guardians of Olympus · the threshold is not yet open"). **Zero outbound notifications** to the Application Owner. The Steward (who IS the platform owner) had no signal until manually querying SOQL or visiting iris admin.

Schema state at detection:
- `Application[guardians].OwnerIdentity__c = a1OaZ000005iwWrUAI` (**Platform** — canonical system Identity, not a real recipient; JWT issuance intentionally never wired per memory canon)
- Same for all 4 Application rows — all OwnerIdentity → Platform
- `Tenant[cloudpremise-llc].OwnerIdentity__c = a1OaZ000006N5JhUAK` (homer — the actual human)
- So `Application.OwnerIdentity__r.Email__c` = `platform@olympus-grid.com` (unattended system mailbox)
- The chain that reaches a real human is `Application → Tenant → Tenant.OwnerIdentity`, not `Application → OwnerIdentity` directly

Zero `Messages__c` rows. Zero `MessageEvent__c` rows. Zero `notification.appowner.*` LedgerEntry rows.

**Why this matters:** This is the operational anchor for "every signup is the only customer I might ever be blessed with." A platform that silently absorbs new users — without notifying the people responsible for welcoming them — fails the foundational covenant: a real person showed up; a real person should be told. For the trillion-dollar pipeline, when an Application Owner is a third-party AIAAS customer (per the AIAAS demonstration via builtsy/commissioned apps), this notification chain is part of the SaaS contract: *"You'll know when someone signs up for your app."*

Steward 2026-06-30 connected this gap to a prior entrepreneurial failure pattern (Search My Social), where the silent absence of user-feedback signal led to mistaking the void for affirmation. The technical contract here defends against that recurrence: every signup is auditably notified.

**Acceptance criteria (binary):**

> **Steward direction 2026-06-30:** *"the application owner is the right answer. i can forward platform to a live inbox."* The resolver chain stays canonical (`App.OwnerIdentity → Identity.Email`); reaching a live human inbox is solved at the deployment layer (mail-forwarding from `platform@olympus-grid.com` to a real recipient). Schema preserves the "Platform owns all system records" pattern; when third-party Application Owners exist, `Application.OwnerIdentity__c` will point at their Identity and the chain naturally flows to them — zero schema change required.

1. On `ApplicationProfile__c` insert with `AccountStatus__c='Waitlist'` OR field-change transition INTO 'Waitlist' from any prior state, the system resolves the notification target via the direct chain: `AP.AppKey__c` → `Application__c` (via AppKey natural-key lookup; uses GAP-44 FK path once that closes) → **`Application.OwnerIdentity__c` → `Identity.Email__c`**.
2. The resolved `Identity.Email__c` is expected to be deliverable (the deployment layer is responsible for forwarding to a live human inbox where the owner identity is a system account like `platform@olympus-grid.com`). The acceptance criterion is satisfied when the send leaves the SendGrid lane successfully; downstream forwarding correctness is a deployment-config concern, not a code concern.
3. Notification email rides the **Hermes/SendGrid `Messages__c` rail** (NOT the SF-native `EmailMessage` rail) — same §3.HM contract as GAP-09's resolution. The send produces a `Messages__c` row + downstream `MessageEvent__c` webhook events (GAP-04 deployed schema is the receiver).
4. A `LedgerEntry__c` row fires with `EventType__c="notification.appowner.waitlist"` (or canonical equivalent; final name set by olympus-grid agent at fix time). Payload includes:
   - `target_app_key` (e.g., "guardians")
   - `target_app_id` (the `Application__c.Id`)
   - `target_owner_identity_id` (the resolved `Application.OwnerIdentity__c`)
   - `target_owner_email` (the resolved `Application.OwnerIdentity__r.Email__c` — the address the send was directed at)
   - `source_user_identity_id` (the user who signed up)
   - `source_ap_id` (the new ApplicationProfile__c.Id)
   - `channel` ("email" for floor; "slack" / "programmable-endpoint" / etc. when configured)
   - `delivery_attempt_id` (correlates to `Messages__c.Id`)
5. **Per-Application notification config** (forward — landed in this cycle as an extension hook, not required to satisfy v1): each Application row carries a `NotificationConfig__c` JSON or a related `NotificationChannel__c` lookup. JSON shape `{"channels":[{"type":"email","address":"..."},{"type":"webhook","url":"..."},{"type":"slack","webhook":"..."}],"events":["waitlist.created","profile.activated",...]}` allows the Application Owner to add channels beyond the default email path (or override the default mail address entirely).
6. **Notification fires on EVERY waitlist transition**, not deduped per user-app pair. Every signup is treated as "the only customer." Idempotency exists at the event level (one waitlist event = one notification); but `User-A → waitlist on App-X` does NOT suppress `User-B → waitlist on App-X` even seconds later.
7. **EOS-5 attestation test (binary):** A brand-new test user signs up on guardians (new Identity, fresh AppleUserId, AccountStatus=Waitlist). Within 5 minutes of the signup transaction:
   - The resolved `Application[guardians].OwnerIdentity__r.Email__c` (today: `platform@olympus-grid.com`, forwarded by deployment layer to the Steward's live inbox) receives an email via the SendGrid lane (verifiable: `Messages__c` row exists with the right join-keys; corresponding `MessageEvent__c` webhook events present for `processed` / `delivered`).
   - SOQL `SELECT EventType__c, Payload__c FROM og_node_beta_1__LedgerEntry__c WHERE EventType__c='notification.appowner.waitlist' AND CreatedDate = TODAY` returns ≥1 row matching the signup, with full 5-tuple attribution (Sub__c=test-user-sub, ApplicationId__c=guardians App Id, ClusterId__c=resolved cluster, TenantId__c=resolved tenant, Cause__c null since no payment).
   - The email content includes: the user's email/handle, the app they signed up on, the timestamp, a one-click link back to the iris admin AP detail view for approval.

**Deployment-layer responsibility (out-of-code but in-scope for attestation):**
Per Steward direction, `platform@olympus-grid.com` (the canonical system Identity's email) must be configured at the mail-server layer to forward to a live recipient (the Steward, or eventually delegated to an AI agent's inbox). Without this forwarding, the SendGrid send succeeds but the notification dies in an unattended mailbox. **Verification step in the attestation run:** before the test in #7, confirm the forwarding is configured (send a test email to `platform@olympus-grid.com`, verify it lands in the Steward's live inbox within 1 minute).

**Closure dependencies (and what makes this a downstream Tier 1 BLOCKER):**

- **GAP-44** (AP.Application__c FK not populated on new-row insert) — the resolver needs the FK to be reliable. Until GAP-44 closes, the resolver falls back to the AppKey text-key path, which works but is less referentially safe.
- **GAP-09** (auth email currently SF-native rail) — this notification path uses the same SendGrid rail; closing GAP-09 lays the infrastructure GAP-47 also rides.
- **GAP-04** (MessageEvent__c) — schema-deployed; needs traffic to validate webhook chain. GAP-47 is the first non-confirmation email use case to exercise the chain.
- **GAP-12** (Apex emit) + **GAP-45** (5-tuple stamping) — the `notification.appowner.waitlist` LedgerEntry must stamp 5-tuple correctly for §9.A. Without GAP-45 closed, this event lands attribution-thin.
- **GAP-02** (LedgerEntry.AppKey/Application stamping) — closure precondition for the test query at #7 to work.

**Why this is structurally Tier 1 (operability not optionality):** without GAP-47, the platform cannot be operated by a human or an AI agent in steady state. Every signup is invisible until manually polled. For 7/17 launch when guardians-iOS goes through Apple review and (best case) the App Store, the asymmetry between user expectation ("I signed up; surely someone will respond") and operator reality ("I have no signal anything happened") is unrecoverable.

**Steward feedback:** _(reserved — Steward 2026-06-30 verbatim recorded above; criteria draft pending Steward red-pencil)_

---

## 5. Cross-Cutting Patterns

Several gaps share root causes. Fixing the root cause closes multiple gaps at once.

### Pattern 1 — Apex doesn't emit to Plutus (root cause for 6 gaps)

GAP-12 (root), GAP-13 (AP transitions), GAP-15 (SuperAdmin grant), GAP-18 (Active transition), GAP-23 (Cluster transitions). All are sub-cases of "Apex needs a universal LedgerEntry emit helper + per-trigger emission."

**One fix push** that lands a `LedgerEntryEmitter.cls` helper + adds emissions on Identity / AP / Cluster triggers closes 5 of 9 BLOCKERS plus several must-close items.

### Pattern 2 — Edge bypasses Ares for auth (root cause for 2 gaps)

GAP-19 (email-link bypass, 4-of-4 web surfaces) and GAP-41 (guardians-iOS bypass, both methods). Different surfaces, same root: client code routes auth requests around Ares directly to Salesforce Site URL.

**Fix scope:** decide where the auth audit happens. Either route everything through Ares (changes frontend code on iris + turtleshell + omens), OR have Apex emit explicit `auth.*` LedgerEntries on every auth call.

### Pattern 3 — Templeathena strip incomplete (root cause for 2 gaps)

GAP-25 (gpt bundle stale) and GAP-26 (iris admin dropdown). Both result from iris React publish artifacts not being refreshed after the templeathena strip.

**One iris publish cycle** (re-run `publishOlympusGpt` + `publishPortal` after fixing the React source) closes both.

### Pattern 4 — Schema missing critical attribution fields (root cause for 3 gaps)

GAP-02 (LedgerEntry.AppKey), GAP-21 (Cluster.AppKey), GAP-28 (Identity.PrimaryCause). Each requires a new field on a different SObject.

**One schema deploy** bundles all three field additions into the next og_node_beta_1 release.

### Pattern 5 — Asymmetric cosmos-logos handshake (root cause for 2 gaps)

GAP-30 (turtleshell-web only) and GAP-38 (iOS skips). One Steward intent decision determines whether both close as "fixed" or both close as "documented."

---

## 6. Execution Plan — Minimum Technical Solutions Per Fix

> **Operating mode.** Steward approves / defers / modifies each fix individually before olympus-grid agent starts work on it. **Over-engineering is the explicit concern.** Every fix below is the minimum that satisfies the §9 claim. The "Won't do" column is binding — anything not listed there must be agreed in advance.

### Self-corrections from initial proposal (overhead stripped)

| Original proposal | Replaced with | Why |
|---|---|---|
| `LedgerEventType__mdt` Custom Metadata Type | Plain Apex enum `LedgerEventType` | Adding a new event = one enum value, one commit. CMT was metadata ceremony with no payoff. |
| `LedgerEntryEmitter` static dedup `Set<String>` | None (KISS) | If GAP-11 per-phase wiring is right, no dupes. Add only if a real dupe surfaces in attestation. |
| `subjectIdentityId` payload field on every event | Defer | Add only when admin-on-behalf-of becomes load-bearing. |
| `Identity.Tenant__c` REQUIRED | Lookup only | REQUIRED conversion is a future cleanup. Lookup is enough for 5-tuple stamping. |
| Cross-tenant query rejection on every route | Route-by-route audit later | Too broad for one sprint. Trust-but-verify after Tenant primitive lands. |
| `cluster.health.failed` / `cluster.health.recovered` event types | Reuse `cluster.status.changed` with `reason` in payload | Don't add new event types when an existing one carries the same info (consistency with GAP-24 anti-rec). |
| `cluster.provision.failed` event type | Same — reuse `cluster.status.changed` | Same anti-pattern. |
| `identity.token.minted` event type | Don't add | Doubles LedgerEntry volume with zero new attribution info. |
| `auth.applications.listed` event type on admin dropdown query | Don't add | Low-sensitivity high-frequency admin read. Ares `api.inbound` is sufficient. |

### Approval legend

- ✅ **approved** — proceed
- ⏸ **deferred** — re-raise next cycle
- ✏ **modified** — Steward changed the spec; updated row reflects the change
- ❌ **rejected** — gap stays open; future cycle revisits
- ⌛ **pending** — awaiting approval

### Sprint 1 — Schema foundation (parallel-safe, low-risk, ~1 day)

All pure schema additions. No Apex behavior change. FLS lands in the same commit as the field (per canonical 2026-05-30 rule).

| # | Gap | Minimum fix | Won't do | Approval |
|---|---|---|---|---|
| 1.1 | **GAP-02** | ~~`LedgerEntry__c.Application__c` Lookup~~ → **revised on schema-pattern discovery: `LedgerEntry__c.ApplicationId__c` Text(120)** matching existing ClusterId/TenantId/ShellId pattern + FLS R/W on Olympus_Grid_Admin | No Lookup (would break existing LedgerEntry denormalization pattern); no formula AppKey derivation; no backfill trigger | ✅ committed in `05f8ef30` bundled per Steward option B with prior-session work |
| 1.2 | **GAP-21** | ~~`Cluster__c.Application__c` Lookup~~ → **REVISED per Steward direction (2026-06-28): NO Cluster__c column added.** Creating-app vs runtime-app are different concepts; cluster is application-agnostic at runtime. Audit closes through Pattern 1's `cluster.requested` LedgerEntry → ApplicationId__c stamp (Sprint 1.1 field). | Don't add a Cluster__c lookup or text field; don't imply application-of-record relationship on the cluster | ⏸ deferred — no schema change; closes through Sprint 5 Pattern 1 audit chain |
| 1.3 | **GAP-28a** | `Identity__c.PrimaryCause__c` restricted Picklist with cosmic-7 values + FLS | No Apex wiring (Sprint 7); no event_type (Sprint 7); no migration (Sprint 7) | ⌛ |
| 1.4 | **GAP-33a** | `ApplicationProfile__c.OnboardingComplete__c` Checkbox default false + FLS | No Apex wiring (Sprint 7); no event_type (Sprint 7); no migration (Sprint 7) | ⌛ |
| 1.5 | **GAP-42a** | Add `Degraded` value to `Cluster.Status__c` restricted picklist + field-description sentence | No separate `HealthStatus__c` field | ⌛ |
| 1.6 | **GAP-07** | Verify `api-int` Cluster + platform Identity in seed scripts (mostly done per prior session) | No new SObject changes; no new fields | ⌛ |

**Blocker for 1.3:** Steward to confirm the cosmic-7 picklist values (exact strings) before deploy.

### Sprint 2 — Tenant primitive (GAP-01, ~1 week)

The architecturally heaviest single delivery. Lookups only — no REQUIRED conversion, no every-route cross-tenant reject in this sprint.

| # | Gap | Minimum fix | Won't do | Approval |
|---|---|---|---|---|
| 2.1a | **GAP-01 skeleton** | `Tenant__c` SObject (Name + TenantKey__c External Id + OwnerIdentity__c Lookup-required-Restrict + Active__c + Description__c) + layout + tab + permset (object perms + 3 FLS + tab visibility). NO references on other SObjects yet (that's 2.1b). | No REQUIRED on Identity.Tenant__c (that's 2.1b); no seed (that's 2.2); no JWT tid (that's 2.3); no field-history-tracking; no list views | ✅ committed in `ef7a5148` |
| 2.1b | **GAP-01 lookups (EXPANDED per Steward 2026-06-28)** | Added `Tenant__c` Lookup on **15 SObjects**: Identity, IdentityKey, IdentityToken, Application, ApplicationProfile, ProfileRelationship, Cluster, Conversation, Memory, Task, TaskList, Feedback, Messages, MessageEvent, DynamicObject. All nullable, deleteConstraint=Restrict, FLS on Olympus_Grid_Admin. LedgerEntry skipped (already has TenantId__c Text per existing pattern). **Bonus deliverable in same commit**: 18 SObjects marked `(DEPRECATED)` on label + pluralLabel per Steward direction — Process*/Case*/BusinessProcess (6), TS messaging set (5), EAO logs (4), provider config (2), PortalGroupMember (1). `Olympus-Grid:` or `Enterprise:` brand stripped where the 40-char Salesforce label limit overflowed. | No REQUIRED conversion; no migration backfill (Sprint 2.2); no Apex enforcement (Sprint 2.3+); no normalization of the 8 pre-existing (DEPRECATED)/(Deprecated) inconsistent markers (defer); no `cluster.health.failed` event_type | ✅ committed in `3635a3db` |
| 2.2 | **GAP-01 seed + backfill** | One Tenant row "CloudPremise LLC" with TenantKey='cloudpremise-llc' owned by platform Identity. Seed scripts (alpha + dev) idempotent-upsert the Tenant, then backfill `Tenant__c` lookup on 15 SObjects + `LedgerEntry.TenantId__c` text on existing rows where currently null. DML-row-limit-bounded (9000 rows/SObject) — sufficient for post-wipe alpha + scratch dev; high-volume orgs need Batch Apex follow-up. | No multi-tenant test data; no tenant lifecycle; no Batch Apex for >9000-row tables | ✅ committed in `abd39522` |
| 2.3 | **GAP-01 JWT tid + TransactionContext.tenantId** | `JwtUtil.createJwt` overload that accepts `Map<String, Object> extraClaims`; existing 6-arg signature stays as-is (delegates to new). `ApiRouteAuth` helper `buildJwtExtraClaims(identityId)` performs one SOQL per JWT-mint flow to resolve `tid` from `Identity.Tenant__r.TenantKey__c`. All 6 mint sites in ApiRouteAuth (Apple SIWA × 2, email-link × 2, refresh × 2) pass the extraClaims. `TransactionContext.tenantId` field added as `public String { get; set; }` — settable by the request-validation layer; null on system/async contexts. Standard claims (iss/sub/aud/exp/iat/jti) take precedence — extraClaims cannot override. | No cross-tenant query reject on routes; no tenant claim in OTHER auth paths (ApiRouteIdentityVerification × 8 mint sites, ApiRouteApplicationAuth × 4, ApiRouteOracle × 2, PluginManager × 1, TransactionContext-internal × 1 — total 16 sites still mint un-tid'd JWTs; follow-on cycles); no per-tenant JWT secret rotation; no automatic tenantId population from JWT (caller-driven) | ✅ committed in `2d6dd846` |

### Sprint 3 — AP junction + cid (GAP-08, ~1 week)

| # | Gap | Minimum fix | Won't do | Approval |
|---|---|---|---|---|
| 3.1 | **GAP-08 schema (REVISED per Steward 2026-06-28: Lookup-only, no MD conversion)** | `ApplicationProfile__c.Application__c` Lookup(Application__c), nullable, deleteConstraint=Restrict + FLS on Olympus_Grid_Admin. Seed-script backfill: Map<AppKey, Application.Id> built once, AP rows where Application__c=null AND AppKey__c IS NOT NULL get FK populated. Orphan APs (AppKey doesn't match an Application) logged as Warn + left null. AppKey__c text field kept (no deprecation). Identity__c stays Lookup (no Master-Detail conversion). | No Master-Detail conversion for Identity__c or Application__c (irreversible; defer to a follow-on cycle when sharing rules are designed); no AppKey__c deprecation; no ApplicationProfileTrgHnd refactor (trigger continues using AppKey__c text for IdentityApplicationKey__c stamping) | ✅ committed in `5ec37af9` |
| 3.2 | **GAP-08 JWT cid + TransactionContext.actorApplicationId** | `ApiRouteAuth.buildJwtExtraClaims(Id, String clientId)` signature extended (1-arg form removed — only 3 callers, all internal). Helper now resolves+validates cid via SOQL on `Application__c WHERE AppKey__c=:clientId AND Active__c=true LIMIT 1`. **Validate-at-mint**: throws CLIENT_ERROR if clientId provided but no match; skips cid silently if clientId blank (system contexts + tests). All 6 mint sites in ApiRouteAuth (Apple SIWA × 2, email-link × 2, refresh × 2) pass clientId; refresh flow reads from `refreshRecord.ClientId__c`. `TransactionContext.actorApplicationId` field added as `public String { get; set; }` — mirrors Sprint 2.3 `tenantId` pattern. Standard claims still take precedence — extraClaims cannot override. | NO auto-population of actorApplicationId from JWT validation (caller-driven); NO updates to 16 other JWT mint sites (ApiRouteIdentityVerification × 8, ApiRouteApplicationAuth × 4, ApiRouteOracle × 2, PluginManager × 1, TransactionContext-internal × 1) — they continue to issue cid-less JWTs; NO per-Application JWT secret separation; NO ProfileRelationship adaptations | ✅ committed in `354a3ad9` |
| 3.3 | **GAP-08 cross-app reject primitive** | `TransactionContext.assertCidMatchesAppKey(String requiredAppKey)` helper added. Throws CustomExc('FORBIDDEN') ONLY when actorApplicationId is set, requiredAppKey is non-blank, AND requiredAppKey resolves to a different Application Id than actorApplicationId. Fail-open in all other cases (null actorApplicationId, blank requiredAppKey, unknown requiredAppKey). **NO routes call this in Sprint 3.3 by design** — primitive ships, route-by-route audit is a follow-on cycle. One SOQL per call. | NO route-level enforcement; NO cross-app allow-list config; NO role-aware reject (GAP-27 per-app admin role deferred entirely); NO automatic enforcement on app-scoped URL paths (e.g., `/v1/turtleshell/profile/*`) | ✅ committed in `354a3ad9` (same commit as 3.2) |

### Sprint 4 — Pattern 1 inputs (GAP-10 + GAP-11, ~2-3 days)

May fold into Sprint 5 PR. Listed separately for approval clarity.

| # | Gap | Minimum fix | Won't do | Approval |
|---|---|---|---|---|
| 4.1 | **GAP-10** | Add `TransactionContext.actorIdentityId` (counterpart to `tenantId` from 2.3 + `actorApplicationId` from 3.2). Mark legacy `resolvedIdentity` field + `getResolvedIdentity()` method as `@deprecated` with Apex-doc explaining the ambiguity. Legacy callers continue to work; deprecation signals new code uses `actorIdentityId`. | Don't rip out `resolvedIdentity` callers; no `ITransactionContext` interface restructure; no Logger serialization changes (Apex JSON.serialize auto-picks up new public properties) | ✅ committed in `b965c72f` |
| 4.2 | **GAP-11** | Full code-inspection of `IdentityTrgHnd.cls` (59 lines). Classified Root Cause **A — INSERT + UPDATE in same tx (BENIGN)**. Handler overrides only `onBeforeInsert` + `onBeforeUpdate`; no after-phase code; no `update` DML; no recursive mutations. Root Cause C (recursive bug) ruled out by inspection; Root Cause B (workflow re-fire) ruled out. Permanent classification landed as code-comment at top of `IdentityTrgHnd.cls`. GAP-11 doc entry updated with classification + Pattern 1 wiring spec. | No trigger refactor (none needed — A is benign); no dedup mechanism added in this sprint (deferred to Pattern 1's emitter); no test regression suite | ✅ committed in `b965c72f` |

### Sprint 5 — Pattern 1 spine (GAP-12 + closes-through 13, 15, 18, 23, ~2 weeks)

Load-bearing deliverable. Closes 4 BLOCKERS through it.

| # | Gap | Minimum fix | Won't do | Approval |
|---|---|---|---|---|
| 5.1 | **Event-type registry** | `LedgerEventType` Apex enum (8 values). Adding events = add enum value + register canonical string in `LedgerEntryEmitter.EVENT_TYPE_STRINGS` map + commit. | NO `LedgerEventType__mdt` CMT. NO JSON-schema validation per event. | ✅ committed in `817e9b8f` |
| 5.2 | **`LedgerEntryEmitter.cls` + `LedgerEntry.Sub__c` field + unit tests** | One static `emit(LedgerEventType, Id, Map<String, Object>)` method. Reads 5-tuple from `TransactionContextAttribution.getInstance()` (renamed from TransactionContext during build-stabilization refactor — see GAP-10 update below). New `LedgerEntry__c.Sub__c` Text(120) field for actor identity attribution (mirrors ClusterId/TenantId/ApplicationId/ShellId pattern). FLS on Olympus_Grid_Admin. Unit-tested. | NO dedup invariant. NO async/batch path. NO abstract emitter base class. | ✅ committed in `fe1d6068` |
| 5.3 | **`IdentityTrgHnd` extensions** (closes GAP-15) | After-insert → IDENTITY_CREATED. After-update field-change guards → IDENTITY_EMAIL_VERIFIED (null→non-null), IDENTITY_PRIVILEGE_GRANTED/REVOKED (SuperAdmin__c flip). SOC2 payload for privilege = `{old, new, sfUserId from LastModifiedById, sfUserName from User lookup}`. Bulk-collects User Ids → single SOQL. | NO `subjectIdentityId` payload (Q5 deferred). NO Logger row coupling (Logger ≠ §9 audit). | ✅ committed in `00b95199` |
| 5.4 | **`ApplicationProfileTrgHnd` extensions** (closes GAP-13, GAP-18) | After-insert → PROFILE_CREATED with `{initialStatus, requiresWaitlist}` (requiresWaitlist resolved via ApplicationRegistry, no extra SOQL). After-update on AccountStatus change → PROFILE_STATUS_CHANGED with `{old, new}`. Co-exists with existing waitlist/welcome/approved email logic. | NO `subjectIdentityId` payload (Q5 deferred); NO `reason` field | ✅ committed in `2f7cebd3` |
| 5.5 | **Cluster trigger framework CREATE** (closes GAP-23) | New: `Cluster.trigger` (after-insert + after-update via trigger framework), `ClusterTrgHnd.cls` extending `ISObjectAbstractTriggerHandler`, `Plugin.TRG_HND_Cluster.md-meta.xml` registration, `ClusterTrgHndTest.cls` direct-handler tests (5 test methods). Emits CLUSTER_REQUESTED on insert + CLUSTER_STATUS_CHANGED on Status__c flip with `{old, new, reason: ErrorMessage__c}`. | NO before-trigger logic; NO field-validation triggers | ✅ committed in `355e7b23` |
| 5.6 | **End-to-end attestation test** (`Pattern1AttestationTest.cls`) | Single `fullPattern1Chain_emits7LedgerEntriesWithFullAttribution` test: populates `TransactionContextAttribution` with fake 5-tuple, drives 7-step chain (Identity insert + 2 updates → AP insert + status update → Cluster insert + status update), asserts exactly 7 LedgerEntry rows with correct EventType strings + 5-tuple stamping on every row. | NO UI-attestation; NO multi-surface end-to-end (one chain proves the §9.A claim) | ✅ committed in `484ae593` |

### Sprint 6 — Auth-rail restoration (GAP-04 + GAP-09 + GAP-19, ~1 week)

Restoration from commit 52dfccbe — light scope, mostly checkout-then-wire.

| # | Gap | Minimum fix | Won't do | Approval |
|---|---|---|---|---|
| 6.1 | **GAP-04** | Verify MessageEvent__c SObject fully restored (sharingModel fix already added per prior session). Patch anything missing. | No ECDSA key rotation logic; no new webhook providers | ⌛ |
| 6.2 | **GAP-09 restore** | `git checkout 52dfccbe -- <paths>` for MessagingGateway.cls, MessagingGatewayJob.cls, Plugin.messaging.md, Messages__c.ProviderMessageId__c. | No rewrites; no behavioral changes to gateway | ⌛ |
| 6.3 | **GAP-09 wiring** | ApiRouteAuth magic-link + waitlist routes via MessagingGateway (replacing direct EmailMessage sends). Pivot `testEmailLinkRequest_WaitlistEmailFiresOncePerProfile` from `Limits.getEmailInvocations()` to `Messages__c` count. | No new templates; no template-engine layer | ⌛ |
| 6.4 | **GAP-19 Apex side** | Add AUTH_EMAIL_REQUEST_SENT, AUTH_EMAIL_VERIFY_SUCCEEDED, AUTH_EMAIL_VERIFY_FAILED to LedgerEventType. Emit from ApiRouteAuth at corresponding points. | NO client refactors (iris / cosmos-logos own); NO Ares route confirm (Ares-agent owns) | ⌛ |

### Sprint 7 — Cause + Onboarding lift-outs (GAP-28 + GAP-33, ~3-4 days)

| # | Gap | Minimum fix | Won't do | Approval |
|---|---|---|---|---|
| 7.1 | **GAP-28 write** | Onboarding handler also writes `Identity.PrimaryCause__c = pickedCause`. | No divergence-resolution UI (client concern); no deletion of `AP.ProfileData.cause` JSON key (leave; ignore safer than delete) | ⌛ |
| 7.2 | **GAP-28 audit** | Add IDENTITY_CAUSE_CHANGED to enum. Emit from IdentityTrgHnd.onAfterUpdate on PrimaryCause__c change. Payload `{old, new, source}`. | No double-write protection; no cause-change rate-limit | ⌛ |
| 7.3 | **GAP-28 tithe** | Payment-event handler reads Identity.PrimaryCause__c. Null/unset → write tithe row with `Cause__c = null` + emit TITHE_ATTRIBUTION_DEFERRED. | NO silent route-to-default. NO automatic re-attribution job (lives in §9.R orion-gpt cycle). | ⌛ |
| 7.4 | **GAP-28 migration** | One-off Apex: 4-case decision tree (one-AP / agreed / divergent / none). Idempotent. Logs counts. | No automatic UI prompt for divergent users (manual handling; homer's divergence handled in script directly) | ⌛ |
| 7.5 | **GAP-33 write** | Onboarding handler also writes `AP.OnboardingComplete__c = true`. Same handler change as 7.1. | No JSON-replication | ⌛ |
| 7.6 | **GAP-33 audit** | Add PROFILE_ONBOARDING_COMPLETED to enum. Emit from ApplicationProfileTrgHnd on false→true flip. Empty payload. | (no further reduction) | ⌛ |
| 7.7 | **GAP-33 migration** | One-off script lifts JSON key → first-class column. Idempotent. Leaves JSON key in place. | No JSON deletion | ⌛ |

### Sprint 8 — Bundle pin (GAP-25, conditional on iris, ~1 day)

| # | Gap | Minimum fix | Won't do | Approval |
|---|---|---|---|---|
| 8.1 | **GAP-25** | Update `Plugin.iris_deployment_path_gpt.md-meta.xml` bundleId. Accept new static-resource bundle from iris. 4-way grep consistency. Scratch + alpha deploy. | NO iris React source changes (iris-agent owns); NO main `Plugin.iris.md` change (4-way for /gpt, not 5-way) | ⌛ |

### Sprint 9 — Documentation deliverables (Category C, batched, ~1-2 days)

| # | Gap | Minimum fix | Approval |
|---|---|---|---|
| 9.1 | GAP-05 | `Application__c.EmailTemplates__c` field-description text | ⌛ |
| 9.2 | GAP-17 | Canonical SOQL patterns for last-sign-in / inactivity queries in EOS-5 close-out | ⌛ |
| 9.3 | GAP-20 | `Identity.EmailLastVerified__c` field-description + anti-rec note (Apple must not write this field) | ⌛ |
| 9.4 | GAP-22 | `Cluster.OwnerIdentity__c` field-description clarifies subject vs actor | ⌛ |
| 9.5 | GAP-27 | `Identity.SuperAdmin__c` field-description clarifies global scope + GAP-08 forward-pointer | ⌛ |
| 9.6 | GAP-29 | `IdentityToken.TokenType__c` + `ValidUntil__c` field-descriptions + retention-plan note | ⌛ |
| 9.7 | GAP-32 | §3.AP NFR contract (4-mode visibility table) + `Identity.AppleUserId__c` field-description | ⌛ |
| 9.8 | GAP-39 | Analytics workaround SOQL pattern doc (path-prefix surface inference) | ⌛ |
| 9.9 | GAP-40 | §3 NFR heracles three-scenario intent map doc | ⌛ |

These could fold into earlier sprints (e.g., GAP-22 description with Sprint 5 Cluster trigger work) if Steward prefers. Default: batch at end.

### Out of scope for olympus-grid (other-repo summary)

These do not appear in the sprint plan because olympus-grid does not own delivery. Listed for cross-fleet coordination tracking.

| Gap | Owner repo | Work |
|---|---|---|
| GAP-16 | Ares | Stamp Sub__c on all authenticated api.inbound; post-GAP-08 also stamp Application__c + Tenant__c from JWT claims |
| GAP-24 | Zeus | Remove SendGrid SSM hard-dep in provision-cluster.sh; write Status=Failed + ErrorMessage on real provisioning failures |
| GAP-25 source | Iris | Strip templeathena from `reactforce/olympus-gpt/src/`; run `npm run publishOlympusGpt` |
| GAP-26 | Iris | Admin Application filter React refactor to consume `GET /v1/app/admin/applications` (Apex route already exists) |
| GAP-30 | Iris + cosmos-logos turtleshell-ios + omens | Client-side cosmos-logos handshake (if Steward commits to mandatory stance) |
| GAP-31 | EOS-agent | Attestation report tooling categorizes Path__c into foreground/auth/background/apex |
| GAP-34 | cosmos-logos turtleshell-web | Read `AP.OnboardingComplete__c` post-auth instead of client cache (uses olympus-grid field from Sprint 1) |
| GAP-35 | cosmos-logos turtleshell-web | React useEffect/event-handler dedup on double-fire logout |
| GAP-41 | Omens | guardians-iOS Swift native-bridge auth refactor to call Ares URLs (BLOCKER for 7/17 spine) |
| GAP-42 loop | Zeus | Health-check loop probes EndpointUrl; writes back Status + ErrorMessage |
| GAP-42 UI | Iris | Cluster-picker Degraded badge |

### Steward-decision gates (blocking start)

| # | Decision | Blocks | Notes |
|---|---|---|---|
| D1 | Cosmic-7 picklist values (exact strings) | Sprint 1.3 | Agent has placeholder list from memory; needs Steward-confirmed canonical list before deploy |
| D2 | GAP-28 Option A confirmation (Identity-level only) | Sprint 7 | Agent vote: A. B and C both fail at tithe time. |
| D3 | GAP-30 cosmos-logos handshake stance | GAP-38, GAP-41 partial | Mandatory vs opt-in-with-equivalence. Offgrid is mandatory regardless. |
| D4 | GAP-40 heracles content intent | §9.R cycle (NOT EOS-5) | Per-content RoyaltyConfiguration is the natural shape; defers to a follow-on cycle either way |

---

## 7. Closure Tracking Table

> Update this table as gaps move through the pipeline. Append-only; do not overwrite historical entries.

Legend:
- `[ ]` not started
- `[~]` in progress
- `[x]` done
- `n/a` not applicable

| # | Gap | Dev done | Deployed by Steward | Validated by EOS-5 attestation in prod |
|---|---|---|---|---|
| 01 | Tenant primitive — Sprint 2.1a SObject `[x]` (`ef7a5148`); Sprint 2.1b 15-Lookup + 18-deprecation `[x]` (`3635a3db`); Sprint 2.2 seed + 16-SObject backfill `[x]` (`abd39522`); Sprint 2.3 JWT `tid` claim mint + TransactionContext.tenantId `[x]` (`2d6dd846`) | [x] | [ ] | [ ] |
| 02 | `LedgerEntry__c.ApplicationId__c` Text(120) + FLS on Olympus_Grid_Admin (revised from Lookup to Text per existing schema pattern; committed `05f8ef30`) | [x] | [ ] | [ ] |
| 03 | Cluster owner ≠ Platform | n/a | n/a | n/a (RETIRED) |
| 04 | MessageEvent__c deploy + ECDSA-signed webhook chain | [~] | [ ] | [ ] |
| 05 | Email templates inlined | [ ] | [ ] | [ ] |
| 06 | TurtleShell surface discriminator | [ ] | [ ] | [ ] |
| 07 | Cluster name normalization | [ ] | [ ] | [ ] |
| 08 | AP.Application__c FK Lookup (NOT MD — per Steward 2026-06-28) + AppKey-string backfill (`5ec37af9`); JWT `cid` claim mint+validate-at-mint + `TransactionContext.actorApplicationId` + `assertCidMatchesAppKey` cross-app helper (`354a3ad9`); 16 other JWT mint sites + route-level enforcement deferred to follow-on | [x] | [ ] | [ ] |
| 09 | Auth email routed through MessagingGateway → Messages__c + Tenant + Application stamped + test regression fix | [ ] | [ ] | [ ] |
| 10 | TransactionContext rename — `actorIdentityId` field added + `resolvedIdentity` + `getResolvedIdentity()` marked `@deprecated` (Sprint 4.1) | [x] | [ ] | [ ] |
| 11 | Identity trigger double-fire classified **Root Cause A — BENIGN** (Sprint 4.2; code-comment in `IdentityTrgHnd.cls` + GAP-11 doc entry). Per-phase event_type wiring spec documented for Pattern 1 (Sprint 5). | [x] | [ ] | [ ] |
| 12 | **Pattern 1** — `LedgerEntryEmitter` + `LedgerEventType` enum (8 values) + `LedgerEntry.Sub__c` field + `IdentityTrgHnd`/`ApplicationProfileTrgHnd`/`ClusterTrgHnd` extensions + end-to-end attestation test (`817e9b8f` → `484ae593`). Dedup invariant deferred (Q4 KISS). Anonymous-post-auth elimination is Ares-side (GAP-16). | [x] | [ ] | [ ] |
| 13 | AP `profile.created` + `profile.status_changed` event types wired in `ApplicationProfileTrgHnd.onAfterInsert`/`onAfterUpdate` (closes through GAP-12 / `2f7cebd3`) | [x] | [ ] | [ ] |
| 14 | AP Logger row gap — precondition for GAP-12 resolved inline; remaining sub-question is non-§9, defers cleanly | n/a | n/a | n/a (RESOLVED — non-blocking follow-up) |
| 15 | `identity.privilege_granted`/`identity.privilege_revoked` event types + SOC2 CC6.1 payload (`sfUserId` from LastModifiedById + `sfUserName` from User SOQL) wired in `IdentityTrgHnd.onAfterUpdate` (closes through GAP-12 / `00b95199`). REVOKE+RE-GRANT cleanup of pre-EOS-5 homer grant deferred to alpha-org post-deploy ops. | [x] | [ ] | [ ] |
| 16 | Ares-side anonymous-post-auth elimination + 5-tuple perimeter stamping (Ares agent owns; depends on GAP-01/02/08); olympus-grid contributes schema readiness only | n/a (Ares) | n/a (Ares) | n/a (Ares) |
| 17 | Last-sign-in tracking — closes by non-action (timeline queries on post-GAP-16 LedgerEntry); EOS-5 deliverable is doc-only canonical SOQL patterns | [~] doc | n/a | n/a |
| 18 | AP Approved→Active audit — closes through GAP-13 §5 activation test (no independent work) | n/a | n/a | n/a (SUBSUMED) |
| 19 | Email-link auth — client refactor (iris + turtleshell-web/ios) calls Ares; Ares `/v1/auth/email/link/*` route emits `api.inbound`; Apex emits `auth.email.{request_sent,verify_succeeded,verify_failed}` via Pattern 1 — 6 rows per signup verified | [ ] | [ ] | [ ] |
| 20 | `EmailLastVerified__c` field-description metadata clarifies semantics; formula field + Apple-write changes BOTH explicitly deferred (anti-rec on Apple-write to preserve signal distinction) | [~] doc | n/a | n/a |
| 21 | REVISED 2026-06-28: no Cluster__c column added (Steward direction — cluster is application-agnostic at runtime; creating-app vs runtime-app are distinct concepts). Audit closes through Pattern 1 (Sprint 5 / GAP-12) `cluster.requested` LedgerEntry → ApplicationId__c stamp. | n/a | n/a | n/a (closes through Pattern 1) |
| 22 | `OwnerIdentity__c` field-description clarifies subject semantics; actor derives from LedgerEntry timeline (no new field) — closes through GAP-12/21 | [~] doc | n/a | n/a |
| 23 | Cluster trigger framework CREATED FROM SCRATCH — `Cluster.trigger` + `ClusterTrgHnd.cls` + `Plugin.TRG_HND_Cluster.md` + `ClusterTrgHndTest.cls` (`355e7b23`). Emits `cluster.requested` on insert + `cluster.status_changed` on Status__c flip (with `{old, new, reason: ErrorMessage__c}` payload). | [x] | [ ] | [ ] |
| 24 | Zeus removes SendGrid SSM hard-dep + provisioner writes Status=Failed + ErrorMessage on real failures (multi-repo: zeus owns provisioner; olympus-grid covered via GAP-23) | n/a (zeus) | n/a (zeus) | n/a (zeus) |
| 25 | iris templeathena strip complete + `publishOlympusGpt` + `Plugin.iris_deployment_path_gpt.md` bundle pin + 4-way consistency verified + production visual check | [ ] | [ ] | [ ] |
| 26 | iris React refactor consumes existing `GET /v1/app/admin/applications`; templeathena expunged from iris source; live-update test proves SOQL-driven | n/a (iris owns) | n/a (iris owns) | n/a (iris owns) |
| 27 | Per-app admin role — defer; EOS-5 deliverable is `Identity.SuperAdmin__c` field-description text + locked architectural shape; full implementation post-GAP-08 cycle | [~] doc | n/a | n/a |
| 28 | `Identity.PrimaryCause__c` Picklist + FLS + onboarding writes Identity + tithe reads Identity + `identity.cause.changed` event_type + divergence-resolution UI + migration script + fail-closed on null cause | [ ] | [ ] | [ ] |
| 29 | IdentityToken — EOS-5: field-description text on `TokenType__c` + `ValidUntil__c`; forward: `IdentityTokenCleanupJob` daily Schedulable+Batchable (30-day forensic retention) in future cycle | [~] doc | n/a | n/a |
| 30 | Cosmos-logos handshake — server already conforms; client surfaces (iris, gpt, turtleshell-ios, guardians-iOS, offgrid) coordinate per Steward stance; olympus-grid owns nothing here | n/a (client repos) | n/a | n/a |
| 31 | gpt background polling — attestation tooling categorizes Path__c at query time (EOS-agent owned); olympus-grid contribution = none | n/a (EOS-tooling) | n/a | n/a |
| 32 | EOS-5 = §3.AP NFR contract doc + AppleUserId__c field-description; email-link fallback surfaced equal-weight in UIs (multi-repo coord); `auth.apple.verify_failed` is forward-work via GAP-19 symmetry | [~] doc | [ ] | [ ] |
| 33 | `AP.OnboardingComplete__c` Checkbox + FLS + onboarding handler writes both this and Identity.PrimaryCause__c + `profile.onboarding.completed` event_type + migration alongside GAP-28; per-app JSON validation deferred | [ ] | [ ] | [ ] |
| 34 | turtleshell-web reads `AP.OnboardingComplete__c` post-auth (skip flow if true); iOS parity verified — closes through GAP-33 lift-out; no Apex change (route exists) | n/a (turtleshell-web owns) | n/a | n/a |
| 35 | turtleshell-web React deduplication (useEffect cleanup OR guard flag); end-to-end test asserts ONE `/api/auth/logout` per signout | n/a (turtleshell-web owns) | n/a | n/a |
| 36 | IdentityToken Apple=2 / email=3 — closes automatically when GAP-29 field-description metadata lands; no independent work | n/a | n/a | n/a (SUBSUMED) |
| 37 | Apple SIWA Service ID mismatch | n/a | n/a | n/a (RETIRED) |
| 38 | iOS handshake — closes through GAP-30 (iOS-scoped sub-case; conditional on Steward intent commit) | n/a | n/a | n/a (SUBSUMED) |
| 39 | EOS-5: path-prefix analytics SOQL documented; forward: `LedgerEntry.ClientType__c` Picklist + Ares stamping + multi-repo client `X-Client-Type` header adoption + Pattern 1 default `system`; closes GAP-06 | [~] doc | n/a | n/a |
| 40 | heracles content — EOS-5: §3 NFR intent-map doc; closes through GAP-16 for Scenario B; Scenario C §9.R + perimeter `denied_paths` via §3.AR defer to future cycle (unless gated content in EOS-5 scope) | [~] doc | n/a | n/a |
| 41 | omens Swift native-bridge refactor (auth → Ares URLs); end-to-end Apple + email test on guardians-iOS produces full 6-row count per signup; profile-fetch carries Sub__c — closes through GAP-19 | n/a (omens owns) | n/a | n/a |
| 42 | `Degraded` added to Status picklist (olympus-grid) + zeus health-check loop probes EndpointUrl + writes Status/ErrorMessage + iris picker Degraded badge — audit automatic via GAP-23 | [ ] (olympus-grid: small picklist) | [ ] | [ ] |
| 47 | Application Owner notification trail on signup/waitlist — chain `App → Tenant → Tenant.OwnerIdentity`; Hermes/SendGrid `Messages__c` rail; `notification.appowner.waitlist` LedgerEntry with full 5-tuple; per-Application `NotificationConfig` JSON for programmable-endpoint delegation; depends on GAP-09 + GAP-44 + GAP-04 + GAP-12 + GAP-45 | [ ] | [ ] | [ ] |

### Attestation gate

EOS-5 §13 cannot be closed until:

- **All 11 BLOCKER rows have `[x]` in all three columns:** GAP-04, GAP-08, GAP-12, GAP-13, GAP-15, GAP-16, GAP-19, GAP-28, GAP-41, GAP-42, **GAP-47**
- **All 10 must-close rows have `[x]` in all three columns:** GAP-01, GAP-02, GAP-07, GAP-09, GAP-21, GAP-23, GAP-24, GAP-25, GAP-26, GAP-34
- **Deferred rows have explicit `Steward feedback` entries justifying defer**
- **A subsequent EOS-5 attestation validation run (similar shape to the 2026-06-27 run) demonstrates the BLOCKER and must-close fixes hold against live production telemetry**

---

## 8. Replay Instructions for Future Agent

A future development or validation agent can use this document to:

### To understand WHAT was tested
- Read [Section 1.1](#11-what-was-tested) (scope) and [Section 2](#2-test-environment--provenance) (env).
- The 8 distinct signin events under [Section 1.3](#13-what-is-empirically-broken-the-blocker-chain) summarize the matrix.

### To reproduce a specific gap
- Each gap entry in [Section 4](#4-gap-inventory--sequential-detail) has:
  - **Production use case** — what test scenario triggers it
  - **Empirical evidence** — exact SObject IDs, payload JSON, timestamps, paths
  - **Why it matters** — connection to §9 letter chain and trillion-dollar money posture
  - **Acceptance criteria** — binary testable assertions
- Re-running the same Steward action (e.g., "sign up homer on iris via email") should reproduce the same gap.

### To close a gap
- Read the acceptance criteria — these are binary contracts.
- Implement against the criteria; do not add scope beyond them.
- Run the test in the criterion's "End-to-end test" sub-bullet.
- Update [Section 6](#6-closure-tracking-table) with `[x]` in `Dev done` once the criterion passes locally.
- Steward marks `Deployed by Steward` once landed in prod.
- A subsequent EOS-5 validation run marks `Validated by EOS-5 attestation in prod` once observable in alpha-org telemetry.

### To resume the validation run from where it paused
- The run paused after UC-1 complete + UC-2 partial (cluster provisioning bug).
- Resume path:
  1. Wait for Task #3 (cluster fix) to complete.
  2. Re-validate cluster CL-00006 (eos-5) is Live AND reachable (GAP-42 close).
  3. Begin UC-3 (cluster utilization through eos-5): drive an llm.turn / mcp.tool.call from each surface routed through eos-5; verify 5-tuple attribution lands correctly.
  4. Add new gaps to this document as they surface.

### Companion documents
- [`brain_1.7.eos-5.md`](brain_1.7.eos-5.md) — EOS-5 cycle doc (Steward authoring §1-§5). Appendix A captures the in-flight gap log from the 2026-06-27 run.
- [`README.md`](README.md) — EOS cycle operating manual.
- [`PATENT-DISCLOSURE-DRAFT.md`](../PATENT-DISCLOSURE-DRAFT.md) — patent disclosure for the EOS methodology.

### Post-release validation queue — untested-in-cycle code shipping with the managed package

The following code is in the EOS-5b managed package release (olympus-grid PR #297, `cycle/eos-5b` → `brain/1.7.x.x`) but **was not exercised by the Steward during cycle validation**. Each item gets a post-release validation pass against alpha-org. None blocks the cycle close — they're tracked here so the validation isn't forgotten once the package lands.

**MCP layer (`force-app/mcp/`, committed `05f8ef30` on 2026-06-27)**

What landed:
- `ApiRouteMcpServersHandler.cls` — `GET /v1/mcp/servers` route. Returns list of active `Plugin__mdt` records where `PluginType__c='MCP Server'`. JWT-authenticated. Designed to be called by Poseidon (forwarded from Athena) at conversation start to populate the LLM's tool catalog.
- `Plugin.v1_mcp_servers.md-meta.xml` — route registration.
- `PluginSecurity.v1_mcp_serversPublic.md-meta.xml` — security perm config.
- `Plugin.mcp_weather.md-meta.xml` — example/canonical weather MCP server declaration (configuration JSON only; no live HTTP server backing it on alpha-org).
- `Plugin__mdt.PluginType__c` picklist value `MCP Server` added.

Risk surface:
- Read-only route (`@HttpGet`); no DML, no callouts. Worst case: returns a Plugin metadata record to a client that didn't request it. No write blast radius.
- `without sharing` class — runs in Site Guest context via the cosmos-logos → Hermes → Apex chain. JWT-derived identity is the scoping authority; future per-identity gating planned at the SOQL filter line.
- Apex test coverage shipped (`ApiRouteMcpServersHandlerTest.cls`); CI green.

Validation post-release on alpha-org:
1. `GET /services/apexrest/v1/mcp/servers` with a valid JWT — confirm 200 response shape matches what Poseidon expects.
2. Verify `Plugin.mcp_weather` row is enumerated as an MCP server in the response.
3. Drive an athena chat turn through the homer-holdings (or equivalent customer) cluster — confirm the weather tool appears in the LLM's tool catalog (if Poseidon ingests it). If Poseidon isn't yet ingesting from this route, no harm — the route just isn't consumed.
4. Confirm no unintended exposure: `GET /v1/mcp/servers` without a valid JWT returns 401 (not a list).

Owner: Steward post-release; olympus-grid agent on-call if a defect surfaces.

---

### Memory references load-bearing for this document
- `project_eos_5_canonical_attestation_and_spine.md` — EOS-5 canon definition
- `project_tithe_trigger_is_payment_event_not_consumption.md` — tithe attribution canon (GAP-28 root)
- `project_olympus_grid_is_tithe_funded_not_take_rate.md` — 7% economic model
- `project_hermes_sendgrid_eos_5_nfr_contract.md` — §3.HM contract (GAP-04 + GAP-09 root)
- `project_omens_repo_equals_guardians_appkey.md` — AppKey='guardians' canon
- `project_api_int_canonical_cluster.md` — api-int Cluster row canon
- `project_eos_5_session_handoff_20260619.md` — prior session handoff (GAP-25 templeathena strip context)

---

**Document signed:**
EOS agent · 2026-06-27 · receiver-mode validation run
Steward: G.W. Homer (CloudPremise LLC)

*"this document will be the minimum criteria by which we would ever attest, we can safely take your money. and i mean it. i plan to move trillions through these pipes."* — Steward, 2026-06-27

---

# Appendix B — 2026-06-30 second validation run (empirical updates)

> Receiver-mode validation against the post-PR-#297/#298 schema state. Steward executed; EOS agent observed. Same target environment (alpha-org + eos-5b cluster). The full conversation log captures details; this appendix captures status changes to gaps and new gaps surfaced.

## Status changes (Tier 1 BLOCKERS)

| # | Status change | Evidence |
|---|---|---|
| **GAP-12** | ✅ EMPIRICALLY RESOLVED at emit level | 5 Pattern 1 LedgerEntries fired: 1× `profile.created`, 4× `profile.status_changed` from `IdentityTrgHnd` / `ApplicationProfileTrgHnd` (Pattern 1 emitter from PR #297 Sprint 5.2-5.4 working) |
| **GAP-13** | ✅ EMPIRICALLY RESOLVED | `profile.status_changed` rows include `{old, new, subjectId}` payload on every Waitlist→Approved→Active transition for AP-00095 (guardians) and AP-00096 (iris) |
| **GAP-41** | ✅ FULLY RESOLVED | guardians-iOS Apple SIWA + chat both produce `api.inbound /v1/athena/chat` and downstream agent events; iOS app correctly routes through Ares perimeter |
| **GAP-16** | ⚠ PARTIAL — payload-level resolved, COLUMN level still broken | `api.inbound` payload.user_id carries homer's sub on post-auth calls (e.g., `/v1/athena/chat` request bodies); `LedgerEntry__c.Sub__c` column stays null (rolls into GAP-45) |
| **GAP-28** | ⚠ schema-resolved (Option B/C, not Option A); empirical close pending payment | `AP.Cause__c` + `LedgerEntry.Cause__c/CausePercent__c/TitheAmount__c/PaymentProvider__c` deployed; `Identity.PrimaryCause__c` NOT deployed. Tithe attribution reads from AP-side. Untested at payment-fire level. |
| **GAP-04** | ✅ schema-resolved | `MessageEvent__c` object now deployed in alpha-org `og_node_beta_1` namespace; 0 rows materialized this run (no SendGrid traffic yet exercised) |

## NEW BLOCKERS surfaced this run

### GAP-45 — Pattern 1 emitter does not stamp 5-tuple attribution columns
- **Severity:** 🔴 BLOCKER
- **§9 letter:** A
- **Detected:** 2026-06-30
- **Suggested owner:** olympus-grid (LedgerEntryEmitter.cls)
- **Empirical evidence:** All 5 Pattern 1 events from this run (`profile.created` + 4× `profile.status_changed`) emitted with `Sub__c` = null, `ApplicationId__c` = null, `AppSource__c` = null, `ClusterId__c` = null, `ClusterName__c` = null, `TenantId__c` = null. Payload JSON contains only `subjectId` (the AP Id), `old`, `new`, `initialStatus`, `requiresWaitlist`. The emitter has the values in context (`TransactionContext.actorIdentityId` from Sprint 4, JWT `cid`/`tid` claims via Sprint 2.3/3.2 mints) but doesn't lift them to the LedgerEntry columns at emit time.
- **Acceptance criteria:** Every Pattern 1 LedgerEntry row written by `LedgerEntryEmitter.cls` stamps `Sub__c` (from `TransactionContext.actorIdentityId`), `ApplicationId__c` (from `TransactionContext.actorApplicationId` or AP-row context), `TenantId__c` (from `Identity.Tenant__r.TenantKey__c`), `AppSource__c` (from `Application.AppKey__c`). Pattern is identical for all event_types — single emitter helper change touches everything. End-to-end test: drive UC-1 sign-up; SOQL `SELECT EventType__c, Sub__c, ApplicationId__c, TenantId__c FROM og_node_beta_1__LedgerEntry__c WHERE EventType__c='profile.created'` — 0 nulls in the attribution columns on any row.

### GAP-49 — Athena's llm.turn emitter puts user-sub into `TenantId__c` column
- **Severity:** 🔴 BLOCKER (data correctness — silently wrong attribution)
- **§9 letter:** A · T (tithe attribution would join to the wrong rollup)
- **Detected:** 2026-06-30
- **Suggested owner:** athena emitter
- **Empirical evidence:** Earlier session at 14:48:14 (LE-230385): athena's `llm.turn` row stamped `TenantId__c = "9ba1f82f-9621-45fc-bfdc-3356f7157dc9"` — homer's USER SUB, not the tenant. Same value appeared in `payload.tenant_id`. Other agents (thoth, mnemosyne, apollo) emitted `TenantId__c = "default"` on the same conversation. So athena's emitter is reading something different from the other agents — reaches for the wrong source.
- **Acceptance criteria:** Athena's `llm.turn` event emits with `TenantId__c` = the actual resolved tenant key (e.g., `"cloudpremise-llc"`), matching what the JWT `tid` claim carries. End-to-end test: signed-in homer fires a chat; resulting `llm.turn` row has `TenantId__c="cloudpremise-llc"` AND `Sub__c="9ba1f82f-…"` (the two columns are distinct, sourced from `tid` and `sub` claims respectively).

### GAP-50 — Poseidon MCP tool calls invisible in ledger (not yet tested at tool-call level)
- **Severity:** 🟠 must-close (not yet a confirmed BLOCKER — Poseidon scene loaded but no tool fired in this run)
- **§9 letter:** A · R (royalty / shell-consumption metering)
- **Detected:** 2026-06-30
- **Suggested owner:** poseidon agent
- **Empirical evidence:** Steward navigated to Poseidon scene (`ui.poseidon ready` at 16:21:29 in session log). No quick-weather/quick-forecast tool was actually invoked. **Inference not proof:** when called, Poseidon's MCP tool invocation needs to emit its own `mcp.tool.call` event_type with tool name, args summary, result token cost, shell cost. Currently across the entire `og_node_beta_1__LedgerEntry__c` table: `agent='poseidon'` count = 0.
- **Acceptance criteria:** Invoke any poseidon MCP tool (e.g., `get_forecast(location)`) from athena chat or directly. Resulting LedgerEntry has `EventType__c='mcp.tool.call'`, `AgentId__c='poseidon'`, payload includes `{tool_name, args_hash, result_token_count, latency_ms}`, full 5-tuple attribution.

### GAP-51 — Plutus ingest pipeline lag with no in-flight visibility ← RESTORED FROM WITHDRAWN
- **Severity:** 🔴 BLOCKER (was withdrawn under Steward pushback 2026-06-30 16:18; restored 17:12 after session log proved chat fired but backend never received)
- **§9 letter:** A · V (visibility)
- **Detected:** 2026-06-30
- **Empirical evidence (the smoking gun):** iOS session log from FB-00095 shows `POST /v1/athena/chat status=200 ms=429 requestId=8379cc47891d4d91` at 16:53:25 against `https://api-eos-5b.turtleshell.ai`. Conversation `96cf3ffe-1eae-448f-b073-fbb70c739821` streamed 1,421 chars back from athena. At 16:53:39 iOS fired `POST /v1/plutus/api/ingest status=202`. At 17:12:23 UTC — **18 minutes 58 seconds after the chat fired** — the alpha-org `og_node_beta_1__LedgerEntry__c` table contains **zero rows matching either the requestId or conversationId**, zero non-`api.inbound` events with `Timestamp__c` in the 16:50-17:00 window. Background heracles content fetches continue to ingest with empirically observed 10min – 2h27m lag (Timestamp__c vs CreatedDate divergence).
- **Acceptance criteria:** (a) 95th percentile time-from-Ares-emit to SF `LedgerEntry.CreatedDate` < 60 seconds across event types; (b) `/v1/plutus/health` endpoint returns queue depth + oldest pending message age + processing rate per event_type; (c) deliberately drop one test event; alerting fires within 60s; (d) fire 100 chats; 100/100 visible in SF within 5 minutes.

### GAP-52 — Ares strict-floor self-DoS (rejects 97% of legitimate single-user traffic)
- **Severity:** 🔴 BLOCKER
- **§9 letter:** A · 7/17 launch blocker
- **Detected:** 2026-06-30 (independently verified via 6-task brief from olympus-grid agent)
- **Empirical evidence:** Local Ares stats — `rate_ip.total = 7,579,381` blocks over 36 hours uptime on `compiled-strict-v1` policy. ngrok inspector — 196/200 requests from Steward's IPv6 (`2601:283:5003:6300:b528:8c78:5f3f:5d17`), 194/200 returned HTTP 429. Burst test (70 reqs to non-exempt `/`): 29 succeeded, 41 × HTTP 429. Cloud eos-5b burst pre-fix: 58/70 success + 12 connection errors. Cloud eos-5b burst post-Steward-fix: 70/70 HTTP 200 — fix verified on eos-5b. `defaults.strict.ts` comment "loose enough that one legitimate browser session never trips them" is empirically wrong; math is `per_ip.rpm: 30` (= 0.5 req/sec sustained) which a modern SPA bootstrap exceeds within 2 seconds.
- **Acceptance criteria:** (a) `defaults.strict.ts` floor raised to numbers that accept single-user SPA bootstrap (per_ip.rpm ≥ 600, burst ≥ 1200); (b) misleading comment removed; (c) `ARES_POLICY_JSON` overlay shipped per cluster via zeus CDK provisioner so it survives `cluster.sh` provision; (d) localhost Ares stats `rate_ip.total / uptime_sec` drops below 100 blocks/min across normal-user traffic; (e) burst test 100 reqs to `/v1/athena/chat` from one IP — 100/100 succeed within 60-sec window.

## NEW must-close gaps surfaced this run

### GAP-43 — `Cluster__c.ErrorMessage__c` persists stale after recovery
*(carried forward from 2026-06-27 — re-confirmed today; CL-00007 still shows `"CDK phase 1 failed (exit 1)"` despite Status=Live)*

### GAP-44 — AP-creation does not populate `AP.Tenant__c` lookup OR `AP.Application__c` FK
- **Severity:** 🟠 must-close (precondition for GAP-47)
- **§9 letter:** A · S (multi-tenancy)
- **Empirical evidence:** AP-00095 and AP-00096 both created today. Both have `Tenant__c = null` and `Application__c = null` even though (a) homer's Identity has Tenant linked to CloudPremise LLC, (b) the AppKey text field is populated. The schema columns from PR #297 Sprint 2.1b + 3.1 exist; the trigger handler at insert time doesn't resolve and stamp.
- **Acceptance criteria:** `ApplicationProfileTrgHnd.onBeforeInsert` (or .onAfterInsert if FLS requires) resolves: `Tenant__c` from `Identity__c.Tenant__c` lookup, `Application__c` from `AppKey__c` text-key lookup against `Application__c` table. End-to-end test: insert a new AP via sign-up flow; both lookups are populated within the same transaction. SOQL `SELECT COUNT(Id) FROM og_node_beta_1__ApplicationProfile__c WHERE Tenant__c = null OR Application__c = null` returns 0 for all rows created post-fix.

### GAP-46 — `LedgerEntry.AccountId__c` column has inconsistent shape across emitters
- **Severity:** 🟡 defer · cosmetic
- **Empirical evidence:** Ares-emitted rows have `AccountId__c = "ares/api.inbound/shell-default"` (3-part composite). Apex Pattern 1 emitted rows have `AccountId__c = "profile.created"` (just the event type repeated). Pick one canonical shape.

## Empirical infrastructure observations (informational — not gaps)

- Cluster routing on eos-5b confirmed: every `ui.pantheon boot` in session log shows `cluster:"CL-00007"`. The cluster picker correctly drives traffic to eos-5b.
- JWT mint chain working: IdentityToken__c rows from 14:41:27 (iris signin) and 14:41:45 (guardians signin) carry `cid` (Application ClientId) + `tid` (`"cloudpremise-llc"`) + `sub` (homer's UUID) claims correctly. JWT mint is correctly per-Application, per-Tenant, per-Sub.
- Per-method IdentityToken mint count is 2 per signin (Apple OR email) — not the 8 seen in 2026-06-27. The minting was refactored cleanly.
- Apple SIWA on existing Identity is a no-op on the Identity row (no LastModifiedDate advance). Email-link verify advances `EmailLastVerified__c`.
- 5-surface cross-platform Sub continuity holds: 8 signin events for homer across iris/guardians/gpt/turtleshell-web/turtleshell-ios, all produced `Sub = 9ba1f82f-9621-45fc-bfdc-3356f7157dc9`.

## Steward direction 2026-06-30 — gate sequencing locked

> *"i would not accept money until we know the backend is without fault so we will do the money/impact side after we have all of the data reporting is the system correct"*

**§9.A (attribution) is a prerequisite for §9.T (tithe).** No payment-side testing will be exercised until the §9.A column-stamping chain (GAP-45 + GAP-44 + GAP-16 + GAP-49 + GAP-01) closes empirically. This locks the EOS-5 cycle sequencing: data correctness FIRST, then money flow. This is the right ordering for trillion-dollar pipeline discipline.

## Hand-off to development agents 2026-06-30

Three agents launched by Steward:

- **`olympus-grid` agent** — GAP-45 (5-tuple stamping on Pattern 1) + GAP-44 (AP-insert population) + GAP-47 (AP-Waitlist notification, mirror of `FeedbackNotifyQueueable.cls`)
- **`ares` agent** — GAP-16 (Sub__c column lift from JWT) + GAP-01 (TenantId__c column lift from JWT `tid` claim) + GAP-07 (cluster name normalization) + GAP-52 (strict-floor relaxation + comment fix) + `/v1/plutus/health` endpoint scaffold for GAP-51
- **`athena` agent** — GAP-49 (fix the emitter to read the right JWT claim for tenant)

The next EOS-5 attestation cycle runs the same UC-1/UC-2/UC-3 progression PLUS the payment chain once §9.A is empirically clean. The first time payment fires through a §9.A-clean system, that's the EOS-5 §13 close moment.

**Document signed:**
EOS agent · 2026-06-30 · second validation run + dev hand-off

---

# Appendix C — 2026-07-01 third validation run (post-og-package deploy)

> Receiver-mode validation after: ares PR #61 merged (envelope rename `sub`→`user_identity`), athena PR #100 merged (agent_id split from ATHENA_NODE_ID), and olympus-grid PR #299 + #303 shipped as Beta Package Build to alpha-org. Steward has updated the Tenant seed row so `TenantKey__c=cloudpremise-llc` (GAP-53 closed). New cluster: eos-5d (replaces eos-5c). Steward exercised UC-1 iris signup; downstream still pending.

## Architecture correction that reshapes GAP-45 diagnosis

**Steward correction 2026-07-01 (verbatim):**
> *"it defititely would not hit ares / it should go directly to plutus using platform events / ares is on the cluster / this is a login event that is currently managed by salesforce ddos"*

Pattern 1 emit path is NOT HTTP-through-Ares. It is:

```
SObject DML change (Identity, AP, Cluster)
   ↓
Apex trigger handler
   ↓
LedgerEntryEmitter.cls  ← publishes Salesforce Platform Event with envelope map
   ↓
LedgerEntryPE__e (or similarly-named platform event)
   ↓
LedgerWriterPeHandler.cls  ← subscribes; reads env.get('user_identity'), env.get('tenant_id'), etc.
   ↓
LedgerEntry__c row inserted with column values lifted from envelope
```

Ares is deployed per-cluster and only sees traffic going to a Pantheon (`/v1/athena/*`, `/v1/poseidon/*`, `/v1/mcp/*`, etc.). SF-hosted portal auth (iris signup, waitlist approval, email-link click, Apple SIWA on portal) is fronted by Salesforce's own DDoS + WAF and never touches Ares. Zero `api.inbound` rows on `eos-5d` for a signup is BY DESIGN, not a gap.

**This reshapes the GAP-45 root cause hypothesis.** Same shape as Ares Bug A:
- Ares was emitting `sub` + `user_id`; receiver reads `env.get('user_identity')`. Silent drop.
- Apex `LedgerEntryEmitter.cls` is almost certainly emitting envelope keys that don't match receiver's `env.get(...)` reads.

Empirical evidence supporting this hypothesis: `TenantId__c` populates on non-null pathways where the emitter uses `tenant_id` (Ares side), and stays null on Pattern 1 emitter pathways where the key differs. Same shape for Sub__c / ApplicationId__c / AppSource__c.

## Pre-test baseline (post-wipe state, 2026-07-01 14:02 UTC)

| Object | Count | Notes |
|---|---|---|
| `Tenant__c` | 1 | `cloudpremise-llc` ✅ (GAP-53 closed — was `cloudpremise-lls`) |
| `Identity__c` | 2 | `platform@olympus-grid.com` (system, not SA) + `homer@cloudpremise.com` (SuperAdmin=**True** pre-seeded, Tenant linked, PrimaryCause=None) |
| `Cluster__c` | 2 | `api-int` Live + `eos-5d` Provisioning (fresh cluster) |
| `Application__c` | 0 → 4 (post-package deploy) | Seeded: iris, guardians, olympus-gpt, turtleshell |
| `ApplicationProfile__c` | 0 | fresh |
| `LedgerEntry__c` | 1 orphan | `cluster.status_changed` on eos-5d Provisioning trigger |

## iris signup at 14:17 UTC — empirical results

Steward action: signed up homer for iris access via portal.

Rows fired:
1. `14:17:14` `cluster.status_changed` Provisioning→Live on eos-5d
2. `14:17:21` `profile.created` (AP `a1waZ00000CVJc9QAH`, iris, Waitlist)
3. `14:17:22` `notification.appowner.waitlist` (rich payload; target_app_id resolved to iris Application `a1xaZ000003YbUrQAK`)
4. `14:17:22` `api.inbound` on `int` cluster (unrelated localhost polling — not this signup)

### Status changes for existing gaps

| # | Prior status | New status | Evidence |
|---|---|---|---|
| **GAP-53** | 🔴 typo | ✅ CLOSED | `Tenant__c.TenantKey__c='cloudpremise-llc'` (Steward-hand data fix) |
| **GAP-44 Tenant half** | 🔴 open | ✅ CLOSED | AP `a1waZ00000CVJc9QAH` created with `Tenant__c=a2FaZ000000UzsTUAS` populated at insert |
| **GAP-44 Application half** | 🔴 open | 🔴 STILL OPEN | AP `a1waZ00000CVJc9QAH` `Application__c=null` despite iris Application `a1xaZ000003YbUrQAK` existing at insert time with matching `AppKey__c='iris'`. The notification trigger CAN resolve it (target_app_id populates correctly), but `ApplicationProfileTrgHnd.onBeforeInsert`/`onAfterInsert` does not call the same resolver. |
| **GAP-45 5-tuple stamping** | 🔴 open | 🔴 STILL OPEN | 3/3 Pattern 1 rows have `Sub__c=null, ApplicationId__c=null, TenantId__c=null, AppSource__c=null`. `notification.appowner.waitlist` payload contains full attribution chain (`source_ap_id`, `source_user_identity_id`, `target_app_id`, `target_owner_identity_id`) — values are known to the emitter, just not lifted to receiver's env-keys. Almost certainly the same envelope-key rename bug as Ares Bug A. |
| **GAP-33 field visibility** | 🔴 not deployed | ✅ CLOSED | AP `a1waZ00000CVJc9QAH.OnboardingComplete__c = false` (field exists, defaulted false). `profile.onboarding.completed` event NOT yet observed — will fire on Approved→Active if handler wired. |
| **GAP-28 field visibility** | 🔴 not deployed | ⚠ PARTIAL | `Identity.PrimaryCause__c` field exists (query returns None, not error). Steward homer row has Cause=None. Picklist values not yet verified; will observe on onboarding when written. |
| **GAP-47 (already closed 2026-06-30)** | ✅ | ✅ RE-CONFIRMED | `notification.appowner.waitlist` fires with rich payload for a 3rd surface (iris, was 2 surfaces before). `target_owner_email="platform@olympus-grid.com"`, `target_app_key="iris"`, `target_app_id="a1xaZ000003YbUrQAK"`. Full attribution chain resolves. |
| **cluster.status_changed 5-tuple** | — | 🟠 defensible | ClusterName='eos-5d' ✅ populated. Sub/AppId/Tenant null — trigger context has no JWT, and no SObject FK provides these on the Cluster row. Different sub-case from user-triggered Pattern 1 events (where AP.Identity__c, AP.Tenant__c, AP.Application__c SHOULD be resolvable). |

### GAP-44 sub-bug detail

`ApplicationProfile__c.a1waZ00000CVJc9QAH` created 14:17:20 UTC:
- `AppKey__c='iris'` ✅
- `Tenant__c='a2FaZ000000UzsTUAS'` ✅ (populated at insert — GAP-44 Tenant half works)
- `Application__c=null` ❌
- `Identity__c='a1OaZ000006RliXUAS'` ✅ (homer)
- `AccountStatus__c='Waitlist'` ✅
- `OnboardingComplete__c=false` ✅
- `Cause__c=null`

But `Application__c` with `AppKey__c='iris'` DOES exist as `a1xaZ000003YbUrQAK` (seeded during the same package deploy). Query time:
```sql
SELECT Id FROM Application__c WHERE AppKey__c='iris'
-- returns a1xaZ000003YbUrQAK
```

And the `notification.appowner.waitlist` trigger (which fires 2 seconds after the AP insert) CAN resolve this Application ID via lookup and puts `target_app_id="a1xaZ000003YbUrQAK"` in its payload. So the resolver logic exists in the codebase. It's simply not called in the AP-insert resolver hook.

### GAP-45 sub-detail — envelope-key mismatch hypothesis

`notification.appowner.waitlist` payload proves the emitter has all attribution values in scope:

```json
{
  "subjectId":"a1waZ00000CVJc9QAH",
  "delivery_attempt_id":"a26aZ00000H62zpQAB",
  "channel":"email",
  "source_ap_id":"a1waZ00000CVJc9QAH",
  "source_user_identity_id":"a1OaZ000006RliXUAS",      ← this is homer's sub
  "target_owner_email":"platform@olympus-grid.com",
  "target_owner_identity_id":"a1OaZ000005iwWrUAI",
  "target_app_id":"a1xaZ000003YbUrQAK",                 ← this is iris Application
  "target_app_key":"iris"
}
```

The values needed for the 5-tuple stamping are RIGHT THERE. They're in the payload map. But `LedgerEntry.Sub__c / ApplicationId__c / TenantId__c / AppSource__c` are all null.

Diagnosis (mirroring the Ares Bug A resolution): `LedgerEntryEmitter.cls` is publishing the Platform Event with envelope keys that don't match `LedgerWriterPeHandler.cls:111`'s `env.get('user_identity')`, `env.get('tenant_id')`, `env.get('application_id')`, `env.get('app_source')`.

Fix pattern (per ares agent's diagnosis for Bug A):
- Grep `LedgerEntryEmitter.cls` for the envelope construction (probably `Map<String, Object>` or platform event field setters).
- Rename mismatched keys to match the receiver contract.
- Same class needs to include `application_id` resolved from `AP.AppKey__c` → `Application__c.Id` (same lookup the notification trigger already does).

## Handoff for next dev cycle

**olympus-grid agent** — three items:
1. **GAP-45** — envelope key rename in `LedgerEntryEmitter.cls` to match `LedgerWriterPeHandler.cls:111` receiver contract (`user_identity`, `tenant_id`, `application_id`, `app_source`). Same pattern as ares PR #61.
2. **GAP-44 sub-bug** — `ApplicationProfileTrgHnd.onBeforeInsert` (or `.onAfterInsert`) must call the AppKey→Application lookup that the notification trigger already does. Both resolvers should share a helper method to keep them coupled.
3. **`Application__c` seed** — DisplayName is null on all 4 seeded rows (iris, guardians, olympus-gpt, turtleshell). Either enrich the post-install seed to include DisplayName, or defer with an FLS/description note.

**Other gaps still pending empirical verification** (need downstream flow to fire):
- **GAP-16 (Ares Sub__c)** — needs authenticated chat/analyze through eos-5d Pantheon
- **GAP-49 (Athena TenantId__c wrong-column)** — needs post-#100 chat on `/v1/athena/chat` path (not analyze — analyze path was already correct)
- **GAP-19 (email-link Apple SIWA visibility)** — same as above
- **GAP-33 (profile.onboarding.completed event)** — needs Waitlist→Approved→Active + onboarding completion flow
- **GAP-28 (Identity.PrimaryCause__c writes)** — needs onboarding to fire the cause-select

## Attestation-gate math

Post-2026-07-01 signup:
- BLOCKERS closed: 5 (GAP-04, GAP-12, GAP-13, GAP-15, GAP-41, GAP-47) — was 5 before; GAP-47 re-confirmed
- BLOCKERS still open: 6 (GAP-08, GAP-16, GAP-19, GAP-28, GAP-42, GAP-45) + GAP-44 sub-bug
- Must-close closed: 5 (GAP-01, GAP-23, GAP-53, GAP-14, GAP-3)
- Must-close still open: several (GAP-07, GAP-09, GAP-21, GAP-24, GAP-25, GAP-26, GAP-34)

§9.A empirical close remains gated on: GAP-45 envelope-key fix + GAP-44 Application-FK sub-bug + downstream chat/analyze verification of GAP-16/GAP-49.

## iris signin + first Pantheon chat — 2026-07-01 14:25-14:31 UTC

Steward action sequence:
1. Approved own AP `a1waZ00000CVJc9QAH` from Waitlist to Approved (SF UI)
2. Signed in via Apple SIWA through iris portal (SF-native SIWA)
3. Talked to Athena from iris portal — first authenticated Pantheon chat on `eos-5d`

Events fired:

| Timestamp (UTC) | Event | Notes |
|---|---|---|
| 14:25:30 | `profile.status_changed` Waitlist→Approved | Pattern 1, 5-tuple null |
| 14:27:06 | `profile.status_changed` Approved→Active | Pattern 1, 5-tuple null. Fired on Apple SIWA landing (auto-activation on first signin) |
| 14:30:37 | `api.inbound` on `eos-5d`, POST `/v1/athena/chat` | **Ares PR #61 fix visible: `user_identity="499633cc-..."` in payload** |
| 14:30:39 | `memory.search` agent=mnemosyne | `tenant_id="default"` in payload — **mnemosyne emitter hasn't been updated to lift JWT tid** |
| 14:30:42 | `llm.tokens.input` agent=athena | `tenant_id="cloudpremise-llc"` ✅ |
| 14:30:43 | `llm.turn` agent=athena | `tenant_id="cloudpremise-llc"` ✅ — **GAP-49 CLOSED** |
| 14:30:48 | `llm.tokens.output` agent=athena | `tenant_id="cloudpremise-llc"` ✅ |
| 14:30:53 | `athena.chat.turn` | `agent_id="athena"` + `agent_node_id="eos-5d"` split — **GAP-55 CLOSED** |

### Closes empirically validated this turn

| # | Prior status | New status | Evidence |
|---|---|---|---|
| **GAP-49** | 🔴 open | ✅ **CLOSED** | Athena `llm.turn` at 14:30:43 correctly stamps `tenant_id="cloudpremise-llc"` from JWT tid claim. Athena PR #100 audit was right: 02:57 wrong-value was PR-timing straddle. |
| **GAP-55** | 🔴 open | ✅ **CLOSED** | `athena.chat.turn` at 14:30:53 stamps `agent_id="athena"` literal + `agent_node_id="eos-5d"` split. PR #100 Bug B fix landed. |
| **Ares PR #61 deployed** | pending verification | ✅ CONFIRMED | Both anonymous polling (14:22:49 shows `user_identity:"anonymous"`) and authenticated chat (14:30:37 shows `user_identity:"499633cc-..."`) prove the envelope rename shipped to eos-5d Pantheon. |
| **GAP-53 end-to-end** | ✅ closed at seed | ✅ RE-CONFIRMED | JWT tid claim carries `cloudpremise-llc` (correct spelling). Athena rows correctly write it to TenantId__c column. Zero `cloudpremise-lls` occurrences. |
| **GAP-13 for iris surface** | ✅ closed | ✅ RE-CONFIRMED | Waitlist→Approved (14:25:30) + Approved→Active (14:27:06) both fired with correct payload shape. |

### Critical finding — GAP-16 EMPIRICALLY OPEN AT COLUMN LEVEL

**Ares side works. Receiver side does not.**

The 14:30:37 authenticated `api.inbound` row has:

| Wire field (JSON payload) | Column | Result |
|---|---|---|
| `user_identity: "499633cc-f6e8-44c7-b193-d48f12ea09e1"` | `Sub__c` | ❌ **null** |
| `tenant_id: "cloudpremise-llc"` | `TenantId__c` | ✅ `cloudpremise-llc` |
| `cluster_name: "eos-5d"` | `ClusterName__c` | ✅ `eos-5d` |
| `agent_id: "ares"` | `AgentId__c` | ✅ `ares` |
| (JWT `cid: "iris"` in the JWT header — not extracted to top-level) | `ApplicationId__c` | ❌ **null** |
| (JWT `cid: "iris"` in the JWT header — not extracted to top-level) | `AppSource__c` | ❌ **null** |

Ares PR #61 correctly renamed the emit key from `sub` to `user_identity`. Empirically, the wire carries the value. But `Sub__c` column still stays null.

The `tenant_id` → `TenantId__c` round-trip proves the HTTP-ingest → column-write path DOES work when the receiver knows the key. So there are three possibilities for why `user_identity` doesn't lift:

1. Receiver's env-key allowlist doesn't include `user_identity` (needs to be added)
2. Receiver writes `user_identity` to a different column (name mismatch on the write side)
3. `user_identity` is being dropped between HTTP body parse and Platform Event envelope (if that path chains through PE)

Either way — this is **NOT** an ares gap anymore. Ares side is correct. The lift is a receiver-side omission on the olympus-grid HTTP ingest path (probably a sibling class to `LedgerWriterPeHandler`).

Same shape applies to `ApplicationId__c` and `AppSource__c` — the JWT `cid` claim carries `iris` on this signin, but no column receives it. Neither Ares nor Athena is putting a top-level `application_id` / `app_source` field on the emit envelope. Either:
- Ares/Athena need to decode `cid` from the JWT and stamp it as a top-level envelope field
- OR receiver needs a JWT-decode step that reads `cid` and writes to columns

Either fix pattern is fine; consistency across emitters is what matters.

### Sub-observation — mnemosyne not tenant-aware

`memory.search agent=mnemosyne` at 14:30:39 stamps `tenant_id="default"` in payload. Athena / thoth / ares all correctly write `cloudpremise-llc`. Mnemosyne emitter hasn't been updated to lift JWT tid. Minor gap — call it GAP-56 for the next dev cycle. Not a BLOCKER because Pattern 1 attribution is what §9.A hinges on.

### §9.A empirical close list post-this-turn

- ✅ Cluster stamping (100% of events on eos-5d)
- ✅ Tenant stamping (100% of events on eos-5d EXCEPT mnemosyne = "default" — GAP-56 minor)
- 🔴 Sub stamping (**0%** — value is present at the ares wire since PR #61, receiver doesn't lift)
- 🔴 Application / AppSource stamping (**0%** — JWT `cid` claim not lifted anywhere; needs receiver read or emitter enrichment)

### GAP status delta after this turn

**Closed empirically:** GAP-49, GAP-55 (both athena side)
**Still open (all receiver-side lift bugs, converging pattern):**
- **GAP-45** (Apex Pattern 1 5-tuple stamping — envelope key mismatch)
- **GAP-16** (Ares → column Sub__c lift — receiver-side omission, ares side clean)
- **GAP-44 Application half** (AP-insert Application FK not resolving despite Application record existing in same transaction)
- **GAP-33 / GAP-28** — un-testable until onboarding completes

**New gap surfaced:**
- **GAP-56** — mnemosyne memory.search emitter stamps `tenant_id="default"` instead of lifting JWT tid claim. Minor.

### Hand-off adjustment for next dev cycle

The Ares side of GAP-16 is CLOSED — do not re-assign to ares agent. The remaining Sub__c / ApplicationId__c / AppSource__c lift work is entirely on the **olympus-grid** side (receiver plumbing + JWT decode step). Same class family as GAP-45's envelope-key fix. Both gaps almost certainly close together on a single olympus-grid PR that:

1. Grep `LedgerWriterPeHandler.cls` (Platform Event receiver) — full `env.get(...)` allowlist. Add `user_identity`, `application_id`, `app_source` reads. Wire to Sub__c / ApplicationId__c / AppSource__c columns.
2. Find the sibling HTTP ingest handler (that processes Ares POST `/v1/plutus/api/ingest`) — same allowlist widening.
3. Alternatively: decode JWT once in the receiver, extract `sub` / `cid` / `tid` claims, write to columns. That would close GAP-16 + GAP-45's sub/app halves regardless of what the emitters put in the envelope. More resilient.

The mnemosyne (GAP-56) fix is separate — that's an emit-side fix on mnemosyne agent to source tenant from JWT tid claim like athena/thoth already do.

## Analyze route + guardians signup + turtleshell iris onboarding — 2026-07-01 14:33-14:42 UTC

### 14:33 — image analyze from iris portal

Steward action: uploaded an image, requested athena vision analyze from iris portal.

- `14:33:19` `api.inbound` POST `/v1/athena/analyze` — request_bytes=35356 (35KB image), `user_identity` in payload ✅
- `14:33:23` `athena.analyze` **`agent_id="athena"` + `agent_node_id="eos-5d"` split** ✅
- `14:33:26-48` follow-up chat trace on same conversation: `api.inbound` /v1/athena/chat → `memory.search` → athena `llm.turn`/`chat.turn` chain

**Bonus close from this turn:** athena `agent_id` fix from PR #100 landed on the analyze route too (was `agent_id="eos-5c"` on 2026-06-30's analyze run — now correct across ALL athena emit paths).

Column-level attribution unchanged (Sub__c null, ApplicationId__c null, AppSource__c null on every row). No new signal beyond what the earlier chat turn established.

### 14:36 — guardians signup + waitlist + approve + Apple SIWA (second surface reproduction)

Steward action: signed up for guardians via portal, approved from iris admin, signed in with Apple SIWA.

- `14:36:33` `profile.created` new AP `a1waZ00000CVKrZQAX` (guardians, homer, Waitlist)
- `14:36:34` `notification.appowner.waitlist` — rich payload, `target_app_id="a1xaZ000003YiGDQA0"` (guardians Application), `target_app_key="guardians"`, `target_owner_email="platform@olympus-grid.com"` — GAP-47 chain intact for 4th distinct signup event
- `14:37:30` `profile.status_changed` Waitlist→Approved
- `14:37:39` `profile.status_changed` Approved→Active (fired on Apple SIWA landing)
- `14:37:39` IdentityToken × 2 (access + refresh)

**All 4 Pattern 1 rows have Sub/AppId/Tenant/AppSource null** — GAP-45 deterministically broken on second surface (iris + guardians both fail identically).

**AP `a1waZ00000CVKrZQAX`:** AppKey=guardians ✅, Tenant__c linked ✅, **App=None ❌** — GAP-44 Application-half broken on 2nd distinct AppKey.

### 14:39 — turtleshell iris signup + onboarding attempt (GAP-57 surfaced)

Steward action: signed up for turtleshell iris (Salesforce toolbar LWC), tried to complete onboarding by selecting cause.

- `14:39:41` new AP `a1waZ00000CVL6BQAX` (turtleshell, homer, activated to Active)
- `14:42:32` onboarding write attempt failed with:
  ```
  INVALID_OR_NULL_FOR_RESTRICTED_PICKLIST, Cause: bad value for restricted
  picklist field: ai: [og_node_beta_1__Cause__c]
  ```
- Every one of the 7 tile options (Oceans / Water / Food / Healthcare / Shelter / Education / AI for Those in Need) fails — deterministic mismatch across the whole option set

**AP `a1waZ00000CVL6BQAX`:** AppKey=turtleshell ✅, Tenant__c linked ✅, **App=None ❌** — GAP-44 Application-half broken on 3rd distinct AppKey.

### GAP-57 (new BLOCKER) — turtleshell iris onboarding cause-picklist API-value mismatch

- **Severity:** 🔴 BLOCKER — gates §9.A completeness because `Cause__c` is prerequisite for tithe-attribution rollups (§9.T dependency chain per triage §7). Also blocks GAP-33 empirical verification for the entire cycle — `profile.onboarding.completed` cannot fire until the onboarding transaction commits.
- **§9 letter:** A · T
- **Detected:** 2026-07-01 14:42 UTC
- **Suggested owner:** iris agent (turtleshell iris LWC/React onboarding component)
- **Empirical evidence:** AP `a1waZ00000CVL6BQAX`, error string `INVALID_OR_NULL_FOR_RESTRICTED_PICKLIST` on `og_node_beta_1__Cause__c` with attempted value `"ai"`. Screenshot in session context. Server-side picklist confirmed via SObject describe:
  ```
  Picklist Cause__c on ApplicationProfile__c (Restricted=True):
    api="Save the Oceans"       label="Save the Oceans"
    api="Clean Water for All"   label="Clean Water for All"
    api="Food & Nutrition"      label="Food & Nutrition"
    api="Healthcare for All"    label="Healthcare for All"
    api="Shelter & Housing"     label="Shelter & Housing"
    api="Education & Literacy"  label="Education & Literacy"
    api="AI for Those in Need"  label="AI for Those in Need"
    api="Unassigned"            label="Unassigned"
  ```
- **Root cause:** turtleshell iris onboarding React component's tile grid sends short codes (`"ai"`, `"oceans"`, `"water"`, ...) but the SF-side `Cause__c` picklist expects full labels as API names.
- **Acceptance criteria:**
  1. Each tile in the turtleshell iris onboarding component maps to the exact picklist API name on submit:
     - Oceans → `"Save the Oceans"`
     - Water → `"Clean Water for All"`
     - Food → `"Food & Nutrition"`
     - Healthcare → `"Healthcare for All"`
     - Shelter → `"Shelter & Housing"`
     - Education → `"Education & Literacy"`
     - AI for Those in Need → `"AI for Those in Need"`
  2. End-to-end test: fresh signup → click any tile → `AP.Cause__c` writes the full API name, `OnboardingComplete__c` flips to `true`.
  3. `profile.onboarding.completed` LedgerEntry event fires (per PR #303 GAP-33 scope) — subscribes to `AP.onAfterUpdate` when OldOnboardingComplete=false && New=true.
  4. Verify same fix pattern applies to any other iris-portal-app onboarding surface that reuses the tile grid (turtleshell iOS if it embeds the same static resource, builtsy if the pattern is templated).
- **Non-bug artifact noted, not GAP-worthy:** two `TurtleshellCause` global value sets exist in the alpha-org (`0NtaZ00000018I5SAI` + `0NtaZ00000018LJSAY`). Per Steward: this is the multi-namespace shape (second SF node has its own copy). Not a data-integrity gap.

### GAP-44 Application-half — deterministic across ALL three surfaces this run

| AP Id | Created UTC | AppKey | Tenant__c | Application__c | Application row that SHOULD have resolved |
|---|---|---|---|---|---|
| `a1waZ00000CVJc9QAH` | 14:17:20 | `iris` | ✅ populated | ❌ null | `a1xaZ000003YbUrQAK` exists |
| `a1waZ00000CVKrZQAX` | 14:36:33 | `guardians` | ✅ populated | ❌ null | `a1xaZ000003YiGDQA0` exists |
| `a1waZ00000CVL6BQAX` | 14:39:41 | `turtleshell` | ✅ populated | ❌ null | `a1xaZ000003YrrNQAS` exists |

Three surfaces, three matching Application rows, three null FKs on the AP. The `notification.appowner.waitlist` trigger correctly resolves each one (target_app_id in payload matches the expected Application Id every time), proving the lookup logic works — it's simply not being called from the AP-insert path.

### §9.A empirical close list post-this-turn

- ✅ Cluster stamping (100% of events on eos-5d)
- ✅ Tenant stamping (100% of authenticated events except mnemosyne = "default" — GAP-56)
- ✅ Athena agent_id split (100% of athena rows — chat.turn + analyze)
- 🔴 Sub stamping (**0%** — ares wire clean since PR #61, receiver-side lift missing)
- 🔴 Application / AppSource column stamping (**0%** — JWT `cid` claim never lifted)
- 🔴 AP.Application__c FK backfill at insert (**0%** across 3 surfaces)
- 🔴 Cause__c onboarding write (**0%** — picklist API-value mismatch)

### Updated hand-off for next dev cycle

**iris agent** — new work item:
- **GAP-57** — turtleshell iris onboarding tile grid: map each tile's on-submit value to the exact picklist API name per table above.

**olympus-grid agent** — carried forward from prior turn's synthesis:
- **GAP-45** — envelope key alignment in `LedgerEntryEmitter.cls` (Apex publisher) to match `LedgerWriterPeHandler.cls` receiver's `env.get(...)` keys, PLUS add missing keys (`application_id`, `app_source`) on both emitter and receiver, PLUS JWT-decode step if going that route.
- **GAP-16 remaining half** — same fix pattern for the HTTP-ingest handler that processes Ares POST `/v1/plutus/api/ingest` (sibling class to `LedgerWriterPeHandler`). Ares side is CLOSED.
- **GAP-44 Application-half** — `ApplicationProfileTrgHnd.onBeforeInsert` (or `.onAfterInsert`) call the AppKey→Application lookup that the notification trigger already does; extract to shared helper.

**mnemosyne agent** — new work item:
- **GAP-56** — memory.search emitter reads JWT `tid` claim into `tenant_id` field like athena/thoth/ares already do.

**Steward-side data cleanup** (post-attestation, non-blocking):
- Deduplicate the two `TurtleshellCause` global value sets — expected per multi-namespace shape but worth verifying only the current active one is referenced by AP.Cause__c bindings.

## Guardians chat + poseidon MCP weather tool call — 2026-07-01 14:47-14:48 UTC

### Guardians chat succeeded — GAP-49 REOPENS + guardians allows-pantheon-without-onboarding surfaced

Steward action: talked to athena from within guardians (Godot iOS). Three chat turns fired on trace_ids `3525e21c`, `0a2f7299`, `6da8393f`.

- ✅ Full chain intact: ares → mnemosyne → thoth → athena (claude-sonnet-4-5)
- ✅ JWT decoded on athena.chat.turn confirms `cid=guardians`, `tid=cloudpremise-llc`, `sub=499633cc-...`
- ✅ thoth `llm.turn` correctly stamps `tenant_id=cloudpremise-llc` (three turns, three correct rows)
- ✅ athena.chat.turn stamps `agent_id=athena, agent_node_id=eos-5d, tenant_id=cloudpremise-llc`
- 🔴 **athena `llm.turn` wrapper stamps `tenant_id=499633cc-...` (homer's sub) — GAP-49 REOPENS**

**GAP-49 root cause — matches option 2 from athena PR #100 audit:** guardians client (Godot/omens) sends `x-application-id: <sub>` header. Athena's `ATHENA_ALLOW_LEGACY_APPLICATION_TENANT_ID=true` env var triggers legacy fallback that writes header value into tenant_id. Iris client doesn't send this header, so iris chats read JWT tid correctly (14:30:43 iris llm.turn = correct; 14:47:47 guardians llm.turn = wrong-with-sub).

### GAP-58 (new) — ATHENA_ALLOW_LEGACY_APPLICATION_TENANT_ID env var on eos-5d

- **Severity:** 🔴 BLOCKER (§9.A attribution wrong on all guardians-and-similar clients)
- **§9 letter:** A
- **Detected:** 2026-07-01 14:47 UTC (empirical confirmation of PR #100 audit option 2)
- **Suggested owner:** Steward-side infra (env var flip on eos-5d Pantheon; no code change needed)
- **Empirical evidence:** iris chat 14:30:43 `llm.turn agent=athena tenant_id=cloudpremise-llc` (correct). Guardians chat 14:47:47 `llm.turn agent=athena tenant_id=499633cc-f6e8-...` (sub, wrong). Same code path, differing header from the client determines which side of the legacy branch fires. Athena PR #100 audit explicitly called this out as the diagnosis-if-only-guardians-affected.
- **Acceptance criteria:** Set `ATHENA_ALLOW_LEGACY_APPLICATION_TENANT_ID=false` (or unset) on eos-5d Pantheon. Fire a guardians chat. `llm.turn agent=athena tenant_id=cloudpremise-llc` on the row (not sub). If guardians client breaks because it depends on the legacy behavior, the omens agent gets a hand-off to stop sending `x-application-id` header.

### GAP-59 (design gate — DECISION LOCKED 2026-07-01) — Guardians allows Pantheon consumption without onboarding or Cause

- **Severity:** 🔴 BLOCKER (upgraded from must-close after Path A decision — implementation now required for §13 close)
- **§9 letter:** T (tithe attribution) · R (royalty/shell metering) · A (attribution)
- **Detected:** 2026-07-01 14:47 UTC
- **Steward decision 2026-07-01 (verbatim):** *"sprint f - a) enforce onboarding before any use of seashell expenditure (59)"*
- **Path A LOCKED — Enforce onboarding before any shell expenditure.**
- **Suggested owner:** omens agent (guardians client Pantheon-call gate) + any other client where onboarding is currently optional
- **Empirical evidence:** Guardians AP `a1waZ00000CVKrZQAX` remained `OnboardingComplete=false, Cause=null` through 3 successful chat turns + weather tool call. All guardians `llm.turn` rows had `Cause__c=null` — no tithe target. **Steward has locked the principle: no shell expenditure is allowed until onboarding is complete and Cause is set.**
- **Acceptance criteria:**
  1. Guardians client (omens Godot) blocks all shell-expending Pantheon calls (chat, analyze, MCP tool.call, apollo TTS, mnemosyne read/save, chronos operations) until `AP.OnboardingComplete=true` AND `AP.Cause__c IS NOT NULL`
  2. Server-side backstop: ares perimeter enforces onboarding-gate on shell-expending endpoints via a policy check (query AP by JWT sub, reject if OnboardingComplete=false OR Cause=null, return 403 with a well-known error code)
  3. Same rule applies to any other client where onboarding is currently optional (iris/turtleshell surfaces already enforce this at the client — this locks the platform-wide invariant)
  4. Onboarding-required error surface: client shows an onboarding-required screen when server returns the gate rejection
  5. Read-only endpoints (health, catalog listings if any are truly public post-GAP-71 resolution) remain accessible pre-onboarding
- **Testable outcome:** Fresh Apple SIWA on guardians without completing onboarding → chat request returns 403 with `error=onboarding_required`; after onboarding completes → same chat succeeds and `LedgerEntry.Cause__c` populates on every downstream event.

### GAP-50 RE-DIAGNOSED — Poseidon MCP tool chain is not invoked at all (BLOCKER confirmed via LLM hallucination)

Steward action 14:48-ish: asked athena for Denver weather from within guardians. Weather answer came back to guardians client. **Steward confirmation 2026-07-01: "it does not look like its actually working at all."**

**Empirical ledger scan on eos-5d, last 15 min:**
- Rows with `AgentId__c='poseidon'`: **0**
- Rows with `EventType__c LIKE 'mcp%'`: **0**
- Rows with `EventType__c LIKE 'tool%'`: **0**
- Ares `api.inbound` paths seen: only `/v1/athena/chat` (3×) and `/` (4× health). **Zero `/v1/mcp/servers` hits, zero `/v1/poseidon/*` hits.**
- `athena.chat.turn` payload (full inspection) contains `provider_call, tokens, cost_estimate, conversation, timing` — **NO `tools`, `tool_calls`, or `mcp` metadata field at all. Not even an empty array. The LLM was never told about any tools.**
- Request body size (from ares `api.inbound` metadata): 115 bytes on the first chat turn — too small to carry an `mcpServers[]` array from the client.

**SF-side registry IS deployed and correct:**
```
Plugin__mdt.mcp_weather (PluginType='MCP Server'):
  Configuration__c: {
    "codename":"weather",
    "description":"Weather alerts and forecasts via Open-Meteo. No authentication required. Global coverage.",
    "handler":{"type":"PoseidonRelay","ref":"weather"},
    "auth":{"type":"none"},
    "verbs":[{"name":"get_alerts",...}]
  }
```

**Diagnosis chain (empirically supported):**
1. Client (guardians / iris) did NOT pass `mcpServers[]` in the chat request body (per CLAUDE.md's documented `body.mcpServers` primary connection path)
2. Athena did NOT fetch from the SF-side `ApiRouteMcpServersHandler` `/v1/mcp/servers` route to substitute (no ares row for that path)
3. LLM received a chat completion request with **zero tools registered**
4. LLM answered "Denver weather" with plausible generic climate data from its training corpus — **hallucinated, not tool-called**

The Denver weather answer looked right because Denver's climate is well-known to any modern LLM. A tool-requiring query (e.g., current severe weather alerts for an obscure location) would expose the hallucination.

**Escalation from Appendix B GAP-50:**
- Prior status: 🟠 must-close, "not yet a confirmed BLOCKER"
- **New status: 🔴 BLOCKER** — this is not a telemetry gap. The MCP wire is broken end-to-end. Every "poseidon" or "MCP" claim the LLM makes on this platform is currently fabrication.

**Consequences (widened from original framing):**
- Every guardians/iris/turtleshell user asking a tool-requiring question gets a hallucinated answer that looks authoritative — user-trust risk
- Zero shell-consumption metering for MCP tool calls (§9.R royalty attribution)
- Zero 5-tuple attribution on tool invocations (§9.A)
- The dynamic-registry design (Plugin__mdt-driven MCP catalog) is not wired anywhere on the runtime path — deployed but unused
- Any downstream product feature depending on real tools (real weather, real Salesforce data, real GitHub, real Google Calendar) is silently non-functional

**Acceptance criteria (expanded):**
1. Invoke any poseidon MCP tool via athena chat.
2. Resulting LedgerEntry:
   - `EventType__c = 'mcp.tool.call'`
   - `AgentId__c = 'poseidon'`
   - payload includes `{tool_name, args_hash, result_token_count, latency_ms, mcp_server_codename, mcp_server_source: 'sf-registry' | 'local-config'}`
   - full 5-tuple attribution stamped once GAP-45/16 receiver-side lift lands
3. The `athena.chat.turn` payload contains `tools[]` populated with the SF-registry-derived tool catalog AND (when a tool_use is issued) `tool_calls[]` with the invocation record.
4. Distinguishability test: pose a query requiring a real-time lookup that a training-time LLM cannot know (e.g., current severe weather alerts for Fairbanks, Alaska). Response must reference actual current data, and telemetry must show the corresponding tool invocation.

### GAP-60 UPGRADED to BLOCKER — Dynamic SF-registry not consulted by athena

- **Severity:** 🔴 BLOCKER (upgraded from 🟠 must-close after 14:48 UTC empirical confirmation that the entire MCP chain is not invoked)
- **§9 letter:** V (visibility) · A (attribution proof) · R (royalty enablement blocked)
- **Detected:** 2026-07-01 14:48 UTC (via absence in same scan as GAP-50)
- **Suggested owner:** athena agent (server-side registry-fetch — recommended); OR client-side fetch by each surface (fallback)
- **Empirical evidence:** `Plugin.mcp_weather` exists as `PluginType__c='MCP Server'` in alpha-org and is fully populated with correct handler/verbs/auth JSON. Ares path distribution over the entire Denver-weather test session shows zero `/v1/mcp/servers` hits from any client. Athena's `athena.chat.turn` payload contains no `tools` field at all — meaning athena is not passing tools to the LLM even from a cached-at-startup registry snapshot. So even a cached registry is not the answer; there is no registry consultation happening anywhere on the runtime path.
- **Root cause hypothesis:** athena's MCP setup path (server.ts around the chat request handler) is not wired to fetch from `/v1/mcp/servers` before delegating to the LLM. Either:
  1. The fetch code exists but is gated behind a feature flag that is off on eos-5d
  2. The fetch code was never written (dynamic-registry design was authored on the SF side but not the athena side)
  3. Some earlier hardcoded logic path is running instead
- **Acceptance criteria:**
  1. Athena on boot (or on first chat turn) fetches `GET /v1/mcp/servers` via ApiRouteMcpServersHandler
  2. Emits `mcp.registry.loaded` LedgerEntry with `{source: 'sf', row_count, refresh_at, plugins: [codename...]}` payload
  3. Populates its MCP connection pool from the fetched registry
  4. Every subsequent `athena.chat.turn` includes the fetched tool catalog in its LLM request → payload's `tools[]` field is populated
  5. Auditor can `SELECT * FROM LedgerEntry WHERE EventType='mcp.registry.loaded'` and prove the SF registry was the source of truth

### GAP-61 (new) — Client → athena `mcpServers[]` passthrough contract has no owner

- **Severity:** 🟠 must-close (design gate; blocks the "fallback route" for GAP-50/60 if the server-side registry-fetch design is deferred)
- **§9 letter:** A (attribution) — subsumed under §9.V for MCP tools
- **Detected:** 2026-07-01 14:48 UTC
- **Empirical evidence:** Per CLAUDE.md "MCP Connection Priority", `req.body.mcpServers` (cosmos-logos dynamic) is the **primary path** for how clients inform athena of available MCP tools. Ares metadata on the guardians chat requests shows body sizes of 115 / 2927 / 2929 bytes — too small to carry an `mcpServers[]` array with cosmos-logos manifest URLs and verified: true. So the client is not exercising the primary path either.
- **Question:** Which is the intended design?
  - **Design A (recommended, aligns with the dynamic-registry vision):** athena fetches SF `Plugin.mcp_weather` and similar rows at boot / conversation start. Client sends nothing extra. Simpler client contract; centralized policy.
  - **Design B (client-owned, per current CLAUDE.md doc):** each client (iris, guardians, turtleshell) fetches SF registry, does cosmos-logos handshake per server, includes verified server list in every `body.mcpServers[]`. Client-side burden is high but keeps athena stateless w.r.t. MCP policy.
  - **Design C (hybrid):** athena fetches SF registry as default; clients can override with `body.mcpServers[]` if they want to inject a private/dev MCP server not in the SF catalog.
- **Acceptance criteria:** Steward locks the intended shape; downstream implementation (athena and/or all TurtleShell client surfaces) follows. Whichever design is chosen, GAP-50's `mcp.registry.loaded` + `mcp.tool.call` events must fire in production telemetry — that is the attestation contract regardless of who fetches the registry.

### §9.A/§9.R attestation-gate math post-this-turn

- BLOCKERS closed: 6 (GAP-04, GAP-12, GAP-13, GAP-15, GAP-41, GAP-47)
- BLOCKERS re-opened / added: GAP-49 (re-opened by guardians client header), GAP-50 (upgraded to BLOCKER), GAP-58 (new), GAP-57 (new BLOCKER)
- Must-close added: GAP-59 (design), GAP-60 (visibility)

The attestation ladder cannot close until:
- §9.A: Sub__c/ApplicationId__c/AppSource__c lift lands on Ares HTTP-ingest receiver + Apex Pattern 1 emitter (GAP-16/GAP-45 half + GAP-58 flip)
- §9.R: `mcp.tool.call` event emits with attribution (GAP-50)
- §9.V for dynamic registry: observability event emits (GAP-60)
- §9.T design gate: Path A or Path B decided for guardians-without-onboarding (GAP-59) AND GAP-57 iris client picklist alignment for Cause__c writes to succeed

### Updated hand-off (net delta this turn)

**Steward-side (infra flip):**
- Set `ATHENA_ALLOW_LEGACY_APPLICATION_TENANT_ID=false` on eos-5d Pantheon (GAP-58)
- Decide Path A vs Path B on guardians onboarding enforcement (GAP-59)

**poseidon agent (new):**
- **GAP-50** — every MCP tool invocation emits `mcp.tool.call` LedgerEntry with `{tool_name, args_hash, result_token_count, latency_ms, mcp_server_codename, mcp_server_source}` and full 5-tuple stamping
- **GAP-60** — emit `mcp.registry.loaded` or `mcp.registry.lookup` so registry source is observable

**athena agent (potential):**
- GAP-60 may belong to athena instead of poseidon depending on which service calls the SF registry — coordinate with poseidon agent

**omens agent (potential):**
- If GAP-58 fix lands and guardians client breaks, remove the `x-application-id: <sub>` header — trust JWT tid claim as canonical tenant source

## Guardians Hermes compose — 2026-07-01 15:12-15:13 UTC

Steward action: sent 2 emails from the guardians client's compose feature. Both landed on the SF-native rail.

**Messages__c rows landed:**

| Id | Time UTC | Subject | To | Provider | Status | HermesId |
|---|---|---|---|---|---|---|
| `a26aZ00000H60ehQAB` | 15:12:53 | "A scroll from Olympus" | homer@cloudpremise.com | salesforce | sent | `c72c127b-9051-4881-b2e6-7436b520374f` |
| `a26aZ00000H6FaUQAV` | 15:13:07 | "Does this work" | Greg@cloudpremise.com | salesforce | sent | `8308cad1-ff90-49ae-8a3a-ce43c811518b` |

Both payloads sourced from `data.source: omens-guardians`, `data.senderDisplayName: Homer`, `data.feature: compose`. Identity FK correctly stamped to homer's Identity `a1OaZ000006RliXUAS`.

### Empirical status changes

- ✅ Hermes rail send-flow works end-to-end from guardians client — compose feature reaches Messages__c object with correct discriminator fields
- ✅ Provider=`salesforce` (SF-native lane per §3.HM NFR contract) — dual-lane provider discriminator working
- ✅ HermesId + Direction + SentAt + Status + Subject + To + Identity FK all correctly populated

### GAP-62 (new BLOCKER) — Hermes send emits no LedgerEntry — §9.R royalty attribution has no target

- **Severity:** 🔴 BLOCKER (§9.R shell-consumption metering for messaging is completely silent — parallels GAP-50 for MCP)
- **§9 letter:** R (royalty/shell-consumption metering) · A (attribution) · V (visibility)
- **Detected:** 2026-07-01 15:13 UTC
- **Suggested owner:** olympus-grid (if send is SF-Apex-direct) OR hermes agent (if send crosses Pantheon)
- **Empirical evidence:** 2 Messages__c rows successfully written with `Status=sent`, but the ledger scan `WHERE AgentId__c='hermes' OR EventType__c LIKE 'message%' OR LIKE 'email%' OR LIKE 'notification%'` returns 0 rows in the send window. Zero `hermes.send`, zero `message.sent`, zero `email.dispatched`. No shell-cost row to attribute against for tithe (§9.T) or royalty (§9.R).
- **Cross-reference:** Per memory `project_hermes_sendgrid_eos_5_nfr_contract.md`, hermes was supposed to emit to plutus on every send via hermes PR #58 + plutus PR #38 chain. Either:
  1. That emit was never deployed to eos-5d Pantheon
  2. The emit only fires on the sendgrid lane, not the SF-native lane
  3. The SF-native lane bypasses the Pantheon Hermes entirely (guardians → SF Apex direct → EmailMessage), so no Pantheon-side emit hook fires — in that case the Apex `ApiRouteMessages`-equivalent handler must emit
- **Ares path evidence:** In the same window ares saw 5× `/v1/athena/chat` + 1× `/`. Zero `/v1/hermes/*` — corroborates hypothesis 3 (guardians → SF Apex direct, hermes-Pantheon not on the wire).
- **Acceptance criteria:**
  - Every Messages__c row insert triggers a `message.sent` LedgerEntry with `{hermes_id, provider, channel, direction, to_hash, subject_hash, body_bytes, shell_cost}` payload
  - Full 5-tuple attribution stamped once GAP-45 receiver-side lift lands
  - On the sendgrid lane, additional `message.provider.status` LedgerEntry per SendGrid webhook state (delivered / bounced / opened / clicked)
  - `SELECT COUNT(Id) FROM LedgerEntry__c WHERE EventType__c='message.sent' AND CreatedDate=TODAY` must equal `SELECT COUNT(Id) FROM Messages__c WHERE Status__c='sent' AND CreatedDate=TODAY`

### GAP-63 (new must-close) — Three-touch outbound contract not honored — zero MessageEvent__c children

- **Severity:** 🟠 must-close (audit-trail gap; blocks §3.HM NFR contract compliance)
- **§9 letter:** V (visibility)
- **Detected:** 2026-07-01 15:13 UTC
- **Suggested owner:** olympus-grid (Apex send handler + trigger to emit MessageEvent children)
- **Empirical evidence:** Per `project_hermes_sendgrid_eos_5_nfr_contract.md`: "three-touch outbound (queue → send → status)". Both Messages__c rows have Status=sent but zero `MessageEvent__c` children when queried in the send window. The three-touch state history is not being written.
- **Sub-question:** Is three-touch expected on the SF-native lane, or only on the sendgrid lane where the ECDSA-signed webhooks generate them from external provider callbacks? Memory language implies both lanes ("three-touch outbound") but this may need Steward clarification. If SF-native is a two-touch shape (queue → sent, no provider status), document that carve-out.
- **Acceptance criteria:**
  - Sending a message inserts a `MessageEvent__c` child for each state touch (`queued`, `sent`, and if sendgrid: `delivered`/`bounced`/`opened`/`clicked` from webhook)
  - `SELECT COUNT(Id) FROM MessageEvent__c WHERE Message__c IN (:sentMessageIds) AND EventType__c='sent'` returns 1 per Message on the send side
  - Reconciliation SOQL: `Messages__c.Status__c='sent' AND (SELECT COUNT() FROM Message_Events__r WHERE EventType__c='sent') = 0` returns 0 rows (no orphaned Messages)

### Attestation impact of GAP-62 + GAP-63

Together with GAP-50/60/61, this is now the third functional area (auth + LLM + messaging + tools) where the feature works from a user perspective but the metering/attestation surface is silent. Pattern is consistent: **new EOS-5 shipping code correctly persists domain state (Application__c, LedgerEntry__c, Cluster__c, Messages__c) but does not consistently emit the required attribution telemetry that lets §9.A / §9.R / §9.T close.**

That is the shape of the remaining EOS-5 work: not "features missing" — **"features present, telemetry receivers still catching up to emitters, and some emitters not yet wired."**

### §9 letter chain empirical close status post-Hermes turn

- **§9.V (visibility)** — partial: `notification.appowner.waitlist` works ✅; `hermes.send` / `mcp.registry.loaded` / `mcp.tool.call` missing 🔴; §9.HM three-touch contract not honored 🔴
- **§9.A (attribution)** — partial: cluster + tenant stamping works; sub/app/appsource lift missing on Ares + Apex receivers 🔴; Application FK backfill at AP insert missing 🔴
- **§9.Q (quality)** — untested in this run
- **§9.F (feedback)** — untested
- **§9.T (tithe)** — untestable (Cause null on all user-attributed rows; GAP-57 blocks onboarding on iris; GAP-59 open on guardians)
- **§9.R (royalty/shell-consumption)** — untestable (no MCP tool.call rows, no message.sent rows for royalty rollup)
- **§9.S (sovereignty)** — untested

## Guardians Chronos list + task, then Feedback submit — 2026-07-01 15:19 UTC

Steward action sequence:
1. Created a Chronos list + Chronos task from guardians client
2. Submitted feedback (with session log attached) from guardians client

### Chronos empirical read

**Ares path distribution shows:**
- 2× `POST /v1/chronos/lists`
- 2× `POST /v1/chronos/tasks`

Unlike Hermes SF-native (which bypassed ares), chronos DOES cross the perimeter — chronos-Pantheon god is on the wire. But:
- Zero ledger events with `AgentId__c='chronos'` — chronos itself is not emitting to plutus
- Zero events with `EventType__c LIKE 'chronos%' / 'task%' / 'list%'` — no domain telemetry
- Domain objects (Chronos List / Task SObjects) not sampled in this scan — feature is presumed working since Steward confirms the create succeeded

### Feedback empirical read — landed clean AND surfaces the receiver-side fix pattern

Feedback__c row `a2AaZ000004KwojUAC` (2026-07-01 15:19:16 UTC):

| Column | Value | Notes |
|---|---|---|
| `AppKey__c` | `guardians` | ✅ correctly stamped |
| `ApplicationProfile__c` | `a1waZ00000CVKrZQAX` | ✅ FK resolved to correct guardians AP |
| `IdentitySub__c` | `499633cc-f6e8-44c7-b193-d48f12ea09e1` | ✅ **homer's sub lifted from JWT to top-level column** |
| `Body__c` | `Feedback` | ✅ user-supplied text |
| `ClientVersion__c` | `omens/4.6.2-stable (official)` | ✅ client version carried |
| `DeviceModel__c` | `iPhone16,2` | ✅ device info carried |
| `IncludesSessionLog__c` | `true` | ✅ log attached (likely as ContentDocument or JSON blob) |
| `Source__c` | `Feedback` | ✅ |
| `Status__c` | `New` | ✅ |
| `SubmittedAt__c` | 15:19:16 | ✅ |

**Zero `Logger__c` rows in the window** — logs are ATTACHED to the Feedback row per `IncludesSessionLog=True`, not persisted as discrete Logger__c rows. Steward's phrasing "attached feedback and logs" corroborates: one Feedback row, session log embedded.

### CRITICAL diagnostic — Feedback IS lifting Sub from JWT to column; LedgerEntry is not

**This is the concrete working precedent that closes GAP-45 / GAP-16 receiver-side.**

The Apex handler that inserts Feedback__c (`ApiRouteFeedback` and/or `FeedbackTrgHnd`) successfully decodes the JWT `sub` claim from the request context and stamps `IdentitySub__c` on the row. Same pattern is needed for `LedgerEntry.Sub__c` on both:
- The Ares HTTP-ingest receiver (GAP-16's remaining half)
- The Pattern 1 Platform Event receiver / Apex emitter (GAP-45)

**Hand-off note for og agent:** grep `ApiRouteFeedback` and `FeedbackTrgHnd` for the JWT-sub extraction pattern. Whichever helper resolves `IdentitySub__c` there is the reusable primitive. Wire it into `LedgerWriterPeHandler.cls` (Platform Event receiver) AND the sibling HTTP-ingest handler that processes Ares' POST `/v1/plutus/api/ingest`. Same pattern extends to `ApplicationId__c` (from JWT `cid`) and `AppSource__c` (from JWT `cid`) with the same decode helper.

### GAP-64 (new BLOCKER) — Chronos operations emit no LedgerEntry

- **Severity:** 🔴 BLOCKER (§9.R shell-consumption metering for productivity ops silent — parallels GAP-50 for MCP and GAP-62 for Hermes)
- **§9 letter:** R (royalty/shell-consumption) · A (attribution) · V (visibility)
- **Detected:** 2026-07-01 15:19 UTC
- **Suggested owner:** chronos agent (Pantheon god)
- **Empirical evidence:** Ares saw 2× `POST /v1/chronos/lists` + 2× `POST /v1/chronos/tasks` in the send window. Zero LedgerEntry rows with `AgentId__c='chronos'`, `EventType__c LIKE 'chronos%'`, `LIKE 'task%'`, `LIKE 'list%'`. Chronos crosses the perimeter but doesn't emit its own domain events for the operations it performs.
- **Contrast with Feedback (positive precedent):** feedback submit creates Feedback__c row with full attribution stamped — but ALSO emits nothing to LedgerEntry. Chronos should mirror whatever pattern feedback adopts once fixed.
- **Acceptance criteria:**
  - Chronos emits `list.created` / `list.updated` / `list.deleted` LedgerEntry rows for each list operation
  - Chronos emits `task.created` / `task.updated` / `task.completed` / `task.deleted` LedgerEntry rows for each task operation
  - Each row carries `{list_id, task_id (if applicable), user_action, shell_cost}` payload plus full 5-tuple stamping once receiver-side lift lands
  - Row count reconciles: `SELECT COUNT() FROM Chronos*__c WHERE CreatedDate=TODAY` matches count of `LedgerEntry WHERE EventType LIKE 'list.%' OR 'task.%' AND CreatedDate=TODAY`

### GAP-65 (new must-close) — Feedback submit emits no LedgerEntry `feedback.submitted`

- **Severity:** 🟠 must-close (§9.F feedback loop visibility)
- **§9 letter:** F (feedback) · V (visibility)
- **Detected:** 2026-07-01 15:19 UTC
- **Suggested owner:** olympus-grid (`ApiRouteFeedback` / `FeedbackTrgHnd`)
- **Empirical evidence:** Feedback__c row `a2AaZ000004KwojUAC` lands with ALL attribution stamped correctly (AppKey, ApplicationProfile FK, IdentitySub, ClientVersion, DeviceModel), but zero `feedback.*` LedgerEntry rows in the window.
- **Note:** GAP-04 originally covered a shape like this on the messaging side. This is the feedback-loop analogue. Same architectural pattern.
- **Acceptance criteria:**
  - Feedback__c after-insert trigger emits `feedback.submitted` LedgerEntry
  - Payload includes `{feedback_id, app_key, source, includes_session_log, body_length}` plus full 5-tuple attribution
  - Feedback status transitions (`New → Triaged → Resolved`) emit `feedback.status_changed` events
  - Reconciliation: `SELECT COUNT() FROM Feedback__c` = `SELECT COUNT() FROM LedgerEntry WHERE EventType='feedback.submitted'`

### Pattern that has now emerged across FIVE functional surfaces this run

| Surface | Feature works | Ledger telemetry | Gap |
|---|---|---|---|
| Auth signup (AP create + notification) | ✅ | ✅ Pattern 1 rows fire | GAP-45 5-tuple half open |
| Athena chat + analyze | ✅ | ✅ full chain emits | GAP-16 Sub__c lift + GAP-58 legacy env var open |
| Poseidon MCP tool (weather) | ❌ hallucinated | ❌ zero rows | GAP-50/60/61 blockers |
| Hermes email compose | ✅ | ❌ zero rows | GAP-62/63 blockers |
| Chronos list + task | ✅ | ❌ zero rows | GAP-64 blocker |
| Feedback submit | ✅ + rich attribution | ❌ zero rows | GAP-65 must-close |

**The remaining EOS-5 §9 close work is now overwhelmingly a plutus-emit consistency pass across the domain-object writers** — Hermes, Chronos, Feedback, and any future domain agent — each of which needs to fire a corresponding `<domain>.<action>` LedgerEntry alongside the DML write. The FeedbackTrgHnd pattern for `IdentitySub__c` column-lift is the receiver-side model to copy for the LedgerEntry.Sub__c fix.

### §9 letter chain close status post-Feedback turn (updated)

- **§9.V (visibility)** — partial: `notification.appowner.waitlist` ✅ · `hermes.send` 🔴 · `mcp.registry.loaded` 🔴 · `mcp.tool.call` 🔴 · chronos.* 🔴 · `feedback.submitted` 🔴
- **§9.A (attribution)** — partial: cluster + tenant ✅ · sub/app/appsource lift 🔴 (receiver-side); working precedent found on Feedback__c → replicate to LedgerEntry
- **§9.Q (quality)** — untested this run
- **§9.F (feedback)** — partial: Feedback__c object write works with full attribution ✅ · but no ledger emit + no per-status transition events 🔴
- **§9.T (tithe)** — untestable (Cause null on all attributable rows; GAP-57 blocks iris onboarding; GAP-59 open on guardians)
- **§9.R (royalty/shell-consumption)** — untestable (no MCP tool.call rows, no message.sent rows, no chronos.* rows for royalty rollup)
- **§9.S (sovereignty)** — untested

## GUARDIANS SURFACE — TESTING PHASE COMPLETE 2026-07-01 15:19 UTC

**End of guardians testing.** Steward-declared close of the guardians surface validation phase within this run. Moving to turtleshell-web next.

### Guardians surface — what was exercised

| Surface capability | Result | Gap(s) surfaced |
|---|---|---|
| Signup + waitlist notification | ✅ works with rich attribution payload | GAP-45 5-tuple column stamping still open |
| Waitlist admin approval (from iris) | ✅ Waitlist→Approved fires | — |
| Apple SIWA landing → Approved→Active | ✅ auto-activation works | — |
| Chat with athena (claude-sonnet-4-5) | ✅ end-to-end chain intact | GAP-49 re-opens on chat path via GAP-58 legacy env var |
| Pantheon access without onboarding | ✅ allowed | GAP-59 design gate — Cause=null on all guardians ledger rows |
| Poseidon MCP weather tool | ❌ **hallucinated** — no tool actually called | GAP-50/60/61 BLOCKERS — MCP chain not wired |
| Hermes email compose (SF-native lane) | ✅ Messages__c row lands | GAP-62/63 — no plutus emit, no MessageEvent children |
| Chronos list + task | ✅ crosses ares perimeter cleanly | GAP-64 — no plutus emit |
| Feedback submit (session log attached) | ✅ Feedback__c row lands with FULL 5-tuple attribution incl. IdentitySub__c | GAP-65 — no plutus emit; concrete positive precedent for receiver-side sub lift |

### Guardians surface — what could NOT be tested this phase

- Onboarding flow (`profile.onboarding.completed` LedgerEntry event, `Cause__c` write) — guardians doesn't enforce onboarding; user proceeds without triggering it
- MCP tool call with real §9.A attribution — GAP-50 blocks any observability of tool routing
- Payment / settlement flows — §9.T still gated behind §9.A cleanliness per Steward direction 2026-06-30

### Gaps surfaced during guardians phase (this run)

Newly opened in Appendix C (2026-07-01): **GAP-49 re-open + GAP-53 (closed) + GAP-56 (mnemosyne tenant lift) + GAP-57 (onboarding picklist mismatch) + GAP-58 (athena legacy env var) + GAP-59 (guardians onboarding-optional design gate) + GAP-60 upgraded + GAP-61 (client/server registry contract ownership) + GAP-62/63 (hermes emit + three-touch) + GAP-64 (chronos emit) + GAP-65 (feedback emit)**.

Upgraded from prior appendices: **GAP-50 (BLOCKER, re-diagnosed)**.

Closed during guardians phase: **GAP-49 (once, on iris chat), GAP-53 (Tenant seed typo), GAP-55 (athena agent_id)**.

### Handoff to turtleshell-web phase

The receiver-side plumbing gap set (**GAP-16, GAP-45, GAP-45-sub, GAP-44 Application-half, GAP-56, GAP-58**) will continue to observe as identical bugs on turtleshell-web. Any differences observed on turtleshell-web (different cid claim, different signin flow, different onboarding path, different chat behavior, different tool wiring) are new signal. Same silent-metering pattern (**GAP-50, GAP-60, GAP-62, GAP-64, GAP-65**) will show as identical zero-row scans on turtleshell-web unless code has changed between phases.

The FeedbackTrgHnd → IdentitySub__c working precedent still stands as the reference pattern for the og agent's receiver-side fix, regardless of which surface the next data comes from.

---

# Turtleshell-web validation phase — starting 2026-07-01 15:24 UTC

## Apple SIWA + onboarding — 2026-07-01 15:24 UTC

Steward action: signed into turtleshell-web with homer via Apple SIWA, completed onboarding.

Empirical results:
- AP `a1waZ00000CVL6BQAX` (the SAME row from the earlier turtleshell-iris blocked attempt at 14:39) transitioned:
  - `OnboardingComplete__c`: false → **true** ✅
  - `Cause__c`: null → **`Save the Oceans`** ✅ (correct full picklist API name)
- `profile.onboarding.completed` LedgerEntry fired at 15:24:04 with clean payload `{subjectId, appKey:"turtleshell", new:true, old:false}` — **GAP-33 EMPIRICALLY CLOSED**
- 2× IdentityToken__c (access + refresh) minted for homer at 15:23:39
- Ares path distribution: no `/v1/turtleshell/*`, no `/v1/auth/*` — onboarding write went SF-direct, same shape as iris signin (does NOT match CLAUDE.md's documented turtleshell-web → Ares → Hermes → SF flow)

**Critical corollary — GAP-57 scoped exactly to turtleshell-iris LWC toolbar:**

Turtleshell-web onboarding UI sends `"Save the Oceans"` (correct full picklist API name). Turtleshell-iris toolbar LWC sends `"ai"` / `"oceans"` (short codes). They are **different frontend implementations**. Turtleshell-web is the reference correct one; GAP-57 fix pattern is to align turtleshell-iris LWC to match turtleshell-web's tile-value mapping.

## Feedback + attached logs — 2026-07-01 15:25 UTC

Steward action: submitted post-onboarding survey feedback from turtleshell-web.

Feedback__c row `a2AaZ000004Kx6TUAS`:
- `AppKey__c` = `turtleshell` ✅
- `ApplicationProfile__c` = `a1waZ00000CVL6BQAX` ✅
- `IdentitySub__c` = `499633cc-...` ✅ — **fourth working precedent of receiver-side JWT→column lift**
- `Source__c` = `Survey` (vs guardians `Feedback`)
- `ClientVersion__c` = `turtleshell-web/1.7.4`
- `DeviceModel__c` = full macOS UA
- `StructuredData__c` = `{"answers":{"platform":"Web","onboardingSuccess":"Yes"},"surveyKey":"onboarding-v1"}` — first time this field observed populated
- ContentDocumentLink attached — session log is a real ContentDocument (`069aZ00000ofa4iQAA`), production-grade §9.F evidence
- Zero `feedback.*` LedgerEntry — GAP-65 reproduced on second surface (both guardians and turtleshell-web silent)

## Chat with athena — 2026-07-01 15:26 UTC

Steward action: talked to athena from turtleshell-web.

- Full chain fires correctly on eos-5d: ares → mnemosyne → athena.chat.turn → athena.llm.turn → athena.llm.tokens.input/output (gpt-4o)
- JWT decoded on athena.chat.turn: **`cid=turtleshell, tid=cloudpremise-llc, sub=499633cc-...`** ✅
- Athena `llm.turn` stamps `tenant_id="cloudpremise-llc"` — **not** the sub

### GAP-49 empirical diagnosis SETTLED

Three surfaces × the same JWT tid claim:

| Surface | athena `llm.turn` tenant_id | Behavior |
|---|---|---|
| iris (14:30) | `cloudpremise-llc` | ✅ correct |
| **turtleshell-web (15:26)** | **`cloudpremise-llc`** | ✅ **correct** |
| guardians (14:47) | `499633cc-...` (sub) | ❌ wrong |

Two independent clean surfaces confirm the athena agent's option 2 diagnosis: **guardians client (omens Godot) sends `x-application-id: <sub>` header triggering `ATHENA_ALLOW_LEGACY_APPLICATION_TENANT_ID=true` fallback that stamps header value as tenant**. Iris and turtleshell-web do NOT send that header, so athena reads JWT tid correctly.

**GAP-58 is scoped to guardians client only.** Fix has two levers:
1. Steward-side (recommended, immediate): flip `ATHENA_ALLOW_LEGACY_APPLICATION_TENANT_ID=false` on eos-5d
2. omens agent: remove `x-application-id: <sub>` header from guardians client

Ideally both — the env flip forces guardians to fail loud, omens agent then removes the header cleanly.

**Session persistence works** — a follow-up chat at 15:29:16 uses `session_id=0f0590bc-eb5a-49cb-955d-e4af5a19b669`, which matches the exact conversation ID that was fetched via `GET /v1/mnemosyne/api/conversation/saved/{id}` earlier at 15:27:59. Mnemosyne threads conversation continuity correctly.

## Analyze — 2026-07-01 15:29 UTC

Steward action: submitted analyze from turtleshell-web; response returned correctly.

- 4,077,843 bytes uploaded (~4 MB — substantially larger than guardians' 35 KB analyze earlier)
- `athena.analyze` fires at 15:29:15 with `agent_id="athena", agent_node_id="eos-5d", tenant_id="cloudpremise-llc"` ✅
- Follow-up chat about the analyzed content immediately after (15:29:16)
- Same session_id as prior conversation — persistence extends to the analyze → chat continuation

## Additional turtleshell-web routes observed

Routes exercised on turtleshell-web that were NOT observed on iris or guardians surfaces:

| Route | Purpose | Auth state observed |
|---|---|---|
| `GET /v1/mnemosyne/api/conversation/saved` | List saved conversations | authenticated |
| `GET /v1/mnemosyne/api/conversation/saved/{id}` | Fetch specific saved conversation | authenticated |
| `GET /v1/mnemosyne/api/memory/reflect` | Trigger memory reflection (new event type: `memory.read`) | authenticated |
| `GET /v1/plutus/api/stripe/subscription-status/{sub}` | Stripe subscription check | **anonymous — see GAP-66** |

### GAP-66 (new BLOCKER) — `/v1/plutus/api/stripe/subscription-status/{sub}` accessible anonymously

- **Severity:** 🔴 BLOCKER (§9.S sovereignty exposure)
- **§9 letter:** S (sovereignty) · A (attribution) · V (visibility)
- **Detected:** 2026-07-01 15:28 UTC
- **Suggested owner:** plutus agent (route handler) + ares agent (perimeter enforcement)
- **Empirical evidence:** At 15:28:19 UTC on eos-5d, an `api.inbound` row landed for `GET /v1/plutus/api/stripe/subscription-status/499633cc-f6e8-44c7-b193-d48f12ea09e1` (homer's sub in the path segment) with ares stamping `tenant_id="default"`, `user_identity="anonymous"`. Meanwhile the very next authenticated turtleshell-web calls at 15:29 correctly show `user_identity="499633cc-..."` and `tenant_id="cloudpremise-llc"`. So the client CAN send a JWT — but either did not on this specific call, or ares did not decode it. Result: a billing-state endpoint keyed by user sub is being queried without any auth verification visible in the perimeter telemetry.
- **Two possibilities to distinguish:**
  1. **Client bug** — turtleshell-web's Stripe status probe forgets to attach the Bearer token
  2. **Ares/route bug** — the JWT IS attached but ares' cookieToHeader / jwtMiddleware doesn't fire on this path prefix
- **§9.S risk**: an unauthenticated caller can potentially probe billing state for ANY sub UUID (or worse, cause plutus to leak the subscription status back). Needs verification whether plutus enforces its own auth check independent of ares' claim.
- **Acceptance criteria:**
  1. Every `/v1/plutus/api/stripe/**` request that carries a user-scoped path parameter (sub, customer_id) must arrive at ares with a valid JWT
  2. Ares stamps `user_identity=<sub>` matching the path param, `tenant_id=<correct tenant>`, on the api.inbound row
  3. Plutus's route handler independently verifies `jwt.sub == pathParam.sub` (or the caller has admin/owner scope) — fail-closed on mismatch
  4. Load test: 10 requests with valid JWT and matching sub → all 200; 10 requests with anonymous or mismatched-sub → all 401/403

### GAP-67 (design gate — DECISION LOCKED 2026-07-01) — Memory-reflection + saved-conversation capability parity across ALL clients

- **Severity:** 🟠 must-close (implementation queued after Steward decision; multi-client surface parity work)
- **§9 letter:** V (visibility) · design/UX consistency
- **Detected:** 2026-07-01 15:28 UTC
- **Steward decision 2026-07-01 (verbatim):** *"67 - all clients should have memory and conversation history including omens"*
- **Path locked — Full cross-surface parity for memory-reflection and conversation history. Every client, including omens.**
- **Suggested owners:** iris agent (turtleshell-iris LWC + olympus-gpt + templeathena + builtsy React surfaces) · iOS agent (turtleshell-iOS) · omens agent (guardians Godot iOS) · mnemosyne agent (server-side contract confirmation)
- **Empirical evidence:** Route `GET /v1/mnemosyne/api/memory/reflect` + `/v1/mnemosyne/api/conversation/saved` + `/v1/mnemosyne/api/conversation/saved/{id}` exercised only during turtleshell-web session. Guardians (iOS), turtleshell-iOS, iris portal, olympus-gpt, templeathena — none called those routes. Turtleshell-web is the sole surface with the integration wired.
- **Acceptance criteria:**
  1. Turtleshell-web integration shape is the reference. Document the client contract in §3 NFR (mnemosyne section) so all clients hit the same server-side routes with the same JWT auth pattern.
  2. **Guardians (omens Godot)** — surfaces a memory-reflection interaction + saved-conversation history browser. Design pattern for the mobile/Godot surface may differ from React web (list scroll vs. modal); the API contract is the same.
  3. **Turtleshell-iOS** — same routes wired; likely same tree as turtleshell-web given shared AppKey.
  4. **Iris portal / olympus-gpt / templeathena / turtleshell-iris LWC** — memory-reflection + saved-conversation UI in each surface.
  5. Every client's calls to `/v1/mnemosyne/*` land in ares with proper JWT attribution (per GAP-71 auth contracts).
  6. `memory.read` event and any new mnemosyne event types emit correct 5-tuple attribution (post-GAP-56 fix which brings mnemosyne's `tenant_id` in line with athena/thoth).
- **Testable outcome:** Fresh signin on any client → user can browse saved conversations + trigger a memory-reflection. Each interaction produces a `memory.read` (or corresponding event) LedgerEntry with correct AppSource / Sub / Tenant.

## GAP status delta after this phase

**Closed empirically during turtleshell-web phase:**
- **GAP-33** — `profile.onboarding.completed` fires on OnboardingComplete transition (empirical evidence 15:24:04)
- GAP-57 remains scoped-to-turtleshell-iris (turtleshell-web is clean)
- GAP-49 stays clean on turtleshell-web (adds a second independent clean surface to the diagnosis)

**Still open (unchanged shape):**
- GAP-45 (Pattern 1 5-tuple stamping) — profile.onboarding.completed row has all 5-tuple columns null
- GAP-44 Application-half — AP still `Application__c=null`
- GAP-16 (Ares Sub__c → column) — receiver-side plumbing still not lifting
- GAP-56 (mnemosyne tenant_id=default) — still null on both memory.search and new memory.read
- GAP-58 (ATHENA_ALLOW_LEGACY env var) — SETTLED as guardians-scoped
- GAP-65 (feedback ledger emit) — reproduced on second surface
- GAP-50/60/61 (MCP chain) — not exercised on turtleshell-web this session

**New this phase:**
- **GAP-66** (BLOCKER, §9.S) — plutus stripe subscription-status route accessed anonymously
- **GAP-67** (must-close, design) — mnemosyne memory/reflect capability asymmetric across client surfaces

## Turtleshell-web phase summary — capability rollup

| Surface capability | Result | Notes |
|---|---|---|
| Apple SIWA landing | ✅ works | 2 IdentityToken minted |
| Onboarding (Cause selection) | ✅ works with correct picklist values | GAP-57 does not apply to turtleshell-web |
| `profile.onboarding.completed` LedgerEntry fires | ✅ CLOSED GAP-33 empirically | payload shape clean |
| Chat with athena | ✅ works end-to-end | GAP-49 clean; JWT cid=turtleshell |
| Analyze (4 MB upload) | ✅ works end-to-end | agent_id/tenant/cluster stamped correctly |
| Feedback submit with attached log | ✅ works with rich attribution | GAP-65 silent-emit reproduced |
| Session persistence (mnemosyne saved conversations) | ✅ works | new route family observed |
| Memory reflection | ✅ works — surface-exclusive | GAP-67 asymmetry question |
| Stripe subscription check | ✅ works — BUT anonymous | GAP-66 sovereignty gap |
| MCP tool call | not exercised this phase | — |
| Hermes email compose | not exercised this phase | — |
| Chronos list/task | not exercised this phase | — |

## Turtleshell-iOS phase — 2026-07-01 15:31 UTC

Steward action sequence:
1. Signed into turtleshell-iOS with homer via Apple SIWA
2. Chatted with athena
3. Uploaded an attachment (analyze)
4. Left feedback with attached session log

### Chain observed (15:31:54 through 15:33:46)

- `15:31:54` — 2× IdentityToken__c (access + refresh) minted, homer Identity
- `15:32:32` — `POST /v1/athena/chat` (512 bytes text chat)
- `15:32:33-45` — mnemosyne memory.search → athena.chat.turn → llm.turn (gpt-4o) → tokens (JWT `cid=turtleshell, tid=cloudpremise-llc`)
- `15:32:48` — `POST /v1/athena/analyze` (**42,210 bytes** — modest attachment)
- `15:32:49` — `athena.analyze` fires (`agent_id="athena", tenant_id="cloudpremise-llc"`)
- `15:32:52-33:08` — Follow-up chat about attachment
- `15:33:46` — Feedback__c row `a2AaZ000004KxWHUA0` inserted with attached log

### Feedback__c row detail

| Field | Value |
|---|---|
| `AppKey__c` | `turtleshell` ✅ |
| `ApplicationProfile__c` | `a1waZ00000CVL6BQAX` ✅ (same AP as turtleshell-web — shared AppKey natural-key) |
| `IdentitySub__c` | `499633cc-...` ✅ (fifth working precedent of receiver-side JWT→column lift) |
| `Body__c` | `iOS` |
| `ClientVersion__c` | `turtleshell-ios/1.7.4` ✅ |
| `DeviceModel__c` | `iPhone · iOS 26.5 · turtleshell-ios` ✅ |
| `Source__c` | `Survey` |
| `StructuredData__c` | `{"surveyKey":"onboarding-v1","answers":"{\"platform\":\"iOS\",\"onboardingSuccess\":\"Yes\"}"}` |
| `IncludesSessionLog__c` | `true` |

### GAP-49 empirical diagnosis TRIPLE-confirmed

Three clean surfaces × one broken surface — guardians client (omens Godot) is the confirmed outlier:

| Surface | athena `llm.turn` tenant_id | Behavior |
|---|---|---|
| iris (14:30) | `cloudpremise-llc` | ✅ correct |
| turtleshell-web (15:26) | `cloudpremise-llc` | ✅ correct |
| **turtleshell-iOS (15:32:43, 15:33:01)** | **`cloudpremise-llc`** | ✅ **correct** |
| guardians (14:47) | `499633cc-...` (sub) | ❌ wrong |

GAP-58 fix path is locked. Steward-side env flip + omens client header removal will close it deterministically.

### Turtleshell-iOS did NOT exercise routes that turtleshell-web did

- No `/v1/mnemosyne/api/conversation/saved` — no conversation-history fetch on iOS
- No `/v1/mnemosyne/api/memory/reflect` — no memory-reflection on iOS
- No `/v1/plutus/api/stripe/subscription-status/{sub}` — no Stripe check on iOS

So both **GAP-66 (Stripe anonymous)** and **GAP-67 (memory-reflect surface asymmetry)** stay scoped to turtleshell-web. Iris, guardians, and now turtleshell-iOS all confirmed not exercising these routes. Turtleshell-web is the only surface with those integrations wired.

### GAP-68 (new must-close) — StructuredData__c shape drift between turtleshell clients

- **Severity:** 🟠 must-close (client contract drift; breaks downstream analytics that assume one serialization shape)
- **§9 letter:** V (visibility · consistency) · F (feedback pipeline integrity)
- **Detected:** 2026-07-01 15:33 UTC
- **Suggested owner:** iOS agent (turtleshell-ios client serialization) — align to turtleshell-web reference shape
- **Empirical evidence:** Same `Feedback__c.StructuredData__c` field, two different `turtleshell/1.7.4` clients, two different JSON shapes on `answers`:

  Turtleshell-web (15:25):
  ```json
  {
    "answers": {"platform": "Web", "onboardingSuccess": "Yes"},
    "surveyKey": "onboarding-v1"
  }
  ```
  `answers` is a **nested object**.

  Turtleshell-iOS (15:33):
  ```json
  {
    "surveyKey": "onboarding-v1",
    "answers": "{\"platform\":\"iOS\",\"onboardingSuccess\":\"Yes\"}"
  }
  ```
  `answers` is a **JSON-string** (escape-encoded).

- **Impact:** Downstream reader `structured_data.answers.platform` works on web, requires JSON.parse() on iOS. Any SF-side apex trigger or reporting query that treats `answers` as a nested object will silently fail or read nothing on iOS-sourced rows.
- **Recommended fix:** Turtleshell-web is the reference-correct shape (matches CLAUDE.md's structured-data contract convention). iOS client changes its emit code to send `answers` as a nested object, not a stringified JSON.
- **Acceptance criteria:**
  1. Fresh turtleshell-iOS feedback submit results in `StructuredData__c.answers` being a nested object (not a JSON string)
  2. `SELECT StructuredData__c FROM Feedback__c WHERE ClientVersion__c LIKE 'turtleshell-ios%'` — the returned JSON has `answers` as object-typed
  3. Downstream analytics query `structured_data.answers.platform` returns non-null for both web AND iOS rows
  4. Existing iOS-sourced rows with the drift shape can be left as-is (backfill optional) OR migrated with a small Apex batch

### Turtleshell-iOS phase capability rollup

| Surface capability | Result | Notes |
|---|---|---|
| Apple SIWA landing | ✅ works | 2 IdentityToken minted |
| Chat with athena | ✅ works | JWT cid=turtleshell, tenant lifted correctly |
| Analyze (42 KB attachment) | ✅ works | agent_id="athena", session_id continuity |
| Feedback submit + attached log | ✅ works with correct FK/Sub attribution | GAP-65 silent-emit reproduced (4th surface confirmation) |
| Onboarding | not exercised — AP already onboarded via turtleshell-web at 15:24 | expected: same shared AP a1waZ00000CVL6BQAX |
| Mnemosyne saved-conversation fetch | not exercised | route not called from iOS |
| Memory reflection | not exercised | GAP-67 asymmetry confirmed |
| Stripe subscription-status | not exercised | GAP-66 exclusive to turtleshell-web |
| MCP tool call | not exercised | — |
| Hermes email compose | not exercised | — |
| Chronos list/task | not exercised | — |

## Olympus-gpt phase — 2026-07-01 15:46 UTC

Steward action sequence:
1. Signed up for olympus-gpt access as homer via gpt web application
2. Approved own AP from Waitlist (via iris admin)
3. Landed on gpt as Active, completed onboarding
4. Sent 2 feedbacks
5. Chatted with athena from gpt

### Signup + onboarding chain (SF-native)

- `15:46:42` `profile.created` — new AP `a1waZ00000CVPhZQAX` (olympus-gpt, homer, Waitlist)
- `15:46:43` `notification.appowner.waitlist` — rich payload, `target_app_id="a1xaZ000003YkmfQAC"` (olympus-gpt Application), `target_app_key="olympus-gpt"` ✅
- `15:46:49` `profile.status_changed` Waitlist→Approved (7 seconds after signup)
- `15:48:10` `profile.status_changed` Approved→Active
- `15:48:18` **`profile.onboarding.completed`** — GAP-33 confirmed CLOSED on **second surface** (turtleshell-web was first at 15:24, now olympus-gpt)

AP `a1waZ00000CVPhZQAX` final state:
- AppKey=`olympus-gpt` ✅
- Tenant__c populated ✅
- **App=None** ❌ — GAP-44 Application-half **deterministic on 4th distinct AppKey** (iris/guardians/turtleshell/olympus-gpt)
- Status=`Active` ✅
- OnboardingComplete=`true` ✅
- Cause=**`Education & Literacy`** ✅ (different picklist value from turtleshell-web's "Save the Oceans" — confirms multi-value works)

### Feedback × 2

Rows `a2AaZ000004Ky8zUAC` (15:48:31 "here is feedback") and `a2AaZ000004KyCDUA0` (15:49:26 "second feedback"):

- ✅ AppKey=`olympus-gpt`, ApplicationProfile FK, IdentitySub__c all correct (6th and 7th working precedents of receiver-side JWT→column lift)
- ✅ Source=`Feedback` (free-form, no StructuredData — differs from turtleshell-web/iOS survey Source)
- ✅ DeviceModel captured (macOS Mozilla UA)
- ✅ IncludesSessionLog=true
- ❌ Zero `feedback.*` LedgerEntry emitted — GAP-65 pattern reproduced on 5th surface

### Chat with athena — ANONYMOUS (BLOCKER)

- `15:49:10` `POST /v1/athena/chat` — **`tenant_id=default, user_identity=anonymous`** ❌ (57 bytes body — a small text prompt)
- `15:49:14` `athena.chat.turn` — **`tenant_id=default`** ❌
- `15:49:23` `llm.turn agent=athena` — **`tenant_id=default`** ❌

Steward was signed in as homer with a valid Apple SIWA session. Every other surface's chat (iris, turtleshell-web, turtleshell-iOS, guardians) correctly stamps `tenant_id=cloudpremise-llc`. **Gpt is the outlier — chat runs anonymously.**

### Route-by-route JWT attachment inventory on olympus-gpt session

| Route | Auth state | Notes |
|---|---|---|
| `POST /v1/athena/chat` | 🔴 **anonymous** | User is signed in — SHOULD be authenticated. This is the actual LLM consumption path. |
| `GET /v1/plutus/quota/{sub}` × 2 | ✅ authenticated (`cloudpremise-llc`) | New route surfaced; homer's sub in path, correctly auth'd (contrast with GAP-66 stripe path) |
| `GET /v1/chronos/api/lists` | 🔴 anonymous | — |
| `GET /v1/proteus/api/types` | 🔴 anonymous | new route surfaced |
| `GET /v1/apollo/voices` | 🔴 anonymous | new route surfaced |
| `GET /v1/apollo/providers` | 🔴 anonymous | new route surfaced |

Only `/plutus/quota/` gets the JWT. Every other call — including the LLM consumption — goes anonymous. Systematic JWT attachment failure on the gpt web client for all routes EXCEPT plutus/quota.

### GAP-69 (new CRITICAL BLOCKER) — olympus-gpt client fails to attach JWT on authenticated endpoints — SECURITY

- **Severity:** 🔴 **CRITICAL BLOCKER — SECURITY** (Steward: "the auth is a big deal it should definitely require a valid auth for the gpt api calls that feels like a major security issue")
- **§9 letter:** S (sovereignty — tenant isolation broken) · A (attribution missing) · R (royalty/shell-consumption unattributable) · V (visibility corrupted)
- **Detected:** 2026-07-01 15:49 UTC
- **Suggested owner:** iris agent (olympus-gpt React app in `iris/reactforce/gpt/` or wherever the gpt bundle lives)
- **Empirical evidence:** During homer's authenticated olympus-gpt session at 15:49 UTC, 5 of 6 Pantheon endpoints called from the gpt client landed at ares with `user_identity="anonymous", tenant_id="default"`. Specifically the `POST /v1/athena/chat` at 15:49:10 (57 bytes body — real user prompt), followed by `athena.chat.turn` and `llm.turn` both stamping `tenant_id=default`. Meanwhile the very same session's `GET /v1/plutus/quota/{sub}` calls (15:49:29, 15:49:42) correctly attach the JWT and stamp `tenant_id=cloudpremise-llc`. So the client CAN send the token — but does not on chat, chronos, apollo, or proteus routes.
- **Security consequences:**
  1. **LLM consumption bypass:** anyone can hit `/v1/athena/chat` anonymously and consume tokens without attribution. Cost impact is real — every gpt chat this run consumed gpt-4o tokens against the platform's OpenAI key with no traceable requester.
  2. **§9.S sovereignty broken:** multi-tenant boundaries fail on gpt. If mnemosyne stores conversation history, an anonymous session could potentially read another user's threads (needs verification but architecturally unsafe).
  3. **§9.R royalty attribution silently zeroed:** gpt users' shell consumption never attributes to their Identity — no tithe target, no cause rollup, no cost basis for future settlement math.
  4. **§9.V visibility corrupted:** any auditor query grouping by `Sub__c` or `TenantId__c` shows gpt activity as unrelated "default-tenant anonymous" noise, hiding the real usage pattern from the observability plane.
  5. **Zero-trust perimeter violated:** ares' whole point is enforcing authenticated access to god services. Gpt bypassing that is an architectural fail.
- **Root cause hypothesis:** the gpt React app either (a) doesn't wire Bearer/Cookie attachment on its `fetch()` calls to Pantheon routes, (b) attaches only to Plutus routes because plutus was the first integration and other routes were added later without following the same auth pattern, (c) has a stale-token bug where the first Plutus call succeeds but subsequent calls fail token refresh. `/plutus/quota/` is the sole working example — model the fix on that call site.
- **Acceptance criteria:**
  1. Every Pantheon-bound call from gpt client attaches the JWT (either `Authorization: Bearer <token>` or `__Host-og_access` cookie per CLAUDE.md `Ares Cookie-to-Header Middleware`)
  2. `SELECT * FROM LedgerEntry WHERE EventType='api.inbound' AND Payload LIKE '%olympus-gpt%' AND TenantId__c='default'` returns 0 rows (except intentional public routes)
  3. Ares perimeter policy adds explicit `denied_paths` or auth-required allowlist so any future gpt-adjacent client that fails to attach JWT gets 401 rather than being silently downgraded to anonymous
  4. Plutus + Athena + Chronos + Apollo + Proteus + Mnemosyne routes hitting cluster-Pantheon services all require valid JWT unless explicitly declared public (voices/providers listings might legitimately be public catalog — Steward decision)

### GAP-70 (new must-close) — `ClientVersion__c=dev` on olympus-gpt

- **Severity:** 🟠 must-close (operational hygiene · support diagnostics)
- **§9 letter:** V (visibility · client identity)
- **Detected:** 2026-07-01 15:48 UTC
- **Suggested owner:** iris agent (olympus-gpt build tooling)
- **Empirical evidence:** Both olympus-gpt feedbacks (15:48:31, 15:49:26) landed with `ClientVersion__c="dev"` — a literal string, not a semver. Compare with siblings:
  - `turtleshell-web/1.7.4`
  - `turtleshell-ios/1.7.4`
  - `omens/4.6.2-stable (official)`
  - olympus-gpt: `dev`
- **Impact:** any support/QA/audit query that filters or groups by client version gets no signal from gpt. Cannot tell whether a bug is in the current build or in a stale prod build.
- **Acceptance criteria:**
  1. gpt build stamps `olympus-gpt/{semver}` at build time, sourced from package.json version or CI-injected build tag
  2. Fresh feedback from gpt has `ClientVersion__c` matching `^olympus-gpt/\d+\.\d+\.\d+`
  3. Backfill/migration of existing `dev` rows optional (Steward call — small volume, low value)

### GAP-71 (design gate — DECISION LOCKED 2026-07-01) — All new Pantheon routes require authentication

- **Severity:** 🔴 BLOCKER (upgraded from must-close after Steward's platform-wide default-auth decision — feeds directly into GAP-69/73 CRITICAL SECURITY fixes)
- **§9 letter:** S (sovereignty) · V (visibility) · A (attribution)
- **Detected:** 2026-07-01 15:49 UTC
- **Steward decision 2026-07-01 (verbatim):** *"71 - all of those routes require auth there is almost nothing that doesn't require auth"*
- **Platform-wide default LOCKED — Every Pantheon route requires JWT unless explicitly declared public. Nothing is public by default.**
- **Suggested owners:** ares agent (perimeter enforcement — default-deny policy) · each god's route handler (independent auth verification) · iris + omens + iOS agents (client-side JWT attachment consistency per GAP-69/73)
- **Empirical evidence:** Routes surfaced during olympus-gpt + templeathena sessions:

  | Route | Auth contract (LOCKED) |
  |---|---|
  | `POST /v1/athena/chat` | 🔒 authenticated |
  | `POST /v1/athena/analyze` | 🔒 authenticated |
  | `POST /v1/apollo/speak` | 🔒 authenticated |
  | `GET /v1/apollo/voices` | 🔒 authenticated |
  | `GET /v1/apollo/providers` | 🔒 authenticated |
  | `GET /v1/plutus/api/quota/{sub}` | 🔒 authenticated + `jwt.sub == pathParam.sub` (or admin scope) |
  | `GET /v1/plutus/api/stripe/subscription-status/{sub}` | 🔒 authenticated + `jwt.sub == pathParam.sub` (GAP-66 close) |
  | `GET /v1/chronos/api/lists` | 🔒 authenticated |
  | `POST /v1/chronos/tasks` | 🔒 authenticated |
  | `POST /v1/chronos/lists` | 🔒 authenticated |
  | `GET /v1/proteus/api/types` | 🔒 authenticated |
  | `GET /v1/mnemosyne/api/conversation/saved` | 🔒 authenticated |
  | `GET /v1/mnemosyne/api/conversation/saved/{id}` | 🔒 authenticated |
  | `GET /v1/mnemosyne/api/memory/reflect` | 🔒 authenticated |
  | `POST /v1/plutus/api/ingest` | 🔒 authenticated (service-to-service) |

  Explicitly public (defaults, do NOT require auth):

  | Route | Purpose |
  |---|---|
  | `GET /` | health check |
  | `GET /health`, `/health/deep`, `/status` | health/status |
  | `GET /v1/{god}/status`, `/v1/{god}/health` | per-god health |
  | `GET /.well-known/cosmos-logos.json` | cosmos-logos manifest |
  | `POST /v1/auth/email/link/request` | pre-auth send-code (email-link auth entry point) |
  | `POST /v1/auth/email/link/verify` | pre-auth verify-code (email-link auth entry point) |
  | `POST /v1/auth/apple/callback` | pre-auth Apple SIWA callback (if used) |

- **Acceptance criteria:**
  1. Ares strict-floor policy adopts **default-deny for authenticated routes** — any Pantheon `/v1/*` path not on the explicit public allowlist requires valid JWT to proceed; anonymous requests return 401.
  2. Each god's route handler independently verifies the JWT (defense in depth — do not trust the ares gate alone).
  3. GAP-69 (olympus-gpt) + GAP-73 (templeathena apollo) client fixes align to the auth contracts above — client attaches JWT on all non-public routes.
  4. GAP-66 (Stripe subscription-status) closes via the `jwt.sub == pathParam.sub` gate on the plutus route handler.
  5. New Pantheon routes added post-attestation follow the same default: authenticated unless explicitly declared public in §3 NFR.
- **Testable outcome:** `SELECT COUNT() FROM LedgerEntry WHERE EventType='api.inbound' AND TenantId__c='default' AND CreatedDate=TODAY AND Payload NOT LIKE '%\/health%' AND Payload NOT LIKE '%\/status%' AND Payload NOT LIKE '%.well-known%' AND Payload NOT LIKE '%auth\/email\/link%' AND Payload NOT LIKE '%auth\/apple%'` returns 0 rows.

### Olympus-gpt phase capability rollup

| Surface capability | Result | Notes |
|---|---|---|
| Signup + waitlist notification | ✅ works | full attribution chain intact |
| Waitlist admin approval | ✅ works | — |
| Approved→Active auto-transition | ✅ works | — |
| Onboarding (Cause selection) | ✅ works | `Education & Literacy` accepted — GAP-33 second-surface close |
| Chat with athena | ⚠ **works but anonymous** | GAP-69 BLOCKER — LLM consumption unattributed |
| Feedback submit × 2 | ✅ works with full AP/Sub attribution | GAP-65 silent-emit reproduced (5th surface); GAP-70 ClientVersion=dev |
| Plutus quota check | ✅ works with correct JWT auth | contrast with anonymous chat — proves client CAN attach JWT |
| Chronos list fetch | ⚠ anonymous | GAP-69 / GAP-71 |
| Proteus types fetch | ⚠ anonymous | GAP-71 |
| Apollo voices/providers fetch | ⚠ anonymous | GAP-71 (may be legitimately public — Steward call) |
| Analyze | not exercised | — |
| MCP tool call | not exercised | — |
| Hermes email compose | not exercised | — |

### Cross-surface pattern update — 5 surfaces exercised so far in this run

| # | AppKey | Chat auth | Onboarding | Feedback | Silent-emit reproduced |
|---|---|---|---|---|---|
| 1 | iris | ✅ (portal-owned SF-native) | not surface-owned | via app | GAP-65 |
| 2 | guardians | ⚠ athena legacy tenant bug (GAP-58) | Path B (deferred, GAP-59) | ✅ | GAP-62/64/65 |
| 3 | turtleshell (web) | ✅ | ✅ full (GAP-33 close) | ✅ w/ StructuredData | GAP-65/66/67/68 |
| 4 | turtleshell (iOS) | ✅ | onboarding via shared AP | ✅ | GAP-65/68 |
| 5 | **olympus-gpt** | ❌ **anonymous — GAP-69 BLOCKER** | ✅ (GAP-33 confirmed) | ✅ w/ ClientVersion=dev | GAP-65/69/70/71 |

## Templeathena phase — 2026-07-01 15:55 UTC

Steward action: signed up for templeathena, approved, activated, onboarded, chatted with athena (voice-heavy TTS surface).

### Signup + onboarding chain
- 15:55:05 `profile.created` — AP `a1waZ00000CVQ8zQAH` (templeathena, homer, Waitlist)
- 15:55:21 Waitlist→Approved
- 15:55:56 Approved→Active
- 15:56:02 `profile.onboarding.completed` — **GAP-33 confirmed CLOSED on THIRD surface** (turtleshell-web + olympus-gpt + templeathena)

AP final state: AppKey=`templeathena`, Tenant linked ✅, App=None 🔴, Status=Active, OnboardingComplete=true, Cause=**`Shelter & Housing`** (third distinct picklist value working).

### Chat + Apollo TTS activity (15:56:19 through 15:57:28)

- ✅ `POST /v1/athena/chat` at 15:56:19 — `tenant=cloudpremise-llc` (correctly authenticated — GAP-69 does NOT apply to templeathena chat)
- 🔴 **12+ `POST /v1/apollo/speak` calls all anonymous** (`tenant=default`, `user_identity=anonymous`) — heavy TTS load
- 🔴 Apollo emits rich telemetry (`voice.turn`, `voice.characters.input`, `voice.audio.output`) but all with `tenant=default`

### GAP-72 (new BLOCKER) — Templeathena Application record missing from seed

- **Severity:** 🔴 BLOCKER
- **§9 letter:** A · V (attribution + visibility)
- **Detected:** 2026-07-01 15:55 UTC
- **Suggested owner:** olympus-grid (`scripts/alpha-org-eos5-wipe.apex` or post-install seed script)
- **Empirical evidence:** `SELECT AppKey__c FROM Application__c` returns iris, guardians, olympus-gpt, turtleshell — 4 rows. No templeathena. Templeathena AP `a1waZ00000CVQ8zQAH` was created successfully with `AppKey='templeathena'`, but `Application__c = null` and — critically — **`notification.appowner.waitlist` did NOT fire** for the signup. Compare with the other 4 surfaces where the notification always fires. The trigger silently no-ops when it can't resolve `target_app_id` from AppKey.
- **Consequences:** Templeathena has no app-owner routing. If templeathena grows real users, none of them will generate app-owner notification traffic. App-owner cannot approve, review, or moderate.
- **Acceptance criteria:**
  1. Seed script includes an `Application__c` row for `AppKey='templeathena'` with the correct `OwnerIdentity__c` (Steward decision on owner)
  2. Same for any other iris-portal-apps in scope (builtsy explicitly noted this run — see GAP-75)
  3. Fresh templeathena signup → `notification.appowner.waitlist` fires with `target_app_id` resolved

### GAP-73 (new CRITICAL SECURITY BLOCKER) — Apollo `/v1/apollo/speak` accepts anonymous requests

- **Severity:** 🔴 **CRITICAL BLOCKER — SECURITY** (same shape as GAP-69 gpt-chat-anon, different god + surface)
- **§9 letter:** S · A · R · V
- **Detected:** 2026-07-01 15:56 UTC
- **Suggested owner:** apollo agent (route auth enforcement) + iris agent (templeathena client JWT attachment)
- **Empirical evidence:** In a 65-second window during Steward's authenticated templeathena session, 12+ `POST /v1/apollo/speak` calls landed at ares with `user_identity="anonymous", tenant_id="default"`. Same session's `POST /v1/athena/chat` (15:56:19) correctly authenticated. So the templeathena client CAN send JWT — but does not for apollo. Apollo emits its own domain telemetry (`voice.turn`, `voice.characters.input`, `voice.audio.output`) — attribution keys are populated correctly on those emit shapes but with `tenant=default` sourced from the incoming ares row.
- **Cost/security consequences:**
  1. **ElevenLabs is $$$ per character-input.** Anonymous TTS = uncosted, unattributed spending against the platform's ElevenLabs API key. This is a real dollar impact per session.
  2. **§9.R royalty attribution broken for voice cycles** — no tithe target for TTS consumption
  3. **Zero-trust perimeter violated for apollo**
  4. **Cross-tenant risk**: templeathena is voice-first; if apollo caches or streams TTS by session, an anonymous session could conceivably interfere with another user's stream (needs verification)
- **Fix pattern:** model on templeathena's `/v1/athena/chat` call site (which correctly attaches JWT). Apply same auth-header wiring to `/v1/apollo/speak`.
- **Acceptance criteria:**
  1. Every `/v1/apollo/speak` call from templeathena attaches JWT; ares stamps `tenant_id=cloudpremise-llc, user_identity=<sub>`
  2. Ares policy makes `/v1/apollo/**` authenticated-required by default (with explicit public-catalog carve-outs if any exist)
  3. `SELECT COUNT() FROM LedgerEntry WHERE EventType LIKE 'voice.%' AND TenantId__c='default'` returns 0 after fix
  4. Apollo emit continues to work — voice.turn/characters.input/audio.output land with `tenant_id=<real tenant>`

### GAP-74 (new must-close) — `notification.appowner.waitlist` silently no-ops on unresolvable AppKey

- **Severity:** 🟠 must-close (observability gap that masks GAP-72-shape defects)
- **§9 letter:** V
- **Detected:** 2026-07-01 15:55 UTC (via absence in templeathena signup chain)
- **Suggested owner:** olympus-grid (`ApplicationProfileTrgHnd` notification-emit hook)
- **Empirical evidence:** Templeathena signup at 15:55:05 fired `profile.created` correctly, but no `notification.appowner.waitlist` at 15:55:06 (contrast with iris/guardians/turtleshell/olympus-gpt where the notification always fires ~1 sec after profile.created). Trigger fell through silently because `target_app_id` couldn't be resolved from AppKey.
- **Acceptance criteria:**
  1. When AppKey→Application lookup fails, emit `notification.appowner.waitlist.orphaned` LedgerEntry with `{app_profile_id, app_key, reason: "no_application_row"}` payload
  2. Auditor can `SELECT * FROM LedgerEntry WHERE EventType='notification.appowner.waitlist.orphaned'` to catch missing seed rows
  3. Ideal: send a fallback notification to the platform Identity so orphan signups don't get lost

## Builtsy phase — 2026-07-01 16:02 UTC — SIGN-IN FAILED

Steward action: attempted to sign into `app.olympus-grid.com/builtsy` with `homer@cloudpremise.com` via email-link auth.

**Empirical failure:** Clicking "send code" returned inline error:

```
[{"errorCode":"NOT_FOUND","message":"Could not find a match for URL"}]
```

Sign-in fails at the URL-routing layer before any auth logic runs. Either:
- The `Plugin.iris_deployment_path_builtsy` metadata is not deployed
- The email-link auth route pattern doesn't match for builtsy AppKey context
- The static-resource bundle exists at `/builtsy` (page renders) but the backing Apex route family isn't wired

### GAP-75 (new BLOCKER) — Builtsy sign-in route not deployed

- **Severity:** 🔴 BLOCKER (surface is presented to user but functionally unusable)
- **§9 letter:** S · V
- **Detected:** 2026-07-01 16:02 UTC
- **Suggested owner:** iris agent (portal deployment) + olympus-grid (Apex route registration)
- **Empirical evidence:** `app.olympus-grid.com/builtsy` renders the sign-in page correctly (static bundle deployed). `POST` to the send-code endpoint returns SF's `NOT_FOUND: Could not find a match for URL`. The static resource landed but the corresponding `Plugin.v1_auth_email_link` or `Plugin.iris_deployment_path_builtsy` route registration didn't. Compare with olympus-gpt / templeathena which have working sign-in flows.
- **Also implicated (GAP-72 shape):** builtsy is NOT in the `Application__c` seed either (same as templeathena). Even if sign-in were fixed, GAP-72 would fire on first signup.
- **Acceptance criteria:**
  1. `POST` to builtsy send-code route returns 200 with a code emitted (not NOT_FOUND)
  2. Sign-in flow works end-to-end matching olympus-gpt's shape
  3. `Application__c` row for `AppKey='builtsy'` seeded per GAP-72 fix
  4. Fresh builtsy signup produces `profile.created`, `notification.appowner.waitlist`, waitlist approval path

## FINAL PHASE — TESTING COMPLETE 2026-07-01 16:02 UTC

**Steward-declared close of EOS-5 empirical validation run.**

Six iris-portal-app surfaces and two client-app surfaces exercised:

| # | AppKey | Surface class | Signup+onboard | Chat | Auth quality | Notes |
|---|---|---|---|---|---|---|
| 1 | iris | iris-portal SF-native | ✅ | ✅ | ✅ | reference correct behavior |
| 2 | guardians | omens Godot iOS | ✅ | ⚠ legacy-tenant bug | GAP-58 (client header) | onboarding-optional (GAP-59) |
| 3 | turtleshell | turtleshell-web (React) | ✅ (GAP-33 close) | ✅ | ✅ | 4 new routes surfaced (GAP-66/67/71) |
| 4 | turtleshell | turtleshell-iOS | ✅ (shared AP) | ✅ | ✅ | StructuredData drift (GAP-68) |
| 5 | olympus-gpt | iris-portal React | ✅ (GAP-33 confirm) | 🔴 anon (GAP-69) | 🔴 **CRITICAL SECURITY** | ClientVersion=dev (GAP-70) |
| 6 | templeathena | iris-portal React (voice-first) | ✅ (GAP-33 confirm) | ✅ | mixed — Apollo TTS anon (GAP-73) | Application missing from seed (GAP-72) |
| 7 | builtsy | iris-portal React | ❌ **sign-in fails** (GAP-75) | never reached | — | route not deployed |
| 8 | turtleshell-iris (LWC) | Salesforce toolbar LWC | Cause picklist mismatch (GAP-57) | never reached | — | onboarding blocked |

**Document signed:**
EOS agent · 2026-07-01 · EOS-5 empirical validation run — full closeout — 8 surfaces exercised — 3 CRITICAL security BLOCKERS surfaced (GAP-69/73 anonymous LLM+TTS, GAP-66 anonymous Stripe) — 4 BLOCKERS surfaced on plumbing (GAP-45/16/44 receiver-side unified via FeedbackTrgHnd precedent; GAP-72/75 seed+route deployment) — 5 must-close domain-emit silences (GAP-62 hermes, GAP-64 chronos, GAP-65 feedback, GAP-56 mnemosyne, GAP-50/60/61 MCP chain) — GAP-33 empirically CLOSED (3 surfaces) — GAP-49 empirically SETTLED (guardians-scoped) — GAP-53/55 previously closed still hold

# EOS-5 Across-The-Board Attestation Status — 2026-07-01

## §9 letter chain empirical close status

| Letter | Meaning | Status | Empirical evidence |
|---|---|---|---|
| **V** | Visibility | 🟠 PARTIAL — some domain emits work (`profile.*`, `athena.chat.turn`, `athena.analyze`, `notification.appowner.waitlist`, `apollo voice.*`, `memory.search`, `memory.read`, `cluster.status_changed`), 5 major silences (`hermes.*`, `chronos.*`, `feedback.*`, `mcp.*`) | GAP-62/64/65 silent-emit + GAP-50/60/61 MCP chain not invoked at all |
| **A** | Attribution (5-tuple stamping) | 🔴 BROKEN AT RECEIVER SIDE — cluster+tenant stamp correctly, Sub__c/ApplicationId__c/AppSource__c all null on every ledger row across every surface | GAP-16, GAP-45, GAP-44 Application-half. Empirical fix precedent found on `Feedback__c.IdentitySub__c` — model receiver plumbing on that |
| **Q** | Quality | ❔ UNTESTED this run | — |
| **F** | Feedback | 🟢 DOMAIN LAYER STRONG · 🔴 LEDGER SILENT — feedback rows land with rich attribution (AppKey/AP FK/IdentitySub/ClientVersion/DeviceModel + attached ContentDocument), zero `feedback.*` ledger emit | GAP-65 reproduced on 5 surfaces (iris/guardians/turtleshell-web/turtleshell-iOS/olympus-gpt) |
| **T** | Tithe | ⏸ UNTESTABLE (locked behind §9.A per 2026-06-30 Steward direction) — Cause null on all attributable rows; guardians allows Pantheon consumption without onboarding (GAP-59) | Depends on §9.A close first |
| **R** | Royalty (shell-consumption metering) | 🔴 STRUCTURALLY BROKEN — 0 ledger emits for hermes send, chronos ops, feedback submit, MCP tool.call. Apollo emits but with `tenant=default` (GAP-73). Athena/thoth chain emits correctly with attribution keys populated in payload but not in columns (GAP-16/45) | Same pattern as §9.A — payload has values, columns don't |
| **S** | Sovereignty | 🔴 THREE SECURITY BLOCKERS — GAP-66 (Stripe subscription-status anonymous), GAP-69 (gpt chat anonymous — CRITICAL), GAP-73 (Apollo TTS anonymous — CRITICAL) | Anonymous requests reaching cluster-Pantheon endpoints that should be authenticated; JWT attachment inconsistent per surface |

## Closed BLOCKERS this run

| # | Description | Evidence |
|---|---|---|
| GAP-33 | `profile.onboarding.completed` LedgerEntry fires on onboarding | 3 surfaces empirically closed (turtleshell-web + olympus-gpt + templeathena) |
| GAP-49 | Athena `llm.turn` tenant_id correct | 3 clean surfaces (iris + turtleshell-web + turtleshell-iOS) — guardians is confirmed outlier (GAP-58 client-side) |
| GAP-53 | Tenant seed row typo `cloudpremise-lls` | Steward data-fix on Tenant__c row + Steward-confirmed wipe-script fix |
| GAP-55 | Athena `agent_id` reads ATHENA_NODE_ID cluster name instead of "athena" literal | Fixed via athena PR #100; empirical on chat.turn + analyze on eos-5d |

## Still-open BLOCKERS by ownership (attestation prerequisites)

### olympus-grid agent (biggest owner — 6 items, mostly one-PR-closes-multiple)

- **GAP-16** — receiver-side plumbing to lift `user_identity` from ares payload to `LedgerEntry.Sub__c` column
- **GAP-45** — same lift on the Apex Pattern 1 Platform Event emitter/receiver envelope (with `user_identity`, `application_id`, `app_source` keys)
- **GAP-44 Application-half** — `ApplicationProfileTrgHnd.onBeforeInsert` calls AppKey→Application resolver (working helper already exists in the notification trigger)
- **GAP-72** — seed Application__c rows for templeathena + builtsy in wipe/reseed script
- **GAP-74** — `notification.appowner.waitlist.orphaned` event when AppKey doesn't resolve
- **Working precedent found:** `Feedback__c.IdentitySub__c` is correctly lifted by whichever handler writes Feedback rows. Copy that pattern to `LedgerWriterPeHandler` + HTTP-ingest sibling. **One PR likely closes GAP-16 + GAP-45 + GAP-44 + GAP-74 + surfaces GAP-72 need for reseeding.**

### iris agent (portal + client JWT attachment)

- **GAP-69** — olympus-gpt client attaches JWT to `/plutus/quota/` but not to `/athena/chat`, `/chronos/*`, `/apollo/*`, `/proteus/*`. **CRITICAL SECURITY.**
- **GAP-73** — templeathena client attaches JWT to `/athena/chat` but not to `/apollo/speak`. **CRITICAL SECURITY.**
- **GAP-66** — turtleshell-web `/plutus/stripe/subscription-status/{sub}` called anonymously (may be plutus route auth or client bug)
- **GAP-57** — turtleshell-iris LWC Cause tile values (`ai`/`oceans`) don't match picklist API names; align to turtleshell-web's reference mapping
- **GAP-75** — Builtsy sign-in route not deployed (`NOT_FOUND` at send-code endpoint)

### ares agent (0 open BLOCKERS this run)

Ares PR #61 empirical close held across the run. Ares emits `user_identity` correctly. The receiver-side gap is olympus-grid's.

### athena agent + omens agent (paired — GAP-58 closure)

- **GAP-58** — legacy `ATHENA_ALLOW_LEGACY_APPLICATION_TENANT_ID=true` env var on eos-5d. Two-lever fix:
  - **Steward**: flip env var to false on eos-5d Pantheon
  - **omens**: remove `x-application-id: <sub>` header from guardians client (may need re-verify that guardians still works after env flip)

### poseidon agent + athena agent (paired — MCP wiring)

- **GAP-50** — MCP tool chain not invoked at all; LLM hallucinates tool responses instead of calling tools
- **GAP-60** — Dynamic SF `Plugin.mcp_weather` registry not consulted by athena at conversation start
- **GAP-61** — Client/server contract for `mcpServers[]` passthrough needs ownership decision
- **Recommended path:** athena fetches SF registry at conversation start; emits `mcp.registry.loaded` and `mcp.tool.call` events

## Must-close (non-blocker) open

- **GAP-04** — MessageEvent__c deployed but not populated for SF-native hermes rail
- **GAP-07** — cluster name normalization (`int` vs `api-int`)
- **GAP-09** — auth email routing through Hermes/SendGrid `Messages__c` rail
- **GAP-25** — templeathena strip + `olympus_gpt` bundle clean
- **GAP-56** — mnemosyne emitter reads JWT `tid` claim (still `tenant_id=default`)
- **GAP-57** — turtleshell-iris LWC picklist mismatch (see iris ownership above)
- **GAP-59** — guardians onboarding-optional design gate (Path A LOCKED 2026-07-01: enforce onboarding before any shell expenditure — see GAP-59 entry for details)
- **GAP-62** — hermes send emits no LedgerEntry
- **GAP-63** — three-touch MessageEvent chain
- **GAP-64** — chronos operations emit no LedgerEntry
- **GAP-65** — feedback submit emits no LedgerEntry
- **GAP-67** — memory-reflect surface asymmetry (DECISION LOCKED 2026-07-01: all clients including omens get memory + conversation history — cross-surface parity)
- **GAP-68** — StructuredData shape drift (iOS agent)
- **GAP-70** — olympus-gpt ClientVersion=`dev` (semver stamping)
- **GAP-71** — auth contracts for new Pantheon routes (DECISION LOCKED 2026-07-01: default-deny across the board; nothing is public except health/status/auth-entry-points; ares perimeter + per-god route handlers enforce)

## Path to EOS-5 §13 close — bundled work grouping

**Sprint A (og-agent, 1 PR, closes 4 BLOCKERS)** — receiver-side plumbing:
- `LedgerWriterPeHandler` + HTTP-ingest sibling lift `user_identity` → Sub__c, `application_id` → ApplicationId__c, `app_source` → AppSource__c (models FeedbackTrgHnd)
- `ApplicationProfileTrgHnd.onBeforeInsert` calls AppKey→Application resolver (helper already exists)
- Wipe/reseed script includes templeathena + builtsy Application__c rows
- Notification trigger emits `notification.appowner.waitlist.orphaned` on resolve failure

**Sprint B (iris-agent, 1 PR per client, closes 3-4 client-side gaps):**
- olympus-gpt: attach JWT on all Pantheon routes (model on `/plutus/quota/` which works)
- templeathena: attach JWT on `/v1/apollo/speak`
- turtleshell-iris LWC: align Cause tile values to turtleshell-web mapping
- builtsy: register email-link auth route
- olympus-gpt build: emit real semver as ClientVersion

**Sprint C (Steward-side infra, single command):**
- Set `ATHENA_ALLOW_LEGACY_APPLICATION_TENANT_ID=false` on eos-5d
- Coordinate omens client to remove x-application-id header (may follow env flip)

**Sprint D (poseidon + athena coordination, MCP chain):**
- Athena fetches SF `Plugin.mcp_weather`-shaped registry at conversation start
- Poseidon MCP dispatch emits `mcp.tool.call` per invocation
- Both emit `mcp.registry.loaded` at boot

**Sprint E (emit consistency pass, various agents):**
- Hermes emit `message.sent` per Messages__c insert
- Chronos emit `task.created` / `list.created` per DML
- Feedback emit `feedback.submitted` per Feedback__c insert
- Mnemosyne reads JWT tid claim into memory.* events

**Sprint F (design decisions, Steward):**
- GAP-59 (guardians onboarding-optional)
- GAP-67 (memory-reflect surface parity)
- GAP-71 (auth contracts per new route)

## Attestation gate math

**Sprint A** closes 4 core §9.A BLOCKERS in a single PR. Once landed + re-attested empirically, §9.A is empirically clean.

**Sprint C** closes 1 §9.A BLOCKER (GAP-58 guardians tenant bug) with a Steward-side env flip.

**Sprint B** closes 3 §9.S SECURITY BLOCKERS (GAP-66/69/73) — critical to close before any real user traffic hits these surfaces.

Once §9.A is clean AND §9.S security blockers close, the payment-side testing (§9.T) can begin. First real payment + settlement event flowing through the whole attributed chain — including a Cause__c-carrying LedgerEntry that resolves via `Identity.PrimaryCause__c` at settlement time — is the **EOS-5 §13 close moment**.

**Estimated remaining effort:** 5-8 focused PRs across 4-5 agent owners + 1 Steward infra flip + a coordinated MCP-wiring effort. Not weeks of work. Days.

---

# § Closeout Master Inventory — 2026-07-01

*Single-view definitive breakdown of every gap surfaced through the full EOS-5 empirical run. Read this section as the hand-off contract to the dev agents.*

## Numeric summary

| Bucket | Count |
|---|---|
| ✅ CLOSED empirically or by data fix | **16** |
| 🟢 RESOLVED — no action needed | **7** |
| 🔴 BLOCKER — open | **15** |
| 🟠 Must-close — open | **26** |
| **Total surfaced** | **64** (numbering 1-75 with retired/subsumed IDs) |

## Full inventory by status

### CLOSED empirically or by data fix (16)

| # | Description | Evidence |
|---|---|---|
| 01 | Tenant primitive | Sprint 2 landed; JWT `tid` in production |
| 02 | LedgerEntry.ApplicationId__c Text field + FLS | Deployed |
| 08 | AP.Application FK + JWT `cid` claim mint | 5 surfaces confirm correct cid |
| 10 | TransactionContext rename | Sprint 4 landed |
| 12 | Apex Pattern 1 emitter framework | Empirically fires on Identity/AP/Cluster |
| 13 | AP `profile.status_changed` events | Empirically confirmed |
| 15 | Identity SuperAdmin audit — `identity.privilege_granted` | Wired |
| 23 | Cluster trigger framework | `cluster.status_changed` fires |
| 33 | `profile.onboarding.completed` event | 3 surfaces empirically fire |
| 41 | guardians-iOS Apple SIWA visible to Ares | Native-bridge refactor |
| 47 | App Owner waitlist notification | 4 of 5 surfaces (except templeathena — GAP-72) |
| 49 | Athena `llm.turn` tenant_id correct | 3 clean surfaces; guardians = outlier via GAP-58 |
| 51 | Plutus ingest lag observability | `/v1/plutus/health` shipped |
| 52 | Ares strict-floor self-DoS | 70/70 burst passes |
| 53 | Tenant seed row typo | Steward data-fixed to `cloudpremise-llc` |
| 55 | Athena `agent_id` split from ATHENA_NODE_ID | PR #100 |

### RESOLVED — no independent action needed (7)

| # | Description | Reason |
|---|---|---|
| 03 | Cluster owner ≠ Platform | RETIRED |
| 11 | Identity trigger double-fire | BENIGN (Root Cause A) |
| 14 | AP Logger row | Resolved inline |
| 18 | AP Approved→Active audit | SUBSUMED by GAP-13 |
| 21 | Cluster.CreatingApp FK | REVISED — closes through Pattern 1 |
| 36 | IdentityToken asymmetry | SUBSUMED by GAP-29 |
| 37 | Apple SIWA Service ID | RETIRED |
| 38 | iOS handshake | SUBSUMED by GAP-30 |

### BLOCKER — open (15)

**§9.A receiver-side plumbing (Sprint A, og-agent, 1 PR):**

| # | Description | Shape |
|---|---|---|
| 16 | Ares → `LedgerEntry.Sub__c` column lift | Ares payload has `user_identity`; receiver doesn't lift |
| 44 | AP.Application FK backfill at insert | Deterministic null across 4 AppKeys |
| 45 | Pattern 1 5-tuple stamping | Envelope key mismatch; `Feedback__c.IdentitySub__c` is precedent |
| 72 | Templeathena Application__c missing from seed | 4 seeded; templeathena+builtsy don't exist |

**§9.S CRITICAL SECURITY (Sprint B):**

| # | Description | Cost/risk |
|---|---|---|
| 66 | `/v1/plutus/api/stripe/subscription-status/{sub}` anonymous | Billing state probe by sub UUID |
| 69 | olympus-gpt chat + chronos + apollo + proteus all anonymous | LLM cost bypass; tenant isolation broken |
| 73 | Apollo `/v1/apollo/speak` anonymous | ElevenLabs $$$ uncosted |

**§9.V MCP chain not invoked (Sprint D):**

| # | Description | Evidence |
|---|---|---|
| 50 | Poseidon MCP tool calls invisible → chain not invoked → LLM hallucinates | Denver-weather zero telemetry |
| 60 | SF `Plugin.mcp_weather` registry not consulted by athena | Runtime path never reads |
| 61 | Client → athena `mcpServers[]` passthrough ownership | Design decision |

**§9.V hermes/chronos silent metering (Sprint E):**

| # | Description | Evidence |
|---|---|---|
| 62 | Hermes send emits no LedgerEntry | 2 Messages__c land; zero ledger |
| 64 | Chronos ops emit no LedgerEntry | Crosses ares; zero ledger |

**§9.T + auth-flow perimeter:**

| # | Description | Sprint |
|---|---|---|
| 19 | Email-link auth bypasses Ares (perimeter breach) | **DEFERRED 2026-07-01** — Salesforce remains primary email channel until reason to upgrade; not on §13 critical path (see Sprint G status below) |
| 57 | turtleshell-iris LWC toolbar Cause picklist mismatch | Sprint B |
| 58 | ATHENA_ALLOW_LEGACY env var + guardians client header | Sprint C |
| 59 | Guardians onboarding-optional | **Path A LOCKED — Sprint F (enforce)** |
| 71 | Default-deny auth on all Pantheon routes | **LOCKED — Sprint F (nothing public by default)** |

**Deployment (Sprint B):**

| # | Description | Evidence |
|---|---|---|
| 75 | Builtsy sign-in route not deployed | `NOT_FOUND` on send-code |

### MUST-CLOSE — open (26)

**Domain-emit consistency (Sprint E, 4):**

| # | Description | Owner |
|---|---|---|
| 56 | Mnemosyne reads JWT `tid` claim | mnemosyne agent |
| 63 | Three-touch MessageEvent chain | olympus-grid |
| 65 | Feedback submit emits `feedback.submitted` | olympus-grid |
| 74 | `notification.appowner.waitlist.orphaned` event | olympus-grid (bundle Sprint A) |

**Steward design decisions (Sprint F — ALL LOCKED 2026-07-01):**

| # | Description | Decision |
|---|---|---|
| 59 | Guardians onboarding-optional | **Path A LOCKED — enforce onboarding before any shell expenditure** |
| 67 | Memory-reflect surface asymmetry | **LOCKED — all clients including omens get memory + conversation history** |
| 71 | Auth contracts for new Pantheon routes | **LOCKED — default-deny; nothing public except health/status/auth-entry-points** |

**Client-side hygiene (Sprint B, 2):**

| # | Description | Owner |
|---|---|---|
| 68 | Turtleshell-iOS StructuredData JSON string vs object | iOS agent |
| 70 | olympus-gpt ClientVersion=`dev` | iris agent (gpt build) |

**Historical must-close carried forward (14):**

| # | Description |
|---|---|
| 04 | MessageEvent__c object deployed, 0 rows |
| 05 | Email templates inlined |
| 06 | TurtleShell surface discriminator |
| 07 | Cluster name mismatch `int`/`api-int` |
| 09 | Auth email through Messages__c rail |
| 17 | Last-sign-in tracking (doc) |
| 20 | EmailLastVerified semantics (doc) |
| 22 | Cluster.OwnerIdentity ambiguous (doc) |
| 24 | Zeus provisioning SendGrid hard-dep |
| 25 | iris templeathena strip + `olympus_gpt` bundle |
| 29 | IdentityToken hygiene (doc) |
| 39 | LedgerEntry.ClientType discriminator (doc) |
| 42 | Cluster.Degraded status |
| 43 | Cluster.ErrorMessage stale |
| 46 | LedgerEntry.AccountId shape (cosmetic) |

**Deferred/tracked-only:**

| # | Description | Reason |
|---|---|---|
| 26 | iris Application filter dropdown | iris-side |
| 27 | Per-app admin role | post-GAP-08 cycle |
| 28 | Identity.PrimaryCause (Option A picklist) | B/C ships this cut |
| 30 | Cosmos-logos handshake asymmetric | client-side |
| 31 | gpt polling | attestation tooling |
| 32 | Apple SIWA reliability NFR (doc) | — |
| 34 | turtleshell-web onboarding check | closes through GAP-33 |
| 35 | turtleshell-web double logout | client-side |
| 40 | heracles content intent-map (doc) | — |

## Sprint plan — definitive

| Sprint | Owner | Closes | PR count | Effort |
|---|---|---|---|---|
| **A** | olympus-grid | 16 + 44 Application-half + 45 + 72 + 74 | 1 PR | ~1 day |
| **B** | iris (per-client) + iOS | 57 + 66 + 68 + 69 (CRIT) + 70 + 73 (CRIT) + 75 | ~4 PRs | ~1-2 days |
| **C** | Steward infra | 58 (env flip) | 0 PRs | minutes |
| **D** | poseidon + athena | 50 + 60 + 61 | 2 coordinated PRs | ~2-3 days |
| **E** | multi-agent | 56 + 62 + 63 + 64 + 65 | ~4 PRs | ~1 day each |
| **F** | multi-agent (decisions locked 2026-07-01) | 59 (Path A enforce) + 67 (cross-client parity) + 71 (default-deny auth) | ~3-4 PRs across omens + iris + iOS + ares | 1-2 days |
| **G** | DEFERRED 2026-07-01 | 19 (perimeter-breach) — Salesforce remains primary email channel until reason to upgrade; not on §13 critical path | — | — |

## §13 close pathway — critical path (Sprint F now on critical path per Steward decisions)

1. **Sprint A merges + deploys** → §9.A empirically clean
2. **Sprint B merges + deploys** → §9.S CRITICAL BLOCKERS closed
3. **Sprint C flip** → guardians tenant attribution correct
4. **Sprint F merges + deploys** → guardians onboarding enforcement (Path A) closes §9.T gate; default-deny auth (GAP-71) hardens perimeter; memory + conversation parity closes surface asymmetry
5. **Re-attestation empirical run** across 8 surfaces confirms clean
6. **First real settlement event** flows through attributed chain
7. **§13 close moment reached** — cycle promotes to `06_shipped/`

Sprints D/E can land in parallel or in follow-on cycle without gating §13.
Sprint G explicitly deferred — Salesforce-native email channel is acceptable for §13 close.

## §9 letter chain — status at close of empirical run

| Letter | Current | Blockers to close | Prospect after A+B+C+F |
|---|---|---|---|
| **V** | 🟠 partial | 62, 64, 65, 50, 60 | 🟢 domain emits consistent |
| **A** | 🔴 broken at receiver | 16, 44, 45, 72 | 🟢 5-tuple stamps end-to-end |
| **Q** | ❔ untested | — | untested until §9.A/S clean |
| **F** | 🟢 domain · 🔴 ledger silent | 65 | 🟢 event lands |
| **T** | ⏸ locked | depends on §9.A + Cause + GAP-59 enforcement | 🟢 unlocks after Sprint A + Sprint F GAP-59 |
| **R** | 🔴 broken | 62, 64, 65, 50 | 🟢 emits land |
| **S** | 🔴 3 CRITICAL blockers + default-deny needed | 66, 69, 73, 71 | 🟢 CRITICAL closed + default-deny hardens perimeter after Sprint B + Sprint F GAP-71 |

## Hand-off contract

Any dev-agent picking up work should:

1. Read the specific gap entries in Section 4 AND in Appendix C. **Appendix C supersedes on any conflict** — it is the newer empirical evidence.
2. Meet the acceptance criteria in the gap entry.
3. Update the closure tracking table in Section 7 with `[x]` in `Dev done` column once passing locally.
4. Steward marks `Deployed by Steward`; subsequent re-attestation cycle marks `Validated by EOS-5 attestation in prod`.

## Steward decisions log — Sprint F + Sprint G — 2026-07-01

Steward locked all three Sprint F design gates + deferred Sprint G in a single turn following initial hand-off:

- **GAP-59 → Path A LOCKED:** *"enforce onboarding before any use of seashell expenditure"* — no shell-expending Pantheon call permitted before `AP.OnboardingComplete=true` AND `AP.Cause__c IS NOT NULL`. Client-side gate + server-side backstop (ares perimeter or per-god handler). This upgrades GAP-59 from must-close to BLOCKER on the §13 critical path because §9.T tithe attribution is now enforceable at consumption time (not settlement time).

- **GAP-67 → Cross-client parity LOCKED:** *"all clients should have memory and conversation history including omens"* — memory-reflection + saved-conversation routes are canonical across every surface (guardians/omens, turtleshell-iOS, iris portal, olympus-gpt, templeathena, builtsy, turtleshell-iris LWC). Turtleshell-web integration shape is the reference.

- **GAP-71 → Default-deny auth LOCKED:** *"all of those routes require auth there is almost nothing that doesn't require auth"* — every `/v1/*` Pantheon path requires JWT unless explicitly on a small public allowlist (health, status, cosmos-logos manifest, pre-auth email-link + Apple SIWA entry points). Ares enforces default-deny; each god's handler independently verifies. Auth-contract table in the GAP-71 entry above.

- **Sprint G → DEFERRED:** *"defer for now. salesforce will be the primary email channel until we have reason to upgrade"* — GAP-19 (email-link auth bypasses Ares) stays open but explicitly out of EOS-5 §13 critical path. Consequence: no `auth.email.*` Pattern 1 events fire during the EOS-5 re-attestation; auth flow visibility remains SF-native only. Reconciles with `project_hermes_sendgrid_eos_5_nfr_contract.md` dual-lane design: SF-native lane is production-supported. When migration to SendGrid lane becomes desirable (deliverability, compliance, or scale reason), Sprint G re-opens.

**Impact on §13 close pathway:** Sprint F moves onto the critical path (from Steward-decision buffer). Sprint G moves off. Net effect: same overall shape, one less week of work to §13 close.

## Post-hand-off dev-agent corrections — 2026-07-01

Three dev agents responded with corrections to attestation-agent (this doc) diagnoses. Recording here so the empirical record stays honest and the next re-attestation grades against the corrected shape, not the incorrect intermediate hypothesis.

### olympus-grid agent — Sprint A + E landed on branch (waiting for iris deltas per one-PR misinterpretation; will open draft PR)

Content on-branch:
- **GAP-16 scope correction (og-agent)** — `LedgerWriterPeHandler.cls:112` already reads `env.get('user_identity/tenant_id/application_id/app_source')` correctly. Attestation-agent's "receiver-side plumbing" framing was inaccurate for the Platform Event path; receiver is correct. Empirical caveat: 2026-07-01 15:26+ Ares api.inbound rows had `user_identity` in JSON payload with `Sub__c=null` while `TenantId__c` populated off the same payload — if `LedgerWriterPeHandler` handles both Apex Platform Event AND Ares HTTP-ingest paths, empirical re-attestation post-Sprint-A deploy will settle whether the gap is inside olympus-grid's HTTP-ingest handler or in the Ares→og handoff between HTTP body parsing and PE envelope construction. **Leave GAP-16 open with this caveat**; regrade after Sprint A deploys.
- **GAP-44** — `ApplicationRegistry.loadCache` unions `Application__c` rows onto `Plugin__mdt`-backed cache entries, stamping `appRecordId` so `AP.Application__c` FK backfill works for iris/guardians/olympus-gpt/turtleshell/templeathena.
- **GAP-45** — `LedgerEntryEmitter.emit` auto-resolves attribution from `targetId` when Apex-trigger context has no request-scoped `TransactionContextAttribution`. `profile.*` / `identity.*` / `cluster.*` / `notification.appowner.*` all get 4-tuple stamped from the target row.
- **GAP-72** — `alpha-org-data-seed.apex` adds templeathena `Application__c` (builtsy already present in seed).
- **GAP-74** — `NOTIFICATION_APPOWNER_WAITLIST_ORPHANED` emit replaces silent-skip WARN log path in the owner-notification queueable.
- **GAP-62** — `MESSAGE_SENT` emit in `HermesEmailSenderJob` + `ApiRouteHermesMessages` (SF-native lane).
- **GAP-63** — `MessagesLifecycleAudit` helper + wired at 4 write sites — queued/sent `MessageEvent__c` + `message.event` ledger per lifecycle transition.
- **GAP-65** — `FeedbackTrgHnd` — `feedback.submitted` on insert + `feedback.status_changed` on Status transitions.
- **Bonus** — `alpha-org-eos5-wipe.apex` preserves ALL Identity/Tenant/Application per prior Steward direction.

2,189 tests at 100% on the branch. Draft PR opening now that "one PR" scope-bundling is clarified (Sprint A + E in one og-repo PR; Sprints B/D land in their own repos).

### athena env agent — GAP-58 corrected diagnosis

Attestation-agent's original diagnosis: env var `ATHENA_ALLOW_LEGACY_APPLICATION_TENANT_ID=true` on eos-5d causes legacy fallback. Attestation-agent recommended fix: Steward-side env var flip.

**Athena agent code-level audit CORRECTS this:**
- `ATHENA_ALLOW_LEGACY_APPLICATION_TENANT_ID` is NOT set on the eos-5d task-def (verified via `aws ecs describe-task-definition`). Effective value is `false`. Env flip would be a no-op.
- Real leak is code-level: `athena/api/src/utils/index.ts:321` in the **`athena.tool_call`** sub-event emit does `tenant_id: _emitCtx?.tenantId ?? _emitCtx?.applicationId ?? 'default'` — the middle rung silently bypasses the strict/legacy gate and stamps `x-application-id` header value directly into `tenant_id`.
- Athena agent verified this is the ONLY leak surface: `llm.turn` (`server.ts:862`) and `athena.analyze` (`analyze.ts:131/168`) both read `reqCtx.tenantId` cleanly.

**Attestation-agent event-type flag for grader after PR #101 deploys:**
The attestation row I graded (2026-07-01 14:47:47) had `EventType__c='llm.turn'` with `payload.metadata={conversationId, totalChars, elapsedSeconds, appSource}` and `tenant_id=<sub>`. Athena agent audit says only `athena.tool_call` has the leak pattern. Two possibilities to distinguish empirically post-deploy:
- (a) Attestation misidentified event_type; the leak row was actually `athena.tool_call` mis-attributed on my grep OR (a') another code path with the same pattern that the audit missed
- (b) Guardians requests trigger Poseidon MCP `tool_call` events that landed in my scan window
Empirical DoD: post-PR-#101 deploy + fresh guardians chat, `SELECT * FROM LedgerEntry WHERE ClusterName__c='eos-5d' AND CreatedDate=TODAY AND TenantId__c NOT IN ('cloudpremise-llc','default') GROUP BY EventType__c` should return 0 rows. If it doesn't, athena agent has another leak site to hunt.

**PR link:** athena PR #101. Squash-merge → parent bump → CDK deploy on eos-5d.

### athena/poseidon Sprint D — code paths fire correctly; blocked on JWT

Athena/poseidon agent validated end-to-end against ngrok fleet:

- Athena chat handler enters `MCP REGISTRY LOAD` path (fires on every `/v1/athena/chat`)
- Registry fetch: `GET http://localhost:3451/v1/grid/master/v1/mcp/servers` through Ares → Hermes → apex-rest
- Graceful empty on failure: chat proceeds tool-free instead of 500
- `mcp.registry.loaded` emit fires even on empty result (`server.ts:498-536` sends `athena.chat.turn` envelope with `payload.subtype='mcp.registry.loaded'` + `mcp_registry.source='unavailable'` — distinguishes "athena didn't try" from "athena tried and got nothing")
- Dispatch URL fix (commit `1ee16e6`): `POST http://localhost:3451/v1/poseidon/mcp/616/weather/mcp` with `tools/list` → HTTP 200 with `get_alerts` + `get_forecast` catalog
- Poseidon metering emits `mcp.tool.call` with `args_hash + latency_ms + result_token_count + tenant_id-from-JWT-tid + parent_event_id` alongside legacy `tool.called`

**Blocked on:** valid JWT for E2E validation. Dev-env stub JWT returns HTTP 401 from Ares (Ares only has the public cert `ares/api/certs/OG_Signing_Key.crt`; private key lives inside Salesforce).

Two paths forward (Steward decides):
1. **Steward pastes a fresh JWT** from turtleshell-web sign-in → agent re-runs Denver weather probe → confirms `tools[]` populates + `mcp.registry.loaded (source=sf)` + `mcp.tool.call` all land with matching `trace_id + parent_event_id` linkage
2. **Ship as-is with structural claim**: "at the moment a request carries a valid JWT, the chain works"

Attestation-agent recommends Path 1 (costs minutes; produces actual ledger evidence for §9.R re-attestation grading).

### Iris agent — Sprint B fully delivered across 4 PRs / 4 repos

All 7 assigned gaps closed:

| Gap | Severity | PR | Fix summary |
|---|---|---|---|
| **GAP-69** | 🔴 CRITICAL | **iris #118** | `bestAuthHeaders()` + `credentials:'include'` on all 10 Pantheon fetches in `olympus-grid-ai` (chronos/apollo/proteus/ChatTester); session JWT fallback when dashboard credential empty |
| **GAP-73** | 🔴 CRITICAL | **iris #118** | `x-user-identity: <token>` on `apolloFetchSpeech` (`templeathena/views/AthenaChat.tsx:490`) — mirrors working `/v1/athena/chat` pattern |
| **GAP-57** | 🔴 BLOCKER | **iris #118** | `CAUSE_KEY_TO_API_NAME` map in `reactforce/turtleshell` OnboardingGate — tile short-codes (`'ai'`) → picklist API names (`'AI for Those in Need'`) at submit time |
| **GAP-70** | 🟠 must-close | **iris #118** | `package.json` 0.0.0→1.7.4; `vite.config` injects `REACT_APP_VERSION`; feedback.ts prefixes `olympus-gpt/${APP_VERSION}` → matches `^olympus-gpt/\d+\.\d+\.\d+`. New bundle `.1.7.4.emor` |
| **GAP-66** | 🔴 CRITICAL | **turtleshell-web #70** | `authHeaders()` helper (mirrors mnemosyne/web-client.ts) applied to all 6 plutus-client fetches; `x-user-identity` from `og_access_token` |
| **GAP-68** | 🟠 must-close | **turtleshell-ios #29** | `AnyCodable.encode` default case recurses via `AnyCodable` for `[String: Any]`/`[Any]` instead of `JSONSerialization → String`; `Feedback.answers` now emits as nested object |
| **GAP-75 (client)** | — | (no iris change needed) | Builtsy client URL was already correct; failure was 100% server-side |
| **GAP-75 (server)** | 🔴 BLOCKER | **olympus-grid #305** | New `Plugin.app_builtsy.md-meta.xml` Application registration. `ApplicationRegistry` now resolves `AppKey='builtsy'` → sign-in send-code stops 404-ing |

**Published bundle IDs (post-merge, prod):**
- `olympus_gpt`: `.1.7.4.emor`
- `templeathena`: `.dev.vjox`
- `turtleshell` (iris-portal-app): `.dev.rmyv`

**Attestation-agent grading of Sprint B delivery:**
- GAP-75 split into client-vs-server halves is a nice diagnostic sharpening — the "route not deployed" symptom I reported came from server-side missing Plugin metadata, not client URL misconfiguration. Iris agent correctly divided the fix.
- Bundle IDs for templeathena + turtleshell stayed `.dev.*` prefixed (not semver'd like `olympus_gpt` got via GAP-70). That's inside iris's stated scope (GAP-70 was olympus-gpt-only), but flagging as **hygiene follow-on**: the same semver-stamping treatment on templeathena/turtleshell iris-portal-app bundles closes the visibility gap for those surfaces too. Not on §13 critical path.

### Cross-agent PR coordination — 5 PRs across 3 repos awaiting merge

| PR | Repo | Sprint | State |
|---|---|---|---|
| og-agent Sprint A+E draft PR | olympus-616/olympus-grid | A + E | Draft (opening now) |
| **iris #118** | olympus-616/iris | B (multi-gap) | Open |
| **olympus-grid #305** | olympus-616/olympus-grid | B (builtsy server) | Open |
| **turtleshell-web #70** | cosmos-logos/turtleshell-web | B (GAP-66) | Open |
| **turtleshell-ios #29** | cosmos-logos/turtleshell-ios | B (GAP-68) | Open |
| **athena PR #101** | olympus-616/athena | C (GAP-58 code-level) | Open |

**Sequencing considerations:**

1. **Two olympus-grid PRs racing** — og-agent's Sprint A+E draft + iris #305. Whichever lands second will need to rebase on top of the other. Neither depends on the other functionally; content is orthogonal (og = plumbing + emit, iris #305 = new Plugin metadata). Steward picks merge order.

2. **Auth switch for cosmos-logos PRs** — `turtleshell-web #70` and `turtleshell-ios #29` live in the cosmos-logos org. Steward will need `gh auth switch --user root-of-trust` for merge + parent bump against those repos.

3. **Deploy cascade after merges** — per CLAUDE.md deploy precedence:
   - **First:** iris #118 landing → new iris bundles published to olympus-grid static resources (already reflected in iris agent's bundle-ID list)
   - **Second:** olympus-grid #305 + og-agent's Sprint A+E → managed package build → alpha-org deploy
   - **Third:** athena PR #101 → parent submodule bump → CDK redeploy on eos-5d Pantheon
   - **Fourth:** turtleshell-web #70 + turtleshell-ios #29 land in cosmos-logos org (client apps consume the newly-clean backend)

4. **Sprint F (Steward-decision-locked)** — guardians onboarding-gate + cross-client memory parity + default-deny auth work not yet assigned to concrete PRs. Recommendation: **hold Sprint F until Sprint A+B+C attestation re-run confirms clean**, then hand off Sprint F to omens+ares+iris+mnemosyne with confirmed §9.A/§9.S baseline. Prevents chasing moving-target diagnoses.

### Re-attestation readiness check

Attestation-agent is ready to run the re-attestation the moment:
1. All 5 Sprint A/B/C PRs merge
2. Deploys land (managed package on alpha-org + Pantheon on eos-5d)
3. Steward exercises fresh signup + chat + analyze + feedback + MCP tool call on ≥3 surfaces

If Steward pastes a fresh JWT (Sprint D unblock), Denver-weather probe validates §9.R MCP telemetry in the same run.

**Document signed:**
EOS agent · 2026-07-01 · EOS-5 empirical validation run — Sprint B fully delivered (iris #118 + og #305 + turtleshell-web #70 + turtleshell-ios #29) — 5 PRs across 3 repos queued for merge — re-attestation stands ready
Steward: G.W. Homer (CloudPremise LLC)
