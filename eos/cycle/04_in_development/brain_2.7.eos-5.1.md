---
pitch: "Ship the /agent surface to production"
---

# /agent surface production ship — blocked by local-sentinel bundleId

> File: `brain_2.7.eos-5.1.md` — first sub-attestation of `brain_2.7.eos-5` (brain-genesis / Olympus-Brain agent-app extension). Scope: production ship of the `/agent` route.
>
> Source: Steward agent-entry-point survey 2026-09-25 (ITEM 1).

| | |
|---|---|
| **Branch family** | `brain/2.7.x.x` |
| **Cycle ordinal** | `eos-5.1` — first sub of brain-genesis. |
| **Status** | `In Development` — **SURFACE LANDED ON cp-biz + alpha-org; prod hard-refresh is the only Steward step remaining.** Bundle `.dev.nsph` is a real production artifact (not a `.dev.priv45` sentinel). 5-way bundleId consistency verified: iris `build/index.html`, olympus-grid `staticresources/agent/index.html`, both `app.main.v1.js` loader `reactBundleId` refs, and `Plugin.iris_deployment_path_agent.bundleId` all agree on `.dev.nsph`. **olympus-grid PR #356 MERGED 2026-10-02T21:34:13Z as commit `6954f075`.** All four post-merge workflows GREEN: PR-time (Lint & Format SKIPPED, validate-pr-cp-biz, Scratch Org Build & Test) · Post-Merge Docker · deploy-push-cp-biz (run [37067617179](https://github.com/olympus-616/olympus-grid/actions/runs/37067617179) — Deploy ID `0AfPj000002HcSjKAK`, five-witness attestation per `brain_2.7.eos-9` §9.1) · Beta Package Build (run [37067617719](https://github.com/olympus-616/olympus-grid/actions/runs/37067617719) — managed v2.7.0.11 Subscriber `04tPj00000DP309IAD`, Release [`beta/2.7.0.11`](https://github.com/olympus-616/olympus-grid/releases/tag/beta/2.7.0.11), 207/207 tests, 98% org-wide coverage) → unlocked-nodes alpha-org deploy: `og_node_beta_1` v2.7.3.1 Subscriber `04tPj00000DPBtdIAH` ✅ + `og_node_beta_2` v2.7.3.1 Subscriber `04tPj00000DPFM9IAP` ✅. **Still pending (Steward step):** prod hard-refresh of `app.olympus-grid.com/agent` confirming the `/agent` route resolves against the new bundle (§2.3) + bundle-ceremony script verification (§2.2 / §9.AGT-1). |
| **Opened** | 2026-09-25 |
| **Prior cycle** | `brain_2.7.eos-5` (brain-genesis primary — agent-app extension) |
| **Theme** | Land a real (non-sentinel) `bundleId` for `/agent` so the surface resolves in production without the `?bundleDomain=` local override. |
| **Feedback inputs** | Steward survey 2026-09-25; iris/olympus-grid agent-bundle-deploy memory `project_agent_bundle_deploy.md`; bundle-ceremony discipline per olympus-grid CLAUDE.md |
| **Owner** | iris-agent (implementation); iris + olympus-grid PR pair authors |
| **Estimated effort** | S — `cd iris && npm run deployAlphaAgent` (build + publishAgent + `sf project deploy start` to alpha-org); then pin the resulting bundleId + 4-way consistency check + open iris PR + olympus-grid PR pair. |
| **Actual effort** | **2026-10-02** — `npm run publishAgent` produced bundle `.dev.nsph` (~4.52 MB zipped, ~250 KB under SF 5 MB limit); `Plugin.iris_deployment_path_agent.bundleId` pinned; 5-way consistency verified; iris commit `d7bb245` on existing agent branch + olympus-grid PR [#356](https://github.com/olympus-616/olympus-grid/pull/356) opened against `brain/2.7.x.x`. **PR #356 merged 2026-10-02T21:34:13Z as commit `6954f075`;** three PR-time checks green + Post-Merge Docker green; deploy-push-cp-biz landed on cp-biz 21:56Z (Deploy ID `0AfPj000002HcSjKAK`); Beta Package Build landed 22:13Z producing managed v2.7.0.11 (Subscriber `04tPj00000DP309IAD`); unlocked-nodes installed on alpha-org (`og_node_beta_1` + `og_node_beta_2` both v2.7.3.1). End-to-end wall-clock from merge → alpha-org landing: ~40 min. |

---

## §1 User story

- **§1.1** As **any user browsing to `app.olympus-grid.com/agent`** I want **the route to resolve in production without needing the `?bundleDomain=http://localhost:5176` local-dev override** so that **the agent surface is actually shippable, not just dev-loop-visible**.
- **§1.2** As **the Steward** I want **the sentinel `.dev.priv45` bundleId replaced with a shipped hash** so that **the 4-way bundleId ceremony reflects a real production artifact, not a local-dev sentinel that would 404 in prod**.

## §2 Acceptance criteria

- **§2.1 (Real bundleId pinned)** — `Plugin.iris_deployment_path_agent.md-meta.xml` `Configuration__c.bundleId` is a real 8-char hash (not `.dev.priv45`, not any `.dev.*` sentinel).
- **§2.2 (4-way consistency held)** — per bundle ceremony: iris build output `main.bundle.<id>.js`, olympus-grid static resource file, app.main.v1.js loader `reactBundleId`, and both Plugin__mdt XML records all reference the same real 8-char id. Verified via `olympus-grid/scripts/validate-iris-bundles.sh` — exit 0.
- **§2.3 (Route resolves without `?bundleDomain=`)** — hard-refresh `app.olympus-grid.com/agent` (no query params) in a real browser returns 200 + the agent app loads. Verified against alpha-org post-`deployAlphaAgent`.
- **§2.4 (iris + olympus-grid PR pair opened + merged)** — iris PR with the source `.tsx` + loader-script bundleId; olympus-grid PR with the `staticresources/agent/**` delta + both `Plugin.iris_deployment_path_agent.md-meta.xml` records pinned to the real id.

## §5 Steward approval gate

- [ ] Approved to ship — `cd iris && npm run deployAlphaAgent` authorized
- [ ] Bundle ceremony green pre-PR
- [ ] Iris PR + olympus-grid PR pair opened and reviewed
- [ ] Approved to merge — signed: **__________** **__________**

## §6 Layer impact map

| Repo | Change |
|---|---|
| iris | `reactforce/agent/` build → new bundleId in `public/assets/js/app.main.v1.js` |
| olympus-grid | `force-app/ui/portal/default/staticresources/agent/` bundle files + `Plugin.iris_deployment_path_agent.md-meta.xml` (bundleId pin) |

## §9 Telemetry assertions

- **§9.AGT-1** — `validate-iris-bundles.sh` exits 0 pre-merge.
- **§9.AGT-2** — Real bundleId is 8 hex chars per `randomId(8)`; grep for `.dev.` sentinel returns zero hits post-merge.
- **§9.AGT-3** — `curl -I https://app.olympus-grid.com/agent` (no query params) returns 200; served JS bundle filename matches the pinned bundleId.

## §10 Execution plan

1. **§5 approval** — Steward green-light to run `deployAlphaAgent`.
2. **`cd iris && npm run deployAlphaAgent`** — build + publishAgent + `sf project deploy start` to alpha-org.
3. **Capture new bundleId** from build output.
4. **Pin bundleId** in `olympus-grid/force-app/ui/portal/default/customMetadata/Plugin.iris_deployment_path_agent.md-meta.xml`.
5. **Run `validate-iris-bundles.sh`** — verify 4-way consistency.
6. **Open iris PR + olympus-grid PR pair** — matching bundleId across both.
7. **Hard-refresh `app.olympus-grid.com/agent`** post-merge — verify §2.3.
8. **§13 closeout.**

## §12 Rollback

Revert the bundleId pin in olympus-grid; static resource stays but Plugin__mdt points at prior bundle. Or revert both PRs together.

## §13 Closeout

*Filled at end of cycle.*

---

## References

- **Primary umbrella:** [`brain_2.7.eos-5.md`](brain_2.7.eos-5.md) — Brain-Genesis (agent-app extension)
- **Iris bundle ceremony:** `olympus-grid/scripts/validate-iris-bundles.sh` + olympus-grid CLAUDE.md § Iris Bundle Ceremony
- **Agent bundle deploy:** memory `project_agent_bundle_deploy.md`
- **Source:** Steward agent-entry-point survey 2026-09-25 (ITEM 1)
- **Sibling agent-scope subs:** [`brain_2.7.eos-5.2.md`](brain_2.7.eos-5.2.md) (iris PR #135) · [`brain_2.7.eos-5.3.md`](brain_2.7.eos-5.3.md) (design docs port) · [`brain_2.7.eos-5.4.md`](brain_2.7.eos-5.4.md) (templeathena keys) · [`brain_2.7.eos-5.5.md`](brain_2.7.eos-5.5.md) (branch convention)
