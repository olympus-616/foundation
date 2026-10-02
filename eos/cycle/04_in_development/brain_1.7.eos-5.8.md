---
pitch: "Chat with bring-your-own-key — provider-neutral"
---

# Athena EOS-5.4 sovereign-AI consolidation — per-repo attestation for PR #106 (BYOK reference implementation)

> File: `brain_1.7.eos-5.8.md` — **eighth sub-attestation of EOS-5**. Athena is the **anchor reference implementation** of the BYOK / sovereign-AI cascade governed by [`brain_1.7.eos-5.5.md`](brain_1.7.eos-5.5.md); apollo (`brain_1.7.eos-5.7.md`) is the voice mirror of this athena wire. This doc is athena's per-repo attestation loop.
>
> Source: Steward-dictated in-flight-state record *"EOS — track unattested work-in-progress for the ATHENA module (Olympus-616)"* (2026-09-25); this cycle doc absorbs it into EOS canon under athena's PR-#106-tracked identifier `ATH-EOS-5.4`.

| | |
|---|---|
| **Branch family** | `brain/1.7.x.x` (rolls forward into `brain/2.7.x.x` without rename per Steward direction 2026-09-01) |
| **Cycle ordinal** | `eos-5.8` — peer sub-attestation of EOS-5, parallel to `eos-5.7` (apollo). Source labels this `ATH-EOS-5.4`; the "5.4" is the historical name for the sovereign-AI claim before 5.4 was reassigned to "sovereign substrate — no vendor lock-in" (currently in `01_planning/`). Ordinal remapped without changing the claim. |
| **Status** | `In Development` — reconciliation cycle. PR #106 in flight since 2026-08-31 (32 files, +2,370 / −86, 6 commits ahead of `brain/2.7.x.x`); `MERGEABLE`; **zero CI checks recorded**; zero reviews. Steward verbal §5 ratification 2026-09-25 via direction to open the ticket. Formal §5 checkboxes pending. |
| **Opened** | 2026-09-25 |
| **Closed** | — |
| **Prior cycle** | `brain_1.7.eos-5.5` (BYOK umbrella — sealed-at-capture credential sovereignty; athena is the reference implementation) |
| **Theme** | Athena chat-turn accepts a caller's provider key inside a Cosmos-Logos sealed envelope, decrypts only inside athena, ledgers every turn to Plutus with truthful `byok` / `tithed` semantics, and emits provenance dual-emit (header + terminal SSE frame). Consolidates already-brain-merged EOS-5 work (#96/#97/#98) with the new EOS-5.4 sovereign-AI (BYOK) work into version 2.7.0.0. Retires already-CLOSED PRs #102/#103/#104/#105. |
| **Feedback inputs** | Steward-dictated in-flight state record 2026-09-25; PR #106 body; envelope-v2 Steward directive 2026-07-07; hostile-universe-defense v2.3 UAT 2026-08-02 (no direct dep, sibling window) |
| **Estimated effort** | Implementation largely landed (32 files, +2,370). Remaining: 11 local-attestation gates + 2 working-tree hygiene items + 1 manifest-body-vs-claim discrepancy resolution + 2 infrastructure gates (SSM key rotation + client-side rollout notice) + 5 post-merge fleet attestation gates. |
| **Actual effort** | — |

---

## Why this doc exists

Athena PR #106 is the **anchor reference implementation** of the sovereign-AI wire — the pattern every other BYOK-participating god (apollo, and eventually omens / turtleshell-web / turtleshell-ios) clones structurally. `brain_1.7.eos-5.5.md` names athena as one leg of the BYOK cascade in §6.B but does not carry per-repo attestation obligations. This doc is that per-repo loop for athena.

The doc is opened **before merge** because:

1. **SSM key rotation** on the athena cosmos-logos private key is a load-bearing cross-god ops step (`zeus` provisioning). Merging PR #106 without rotating `/olympus/{int,prod}/keys/COSMOS_LOGOS_ATHENA-616` in lockstep means **every prod BYOK request fails on merge with `envelope_decrypt_failed`**. The attestation loop must gate the merge on the rotation, not follow it.

