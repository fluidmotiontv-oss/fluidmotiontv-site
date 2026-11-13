#!/usr/bin/env bash
set -euo pipefail

mkdir -p .github/workflows

cat <<'__AGENTS_EOF__' > AGENTS.md
# AGENTS.md — fluidmotiontv.site Sovereign Repository Instructions

This file defines the canonical architecture, ecosystem topology, domain invariants, component boundaries, and Continuous AI operational rules for **fluidmotiontv.site**. Any local coding assistant, cloud agent, or GitHub Actions workflow operating in this repository must read and enforce these constraints before proposing or merging changes.

---

## 1. Repository Identity & Domain Constraints

- **Target Domain:** `fluidmotiontv.site` — Harmonic liquid dynamics, 432 Hz Pythagorean acoustic geometry, Dragon 9 Nonary Clock synchronization, and sovereign multi-app ecosystem.
- **Primary Stack:** React 19, TypeScript, Vite 8, Tailwind CSS v4 (`@tailwindcss/vite`), Lucide Icons, Motion, and GitHub Pages (`CNAME` + `.nojekyll` static/SPA root deployment with `index.html`, `store.html`, and `/app`).
- **Verification Gate:** Every pull request and local commit must pass `npm run lint` (`tsc --noEmit`), `npm run build` (`vite build`), JSON manifest validation (`INDEX.JSON`, `vault.json`, `manifest_*.json`), and GitHub Pages root asset checks with zero errors.

---

## 2. Ecosystem Topology & Directory Inventory

### Live Sites & Core Applications
- `DrWelland-Strong` — Live site (health & clinical portal)
- `Email Studio` (`v1` & `v2`) — Email management and marketing automation platform
- `Fluid Motion 3D Spatial Ebook` — Interactive spatial documentation & reading experience
- `Kimi_Agent_Dragon9` (`/app`) — 3D web model launcher application
- `Holocraft-3D` — Camera Hologram Studio interface
- `FM Storefront PWA` (`store.html`) — Progressive Web App commerce storefront

### Studios, Workspaces & Simulators
- `Studio AI & Fluid Motion` — Integrated workspace housing the Repoman Agent build
- `Harmonic Geodetic Field Simulator` — Geodetic & harmonic field simulation engine
- `Apex-Orchestrator` — Multi-app system coordination & orchestration utility
- `Aethergl-Studio` — WebGL/creative development studio environment
- `Figure-8-Flow-Bundle` — Flow-state and workflow automation package
- `Dragon9 Workspace` (`fluid-motion-tv-site`) — Core portal workspace with GitHub Pages path fixes and `.nojekyll`

### Media, Manifests & Deployment Roots
- **Audio Assets:** `20260722 - REAL EYES REALIZE REAL LIES - Cypress Hill - Wu Tang - Eminem Vibe [pvLzES_jF5M].mp3`, `RAW-POWER-1790759314788.mp3`, `dawn1music.mp3`
- **System Manifests:** `manifest_d9_*.json`, `manifest_dragon9_core_1080p.json`, `INDEX.JSON`, `vault.json`
- **Web Entrypoints & Hosting:** `index.html`, `store.html`, `/app`, `CNAME`, `.nojekyll`, root `package-lock.json`

---

## 3. Strict Architectural Boundary Rules

1. **Pure Domain Core (`src/core/**`):**
   - Must contain **zero** React imports (`react`, `react-dom`), zero DOM globals (`window`, `document`), and zero network calls.
   - All functions must be deterministic, side-effect-free, and unit-testable in Node.js or browser workers.
2. **UI Components (`src/components/**`):**
   - Consume state and pure calculations from `src/core/` via props or local hooks.
   - Maintain Tailwind CSS v4 utility styling; no inline CSS stylesheets or `!important` theme hacks.
   - Respect `prefers-reduced-motion` for all canvas/animation and 3D render loops.
