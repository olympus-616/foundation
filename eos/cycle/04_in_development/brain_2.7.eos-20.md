---
pitch: "Session telemetry and operator feedback become attested memory"
---

# I attest Argos v2 captures session telemetry and Delphi collects operator feedback — both land as evidence Aeon can learn from, with the feedback loop closing from browser → ledger → agent memory.

> File: `brain_2.7.eos-20.md` — twentieth primary EOS cycle on the `brain/2.7.x.x` family.
>
> **Opened:** 2026-10-20. Authored by Merlyn (advisor) to close a governance gap identified in the 2026-10-20 feature-to-attestation audit: Delphi feedback + session logging + Argos v2 all shipped as Active functionality with no cycle card scoping them.
>
> **Observed in-flight:** Argos PR #13 (v2 prototype — search, signals, rules, policy-driven storage) merged 2026-09-28. Delphi admin viewer flagged "buggy" by Steward in platform-review 2026-10-20.

| | |
|---|---|
| **Branch family** | `brain/2.7.x.x` |
| **Cycle ordinal** | `eos-20` (twentieth primary on 2.7 family) |
| **Status** | `Draft — Pre-§5.` Retroactive governance card for already-shipped functionality; §5 ratification pending. |
| **Opened** | 2026-10-20 |
| **Closed** | — |
| **Prior cycle** | `brain_2.7.eos-19` |
| **Theme** | Session telemetry (Argos) + operator feedback (Delphi) + the learning loop that connects them. Already-shipped functionality formalized under a cycle so §9 assertions and remaining stability work can be tracked. |
| **Feedback inputs** | 2026-10-20 Steward platform-review: Delphi admin viewer "buggy" (state display inconsistencies + session-viewer performance under concurrent telemetry); argos v2 shipped but ungoverned |
| **Estimated effort** | TBD — scope depends on §5 ruling on whether Delphi stability is in-scope or a sibling card |

---

# § Steward-authored (top half)

## §1 User story

> *Pre-drafted by Merlyn; Steward ratifies at §5.*

- §1.1 As the **olympus-grid operator** I want **every agent session's trace captured by Argos** (search, signals, rules, policy-driven storage) so that **I can review what happened without re-running the session**.
- §1.2 As the **operator** I want **a Delphi feedback surface** where I can mark session excerpts for memory rehydration so that **good agent behavior accumulates and bad behavior gets corrected without my repeating the same note each time**.
- §1.3 As the **Aeon operator** I want **the feedback loop closed** — Delphi captures → ledger records → agent memory rehydrates — so that **the platform literally learns from me across sessions**.

## §2 Acceptance criteria

- §2.1 **Given** an agent session completes, **when** Argos receives its trace, **then** a searchable record exists with the full event stream + metadata (sessionId, god, operator, timestamps) and the session log carries `argos.ingest.ok` with the record ID.
- §2.2 **Given** the Delphi admin viewer loads, **when** the operator opens any session, **then** the viewer renders without the state-display inconsistencies observed 2026-10-20 and does not degrade under concurrent telemetry loads.
- §2.3 **Given** the operator submits feedback via Delphi, **when** the record posts, **then** a `Feedback__c` row writes to Salesforce + a Plutus `delphi.feedback.submitted` event fires with the correlated sessionId.
- §2.4 **Given** feedback accumulates for a given agent, **when** that agent starts a new session, **then** rehydration surfaces the relevant feedback as part of boot context (via memory primitive or system-prompt append).

## §3 Non-functional requirements

- **Cycle latency:** Argos ingest p95 < 500ms; Delphi admin viewer first-paint < 1s even with 100+ concurrent sessions in buffer.
- **Decoupling:** Delphi admin viewer must decouple from the core agent UI (observed 2026-10-20 bleed into the agent UI). Separate route, separate state, separate bundle entry.
- **Observability:** every Argos ingest + Delphi submit carries `cycleId` matching the originating agent session.
- **Privacy:** feedback payloads opt-in-only for sensitive content; redaction markers survive the write.

## §4 Feedback inputs

