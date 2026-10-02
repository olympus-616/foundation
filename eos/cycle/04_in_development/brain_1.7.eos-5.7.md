---
pitch: "Voice synthesis with bring-your-own-key"
---

# Apollo sovereign-AI — BYOK envelope decrypt on `/speak` + `/music`, per-turn Plutus attribution, per-response provenance header

> File: `brain_1.7.eos-5.7.md` — seventh sub-attestation of EOS-5. Slices the **apollo** leg out of the BYOK / sovereign-AI cascade umbrellaed by [`brain_1.7.eos-5.5.md`](brain_1.7.eos-5.5.md) (sealed-at-capture credential sovereignty). Companion status record: `/Users/gregory/temp/eos-5.4-apollo-sovereign-ai-status.md` (recorded 2026-09-25 by thoth); this cycle doc absorbs it into EOS canon.
>
> The source status record was authored under an older ordinal (`eos-5.4`) that predated the 5.4-becomes-"sovereign substrate" reassignment. The apollo BYOK claim itself is unchanged; only the ordinal is remapped.

| | |
|---|---|
| **Branch family** | `brain/1.7.x.x` (rolls forward into `brain/2.7.x.x` without rename per Steward direction 2026-09-01) |
| **Cycle ordinal** | `eos-5.7` (seventh sub-attestation of EOS-5; 5.4 reserved for "sovereign substrate — no vendor lock-in", currently in `01_planning/`) |
| **Status** | `In Development` — reconciliation cycle. PR #30 in flight since 2026-08-23 (`+1097 / −26`, 11 files, 2 commits); doc catches up to reality per the `brain_1.7.eos-5.5` pattern (README §270-273 single-Steward direct-to-execution). Steward verbal §5 ratification 2026-09-25: *"add an in-progress ticket for apollo based upon '/Users/gregory/temp/eos-5.4-apollo-sovereign-ai-status.md' to create a new eos ticket to track and attest to the functionality for apollo."* Formal §5 checkboxes pending Steward signature. |
| **Opened** | 2026-09-25 |
| **Closed** | — |
| **Prior cycle** | `brain_1.7.eos-5.5` (BYOK umbrella — sealed-at-capture credential sovereignty; apollo is one leg of that cascade) |
| **Theme** | Apollo `/speak` and music turns are sovereign-AI capable: a caller's provider key (OpenAI, ElevenLabs, XTTS, olympus-grid) is delivered inside a Cosmos-Logos sealed envelope, decrypted only inside apollo, and every turn is ledgered to Plutus with truthful `byok` / `tithed` semantics and a per-response `x-og-provenance` header. This is the **voice mirror** of the already-attested athena chat-turn wire. |
| **Feedback inputs** | Thoth-recorded status file `eos-5.4-apollo-sovereign-ai-status.md` (2026-09-25); Steward direction 2026-09-25 to open the cycle; PR #30 review notes |
| **Estimated effort** | Implementation largely landed. Remaining: G-1 red-gate fix (one line), G-2 port normalize, R-1/R-2/R-3 rulings, E-4/E-5/E-6/E-7 evidence capture, PR #30 merge, submodule pointer bump on parent, CDK deploy, prod attestation. |
| **Actual effort** | — |

---

## Why this doc exists

Apollo PR #30 is the second cross-repo instance of the sovereign-AI wire (athena being the first), covering the voice surface. The implementation is a structural clone of athena's `sovereign-envelope.ts` with a voice flavor: the two new endpoints `/speak` and `/music` accept sealed envelopes carrying provider keys, decrypt them only inside apollo, and emit truthful attribution to Plutus.

`brain_1.7.eos-5.5.md` names apollo as part of the BYOK cascade (§6.B) but does not itself carry a per-repo attestation contract — it stops at the umbrella. This doc closes that gap: apollo now has a **single-authority attestation** that says which invariants must hold, which evidence proves them, which gates block merge, and which rulings the Steward owes.

