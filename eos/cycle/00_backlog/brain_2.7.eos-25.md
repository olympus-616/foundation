---
pitch: "Athena notices when a model stops acting like itself"
---

# I attest Athena emits drift-detection signals against baseline model-output behavior, with at least one monitored anomaly class and a demonstrated detection of synthetic drift.

> File: `brain_2.7.eos-25.md`
>
> **Scope origin:** [`kronos/findings/F-2026-10-22-eos-backlog-from-first-reckoning-week.md`](../../../../kronos/findings/F-2026-10-22-eos-backlog-from-first-reckoning-week.md) item 10 (behavioral anomaly monitoring at Athena — model output drift). Kronos admission K-C5 (PyTorch autograd representational-equivalence reckoning 2026-10-22 — indirect LLM-model-weight supply chain primitive). This cycle is the *inference-layer* response to K-C5; the upstream *model-weight attestation* half is covered as deliberate deferral in `brain_2.7.eos-26.md`.
>
> **Why this stands alone:** Athena-specific instrumentation. Pairs ideologically with eos-26 (upstream deferral) but ships independently — this one is actionable from the Olympus-Grid side, eos-26 is not.

| | |
|---|---|
| **Branch family** | `brain/2.7.x.x` |
| **Cycle ordinal** | `eos-25` (fifth Kronos-handoff cycle on 2.7 family) |
| **Status** | `Draft — Pre-§5.` §1–§5 Steward-authored; §6–§13 agent-decomposed from the findings. |
| **Opened** | 2026-10-22 |
| **Closed** | — |
| **Prior cycle** | `brain_2.7.eos-24` (Kronos-handoff peer — envelope-key entropy audit). Logical neighbor: `brain_2.7.eos-26.md` (K-C5 upstream deferral — this cycle is the Olympus-Grid-actionable half). |
| **Theme** | Baseline model-output behavior sampling at Athena + drift-detection logic + alert integration. Even without being able to attest upstream model weights (eos-26 defers that), Athena can detect that a model has started producing systematically-different outputs than its baseline — or has started emitting high-entropy token sequences uncorrelated with the prompt. One anomaly class is enough to attest the pattern; subsequent classes ride downstream cycles. |
| **Feedback inputs** | Kronos findings F-2026-10-22 item 10; K-C5 PyTorch autograd reckoning 2026-10-22 (indirect LLM-model-weight supply chain) |
| **Estimated effort** | Medium. Baseline sampling + drift logic + Hermes/Plutus alert integration + synthetic-drift rehearsal. |
| **Actual effort** | — |

---

# § Steward-authored (top half)

## §1 User story

> *Steward placeholder — edit when §5-ratifying.*
>
> As the **Olympus-Grid operator depending on upstream LLM providers whose model weights I cannot personally attest**, I want **Athena to detect when a given model's outputs drift systematically from its baseline — unusual token-entropy, unusual response-length distribution, unusual topic/sentiment pattern against a known prompt corpus** — so that **a model-weight compromise, a provider-side silent model-swap, or a provider-side policy change manifests as an alert at the inference layer, not as a user complaint six months later**.

## §2 Acceptance criteria

- **§2.1 (One monitored anomaly class).** Athena samples one baseline model-output characteristic — Steward chooses at §5: candidates include token-entropy distribution, response-length distribution against a reference prompt corpus, or sentiment-direction skew against a reference prompt corpus.
- **§2.2 (Baseline sample size).** The baseline is sampled over at least N calls to the chosen model (N bounded at §5 — plausibly 1,000) with per-call props captured for the chosen anomaly class. Baseline statistics (mean, stddev or appropriate shape) are published to a committed doc.
- **§2.3 (Drift detector).** A detector fires an `athena.drift.detected` event when the running-window statistic diverges from baseline by a §5-ratified threshold (e.g., >3σ for a continuous metric, chi-squared for a distributional metric).
- **§2.4 (Synthetic-drift rehearsal).** The detector is exercised against a synthetic drift (e.g., inject a prompt-rewrite that systematically shifts outputs — then revert) and fires the event when drift is present, does not fire when drift is absent. Evidence captured as a dated row in §13.
- **§2.5 (Alert integration).** On `athena.drift.detected`, an alert fires to the Steward-chosen channel from eos-22's response-posture workflow (if eos-22 has shipped; otherwise a direct alert channel is wired here as a stub).

## §3 Non-functional requirements

