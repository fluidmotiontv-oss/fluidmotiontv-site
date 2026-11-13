import React, { useState } from 'react';
import { DailyMission } from '../types';
import { Target, CheckCircle2, Award, Plus, Sparkles, ChevronRight, Zap, RefreshCw, ListTodo, FileText } from 'lucide-react';
import { MissionLog } from './MissionLog';

interface DailyMissionsWidgetProps {
  onEarnHarmony: (amount: number, description: string) => void;
  onNavigateTab?: (tab: string) => void;
}

const INITIAL_MISSIONS: DailyMission[] = [
  {
    id: 'm1',
    title: 'Upload 3 Vector Art Pieces',
    description: 'Extract 1:1 or 9:16 coastal vector stickers or overlays for the Pee Dub gallery.',
    category: 'Vector',
    rewardHarmony: 250,
    rewardShavings: 25,
    currentProgress: 1,
    targetProgress: 3,
    completed: false,
    claimed: false,
  },
  {
    id: 'm2',
    title: 'Compose 1 Dub Track',
    description: 'Lay down a 75–85 BPM Reggae/Dub beat with swing & tape delay.',
    category: 'Beat',
    rewardHarmony: 300,
    rewardShavings: 30,
    currentProgress: 0,
    targetProgress: 1,
    completed: false,
    claimed: false,
  },
  {
    id: 'm3',
    title: 'Stage 1 Comic for Apex Premiere',
    description: 'Draft a 4-panel comic strip with Jewel Slot crew tags and stage it for the 18-minute Apex Wedge.',
    category: 'Comic',
    rewardHarmony: 200,
    rewardShavings: 20,
    currentProgress: 0,
    targetProgress: 1,
    completed: false,
    claimed: false,
  },
  {
    id: 'm4',
    title: 'Broadcast Track on Port Waikato Radio',
    description: 'Submit an original beat or studio mix to the live radio triage buffer.',
    category: 'Radio',
    rewardHarmony: 180,
    rewardShavings: 18,
    currentProgress: 1,
    targetProgress: 1,
    completed: true,
    claimed: false,
  },
];

