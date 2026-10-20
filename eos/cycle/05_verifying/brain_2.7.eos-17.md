---
pitch: "Spawn any god as a Claude session over HTTP"
---

# Prometheus exposes external HTTP spawn of any god as a Claude Code session — identity injected, repo mounted, PRs authored with inherited `gh` auth

> File: `brain_2.7.eos-17.md` — **seventeenth primary EOS cycle on the `brain/2.7.x.x` family** (after HUD `eos-1`, aeon `eos-2`, argos `eos-3`, kronos `eos-4`, brain-genesis `eos-5`, poseidon `eos-6`, iris `eos-7`, olympus-gpt `eos-8`, cloudpremise `eos-9`, proteus `eos-10`, env-loader `eos-11`, anon-Stripe `eos-12`, MeteringEvent widening `eos-13`, Plutus vocab `eos-14`, Odyssey Press `eos-15`, `eos-16` TBC).
>
> Type: **primary capability** — prometheus-owned, single-repo scope at the code layer, cross-fleet in capability (every god is now spawnable via web).
>
> Source: Steward direction 2026-10-06 — "the full lifecycle of word to manifestation that I have been working towards for some time."

| | |
|---|---|
| **Branch family** | `brain/2.7.x.x` |
| **Cycle ordinal** | `eos-17` (seventeenth primary on 2.7 family) |
| **Status** | `Executing` — code shipped on prometheus `brain/2.7.x.x` working tree; end-to-end verified via athena PR #109 round-trip 2026-10-06; §5 pending; cycle PR not yet opened against prometheus `brain/1.7.x.x` or the parent olympus-616 submodule bump. |
| **Opened** | 2026-10-06 |
| **Closed** | — |
| **Prior cycle** | `brain_2.7.eos-16` (adjacent slot — cross-reference when `--eos` back-fills) |
| **Theme** | External HTTP spawns a god as a live Claude Code pty with identity (system prompt), workspace (cwd), and credentials (inherited `~/.config/gh`) — closing the word → manifestation loop on localhost. Fargate deferral explicit. |
| **Feedback inputs** | Steward direction 2026-10-06; this prometheus session's transcript (foundation of attestation evidence) |
| **Estimated effort** | 2h (API + UI + end-to-end attest) |
| **Actual effort** | ~2h |

---

## Canonical attestation statement

> *"I attest that Prometheus exposes `POST /sessions` with an optional `god` field that resolves to a hardcoded profile (`prometheus`, `athena`, `olympus-grid`); that each profile injects `--append-system-prompt <P>` and a trailing boot-prompt positional argv into the spawned `claude` pty inside the god's absolute workspace; that the pty inherits `process.env` so `gh pr create` works using the operator's local `~/.config/gh` with no credential plumbing in Prometheus; that `GET /gods` + `GET /gods/:name` expose the catalog to external surfaces (iris portal, future MCP); that the Prometheus UI (`:3742`) wires a God dropdown + badges + cwd preview + workspace override; and that this surface was verified end-to-end on 2026-10-06 via an athena session that identified itself, enforced its system-prompt boundary rules, performed an in-scope file edit with honest diff reporting, and ran the full branch → commit → push → `gh pr create --draft` → PR URL cycle (olympus-616/athena#109, opened, confirmed, closed, local branch pruned on operator confirm)."*

---

# § Steward-authored (top half)

## §1 User story

> **§1.1** As the **Steward** I want **external surfaces (the Prometheus UI, iris portal, future MCP consumers) to spawn any god as a Claude Code session via Prometheus** so that **the word → manifestation loop closes from an HTTP call — pick a god, say what to do, agent commits and PRs with my local credentials, without local shell access**.
>
> **§1.2** As **any god in the fleet** I want **my boot context (identity, cwd, orientation steps, boundary rules) injected at pty spawn time** so that **I land oriented on the correct repository and refuse out-of-scope asks even when a human types them freely into a terminal**.
>
> **§1.3** As the **Prometheus agent (future recursion)** I want **the same spawn surface callable via MCP** so that **Athena and Poseidon can call Prometheus the same way an external client does — and Athena can author her own PRs via a tool call**.

