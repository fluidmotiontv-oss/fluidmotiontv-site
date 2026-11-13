/**
 * HoloCraft 3D - Multi-Format 3D & Hologram Asset Export Studio
 */

import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Box, 
  Sparkles, 
  Layers, 
  FileCode, 
  Printer, 
  Image as ImageIcon, 
  Check, 
  FileArchive,
  Share2
} from 'lucide-react';
import { ProcessedDepthData } from '../utils/depthEstimator';
import { HologramParameters, CameraSnapshot } from '../types/hologram';
import { 
  exportToWavefrontObj, 
  exportToPlyPointCloud, 
  exportToStlMesh, 
  generatePyramidHologramCanvas, 
  generateStandaloneHologramGLSL, 
  downloadBlob 
} from '../utils/geometry3d';
import { hologramSound } from '../audio/HologramSoundEngine';

interface AssetExportDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  depthData: ProcessedDepthData | null;
  snapshot: CameraSnapshot | null;
  params: HologramParameters;
}

export const AssetExportDrawer: React.FC<AssetExportDrawerProps> = ({
  isOpen,
  onClose,
  depthData,
  snapshot,
  params,
}) => {
  const [downloadedFormat, setDownloadedFormat] = useState<string | null>(null);

  if (!isOpen || !depthData) return null;

  const baseFileName = snapshot?.title.toLowerCase().replace(/\s+/g, '_') || 'hologram_asset';

  const markDownloaded = (format: string) => {
    setDownloadedFormat(format);
    hologramSound.triggerHologramCaptureChime();
    setTimeout(() => setDownloadedFormat(null), 2500);
  };

  // 1. Export OBJ
  const handleExportObj = () => {
    const objText = exportToWavefrontObj(depthData, baseFileName);
    downloadBlob(objText, `${baseFileName}_mesh.obj`, 'text/plain');
    markDownloaded('obj');
  };

  // 2. Export PLY Point Cloud
  const handleExportPly = () => {
    const plyText = exportToPlyPointCloud(depthData, baseFileName);
    downloadBlob(plyText, `${baseFileName}_pointcloud.ply`, 'text/plain');
    markDownloaded('ply');
  };

  // 3. Export STL 3D Print
  const handleExportStl = () => {
    const stlText = exportToStlMesh(depthData, baseFileName);
    downloadBlob(stlText, `${baseFileName}_print.stl`, 'text/plain');
    markDownloaded('stl');
  };

  // 4. Export GLSL Shader
  const handleExportGlsl = () => {
    const glslText = generateStandaloneHologramGLSL(params.colorTheme, params);
    downloadBlob(glslText, `${baseFileName}_hologram.glsl`, 'text/plain');
    markDownloaded('glsl');
  };

  // 5. Export 4-Way Pyramid Hologram PNG
  const handleExportPyramidPng = () => {
    if (!snapshot) return;
    const img = new Image();
    img.onload = () => {
      const sourceCanvas = document.createElement('canvas');
      sourceCanvas.width = img.width;
      sourceCanvas.height = img.height;
      const ctx = sourceCanvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);

      const pyramidCanvas = generatePyramidHologramCanvas(sourceCanvas, 1080);
      pyramidCanvas.toBlob((blob) => {
        if (blob) {
          downloadBlob(blob, `${baseFileName}_pyramid_4way.png`, 'image/png');
          markDownloaded('pyramid');
        }
      });
    };
    img.src = snapshot.dataUrl;
  };

  // 6. Export Depth & Normal Maps
  const handleExportMaps = () => {
    // Download depth map
    const link1 = document.createElement('a');
    link1.href = depthData.depthMapDataUrl;
    link1.download = `${baseFileName}_depthmap.png`;
    link1.click();

    // Download normal map
    setTimeout(() => {
      const link2 = document.createElement('a');
      link2.href = depthData.normalMapDataUrl;
      link2.download = `${baseFileName}_normalmap.png`;
      link2.click();
      markDownloaded('maps');
    }, 200);
  };

  // 7. Export JSON Manifest Package
  const handleExportJsonManifest = () => {
    const manifest = {
      assetId: snapshot?.id || `asset_${Date.now()}`,
      name: snapshot?.title || 'Hologram Asset',
      timestamp: new Date().toISOString(),
      generator: 'HoloCraft 3D Camera Studio v1.0.0',
      harmonicTuning: '432 Hz Solfeggio',
      pointCount: depthData.pointCount,
      dimensions: {
        width: depthData.width,
        height: depthData.height,
        displacementScale: params.displacementScale,
      },
      shaderParameters: params,
      aiAnalysis: snapshot?.aiAnalysis || null,
    };
    downloadBlob(JSON.stringify(manifest, null, 2), `${baseFileName}_manifest.json`, 'application/json');
    markDownloaded('json');
  };

  // 8. Download All Assets in One Bundle
  const handleDownloadAll = () => {
    handleExportObj();
    setTimeout(handleExportPly, 300);
    setTimeout(handleExportStl, 600);
    setTimeout(handleExportGlsl, 900);
    setTimeout(handleExportPyramidPng, 1200);
    setTimeout(handleExportJsonManifest, 1500);
    markDownloaded('all');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-slate-950 border border-white/15 rounded-3xl flex flex-col shadow-2xl overflow-hidden font-mono">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <Download className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-base font-bold text-white font-mono">
                3D & HOLOGRAM ASSET EXPORT SUITE
              </h2>
              <p className="text-xs text-slate-400">
                Generate production assets from camera depth capture ({depthData.pointCount.toLocaleString()} vertices)
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

        {/* Content Format Cards Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-3.5 max-h-[70vh] overflow-y-auto">
          {/* 1. Wavefront OBJ */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between hover:border-cyan-400/40 transition-all">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-400/20 shrink-0">
                <Box className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase">3D Mesh (.OBJ)</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                  Triangulated polygonal mesh with vertex colors and surface normals. Ready for Blender, Unreal Engine, Unity.
                </p>
              </div>
            </div>
            <button
              onClick={handleExportObj}
              className="mt-3 w-full py-2 rounded-xl bg-white/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              {downloadedFormat === 'obj' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Download className="w-3.5 h-3.5" />}
              <span>{downloadedFormat === 'obj' ? 'Exported OBJ' : 'Download .OBJ'}</span>
            </button>
          </div>

          {/* 2. Stanford PLY Point Cloud */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between hover:border-cyan-400/40 transition-all">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-400/20 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase">Point Cloud (.PLY)</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                  RGB colored particle cloud for volumetric displays, Looking Glass, Gaussian splatting, and VFX.
                </p>
              </div>
            </div>
            <button
              onClick={handleExportPly}
              className="mt-3 w-full py-2 rounded-xl bg-white/10 hover:bg-purple-500/20 text-purple-300 border border-purple-400/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              {downloadedFormat === 'ply' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Download className="w-3.5 h-3.5" />}
              <span>{downloadedFormat === 'ply' ? 'Exported PLY' : 'Download .PLY'}</span>
            </button>
          </div>

          {/* 3. 3D Printable STL */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between hover:border-cyan-400/40 transition-all">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-400/20 shrink-0">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase">3D Printable (.STL)</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                  Watertight solid relief mesh ready to slice in Cura, PrusaSlicer, or Bambu Studio for physical 3D printing.
                </p>
              </div>
            </div>
            <button
              onClick={handleExportStl}
              className="mt-3 w-full py-2 rounded-xl bg-white/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              {downloadedFormat === 'stl' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Download className="w-3.5 h-3.5" />}
              <span>{downloadedFormat === 'stl' ? 'Exported STL' : 'Download .STL'}</span>
            </button>
          </div>

          {/* 4. 4-Way Pyramid Hologram */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between hover:border-cyan-400/40 transition-all">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-400/20 shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase">Pyramid Hologram (.PNG)</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                  1080p 4-view quadrant layout for phone/tablet transparent pyramid hologram reflectors (Pepper's ghost).
                </p>
              </div>
            </div>
            <button
              onClick={handleExportPyramidPng}
              className="mt-3 w-full py-2 rounded-xl bg-white/10 hover:bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              {downloadedFormat === 'pyramid' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Download className="w-3.5 h-3.5" />}
              <span>{downloadedFormat === 'pyramid' ? 'Exported 4-Way' : 'Download Pyramid PNG'}</span>
            </button>
          </div>

          {/* 5. Hologram GLSL Shader */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between hover:border-cyan-400/40 transition-all">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-400/20 shrink-0">
                <FileCode className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase">GLSL Hologram Shader (.GLSL)</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                  Standalone fragment shader with chromatic aberration, scanlines, and Fresnel glow code for WebGL.
                </p>
              </div>
            </div>
            <button
              onClick={handleExportGlsl}
              className="mt-3 w-full py-2 rounded-xl bg-white/10 hover:bg-pink-500/20 text-pink-300 border border-pink-400/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              {downloadedFormat === 'glsl' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Download className="w-3.5 h-3.5" />}
              <span>{downloadedFormat === 'glsl' ? 'Exported GLSL' : 'Download .GLSL'}</span>
            </button>
          </div>

          {/* 6. Depth & Normal Map Textures */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between hover:border-cyan-400/40 transition-all">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-400/20 shrink-0">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase">Depth & Normal Maps (PNG)</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                  Export calculated 2D grayscale Z-depth and RGB tangent surface normal displacement texture maps.
                </p>
              </div>
            </div>
            <button
              onClick={handleExportMaps}
              className="mt-3 w-full py-2 rounded-xl bg-white/10 hover:bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              {downloadedFormat === 'maps' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Download className="w-3.5 h-3.5" />}
              <span>{downloadedFormat === 'maps' ? 'Exported Maps' : 'Download Maps'}</span>
            </button>
          </div>
        </div>

        {/* Footer with 1-Click Master Download Bundle */}
        <div className="px-6 py-4 border-t border-white/10 bg-slate-900/60 flex items-center justify-between">
          <button
            onClick={handleExportJsonManifest}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-xs flex items-center gap-1.5"
          >
            <FileCode className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export Manifest JSON</span>
          </button>

          <button
            onClick={handleDownloadAll}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 text-xs font-bold flex items-center gap-2 shadow-lg"
          >
            <FileArchive className="w-4 h-4" />
            <span>DOWNLOAD COMPLETE ASSET SUITE</span>
          </button>
        </div>
      </div>
    </div>
  );
};
