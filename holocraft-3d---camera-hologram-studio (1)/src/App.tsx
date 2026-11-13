/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Camera, 
  Sparkles, 
  Box, 
  Layers, 
  Sliders, 
  Download, 
  Brain, 
  RefreshCw, 
  Volume2, 
  VolumeX, 
  Eye, 
  Zap, 
  Compass, 
  Maximize2,
  ChevronRight,
  Info
} from 'lucide-react';
import { TopBar } from './components/TopBar';
import { Hologram3DViewport } from './components/Hologram3DViewport';
import { CameraCaptureStudio } from './components/CameraCaptureStudio';
import { DepthNormalInspector } from './components/DepthNormalInspector';
import { GlslRaymarchStudio } from './components/GlslRaymarchStudio';
import { ShaderTunerDrawer } from './components/ShaderTunerDrawer';
import { AssetExportDrawer } from './components/AssetExportDrawer';
import { AiVision3DModal } from './components/AiVision3DModal';
import { CuratedSamplesModal } from './components/CuratedSamplesModal';
import { AudioIngestPlayer } from './components/AudioIngestPlayer';
import { HologramGameStage } from './components/HologramGameStage';
import { SocialMediaIngestModal } from './components/SocialMediaIngestModal';
import { 
  CameraSnapshot, 
  HologramParameters, 
  ViewportMode, 
  Ai3DAnalysis, 
  HologramColorTheme 
} from './types/hologram';
import { generateDepthAndGeometryFromImage, ProcessedDepthData } from './utils/depthEstimator';
import { CURATED_SAMPLES, generateSampleDataUrl } from './data/sampleAssets';
import { hologramSound } from './audio/HologramSoundEngine';

