# Poseidon sovereign-envelope + sealed-credential-at-rest — cosmos-logos boundary on every MCP request, sealed-at-rest for held credentials

> File: `brain_1.7.eos-5.11.md` — **eleventh sub-attestation of EOS-5**. Peer of apollo (`5.7`), athena (`5.8`), omens (`5.9`), plutus attribution (`5.10`). Slices the **poseidon** leg out of the BYOK / sovereign-AI cascade umbrellaed by [`brain_1.7.eos-5.5.md`](brain_1.7.eos-5.5.md).
>
> **Distinguishing property from apollo/athena.** Apollo and Athena are **caller-supplies-BYOK-per-session** shapes — the caller provides the provider key each interaction. Poseidon is **service-holds-credentials-on-caller's-behalf** — a Salesforce OAuth refresh token, HubSpot bearer, GitHub PAT, Google refresh, or Workday token lives inside Poseidon for reuse across many MCP calls. This ticket attests **both** the inbound-message-envelope boundary (same as apollo/athena) **and** the sealed-credential-at-rest storage (unique to poseidon).
>
> Source: Steward direction 2026-09-28 — three-way multi-agent attestation (athena / poseidon / apollo) authored to the same axiom.

| | |
|---|---|
| **Branch family** | `brain/1.7.x.x` (rolls forward into `brain/2.7.x.x` without rename per Steward direction 2026-09-01) |
| **Cycle ordinal** | `eos-5.11` — eleventh sub-attestation of EOS-5, next in peer-sub sequence after `5.10`. |
| **Status** | `In Development` — reconciliation-plus-forward cycle. Inbound sealed-envelope decrypt largely present per fleet cosmos-logos convention (poseidon exposes `/.well-known/cosmos-logos.json` per standard); **sealed-credential-at-rest storage is the novel piece** and may not yet be fully implemented. Steward verbal §5 ratification 2026-09-28 via direction *"yes i want all of these attestations created in the documentation."* Formal §5 checkboxes pending. |
| **Opened** | 2026-09-28 |
| **Closed** | — |
| **Prior cycle** | `brain_1.7.eos-5.5` (BYOK / sealed-at-capture umbrella — poseidon is the third named per-repo instantiation of the axiom after apollo + athena) |
| **Theme** | Every request to Poseidon's MCP surface arrives sealed to Poseidon's public key; every service credential Poseidon holds on the caller's behalf (Salesforce OAuth refresh, HubSpot bearer, GitHub PAT, Google refresh, Workday, and every future integration) is stored sealed to Poseidon's public key. The sealed blob is safe to retain in Poseidon's local store, safe to push to an Olympus online encrypted-credential-store, and only decryptable at request time by Poseidon's private key. |
| **Feedback inputs** | Steward direction 2026-09-28 (three-way multi-agent attestation); umbrella `brain_1.7.eos-5.5.md`; sibling ref implementations `brain_1.7.eos-5.7.md` (apollo) + `brain_1.7.eos-5.8.md` (athena); adjacent poseidon cycle `brain_2.7.eos-6.md` (dynamic MCP router — separate concern) |
| **PR** | No dedicated in-flight PR yet. Inbound-envelope path may already be present per cosmos-logos convention; sealed-credential-at-rest is unshipped. Steward may open a new PR or add to poseidon `brain/2.7.x.x` scope. |
| **Estimated effort** | Inbound-envelope boundary: verify + harden (small — the pattern is a structural clone of athena `sovereign-envelope.ts`). Sealed-credential-at-rest storage: **new implementation surface** — needs storage schema decision, sealer + reader path, credential-rotation-on-god-key-rotation semantics. |
| **Actual effort** | — |

---

## Discipline principle

> *Poseidon holds keys on the caller's behalf — a Salesforce OAuth refresh that unlocks the caller's org, a GitHub PAT that unlocks their repos. Those credentials must never exist in clear at rest, ever. **Sealed-at-capture applies to poseidon's INBOUND surface AND poseidon's AT-REST credential storage in exactly the same shape** — both are envelopes to poseidon's public key, both decrypt only inside poseidon's process at the moment of use, both invalidate together on god-key rotation.*

Two consequences enforced across sections:

