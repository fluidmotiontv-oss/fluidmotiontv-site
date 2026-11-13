export interface PackageArtifact {
  readonly id: string;
  readonly path: string;
  readonly title: string;
  readonly category: 'Context Spec' | 'Assistant Rules' | 'Workflow Source' | 'Compiled Lockfile';
  readonly language: 'markdown' | 'yaml';
  readonly description: string;
  readonly content: string;
}

export const AGENTS_MD_CONTENT = `# AGENTS.md — fluidmotiontv.site Sovereign Repository Instructions

This file defines the canonical architecture, domain invariants, component boundaries, and Continuous AI operational rules for **fluidmotiontv.site**. Any local coding assistant, cloud agent, or GitHub Actions workflow operating in this repository must read and enforce these constraints before proposing or merging changes.

---

## 1. Repository Identity & Domain Constraints

- **Target Domain:** \`fluidmotiontv.site\` — Harmonic liquid dynamics, 432 Hz Pythagorean acoustic geometry, and Dragon 9 Nonary Clock synchronization.
- **Primary Stack:** React 19, TypeScript, Vite 8, Tailwind CSS v4 (\`@tailwindcss/vite\`), Lucide Icons, Motion, and optional Express server (\`server.ts\`, port \`3000\`).
- **Verification Gate:** Every pull request and local commit must pass both \`npm run lint\` (\`tsc --noEmit\`) and \`npm run build\` (\`vite build\`) with zero errors.

---

## 2. Folder Structure & Component Boundaries

\`\`\`text
/
├── AGENTS.md                           # Sovereign agent architecture & invariant spec
├── .github/
│   ├── copilot-instructions.md         # IDE & cloud assistant concise instruction mirror
│   └── workflows/
│       ├── repoman-agent.md            # Continuous AI natural-language workflow source
│       └── repoman-agent.lock.yml      # Compiled deterministic GitHub Actions lockfile
├── index.html                          # Entry HTML with Plus Jakarta Sans, DM Sans, JetBrains Mono
├── metadata.json                       # Applet manifest
├── package.json                        # Scripts: dev, build, lint, preview
├── src/
│   ├── core/
│   │   └── harmonicEngine.ts           # Pure 432 Hz Pythagorean & Dragon 9 Nonary Clock math
│   ├── data/
│   │   └── repomanPackage.ts           # Canonical package exports, triage rules & runbook data
│   ├── components/
│   │   ├── HarmonicClockPanel.tsx      # 432 Hz liquid wave canvas & Dragon 9 Nonary display
│   │   ├── PackageArtifactsView.tsx    # Synchronized repository artifact explorer & exporter
│   │   ├── PrTriageSimulator.tsx       # Boundary gate & PR classification inspector
│   │   └── ExecutionRunbook.tsx        # Shell execution steps & verification checklist
│   ├── index.css                       # Tailwind v4 @import & typography theme variables
│   ├── main.tsx                        # React 19 DOM mount
│   └── App.tsx                         # Sovereign console layout & top bar contract
└── tsconfig.json / vite.config.ts      # Bundler & strict TypeScript configuration
\`\`\`

### Strict Architectural Boundary Rules
1. **Pure Domain Core (\`src/core/**\`):**
   - Must contain **zero** React imports (\`react\`, \`react-dom\`), zero DOM globals (\`window\`, \`document\`), and zero network calls.
   - All functions must be deterministic, side-effect-free, and unit-testable in Node.js or browser workers.
2. **UI Components (\`src/components/**\`):**
   - Consume state and pure calculations from \`src/core/\` via props or local hooks.
   - Never embed hardcoded magic timing constants that contradict \`src/core/harmonicEngine.ts\`.
   - Maintain Tailwind CSS v4 utility styling; no inline CSS stylesheets or \`!important\` theme hacks.
   - Respect \`prefers-reduced-motion\` for all canvas/animation loops.
3. **Workflow & Security Files (\`.github/workflows/**\`, \`AGENTS.md\`):**
   - Changes touching \`.github/workflows/**\` or \`AGENTS.md\` are **protected boundary changes**: the Repoman Agent must flag them with \`needs-maintainer-review\` and must **never** auto-merge them without explicit human approval.

---

## 3. 432 Hz Pythagorean Frequency Invariants

All harmonic synthesis and fluid wave phase calculations in \`fluidmotiontv.site\` are anchored to **Verdi / Pythagorean scientific pitch**:

- **Reference Fundamental:** \`A4 = 432.000 Hz\` (never \`440 Hz\` equal temperament).
- **Pythagorean Just & Quintal Ratios (3-Limit Tuning):**
  - Unison (\`1:1\`): \`432.00 Hz\`
  - Major Second (\`9:8\`): \`486.00 Hz\`
  - Pythagorean Major Third (\`81:64\`): \`546.75 Hz\`
  - Perfect Fourth (\`4:3\`): \`576.00 Hz\`
  - Perfect Fifth (\`3:2\`): \`648.00 Hz\`
  - Pythagorean Major Sixth (\`27:16\`): \`729.00 Hz\`
  - Pythagorean Major Seventh (\`243:128\`): \`820.125 Hz\`
  - Octave (\`2:1\`): \`864.00 Hz\`
- **Audio & Render Safety:**
  - Any Web Audio API oscillator must default to **muted/off** and initialize only inside an explicit user click handler with smooth \`linearRampToValueAtTime\` gain envelopes to prevent clipping.

---

## 4. Dragon 9 Nonary Clock Constraints

Time synchronization across the live portal uses the **Dragon 9 Nonary Clock** (base-9 temporal lattice):

- **Nonary Radix:** Base \`9\` (\`0\` through \`8\` per register).
- **Register Hierarchy:**
  - **Cycle (\`C\`):** \`9\` Nonary Sectors (\`0–8\`) dividing the solar day (\`86,400,000 ms / 9 = 9,600,000 ms\` per sector, i.e., \`2h 40m\` per sector).
  - **Nonad (\`N\`):** \`81\` Sub-Nonads per Sector (\`9^2\`, each \`118,518.518... ms\`).
  - **Beat (\`B\`):** \`9\` Micro-Beats per Nonad (\`13,168.724... ms\` each).
  - **Pulse (\`P\`):** \`9\` Harmonic Pulses per Beat (\`1,463.191... ms\` each), phase-locked to \`432 Hz\` sub-harmonics (\`432 / 27 = 16 Hz\` wave envelope modulation).
- **Determinism Rule:** All Dragon 9 projections must derive from UTC/epoch milliseconds via pure modular arithmetic without mutable global drift accumulators.

---

## 5. Repoman Agent Synchronization Protocol

1. **Triage First:** Classify every PR by touched path (\`core:harmonic\`, \`ui:portal\`, \`ci:workflow\`, \`docs:agents\`, \`infra:deps\`).
2. **Compile & Typecheck:** Run \`npm ci\`, \`npm run lint\`, and \`npm run build\` before posting any triage verdict.
3. **Boundary Audit:** Verify \`src/core/\` has no React/DOM imports and that \`repoman-agent.md\` remains synchronized with \`repoman-agent.lock.yml\`.
4. **Safe Outputs Only:** Never execute untrusted PR code with write tokens; separate read/verification steps from guarded triage/merge actions.`;

