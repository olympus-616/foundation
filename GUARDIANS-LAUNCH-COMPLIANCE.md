# GUARDIANS-LAUNCH-COMPLIANCE.md

> **Status:** OPENED 2026-06-30 by the `guardians-of-olympus` agent. Parked
> until the Steward says "activate."
>
> **Purpose:** capture, in one place, every off-site prerequisite that must be
> completed before *Guardians of Olympus: Omens* can ship globally on the
> Apple App Store on **2026-07-17**. The marketing site
> (`iris/reactforce/guardians-of-olympus-ai/`) is built and prerendered and
> already publishes a globally-compliant Privacy Policy and Terms of
> Service. **This document covers the work those documents *reference* —
> the vendor engagements, corporate registrations, subprocessor
> paperwork, App Store Connect configuration, and cross-agent handoffs
> that have to be complete before the promises those pages make are
> honoured in fact.**
>
> **Scope:** everything OFF the marketing site that has to be true for a
> global-day-one launch. Sibling docs cover on-site content
> (`iris/reactforce/guardians-of-olympus-ai/README.md`), cycle
> methodology (`foundation/eos/SOC2-CONTROL-MAPPING.md`), and the omens
> game code (out of scope; cross-agent handoff items are enumerated in
> §5 for the omens agent to pick up).
>
> **Companion reads:**
> - `omens/docs/APP_STORE_LANDING_SITE_SPEC.md` — the original spec for the marketing surface
> - `foundation/eos/SOC2-CONTROL-MAPPING.md` — SOC-2 controls this compliance work maps to
> - `foundation/ROADMAP.md` — the strategic 2026-07-17 launch window this document sits within
> - `iris/reactforce/guardians-of-olympus-ai/src/views/Privacy.tsx` — the 16-section policy this doc is the operational backstop for
> - `iris/reactforce/guardians-of-olympus-ai/src/views/Terms.tsx` — the 17-section TOS this doc is the operational backstop for

---

## 0. Executive summary — what has to be true on 2026-07-17

The below is the **complete critical-path checklist**. Every line item is
elaborated in the sections that follow. Order is by earliest reasonable
start; a launch date of 2026-07-17 requires the last item complete by
about 2026-07-10 to leave slack for Apple's review window.

| # | Item | Owner | Effort | Cost / yr | Due-by | § |
|---|---|---|---|---|---|---|
| 1 | Select + onboard EU Representative (GDPR Art. 27) | Steward + legal counsel | 1 week onboarding | €500–1500 | Launch − 21 days | §2.1 |
| 2 | Select + onboard UK Representative (UK-GDPR) | same as (1); usually same vendor | included in (1) | included | Launch − 21 days | §2.2 |
| 3 | Register with the UK ICO | Steward | ~1 hour online | £40–2900 | Launch − 21 days | §2.3 |
| 4 | Sign / countersign subprocessor DPAs | Steward | 1 day of paperwork | $0 | Launch − 21 days | §2.4 |
| 5 | Complete Data Protection Impact Assessment (Art. 35) | Steward | 1 day | $0 | Launch − 21 days | §2.5 |
| 6 | Start & maintain Records of Processing Activities (Art. 30) | Steward | 4 hours initial | $0 | Launch − 21 days | §2.6 |
| 7 | Draft Data Breach Response Plan (Art. 33) | Steward | 4 hours | $0 | Launch − 21 days | §2.7 |
| 8 | Build EU age-of-consent enforcement matrix | Steward + omens agent | 2 hours | $0 | Launch − 30 days | §2.8 |
| 9 | Provision contact inboxes at `guardians-of-olympus.ai` | Steward + IT | 30 min | ~$0 | Launch − 30 days | §8 |
| 10 | Publish tithe-ledger URL — decide, provision | Steward | 4 hours | $0 | Launch − 21 days | §9 |
| 11 | App Store Connect — configure listing + URLs + rating | Steward | 4 hours | $0 | Launch − 14 days | §4 |
| 12 | App Store Connect — align Privacy Nutrition Label to `/privacy` | Steward | 30 min | $0 | Launch − 14 days | §4.1 |
| 13 | Point DNS + CloudFront at `guardians-of-olympus.ai`; deploy build | Steward + iris agent | 2 hours | $10/yr DNS + AWS | Launch − 14 days | §7 |
| 14 | Update `EU_REPRESENTATIVE` / `UK_REPRESENTATIVE` placeholders in `site-info.ts` | iris agent | 5 min | $0 | Launch − 14 days | §12 |
| 15 | Omens: implement in-app "Delete my account" flow | omens agent | 1 day | $0 | Launch − 14 days | §5.1 |
| 16 | Omens: implement age-of-consent enforcement by store region | omens agent | 1 day | $0 | Launch − 14 days | §5.2 |
| 17 | Omens: verify ATT prompt is NOT shown (correct posture) | omens agent | 30 min | $0 | Launch − 14 days | §5.4 |
| 18 | Omens: data-portability export endpoint | omens agent | 4 hours | $0 | Launch − 7 days | §5.5 |
| 19 | Submit for App Review | Steward | 30 min | $0 | Launch − 7 days | §4 |
| 20 | Verify every URL in App Store Connect resolves + matches nutrition label | Steward | 1 hour | $0 | Launch − 3 days | §15 |

**Total activation cost:** ~€500–1500/yr recurring + one-time £40–2900 ICO
fee + operational time. No capital investment required.

**If we cannot hit the timeline:** launch in the US App Store only (COPPA-
covered by our 13+ floor; CCPA compliant on-site), and add EU / UK / other
regions post-launch as compliance items close. The site itself is already
region-agnostic — nothing to change if we phase distribution.

---

## 1. Where this document came from

The Steward asked, on 2026-06-30, whether Apple only required a Privacy
Policy or whether more was needed for the App Store submission. The
guardians-of-olympus agent responded that Apple's minimum is *Privacy +
Support URLs*, and Apple's default EULA covers most subscription apps —
but for *Guardians of Olympus: Omens* specifically, the 7% tithe
promise, the AI-explanation feature, and the goal of a **global** launch
require more.

