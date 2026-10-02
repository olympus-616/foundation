---
pitch: "Observability that runs on a solar-powered Pi"
---

# Argos v2 — the loyal watcher; observability god that runs a billion years on a solar-powered Pi OR in ECS at scale

> File: `brain_2.7.eos-3.md` — **third primary EOS cycle on the `brain/2.7.x.x` family** (after `brain_2.7.eos-1` HUD and `brain_2.7.eos-2` aeon). **Design stage.** Source: Steward + argos-agent design-ticket capture 2026-09-25 — *"Argos v2 — Design ticket intake."*
>
> This doc absorbs the design-ticket source-of-truth into EOS canon. §1–§5 populated from the source; §6–§13 scaffolded for the argos agent to iterate through design-stage review.

| | |
|---|---|
| **Branch family** | `brain/2.7.x.x` |
| **Cycle ordinal** | `eos-3` (third primary on 2.7 family; peer of HUD `eos-1` and aeon `eos-2`) |
| **Status** | `Design` — §1–§5 captured from Steward direction 2026-09-25; §6–§13 to be iterated by the argos agent; §5 checkboxes pending. |
| **Opened** | 2026-09-25 |
| **Closed** | — |
| **Prior cycle** | `brain_2.7.eos-2` (aeon — the loop kernel; argos observes what aeon does but never gates it) |
| **Theme** | Observability god for the fleet. **Storage by policy, not code.** Plutus is the god of transport. Loyal-friend UX: not just data, but *"what do I need to know and what can I do about it."* Design constraint: **identical Argos code on a Pi OR in ECS.** |
| **Feedback inputs** | Steward + argos-agent design-ticket 2026-09-25; uncommitted v2 prototype on `brain/2.7.x.x` (24 API files + 10 UI files + 4 modified UI files); Odyssey frame vision (Argos as identity-aware never-blinking loyal watcher). |
| **Estimated effort** | Multi-cycle. Slice 1 target = **storage-policy + shipper library + rule editor UX + hermes signal bridge**. Anomaly detection, cross-god trace propagation, multi-tenant, access control, billion-year archival format = later cycles. |
| **Actual effort** | — |

---

## Executive summary (≤300 words, aimed at the Steward)

Argos is the fleet's observability layer, prototyped end-to-end on `brain/2.7.x.x` as an uncommitted v2 (24 API files + 10 UI files). This cycle takes that prototype from *"runs locally, verified"* to *"attested in production with the operator-experience of a loyal friend."*

The v2 prototype already ships: a pipeline (enrich → redact → parse → index), a policy-driven storage layer with a local-JSONL adapter and a Plutus-adapter stub, a query engine + AQL grammar, a rules engine with defaults + toggling + observed firings, a signals store, and six UI surfaces (Watch, Search, Trace waterfall, Rules, Analytics, Config policy editor).

**Nine open items** cluster into three delivery tiers. **Foundation tier (gates everything downstream):** storage adapters beyond local JSONL (S3, Dropbox, Tailscale, IPFS via the Plutus contract) + retention/rollover + hot→warm→cold; the `@olympus-616/argos-shipper` library that every god replaces `console.log` with; the billion-year archival format decision (candidate: JSONL with SQLite index). **Trust tier (operator adoption):** rule-editor UX (currently list/toggle/delete only); signal → Hermes bridge so downstream notifiers can act; access control via cosmos-logos + Ares scoping. **Scale tier:** anomaly detection beyond static thresholds; cross-god `requestId` propagation middleware; multi-tenant view (dev / int / prod / offgrid customer units).

**Three irreversible decisions** deserve RFC-style write-ups because they outlive the rest of the code: the cold storage format, the AQL grammar surface, and the Argos↔Plutus contract shape.

**Cross-god routing.** Plutus needs new endpoints (storage adapter surface). Ares needs an argos-scope. Hermes needs a signals-ingest route. Poseidon eventually needs an argos MCP tool for LLM-driven forensics.

**Slice 1** ships the Foundation tier + rule-editor UX + hermes signal bridge. Everything else is a subsequent cycle.

