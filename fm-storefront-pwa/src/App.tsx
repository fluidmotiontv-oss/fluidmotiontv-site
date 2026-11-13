import React, { useState, useEffect, useCallback } from 'react';
import { CameraViewMode, TierItem, OrderState } from './types/store';
import { TIERS_DATA } from './data/tiers';
import { ThreeScene } from './components/ThreeScene';
import { HolographicIntro } from './components/HolographicIntro';
import { TopNav } from './components/TopNav';
import { TierDetailPanel } from './components/TierDetailPanel';
import { CheckoutModal } from './components/CheckoutModal';
import { RadioPlayer } from './components/RadioPlayer';
import { StorefrontRentalModal } from './components/StorefrontRentalModal';
import { BloomControl } from './components/BloomControl';
import { FogControl } from './components/FogControl';
import { LightingControl } from './components/LightingControl';
import { LightingPresetId } from './data/lightingPresets';
import { WaveScienceHUD } from './components/WaveScienceHUD';
import { GuideOverlay } from './components/GuideOverlay';
import { BootLoader } from './components/BootLoader';
import { QuickBuyDock } from './components/QuickBuyDock';
import { WaveSpotPreset, WaveDirection, WaveCameraAngle } from './types/wave';
import { WAVE_SPOTS } from './data/waveSpots';
import { soundEngine } from './utils/audio';
import { Layers, Building2, Fish, Check, X, BookOpen, Sparkles, Waves } from 'lucide-react';

