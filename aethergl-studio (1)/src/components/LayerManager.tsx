import React, { useState } from 'react';
import { Layers, Plus, Trash2, ShieldCheck, ChevronRight, Sliders, Music, Eye, EyeOff, Sparkles, Box, Disc } from 'lucide-react';
import { CollabLayer } from '../utils/collab';

interface LayerManagerProps {
  layers: CollabLayer[];
  selectedLayerId: string | null;
  onSelectLayer: (id: string | null) => void;
  onUpdateLayer: (id: string, updates: Partial<CollabLayer>) => void;
  onAddLayer: () => void;
  onRemoveLayer: (id: string) => void;
  onLoadTemplate: (templateName: 'trio_space' | 'duo_neon' | 'quad_core') => void;
}

export default function LayerManager({
  layers,
  selectedLayerId,
  onSelectLayer,
  onUpdateLayer,
  onAddLayer,
  onRemoveLayer,
  onLoadTemplate,
}: LayerManagerProps) {
  return (
    <div className="flex flex-col h-full bg-[#111218] border border-[#1f212a] rounded-xl overflow-hidden shadow-2xl">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0e0f14] border-b border-[#1f212a]">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-300 font-mono">
            Composition Stacks
          </h2>
        </div>
        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded uppercase font-bold">
          {layers.length} / 4 Layers
        </span>
      </div>

      {/* Templates Quick Compositor */}
      <div className="p-3 border-b border-[#1f212a] bg-[#14151e]/40">
        <span className="text-[10px] font-mono text-gray-500 font-semibold uppercase block mb-2">
          Load Multi-Player Templates
        </span>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => onLoadTemplate('duo_neon')}
            className="py-1.5 px-2 bg-[#171822] hover:bg-cyan-500/10 border border-[#232635] hover:border-cyan-500/30 rounded text-[10px] font-mono text-gray-400 hover:text-cyan-300 transition-all text-center truncate"
          >
            Neon Duo (2P)
          </button>
          <button
            onClick={() => onLoadTemplate('trio_space')}
            className="py-1.5 px-2 bg-[#171822] hover:bg-cyan-500/10 border border-[#232635] hover:border-cyan-500/30 rounded text-[10px] font-mono text-gray-400 hover:text-cyan-300 transition-all text-center truncate"
          >
            Digital Nebula (3P)
          </button>
          <button
            onClick={() => onLoadTemplate('quad_core')}
            className="py-1.5 px-2 bg-[#171822] hover:bg-cyan-500/10 border border-[#232635] hover:border-cyan-500/30 rounded text-[10px] font-mono text-gray-400 hover:text-cyan-300 transition-all text-center truncate"
          >
            Aether Core (4P)
          </button>
        </div>
      </div>

      {/* Layers list scroll view */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-[#12131a]">
        {Array.from({ length: 4 }).map((_, index) => {
          const layer = layers[index];
          const isSelected = layer && layer.id === selectedLayerId;

          if (!layer) {
            // Render Empty Locked/Dashed Slot
            return (
              <div
                key={`empty-${index}`}
                onClick={onAddLayer}
                className="border border-dashed border-[#232635] hover:border-cyan-500/30 rounded-xl p-4 text-center cursor-pointer transition-all hover:bg-cyan-500/5 group flex flex-col items-center justify-center py-6"
              >
                <Plus className="w-5 h-5 text-gray-600 group-hover:text-cyan-400 mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-mono font-semibold uppercase text-gray-500 group-hover:text-cyan-300">
                  Join Layer {index + 1}
                </span>
                <span className="text-[9px] font-mono text-gray-600 block mt-0.5">
                  Merge a collaborator&apos;s audiovisual asset
                </span>
              </div>
            );
          }

          return (
            <div
              key={layer.id}
              onClick={() => onSelectLayer(layer.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all relative ${
                isSelected
                  ? 'bg-cyan-950/15 border-cyan-500/40 text-cyan-300 shadow-md shadow-cyan-500/5'
                  : 'bg-[#171822]/60 border-[#1f212a] hover:border-[#232635] hover:bg-[#1a1b28]/60 text-gray-300'
              }`}
            >
              {/* Creator details and title */}
              <div className="flex items-start justify-between mb-3.5">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0"></span>
                    <span className="text-xs font-bold font-mono tracking-tight text-white truncate">
                      {layer.name}
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-gray-500 flex items-center gap-1 mt-0.5 truncate">
                    Contributor: <span className="text-cyan-400 font-bold">@{layer.creator}</span>
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-[8px] bg-black/40 border border-[#232635] text-gray-500 font-mono px-1.5 py-0.5 rounded select-none uppercase font-bold">
                    Layer {index + 1}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveLayer(layer.id);
                    }}
                    className="p-1 hover:bg-red-500/10 text-gray-500 hover:text-red-400 rounded transition-colors"
                    title="Remove Layer from Stack"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Collapsed short description of movements */}
              {isSelected ? (
                <div className="space-y-3.5 pt-3.5 border-t border-[#1f212a]/60 font-mono text-[11px] text-gray-400">
                  {/* Mesh binding dropdown */}
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-gray-500 flex items-center gap-1 shrink-0 text-[10px]">
                      <Box className="w-3.5 h-3.5" /> Geometry Shape
                    </span>
                    <select
                      value={layer.meshType}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => onUpdateLayer(layer.id, { meshType: e.target.value as any })}
                      className="bg-[#0b0c10] border border-[#232635] text-white focus:outline-none rounded px-2 py-0.5 text-xs focus:text-cyan-300"
                    >
                      <option value="torus">Torus</option>
                      <option value="sphere">Sphere</option>
                      <option value="cube">Cube</option>
                      <option value="cylinder">Cylinder</option>
                      <option value="plane">Plane</option>
                    </select>
                  </div>

                  {/* Synth audio track binding */}
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-gray-500 flex items-center gap-1 shrink-0 text-[10px]">
                      <Music className="w-3.5 h-3.5" /> Synth Link
                    </span>
                    <select
                      value={layer.synthTrackId}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => onUpdateLayer(layer.id, { synthTrackId: e.target.value as any })}
                      className="bg-[#0b0c10] border border-[#232635] text-white focus:outline-none rounded px-2 py-0.5 text-xs focus:text-cyan-300"
                    >
                      <option value="synthwave">Cyber Synthwave Beat</option>
                      <option value="ambient">Aether Ambient Pad</option>
                      <option value="chiptune">8-Bit Chiptune Arp</option>
                    </select>
                  </div>

                  {/* Orbit speed slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-gray-500">Rotation Velocity</span>
                      <span className="text-cyan-400 font-bold tabular-nums">{(layer.rotationSpeed * 10).toFixed(1)}x</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="4"
                      step="0.1"
                      value={layer.rotationSpeed}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => onUpdateLayer(layer.id, { rotationSpeed: parseFloat(e.target.value) })}
                      className="w-full h-1 bg-black/60 rounded accent-cyan-400"
                    />
                  </div>

                  {/* Pulse reactive scale warp */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-gray-500">Audio Pulse Warp</span>
                      <span className="text-cyan-400 font-bold tabular-nums">{(layer.pulseRange * 100).toFixed(0)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1.5"
                      step="0.05"
                      value={layer.pulseRange}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => onUpdateLayer(layer.id, { pulseRange: parseFloat(e.target.value) })}
                      className="w-full h-1 bg-black/60 rounded accent-cyan-400"
                    />
                  </div>

                  {/* Base Color Picker */}
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-gray-500 text-[10px]">Mesh RGB Hue</span>
                    <input
                      type="color"
                      value={`#${layer.baseColor.map(c => Math.floor(c * 255).toString(16).padStart(2, '0')).join('')}`}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        const hex = e.target.value;
                        const r = parseInt(hex.slice(1, 3), 16) / 255;
                        const g = parseInt(hex.slice(3, 5), 16) / 255;
                        const b = parseInt(hex.slice(5, 7), 16) / 255;
                        onUpdateLayer(layer.id, { baseColor: [r, g, b] });
                      }}
                      className="w-6 h-6 rounded bg-transparent border border-[#232635] cursor-pointer"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between text-[9px] font-mono text-gray-500 pt-2 border-t border-[#1f212a]/30">
                  <span className="capitalize flex items-center gap-1">
                    <Box className="w-3 h-3 text-cyan-500" /> {layer.meshType} mesh
                  </span>
                  <span className="capitalize flex items-center gap-1">
                    <Music className="w-3 h-3 text-cyan-500" /> {layer.synthTrackId} synth
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
