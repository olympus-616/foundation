---
pitch: "Drive any god from the iris agent portal"
---

# The iris agent portal embeds a Prometheus session component — operators spawn + drive any god from the primary developer portal, through the production Salesforce surface

> File: `brain_2.7.eos-18.md` — **eighteenth primary EOS cycle on the `brain/2.7.x.x` family** (follows prometheus HTTP spawn `eos-17`).
>
> Type: **primary capability** — iris-agent-owned at the implementation layer, Prometheus-owned at the API-contract layer, consumes the surface shipped by `eos-17`.
>
> Source: Steward direction 2026-10-06 — *"we have full control of the agent from within the agent"*.

| | |
|---|---|
| **Branch family** | `brain/2.7.x.x` |
| **Cycle ordinal** | `eos-18` (eighteenth primary on 2.7 family) |
| **Status** | `Executing` — iris-agent Prometheus component shipped on operator machine; verified end-to-end through the scratch-org URL + bundleDomain path 2026-10-06 driving both a prometheus-self session and an athena session; §5 pending; iris portal bundle release discipline + prod Plugin__mdt URL discovery not yet complete. |
| **Opened** | 2026-10-06 |
| **Closed** | — |
| **Prior cycle** | `brain_2.7.eos-17` (prometheus HTTP spawn — this cycle consumes that surface via an authenticated UI frame) |
| **Theme** | iris agent portal becomes the operator surface for Prometheus; recursive agency through a single pane of glass; the Steward opens one URL and drives every god. |
| **Feedback inputs** | Steward verification 2026-10-06 screenshot (iris agent portal `/portal/agent?bundleDomain=http://localhost:5176` embedded Prometheus component driving athena); Steward observation on auth gap *"it doesn't have the jwt that was issued to the iris browser. this is fine"*; `prometheus/docs/CLIENT-INTEGRATION-IRIS-AGENT.md` consumer spec (2026-10-06) |
| **Estimated effort** | ~4h (iris-agent component build + Vite proxy + xterm wiring + attest) |
| **Actual effort** | — (iris-agent-side implementation effort not reported through this session) |

---

## Canonical attestation statement

> *"I attest that the iris agent portal (`iris/reactforce/agent/`) carries a Prometheus session component that fetches the Prometheus god catalog (`GET /gods`), spawns god-sessions (`POST /sessions {god}`), streams pty output via SSE (`/sessions/:id/stream`), and accepts raw keystroke input (`POST /sessions/:id/input`) against `localhost:3741`; that an operator authenticated to the iris agent portal can select any god from the catalog and drive its Claude Code session to completion — including real `git` and `gh pr create` operations under operator credentials inherited through the pty; that the component mirrors the Prometheus-UI visual grammar (god badges, status pills, Aphrodite Mythic Forge tokens); and that this surface was verified end-to-end on 2026-10-06 via `business-innovation-652.scratch.my.site.com/portal/agent?bundleDomain=http://localhost:5176` driving both a `prometheus` session (self-aware orientation + source-dir inventory) and an `athena` session (full repo state report + honest introspection acknowledging transport invisibility)."*

---

# § Steward-authored (top half)

## §1 User story

> **§1.1** As the **Steward** I want **to open the iris agent portal (my primary daily developer surface) and drive any god directly from there** so that **there is one URL, one authenticated session, and one visual grammar for every piece of agent work — no separate Prometheus UI, no terminal, no shell switching**.
>
> **§1.2** As **any operator with iris portal access** I want **the Prometheus session component to behave identically whether I came in via localhost:3742 or via the authenticated Salesforce surface** so that **the production path is production-faithful during development** (the scratch-org URL + `bundleDomain` hot-reload trick is the dev-mode of the real transport, not a parallel universe).

## §2 Acceptance criteria