3. **GitHub Pages & Root Hosting Integrity (`CNAME`, `.nojekyll`, `index.html`, `store.html`):**
   - Never delete `.nojekyll` (required so GitHub Pages serves underscore-prefixed or non-Jekyll asset directories cleanly).
   - Never alter `CNAME` (`fluidmotiontv.site`) or root entrypoint routing (`/app`, `store.html`) without maintainer sign-off.
4. **Manifest & Vault Safety (`INDEX.JSON`, `vault.json`, `manifest_*.json`):**
   - All JSON manifests must parse cleanly via `JSON.parse()` with zero syntax errors.
   - Changes touching `vault.json`, `INDEX.JSON`, `manifest_*.json`, `.github/workflows/**`, `AGENTS.md`, `CNAME`, `.nojekyll`, `package.json`, or `package-lock.json` are **protected boundary changes**: Repoman Agent must apply `needs-maintainer-review` and must **never** auto-merge them without human approval.

---

## 4. 432 Hz Pythagorean Frequency Invariants

All harmonic synthesis, audio playback, and fluid wave phase calculations in `fluidmotiontv.site` are anchored to **Verdi / Pythagorean scientific pitch**:

- **Reference Fundamental:** `A4 = 432.000 Hz` (never `440 Hz` equal temperament).
- **Pythagorean Just & Quintal Ratios (3-Limit Tuning):**
  - Unison (`1:1`): `432.00 Hz` · Major Second (`9:8`): `486.00 Hz` · Major Third (`81:64`): `546.75 Hz`
  - Perfect Fourth (`4:3`): `576.00 Hz` · Perfect Fifth (`3:2`): `648.00 Hz` · Major Sixth (`27:16`): `729.00 Hz`
  - Major Seventh (`243:128`): `820.125 Hz` · Octave (`2:1`): `864.00 Hz`
- **Audio & Render Safety:** Web Audio oscillators default to muted/off and initialize only on explicit user interaction with smooth gain ramping.

---

## 5. Dragon 9 Nonary Clock Constraints

Time synchronization across the live portal, `/app`, and simulators uses the **Dragon 9 Nonary Clock** (base-9 temporal lattice):

- **Nonary Radix:** Base `9` (`0` through `8` per register).
- **Register Hierarchy:**
  - **Cycle (`C`):** `9` Nonary Sectors (`0–8`) dividing the solar day (`9,600,000 ms` / `2h 40m` per sector).
  - **Nonad (`N`):** `81` Sub-Nonads per Sector (`118,518.518... ms` each).
  - **Beat (`B`):** `9` Micro-Beats per Nonad (`13,168.724... ms` each).
  - **Pulse (`P`):** `9` Harmonic Pulses per Beat (`1,463.191... ms` each), phase-locked to `432 / 27 = 16 Hz` wave envelope modulation.
- **Determinism Rule:** All Dragon 9 projections derive from UTC/epoch milliseconds via pure modular arithmetic.

---

## 6. Repoman Agent Synchronization Protocol

1. **Triage First:** Classify every PR by touched ecosystem layer (`scope:core-harmonic`, `scope:portal-ui`, `scope:live-apps`, `scope:studios-simulators`, `scope:manifests-media`, `scope:gh-pages-deploy`, `scope:workflow-ci`, `scope:docs-agents`, `scope:dependencies`).
2. **Compile & Validate:** Run `npm ci`, `npm run lint`, `npm run build`, and JSON manifest validation before posting any verdict.
3. **Boundary Audit:** Verify `src/core/` purity, `.nojekyll` + `CNAME` presence, and `repoman-agent.md` ↔ `repoman-agent.lock.yml` synchronization.
4. **Safe Outputs Only:** Never execute untrusted fork code with write tokens; guard protected manifests, deployment files, and workflow edits with `needs-maintainer-review`.
__AGENTS_EOF__

cat <<'__COPILOT_EOF__' > .github/copilot-instructions.md
# Repository Instructions — fluidmotiontv.site

