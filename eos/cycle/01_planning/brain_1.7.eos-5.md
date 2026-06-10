# System-wide transactional accounting + autonomous revenue path — every transaction recorded, every surface paid, every tithe attributed, all autonomous

> File: `brain_1.7.eos-5.md`

| | |
|---|---|
| **Branch family** | `brain/1.7.x.x` |
| **Cycle ordinal** | `eos-5` (5th on this branch family) |
| **Status** | `Planning` — Steward authoring §1-§5. **Cycle does NOT enter `04_in_development/` until EOS-4 is validated to production** (Steward direction 2026-06-10). |
| **Opened** | 2026-06-10 |
| **Closed** | — |
| **Prior cycle** | `brain_1.7.eos-4` (the `brain/1.7.x.x` IS the stable production environment cycle) |
| **Theme** | "After EOS-4 is validated to production, EOS-5 = each surface has its revenue path for turtleshell.ai tokens without my help. Each app needs to have its revenue path finished and production-ready. Both Stripe AND Apple. Must work across all surfaces." — Steward verbatim 2026-06-10. **Scope-broadening, Steward verbatim 2026-06-10:** *"in eos-5 we will do full system wide acconting of each transaction in the system."* — the autonomous-revenue claim and the system-wide transactional-accounting claim are now co-equal halves of EOS-5. |
| **Feedback inputs** | EOS-4 §13 closeout (deferred productionization items) + the paused revenue-path sprint plan (`docs/sprint-plan-revenue-path-2026-05-16.md`) + the cosmic-7 brand canonical (memory `feedback_cosmic_seven_canonical.md`) |
| **Estimated effort** | TBD — locked when §10 is authored. Likely the largest cycle to date because revenue infrastructure is multi-rail (Stripe + Apple) × multi-surface (≥3 SF-side + omens iOS + turtleshell fleet once productionized). |
| **Actual effort** | — |

> **What EOS-5 is (the autonomous-revenue claim):**
>
> EOS-1 + EOS-2 + EOS-3 + EOS-4 establish the platform's *operational truth*: a sovereign user can build an environment from source, that environment runs in production by construction (the branch IS production), and the system says what it does and does what it says across the lifecycle. **EOS-5 closes the financial truth-loop:** the platform can take payment, mint consumption tokens, account for usage, and pay the cosmic-7 tithe — autonomously, across every consumer surface — without Steward intervention at any step.
>
> **Steward verbatim 2026-06-10:** *"after eos-4 is validated to production the eos-5 will be each surface has its revenue path for turtleshell.ai tokens without my help. basically each app needs to have its revenue path finished and production ready... this needs to be both stripe and apple and this must work across all of the surfaces."*
>
> **The "without my help" part is the heart of EOS-5.** A new user lands on any surface, chooses a cause + tier (per cosmic-7), pays via the payment rail appropriate to that surface (Stripe for web/desktop, Apple StoreKit/IAP for iOS), and immediately starts consuming turtleshell.ai tokens against the platform. The Steward does not manually approve, mint, invoice, or wire payouts. The system runs the loop.
>
> **Two-rail architecture, single token economy:** the unit of value is `turtleshell.ai tokens` — fungible across surfaces and rails. A user who buys 1,000 tokens on turtleshell-ios via Apple IAP sees those tokens on turtleshell-web (purchased via Stripe) and on olympus-gpt (purchased via Stripe). Consumption is per `llm.turn` (or equivalent metered event) tracked in `LedgerEntry__c`, with the 7% cosmic-7 tithe attributed to the user's chosen cause on every consumption event.
>
> **Why this is the right next cycle after EOS-4:** the platform is provably *correct* after EOS-4 (the brain SHA IS production and satisfies EOS-1/2/3/4's invariants). EOS-5 makes it *sustainable* — the platform pays for its own operation, the tithe lands at the seven causes by construction, the Steward steps out of the cash loop. This is the precondition for republic-616 (multi-party governance can't function over a platform whose finances are held hostage to one human bank account).

---

# § Steward-authored (top half)

## §1 User story

### §1.1 The autonomous revenue loop + system-wide transactional accounting (the FOREVER intent — Steward 2026-06-10 dual claim)

