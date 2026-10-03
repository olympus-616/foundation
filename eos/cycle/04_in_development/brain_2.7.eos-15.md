---
pitch: "Any Git repo becomes a renderable publication"
controls: TBD
attestation_status: in_development
approvers: [@alchemisthomer]
prior_cycle: brain_1.7.eos-4.1
---

# Odyssey-Press — universal content publisher via iris portal-app on `/docs`

> File: `brain_2.7.eos-15.md` — **fifteenth primary EOS cycle on the `brain/2.7.x.x` family** (after HUD `eos-1`, aeon `eos-2`, argos `eos-3`, kronos `eos-4`, brain-genesis `eos-5`, poseidon `eos-6`, iris `eos-7`, olympus-gpt `eos-8`, cp-biz `eos-9`, proteus `eos-10`, env-loader `eos-11`, anon-Stripe-leak `eos-12`, MeteringEvent trace widening `eos-13`, Plutus event vocabulary `eos-14`).
>
> **Design ticket** (per Steward direction 2026-10-02) for the odyssey-press iris portal-app shell built tonight (2026-10-02). Mechanical proof complete — Vite build clean (608 KB, 372 modules), dev server on port 5180, 5-way bundle-id consistency check green on `.dev.aarf`. Scratch-org smoke pending.
>
> **Source branch:** `@alchemisthomer/neuralpathway/9bb26db-01cb1da-20261002203308-odyssey-press-iris-shell` on `olympus-616/odyssey-press`, with matching unmerged deltas in `iris` and `olympus-grid`.
>
> **Prior cycle** `brain_1.7.eos-4.1` shipped the iris portal-app markdown-over-GitHub rendering pattern (EOS kanban at `app.olympus-grid.com/eos`) that odyssey-press now clones architecturally.

| | |
|---|---|
| **Branch family** | `brain/2.7.x.x` |
| **Cycle ordinal** | `eos-15` (fifteenth primary on 2.7 family) |
| **Status** | `In Development` — mechanical shell built 2026-10-02; Vite build + bundle-id 5-way consistency green; scratch-org smoke + alpha deploy pending. §1–§5 Steward-authored; §6–§13 agent-authored below. **DO NOT TICK §5 FROM AGENT SIDE.** |
| **Opened** | 2026-10-02 |
| **Closed** | — |
| **Prior cycle** | `brain_1.7.eos-4.1` (EOS portal — the iris portal-app markdown-over-GitHub rendering pattern this cycle clones) |
| **Theme** | Generalize odyssey-press from single-god audio-publishing submodule into the universal content publisher for the Olympus fleet; deliver as an iris portal-app on `/docs`. |
| **Feedback inputs** | Steward design-decision capture 2026-10-02 (branch slug `9bb26db-01cb1da-20261002203308-odyssey-press-iris-shell`); GitBook deprecation plan (`docs.olympus-grid.net` → `docs.olympus-grid.com`); iris portal-app pattern maturity post-eos-4.1 (EOS portal) and post-eos-5.1 (agent surface) |
| **Estimated effort** | S (shell) complete; M (scratch smoke + alpha deploy + hello-world content rendering); L (full GitBook migration + Tier 3 OAuth + standalone-odyssey-press fate decision + grid-independent open-source variant) |
| **Actual effort** | 2026-10-02 shell build (one session) — remaining attestation work queued |

---

# § Steward-authored (top half)

## §1 User story

> *Steward placeholder — edit when §5-ratifying.*
>
> As **any Olympus fleet contributor** I want **any Git repo with the right content convention to render as a readable publication at `app.olympus-grid.com/docs/{repo}/...`** so that **markdown docs, book chapters, podcast episodes, audiobook segments, video pages, white papers, games, fan fiction, and public-domain works all publish through one surface — no per-content-kind re-tooling, no backend to run, no CMS to administer**.

## §2 Acceptance criteria

> *Steward placeholder — edit when §5-ratifying.*