Follow `/AGENTS.md` for all code generation, refactoring, manifest updates, and pull request reviews across the fluidmotiontv.site ecosystem.

## Quick Rules for Coding Agents
1. **Stack:** React 19, TypeScript, Vite 8, Tailwind CSS v4 (`@import "tailwindcss";` in `src/index.css`), plus GitHub Pages static/SPA roots (`index.html`, `store.html`, `/app`, `CNAME`, `.nojekyll`).
2. **Core Isolation:** Keep `src/core/harmonicEngine.ts` strictly pure TypeScript. Zero React, DOM APIs, or network calls in `src/core/`.
3. **432 Hz & Dragon 9 Invariants:** Preserve `PYTHAGOREAN_BASE_HZ = 432` and deterministic base-9 Nonary Clock math. Never introduce `440 Hz` overrides.
4. **Manifests & Deployment Integrity:** Always keep `INDEX.JSON`, `vault.json`, `manifest_d9_*.json`, and `manifest_dragon9_core_1080p.json` valid JSON. Never delete `.nojekyll` or alter `CNAME` unintentionally.
5. **Pre-Commit Verification:** Run `npm run lint` and `npm run build`, and validate any modified `.json` manifest files before committing.
6. **Workflow Parity:** Keep `.github/workflows/repoman-agent.md` synchronized with `.github/workflows/repoman-agent.lock.yml`.
__COPILOT_EOF__

cat <<'__REPOMAN_MD_EOF__' > .github/workflows/repoman-agent.md
---
name: Repoman Agent — Sovereign Triage & Sync
description: >
  Continuous AI workflow for fluidmotiontv.site that inspects incoming PR diffs across
  live apps, studios/simulators, manifests, and GitHub Pages roots; validates 432 Hz
  and Dragon 9 boundaries; runs TypeScript/Vite/JSON gates; and coordinates safe merges.

on:
  pull_request:
    types: [opened, synchronize, reopened, ready_for_review]
  workflow_dispatch:
    inputs:
      pr_number:
        description: "Pull request number to triage manually"
        required: false
        type: string

permissions:
  contents: read
  pull-requests: read
  checks: read

concurrency:
  group: repoman-agent-${{ github.event.pull_request.number || github.ref }}
  cancel-in-progress: true

safe-outputs:
  add-comment:
    max: 1
  add-labels:
    allowed:
      - "scope:core-harmonic"
      - "scope:portal-ui"
      - "scope:live-apps"
      - "scope:studios-simulators"
      - "scope:manifests-media"
      - "scope:gh-pages-deploy"
      - "scope:workflow-ci"
      - "scope:docs-agents"
      - "scope:dependencies"
      - "gate:verified"
      - "gate:boundary-violation"
      - "needs-maintainer-review"
      - "repoman:merge-ready"
  submit-pull-request-review:
    max: 1

timeout-minutes: 15
---

# Repoman Agent Instructions

You are the **Repoman Agent** for `fluidmotiontv.site`, automating code synchronization, multi-app PR triage, manifest/deployment verification, and guarded merges across the sovereign ecosystem.

## Context Loading
1. Read `/AGENTS.md` and `/.github/copilot-instructions.md` to confirm domain invariants and protected paths.
2. Inspect the pull request changed files (`git diff --name-only origin/${{ github.base_ref }}...HEAD`).

## Step 1 — Deterministic Verification Gates
Execute and verify all checks before evaluating merge readiness:
- Install dependencies cleanly: `npm ci`
- Run TypeScript typechecking: `npm run lint` (`tsc --noEmit`)
- Run production portal bundle: `npm run build` (`vite build`)
- Validate all modified or root JSON manifests (`INDEX.JSON`, `vault.json`, `manifest_d9_*.json`, `manifest_dragon9_core_1080p.json`) with `JSON.parse`.
- Run Boundary & Deployment Audit:
  - Confirm `src/core/` has zero imports from `react`, `react-dom`, `window`, or `document`.
  - Confirm `PYTHAGOREAN_BASE_HZ = 432` remains intact with no `440 Hz` overrides.
  - Confirm `.nojekyll` and `CNAME` are not accidentally removed if present in the repo root.

