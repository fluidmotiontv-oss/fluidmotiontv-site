/**
 * HoloCraft 3D - Hologram Shader & 3D Parameter Tuner Drawer
 */

import React from 'react';
import { 
  X, 
  Sliders, 
  RotateCcw, 
  Palette, 
  Zap, 
  Layers, 
  Sparkles, 
  Eye, 
  Activity 
} from 'lucide-react';
import { HologramParameters, HologramColorTheme } from '../types/hologram';
import { hologramSound } from '../audio/HologramSoundEngine';

interface ShaderTunerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  params: HologramParameters;
  onChangeParams: (newParams: Partial<HologramParameters>) => void;
}

export const ShaderTunerDrawer: React.FC<ShaderTunerDrawerProps> = ({
  isOpen,
  onClose,
  params,
  onChangeParams,
}) => {
  if (!isOpen) return null;

  const defaultParams: HologramParameters = {
    pointDensity: 110,
    displacementScale: 1.2,
    particleSize: 3.5,
    scanlineSpeed: 1.2,
    scanlineDensity: 16,
    flickerIntensity: 0.35,
    bloomGlow: 1.5,
    colorTheme: 'cyan_neon',
    customColorHex: '#06b6d4',
    wireframeOnly: false,
    autoRotate: true,
    rotationSpeed: 1.0,
    noiseTurbulence: 0.2,
    laserBeamIntensity: 1.0,
    fresnelPower: 2.5,
    depthInvert: false,
    depthThreshold: 0.05,
  };

  const handleReset = () => {
    onChangeParams(defaultParams);
    hologramSound.triggerLaserScanSound();
  };

  const colorThemes: { id: HologramColorTheme; label: string; bg: string }[] = [
    { id: 'cyan_neon', label: 'Cyan Neon', bg: 'from-cyan-500 to-blue-500' },
    { id: 'matrix_emerald', label: 'Matrix Emerald', bg: 'from-emerald-500 to-teal-500' },
    { id: 'solar_gold', label: 'Solar Gold', bg: 'from-amber-400 to-yellow-500' },
    { id: 'coronal_magenta', label: 'Coronal Magenta', bg: 'from-pink-500 to-rose-500' },
    { id: 'quantum_violet', label: 'Quantum Violet', bg: 'from-purple-500 to-indigo-500' },
    { id: 'full_rgb', label: 'Full Spectrum RGB', bg: 'from-rose-400 via-emerald-400 to-cyan-400' },
  ];

  return (
    <div className="fixed inset-y-0 right-0 w-80 sm:w-96 bg-slate-950/95 backdrop-blur-2xl border-l border-white/10 z-50 p-6 flex flex-col justify-between shadow-2xl overflow-y-auto">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              3D & SHADER TUNER
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Color Palette Theme */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-300">
            <Palette className="w-3.5 h-3.5 text-cyan-400" />
            <span>Hologram Chroma Theme</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {colorThemes.map((t) => {
              const isSelected = params.colorTheme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    onChangeParams({ colorTheme: t.id });
                    hologramSound.triggerLaserScanSound();
                  }}
                  className={`p-2 rounded-xl text-left border transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-cyan-500/20 border-cyan-400/60 shadow-sm text-white'
                      : 'bg-white/5 hover:bg-white/10 border-white/5 text-slate-400'
                  }`}
                >
                  <div className={`w-3.5 h-3.5 rounded-full bg-gradient-to-r ${t.bg} shrink-0`} />
                  <span className="text-[11px] font-mono truncate">{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Slider Controls */}
        <div className="flex flex-col gap-4 font-mono text-xs">
          {/* Depth / 3D Displacement */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">3D Depth Extrusion</span>
              <span className="text-cyan-400 font-bold">{params.displacementScale.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="2.5"
              step="0.05"
              value={params.displacementScale}
              onChange={(e) => onChangeParams({ displacementScale: parseFloat(e.target.value) })}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Point Cloud Density */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Point Density (Mesh Res)</span>
              <span className="text-cyan-400 font-bold">{params.pointDensity} px</span>
            </div>
            <input
              type="range"
              min="50"
              max="200"
              step="5"
              value={params.pointDensity}
              onChange={(e) => onChangeParams({ pointDensity: parseInt(e.target.value) })}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Particle Size */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Particle Size</span>
              <span className="text-cyan-400 font-bold">{params.particleSize.toFixed(1)} px</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="8.0"
              step="0.2"
              value={params.particleSize}
              onChange={(e) => onChangeParams({ particleSize: parseFloat(e.target.value) })}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Scanline Speed */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Scanline Velocity</span>
              <span className="text-cyan-400 font-bold">{params.scanlineSpeed.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="4.0"
              step="0.1"
              value={params.scanlineSpeed}
              onChange={(e) => onChangeParams({ scanlineSpeed: parseFloat(e.target.value) })}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Hologram Bloom Glow */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Luminescent Glow & Bloom</span>
              <span className="text-cyan-400 font-bold">{params.bloomGlow.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="3.0"
              step="0.1"
              value={params.bloomGlow}
              onChange={(e) => onChangeParams({ bloomGlow: parseFloat(e.target.value) })}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Quantum Turbulence */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Quantum Noise Turbulence</span>
              <span className="text-cyan-400 font-bold">{(params.noiseTurbulence * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.05"
              value={params.noiseTurbulence}
              onChange={(e) => onChangeParams({ noiseTurbulence: parseFloat(e.target.value) })}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>
        </div>

        {/* Toggles */}
        <div className="pt-2 border-t border-white/10 flex flex-col gap-2 font-mono text-xs">
          <label className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer">
            <span className="text-slate-300">Auto-Rotate Stage</span>
            <input
              type="checkbox"
              checked={params.autoRotate}
              onChange={(e) => onChangeParams({ autoRotate: e.target.checked })}
              className="accent-cyan-400 w-4 h-4 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer">
            <span className="text-slate-300">Invert Depth Direction</span>
            <input
              type="checkbox"
              checked={params.depthInvert}
              onChange={(e) => onChangeParams({ depthInvert: e.target.checked })}
              className="accent-cyan-400 w-4 h-4 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer">
            <span className="text-slate-300">Wireframe Only</span>
            <input
              type="checkbox"
              checked={params.wireframeOnly}
              onChange={(e) => onChangeParams({ wireframeOnly: e.target.checked })}
              className="accent-cyan-400 w-4 h-4 cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-6 border-t border-white/10 flex items-center justify-between">
        <button
          onClick={handleReset}
          className="px-3 py-2 text-xs font-mono text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Defaults</span>
        </button>
        <button
          onClick={onClose}
          className="px-5 py-2 text-xs font-mono font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors shadow-md"
        >
          Apply & Close
        </button>
      </div>
    </div>
  );
};