export const COPILOT_INSTRUCTIONS_CONTENT = `# Repository Instructions — fluidmotiontv.site

Follow the complete specification in \`/AGENTS.md\` for all code generation, refactoring, and pull request reviews.

## Quick Rules for Coding Agents
1. **Stack:** React 19, TypeScript, Vite 8, Tailwind CSS v4 (\`@import "tailwindcss";\` in \`src/index.css\`).
2. **Core Isolation:** Keep \`src/core/harmonicEngine.ts\` strictly pure TypeScript. Do not import React, DOM APIs, or external side-effect libraries into \`src/core/\`.
3. **432 Hz Tuning:** Preserve \`PYTHAGOREAN_BASE_HZ = 432\` and exact 3-limit Pythagorean ratios (\`1:1\`, \`9:8\`, \`81:64\`, \`4:3\`, \`3:2\`, \`27:16\`, \`243:128\`, \`2:1\`). Never introduce \`440 Hz\` equal-temperament defaults.
4. **Dragon 9 Nonary Clock:** Derive base-9 registers (\`sector\`, \`nonad\`, \`beat\`, \`pulse\`, \`phaseAngle\`) deterministically from epoch milliseconds.
5. **Pre-Commit Verification:** Always run \`npm run lint\` and \`npm run build\` before finalizing edits.
6. **Workflow Parity:** If \`.github/workflows/repoman-agent.md\` changes, recompile \`.github/workflows/repoman-agent.lock.yml\` and verify both are committed together.`;

