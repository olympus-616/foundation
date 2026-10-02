---
pitch: "Game client speaks the sovereign cosmos-logos wire"
---

# Omens sovereign-envelope v2 primitives + wire-schema `EndpointUrl → Domain` cutover — per-repo attestation for PR #60

> File: `brain_1.7.eos-5.9.md` — **ninth sub-attestation of EOS-5**. Peer of `eos-5.7` (apollo) + `eos-5.8` (athena); omens is the client-side game engine consumer of the sovereign-envelope v2 wire the athena/apollo/turtleshell-web/turtleshell-ios PRs already shipped. This doc is omens' per-repo attestation loop.
>
> Source-of-truth: [`omens/docs/eos/OMENS_IN_PROGRESS.md`](../../../../omens/docs/eos/OMENS_IN_PROGRESS.md) — the EOS-agent extractable status sheet authored 2026-09-25. This EOS doc absorbs it into the fleet's kanban.

| | |
|---|---|
| **Branch family** | `brain/1.7.x.x` (rolls forward into `brain/2.7.x.x` without rename per Steward direction 2026-09-01; PR #60 base is `brain/2.7.x.x`) |
| **Cycle ordinal** | `eos-5.9` — peer sub-attestation of EOS-5. |
| **Status** | `In Development` — reconciliation cycle. PR #60 open on `brain/2.7.x.x` since 2026-08-31 (`+511 / -5`, 3 commits); tree clean, up-to-date with origin. **Merge blocked** on olympus-grid `/v1/grid/master/grid/clusters/me` returning `"domain"` (per commit `c822ea6` hard cutover). Steward verbal §5 ratification 2026-09-25 via direction to open the ticket. Formal §5 checkboxes pending. |
| **Opened** | 2026-09-25 |
| **Closed** | — |
| **Prior cycle** | `brain_1.7.eos-5.5` (BYOK / sealed-at-capture credential sovereignty — the umbrella). Sibling per-repo attestations: `eos-5.7` (apollo) + `eos-5.8` (athena). |
| **Theme** | Ship the omens client half of the sovereign-envelope-v2 wire — new `SealForStorageAsync` + `SealForWireAsync` primitives; HANDOFF entry for the 2026-07-07 cross-repo v2 overnight; the load-bearing `ClusterInfo.EndpointUrl → Domain` wire-schema cutover (HUD §L7 identity refactor). **The three cross-repo v2 attestation siblings already shipped; omens is the last leg.** |
| **Feedback inputs** | Source status sheet 2026-09-25; PR #60 verification doc `omens/docs/2_7_migration.md`; sovereign-AI wire contract `omens/docs/eos/EOS_5_4_SOVEREIGN_AI_UI_BRIEF.md`; 2026-07-07 overnight HANDOFF entry (cross-repo v2 correlation id `5c0c7c04-64bf-4549-9484-109f5e87e01c`); brain_2.7.eos-1 §6.B (names omens #60 as a dependency crossing that cycle for the domain rename) |
| **Estimated effort** | Implementation landed (3 commits, +511 / -5). Remaining: pre-merge re-verification of cross-repo v2 primitives; olympus-grid domain-rename coordination (BLOCKING); merge; both `eos-mint-and-run.sh` variants green; post-merge v2 storage/wire migration filed as follow-up. |
| **Actual effort** | — |

---

## Why this doc exists

Omens PR #60 straddles TWO cascades:

1. **BYOK / sovereign-AI cascade** (governed by [`brain_1.7.eos-5.5.md`](brain_1.7.eos-5.5.md)) — commits `06f3f65` (sovereign envelope v2 primitives) + `5cac14a` (HANDOFF). This is the primary attestation theme; sibling per-repo docs exist for apollo (5.7) and athena (5.8). Omens is the fourth cross-repo leg of the v2 wire (after athena #102, apollo #30, turtleshell-web #74, turtleshell-ios #32 all shipped).
2. **HUD wire-schema cascade** (governed by [`brain_2.7.eos-1.md`](brain_2.7.eos-1.md) §6.B) — commit `c822ea6` renames `ClusterInfo.EndpointUrl → Domain` matching L7's identity refactor. brain_2.7.eos-1 explicitly names omens #60 as a dependency crossing that cycle for this rename.

Rather than open two per-repo tickets for one PR, this doc is filed as the **BYOK peer sub-attestation** (primary theme, 2 of 3 commits BYOK-scoped, plus the entire post-merge follow-up scope is BYOK), and the HUD wire-schema rename is captured as a **cross-cycle merge-gate coordination in §10.2**. The HUD umbrella (brain_2.7.eos-1) already tracks the dependency direction from its side; this doc closes the loop from omens' side.

---

## Discipline principle

> *The v2 envelope is the god-key-rotation kill-switch (Steward property 2026-07-07). Client-cached v2 slots MUST become undecryptable on god-key rotation — that is the intentional property, not a bug. Every omens code path that persists a BYOK slot MUST go through the v2 sealed store; every wire turn MUST wrap with per-turn anti-replay. Silent fallback to v1 plaintext when the v2 primitives are available is **unacceptable** — omens either ships v2 or fails loud.*

Two consequences enforced across all sections:

1. **v2 primitives exist NOW; v2 callers migrate in the follow-up PR.** PR #60 adds `SealForStorageAsync` + `SealForWireAsync` but does NOT migrate any callers. The v1 `SealAsync` API is preserved untouched. **The follow-up PR (filed as a candidate in §10.4) is what makes v2 the primary path across ProviderChooserModal + AthenaChatController + ApolloController + settings v3.** This cycle attests the primitives; the follow-up attests the callers.
2. **The wire-schema cutover in commit `c822ea6` is a hard cutover — no graceful degradation.** If olympus-grid returns `"endpointUrl"` (or `"domain": null` on backfill-missed rows), Stage 4 cluster picker at login breaks. The merge gate is empirically verifiable via `curl … | jq` before flipping the switch.

---

# § Steward-authored (top half)

## Canonical attestation statement

> *"I attest that omens PR #60 lands three coordinated changes on `brain/2.7.x.x`: (1) the sovereign envelope v2 primitives `SealForStorageAsync` + `SealForWireAsync` in `SovereignEnvelopeSealer`, with `envelopeVersion: cosmos-logos-sealed-v2` for both `libsodium` + `apple-cryptokit` paths and the v1 `SealAsync` API preserved untouched; (2) the HANDOFF documentation of the 2026-07-07 cross-repo v2 overnight with correlation id `5c0c7c04-64bf-4549-9484-109f5e87e01c`; (3) the `ClusterInfo.EndpointUrl → Domain` wire-schema cutover matching HUD §L7's identity refactor, with `EndpointUrl` preserved as a computed property `$\"https://{Domain}\"`; that all four cross-repo v2 sibling PRs (athena #102, apollo #30, turtleshell-web #74, turtleshell-ios #32) remain green under the pre-merge `test-byok-v2.js` re-check; that olympus-grid's `/v1/grid/master/grid/clusters/me` returns `\"domain\"` non-null before PR #60 merges; that Stage 4 cluster picker at login continues to route real iPhone sessions correctly against `https://{Domain}` post-merge; and that both `eos-mint-and-run.sh` and `eos-prod-mint-and-run.sh` return every-step-PASS on the merged image."*

## §1 User story

- **§1.1** As **any player pasting a BYOK provider key into the omens Sovereign AI Settings modal** I want **that key sealed at paste time with the v2 storage-inner envelope** so that **the plaintext key never persists to `user://sovereign_ai.cfg` — only the sealed inner bytes plus slot metadata**. (Attested by the follow-up PR; PR #60 ships the primitive; §10.4.)
- **§1.2** As **any player initiating an athena chat turn or an apollo speak turn** I want **the stored sealed inner wrapped in a per-turn anti-replay outer envelope** so that **replays cannot succeed and every wire turn carries integrity + freshness**. (Attested by the follow-up PR; PR #60 ships the primitive.)
- **§1.3** As **the Steward rotating the god private key in SSM** I want **every stored v2 BYOK slot to become undecryptable and every athena/apollo response to return `envelope_storage_stale`** so that **the client wipes the slot and re-prompts, restoring credential sovereignty by kill-switch**.
- **§1.4** As **any player at Stage 4 of the login flow** I want **the cluster picker to resolve `https://{Domain}` from the olympus-grid `/v1/grid/master/grid/clusters/me` response** so that **the wire-schema `EndpointUrl → Domain` cutover produces a working session, not a rendering of `(endpoint not assigned)` per cluster row**.
- **§1.5** As **the fleet's per-repo attestation loop for omens** I want **PR #60 explicitly tied to (a) the BYOK cascade umbrella `brain_1.7.eos-5.5.md`, (b) the peer sibling attestations `eos-5.7` (apollo) + `eos-5.8` (athena), and (c) the HUD-umbrella cross-cycle merge-gate on olympus-grid `#345`** so that **the cross-repo coordination is legible from a single doc and the omens agent does not need to synthesize the picture at merge time**.
- **§1.6** As **the omens repo's future maintainers** I want **the branch-pattern grandfathering captured for this one PR** — head branch `@alchemisthomer/neuralpathway/4abf8ed-4b77826-20260831004654-consolidation-2.7` predates the `cycle/eos-<N>` convention; squash-merge collapses the naming inconsistency at brain level; the next omens cycle uses shared cycle branches per parent CLAUDE.md.

## §2 Acceptance criteria

**Source of truth: `OMENS_IN_PROGRESS.md` §5 (EOS attestation checklist).** Lifted to §-observable shape here.

### §2.A Local build + engine sanity (source §5 "Build")

- **§2.1 (Integration build)** — `cd omens/integration/csharp/Omens.Integration.CosmosLogos && dotnet build` returns 0 warnings / 0 errors.
- **§2.2 (Godot engine build)** — `cd omens/engines/godot && dotnet build` returns 0 warnings / 0 errors.
- **§2.3 (Godot editor opens)** — Godot editor loads the project without missing-dependency errors (symlink check per `omens/engines/godot/README.md` — the `assets/` + `content/` symlinks must exist; gitignored on purpose).

### §2.B Cross-repo v2 primitive attestation (source §5 "Cross-repo v2 primitives")

- **§2.4 (Athena + apollo deployed with v2)** — athena #102 + apollo #30 deployed to the target pantheon (dev ngrok OR prod ECS) BEFORE PR #60 merges. Per-repo attestations are `brain_1.7.eos-5.8` (athena) + `brain_1.7.eos-5.7` (apollo); each must be In-Development-or-later on the same target env.
- **§2.5 (test-byok-v2 harness green)** — `node athena/api/scripts/test-byok-v2.js` prints `✅ PROVENANCE MATCHED`. This is the pre-merge re-check; if the harness fails, PR #60 does NOT merge.

### §2.C Wire-schema cutover — the merge gate (source §5 "Cluster refactor BLOCKING")

- **§2.6 (`domain` present in cluster response)** — `curl … /v1/grid/master/grid/clusters/me | jq '.clusters[0] | keys'` includes `"domain"` non-null. Verified against the same env the merged image will target.
- **§2.7 (`Domain__c` backfilled non-null on existing rows)** — olympus-grid Cluster__c query returns zero rows with `Domain__c IS NULL AND EndpointUrl__c IS NOT NULL`. Verified by SOQL.
- **§2.8 (Stage 4 cluster picker resolves correctly)** — a live login on omens against the merged image reaches Stage 4, selects a cluster, and arrives at the library hub against `https://{Domain}` — NOT `(endpoint not assigned)`.
- **§2.9 (Diagnostics modal renders)** — dev-only diagnostics modal shows `Pantheon: {name} → https://{host}` populated non-empty.

### §2.D EOS cycle attestation (source §5 "EOS cycle both required")

- **§2.10 (Dev/ngrok/scratch EOS)** — `bash omens/eos/tools/eos-mint-and-run.sh --headless` reports every step PASS.
- **§2.11 (Prod/api-int/alpha-org EOS)** — `bash omens/eos/tools/eos-prod-mint-and-run.sh --headless` reports every step PASS.

### §2.E Branch discipline (see §1.6)

- **§2.12 (Grandfathered branch pattern)** — squash-merge collapses `@alchemisthomer/neuralpathway/...` into a single per-cycle brain commit; next omens increment uses `cycle/eos-<N>` per parent CLAUDE.md.

## §3 Non-functional requirements

- **§3.1 (v1 API preserved untouched)** — `SovereignEnvelopeSealer.SealAsync` (v1 API) is not modified by PR #60. Verified by diff on the sealer file: only new methods added, no signatures changed on existing ones.
- **§3.2 (No caller migration in this PR)** — no controller in `engines/godot/scripts/ui/*` migrates to v2. PR #60 ships primitives only. Caller migration is the follow-up PR (§10.4).
- **§3.3 (Both cosmos-logos envelope paths supported)** — `libsodium` (macOS/Linux, `Sodium.Core`) AND `apple-cryptokit` (iOS Swift bridge) both implement `SealForStorageAsync` + `SealForWireAsync`. Feature-parity across platforms is load-bearing for iPhone builds.
- **§3.4 (Wire-schema hard cutover)** — `ClusterRegistryClient` reads ONLY `"domain"` from the cluster response; NO graceful fallback to `"endpointUrl"`. This is intentional per commit `c822ea6`; the coordination requirement is upstream (olympus-grid ships `"domain"` first).
- **§3.5 (Rollback play if merge lands and prod breaks)** — revert `c822ea6` in a hotfix against `brain/2.7.x.x`. Blast radius contained to 2 files (`ClusterModels.cs` + `ClusterRegistryClient.cs`); sealer primitives + HANDOFF doc stay.
- **§3.6 (Deferred PRs stay deferred)** — omens #28 (Android deploy pipeline) + #46 (Olympus Engine v1 / Muse pipeline) remain open, no active work in PR #60's scope. Verified by branch scope check.
- **§3.7 (iOS deploy discipline held)** — per memory `feedback_omens_ios_deploy_script_is_canonical`, any iPhone attestation uses `tools/ios-deploy.sh` (Godot CLI export → `scripts/fix-ios-export.py` patcher → xcodebuild → device install). Hand-rolled xcodebuild silently breaks SIWA / IAP / bridge — do NOT.
- **§3.8 (Godot workflow discipline)** — per memory `feedback_omens_godot_workflow`, `dotnet build` (PATH needs `/usr/local/share/dotnet`) + headless boot required before "done."
- **§3.9 (Party leader filter held on Area3D triggers)** — no new Area3D trigger in PR #60 bypasses `Party.IsLeaderBody(body)`. Verified by grep on any modified Area3D handler.
- **§3.10 (Per-instance inventory routing held)** — no PR #60 change reintroduces set-based inventory or type-keyed dedup. Verified by diff on `ReaderInventory.cs` + `TrophyCase.cs` — these files should NOT be modified by this PR.

## §4 Feedback inputs

| FB# | Title | Body excerpt / evidence |
|-----|-------|-------------------------|
| — | Source status sheet 2026-09-25 | `omens/docs/eos/OMENS_IN_PROGRESS.md` — extractable status for the EOS agent |
| — | Verification doc | `omens/docs/2_7_migration.md` — read end-to-end before merge |
| — | Sovereign-AI wire contract | `omens/docs/eos/EOS_5_4_SOVEREIGN_AI_UI_BRIEF.md` |
| — | 2026-07-07 overnight HANDOFF | Sovereign v2 across 5 repos; correlation id `5c0c7c04-64bf-4549-9484-109f5e87e01c` |
| — | Cross-repo v2 attestation siblings | athena #102 (`brain_1.7.eos-5.8`), apollo #30 (`brain_1.7.eos-5.7`), cosmos-logos/turtleshell-web #74, cosmos-logos/turtleshell-ios #32 |
| — | HUD umbrella §6.B | `brain_2.7.eos-1.md` names omens #60 as dependency crossing the HUD cycle for the domain rename |
| — | Consolidation-walk provenance | 2026-08-31 walk: 10 open PRs evaluated; 7 closed superseded (#51/#53/#54/#55/#56/#57/#58/#59), 2 left alone (#28 Android / #46 Olympus Engine), 1 kept as PR #60 |

## §5 Steward approval gate

- [ ] Discipline principle acknowledged (v2 primitives now; caller migration in follow-up; wire-schema is hard cutover)
- [ ] Canonical attestation statement locked
- [ ] Story locked (§1.1 – §1.6)
- [ ] Acceptance criteria locked (§2.1 – §2.12)
- [ ] NFRs locked (§3.1 – §3.10)
- [ ] **Merge-gate confirmation on §2.6/§2.7** — olympus-grid `/v1/grid/master/grid/clusters/me` returns `"domain"` non-null; existing rows backfilled. Coordinated with olympus-grid #345 (or the specific PR that ships the rename).
- [ ] **Pre-merge re-check on §2.5** — `test-byok-v2.js` prints `✅ PROVENANCE MATCHED` against the target env.
- [ ] Approved to execute — signed: **__________** **__________**

---

# § Agent-authored (bottom half)

## §6 Layer impact map

Single-repo × single-EOS-slice (omens client-side). Cross-repo counterparties named for §2.4 + §2.6 + §2.7 dependencies.

| Criterion | omens | olympus-grid | athena | apollo | turtleshell-web | turtleshell-ios |
|---|---|---|---|---|---|---|
| §2.1–§2.3 local build | full scope | — | — | — | — | — |
| §2.4 sibling deploys | — | — | v2 wire in prod/dev | v2 wire in prod/dev | v2 seal ceremony in prod/dev | v2 CryptoKit sealer in prod/dev |
| §2.5 test-byok-v2 | consumer | — | providence emitter | — | — | — |
| §2.6–§2.9 wire cutover | `ClusterModels.cs` + `ClusterRegistryClient.cs` | `Cluster__c.Domain__c` + `/v1/grid/master/grid/clusters/me` response field rename + backfill | — | — | — | — |
| §2.10–§2.11 EOS runs | consumer | Site Guest + JWT surfaces | chat wire | speak wire | — | — |
| §2.12 branch grandfathering | squash-merge collapses | — | — | — | — | — |

## §7 Schema deltas

### §7.1 Commit `06f3f65` — Sovereign envelope v2 primitives (BYOK)

New methods on `SovereignEnvelopeSealer` (both `libsodium` + `apple-cryptokit` paths):
- `SealForStorageAsync(payload, godPublicKey, senderIdentity)` — paste-time, no timestamp, ephemeral sender. Output stored client-side by ProviderChooserModal.
- `SealForWireAsync(storedInner, turnEnvelopeMeta)` — per-turn outer wrap with anti-replay.
- `envelopeVersion: "cosmos-logos-sealed-v2"` (was `cosmos-logos-sealed-v1`; v1 API preserved untouched).

### §7.2 Commit `c822ea6` — Wire-schema `EndpointUrl → Domain` (HUD §L7)

- `ClusterInfo.EndpointUrl` → `Domain` (bare host, transport layered by caller).
- `EndpointUrl` preserved as computed property `$"https://{Domain}"` — legacy callers still work at the client-language surface.
- JSON wire field renamed `endpointUrl` → `domain`.
- `ClusterRegistryClient` reads only `"domain"` (no fallback).

### §7.3 Follow-up scope (NOT in this PR — §10.4 candidate)

Settings v3 schema, ProviderChooserModal migration, controller migrations — all described in `OMENS_IN_PROGRESS.md` §4 and NOT authored in PR #60. Filed as a distinct follow-up ticket after §10.

## §8 Service contracts

### §8.1 Sealer primitives (client-side)

```
SealForStorageAsync(payload, godPublicKey, senderIdentity)
  → { envelopeVersion: "cosmos-logos-sealed-v2", storedInner: <bytes>, metadata: {...} }
SealForWireAsync(storedInner, { turnId, timestamp, nonce })
  → { envelopeVersion: "cosmos-logos-sealed-v2", wireOuter: <bytes> }
```

### §8.2 Cluster-response wire (server-side, olympus-grid; consumed by omens)

```
GET /v1/grid/master/grid/clusters/me
Response:
  {
    "clusters": [
      { "id": ..., "name": ..., "domain": "api-eos-3.turtleshell.ai", ... }
    ]
  }
```
No `"endpointUrl"` field on the response after the rename. Callers construct `https://{domain}` themselves.

## §9 Telemetry assertions

### §9.OM Omens client attestation

- **§9.OM-1 through §9.OM-3** — one per §2.1 – §2.3 build/engine gate; each has a specific `dotnet build` or editor-boot output.
- **§9.OM-4 (v2 primitives exist, v1 API unchanged)** — grep `SovereignEnvelopeSealer.cs` for `SealForStorageAsync` + `SealForWireAsync` returns matches; diff on `SealAsync` returns no signature change.
- **§9.OM-5 (Cross-repo test-byok-v2 green)** — `node athena/api/scripts/test-byok-v2.js` output shows `✅ PROVENANCE MATCHED`.
- **§9.OM-6 (Cluster-response schema)** — `curl … /v1/grid/master/grid/clusters/me | jq` output shows `"domain"` present, non-null, matching a valid hostname; no `"endpointUrl"` key on the response.
- **§9.OM-7 (Backfill complete)** — SOQL query `SELECT COUNT() FROM Cluster__c WHERE Domain__c = null AND EndpointUrl__c != null` returns 0.
- **§9.OM-8 (Stage 4 picker works)** — post-merge omens login on a real device reaches library hub against `https://{Domain}` — Diagnostics modal renders populated; screenshots attached to §13.
- **§9.OM-9 (Both EOS harnesses green)** — both `eos-mint-and-run.sh` variants report every step PASS.

### §9.NENT Non-entanglement with sibling PRs

- **§9.NENT-1 (Deferred PRs untouched)** — omens #28 (Android) + #46 (Olympus Engine v1 / Muse) remain in their prior state; no commits from PR #60 land on their branches.
- **§9.NENT-2 (Superseded PRs stay closed)** — the 8 PRs closed in the 2026-08-31 consolidation walk stay closed; no accidental re-opening.
- **§9.NENT-3 (No unrelated engine changes)** — PR #60 diff is bounded to sealer + models + registry client + HANDOFF; grep on `engines/godot/scripts/(party|inventory|library|combat|ui/(?!ProviderChooserModal))` returns no modifications.

### §9.OP Operational hygiene (inherits from sibling attestations)

- **§9.OP-1 (No plaintext BYOK on wire)** — grep of any test-byok-v2 output for the raw provider-key value returns zero hits.
- **§9.OP-2 (No JSON reflection on iOS path)** — per omens iOS gotcha memory + CLAUDE.md; verify PR #60 doesn't introduce anonymous-type `JsonSerializer.Serialize` on hot paths.

## §10 Execution plan

### §10.1 Author-owned pre-merge

1. Run §2.1 – §2.3 locally on `brain/2.7.x.x` HEAD; capture artifacts. Close §9.OM-1 – §9.OM-3.

### §10.2 Cross-repo coordination — the MERGE GATE

2. **Olympus-grid domain-rename PR** ships to prod (or target env). This is bundled in olympus-grid #345 (per `brain_2.7.eos-1.md` §6.A W1); alternatively could be a separate hotfix if #345 doesn't land in time.
3. **`Domain__c` backfill** completes on existing Cluster__c rows. SOQL verification per §2.7.
4. **`curl` verification** per §2.6 — `"domain"` present, non-null.
5. **Test-byok-v2 pre-merge re-check** — `node athena/api/scripts/test-byok-v2.js` prints `✅ PROVENANCE MATCHED` against the target env. Close §9.OM-5.

### §10.3 Merge + fleet promotion

6. **§5 rulings signed and locked**. No merge before this.
7. **Merge PR #60** to `brain/2.7.x.x` (squash). Branch grandfathered per §2.12.
8. **Docker rebuild → ECR push** fires automatically on merge for the omens image (if omens has a docker artifact; if not, this step is a no-op).
9. **Parent olympus-616 submodule pointer bump** to the merged omens tip per `[Submodule Pointer Bump Discipline]`. Steward `[prod needs approval]` for prod-CDK-triggering merges.
10. **Both EOS harnesses run** per §2.10 – §2.11. Close §9.OM-9.
11. **Post-merge cluster-picker smoke** per §2.8 – §2.9 on a real device. Close §9.OM-8.

### §10.4 Post-merge follow-up (BLOCKED on this cycle's close; filed as new ticket when opened)

Per source §4 "Post-#60 follow-up" — the omens-side sovereign-v2 storage + wire migration lands as a distinct PR:
- `engines/godot/scripts/settings/SovereignAISettings.cs` — v2 → v3 schema.
- `engines/godot/scripts/ui/ProviderChooserModal.cs` — call `SealForStorageAsync` on paste, persist result, drop plaintext draft.
- `engines/godot/scripts/ui/AthenaChatController.cs` — replace plaintext-key read + `SealAsync` with `GetChatStoredInner` + `SealForWireAsync`.
- `engines/godot/scripts/ui/ApolloController.cs` — same treatment for voice.
- Optional: wire live `/v1/{athena,apollo}/byok/test` calls from ProviderChooserModal Test button.
- Deferred separately: iOS Swift bridge `sovereignAI_sealForAthena` in `OlympusIosBridge.swift` for the `apple-cryptokit` v2 envelope (required before iPhone production builds).

This follow-up is captured as a `FOLLOW-UPS.md` row (BYOK cascade section) with prospective ordinal `brain_1.7.eos-5.10.md` — opens after this cycle's §13 closeout.

### §10.5 Deferred to a future cycle (not on this cycle's scope)

- omens #28 Android deploy pipeline — never real-device-validated; no active work.
- omens #46 Olympus Engine v1 / Muse pipeline — approach rolled back 2026-06-19 (generative chunk grammar can't produce chapter-quality levels; canon path is authored Tier-3 scenes per chapter).
- Move omens to `cycle/eos-<N>` shared branch pattern — future omens increment.

## §11 Verification protocol

### §11.1 Without iPhone (build + wire verification)

- `dotnet build` (integration + engine) locally.
- `godot --editor` boots without missing-dependency errors.
- `curl … | jq` against the target env for `"domain"` presence.
- `node athena/api/scripts/test-byok-v2.js` on the target env.
- SOQL for `Domain__c IS NULL` count.

### §11.2 With iPhone (mandatory for §9.OM-8 close per omens NFR + memory `feedback_omens_always_deploy`)

- `tools/ios-deploy.sh` builds + deploys omens to a real iPhone against the merged image.
- Login → Stage 4 → cluster picker → library hub. Screenshot per stage attached to §13.
- Sovereign AI Settings modal opens — ProviderChooserModal still v1 (follow-up PR migrates it; verification only that PR #60 didn't regress the phase-1 UI).

### §11.3 EOS harness runs

- `bash omens/eos/tools/eos-mint-and-run.sh --headless` on dev/ngrok/scratch.
- `bash omens/eos/tools/eos-prod-mint-and-run.sh --headless` on prod/api-int/alpha-org.
- Both must show every-step PASS.

## §12 Rollback plan

- **PR #60 full revert.** Squash-merge is single-commit revert; middleware chain returns to pre-consolidation shape. Client-cached v2 slots (once the follow-up ships) would re-appear undecryptable to a v1-only client, effectively wiping BYOK — that's the follow-up's problem, not this PR's.
- **Wire-schema cutover isolated revert.** If `c822ea6` alone needs to revert (e.g., olympus-grid domain rename rolled back), revert JUST commit `c822ea6` — restore `EndpointUrl` on `ClusterModels.cs` + `ClusterRegistryClient.cs`. Sealer primitives + HANDOFF doc stay. Blast radius: 2 files.
- **Sibling PR revert coupling.** athena #102 + apollo #30 + turtleshell-web #74 + turtleshell-ios #32 are semantically coupled; a coordinated revert across all four is the correct move if the v2 cascade needs to fully back out.
- **Non-revertable elements to be honest about.**
  - Any `LedgerEntry` rows written after merge carrying `envelopeVersion: cosmos-logos-sealed-v2` are immutable per Plutus ledger discipline. Rollback restores emit shape but leaves history rows in place.
  - Client-cached v2 slots (once the follow-up ships) are stored in `user://sovereign_ai.cfg` — a rollback of the client code does not delete the file. Users may need a manual re-prompt cycle on downgrade.

## §13 Closeout

*Filled at end of cycle.*

### What shipped
- …

### What deferred (and why)
- Post-merge v2 storage/wire migration (settings v3, ProviderChooserModal, controllers) — follow-up PR, filed in `FOLLOW-UPS.md`.
- iOS Swift bridge `sovereignAI_sealForAthena` — required before iPhone production builds use v2.
- Move to `cycle/eos-<N>` shared branch pattern — next omens increment.
- omens #28 Android + #46 Olympus Engine v1 — remain open, no active work.

### What surprised
- …

### Verification evidence
- Link to `dotnet build` + Godot editor boot artifacts (§9.OM-1 – §9.OM-3).
- Link to `test-byok-v2.js` output `✅ PROVENANCE MATCHED` (§9.OM-5).
- Link to `curl … | jq` output showing `"domain"` present (§9.OM-6) + SOQL zero-null (§9.OM-7).
- Link to `brain/2.7.x.x` post-merge omens SHA + parent submodule bump SHA + CDK deploy log.
- Link to real-iPhone Stage 4 cluster-picker screenshot (§9.OM-8).
- Link to both `eos-mint-and-run.sh` variant reports (§9.OM-9).

### Feedback that emerged from THIS cycle (seed for the next one)
- Follow-up PR scope (settings v3 + controllers + iOS Swift bridge) becomes `brain_1.7.eos-5.10` when opened.
- Anti-pattern memory candidate (already surfaced in sibling attestations): "MERGEABLE ≠ works; CI has actually run green" as a pre-merge gate.

### Memory updates
- Confirm existing memories held: `feedback_omens_always_deploy`, `feedback_omens_ios_deploy_script_is_canonical`, `feedback_omens_godot_workflow` — all applicable to §11 verification and remain canonical.
- New memory candidate: "sovereign-envelope v2 primitives are the god-key-rotation kill-switch by design; caller-migration is the follow-up PR" — codify the two-PR pattern.

### Cycle close commit
- PR #60 merge SHA + parent submodule bump SHA + CDK deploy log + omens EOS harness reports.
- Steward sign-off: **__________** **__________**

---

## References

- **Source-of-truth status sheet:** [`omens/docs/eos/OMENS_IN_PROGRESS.md`](../../../../omens/docs/eos/OMENS_IN_PROGRESS.md) (2026-09-25)
- **Umbrella cycle:** [`brain_1.7.eos-5.5.md`](brain_1.7.eos-5.5.md) — BYOK / sealed-at-capture credential sovereignty
- **Peer sub-attestations:** [`brain_1.7.eos-5.7.md`](brain_1.7.eos-5.7.md) (apollo) · [`brain_1.7.eos-5.8.md`](brain_1.7.eos-5.8.md) (athena)
- **Cross-cycle HUD dependency:** [`brain_2.7.eos-1.md`](brain_2.7.eos-1.md) §6.B (names omens #60 as domain-rename crossing) · [`brain_2.7.eos-1.1.md`](brain_2.7.eos-1.1.md) (ares W3+W4 + W4 §11.1) · [`brain_2.7.eos-1.2.md`](brain_2.7.eos-1.2.md) (hermes §11.5)
- **Omens PR #60:** [`feat(omens): consolidation 2.7 — sovereign envelope v2 primitives (cherry-picked from #53)`](https://github.com/olympus-616/omens/pull/60)
- **Cross-repo v2 sibling PRs:** athena #102 · apollo #30 · turtleshell-web #74 · turtleshell-ios #32
- **Verification doc:** `omens/docs/2_7_migration.md`
- **Wire contract:** `omens/docs/eos/EOS_5_4_SOVEREIGN_AI_UI_BRIEF.md`
- **EOS operating manual:** [`../README.md`](../README.md)
- **Submodule Pointer Bump Discipline:** olympus-616 parent `CLAUDE.md`
