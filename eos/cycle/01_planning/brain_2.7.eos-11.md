---
pitch: "One .env, read deterministically by every god"
---

# Fleet-wide env-loader standardization — every god reads the parent-root `.env` deterministically, CWD-independent, with ARES_URL/ARES_API rename-compat

> File: `brain_2.7.eos-11.md` — **eleventh primary EOS cycle on the `brain/2.7.x.x` family** (peer of HUD `eos-1`, aeon `eos-2`, argos `eos-3`, primaries `eos-4..9`, proteus `eos-10`). **Planning stage — Pre-§5.** This cycle captures a sweep the agents authored across ~20 gods on 2026-10-02 and then dropped (left uncommitted on `brain/2.7.x.x` directly, no cycle branch). The sweep was reverted the same day to clear the parent-repo commit path; this doc preserves the archaeology and governs the re-execution under proper cycle discipline when the Steward unfreezes it.

| | |
|---|---|
| **Branch family** | `brain/2.7.x.x` |
| **Cycle ordinal** | `eos-11` (eleventh primary on 2.7 family) |
| **Status** | `Planning — Pre-§5. Sweep implementation dropped by agents 2026-10-02; reverted the same day. §1–§5 drafted below; agent decomposition deferred until Steward unfreezes.` |
| **Opened** | 2026-10-02 |
| **Closed** | — |
| **Prior cycle** | `brain_2.7.eos-10` (proteus universal file adapters — adjacent dev-ergonomics theme) |
| **Theme** | Fleet-wide env-loader standardization: every god reads a single parent-root `.env`, CWD-independent, with ARES_URL/ARES_API rename-compat shim |
| **Feedback inputs** | 2026-10-02 EOS session discovery of uncommitted sweep across ~20 gods on `brain/2.7.x.x`; implied prior rename `ARES_API` → `ARES_URL` of unknown provenance |
| **Estimated effort** | ~2h (sweep is mechanical; the governance is the real work) |
| **Actual effort** | — |

---

## Context — the dropped sweep of 2026-10-02

On 2026-10-02 an EOS inventory of the fleet surfaced an uncommitted uniform diff across ~20 gods, all sitting on `brain/2.7.x.x` directly (no cycle branch, no planning doc). The Steward directed: *"draft the eos-N planning stub — document the change that was made for this and which repos were affected, and then revert the changes from each sub module so we have a document pointing to fix it and why, but i don't want to deal with this right now the point is to get everything committed into brain/2.7.x.x as soon as safely can be done."* This cycle doc is that governance artifact; the working-tree revert happens alongside the doc's creation.

### What the sweep changed

Each affected god received a two-file diff of identical shape:

**`api/package.json` — `dev` script**
```diff
-    "dev": "tsx watch src/index.ts",
+    "dev": "tsx watch --env-file=../../.env src/index.ts",
```
Tells `tsx` in dev mode to load env vars from the olympus-616 parent root (two levels up) instead of the god's own CWD.

**`api/src/index.ts` (or `api/src/server.ts` for gods using that naming) — runtime loader**
```diff
-import 'dotenv/config';
+import { config as __loadEnv } from "dotenv";
+import { resolve as __resolveEnv } from "path";
+__loadEnv({ path: __resolveEnv(__dirname, "..", "..", "..", ".env"), override: true });
+process.env.ARES_URL ??= process.env.ARES_API;
```

Four effects, together:
1. Replace side-effect `import 'dotenv/config'` with explicit `__loadEnv({path, override})`.
2. Anchor the path to `<god>/api/src/../../../.env` → resolves to `olympus-616/.env` regardless of CWD. Fixes a class of silent-startup bugs where launcher-spawned or Docker-launched gods found no `.env` and booted with missing env.
3. `override: true` — parent `.env` wins over anything already in `process.env`. Reverses dotenv's default. In dev this means the committed `.env` beats stale shell globals. In prod/ECS there's no `.env` at that path so `dotenv.config` silently no-ops and ECS SSM-injected env survives untouched (prod-safe by construction).
4. `process.env.ARES_URL ??= process.env.ARES_API` — rename-compat shim for an earlier `ARES_API` → `ARES_URL` rename of unknown provenance. Nullish-coalesce preserves pre-existing `ARES_URL` and backfills from `ARES_API` only when `ARES_URL` is unset.

### Which gods were affected (pure Cluster A — env-loader diff only)

