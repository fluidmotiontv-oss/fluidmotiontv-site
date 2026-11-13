import React, { useState, useEffect, useRef } from 'react';
import {
  Radio,
  Sparkles,
  Flame,
  Send,
  Filter,
  Volume2,
  Zap,
  Coins,
  Tv,
  Music,
  Image as ImageIcon,
  BookOpen,
  Film,
  Waves,
  MessageSquare,
  Share2,
  CheckCircle2,
  Award,
  Play,
  Pause,
  PlusCircle,
  Clock,
  UserCheck,
  Users,
  Mic,
  Activity
} from 'lucide-react';

export interface NodeActivityItem {
  id: string;
  userHandle: string;
  nodeLocation: string;
  activityType: 'mural' | 'beat' | 'comic' | 'movie' | 'tip' | 'surf' | 'premiere';
  title: string;
  description: string;
  stokes: number;
  tips: number;
  timestamp: string;
  isLocalUser?: boolean;
  categoryLabel: string;
}

const INITIAL_NODE_FEED: NodeActivityItem[] = [
  {
    id: 'feed-1',
    userHandle: '@RaglanWave_77',
    nodeLocation: 'Port Waikato South Head',
    activityType: 'mural',
    title: 'Completed Port Waikato Sunset Bar Mural',
    description: 'Rendered a 12-layer geometric vector breakdown of the Sunset Point Break.',
    stokes: 34,
    tips: 50,
    timestamp: '2m ago',
    categoryLabel: 'Art & Mural',
  },
  {
    id: 'feed-2',
    userHandle: '@SolsticeBeats_NZ',
    nodeLocation: 'PeeDub Campground Mesh',
    activityType: 'beat',
    title: 'Premiered 124 BPM Apex Synth Beat',
    description: 'Synthesized 1,440-minute solar cycle rhythm track tuned to marine wave telemetry.',
    stokes: 52,
    tips: 120,
    timestamp: '5m ago',
    categoryLabel: 'Beat Premiered',
  },
  {
    id: 'feed-3',
    userHandle: '@KarioiSurfer',
    nodeLocation: 'Sunset Point Break',
    activityType: 'surf',
    title: 'Logged 2.4m Glassy Barrel Swell',
    description: 'Offshore wind 12 kts, 14s swell period. Stoke level high!',
    stokes: 28,
    tips: 15,
    timestamp: '9m ago',
    categoryLabel: 'Coastal Telemetry',
  },
  {
    id: 'feed-4',
    userHandle: '@AucklandMesh_4',
    nodeLocation: 'Auckland Mesh Gateway',
    activityType: 'tip',
    title: 'Tipped 100 Harmony Notes',
    description: 'Distributed tip via 90% Creator Direct Split to Port Waikato Node Pool.',
    stokes: 19,
    tips: 100,
    timestamp: '14m ago',
    categoryLabel: 'Sovereign Economy',
  },
  {
    id: 'feed-5',
    userHandle: '@FrostbiteMahi',
    nodeLocation: 'PeeDub Radio Station',
    activityType: 'comic',
    title: 'Published Comic Panel: "Tales of Port Waikato Bar #09"',
    description: '4-panel cyber comic featuring Frostbite navigating midnight swells.',
    stokes: 41,
    tips: 35,
    timestamp: '18m ago',
    categoryLabel: 'Comic Strip',
  },
  {
    id: 'feed-6',
    userHandle: '@FluidMotionDirector',
    nodeLocation: 'Port Waikato Node',
    activityType: 'movie',
    title: 'Exported 8s Micro Movie Motion Loop',
    description: 'Procedural wave movement synced with D9 temporal clock state.',
    stokes: 63,
    tips: 80,
    timestamp: '22m ago',
    categoryLabel: 'Micro Movie',
  },
];

export type JamUserStatus = 'Jamming' | 'Creating' | 'Observing';

export interface JamMessage {
  id: string;
  userHandle: string;
  message: string;
  isAudio?: boolean;
  timestamp: string;
  createdAt: number;
  userStatus: JamUserStatus;
  isLocalUser?: boolean;
}

const INITIAL_JAM_USERS = [
  '@RaglanSurfer_9',
  '@SunsetPioneer',
  '@CoastalSynth_NZ'
];

interface NodeFeedProps {
  onEarnHarmony: (amount: number, description: string) => void;
  onNavigateTab?: (tab: string) => void;
  className?: string;
}

