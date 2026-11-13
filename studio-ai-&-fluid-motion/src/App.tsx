import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { D9ClockWidget } from './components/D9ClockWidget';
import { DailyMissionsWidget } from './components/DailyMissionsWidget';
import { StudioAIAssistant } from './components/StudioAIAssistant';
import { UserProfileModal } from './components/UserProfileModal';
import { SurfXABuddyModal } from './components/SurfXABuddyModal';
import { QuickStartOverlay } from './components/QuickStartOverlay';
import { QuickAssetDrawer } from './components/QuickAssetDrawer';
import { WeatherWatch } from './components/WeatherWatch';
import { AmbientSoundscape } from './components/AmbientSoundscape';
import { VectorArtStudio } from './components/VectorArtStudio';
import { SovereignMusicStudio } from './components/SovereignMusicStudio';
import { ComicBuilder } from './components/ComicBuilder';
import { ARBeachOverlay } from './components/ARBeachOverlay';
import { SovereignEconomy } from './components/SovereignEconomy';
import { RadioAndReelsVault } from './components/RadioAndReelsVault';
import { TemporalHistory } from './components/TemporalHistory';
import { MicroMovieCompiler } from './components/MicroMovieCompiler';
import { AssistantDirectorModal } from './components/AssistantDirectorModal';
import { D9WaveAnimation } from './components/D9WaveAnimation';
import { PremiereStageModal } from './components/PremiereStageModal';
import { NodeFeed } from './components/NodeFeed';
import { calculateD9State } from './lib/dragon9Clock';
import { D9ClockState, SurfTelemetry } from './types';
import { Coins, CheckCircle, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('vector');
  const [d9State, setD9State] = useState<D9ClockState>(() => calculateD9State());
  const [surfTelemetry, setSurfTelemetry] = useState<SurfTelemetry | null>(null);
  const [harmonyNotes, setHarmonyNotes] = useState<number>(1425);

  const [shavings, setShavings] = useState<number>(85);
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [isAssistantDirectorOpen, setIsAssistantDirectorOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isFrostbiteOpen, setIsFrostbiteOpen] = useState<boolean>(false);
  const [isPremiereStageOpen, setIsPremiereStageOpen] = useState<boolean>(false);
  const [hasAutoOpenedApexStage, setHasAutoOpenedApexStage] = useState<boolean>(false);
  const [isTourOpen, setIsTourOpen] = useState<boolean>(() => {
    return !localStorage.getItem('hasSeenPeeDubTour');
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Clock Ticker loop
  useEffect(() => {
    const timer = setInterval(() => {
      setD9State(calculateD9State());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Automatic Triggering of Premiere Stage during Apex Wedge
  useEffect(() => {
    if (d9State.isApexWedge && !hasAutoOpenedApexStage) {
      setIsPremiereStageOpen(true);
      setHasAutoOpenedApexStage(true);
      setToastMessage(`⚡ APEX WEDGE ACTIVE: Premiere Stage Broadcast Triggered!`);
      setTimeout(() => setToastMessage(null), 5000);
    } else if (!d9State.isApexWedge && hasAutoOpenedApexStage) {
      setHasAutoOpenedApexStage(false);
    }
  }, [d9State.isApexWedge, hasAutoOpenedApexStage]);

  const handleTelemetryUpdate = useCallback((telemetry: SurfTelemetry) => {
    setSurfTelemetry(telemetry);
  }, []);

  const handleEarnHarmony = useCallback((amount: number, description: string) => {
    setHarmonyNotes((prev) => prev + amount);
    setShavings((prev) => prev + Math.floor(amount / 10));

    setToastMessage(`+${amount} Harmony Notes Earned! (${description})`);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-sans selection:bg-[#F27D26] selection:text-black">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#F27D26] text-black font-black italic uppercase px-5 py-3 border-2 border-black shadow-2xl flex items-center gap-2.5 text-xs font-mono">
          <Coins className="w-5 h-5 text-black" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Primary Navigation & Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        d9State={d9State}
        harmonyNotes={harmonyNotes}
        shavings={shavings}
        onOpenAssistant={() => setIsAssistantOpen(true)}
        onOpenAssistantDirector={() => setIsAssistantDirectorOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenFrostbite={() => setIsFrostbiteOpen(true)}
        onOpenTour={() => setIsTourOpen(true)}
        onOpenPremiereStage={() => setIsPremiereStageOpen(true)}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Dragon 9 Clock Ticker Banner */}
        <D9ClockWidget
          d9State={d9State}
          onOpenPremiereStage={() => setIsPremiereStageOpen(true)}
        />

        {/* Daily Creative Missions Widget */}
        <DailyMissionsWidget
          onEarnHarmony={handleEarnHarmony}
          onNavigateTab={(tab) => setActiveTab(tab)}
        />

        {/* Port Waikato Weather Watch & Marine Telemetry Card */}
        <WeatherWatch
          onOpenFrostbite={() => setIsFrostbiteOpen(true)}
          onTelemetryUpdate={handleTelemetryUpdate}
        />

        {/* Port Waikato Node Activity Feed */}
        <NodeFeed
          onEarnHarmony={handleEarnHarmony}
          onNavigateTab={(tab) => setActiveTab(tab)}
        />


        {/* Dynamic Tab Views */}
        {activeTab === 'vector' && (
          <VectorArtStudio onEarnHarmony={handleEarnHarmony} />
        )}

        {activeTab === 'music' && (
          <SovereignMusicStudio onEarnHarmony={handleEarnHarmony} />
        )}

        {activeTab === 'comic' && (
          <ComicBuilder
            onEarnHarmony={handleEarnHarmony}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'movie' && (
          <MicroMovieCompiler
            onEarnHarmony={handleEarnHarmony}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'ar' && (
          <ARBeachOverlay onEarnHarmony={handleEarnHarmony} />
        )}

        {activeTab === 'economy' && (
          <SovereignEconomy harmonyNotes={harmonyNotes} shavings={shavings} />
        )}

        {activeTab === 'radio' && (
          <RadioAndReelsVault onEarnHarmony={handleEarnHarmony} />
        )}

        {activeTab === 'temporal' && (
          <TemporalHistory
            d9State={d9State}
            onEarnHarmony={handleEarnHarmony}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}
      </main>

      {/* Studio AI Assistant Modal Drawer */}
      <StudioAIAssistant
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
      />

      {/* Assistant Director Modal */}
      <AssistantDirectorModal
        isOpen={isAssistantDirectorOpen}
        onClose={() => setIsAssistantDirectorOpen(false)}
        onNavigateTab={(tab) => setActiveTab(tab)}
        onEarnHarmony={handleEarnHarmony}
      />

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        harmonyNotes={harmonyNotes}
        shavings={shavings}
        onNavigateToEconomy={() => setActiveTab('economy')}
      />

      {/* Frostbite: Surf XA-Stretch AI Buddy & Guide Modal */}
      <SurfXABuddyModal
        isOpen={isFrostbiteOpen}
        onClose={() => setIsFrostbiteOpen(false)}
        onEarnHarmony={handleEarnHarmony}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />

      {/* Premiere Stage Modal (Auto-triggers during 18m Apex Wedges) */}
      <PremiereStageModal
        isOpen={isPremiereStageOpen}
        onClose={() => setIsPremiereStageOpen(false)}
        d9State={d9State}
        onEarnHarmony={handleEarnHarmony}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />

      {/* Quick-Start 3-Step Interactive Tour Overlay */}
      <QuickStartOverlay
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        onNavigateTab={(tab) => setActiveTab(tab)}
        onEarnHarmony={handleEarnHarmony}
      />

      {/* Quick Asset Floating Drawer (Drag-and-Drop Stickers & Beats) */}
      <QuickAssetDrawer
        onNavigateTab={(tab) => setActiveTab(tab)}
        onInsertAsset={(asset) => {
          handleEarnHarmony(5, `Inserted asset: ${asset.title}`);
        }}
      />

      {/* D9 Dynamic Background Wave Animation */}
      <D9WaveAnimation d9State={d9State} surfTelemetry={surfTelemetry} />


      {/* Footer */}
      <footer className="border-t border-[#222] bg-[#050505] pt-4 pb-6 space-y-4 font-mono text-xs uppercase">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <AmbientSoundscape className="w-full shadow-lg" />
        </div>

        <div className="text-center text-[#888] space-y-1 pt-2">
          <p>
            Port Waikato Node (Pee Dub) • Dragon 9 Sovereign Clock Engine & Fluid Motion Architecture
          </p>
          <p className="text-[#555] text-[11px]">
            90% Creator Direct Split • 9% Campground Community Fund • 1% Ecosystem Void
          </p>
        </div>
      </footer>
    </div>
  );
}