---

## Why this doc exists

The argos-agent + Steward converged on a coherent vision in one session: **Argos runs a billion years on a solar Pi OR in ECS**, storage-by-policy-not-code, Plutus-as-transport, loyal-friend UX. That vision is captured in the design-ticket source. This EOS cycle absorbs it into governance canon so the argos agent iterates §6–§12 from the shape already agreed rather than rediscovering the vision from scratch.

**Position in the 2.7 family.** HUD (`eos-1`) proves cost is bounded. Aeon (`eos-2`) proves the loop is self-improving. Argos (`eos-3`) proves the fleet is *observed* — the watchful complement to the constructive loop. Together they make the fleet safe to run open-loop with real users.

---

## Discipline principle

> ***Argos observes. Argos never acts.*** *Signals may be routed to actors (via hermes → email / Slack / PagerDuty / Iris), but Argos itself is read-only against the pantheon. **The loyal-friend UX is not optional** — every surface answers "what do I need to know?" and "what can I do about it?", not just "here is data." **Nothing on disk depends on a vendor.** If someone opens the cold store in the year 3025 with a text editor, they must be able to read it.*

Consequences enforced across all sections:

1. **No cloud dependency required anywhere.** Every abstraction has a non-hyperscaler realization declared (local JSONL alongside S3; Tailscale share alongside Dropbox; Pi ext4 disk alongside ECS EFS).
2. **No vendor-locked file formats.** The cold archival format is a plaintext-inspectable schema; a Parquet or SQLite index is allowed as a *supplement*, never the *source*.
3. **Backward compatible with the v1 log format** already emitted by every god. The shipper library is a drop-in `console.log` replacement, not a rewrite.
4. **Every surface answers two questions.** *What do I need to know?* + *What can I do about it?* If a UI card shows data without both answers reachable within one click, the design has failed the loyal-friend covenant.

---

# § Steward-authored (top half)

## Canonical attestation statement (slice 1)

> *"I attest that Argos v2 observes every god in the fleet through the argos-shipper library (a drop-in `console.log` replacement); that its storage layer is defined by a policy — a JSON declaration the operator authors — that resolves to any transport Plutus supports (local JSONL, S3, Dropbox, Tailscale, IPFS, and future); that the same argos binary runs on a solar-powered Pi and in an ECS task with identical semantics; that the rules engine fires signals which route through Hermes to any operator-chosen notifier without Argos itself ever taking action against the pantheon; that the cold archival format is plaintext-inspectable and vendor-independent; and that every UI surface answers both 'what do I need to know?' and 'what can I do about it?' on every card."*

## §1 User story

- **§1.1** As **an operator of any olympus-grid node — a Steward, a dust dancer, a customer running an offgrid appliance** I want **Argos to see what I can't across every god in my fleet, tell me what I need to know, and hand me the scalpel already sharpened** so that **operating an AI pantheon does not require becoming a full-time observability engineer**.
- **§1.2** As **any god in the pantheon (athena, apollo, hermes, plutus, mnemosyne, poseidon, ares, hera, zeus, orion, iris, olympus-gpt, aeon, chronos, and every future god)** I want **to replace `console.log` with `argos-shipper` and have my logs flow into Argos with batching + retry + local spool** so that **observability is a library import, not a per-god integration**.
- **§1.3** As **an operator running offgrid on a solar-powered Pi** I want **Argos to run identically on my Pi as it does in someone else's ECS cluster** so that **my sovereignty is preserved by architecture, not by hoping the cloud provider stays online**.
- **§1.4** As **the operator authoring rules** I want **the rule editor UX to feel like conversation with the loyal-friend Argos** — including "add rule from this signal" on Watch cards — so that **codifying operational knowledge is one click from observing the pattern, not a separate ticketing motion**.
- **§1.5** As **any downstream actor (email, Slack, PagerDuty, Iris, a future custom notifier)** I want **signals to route through Hermes** so that **Argos observes, Hermes acts, and no coupling exists between the observer and the actor**.
- **§1.6** As **the archivist reading this store 50 years from now** I want **the cold format to be plaintext-inspectable and vendor-independent** so that **the observability history of the fleet outlives every vendor, every cloud, and every language runtime**.
- **§1.7** As **republic-616 (future)** I want **the irreversible design decisions to be published as RFCs before code lands** so that **when human governance lights up, the multi-party body can vote on the shape rather than being handed a fait accompli**.

