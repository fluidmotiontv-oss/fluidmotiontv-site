import React from 'react';
import { Eye, BookOpen, Layers, Zap } from 'lucide-react';
import { SHADER_PRESETS, ShaderPreset } from '../utils/presets';

interface PresetsLibraryProps {
  onSelectPreset: (preset: ShaderPreset) => void;
  activePresetId: string | null;
}

export default function PresetsLibrary({
  onSelectPreset,
  activePresetId,
}: PresetsLibraryProps) {
  return (
    <div className="flex flex-col h-full bg-[#111218] border border-[#1f212a] rounded-xl overflow-hidden">
      {/* Header section */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0e0f14] border-b border-[#1f212a]">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-300 font-mono">
            Shader Presets
          </h2>
        </div>
      </div>

      {/* Preset cards list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-[#12131a]">
        {SHADER_PRESETS.map((p) => {
          const isActive = p.id === activePresetId;
          return (
            <div
              key={p.id}
              onClick={() => onSelectPreset(p)}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                isActive
                  ? 'bg-cyan-950/20 border-cyan-500/40 shadow-sm text-cyan-300'
                  : 'bg-[#171822]/60 border-[#1f212a] hover:border-[#2b2e40] hover:bg-[#1a1b28]/60 text-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold font-mono tracking-tight">
                  {p.title}
                </span>
                <span className={`text-[9px] font-mono font-semibold uppercase px-1.5 py-0.5 rounded ${
                  p.category === 'Raymarching' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/10' :
                  p.category === 'Deformation' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/10' :
                  p.category === 'Post-Process' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/10' :
                  'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10'
                }`}>
                  {p.category}
                </span>
              </div>
              <p className="text-[10px] text-gray-400 leading-normal select-none">
                {p.description}
              </p>
              
              {/* Stats / Uniforms count list */}
              <div className="mt-2 pt-2 border-t border-[#1f212a]/30 flex items-center justify-between text-[9px] font-mono text-gray-500">
                <span className="flex items-center gap-1">
                  <Layers className="w-3 h-3 text-cyan-500" />
                  {p.uniforms.length} parameters
                </span>
                
                {isActive && (
                  <span className="text-cyan-400 font-bold flex items-center gap-1.5 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded bg-cyan-400"></span>
                    ACTIVE IN CANVAS
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
