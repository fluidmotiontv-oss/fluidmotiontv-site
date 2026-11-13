import React from 'react';
import { ShoppingBag, Layers } from 'lucide-react';
import { tiers } from '../data/tiers';

interface QuickBuyDockProps {
  onSelectTier: (tierId: string) => void;
  onCompare: () => void;
  selectedTierId: string | null;
}

export const QuickBuyDock: React.FC<QuickBuyDockProps> = ({ onSelectTier, onCompare, selectedTierId }) => {
  return (
    <div className="fixed bottom-5 left-5 z-30 flex flex-col gap-2 max-w-[240px]">
      <div className="text-[9px] font-mono tracking-[0.3em] text-slate-500 uppercase pl-1">Quick Buy</div>
      {tiers.map((t) => (
        <button
          key={t.id}
          onClick={() => onSelectTier(t.id)}
          className={`group flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl border backdrop-blur-md transition-all cursor-pointer text-left ${
            selectedTierId === t.id
              ? 'bg-cyan-500/20 border-cyan-400/60 shadow-lg shadow-cyan-500/20'
              : 'bg-slate-950/70 border-white/10 hover:border-cyan-400/50 hover:bg-slate-900/80'
          }`}
        >
          <span className="min-w-0">
            <span className="block text-[9px] font-mono uppercase tracking-widest text-slate-400 truncate">{t.name}</span>
            <span className="block text-[10px] text-slate-500 line-through">${t.originalPrice}</span>
          </span>
          <span className="flex items-center gap-1.5 flex-shrink-0">
            <span className="font-mono font-bold text-amber-300">${t.price}</span>
            <ShoppingBag className="w-3.5 h-3.5 text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity" />
          </span>
        </button>
      ))}
      <button
        onClick={onCompare}
        className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-400/50 hover:text-emerald-300 text-slate-300 text-[11px] font-mono tracking-wider transition-all cursor-pointer"
      >
        <Layers className="w-3.5 h-3.5" />
        COMPARE VOLUMES
      </button>
    </div>
  );
};
