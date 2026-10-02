---
pitch: "The AI's recursive self-improvement loop kernel"
---

# Aeon — the loop kernel that binds the fleet into an infinitely-recursive self-improvement cycle

> File: `brain_2.7.eos-2.md` — **second primary EOS cycle on the `brain/2.7.x.x` family** (first was HUD hostile-universe defense, `brain_2.7.eos-1`). **Design stage.** Source material: Steward + aeon-agent design-stage capture 2026-09-25 — *"Aeon — Design Stage Prompt for the EOS Agent."*
>
> This doc absorbs that source-of-truth prompt into EOS canon. The Steward-authored top half (§1–§5) is populated from the source; the agent-authored bottom half (§6–§13) is scaffolded for the aeon-agent to iterate through the design-stage conversation. The 02_design column is created by this cycle — this is the first design-stage doc under the README's canonical kanban shape (single-Steward mode has previously used direct-to-`04_in_development/` for reconciliation cycles; aeon is a greenfield design so it enters at the correct stage).

| | |
|---|---|
| **Branch family** | `brain/2.7.x.x` |
| **Cycle ordinal** | `eos-2` (second primary on the 2.7 family after `brain_2.7.eos-1` HUD) |
| **Status** | `Design` — §1–§5 captured from Steward direction 2026-09-25; §6–§13 to be decomposed by the aeon agent through iterative design-stage review; §5 checkboxes pending Steward signature |
| **Opened** | 2026-09-25 |
| **Closed** | — |
| **Prior cycle** | `brain_2.7.eos-1` (HUD provides the L1–L14 bounded-cost cascade aeon must respect; aeon's recursion + quote-then-execute both operate WITHIN that bounded-cost surface) |
| **Theme** | Aeon = the loop kernel. Task queue = the fleet's programming language. Recursive self-improvement across the ten-god topology (proteus, hestia, orion, athena, poseidon, plutus, mnemosyne, hermes, zeus, hera) with republic-616 as the future human-governance layer. Slice 1 target = recursion primitive end-to-end. |
| **Feedback inputs** | Steward + aeon-agent design-stage prompt 2026-09-25; proteus-not-yet-wired unblock premise; Steward vision framing *"the last programming interface in all of reality if done correctly"* |
| **Estimated effort** | Multi-cycle. This cycle's target = **slice 1** (recursion primitive end-to-end). Subsequent slices deferred to their own cycles as scope hardens through design iteration. |
| **Actual effort** | — |

---

## Why this doc exists

Aeon has been dormant because proteus wasn't wired. That is now the unblock. This cycle **designs aeon** and **ships slice 1** — a single end-to-end recursion turn where aeon wakes, reads its own manifest, pulls the next task from a proteus queue, gets a plutus quote, dispatches to athena, receives the next-task envelope back, writes it into proteus, and leaves receipts across mnemosyne + hermes with the whole trace visible in the aeon UI.

The design-stage prompt from the Steward + aeon agent settled the architectural intent. This EOS doc absorbs that intent into governance canon so the design stage has a coherent starting point — the aeon agent iterates §6–§13 from the shape already agreed, rather than rediscovering the vision from scratch.

**Why aeon comes second in the 2.7 family and not third or later.** After HUD proves the platform's cost surface is bounded by construction (a defensive claim), aeon proves the platform can *program itself* within that bounded surface (a constructive claim). The two are complements — HUD says *"the loop cannot become infinite cost"*, aeon says *"the loop can become infinite improvement."* Both must land before the fleet is safe to run open-loop.

---

## Discipline principle (governs the whole cycle)

> *Aeon is the last programming interface in all of reality if done correctly. Design for centuries, not sprints. The system is intended to outlast its author and the current tech landscape. Everything the operator can express in human language — including the safety rules that bound the eternal loop — is preferred over hardcoded thresholds. **Power stays with the operator, forever.***

Two consequences enforced across all sections:

1. **No hardcoded thresholds anywhere** that the operator could have declared in NL instead. Recursion depth caps, sabbath cycles, budget caps per lineage, human-in-the-loop thresholds — all operator-authored in the aeon loop instructions parameter, interpreted by athena + hera each turn. Hardcoded values only where they're *not policy* (crypto envelope max age, TLS versions, etc.).
2. **Every abstraction pluggable at its boundary.** Plutus backing (Salesforce ledger → real chain → scratch counter for dev) swaps behind an interface; proteus per-agent backend (git / salesforce / dynamo / …) swaps behind an interface; MCP tools swap behind cosmos-logos. **No decision in this cycle may lock the fleet into a specific vendor.**

---

# § Steward-authored (top half)

## Canonical attestation statement (for slice 1)

> *"I attest that aeon wakes on schedule on the `brain/2.7.x.x` deployment; that it reads its own cosmos-logos manifest and is hera-verified before act; that it pulls the next task from a proteus-backed queue, receives a plutus-signed quote, dispatches to athena over the real fleet chain, receives the next-task envelope back, and writes it into the proteus queue closing the recursion loop; that every hop leaves a receipt in mnemosyne + hermes; that the recursion depth counter is tracked per task record and enforced against the operator's natural-language depth limit; that the aeon UI at `v1/aeon` renders the full trace with lineage and a kill switch; and that no hardcoded threshold governs a rule the operator could have authored in the loop-instructions parameter."*

## §1 User story

- **§1.1** As **any operator of an olympus-grid node** I want **to speak to my fleet of AI gods in natural language and have that language become the task queue that drives them** so that **the programming interface of my fleet is my own speech, not a bespoke API surface**.
- **§1.2** As **the Steward and any future dust dancer** I want **the eternal self-improvement loop to be bounded by rules I declared in natural language — sabbath, budget-per-lineage, recursion-depth, human-in-loop thresholds — interpreted by athena + hera each turn** so that **the operator retains authority over the loop, forever, without editing code**.
- **§1.3** As **athena** I want **task records to arrive as either steward-authored natural language OR system-generated structured schemas** so that **maximum flexibility (NL) and machine-executability (structured) both exist on the same queue**, and I can **compile promoted NL patterns into hestia intent schemas over time**.
- **§1.4** As **any client speaking the language of olympus** I want **`v1/aeon` to be the control plane** so that **submitting, observing, and killing tasks is one API surface regardless of node, cluster, or operator**.
- **§1.5** As **plutus, the ledger of record** I want **aeon to quote-then-execute every task** — signed quote → hold → settle-or-refund — so that **olympus-coin accounting is non-repudiable and the backing (SF ledger today, real chain tomorrow) is pluggable behind the interface aeon depends on**.
- **§1.6** As **republic-616 (future)** I want **the open questions that this cycle deliberately does NOT decide** to be surfaced explicitly so that **when human governance lights up, the multi-party body has a debate queue authored by the design stage rather than a fait accompli**.

## §2 Acceptance criteria (slice 1)

Each criterion is observable end-to-end and maps to one hop of the canonical wake-up turn or one operator-safety obligation.

### §2.A Canonical wake-up turn (aeon's 9 steps, slice 1 shape)

- **§2.1 (Wake on schedule)** — **Given** aeon is deployed as an orion async worker **when** the schedule fires (or a `v1/aeon/wake` call is issued) **then** aeon boots, logs its own manifest identity, and emits `aeon.wake` telemetry with `nodeId`, `taskId=null`, `depth=0`, `manifestPubKey`.
- **§2.2 (Read own manifest, hera-verified)** — **Given** aeon has a cosmos-logos manifest at `/.well-known/cosmos-logos.json` and a rules pointer in `identity.rules[]` **when** aeon requests hera verification of its instructions **then** hera returns a signed integrity token; aeon proceeds only on a valid token, emits `aeon.hera.verified`.
- **§2.3 (Rebuild stateless context)** — **Given** the target-agent identifier is resolved from the incoming task envelope **when** aeon composes its context **then** it loads the cosmos-logos context for the target agent (namespace + rules-pointer + capabilities) and constructs an athena-ready system prompt bounded by that context. Observable: `aeon.context.built` with `targetAgent`, `contextBytes`, `sourceManifests[]`.
- **§2.4 (Follow own rules)** — **Given** aeon's rules pointer resolves via proteus to the operator-authored NL instructions **when** aeon composes the athena prompt **then** the rules block is prepended verbatim so athena + hera can enforce every operator gate (sabbath, budget-per-lineage, depth caps, human-in-loop). Observable: `aeon.rules.loaded` with `rulesSha256`, `rulesSourceBackend`.
- **§2.5 (Query proteus for needed data)** — **Given** the athena reasoning may require task-local data **when** aeon or athena issues a proteus fetch **then** proteus resolves via the target-agent's declared backend (git / salesforce / dynamo / …) and returns typed data. Observable: `proteus.fetch` with `agent`, `backend`, `path`, `ms`, `bytes`.
- **§2.6 (Plutus quote-hold-settle)** — **Given** aeon has a task envelope with a budget cap **when** aeon calls `plutus.quoteTask(envelope)` **then** it receives `{ quoteId, amount, ttl, ed25519Sig }`; when it calls `plutus.hold(quoteId, caller)` it receives `{ holdRef }`; and when the task finishes it calls either `plutus.settle(quoteId, actual)` or `plutus.refund(quoteId, reason)` and receives a `LedgerEntry` reference. Observable per hop: `plutus.quote`, `plutus.hold`, `plutus.settle | plutus.refund`.
- **§2.7 (Athena roundtrip)** — **Given** the athena-ready prompt built at §2.3 **when** aeon calls athena on port 3401 with the target-agent's cosmos-logos context **then** athena reasons within that context, may take poseidon tool turns (each MCP call cosmos-logos-envelope-verified), and returns a next-task envelope. Observable: `aeon.athena.request` / `aeon.athena.response` bracketed; each poseidon MCP call inside emits `poseidon.mcp.tool` with cosmos-logos verification signature.
- **§2.8 (Enqueue returned task — recursion closes)** — **Given** athena returned a valid next-task envelope **when** aeon validates depth < operator's declared cap **then** aeon writes the task back into the proteus queue with `parentTaskId`, `depth = current + 1`, `lineageCostSoFar` propagated. Observable: `proteus.enqueue` with the new task's fields.
- **§2.9 (Receipts + memory + notification)** — **Given** the turn completes (settled or refunded) **when** the final ledger hop lands **then** plutus writes the LedgerEntry, mnemosyne stores the memory record with the full trace, and hermes emits a notification per the operator's rules. Observable: `plutus.ledgered`, `mnemosyne.stored`, `hermes.notified`.

### §2.B Operator-authored NL safety enforcement (all four eternal-loop gates)

- **§2.10 (Sabbath gate)** — **Given** the operator's NL rules include a sabbath declaration (e.g., *"Rest on the sabbath"*) **when** the turn fires within the sabbath window **then** aeon refuses the wake with `aeon.blocked.sabbath` and the rule text quoted in the reason. Athena interprets the NL, hera enforces.
- **§2.11 (Recursion depth gate)** — **Given** the operator's NL rules include a depth cap (e.g., *"Cap recursion at 8 unless the wallet has more than 100 coin"*) **when** a subtask would exceed the effective cap given current wallet state **then** aeon refuses the enqueue with `aeon.blocked.depth` and the rule text quoted. Depth counter present on every task record from commit 1.
- **§2.12 (Budget-per-lineage gate)** — **Given** the operator's NL rules include a lineage budget cap (e.g., *"Never spawn a subtask that would cause a total lineage cost above 500 coin"*) **when** a subtask's quote would push lineage cumulative cost past the cap **then** aeon refuses with `aeon.blocked.lineage_budget` and the current lineage total + cap named in the reason.
- **§2.13 (Human-in-loop threshold gate)** — **Given** the operator's NL rules include a page-me threshold (e.g., *"Page me if any single task wants to spend more than 50 coin"*) **when** a task's quote exceeds the named threshold **then** aeon pauses the task, emits `aeon.paused.human_review` with the quote, and hermes pages the operator per the declared channel. Task resumes on operator ack.

### §2.C UI attestation (four surfaces seeded in slice 1)

- **§2.14 (Live queue browser)** — Per-node aeon UI shows current queue with filters. Every filter change is observable.
- **§2.15 (NL task authoring with plutus quote preview)** — Operator can author a task in NL; UI shows a real-time plutus quote before submit. Quote-preview requests use the same signed plutus interface as production.
- **§2.16 (Execution timeline / lineage)** — For any taskId, UI renders the aeon → athena → poseidon → plutus/mnemosyne/hermes trace with parent/child links, depth counter, cost accumulation.
- **§2.17 (Recursion / self-improvement dashboard with kill switch)** — Global view of active recursion trees; per-tree kill switch that emits `aeon.tree.killed` and refunds all in-flight quotes.

## §3 Non-functional requirements

### §3.A Design constraints (Steward-declared, load-bearing)

- **§3.1 (Align)** — Aeon must align to existing olympus-616 + olympus-grid patterns: cosmos-logos envelope everywhere, ares → hermes → athena request chain, proteus for persistence, plutus for ledger, mnemosyne for memory. No parallel-universe abstractions.
- **§3.2 (Replaceable)** — Every dependency behind an interface. Plutus backing (SF ledger → real chain → dev scratch) swaps without touching aeon. Proteus per-agent backend swaps without touching aeon. MCP tools swap without touching aeon. Athena's LLM provider swaps without touching aeon.
- **§3.3 (No big-tech vendor lock-in)** — Nothing that only runs on Stripe / AWS-specific services / OpenAI. Every abstraction has at least one non-hyperscaler realization declared (SF-ledger for plutus today, real chain tomorrow; git-backed proteus alongside SF-backed proteus; ollama-capable athena alongside OpenAI/Anthropic).

### §3.B Operational bounds

- **§3.4 (Cost surface bounded by HUD umbrella)** — Aeon inherits `brain_2.7.eos-1.md`'s L1–L14 cascade for the request-processing surface + downstream provider daily-spend ceilings. Nothing aeon does may create a cost pathway that bypasses HUD's bounds.
- **§3.5 (Quote-then-execute with signed non-repudiation)** — Every plutus interaction on the aeon interface is ed25519-signed by plutus's cosmos-logos private key. Aeon never trusts an unsigned quote.
- **§3.6 (Recursion depth tracked from commit 1)** — Safety at scale isn't retrofittable. Every task record from the first commit carries `depth`, `parentTaskId`, `lineageCostSoFar`, `envelopeSig`.
- **§3.7 (Latency budget — target for slice 1)** — Aeon overhead per turn (excluding athena reasoning + tool time) < 500ms p95. Athena reasoning + poseidon tool time budgets inherit from those services' own NFRs. Design for centuries; latency budget is tuning, not architecture.
- **§3.8 (Envelope + signature discipline)** — Every task record's envelope carries `identity`, `signatures[]`, `timestamps`. Every plutus quote is ed25519-signed. Every MCP call is cosmos-logos-envelope-verified.

### §3.C Governance readiness

- **§3.9 (Republic-616 handoff surface)** — Every operator-declared NL rule interpreted by athena + hera is recorded in mnemosyne with the interpretation trace, so republic-616 (when it lights up) can review a corpus of "how the fleet actually interpreted operator language over time" and vote on canonical resolutions.

## §4 Feedback inputs

| FB# | Title | Body excerpt / evidence |
|-----|-------|-------------------------|
| — | Steward + aeon-agent design-stage prompt 2026-09-25 | Full architectural intent capture; the source-of-truth this doc absorbs |
| — | Steward vision framing | *"the last programming interface in all of reality if done correctly. Design for centuries, not sprints."* |
| — | Proteus-not-yet-wired unblock premise | Aeon has been dormant because proteus wasn't wired; this cycle designs proteus's per-agent-backend resolution alongside aeon's proteus consumption |
| — | HUD umbrella `brain_2.7.eos-1.md` | Cost-surface bounds aeon must respect; L1–L14 cascade + provider daily-spend ceilings |
| — | Republic-616 forward-looking pattern | `foundation/eos/cycle/README.md` §275+ — the future multi-party governance body that will vote on unresolved open questions |

## §5 Steward approval gate

- [ ] Discipline principle acknowledged (design-for-centuries; power-stays-with-operator; no-hardcoded-thresholds-where-NL-would-do)
- [ ] Canonical attestation statement (slice 1) locked
- [ ] Story locked (§1.1 – §1.6)
- [ ] Acceptance criteria locked (§2.1 – §2.17)
- [ ] NFRs locked (§3.1 – §3.9)
- [ ] **Republic-616 open-question queue acknowledged** (see below) — these are questions this cycle deliberately does NOT decide; they are surfaced for future human governance. Steward tick means "yes, these are the right questions to leave open."
- [ ] Approved to enter `03_ready/` (design decomposition §6–§12 complete + reviewed) — signed: **__________** **__________**
- [ ] Approved to enter `04_in_development/` (execution) — signed: **__________** **__________**

### §5.A Open questions for republic-616 to govern later

Surfaced for human debate before they get pinned in code. Slice 1 uses stub defaults but does **not** encode them as the answer.

- **Q-1** — What's the default maximum recursion depth when the operator doesn't specify one? (Slice 1 stub: `8`; not a canonical answer.)
- **Q-2** — Global sabbath honored across all nodes, or per-node? Whose calendar?
- **Q-3** — Olympus-coin exchange semantics when the backing switches from Salesforce ledger to a real chain — floating rate, pegged, snapshot-at-mint?
- **Q-4** — In-flight quote semantics on cluster crash — auto-refund on lease expiry, or held until human resolves?
- **Q-5** — Cross-namespace tasks (task in namespace A targets an agent in namespace B) — allowed, gated, or forbidden?
- **Q-6** — Who has authority to write to another operator's aeon queue?

Every answer that republic-616 eventually pins becomes a `brain_{family}.eos-{N}.md` sub-cycle attestation. Design not to preempt.

---

# § Agent-authored (bottom half)

*The material below is scaffolded from the Steward+aeon-agent design-stage prompt. It is starting-point for the aeon agent to iterate through design-stage review; expect §6–§12 to evolve before this cycle enters `03_ready/`.*

## §6 Layer impact map — ten-god topology + aeon UI + republic-616 (future)

Every god participates in aeon's canonical turn. Load-bearing role per god must be interface-clean so the underlying implementation stays pluggable.

| God | Role in aeon's turn | Interface aeon depends on | Slice-1 realization |
|---|---|---|---|
| **zeus** | Provisions aeon queues per node; provisions the manifest identity | `zeus.provisionAeonNode(nodeSpec)` + SSM key injection | Real (uses existing zeus CDK) |
| **hera** | Verifies aeon's instructions before act (integrity gate) | `hera.verifyInstructions(manifest, rules) → { integrityToken }` | **Stub** (returns valid token; hera build is a downstream cycle) |
| **proteus** | Persistent data; resolves per-agent to git / SF / dynamo / etc. | `proteus.get(agent, path)` / `proteus.put(agent, path, value)` / `proteus.enqueue(agent, task)` | **Stub queue** + one real backend (SF) as reference impl |
| **hestia** | Schema by type (task shape, rule shape, ledger shape) | Type registry lookup | Real hestia schemas for task + rule types |
| **orion** | Async execution runtime on the worker cluster | `orion.schedule(job)` / `orion.wake(nodeId, jobId)` | Real (uses existing orion) |
| **athena** | Reasoning; wakes with target-agent's cosmos-logos context | `POST :3401/v1/athena/chat` with target-agent context + rules block | Real (uses existing athena on port 3401) |
| **poseidon** | MCP tool provider, cosmos-logos-envelope-verified | Standard MCP `/mcp/*` with cosmos-logos handshake | Real (uses existing poseidon) |
| **plutus** | Ledger of record + olympus-coin settlement | `quoteTask` / `hold` / `settle` / `refund` | **Stub signer** + SF-backed ledger row-write (backing is pluggable) |
| **mnemosyne** | Memory / history | `mnemosyne.store(trace)` | Real |
| **hermes** | Messaging | `hermes.notify(operator, channel, payload)` | Real |
| **olympus-gpt** | Exposes control plane at `/v1/aeon` on the fleet | Standard olympus-gpt route registration | Real API + UI seeded (four surfaces §2.14–§2.17) |
| **republic-616** | Human governance layer for rule-change debates | *(not yet wired — Q-6 forward)* | Deferred |

## §7 Schema deltas

### §7.1 Task record schema (hestia-typed)

Every task record carries:

| Field | Type | Purpose |
|---|---|---|
| `taskId` | UUID | Stable identifier; primary key across proteus/mnemosyne/plutus |
| `envelope` | object | `identity` (source agent DID), `signatures[]` (ed25519 chain), `timestamps` (created / quoted / dispatched / settled) |
| `instructionType` | enum | `natural_language` or `structured` |
| `instruction` | string \| object | NL blob OR hestia-typed struct against a registered intent schema |
| `targetAgent` | string | Namespace + agent codename (e.g., `guardians__athena-717`) |
| `budgetCap` | int | Max olympus-coin willing to spend on this task |
| `parentTaskId` | UUID \| null | For lineage; null for root |
| `depth` | int | Recursion depth; incremented on enqueue |
| `lineageCostSoFar` | int | Cumulative olympus-coin spent by this lineage |
| `operatorRulesRef` | string | Pointer to the operator's NL rules (resolved via proteus) |
| `plutusQuoteId` | UUID \| null | Filled after `quoteTask` |
| `plutusHoldRef` | UUID \| null | Filled after `hold` |
| `plutusLedgerRef` | UUID \| null | Filled after `settle` / `refund` |
| `status` | enum | `queued | quoted | held | dispatched | reasoning | tool_calling | ledgered | settled | refunded | blocked_sabbath | blocked_depth | blocked_lineage_budget | paused_human_review | killed` |

### §7.2 Rule record schema (hestia-typed)

Rules are operator NL. Stored as one record per operator; interpreted per-turn by athena+hera.

| Field | Type | Purpose |
|---|---|---|
| `ruleId` | UUID | Stable identifier |
| `operatorIdentity` | string | Owning identity DID |
| `naturalLanguage` | string | The operator's raw NL rules (source of truth) |
| `interpretations[]` | array | History of athena's parsed interpretations for observability + republic-616 corpus |
| `revision` | int | Monotonic; rule edits emit a new revision, prior revisions immutable |
| `envelope` | object | Signed by operator identity |

### §7.3 Cosmos-logos manifest additions (aeon-specific)

- `identity.rules[]` — pointer(s) to operator-authored NL rules; resolved via proteus.
- `capabilities` — declares `aeon.wake`, `aeon.enqueue`, `aeon.trace`, `aeon.kill`.
- `envelope.enabled: true` (standard cosmos-logos).

### §7.4 Plutus ledger discipline (aeon-scoped rows)

- Every aeon-initiated task emits at least one `LedgerEntry` row with `Cycle__c` FK pointing at the aeon parent turn.
- Backing store for LedgerEntry rows is pluggable (SF today; real chain when it exists). Aeon depends only on the interface.

## §8 Service contracts

### §8.1 Plutus interface (aeon depends on)

```
POST /v1/plutus/quoteTask         { envelope } → { quoteId, amount, ttl, ed25519Sig }
POST /v1/plutus/hold              { quoteId, caller } → { holdRef }
POST /v1/plutus/settle            { quoteId, actualAmount } → { ledgerRef }
POST /v1/plutus/refund            { quoteId, reason } → { ledgerRef }
```

All responses carry the plutus cosmos-logos ed25519 signature.

### §8.2 Aeon control plane (olympus-gpt exposes at `/v1/aeon`)

```
POST /v1/aeon/wake                          → triggers a wake (dev/test)
POST /v1/aeon/enqueue     { task envelope } → { taskId, quotePreview }
GET  /v1/aeon/queue?nodeId&filters          → live queue
GET  /v1/aeon/trace/:taskId                 → lineage + trace
POST /v1/aeon/kill/:taskId                  → kills the tree; refunds all in-flight quotes
GET  /v1/aeon/rules                         → operator NL rules (read)
PUT  /v1/aeon/rules       { naturalLanguage } → replace operator rules; emits new revision
```

Every request carries the caller's cosmos-logos envelope; every response is signed by aeon's private key.

### §8.3 Canonical wake-up turn (aeon internal)

The 9-step sequence in §2.A is the canonical turn shape. Each step is a discrete function on aeon's side; each emits telemetry per §9 below. The full internal orchestration lives in `aeon/api/src/turn/*`.

## §9 Telemetry assertions (slice 1 close-out gate)

Slice 1 closes when the following signatures appear in a single end-to-end trace against a `brain/2.7.x.x`-deployed aeon:

### §9.AEON Canonical turn signals (one per step)

- **§9.AEON-1** — `aeon.wake` fires with `nodeId`, `taskId=null`, `depth=0`, `manifestPubKey`.
- **§9.AEON-2** — `aeon.hera.verified` fires; the integrity token is present in the trace.
- **§9.AEON-3** — `aeon.context.built` fires with `targetAgent`, `contextBytes`, `sourceManifests[]`.
- **§9.AEON-4** — `aeon.rules.loaded` fires with `rulesSha256`, `rulesSourceBackend`; the rules block appears in the athena prompt verbatim.
- **§9.AEON-5** — `proteus.fetch` fires for every proteus read with `agent`, `backend`, `path`, `ms`, `bytes`.
- **§9.AEON-6** — Three plutus signals in order: `plutus.quote` → `plutus.hold` → (`plutus.settle` OR `plutus.refund`). Each carries `quoteId` + ed25519 signature.
- **§9.AEON-7** — `aeon.athena.request` + `aeon.athena.response` bracket athena's roundtrip; each interior `poseidon.mcp.tool` call carries cosmos-logos envelope verification signature.
- **§9.AEON-8** — `proteus.enqueue` fires with new taskId, `parentTaskId`, `depth = current + 1`, `lineageCostSoFar` propagated. Recursion visible.
- **§9.AEON-9** — All three post-turn signals fire: `plutus.ledgered`, `mnemosyne.stored`, `hermes.notified`. `Cycle__c` FK present on the ledger row.

### §9.SAFE Operator-safety enforcement

- **§9.SAFE-1** — Sabbath test: with NL rule *"Rest on Sunday"* and a Sunday wake, aeon emits `aeon.blocked.sabbath` and DOES NOT dispatch to athena.
- **§9.SAFE-2** — Depth test: with NL rule *"Cap recursion at 3"* and a task at depth 3 trying to enqueue depth 4, aeon emits `aeon.blocked.depth` and DOES NOT write the child.
- **§9.SAFE-3** — Lineage-budget test: with NL rule *"Never above 500 coin per lineage"* and a subtask that would push cumulative to 501, aeon emits `aeon.blocked.lineage_budget` and refunds any held quote.
- **§9.SAFE-4** — Human-in-loop test: with NL rule *"Page me above 50 coin per task"* and a quote of 51, aeon emits `aeon.paused.human_review`, hermes calls the operator's declared channel, resumes on ack.

### §9.UI UI attestation

- **§9.UI-1** — Live queue browser reflects a task appearing within N seconds of enqueue.
- **§9.UI-2** — Quote preview in NL authoring shows a real plutus quote (signed) before submit.
- **§9.UI-3** — Trace view renders the 9-step turn for a completed task with parent/child links and cost accumulation.
- **§9.UI-4** — Kill switch on a running tree causes `aeon.tree.killed` + refunds in-flight quotes; the UI updates.

### §9.OP Operational hygiene

- **§9.OP-1** — Every telemetry signal carries the `Cycle__c` FK so a single SOQL join reconstructs the trace.
- **§9.OP-2** — Aeon overhead p95 (excluding athena + tool time) < 500ms in slice-1 deploy per §3.7.
- **§9.OP-3** — `aeon/CLAUDE.md` updated from `brain/1.7.x.x` to `brain/2.7.x.x` per repo-facts note in source.

## §10 Execution plan (slice 1)

*Ordered task list. Cross-god dependencies surfaced. Every real dependency named separately from every stubbed dependency.*

1. **§5 rulings resolved and locked.** No execution before Steward signs §5 and acknowledges the republic-616 open-question queue.
2. **Move this doc `02_design/ → 03_ready/`** once §6–§12 have been iterated to the aeon agent's satisfaction and Steward has reviewed the decomposition.
3. **Move to `04_in_development/`** on execution start (per README §270-275 single-Steward-mode relaxation, this step can be verbal ratification).

### §10.1 Schema first (real)
4. Land hestia intent schemas for task record (§7.1) and rule record (§7.2) as canonical types.
5. Update aeon's cosmos-logos manifest to declare `identity.rules[]`, `capabilities`, envelope config (§7.3).

### §10.2 Interface + stubs
6. Define plutus interface (§8.1) as TypeScript types + JSON schema; implement plutus stub signer for slice 1 (real ed25519, stub amounts).
7. Define proteus interface + implement a stub queue backend AND one real backend (SF) as the reference implementation. Both must satisfy the same interface tests.
8. Implement hera stub (returns valid integrity token) — real hera is a downstream cycle.

### §10.3 Canonical turn wiring (real hops for the majority)
9. Implement the 9-step canonical wake-up turn in `aeon/api/src/turn/*`. Real: athena (:3401), poseidon (:3431), plutus (interface, stub signer), proteus (stub queue), mnemosyne, hermes, zeus provisioning, orion scheduling. Stubbed: hera integrity token, plutus quote-amount calculation.
10. Instrument every telemetry signature from §9.AEON-1 through §9.AEON-9 with `Cycle__c` FK plumbing.

### §10.4 Operator-safety NL enforcement
11. Wire the four eternal-loop gates §2.10–§2.13 as athena+hera interpretation of the operator's NL rules block. Each gate emits its `aeon.blocked.*` / `aeon.paused.*` signal.
12. Test each gate against a scripted NL rule + provoking task.

### §10.5 UI (four surfaces seeded)
13. Aeon API on port 3581 + Aeon UI on port 3582 booted per `aeon/build.sh` + `aeon/run.sh`; Aphrodite Mythic Forge preset applied.
14. Implement queue browser (§2.14), NL authoring + quote preview (§2.15), trace view (§2.16), recursion dashboard + kill switch (§2.17).

### §10.6 CLAUDE.md sweep
15. Update `aeon/CLAUDE.md` from `brain/1.7.x.x` → `brain/2.7.x.x` per repo-facts note in source (§9.OP-3).

### §10.7 End-to-end attestation
16. Run the canonical attestation trace against a `brain/2.7.x.x`-deployed aeon: single wake → verify → context → rules → proteus → quote/hold → athena roundtrip → enqueue-recursion → settle → mnemosyne + hermes → visible in UI. Every §9 signal fires.
17. **§13 closeout** written. Cycle `git mv 04_in_development → 05_verifying`. Kronos-analog harness for aeon (if built) runs the §9.SAFE + §9.UI + §9.OP matrix. `git mv → 06_shipped`. Steward signs.

### §10.8 Deferred to a future cycle
- Real hera build (integrity-token semantics + verification protocol).
- Real plutus quote-amount calculation (slice-1 uses stubbed amounts).
- Real proteus for every per-agent backend (slice-1 ships SF + stub queue; git/dynamo/others follow).
- Republic-616 wiring for Q-1 through Q-6.
- Athena's NL → structured-intent-schema promotion learning loop.
- Cross-namespace task authority model (Q-5, Q-6).
- Chain-backed olympus-coin (SF ledger → real chain transition; Q-3).

## §11 Verification protocol

### §11.1 Without iPhone (this cycle's entire scope)
- `curl` against `:3581/v1/aeon/*` for every control-plane operation.
- Browser against `:3582` for UI surfaces.
- `sf data query` for `Cycle__c` + `LedgerEntry__c` reconstruction of the 9-step trace.
- `aws logs` / stdout inspection for every `aeon.*` / `plutus.*` / `proteus.*` / `mnemosyne.*` / `hermes.*` signal.

### §11.2 Scripted attestation harness
Similar spirit to `brain_2.7.eos-1.md`'s Kronos plan: for every §9 assertion, an attack-or-scenario script + observable evidence + no-collateral-damage check. This harness is TBD as design iterates; scaffold in `aeon/eos/tools/*.sh` when the shape stabilizes.

### §11.3 With iPhone
Not required for slice 1. iPhone surfaces (omens BYOK, etc.) live under other cycles.

## §12 Rollback plan

- **Per-god feature flags.** Each of the ten gods aeon depends on has a corresponding `AEON_<GOD>_ENABLED` env flag; disabling any collapses aeon to a pre-slice-1 no-op that logs but does not act.
- **`AEON_ENABLED=false`** hard-off: aeon boots but no wake fires, no queue is read, no ledger is written. Reversible without deploy.
- **Squash-merge revert.** If deployed via a single cycle-branch squash to `brain/2.7.x.x`, revert = one commit revert. Middleware chain returns to pre-aeon shape.
- **Non-revertable elements to be honest about.**
  - `LedgerEntry` rows written before revert are immutable per HUD umbrella §2.15 (immutable-ledger cluster lifecycle invariant, applied recursively to aeon rows).
  - Task records enqueued into real proteus backends before revert remain in those backends; a revert of aeon code does not garbage-collect them. Manual proteus purge is a Steward action.
  - Signed plutus quotes issued before revert remain non-repudiable receipts even if the aeon code that requested them is rolled back — this is the correct behavior of a ledger of record.

## §13 Closeout

*Filled at end of slice 1. Cycle moves to `05_verifying/` after §10.7 step 16 and to `06_shipped/` on full green §9 matrix.*

### What shipped (slice 1)
- …

### What deferred (and why)
- Real hera + real proteus fanout + real plutus quote-amount + chain-backed coin + republic-616 wiring + NL→structured promotion loop + cross-namespace authority.
- Each deferred item is a candidate for its own cycle when scoped.

### What surprised
- …

### Verification evidence
- Link to §9.AEON-1…9 telemetry captures for a single canonical turn.
- Link to §9.SAFE-1…4 gate captures (four scripted NL rules + provoking tasks).
- Link to §9.UI-1…4 UI screenshots / recordings.
- Link to `Cycle__c` SOQL reconstructing the full 9-step trace.
- Link to plutus ed25519-signed quote artifact + hold + settle receipts.
- Link to `brain/2.7.x.x` post-merge aeon SHA + parent submodule pointer bump + CDK deploy log.

### Feedback that emerged from THIS cycle (seed for the next one)
- Republic-616 debate queue seeded from §5.A (Q-1 through Q-6).
- Athena NL→structured promotion — future cycle.
- Real hera build — future cycle.
- Real plutus quote-amount + chain backing — future cycle.

### Memory updates
- New memory: aeon as the loop kernel; task queue = fleet's programming language; power-stays-with-operator discipline.
- Update to `MEMORY.md` index.

### Cycle close commit
- Slice-1 merge SHA on `brain/2.7.x.x` + parent submodule bump SHA + CDK deploy log.
- Steward sign-off: **__________** **__________**

---

## References

- **Source design-stage prompt (this cycle's seed):** Steward + aeon-agent capture 2026-09-25 — *"Aeon — Design Stage Prompt for the EOS Agent"* (folded into this doc; retain the original in the design-stage conversation record).
- **HUD umbrella (cost-surface bound):** [`brain_2.7.eos-1.md`](../04_in_development/brain_2.7.eos-1.md) — aeon respects HUD's L1–L14 cascade + downstream provider ceilings.
- **BYOK / sovereign-AI (cosmos-logos envelope precedent):** [`brain_1.7.eos-5.5.md`](../04_in_development/brain_1.7.eos-5.5.md) — aeon inherits the sealed-envelope credential pattern for every provider-key it handles.
- **EOS operating manual:** [`../README.md`](../README.md)
- **Patent disclosure (methodology):** [`../../PATENT-DISCLOSURE-DRAFT.md`](../../PATENT-DISCLOSURE-DRAFT.md) — the six novel claims aeon exercises recursively (patent claim 3 karmic accounting at the cycle level applies to every aeon task).
- **Republic-616 forward pattern:** README §275+ — the future multi-party governance body that will pin Q-1 through Q-6.
- **Repo facts:** aeon API :3581, aeon UI :3582; bootstrap via `aeon/build.sh` + `aeon/run.sh`; design system Aphrodite Mythic Forge preset; current working branch `brain/2.7.x.x` (aeon/CLAUDE.md still references `brain/1.7.x.x` — closes in §10.6).
