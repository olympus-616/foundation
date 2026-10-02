---
pitch: "Close the anon Stripe subscription-status leak"
---

# I attest that no route in plutus returns subscription state, metering state, or payment state to an unauthenticated caller.

> File: `brain_2.7.eos-12.md`
>
> **Ordinal collision note (2026-10-02):** This card was originally pitched by the Steward as `brain_2.7.eos-11`. Ordinal 11 had already been taken by the env-loader planning stub (`01_planning/brain_2.7.eos-11.md`, merged to brain in PR #85 as commit `d410bf9`). This card takes the next free primary ordinal (`eos-12`), and the MeteringEvent + event-vocabulary cards shift to `eos-13` + `eos-14` respectively.
>
> **Scope origin:** PR #42 (plutus) delta-analysis 2026-10-02. The twin cards `brain_1.7.eos-5.10` + `brain_2.7.eos-1.3` stay narrowly scoped to what PR #42 delivers; this card absorbs the live auth-exposure delta that is NOT covered by those twins. The exposure was verified open on brain tip on 2026-10-02 — `grep -n "subscription-status" plutus/api/src/routes/stripe.ts` → line 685 `router.get('/stripe/subscription-status/:shellId', json(), async (req, res) => {` has no auth middleware ahead of the body-parser.

| | |
|---|---|
| **Branch family** | `brain/2.7.x.x` |
| **Cycle ordinal** | `eos-12` (twelfth primary on 2.7 family; hotfix) |
| **Status** | `Draft — Pre-§5.` Hotfix for live auth exposure verified on brain tip 2026-10-02 (`plutus/api/src/routes/stripe.ts:685`). §1–§5 Steward-authored; §6–§13 agent-authored below. **DO NOT TICK §5 FROM AGENT SIDE.** |
| **Opened** | 2026-10-02 |
| **Closed** | — |
| **Prior cycle** | `brain_2.7.eos-11` (env-loader standardization — unrelated; preceded this one in the ordinal shuffle only) |
| **Theme** | Hotfix: close the unauthenticated Stripe `subscription-status` route in plutus; one-criterion-wide scope on purpose |
| **Feedback inputs** | 2026-10-02 EOS inventory + PR #42 scope-delta analysis + direct grep of `plutus/api/src/routes/stripe.ts:685` confirming no auth middleware ahead of `json()` body parser |
| **Estimated effort** | ~1h (middleware add + three verification curls + one-commit PR) |
| **Actual effort** | — |

---

# § Steward-authored (top half)

## §1 User story

> *Steward placeholder — edit when §5-ratifying:*
>
> As the **Steward** I want **the public plutus surface to carry zero unauthenticated reads of billing or metering state** so that **identity gating holds end-to-end**.

## §2 Acceptance criteria

- §2.1 *Steward placeholder — edit when §5-ratifying:*
  **Given** a request to `/stripe/subscription-status/:shellId` with no cookie / no JWT / no `CF_SECRET`, **when** it hits the plutus route layer, **then** the response is `401` **and** the access log carries a `plutus.auth.denied` event with `route=subscription-status`.

## §3 Non-functional requirements

- **Latency budget:** no change (auth middleware adds <1ms per request).
- **Cost budget:** zero marginal cost.
- **Observability:** every denied request emits `plutus.auth.denied` with `route`, `remote_addr_hash`, `reason` (one of `no_cookie` / `no_jwt` / `no_cf_secret` / `invalid`).
- **Compatibility:** any authenticated caller (session cookie, JWT, or CF_SECRET) continues to see the same 200 payload shape as pre-fix. No downstream UI change.
- **Privacy:** do not log the raw cookie / JWT / CF_SECRET on denial; log only reason + hashed remote identifier.

## §4 Feedback inputs

| Source | Signal |
|---|---|
| 2026-10-02 EOS inventory | PR #42 scope-delta analysis surfaced the exposure as NOT covered by twins |
| `grep -n "subscription-status" plutus/api/src/routes/stripe.ts` (2026-10-02) | Line 685 confirms route uses only `json()` body parser — no auth middleware ahead of handler |
| Adjacent plutus routes in the same file | Already apply the standard auth middleware; this handler is the odd one out |

## §5 Steward approval gate

- [ ] Story locked
- [ ] Criteria locked
- [ ] NFRs locked
- [ ] Approved to execute — signed: **___** **___**

---

# § Agent-authored (bottom half)

## §6 Layer impact map

| Criterion | plutus | Everything else |
|---|---|---|
| §2.1 (401 on unauthenticated subscription-status) | `plutus/api/src/routes/stripe.ts` — add the project-standard auth middleware ahead of the `router.get('/stripe/subscription-status/:shellId', …)` handler at line 685 | None. No Salesforce schema, no client-surface, no cross-god contract impact. |

## §7 Schema deltas

**None.** This cycle changes no SObjects, no Plugin__mdt, no server data models. The fix is a middleware wire-up on an existing route.

## §8 Service contracts

### Current (unauthenticated) shape — the leak

```
GET /stripe/subscription-status/:shellId
  Headers: — (no auth required today)
  Returns:
    200 { cancelling, cancel_at_period_end, current_period_end, subscription_id }
    404 { error: "no subscription found" }
```

Any caller can enumerate `shellId` values and observe subscription state for every shell.

### Post-fix shape

```
GET /stripe/subscription-status/:shellId
  Headers: ONE of:
    Cookie: __Host-og_access=<jwt>       # or og_access on localhost
    Authorization: Bearer <jwt>
    x-cf-secret: <cf_secret>
  Returns:
    200 { cancelling, cancel_at_period_end, current_period_end, subscription_id }  // authenticated caller
    401 { error: "unauthenticated" }                                              // no credential OR invalid credential
    404 { error: "no subscription found" }                                        // authenticated but no match
```

Pattern must match the auth middleware already applied to adjacent plutus routes in `plutus/api/src/routes/stripe.ts` — do NOT introduce a new auth scheme.

## §9 Telemetry assertions (the close-out gate)

- **§9.a.** For 24h after merge, zero `2xx` responses on `/stripe/subscription-status/*` without a valid session cookie, JWT, or `CF_SECRET`. Verified via the plutus access log (count of `(status=200,route=/stripe/subscription-status/*,auth=none)` ≡ 0).
- **§9.b.** `plutus.auth.denied` with `route=subscription-status` fires at least once in the 24h window for an unauthenticated probe. A synthetic curl is acceptable; the event just needs to exist to prove the deny-path telemetry is wired.
- **§9.c.** No regression on authenticated 2xx traffic — the pre-fix 24h rolling average of authenticated 2xx on this route stays within ±10% post-fix (sanity check that the middleware doesn't deny legitimate callers).

## §10 Execution plan

1. **Single step.** Add the project-standard auth middleware ahead of `router.get('/stripe/subscription-status/:shellId', …)` in `plutus/api/src/routes/stripe.ts` at line 685. Match the pattern already applied to adjacent plutus routes in the same file — identical import, identical ordering, identical deny-shape. **Do NOT propose a new auth scheme.** (Blocks: §5 approval.)

## §11 Verification protocol

Three curls against the dev deploy:

```
# 1. no credential → expect 401
curl -sS -o /dev/null -w "%{http_code}\n" \
  https://plutus-dev.turtleshell.ai/stripe/subscription-status/some-shell-id

# 2. expired/invalid JWT → expect 401
curl -sS -o /dev/null -w "%{http_code}\n" \
  -H "Cookie: __Host-og_access=invalid.jwt.token" \
  https://plutus-dev.turtleshell.ai/stripe/subscription-status/some-shell-id

# 3. valid session (replace with freshly minted JWT or CF_SECRET) → expect 200
curl -sS -o /dev/null -w "%{http_code}\n" \
  -H "Cookie: __Host-og_access=$VALID_JWT" \
  https://plutus-dev.turtleshell.ai/stripe/subscription-status/$REAL_SHELL_ID
```

Expected: `401 / 401 / 200`. Append the three outputs to §13 Verification evidence.

## §12 Rollback plan

Single revert commit on plutus (`git revert <middleware-add-sha>`). No schema to unwind, no cross-service state coupled to the deny-path. If the middleware denies a legitimate client the fix is forward (missing exemption), not rollback — but the single-commit revert is available as the emergency reset.

## §13 Closeout

*Filled at close.*

### What shipped
- (TBD)

### Verification evidence
- (TBD — three-curl output + 24h access-log counts for §9.a / §9.b / §9.c)

### Memory updates
- (TBD)

### Cycle close commit
- (TBD)
- Steward sign-off: **___** **___**