> As **the Steward — and eventually any dust dancer running their own grid** I want **every consumer surface of the platform to expose a complete, autonomous, production-grade revenue path — sign-up → identity → cause-choice (per cosmic-7) → tier-choice → payment (Stripe for web/desktop, Apple StoreKit/IAP for iOS) → turtleshell.ai-token mint → consumption-metered ledger → 7% tithe to chosen cause — with NO Steward intervention at any step, AND every transaction in the system (payment, mint, consumption debit, credit, transfer, tithe accrual, tithe payout, refund, chargeback, cluster-spawn cost, agent-action cost, observability event) to be written to `LedgerEntry__c` with complete attribution (Identity FK, ApplicationProfile, AppSource, Cycle FK, ClusterName, RequestId, EventType, Cause, TitheAmount, CurrencyType, Description)** so that **the platform pays for its own operation by construction, the seven causes receive their tithe by construction, a sovereign user can start/sustain/end their relationship without talking to a human, AND every action in the system is accountable to a queryable per-Identity / per-Cycle / per-Cluster / per-Surface ledger — the financial truth-loop matching the operational truth-loop EOS-1–4 already established.**

**Steward verbatim (two passes 2026-06-10):**
1. *"after eos-4 is validated to production the eos-5 will be each surface has its revenue path for turtleshell.ai tokens without my help. basically each app needs to have its revenue path finished and production ready... this needs to be both stripe and apple and this must work across all of the surfaces."*
2. *"in eos-5 we will do full system wide acconting of each transaction in the system."*

The two passes together define EOS-5 as the **financial-truth-loop closure** that mirrors the EOS-1+2+3+4 operational-truth-loop closure. Two co-equal halves:

**Half A — Autonomous revenue rails (Stripe + Apple, every surface).** A new user lands → cause/tier → pays → tokens minted → consumption metered → 7% tithe attributed → no Steward intervention.

**Half B — System-wide transactional accounting completeness.** Every action that incurs cost, every payment received, every token minted, every consumption event, every tithe attribution, every cluster-spawn, every cross-cluster transfer, every refund — ALL of it lands as a `LedgerEntry__c` row with complete attribution. The ledger IS the truth source for: per-Identity balance, per-surface revenue, per-cause tithe, per-cluster cost, per-cycle outcome. Aggregations are exact and queryable.

**§1.1 is intent. Short of §1.1 is a bug** — same discipline as EOS-1 / EOS-3 / EOS-4 §1.1. §1.1 deviations across BOTH halves:

**Revenue-path deviations (Half A):**
- A new user gets stuck on any surface's signup or payment flow without Steward intervention.
- Tokens purchased on one surface are not honored on another surface (single token economy violated).
- Consumption events fail to debit the user's balance or fail to attribute the tithe.
- The Steward must manually reconcile a payment, manually mint tokens, manually run a tithe distribution, or manually answer a customer-support question about billing.
- The 7% tithe lands at any address other than the cosmic-7 cause-fund mappings.
- A surface's revenue path works in development but fails in production.

**Accounting-completeness deviations (Half B — load-bearing inputs from EOS-3 §13 D10–D15):**
- A user action that consumed resources did NOT write a `LedgerEntry__c` row (silent untracked event).
- A `LedgerEntry__c` row has `Identity__c=null` or no path back to the Identity that caused it (D14).
- A `LedgerEntry__c` row has `AppSource__c=null` and the surface attribution cannot be reconstructed (D12).
- A `LedgerEntry__c` row has `RequestId__c=null` and cannot be correlated to its originating HTTP envelope (D13).
- A `Cycle__c` SObject row does not exist for a logical karmic cycle in production, OR exists but has no aggregating `LedgerEntry__c.Cycle__c` FK back-references (D10).
- A consumption event has `Cause__c=null` or `TitheAmount__c=null` (D11).
- The book does not balance: `SUM(CreditAmount__c) ≠ SUM(DebitAmount__c) + SUM(TitheAmount__c) + outstanding-balance-per-Identity` at any consistent rollup point.
- An aggregation that EOS-5 §2 requires (per-Identity balance, per-surface revenue, per-cause tithe, per-cluster cost, per-cycle outcome) is impossible by direct SOQL because a discriminator column is missing.

### §1.2 The EOS-5 slice (what we actually ship this cycle)

> *PENDING — Steward to draft post-EOS-4 closure, scoped to whichever surfaces are production-deployed by then.*

**Anticipated shape:**

> As **the Steward** I want **the EOS-4-production-deployed surfaces (olympus-grid + iris portal + olympus-gpt + omens iOS + whichever turtleshell-* surfaces have shipped by EOS-5 open) to each carry a fully-instrumented revenue path — Stripe checkout on the web/desktop surfaces, Apple IAP on the iOS surfaces — wired into the single turtleshell.ai-token economy with cosmic-7 tithe attribution on every consumption event** so that **the platform's revenue and tithe loops are observable end-to-end in production telemetry, autonomous, and provably correct.**