## §2 Acceptance criteria (slice 1)

Each criterion is observable end-to-end; blast-radius, rollback, and collateral gods named per §2 to close the Steward's ask (c).

### §2.A Foundation tier — gates everything downstream

- **§2.1 (Storage adapters beyond local JSONL)** — **Motivation:** local JSONL alone works for a single Pi but not for cross-node fleets or offsite backup. **Given** an operator declares a storage policy `{ transport: 's3', bucket, prefix }` OR `{ transport: 'dropbox', path }` OR `{ transport: 'tailscale', share, path }` OR `{ transport: 'ipfs', gateway }` **when** Argos ingests a log record **then** the record is handed to Plutus via the Argos↔Plutus contract, and Plutus persists it at the declared transport with no other Argos-side code path involved. **Blast radius:** every log record; wrong adapter = data loss. **Rollback:** revert to `{ transport: 'local-jsonl', path: '.agent/logs' }` — no adapter change requires code redeploy. **Collateral gods:** plutus (owns adapters), zeus (SSM for adapter credentials).
- **§2.2 (Retention / rollover policy)** — **Motivation:** without rollover, JSONL grows unbounded and eventually eats disk. **Given** an operator declares `{ retention: '90d', rollover: 'daily' }` **when** the retention window elapses **then** stale records tier hot → warm → cold per policy, and cold storage is the archival substrate. **Blast radius:** loss of query performance if warm/cold tiers are misconfigured. **Rollback:** widen retention window; Argos re-indexes on next read. **Collateral gods:** plutus (tier implementations).
- **§2.3 (`@olympus-616/argos-shipper` library)** — **Motivation:** production traffic requires batching + retry + local disk spool so a god does not block on Argos being available. **Given** any god imports `argos-shipper` and replaces `console.log` **when** it emits logs **then** the shipper batches (100 records / 5s), retries on transient failure with exponential backoff, and spools to local disk when Argos is unreachable. **Blast radius:** memory + local-disk usage per god. **Rollback:** revert the god's shipper import to `console.log`. **Collateral gods:** every god in the pantheon (import + swap).

### §2.B Trust tier — operator adoption

- **§2.4 (Rule editor UX with "add rule from this signal")** — **Motivation:** rules-as-list is not enough; operators need to codify what they observe in one click. **Given** an operator viewing a Watch signal card **when** they click "add rule from this signal" **then** the rule editor pre-fills a rule matching the observed signal shape; they refine the natural-language description; they save; the rule engine fires it on next matching record. **Blast radius:** wrong rule = alert fatigue OR missed alert. **Rollback:** rules are soft-deletable; disabling a rule is one toggle. **Collateral gods:** none (argos-only).
- **§2.5 (Signal → Hermes bridge)** — **Motivation:** Argos observes but never acts. Notifications must route through Hermes. **Given** a rule fires and its declared action is `{ notify: 'email', to: 'ops@…' }` OR `{ notify: 'slack', channel }` OR `{ notify: 'pagerduty', policy }` **when** the signal is emitted **then** Argos POSTs to hermes' signals-ingest route with the payload; hermes fans out to the declared notifier. **Blast radius:** hermes availability = alert delivery. **Rollback:** disable the signal→hermes bridge; signals remain in the store, no external notification. **Collateral gods:** hermes (needs a signals-ingest route).

### §2.C Irreversible-decision RFC gate (§5.B captures these)

