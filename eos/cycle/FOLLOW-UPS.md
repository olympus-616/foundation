# EOS Follow-Ups — deferred work surfaced by open cycles

> Board-visible index of every "future cycle" item flagged in an open cycle's §10 deferred / §13 feedback / cross-cycle §6 collateral. Rows graduate to their own cycle doc (with an assigned ordinal) when the Steward picks one to open. Updated whenever a new cycle absorbs a source doc and identifies follow-ups.
>
> **Scope of this file** — items that are NOT yet cycles but ARE known future work. If it's on this list, the fleet has an obligation. If it's a cycle in `01_planning` → `06_shipped`, it's out of this list.
>
> **Not this file's scope** — the twelve canonical EOS-1…12 attestations (see `README.md`) and the twelve launch-critical CAND-A through CAND-L candidates (see `00_backlog/`). Those live in the ordinal / candidate namespaces already; this file only covers post-cycle follow-ups.

## How to read the table

- **From** — the cycle(s) that surfaced this follow-up. Follow the link for §10.deferred or §13.feedback context.
- **God / scope** — primary god(s) that will own the work; ‹fleet› = cross-cutting, ‹RFC› = decision-first, ‹republic› = Republic-616 governance question.
- **Theme** — one-line summary of what this cycle will attest.
- **Prospective shape** — hint at the ordinal / decomposition when it opens. Placeholder until the Steward assigns.

---

## BYOK / sovereign-AI cascade (source: `brain_1.7.eos-5.5` umbrella + `5.7` apollo + `5.8` athena)

