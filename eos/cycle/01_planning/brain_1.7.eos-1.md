# Portal lifecycle + cycle tracking infrastructure

> File: `brain_1.7.eos-1.md`

| | |
|---|---|
| **Target version** | `brain/1.7.x.x` |
| **Status** | `Draft — awaiting Steward §1-5` |
| **Opened** | 2026-05-24 |
| **Closed** | — |
| **Prior version** | `brain/1.7.16` (last shipped state of `brain/1.7.x.x`) |
| **Theme** | Eos Cycle Visibility
| **Feedback inputs** | FB#8 · FB#9 · FB#10 · FB#11 · FB#12 · FB#14 · FB#17 · FB#19 |
| **Estimated effort** | ~10h (5h portal fixes + 5h cycle tracking) |
| **Actual effort** | — |

> **Why this is EOS-001:** the first eos cycle describes the entire stable applicaiton, across all repositories, as a starting baseline of system functionality.

> **System Architecture:**
[Current State]
- State of the system as of 20260524 in brain/1.7.x.x repositories.
- Can be filled in with additional details as necessary.

[Intended Future State] (all work in this eos cycle must move towards this future state)
[Olympus-Grid]
- Olympus-Grid serving production apple sign-in and email sign-in for Olympus-Grid Portal, Turtleshell.ai (web and ios), Guardians of Olympus (ios). Identity__c table goes live in Production as of 7/17.
- Package decomposed to Salesforce native package and anything else moved to package extension or alpha org developmed non-namespaced olympus-grid plugin.  No need to update the managed package each eos cycle and we should decouple this while preserving the integrity of a salesforce managed package that can be the front door from enterprise users.  Olympus-Grid salesforce managed package should be re-deployed to AppExchange but decoupled from the olympus-616 fleet code.
- Iris Portal (npm run publishPortal)
- Iris Turtleshell Plugin with Salesforce MCP support (npm run publishTurtleshell)

[Olympus-616]
- Pantheobn deployed to production aws.  it is currently running only one aws node at api-int.turtleshell.ai but this needs to be updated by launch to be globally scalable across a vertically and horizontally scaled fargate implementation.

[Athena]
- Production Ready CloudPremise LLC keys with full plutus traceability
- BYOK Injection
- Production Ready cosmos-logos signing

[Poseidon]
- Weather
- Salesforce
- Olympus-Grid

[Omens]
- iOS application
- parenting portal (iris portal app deployed at guardians-of-olympus.ai or equivalent site url)

[Olympus-GPT]
- Developer Flow sign-up
- Beta services only (email verificaiton jwt, developer token, llm, tts, text-to-music, chronos tasks and tasks lists, proteus key value)
- developer key quotos and throughput controls

[Turtleshell]
- ios, web
- email sign in, apple sign in
- full plutus tracking
- full entitlement working

[Iris]
- admin portal (app.olympus-grid.com) (npm run publishPortal)
- service desk (service.olympus-grid.com, global help desk)
- parenting portal (guardians-of-olympus.ai)
- olympus-gpt (olympus-gpt.ai)
- turtleshell salesforce toolbar (npm run publishTurtleshell)

-------------------------
- Out of Scope Currently
[Turtleshell-Offgrid]
- Platform running on local fleet with BYOK
[Omens]
- any platoform other than android
[Turtleshell-Android]

---

# § Steward-authored (top half)

> **Steward**: fill §1-§5 below, then tick the gate in §5. Agent will not touch the top half once you mark it locked.

## §1 User story

<!-- Write the user-facing story. Example shape:
> As a **{role}** I want **{capability}** so that **{outcome}**.

Multiple stories with the same theme are fine — number them §1.1, §1.2, etc. -->

> As alchemisthomer (super admin) I am able to request the alchemisthomer.sh to execute a full feedback loop of the omens game architecture so that we can finish the feedback cycle.  There are numerous feedbacks attached to this ticket that should be closed, and in the end of this cycle we should be able to see, in the development environment only, a plutus session log, uploaded to the feedback api, of which all of the tracked issues are no longer visible and we have >85% of the log containing structured and useful data for the future AI triage and automated improvement.  The log should trace each event, http request and resonse, and each ai prompt and response.  Log shoudl be able to be back correlated in the plutus log, the inboudn api log, and any other persistent data within salesforce.  The salesfroce scratch org can be emptied of data and you can create a test user and test jwt of your own to complete the cycle analyis.

## §2 Acceptance criteria

<!-- Each criterion: Given/When/Then with a session-log post-condition.
Example seeds based on the bundled feedback — refine, add, or replace as you see fit:-->

- §2.1 Given a fresh library load, when the player walks into a portal that has no target scene wired,
       then nothing happens visually, the player is not teleported into the void,
       AND the session log contains zero `scene.library.portal.misconfigured` events for that walk.

- §2.2 Given the player is standing at position P near Athena's statue when they walk in,
       when they exit Athena's chat interface,
       then the player respawns at position P (not at the library default spawn).

- §2.3 Given the player is running in a generated world,
       when they walk through the return portal back to the library,
       then they appear at the library spawn position standing still (idle animation, zero velocity).

- §2.4 Given the player walks NEAR the wandering Logos turtle,
       when their distance to Logos's CURRENT position drops below the proximity threshold,
       then the Logos dialogue panel opens — regardless of where Logos spawned.