2. **`envelope_storage_stale` cascade** — every stored v2 BYOK slot across TurtleShell surfaces becomes undecryptable on deploy. This IS the intentional god-key-rotation kill-switch (Steward property 2026-07-07). It needs a coordinated in-app pre-flight banner or explicit release note across web / iOS / iris / offgrid so users get *"you will be prompted to re-enter your key"* before it silently fails on them.

3. **CI has never run** against the PR head (`statusCheckRollup` empty). "MERGEABLE" says nothing about build/test correctness.

---

## Discipline principle

> *A consolidation PR body listing what SHOULD be true is a claim. A local `npm run build && npm test` is author-owned evidence. A green GitHub Actions run against the head SHA is CI evidence. Cross-surface smoke against `brain/2.7.x.x`-deployed athena is production evidence. **Attestation closes on the fourth; the first three are staging.***

---

# § Steward-authored (top half)

## Canonical attestation statement

> *"I attest that every request to the Athena LLM router is delivered inside a Cosmos-Logos envelope sealed to Athena's public key; that only correctly-formed envelopes decrypt at Athena's process boundary and are then dispatched to the appropriate inference provider (OpenAI, Anthropic, Grok, Gemini, Ollama). When a caller uses BYOK, the plaintext provider key exists on the client only at the moment of first paste — from that instant forward it lives sealed to Athena's public key and travels only in that sealed form; Athena decrypts at request time using its private key, uses the key for the single provider call, and the plaintext never persists to any wire, log, Plutus row, or intermediate store. Rotation of Athena's private key immediately renders every client-cached sealed BYOK slot undecryptable — the god-key-rotation kill switch, Steward property 2026-07-07."*
>
> — Refined 2026-09-28 from Steward direction, aligned with the umbrella axiom in [`brain_1.7.eos-5.5.md`](brain_1.7.eos-5.5.md). Athena remains the anchor reference implementation of the sealed-envelope wire per §6.B of the umbrella.

## §1 User story

- **§1.1** As **any operator on any TurtleShell surface** I want **to bring my own provider key (OpenAI, Anthropic, Grok, Gemini) to athena chat and have athena decrypt only-inside-itself** so that **credential sovereignty is the reference pattern for the whole fleet, and every other BYOK-participating god clones this wire without divergence**.
- **§1.2** As **the Steward** I want **god-key rotation to be an effective kill-switch across every stored client-side BYOK slot** so that **compromise of the athena private key can be revoked centrally by rotating SSM, without touching a single client**. This is Steward property 2026-07-07 — the load-bearing v2-envelope semantic.
- **§1.3** As **an athena chat consumer (web / iOS / iris / offgrid)** I want **provenance dual-emitted** — response header `x-og-provenance` PLUS terminal `event: provenance` SSE frame — so that **native chunk parsers AND browser stream readers can both read the provenance without any per-surface special case**.
- **§1.4** As **the ops team** I want **the merge to be blocked on lockstep SSM key rotation and client-side rollout notice** so that **no in-flight BYOK request hits `envelope_decrypt_failed` at the moment of deploy**. Silent breakage on rotation is unacceptable.
- **§1.5** As **the alchemisthomer agent** I want **the legacy `@alchemisthomer/neuralpathway/…` branch used by this PR to be explicitly grandfathered for this one merge** — this PR is the last tail of the prior branch pattern; future athena work moves to shared `cycle/eos-<N>` per parent CLAUDE.md.

## §2 Acceptance criteria

Each criterion maps to one gate group in the source status record and is observable end-to-end.

### §2.A Local-attestation gates (author-owned; must be green before merge)