- §2.1 **Given** a public Git repo with `docs/_manifest.yaml` + at least one `{area}/_index.md` + one leaf, **when** a reader navigates to `/docs/{repo}`, **then** the repo cover renders listing the subject areas, and traversal into the area → nested area → leaf resolves each level.
- §2.2 **Given** a private Git repo + a user-pasted PAT with scope access to that repo, **when** the reader navigates to `/docs/{repo}`, **then** the private repo renders exactly as a public repo would (and 404s cleanly without the PAT).
- §2.3 **Given** a `?branch=X` query param on any `/docs` URL, **when** sub-navigation occurs, **then** the branch pin inherits across every subsequent request within that navigation chain.
- §2.4 **Given** the iris portal-app is deployed to alpha-org, **when** the hard-refresh `/docs` route resolves, **then** the real bundle serves (not `.dev.*` sentinel) and the 5-way bundle-id ceremony passes (parent CLAUDE.md § Iris Portal Bundle Release).
- §2.5 **Given** at least one real content tree (e.g., olympus-grid docs migrated from GitBook), **when** served via `/docs/olympus-grid/...` on alpha-org, **then** the content renders end-to-end with no missing cross-references + no console errors.

## §3 Non-functional requirements

> *Steward placeholder — edit when §5-ratifying.*

- **Rate budget:** single `git/trees?recursive=1` per repo+branch per session; blob fetches cached forever in localStorage keyed by content SHA. Session rate stays under Tier 1 anon ceiling (60 req/hr) for most casual browse patterns.
- **Access gating:** "only see docs for repos you have git access to" is enforced by GitHub itself — 404/403 on tree fetch → hide the repo. No olympus-grid-side ACL duplication.
- **Bundle-id discipline:** inherited from parent CLAUDE.md § Iris Portal Bundle Release — 5-way consistency check (iris build output, static-resource file, `app.main.v1.js` loader `reactBundleId`, Plugin__mdt record, static-resource `index.html`) must pass on every publish.
- **Portability:** content convention must survive generalization from dev docs → book chapters → podcast feeds → video pages. Director filename choice (`_index.md`) was debated against `_director.md`/`_section.md`/`_chapter.md` — Hugo convention + immediate legibility won.
- **No backend of its own:** content fetched from GitHub client-side. Any backend services odyssey-press needs become olympus-grid Apex endpoints (not a new god).

## §4 Feedback inputs

| Source | Signal |
|---|---|
| Steward design-decision capture 2026-10-02 | Generalize odyssey-press from single-god audio-publishing scope; iris portal-app pattern; one schema covers every content kind; three access tiers; defer standalone-odyssey-press fate |
| iris portal-app pattern maturity | `brain_1.7.eos-4.1` (EOS portal) + `brain_2.7.eos-5.1` (agent surface) proved the publishX/deployAlphaX/deployCpBizX pattern; odyssey-press reuses it 1:1 |
| GitBook deprecation plan | `docs.olympus-grid.net` current; manual port to olympus-grid's own `docs/` tree planned post-hello-world |
| 2026-10-02 mechanical proof | Vite build clean (608 KB, 372 modules); dev server port 5180 serves `/src/index.tsx` as ES modules with CORS `*`; 5-way bundle-id consistency check green on `.dev.aarf` |

## §5 Steward approval gate

- [ ] Charter locked (universal content publisher — not single-god audio)
- [ ] Scope locked (shell delivered tonight; four-condition attestation plan accepted)
- [ ] Content convention locked (`_index.md` director, `_manifest.yaml` root, `root:` override)
- [ ] URL shape locked (library → cover → director → leaf, `?branch=X` inheritance)
- [ ] Access-model tier sequencing locked (1 anon → 2 PAT → 3 OAuth)
- [ ] Deployment pattern locked (iris portal-app; publishOdysseyPress / deployAlphaOdysseyPress / deployCpBizOdysseyPress; `Plugin.iris_deployment_path_docs`)
- [ ] Approved to execute — signed: **___** **___**

---

# § Agent-authored (bottom half)

## Charter

