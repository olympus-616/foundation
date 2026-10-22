---
pitch: "Pantheon off EOL Node + CVE-watch + regex bounds"
---

# I attest the Pantheon runs no EOL Node across every god Dockerfile, surfaces Node.js / V8 security advisories within one hour of upstream publication, and admits no attacker-reachable `new RegExp()` without a documented bound.

> File: `brain_2.7.eos-21.md`
>
> **Scope origin:** [`kronos/findings/F-2026-10-22-eos-backlog-from-first-reckoning-week.md`](../../../../kronos/findings/F-2026-10-22-eos-backlog-from-first-reckoning-week.md) items 1 (Pantheon Node 20-alpine → supported LTS line upgrade), 2 (automated Node.js / V8 / Pantheon-dependency CVE monitoring), 6 (`new RegExp()` fleet-wide audit — V8 Irregexp subtest-a surface). Kronos admissions K-C4 (PHP2Shell / Node.js Brotli / GitLab Onigmo / NGINX reckonings 2026-10-22) + K-C7 (eMudhra reckoning — Node CVE-2026-106074 entropy-cache signal, which Node 20 EOL will NOT receive a patch for).
>
> **Why one cycle, not three:** all three items share the "Pantheon runtime hygiene" theme — Dockerfile baseline + CVE awareness + fleet-wide code audit against a V8/Node-shaped primitive. Splitting would scatter hygiene across three attestations with partial coverage each.

| | |
|---|---|
| **Branch family** | `brain/2.7.x.x` |
| **Cycle ordinal** | `eos-21` (first Kronos-handoff cycle on 2.7 family) |
| **Status** | `Draft — Pre-§5.` Kronos findings doc ratified as the scope-origin seed; §1–§5 Steward-authored; §6–§13 agent-decomposed from the findings. |
| **Opened** | 2026-10-22 |
| **Closed** | — |
| **Prior cycle** | `brain_2.7.eos-20` (telemetry + feedback — most recent primary). Logical link: `brain_2.7.eos-1` (hostile-universe-defense umbrella — eos-21 is a §9-adjacent hardening item named by Kronos as the actionable gap). |
| **Theme** | Pantheon runtime hygiene. Three slices: (A) upgrade every god Dockerfile off Node 20 EOL to a currently-supported LTS line (22.x or 24.x); (B) stand up automated Node.js / V8 / dependency CVE monitoring with a <1h alert SLA; (C) fleet-wide grep + manual-triage audit of `new RegExp()` call sites, bounding or eliminating every attacker-reachable construction. |
| **Feedback inputs** | Kronos findings F-2026-10-22 items 1 / 2 / 6; K-C4 reckoning wave 2026-10-22 (four separate upstream incidents in one day); K-C7 Node entropy-cache CVE-2026-106074 adjacency |
| **Estimated effort** | Large. Slice A touches ~15 god Dockerfiles; Slice B is one monitoring workflow + alert channel; Slice C is a fleet-wide code audit with per-hit remediation. |
| **Actual effort** | — |

---

# § Steward-authored (top half)

## §1 User story

> *Steward placeholder — edit when §5-ratifying.*
>
> As the **Olympus-Grid operator**, I want **the Pantheon runtime to leave no fleet-wide known-unpatched CVE exposure open longer than one upstream-advisory cycle** so that **the attacker's cost of exploiting a published Node.js, V8, or Pantheon-dependency CVE against the Olympus-Grid Pantheon is bounded by our response posture, not by how fast we happen to be reading Hacker News**.

## §2 Acceptance criteria

- **§2.1 (Node LTS line current).** `grep -rE "FROM node:20" --include="Dockerfile*" .` across every Pantheon god returns zero matches; every `*/api/package.json` `engines.node` field aligns with the Dockerfile FROM line; CI builds green across all gods; `pantheon-up` fleet smoke passes on the new base.
- **§2.2 (CVE alert <1h).** On a published Node.js or V8 security advisory, the Steward-chosen alert channel receives a notification within one hour with the specific CVE record + affected version range. Rehearsal: a synthetic advisory published to a monitored source triggers the alert end-to-end.
- **§2.3 (No unbounded `new RegExp(attacker)`).** Fleet-wide grep for `new RegExp(` returns zero attacker-reachable call sites that lack either (a) a documented input bound (length cap + timeout + complexity analysis), or (b) an architectural reason the input cannot be attacker-controlled (literal, hardcoded enum, admin-only context). Each remaining call site has an inline comment pointing to the bound or the architectural reason.

## §3 Non-functional requirements

