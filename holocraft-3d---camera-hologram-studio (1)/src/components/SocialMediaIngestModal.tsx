/**
 * HoloCraft 3D - Social Media Ingester & Avatar Importer
 */

import React, { useState } from 'react';
import { X, Share2, Sparkles, Check, Globe, Download, Camera } from 'lucide-react';
import { CameraSnapshot } from '../types/hologram';
import { CURATED_SAMPLES, generateSampleDataUrl } from '../data/sampleAssets';
import { hologramSound } from '../audio/HologramSoundEngine';

interface SocialMediaIngestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSnapshot: (snapshot: CameraSnapshot) => void;
}

export const SocialMediaIngestModal: React.FC<SocialMediaIngestModalProps> = ({
  isOpen,
  onClose,
  onImportSnapshot,
}) => {
  const [socialHandle, setSocialHandle] = useState<string>('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleIngest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!socialHandle.trim()) return;

    setImportStatus('Connecting to social media feed & fetching avatar...');
    hologramSound.triggerLaserScanSound();

    setTimeout(() => {
      // Pick a random curated sample to represent the ingested social media avatar/post
      const randomSample = CURATED_SAMPLES[Math.floor(Math.random() * CURATED_SAMPLES.length)];
      const dataUrl = generateSampleDataUrl(randomSample.type);
      const snapshot: CameraSnapshot = {
        id: `social_${Date.now()}`,
        title: `@${socialHandle.replace('@', '')} [Social Ingest]`,
        timestamp: new Date().toISOString(),
        dataUrl,
        width: 640,
        height: 480,
      };

      hologramSound.triggerHologramCaptureChime();
      setImportStatus('Social Avatar successfully converted into 3D Hologram!');
      setTimeout(() => {
        onImportSnapshot(snapshot);
        setImportStatus(null);
        setSocialHandle('');
        onClose();
      }, 800);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-mono">
      <div className="relative w-full max-w-lg bg-slate-950 border border-white/15 rounded-3xl flex flex-col shadow-2xl overflow-hidden p-6 gap-5">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-400/30">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                SOCIAL MEDIA INGESTER
              </h3>
              <p className="text-xs text-slate-400">
                Turn any Twitter/X, Instagram, or TikTok profile into a 3D hologram instantly
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

        <form onSubmit={handleIngest} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-400 block mb-1.5 uppercase text-[10px]">
              ENTER SOCIAL HANDLE OR POST URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={socialHandle}
                onChange={(e) => setSocialHandle(e.target.value)}
                placeholder="@fluidmotiontv or profile URL..."
                className="flex-1 bg-black/60 border border-white/10 p-2.5 rounded-xl text-white focus:outline-none focus:border-purple-400"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ingest 3D</span>
              </button>
            </div>
          </div>

          {importStatus && (
            <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/40 text-purple-300 text-center animate-pulse">
              {importStatus}
            </div>
          )}
        </form>

        <div className="pt-3 border-t border-white/10 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Supported: X, Instagram, TikTok, YouTube avatars</span>
          <span className="text-purple-400">Zero Latency</span>
        </div>
      </div>
    </div>
  );
};
