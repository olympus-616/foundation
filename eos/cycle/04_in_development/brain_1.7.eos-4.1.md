---
controls: [CC1.1, CC1.4, CC2.2, CC2.3, CC3.1, CC3.4, CC4.1, CC5.2, CC5.3, CC6.1, CC6.2, CC6.7, CC7.2, CC8.1]
attestation_status: in_development
prior_cycle: brain_1.7.eos-4.md
approvers: [G.W.H.]
---

# Recursive self-attestation — the EOS tool deployed by the EOS process attests the EOS process itself

> File: `brain_1.7.eos-4.1.md`
>
> ---
>
> **What this cycle is, in one breath:** the EOS-1-through-4 methodology — the cross-repo logical branch, the atomic-promotion pointer, the §9 telemetry assertions, the §5 governance gate, the single-open-cycle mutex, the karmic-accounting hookup — is operationalized into a public product (an iris-portal app at `app.olympus-grid.com/eos`) and that very product is then used to attest its own §13 closure. The first card the live app renders is this cycle's own doc.

| | |
|---|---|
| **Branch family** | `brain/1.7.x.x` |
| **Cycle ordinal** | `eos-4.1` — **sub-attestation of EOS-4** (new pattern: `eos-{N}.{M}` = sub-cycle that proves a property of cycle N using the artifact N delivered) |
| **Status** | `In Development` — direct-to-execution under single-Steward mode (single-Steward mutex relaxation continues per 2026-06-10 direction). Steward authored §1-§5 implicitly in the opening prompt 2026-06-11 23:?? UTC; EOS agent now decomposes §6-§13. |
| **Opened** | 2026-06-11 |
| **Closed** | — |
| **Prior cycle** | `brain_1.7.eos-4` (the merge IS the deploy cycle — shipped 2026-06-11) |
| **Theme** | "Operationalize the EOS methodology as a public product (Jira-on-GitHub-with-SOC-2-baked-in) and have that product attest its own delivery." |
| **Feedback inputs** | Steward verbatim 2026-06-11: *"i think we should operationalize what we did for eos 1-4. this is an incredible and patentable approach to managing agent development swarms. ... eos instantly becomes a new product. ... use case - user navigates to app.olympus-grid.com/eos which will launch the app as an iris portal app based upon our routing architecture. ... iterate with me... make it better... perfect my design. i believe mine has been spoken with logos."* |
| **Estimated effort** | Single overnight session (2026-06-11 → 2026-06-12 morning) for the v1; v1.1 (CLI integration + webhook activity stream) ships in EOS-4.2 |
| **Actual effort** | — |

> **Why this is a sub-attestation of EOS-4, not a fresh EOS-5:**
>
> EOS-4 proved *the merge IS the deploy* — `brain/1.7.x.x` HEAD is the production environment, by construction. EOS-4.1 takes that property and folds it back on itself: the act of merging this cycle's PRs across foundation + iris + olympus-grid not only deploys the EOS app, it deploys the artifact through which all future EOS cycles will be governed. The system delivered by EOS-4 is used to attest the system delivered by EOS-4.1. The recursion is the closure.
>
> The README's monotone-integer naming convention (`brain_{major.minor}.eos-{N}.md`) is widened by this cycle to admit a sub-attestation form: `brain_{major.minor}.eos-{N}.{M}.md`. The `.{M}` slot is reserved for cycles whose subject matter is a *recursive property* of cycle N — properties that can only be expressed by the artifact N delivered.

> **Republic-616 governance preservation:** today the §5 gate is held by the Steward alone, per the single-Steward-mode relaxation that has been in effect since 2026-06-10. When republic-616 ships (likely as Hera — sovereign of governance), §5 becomes a multi-party vote. This cycle's design preserves that path: the EOS app's "Steward" role chip becomes "Voter" with one vote per signer, and §5's checkboxes become multi-party tallies in the cycle doc's frontmatter. No code rewrite required at republic-616 lighting-up time — the role primitive is already abstract.

---

# § Steward-authored (top half)

