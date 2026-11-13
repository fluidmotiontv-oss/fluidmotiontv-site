import { useState } from 'react';
import { Check, Copy, Download, FileCode2 } from 'lucide-react';
import { PACKAGE_ARTIFACTS, PackageArtifact, buildInstallerShellScript } from '../data/repomanPackage';

function triggerTextDownload(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export function PackageArtifactsView() {
  const [selectedId, setSelectedId] = useState<string>(PACKAGE_ARTIFACTS[0].id);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeArtifact: PackageArtifact =
    PACKAGE_ARTIFACTS.find((item) => item.id === selectedId) ?? PACKAGE_ARTIFACTS[0];

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      window.setTimeout(() => {
        setCopiedId((current) => (current === id ? null : current));
      }, 2000);
    } catch {
      // Clipboard blocked in restricted frame
    }
  };

  const lines = activeArtifact.content.split('\n');

  return (
    <section aria-labelledby="artifacts-heading" className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="artifacts-heading" className="text-xl font-semibold tracking-tight text-slate-900">
            02. Repoman Agent Repository Deliverables
          </h2>
          <p className="mt-1 text-sm text-slate-600 max-w-2xl">
            Inspect, copy, or export the exact <code className="text-xs font-mono text-slate-800">AGENTS.md</code>, assistant instructions, and Continuous AI workflow files installed in this workspace.
          </p>
        </div>

        <button
          type="button"
          onClick={() => triggerTextDownload('install-repoman-fluidmotiontv.sh', buildInstallerShellScript())}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Download Atomic Installer (.sh)</span>
        </button>
      </div>

      {/* File Selector Tabs */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1" role="tablist" aria-label="Repoman integration files">
            {PACKAGE_ARTIFACTS.map((artifact) => {
              const active = artifact.id === activeArtifact.id;
              return (
                <button
                  key={artifact.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedId(artifact.id)}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <FileCode2 className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                  <span className="font-mono">{artifact.path}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleCopy(activeArtifact.id, activeArtifact.content)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {copiedId === activeArtifact.id ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Copy File</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                const fileName = activeArtifact.path.split('/').pop() ?? 'artifact.txt';
                triggerTextDownload(fileName, activeArtifact.content);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Download</span>
            </button>
          </div>
        </div>

        {/* Unboxed Metadata Line */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">{activeArtifact.title}</h3>
            <p className="text-xs text-slate-600 mt-0.5">{activeArtifact.description}</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 shrink-0 font-mono tabular-nums">
            <span>{activeArtifact.category}</span>
            <span aria-hidden="true">·</span>
            <span>{lines.length} lines</span>
            <span aria-hidden="true">·</span>
            <span>{activeArtifact.language}</span>
          </div>
        </div>

        {/* Code Viewport */}
        <div className="bg-[#0B1120] text-slate-100 overflow-x-auto max-h-[480px] overflow-y-auto">
          <table className="w-full border-collapse text-xs font-mono leading-relaxed">
            <tbody>
              {lines.map((line, index) => (
                <tr key={index} className="hover:bg-slate-800/40">
                  <td className="select-none text-right pr-4 pl-4 py-0.5 text-slate-500 w-12 align-top tabular-nums border-r border-slate-800/80">
                    {index + 1}
                  </td>
                  <td className="pl-4 pr-6 py-0.5 whitespace-pre text-slate-200">
                    {line.length > 0 ? line : ' '}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