The doc is opened **now** rather than at PR merge because two evidence-capture items (E-4 through E-7) require the `brain/2.7.x.x`-deployed apollo image to exist, and the coordinated merge sequence for apollo is entangled with the parent submodule bump + CDK deploy — the same shape as `brain_2.7.eos-1` / hostile-universe defense. Opening the doc pre-merge lets §9 assertions gate the merge, not follow it.

---

## Discipline principle

> *An in-flight PR with green CI is implementation evidence. A merged PR is deployment evidence. Production telemetry showing a BYOK'd voice turn ledgered with `byok=true, tithed=false, characters.input units=0` is attestation evidence. **Only the third closes this cycle.***

---

# § Steward-authored (top half)

## Canonical attestation statement

> *"I attest that every request to Apollo (TTS and music generation) is delivered inside a Cosmos-Logos envelope sealed to Apollo's public key; that only correctly-formed envelopes decrypt at Apollo's process boundary and are then dispatched to the correct TTS engine or downstream service. When a caller uses BYOK, the plaintext provider key (ElevenLabs, XTTS, olympus-grid) exists on the client only at the moment of first paste — from that instant forward it lives sealed to Apollo's public key; Apollo decrypts at request time using its private key, invokes the provider, and streams audio bytes back to the caller. The plaintext key never persists to any wire, log, Plutus row, or intermediate store. Rotation of Apollo's private key renders every client-cached sealed BYOK slot undecryptable — the god-key-rotation kill switch."*
>
> — Refined 2026-09-28 from Steward direction, aligned with the umbrella axiom in [`brain_1.7.eos-5.5.md`](brain_1.7.eos-5.5.md).

## §1 User story

- **§1.1** As **a dust dancer running their own olympus-grid node with their own ElevenLabs key** I want **to hear my voice turn synthesized on my own provider account without apollo ever holding my key in plaintext** so that **credential sovereignty extends to my voice surface, not only to my chat surface**.
- **§1.2** As **the Steward** I want **every BYOK'd voice turn to be truthfully attributed in the Plutus ledger — `byok=true, tithed=false, characters.input units=0, infrastructure_shells=1 (voice) / 5 (music)`** so that **the platform's 7% tithe covenant is not triggered by inference the platform did not fund**.
- **§1.3** As **every consuming client surface (omens-ios, turtleshell-web, iris)** I want **to read the `x-og-provenance` header on every voice response** so that **the "Powered by …" chip is truthful across native + browser clients without any per-client special case**.
- **§1.4** As **a pre-5.7 client (iris, turtleshell-web)** I want **the legacy plaintext `providerKeys` path to keep working during the migration window** so that **the sovereign-AI rollout does not break the surfaces that haven't yet adopted the sealed envelope**.

## §2 Acceptance criteria

Each criterion maps to one invariant `I-N` from the source status record and is observable end-to-end.

