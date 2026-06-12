# SOC-2 Control Mapping for the EOS Cycle Methodology

> **Status:** OPENED 2026-06-11 by EOS-4.1. Active mapping document — updated as each EOS cycle closes.
>
> **Purpose:** every EOS cycle is, in effect, an exercise of one or more SOC-2 Trust Services Criteria controls. This document defines the **frontmatter convention** by which cycles declare which controls they touch, the **canonical control catalog** the platform attests against, and the **per-cycle backfill table** mapping each shipped cycle to controls covered. The EOS app at `app.olympus-grid.com/eos` reads this mapping to render the auditor dashboard heatmap (`/eos/.../audit`).
>
> **Audit posture:** Cloudpremise LLC is on the path to a Type-1 SOC-2 attestation aligned with the 2026-07-17 launch. This document is intended to be a primary evidence artifact in that attestation — the working narrative-and-evidence map for every applicable control.

---

## 1. The frontmatter convention

Every EOS cycle doc (in any `0N_*/` folder under any kanban root) carries YAML frontmatter at the top of the file:

```yaml
---
controls: [CC1.1, CC7.2, A1.3]      # SOC-2 control identifiers touched by this cycle
attestation_status: in_development   # in_development | verifying | shipped | aborted
prior_cycle: brain_1.7.eos-N.md      # the cycle this one builds on (or "—" if first)
approvers: [G.W.H.]                  # multi-party-ready (republic-616): list of signers
---
```

**Rules:**