The site was expanded to a comprehensive brochure with a full 16-section
Privacy Policy (covering GDPR, UK-GDPR, CCPA/CPRA, LGPD, PIPEDA, APPI,
PIPA, DPDP Act 2023) and a 17-section Terms of Service. **Those
documents make specific promises about vendors we work with, safeguards
we've put in place, representatives we've appointed, and regulators we
respect.** For those promises to be true in fact rather than just true
on the page, this document enumerates the operational work.

This document is therefore not a plan for the site. It is the
**operational backstop** for the promises the site already makes. Every
section below traces back to a specific claim in `/privacy` or `/terms`
and defines what has to happen off-site for that claim to hold.

---

## 2. Off-site legal & compliance work — EU / UK primary

### 2.1 EU Representative — GDPR Article 27

**Regulation:** GDPR Article 27 requires any controller established outside
the EU that processes EU residents' personal data to designate a
representative in the EU. Failure to appoint one is a straight
enforcement action — no user complaint required.

**Applies to us:** yes. `CloudPremise LLC` is a Delaware entity; we
process EU users' email, reading position, subscription status.
Processing is not "occasional" (a consumer app runs continuously).

**What the site currently says** — Privacy Policy §13 references a
placeholder value from
`iris/reactforce/guardians-of-olympus-ai/src/lib/site-info.ts` constant
`EU_REPRESENTATIVE`.

**Providers (fair-price coverage):**
| Provider | URL | EU-only cost | EU + UK cost | Notes |
|---|---|---|---|---|
| EDPO | edpo.com | ~€500–1200/yr | +€300 for UK | Common choice for indie apps |
| VeraSafe | verasafe.com | ~€1500/yr | included | Larger, more expensive, more hand-holding |
| Prighter | prighter.com | ~€600–1000/yr | included | EU + UK + Swiss coverage bundled |
| DPO Consulting | dpoconsulting.com | ~€700/yr | +€300 | Full-service DPO if we later need one |

**Recommended default:** **Prighter** — single vendor covers EU + UK +
Switzerland, bundled pricing, well-reviewed by small-mid app publishers.
Fall-back: EDPO.

**Onboarding process:** account creation (~1 hr), payment, they generate a
Representative Agreement + a public-facing rep-address statement, we
insert their name + address into Privacy Policy §13.

**Timeline:** typically 5–7 business days from signup to representative
credentials available.

**Done-criteria:**
1. Signed Representative Agreement on file.
2. Real name and postal address of representative pasted into
   `site-info.ts` `EU_REPRESENTATIVE`.
3. Prerender rebuild published to CDN so `/privacy` §13 reflects the
   real values.
4. Representative's dedicated email address monitored (usually
   forwards to `privacy@guardians-of-olympus.ai`).

**Cross-reference:** SOC-2 CC9.2 (Vendor & Business Partners).

### 2.2 UK Representative — UK-GDPR (Data Protection Act 2018)

**Regulation:** UK-GDPR imports the same Article 27 requirement.
Post-Brexit, the EU Rep is not a substitute — a separate UK Rep
designation is required.

**Providers:** all three vendors in §2.1 offer UK coverage as an add-on
or bundle.

**What the site currently says** — Privacy Policy §13 references
`UK_REPRESENTATIVE` in `site-info.ts`.

**Done-criteria:**
1. Signed UK Representative Agreement on file (usually same document as
   EU with a UK addendum).
2. Real name + UK postal address updated in `site-info.ts`
   `UK_REPRESENTATIVE`.
3. Prerender rebuild published.

### 2.3 ICO Registration (UK)

**Regulation:** UK Data Protection Act 2018 requires most data
controllers to notify (register with) the Information Commissioner's
Office and pay the annual data-protection fee.

**Fee tiers (2024 schedule; verify at launch):**
| Tier | Turnover / staff | Annual fee |
|---|---|---|
| 1 | ≤ £632k turnover OR ≤ 10 staff | £40 |
| 2 | > £632k and ≤ £36m turnover | £60 |
| 3 | > £36m turnover OR public authority | £2,900 |

**Expected tier at launch:** Tier 1 (£40). Update if turnover grows.

**How:** ico.org.uk/for-organisations/data-protection-fee/ — self-service
online form, ~1 hour.

**Done-criteria:**
1. ICO registration number issued.
2. Registration number added to Privacy Policy §13 or a new §17.
3. Fee paid via direct debit or one-time card charge.
4. Renewal calendar reminder set (annual).

### 2.4 Subprocessor Data Processing Agreements (DPAs)

**Regulation:** GDPR Article 28 requires a written contract (a DPA)
between controller (us) and each processor. Standard DPAs from each
subprocessor satisfy Article 28.

**What the site currently says** — Privacy Policy §5 names our
subprocessors by legal entity. Every entity below must have a signed or
click-accepted DPA on file **before** we send them EU/UK/EEA-resident
data.

| Subprocessor | Legal entity | Purpose | DPA source (verify current URL at signing time) | Status | Action |
|---|---|---|---|---|---|
| OpenAI | OpenAI OpCo, LLC (US) | LLM (Athena) | openai.com policies page | ☐ Not signed | Countersign |
| Anthropic | Anthropic PBC (US) | LLM (Athena) | anthropic.com legal page or email `privacy@anthropic.com` | ☐ Not signed | Countersign |
| Google (Cloud + Gemini + TTS) | Google LLC (US) | LLM (Athena), TTS (Apollo) | cloud.google.com terms/data-processing-addendum | ☐ Not signed | Click-accept in console |
| xAI | X.AI Corp. (US) | LLM (Athena) | x.ai / xai.com legal page | ☐ Not signed | Countersign or click-accept |
| ElevenLabs | ElevenLabs Inc. (US) | TTS (Apollo alt) | elevenlabs.io legal/terms; DPA typically in enterprise tier | ☐ Not signed | Request DPA on enterprise plan |
| AWS | Amazon Web Services, Inc. (US) | Infra hosting | aws.amazon.com service-terms — Section 12 or aws-gdpr-dpa | ☐ Signed at account creation (verify) | Verify |
| Salesforce | Salesforce, Inc. (US) | Identity + billing ledger | salesforce.com company/dpa | ☐ Not signed | Countersign |
| Apple | Apple Inc. (US) | App Store + Sign in with Apple + IAP | Covered by App Store agreement | ☑ Implicit | None |