- **§2.6 (Cold storage format decision)** — **Motivation:** whatever this is, it will outlive the code by decades. **Candidate:** JSONL with a SQLite index; both are plaintext-inspectable and vendor-independent. **Blast radius:** wrong choice = decade-long migration debt. **Rollback:** none — this decision is irreversible in practice for existing data. **RFC required at §5.B.**
- **§2.7 (AQL grammar surface)** — **Motivation:** operators will build muscle memory around this grammar. **Blast radius:** grammar changes break every saved query and every downstream automation. **Rollback:** none — this decision is irreversible for existing operator knowledge. **RFC required at §5.B.**
- **§2.8 (Argos↔Plutus contract shape)** — **Motivation:** every future storage adapter depends on this contract; every future god depends on plutus honoring it. **Blast radius:** contract change breaks every adapter + every emitting god. **Rollback:** none — this decision is irreversible for adapters in production. **RFC required at §5.B.**

## §3 Non-functional requirements

- **§3.1 (Pi/ECS parity)** — Identical Argos binary must run on a solar-powered Pi + solid-state disk AND in an ECS task in Franktown, CO. No conditional code paths per environment; the same policy configuration produces the same behavior on both.
- **§3.2 (No cloud dependency required)** — Every abstraction has at least one non-hyperscaler realization declared. Local JSONL alongside S3; Tailscale alongside Dropbox; ext4 alongside EFS. Slice 1 must ship at least one Pi-runnable configuration end-to-end.
- **§3.3 (No vendor-locked file formats)** — Anything on disk must be openable with `less` in 2075. This forces JSONL / SQLite / Parquet / open-schema Avro as candidates; forbids proprietary Elastic snapshots, Splunk indexes, DataDog blobs, and their kin.
- **§3.4 (Argos observes; Argos never acts)** — No Argos code path may write to the fleet's operational surface. Signals may route to hermes (which acts); Argos itself is strictly read-only against the pantheon.
- **§3.5 (Backward compatible with v1 log format)** — Every god's current `console.log` output must continue to parse into records after shipper adoption. No breaking format change; only additions to the schema.
- **§3.6 (Loyal-friend UX is not optional)** — Every UI surface answers *"what do I need to know?"* AND *"what can I do about it?"* on every card. Design review rejects surfaces that only show data.
- **§3.7 (Storage-by-policy bounds cost)** — Local-JSONL is free; S3 costs storage + egress; Dropbox costs a subscription; Tailscale is peer-only. Every adapter declares its cost profile so operators can plan against a budget.
- **§3.8 (Cross-god trace correlation)** — Every log record carries `requestId` where the emitting god propagates it; where it does not yet propagate, Argos records that gap as observable telemetry to guide the follow-up middleware work.
- **§3.9 (Multi-tenant isolation — future)** — When multi-tenant lands (deferred from slice 1), same Argos instance surfaces many olympus-grids (dev / int / prod / offgrid customer units) with per-org silencing; no leak of one tenant's data to another.
- **§3.10 (Access control — future)** — When access control lands (deferred from slice 1), operators only see their own environments via cosmos-logos handshake + Ares scoping.

## §4 Feedback inputs

| FB# | Title | Body excerpt / evidence |
|-----|-------|-------------------------|
| — | Steward + argos-agent design-ticket 2026-09-25 | *"Argos v2 — Design ticket intake"* — nine open items + Odyssey framing + constraints |
| — | Steward Odyssey framing | *"a loyal watcher: Argos as the friend who sees what you can't, tells you what you need to know, and hands you the scalpel already sharpened"* |
| — | Pi/ECS parity constraint | *"this system must run a billion years on a solar-powered offgrid Pi or an ECS task in Franktown, CO — the same Argos code, either place"* |
| — | Storage-as-policy directive | *"Storage is therefore defined by POLICY, not code. Plutus is the god of transport; Argos hands its bytes to Plutus and asks nothing about where they land."* |
| — | v2 prototype (uncommitted on `brain/2.7.x.x`) | 24 API files + 10 UI files + 4 modified UI files; end-to-end verified locally |
| — | HUD umbrella `brain_2.7.eos-1.md` | Argos observability plane must respect HUD's L1–L14 bounded-cost surface; every signal record inherits the cost bounds |
| — | Aeon `brain_2.7.eos-2.md` | Argos observes what aeon does but never gates aeon's turn; the two docs together prove the fleet is observed AND self-improving |

