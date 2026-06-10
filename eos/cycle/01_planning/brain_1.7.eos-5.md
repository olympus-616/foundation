# Revenue path for turtleshell.ai tokens — every surface, Stripe + Apple, autonomous

> File: `brain_1.7.eos-5.md`

| | |
|---|---|
| **Branch family** | `brain/1.7.x.x` |
| **Cycle ordinal** | `eos-5` (5th on this branch family) |
| **Status** | `Planning` — Steward authoring §1-§5. **Cycle does NOT enter `04_in_development/` until EOS-4 is validated to production** (Steward direction 2026-06-10). |
| **Opened** | 2026-06-10 |
| **Closed** | — |
| **Prior cycle** | `brain_1.7.eos-4` (the `brain/1.7.x.x` IS the stable production environment cycle) |
| **Theme** | "After EOS-4 is validated to production, EOS-5 = each surface has its revenue path for turtleshell.ai tokens without my help. Each app needs to have its revenue path finished and production-ready. Both Stripe AND Apple. Must work across all surfaces." — Steward verbatim 2026-06-10 |
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

### §1.1 The autonomous revenue loop (the FOREVER intent)

> As **the Steward — and eventually any dust dancer running their own grid** I want **every consumer surface of the platform to expose a complete, autonomous, production-grade revenue path — sign-up → identity → cause-choice (per cosmic-7) → tier-choice → payment (Stripe for web/desktop, Apple StoreKit/IAP for iOS) → turtleshell.ai-token mint → consumption-metered ledger → 7% tithe to chosen cause — with NO Steward intervention at any step** so that **the platform pays for its own operation by construction, the seven causes receive their tithe by construction, and a sovereign user can start, sustain, and end their relationship with the platform without ever talking to a human.**

**§1.1 is intent. Short of §1.1 is a bug** — same discipline as EOS-1 / EOS-3 / EOS-4 §1.1. Any of the following are §1.1 deviations:

- A new user gets stuck on any surface's signup or payment flow without Steward intervention.
- Tokens purchased on one surface are not honored on another surface (single token economy violated).
- Consumption events fail to debit the user's balance or fail to attribute the tithe.
- The Steward must manually reconcile a payment, manually mint tokens, manually run a tithe distribution, or manually answer a customer-support question about billing.
- The 7% tithe lands at any address other than the cosmic-7 cause-fund mappings.
- A surface's revenue path works in development but fails in production.

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

*PENDING — Steward to draft after EOS-4 closes. Anticipated shapes:*

- **§2.1 Stripe checkout works on every web/desktop surface in scope** — from cold sign-in to first-token consumption, end-to-end, against production Stripe (live keys, not test mode). Observable: a `LedgerEntry__c` credit row with `Source__c='stripe.checkout'` lands in the alpha-org / `og_beta_1` / `og_beta_2` per purchase.
- **§2.2 Apple IAP works on every iOS surface in scope** — App Store Connect product configured, StoreKit transaction signed, receipt validated server-side, tokens minted. Observable: a `LedgerEntry__c` credit row with `Source__c='apple.iap'` lands.
- **§2.3 Single token economy holds** — tokens purchased on one surface are honored on every other surface. Observable: SOQL `SELECT SUM(Amount__c) FROM LedgerEntry__c WHERE Identity__c = :id` returns the same total regardless of which surface queries it.
- **§2.4 Consumption metering debits balance** — every `llm.turn` (or equivalent metered event) writes a `LedgerEntry__c` debit row + an attribution row to the user's chosen cosmic-7 cause for the 7% tithe.
- **§2.5 Autonomous failure handling** — Stripe webhook retry, Apple receipt re-validation, balance-exhausted soft-fail (graceful UX, no platform crash), refund flow per Stripe/Apple policy. All without Steward intervention.
- **§2.6 Production-grade observability** — every payment, every mint, every consumption event, every tithe distribution traceable via `CycleId`-tagged log lines. Plutus / Mnemosyne capture the full chain.
- **§2.7 Tithe distribution proves itself** — at end of each accounting period (TBD: daily / weekly / per-payout), the 7% accumulated per cause has a payout proof (Stripe Connect / direct deposit / cosmos-logos wallet — mechanism TBD) and the SOQL aggregate matches the disbursed amount.
- **§2.8 Repeatability** — independent operator on a fresh machine using ONLY source-controlled materials can repeat §2.1-§2.7 against a fresh scratch + the production stripe / apple sandbox. Same closure semantic as EOS-3 §2.9.

> **Out of scope for EOS-5** (rides future cycles, NOT criteria here): the surfaces that have not yet productionized by EOS-5 open (per the gating table in §1.2); republic-616 governance of tithe-distribution policy (single-Steward direction for now); B2B / enterprise billing tiers (consumer single-tier first); multi-currency (USD only for the first slice); refund / chargeback automation beyond the rails' built-in capabilities.

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
| Memory `feedback_cosmic_seven_canonical.md` | 7 causes / 7% tithe / 7/17/2026 launch / #i7777 hashtag — **load-bearing brand canonical, never narrow** | The tithe-attribution scheme is non-negotiable; §2.4 + §2.7 enforce it |
| EOS-4 §13 closeout | Whichever §1.1 deviations from EOS-4 are revenue-path-shaped | Inherited by EOS-5 as starting work-items |
| EOS-3 §13 D7 | No `OrgWideEmailAddress` in scratch | Branded email flow is part of the revenue path (receipts, balance-low warnings, etc.) — must be wired in prod |
| Memory `project_application_profile_refactor.md` | Per-app config = Plugin__mdt | The revenue config per surface likely also lives in Plugin__mdt (`Plugin.app_X.RevenueConfig__c` JSON shape TBD) |

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