- **Observability:** `athena.drift.*` family (depends on `brain_2.7.eos-14` for the Plutus event vocabulary — if eos-14 hasn't landed, event emission is a stub; this cycle still closes on criteria §2.1–§2.4 with §2.5 as evidence-pending).
- **Privacy:** baseline sampling captures the metric only, never the raw prompt or response. Prompt corpus for drift rehearsal is a committed test fixture, not real user prompts.
- **Latency:** detector runs out-of-band; detection latency bounded at the running-window size (e.g., 60-second rolling window → detection within ~60s of drift onset). No per-turn critical-path cost.
- **False-positive discipline:** threshold chosen at §5 is tuned to <1 false-positive-per-week in baseline conditions; evidence captured in §13.

## §4 Feedback inputs

| Source | Signal |
|---|---|
| [`kronos/findings/F-2026-10-22-eos-backlog-from-first-reckoning-week.md`](../../../../kronos/findings/F-2026-10-22-eos-backlog-from-first-reckoning-week.md) item 10 | Kronos's enumerated backlog for the K-C5 indirect exposure |
| K-C5 PyTorch autograd reckoning 2026-10-22 | Primitive admission — upstream model-weight supply chain |

## §5 Steward approval gate

- [ ] Story locked
- [ ] Criteria locked (§2.1 / §2.2 / §2.3 / §2.4 / §2.5)
- [ ] NFRs locked (false-positive discipline + privacy posture)
- [ ] Anomaly class chosen (token-entropy / response-length / sentiment-skew / other)
- [ ] Baseline sample size N chosen
- [ ] Drift threshold chosen
- [ ] Approved to execute — signed: **___** **___**

---

# § Agent-authored (bottom half)

## §6 Layer impact map

| Slice | Athena | Plutus | Hermes | fixtures |
|---|---|---|---|---|
| Baseline sampling | `athena/api/src/` baseline-sampler module | `LedgerEntry__c` emission per sample (if volume reasonable) OR aggregate rollup | — | reference prompt corpus (committed test fixture) |
| Drift detector | `athena/api/src/` detector module running on a rolling window | `athena.drift.detected` emission (depends on eos-14 namespace) | alert routing on detection | — |

## §7 Schema deltas

- Depends on `brain_2.7.eos-14` for `athena.drift.*` event vocabulary.

## §8 Service contracts

- No wire changes to external surfaces. Internal: Athena emits detector events to Plutus.

## §9 Telemetry assertions (the close-out gate)

- **§9.a (Baseline published).** Committed baseline doc with the chosen metric's statistics against N samples; dated.
- **§9.b (Detector in-band).** Running the Athena service produces at least one `athena.drift.*` event per rolling window (even if detector-value is below threshold — "no drift" is still a heartbeat); SOQL confirms rows exist.
- **§9.c (Synthetic-drift rehearsal fires).** Synthetic drift inject → detector fires `athena.drift.detected` within one rolling window → revert → detector returns to no-drift state within one rolling window. Dated evidence in §13.
- **§9.d (False-positive baseline).** During a 7-day no-drift baseline run, zero (or <1) `athena.drift.detected` events fire. Evidence row in §13.
- **§9.e (Alert integration).** On `athena.drift.detected` during the synthetic rehearsal, an alert lands in the Steward-chosen channel. Dated evidence.

## §10 Execution plan

1. **§5 ratification** (anomaly class + N + threshold). Blocker: §5.
2. **Baseline sampler** — Athena-side sampling module + reference prompt corpus fixture. Blocker: §10.1.
3. **Baseline collection run** — N samples captured; statistics published. Blocker: §10.2.
4. **Drift detector** — rolling-window logic + emission + alert integration. Blocker: §10.3.
5. **Synthetic-drift rehearsal** — inject + verify fires + revert + verify stops. Blocker: §10.4.
6. **7-day baseline false-positive run.** Blocker: §10.4.
7. **§9 verification** → §13.

## §11 Verification protocol

- **Without iPhone:** entirely Athena instrumentation + synthetic prompt injection + Plutus SOQL.
- **With iPhone:** none required.

## §12 Rollback plan

- Baseline sampler: toggle off via config flag; zero runtime impact disabled.
- Detector: toggle off via config flag; alert integration quiesces.

## §13 Closeout

*Filled at close.*

### Cycle close commit
- (TBD)
- Steward sign-off: **___** **___**