| Source | Signal |
|---|---|
| 2026-10-20 Steward platform-review | Delphi admin viewer flagged "buggy — state display inconsistencies + session-viewer performance under concurrent telemetry; needs decoupling from core agent UI" |
| argos PR #13 (merged 2026-09-28) | v2 prototype — search, signals, rules, policy-driven storage; no card scoped this ship |
| 2026-10-20 feature-to-attestation audit | Governance gap: Delphi + Argos Active in production without a cycle card |

## §5 Steward approval gate

- [ ] Story locked
- [ ] Criteria locked
- [ ] NFRs locked (Delphi decoupling non-negotiable per operator report)
- [ ] Argos v2 PR #13 retroactively acknowledged in-scope
- [ ] Approved to execute — signed: **___** **___**

---

# § Agent-authored (bottom half)

## §6 Layer impact map

| Criterion | argos | iris agent plugin | olympus-grid (Apex) | hermes / ares | plutus |
|---|---|---|---|---|---|
| §2.1 | ingest + search endpoints | — | — | ingest routing | event emission |
| §2.2 | — | Delphi viewer refactor; decouple from agent UI | — | — | — |
| §2.3 | — | feedback submit UI | `Feedback__c` SObject + handler | POST route | event emission |
| §2.4 | — | memory rehydration hook | — | — | memory primitive integration |

## §7 Schema deltas

- Possibly `Feedback__c` SObject (if not already present); confirm against olympus-grid metadata.
- Possibly `AgentSession__c` or similar to pair feedback with session trace.
- Validate against hestia/mnemosyne memory primitives (see memory `project_v176_identity_memory.md`).

## §8 Service contracts

- `POST /v1/argos/ingest { sessionTrace }` → stores + returns recordId
- `GET /v1/argos/search?q=&god=&operator=` → paginated session list
- `POST /v1/delphi/feedback { sessionId, excerpt, note, markers }` → stores + emits plutus event
- `GET /v1/delphi/sessions/:id` → full session trace for viewer

## §9 Telemetry assertions

- `argos.ingest.ok` fires on every session end with `{recordId, sessionId, god, operatorId}`.
- `delphi.viewer.load` fires on admin-viewer mount, carries render-timing in ms.
- `delphi.feedback.submitted` fires on every submit, carries `{sessionId, feedbackId, markerCount}`.
- `memory.rehydrate.applied` fires at agent boot when prior feedback surfaces in context.
- Zero occurrences of the state-display inconsistency the Steward reported 2026-10-20 (requires reproducer identification).

## §10 Execution plan

1. Reproducer for the Delphi state-display bug (Steward-observed 2026-10-20). Pin exact failure mode.
2. Decouple Delphi admin viewer from core agent UI (separate route, state slice, bundle entry).
3. Verify Argos v2 ingest + search endpoints are callable from the fleet (PR #13 shipped but observability gap exists).
4. Wire Delphi feedback submit → `Feedback__c` + Plutus event emission.
5. Wire memory rehydration hook so prior feedback surfaces at agent boot.
6. Smoke tests + §9 telemetry capture.

## §11 Verification protocol

- Open Delphi admin viewer under 100-concurrent-session simulated load; verify render-time + no inconsistencies.
- Submit feedback → curl SOQL `SELECT * FROM Feedback__c WHERE Session_Id__c = :sid` → row exists.
- Start new session with same god → verify boot context includes prior feedback.

## §12 Rollback plan

- Feature-flag Delphi viewer; fallback to prior stable version if the refactor regresses.
- Argos v2 already in prod; rollback = pin to prior argos commit if needed (unlikely).

## §13 Closeout

> Filled at end of cycle.

---

## References

- argos PR #13: https://github.com/olympus-616/argos/pull/13 (merged 2026-09-28, `13a91fa`)
- Memory: `project_v176_identity_memory.md` + mnemosyne per-agent-memory per-agent-memory-isolation (`481b96b`)
- 2026-10-20 Steward platform-review (feature-to-attestation audit) — this card is its direct output
