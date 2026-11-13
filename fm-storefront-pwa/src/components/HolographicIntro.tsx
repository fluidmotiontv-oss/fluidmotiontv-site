import React from 'react';
import { ArrowRight, Sparkles, Fish, Waves } from 'lucide-react';

interface HolographicIntroProps {
  isOpen: boolean;
  onEnterStore: () => void;
  onSelectOverview: () => void;
  onEnterAquarium: () => void;
  onEnterHorizon?: () => void;
  onEnterWave?: () => void;
}

export const HolographicIntro: React.FC<HolographicIntroProps> = ({
  isOpen,
  onEnterStore,
  onSelectOverview,
  onEnterAquarium,
  onEnterHorizon,
  onEnterWave
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 sm:p-6 bg-black/65 backdrop-blur-md transition-all duration-700 animate-fadeIn">
      {/* Background ambient radial glow */}
      <div className="absolute inset-0 pointer-events-none bg-radial from-cyan-950/40 via-transparent to-transparent opacity-85" />

      {/* Holographic Container */}
      <div className="relative max-w-3xl w-full glass-panel-glow rounded-2xl p-8 sm:p-12 text-center overflow-hidden shadow-2xl border border-cyan-500/40">
        {/* Hologram sweep bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-90 animate-pulse" />
        
        {/* Large WELCOME Note Overlay */}
        <div className="mb-5 inline-block">
          <div className="px-5 py-2 rounded-full bg-gradient-to-r from-cyan-500/25 via-emerald-500/25 to-pink-500/25 border border-cyan-400/50 text-cyan-200 font-mono text-xs sm:text-sm tracking-widest uppercase shadow-lg shadow-cyan-500/25 animate-pulse">
            ★ WELCOME TO THE FUTURE · VIVA LA RESOLUTION ★
          </div>
        </div>

        {/* Unboxed editorial kicker */}
        <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-cyan-400 uppercase mb-4">
          <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Sovereign Media Codex · 3D Exhibition</span>
        </div>

        {/* High-impact Bold Title Animation ("Welcome Boom") */}
        <h1 
          className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6 uppercase leading-tight font-display animate-glitch-glow"
          style={{ textWrap: 'balance' }}
        >
          Guide To <br />
          <span className="bg-gradient-to-r from-cyan-300 via-emerald-300 to-amber-300 bg-clip-text text-transparent">
            Sovereign Media
          </span>
        </h1>

        {/* Clean Subtitle & Unboxed Metadata */}
        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed mb-6 font-sans">
          The seminal digital publication for independent creators and media empires. Step through the doorway to inspect our three neon e-book volumes ($9, $27, $54) in the 3D exhibition hall.
        </p>

        {/* Zero-Pill Unboxed Metadata Line with typographic separators */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400 mb-8 font-mono">
          <span className="text-cyan-400">Foundations E-Book · $9</span>
          <span aria-hidden="true" className="text-cyan-500">·</span>
          <span className="text-emerald-400">Strategic Guide · $27</span>
          <span aria-hidden="true" className="text-cyan-500">·</span>
          <span className="text-amber-400">Master Omnibus · $54</span>
          <span aria-hidden="true" className="text-cyan-500">·</span>
          <span className="text-slate-300">PayPal Instant Delivery</span>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <button
            onClick={onEnterStore}
            className="w-full sm:w-auto px-7 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <span>Enter Sovereign Hall</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onEnterAquarium}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-200 text-sm font-medium transition-all duration-200 border border-cyan-500/30 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Fish className="w-4 h-4 text-cyan-400" />
            <span>Tunnel Aquarium</span>
          </button>

          {onEnterWave && (
            <button
              onClick={onEnterWave}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-200 text-sm font-medium transition-all duration-200 border border-cyan-400/40 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-cyan-500/15"
            >
              <Waves className="w-4 h-4 text-cyan-400" />
              <span>Wave Lab</span>
            </button>
          )}

          {onEnterHorizon && (
            <button
              onClick={onEnterHorizon}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-pink-950/40 hover:bg-pink-900/50 text-pink-200 text-sm font-medium transition-all duration-200 border border-pink-500/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span>Horizon & Plasma</span>
            </button>
          )}

          <button
            onClick={onSelectOverview}
            className="w-full sm:w-auto px-5 py-3 rounded-xl glass-panel hover:bg-white/10 text-slate-300 text-sm font-medium transition-all duration-200 hover:text-white border border-white/10 cursor-pointer"
          >
            Direct Catalog
          </button>
        </div>

        <div className="mt-8 text-[11px] text-slate-500">
          Pure DRM-Free E-Books · Instant Digital Access · Real-time WebGL Spatial Showcase
        </div>
      </div>
    </div>
  );
};