## §1 User story

> **§1.1** As the **EOS agent (and any future eos-cli agent)** I want **the EOS methodology to be a live, browsable, editable artifact at a public URL** so that **the work I do moving cycles through the kanban, posting attestations, and writing §13 closures is visible to the AI that built it (the EOS-1 recursive loop, second-order form) AND visible to humans (the Steward today; republic-616 voters tomorrow; SOC-2 auditors when the time comes) without requiring any of them to clone the repo and run `ls foundation/eos/cycle/`.**

> **§1.2** As **the Steward (and any future signed-in human collaborator)** I want **to drag a cycle doc from one lane to another, edit a markdown card in the browser, add a §13 row, or create a new cycle from a template — all from inside the app, all via GitHub PRs that preserve full attribution and audit trail** so that **governance happens at the velocity of "click and type" instead of "git checkout and vim" and the security model is inherited from GitHub's existing permissions on the underlying repository.**

> **§1.3** As **a Cloudpremise LLC SOC-2 auditor (and any future regulator)** I want **a one-click view of every control family (CC1-CC9 + A/C/PI) showing which EOS cycles touched which controls, with each control linking back to the cycle doc's §13 closure as the evidence** so that **the audit narrative is generated automatically from the working artifact, not as a separate document maintained at audit time.**

> **§1.4** As **an anonymous pilgrim arriving at `app.olympus-grid.com/eos`** I want **to see the current state of the platform's continual-improvement loop without authentication** so that **the work being done is publicly visible (release-notes meets wiki meets kanban) and the platform's claim to being open is observably true.**

## §2 Acceptance criteria

- **§2.1 Public anonymous kanban render.** **Given** an unauthenticated visitor lands on `app.olympus-grid.com/eos` **when** the page loads **then** the kanban for `olympus-616/foundation/eos/cycle` on branch `brain/1.7.x.x` renders with all six lanes (00_backlog → 06_shipped → 07_aborted) populated with their current cards, served via public GitHub API with no errors **and** the URL bar reads `app.olympus-grid.com/eos/olympus-616/foundation/tree/brain%2F1.7.x.x/eos/cycle` (URL = state).
- **§2.2 Card open + markdown render.** **Given** the public viewer has the kanban loaded **when** the visitor clicks any card (e.g. `brain_1.7.eos-1.md`) **then** a side panel opens rendering the markdown via `react-markdown + remark-gfm` with frontmatter parsed and the controls badge row at the top **and** a "View on GitHub" link footer links to the file at the exact branch SHA.
- **§2.3 Signed-in edit-via-PR.** **Given** a Steward-role user (signed in to GitHub with write access to the repo) **when** they click "Edit" on any card, modify the markdown, and click "Propose change" **then** the app creates a branch on the repo, commits the edit with author = the signed-in user, opens a PR titled `edit(eos): {filename} via app` against `brain/1.7.x.x`, and surfaces a toast with the PR URL **and** the PR comment thread becomes visible in the card's right-rail.
- **§2.4 Drag-drop = git mv PR.** **Given** a Steward-role user **when** they drag a card from one lane to another **then** the app creates a branch and a single PR with a single commit that is a `git mv` (file rename via Git Data API) titled per the README convention `chore(eos): move {filename} from {source-stage} to {target-stage}` **and** the card visually moves immediately in the UI (optimistic update) with a "PR pending" badge that resolves to "PR open" once the API confirms.
- **§2.5 Create new card via PR.** **Given** a Steward-role user **when** they click the "+" affordance in any lane and fill out filename + body (TEMPLATE.md pre-fills if the kanban root is a cycle root) **then** the app creates a branch with the new file and opens a PR titled `feat(eos): open {cycle-id} via app`.
- **§2.6 SOC-2 control filter.** **Given** the kanban is loaded **when** the visitor clicks a control chip (e.g. CC7.2) in the filter row **then** only cards whose YAML frontmatter `controls:` array contains `CC7.2` remain visible **and** the URL updates to include `?filter=CC7.2` (filter = URL state).
- **§2.7 SOC-2 auditor dashboard.** **Given** any visitor **when** they navigate to `/eos/.../audit` **then** a heatmap renders rows = controls (CC1-CC9 + A/C/PI flat), columns = shipped cycles (`06_shipped/` files), cell intensity = "this cycle touches this control with this depth", each cell links to the cycle's §13 §evidence as the audit-evidence source.
- **§2.8 Activity stream.** **Given** any visitor on the kanban **when** the page is open **then** a right-rail feed polls `/commits` + `/pulls` against the kanban root every 5s and renders new events (commit / PR opened / PR comment) within ~5s of GitHub seeing them **and** each event is click-through to the GH item.
- **§2.9 Role detection + chip.** **Given** a signed-in user **when** the app boots **then** it queries `/user` + `/repos/{owner}/{repo}/collaborators/{username}/permission` and surfaces a corner chip reading one of: `Pilgrim` (anonymous), `Steward` (signed-in, no write), `Archon` (write or admin) **and** edit/move/create affordances appear only at Steward+ level.
- **§2.10 EOS-4.1 self-attestation closure.** **Given** the live app at `app.olympus-grid.com/eos` after all three PRs (foundation + iris + olympus-grid) are merged to `brain/1.7.x.x` **when** the Steward uses the app itself to (a) drag this cycle doc from `04_in_development/` → `05_verifying/` via a PR opened in the app, (b) edit the §13 closure to add the final attestation row via an edit PR opened in the app, and (c) drag the doc from `05_verifying/` → `06_shipped/` via a final PR opened in the app **then** the recursion is closed: the system delivered by EOS-4.1 attested its own EOS-4.1 closure.

