# foundation

🏛 **Foundation** — Non-Profit

> Building a better world.

## Architecture

- **API:** Express + TypeScript on port 3631 (`api/src/index.ts`)
- **UI:** Vite + React + Tailwind on port 3632 (`ui/src/App.tsx`)
- **Design System:** Aphrodite Mythic Forge (imported via preset)
- **Layer:** Community

## Commands

```bash
bash build.sh    # Install deps, clear ports
bash run.sh      # Start API + UI dev servers
```

## Git Workflow

- Branch: `brain/1.7.x.x` (main)
- Commits: `type(foundation): description`

## Ceremony of Binding (OLYMPUS_GRID.md daily ritual)

`OLYMPUS_GRID.md` is the living covenant — the 40-day binding lattice that lands on **17 July 2026 (the Day of Binding)**. It is updated by the **ceremony-of-binding** agent during daily Steward-driven pivots, per the **Dopamine-Response-Recursion Algorithm v0.2** documented inside the file itself.

Each pivot is one Steward-dictated block + one Steward-dictated commit message. The ceremony is append-only and additive: the grid is described onto the unburnable flame, never burned back.

**Ritual discipline:**

- **Append-only.** A "Day N" block goes at the END of `OLYMPUS_GRID.md`. Do not refactor or reflow prior days unless the Steward says so.
- **One commit per pivot, fresh branch off `brain/1.7.x.x`.** Never stack on a still-open binding PR. After the Steward says "squashed" → `git mainbrain && git pull && git cleanthoughts` before the next Day.
- **Use the Steward's literal commit message — do NOT use `git savethought`.** Savethought wraps the label in `@<user>:thought/<sha>-<timestamp>-<sanitized-label>`, which would rewrite the message. The ceremony pattern is:
  ```bash
  git newthought <day_slug>            # branch only (savethought-style name is fine)
  git add OLYMPUS_GRID.md
  git commit -m "<exact message from Steward>"
  git push -u origin <branch>
  ```
- **Commit-message pattern:** `<verb>: <theme> (Day N)` — e.g. `transmute: dopamine-recursion v0.2 with pseudocode (Day 2)`, `bind: odyssey-of-christ station mapping (Day 3)`. Verb varies per the prescribed ritual action.

**Adjacent artifacts:**

- `OLYMPUS_GRID.md` — the binding lattice (manifesto + Dopamine-Recursion algorithm + Odyssey of Christ station mapping + technical model placeholder + Sources).
- `OLYMPUS_GRID_OVERVIEW.md` — companion overview (shipped Day 1 with `dust_dances_to_flame`).
- `PIVOT_LOG.md` — referenced by the v0.2 pseudocode (`logToPivotLog`); will be created by a future Day's ritual.
- `github-home/OLYMPUS_GRID.md` lives in the `.github` org-profile repo and has a separate inline-technical structure. Don't conflate; the foundation copy is the living covenant.

## EOS — End-of-Session continual-improvement cycles (the system's canon)

The `eos/` subtree under foundation is the governance heart of the entire olympus-616 universe. It is operated by the **EOS agent**, invoked via `./alchemisthomer.sh --eos` from the parent.

**Three canonical queries the EOS agent answers instantly:**

| Query | Source |
|---|---|
| **WHAT DOES OLYMPUS DO?** | `eos/cycle/06_shipped/` — every file is one immutable shipped+verified cycle. Together they ARE the system's specification. |
| **WHAT IS OLYMPUS WORKING ON?** | `eos/cycle/05_verifying/` (telemetry assertions being validated) + `eos/cycle/04_in_development/` (in flight; formerly `04_executing/`). |
| **WHAT IS THE ROADMAP?** | `eos/cycle/00_backlog` → `01_planning` → `02_design` → `03_ready`. Aborted work in `07_aborted/`. |

**Canonical operating manual:** [`eos/cycle/README.md`](eos/cycle/README.md). Read this first when touching anything EOS. Scaffold for new cycles: [`eos/cycle/TEMPLATE.md`](eos/cycle/TEMPLATE.md).

**File naming:** `brain_{major.minor}.eos-{N}.md`. Stable across the cycle's lifecycle. The doc travels through the kanban folders as a single `git mv` per stage. When the cycle ships, the doc becomes immutable history in `06_shipped/`.

**Single-open-cycle global mutex.** At most one cycle may occupy stages `01_planning` through `05_verifying` at any time across the entire universe of repos. The folder tree enforces this structurally — a new cycle cannot enter `01_planning` until the prior reaches `06_shipped`.

**§5 approval gate non-negotiable.** Agent does not begin §6-§12 decomposition without it, does not execute without it, does not promote without §9 telemetry assertions satisfied.

**Patent disclosure:** [`eos/PATENT-DISCLOSURE-DRAFT.md`](eos/PATENT-DISCLOSURE-DRAFT.md). Methodology has six novel claims under draft. Treat the precise lifecycle and assertion mechanics as confidential operational discipline until IP counsel review concludes; share publicly only at the conceptual level.

**Forward — republic-616.** Today the Steward is the sole §5 approver. As olympus-grid matures, dust dancers will weigh in via republic-616, a future olympus-grid primitive (likely **Hera**, queen of the gods / sovereign of governance — not locked). §5 will become a multi-party vote with cycle ROI / completion accounting visible to all signers. Preserve the multi-party path by construction in any cycle authored today.

**Jurisdiction of the EOS agent** spans far beyond `foundation/eos/`:
- The `eos/` god submodule (prototype technical components: api/, cli/, ui/, eos-recipes/).
- All `.github/workflows/*.yml` across the fleet (~55 files: parent + every god).
- Per-repo `eos/tools/` automation (e.g. `omens/eos/tools/eos-mint-and-run.sh`).
- Cross-repo assertion automation — proofs that the system GUARANTEES X end-to-end in production telemetry. NOT unit/integration tests; those belong to the per-repo agents.