export const REPOMAN_WORKFLOW_MD_CONTENT = `---
name: Repoman Agent — Sovereign Triage & Sync
description: >
  Continuous AI workflow for fluidmotiontv.site that inspects incoming PR diffs,
  validates 432 Hz Pythagorean & Dragon 9 Nonary Clock boundaries, runs TypeScript
  and Vite verification gates, applies triage labels, and coordinates safe merges.

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
  group: repoman-agent-\${{ github.event.pull_request.number || github.ref }}
  cancel-in-progress: true

safe-outputs:
  add-comment:
    max: 1
  add-labels:
    allowed:
      - "scope:core-harmonic"
      - "scope:portal-ui"
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

You are the **Repoman Agent** for \`fluidmotiontv.site\`, responsible for automated code synchronization, pull request triage, architectural boundary verification, and safe merge coordination.

## Context Loading
1. Read \`/AGENTS.md\` and \`/.github/copilot-instructions.md\` first to align with repository invariants.
2. Inspect the pull request metadata, base/head branches, and changed file list (\`git diff --name-only origin/\${{ github.base_ref }}...HEAD\`).

## Step 1 — Deterministic Verification Gates
Execute and verify the following checks before evaluating merge readiness:
- Install dependencies cleanly: \`npm ci\`
- Run TypeScript typechecking: \`npm run lint\` (\`tsc --noEmit\`)
- Run production portal bundle: \`npm run build\` (\`vite build\`)
- Run Boundary Audit on \`src/core/\`:
  - Confirm zero imports from \`react\`, \`react-dom\`, \`window\`, or \`document\`.
  - Confirm \`PYTHAGOREAN_BASE_HZ = 432\` remains intact and no \`440\` Hz tuning constants were introduced.
  - Confirm Dragon 9 Nonary calculations remain pure and base-9 deterministic.

If any deterministic check fails, mark the PR with \`gate:boundary-violation\` (for architecture/invariant errors) or request changes with exact failing file/line details. Never approve or recommend merge on a failing build.

## Step 2 — PR Scope Classification & Sorting
Apply deterministic scope labels based on changed paths:
- \`src/core/**\` -> \`scope:core-harmonic\`
- \`src/components/**\`, \`src/App.tsx\`, \`src/index.css\`, \`index.html\` -> \`scope:portal-ui\`
- \`.github/workflows/**\` -> \`scope:workflow-ci\`
- \`AGENTS.md\`, \`.github/copilot-instructions.md\`, \`*.md\` -> \`scope:docs-agents\`
- \`package.json\`, \`package-lock.json\` -> \`scope:dependencies\`

## Step 3 — Security & Protected Boundary Rules
- **Protected Files:** \`.github/workflows/**\`, \`AGENTS.md\`, \`package.json\`, and \`package-lock.json\`.
- If a PR modifies any protected file, OR comes from an external fork (\`head.repo.full_name != base.repo.full_name\`), you MUST add \`needs-maintainer-review\` and MUST NOT apply \`repoman:merge-ready\`.
- Verify that \`.github/workflows/repoman-agent.md\` and \`.github/workflows/repoman-agent.lock.yml\` remain synchronized whenever either file is edited.

## Step 4 — Triage Summary & Merge Coordination
Post one concise, structured triage comment containing:
1. **Scope & Boundary Matrix:** Touched layers and whether \`src/core/\` purity and 432 Hz / Dragon 9 invariants passed.
2. **Verification Results:** Exact pass/fail status for \`npm run lint\`, \`npm run build\`, and boundary checks.
3. **Merge Verdict:**
   - Apply \`gate:verified\` and \`repoman:merge-ready\` ONLY when all checks pass, the PR is not a draft, and no protected files were modified.
   - Otherwise, explain the exact blocking item or maintainer review requirement cleanly.`;