1. **The at-rest sealed credential IS the credential.** Poseidon does not store a plaintext credential and then encrypt it "for storage"; there is no plaintext state anywhere along the persistence path. The sealed envelope is the artifact from the moment the caller composes it forward.
2. **God-key rotation is the universal kill switch for BOTH.** Rotating Poseidon's SSM-injected private key must (a) render every client-cached BYOK slot undecryptable AND (b) render every stored service-credential blob unusable — in one atomic operation. Client wipes + re-prompt is the recovery path for both.

---

# § Steward-authored (top half)

## Canonical attestation statement

> *"I attest that every request to the Poseidon MCP server is delivered inside a Cosmos-Logos envelope sealed to Poseidon's public key; that only correctly-formed envelopes decrypt at Poseidon's process boundary and are then dispatched to the correct downstream API server. Service credentials that Poseidon holds on the caller's behalf — Salesforce OAuth refresh tokens, HubSpot bearer tokens, GitHub PATs, Google refresh tokens, and every future integration credential — are stored sealed to Poseidon's public key. The same sealed blob is safe to retain in Poseidon's local store, safe to push to an Olympus online encrypted-credential-store, and only decryptable at request time by Poseidon's private key. Rotation of Poseidon's private key immediately renders every stored credential blob unusable — the same god-key-rotation kill switch."*
>
> — Refined 2026-09-28 from Steward direction, aligned with the umbrella axiom in [`brain_1.7.eos-5.5.md`](brain_1.7.eos-5.5.md).

## §1 User story

- **§1.1** As **a dust dancer connecting Poseidon to their Salesforce org via OAuth** I want **the refresh token stored sealed to Poseidon's public key, not in clear** so that **an operator with disk-level access to Poseidon's persistence layer cannot exfiltrate my Salesforce credentials — the sealed blob is worthless without Poseidon's private key**.
- **§1.2** As **the Steward** I want **the same sealed refresh token to be safely pushable to an Olympus online encrypted-credential-store** so that **poseidon's local disk is not the trust boundary — the credential is safe in any at-rest location because it's sealed the same way everywhere**.
- **§1.3** As **the Steward** I want **god-key rotation to invalidate every stored service credential atomically** so that **compromise of Poseidon's private key is contained by rotating SSM — every stored SF token, GitHub PAT, HubSpot bearer, etc. becomes unusable in one action, forcing legitimate re-issuance**.
- **§1.4** As **any MCP caller** I want **the same sealed-envelope discipline apollo and athena have** — request sealed to Poseidon's public key, decrypted only at Poseidon's boundary — so that **the fleet's cross-service-call axiom is universal, not per-god**.
- **§1.5** As **the fleet's coherent per-god attestation surface** I want **this ticket to sit alongside apollo (`5.7`) + athena (`5.8`) under the umbrella (`5.5`)** so that **the axiom has three concrete per-god instantiations that any agent can execute against with the shared §9 signal shape**.

## §2 Acceptance criteria

Each criterion is observable end-to-end. §2.A mirrors apollo/athena; §2.B is poseidon-unique.

### §2.A Inbound sealed-envelope boundary (mirrors athena §2.1 / apollo §2.1)

- **§2.1 (Sealed request accepted)** — `POST /v1/poseidon/mcp/*` with a valid Cosmos-Logos envelope sealed to Poseidon's public key → decrypt succeeds at Poseidon boundary → dispatch to the correct downstream API. Verified by `curl` against a deployed Poseidon.
- **§2.2 (Malformed envelope refused)** — envelope with expired timestamp (> 5 min), bad signature, unknown provider, or stale-god-key → HTTP 400 with typed `SovereignEnvelopeError` code. **No silent fallback.** Verified by planted-bad-envelope smoke.
- **§2.3 (Plaintext grep zero-hits — inbound)** — for a completed sealed-envelope request, `grep <decrypted-payload>` across poseidon stdout, CloudWatch log group, Plutus row, and downstream-API request-log returns zero hits.

### §2.B Sealed-credential-at-rest storage (poseidon-unique)

