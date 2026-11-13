import React, { useState } from 'react';
import { Download, FileCode, CheckCircle2, Copy, X, Code, Globe } from 'lucide-react';
import { WebGLObject, UniformValue } from './WebGLCanvas';

interface ExportModalProps {
  onClose: () => void;
  objects: WebGLObject[];
  vertexShader: string;
  fragmentShader: string;
  customUniforms: UniformValue[];
  isScreenSpaceMode: boolean;
}

export default function ExportModal({
  onClose,
  objects,
  vertexShader,
  fragmentShader,
  customUniforms,
  isScreenSpaceMode,
}: ExportModalProps) {
  const [copied, setCopied] = useState(false);

  // Generate Standalone HTML File code incorporating interactive inputs
  const generateStandaloneHTML = (): string => {
    // Generate Uniform interactive controls inputs
    const uniformControlsHTML = customUniforms
      .map((u) => {
        if (u.type === 'float') {
          return `
        <div class="control-group">
          <label>${u.name}</label>
          <div class="slider-wrapper">
            <input type="range" id="input_${u.name}" min="-2.0" max="5.0" step="0.01" value="${u.value[0]}">
            <span id="val_${u.name}">${u.value[0]}</span>
          </div>
        </div>`;
        }
        if (u.type === 'color') {
          const hex = `#${u.value.map(c => Math.floor(Math.max(0, Math.min(1, c)) * 255).toString(16).padStart(2, '0')).join('')}`;
          return `
        <div class="control-group">
          <label>${u.name} (Color)</label>
          <input type="color" id="input_${u.name}" value="${hex}">
        </div>`;
        }
        return ''; // Keep other types simple for HTML templates
      })
      .join('\n');

    // Generate Javascript binder for custom uniform inputs
    const uniformBindersJS = customUniforms
      .map((u) => {
        if (u.type === 'float') {
          return `
      const ${u.name}Loc = gl.getUniformLocation(program, '${u.name}');
      const el_${u.name} = document.getElementById('input_${u.name}');
      const val_${u.name} = document.getElementById('val_${u.name}');
      if (el_${u.name}) {
        el_${u.name}.addEventListener('input', (e) => {
          val_${u.name}.innerText = e.target.value;
        });
      }
      // Uniform binding in loop
      if (${u.name}Loc && el_${u.name}) {
        gl.uniform1f(${u.name}Loc, parseFloat(el_${u.name}.value));
      }`;
        }
        if (u.type === 'color') {
          return `
      const ${u.name}Loc = gl.getUniformLocation(program, '${u.name}');
      const el_${u.name} = document.getElementById('input_${u.name}');
      if (${u.name}Loc && el_${u.name}) {
        const hex = el_${u.name}.value;
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        gl.uniform3f(${u.name}Loc, r, g, b);
      }`;
        }
        return '';
      })
      .join('\n');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AetherGL Standalone Engine</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #07080a; color: #c5c6c7; font-family: system-ui, -apple-system, sans-serif; overflow: hidden; height: 100vh; display: flex; }
    canvas { width: 100%; height: 100%; display: block; flex: 1; }
    
    /* Interactive Controller HUD panel */
    #hud {
      width: 320px;
      background: rgba(11, 12, 16, 0.95);
      border-left: 1px solid rgba(255, 255, 255, 0.1);
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      overflow-y: auto;
      z-index: 10;
      backdrop-filter: blur(12px);
    }
    h1 { font-size: 16px; text-transform: uppercase; letter-spacing: 1px; color: #00f3ff; margin-bottom: 8px; font-family: monospace; }
    .control-group { display: flex; flex-direction: column; gap: 6px; }
    label { font-size: 11px; font-family: monospace; color: #8892b0; }
    .slider-wrapper { display: flex; items-center; gap: 12px; }
    input[type="range"] { flex: 1; accent-color: #00f3ff; }
    span { font-size: 11px; font-family: monospace; min-width: 35px; text-align: right; }
    input[type="color"] { width: 100%; height: 32px; border: none; background: transparent; cursor: pointer; }
    .footer { font-size: 10px; font-family: monospace; color: #454d66; text-align: center; margin-top: auto; }
  </style>
</head>
<body>

  <canvas id="glCanvas"></canvas>

  <div id="hud">
    <h1>AetherGL Shader Studio</h1>
    <p style="font-size: 11px; color: #8892b0; margin-bottom: 12px; font-family: monospace;">Interactive local render engine</p>
    
    <!-- Custom interactive Uniform range controls -->
    ${uniformControlsHTML}

    <div class="footer">
      Powered by AetherGL Forge
    </div>
  </div>

  <script>
    const canvas = document.getElementById('glCanvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      alert('WebGL not supported in your browser.');
    }

    // Shader Source Code
    const vsSource = \`${vertexShader.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`;
    const fsSource = \`${fragmentShader.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`;

    function compileShader(source, type) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        return null;
      }
      return shader;
    }

    const vs = compileShader(vsSource, gl.VERTEX_SHADER);
    const fs = compileShader(fsSource, gl.FRAGMENT_SHADER);
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Linkage failed', gl.getProgramInfoLog(program));
    }

    // Create simple full screen plane attributes for raymarching / display
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1, 0,
       1, -1, 0,
       1,  1, 0,
      -1,  1, 0
    ]), gl.STATIC_DRAW);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([
      0, 1, 2,
      0, 2, 3
    ]), gl.STATIC_DRAW);

    const positionAttr = gl.getAttribLocation(program, 'a_position');

    const startTime = Date.now();
    let mouse = [0.5, 0.5];

    window.addEventListener('mousemove', (e) => {
      mouse[0] = e.clientX / window.innerWidth;
      mouse[1] = 1.0 - (e.clientY / window.innerHeight);
    });

    function render() {
      // Auto resize viewport
      if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }

      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);

      // System uniform bindings
      const uTimeLoc = gl.getUniformLocation(program, 'u_time');
      if (uTimeLoc) gl.uniform1f(uTimeLoc, (Date.now() - startTime) / 1000);

      const uResolutionLoc = gl.getUniformLocation(program, 'u_resolution');
      if (uResolutionLoc) gl.uniform2f(uResolutionLoc, canvas.width, canvas.height);

      const uMouseLoc = gl.getUniformLocation(program, 'u_mouse');
      if (uMouseLoc) gl.uniform2f(uMouseLoc, mouse[0], mouse[1]);

      // Custom uniform binders
      ${uniformBindersJS}

      // Draw Screen space Plane
      if (positionAttr !== -1) {
        gl.enableVertexAttribArray(positionAttr);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.vertexAttribPointer(positionAttr, 3, gl.FLOAT, false, 0, 0);
      }

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

      requestAnimationFrame(render);
    }

    render();
  </script>