## Step 2 — Ecosystem PR Scope Classification
Apply deterministic scope labels based on changed paths:
- `src/core/**` -> `scope:core-harmonic`
- `src/components/**`, `src/App.tsx`, `src/index.css`, `src/data/**` -> `scope:portal-ui`
- `DrWelland*`, `Email-Studio*`, `EmailStudio*`, `Fluid-Motion-3D*`, `Kimi_Agent_Dragon9*`, `app/**`, `Holocraft-3D*`, `FM-Storefront*`, `store.html` -> `scope:live-apps`
- `Studio-AI*`, `Harmonic-Geodetic*`, `Apex-Orchestrator*`, `Aethergl-Studio*`, `Figure-8-Flow*`, `fluid-motion-tv-site*` -> `scope:studios-simulators`
- `manifest_*.json`, `INDEX.JSON`, `vault.json`, `*.mp3` -> `scope:manifests-media`
- `CNAME`, `.nojekyll`, `index.html`, `store.html` -> `scope:gh-pages-deploy`
- `.github/workflows/**` -> `scope:workflow-ci`
- `AGENTS.md`, `.github/copilot-instructions.md`, `*.md` -> `scope:docs-agents`
- `package.json`, `package-lock.json` -> `scope:dependencies`

## Step 3 — Security & Protected Boundary Rules
- **Protected Paths:** `.github/workflows/**`, `AGENTS.md`, `.github/copilot-instructions.md`, `package.json`, `package-lock.json`, `CNAME`, `.nojekyll`, `vault.json`, `INDEX.JSON`, `manifest_*.json`, and binary `*.mp3` audio assets.
- If a PR modifies any protected path OR comes from an external fork, add `needs-maintainer-review` and do NOT apply `repoman:merge-ready`.
- Enforce workflow parity between `.github/workflows/repoman-agent.md` and `.github/workflows/repoman-agent.lock.yml`.

## Step 4 — Triage Report & Merge Coordination
Post one structured triage comment detailing touched ecosystem scopes, verification gate outcomes (`lint`, `build`, `JSON manifests`, `432 Hz / Dragon 9 boundary`), and merge verdict (`repoman:merge-ready` vs `needs-maintainer-review` / `gate:boundary-violation`).
__REPOMAN_MD_EOF__

cat <<'__REPOMAN_LOCK_EOF__' > .github/workflows/repoman-agent.lock.yml
# Compiled from .github/workflows/repoman-agent.md
# Target Repository: fluidmotiontv.site
# Architecture: Read-only preflight verification + ecosystem scope triage + manifest & GH Pages guard + auto-merge

name: Repoman Agent — Sovereign Triage & Sync

on:
  pull_request:
    types: [opened, synchronize, reopened, ready_for_review]
  workflow_dispatch:
    inputs:
      pr_number:
        description: "Pull request number to triage manually"
        required: false
        type: string

permissions:
  contents: read

concurrency:
  group: repoman-agent-${{ github.event.pull_request.number || github.ref }}
  cancel-in-progress: true