- **§2.1 (I-1 BYOK truthful attribution)** — **Given** a caller submits `/speak` or `/music` with a sealed sovereign envelope carrying a provider key **when** apollo decrypts + resolves the engine + emits the audio **then** the Plutus row for that turn carries `byok=true`, `tithed=false`, `voice.characters.input units=0`, `infrastructure_shells = 1` (voice) or `5` (music), `key_source=byok`.
- **§2.2 (I-2 house-path attribution)** — **Given** a caller submits `/speak` with `{ text }` only (no `providerKeys`, no `sovereignAI`) **when** apollo uses the house key **then** the Plutus row carries `byok=false`, `tithed=true`, `characters.input units = actual character count billed`.
- **§2.3 (I-3 client-side plaintext absence + rotation semantics)** — **Given** the god's private key rotates **when** a client's cached sealed slot next attempts decrypt **then** apollo returns `envelope_storage_stale` (HTTP 401 with typed error code) **and** the client wipes the slot and re-prompts; at no point does the client hold the plaintext provider key.
- **§2.4 (I-4 manifest ↔ private-key coherence)** — **Given** apollo boots with its private key loaded (SSM in prod / `keys/apollo.key` in dev) **when** a client fetches `/.well-known/cosmos-logos.json` **then** the advertised `publicKey` equals the public key mathematically derived from the loaded private key (static fallback only when private key unavailable).
- **§2.5 (I-5 legacy plaintext acceptance)** — **Given** a pre-5.7 client submits `/speak` with `providerKeys: { openai: "sk-…" }` in cleartext (no envelope) **when** apollo processes the request **then** the legacy path is accepted (transitional) and the resulting turn is ledgered with `key_source=byok_legacy_plaintext` so the migration surface is observable.
- **§2.6 (I-6 streaming discipline)** — **Given** any `/speak` request that successfully resolves an engine **when** apollo begins streaming audio **then** the response first calls `flushHeaders()` (so `x-og-provenance` is written) and then streams audio bytes; on 401 or quota errors, apollo returns JSON, not partial audio.
- **§2.7 (I-7 provenance header cross-surface readability)** — **Given** any voice turn (BYOK or house) **when** the response reaches any client surface (omens-ios native, turtleshell-web browser, iris LWC/Aura relay) **then** that client can read the `x-og-provenance` header — including from browser JS via CORS `exposedHeaders`. **This is currently RED (see §9 gate G-1).**

## §3 Non-functional requirements

- **Envelope security** — sealed envelope v1 (plaintext outer envelope) and v2 (sealed inner envelope) both supported; provider allowlist enforced (`openai`, `elevenlabs`, `xtts`, `olympus-grid`); max envelope age 5 min; clock skew tolerance 1 min; endpoint classification `managed-cloud | private-cloud | localhost | off-grid`; typed error codes for every failure mode.
- **BYOK probe** — `POST /v1/apollo/byok/test` accepts a sealed envelope, performs provider liveness probe with 10 s timeout, **never echoes the key** in response body or logs.
- **Ledger discipline** — every voice turn writes to Plutus with `metadata.sovereign_ai` populated on every event; `provider_call.byok.key_source` reflects `byok | byok_legacy_plaintext | house`; shell cost unchanged (1 voice / 5 music) regardless of BYOK; **music events (`music.*`) are not yet in `BILLABLE_EVENTS` — schema forward-compatible, revenue not yet turned on**.
- **Manifest** — `envelope.enabled: true`; accepted formats + voice_seal route declared; publicKey derived dynamically from loaded private key with static fallback.
- **Streaming latency** — engine resolve → `flushHeaders()` → first audio byte within engine's normal p95 (no headroom added by envelope decrypt beyond one Ed25519 verify + one X25519 unseal ≤ 10 ms combined).
- **Compatibility** — legacy `providerKeys` cleartext path stays working through this cycle; deprecation cycle for legacy path is a **future cycle**, not this one.
- **Test coverage** — apollo audio module ≥ 80% branch coverage (aligned to §3 NFR of brain_2.7.eos-1); the apollo `test-byok-tts.js` script provides an end-to-end attestation harness (seal → speak → provenance decode → Plutus queue grep → invariant assert, exits non-zero on violation).
- **CORS surface** — `x-og-provenance` MUST appear in `exposedHeaders` of the CORS middleware so browsers can read it; failure to do so silently breaks I-7 on every browser client (this is gate G-1).

## §4 Feedback inputs

| FB# | Title | Body excerpt / evidence |
|-----|-------|-------------------------|
| — | Thoth status record 2026-09-25 | `/Users/gregory/temp/eos-5.4-apollo-sovereign-ai-status.md` — 115-line structured record with claim, delivered scope, invariants I-1–I-7, evidence manifest E-1–E-7, gates G-1–G-5, rulings R-1–R-3, exit criteria, next actions |
| — | Steward direction 2026-09-25 | Verbatim: *"add an in-progress ticket for apollo based upon '/Users/gregory/temp/eos-5.4-apollo-sovereign-ai-status.md' to create a new eos ticket to track and attest to the functionality for apollo"* |
| — | Athena chat-turn sovereign wire | Reference implementation; apollo `sovereign-envelope.ts` is a structural clone (voice-flavor swap only) |
| — | `brain_1.7.eos-5.5.md` §6.B | BYOK cascade umbrella; names apollo #30 as one of five in-flight repos in the cascade |

