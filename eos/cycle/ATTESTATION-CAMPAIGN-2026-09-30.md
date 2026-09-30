# EOS attestation campaign — post-2026-09-30 `brain/2.7.x.x` deploy · surface-by-surface

> **Purpose.** This is the campaign map for the fresh attestation pass that follows the [2026-09-30 production deploy](DEPLOY-2026-09-30.md). It captures (a) what has already SHIPPED and is now the canon every agent must inherit, (b) what is IN-PROGRESS and needs behavior probes to close, and (c) the Steward-directed priority sequence: **stabilize → attest agent → bring other surfaces up to the SF-via-poseidon baseline**.
>
> **This doc is the summary; details live in the individual tickets.** Each cluster below links to its per-repo attestation tickets in `04_in_development/`; each ticket carries its own §5 rulings, §9 telemetry-signal contracts, and §10 execution plan.
>
> **The corresponding PR body IS this summary.** Once each linked ticket closes (§9 signals fire green + §5 gate signed), the campaign closes as an atomic unit against `brain/2.7.x.x`. This is the "one attestation pass, many surfaces, one closure" shape.

---

## Purpose in one paragraph

The 2026-09-30 deploy proved code identity — the exact source SHAs the fleet intended are running in production across 8 gods + parent. But **no §9 behavior probe has been run against that deployed state**. This campaign is the pass that fires the §9 signals across every affected ticket, catches the untested items (especially security-scoped), and moves each ticket from `04_in_development/` to `05_verifying/` or `06_shipped/` as attestation completes. The baseline: **Salesforce works through the sovereign cosmos-logos wire (poseidon path).** Every other surface must be brought up to that level.

---

## Attestation posture — code-identity ≠ behavior

**Code identity** (necessary): the exact source SHA the ticket references is what's running in production, and features are registered at boot. Verified 2026-09-30 for 8 gods per [DEPLOY-2026-09-30](DEPLOY-2026-09-30.md).

**Behavior** (sufficient for close): §9 telemetry signals fire against production probes — sealed-envelope round-trips, defeating-attack refusals, ledger-truth grep, god-key-rotation kill-switch smokes, cross-surface parity checks. **This is what this campaign delivers.**

**Steward direction 2026-09-29** — the untested surface is exactly what this pass exists to catch, especially security-scoped items: sealed-envelope inbound, sealed-credential at-rest storage, god-key rotation, Ares W3/W4/§11.1/CF_SECRET, Plutus insert-with-duplicate-catch, Hermes §11.5 audit-trail.

---

## Priority sequence

Per Steward direction 2026-09-29 and DEPLOY-2026-09-30 §"Attestation priority sequence":

1. **Stabilize** — clear the deploy-surfaced follow-ups (XAI key, **poseidon seed-length security-critical blocker**, version env vars, fleet-wide `cluster_name` grep-zero).
2. **Attest agent** — the `iris/reactforce/agent/` surface + brain-genesis primary + agent-scope subs (`brain_2.7.eos-5` + `5.1..5.5`) brought to the same attestation level as SF-via-poseidon-sovereign-cosmos-logos.
3. **Bring other surfaces up** — turtleshell-web / turtleshell-ios / iris portals / offgrid, sequential, each to SF-via-poseidon parity.

The priority is not "do everything at once." SF is done; agent is next; then fan out.

---

# § 1. WHAT HAS SHIPPED — canon the agent inherits

Five immutable cycles in `06_shipped/`. **Every attestation of the agent surface (and every future surface) must inherit these** — they are the operational-truth baseline of the platform. The agent surface cannot be attested "in isolation" of these; it must demonstrate each holds for its own scope.

