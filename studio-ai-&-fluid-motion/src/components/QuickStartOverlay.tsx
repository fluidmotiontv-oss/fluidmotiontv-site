import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle2,
  ImageIcon,
  Music,
  Zap,
  Compass,
  Coins,
  ShieldCheck,
  Play
} from 'lucide-react';

interface QuickStartOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
  onEarnHarmony?: (amount: number, description: string) => void;
}

interface TourStep {
  stepNumber: number;
  title: string;
  subtitle: string;
  tabTarget: string;
  badge: string;
  icon: any;
  highlightPoints: { label: string; detail: string }[];
  actionLabel: string;
  quote: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    stepNumber: 1,
    title: 'Vector Art Studio',
    subtitle: 'Extract 1:1 Vector Graphics & Sticker Badges',
    tabTarget: 'vector',
    badge: 'Step 1 of 3: Visuals',
    icon: ImageIcon,
    highlightPoints: [
      {
        label: 'Coastal Vectorizer',
        detail: 'Upload coastal photos or use preset sticker templates to generate high-contrast 1:1 vector graphics.',
      },
      {
        label: 'Pee Dub Color Palettes',
        detail: 'Apply high-contrast sunset orange (#F27D26), cyber cyan (#00E5FF), and neon green (#00FF88) theme layers.',
      },
      {
        label: 'Node Stream Export',
        detail: 'Export clean SVG vector stickers directly to the Port Waikato AS65001 mesh feed.',
      },
    ],
    actionLabel: 'Explore Vector Studio',
    quote: '"Turn raw coastal imagery into clean sovereign vector badges in seconds."',
  },
  {
    stepNumber: 2,
    title: 'Sovereign Music Studio',
    subtitle: '16-Step Beat Sequencer & Dub Delay FX',
    tabTarget: 'music',
    badge: 'Step 2 of 3: Rhythms',
    icon: Music,
    highlightPoints: [
      {
        label: '82 BPM Reggae / Dub Grid',
        detail: 'Tap 16-step beat patterns with Kick, Snare, Hi-Hat, Synth, and Dub Chords.',
      },
      {
        label: 'Analog Tape Delay FX',
        detail: 'Engage the live Dub Delay toggle for authentic coastal echo dynamics.',
      },
      {
        label: 'Project Timelines & Vault',
        detail: 'Save version checkpoints and submit finished tracks to the Port Waikato radio broadcast.',
      },
    ],
    actionLabel: 'Launch Beats Studio',
    quote: '"Rhythmic audio beats crafted for deep focus, stretches, and coastal sessions."',
  },
  {
    stepNumber: 3,
    title: 'Frostbite Buddy & D9 Solar Engine',
    subtitle: '26H Solar Clock, XA-Stretches & 90/9/1 Split',
    tabTarget: 'radio',
    badge: 'Step 3 of 3: Sovereignty',
    icon: Compass,
    highlightPoints: [
      {
        label: 'Frostbite AI Companion 🥶',
        detail: 'Get pre-surf XA-stretches, superfoods, surf jokes, and live Port Waikato weather telemetry.',
      },
      {
        label: 'Dragon 9 Temporal Clock',
        detail: 'Track time across a 1,440-minute solar cycle with two 18-minute Apex Wedges.',
      },
      {
        label: '90/9/1 Creator Economy',
        detail: '90% directly to creator, 9% campground community fund, 1% void split.',
      },
    ],
    actionLabel: 'Complete Tour (+15 Notes)',
    quote: '"You are now fully plugged into the Port Waikato Sovereign Node (AS65001)."',
  },
];

