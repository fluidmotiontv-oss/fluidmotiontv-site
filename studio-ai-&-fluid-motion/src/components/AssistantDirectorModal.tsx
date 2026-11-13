import React, { useState } from 'react';
import { Lightbulb, BookOpen, Film, Tv, Sparkles, ArrowRight, CheckCircle2, ChevronRight, X } from 'lucide-react';

interface AssistantDirectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
  onEarnHarmony: (amount: number, description: string) => void;
}

export const AssistantDirectorModal: React.FC<AssistantDirectorModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onEarnHarmony,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const flowSteps = [
    {
      id: 'idea',
      title: 'Phase 1: Core Idea',
      icon: Lightbulb,
      description: 'Establish the core narrative, mood, and punchlines for your micro-movie.',
      tasks: [
        'Define the primary message or coastal humour angle.',
        'Determine the visual aesthetic (Cyber, Natural, Neon).',
        'Select the main figure models.'
      ],
      actionLabel: 'Go to Vector Art to Brainstorm',
      actionTab: 'vector'
    },
    {
      id: 'treatment',
      title: 'Phase 2: Treatment & Storyboard',
      icon: BookOpen,
      description: 'Flesh out the narrative beats using the Storyboard Prep tool.',
      tasks: [
        'Map out the 4-panel progression.',
        'Assign camera motions and sound cues to each beat.',
        'Write the dialogue and humour punchlines.'
      ],
      actionLabel: 'Prep in Storyboard',
      actionTab: 'comic'
    },
    {
      id: 'production',
      title: 'Phase 3: Production & Sync',
      icon: Film,
      description: 'Compile the frames, sync the audio, and bake the final micro-movie.',
      tasks: [
        'Import the storyboard frames into the Micro Movie Compiler.',
        'Adjust figure positioning and scale for visual hierarchy.',
        'Sync the frame durations and preview playback.'
      ],
      actionLabel: 'Compile in Micro Movies',
      actionTab: 'movie'
    },
    {
      id: 'delivery',
      title: 'Phase 4: Delivery & Premiere',
      icon: Tv,
      description: 'Stage your final cut for broadcast during the Apex Wedge or save to Vault.',
      tasks: [
        'Export the compiled video.',
        'Queue it for the next 18-minute Apex Wedge.',
        'Share with the Node Jam feed.'
      ],
      actionLabel: 'Go to Radio & Vault',
      actionTab: 'radio'
    }
  ];

  const handleActionClick = (tab: string, stepTitle: string) => {
    onEarnHarmony(10, `Followed Assistant Director: ${stepTitle}`);
    onNavigateTab(tab);
    onClose();
  };

  const nextStep = () => {
    if (currentStep < flowSteps.length - 1) {
      setCurrentStep(curr => curr + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(curr => curr - 1);
    }
  };

  const StepIcon = flowSteps[currentStep].icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-[#050505] border-2 border-[#00E5FF] shadow-[0_0_40px_rgba(0,229,255,0.15)] flex flex-col font-mono text-[#e0e0e0] relative animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#222] bg-[#111]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#00E5FF] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <div>
              <h2 className="text-sm font-black italic uppercase text-[#00E5FF] tracking-wider leading-none">
                Assistant Director Guide
              </h2>
              <p className="text-[10px] text-[#888] uppercase mt-1">
                Step-by-step production flow
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#666] hover:text-[#00E5FF] transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col md:flex-row border-b border-[#222]">
          {/* Left: Progress Sidebar */}
          <div className="w-full md:w-1/3 bg-[#0a0a0a] border-r border-[#222] p-4 flex flex-col gap-3">
            {flowSteps.map((step, idx) => {
              const isActive = idx === currentStep;
              const isPast = idx < currentStep;
              const Icon = step.icon;
              return (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(idx)}
                  className={`flex items-start gap-3 p-3 text-left transition-all border ${
                    isActive
                      ? 'bg-[#00E5FF]/10 border-[#00E5FF] text-[#00E5FF]'
                      : isPast
                      ? 'bg-[#111] border-[#333] text-[#888] hover:border-[#00E5FF]/50'
                      : 'bg-transparent border-transparent text-[#555] hover:text-[#888]'
                  }`}
                >
                  <div className={`mt-0.5 shrink-0 ${isActive ? 'text-[#00E5FF]' : isPast ? 'text-[#00FF88]' : 'text-[#444]'}`}>
                    {isPast ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase leading-tight">
                      {step.title}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Step Details */}
          <div className="w-full md:w-2/3 p-6 bg-[#050505] min-h-[300px] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <StepIcon className="w-6 h-6 text-[#00E5FF]" />
                <h3 className="text-lg font-black uppercase text-[#e0e0e0]">
                  {flowSteps[currentStep].title}
                </h3>
              </div>
              <p className="text-xs text-[#aaa] font-sans mb-6 leading-relaxed">
                {flowSteps[currentStep].description}
              </p>
              
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#666]">
                  Production Checklist:
                </h4>
                <ul className="space-y-2">
                  {flowSteps[currentStep].tasks.map((task, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-[#e0e0e0] font-sans">
                      <ChevronRight className="w-4 h-4 text-[#F27D26] shrink-0 mt-0.5" />
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-[#222] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex gap-2">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="px-3 py-1.5 border border-[#333] text-[#888] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#111] hover:text-[#e0e0e0] text-xs font-bold uppercase transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={nextStep}
                  disabled={currentStep === flowSteps.length - 1}
                  className="px-3 py-1.5 border border-[#333] text-[#888] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#111] hover:text-[#e0e0e0] text-xs font-bold uppercase transition-colors"
                >
                  Next
                </button>
              </div>

              <button
                onClick={() => handleActionClick(flowSteps[currentStep].actionTab, flowSteps[currentStep].title)}
                className="px-4 py-2 bg-[#00E5FF] hover:bg-[#33ebff] text-black font-black uppercase text-xs flex items-center gap-2 transition-transform active:scale-95"
              >
                <span>{flowSteps[currentStep].actionLabel}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