- **§2.1 (Build clean)** — `cd api && npm run build` exits 0 with zero TypeScript errors. Attestation artifact: build log tail.
- **§2.2 (Jest smoke suite green)** — `cd api && npm test` reports N/N green. Attestation artifact: jest output tail.
- **§2.3 (BYOK — OpenAI)** — `node api/scripts/test-byok.js` passes for a valid OpenAI key. Response Plutus row: `byok=true`, `tithed=false`, `key_source=byok`.
- **§2.4 (BYOK — Anthropic)** — same as §2.3 for Anthropic.
- **§2.5 (BYOK — Grok)** — same as §2.3 for Grok.
- **§2.6 (BYOK — Gemini)** — same as §2.3 for Gemini.
- **§2.7 (BYOK — Ollama v1 flat envelope)** — `node api/scripts/test-byok-ollama.js` passes. Verifies v1 flat-envelope path is preserved for pre-v2 clients.
- **§2.8 (BYOK — v2 nested storage-inner envelope)** — `node api/scripts/test-byok-v2.js` passes. **This is the load-bearing envelope test.** v2 is Steward directive 2026-07-07 — the god-key-rotation kill-switch property depends on the nested storage-inner shape.
- **§2.9 (House-path regression)** — `POST /v1/athena/chat` with no `sovereignAI` block routes via `ATHENA_AI_TYPE` and Plutus row shows `key_source=platform`, `byok=false`, `tithed=true`.
- **§2.10 (Negative test — expired envelope)** — envelope with `issuedAt > 5 min` ago returns HTTP 400 with `SovereignEnvelopeError` typed code. **No silent fallback to house path.**
- **§2.11 (Anthropic terminal-frame finalizer)** — Claude/Anthropic streaming path emits terminal `event: provenance` SSE frame even when `[DONE]` is absent. Verifies the end-of-loop finalizer fires when the provider omits the sentinel.
- **§2.12 (BYOK-test endpoint)** — `POST /v1/athena/byok/test` returns `{ ok: true }` for each provider. Backs the client-side ceremony "Test" button.

### §2.B Working-tree hygiene

- **§2.13 (Migration-doc rename)** — `docs/2_7_migration_notes.md` deleted and `docs/2_7_migration.md` untracked in the working tree. Steward chooses canonical name; commit resolves the rename.
- **§2.14 (Manifest trailing newline)** — `api/public/.well-known/cosmos-logos.json` gains trailing newline.

### §2.C Manifest-body-vs-claim discrepancy (Steward ruling required — see §5)

- **§2.15 (Manifest capability declaration)** — PR body claims manifest "declares sovereignAI capability + BYOK provider list." Actual diff only rotates the Ed25519 pubkey and reflows JSON — **no capability entry, no context_types extension, `identity.version` still `1.7.0`, `metadata.updated` still `2026-03-26`**. Two closure paths:
  - (a) Verify no TurtleShell surface (web/iOS/iris/offgrid) gates on that advertised capability; accept PR body as intentional and correct.
  - (b) Add the capability declaration + version bump to the manifest before merge; align PR body to the actual behavior.
  Ruling required at §5.

### §2.D Infrastructure gates (require cross-god coordination — cannot be closed by athena alone)

- **§2.16 (SSM key rotation in lockstep)** — Manifest pubkey `SHA256:ZiaIjT2bxYjG49NJoY98p/5s9JNBWxRMJXkixxy+VAc=` verified to derive from local `api/keys/athena.key`. **Both `/olympus/int/keys/COSMOS_LOGOS_ATHENA-616` and `/olympus/prod/keys/COSMOS_LOGOS_ATHENA-616` MUST be rotated in lockstep with the merge**; failure here means every prod BYOK request fails with `envelope_decrypt_failed`. Zeus ops action.
- **§2.17 (Client-side rollout notice for `envelope_storage_stale` cascade)** — Every stored v2 BYOK slot across TurtleShell surfaces becomes undecryptable on deploy (the intentional god-key-rotation kill-switch). Requires **in-app pre-flight banner OR explicit release note** across `turtleshell-web`, `turtleshell-ios`, `iris`, `turtleshell-offgrid` — coordinated with each client agent. Users must be warned *"you will be prompted to re-enter your key"* before the silent decrypt-failure would surprise them.

### §2.E Post-merge fleet attestation

- **§2.18 (Parent submodule bump)** — olympus-616 parent submodule pointer updated to the merged athena tip. Explicit-attested-SHA per `[Submodule Pointer Bump Discipline]`.
- **§2.19 (Docker + ECR)** — Pantheon Docker image builds and pushes to `842485730943.dkr.ecr.us-east-1.amazonaws.com/olympus-616/pantheon` at tag `git-<squash-sha>`.
- **§2.20 (CDK deploy)** — Foundation → Network → Cluster/ECS → CDN/DNS all four stack stages complete.
- **§2.21 (Version advertising)** — ECS task advertises `ATHENA_APP_VERSION=2.7.0.0` in `/status` or response headers.
- **§2.22 (Cross-surface end-to-end smoke)** — `/chat` from web + iOS + iris + offgrid — each turns green with correct provenance frame AND either (`byok=true`, `tithed=false`) or (`byok=false`, `tithed=true`).