## §5 Steward approval gate

- [ ] Discipline principle acknowledged
- [ ] Canonical attestation statement locked
- [ ] Story locked (§1.1 – §1.4)
- [ ] Acceptance criteria locked (§2.1 – §2.7)
- [ ] NFRs locked (§3)
- [ ] **Ruling R-1** — Mirror docs + CHANGELOG land in PR #30, or in a separate docs PR before the parent submodule bump?
  - [ ] (a) fold into #30 before merge
  - [ ] (b) separate docs PR pre-parent-bump
- [ ] **Ruling R-2** — Tag branch-pattern exception for apollo (head is `@alchemisthomer/neuralpathway/eos-5-4-voice-sovereign-ai`, not `cycle/eos-N` per parent CLAUDE.md), or apollo is not yet on `cycle/eos-N` and this cycle merges on the legacy branch?
  - [ ] (a) accept the exception for this cycle; migrate to `cycle/eos-N` on the next apollo cycle
  - [ ] (b) rebase to `cycle/eos-N` before merge
- [ ] **Ruling R-3** — Per-turn tithe semantics are now encoded (`byok → tithed=false`). Does the standing revenue-level applicability question close with this cycle, or remain open on the ledger for a future decision?
  - [ ] (a) closes with this cycle
  - [ ] (b) remains open — carry forward
- [ ] Approved to execute — signed: **__________** **__________**

---

# § Agent-authored (bottom half)

## §6 Layer impact map

Single-repo × single-EOS-slice (apollo only). Cross-surface reads of `x-og-provenance` involve every client but require no client-side code change beyond the CORS header exposure that PR #30 introduces server-side.

| Criterion | apollo | Plutus (server) | omens-ios | turtleshell-web | iris | Cosmos-Logos manifest |
|---|---|---|---|---|---|---|
| §2.1 BYOK attribution | envelope decrypt + Plutus emit | metadata.sovereign_ai schema | reads x-og-provenance | reads x-og-provenance | reads x-og-provenance | — |
| §2.2 house-path attribution | Plutus emit | metadata.sovereign_ai schema | — | — | — | — |
| §2.3 rotation semantics | 401 + typed error code | — | wipe-and-reprompt | wipe-and-reprompt | wipe-and-reprompt | — |
| §2.4 manifest ↔ key coherence | boot-time derive + serve | — | — | — | — | dynamic publicKey |
| §2.5 legacy path | accept + ledger with `byok_legacy_plaintext` | metadata schema | — | (pre-5.7 caller) | (pre-5.7 caller) | — |
| §2.6 streaming discipline | flushHeaders order | — | — | — | — | — |
| §2.7 provenance cross-surface | CORS exposedHeaders (§9 gate G-1) | — | verify chip | verify chip (blocked on G-1 fix) | verify chip | — |

## §7 Schema deltas

### §7.1 Plutus metadata (per-event, apollo emit path)

- **`metadata.sovereign_ai`** — new metadata key on every apollo-emitted Plutus event. Value: object with `byok: bool`, `key_source: 'byok' | 'byok_legacy_plaintext' | 'house'`, `endpoint_class: 'managed-cloud' | 'private-cloud' | 'localhost' | 'off-grid'`, `provider: 'openai' | 'elevenlabs' | 'xtts' | 'olympus-grid'`.
- **`provider_call.byok.key_source`** — pass-through to the ledger event body so downstream reports can group by key-source without traversing metadata.
- Existing ledger fields (`byok`, `tithed`, `characters.input`, `infrastructure_shells`) already exist; this cycle enforces the truthful population of them per §2.1 / §2.2.