- **§2.4 (Credential stored sealed at capture)** — when a caller connects a service credential (SF OAuth refresh, GitHub PAT, etc.) via the poseidon connect flow, the credential is sealed to Poseidon's public key at the moment of capture, and the sealed blob is what persists — never the plaintext. Verified by grep of poseidon persistence layer (whatever the storage is — local disk / Olympus online / SF / DynamoDB) for the plaintext token → zero hits.
- **§2.5 (Sealed blob portable across at-rest locations)** — the same sealed blob is safe to retain in poseidon's local store, safe to push to an Olympus online encrypted-credential-store, safe to back up to any medium — the security invariant is location-independent. Verified by round-tripping a sealed blob through at least two storage locations and confirming decrypt still works.
- **§2.6 (Decrypt only at moment of use)** — when a stored credential is needed for an MCP call, poseidon decrypts the sealed blob using its private key at request time, uses the credential for the single downstream call, and the plaintext is not persisted anywhere. Verified by grep of poseidon stdout during a scripted MCP call → zero plaintext-credential hits.
- **§2.7 (Plaintext grep zero-hits — at-rest)** — poseidon persistence layer + any Olympus online store + any log sink grepped for a planted test SF-refresh-token plaintext value → zero hits.

### §2.C God-key rotation kill switch (shared shape with apollo/athena)

- **§2.8 (Rotation invalidates client-cached BYOK slots)** — rotate `/olympus/{env}/keys/COSMOS_LOGOS_POSEIDON-616` → next MCP call with a cached sealed BYOK slot → HTTP 401 with typed `envelope_storage_stale` error → client wipes slot and re-prompts.
- **§2.9 (Rotation invalidates stored service-credential blobs)** — same rotation → next MCP call that references a stored SF refresh token → poseidon's decrypt fails → typed `stored_credential_stale` error → caller path re-runs OAuth flow. **This is the atomic-invalidation property — one SSM rotation, two invalidation cascades.**

### §2.D Manifest coherence (mirrors athena §2.4 / apollo §2.4)

- **§2.10 (Manifest publicKey ↔ private-key coherence)** — poseidon boot loads its private key (SSM in prod, `keys/poseidon.key` in dev); `/.well-known/cosmos-logos.json` returns a `publicKey` mathematically derived from the loaded private key. Grep of boot log shows `publicKey derived from loaded private key` (not `using static fallback`).

## §3 Non-functional requirements

- **§3.1 (Envelope security — shared with apollo/athena)** — sealed envelope v1 (flat) and v2 (nested storage-inner) both supported; provider allowlist enforced per MCP integration set; max envelope age 5 min; clock skew tolerance 1 min; typed `SovereignEnvelopeError` codes for every failure mode.
- **§3.2 (Storage-adapter agnostic)** — sealed-credential-at-rest storage MUST work identically across storage backends (local disk / Olympus online encrypted-store / SF Encrypted Field / DynamoDB / future). The sealed blob is the artifact; where it lives is policy.
- **§3.3 (No plaintext credential anywhere in the persistence path)** — grep-based verifications (§2.4, §2.7) enforce this by construction, not by trust.
- **§3.4 (Atomic kill-switch semantics)** — one SSM rotation MUST invalidate both client-cached slots AND stored service-credential blobs in a single deploy. No partial rotation state (some blobs decryptable, others not) is acceptable.
- **§3.5 (BYOK bypasses tithe — where applicable)** — same rule as apollo/athena: when a downstream API call uses a BYOK'd credential, `Plutus` ledger row shows `byok=true, tithed=false`. When it uses a platform-held credential (rare for poseidon, more common for SF integrations if that model applies), truthful attribution.
- **§3.6 (Test coverage)** — poseidon envelope + credential-store code paths ≥ 80% branch coverage (aligned with fleet NFR).

## §4 Feedback inputs

| FB# | Title | Body excerpt |
|-----|-------|--------------|
| — | Steward three-way multi-agent attestation 2026-09-28 | *"yes i want all of these attestations created in the documentation"* — authorizing athena/apollo/poseidon canonical statements + umbrella axiom refinement |
| — | Umbrella `brain_1.7.eos-5.5.md` §1 | Sealed-at-capture / decrypt-at-god-boundary axiom (refined 2026-09-28) |
| — | Sibling apollo `brain_1.7.eos-5.7.md` | Reference for the BYOK-shape sub-attestation |
| — | Sibling athena `brain_1.7.eos-5.8.md` | Anchor reference implementation of the sealed-envelope wire — structural clone target |
| — | Adjacent poseidon cycle `brain_2.7.eos-6.md` | Dynamic MCP router refactor (v2 control plane) — DIFFERENT concern; do not conflate |
| — | Fleet cosmos-logos convention | Every god exposes `/.well-known/cosmos-logos.json` per CLAUDE.md; envelope formats libsodium + apple-cryptokit |

