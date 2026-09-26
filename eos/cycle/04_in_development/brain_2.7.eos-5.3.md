# Canonical agent-design docs port — `OLYMPUS_AGENT_MVP.md` + `OLYMPUS_BRAIN_ARCHITECTURE.md` + `TEMPLEATHENA_KEY_MANAGEMENT.md` missing from working branch

> File: `brain_2.7.eos-5.3.md` — third sub-attestation of `brain_2.7.eos-5` (brain-genesis). Scope: three canonical agent-design docs live on the stale `olympus-agent-mvp` branch (2026-08-21) and have NOT been ported to the current working branch `iris_2_7_consolidation`.
>
> Source: Steward agent-entry-point survey 2026-09-25 (ITEM 3).

| | |
|---|---|
| **Branch family** | `brain/2.7.x.x` |
| **Cycle ordinal** | `eos-5.3` — third sub of brain-genesis. |
| **Status** | `In Development` — the three docs referenced in prior memory are NOT on `iris_2_7_consolidation`. They live on stale `olympus-agent-mvp` (2026-08-21). Current branch is the canonical direction, but the design docs never made the crossing. |
| **Opened** | 2026-09-25 |
| **Prior cycle** | `brain_2.7.eos-5` (brain-genesis primary — the docs describe what brain-genesis attests) |
| **Theme** | Port three canonical design docs from `olympus-agent-mvp` branch to `iris_2_7_consolidation` (or their eventual cycle branch). Design docs may have superseded content — Steward-review needed. |
| **Feedback inputs** | Steward survey 2026-09-25 (ITEM 3); prior memory referring to the three docs; olympus-brain-spec at `olympus-grid/docs/olympus-brain-spec-athena-2.7-2026-09-01.md` is the newer primary contract |
| **Owner** | iris-agent (per prior Steward assignment) |
| **Estimated effort** | S — cherry-pick / port three docs from `olympus-agent-mvp` branch; commit; include in PR #135 or a follow-up PR. |
| **Actual effort** | — |

---

## §1 User story

- **§1.1** As **the Brain-Genesis attestation loop** I want **`OLYMPUS_AGENT_MVP.md`, `OLYMPUS_BRAIN_ARCHITECTURE.md`, and `TEMPLEATHENA_KEY_MANAGEMENT.md` present on the working branch** so that **the canonical design intent is legible next to the code that implements it, not stranded on a stale branch**.
- **§1.2** As **the Steward** I want **a review pass on the ported docs vs. the newer primary contract** (`olympus-brain-spec-athena-2.7-2026-09-01.md`) **before landing** so that **superseded content is dropped, not silently carried forward as canon**.

## §2 Acceptance criteria

- **§2.1 (Three docs ported)** — `iris/docs/OLYMPUS_AGENT_MVP.md` + `iris/docs/OLYMPUS_BRAIN_ARCHITECTURE.md` + `iris/docs/TEMPLEATHENA_KEY_MANAGEMENT.md` all present on the working branch.
- **§2.2 (Steward review vs. superseding spec)** — each ported doc reviewed against `olympus-grid/docs/olympus-brain-spec-athena-2.7-2026-09-01.md`; contradictions marked as superseded OR the older doc content updated.
- **§2.3 (Ship-with-PR-#135 OR follow-up PR)** — Steward decides port-into-#135 vs. separate follow-up.

## §5 Steward approval gate

- [ ] Port authorized — cherry-pick from `olympus-agent-mvp` branch
- [ ] Review-vs-newer-spec disposition (drop-as-superseded / update / carry-forward)
- [ ] Ship location — PR #135 OR follow-up PR
- [ ] Approved to execute — signed: **__________** **__________**

## §6 Layer impact

Single-repo (iris) — `iris/docs/*` only. No code changes.

## §9 Telemetry assertions

- **§9.DOC-1** — Three docs present on `iris` working branch; grep confirms.
- **§9.DOC-2** — Each doc's TOC / front matter is intact post-port (no cherry-pick corruption).

## §10 Execution plan

1. **§5 approval** on port + ship location + spec-conflict disposition.
2. **Cherry-pick / port** three docs from `olympus-agent-mvp` branch.
3. **Review-and-update** where the newer primary contract (`olympus-brain-spec-athena-2.7-2026-09-01.md`) has superseded content.
4. **Commit + ship** per §5 ruling.
5. **§13 closeout.**

## §12 Rollback

Revert the docs commit; docs re-strand on `olympus-agent-mvp`.

## §13 Closeout

*Filled at end of cycle.*

---

## References

- **Primary umbrella:** [`brain_2.7.eos-5.md`](brain_2.7.eos-5.md) — Brain-Genesis
- **Newer superseding contract:** `olympus-grid/docs/olympus-brain-spec-athena-2.7-2026-09-01.md`
- **Stale source branch:** `olympus-agent-mvp` (2026-08-21)
- **Templeathena keys sibling:** [`brain_2.7.eos-5.4.md`](brain_2.7.eos-5.4.md) — the third of the three docs is the design target of that ticket
- **Source:** Steward agent-entry-point survey 2026-09-25 (ITEM 3)
