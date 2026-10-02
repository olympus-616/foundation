---
pitch: "Per-cluster LLM keys — no shared tenancy"
---

# Templeathena / Logos — dead OpenAI key routing gap; per-cluster keys not yet built

> File: `brain_2.7.eos-5.4.md` — fourth sub-attestation of `brain_2.7.eos-5` (brain-genesis). Scope: agentId `logos` / `athena` / `cosmos` all map to openai provider with stale SSM key. Templeathena chamber currently must use `agentId:'thoth'` (anthropic/Claude) as workaround.
>
> Source: Steward agent-entry-point survey 2026-09-25 (ITEM 4).

| | |
|---|---|
| **Branch family** | `brain/2.7.x.x` |
| **Cycle ordinal** | `eos-5.4` — fourth sub of brain-genesis. |
| **Status** | `In Development` — **SURFACE-LEVEL ROUTING LANDED** (additive to §2.A/§2.B — neither path *closed* by this work). Path B (per-cluster key routing) still queued. Tonight's surface work: cosmos-logos schema gained `llm`/`tts`/`mcp` capability blocks; Athena/Apollo/Poseidon manifests declare their preferred engines; Athena `handleChat` reads her own `llm.preferred_engine` from disk per-request as the default; iris `LoadedManifest` parses the new blocks; iris `Mouth.tsx` custom-chamber branch reads the chamber's `llm.preferred_engine` and sends it as `body.agentId` on the chat POST. **Validated end-to-end 2026-10-02** from scratch (`business-innovation-652`) + alpha (`athena-303` local): `openai gpt-4o` returns live responses; `anthropic` (thoth) works; `google` (gemini) fails under provider-side load. Backend per-cluster key routing (§2.B) + `TEMPLEATHENA_KEY_MANAGEMENT.md` port (sibling 5.3) remain prerequisites for cluster-owned keys. |
| **Opened** | 2026-09-25 |
| **Prior cycle** | `brain_2.7.eos-5` (brain-genesis primary) |
| **Theme** | Rotate stale SSM key OR implement per-cluster key routing per the spec at `docs/TEMPLEATHENA_KEY_MANAGEMENT.md`. Unblock the Templeathena chamber's `agentId:'logos'/'athena'/'cosmos'` paths so `thoth` isn't the only working option. |
| **Feedback inputs** | Steward survey 2026-09-25 (ITEM 4); prior context on stale SSM key; templeathena live at `templeathena.md` in memory `project_templeathena_iris_portal_app_live.md` |
| **Owner** | UNASSIGNED — backend athena change is `--olympus-616` agent scope; iris-agent flags but does not own |
| **Cross-repo** | athena (backend/api) + iris (surface) + olympus-616 parent (deploy chain) |
| **Estimated effort** | M/L depending on path chosen — key rotation is fast; per-cluster routing is the real design target |
| **Actual effort** | **2026-10-02** — surface-level manifest-driven routing shipped: schema (cosmos-logos) + Athena/Apollo/Poseidon manifest declarations + Athena `handleChat` default-via-manifest + iris `LoadedManifest.llm` parse + iris `Mouth.tsx` custom-chamber `body.agentId` wiring + fleetFetch `x-user-identity` on cross-origin chat POSTs. iris PR on existing agent branch (commit `d7bb245`) + olympus-grid PR [#356](https://github.com/olympus-616/olympus-grid/pull/356). openai + anthropic verified; gemini fails under load. **PR #356 merged 2026-10-02T21:34:13Z as commit `6954f075`;** surface routing lands on cp-biz when deploy-push-cp-biz (run [37067617179](https://github.com/olympus-616/olympus-grid/actions/runs/37067617179)) completes green — §9.CP-* verification pending. |

---

## §1 User story

- **§1.1** As **any user in the Templeathena chamber** I want **`agentId:'logos'` / `'athena'` / `'cosmos'` to route to a live provider** so that **the temple has more than one working god — currently only `thoth` (Anthropic/Claude) works**.
- **§1.2** As **the Steward** I want **the per-cluster key routing spec at `docs/TEMPLEATHENA_KEY_MANAGEMENT.md` implemented** so that **cluster owners can bring their own provider keys per cluster, not share a fleet-wide SSM key**. This is the long-term design target; the SSM key rotation is the short-term unblock.

## §2 Acceptance criteria

Two paths (Steward picks):

### §2.A — Path A: SSM key rotation (fast unblock)

- **§2.1 (Rotate SSM key)** — `/olympus/{int,prod}/keys/OPENAI` rotated to a live key; athena picks up on next deploy or SSM refresh.
- **§2.2 (Logos/Athena/Cosmos work again)** — Templeathena chamber `agentId:'logos'` returns a chat response, not an error. Verified by live smoke.

### §2.B — Path B: Per-cluster key routing (design target)

- **§2.3 (Spec ported)** — `docs/TEMPLEATHENA_KEY_MANAGEMENT.md` present on working branch (per sibling `brain_2.7.eos-5.3`).
- **§2.4 (Per-cluster key resolver in athena)** — athena resolves keys per `Cluster__c.<KeyField>__c` or equivalent lookup, not from a fleet-wide SSM only.
- **§2.5 (Cluster owner UI or API)** — cluster owners can set their own provider keys via iris or an admin API surface.
- **§2.6 (Templeathena chamber uses per-cluster key)** — Templeathena chamber's `agentId:'logos'` path routes via cluster-owner's key, not fleet-wide.

## §5 Steward approval gate

- [ ] Path chosen — A (SSM rotation) / B (per-cluster routing) / A-then-B (rotate now, build later)
- [ ] Cross-repo assignment — which agent owns the athena backend change?
- [ ] Escalation to `--olympus-616` agent for athena/api changes acknowledged
- [ ] Sibling `brain_2.7.eos-5.3` doc port scheduled (required for Path B)
- [ ] Approved to execute — signed: **__________** **__________**

## §6 Layer impact

| Repo | Change |
|---|---|
| athena (backend) | SSM key rotation (Path A) OR per-cluster key resolver (Path B) |
| iris (surface) | Per Path B — cluster-owner key-management UI |
| olympus-grid | Per Path B — Cluster__c field for per-cluster key reference (not raw key — sealed envelope pattern per `brain_1.7.eos-5.5`) |
| SSM | Path A — key rotation |

## §9 Telemetry assertions

- **§9.LOGOS-1 (Path A)** — Templeathena `agentId:'logos'` returns 200 chat response post-rotation.
- **§9.LOGOS-2 (Path B)** — Cluster-owner-set key travels through athena resolver correctly; Plutus row shows the correct `key_source`.

## §10 Execution plan

### Path A (fast)
1. **§5 Path A approval.**
2. **Escalate to `--olympus-616` agent** for SSM key rotation.
3. **Verify Templeathena chamber** post-rotation.
4. **§13 closeout.**

### Path B (design)
1. **§5 Path B approval** + spec-port dependency scheduled.
2. **Wait on `brain_2.7.eos-5.3`** (doc port).
3. **Design per-cluster key resolver** — cross-repo (athena + iris + olympus-grid).
4. **Ship** — cross-repo PR set.
5. **§13 closeout.**

## §12 Rollback

Path A revert = re-rotate to old key (only works if not expired). Path B revert = disable per-cluster resolver, fall back to fleet-wide SSM.

## §13 Closeout

*Filled at end of cycle.*

---

## References

- **Primary umbrella:** [`brain_2.7.eos-5.md`](brain_2.7.eos-5.md) — Brain-Genesis
- **Spec target:** `iris/docs/TEMPLEATHENA_KEY_MANAGEMENT.md` (ported per sibling `brain_2.7.eos-5.3`)
- **Templeathena live memory:** `project_templeathena_iris_portal_app_live.md`
- **BYOK envelope pattern reference:** [`brain_1.7.eos-5.5.md`](brain_1.7.eos-5.5.md) — the sealed-at-capture pattern per-cluster keys would follow
- **Sibling docs port:** [`brain_2.7.eos-5.3.md`](brain_2.7.eos-5.3.md)
- **Source:** Steward agent-entry-point survey 2026-09-25 (ITEM 4)