- The frontmatter MUST appear at the top of the file, before any heading.
- `controls:` is an array of identifiers from the catalog in §2 below. An empty array (`controls: []`) is permitted for cycles that are pure infrastructure work and touch no Trust Services Criteria; this should be rare and explicitly justified in the cycle's §3 NFRs.
- `attestation_status` matches the kanban folder the doc currently lives in (`04_in_development/` → `in_development`, etc.). The folder is canonical; the frontmatter is for downstream tooling.
- `prior_cycle` is the immediately-preceding cycle in the dependency chain (often the previous ordinal, but a sub-attestation cycle's `prior_cycle` is the cycle it sub-attests).
- `approvers` is a list of signer identifiers. Single-Steward mode = one entry (the Steward's initials). Republic-616 mode = N entries (one per signer that voted yes on §5).

**Where the convention came from:** EOS-4.1 (this document's parent cycle) introduced it. EOS-1, EOS-2, EOS-3, EOS-4 are mapped in §3 below — the frontmatter is NOT added to those shipped docs (immutability of `06_shipped/` is a load-bearing platform invariant); the §3 table IS the authoritative source for prior-cycle control coverage until the EOS app indexes it directly.

---

## 2. Canonical control catalog (SOC-2 Trust Services Criteria, 2017 framework)

The platform attests against the AICPA Trust Services Criteria. Identifiers below are the ones the EOS app's auditor dashboard surfaces as filter chips. Full official descriptions live in the AICPA TSC document — what follows is the operational shorthand used in cycle frontmatter.

### Common Criteria (CC) — apply to every Trust Services category

| ID | Short name | What the EOS cycle has to demonstrate |
|---|---|---|
| **CC1.1** | Control Environment — Integrity & Ethics | The cycle's §5 approval gate is enforced; no governance bypass. |
| **CC1.2** | Board of Directors Oversight | (republic-616 future state: multi-party §5 votes; today: Steward as sole signer with documented authority.) |
| **CC1.3** | Management Philosophy & Operating Style | Documented in the cycle's §3 NFRs (cost / latency / compatibility / privacy budgets). |
| **CC1.4** | Organizational Structure | The cross-repo logical-branch model with per-repo physical branches and coordinated squash-merges. |
| **CC1.5** | Commitment to Competence | AI-author + human-governance pairing: AI decomposes implementation, human approves unit of work. |
| **CC2.1** | Internal Communications | Cycle doc IS the canonical communication; §1-§5 author intent, §6-§13 author execution, frontmatter declares controls. |
| **CC2.2** | External Communications | Public kanban at `app.olympus-grid.com/eos` makes governance externally visible. |
| **CC2.3** | Communications with Stakeholders | The cycle doc's PR comment thread captures stakeholder discussion in-line with the artifact. |
| **CC3.1** | Risk Assessment — Identify Risks | Cycle's §12 rollback plan explicitly enumerates what could go sideways and how to recover. |
| **CC3.2** | Risk Assessment — Estimate Risk | Cycle's §3 NFRs include cost budget and latency budget as quantified risk envelopes. |
| **CC3.3** | Risk Assessment — Fraud Risk | The cycle's edit-as-PR mechanism means no transition occurs without an auditable, attributable commit. |
| **CC3.4** | Risk Assessment — Change Management | The single-open-cycle global mutex IS the change management policy (one active change path system-wide). |
| **CC4.1** | Monitoring Activities — Ongoing | Activity stream in the EOS app + Plutus karmic accounting (Cycle__c) provide continuous monitoring. |
| **CC4.2** | Monitoring Activities — Reporting Deficiencies | Cycle's §13 closeout records what shipped, what deferred, what surprised — every cycle is a self-deficiency-report. |
| **CC5.1** | Control Activities — Selection | Cycle's §10 execution plan enumerates each control activity (each step). |
| **CC5.2** | Control Activities — Technology | The Git substrate (commits, branches, PRs, signatures) IS the control activity record. |
| **CC5.3** | Control Activities — Policies | The README + this SOC2 doc + the PATENT-DISCLOSURE-DRAFT collectively are the policy set. |
| **CC6.1** | Logical Access — Restrict | Cosmos-logos handshake + Ed25519 signing + JWT validation + repository visibility model. |
| **CC6.2** | Logical Access — Register & Authorize | New user → ApplicationProfile__c (Waitlist → Approved → Active) → JWT issued. |
| **CC6.3** | Logical Access — Modify | Permission set deploys are part of every cycle that adds SObject fields (per CLAUDE.md feedback memory). |
| **CC6.4** | Logical Access — Physical Access | (Less applicable for SaaS; AWS data-center attestation flows through Amazon's own SOC-2.) |
| **CC6.5** | Logical Access — Production Data Logical Separation | Per-tenant Salesforce orgs + per-cluster Pantheon images + per-Identity ContentDocument scoping. |
| **CC6.6** | Logical Access — Remote Authentication | Cosmos-logos sealed-box envelope (X25519 + ChaCha20-Poly1305) for off-grid + remote sessions. |
| **CC6.7** | Logical Access — Restrict to Internal Use | Steward / Archon role on the EOS app gates write access to repository contributors only. |
| **CC6.8** | Logical Access — Protect Against Malicious Code | Pre-deploy GitHub Actions enforce branch protection, code review, and test runs. |
| **CC7.1** | System Operations — Detect | Telemetry pipeline (session JSONL + LedgerEntry__c + ApiLog__c + CloudWatch). |
| **CC7.2** | System Operations — Monitor Configurations | Plugin__mdt records + brain HEAD SHA = system state; any drift is observable in git. |
| **CC7.3** | System Operations — Evaluate Events | Cycle's §9 telemetry assertions ARE the configured monitor expectations. |
| **CC7.4** | System Operations — Respond to Incidents | Deviation accumulator (§13 D-rows) tracks every incident with severity + triage target. |
| **CC7.5** | System Operations — Recover from Incidents | EOS-2 destroy-with-data-integrity claim is the recovery posture; D19 closure proved it. |
| **CC8.1** | Change Management — Authorize | Cycle's §5 gate IS the authorization step. |
| **CC9.1** | Risk Mitigation — Risk Identification | Cycle's §1.1 deviation accumulator captures all bugs / risks surfaced during execution. |
| **CC9.2** | Risk Mitigation — Vendor & Business Partners | (Mostly N/A today; future cycles touching third-party APIs would map here.) |

### Availability (A) — relevant for the platform's uptime claims

| ID | Short name | What the EOS cycle has to demonstrate |
|---|---|---|
| **A1.1** | Availability — Performance Objectives | Cycle's §3 NFRs include latency budgets. |
| **A1.2** | Availability — Monitor Performance | Pulse + telemetry pipeline. |
| **A1.3** | Availability — Recover from Incidents | EOS-2's destroy-with-data-integrity claim is the canonical A1.3 demonstration. |

### Confidentiality (C)

| ID | Short name | What the EOS cycle has to demonstrate |
|---|---|---|
| **C1.1** | Confidentiality — Identify & Maintain | Per-cycle privacy NFR; cosmos-logos sealing of customer-specific traffic. |
| **C1.2** | Confidentiality — Disposal | Customer data retention + deletion policies (touched by EOS-11 sovereignty claim). |

### Processing Integrity (PI)

| ID | Short name | What the EOS cycle has to demonstrate |
|---|---|---|
| **PI1.1** | Processing Integrity — Inputs | Cosmos-logos handshake validates input identity. |
| **PI1.2** | Processing Integrity — Processing | Cycle's §9 telemetry assertions verify the system processed inputs correctly. |
| **PI1.3** | Processing Integrity — Output | LedgerEntry__c + Feedback__c rows are the durable output evidence of every processed cycle. |

(Privacy (P) criteria omitted — Cloudpremise LLC is not seeking the Privacy TSC in the initial attestation cycle. Cycles touching personal data should map to C1.x.)

---

## 3. Per-cycle backfill table

The frontmatter convention was introduced 2026-06-11 by EOS-4.1. Prior cycles (EOS-1, EOS-2, EOS-3, EOS-4) ship metadata frontmatter additively in the same PR that introduces this document. The table below is the authoritative mapping until the cycle docs themselves are read by the EOS app at audit time.

| Cycle | Theme | Controls covered |
|---|---|---|
| **EOS-1** | Portal lifecycle + cycle-tracking infrastructure + cross-surface feedback loop | CC1.1, CC1.5, CC2.1, CC2.3, CC4.1, CC4.2, CC5.2, CC6.2, CC7.1, CC7.3, CC8.1, A1.2, PI1.3 |
| **EOS-2** | "Says what it does, does what it says — athena-717 reachability + destroy-with-data-integrity" | CC1.1, CC3.4, CC4.2, CC5.2, CC6.1, CC7.1, CC7.2, CC7.4, CC7.5, A1.1, A1.3, PI1.2 |
| **EOS-3** | Void → every-surface manifestation (5 surfaces × 4-cycle attestation) | CC1.4, CC2.2, CC4.1, CC5.1, CC5.2, CC6.5, CC7.1, CC7.2, CC7.3, A1.2, PI1.1, PI1.3 |
| **EOS-4** | Checking into brain/1.7.x.x IS the production deployment | CC1.4, CC3.4, CC5.2, CC7.2, CC7.3, CC8.1, A1.1, PI1.2 |
| **EOS-4.1** | Recursive self-attestation — operationalize EOS as a public iris-portal app | CC1.1, CC1.4, CC2.2, CC2.3, CC3.1, CC3.4, CC4.1, CC5.2, CC5.3, CC6.1, CC6.2, CC6.7, CC7.2, CC8.1 |

**This table is canonical for EOS-1 through EOS-4.** No frontmatter is added to the shipped docs (immutability invariant). EOS-4.1 and all future cycles ship with `controls:` frontmatter populated at the cycle's open; the EOS app's auditor dashboard reads frontmatter for in-flight + future cycles and falls back to this table for `06_shipped/brain_1.7.eos-{1..4}.md`.

**Cross-cycle observation:** the platform's coverage of the Common Criteria is heaviest in CC5.2 (Technology), CC7.x (System Operations), and CC1.x (Control Environment) — which is consistent with EOS-1-through-4 being a foundation-building phase. The Availability + Processing Integrity dimensions are covered by EOS-2 (A1.3 + recovery) and EOS-1/3 (PI1.3 + outputs). The remaining 7/17/2026-launch-critical attestations (CAND-A through CAND-L, especially the four ⚡-marked: rollback, tenant isolation, royalty disbursement, bounded recursion) will fill CC6.5, CC9.x, A1.x, and C1.x gaps.

---

## 4. How the EOS app uses this document

The EOS app at `app.olympus-grid.com/eos`:

1. **Reads** every cycle doc's YAML frontmatter at kanban load time.
2. **Aggregates** the `controls:` arrays into a control × cycle inverted index.
3. **Renders** a filter-chip row above the kanban listing each control identifier with a count badge ("CC7.2 (4)").
4. **Filters** the visible cards to only those whose frontmatter includes the selected control(s).
5. **Surfaces** the `/eos/.../audit` subroute which renders a control × cycle heatmap (rows = controls, columns = shipped cycles, cells = coverage depth) where each cell links to the cycle's §13 evidence on GitHub.

This makes the EOS kanban a live SOC-2 control coverage dashboard. An auditor lands on `/eos/.../audit`, clicks any control, and sees the cycles + commits + PRs that constitute the evidence for that control's operating effectiveness. The audit narrative is generated from the working artifact — not maintained as a parallel document.

---

## 5. Cloudpremise LLC SOC-2 path

- **Type-1 attestation target:** 2026-07-17 launch (the Day of Binding). The audit firm + scope decision is pending; this document is auditor-firm-agnostic.
- **Type-2 attestation:** TBD, requires 6+ months of evidence-of-operating-effectiveness. The EOS kanban's PR-as-transition discipline IS the evidence stream; Type-2 follows naturally once the kanban has 6+ months of live operation.
- **In-scope systems:** olympus-616 + olympus-grid + cosmos-logos surfaces (turtleshell-{web,ios,offgrid}) + the EOS app itself (eats its own dogfood).
- **Out-of-scope for initial attestation:** omens (game; ships its own attestation cycles), foundation manifesto (ceremony of binding; non-revenue-bearing).

---

## 6. Maintenance

- This document is updated by the EOS agent whenever a new cycle ships or a control category's coverage shifts materially.
- The cycle doc frontmatter is the canonical source for what controls a cycle claims to touch — this document's §3 table is regenerated from frontmatter when out of sync.
- When republic-616 ships, the `approvers:` frontmatter field becomes a multi-party tally; auditors will be able to see who voted yes on each cycle's §5 gate.

Γένοιτο.