## §5 Steward approval gate

- [ ] Discipline principle acknowledged (sealed-at-capture applies to inbound AND at-rest; god-key rotation is universal kill switch)
- [ ] Canonical attestation statement locked
- [ ] Story locked (§1.1 – §1.5)
- [ ] Acceptance criteria locked (§2.1 – §2.10)
- [ ] NFRs locked (§3.1 – §3.6)
- [ ] **Sealed-credential storage backend** — decision on where the sealed blobs live in v1 (poseidon local disk? Olympus online encrypted-store? SF Encrypted Field? DynamoDB?) — the storage-adapter is policy per §3.2 but v1 needs one concrete backend
- [ ] **Implementation ownership** — is this the poseidon agent's scope, or does it cross into ares / an olympus-store-agent? Cross-repo owners named
- [ ] **PR routing** — new poseidon PR OR fold into existing `brain_2.7.eos-6` scope OR piggyback on olympus-store implementation
- [ ] Approved to execute — signed: **__________** **__________**

---

# § Agent-authored (bottom half)

## §6 Layer impact map

| Repo | Change |
|---|---|
| poseidon | Inbound sealed-envelope path (may already exist per cosmos-logos convention — verify); NEW: sealed-credential-at-rest storage + decrypt-at-use path; god-key rotation kill-switch semantics for stored blobs |
| olympus-grid (if SF Encrypted Field chosen for storage) | Cluster__c / Identity__c field additions for sealed-blob storage |
| Olympus online encrypted-credential-store (if that model chosen) | New service or new use of existing service |
| zeus (SSM) | Rotation of `/olympus/{env}/keys/COSMOS_LOGOS_POSEIDON-616` — same key as athena/apollo pattern |
| MCP-consuming clients (agent app, iris, athena passing through MCP) | Handle `envelope_storage_stale` + `stored_credential_stale` typed errors — wipe cache, re-prompt / re-OAuth |

## §7 Schema deltas

