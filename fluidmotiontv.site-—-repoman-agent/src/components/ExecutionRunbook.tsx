import { useState } from 'react';
import { Check, Copy, Terminal } from 'lucide-react';
import { EXECUTION_RUNBOOK_STEPS } from '../data/repomanPackage';

export function ExecutionRunbook() {
  const [copiedStepId, setCopiedStepId] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  const handleCopyCommand = async (id: string, command: string) => {
    try {
      await navigator.clipboard.writeText(command);
      setCopiedStepId(id);
      window.setTimeout(() => {
        setCopiedStepId((current) => (current === id ? null : current));
      }, 2000);
    } catch {
      // ignore clipboard restriction
    }
  };

  const toggleCompleted = (id: string) => {
    setCompletedSteps((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section aria-labelledby="runbook-heading" className="space-y-6">
      <div>
        <h2 id="runbook-heading" className="text-xl font-semibold tracking-tight text-slate-900">
          04. Execution &amp; Deployment Verification Runbook
        </h2>
        <p className="mt-1 text-sm text-slate-600 max-w-2xl">
          Step-by-step shell commands to verify local builds, provision triage labels, commit the Repoman Agent package, and confirm the live GitHub Actions loop.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-200">
        {EXECUTION_RUNBOOK_STEPS.map((step) => {
          const isDone = Boolean(completedSteps[step.id]);
          const isCopied = copiedStepId === step.id;

          return (
            <div key={step.id} className="p-5 sm:p-6 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => toggleCompleted(step.id)}
                    aria-pressed={isDone}
                    aria-label={`Mark step ${step.stepNumber} complete`}
                    className={`mt-0.5 w-6 h-6 rounded-md border flex items-center justify-center text-xs font-mono tabular-nums shrink-0 transition-colors cursor-pointer ${
                      isDone
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400'
                    }`}
                  >
                    {isDone ? <Check className="w-3.5 h-3.5" aria-hidden="true" /> : step.stepNumber}
                  </button>
                  <div>
                    <h3 className={`text-sm font-semibold ${isDone ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                      {step.stepNumber}. {step.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1">{step.description}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopyCommand(step.id, step.command)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 self-start sm:self-center cursor-pointer"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Copy Commands</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-[#0B1120] rounded-lg p-4 overflow-x-auto">
                <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 mb-2">
                  <Terminal className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>bash</span>
                </div>
                <pre className="text-xs font-mono text-slate-100 leading-relaxed whitespace-pre">
                  {step.command}
                </pre>
              </div>

              <div className="text-xs text-slate-500">
                Expected result: <span className="text-slate-700">{step.verificationHint}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
