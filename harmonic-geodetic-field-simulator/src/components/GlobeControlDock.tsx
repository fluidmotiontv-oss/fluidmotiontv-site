/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Layers, Eye, Compass, RotateCw } from 'lucide-react';
import { GEODETIC_NODES } from '../math/cathiePhysics';
import { GeodeticNode } from '../types/harmonics';

interface GlobeControlDockProps {
  showCuboctahedron: boolean;
  setShowCuboctahedron: (show: boolean) => void;
  showIcosahedron: boolean;
  setShowIcosahedron: (show: boolean) => void;
  showGreatCircles: boolean;
  setShowGreatCircles: (show: boolean) => void;
  showStandingWaves: boolean;
  setShowStandingWaves: (show: boolean) => void;
  selectedNode: GeodeticNode | null;
  onSelectNode: (node: GeodeticNode) => void;
}

export const GlobeControlDock: React.FC<GlobeControlDockProps> = ({
  showCuboctahedron,
  setShowCuboctahedron,
  showIcosahedron,
  setShowIcosahedron,
  showGreatCircles,
  setShowGreatCircles,
  showStandingWaves,
  setShowStandingWaves,
  selectedNode,
  onSelectNode,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-[94vw] max-w-3xl select-none">
      {/* Collapse / Expand Toggle Button */}
      <div className="flex justify-center -mb-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-mono text-slate-300 bg-slate-900 border border-slate-700 rounded-t-lg hover:bg-slate-800 transition-colors cursor-pointer shadow-lg"
        >
          {collapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          <span>{collapsed ? 'Show Lattice Controls' : 'Hide Controls'}</span>
        </button>
      </div>

      {/* Main Glassmorphic Dock Container */}
      {!collapsed && (
        <div className="bg-slate-900/95 border border-slate-800 rounded-xl p-3 shadow-2xl space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Left: Layer Visibility Toggles */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-slate-400 uppercase mr-1">Lattice Layers:</span>
              
              <button
                onClick={() => setShowCuboctahedron(!showCuboctahedron)}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                  showCuboctahedron
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Cuboctahedron
              </button>

              <button
                onClick={() => setShowIcosahedron(!showIcosahedron)}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                  showIcosahedron
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                120-Polytope
              </button>

              <button
                onClick={() => setShowGreatCircles(!showGreatCircles)}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                  showGreatCircles
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                21,600′ Circles
              </button>
            </div>

            {/* Right: Quick Node Jumper */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-slate-400 uppercase">Nexus Focus:</span>
              <select
                value={selectedNode?.id || ''}
                onChange={(e) => {
                  const found = GEODETIC_NODES.find((n) => n.id === e.target.value);
                  if (found) onSelectNode(found);
                }}
                className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded px-2 py-1 font-mono focus:outline-none focus:border-cyan-500/60 max-w-[200px] truncate"
              >
                <option value="">Select Geodetic Node...</option>
                {GEODETIC_NODES.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.name} (H-{n.harmonicFrequency})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
