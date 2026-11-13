/**
 * Pure domain core for fluidmotiontv.site
 * Strictly zero React, DOM, or browser global imports.
 * Enforces 432 Hz Pythagorean tuning & Dragon 9 Nonary Clock determinism.
 */

export const PYTHAGOREAN_BASE_HZ = 432;
export const DRAGON_NONARY_RADIX = 9;
export const MS_PER_SOLAR_DAY = 86_400_000;
export const MS_PER_SECTOR = MS_PER_SOLAR_DAY / DRAGON_NONARY_RADIX; // 9,600,000 ms (2h 40m)
export const MS_PER_NONAD = MS_PER_SECTOR / 81; // 118,518.518... ms
export const MS_PER_BEAT = MS_PER_NONAD / DRAGON_NONARY_RADIX; // 13,168.724... ms
export const MS_PER_PULSE = MS_PER_BEAT / DRAGON_NONARY_RADIX; // 1,463.191... ms

export interface PythagoreanInterval {
  readonly id: string;
  readonly name: string;
  readonly ratioLabel: string;
  readonly multiplier: number;
  readonly frequencyHz: number;
}

export const PYTHAGOREAN_SCALE: readonly PythagoreanInterval[] = [
  { id: 'unison', name: 'Unison Fundamental', ratioLabel: '1:1', multiplier: 1, frequencyHz: 432 },
  { id: 'major-second', name: 'Pythagorean Major Second', ratioLabel: '9:8', multiplier: 9 / 8, frequencyHz: 486 },
  { id: 'major-third', name: 'Pythagorean Major Third', ratioLabel: '81:64', multiplier: 81 / 64, frequencyHz: 546.75 },
  { id: 'perfect-fourth', name: 'Perfect Fourth', ratioLabel: '4:3', multiplier: 4 / 3, frequencyHz: 576 },
  { id: 'perfect-fifth', name: 'Perfect Fifth', ratioLabel: '3:2', multiplier: 3 / 2, frequencyHz: 648 },
  { id: 'major-sixth', name: 'Pythagorean Major Sixth', ratioLabel: '27:16', multiplier: 27 / 16, frequencyHz: 729 },
  { id: 'major-seventh', name: 'Pythagorean Major Seventh', ratioLabel: '243:128', multiplier: 243 / 128, frequencyHz: 820.125 },
  { id: 'octave', name: 'Harmonic Octave', ratioLabel: '2:1', multiplier: 2, frequencyHz: 864 },
] as const;

export interface DragonNonaryState {
  readonly epochMs: number;
  readonly sector: number; // 0..8
  readonly nonad: number; // 0..80
  readonly beat: number; // 0..8
  readonly pulse: number; // 0..8
  readonly formattedCode: string; // S.NN.B.P
  readonly dayProgress: number; // 0..1
  readonly sectorProgress: number; // 0..1
  readonly phaseRadians: number; // 0..2PI
  readonly subHarmonicEnvelopeHz: number; // 432 / 27 = 16 Hz
}

/**
 * Computes deterministic Dragon 9 Nonary Clock state from UTC epoch milliseconds.
 * Zero floating-point accumulation drift.
 */
export function computeDragonNonaryState(epochMs: number): DragonNonaryState {
  const safeMs = Number.isFinite(epochMs) ? Math.max(0, epochMs) : 0;
  const dayMs = safeMs % MS_PER_SOLAR_DAY;

  const sector = Math.floor(dayMs / MS_PER_SECTOR) % DRAGON_NONARY_RADIX;
  const remAfterSector = dayMs % MS_PER_SECTOR;

  const nonad = Math.floor(remAfterSector / MS_PER_NONAD) % 81;
  const remAfterNonad = remAfterSector % MS_PER_NONAD;

  const beat = Math.floor(remAfterNonad / MS_PER_BEAT) % DRAGON_NONARY_RADIX;
  const remAfterBeat = remAfterNonad % MS_PER_BEAT;

  const pulse = Math.floor(remAfterBeat / MS_PER_PULSE) % DRAGON_NONARY_RADIX;
  const remAfterPulse = remAfterBeat % MS_PER_PULSE;

  const pulseFraction = remAfterPulse / MS_PER_PULSE;
  const phaseRadians = pulseFraction * Math.PI * 2;

  const nonadBase9 = `${Math.floor(nonad / 9)}${nonad % 9}`;
  const formattedCode = `${sector}.${nonadBase9}.${beat}.${pulse}`;

  return {
    epochMs: safeMs,
    sector,
    nonad,
    beat,
    pulse,
    formattedCode,
    dayProgress: dayMs / MS_PER_SOLAR_DAY,
    sectorProgress: remAfterSector / MS_PER_SECTOR,
    phaseRadians,
    subHarmonicEnvelopeHz: PYTHAGOREAN_BASE_HZ / 27,
  };
}

/**
 * Evaluates normalized liquid standing-wave amplitude (-1..1)
 * combining fundamental 432 Hz ratio and Dragon 9 nonary phase modulation.
 */
