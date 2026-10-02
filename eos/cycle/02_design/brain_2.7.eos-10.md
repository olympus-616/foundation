---
pitch: "One file-storage API across every provider"
---

# Proteus — universal file-storage adapters + per-provider OAuth harness

> File: `brain_2.7.eos-10.md` — **tenth primary EOS cycle on the `brain/2.7.x.x` family** (peer of HUD `eos-1`, aeon `eos-2`, argos `eos-3`, and primaries `eos-4..9` already in `04_in_development/`). **Design stage.** Source: Steward paste 2026-09-30 of a proteus-local FT-001 draft card ("Universal file-storage adapters + per-provider OAuth"), recast into EOS cycle format for governance intake.
>
> **Dual-track note.** The proteus repo also maintains an internal `docs/features/FT-###` card format for engineering tracking (the pasted source was authored in that shape, destined for `proteus/docs/features/02_design/FT-001-universal-file-adapters.md`). That card lives inside the proteus repo for engineering-local traceability; THIS card is the EOS governance artifact under the single-open-cycle mutex. Both exist on purpose and refer to the same work.
>
> **Status-vs-reality note.** This card enters at `02_design/` per Steward direction, but the prototype slice described in the source has already landed in the proteus workspace — most §2 acceptance criteria below are observed on that prototype, not on production. The gap from "prototype passes locally" to "attested in production via §9 telemetry" is exactly the work this cycle will walk from `02_design/` → `04_in_development/` → `06_shipped/`.

| | |
|---|---|
| **Branch family** | `brain/2.7.x.x` |
| **Cycle ordinal** | `eos-10` (tenth primary on 2.7 family) |
| **Status** | `Design` — §1–§5 seeded from Steward paste 2026-09-30; §6–§13 to be iterated by the proteus agent; §5 checkboxes pending Steward signature |
| **Opened** | 2026-09-30 |
| **Closed** | — |
| **Prior cycle** | `brain_2.7.eos-3` (argos — ordinally prior design-stage primary; no logical dependency, just the previous card on this family) |
| **Theme** | Proteus gains a blob-shaped adapter contract alongside its record contract. Six initial file adapters (local, S3+CloudFront, Dropbox, Google Drive, OneDrive/SharePoint, Salesforce ContentVersion) + a shared OAuth harness for Dropbox / Google / Microsoft / Salesforce behind one disk-backed token store. One API for all file I/O across the fleet; swap backends via config, not code. Salesforce reuses Poseidon's Connected App — the shape every other god can copy for home-node talk-back. |
| **Feedback inputs** | Steward paste 2026-09-30 (FT-001 draft, proteus-local); Hestia semantic-type binding gap (no code owner of type→storage today); TurtleShell "upload a photo" surfaces blocked on per-caller storage choice |
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

## §3 Non-functional requirements

- **Cycle latency budget** — p50 ≤ 400 ms, p95 ≤ 1500 ms for small (<256 KB) blob roundtrips through local, S3, and SF-ContentVersion adapters. Dropbox / Google / OneDrive bounded by their provider SLAs (budget deferred to §6 refinement).
- **Cost budget** — zero marginal $ per request beyond the provider's standard quota; S3 bucket + CloudFront distribution costs separately tracked.
- **Observability** — every file I/O carries `cycleId` + `adapterId` + `typeId` in both the HTTP envelope and the `LedgerEntry__c` row written at request close.
- **Compatibility** — `IProteusAdapter` (record contract) is NOT modified; the new `IProteusFileAdapter` sits alongside. Existing adapters + callers continue to work unchanged.
- **Privacy** — OAuth client secrets live in `.env` + SSM only; access + refresh tokens live on disk at `.agent/local/tokens/{namespace}/*.json` with 0600 mode, gitignored; neither is ever logged. SF TLS workaround for custom-domain leaf-only certs is scoped per-fetch with try/finally restoration (mirror of the public-API adapter pattern).
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

| Criterion | olympus-grid (SF) | Pantheon services | proteus-ui | TurtleShell surfaces | SDK / protocol |
|-----------|-------------------|-------------------|------------|----------------------|----------------|
| §2.1 | — | proteus-api `/auth` route tiles | AuthHub page | (indirect — surfaces will use providers once hubs are configured per-tenant) | OAuth harness contract |
| §2.2 | — | OAuth harness `/api/v1/oauth/*` + disk tokenStore | AuthHub + popup | — | OAuth provider registry |
| §2.3 | Reuses Poseidon Connected App; no new SF metadata required | proteus-api `/api/v1/salesforce/*` + shared `sfClient.ts` | Salesforce page | — | SF REST (sobjects/*) |
| §2.4–§2.5 | — | 6 file adapters + `FileRegistry` + `/api/v1/files/*` router | Upload + Gallery pages | — | `IProteusFileAdapter` |
| §2.6 | — | Adapter capability declaration surfaces at list endpoint | — | — | HTTP envelope `X-Cycle-ID` |
| §2.7 | `LedgerEntry__c.Cycle__c` FK; no schema delta | proteus-api + plutus write-through | — | — | — |
| §2.8 | — | `accessToken.ts` resolver + 401 retry wrapper | — | — | — |

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

## §9 Telemetry assertions (the close-out gate — needs sharpening by the proteus agent)

Candidate signatures that MUST appear in the next play cycle's session log once this cycle attests. These are seed statements; the proteus agent is responsible for making them precise + fire-able.

- `proteus.file.put.success` with props `{adapterId, typeId, size, checksum, ms}` fires exactly once per §2.4 upload.
- `oauth.connect.success` with prop `{provider}` fires exactly once per §2.2 successful OAuth round-trip.
- `oauth.token.refresh.success` with prop `{provider}` fires on §2.8 transparent-refresh path.
- `salesforce.smoke.account.pass` with prop `{accountId}` fires exactly once per §2.3 / §2.7 smoke run.
- Zero occurrences of `oauth.token.plaintext.leak` (an invariant guard — if we ever log a token in cleartext, this event fires and §9 fails).
- Every HTTP response from `/api/v1/files/*` carries `X-Cycle-ID` matching the trace.
- Plutus SOQL `SELECT * FROM LedgerEntry__c WHERE Cycle__c = :cycleId` returns one row per file put/get in the cycle.

## §10 Execution plan

> The prototype slice is **already landed in the proteus workspace** (contract split, 6 adapters, OAuth harness, UI pages per the source paste's §4.2 component list). This cycle's §10 is the walk from "prototype running on a laptop" to "attested in production against brain/2.7.x.x". The agent should fill this in once §5 approves scope and the proteus workspace commits are reconciled against the deployed cluster.

Rough ordering (to be hardened by the proteus agent):

1. Reconcile uncommitted proteus workspace → cycle branch; land as per-slice savethought commits.
2. Deploy proteus Docker image to the brain/2.7.x.x cluster via standard Pantheon pipeline.
3. SSM parameter setup for prod OAuth clients (Dropbox / Google / Microsoft) + reuse of Poseidon SF Connected App vars via Zeus cluster-stack injection.
4. End-to-end probe: curl `/api/v1/files/` + `/api/v1/oauth/providers` + `POST /api/v1/salesforce/smoke/account` against the deployed endpoint.
5. Fire §9 assertion grep against the next session log.
6. Move `04_in_development → 06_shipped` with §13 closeout evidence.

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
