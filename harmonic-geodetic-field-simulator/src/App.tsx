/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { TopNav } from './components/TopNav';
import { ThreeEarthGrid } from './components/ThreeEarthGrid';
import { GlobeControlDock } from './components/GlobeControlDock';
import { TheoreticalTreatise } from './components/TheoreticalTreatise';
import { HarmonicWorkbench } from './components/HarmonicWorkbench';
import { PythonSandbox } from './components/PythonSandbox';
import { NodeCatalog } from './components/NodeCatalog';
import { TelemetryExportModal } from './components/TelemetryExportModal';
import { SimulationParameters, GeodeticNode } from './types/harmonics';
import { computeHarmonicPhysics, GEODETIC_NODES } from './math/cathiePhysics';
import { Sparkles, Compass, Radio, ArrowUpRight } from 'lucide-react';

const DEFAULT_PARAMS: SimulationParameters = {
  baseLightSpeedGrid: 144000,
  harmonicModulation: 'none',
  phiExponent: 0.0,
  gridTimeRatio: 9 / 8, // 1.125
  planetaryRadiusNm: 3437.74677,
  localGravityDensity: 1.0,
  frequencyCarrierKhz: 144.0,
  resonanceCavityRadiusNm: 144.0,
};

export default function App() {
  const [activeView, setActiveView] = useState<'globe' | 'treatise' | 'workbench' | 'python' | 'nodes'>('globe');
  const [params, setParams] = useState<SimulationParameters>(DEFAULT_PARAMS);
  const [selectedNode, setSelectedNode] = useState<GeodeticNode | null>(GEODETIC_NODES[0]); // Default Auckland/Pukekohe

  // 3D Globe Layer Toggles
  const [showCuboctahedron, setShowCuboctahedron] = useState(true);
  const [showIcosahedron, setShowIcosahedron] = useState(true);
  const [showGreatCircles, setShowGreatCircles] = useState(true);
  const [showStandingWaves, setShowStandingWaves] = useState(true);

  // Telemetry Export Modal
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Calculate live harmonic results
  const results = useMemo(() => {
    return computeHarmonicPhysics(params);
  }, [params]);

  const handleUpdateParams = (newParams: Partial<SimulationParameters>) => {
    setParams((prev) => ({ ...prev, ...newParams }));
  };

  const handleResetParams = () => {
    setParams(DEFAULT_PARAMS);
  };

  const handleSelectNode = (node: GeodeticNode) => {
    setSelectedNode(node);
    // Adjust local gravity density according to node's field density
    setParams((prev) => ({
      ...prev,
      localGravityDensity: node.fieldDensityMultiplier,
      frequencyCarrierKhz: node.harmonicFrequency,
    }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Bar Navigation */}
      <TopNav
        activeView={activeView}
        onSelectView={setActiveView}
        onExportTelemetry={() => setIsExportOpen(true)}
      />

      {/* Main Workspace Stage */}
      <main className="flex-1 flex flex-col p-4 md:p-6 max-w-7xl w-full mx-auto space-y-6">
        {/* Global Metric Ribbon */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div>
            <div className="text-slate-400 text-[11px] uppercase tracking-wider">Planetary Arc-Minutes</div>
            <div className="text-lg font-bold text-white mt-0.5">21,600′ <span className="text-slate-400 text-xs">circ.</span></div>
            <div className="text-[10px] text-slate-500">1′ lat = 1 nautical mile</div>
          </div>

          <div>
            <div className="text-slate-400 text-[11px] uppercase tracking-wider">Harmonic Grid Time</div>
            <div className="text-lg font-bold text-cyan-400 mt-0.5">97,200 <span className="text-slate-400 text-xs">sec/day</span></div>
            <div className="text-[10px] text-slate-500">86,400 × (9/8 ratio)</div>
          </div>

          <div>
            <div className="text-slate-400 text-[11px] uppercase tracking-wider">Theoretical Light Speed</div>
            <div className="text-lg font-bold text-emerald-400 mt-0.5">144,000 <span className="text-slate-400 text-xs">nm/g-s</span></div>
            <div className="text-[10px] text-slate-500">Harmonic 144 constant</div>
          </div>

          <div>
            <div className="text-slate-400 text-[11px] uppercase tracking-wider">{'Unified Mass m = c + c⁻⁰·⁵'}</div>
            <div className="text-lg font-bold text-amber-400 mt-0.5">{results.cathieMass.toFixed(4)} <span className="text-slate-400 text-xs">h-mass</span></div>
            <div className="text-[10px] text-slate-500">{'E = c³ + c¹·⁵ unified field'}</div>
          </div>
        </section>

        {/* View 1: 3D Globe with Bottom Dock */}
        {activeView === 'globe' && (
          <div className="space-y-4">
            <div className="relative w-full h-[620px] rounded-xl overflow-hidden border border-slate-800">
              <ThreeEarthGrid
                selectedNode={selectedNode}
                onSelectNode={handleSelectNode}
                showCuboctahedron={showCuboctahedron}
                showIcosahedron={showIcosahedron}
                showGreatCircles={showGreatCircles}
                showStandingWaves={showStandingWaves}
                activeLatticeColor="#06b6d4"
              />

              {/* Sleek Ergonomic Bottom Dock (Three.js skill directive) */}
              <GlobeControlDock
                showCuboctahedron={showCuboctahedron}
                setShowCuboctahedron={setShowCuboctahedron}
                showIcosahedron={showIcosahedron}
                setShowIcosahedron={setShowIcosahedron}
                showGreatCircles={showGreatCircles}
                setShowGreatCircles={setShowGreatCircles}
                showStandingWaves={showStandingWaves}
                setShowStandingWaves={setShowStandingWaves}
                selectedNode={selectedNode}
                onSelectNode={handleSelectNode}
              />
            </div>

            {/* Quick Summary Strip under 3D Globe */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <Compass className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-slate-300">
                  Currently Focused Node:{' '}
                  <strong className="text-white font-semibold">{selectedNode?.name}</strong>{' '}
                  <span className="text-slate-400 font-mono">
                    ({selectedNode?.latitude.toFixed(2)}°, {selectedNode?.longitude.toFixed(2)}°)
                  </span>
                </span>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <button
                  onClick={() => setActiveView('treatise')}
                  className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-medium cursor-pointer"
                >
                  <span>Read Mathematical Derivation</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setActiveView('workbench')}
                  className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium cursor-pointer"
                >
                  <span>Open Parameter Workbench</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View 2: Theoretical Physics Treatise */}
        {activeView === 'treatise' && (
          <TheoreticalTreatise />
        )}

        {/* View 3: Harmonic Parameter Workbench */}
        {activeView === 'workbench' && (
          <HarmonicWorkbench
            params={params}
            onUpdateParams={handleUpdateParams}
            onResetParams={handleResetParams}
            results={results}
            selectedNode={selectedNode}
          />
        )}

        {/* View 4: Python Simulation Engine */}
        {activeView === 'python' && (
          <PythonSandbox params={params} />
        )}

        {/* View 5: Geodetic Node Catalog */}
        {activeView === 'nodes' && (
          <NodeCatalog
            selectedNode={selectedNode}
            onSelectNode={handleSelectNode}
            onJumpToGlobe={() => setActiveView('globe')}
          />
        )}
      </main>

      {/* Telemetry Export Modal */}
      <TelemetryExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        params={params}
        results={results}
        selectedNode={selectedNode}
      />

      {/* Minimal Footer adhering to anti-slop rules */}
      <footer className="border-t border-slate-800 bg-slate-950 px-6 py-4 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <span>Bruce Cathie Harmonic Geodetic Framework</span>
          <span aria-hidden="true">·</span>
          <span>Unified Field Equations: E = [c + √(1/c)] · c²</span>
        </div>
        <div className="flex items-center gap-4">
          <span>21,600 Arc-Minute Circle</span>
          <span>97,200 Grid Sec/Day</span>
          <span>Harmonic 144 Constant</span>
        </div>
      </footer>
    </div>
  );
}