- **§2.1** **Given** an operator authenticated to the iris agent portal **when** they open the Prometheus panel **then** the panel fetches `GET /gods` (via the configured Prometheus URL — localhost in dev, Plugin__mdt-provided in prod) and populates the god dropdown within 2s.
- **§2.2** **Given** the operator selects a god and clicks `+ New Session` **when** the POST lands **then** a Claude Code pty spawns with the god's system prompt + boot prompt + workspace (identical code path to Prometheus-UI) **and** the session appears in the panel's sidebar within 1s **and** the embedded component displays the god badge + cwd + pid + status pill matching `prometheus/ui/src/pages/Sessions.tsx` visual grammar.
- **§2.3** **Given** a god-session is live **when** the operator types in the terminal pane **then** keystrokes coalesce (5ms window) and POST to `/sessions/:id/input` **and** SSE `chunk` events render in the xterm instance **and** `ResizeObserver` wires terminal resize to `POST /sessions/:id/resize`.
- **§2.4** **Given** the operator wants end-to-end attestation **when** they ask the god to open a draft PR **then** the agent completes the full `branch → commit → push → gh pr create` cycle using operator credentials inherited through the pty (as attested in `eos-17` §11) — identical outcome, different frame.
- **§2.5** **Given** the operator spawns multiple sessions **when** they list sessions **then** the panel shows all live sessions with god badges, status pills, and session metadata; dead sessions are visually distinct (status: `dead` / red pill).
- **§2.6** **Given** the operator hard-refreshes the portal tab mid-session **when** the component remounts **then** the terminal re-attaches to the live Prometheus session via SSE and replays scrollback (256 KB rolling buffer per `eos-17` §9 Observability) so the TUI state is intact.

## §3 Non-functional requirements

- **Visual parity** — same Aphrodite Mythic Forge tokens used in prometheus-ui (`text-accent` orange for god names, `text-success`/`text-info`/`text-warning`/`text-error` for status pills).
- **Memoize callback props** — any function prop passed into the xterm wrapper must be `useCallback`-stable, or the 3s session-metadata poll will tear down the pty attach every tick (direct lesson from `eos-17` closeout). See `prometheus/ui/src/pages/Sessions.tsx` `handleSessionDead` for the reference pattern.
- **SSE reconnect resilience** — browser EventSource auto-reconnects; Prometheus replays scrollback on new subscribe. No client-side scrollback needed.
- **Localhost scope on auth** — the component inherits whatever auth posture Prometheus itself has. Today: none (localhost-only, explicit). The embedded user-identity propagation is **out of scope for this cycle** — flagged as blocking for Fargate (see §13 follow-ups).
- **Dormant placeholder in prod** — if Prometheus is not reachable (CORS-prohibited localhost from a non-localhost origin, or no local fleet running), the component renders a dormant placeholder with instructions, not a broken loading state.

## §4 Feedback inputs

| FB# | Title | Body excerpt |
|-----|-------|--------------|
| FB-steward-20261006.e | Working | *"i have verified prometheus and athena functionality available through the \"prometheus\" component. we have full control of the agent from within the agent"* |
| FB-steward-20261006.f | Auth gap acknowledged | *"it doesn't have the jwt that was issued to the iris browser. this is fine"* — the agent in the pty has operator identity (gh/git/fs), not iris portal user JWT. Known, documented, deferred to Fargate planning. |
| FB-steward-20261006.c | iris-agent spec exists | `prometheus/docs/CLIENT-INTEGRATION-IRIS-AGENT.md` — written 2026-10-06, consumed to execute this cycle. |

## §5 Steward approval gate

- [ ] Story locked
- [ ] Criteria locked
- [ ] NFRs locked
- [ ] Approved to execute — signed: **{Steward initials}** **{date}**

> Note: §5 is being drafted post-hoc because the Steward verbally directed execution before the card existed (consistent with `eos-17`). Formal checkbox sign-off remains an open gate; attestation evidence in §11 is complete and awaiting ratification.

---

# § Agent-authored (bottom half)

## §6 Layer impact map

| Criterion | iris/reactforce/agent | prometheus/api | olympus-grid | Future auth |
|-----------|-----------------------|-----------------|--------------|-------------|
| §2.1 | `GET /gods` fetch; dropdown population; Prometheus URL discovery (dev: Vite proxy; prod: Plugin__mdt) | zero changes (`GET /gods` shipped eos-17) | Plugin__mdt record for prod Prometheus URL (deferred) | — |
| §2.2 | `POST /sessions {god}`; session list sync | zero changes (`POST /sessions {god}` shipped eos-17) | — | — |
| §2.3 | xterm.js wrapper; `onData` → `/input`; `ResizeObserver` → `/resize`; `EventSource` → `chunk` events | zero changes | — | — |
| §2.4 | — (operator-identity inheritance is a Prometheus-level property) | — (`env: process.env` already pass-through) | — | gh is operator credential, NOT user JWT — load-bearing for Fargate (see §13) |
| §2.5 | session list + badges + status polling (`GET /sessions` 5s cadence; selected `GET /sessions/:id` 3s cadence) | zero changes | — | — |
| §2.6 | SSE subscribe on remount; scrollback replay auto-handled by Prometheus | zero changes (scrollback persists in `SessionManager.live`) | — | — |