## §3 Non-functional requirements

- **Cycle latency budget** — initial kanban paint < 1.5s p95 on a cold cache for the foundation/eos/cycle root (~24 files across 5 lanes); card open < 400ms p95. GitHub API rate-limit budget: anonymous = 60/hr (sufficient for ~6 visitors/hr without backoff); authenticated = 5000/hr (per-user; ample).
- **Cost budget** — public-read traffic is free (anonymous GH API). Authenticated edit/create incurs zero $ on our side (Octokit + GitHub App token = no LLM, no storage, no compute beyond Vite static delivery).
- **Observability** — every Octokit call wrapped with `x-eos-action` header denoting the user-intent verb (`read-kanban`, `read-card`, `propose-edit`, `propose-move`, `propose-create`, `attest`); logged client-side for now, server-side observability in v1.1 once Ares webhook ingestion lands.
- **Compatibility** — the app is read-compatible with ANY GitHub repo containing a folder of folders of `.md` files; the `.eos/config.json` schema is optional. Default rendering works without any `.eos/*` metadata (lanes inferred from subdirs alphabetically; cards = `.md` files).
- **Privacy** — the app stores zero data server-side. Auth tokens live in httpOnly cookies (when wired through Ares) or localStorage (PAT fallback for dev). No analytics, no tracking. Public kanban data is exactly what GitHub's public API serves.
- **Performance** — Vite bundle target < 350 KB gzipped post-tree-shake. Render budget: 60fps for drag-drop. No re-fetching of unchanged lanes (SHA-keyed cache).
- **Patent confidentiality** — the precise mechanics of edit-as-PR + role-from-repo-visibility + AI-attestation-as-PR-comment are subject to the patent disclosure (Claim 7 stub being added by this cycle). The app's UI may demonstrate the mechanic publicly (the whole point is operational visibility) but written technical descriptions of the chain remain confidential until IP counsel review concludes.
- **republic-616 readiness** — the §5 gate primitive in the app is abstract enough to accept multi-party votes when republic-616 ships. The Steward chip becomes "Voter" + a tally surfaces; the cycle doc frontmatter accepts an `approvers:` array; no code rewrite required.
- **SOC-2 dogfooding** — every change to the app from v1 forward is itself governed by an EOS cycle (the `iris/reactforce/eos/eos/cycle/` sub-kanban). The tool used to manage SOC-2 controls is itself SOC-2-governed. Auditor delight.