## §5 Steward approval gate

- [ ] Discipline principle acknowledged (observer-not-actor; Pi/ECS parity; no vendor lock; loyal-friend UX)
- [ ] Canonical attestation statement (slice 1) locked
- [ ] Story locked (§1.1 – §1.7)
- [ ] Acceptance criteria locked (§2.1 – §2.8)
- [ ] NFRs locked (§3.1 – §3.10)
- [ ] **RFCs commissioned for the three irreversible decisions (§5.B)**
- [ ] **Cross-god routing acknowledged (§5.C)**
- [ ] Approved to enter `03_ready/` (design decomposition §6–§12 iterated + reviewed) — signed: **__________** **__________**
- [ ] Approved to enter `04_in_development/` (execution) — signed: **__________** **__________**

### §5.B RFC gate — three irreversible decisions to publish before code lands

Each of these decisions outlives the rest of the code by decades. Each gets an RFC-style write-up in `foundation/eos/rfcs/` (folder to be created by this cycle) before implementation lands:

- **RFC-A — Cold storage archival format.** Candidates: JSONL + SQLite index (recommended); JSONL alone; Parquet + JSONL fallback. Must be readable by `less` in 2075. **Load-bearing decision** — republic-616 candidate for future ratification.
- **RFC-B — AQL grammar surface.** Draft grammar frozen for the cycle; expansion path via extensions. Operators build muscle memory around this; changes are expensive.
- **RFC-C — Argos↔Plutus contract shape.** The interface `{ transport, put, get, list, retention, tier }` that every adapter satisfies. Contract change breaks every adapter + every emitting god.

### §5.C Cross-god routing table — what argos cannot land alone

| Sibling god | What argos needs | Ownership |
|---|---|---|
| **plutus** | New endpoints implementing the storage-adapter contract (§5.B-C); adapter implementations for S3 / Dropbox / Tailscale / IPFS; retention / tier machinery | Route to plutus agent for its own cycle sub-attestation |
| **ares** | An `argos-scope` — cosmos-logos-verified scope so operators only see their own environments (§3.10, deferred to a later cycle) | Route to ares agent when access-control cycle opens |
| **hermes** | A signals-ingest route accepting Argos signal payloads and fanning to declared notifiers (§2.5) | Route to hermes agent; can piggyback on the current hermes reconciliation cycle (`brain_2.7.eos-1.2.md`) or open its own |
| **poseidon** *(later cycle)* | An `argos` MCP tool for LLM-driven forensics — LLMs can query Argos over MCP to answer *"what's wrong right now?"* | Deferred |
| **every god in the pantheon** | Adoption of `@olympus-616/argos-shipper` (drop-in `console.log` replacement) | Route to each god's agent as a small per-repo cycle when shipper lib is published |

## §5.D Republic-616 open questions

- **Q-1** — Default retention window when the operator doesn't specify one? (slice-1 stub: 30 days)
- **Q-2** — Global vs. per-tenant AQL grammar — do dust dancers get to extend the grammar, or is it universal canon?
- **Q-3** — Cold storage format canon — republic-616 ratifies RFC-A?
- **Q-4** — Signal→Hermes notification quota — what caps prevent alert-flood billing surprises?
- **Q-5** — Multi-tenant isolation authority — who can query across tenants (Steward only? governance role?)?
- **Q-6** — Anomaly-detection sensitivity default — noise floor for surfacing behavioural drift.

---

# § Agent-authored (bottom half)

*Scaffolded from the design-ticket source. The argos agent iterates §6–§12 through design-stage review before this cycle enters `03_ready/`.*

## §6 Layer impact map

### §6.A Already-landed prototype (uncommitted on `brain/2.7.x.x`)

