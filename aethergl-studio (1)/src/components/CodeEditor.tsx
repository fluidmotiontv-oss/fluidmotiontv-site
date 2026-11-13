import React, { useRef, useEffect, useState } from 'react';
import { Play, Copy, RefreshCw, Code2, AlertTriangle, Lightbulb } from 'lucide-react';

interface CodeEditorProps {
  value: string;
  onChange: (val: string) => void;
  error: string | null;
  onCompile: () => void;
  title: string;
  type: 'vertex' | 'fragment';
}

export default function CodeEditor({
  value,
  onChange,
  error,
  onCompile,
  title,
  type,
}: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  // Sync scroll of line numbers and highlight overlay with textarea
  const handleScroll = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      if (lineNumbersRef.current) {
        lineNumbersRef.current.scrollTop = textarea.scrollTop;
      }
      if (preRef.current) {
        preRef.current.scrollTop = textarea.scrollTop;
        preRef.current.scrollLeft = textarea.scrollLeft;
      }
    }
  };

  // Generate line numbers
  const lines = value.split('\n');
  const lineCount = lines.length;

  // Simple GLSL syntax highlighter matching
  const highlightGLSL = (text: string) => {
    if (!text) return '';
    
    // Escaping HTML entities to prevent injection
    let escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Keywords
    const keywords = [
      'attribute', 'varying', 'uniform', 'const', 'void', 'precision', 'mediump', 'highp', 'lowp',
      'return', 'if', 'else', 'for', 'break', 'discard', 'struct', 'layout'
    ];
    // Types
    const types = [
      'float', 'int', 'bool', 'vec2', 'vec3', 'vec4', 'mat2', 'mat3', 'mat4', 'sampler2D', 'samplerCube'
    ];
    // Built-ins & standard functions
    const builtins = [
      'gl_Position', 'gl_FragColor', 'gl_FragCoord', 'sin', 'cos', 'tan', 'asin', 'acos', 'atan',
      'pow', 'exp', 'log', 'sqrt', 'abs', 'sign', 'floor', 'ceil', 'fract', 'mod', 'min', 'max',
      'clamp', 'mix', 'step', 'smoothstep', 'length', 'distance', 'dot', 'cross', 'normalize',
      'reflect', 'refract', 'texture2D', 'texture'
    ];

    // Highlight comments
    escaped = escaped.replace(/(\/\/[^\n]*)/g, '<span class="text-gray-500 font-light">$1</span>');
    escaped = escaped.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="text-gray-500 font-light">$1</span>');

    // Highlight numbers
    escaped = escaped.replace(/\b(\d+(\.\d+)?f?)\b/g, '<span class="text-amber-400">$1</span>');

    // Match keywords
    keywords.forEach(kw => {
      const regex = new RegExp(`\\b${kw}\\b`, 'g');
      escaped = escaped.replace(regex, `<span class="text-pink-400 font-semibold">${kw}</span>`);
    });

    // Match types
    types.forEach(t => {
      const regex = new RegExp(`\\b${t}\\b`, 'g');
      escaped = escaped.replace(regex, `<span class="text-cyan-400">${t}</span>`);
    });

    // Match functions & builtins
    builtins.forEach(bi => {
      const regex = new RegExp(`\\b${bi}\\b`, 'g');
      escaped = escaped.replace(regex, `<span class="text-purple-400">${bi}</span>`);
    });

    return escaped;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Quick helper injectors
  const helpers = [
    {
      label: 'Smooth Min (smin)',
      code: '\nfloat smin(float a, float b, float k) {\n  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);\n  return mix(b, a, h) - k * h * (1.0 - h);\n}\n',
    },
    {
      label: 'Hash 2D (hash21)',
      code: '\nfloat hash21(vec2 p) {\n  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);\n}\n',
    },
    {
      label: 'Rotate 2D',
      code: '\nmat2 rotate2d(float angle) {\n  return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));\n}\n',
    },
    {
      label: 'Noise FBM',
      code: '\n// Fractional Brownian Motion\nfloat fbm(vec2 p) {\n  float v = 0.0;\n  float a = 0.5;\n  vec2 shift = vec2(100.0);\n  for (int i = 0; i < 4; ++i) {\n    v += a * sin(p.x * 2.0);\n    p = p * 2.0 + shift;\n    a *= 0.5;\n  }\n  return v;\n}\n',
    }
  ];

  const injectCode = (code: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = textarea.value;

    const newText = currentText.substring(0, start) + code + currentText.substring(end);
    onChange(newText);

    // Reposition cursor
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + code.length, start + code.length);
    }, 10);
  };

  // Parse compilation error details if available
  const parsedError = (() => {
    if (!error) return null;
    
    // WebGL error usually format: ERROR: 0:line_number: 'error_details'
    const match = error.match(/ERROR:\s+\d+:(\d+):/i) || error.match(/(\d+):/);
    if (match) {
      const lineNum = parseInt(match[1]);
      return {
        line: lineNum,
        message: error.replace(/ERROR:\s+\d+:\d+:\s+/i, ''),
      };
    }
    return { line: null, message: error };
  })();

  return (
    <div className="flex flex-col h-full bg-[#111218] border border-[#1f212a] rounded-xl overflow-hidden shadow-2xl">
      {/* Editor Header Contract */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0e0f14] border-b border-[#1f212a]">
        <div className="flex items-center gap-2">
          <Code2 className={`w-4 h-4 ${type === 'fragment' ? 'text-purple-400' : 'text-cyan-400'}`} />
          <span className="text-xs font-semibold uppercase tracking-wider font-mono text-gray-300">
            {title}
          </span>
          <span className="text-[10px] bg-black/40 text-gray-500 font-mono px-2 py-0.5 rounded">
            GLSL ES 1.00
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyToClipboard}
            className="p-1.5 hover:bg-white/5 text-gray-400 hover:text-white rounded transition-colors text-xs flex items-center gap-1.5 font-mono"
            title="Copy entire shader source"
          >
            <Copy className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[10px]">{copied ? 'Copied' : 'Copy'}</span>
          </button>
          
          <button
            onClick={onCompile}
            className="px-3 py-1 bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 font-semibold text-[11px] rounded flex items-center gap-1.5 transition-colors font-mono"
          >
            <Play className="w-3 h-3 fill-cyan-300" />
            COMPILE
          </button>
        </div>
      </div>

      {/* Main Textarea Canvas */}
      <div className="flex-1 flex overflow-hidden relative font-mono text-[13px] leading-relaxed">
        {/* Line Numbers column */}
        <div
          ref={lineNumbersRef}
          className="w-12 bg-[#0c0d12] text-gray-600 text-right pr-3 pl-1 select-none py-4 border-r border-[#1f212a]/30 overflow-hidden"
        >
          {Array.from({ length: lineCount }).map((_, i) => {
            const isErrorLine = parsedError?.line === i + 1;
            return (
              <div 
                key={i} 
                className={`h-[19.5px] pr-0.5 ${isErrorLine ? 'bg-red-500/20 text-red-400 font-bold border-r-2 border-red-500' : ''}`}
              >
                {i + 1}
              </div>
            );
          })}
        </div>

        {/* Text Area and Highlight Overlap Layer */}
        <div className="flex-1 relative h-full overflow-hidden">
          {/* Highlighter Highlight Pre element */}
          <pre
            ref={preRef}
            className="absolute top-0 left-0 w-full h-full p-4 pointer-events-none select-none text-transparent whitespace-pre overflow-auto font-mono text-[13px] leading-relaxed m-0"
            dangerouslySetInnerHTML={{ __html: highlightGLSL(value) }}
          />

          {/* Real interactive Textarea */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onScroll={handleScroll}
            className="absolute top-0 left-0 w-full h-full p-4 bg-transparent text-white/90 caret-cyan-400 focus:outline-none resize-none overflow-auto font-mono text-[13px] leading-relaxed whitespace-pre"
            spellCheck="false"
            style={{ WebkitTextFillColor: 'transparent' }} // Keep cursor visible but hide raw text to show highlighter underneath
          />
        </div>
      </div>

      {/* GLSL Helper Insert panel */}
      <div className="px-3 py-2 bg-[#0e0f14] border-t border-[#1f212a] flex items-center gap-2 overflow-x-auto">
        <span className="text-[10px] text-gray-500 font-mono uppercase font-semibold shrink-0 flex items-center gap-1">
          <Lightbulb className="w-3 h-3 text-yellow-500" /> Inserts:
        </span>
        {helpers.map((h, i) => (
          <button
            key={i}
            onClick={() => injectCode(h.code)}
            className="px-2 py-0.5 bg-[#171822] border border-[#232635] text-[10px] text-gray-400 hover:text-white rounded hover:border-gray-500 font-mono transition-colors whitespace-nowrap shrink-0"
          >
            + {h.label}
          </button>
        ))}
      </div>

      {/* Compiler Error Status Overlay */}
      {parsedError && (
        <div className="bg-red-950/80 border-t border-red-900/60 p-3 flex items-start gap-2.5 backdrop-blur-sm">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1 font-mono text-xs">
            <div className="font-semibold text-red-400 flex items-center gap-1.5">
              Compilation Error
              {parsedError.line && (
                <span className="bg-red-900/60 text-red-300 text-[10px] px-1.5 py-0.5 rounded border border-red-500/20">
                  Line {parsedError.line}
                </span>
              )}
            </div>
            <p className="text-red-300/90 mt-1 whitespace-pre-wrap leading-relaxed select-text">
              {parsedError.message}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
