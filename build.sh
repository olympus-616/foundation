#!/bin/bash
set -euo pipefail
REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_NAME="$(basename "$REPO_DIR")"
echo "═══════════════════════════════════════════════════"
echo " ⚒  ${REPO_NAME} — BUILD"
echo "═══════════════════════════════════════════════════"
cd "$REPO_DIR" && mkdir -p .agent
npm ci 2>&1
[ -f "api/package.json" ] && (cd api && npm ci 2>&1 && cd ..)
[ -f "ui/package.json" ] && (cd ui && npm ci 2>&1 && cd ..)
echo " ✓ ${REPO_NAME} — BUILD COMPLETE"