export function sampleHarmonicWave(
  xNormalized: number,
  timeSec: number,
  interval: PythagoreanInterval,
  nonaryState: DragonNonaryState
): number {
  const spatialCycles = 2 * interval.multiplier;
  const envelopeMod = 0.85 + 0.15 * Math.cos(nonaryState.phaseRadians);
  const primary = Math.sin(
    xNormalized * Math.PI * 2 * spatialCycles - timeSec * (interval.multiplier * 2.4)
  );
  const fifthOvermode =
    0.32 *
    Math.sin(
      xNormalized * Math.PI * 2 * (spatialCycles * 1.5) + timeSec * 1.618 + nonaryState.phaseRadians
    );
  const subHarmonic =
    0.18 *
    Math.cos(
      xNormalized * Math.PI * 2 * 1.0 - timeSec * 0.9 + (nonaryState.sector / DRAGON_NONARY_RADIX) * Math.PI * 2
    );

  return ((primary + fifthOvermode + subHarmonic) / 1.5) * envelopeMod;
}

export interface TriageEvaluationResult {
  readonly scopes: readonly string[];
  readonly protectedFilesTouched: readonly string[];
  readonly boundaryViolations: readonly string[];
  readonly mergeEligible: boolean;
  readonly verdict: 'merge-ready' | 'maintainer-review-required' | 'blocked-violation';
  readonly recommendedLabels: readonly string[];
}

const PROTECTED_PATTERNS: readonly RegExp[] = [
  /^\.github\/workflows\//,
  /^AGENTS\.md$/,
  /^\.github\/copilot-instructions\.md$/,
  /^package(-lock)?\.json$/,
];

/**
 * Deterministic PR triage classifier mirroring .github/workflows/repoman-agent.lock.yml
 */
export function evaluatePrTriage(params: {
  changedFiles: readonly string[];
  lintPassed: boolean;
  buildPassed: boolean;
  isDraft: boolean;
  isExternalFork: boolean;
  diffContainsCoreReactImport?: boolean;
  diffContains440Override?: boolean;
}): TriageEvaluationResult {
  const scopes = new Set<string>();
  const protectedFilesTouched: string[] = [];
  const boundaryViolations: string[] = [];

  for (const rawFile of params.changedFiles) {
    const file = rawFile.trim();
    if (!file) continue;

    if (/^src\/core\//.test(file)) {
      scopes.add('scope:core-harmonic');
    }
    if (/^(src\/components\/|src\/App\.tsx|src\/index\.css|index\.html)/.test(file)) {
      scopes.add('scope:portal-ui');
    }
    if (/^\.github\/workflows\//.test(file)) {
      scopes.add('scope:workflow-ci');
    }
    if (/^(AGENTS\.md|\.github\/copilot-instructions\.md|.*\.md)$/.test(file)) {
      scopes.add('scope:docs-agents');
    }
    if (/^package(-lock)?\.json$/.test(file)) {
      scopes.add('scope:dependencies');
    }

    if (PROTECTED_PATTERNS.some((pattern) => pattern.test(file))) {
      protectedFilesTouched.push(file);
    }
  }

  // Enforce workflow parity rule: repoman-agent.md and repoman-agent.lock.yml must sync together
  const touchedMd = params.changedFiles.some((f) => f.trim() === '.github/workflows/repoman-agent.md');
  const touchedLock = params.changedFiles.some((f) => f.trim() === '.github/workflows/repoman-agent.lock.yml');
  if (touchedMd !== touchedLock) {
    boundaryViolations.push(
      'Workflow parity mismatch: .github/workflows/repoman-agent.md and repoman-agent.lock.yml must be updated together.'
    );
  }

  if (params.diffContainsCoreReactImport) {
    boundaryViolations.push('Core purity violation: React/DOM reference detected inside src/core/.');
  }
  if (params.diffContains440Override) {
    boundaryViolations.push('Tuning invariant violation: 440 Hz override detected instead of PYTHAGOREAN_BASE_HZ = 432.');
  }
  if (!params.lintPassed) {
    boundaryViolations.push('TypeScript verification gate failed (npm run lint).');
  }
  if (!params.buildPassed) {
    boundaryViolations.push('Production portal bundle failed (npm run build).');
  }

  const labels = new Set<string>(scopes);
  if (boundaryViolations.length > 0) {
    labels.add('gate:boundary-violation');
  } else {
    labels.add('gate:verified');
  }

  const needsMaintainer = protectedFilesTouched.length > 0 || params.isExternalFork || params.isDraft;
  if (protectedFilesTouched.length > 0 || params.isExternalFork) {
    labels.add('needs-maintainer-review');
  }

  const mergeEligible = boundaryViolations.length === 0 && !needsMaintainer;
  if (mergeEligible) {
    labels.add('repoman:merge-ready');
  }

  const verdict: TriageEvaluationResult['verdict'] =
    boundaryViolations.length > 0
      ? 'blocked-violation'
      : needsMaintainer
        ? 'maintainer-review-required'
        : 'merge-ready';

  return {
    scopes: Array.from(scopes),
    protectedFilesTouched,
    boundaryViolations,
    mergeEligible,
    verdict,
    recommendedLabels: Array.from(labels),
  };
}
