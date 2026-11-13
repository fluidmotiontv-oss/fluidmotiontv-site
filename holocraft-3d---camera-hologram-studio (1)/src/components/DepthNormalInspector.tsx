/**
 * HoloCraft 3D - Depth & Normal Map Diagnostic Inspector
 */

import React, { useState } from 'react';
import { Layers, Download, Eye, Sparkles, Activity, Image as ImageIcon } from 'lucide-react';
import { ProcessedDepthData } from '../utils/depthEstimator';
import { CameraSnapshot } from '../types/hologram';

interface DepthNormalInspectorProps {
  depthData: ProcessedDepthData | null;
  snapshot: CameraSnapshot | null;
  displacementScale: number;
}

export const DepthNormalInspector: React.FC<DepthNormalInspectorProps> = ({
  depthData,
  snapshot,
  displacementScale,
}) => {
  const [sliceRow, setSliceRow] = useState<number>(50); // row percentage for cross-section

  if (!depthData || !snapshot) {
    return (
      <div className="p-8 text-center bg-slate-950/80 border border-white/10 rounded-2xl text-slate-400 font-mono text-xs">
        Capture an image with the camera or choose a sample to inspect depth and surface normal topologies.
      </div>
    );
  }

  const { width, height, depthArray } = depthData;
  const targetRow = Math.min(height - 1, Math.floor((sliceRow / 100) * height));

  // Extract cross-section depth profile for row
  const crossSectionPoints: number[] = [];
  for (let x = 0; x < width; x++) {
    crossSectionPoints.push(depthArray[targetRow * width + x]);
  }

  return (
    <div className="flex flex-col bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl p-6 gap-6 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>OPTICAL DEPTH & NORMAL TOPOLOGY MATRIX</span>
          </h3>
          <p className="text-xs text-slate-400">
            Resolution: {width} x {height} grid ({depthData.pointCount.toLocaleString()} voxels)   Scale: {displacementScale}x
          </p>
        </div>
      </div>

      {/* 3 Texture Previews: Original vs Depth vs Normal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. Camera RGB Capture */}
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white">Camera Optical RGB</span>
            <span className="text-[10px] text-slate-500">Source</span>
          </div>
          <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-black">
            <img
              src={snapshot.dataUrl}
              alt="Camera Source"
              className="w-full h-full object-contain"
            />
            {/* Slice Line Indicator */}
            <div
              className="absolute left-0 right-0 h-0.5 bg-cyan-400/80 shadow-[0_0_8px_#22d3ee] pointer-events-none"
              style={{ top: `${sliceRow}%` }}
            />
          </div>
        </div>

        {/* 2. Grayscale Depth Map */}
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-cyan-300">Calculated Depth Map</span>
            <span className="text-[10px] text-cyan-400">Z-Buffer (0..1)</span>
          </div>
          <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-black">
            <img
              src={depthData.depthMapDataUrl}
              alt="Depth Map"
              className="w-full h-full object-contain"
            />
            {/* Slice Line Indicator */}
            <div
              className="absolute left-0 right-0 h-0.5 bg-cyan-400/80 shadow-[0_0_8px_#22d3ee] pointer-events-none"
              style={{ top: `${sliceRow}%` }}
            />
          </div>
        </div>

        {/* 3. Surface Normal Vector Map */}
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-purple-300">Surface Normal Map</span>
            <span className="text-[10px] text-purple-400">XYZ Normals</span>
          </div>
          <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-black">
            <img
              src={depthData.normalMapDataUrl}
              alt="Normal Map"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>

      {/* 2D Cross-Section Relief Profile Graph */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-white">Cross-Section Elevation Slicer (Y = {sliceRow}%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[10px]">Slice Position:</span>
            <input
              type="range"
              min="5"
              max="95"
              value={sliceRow}
              onChange={(e) => setSliceRow(parseInt(e.target.value))}
              className="w-32 accent-cyan-400 cursor-pointer"
            />
            <span className="text-cyan-400 text-[10px] w-8">{sliceRow}%</span>
          </div>
        </div>

        {/* SVG Curve of the selected row */}
        <div className="h-28 w-full relative bg-black/40 rounded-xl p-2 border border-white/5 overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 1000 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="depthGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#0891b2" stopOpacity="0.1" />
              </linearGradient>
            </defs>

            {/* Area under curve */}
            <path
              d={`M 0 100 ${crossSectionPoints.map((val, idx) => {
                const x = (idx / (crossSectionPoints.length - 1)) * 1000;
                const y = 100 - val * 90;
                return `L ${x} ${y}`;
              }).join(' ')} L 1000 100 Z`}
              fill="url(#depthGrad)"
            />

            {/* Line curve */}
            <path
              d={`M 0 100 ${crossSectionPoints.map((val, idx) => {
                const x = (idx / (crossSectionPoints.length - 1)) * 1000;
                const y = 100 - val * 90;
                return `L ${x} ${y}`;
              }).join(' ')}`}
              fill="none"
              stroke="#22d3ee"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
