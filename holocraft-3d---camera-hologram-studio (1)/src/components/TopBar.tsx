/**
 * HoloCraft 3D - Top Navigation Bar (3-Zone Contract)
 */

import React from 'react';
import { 
  Sparkles, 
  Camera, 
  Download, 
  Sliders, 
  Volume2, 
  VolumeX, 
  Brain, 
  Layers, 
  Flame,
  Zap,
  Box,
  Share2,
  Gamepad2,
  Music
} from 'lucide-react';
import { ViewportMode } from '../types/hologram';

interface TopBarProps {
  activeTab: 'viewport' | 'camera' | 'depth' | 'shader';
  onSelectTab: (tab: 'viewport' | 'camera' | 'depth' | 'shader') => void;
  onOpenTuner: () => void;
  onOpenExport: () => void;
  onOpenAiVision: () => void;
  onOpenSamples: () => void;
  onOpenGame: () => void;
  onOpenSocial: () => void;
  isAudioMuted: boolean;
  onToggleAudio: () => void;
  onInstantSelfie: () => void;
  isPowerSongPlaying: boolean;
  onTogglePowerSong: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  onSelectTab,
  onOpenTuner,
  onOpenExport,
  onOpenAiVision,
  onOpenSamples,
  onOpenGame,
  onOpenSocial,
  isAudioMuted,
  onToggleAudio,
  onInstantSelfie,
  isPowerSongPlaying,
  onTogglePowerSong,
}) => {
  return (
    <header className="w-full flex items-center justify-between px-6 py-3.5 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl z-30 font-mono">
      {/* Zone 1: Single Brand Mark */}
      <div className="flex items-center gap-3">
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); onSelectTab('viewport'); }}
          className="text-base font-bold tracking-tight text-white hover:text-cyan-300 transition-colors flex items-center gap-2"
        >
          <div className="p-1.5 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-400">
            <Zap className="w-4 h-4" />
          </div>
          <span>HoloCraft 3D</span>
        </a>
        <span className="hidden sm:inline text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-400/20 font-semibold">
          432 Hz SENSOR
        </span>
      </div>

      {/* Zone 2: 4-6 Text Navigation Links */}
      <nav className="hidden xl:flex items-center gap-1.5 p-1 bg-white/5 rounded-xl border border-white/10 text-xs">
        {[
          { id: 'viewport', label: '3D Hologram Stage' },
          { id: 'camera', label: 'Camera Studio' },
          { id: 'depth', label: 'Depth & Normal Map' },
          { id: 'shader', label: 'GLSL Raymarch' },
        ].map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id as any)}
              className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Zone 3: Primary Action Buttons + Instant Selfie + Raw Power Song + Game + Social */}
      <div className="flex items-center gap-2">
        {/* Instant Selfie 3D Route */}
        <button
          onClick={onInstantSelfie}
          className="px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.4)] transition-all flex items-center gap-1.5 whitespace-nowrap"
          title="Instant Route: Turn Selfie into WebGL 3D Hologram Face"
        >
          <Camera className="w-3.5 h-3.5" />
          <span>SELFIE 3D</span>
        </button>

        {/* Play GL Game */}
        <button
          onClick={onOpenGame}
          className="px-3.5 py-1.5 text-xs font-bold text-cyan-300 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap shadow-sm"
          title="Play Cyber Hologram GL Game"
        >
          <Gamepad2 className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">GL Game</span>
        </button>

        {/* Social Media Ingest */}
        <button
          onClick={onOpenSocial}
          className="px-3.5 py-1.5 text-xs font-bold text-purple-300 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/50 rounded-xl transition-all hidden lg:flex items-center gap-1.5 whitespace-nowrap"
          title="Ingest Social Media Avatar"
        >
          <Share2 className="w-3.5 h-3.5 text-purple-400" />
          <span>Social Ingest</span>
        </button>

        {/* Raw Power Song Button */}
        <button
          onClick={onTogglePowerSong}
          className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all border flex items-center gap-1.5 whitespace-nowrap ${
            isPowerSongPlaying
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/60 shadow-[0_0_15px_rgba(16,185,129,0.4)] animate-pulse'
              : 'bg-white/5 text-slate-300 hover:text-white border-white/10'
          }`}
          title="Toggle 'Raw Power' Audio-Reactive Cyber Beat"
        >
          <Flame className={`w-3.5 h-3.5 ${isPowerSongPlaying ? 'text-emerald-400' : 'text-slate-400'}`} />
          <span className="hidden sm:inline">RAW POWER ♫</span>
        </button>

        <button
          onClick={onOpenTuner}
          className="p-2 text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors hidden sm:flex"
          title="3D & Shader Parameter Tuner"
        >
          <Sliders className="w-4 h-4 text-amber-400" />
        </button>

        <button
          onClick={onOpenExport}
          className="px-4 py-1.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all flex items-center gap-1.5"
          title="Export 3D OBJ, PLY, STL, GLSL, and Pyramid Assets"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export</span>
        </button>
      </div>
    </header>
  );
};
