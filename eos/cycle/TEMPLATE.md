# {short title}

> File name: `brain_{major.minor}.eos-{N}.md` — the Nth EOS cycle on the `brain/{major.minor}.x.x` deployment branch family.

| | |
|---|---|
| **Branch family** | `brain/1.7.x.x` |
| **Cycle ordinal** | `eos-N` (Nth on this branch family) |
| **Status** | `Draft` / `In Steward Review` / `Approved-Awaiting-Execution` / `Executing` / `Verifying` / `Shipped` / `Aborted` |
| **Opened** | YYYY-MM-DD |
| **Closed** | YYYY-MM-DD (or `—`) |
| **Prior cycle** | `brain_{major.minor}.eos-{N-1}` (the cycle this one builds on; `—` if first on the branch) |
| **Theme** | one-line summary (e.g., "portal lifecycle + cycle tracking infrastructure") |
| **Feedback inputs** | `FB#N`, `FB#M`, … |
| **Estimated effort** | Nh |
| **Actual effort** | Nh (filled at closeout) |

---

# § Steward-authored (top half)

## §1 User story

> As a **{role}** I want **{capability}** so that **{outcome that matters}**.

(Multiple stories are fine if they share one theme. Number them §1.1, §1.2, …)

## §2 Acceptance criteria

Each criterion must be observable end-to-end. Prefer Gherkin (Given/When/Then) and include the **post-condition in the session log or Salesforce data**.

- §2.1 **Given** {setup} **when** {action} **then** {observable outcome} **and** the session log carries `{specific event signature}`.
- §2.2 …

## §3 Non-functional requirements

- **Cycle latency budget** — p50/p95 budgets for the full chain
- **Cost budget** — shells or cents per cycle ceiling
- **Observability** — every action in this cycle traceable end-to-end via `CycleId` from client log → server log → Plutus ledger
- **Compatibility** — what stays working (existing clients, prior session schemas)
- **Privacy** — what's NOT logged or persisted
- **Performance** — frame budgets, memory ceilings, network call counts

## §4 Feedback inputs

| FB# | Title | Body excerpt |
|-----|-------|--------------|
| FB#N | … | … |

## §5 Steward approval gate

- [ ] Story locked
- [ ] Criteria locked
- [ ] NFRs locked
- [ ] Approved to execute — signed: **{Steward initials}** **{date}**

---

# § Agent-authored (bottom half)

## §6 Layer impact map

For each acceptance criterion, list every layer it touches.

| Criterion | Salesforce (olympus-grid) | Pantheon services | omens (Godot) | turtleshell-web | iris portal | SDK / protocol |
|-----------|---------------------------|-------------------|---------------|-----------------|-------------|----------------|
| §2.1 | … | … | … | (delegated to cosmicturtle agent) | (delegated to iris agent) | … |
| §2.2 | … | … | … | … | … | … |

## §7 Schema deltas

- **SObjects**: new fields, new objects, picklist additions, permset updates
- **Plugin__mdt** route or trigger registrations
- **Server-side data models** (Plutus tables, MCP namespaces, etc.)

## §8 Service contracts

For every API change, document the wire shape. Use the existing HTTP envelope convention (`method`, `url`, `status`, `ms`, `respBytes`, `requestId`, plus `X-Cycle-ID`).

```
POST /v1/...
  Headers: X-Cycle-ID, X-Request-ID, x-user-identity
  Body: { ... }
  Returns: { ... }
```

## §9 Telemetry assertions (the close-out gate)

Concrete log-line signatures that MUST appear in the next play cycle's session log. If they don't, the cycle isn't closed.

- `Events.{EventName}` with prop `{specific value}` must fire when {trigger}.
- Zero occurrences of `{deprecated event}` after this cycle.
- Every HTTP envelope in the cycle must carry `cycleId` prop matching the trace.
- Plutus ledger SOQL `SELECT * FROM LedgerEntry__c WHERE Cycle__c = :cycleId` returns N rows for an N-action cycle.

## §10 Execution plan

Ordered task list with cross-layer dependencies surfaced.

1. **Schema** — deploy {fields} to dev_enterprise. (block: nothing)
2. **Server handlers** — extend {classes}. (block: §10.1)
3. **omens client** — wire {scenes/controllers}. (block: §10.2)
4. **End-to-end probe** — curl + apex anonymous. (block: §10.2)
5. **iPhone deploy** — `tools/ios-deploy.sh` IF needed. (block: §10.3 + §10.4)
6. **Verify telemetry assertions** — pull next session log, grep for §9 signatures.

## §11 Verification protocol

### Without iPhone
- Godot desktop simulator: how to repro each criterion
- curl probes: exact commands against `dev_enterprise` scratch
- apex anonymous: validation scripts

### With iPhone (only if §10 requires)
- Steward steps: what to tap/walk through
- Expected session-log signatures

## §12 Rollback plan

If something goes sideways mid-execution:
- **Schema**: which fields can be safely left in place vs need destructive deploy
- **Server**: which apex classes can revert
- **Client**: git revert the omens commits cleanly

## §13 Closeout

Filled at end of cycle. Doc goes immutable after this.

### What shipped
- …

### What deferred (and why)
- …

### What surprised
- …

### Verification evidence
- Link to / paste the session log excerpts that prove §9 assertions held.
- Link to SF report / SOQL that proves §7 schema changes work.

### Feedback that emerged from THIS cycle (seed for the next one)
- FB#X — …
- FB#Y — …

### Memory updates
- Added `~/.claude/.../memory/{file}.md` capturing {pattern}
- Updated `CLAUDE.md` § {section}

### Cycle close commit
- Branch / PR link
- Steward sign-off: **{Steward initials}** **{date}**
