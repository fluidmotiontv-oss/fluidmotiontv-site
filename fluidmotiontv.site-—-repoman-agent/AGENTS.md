# AGENTS.md — fluidmotiontv.site Sovereign Repository Instructions

This file defines the canonical architecture, domain invariants, component boundaries, and Continuous AI operational rules for **fluidmotiontv.site**. Any local coding assistant, cloud agent, or GitHub Actions workflow operating in this repository must read and enforce these constraints before proposing or merging changes.

---

## 1. Repository Identity & Domain Constraints

- **Target Domain:** `fluidmotiontv.site` — Harmonic liquid dynamics, 432 Hz Pythagorean acoustic geometry, and Dragon 9 Nonary Clock synchronization.
- **Primary Stack:** React 19, TypeScript, Vite 8, Tailwind CSS v4 (`@tailwindcss/vite`), Lucide Icons, Motion, and optional Express server (`server.ts`, port `3000`).
- **Verification Gate:** Every pull request and local commit must pass both `npm run lint` (`tsc --noEmit`) and `npm run build` (`vite build`) with zero errors.

---

## 2. Folder Structure & Component Boundaries

```text
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
```

### Strict Architectural Boundary Rules
1. **Pure Domain Core (`src/core/**`):**
   - Must contain **zero** React imports (`react`, `react-dom`), zero DOM globals (`window`, `document`), and zero network calls.
   - All functions must be deterministic, side-effect-free, and unit-testable in Node.js or browser workers.
2. **UI Components (`src/components/**`):**
   - Consume state and pure calculations from `src/core/` via props or local hooks.
   - Never embed hardcoded magic timing constants that contradict `src/core/harmonicEngine.ts`.
   - Maintain Tailwind CSS v4 utility styling; no inline CSS stylesheets or `!important` theme hacks.
   - Respect `prefers-reduced-motion` for all canvas/animation loops.
3. **Workflow & Security Files (`.github/workflows/**`, `AGENTS.md`):**
   - Changes touching `.github/workflows/**` or `AGENTS.md` are **protected boundary changes**: the Repoman Agent must flag them with `needs-maintainer-review` and must **never** auto-merge them without explicit human approval.

---

## 3. 432 Hz Pythagorean Frequency Invariants

All harmonic synthesis and fluid wave phase calculations in `fluidmotiontv.site` are anchored to **Verdi / Pythagorean scientific pitch**:

- **Reference Fundamental:** `A4 = 432.000 Hz` (never `440 Hz` equal temperament).
- **Pythagorean Just & Quintal Ratios (3-Limit Tuning):**
  - Unison (`1:1`): `432.00 Hz`
  - Major Second (`9:8`): `486.00 Hz`
  - Pythagorean Major Third (`81:64`): `546.75 Hz`
  - Perfect Fourth (`4:3`): `576.00 Hz`
  - Perfect Fifth (`3:2`): `648.00 Hz`
  - Pythagorean Major Sixth (`27:16`): `729.00 Hz`
  - Pythagorean Major Seventh (`243:128`): `820.125 Hz`
  - Octave (`2:1`): `864.00 Hz`
- **Audio & Render Safety:**
  - Any Web Audio API oscillator must default to **muted/off** and initialize only inside an explicit user click handler with smooth `linearRampToValueAtTime` gain envelopes to prevent clipping.

---

## 4. Dragon 9 Nonary Clock Constraints

Time synchronization across the live portal uses the **Dragon 9 Nonary Clock** (base-9 temporal lattice):

- **Nonary Radix:** Base `9` (`0` through `8` per register).
- **Register Hierarchy:**
  - **Cycle (`C`):** `9` Nonary Sectors (`0–8`) dividing the solar day (`86,400,000 ms / 9 = 9,600,000 ms` per sector, i.e., `2h 40m` per sector).
  - **Nonad (`N`):** `81` Sub-Nonads per Sector (`9^2`, each `118,518.518... ms`).
  - **Beat (`B`):** `9` Micro-Beats per Nonad (`13,168.724... ms` each).
  - **Pulse (`P`):** `9` Harmonic Pulses per Beat (`1,463.191... ms` each), phase-locked to `432 Hz` sub-harmonics (`432 / 27 = 16 Hz` wave envelope modulation).
- **Determinism Rule:** All Dragon 9 projections must derive from UTC/epoch milliseconds via pure modular arithmetic without mutable global drift accumulators.

---

## 5. Repoman Agent Synchronization Protocol

1. **Triage First:** Classify every PR by touched path (`core:harmonic`, `ui:portal`, `ci:workflow`, `docs:agents`, `infra:deps`).
2. **Compile & Typecheck:** Run `npm ci`, `npm run lint`, and `npm run build` before posting any triage verdict.
3. **Boundary Audit:** Verify `src/core/` has no React/DOM imports and that `repoman-agent.md` remains synchronized with `repoman-agent.lock.yml`.
4. **Safe Outputs Only:** Never execute untrusted PR code with write tokens; separate read/verification steps from guarded triage/merge actions.
