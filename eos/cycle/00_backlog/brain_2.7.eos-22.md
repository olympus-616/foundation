---
pitch: "Ares answers CVEs in under a day — automatically"
---

# I attest Ares has a documented CVE-to-rule authoring workflow with <24h fleet-push latency, an automated detection → containment chain that fires without a human-approval gate on named attacker classes, and at least one published `T_detect` number per named class.

> File: `brain_2.7.eos-22.md`
>
> **Scope origin:** [`kronos/findings/F-2026-10-22-eos-backlog-from-first-reckoning-week.md`](../../../../kronos/findings/F-2026-10-22-eos-backlog-from-first-reckoning-week.md) items 3 (ingress-WAF-rule authoring workflow for Ares — Vercel-shape capability), 4 (automated detection → containment chain in Ares), 9 (`T_detect` statistic for high-privilege operations). Kronos admissions K-C4 (Node.js Brotli reckoning — Vercel's same-day WAF rollout as the capability shape to build toward) + K-C6 (ARTEX / Storm-0940 reckoning — ingress-WAF rules as attacker-cadence containment; `O-ATTACKER-CADENCE` oracle subtest b).
>
> **Why one cycle, not three:** all three items are Ares response-posture infrastructure — authoring workflow + automation + measurement. The workflow produces rules, the automation fires rules, the measurement reports whether the rule fired in time. Three slices of one pipeline, not three unrelated attestations.

| | |
|---|---|
| **Branch family** | `brain/2.7.x.x` |
| **Cycle ordinal** | `eos-22` (second Kronos-handoff cycle on 2.7 family) |
| **Status** | `Draft — Pre-§5.` §1–§5 Steward-authored; §6–§13 agent-decomposed from the findings. |
| **Opened** | 2026-10-22 |
| **Closed** | — |
| **Prior cycle** | `brain_2.7.eos-21` (Kronos-handoff peer — runtime hygiene). Logical dependency: `brain_2.7.eos-1` (HUD — Ares policy overlay + kill switches architecturally exist); this cycle operationalizes them. |
| **Theme** | Ares operational response posture pipeline. Three slices: (A) ingress-WAF-rule authoring workflow — on-call rotation + rule template + fleet-push mechanism + rollback, with a documented <24h CVE-to-deployed-rule SLA; (B) automated detection → containment chain — on documented anomaly, containment action fires without human-approval gate (human informed, not consulted); (C) one published `T_detect` number for one Kronos-named attacker class (ARTEX-style password spray OR PaaS-class credential-envelope breach OR agentic reconnaissance pattern — pick one at §5-ratification). |
| **Feedback inputs** | Kronos findings F-2026-10-22 items 3 / 4 / 9; K-C4 Node Brotli reckoning (Vercel capability shape); K-C6 ARTEX reckoning (`O-ATTACKER-CADENCE` subtest b) |
| **Estimated effort** | Medium. Slice A is process + templates. Slice B is middleware wiring. Slice C is instrumentation + one SOQL/log analysis pass. |
| **Actual effort** | — |

---

# § Steward-authored (top half)

## §1 User story

> *Steward placeholder — edit when §5-ratifying.*
>
> As the **Olympus-Grid operator on-call for an in-flight exploit**, I want **a documented path from "upstream CVE published" to "detection rule deployed on every cluster" that completes in under 24 hours, with the detection→containment path automated end-to-end for named attacker classes**, so that **the Pantheon's time-to-containment is bounded by a stated SLA, not by whether a human is awake**.

## §2 Acceptance criteria

- **§2.1 (CVE → rule in <24h).** A documented workflow exists in `ares/docs/response-posture.md` (new) covering: who's on-call, how to author a rule from a CVE record, how to push it to every cluster, how to roll it back. Rehearsal: a synthetic CVE walks the entire chain in <24h with wall-clock evidence captured in §13.
- **§2.2 (Automated detection → containment).** `O-ATTACKER-CADENCE` subtest b passes under rehearsal — every named containment path (ban-IP, rate-limit tighten, kill-switch flip) executes within its stated latency bound, with no human-approval gate. The human is informed via the alert channel from §2.1's workflow.
- **§2.3 (Published `T_detect`).** For the chosen attacker class, a dated `T_detect` number is published in `ares/docs/response-posture.md § T_detect` with the methodology: Plutus `LedgerEntry__c` emission + Ares middleware instrumentation + chosen attacker signature → measured latency from signature-match to containment-action.

## §3 Non-functional requirements

- **Latency bound:** detection → containment under 60 seconds for ingress-side signatures (ban-IP, rate-limit tighten); under 5 minutes for policy-overlay rule push to the fleet.
- **Blast radius:** every automated containment action has a documented rollback path (unban-IP, rate-limit restore, kill-switch unflip) + a per-action attestation row in Plutus so the operator can audit automated actions post-hoc.
- **Observability:** every containment-action emits a `api.audit.containment.*` family event (depends on `brain_2.7.eos-14` for the api.audit.* vocabulary).
- **False-positive discipline:** the automation triggers on named attacker classes only — never on "unusual" without a signature. Steward signs each new class off at §5.

## §4 Feedback inputs

| Source | Signal |
|---|---|
| [`kronos/findings/F-2026-10-22-eos-backlog-from-first-reckoning-week.md`](../../../../kronos/findings/F-2026-10-22-eos-backlog-from-first-reckoning-week.md) items 3 / 4 / 9 | Kronos's enumerated backlog for K-C4 + K-C6 primitives |
| K-C4 Node.js Brotli reckoning 2026-10-22 | Vercel's same-day WAF-rule rollout = the capability shape |
| K-C6 ARTEX / Storm-0940 reckoning 2026-10-22 | `O-ATTACKER-CADENCE` subtest b posture gap |

## §5 Steward approval gate

- [ ] Story locked
- [ ] Criteria locked (§2.1 / §2.2 / §2.3)
- [ ] NFRs locked
- [ ] Attacker class chosen for Slice C (ARTEX-password-spray / PaaS-credential-envelope / agentic-recon)
- [ ] On-call rotation defined (Slice A §5 dependency)
- [ ] Approved to execute — signed: **___** **___**

---

# § Agent-authored (bottom half)

## §6 Layer impact map

| Slice | Ares | Plutus | docs |
|---|---|---|---|
| A (authoring workflow) | `ares/api/src/policy/` rule template; fleet-push mechanism | — | `ares/docs/response-posture.md` (new) |
| B (automated containment) | `ares/api/src/middleware/` detection + containment chain; kill-switch wiring | `LedgerEntry__c` emission on every containment action (`api.audit.containment.*`) | — |
| C (`T_detect`) | middleware instrumentation for signature-match → action latency | SOQL + log analysis against chosen attacker class | `ares/docs/response-posture.md § T_detect` |

## §7 Schema deltas

- Depends on `brain_2.7.eos-14` for `api.audit.*` event vocabulary. If this cycle lands first, hold evidence collection for §9.e until eos-14 ships.

## §8 Service contracts

- No wire changes to external surfaces.
- Internal: Ares middleware adds containment-action attestation calls to Plutus — same shape as existing `LedgerEntry__c` emission.

## §9 Telemetry assertions (the close-out gate)

- **§9.a (Slice A rehearsal).** A synthetic CVE walks the authoring workflow in <24h; wall-clock evidence rows (CVE received → rule authored → PR opened → merged → deployed to every cluster) each dated in §13.
- **§9.b (Slice B rehearsal — `O-ATTACKER-CADENCE` subtest b).** Each named containment path executes within its stated latency bound against a synthetic trigger; evidence = Plutus `LedgerEntry__c` row per containment action with action latency in the Props blob.
- **§9.c (`T_detect` published).** `ares/docs/response-posture.md § T_detect` carries at least one dated measurement for the chosen attacker class; measurement methodology is reproducible from the doc alone.
- **§9.d (Zero false positives).** During the §9.b rehearsal, zero containment actions fire against legitimate traffic in the shadow-mode run (before promote).
- **§9.e (Depends on eos-14).** Every containment-action emission has `EventType__c LIKE 'api.audit.containment.%'` and carries the full eos-13 trace. Hold evidence until eos-14 lands.

## §10 Execution plan

1. **§5 ratification** (story + criteria + NFRs + attacker-class choice + on-call rotation). Blocker: §5.
2. **Slice A — authoring workflow doc + rule template.** `ares/docs/response-posture.md`. Blocker: §10.1.
3. **Slice A rehearsal.** Walk a synthetic CVE through the full chain; capture wall-clock evidence. Blocker: §10.2.
4. **Slice B — containment-chain wiring.** `ares/api/src/middleware/` + Plutus attestation calls. Shadow-mode first, then promote. Blocker: §10.1 + depends on eos-14 for api.audit.* namespace.
5. **Slice B rehearsal (`O-ATTACKER-CADENCE` subtest b).** Each containment path exercised; latencies captured. Blocker: §10.4.
6. **Slice C — `T_detect` measurement.** Chosen attacker-class signature instrumented; SOQL/log analysis; publish number. Blocker: §10.4.
7. **§9 verification** → §13 closeout.

## §11 Verification protocol

- **Without iPhone:** entire cycle is CI + ares middleware instrumentation + SOQL + synthetic traffic generation.
- **With iPhone:** none required.

## §12 Rollback plan

- Slice A: doc + templates are reversible via git-revert.
- Slice B: containment chain promote-gate is a config flag; flip to shadow mode (log only, no action) if false-positive rate climbs.
- Slice C: measurement doc is append-only; prior numbers stay as historical reference.

## §13 Closeout

*Filled at close.*

### Cycle close commit
- (TBD)
- Steward sign-off: **___** **___**
