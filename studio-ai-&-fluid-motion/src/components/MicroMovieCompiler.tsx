import React, { useState, useEffect, useRef } from 'react';
import {
  Film,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Trash2,
  Sparkles,
  Move,
  Layers,
  Smile,
  Music,
  ImageIcon,
  Share2,
  Video,
  Download,
  Zap,
  Flame,
  MessageSquare,
  Compass,
  CheckCircle2,
  Volume2,
  VolumeX,
  FastForward,
  Copy,
  ChevronLeft,
  ChevronRight,
  Palette
} from 'lucide-react';

export interface FigureModel {
  id: string;
  name: string;
  avatar: string;
  category: 'SURFER' | 'COASTAL_BEAST' | 'ROBOT' | 'VEHICLE' | 'TIKI';
  defaultSpeech: string;
  color: string;
}

export interface MovieFrame {
  id: string;
  title: string;
  figure: FigureModel;
  figureX: number; // 0 - 100%
  figureY: number; // 0 - 100%
  figureScale: number; // 0.5 - 2.0
  figureFlip: boolean;
  dialogue: string;
  humourPunchline: string;
  bgGradient: string;
  animationEffect: 'BOUNCE' | 'PAN_RIGHT' | 'ZOOM_IN' | 'GLITCH' | 'SHAKE' | 'NONE';
  durationSeconds: number;
  soundtrackId?: string;
  stickerBadge?: string;
}

interface MicroMovieCompilerProps {
  onEarnHarmony?: (amount: number, description: string) => void;
  onNavigateTab?: (tab: string) => void;
}

const FIGURE_MODELS: FigureModel[] = [
  {
    id: 'fig-frostbite',
    name: 'Frostbite 🥶',
    avatar: '🥶',
    category: 'SURFER',
    defaultSpeech: 'Wetsuit in August? Stoke level high, body temp 4°C!',
    color: '#00E5FF',
  },
  {
    id: 'fig-tiki',
    name: 'Pee Dub Tiki 🗿',
    avatar: '🗿',
    category: 'TIKI',
    defaultSpeech: 'Respect the point break, drop 90% to the creator!',
    color: '#F27D26',
  },
  {
    id: 'fig-gull',
    name: 'Cyber Gull 🦤',
    avatar: '🦤',
    category: 'COASTAL_BEAST',
    defaultSpeech: 'Squawk! I stole your chips and did a 360 air-reverse!',
    color: '#00FF88',
  },
  {
    id: 'fig-[#00FF88]',
    name: 'Sovereign Bot 🤖',
    avatar: '🤖',
    category: 'ROBOT',
    defaultSpeech: 'Compiling 82 BPM dub beats into Port Waikato mesh network.',
    color: '#FFD700',
  },
  {
    id: 'fig-van',
    name: 'Sunset Cruiser 🚐',
    avatar: '🚐',
    category: 'VEHICLE',
    defaultSpeech: 'Vroom! Headed to the South Head dunes for golden hour.',
    color: '#FF6B6B',
  },
  {
    id: 'fig-[#FFD700]',
    name: 'Shaka Surfer 🏄‍♂️',
    avatar: '🏄‍♂️',
    category: 'SURFER',
    defaultSpeech: 'That wave just gave me a high five in the barrel!',
    color: '#00E5FF',
  }
];

const HUMOUR_PUNCHLINES = [
  "When you try to duckdive a 10ft swell and end up in Australia 🇦🇺",
  "My board has 3 fins, my wetsuit has 4 leaks, my stoke has 0 limits!",
  "AI compiled this movie in 0.04 seconds, but my pop-up took 3 minutes ⏱️",
  "Campground rules: 90% of fish goes to the surfer, 9% to gulls, 1% to the void 🍟",
  "Is it a bird? Is it a plane? No, it's Frostbite doing a backflip off the sandbar 🥶",
  "82 BPM Dub bass so deep it shook the sand dunes into a vector graphic 🔊",
];

const BG_GRADIENTS = [
  { id: 'sunset', name: 'Port Waikato Sunset', css: 'from-[#1a0b00] via-[#3d1800] to-[#0a1520]' },
  { id: 'cyber', name: 'AS65001 Cyber Mesh', css: 'from-[#001f2d] via-[#050505] to-[#002b1f]' },
  { id: 'dune', name: 'Coastal Sand Dunes', css: 'from-[#2b1f0d] via-[#111111] to-[#0a0a0a]' },
  { id: 'twilight', name: 'Midnight Apex Wedge', css: 'from-[#0d001a] via-[#050505] to-[#001020]' },
  { id: 'neon', name: 'Neon Reef Break', css: 'from-[#002b22] via-[#050505] to-[#2b1400]' },
];

