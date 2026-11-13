import React from 'react';
import { X, Fish, Waves, Sparkles, Layers, BookOpen, Check } from 'lucide-react';

interface GuideOverlayProps { isOpen: boolean; onClose: () => void; }

const TIPS = [
  { icon: BookOpen, color: 'text-amber-300', title: 'Three Volumes', text: 'Neon e-book editions at $9, $27 and $54. Click a display case or press 1, 2, 3.' },
  { icon: Fish, color: 'text-cyan-300', title: 'Aquarium', text: 'Take a breath in the jellyfish lounge. Press A.' },
  { icon: Waves, color: 'text-sky-300', title: 'Wave Lab', text: 'Hydrodynamics chamber with live wave science. Press W.' },
  { icon: Sparkles, color: 'text-pink-300', title: 'Horizon & Plasma', text: 'Ambient shader horizon with plasma field. Press H.' },
  { icon: Layers, color: 'text-emerald-300', title: 'Compare', text: 'Side-by-side matrix of all three volumes before you buy.' },
  { icon: Check, color: 'text-teal-300', title: 'Instant Delivery', text: 'PayPal checkout — license and e-books emailed to you within minutes.' },
];

const KEYS: [string, string][] = [
  ['1 · 2 · 3', 'Jump to tier'], ['0', 'Overview'], ['A', 'Aquarium'],
  ['W', 'Wave Lab'], ['H', 'Horizon'], ['Esc', 'Close panels'],
];

export const GuideOverlay: React.FC<GuideOverlayProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative w-full max-w-2xl glass-panel-glow rounded-2xl p-6 sm:p-8 border border-cyan-500/30 z-10 shadow-2xl max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer" aria-label="Close guide">
          <X className="w-4 h-4" />
        </button>
        <div className="text-center mb-6">
          <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-[0.3em]">Explorer&apos;s Guide</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-display mt-1 animate-glitch-glow">How To Wander The Store</h2>
          <p className="text-xs text-slate-300 mt-2 max-w-md mx-auto">Everything in this shop is a living space. Look around, touch things, take your time.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {TIPS.map((t) => (
            <div key={t.title} className="flex gap-3 p-3 rounded-xl bg-black/40 border border-white/10 hover:border-cyan-500/40 transition-colors">
              <t.icon className={`w-5 h-5 ${t.color} flex-shrink-0 mt-0.5`} />
              <div>
                <div className="text-sm font-semibold text-white">{t.title}</div>
                <div className="text-[11px] text-slate-400 leading-relaxed mt-0.5">{t.text}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mb-6">
          <div className="text-[11px] font-mono text-slate-500 uppercase tracking-widest mb-2 text-center">Keyboard Shortcuts</div>
          <div className="flex flex-wrap justify-center gap-2">
            {KEYS.map(([k, label]) => (
              <span key={k} className="inline-flex items-center gap-1.5 text-[11px] font-mono">
                <kbd className="px-2 py-1 rounded bg-white/10 border border-white/15 text-cyan-200">{k}</kbd>
                <span className="text-slate-400">{label}</span>
              </span>
            ))}
          </div>
          <p className="text-center text-[11px] text-slate-500 mt-3">On touch screens: drag to look around, pinch to zoom, tap the display cases.</p>
        </div>
        <button onClick={onClose} className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-bold text-sm tracking-wide transition-all cursor-pointer">
          Start Exploring
        </button>
      </div>
    </div>
  );
};
