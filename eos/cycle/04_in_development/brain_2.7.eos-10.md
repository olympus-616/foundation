---
pitch: "One file-storage API across every provider"
---

# Proteus — universal file-storage adapters + per-provider OAuth harness

> File: `brain_2.7.eos-10.md` — **tenth primary EOS cycle on the `brain/2.7.x.x` family** (peer of HUD `eos-1`, aeon `eos-2`, argos `eos-3`, and primaries `eos-4..9` already in `04_in_development/`). **Design stage.** Source: Steward paste 2026-09-30 of a proteus-local FT-001 draft card ("Universal file-storage adapters + per-provider OAuth"), recast into EOS cycle format for governance intake.
>
> **Dual-track note.** The proteus repo also maintains an internal `docs/features/FT-###` card format for engineering tracking (the pasted source was authored in that shape, destined for `proteus/docs/features/02_design/FT-001-universal-file-adapters.md`). That card lives inside the proteus repo for engineering-local traceability; THIS card is the EOS governance artifact under the single-open-cycle mutex. Both exist on purpose and refer to the same work.
>
> **Status-vs-reality note.** This card entered at `02_design/` per Steward direction 2026-09-30, but the prototype slice described in the source had already landed in the proteus workspace — most §2 acceptance criteria below were observed on that prototype, not on production. The gap from "prototype passes locally" to "attested in production via §9 telemetry" is exactly the work this cycle walks from `02_design/` → `04_in_development/` → `06_shipped/`. **Promoted to `04_in_development/` 2026-10-18** on Steward direction after substantive Slice-1 code landed (keypair + Connected App + JWT exchange + `SalesforceFileAdapter` + Plutus emission + `README-SF-SETUP.md` wired on the proteus workspace; iris agent `useProteusFiles` hook + neuron Attachments tab in flight).

> **Architecture lock 2026-10-17/18 (Steward).** The Salesforce-ContentVersion adapter authenticates via **OAuth 2.0 JWT Bearer Flow** — server-to-server, admin-provisioned per cluster, no per-user consent — a **dedicated Proteus Connected App per cluster**, NOT a reuse of Poseidon's. This refines §2.3 below and supersedes the §6 "Reuses Poseidon Connected App" row. The interactive OAuth harness (§2.2 — Dropbox / Google / Microsoft) and the server-to-server JWT path (§2.3 / §2.10 — Salesforce) now coexist in the same proteus-api under one adapter contract. Prototype storage for the private key: env var; production: SSM SecureString / Secrets Manager via ECS `secrets:` injection. **Multi-tenant isolation at the SF-user layer:** each cluster → dedicated Proteus integration user in its SF org → scoped permission set controls what Proteus can touch. cp-biz uses an admin user for the prototype only (follow-up: rotate to a dedicated integration user before any subscriber ship).

> **Relationship primitive — NO `ContentDocumentLink`.** The link from a parent record (e.g. a neuron) to its attachments lives in a **substrate-neutral `typeId` tag**. On the SF adapter, `ContentVersion.Description = "neuron-<guid>"`; on S3, the object-key convention carries the same tag; on local disk, the directory path does. One relationship pattern across every backend — swap storage substrates without touching the relationship primitive. This is what makes neurons Pinterest-style attachment boards whose storage substrate is swappable per neuron.

> **Slice-1 demo artifact.** When this slice ships: click a neuron in `beta.olympus-grid.com/agent` → Attachments tab → drop 10 files → verify in an incognito session → see the Plutus live ledger populate 10 upload events → see matching `ContentVersion` rows in cp-biz SF. The end-game is the **second-cluster demo**: identical olympus-grid agents running from different grid configurations (one SF-backed via `SalesforceFileAdapter`, one S3-backed via `S3Adapter`) producing identical UX — only `storage.adapterId` differs in the ledger row. That is the proof the substrate-neutral architecture is real, not scaffolding.