const INITIAL_FRAMES: MovieFrame[] = [
  {
    id: 'frame-1',
    title: 'Frame 1: Dawn at Pee Dub',
    figure: FIGURE_MODELS[0], // Frostbite
    figureX: 25,
    figureY: 40,
    figureScale: 1.2,
    figureFlip: false,
    dialogue: 'Wetsuit in August? Stoke level high, body temp 4°C!',
    humourPunchline: 'When you try to duckdive a 10ft swell and end up in Australia 🇦🇺',
    bgGradient: 'from-[#1a0b00] via-[#3d1800] to-[#0a1520]',
    animationEffect: 'PAN_RIGHT',
    durationSeconds: 2.5,
    stickerBadge: '🌅 1:1 Vector Wave',
  },
  {
    id: 'frame-2',
    title: 'Frame 2: The Point Break Challenge',
    figure: FIGURE_MODELS[1], // Tiki
    figureX: 50,
    figureY: 35,
    figureScale: 1.4,
    figureFlip: false,
    dialogue: 'Respect the point break! 90% direct to the creator!',
    humourPunchline: 'My board has 3 fins, my wetsuit has 4 leaks, my stoke has 0 limits!',
    bgGradient: 'from-[#001f2d] via-[#050505] to-[#002b1f]',
    animationEffect: 'BOUNCE',
    durationSeconds: 2.0,
    stickerBadge: '🗿 Sovereign Shield',
  },
  {
    id: 'frame-3',
    title: 'Frame 3: Gull Intrusion',
    figure: FIGURE_MODELS[2], // Cyber Gull
    figureX: 70,
    figureY: 20,
    figureScale: 1.3,
    figureFlip: strokeFlip(true),
    dialogue: 'Squawk! I stole your hot chips and did a 360 air-reverse!',
    humourPunchline: 'Campground rules: 90% of fish goes to the surfer, 9% to gulls, 1% to the void 🍟',
    bgGradient: 'from-[#2b1f0d] via-[#111111] to-[#0a0a0a]',
    animationEffect: 'GLITCH',
    durationSeconds: 2.2,
    stickerBadge: '🦤 Air-Reverse Gull',
  },
  {
    id: 'frame-4',
    title: 'Frame 4: Grand Sunset Finale',
    figure: FIGURE_MODELS[5], // Shaka Surfer
    figureX: 45,
    figureY: 45,
    figureScale: 1.5,
    figureFlip: false,
    dialogue: 'That wave just gave me a high five in the barrel!',
    humourPunchline: '82 BPM Dub bass so deep it shook the sand dunes into a vector graphic 🔊',
    bgGradient: 'from-[#0d001a] via-[#050505] to-[#001020]',
    animationEffect: 'ZOOM_IN',
    durationSeconds: 3.0,
    stickerBadge: '🤙 Apex Sol',
  }
];

function strokeFlip(val: boolean) {
  return val;
}

