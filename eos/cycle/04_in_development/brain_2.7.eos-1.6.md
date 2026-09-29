# Zeus HUD W5 + W7b — WAF hardening + origin secret metadata

> File: `brain_2.7.eos-1.6.md` — **sixth sub-attestation of `brain_2.7.eos-1`** (hostile-universe defense). Peer of `eos-1.1` (ares), `eos-1.2` (hermes), `eos-1.3` (plutus HUD W2), `eos-1.4` (olympus-grid W1), `eos-1.5` (parent coordinator). Slices the **zeus** leg.
>
> Source: Steward-provided zeus open-work summary 2026-09-25.

| | |
|---|---|
| **Branch family** | `brain/2.7.x.x` |
| **Cycle ordinal** | `eos-1.6` — sixth per-repo sub-attestation of `brain_2.7.eos-1` (HUD umbrella). |
| **Status** | `In Development` — reconciliation cycle. PR #45 open since 2026-07-24, last updated 2026-08-23 (~2 months stale as of 2026-09-25); no reviews; no labels. **Stalled awaiting Steward attention.** Steward verbal §5 ratification 2026-09-25 via direction to open the ticket. Formal §5 checkboxes pending. |
| **Opened** | 2026-09-25 |
| **Closed** | — |
| **Prior cycle** | `brain_2.7.eos-1` (HUD umbrella; §6.A W5+W7b row names zeus #45) |
| **Theme** | W5 (L8/L9-anon/L11) — three WAF rules on the shared WebACL (`RateLimit-Coarse-5min`, `AWSManagedRulesAnonymousIpList`, `AWSManagedRulesBotControlRuleSet` COMMON tier); all BLOCK-mode day one. W7b (L14 SF-side wiring) — `scripts/cluster.sh` writes origin-secret metadata (ARN + version + SHA-256 fingerprint) to `Cluster__c` via anonymous Apex; raw secret never leaves Secrets Manager. Follow-up commit `7bafd02` writes bare `Domain__c` host instead of full `EndpointUrl__c`. **L10 (per-cluster IPSet WAF enforcement) explicitly deferred** — separate follow-up. |
| **Feedback inputs** | Steward summary 2026-09-25; PR #45 body; HUD sealed design v2.3 (`hostile-universe-defense-design-v2.3-SEALED-2026-07-23.md`); motivating incident 2026-07-17 $131B AWS billing alert; sibling attestations (ares 1.1, hermes 1.2, plutus 1.3, olympus-grid 1.4, parent 1.5) |
| **Estimated effort** | Implementation landed (3 commits ahead of `brain/1.7.x.x` at snapshot); Steward review pending; coordinated merge with olympus-grid W1 + plutus W2 + ares W3+W4. |
| **Actual effort** | — |

---

## Discipline principle

> *WAF Bot Control is BLOCK-mode day one for a pre-user platform — trading tuning latency for adversarial-cost reduction. Bot Control adds ~$10/mo + $1/M requests; this cost is bounded and known. The motivating incident is the 2026-07-17 $131B AWS billing alert; further tuning is a launch-window concern, not a pre-launch concern. **W7b writes ARN + version + SHA-256 fingerprint to Salesforce; the raw secret NEVER crosses to Salesforce.** Storage location is Secrets Manager, retrieved by ares at request time; SF holds only the metadata triplet.*

---

# § Steward-authored (top half)

## Canonical attestation statement

> *"I attest that zeus PR #45 lands W5 (three WAF rules on the shared WebACL, all BLOCK-mode day one: `RateLimit-Coarse-5min` at 5000 req / 5min / IP, `AWSManagedRulesAnonymousIpList` for Tor/VPN/hosting exits, `AWSManagedRulesBotControlRuleSet` COMMON tier) and W7b (`scripts/cluster.sh` writing origin-secret metadata — ARN + version=1 + SHA-256 fingerprint — to `Cluster__c` via anonymous Apex, with the raw secret never crossing to Salesforce); that the follow-up commit `7bafd02` writes bare `Domain__c` host instead of full `EndpointUrl__c` matching Wave 2 domain refactor across the fleet; that soft-fail behavior when olympus-grid W7a fields don't yet exist is intentional; that L10 (per-cluster IPSet enforcement) is explicitly deferred to a separate follow-up cycle; and that the coordinated merge with olympus-grid #345 (W1) + plutus #42 (W2) + ares #66 (W3+W4) + hermes #62 (§11.5) + parent #198 (coordinator) holds per HUD umbrella §10.2."*

## §1 User story

- **§1.1** As **the fleet's edge-cost defense** I want **three WAF rules on the shared WebACL in BLOCK-mode day one** so that **coarse rate abuse, Tor/VPN/hosting-origin traffic, and automated-browser bots are refused at the edge before request-processing metered cost accrues**.
- **§1.2** As **the L14 SF-side origin-secret wiring** I want **`scripts/cluster.sh` writing the ARN + version + SHA-256 fingerprint triplet to `Cluster__c`** so that **`Cluster__c.OriginSecretFingerprint__c` (populated by olympus-grid W7a) has a real value at cluster-provisioning time — ares can compare inbound `X-Origin-Secret` header hashes against it**.
- **§1.3** As **the follow-up domain-refactor discipline** I want **`cluster.sh` writing bare `Domain__c` host (not the full `EndpointUrl__c`)** so that **the L7-identity rename (matching plutus 1.3 + ares 1.1 + olympus-grid 1.4 Wave 2) holds atomically across the six-PR cascade**.
- **§1.4** As **the Steward reviewing a 2-months-stale PR** I want **the coordinated merge picked up now** so that **the six-PR HUD cascade does not have zeus as the trailing blocker**.

## §2 Acceptance criteria

### §2.A W5 — WAF rules

- **§2.1 (`RateLimit-Coarse-5min` BLOCK-mode)** — 5000 req / 5min / source IP on the shared WebACL. Matches HUD umbrella §9.HUD-1.
- **§2.2 (`AWSManagedRulesAnonymousIpList` BLOCK-mode)** — Tor exit / VPN / hosting-cloud origin BLOCKed at edge. Matches HUD §9.HUD-2.
- **§2.3 (`AWSManagedRulesBotControlRuleSet` COMMON tier BLOCK-mode)** — automated-browser / non-browser UA classifications BLOCK at edge. Day-one BLOCK; tuning deferred to launch-window follow-up cycle.

### §2.B W7b — SF-side origin-secret wiring

- **§2.4 (`cluster.sh` writes fingerprint triplet)** — ARN + version=1 + SHA-256 fingerprint written to `Cluster__c.OriginSecretRef__c` / `OriginSecretVersion__c` / `OriginSecretFingerprint__c` via anonymous Apex. Verified against olympus-grid W7a (per olympus-grid 1.4 §2.3).
- **§2.5 (Raw secret never crosses to Salesforce)** — grep of Salesforce audit trail + `cluster.sh` output for raw-secret value returns zero hits. Matches HUD §9.HUD-8.
- **§2.6 (Soft-fail on missing W7a fields)** — `cluster.sh` returns non-zero-but-tolerable when W7a fields don't yet exist (pre-merge-order scenario); does NOT crash the provisioning script.

### §2.C Domain-refactor coherence

- **§2.7 (bare `Domain__c` host, not `EndpointUrl__c`)** — commit `7bafd02` matches Wave 2 domain refactor; `cluster.sh` writes `example.com` (not `https://example.com`).

### §2.D Coordinated merge (per HUD §10.2)

- **§2.8 (HUD §10.2 step 3 — parallel with plutus)** — zeus #45 + plutus #42 merge in parallel after olympus-grid #345 (W1). Both are independent.
- **§2.9 (Follows olympus-grid W1)** — cannot merge before W7a fields land on `Cluster__c` (per soft-fail semantics §2.6).

### §2.E Deferrals

- **§2.10 (L10 explicitly deferred)** — per-cluster IPSet WAF enforcement is NOT in this PR. Follow-up cycle required before HUD v2.3 can be called fully complete. Filed in FOLLOW-UPS.

## §3 Non-functional requirements

- **§3.1 (BLOCK-mode day one intentional)** — Bot Control tuning is a launch-window cycle. Pre-launch: block-first.
- **§3.2 (Bot Control cost bounded)** — ~$10/mo + $1/M requests. Documented; not silent.
- **§3.3 (Raw secret never persists to SF)** — enforced by `cluster.sh` design: secret generated in Secrets Manager, fingerprint computed locally, only metadata written to SF.
- **§3.4 (Shared WebACL discipline)** — W5 rules on the SHARED WebACL (all clusters). L10 (per-cluster IPSet) would move to per-cluster WAFs OR path-conditional rules on the shared WebACL; unresolved design choice, deferred.

### §3.A Standing zeus TODO (carried in CLAUDE.md)

- **§3.5 (Edge stack export dependency)** — CloudFormation edge stack has a stuck export that CDN/DNS references, blocking clean updates to edge exports. Workaround today: don't modify edge stack exports. **Needs real remediation plan on the board.** Filed in FOLLOW-UPS as its own ticket candidate.

## §4 Feedback inputs

| FB# | Title | Body excerpt |
|-----|-------|--------------|
| — | Steward zeus summary 2026-09-25 | PR #45 status, cross-repo train, deferrals, standing edge-stack TODO |
| — | PR #45 body | Bundled W5 + W7b + follow-up commit `7bafd02` (domain rename); risk MEDIUM (WAF BLOCK-mode day one + Bot Control cost) |
| — | HUD sealed design v2.3 | Correction 5 (BLOCK-mode day one); Post-Seal 3 (domain rename) |
| — | Motivating incident 2026-07-17 | $131B AWS billing alert |
| — | Sibling per-repo attestations | HUD 1.1 – 1.5 |
| — | zeus/CLAUDE.md standing TODO | Edge stack export dependency; workaround only, no fix |
| — | Recently closed PRs #46, #47 | Pre-2.7 transition attempts; cosmos-logos-poseidon-key branch abandoned. If those 3 commits / 2 files still wanted → new EOS item. |

## §5 Steward approval gate

- [ ] Discipline principle acknowledged
- [ ] Canonical attestation statement locked
- [ ] Story locked (§1.1 – §1.4)
- [ ] Acceptance criteria locked (§2.1 – §2.10)
- [ ] NFRs locked (§3.1 – §3.5)
- [ ] **Bot Control cost acknowledged** (~$10/mo + $1/M requests)
- [ ] **HUD §10.2 coordinated merge sequence confirmed** — zeus + plutus parallel after olympus-grid W1
- [ ] **L10 deferred to follow-up cycle** acknowledged
- [ ] **Edge-stack export dependency workaround** acknowledged
- [ ] Approved to execute — signed: **__________** **__________**

---

# § Agent-authored (bottom half)

## §6 Layer impact map

| Criterion | zeus | olympus-grid | ares |
|---|---|---|---|
| W5 WAF rules | `cdk/lib/edge-global-stack.ts` | — | edge WAF sits ahead of ares |
| W7b origin-secret metadata | `scripts/cluster.sh` writes triplet to Cluster__c via anonymous Apex | Cluster__c W7a fields (per olympus-grid 1.4) | reads OriginSecretFingerprint__c per ares 1.1 §2.4 |
| Domain rename | `cluster.sh` writes bare `Domain__c` | Cluster__c.Domain__c (per olympus-grid 1.4 Wave 2) | reads Domain__c per ares 1.1 §2.5 |
| L10 deferred | future PR | — | — |
| Edge-stack TODO | zeus workaround; no fix in this PR | — | — |

## §7 Schema deltas

Per HUD umbrella §7.1: zeus writes to Cluster__c fields (defined by olympus-grid W7a). W5 defines three new WAF rules on the shared WebACL (CDK stack).

## §8 Service contracts

Per HUD umbrella §8.3: WAF rules at edge; `cluster.sh` writes fingerprint triplet.

## §9 Telemetry assertions

Contributes to HUD umbrella §9.HUD-1, §9.HUD-2, §9.HUD-8. Plus zeus-specific:

- **§9.ZEU-1** — All three WAF rules present + BLOCK-mode in `cdk/lib/edge-global-stack.ts`.
- **§9.ZEU-2** — `cluster.sh` execution on a fresh cluster provisions Cluster__c fingerprint triplet; verified by SOQL post-provision.
- **§9.ZEU-3** — Raw-secret grep on Secrets Manager audit + SF audit for the provisioned window returns zero hits.
- **§9.ZEU-4** — `cluster.sh` soft-fails cleanly when W7a fields absent (pre-merge-order path).

## §10 Execution plan

1. **§5 rulings signed** — Bot Control cost + L10 deferral + edge-stack workaround acknowledged.
2. **Coordinated merge per HUD §10.2** — olympus-grid #345 W1 lands first → zeus #45 + plutus #42 in parallel step 3 → ares #66 after → hermes #62 no later than ares.
3. **CDK deploy** on zeus #45 merge — updates shared WebACL with three new rules.
4. **Provision-time smoke** — next cluster provisioned via `cluster.sh` writes fingerprint triplet; verify via SOQL.
5. **§13 closeout** — link merged SHA + CDK deploy log + first fingerprint-triplet-written cluster.
6. **Open L10 follow-up cycle** — per-cluster IPSet enforcement (deferred here).
7. **Open edge-stack-remediation follow-up cycle** — for the standing TODO.

## §11–§12 Verification + rollback

Verification: CDK deploy plan review; provision-time SOQL post-`cluster.sh`; raw-secret grep audit.

Rollback: revert PR #45 → CDK re-deploys prior WebACL state (removes 3 rules) + `cluster.sh` reverts to prior write shape. Non-revertable: written Cluster__c triplet rows are metadata; historical values preserved.

## §13 Closeout

*Filled at end of cycle.*

Feedback candidates: BLOCK-mode day-one impact on real-user acquisition (adjust in launch-window cycle); L10 design (per-cluster WAF vs. path-conditional shared WebACL); edge-stack export dependency remediation approach.

---

## References

- **Umbrella cycle:** [`brain_2.7.eos-1.md`](brain_2.7.eos-1.md) — HUD; §6.A W5+W7b row names zeus #45.
- **Sibling per-repo attestations:** [`brain_2.7.eos-1.1.md`](brain_2.7.eos-1.1.md) ares · [`brain_2.7.eos-1.2.md`](brain_2.7.eos-1.2.md) hermes · [`brain_2.7.eos-1.3.md`](brain_2.7.eos-1.3.md) plutus HUD W2 · [`brain_2.7.eos-1.4.md`](brain_2.7.eos-1.4.md) olympus-grid W1 · [`brain_2.7.eos-1.5.md`](brain_2.7.eos-1.5.md) parent
- **Zeus PR #45:** [`feat(zeus): W5 + W7b — WAF hardening + origin secret metadata (hostile-universe-defense v2.3)`](https://github.com/olympus-616/zeus/pull/45)
- **HUD sealed design canon:** `olympus-grid/docs/hostile-universe-defense-design-v2.3-SEALED-2026-07-23.md`
- **Motivating incident:** 2026-07-17 $131B AWS billing alert.
- **Recently closed pre-2.7 attempts:** #46 · #47 (cosmos-logos-poseidon-key preservation — abandoned)
- **Standing TODO:** edge-stack export dependency — carried in `zeus/CLAUDE.md`; filed in FOLLOW-UPS.
- **EOS operating manual:** [`../README.md`](../README.md)