| | |
|---|---|
| **Branch family** | `brain/2.7.x.x` |
| **Cycle ordinal** | `eos-10` (tenth primary on 2.7 family) |
| **Status** | **`In Development`** — Slice 1 (SF-ContentVersion via JWT Bearer) landed on proteus prototype; iris agent neuron Attachments tab in flight; Hermes routing split + Pantheon Docker image + "Dog Records" end-to-end demo pending. Steward §5 verbal ratification 2026-10-18 via direction *"analyze the open cards and either update the correct card with the new scope and design or create a new card"* — scope confirmed as Slice 1 of this cycle, not a new cycle. Formal §5 checkboxes pending. |
| **Current slice** | Slice 1 — **SF-ContentVersion adapter (JWT Bearer)** + **iris agent neuron Attachments tab** + **second-cluster SF-vs-S3 substrate demo**. |
| **Opened** | 2026-09-30 (Design) · **Promoted to In Development 2026-10-18** |
| **Closed** | — |
| **Prior cycle** | `brain_2.7.eos-3` (argos — ordinally prior design-stage primary; no logical dependency, just the previous card on this family). **Logical dependency:** `brain_2.7.eos-5` (Olympus-Brain Genesis — defines the neuron as a logical GUID whose physical path Proteus owns) + `brain_2.7.eos-19` (Aeon plugin — iris PR #139 is the surface consumer of the attachment tab). |
| **Theme** | Proteus gains a blob-shaped adapter contract alongside its record contract. Six initial file adapters (local, S3+CloudFront, Dropbox, Google Drive, OneDrive/SharePoint, Salesforce ContentVersion) + a shared OAuth harness for Dropbox / Google / Microsoft **plus a JWT-Bearer path for Salesforce** behind one disk-backed token store. One API for all file I/O across the fleet; swap backends via config, not code. **Neurons become Pinterest-style attachment boards; files follow the neuron across every storage substrate.** Salesforce auth via a dedicated Proteus Connected App per cluster — the shape every other god can copy for home-node talk-back. |
| **Feedback inputs** | Steward paste 2026-09-30 (FT-001 draft, proteus-local); Hestia semantic-type binding gap (no code owner of type→storage today); TurtleShell "upload a photo" surfaces blocked on per-caller storage choice; Steward direction 2026-10-17/18 (JWT Bearer architecture lock + neuron attachment UX as the first user-visible consumer + second-cluster substrate demo as end-game attestation vehicle). |
| **Estimated effort** | Multi-cycle. Slice 1 (prototype) has largely landed in the proteus workspace; this cycle's close target = **production-attestable universal file I/O for the six initial adapters + four OAuth providers**. Hestia-driven binding, Hecate-backed token vault, resumable upload sessions = later cycles. |
| **Actual effort** | — |

---

# § Steward-authored (top half)

## §1 User story

> §1.1 — As a **god service that needs to store or fetch a blob** (image, document, media), I want **one API call that gives me the file without caring about physical storage** so that **I can be swapped between backends via config, not code**.
>
> §1.2 — As a **TurtleShell surface user**, I want to **upload a photo to the storage I control** (my Dropbox, my Drive, my SharePoint, my SF org, or the platform's S3) so that **my content lives where my policies say it lives, not where the vendor picked for me**.
>
> §1.3 — As the **olympus-616 platform**, I want **proteus to be the first god that talks back to its home node (olympus-grid Salesforce) via OAuth-direct SObject + ContentVersion REST** so that **every other god has a copyable pattern for home-node talk-back, and no god is coupled to olympus-grid-specific Apex endpoints**.
>
> §1.4 — As an **iris-agent operator** working in `beta.olympus-grid.com/agent`, I want to **attach unlimited files to any neuron** (Pinterest-style boards: images, PDFs, meeting notes, receipts, long-form writing) **and retrieve them in any later session, from any device** so that **neurons become the universal container for knowledge and the storage substrate is swappable per neuron without touching the UI**.
>
> §1.5 — As the **Steward demonstrating olympus-grid at EOS end-game**, I want **two clusters running the same iris agent against different Proteus storage substrates (one SF-backed, one S3-backed) to produce indistinguishable UX** so that **the substrate-neutral architecture is proven, not asserted**.

## §2 Acceptance criteria

Each criterion must be observable end-to-end against the deployed cluster, not just on the prototype laptop. Items marked `[prototype-observed]` already hold on the local prototype; the production-attestation work is to re-fire them under §9 telemetry contracts against the brain/2.7.x.x cluster.

- **§2.1** [prototype-observed] **Given** no OAuth credentials in `.env`, **when** I visit `/auth`, **then** I see one tile per provider showing "Not configured" with the env var names to set — AND the backend emits no credential-request telemetry to any external provider.
- **§2.2** [prototype-observed] **Given** OAuth clients for Dropbox / Google / Microsoft are present in `.env`, **when** I click Connect on each tile, **then** a popup completes the flow and the tile shows "Connected as {email}" with no page refresh — AND the next session log contains one `oauth.connect.success` event per completed provider.
- **§2.3** [prototype-observed] **Given** a connected Salesforce session, **when** I run the smoke test on `/salesforce`, **then** I see 6 green steps (session → create → read → update → query → delete) with the created Account id and zero residue in the org — AND the session log contains one `salesforce.smoke.account.pass` event with the round-tripped id.
- **§2.4** [prototype-observed] **Given** a file at `/upload` and N adapters selected, **when** I click upload, **then** I get N result rows showing per-adapter success + the returned `ProteusFile.id` — AND the session log contains N `proteus.file.put.success` events with matching `{adapterId, typeId, size, checksum}` props.
- **§2.5** [prototype-observed] **Given** uploaded files, **when** I visit `/files` (Gallery), **then** I see one grid per adapter with image thumbnails + open+delete controls scoped by typeId.
- **§2.6** **Given** the brain/2.7.x.x cluster is up, **when** I curl `GET /api/v1/files/` (list adapters) against the deployed proteus endpoint, **then** I receive all 6 adapters with their declared capabilities (`maxBodyBytes`, `rangeReads`, `multipart`, `signedUrls`, `requiresAuth`) and the response carries `X-Cycle-ID`.
- **§2.7** **Given** a valid namespace with a connected SF session on the deployed cluster, **when** I curl `POST /api/v1/salesforce/smoke/account`, **then** I receive 6 passed steps + an SF `LedgerEntry__c` row shows the round-trip under the correct `Cycle__c` FK.
- **§2.8** **Given** a provider access token has expired, **when** the next adapter call fires, **then** the OAuth harness refreshes transparently and the call succeeds on the first retry — session log carries one `oauth.token.refresh.success` event.
- **§2.9** **Given** a neuron rendered in the iris agent and the Attachments tab open, **when** I drop N files, **then** every file lands at `POST /v1/proteus/files/neuron-<guid>` with one `proteus.file.put.success` event per file; opening the same neuron in a fresh incognito session shows the identical N attachments retrieved via `GET /v1/proteus/files/neuron-<guid>`, with one `proteus.file.get.success` event per retrieval.
- **§2.10** **Given** a dedicated Proteus Connected App in cp-biz with the Proteus-held cert admin-pre-authorized, **when** proteus-api needs to call Salesforce, **then** the JWT Bearer exchange against `cloudpremise.my.salesforce.com/services/oauth2/token` returns an `access_token` on demand with no per-user consent flow — session log carries one `oauth.jwt_bearer.exchange.success` event per token acquisition and the SF HTTP call that triggered it succeeds. **Zero occurrences of `oauth.jwt_bearer.private_key.plaintext.leak`** (invariant guard — the private key is never serialized to a log line).
- **§2.11** **Given** two olympus-grid clusters configured identically except for the Proteus adapter selector (cluster A: `adapter=sf`, cluster B: `adapter=s3`), **when** the same neuron+attachment flow runs against each, **then** the Attachments tab behavior is indistinguishable to the operator AND both clusters emit identically-shaped `proteus.file.put.success` events differing only in `storage.adapterId` AND both clusters' Plutus ledgers carry one `LedgerEntry__c` row per I/O keyed to the same `Cycle__c` shape.

## §3 Non-functional requirements

- **Cycle latency budget** — p50 ≤ 400 ms, p95 ≤ 1500 ms for small (<256 KB) blob roundtrips through local, S3, and SF-ContentVersion adapters. Dropbox / Google / OneDrive bounded by their provider SLAs (budget deferred to §6 refinement).
- **Cost budget** — zero marginal $ per request beyond the provider's standard quota; S3 bucket + CloudFront distribution costs separately tracked.
- **Observability** — every file I/O carries `cycleId` + `adapterId` + `typeId` in both the HTTP envelope and the `LedgerEntry__c` row written at request close.
- **Compatibility** — `IProteusAdapter` (record contract) is NOT modified; the new `IProteusFileAdapter` sits alongside. Existing adapters + callers continue to work unchanged.
- **Privacy** — OAuth client secrets live in `.env` + SSM only; access + refresh tokens live on disk at `.agent/local/tokens/{namespace}/*.json` with 0600 mode, gitignored; neither is ever logged. **JWT-Bearer private keys** (Salesforce path) live at `~/dev/secrets/proteus-sf-<cluster>.{crt,key}` with 0600 mode in prototype; in production they live in SSM SecureString / Secrets Manager and are injected via ECS `secrets:` field — **the key file is never read into a log line, never emitted in a stack trace, and never serialized across the HTTP boundary**. The `oauth.jwt_bearer.private_key.plaintext.leak` invariant event is the §9 tripwire. SF TLS workaround for custom-domain leaf-only certs is scoped per-fetch with try/finally restoration (mirror of the public-API adapter pattern).
- **Performance** — multipart upload cap 500 MB per request (configurable); per-adapter `maxBodyBytes` enforced before dispatch; OneDrive >4 MB and Dropbox >150 MB require resumable sessions — deferred, enforced via capability flag refusal in v1.
- **Zero-state** — adapters hold no state between requests; horizontal scale unchanged.
- **Explicitly out of scope for v1 (Steward direction):** GPT content moderation / policy gates. One function + one call site when wanted; not now.

## §4 Feedback inputs

| FB# | Title | Body excerpt |
|-----|-------|--------------|
| — | Steward paste 2026-09-30 | *"Here's the EOS feature card. … The real `FT-###` numbering needs the next-free id in proteus's `docs/features/` tree. … Status is `design` in the frontmatter but the acceptance criteria are checked — because the prototype actually landed."* |
| — | Hestia binding gap | ObjectType → adapter resolution lives nowhere today; switching backends requires per-caller edits. |
| — | TurtleShell upload-a-photo surfaces | Blocked on per-surface code when the user's chosen storage is any of the OAuth providers. |

## §5 Steward approval gate

- [ ] Story locked (§1.1 / §1.2 / §1.3)
- [ ] Criteria locked (§2.1–§2.8; the `[prototype-observed]` markings reflect current reality, not a §5-approved contract)
- [ ] NFRs locked (incl. explicit v1 scope exclusions: GPT moderation, resumable upload sessions, Hestia binding, Hecate vault)
- [ ] Slice-1 scope locked = "production-attestable universal file I/O for the 6 initial adapters + 4 OAuth providers against brain/2.7.x.x deployed cluster"
- [ ] Approved to move `02_design → 04_in_development` — signed: **{Steward initials}** **{date}**

---

# § Agent-authored (bottom half — scaffold for proteus-agent iteration)

> **To the proteus agent reading this:** §6–§13 below are seeded from the FT-001 source paste. Iterate them in-place against the EOS template conventions (`§6` layer impact / `§7` schema / `§8` service contracts / `§9` telemetry assertions / `§10` execution plan / `§11` verification protocol / `§12` rollback / `§13` closeout). The §9 slot is the close-criterion gate — it needs sharp, observable log-line signatures, not just test checklists. The source paste's §6 (Test Plan) belongs under §11 here; the source's §4.4 (API Changes) belongs under §8; etc.

## §6 Layer impact map

| Criterion | olympus-grid (SF) | Pantheon services | proteus-ui | iris agent (`reactforce/agent/`) | Hermes | TurtleShell surfaces | SDK / protocol |
|-----------|-------------------|-------------------|------------|-----------------------------------|--------|----------------------|----------------|
| §2.1 | — | proteus-api `/auth` route tiles | AuthHub page | — | — | (indirect) | OAuth harness contract |
| §2.2 | — | OAuth harness `/api/v1/oauth/*` + disk tokenStore | AuthHub + popup | — | — | — | OAuth provider registry |
| §2.3 / §2.10 | **New Proteus Connected App per cluster** (dedicated, NOT Poseidon's); scoped permission set controls access; integration user per cluster (follow-up) | proteus-api `/api/v1/salesforce/*` + shared `sfClient.ts` + `sfJwtAuth.ts` (JWT Bearer exchange + in-memory token cache) | Salesforce page | — | — | — | SF REST (sobjects/* + ContentVersion); JWT Bearer flow |
| §2.4–§2.5 | — | 6 file adapters + `FileRegistry` + `/api/v1/files/*` router + per-op Plutus emission | Upload + Gallery pages | — | — | — | `IProteusFileAdapter` |
| §2.6 | — | Adapter capability declaration surfaces at list endpoint | — | — | — | — | HTTP envelope `X-Cycle-ID` |
| §2.7 | `LedgerEntry__c.Cycle__c` FK; no schema delta | proteus-api + plutus write-through | — | — | — | — | — |
| §2.8 | — | `accessToken.ts` resolver + 401 retry wrapper | — | — | — | — | — |
| §2.9 | `ContentVersion.Description = "neuron-<guid>"` convention (no new SObject or junction) | proteus-api `/v1/proteus/files/:typeId[/:id]` + `SalesforceFileAdapter` | — | `useProteusFiles` hook + `NeuronDetailPanel` Attachments tab + Proteus menu entry/settings page (handshake + substrate stubs + Neuron-CRUD-unification reminder) | **Routing split**: `/v1/proteus/files/*` → Node Proteus; else → Apex Proteus (neuron record CRUD stays Apex for this slice) | — | Universal file API shape |
| §2.11 | identical schema in both clusters | identical Node Proteus binary; different `adapter=` config | — | identical Attachments tab | identical routing | — | Capability-flagged adapter divergence (`storage.adapterId`) |

## §7 Schema deltas

- **SObjects:** NONE on olympus-grid for this cycle (SF file adapter uses direct `/sobjects/ContentVersion` REST, not a new Apex endpoint).
- **New runtime type (proteus-api, not an SObject):** `ProteusFile { id, typeId, namespace, name, mimeType, size, checksum?: {algo,value}, storage: {adapterId, adapterType, nativeId, uri?, path?}, acl?: {visibility, ownerId?, readers?}, metadata: {createdAt, updatedAt, version} }`.
- **No changes to `ProteusObject` or `ObjectType`.**
- **Plugin__mdt:** no new rows for v1 (adapter resolution driven by header/query/prefix convention; Hestia-driven binding deferred).

## §8 Service contracts

New routes under `/api/v1` on proteus-api. All responses carry `X-Cycle-ID`, `X-Request-ID`; file-write endpoints carry `x-user-identity`.

```
POST   /files/:typeId                 Multipart or JSON {name,mimeType,base64}
GET    /files/:typeId                 List
GET    /files/:typeId/:id             Body stream (or metadata if Accept: application/json)
GET    /files/:typeId/:id/signed-url  Short-lived URL (501 if adapter lacks the capability)
DELETE /files/:typeId/:id
GET    /files/                        List registered adapters + capabilities

GET    /oauth/providers               Static provider list + configured flag
GET    /oauth/                        Stored tokens for namespace
GET    /oauth/:provider/start         302 → provider authorize URL
GET    /oauth/callback                Code exchange + token persist
GET    /oauth/:provider/status
POST   /oauth/:provider/disconnect

GET    /salesforce/session            Session info or not-connected
GET    /salesforce/sobjects/:type     SOQL top-10
POST   /salesforce/sobjects/:type     Create
GET    /salesforce/sobjects/:type/:id Read
PATCH  /salesforce/sobjects/:type/:id Update
DELETE /salesforce/sobjects/:type/:id
GET    /salesforce/sobjects/:type/describe
POST   /salesforce/smoke/account      Full CRUD round-trip, one-shot
```

Request routing: `X-Proteus-File-Adapter: s3` header (or `?adapter=s3` query) selects adapter; `X-Proteus-Namespace` (or `?namespace=`) scopes credentials. Mounting order: `/files` and `/oauth` MUST mount BEFORE the generic REST `/:typeId` router or the wildcard swallows them as unknown ObjectTypes.

## §9 Telemetry assertions (the close-out gate)

These signatures MUST appear in the Slice-1 attestation play cycle's session log. Each is observable in the Plutus live ledger as well as the HTTP request log.

**Core file-I/O signatures:**

- **§9.PFA-1** — `proteus.file.put.success` with props `{adapterId, typeId, size, checksum, ms, cycleId}` fires exactly once per §2.4 / §2.9 upload.
- **§9.PFA-2** — `proteus.file.get.success` with props `{adapterId, typeId, id, bytes, ms, cycleId}` fires exactly once per §2.9 incognito-session retrieval.
- **§9.PFA-3** — `proteus.file.delete.success` with props `{adapterId, typeId, id, cycleId}` fires exactly once per delete.
- **§9.PFA-4** — Every HTTP response from `/v1/proteus/files/*` carries `X-Cycle-ID` matching the trace.

**OAuth signatures (interactive harness — §2.2 / §2.8):**

- **§9.OA-1** — `oauth.connect.success` with prop `{provider}` fires exactly once per §2.2 successful round-trip.
- **§9.OA-2** — `oauth.token.refresh.success` with prop `{provider}` fires on §2.8 transparent-refresh path.
- **§9.OA-3** — Zero occurrences of `oauth.token.plaintext.leak` (invariant guard — if we ever log a token in cleartext, this event fires and §9 fails).

**JWT Bearer signatures (§2.10 — the architecture lock):**

- **§9.JWT-1** — `oauth.jwt_bearer.exchange.success` with props `{tenant, connectedAppClientId, subject, aud, exp, ms}` fires exactly once per JWT token acquisition against `cloudpremise.my.salesforce.com/services/oauth2/token`.
- **§9.JWT-2** — Zero occurrences of `oauth.jwt_bearer.private_key.plaintext.leak` (invariant guard — the Proteus-held `.key` must never appear in logs, stack traces, or over the wire).
- **§9.JWT-3** — `salesforce.smoke.account.pass` with prop `{accountId, authMethod: "jwt_bearer"}` fires exactly once per §2.3 / §2.7 smoke run, confirming the JWT path is the one that executed the SF REST round-trip.

**Second-cluster substrate-neutral signatures (§2.11):**

- **§9.X-1** — Running the identical neuron-attachment flow against clusters A (`adapter=sf`) and B (`adapter=s3`) produces TWO sets of `proteus.file.put.success` events whose props differ ONLY in `storage.adapterId`. All other prop shapes identical.
- **§9.X-2** — Plutus SOQL `SELECT * FROM LedgerEntry__c WHERE Cycle__c = :cycleId` on each cluster returns one row per file I/O, with event-type shapes matching across clusters.

**Zero-regression invariants:**

- Zero `oauth.token.plaintext.leak` **and** zero `oauth.jwt_bearer.private_key.plaintext.leak` across the entire Slice-1 play.
- Every record-CRUD call (neuron create/update/archive) still routes to the Apex path, NOT the Node proteus path — Hermes routing split holds.

## §10 Execution plan

### Slice-1 status checkpoint (2026-10-18)

**Landed on proteus workspace (prototype-attested):**

- [x] Keypair generated (`~/dev/secrets/proteus-sf-cp-biz.{crt,key}`, 0600 mode, gitignored)
- [x] Connected App created in cp-biz, cert uploaded, admin pre-authorized
- [x] JWT Bearer exchange validated end-to-end against `cloudpremise.my.salesforce.com` — returns `access_token` on demand
- [x] `ContentVersion` CRUD validated: write → read bytes-match → delete clean, zero pollution in the org
- [x] Proteus `sfJwtAuth.ts` + `SalesforceFileAdapter` + Plutus emission wired, TypeScript clean
- [x] `README-SF-SETUP.md` committed documenting the setup walkthrough

**In flight (surface + fleet wiring):**

- [ ] iris agent `useProteusFiles` hook + Attachments tab in `NeuronDetailPanel`
- [ ] Proteus menu entry + settings page (handshake + substrate stubs + Neuron-CRUD-unification reminder)
- [ ] Hermes routing split: `/v1/proteus/files/*` → Node Proteus; else fall through to Apex Proteus (record CRUD stays Apex this slice)
- [ ] Build + push Pantheon Docker image including Node Proteus process; rotate cp-biz Fargate task-def
- [ ] End-to-end "Dog Records" neuron demo: 10-file upload + incognito-session retrieval

**Attestation ship:**

- [ ] PRs opened: iris · proteus · olympus-grid (if any) · olympus-616 parent (submodule bump)
- [ ] §9.PFA-* + §9.JWT-* + §9.X-* signatures grepped from the Slice-1 play session log; counts match §2.9–§2.11 expected counts
- [ ] §13 closeout authored; move `04_in_development/ → 06_shipped/`

**Stretch (same cycle if time; else Slice 2):**

- [ ] Neuron tags (user-defined, searchable from the agent Registry)
- [ ] Second-cluster substrate demo (SF-vs-S3) with cluster B provisioned

## §11 Verification protocol

### Without iPhone (prototype slice, already observed)
- proteus-ui pages Upload / Gallery / Salesforce / AuthHub exercised manually; smoke endpoint `POST /salesforce/smoke/account` returns 6 passed steps.
- `.env` + disk tokens prove the dev-loop end-to-end against sandbox provider accounts.

### Production probe (the §9 attestation itself — new work)
- curl the deployed proteus endpoint for each §8 route; verify `X-Cycle-ID` + body shape.
- SOQL the plutus ledger for the cycle's file I/O rows.
- grep the session log for every §9 event signature; count must match the expected count per §2.X.

### With iPhone
- Only if a TurtleShell-iOS surface in this cycle actually invokes a proteus file adapter from device (deferred; TurtleShell surfaces are the next slice).

## §12 Rollback plan

- Revert the parent olympus-616 submodule bump that promoted the proteus image — previous Pantheon pointer still has a working ECR image. CDK redeploys the prior task definition.
- OAuth redirect URIs on provider consoles are additive; no cleanup needed.
- Disk tokens are local-only; no shared state to drain.
- No olympus-grid schema deltas → no destructive-deploy risk from this cycle.

## §12.1 Follow-ups tracked (not blockers for Slice-1 close)

Captured now so they survive Slice-1 closeout. Each is scoped as a sibling or downstream cycle, not a blocker here.

- **Private key → SSM SecureString** for prod rotation plan (prototype uses `~/dev/secrets/` + env var).
- **Connected App bundling into the olympus-grid managed package** so subscriber installs provision their own Proteus Connected App on install.
- **Dedicated Proteus integration user per cluster** (cp-biz currently uses an admin user for the prototype only — rotate before any subscriber ship).
- **Unify Neuron CRUD into Proteus.** Current slice: Proteus brokers attachments only; neuron record CRUD stays Apex via Hermes routing split. Downstream slice unifies.
- **Multi-adapter runtime cache**: convert `sfJwtAuth` cache from module-scoped to `Map<adapterInstanceId, …>` for multi-SF-org deployments (one proteus-api instance brokering to multiple SF orgs simultaneously).
- **Signed-URL + S3+CloudFront path** (defer-until-S3-adapter-registered) — §8 `/signed-url` route exists but returns 501 for adapters without the capability.
- **Hestia-driven ObjectType → adapter binding** — belongs to the Hestia cycle, not here.
- **Hecate-backed token storage** — belongs to the Hecate cycle, not here; disk store is the bridge.
- **Resumable upload sessions** (OneDrive >4 MB, Dropbox >150 MB) — capability-flag refusal is the correct v1 behavior.

## §13 Closeout

Filled at end of cycle. Doc goes append-only-evidence after this.

### What shipped
- …

### What deferred (and why)
- Hestia-driven ObjectType → adapter binding — belongs to the Hestia cycle, not here.
- Hecate-backed token storage — belongs to the Hecate cycle, not here; disk store is the bridge.
- Resumable upload sessions (OneDrive >4 MB, Dropbox >150 MB) — not a v1 use case; capability flag refusal is the correct behavior.
- GPT content moderation / policy gates — Steward direction: explicitly out of scope for v1.

### What surprised
- …

### Verification evidence
- …

### Feedback that emerged from THIS cycle (seed for the next one)
- …

### Memory updates
- …

### Cycle close commit
- Branch / PR link
- Steward sign-off: **{Steward initials}** **{date}**
