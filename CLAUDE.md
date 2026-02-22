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
