# Sealed-at-capture credential sovereignty — no clear-text credentials on any wire between capture surface and target god

| | |
|---|---|
| **Branch family** | `brain/1.7.x.x` |
| **Cycle ordinal** | `eos-5.5` (fifth sub-attestation of EOS-5) |
| **Status** | `In Development` — Steward already implementing + verifying; verbal §5 ratification 2026-07-08 verbatim: *"you can open it but its already in progress and i'm already verifying it. so up to you"* — direct-to-execution under single-Steward mode (README §270-273). §5 checkboxes remain the Steward's to formally tick; the verbal ratification places the doc in `04_in_development/`. |
| **Opened** | 2026-07-08 (doc); implementation predated the doc — first commits under this claim landed as `EOS-5.4 sovereign AI — BYOK envelope decrypt` in athena + apollo prior to doc opening. Doc catches up to reality. |
| **Closed** | — |
| **Prior cycle** | `brain_1.7.eos-5` (umbrella, frozen) — sibling sub-attestations `brain_1.7.eos-5.1` (globally deployable, draft), `brain_1.7.eos-5.2` (guest-access lockdown, draft), `brain_1.7.eos-5.3` (tithe integrity, draft), **`brain_1.7.eos-5.4` (substrate-choice sovereignty, planning)** |
| **Theme** | Sealed-at-capture credential envelopes — any user-supplied credential is sealed with the target god's cosmos-logos public key at the moment of capture, decryptable only by that god's private key, never in clear on any wire or in any intermediate store |
| **Feedback inputs** | Steward attestation dictated 2026-07-08 |
| **Estimated effort** | Implementation largely landed (see §10 status column); verification + §9 hardening remaining |
| **Actual effort** | — |

**Cross-reference to EOS-5.4 (substrate choice)**: 5.4 attests the *freedom to choose* substrate (LLM vendor, model, location). 5.5 attests the *safety of exercising* that choice — the credentials that authorize the chosen substrate are cryptographically sealed end-to-end. Together they form the "sovereign AI" umbrella. Commit-history messages tagged `EOS-5.4 sovereign AI` covered work that split across both docs; going forward, 5.4-scoped commits address provider-routing/substrate-choice and 5.5-scoped commits address envelope-sealing.

---

# § Steward-authored (top half)

## Canonical attestation statement

> *"I attest that no user-supplied credential exists in clear on any device, wire, or intermediate store after the moment of capture. Every credential — LLM API key, TTS audio-provider key, MCP integration secret — is sealed with the receiving god's cosmos-logos public key at the moment of capture, decryptable only by that god's private key. No intermediate service (Ares perimeter, Hermes router, Salesforce storage, Plutus logging, any wire tap, any database dump, any operator with admin access) can read the credential in clear. Only the server with the target god's cosmos-logos private key can decrypt the credential, and it does so only at the moment of use."*
>
> — Steward, 2026-07-08 (working attestation; refine before locking §5)

## §1 User story

- §1.1 As a **dust dancer supplying an LLM credential** I want the credential **sealed with Athena's cosmos-logos public key at the moment I paste it into the UI**, so that **from that instant forward, no intermediate service — including the storage layer, the network path, and Ares itself — can read it in clear**.
- §1.2 As a **dust dancer supplying an audio-provider credential** (ElevenLabs / OpenAI TTS / etc.) I want the credential **sealed with Apollo's cosmos-logos public key at capture**, so that **the same distributed-trust property holds for the audio path**.
- §1.3 As a **dust dancer supplying an MCP integration secret** (per-tool token — GitHub PAT, Salesforce session, HubSpot key, etc.) I want the credential **sealed with the target MCP server's cosmos-logos public key at capture**, so that **each per-tool secret is scoped to its target and unreadable by every intermediary — including Athena itself**.
- §1.4 As the **olympus-grid platform** I want **credential-sealing to be the backbone of safe distributed operation**, so that **the network can be trusted BY CONSTRUCTION rather than trusted BY POLICY — an operator with root on any intermediate node cannot exfiltrate credentials because the credentials on that node do not exist in clear**.

## §2 Acceptance criteria