**Surface coverage as of EOS-5 open (this needs to be re-scoped when EOS-5 actually opens against then-current production state):**

| Surface | Rail | EOS-5 inclusion (anticipated) | Notes |
|---|---|---|---|
| **olympus-grid** managed package | Stripe (alpha-org webhooks) | ✅ load-bearing — admin/billing surfaces live here | The Plugin__mdt revenue config + Stripe webhook handler likely lives in olympus-grid Apex. |
| **iris portal** | Stripe (in-portal checkout) | ✅ in scope | Customer billing self-service: view balance, top up tokens, manage payment method. |
| **olympus-gpt** | Stripe | ✅ in scope | Picks up the paused `docs/sprint-plan-revenue-path-2026-05-16.md` work (`/waitlist` + `/onboarding`: cause → tier → Stripe → final). |
| **omens iOS** | Apple IAP | ✅ in scope (gating: omens-iOS IAP entitlement + StoreKit native bridge integration) | Per memory `feedback_omens_ios_deploy_script_is_canonical.md` the native bridge for IAP / SIWA exists — extending it for StoreKit purchases is the work. |
| **turtleshell-web** | Stripe | ⚠️ gated on EOS-3 + EOS-4 turtleshell-web closure (out of EOS-4 per 2026-06-10 scope-narrow) | If turtleshell-web has not yet productionized by EOS-5 open, defer to a later cycle. Single-token economy keeps it consistent when it lands. |
| **turtleshell-ios** | Apple IAP | ⚠️ gated on EOS-3 + EOS-4 turtleshell-ios closure | Same shape as omens iOS. |
| **turtleshell-offgrid** | Stripe (recurring? appliance-side?) | ⚠️ gated on EOS-3 + EOS-4 turtleshell-offgrid closure | Offgrid revenue model is appliance-purchase + ongoing token consumption; payment-rail design is its own question. |
| **turtleshell-iris** | (TBD) | ⚠️ gated on EOS-3 turtleshell-iris validation + EOS-4 productionization | Out of EOS-3 + EOS-4 per Steward 2026-06-10. EOS-5 inclusion depends on its productionization path landing in time. |

**Forward-looking constraint:** the single turtleshell.ai-token economy must be designed such that adding a future surface (e.g., a desktop-native client) does not require re-architecting the payment / token / ledger / tithe loop. Adding a surface = adding a thin payment-rail adapter + a `Plugin__mdt` config entry + a UI shim.

## §2 Acceptance criteria

*PENDING — Steward to draft after EOS-4 closes. Anticipated shapes, organized into two co-equal blocks per §1.1:*

### Block A — Autonomous revenue rails (Stripe + Apple, every surface)

- **§2.A1 Stripe checkout works on every web/desktop surface in scope** — from cold sign-in to first-token consumption, end-to-end, against production Stripe (live keys, not test mode). Observable: a `LedgerEntry__c` credit row with `EventType__c='payment.stripe'` + `PaymentProvider__c='stripe'` lands in the alpha-org / `og_beta_1` / `og_beta_2` per purchase, with `Identity__c` FK populated.
- **§2.A2 Apple IAP works on every iOS surface in scope** — App Store Connect product configured, StoreKit transaction signed, receipt validated server-side, tokens minted. Observable: a `LedgerEntry__c` credit row with `EventType__c='payment.apple'` + `PaymentProvider__c='apple'` lands, with the original StoreKit `transactionId` in `TransactionId__c` for deduplication.
- **§2.A3 Single token economy holds** — tokens purchased on one surface are honored on every other surface. Observable: SOQL `SELECT SUM(CreditAmount__c) - SUM(DebitAmount__c) FROM LedgerEntry__c WHERE Identity__c = :id` returns the same balance regardless of which surface queries it.
- **§2.A4 Consumption metering debits balance + attributes tithe** — every `llm.turn` (or equivalent metered event) writes a `LedgerEntry__c` debit row + populates `TitheAmount__c` = `DebitAmount__c × 0.07` + populates `Cause__c` from the user's chosen cosmic-7 cause. Resolves §13 D11.
- **§2.A5 Autonomous failure handling** — Stripe webhook retry, Apple receipt re-validation, balance-exhausted soft-fail (graceful UX, no platform crash), refund flow per Stripe/Apple policy. All without Steward intervention.
- **§2.A6 Tithe distribution proves itself** — at end of each accounting period, the 7% accumulated per cause has a payout proof (mechanism TBD) and SOQL aggregate matches disbursed amount.

