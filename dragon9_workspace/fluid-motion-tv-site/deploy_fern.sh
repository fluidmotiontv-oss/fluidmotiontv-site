#!/bin/bash
set -e

echo "=== [1/4] Installing dependencies ==="
npm install --legacy-peer-deps

echo "=== [2/4] Building production bundle ==="
npx vite build

echo "=== [3/4] Cleaning git cache & committing ==="
echo -e "node_modules/\ndist/\n.DS_Store" >> .gitignore
git rm -r --cached node_modules/ dist/ 2>/dev/null || true
git add .
git commit -m "Deploy 3D Walking Fern path production build" || echo "No changes to commit"

echo "=== [4/4] Build complete! ==="
echo "To push live, run: git push origin main --force"