Each criterion observable end-to-end; adversarial cases required (safety is a non-happy-path property).

**§2.1 — Sealing at capture (LLM)**
- **Given** a user pastes an LLM API key into the BYOK configuration UI, **when** the value leaves the input element, **then** the value is IMMEDIATELY sealed with Athena's cosmos-logos public key (fetched from `athena/.well-known/cosmos-logos.json` or its equivalent), **and** the clear-text bytes are zeroized in the DOM. The sealed envelope is what persists — never the clear key.

**§2.2 — Sealing at capture (audio)**
- Same shape as §2.1 but sealed with Apollo's cosmos-logos public key.

**§2.3 — Sealing at capture (MCP per-tool)**
- Same shape as §2.1 but sealed with the target MCP server's cosmos-logos public key (Poseidon or third-party). Per-tool scoping preserved — the GitHub PAT envelope is decryptable only by the GitHub-serving MCP endpoint; Athena carries the sealed envelope but cannot decrypt it.

**§2.4 — No clear-text on any intermediate wire**
- **Given** an adversary with `tcpdump` on any hop between the capture surface and the target god (Ares perimeter, Hermes router, ALB, ECS network fabric), **when** they capture the full request/response, **then** no clear-text credential byte appears in the capture. Only sealed envelopes appear on-wire.

**§2.5 — No clear-text at rest anywhere except the target god's memory during use**
- **Given** a database dump of Salesforce, a Plutus ledger dump, a log stack dump, or any process-memory dump of Ares/Hermes/Argos, **when** the dump is searched for the credential bytes, **then** the credential does not appear in clear. Only sealed envelopes.
- **Given** the target god's memory during a request, **when** the credential is used (LLM call, audio call, MCP call), **then** the clear credential exists only in the god's transient memory for the duration of that call and is zeroized immediately after.

**§2.6 — Envelope-decryption failure fails loudly, not silently**
- **Given** an envelope arrives at the target god with an unreadable envelope (wrong key, malformed, wrong format), **when** decryption fails, **then** the god emits `envelope.decrypt_failed` telemetry with the failure class and **rejects the request** rather than continuing with a null credential. (Memory: `project_pattern_1_platform_events_architecture.md` — silent-drop-on-envelope-key-mismatch is a known failure mode; §9 assertion required to prevent recurrence in this path.)

**§2.7 — Provenance emit (falsifiability from telemetry)**
- **Given** any request that consumed a sealed credential, **when** the request completes, **then** Plutus / session log carries provenance identifying WHICH god's key was used to unseal, WHEN, and for WHAT purpose (llm.turn, audio.synth, mcp.tool.call). Enables audit "did this god ever decrypt a credential it wasn't authorized to decrypt" — the negative case must be observable, not merely improbable.

**§2.8 — Per-god key isolation**
- **Given** an operator with access to Athena's cosmos-logos private key, **when** they attempt to decrypt an envelope sealed for Apollo or Poseidon, **then** decryption fails. Each god's key isolates its credential surface — compromise of one god's private key does not cascade.

## §3 Non-functional requirements

- **Wire-format compatibility.** Two envelope formats supported (per CLAUDE.md § Cosmos-Logos Protocol): web/libsodium (`crypto_box_seal`) and iOS/CryptoKit (`ephemeral_pk(32) || nonce(12) || ciphertext + tag(16)`). Both must be sealable by every capture surface (turtleshell-web, turtleshell-ios, iris portal, omens) and unsealable by every god (athena, apollo, poseidon, future gods).
- **Zero-clear-text discipline.** No path may retain clear-text credentials in a device store (localStorage, iOS keychain, disk cache, DB row) or in any transit hop other than the initial capture surface's ephemeral memory during sealing.
- **Zeroization.** All clear-text credential buffers zeroed immediately after use (both at capture-and-seal on the client and at unseal-and-call on the target god).
- **Rotation.** Cosmos-logos keypairs are rotatable per god without breaking already-sealed credentials (grace-window during which the god accepts envelopes sealed for either the old or new public key, then old key is retired). Rotation cadence + tooling deferred to a follow-on cycle; the property must be achievable, not necessarily automated in this cycle.
- **Compatibility window.** Pre-envelope credentials already stored in clear (if any exist in prior state) must be either migrated (re-sealed) or purged, per Steward direction. Recommendation: purge and force re-entry (safer than silent migration).
- **Performance.** Sealing overhead at capture < 100ms p95 (client-side crypto_box_seal is single-digit ms; NFR budget covers the manifest fetch + key parse round-trip). Unsealing at target god < 10ms p95.
- **Falsifiability.** Every claim in §2 must be either provable from telemetry (§2.7) or provable by adversarial verification (§2.4, §2.5, §2.8 — packet capture / dump grep / cross-god key swap tests).