### Block B — System-wide transactional accounting completeness (closes EOS-3 §13 D10–D15)

- **§2.B1 `Cycle__c` SObject ships to production** — exists in `og_node_beta_1` / `og_node_beta_2` managed-package install. Resolves §13 D10. Every karmic cycle (intent → mutation → ledger → outcome) creates a `Cycle__c` row at start and updates it at close with aggregated cost/outcome/duration.
- **§2.B2 `LedgerEntry__c.Cycle__c` FK populated on 100% of rows** — every row joins back to a `Cycle__c` root. Observable: `SELECT COUNT(Id) FROM LedgerEntry__c WHERE Cycle__c = null` returns 0.
- **§2.B3 `Identity__c` FK on `LedgerEntry__c`** — schema addition (resolves §13 D14). Every row identifies the Identity that caused the event. Observable: per-Identity balance query is single-table SOQL, not a multi-hop join.
- **§2.B4 Application attribution on EVERY ledger record** (Steward direction 2026-06-10 verbatim: *"add to the scope of eos-5 that we will validate the application properly attribtes on each ledger record"*) — every `LedgerEntry__c` row carries `AppSource__c` identifying the originating application/surface (`omens`, `turtleshell-web`, `turtleshell-ios`, `turtleshell-offgrid`, `iris-portal`, `olympus-gpt`, etc.). Resolves §13 D12. **Validation has two parts:**
  - **(a) Schema-write completeness:** SOQL `SELECT AppSource__c, COUNT(Id) FROM LedgerEntry__c WHERE CreatedDate = LAST_N_DAYS:7 GROUP BY AppSource__c` returns NO null bucket. Every event type — `api.inbound`, `llm.turn`, `llm.tokens.input`, `llm.tokens.output`, `memory.search`, `payment.*`, `cluster.spawn`, `cluster.terminate`, `mcp.tool.call`, `feedback.submit`, `admin.response`, every kind of event Plutus writes — carries the originating surface tag. Currently as of 2026-06-10 the 232+ production LedgerEntry rows from the EOS-3+4 validation arc are 100% `AppSource__c=null`.
  - **(b) Cross-surface aggregation correctness:** for every surface attested in EOS-3+4 (omens, turtleshell-web, turtleshell-ios, olympus-gpt, iris portal once D17 lands, turtleshell-offgrid once §2.7 closes), `SELECT SUM(DebitAmount__c) FROM LedgerEntry__c WHERE AppSource__c=<surface> AND CreatedDate=:window` returns a per-surface total that matches the activity actually conducted on that surface in that window. Cross-checks: (i) sum-across-surfaces equals sum-without-AppSource-filter; (ii) per-cluster-per-surface-per-event rollups are queryable and produce reasonable numbers; (iii) the rollup correctly attributes work that crossed clusters mid-session (e.g., a turtleshell-ios user who switched from api-int to eos-4 mid-session has rows on BOTH clusters tagged with `AppSource='turtleshell-ios'`, not split between surfaces).

  This is the **single biggest gap between "data plumbing works" and "the financial truth-loop is complete"** — without it, the EOS-4 §2.10 unified brain=production assertion has a known asterisk (we know clusters work; we don't know which surface drove which cluster activity). Closing this is a precondition for EOS-5 §2.A4 (consumption metering with tithe attribution can't compute per-surface tithes without per-row AppSource).
- **§2.B5 `RequestId__c` populated on 100% of rows** — every row carries the originating HTTP envelope's `X-Request-ID`. Resolves §13 D13. Enables end-to-end trace from client log → server log → ledger row.
- **§2.B6 Pricing model locked + reflected in row writes** — Steward selects flat-per-turn (current) vs token-volume-based pricing for `llm.*` events. Resolves §13 D15. Whichever is chosen, the Plutus debit-writer implements it consistently across both clusters AND across all agents (`thoth`, `athena`, etc.).
- **§2.B7 Every transaction in the system is recorded — no silent events.** Audit: identify N user actions across the six surfaces (sign-in, sign-out, payment, refund, llm.turn, memory.search, cluster.spawn, cluster.terminate, mcp.tool.call, feedback.submit, admin.response, etc.) and confirm each writes ≥1 `LedgerEntry__c` row. **List of action-types-to-ledger-mapping is itself a §10 work product.**
- **§2.B8 The book balances at every consistent rollup point.** Observable: `SELECT SUM(CreditAmount__c), SUM(DebitAmount__c), SUM(TitheAmount__c) FROM LedgerEntry__c GROUP BY Identity__c` produces per-Identity balances that match the user's displayed balance + outstanding obligations on every surface. Cross-cluster aggregation per Identity is consistent.