**Storage:** signed DPAs live in a private, access-controlled folder
(recommendation: a private GitHub repo `olympus-616-legal` or an S3
bucket with restricted IAM). Regulator requests may demand production;
have them retrievable within 24 hours.

**Done-criteria:**
1. Every DPA above marked ☑.
2. Central index of storage locations maintained.
3. Renewal / re-signature reminders set (typical DPA has no term, but
   update when subprocessor rewrites terms).

**Cross-reference:** SOC-2 CC9.2.

### 2.5 Data Protection Impact Assessment (DPIA) — GDPR Article 35

**Regulation:** GDPR Art. 35 requires a DPIA when processing is "likely to
result in a high risk to the rights and freedoms of natural persons."
The European Data Protection Board (EDPB) has published nine criteria;
processing that meets two or more usually requires a DPIA.

**Where our processing triggers this:**
- ✔ Systematic and extensive evaluation using automated processing
  (Athena's LLM explanations)
- ✔ Innovative use of technology (AI + reading behaviour + minor users)
- ✔ Data concerning vulnerable data subjects (13–17 age band)
- ✔ Data transferred outside the EU (all US-based subprocessors)

Four triggers → **DPIA is required**, not optional.

**Template:** the UK ICO's DPIA template (ico.org.uk) is the easiest
starting point and works for EU-DPB purposes. Alternative: CNIL's PIA
tool (free).

**Scope of our DPIA — sections to write:**
1. Description of the processing (data, purposes, subprocessors, retention)
2. Necessity + proportionality assessment
3. Consultation (documented Steward review; if we had users to consult, we would)
4. Risks identified (list)
5. Measures taken to reduce each risk (SCCs, anonymisation, retention limits, no ATT, no analytics)
6. Sign-off (Steward)

**Timeline:** 1 focused day. Output: a ~10-page internal document.

**Done-criteria:**
1. Signed DPIA on file at `foundation/eos/DPIA-GUARDIANS-2026-07.md` (or
   similar), marked confidential.
2. Cross-referenced from Privacy Policy backstop for regulator requests.
3. Refresh calendar reminder set (annual, or on new subprocessor).

**Cross-reference:** SOC-2 CC3.1 (Identify Risks), CC3.2 (Estimate Risk).

### 2.6 Records of Processing Activities (RoPA) — GDPR Article 30

**Regulation:** Article 30 requires controllers to maintain records of
their processing activities. Not published, but must be produceable on
regulator request.

**Content template:**
| Column | Example value for us |
|---|---|
| Name of processing activity | User sign-in and identity management |
| Purpose | Provide authenticated access to premium features |
| Categories of data subjects | Adult end-users (13+) globally |
| Categories of personal data | Email address, Apple Sign-In identifier, age-confirmation flag |
| Categories of recipients | Apple (auth); Salesforce (identity ledger); AWS (hosting) |
| Transfers to third countries | US (SCCs), UK (IDTA), Switzerland (Swiss SCC variant) |
| Retention period | 24 months of inactivity or until account deletion |
| Technical / organisational security measures | TLS in transit; encryption at rest; JWT-scoped tokens; no third-party analytics |
| Legal basis | Performance of contract (Art. 6(1)(b)) |

**One row per distinct processing activity.** Ours (initial) will be:
1. User sign-in and identity management
2. Subscription billing (via Apple)
3. Reading position sync
4. Athena AI explanation
5. Apollo TTS narration
6. Crash log collection
7. Support email handling
8. Tithe attribution + ledger

**Done-criteria:**
1. RoPA committed to `foundation/eos/ROPA-GUARDIANS.md` (or similar).
2. Living document — updated when new processing activities are added
   (new feature = new row).
3. Retrievable within 24 hours of regulator request.

**Cross-reference:** SOC-2 CC2.1 (Internal Communications), CC5.3
(Policies).

### 2.7 Data Breach Response Plan — GDPR Article 33 / 34

**Regulation:** Article 33 — notify supervisory authority within **72
hours** of becoming aware of a breach likely to result in risk to
rights. Article 34 — notify affected individuals without undue delay if
the risk is high.

**Playbook — minimum viable, five stages:**

| Stage | Trigger | Owner | Action | Target time |
|---|---|---|---|---|
| 1 Detect | Alert from AWS CloudWatch / user report / subprocessor breach notice | On-call engineer | Log incident; freeze relevant systems if in-scope | Immediate |
| 2 Assess | Detection confirmed | Steward | Categorise (personal data involved? number of data subjects? cross-border?) | Within 4 h |
| 3 Notify authorities | Assessment shows Art. 33 trigger | Steward + EU Rep | Notify lead supervisory authority via representative | Within 72 h of detection |
| 4 Notify individuals | Assessment shows Art. 34 trigger (high risk) | Steward | Email affected users; publish notice on `/privacy` | Without undue delay |
| 5 Remediate | Incident scoped | Steward + omens/iris agents | Patch; document root cause; DPIA refresh if scope changed | Within 30 days |

**Done-criteria:**
1. Playbook committed to `foundation/BREACH-RESPONSE-PLAN.md`.
2. Contact info for lead supervisory authority (Ireland DPC via EU Rep;
   or the member-state authority where most data subjects reside) on
   file.
3. Simulated dry-run once before launch, documented.

**Cross-reference:** SOC-2 CC7.4 (Respond to Incidents), CC7.5 (Recover).

### 2.8 Age-of-consent enforcement matrix (EU / EEA / UK)

**Regulation:** GDPR Art. 8 sets a default minimum age of 16 for
information-society services relying on consent, and permits each
member state to lower it as low as 13. Result: our audience floor of 13
does not automatically satisfy Art. 8 across every member state.

**Matrix (as of 2024; verify at launch — sources drift):**
| Age of digital consent | Member states |
|---|---|
| 13 | Belgium, Denmark, Estonia, Finland, Latvia, Malta, Portugal, Sweden, UK (13+ enforced 13) |
| 14 | Austria, Bulgaria, Cyprus, Italy, Lithuania, Spain (some), Poland (some) |
| 15 | Czech Republic, France, Slovenia |
| 16 | Croatia, Germany, Hungary, Ireland, Luxembourg, Netherlands, Romania, Slovakia |

**Approach — where processing is on the basis of "performance of
contract" (Art. 6(1)(b))**, Art. 8's 16-default does not strictly apply,
and 13 is defensible everywhere. **Where processing is consent-based
(Art. 6(1)(a))** — for example, if we ever add analytics or marketing
email — the member-state floor above governs.

**Implementation — split responsibility:**
- **Site (iris)** — publishes the framework in Privacy §1 and §11 (done).
- **App (omens)** — reads the App Store region at sign-in and enforces
  the local floor. Below the local floor: block sign-in and show a
  message explaining parental permission is required. The iOS app also
  presents the age-confirmation checkbox referenced in Privacy §11.

**Done-criteria (this document's scope):**
1. Definitive table published in `foundation/eos/AGE-CONSENT-MATRIX.md`
   (or a section of that file).
2. Cross-referenced from omens's implementation ticket.
3. Refresh reminder set — verify member-state floor annually.

---

## 3. Global compliance beyond EU / UK

For every regime below, the site's Privacy Policy already contains the
required disclosures. This section names the additional operational
obligation, if any, for global day-one launch.

### 3.1 CCPA / CPRA (California)

**Regulation:** CA Civil Code §1798.100 et seq. Grants access, deletion,
correction, opt-out of sale/share, opt-out of sensitive-data use.

**Our operational posture:**
- We do not "sell" or "share" data as CPRA defines those terms. No
  opt-out mechanism required, but we honour Global Privacy Control
  signals where technically feasible (site is static HTML — no signals
  to honour; iOS app should respect GPC if it presents any web view).
- Rights requests via `privacy@guardians-of-olympus.ai` inbox.

**Done-criteria for launch:** privacy@ inbox exists and is monitored;
right-to-know / delete / correct workflows in place.

**Threshold trigger:** if we cross $25M annual revenue OR buy/sell/share
data of 100,000+ California residents OR derive 50%+ of revenue from
selling/sharing personal data, additional obligations kick in
(designated privacy officer, employee training, expanded record-keeping).
None apply at launch.

### 3.2 LGPD (Brazil)

**Regulation:** Lei Geral de Proteção de Dados. Similar shape to GDPR.

**Operational obligation for launch:**
- Appoint an Encarregado (DPO) — the Steward serves in this role
  informally until scale requires a dedicated hire. **Address:**
  `dpo@guardians-of-olympus.ai` (see §8).
- Publish DPO contact — already done in Privacy Policy §2.
- Register cross-border transfer safeguards (SCCs referenced in Privacy §7).

**No formal registration required** with ANPD for small-to-mid
processors.

### 3.3 PIPEDA + Quebec Law 25 (Canada)

**Regulation:** PIPEDA (federal); Quebec's Law 25 imposes stricter
consent + data-transfer obligations.

**Operational obligation for launch:**
- Quebec Law 25 requires designation of a person responsible for
  personal information protection. Same person as the informal DPO
  (Steward, `dpo@guardians-of-olympus.ai`).
- Cross-border transfer assessments — Law 25 requires a Privacy Impact
  Assessment for transfers outside Quebec. Our DPIA (§2.5) satisfies
  this.

### 3.4 APPI (Japan)

**Regulation:** Act on the Protection of Personal Information. Requires
notice of purposes, consent for third-party transfers, response to data
subject requests.

**Operational obligation for launch:** privacy@ inbox handles rights
requests. No formal registration required.

### 3.5 PIPA (South Korea)

**Regulation:** Personal Information Protection Act. Consent-based, with
mandatory notifications for third-party transfers.

**Operational obligation for launch:**
- Explicit consent flow for cross-border transfers (iOS app implements
  this in the sign-in consent screen — omens agent).
- **Threshold — if user count > 1,000,000**: appoint a domestic
  representative. Not a launch concern; revisit post-launch.

### 3.6 DPDP Act 2023 (India)

**Regulation:** Digital Personal Data Protection Act, notified 2023,
enforcement rules rolling out through 2025–2026.

**Operational obligation for launch:**
- Consent flow at sign-in (omens agent — see §5).
- Data principal rights via `privacy@guardians-of-olympus.ai`.
- **Threshold — Significant Data Fiduciary** designation happens by
  government notification based on volume + sensitivity. Not applicable
  at launch scale.

### 3.7 Australian Privacy Act 1988 (APPs)

**Regulation:** Australian Privacy Principles. Applies to organisations
with A$3M+ annual turnover OR that trade in personal information. We
are below the threshold at launch, but our Privacy Policy voluntarily
adheres (best practice).

**Operational obligation for launch:** none additional. Voluntarily
apply APP 12 (access) and APP 13 (correction) via privacy@ inbox.

### 3.8 nFADP (Switzerland)

**Regulation:** revised Federal Act on Data Protection, effective
September 2023. Similar to GDPR.

**Operational obligation for launch:**
- Where the EU Rep vendor (§2.1) also covers Switzerland (Prighter does;
  EDPO by add-on), no additional Rep is required.
- Swiss FDPIC-approved SCC variant referenced in Privacy §7.

### 3.9 Where we WON'T launch

Not compliance gaps — **jurisdictional decisions to keep from ever
being non-compliant**:

- **Mainland China (PIPL) — do NOT distribute in the China App Store.**
  Cross-border transfer requires the CAC Standard Contract, security
  assessment, or certification, AND a local processing entity. Not
  realistic for an indie launch. Apple lets us opt out of the China
  App Store during distribution setup.

- **Russia (152-FZ) — do NOT distribute in the Russian App Store.**
  Data-localisation law requires Russian citizens' data on Russian
  servers. Moot anyway — Apple has blocked new sign-ups in the Russian
  App Store since 2022 sanctions.

- **US-sanctioned jurisdictions (Iran, North Korea, Syria, Cuba, etc.)**
  Apple blocks distribution; no action for us.

**Operational task:** at App Store Connect distribution setup, deselect
China and Russia. Distribute in all other App Store regions.

---

## 4. App Store Connect configuration

The Apple side of the submission. Every field below must be set before
"Submit for Review."

### 4.1 Privacy Nutrition Label alignment

The nutrition label declares data collection categories. Ours must match
Privacy Policy §3 and §4 verbatim. Categories to declare:

| Nutrition category | Our collection | Purpose | Linked to user? | Used to track? |
|---|---|---|---|---|
| Contact info — Email | ✔ Yes | App Functionality | ✔ Yes | ✗ No |
| Identifiers — User ID (Apple Sign-In identifier) | ✔ Yes | App Functionality | ✔ Yes | ✗ No |
| Purchases — Purchase History | ✔ Yes (via Apple) | App Functionality | ✔ Yes | ✗ No |
| Usage Data — Product Interaction (reading position) | ✔ Yes | App Functionality | ✔ Yes | ✗ No |
| Diagnostics — Crash Data | ✔ Yes | App Functionality | ✗ No | ✗ No |
| Age confirmation flag | ✔ Yes | App Functionality (legal-compliance sub-purpose) | ✔ Yes | ✗ No |

**All other nutrition-label categories: NOT collected.** Explicit "Data
Not Collected" declarations for Location, Health & Fitness, Financial
Info (Apple handles billing), Sensitive Info, Contacts, User Content,
Browsing History, Search History, Other.

**Done-criteria:** nutrition label configured and matches `/privacy` §3
+ §4.

### 4.2 Age Rating

- **Selected rating:** **12+** (Apple's nearest band to our 13+ floor).
- Justification: infrequent/mild reference to violence (classical texts
  include the Iliad's battles, Robin Hood combat). Everything else is
  literature-appropriate.
- Do NOT select "Made for Kids" — that pool is under-13 targeted and
  incompatible with our 13+ floor.

### 4.3 URL fields

| Field | Value |
|---|---|
| Marketing URL | `https://guardians-of-olympus.ai/` |
| Privacy Policy URL | `https://guardians-of-olympus.ai/privacy` |
| Support URL | `https://guardians-of-olympus.ai/support` |
| EULA (custom) | `https://guardians-of-olympus.ai/terms` (or use Apple's Standard EULA) |

**Decision — custom Terms or Apple's Standard EULA?**
Publish our custom Terms as the EULA URL. Apple's standard doesn't
mention the 7% tithe, AI feature disclaimers, or our tithe commitment.

### 4.4 In-App Purchase products

Subscription tier(s) to configure. Final pricing decision by Steward.
Placeholders:
- Guardians+ Monthly — $4.99/month
- Guardians+ Annual — $39.99/year (~33% saving)
- Auto-renewable subscription group

Free tier requires no IAP configuration but must be described in-app
per Apple guideline 3.1.2.

### 4.5 Screenshots + description + keywords

Delivered by omens agent + Steward:
- Screenshots at all five required sizes (6.9" iPhone Pro Max, 6.5",
  5.5", iPad Pro 13", iPad Pro 12.9")
- 4000-char description
- Subtitle
- Keywords (100 chars, comma-separated)

**Cross-reference:** the omens spec at
`omens/docs/APP_STORE_LANDING_SITE_SPEC.md` names iris to mirror the
site voice into the App Store listing when omens is ready.

---

## 5. Cross-agent handoff — omens (game-side) work

The following items are **iOS-app-side** and belong to the omens agent,
not iris. Enumerated here so nothing falls through the cross-agent
crack.

### 5.1 In-app "Delete my account" UI

**Apple guideline:** 5.1.1(v). Apps that let users create accounts
**must** provide a way for users to *initiate* account deletion inside
the app.

**Minimum viable implementation:** a Settings → Account → Delete Account
button that either (a) fires the same email flow (`mailto:` with prefilled
body to `support@guardians-of-olympus.ai`) or (b) presents a confirmation
UI and makes a backend call that triggers the deletion pipeline.

**Referenced by Privacy Policy §10.**

### 5.2 Age-of-consent enforcement by store region

**Regulation basis:** §2.8 above. iOS app reads the App Store region and
enforces the local age floor.

**Below-floor experience:** block sign-in with a message explaining
parental permission is required. Do NOT collect the underage user's
personal data.

### 5.3 Parental consent flow for under-16 EU users

For processing bases that rely on consent (GDPR Art. 6(1)(a)), users
below the member-state floor need parental permission. If we never rely
on consent (i.e., only "performance of contract"), this may not be
required — but implementing it defensively is prudent.

### 5.4 App Tracking Transparency (ATT) prompt

**Do NOT show the ATT prompt.** We do not use IDFA, do not track across
apps, do not participate in any advertising SDK. Apple's ATT prompt is
only required when the app *attempts to track* (per Apple's definition).
Showing the prompt when we don't track is confusing and violates the
"only present when needed" implicit convention.

Referenced by Privacy Policy §4 and §12.

### 5.5 Data-portability export (GDPR Art. 20)

**Regulation:** users have the right to receive their personal data in a
"structured, commonly used and machine-readable format." Minimum viable
implementation: a backend endpoint that returns a JSON dump of the
signed-in user's data (email, Apple Sign-In identifier, reading
position, subscription status, age confirmation flag, cause selection).

Serve from Settings → Data → Export My Data. Deliverable as JSON either
in-app or emailed to the account's email address.

### 5.6 Privacy policy link visible in app

**Apple guideline:** 5.1.1 requires a functional link to the privacy
policy inside the app (typically in Settings). Link to
`https://guardians-of-olympus.ai/privacy`.

### 5.7 Sign-in age confirmation checkbox

Referenced by Privacy Policy §4 and §11. A one-time checkbox at first
sign-in confirming age ≥ local floor. Store as a boolean flag against
the user identity — do not collect birth date.

### 5.8 Subscription auto-renewal disclosure at purchase

**Apple guideline:** 3.1.2. At the point of purchase, disclose:
- length of subscription
- cost per period
- auto-renewal terms
- how to cancel (Settings → Apple ID → Subscriptions)

Language must match the Terms §5 wording.

---

## 6. Cross-agent handoff — iris operationalization

Separate from compliance; captured here because the launch checklist
depends on it. Details in `iris/reactforce/guardians-of-olympus-ai/README.md`
§ "To-do to operationalize the workspace."

1. Root iris `package.json` — add aliases `guardians`, `buildGuardians`,
   `publishGuardians`, `deployAlphaGuardians` mirroring the
   templeathena block.
2. Workspace `package.json` — add `publishToStaticResources` script
   (invokes `scripts/managedPackage.js`).
3. `olympus-grid/force-app/ui/portal/default/customMetadata/Plugin.iris_deployment_path_guardians.md-meta.xml`
   — create following the `gpt` sibling as precedent.
4. First `publishGuardians` writes `staticresources/guardians/`; the
   accompanying olympus-grid PR pins the bundleId (5-way consistency —
   see `olympus-616/CLAUDE.md` § "Iris Portal Bundle Release").

**Not on the critical path for the App Store submission** — the site
ships via `publishCDN` to S3+CloudFront at
`https://guardians-of-olympus.ai` for the Apple Marketing URL.
`/portal/guardians/` is a Salesforce-portal duplicate for the managed
package release.

---

## 7. Infrastructure & domain

### 7.1 DNS + CloudFront + S3

**Domain:** `guardians-of-olympus.ai`

Ownership + registrar TBD — verify at launch. Confirm registration
status ≥ 30 days before launch to avoid a mid-launch expiry.

**Recommended stack:**
- S3 bucket `guardians-of-olympus-ai-bundle` (private) holding the
  static build
- CloudFront distribution serving the bucket, with:
  - `guardians-of-olympus.ai` and `www.guardians-of-olympus.ai` as
    alternate domain names
  - AWS Certificate Manager cert in us-east-1
  - Default root object: `index.html`
  - CloudFront function to append `/index.html` to directory URLs
    (`/privacy` → `/privacy/index.html`) so Apple's reviewer hitting
    the bare URL gets the prerendered content
  - Cache: public, max-age=300 (matches `publishCDN` script)
- Route 53 A/AAAA aliases to the CloudFront distribution

**Publishing:**
```bash
cd iris/reactforce/guardians-of-olympus-ai
npm run publishCDN
```

The workspace's `publishCDN-preflight.sh` script guards against stale
checkout publishes.

### 7.2 Email inbox provisioning

See §8 — all inboxes routed through the DNS provider's email forwarding
(or Google Workspace if we want fully hosted).

### 7.3 Backup & retention

- S3 versioning enabled on the bundle bucket (roll back to previous
  publish if a bad build ships)
- CloudFront invalidation on publish (via `publishCDN` script)
- Log retention: 90 days on CloudFront access logs (align with Privacy §8)

---

## 8. Contact inboxes to provision

**Deadline:** launch − 30 days. Apple's reviewer WILL email `support@`
during review and expects a response within 24 hours.

| Address | Purpose | Forwards to (initial) | SLA |
|---|---|---|---|
| `privacy@guardians-of-olympus.ai` | Privacy queries, GDPR rights requests, DPIA questions | Steward | 30 days response (7 days for deletion) |
| `support@guardians-of-olympus.ai` | General support + account-deletion path | Steward | 24 hours |
| `press@guardians-of-olympus.ai` | Press inquiries | Steward | Best-effort |
| `legal@guardians-of-olympus.ai` | Legal notices, DPA countersignatures, court orders | Steward | 5 business days |
| `dpo@guardians-of-olympus.ai` | LGPD Encarregado; informal DPO for other regimes | Steward | 30 days |

**Setup options (choose one):**
1. **Google Workspace** — full hosting, $6/user/month per address. Best
   for volume + audit trail.
2. **Cloudflare Email Routing** — free forwarding, no MX cost, no
   sending capability (replies would need a "reply-as" configured
   elsewhere).
3. **Registrar email forwarding** — free but limited features.

**Recommended for launch:** Cloudflare Email Routing (free, forwards to
Steward's primary inbox). Upgrade to Workspace if volume grows.

**Done-criteria:**
1. Each address receives a test email successfully.
2. Test email from Apple-tester alias reaches Steward within 60 seconds.
3. Reply capability configured (either Workspace outbound OR "send as"
   from Steward's primary account).

---

## 9. Tithe ledger — public URL

**Regulation basis:** none — this is a **contractual** commitment we made
in Terms §6.

**Terms §6 says:** "A public ledger of tithes paid to each cause will be
maintained at a URL we publish before the first distribution."

**Decision required — where does the ledger live?**

| Option | Pros | Cons |
|---|---|---|
| New `/tithe` route on the marketing site | Discoverable, matches domain | Requires iris publish per update |
| Static GitHub-published page (`ledger.guardians-of-olympus.ai`) | Auto-updated from a CSV/JSON in a repo | Cross-origin |
| Dashboard inside `olympus-grid` portal | Ties into Plutus ledger already tracking tithes | Requires portal auth for public view |
| Dedicated Notion / Airtable public page | Zero engineering | Not sovereign; requires external service |

**Recommended default:** `/tithe` route on the marketing site (option 1).
Auto-generated by a Plutus → static-JSON build step. Ledger is
append-only, one row per distribution.

**Timing:** URL must be live before the FIRST distribution, not before
launch. Distributions are quarterly — first distribution ≈ 2026-10-31
(Q3 close). So we have until roughly launch + 90 days to ship.

**Done-criteria:**
1. Ledger URL committed in Terms §6 (currently promised but not URL'd).
2. Static rendering pipeline pointing at Plutus data.
3. First quarterly distribution recorded before Q3 2026 close.

---

## 10. Post-launch triggers

Compliance thresholds that fire based on scale, not on the calendar.
Add to Steward's dashboard.

| Trigger | Threshold | Action | Regulation |
|---|---|---|---|
| Volume-based DPO requirement | 250+ employees OR "regular and systematic monitoring on a large scale" | Appoint formal DPO | GDPR Art. 37 |
| Korean domestic rep | 1,000,000+ Korean users | Appoint domestic representative | PIPA |
| ICO fee tier bump | Turnover > £632k | Move to Tier 2 (£60/yr) | UK data-protection fee schedule |
| ICO fee tier bump 2 | Turnover > £36m | Move to Tier 3 (£2,900/yr) | UK data-protection fee schedule |
| California threshold | $25M revenue OR 100k+ CA data subjects OR 50%+ revenue from selling data | Additional CPRA obligations | CCPA §1798.140(d) |
| India Significant Data Fiduciary | Government notification | Formal DPO + DPIA obligations increase | DPDP Act §10 |
| Brazil operations scale | Not scale-based; regulatory guidance | Formal DPO (Encarregado) | LGPD Art. 41 |
| Age-consent legal drift | Member-state law change | Update matrix (§2.8) | GDPR Art. 8 |
| New subprocessor added | Any | Sign DPA + update Privacy §5 + update RoPA | GDPR Art. 28 + 30 |
| New data category collected | Any | Update Privacy §3 + RoPA + nutrition label + DPIA refresh | GDPR Art. 30 + Apple guideline |

---

## 11. Ownership matrix

| Area | Owner | Backup |
|---|---|---|
| Strategic launch decisions | Steward | — |
| Marketing site content + build + publish | `guardians-of-olympus` agent (iris workspace) | `alchemisthomer` |
| iOS app compliance implementation | `omens` agent (game repo) | `alchemisthomer` |
| EU / UK Representative onboarding | Steward (with vendor) | Legal counsel |
| ICO registration | Steward | Legal counsel |
| Subprocessor DPA signature | Steward | Legal counsel |
| DPIA authorship | Steward | Privacy consultant |
| Rights-request response (privacy@) | Steward | Support delegate once hired |
| Deletion-request execution (support@) | Steward | Support delegate once hired |
| Breach response — coordination | Steward | EU Rep + `alchemisthomer` |
| Tithe ledger publication | Plutus service + Steward | — |
| App Store Connect submission | Steward | — |
| DNS + CloudFront + S3 | Steward + `alchemisthomer` | — |
| Post-launch trigger monitoring | Steward (or delegated to compliance officer if hired) | — |

---

## 12. Placeholder values in site code

Every value below is currently a placeholder or unset. **Each must be
replaced with a real value before the corresponding compliance
milestone.** File paths are relative to
`iris/reactforce/guardians-of-olympus-ai/`.

| File | Constant / string | Current value | Replace with | Deadline |
|---|---|---|---|---|
| `src/lib/site-info.ts` | `EU_REPRESENTATIVE` | Placeholder "To be appointed…" | Vendor legal name + EU postal address + dedicated email | Launch − 14 days |
| `src/lib/site-info.ts` | `UK_REPRESENTATIVE` | Placeholder "To be appointed…" | Vendor legal name + UK postal address + dedicated email | Launch − 14 days |
| `src/lib/site-info.ts` | `LEGAL_JURISDICTION` | `'Delaware, United States'` | Verify — CloudPremise LLC's actual state of formation | Verify pre-launch |
| `src/lib/site-info.ts` | `LEGAL_GOVERNING_LAW` | `'the State of Delaware, United States of America'` | Same — align with actual jurisdiction | Verify pre-launch |
| `src/lib/site-info.ts` | `CONTACT.privacy` | `'privacy@guardians-of-olympus.ai'` | Verify inbox provisioned | Launch − 30 days |
| `src/lib/site-info.ts` | `CONTACT.support` | `'support@guardians-of-olympus.ai'` | Verify inbox provisioned | Launch − 30 days |
| `src/lib/site-info.ts` | `CONTACT.press` | `'press@guardians-of-olympus.ai'` | Verify inbox provisioned | Launch − 30 days |
| `src/lib/site-info.ts` | `CONTACT.legal` | `'legal@guardians-of-olympus.ai'` | Verify inbox provisioned | Launch − 30 days |
| `src/lib/site-info.ts` | `CONTACT.dpo` | `'dpo@guardians-of-olympus.ai'` | Verify inbox provisioned | Launch − 30 days |
| `src/views/Support.tsx` | `APP_REVIEW_DIRECT` | `'greg@cloudpremise.com'` | Verify current Steward direct email | Verify pre-launch |
| `src/views/Terms.tsx` | Tithe ledger URL | Promised but not linked | Real URL from §9 decision | Before first distribution (~launch + 90 days) |
| `public/llms.txt` | Contact block | Uses `.ai` addresses | Sync with any inbox changes | Launch − 30 days |

**After every placeholder replacement, rebuild + republish:**
```bash
cd iris/reactforce/guardians-of-olympus-ai
npm run publishCDN
```

---

## 13. Timeline synthesis — ordered checklist to 2026-07-17

Working backwards from the 2026-07-17 launch date. Slack built in for
Apple's 1–3 day review window.

**T − 45 days (≈2026-06-02, retrospectively):** Select EU/UK
Representative vendor (recommendation: Prighter).

**T − 30 days (≈2026-06-17):**
- ☐ Provision contact inboxes (§8)
- ☐ Verify DNS + registrar status for `guardians-of-olympus.ai`
- ☐ Verify legal entity name + state of formation for CloudPremise LLC

**T − 21 days (≈2026-06-26):**
- ☐ Sign EU Rep + UK Rep agreements (§2.1, §2.2)
- ☐ Register with ICO (§2.3)
- ☐ Sign all subprocessor DPAs (§2.4)
- ☐ Complete DPIA (§2.5)
- ☐ Start RoPA (§2.6)
- ☐ Draft Breach Response Plan (§2.7)
- ☐ Publish age-consent matrix (§2.8)
- ☐ Decide tithe ledger URL (§9)

**T − 14 days (≈2026-07-03):**
- ☐ Update `EU_REPRESENTATIVE` + `UK_REPRESENTATIVE` placeholders (§12)
- ☐ Rebuild and republish marketing site to CDN
- ☐ Configure App Store Connect listing (§4)
- ☐ Align Privacy Nutrition Label (§4.1)
- ☐ Omens: in-app "Delete my account" (§5.1)
- ☐ Omens: age-of-consent enforcement (§5.2)
- ☐ Omens: ATT verification (§5.4)

**T − 7 days (≈2026-07-10):**
- ☐ Omens: data-portability export endpoint (§5.5)
- ☐ Submit for App Review
- ☐ Verify all URLs resolve; hard-refresh test in three browsers
- ☐ Verify support@ receives Apple's reviewer test email

**T − 3 days (≈2026-07-14):**
- ☐ Final URL + nutrition label reconciliation (§15)
- ☐ Ensure Steward has 24/7 access to App Store Connect and reviewer email

**T = 0 (2026-07-17):** App Store live.

**T + 30 days:** first ledger audit, first monthly compliance retrospective.

**T + 90 days (≈2026-10-15):** first tithe distribution + ledger URL live.

---

## 14. SOC-2 cross-reference

Every workstream in this document contributes evidence for one or more
SOC-2 Trust Services Criteria control identifiers per
`foundation/eos/SOC2-CONTROL-MAPPING.md`. Below is the mapping for
auditor-dashboard rollup.

| Workstream | Controls demonstrated |
|---|---|
| EU / UK Representative onboarding | CC9.2 (Vendor & Business Partners) |
| Subprocessor DPAs | CC9.2 (Vendor & Business Partners) |
| DPIA | CC3.1 (Identify Risks), CC3.2 (Estimate Risk) |
| RoPA | CC2.1 (Internal Communications), CC5.3 (Policies) |
| Breach Response Plan | CC7.4 (Respond to Incidents), CC7.5 (Recover from Incidents) |
| Age-consent enforcement matrix | CC1.3 (Management Philosophy), CC6.2 (Register & Authorize) |
| CCPA / LGPD / DPDP rights response workflow | CC6.2 (Register & Authorize), CC2.3 (Communications with Stakeholders) |
| App Store Connect nutrition label | CC2.2 (External Communications) |
| Domain + CDN + inbox provisioning | CC5.2 (Technology), CC6.1 (Logical Access — Restrict) |
| Tithe ledger publication | CC2.2 (External Communications), CC4.1 (Monitoring Activities — Ongoing) |
| Post-launch trigger monitoring | CC4.1 (Monitoring Activities — Ongoing), CC4.2 (Reporting Deficiencies) |

Cycle authors picking up any workstream above should add the mapped
identifiers to their cycle's `controls:` frontmatter so the EOS
attestation dashboard rolls up.

---

## 15. Launch-readiness verification — must all be green

Before clicking "Submit for Review" in App Store Connect, verify every
line below is ☑. If any line is ☐, do not submit.

- ☐ `/`, `/privacy`, `/terms`, `/support` all resolve on
  `https://guardians-of-olympus.ai` and return HTTP 200 with correct
  title + description in `<head>`.
- ☐ `robots.txt` and `sitemap.xml` publicly reachable, sitemap lists all
  four routes.
- ☐ EU Representative real name + address in Privacy §13 (no placeholder).
- ☐ UK Representative real name + address in Privacy §13 (no placeholder).
- ☐ ICO registration number in Privacy footer or §13.
- ☐ Every subprocessor in Privacy §5 has a signed DPA on file.
- ☐ DPIA committed to `foundation/eos/` (or equivalent), signed by Steward.
- ☐ RoPA committed and covers every processing activity in Privacy §3.
- ☐ Breach Response Plan committed to `foundation/`.
- ☐ Every contact inbox in §8 receives a test email successfully.
- ☐ App Store Connect Privacy Nutrition Label matches Privacy §3 + §4
  verbatim.
- ☐ App Store Connect age rating = 12+.
- ☐ App Store Connect URLs — Marketing, Privacy, Support, EULA — all
  point at the four `/` `/privacy` `/support` `/terms` routes.
- ☐ App distribution — China and Russia deselected.
- ☐ Omens: in-app account-deletion flow implemented + tested.
- ☐ Omens: age-of-consent enforcement per store region tested.
- ☐ Omens: ATT prompt NOT presented (verified in TestFlight build).
- ☐ Omens: data-portability export endpoint tested.
- ☐ Omens: subscription auto-renewal disclosure matches Terms §5 wording.

When all green: submit.

---

## Appendix A: Regulation reference URLs

Verify these URLs at activation time — regulator URLs drift. Do not
rely on the specific paths without checking.

- **GDPR (EU 2016/679):** eur-lex.europa.eu / gdpr-info.eu (unofficial but
  well-maintained)
- **UK-GDPR + DPA 2018:** ico.org.uk/for-organisations/uk-gdpr-guidance
- **ICO fee:** ico.org.uk/for-organisations/data-protection-fee
- **EDPB (EU DPA umbrella):** edpb.europa.eu
- **EDPB DPIA guidance:** edpb.europa.eu/our-work-tools/our-documents (WP248 rev.01)
- **CCPA / CPRA:** oag.ca.gov/privacy/ccpa; cppa.ca.gov
- **LGPD:** gov.br/anpd
- **PIPEDA:** priv.gc.ca
- **Quebec Law 25:** cai.gouv.qc.ca
- **APPI (Japan):** ppc.go.jp
- **PIPA (Korea):** pipc.go.kr
- **DPDP Act (India):** meity.gov.in
- **Australian Privacy Act (APPs):** oaic.gov.au
- **Swiss nFADP / FDPIC:** edoeb.admin.ch
- **Apple App Store Review Guidelines:** developer.apple.com/app-store/review/guidelines
- **Apple Standard EULA:** apple.com/legal/internet-services/itunes/dev/stdeula
- **AWS DPA:** aws.amazon.com/service-terms
- **Google Cloud DPA:** cloud.google.com/terms/data-processing-addendum
- **Salesforce DPA:** salesforce.com/company/dpa
- **OpenAI DPA:** openai.com/policies (check current path)
- **Anthropic DPA:** anthropic.com/legal (or contact privacy@anthropic.com)
- **xAI DPA:** x.ai/legal (verify at time of signing)

---

## Appendix B: Related documents

- `iris/reactforce/guardians-of-olympus-ai/README.md` — marketing site build + publish workflow
- `iris/reactforce/guardians-of-olympus-ai/src/views/Privacy.tsx` — the deployed Privacy Policy (16 sections)
- `iris/reactforce/guardians-of-olympus-ai/src/views/Terms.tsx` — the deployed Terms of Service (17 sections)
- `iris/reactforce/guardians-of-olympus-ai/src/lib/site-info.ts` — placeholder constants updated per §12
- `omens/docs/APP_STORE_LANDING_SITE_SPEC.md` — the original 2026-06-30 spec
- `omens/docs/MANIFESTO.md` — founder voice; source for /privacy voice
- `foundation/eos/SOC2-CONTROL-MAPPING.md` — the SOC-2 control catalog this doc's workstreams contribute to
- `foundation/ROADMAP.md` — 2026-07-17 launch window
- `foundation/AUTHORITY.md` — decision-rights framing for §11 ownership matrix
- `foundation/BOOKS.md` — public-domain library canon referenced in Terms §7

---

**Provenance.** Drafted 2026-06-30 by the `guardians-of-olympus` agent
during a Steward-directed session that built the marketing site and
identified the off-site prerequisites the site's promises rest on. To
activate: read § 0 (Executive Summary), select vendor for §2.1, start
the T − 45 clock. Every subsequent item follows.

Γένοιτο.
