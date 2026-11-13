import React from 'react';

interface BootLoaderProps {
  fading: boolean;
  onDone: () => void;
}

export const BootLoader: React.FC<BootLoaderProps> = ({ fading, onDone }) => {
  return (
    <div
      onAnimationEnd={(e) => { if (fading && e.animationName === 'boot-fade') onDone(); }}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#020617] ${fading ? 'animate-[boot-fade_0.45s_ease_forwards]' : ''}`}
      style={{ animationName: fading ? 'boot-fade' : undefined }}
    >
      <style>{`@keyframes boot-fade { to { opacity: 0; visibility: hidden; } }`}</style>
      <div className="relative flex items-center justify-center">
        <div className="absolute w-40 h-40 rounded-full border border-cyan-400/30 animate-ping" style={{ animationDuration: '2.2s' }} />
        <div className="absolute w-28 h-28 rounded-full border border-amber-400/40" />
        <div className="absolute w-16 h-16 rounded-full border border-cyan-300/60 animate-pulse" />
        <span className="relative font-display font-bold text-3xl bg-gradient-to-r from-cyan-300 via-amber-300 to-cyan-300 bg-clip-text text-transparent">FM</span>
      </div>
      <div className="mt-8 font-mono text-xs tracking-[0.4em] text-cyan-400 uppercase animate-pulse">Synchronising</div>
      <div className="mt-2 font-display font-bold text-lg sm:text-2xl tracking-[0.2em] text-white">FLUID MOTION OF THE FUTURE</div>
      <div className="mt-3 text-[10px] font-mono tracking-[0.3em] text-slate-500">DRAGON9 &middot; 432HZ &middot; PORT WAIKATO</div>
    </div>
  );
};
