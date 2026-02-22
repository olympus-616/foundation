#!/bin/bash
REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
mkdir -p "$REPO_DIR/.agent"
echo " ▶  foundation — DEV SERVER (API :3631 + UI :3632)"
cd "$REPO_DIR"
(cd api && npm run dev 2>&1) &
(cd ui && npm run dev 2>&1) &
wait
