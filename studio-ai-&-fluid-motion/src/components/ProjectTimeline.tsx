import React, { useState } from 'react';
import { History, Save, RotateCcw, Clock, CheckCircle2, GitCommit, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

export interface VersionItem<T> {
  id: string;
  versionNumber: number;
  timestamp: string;
  label: string;
  details?: string;
  snapshot: T;
}

interface ProjectTimelineProps<T> {
  versions: VersionItem<T>[];
  currentVersionId: string;
  onSaveVersion: (label: string) => void;
  onRevertVersion: (version: VersionItem<T>) => void;
  title?: string;
}

export function ProjectTimeline<T>({
  versions,
  currentVersionId,
  onSaveVersion,
  onRevertVersion,
  title = 'Project Version Timeline',
}: ProjectTimelineProps<T>) {
  const [newVersionLabel, setNewVersionLabel] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);

  const handleSave = () => {
    const label = newVersionLabel.trim() || `Snapshot v${versions.length + 1}`;
    onSaveVersion(label);
    setNewVersionLabel('');
  };

  return (
    <div className="bg-[#111] border border-[#333] p-4 space-y-4 font-mono text-[#e0e0e0]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#333] pb-3">
        <div className="flex items-center gap-2.5">
          <History className="w-5 h-5 text-[#F27D26]" />
          <h3 className="font-black italic uppercase text-sm text-[#e0e0e0] tracking-wider">
            {title}
          </h3>
          <span className="bg-[#050505] text-[#00E5FF] border border-[#333] px-2 py-0.5 text-[10px] font-bold uppercase">
            {versions.length} Checkpoints
          </span>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[#888] hover:text-[#e0e0e0] flex items-center gap-1 text-xs uppercase"
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          <span>{isExpanded ? 'Collapse' : 'Expand Timeline'}</span>
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-4">
          {/* Quick Snapshot Creator Bar */}
          <div className="flex items-center gap-2 bg-[#050505] border border-[#333] p-2">
            <input
              type="text"
              value={newVersionLabel}
              onChange={(e) => setNewVersionLabel(e.target.value)}
              placeholder="Enter version description (e.g. Added dialogue, Bpm 85...)"
              className="flex-1 bg-transparent px-3 py-1.5 text-xs font-mono text-[#e0e0e0] placeholder-[#555] focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
              }}
            />
            <button
              onClick={handleSave}
              className="px-4 py-1.5 bg-[#F27D26] hover:bg-[#ff8a38] text-black font-black uppercase text-xs flex items-center gap-1.5 transition-colors shrink-0 border border-[#F27D26]"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Version</span>
            </button>
          </div>

          {/* Visual Node Graph / Timeline List */}
          <div className="relative pl-6 space-y-3 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#333]">
            {versions.map((ver, idx) => {
              const isCurrent = ver.id === currentVersionId;
              const isLatest = idx === versions.length - 1;

              return (
                <div key={ver.id} className="relative flex items-start justify-between gap-4 group">
                  {/* Node Dot Icon */}
                  <div
                    className={`absolute -left-6 top-1 w-5 h-5 rounded-full border flex items-center justify-center text-[9px] font-black z-10 ${
                      isCurrent
                        ? 'bg-[#00FF88] border-[#00FF88] text-black ring-2 ring-[#00FF88]/30 animate-pulse'
                        : 'bg-[#050505] border-[#555] text-[#888] group-hover:border-[#F27D26] group-hover:text-[#F27D26]'
                    }`}
                  >
                    <GitCommit className="w-3 h-3" />
                  </div>

                  {/* Version Info Card */}
                  <div
                    className={`flex-1 p-3 border transition-all ${
                      isCurrent
                        ? 'bg-[#050505] border-[#00FF88]'
                        : 'bg-[#050505] border-[#222] hover:border-[#444]'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-black text-xs uppercase px-1.5 py-0.5 ${
                              isCurrent
                                ? 'bg-[#00FF88] text-black'
                                : 'bg-[#111] text-[#00E5FF] border border-[#333]'
                            }`}
                          >
                            v{ver.versionNumber}
                          </span>
                          <span className="font-bold text-xs text-[#e0e0e0] uppercase">
                            {ver.label}
                          </span>
                          {isCurrent && (
                            <span className="text-[10px] bg-[#00FF88]/10 text-[#00FF88] border border-[#00FF88]/40 px-1.5 py-0.2 font-bold uppercase flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-[#00FF88]" />
                              Active State
                            </span>
                          )}
                        </div>

                        {ver.details && (
                          <p className="text-[11px] text-[#aaa] font-sans">{ver.details}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-[10px] text-[#777] uppercase flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{ver.timestamp}</span>
                        </div>

                        {!isCurrent ? (
                          <button
                            onClick={() => onRevertVersion(ver)}
                            className="px-3 py-1 bg-[#111] hover:bg-[#F27D26] text-[#e0e0e0] hover:text-black border border-[#444] hover:border-[#F27D26] text-[10px] font-black uppercase flex items-center gap-1 transition-colors"
                            title="Revert project state to this version checkpoint"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Revert to v{ver.versionNumber}</span>
                          </button>
                        ) : (
                          <span className="text-[10px] text-[#00FF88] font-bold uppercase italic">
                            Current Version
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
