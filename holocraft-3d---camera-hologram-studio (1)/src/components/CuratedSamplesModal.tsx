/**
 * HoloCraft 3D - Curated Sample Assets Selector Modal
 */

import React from 'react';
import { X, Sparkles, Box, Check, ArrowRight } from 'lucide-react';
import { CURATED_SAMPLES, generateSampleDataUrl, CuratedSample } from '../data/sampleAssets';
import { CameraSnapshot } from '../types/hologram';
import { hologramSound } from '../audio/HologramSoundEngine';

interface CuratedSamplesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSample: (snapshot: CameraSnapshot, sample: CuratedSample) => void;
}

export const CuratedSamplesModal: React.FC<CuratedSamplesModalProps> = ({
  isOpen,
  onClose,
  onSelectSample,
}) => {
  if (!isOpen) return null;

  const handlePick = (sample: CuratedSample) => {
    const dataUrl = generateSampleDataUrl(sample.type);
    const snapshot: CameraSnapshot = {
      id: `sample_${sample.id}_${Date.now()}`,
      title: sample.name,
      timestamp: new Date().toISOString(),
      dataUrl,
      width: 640,
      height: 480,
    };

    hologramSound.triggerLaserScanSound();
    hologramSound.triggerHologramCaptureChime();
    onSelectSample(snapshot, sample);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-mono">
      <div className="relative w-full max-w-3xl bg-slate-950 border border-white/15 rounded-3xl flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-base font-bold text-white">
                CURATED 3D HOLOGRAM TEMPLATES
              </h2>
              <p className="text-xs text-slate-400">
                Select high-relief camera captures pre-calibrated for volumetric point clouds & 3D mesh reconstruction
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Grid of Samples */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[70vh] overflow-y-auto">
          {CURATED_SAMPLES.map((sample) => {
            const previewUrl = generateSampleDataUrl(sample.type);
            return (
              <div
                key={sample.id}
                onClick={() => handlePick(sample)}
                className="group relative p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400/50 cursor-pointer transition-all duration-200 flex flex-col justify-between shadow-lg"
              >
                <div>
                  {/* Thumbnail */}
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/10 bg-black mb-3">
                    <img
                      src={previewUrl}
                      alt={sample.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-bold bg-slate-950/80 text-cyan-300 border border-cyan-400/30">
                      {sample.category}
                    </span>
                  </div>

                  {/* Info */}
                  <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {sample.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed mt-1 line-clamp-2">
                    {sample.description}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[10px]">
                  <span className="text-slate-500">
                    Displacement: {sample.displacement}x
                  </span>
                  <span className="text-cyan-400 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Load 3D</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