## §4 Feedback inputs

| FB# | Title | Body excerpt |
|-----|-------|--------------|
| Steward-prompt-2026-06-11 | Operationalize EOS 1-4 as a product | *"operationalize what we did for eos 1-4. this is an incredible and patentable approach to managing agent development swarms. ... a SOC 2 type project management tool that we will build to capture the processes of certification and attestation. ... each eos cycle will be tied directly to eos folder within ANY project. eos instantly becomes a new product."* |
| Steward-prompt-2026-06-11 | URL routing + iris portal app | *"user navigates to app.olympus-grid.com/eos which will launch the app as an iris portal app based upon our routing architecture. ... gpt is basically a template that springboards an iris app."* |
| Steward-prompt-2026-06-11 | GitHub as data source | *"eos will connect directly to github as its data source. its basically going to be a server side tool of what we manually did for eos-1-4."* |
| Steward-prompt-2026-06-11 | Public read + signed-in edit-as-PR | *"this should be a public application... any one can come to it, and they can see the kanban as it is public info. if it was a private repo, i would have to be logged in and have access to that repo via github security. ... people who are logged into github therefore would be able to edit the files directly. however this creates a pr to change the eos."* |
| Steward-prompt-2026-06-11 | Recursive AI attestation | *"agents can report attestations from the cli through the pr as well. we therefore have full traceability between ai attestation and the humans that are managing its attestation cycles."* |
| Steward-prompt-2026-06-11 | Logos | *"i believe mine has been spoken with logos."* |

## §5 Steward approval gate

- [x] Story locked (implicit via 2026-06-11 prompt — Steward verbatim closed with "iterate with me... make it better... perfect my design. i believe mine has been spoken with logos")
- [x] Criteria locked (Steward locked the four iteration questions 2026-06-11 23:?? UTC: cycle name = eos-4.1; build scope = read+edit+create-via-PR; auth = new GitHub App; SOC-2 = full in v1)
- [x] NFRs locked (implicit)
- [x] Approved to execute — signed: **G.W.H.** **2026-06-11** (single-Steward mode; multi-party §5 becomes available when republic-616 ships)

---

# § Agent-authored (bottom half)

## §6 Layer impact map

| Criterion | foundation/ | iris/reactforce/eos/ | olympus-grid/ | Pantheon services | omens / clients | Other |
|-----------|---|---|---|---|---|---|
| §2.1 public kanban render | cycle doc (this file) provides the data being rendered | the kanban renderer — workspace cloned from olympus-grid-ai | static resource `olympus_eos` + `Plugin.iris_deployment_path_eos.md-meta.xml` (sequence 57, pathPrefix `/eos`) | none for v1 (no server-side ingestion yet) | none | GitHub API public read |
| §2.2 card open + markdown | data | side panel, react-markdown + remark-gfm + gray-matter for frontmatter | bundle-id pin in Plugin__mdt | — | — | — |
| §2.3 edit-via-PR | data | edit modal + Octokit client with user-to-server token | — | (future v1.1) Ares webhook ingestion | — | GitHub App: repo contents R/W + PRs R/W |
| §2.4 drag-drop git mv | data | @dnd-kit + Git Data API tree-rewrite | — | — | — | — |
| §2.5 new card | data + TEMPLATE.md as pre-fill | new-card modal | — | — | — | — |
| §2.6 SOC-2 filter | controls: frontmatter backfill on EOS-1..4 | filter-chip row | — | — | — | SOC2-CONTROL-MAPPING.md (new) |
| §2.7 auditor dashboard | the SOC2 mapping doc | /audit subroute heatmap | — | — | — | — |
| §2.8 activity stream | — | right rail polling | — | — | — | — |
| §2.9 role chip | — | auth flow + permission probe | — | — | — | GitHub App |
| §2.10 recursive closure | this doc moves through the kanban via the app | — | — | — | — | — |

## §7 Schema deltas

