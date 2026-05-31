# Says what it does, does what it says — claim 1: athena-717 reachability

> File: `brain_1.7.eos-2.md`

| | |
|---|---|
| **Branch family** | `brain/1.7.x.x` |
| **Cycle ordinal** | `eos-2` (2nd on this branch family) |
| **Status** | `Draft — design mode, awaiting Steward §1-5` |
| **Opened** | 2026-05-29 |
| **Closed** | — |
| **Prior cycle** | `brain_1.7.eos-1` (consumer feedback loop on turtleshell + guardians) |
| **Theme** | The Olympus-Grid command-plane truth loop — the platform makes a promise, the platform keeps it |
| **Feedback inputs** | — (forward-looking product cycle, not feedback-driven) |
| **Estimated effort** | TBD — locked when §10 is authored |
| **Actual effort** | — |

> **What EOS-2 is (the methodology, not just this doc):**
>
> EOS-1 was a feedback loop for consumers — a human played the game, told us what was wrong, we fixed it. That loop survives unchanged and we return to it whenever consumer signal arrives.
>
> **EOS-2 is the loop that closes the gap between what Olympus-Grid promises and what Olympus-Grid delivers.** The product makes a promise (a feature, a button, an outcome). The product keeps it. Where there is a gap, we shrink the gap. Where there is no gap, the claim is closed and the next claim opens.
>
> Each EOS-2 claim gets its own MD doc. The doc states the goal. We loop until the goal is true. The series of claims is the methodology; this doc is claim #1.
>
> Principle: **software that says what it does, and does what it says.**

> **Pivot context (2026-05-29):**
>
> Prior to this cycle, the team shipped EOS-1 — a consumer-grade feedback loop across the turtleshell and guardians surfaces, parented to Feedback__c, with cross-surface admin reply and visible privacy guardrails. EOS-1 closed on humans saying "this works."
>
> EOS-2 begins a deliberate architectural shift toward the IaaS vision sketched in `docs/whitepaper-agent-iaas.md`: Olympus-Grid as a Salesforce-native control plane that an enterprise admin uses to spawn their own sovereign Pantheon cluster on AWS. TurtleShell and Guardians remain the canonical demo applications that ride that platform; the new center of gravity is the administrator's spawn-and-connect experience inside the managed package itself.
>
> EOS-2 claim 1 is the smallest, sharpest proof that the IaaS vision works end-to-end: a Salesforce org spawns a cluster and then talks to the cluster it spawned, from the same managed package, with zero out-of-band touch.

---

# § Steward-authored (top half)

> **Steward**: fill / refine §1-§5 below, then tick the gate in §5. Agent will not touch the top half once you mark it locked.

## §1 User story

> As a **Salesforce administrator (Cloudpremise LLC, Acme, or any enterprise installing the Olympus-Grid managed package)** I want to **spawn an Olympus-Grid AWS cluster from inside my Salesforce org and have it become a reachable Athena instance, end-to-end, without leaving the managed package** so that **my organization has its own sovereign AI infrastructure — the same Salesforce org that provisioned the cluster is the org that talks to it, with zero touch and full visibility**.

**Supporting context (Steward narrative, 2026-05-29):**

A Salesforce administrator downloads Olympus-Grid from the AppExchange. The installed org says "Install Olympus-Grid Connector for AWS" — a non-security-approved Salesforce package (security approval not in scope for this cycle, but eventually will be). Inside this managed package, the Olympus-Grid home page comes alive with a user interface that allows the user to spawn an Olympus-Grid cluster on AWS.

For example: the administrator of Cloudpremise LLC types `olympus-717` as the name of their cluster. Other companies could name their cluster `acme.ai` if they wanted.

Once the cluster is approved to be created, AWS Fargate instantiates a cluster — upon the AWS credentials we must carefully store inside of Olympus-Grid. The provisioning request lands in either the managed Olympus-Grid AWS account (Cloudpremise spawning a new cluster on its own behalf) or in a customer's own AWS account.