- **Compatibility:** no breaking changes to god API surfaces during the Node LTS upgrade; semver-compatible migration or an explicit `BREAKING` note in that god's PR body.
- **Cost budget:** Slice B's monitoring is RSS / GitHub Advisory Database — zero marginal $ per advisory. If a paid feed is proposed, Steward signs separately.
- **Observability:** every Dockerfile change emits a `cluster.deploy.pantheon.image.node_version` event once the cluster.* family lands (depends on `brain_2.7.eos-14`).
- **Privacy:** Slice B does not share dependency inventories externally; monitoring reads public advisories only and matches them against the local `package-lock.json` surface internally.

## §4 Feedback inputs

| Source | Signal |
|---|---|
| [`kronos/findings/F-2026-10-22-eos-backlog-from-first-reckoning-week.md`](../../../../kronos/findings/F-2026-10-22-eos-backlog-from-first-reckoning-week.md) items 1 / 2 / 6 | Kronos's enumerated backlog for the K-C4 + K-C7 primitives |
| K-C4 reckoning wave 2026-10-22 (4 incidents in one day) | PHP2Shell / Node.js Brotli / GitLab Onigmo / NGINX — all name the Pantheon's runtime-hygiene gap |
| K-C7 eMudhra reckoning 2026-10-22 | Node CVE-2026-106074 entropy-cache signal; Node 20 EOL = no backport |

## §5 Steward approval gate

- [ ] Story locked
- [ ] Criteria locked (§2.1 / §2.2 / §2.3)
- [ ] NFRs locked
- [ ] Node LTS target version chosen (22.x vs 24.x)
- [ ] Approved to execute — signed: **___** **___**

---

# § Agent-authored (bottom half)

## §6 Layer impact map

| Slice | Pantheon | CI | monitoring surface |
|---|---|---|---|
| A (Node LTS) | Every god `*/api/Dockerfile` + `*/mcp/Dockerfile`; `*/api/package.json` engines field | Build + push ECR workflows across all gods; `pantheon-up` fleet smoke | — |
| B (CVE monitoring) | — | New workflow or external monitor (nodejs.org/en/security RSS + V8 security tracker + GitHub Advisory Database npm filter) | Steward-chosen alert channel |
| C (RegExp audit) | Fleet-wide grep + per-hit remediation across TS Pantheon services | — | — |

## §7 Schema deltas

- None.

## §8 Service contracts

- No wire changes.

## §9 Telemetry assertions (the close-out gate)

- **§9.a (Slice A).** Zero `FROM node:20` across every tracked Dockerfile; every god's `package.json engines.node` matches its Dockerfile.
- **§9.b (Slice B rehearsal).** A synthetic test advisory in the monitored source triggers the alert channel within one hour, recorded as a dated evidence row in §13.
- **§9.c (Slice C).** Every `new RegExp(` call site in the Pantheon TS surface either eliminated or wrapped in a documented bound; audit log committed as evidence.
- **§9.d (Cross-cycle anchor).** When `brain_2.7.eos-14` lands, every `cluster.deploy.pantheon.image.*` event emitted post-Node-upgrade carries the new node version — SOQL: `SELECT CycleId__c, EventType__c, Props__c FROM LedgerEntry__c WHERE EventType__c = 'cluster.deploy.pantheon.image.node_version' AND CreatedDate > :cycle_closed` returns rows with the current LTS line.

## §10 Execution plan

1. **Node LTS target decision** — Steward signs §5 "Node LTS target version chosen" (22.x or 24.x). Blocker: §5.
2. **Slice A pilot god** — upgrade one god (plutus is a good candidate — most downstream dependencies) and prove `pantheon-up` fleet smoke green against the new base. Blocker: §10.1.
3. **Slice A fleet sweep** — upgrade remaining gods, each as its own PR, same Dockerfile pattern. Blocker: §10.2.
4. **Slice B monitoring stand-up** — GitHub Actions workflow polling the three advisory sources + alert channel wiring. Rehearsal with a synthetic advisory. Blocker: parallel to §10.2–§10.3.
5. **Slice C fleet audit** — grep + triage + remediation, each remediation as its own commit in its god's PR. Blocker: parallel to §10.2–§10.3.
6. **§9 verification** — collect evidence for §9.a / §9.b / §9.c; evidence for §9.d defers until `brain_2.7.eos-14` ships.

## §11 Verification protocol

- **Without iPhone:** entirely CI-side + grep + synthetic-advisory rehearsal.
- **With iPhone:** none required.

## §12 Rollback plan

- Slice A per-god: revert that god's Dockerfile commit; cluster-stack respawns on prior ECR tag. Blast radius = one god.
- Slice B: disable the monitoring workflow; no runtime impact.
- Slice C: per-remediation revert if a bound turns out to break legitimate input.

## §13 Closeout

*Filled at close.*

### Cycle close commit
- (TBD)
- Steward sign-off: **___** **___**