## §4 Feedback inputs

- Steward attestation dictated 2026-07-08 — verbatim: *"i have added cosmos-logos encrypted keys to athena and apollo. i am currently verifying it. that means.... any llm credential is sealed with athena's key before use. any audio credential is sealed with apollo's key before use. any mcp integration seals its credentials before contacting the mcp server. i believe this encryption is the backbone of a safe and securly distributed network. only the server with the cosmos-logos private key can decyrpt the credentials, and we can ensure no credentials are in the clear at any moment after they are captured. we encrypt the credentials at the time the credentials are saved - so that the credentails are not stored in clear on the device, nor available to any part of the network, until being received by the server that actually needs them."*
- Sibling in-flight: EOS-5 umbrella (frozen), 5.1 (globally deployable, draft), 5.2 (guest-access lockdown, draft), 5.3 (tithe integrity, draft), 5.4 (substrate-choice sovereignty, planning). This cycle joins the pack as the credential-safety half of "sovereign AI."
- Existing infrastructure this builds on:
  - `athena/api/src/ai/sovereign-envelope.ts` (v2 nested storage-inner — landed in athena `72a966d`)
  - `apollo/api/src/audio/sovereign-envelope.ts` (v2 — landed in apollo `02e8bb0`)
  - `poseidon/mcp/src/http/middleware/envelope.ts` (MCP envelope layer)
  - `athena/api/src/ai/byok-test.ts` + `athena/api/scripts/test-byok-v2.js` (Steward's active verification harness — currently untracked at head)
  - CLAUDE.md § Cosmos-Logos Protocol (Ed25519 keypairs, SSM injection at Pantheon start-up per Zeus CDK)

## §5 Steward approval gate

- [ ] Canonical attestation statement locked
- [ ] Story locked (§1.1 - §1.4)
- [ ] Acceptance criteria locked (§2.1 - §2.8)
- [ ] NFRs locked (§3)
- [ ] Approved to execute — signed: **__________** **__________**

**Note on direct-to-execution:** verbal ratification 2026-07-08 authorizes agent to begin §6-§13 decomposition while the checkboxes above remain to be formally ticked. §5 boxes are Steward-signed; the doc's current placement in `04_in_development/` reflects the verbal go-ahead.

---

# § Agent-authored (bottom half)

## §6 Layer impact map

| Criterion | Capture surface (turtleshell-web · turtleshell-ios · iris portal · omens) | Athena | Apollo | Poseidon | Ares | Salesforce (olympus-grid) | Plutus |
|-----------|------|--------|--------|----------|------|-------------|--------|
| §2.1 LLM sealing | seal at capture with Athena pubkey | unseal + zeroize post-use | — | — | pass-through (never sees clear) | store sealed envelope only | provenance emit on unseal |
| §2.2 Audio sealing | seal at capture with Apollo pubkey | — | unseal + zeroize | — | pass-through | store sealed envelope only | provenance emit |
| §2.3 MCP per-tool | seal with target MCP server pubkey | carry sealed envelope, never unseal | — | unseal + zeroize (if target is Poseidon) | pass-through | store sealed envelope only | provenance emit |
| §2.4 no clear-text on wire | ephemeral clear at seal-time only | never emits clear on any egress | never emits clear | never emits clear | never sees clear | never sees clear | never sees clear |
| §2.5 no clear-text at rest | ephemeral only | zeroize post-use | zeroize | zeroize | n/a | sealed-only in DB | n/a |
| §2.6 decrypt failure loud | n/a | `envelope.decrypt_failed` emit + 4xx | same | same | n/a | n/a | ingest the event |
| §2.7 provenance emit | n/a | Plutus ledger row per unseal | same | same | n/a | n/a | canonical store |
| §2.8 per-god key isolation | seal to right god's key | rejects wrong-key envelope | same | same | n/a | n/a | n/a |

## §7 Schema deltas

- **SObjects** — where credential envelopes persist (BYOK config records in olympus-grid): sealed envelope column already exists per landed work; verify field-level encryption is NOT double-applied to a sealed envelope (redundant, no harm) and that field is not exposed via any List View or REST API without the god-side unseal path. TBD in §10.
- **Plutus event types** — `envelope.decrypt_failed` (new, §2.6), `credential.unsealed` (new, §2.7 — with fields: god_codename, purpose_class, cycle_id). Confirm no clear-text credential material ever appears in any Plutus payload.
- **Cosmos-logos manifest fields** — no changes required; existing `identity.public_key` + `envelope` config already carries what's needed. Verify apollo's manifest has envelope config parity with athena's.

## §8 Service contracts

Envelope-carrying request shape (schematic):

```
POST /v1/{god}/{action}
  Headers: X-Cycle-ID, X-Request-ID, x-user-identity
  Body: {
    ...action-specific fields...,
    credentials: {
      byok: {
        envelope: "<base64 sealed envelope>",
        format: "libsodium-sealbox" | "apple-cryptokit",
        sealed_for: "{god_codename}"          # verifiable against manifest
      }
    }
  }
  Returns: { ... }
```

- The receiving god verifies `sealed_for` matches its own codename before attempting decrypt (early-reject wrong-recipient envelopes to avoid useless unseal attempts).
- The MCP shuttle path (Athena → Poseidon) already established in `athena/api/src/ai/mcp-envelope.ts` (per CLAUDE.md § MCP Integration) — the per-tool sealed envelope traverses Athena without being unsealed.

## §9 Telemetry assertions (the close-out gate)

Concrete log-line signatures that MUST appear (or MUST NOT appear) in the next play cycle's session log:

- `Plutus.ledger` carries at least one `credential.unsealed` row per BYOK-authorized turn, with `god_codename` matching the god that performed the unseal.
- Zero occurrences of any clear-text credential byte-pattern in `Plutus.ledger`, `Ares.log`, `Hermes.log`, `Salesforce.debug_log`. Verified by grep-search of exported dumps for the last 8 characters of a canary credential inserted at capture. **The canary must not be found anywhere except the god that unsealed it.**
- Every envelope-carrying request that fails decryption must produce exactly one `envelope.decrypt_failed` row with failure class (`wrong_key`, `malformed`, `wrong_format`, `zeroized_before_use`) — never zero, never many-per-request.
- Cross-god swap test: an envelope sealed for Athena, POSTed to Apollo, must produce `envelope.decrypt_failed` with class `wrong_recipient` and a 4xx response — NOT a successful unseal (would prove key-isolation broken).
- Every §2.7 provenance row carries the `X-Cycle-ID` so the sealed-credential chain is joinable to the karmic cycle it authorized.

## §10 Execution plan (status column reflects reality as of 2026-07-08)

| # | Task | Status |
|---|------|--------|
| 10.1 | Athena `sovereign-envelope.ts` — v1 seal/unseal | ✅ shipped |
| 10.2 | Athena v2 nested storage-inner envelope | ✅ shipped (`72a966d`) |
| 10.3 | Athena BYOK unseal + provenance emit + provider routing | ✅ shipped (`e86c36c`) |
| 10.4 | Athena `/v1/athena/byok/test` verification endpoint | ✅ shipped |
| 10.5 | Apollo `sovereign-envelope.ts` — v1 seal/unseal for /speak + /music | ✅ shipped (`e815167`) |
| 10.6 | Apollo v2 nested storage-inner + `/v1/apollo/byok/test` | ✅ shipped (`02e8bb0`) |
| 10.7 | Poseidon MCP envelope middleware — per-tool credential sealing | ✅ shipped (`poseidon/mcp/src/http/middleware/envelope.ts`) |
| 10.8 | Steward manual verification against athena + apollo via `test-byok-v2.js` | 🔄 in flight 2026-07-08 |
| 10.9 | Capture-surface confirmation: turtleshell-web + turtleshell-ios + iris portal + omens all seal at capture | ⏳ TBD |
| 10.10 | Adversarial verification protocol per §11 — tcpdump on wire + DB dump grep + cross-god swap test | ⏳ TBD |
| 10.11 | §9 telemetry assertion — canary credential end-to-end trace | ⏳ TBD |
| 10.12 | `envelope.decrypt_failed` event emission verified across all three gods | ⏳ TBD |
| 10.13 | Rotation grace-window design (NFR §3 rotation) — defer to follow-on cycle | ⏸ deferred |

## §11 Verification protocol

### Without iPhone

- **Positive path** — `athena/api/scripts/test-byok-v2.js` (Steward's active harness): seal a canary OpenAI key with Athena's public key, POST envelope through `/v1/athena/chat`, confirm 200 + provenance row in Plutus, confirm zeroized post-use.
- **Adversarial path** — `tcpdump -A -i <lo|any> port 3401 or port 3411 or port 3451` while running the positive test; grep capture for the canary key's last 8 bytes. Expected: zero hits outside the localhost:3401 (Athena) unseal moment.
- **Storage grep** — after the positive test, dump `LedgerEntry__c` rows via `sf data query`, dump Plutus rows, dump Ares/Hermes local logs. Grep for canary. Expected: zero hits anywhere.
- **Cross-god swap** — POST an Athena-sealed envelope to `/v1/apollo/speak` and to `/v1/poseidon/mcp/*`. Expected: `envelope.decrypt_failed` with `wrong_recipient` class, 4xx response.
- **Silent-drop test** — POST a malformed envelope (wrong format tag, truncated ciphertext). Expected: `envelope.decrypt_failed` + 4xx, not a silent null-credential fall-through to a downstream 401.

### With iPhone (only if turtleshell-ios capture-surface verification requires)

- Steward paste-a-credential path on iPhone → confirm sealed via apple-cryptokit format → confirm same adversarial checks hold on the iPhone → server path.

## §12 Rollback plan

Sealed-credential middleware is on the critical path — a bad rollback can expose credentials that were sealed under the current regime.

- **Schema (SObjects storing sealed envelopes)** — leave in place. Sealed envelopes are useless to anyone without the corresponding god's private key. Purging is the safest posture if rollback is needed; NEVER attempt to migrate sealed → clear-text as a rollback.
- **Server (`sovereign-envelope.ts` in athena + apollo)** — revert the god's commit only if the god's `/byok/test` endpoint is proven broken; ensure the god's cosmos-logos private key is not decrypting to `null` (silent-drop) before reverting. Rollback of a decrypt path is safer than rollback of a seal path.
- **Client (capture surfaces)** — never revert to clear-text capture without simultaneously purging any sealed envelopes on the server side. Two states must not coexist (clear on client + sealed on server) because the round-trip becomes ambiguous.
- **Key rotation as rollback** — if a private key is suspected compromised, rotate the god's cosmos-logos keypair, invalidate all prior sealed envelopes, force re-entry. This is the escape hatch of last resort.

## §13 Closeout

*(Filled at end of cycle. Doc goes immutable after this.)*

### What shipped

- (populated at close)

### What deferred (and why)

- (populated at close — likely: rotation automation, capture-surface iOS confirmation if verification path defers)

### What surprised

- (populated at close)

### Verification evidence

- Link to / paste session log excerpts that prove §9 assertions held.
- Link to adversarial verification transcripts (tcpdump captures, storage grep results, cross-god swap-test results).

### Feedback that emerged from THIS cycle (seed for the next one)

- (populated at close)

### Memory updates

- Consider: memory entry documenting the sealed-at-capture pattern as the canonical credential-handling discipline for all future gods.
- Consider: memory entry documenting the adversarial verification protocol (tcpdump + dump-grep + cross-god swap) as the canonical falsifiability harness for envelope claims.

### Cycle close commit

- Branch / PR link: TBD
- Steward sign-off: **__________** **__________**
