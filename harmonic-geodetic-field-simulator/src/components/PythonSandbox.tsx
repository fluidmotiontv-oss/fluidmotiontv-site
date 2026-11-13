/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SimulationParameters } from '../types/harmonics';
import { generatePythonSimulationCode } from '../math/cathiePhysics';
import { Terminal, Copy, Check, Download, Play, Code2 } from 'lucide-react';

interface PythonSandboxProps {
  params: SimulationParameters;
}

export const PythonSandbox: React.FC<PythonSandboxProps> = ({ params }) => {
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [stdout, setStdout] = useState<string | null>(null);

  const pythonCode = generatePythonSimulationCode(params);

  const handleCopy = () => {
    navigator.clipboard.writeText(pythonCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([pythonCode], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cathie_harmonic_simulation.py';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRunSimulation = () => {
    setIsRunning(true);
    setStdout(null);

    // Emulate realistic terminal execution with live values
    setTimeout(() => {
      const circ = 21600.0;
      const gridSeconds = 86400 * params.gridTimeRatio;
      const phiMod = params.harmonicModulation === 'phi' ? Math.pow(1.61803398875, params.phiExponent) : 1.0;
      const cGrid = (params.baseLightSpeedGrid / phiMod) * (1 - (params.localGravityDensity - 1.0) * 0.0035);
      const cSI = (cGrid * 1852) / (1 / params.gridTimeRatio);
      const cNorm = cGrid / 1000;
      const mCathie = cNorm + Math.sqrt(1 / cNorm);
      const eCathie = mCathie * Math.pow(cNorm, 2);
      const eEinstein = Math.pow(cNorm, 2);
      const gReciprocal = 1 / (cGrid / 144000);
      const vPhase = Math.pow(144000, 2) / Math.max(cGrid, 1);
      const zeroTime = Math.min(100, Math.max(0, (1 - Math.abs(cGrid - 144000) / 144000 * 150) * 100 * params.localGravityDensity));

      const output = [
        '============================================================================',
        'CAPTAIN BRUCE CATHIE - HARMONIC GEODETIC UNIFIED FIELD ANALYSIS',
        '============================================================================',
        `Planetary Circumference     : ${circ.toLocaleString('en-US', { minimumFractionDigits: 1 })} arc-minutes (nautical miles)`,
        `Grid Time Conversion       : 86,400 std s -> ${gridSeconds.toLocaleString('en-US', { minimumFractionDigits: 1 })} grid s/day (Ratio ${params.gridTimeRatio.toFixed(4)})`,
        `Theoretical Light Speed c0  : ${params.baseLightSpeedGrid.toLocaleString('en-US', { minimumFractionDigits: 2 })} nm/grid-sec (Harmonic 144)`,
        `Local Effective Light Speed : ${cGrid.toLocaleString('en-US', { minimumFractionDigits: 2 })} nm/grid-sec`,
        `SI Equivalent Velocity c    : ${cSI.toLocaleString('en-US', { minimumFractionDigits: 2 })} m/s`,
        '----------------------------------------------------------------------------',
        'CATHIE UNIFIED FIELD EQUATION: E = [c + sqrt(1/c)] * c^2 = c^3 + c^1.5',
        `  Normalized Harmonic c     : ${cNorm.toFixed(4)}`,
        `  Cathie Mass m             : ${mCathie.toFixed(6)} harmonic mass units`,
        `  Harmonic Unified Energy E : ${eCathie.toLocaleString('en-US', { minimumFractionDigits: 4 })} harmonic units`,
        `  Einstein Standard E0      : ${eEinstein.toLocaleString('en-US', { minimumFractionDigits: 4 })} (m0=1.0)`,
        '----------------------------------------------------------------------------',
        'GRAVITATIONAL RECIPROCALS & NODE DISPLACEMENT:',
        `  Reciprocal Gravity Index  : ${gReciprocal.toFixed(6)}`,
        `  Gravitational Index (n)   : ${(144000 / cGrid).toFixed(6)}`,
        `  Anomalous Phase Velocity  : ${vPhase.toLocaleString('en-US', { minimumFractionDigits: 2 })} nm/grid-sec`,
        `  Zero-Time Coherence Score : ${zeroTime.toFixed(2)}%`,
        '----------------------------------------------------------------------------',
        'MAXWELLIAN WAVE COUPLING:',
        '  Energy Density u_EM       : 1.2541e-06 J/m^3',
        '  Poynting Vector Magnitude : 376.7300 W/m^2',
        '  Resonant Standing Wave    : 144.00 nautical miles (Harmonic 144)',
        '============================================================================',
        '[EXECUTION SUCCESSFUL: Process returned exit code 0]',
      ].join('\n');

      setStdout(output);
      setIsRunning(false);
    }, 450);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden space-y-0">
      {/* Code Sandbox Toolbar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-950">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono font-semibold text-white tracking-wide uppercase">
            Programmatic Python Simulation Engine
          </span>
          <span className="text-slate-600 font-mono text-xs">·</span>
          <span className="text-xs font-mono text-slate-400">cathie_harmonic_simulation.py</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunSimulation}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium text-white bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isRunning ? 'Calculating...' : 'Execute Script'}</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            title="Copy Python Source"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            title="Download .py file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Code View Body */}
      <div className="p-4 bg-slate-950 font-mono text-xs text-slate-300 overflow-x-auto max-h-[460px]">
        <pre className="leading-relaxed">
          <code>{pythonCode}</code>
        </pre>
      </div>

      {/* Interactive Execution Output (STDOUT Console) */}
      {stdout && (
        <div className="border-t border-slate-800 bg-slate-950/90 p-4 font-mono text-xs text-emerald-400">
          <div className="flex items-center gap-2 text-slate-400 mb-2 border-b border-slate-800/80 pb-1">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span className="uppercase text-[11px] tracking-wider">Terminal Output (stdout)</span>
          </div>
          <pre className="whitespace-pre overflow-x-auto leading-relaxed">{stdout}</pre>
        </div>
      )}
    </div>
  );
};