export const REPOMAN_LOCK_YML_CONTENT = `# Compiled from .github/workflows/repoman-agent.md
# Target Repository: fluidmotiontv.site
# Architecture: Read-only preflight verification + isolated boundary triage + guarded merge coordination

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
  group: repoman-agent-\${{ github.event.pull_request.number || github.ref }}
  cancel-in-progress: true

jobs:
  preflight-and-boundary-audit:
    name: Preflight Build & Harmonic Boundary Audit
    runs-on: ubuntu-latest
    timeout-minutes: 15
    permissions:
      contents: read
      pull-requests: write
      checks: read

    outputs:
      lint_passed: \${{ steps.verify.outputs.lint_passed }}
      build_passed: \${{ steps.verify.outputs.build_passed }}
      boundary_passed: \${{ steps.boundary.outputs.boundary_passed }}
      protected_touched: \${{ steps.classify.outputs.protected_touched }}
      scope_labels: \${{ steps.classify.outputs.scope_labels }}
      merge_eligible: \${{ steps.verdict.outputs.merge_eligible }}

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
          echo "lint_passed=\${LINT_OK}" >> "$GITHUB_OUTPUT"
          echo "build_passed=\${BUILD_OK}" >> "$GITHUB_OUTPUT"
          if [ "$LINT_OK" != "true" ] || [ "$BUILD_OK" != "true" ]; then
            exit 1
          fi

      - name: Classify PR diff scope & protected boundaries
        id: classify
        env:
          BASE_REF: \${{ github.base_ref || 'main' }}
        run: |
          git fetch origin "$BASE_REF" --depth=1 || true
          CHANGED_FILES=$(git diff --name-only "origin/\${BASE_REF}...HEAD" || git diff --name-only HEAD~1..HEAD || echo "")

          LABELS=()
          PROTECTED="false"

          if echo "$CHANGED_FILES" | grep -qE '^src/core/'; then
            LABELS+=("scope:core-harmonic")
          fi
          if echo "$CHANGED_FILES" | grep -qE '^(src/components/|src/App\\.tsx|src/index\\.css|index\\.html)'; then
            LABELS+=("scope:portal-ui")
          fi
          if echo "$CHANGED_FILES" | grep -qE '^\\.github/workflows/'; then
            LABELS+=("scope:workflow-ci")
            PROTECTED="true"
          fi
          if echo "$CHANGED_FILES" | grep -qE '^(AGENTS\\.md|\\.github/copilot-instructions\\.md|.*\\.md)$'; then
            LABELS+=("scope:docs-agents")
            if echo "$CHANGED_FILES" | grep -qE '^(AGENTS\\.md|\\.github/copilot-instructions\\.md)$'; then
              PROTECTED="true"
            fi
          fi
          if echo "$CHANGED_FILES" | grep -qE '^package(-lock)?\\.json$'; then
            LABELS+=("scope:dependencies")
            PROTECTED="true"
          fi

          JOINED_LABELS=$(IFS=,; echo "\${LABELS[*]}")
          echo "scope_labels=\${JOINED_LABELS}" >> "$GITHUB_OUTPUT"
          echo "protected_touched=\${PROTECTED}" >> "$GITHUB_OUTPUT"

      - name: Audit 432 Hz Pythagorean & Dragon 9 Nonary boundaries
        id: boundary
        run: |
          BOUNDARY_OK=true

          # 1. Ensure src/core/ has zero React or DOM imports
          if [ -d "src/core" ]; then
            if grep -rnE "from ['\\"]react|window\\.|document\\." src/core/; then
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
            if grep -qE "PYTHAGOREAN_BASE_HZ\\s*=\\s*440" src/core/harmonicEngine.ts; then
              echo "Boundary violation: Equal-temperament 440 Hz override detected"
              BOUNDARY_OK=false
            fi
          fi

          # 3. Verify AGENTS.md and repoman-agent.md parity exists
          if [ ! -f "AGENTS.md" ] || [ ! -f ".github/workflows/repoman-agent.md" ]; then
            echo "Boundary violation: Missing sovereign agent files"
            BOUNDARY_OK=false
          fi

          echo "boundary_passed=\${BOUNDARY_OK}" >> "$GITHUB_OUTPUT"
          if [ "$BOUNDARY_OK" != "true" ]; then
            exit 1
          fi

      - name: Compute merge eligibility verdict
        id: verdict
        run: |
          IS_DRAFT="\${{ github.event.pull_request.draft || false }}"
          SAME_REPO="true"
          if [ "\${{ github.event.pull_request.head.repo.full_name }}" != "\${{ github.repository }}" ] && [ -n "\${{ github.event.pull_request.head.repo.full_name }}" ]; then
            SAME_REPO="false"
          fi

          ELIGIBLE="false"
          if [ "\${{ steps.verify.outputs.lint_passed }}" = "true" ] && \\
             [ "\${{ steps.verify.outputs.build_passed }}" = "true" ] && \\
             [ "\${{ steps.boundary.outputs.boundary_passed }}" = "true" ] && \\
             [ "\${{ steps.classify.outputs.protected_touched }}" = "false" ] && \\
             [ "$IS_DRAFT" = "false" ] && \\
             [ "$SAME_REPO" = "true" ]; then
            ELIGIBLE="true"
          fi

          echo "merge_eligible=\${ELIGIBLE}" >> "$GITHUB_OUTPUT"

      - name: Apply triage labels & post Repoman verdict comment
        if: always() && (github.event_name == 'pull_request' || inputs.pr_number != '')
        env:
          GH_TOKEN: \${{ secrets.GITHUB_TOKEN }}
          PR_NUMBER: \${{ github.event.pull_request.number || inputs.pr_number }}
          SCOPE_LABELS: \${{ steps.classify.outputs.scope_labels }}
          PROTECTED_TOUCHED: \${{ steps.classify.outputs.protected_touched }}
          LINT_PASSED: \${{ steps.verify.outputs.lint_passed }}
          BUILD_PASSED: \${{ steps.verify.outputs.build_passed }}
          BOUNDARY_PASSED: \${{ steps.boundary.outputs.boundary_passed }}
          MERGE_ELIGIBLE: \${{ steps.verdict.outputs.merge_eligible }}
        run: |
          if [ -z "$PR_NUMBER" ]; then
            echo "No PR number present; skipping PR comment/label step."
            exit 0
          fi

          IFS=',' read -ra LABEL_LIST <<< "$SCOPE_LABELS"
          for lbl in "\${LABEL_LIST[@]}"; do
            if [ -n "$lbl" ]; then
              gh pr edit "$PR_NUMBER" --add-label "$lbl" || true
            fi
          done

          if [ "$BOUNDARY_PASSED" = "true" ] && [ "$LINT_PASSED" = "true" ] && [ "$BUILD_PASSED" = "true" ]; then
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
          | TypeScript Lint (\\\`npm run lint\\\`) | \\\`\${LINT_PASSED}\\\` |
          | Portal Build (\\\`npm run build\\\`) | \\\`\${BUILD_PASSED}\\\` |
          | 432 Hz / Dragon 9 Boundary Audit | \\\`\${BOUNDARY_PASSED}\\\` |
          | Protected Files Modified | \\\`\${PROTECTED_TOUCHED}\\\` |
          | **Merge Eligible** | \\\`\${MERGE_ELIGIBLE}\\\` |

          **Detected Scopes:** \\\`\${SCOPE_LABELS:-none}\\\`
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
          GH_TOKEN: \${{ secrets.GITHUB_TOKEN }}
          PR_NUMBER: \${{ github.event.pull_request.number }}
        run: |
          gh pr merge "$PR_NUMBER" --auto --squash --delete-branch || echo "Auto-merge requires repository setting 'Allow auto-merge' to be enabled."`;