## §2 Acceptance criteria

- **§2.1** **Given** Prometheus running on `:3741` **when** `POST /sessions` is sent with `{"god":"athena"}` **then** a Claude Code pty spawns in `/Users/gregory/dev/repos/olympus-616/athena` with the athena system prompt injected via `--append-system-prompt` and the athena boot prompt applied as the trailing positional argv **and** the returned Session carries `god: "athena"` **and** the Argos log line `Session created: <id>` carries `god: "athena"`.
- **§2.2** **Given** a god-session is live **when** the operator asks it an in-scope question **then** the agent reports from the god's actual repo state (git branch, uncommitted files, source-directory listings) proving `cwd` + repo access are correct.
- **§2.3** **Given** a god-session has a boundary rule in its system prompt (e.g., athena's "do NOT modify canonical architecture docs in github-home/") **when** the operator asks the agent to perform an out-of-scope action **then** the agent refuses and redirects to the correct sibling agent, quoting its own mode constraints.
- **§2.4** **Given** `gh` CLI is installed and `~/.config/gh` is populated **when** the operator asks the god-session to open a PR **then** the agent runs `gh pr create` successfully using inherited local credentials — zero auth plumbing in Prometheus — and reports the live PR URL.
- **§2.5** **Given** external surfaces need discoverability **when** they fetch `GET /gods` **then** they receive the catalog `{gods: [{name, description, workspace}], total: N}` with absolute `workspace` paths; `GET /gods/:name` returns the full `GodProfile` including `systemPrompt` + `bootPrompt` for inspection.
- **§2.6** **Given** the UI at `:3742` **when** the operator opens the New Session modal **then** the God dropdown lists all catalog entries, the cwd preview shows the resolved absolute path when a god is picked, the Workspace field becomes an optional override whose placeholder is the god's default, and the spawned session row + terminal header both display an orange uppercase god badge.

## §3 Non-functional requirements

- **Compatibility** — `POST /sessions` without `god` continues to work (god is optional); existing `/sessions/:id/turns`, `/sessions/:id/stream`, `/sessions/:id/input`, `/sessions/:id/resize` routes unchanged.
- **Privacy** — no secrets ever cross the Prometheus HTTP surface. `gh` auth lives entirely in `~/.config/gh` on the operator's machine; the pty inherits process.env but Prometheus never reads or logs the tokens.
- **Localhost scope** — explicit deferral of all auth/security on the Prometheus API itself. No Fargate exposure until a cosmos-logos handshake lands in front of Prometheus. The current API trusts every caller. Documented, not accidental.
- **Observability** — god name logged in Argos on session.created; `god` persisted on the Session record in `FileSessionStore`; `god` emitted in the Plutus `session.created` event payload.
- **Determinism** — profile workspace resolution: `OLYMPUS_DIR` env wins, else walk up 5 levels from `api/src/profiles/index.ts` to `~/dev/repos`. Same result whether launched via `alchemisthomer.sh` (sets `OLYMPUS_DIR`) or directly.
- **Performance** — no measurable overhead vs god-less spawn; same `claude` invocation shape, two extra argv.

## §4 Feedback inputs

| FB# | Title | Body excerpt |
|-----|-------|--------------|
| FB-steward-20261006 | Prometheus god-session vision | "the full lifecycle of word to manifestation that i have been working towards for some time… we can keep it private to localhost implementations for now, and then build security once we push to fargate" |
| FB-steward-20261006.a | Hardcode prompts, don't migrate yet | "hard code the prompts for now - eventually i think they belong in the cosmos logos for the agent we are booting" |
| FB-steward-20261006.b | Field naming | "god (non capitalized), the agent is the composition of all of the gods together" |

## §5 Steward approval gate

- [x] Story locked
- [x] Criteria locked (all §2.N verified 2026-10-06 via athena PR #109 round-trip)
- [x] NFRs locked (Compatibility / Privacy / Localhost scope / Observability / Determinism all tested)
- [x] Approved to execute — signed: **GWH** **2026-10-20**

> §5 ratified retroactively 2026-10-20 to formalize execution the Steward verbally directed 2026-10-06. All §9 telemetry paths confirmed; attestation evidence in §11/§13 is complete. Promoted `04_in_development/` → `05_verifying/`. Three explicit deferrals carry forward (MCP wrapper, profile migration, Fargate security layer).

---

# § Agent-authored (bottom half)

## §6 Layer impact map

| Criterion | prometheus/api | prometheus/ui | External clients | Other gods |
|-----------|----------------|---------------|------------------|------------|
| §2.1 | `SpawnOpts.{systemPrompt?, bootPrompt?}`; `SessionCreateRequest.god?`; `Session.god?`; `GodProfile`; `api/src/profiles/index.ts`; `SessionManager.createSession` god-resolution; `ClaudeCodeProvider.spawnSession` argv assembly; Argos + Plutus event enrichment | — | — | — |
| §2.2 | — (falls out of correct cwd) | god badge rendering | — | each god's `README.md` + `CLAUDE.md` must be in-tree |
| §2.3 | — (verbatim system-prompt load into claude argv) | — | — | each god's own boundary rules carried in the hardcoded profile (lifted from `alchemisthomer.sh`) |
| §2.4 | `env: process.env` passthrough in `spawnSession` (pre-existing; verified not regressed) | — | — | — |
| §2.5 | new routes `GET /gods`, `GET /gods/:name`; `POST /sessions` accepts `god` | New Session modal God dropdown; dropdown fetches `/gods` on mount | iris portal (planned); MCP wrapper (planned, §10 follow-up) | — |
| §2.6 | — | `Sessions.tsx` modal rewrite; god badges in list rows + terminal header; `vite.config.ts` proxy `/gods` → `:3741`; xterm flicker fix via `useCallback` for `onSessionDead` | — | — |

## §7 Schema deltas

**TypeScript types** (`prometheus/api/src/types.ts`):

```diff
 export interface Session {
   id: string;
   provider: string;
   workspace: string;
+  /** Which god this session is embodying (e.g., 'athena', 'olympus-grid'). */
+  god?: string;
   model?: string;
   // ...
 }

 export interface SessionCreateRequest {
   provider?: string;
   workspace?: string;
   model?: string;
   metadata?: Record<string, unknown>;
+  /** When set, resolves to a GodProfile that fills workspace + system prompt +
+   *  boot prompt. Values in this request override anything the profile sets. */
+  god?: string;
 }

 export interface SpawnOpts {
   workspace: string;
   model?: string;
+  /** Appended to the CLI's base system prompt (claude: --append-system-prompt). */
+  systemPrompt?: string;
+  /** Initial prompt the CLI processes before accepting the first user turn
+   *  (claude: trailing positional argv). */
+  bootPrompt?: string;
 }

+export interface GodProfile {
+  name: string;
+  description: string;
+  workspace: string;    // absolute path
+  systemPrompt: string;
+  bootPrompt?: string;
+}
```

**Persistence** (`FileSessionStore`): no migration — `god` is a nullable string field on new records; existing sessions deserialize with `god: undefined` and continue to function. Forward-compat by construction.

**No olympus-grid / Salesforce schema changes.** This card is prometheus-local.

## §8 Service contracts

```
POST /sessions
POST /v1/prometheus/api/sessions          (gateway-prefixed mirror)
  Body: { provider?, workspace?, model?, metadata?, god? }
  Resolution:
    - If `god` present → load GodProfile; use profile.workspace unless
      req.workspace overrides; pass systemPrompt + bootPrompt to SpawnOpts.
    - If `god` present but unknown → 400 { error: "Unknown god \"...\"" }
  Returns: 201 Session (with .god if provided)

GET /gods
GET /v1/prometheus/api/gods
  Returns: 200 { gods: GodSummary[], total }
    GodSummary = { name, description, workspace }   // systemPrompt stripped
  Rationale: catalog view; large prompts omitted (they're bytes-expensive
  and only matter at spawn).

GET /gods/:name
GET /v1/prometheus/api/gods/:name
  Returns: 200 GodProfile (full, including systemPrompt + bootPrompt)
         | 404 { error: "Unknown god ..." }
```

**Vite proxy** (`prometheus/ui/vite.config.ts`): add `/gods` → `http://localhost:3741` alongside the existing `/sessions`, `/providers`, `/health`, `/status`, `/v1` entries. Without this entry the UI port returns `index.html` on `/gods` and the dropdown fetch silently fails.

## §9 Telemetry assertions (close-out gate)

- Argos: `logToArgos('INFO', 'Session created: <id>', { sessionId, provider, workspace, god })` fires with `god: "<name>"` set for every god-session; `god: undefined` for raw sessions.
- Plutus: `emitToPlutus('session.created', sessionId, { sessionId, provider, god })` carries the god field.
- The god's boot prompt output appears in session scrollback within the first 2 seconds of pty spawn (verified visually; no automated assertion yet — SSE replay test is a follow-up).
- Zero occurrences of a 500 from `POST /sessions` when `god` references a known profile.

## §10 Execution plan

1. ✅ **Types** — extend `SpawnOpts`, `SessionCreateRequest`, `Session`; add `GodProfile`.
2. ✅ **Profile catalog** — `prometheus/api/src/profiles/index.ts` with 3 hardcoded profiles (`prometheus`, `athena`, `olympus-grid`). Prompts lifted verbatim from `alchemisthomer.sh` `--prometheus` / `--athena` / `--olympus-grid` blocks. Workspace resolver honors `OLYMPUS_DIR` with 5-level walk-up fallback.
3. ✅ **ClaudeCodeProvider** — build argv `['--dangerously-skip-permissions', '--append-system-prompt', <P>, <BOOT>]` when fields present; both optional.
4. ✅ **SessionManager** — resolve god → profile at `createSession`; explicit `req.workspace` wins over profile; persist `god` on Session; thread `systemPrompt` + `bootPrompt` through to provider.
5. ✅ **Routes** — `POST /sessions` accepts `god`; new `GET /gods` + `GET /gods/:name`.
6. ✅ **Vite proxy** — add `/gods` → `:3741`.
7. ✅ **UI** — God dropdown at top of New Session modal; cwd preview; workspace-override placeholder; god badge in session rows + terminal header.
8. ✅ **Flicker fix** — wrap `onSessionDead` in `useCallback` so Terminal's `useEffect([sessionId, onSessionDead])` doesn't re-fire every parent render (3s metadata poll was tearing down + rebuilding xterm).
9. ⬜ **Prometheus cycle PR** — open `cycle/eos-17` → `brain/1.7.x.x` on `olympus-616/prometheus`.
10. ⬜ **Parent submodule bump** — once (9) merges, bump prometheus pointer in the parent `olympus-616` cycle PR.
11. ⬜ **MCP wrapper** (follow-up card) — `prometheus.spawn_god`, `prometheus.send_turn`, `prometheus.read_session` tools so Athena + Poseidon can call Prometheus. Enables recursive self-modification. Scope-separate — not this cycle.
12. ⬜ **Profile migration** (follow-up card) — move the three hardcoded prompts into each god's `.well-known/cosmos-logos.json` under a new `developer_profile` section. Catalog becomes discovery, not storage. Scope-separate — not this cycle.
13. ⬜ **Fargate security** (follow-up card, blocked) — cosmos-logos handshake in front of Prometheus before any non-localhost exposure. Explicit Steward deferral.

## §11 Verification protocol

### Attested 2026-10-06 (all passed)

**Localhost smoke**:
- `curl -sf :3741/gods` returned 3 profiles with absolute `workspace` paths resolved to `/Users/gregory/dev/repos/olympus-616/{prometheus,athena,olympus-grid}` ✅
- `curl -sf :3742/gods` returned the same JSON (proxy wired) ✅
- `curl -sf :3741/health` ok; `:3742/` ui/http=200 ✅

**UI boot**:
- `+ New` modal shows God dropdown populated with all three gods; cwd preview updates when god selected; Workspace placeholder flips to the god's default path ✅
- Session row + terminal header both carry orange uppercase `ATHENA` badge after spawn ✅

**Boot prompt auto-run (test #0)**:
- Spawning athena fired `git status` + `git log --oneline -10` + `ls api/src/ai/` + `grep ATHENA_AI_TYPE api/.env` in the pty before any human input; agent closed with "Athena — ready" preamble + "What athena work today?" prompt ✅

**Boundary rule enforcement (test #1)**:
- Prompt: *"Add a line to github-home/ARCHITECTURE.md about athena's cosmos-logos handshake."*
- Agent: refused + quoted its own mode constraint verbatim + redirected to `./alchemisthomer.sh --olympus-grid` + offered in-scope alternative (`athena/ARCHITECTURE.md`) ✅

**In-scope file edit (test #2)**:
- Prompt: *"Add a one-line comment at the top of api/src/server.ts … show me the git diff but do NOT commit."*
- Agent: added `// Spawned via Prometheus pty handshake - 2026-10-06`, ran `git diff`, voluntarily distinguished its edit from pre-existing dirty state at line ~68 ✅
- Operator `revert that change` cleaned the tree ✅

**Full PR lifecycle (test #3)**:
- Prompt: *"On a new branch `prometheus-handshake-smoke`, add HISTORY.md … open a draft PR … report the PR URL."*
- Agent: `gh auth status` confirmed `alchemisthomer`; `git checkout -b`; `git add`; `git commit`; `git push -u`; `gh pr create --draft` → PR URL: **<https://github.com/olympus-616/athena/pull/109>** (draft, base `brain/2.7.x.x`, head `prometheus-handshake-smoke`, commit `bf6e879`, only `HISTORY.md` in diff — three pre-existing dirty files voluntarily excluded from scope) ✅
- Judgment moment: agent flagged ambiguous `|` in commit message, interpreted conservatively, surfaced the choice ✅

**Cleanup**:
- `gh pr close 109 --repo olympus-616/athena --delete-branch` executed by agent;
- Agent flagged that `--delete-branch` only wipes remote; local `prometheus-handshake-smoke` still held `bf6e879`;
- Operator confirmed `yes delete it` → `git branch -D` ran clean ✅

**Repeatable manual verification**:
```bash
# API alone
curl -sf localhost:3741/gods
curl -X POST localhost:3741/sessions \
  -H 'content-type: application/json' \
  -d '{"god":"athena"}'
# → session.workspace === /Users/.../olympus-616/athena
# → session.god === "athena"

# UI
bash /Users/gregory/dev/repos/olympus-616/prometheus/run.sh
# open http://localhost:3742/sessions → + New → pick "athena" → Spawn
```

## §12 Rollback plan

- **Code revert**: single revert of the prometheus cycle PR restores pre-god `SessionCreateRequest`. All added fields are additive and nullable; no destructive migration.
- **Running sessions survive the revert**: `god` is already persisted on existing records; `SessionManager` becomes insensitive to the field but doesn't break on reading it (TypeScript optional + JSON ignore unknown).
- **No cross-god contract changes**; no sibling repo depends on this surface yet (MCP wrapper is deliberately scope-separate). Revert blast radius = Prometheus only.
- **Risk flagged**: `--dangerously-skip-permissions` on a web-exposed pty is a remote shell by design — intentional for localhost per Steward direction. Rollback is "stop exposing Prometheus publicly," not a code change. Fargate security card (§10.13) MUST land before any non-localhost deployment.

## §13 Closeout

> **Preliminary — final sign-off awaits §5 ratification + cycle PR merge.**

### What shipped (code-attested, PR pending)
- Profile catalog (3 gods) + resolver (`prometheus/api/src/profiles/index.ts`).
- Extended `SpawnOpts` / `SessionCreateRequest` / `Session` / new `GodProfile` type.
- `ClaudeCodeProvider` argv assembly with `--append-system-prompt` + boot positional.
- `SessionManager.createSession` god resolution + persistence.
- `GET /gods` + `GET /gods/:name` + `POST /sessions` `god` field.
- Vite proxy `/gods` entry.
- UI: God dropdown + cwd preview + workspace-override placeholder + god badges + xterm flicker fix.
- End-to-end attestation: athena session → olympus-616/athena PR #109 full round-trip.

### What deferred (and why)
- **MCP wrapper for prometheus** — would let Athena + Poseidon spawn gods via tool calls (recursive loop). Deferred: wait until §13 of this card closes so the API surface is stable before wrapping it.
- **Profile migration to `.well-known/cosmos-logos.json`** — would make each god self-describe its boot context. Deferred per Steward: *"hard code the prompts for now - eventually i think they belong in the cosmos logos for the agent we are booting."*
- **Fargate security layer** — cosmos-logos handshake in front of Prometheus. Deferred per Steward: *"we can keep it private to localhost implementations for now."*

### What surprised
- **Vite proxy miss was invisible** — `/gods` served the UI's `index.html` on 200, so `JSON.parse(data).gods` silently returned `undefined` and the dropdown stayed empty with no console error. Root cause: proxy table enumerates every API prefix; adding a new route requires a new proxy entry. Dev-time pitfall — note in the follow-up documentation.
- **Terminal flicker rooted in inline-arrow identity churn**, not setState churn. Every parent re-render created a new `onSessionDead` reference, which tripped Terminal's `useEffect([sessionId, onSessionDead])` into teardown + rebuild. Fix: `useCallback`. Pattern worth remembering: any child with heavy mount cost (xterm, EventSource, ResizeObserver) needs its function props memoized.
- **Athena's voluntary distinction** between her edit and pre-existing dirty state in test #2 proved the system prompt's *integrity rules* load, not just the orientation steps. That was the moment the handshake became clearly load-bearing.

### Verification evidence
- Athena PR round-trip: <https://github.com/olympus-616/athena/pull/109> (closed, draft)
- Session transcript: full flow captured in prometheus session scrollback 2026-10-06 (6 screenshots preserved by Steward)
- Code artifacts: diff on prometheus `brain/2.7.x.x` working tree pre-PR

### Feedback that emerged from THIS cycle (seed for the next)
- **FB-20261006.c** — "Vite proxy ergonomics: new API prefixes should emit a dev-time warning when they'd otherwise be swallowed by the SPA fallback" (DX issue; Prometheus UI only)
- **FB-20261006.d** — "MCP wrapper for Prometheus unlocks Athena self-modification" (triggers §10.11 follow-up card)
- **FB-20261006.e** — "Profile source-of-truth migration path" (triggers §10.12 follow-up card)

### Memory updates
- (Pending) `~/.claude/.../prometheus/memory/` — pattern: *every child component with heavy mount cost needs its callback props memoized to survive parent re-renders*.
- (Pending) Prometheus `CLAUDE.md` — add note that profile prompts are hardcoded; migration path is per-god `.well-known/cosmos-logos.json`.

### Cycle close commit
- Prometheus HEAD at close: `2e19827` on `brain/2.7.x.x` — *feat(prometheus): ATH-001 — cosmos-logos sovereignty + MCP-driven autonomous override + pty reliability + scrollback*
- Steward sign-off: **GWH** **2026-10-20**
- Parent submodule bump PR: — (follows prometheus merge)
- Steward sign-off: — —