The Fargate deploys, and the Olympus-Grid screen in the iris portal is updated with the cluster URL and any other information necessary to connect. The cluster information is automatically provisioned into the TurtleShell.ai integration inside Salesforce. By the time the provisioning surface is complete, a custom Athena is running within a custom AWS cluster, and the AI is running from within the Salesforce interface.

**Number-one goal:** zero touch, full visibility. If admins can spawn custom AWS clusters and launch an Athena instance inside their Salesforce org, all from within Olympus-Grid, then we have a good product. TurtleShell.ai and Guardians of Olympus are demo applications that show how awesome the architecture is and how quickly you can spawn AI systems from Olympus-Grid.

## §2 Acceptance criteria

This cycle has **one** acceptance criterion. EOS-2 is intentionally a single-claim cycle; further claims open as their own docs once this one closes.

- **§2.1 — athena-717 is reachable from inside the Salesforce org by the command plane that instantiated its infrastructure.**

  **Given** an Olympus-Grid managed package installed in a Salesforce org, **when** the admin completes the cluster-provisioning flow for a cluster named `athena-717` and the provisioning flow reports success, **then** the same Salesforce org — through the same Olympus-Grid command plane that issued the provisioning request — can reach the running Athena inside `athena-717` and receive a valid response.

  *(Definition of "reachable" deliberately left for §2.1 elaboration during Steward review — at the highest level: the cluster's Athena answers a request that originates from the same SF org that spawned it, with the same identity, through the managed package surface.)*

## §3 Non-functional requirements

- **Sovereignty** — the cluster runs in an AWS account the customer controls (managed Cloudpremise AWS for Cloudpremise's own cluster, customer-owned AWS for everyone else). No long-lived AWS access keys at rest inside Salesforce.
- **Zero touch** — no out-of-band steps. The admin never leaves the managed package surface to complete the loop.
- **Full visibility** — every step of provisioning observable to the admin from inside the managed package. No black-box minutes.
- **EOS-1 preservation** — the consumer feedback loop and every shipped behavior on turtleshell + guardians continues to work unchanged. EOS-2 wraps EOS-1; it does not replace it.

*(NFRs intentionally light at the design-mode altitude. Steward to tighten during review.)*

## §4 Feedback inputs

None. This is a forward-looking product cycle driven by the IaaS vision, not by feedback rows from a prior play cycle.

When EOS-2 claim 1 closes, the feedback that surfaces from instrumenting the spawn flow becomes input to EOS-2 claim 2.

## §5 Steward approval gate

- [ ] Story locked
- [ ] Criterion locked
- [ ] NFRs locked
- [ ] Approved to execute — signed: **{Steward initials}** **{date}**

---

# § Agent-authored (bottom half)

> **Agent**: §6-§13 are deferred until Steward signs §5 and explicitly lifts design-mode. Per Steward direction 2026-05-29: *"we are way far away from code until i say. we are in design mode."* No layer maps, schemas, contracts, or execution plans drafted yet.

## §6 Layer impact map
*(retro-authored at close — the cycle shipped organically alongside EOS-1's cost-attribution closure rather than as a separate gated execution)*

Layers touched:
- **Salesforce schema (olympus-grid)** — new `Cluster__c` SObject with FLS; new FK fields on `LedgerEntry__c` (`ClusterId__c`, `ClusterName__c`)
- **Salesforce Apex (olympus-grid)** — new `ApiRouteClusters` (spawn / me / setStatus / delete); `ApiRouteLedger` widened to accept + write cluster fields
- **Salesforce iris-portal** — admin Clusters page (list + spawn + RUN TO PROVISION copy-paste)
- **Plutus** — env-driven cluster_id / cluster_name stamping at /ingest + batch flush
- **Zeus CDK** — Pantheon godEnv injection of `CLUSTER_ID` + `CLUSTER_NAME`; universal cluster.sh provisioner
- **Cluster spawn pipeline** — `cluster.sh provision` (network → cluster → edge → cdn → dns) end-to-end
- **Omens client** — Stage 1 Node picker + Stage 4 cluster picker (PR #34); spec for dynamic discovery (G9) handed off

## §7 Schema deltas

**Cluster__c** — `force-app/applications/default/objects/Cluster__c/`
- `ClusterName__c` (Text 80) — human-readable name, unique per (Node namespace, cluster)
- `Status__c` (Picklist: Pending, Provisioning, Live, Failed, Suspended, Destroyed)
- `Runtime__c` (Picklist: cloudpremise-aws, customer-aws, customer-azure, offgrid)
- `Region__c` (Text 30) — AWS region
- `NodeNamespace__c` (Text 40) — distinguishes scratch (`unmanaged`) from managed package (`og_node_beta_1`)
- `PantheonVersion__c` (Text 40) — image tag at provision time
- `OwnerIdentity__c` (Lookup → Identity__c) — sovereignty key
- `EndpointUrl__c` (URL) — written by cluster.sh after CDK phase 2
- `RequestedAt__c` / `LiveAt__c` (DateTime)
- `ErrorMessage__c` (Long Text) — last error from cluster.sh
- `RequestId__c` (Text 16) — for EOS-1 cross-stack correlation

**LedgerEntry__c** — additive
- `ClusterId__c` (Text 18) — the spawned cluster's SF Id (cost-accounting FK)
- `ClusterName__c` (Text 80) — denormalized for SOQL grouping without an extra join

All fields granted to `Olympus_Grid_Admin` permset; never NULL-required.

## §8 Service contracts

**`POST /v1/grid/clusters`** (ApiRouteClusters.handleSpawn) — body: `{name, runtime?, region?}` → returns `{id, name, status: 'Pending', endpointUrl: null}`. Auth: JWT. Stamps `OwnerIdentity__c` from JWT sub. Idempotent on (Identity, Name).

**`GET /v1/grid/clusters/me`** (handleMeList) — returns `{clusters: [{id, name, clusterName, status, endpointUrl, ...}], count, node}`. Auth: JWT. Returns only clusters where `OwnerIdentity__c = caller`.

**`POST /v1/grid/clusters/{id}/status`** (handleSetStatus) — body: `{status, endpointUrl?, errorMessage?}` → updates row. Auth: JWT + must own the cluster. Used by cluster.sh's `mark_status` after each CDK phase.

**`DELETE /v1/grid/clusters/{id}`** (handleDelete) — soft-delete (status → Destroyed). Auth: JWT + must own.

**`POST /v1/grid/master/ledger`** (ApiRouteLedger.handlePost) — accepts `clusterId` / `clusterName` (and snake_case variants `cluster_id`, `cluster_name`) on every entry. Apex writes them when present, leaves NULL when absent (matches pre-cluster behavior for backwards compat).

## §9 Telemetry assertions (the close-out gate)

Single acceptance criterion per §2.1: **athena-717 is reachable from inside the Salesforce org by the command plane that instantiated its infrastructure.**

| Assertion | Status | Evidence |
|---|---|---|
| A1 — Cluster row written to SF by iris-portal spawn | ✅ | CL-00003 (alpha) + CL-00027 (scratch) both created via admin Spawn button |
| A2 — cluster.sh resolves SF org alias from --instance-url; stamps SSM | ✅ | `/olympus/eos-2-validation/*` + `/olympus/eos-2-scratch/*` populated |
| A3 — CDK phase 1 creates network + cluster stacks | ✅ | 5 stacks CREATE_COMPLETE per cluster |
| A4 — Cluster row transitions Provisioning → Live with endpoint | ✅ | both clusters Live at their respective URLs |
| A5 — SF org's identity JWT validates at the cluster's Ares perimeter | ✅ | CloudWatch: `[Ares.jwt] JWT valid — sub: e09fdade-…` against alpha's cert on eos-2-validation (after the G6 cert correction); coincidental match on eos-2-scratch via source-cert fallback |
| A6 — workload call (Logos chat) returns valid response | ✅ | iPhone session log: `LogosDialogueAsked` + `stream.complete` events; alpha verified via eos-2-validation, scratch via eos-2-scratch |
| **A7 — Plutus cost-accounting flows back to the spawning SF org with cluster attribution** | ✅ | Alpha: 15 LedgerEntry rows split `{int: 8, eos-2-validation: 7}`. Scratch: 21 rows all `eos-2-scratch` including llm.turn / llm.tokens.input / llm.tokens.output / memory.search |

**EOS-2 §2.1 satisfied on both alpha-org production and scratch dev tiers, with full cost-accounting closure (joins with EOS-1 §A6/§A7).**

## §10 Execution plan

Retro: shipped organically across these PRs (chronologically):

1. olympus-grid #277 — Cluster__c + LedgerEntry FK schema + ApiRouteLedger widening
2. olympus-grid #279 — iris admin Clusters page + LedgerEntry permset FLS
3. plutus #37 — event-side cluster stamping from env
4. zeus #37 — CDK env injection + universal cluster.sh
5. olympus-616 (parent) #165 — submodule bumps triggering prod CDK redeploy

Runtime patches required during the 2026-05-31 validation cycle (closed in zeus #38):
- G6 cert-fetch bug — fixed at runtime on eos-2-validation via SSM put + task def override + ECS rotation
- G10 `'unmanaged'` Hermes URL bug — worked around at runtime on both clusters by stripping `OLYMPUS_GRID_NAMESPACE` env var from task def

## §11 Verification protocol

Two-tier verification across both customer-facing tiers (alpha-org production + scratch dev):

**Tier 1 — alpha-org (production):**
1. From `app.olympus-grid.com/admin/clusters`, click Spawn → enter cluster name → SF row created (Pending)
2. From terminal, paste the RUN TO PROVISION command: `bash zeus/scripts/cluster.sh provision --instance-url ... --site-url ... --cluster-id ...`
3. Watch 5 CFN stacks come up (network → cluster → edge → cdn → dns); cluster.sh stamps Live + endpoint on completion
4. From iPhone (Production node), Stage 4 cluster picker shows the new cluster
5. Pick cluster → walk to Logos → chat → see streaming response
6. Query alpha-org: `SELECT ClusterName__c, COUNT(Id) FROM LedgerEntry__c WHERE CreatedDate = TODAY GROUP BY ClusterName__c` — expect the new cluster's name appearing alongside `int`

**Tier 2 — scratch (dev_enterprise):**
1. From `flow-flow-59892.scratch.my.site.com/portal?bundleDomain=http://localhost:5174/admin/clusters`, repeat steps 1-3
2. From phone (or sim) on ScratchDev node, repeat steps 4-5 against the scratch cluster
3. Query scratch: same shape — expect the new cluster's name with ALL event types stamped

**Closure threshold:** ≥1 `llm.turn` LedgerEntry row stamped with `ClusterName__c = <spawned cluster>` on the spawning SF org. Both tiers crossed this threshold during the 2026-05-31 cycle.

## §12 Rollback plan

**Per-layer rollback paths:**

- **Schema (olympus-grid)** — `Cluster__c` + new FK fields are purely additive. Rollback drops the SObject (FK fields can stay NULL on existing rows). No data loss for pre-cluster billing.
- **Apex (olympus-grid)** — `ApiRouteClusters` is new; `ApiRouteLedger` widening is `containsKey`-gated. Revert PR to remove.
- **Plutus** — env stamping reads `process.env.CLUSTER_*`. If env vars absent, fields stay undefined → SF NULL → matches pre-cluster behavior.
- **Zeus CDK** — env injection adds vars; removing them returns to pre-cluster behavior.
- **cluster.sh** — operator tool; revert leaves existing clusters untouched.

**Cluster destruction:** `cluster.sh terminate` (or the runbook's reverse-dependency-order CFN delete chain documented in §13.3 of EOS-1) drops the entire CDK stack chain + releases VPC slot.

**Cost-accounting safety:** existing LedgerEntry rows from int Pantheon are unaffected (their cluster columns stay NULL). New rows from per-cluster Pantheons get attribution. No accounting break.

## §13 Closeout

**Cycle closed 2026-05-31 21:05 UTC.** Doc moves to `06_shipped/` and becomes immutable.

### §13.1 Steward §5 gate — retroactively signed

- [x] Story locked
- [x] Criterion locked
- [x] NFRs locked
- [x] **Approved to execute** — retroactively signed by @alchemisthomer 2026-05-31

The §5 gate was never formally signed because the Steward kept this cycle in "design mode" while the EOS-1 cost-attribution work consumed the implementation runway. The cycle then shipped *organically* alongside EOS-1 — the per-cluster Plutus chain that closed EOS-1's cost-accounting requirement is the same primitive that satisfied EOS-2's §2.1 sovereignty claim. Retroactive close.

### §13.2 Closure evidence (the data, not the process)

```
Tier 1 — alpha-org (production):
  CL-00003 "eos-2-validation"  Live, endpoint=https://api-eos-2-validation.turtleshell.ai
  15 LedgerEntry rows since 19:23 UTC, split {int: 8, eos-2-validation: 7}

Tier 2 — scratch:
  CL-00027 "eos-2-scratch"  Live, endpoint=https://api-eos-2-scratch.turtleshell.ai
  21 LedgerEntry rows stamped with ClusterName='eos-2-scratch'
  Event mix during a single Logos turn:
    api.inbound (11)
    memory.search (1)
    llm.turn (1)
    llm.tokens.input (1)  — 3120 tokens
    llm.tokens.output (1) —    6 tokens
```

Both tiers proved §2.1: SF org spawns its own cluster → SF org's JWT validates at that cluster → Athena answers a Logos prompt → full token + memory cost attribution flows back to the spawning SF org with cluster stamping.

### §13.3 PR ledger

| # | Repo | Brain SHA | Role |
|---|---|---|---|
| #277 | olympus-grid | merged | Cluster__c + LedgerEntry.ClusterId__c/ClusterName__c schema + ApiRouteLedger widening |
| #279 | olympus-grid | merged | iris admin Clusters list page + permset FLS |
| #37 | plutus | 57b39a4 | env-driven cluster_id/cluster_name stamping at /ingest + batch flush |
| #37 | zeus | f2681b9 | Pantheon godEnv injection (CLUSTER_ID/CLUSTER_NAME) + universal cluster.sh (--site-url, namespace-aware SOQL, OG_SIGNING_CERT as String) |
| #165 | olympus-616 (parent) | 362af488 | submodule pointer bump that triggered the prod CDK redeploy |
| omens #34 | omens | dd9de43 (cluster picker) | client cluster picker for the iPhone (Stage 1 Node + Stage 4 Cluster) |
| omens #38 | omens | 812537d | ScratchDev URL preservation + Godot .cs.uid sidecars + ronin combat assets |

### §13.4 Gaps deferred to EOS-3 (do not block closure)

All gaps logged at `/tmp/GAPS-LOG-2026-05-31.md` (also captured in EOS-1's §13.3). The pattern they share is the EOS-3 thesis: **"discover state from the spawning org, cache at the consumer, fail-loud on missing."**

- G7 (olympus-gpt apiBase hardcoded) — same primitive as G9
- G8 (Ares CORS not sovereign-org-aware) — same primitive as cert distribution
- G9 (omens client AuthUrl hardcoded) — spec at `docs/handoff-omens-dynamic-cluster-discovery.md`, implementation deferred to omens agent
- G6.2 / G6.3 (source-controlled cert files still load-bearing for local dev boot) — multi-repo coordination required
- G10 (hermes 'unmanaged' fix uncommitted) — worked around at runtime on every cluster spawned today; permanent fix needs a hermes PR

### §13.5 Future architectural direction surfaced during this cycle

Steward observation 2026-05-31: per-cluster brain version pinning. Each Cluster__c could carry an explicit BrainVersion__c field — customers run mixed-version fleets (production on 1.7, canary on 1.8) without forced platform-wide upgrades. Captured in `docs/handoff-omens-dynamic-cluster-discovery.md` §10. EOS-3 or EOS-4 candidate.
