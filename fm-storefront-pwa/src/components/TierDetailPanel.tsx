import React from 'react';
import { ArrowRight, Eye, Fish, Building2, Sparkles } from 'lucide-react';
import { TierItem, CameraViewMode } from '../types/store';
import { TIERS_DATA } from '../data/tiers';
import { BloomControl } from './BloomControl';
import { FogControl } from './FogControl';
import { LightingControl } from './LightingControl';
import { LightingPresetId } from '../data/lightingPresets';

interface TierDetailPanelProps {
  currentView: CameraViewMode;
  onSelectView: (view: CameraViewMode) => void;
  onOpenCheckout: (tier: TierItem) => void;
  onOpenRentalModal: () => void;
  hoveredTierId: string | null;
  bloomIntensity?: number;
  onChangeBloom?: (val: number) => void;
  zoomOffset?: number;
  onResetZoom?: () => void;
  fogDensity?: number;
  onChangeFogDensity?: (val: number) => void;
  dofEnabled?: boolean;
  onToggleDof?: (val: boolean) => void;
  lightingPreset?: LightingPresetId;
  onChangeLightingPreset?: (preset: LightingPresetId) => void;
}

export const TierDetailPanel: React.FC<TierDetailPanelProps> = ({
  currentView,
  onSelectView,
  onOpenCheckout,
  onOpenRentalModal,
  hoveredTierId,
  bloomIntensity,
  onChangeBloom,
  zoomOffset = 0,
  onResetZoom,
  fogDensity,
  onChangeFogDensity,
  dofEnabled,
  onToggleDof,
  lightingPreset,
  onChangeLightingPreset
}) => {
  const activeTierId = (currentView === 'tier1' || currentView === 'tier2' || currentView === 'tier3')
    ? currentView
    : (hoveredTierId || 'tier2');

  const activeTier = TIERS_DATA.find(t => t.id === activeTierId) || TIERS_DATA[1];

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 w-[95%] max-w-4xl transition-all duration-300 pointer-events-none">
      <div className="glass-panel-glow rounded-2xl p-4 sm:p-5 pointer-events-auto border border-white/10 shadow-2xl backdrop-blur-xl">
        {/* Tier Selector Navigation Bar */}
        <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3 mb-3">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-0.5 no-scrollbar">
            <button
              onClick={() => onSelectView('overview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                currentView === 'overview'
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              <span>Sovereign Hall</span>
            </button>

            <button
              onClick={() => onSelectView('horizon')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                currentView === 'horizon'
                  ? 'bg-pink-500/25 text-pink-200 border border-pink-400/50 shadow-sm'
                  : 'text-slate-400 hover:text-pink-300 hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              <span>Horizon & Plasma</span>
            </button>

            <button
              onClick={() => onSelectView('aquarium')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                currentView === 'aquarium'
                  ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-400/50 shadow-sm'
                  : 'text-slate-400 hover:text-cyan-300 hover:bg-white/5'
              }`}
            >
              <Fish className="w-3.5 h-3.5 text-cyan-400" />
              <span>Tunnel Aquarium</span>
            </button>

            {TIERS_DATA.map((tier) => {
              const isActive = currentView === tier.id || (currentView === 'overview' && hoveredTierId === tier.id);
              return (
                <button
                  key={tier.id}
                  onClick={() => onSelectView(tier.id as CameraViewMode)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <span 
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: tier.accentColor }} 
                  />
                  <span>${tier.price} {tier.shortTitle}</span>
                </button>
              );
            })}
          </div>

          {/* Controls: Lighting preset, Bloom intensity, Fog density and Rent Storefront */}
          <div className="flex items-center gap-2">
            {lightingPreset && onChangeLightingPreset && (
              <LightingControl
                lightingPreset={lightingPreset}
                onChangePreset={onChangeLightingPreset}
              />
            )}

            {bloomIntensity !== undefined && onChangeBloom && (
              <BloomControl
                bloomIntensity={bloomIntensity}
                onChangeBloom={onChangeBloom}
              />
            )}

            {fogDensity !== undefined && onChangeFogDensity && dofEnabled !== undefined && onToggleDof && (
              <FogControl
                fogDensity={fogDensity}
                onChangeFogDensity={onChangeFogDensity}
                dofEnabled={dofEnabled}
                onToggleDof={onToggleDof}
              />
            )}

            {/* Rent storefront action link */}
            <button
              onClick={onOpenRentalModal}
              className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Building2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Rent 3D Storefront</span>
            </button>
          </div>
        </div>

        {/* Selected Tier Feature Spotlight & Instant CTA */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1 max-w-xl text-left">
            {/* Unboxed Metadata */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span style={{ color: activeTier.accentColor }} className="font-semibold">
                {activeTier.highlight}
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-300">{activeTier.pagesCount} Pages</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-300">Pure E-Book Edition</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-emerald-400">Instant PayPal Delivery</span>
              {Math.abs(zoomOffset) > 0.08 && (
                <>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="text-cyan-300 flex items-center gap-1">
                    <span>Cover Close-Up: {Math.round(100 + zoomOffset * 50)}%</span>
                    {onResetZoom && (
                      <button
                        onClick={onResetZoom}
                        className="text-[10px] text-slate-400 hover:text-white underline ml-0.5 cursor-pointer"
                        title="Reset camera zoom"
                      >
                        (reset)
                      </button>
                    )}
                  </span>
                </>
              )}
            </div>

            <h3 className="text-sm sm:text-base font-bold text-white font-display flex items-center gap-2">
              <span>{activeTier.name}</span>
            </h3>

            <p className="text-xs text-slate-300 line-clamp-1">
              {activeTier.tagline}
            </p>
          </div>

          {/* Pricing & Checkout Trigger */}
          <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-end pt-1 sm:pt-0">
            <div className="text-right">
              <div className="flex items-baseline gap-1.5 justify-end">
                <span className="text-xl sm:text-2xl font-bold font-mono text-white tabular-nums">
                  ${activeTier.price}
                </span>
                <span className="text-xs text-slate-500 line-through font-mono">
                  ${activeTier.originalPrice}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block font-mono">Single payment</span>
            </div>

            <button
              onClick={() => onOpenCheckout(activeTier)}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs sm:text-sm transition-all duration-200 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-400/40 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Get E-Book</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
