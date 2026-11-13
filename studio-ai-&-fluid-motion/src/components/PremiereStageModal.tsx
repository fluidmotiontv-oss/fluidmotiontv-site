import React, { useState, useEffect } from 'react';
import { D9ClockState } from '../types';
import {
  Tv,
  Radio,
  Sparkles,
  Flame,
  Zap,
  Award,
  Clock,
  X,
  Coins,
  MessageSquare,
  Send,
  Eye,
  CheckCircle,
  Music,
  Image as ImageIcon,
  BookOpen,
  Film,
  Users,
  Volume2,
  Share2,
  Play,
  RotateCcw,
  GitFork,
  Repeat,
  Layers
} from 'lucide-react';

interface PremiereProject {
  id: string;
  type: 'vector' | 'beat' | 'comic' | 'movie';
  title: string;
  categoryLabel: string;
  creatorHandle: string;
  description: string;
  previewUrl?: string;
  tags: string[];
  durationOrStats?: string;
  createdAt: string;
  isRemixable?: boolean;
  remixCount?: number;
}

interface LiveReaction {
  id: string;
  userHandle: string;
  nodeRegion: string;
  message: string;
  tippedNotes?: number;
  timeAgo: string;
}

interface PremiereStageModalProps {
  isOpen: boolean;
  onClose: () => void;
  d9State: D9ClockState;
  onEarnHarmony: (amount: number, description: string) => void;
  onNavigateTab?: (tab: string) => void;
}

const PRESET_PROJECTS: PremiereProject[] = [
  {
    id: 'proj-vec-1',
    type: 'vector',
    title: 'Port Waikato Sunset Barrel Cyber-Vector',
    categoryLabel: 'Vector Art',
    creatorHandle: '@PeeDubSurfer',
    description: 'High-contrast geometric brutalist vector breakdown of the Sunset Point Break at Port Waikato.',
    tags: ['#PortWaikato', '#BrutalistVector', '#ApexSolstice'],
    durationOrStats: '4K Vector Asset • 12 Layers',
    createdAt: 'Apex Wedge Hour 02:18',
    isRemixable: true,
    remixCount: 18,
  },
  {
    id: 'proj-beat-1',
    type: 'beat',
    title: 'D9 Apex Harmonic Wedge Synth (124 BPM)',
    categoryLabel: 'Sovereign Beat',
    creatorHandle: '@SolsticeBeats',
    description: '1440-minute solar cycle rhythm track synthesized using Port Waikato coastal wave telemetry.',
    tags: ['#SovereignBeat', '#D9Harmonics', '#CoastalSynth'],
    durationOrStats: '3:24 Track • 124 BPM • WAV',
    createdAt: 'Apex Wedge Hour 02:18',
    isRemixable: true,
    remixCount: 24,
  },
  {
    id: 'proj-comic-1',
    type: 'comic',
    title: 'Tales of Port Waikato Bar: Episode 09',
    categoryLabel: 'Comic Strip',
    creatorHandle: '@FrostbiteMahi',
    description: 'Cyberpunk coastal manga following Frostbite the XA-Stretch Buddy navigating midnight swells.',
    tags: ['#PeeDubComic', '#FrostbiteAdventures', '#CyberSurfing'],
    durationOrStats: '4 Panel High-Res Comic Strip',
    createdAt: 'Apex Wedge Hour 02:18',
    isRemixable: true,
    remixCount: 9,
  },
  {
    id: 'proj-movie-1',
    type: 'movie',
    title: 'Reel #088: South Head Wave Break micro-film',
    categoryLabel: 'Micro Movie',
    creatorHandle: '@FluidMotionDirector',
    description: '8-second procedural loop combining real-time wave audio synthesizer and vector glow.',
    tags: ['#MicroMovie', '#ReelsVault', '#FluidMotion'],
    durationOrStats: '8s Procedural Motion Loop',
    createdAt: 'Apex Wedge Hour 02:18',
    isRemixable: true,
    remixCount: 15,
  },
];