Odyssey-press is now the **universal content publisher** for the Olympus fleet — generalized from its original single-god audio-publishing scope into any long-form artifact that renders from a Git repo. Scope includes markdown docs, book chapters, podcast episodes, audiobook segments, video pages, white papers, games, fan fiction, and public-domain works. Primary deployment target is the iris portal-app surface at `app.olympus-grid.com/docs` and (later) `docs.olympus-grid.com`. No backend of its own — content fetched from GitHub client-side in the browser. Any services odyssey-press needs become olympus-grid Apex endpoints, not a new backend god.

The design preserves a future grid-independent open-source variant (odyssey-press as a standalone publishing platform for non-Olympus users) — that variant is NOT designed tonight.

## Scope

**In scope tonight (hello-world shell — mechanical proof complete):**

- iris portal-app at `iris/reactforce/odyssey-press/` (new workspace, cloned from the eos pattern)
- Port assignment: **5180** (next after olympus-grid-ai=5178, eos=5179)
- Client-side rendering, `@octokit/rest` for GitHub REST API
- URL hierarchy: library → cover → director → leaf
- Breadcrumbs + branch switcher + PAT paste (localStorage)
- Hard-wired `DEFAULT_LIBRARY`: `olympus-616/odyssey-press` [public, `brain/2.7.x.x`] + `olympus-616/olympus-grid` [private, `brain/1.7.x.x`, highlight `api-manager`]
- Seed content: `olympus-616/odyssey-press/docs/_manifest.yaml` + `getting-started/_index.md` + 3 leaves
- Mechanical proof: Vite build 608 KB / 372 modules clean; dev server on 5180; 5-way bundle-id consistency check green on `.dev.aarf`

