import React, { useState } from 'react';
import { Palette, ChevronDown, ChevronUp, RotateCw, Check, Sparkles, Sun } from 'lucide-react';
import { LightingPresetId, LIGHTING_PRESETS, PRESET_ORDER } from '../data/lightingPresets';

interface LightingControlProps {
  lightingPreset: LightingPresetId;
  onChangePreset: (presetId: LightingPresetId) => void;
  compact?: boolean;
}

export const LightingControl: React.FC<LightingControlProps> = ({
  lightingPreset,
  onChangePreset,
  compact = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const activePreset = LIGHTING_PRESETS[lightingPreset] || LIGHTING_PRESETS['holographic-blue'];

  const handleCycleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    const currentIndex = PRESET_ORDER.indexOf(lightingPreset);
    const nextIndex = (currentIndex + 1) % PRESET_ORDER.length;
    onChangePreset(PRESET_ORDER[nextIndex]);
  };

  return (
    <div className="relative pointer-events-auto">
      {/* Trigger Button with Dynamic Color Swatch & Preset Name */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-2 cursor-pointer border ${
          isOpen
            ? 'bg-white/15 border-white/30 text-white shadow-lg'
            : 'glass-panel hover:bg-white/10 text-slate-300 hover:text-white border-white/10'
        }`}
        title="Toggle global lighting presets & color temperature"
      >
        {/* Glowing Color Indicator Dot */}
        <span className="relative flex h-2.5 w-2.5">
          <span 
            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
            style={{ backgroundColor: activePreset.dotColor }}
          />
          <span 
            className="relative inline-flex rounded-full h-2.5 w-2.5 border border-white/40 shadow-sm"
            style={{ backgroundColor: activePreset.dotColor }}
          />
        </span>

        <span className="hidden sm:inline text-slate-400">Lighting:</span>
        <span className="font-semibold text-white whitespace-nowrap">
          {activePreset.name}
        </span>

        <span className="hidden md:inline-block px-1.5 py-0.2 rounded text-[10px] font-mono border"
          style={{ 
            backgroundColor: `${activePreset.accentHex}18`,
            borderColor: `${activePreset.accentHex}40`,
            color: activePreset.accentHex
          }}
        >
          {activePreset.colorTemp}
        </span>

        {/* Quick 1-click cycle button */}
        <span
          onClick={handleCycleNext}
          title="Cycle to next lighting preset"
          className="p-0.5 rounded hover:bg-white/20 text-slate-400 hover:text-white transition-colors cursor-pointer ml-0.5"
        >
          <RotateCw className="w-3 h-3 hover:rotate-90 transition-transform duration-300" />
        </span>

        {isOpen ? (
          <ChevronUp className="w-3 h-3 text-slate-400" />
        ) : (
          <ChevronDown className="w-3 h-3 text-slate-400" />
        )}
      </button>

      {/* Popover Dropdown Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 sm:w-80 p-3.5 rounded-xl glass-panel-glow border border-white/20 shadow-2xl z-50 space-y-2.5 backdrop-blur-2xl animate-fadeIn text-left">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-300 uppercase tracking-wider">
              <Palette className="w-3.5 h-3.5 text-cyan-400" />
              <span>Global Environment Lighting</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              {PRESET_ORDER.length} Presets
            </span>
          </div>

          {/* Presets List */}
          <div className="space-y-1.5 max-h-[320px] overflow-y-auto pr-1">
            {PRESET_ORDER.map((presetId) => {
              const preset = LIGHTING_PRESETS[presetId];
              const isSelected = lightingPreset === presetId;

              return (
                <button
                  key={preset.id}
                  onClick={() => {
                    onChangePreset(preset.id);
                    setIsOpen(false);
                  }}
                  className={`w-full p-2.5 rounded-lg text-left transition-all cursor-pointer flex items-center justify-between gap-3 border ${
                    isSelected
                      ? 'bg-white/12 border-white/40 shadow-md ring-1 ring-white/20'
                      : 'bg-white/[0.03] border-white/5 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Swatch circle with border */}
                    <div 
                      className="w-4 h-4 rounded-full flex-shrink-0 border border-white/60 shadow-sm"
                      style={{ 
                        backgroundColor: preset.dotColor,
                        boxShadow: isSelected ? `0 0 10px ${preset.dotColor}` : 'none'
                      }}
                    />

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold truncate ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                          {preset.name}
                        </span>
                        <span 
                          className="px-1.5 py-0.2 rounded text-[9px] font-mono border"
                          style={{ 
                            backgroundColor: `${preset.accentHex}18`,
                            borderColor: `${preset.accentHex}40`,
                            color: preset.accentHex
                          }}
                        >
                          {preset.colorTemp}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">
                        {preset.tagline}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <Check 
                      className="w-4 h-4 flex-shrink-0"
                      style={{ color: preset.accentHex }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick cycle footer hint */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <Sun className="w-3 h-3 text-amber-400" />
              <span>Real-time smooth color lerp</span>
            </span>
            <button
              onClick={handleCycleNext}
              className="text-cyan-300 hover:text-cyan-200 underline font-mono cursor-pointer"
            >
              Cycle Next &rarr;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