### §2.F Branch discipline

- **§2.23 (Grandfathered branch pattern)** — Head branch `@alchemisthomer/neuralpathway/f887aea-0f025bc-20260831003735-eos-5-4-sovereign-ai-consolidation` predates `cycle/eos-<N>` convention. Squash-merge collapses the naming inconsistency at brain level; future athena increments move to shared cycle branch.

## §3 Non-functional requirements

- **Envelope security** — v1 flat + v2 nested-storage-inner both supported; provider allowlist enforced (`openai`, `anthropic`, `grok`, `gemini`, `ollama`); max envelope age 5 min; clock skew tolerance 1 min. Typed `SovereignEnvelopeError` codes for every failure mode; no silent fallback under any error condition (§2.10).
- **Ledger discipline** — every chat turn writes to Plutus with `metadata.sovereign_ai` populated; `provider_call.byok.key_source` reflects `byok | byok_legacy_plaintext | platform`; `sovereign_ai` block is unknown-key-tolerant downstream (documented rollback property).
- **Provenance dual-emit** — `x-og-provenance` response header AND terminal `event: provenance` SSE frame both present. Both must be present for any of §2.22's four surfaces to render the "Powered by …" chip correctly.
- **God-key rotation as kill-switch** — the load-bearing v2-envelope semantic (Steward 2026-07-07). Rotating the athena private key in SSM must render all client-cached v2 BYOK slots undecryptable (`envelope_storage_stale`), forcing clients to re-prompt for keys. This IS the property — do not "fix" it.
- **Additive-only changes** — every code change in this PR is additive; the `sovereign_ai` plutus envelope block is unknown-key-tolerant. Enables clean rollback (§12).
- **Test coverage** — athena `api/src/**` branch coverage ≥ 80% (aligned to `brain_2.7.eos-1.md` §3 NFR).
- **Cross-surface parity** — the same envelope + provenance semantics MUST work identically on web (browser fetch), iOS (URLSession), iris (LWC/Aura fetch), offgrid (local). No surface-specific special case.

## §4 Feedback inputs

| FB# | Title | Body excerpt / evidence |
|-----|-------|-------------------------|
| — | Steward in-flight state record 2026-09-25 | *"EOS — track unattested work-in-progress for the ATHENA module (Olympus-616)"* — full gate list |
| — | PR #106 body | Claims 2.7.0.0 consolidation of EOS-5 (already-brain) + EOS-5.4 (new BYOK) |
| — | v2-envelope Steward directive 2026-07-07 | Nested storage-inner shape is the god-key-rotation kill-switch |
| — | Apollo sibling attestation `brain_1.7.eos-5.7.md` | Voice mirror of this athena wire; both share the sovereign-envelope structural pattern |
| — | BYOK umbrella `brain_1.7.eos-5.5.md` §6.B | Names athena as the reference implementation of the BYOK cascade |

## §5 Steward approval gate

- [ ] Discipline principle acknowledged
- [ ] Canonical attestation statement locked
- [ ] Story locked (§1.1 – §1.5)
- [ ] Acceptance criteria locked (§2.1 – §2.23)
- [ ] NFRs locked (§3)
- [ ] **Ruling on §2.15** — Manifest capability declaration:
  - [ ] (a) accept as-is; verify no surface gates on the advertised capability
  - [ ] (b) add capability declaration + version bump before merge
- [ ] **Confirmation on §2.16** — SSM key rotation planned in lockstep with merge (Zeus ops coordination)
- [ ] **Confirmation on §2.17** — Client-side rollout notice sequenced pre-deploy across all four TurtleShell surfaces
- [ ] Approved to execute — signed: **__________** **__________**

---

# § Agent-authored (bottom half)

## §6 Layer impact map

Single-repo × single-EOS-slice (athena core). Cross-god coordination named for §2.16 + §2.17 dependencies.