| From | God / scope | Theme | Prospective shape |
|---|---|---|---|
| [5.7](04_in_development/brain_1.7.eos-5.7.md#101-deferred-to-a-future-cycle) · [5.8](04_in_development/brain_1.7.eos-5.8.md#104-deferred-to-a-future-cycle) | ‹fleet› | Shared crypto extraction — `@olympus/cosmos-logos-server` package deduplicates apollo + athena `sovereign-envelope.ts` | small sub-cycle; ADR first |
| [5.7](04_in_development/brain_1.7.eos-5.7.md#101-deferred-to-a-future-cycle) · [5.8](04_in_development/brain_1.7.eos-5.8.md#104-deferred-to-a-future-cycle) | ‹fleet› | Legacy `providerKeys` cleartext deprecation — retire after fleet-wide v2 adoption; observable now via `key_source='byok_legacy_plaintext'` | cycle gated on client migration |
| [5.7](04_in_development/brain_1.7.eos-5.7.md#101-deferred-to-a-future-cycle) | apollo | Music revenue enablement — add `music.*` events to Plutus `BILLABLE_EVENTS` (schema is forward-compatible today) | small sub-cycle post-launch |
| [5.5 §6.B](04_in_development/brain_1.7.eos-5.5.md) | ‹cascade fanout› | BYOK fanout to remaining surfaces — turtleshell-ios #32 → iris → turtleshell-web → offgrid → cluster-level BYOK | multiple per-surface cycles |

---

## HUD cascade (source: `brain_2.7.eos-1` umbrella + `1.1` ares + `1.2` hermes)

| From | God / scope | Theme | Prospective shape |
|---|---|---|---|
| [1.1](04_in_development/brain_2.7.eos-1.1.md#105-deferred-to-a-future-cycle) · [1.2](04_in_development/brain_2.7.eos-1.2.md#105-deferred) | ‹fleet› | Migrate HUD-participating repos to `cycle/eos-<N>` shared branch pattern — retire `@alchemisthomer/neuralpathway/*` per-thought branches for cycle work | one bundle cycle after HUD ships |
| [1.1](04_in_development/brain_2.7.eos-1.1.md#105-deferred-to-a-future-cycle) · [1.2](04_in_development/brain_2.7.eos-1.2.md#105-deferred) | ‹fleet› | Fleet `CLAUDE.md` brain-family sweep — 1.7 → 2.7 rename across every `CLAUDE.md` in parent + gods | housekeeping cycle |
| [1.2 §2.5](04_in_development/brain_2.7.eos-1.2.md) | hermes | Public-ingress mount for sms/email/register — uncomment mounts + Ares `forward.ts` entries + Twilio/SendGrid signature verification + smoke tests + mirror docs + security-review sign-off. Activates if hermes 1.2 §5 SPLIT ruling chosen. | direct follow-up to 1.2 |
| [brain_2.7.eos-1 §3](04_in_development/brain_2.7.eos-1.md) | ‹fleet› | L7 poll-implementation ruling implementation — Platform Event push OR shared batched pull; activates on umbrella §5 ruling | inline to 2.7.eos-1 §10 |
| [brain_2.7.eos-1 §2.15](04_in_development/brain_2.7.eos-1.md) | olympus-grid | `LedgerEntry.trigger before delete` guard OR permset-only-visibility choice execution; activates on umbrella §5 ruling | inline to 2.7.eos-1 §10 |
| [brain_2.7.eos-1 §13](04_in_development/brain_2.7.eos-1.md) | ‹cosmos-logos client-side› | Client-side hostile defense for cosmos-logos surfaces (turtleshell-web / turtleshell-ios / turtleshell-offgrid) — request throttling, backoff, billing-anomaly telemetry | cycle after 2.7.eos-1 ships |
| [brain_2.7.eos-1 §10.2 step 9](04_in_development/brain_2.7.eos-1.md) | ‹fleet› | Kronos harness build — the redteam attack harness for §9.HUD-* verification. Plan doc exists (`hostile-universe-defense-kronos-redteam-plan-2026-07-24.md`); harness itself NOT YET BUILT. | major sub-cycle of 2.7.eos-1 |
| [brain_2.7.eos-1 §10.3](04_in_development/brain_2.7.eos-1.md) | ‹fleet› | Kronos-in-CI wiring — automate the harness into CI (this cycle runs Kronos manually) | small follow-up cycle |

---

## Aeon primitive fanout (source: `brain_2.7.eos-2` aeon)

| From | God / scope | Theme | Prospective shape |
|---|---|---|---|
| [eos-2 §10.8](02_design/brain_2.7.eos-2.md#108-deferred-to-a-future-cycle) | hera | Real hera build — integrity-token semantics + verification protocol (slice-1 uses hera stub) | new primary cycle |
| [eos-2 §10.8](02_design/brain_2.7.eos-2.md#108-deferred-to-a-future-cycle) | plutus | Real plutus quote-amount calculation (slice-1 uses stubbed amounts) | sub-cycle |
| [eos-2 §10.8](02_design/brain_2.7.eos-2.md#108-deferred-to-a-future-cycle) | proteus | Real proteus per-agent-backend fanout — git / dynamo / IPFS / etc. beyond slice-1 SF-plus-stub | multiple sub-cycles |
| [eos-2 §5.A](02_design/brain_2.7.eos-2.md) · [eos-2 §10.8](02_design/brain_2.7.eos-2.md#108-deferred-to-a-future-cycle) | ‹republic› | **Republic-616 wiring for aeon open questions** — default recursion depth, sabbath scope, coin exchange semantics on chain transition, quote-lease crash behavior, cross-namespace task authority, queue-write authority. Each Q-N becomes its own governance sub-cycle. | major multi-cycle body |
| [eos-2 §10.8](02_design/brain_2.7.eos-2.md#108-deferred-to-a-future-cycle) | athena | NL → structured intent-schema promotion loop — athena compiles repeated operator NL patterns into hestia intent schemas over time | new primary cycle |
| [eos-2 §5.A Q-5](02_design/brain_2.7.eos-2.md) | ‹fleet› | Cross-namespace task authority model — task in namespace A targeting agent in namespace B (allowed / gated / forbidden) | governance-first cycle |
| [eos-2 §10.8](02_design/brain_2.7.eos-2.md#108-deferred-to-a-future-cycle) | plutus | Chain-backed olympus-coin — SF ledger → real chain transition; Q-3 exchange semantics decided by republic-616 | major primary cycle |

---

## Argos observability plane fanout (source: `brain_2.7.eos-3` argos)

| From | God / scope | Theme | Prospective shape |
|---|---|---|---|
| [eos-3 §5.B RFC-A](02_design/brain_2.7.eos-3.md#5b-rfc-gate--three-irreversible-decisions-to-publish-before-code-lands) | ‹RFC› | **RFC-A — cold storage archival format** (candidate: JSONL + SQLite index; must be `less`-openable in 2075). Irreversible for existing data once ratified. | RFC in `foundation/eos/rfcs/` before implementation |
| [eos-3 §5.B RFC-B](02_design/brain_2.7.eos-3.md#5b-rfc-gate--three-irreversible-decisions-to-publish-before-code-lands) | ‹RFC› | **RFC-B — AQL grammar surface**; grammar changes break every saved query. Irreversible for operator muscle memory. | RFC before implementation |
| [eos-3 §5.B RFC-C](02_design/brain_2.7.eos-3.md#5b-rfc-gate--three-irreversible-decisions-to-publish-before-code-lands) | ‹RFC› | **RFC-C — Argos↔Plutus contract shape**; every future storage adapter + every emitting god depends on this. Irreversible for adapters in prod. | RFC before implementation |
| [eos-3 §5.C](02_design/brain_2.7.eos-3.md#5c-cross-god-routing-table--what-argos-cannot-land-alone) | plutus | Plutus storage-adapter implementations — S3 / Dropbox / Tailscale / IPFS satisfying RFC-C contract; retention / rollover / hot-warm-cold tiering machinery | plutus sub-cycle |
| [eos-3 §10.2 step 6](02_design/brain_2.7.eos-3.md) | ‹fleet› | `@olympus-616/argos-shipper` library — drop-in `console.log` replacement with batching + retry + local-disk spool | argos sub-cycle |
| [eos-3 §10.4](02_design/brain_2.7.eos-3.md) | ‹fleet› | Every-god argos-shipper adoption — small per-repo cycles to swap `console.*` for argos across the pantheon | multiple per-god cycles |
| [eos-3 §10.6](02_design/brain_2.7.eos-3.md#106-deferred-to-future-cycles) | argos | Anomaly detection beyond static thresholds — moving-average baselines, sudden-silence detection, per-god behavioural drift | future cycle |
| [eos-3 §10.6](02_design/brain_2.7.eos-3.md#106-deferred-to-future-cycles) | ‹fleet› | Cross-god `requestId` propagation middleware — each god needs a tiny middleware; most of the pantheon doesn't propagate yet | multiple small per-god cycles |
| [eos-3 §10.6](02_design/brain_2.7.eos-3.md#106-deferred-to-future-cycles) | argos | Multi-tenant view — same Argos instance surfacing dev / int / prod / offgrid customer units with per-org silencing | future cycle |
| [eos-3 §10.6](02_design/brain_2.7.eos-3.md#106-deferred-to-future-cycles) | ‹cosmos-logos + ares› | Argos access control — cosmos-logos handshake + Ares scoping so operators only see their own environments | blocked on access-control cycle |
| [eos-3 §10.6](02_design/brain_2.7.eos-3.md#106-deferred-to-future-cycles) | poseidon | Argos MCP tool — LLM-driven forensics ("what's wrong right now?") via MCP; poseidon exposes the tool | future cycle |

---

## EOS-portal UI enhancements (source: Steward direction 2026-09-25 + `brain_2.7.eos-1` §13 feedback)

| From | God / scope | Theme | Prospective shape |
|---|---|---|---|
| Steward 2026-09-25 | iris (portal-app-eos) | **God-filter for EOS board** — every cycle doc has a primary-god tag; UI filters cycles by god. Adds a `primary_god:` frontmatter field to cycle docs (backfill needed for cross-cutting umbrellas: `‹cross-cutting›`, `‹umbrella-BYOK›`, `‹umbrella-HUD›`). | iris-scoped small cycle |
| [brain_2.7.eos-1 §13](04_in_development/brain_2.7.eos-1.md) | iris (portal-app-eos) | **URL-parser gaps** for `@alchemisthomer/neuralpathway/*` refs — walk successive branch-prefixes, accept encoded + unencoded interchangeably, auto-redirect `/tree/<ref>/<file>` ↔ `/blob/<ref>/<file>` | iris-scoped small cycle |
| [brain_2.7.eos-1 §13](04_in_development/brain_2.7.eos-1.md) | iris (portal-app-eos) | **Anonymous rate-limit ceiling** on GitHub API reads — aggressive server-side cache (blobs at resolved SHA cache forever); coalesce Activity-panel poll; shared GitHub App identity so anonymous reads don't consume per-IP quota; surface remaining quota + reset-at time | iris-scoped small cycle |

---

## Sibling frozen / paused cycles (source: existing `04_in_development/`)

| From | God / scope | Theme | Prospective shape |
|---|---|---|---|
| [eos-5](04_in_development/brain_1.7.eos-5.md) | ‹cross-cutting› | **EOS-5 primary — FROZEN 2026-07-02**. Return-to-work checklist in `eos-5b-triage.md`. Full closure requires §9.A + §9.T assertion matrix green. | reopen after client-work window |
| [eos-5b-triage](04_in_development/eos-5b-triage.md) | ‹cross-cutting› | EOS-5 gap tracker — GAP-A through GAP-Z closure log with production evidence per gap | active companion doc |
| [eos-5.1](04_in_development/brain_1.7.eos-5.1.md) | ‹cross-cutting› | Compliance-ready-globally — deployable alongside Apple's channels; **Draft, awaiting §1-§5** | Steward authors §1-§5 |
| [eos-5.2](04_in_development/brain_1.7.eos-5.2.md) | ares (guest lockdown) | Guest-access lockdown — no revenue-attributing endpoint admits an unattributed request; **Draft, awaiting §1-§5** | Steward authors §1-§5 |
| [eos-5.3](04_in_development/brain_1.7.eos-5.3.md) | plutus (tithe integrity) | First-dollar-through tithe integrity — idempotent 7% tithe row per settlement; **Draft, awaiting §1-§5** | Steward authors §1-§5 |
| [eos-5.4](01_planning/brain_1.7.eos-5.4.md) | ‹cross-cutting substrate› | Sovereign substrate — no vendor lock-in as a beta gate; **Draft** | Steward authors §1-§5 |
| [eos-5.6](01_planning/brain_1.7.eos-5.6.md) | ‹cross-cutting shell balance› | Durable shell balance — every user's sea-shell balance correct, atomic, observable; **Draft** | Steward authors §1-§5 |

---

## `06_shipped/` metadata reconciliation

| From | God / scope | Theme | Prospective shape |
|---|---|---|---|
| [brain_1.7.eos-4.1](06_shipped/brain_1.7.eos-4.1.md) | iris (EOS portal) | Header metadata reconciliation — file lives in `06_shipped/` but Status still reads `In Development`; `Closed:` field not stamped; §13 closeout timestamp missing. Non-blocking historical cleanup. | one-commit cleanup |

---

## Governance / process observations (source: cycle bodies)

| From | God / scope | Theme | Prospective shape |
|---|---|---|---|
| [eos-5.7 §13](04_in_development/brain_1.7.eos-5.7.md) · [eos-1.1 §13](04_in_development/brain_2.7.eos-1.1.md) · [eos-1.2 §13](04_in_development/brain_2.7.eos-1.2.md) · [eos-5.8 §13](04_in_development/brain_1.7.eos-5.8.md) | ‹fleet› | Anti-pattern memory candidate — "MERGEABLE / CLEAN + empty `statusCheckRollup`" is NOT green CI evidence. Multiple new tickets flag this same pattern; extract into a memory rule + optional pre-merge lint. | memory + optional pr-lint |
| [eos-2 §5.A](02_design/brain_2.7.eos-2.md) | ‹republic› | Six aeon open questions (Q-1…Q-6) — retention default, sabbath scope, coin exchange semantics on chain switch, quote lease behavior, cross-namespace, queue-write authority. Each becomes a governance sub-cycle when republic-616 is wired. | governance cycles |
| [eos-3 §5.D](02_design/brain_2.7.eos-3.md) | ‹republic› | Six argos open questions (Q-1…Q-6) — retention default, grammar extensibility, cold format canon ratification, notification quota, multi-tenant authority, anomaly sensitivity default. | governance cycles |

---

## Notes

- Every row is a **known obligation** — the fleet promised itself this work when the source cycle absorbed a source doc. Rows do not disappear silently; they graduate to cycle status or the Steward explicitly deprecates them.
- **Prospective ordinals** are placeholders. Actual ordinals get assigned at open per the README naming convention (`brain_{family}.eos-{N}[.{M}].md`).
- **Cross-cutting themes** (e.g., "every god adopts argos-shipper") may open as multiple parallel small cycles or one bundle cycle — the decision belongs to the Steward at open time.
- **Republic-616 governance rows** are surfaced pre-body so that when republic-616 lights up, its first agenda is already populated by the design stage rather than being handed a fait accompli.
- **RFC rows** deserve write-ups in `foundation/eos/rfcs/` (folder to be created by the first RFC-producing cycle) before code lands. This applies especially to Argos RFC-A/B/C where the decisions outlive the code by decades.