### Block C — Cross-cutting

- **§2.C1 Production-grade observability** — every payment, mint, consumption, tithe-attribution, tithe-payout traceable via `CycleId`-tagged log lines. Plutus / Mnemosyne capture the full chain.
- **§2.C2 Repeatability** — independent operator on a fresh machine using ONLY source-controlled materials can repeat §2.A1–§2.A6 + §2.B1–§2.B8 against a fresh scratch + the production Stripe / Apple sandbox. Same closure semantic as EOS-3 §2.9.

> **Out of scope for EOS-5** (rides future cycles, NOT criteria here): the surfaces that have not yet productionized by EOS-5 open (per the gating table in §1.2); republic-616 governance of tithe-distribution policy (single-Steward direction for now); B2B / enterprise billing tiers (consumer single-tier first); multi-currency (USD only for the first slice); refund / chargeback automation beyond the rails' built-in capabilities; historical-row backfill (EOS-5's accounting completeness applies forward from §13 close; pre-EOS-5 LedgerEntry rows in alpha-org stay as-is unless Steward calls for backfill).

## §3 Non-functional requirements

*PENDING — Steward to draft. Anticipated categories:*

- **Revenue-path latency budget** — checkout completion time per surface; webhook processing time; token-mint time post-payment.
- **Cost budget** — Stripe processing fees + Apple's 30% (or 15% small-business) cut + the 7% cosmic-7 tithe + AWS / Salesforce costs per token — the unit-economics formula has to fit.
- **Observability** — every revenue event traceable from client surface → server → Plutus ledger → cosmic-7 cause distribution.
- **Compatibility** — existing identity / ApplicationProfile / Plugin__mdt records survive; rolling out per surface doesn't break other surfaces.
- **Privacy** — PCI-DSS posture (Stripe handles card data, but we still touch enough metadata to need discipline); Apple's privacy-policy attestations.
- **Performance** — checkout flows do not block on Pantheon round-trips that aren't strictly necessary; mobile surfaces work offline-tolerant.

## §4 Feedback inputs

| Source | Item | EOS-5 angle |
|--------|------|-------------|
| `docs/sprint-plan-revenue-path-2026-05-16.md` (paused 2026-05-16, superseded by EOS-1→4 culmination) | `/waitlist` + `/onboarding` Stripe checkout on olympus-gpt.ai | Resume + extend to platform-scale |
| Memory `feedback_cosmic_seven_canonical.md` | 7 causes / 7% tithe / 7/17/2026 launch / #i7777 hashtag — **load-bearing brand canonical, never narrow** | Tithe-attribution scheme is non-negotiable; §2.A4 + §2.A6 enforce it |
| **EOS-3 §13 D10** (Plutus ledger eval 2026-06-10) | No `Cycle__c` SObject in alpha-org | **First-class §2.B1 work item** — ship the SObject + the row-creation hooks |
| **EOS-3 §13 D11** (Plutus ledger eval 2026-06-10) | `TitheAmount__c` + `Cause__c` null on 100% of rows | **First-class §2.A4 work item** — Plutus debit-writer computes tithe at write time |
| **EOS-3 §13 D12** (Plutus ledger eval 2026-06-10) | `AppSource__c` null on 100% of rows | **First-class §2.B4 work item** — propagate surface tag through the chain |
| **EOS-3 §13 D13** (Plutus ledger eval 2026-06-10) | `RequestId__c` null on 100% of rows | **First-class §2.B5 work item** — thread X-Request-ID to the writer |
| **EOS-3 §13 D14** (Plutus ledger eval 2026-06-10) | No `Identity__c` FK on LedgerEntry__c | **First-class §2.B3 work item** — schema delta + writer plumbing |
| **EOS-3 §13 D15** (Plutus ledger eval 2026-06-10) | `llm.turn` flat 1-shell debit (no per-token variability) | **First-class §2.B6 work item** — Steward decides pricing model first |
| **EOS-3 §13 D17** (in-flight 2026-06-10) | iris portal Athena chatbot + Plutus event stream are NOT cluster-specific; iris portal lacks EOS-1/2/3/4 feature-parity with omens/ts-web/ts-ios | **NO LONGER an EOS-5 candidate — reassigned 2026-06-10 to the iris agent for in-flight resolution within the current EOS-3+EOS-4 cycle pair.** Steward reclassified within minutes of the original deferral. Strategy: integrate existing turtleshell chat components (post-D16) + cluster-specific Plutus stream subscriber. If iris agent ships within session, iris portal §2.8 closes ✅ at full feature parity rather than substantively-only. |
| EOS-4 §13 closeout | Whichever §1.1 deviations from EOS-4 are revenue-path-shaped | Inherited by EOS-5 as starting work-items |
| EOS-3 §13 D7 | No `OrgWideEmailAddress` in scratch | Branded email flow is part of the revenue path (receipts, balance-low warnings, etc.) — must be wired in prod |
| Memory `project_application_profile_refactor.md` | Per-app config = Plugin__mdt | The revenue config per surface likely also lives in Plugin__mdt (`Plugin.app_X.RevenueConfig__c` JSON shape TBD) |