**API — 24 new files:**
- `api/src/storage/{types,policy,factory,index}.ts` + `adapters/{LocalJsonl,Plutus}.ts`
- `api/src/pipeline/{enrich,redact,parse,index}.ts`
- `api/src/search/{aql,engine}.ts` + `routes/search.ts`
- `api/src/rules/{types,store,defaults,engine}.ts`
- `api/src/signals/{types,store}.ts` + `routes/{signals,rules}.ts`
- `api/src/routes/{traces,stats,policy}.ts`

**UI — 10 new files + 4 modified:**
- `pages/Watch.tsx` (flagship signal feed) + Search + Trace-waterfall + Rules + Analytics + refactored Overview pulse-grid + Config policy editor
- `hooks/useSignalStream` + `types/{signals,rules,policy}`

**Verified end-to-end locally:** rules engine fires (error burst, new agent, new source IP); redaction scrubs email / JWT / card; trace stitches ares → hermes → athena; JSONL adapter persists to `.agent/logs/YYYY-MM-DD.jsonl`; prod build clean (318 KB / 96 KB gz).

### §6.B Layer impact per open item

| Slice-1 item | argos | plutus | hermes | zeus (SSM) | every god |
|---|---|---|---|---|---|
| §2.1 storage adapters | consumes contract | implements S3 / Dropbox / Tailscale / IPFS | — | credentials for S3 / Dropbox | — |
| §2.2 retention / rollover | policy authoring UI | tier machinery | — | — | — |
| §2.3 shipper library | publishes lib | — | — | — | imports lib, replaces `console.log` |
| §2.4 rule editor UX | UI only | — | — | — | — |
| §2.5 signal → hermes bridge | POST to hermes | — | signals-ingest route | — | — |

## §7 Schema deltas

### §7.1 Storage policy record (hestia-typed)
```
{
  transport: 'local-jsonl' | 's3' | 'dropbox' | 'tailscale' | 'ipfs' | <future>,
  <transport-specific>: { … },
  retention: <ISO duration>,
  rollover: 'hourly' | 'daily' | 'weekly',
  tiers: [{ tier: 'hot' | 'warm' | 'cold', transport, retention }]
}
```

### §7.2 Signal record (hestia-typed)
```
{
  signalId: UUID,
  ruleId: UUID | null,
  observedAt: timestamp,
  god: string,          // emitter identity
  requestId: string,     // for cross-god correlation
  payload: object,
  routes: [{ notifier, target }]
}
```

### §7.3 Rule record (hestia-typed)
```
{
  ruleId: UUID,
  operatorIdentity: string,
  naturalLanguage: string,
  match: <AQL expression>,
  action: { notify: string, target: string } | null,
  interpretations: [<athena parse>],
  revision: int
}
```

### §7.4 Cold archival format (RFC-A pending)
Candidate: JSONL + SQLite index. Plaintext-inspectable; SQLite index rebuilt from JSONL on cold-tier read.

## §8 Service contracts

### §8.1 Argos↔Plutus storage contract (RFC-C pending)
```
plutus.storage.put(policy, record)     → { recordRef, tier }
plutus.storage.get(policy, recordRef)  → record
plutus.storage.list(policy, query)     → { records[], nextCursor }
plutus.storage.tier(policy, recordRef) → { currentTier, transitions[] }
```

### §8.2 Argos control plane
```
GET  /v1/argos/watch          → live signal stream (SSE)
POST /v1/argos/search  { aql } → results[]
POST /v1/argos/rules          → CRUD rules
GET  /v1/argos/trace/:requestId → cross-god trace waterfall
GET  /v1/argos/stats          → dashboards
GET  /v1/argos/policy         → current storage policy
PUT  /v1/argos/policy         → replace storage policy
```

### §8.3 Argos-shipper library API
```
argos.info(msg, ctx)   argos.warn(...)   argos.error(...)   argos.debug(...)
argos.time(label)      argos.timeEnd(label)
argos.trace(requestId, span, msg, ctx)
```
Drop-in replacement for `console.*`. Auto-tags with god identity from local `cosmos-logos.json`.

### §8.4 Hermes signals-ingest route (owned by hermes agent, contracted here)
```
POST /v1/hermes/signals { signal, routes[] } → { deliveries[] }
```

