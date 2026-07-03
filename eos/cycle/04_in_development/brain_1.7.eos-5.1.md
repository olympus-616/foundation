# Globally deployable — alongside Apple's channels

> File name: `brain_1.7.eos-5.1.md` — sub-ordinal opened parallel to `brain_1.7.eos-5` so the EOS-5 shape is preserved while the compliance chain runs alongside.

| | |
|---|---|
| **Branch family** | `brain/1.7.x.x` |
| **Cycle ordinal** | `eos-5.1` (sibling to `eos-5`, parallel-open per Steward direction 2026-06-30) |
| **Status** | `Draft` — awaiting Steward §1-§5 authoring |
| **Opened** | 2026-06-30 |
| **Closed** | — |
| **Prior cycle** | `brain_1.7.eos-5` (parent theme — financial-integrity attestation on the alpha-org platform; 5.1 rides parallel, not sequential) |
| **Theme** | Compliance-ready-globally — the operational backstop for launching `guardians-of-olympus-ai` on Apple's global channels 2026-07-17 |
| **Feedback inputs** | Steward direction 2026-06-30 (verbatim): *"note the following doc out of scope of eos-5 but needed as soon as possible after... potentially eos-6? we attest we can be deployed globally alongside apple's channels etc"* + *"dont lose the shape of eos-5.  just maybe create this as eos-5.1 in the planning column or something?  the wider we can open the gate the faster we can attract the miracle"* |
| **Estimated effort** | TBD by Steward at §5 approval — source doc estimates ~70h Steward + ~40h cross-agent + ~€800/yr recurring vendor cost, spread across a 3-week T-timeline |
| **Actual effort** | — |

---

## Source specification

The canonical scope for this cycle already exists as a comprehensive companion doc:

**[`foundation/GUARDIANS-LAUNCH-COMPLIANCE.md`](../../../GUARDIANS-LAUNCH-COMPLIANCE.md)** — 1017 lines, authored 2026-06-30 by the `guardians-of-olympus` agent. Status inside that doc: OPENED, parked pending Steward activation.

It covers:
- **§0** 20-item critical-path checklist with owners/effort/costs/deadlines
- **§1** Compliance philosophy — CloudPremise LLC as data controller; every subprocessor named
- **§2** EU/UK GDPR — Art. 27 EU Representative + UK Representative, ICO registration, subprocessor DPAs, DPIA, RoPA, breach response, age-of-consent matrix per member state
- **§3** Global regimes — CCPA (California), LGPD (Brazil), PIPEDA + Law 25 (Canada/Québec), APPI (Japan), PIPA (South Korea), DPDP Act 2023 (India), APPs (Australia), nFADP (Switzerland); China + Russia + US-sanctioned jurisdictions deselected
- **§4** App Store Connect — Privacy Nutrition Label alignment, 12+ age rating, custom EULA URL, IAP products, distribution deselection matrix
- **§5** Cross-agent handoffs to `omens` (delete-my-account, age gates, ATT, data portability, subscription disclosure)
- **§6** Cross-agent handoffs to `iris` (`publishGuardians` script + `Plugin.iris_deployment_path_guardians`)
- **§7** In-app compliance surfaces (Privacy + Terms pages already deployed)
- **§8** Contact inbox provisioning via Cloudflare Email Routing (privacy@, support@, legal@, dpo@, press@)
- **§9** Tithe ledger URL decision (recommended `/tithe` on marketing site)
- **§12** Placeholder replacement matrix for `iris/reactforce/guardians-of-olympus-ai/src/lib/site-info.ts`
- **§13** Timeline synthesized backwards from 2026-07-17 (T-45 → T-30 → T-21 → T-14 → T-7 → T-3 → T=0)
- **§14** SOC-2 mapping — every workstream tied to Trust Services Criteria IDs

## Timing envelope (as of doc scaffold — 2026-06-30)