**Net effect of 2026-06-10 scope-broadening:** what was originally six revenue-rail criteria is now sixteen criteria across three blocks (six revenue rails + eight accounting-completeness + two cross-cutting). EOS-5 is the largest cycle scaffolded to date, in line with §1.1's dual-truth-loop claim.

## §5 Steward approval gate

- [ ] Story locked (§1)
- [ ] Criteria locked (§2)
- [ ] NFRs locked (§3)
- [ ] **EOS-4 has validated to production (precondition for §5 sign-off per Steward direction 2026-06-10)**
- [ ] Approved to execute — signed: **{Steward initials}** **{date}**

> *Single-open-cycle global mutex:* EOS-5 cannot enter `04_in_development/` until EOS-4 reaches `06_shipped/` (or, under explicit Steward direction, parallel with EOS-4 per the 2026-06-10 relaxation pattern — but Steward's stated direction is *"after eos-4 is validated to production"* which implies sequential, not parallel). Until then this doc lives in `01_planning/` and the Steward iterates §1-§5 in place. Forward: republic-616 multi-party §5 vote re-engages the strict mutex.

---

# § Agent-authored (bottom half)

*§6-§13 PENDING. Decomposition begins after §5 sign-off AND EOS-4 closure.*

## §6 Layer impact map
*PENDING.*

## §7 Schema deltas
*PENDING. Anticipated candidates:*

- New SObjects: possibly `Payment__c`, `TokenMint__c`, `TitheDistribution__c` (or reuse `LedgerEntry__c` with discriminator columns — TBD when §10 designs the wire shape).
- New `Plugin.app_<surface>.RevenueConfig__c` JSON fields on each app's Plugin__mdt record — Stripe price IDs, Apple product IDs, cause-mapping, tier-mapping.
- `Identity__c.PaymentMethod__c` lookup or related list — Stripe customer Id, Apple originalTransactionId, payout destination for tithe distribution.
- `Cycle__c` tagging on every revenue event so karmic accounting includes financial events.

## §8 Service contracts
*PENDING. Anticipated wire shapes:*

- `POST /v1/billing/checkout/start` — surface-agnostic checkout-session creator (returns Stripe Checkout URL or Apple IAP product identifier).
- `POST /v1/billing/webhook/stripe` — Stripe event handler.
- `POST /v1/billing/iap/verify` — Apple receipt validator.
- `GET /v1/billing/balance` — surface-queryable token balance.
- `POST /v1/billing/tithe/distribute` — periodic (cron-triggered? event-driven?) tithe-distribution actor.

## §9 Telemetry assertions
*PENDING. Anticipated signatures:*

- `revenue.checkout.<rail>.<surface>` — fires when a checkout session is created.
- `revenue.payment.<rail>.<surface>` — fires when payment settles.
- `revenue.mint.<surface>` — fires when tokens land in the user's balance.
- `revenue.consume.<event_type>` — fires per llm.turn / equivalent.
- `revenue.tithe.<cause>` — fires per cause-attribution event.
- `revenue.payout.<cause>` — fires per period payout.

## §10 Execution plan
*PENDING.*

## §11 Verification protocol
*PENDING. Anticipated shape: per-surface end-to-end checkout-to-consume run + per-rail webhook / receipt test + tithe-distribution dry-run + tithe-distribution live-run.*

## §12 Rollback plan
*PENDING. Revenue-path rollback is uniquely hairy because payments are real money — financial rollback ≠ technical revert. §12 needs explicit per-rail policy (Stripe refund automation, Apple refund-request flow) + customer-comms templates.*

## §13 Closeout
*PENDING.*