| Criterion | athena | Plutus | Zeus (SSM) | TurtleShell (4 surfaces) |
|---|---|---|---|---|
| §2.1–§2.14 local + hygiene | code + script harness | — | — | — |
| §2.15 manifest capability | `api/public/.well-known/cosmos-logos.json` | — | — | verify no surface gates on capability |
| §2.16 SSM rotation | — | — | rotate `/olympus/{int,prod}/keys/COSMOS_LOGOS_ATHENA-616` | — |
| §2.17 rollout notice | — | — | — | pre-flight banner OR release note across web / iOS / iris / offgrid |
| §2.18 parent bump | — | — | trigger via parent submodule ptr | — |
| §2.19–§2.21 Docker/CDK/version | — | — | Pantheon image + CDK + ECS task version | — |
| §2.22 cross-surface smoke | — | — | — | `/chat` from each surface with correct provenance |

## §7 Schema deltas

### §7.1 Plutus turn-envelope

- **`metadata.sovereign_ai`** — populated on every athena-emitted turn. Object with `byok: bool`, `key_source: 'byok' | 'byok_legacy_plaintext' | 'platform'`, `provider: 'openai' | 'anthropic' | 'grok' | 'gemini' | 'ollama'`, `envelope_version: 'v1' | 'v2'`.
- Unknown-key-tolerant downstream (rollback property).

### §7.2 Manifest additions (Steward ruling — §2.15 pending)

If §2.15 ruling is (b), the following land in `api/public/.well-known/cosmos-logos.json`:
- `capabilities.sovereignAI: true`
- `capabilities.byok_providers: ["openai", "anthropic", "grok", "gemini", "ollama"]`
- `identity.version: "2.7.0"`
- `metadata.updated: "<merge-timestamp>"`

Manifest pubkey rotation (already in the PR) is unaffected by the ruling.

### §7.3 Envelope shape (documented for reference)

- **v1 flat** — legacy shape, one-layer sealed envelope, preserved for pre-v2 clients (ollama test harness).
- **v2 nested storage-inner** — Steward 2026-07-07. Outer envelope authenticated to caller identity; inner envelope sealed with god's public key. Client stores only the outer; the inner is only readable by athena's private key. **God-key rotation → inner becomes undecryptable → client wipes storage slot on `envelope_storage_stale` → user re-prompted.**

## §8 Service contracts

### §8.1 `POST /v1/athena/chat` (unchanged shape; sovereignAI block optional)

```
Body: { messages, sovereignAI?, providerKeys? (legacy) } | { messages }  // house path
Response headers: x-og-provenance: <base64-json>
Response: SSE stream ending with terminal `event: provenance` frame (dual-emit)
```

Behavior matrix (unchanged from apollo §8.1 semantics; the reference impl):
- `sovereignAI` present + valid → decrypt → provider call with BYOK key → ledger `byok=true`
- `providerKeys` cleartext present → legacy path → ledger `byok=true, key_source=byok_legacy_plaintext`
- Neither → house path → ledger `byok=false, tithed=true`
- `sovereignAI` invalid (expired / bad sig / stale key / unknown provider) → HTTP 400 with typed `SovereignEnvelopeError` code, no silent fallback

### §8.2 `POST /v1/athena/byok/test` (liveness probe)

```
Body: { envelope: <sealed>, provider }
Response: { ok: true }  |  { ok: false, error: <SovereignEnvelopeError code> }
```
Never echoes the decrypted key. Backs the client "Test" button ceremony.

### §8.3 Manifest

```
GET /.well-known/cosmos-logos.json
```
Pubkey rotated to `SHA256:ZiaIjT2bxYjG49NJoY98p/5s9JNBWxRMJXkixxy+VAc=`. Capability declaration TBD per §2.15 ruling.

## §9 Telemetry assertions (the close-out gate)

Concrete signatures that MUST appear during author-owned local runs, CI runs, and post-merge cross-surface smokes.

### §9.ATH Local + CI verification

- **§9.ATH-1 through §9.ATH-12** — one per §2.1 – §2.12 gate. Each has a specific script output or Plutus row shape that closes it.
- **§9.ATH-13 (CI actually ran)** — `gh pr checks 106` shows non-empty rollup, all green.

### §9.INFRA Infrastructure