### §7.1 Cosmos-Logos manifest additions (poseidon)
- `capabilities.sovereignAI: true`
- `capabilities.byok_shape: 'service_holds_credentials'` (distinct from apollo/athena's `caller_supplies_per_session`)
- `capabilities.mcp_integrations: ['salesforce', 'hubspot', 'github', 'google', 'workday', ...]`

### §7.2 Sealed-credential storage schema (storage-backend agnostic)
```
{
  credentialId: UUID,
  callerIdentity: string,       // owning identity DID
  integration: 'salesforce' | 'github' | 'hubspot' | ...,
  sealedBlob: bytes,            // sealed to poseidon's public key
  envelopeVersion: 'cosmos-logos-sealed-v2',
  createdAt: timestamp,
  metadata: {                    // NEVER contains the credential itself
    provider_account_hint: string,  // e.g., "user@example.com" (non-secret hint for UI)
    scopes: string[],              // OAuth scopes (non-secret)
    expiresAt: timestamp,          // OAuth token expiry
    rotationEpoch: int             // poseidon key epoch this was sealed under
  }
}
```

### §7.3 No plaintext-credential-anywhere invariant
No Plutus row, no telemetry event, no admin API response, no error message body may contain a plaintext credential. All credential-carrying paths are sealed-blob-only.

## §8 Service contracts

### §8.1 `POST /v1/poseidon/mcp/*` — inbound (sealed-envelope-required)
```
Headers: standard MCP + cosmos-logos envelope
Body: sealed envelope to Poseidon's public key
Response: MCP tool result on success; typed SovereignEnvelopeError on decrypt failure
```

### §8.2 `POST /v1/poseidon/credentials/connect` — capture + seal a service credential
```
Body: {
  integration: 'salesforce' | 'github' | ...,
  oauthTokenOrSecret: <sealed envelope to Poseidon's public key>,
  metadata: { provider_account_hint, scopes, expiresAt }
}
Response: { credentialId }   # returned to client for reference; blob is stored server-side sealed
```
The client MUST seal the OAuth token or secret to Poseidon's public key BEFORE calling this endpoint. Poseidon receives the sealed envelope, extracts metadata (non-secret) for indexing, stores the sealed blob at-rest per the chosen backend.

### §8.3 `POST /v1/poseidon/mcp/*` — with-credential internal path
When an MCP tool call needs a stored credential (e.g., SF query needs a live access token derived from the stored refresh token):
1. Poseidon looks up `credentialId` per calling identity
2. Reads sealed blob from storage
3. Decrypts using its private key (only in-process, only for this call)
4. Uses the credential for the downstream API call (e.g., OAuth token exchange + SF query)
5. Discards plaintext after the call — no caching

## §9 Telemetry assertions (the close-out gate)

### §9.PSD (poseidon-scoped, mirrors athena §9.SOV / apollo §9.SOV)

- **§9.PSD-1** — When a caller submits a valid Cosmos-Logos-sealed request to `/v1/poseidon/mcp/*`, decrypt succeeds at Poseidon's boundary and the downstream API responds. Plutus row shows `mcp.tool.call` with correct attribution.
- **§9.PSD-2** — When a caller submits a malformed envelope, Poseidon returns typed `SovereignEnvelopeError` (400); no downstream API is called; no partial-state leaks.
- **§9.PSD-3** — Grep of poseidon stdout, CloudWatch log group, Plutus row, and downstream-API request-log for the decrypted payload → zero hits.
- **§9.PSD-4** — When a caller connects a new service credential (e.g., SF OAuth), the sealed blob is what persists; grep of poseidon persistence layer for the plaintext token → zero hits.
- **§9.PSD-5** — Round-trip a sealed credential blob through poseidon local disk + Olympus online store (or the two chosen backends) → decrypt still succeeds from either location.
- **§9.PSD-6** — When an MCP call uses a stored credential, grep of poseidon stdout during the call → zero plaintext-credential hits; downstream call succeeds.
- **§9.PSD-7** — Rotate `/olympus/{env}/keys/COSMOS_LOGOS_POSEIDON-616` → next MCP call with cached BYOK slot → HTTP 401 `envelope_storage_stale`.
- **§9.PSD-8** — Same rotation → next MCP call referencing stored SF token → HTTP 401 `stored_credential_stale`. **Both invalidations fire from one rotation — atomic kill switch.**
- **§9.PSD-9** — Boot log shows `publicKey derived from loaded private key` (not static fallback).

### §9.OP (shared with apollo/athena)
- **§9.OP-1** — Poseidon envelope + credential-store code path branch coverage ≥ 80%.
- **§9.OP-2** — `POST /v1/poseidon/byok/test` (parallel to apollo/athena) returns `{ ok: true }` for each integration; never echoes decrypted credential.

## §10 Execution plan

1. **§5 rulings signed** (storage backend + ownership + PR routing).
2. **Verify inbound-envelope boundary** already present per cosmos-logos convention; if not, port from athena `sovereign-envelope.ts` (structural clone). Closes §2.1 – §2.3.
3. **Implement sealed-credential-at-rest storage** — new work. Storage-adapter interface + one concrete backend per §5 ruling. Closes §2.4 – §2.7.
4. **Wire the with-credential MCP call path** (§8.3). Closes §2.6.
5. **Add rotation-invalidation semantics** — both client-cached-slot and stored-credential-blob invalidation on god-key rotation. Closes §2.8 – §2.9.
6. **Manifest coherence** — boot-time derive `publicKey` from loaded private key. Closes §2.10.
7. **CI + smoke** — §9.PSD-1 through §9.PSD-9 fire green against int-cluster poseidon.
8. **Merge** + parent submodule bump + CDK deploy.
9. **Prod attestation** — same §9 signals fire against `brain/2.7.x.x`-deployed poseidon.
10. **§13 closeout.** `git mv 04_in_development → 06_shipped`.

### §10.1 Deferred to future cycles
- **Shared crypto extraction** — `@olympus/cosmos-logos-server` package deduplicating apollo + athena + poseidon envelope code. ADR candidate; not gating.
- **Sealed-credential dashboard** — argos-scoped view of stored credentials per identity (metadata only, no decrypt).
- **Backup / migration path** — for stored sealed blobs across god-key rotation events (may need re-encryption via caller re-OAuth rather than server-side re-encrypt, which would require plaintext-decrypt).

## §11 Verification protocol

### §11.1 Without iPhone
- `curl POST /v1/poseidon/mcp/*` with valid sealed envelope → 200.
- `curl POST /v1/poseidon/mcp/*` with bad envelope → 400 with typed error.
- `curl POST /v1/poseidon/credentials/connect` with sealed SF OAuth → returns credentialId; grep storage for plaintext → 0.
- Rotate SSM → both cached-slot AND stored-blob invalidation smokes.
- `curl /.well-known/cosmos-logos.json` → verify publicKey derives from loaded private key.

## §12 Rollback plan

- **Inbound-envelope path** — feature-flag `POSEIDON_SEALED_ENVELOPE_ENABLED=false` reverts to prior (pre-sealed) accept semantics if that was ever the shape. If sealed envelope was always required, no rollback — the alternative is broken security.
- **Sealed-credential-at-rest** — if the storage-adapter fails, disable NEW credential connections; existing sealed blobs continue to work (they don't need the write path). Force-migrate to a different storage backend if backend is the issue.
- **God-key rotation kill-switch behavior** — cannot be rolled back; the rotation itself is the atomic operation. Recovery = re-onboard callers via re-OAuth for stored credentials and re-BYOK-paste for cached slots.
- **Non-revertable elements** — sealed blobs stored under an old god-key epoch are permanently unusable after rotation (that IS the kill switch). Callers must re-issue credentials.

## §13 Closeout

*Filled at end of cycle.*

### What shipped
- …

### What deferred (and why)
- Shared crypto extraction — ADR candidate.
- Sealed-credential dashboard (argos-scoped) — future observability cycle.
- Cross-rotation-epoch backup / re-encryption path — deliberately deferred; forcing re-OAuth is the security-preserving recovery model.

### Verification evidence
- Links to §9.PSD-1 through §9.PSD-9 artifacts.
- Round-trip test output for sealed-blob portability across two storage backends.
- SSM rotation atomic-invalidation smoke output.
- `brain/2.7.x.x` post-merge poseidon SHA + parent submodule bump SHA + CDK deploy log.

### Feedback that emerged from THIS cycle (seed for the next one)
- Storage-adapter refactor (if a second backend is added) — future cycle.
- Cross-rotation backup story — deferred by design; revisit if operational pain surfaces.
- `@olympus/cosmos-logos-server` shared crypto extraction — natural after third sealed-envelope implementation (this ticket makes it three: athena + apollo + poseidon).

### Memory updates
- New memory candidate: poseidon holds credentials on caller's behalf sealed to poseidon's pub key; god-key rotation invalidates both cached BYOK slots AND stored service-credential blobs atomically.

### Cycle close commit
- Poseidon PR merge SHA + parent submodule bump SHA + CDK deploy log.
- Steward sign-off: **__________** **__________**

---

## References

- **Umbrella cycle:** [`brain_1.7.eos-5.5.md`](brain_1.7.eos-5.5.md) — sealed-at-capture / decrypt-at-god-boundary axiom (refined 2026-09-28)
- **Sibling per-repo attestations (BYOK cascade):** [`brain_1.7.eos-5.7.md`](brain_1.7.eos-5.7.md) apollo · [`brain_1.7.eos-5.8.md`](brain_1.7.eos-5.8.md) athena · [`brain_1.7.eos-5.9.md`](brain_1.7.eos-5.9.md) omens · [`brain_1.7.eos-5.10.md`](brain_1.7.eos-5.10.md) plutus attribution
- **Adjacent poseidon cycle (DIFFERENT concern):** [`brain_2.7.eos-6.md`](brain_2.7.eos-6.md) — dynamic MCP router v2 control plane; do not conflate
- **Poseidon PR #40 (dynamic MCP router — separate):** [feat(poseidon): dynamic MCP router (v2 control plane)](https://github.com/olympus-616/poseidon/pull/40)
- **Cosmos-Logos protocol reference:** olympus-616 parent `CLAUDE.md` § Cosmos-Logos Protocol
- **EOS operating manual:** [`../README.md`](../README.md)