export const QuickStartOverlay: React.FC<QuickStartOverlayProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onEarnHarmony,
}) => {
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [hasCompletedBonus, setHasCompletedBonus] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentTour = TOUR_STEPS[currentStepIdx];
  const StepIcon = currentTour.icon;

  const handleNext = () => {
    if (currentStepIdx < TOUR_STEPS.length - 1) {
      setCurrentStepIdx((prev) => prev + 1);
    } else {
      handleFinishTour();
    }
  };

  const handlePrev = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx((prev) => prev - 1);
    }
  };

  const handleFinishTour = () => {
    if (!hasCompletedBonus && onEarnHarmony) {
      onEarnHarmony(15, 'Completed Quick-Start Creator Tour');
      setHasCompletedBonus(true);
    }
    localStorage.setItem('hasSeenPeeDubTour', 'true');
    onClose();
  };

  const handleJumpToTab = (tab: string) => {
    onNavigateTab(tab);
    handleFinishTour();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md font-mono p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-[#050505] border-2 border-[#00E5FF] text-[#e0e0e0] shadow-2xl shadow-[#00E5FF]/20 animate-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="p-4 bg-[#0a1520] border-b border-[#00E5FF]/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#00E5FF] text-black font-black flex items-center justify-center text-lg shrink-0">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black italic uppercase text-sm text-[#00E5FF]">
                  Quick-Start Studio Guide
                </h3>
                <span className="bg-[#00FF88] text-black text-[9px] font-bold uppercase px-2 py-0.5">
                  Port Waikato Node
                </span>
              </div>
              <p className="text-[10px] text-[#aaa] uppercase">
                3-Step Interactive Tour of Creative Studios & Tools
              </p>
            </div>
          </div>

          <button
            onClick={handleFinishTour}
            className="p-1.5 text-[#aaa] hover:text-white bg-[#111] border border-[#333] hover:border-[#666] transition-colors"
            title="Skip Tour"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tour Progress Indicators */}
        <div className="bg-[#111] border-b border-[#222] p-3 flex items-center justify-between px-6 text-xs">
          <div className="flex items-center gap-3">
            {TOUR_STEPS.map((s, idx) => (
              <div
                key={s.stepNumber}
                onClick={() => setCurrentStepIdx(idx)}
                className={`flex items-center gap-1.5 cursor-pointer transition-all ${
                  idx === currentStepIdx
                    ? 'text-[#00E5FF] font-black'
                    : idx < currentStepIdx
                    ? 'text-[#00FF88]'
                    : 'text-[#555]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold ${
                    idx === currentStepIdx
                      ? 'border-[#00E5FF] bg-[#00E5FF] text-black'
                      : idx < currentStepIdx
                      ? 'border-[#00FF88] bg-[#00FF88] text-black'
                      : 'border-[#444] bg-[#050505] text-[#777]'
                  }`}
                >
                  {idx < currentStepIdx ? '✓' : s.stepNumber}
                </div>
                <span className="hidden sm:inline text-[11px] uppercase">{s.title}</span>
              </div>
            ))}
          </div>

          <span className="text-[10px] text-[#888] uppercase font-bold">
            Step {currentStepIdx + 1} / 3
          </span>
        </div>

        {/* Step Body Content */}
        <div className="p-6 space-y-6">
          {/* Main Title & Icon */}
          <div className="flex items-start justify-between gap-4 border-b border-[#222] pb-4">
            <div className="space-y-1">
              <span className="bg-[#111] text-[#00FF88] border border-[#00FF88]/40 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                {currentTour.badge}
              </span>
              <h4 className="text-xl font-black italic uppercase text-[#e0e0e0] flex items-center gap-2 pt-1">
                <StepIcon className="w-6 h-6 text-[#00E5FF]" />
                <span>{currentTour.title}</span>
              </h4>
              <p className="text-xs text-[#aaa] font-sans">
                {currentTour.subtitle}
              </p>
            </div>

            <button
              onClick={() => handleJumpToTab(currentTour.tabTarget)}
              className="px-3 py-1.5 bg-[#F27D26] hover:bg-[#ff8a38] text-black font-black text-xs uppercase shrink-0 flex items-center gap-1 transition-all border border-[#F27D26]"
            >
              <span>{currentTour.actionLabel}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Highlight Cards */}
          <div className="space-y-3">
            <span className="text-[10px] text-[#888] uppercase font-bold tracking-wider">
              Key Capabilities & Features:
            </span>

            <div className="grid grid-cols-1 gap-2.5">
              {currentTour.highlightPoints.map((pt, i) => (
                <div
                  key={i}
                  className="bg-[#0f0f0f] border border-[#222] hover:border-[#333] p-3 text-xs flex items-start gap-3 transition-colors"
                >
                  <div className="w-5 h-5 rounded-full bg-[#111] border border-[#00E5FF]/50 text-[#00E5FF] flex items-center justify-center font-black text-[10px] shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div className="space-y-0.5">
                    <strong className="text-[#00E5FF] uppercase block font-bold">
                      {pt.label}
                    </strong>
                    <p className="text-[#aaa] font-sans text-xs">
                      {pt.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quote Banner */}
          <div className="bg-[#0a1520] border border-[#00E5FF]/30 p-3 text-center text-xs text-[#00E5FF] italic font-sans">
            {currentTour.quote}
          </div>
        </div>

        {/* Footer Navigation Buttons */}
        <div className="p-4 bg-[#111] border-t border-[#333] flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStepIdx === 0}
            className={`px-4 py-2 border text-xs font-bold uppercase flex items-center gap-1.5 transition-all ${
              currentStepIdx === 0
                ? 'opacity-40 border-[#222] text-[#555] cursor-not-allowed'
                : 'bg-[#222] hover:bg-[#333] border-[#444] text-[#e0e0e0]'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleFinishTour}
              className="px-3 py-2 text-[11px] text-[#888] hover:text-[#e0e0e0] uppercase font-bold underline"
            >
              Skip Tour
            </button>

            <button
              onClick={handleNext}
              className="px-5 py-2 bg-[#00E5FF] hover:bg-[#33efff] text-black font-black uppercase text-xs flex items-center gap-1.5 transition-all border border-[#00E5FF]"
            >
              <span>
                {currentStepIdx === TOUR_STEPS.length - 1 ? 'Finish & Claim 15 Notes' : 'Next Step'}
              </span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