export default function App() {
  const [viewMode, setViewMode] = useState<CameraViewMode>('doorway');
  const [isIntroOpen, setIsIntroOpen] = useState(true);
  const [selectedCheckoutTier, setSelectedCheckoutTier] = useState<TierItem | null>(null);
  const [hoveredTierId, setHoveredTierId] = useState<string | null>(null);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [isRentalModalOpen, setIsRentalModalOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<OrderState | null>(null);
  const [bloomIntensity, setBloomIntensity] = useState<number>(1.2);
  const [fogDensity, setFogDensity] = useState<number>(1.0);
  const [dofEnabled, setDofEnabled] = useState<boolean>(true);
  const [lightingPreset, setLightingPreset] = useState<LightingPresetId>('holographic-blue');
  const [zoomOffset, setZoomOffset] = useState<number>(0);
  const [resetZoomTrigger, setResetZoomTrigger] = useState<number>(0);
  const [showGuide, setShowGuide] = useState<boolean>(() => {
    try { return !localStorage.getItem('fm-store-guide-seen'); } catch { return true; }
  });
  const [guideSeen] = useState<boolean>(() => {
    try { return !!localStorage.getItem('fm-store-guide-seen'); } catch { return true; }
  });
  const [booting, setBooting] = useState(true);
  const [bootFading, setBootFading] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setBootFading(true), 1300);
    return () => clearTimeout(t);
  }, []);
  const handleCloseGuide = useCallback(() => {
    setShowGuide(false);
    try { localStorage.setItem('fm-store-guide-seen', '1'); } catch {}
    soundEngine.playClick(500);
  }, []);

  // Cyber Wave Chamber State
  const [currentWaveSpot, setCurrentWaveSpot] = useState<WaveSpotPreset>(WAVE_SPOTS[0]);
  const [waveHeightFt, setWaveHeightFt] = useState<number>(WAVE_SPOTS[0].defaultHeightFt);
  const [waveDirection, setWaveDirection] = useState<WaveDirection>(WAVE_SPOTS[0].direction);
  const [waveCameraAngle, setWaveCameraAngle] = useState<WaveCameraAngle>('gantry');

  // Transition from doorway intro into main 3D exhibition room
  const handleEnterStore = useCallback(() => {
    setIsIntroOpen(false);
    setViewMode('overview');
    soundEngine.playClick(620);
  }, []);

  const handleSelectOverview = useCallback(() => {
    setIsIntroOpen(false);
    setViewMode('overview');
    soundEngine.playClick(540);
  }, []);

  const handleEnterAquarium = useCallback(() => {
    setIsIntroOpen(false);
    setViewMode('aquarium');
    soundEngine.playClick(520);
  }, []);

  // Direct navigation handler
  const handleNavigate = useCallback((view: CameraViewMode) => {
    setViewMode(view);
    soundEngine.playClick(580);
    if (view === 'doorway') {
      setIsIntroOpen(true);
    } else {
      setIsIntroOpen(false);
    }
  }, []);

  // 3D Object click handler
  const handleSelectTierFrom3D = useCallback((tier: TierItem) => {
    setViewMode(tier.id as CameraViewMode);
    setSelectedCheckoutTier(tier);
    soundEngine.playClick(680);
  }, []);

  const handleOpenCheckout = useCallback((tierOrId: TierItem | 'tier1' | 'tier2' | 'tier3') => {
    const tier = typeof tierOrId === 'string' 
      ? TIERS_DATA.find(t => t.id === tierOrId) || TIERS_DATA[1]
      : tierOrId;
    setSelectedCheckoutTier(tier);
    soundEngine.playClick(640);
  }, []);

  const handleCloseCheckout = useCallback(() => {
    setSelectedCheckoutTier(null);
  }, []);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedCheckoutTier) {
          setSelectedCheckoutTier(null);
        } else if (isComparisonOpen) {
          setIsComparisonOpen(false);
        } else if (isRentalModalOpen) {
          setIsRentalModalOpen(false);
        }
      } else if (e.key === '1') {
        handleNavigate('tier1');
      } else if (e.key === '2') {
        handleNavigate('tier2');
      } else if (e.key === '3') {
        handleNavigate('tier3');
      } else if (e.key === '4' || e.key.toLowerCase() === 'a') {
        handleNavigate('aquarium');
      } else if (e.key === '5' || e.key.toLowerCase() === 'h') {
        handleNavigate('horizon');
      } else if (e.key === '0' || e.key === ' ') {
        handleNavigate('overview');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCheckoutTier, isComparisonOpen, isRentalModalOpen, handleNavigate]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black text-slate-100 font-sans select-none">
      {booting && <BootLoader fading={bootFading} onDone={() => setBooting(false)} />}
      {/* 1. Fullscreen WebGL Three.js Spatial Scene */}
      <ThreeScene
        viewMode={viewMode}
        onSelectTier={handleSelectTierFrom3D}
        hoveredTierId={hoveredTierId}
        setHoveredTierId={setHoveredTierId}
        bloomIntensity={bloomIntensity}
        onZoomChange={setZoomOffset}
        resetZoomTrigger={resetZoomTrigger}
        fogDensity={fogDensity}
        dofEnabled={dofEnabled}
        lightingPreset={lightingPreset}
        waveHeightFt={waveHeightFt}
        waveDirection={waveDirection}
        waveCameraAngle={waveCameraAngle}
        waveSpotId={currentWaveSpot.id}
      />

      {/* Subtle Holographic Grid & Vignette Overlay */}
      <div className="absolute inset-0 pointer-events-none hologram-grid opacity-20 z-10" />
      <div className="absolute inset-0 pointer-events-none bg-radial from-transparent via-black/35 to-black/90 z-10" />

      {/* 2. Top Navigation Bar (Contract Compliant) */}
      <TopNav
        currentView={viewMode}
        onNavigate={handleNavigate}
        onOpenCheckout={handleOpenCheckout}
        onOpenRentalModal={() => setIsRentalModalOpen(true)}
        onReopenIntro={() => {
          setViewMode('doorway');
          setIsIntroOpen(true);
        }}
      />

      {/* 3. Floating Radio Player with 3 Live Stations & Real-time Visualizer */}
      <RadioPlayer onNavigateHorizon={() => handleNavigate('horizon')} />

      {/* 4. Holographic Welcome Boom Intro */}
      <HolographicIntro
        isOpen={isIntroOpen}
        onEnterStore={handleEnterStore}
        onSelectOverview={handleSelectOverview}
        onEnterAquarium={handleEnterAquarium}
        onEnterWave={() => {
          setIsIntroOpen(false);
          handleNavigate('wave');
        }}
        onEnterHorizon={() => {
          setIsIntroOpen(false);
          handleNavigate('horizon');
        }}
      />

      {/* 5. Floating Tier Detail & Quick Checkout HUD */}
      {!isIntroOpen && viewMode !== 'wave' && (
        <TierDetailPanel
          currentView={viewMode}
          onSelectView={handleNavigate}
          onOpenCheckout={handleOpenCheckout}
          onOpenRentalModal={() => setIsRentalModalOpen(true)}
          hoveredTierId={hoveredTierId}
          bloomIntensity={bloomIntensity}
          onChangeBloom={setBloomIntensity}
          zoomOffset={zoomOffset}
          onResetZoom={() => setResetZoomTrigger(prev => prev + 1)}
          fogDensity={fogDensity}
          onChangeFogDensity={setFogDensity}
          dofEnabled={dofEnabled}
          onToggleDof={setDofEnabled}
          lightingPreset={lightingPreset}
          onChangeLightingPreset={setLightingPreset}
        />
      )}

      {/* 5B. Hydrodynamics Wave Lab Science HUD */}
      {!isIntroOpen && viewMode === 'wave' && (
        <WaveScienceHUD
          currentSpot={currentWaveSpot}
          onSelectSpot={setCurrentWaveSpot}
          waveHeightFt={waveHeightFt}
          onChangeHeight={setWaveHeightFt}
          direction={waveDirection}
          onToggleDirection={setWaveDirection}
          cameraAngle={waveCameraAngle}
          onChangeCameraAngle={setWaveCameraAngle}
          onExitWaveLab={() => handleNavigate('overview')}
        />
      )}

      {/* 6. Quick Tool Bar (Top Left below Nav) */}
      {!isIntroOpen && (
        <div className="fixed top-16 left-4 sm:left-8 z-20 hidden md:flex items-center gap-2.5">
          <LightingControl
            lightingPreset={lightingPreset}
            onChangePreset={setLightingPreset}
          />

          <BloomControl
            bloomIntensity={bloomIntensity}
            onChangeBloom={setBloomIntensity}
          />

          <FogControl
            fogDensity={fogDensity}
            onChangeFogDensity={setFogDensity}
            dofEnabled={dofEnabled}
            onToggleDof={setDofEnabled}
          />

          <button
            onClick={() => handleNavigate(viewMode === 'wave' ? 'overview' : 'wave')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer border ${
              viewMode === 'wave'
                ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-500/15'
                : 'glass-panel hover:bg-white/10 text-slate-300 hover:text-white border-white/10'
            }`}
          >
            <Waves className="w-3.5 h-3.5 text-cyan-400" />
            <span>{viewMode === 'wave' ? 'Exit Wave Lab' : 'Wave Lab'}</span>
          </button>

          <button
            onClick={() => handleNavigate(viewMode === 'horizon' ? 'overview' : 'horizon')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer border ${
              viewMode === 'horizon'
                ? 'bg-pink-500/25 border-pink-400 text-pink-200 shadow-md shadow-pink-500/15'
                : 'glass-panel hover:bg-white/10 text-slate-300 hover:text-white border-white/10'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>{viewMode === 'horizon' ? 'Exit Horizon' : 'Horizon & Plasma'}</span>
          </button>

          <button
            onClick={() => setIsComparisonOpen(true)}
            className="px-3 py-1.5 rounded-lg glass-panel hover:bg-white/10 text-xs font-mono text-slate-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer border border-white/10"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Compare 3 Volumes</span>
          </button>

          <button
            onClick={() => handleNavigate(viewMode === 'aquarium' ? 'overview' : 'aquarium')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer border ${
              viewMode === 'aquarium'
                ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200 shadow-md'
                : 'glass-panel hover:bg-white/10 text-slate-300 hover:text-white border-white/10'
            }`}
          >
            <Fish className="w-3.5 h-3.5 text-cyan-400" />
            <span>{viewMode === 'aquarium' ? 'Exit Aquarium' : 'Dive into Aquarium'}</span>
          </button>

          <button
            onClick={() => setIsRentalModalOpen(true)}
            className="px-3 py-1.5 rounded-lg glass-panel hover:bg-white/10 text-xs font-mono text-slate-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer border border-white/10"
          >
            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Rent Storefront</span>
          </button>
        </div>
      )}

      {/* 7. Checkout Modal (Rendering <PayPalCheckout />) */}

      {/* 10. Explorer Guide + Quick Buy Dock + identity footer */}
      <GuideOverlay isOpen={showGuide} onClose={handleCloseGuide} />

      {!isIntroOpen && !showGuide && (
        <button
          onClick={() => setShowGuide(true)}
          title="Explorer's Guide"
          aria-label="Open guide"
          className="fixed bottom-5 right-5 z-30 w-11 h-11 rounded-full glass-panel hover:bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-lg font-bold transition-all cursor-pointer shadow-lg shadow-cyan-500/10"
        >
          ?
          {!guideSeen && (
            <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400"></span>
            </span>
          )}
        </button>
      )}

      {!isIntroOpen && !showGuide && (
        <QuickBuyDock onSelectTier={handleSelectTier} onCompare={() => setShowCompareModal(true)} selectedTierId={selectedTierId} />
      )}

      <div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-20 pointer-events-none hidden sm:block">
        <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-slate-500">
          <span>DRAGON9 SOVEREIGN GRID</span>
          <span className="text-cyan-600">&middot;</span>
          <span>PORT WAIKATO</span>
          <span className="text-cyan-600">&middot;</span>
          <span>432HZ</span>
          <span className="text-cyan-600">&middot;</span>
          <a href="../" className="pointer-events-auto text-cyan-500 hover:text-cyan-300 transition-colors">PORTAL &uarr;</a>
        </div>
      </div>
      <CheckoutModal
        isOpen={selectedCheckoutTier !== null}
        onClose={handleCloseCheckout}
        tier={selectedCheckoutTier}
        onOrderComplete={(order) => {
          setCompletedOrder(order);
        }}
      />

      {/* 8. Storefront Rental / Interest Modal */}
      <StorefrontRentalModal
        isOpen={isRentalModalOpen}
        onClose={() => setIsRentalModalOpen(false)}
      />

      {/* 9. Comparison Matrix Modal (Strictly Pure E-Books) */}
      {isComparisonOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="fixed inset-0" onClick={() => setIsComparisonOpen(false)} />
          <div className="relative w-full max-w-4xl glass-panel-glow rounded-2xl p-6 sm:p-8 border border-white/15 z-10 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsComparisonOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center max-w-xl mx-auto mb-6">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
                Guide to Sovereign Media Matrix
              </span>
              <h2 className="text-2xl font-bold text-white font-display mt-1">
                Curated Digital E-Book Editions
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Pure DRM-free publications (PDF & EPUB). Zero code packages or dev dependencies. Immediate digital vault access via PayPal.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {TIERS_DATA.map((tier) => (
                <div 
                  key={tier.id}
                  className={`p-5 rounded-xl border flex flex-col justify-between transition-all ${
                    tier.id === 'tier3' 
                      ? 'bg-amber-950/20 border-amber-500/40 shadow-lg shadow-amber-500/10'
                      : tier.id === 'tier2'
                      ? 'bg-emerald-950/20 border-emerald-500/40'
                      : 'bg-black/40 border-white/10'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-baseline mb-2">
                      <span className="text-xs font-mono font-semibold" style={{ color: tier.accentColor }}>
                        {tier.highlight}
                      </span>
                      <span className="text-2xl font-bold font-mono text-white">
                        ${tier.price}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white font-display mb-1">
                      {tier.name}
                    </h4>
                    
                    <p className="text-xs text-slate-300 mb-4">
                      {tier.tagline}
                    </p>

                    <div className="text-xs font-mono text-slate-400 mb-4 pb-3 border-b border-white/10 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Format: {tier.format}</span>
                      </div>
                      <div>Volume: {tier.pagesCount} Pages</div>
                      <div>Est. Read: {tier.readTime}</div>
                    </div>

                    <ul className="space-y-2 text-xs text-slate-300 mb-6">
                      {tier.deliverables.map((d, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => {
                      setIsComparisonOpen(false);
                      handleOpenCheckout(tier);
                    }}
                    className="w-full py-2.5 rounded-lg font-semibold text-xs transition-all cursor-pointer shadow-md text-slate-950"
                    style={{
                      backgroundColor: tier.accentColor
                    }}
                  >
                    Get E-Book · ${tier.price}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