</body>
</html>`;
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportHTML = () => {
    const htmlCode = generateStandaloneHTML();
    downloadFile(htmlCode, 'aethergl-forge-export.html', 'text/html');
  };

  const handleExportJSON = () => {
    const projectData = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      isScreenSpaceMode,
      objects,
      vertexShader,
      fragmentShader,
      customUniforms,
    };
    downloadFile(JSON.stringify(projectData, null, 2), 'aethergl-project-forge.json', 'application/json');
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0e0f14] border border-[#1f212a] rounded-xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col">
        {/* Header bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#1f212a] bg-[#111218]">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-300 font-mono">
              Export WebGL Project
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/5 rounded text-gray-500 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Export options list */}
        <div className="p-5 space-y-4 flex-1">
          <p className="text-xs text-gray-400 leading-relaxed font-sans mb-2">
            Choose an export mechanism to download your custom shaders, interactive custom params, or standard objects parameters.
          </p>

          <div className="grid grid-cols-1 gap-3 font-sans">
            {/* Download Standalone Single HTML option */}
            <button
              onClick={handleExportHTML}
              className="group p-4 bg-[#171822]/60 hover:bg-cyan-500/10 border border-[#1f212a] hover:border-cyan-500/30 rounded-xl text-left transition-all flex items-start gap-4"
            >
              <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0 group-hover:scale-105 transition-transform">
                <Globe className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-bold text-white mb-0.5 font-mono">
                  Interactive Standalone HTML
                </h3>
                <p className="text-[11px] text-gray-400 leading-normal">
                  Exports a completely self-contained single webpage featuring your GLSL code, elapsed animation bindings, mouse inputs, and HTML interface controls. Works anywhere offline!
                </p>
              </div>
            </button>

            {/* Download JSON bundle option */}
            <button
              onClick={handleExportJSON}
              className="group p-4 bg-[#171822]/60 hover:bg-emerald-500/10 border border-[#1f212a] hover:border-emerald-500/30 rounded-xl text-left transition-all flex items-start gap-4"
            >
              <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
                <FileCode className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-bold text-white mb-0.5 font-mono">
                  Complete Project JSON Bundle
                </h3>
                <p className="text-[11px] text-gray-400 leading-normal">
                  Downloads all custom mesh node configurations, translation coordinates, uniform sliders, and raw shader text buffers in a single structured schema. Perfect for backing up.
                </p>
              </div>
            </button>

            {/* Separate Shader download options */}
            <div className="border border-[#1f212a] bg-[#111218]/40 rounded-xl p-3.5 space-y-2.5 font-mono">
              <span className="text-[10px] font-semibold text-gray-500 uppercase block">
                Export Raw Shaders (.glsl)
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => downloadFile(vertexShader, 'shader.vert', 'text/plain')}
                  className="py-2 bg-[#171822] hover:bg-white/5 border border-[#232635] hover:border-gray-500 rounded text-[11px] text-gray-300 font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <Code className="w-3.5 h-3.5" />
                  Vertex Shader (.vert)
                </button>
                <button
                  onClick={() => downloadFile(fragmentShader, 'shader.frag', 'text/plain')}
                  className="py-2 bg-[#171822] hover:bg-white/5 border border-[#232635] hover:border-gray-500 rounded text-[11px] text-gray-300 font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <Code className="w-3.5 h-3.5" />
                  Fragment Shader (.frag)
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Footer info bar */}
        <div className="px-4 py-3 bg-[#0c0d12] border-t border-[#1f212a] flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#171822] text-xs font-semibold text-gray-300 border border-[#232635] hover:border-gray-500 rounded transition-colors font-mono"
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
}
