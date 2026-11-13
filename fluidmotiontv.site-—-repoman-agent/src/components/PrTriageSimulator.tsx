import { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, GitPullRequest, ShieldAlert } from 'lucide-react';
import { evaluatePrTriage } from '../core/harmonicEngine';
import { SAMPLE_PULL_REQUESTS } from '../data/repomanPackage';

export function PrTriageSimulator() {
  const [selectedPrNumber, setSelectedPrNumber] = useState<number>(SAMPLE_PULL_REQUESTS[0].number);
  const [customPaths, setCustomPaths] = useState<string>(
    SAMPLE_PULL_REQUESTS[0].changedFiles.join('\n')
  );
  const [lintPassed, setLintPassed] = useState<boolean>(SAMPLE_PULL_REQUESTS[0].lintPassed);
  const [buildPassed, setBuildPassed] = useState<boolean>(SAMPLE_PULL_REQUESTS[0].buildPassed);
  const [isDraft, setIsDraft] = useState<boolean>(SAMPLE_PULL_REQUESTS[0].isDraft);
  const [isExternalFork, setIsExternalFork] = useState<boolean>(
    SAMPLE_PULL_REQUESTS[0].isExternalFork
  );
  const [coreReactViolation, setCoreReactViolation] = useState<boolean>(
    SAMPLE_PULL_REQUESTS[0].diffContainsCoreReactImport
  );
  const [tuning440Violation, setTuning440Violation] = useState<boolean>(
    SAMPLE_PULL_REQUESTS[0].diffContains440Override
  );
  const [verdictFilter, setVerdictFilter] = useState<'all' | 'merge-ready' | 'review-or-blocked'>(
    'all'
  );

  const loadScenario = (prNumber: number) => {
    const scenario = SAMPLE_PULL_REQUESTS.find((p) => p.number === prNumber);
    if (!scenario) return;
    setSelectedPrNumber(scenario.number);
    setCustomPaths(scenario.changedFiles.join('\n'));
    setLintPassed(scenario.lintPassed);
    setBuildPassed(scenario.buildPassed);
    setIsDraft(scenario.isDraft);
    setIsExternalFork(scenario.isExternalFork);
    setCoreReactViolation(scenario.diffContainsCoreReactImport);
    setTuning440Violation(scenario.diffContains440Override);
  };

  const evaluation = useMemo(() => {
    const files = customPaths
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    return evaluatePrTriage({
      changedFiles: files,
      lintPassed,
      buildPassed,
      isDraft,
      isExternalFork,
      diffContainsCoreReactImport: coreReactViolation,
      diffContains440Override: tuning440Violation,
    });
  }, [
    customPaths,
    lintPassed,
    buildPassed,
    isDraft,
    isExternalFork,
    coreReactViolation,
    tuning440Violation,
  ]);

  const evaluatedQueue = useMemo(() => {
    return SAMPLE_PULL_REQUESTS.map((pr) => ({
      pr,
      result: evaluatePrTriage({
        changedFiles: pr.changedFiles,
        lintPassed: pr.lintPassed,
        buildPassed: pr.buildPassed,
        isDraft: pr.isDraft,
        isExternalFork: pr.isExternalFork,
        diffContainsCoreReactImport: pr.diffContainsCoreReactImport,
        diffContains440Override: pr.diffContains440Override,
      }),
    })).filter(({ result }) => {
      if (verdictFilter === 'all') return true;
      if (verdictFilter === 'merge-ready') return result.verdict === 'merge-ready';
      return result.verdict !== 'merge-ready';
    });
  }, [verdictFilter]);

  return (
    <section aria-labelledby="triage-heading" className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="triage-heading" className="text-xl font-semibold tracking-tight text-slate-900">
            03. PR Triage &amp; Boundary Gate Simulator
          </h2>
          <p className="mt-1 text-sm text-slate-600 max-w-2xl">
            Tests the exact classification, 432 Hz boundary audit, and protected-file merge rules compiled into <code className="text-xs font-mono text-slate-800">repoman-agent.lock.yml</code>.
          </p>
        </div>

        <div className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0" role="group" aria-label="Filter triage queue">
          <button
            type="button"
            onClick={() => setVerdictFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              verdictFilter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All PRs
          </button>
          <button
            type="button"
            onClick={() => setVerdictFilter('merge-ready')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              verdictFilter === 'merge-ready' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Merge Ready
          </button>
          <button
            type="button"
            onClick={() => setVerdictFilter('review-or-blocked')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              verdictFilter === 'review-or-blocked'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Review / Blocked
          </button>
        </div>
      </div>

      {/* PR Queue Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-medium text-slate-600">
                <th className="py-3 px-4 font-mono">PR</th>
                <th className="py-3 px-4">Title &amp; Branch</th>
                <th className="py-3 px-4">Scopes</th>
                <th className="py-3 px-4">Triage Verdict</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {evaluatedQueue.map(({ pr, result }) => {
                const isSelected = pr.number === selectedPrNumber;
                return (
                  <tr
                    key={pr.number}
                    className={`transition-colors ${
                      isSelected ? 'bg-teal-50/50' : 'hover:bg-slate-50/80'
                    }`}
                  >
                    <td className="py-3 px-4 font-mono tabular-nums text-xs text-slate-700 whitespace-nowrap">
                      #{pr.number}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-900 text-sm">{pr.title}</div>
                      <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2 font-mono">
                        <span>{pr.author}</span>
                        <span aria-hidden="true">·</span>
                        <span>{pr.branch}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs font-mono text-slate-600">
                      {result.scopes.join(', ') || 'unclassified'}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-xs font-medium">
                      {result.verdict === 'merge-ready' && (
                        <span className="inline-flex items-center gap-1.5 text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Merge Ready</span>
                        </span>
                      )}
                      {result.verdict === 'maintainer-review-required' && (
                        <span className="inline-flex items-center gap-1.5 text-amber-700">
                          <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Maintainer Review</span>
                        </span>
                      )}
                      {result.verdict === 'blocked-violation' && (
                        <span className="inline-flex items-center gap-1.5 text-red-700">
                          <ShieldAlert className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Boundary Blocked</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => loadScenario(pr.number)}
                        className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Inspect Diff Rules
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Rule Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">Simulated PR Diff &amp; Gate Inputs</h3>
            <span className="text-xs font-mono text-slate-500">Live Classifier</span>
          </div>

          <div>
            <label htmlFor="pr-paths-input" className="block text-xs font-medium text-slate-700 mb-1.5">
              Changed File Paths (one per line)
            </label>
            <textarea
              id="pr-paths-input"
              rows={4}
              value={customPaths}
              onChange={(e) => setCustomPaths(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={lintPassed}
                onChange={(e) => setLintPassed(e.target.checked)}
                className="rounded border-slate-300 text-teal-700 focus:ring-teal-600"
              />
              <span>npm run lint passed</span>
            </label>
            <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={buildPassed}
                onChange={(e) => setBuildPassed(e.target.checked)}
                className="rounded border-slate-300 text-teal-700 focus:ring-teal-600"
              />
              <span>npm run build passed</span>
            </label>
            <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={isExternalFork}
                onChange={(e) => setIsExternalFork(e.target.checked)}
                className="rounded border-slate-300 text-teal-700 focus:ring-teal-600"
              />
              <span>PR originates from external fork</span>
            </label>
            <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={isDraft}
                onChange={(e) => setIsDraft(e.target.checked)}
                className="rounded border-slate-300 text-teal-700 focus:ring-teal-600"
              />
              <span>PR is marked Draft</span>
            </label>
            <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={coreReactViolation}
                onChange={(e) => setCoreReactViolation(e.target.checked)}
                className="rounded border-slate-300 text-teal-700 focus:ring-teal-600"
              />
              <span>Inject React import inside src/core/</span>
            </label>
            <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={tuning440Violation}
                onChange={(e) => setTuning440Violation(e.target.checked)}
                className="rounded border-slate-300 text-teal-700 focus:ring-teal-600"
              />
              <span>Inject 440 Hz tuning override</span>
            </label>
          </div>
        </div>

        {/* Computed Triage Output */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <GitPullRequest className="w-4 h-4 text-slate-700" aria-hidden="true" />
                <h3 className="text-sm font-semibold text-slate-900">Repoman Agent Verdict</h3>
              </div>
              <span
                className={`text-xs font-mono font-semibold ${
                  evaluation.verdict === 'merge-ready'
                    ? 'text-emerald-700'
                    : evaluation.verdict === 'maintainer-review-required'
                      ? 'text-amber-700'
                      : 'text-red-700'
                }`}
              >
                {evaluation.verdict}
              </span>
            </div>

            <dl className="space-y-3 text-xs">
              <div>
                <dt className="text-slate-500 font-medium">Assigned Safe-Output Labels</dt>
                <dd className="mt-1 font-mono text-slate-900">
                  {evaluation.recommendedLabels.join(' · ') || 'none'}
                </dd>
              </div>

              <div>
                <dt className="text-slate-500 font-medium">Protected Boundary Files Touched</dt>
                <dd className="mt-1 font-mono text-slate-900">
                  {evaluation.protectedFilesTouched.length > 0
                    ? evaluation.protectedFilesTouched.join(', ')
                    : 'None (eligible for automated squash coordination)'}
                </dd>
              </div>

              <div>
                <dt className="text-slate-500 font-medium">Boundary &amp; Gate Findings</dt>
                {evaluation.boundaryViolations.length > 0 ? (
                  <dd className="mt-1 space-y-1 text-red-700">
                    {evaluation.boundaryViolations.map((violation, idx) => (
                      <div key={idx}>{violation}</div>
                    ))}
                  </dd>
                ) : (
                  <dd className="mt-1 text-emerald-700">
                    All TypeScript, Vite build, and 432 Hz / Dragon 9 Nonary boundaries verified.
                  </dd>
                )}
              </div>
            </dl>
          </div>

          <div className="pt-3 border-t border-slate-100 text-xs text-slate-600 flex items-center justify-between">
            <span>Auto-Merge Action</span>
            <span className="font-mono font-medium text-slate-900">
              {evaluation.mergeEligible
                ? 'gh pr merge --auto --squash --delete-branch'
                : 'Held for maintainer sign-off or gate fix'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
