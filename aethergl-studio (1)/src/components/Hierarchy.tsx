import React, { useState } from 'react';
import { Layers, Eye, EyeOff, Trash2, Copy, Plus, Move, Edit3, Settings2 } from 'lucide-react';
import { WebGLObject } from './WebGLCanvas';

interface HierarchyProps {
  objects: WebGLObject[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAddObject: (type: WebGLObject['type']) => void;
  onDeleteObject: (id: string) => void;
  onDuplicateObject: (id: string) => void;
  onUpdateObject: (id: string, updates: Partial<WebGLObject>) => void;
  onReorder: (reordered: WebGLObject[]) => void;
}

export default function Hierarchy({
  objects,
  selectedId,
  onSelect,
  onAddObject,
  onDeleteObject,
  onDuplicateObject,
  onUpdateObject,
  onReorder,
}: HierarchyProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const startRename = (obj: WebGLObject) => {
    setEditingId(obj.id);
    setEditingName(obj.name);
  };

  const finishRename = (id: string) => {
    if (editingName.trim()) {
      onUpdateObject(id, { name: editingName.trim() });
    }
    setEditingId(null);
  };

  // Reordering helpers (Move element in array up or down)
  const moveItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= objects.length) return;

    const reordered = [...objects];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;
    onReorder(reordered);
  };

  const selectedObj = objects.find(o => o.id === selectedId);

  return (
    <div className="flex flex-col h-full bg-[#111218] border border-[#1f212a] rounded-xl overflow-hidden">
      {/* Title zone */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0e0f14] border-b border-[#1f212a]">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-300 font-mono">
            Scene Hierarchy
          </h2>
        </div>
        <span className="text-[10px] font-mono tabular-nums text-gray-500 bg-black/30 px-1.5 py-0.5 rounded">
          {objects.length} Node{objects.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Quick Add Node panel */}
      <div className="p-3 border-b border-[#1f212a] bg-[#14151e]/40">
        <span className="text-[10px] font-mono text-gray-500 font-semibold uppercase block mb-2">
          Add Geometry Node
        </span>
        <div className="grid grid-cols-5 gap-1.5">
          {(['cube', 'sphere', 'torus', 'cylinder', 'plane'] as const).map((type) => (
            <button
              key={type}
              onClick={() => onAddObject(type)}
              className="py-1.5 px-1 bg-[#171822] hover:bg-cyan-500/10 border border-[#232635] hover:border-cyan-500/30 rounded text-[10px] font-mono font-medium text-gray-400 hover:text-cyan-300 transition-all flex flex-col items-center gap-1 capitalize"
            >
              <Plus className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Nodes list panel */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 bg-[#12131a]">
        {objects.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-xs font-mono">
            No objects in active scene.<br />Add a primitive to begin.
          </div>
        ) : (
          objects.map((obj, index) => {
            const isSelected = obj.id === selectedId;
            return (
              <div
                key={obj.id}
                onClick={() => onSelect(obj.id)}
                className={`group flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all border ${
                  isSelected
                    ? 'bg-cyan-950/20 border-cyan-500/30 shadow-sm shadow-cyan-500/5 text-cyan-300'
                    : 'bg-[#171822]/60 border-transparent hover:border-[#232635] hover:bg-[#1a1b28]/60 text-gray-300'
                }`}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Move className="w-3.5 h-3.5 text-gray-600 cursor-grab shrink-0 invisible group-hover:visible" />
                  
                  {editingId === obj.id ? (
                    <input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onBlur={() => finishRename(obj.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') finishRename(obj.id);
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                      autoFocus
                      className="bg-[#0b0c10] text-white border border-cyan-500/50 rounded px-1 py-0.5 text-xs font-mono focus:outline-none w-full"
                    />
                  ) : (
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="w-2 h-2 rounded bg-cyan-400/30 border border-cyan-400/60 shrink-0"></span>
                      <span className="text-xs font-mono font-medium select-none truncate">
                        {obj.name}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 ml-2 shrink-0 opacity-80 group-hover:opacity-100">
                  {/* Up/Down hierarchy movement */}
                  <button
                    disabled={index === 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      moveItem(index, 'up');
                    }}
                    className="p-1 text-gray-600 hover:text-white disabled:opacity-20 rounded"
                    title="Move rendering order up"
                  >
                    ▲
                  </button>
                  <button
                    disabled={index === objects.length - 1}
                    onClick={(e) => {
                      e.stopPropagation();
                      moveItem(index, 'down');
                    }}
                    className="p-1 text-gray-600 hover:text-white disabled:opacity-20 rounded"
                    title="Move rendering order down"
                  >
                    ▼
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startRename(obj);
                    }}
                    className="p-1 text-gray-500 hover:text-white rounded"
                    title="Rename node"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateObject(obj.id, { visible: !obj.visible });
                    }}
                    className="p-1 text-gray-500 hover:text-white rounded"
                    title="Toggle Visibility"
                  >
                    {obj.visible ? <Eye className="w-3.5 h-3.5 text-cyan-400" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicateObject(obj.id);
                    }}
                    className="p-1 text-gray-500 hover:text-cyan-400 rounded"
                    title="Duplicate node"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteObject(obj.id);
                    }}
                    className="p-1 text-gray-500 hover:text-red-400 rounded"
                    title="Delete node"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Selected Node Transform parameters panel */}
      {selectedObj && (
        <div className="p-4 border-t border-[#1f212a] bg-[#0e0f14]/80 space-y-4">
          <div className="flex items-center gap-1.5 border-b border-[#1f212a] pb-2">
            <Settings2 className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px] font-mono font-semibold uppercase text-gray-400">
              Transform Settings: {selectedObj.name}
            </span>
          </div>

          <div className="space-y-3 font-mono text-[11px]">
            {/* Position coordinate sliders */}
            <div>
              <div className="flex justify-between text-gray-500 mb-1">
                <span>Position (X, Y, Z)</span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                {selectedObj.position.map((v, idx) => (
                  <div key={idx} className="flex items-center bg-[#171822] rounded border border-[#232635] px-1 py-0.5">
                    <span className="text-gray-600 mr-1 font-bold">
                      {['X', 'Y', 'Z'][idx]}
                    </span>
                    <input
                      type="number"
                      step="0.1"
                      value={v}
                      onChange={(e) => {
                        const nextPos = [...selectedObj.position] as [number, number, number];
                        nextPos[idx] = parseFloat(e.target.value) || 0;
                        onUpdateObject(selectedObj.id, { position: nextPos });
                      }}
                      className="bg-transparent text-white w-full text-right focus:outline-none focus:text-cyan-300"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Rotation sliders */}
            <div>
              <div className="flex justify-between text-gray-500 mb-1">
                <span>Rotation (Pitch, Yaw, Roll)</span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                {selectedObj.rotation.map((v, idx) => (
                  <div key={idx} className="flex items-center bg-[#171822] rounded border border-[#232635] px-1 py-0.5">
                    <span className="text-gray-600 mr-1 font-bold">
                      {['P', 'Y', 'R'][idx]}
                    </span>
                    <input
                      type="number"
                      step="5"
                      value={v}
                      onChange={(e) => {
                        const nextRot = [...selectedObj.rotation] as [number, number, number];
                        nextRot[idx] = parseFloat(e.target.value) || 0;
                        onUpdateObject(selectedObj.id, { rotation: nextRot });
                      }}
                      className="bg-transparent text-white w-full text-right focus:outline-none focus:text-cyan-300"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Scale sliders */}
            <div>
              <div className="flex justify-between text-gray-500 mb-1">
                <span>Scale (X, Y, Z)</span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                {selectedObj.scale.map((v, idx) => (
                  <div key={idx} className="flex items-center bg-[#171822] rounded border border-[#232635] px-1 py-0.5">
                    <span className="text-gray-600 mr-1 font-bold">
                      {['X', 'Y', 'Z'][idx]}
                    </span>
                    <input
                      type="number"
                      step="0.1"
                      min="0.05"
                      value={v}
                      onChange={(e) => {
                        const nextScale = [...selectedObj.scale] as [number, number, number];
                        nextScale[idx] = Math.max(0.01, parseFloat(e.target.value) || 0);
                        onUpdateObject(selectedObj.id, { scale: nextScale });
                      }}
                      className="bg-transparent text-white w-full text-right focus:outline-none focus:text-cyan-300"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Color modifier */}
            <div>
              <div className="flex justify-between text-gray-500 mb-1">
                <span>Mesh Base RGB Color</span>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={`#${selectedObj.color.map(c => Math.floor(c * 255).toString(16).padStart(2, '0')).join('')}`}
                  onChange={(e) => {
                    const hex = e.target.value;
                    const r = parseInt(hex.slice(1, 3), 16) / 255;
                    const g = parseInt(hex.slice(3, 5), 16) / 255;
                    const b = parseInt(hex.slice(5, 7), 16) / 255;
                    onUpdateObject(selectedObj.id, { color: [r, g, b] });
                  }}
                  className="w-7 h-7 rounded border border-[#232635] bg-transparent cursor-pointer shrink-0"
                />
                <div className="grid grid-cols-3 gap-1 flex-1">
                  {selectedObj.color.map((c, idx) => (
                    <div key={idx} className="flex items-center bg-[#171822] rounded border border-[#232635] px-1 py-0.5 text-[9px]">
                      <span className={['text-red-400', 'text-emerald-400', 'text-blue-400'][idx] + ' mr-1 font-bold'}>
                        {['R', 'G', 'B'][idx]}
                      </span>
                      <span>{c.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