- §2.5 Given the backend (ngrok / Ares / Athena) becomes unreachable mid-session,
       when any god call fails with a network/timeout error,
       then a recovery banner appears with Retry + Back-to-Library buttons,
       AND auto-retries on a backoff schedule with a visible countdown.

- all activity in feedback log is attributatble to the system activity, no missing data
- all activity is salesforce tables is correctly attributable to the ativity from the feedback log, creating a fully traceable link of what data exists and why.  No system activity without explaination or attribution.
- system fully able to be cost accounted for based upon the feedback session log.
- we should continue iterating this cycle until the feedback cycle is complete and ai is fully able to simulate, track, monitor, diagnose, and recommend improvements to the system based upon observing telemetry data that is coming from the front end clients and tracing it all the way through the backend, where we can properly allocate cost at every level of the architecture.  Only until this cycle is completely visible to AI (Claude in this case) to trace the entire system archtiecture from beginning to end (game --> api --> pantheon --> grid) will athena be able to make the proper decisions on how to evolve the system once we provide her with all of this information.

  To match the user story's "AI can fully simulate, track,
  monitor, diagnose, and recommend":

  - §2.N (process criterion) — Given I run the headless
  play-driver against an empty scratch, when the loop completes, then ≥85% of events in the captured session log carry structured props AND zero of the bundled FB#-targeted bugs reproduce.
  - §2.N+1 — Given the captured session log, when I write a
  single SOQL that joins LedgerEntry__c.RequestId__c to the
  log's requestId entries, then every shell movement in the
  cycle attributes to an action in the log.
  - §2.N+2 — Given a server-side log line from any Pantheon
  service, when I grep its requestId, then I find the
  corresponding HTTP envelope in the client log AND a
  Feedback__c.RequestId__c (if the action ultimately created a
  Feedback row).


## §3 Non-functional requirements

<!-- Suggested NFRs for this cycle — edit freely: -->

- **Observability**:
  - Every action in this cycle traceable end-to-end from omens client log → Ares/Hermes/Athena server log → Plutus ledger → Salesforce.

- **Compatibility**:
  - Existing Athena/Chronos/Logos content events (Events.AthenaQuerySent, etc.) continue to fire UNCHANGED

- **Privacy**:
  - requestId is opaque (16-hex random) — no PII
  - Email logged as emailDomain only (existing discipline)
  - Truncation caps preserved on all content events (existing
  Log.Trunc)

- **Performance**:
  - omens client: cycle open/close is < 5ms (no main-thread frame drops).

> *(awaiting Steward — edit/extend the NFRs above as desired)*

## §4 Feedback inputs

These are the Feedback__c rows / TaskList items this cycle closes. Steward, edit to add/remove.

| FB# | Title | Disposition |
|-----|-------|-------------|
| FB#8 | Identity__c.Name auto-fill from Email__c | **Close in this cycle** |
| FB#9 | Logos dialogue trigger stuck at spawn position | **Close in this cycle** |
| FB#10 | God interfaces return player to library spawn, not to where they entered | **Close in this cycle** |
| FB#11 | Apollo intro box — replace Greek/English with repeatable example + clear-on-focus | **Close in this cycle** |
| FB#12 | Portal returns to library carry over velocity — should land at spawn, idle stance | **Close in this cycle** |
| FB#14 | Stub portals fire `portal.misconfigured` — leave player "running in the void" | **Close in this cycle** |
| FB#17 | Hermes send success — clear the form + show a clear toast | **Close in this cycle** |
| FB#19 | Backend-unreachable UI has no recovery — looks like a crash | **Close in this cycle** |
| FB#13 | Chronos +List / +Task buttons hidden + modal eaten by iOS keyboard | **Defer to EOS-{TBD}** (UI redesign, own cycle) |
| FB#15 | IAP/StoreKit + Plutus purchase cycle telemetry incomplete | **Defer to EOS-002 payment-readiness** |
| FB#18 | Poseidon UI fragility — broken scroll, type box + speak button get occluded | **Defer to EOS-{TBD}** (UI redesign, own cycle) |
| FB#20 | Wallet shows tier="free" forever — never reflects Beachcomber subscription | **Defer to EOS-002 payment-readiness** |

## §5 Steward approval gate

- [x] Story locked
- [x] Criteria locked
- [x] NFRs locked
- [x] Feedback inputs confirmed
- [x] **Approved to execute** — signed: @alchemisthomer

---

# § Agent-authored (bottom half)

> **Agent**: fill §6-§13 below ONLY after Steward ticks all of §5. Iterate sections back to Steward for refinement; do NOT begin executing §10 until Steward signs the approval line in §5.

## §6 Layer impact map

*(awaiting §5 approval before drafting)*

## §7 Schema deltas

*(awaiting §5 approval before drafting — preliminary sketch:)*

- **`Identity__c.Name`** trigger logic — `IdentityTrgHnd.onBeforeInsert/onBeforeUpdate` auto-fills from `Email__c`.

## §8 Service contracts

*(awaiting §5 approval before drafting — preliminary sketch:)*

## §9 Telemetry assertions

*(awaiting §5 approval before drafting — preliminary sketch:)*

## §10 Execution plan

*(awaiting §5 approval)*

## §11 Verification protocol

*(awaiting §5 approval)*

## §12 Rollback plan

*(awaiting §5 approval)*

## §13 Closeout

*(filled at end of cycle)*