export const PACKAGE_ARTIFACTS: readonly PackageArtifact[] = [
  {
    id: 'agents-md',
    path: 'AGENTS.md',
    title: 'Sovereign Agent Context',
    category: 'Context Spec',
    language: 'markdown',
    description:
      'Defines the architecture, folder layout, 432 Hz Pythagorean pitch invariants, Dragon 9 Nonary Clock lattice, and merge boundaries for AI coding assistants.',
    content: AGENTS_MD_CONTENT,
  },
  {
    id: 'copilot-instructions',
    path: '.github/copilot-instructions.md',
    title: 'Copilot & IDE Instructions',
    category: 'Assistant Rules',
    language: 'markdown',
    description:
      'Concise instruction mirror read automatically by GitHub Copilot and cloud coding workspaces to enforce pure core separation and pre-commit gates.',
    content: COPILOT_INSTRUCTIONS_CONTENT,
  },
  {
    id: 'repoman-md',
    path: '.github/workflows/repoman-agent.md',
    title: 'Repoman Agent Workflow (Markdown)',
    category: 'Workflow Source',
    language: 'markdown',
    description:
      'Continuous AI natural-language workflow specification with read-only permissions, safe-outputs allowlists, PR scope rules, and security boundaries.',
    content: REPOMAN_WORKFLOW_MD_CONTENT,
  },
  {
    id: 'repoman-lock',
    path: '.github/workflows/repoman-agent.lock.yml',
    title: 'Compiled Workflow Lockfile',
    category: 'Compiled Lockfile',
    language: 'yaml',
    description:
      'Deterministic GitHub Actions YAML lockfile executing npm ci, TypeScript lint, Vite build, 432 Hz boundary checks, PR triage labeling, and guarded squash auto-merge.',
    content: REPOMAN_LOCK_YML_CONTENT,
  },
];

