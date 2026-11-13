/**
 * HoloCraft 3D - Standalone GLSL Raymarch & Hologram Shader Studio
 */

import React, { useState, useEffect } from 'react';
import { 
  FileCode, 
  Copy, 
  Check, 
  Download, 
  Play, 
  RotateCcw, 
  Sparkles, 
  Layers, 
  Code 
} from 'lucide-react';
import { HologramParameters, CameraSnapshot } from '../types/hologram';
import { generateStandaloneHologramGLSL, downloadBlob } from '../utils/geometry3d';
import { hologramSound } from '../audio/HologramSoundEngine';

interface GlslRaymarchStudioProps {
  params: HologramParameters;
  snapshot: CameraSnapshot | null;
}

export const GlslRaymarchStudio: React.FC<GlslRaymarchStudioProps> = ({
  params,
  snapshot,
}) => {
  const [shaderCode, setShaderCode] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  useEffect(() => {
    const code = generateStandaloneHologramGLSL(params.colorTheme, params);
    setShaderCode(code);
  }, [params]);

  const handleCopy = () => {
    navigator.clipboard.writeText(shaderCode);
    setIsCopied(true);
    hologramSound.triggerLaserScanSound();
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = `${snapshot?.title.toLowerCase().replace(/\s+/g, '_') || 'hologram'}_shader.glsl`;
    downloadBlob(shaderCode, filename, 'text/plain');
    hologramSound.triggerHologramCaptureChime();
  };

  return (
    <div className="flex flex-col bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl p-6 gap-4 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-400/20">
            <FileCode className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              STANDALONE GLSL HOLOGRAM SHADER CODE
            </h3>
            <p className="text-xs text-slate-400">
              GLSL ES 3.0 Fragment Shader with Chromatic Laser Aberration, Scanlines, and Fresnel Bloom
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 text-xs rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 flex items-center gap-1.5 transition-colors"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{isCopied ? 'Copied' : 'Copy Shader'}</span>
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-1.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-pink-400 to-cyan-400 hover:from-pink-300 hover:to-cyan-300 rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .GLSL</span>
          </button>
        </div>
      </div>

      {/* Code Editor Preview */}
      <div className="relative">
        <textarea
          value={shaderCode}
          onChange={(e) => setShaderCode(e.target.value)}
          rows={16}
          className="w-full p-4 rounded-xl bg-black/60 border border-white/10 text-slate-200 text-xs font-mono leading-relaxed focus:outline-none focus:border-cyan-400/60 selection:bg-cyan-500/30 selection:text-cyan-200"
          spellCheck={false}
        />
      </div>

      {/* Integration guide */}
      <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-400/20 text-xs text-cyan-200 leading-relaxed flex items-start gap-2.5">
        <Code className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <p>
          This GLSL fragment shader can be directly loaded into Three.js <code className="text-cyan-300 font-bold">THREE.ShaderMaterial</code>, Shadertoy, TouchDesigner, or Unity Custom Render Passes.
        </p>
      </div>
    </div>
  );
};