export const MicroMovieCompiler: React.FC<MicroMovieCompilerProps> = ({
  onEarnHarmony,
  onNavigateTab,
}) => {
  const [frames, setFrames] = useState<MovieFrame[]>(INITIAL_FRAMES);
  const [selectedFrameIdx, setSelectedFrameIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentPlaybackFrameIdx, setCurrentPlaybackFrameIdx] = useState<number>(0);
  const [playbackProgress, setPlaybackProgress] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [movieTitle, setMovieTitle] = useState<string>('The Port Waikato Point Break Chronicles');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const activeFrame = frames[selectedFrameIdx] || frames[0];

  // Playback timer loop
  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      const frameDuration = (frames[currentPlaybackFrameIdx]?.durationSeconds || 2) * 1000;
      const intervalMs = 50;
      let elapsed = 0;

      timer = setInterval(() => {
        elapsed += intervalMs;
        setPlaybackProgress((elapsed / frameDuration) * 100);

        if (elapsed >= frameDuration) {
          elapsed = 0;
          setPlaybackProgress(0);
          setCurrentPlaybackFrameIdx((prev) => {
            const next = prev + 1;
            if (next >= frames.length) {
              setIsPlaying(false);
              return 0;
            }
            return next;
          });
        }
      }, intervalMs);
    } else {
      setPlaybackProgress(0);
    }
    return () => clearInterval(timer);
  }, [isPlaying, currentPlaybackFrameIdx, frames]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleTogglePlay = () => {
    if (!isPlaying) {
      setCurrentPlaybackFrameIdx(selectedFrameIdx);
      setIsPlaying(true);
      if (soundEnabled) {
        playBeepSound();
      }
    } else {
      setIsPlaying(false);
    }
  };

  const playBeepSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      // Audio fallback
    }
  };

  // Add Frame
  const handleAddFrame = () => {
    const newId = `frame-${Date.now()}`;
    const newFrame: MovieFrame = {
      id: newId,
      title: `Frame ${frames.length + 1}: Coastal Action`,
      figure: FIGURE_MODELS[Math.floor(Math.random() * FIGURE_MODELS.length)],
      figureX: 40 + Math.random() * 20,
      figureY: 35 + Math.random() * 20,
      figureScale: 1.2,
      figureFlip: false,
      dialogue: 'Stoke level off the charts! Ready for the next set!',
      humourPunchline: HUMOUR_PUNCHLINES[Math.floor(Math.random() * HUMOUR_PUNCHLINES.length)],
      bgGradient: BG_GRADIENTS[Math.floor(Math.random() * BG_GRADIENTS.length)].css,
      animationEffect: 'BOUNCE',
      durationSeconds: 2.0,
      stickerBadge: '⚡ Cyber Sticker',
    };
    setFrames((prev) => [...prev, newFrame]);
    setSelectedFrameIdx(frames.length);
    showToast('Added new Micro Movie Frame!');
  };

  // Delete Frame
  const handleDeleteFrame = (idx: number) => {
    if (frames.length <= 1) {
      showToast('Micro movie requires at least 1 frame!');
      return;
    }
    const updated = frames.filter((_, i) => i !== idx);
    setFrames(updated);
    setSelectedFrameIdx((prev) => Math.min(prev, updated.length - 1));
    showToast('Deleted Frame.');
  };

  // Update Frame Field
  const updateActiveFrame = (updates: Partial<MovieFrame>) => {
    setFrames((prev) =>
      prev.map((f, i) => (i === selectedFrameIdx ? { ...f, ...updates } : f))
    );
  };

  // Compile & Export Movie
  const handleExportMovie = () => {
    if (onEarnHarmony) {
      onEarnHarmony(25, `Compiled Micro Movie: "${movieTitle}"`);
    }
    showToast(`🎬 Movie "${movieTitle}" compiled & published to Vault (+25 Harmony Notes)!`);
  };

  // Randomize Humour
  const handleRandomizeHumour = () => {
    const randomLine = HUMOUR_PUNCHLINES[Math.floor(Math.random() * HUMOUR_PUNCHLINES.length)];
    updateActiveFrame({ humourPunchline: randomLine });
    showToast('Generated fresh coastal humour line!');
  };

  const displayFrame = isPlaying ? frames[currentPlaybackFrameIdx] : activeFrame;

  return (
    <div className="bg-[#050505] border-2 border-[#00FF88] p-4 sm:p-6 space-y-6 text-[#e0e0e0] font-mono shadow-2xl relative">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-20 right-6 z-50 bg-[#00FF88] text-black font-mono font-black text-xs px-4 py-2 border-2 border-black shadow-2xl animate-in slide-in-from-bottom-5 duration-200 flex items-center gap-2">
          <Sparkles className="w-4 h-4 fill-black" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#222] pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Film className="w-6 h-6 text-[#00FF88]" />
            <h2 className="text-lg font-black italic uppercase text-[#00FF88] tracking-wider">
              Micro Movie & Asset Compiler
            </h2>
            <span className="bg-[#111] text-[#00E5FF] border border-[#00E5FF]/40 px-2 py-0.5 text-[10px] font-bold uppercase">
              Figures • Animation • Humour
            </span>
          </div>
          <p className="text-xs text-[#aaa] font-sans mt-1">
            Compile 3D action figures, vector sticker badges, 82 BPM audio beats, and coastal humor punchlines into animated micro-movies.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 border transition-colors ${
              soundEnabled
                ? 'bg-[#111] border-[#00E5FF] text-[#00E5FF]'
                : 'bg-[#111] border-[#333] text-[#666]'
            }`}
            title="Toggle Audio Feedback"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={handleExportMovie}
            className="px-4 py-2 bg-[#00FF88] hover:bg-[#33ff99] text-black font-black uppercase text-xs flex items-center gap-1.5 transition-all shadow-md"
          >
            <Video className="w-4 h-4 text-black" />
            <span>Compile & Publish (+25 Notes)</span>
          </button>
        </div>
      </div>

      {/* Movie Title Editor */}
      <div className="bg-[#111] border border-[#222] p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-[#888] uppercase shrink-0">Movie Title:</span>
          <input
            type="text"
            value={movieTitle}
            onChange={(e) => setMovieTitle(e.target.value)}
            className="bg-[#050505] border border-[#333] focus:border-[#00FF88] text-xs font-black text-[#00FF88] px-3 py-1.5 focus:outline-none w-full sm:w-80"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#aaa]">
          <span>Total Frames: <strong className="text-[#00E5FF]">{frames.length}</strong></span>
          <span>•</span>
          <span>Duration: <strong className="text-[#00FF88]">{frames.reduce((a, b) => a + b.durationSeconds, 0).toFixed(1)}s</strong></span>
        </div>
      </div>

      {/* Main Movie Player Stage & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Stage Viewport (8 Cols) */}
        <div className="lg:col-span-8 space-y-3">
          {/* Main Stage Canvas */}
          <div
            className={`w-full aspect-video bg-gradient-to-br ${displayFrame.bgGradient} border-2 border-[#00FF88] rounded-none relative overflow-hidden flex flex-col justify-between p-6 shadow-2xl transition-all`}
          >
            {/* Top Frame Badge */}
            <div className="flex items-center justify-between relative z-10">
              <span className="bg-[#050505]/90 border border-[#00FF88] text-[#00FF88] font-black text-[10px] uppercase px-2.5 py-1">
                {displayFrame.title}
              </span>

              {displayFrame.stickerBadge && (
                <span className="bg-[#050505]/90 border border-[#00E5FF] text-[#00E5FF] font-bold text-[10px] uppercase px-2.5 py-1">
                  {displayFrame.stickerBadge}
                </span>
              )}
            </div>

            {/* Positioned Action Figure Model */}
            <div
              className={`absolute transition-all duration-300 flex flex-col items-center select-none ${
                displayFrame.animationEffect === 'BOUNCE'
                  ? 'animate-bounce'
                  : displayFrame.animationEffect === 'GLITCH'
                  ? 'animate-pulse scale-105'
                  : displayFrame.animationEffect === 'ZOOM_IN'
                  ? 'scale-110'
                  : ''
              }`}
              style={{
                left: `${displayFrame.figureX}%`,
                top: `${displayFrame.figureY}%`,
                transform: `scale(${displayFrame.figureScale}) ${displayFrame.figureFlip ? 'scaleX(-1)' : ''}`,
              }}
            >
              {/* Dialogue Bubble */}
              <div className="bg-white text-black font-sans font-bold text-xs p-2.5 max-w-xs shadow-2xl relative mb-2 border-2 border-black rounded-lg">
                <p>{displayFrame.dialogue}</p>
                {/* Bubble Tail */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-white" />
              </div>

              {/* Figure Avatar Emoji / Icon */}
              <div
                className="text-6xl filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)] cursor-grab active:cursor-grabbing"
                title={`${displayFrame.figure.name} (${displayFrame.figure.category})`}
              >
                {displayFrame.figure.avatar}
              </div>
              <span
                className="text-[9px] font-black uppercase px-1.5 py-0.5 mt-1 bg-black/80 rounded"
                style={{ color: displayFrame.figure.color }}
              >
                {displayFrame.figure.name}
              </span>
            </div>

            {/* Bottom Humour Punchline Banner */}
            <div className="relative z-10 bg-[#050505]/90 border-2 border-[#F27D26] p-3 backdrop-blur-sm space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] text-[#F27D26] font-black uppercase">
                <Smile className="w-3.5 h-3.5 text-[#F27D26]" />
                <span>Coastal Humour & Meme Compiler:</span>
              </div>
              <p className="text-xs text-[#e0e0e0] font-sans font-bold italic">
                "{displayFrame.humourPunchline}"
              </p>
            </div>
          </div>

          {/* Player Progress Bar & Playback Controls */}
          <div className="bg-[#111] border border-[#222] p-3 space-y-2">
            {/* Timeline Scrub Progress */}
            <div className="w-full bg-[#222] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#00FF88] h-full transition-all duration-75"
                style={{
                  width: isPlaying
                    ? `${((currentPlaybackFrameIdx + playbackProgress / 100) / frames.length) * 100}%`
                    : `${((selectedFrameIdx + 1) / frames.length) * 100}%`,
                }}
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleTogglePlay}
                  className="px-4 py-1.5 bg-[#00FF88] hover:bg-[#33ff99] text-black font-black uppercase text-xs flex items-center gap-1.5 transition-all"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 fill-black" /> Pause Movie
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-black" /> Play Movie
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    setIsPlaying(false);
                    setCurrentPlaybackFrameIdx(0);
                    setSelectedFrameIdx(0);
                  }}
                  className="p-1.5 bg-[#222] hover:bg-[#333] border border-[#444] text-[#aaa] transition-colors"
                  title="Reset to Frame 1"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              <div className="text-xs font-bold text-[#888] uppercase">
                Playing Frame {isPlaying ? currentPlaybackFrameIdx + 1 : selectedFrameIdx + 1} of {frames.length}
              </div>
            </div>
          </div>
        </div>

        {/* Right Editor Controls Panel (4 Cols) */}
        <div className="lg:col-span-4 bg-[#0a0a0a] border border-[#222] p-4 space-y-5">
          <div className="flex items-center justify-between border-b border-[#222] pb-2">
            <h3 className="text-xs font-black uppercase text-[#00E5FF] flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#00E5FF]" /> Frame Inspector
            </h3>
            <span className="text-[10px] text-[#888] uppercase">Frame #{selectedFrameIdx + 1}</span>
          </div>

          {/* Select Action Figure Model */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-[#aaa] uppercase font-bold block">
              1. Choose Action Figure Model:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {FIGURE_MODELS.map((fig) => (
                <button
                  key={fig.id}
                  onClick={() =>
                    updateActiveFrame({
                      figure: fig,
                      dialogue: fig.defaultSpeech,
                    })
                  }
                  className={`p-2 border text-center transition-all flex flex-col items-center gap-1 ${
                    activeFrame.figure.id === fig.id
                      ? 'bg-[#00E5FF]/10 border-[#00E5FF] text-[#00E5FF]'
                      : 'bg-[#111] border-[#222] hover:border-[#444] text-[#aaa]'
                  }`}
                >
                  <span className="text-2xl">{fig.avatar}</span>
                  <span className="text-[9px] font-bold uppercase truncate w-full">
                    {fig.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Figure Position & Scale Sliders */}
          <div className="space-y-2 bg-[#111] p-3 border border-[#222] text-xs">
            <div className="flex items-center justify-between text-[10px] uppercase text-[#888] font-bold">
              <span>Figure Scale: {activeFrame.figureScale.toFixed(1)}x</span>
              <button
                onClick={() => updateActiveFrame({ figureFlip: !activeFrame.figureFlip })}
                className="text-[9px] text-[#00E5FF] hover:underline uppercase"
              >
                Flip Horizontal ({activeFrame.figureFlip ? 'ON' : 'OFF'})
              </button>
            </div>
            <input
              type="range"
              min="0.6"
              max="2.0"
              step="0.1"
              value={activeFrame.figureScale}
              onChange={(e) => updateActiveFrame({ figureScale: parseFloat(e.target.value) })}
              className="w-full accent-[#00E5FF]"
            />

            <div className="grid grid-cols-2 gap-2 text-[10px] text-[#888] uppercase font-bold pt-1">
              <div>
                <span>X Pos: {Math.round(activeFrame.figureX)}%</span>
                <input
                  type="range"
                  min="10"
                  max="80"
                  value={activeFrame.figureX}
                  onChange={(e) => updateActiveFrame({ figureX: parseInt(e.target.value) })}
                  className="w-full accent-[#00E5FF]"
                />
              </div>
              <div>
                <span>Y Pos: {Math.round(activeFrame.figureY)}%</span>
                <input
                  type="range"
                  min="10"
                  max="70"
                  value={activeFrame.figureY}
                  onChange={(e) => updateActiveFrame({ figureY: parseInt(e.target.value) })}
                  className="w-full accent-[#00E5FF]"
                />
              </div>
            </div>
          </div>

          {/* Dialogue Input */}
          <div className="space-y-1">
            <label className="text-[10px] text-[#aaa] uppercase font-bold block">
              2. Character Speech Bubble:
            </label>
            <input
              type="text"
              value={activeFrame.dialogue}
              onChange={(e) => updateActiveFrame({ dialogue: e.target.value })}
              className="w-full bg-[#050505] border border-[#333] focus:border-[#00E5FF] text-xs text-[#e0e0e0] p-2 focus:outline-none"
            />
          </div>

          {/* Humour Line Editor */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[10px] text-[#aaa] uppercase font-bold block">
                3. Humour / Meme Punchline:
              </label>
              <button
                onClick={handleRandomizeHumour}
                className="text-[9px] text-[#F27D26] hover:underline uppercase font-bold"
              >
                🎲 Random Punchline
              </button>
            </div>
            <textarea
              rows={2}
              value={activeFrame.humourPunchline}
              onChange={(e) => updateActiveFrame({ humourPunchline: e.target.value })}
              className="w-full bg-[#050505] border border-[#333] focus:border-[#F27D26] text-xs text-[#e0e0e0] p-2 focus:outline-none font-sans"
            />
          </div>

          {/* Animation & Duration */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="text-[10px] text-[#aaa] uppercase font-bold block mb-1">
                Effect:
              </label>
              <select
                value={activeFrame.animationEffect}
                onChange={(e) => updateActiveFrame({ animationEffect: e.target.value as any })}
                className="w-full bg-[#050505] border border-[#333] focus:border-[#00FF88] p-1.5 text-xs text-[#e0e0e0] uppercase focus:outline-none"
              >
                <option value="BOUNCE">Bounce</option>
                <option value="PAN_RIGHT">Pan Right</option>
                <option value="ZOOM_IN">Zoom In</option>
                <option value="GLITCH">Glitch</option>
                <option value="NONE">None</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-[#aaa] uppercase font-bold block mb-1">
                Duration:
              </label>
              <select
                value={activeFrame.durationSeconds}
                onChange={(e) => updateActiveFrame({ durationSeconds: parseFloat(e.target.value) })}
                className="w-full bg-[#050505] border border-[#333] focus:border-[#00FF88] p-1.5 text-xs text-[#e0e0e0] uppercase focus:outline-none"
              >
                <option value="1.0">1.0 Seconds</option>
                <option value="2.0">2.0 Seconds</option>
                <option value="2.5">2.5 Seconds</option>
                <option value="3.0">3.0 Seconds</option>
                <option value="4.0">4.0 Seconds</option>
              </select>
            </div>
          </div>

        </div>

      </div>

      {/* Frame Strip Sequencer Bar */}
      <div className="bg-[#111] border border-[#222] p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-[#222] pb-2">
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4 text-[#00FF88]" />
            <span className="text-xs font-black uppercase text-[#e0e0e0]">
              Micro Movie Storyboard Sequencer
            </span>
          </div>

          <button
            onClick={handleAddFrame}
            className="px-3 py-1 bg-[#00E5FF] hover:bg-[#33efff] text-black font-black uppercase text-xs flex items-center gap-1 transition-all"
          >
            <Plus className="w-3.5 h-3.5 text-black" />
            <span>Add Frame</span>
          </button>
        </div>

        {/* Horizontal Frame Thumbnails */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {frames.map((frame, idx) => (
            <div
              key={frame.id}
              onClick={() => {
                setIsPlaying(false);
                setSelectedFrameIdx(idx);
              }}
              className={`w-36 h-24 shrink-0 border-2 p-2 relative cursor-pointer transition-all flex flex-col justify-between ${
                selectedFrameIdx === idx
                  ? 'bg-[#00FF88]/10 border-[#00FF88] shadow-lg shadow-[#00FF88]/20'
                  : 'bg-[#0a0a0a] border-[#222] hover:border-[#555]'
              }`}
            >
              <div className="flex items-center justify-between text-[9px] font-bold uppercase">
                <span className="text-[#00FF88]">Frame #{idx + 1}</span>
                <span className="text-[#888]">{frame.durationSeconds}s</span>
              </div>

              <div className="text-center my-auto text-2xl">{frame.figure.avatar}</div>

              <div className="flex items-center justify-between border-t border-[#222] pt-1">
                <span className="text-[8px] text-[#aaa] truncate max-w-[80px]">
                  {frame.figure.name}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFrame(idx);
                  }}
                  className="text-[#666] hover:text-[#FF6B6B] transition-colors p-0.5"
                  title="Delete Frame"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