- **§9.INFRA-1 (SSM lockstep verified)** — `aws ssm get-parameter --name /olympus/int/keys/COSMOS_LOGOS_ATHENA-616` reads a private key whose derived pubkey matches the merged manifest's pubkey. Same for `/olympus/prod/…`.
- **§9.INFRA-2 (Rollout notice sequenced pre-deploy)** — banner or release note is live on all four surfaces BEFORE the parent submodule bump triggers CDK deploy. Attestation: screenshot per surface with timestamp preceding CDK log timestamp.

### §9.PROD Post-merge fleet

- **§9.PROD-1 (Parent bump)** — parent commit shows athena submodule pointer at the merged athena tip.
- **§9.PROD-2 (Docker + ECR)** — ECR shows `pantheon:git-<squash-sha>` for both amd64 + arm64.
- **§9.PROD-3 (CDK)** — CloudFormation shows all four stacks reached `UPDATE_COMPLETE`.
- **§9.PROD-4 (Version advertised)** — `curl https://athena-616.<prod>/status` returns `ATHENA_APP_VERSION=2.7.0.0`.
- **§9.PROD-5 (Cross-surface smoke × 4)** — `/chat` succeeds on web + iOS + iris + offgrid with expected provenance frame + correct byok/tithed row.

## §10 Execution plan

### §10.1 Author-owned pre-merge

1. Run §2.1 – §2.12 locally; capture artifacts. Close §9.ATH-1 through §9.ATH-12.
2. Resolve §2.13 rename + §2.14 trailing newline.
3. Steward rules on §2.15 manifest capability declaration.
4. Force CI re-trigger on PR #106 (empty commit or re-push). Close §9.ATH-13.

### §10.2 Cross-god coordination pre-merge

5. Zeus rotates SSM keys in lockstep in both int + prod. Close §9.INFRA-1.
6. Client-side rollout notice lands on all four TurtleShell surfaces. Close §9.INFRA-2.

### §10.3 Merge + fleet promotion

7. **§5 rulings signed and locked**. No merge before this.
8. Merge PR #106 to `brain/2.7.x.x` (squash). Branch grandfathered per §2.23.
9. Parent olympus-616 submodule bump per `[Submodule Pointer Bump Discipline]` + Steward `[prod needs approval]`.
10. Docker + CDK + ECS advertise 2.7.0.0. Close §9.PROD-1 – §9.PROD-4.
11. Cross-surface smoke on all four TurtleShell surfaces. Close §9.PROD-5.
12. `git mv 04_in_development/ → 06_shipped/`. §13 closeout. Steward signs.

### §10.4 Deferred to a future cycle

- Move to `cycle/eos-<N>` shared branch pattern — next athena increment.
- Legacy `providerKeys` cleartext path deprecation.
- Shared crypto extraction (`@olympus/cosmos-logos-server`) — deduplicates athena + apollo `sovereign-envelope.ts`.

## §11 Verification protocol

### §11.1 Without iPhone (author-owned)

Every §2.1 – §2.14 gate has a bash / node / curl closing artifact. Run locally; attach.

### §11.2 With iPhone (§2.22)

Cross-surface smoke includes iOS. iPhone deploy of turtleshell-ios required to close §9.PROD-5's iOS leg.

### §11.3 Multi-surface parity

Every §9.PROD-5 leg (web / iOS / iris / offgrid) runs the same test scenario: send `/chat` with a valid sealed envelope carrying an OpenAI key; verify response header + terminal SSE frame both carry provenance; verify Plutus row shows `byok=true, tithed=false, key_source=byok`.

## §12 Rollback plan