## §9 Telemetry assertions (slice 1 close-out gate)

Argos observes; slice-1 verifies **Argos's OWN observability** (Argos ate its own dog food):

- **§9.ARGOS-1** — Every log record ingested via argos-shipper is retrievable via `/v1/argos/search` within the retention SLO for the record's tier.
- **§9.ARGOS-2** — Every storage-adapter (local-jsonl, s3, dropbox, tailscale, ipfs) round-trips a canonical test record put→get→list.
- **§9.ARGOS-3** — Retention policy `{ retention: '1h', rollover: 'hourly' }` observed to tier records after 1 hour.
- **§9.ARGOS-4** — Rule editor "add rule from this signal" produces a rule that fires on the next matching record.
- **§9.ARGOS-5** — Signal → hermes bridge: firing a rule with `action: { notify: 'email' }` produces a hermes delivery record within notify-SLO.
- **§9.ARGOS-6** — Redaction pipeline strips email + JWT + card patterns from ingested payloads before persistence. Grep of cold storage for a known-planted test PII string returns zero hits.
- **§9.ARGOS-7** — Loyal-friend UX audit: every UI card in Watch / Search / Trace / Rules / Analytics passes the two-question test (*what do I need to know* + *what can I do about it* both reachable within one click).
- **§9.ARGOS-8** — Pi/ECS parity: same argos binary boots on both a Raspberry Pi + solid-state disk AND an ECS task, ingests the same canonical test record, produces identical query results.
- **§9.ARGOS-9** — Cold storage format check: a JSONL file from Argos opens in `less` and every field is human-legible (RFC-A ratification test).

## §10 Execution plan (slice 1)

### §10.1 RFC-first (irreversible decisions)

1. **RFC-A** — cold storage archival format — draft + review + ratify. Blocks §10.2.
2. **RFC-B** — AQL grammar surface — draft + review + ratify. Blocks §10.2.
3. **RFC-C** — Argos↔Plutus contract shape — draft + review + ratify. Blocks §10.2.

### §10.2 Foundation tier (parallelizable after RFCs)

4. **Plutus storage adapters** — implements the RFC-C contract with adapters for S3 / Dropbox / Tailscale / IPFS. Ships in the plutus repo; cross-god coordination. (Owner: plutus agent + subcycle.)
5. **Retention / rollover / tiering** — hot → warm → cold machinery in plutus. (Owner: plutus agent.)
6. **`@olympus-616/argos-shipper` library** — publish to internal registry; drop-in `console.*` replacement with batching + retry + local-disk spool.
7. **Argos code commit** — the 24 API + 10 UI files currently uncommitted on `brain/2.7.x.x` land as one squash commit. Reviewer approval on RFCs must precede.

### §10.3 Trust tier (after Foundation)

8. **Rule editor UX** — replace list/toggle/delete-only with "add rule from this signal" on Watch cards + NL-authoring + interpretation preview.
9. **Signal → hermes bridge** — Argos POSTs to hermes' signals-ingest route; hermes fans out. Requires hermes agent to ship the ingest route.

### §10.4 Every-god shipper adoption (rolling)

10. Each god's agent opens a small per-repo cycle to replace `console.*` with `argos-shipper`. Not blocking Argos v2 close; but Argos v2 does not close on the fleet-wide observability claim until adoption is >50%.

### §10.5 End-to-end attestation

11. Deploy argos to int (ECS) + a physical Pi. Run §9.ARGOS-1 through §9.ARGOS-9 against both. Cross-check §9.ARGOS-8 parity.
12. **§13 closeout.** Cycle `git mv 04_in_development → 05_verifying/`; Kronos-analog harness runs the §9 matrix; `git mv → 06_shipped/`. Steward signs.

### §10.6 Deferred to future cycles

