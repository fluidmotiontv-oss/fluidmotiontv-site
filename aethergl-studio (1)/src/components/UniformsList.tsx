import React, { useState } from 'react';
import { Sliders, Plus, Trash2, HelpCircle, ToggleLeft, Disc } from 'lucide-react';
import { UniformValue } from './WebGLCanvas';

interface UniformsListProps {
  uniforms: UniformValue[];
  onUpdateUniform: (name: string, value: number[]) => void;
  onAddUniform: (uniform: Omit<UniformValue, 'value'> & { defaultValue: number[] }) => void;
  onDeleteUniform: (name: string) => void;
}

export default function UniformsList({
  uniforms,
  onUpdateUniform,
  onAddUniform,
  onDeleteUniform,
}: UniformsListProps) {
  const [newUName, setNewUName] = useState('');
  const [newUType, setNewUType] = useState<'float' | 'vec2' | 'vec3' | 'vec4' | 'color'>('float');
  const [error, setError] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const formattedName = newUName.trim();
    if (!formattedName) {
      setError('Uniform variable name is required.');
      return;
    }

    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(formattedName)) {
      setError('Name must contain only alphanumeric characters or underscores.');
      return;
    }

    // Standard variable names prefix rule (encourage start with u_ but not strictly required unless system default)
    const finalName = formattedName.startsWith('u_') ? formattedName : `u_${formattedName}`;

    if (uniforms.some(u => u.name === finalName)) {
      setError(`Uniform "${finalName}" already exists in the list.`);
      return;
    }

    // Default arrays based on type
    let defaultVal: number[] = [0];
    if (newUType === 'vec2') defaultVal = [0.5, 0.5];
    if (newUType === 'vec3') defaultVal = [0.5, 0.5, 0.5];
    if (newUType === 'color') defaultVal = [0.0, 0.8, 1.0]; // Default gorgeous light cyan
    if (newUType === 'vec4') defaultVal = [0.5, 0.5, 0.5, 0.5];

    onAddUniform({
      name: finalName,
      type: newUType,
      defaultValue: defaultVal,
    });

    setNewUName('');
  };

  return (
    <div className="flex flex-col h-full bg-[#111218] border border-[#1f212a] rounded-xl overflow-hidden">
      {/* Header section */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0e0f14] border-b border-[#1f212a]">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-300 font-mono">
            Interactive Uniforms
          </h2>
        </div>
      </div>

      {/* Add Uniform Inline Form */}
      <form onSubmit={handleAdd} className="p-3 border-b border-[#1f212a] bg-[#14151e]/40 space-y-2">
        <div className="flex gap-1.5">
          <div className="flex-1">
            <input
              type="text"
              placeholder="u_variableName"
              value={newUName}
              onChange={(e) => setNewUName(e.target.value)}
              className="w-full bg-[#0b0c10] border border-[#232635] focus:border-cyan-500/50 rounded px-2.5 py-1 text-xs font-mono focus:outline-none text-white placeholder-gray-600"
            />
          </div>
          <select
            value={newUType}
            onChange={(e: any) => setNewUType(e.target.value)}
            className="bg-[#0b0c10] border border-[#232635] text-gray-400 focus:text-white focus:outline-none rounded px-2 text-xs font-mono"
          >
            <option value="float">float</option>
            <option value="vec2">vec2</option>
            <option value="vec3">vec3</option>
            <option value="vec4">vec4</option>
            <option value="color">color</option>
          </select>
          <button
            type="submit"
            className="bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 font-bold border border-cyan-500/30 rounded px-3 py-1 text-xs shrink-0 font-mono transition-colors"
          >
            + ADD
          </button>
        </div>
        {error && <p className="text-[10px] text-red-400 font-mono mt-1">{error}</p>}
      </form>

      {/* List of Uniforms with controllers */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4 bg-[#12131a]">
        {/* Default standard system uniforms reference */}
        <div className="bg-[#14151e] border border-[#1f212a]/40 rounded-lg p-2.5 text-[10px] font-mono text-gray-500 leading-normal space-y-1 select-none">
          <span className="font-bold text-gray-400 uppercase text-[9px] tracking-wider block mb-1 flex items-center gap-1">
            <HelpCircle className="w-3 h-3 text-cyan-400" /> System Uniforms (Injected)
          </span>
          <div>float <span className="text-purple-400 font-semibold">u_time</span> · Time in seconds</div>
          <div>vec2 <span className="text-purple-400 font-semibold">u_resolution</span> · Width & Height pixels</div>
          <div>vec2 <span className="text-purple-400 font-semibold">u_mouse</span> · Normalized coordinates [0, 1]</div>
          <div>vec3 <span className="text-purple-400 font-semibold">u_cameraPosition</span> · Camera position coordinates</div>
        </div>

        {uniforms.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-xs font-mono">
            No custom uniforms declared.<br />Add a variable above to bind.
          </div>
        ) : (
          uniforms.map((uni) => (
            <div
              key={uni.name}
              className="bg-[#171822]/60 border border-[#1f212a] rounded-lg p-3 space-y-2.5 shadow-sm group hover:border-[#232635] transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-mono">
                  <span className="text-[10px] bg-cyan-950/40 border border-cyan-500/20 text-cyan-400 px-1.5 py-0.5 rounded font-bold">
                    {uni.type}
                  </span>
                  <span className="text-xs font-semibold text-white">
                    {uni.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onDeleteUniform(uni.name)}
                  className="p-1 hover:bg-red-500/10 text-gray-600 hover:text-red-400 rounded transition-colors"
                  title="Remove uniform parameter"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Render dynamic controller interface depending on Type */}
              <div className="space-y-2 font-mono text-[11px]">
                {uni.type === 'float' && (
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="-2.0"
                      max="5.0"
                      step="0.01"
                      value={uni.value[0]}
                      onChange={(e) => onUpdateUniform(uni.name, [parseFloat(e.target.value)])}
                      className="flex-1 accent-cyan-400 h-1 bg-black/60 rounded"
                    />
                    <input
                      type="number"
                      step="0.05"
                      value={uni.value[0]}
                      onChange={(e) => onUpdateUniform(uni.name, [parseFloat(e.target.value) || 0])}
                      className="w-16 bg-[#0b0c10] border border-[#232635] text-white text-right rounded px-1.5 py-0.5 text-xs focus:outline-none"
                    />
                  </div>
                )}

                {uni.type === 'color' && (
                  <div className="flex gap-2.5 items-center">
                    <input
                      type="color"
                      value={`#${uni.value.map(c => Math.floor(Math.max(0, Math.min(1, c)) * 255).toString(16).padStart(2, '0')).join('')}`}
                      onChange={(e) => {
                        const hex = e.target.value;
                        const r = parseInt(hex.slice(1, 3), 16) / 255;
                        const g = parseInt(hex.slice(3, 5), 16) / 255;
                        const b = parseInt(hex.slice(5, 7), 16) / 255;
                        onUpdateUniform(uni.name, [r, g, b]);
                      }}
                      className="w-8 h-8 rounded border border-[#232635] bg-transparent cursor-pointer shrink-0"
                    />
                    <div className="grid grid-cols-3 gap-1 flex-1">
                      {['R', 'G', 'B'].map((label, idx) => (
                        <div key={idx} className="bg-[#0b0c10] rounded px-2 py-1 text-center border border-[#1f212a] flex items-center justify-between">
                          <span className="text-gray-500 font-bold text-[9px]">{label}</span>
                          <span className="text-white text-[10px] font-semibold">{uni.value[idx]?.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {uni.type === 'vec2' && (
                  <div className="space-y-1.5">
                    {['X', 'Y'].map((label, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="text-gray-600 font-bold w-4">{label}</span>
                        <input
                          type="range"
                          min="-2"
                          max="2"
                          step="0.01"
                          value={uni.value[idx]}
                          onChange={(e) => {
                            const nextVal = [...uni.value];
                            nextVal[idx] = parseFloat(e.target.value);
                            onUpdateUniform(uni.name, nextVal);
                          }}
                          className="flex-1 accent-cyan-400 h-1 bg-black/60 rounded"
                        />
                        <span className="text-[10px] bg-[#0b0c10] text-gray-400 px-1.5 py-0.5 rounded w-10 text-right font-semibold">
                          {uni.value[idx]?.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {uni.type === 'vec3' && (
                  <div className="space-y-1.5">
                    {['X', 'Y', 'Z'].map((label, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="text-gray-600 font-bold w-4">{label}</span>
                        <input
                          type="range"
                          min="-2"
                          max="2"
                          step="0.01"
                          value={uni.value[idx]}
                          onChange={(e) => {
                            const nextVal = [...uni.value];
                            nextVal[idx] = parseFloat(e.target.value);
                            onUpdateUniform(uni.name, nextVal);
                          }}
                          className="flex-1 accent-cyan-400 h-1 bg-black/60 rounded"
                        />
                        <span className="text-[10px] bg-[#0b0c10] text-gray-400 px-1.5 py-0.5 rounded w-10 text-right font-semibold">
                          {uni.value[idx]?.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {uni.type === 'vec4' && (
                  <div className="space-y-1.5">
                    {['X', 'Y', 'Z', 'W'].map((label, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="text-gray-600 font-bold w-4">{label}</span>
                        <input
                          type="range"
                          min="-2"
                          max="2"
                          step="0.01"
                          value={uni.value[idx]}
                          onChange={(e) => {
                            const nextVal = [...uni.value];
                            nextVal[idx] = parseFloat(e.target.value);
                            onUpdateUniform(uni.name, nextVal);
                          }}
                          className="flex-1 accent-cyan-400 h-1 bg-black/60 rounded"
                        />
                        <span className="text-[10px] bg-[#0b0c10] text-gray-400 px-1.5 py-0.5 rounded w-10 text-right font-semibold">
                          {uni.value[idx]?.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