20 gods, all on `brain/2.7.x.x` directly, uniform diff shape:

| God | Diff shape |
|---|---|
| aeon | `api/package.json` + `api/src/index.ts` |
| alpha | `api/package.json` + `api/src/server.ts` |
| aphrodite | `api/package.json` + `api/src/index.ts` + `package-lock.json` |
| argos | `.gitignore` + `api/package.json` + `api/src/index.ts` + `package-lock.json` |
| artemis | `api/package.json` + `api/src/index.ts` |
| chronos | `api/package.json` + `api/src/server.ts` |
| delphi | `api/package.json` + `api/src/index.ts` |
| demeter | `api/package.json` + `api/src/server.ts` |
| dionysus | `api/package.json` + `api/src/index.ts` |
| eos | `api/package.json` + `api/src/index.ts` |
| hades | `api/package.json` + `api/src/index.ts` |
| hecate | `api/package.json` + `api/src/index.ts` |
| hephaestus | `api/package.json` + `api/src/server.ts` |
| hera | `api/package.json` + `api/src/index.ts` |
| hestia | `api/package.json` + `api/src/index.ts` + `package-lock.json` |
| mnemosyne | `api/package.json` + `api/src/index.ts` |
| odyssey-press | `api/package.json` + `api/src/server.ts` |
| omega | `api/package.json` + `api/src/server.ts` |
| oracle | `api/package.json` + `api/src/index.ts` + `package-lock.json` |
| orion | `api/package.json` + `api/src/server.ts` |

### Gods explicitly deferred (dropped sweep + additional owner-agent dirt — out of this cycle's scope)

- **apollo, poseidon** — dirty on `cosmos-logos.json` manifest, no env-loader diff. Belongs to a cosmos-logos re-pin, not this sweep.
- **athena** — mixed: `api/keys/athena.pub` + `api/public/.well-known/cosmos-logos.json` + `api/src/server.ts`. The server.ts change may be env-loader-shaped but the keys + manifest churn means athena needs its own agent's attention.
- **ares** — only `api/src/forward.ts`, not env-loader. Belongs to the ares perimeter cycle (likely HUD).
- **prometheus** — massive refactor in flight (new providers codex/grok/ollama, session-manager, terminal UI). Prometheus agent owns.
- **proteus** — universal file adapters mid-build; belongs to `brain_2.7.eos-10` (design stage).
- **iris, omens, olympus-grid, foundation** — already on named cycle/thought branches; owner-agents handle in their own sessions.

### Why reverted (not committed) 2026-10-02

Three reasons:
1. **No governance.** The sweep was authored across ~20 gods on `brain/2.7.x.x` directly, with no planning doc, no §5 approval, no §9 telemetry assertions. Shipping it as-is would violate the single-cycle mutex and leave an unattested cross-cutting change in the fleet's recent history.
2. **Blocking the clean path.** The parent-repo had unrelated commits waiting (foundation patent update + launcher UI + build.sh + schema). Leaving ~20 gods dirty was blocking atomic parent-repo work.
3. **Reversibility is cheap.** The git reflog on each god preserves the exact diff; re-executing it under this cycle's §5-approved authority is ~15min of mechanical rework. No knowledge is lost — this doc + the reflog is the full specification.

---

# § Steward-authored (top half)

## §1 User story

> As the **fleet operator**, I want every god to read env config from the parent-root `.env` deterministically regardless of launch path, so that **one edit propagates to all gods and dev-startup bugs from CWD mismatch are eliminated by construction**.

> As the **Pantheon operator in prod**, I want the dev-ergonomics loader to be a **no-op in Docker/ECS**, so that ECS SSM-injected env vars continue to be the authoritative prod source without regression.

## §2 Acceptance criteria

- §2.1 **Given** `olympus-616/.env` contains `ARES_URL=https://athena-616.ngrok.io`, **when** a god is launched via `./olympus.sh` from the parent root OR via `cd <god> && npm run dev`, **then** the god's `process.env.ARES_URL` resolves to the parent value AND the session log carries `env.loaded path=<absolute path> source=parent-root`.
- §2.2 **Given** a Pantheon Docker image deployed via Zeus CDK, **when** the container boots, **then** `dotenv.config` silently no-ops (parent `.env` not present at WORKDIR) AND ECS task-def-injected env vars (`COSMOS_LOGOS_PRIVATE_KEY`, etc.) survive untouched.
- §2.3 **Given** a god's shell environment has `ARES_API=https://old-url` set (legacy name), **when** that god boots, **then** `process.env.ARES_URL` is backfilled from `ARES_API` AND the session log carries `env.rename_compat applied=ARES_API→ARES_URL`.
- §2.4 **Given** the fleet-wide sweep is complete, **when** `./olympus.sh` boots the full Pantheon locally, **then** zero gods log `env.missing_variable` warnings across the boot sequence.

