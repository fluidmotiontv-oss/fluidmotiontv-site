import React, { useState } from 'react';
import { Sparkles, Sliders, ChevronDown, ChevronUp, SunMedium } from 'lucide-react';

interface BloomControlProps {
  bloomIntensity: number;
  onChangeBloom: (val: number) => void;
}

export const BloomControl: React.FC<BloomControlProps> = ({
  bloomIntensity,
  onChangeBloom
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const presets = [
    { label: 'Subtle', value: 0.4 },
    { label: 'Neon', value: 1.0 },
    { label: 'Vivid', value: 1.6 },
    { label: 'Hyper', value: 2.4 }
  ];

  return (
    <div className="relative pointer-events-auto">
      {/* Compact Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer border ${
          bloomIntensity > 1.2
            ? 'bg-cyan-500/20 border-cyan-400/60 text-cyan-200 shadow-md shadow-cyan-500/15'
            : 'glass-panel hover:bg-white/10 text-slate-300 hover:text-white border-white/10'
        }`}
        title="Adjust holographic bloom and neon glow intensity"
      >
        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
        <span className="hidden sm:inline">Bloom:</span>
        <span className="font-semibold tabular-nums text-white">{bloomIntensity.toFixed(1)}x</span>
        {isOpen ? (
          <ChevronUp className="w-3 h-3 text-slate-400" />
        ) : (
          <ChevronDown className="w-3 h-3 text-slate-400" />
        )}
      </button>

      {/* Popover Slider & Preset Controls */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 p-3.5 rounded-xl glass-panel-glow border border-cyan-500/30 shadow-2xl z-40 space-y-3 backdrop-blur-2xl animate-fadeIn text-left">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 uppercase tracking-wider">
              <SunMedium className="w-3.5 h-3.5" />
              <span>Holographic Glow</span>
            </div>
            <span className="text-xs font-mono tabular-nums text-white font-bold">
              {bloomIntensity.toFixed(1)}x
            </span>
          </div>

          {/* Continuous Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>Dim (0.2x)</span>
              <span>Ultra (2.5x)</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="2.5"
              step="0.1"
              value={bloomIntensity}
              onChange={(e) => onChangeBloom(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 transition-all"
            />
          </div>

          {/* Quick Presets */}
          <div className="grid grid-cols-4 gap-1 pt-1">
            {presets.map((preset) => {
              const isSelected = Math.abs(bloomIntensity - preset.value) < 0.15;
              return (
                <button
                  key={preset.label}
                  onClick={() => onChangeBloom(preset.value)}
                  className={`py-1 px-1.5 rounded-md text-[11px] font-mono transition-all cursor-pointer text-center ${
                    isSelected
                      ? 'bg-cyan-400 text-slate-950 font-bold shadow-sm'
                      : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>

          {/* Helper caption */}
          <div className="text-[10px] text-slate-400 leading-tight pt-1 border-t border-white/5">
            Controls pedestal wireframe glow, halo ring emission, and WebGL exposure.
          </div>
        </div>
      )}
    </div>
  );
};
