import React, { useState } from 'react';
import { CloudFog, ChevronDown, ChevronUp, Droplets, Eye, Sliders } from 'lucide-react';

interface FogControlProps {
  fogDensity: number;
  onChangeFogDensity: (val: number) => void;
  dofEnabled: boolean;
  onToggleDof: (val: boolean) => void;
}

export const FogControl: React.FC<FogControlProps> = ({
  fogDensity,
  onChangeFogDensity,
  dofEnabled,
  onToggleDof
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const presets = [
    { label: 'Clear', value: 0.4 },
    { label: 'Mist', value: 1.0 },
    { label: 'Deep', value: 1.7 },
    { label: 'Abyssal', value: 2.4 }
  ];

  return (
    <div className="relative pointer-events-auto">
      {/* Compact Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer border ${
          fogDensity > 1.2
            ? 'bg-sky-500/20 border-sky-400/60 text-sky-200 shadow-md shadow-sky-500/15'
            : 'glass-panel hover:bg-white/10 text-slate-300 hover:text-white border-white/10'
        }`}
        title="Adjust atmospheric oceanic fog and depth-of-field zoom falloff"
      >
        <CloudFog className="w-3.5 h-3.5 text-sky-400" />
        <span className="hidden sm:inline">Fog & DoF:</span>
        <span className="font-semibold tabular-nums text-white">{fogDensity.toFixed(1)}x</span>
        {isOpen ? (
          <ChevronUp className="w-3 h-3 text-slate-400" />
        ) : (
          <ChevronDown className="w-3 h-3 text-slate-400" />
        )}
      </button>

      {/* Popover Controller */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 p-3.5 rounded-xl glass-panel-glow border border-sky-500/30 shadow-2xl z-40 space-y-3 backdrop-blur-2xl animate-fadeIn text-left">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-1.5 text-xs font-mono text-sky-400 uppercase tracking-wider">
              <Droplets className="w-3.5 h-3.5" />
              <span>Atmospheric Fog & DoF</span>
            </div>
            <span className="text-xs font-mono tabular-nums text-white font-bold">
              {fogDensity.toFixed(1)}x
            </span>
          </div>

          {/* Continuous Fog Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>Crystal (0.2x)</span>
              <span>Abyssal Haze (2.5x)</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="2.5"
              step="0.1"
              value={fogDensity}
              onChange={(e) => onChangeFogDensity(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400 transition-all"
            />
          </div>

          {/* Quick Presets */}
          <div className="grid grid-cols-4 gap-1 pt-1">
            {presets.map((preset) => {
              const isSelected = Math.abs(fogDensity - preset.value) < 0.15;
              return (
                <button
                  key={preset.label}
                  onClick={() => onChangeFogDensity(preset.value)}
                  className={`py-1 px-1.5 rounded-md text-[11px] font-mono transition-all cursor-pointer text-center ${
                    isSelected
                      ? 'bg-sky-400 text-slate-950 font-bold shadow-sm'
                      : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>

          {/* Dynamic Zoom Depth-of-Field Toggle */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-slate-300">
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              <span>Zoom DoF Falloff</span>
            </div>
            <button
              onClick={() => onToggleDof(!dofEnabled)}
              className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer border ${
                dofEnabled
                  ? 'bg-emerald-500/25 border-emerald-400 text-emerald-300'
                  : 'bg-white/5 border-white/10 text-slate-500'
              }`}
            >
              {dofEnabled ? 'ACTIVE' : 'OFF'}
            </button>
          </div>

          {/* Description caption */}
          <div className="text-[10px] text-slate-400 leading-tight pt-1 border-t border-white/5">
            Intensifies background oceanic depth-of-field as camera zooms into display cases.
          </div>
        </div>
      )}
    </div>
  );
};