## §3 Non-functional requirements

- **Cost budget:** zero marginal cost (dev-ergonomics only).
- **Observability:** every god emits `env.loaded path=<...> keys=<count> source=<parent-root|cwd|docker-ecs>` on boot. Deterministic log signature for §2 verification.
- **Compatibility:** gods not in Cluster A (apollo, poseidon, athena, ares, prometheus, proteus, iris, omens, olympus-grid, foundation) MUST NOT be modified under this cycle. Their env-loading will be addressed under their respective owner-agent cycles.
- **Prod safety:** `dotenv.config` with an unresolvable path MUST silently no-op (verified in both dev and prod Docker). No `throw` on missing `.env`.
- **Reversibility:** per-god, per-file. Reverting a single god to CWD-based loader must be a 4-line revert.
- **Rename compat:** the `ARES_URL ??= ARES_API` shim stays until the fleet-wide `ARES_API` → `ARES_URL` rename is fully propagated across all env sources (dev `.env`, shell profiles, SSM parameters, CI secrets). Removal is a separate future cycle.

## §4 Feedback inputs

| Source | Signal |
|---|---|
| 2026-10-02 EOS inventory | Uncommitted sweep across ~20 gods on `brain/2.7.x.x` directly, no cycle branch |
| Steward direction 2026-10-02 verbatim | *"draft the eos-N planning stub — document the change that was made for this and which repos were affected, and then revert the changes from each sub module so we have a document pointing to fix it and why, but i don't want to deal with this right now the point is to get everything committed into brain/2.7.x.x as soon as safely can be done."* |
| Dropped-sweep diff (see Context above) | The implementation is specified in full — re-execution is mechanical |
| Open archaeology question | Provenance of the `ARES_API` → `ARES_URL` rename. Which cycle authored it? Which env sources still carry the old name? Must be resolved during §6–§10 decomposition. |

## §5 Steward approval gate

- [ ] Story locked
- [ ] Criteria locked
- [ ] NFRs locked
- [ ] Approved to execute — signed: **___** **___**

---

# § Agent-authored (bottom half) — DEFERRED

Per Steward direction 2026-10-02 (*"i don't want to deal with this right now"*), §6–§13 are intentionally stubbed. The implementation specification is captured in the Context section above; re-execution is mechanical when the Steward unfreezes this cycle.

## §6 Layer impact map

Deferred. Scope is the 20 gods listed in Context (Pantheon layer only). No Salesforce, no client-surface, no SDK impact.

## §7 Schema deltas

None. This cycle changes no SObjects, no Plugin__mdt, no server data models.

## §8 Service contracts

None. Env-loading is pre-request; no wire-shape changes.

## §9 Telemetry assertions (the close-out gate)

Deferred. Candidate assertions from §2 above:
- `env.loaded path=<parent-root>` fires on every god boot in dev.
- `env.rename_compat applied=ARES_API→ARES_URL` fires when and only when legacy name is present.
- Zero `env.missing_variable` warnings across `./olympus.sh` boot.
- In prod, `env.loaded source=docker-ecs` fires (dotenv silent no-op path).

## §10 Execution plan

Deferred. Re-execution shape when unfrozen:
1. Open a cycle branch `cycle/eos-2.7.11-env-loader` (or Steward-named equivalent) in each of the 20 gods.
2. Re-apply the diff per the Context specification. The git reflog on each god preserves the original authored diff.
3. Add the `env.loaded` + `env.rename_compat` log signatures per §9.
4. Boot the fleet via `./olympus.sh`, verify §2 criteria.
5. Open one PR per god targeting `brain/2.7.x.x`. Atomic coordinated squash-merge.
6. Parent-repo pointer bump in a single commit referencing this cycle.

## §11 Verification protocol

Deferred.

## §12 Rollback plan

Per-god, per-file. Each god's `api/package.json` and `api/src/index.ts` (or `server.ts`) revert cleanly to the pre-sweep shape. No schema, no data, no cross-service state.

## §13 Closeout

Deferred.
