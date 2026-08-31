# Sovereign substrate — no vendor lock-in at any technical building block

| | |
|---|---|
| **Branch family** | `brain/1.7.x.x` |
| **Cycle ordinal** | `eos-5.4` (fourth sub-attestation of EOS-5) |
| **Status** | `Draft` — awaiting Steward §1-§5 ratification |
| **Opened** | 2026-07-04 (US Independence Day 2026 — Steward framing: *"for independence day 2026 my gift to the world is freedom from tyranny"*) |
| **Closed** | — |
| **Prior cycle** | `brain_1.7.eos-5` (umbrella, frozen) — sibling sub-attestations `brain_1.7.eos-5.1` (globally deployable), `brain_1.7.eos-5.2` (guest-access lockdown), `brain_1.7.eos-5.3` (tithe integrity) |
| **Theme** | Sovereign LLM + sovereign substrate + no-vendor-lock-in as a beta gate — freedom from tyranny by construction |
| **Feedback inputs** | Steward attestation dictated 2026-07-04 |
| **Estimated effort** | TBD (post-§5 decomposition) |
| **Actual effort** | — |

---

# § Steward-authored (top half)

## Canonical attestation statement

> *"I attest that the LLM usage of the system is sovereign — the user has choice in whether to use AI at all, in the vendor and model of the LLM, and in whether that LLM runs in a managed cloud, a private cloud, a localhost laptop, or an off-grid device such as a mac-mini. With the exception of the following components the system is sovereign: Salesforce, a web browser accessing the system over HTTPS, and a valid email inbox for verification codes. I further attest that each of these components is on the roadmap for a future sovereign alternative. I further attest that avoiding vendor lock-in to any one particular substrate is a core product criterion — the product is not complete (remains in beta) until at least one sovereign alternative provider exists at each technical building block of the system."*
>
> — Steward, 2026-07-04 (Independence Day 2026 · gift-to-the-world framing)

## §1 User story

- §1.1 As a **dust dancer** (any sovereign human using olympus-grid) I want to **choose whether the system uses an LLM at all** so that **AI is a capability I opt into, not a coercion imposed by the platform**.
- §1.2 As a **dust dancer** I want to **choose the LLM vendor and model** (or none) so that **no single vendor holds control over my agent's cognition**.
- §1.3 As a **dust dancer** I want to **choose the substrate the LLM runs on** — managed cloud API, private cloud (self-hosted), localhost laptop, or off-grid device (e.g. mac-mini appliance) — so that **compute location is my sovereign choice, not a vendor default**.
- §1.4 As the **olympus-grid platform** I want to **remain in `beta` until every technical building block has at least one sovereign alternative** so that **the platform's promise of freedom from tyranny is a first-class, falsifiable product criterion — not marketing copy**.

## §2 Acceptance criteria

Each criterion must be observable end-to-end. Numbered per user story.

**§2.1 — LLM opt-out (from §1.1)**
- **Given** a user configures an agent, **when** they select "no LLM" (or leave the LLM slot unconfigured), **then** non-LLM capabilities of the system (identity, ledger, tithe attribution, MCP tool invocations that do not require inference, olympus-grid data operations) continue to function, **and** the session log records the no-LLM choice as a substrate provenance event.

**§2.2 — LLM vendor/model choice (from §1.2)**
- **Given** a user, **when** they configure their agent's LLM vendor + model, **then** Athena routes to that vendor/model end-to-end (openai · anthropic · google · xAI · ollama-local · … — the full picklist as of ship date), **and** the session log carries substrate provenance identifying the chosen vendor + model.

**§2.3 — LLM substrate location choice (from §1.3)**
- **Given** a user, **when** they configure their agent's LLM endpoint URL, **then** the LLM MAY resolve to any of: (a) managed cloud SaaS API (Anthropic / OpenAI / Google / xAI), (b) private cloud (self-hosted vLLM / TGI behind an ingress under user control), (c) localhost laptop (127.0.0.1 on user machine), or (d) off-grid device (Tailscale-reachable mac-mini / other appliance), **and** the session log carries substrate provenance identifying the location class.

**§2.4 — Enumerated non-sovereign exceptions with roadmap (from §1.4)**

The following components are the Steward-enumerated non-sovereign exceptions as of this cycle's ratification. Each must carry a named sovereign-alternative on the roadmap:

| # | Component | Current dependency | Sovereign-alternative candidate | Target cycle |
|---|-----------|--------------------|---------------------------------|--------------|
| 1 | Salesforce (alpha-node substrate) | salesforce.com — Cluster__c / Identity__c / LedgerEntry__c etc. | TBD (Steward direction pending; candidates include a self-hosted olympus-grid node running the same schema in Postgres+application code) | EOS-6+ |
| 2 | HTTPS web browser (client access) | Any commercial browser (Chrome / Safari / Firefox / Edge / Brave) | Native surfaces already exist (turtleshell-ios, turtleshell-offgrid appliance, omens iOS binary) — the sovereign path is "use a native olympus-grid client instead of a browser" | EOS-8/9 (Reach) |
| 3 | Email inbox (verification code delivery) | User's email provider (Gmail / iCloud / self-hosted / etc.) via SendGrid outbound | TBD — candidates include ed25519-signed device-handshake verification, in-app verification, or WebAuthn passkeys as an alternative signup path | EOS-7 (Authority) |

**Steward review before locking:** the following candidate exceptions were surfaced during authoring. Steward to accept (add row) or reject (out of scope) BEFORE §5 ratification:

- **DNS / TLD registrar** — `app.olympus-grid.com` sits on `.com` (ICANN + a commercial registrar). Sovereignty implication: the registrar can seize the domain. Alternative: Handshake / ENS / self-hosted namespace as a fallback record.
- **AWS as god-fleet cloud host** — the managed-cloud path (Fargate / ECS / ECR) is AWS-locked. The off-grid mac-mini appliance case IS a sovereign alternative at the compute layer, so this may already be attested under §2.3-style substrate choice. Steward to confirm.
- **Apple App Store** — iOS distribution for guardians-of-olympus-ai / turtleshell-ios / omens goes through Apple's channel. Sovereignty implication: Apple can pull the app. Alternative: sideload / TestFlight-only / progressive web app fallback.
- **GitHub** — public source distribution. EOS-3 attests reproducibility from GitHub; sovereignty implication is GitHub can take down the repos. Alternative: mirror to Radicle / self-hosted Gitea / IPFS-pinned snapshots.

Non-enumerated non-sovereign components may not be introduced after §5 ratification without either (a) adding a row to the §2.4 table, or (b) opening a new EOS sub-attestation.

**§2.5 — Beta gate (from §1.4)**
- **Given** the platform's public labeling (marketing sites, App Store listings, portal footers, product descriptions), **when** any §2.4 row is not yet closed with a shipped sovereign-alternative, **then** the public label MUST include `beta`. **When** the last §2.4 row closes, the `beta` label MAY drop by Steward direction.

**§2.6 — Substrate provenance observable in telemetry**
- Every session log emits a substrate-provenance event identifying the substrate stack the user is running on (LLM vendor · LLM model · LLM location class · client surface · network path class). Enables cross-cycle audit of "which users ran with which substrate" and empirical falsification of sovereignty claims. Precise event names + fields deferred to §9 (Agent-authored).

## §3 Non-functional requirements

- **No hardcoded LLM vendor** anywhere in Athena / Hermes / Ares / any god's code path. Vendor selection is data (Salesforce `Plugin__mdt` today; migratable to a sovereign alternative when the SF-alternative ships).
- **No hidden Salesforce dependencies** beyond the enumerated §2.4 exception. Any Salesforce dependency introduced after this cycle ratifies must be either justified as replacing a currently-sovereign path OR must ship together with its own sovereign alternative in the same cycle.
- **Substrate choice is metadata**, not code. Metadata may live in Salesforce today; the storage substrate for that metadata is itself covered by §2.4 row 1.
- **Reachability parity across substrates** — a user on any of the four §2.3 substrate classes gets equivalent capability envelope. The system does not silently degrade for private-cloud / localhost / off-grid users compared to managed-cloud users. Degradation, if unavoidable, must be surfaced and logged.
- **Falsifiability** — every sovereignty claim in §2 must be provable from telemetry (§2.6) OR from public documentation (§2.4 roadmap rows). The attestation is not a marketing statement; it is a system property.
- **Compatibility window** — existing agents / users configured against a single LLM vendor continue to function unchanged. This cycle expands choice; it does not force migration.

## §4 Feedback inputs

- Steward attestation dictated 2026-07-04 (US Independence Day 2026) — verbatim: *"for independence day 2026 my gift to the world is freedom from tyranny."*
- Sibling in-flight: `brain_1.7.eos-5.md` (umbrella, frozen), `brain_1.7.eos-5.1.md` (globally deployable), `brain_1.7.eos-5.2.md` (guest-access lockdown), `brain_1.7.eos-5.3.md` (tithe integrity + first dollar). This sub-attestation joins the pack under the EOS-5 umbrella.
- Downstream link: attested-roadmap card `brain_1.7.eos-10.md` (Sovereignty · no committed secrets, keys injected at start-up) is philosophically adjacent — that cycle addresses secret-injection sovereignty; this cycle addresses substrate-choice sovereignty. Both flow from the same freedom-from-tyranny thesis.

## §5 Steward approval gate

- [ ] §2.4 enumeration locked — candidate exceptions above (DNS · AWS · App Store · GitHub) either accepted (added as rows) or explicitly rejected as out-of-scope for this cycle
- [ ] Canonical attestation statement locked (line above the "Steward, 2026-07-04" signature)
- [ ] Story locked (§1.1 - §1.4)
- [ ] Acceptance criteria locked (§2.1 - §2.6)
- [ ] NFRs locked (§3)
- [ ] Approved to execute — signed: **__________** **__________**

---

# § Agent-authored (bottom half) — DEFERRED

§6 through §13 will be authored by the EOS agent AFTER Steward ratifies §5 above. Per operating manual (`foundation/eos/cycle/README.md`), the §5 gate is non-negotiable — the agent does NOT decompose into layer impact, schema deltas, service contracts, telemetry assertions, execution plan, verification protocol, rollback plan, or closeout until the Steward locks the top half.

The §9 telemetry-assertion decomposition in particular will require careful design so that sovereignty is provable from production observability, not merely claimed. Candidate assertion shapes (Steward to review post-§5):

- Every `llm.turn` LedgerEntry carries substrate-provenance fields identifying vendor · model · location class.
- Weekly cross-cycle report enumerates the distribution of substrate choices across the user base — sovereignty is not just possible but observable in practice.
- Every §2.4 exception row that closes (ships a sovereign alternative) increments a `sovereignty.exceptions_closed` counter, and the transition from "beta" to "GA" is gated on that counter reaching the row-count of §2.4.