### §7.2 Cosmos-Logos manifest (apollo)

- `api/public/.well-known/cosmos-logos.json` gains `envelope.enabled: true`.
- Accepted envelope formats declared: `libsodium-sealed-box`, `apple-cryptokit`, `sovereign-envelope-v1`, `sovereign-envelope-v2`.
- `voice_seal` capability route declared.

### §7.3 No SF-side schema changes

This cycle does not touch `Cluster__c`, `Plugin__mdt`, `Identity__c`, or any SF object. All schema deltas are Plutus-side event metadata + apollo-side manifest.

## §8 Service contracts

### §8.1 `POST /v1/apollo/speak` (per-turn envelope decrypt)

```
Headers: (existing) + optional x-cosmos-logos-envelope: <base64>
Body: { text, voice?, providerKeys? (legacy), sovereignAI? (v1 outer envelope) }
Response headers: x-og-provenance: <base64-json>  // ALWAYS present
                  Content-Type: audio/mpeg (streaming) OR application/json (errors)
Response body: audio bytes (200) OR JSON error (401, 429, 5xx)
```

Behavior matrix:
- Envelope present + valid → decrypt → provider call with BYOK key → ledger `byok=true`
- `providerKeys` cleartext present → legacy path → ledger `byok=true, key_source=byok_legacy_plaintext`
- Neither → house path → ledger `byok=false, tithed=true`
- Envelope invalid (expired / bad sig / unknown provider / stale key) → HTTP 401 with typed error code, JSON body

### §8.2 `POST /v1/apollo/music` (same shape as §8.1 for music generation)

Same envelope + legacy + house matrix. `infrastructure_shells = 5` per turn.

### §8.3 `POST /v1/apollo/byok/test` (liveness probe, NEW)

```
Body: { envelope: <sealed>, provider }
Response: { ok: bool, provider, endpoint_class, latency_ms }
```
Never echoes decrypted key. 10 s timeout.

### §8.4 `GET /.well-known/cosmos-logos.json`

`envelope.enabled: true`. `publicKey` derived from loaded private key; static fallback used only when private key is unavailable.

## §9 Telemetry assertions (the close-out gate)

Concrete log-line + Plutus row signatures that MUST appear in production telemetry during the attestation run against `brain/2.7.x.x`-deployed apollo. Silent success is red.

### §9.SOV Sovereign-AI observability

- **§9.SOV-1** — When a caller submits `/speak` with a valid sovereign envelope carrying an OpenAI key, the resulting Plutus row queried by `Cycle__c` (or trace-id) shows: `byok=true`, `tithed=false`, `characters.input.units=0`, `infrastructure_shells=1`, `metadata.sovereign_ai.key_source='byok'`, `metadata.sovereign_ai.provider='openai'`. **AND** the audio response carries `x-og-provenance` decoding to `{ provider: 'openai', byok: true, endpoint_class: <class> }`.
- **§9.SOV-2** — When a caller submits `/speak` with `{ text }` only (no envelope, no `providerKeys`), the Plutus row shows: `byok=false`, `tithed=true`, `characters.input.units = actual chars`, `infrastructure_shells=1`, `metadata.sovereign_ai.key_source='house'`.
- **§9.SOV-3** — When a caller submits `/music` with a valid sovereign envelope carrying an ElevenLabs key, the Plutus row shows: `byok=true`, `tithed=false`, `infrastructure_shells=5`, `metadata.sovereign_ai.provider='elevenlabs'`. **Note:** `music.*` event is not yet in `BILLABLE_EVENTS` — row lands with correct semantics but does not bill; forward-compatible.
- **§9.SOV-4** — When the apollo private key rotates and a client's cached sealed slot attempts decrypt, apollo returns HTTP 401 with typed error `envelope_storage_stale`. No Plutus row is written for the failed turn.
- **§9.SOV-5** — When apollo boots, `/.well-known/cosmos-logos.json` returns a `publicKey` mathematically derived from the loaded private key. Grep of the boot log shows `sovereign-manifest: publicKey derived from loaded private key` (not `using static fallback`).
- **§9.SOV-6** — When a browser client executes `fetch('/v1/apollo/speak', …).then(r => r.headers.get('x-og-provenance'))`, the promise resolves to a non-null value (i.e. CORS `exposedHeaders` includes `x-og-provenance`). **This is the load-bearing negative case for I-7 — currently RED, blocks close per gate G-1.**
- **§9.SOV-7** — When a legacy pre-5.7 client submits `/speak` with `providerKeys: { openai: "sk-…" }` cleartext, apollo accepts, and the Plutus row shows `byok=true, key_source='byok_legacy_plaintext'`. The migration surface is observable.
- **§9.SOV-8** — When `POST /v1/apollo/byok/test` is invoked with a valid envelope, the response body does NOT contain the decrypted key value anywhere. `grep <decrypted-key>` against apollo stdout, ECS CloudWatch log group for the window, and the response JSON returns zero hits.

