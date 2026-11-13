import React, { useState } from 'react';
import { ShieldCheck, Award, Layers, Clipboard, Check, ChevronDown, User, Sparkles } from 'lucide-react';

interface IdentityBadgeProps {
  signatureHash: string;
  layerCount: number;
  completedMeetsCount: number; // Meets completed (goal of 3)
  completedCertificatesCount: number;
}

export default function IdentityBadge({
  signatureHash,
  layerCount,
  completedMeetsCount,
  completedCertificatesCount,
}: IdentityBadgeProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copySignature = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(signatureHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine progress status percentages
  const progressRatio = Math.min(1.0, completedMeetsCount / 3);
  const strokeDashoffset = 50.2 * (1 - progressRatio); // Circumference is 2 * PI * 8 = ~50.2

  return (
    <div 
      className="relative shrink-0 select-none"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Outer interactive Badge frame */}
      <div className="flex items-center gap-2.5 px-3 py-1.5 bg-[#111218]/80 border border-[#1f212a] hover:border-[#2b2e40] rounded-lg cursor-pointer transition-all">
        {/* Real-time Circular Progress SVG */}
        <div className="relative w-5 h-5 flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-90">
            {/* Background ring */}
            <circle
              cx="10"
              cy="10"
              r="8"
              className="stroke-[#1f212a]"
              strokeWidth="2"
              fill="transparent"
            />
            {/* Active progress ring */}
            <circle
              cx="10"
              cy="10"
              r="8"
              className="stroke-cyan-400 transition-all duration-300"
              strokeWidth="2"
              fill="transparent"
              strokeDasharray="50.2"
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
          <span className="absolute text-[8px] font-bold font-mono text-cyan-400 tabular-nums">
            {completedMeetsCount}
          </span>
        </div>

        {/* Level metrics details (Strict unboxed metadata!) */}
        <div className="text-left font-mono leading-none">
          <div className="text-[10px] font-extrabold text-white tracking-wider flex items-center gap-1">
            {signatureHash}
          </div>
          <div className="text-[8px] text-gray-500 font-semibold mt-1 flex items-center gap-1">
            <span>Layers: <strong className="text-cyan-400">{layerCount}</strong></span>
            <span>·</span>
            <span>Progress: <strong className="text-cyan-400">{completedMeetsCount}/3</strong></span>
          </div>
        </div>

        <ChevronDown className="w-3.5 h-3.5 text-gray-500 group-hover:text-white" />
      </div>

      {/* Interactive hover micro-HUD dropdown card */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-[#0d0e12]/95 border border-[#1f212a] p-4 rounded-xl shadow-2xl backdrop-blur-md z-50 space-y-3.5 font-mono text-[11px] leading-relaxed animate-fade-in">
          <div className="flex items-center gap-2 border-b border-[#1f212a] pb-2">
            <User className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="font-bold text-white uppercase text-[10px] tracking-wide">
              Sovereign Passport
            </span>
          </div>

          {/* User Address and Copy function */}
          <div className="bg-black/40 rounded-lg p-2.5 border border-[#1f212a]/50 flex items-center justify-between gap-3">
            <div>
              <span className="text-[8px] text-gray-600 block uppercase font-bold mb-0.5">My Signature Hash</span>
              <span className="text-xs font-bold text-cyan-300">{signatureHash}</span>
            </div>
            <button
              onClick={copySignature}
              className="p-1.5 hover:bg-white/5 text-gray-400 hover:text-cyan-400 rounded transition-all shrink-0"
              title="Copy signature hash"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Clipboard className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Stats Roster */}
          <div className="space-y-1.5">
            <span className="text-[8px] text-gray-600 block uppercase font-bold">Contribution level</span>
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-gray-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-500" /> Layer Stack Size
              </span>
              <span className="font-extrabold text-white tabular-nums">{layerCount} / 4</span>
            </div>

            <div className="flex justify-between items-center text-[10px]">
              <span className="text-gray-400 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-cyan-500" /> Signed Compositions
              </span>
              <span className="font-extrabold text-white tabular-nums">{completedCertificatesCount}</span>
            </div>
          </div>

          {/* Progress to 3 colab unlock requirement */}
          <div className="pt-2.5 border-t border-[#1f212a]/40 space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-[8px] text-gray-600 uppercase font-bold">3-Colab Unlock Goal</span>
              <span className="text-cyan-400 font-extrabold text-[10px] tabular-nums">
                {Math.round(progressRatio * 100)}%
              </span>
            </div>
            
            <div className="flex gap-1">
              {[1, 2, 3].map((step) => {
                const isMet = completedMeetsCount >= step;
                return (
                  <div
                    key={step}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      isMet ? 'bg-gradient-to-r from-cyan-400 to-blue-500 shadow-sm shadow-cyan-400/20' : 'bg-[#1f212a]'
                    }`}
                  />
                );
              })}
            </div>
            
            <p className="text-[9px] text-gray-500 font-sans leading-snug">
              {progressRatio === 1 
                ? '✓ Bilateral triangle unlocked! You are eligible for 3P Masterpiece sign-offs.' 
                : 'Commune with other artists on the Collab tab to complete meets.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
