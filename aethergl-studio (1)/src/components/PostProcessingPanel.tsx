import React from 'react';
import { Sliders, Sun, ShieldCheck, HelpCircle, Eye, RefreshCw, Sparkles, Copy, Check } from 'lucide-react';

export interface PostProcessingConfig {
  bloom: boolean;
  bloomIntensity: number;
  bloomRadius: number;
  vignette: boolean;
  vignetteIntensity: number;
  vignetteSmoothness: number;
  chromatic: boolean;
  chromaticIntensity: number;
}

interface PostProcessingPanelProps {
  config: PostProcessingConfig;
  onChange: (updates: Partial<PostProcessingConfig>) => void;
}

export default function PostProcessingPanel({ config, onChange }: PostProcessingPanelProps) {
  const [copiedText, setCopiedText] = React.useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const glslSnippet = `// === COPY-PASTE POST-PROCESSING GLSL DECLARATIONS ===
uniform float u_bloomEnabled;
uniform float u_bloomIntensity;
uniform float u_bloomRadius;

uniform float u_vignetteEnabled;
uniform float u_vignetteIntensity;
uniform float u_vignetteSmoothness;

uniform float u_chromaticEnabled;
uniform float u_chromaticIntensity;

// Sample helper function to apply Vignette
vec3 applyVignette(vec3 color, vec2 uv) {
  if (u_vignetteEnabled > 0.5) {
    vec2 d = uv - 0.5;
    float dist = length(d);
    float vig = smoothstep(0.8, 1.0 - u_vignetteIntensity * 0.4, dist * u_vignetteSmoothness);
    return color * vig;
  }
  return color;
}

// Sample helper function to apply Chromatic Aberration
vec3 applyChromatic(sampler2D tex, vec2 uv) {
  if (u_chromaticEnabled > 0.5) {
    vec2 offset = vec2(u_chromaticIntensity, 0.0);
    float r = texture2D(tex, uv + offset).r;
    float g = texture2D(tex, uv).g;
    float b = texture2D(tex, uv - offset).b;
    return vec3(r, g, b);
  }
  return texture2D(tex, uv).rgb;
}`;

  return (
    <div className="flex flex-col h-full bg-[#111218] border border-[#1f212a] rounded-xl overflow-hidden shadow-2xl">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0e0f14] border-b border-[#1f212a]">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-300 font-mono">
            Post-Processing Uniforms
          </h2>
        </div>
        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded uppercase font-bold">
          Active
        </span>
      </div>

      <div className="p-3 border-b border-[#1f212a] bg-[#14151e]/40 text-[10px] font-mono text-gray-400 leading-normal flex items-start gap-2 select-none">
        <Sparkles className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
        <p>
          Configure and feed global post-processing variables directly into your custom fragment shaders. Declare these uniform variables inside GLSL to create responsive atmospheric visual fx.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-[#12131a]">
        
        {/* Bloom Module */}
        <div className="p-3.5 bg-[#171822]/60 border border-[#1f212a] hover:border-[#2b2e40] rounded-xl transition-all space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sun className={`w-4 h-4 ${config.bloom ? 'text-amber-400 animate-pulse' : 'text-gray-500'}`} />
              <span className="text-xs font-bold font-mono text-white">1. NEON BLOOM</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.bloom}
                onChange={(e) => onChange({ bloom: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-8 h-4 bg-gray-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-gray-400 after:rounded-full after:h-3 after:w-3.5 after:transition-all peer-checked:bg-cyan-500 peer-checked:after:bg-black"></div>
            </label>
          </div>

          {config.bloom && (
            <div className="space-y-3 pt-2 border-t border-[#1f212a]/40 font-mono text-[10px]">
              {/* Bloom Intensity */}
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">Bloom Intensity</span>
                  <span className="text-cyan-400 font-bold tabular-nums">{(config.bloomIntensity * 10).toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="3.0"
                  step="0.1"
                  value={config.bloomIntensity}
                  onChange={(e) => onChange({ bloomIntensity: parseFloat(e.target.value) })}
                  className="w-full h-1 bg-black/60 rounded accent-cyan-400"
                />
              </div>

              {/* Bloom Radius */}
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">Glow Spread Radius</span>
                  <span className="text-cyan-400 font-bold tabular-nums">{(config.bloomRadius * 10).toFixed(1)}r</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="2.0"
                  step="0.1"
                  value={config.bloomRadius}
                  onChange={(e) => onChange({ bloomRadius: parseFloat(e.target.value) })}
                  className="w-full h-1 bg-black/60 rounded accent-cyan-400"
                />
              </div>
            </div>
          )}
        </div>

        {/* Vignette Module */}
        <div className="p-3.5 bg-[#171822]/60 border border-[#1f212a] hover:border-[#2b2e40] rounded-xl transition-all space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className={`w-4 h-4 ${config.vignette ? 'text-purple-400' : 'text-gray-500'}`} />
              <span className="text-xs font-bold font-mono text-white">2. ATHOSPHERIC VIGNETTE</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.vignette}
                onChange={(e) => onChange({ vignette: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-8 h-4 bg-gray-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-gray-400 after:rounded-full after:h-3 after:w-3.5 after:transition-all peer-checked:bg-cyan-500 peer-checked:after:bg-black"></div>
            </label>
          </div>

          {config.vignette && (
            <div className="space-y-3 pt-2 border-t border-[#1f212a]/40 font-mono text-[10px]">
              {/* Vignette Intensity */}
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">Dark Border Intensity</span>
                  <span className="text-cyan-400 font-bold tabular-nums">{(config.vignetteIntensity * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="2.0"
                  step="0.05"
                  value={config.vignetteIntensity}
                  onChange={(e) => onChange({ vignetteIntensity: parseFloat(e.target.value) })}
                  className="w-full h-1 bg-black/60 rounded accent-cyan-400"
                />
              </div>

              {/* Vignette Smoothness */}
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">Border Blend Falloff</span>
                  <span className="text-cyan-400 font-bold tabular-nums">{(config.vignetteSmoothness * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={config.vignetteSmoothness}
                  onChange={(e) => onChange({ vignetteSmoothness: parseFloat(e.target.value) })}
                  className="w-full h-1 bg-black/60 rounded accent-cyan-400"
                />
              </div>
            </div>
          )}
        </div>

        {/* Chromatic Aberration Module */}
        <div className="p-3.5 bg-[#171822]/60 border border-[#1f212a] hover:border-[#2b2e40] rounded-xl transition-all space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RefreshCw className={`w-4 h-4 ${config.chromatic ? 'text-emerald-400 animate-spin' : 'text-gray-500'}`} style={{ animationDuration: '4s' }} />
              <span className="text-xs font-bold font-mono text-white">3. CHROMATIC SPLIT</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.chromatic}
                onChange={(e) => onChange({ chromatic: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-8 h-4 bg-gray-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-gray-400 after:rounded-full after:h-3 after:w-3.5 after:transition-all peer-checked:bg-cyan-500 peer-checked:after:bg-black"></div>
            </label>
          </div>

          {config.chromatic && (
            <div className="space-y-3 pt-2 border-t border-[#1f212a]/40 font-mono text-[10px]">
              {/* Chromatic Intensity */}
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">Spectral Red/Blue Split</span>
                  <span className="text-cyan-400 font-bold tabular-nums">{(config.chromaticIntensity * 1000).toFixed(1)}px</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="0.05"
                  step="0.001"
                  value={config.chromaticIntensity}
                  onChange={(e) => onChange({ chromaticIntensity: parseFloat(e.target.value) })}
                  className="w-full h-1 bg-black/60 rounded accent-cyan-400"
                />
              </div>
            </div>
          )}
        </div>

        {/* GLSL Reference Integration */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-gray-500 uppercase">GLSL Uniform Integration</span>
            <button
              onClick={() => handleCopy(glslSnippet, 'glsl')}
              className="px-2 py-1 bg-[#171822] hover:bg-[#232635] text-[9px] font-mono font-semibold text-gray-400 hover:text-cyan-400 rounded border border-[#232635] flex items-center gap-1.5 transition-all"
            >
              {copiedText === 'glsl' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              {copiedText === 'glsl' ? 'Copied' : 'Copy Snippet'}
            </button>
          </div>
          
          <pre className="bg-[#0b0c10] border border-[#1f212a] p-3 rounded-lg text-[9px] font-mono text-cyan-300 leading-relaxed overflow-x-auto max-h-48 scrollbar-thin select-all">
            {glslSnippet}
          </pre>
        </div>

      </div>
    </div>
  );
}