| Ordinal | Shipped | Canonical claim | What the agent surface must inherit |
|---|---|---|---|
| **`brain_1.7.eos-1.md`** | 2026-05-31 | *"Recursive loop of AI-generated software that is visible to the AI that built it."* | Agent-surface changes are visible to the AI that built them — attestation loop is self-observable. |
| **`brain_1.7.eos-2.md`** | 2026-06-10 (PR #166) | *"Says what it does, does what it says — claim 1: athena-717 reachability."* Salesforce admin spawns AWS cluster + talks to it end-to-end. | Agent surface's cluster-provisioning + reachability path is intact — spawn cluster from SF, agent app talks to it, closes the loop. |
| **`brain_1.7.eos-3.md`** | 2026-06-11 | *"Entire application can be constructed by accessing public GitHub repositories and following the instructions therein."* 5 surfaces (omens + turtleshell-web + turtleshell-ios + olympus-gpt + iris-portal). | Agent surface is reproducible from public repos — someone reading `iris/reactforce/agent/` docs + parent CLAUDE.md can bring the surface up from void. |
| **`brain_1.7.eos-4.md`** | 2026-06-11 (co-shipped with EOS-3) | *"Checking into `brain/1.7.x.x` (now `brain/2.7.x.x`) IS the production deployment."* | Agent surface merges to brain → CDK deploys → prod runs the new agent. Verified structurally by DEPLOY-2026-09-30 (all 8 submodule bumps → docker → ECR → ECS). |
| **`brain_1.7.eos-4.1.md`** | 2026-06-11 (co-shipped) | *"Recursive self-attestation — the EOS tool deployed by the EOS process attests the EOS process itself."* Public iris-portal app at `app.olympus-grid.com/eos`. | Agent surface's attestation is discoverable via the EOS portal — this campaign's own summary is browsable from the portal once merged. |

**What "attest agent on those levels" means concretely.** For the agent-app-extension surface (`iris/reactforce/agent/`, home of brain-genesis), the campaign closes only when each of the 5 shipped claims is empirically true for that surface: visible to the AI (eos-1), reachable via athena-717 pattern (eos-2), reproducible from public repos (eos-3), merge-is-deploy (eos-4), self-attesting via portal (eos-4.1).

---

# § 2. WHAT IS IN-PROGRESS — 27 tickets across 5 clusters

## Cluster 2.A · BYOK sealed-envelope trio + umbrella + siblings (11 tickets)

**Baseline attested by construction 2026-09-29:** Salesforce works through the sovereign cosmos-logos wire. Poseidon receives sealed envelopes, processes SF-scoped MCP calls, and Salesforce is reachable. **This is the current attested level; every other surface must be brought to parity.**

**Umbrella claim (refined 2026-09-28):** *"Every cross-service call to an Olympus god is delivered inside a Cosmos-Logos envelope sealed to that god's public key; the plaintext exists only at composition on the caller and at the god's process boundary after decrypt — never on any wire, log, or intermediate store between. Credentials the god holds on the caller's behalf are stored sealed to the same god's public key. God-key rotation is the universal kill switch."*

| Ticket | Scope | Deploy status | Attestation-pass action |
|---|---|---|---|
| [`brain_1.7.eos-5.5.md`](04_in_development/brain_1.7.eos-5.5.md) | Umbrella — sealed-at-capture / decrypt-at-god-boundary axiom | n/a (umbrella) | Umbrella close is downstream of the trio + siblings closing |
| [`brain_1.7.eos-5.7.md`](04_in_development/brain_1.7.eos-5.7.md) | **apollo** — voice TTS/music BYOK envelope | Code identity ✓ (`APOLLO ONLINE 1.0`) | Fix G-1 CORS `exposedHeaders`; run 3-provider byok-test; browser CORS smoke; deploy attestation E-4 through E-7 |
| [`brain_1.7.eos-5.8.md`](04_in_development/brain_1.7.eos-5.8.md) | **athena** — LLM router BYOK anchor reference impl | Code identity ✓ (`Athena 2.0.0, 5 tiers, MCP discovery via Poseidon`) | Run 11 local BYOK-provider gates (openai/anthropic/grok/gemini/ollama v1+v2); SSM key rotation lockstep smoke; cross-surface parity check (web/iOS/iris/offgrid); **fix XAI_API_KEY missing** |
| [`brain_1.7.eos-5.9.md`](04_in_development/brain_1.7.eos-5.9.md) | **omens** — game-engine client-side v2 envelope primitives + cluster domain cutover | Not in deploy (PR #60 unmerged, blocked on olympus-grid domain rename) | Confirm olympus-grid `/v1/grid/master/grid/clusters/me` returns `"domain"`; run `test-byok-v2.js` cross-repo attestation; merge PR #60; both `eos-mint-and-run.sh` variants green |
| [`brain_1.7.eos-5.10.md`](04_in_development/brain_1.7.eos-5.10.md) | **plutus attribution** — 7% floor + reversal + orion + `/meter-messaging` (TWIN with 2.7.eos-1.3) | Code identity ✓ (`PLUTUS ONLINE, /v1/plutus/api/ingest live traffic`) | Live 7% attribution smoke + refund reversal smoke; **closes together with 2.7.eos-1.3** |
| [`brain_1.7.eos-5.11.md`](04_in_development/brain_1.7.eos-5.11.md) | **poseidon** — sovereign envelope + sealed-credential-at-rest storage | Code identity ✓ but **🔴 CRITICAL BLOCKER**: `Poseidon fingerprint compute failed: invalid seed length → falls through to static manifest pub key` | **Priority 1 stabilize.** Fix SSM-injected key PEM shape (Ed25519 32-byte seed). Until fixed: §2.10 manifest coherence RED, §2.8 + §2.9 god-key kill switches NOT ARMED, §9.PSD-7/8/9 red by construction |
| [`brain_1.7.eos-5.md`](04_in_development/brain_1.7.eos-5.md) | Primary — system-wide transactional accounting + autonomous revenue path | FROZEN 2026-07-02 | Steward-owned unfreeze after client-work window; feeds forward from plutus attribution (5.10) evidence |
| [`brain_1.7.eos-5.1.md`](04_in_development/brain_1.7.eos-5.1.md) | Compliance-ready-globally (Apple channels) | Draft | Steward authors §1-§5 |
| [`brain_1.7.eos-5.2.md`](04_in_development/brain_1.7.eos-5.2.md) | Guest-access lockdown — no revenue-attributing endpoint admits unattributed request | Draft | Steward authors §1-§5 |
| [`brain_1.7.eos-5.3.md`](04_in_development/brain_1.7.eos-5.3.md) | Tithe integrity + first-dollar-through | Draft | Steward authors §1-§5 |
| [`eos-5b-triage.md`](04_in_development/eos-5b-triage.md) | EOS-5 gap tracker (companion doc) | Active | Refresh gap-log against 2026-09-30 deploy evidence |

**Campaign target for this cluster:** Trio-attestable (athena / apollo / poseidon) as the shared σ-1…σ-5 signal shape — request accepted, malformed refused, plaintext grep zero-hits, god-key rotation kill-switch, manifest coherence — plus plutus attribution twin closure. **Poseidon seed-length is the load-bearing blocker; must be fixed before anything else in this cluster attests.**

---

## Cluster 2.B · HUD cascade — 14-layer bounded-cost defense (7 tickets)

**Umbrella claim:** *"Following the 2026-07-17 adversarial cost event, every layer at which an adversary can convert traffic into cost is bounded by construction across a fourteen-layer cascade (L1–L14), implemented in six coordinated pull requests spanning olympus-grid, ares, plutus, zeus, hermes, and the parent."*

| Ticket | Scope | Deploy status | Attestation-pass action |
|---|---|---|---|
| [`brain_2.7.eos-1.md`](04_in_development/brain_2.7.eos-1.md) | Umbrella — HUD hostile-universe defense L1–L14 | Downstream layers deployed 2026-09-30 **without W1 schema anchor** | Steward-review action: confirm SF-side Cluster__c fields pre-existed on target org OR soft-fail semantics kicked in. Ruling drives whether W1 must land properly before HUD closes. |
| [`brain_2.7.eos-1.1.md`](04_in_development/brain_2.7.eos-1.1.md) | **ares W3+W4** — 5-stage plutus-emit pipeline + L7 cluster-status kill switch + §11.1 IP allowlist + CF_SECRET | Code identity ✓ (`AresGateRefusal EMF live, Policy compiled-strict-v1`) | Rate-cap burst smoke; cluster-status-flip smoke; IP-allowlist 403-out-of-range smoke; CF_SECRET external-vs-localhost smoke; trust-boundary-spoof smoke — **no defeating-attack probe has fired yet** |
| [`brain_2.7.eos-1.2.md`](04_in_development/brain_2.7.eos-1.2.md) | **hermes §11.5** — `OLYMPUS_GRID_MASTER_URL` normalize + unmounted route modules | Code identity ✓ (`Hermes 1.7.4, 33 routes, Heracles + Logos facades`) | Full-chain audit-trail smoke (Ares → Plutus → SF Site Guest → LedgerEntry__c); URL-normalize idempotency test; unmounted-routes return 404; **Steward SPLIT vs SHIP-AS-IS ruling** |
| [`brain_2.7.eos-1.3.md`](04_in_development/brain_2.7.eos-1.3.md) | **plutus HUD W2** — 3-tier ring buffer + SIGTERM last-gasp + insert-with-duplicate-catch (TWIN with 1.7.eos-5.10) | Code identity ✓ (retry_ttl_expired is W2 designed behavior, not error) | Tier-priority drain order test; SIGTERM critical-first flush; DUPLICATE_VALUE catch smoke; fleet-wide `cluster_name` grep-zero verification; **closes together with 1.7.eos-5.10** |
| [`brain_2.7.eos-1.4.md`](04_in_development/brain_2.7.eos-1.4.md) | **olympus-grid W1** — schema anchor + validation rules + drift | ✗ NOT DEPLOYED (PR #345 has 4 hard blockers) | Steward disposition: A (fix in place) / B (split) / C (close and re-cut). 4 blockers to clear: CI deploy red, `.forceignore` un-ignore, cosmos-logos.json placeholder pubkey, dual OG_Signing_Key.crt location |
| [`brain_2.7.eos-1.5.md`](04_in_development/brain_2.7.eos-1.5.md) | **parent olympus-616** — HUD coordinator (PR #198 + orthogonal PR #199 docs) | Code identity ✓ (5 stale submodule ptrs deferred to separate `[prod deploy approval]`) | Merge PR #198 + PR #199 (both docs-only for #199, launcher-scope for #198); separate ptr-bump PR for the 5 stale subs |
| [`brain_2.7.eos-1.6.md`](04_in_development/brain_2.7.eos-1.6.md) | **zeus W5+W7b** — WAF hardening + origin secret metadata | Code identity ✓ (`ZEUS 1.7.4`) | WAF rule presence verification in `edge-global-stack.ts`; `cluster.sh` fingerprint-triplet writes on next provision; raw-secret grep-zero; **L10 per-cluster IPSet explicitly deferred** |

**Campaign target for this cluster:** all 6 per-repo attestations close together via the coordinated merge sequence — either the W1-first path (per HUD §10.2) if olympus-grid #345 lands, OR a Steward-blessed skipping-of-W1 path (with a follow-up cycle to close the schema anchor) given the deployed state already sits without it. Kronos playbook (once built) provides the third-party-witnessed evidence class.

---

## Cluster 2.C · Brain-Genesis / agent-app extension (6 tickets) — **STEWARD PRIORITY**

**Umbrella claim:** *"Ship the smallest working Olympus-Brain that lets Greg manage his real life (finances, obligations, relationships, property, projects) through Olympus-Grid today, delivered as an extension of the existing agent app (`iris/reactforce/agent/`), reachable by drilling in from the agent hero on mobile Chrome on iPhone (v1 requirement, not a follow-up)."*

**Per Steward direction 2026-09-29, this is priority sequence step 2 — attest agent to the SF-via-poseidon baseline before fanning out to other surfaces.**

| Ticket | Scope | Blocker |
|---|---|---|
| [`brain_2.7.eos-5.md`](04_in_development/brain_2.7.eos-5.md) | Primary — Brain-Genesis digital twin v1 on iPhone Chrome | Verify + Proteus wiring + PerspectiveBar + Today view + real Genesis fact + iPhone demo |
| [`brain_2.7.eos-5.1.md`](04_in_development/brain_2.7.eos-5.1.md) | `/agent` surface production ship | Local sentinel bundleId `.dev.priv45`; needs `deployAlphaAgent` + 4-way bundleId pin + iris/olympus-grid PR pair |
| [`brain_2.7.eos-5.2.md`](04_in_development/brain_2.7.eos-5.2.md) | iris PR #135 merge (carries agent workspace scaffolding) | Steward review + drift disposition (co-owned with `2.7.eos-7`) |
| [`brain_2.7.eos-5.3.md`](04_in_development/brain_2.7.eos-5.3.md) | Canonical design docs port | Port `OLYMPUS_AGENT_MVP.md` + `OLYMPUS_BRAIN_ARCHITECTURE.md` + `TEMPLEATHENA_KEY_MANAGEMENT.md` from stale `olympus-agent-mvp` branch |
| [`brain_2.7.eos-5.4.md`](04_in_development/brain_2.7.eos-5.4.md) | Templeathena / Logos key routing | Path A (rotate SSM) OR Path B (per-cluster routing per spec); athena backend change owner unassigned |
| [`brain_2.7.eos-5.5.md`](04_in_development/brain_2.7.eos-5.5.md) | Cycle branch convention violation (fleet-wide) | Path A (grandfather) OR Path B (migrate to `cycle/eos-<N>`); needs active EOS cycle N confirmation |

**Campaign target for this cluster:** the agent surface attested at the same level as SF-via-poseidon:
- Sealed-envelope inbound + BYOK path (inherits BYOK cluster attestation)
- Reachable from hero on iPhone Chrome (from Brain-Genesis §AC-14 demo)
- Cluster-picker resolves + rendering works (per omens 5.9 dependency inversion)
- Docs canonically ported + design specs current (5.3)
- Templeathena key routing works (5.4)
- Branch discipline held (5.5)
- Post-brain-genesis §9.GEN + §9.LEN + §9.FACT + §9.NENT signals fire against the deployed agent app

---

## Cluster 2.D · Standalone 2.7 primaries (4 tickets)

| Ticket | Scope | Deploy status | Attestation-pass action |
|---|---|---|---|
| [`brain_2.7.eos-4.md`](04_in_development/brain_2.7.eos-4.md) | **kronos** — Universal Adversarial Assurance Platform (loyal adversary red-team framework) | n/a (framework buildout) | Steward-owned §3 rulings: vocabulary reconciliation, first-stub choice, first-surface adapter. Framework-only rule non-negotiable. Downstream: kronos is the third-party witness for EVERY other cluster's §9 signals. |
| [`brain_2.7.eos-6.md`](04_in_development/brain_2.7.eos-6.md) | **poseidon** — dynamic MCP router v2 control plane (PR #40) | Code identity ✓ (`Dynamic MCP catalog proxies olympus-grid`) — this is the SF-via-poseidon baseline | Rebase vs PR #41 metering-middleware check; three-PR co-merge coordination (olympus-grid #288 + athena PR TBD); 49-tool re-introduction cascade blocked on SF↔poseidon bridge contract |
| [`brain_2.7.eos-7.md`](04_in_development/brain_2.7.eos-7.md) | **iris** — portal delivery fleet (PRs #135 + #136 + workspace inventory) | Partial (PR #135 unmerged; agent workspace scaffolding awaits) | PR #135 merge disposition co-owned with `brain_2.7.eos-5.2`; PR #136 (gpt-api docs) merges independently (path-disjoint); varent local dirty resolution; `.dev` bundleId sentinel → real 2.7 bundle cut |
| [`brain_2.7.eos-8.md`](04_in_development/brain_2.7.eos-8.md) | **olympus-gpt.ai** — developer portal + 224-route forecasted API surface | Initiative tracker | 5 Steward decisions: PR #136 disposition + 3 handoff owners (Plutus P0 / Keys hard-delete / Quota+throttle) + vision refresh + DNS cutover + branch discipline |

**Campaign target for this cluster:** poseidon is deploy-verified (SF-via-poseidon baseline is here); iris fleet closes on PR #135 + #136 dispositions; olympus-gpt initiative closes on the 5 named decisions; kronos framework buildout is the third-party-witness enabler that unlocks §9 external attestation for every other cluster.

---

## Cluster 2.E · Design stage (2 tickets in `02_design/`)

| Ticket | Scope | Status |
|---|---|---|
| [`brain_2.7.eos-2.md`](02_design/brain_2.7.eos-2.md) | **aeon** — loop kernel; task queue as fleet programming language | Design · §5 pending; §5.A Q-1…Q-6 for republic-616 |
| [`brain_2.7.eos-3.md`](02_design/brain_2.7.eos-3.md) | **argos** — loyal watcher observability; storage-by-policy; Pi/ECS parity | Design · §5.B RFCs A/B/C required before code lands |

**Campaign target for this cluster:** design-stage tickets do NOT close in this campaign. They graduate to `03_ready/` or `04_in_development/` on Steward direction as design decomposition completes. Included here for board visibility.

---

# § 3. What can be validated NOW (post-2026-09-30 deploy) vs. what waits

## Behavior-validatable NOW (deployed code, needs §9 probes)

Every ticket where code identity is ✓ per DEPLOY-2026-09-30:
- **BYOK cluster:** apollo 5.7, athena 5.8, plutus 5.10, poseidon 5.11 (with the seed-length blocker fixed first)
- **HUD cluster:** ares 1.1, hermes 1.2, plutus 1.3 (twin with 5.10), zeus 1.6, parent 1.5
- **Standalone primaries:** poseidon 6 (SF-via-poseidon baseline is already attested by construction)

## Waits on a future deploy

- **olympus-grid W1** (`brain_2.7.eos-1.4`) — PR #345 has 4 hard blockers; not in the 8 submodule pointer bumps of 2026-09-30. Steward disposition A/B/C required.
- **omens PR #60** (`brain_1.7.eos-5.9`) — blocked on olympus-grid domain-rename response. Merges after olympus-grid; behavior probes then possible.
- **Brain-Genesis cluster** — agent-surface production ship (`brain_2.7.eos-5.1`) is blocked on `deployAlphaAgent`; then §9 signals fire. Steward priority — happens after stabilize step 1.
- **iris PR #135** — agent workspace scaffolding waits on Steward review + squash-merge.
- **Design-stage cycles** — aeon + argos wait on Steward §5.A / §5.B decisions.

## Stabilize items MUST clear before anything else attests

1. **🔴 poseidon seed-length fix** — SSM-injected Ed25519 key PEM shape (blocks manifest coherence + god-key kill switch).
2. **`XAI_API_KEY` SSM push** — unblocks athena xAI routing tier.
3. **Version env vars** (`ARES_VERSION` / `ATHENA_VERSION` / `HEPHAESTUS_VERSION`) — cosmetic, low priority but easy fix.
4. **Fleet-wide `cluster_name` grep-zero** — for HUD W2 domain rename verification.

---

# § 4. How this campaign closes

**Attestation completion criteria for this campaign PR:**

1. **Every ticket named above is closed OR explicitly deferred with rationale.** Closed = §5 signed + §9 signals fired green + `git mv` to `06_shipped/`. Deferred = Steward-blessed rationale documented in this summary at close.
2. **Fresh EOS-3 attestation for agent surface** — the shipped canon (eos-1 through eos-4.1) is empirically demonstrated for `iris/reactforce/agent/` per Steward priority 2.
3. **Kronos-witnessed §9 signals** for the highest-priority clusters, once kronos runner exists (per `brain_2.7.eos-4` D-2). Cross-cycle attestation link recorded in each closed ticket's §13.
4. **PR body updated at close** — this summary becomes the merge-commit narrative on `brain/2.7.x.x`.

**Campaign is NOT scoped to close every open ticket.** It's scoped to bring the deployable-and-priority items to attestation. Design-stage cycles + still-blocked-on-external-deploy items remain open and become the seed for the next campaign.

---

# § 5. References

- **Post-deploy baseline:** [`DEPLOY-2026-09-30.md`](DEPLOY-2026-09-30.md) — code-identity attestation record for the 8 gods + parent
- **Board snapshot:** [`IN-PROGRESS-SUMMARY.md`](IN-PROGRESS-SUMMARY.md) — all 27 tickets in `04_in_development/` grouped by cluster (this campaign's action-oriented complement)
- **Follow-ups index:** [`FOLLOW-UPS.md`](FOLLOW-UPS.md) — deferred / future-cycle work outside this campaign
- **Master kanban canon:** [`GOALS.md`](GOALS.md) — 12 attested + 12 candidates
- **Operating manual:** [`README.md`](README.md)
- **Shipped canon** (immutable, referenced in § 1):
  - [`06_shipped/brain_1.7.eos-1.md`](06_shipped/brain_1.7.eos-1.md) · recursive AI-visible loop
  - [`06_shipped/brain_1.7.eos-2.md`](06_shipped/brain_1.7.eos-2.md) · athena-717 reachability
  - [`06_shipped/brain_1.7.eos-3.md`](06_shipped/brain_1.7.eos-3.md) · void → every-surface manifestation
  - [`06_shipped/brain_1.7.eos-4.md`](06_shipped/brain_1.7.eos-4.md) · brain IS production
  - [`06_shipped/brain_1.7.eos-4.1.md`](06_shipped/brain_1.7.eos-4.1.md) · recursive self-attestation via EOS portal
- **This campaign's PR:** (to be created after this doc lands on cycle branch)
- **Steward directions this campaign inherits:**
  - 2026-09-28 — refined sealed-at-capture / decrypt-at-god-boundary axiom (three-way multi-agent attestation authorized)
  - 2026-09-29 — untested items must be caught in EOS attestation, especially security-scoped
  - 2026-09-29 — SF-via-sovereign-cosmos-logos is the current attested baseline; agent is next; then fan out
  - 2026-09-29 — Rulesets `GreekGodsOnly` with admin bypass removed; foundation `brain/2.7.x.x` now protected against direct admin pushes
