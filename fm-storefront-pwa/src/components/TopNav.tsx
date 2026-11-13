import React from 'react';
import { CameraViewMode } from '../types/store';
import { Sparkles, Building2, RotateCcw, Fish, Waves } from 'lucide-react';

interface TopNavProps {
  currentView: CameraViewMode;
  onNavigate: (view: CameraViewMode) => void;
  onOpenCheckout: (tierId: 'tier1' | 'tier2' | 'tier3') => void;
  onOpenRentalModal: () => void;
  onReopenIntro: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentView,
  onNavigate,
  onOpenCheckout,
  onOpenRentalModal,
  onReopenIntro
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 sm:px-8 py-3.5 bg-black/40 backdrop-blur-md border-b border-white/5 select-none transition-all duration-300">
      {/* Zone 1: Single text element wordmark */}
      <button 
        onClick={() => onNavigate('overview')}
        className="text-sm sm:text-base font-bold tracking-tight text-white hover:text-cyan-400 transition-colors font-display whitespace-nowrap cursor-pointer text-left"
      >
        Guide to Sovereign Media
      </button>

      {/* Zone 2: Clean text navigation links */}
      <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-slate-300">
        <button
          onClick={() => onNavigate('doorway')}
          className={`transition-colors hover:text-cyan-400 cursor-pointer ${
            currentView === 'doorway' ? 'text-cyan-400 font-semibold border-b border-cyan-400 pb-0.5' : ''
          }`}
        >
          Path of Ferns
        </button>

        <button
          onClick={() => onNavigate('overview')}
          className={`transition-colors hover:text-cyan-400 cursor-pointer ${
            currentView === 'overview' ? 'text-cyan-400 font-semibold border-b border-cyan-400 pb-0.5' : ''
          }`}
        >
          Sovereign Hall
        </button>

        <button
          onClick={() => onNavigate('wave')}
          className={`transition-colors hover:text-cyan-300 cursor-pointer flex items-center gap-1.5 ${
            currentView === 'wave' ? 'text-cyan-300 font-semibold border-b border-cyan-400 pb-0.5' : ''
          }`}
        >
          <Waves className="w-3.5 h-3.5 text-cyan-400" />
          <span>Wave Lab</span>
        </button>

        <button
          onClick={() => onNavigate('horizon')}
          className={`transition-colors hover:text-pink-300 cursor-pointer flex items-center gap-1 ${
            currentView === 'horizon' ? 'text-pink-300 font-semibold border-b border-pink-400 pb-0.5' : ''
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          <span>Horizon & Plasma</span>
        </button>

        <button
          onClick={() => onNavigate('aquarium')}
          className={`transition-colors hover:text-cyan-300 cursor-pointer flex items-center gap-1 ${
            currentView === 'aquarium' ? 'text-cyan-300 font-semibold border-b border-cyan-300 pb-0.5' : ''
          }`}
        >
          <Fish className="w-3.5 h-3.5 text-cyan-400" />
          <span>Tunnel Aquarium</span>
        </button>

        <button
          onClick={() => onNavigate('tier1')}
          className={`transition-colors hover:text-cyan-400 cursor-pointer ${
            currentView === 'tier1' ? 'text-cyan-400 font-semibold border-b border-cyan-400 pb-0.5' : ''
          }`}
        >
          Foundations · $9
        </button>

        <button
          onClick={() => onNavigate('tier2')}
          className={`transition-colors hover:text-emerald-400 cursor-pointer ${
            currentView === 'tier2' ? 'text-emerald-400 font-semibold border-b border-emerald-400 pb-0.5' : ''
          }`}
        >
          Strategic · $27
        </button>

        <button
          onClick={() => onNavigate('tier3')}
          className={`transition-colors hover:text-amber-400 cursor-pointer ${
            currentView === 'tier3' ? 'text-amber-400 font-semibold border-b border-amber-400 pb-0.5' : ''
          }`}
        >
          Master Edition · $54
        </button>
      </nav>

      {/* Zone 3: 1-2 primary actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onReopenIntro}
          title="Replay sovereign intro"
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-medium transition-colors cursor-pointer border border-white/5"
        >
          <RotateCcw className="w-3 h-3 text-cyan-400" />
          <span>Intro</span>
        </button>

        {/* Rent storefront action */}
        <button
          onClick={onOpenRentalModal}
          className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white text-xs font-medium transition-all cursor-pointer border border-white/10 flex items-center gap-1.5 whitespace-nowrap"
        >
          <Building2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>Rent Storefront</span>
        </button>

        {/* Primary Checkout CTA */}
        <button
          onClick={() => onOpenCheckout('tier3')}
          className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 rounded-lg transition-all duration-200 shadow-sm shadow-amber-500/20 whitespace-nowrap cursor-pointer flex items-center gap-1.5"
        >
          <Sparkles className="w-3 h-3" />
          <span>Master · $54</span>
        </button>
      </div>
    </header>
  );
};