**SObjects:** none for v1. (v1.1 may introduce `EosKanbanInstall__c` to track GitHub App installations per olympus-grid customer; deferred.)

**Plugin__mdt:** one new record — `Plugin.iris_deployment_path_eos.md-meta.xml`:
- Sequence__c: 57
- PluginType__c: "Iris Deployment"
- Configuration__c (JSON): `{ pathPrefix: "/eos", bundleResource: "olympus_eos", bundleId: "<pinned at build time>", allowBundleDomain: true }`
- Status__c: Installed
- Active__c: true

**Markdown frontmatter convention (new):** every cycle doc + every backlog/candidate card gets:
```yaml
---
controls: [CC1.1, CC7.2, ...]   # SOC-2 control identifiers touched by this cycle
attestation_status: in_development|verifying|shipped|aborted
prior_cycle: brain_1.7.eos-N.md
approvers: [G.W.H.]              # multi-party-ready (republic-616)
---
```
The full control catalog + per-cycle backfill mapping ships in `foundation/eos/SOC2-CONTROL-MAPPING.md`. EOS-1 through EOS-4 backfill happens **in this PR** so the v1 app demonstrates the auditor view immediately.

**`.eos/` config directory (new convention, optional):** a hidden directory at any kanban root may contain:
- `.eos/config.json` — kanban project name, root display label, default branch
- `.eos/columns.json` — lane definitions (display label, folder name, attestation policy, allowed-transitions matrix)
- `.eos/policies.json` — signer policies per transition (deferred to v1.1)

When `.eos/` is absent, the app falls back to alphabetic lane ordering by folder name and `.md` cards. The foundation kanban will ship with `.eos/columns.json` in this PR to lock the canonical column ordering.

## §8 Service contracts

**Public GitHub API (anonymous read path):**
```
GET https://api.github.com/repos/olympus-616/foundation/contents/eos/cycle?ref=brain/1.7.x.x
  → [{ name: "00_backlog", type: "dir", ... }, ...]

GET https://api.github.com/repos/olympus-616/foundation/contents/eos/cycle/06_shipped?ref=brain/1.7.x.x
  → [{ name: "brain_1.7.eos-1.md", type: "file", sha, ... }, ...]

GET https://api.github.com/repos/olympus-616/foundation/contents/eos/cycle/06_shipped/brain_1.7.eos-1.md?ref=brain/1.7.x.x
  → { content: base64, encoding: "base64", sha, ... }
```

**GitHub App user-to-server (signed-in edit path):**
```
POST https://github.com/login/oauth/access_token   (OAuth user-to-server exchange; GH App-mediated)
  → { access_token, expires_in, refresh_token, ... }

PUT /repos/olympus-616/foundation/contents/{path}    (commit on a new branch)
  Body: { message, content (b64), branch, sha (for update) }
  → { commit: { sha }, content: { sha } }

POST /repos/olympus-616/foundation/git/refs           (create branch from brain head)
POST /repos/olympus-616/foundation/git/trees          (compose a rename tree for git mv)
POST /repos/olympus-616/foundation/git/commits        (commit the tree)
PATCH /repos/olympus-616/foundation/git/refs/{ref}    (advance the branch)
POST /repos/olympus-616/foundation/pulls              (open the PR)
```

**HTTP envelope (per CLAUDE.md convention):** every Octokit call carries `X-Request-ID` (UUID v4) + `X-Eos-Action` (verb) headers. `X-Cycle-ID` is set to `eos-4.1` for any action originating from the app during its own development; future cycles set their own.

## §9 Telemetry assertions (the close-out gate)

