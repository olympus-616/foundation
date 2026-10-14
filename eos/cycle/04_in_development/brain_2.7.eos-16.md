---
pitch: "Our invoicing, built the way customers will build theirs"
---

# I attest that CloudPremise's "Create Invoices" tool has been replaced by `invoice-studio` — a React app authored in cp-biz's own repo against olympus-grid's platform wrappers, served from `beta.olympus-grid.com/portal/invoice-studio`, that queries + searches + mass-updates `InvoiceDetail__c` state, exports CSV for invoicing, and renders a historical status dashboard — proven by one Steward-run monthly billing cycle, marketing-brochure polished, and reusable as the authoring template for the next CloudPremise app ("Consulting Time Card").

> File: `brain_2.7.eos-16.md`
>
> **Scope origin:** Steward directive 2026-10-05 (_"until cloudpremise is running 100% on olympus-grid why would i ever expect anyone else to"_) → `cloudpremise/cloudpremise-sf-biz/ARCHITECTURE.md` §10 Wave C1 → architectural reframe during §5.1 scope-decision pass on 2026-10-06. **The ARCHITECTURE.md matrix framed the port as moving business SObjects into olympus-grid; that framing was wrong.** Correct framing per Steward 2026-10-06: business domain (Invoice__c / InvoiceDetail__c / WorkOrder__c / WorkOrderService__c / Service__c) stays authored in cp-biz's own repo; olympus-grid exports the **platform wrappers** (React component library, Hermes event bus client, portal-auth JWT helper, reactforce workspace scaffolding, ApiRoute framework, Plugin__mdt registry). A future customer repeats this cycle with their own namespace — _"no different except they would use the namespace to access the components."_
>
> **The dogfood thesis.** The Steward's current "Create Invoices" workflow runs on pre-olympus-grid cp-biz Aura (`InvoiceListApplication`) + LWC (`invoiceList`) + Apex (`InvoiceListController` + `InvoiceQueries`). It is the prototype architecture whose success led to olympus-grid — but it is NOT built on olympus-grid. Rebuilding it as `invoice-studio` — a cp-biz-authored React app that consumes olympus-grid's platform surface the way any future customer will — produces the first proof that olympus-grid is a usable development platform, not just a demo. **Until CloudPremise authors on olympus-grid, no customer should be expected to.** This cycle is that first authoring, scheduled against the **2027-07-17 global-deployability-attestation** deadline.
>
> **Perspective — load-bearing.** Every design decision is made from the seat of **a cp-biz admin using olympus-grid as their development platform**, not from the seat of an olympus-grid core-engineer. If a step requires knowledge or privilege a CloudPremise end-user won't have, the step is wrong and must be redesigned. The friction the Steward feels building this IS the friction every future customer will feel. The real deliverable isn't the invoice-studio app; it's the **proven, documented, repeatable authoring pattern** that the next CloudPremise app (Consulting Time Card, immediately after) and every customer thereafter will reuse.
>
> **The sibling cycle.** `invoice-studio` is immediately followed by `cloudpremise-time-card` (ordinal TBD) — a React app for contractors to enter their time, which flows into `WorkOrderService__c` → `InvoiceDetail__c` → `invoice-studio`. If the authoring pattern established here doesn't make `cloudpremise-time-card` largely a copy-paste exercise, this cycle hasn't fully succeeded.
>
> **Hard dependency:** olympus-grid must export, in forms a customer app can consume, the platform surfaces listed in §7.2. Some already exist (ApiRoute framework, Plugin__mdt registry, iris portal shell). Others may not (React component library as a consumable npm package, reactforce scaffolding template, Hermes bus client library). The first sub-wave of §10 is an **export-surface audit**; any missing surface becomes a sub-task that lands IN this cycle before the invoice-studio author can proceed.
>
> **Non-dependency explicit:** no destructive-deploy against cp-biz. The legacy Aura/LWC "Create Invoices" tool continues to exist until the Steward manually retires it post-dogfood. No managed-package dependency — the whole thing ships via `beta.olympus-grid.com/portal/invoice-studio` on today's cp-biz source-deploy pipeline. A future ticket proves the same pattern installs cleanly into a fresh customer org via `og_node_beta_1`.

