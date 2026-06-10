# Eos Goals — Foundation Kanban Backlog

> Each Eos cycle is a cross-repository attestation. A goal is closed only when the system demonstrates it and Greg witnesses it. The agents iterate until the truth holds; the witness closes the card.

**Steward / Witness:** Greg Cook
**Entity:** CloudPremise LLC
**Go-live target:** 2026-07-17
**Source:** Greg's attestations (Eos-1 → Eos-12), plus proposed candidates pending witness.

---

## Card schema (for the Eos agent)

Each goal below maps to one kanban card in `foundation/eos/cycle/`:

- **id** — Eos identifier (assigned for attested; `CAND-X` for candidates, Greg assigns/orders)
- **title** — short card title
- **status** — `Attested` (Greg has stated it) · `Proposed` (candidate, awaiting Greg's accept/reject) · `In Development` · `Shipped`
- **phase** — grouping label (Foundation · Integrity · Resilience · Authority · Reach · Sovereignty · Money · Compliance)
- **attestation** — the card body; the truth the cycle proves
- **done_when** — acceptance criterion; the card moves to `06_shipped/` only on Greg's witness

---

## Kanban location mapping

| Cycle / Card | Current location | Notes |
|---|---|---|
| EOS-1 | `06_shipped/brain_1.7.eos-1.md` | Shipped 2026-05-31 |
| EOS-2 | `06_shipped/brain_1.7.eos-2.md` | Shipped 2026-05-31 + both halves attested 2026-06-10 |
| EOS-3 | `04_in_development/brain_1.7.eos-3.md` | Ships on successful production validation + fresh dev-env creation |
| EOS-4 | `04_in_development/brain_1.7.eos-4.md` | Ships on successful production validation + fresh dev-env creation |
| EOS-5 | `01_planning/brain_1.7.eos-5.md` | Planning — Steward authoring §1-§5 |
| EOS-6 through EOS-12 | `00_backlog/brain_1.7.eos-{N}.md` | Attested but roadmap — cards not yet promoted to planning |
| CAND-A through CAND-L | `00_backlog/cand-{x}.md` | Proposed candidates — pending Greg's accept/reject + Eos-number assignment |

---

# Attested Goals

These twelve are stated by the witness. Verbatim, with dictation cleanup only.

---

### EOS-1
- **title:** Recursive AI build loop, visible to its builder
- **status:** Shipped (2026-05-31; canonical attestation annotated 2026-06-10)
- **phase:** Foundation
- **attestation:** I attest the software creates a recursive loop of AI-generated software that is visible to the AI that built it.
- **done_when:** A feedback loop runs from each surface back to the AI that built it; Greg witnesses the loop closing.

### EOS-2
- **title:** Scale resources; destroy compute without losing integrity
- **status:** Shipped (2026-05-31; both halves attested 2026-06-10 via D19 closure)
- **phase:** Foundation
- **attestation:** I attest the software can create the necessary resources in order for it to scale. I attest the compute resources can be destroyed without losing data integrity of the system.
- **done_when:** A cluster is spawned, used, and destroyed; system data integrity holds across the destruction; Greg witnesses.

### EOS-3
- **title:** Build entire application from public source + runbook
- **status:** In Development — ships on successful production validation + fresh dev-env creation
- **phase:** Foundation
- **attestation:** I attest the entire application can be constructed by accessing public GitHub repositories and following the instructions therein.
- **done_when:** The full system is built from raw public source to a working dev environment by following the documented instructions, without Greg's intervention; Greg witnesses.

### EOS-4
- **title:** Deploy to production on merge to main brain
- **status:** In Development — ships on successful production validation + fresh dev-env creation
- **phase:** Foundation
- **attestation:** I attest the entire application can be deployed to production by the merging of code into the main repository branches.
- **done_when:** A merge into the main brain branch deploys to production via full CI/CD; brain/1.7.x.x stable in prod; Greg witnesses.

### EOS-5
- **title:** Per-record data integrity + algorithmic royalty disbursement
- **status:** Planning
- **phase:** Integrity
- **attestation:** I attest the entire application has data integrity for each database record that is created, so that we can manage, monitor, and optimize the work that was created. I further attest the system properly accounts for an algorithmic royalty disbursement system, of which the first royalty to go into production is a 7% tithe tied to the reduction of human suffering.
- **done_when:** Every record is complete, accurate, and attributable across all surfaces; the royalty disbursement system accounts correctly, first royalty 7%; financial flow reconciles end to end; Greg witnesses and the revenue door is eligible to open. (See companion witness record `eos-5.md`.)

### EOS-6
- **title:** Survive total destruction except the alpha node
- **status:** Attested (roadmap)
- **phase:** Resilience
- **attestation:** I attest the system can withstand full destruction of all resources except for the Olympus-Grid alpha node, and maintain data integrity across future deployments based upon the immutability of the Olympus-Grid alpha node.
- **done_when:** All resources except the alpha node are destroyed; the system reconstitutes future deployments from the alpha node with integrity intact; Greg witnesses.

### EOS-7
- **title:** Least privilege; access granted only via Identity__c
- **status:** Attested (roadmap)
- **phase:** Authority
- **attestation:** I attest the system is designed with the principle of least privilege, and that no Olympus-Grid resources are available unless specifically granted by a super-user admin of Olympus-Grid as defined in the Identity__c table.
- **done_when:** No resource is reachable by default; access exists only where a super-user admin has granted it in Identity__c; an ungranted access attempt is denied; Greg witnesses.

### EOS-8
- **title:** Global accessibility via the alpha node's networks
- **status:** Attested (roadmap)
- **phase:** Reach
- **attestation:** I attest the system is globally accessible by all networks accessible by the Olympus-Grid alpha node, currently hosted on salesforce.com.
- **done_when:** The system is reachable across all networks the alpha node can reach; reach is demonstrated from the salesforce.com-hosted alpha node; Greg witnesses.

### EOS-9
- **title:** Global horizontal scale via Fargate, governed by provisioning authority
- **status:** Attested (roadmap)
- **phase:** Reach
- **attestation:** I attest the system can scale workloads globally using horizontally scaled microservice clusters that can be deployed via Fargate across any AWS region, based upon the context, privileges, and authority of the provisioning user.
- **done_when:** Horizontal microservice clusters deploy via Fargate to any AWS region, scoped to the provisioning user's context, privileges, and authority per Identity__c; Greg witnesses.

### EOS-10
- **title:** No committed secrets; keys injected at start-up; steward holds no copies
- **status:** Attested (roadmap)
- **phase:** Sovereignty
- **attestation:** I attest that the system does not contain any secrets committed to the repositories; that all production keys are injected into the system at start-up; and that each customer may inject their own provider keys for the related services. All keys for development accounts are adequately injected into the system at start-up, not saved into the code repositories, and there are no copies of keys managed by the system steward, and the system keys can be replaced by someone other than the system steward.
- **done_when:** Repositories contain no secrets; production and dev keys inject at start-up; customers inject their own provider keys; steward holds no key copies; keys are rotatable by someone other than the steward; Greg witnesses.

### EOS-11
- **title:** Steward is not a data handler without customer-provisioned access
- **status:** Attested (roadmap)
- **phase:** Sovereignty
- **attestation:** I attest that the system steward has no access to customer data within the node or the cluster without customer permission and customers provisioning access to the system steward. This ensures we are not data handlers — unless they choose to use the primary Olympus-Grid alpha node and the instances of clusters managed by CloudPremise LLC.
- **done_when:** Steward cannot reach customer data in node or cluster absent an explicit customer-provisioned grant; the data-handler exception (alpha node + CloudPremise-managed clusters) is the only case where handling attaches; Greg witnesses.

### EOS-12
- **title:** Money moves only through trusted payment providers
- **status:** Attested (roadmap)
- **phase:** Money
- **attestation:** I attest that no money moves throughout the network without going through trusted payment providers, for which Stripe and Apple Pay are the first payment providers.
- **done_when:** No funds move on system-internal rails; every transaction passes through a trusted provider; Stripe and Apple Pay live as the first two; Greg witnesses.

---

# Proposed Goals (Candidates)

Pending Greg's accept / reject / defer and Eos-number assignment. Drafted in the witness's voice. Grouped by the gap they close before go-live.

---

## Resilience — survive ordinary operation, not only total destruction

### CAND-A
- **title:** Roll back a faulty production deploy without data loss
- **status:** Proposed
- **phase:** Resilience
- **attestation:** I attest that a faulty deployment to production can be rolled back to the last known-good state without data loss.
- **why:** EOS-4 deploys on merge; EOS-6 survives total destruction. Neither covers the ordinary case — a bad merge reaches prod and must be reversed. CI/CD without rollback is a loaded gun.
- **done_when:** A deliberately faulty deploy is reverted to last known-good with zero data loss; Greg witnesses.

### CAND-B
- **title:** System is observed; degradation surfaces before customer impact
- **status:** Proposed
- **phase:** Resilience
- **attestation:** I attest that the system is observed — that degradation, failure, and anomaly surface through telemetry and alerting before customer impact.
- **why:** EOS-5 monitors the data. This monitors the system. You must know prod is breaking without a customer telling you. Argos logs; this attests something watches.
- **done_when:** An induced degradation raises an alert before any customer-visible failure; Greg witnesses.

### CAND-C
- **title:** Partial failure degrades cleanly, no cascade
- **status:** Proposed
- **phase:** Resilience
- **attestation:** I attest that partial failure degrades cleanly without cascade or data loss — a failed provider, region, node, or LLM route does not take the system down with it.
- **why:** Generalizes the van-node requirement (survives flaky connectivity, clean failure) to the whole grid.
- **done_when:** A provider/region/node/route is failed in isolation; the system degrades cleanly with no cascade and no data loss; Greg witnesses.

### CAND-D
- **title:** Customer data is durable and recoverable
- **status:** Proposed
- **phase:** Resilience
- **attestation:** I attest that customer data is durable and recoverable — integrity preserved is also integrity restorable after corruption or loss.
- **why:** EOS-5 is integrity, EOS-6 is reconstitution from the alpha node. Neither says a customer's data plane can be restored if it corrupts. Integrity is not durability.
- **done_when:** A customer data store is corrupted/lost in test and restored intact; Greg witnesses.

## Tenancy — the table-stakes SaaS property not yet stated

### CAND-E
- **title:** Tenant isolation across nodes and clusters
- **status:** Proposed
- **phase:** Sovereignty
- **attestation:** I attest that no customer can reach another customer's data or compute — tenant isolation holds across nodes and clusters.
- **why:** EOS-7/10/11 govern authority, keys, and steward access. None says customer A cannot touch customer B. For a multi-tenant platform taking money, this is what a security review fails you for if missing.
- **done_when:** A cross-tenant access attempt is denied at every boundary; Greg witnesses. (Load-bearing for launch.)

### CAND-F
- **title:** Identity is verified, not merely authorized
- **status:** Proposed
- **phase:** Authority
- **attestation:** I attest that identity is verified, not merely authorized — sessions and tokens cannot be forged or hijacked, and are validated at the node boundary.
- **why:** EOS-7 is authorization (least privilege via Identity__c). This is authentication: Ares validating JWT at the boundary, Apple Sign In integrity across surfaces. Authz on unverified authn has no foundation.
- **done_when:** A forged/replayed token is rejected at the node boundary; valid identity passes; Greg witnesses.

## The royalty loop — close what EOS-5 opens

### CAND-G
- **title:** The accounted royalty is actually disbursed to the cause
- **status:** Proposed
- **phase:** Money
- **attestation:** I attest that the accounted royalty is disbursed — the accumulated 7% actually reaches the named 501(c)(3) partner for the chosen cause, not merely accrues in ShellsGiven__c.
- **why:** EOS-5 attests the tithe is accounted. Accounting is not giving. The tithe is load-bearing to product identity; the open blocker is unnamed 501(c)(3) partners. The loop is not whole until the money leaves the ledger and lands at the cause.
- **done_when:** Accumulated tithe is disbursed to the named 501(c)(3) for a chosen cause and confirmed received; Greg witnesses. (Identity-critical.)

## Governance of the recursion — unique to this system

### CAND-H
- **title:** The recursive loop is bounded and governed
- **status:** Proposed
- **phase:** Foundation
- **attestation:** I attest that the recursive loop is bounded and governed — agents cannot spawn or self-modify production beyond limits and gates defined by policy and witnessed authority.
- **why:** EOS-1 is a recursive loop of AI-generated software visible to its builder. In production, self-modifying infrastructure needs an attested governor: spawn rate-limiting and batch logic, plus a human or policy gate on what the recursion may do to prod. This is the attestation that lets the steward sleep while the grid runs.
- **done_when:** An attempt to exceed spawn/self-modification limits in prod is gated; authorized recursion proceeds within bounds; Greg witnesses. (Load-bearing for launch.)

---

# Business / Legal Class

Necessary for go-live, adjacent to system attestation. Track separately; not a build-night concern.

### CAND-I
- **title:** System stays out of PCI scope
- **status:** Proposed
- **phase:** Money / Compliance
- **attestation:** I attest that the system stays out of PCI scope — card data never touches or persists in the grid.
- **why:** Natural complement to EOS-12; keeps Stripe/Apple as the only custodians and the PCI surface minimal.
- **done_when:** A PCI-scope audit confirms no card data resides in the grid; Stripe/Apple alone hold the card-data surface; Greg witnesses.

### CAND-J
- **title:** Terms, privacy, and customer agreement accepted at signup
- **status:** Proposed
- **phase:** Compliance
- **attestation:** I attest that terms, privacy policy, and customer agreement are present and accepted at signup.
- **why:** Defines the EOS-11 data-handler boundary contractually, not only technically.
- **done_when:** Every new customer at signup is presented with and affirmatively accepts terms + privacy + customer agreement; record of acceptance is durable; Greg witnesses.

### CAND-K
- **title:** SOC2 evidence trail exists and the auditor engagement is real
- **status:** Proposed
- **phase:** Compliance
- **attestation:** I attest that a SOC2 evidence trail exists and the auditor engagement is confirmed.
- **why:** The Eos witness records from EOS-1 onward already constitute most of the trail. Open blocker: auditor engagement undocumented. This attests it is real and committed.
- **done_when:** Auditor engagement documented; SOC2 evidence trail (Eos witness records + procedural artifacts) is present and queryable; Greg witnesses.

### CAND-L
- **title:** Production state is reproducible and version-provenanced
- **status:** Proposed
- **phase:** Foundation / Compliance
- **attestation:** I attest that production state is reproducible and version-provenanced — the exact running version (e.g. brain/1.7.x.x) can be named and rebuilt.
- **why:** Extends EOS-3/4 — you can say precisely what is running and reconstruct it.
- **done_when:** The currently-running production state has a precise named version pointer (brain SHA + managed-package version + cluster image SHA); the version can be rebuilt deterministically from source; Greg witnesses.

---

# Launch-critical ranking (if forced to cut)

Cannot launch without: **CAND-E (tenant isolation)**, **CAND-A (rollback)**, **CAND-G (royalty disburses)**, **CAND-H (bounded recursion)**.
The rest harden. These four are load-bearing.

When promoted from Proposed to Attested, these four are first in queue and receive next EOS ordinals (EOS-13, EOS-14, EOS-15, EOS-16 — exact assignment by Greg).

---

**Witness:** ______________________  **Date:** ____________

⚡