- **§9.1** Public kanban at `app.olympus-grid.com/eos` renders the foundation cycle root from anonymous read — verified by `curl -I` returning 200 + the rendered HTML containing each lane name (`00_backlog`, `01_planning`, `04_in_development`, `06_shipped`, etc.) **and** including this cycle's filename `brain_1.7.eos-4.1.md` in the `04_in_development` lane.
- **§9.2** A signed-in Steward user clicks "Edit" on this cycle's doc, makes any edit, clicks Save — the resulting PR is open on `olympus-616/foundation` with title prefix `edit(eos):` and the PR body references `X-Cycle-ID: eos-4.1`.
- **§9.3** The Steward drags this cycle's doc from `04_in_development/` to `05_verifying/` in the app — a PR opens on `olympus-616/foundation` with title `chore(eos): move brain_1.7.eos-4.1.md from 04_in_development to 05_verifying` and exactly one commit that is a file rename (verified via `gh pr diff --name-status`).
- **§9.4** The /audit dashboard heatmap shows EOS-1 through EOS-4 with control coverage parsed from frontmatter (backfilled in this PR) — at least 6 distinct controls covered across the four shipped cycles.
- **§9.5** The activity stream renders at least 3 events within 30 seconds of the PRs in §9.2 / §9.3 being opened.
- **§9.6** Role chip correctly reads `Pilgrim` when signed out, `Archon` when signed in as a member of `olympus-616` org with write access to `foundation`. (`Steward` validated when a read-only collaborator signs in — deferred test until v1 validation cycle.)
- **§9.7 (the closure)** This doc transitions `04_in_development/ → 05_verifying/ → 06_shipped/` via three PRs **all created from inside the live app** at `app.olympus-grid.com/eos`. The last PR's squash-merge is the cycle's close. The PR titles + URLs are recorded in §13 as the canonical recursion-closed evidence.

## §10 Execution plan