export const DailyMissionsWidget: React.FC<DailyMissionsWidgetProps> = ({
  onEarnHarmony,
  onNavigateTab,
}) => {
  const [missions, setMissions] = useState<DailyMission[]>(INITIAL_MISSIONS);
  const [showLogView, setShowLogView] = useState<boolean>(false);

  const handleIncrementProgress = (missionId: string) => {
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id !== missionId || m.claimed) return m;

        const nextProg = Math.min(m.targetProgress, m.currentProgress + 1);
        const isDone = nextProg >= m.targetProgress;

        return {
          ...m,
          currentProgress: nextProg,
          completed: isDone,
        };
      })
    );
  };

  const handleClaimReward = (mission: DailyMission) => {
    if (!mission.completed || mission.claimed) return;

    setMissions((prev) =>
      prev.map((m) => (m.id === mission.id ? { ...m, claimed: true } : m))
    );

    onEarnHarmony(
      mission.rewardHarmony,
      `Completed Mission: ${mission.title}`
    );
  };

  const completedCount = missions.filter((m) => m.claimed).length;
  const totalMissions = missions.length;
  const overallProgressPct = Math.round((completedCount / totalMissions) * 100);

  return (
    <div className="bg-[#111] border-l-4 border-[#F27D26] border-y border-r border-[#333] p-5 space-y-5 text-[#e0e0e0] font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#333] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-[#F27D26]" />
            <h3 className="text-base font-black italic uppercase tracking-wider text-[#e0e0e0]">
              Daily Creative Missions
            </h3>
            <span className="bg-[#050505] text-[#00E5FF] border border-[#333] px-2 py-0.5 text-[10px] font-bold uppercase">
              24H Cycle
            </span>
          </div>
          <p className="text-xs opacity-60 uppercase mt-1">
            Complete daily tasks to fuel the 90/9/1 Sovereign Economy & earn Harmony Notes.
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setShowLogView(!showLogView)}
            className={`px-3 py-2 text-xs font-black uppercase flex items-center gap-1.5 transition-all border ${
              showLogView
                ? 'bg-[#00E5FF] text-black border-[#00E5FF]'
                : 'bg-[#050505] hover:bg-[#222] text-[#00E5FF] border-[#00E5FF]/50 hover:border-[#00E5FF]'
            }`}
          >
            <ListTodo className="w-4 h-4" />
            <span>{showLogView ? 'Hide Step Tracker' : 'View Mission Log'}</span>
          </button>

          <div className="flex items-center gap-3 bg-[#050505] border border-[#333] px-4 py-2">
            <Award className="w-5 h-5 text-[#FFD700]" />
            <div>
              <div className="text-[10px] text-[#888] uppercase font-bold">
                Daily Claimed
              </div>
              <div className="text-sm font-black text-[#00FF88]">
                {completedCount} / {totalMissions} ({overallProgressPct}%)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Mission Log Component when toggled */}
      {showLogView ? (
        <MissionLog
          missions={missions}
          onIncrementMissionProgress={handleIncrementProgress}
          onClaimReward={handleClaimReward}
          onNavigateTab={onNavigateTab}
        />
      ) : (
        <>
          {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[10px] uppercase text-[#888]">
          <span>Solar Cycle Progress</span>
          <span className="text-[#00FF88] font-bold">{overallProgressPct}% Complete</span>
        </div>
        <div className="w-full bg-[#050505] h-2.5 border border-[#333] overflow-hidden p-0.5">
          <div
            className="bg-[#00FF88] h-full transition-all duration-500"
            style={{ width: `${overallProgressPct}%` }}
          />
        </div>
      </div>

      {/* Mission Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {missions.map((m) => {
          const progressPct = Math.min(
            100,
            Math.round((m.currentProgress / m.targetProgress) * 100)
          );

          const getCategoryTab = (cat: string) => {
            switch (cat) {
              case 'Vector':
                return 'vector';
              case 'Beat':
                return 'music';
              case 'Comic':
                return 'comic';
              case 'Radio':
                return 'radio';
              default:
                return 'vector';
            }
          };

          return (
            <div
              key={m.id}
              className={`p-4 border transition-all flex flex-col justify-between space-y-3 ${
                m.claimed
                  ? 'bg-[#050505] border-[#00FF88] opacity-80'
                  : m.completed
                  ? 'bg-[#050505] border-[#FFD700]'
                  : 'bg-[#050505] border-[#333] hover:border-[#F27D26]'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="bg-[#111] text-[#00E5FF] px-2 py-0.5 border border-[#333] font-bold uppercase">
                    {m.category} Mission
                  </span>
                  <span className="text-[#FFD700] font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#FFD700]" />
                    +{m.rewardHarmony} Harmony (+{m.rewardShavings} Shavings)
                  </span>
                </div>

                <h4 className="font-bold text-sm text-[#e0e0e0] uppercase">
                  {m.title}
                </h4>
                <p className="text-xs text-[#aaa] font-sans">
                  {m.description}
                </p>
              </div>

              {/* Individual Progress & Controls */}
              <div className="space-y-2 pt-2 border-t border-[#222]">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-[#888] uppercase">
                    Progress: {m.currentProgress} / {m.targetProgress}
                  </span>
                  <span className="font-bold text-[#e0e0e0]">
                    {progressPct}%
                  </span>
                </div>

                <div className="w-full bg-[#111] h-1.5 border border-[#333] overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      m.completed ? 'bg-[#00FF88]' : 'bg-[#F27D26]'
                    }`}
                    style={{ width: `${progressPct}%` }}
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  {/* Action or Progress Button */}
                  {m.claimed ? (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#00FF88]">
                      <CheckCircle2 className="w-4 h-4 text-[#00FF88]" />
                      <span>CLAIMED (+{m.rewardHarmony} HARMONY)</span>
                    </div>
                  ) : m.completed ? (
                    <button
                      onClick={() => handleClaimReward(m)}
                      className="w-full py-2 bg-[#FFD700] hover:bg-[#ffe234] text-black font-black uppercase text-xs transition-all shadow-md flex items-center justify-center gap-1.5 border border-[#FFD700]"
                    >
                      <Zap className="w-4 h-4 text-black fill-black" />
                      <span>CLAIM {m.rewardHarmony} HARMONY REWARD</span>
                    </button>
                  ) : (
                    <div className="flex items-center justify-between w-full gap-2">
                      <button
                        onClick={() => handleIncrementProgress(m.id)}
                        className="px-3 py-1.5 bg-[#222] hover:bg-[#333] text-[#e0e0e0] text-xs font-bold uppercase border border-[#444] flex items-center gap-1 transition-colors"
                        title="Simulate task progress step"
                      >
                        <Plus className="w-3.5 h-3.5 text-[#F27D26]" />
                        <span>Log Progress</span>
                      </button>

                      {onNavigateTab && (
                        <button
                          onClick={() => onNavigateTab(getCategoryTab(m.category))}
                          className="px-3 py-1.5 bg-[#F27D26] hover:bg-[#ff8a38] text-black text-xs font-black uppercase flex items-center gap-1 transition-colors"
                        >
                          <span>Open Studio</span>
                          <ChevronRight className="w-3.5 h-3.5 text-black" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
        </>
      )}
    </div>
  );
};