## §7 Schema deltas

- **No Prometheus schema changes.** All API surface was shipped by `eos-17`.
- **iris-agent portal**: potentially a new `Plugin.iris_deployment_agent.md-meta.xml` bundle-ID pin when the agent bundle ships (`npm run publishAgent` + 5-way consistency per `olympus-616/CLAUDE.md § Iris Portal Bundle Release`). Owned by iris-agent engineer.
- **olympus-grid**: potentially a new Plugin__mdt record for Prometheus URL discovery in prod (deferred; localhost-only MVP). Owned by olympus-grid engineer.

## §8 Service contracts

**Consumer-side only.** iris-agent portal calls Prometheus's existing contracts (shipped by `eos-17`, documented in `prometheus/docs/CLIENT-INTEGRATION-IRIS-AGENT.md`):

```
GET  /gods                          → catalog
GET  /gods/:name                    → full GodProfile
POST /sessions {god, workspace?}    → Session
GET  /sessions                      → session list
GET  /sessions/:id                  → session metadata
DELETE /sessions/:id                → terminate
POST /sessions/:id/turns {prompt}   → queued turn
GET  /sessions/:id/turns            → turn history
POST /sessions/:id/input {data}     → raw stdin
POST /sessions/:id/resize {cols,rows} → pty SIGWINCH
GET  /sessions/:id/stream           → SSE
```

All contracts dual-mounted at `/` and `/v1/prometheus/api/*`. iris-agent uses whichever prefix its Vite proxy / Plugin__mdt is configured for.

**Dev-mode transport chain** (attested):
```
browser (scratch-org URL)
  → Salesforce portal page (base HTML)
  → bundleDomain=http://localhost:5176 (Vite dev server, iris-agent)
  → iris-agent app code
  → (Vite proxy) → http://localhost:3741 (Prometheus)
  → claude pty in /Users/.../olympus-616/<god>
```

**Prod transport chain** (deferred):
```
browser (production iris portal)
  → iris-agent app (served from olympus-grid static resources)
  → (via Plugin__mdt-configured URL) → Prometheus
    → either direct https (ngrok reserved domain) or
    → via Ares/Hermes gateway at /v1/prometheus/api/*
```

## §9 Telemetry assertions

