---
pitch: "Every image signed; every poisoned dep heard"
---

# I attest every pushed Pantheon ECR image carries a valid Cosign signature plus SLSA provenance attestation in Rekor, and an alert fires within one hour of any Pantheon-dependency package being reported as compromised by GitHub Advisory, Socket, or Aikido.

> File: `brain_2.7.eos-23.md`
>
> **Scope origin:** [`kronos/findings/F-2026-10-22-eos-backlog-from-first-reckoning-week.md`](../../../../kronos/findings/F-2026-10-22-eos-backlog-from-first-reckoning-week.md) items 7 (ECR image signing with Cosign + SLSA provenance), 8 (supply-chain compromise alert pipeline). Kronos admission K-C8 (LiteLLM supply-chain reckoning 2026-10-22 — admission that the build-pipeline-to-ECR hop and the dependency-ingest hop are both unattested surfaces).
>
> **Why one cycle, not two:** both items are "supply-chain integrity for the Pantheon." Image signing proves what we built; compromise alerting proves we would notice if what we built was built from poisoned source. Two halves of one assurance pattern.

| | |
|---|---|
| **Branch family** | `brain/2.7.x.x` |
| **Cycle ordinal** | `eos-23` (third Kronos-handoff cycle on 2.7 family) |
| **Status** | `Draft — Pre-§5.` §1–§5 Steward-authored; §6–§13 agent-decomposed from the findings. |
| **Opened** | 2026-10-22 |
| **Closed** | — |
| **Prior cycle** | `brain_2.7.eos-22` (Kronos-handoff peer — response-posture pipeline). Logical neighbor: `cand-l.md` (production state reproducible + version-provenanced — this cycle operationalizes the provenance half of that claim). |
| **Theme** | Pantheon supply-chain integrity. Two slices: (A) **Cosign + SLSA provenance** — the build-pipeline (GitHub Actions → ECR) emits signatures + attestations to Rekor; ECS task-definition optionally gates on verification. OIDC-authenticated CI is already in place (good credential posture); this adds the artifact-attestation layer. (B) **Compromise alert pipeline** — automated alert on any `package-lock.json` surface package being reported as compromised by GHSA / Socket / Aikido / similar sources. |
| **Feedback inputs** | Kronos findings F-2026-10-22 items 7 / 8; K-C8 LiteLLM supply-chain reckoning 2026-10-22 |
| **Estimated effort** | Medium. Slice A is a CI pipeline extension with Cosign + Rekor wiring. Slice B is monitoring workflow + alert integration. |
| **Actual effort** | — |

---

# § Steward-authored (top half)

## §1 User story

> *Steward placeholder — edit when §5-ratifying.*
>
> As the **Olympus-Grid operator attesting production integrity**, I want **every Pantheon image to carry cryptographic proof of its build provenance, and an alert to fire the moment any package the Pantheon ingests is reported as compromised**, so that **a build-pipeline compromise can be detected post-hoc from the registry alone, and a dependency compromise is heard inside the Pantheon within an hour of being published anywhere**.

## §2 Acceptance criteria

- **§2.1 (Cosign signatures).** Every image pushed to ECR by the Pantheon docker-build-push workflows carries a valid Cosign signature verifiable against the fleet signing key (OIDC-authenticated via GitHub Actions keyless or a dedicated KMS key — Steward chooses at §5).
- **§2.2 (SLSA provenance).** Every image push emits an SLSA Level-2 (or higher) provenance attestation to Rekor; attestation includes builder-identity, source-repo SHA, build-trigger identity.
- **§2.3 (Optional ECS verification gate).** If Steward signs the verification-gate box at §5: the ECS task-definition rejects an image pull whose signature does not verify. If Steward does NOT sign that box: §2.1 + §2.2 attest produced evidence without blocking runtime (pure observability). Either path closes §9.a + §9.b.
- **§2.4 (Compromise alert <1h).** An alert channel receives a notification within one hour of any `package-lock.json`-surface package being reported as compromised by GHSA / Socket / Aikido. Rehearsal: a synthetic compromise report triggers the alert end-to-end.

## §3 Non-functional requirements