- **Launch**: 2026-07-17 = **17 days out**
- **T-14 milestone**: 2026-07-03 (3 days) — App Store Connect listing config + nutrition label + omens delete-my-account + age enforcement
- **T-7 milestone**: 2026-07-10 (10 days) — Submit for App Review
- **T-21 items** (EU/UK Rep signed, ICO registered, subprocessor DPAs, DPIA, RoPA, breach plan): were nominally due 2026-06-26 — currently unowned

## Why this doesn't map to a single existing EOS card

The compliance chain touches fragments of EOS-7 (rights response, least privilege), EOS-8 (global App Store reach), EOS-10 (subprocessor secrets not committed), EOS-11 (Steward not a data handler / DPO architecture), EOS-12 (payment providers), plus SOC-2 controls throughout. Rather than shatter it across five future cards, EOS-5.1 becomes the coordinating governance artifact — the single doc under which the launch compliance chain closes, referencing GUARDIANS-LAUNCH-COMPLIANCE.md as the executable spec.

## Relationship to EOS-5

EOS-5 remains the financial-integrity-of-olympus-grid attestation on builtsy + templeathena + iris. Its shape and close-criteria are untouched by this scaffold. EOS-5.1 opens the gate wider — parallel workstream on the compliance backstop needed for the July launch, so both can complete on their own tempo without one blocking the other. This continues the multi-open-cycle relaxation precedented 2026-06-10 (EOS-3 + EOS-4 in `04_in_development` simultaneously) and 2026-06-27 (EOS-5 + eos-5b-triage both in `01_planning`).

Patent claim #6 (single-open-cycle mutex) is preserved by single-Steward hand-coherence rather than structural folder mutex; strict form re-engages under republic-616.

---

# § Steward-authored (top half)

## §1 User story

*Steward to author. Suggested framing based on source doc:*

> As **CloudPremise LLC** we want **every compliance obligation named in the deployed Privacy Policy + Terms of Service to be operationally true** so that **Guardians of Olympus: Omens can ship on Apple's global channels on 2026-07-17 without legal, regulatory, or platform-review risk.**

## §2 Acceptance criteria

*Steward to author. Suggested seed from GUARDIANS-LAUNCH-COMPLIANCE.md §0 critical-path checklist — each line item becomes an observable acceptance criterion.*

## §3 Non-functional requirements

*Steward to author. Candidate NFR spine:*
- **Legal** — no regulator exposure in any jurisdiction the app is distributed to; sanctioned/excluded jurisdictions provably deselected
- **Cost budget** — annual recurring vendor spend under ${TBD}
- **Timeline** — every T-milestone in the compliance doc hit on or before its date
- **Traceability** — every subprocessor named in the Privacy Policy has a countersigned DPA on file
- **Reversibility** — takedown / distribution-suspension procedure documented for each regulator

## §4 Feedback inputs

| FB# | Title | Body excerpt |
|-----|-------|--------------|
| — | Steward 2026-06-30 (parked-doc note) | *"note the following doc out of scope of eos-5 but needed as soon as possible after... potentially eos-6? we attest we can be deployed globally alongside apple's channels etc"* |
| — | Steward 2026-06-30 (slotting decision) | *"dont lose the shape of eos-5.  just maybe create this as eos-5.1 in the planning column or something?  the wider we can open the gate the faster we can attract the miracle"* |

## §5 Steward approval gate

- [ ] Story locked
- [ ] Criteria locked
- [ ] NFRs locked
- [ ] Approved to execute — signed: **{Steward initials}** **{date}**

---

# § Agent-authored (bottom half — DO NOT populate until §5 is signed)

Sections §6-§13 are held blank per EOS discipline: no decomposition, execution plan, telemetry assertions, or rollback until the Steward has locked §1-§5. When §5 signs, the agent-half will be authored against GUARDIANS-LAUNCH-COMPLIANCE.md as the executable spec.