export interface SamplePullRequest {
  readonly number: number;
  readonly title: string;
  readonly author: string;
  readonly branch: string;
  readonly changedFiles: readonly string[];
  readonly lintPassed: boolean;
  readonly buildPassed: boolean;
  readonly isDraft: boolean;
  readonly isExternalFork: boolean;
  readonly diffContainsCoreReactImport: boolean;
  readonly diffContains440Override: boolean;
}

export const SAMPLE_PULL_REQUESTS: readonly SamplePullRequest[] = [
  {
    number: 142,
    title: 'feat(core): add 3-limit quintal overtone harmonic phase helper',
    author: 'k.nakamura',
    branch: 'feat/quintal-phase',
    changedFiles: ['src/core/harmonicEngine.ts', 'src/components/HarmonicClockPanel.tsx'],
    lintPassed: true,
    buildPassed: true,
    isDraft: false,
    isExternalFork: false,
    diffContainsCoreReactImport: false,
    diffContains440Override: false,
  },
  {
    number: 143,
    title: 'ci(repoman): tighten safe-outputs label allowlist',
    author: 'a.lindqvist',
    branch: 'ci/repoman-labels',
    changedFiles: [
      '.github/workflows/repoman-agent.md',
      '.github/workflows/repoman-agent.lock.yml',
      'AGENTS.md',
    ],
    lintPassed: true,
    buildPassed: true,
    isDraft: false,
    isExternalFork: false,
    diffContainsCoreReactImport: false,
    diffContains440Override: false,
  },
  {
    number: 144,
    title: 'fix(audio): switch fundamental baseline to 440 Hz with useEffect hook in core',
    author: 'contributor-ext',
    branch: 'fork/equal-temp',
    changedFiles: ['src/core/harmonicEngine.ts'],
    lintPassed: true,
    buildPassed: true,
    isDraft: false,
    isExternalFork: true,
    diffContainsCoreReactImport: true,
    diffContains440Override: true,
  },
  {
    number: 145,
    title: 'ui(portal): refine nonary sector progress typography',
    author: 'm.solis',
    branch: 'ui/nonary-type',
    changedFiles: ['src/components/HarmonicClockPanel.tsx', 'src/index.css'],
    lintPassed: true,
    buildPassed: true,
    isDraft: false,
    isExternalFork: false,
    diffContainsCoreReactImport: false,
    diffContains440Override: false,
  },
];

export interface RunbookStep {
  readonly id: string;
  readonly stepNumber: string;
  readonly title: string;
  readonly description: string;
  readonly command: string;
  readonly verificationHint: string;
}

