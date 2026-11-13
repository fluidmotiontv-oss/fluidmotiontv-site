/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Download } from 'lucide-react';

interface TopNavProps {
  activeView: 'globe' | 'treatise' | 'workbench' | 'python' | 'nodes';
  onSelectView: (view: 'globe' | 'treatise' | 'workbench' | 'python' | 'nodes') => void;
  onExportTelemetry: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeView,
  onSelectView,
  onExportTelemetry,
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-3.5 bg-slate-950 border-b border-slate-800 shrink-0 select-none">
      {/* Zone 1: Brand title, one line */}
      <div className="flex items-center gap-3 whitespace-nowrap shrink-0">
        <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400 rotate-45 inline-block" />
        <span className="text-base font-bold tracking-tight text-white font-sans">
          Cathie Harmonic Lattice
        </span>
      </div>

      {/* Zone 2: 4-5 concise single-line nav links */}
      <nav className="hidden md:flex items-center gap-6 text-xs font-medium">
        <button
          onClick={() => onSelectView('globe')}
          className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeView === 'globe'
              ? 'text-cyan-300 font-semibold border-b-2 border-cyan-400 pb-0.5'
              : 'text-slate-400 hover:text-slate-100'
          }`}
        >
          3D Planetary Lattice
        </button>

        <button
          onClick={() => onSelectView('treatise')}
          className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeView === 'treatise'
              ? 'text-cyan-300 font-semibold border-b-2 border-cyan-400 pb-0.5'
              : 'text-slate-400 hover:text-slate-100'
          }`}
        >
          Theoretical Treatise
        </button>

        <button
          onClick={() => onSelectView('workbench')}
          className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeView === 'workbench'
              ? 'text-cyan-300 font-semibold border-b-2 border-cyan-400 pb-0.5'
              : 'text-slate-400 hover:text-slate-100'
          }`}
        >
          Unified Field Workbench
        </button>

        <button
          onClick={() => onSelectView('python')}
          className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeView === 'python'
              ? 'text-cyan-300 font-semibold border-b-2 border-cyan-400 pb-0.5'
              : 'text-slate-400 hover:text-slate-100'
          }`}
        >
          Python Simulator
        </button>

        <button
          onClick={() => onSelectView('nodes')}
          className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeView === 'nodes'
              ? 'text-cyan-300 font-semibold border-b-2 border-cyan-400 pb-0.5'
              : 'text-slate-400 hover:text-slate-100'
          }`}
        >
          Geodetic Node Catalog
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onExportTelemetry}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer font-sans"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Telemetry</span>
        </button>
      </div>
    </header>
  );
};