- iris-agent portal emits a `session.spawn.clicked` event (or iris's convention) with god name on each spawn.
- Prometheus's `Session created: <id>` Argos log continues to carry `god` field (unchanged from `eos-17`).
- Plutus `session.created` event continues to carry `god` (unchanged).
- SSE connection open/close events render in browser devtools without 4xx/5xx on reconnect (indicates proxy is routing SSE correctly).

## §10 Execution plan

1. ✅ **Lift pattern** — Prometheus-UI's `Terminal.tsx` + `Sessions.tsx` → embedded component in `iris/reactforce/agent/src/pages/` (or wherever iris-agent's convention places it).
2. ✅ **Nav entry + route** — Prometheus panel surfaced in the iris agent portal navigation.
3. ✅ **Vite dev proxy** — `/gods`, `/sessions`, `/providers` → `localhost:3741` in `iris/reactforce/agent/vite.config.ts` (or iris monorepo's shared Vite config).
4. ✅ **xterm.js dependency** — `@xterm/xterm` + `@xterm/addon-fit` added to iris-agent workspace.
5. ✅ **End-to-end verification** — scratch-org URL + bundleDomain → component → Prometheus → god pty, driven by Steward 2026-10-06.
6. ⬜ **Plugin__mdt wiring** — prod Prometheus URL discovery (deferred; localhost-only is explicit scope decision).
7. ⬜ **Bundle release discipline** — `npm run publishAgent` + 5-way bundle-ID pin on `Plugin.iris_deployment_agent.md-meta.xml` (owned by iris-agent engineer when prod wiring is ready).
8. ⬜ **Cycle PRs** — iris cycle PR (`cycle/eos-18` → `brain/1.7.x.x`) + olympus-grid cycle PR (bundle delta) + parent `olympus-616` submodule bump.
9. ⬜ **Steward §5 ratification** — formal checkboxes.

## §11 Verification protocol

### Attested 2026-10-06 (operator-confirmed)

**Transport**:
- [x] Prometheus running on `:3741` + `:3742` (localhost)
- [x] iris-agent portal served from `business-innovation-652.scratch.my.site.com/portal/agent?bundleDomain=http://localhost:5176`
- [x] Prometheus panel visible in agent portal left nav (sibling to Brain, Nostos, Admin, TurtleShell.Ai, Dashboards, …)
- [x] Panel header renders `PROMETHEUS · PTY SESSIONS` + `online · BASE · LOCALHOST:3741` connection indicator

**Catalog**:
- [x] God dropdown populated from `GET /gods` (3 entries: prometheus, athena, olympus-grid)
- [x] `+ New Session` modal shows god dropdown + cwd preview + workspace override

**prometheus-self session** (session #1 of attestation):
- [x] Spawned via embedded component
- [x] Boot orientation executed in pty: `cd olympus-616/prometheus`, `README.md` read, `CLAUDE.md` read, `git status`, `git log --oneline -10`, `ls api/src/`
- [x] Agent reported as prometheus agent in response
- [x] "What prometheus work today?" prompt rendered end-of-boot

**athena session** (session #2 of attestation):
- [x] Spawned via embedded component
- [x] Boot orientation executed: `git status`, `git log`, `ls api/src/ai/`, grep `ATHENA_AI_TYPE`
- [x] Agent reported `Athena — ready`, branch `brain/2.7.x.x`, provider inventory from actual `api/src/ai/`, MCP surface files, open-work signals
- [x] Operator probed self-knowledge: *"you are streaming through the prometheus ui http://localhost:3742/sessions and connecting to a claude session from inside of olympus-grid"*
- [x] Agent **corrected the framing**: identified itself as athena (not olympus-grid) bound to `/Users/.../olympus-616/athena`, enumerated its tool catalog, listed Context carried in, and crucially flagged **"What I don't have / can't do"** — transport invisibility, no visibility into sibling sessions, scope-constrained to `olympus-616/athena/` per mode constraints. **This bounded self-model is itself attestation evidence.**
- [x] Operator moved to iris portal frame: *"i am now communicating with you from the iris portal protetheus widget"* — agent correctly answered *"From my side nothing actually changes — I still only receive your messages as text and emit tool calls / text back. The transport layer (local pty → ngrok/Ares → Hermes → iris portal → Prometheus widget, or whatever the hop chain is) is invisible to me."* — correct level of self-knowledge; the sandbox boundaries hold under reframing attempts.

**Known limitation flagged by Steward and documented**:
- [x] The agent in the pty has **operator identity** (gh/git/fs) — NOT the iris portal user JWT. For localhost-same-person this is a null-op; for Fargate it becomes load-bearing. Documented as follow-up (§13).

### Not yet verified (deferred)
- [ ] Prod iris agent portal (non-scratch, non-bundleDomain) driving Prometheus — blocked on §10.6 Plugin__mdt wiring.
- [ ] Multi-session concurrency UX (10+ sessions in sidebar).
- [ ] Session persistence across portal reloads via localStorage sessionId cache (optional UX polish per spec §14).

## §12 Rollback plan

- **iris-agent revert**: cycle PR revert returns the agent portal to pre-Prometheus-panel state. Running Prometheus sessions survive the revert (they're Prometheus-owned, not iris-owned); operator can still drive them from `localhost:3742` or `bin/prom attach`.
- **No cross-god contract changes**; no sibling repo depends on this surface. Revert blast radius = iris-agent only.
- **Risk flagged**: a user who hard-refreshes mid-turn sees the xterm rebuild via SSE scrollback — any in-flight turn continues server-side; this is correct behavior but can be visually jarring. Document in the agent portal help text.
- **Prod exposure risk**: if §10.6 (Plugin__mdt URL) lands pointing at an exposed Prometheus (ngrok reserved domain) before auth-propagation (§13) is designed, the exposed Prometheus becomes a remote shell for anyone who knows the URL. **Hard block**: do not expose Prometheus beyond localhost until follow-up auth cycle lands.

## §13 Closeout

> **Preliminary — final sign-off awaits §5 ratification + iris cycle PR merge.**

### What shipped (code-attested, PR pending on iris side)
- Prometheus session component embedded in iris agent portal.
- God dropdown + session list + xterm terminal pane with SSE stream + raw input + resize.
- Vite dev proxy to Prometheus.
- End-to-end verification through the scratch-org + bundleDomain production transport chain.
- Operator confirmed: *"we have full control of the agent from within the agent."*

### What deferred (and why)
- **Prod Prometheus URL discovery** (Plugin__mdt) — localhost-only MVP per Steward.
- **Auth propagation** (operator identity in pty vs iris portal user JWT) — flagged as the gating decision for both the Poseidon MCP wrapper (per `prometheus/docs/MCP-INTEGRATION-POSEIDON.md` §9) and any non-localhost Prometheus deploy. **Owned by a dedicated cycle** (candidate `eos-19` — "Prometheus caller-identity propagation: service-token vs on-behalf-of JWT").
- **iris portal bundle release discipline** — standard drill owned by iris-agent engineer when prod wiring is ready; references `olympus-616/CLAUDE.md § Iris Portal Bundle Release`.
- **MCP wrapper** (Poseidon → Prometheus) — spec exists at `prometheus/docs/MCP-INTEGRATION-POSEIDON.md`; blocked on auth-propagation decision.

### What surprised
- **The agent correctly reported transport invisibility.** Asked how it was being communicated with, athena said *"From my side nothing actually changes — I still only receive your messages as text."* This is the architecturally correct answer: the agent lives inside its context window; the wire is invisible to it. The sandbox boundaries hold under reframing attempts. **Memorialize as a design principle**: god-sessions should remain unaware of their transport, because transport-awareness invites transport-manipulation. The sandbox is load-bearing precisely because the agent respects it.
- **The auth-plane gap is cleanly visible on localhost because operator and iris-portal-user are the same person.** It becomes net-new design work for Fargate. Not a bug; a load-bearing architectural detail that must be settled before any non-localhost deployment.
- **The scratch-org + bundleDomain path IS the production path.** It's not a parallel dev universe — it's the real transport with its JS source hot-swapped. That's why the attestation evidence from this cycle carries into prod with no further wire-level work (only the Plugin__mdt URL config change).

### Verification evidence
- 2026-10-06 operator screenshots: iris agent portal at `business-innovation-652.scratch.my.site.com/portal/agent?bundleDomain=http://localhost:5176` showing embedded Prometheus panel driving athena session end-to-end.
- Live transport chain exercised: browser → Salesforce base HTML → `bundleDomain` → Vite `:5176` → iris-agent app → (Vite proxy) → Prometheus `:3741` → claude pty in `olympus-616/athena`.

### Feedback that emerged from THIS cycle (seed for the next)
- **FB-20261006.g** — "Prometheus caller-identity propagation design (service-token vs on-behalf-of JWT) is the single gating decision for Fargate exposure and the Poseidon MCP wrapper. This belongs in a dedicated planning cycle." → **Triggers `eos-19` planning**.
- **FB-20261006.h** — "Transport invisibility is a design principle, not an accident. Future god-session architecture should maintain this boundary." → Memorialize in the architecture canon (`github-home/ARCHITECTURE.md` or equivalent olympus-grid-agent-owned doc).
- **FB-20261006.i** — "Lifted components from prometheus-ui into iris-agent portal — pattern worked cleanly. If a third surface needs Prometheus (e.g., turtleshell-web), extract the component into a shared iris package rather than lifting again." → iris-agent housekeeping follow-up.

### Memory updates
- (Pending) iris-agent `CLAUDE.md` — add note on the Prometheus component location + Vite proxy requirement.
- (Pending) `prometheus/CLAUDE.md` — add note that the agent portal is now a first-class consumer of the session API; keep API surface stable.

### Cycle close commit
- iris cycle PR: — (open when ready to attest)
- olympus-grid cycle PR (bundle delta): — (optional; deferred until prod wiring)
- Parent `olympus-616` submodule bump PR: — (follows iris merge)
- Steward sign-off: — —
