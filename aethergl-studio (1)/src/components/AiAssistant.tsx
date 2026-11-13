import React, { useState } from 'react';
import { Sparkles, Send, Loader2, BookOpen, Sliders, CheckCircle, RefreshCw, AlertCircle, MessageSquare } from 'lucide-react';
import { UniformValue } from './WebGLCanvas';

interface AiAssistantProps {
  currentVertex: string;
  currentFragment: string;
  currentUniforms: UniformValue[];
  onApplyGeneratedShader: (data: {
    title: string;
    vertexShader: string;
    fragmentShader: string;
    uniforms: {
      name: string;
      type: 'float' | 'vec2' | 'vec3' | 'vec4' | 'color';
      defaultValue: number[];
      min?: number;
      max?: number;
      description: string;
    }[];
    explanation: string;
  }) => void;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  payload?: any;
}

export default function AiAssistant({
  currentVertex,
  currentFragment,
  currentUniforms,
  onApplyGeneratedShader,
}: AiAssistantProps) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  // Chat log history
  const [chatLog, setChatLog] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Hello! I'm your **Aether AI Shader Engineer**. Describe any visual effect, SDF geometry, or procedural landscape you'd like to create, and I'll generate high-performance GLSL code and interactive sliders for you!",
    }
  ]);

  const [lastGeneratedPayload, setLastGeneratedPayload] = useState<any | null>(null);
  const [hasApplied, setHasApplied] = useState(false);

  const handleSubmit = async (e: React.FormEvent, customPrompt?: string) => {
    e.preventDefault();
    const activePrompt = customPrompt || prompt.trim();
    if (!activePrompt || loading) return;

    setPrompt('');
    setError(null);
    setHasApplied(false);
    
    // Add user message to log
    const updatedLog: ChatMessage[] = [
      ...chatLog,
      { role: 'user', content: activePrompt }
    ];
    setChatLog(updatedLog);
    setLoading(true);

    const stages = [
      'Orchestrating vector math structures...',
      'Synthesizing vertex deformers...',
      'Formulating procedural textures...',
      'Validating matrix coordinates...',
      'Finalizing shader compiler payloads...'
    ];

    let stageIdx = 0;
    setLoadingStage(stages[0]);
    const stageTimer = setInterval(() => {
      stageIdx = (stageIdx + 1) % stages.length;
      setLoadingStage(stages[stageIdx]);
    }, 1800);

    try {
      const response = await fetch('/api/gemini/generate-shader', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: activePrompt,
          currentVertex,
          currentFragment,
          currentUniforms,
          action: chatLog.length > 1 ? 'optimize' : 'create'
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded with status ${response.status}`);
      }

      const data = await response.json();

      setChatLog(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `### 🚀 Generated: ${data.title}\n\n${data.explanation}`,
          payload: data
        }
      ]);
      setLastGeneratedPayload(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during generation.');
      setChatLog(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `❌ **Failed to generate shader:** ${err.message || 'An error occurred during generation.'}`
        }
      ]);
    } finally {
      clearInterval(stageTimer);
      setLoading(false);
      setLoadingStage('');
    }
  };

  const handleApply = () => {
    if (!lastGeneratedPayload) return;
    onApplyGeneratedShader(lastGeneratedPayload);
    setHasApplied(true);
    setTimeout(() => setHasApplied(false), 3000);
  };

  return (
    <div className="flex flex-col h-full bg-[#111218] border border-[#1f212a] rounded-xl overflow-hidden shadow-2xl">
      {/* Header element */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0e0f14] border-b border-[#1f212a]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-300 font-mono">
            AI Shader Engineer
          </h2>
        </div>
        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-mono px-2 py-0.5 rounded border border-emerald-500/20">
          GEMINI 3.8 ACTIVE
        </span>
      </div>

      {/* Chat logs feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#12131a] max-h-[calc(100vh-320px)] sm:max-h-[none]">
        {chatLog.map((msg, i) => (
          <div
            key={i}
            className={`flex items-start gap-2.5 ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.role === 'assistant' && (
              <div className="w-6 h-6 rounded bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            )}
            
            <div
              className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs font-sans leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-cyan-600/25 border border-cyan-500/30 text-cyan-100 rounded-tr-none'
                  : 'bg-[#181a25] border border-[#232635] text-gray-300 rounded-tl-none'
              }`}
            >
              <div className="markdown-content space-y-2 prose prose-invert prose-xs select-text">
                {msg.content.split('\n\n').map((paragraph, pIdx) => {
                  if (paragraph.startsWith('### ')) {
                    return <h3 key={pIdx} className="text-sm font-semibold font-mono text-white pt-1">{paragraph.replace('### ', '')}</h3>;
                  }
                  if (paragraph.startsWith('❌ ') || paragraph.startsWith('🚀 ')) {
                    return <p key={pIdx} className="font-mono text-cyan-300">{paragraph}</p>;
                  }
                  return <p key={pIdx}>{paragraph}</p>;
                })}
              </div>

              {/* Payload action buttons */}
              {msg.payload && (
                <div className="mt-3.5 pt-3 border-t border-[#1f212a] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-gray-500">
                    <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                    {msg.payload.uniforms?.length || 0} Custom Parameters declared
                  </div>
                  
                  <button
                    onClick={() => {
                      setLastGeneratedPayload(msg.payload);
                      handleApply();
                    }}
                    className={`px-3 py-1.5 font-bold rounded text-[11px] font-mono flex items-center justify-center gap-1.5 transition-all ${
                      hasApplied
                        ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                        : 'bg-cyan-500/20 border border-cyan-500/30 hover:bg-cyan-500/30 text-cyan-300'
                    }`}
                  >
                    {hasApplied ? <CheckCircle className="w-3.5 h-3.5" /> : <RefreshCw className="w-3.5 h-3.5" />}
                    {hasApplied ? 'APPLIED SUCCESSFULLY!' : 'APPLY TO WORKSPACE'}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading Spinner Stage Indicator */}
        {loading && (
          <div className="flex items-start gap-2.5 justify-start">
            <div className="w-6 h-6 rounded bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Loader2 className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
            </div>
            <div className="bg-[#181a25] border border-[#232635] text-gray-400 rounded-xl rounded-tl-none px-3.5 py-2.5 text-xs font-mono space-y-1.5 shadow">
              <span className="text-gray-300 flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                AI Model Reasoning...
              </span>
              <p className="text-[10px] text-cyan-400/80 italic">
                "{loadingStage}"
              </p>
            </div>
          </div>
        )}

        {/* Quick Suggestion buttons */}
        {!loading && chatLog.length === 1 && (
          <div className="space-y-2 pt-2">
            <span className="text-[10px] font-mono text-gray-500 uppercase font-semibold block flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" /> Suggested shader ideas:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {[
                'swirling green plasma fluid with neon ripples',
                'ocean wave simulation under a neon pink sun',
                'hyper-realistic 3D metallic liquid mercury ball',
                'scrolling vaporwave wireframe city grid'
              ].map((rec, i) => (
                <button
                  key={i}
                  onClick={(e) => handleSubmit(e, rec)}
                  className="px-2.5 py-2 bg-[#171822] border border-[#232635] text-[10px] text-gray-400 hover:text-cyan-300 hover:border-cyan-500/30 text-left rounded font-mono transition-all truncate"
                >
                  &ldquo;{rec}&rdquo;
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Text Box input form */}
      <form onSubmit={(e) => handleSubmit(e)} className="p-3 border-t border-[#1f212a] bg-[#0e0f14] flex gap-2">
        <input
          type="text"
          placeholder={loading ? 'AI Model compiling...' : 'Prompt shader (e.g. glowing lava surface)...'}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={loading}
          className="flex-1 bg-[#111218] border border-[#232635] focus:border-cyan-500/50 rounded-lg px-3.5 py-2 text-xs font-sans text-white focus:outline-none placeholder-gray-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="bg-cyan-500 text-black font-bold hover:bg-cyan-400 rounded-lg px-3.5 py-2 text-xs shrink-0 flex items-center justify-center gap-1.5 transition-all disabled:opacity-30 disabled:hover:bg-cyan-500 shadow"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">SEND</span>
        </button>
      </form>
    </div>
  );
}
