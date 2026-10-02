---
pitch: "Public developer portal at olympus-gpt.ai"
---

# olympus-gpt.ai — developer portal open work + 224-route forecasted API surface

> File: `brain_2.7.eos-8.md` — **eighth primary EOS cycle on the `brain/2.7.x.x` family** (after HUD `eos-1`, aeon `eos-2`, argos `eos-3`, kronos `eos-4`, brain-genesis `eos-5`, poseidon `eos-6`, iris `eos-7`).
>
> Type: **initiative / tracker** — spans multiple repos, multiple PRs, multiple backend gods. Owner: iris-agent (gpt session).
>
> Source: Steward-provided gpt open-work inventory 2026-09-25.

| | |
|---|---|
| **Branch family** | `brain/2.7.x.x` |
| **Cycle ordinal** | `eos-8` (eighth primary on 2.7 family) |
| **Status** | `In Development` — iris PR #136 open (`+8,361/−7`, MERGEABLE); iris PR #135 (2.7 consolidation, tracked by [`brain_2.7.eos-7.md`](brain_2.7.eos-7.md)) is the adjacent context; forecast is 224 routes across 24 capabilities; live-wired subset is ~5 direct SPA endpoints. Steward verbal §5 ratification 2026-09-25 via direction to open the card. Formal §5 checkboxes pending. |
| **Opened** | 2026-09-25 |
| **Prior cycle** | `brain_2.7.eos-7` (iris fleet — PR #136 is one of iris's two open PRs; this cycle scopes the olympus-gpt initiative on top of iris's workspace-level tracking) |
| **Theme** | olympus-gpt.ai as the public developer portal — landing the forecasted API surface at `/gpt/docs`, closing the 4 backend handoffs, refreshing the vision doc (MVP target 2026-07-17 slipped 10 weeks), and picking the DNS cutover from `www.olympus-grid.ai` → `olympus-gpt.ai`. |
| **Feedback inputs** | Steward gpt open-work inventory 2026-09-25; vision doc `olympus-616/docs/olympus-gpt-vision.md` (2026-05-14, stale); whitepaper `olympus-616/docs/whitepaper-agent-iaas.md`; iris PR #136 markdown corpus (source of truth for 224-route forecast); 4 handoff docs in `olympus-616/docs/`; memory `project_olympus_gpt_ai_vision` |
| **Estimated effort** | Multi-cycle. This cycle's target = **PR #136 merged + coverage matrix filled + vision refresh + handoff audit + DNS cutover decision**. Follow-up cycles per §10.4 pick up remainder. |
| **Actual effort** | — |
| **Cross-reference** | [`brain_2.7.eos-7.md`](brain_2.7.eos-7.md) — iris fleet cycle (owns PR #135 + workspace inventory including `olympus-grid-ai/` which is olympus-gpt's canonical workspace) |

---

## Discipline principle

> *The developer portal exposes primitives; every primitive fans into concrete routes. The corpus at `iris/reactforce/olympus-grid-ai/src/docs/api/**` labels every one of the 224 routes IMPLEMENTED / PARTIAL / PROPOSED — **design/reality drift is impossible to hide by construction**. The forecast is the contract; live-wiring is the delivery. **The MVP target slipped 10 weeks — reset it, don't backdate.***

Two consequences enforced across sections:

1. **Corpus is source of truth for design vs. implementation state.** No parallel tracking sheet. The 224-route labels in PR #136 files ARE the coverage record; the coverage matrix in §9 references them, does not duplicate them.
2. **`reactforce/olympusgpt/` is retired.** PR #135 dropped PR #130 as no-op; the canonical workspace is `reactforce/olympus-grid-ai/`. Boot-prompt instructions saying "consolidate into olympusgpt" are stale — do not follow them.

---

# § Steward-authored (top half)

## Canonical attestation statement

> *"I attest that olympus-gpt.ai's developer portal lands the 224-route forecasted API surface via iris PR #136 at `/gpt/docs`; that the 4 backend handoffs (Proteus / Plutus / Keys / Quota) are each verified shipped or explicitly rescheduled; that the vision doc is refreshed with post-2026-07-17 reality and a new MVP target; that the coverage matrix per each of the 24 documented capabilities is filled (live-wired / docs-only / deferred); that the DNS cutover plan for `olympus-gpt.ai` (currently unrouted; production on `www.olympus-grid.ai`) is either scheduled OR explicitly deferred to a later cycle; and that `reactforce/olympusgpt/` retirement is honored (canonical workspace = `reactforce/olympus-grid-ai/` per PR #135's PR-#130 drop)."*

## §1 User story

- **§1.1** As **any developer landing on olympus-gpt.ai** I want **`/gpt/docs` to render the full 224-route forecasted API surface** so that **the developer portal exposes what the platform actually offers, labeled by IMPLEMENTED / PARTIAL / PROPOSED state per route**.
- **§1.2** As **the Steward tracking the four backend handoffs** I want **each verified shipped OR explicitly rescheduled** so that **the "unverified" state doesn't rot silently 4+ months after the original PR chain**.
- **§1.3** As **the fleet's public-marketing surface** I want **the vision doc refreshed with post-2026-07-17 reality + a new MVP target** so that **future cycles have a real target, not a slipped date**.
- **§1.4** As **the operator managing DNS** I want **the `olympus-gpt.ai → app.olympus-grid.com/*` (or wherever) cutover decision made** so that **the brand-strings sweep + Plugin__mdt domain override + DNS routing land coherently OR the deferral is explicit**.
- **§1.5** As **the iris-agent gpt session** I want **the branch discipline confirmed** — currently on `iris_2_7_consolidation` (per-thought); should gpt-line work move to a fresh `cycle/eos-<N>` OR continue on PR #135 branch — per cross-cycle sibling `brain_2.7.eos-5.5`.

## §2 Acceptance criteria (Steward Section 7 "Definition of done" lifted into observable form)

- **§2.1 (PR #136 merged OR reset)** — iris PR #136 either squash-merges to `brain/2.7.x.x` OR is explicitly closed with a follow-up scope + timeline documented in this cycle's §13.
- **§2.2 (Plutus P0 security handoff verified OR rescheduled)** — audit plutus commits since 2026-05 for "server-side stream filter + ingest auth"; either verified shipped OR explicitly scheduled in a follow-up cycle.
- **§2.3 (Vision doc refreshed)** — `olympus-616/docs/olympus-gpt-vision.md` updated with 2026-09-25 reality + new MVP target date; delta from 2026-05-14 version is legible.
- **§2.4 (Coverage matrix filled)** — for each of the 24 documented capabilities (18 brain/1.7 + 6 brain/2.7), note "live-wired / docs-only / deferred" state. Source: cross-reference `olympus-grid-ai/src/**/*.{ts,tsx}` grep for `/v1/*` calls vs. `src/docs/api/**` markdown corpus. Owner: iris-agent gpt session per source.
- **§2.5 (DNS cutover decision)** — `olympus-gpt.ai` DNS routing either scheduled with a target date + Plugin__mdt domain override plan OR explicitly deferred to a later cycle in §13.

## §3 Non-functional requirements

- **§3.1 (Corpus stays authoritative)** — the 224-route markdown corpus in PR #136 (`src/docs/api/**`) is the single source of truth for what's documented vs. implemented. Any coverage-matrix scratch this cycle produces is derived, not primary.
- **§3.2 (No parallel-universe workspace)** — `reactforce/olympusgpt/` is retired; do not resurrect. All work happens in `reactforce/olympus-grid-ai/` per PR #135 clarity.
- **§3.3 (Live URL untouched during cycle)** — current production is `www.olympus-grid.ai`; cycle does NOT break it. DNS cutover is scoped separately per §2.5.
- **§3.4 (Handoff audits are documentary)** — verifying "shipped or not" for the 3 unverified handoffs is a code + PR + SSM audit; does NOT require re-implementing the handoff.
- **§3.5 (Iris bundle ceremony green for PR #136 merge)** — per olympus-grid CLAUDE.md § Iris Bundle Ceremony, `validate-iris-bundles.sh` must pass before PR #136 merges since it touches static resources for `olympus-grid-ai/`.
- **§3.6 (Vision-doc refresh is Steward-authored)** — this cycle triggers the refresh; the refresh itself is a Steward text edit, not an agent decomposition.

## §4 Feedback inputs

| FB# | Title | Body excerpt |
|-----|-------|--------------|
| — | Steward gpt open-work inventory 2026-09-25 | Full context: 2 open PRs, 224-route forecast, 4 handoffs, 5 non-technical blockers, 7-item DoD |
| — | Vision doc `olympus-616/docs/olympus-gpt-vision.md` | Stamped 2026-05-14; MVP target 2026-07-17 slipped 10 weeks |
| — | Whitepaper `olympus-616/docs/whitepaper-agent-iaas.md` | Agent-IaaS positioning; supporting narrative |
| — | Memory `project_olympus_gpt_ai_vision.md` | Public developer portal; Agent-IaaS whitepaper; playgrounds v1, cluster APIs v2 |
| — | Iris PR #136 corpus | 34 markdown files under `src/docs/api/**` — the 224-route forecast |
| — | Iris PR #135 workspace clarity | PR #130 dropped as no-op; `reactforce/olympusgpt/` retired |
| — | 4 handoff docs | proteus (✅ merged), plutus (unverified), keys (unverified), quota (unverified) |
| — | Sibling iris fleet cycle | `brain_2.7.eos-7.md` — PR #136 also captured there in workspace inventory (co-owned) |
| — | Branch-convention sibling | `brain_2.7.eos-5.5.md` — cycle/eos-<N> vs. per-thought decision applies here too |

## §5 Steward approval gate

- [ ] Discipline principle acknowledged (corpus authoritative; olympusgpt workspace retired; slipped-target reset)
- [ ] Canonical attestation statement locked
- [ ] Story locked (§1.1 – §1.5)
- [ ] Acceptance criteria locked (§2.1 – §2.5)
- [ ] NFRs locked (§3.1 – §3.6)
- [ ] **Owner confirmed** for each of the 3 unverified handoffs (Plutus P0 / Keys hard-delete / Quota+throttle)
- [ ] **Vision doc refresh authorized** — Steward-authored text edit
- [ ] **DNS cutover scope decision** — schedule now OR defer to a later cycle (§2.5)
- [ ] **Branch discipline decision** — fresh `cycle/eos-<N>` for gpt-line work OR continue on PR #135's branch (per `brain_2.7.eos-5.5`)
- [ ] **PR #136 disposition** — merge as-is OR split OR close-and-reset
- [ ] Approved to execute — signed: **__________** **__________**

---

# § Agent-authored (bottom half)

## §6 Layer impact map

### §6.A Repos + surfaces

| Repo / surface | Change |
|---|---|
| iris (`reactforce/olympus-grid-ai/`) | PR #136 lands `src/docs/api/**` corpus + viewer + build script + routes + SEO + sitemap |
| olympus-grid | Iris bundle ceremony gate (`validate-iris-bundles.sh`); Plugin__mdt domain override if DNS cutover in-cycle |
| olympus-616 parent | vision doc refresh (`docs/olympus-gpt-vision.md`); whitepaper adjacent |
| plutus (backend) | Handoff verification — server-side stream filter + ingest auth (audit only) |
| olympus-grid Apex OR node (backend) | Keys hard-delete `?force=true` verification (audit only) |
| ares (backend) | Quota + throttle enforcement audit (DynamoDB token buckets; 429 semantics) |
| DNS + Plugin__mdt | `olympus-gpt.ai` cutover — scheduled OR deferred |

### §6.B 24-capability inventory (source: PR #136 corpus at `iris/reactforce/olympus-grid-ai/src/docs/api/**`)

**brain/1.7 — 18 IMPLEMENTED / PARTIAL capabilities:**
aeon · apollo · ares · argos · athena · chronos · conventions · delphi · hera · hermes · hestia · mnemosyne · orion · plutus · poseidon · prometheus · proteus · scaffolds

**brain/2.7 — 6 PROPOSED / design-stage capabilities:**
accountability · aeon · conventions · memory-and-temporal · terminology · zeus

**Design bundle (cross-cutting, ships with PR #136):**
audit-and-recursion · declaration-fields · examples · human-interaction · intelligences · reconciler

**Route count checkpoint:** 224 routes total. Each labeled IMPLEMENTED / PARTIAL / PROPOSED in its own doc — coverage matrix per §2.4 is derived from these labels + SPA grep, not a parallel tracker.

### §6.C Live-wired subset (baseline for coverage-gap tracking)

Direct SPA fetches from `olympus-grid-ai/src/**/*.{ts,tsx}` — 5 endpoints:
- `/v1/apollo/speak`
- `/v1/apollo/music/generate`
- `/v1/grid/clusters/me`
- `/v1/hestia/api/applications`
- `/v1/identity/keys`

Plus via `src/lib/{chronos,plutus,proteus}.ts` wrappers — coverage-matrix pass per §2.4 enumerates the wrapped surfaces.

## §7 Schema deltas

None on the SF / backend side. Iris PR #136 introduces `src/docs/api/**` corpus files (markdown), a hand-rolled markdown viewer, and derived routes + SEO metadata + sitemap generation — all iris-side scaffolding, no backend schema.

## §8 Service contracts

The 224-route surface **is** the contract, published as the corpus at PR #136's `src/docs/api/**`. This ticket does NOT enumerate the routes inline — the corpus is authoritative. Route labels (IMPLEMENTED / PARTIAL / PROPOSED) per doc are the machine-checkable state.

## §9 Telemetry assertions

- **§9.GPT-1 (PR #136 merges green)** — bundle ceremony green, CI green, squash-merge to `brain/2.7.x.x` on `iris`. Post-merge `/gpt/docs` route resolves at `app.olympus-grid.com/gpt/docs` (or wherever) and renders the 34 corpus files.
- **§9.GPT-2 (Coverage matrix filled)** — a matrix artifact under `foundation/eos/cycle/04_in_development/eos-8-coverage-matrix.md` (or equivalent path) with 24 rows × {live-wired / docs-only / deferred} — attached to §13 at close.
- **§9.GPT-3 (Vision doc refresh)** — `git diff` on `olympus-616/docs/olympus-gpt-vision.md` shows a non-trivial update dated ≥ 2026-09-25 with new MVP target.
- **§9.GPT-4 (Plutus P0 handoff verified OR rescheduled)** — either a plutus commit reference OR a follow-up cycle ticket link.
- **§9.GPT-5 (Keys hard-delete handoff verified OR rescheduled)** — same shape as §9.GPT-4.
- **§9.GPT-6 (Quota+throttle handoff verified OR rescheduled)** — same.
- **§9.GPT-7 (DNS cutover decision recorded)** — scheduled with target date + plan OR explicitly deferred with link to future cycle.
- **§9.GPT-8 (Workspace-retirement rule held)** — grep across iris HEAD post-merge for `reactforce/olympusgpt/` returns zero references outside historical git-log.

## §10 Execution plan

### §10.1 PR #136 pre-merge
1. **§5 rulings signed** on all four Steward decisions (PR disposition, handoff owners, vision refresh, DNS cutover, branch discipline).
2. **Iris bundle ceremony** — `olympus-grid/scripts/validate-iris-bundles.sh` returns 0 for the `olympus-grid-ai` static resource state pre-merge.
3. **Coverage-matrix authoring pass** — iris-agent gpt session walks 24 capability docs vs. SPA grep; produces the matrix artifact per §9.GPT-2.

### §10.2 Merge + fleet render
4. **PR #136 squash-merges** to `brain/2.7.x.x` (or ports to fresh `cycle/eos-<N>` per §5 branch decision).
5. **Post-merge**: `/gpt/docs` renders. Verified per §9.GPT-1.

### §10.3 Handoff audits (parallel with §10.1-§10.2)
6. **Plutus P0** — audit plutus commits since 2026-05; document verified-or-rescheduled.
7. **Keys hard-delete** — check IdentityKey Apex/Node for `?force=true` semantics; document verified-or-rescheduled.
8. **Quota + throttle** — check ares api-int for DynamoDB token buckets + 429 semantics; document verified-or-rescheduled.

### §10.4 Vision doc + DNS
9. **Steward refreshes** `olympus-616/docs/olympus-gpt-vision.md` (Steward-authored per §3.6).
10. **DNS cutover decision** recorded per §5 ruling — schedule OR defer.

### §10.5 Follow-up cycles (deferred out of this cycle's scope)
- **Hash routing for deep-links** (`/docs/proteus`, `/app/playground/athena`)
- **OpenAPI / Swagger UI mount**
- **Marketing landing rework** — sell the five services above the fold
- **Launcher card** for olympus-616 dev launcher (infra tier)
- **Per-event detail modal in Plutus dashboard + copy-curl per event**
- **Brand strings sweep** — `olympus-grid.ai` → `olympus-gpt.ai` (when DNS cutover happens)
- **Per-capability implementation cycles** — each brain/2.7 PROPOSED capability (accountability · aeon-v2 · conventions-v2 · memory-and-temporal · terminology · zeus-cluster-provisioning) opens its own cycle when scoped.

### §10.6 §13 closeout
11. `git mv 04_in_development → 06_shipped` for this ticket when §2.1 – §2.5 all close.

## §11 Verification protocol

### §11.1 Without iPhone
- `curl https://app.olympus-grid.com/gpt/docs` (or scratch-org URL) post-merge — verify §9.GPT-1.
- `git grep -rn '/v1/' olympus-grid-ai/src --include='*.ts' --include='*.tsx'` — verify §6.C baseline.
- `git log --since 2026-05-01 --oneline olympus-616/plutus/` — verify §9.GPT-4.
- `sf apex run` or grep in olympus-grid Apex — verify §9.GPT-5.
- `grep -rn 'token-bucket\|rate-limit\|429' olympus-616/ares/api/src/` — verify §9.GPT-6.
- `dig olympus-gpt.ai` + Plugin__mdt query — verify §9.GPT-7.

### §11.2 Coverage matrix artifact
Hand-authored per capability doc walk; committed alongside cycle close.

## §12 Rollback plan

- **PR #136 revert**: single-commit squash-revert; `/gpt/docs` disappears; corpus stays in git history.
- **Vision doc refresh**: Steward-authored; revert is `git revert`.
- **DNS cutover deferral**: null-op — no live-URL change to revert.
- **Non-revertable**: coverage matrix state changes over time; matrix artifact is a snapshot at close, not a live tracker.

## §13 Closeout

*Filled at end of cycle.*

### What shipped
- PR #136 merge SHA + post-merge `/gpt/docs` render evidence.
- Coverage matrix (24 capabilities × {live-wired / docs-only / deferred}).
- Vision doc refresh diff + new MVP target date.
- Handoff audit outcomes per §9.GPT-4/5/6.
- DNS cutover decision + follow-up scope.

### What deferred (and why)
- Hash routing, OpenAPI mount, marketing rework, launcher card, per-event modal, brand-strings sweep — all §10.5 items become follow-up cycles.
- Per-capability implementation cycles for the 6 brain/2.7 PROPOSED capabilities — each opens as scoped.

### What surprised
- …

### Verification evidence
- Iris PR #136 merge SHA.
- `/gpt/docs` render screenshot / curl.
- Coverage matrix artifact link.
- Vision doc git diff.
- Handoff audit references (commit SHAs OR follow-up cycle links).
- DNS cutover plan doc OR deferral memo.

### Feedback that emerged from THIS cycle (seed for the next one)
- Coverage matrix drift over time — automate via CI check reading corpus labels?
- Per-capability cycle sequencing for brain/2.7 PROPOSED items.
- DNS cutover mechanics (Plugin__mdt override + CloudFront + Route53) — needs a proper cycle if scheduled.

### Memory updates
- Confirm memory `project_olympus_gpt_ai_vision` reflects post-cycle state.
- Note the corpus-as-source-of-truth pattern for future doc-portal cycles.

### Cycle close commit
- Iris PR #136 merge SHA + parent submodule bump SHA + CDK deploy log + follow-up cycle refs.
- Steward sign-off: **__________** **__________**

---

## References

- **Sibling iris fleet cycle:** [`brain_2.7.eos-7.md`](brain_2.7.eos-7.md) — co-owner of PR #136 tracking at the workspace level
- **Branch-convention sibling:** [`brain_2.7.eos-5.5.md`](brain_2.7.eos-5.5.md)
- **iris PR #136:** [feat(iris): olympus-gpt API documentation system at /gpt/docs](https://github.com/olympus-616/iris/pull/136)
- **iris PR #135:** [feat(iris): 2.7 pre-transition PR consolidation](https://github.com/olympus-616/iris/pull/135)
- **olympus-grid PR #252 (merged 2026-05-14):** [Proteus public API handoff shipped](https://github.com/olympus-616/olympus-grid/pull/252)
- **Vision:** `olympus-616/docs/olympus-gpt-vision.md` (stale, refresh scheduled by §9.GPT-3)
- **Whitepaper:** `olympus-616/docs/whitepaper-agent-iaas.md`
- **API forecast corpus:** `iris/reactforce/olympus-grid-ai/src/docs/api/**` (34 files, 224 routes)
- **Handoffs:** `olympus-616/docs/handoff-{proteus,plutus,keys-hard-delete,quota-throttle}-*.md`
- **Live URLs:** `https://www.olympus-grid.ai` (production) · `https://api-int.turtleshell.ai` (backend)
- **Memory:** `project_olympus_gpt_ai_vision.md`
- **EOS operating manual:** [`../README.md`](../README.md)
