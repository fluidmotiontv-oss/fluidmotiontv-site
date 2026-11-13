import React, { useState } from 'react';
import { DailyMission } from '../types';
import {
  FileText,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  ChevronRight,
  Zap,
  Filter,
  Plus,
  ArrowRight,
  ListTodo,
  ShieldCheck,
  Tag
} from 'lucide-react';

export interface MissionStep {
  id: string;
  missionId: string;
  stepNumber: number;
  title: string;
  description: string;
  completed: boolean;
  completedAt?: string;
  studioTab: string;
  actionHint: string;
}

export interface ActivityLogEntry {
  id: string;
  timestamp: string;
  missionId: string;
  missionTitle: string;
  stepTitle: string;
  details: string;
  category: string;
}

interface MissionLogProps {
  missions: DailyMission[];
  onIncrementMissionProgress: (missionId: string) => void;
  onClaimReward: (mission: DailyMission) => void;
  onNavigateTab?: (tab: string) => void;
  isOpenAsModal?: boolean;
  onCloseModal?: () => void;
}

// Pre-configured step-by-step milestones for each daily mission
const DEFAULT_STEPS: Record<string, MissionStep[]> = {
  m1: [
    {
      id: 'm1-s1',
      missionId: 'm1',
      stepNumber: 1,
      title: 'Extract First Coastal Vector Sticker',
      description: 'Upload or generate a coastal photo and extract a 1:1 vector graphic in Vector Art Studio.',
      completed: true,
      completedAt: '09:14 AM',
      studioTab: 'vector',
      actionHint: 'Go to Vector Art Studio & click Vectorize',
    },
    {
      id: 'm1-s2',
      missionId: 'm1',
      stepNumber: 2,
      title: 'Apply Pee Dub Sunset Color Palette',
      description: 'Customize the vector color palette with high-contrast ocean & orange hues.',
      completed: false,
      studioTab: 'vector',
      actionHint: 'Select Preset Palette in Studio',
    },
    {
      id: 'm1-s3',
      missionId: 'm1',
      stepNumber: 3,
      title: 'Share Vector Artwork to Node Stream',
      description: 'Export SVG or share the finished sticker directly to the Port Waikato Node Stream.',
      completed: false,
      studioTab: 'vector',
      actionHint: 'Click "Share to Node Stream"',
    },
  ],
  m2: [
    {
      id: 'm2-s1',
      missionId: 'm2',
      stepNumber: 1,
      title: 'Load Reggae/Dub Beat Preset',
      description: 'Set tempo to 75–85 BPM in Sovereign Beats studio and configure 16-step grid.',
      completed: false,
      studioTab: 'music',
      actionHint: 'Open Sovereign Beats & select Dub Preset',
    },
    {
      id: 'm2-s2',
      missionId: 'm2',
      stepNumber: 2,
      title: 'Engage Tape Delay & Dub FX',
      description: 'Toggle the Dub Delay effect switch for authentic coastal echo dynamics.',
      completed: false,
      studioTab: 'music',
      actionHint: 'Toggle Dub Delay FX on',
    },
    {
      id: 'm2-s3',
      missionId: 'm2',
      stepNumber: 3,
      title: 'Save Track Version Checkpoint',
      description: 'Save snapshot version of your dub track in the project version timeline.',
      completed: false,
      studioTab: 'music',
      actionHint: 'Click "Save Version" in Studio Timeline',
    },
  ],
  m3: [
    {
      id: 'm3-s1',
      missionId: 'm3',
      stepNumber: 1,
      title: 'Draft 4-Panel Surf Story Arc',
      description: 'Generate or edit dialogue for a 4-panel Port Waikato surf adventure comic.',
      completed: false,
      studioTab: 'comic',
      actionHint: 'Open Comic Builder & Generate Storyboard',
    },
    {
      id: 'm3-s2',
      missionId: 'm3',
      stepNumber: 2,
      title: 'Tag Crew Members in Jewel Slots',
      description: 'Attach @PeeDub_Crew handles to panels to complete sovereign co-authorship.',
      completed: false,
      studioTab: 'comic',
      actionHint: 'Assign handles in Panel Settings',
    },
    {
      id: 'm3-s3',
      missionId: 'm3',
      stepNumber: 3,
      title: 'Stage Strip for Apex Wedge Premiere',
      description: 'Queue comic for the 18-minute Apex Wedge solar transition window.',
      completed: false,
      studioTab: 'comic',
      actionHint: 'Click "Stage for Apex Wedge Premiere"',
    },
  ],
  m4: [
    {
      id: 'm4-s1',
      missionId: 'm4',
      stepNumber: 1,
      title: 'Select Studio Beat for Radio Broadcast',
      description: 'Choose your recorded beat or mix from the Sovereign Beats library.',
      completed: true,
      completedAt: '08:28 AM',
      studioTab: 'radio',
      actionHint: 'Open Radio Vault',
    },
    {
      id: 'm4-s2',
      missionId: 'm4',
      stepNumber: 2,
      title: 'Submit to AS65001 Triage Buffer',
      description: 'Submit track to the live Port Waikato AS65001 Mesh Radio queue.',
      completed: true,
      completedAt: '08:30 AM',
      studioTab: 'radio',
      actionHint: 'Click "Submit Track to Radio Queue"',
    },
  ],
};

