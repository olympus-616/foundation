---
pitch: "Prove envelope keys are born from real randomness"
---

# I attest Pantheon cosmos-logos envelope private keys are provisioned from an audited entropy source under every boot condition (cold-start, task-def respawn, cross-AZ failover, Fargate microVM entropy state) with explicit sanity checks against known-weak key ranges.

> File: `brain_2.7.eos-24.md`
>
> **Scope origin:** [`kronos/findings/F-2026-10-22-eos-backlog-from-first-reckoning-week.md`](../../../../kronos/findings/F-2026-10-22-eos-backlog-from-first-reckoning-week.md) item 5 (envelope-key provisioning entropy audit). Kronos admission K-C7 (eMudhra CA root-of-trust reckoning 2026-10-22 — primitive admitted; Node.js CVE-2026-106074 entropy-cache adjacency named).
>
> **Why this stands alone:** small, surgical, and belongs to the key-provisioning path specifically. The audit is 30 minutes of code reading; if it finds a gap, remediation becomes a follow-on. Does not naturally bundle with the fleet-wide hygiene cycle (eos-21) because the subject is one specific primitive (envelope-key generation), not fleet hygiene.

| | |
|---|---|
| **Branch family** | `brain/2.7.x.x` |
| **Cycle ordinal** | `eos-24` (fourth Kronos-handoff cycle on 2.7 family) |
| **Status** | `Draft — Pre-§5.` §1–§5 Steward-authored; §6–§13 agent-decomposed from the findings. |
| **Opened** | 2026-10-22 |
| **Closed** | — |
| **Prior cycle** | `brain_2.7.eos-23` (Kronos-handoff peer — supply-chain). Logical dependency: `brain_1.7.eos-5.11` (Poseidon sovereign-envelope + sealed-credential-at-rest — this cycle audits the key-provisioning path upstream of that attestation). |
| **Theme** | Audit the cosmos-logos private-key provisioning path across every god, under every boot condition, with explicit identification of the entropy source at generation time + sanity checks against known-weak key ranges (small values, repeated patterns). First slice is a 30-minute code audit; remediation is a follow-on cycle only if the audit flags a gap. |
| **Feedback inputs** | Kronos findings F-2026-10-22 item 5; K-C7 eMudhra reckoning (envelope-primitive adjacency); Node CVE-2026-106074 entropy-cache signal (relevant because the Pantheon runs Node 20 which does NOT get the backport — see eos-21 for the LTS upgrade) |
| **Estimated effort** | Small (audit alone, 30 min). Remediation deferred to follow-on cycle if any gap surfaces. |
| **Actual effort** | — |

---

# § Steward-authored (top half)

## §1 User story

> *Steward placeholder — edit when §5-ratifying.*
>
> As the **Pantheon operator attesting that every god's cosmos-logos envelope rests on actual randomness, not seeded or cached entropy**, I want **a documented audit of the entropy source at private-key generation time, under every boot condition, with sanity checks that keys do not fall into known-weak ranges**, so that **a `crypto.randomBytes(32)` call that silently degrades under Fargate microVM entropy pressure or an entropy-cache CVE does not produce a predictable key the Pantheon then uses to seal every subsequent envelope**.

## §2 Acceptance criteria

- **§2.1 (Entropy source identified at generation time).** For every god that provisions a cosmos-logos private key, the generation call site + its underlying entropy source (OS random, hardware RNG, V8 cache state) is documented in `foundation/eos/cycle/notes/envelope-key-entropy-audit-2026-10-22.md` (new; moves to `06_shipped/evidence/` on close).
- **§2.2 (Every boot condition exercised).** The audit covers cold-start, task-def respawn, cross-AZ failover, Fargate microVM entropy state (noted as "fresh microVM" vs "warmed microVM reused"). Each boot condition is a row in the audit doc.
- **§2.3 (Known-weak sanity checks).** The audit includes an inline check: for 100 freshly-generated keys (per god), none fall into known-weak key ranges — zero all-zero, zero all-one, zero sequential-pattern, zero repeated-byte-pattern. Evidence row with the 100-sample histogram per god.
- **§2.4 (Gap → follow-on).** If any boot condition flags an entropy gap, this cycle's §13 explicitly names the follow-on cycle that must be opened for remediation. This cycle itself closes on the audit evidence alone.

## §3 Non-functional requirements

