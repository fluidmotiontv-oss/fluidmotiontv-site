import { useState } from 'react';
import { Activity, Download, FileCode2, GitPullRequest, Layers, Terminal } from 'lucide-react';
import { ExecutionRunbook } from './components/ExecutionRunbook';
import { HarmonicClockPanel } from './components/HarmonicClockPanel';
import { PackageArtifactsView } from './components/PackageArtifactsView';
import { PrTriageSimulator } from './components/PrTriageSimulator';
import { PYTHAGOREAN_BASE_HZ } from './core/harmonicEngine';
import { PACKAGE_ARTIFACTS, buildInstallerShellScript } from './data/repomanPackage';

type WorkspaceSection = 'overview' | 'clock' | 'artifacts' | 'triage' | 'runbook';

const NAV_ITEMS: readonly {
  readonly id: WorkspaceSection;
  readonly label: string;
  readonly icon: typeof Layers;
}[] = [
  { id: 'overview', label: 'Overview', icon: Layers },
  { id: 'clock', label: 'Harmonic Clock', icon: Activity },
  { id: 'artifacts', label: 'Package Files', icon: FileCode2 },
  { id: 'triage', label: 'PR Triage Gate', icon: GitPullRequest },
  { id: 'runbook', label: 'Runbook', icon: Terminal },
];

export default function App() {
  const [activeSection, setActiveSection] = useState<WorkspaceSection>('overview');

  const handleDownloadInstaller = () => {
    const script = buildInstallerShellScript();
    const blob = new Blob([script], { type: 'text/x-shellscript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'install-repoman-fluidmotiontv.sh';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col lg:flex-row">
      {/* Left Navigation Sidebar (256px desktop) */}
      <aside className="w-full lg:w-64 lg:shrink-0 bg-white border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col justify-between">
        <div>
          <div className="h-16 px-6 flex items-center border-b border-slate-200">
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                setActiveSection('overview');
              }}
              className="text-base font-display font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
            >
              fluidmotiontv.site
            </a>
          </div>

          <nav aria-label="Workspace sections" className="p-3 flex lg:flex-col gap-1 overflow-x-auto">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer text-left ${
                    isActive
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Clean Unboxed Repository Summary */}
        <div className="hidden lg:block p-5 border-t border-slate-200 text-xs text-slate-500 space-y-2">
          <div className="font-medium text-slate-800">Sovereign Architecture</div>
          <div className="flex items-center justify-between">
            <span>Fundamental Pitch</span>
            <span className="font-mono tabular-nums text-slate-700">{PYTHAGOREAN_BASE_HZ} Hz</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Clock Radix</span>
            <span className="font-mono tabular-nums text-slate-700">Base-9 Nonary</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Deliverables</span>
            <span className="font-mono tabular-nums text-slate-700">{PACKAGE_ARTIFACTS.length} files</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div id="top" className="flex-1 min-w-0 flex flex-col">
        {/* Top Bar Contract: Breadcrumb on left, 1 primary CTA on right */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 lg:px-8 flex items-center justify-between gap-8 shrink-0">
          <div className="flex items-center gap-2 text-sm text-slate-600 min-w-0 truncate">
            <span className="font-medium text-slate-900 whitespace-nowrap">Repoman Agent</span>
            <span aria-hidden="true">/</span>
            <span className="truncate">
              {NAV_ITEMS.find((n) => n.id === activeSection)?.label ?? 'Overview'}
            </span>
          </div>

          <button
            type="button"
            onClick={handleDownloadInstaller}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Download Installer</span>
          </button>
        </header>

        {/* Workspace Viewport */}
        <main className="flex-1 px-6 py-8 lg:px-10 lg:py-10 max-w-6xl w-full mx-auto space-y-12">
          {/* Hero Summary Header */}
          <div className="border-b border-slate-200 pb-8">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span>Continuous AI Workflow</span>
              <span aria-hidden="true">·</span>
              <span>432 Hz Pythagorean Standard</span>
              <span aria-hidden="true">·</span>
              <span>Dragon 9 Nonary Clock</span>
            </div>
            <h1 className="mt-3 text-2xl sm:text-3xl font-display font-bold tracking-tight text-slate-900 max-w-3xl text-balance">
              Sovereign Repoman Agent Package for fluidmotiontv.site
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
              Synchronizes AI assistant context (<code className="text-xs font-mono text-slate-800">AGENTS.md</code>), Continuous AI GitHub Actions triage (<code className="text-xs font-mono text-slate-800">repoman-agent.md</code> &amp; <code className="text-xs font-mono text-slate-800">repoman-agent.lock.yml</code>), and the live 432 Hz portal frontend under strict component boundaries.
            </p>
          </div>

          {(activeSection === 'overview' || activeSection === 'clock') && <HarmonicClockPanel />}
          {(activeSection === 'overview' || activeSection === 'artifacts') && <PackageArtifactsView />}
          {(activeSection === 'overview' || activeSection === 'triage') && <PrTriageSimulator />}
          {(activeSection === 'overview' || activeSection === 'runbook') && <ExecutionRunbook />}
        </main>

        <footer className="border-t border-slate-200 bg-white px-6 lg:px-10 py-5 text-xs text-slate-500 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span>fluidmotiontv.site · Sovereign Repository Integration</span>
          <span className="font-mono">AGENTS.md · .github/workflows/repoman-agent.md · repoman-agent.lock.yml</span>
        </footer>
      </div>
    </div>
  );
}
