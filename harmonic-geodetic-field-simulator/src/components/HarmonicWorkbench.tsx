/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SimulationParameters, HarmonicCalculationResult, GeodeticNode } from '../types/harmonics';
import { Sliders, RotateCcw, Zap, Sparkles, Activity, ShieldAlert, Cpu } from 'lucide-react';

interface HarmonicWorkbenchProps {
  params: SimulationParameters;
  onUpdateParams: (newParams: Partial<SimulationParameters>) => void;
  onResetParams: () => void;
  results: HarmonicCalculationResult;
  selectedNode: GeodeticNode | null;
}

export const HarmonicWorkbench: React.FC<HarmonicWorkbenchProps> = ({
  params,
  onUpdateParams,
  onResetParams,
  results,
  selectedNode,
}) => {
  return (
    <div className="space-y-6">
      {/* Parameter Control Deck */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-white tracking-wide uppercase font-mono">
              Harmonic Parameter Console
            </h3>
          </div>
          <button
            onClick={onResetParams}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-slate-400 hover:text-slate-100 bg-slate-800/60 hover:bg-slate-800 rounded transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Standards</span>
          </button>
        </div>

        {/* Selected Node Status Callout (if active) */}
        {selectedNode && (
          <div className="bg-cyan-950/20 border border-cyan-800/40 rounded-lg p-3 text-xs flex items-center justify-between">
            <div>
              <span className="text-slate-400">Target Geodetic Node:</span>{' '}
              <strong className="text-cyan-300 font-semibold">{selectedNode.name}</strong>
              <span className="text-slate-500 ml-2 font-mono">({selectedNode.harmonicFrequency} Hz)</span>
            </div>
            <div className="text-slate-300 font-mono text-[11px]">
              Field Density: ×{selectedNode.fieldDensityMultiplier.toFixed(3)}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Base Light Speed Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 font-medium">Theoretical Light Speed ($c_0$)</span>
              <span className="font-mono text-cyan-400 font-semibold">
                {params.baseLightSpeedGrid.toLocaleString()} <span className="text-slate-500 text-[10px]">nm/grid-s</span>
              </span>
            </div>
            <input
              type="range"
              min={135000}
              max={155000}
              step={100}
              value={params.baseLightSpeedGrid}
              onChange={(e) => onUpdateParams({ baseLightSpeedGrid: parseFloat(e.target.value) })}
              className="w-full accent-cyan-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>135,000</span>
              <span className="text-cyan-400 font-bold">144,000 (Harmonic 144)</span>
              <span>155,000</span>
            </div>
          </div>

          {/* Geometric Modulation Mode */}
          <div className="space-y-2">
            <label className="block text-xs text-slate-400 font-medium">
              Geometric Modulation Factor
            </label>
            <div className="grid grid-cols-4 gap-1">
              {(['phi', 'pi', 'octave', 'none'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => onUpdateParams({ harmonicModulation: mode })}
                  className={`py-1.5 text-xs font-mono font-medium rounded transition-colors ${
                    params.harmonicModulation === mode
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {mode === 'phi' ? 'φ (Phi)' : mode === 'pi' ? 'π (Pi)' : mode === 'octave' ? '2ⁿ' : 'None'}
                </button>
              ))}
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              {params.harmonicModulation === 'phi' && 'Golden Ratio scaling: c_adj = c0 / φⁿ'}
              {params.harmonicModulation === 'pi' && 'Circle geometry scaling: c_adj = c0 / (π/3)ⁿ'}
              {params.harmonicModulation === 'octave' && 'Harmonic frequency doubling / halving'}
              {params.harmonicModulation === 'none' && 'Unmodulated theoretical vacuum velocity'}
            </div>
          </div>

          {/* Modulation Exponent (n) */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 font-medium">Modulation Exponent ($n$)</span>
              <span className="font-mono text-cyan-400 font-semibold">{params.phiExponent.toFixed(3)}</span>
            </div>
            <input
              type="range"
              min={0}
              max={2.0}
              step={0.01}
              value={params.phiExponent}
              onChange={(e) => onUpdateParams({ phiExponent: parseFloat(e.target.value) })}
              className="w-full accent-cyan-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0.0 (Identity)</span>
              <span>1.0 (Linear φ)</span>
              <span>2.0 (Quadratic)</span>
            </div>
          </div>

          {/* Local Gravity Density */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 font-medium">Local Gravitational Field Density ($\rho_g$)</span>
              <span className="font-mono text-amber-400 font-semibold">{params.localGravityDensity.toFixed(3)}</span>
            </div>
            <input
              type="range"
              min={0.8}
              max={1.4}
              step={0.01}
              value={params.localGravityDensity}
              onChange={(e) => onUpdateParams({ localGravityDensity: parseFloat(e.target.value) })}
              className="w-full accent-amber-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0.80 (High Altitude)</span>
              <span>1.00 (Sea Level)</span>
              <span>1.40 (Dense Core)</span>
            </div>
          </div>

          {/* Grid Time Ratio */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 font-medium">Diurnal Grid Time Ratio</span>
              <span className="font-mono text-emerald-400 font-semibold">{params.gridTimeRatio.toFixed(4)} (9:8)</span>
            </div>
            <input
              type="range"
              min={1.0}
              max={1.333}
              step={0.005}
              value={params.gridTimeRatio}
              onChange={(e) => onUpdateParams({ gridTimeRatio: parseFloat(e.target.value) })}
              className="w-full accent-emerald-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>1.000 (Standard Civil)</span>
              <span className="text-emerald-400 font-bold">1.125 (Cathie 9/8)</span>
              <span>1.333 (4/3)</span>
            </div>
          </div>

          {/* Carrier Frequency */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 font-medium">Electromagnetic Carrier Resonance</span>
              <span className="font-mono text-sky-400 font-semibold">{params.frequencyCarrierKhz.toFixed(1)} kHz</span>
            </div>
            <input
              type="range"
              min={72}
              max={864}
              step={72}
              value={params.frequencyCarrierKhz}
              onChange={(e) => onUpdateParams({ frequencyCarrierKhz: parseFloat(e.target.value) })}
              className="w-full accent-sky-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>72 kHz</span>
              <span className="text-sky-400 font-bold">144 / 432 kHz</span>
              <span>864 kHz</span>
            </div>
          </div>
        </div>
      </div>

      {/* Telemetry Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Effective Local Speed of Light */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="uppercase font-mono tracking-wider">Effective Local $c$</span>
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-300">
            {results.cLocalEffectiveGrid.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            <span className="text-xs font-mono text-slate-400 ml-1.5 font-normal">nm/grid-s</span>
          </div>
          <div className="text-[11px] font-mono text-slate-400">
            SI: {(results.cStandardEquivalentMs / 1e6).toFixed(3)} × 10⁶ m/s
          </div>
          <div className="text-[10px] text-slate-500">
            Refraction index $n_g$: {results.gravitationalRefractionIndex.toFixed(5)}
          </div>
        </div>

        {/* Cathie Mass Manifestation */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="uppercase font-mono tracking-wider">Cathie Mass ($m$)</span>
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-300">
            {results.cathieMass.toFixed(6)}
            <span className="text-xs font-mono text-slate-400 ml-1.5 font-normal">h-mass</span>
          </div>
          <div className="text-[11px] font-mono text-slate-400">
            Formula: m = c + √(1/c)
          </div>
          <div className="text-[10px] text-slate-500">
            Reciprocal impedance: {(1 / Math.sqrt(results.cLocalEffectiveGrid / 1000)).toFixed(6)}
          </div>
        </div>

        {/* Harmonic Unified Energy E */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="uppercase font-mono tracking-wider">Unified Energy (E)</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-300">
            {results.cathieEnergy.toLocaleString(undefined, { maximumFractionDigits: 1 })}
            <span className="text-xs font-mono text-slate-400 ml-1.5 font-normal">h-erg</span>
          </div>
          <div className="text-[11px] font-mono text-slate-400">
            {'E = [c + √(1/c)] · c² = c³ + c¹·⁵'}
          </div>
          <div className="text-[10px] text-slate-500">
            Rel. vs Standard Einstein: +{((results.cathieEnergy / results.einsteinEnergyStandard - 1) * 100).toFixed(3)}%
          </div>
        </div>

        {/* Zero-Time Coherence Potential */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="uppercase font-mono tracking-wider">Zero-Time Coherence</span>
            <Cpu className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-sky-300">
            {results.zeroTimePotentialScore.toFixed(1)}
            <span className="text-xs font-mono text-slate-400 ml-1.5 font-normal">%</span>
          </div>
          <div className="text-[11px] font-mono text-slate-400">
            Phase Velocity: {(results.phaseDisplacementVelocity / 1e3).toFixed(1)}k nm/s
          </div>
          <div className="text-[10px] text-slate-500">
            Gravitational Reciprocal: {results.reciprocalGravityHarmonic.toFixed(5)}
          </div>
        </div>
      </div>

      {/* Maxwellian Energy & Resonant Standing Wave Summary */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400">
          Maxwellian Resonant Cavity & Poynting Flux Metrics
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="bg-slate-950 p-3 rounded border border-slate-800">
            <div className="text-slate-400 text-[11px]">Energy Density ($u_&#123;\text&#123;EM&#125;&#125;$)</div>
            <div className="text-base font-bold text-white mt-1">
              {results.maxwellEnergyDensityJoulesPerM3.toExponential(4)} <span className="text-xs text-slate-400">J/m³</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1">u = 0.5(ε₀E² + B²/μ₀)</div>
          </div>

          <div className="bg-slate-950 p-3 rounded border border-slate-800">
            <div className="text-slate-400 text-[11px]">Poynting Vector Magnitude ($S$)</div>
            <div className="text-base font-bold text-white mt-1">
              {results.poyntingVectorMagnitude.toFixed(3)} <span className="text-xs text-slate-400">W/m²</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1">S = |E × B| / μ₀</div>
          </div>

          <div className="bg-slate-950 p-3 rounded border border-slate-800">
            <div className="text-slate-400 text-[11px]">Resonant Wavelength ($\lambda_&#123;150&#125;$)</div>
            <div className="text-base font-bold text-cyan-300 mt-1">
              {results.standingWaveWavelengthNm.toFixed(1)} <span className="text-xs text-slate-400">nautical miles</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1">21,600′ / 150 = Harmonic 144</div>
          </div>
        </div>
      </div>
    </div>
  );
};