**Explicitly deferred (not in this cycle's scope):**

- `docs.olympus-grid.com` subdomain Plugin__mdt record (alpha deploy will add it)
- Tier 3 — GitHub OAuth device flow (pure-client, no backend; timing TBD)
- Search (Artemis integration — separate ticket when ready)
- Write-side primitives (comments, propose-edit, PR open) — EOS already owns that story on its own iris portal-app
- Grid-independent open-source build (odyssey-press as a standalone doc platform for non-Olympus users)
- Standalone `olympus-616/odyssey-press/` fate decision (Express 3671 + Vite 3672 single-god audio-publishing submodule is UNTOUCHED tonight; Steward's lean is stub + README-pointer after iris shell is proven on scratch)
- GitBook content migration from `docs.olympus-grid.net` → olympus-grid `docs/` tree (manual port, no automated migration planned)

## Content convention

**One schema covers every content kind.** The schema must survive generalization from dev docs → book chapters → podcast feeds → video pages — that constraint drove the naming choice.

```
{root}/                                        ← `docs/` by default; override via `root:` in _manifest.yaml
  _manifest.yaml                               ← title, description, default_branch, subject_areas[]
  {area}/
    _index.md                                  ← YAML frontmatter: title, summary, order, pages[], related[]
    {page}.md                                  ← leaf
    {sub-area}/
      _index.md                                ← nested director
      ...
```

**Rules:**

- A directory **IS a subject area iff it contains `_index.md`**. Without one, invisible to nav.
- `pages:` **curates the area index** — unlisted `.md` files stay reachable by URL but hidden from nav.
- `related:` **publishes cross-references** — sibling areas, other repos, external URLs.
- Director filename debated — `_index.md` won over `_director.md`, `_section.md`, `_chapter.md`. Rationale: Hugo convention + immediate legibility. Alternates were content-kind-specific; `_index.md` is content-kind-agnostic.

## Deployment pattern

Mirror the iris portal-app pattern already proven by `eos` (shipped per `brain_1.7.eos-4.1`) and `agent` (per `brain_2.7.eos-5.1`).

**Source location:** `iris/reactforce/odyssey-press/` (new workspace)

**iris `package.json` scripts (added tonight):**

| Script | Purpose |
|---|---|
| `odysseyPress` | Dev server on port 5180 |
| `buildOdysseyPress` | Vite build (iife + inlineDynamicImports, randomId bundle) |
| `publishOdysseyPress` | `scripts/managedPackage.js` copies build output into `olympus-grid/force-app/ui/portal/default/staticresources/odyssey_press/` |
| `deployAlphaOdysseyPress` | Ships static resource + resource-meta.xml + Plugin__mdt to alpha-org |
| `deployCpBizOdysseyPress` | Ships same to cp-biz |

**Plugin__mdt routing record:** `olympus-grid/force-app/ui/portal/default/customMetadata/Plugin.iris_deployment_path_docs.md-meta.xml`

| Field | Value |
|---|---|
| `pathPrefix` | `/docs` |
| `bundleResource` | `odyssey_press` |
| `sequence` | `61` |
| `allowBundleDomain` | `true` |
| `bundleId` | `.dev.aarf` (current — flips to real hash at next published build) |

**Static resource:** `olympus-grid/force-app/ui/portal/default/staticresources/odyssey_press/` + `odyssey_press.resource-meta.xml`

**Bundle-id discipline:** inherited from parent CLAUDE.md § Iris Portal Bundle Release — the mandatory 5-way consistency check runs before every PR touching static resources or `Plugin.iris_deployment_path_docs.md-meta.xml`. **Already verified green** on `.dev.aarf` tonight: loader shim `reactBundleId`, actual `main.bundle.dev.aarf.js` file, and `Plugin.iris_deployment_path_docs` all agree.

## URL shape

Four-level hierarchy with branch-pin inheritance:

```
/docs                                         → library (list of configured source repos)
/docs/{repo}                                  → repo cover (reads _manifest.yaml, lists subject areas)
/docs/{repo}/{area}                           → director (subject-area index from _index.md)
/docs/{repo}/{area}/{sub-area}                → nested director (recursive)
/docs/{repo}/{area}/.../{page}                → leaf (markdown page rendered)
?branch=X                                     → branch pin; inherited across sub-navigation
```

Iris mount detection: `/docs` or `/press` tokens in the URL route to the odyssey-press workspace.

## Access model

Three tiers; shipped in order.

| Tier | Mechanism | Rate ceiling | Access | Status |
|---|---|---|---|---|
| **1** | Anonymous | 60 req/hr/IP | Public repos only | **Default — shipped tonight** |
| **2** | PAT paste (localStorage) | 5000 req/hr/user | Private-repo access per token scope | **Shipped tonight** |
| **3** | GitHub OAuth device flow (pure-client, no backend) | 5000 req/hr/user | OAuth-scoped repo access | **Deferred — later cycle** |

**Access-gating note:** "Only see docs for repos you have git access to" is **enforced by GitHub itself** — 404/403 on tree fetch → hide the repo. No olympus-grid-side ACL duplication.

**Rate budget:** single `git/trees?recursive=1` call per repo+branch per session; blob fetches cached forever in localStorage keyed by content SHA.

**Cache discipline:** SHA-keyed in localStorage, content-addressed, durable across sessions. Branch pin changes the tree key but blob cache carries across branches when the content SHA matches.

## Attestation plan — what has to be true before this card flips to `shipped`

Four conditions; all required.

- **(a) Scratch-org hot-reload smoke passes end-to-end for public + private** — library → cover → director → leaf traversal + breadcrumbs + branch switcher + PAT paste all work against `?bundleDomain=http://localhost:5180` without JavaScript errors or static-resource 404s. `SMOKE_TEST.md` step-by-step is the authoritative checklist.
- **(b) Alpha-org deploy succeeds without bundle-id drift** — `deployAlphaOdysseyPress` runs green; 5-way bundle-id consistency check (parent CLAUDE.md § Iris Portal Bundle Release) remains intact post-deploy; `/docs` route on `app.olympus-grid.com` serves the real bundle (not the `.dev.*` sentinel).
- **(c) At least one real content tree rendering in prod** — olympus-grid docs migrated from GitBook (`docs.olympus-grid.net`) and served via `/docs/olympus-grid/...` on alpha, OR an equivalent proof-of-generalization content tree (public-domain book / podcast feed / white paper / iris design-docs set) that validates the universal-publisher claim beyond dev-docs-only.
- **(d) Standalone `olympus-616/odyssey-press/` fate decided** — Steward decision on the Express 3671 + Vite 3672 single-god audio-publishing submodule: stubbed to a README pointing at the iris app, kept as audio-specific sibling, or deprecated entirely. Current unchanged state is a known gap; this card doesn't close until that decision lands.

## Open questions

- **Standalone `olympus-616/odyssey-press/` fate** — stub to README-pointer, keep as audio-specific sibling, or deprecate entirely? (Steward's current lean: stub + redirect after iris shell is proven on scratch.)
- **GitBook content migration from `docs.olympus-grid.net`** — manual port vs tooling-assisted. No automated migration planned for this cycle; next cycle picks mechanism.
- **`docs.olympus-grid.com` subdomain** — when to add the Plugin__mdt routing record. Default: alpha-deploy adds it after `/docs` on `app.olympus-grid.com` is proven. Timing + DNS cutover sequencing TBD.
- **Tier 3 OAuth device flow** — timing. Depends on whether the PAT-paste tier produces friction for private-repo users in practice; defer until usage pattern signals the need.
- **Search (Artemis integration)** — separate design ticket when ready; owns full-text + semantic search across all configured source repos. Scope boundary with odyssey-press to be defined when Artemis cycle opens.
- **Write-side primitives (comments, propose-edit, PR open)** — EOS already owns the governance side of this story on its own iris portal-app. Odyssey-press focuses on publishing-side; cross-reference with EOS when read-write parity becomes a cross-cycle question.
- **Grid-independent open-source build** — later cycle; odyssey-press as an open-source doc platform for non-olympus-grid users. Design preserves the possibility; no implementation planned here.

## Related

- **Sibling design pattern:** [`brain_1.7.eos-4.1`](../06_shipped/brain_1.7.eos-4.1.md) — the EOS kanban iris portal-app that odyssey-press clones architecturally. Same markdown-over-GitHub rendering model, same iris mount pattern, same bundle-ceremony discipline. Reading this card is the fastest path to understanding odyssey-press's deployment shape.
- **iris workspace:** `iris/reactforce/odyssey-press/` — the new portal-app source tree. Branch `@alchemisthomer/neuralpathway/9bb26db-01cb1da-20261002203308-odyssey-press-iris-shell` on `olympus-616/odyssey-press`.
- **olympus-grid routing:** `olympus-grid/force-app/ui/portal/default/customMetadata/Plugin.iris_deployment_path_docs.md-meta.xml` — the new `pathPrefix=/docs` → `bundleResource=odyssey_press` record (`sequence=61`, `allowBundleDomain=true`, `bundleId=.dev.aarf`).
- **Smoke test:** `iris/reactforce/odyssey-press/SMOKE_TEST.md` — step-by-step scratch-org hot-reload walkthrough; the §9 attestation checklist for condition (a).
- **Content seed:** `olympus-616/odyssey-press/docs/_manifest.yaml` + `getting-started/_index.md` + three leaves (`overview.md`, `content-model.md`, `first-publication.md`) — the hello-world content tree that validates library → cover → director → leaf.
- **CLAUDE.md section:** parent `olympus-616/CLAUDE.md` § "Iris Portal Bundle Release (MANDATORY for any iris UI PR)" — the 5-way consistency ceremony that odyssey-press inherits unchanged.
- **GitBook decommission target:** current docs at `docs.olympus-grid.net` — content gets manually ported into olympus-grid's own `docs/` tree, then DNS cuts over to `docs.olympus-grid.com` served by odyssey-press.
- **Sibling publishX pattern reference:** `iris/reactforce/eos/` + `iris/reactforce/agent/` + `iris/reactforce/olympus-grid-ai/` — three prior iris portal-apps whose scripts odyssey-press mirrors.
