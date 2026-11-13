import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, ChevronDown, ChevronUp, Waves, Upload, Zap, Flame, Compass } from 'lucide-react';
import { soundEngine, RADIO_STATIONS } from '../utils/audio';

interface RadioPlayerProps {
  onNavigateHorizon?: () => void;
}

export const RadioPlayer: React.FC<RadioPlayerProps> = ({ onNavigateHorizon }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeStationId, setActiveStationId] = useState(soundEngine.getActiveStationId());
  const [isExpanded, setIsExpanded] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [customFileName, setCustomFileName] = useState<string | null>(null);
  const [reactiveLevels, setReactiveLevels] = useState({ bass: 0, mid: 0, high: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeStation = RADIO_STATIONS.find(s => s.id === activeStationId) || RADIO_STATIONS[0];
  const displayTitle = customFileName || activeStation.title;

  const handleTogglePlay = () => {
    const playing = soundEngine.togglePlay();
    setIsPlaying(playing);
  };

  const handleSelectStation = (id: string) => {
    setActiveStationId(id);
    setCustomFileName(null);
    soundEngine.setStation(id);
    setIsPlaying(true);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    soundEngine.setVolume(val);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCustomFileName(file.name.replace(/\.[^/.]+$/, ""));
      setActiveStationId('custom_mp3');
      await soundEngine.loadCustomAudioFile(file);
      setIsPlaying(true);
    }
  };

  // Real-time canvas frequency visualizer and reactive meter loop
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dataArray = new Uint8Array(32);

    const render = () => {
      animId = requestAnimationFrame(render);
      const analyser = soundEngine.getAnalyser();

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (analyser && isPlaying) {
        analyser.getByteFrequencyData(dataArray);
        const data = soundEngine.getAudioReactiveData();
        setReactiveLevels({ bass: data.bass, mid: data.mid, high: data.high });
      } else {
        // Idle gentle waveform
        for (let i = 0; i < 16; i++) {
          dataArray[i] = Math.max(8, Math.sin(Date.now() * 0.003 + i * 0.4) * 16 + 18);
        }
      }

      const barWidth = 3;
      const gap = 2;
      const count = 12;

      for (let i = 0; i < count; i++) {
        const val = dataArray[i * 2] || 10;
        const barHeight = Math.max(3, (val / 255) * canvas.height * 0.9);
        const x = i * (barWidth + gap);
        const y = canvas.height - barHeight;

        // Gradient neon color with reactive boost
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
        gradient.addColorStop(0, '#06b6d4');
        gradient.addColorStop(0.5, '#a855f7');
        gradient.addColorStop(1, '#ec4899');

        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth, barHeight);
      }
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  return (
    <div className="fixed top-16 right-4 sm:right-8 z-30 pointer-events-auto">
      <div className="glass-panel-glow rounded-xl border border-white/10 shadow-xl overflow-hidden transition-all duration-300 backdrop-blur-xl">
        {/* Compact Bar Header */}
        <div className="flex items-center gap-2.5 px-3 py-2">
          {/* Audio Visualizer Canvas */}
          <canvas
            ref={canvasRef}
            width={60}
            height={20}
            className="w-14 h-5 opacity-90 rounded shrink-0 bg-black/40 px-1"
          />

          <button
            onClick={handleTogglePlay}
            className="w-7 h-7 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95"
            title={isPlaying ? 'Pause Audio' : 'Play Raw Proof Station'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
          </button>

          <div className="text-left cursor-pointer select-none" onClick={() => setIsExpanded(!isExpanded)}>
            <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest leading-none flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
              <span>Raw Proof Engine</span>
              {isPlaying && (
                <span className="text-[9px] text-pink-400 font-semibold flex items-center gap-0.5">
                  <Flame className="w-2.5 h-2.5 animate-bounce" />
                  <span>Reactive</span>
                </span>
              )}
            </div>
            <div className="text-xs font-semibold text-white truncate max-w-[140px] sm:max-w-[170px] leading-tight mt-0.5">
              {displayTitle}
            </div>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Expand radio station panel"
          >
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Expandable Station Selector & Reactive Controls */}
        {isExpanded && (
          <div className="p-3 pt-1 border-t border-white/10 bg-black/60 space-y-3 animate-fadeIn text-left">
            {/* Audio Reactive Output Meter */}
            <div className="p-2 rounded-lg bg-black/50 border border-white/5 space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase">
                <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-cyan-400" />
                  <span>Plasma & Horizon Response</span>
                </span>
                <span className="text-emerald-400">{Math.round(reactiveLevels.bass * 100)}% Sub</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <div>
                  <div className="text-[9px] font-mono text-slate-400">808 Bass</div>
                  <div className="h-1 bg-slate-800 rounded-full overflow-hidden mt-0.5">
                    <div 
                      className="h-full bg-cyan-400 transition-all duration-75"
                      style={{ width: `${Math.round(reactiveLevels.bass * 100)}%` }} 
                    />
                  </div>
                </div>
                <div>
                  <div className="text-[9px] font-mono text-slate-400">Plasma Mid</div>
                  <div className="h-1 bg-slate-800 rounded-full overflow-hidden mt-0.5">
                    <div 
                      className="h-full bg-pink-400 transition-all duration-75"
                      style={{ width: `${Math.round(reactiveLevels.mid * 100)}%` }} 
                    />
                  </div>
                </div>
                <div>
                  <div className="text-[9px] font-mono text-slate-400">Horizon High</div>
                  <div className="h-1 bg-slate-800 rounded-full overflow-hidden mt-0.5">
                    <div 
                      className="h-full bg-amber-400 transition-all duration-75"
                      style={{ width: `${Math.round(reactiveLevels.high * 100)}%` }} 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Radio Channels */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                Broadcast Audio Streams
              </span>
              <div className="space-y-1">
                {RADIO_STATIONS.map((station) => (
                  <button
                    key={station.id}
                    onClick={() => handleSelectStation(station.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-all flex items-center justify-between cursor-pointer ${
                      activeStationId === station.id && !customFileName
                        ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/40 font-medium'
                        : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <div>
                      <div className="font-medium text-white flex items-center gap-1.5">
                        {station.id === 'raw_proof' && <Flame className="w-3 h-3 text-pink-400" />}
                        <span>{station.title}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">{station.genre} · {station.bpm} BPM</div>
                    </div>
                    {activeStationId === station.id && isPlaying && !customFileName && (
                      <Waves className="w-3.5 h-3.5 text-cyan-400 animate-pulse shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom MP3 File Uploader */}
            <div className="pt-1 border-t border-white/5">
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-1.5 px-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300 hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-white/10"
              >
                <Upload className="w-3 h-3 text-cyan-400" />
                <span>Load Custom Raw Proof MP3</span>
              </button>
            </div>

            {/* Volume slider */}
            <div className="flex items-center gap-2 pt-1 border-t border-white/5">
              {volume === 0 ? (
                <VolumeX className="w-3 h-3 text-slate-500" />
              ) : (
                <Volume2 className="w-3 h-3 text-cyan-400" />
              )}
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={handleVolumeChange}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