export const NodeFeed: React.FC<NodeFeedProps> = ({
  onEarnHarmony,
  onNavigateTab,
  className = '',
}) => {
  const [feedItems, setFeedItems] = useState<NodeActivityItem[]>(INITIAL_NODE_FEED);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [isTickerPaused, setIsTickerPaused] = useState<boolean>(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState<boolean>(false);
  
  // Jam Session State
  const [activeJammers, setActiveJammers] = useState<string[]>(INITIAL_JAM_USERS);
  const [jamMessages, setJamMessages] = useState<JamMessage[]>(() => {
    const now = Date.now();
    return [
      { id: 'jam-1', userHandle: '@RaglanSurfer_9', message: 'Waves are picking up at the South Head.', timestamp: 'Just now', createdAt: now - 15000, userStatus: 'Observing' },
      { id: 'jam-2', userHandle: '@CoastalSynth_NZ', message: 'Just dropped a new bassline in the studio.', timestamp: 'Just now', createdAt: now - 5000, userStatus: 'Jamming' },
    ];
  });
  const [jamInput, setJamInput] = useState('');
  const [isRecordingMic, setIsRecordingMic] = useState(false);
  const [isJamExpanded, setIsJamExpanded] = useState(false);
  const [localUserStatus, setLocalUserStatus] = useState<JamUserStatus>('Jamming');
  const [jamTick, setJamTick] = useState(0);

  // Expire messages older than 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setJamTick((t) => t + 1);
      const now = Date.now();
      setJamMessages((prev) => {
        const next = prev.filter((msg) => now - msg.createdAt < 60000);
        return next.length === prev.length ? prev : next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Broadcast Form State
  const [userTitle, setUserTitle] = useState<string>('');
  const [userActivityType, setUserActivityType] = useState<'mural' | 'beat' | 'comic' | 'movie' | 'surf'>('mural');
  const [userDesc, setUserDesc] = useState<string>('');
  const [userHandleInput, setUserHandleInput] = useState<string>('@PeeDubCreator');

  // Simulated live feed ticker
  useEffect(() => {
    if (isTickerPaused) return;

    const interval = setInterval(() => {
      const sampleUsers = [
        '@RaglanSurfer_9',
        '@SunsetPioneer',
        '@CoastalSynth_NZ',
        '@WaikatoMeshNode',
        '@AotearoaCreator',
        '@PeeDubBeachComber',
        '@SouthHeadRider',
        '@D9SolsticeArtist'
      ];
      const sampleLocations = [
        'Port Waikato South Head',
        'PeeDub Campground Mesh',
        'Sunset Point Break',
        'Raglan Coastal Link',
        'Auckland Mesh Gateway',
        'PeeDub Radio Studio'
      ];

      const sampleTypes: ('mural' | 'beat' | 'comic' | 'movie' | 'tip' | 'surf' | 'premiere')[] = [
        'mural', 'beat', 'comic', 'movie', 'tip', 'surf', 'premiere'
      ];

      const chosenType = sampleTypes[Math.floor(Math.random() * sampleTypes.length)];
      const randomUser = sampleUsers[Math.floor(Math.random() * sampleUsers.length)];
      const randomLoc = sampleLocations[Math.floor(Math.random() * sampleLocations.length)];

      let title = '';
      let desc = '';
      let catLabel = '';

      switch (chosenType) {
        case 'mural':
          title = 'Finished 4K Vector Art Mural';
          desc = 'Exported high-contrast brutalist coastal illustration to Node Vault.';
          catLabel = 'Art & Mural';
          break;
        case 'beat':
          title = 'Synthesized 124 BPM Coastal Beat';
          desc = 'Rendered wave-tuned synth harmonics on the Sovereign Music Studio.';
          catLabel = 'Beat Premiered';
          break;
        case 'comic':
          title = 'Published Cyberpunk Coastal Comic Panel';
          desc = 'Added fresh panels to Tales of Port Waikato Bar.';
          catLabel = 'Comic Strip';
          break;
        case 'movie':
          title = 'Compiled 8s Micro Movie Loop';
          desc = 'Exported wave visualizer loop with D9 clock audio overlay.';
          catLabel = 'Micro Movie';
          break;
        case 'tip':
          const tipAmt = [10, 25, 50, 100][Math.floor(Math.random() * 4)];
          title = `Tipped ${tipAmt} Harmony Notes`;
          desc = 'Poured stoke into the 90% Creator Direct Split pool!';
          catLabel = 'Sovereign Economy';
          break;
        case 'surf':
          title = 'Logged 2.2m Sunset Point Wave Telemetry';
          desc = 'Offshore breeze, glassy surface, high stoke level!';
          catLabel = 'Coastal Telemetry';
          break;
        case 'premiere':
          title = 'Launched Live Apex Wedge Premiere Showcase';
          desc = 'Broadcasting live creative work to all active node listeners!';
          catLabel = 'Stage Premiere';
          break;
      }

      const newItem: NodeActivityItem = {
        id: `auto-${Date.now()}`,
        userHandle: randomUser,
        nodeLocation: randomLoc,
        activityType: chosenType,
        title,
        description: desc,
        stokes: Math.floor(Math.random() * 15) + 5,
        tips: Math.random() > 0.5 ? [10, 25, 50][Math.floor(Math.random() * 3)] : 0,
        timestamp: 'Just now',
        categoryLabel: catLabel,
      };

      setFeedItems((prev) => [newItem, ...prev.slice(0, 19)]);
    }, 7000);

    return () => clearInterval(interval);
  }, [isTickerPaused]);

  const handleJamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jamInput.trim() && !isRecordingMic) return;

    const newJamMsg: JamMessage = {
      id: `jam-${Date.now()}`,
      userHandle: userHandleInput || '@PeeDubCreator',
      message: isRecordingMic ? 'Audio Broadcast (5s snippet)' : jamInput,
      isAudio: isRecordingMic,
      timestamp: 'Just now',
      createdAt: Date.now(),
      userStatus: localUserStatus,
      isLocalUser: true,
    };

    setJamMessages((prev) => [newJamMsg, ...prev]);
    setJamInput('');
    if (isRecordingMic) setIsRecordingMic(false);
    onEarnHarmony(2, 'Broadcasted to Node Jam Session');
  };

  const handleStokesClick = (id: string) => {
    setFeedItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, stokes: item.stokes + 1 };
        }
        return item;
      })
    );
    onEarnHarmony(1, 'Boosted Stoke on Node Activity Feed');
  };

  const handleTipClick = (id: string) => {
    setFeedItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, tips: item.tips + 10 };
        }
        return item;
      })
    );
    onEarnHarmony(5, 'Tipped 10 Harmony Notes to Node Creator');
  };

  const handleBroadcastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userTitle.trim()) return;

    let catLabel = 'Art & Mural';
    if (userActivityType === 'beat') catLabel = 'Beat Premiered';
    else if (userActivityType === 'comic') catLabel = 'Comic Strip';
    else if (userActivityType === 'movie') catLabel = 'Micro Movie';
    else if (userActivityType === 'surf') catLabel = 'Coastal Telemetry';

    const newBroadcastItem: NodeActivityItem = {
      id: `user-${Date.now()}`,
      userHandle: userHandleInput || '@PeeDubCreator',
      nodeLocation: 'Port Waikato Node (Local Host)',
      activityType: userActivityType,
      title: userTitle,
      description: userDesc || 'Premiered live on Port Waikato Node Activity Feed.',
      stokes: 1,
      tips: 0,
      timestamp: 'Just now',
      isLocalUser: true,
      categoryLabel: catLabel,
    };

    setFeedItems((prev) => [newBroadcastItem, ...prev]);
    setShowBroadcastModal(false);
    setUserTitle('');
    setUserDesc('');
    onEarnHarmony(15, 'Broadcasted Activity to Node Feed');
  };

  const filteredItems = feedItems.filter((item) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'art' && (item.activityType === 'mural' || item.activityType === 'comic')) return true;
    if (activeFilter === 'audio' && item.activityType === 'beat') return true;
    if (activeFilter === 'video' && item.activityType === 'movie') return true;
    if (activeFilter === 'economy' && item.activityType === 'tip') return true;
    if (activeFilter === 'surf' && item.activityType === 'surf') return true;
    if (activeFilter === 'premiere' && item.activityType === 'premiere') return true;
    return true;
  });

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'mural':
        return <ImageIcon className="w-4 h-4 text-[#F27D26]" />;
      case 'beat':
        return <Music className="w-4 h-4 text-[#00E5FF]" />;
      case 'comic':
        return <BookOpen className="w-4 h-4 text-[#00FF88]" />;
      case 'movie':
        return <Film className="w-4 h-4 text-[#FFD700]" />;
      case 'tip':
        return <Coins className="w-4 h-4 text-[#FFD700]" />;
      case 'surf':
        return <Waves className="w-4 h-4 text-[#00E5FF]" />;
      case 'premiere':
        return <Tv className="w-4 h-4 text-[#FFD700]" />;
      default:
        return <Sparkles className="w-4 h-4 text-[#00FF88]" />;
    }
  };

  return (
    <div className={`bg-[#050505] border-2 border-[#00FF88] p-4 sm:p-5 text-[#e0e0e0] font-mono shadow-xl relative overflow-hidden ${className}`}>
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222] pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#00FF88] text-black font-black flex items-center justify-center shrink-0 shadow-md">
            <Radio className="w-5 h-5 text-black animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-black italic uppercase tracking-wider text-[#00FF88]">
                PORT WAIKATO NODE ACTIVITY FEED
              </h3>
              <span className="px-2 py-0.5 bg-[#00FF88]/20 border border-[#00FF88] text-[#00FF88] text-[9.5px] font-bold uppercase flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#00FF88] animate-ping" />
                <span>Live Mesh Ticker</span>
              </span>
            </div>
            <p className="text-[10.5px] text-[#888] uppercase tracking-wide">
              Anonymized Real-time Creative & Coastal Stream • Node 09
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsTickerPaused(!isTickerPaused)}
            className={`px-3 py-1.5 border text-xs font-bold uppercase flex items-center gap-1.5 transition-all cursor-pointer ${
              isTickerPaused
                ? 'bg-[#151515] text-[#888] border-[#333] hover:border-[#888]'
                : 'bg-[#00FF88]/10 text-[#00FF88] border-[#00FF88] hover:bg-[#00FF88]/20'
            }`}
            title={isTickerPaused ? 'Resume Ticker' : 'Pause Live Feed'}
          >
            {isTickerPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isTickerPaused ? 'Resume' : 'Pause'}</span>
          </button>

          <button
            onClick={() => setShowBroadcastModal(true)}
            className="px-3.5 py-1.5 bg-[#F27D26] hover:bg-[#ff8f3e] text-black font-black text-xs uppercase flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-black" />
            <span>Broadcast Activity</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs Row */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-4 scrollbar-none text-xs">
        {[
          { id: 'all', label: 'All Activity' },
          { id: 'art', label: 'Art & Murals' },
          { id: 'audio', label: 'Beats & Radio' },
          { id: 'video', label: 'Movies & Reels' },
          { id: 'premiere', label: 'Stage Premieres' },
          { id: 'economy', label: 'Tips & Economy' },
          { id: 'surf', label: 'Surf & Telemetry' },
        ].map((tab) => {
          const isActive = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1 border whitespace-nowrap text-[11px] font-bold uppercase transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#00FF88] text-black border-[#00FF88]'
                  : 'bg-[#111] text-[#aaa] border-[#222] hover:border-[#555]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Broadcast Modal Drawer */}
      {showBroadcastModal && (
        <div className="mb-5 bg-[#0a0a0a] border-2 border-[#F27D26] p-4 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-[#222] pb-2">
            <h4 className="text-xs font-black uppercase text-[#F27D26] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F27D26]" />
              <span>Broadcast Activity to Port Waikato Node</span>
            </h4>
            <button
              onClick={() => setShowBroadcastModal(false)}
              className="text-[#888] hover:text-white text-xs uppercase font-bold"
            >
              [Cancel]
            </button>
          </div>

          <form onSubmit={handleBroadcastSubmit} className="space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] text-[#888] uppercase mb-1">Activity Title / Milestone</label>
                <input
                  type="text"
                  value={userTitle}
                  onChange={(e) => setUserTitle(e.target.value)}
                  placeholder="e.g. Completed Port Waikato Vector Sunset"
                  className="w-full bg-[#151515] border border-[#333] focus:border-[#F27D26] text-[#e0e0e0] px-3 py-1.5 outline-none font-mono text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] text-[#888] uppercase mb-1">Category</label>
                <select
                  value={userActivityType}
                  onChange={(e: any) => setUserActivityType(e.target.value)}
                  className="w-full bg-[#151515] border border-[#333] focus:border-[#F27D26] text-[#e0e0e0] px-2 py-1.5 outline-none font-mono text-xs"
                >
                  <option value="mural">Art & Mural Studio</option>
                  <option value="beat">Sovereign Beat Track</option>
                  <option value="comic">Comic Panel Strip</option>
                  <option value="movie">Micro Movie Compiler</option>
                  <option value="surf">Coastal Surf Telemetry</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-[#888] uppercase mb-1">Description / Creator Note</label>
              <textarea
                value={userDesc}
                onChange={(e) => setUserDesc(e.target.value)}
                placeholder="Share a short note about your creation process or coastal swell..."
                rows={2}
                className="w-full bg-[#151515] border border-[#333] focus:border-[#F27D26] text-[#e0e0e0] px-3 py-1.5 outline-none font-mono text-xs resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-[#F27D26] hover:bg-[#ff8f3e] text-black font-black uppercase text-xs transition-all shadow-md cursor-pointer"
            >
              Publish Live to Node (+15 Harmony Notes)
            </button>
          </form>
        </div>
      )}

      {/* Node Jam Session Section */}
      <div className="mb-5 bg-[#111] border border-[#222] overflow-hidden">
        <button
          onClick={() => setIsJamExpanded(!isJamExpanded)}
          className="w-full flex items-center justify-between p-3 bg-[#1a1a1a] hover:bg-[#222] transition-colors border-b border-[#222]"
        >
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#00E5FF]" />
            <h4 className="text-xs font-black uppercase tracking-wider text-[#e0e0e0]">
              Active Node Jam <span className="text-[#00E5FF] ml-1">({activeJammers.length + 1} Local)</span>
            </h4>
          </div>
          <span className="text-[10px] text-[#888] font-bold uppercase">
            {isJamExpanded ? 'Collapse' : 'Expand'}
          </span>
        </button>

        {isJamExpanded && (
          <div className="p-3 space-y-4">
            {/* Active Users */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
              <span className="text-[10px] uppercase text-[#666] shrink-0 font-bold">In the mix:</span>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="px-2 py-0.5 bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF] text-[10px] font-bold">
                  @PeeDubCreator (You)
                </span>
                {activeJammers.map(jammer => (
                  <span key={jammer} className="px-2 py-0.5 bg-[#222] text-[#aaa] border border-[#333] text-[10px]">
                    {jammer}
                  </span>
                ))}
              </div>
            </div>

            {/* Jam Feed */}
            <div className="h-32 overflow-y-auto bg-[#0a0a0a] border border-[#222] p-2 space-y-2">
              {jamMessages.length === 0 ? (
                <div className="text-[10px] text-[#555] text-center mt-10 uppercase font-bold">
                  Jam session is quiet. Drop a note or beat.
                </div>
              ) : (
                jamMessages.map(msg => (
                  <div key={msg.id} className="flex flex-col gap-0.5">
                    <div className="flex justify-between items-end">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-bold ${msg.isLocalUser ? 'text-[#00E5FF]' : 'text-[#888]'}`}>
                          {msg.userHandle}
                        </span>
                        <span className="text-[8px] px-1 bg-[#222] text-[#888] uppercase border border-[#333]">{msg.userStatus}</span>
                      </div>
                      <span className="text-[9px] text-[#555]">{Math.max(0, Math.ceil((60000 - (Date.now() - msg.createdAt)) / 1000))}s left</span>
                    </div>
                    <div className={`text-[11px] p-1.5 border ${msg.isLocalUser ? 'bg-[#00E5FF]/5 border-[#00E5FF]/30 text-[#e0e0e0]' : 'bg-[#151515] border-[#222] text-[#bbb]'}`}>
                      {msg.isAudio ? (
                        <div className="flex items-center gap-2 text-[#00FF88]">
                          <Activity className="w-3.5 h-3.5 animate-pulse" />
                          <span>{msg.message}</span>
                        </div>
                      ) : (
                        msg.message
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Jam Input Area */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#888] uppercase font-bold">Status:</span>
                {(['Jamming', 'Creating', 'Observing'] as JamUserStatus[]).map(status => (
                  <button
                    type="button"
                    key={status}
                    onClick={() => setLocalUserStatus(status)}
                    className={`text-[9px] uppercase px-2 py-0.5 border ${localUserStatus === status ? 'bg-[#00E5FF]/20 border-[#00E5FF] text-[#00E5FF]' : 'bg-[#151515] border-[#333] text-[#888]'}`}
                  >
                    {status}
                  </button>
                ))}
              </div>
              <form onSubmit={handleJamSubmit} className="flex items-center gap-2">
                <input
                  type="text"
                  value={jamInput}
                  onChange={(e) => setJamInput(e.target.value)}
                  placeholder="Type a quick status..."
                  className="flex-1 bg-[#151515] border border-[#333] focus:border-[#00E5FF] text-[#e0e0e0] px-2 py-1.5 outline-none font-mono text-xs"
                />
                <button
                  type="button"
                  onMouseDown={() => setIsRecordingMic(true)}
                  onMouseUp={handleJamSubmit}
                  onMouseLeave={() => { if (isRecordingMic) handleJamSubmit(new Event('submit') as any); }}
                  className={`p-1.5 border transition-all ${
                    isRecordingMic ? 'bg-[#FF0055]/20 border-[#FF0055] text-[#FF0055]' : 'bg-[#222] border-[#333] text-[#aaa] hover:text-[#e0e0e0]'
                  }`}
                  title="Hold to Record Audio Snippet"
                >
                  <Mic className={`w-4 h-4 ${isRecordingMic ? 'animate-pulse' : ''}`} />
                </button>
                <button
                  type="submit"
                  disabled={!jamInput.trim()}
                  className="px-3 py-1.5 bg-[#00E5FF] text-black font-black uppercase text-[10px] hover:bg-[#33eaff] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Activity Feed Grid / List */}
      <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
        {filteredItems.length === 0 ? (
          <div className="p-8 text-center bg-[#0a0a0a] border border-[#222] text-[#888] text-xs">
            No activity logged for this category yet. Be the first to broadcast!
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className={`p-3 bg-[#0a0a0a] border transition-all hover:border-[#00FF88] flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                item.isLocalUser ? 'border-[#F27D26] bg-[#F27D26]/5' : 'border-[#222]'
              }`}
            >
              {/* Left Column: Icon + Handles + Title */}
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#151515] border border-[#333] shrink-0 mt-0.5">
                  {getItemIcon(item.activityType)}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2 text-[10px]">
                    <span className="font-bold text-[#00E5FF]">{item.userHandle}</span>
                    {item.isLocalUser && (
                      <span className="px-1.5 py-0.2 bg-[#F27D26] text-black font-bold uppercase text-[9px]">
                        LOCAL YOU
                      </span>
                    )}
                    <span className="text-[#666]">•</span>
                    <span className="text-[#888]">{item.nodeLocation}</span>
                    <span className="text-[#666]">•</span>
                    <span className="text-[#00FF88] font-bold">{item.categoryLabel}</span>
                  </div>

                  <h4 className="text-xs font-bold text-[#e0e0e0]">{item.title}</h4>
                  <p className="text-[11px] text-[#aaa] leading-snug">{item.description}</p>
                </div>
              </div>

              {/* Right Column: Interactive Stoke & Tip Controls */}
              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#1a1a1a]">
                <div className="text-[10px] text-[#666] font-mono">{item.timestamp}</div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleStokesClick(item.id)}
                    className="px-2.5 py-1 bg-[#151515] hover:bg-[#222] border border-[#333] hover:border-[#F27D26] text-[#e0e0e0] hover:text-[#F27D26] text-[10px] font-bold uppercase flex items-center gap-1 transition-all cursor-pointer"
                    title="Boost Stoke"
                  >
                    <Flame className="w-3 h-3 text-[#F27D26]" />
                    <span>{item.stokes} Stoke</span>
                  </button>

                  <button
                    onClick={() => handleTipClick(item.id)}
                    className="px-2.5 py-1 bg-[#151515] hover:bg-[#222] border border-[#333] hover:border-[#FFD700] text-[#e0e0e0] hover:text-[#FFD700] text-[10px] font-bold uppercase flex items-center gap-1 transition-all cursor-pointer"
                    title="Tip Harmony Notes"
                  >
                    <Coins className="w-3 h-3 text-[#FFD700]" />
                    <span>+{item.tips} Tip</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Summary */}
      <div className="mt-4 pt-3 border-t border-[#222] flex flex-wrap items-center justify-between text-[10px] text-[#777]">
        <div className="flex items-center gap-2">
          <UserCheck className="w-3.5 h-3.5 text-[#00FF88]" />
          <span>Sovereign Economic Model: 90% Creator Direct / 9% Community Fund</span>
        </div>
        <div className="text-[#00E5FF] font-bold">
          Pee Dub Node Stream • Port Waikato, Aotearoa
        </div>
      </div>
    </div>
  );
};
