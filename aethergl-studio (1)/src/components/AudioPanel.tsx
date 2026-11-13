import React, { useRef, useEffect, useState } from 'react';
import { Music, Play, Pause, Volume2, Upload, AlertCircle, Sparkles, Disc, Radio } from 'lucide-react';
import { AudioEngine, TrackAsset } from '../utils/audio';

interface AudioPanelProps {
  audioEngine: AudioEngine;
  onTrackChange: (trackId: string | null) => void;
  bassLevel: number;
  midsLevel: number;
  trebleLevel: number;
  frequencyData: Uint8Array;
}

export default function AudioPanel({
  audioEngine,
  onTrackChange,
  bassLevel,
  midsLevel,
  trebleLevel,
  frequencyData,
}: AudioPanelProps) {
  const [tracks, setTracks] = useState<TrackAsset[]>(audioEngine.tracks);
  const [activeId, setActiveId] = useState<string | null>(audioEngine.activeTrackId);
  const [volume, setVolume] = useState(0.3);
  const [uploadError, setUploadError] = useState('');
  const [ingesting, setIngesting] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync track list state on mounts
  useEffect(() => {
    setTracks([...audioEngine.tracks]);
    setActiveId(audioEngine.activeTrackId);
  }, [audioEngine.tracks.length, audioEngine.activeTrackId]);

  // Sync volume level
  const handleVolumeChange = (v: number) => {
    setVolume(v);
    audioEngine.setVolume(v);
  };

  // Play/Stop toggle
  const togglePlay = (id: string) => {
    if (activeId === id) {
      audioEngine.stopActiveTrack();
      setActiveId(null);
      onTrackChange(null);
    } else {
      audioEngine.playTrack(id);
      setActiveId(id);
      onTrackChange(id);
    }
    setTracks([...audioEngine.tracks]);
  };

  // MP3 file drag & drop or upload ingester
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploadError('');
    setIngesting(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.match(/audio\/mp3/) && !file.name.endsWith('.mp3')) {
          setUploadError('Only MP3 files are supported.');
          continue;
        }

        await audioEngine.ingestMp3(file);
      }
      setTracks([...audioEngine.tracks]);
    } catch (err: any) {
      console.error(err);
      setUploadError(err.message || 'Error decoding audio file.');
    } finally {
      setIngesting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Custom 2D Frequency Spectrogram canvas animation inside the UI panel
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawSpec = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(11, 12, 16, 0.4)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = canvas.width / 40;
      const spacing = 1.5;

      // Draw 40 spectral bars
      for (let i = 0; i < 40; i++) {
        const sampleIdx = Math.floor(i * (frequencyData.length / 40));
        const val = frequencyData[sampleIdx] || 0;
        const norm = val / 255;
        const barHeight = norm * (canvas.height - 10);

        // Smooth neon gradients
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - barHeight);
        gradient.addColorStop(0, '#0055ff');
        gradient.addColorStop(0.5, '#00f3ff');
        gradient.addColorStop(1, '#a100ff');

        ctx.fillStyle = gradient;
        ctx.fillRect(
          i * (barWidth + spacing),
          canvas.height - barHeight,
          barWidth,
          barHeight
        );
      }

      animId = requestAnimationFrame(drawSpec);
    };

    drawSpec();
    return () => cancelAnimationFrame(animId);
  }, [frequencyData]);

  return (
    <div className="flex flex-col h-full bg-[#111218] border border-[#1f212a] rounded-xl overflow-hidden">
      {/* Title */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0e0f14] border-b border-[#1f212a]">
        <div className="flex items-center gap-2">
          <Music className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-300 font-mono">
            Audio Asset Ingest & DSP
          </h2>
        </div>
        {activeId && (
          <span className="text-[9px] bg-cyan-500/10 text-cyan-400 font-mono px-2 py-0.5 rounded border border-cyan-500/10 flex items-center gap-1 animate-pulse">
            <Radio className="w-3 h-3" /> LIVE FEED
          </span>
        )}
      </div>

      {/* Real-time Spectra Spectrogram visualizer */}
      <div className="p-3 border-b border-[#1f212a] bg-[#0c0d12]">
        <canvas
          ref={canvasRef}
          width={300}
          height={64}
          className="w-full h-16 rounded bg-black/40 block border border-[#1f212a]/30"
        />
        
        {/* Dynamic sub-band volume meters */}
        <div className="grid grid-cols-3 gap-2 mt-3 font-mono text-[9px] text-gray-500">
          <div>
            <div className="flex justify-between mb-1">
              <span>BASS</span>
              <span className="text-cyan-400 tabular-nums">{(bassLevel * 100).toFixed(0)}%</span>
            </div>
            <div className="w-full h-1 bg-black/60 rounded overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-75"
                style={{ width: `${Math.min(100, bassLevel * 100)}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span>MIDS</span>
              <span className="text-cyan-400 tabular-nums">{(midsLevel * 100).toFixed(0)}%</span>
            </div>
            <div className="w-full h-1 bg-black/60 rounded overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-75"
                style={{ width: `${Math.min(100, midsLevel * 100)}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span>TREBLE</span>
              <span className="text-cyan-400 tabular-nums">{(trebleLevel * 100).toFixed(0)}%</span>
            </div>
            <div className="w-full h-1 bg-black/60 rounded overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-75"
                style={{ width: `${Math.min(100, trebleLevel * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Global Gain / Volume control */}
      <div className="p-3 border-b border-[#1f212a] bg-[#14151e]/40 flex items-center justify-between gap-4 font-mono text-xs">
        <span className="text-[10px] text-gray-500 font-semibold uppercase flex items-center gap-1 shrink-0">
          <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> Output Volume
        </span>
        <input
          type="range"
          min="0.0"
          max="1.0"
          step="0.01"
          value={volume}
          onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
          className="flex-1 accent-cyan-400 h-1 bg-black/60 rounded"
        />
        <span className="text-[10px] text-cyan-400 font-bold w-8 text-right tabular-nums">
          {Math.round(volume * 100)}%
        </span>
      </div>

      {/* Audio upload drop zone */}
      <div className="p-3 border-b border-[#1f212a] bg-[#14151e]/20 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-mono text-gray-500 font-semibold uppercase">
            Ingest Local Audio Files
          </span>
          {ingesting && (
            <span className="text-[9px] font-mono text-cyan-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 animate-spin" /> Ingesting MP3...
            </span>
          )}
        </div>
        
        <label className="border border-dashed border-[#232635] hover:border-cyan-500/40 hover:bg-cyan-500/5 rounded-lg p-3 text-center block cursor-pointer transition-all">
          <input
            ref={fileInputRef}
            type="file"
            accept=".mp3,audio/mp3"
            multiple
            onChange={handleFileUpload}
            disabled={ingesting}
            className="hidden"
          />
          <Upload className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
          <span className="text-[10px] font-mono text-gray-400 block font-semibold">
            UPLOAD MULTIPLE MP3s
          </span>
          <span className="text-[9px] font-mono text-gray-600 block mt-0.5">
            Drag-and-drop or tap to load audio sources
          </span>
        </label>
        {uploadError && <p className="text-[10px] text-red-400 font-mono flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5 shrink-0" />{uploadError}</p>}
      </div>

      {/* Tracks Selection Playlist */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 bg-[#12131a]">
        {tracks.map((t) => {
          const isPlaying = t.id === activeId;
          return (
            <div
              key={t.id}
              onClick={() => togglePlay(t.id)}
              className={`p-2.5 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                isPlaying
                  ? 'bg-cyan-950/20 border-cyan-500/40 text-cyan-300 shadow-inner'
                  : 'bg-[#171822]/60 border-[#1f212a] hover:border-[#232635] hover:bg-[#1a1b28]/60 text-gray-300'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {t.type === 'procedural' ? (
                  <Radio className={`w-3.5 h-3.5 shrink-0 ${isPlaying ? 'text-cyan-400' : 'text-gray-500'}`} />
                ) : (
                  <Disc className={`w-3.5 h-3.5 shrink-0 ${isPlaying ? 'text-cyan-400 animate-spin' : 'text-gray-500'}`} />
                )}
                <div className="truncate">
                  <span className="text-[11px] font-mono font-medium truncate block">
                    {t.name}
                  </span>
                  <span className="text-[9px] text-gray-600 font-mono block">
                    {t.type === 'procedural' ? 'Procedural Audio Synth' : 'Local MP3 Upload'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                className={`p-1.5 rounded-full shrink-0 ${
                  isPlaying ? 'bg-cyan-500/20 text-cyan-300' : 'bg-black/40 text-gray-400 hover:text-white'
                }`}
              >
                {isPlaying ? <Pause className="w-3 h-3 fill-cyan-300" /> : <Play className="w-3 h-3 fill-gray-400" />}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
