/**
 * HoloCraft 3D - MP3 Audio Ingester & Real-Time FFT Analyser
 */

import React, { useRef, useState, useEffect } from 'react';
import { Music, Upload, Play, Square, Volume2, VolumeX, Sparkles, Activity } from 'lucide-react';
import { hologramSound } from '../audio/HologramSoundEngine';

interface AudioIngestPlayerProps {
  onAudioMetricsUpdate: (metrics: { bass: number; mid: number; treble: number; overall: number }) => void;
}

export const AudioIngestPlayer: React.FC<AudioIngestPlayerProps> = ({ onAudioMetricsUpdate }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [fileName, setFileName] = useState<string>('No MP3 loaded (Using 432Hz Synth)');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.8);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Setup Web Audio Analyser when audio element is ready
  const setupAudioGraph = (audioEl: HTMLAudioElement) => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtxClass();
        audioCtxRef.current = ctx;

        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.8;
        analyserRef.current = analyser;

        const source = ctx.createMediaElementSource(audioEl);
        source.connect(analyser);
        analyser.connect(ctx.destination);
        sourceNodeRef.current = source;
      } else if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      // Start analysis loop
      const bufferLength = analyserRef.current!.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const analyze = () => {
        if (analyserRef.current) {
          analyserRef.current.getByteFrequencyData(dataArray);
          let bassSum = 0, midSum = 0, trebleSum = 0, totalSum = 0;
          const bassEnd = Math.floor(bufferLength * 0.15);
          const midEnd = Math.floor(bufferLength * 0.5);

          for (let i = 0; i < bufferLength; i++) {
            const val = dataArray[i] / 255.0;
            totalSum += val;
            if (i < bassEnd) bassSum += val;
            else if (i < midEnd) midSum += val;
            else trebleSum += val;
          }

          const bass = bassSum / bassEnd;
          const mid = midSum / (midEnd - bassEnd);
          const treble = trebleSum / (bufferLength - midEnd);
          const overall = totalSum / bufferLength;

          onAudioMetricsUpdate({ bass, mid, treble, overall });
        }
        animFrameIdRef.current = requestAnimationFrame(analyze);
      };

      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = requestAnimationFrame(analyze);
    } catch (e) {
      console.warn('Audio graph setup error:', e);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const fileUrl = URL.createObjectURL(file);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = fileUrl;
      audioRef.current.load();
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setupAudioGraph(audioRef.current!);
      }).catch(err => console.warn('Autoplay prevented:', err));
    }
    hologramSound.triggerHologramCaptureChime();
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !audio.src) {
      // Trigger file dialog if no file loaded
      fileInputRef.current?.click();
      return;
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
        setupAudioGraph(audio);
      }).catch(() => {});
    }
    hologramSound.triggerLaserScanSound();
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
  };

  return (
    <div className="flex flex-col bg-slate-950/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 gap-3 font-mono text-xs shadow-xl">
      <audio ref={audioRef} loop />
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/mp3,audio/wav,audio/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-400/30">
            <Music className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h4 className="font-bold text-white uppercase text-xs">MP3 AUDIO INGESTER & BEAT SYNC</h4>
            <span className="text-[10px] text-slate-400 truncate max-w-[200px] block">
              {fileName}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all flex items-center gap-1.5 shadow-md"
          >
            {isPlaying ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isPlaying ? 'Pause' : audioRef.current?.src ? 'Play MP3' : 'Upload MP3'}</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5 text-emerald-400" />
            <span>Browse</span>
          </button>
        </div>
      </div>

      {/* Volume & Audio Reactivity Meter */}
      <div className="flex items-center justify-between gap-4 pt-1">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (audioRef.current) audioRef.current.muted = !isMuted;
              setIsMuted(!isMuted);
            }}
            className="p-1 text-slate-400 hover:text-white"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            className="w-24 accent-emerald-400 cursor-pointer"
          />
        </div>

        <div className="flex items-center gap-1.5 text-[10px] text-emerald-400">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span>FFT Spectrum Reactive: ACTIVE</span>
        </div>
      </div>
    </div>
  );
};
