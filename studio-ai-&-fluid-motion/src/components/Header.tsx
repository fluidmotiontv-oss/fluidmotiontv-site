import React from 'react';
import { Sparkles, Radio, Music, Image as ImageIcon, BookOpen, Camera, Coins, Clock, Waves, User, Award, Compass, History, Film, Tv } from 'lucide-react';
import { D9ClockState } from '../types';
import { formatD9Time } from '../lib/dragon9Clock';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  d9State: D9ClockState;
  harmonyNotes: number;
  shavings: number;
  onOpenAssistant: () => void;
  onOpenAssistantDirector?: () => void;
  onOpenProfile: () => void;
  onOpenFrostbite?: () => void;
  onOpenTour?: () => void;
  onOpenPremiereStage?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  d9State,
  harmonyNotes,
  shavings,
  onOpenAssistant,
  onOpenAssistantDirector,
  onOpenProfile,
  onOpenFrostbite,
  onOpenTour,
  onOpenPremiereStage,
}) => {
  const navItems = [
    { id: 'vector', label: 'Vector Art', icon: ImageIcon },
    { id: 'music', label: 'Sovereign Beats', icon: Music },
    { id: 'comic', label: 'Storyboard Prep', icon: BookOpen },
    { id: 'movie', label: 'Micro Movies', icon: Film },
    { id: 'ar', label: 'AR Overlays', icon: Camera },
    { id: 'radio', label: 'Radio & Vault', icon: Radio },
    { id: 'temporal', label: 'Temporal History', icon: History },
  ];

  return (
    <header className="bg-[#050505] border-b border-[#333] text-[#e0e0e0] sticky top-0 z-40 backdrop-blur-md bg-opacity-95">
      {/* Top Protocol Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between text-xs border-b border-[#222] gap-2">
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#F27D26] font-bold flex items-center gap-1.5">
            <Waves className="w-3.5 h-3.5 animate-pulse text-[#F27D26]" />
            Principal Creative Node: Port Waikato
          </span>
          <span className="hidden md:inline font-mono text-[11px] text-[#888]">
            Protocol: <strong className="text-[#e0e0e0]">Dragon 9 Clock</strong>
          </span>
          <span className="hidden lg:inline font-mono text-[10px] text-[#00E5FF] uppercase tracking-widest">
            AS65001 MESH GATEWAY
          </span>
        </div>

        {/* Live D9 Clock Ticker & Assistant */}
        <div className="flex items-center gap-3">
          {onOpenPremiereStage && (
            <button
              onClick={onOpenPremiereStage}
              className={`flex items-center gap-1.5 px-3 py-1 font-mono text-[11px] font-black uppercase transition-all shadow-md tracking-wider cursor-pointer ${
                d9State.isApexWedge
                  ? 'bg-[#FFD700] hover:bg-[#ffe142] text-black shadow-[0_0_15px_rgba(255,215,0,0.6)] animate-pulse'
                  : 'bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-[#FFD700] text-[#FFD700]'
              }`}
              title="Open Premiere Stage Modal"
            >
              <Tv className="w-3.5 h-3.5" />
              <span>Premiere Stage</span>
            </button>
          )}

          <div className={`flex items-center gap-2 px-3 py-1 font-mono text-xs font-bold border ${
            d9State.isApexWedge
              ? 'bg-[#FFD700]/10 text-[#FFD700] border-[#FFD700] animate-pulse'
              : 'bg-[#111] text-[#00E5FF] border-[#333]'
          }`}>
            <Clock className="w-3.5 h-3.5" />
            <span>{formatD9Time(d9State)}</span>
          </div>

          {onOpenTour && (
            <button
              onClick={onOpenTour}
              className="flex items-center gap-1.5 px-3 py-1 bg-[#222] hover:bg-[#333] border border-[#00E5FF] text-[#00E5FF] font-black uppercase text-[11px] transition-all shadow-md tracking-wider cursor-pointer"
              title="Launch 3-Step Studio Tour & Guide"
            >
              <Compass className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span>Tour</span>
            </button>
          )}

          {onOpenFrostbite && (
            <button
              onClick={onOpenFrostbite}
              className="flex items-center gap-1.5 px-3 py-1 bg-[#00FF88] hover:bg-[#33ff99] text-black font-black uppercase text-[11px] transition-all shadow-md tracking-wider cursor-pointer"
              title="Open Frostbite: Surf XA-Stretch AI Buddy & Coastal Guide"
            >
              <span>🥶</span>
              <span>Frostbite Buddy</span>
            </button>
          )}

          {onOpenAssistantDirector && (
            <button
              onClick={onOpenAssistantDirector}
              className="flex items-center gap-1.5 px-3 py-1 bg-[#F27D26] hover:bg-[#ff8e3e] text-black font-black uppercase text-[11px] transition-all shadow-md tracking-wider cursor-pointer"
            >
              <Film className="w-3.5 h-3.5 text-black" />
              <span>Director's Guide</span>
            </button>
          )}

          <button
            onClick={onOpenAssistant}
            className="flex items-center gap-1.5 px-3 py-1 bg-[#00E5FF] hover:bg-[#33ebff] text-black font-black uppercase text-[11px] transition-all shadow-md tracking-wider cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-black" />
            <span>AI Mentor</span>
          </button>
        </div>
      </div>

      {/* Main Header & Navigation */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand Identity */}
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 border-2 border-[#F27D26] bg-[#111] flex items-center justify-center font-black text-xl italic text-[#F27D26] shrink-0">
            D9
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black italic tracking-tighter leading-none text-[#e0e0e0]">
              STUDIO AI / FLUID MOTION
            </h1>
            <p className="text-[11px] font-mono opacity-70 uppercase tracking-widest mt-1">
              <span className="text-[#F27D26] font-bold">SOVEREIGN MEDIA STUDIO</span> • UNIFIED 1,440M SOLAR TIME CYCLE
            </p>
          </div>
        </div>

        {/* User Profile & Currency / Harmony Notes Widgets */}
        <div className="flex flex-wrap items-center gap-3">
          {/* User Profile Trigger Card */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2.5 bg-[#111] hover:bg-[#1a1a1a] border border-[#333] hover:border-[#F27D26] px-3 py-2 font-mono text-xs transition-all cursor-pointer group"
            title="Click to view Artist Rank, Creations Count & Harmony Breakdown"
          >
            <div className="w-7 h-7 border border-[#FFD700] bg-[#050505] flex items-center justify-center text-[11px] font-black italic text-[#FFD700] group-hover:scale-105 transition-transform shrink-0">
              KC
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-[11px] font-bold text-[#e0e0e0] group-hover:text-[#F27D26] flex items-center gap-1">
                <span>Kai Coastline</span>
                <User className="w-3 h-3 text-[#F27D26]" />
              </div>
              <div className="text-[9px] text-[#00FF88] uppercase font-bold flex items-center gap-1">
                <Award className="w-2.5 h-2.5 text-[#00FF88]" />
                <span>Apex Wave Master</span>
              </div>
            </div>
          </button>

          {/* Currency / Harmony Notes Widget */}
          <div
            onClick={onOpenProfile}
            className="flex items-center gap-3 bg-[#111] hover:bg-[#1a1a1a] border border-[#333] hover:border-[#FFD700] px-4 py-2 font-mono text-xs cursor-pointer transition-all"
            title="Click to view Artist Profile & Harmony Ledger"
          >
            <div className="flex items-center gap-1.5 font-bold text-[#FFD700]">
              <Coins className="w-4 h-4 text-[#FFD700]" />
              <span className="text-sm">{harmonyNotes.toLocaleString()}</span>
              <span className="text-[10px] text-opacity-60 text-white uppercase tracking-wider font-normal">Harmony</span>
            </div>
            <div className="h-4 w-px bg-[#333]" />
            <div className="flex items-center gap-1 text-[#00FF88] font-bold">
              <span>{shavings}</span>
              <span className="text-[10px] text-[#888] font-normal uppercase">Shavings</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 flex overflow-x-auto no-scrollbar border-t border-[#333]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap ${
                isActive
                  ? 'border-[#F27D26] text-[#F27D26] bg-[#111]'
                  : 'border-transparent text-[#aaa] hover:text-[#e0e0e0] hover:bg-[#111]/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#F27D26]' : 'text-[#666]'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};