export const MissionLog: React.FC<MissionLogProps> = ({
  missions,
  onIncrementMissionProgress,
  onClaimReward,
  onNavigateTab,
  isOpenAsModal,
  onCloseModal,
}) => {
  const [stepsMap, setStepsMap] = useState<Record<string, MissionStep[]>>(DEFAULT_STEPS);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [selectedMissionId, setSelectedMissionId] = useState<string>('m1');
  const [customNote, setCustomNote] = useState<string>('');

  const [activityLogs, setActivityLogs] = useState<ActivityLogEntry[]>([
    {
      id: 'log-1',
      timestamp: '09:14 AM',
      missionId: 'm1',
      missionTitle: 'Upload 3 Vector Art Pieces',
      stepTitle: 'Extract First Coastal Vector Sticker',
      details: 'Extracted "Pee Dub Point Barrel" 1:1 SVG sticker',
      category: 'Vector',
    },
    {
      id: 'log-2',
      timestamp: '08:30 AM',
      missionId: 'm4',
      missionTitle: 'Broadcast Track on Port Waikato Radio',
      stepTitle: 'Submit to AS65001 Triage Buffer',
      details: 'Broadcasted "Point Break Dub" to AS65001 Mesh Radio queue',
      category: 'Radio',
    },
  ]);

  const handleToggleStep = (missionId: string, stepId: string) => {
    setStepsMap((prev) => {
      const currentSteps = prev[missionId] || [];
      const updated = currentSteps.map((s) => {
        if (s.id === stepId) {
          const nextVal = !s.completed;
          if (nextVal) {
            // Add activity log entry
            const newLog: ActivityLogEntry = {
              id: `log-${Date.now()}`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              missionId,
              missionTitle: missions.find((m) => m.id === missionId)?.title || 'Daily Mission',
              stepTitle: s.title,
              details: `Completed step: ${s.description}`,
              category: missions.find((m) => m.id === missionId)?.category || 'General',
            };
            setActivityLogs((logs) => [newLog, ...logs]);
            // Increment mission progress
            onIncrementMissionProgress(missionId);
          }
          return {
            ...s,
            completed: nextVal,
            completedAt: nextVal ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
          };
        }
        return s;
      });

      return { ...prev, [missionId]: updated };
    });
  };

  const handleAddCustomLog = () => {
    if (!customNote.trim()) return;
    const activeMission = missions.find((m) => m.id === selectedMissionId) || missions[0];

    const newLog: ActivityLogEntry = {
      id: `custom-log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      missionId: activeMission.id,
      missionTitle: activeMission.title,
      stepTitle: 'Manual Activity Log',
      details: customNote.trim(),
      category: activeMission.category,
    };

    setActivityLogs((prev) => [newLog, ...prev]);
    setCustomNote('');
  };

  const filteredMissions = missions.filter((m) => {
    if (activeCategory === 'ALL') return true;
    return m.category.toUpperCase() === activeCategory;
  });

  const activeMission = missions.find((m) => m.id === selectedMissionId) || missions[0];
  const activeSteps = stepsMap[activeMission.id] || [];

  const allSteps: MissionStep[] = (Object.values(stepsMap) as MissionStep[][]).reduce(
    (acc, steps) => acc.concat(steps),
    [] as MissionStep[]
  );
  const totalSteps = allSteps.length;
  const completedSteps = allSteps.filter((s) => s.completed).length;
  const stepCompletionPct = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  const content = (
    <div className="bg-[#111] border border-[#333] p-5 space-y-6 text-[#e0e0e0] font-mono shadow-xl">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#333] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <ListTodo className="w-5 h-5 text-[#00E5FF]" />
            <h3 className="text-lg font-black italic uppercase tracking-tight text-[#e0e0e0]">
              Mission Log & Step Tracker
            </h3>
            <span className="bg-[#050505] text-[#00FF88] border border-[#00FF88]/40 px-2 py-0.5 text-[10px] font-bold uppercase">
              AS65001 Live Telemetry
            </span>
          </div>
          <p className="text-xs text-[#888] uppercase tracking-wider mt-1">
            Detailed step-by-step milestones, progress verification & real-time activity logs.
          </p>
        </div>

        {isOpenAsModal && onCloseModal && (
          <button
            onClick={onCloseModal}
            className="px-3 py-1 bg-[#222] hover:bg-[#333] text-[#aaa] hover:text-white border border-[#444] text-xs font-bold uppercase transition-colors"
          >
            Close Log [ESC]
          </button>
        )}
      </div>

      {/* Overview Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#050505] border border-[#222] p-3">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-[#00FF88]" />
          <div>
            <div className="text-[10px] text-[#777] uppercase font-bold">Steps Fulfill Rate</div>
            <div className="text-sm font-black text-[#00FF88]">
              {completedSteps} / {totalSteps} ({stepCompletionPct}%)
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 border-t sm:border-t-0 sm:border-l border-[#222] pt-2 sm:pt-0 sm:pl-3">
          <Zap className="w-5 h-5 text-[#F27D26]" />
          <div>
            <div className="text-[10px] text-[#777] uppercase font-bold">Daily Rewards Target</div>
            <div className="text-sm font-black text-[#F27D26]">
              {missions.reduce((acc, m) => acc + m.rewardHarmony, 0)} Harmony Notes
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 border-t sm:border-t-0 sm:border-l border-[#222] pt-2 sm:pt-0 sm:pl-3">
          <Clock className="w-5 h-5 text-[#00E5FF]" />
          <div>
            <div className="text-[10px] text-[#777] uppercase font-bold">Solar Cycle Reset</div>
            <div className="text-sm font-black text-[#00E5FF]">26H D9 Engine Active</div>
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs uppercase font-bold border-b border-[#222]">
        <span className="text-[#666] flex items-center gap-1 shrink-0 text-[10px]">
          <Filter className="w-3 h-3 text-[#666]" /> Filter:
        </span>
        {['ALL', 'VECTOR', 'BEAT', 'COMIC', 'RADIO'].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1 border transition-all shrink-0 ${
              activeCategory === cat
                ? 'bg-[#F27D26] text-black border-[#F27D26] font-black'
                : 'bg-[#050505] text-[#aaa] border-[#333] hover:border-[#666]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Mission Selector List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold uppercase text-[#888] flex justify-between items-center">
            <span>Select Daily Mission ({filteredMissions.length})</span>
            <span className="text-[10px] text-[#00E5FF]">Click to expand steps</span>
          </div>

          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
            {filteredMissions.map((m) => {
              const isSelected = m.id === selectedMissionId;
              const steps = stepsMap[m.id] || [];
              const stepsDone = steps.filter((s) => s.completed).length;

              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedMissionId(m.id)}
                  className={`p-3 border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#1a1a1a] border-[#00E5FF] shadow-md shadow-[#00E5FF]/10'
                      : m.claimed
                      ? 'bg-[#050505] border-[#00FF88] opacity-80'
                      : 'bg-[#050505] border-[#222] hover:border-[#444]'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="bg-[#111] text-[#00E5FF] px-2 py-0.5 border border-[#333] font-bold uppercase">
                        {m.category}
                      </span>
                      <span className="text-[#FFD700] font-bold">+{m.rewardHarmony} Notes</span>
                    </div>

                    <h4 className="font-bold text-xs text-[#e0e0e0] uppercase truncate">
                      {m.title}
                    </h4>

                    {/* Step Sub-Progress */}
                    <div className="flex justify-between items-center text-[10px] text-[#888] pt-1">
                      <span>
                        Steps: <strong className="text-[#00FF88]">{stepsDone}</strong> / {steps.length}
                      </span>
                      {m.claimed ? (
                        <span className="text-[#00FF88] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-[#00FF88]" /> Claimed
                        </span>
                      ) : m.completed ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onClaimReward(m);
                          }}
                          className="px-2 py-0.5 bg-[#FFD700] text-black font-black uppercase text-[9px]"
                        >
                          Claim Reward
                        </button>
                      ) : (
                        <span className="text-[#F27D26] italic font-bold">
                          In Progress
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Mission Detailed Step-by-Step Milestones */}
        <div className="lg:col-span-7 bg-[#050505] border border-[#333] p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-[#222] pb-3">
            <div>
              <span className="text-[10px] text-[#00E5FF] uppercase font-bold tracking-wider">
                Active Step-by-Step Workflow
              </span>
              <h4 className="font-black text-sm text-[#e0e0e0] uppercase flex items-center gap-2">
                <span>{activeMission.title}</span>
                {activeMission.completed && (
                  <span className="bg-[#00FF88]/20 text-[#00FF88] border border-[#00FF88]/40 text-[9px] px-1.5 py-0.2 font-bold uppercase">
                    Done
                  </span>
                )}
              </h4>
            </div>

            {onNavigateTab && (
              <button
                onClick={() => {
                  const firstStepTab = activeSteps[0]?.studioTab || 'vector';
                  onNavigateTab(firstStepTab);
                }}
                className="px-3 py-1.5 bg-[#F27D26] hover:bg-[#ff8a38] text-black font-black text-xs uppercase flex items-center gap-1 transition-colors border border-[#F27D26]"
              >
                <span>Launch Studio</span>
                <ChevronRight className="w-3.5 h-3.5 text-black" />
              </button>
            )}
          </div>

          <p className="text-xs text-[#aaa] font-sans">
            {activeMission.description}
          </p>

          {/* Interactive Step Timeline List */}
          <div className="space-y-3 pt-1">
            {activeSteps.map((step) => (
              <div
                key={step.id}
                className={`p-3 border transition-all flex items-start gap-3 ${
                  step.completed
                    ? 'bg-[#0f1d14] border-[#00FF88]/40 text-[#e0e0e0]'
                    : 'bg-[#111] border-[#222] hover:border-[#444]'
                }`}
              >
                <button
                  onClick={() => handleToggleStep(activeMission.id, step.id)}
                  className="mt-0.5 shrink-0 transition-transform active:scale-95"
                  title={step.completed ? 'Mark step incomplete' : 'Mark step completed'}
                >
                  {step.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-[#00FF88] fill-[#00FF88]/20" />
                  ) : (
                    <Circle className="w-5 h-5 text-[#555] hover:text-[#F27D26]" />
                  )}
                </button>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs uppercase text-[#e0e0e0]">
                      Step {step.stepNumber}: {step.title}
                    </span>
                    {step.completed && step.completedAt && (
                      <span className="text-[10px] text-[#00FF88] font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {step.completedAt}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#888] font-sans">
                    {step.description}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[10px]">
                    <span className="text-[#00E5FF] italic">
                      Action: {step.actionHint}
                    </span>

                    {onNavigateTab && (
                      <button
                        onClick={() => onNavigateTab(step.studioTab)}
                        className="text-[#F27D26] hover:underline font-bold uppercase flex items-center gap-0.5"
                      >
                        Go to {step.studioTab.toUpperCase()} <ArrowRight className="w-2.5 h-2.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Manual Step Log Trigger */}
          <div className="border-t border-[#222] pt-3 flex items-center gap-2">
            <button
              onClick={() => onIncrementMissionProgress(activeMission.id)}
              className="w-full py-2 bg-[#222] hover:bg-[#333] text-[#00FF88] border border-[#444] hover:border-[#00FF88] font-black text-xs uppercase flex items-center justify-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4 text-[#00FF88]" />
              <span>Log Step Fulfill Event (+1 Progress)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Activity Log Feed & Manual Note Logger */}
      <div className="border-t border-[#333] pt-4 space-y-3 font-mono">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <h4 className="font-black text-xs uppercase text-[#e0e0e0] flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-[#F27D26]" />
            <span>Mission Telemetry & Activity Feed ({activityLogs.length} Entries)</span>
          </h4>
          <span className="text-[10px] text-[#777] uppercase">Real-time Node Audit Trail</span>
        </div>

        {/* Add Custom Note Input */}
        <div className="flex items-center gap-2 bg-[#050505] border border-[#333] p-2">
          <input
            type="text"
            value={customNote}
            onChange={(e) => setCustomNote(e.target.value)}
            placeholder="Record custom creative note (e.g. Exported 2 sticker variations...)"
            className="flex-1 bg-transparent px-3 py-1 text-xs text-[#e0e0e0] placeholder-[#555] focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddCustomLog();
            }}
          />
          <button
            onClick={handleAddCustomLog}
            className="px-3 py-1.5 bg-[#F27D26] hover:bg-[#ff8a38] text-black font-black uppercase text-xs transition-colors shrink-0 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Log Entry</span>
          </button>
        </div>

        {/* Log Entries Scroll Feed */}
        <div className="bg-[#050505] border border-[#222] p-3 max-h-36 overflow-y-auto space-y-2 custom-scrollbar text-xs">
          {activityLogs.map((log) => (
            <div
              key={log.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-[#111] pb-1.5 text-[11px]"
            >
              <div className="flex items-center gap-2">
                <span className="bg-[#111] text-[#00E5FF] px-1.5 py-0.2 border border-[#333] text-[9px] font-bold uppercase">
                  {log.category}
                </span>
                <span className="font-bold text-[#e0e0e0] uppercase">{log.stepTitle}:</span>
                <span className="text-[#aaa] font-sans">{log.details}</span>
              </div>
              <span className="text-[10px] text-[#666] shrink-0 font-mono">{log.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (isOpenAsModal) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="max-w-4xl w-full my-8">
          {content}
        </div>
      </div>
    );
  }

  return content;
};
