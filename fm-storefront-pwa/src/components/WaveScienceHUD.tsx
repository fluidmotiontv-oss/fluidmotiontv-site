import React, { useState } from 'react';
import { 
  Waves, 
  Compass, 
  Gauge, 
  Zap, 
  Activity, 
  Sliders, 
  Eye, 
  ArrowLeft, 
  Info, 
  ChevronDown, 
  ChevronUp,
  RotateCcw
} from 'lucide-react';
import { WaveSpotPreset, WaveTelemetry, WaveDirection, WaveCameraAngle } from '../types/wave';
import { WAVE_SPOTS, calculateWaveTelemetry } from '../data/waveSpots';
import { soundEngine } from '../utils/audio';

interface WaveScienceHUDProps {
  currentSpot: WaveSpotPreset;
  onSelectSpot: (spot: WaveSpotPreset) => void;
  waveHeightFt: number;
  onChangeHeight: (height: number) => void;
  direction: WaveDirection;
  onToggleDirection: (dir: WaveDirection) => void;
  cameraAngle: WaveCameraAngle;
  onChangeCameraAngle: (angle: WaveCameraAngle) => void;
  onExitWaveLab: () => void;
}

export const WaveScienceHUD: React.FC<WaveScienceHUDProps> = ({
  currentSpot,
  onSelectSpot,
  waveHeightFt,
  onChangeHeight,
  direction,
  onToggleDirection,
  cameraAngle,
  onChangeCameraAngle,
  onExitWaveLab
}) => {
  const [showScienceDetails, setShowScienceDetails] = useState(false);
  const telemetry: WaveTelemetry = calculateWaveTelemetry(waveHeightFt, currentSpot, direction);

  const handleSpotChange = (spot: WaveSpotPreset) => {
    onSelectSpot(spot);
    onChangeHeight(spot.defaultHeightFt);
    onToggleDirection(spot.direction);
    soundEngine.playClick(580);
  };

  const handleHeightChange = (val: number) => {
    onChangeHeight(val);
  };

  const handleDirSwitch = (dir: WaveDirection) => {
    onToggleDirection(dir);
    soundEngine.playClick(640);
  };

  const handleCameraSwitch = (angle: WaveCameraAngle) => {
    onChangeCameraAngle(angle);
    soundEngine.playClick(520);
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-30 flex flex-col justify-between p-4 sm:p-6 select-none font-sans">
      {/* TOP BAR: Header & Return */}
      <div className="flex items-center justify-between gap-4 pointer-events-auto">
        <div className="flex items-center gap-3">
          <button
            onClick={onExitWaveLab}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl glass-panel hover:bg-white/10 text-slate-300 hover:text-white transition-all text-xs font-mono border border-white/15 cursor-pointer shadow-lg"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400" />
            <span>Storefront Hall</span>
          </button>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 shadow-md">
            <Waves className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-wider uppercase">
              Hydrodynamics Wave Chamber
            </span>
          </div>
        </div>

        {/* Camera Perspectives */}
        <div className="flex items-center gap-1.5 bg-black/65 backdrop-blur-md p-1 rounded-xl border border-white/15 shadow-xl">
          <button
            onClick={() => handleCameraSwitch('gantry')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
              cameraAngle === 'gantry'
                ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400/50 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Gantry View</span>
          </button>

          <button
            onClick={() => handleCameraSwitch('barrel')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
              cameraAngle === 'barrel'
                ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/50 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>Inside Barrel</span>
          </button>

          <button
            onClick={() => handleCameraSwitch('shoulder')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
              cameraAngle === 'shoulder'
                ? 'bg-purple-500/30 text-purple-200 border border-purple-400/50 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Water Level</span>
          </button>
        </div>
      </div>

      {/* BOTTOM CONTROL & TELEMETRY CONSOLE */}
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-3 pointer-events-auto">
        {/* Expandable Deep Science Details Card */}
        {showScienceDetails && (
          <div className="glass-panel-glow rounded-2xl p-5 border border-cyan-500/30 animate-fadeIn text-xs text-slate-300">
            <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
              <div className="flex items-center gap-2 text-cyan-300 font-mono font-semibold">
                <Info className="w-4 h-4 text-cyan-400" />
                <span>{currentSpot.name} · Fluid Dynamics & Bathymetry Dossier</span>
              </div>
              <span className="font-mono text-[11px] text-slate-400">{currentSpot.location}</span>
            </div>

            <p className="leading-relaxed mb-3 text-slate-200">
              {currentSpot.description}
            </p>

            <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/25 mb-3 font-mono text-[11px] leading-relaxed text-cyan-200">
              <span className="text-cyan-400 font-bold">Hydrodynamic Mechanics: </span>
              {currentSpot.hydrodynamicNotes}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
              <div className="p-2 rounded-lg bg-black/40 border border-white/10">
                <div className="text-[10px] text-slate-400">Reef Bathymetry</div>
                <div className="text-xs text-white font-bold mt-0.5">{currentSpot.reefDepthM}m Ledge</div>
              </div>
              <div className="p-2 rounded-lg bg-black/40 border border-white/10">
                <div className="text-[10px] text-slate-400">Swell Period</div>
                <div className="text-xs text-cyan-300 font-bold mt-0.5">{currentSpot.periodSeconds}s Groundswell</div>
              </div>
              <div className="p-2 rounded-lg bg-black/40 border border-white/10">
                <div className="text-[10px] text-slate-400">Crest Vorticity</div>
                <div className="text-xs text-emerald-300 font-bold mt-0.5">{telemetry.vorticityRadM} rad/m</div>
              </div>
              <div className="p-2 rounded-lg bg-black/40 border border-white/10">
                <div className="text-[10px] text-slate-400">Hydraulic Spit</div>
                <div className="text-xs text-amber-300 font-bold mt-0.5">{telemetry.spitPressurePsi} psi</div>
              </div>
            </div>
          </div>
        )}

        {/* MAIN HUD CONSOLE */}
        <div className="glass-panel-glow rounded-2xl p-4 sm:p-5 border border-cyan-500/35 shadow-2xl backdrop-blur-xl">
          {/* Row 1: Spot Presets Selector */}
          <div className="flex items-center justify-between gap-3 overflow-x-auto pb-3 mb-3 border-b border-white/10 no-scrollbar">
            <div className="flex items-center gap-2">
              {WAVE_SPOTS.map((spot) => {
                const isSelected = spot.id === currentSpot.id;
                return (
                  <button
                    key={spot.id}
                    onClick={() => handleSpotChange(spot)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all whitespace-nowrap cursor-pointer border ${
                      isSelected
                        ? 'bg-cyan-500/25 border-cyan-400 text-white shadow-md shadow-cyan-500/20'
                        : 'bg-black/40 border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/25'
                    }`}
                  >
                    <span className="font-bold">{spot.name}</span>
                    <span className="text-[10px] opacity-75 ml-1.5">
                      ({spot.direction === 'left' ? 'Left' : 'Right'} · {spot.defaultHeightFt}ft)
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setShowScienceDetails(!showScienceDetails)}
              className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-mono cursor-pointer whitespace-nowrap ml-auto"
            >
              <span>{showScienceDetails ? 'Hide Science' : 'Science Dossier'}</span>
              {showScienceDetails ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Row 2: Sliders & Quick Controls */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Wave Height Slider (Controls wave size from kids to monsters) */}
            <div className="md:col-span-5 flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                  Wave Face Scale:
                </span>
                <span className="text-cyan-300 font-bold">
                  {waveHeightFt.toFixed(1)} ft <span className="text-slate-400 font-normal">({telemetry.faceHeightM} m)</span>
                </span>
              </div>
              <input
                type="range"
                min="2.0"
                max="30.0"
                step="0.5"
                value={waveHeightFt}
                onChange={(e) => handleHeightChange(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>Kids (2ft)</span>
                <span>Medium (8ft)</span>
                <span>Heavy (16ft)</span>
                <span>Monster (30ft)</span>
              </div>
            </div>

            {/* Barreling Direction Toggle (Left vs Right Hand) */}
            <div className="md:col-span-3 flex flex-col gap-1.5">
              <span className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-emerald-400" />
                Peel Direction:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleDirSwitch('left')}
                  className={`py-1.5 px-3 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer border ${
                    direction === 'left'
                      ? 'bg-cyan-500/30 border-cyan-400 text-cyan-200'
                      : 'bg-black/30 border-white/10 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  ◀ Left Hand
                </button>
                <button
                  onClick={() => handleDirSwitch('right')}
                  className={`py-1.5 px-3 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer border ${
                    direction === 'right'
                      ? 'bg-amber-500/30 border-amber-400 text-amber-200'
                      : 'bg-black/30 border-white/10 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Right Hand ▶
                </button>
              </div>
            </div>

            {/* Telemetry Quick Badges */}
            <div className="md:col-span-4 grid grid-cols-3 gap-2 text-center font-mono">
              <div className="p-2 rounded-xl bg-black/40 border border-white/10">
                <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                  <Gauge className="w-3 h-3 text-cyan-400" />
                  Speed
                </div>
                <div className="text-xs font-bold text-cyan-300 mt-0.5">
                  {telemetry.celerityKnots} <span className="text-[9px] text-slate-400">kts</span>
                </div>
              </div>

              <div className="p-2 rounded-xl bg-black/40 border border-white/10">
                <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                  <Zap className="w-3 h-3 text-emerald-400" />
                  Energy
                </div>
                <div className="text-xs font-bold text-emerald-300 mt-0.5">
                  {telemetry.energyDensityKjM2} <span className="text-[9px] text-slate-400">kJ/m²</span>
                </div>
              </div>

              <div className="p-2 rounded-xl bg-black/40 border border-white/10">
                <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                  <Activity className="w-3 h-3 text-pink-400" />
                  Shoaling
                </div>
                <div className="text-xs font-bold text-pink-300 mt-0.5">
                  {telemetry.shoalingIndex} <span className="text-[9px] text-slate-400">H/d</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
