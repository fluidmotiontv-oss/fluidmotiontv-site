import React, { useState } from 'react';
import { D9ClockState, SurfTelemetry } from '../types';
import { Waves, Wind, Compass, Zap, Activity, Info, ChevronUp, ChevronDown } from 'lucide-react';

interface D9WaveAnimationProps {
  d9State: D9ClockState;
  surfTelemetry?: SurfTelemetry | null;
}

export const D9WaveAnimation: React.FC<D9WaveAnimationProps> = ({ d9State, surfTelemetry }) => {
  const [showTelemetryDetails, setShowTelemetryDetails] = useState<boolean>(false);
  const { d9Hour, hourMinute, isApexWedge, apexType } = d9State;

  // Extract surf condition parameters (with fallback values if telemetry hasn't loaded yet)
  const waveHeight = surfTelemetry?.waveHeight ?? 2.2; // meters
  const wavePeriod = surfTelemetry?.wavePeriod ?? 13.5; // seconds
  const windSpeed = surfTelemetry?.windSpeed ?? 11.5; // knots
  const windDirection = surfTelemetry?.windDirection ?? 75; // degrees
  const isOffshore = surfTelemetry?.isOffshore ?? (windDirection >= 45 && windDirection <= 135);
  const surfScore = surfTelemetry?.surfScore ?? 4;
  const isLive = surfTelemetry?.isLive ?? false;

  // 1. DYNAMIC AMPLITUDE CALCULATION
  // Base height factor relative to standard 2.0m Port Waikato swell benchmark
  const heightFactor = Math.min(Math.max(waveHeight / 2.0, 0.4), 2.2);
  // Minute inside 54m D9 solar hour or Apex boost adds harmonic modulation
  const d9HourModulation = isApexWedge ? 0.35 : (hourMinute / 54) * 0.25;
  // Wind chop factor adds micro-amplitude displacement
  const windChopModulation = Math.min(windSpeed / 30, 0.25);
  
  // Final composite amplitude scale multiplier (0.4x - 2.8x)
  const amplitudeScale = Math.round((heightFactor * (0.85 + d9HourModulation + windChopModulation)) * 100) / 100;

  // 2. DYNAMIC FREQUENCY / SPEED CALCULATION
  // Swell period (e.g. 16s groundswell = sweeping roll; 7s windsea = rapid cycle)
  const periodFactor = Math.min(Math.max(wavePeriod / 12.0, 0.5), 2.0);
  // D9 solar cycle speed modifier (faster during Apex Wedges or peak solar hours)
  const d9SpeedModifier = isApexWedge ? 0.55 : Math.max(0.65, 1.25 - (d9Hour % 14) * 0.04);
  
  // Base loop duration in seconds (shorter = faster wave frequency)
  const baseSpeedSeconds = Math.round(Math.max(3.0, Math.min(20.0, 9.5 * (1 / periodFactor) * d9SpeedModifier)) * 10) / 10;
  const wave2SpeedSeconds = Math.round((baseSpeedSeconds * 1.38) * 10) / 10;
  const wave3SpeedSeconds = Math.round((baseSpeedSeconds * 0.72) * 10) / 10;

  // 3. COLOR PALETTE SHIFT RESPONSIVE TO D9 SOLAR HOUR + SURF QUALITY
  let primaryColor = '#F27D26'; // Default Orange
  let secondaryColor = '#00E5FF'; // Cyan
  let tertiaryColor = '#00FF88'; // Green
  let tidePhaseLabel = 'Mid-Tide Swell';

  if (isApexWedge) {
    primaryColor = '#FFD700'; // Apex Gold
    secondaryColor = '#00E5FF'; // Apex Cyan
    tertiaryColor = '#F27D26';
    tidePhaseLabel = `Apex ${apexType?.toUpperCase()} Standstill`;
  } else if (d9Hour >= 1 && d9Hour <= 6) {
    // Dawn / Early Morning Tide
    primaryColor = '#00E5FF';
    secondaryColor = '#0284c7';
    tertiaryColor = '#00FF88';
    tidePhaseLabel = 'Morning Offshore Rising Tide';
  } else if (d9Hour >= 7 && d9Hour <= 14) {
    // Peak Solar Midday
    primaryColor = '#F27D26';
    secondaryColor = '#FFD700';
    tertiaryColor = '#00E5FF';
    tidePhaseLabel = 'Peak Solar Point Break Glassy Swell';
  } else if (d9Hour >= 15 && d9Hour <= 20) {
    // Sunset / Dusk Wave
    primaryColor = '#F27D26';
    secondaryColor = '#e11d48';
    tertiaryColor = '#FFD700';
    tidePhaseLabel = 'Sunset Point Break Barrel Wave';
  } else {
    // Night Coastal Tide
    primaryColor = '#0284c7';
    secondaryColor = '#00FF88';
    tertiaryColor = '#00E5FF';
    tidePhaseLabel = 'Night Mesh Coastal Harmonic Tide';
  }

  // Enhance transparency/glow if offshore winds groom the wave crest
  const layerOpacity = isOffshore ? 0.65 : 0.45;

  return (
    <div className="fixed bottom-0 left-0 right-0 pointer-events-none z-0 overflow-hidden h-36 sm:h-48 opacity-40 select-none transition-all duration-1000">
      {/* Wave Layer 1 (Background Far Swell Wave) */}
      <div
        className="absolute bottom-0 left-0 w-[200%] h-full transition-all duration-1000"
        style={{
          animation: `wave-flow-1 ${wave2SpeedSeconds}s ease-in-out infinite alternate`,
          transformOrigin: 'bottom center',
          transform: `scaleY(${Math.min(amplitudeScale * 0.85, 2.0)})`,
        }}
      >
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-full"
          style={{ fill: secondaryColor, opacity: layerOpacity * 0.6 }}
        >
          <path d="M0,0 C150,90 350,-40 500,40 C650,120 900,10 1200,60 L1200,120 L0,120 Z" />
        </svg>
      </div>

      {/* Wave Layer 2 (Mid-ground Reactive Swell Wave) */}
      <div
        className="absolute bottom-0 left-0 w-[200%] h-full transition-all duration-1000"
        style={{
          animation: `wave-flow-2 ${wave3SpeedSeconds}s ease-in-out infinite alternate`,
          transformOrigin: 'bottom center',
          transform: `scaleY(${amplitudeScale})`,
        }}
      >
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-full"
          style={{ fill: tertiaryColor, opacity: layerOpacity * 0.75 }}
        >
          <path d="M0,30 C200,-20 400,80 600,20 C800,-30 1000,70 1200,10 L1200,120 L0,120 Z" />
        </svg>
      </div>

      {/* Wave Layer 3 (Foreground Main Crest Wave) */}
      <div
        className="absolute bottom-0 left-0 w-[200%] h-full transition-all duration-1000"
        style={{
          animation: `wave-flow-1 ${baseSpeedSeconds}s ease-in-out infinite alternate`,
          transformOrigin: 'bottom center',
          transform: `scaleY(${Math.min(amplitudeScale * 1.1, 2.4)})`,
        }}
      >
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-full"
          style={{ fill: primaryColor, opacity: layerOpacity }}
        >
          <path d="M0,50 C150,110 350,10 500,70 C650,130 850,20 1200,80 L1200,120 L0,120 Z" />
        </svg>
      </div>

      {/* Glassy Offshore Foam Crest Highlight (Rendered when surf score >= 4 or offshore) */}
      {isOffshore && (
        <div
          className="absolute bottom-0 left-0 w-[200%] h-full transition-all duration-1000"
          style={{
            animation: `wave-flow-2 ${baseSpeedSeconds * 0.9}s ease-in-out infinite alternate`,
            transformOrigin: 'bottom center',
            transform: `scaleY(${amplitudeScale * 1.15})`,
          }}
        >
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="w-full h-full"
            style={{ fill: '#00E5FF', opacity: 0.35 }}
          >
            <path d="M0,48 C150,108 350,8 500,68 C650,128 850,18 1200,78 L1200,82 C850,22 650,132 500,72 C350,12 150,112 0,52 Z" />
          </svg>
        </div>
      )}

      {/* Interactive Cyber-Coastal Real-time Wave Dynamics Telemetry Chip */}
      <div className="absolute bottom-2 left-4 z-10 pointer-events-auto flex flex-col items-start gap-1 font-mono text-[10px] uppercase text-[#e0e0e0] select-text">
        <div className="flex items-center gap-2 bg-[#050505]/95 border border-[#333] hover:border-[#00E5FF] px-3 py-1.5 backdrop-blur-md shadow-2xl transition-colors">
          <Waves className="w-3.5 h-3.5 animate-pulse" style={{ color: primaryColor }} />
          <span className="font-bold text-[#e0e0e0]">
            Fluid Backdrop: <strong style={{ color: primaryColor }}>{tidePhaseLabel}</strong>
          </span>
          <span className="hidden sm:inline-block text-[#888]">|</span>
          <span className="hidden sm:inline-flex items-center gap-1 text-[#00E5FF]">
            <Activity className="w-3 h-3 text-[#00E5FF]" />
            <span>Freq: <strong>{baseSpeedSeconds}s</strong></span>
          </span>
          <span className="hidden sm:inline-block text-[#888]">|</span>
          <span className="hidden sm:inline-flex items-center gap-1 text-[#00FF88]">
            <span>Amp: <strong>{amplitudeScale}x</strong></span>
          </span>

          <button
            onClick={() => setShowTelemetryDetails(!showTelemetryDetails)}
            className="ml-1 text-[#888] hover:text-[#00E5FF] flex items-center gap-0.5"
            title="Toggle Surf Condition Coupling Mechanics"
          >
            {showTelemetryDetails ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
          </button>
        </div>

        {/* Expanded Real-time Telemetry Dynamics Popover Drawer */}
        {showTelemetryDetails && (
          <div className="bg-[#0a0a0a]/95 border border-[#00E5FF]/60 p-2.5 space-y-1.5 text-[10px] text-[#ccc] backdrop-blur-md max-w-xs sm:max-w-md shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#222] pb-1 font-black text-[#00E5FF]">
              <span>Real-Time Surf Condition Coupling</span>
              <span className={isLive ? 'text-[#00FF88]' : 'text-[#FFD700]'}>
                {isLive ? '● Live Telemetry' : '▲ Mesh Cache'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[9.5px]">
              <div>
                <span className="text-[#888]">Swell Height:</span>{' '}
                <strong className="text-[#00E5FF]">{waveHeight}m ({Math.round(waveHeight * 3.28)}ft)</strong>
              </div>
              <div>
                <span className="text-[#888]">Wave Period:</span>{' '}
                <strong className="text-[#00FF88]">{wavePeriod}s interval</strong>
              </div>
              <div>
                <span className="text-[#888]">Wind Velocity:</span>{' '}
                <strong className={isOffshore ? 'text-[#00FF88]' : 'text-[#FFD700]'}>
                  {windSpeed} kts {isOffshore ? '(Offshore)' : ''}
                </strong>
              </div>
              <div>
                <span className="text-[#888]">Calculated Speed:</span>{' '}
                <strong className="text-[#FFD700]">{baseSpeedSeconds}s base loop</strong>
              </div>
            </div>
            <p className="text-[9px] text-[#888] italic pt-1 border-t border-[#1a1a1a]">
              Wave frequency scales with surf interval & D9 clock hour. Wave height directly drives dynamic amplitude height scale.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