export default function App() {
  // Navigation tabs: 'viewport' | 'camera' | 'depth' | 'shader'
  const [activeTab, setActiveTab] = useState<'viewport' | 'camera' | 'depth' | 'shader'>('viewport');
  const [viewportMode, setViewportMode] = useState<ViewportMode>('pointcloud');

  // Captured snapshot and 3D depth geometry
  const [currentSnapshot, setCurrentSnapshot] = useState<CameraSnapshot | null>(null);
  const [depthData, setDepthData] = useState<ProcessedDepthData | null>(null);
  const [isProcessingDepth, setIsProcessingDepth] = useState<boolean>(false);

  // Holographic 3D shader parameters
  const [hologramParams, setHologramParams] = useState<HologramParameters>({
    pointDensity: 110,
    displacementScale: 1.35,
    particleSize: 3.5,
    scanlineSpeed: 1.2,
    scanlineDensity: 16,
    flickerIntensity: 0.35,
    bloomGlow: 1.5,
    colorTheme: 'cyan_neon',
    customColorHex: '#06b6d4',
    wireframeOnly: false,
    autoRotate: true,
    rotationSpeed: 1.0,
    noiseTurbulence: 0.2,
    laserBeamIntensity: 1.0,
    fresnelPower: 2.5,
    depthInvert: false,
    depthThreshold: 0.05,
  });

  // Modal / Drawer visibility
  const [isTunerOpen, setIsTunerOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isAiVisionOpen, setIsAiVisionOpen] = useState<boolean>(false);
  const [isSamplesOpen, setIsSamplesOpen] = useState<boolean>(false);
  const [isGameOpen, setIsGameOpen] = useState<boolean>(false);
  const [isSocialOpen, setIsSocialOpen] = useState<boolean>(false);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(true);
  const [isPowerSongPlaying, setIsPowerSongPlaying] = useState<boolean>(false);

  // Process image into 3D point cloud and depth map
  const processImageTo3D = useCallback((snapshot: CameraSnapshot, params: HologramParameters) => {
    setIsProcessingDepth(true);
    const img = new Image();
    img.onload = () => {
      try {
        const processed = generateDepthAndGeometryFromImage(
          img,
          params.pointDensity,
          params.displacementScale,
          params.depthInvert,
          params.depthThreshold
        );

        snapshot.depthMapDataUrl = processed.depthMapDataUrl;
        snapshot.normalMapDataUrl = processed.normalMapDataUrl;

        setDepthData(processed);
        setCurrentSnapshot(snapshot);
      } catch (err) {
        console.error('Error generating depth and 3D geometry:', err);
      } finally {
        setIsProcessingDepth(false);
      }
    };
    img.src = snapshot.dataUrl;
  }, []);

  // Initialize with the Cyber Dragon Sovereign 3D sample on first load
  useEffect(() => {
    const dataUrl = generateSampleDataUrl('cyber_dragon');
    const initialSnapshot: CameraSnapshot = {
      id: 'init_cyber_dragon',
      title: 'Cyber Dragon Sovereign',
      timestamp: new Date().toISOString(),
      dataUrl,
      width: 640,
      height: 480,
    };
    processImageTo3D(initialSnapshot, hologramParams);
  }, []);

  // Instant Selfie Route: load Human Cyborg Avatar (face) and start Raw Power song
  const handleInstantSelfie = () => {
    const selfieSample = CURATED_SAMPLES[4]; // human_cyborg_avatar
    const dataUrl = generateSampleDataUrl(selfieSample.type);
    const selfieSnapshot: CameraSnapshot = {
      id: `selfie_${Date.now()}`,
      title: 'Instant Selfie Hologram Face',
      timestamp: new Date().toISOString(),
      dataUrl,
      width: 640,
      height: 480,
    };

    const updatedParams = {
      ...hologramParams,
      colorTheme: selfieSample.theme as HologramColorTheme,
      displacementScale: selfieSample.displacement,
      noiseTurbulence: 0.4, // audio-reactive vibration
    };
    setHologramParams(updatedParams);
    processImageTo3D(selfieSnapshot, updatedParams);
    setActiveTab('viewport');

    if (!isPowerSongPlaying) {
      const active = hologramSound.togglePowerSong();
      setIsPowerSongPlaying(active);
      setIsAudioMuted(false);
    }
  };

  const handleTogglePowerSong = () => {
    const active = hologramSound.togglePowerSong();
    setIsPowerSongPlaying(active);
    setIsAudioMuted(!active);
  };

  // Audio frequency reactive update
  const handleAudioMetricsUpdate = (metrics: { bass: number; mid: number; treble: number; overall: number }) => {
    if (metrics.overall > 0.05) {
      // Modulate turbulence dynamically to audio beat
      setHologramParams(prev => ({
        ...prev,
        noiseTurbulence: Math.min(1.2, 0.15 + metrics.bass * 1.5),
        bloomGlow: Math.min(2.5, 1.2 + metrics.overall * 1.8),
      }));
    }
  };

  // Re-process depth when pointDensity or displacement changes
  const handleUpdateParams = (newParams: Partial<HologramParameters>) => {
    const updated = { ...hologramParams, ...newParams };
    setHologramParams(updated);

    if (
      currentSnapshot &&
      (newParams.pointDensity !== undefined ||
       newParams.displacementScale !== undefined ||
       newParams.depthInvert !== undefined ||
       newParams.depthThreshold !== undefined)
    ) {
      processImageTo3D(currentSnapshot, updated);
    }
  };

  // Handle capture from camera
  const handleCaptureSnapshot = (snapshot: CameraSnapshot) => {
    processImageTo3D(snapshot, hologramParams);
    setActiveTab('viewport');
  };

  // Handle AI analysis application
  const handleApplyAiAnalysis = (analysis: Ai3DAnalysis) => {
    if (currentSnapshot) {
      currentSnapshot.aiAnalysis = analysis;
    }
    handleUpdateParams({
      colorTheme: analysis.suggestedTheme,
      displacementScale: analysis.recommendedDisplacement,
    });
  };

  // Toggle 432Hz Sound Engine
  const handleToggleAudio = () => {
    const muted = hologramSound.toggleMute();
    setIsAudioMuted(muted);
  };

  return (
    <div className="min-h-screen bg-[#03060c] text-slate-100 flex flex-col font-sans select-none antialiased">
      {/* 1. Top Navigation Bar (3-Zone Contract) */}
      <TopBar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenTuner={() => setIsTunerOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenAiVision={() => setIsAiVisionOpen(true)}
        onOpenSamples={() => setIsSamplesOpen(true)}
        onOpenGame={() => setIsGameOpen(true)}
        onOpenSocial={() => setIsSocialOpen(true)}
        isAudioMuted={isAudioMuted}
        onToggleAudio={handleToggleAudio}
        onInstantSelfie={handleInstantSelfie}
        isPowerSongPlaying={isPowerSongPlaying}
        onTogglePowerSong={handleTogglePowerSong}
      />

      {/* 2. Main Content Workspace */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live 3D Hologram Viewport Stage (8 Cols) */}
        <section className="lg:col-span-8 flex flex-col gap-4 min-h-[560px]">
          {/* Active Viewport Tab Routing */}
          {activeTab === 'viewport' && (
            <div className="flex-1 flex flex-col gap-4">
              {/* 3D Hologram Canvas Stage */}
              <div className="flex-1 min-h-[500px]">
                <Hologram3DViewport
                  depthData={depthData}
                  params={hologramParams}
                  onUpdateParams={handleUpdateParams}
                  activeMode={viewportMode}
                  onSelectMode={setViewportMode}
                  isCapturing={isProcessingDepth}
                />
              </div>

              {/* Viewport Floating Info & Quick Controls Bar */}
              <div className="p-4 rounded-2xl bg-slate-950/80 backdrop-blur-xl border border-white/10 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 shrink-0 bg-black">
                    {currentSnapshot ? (
                      <img
                        src={currentSnapshot.dataUrl}
                        alt="Capture thumbnail"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-600">
                        <Camera className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs">
                      {currentSnapshot?.title || 'Camera Asset'}
                    </h4>
                    <span className="text-[11px] text-cyan-400">
                      Displacement: {hologramParams.displacementScale}x   Chroma: {hologramParams.colorTheme.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleInstantSelfie}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-amber-300 font-bold transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Instant Selfie 3D</span>
                  </button>

                  <button
                    onClick={() => setIsExportOpen(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-bold transition-all flex items-center gap-1.5 shadow-md"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export 3D Asset</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'camera' && (
            <CameraCaptureStudio
              onCaptureImage={handleCaptureSnapshot}
              onOpenSamples={() => setIsSamplesOpen(true)}
              currentSnapshot={currentSnapshot}
            />
          )}

          {activeTab === 'depth' && (
            <DepthNormalInspector
              depthData={depthData}
              snapshot={currentSnapshot}
              displacementScale={hologramParams.displacementScale}
            />
          )}

          {activeTab === 'shader' && (
            <GlslRaymarchStudio
              params={hologramParams}
              snapshot={currentSnapshot}
            />
          )}
        </section>

        {/* Right Column: MP3 Ingester, Camera Quick Trigger & AI Diagnosis (4 Cols) */}
        <aside className="lg:col-span-4 flex flex-col gap-4 font-mono">
          {/* MP3 Audio Ingester & Beat Sync Widget */}
          <AudioIngestPlayer onAudioMetricsUpdate={handleAudioMetricsUpdate} />

          {/* Quick Camera Snapshot Trigger Card */}
          <div className="p-5 rounded-2xl bg-slate-950/80 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col justify-between gap-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  OPTICAL SENSOR FEED
                </h3>
              </div>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-semibold">
                ACTIVE
              </span>
            </div>

            {/* Current Capture Preview Thumbnail with Overlay Reticle */}
            <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-black group">
              {currentSnapshot ? (
                <img
                  src={currentSnapshot.dataUrl}
                  alt="Current Capture"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 text-xs">
                  <Camera className="w-8 h-8 mb-2" />
                  <span>No frame captured</span>
                </div>
              )}

              {/* Holographic Laser Grid Overlay */}
              <div className="absolute inset-0 bg-cyan-500/10 mix-blend-overlay pointer-events-none" />
              <div className="absolute bottom-2 left-2 text-[10px] bg-black/80 backdrop-blur px-2 py-0.5 rounded text-cyan-300 border border-cyan-400/30">
                {depthData?.pointCount.toLocaleString() || 0} Points Sampled
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={handleInstantSelfie}
                className="py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold flex items-center justify-center gap-1.5 transition-colors shadow-md"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Instant Selfie 3D</span>
              </button>

              <button
                onClick={() => setIsSamplesOpen(true)}
                className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>3D Samples</span>
              </button>
            </div>
          </div>

          {/* AI 3D Spatial Geometry Diagnosis Box */}
          <div className="p-5 rounded-2xl bg-slate-950/80 backdrop-blur-xl border border-white/10 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
                <Brain className="w-4 h-4 text-cyan-400" />
                <span>AI 3D SPATIAL DIAGNOSIS</span>
              </div>
              <button
                onClick={() => setIsAiVisionOpen(true)}
                className="text-[10px] text-cyan-400 hover:text-cyan-300 font-semibold"
              >
                Analyze
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Object Subject:</span>
                <span className="text-white font-semibold truncate max-w-[160px]">
                  {currentSnapshot?.title || 'Cyber Dragon'}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Point Count:</span>
                <span className="text-cyan-400 font-bold">
                  {depthData?.pointCount.toLocaleString() || '12,100'} VTX
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Harmonic Frequency:</span>
                <span className="text-emerald-400 font-bold">432.0 Hz Solfeggio</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Export Compatibility:</span>
                <span className="text-slate-200">OBJ / PLY / STL / GLSL</span>
              </div>
            </div>

            <button
              onClick={() => setIsAiVisionOpen(true)}
              className="w-full py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Extract 3D Features with AI</span>
            </button>
          </div>
        </aside>
      </main>

      {/* Modals & Drawers */}
      <ShaderTunerDrawer
        isOpen={isTunerOpen}
        onClose={() => setIsTunerOpen(false)}
        params={hologramParams}
        onChangeParams={handleUpdateParams}
      />

      <AssetExportDrawer
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        depthData={depthData}
        snapshot={currentSnapshot}
        params={hologramParams}
      />

      <AiVision3DModal
        isOpen={isAiVisionOpen}
        onClose={() => setIsAiVisionOpen(false)}
        snapshot={currentSnapshot}
        onApplyAiAnalysis={handleApplyAiAnalysis}
      />

      <CuratedSamplesModal
        isOpen={isSamplesOpen}
        onClose={() => setIsSamplesOpen(false)}
        onSelectSample={(snap) => processImageTo3D(snap, hologramParams)}
      />

      <HologramGameStage
        isOpen={isGameOpen}
        onClose={() => setIsGameOpen(false)}
      />

      <SocialMediaIngestModal
        isOpen={isSocialOpen}
        onClose={() => setIsSocialOpen(false)}
        onImportSnapshot={(snap) => processImageTo3D(snap, hologramParams)}
      />
    </div>
  );
}