- **Cost:** Cosign + Rekor is free. SLSA attestation adds ~30s per build. Monitoring is RSS / webhook — zero marginal $ per advisory. Any paid source (Socket Pro, Aikido commercial) requires separate Steward sign.
- **Observability:** every image push emits `cluster.deploy.pantheon.image.signed` + `cluster.deploy.pantheon.image.attested` events (depends on `brain_2.7.eos-14` for cluster.* namespace).
- **Compatibility:** signatures + attestations are additive — images pulled without verification continue to work during Slice-A rollout.
- **Privacy:** compromise monitoring reads public advisories only; local dependency inventory never leaves the Pantheon.

## §4 Feedback inputs

| Source | Signal |
|---|---|
| [`kronos/findings/F-2026-10-22-eos-backlog-from-first-reckoning-week.md`](../../../../kronos/findings/F-2026-10-22-eos-backlog-from-first-reckoning-week.md) items 7 / 8 | Kronos's enumerated backlog for the K-C8 primitive |
| K-C8 LiteLLM supply-chain reckoning 2026-10-22 | Admission that the two hops (build→ECR + dependency ingest) are unattested |
| `cand-l.md` | Production-state reproducibility claim — this cycle delivers the signed-artifact half |

## §5 Steward approval gate

- [ ] Story locked
- [ ] Criteria locked (§2.1 / §2.2 / §2.3 / §2.4)
- [ ] NFRs locked
- [ ] Signing-key strategy chosen (OIDC-keyless vs KMS-held)
- [ ] ECS verification-gate decision (observability-only vs enforce-on-pull)
- [ ] Approved to execute — signed: **___** **___**

---

# § Agent-authored (bottom half)

## §6 Layer impact map

| Slice | GitHub Actions | ECR / Rekor | ECS (zeus/cdk) | monitoring |
|---|---|---|---|---|
| A (Cosign + SLSA) | `.github/workflows/*.yaml` Pantheon docker-build-push workflows — add Cosign sign + SLSA attestation generator steps | signatures land in ECR; attestations land in Rekor | `zeus/cdk/lib/cluster-stack.ts` — optional verify-on-pull gate | — |
| B (compromise alerting) | monitoring workflow or external monitor | — | — | GHSA RSS + Socket webhook + Aikido webhook + Steward alert channel |

## §7 Schema deltas

- Depends on `brain_2.7.eos-14` for cluster.deploy.pantheon.image.* event vocabulary.

## §8 Service contracts

- No wire changes.

## §9 Telemetry assertions (the close-out gate)

- **§9.a (Slice A sign).** Pull any 10 recent Pantheon images; Cosign verify returns PASS for all 10.
- **§9.b (Slice A attest).** Pull SLSA provenance for the same 10 from Rekor; builder-identity + source-SHA match the actual GitHub Actions run that built them.
- **§9.c (Slice A gate — if signed at §5).** Deploy a deliberately-unsigned test image to ECS; task-definition pull fails with signature-verification error.
- **§9.d (Slice B rehearsal).** Synthetic compromise advisory in a monitored source triggers the alert channel within one hour; evidence row in §13.
- **§9.e (Depends on eos-14).** Every image push emits a `cluster.deploy.pantheon.image.*` row with signature/attestation state in Props.

## §10 Execution plan

1. **§5 ratification** (criteria + signing-key + verification-gate decisions). Blocker: §5.
2. **Slice A pilot god** — pick one god, wire Cosign + SLSA into its build workflow, verify end-to-end. Blocker: §10.1.
3. **Slice A fleet sweep** — same pattern for all Pantheon docker-build-push workflows. Blocker: §10.2.
4. **Slice A ECS gate (if signed at §5).** Update zeus/cdk cluster-stack to verify-on-pull. Blocker: §10.3.
5. **Slice B monitoring stand-up.** GHSA RSS poller + Socket/Aikido webhook receivers + alert integration. Rehearsal with synthetic advisory. Blocker: parallel to §10.2–§10.4.
6. **§9 verification** → §13.

## §11 Verification protocol

- **Without iPhone:** entirely CI + Rekor query + synthetic-advisory rehearsal.
- **With iPhone:** none required.

## §12 Rollback plan

- Slice A sign + attest: additive — disabling leaves prior images unsigned but running.
- Slice A ECS gate: config flag; flip off to accept any image during an incident.
- Slice B: disable the monitoring workflow; no runtime impact.

## §13 Closeout

*Filled at close.*

### Cycle close commit
- (TBD)
- Steward sign-off: **___** **___**