### §9.OP Operational hygiene (no regression)

- **§9.OP-1** — Streaming discipline: on a 200 speak response, `x-og-provenance` header is present in the response's initial header frame (before any audio byte). Verifiable via `curl -i` inspection of the first response bytes.
- **§9.OP-2** — Port normalization: apollo listens on `3421` per CLAUDE.md and per `api/scripts/test-byok-tts.js`. `server.ts:50` PORT default is `3421` (fixes G-2).
- **§9.OP-3** — Apollo audio-module branch coverage ≥ 80% (aligned to `brain_2.7.eos-1` §3 NFR).

## §10 Execution plan

Ordered task list. Each item maps to an evidence ID `E-N`, a gate `G-N`, an action `A-N`, or an exit-criterion from the source status record.

1. **§5 rulings resolved and locked** (R-1, R-2, R-3 ticked; §5 signed). No merge before this.
2. **Fix G-1 (red).** Add `'x-og-provenance'` to the CORS `exposedHeaders` array in `api/src/server.ts:68–84`. One line. Unblocks §2.7 / §9.SOV-6 / E-6. *(Action A-1.)*
3. **Fix G-2 (yellow).** Normalize `PORT` default to `3421` in `api/src/server.ts:50`. *(Action A-2.)*
4. **Execute R-1 outcome.** If (a): CHANGELOG `[Unreleased]` entry + three mirror docs land in PR #30. If (b): open a separate docs PR before parent bump. *(Action A-3.)*
5. **Push + CI re-run + squash-merge PR #30 to `brain/2.7.x.x`.** MergeStateStatus already CLEAN as of 2026-09-23; the G-1 + G-2 fixes will re-trigger CI. *(Action A-4.)*
6. **Docker build → ECR push.** Fires automatically on merge via `apollo/.github/workflows/post-merge-docker.yml`.
7. **Capture E-4 evidence.** Run `api/scripts/test-byok-tts.js` × 3 providers (openai, elevenlabs, xtts) against the `brain/2.7.x.x`-deployed apollo. Capture stdout + exit code + Plutus row snapshot. Attach to §4 of this doc with sha256. *(Action A-5.)*
7. **Capture E-5 evidence.** Legacy-path regression: `curl` with `providerKeys` cleartext → verify Plutus row `key_source='byok_legacy_plaintext'`. House-path regression: `curl` with `{ text }` only → verify Plutus row `tithed=true`. Attach outputs.
8. **Parent submodule pointer bump** on olympus-616 (parent PR #198 or successor). Explicit-attested-SHA per `[Submodule Pointer Bump Discipline]` — apollo's post-merge `brain/2.7.x.x` tip. Steward approval per `[prod needs approval]`. *(Action A-6.)*
9. **CDK deploy completes.** Parent merge triggers Zeus CDK pipeline; apollo image promoted to prod.
10. **Capture E-7 evidence.** `curl https://apollo-616.<prod>/.well-known/cosmos-logos.json` — verify SSM-injected publicKey matches manifest advertisement. Attach output + sha256.
11. **Capture E-6 evidence.** Web attestation: from omens-web / iris in a real browser, execute the CORS `x-og-provenance` read on a voice turn and screenshot the "Powered by …" chip render. Attach. *(Action A-7 — omens + iris agents.)*
12. **`git mv` this doc** from `04_in_development/` to `05_verifying/` (or directly to `06_shipped/` if the §9 assertions all fired green in one pass).
13. **§13 closeout.** Fill shipped / deferred / surprised. Link the eight §9 evidence captures. `git mv` to `06_shipped/`. Steward signs.

### §10.1 Deferred to a future cycle

- **G-4 shared crypto extraction.** `@olympus/cosmos-logos-server` package extraction (deduplicates apollo's + athena's `sovereign-envelope.ts`). ADR candidate; not gating this cycle.
- **Legacy `providerKeys` cleartext path deprecation.** This cycle keeps I-5 open for pre-5.7 client migration; deprecation is a future cycle after iris + turtleshell-web are on the sealed path.
- **Music revenue turn-on.** `music.*` events are schema-forward-compatible but not yet in `BILLABLE_EVENTS`; enabling billing on music turns is a future cycle.
- **BYOK bundle fanout.** turtleshell-ios #32, then iris, turtleshell-web, off-grid, then cluster-level BYOK — all live under `brain_1.7.eos-5.5.md` umbrella, not here.

## §11 Verification protocol

### §11.1 Without iPhone (this cycle's happy path)

- **`api/scripts/test-byok-tts.js`** — the apollo-authored attestation harness. Executes: seal envelope → POST /speak → decode `x-og-provenance` → grep Plutus queue for expected row → assert I-1 invariants. Exits non-zero on any violation. Run × 3 providers (openai, elevenlabs, xtts).
- **`curl -i` inspection** — verify `x-og-provenance` header appears in initial response frame (§9.OP-1); verify CORS `Access-Control-Expose-Headers` includes `x-og-provenance` (§9.SOV-6).
- **`curl` legacy + house regressions** — verify §2.5 and §2.2 respectively.
- **Manifest coherence check** — `curl /.well-known/cosmos-logos.json` in prod → verify `publicKey` matches Ed25519-derived pub from `SSM /olympus/int/keys/APOLLO-616` (comparable via base64 decode + `openssl pkey -pubout`).

### §11.2 With iPhone (E-2 already partially present, needs artifact)

- omens-ios: attempt a voice turn with a user-supplied ElevenLabs key configured in iOS Keychain-backed sovereign slot; verify "Powered by ElevenLabs" chip renders on the response bubble. Screenshot required.

### §11.3 With browser (E-6, blocked on G-1)

- turtleshell-web or iris in Chrome: same as §11.2 but browser-side. Reads `x-og-provenance` via CORS after G-1 fix ships. Not attestable pre-G-1-fix.

## §12 Rollback plan

- **Envelope decrypt path.** Feature-flag `SOVEREIGN_AI_ENABLED=false` disables envelope decrypt (§8.1 falls through to legacy `providerKeys` → house path). No Plutus schema change is destructive; `metadata.sovereign_ai` is additive.
- **CORS `exposedHeaders`.** Removing `x-og-provenance` from `exposedHeaders` breaks browser clients but does not break native or JSON-response paths.
- **Manifest publicKey dynamic derivation.** Setting `SOVEREIGN_MANIFEST_STATIC_FALLBACK=true` forces the static fallback (equivalent to pre-5.7 behavior).
- **PR #30 full revert.** Feasible; `+1097 / −26` diff is isolated to apollo `api/src/audio/**`. No cross-repo migrations to unwind.
- **Non-revertable elements to be honest about:**
  - **Ledger rows written after merge** carrying `metadata.sovereign_ai` are immutable per Plutus discipline (`brain_2.7.eos-1` §2.15 — immutable ledger). Rollback restores schema-optional behavior but leaves historical rows in place. Correct.
  - **Legacy `providerKeys` cleartext acceptance (I-5)** cannot be tightened in this cycle without breaking pre-5.7 iris + turtleshell-web callers. Deprecation is a future cycle.

## §13 Closeout

*Filled at end of cycle. Cycle moves to `05_verifying/` after §10 step 12 and to `06_shipped/` on full green §9 matrix.*

### What shipped
- …

### What deferred (and why)
- G-4 shared crypto extraction — ADR candidate, not gating.
- Legacy `providerKeys` deprecation — future cycle after client migration.
- Music revenue turn-on — schema forward-compatible; billing enablement future cycle.

### What surprised
- …

### Verification evidence
- Link to `test-byok-tts.js` × 3 provider run outputs + sha256 (E-4).
- Link to legacy + house regression outputs + sha256 (E-5).
- Link to browser CORS `x-og-provenance` read + "Powered by …" chip screenshot (E-6).
- Link to prod `/.well-known/cosmos-logos.json` fetch + publicKey derivation match (E-7).
- Link to `brain/2.7.x.x` post-merge apollo SHA + submodule bump commit on parent.
- Link to CDK deploy log confirming apollo image promotion.
- Link to R-1 / R-2 / R-3 ruling record.

### Feedback that emerged from THIS cycle (seed for the next one)
- …

### Memory updates
- Note in `MEMORY.md` — apollo BYOK is now attested per-turn via `metadata.sovereign_ai`; legacy plaintext `providerKeys` path is transitional and observable via `key_source='byok_legacy_plaintext'`.

### Cycle close commit
- PR #30 merge SHA + parent bump SHA + CDK deploy log link.
- Steward sign-off: **__________** **__________**

---

## §9-observed appendix — 2026-09-30 production deploy (code-identity attestation)

**Deploy record:** [`../DEPLOY-2026-09-30.md`](../DEPLOY-2026-09-30.md) — parent `841c222` · apollo submodule ptr `e294c94` · Steward-verified 2026-09-29.

**Code identity for apollo:** ✓ VERIFIED — boot log shows `APOLLO ONLINE version 1.0`.

**§9 behavior signals: NOT YET TESTED.** Per Steward direction 2026-09-29 (*"i have not tested everything - so we have to catch it in the eos attestation, especially related to the security updates"*), every §9.SOV signal in this ticket remains unverified against the deployed state. Sealed-envelope round-trip probes + BYOK truthful-attribution + god-key-rotation kill-switch smoke all pending. Attestation pass per DEPLOY-2026-09-30 priority sequence **step 3** (surface fanout after agent).

**Ticket-specific follow-ups from deploy:** none directly (apollo not implicated in the surfaced items).

---

## References

- **Companion status record (this cycle's seed):** `/Users/gregory/temp/eos-5.4-apollo-sovereign-ai-status.md` (recorded 2026-09-25 by thoth)
- **BYOK umbrella cycle:** [`brain_1.7.eos-5.5.md`](brain_1.7.eos-5.5.md) — sealed-at-capture credential sovereignty; names apollo #30 as one leg of the cascade
- **Athena chat-turn sovereign wire:** the already-attested reference implementation; apollo `sovereign-envelope.ts` is a structural clone
- **Apollo PR #30:** [`feat(apollo): EOS-5.4 sovereign AI — BYOK envelope decrypt for /speak + /music + provenance header`](https://github.com/olympus-616/apollo/pull/30)
- **Cross-surface reference:** `docs/sovereign-ai-seam-cross-surface-reference.md`
- **EOS operating manual:** [`../README.md`](../README.md)
- **Submodule Pointer Bump Discipline:** olympus-616 parent `CLAUDE.md`
