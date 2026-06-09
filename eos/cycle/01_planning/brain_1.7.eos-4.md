# How does EOS-3 safely arrive in production

> File: `brain_1.7.eos-4.md`

| | |
|---|---|
| **Branch family** | `brain/1.7.x.x` |
| **Cycle ordinal** | `eos-4` (4th on this branch family) |
| **Status** | `Planning` — Steward authoring §1-§5. Cycle does NOT enter `04_in_development/` until EOS-3 reaches `06_shipped/` (single-open-cycle global mutex). |
| **Opened** | 2026-06-09 |
| **Closed** | — |
| **Prior cycle** | `brain_1.7.eos-3` (the void → omens iPhone reproducibility cycle) |
| **Theme** | The productionization of the EOS-3 path — how does the void→omens-iPhone slice safely become a production capability anyone can lean on |
| **Feedback inputs** | TBD — populated from EOS-3 §13 closeout + §1.1-deviation bug accumulator |
| **Estimated effort** | TBD |
| **Actual effort** | — |

> **What EOS-4 is (the productionization half of the EOS-1→4 culmination):**
>
> EOS-3 proves the path exists in development: void → scratch org → spawned Pantheon cluster → omens on iPhone running against it. **EOS-4 carries that same path safely into production.**
>
> The full culmination across EOS-1 + EOS-2 + EOS-3 + EOS-4 is:
>
> - the olympus-grid node
> - the spawned olympus pantheon
> - the gpt language to access it
> - the omens game to utilize it
> - the iris portal to support it
> - the turtleshell-web and turtleshell-ios to demonstrate it
>
> **— fully backed, A to Z, for a sovereign AI system to run with or without the Steward. Requires Salesforce for now.**
>
> EOS-4 is what makes "with or without the Steward" actually true — the production-grade promotion path, recovery posture, and operational discipline that mean a dust dancer can stand up their own grid and trust it.

---

# § Steward-authored (top half)

## §1 User story

*Steward authors after EOS-3 closes and EOS-3's §13 surfaces what "production" actually means for each layer of the void→omens-iPhone path.*

> Anticipated shape:
> As **the Steward — and any dust dancer who chooses to run their own grid** I want **the EOS-3 path (void → spawned cluster → omens on iPhone) promoted from a development capability to a production capability** so that **anyone holding the source can stand up a sovereign grid that they trust will keep running with or without the Steward's intervention**.

## §2 Acceptance criteria

*PENDING — Steward to draft after EOS-3 §13 closeout. Likely shapes:*

- Promotion path for the olympus-grid node from scratch org → production org (managed package install, sandbox→prod, alpha→beta→release).
- Promotion path for the AWS Pantheon cluster (dev cluster spawn → production cluster spawn, including SSM secret distribution, CDN posture, alarm wiring).
- omens iPhone artifact: TestFlight → App Store distribution.
- Recovery / continuity posture: what happens when the Steward is unavailable.

## §3 Non-functional requirements

*PENDING.*

## §4 Feedback inputs

*PENDING — populated from EOS-3 §13 closeout. Will include the §1.1-deviation bug rows EOS-3 accumulated but deferred, prioritized for production safety.*

## §5 Steward approval gate

- [ ] Story locked (§1)
- [ ] Criteria locked (§2)
- [ ] NFRs locked (§3)
- [ ] Approved to execute — signed: **{Steward initials}** **{date}**

> *Single-open-cycle global mutex:* EOS-4 cannot enter `04_in_development/` until EOS-3 reaches `06_shipped/`. Until then this doc lives in `01_planning/` and the Steward iterates §1-§5 in place.

---

# § Agent-authored (bottom half)

*§6-§13 PENDING. Decomposition begins after §5 sign-off AND EOS-3 closure.*

## §6 Layer impact map
*PENDING.*

## §7 Schema deltas
*PENDING.*

## §8 Service contracts
*PENDING.*

## §9 Telemetry assertions
*PENDING.*

## §10 Execution plan
*PENDING.*

## §11 Verification protocol
*PENDING.*

## §12 Rollback plan
*PENDING.*

## §13 Closeout
*PENDING.*