| | |
|---|---|
| **Branch family** | `brain/2.7.x.x` |
| **Cycle ordinal** | `eos-16` (eos-15 assigned to odyssey-press iris-portal cycle 2026-10-02) |
| **Status** | **`Approved-Awaiting-Execution`.** §1–§5 Steward-authored; moved to `04_in_development/` 2026-10-06 per direct-to-execution single-Steward mode. §6–§12 agent-authored. |
| **Opened** | 2026-10-05 |
| **In-development** | 2026-10-06 |
| **Closed** | — |
| **Prior cycle** | `brain_2.7.eos-9` (Run the Steward's own business on the platform — shipped 2026-10-02). eos-9 was _run cp-biz on olympus-grid as the smoke-test target_; eos-16 is _author cp-biz's first app on olympus-grid as a customer would_. |
| **Theme** | First olympus-grid-authored CloudPremise app. Replaces the Aura/LWC "Create Invoices" tool. Marketing-brochure polish. Establishes the customer-app authoring pattern that `cloudpremise-time-card` and every subsequent customer will reuse. |
| **Feedback inputs** | FB§4.1 (Steward 2026-10-05 — _"until cloudpremise is running 100% on olympus-grid why would i ever expect anyone else to"_); FB§4.2 (Steward 2026-10-06 — reframe: business domain stays customer-side); FB§4.3 (Steward 2026-10-06 — scope narrow: mass-update + CSV + dashboard, no payments); FB§4.4 (Steward 2026-10-06 — search options required); FB§4.5 (Steward 2026-10-06 — sibling app `cloudpremise-time-card` follows); FB§4.6 (Steward 2026-10-06 — marketing-brochure polish bar). |
| **Estimated effort** | Large — 8 execution sub-waves (E.0 → E.8) + dogfood month. E.0 is unknown-sized (framework-export audit may surface missing exports). |
| **Actual effort** | — |

---

# § Steward-authored (top half)

## §1 User story

> §1.1 As a **cp-biz admin running CloudPremise**, I want **a modern React app at `beta.olympus-grid.com/portal/invoice-studio` that lets me query, search, filter, and mass-update `InvoiceDetail__c` records to drive my monthly billing**, so that **I replace the Aura/LWC "Create Invoices" tool with an olympus-grid-native equivalent and complete my monthly cycle in one place**.

> §1.2 As a **cp-biz admin**, I want **to apply status transitions in bulk** — Mark as Invoiced / Mark as Paid / Mark as Sub-contract Invoiced / Mark as Sub-contract Paid — across many `InvoiceDetail__c` records at once with a confirmation step, so that **monthly billing is a few clicks, not a per-record walk**.

> §1.3 As a **cp-biz admin**, I want **to export my filtered working set to CSV**, so that **I can hand off to QuickBooks today (manually) and auto-sync later (future cycle)**.

> §1.4 As a **cp-biz admin**, I want **a basic status dashboard showing all historical `InvoiceDetail__c` records** — counts by status, aging buckets, monthly revenue by Account/Service, trailing-12-month status pipeline — so that **I can see the state of my billing at a glance**.

> §1.5 As a **cp-biz admin building the next CloudPremise app (`cloudpremise-time-card`)**, I want **this cycle to establish and document the authoring pattern** — reactforce workspace scaffolded outside the iris monorepo, Plugin__mdt-registered portal tile, ApiRoute Apex consuming olympus-grid's framework, Hermes event-bus publication — so that **the next app is a copy-paste adaptation, not another greenfield**.

> §1.6 As a **future olympus-grid customer evaluating the platform**, I want **CloudPremise's own invoice-studio to exist, work, and be documented end-to-end**, so that **I have an existence proof olympus-grid supports a real services business — not a demo, not a sandbox, and not something only olympus-grid core-engineers can build**.

## §2 Acceptance criteria

- **§2.1 (Replace legacy)** **Given** the Steward opens `beta.olympus-grid.com/portal/invoice-studio` **when** they complete a monthly billing cycle **then** they do so without opening Aura `InvoiceListApplication`, LWC `invoiceList`, or VF `InvoiceGenerationVF` **and** the session log carries `invoice_studio.monthly_cycle.completed` with `source=invoice-studio`.

- **§2.2 (Search + filter)** **Given** the Steward has thousands of `InvoiceDetail__c` records **when** they open invoice-studio **then** they can:
  - **free-text search** across `Account.Name`, parent `Invoice__c.Name`, `WorkOrderService__c.Service__r.Name`, record `Name`
  - **filter by status** (Not-Yet-Invoiced / Invoiced / Paid / Sub-contract-Invoiced / Sub-contract-Paid) via multi-select chips
  - **filter by work-date range** and **invoice-date range**
  - **filter by Account** and **by Service**
  - **combine search + filters**; the resulting state is **reflected in the URL** (shareable, bookmarkable, back-button-restorable)
  - page or scroll through results with p95 ≤ 800 ms per API call
  **and** every filter chip is keyboard-navigable.

- **§2.3 (Mass-update)** **Given** a filtered working set **when** the Steward multi-selects rows and clicks "Mark as Invoiced" (or Paid / Sub-contract-Invoiced / Sub-contract-Paid) **then** a confirmation modal shows the row count + target status **and** on confirmation the backend applies the transition atomically **and** per-row failures surface individually without rolling back successes **and** the UI refreshes to reflect the new state within 500 ms of commit.

- **§2.4 (CSV export)** **Given** a filtered working set **when** the Steward clicks "Export CSV" **then** a CSV downloads client-side containing one row per record with columns aligned to the Steward's QuickBooks import template **and** no server round-trip is required beyond fetching the full filtered set.

- **§2.5 (Status dashboard)** **Given** the Steward opens the dashboard **then** they see, loaded from all-historical data:
  - counts by `InvoiceDetail__c` status
  - aging buckets (0–30 / 31–60 / 61–90 / 90+ days) by work date and by invoice date
  - monthly revenue by Account and by Service (trailing 12 months)
  - trailing-12-month status pipeline (how many entered each status per month)
  **and** every number is traceable to a SOQL query that can be re-run by hand **and** p95 dashboard load ≤ 3 s with progressive panel render.

- **§2.6 (Platform wrappers consumed, cleanly)** **Given** the invoice-studio ships **when** a reviewer examines the cp-biz-side source **then** the app's dependencies on olympus-grid are limited to:
  - a published olympus-grid React component library (consumed via `npm` from the invoice-studio folder's own `package.json`)
  - the olympus-grid Hermes event-bus client (consumed via `npm`)
  - the olympus-grid portal-auth JWT helper (consumed via `npm`)
  - olympus-grid's ApiRoute Apex framework (consumed by cp-biz-authored handler classes registered through `Plugin__mdt` — the Apex-side prior-art is `olympus-grid/force-app/development/sfdc_site_samples`; this cycle produces the React-side counterpart)

  No olympus-grid-internal imports from React source. No olympus-grid repo access required to build or deploy invoice-studio. If any of these wrappers doesn't exist today as a consumable npm package, standing it up is part of §10 E.0 and MUST ship before §10 E.2.

- **§2.7 (Marketing-brochure polish)** **Given** the invoice-studio ships **when** the Steward screenshots the four key views (list + search, mass-update modal, CSV export flow, dashboard) **then** each screenshot is publishable in an olympus-grid marketing brochure without further design work. Specifically: SLDS-respectful typography, deliberate color palette, meaningful empty states, loading states, error states, and keyboard-navigable throughout.

- **§2.8 (Dogfood month — the attestation anchor)** **Given** the invoice-studio is live **when** the Steward runs ONE FULL MONTHLY BILLING CYCLE (query → filter → review → mass-update → CSV export → hand off to QuickBooks) using only invoice-studio **and** does not fall back to the legacy Aura/LWC tool **then** the cycle is attested **and** the authoring pattern is documented in `olympus-grid/force-app/development/invoice-studio/README.md` + `olympus-grid/docs/customer-app-authoring.md` **and** Steward is positioned to begin `time-card` as the next sibling client-example folder.

- **§2.9 (Reusability for `cloudpremise-time-card`)** **Given** the authoring pattern is documented **when** a reader (future customer OR Steward opening the Time Card cycle) follows the pattern **then** they can scaffold a new reactforce workspace, register a new portal tile via Plugin__mdt, author a new ApiRoute handler against their SObject, and deploy to a cp-biz-equivalent Site **within one working session**.

## §3 Non-functional requirements

- **Latency** — list/search p95 ≤ 800 ms (API) + ≤ 1 s render; mass-update p95 ≤ 5 s for 100 rows; CSV export p95 ≤ 3 s for 1000 rows; dashboard p95 ≤ 3 s with progressive panel render.
- **Bundle size** — invoice-studio Vite output ≤ 400 KB gzipped (JS); keep heavy dependencies externalized via olympus-grid npm packages.
- **Observability** — every state transition writes a `Logger__c` row with `cycleId`, `userId`, `before` and `after` status, record ids. Every search + filter + export action emits a Hermes event (`invoice_studio.search` / `invoice_studio.bulk_update` / `invoice_studio.csv_export` / `invoice_studio.dashboard_viewed`).
- **Folder discipline — the "unmanaged bridge" pattern** — invoice-studio lives as a self-contained folder at `olympus-grid/force-app/development/invoice-studio/`. The `force-app/development/` subtree is the **existing** "unmanaged bridge" region of the olympus-grid repo — it already contains Apex-only client-examples (`sfdc_site_samples`, `pdfViewer`) plus dev-only utilities (`remoteSiteSettings`, `vulnerable`). It deploys to cp-biz on every merge to `brain/2.7.x.x` and is intentionally **excluded from the managed-package build via `.forceignore`** so nothing in `development/` ever ships inside `og_node_beta_1`. invoice-studio becomes the **first React client-example** in that subtree; subsequent CloudPremise apps (`time-card` next) each add a sibling folder. No new repo. One repeatable process: copy the invoice-studio folder, rename, modify.
- **Namespace** — client-example Apex references SObjects as unprefixed local (`InvoiceDetail__c`). When a future olympus-grid customer repeats this pattern inside their own SFDX project, they reference their equivalent via their namespace. olympus-grid's ApiRoute framework resolves route-to-handler via `Plugin__mdt` — namespace-aware.
- **No PII in logs** — mask account email in trace output.
- **Admin-only** — invoice-studio is accessible only to the Steward's admin profile in this cycle. Multi-user support (contractors) is explicitly the `cloudpremise-time-card` cycle's problem.
- **No breaking schema changes** — no new fields on `Invoice__c` / `InvoiceDetail__c` unless the Steward explicitly adds one for invoice-studio's own instrumentation. The legacy Aura/LWC tool continues to work unchanged in parallel for the duration of the dogfood month and after.
- **Deployment** — invoice-studio deploys to cp-biz via the **existing** `olympus-grid/.github/workflows/deploy-push-cp-biz.yaml` pipeline (Create / Verify / Annotate, ~22 min). No new pipeline, no new secrets, no new workflow. The folder's static resource lands as `olympus-grid__invoice-studio` (or similar unprefixed) in cp-biz — never in a customer's installed managed package.

## §4 Feedback inputs

| FB# | Date | Title | Body excerpt |
|-----|------|-------|--------------|
| FB§4.1 | 2026-10-05 | Steward directive — the thesis | _"until cloudpremise is running 100% on olympus-grid why would i ever expect anyone else to."_ Prompted the authoring of `cloudpremise/cloudpremise-sf-biz/ARCHITECTURE.md` and this cycle. |
| FB§4.2 | 2026-10-06 | Steward reframe — business stays customer-side | _"they will be authored within the cp-biz org under its own repo, and not part of the olympus-grid managed package. if the same customer did this in the future this would be no different except they would use the namespace to access the components."_ Reframes the port: olympus-grid exports platform wrappers; business domain stays authored in customer repo. |
| FB§4.3 | 2026-10-06 | Steward narrow — the actual tool | _"its a simple applicatoin … query InvoiceDetail__c records, mass update them: mark as invoiced, mark as paid, mark as sub-contract invoiced, mark as sub-contract paid … export csv for invoice. and eventually export to quickbooks and automatically reflect the payments as they come in but for now …"_ Scope lock. Payments + QBO sync explicitly deferred. |
| FB§4.4 | 2026-10-06 | Steward add — search | _"there should be search options."_ Encoded in §2.2. |
| FB§4.5 | 2026-10-06 | Steward signal — sibling app | _"a new application created soon thereafter, called 'CloudPremise Consulting Time Card' because the cloudpremise consulting business needs a way for contractors to enter their time successfully."_ Authoring pattern established here must support the next app without a rewrite. |
| FB§4.6 | 2026-10-06 | Steward framing — the brochure | _"it would be nice to see this as an official 'olympus-grid' application that could be published in a marketing broucher about how awesome olympus-grid is."_ Polish bar: brochure-publishable. |

## §5 Steward approval gate

- [x] Story locked
- [x] Criteria locked
- [x] NFRs locked
- [x] Scope decisions resolved (see §5.1 below — all five resolved 2026-10-06)
- [x] Approved to execute — moved to `04_in_development/` 2026-10-06 under single-Steward direct-to-execution mode

### §5.1 Scope decisions (RESOLVED 2026-10-06)

1. **Workspace name →** `invoice-studio` ✅
2. **WorkOrder/Service in olympus-grid →** NO. Business domain stays cp-biz-authored. ✅ (big reframe — reshapes the whole cycle)
3. **Payment integration →** OUT of this cycle. CSV export IN. QBO auto-sync is a future cycle. ✅
4. **Surface →** SF Site on olympus-grid portal: `beta.olympus-grid.com/portal/invoice-studio`. Appears as a tile in the admin portal. NOT a Lightning tab inside Salesforce. ✅
5. **Dashboard historical scope →** all historical data. ✅

Open stretch (noted, non-blocking):
- **Saved views** on the search/filter grid ("This month's billables", "90-day aged unpaid") — flagged as stretch in §10 E.2.

---

# § Agent-authored (bottom half)

## §6 Layer impact map

| Criterion | `olympus-grid/force-app/development/invoice-studio/` (new folder) | olympus-grid npm exports (if any missing) | iris repo | Pantheon services |
|-----------|-------------------------------------------------------------------|-------------------------------------------|-----------|-------------------|
| §2.1 Replace legacy | `default/customMetadata/Plugin.PortalTile_InvoiceStudio.md-meta.xml` + full folder | — | — | — |
| §2.2 Search + filter | `src-react/pages/List.tsx` + filter chips + URL state + `default/classes/InvoiceDetailListApiHandler.cls` | — | — | — |
| §2.3 Mass-update | `src-react/pages/List.tsx` multi-select + confirmation modal + `default/classes/InvoiceDetailBulkPatchApiHandler.cls` | — | — | Hermes event emitted on commit |
| §2.4 CSV export | `src-react/lib/csv.ts` client-side builder + download | — | — | — |
| §2.5 Dashboard | `src-react/pages/Dashboard.tsx` + 4 panels + `default/classes/InvoiceDetailReportsApiHandler.cls` | — | — | — |
| §2.6 Platform wrappers consumed | **CONSUME** the wrappers via `src-react/package.json` dependencies | **PUBLISH** the wrappers as npm packages (if not already) | may hold the source today, published out as npm | — |
| §2.7 Brochure polish | `src-react/` SLDS tokens, empty/loading/error states, keyboard nav | — | — | — |
| §2.8 Dogfood month | Steward operates the app at `beta.olympus-grid.com/portal/invoice-studio` | — | — | — |
| §2.9 Reusability | folder is itself the template; `README.md` documents how to copy for the next app | documentation page at `olympus-grid/docs/customer-app-authoring.md` | — | — |

No omens impact. No turtleshell-web impact. No new repo. No new pipeline.

## §7 Platform surface — what olympus-grid exports for this cycle

**This section replaces the "schema deltas" that would exist if this were a schema-port cycle. The deltas are instead in the olympus-grid platform-export surface.**

### §7.1 Audit (sub-wave E.0 — see §10)

Before any invoice-studio code is written, enumerate for each item in §7.2 below:
- Does it exist today?
- In what form (Apex class / LWC / internal JS util / undocumented pattern)?
- Is it published as a consumable artifact (npm package, documented API, scaffolding template)?
- If not consumable: what's the gap?

### §7.2 Required platform surfaces

| Surface | Form | Consumer need | Current state (TBD at E.0) |
|---|---|---|---|
| **React component library** | npm package (e.g., `@olympus-grid/react-components`) | tables, filter chips, modals, buttons, forms — SLDS-respectful by default | audit |
| **Portal auth JWT helper** | npm package (e.g., `@olympus-grid/portal-auth`) | mint + refresh portal JWT, attach `x-user-identity` to every API call, redirect to portal login on 401 | audit |
| **Hermes event-bus client** | npm package (e.g., `@olympus-grid/hermes-bus`) | publish events (`invoice_studio.*`) from browser; subscribe to events for live UI refresh | audit |
| **reactforce workspace scaffolding** | repo template OR CLI (`npx create-og-app`) | one-command scaffold of a new customer app repo with Vite config, build script, deploy pipeline, portal-tile Plugin__mdt stub | audit |
| **ApiRoute Apex framework** | Apex + documentation | customer authors `*ApiRouteHandler.cls` implementing the olympus-grid handler interface; registers via `Plugin__mdt`; dispatches route-to-handler at runtime | **exists** per prior cycles |
| **Plugin__mdt registry pattern** | Apex + documentation | customer registers portal-tile metadata (route, label, icon) + ApiRoute handlers (route, verb, handler class, namespace) | **exists** per prior cycles |
| **Portal tile registration** | Apex + Plugin__mdt record pattern | customer registers `invoice-studio` as a tile in the admin portal with route, label, icon, access control | audit |
| **Site-serving pattern** | VF page + static-resource convention | serve a customer-authored React bundle under `beta.olympus-grid.com/portal/<app>` via SF Site Guest + authenticated route | **exists** per iris portal |
| **Observability (Logger__c)** | Apex util + documentation | customer-authored handlers write to `Logger__c` with `cycleId`, `userId`, action, payload | **exists** per prior cycles |

**E.0 outcome:** every row in this table has `status=consumable` before invoice-studio author moves on to E.1. Any row that resolves to "exists but not consumable" (e.g., "there's a React component library in iris, but it's not published as an npm package") triggers an export sub-task INSIDE this cycle to turn it consumable. **This is the real cost of being first.**

### §7.3 Client-example artifacts (authored in `olympus-grid/force-app/development/invoice-studio/`)

This is the first React sibling to the existing Apex-only `sfdc_site_samples`. Everything in this folder is unmanaged client-example code — deployed to cp-biz as a reference implementation, **never** shipped in the managed package.

```
olympus-grid/force-app/development/invoice-studio/
├── default/
│   ├── classes/
│   │   ├── InvoiceDetailListApiHandler.cls          ← GET  /v1/invoice-details
│   │   ├── InvoiceDetailListApiHandlerTest.cls
│   │   ├── InvoiceDetailBulkPatchApiHandler.cls     ← PATCH /v1/invoice-details/bulk
│   │   ├── InvoiceDetailBulkPatchApiHandlerTest.cls
│   │   ├── InvoiceDetailReportsApiHandler.cls       ← GET  /v1/invoice-details/reports/{kind}
│   │   └── InvoiceDetailReportsApiHandlerTest.cls
│   ├── customMetadata/
│   │   ├── Plugin.ApiRoute_InvoiceDetailList.md-meta.xml
│   │   ├── Plugin.ApiRoute_InvoiceDetailBulkPatch.md-meta.xml
│   │   ├── Plugin.ApiRoute_InvoiceDetailReports.md-meta.xml
│   │   └── Plugin.PortalTile_InvoiceStudio.md-meta.xml
│   └── staticresources/
│       ├── invoice-studio/                          ← Vite build output (committed to git)
│       └── invoice-studio.resource-meta.xml
├── src-react/                                        ← React source (TypeScript, SLDS)
│   ├── package.json                                  ← depends on @olympus-grid/* npm packages
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── index.html
│   └── src/
│       ├── App.tsx, routes.tsx
│       ├── pages/List.tsx, Dashboard.tsx
│       ├── components/FilterChips.tsx, MassUpdateModal.tsx, …
│       └── lib/api.ts, csv.ts, auth.ts
├── scripts/
│   └── build.sh                                      ← npm install && vite build → ../default/staticresources/invoice-studio/
└── README.md                                         ← "copy this folder to make the next client-example"
```

**Why source + bundle both committed:** the React source stays visible so a reviewer (or a future customer reading the client-example) can see exactly what the client code does. The compiled bundle under `default/staticresources/invoice-studio/` is what Salesforce deploys. Both coexist in git — the source for inspection + copy-and-adapt, the bundle for deploy.

**Build integration:** `scripts/build.sh` is called before `sf project deploy start`; the cp-biz CI pipeline runs it as a Node step before the `sf deploy` step (see §10 E.0 for pipeline amendment). Locally, the Steward runs it from the folder.

### §7.4 Permission sets

- No new olympus-grid permset. The Steward's existing admin profile grants access to invoice-studio tile + `InvoiceDetail__c` SObject.
- Future: a client-example permset `InvoiceStudio_Admin` co-located in `olympus-grid/force-app/development/invoice-studio/default/permissionsets/` if/when non-Steward users need access.

## §8 Service contracts

All routes authored by cp-biz, served by olympus-grid's ApiRoute framework, dispatched by `Plugin__mdt`. Authenticated via olympus-grid portal JWT (localStorage `og_access_token` → `x-user-identity` header). Dev-mode JWT bypass per `feedback_iris_portal_jwt_session_bypass`.

### §8.1 List + search + filter

```
GET /v1/invoice-details
  Query:
    q            — free-text search across Account.Name, Invoice__c.Name,
                   WorkOrderService__c.Service__r.Name, Name
    status       — repeatable; one of: not_yet_invoiced | invoiced | paid |
                   subcontract_invoiced | subcontract_paid
    accountId    — Account 15/18-char Id
    serviceId    — Service__c Id
    workDateFrom, workDateTo    — ISO date
    invoiceDateFrom, invoiceDateTo — ISO date
    limit        — default 100, max 500
    cursor       — opaque cursor from previous response
    sort         — e.g., workDate_desc | account_asc | status_asc

  Returns:
    { records: [ {...InvoiceDetail__c snapshot...}, ... ],
      nextCursor: string|null,
      totalCount: number,
      cycleId: string }
```

### §8.2 Bulk patch

```
PATCH /v1/invoice-details/bulk
  Body: {
    recordIds: [ "a0..." , ... ],
    update: { Status__c: "Invoiced" | "Paid" | "SubcontractInvoiced" | "SubcontractPaid" },
    cycleId: string
  }
  Returns: {
    successes: [ { recordId, previousStatus, newStatus } ],
    failures:  [ { recordId, error } ],
    cycleId: string
  }
  Side effect: publishes Hermes event `invoice_studio.bulk_update`
                 with { count, status, cycleId, userId }
```

### §8.3 CSV export

Preferred: **client-side**. The list endpoint supports a `limit=500` paginated walk; client assembles CSV, triggers download. No server-side route needed.

Fallback (if client-side chokes on very large exports in a future month): server-side route

```
GET /v1/invoice-details/export.csv?<same filters as §8.1>
  Returns: text/csv (one row per record)
```

### §8.4 Reports

```
GET /v1/invoice-details/reports/status
  Returns: { byStatus: [ { status, count, total }, ... ], cycleId }

GET /v1/invoice-details/reports/aging
  Query: ?by=workDate | invoiceDate
  Returns: { buckets: [ { label: "0-30", count, total }, ... ], cycleId }

GET /v1/invoice-details/reports/revenue
  Query: ?groupBy=account | service | month   &months=12
  Returns: { series: [ { key, revenue, count }, ... ], cycleId }

GET /v1/invoice-details/reports/pipeline
  Query: ?months=12
  Returns: { months: [ { month: "YYYY-MM", notYetInvoiced, invoiced, paid,
                         subcontractInvoiced, subcontractPaid }, ... ], cycleId }
```

Every response carries `cycleId` on request + echoes it back for trace stitching.

## §9 Telemetry assertions (close-out gate)

### §9.1 Must appear during the Steward's dogfood month

- `invoice_studio.monthly_cycle.started` with `cycleId=<CycleId>`, `month=YYYY-MM`.
- `invoice_studio.search` with populated filter dimensions — at least 10 occurrences across the month (search is heavily used).
- `invoice_studio.bulk_update` with `status in {Invoiced, Paid, SubcontractInvoiced, SubcontractPaid}` — at least one per status per month.
- `invoice_studio.csv_export` with `rowCount>0` — at least one per month.
- `invoice_studio.dashboard_viewed` — at least one per month.
- `invoice_studio.monthly_cycle.completed` with `cycleId=<CycleId>`, `fallback_to_legacy=false`.

### §9.2 Must NOT appear during the dogfood month

- Steward UserId opening legacy `/apex/InvoiceGenerationVF` or Aura `/lightning/n/InvoiceList*`.
- Direct DML on `InvoiceDetail__c.Status__c` by Steward UserId not routed through invoice-studio's ApiRoute handler (CreatedBy / LastModifiedBy audit on InvoiceDetail__c should show CloudIntegrationUser or similar routed-source for all invoice-studio writes).

### §9.3 SOQL after dogfood month

```sql
-- Every status transition in the month should be auditable to a Logger__c row
SELECT COUNT(Id) FROM Logger__c
WHERE Action__c LIKE 'invoice_studio.%' AND CreatedDate = THIS_MONTH

-- Status transitions on InvoiceDetail__c during the month
SELECT Status__c, COUNT(Id) FROM InvoiceDetail__c
WHERE SystemModStamp = THIS_MONTH GROUP BY Status__c

-- Hermes-published events
SELECT COUNT(Id) FROM MessageEvent__c
WHERE Source__c = 'invoice-studio' AND CreatedDate = THIS_MONTH
```

## §10 Execution plan

One EOS cycle, PRs on `olympus-grid/brain/2.7.x.x` and (if any React library extraction needed) `iris/brain/2.7.x.x`. All code — client Apex + React source + Plugin__mdt + static-resource bundle — lives in one folder: `olympus-grid/force-app/development/invoice-studio/`. No new repo. No new pipeline. The existing cp-biz source-deploy workflow deploys everything.

### E.0 — Platform-export surface audit + pipeline amendment (DO FIRST)

**E.0.1 — Audit:** enumerate each row of §7.2. For each: produce a short memo (one-paragraph status + gap-closing plan). File at `olympus-grid/docs/customer-app-authoring.md` (new).

Likely gap-closing sub-tasks if a wrapper isn't consumable:
- Publish `@olympus-grid/react-components` npm package (likely needs extraction from `iris/reactforce/portal/` common components).
- Publish `@olympus-grid/portal-auth` npm package.
- Publish `@olympus-grid/hermes-bus` npm package (client-side event-bus wrapper).
- Document how a client-example Apex handler registers via `Plugin__mdt`.
- Document how a client-example portal tile shows up at `beta.olympus-grid.com/portal/<app>`.
- Document the `force-app/development/<app>/` folder convention (new section in `docs/customer-app-authoring.md` that references `sfdc_site_samples` as the Apex prior-art and `invoice-studio` as the forthcoming React prior-art).

**E.0.2 — Pipeline amendment:** `olympus-grid/.github/workflows/deploy-push-cp-biz.yaml` needs a Node build step BEFORE the `sf project deploy start` step that walks every `force-app/development/*/scripts/build.sh` (if present) and runs it. This generalizes to every future client-example React app. Keep the Create / Verify / Annotate split-step shape — the Node build step slots in at the top of Create.

**Exit criterion:** every row of §7.2 shows `status=consumable`; the amended pipeline deploys a trivial "hello world" folder under `force-app/development/` to cp-biz in under 30 min end-to-end.

### E.1 — Scaffold `olympus-grid/force-app/development/invoice-studio/` folder

Create the folder shape described in §7.3:
- `default/customMetadata/Plugin.PortalTile_InvoiceStudio.md-meta.xml` — registers the admin-portal tile at route `/portal/invoice-studio` with label "Invoice Studio"
- `default/classes/` — empty stubs for the four `*ApiHandler.cls` + their `*Test.cls`
- `default/staticresources/invoice-studio.resource-meta.xml`
- `src-react/` — Vite + React + TypeScript scaffolding; `package.json` lists the `@olympus-grid/*` npm dependencies from E.0; initial `App.tsx` renders "Hello from the first olympus-grid React client-example."
- `scripts/build.sh` — `npm install && npx vite build && cp -r dist/ ../default/staticresources/invoice-studio/`
- `README.md` — a step-by-step "how to copy this folder to make the next client-example" guide (this IS the repeatable process; writing it down IS half the deliverable)

**Exit criterion:** after a merge to `olympus-grid/brain/2.7.x.x`, the invoice-studio tile appears in the cp-biz admin portal and loads a hello-world page at `beta.olympus-grid.com/portal/invoice-studio`.

### E.2 — Query + search + filter

- `InvoiceDetailListApiHandler` Apex: implements `GET /v1/invoice-details` (§8.1)
- Register via `Plugin.ApiRoute_InvoiceDetailList`
- React list page: table + search bar + filter chips + URL-synced state
- Pagination via cursor
- **Stretch:** saved views (named filter sets persisted per user)

**Exit criterion:** §2.2 passes — Steward can search + filter and the URL reflects state.

### E.3 — Mass-update

- `InvoiceDetailBulkPatchApiHandler` Apex: implements `PATCH /v1/invoice-details/bulk` (§8.2)
- Register via `Plugin.ApiRoute_InvoiceDetailBulkPatch`
- Hermes event emit on commit (`invoice_studio.bulk_update`)
- React: multi-select UI (checkbox column + "select all on page"), confirmation modal, per-row error reporting

**Exit criterion:** §2.3 passes — Steward can bulk-apply status transitions with confirmation.

### E.4 — CSV export

- Client-side CSV builder consuming the §8.1 list endpoint with pagination walk
- Column order matches QuickBooks import template (Steward provides template or lands a mock in E.0)
- Download trigger via `URL.createObjectURL` + anchor click

**Exit criterion:** §2.4 passes.

### E.5 — Status dashboard

- `InvoiceDetailReportsApiHandler` Apex: implements the four `GET /v1/invoice-details/reports/*` routes (§8.4)
- Register via `Plugin.ApiRoute_InvoiceDetailReports`
- React dashboard page with four panels (status counts, aging, revenue, pipeline)
- Progressive panel render (don't block whole page on slow panel)

**Exit criterion:** §2.5 passes — dashboard renders all-historical in ≤ 3 s p95.

### E.6 — Marketing-brochure polish

- SLDS token audit: typography, spacing, color
- Empty states, loading states, error states for every page
- Keyboard navigation audit (Tab order, Enter to confirm, Esc to cancel, Cmd+K for search)
- Four hero screenshots captured + attached to the cycle doc

**Exit criterion:** §2.7 passes — screenshots publishable to a brochure without rework.

### E.7 — Dogfood month

Steward runs one full monthly billing cycle on invoice-studio. No code. Capture:
- Session log excerpts matching §9.1 signatures.
- SOQL output per §9.3.
- Four hero screenshots refreshed with real monthly data.

**Exit criterion:** §2.8 passes.

### E.8 — Legacy retirement (Steward-controlled, non-destructive)

The legacy Aura/LWC "Create Invoices" tool is NOT auto-destructively-deployed. After the dogfood month, the Steward decides:
- Leave in place as backup, or
- Hide the legacy tab (orgPref flip), or
- Open a sibling destructive-deploy PR under explicit §5-equivalent approval.

**Exit criterion:** Steward's decision captured in §13 Closeout.

## §11 Verification protocol

### §11.1 Developer verification (dev scratch, before any cp-biz touch)

- Build the invoice-studio Vite bundle locally; run `npm run dev` with a local dev-mode JWT.
- Deploy the cp-biz-authored Apex to a `dev_enterprise` scratch (which carries test InvoiceDetail__c fixtures).
- Hit each ApiRoute via `curl` with the dev-mode JWT.
- Apex tests ≥ 75% per handler class (per fleet rule).

### §11.2 Pre-dogfood validation (`cp-biz-uat` sandbox)

- Deploy the whole stack to `cp-biz-uat`.
- Smoke-test every §2 criterion in order.
- Verify `cycleId` trace stitching across API → Logger → Hermes.
- Capture any §2 failure as a §13 note; patch; redeploy; retest.

### §11.3 Production dogfood (`cp-biz`)

- Deploy to cp-biz prod.
- Steward opens the tile in the admin portal, runs the month, documents in §13.

## §12 Rollback plan

### §12.1 Before dogfood month

- **Platform-wrapper exports (E.0):** additive; no rollback needed. If an export is bad, re-publish.
- **Scaffolded `olympus-grid/force-app/development/invoice-studio/` folder (E.1+):** folder is self-contained; abandon via `git rm -r` on the folder and `.forceignore` entry if a half-written state remains in-tree.
- **cp-biz-authored ApiRoute handlers:** unused if the portal tile is not registered. Rollback = remove the `Plugin.PortalTile_InvoiceStudio` record and the tile disappears from the admin portal.

### §12.2 Mid-dogfood (something breaks for the Steward)

- **Hide the tile** via Plugin__mdt disable flag. Steward falls back to legacy Aura/LWC "Create Invoices" tool, which has not been touched.
- **Audit Logger__c** for the broken state transition; `InvoiceDetail__c.LastModifiedBy` identifies which path wrote which record.
- Diagnose, patch, re-attempt the following month.

### §12.3 Post-dogfood

- No destructive action is scheduled. The legacy tool stays available indefinitely unless the Steward explicitly retires it in §10 E.8.
- Reversibility: full. If invoice-studio proves wrong-shaped, the Steward uses the legacy tool next month and we iterate.

---

## §13 Closeout

Filled at end of cycle. Doc goes immutable after this.

### What shipped
- …

### What deferred (and why)
- …

### What surprised
- …

### Verification evidence
- Hero screenshots: list + search, mass-update modal, CSV export flow, dashboard.
- Session log excerpts matching §9.1.
- SOQL output per §9.3.
- Link to the shipped `olympus-grid/force-app/development/invoice-studio/` folder (first merged commit SHA) + the deploy-run that landed it in cp-biz.

### Feedback that emerged from THIS cycle (seed for the next)
- …

### Memory updates
- Update `cloudpremise/cloudpremise-sf-biz/ARCHITECTURE.md` — correct the §10 Wave C1 framing (business domain stays customer-side; client-example React apps live inside `olympus-grid/force-app/development/*/` as unmanaged bridge siblings to `sfdc_site_samples`). Add a cross-reference to this cycle.
- New memory `project_client_example_folder_pattern.md` documenting the `olympus-grid/force-app/development/<app>/` folder convention: `default/{classes,customMetadata,staticresources}/` for the SF-side, `src-react/` for the inspectable source, `scripts/build.sh` for the Vite build, `.forceignore` guaranteeing nothing in `development/` ever ships in the managed package. Pattern reusable for every subsequent client-example React app.
- Update `olympus-grid/docs/customer-app-authoring.md` — the authoritative client-example authoring guide, produced in E.0.
- New memory `project_first_react_client_example_invoice_studio.md` capturing the marketing-brochure framing, the dogfood-month attestation pattern, and the sibling-cycle hand-off (`time-card` next React client-example).
- Update `.eos/cards.json` pitch if the final shape differs materially from "Our invoicing, built the way customers will build theirs."

### Cycle close commit
- Branch / PR link — …
- Steward sign-off: **___** **_______**