jobs:
  preflight-and-boundary-audit:
    name: Preflight Build, Manifest & Boundary Audit
    runs-on: ubuntu-latest
    timeout-minutes: 15
    permissions:
      contents: read
      pull-requests: write
      checks: read

    outputs:
      lint_passed: ${{ steps.verify.outputs.lint_passed }}
      build_passed: ${{ steps.verify.outputs.build_passed }}
      manifests_passed: ${{ steps.manifests.outputs.manifests_passed }}
      boundary_passed: ${{ steps.boundary.outputs.boundary_passed }}
      protected_touched: ${{ steps.classify.outputs.protected_touched }}
      scope_labels: ${{ steps.classify.outputs.scope_labels }}
      merge_eligible: ${{ steps.verdict.outputs.merge_eligible }}

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node.js 22
        uses: actions/setup-node@v4
        with:
          node-version: "22"
          cache: "npm"

      - name: Install dependencies cleanly
        run: npm ci

      - name: Verify TypeScript lint & Vite production build
        id: verify
        run: |
          set -o pipefail
          LINT_OK=false
          BUILD_OK=false
          if npm run lint; then
            LINT_OK=true
          fi
          if npm run build; then
            BUILD_OK=true
          fi
          echo "lint_passed=${LINT_OK}" >> "$GITHUB_OUTPUT"
          echo "build_passed=${BUILD_OK}" >> "$GITHUB_OUTPUT"
          if [ "$LINT_OK" != "true" ] || [ "$BUILD_OK" != "true" ]; then
            exit 1
          fi

      - name: Validate ecosystem JSON manifests (INDEX.JSON, vault.json, manifest_*.json)
        id: manifests
        run: |
          MANIFEST_OK=true
          node -e '
            const fs = require("fs");
            const path = require("path");
            const targets = [];
            for (const entry of fs.readdirSync(".", { withFileTypes: true })) {
              if (entry.isFile() && /^(INDEX\.JSON|vault\.json|manifest_.*\.json)$/i.test(entry.name)) {
                targets.push(entry.name);
              }
            }
            for (const file of targets) {
              try {
                JSON.parse(fs.readFileSync(file, "utf8"));
                console.log("Validated JSON manifest:", file);
              } catch (err) {
                console.error("Invalid JSON manifest:", file, err.message);
                process.exitCode = 1;
              }
            }
          ' || MANIFEST_OK=false
          echo "manifests_passed=${MANIFEST_OK}" >> "$GITHUB_OUTPUT"
          if [ "$MANIFEST_OK" != "true" ]; then
            exit 1
          fi

      - name: Classify PR diff scope & protected ecosystem boundaries
        id: classify
        env:
          BASE_REF: ${{ github.base_ref || 'main' }}
        run: |
          git fetch origin "$BASE_REF" --depth=1 || true
          CHANGED_FILES=$(git diff --name-only "origin/${BASE_REF}...HEAD" || git diff --name-only HEAD~1..HEAD || echo "")

          LABELS=()
          PROTECTED="false"

          if echo "$CHANGED_FILES" | grep -qE '^src/core/'; then
            LABELS+=("scope:core-harmonic")
          fi
          if echo "$CHANGED_FILES" | grep -qE '^(src/components/|src/data/|src/App\.tsx|src/index\.css)'; then
            LABELS+=("scope:portal-ui")
          fi
          if echo "$CHANGED_FILES" | grep -qiE '^(DrWelland|Email[-_]?Studio|Fluid[-_]?Motion[-_]?3D|Kimi_Agent_Dragon9|Holocraft-3D|FM[-_]?Storefront|app/|store\.html)'; then
            LABELS+=("scope:live-apps")
          fi
          if echo "$CHANGED_FILES" | grep -qiE '^(Studio[-_]?AI|Harmonic[-_]?Geodetic|Apex-Orchestrator|Aethergl-Studio|Figure-8-Flow|fluid-motion-tv-site)'; then
            LABELS+=("scope:studios-simulators")
          fi
          if echo "$CHANGED_FILES" | grep -qiE '(^manifest_.*\.json$|^INDEX\.JSON$|^vault\.json$|\.mp3$)'; then
            LABELS+=("scope:manifests-media")
            PROTECTED="true"
          fi
          if echo "$CHANGED_FILES" | grep -qE '^(CNAME|\.nojekyll|index\.html|store\.html)$'; then
            LABELS+=("scope:gh-pages-deploy")
            if echo "$CHANGED_FILES" | grep -qE '^(CNAME|\.nojekyll)$'; then
              PROTECTED="true"
            fi
          fi
          if echo "$CHANGED_FILES" | grep -qE '^\.github/workflows/'; then
            LABELS+=("scope:workflow-ci")
            PROTECTED="true"
          fi
          if echo "$CHANGED_FILES" | grep -qE '^(AGENTS\.md|\.github/copilot-instructions\.md|.*\.md)$'; then
            LABELS+=("scope:docs-agents")
            if echo "$CHANGED_FILES" | grep -qE '^(AGENTS\.md|\.github/copilot-instructions\.md)$'; then
              PROTECTED="true"
            fi
          fi
          if echo "$CHANGED_FILES" | grep -qE '^package(-lock)?\.json$'; then
            LABELS+=("scope:dependencies")
            PROTECTED="true"
          fi

          JOINED_LABELS=$(IFS=,; echo "${LABELS[*]}")
          echo "scope_labels=${JOINED_LABELS}" >> "$GITHUB_OUTPUT"
          echo "protected_touched=${PROTECTED}" >> "$GITHUB_OUTPUT"

      - name: Audit 432 Hz Pythagorean, Dragon 9 Nonary & GH Pages boundaries
        id: boundary
        run: |
          BOUNDARY_OK=true

          # 1. Ensure src/core/ has zero React or DOM imports
          if [ -d "src/core" ]; then
            if grep -rnE "from ['\"]react|window\.|document\." src/core/; then
              echo "Boundary violation: React/DOM reference detected in src/core/"
              BOUNDARY_OK=false
            fi
          fi

          # 2. Ensure 432 Hz reference pitch is preserved and no 440 Hz tuning override exists
          if [ -f "src/core/harmonicEngine.ts" ]; then
            if ! grep -q "432" src/core/harmonicEngine.ts; then
              echo "Boundary violation: Missing 432 Hz reference in harmonicEngine.ts"
              BOUNDARY_OK=false
            fi
            if grep -qE "PYTHAGOREAN_BASE_HZ\s*=\s*440" src/core/harmonicEngine.ts; then
              echo "Boundary violation: Equal-temperament 440 Hz override detected"
              BOUNDARY_OK=false
            fi
          fi

          # 3. Verify AGENTS.md and repoman-agent.md parity exists
          if [ ! -f "AGENTS.md" ] || [ ! -f ".github/workflows/repoman-agent.md" ]; then
            echo "Boundary violation: Missing sovereign agent files"
            BOUNDARY_OK=false
          fi

          echo "boundary_passed=${BOUNDARY_OK}" >> "$GITHUB_OUTPUT"
          if [ "$BOUNDARY_OK" != "true" ]; then
            exit 1
          fi

      - name: Compute merge eligibility verdict
        id: verdict
        run: |
          IS_DRAFT="${{ github.event.pull_request.draft || false }}"
          SAME_REPO="true"
          if [ "${{ github.event.pull_request.head.repo.full_name }}" != "${{ github.repository }}" ] && [ -n "${{ github.event.pull_request.head.repo.full_name }}" ]; then
            SAME_REPO="false"
          fi

          ELIGIBLE="false"
          if [ "${{ steps.verify.outputs.lint_passed }}" = "true" ] && \
             [ "${{ steps.verify.outputs.build_passed }}" = "true" ] && \
             [ "${{ steps.manifests.outputs.manifests_passed }}" = "true" ] && \
             [ "${{ steps.boundary.outputs.boundary_passed }}" = "true" ] && \
             [ "${{ steps.classify.outputs.protected_touched }}" = "false" ] && \
             [ "$IS_DRAFT" = "false" ] && \
             [ "$SAME_REPO" = "true" ]; then
            ELIGIBLE="true"
          fi

          echo "merge_eligible=${ELIGIBLE}" >> "$GITHUB_OUTPUT"

      - name: Apply triage labels & post Repoman verdict comment
        if: always() && (github.event_name == 'pull_request' || inputs.pr_number != '')
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          PR_NUMBER: ${{ github.event.pull_request.number || inputs.pr_number }}
          SCOPE_LABELS: ${{ steps.classify.outputs.scope_labels }}
          PROTECTED_TOUCHED: ${{ steps.classify.outputs.protected_touched }}
          LINT_PASSED: ${{ steps.verify.outputs.lint_passed }}
          BUILD_PASSED: ${{ steps.verify.outputs.build_passed }}
          MANIFESTS_PASSED: ${{ steps.manifests.outputs.manifests_passed }}
          BOUNDARY_PASSED: ${{ steps.boundary.outputs.boundary_passed }}
          MERGE_ELIGIBLE: ${{ steps.verdict.outputs.merge_eligible }}
        run: |
          if [ -z "$PR_NUMBER" ]; then
            echo "No PR number present; skipping PR comment/label step."
            exit 0
          fi

          IFS=',' read -ra LABEL_LIST <<< "$SCOPE_LABELS"
          for lbl in "${LABEL_LIST[@]}"; do
            if [ -n "$lbl" ]; then
              gh pr edit "$PR_NUMBER" --add-label "$lbl" || true
            fi
          done

          if [ "$BOUNDARY_PASSED" = "true" ] && [ "$LINT_PASSED" = "true" ] && [ "$BUILD_PASSED" = "true" ] && [ "$MANIFESTS_PASSED" = "true" ]; then
            gh pr edit "$PR_NUMBER" --add-label "gate:verified" || true
          else
            gh pr edit "$PR_NUMBER" --add-label "gate:boundary-violation" || true
          fi

          if [ "$PROTECTED_TOUCHED" = "true" ]; then
            gh pr edit "$PR_NUMBER" --add-label "needs-maintainer-review" || true
          fi

          if [ "$MERGE_ELIGIBLE" = "true" ]; then
            gh pr edit "$PR_NUMBER" --add-label "repoman:merge-ready" || true
          fi

          SUMMARY=$(cat <<EOF
          ### Repoman Agent Triage Report — fluidmotiontv.site

          | Check | Status |
          | :--- | :--- |
          | TypeScript Lint (\`npm run lint\`) | \`${LINT_PASSED}\` |
          | Portal Build (\`npm run build\`) | \`${BUILD_PASSED}\` |
          | JSON Manifest Validation | \`${MANIFESTS_PASSED}\` |
          | 432 Hz / Dragon 9 Boundary Audit | \`${BOUNDARY_PASSED}\` |
          | Protected Files Modified | \`${PROTECTED_TOUCHED}\` |
          | **Merge Eligible** | \`${MERGE_ELIGIBLE}\` |

          **Detected Scopes:** \`${SCOPE_LABELS:-none}\`
          EOF
          )

          gh pr comment "$PR_NUMBER" --body "$SUMMARY" || true

  coordinate-merge:
    name: Guarded Merge Coordinator
    needs: preflight-and-boundary-audit
    if: |
      github.event_name == 'pull_request' &&
      needs.preflight-and-boundary-audit.outputs.merge_eligible == 'true' &&
      github.event.pull_request.head.repo.full_name == github.repository
    runs-on: ubuntu-latest
    timeout-minutes: 5
    permissions:
      contents: write
      pull-requests: write

    steps:
      - name: Enable guarded squash auto-merge
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          PR_NUMBER: ${{ github.event.pull_request.number }}
        run: |
          gh pr merge "$PR_NUMBER" --auto --squash --delete-branch || echo "Auto-merge requires repository setting 'Allow auto-merge' to be enabled."
__REPOMAN_LOCK_EOF__

echo "Installed Repoman Agent package for fluidmotiontv.site."
echo "Next: run 'npm run lint && npm run build' and commit the staged files."
