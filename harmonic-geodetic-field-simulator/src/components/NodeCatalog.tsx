/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GEODETIC_NODES } from '../math/cathiePhysics';
import { GeodeticNode } from '../types/harmonics';
import { MapPin, Search, Radio, Compass, ArrowRight } from 'lucide-react';

interface NodeCatalogProps {
  selectedNode: GeodeticNode | null;
  onSelectNode: (node: GeodeticNode) => void;
  onJumpToGlobe: () => void;
}

export const NodeCatalog: React.FC<NodeCatalogProps> = ({
  selectedNode,
  onSelectNode,
  onJumpToGlobe,
}) => {
  const [search, setSearch] = useState('');
  const [filterPoly, setFilterPoly] = useState<string>('all');

  const filteredNodes = GEODETIC_NODES.filter((node) => {
    const matchesSearch =
      node.name.toLowerCase().includes(search.toLowerCase()) ||
      node.description.toLowerCase().includes(search.toLowerCase()) ||
      node.harmonicFrequency.toString().includes(search);
    const matchesPoly = filterPoly === 'all' || node.polyhedronType === filterPoly;
    return matchesSearch && matchesPoly;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
      {/* Header and Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">
            Harmonic Geodesy Database
          </span>
          <h2 className="text-lg font-bold text-white mt-0.5">
            Planetary Geodetic Nodes & Resonant Vortices
          </h2>
        </div>

        {/* Search & Category Filter */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search node or harmonic..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 w-48 font-mono"
            />
          </div>

          <select
            value={filterPoly}
            onChange={(e) => setFilterPoly(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-300 focus:outline-none focus:border-cyan-500/50 font-mono"
          >
            <option value="all">All Polyhedra</option>
            <option value="harmonic_nexus">Harmonic Nexus</option>
            <option value="cuboctahedron">Cuboctahedron</option>
            <option value="icosahedron">Icosahedron</option>
            <option value="dodecahedron">Dodecahedron</option>
          </select>
        </div>
      </div>

      {/* Node Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNodes.map((node) => {
          const isSelected = selectedNode?.id === node.id;
          return (
            <div
              key={node.id}
              onClick={() => onSelectNode(node)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-950 border-cyan-500/60 shadow-lg shadow-cyan-950/20'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-cyan-400 font-semibold uppercase">{node.polyhedronType}</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-amber-400">Harmonic {node.harmonicFrequency}</span>
                  </div>
                  <h3 className="text-base font-semibold text-white mt-1">{node.name}</h3>
                </div>

                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300">
                  <Radio className="w-3 h-3 text-cyan-400" />
                  <span>×{node.fieldDensityMultiplier.toFixed(3)}</span>
                </div>
              </div>

              {/* Coordinates Breakdown */}
              <div className="mt-2.5 py-1.5 px-2.5 bg-slate-900/80 rounded border border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
                <span>
                  Lat: {node.latitude > 0 ? `+${node.latitude.toFixed(2)}°` : `${node.latitude.toFixed(2)}°`} (
                  {node.arcMinuteLat.toFixed(0)}′)
                </span>
                <span>
                  Lon: {node.longitude > 0 ? `+${node.longitude.toFixed(2)}°` : `${node.longitude.toFixed(2)}°`} (
                  {node.arcMinuteLon.toFixed(0)}′)
                </span>
              </div>

              <p className="text-xs text-slate-400 mt-2.5 leading-relaxed line-clamp-2">
                {node.description}
              </p>

              <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500 font-mono">
                  {node.gridSignificance}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectNode(node);
                    onJumpToGlobe();
                  }}
                  className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-medium shrink-0 cursor-pointer text-xs"
                >
                  <span>Focus in 3D</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
