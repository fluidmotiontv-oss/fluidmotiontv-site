import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Waves, Flame, Headphones, Play, Pause, Radio } from 'lucide-react';

export type AmbientPreset = 'Ocean Waves' | 'Campground Fire' | 'Studio Lo-fi';

interface AmbientSoundscapeProps {
  className?: string;
}

export const AmbientSoundscape: React.FC<AmbientSoundscapeProps> = ({ className = '' }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentPreset, setCurrentPreset] = useState<AmbientPreset>('Ocean Waves');
  const [volume, setVolume] = useState<number>(0.5);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const activeNodesRef = useRef<any[]>([]);
  const intervalRef = useRef<any>(null);

  // Initialize or resume AudioContext
  const getAudioContext = (): AudioContext => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
      const master = audioCtxRef.current.createGain();
      master.gain.value = volume;
      master.connect(audioCtxRef.current.destination);
      masterGainRef.current = master;
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const stopCurrentSoundscape = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    activeNodesRef.current.forEach((node) => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (e) {
        // ignore already stopped nodes
      }
    });
    activeNodesRef.current = [];
  };

  const startSoundscape = (preset: AmbientPreset) => {
    stopCurrentSoundscape();

    const ctx = getAudioContext();
    const master = masterGainRef.current!;

    if (preset === 'Ocean Waves') {
      // 1. Noise Generator for ocean swell
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Pink noise filter approximation
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Low pass filter
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 400;
      filter.Q.value = 3;

      // LFO for wave modulation
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.15; // wave cycle ~6.6 seconds
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 350; // modulate frequency 50Hz -> 750Hz

      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      const waveGain = ctx.createGain();
      waveGain.gain.value = 0.6;

      whiteNoise.connect(filter);
      filter.connect(waveGain);
      waveGain.connect(master);

      whiteNoise.start();
      lfo.start();

      activeNodesRef.current.push(whiteNoise, lfo, lfoGain, filter, waveGain);
    } else if (preset === 'Campground Fire') {
      // 1. Low rumble noise for fire base
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const rumble = ctx.createBufferSource();
      rumble.buffer = noiseBuffer;
      rumble.loop = true;

      const rumbleFilter = ctx.createBiquadFilter();
      rumbleFilter.type = 'lowpass';
      rumbleFilter.frequency.value = 250;

      const rumbleGain = ctx.createGain();
      rumbleGain.gain.value = 0.35;

      rumble.connect(rumbleFilter);
      rumbleFilter.connect(rumbleGain);
      rumbleGain.connect(master);

      rumble.start();
      activeNodesRef.current.push(rumble, rumbleFilter, rumbleGain);

      // 2. Crackling noise bursts
      const triggerPop = () => {
        if (!isPlaying && activeNodesRef.current.length === 0) return;
        try {
          const popGain = ctx.createGain();
          popGain.gain.value = Math.random() * 0.25 + 0.05;

          const popFilter = ctx.createBiquadFilter();
          popFilter.type = 'highpass';
          popFilter.frequency.value = 1200 + Math.random() * 2000;

          const popBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.03, ctx.sampleRate);
          const pData = popBuffer.getChannelData(0);
          for (let i = 0; i < pData.length; i++) {
            pData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.005));
          }

          const popSource = ctx.createBufferSource();
          popSource.buffer = popBuffer;

          popSource.connect(popFilter);
          popFilter.connect(popGain);
          popGain.connect(master);

          popSource.start();
        } catch (e) {
          // ignore context state
        }
      };

      intervalRef.current = setInterval(() => {
        if (Math.random() > 0.3) {
          triggerPop();
        }
      }, 120);
    } else if (preset === 'Studio Lo-fi') {
      // Ambient warm chord (Fmaj7 / Dm9 lo-fi pad)
      const freqs = [174.61, 220.00, 261.63, 329.63]; // F3, A3, C4, E4
      freqs.forEach((freq) => {
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.value = freq;

        const padFilter = ctx.createBiquadFilter();
        padFilter.type = 'lowpass';
        padFilter.frequency.value = 450;

        const padGain = ctx.createGain();
        padGain.gain.value = 0.08;

        // Subtle slow tremolo
        const tremolo = ctx.createOscillator();
        tremolo.frequency.value = 0.2 + Math.random() * 0.1;
        const tremoloGain = ctx.createGain();
        tremoloGain.gain.value = 0.02;

        tremolo.connect(tremoloGain);
        tremoloGain.connect(padGain.gain);

        osc.connect(padFilter);
        padFilter.connect(padGain);
        padGain.connect(master);

        osc.start();
        tremolo.start();

        activeNodesRef.current.push(osc, padFilter, padGain, tremolo, tremoloGain);
      });

      // Vinyl warmth noise layer
      const bufSize = ctx.sampleRate * 2;
      const vBuffer = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const vData = vBuffer.getChannelData(0);
      for (let i = 0; i < bufSize; i++) {
        vData[i] = (Math.random() * 2 - 1) * 0.02;
      }
      const vinyl = ctx.createBufferSource();
      vinyl.buffer = vBuffer;
      vinyl.loop = true;

      const vFilter = ctx.createBiquadFilter();
      vFilter.type = 'bandpass';
      vFilter.frequency.value = 1500;
      vFilter.Q.value = 1.0;

      const vGain = ctx.createGain();
      vGain.gain.value = 0.15;

      vinyl.connect(vFilter);
      vFilter.connect(vGain);
      vGain.connect(master);

      vinyl.start();
      activeNodesRef.current.push(vinyl, vFilter, vGain);
    }
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      stopCurrentSoundscape();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      startSoundscape(currentPreset);
    }
  };

  const handleChangePreset = (preset: AmbientPreset) => {
    setCurrentPreset(preset);
    if (isPlaying) {
      startSoundscape(preset);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (masterGainRef.current) {
      masterGainRef.current.gain.value = newVol;
    }
  };

  useEffect(() => {
    return () => {
      stopCurrentSoundscape();
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  return (
    <div className={`bg-[#050505] border border-[#333] p-3 text-xs font-mono text-[#e0e0e0] flex flex-col md:flex-row items-center justify-between gap-4 ${className}`}>
      {/* Title & Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleTogglePlay}
          className={`w-9 h-9 border flex items-center justify-center transition-all ${
            isPlaying
              ? 'bg-[#00FF88] text-black border-[#00FF88] shadow-md shadow-[#00FF88]/20'
              : 'bg-[#111] text-[#F27D26] border-[#F27D26] hover:bg-[#F27D26] hover:text-black'
          }`}
          title={isPlaying ? 'Pause Ambient Soundscape' : 'Play Ambient Soundscape'}
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-black" /> : <Play className="w-4 h-4 ml-0.5" />}
        </button>

        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span className="font-bold uppercase tracking-wider text-[#e0e0e0]">
              Coastal Ambient Generator
            </span>
            {isPlaying && (
              <span className="w-2 h-2 rounded-full bg-[#00FF88] animate-ping" />
            )}
          </div>
          <p className="text-[10px] text-[#888] uppercase">
            Port Waikato Soundscape Engine
          </p>
        </div>
      </div>

      {/* Preset Selectors */}
      <div className="flex items-center gap-1.5 bg-[#111] border border-[#333] p-1">
        <button
          onClick={() => handleChangePreset('Ocean Waves')}
          className={`px-3 py-1 text-[10px] font-bold uppercase transition-all flex items-center gap-1.5 ${
            currentPreset === 'Ocean Waves'
              ? 'bg-[#F27D26] text-black font-black'
              : 'text-[#aaa] hover:text-[#e0e0e0] hover:bg-[#222]'
          }`}
        >
          <Waves className="w-3 h-3" />
          <span>Ocean Waves</span>
        </button>

        <button
          onClick={() => handleChangePreset('Campground Fire')}
          className={`px-3 py-1 text-[10px] font-bold uppercase transition-all flex items-center gap-1.5 ${
            currentPreset === 'Campground Fire'
              ? 'bg-[#F27D26] text-black font-black'
              : 'text-[#aaa] hover:text-[#e0e0e0] hover:bg-[#222]'
          }`}
        >
          <Flame className="w-3 h-3" />
          <span>Campground Fire</span>
        </button>

        <button
          onClick={() => handleChangePreset('Studio Lo-fi')}
          className={`px-3 py-1 text-[10px] font-bold uppercase transition-all flex items-center gap-1.5 ${
            currentPreset === 'Studio Lo-fi'
              ? 'bg-[#F27D26] text-black font-black'
              : 'text-[#aaa] hover:text-[#e0e0e0] hover:bg-[#222]'
          }`}
        >
          <Headphones className="w-3 h-3" />
          <span>Studio Lo-fi</span>
        </button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-2.5 bg-[#111] border border-[#333] px-3 py-1.5">
        <button
          onClick={() => handleVolumeChange(volume === 0 ? 0.5 : 0)}
          className="text-[#888] hover:text-[#00E5FF]"
        >
          {volume === 0 ? <VolumeX className="w-4 h-4 text-[#888]" /> : <Volume2 className="w-4 h-4 text-[#00E5FF]" />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
          className="w-20 accent-[#F27D26] bg-[#050505] cursor-pointer"
        />
        <span className="text-[10px] text-[#888] w-7 text-right">
          {Math.round(volume * 100)}%
        </span>
      </div>
    </div>
  );
};