- **Non-destructive:** read-only audit. No key-regeneration, no cert rotation.
- **Private-key handling:** sampled keys for the 100-sample histogram are generated to ephemeral buffers, hashed for the histogram, and zeroed. Raw key material never persisted to disk, never logged.
- **Reproducible:** the 30-minute audit methodology is captured in the audit doc so future kronos-wake rechecks can rerun it exactly.
- **Observability:** no runtime instrumentation added — this is a point-in-time audit.

## §4 Feedback inputs

| Source | Signal |
|---|---|
| [`kronos/findings/F-2026-10-22-eos-backlog-from-first-reckoning-week.md`](../../../../kronos/findings/F-2026-10-22-eos-backlog-from-first-reckoning-week.md) item 5 | Kronos's enumerated backlog for the K-C7 primitive |
| K-C7 eMudhra reckoning 2026-10-22 | Primitive admission; names Node CVE-2026-106074 adjacency |
| `brain_1.7.eos-5.11` | Poseidon sovereign-envelope attestation depends on this upstream audit |

## §5 Steward approval gate

- [ ] Story locked
- [ ] Criteria locked (§2.1 / §2.2 / §2.3 / §2.4)
- [ ] NFRs locked (read-only audit, zeroed sample keys)
- [ ] Audit scope god-list confirmed (every god that holds a cosmos-logos private key)
- [ ] Approved to execute — signed: **___** **___**

---

# § Agent-authored (bottom half)

## §6 Layer impact map

| Slice | Pantheon | zeus/cdk | audit doc |
|---|---|---|---|
| Audit | `*/api/src/cosmos-logos/private-key.ts` provisioning paths across all gods | `zeus/cdk/lib/cluster-stack.ts` — ECS task-definition entropy context (SSM secret injection, Fargate platform-version) | `foundation/eos/cycle/notes/envelope-key-entropy-audit-2026-10-22.md` |

## §7 Schema deltas

- None.

## §8 Service contracts

- None.

## §9 Telemetry assertions (the close-out gate)

- **§9.a (Audit doc complete).** `foundation/eos/cycle/notes/envelope-key-entropy-audit-2026-10-22.md` exists; covers every god in the §5-ratified scope list; each boot condition is a row; each known-weak sanity check is a row.
- **§9.b (100-sample histogram per god).** Each god has a histogram row covering 100 freshly-generated-and-zeroed sample keys with zero all-zero / all-one / sequential / repeated-byte matches.
- **§9.c (Node 20 adjacency called out).** The audit doc explicitly notes which gods are affected by Node CVE-2026-106074 (all of them until eos-21 ships Node LTS upgrade); references eos-21 as the forward dependency.
- **§9.d (No raw key leaked).** `git log` on `foundation/` for the duration of this cycle shows zero commits of key material; `foundation/eos/cycle/notes/` contains only histogram summaries, never raw key bytes.
- **§9.e (Follow-on named if gap found).** Either (a) all boot conditions pass with no gap flagged, or (b) §13 names the follow-on cycle to open for remediation. One or the other, not neither.

## §10 Execution plan

1. **§5 ratification** + god-scope list. Blocker: §5.
2. **Audit doc stub.** Create `envelope-key-entropy-audit-2026-10-22.md` with per-god + per-boot-condition rows blank. Blocker: §10.1.
3. **Code walk** for every god in scope. Fill the per-god row (entropy source + call site). Blocker: §10.2.
4. **Boot-condition walk.** For each god, exercise cold-start + task-def respawn + cross-AZ failover + Fargate microVM state against the dev/int cluster. Fill the per-boot-condition rows. Blocker: §10.3.
5. **Known-weak sanity histogram.** Per-god 100-sample histogram with ephemeral key generation + hash + zero. Fill the row. Blocker: §10.3.
6. **§13 closeout** + follow-on cycle naming if any gap flagged.

## §11 Verification protocol

- **Without iPhone:** entirely code audit + histogram generation against dev/int cluster.
- **With iPhone:** none.

## §12 Rollback plan

- Not applicable — audit is read-only.

## §13 Closeout

*Filled at close. Includes explicit statement either "every boot condition passed; no follow-on needed" OR "gap found at <god>:<boot-condition>; follow-on cycle `brain_2.7.eos-N.md` opened for remediation."*

### Cycle close commit
- (TBD)
- Steward sign-off: **___** **___**
