import React from 'react';
import { User, Award, ShieldCheck, X, Sparkles, Coins, Palette, Music, BookOpen, Radio, ArrowUpRight, ArrowDownRight, TrendingUp, Compass, Heart } from 'lucide-react';

export interface UserProfileData {
  artistName: string;
  artistTag: string;
  artistRank: string;
  rankBadgeColor: string;
  location: string;
  totalCreations: {
    vectors: number;
    beats: number;
    comics: number;
    radioSubmissions: number;
  };
  harmonyStats: {
    totalEarned: number;
    totalSpent: number;
    currentBalance: number;
    creatorSplit90: number;
    communitySplit9: number;
    voidSplit1: number;
  };
  recentActivities: {
    id: string;
    action: string;
    type: 'EARNED' | 'SPENT';
    amount: number;
    time: string;
  }[];
}

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  harmonyNotes: number;
  shavings: number;
  userProfile?: Partial<UserProfileData>;
  onNavigateToEconomy?: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  harmonyNotes,
  shavings,
  userProfile,
  onNavigateToEconomy,
}) => {
  if (!isOpen) return null;

  const profile: UserProfileData = {
    artistName: userProfile?.artistName || 'Kai Coastline',
    artistTag: userProfile?.artistTag || '@peedub_rider',
    artistRank: userProfile?.artistRank || 'Apex Wave Master (Tier 4)',
    rankBadgeColor: userProfile?.rankBadgeColor || '#F27D26',
    location: userProfile?.location || 'Port Waikato Node (AS65001 Mesh)',
    totalCreations: {
      vectors: userProfile?.totalCreations?.vectors ?? 6,
      beats: userProfile?.totalCreations?.beats ?? 4,
      comics: userProfile?.totalCreations?.comics ?? 3,
      radioSubmissions: userProfile?.totalCreations?.radioSubmissions ?? 2,
    },
    harmonyStats: {
      totalEarned: userProfile?.harmonyStats?.totalEarned ?? (harmonyNotes + 850),
      totalSpent: userProfile?.harmonyStats?.totalSpent ?? 850,
      currentBalance: harmonyNotes,
      creatorSplit90: Math.round((harmonyNotes + 850) * 0.9),
      communitySplit9: Math.round((harmonyNotes + 850) * 0.09),
      voidSplit1: Math.round((harmonyNotes + 850) * 0.01),
    },
    recentActivities: userProfile?.recentActivities || [
      { id: '1', action: 'Completed Daily Mission: Broadcast Track', type: 'EARNED', amount: 180, time: '10m ago' },
      { id: '2', action: 'Shared Vector Artwork to Node Stream', type: 'EARNED', amount: 50, time: '30m ago' },
      { id: '3', action: 'Supported Registered Album: Sunset Point Breakers', type: 'SPENT', amount: 120, time: '2h ago' },
      { id: '4', action: 'Staged 4-Panel Comic for Apex Premiere', type: 'EARNED', amount: 150, time: '5h ago' },
      { id: '5', action: 'Submitted Dub Beat to Port Waikato Radio Queue', type: 'EARNED', amount: 100, time: '1d ago' },
    ],
  };

  const totalCreationsCount =
    profile.totalCreations.vectors +
    profile.totalCreations.beats +
    profile.totalCreations.comics +
    profile.totalCreations.radioSubmissions;

  const totalEarned = profile.harmonyStats.totalEarned;
  const totalSpent = profile.harmonyStats.totalSpent;
  const grandTotal = totalEarned + totalSpent;
  const earnedPct = grandTotal > 0 ? Math.round((totalEarned / grandTotal) * 100) : 100;
  const spentPct = 100 - earnedPct;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-mono animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#050505] border-2 border-[#F27D26] text-[#e0e0e0] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-4 bg-[#111] border-b border-[#333] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border-2 border-[#F27D26] bg-[#050505] flex items-center justify-center text-[#F27D26]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black italic uppercase tracking-wider text-[#e0e0e0] text-base flex items-center gap-2">
                Artist Profile Ledger
                <span className="text-[10px] bg-[#050505] text-[#00E5FF] border border-[#333] px-2 py-0.5 uppercase">
                  Pee Dub
                </span>
              </h3>
              <p className="text-[11px] text-[#888] uppercase">{profile.location}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#aaa] hover:text-[#e0e0e0] hover:bg-[#222] transition-colors border border-transparent hover:border-[#444]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Scroll Area */}
        <div className="p-5 space-y-6 overflow-y-auto custom-scrollbar">
          {/* User Hero Identity Card */}
          <div className="bg-[#111] border border-[#333] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 border-2 border-[#FFD700] bg-[#050505] flex items-center justify-center text-xl font-black italic text-[#FFD700] shrink-0">
                KC
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-black text-lg text-[#e0e0e0] uppercase">
                    {profile.artistName}
                  </h4>
                  <span className="text-xs text-[#888]">{profile.artistTag}</span>
                </div>

                {/* Artist Rank Badge */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 mt-1 bg-[#050505] border border-[#FFD700] text-[#FFD700] text-xs font-black uppercase tracking-wider">
                  <Award className="w-3.5 h-3.5 text-[#FFD700]" />
                  <span>Artist Rank: {profile.artistRank}</span>
                </div>
              </div>
            </div>

            {/* Quick Balances */}
            <div className="flex items-center gap-3 bg-[#050505] border border-[#333] px-3.5 py-2">
              <div className="text-right">
                <div className="text-[10px] text-[#888] uppercase font-bold">Current Balance</div>
                <div className="text-sm font-black text-[#FFD700] flex items-center gap-1">
                  <Coins className="w-4 h-4 text-[#FFD700]" />
                  <span>{harmonyNotes.toLocaleString()} Harmony</span>
                </div>
              </div>
              <div className="h-6 w-px bg-[#333]" />
              <div className="text-right">
                <div className="text-[10px] text-[#888] uppercase font-bold">Shavings</div>
                <div className="text-sm font-black text-[#00FF88]">{shavings}</div>
              </div>
            </div>
          </div>

          {/* Section 1: Total Creations Breakdown */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#333] pb-2">
              <h4 className="font-black italic text-sm text-[#e0e0e0] uppercase flex items-center gap-2 tracking-wider">
                <Sparkles className="w-4 h-4 text-[#00E5FF]" />
                Total Creations Count
              </h4>
              <span className="text-xs font-black bg-[#F27D26] text-black px-2.5 py-0.5 uppercase">
                {totalCreationsCount} Total Works
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#111] border border-[#333] p-3 text-center space-y-1">
                <Palette className="w-5 h-5 text-[#F27D26] mx-auto" />
                <div className="text-lg font-black text-[#e0e0e0]">{profile.totalCreations.vectors}</div>
                <div className="text-[10px] text-[#888] uppercase">Vector Artworks</div>
              </div>

              <div className="bg-[#111] border border-[#333] p-3 text-center space-y-1">
                <Music className="w-5 h-5 text-[#00E5FF] mx-auto" />
                <div className="text-lg font-black text-[#e0e0e0]">{profile.totalCreations.beats}</div>
                <div className="text-[10px] text-[#888] uppercase">Dub Beats</div>
              </div>

              <div className="bg-[#111] border border-[#333] p-3 text-center space-y-1">
                <BookOpen className="w-5 h-5 text-[#FFD700] mx-auto" />
                <div className="text-lg font-black text-[#e0e0e0]">{profile.totalCreations.comics}</div>
                <div className="text-[10px] text-[#888] uppercase">Comic Strips</div>
              </div>

              <div className="bg-[#111] border border-[#333] p-3 text-center space-y-1">
                <Radio className="w-5 h-5 text-[#00FF88] mx-auto" />
                <div className="text-lg font-black text-[#e0e0e0]">{profile.totalCreations.radioSubmissions}</div>
                <div className="text-[10px] text-[#888] uppercase">Radio Submissions</div>
              </div>
            </div>
          </div>

          {/* Section 2: Graphical Breakdown of Earned vs. Spent Harmony Notes */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#333] pb-2">
              <h4 className="font-black italic text-sm text-[#e0e0e0] uppercase flex items-center gap-2 tracking-wider">
                <TrendingUp className="w-4 h-4 text-[#00FF88]" />
                Harmony Notes Financial Breakdown
              </h4>
              <span className="text-[10px] text-[#888] uppercase">Sovereign Ledger</span>
            </div>

            <div className="bg-[#111] border border-[#333] p-4 space-y-4">
              {/* Stat Comparison Numbers */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                <div className="bg-[#050505] border border-[#333] p-3">
                  <div className="text-[10px] text-[#888] uppercase font-bold flex items-center justify-center gap-1">
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#00FF88]" />
                    Total Earned
                  </div>
                  <div className="text-base font-black text-[#00FF88] mt-1">
                    +{totalEarned.toLocaleString()} Harmony
                  </div>
                </div>

                <div className="bg-[#050505] border border-[#333] p-3">
                  <div className="text-[10px] text-[#888] uppercase font-bold flex items-center justify-center gap-1">
                    <ArrowDownRight className="w-3.5 h-3.5 text-[#F27D26]" />
                    Total Spent / Supported
                  </div>
                  <div className="text-base font-black text-[#F27D26] mt-1">
                    -{totalSpent.toLocaleString()} Harmony
                  </div>
                </div>

                <div className="bg-[#050505] border border-[#333] p-3">
                  <div className="text-[10px] text-[#888] uppercase font-bold flex items-center justify-center gap-1">
                    <Coins className="w-3.5 h-3.5 text-[#FFD700]" />
                    Net Vault
                  </div>
                  <div className="text-base font-black text-[#FFD700] mt-1">
                    {harmonyNotes.toLocaleString()} Harmony
                  </div>
                </div>
              </div>

              {/* Graphical Visual Comparison Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] uppercase font-bold">
                  <span className="text-[#00FF88]">Earned ({earnedPct}%)</span>
                  <span className="text-[#F27D26]">Spent ({spentPct}%)</span>
                </div>

                <div className="w-full bg-[#050505] h-4 border border-[#333] flex overflow-hidden p-0.5 gap-0.5">
                  <div
                    className="bg-[#00FF88] h-full transition-all duration-500"
                    style={{ width: `${earnedPct}%` }}
                    title={`Earned: ${totalEarned} Harmony`}
                  />
                  <div
                    className="bg-[#F27D26] h-full transition-all duration-500"
                    style={{ width: `${spentPct}%` }}
                    title={`Spent: ${totalSpent} Harmony`}
                  />
                </div>
              </div>

              {/* 90/9/1 Protocol Distribution Split */}
              <div className="p-3 bg-[#050505] border border-[#333] space-y-2">
                <div className="text-[10px] font-bold text-[#e0e0e0] uppercase tracking-wider flex items-center justify-between">
                  <span>Sovereign 90 / 9 / 1 Protocol Split on Earned Income</span>
                  <span className="text-[#00E5FF]">AS65001 Verified</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                  <div className="bg-[#111] p-2 border border-[#222]">
                    <span className="text-[#00FF88] font-black block">90% Direct</span>
                    <span className="text-[#aaa]">{profile.harmonyStats.creatorSplit90} Notes</span>
                  </div>
                  <div className="bg-[#111] p-2 border border-[#222]">
                    <span className="text-[#F27D26] font-black block">9% Campground Fund</span>
                    <span className="text-[#aaa]">{profile.harmonyStats.communitySplit9} Notes</span>
                  </div>
                  <div className="bg-[#111] p-2 border border-[#222]">
                    <span className="text-[#00E5FF] font-black block">1% Ecosystem Void</span>
                    <span className="text-[#aaa]">{profile.harmonyStats.voidSplit1} Notes</span>
                  </div>
                </div>

                {onNavigateToEconomy && (
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateToEconomy();
                    }}
                    className="w-full mt-2 py-1.5 bg-[#111] hover:bg-[#222] border border-[#333] hover:border-[#00FF88] text-[#00FF88] text-[10px] font-black uppercase tracking-wider transition-colors"
                  >
                    View Internal Economy Protocol Page (Unlisted)
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Recent Activity Ledger */}
          <div className="space-y-3">
            <h4 className="font-black italic text-sm text-[#e0e0e0] uppercase flex items-center gap-2 border-b border-[#333] pb-2 tracking-wider">
              <ShieldCheck className="w-4 h-4 text-[#F27D26]" />
              Recent Ledger Activity
            </h4>

            <div className="space-y-2">
              {profile.recentActivities.map((act) => (
                <div
                  key={act.id}
                  className="bg-[#111] border border-[#333] p-2.5 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    {act.type === 'EARNED' ? (
                      <ArrowUpRight className="w-4 h-4 text-[#00FF88] shrink-0" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-[#F27D26] shrink-0" />
                    )}
                    <div>
                      <div className="font-bold text-[#e0e0e0]">{act.action}</div>
                      <div className="text-[10px] text-[#888]">{act.time}</div>
                    </div>
                  </div>

                  <div
                    className={`font-black ${
                      act.type === 'EARNED' ? 'text-[#00FF88]' : 'text-[#F27D26]'
                    }`}
                  >
                    {act.type === 'EARNED' ? '+' : '-'}{act.amount} Harmony
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#111] border-t border-[#333] flex justify-between items-center text-xs">
          <div className="text-[10px] text-[#888] uppercase">
            Node: Port Waikato • Status: Verified Creator
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#F27D26] hover:bg-[#ff8a38] text-black font-black uppercase text-xs transition-colors border border-[#F27D26]"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