- **Anomaly detection beyond static thresholds** — moving-average baselines, sudden-silence detection, per-god behavioural drift. Its own cycle.
- **Cross-god `requestId` propagation middleware** — small PR per god in the pantheon. Its own cycle bundle.
- **Multi-tenant view** — same Argos instance surfacing many olympus-grids (dev / int / prod / offgrid). Its own cycle; blocked on access-control cycle.
- **Access control** — cosmos-logos handshake + Ares scoping so operators only see their own environments. Its own cycle; ares agent owns.
- **Poseidon `argos` MCP tool** — LLM-driven forensics via MCP. Its own cycle.

## §11 Verification protocol

### §11.1 Without iPhone (this cycle's scope)
- Deploy argos to ECS int cluster.
- Deploy argos to a physical Raspberry Pi (Steward-authorized hardware).
- Run scripted §9.ARGOS-1 through §9.ARGOS-9 against both environments.
- Loyal-friend UX audit: manual walk of every card in every surface with the two-question test.

### §11.2 Pi/ECS parity harness
Scripted: same canonical test record ingested via argos-shipper on both environments; same AQL query executed against both; result diff must be empty.

## §12 Rollback plan

- **Storage policy revert.** Changing `policy.transport` from any adapter back to `local-jsonl` requires no code deploy — the operator edits policy, argos re-reads. Data prior to the switch stays where it was.
- **Argos-shipper library revert.** Each god's agent reverts its `argos-shipper` import back to `console.*`. Local logs continue as before; argos loses that god's stream.
- **Argos code revert.** Squash-merge is single-commit revert.
- **RFC-locked decisions** are non-revertable for data already committed under them. Migration is a forward cycle, not a rollback.

## §13 Closeout

*Filled at end of slice 1.*

### What shipped
- Argos v2 API + UI (24 + 10 files) on `brain/2.7.x.x` under governance.
- RFC-A, RFC-B, RFC-C published.
- Storage adapters: local-jsonl + at least one non-hyperscaler (Tailscale) + at least one hyperscaler (S3).
- `@olympus-616/argos-shipper` published.
- Rule editor UX + signal→hermes bridge.
- Pi/ECS parity attested.

### What deferred (and why)
- Anomaly detection, cross-god requestId, multi-tenant, access control, argos MCP tool → each its own future cycle.

### What surprised
- …

### Verification evidence
- §9.ARGOS-1 through §9.ARGOS-9 artifacts (per assertion).
- RFC-A / RFC-B / RFC-C published documents.
- Pi + ECS parity harness output.
- Loyal-friend UX audit checklist per surface.

### Feedback that emerged from THIS cycle (seed for the next one)
- Every god needs argos-shipper adoption; scheduled per-repo.
- Republic-616 candidate: RFC-A ratification, retention defaults, notification quotas.
- Poseidon `argos` MCP tool — natural next cycle.

### Memory updates
- New memory: argos as loyal watcher; storage-by-policy; Pi/ECS parity; observer-not-actor.

### Cycle close commit
- Slice-1 argos merge SHA on `brain/2.7.x.x` + plutus counterparties SHA + parent submodule bump SHA + CDK deploy log.
- Steward sign-off: **__________** **__________**

---

## References

- **Source design ticket:** Steward + argos-agent 2026-09-25 — *"Argos v2 — Design ticket intake"*
- **HUD umbrella:** [`brain_2.7.eos-1.md`](../04_in_development/brain_2.7.eos-1.md) — Argos observability plane inherits HUD's bounded cost surface
- **Aeon cycle:** [`brain_2.7.eos-2.md`](brain_2.7.eos-2.md) — the loop kernel Argos observes but never gates
- **BYOK cycle (envelope pattern reference):** [`brain_1.7.eos-5.5.md`](../04_in_development/brain_1.7.eos-5.5.md)
- **EOS operating manual:** [`../README.md`](../README.md)
- **Patent disclosure (methodology):** [`../../PATENT-DISCLOSURE-DRAFT.md`](../../PATENT-DISCLOSURE-DRAFT.md)
- **Republic-616 forward pattern:** README §275+
- **Repo facts:** argos API + UI ports TBD (source doc doesn't specify — argos agent to fill in §6.A of decomposition iteration).