const INITIAL_REACTIONS: LiveReaction[] = [
  {
    id: 'react-1',
    userHandle: '@KarioiWaveMaster',
    nodeRegion: 'Raglan Mesh Node',
    message: '🔥 Stoke level maximum! The line weight on this vector is unreal.',
    tippedNotes: 25,
    timeAgo: 'Just now',
  },
  {
    id: 'react-2',
    userHandle: '@SunsetPointPioneer',
    nodeRegion: 'Port Waikato Node',
    message: '⚡ Proper D9 Apex Wedge frequencies. Pure coastal magic!',
    tippedNotes: 50,
    timeAgo: '1m ago',
  },
  {
    id: 'react-3',
    userHandle: '@AOTEAROA_NODE_9',
    nodeRegion: 'Auckland Mesh Gateway',
    message: '🌊 Smooth fluid motion energy. Tipped 100 Harmony Notes to the creator pool!',
    tippedNotes: 100,
    timeAgo: '2m ago',
  },
];

export const PremiereStageModal: React.FC<PremiereStageModalProps> = ({
  isOpen,
  onClose,
  d9State,
  onEarnHarmony,
  onNavigateTab,
}) => {
  const { isApexWedge, apexType, hourMinute, d9Hour } = d9State;

  // Premiere Stage State
  const [selectedProject, setSelectedProject] = useState<PremiereProject>(PRESET_PROJECTS[0]);
  const [isBroadcasting, setIsBroadcasting] = useState<boolean>(false);
  const [activeAudienceCount, setActiveAudienceCount] = useState<number>(142);
  const [totalTipsReceived, setTotalTipsReceived] = useState<number>(175);
  const [stokesCount, setStokesCount] = useState<number>(89);
  const [liveReactions, setLiveReactions] = useState<LiveReaction[]>(INITIAL_REACTIONS);
  const [customComment, setCustomComment] = useState<string>('');
  const [isCustomizing, setIsCustomizing] = useState<boolean>(false);

  // Custom Form State
  const [customTitle, setCustomTitle] = useState<string>('');
  const [customType, setCustomType] = useState<'vector' | 'beat' | 'comic' | 'movie'>('vector');
  const [customDesc, setCustomDesc] = useState<string>('');
  const [customHandle, setCustomHandle] = useState<string>('@PeeDubCreator');
  const [hasClaimedApexBonus, setHasClaimedApexBonus] = useState<boolean>(false);

  // Apex Wedge timer calculation (Apex wedge lasts 18 minutes: minute 0..17 or 54..71)
  const minutesRemainingInWedge = isApexWedge ? Math.max(1, 18 - (hourMinute % 18)) : 0;

  // Broadcast Audience Simulation Ticker
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isBroadcasting) {
      interval = setInterval(() => {
        // Fluctuate audience count
        setActiveAudienceCount((prev) => prev + Math.floor(Math.random() * 5) - 2);
        setStokesCount((prev) => prev + (Math.random() > 0.4 ? 1 : 0));

        // Randomly simulate incoming live reaction
        if (Math.random() > 0.65) {
          const sampleUsers = ['@SunsetRider', '@CoastalCoder', '@WaikatoMesh', '@D9Architect', '@WaveRider_NZ', '@PeeDubRadio'];
          const sampleRegions = ['Port Waikato Node', 'Raglan Mesh', 'Taranaki Point', 'Auckland Central', 'PeeDub Campground'];
          const sampleMsgs = [
            '🤙 Stoke level high! Loving this broadcast on the Apex Stage!',
            '🔥 Pure brutalist art. Masterpiece!',
            '⚡ Synced with Port Waikato swell frequency!',
            '🎵 Dropped 25 Harmony Notes into the creator Direct Split!',
            '🌊 Catch you on the next set! Legendary work.'
          ];

          const randomTip = Math.random() > 0.5 ? [10, 25, 50][Math.floor(Math.random() * 3)] : 0;
          const newReaction: LiveReaction = {
            id: `react-${Date.now()}`,
            userHandle: sampleUsers[Math.floor(Math.random() * sampleUsers.length)],
            nodeRegion: sampleRegions[Math.floor(Math.random() * sampleRegions.length)],
            message: sampleMsgs[Math.floor(Math.random() * sampleMsgs.length)],
            tippedNotes: randomTip,
            timeAgo: 'Just now',
          };

          setLiveReactions((prev) => [newReaction, ...prev.slice(0, 7)]);
          if (randomTip > 0) {
            setTotalTipsReceived((prev) => prev + randomTip);
          }
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isBroadcasting]);

  if (!isOpen) return null;

  const handleStartPremiere = () => {
    setIsBroadcasting(true);
    setStokesCount((prev) => prev + 15);
    setActiveAudienceCount(168);

    if (!hasClaimedApexBonus) {
      onEarnHarmony(50, 'Apex Wedge Premiere Stage Broadcast Bonus');
      setHasClaimedApexBonus(true);
    }
  };

  const handleAddCustomProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;

    const newProject: PremiereProject = {
      id: `custom-${Date.now()}`,
      type: customType,
      title: customTitle,
      categoryLabel: customType === 'vector' ? 'Vector Art' : customType === 'beat' ? 'Sovereign Beat' : customType === 'comic' ? 'Comic Strip' : 'Micro Movie',
      creatorHandle: customHandle || '@PeeDubCreator',
      description: customDesc || 'Custom creation premiered live during the D9 Apex Wedge.',
      tags: ['#CustomCreation', '#ApexPremiere', '#PeeDubNode'],
      durationOrStats: 'Live Node Asset',
      createdAt: `Apex Wedge Hour ${d9Hour}`,
      isRemixable: true,
      remixCount: 0,
    };

    setSelectedProject(newProject);
    setIsCustomizing(false);
  };

  const handleToggleRemixRights = () => {
    const updated = {
      ...selectedProject,
      isRemixable: !selectedProject.isRemixable,
    };
    setSelectedProject(updated);
    onEarnHarmony(5, updated.isRemixable ? 'Enabled Open Remix Rights for Node Creators' : 'Updated Project Remix Settings');
  };

  const handleRemixRequest = (proj: PremiereProject) => {
    const updatedProject = {
      ...proj,
      remixCount: (proj.remixCount || 0) + 1,
    };
    setSelectedProject(updatedProject);

    // Reward Harmony Notes for initiating collaborative remix fork
    onEarnHarmony(20, `Initiated Collaborative Remix Fork for ${proj.title}`);

    // Determine target studio tab name
    let studioTab = 'vector';
    let studioName = 'Vector Art Studio';
    if (proj.type === 'beat') {
      studioTab = 'music';
      studioName = 'Sovereign Music Studio';
    } else if (proj.type === 'comic') {
      studioTab = 'comic';
      studioName = 'Comic Builder';
    } else if (proj.type === 'movie') {
      studioTab = 'movie';
      studioName = 'Micro Movie Compiler';
    }

    // Add Live Reaction to Feed
    const remixReaction: LiveReaction = {
      id: `remix-${Date.now()}`,
      userHandle: '@You (Creator)',
      nodeRegion: 'Port Waikato Node (Local Host)',
      message: `⚡ Requested collaborative remix fork for "${proj.title}"! Forking directly into ${studioName}...`,
      tippedNotes: 20,
      timeAgo: 'Just now',
    };
    setLiveReactions((prev) => [remixReaction, ...prev]);

    // Navigate to studio tab after a brief feedback moment
    if (onNavigateTab) {
      setTimeout(() => {
        onNavigateTab(studioTab);
        onClose();
      }, 500);
    }
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customComment.trim()) return;

    const userReaction: LiveReaction = {
      id: `user-${Date.now()}`,
      userHandle: '@You (Creator)',
      nodeRegion: 'Port Waikato Node (Local Host)',
      message: customComment,
      timeAgo: 'Just now',
    };

    setLiveReactions((prev) => [userReaction, ...prev]);
    setCustomComment('');
  };

  const handleBoostStoke = () => {
    setStokesCount((prev) => prev + 1);
    onEarnHarmony(1, 'Boosted Stoke on Premiere Broadcast');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="bg-[#050505] border-2 border-[#FFD700] w-full max-w-4xl text-[#e0e0e0] font-mono shadow-[0_0_50px_rgba(255,215,0,0.25)] relative overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Apex Stage Header Banner */}
        <div className="bg-[#111] border-b border-[#FFD700] p-4 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FFD700] text-black font-black flex items-center justify-center shrink-0 shadow-lg">
              <Tv className="w-6 h-6 text-black animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-2xl font-black italic uppercase tracking-wider text-[#FFD700]">
                  PREMIERE STAGE • APEX WEDGE BROADCAST
                </h2>
                <span className="px-2 py-0.5 bg-[#00FF88] text-black font-bold text-[10px] uppercase">
                  NODE LIVE
                </span>
              </div>
              <p className="text-[11px] text-[#888] uppercase tracking-widest flex items-center gap-2">
                <span>PORT WAIKATO NODE (PEE DUB)</span>
                <span>•</span>
                <span className="text-[#00E5FF] font-bold">1,440M SOLAR ENGINE</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Apex Wedge Timer Countdown Badge */}
            <div className={`px-3 py-1.5 border font-mono text-xs font-bold flex items-center gap-2 ${
              isApexWedge
                ? 'bg-[#FFD700]/15 text-[#FFD700] border-[#FFD700] animate-pulse'
                : 'bg-[#151515] text-[#888] border-[#333]'
            }`}>
              <Clock className="w-4 h-4 text-[#FFD700]" />
              <span>
                {isApexWedge
                  ? `APEX ${apexType?.toUpperCase()} ACTIVE (${minutesRemainingInWedge}m LEFT)`
                  : 'APEX WEDGE PREVIEW STAGE'}
              </span>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 bg-[#1a1a1a] border border-[#333] hover:border-[#FFD700] hover:text-[#FFD700] text-[#aaa] font-bold flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body Layout */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Banner explaining the 18-minute Apex Wedge Broadcast Rules */}
          <div className="bg-[#111] border border-[#FFD700]/40 p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start gap-3">
              <Award className="w-5 h-5 text-[#FFD700] shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold text-[#FFD700] uppercase tracking-wider block">
                  18-Minute Sovereign Showcase Protocol (+50 Harmony Notes Apex Bonus)
                </span>
                <p className="text-[#aaa] text-[11px]">
                  During every 18-minute Apex Wedge (Midday & Midnight), node creators showcase their vector artwork, beats, comics, or micro movies directly to active Port Waikato node listeners. 90% Direct Creator Split applies to all tips!
                </p>
              </div>
            </div>

            {isBroadcasting && (
              <div className="px-3 py-1 bg-[#F27D26] text-black font-black text-xs uppercase flex items-center gap-1.5 shrink-0">
                <Radio className="w-4 h-4 animate-spin text-black" />
                <span>Broadcasting Live</span>
              </div>
            )}
          </div>

          {/* Main Broadcast Stage Display */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Project Selector & Live Showcase Stage Player (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-widest text-[#00E5FF] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#00E5FF]" />
                  <span>Selected Project Showcase</span>
                </h3>

                <button
                  onClick={() => setIsCustomizing(!isCustomizing)}
                  className="text-[11px] text-[#F27D26] hover:underline font-bold uppercase flex items-center gap-1"
                >
                  {isCustomizing ? 'Cancel Custom Form' : '+ Premiere Custom Project'}
                </button>
              </div>

              {/* Custom Project Form Drawer */}
              {isCustomizing ? (
                <form onSubmit={handleAddCustomProject} className="bg-[#0c0c0c] border border-[#F27D26] p-4 space-y-3 text-xs">
                  <h4 className="font-bold text-[#F27D26] uppercase">Prepare Custom Creation for Stage</h4>
                  
                  <div>
                    <label className="block text-[10px] text-[#888] uppercase mb-1">Project Title</label>
                    <input
                      type="text"
                      value={customTitle}
                      onChange={(e) => setCustomTitle(e.target.value)}
                      placeholder="e.g. South Head Coastal Vector Solstice"
                      className="w-full bg-[#151515] border border-[#333] focus:border-[#F27D26] text-[#e0e0e0] px-3 py-1.5 outline-none font-mono text-xs"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-[#888] uppercase mb-1">Creation Category</label>
                      <select
                        value={customType}
                        onChange={(e: any) => setCustomType(e.target.value)}
                        className="w-full bg-[#151515] border border-[#333] focus:border-[#F27D26] text-[#e0e0e0] px-2 py-1.5 outline-none font-mono text-xs"
                      >
                        <option value="vector">Vector Art Studio</option>
                        <option value="beat">Sovereign Beat Track</option>
                        <option value="comic">Comic Builder Strip</option>
                        <option value="movie">Micro Movie Compiler</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] text-[#888] uppercase mb-1">Creator Handle</label>
                      <input
                        type="text"
                        value={customHandle}
                        onChange={(e) => setCustomHandle(e.target.value)}
                        placeholder="@PeeDubCreator"
                        className="w-full bg-[#151515] border border-[#333] focus:border-[#F27D26] text-[#e0e0e0] px-3 py-1.5 outline-none font-mono text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-[#888] uppercase mb-1">Description / Creator Notes</label>
                    <textarea
                      value={customDesc}
                      onChange={(e) => setCustomDesc(e.target.value)}
                      placeholder="Describe your creative process or coastal inspiration..."
                      rows={2}
                      className="w-full bg-[#151515] border border-[#333] focus:border-[#F27D26] text-[#e0e0e0] px-3 py-1.5 outline-none font-mono text-xs resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-[#F27D26] hover:bg-[#ff8f3d] text-black font-black uppercase text-xs transition-all shadow-md"
                  >
                    Set Active Showcase
                  </button>
                </form>
              ) : (
                /* Preset Selection Buttons */
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PRESET_PROJECTS.map((proj) => {
                    const isSelected = selectedProject.id === proj.id;
                    const IconComp = proj.type === 'vector' ? ImageIcon : proj.type === 'beat' ? Music : proj.type === 'comic' ? BookOpen : Film;
                    return (
                      <button
                        key={proj.id}
                        onClick={() => {
                          setSelectedProject(proj);
                          setIsBroadcasting(false);
                        }}
                        className={`p-2.5 border text-left flex flex-col justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#FFD700]/15 border-[#FFD700] text-[#FFD700]'
                            : 'bg-[#111] border-[#222] hover:border-[#555] text-[#888]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <IconComp className={`w-4 h-4 ${isSelected ? 'text-[#FFD700]' : 'text-[#888]'}`} />
                          <span className="text-[9px] uppercase font-bold">{proj.categoryLabel}</span>
                        </div>
                        <div className="text-[11px] font-bold truncate text-[#e0e0e0]">{proj.title}</div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Showcase Screen Frame */}
              <div className="bg-[#0a0a0a] border-2 border-[#FFD700]/70 p-4 space-y-4 relative overflow-hidden shadow-2xl">
                {/* Live Transmission Overlay Effects */}
                {isBroadcasting && (
                  <div className="absolute top-2 right-2 z-20 px-2.5 py-1 bg-[#F27D26] text-black font-black text-[10px] uppercase tracking-widest flex items-center gap-1.5 shadow-lg animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-black animate-ping" />
                    <span>TRANSMITTING APEX WEDGE</span>
                  </div>
                )}

                {/* Simulated Artwork / Beat Stage Display Box */}
                <div className="relative aspect-video bg-[#111] border border-[#333] flex flex-col items-center justify-center p-6 text-center overflow-hidden group">
                  {/* Cyber Grid Background */}
                  <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#FFD700_1px,transparent_1px)] [background-size:16px_16px]" />

                  {/* Stage Dynamic Artwork / Visualizer */}
                  <div className="relative z-10 space-y-3">
                    {selectedProject.type === 'vector' && (
                      <div className="w-24 h-24 border-2 border-[#F27D26] bg-[#050505] mx-auto flex items-center justify-center p-2 shadow-[0_0_20px_rgba(242,125,38,0.4)]">
                        <ImageIcon className="w-12 h-12 text-[#F27D26] animate-pulse" />
                      </div>
                    )}

                    {selectedProject.type === 'beat' && (
                      <div className="space-y-2">
                        <div className="w-24 h-24 border-2 border-[#00E5FF] bg-[#050505] mx-auto flex items-center justify-center shadow-[0_0_20px_rgba(0,229,255,0.4)]">
                          <Music className="w-12 h-12 text-[#00E5FF] animate-bounce" />
                        </div>
                        {/* Audio Waveform Bars Visualizer */}
                        <div className="flex items-end justify-center gap-1 h-8">
                          {[40, 75, 100, 60, 90, 45, 80, 95, 30, 85].map((h, i) => (
                            <div
                              key={i}
                              className="w-1.5 bg-[#00E5FF] transition-all duration-300"
                              style={{
                                height: isBroadcasting ? `${Math.floor(Math.random() * 80 + 20)}%` : `${h}%`,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedProject.type === 'comic' && (
                      <div className="w-24 h-24 border-2 border-[#00FF88] bg-[#050505] mx-auto flex items-center justify-center shadow-[0_0_20px_rgba(0,255,136,0.4)]">
                        <BookOpen className="w-12 h-12 text-[#00FF88]" />
                      </div>
                    )}

                    {selectedProject.type === 'movie' && (
                      <div className="w-24 h-24 border-2 border-[#FFD700] bg-[#050505] mx-auto flex items-center justify-center shadow-[0_0_20px_rgba(255,215,0,0.4)]">
                        <Film className="w-12 h-12 text-[#FFD700] animate-pulse" />
                      </div>
                    )}

                    <h4 className="text-sm sm:text-base font-black italic uppercase text-[#e0e0e0]">
                      {selectedProject.title}
                    </h4>
                    <p className="text-[11px] text-[#FFD700] font-bold">
                      By {selectedProject.creatorHandle} • {selectedProject.durationOrStats}
                    </p>
                  </div>
                </div>

                {/* Project Details & Tags */}
                <div className="space-y-2 text-xs">
                  <p className="text-[#ccc] text-[11px] leading-relaxed">
                    {selectedProject.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedProject.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 bg-[#1a1a1a] border border-[#333] text-[10px] text-[#888]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Remix Collaboration Request & Fork Panel */}
                <div className="bg-[#0e0e0e] border border-[#00E5FF]/40 p-3 space-y-2.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5 text-[#00E5FF]">
                      <GitFork className="w-4 h-4 text-[#00E5FF] animate-pulse" />
                      <span className="font-bold uppercase tracking-wider">
                        Remix Rights: {selectedProject.isRemixable ? 'OPEN FOR FORKING' : 'CLOSED BY CREATOR'}
                      </span>
                    </div>

                    <button
                      onClick={handleToggleRemixRights}
                      className="text-[10px] text-[#888] hover:text-[#00E5FF] uppercase font-bold underline cursor-pointer"
                    >
                      {selectedProject.isRemixable ? '[Disable Remixing]' : '[Enable Open Remix Rights]'}
                    </button>
                  </div>

                  <p className="text-[10.5px] text-[#aaa] leading-snug">
                    {selectedProject.isRemixable
                      ? `Creator ${selectedProject.creatorHandle} has enabled collaborative edits. Click below to request a remix fork directly into the ${
                          selectedProject.type === 'beat'
                            ? 'Sovereign Music Studio'
                            : selectedProject.type === 'vector'
                            ? 'Vector Art Studio'
                            : selectedProject.type === 'comic'
                            ? 'Comic Builder'
                            : 'Micro Movie Compiler'
                        }.`
                      : 'Remix rights are currently restricted for this asset.'}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#222]">
                    <button
                      onClick={() => handleRemixRequest(selectedProject)}
                      disabled={!selectedProject.isRemixable}
                      className={`px-4 py-2 border font-black uppercase text-xs flex items-center gap-2 transition-all cursor-pointer ${
                        selectedProject.isRemixable
                          ? 'bg-[#00E5FF] hover:bg-[#52edff] text-black border-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.35)]'
                          : 'bg-[#1a1a1a] text-[#555] border-[#333] cursor-not-allowed'
                      }`}
                    >
                      <Repeat className="w-4 h-4 text-black" />
                      <span>
                        Remix Request & Fork to Studio ({selectedProject.remixCount || 0} Forks)
                      </span>
                    </button>

                    <span className="text-[10px] text-[#00FF88] font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#00FF88]" />
                      <span>+20 Harmony Notes Remix Reward</span>
                    </span>
                  </div>
                </div>

                {/* Action Broadcast Controls */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#222]">
                  {!isBroadcasting ? (
                    <button
                      onClick={handleStartPremiere}
                      className="w-full sm:w-auto px-6 py-3 bg-[#FFD700] hover:bg-[#ffe247] text-black font-black uppercase text-xs tracking-wider transition-all shadow-[0_0_20px_rgba(255,215,0,0.5)] flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Tv className="w-4 h-4 text-black" />
                      <span>STAGE PREMIERE NOW (+50 APEX BONUS)</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <button
                        onClick={handleBoostStoke}
                        className="px-4 py-2 bg-[#F27D26] hover:bg-[#ff8e3c] text-black font-black text-xs uppercase flex items-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <Flame className="w-4 h-4 text-black" />
                        <span>Boost Stoke ({stokesCount})</span>
                      </button>

                      {onNavigateTab && (
                        <button
                          onClick={() => {
                            if (selectedProject.type === 'vector') onNavigateTab('vector');
                            else if (selectedProject.type === 'beat') onNavigateTab('music');
                            else if (selectedProject.type === 'comic') onNavigateTab('comic');
                            else if (selectedProject.type === 'movie') onNavigateTab('movie');
                            onClose();
                          }}
                          className="px-4 py-2 bg-[#222] hover:bg-[#333] border border-[#00E5FF] text-[#00E5FF] font-bold text-xs uppercase flex items-center gap-1 cursor-pointer"
                        >
                          <span>Edit in Studio</span>
                        </button>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-[11px] text-[#888]">
                    <span className="flex items-center gap-1 text-[#00FF88]">
                      <Users className="w-3.5 h-3.5 text-[#00FF88]" />
                      <strong>{activeAudienceCount} Active Viewers</strong>
                    </span>
                    <span className="flex items-center gap-1 text-[#FFD700]">
                      <Coins className="w-3.5 h-3.5 text-[#FFD700]" />
                      <strong>+{totalTipsReceived} Notes Tipped</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Live Mesh Audience Chat & Tipping Feed (5 cols) */}
            <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-black uppercase tracking-widest text-[#FFD700] flex items-center gap-1.5">
                    <Radio className="w-4 h-4 text-[#FFD700] animate-pulse" />
                    <span>Node Listener Audience Feed</span>
                  </h3>
                  <span className="text-[10px] text-[#00FF88] font-bold uppercase">
                    Port Waikato Mesh
                  </span>
                </div>

                {/* Audience Feed List Container */}
                <div className="bg-[#0a0a0a] border border-[#222] p-3 space-y-2.5 h-[320px] overflow-y-auto font-mono text-xs">
                  {liveReactions.map((reaction) => (
                    <div
                      key={reaction.id}
                      className="p-2 bg-[#111] border-l-2 border-[#FFD700] space-y-1 hover:border-[#F27D26] transition-colors"
                    >
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-bold text-[#00E5FF]">{reaction.userHandle}</span>
                        <span className="text-[#666]">{reaction.timeAgo}</span>
                      </div>
                      <p className="text-[#e0e0e0] text-[11px]">{reaction.message}</p>
                      <div className="flex items-center justify-between text-[9.5px] text-[#888] pt-0.5">
                        <span className="text-[#555]">{reaction.nodeRegion}</span>
                        {reaction.tippedNotes && (
                          <span className="text-[#FFD700] font-bold flex items-center gap-0.5">
                            <Coins className="w-3 h-3 text-[#FFD700]" />
                            +{reaction.tippedNotes} Tip
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat Input Box */}
              <form onSubmit={handleSendComment} className="pt-2 flex gap-2">
                <input
                  type="text"
                  value={customComment}
                  onChange={(e) => setCustomComment(e.target.value)}
                  placeholder="Broadcast message or stoke to node..."
                  className="flex-1 bg-[#111] border border-[#333] focus:border-[#FFD700] text-[#e0e0e0] px-3 py-2 outline-none text-xs font-mono"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#FFD700] hover:bg-[#ffe142] text-black font-black uppercase text-xs flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-black" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Footer Bar */}
        <div className="bg-[#0a0a0a] border-t border-[#222] px-6 py-3 flex flex-wrap items-center justify-between text-[11px] text-[#888] font-mono shrink-0">
          <div>
            <span>Sovereign Economic Model: </span>
            <strong className="text-[#00FF88]">90% Creator Direct</strong> • 9% Campground Community Fund
          </div>
          <div className="flex items-center gap-2 text-[#FFD700]">
            <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" />
            <span>Port Waikato Node (Pee Dub)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