export const EXECUTION_RUNBOOK_STEPS: readonly RunbookStep[] = [
  {
    id: 'verify-local',
    stepNumber: '01',
    title: 'Verify TypeScript, Portal Build & Core Purity Locally',
    description:
      'Run the exact deterministic verification gates enforced by Repoman Agent before staging any repository changes.',
    command: `npm ci
npm run lint
npm run build
grep -rnE "from ['\\"]react|window\\.|document\\." src/core/ || echo "Core purity verified"`,
    verificationHint: 'Expect zero TypeScript errors, a clean dist/ Vite bundle, and Core purity verified.',
  },
  {
    id: 'create-labels',
    stepNumber: '02',
    title: 'Provision Repoman Triage Labels in GitHub',
    description:
      'Ensure the repository has the deterministic scope, gate, and merge-readiness labels used by the workflow.',
    command: `for lbl in \\
  "scope:core-harmonic" "scope:portal-ui" "scope:workflow-ci" "scope:docs-agents" "scope:dependencies" \\
  "gate:verified" "gate:boundary-violation" "needs-maintainer-review" "repoman:merge-ready"; do
  gh label create "$lbl" --force
done`,
    verificationHint: 'All 9 triage labels exist on the target GitHub repository.',
  },
  {
    id: 'compile-sync',
    stepNumber: '03',
    title: 'Validate & Commit the Sovereign Agent Package',
    description:
      'If using GitHub Agentic Workflows (gh-aw), recompile the markdown source to keep lockfile parity, then stage and commit all deliverables.',
    command: `# Optional if gh-aw extension is installed:
# gh aw compile .github/workflows/repoman-agent.md

git add AGENTS.md .github/copilot-instructions.md .github/workflows/repoman-agent.md .github/workflows/repoman-agent.lock.yml src/
git commit -m "chore(repoman): integrate sovereign AGENTS.md and Continuous AI triage workflow"
git push -u origin main`,
    verificationHint: 'Both repoman-agent.md and repoman-agent.lock.yml are committed in the same revision.',
  },
  {
    id: 'enable-automerge',
    stepNumber: '04',
    title: 'Enable Repository Auto-Merge & Branch Protection',
    description:
      'Allow Repoman Agent’s guarded squash coordinator to merge verified non-protected PRs automatically once checks pass.',
    command: `gh repo edit --enable-auto-merge --enable-squash-merge --delete-branch-on-merge
gh workflow view "Repoman Agent — Sovereign Triage & Sync"`,
    verificationHint: 'Auto-merge is enabled and the workflow appears active under Actions.',
  },
  {
    id: 'test-loop',
    stepNumber: '05',
    title: 'Trigger & Verify the Live Agent Loop on a Test PR',
    description:
      'Open a small branch updating portal copy or run workflow_dispatch to verify PR comment reporting, label sorting, and merge coordination.',
    command: `git checkout -b test/repoman-loop-check
npm run lint && npm run build
git commit --allow-empty -m "test: verify repoman agent triage loop"
git push -u origin test/repoman-loop-check
gh pr create --fill --base main
gh pr checks --watch`,
    verificationHint: 'Repoman Agent posts the Triage Report table, applies gate:verified, and marks repoman:merge-ready.',
  },
];

/**
 * Generates a self-contained bash script that writes AGENTS.md, copilot-instructions.md,
 * repoman-agent.md, and repoman-agent.lock.yml into any local clone of fluidmotiontv.site.
 */
export function buildInstallerShellScript(): string {
  return `#!/usr/bin/env bash
set -euo pipefail

mkdir -p .github/workflows

cat <<'__AGENTS_EOF__' > AGENTS.md
${AGENTS_MD_CONTENT}
__AGENTS_EOF__

cat <<'__COPILOT_EOF__' > .github/copilot-instructions.md
${COPILOT_INSTRUCTIONS_CONTENT}
__COPILOT_EOF__

cat <<'__REPOMAN_MD_EOF__' > .github/workflows/repoman-agent.md
${REPOMAN_WORKFLOW_MD_CONTENT}
__REPOMAN_MD_EOF__

cat <<'__REPOMAN_LOCK_EOF__' > .github/workflows/repoman-agent.lock.yml
${REPOMAN_LOCK_YML_CONTENT}
__REPOMAN_LOCK_EOF__

echo "Installed Repoman Agent package for fluidmotiontv.site."
echo "Next: run 'npm run lint && npm run build' and commit the staged files."
`;
}
