import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, Sparkles, Radio, Coins, Sliders, Music, Zap, Check, Share2, Waves, Activity } from 'lucide-react';
import { ProjectTimeline, VersionItem } from './ProjectTimeline';
// @ts-ignore
import TideSynth from '../modules/TideSynth/TideSynth';

interface SovereignMusicStudioProps {
  onEarnHarmony: (amount: number, desc: string) => void;
}

interface BeatSnapshot {
  trackTitle: string;
  bpm: number;
  genre: 'Dub / Reggae' | 'Trip-Hop' | 'Funky House';
  dubDelay: boolean;
  grid: boolean[][];
}

export const SovereignMusicStudio: React.FC<SovereignMusicStudioProps> = ({ onEarnHarmony }) => {
  const [activeSubTab, setActiveSubTab] = useState<'sequencer' | 'tidesynth'>('sequencer');
  const [bpm, setBpm] = useState(82);
  const [genre, setGenre] = useState<'Dub / Reggae' | 'Trip-Hop' | 'Funky House'>('Dub / Reggae');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [dubDelay, setDubDelay] = useState(true);
  const [trackTitle, setTrackTitle] = useState('Pee Dub Point Break Dub');
  const [submitted, setSubmitted] = useState(false);
  const [sharedToStream, setSharedToStream] = useState(false);

  const trackNames = ['Kick Drum', 'Snare / Rim', 'Hi-Hat Sizzle', 'Sub Bass Synth', 'Dub Chord FX'];

  const initialGrid: boolean[][] = [
    [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
    [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false],
    [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
    [true, false, false, true, false, false, true, false, true, false, false, true, false, false, true, false],
    [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false]
  ];

  const [grid, setGrid] = useState<boolean[][]>(initialGrid);

  // Version Timeline State
  const [versions, setVersions] = useState<VersionItem<BeatSnapshot>[]>([
    {
      id: 'beat-ver-1',
      versionNumber: 1,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      label: 'Initial Reggae Rhythm',
      details: '82 BPM Dub / Reggae pattern with delay',
      snapshot: {
        trackTitle: 'Pee Dub Point Break Dub',
        bpm: 82,
        genre: 'Dub / Reggae',
        dubDelay: true,
        grid: initialGrid,
      },
    },
  ]);
  const [currentVersionId, setCurrentVersionId] = useState<string>('beat-ver-1');

  const handleSaveVersion = (label: string) => {
    const newVerId = `beat-ver-${Date.now()}`;
    const newVerNum = versions.length + 1;
    const newVersion: VersionItem<BeatSnapshot> = {
      id: newVerId,
      versionNumber: newVerNum,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      label: label || `Beat Version ${newVerNum}`,
      details: `Title: "${trackTitle}" • ${bpm} BPM • Genre: ${genre}`,
      snapshot: {
        trackTitle,
        bpm,
        genre,
        dubDelay,
        grid: JSON.parse(JSON.stringify(grid)),
      },
    };

    setVersions((prev) => [...prev, newVersion]);
    setCurrentVersionId(newVerId);
  };

  const handleRevertVersion = (ver: VersionItem<BeatSnapshot>) => {
    setTrackTitle(ver.snapshot.trackTitle);
    setBpm(ver.snapshot.bpm);
    setGenre(ver.snapshot.genre);
    setDubDelay(ver.snapshot.dubDelay);
    setGrid(JSON.parse(JSON.stringify(ver.snapshot.grid)));
    setCurrentVersionId(ver.id);
  };

  const audioCtxRef = useRef<AudioContext | null>(null);

  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioContextClass();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const playSound = (trackIndex: number) => {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      if (trackIndex === 0) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(130, now);
        osc.frequency.exponentialRampToValueAtTime(0.01, now + 0.3);
        gain.gain.setValueAtTime(1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (trackIndex === 1) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, now);
        gain.gain.setValueAtTime(0.7, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.18);
      } else if (trackIndex === 2) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(8000, now);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (trackIndex === 3) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(65, now);
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (trackIndex === 4) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(440, now);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

        if (dubDelay) {
          const delay = ctx.createDelay();
          delay.delayTime.value = 0.25;
          const feedback = ctx.createGain();
          feedback.gain.value = 0.4;

          osc.connect(gain);
          gain.connect(delay);
          delay.connect(feedback);
          feedback.connect(delay);
          delay.connect(ctx.destination);
          gain.connect(ctx.destination);
        } else {
          osc.connect(gain);
          gain.connect(ctx.destination);
        }

        osc.start(now);
        osc.stop(now + 0.25);
      }
    } catch (e) {
    }
  };

  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      const stepDuration = (60 / bpm / 4) * 1000;
      timer = setInterval(() => {
        setCurrentStep((prevStep) => {
          const nextStep = (prevStep + 1) % 16;
          grid.forEach((track, trackIdx) => {
            if (track[nextStep]) {
              playSound(trackIdx);
            }
          });
          return nextStep;
        });
      }, stepDuration);
    } else {
      setCurrentStep(0);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, bpm, grid, dubDelay]);

  const applyGenrePreset = (selectedGenre: 'Dub / Reggae' | 'Trip-Hop' | 'Funky House') => {
    setGenre(selectedGenre);
    setSubmitted(false);

    let newBpm = 82;
    let newTitle = 'Pee Dub Reggae Sunset';
    let newDubDelay = true;
    let newGrid: boolean[][] = [];

    if (selectedGenre === 'Dub / Reggae') {
      newBpm = 82;
      newTitle = 'Pee Dub Reggae Sunset';
      newDubDelay = true;
      newGrid = [
        [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
        [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false],
        [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
        [true, false, false, true, false, false, true, false, true, false, false, true, false, false, true, false],
        [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false]
      ];
    } else if (selectedGenre === 'Trip-Hop') {
      newBpm = 94;
      newTitle = 'Coastal Point Break Trip-Hop';
      newDubDelay = true;
      newGrid = [
        [true, false, false, true, false, false, true, false, true, false, false, false, false, true, false, false],
        [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
        [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false],
        [true, true, false, false, true, false, false, true, false, true, false, false, true, false, false, true],
        [false, true, false, false, false, true, false, false, false, true, false, false, false, true, false, false]
      ];
    } else if (selectedGenre === 'Funky House') {
      newBpm = 122;
      newTitle = 'Campground Night Funky Groove';
      newDubDelay = false;
      newGrid = [
        [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
        [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
        [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false],
        [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false],
        [true, false, false, true, false, true, false, false, true, false, false, true, false, true, false, false]
      ];
    }

    setBpm(newBpm);
    setTrackTitle(newTitle);
    setDubDelay(newDubDelay);
    setGrid(newGrid);

    // Auto snapshot when applying a preset
    const autoVerId = `beat-ver-${Date.now()}`;
    const autoVerNum = versions.length + 1;
    const autoVer: VersionItem<BeatSnapshot> = {
      id: autoVerId,
      versionNumber: autoVerNum,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      label: `Preset: ${selectedGenre}`,
      details: `Preset loaded • ${newBpm} BPM • ${newTitle}`,
      snapshot: {
        trackTitle: newTitle,
        bpm: newBpm,
        genre: selectedGenre,
        dubDelay: newDubDelay,
        grid: newGrid,
      },
    };
    setVersions((prev) => [...prev, autoVer]);
    setCurrentVersionId(autoVerId);
  };

  const toggleCell = (trackIdx: number, stepIdx: number) => {
    setGrid((prev) => {
      const next = prev.map((row) => [...row]);
      next[trackIdx][stepIdx] = !next[trackIdx][stepIdx];
      return next;
    });
  };

  const handleClearGrid = () => {
    setGrid(Array.from({ length: 5 }, () => Array(16).fill(false)));
  };

  const handleRandomize = () => {
    setGrid(
      Array.from({ length: 5 }, () =>
        Array.from({ length: 16 }, () => Math.random() > 0.65)
      )
    );
  };

  const handleSubmitToRadio = async () => {
    try {
      const res = await fetch('/api/radio/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackName: trackTitle,
          artistName: 'Port Waikato Campground Surfer',
          bpm,
          genre
        })
      });

      const data = await res.json();
      if (data.success) {
        onEarnHarmony(100, `Submitted beat "${trackTitle}" to Radio Queue`);
        setSubmitted(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleShareToStream = () => {
    setSharedToStream(true);
    onEarnHarmony(50, `Shared beat "${trackTitle}" to Port Waikato Node Stream`);
  };

  return (
    <div className="space-y-6 text-[#e0e0e0]">
      {/* Title & Presets Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111] border-l-4 border-[#F27D26] border-y border-r border-[#333] p-5">
        <div>
          <h2 className="text-xl font-black italic uppercase tracking-tight text-[#e0e0e0] flex items-center gap-2">
            <Music className="w-6 h-6 text-[#F27D26]" />
            Sovereign Music Studio & Beat Synthesizer
          </h2>
          <p className="text-xs font-mono opacity-60 uppercase tracking-wider mt-1">
            WEB AUDIO API GROOVEBOX. SYNTHESIZE DUB/REGGAE, TRIP-HOP & FUNKY HOUSE BEATS.
          </p>
        </div>

        {/* BPM Genre Presets */}
        <div className="flex items-center gap-2">
          {(['Dub / Reggae', 'Trip-Hop', 'Funky House'] as const).map((g) => (
            <button
              key={g}
              onClick={() => applyGenrePreset(g)}
              className={`px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider border transition-all ${
                genre === g
                  ? 'bg-[#F27D26] text-black border-[#F27D26]'
                  : 'bg-[#050505] border-[#333] text-[#aaa] hover:text-[#e0e0e0]'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Studio Sub-Tab Mode Switcher */}
      <div className="flex items-center gap-3 border-b border-[#333] pb-2 font-mono text-xs uppercase font-bold">
        <button
          onClick={() => setActiveSubTab('sequencer')}
          className={`px-4 py-2 border flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'sequencer'
              ? 'bg-[#F27D26] text-black border-[#F27D26] font-black'
              : 'bg-[#111] text-[#aaa] border-[#333] hover:text-[#e0e0e0] hover:border-[#555]'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Beat Sequencer Engine</span>
        </button>

        <button
          onClick={() => setActiveSubTab('tidesynth')}
          className={`px-4 py-2 border flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'tidesynth'
              ? 'bg-[#00E5FF] text-black border-[#00E5FF] font-black shadow-[0_0_15px_rgba(0,229,255,0.4)]'
              : 'bg-[#111] text-[#00E5FF] border-[#00E5FF]/40 hover:bg-[#1a1a1a]'
          }`}
        >
          <Activity className="w-4 h-4 text-[#00E5FF]" />
          <span>Tide Synth Engine</span>
          <span className="px-1.5 py-0.5 bg-[#00FF88] text-black text-[9px] font-black">NEW</span>
        </button>
      </div>

      {activeSubTab === 'tidesynth' ? (
        <TideSynth onEarnHarmony={onEarnHarmony} />
      ) : (
        <>
          {/* Visual Project Version Timeline */}
          <ProjectTimeline
            versions={versions}
            currentVersionId={currentVersionId}
            onSaveVersion={handleSaveVersion}
            onRevertVersion={handleRevertVersion}
            title="Beat & Track Version History Timeline"
          />

      {/* Main Studio Controls & Transport Bar */}
      <div className="bg-[#111] border border-[#333] p-5 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#050505] p-4 border border-[#333]">
          {/* Transport Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`w-12 h-12 flex items-center justify-center font-black transition-all ${
                isPlaying
                  ? 'bg-[#FFD700] text-black'
                  : 'bg-[#00FF88] text-black'
              }`}
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
            </button>

            <div>
              <input
                type="text"
                value={trackTitle}
                onChange={(e) => setTrackTitle(e.target.value)}
                className="bg-transparent text-sm font-mono font-bold text-[#e0e0e0] border-b border-[#444] focus:outline-none focus:border-[#F27D26] pb-0.5 uppercase"
              />
              <div className="text-[11px] font-mono text-[#888] uppercase mt-0.5">
                {genre} • {bpm} BPM • 16 STEPS
              </div>
            </div>
          </div>

          {/* Tempo Slider & Dub Delay Toggle */}
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3 font-mono">
              <span className="text-xs font-bold text-[#aaa] uppercase">Tempo:</span>
              <input
                type="range"
                min="70"
                max="130"
                value={bpm}
                onChange={(e) => setBpm(Number(e.target.value))}
                className="w-32 accent-[#F27D26]"
              />
              <span className="text-xs font-bold text-[#00E5FF] w-12">{bpm} BPM</span>
            </div>

            <button
              onClick={() => setDubDelay(!dubDelay)}
              className={`px-3 py-1.5 border font-mono text-xs font-bold uppercase flex items-center gap-1.5 transition-all ${
                dubDelay
                  ? 'bg-[#FFD700] text-black border-[#FFD700]'
                  : 'bg-[#111] text-[#666] border-[#333]'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Dub Echo Delay</span>
            </button>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleRandomize}
                className="p-2 bg-[#111] hover:bg-[#1a1a1a] text-[#e0e0e0] border border-[#333] text-xs font-mono font-bold uppercase flex items-center gap-1"
                title="Randomize Pattern"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#00E5FF]" />
                <span>Random</span>
              </button>
              <button
                onClick={handleClearGrid}
                className="p-2 bg-[#111] hover:bg-[#1a1a1a] text-[#aaa] hover:text-[#e0e0e0] border border-[#333] text-xs"
                title="Clear All Steps"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* 16-Step Grid Matrix */}
        <div className="space-y-3 overflow-x-auto pb-2">
          {grid.map((trackRow, trackIdx) => (
            <div key={trackIdx} className="flex items-center gap-3 min-w-[640px]">
              {/* Track Name */}
              <div className="w-32 shrink-0 flex items-center justify-between bg-[#050505] px-3 py-2 border border-[#333]">
                <span className="text-xs font-mono font-bold text-[#aaa] uppercase">{trackNames[trackIdx]}</span>
                <button
                  onClick={() => playSound(trackIdx)}
                  className="p-1 hover:text-[#00E5FF] text-[#666] transition-colors"
                  title="Test Sound"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 16 Steps Buttons */}
              <div className="flex-1 grid grid-cols-16 gap-1.5">
                {trackRow.map((active, stepIdx) => {
                  const isCurrentStep = isPlaying && currentStep === stepIdx;
                  const isBeatQuarter = stepIdx % 4 === 0;

                  return (
                    <button
                      key={stepIdx}
                      onClick={() => toggleCell(trackIdx, stepIdx)}
                      className={`h-10 border transition-all flex items-center justify-center font-mono text-[10px] ${
                        active
                          ? 'bg-[#F27D26] border-[#F27D26] text-black font-black'
                          : isBeatQuarter
                          ? 'bg-[#050505] border-[#444] text-[#888] hover:border-[#666]'
                          : 'bg-[#050505] border-[#222] text-[#444] hover:border-[#444]'
                      } ${isCurrentStep ? 'border-[#00FF88] border-2 scale-105 z-10' : ''}`}
                    >
                      {stepIdx + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Submit to Radio Queue & Stream Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#333]">
          <div className="text-xs font-mono text-[#888] uppercase flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#00E5FF]" />
            <span>SUBMIT FINISHED TRACK TO PORT WAIKATO RADIO QUEUE OR BROADCAST TO NODE STREAM.</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleShareToStream}
              disabled={sharedToStream}
              className={`px-4 py-2.5 text-xs font-black italic uppercase tracking-wider transition-all border flex items-center gap-2 ${
                sharedToStream
                  ? 'bg-[#00FF88] text-black border-[#00FF88]'
                  : 'bg-[#F27D26] hover:bg-[#ff8a38] text-black border-[#F27D26]'
              }`}
            >
              {sharedToStream ? (
                <>
                  <Check className="w-4 h-4 text-black" />
                  <span>Shared to Stream (+50)</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>Share to Community Stream</span>
                </>
              )}
            </button>

            <button
              onClick={handleSubmitToRadio}
              disabled={submitted}
              className={`px-5 py-2.5 text-xs font-black italic uppercase tracking-wider transition-all border flex items-center gap-2 ${
                submitted
                  ? 'bg-[#00FF88] text-black border-[#00FF88]'
                  : 'bg-[#00E5FF] hover:bg-[#33ebff] text-black border-[#00E5FF]'
              }`}
            >
              {submitted ? (
                <>
                  <Check className="w-4 h-4 text-black" />
                  <span>Queued on Radio (+100)</span>
                </>
              ) : (
                <>
                  <Radio className="w-4 h-4" />
                  <span>Submit to Radio Queue (+100)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  );
};