- **PR #106 full revert.** Additive-only changes; `sovereign_ai` plutus block is unknown-key-tolerant downstream. Squash-merge is single-commit revert.
- **Manifest revert alternative.** If SSM was not rotated in lockstep and prod BYOK requests are failing `envelope_decrypt_failed`, two recovery paths:
  - (a) Roll back the manifest (revert PR #106) — restores prior pubkey; existing client-cached slots decrypt again.
  - (b) Roll SSM forward — rotate SSM to match the new manifest; existing client-cached v2 slots become undecryptable and trigger the intentional kill-switch cascade.
  Either restores service; (a) is faster, (b) is the correct "go forward" if intentional rotation was in progress.
- **Prior tag `git-f887aea`** (current `brain/1.7.x.x` tip) remains in ECR and is deployable.

## §13 Closeout

*Filled at end of cycle. Cycle moves directly to `06_shipped/` on §9.PROD-5 green (per single-Steward mode; verifying-column skip permitted when the assertion matrix is closable in-place).*

### What shipped
- …

### What deferred (and why)
- Move to `cycle/eos-<N>` branch pattern — future athena increment.
- Legacy `providerKeys` deprecation — future cycle after every client is on v2 envelope.
- Shared crypto extraction — ADR candidate; not gating.

### What surprised
- …

### Verification evidence
- Links to §9.ATH-1 through §9.ATH-13 artifacts.
- Links to §9.INFRA-1 (SSM lockstep) and §9.INFRA-2 (rollout notice screenshots).
- Links to §9.PROD-1 through §9.PROD-5 fleet attestation.
- Link to squash-merge SHA on `brain/2.7.x.x` + parent submodule bump SHA + CDK deploy log.

### Feedback that emerged from THIS cycle (seed for the next one)
- Shared crypto extraction — schedule as post-launch cycle.
- Anti-pattern gate: "green PR body claim + empty `statusCheckRollup`" as a lint before merge.

### Memory updates
- Note in `MEMORY.md`: athena is the anchor reference implementation of the sovereign-AI wire; every future BYOK-participating god clones this shape.

### Cycle close commit
- PR #106 merge SHA + parent submodule bump SHA + CDK deploy log link.
- Steward sign-off: **__________** **__________**

---

## §9-observed appendix — 2026-09-30 production deploy (code-identity attestation)

**Deploy record:** [`../DEPLOY-2026-09-30.md`](../DEPLOY-2026-09-30.md) — parent `841c222` · athena submodule ptr `7a17f9e` · Steward-verified 2026-09-29.

**Code identity for athena:** ✓ VERIFIED — boot log shows `Athena Version: 2.0.0, Schema: athena-soul@2.0.0` + `Routing config loaded — 5 tiers, default: claude-3-5-haiku-20241022` + `MCP discovery via Poseidon at: http://localhost:3431/v1/poseidon/mcp/servers` + `knowledge base (2 docs, 8993 chars) loaded`.

**§9 behavior signals: NOT YET TESTED.** Per Steward direction 2026-09-29 (*"especially related to the security updates"*), every §9.SOV / §9.INFRA / §9.PROD signal in this ticket remains unverified against the deployed state. Sealed-envelope round-trip probes, SSM lockstep verification, and cross-surface smokes all pending. Attestation pass per DEPLOY-2026-09-30 priority sequence **step 3**.

**Ticket-specific follow-ups from deploy:**
- **`XAI_API_KEY` missing from `/olympus/int/*` SSM** — Athena xAI routing tier will fail in prod until the key is added. Fix: `aws ssm put-parameter --name /olympus/int/keys/XAI_API_KEY --value <key> --type SecureString`.
- `ATHENA_VERSION` env var missing from ECS task-def — cosmetic; boot banner shows `Version: unknown`. Not a code issue.

---

## References

- **Umbrella cycle:** [`brain_1.7.eos-5.5.md`](brain_1.7.eos-5.5.md) — BYOK / sealed-at-capture credential sovereignty; athena is the anchor reference implementation.
- **Voice mirror (sibling per-repo attestation):** [`brain_1.7.eos-5.7.md`](brain_1.7.eos-5.7.md) — apollo BYOK; structural clone of the athena wire.
- **Athena PR #106:** [`feat(athena): 2.7.0.0 — EOS-5.4 sovereign AI consolidation`](https://github.com/olympus-616/athena/pull/106)
- **v2-envelope Steward directive 2026-07-07:** nested storage-inner shape; god-key rotation as kill-switch.
- **HUD umbrella:** [`brain_2.7.eos-1.md`](brain_2.7.eos-1.md) — athena chat is inside the L1–L14 bounded cost surface; no bypass.
- **EOS operating manual:** [`../README.md`](../README.md)
- **Submodule Pointer Bump Discipline:** olympus-616 parent `CLAUDE.md`