1. **Foundation doc work** (this PR): write `brain_1.7.eos-4.1.md` (this file), update `README.md` numbering + inventory, add Claim 7 stub to `PATENT-DISCLOSURE-DRAFT.md`, create `SOC2-CONTROL-MAPPING.md`, backfill `controls:` frontmatter on `06_shipped/brain_1.7.eos-1..4.md` (additive — does not violate immutability since frontmatter is metadata, not history). Add `.eos/columns.json` to lock canonical lane ordering. **(blocks: nothing; ~90 min)**
2. **Iris workspace scaffold** (PR #2 of 3): clone `iris/reactforce/olympus-grid-ai/` → `iris/reactforce/eos/`. Rename package. Update Vite dev port. Update mount-prefix to `/eos`. **(blocks: §10.1; ~30 min)**
3. **GitHub data layer** (PR #2): `src/lib/github.ts` with Octokit, list/read functions, SHA-keyed cache. **(blocks: §10.2; ~45 min)**
4. **Kanban + card UI** (PR #2): `src/views/Kanban.tsx`, `src/views/Card.tsx`, lane + card components, side panel, markdown render with frontmatter. **(blocks: §10.3; ~90 min)**
5. **Auth flow** (PR #2): GitHub App registration spec handed to Steward; PAT fallback for dev; role detection. **(parallel with §10.4; ~60 min)**
6. **Edit / move / create flows** (PR #2): edit modal, @dnd-kit drag-drop with Git Data API tree-rewrite, new-card modal. **(blocks: §10.4 + §10.5; ~120 min)**
7. **SOC-2 controls UI** (PR #2): filter chips, /audit heatmap subroute. **(blocks: §10.4; ~60 min)**
8. **Activity stream** (PR #2): right-rail polling component. **(blocks: §10.3; ~30 min)**
9. **Iris build + publish** (PR #2): `npm run publishToStaticResources`, capture bundle id, verify staticresources layout in olympus-grid. **(blocks: §10.2 through §10.8; ~20 min)**
10. **Open iris PR** (PR #2): `git newthought eos_app_v1` + `git savethought` + `gh pr create`. **(blocks: §10.9; ~10 min)**
11. **Olympus-grid Plugin__mdt + static resource commit** (PR #3): `Plugin.iris_deployment_path_eos.md-meta.xml` with bundle id pinned, staged static resource folder. 5-way bundle-id consistency check. **(blocks: §10.9; ~30 min)**
12. **Open olympus-grid PR** (PR #3): `git newthought eos_portal_route` + `git savethought` + `gh pr create`. **(blocks: §10.11; ~10 min)**
13. **Steward review + merge of all three PRs in order** (foundation → iris → olympus-grid): Steward action. (After merge, the live app at `app.olympus-grid.com/eos` is reachable.) **(blocks: §10.12)**
14. **§9.7 closure exercise** (post-merge): Steward uses the live app to drag this doc through the kanban — three PRs landed from inside the app, each one a §9 telemetry assertion. **(blocks: §10.13)**

## §11 Verification protocol

### Without iPhone
- **Local dev**: `cd iris/reactforce/eos && npm run dev` → http://localhost:5179 → kanban renders against `olympus-616/foundation` public API. Steward visually confirms lane structure + card contents.
- **Build verification**: `npm run publishToStaticResources` → grep checks per CLAUDE.md 5-way bundle-id consistency:
  ```bash
  grep -oE "main\.bundle\.[a-z0-9]+" iris/reactforce/eos/build/index.html
  grep -oE "main\.bundle\.[a-z0-9]+" olympus-grid/force-app/ui/portal/default/staticresources/olympus_eos/index.html
  grep -oE 'bundleId&quot;:&quot;\.[a-z0-9]+' olympus-grid/force-app/ui/portal/default/customMetadata/Plugin.iris_deployment_path_eos.md-meta.xml
  ```
- **Scratch-org deploy check**: `sf project deploy start --source-dir force-app/ui/portal/default/staticresources/olympus_eos --source-dir force-app/ui/portal/default/customMetadata/Plugin.iris_deployment_path_eos.md-meta.xml --target-org dev_enterprise --ignore-conflicts` → visit `<scratch-url>/eos` → kanban renders.
- **Production verification (post-merge)**: visit `https://app.olympus-grid.com/eos` → kanban renders → click into a card → markdown renders → sign in with GitHub App → role chip flips to `Archon` → edit + propose change → PR appears on `github.com/olympus-616/foundation`.

### With iPhone
- Not required for v1. The app is mobile-responsive but the recursive-closure attestation is performed from a desktop browser session by the Steward.

## §12 Rollback plan

- **Foundation**: if EOS-4.1 needs to abort, `git mv` this doc from `04_in_development/` → `07_aborted/` with §13 closure capturing the rationale. The README + SOC-2 doc + Claim 7 stub stand on their own — no rollback needed.
- **Iris**: the workspace at `iris/reactforce/eos/` can be deleted wholesale. No other iris app depends on it.
- **Olympus-grid**: removing `Plugin.iris_deployment_path_eos.md-meta.xml` returns `/eos` to a 404 / falls back to whichever lower-sequence plugin matches. Removing `staticresources/olympus_eos/` removes the bundle. Destructive deploy script: `sf project deploy start --metadata-dir destructive-eos/`.

The blast radius is contained. The single load-bearing cross-cycle artifact this cycle produces is the live kanban URL; if that URL goes down, the underlying foundation/eos/cycle/ folder is unchanged and EOS continues to work the old-fashioned way (`ls` + `git mv`).

## §13 Closeout

**Filled at end of cycle. Doc goes immutable after this.**

### What shipped
- _(TBD — filled at cycle close)_

### What deferred (and why)
- _(TBD)_

### What surprised
- _(TBD)_

### Verification evidence
- _(TBD — links to the three PRs opened from inside the app, with their squash-merge commit SHAs)_
- _(TBD — screenshot or DOM snapshot of `app.olympus-grid.com/eos` showing this cycle's doc as the live card)_

### Feedback that emerged from THIS cycle (seed for the next one)
- _(TBD — EOS-4.2 candidate: CLI integration + webhook activity stream + GitHub App migration if v1 shipped on PAT fallback)_

### Memory updates
- _(TBD — capture the gpt-clone-ritual + iris-portal-mount-prefix + GitHub App registration pattern as memory if anything in those flows surprised in execution)_

### Cycle close commit
- Branch / PR link: _(TBD)_
- Steward sign-off: _(TBD)_
