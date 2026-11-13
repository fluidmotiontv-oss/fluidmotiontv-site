import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, Sliders, Layers, Zap, Download, RefreshCw, 
  HelpCircle, Eye, Camera, Video, Square, Monitor, Box, 
  Settings, ChevronRight, CheckCircle2, Terminal, Music
} from 'lucide-react';
import { WebGLCanvas, WebGLCanvasRef, WebGLObject, UniformValue } from './components/WebGLCanvas';
import CodeEditor from './components/CodeEditor';
import Hierarchy from './components/Hierarchy';
import UniformsList from './components/UniformsList';
import AiAssistant from './components/AiAssistant';
import PresetsLibrary from './components/PresetsLibrary';
import ExportModal from './components/ExportModal';
import { SHADER_PRESETS, ShaderPreset } from './utils/presets';
import { AudioEngine } from './utils/audio';
import AudioPanel from './components/AudioPanel';
import { CollabLayer, CollabCertificate } from './utils/collab';
import LayerManager from './components/LayerManager';
import CollabTerminal from './components/CollabTerminal';
import IdentityBadge from './components/IdentityBadge';
import ArtistWall from './components/ArtistWall';
import PostProcessingPanel, { PostProcessingConfig } from './components/PostProcessingPanel';

export default function App() {
  const canvasRef = useRef<WebGLCanvasRef>(null);
  
  // Persistent offline DSP Audio Engine
  const audioEngineRef = useRef<AudioEngine>(new AudioEngine());

  // Default preset setup
  const defaultPreset = SHADER_PRESETS[0]; // Sonic Ripple Pulsar (Audio Reactive)

  // State definitions
  const [isScreenSpaceMode, setIsScreenSpaceMode] = useState(true); // Default true (Raymarching screenspace)
  const [activePresetId, setActivePresetId] = useState<string | null>(defaultPreset.id);
  
  // Custom Vertex & Fragment shaders sources
  const [vertexShader, setVertexShader] = useState(defaultPreset.vertexShader);
  const [fragmentShader, setFragmentShader] = useState(defaultPreset.fragmentShader);
  
  // Uniforms State
  const [customUniforms, setCustomUniforms] = useState<UniformValue[]>(
    defaultPreset.uniforms.map(u => ({ name: u.name, type: u.type, value: u.defaultValue }))
  );

  // Post-processing effects configurations state
  const [postProcessing, setPostProcessing] = useState<PostProcessingConfig>({
    bloom: false,
    bloomIntensity: 1.0,
    bloomRadius: 1.0,
    vignette: false,
    vignetteIntensity: 0.8,
    vignetteSmoothness: 0.5,
    chromatic: false,
    chromaticIntensity: 0.01,
  });

  // Real-time audio reactive meters state (only schedules tick when Audio tab is open)
  const [audioLevels, setAudioLevels] = useState({
    bass: 0,
    mids: 0,
    treble: 0,
    freqData: new Uint8Array(256) as any,
  });

  // Multi-Player Stacked Layers State
  const [layers, setLayers] = useState<CollabLayer[]>([
    {
      id: 'layer-1',
      name: 'Base Pulsar Core',
      creator: 'fluidmotiontv',
      meshType: 'sphere',
      fragmentShader: defaultPreset.fragmentShader,
      synthTrackId: 'synthwave',
      rotationSpeed: 1.0,
      pulseRange: 0.8,
      baseColor: [0.0, 0.8, 1.0],
      signatureHash: 'sig_fmtv_0x1',
    }
  ]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>('layer-1');

  // Community certificates holding collaborative signed masterpieces
  const [completedCertificates, setCompletedCertificates] = useState<CollabCertificate[]>([]);

  // Registered physical meets tracker
  const [existingMeets, setExistingMeets] = useState<{ players: string[] }[]>([
    { players: ['fluidmotiontv', 'cyberdragon'] },
    { players: ['cyberdragon', 'neon_spectre'] },
  ]);

  // Standard Objects inside scene (when isScreenSpaceMode is false and not in collab stack)
  const [objects, setObjects] = useState<WebGLObject[]>([
    { id: '1', name: 'Center Torus', type: 'torus', position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1], color: [0.0, 0.8, 1.0], visible: true },
    { id: '2', name: 'Sphere satellite', type: 'sphere', position: [1.5, 0.8, -0.5], rotation: [0, 0, 0], scale: [0.4, 0.4, 0.4], color: [0.8, 0.0, 1.0], visible: true },
    { id: '3', name: 'Platform Base', type: 'plane', position: [0, -1.0, 0], rotation: [-90, 0, 0], scale: [3, 3, 1], color: [0.2, 0.25, 0.3], visible: true }
  ]);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>('1');

  // UI state managers
  const [leftTab, setLeftTab] = useState<'hierarchy' | 'uniforms' | 'presets' | 'audio' | 'collab' | 'layers' | 'wall' | 'postprocessing'>('audio');
  const [rightTab, setRightTab] = useState<'editor' | 'ai'>('editor');
  const [editorShaderTab, setEditorShaderTab] = useState<'vertex' | 'fragment'>('fragment');
  const [fps, setFps] = useState(60);
  const [compileStatus, setCompileStatus] = useState({
    success: true,
    vertexError: null as string | null,
    fragmentError: null as string | null,
    linkError: null as string | null,
  });

  const [isExportOpen, setIsExportOpen] = useState(false);
  const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null);
  const [snapshotData, setSnapshotData] = useState<string | null>(null);

  // Real-time animation frame hook for updating Audio Panel visual elements
  useEffect(() => {
    let animId: number;

    const tick = () => {
      const audio = audioEngineRef.current.analyze();
      setAudioLevels({
        bass: audio.bass,
        mids: audio.mids,
        treble: audio.treble,
        freqData: audio.freqData as any,
      });
      animId = requestAnimationFrame(tick);
    };

    if (leftTab === 'audio') {
      tick();
    }

    return () => cancelAnimationFrame(animId);
  }, [leftTab]);

  // Synchronize dynamic 3D concentric geometry structures based on stacked layers
  const renderObjects: WebGLObject[] = layers.map((layer, idx) => {
    const scales = [0.5, 0.95, 1.45, 1.95];
    const scaleFactor = scales[idx] || 1.0;
    
    // Auto pulsation range modulated by realtime sub-band energy
    const pulseFactor = 1.0 + audioLevels.bass * layer.pulseRange * 0.4;
    const activeScale: [number, number, number] = [
      scaleFactor * pulseFactor,
      scaleFactor * pulseFactor,
      scaleFactor * pulseFactor
    ];

    // Compute rotational velocities drifting over time
    const speedCoeff = layer.rotationSpeed * (idx % 2 === 0 ? 1 : -1);
    const rad = speedCoeff * (Date.now() / 1500);

    return {
      id: layer.id,
      name: layer.name,
      type: layer.meshType,
      position: [0, 0, 0], // nested coaxial layers
      rotation: [rad * 20, rad * 45, rad * 10], // orbital drift
      scale: activeScale,
      color: layer.baseColor,
      visible: true
    };
  });

  // Swap / Select Layer handler
  const handleSelectLayer = (id: string | null) => {
    setSelectedLayerId(id);
    if (id) {
      const target = layers.find(l => l.id === id);
      if (target) {
        setFragmentShader(target.fragmentShader);
      }
    }
  };

  const handleUpdateLayer = (id: string, updates: Partial<CollabLayer>) => {
    setLayers(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
    // If updating selected layer's shader, sync immediately
    if (id === selectedLayerId && updates.fragmentShader) {
      setFragmentShader(updates.fragmentShader);
    }
  };

  const handleAddLayer = () => {
    if (layers.length >= 4) return;
    const nextIdx = layers.length + 1;
    const defaultLayer: CollabLayer = {
      id: `layer-${Date.now()}`,
      name: `Collab Space Warp ${nextIdx}`,
      creator: `artist_${nextIdx}`,
      meshType: nextIdx === 2 ? 'torus' : nextIdx === 3 ? 'cube' : 'cylinder',
      fragmentShader: SHADER_PRESETS[nextIdx % SHADER_PRESETS.length].fragmentShader,
      synthTrackId: nextIdx % 2 === 0 ? 'ambient' : 'chiptune',
      rotationSpeed: 0.8,
      pulseRange: 0.6,
      baseColor: nextIdx === 2 ? [1.0, 0.0, 0.8] : nextIdx === 3 ? [0.0, 1.0, 0.6] : [1.0, 0.8, 0.0],
      signatureHash: `sig_art_${nextIdx}_0x9a`,
    };
    
    setLayers(prev => [...prev, defaultLayer]);
    setSelectedLayerId(defaultLayer.id);
    setFragmentShader(defaultLayer.fragmentShader);
  };

  const handleRemoveLayer = (id: string) => {
    if (layers.length <= 1) return; // Keep at least one base layer
    setLayers(prev => prev.filter(l => l.id !== id));
    if (selectedLayerId === id) {
      // Safely move selection to remaining first layer
      const remaining = layers.filter(l => l.id !== id);
      setSelectedLayerId(remaining[0]?.id || null);
      setFragmentShader(remaining[0]?.fragmentShader || '');
    }
  };

  // Record a collaborative swap meet
  const handleRecordMeet = (p1: string, p2: string) => {
    if (!p1 || !p2 || p1 === p2) return;
    const alreadyMet = existingMeets.some(meet => 
      meet.players.includes(p1) && meet.players.includes(p2)
    );
    if (!alreadyMet) {
      setExistingMeets(prev => [...prev, { players: [p1, p2] }]);
    }
  };

  // Load Global Network Survey Heatmap WebGL Shader
  const handleLoadHeatmapShader = (title: string, weights: [number, number, number]) => {
    const vs = `attribute vec3 a_position;
attribute vec2 a_texcoord;
varying vec2 v_texcoord;

void main() {
  v_texcoord = a_texcoord;
  gl_Position = vec4(a_position, 1.0);
}`;

    const fs = `precision mediump float;
varying vec2 v_texcoord;
uniform float u_time;
uniform float u_bass;

// Live survey weights passed dynamically as custom uniforms!
uniform float u_surveyOption0; // SDF metaballs weight
uniform float u_surveyOption1; // Sinewave deform weight
uniform float u_surveyOption2; // Cyber neon noise weight

void main() {
  vec2 uv = v_texcoord - 0.5;
  
  // Base background coordinate grid mapping
  float grid = sin(v_texcoord.x * 50.0) * sin(v_texcoord.y * 50.0);
  grid = smoothstep(0.0, 0.05, abs(grid));
  vec3 col = vec3(0.03, 0.04, 0.06) * (1.0 + grid * 0.15);

  // Render option 0, 1, 2 thermal heatmap signatures
  float w0 = u_surveyOption0 / max(0.01, u_surveyOption0 + u_surveyOption1 + u_surveyOption2);
  float w1 = u_surveyOption1 / max(0.01, u_surveyOption0 + u_surveyOption1 + u_surveyOption2);
  float w2 = u_surveyOption2 / max(0.01, u_surveyOption0 + u_surveyOption1 + u_surveyOption2);

  // Dynamic coordinates drift over time
  float pulse = 1.0 + u_bass * 0.4;
  vec2 p0 = vec2(-0.2, 0.1) + vec2(sin(u_time * 0.8) * 0.1, cos(u_time * 0.5) * 0.05);
  vec2 p1 = vec2(0.2, -0.15) + vec2(cos(u_time * 0.7) * 0.08, sin(u_time * 0.9) * 0.1);
  vec2 p2 = vec2(-0.05, -0.2) + vec2(sin(u_time * 1.1) * 0.12, cos(u_time * 0.6) * 0.07);

  float d0 = 0.06 / length(uv - p0);
  float d1 = 0.06 / length(uv - p1);
  float d2 = 0.06 / length(uv - p2);

  float heat = d0 * w0 + d1 * w1 + d2 * w2;
  heat *= pulse;
  
  // Map heat value to thermal color palette (glowing cyber spectrum)
  vec3 thermal = mix(vec3(0.02, 0.05, 0.08), vec3(0.0, 0.9, 0.8), smoothstep(0.05, 0.3, heat));
  thermal = mix(thermal, vec3(0.1, 0.8, 0.2), smoothstep(0.3, 0.6, heat));
  thermal = mix(thermal, vec3(1.0, 0.75, 0.0), smoothstep(0.6, 0.8, heat));
  thermal = mix(thermal, vec3(1.0, 0.1, 0.2), smoothstep(0.8, 1.2, heat));

  col = thermal * heat;

  gl_FragColor = vec4(col, 1.0);
}`;

    setActivePresetId(null);
    setVertexShader(vs);
    setFragmentShader(fs);
    setIsScreenSpaceMode(true);
    setCustomUniforms([
      { name: 'u_surveyOption0', type: 'float', value: [weights[0]] },
      { name: 'u_surveyOption1', type: 'float', value: [weights[1]] },
      { name: 'u_surveyOption2', type: 'float', value: [weights[2]] },
    ]);
  };

  // Template Preloader Compositor
  const handleLoadTemplate = (template: 'trio_space' | 'duo_neon' | 'quad_core') => {
    let comps: CollabLayer[] = [];

    if (template === 'duo_neon') {
      comps = [
        {
          id: 'duo-1',
          name: 'Neon Grid Core',
          creator: 'fluidmotiontv',
          meshType: 'torus',
          fragmentShader: SHADER_PRESETS[1].fragmentShader, // Grid preset
          synthTrackId: 'synthwave',
          rotationSpeed: 1.2,
          pulseRange: 0.5,
          baseColor: [0.0, 1.0, 0.8],
          signatureHash: 'sig_fmtv_neon',
        },
        {
          id: 'duo-2',
          name: 'Cyber Wave Sphere',
          creator: 'cyberdragon',
          meshType: 'sphere',
          fragmentShader: SHADER_PRESETS[2].fragmentShader, // Waves preset
          synthTrackId: 'chiptune',
          rotationSpeed: 0.7,
          pulseRange: 1.2,
          baseColor: [1.0, 0.0, 0.6],
          signatureHash: 'sig_cd_neon',
        }
      ];
    } else if (template === 'trio_space') {
      comps = [
        {
          id: 'trio-1',
          name: 'Base Sonic Pulsar',
          creator: 'fluidmotiontv',
          meshType: 'sphere',
          fragmentShader: SHADER_PRESETS[0].fragmentShader, // Pulsar preset
          synthTrackId: 'synthwave',
          rotationSpeed: 1.0,
          pulseRange: 0.9,
          baseColor: [0.0, 0.8, 1.0],
          signatureHash: 'sig_fmtv_trio',
        },
        {
          id: 'trio-2',
          name: 'Atmospheric Torus Halo',
          creator: 'cyberdragon',
          meshType: 'torus',
          fragmentShader: SHADER_PRESETS[1].fragmentShader, // Grid/Neon
          synthTrackId: 'ambient',
          rotationSpeed: 0.4,
          pulseRange: 0.35,
          baseColor: [0.8, 0.0, 1.0],
          signatureHash: 'sig_cd_trio',
        },
        {
          id: 'trio-3',
          name: 'Glitch Orbit Prism',
          creator: 'neon_spectre',
          meshType: 'cube',
          fragmentShader: SHADER_PRESETS[3].fragmentShader, // CRT/Glitch
          synthTrackId: 'chiptune',
          rotationSpeed: 1.5,
          pulseRange: 0.7,
          baseColor: [0.0, 1.0, 0.5],
          signatureHash: 'sig_ns_trio',
        }
      ];
    } else if (template === 'quad_core') {
      comps = [
        {
          id: 'quad-1',
          name: 'Innermost Pulsar Core',
          creator: 'fluidmotiontv',
          meshType: 'sphere',
          fragmentShader: SHADER_PRESETS[0].fragmentShader,
          synthTrackId: 'synthwave',
          rotationSpeed: 1.8,
          pulseRange: 1.2,
          baseColor: [0.0, 0.8, 1.0],
          signatureHash: 'sig_fmtv_quad',
        },
        {
          id: 'quad-2',
          name: 'Concentric Grid Shell',
          creator: 'cyberdragon',
          meshType: 'torus',
          fragmentShader: SHADER_PRESETS[1].fragmentShader,
          synthTrackId: 'ambient',
          rotationSpeed: 0.8,
          pulseRange: 0.4,
          baseColor: [1.0, 0.0, 0.7],
          signatureHash: 'sig_cd_quad',
        },
        {
          id: 'quad-3',
          name: 'Orbital Geometric Prism',
          creator: 'neon_spectre',
          meshType: 'cube',
          fragmentShader: SHADER_PRESETS[2].fragmentShader,
          synthTrackId: 'chiptune',
          rotationSpeed: 1.2,
          pulseRange: 0.8,
          baseColor: [0.1, 1.0, 0.6],
          signatureHash: 'sig_ns_quad',
        },
        {
          id: 'quad-4',
          name: 'Outermost Cyber Cylinder',
          creator: 'new_player_4',
          meshType: 'cylinder',
          fragmentShader: SHADER_PRESETS[3].fragmentShader,
          synthTrackId: 'synthwave',
          rotationSpeed: 0.3,
          pulseRange: 0.2,
          baseColor: [1.0, 0.8, 0.0],
          signatureHash: 'sig_np4_quad',
        }
      ];
    }

    setLayers(comps);
    setSelectedLayerId(comps[0].id);
    setFragmentShader(comps[0].fragmentShader);
    setIsScreenSpaceMode(false); // templates load best in 3D Concentric mode
  };

  const handleSignOffComposition = (cert: CollabCertificate) => {
    setCompletedCertificates(prev => [cert, ...prev]);
  };

  // Preset Applicator logic
  const applyPreset = (preset: ShaderPreset) => {
    setActivePresetId(preset.id);
    setVertexShader(preset.vertexShader);
    setFragmentShader(preset.fragmentShader);
    
    // Also save default preset shader into our base layer
    if (layers[0]) {
      handleUpdateLayer(layers[0].id, { fragmentShader: preset.fragmentShader });
    }

    setCustomUniforms(
      preset.uniforms.map(u => ({ name: u.name, type: u.type, value: u.defaultValue }))
    );
    // Auto swap viewport mode based on preset category
    if (preset.category === 'Raymarching' || preset.category === 'Post-Process') {
      setIsScreenSpaceMode(true);
    } else {
      setIsScreenSpaceMode(false);
    }
  };

  // AI Generated output injector
  const applyGeneratedShader = (data: {
    title: string;
    vertexShader: string;
    fragmentShader: string;
    uniforms: {
      name: string;
      type: 'float' | 'vec2' | 'vec3' | 'vec4' | 'color';
      defaultValue: number[];
      description: string;
    }[];
    explanation: string;
  }) => {
    setActivePresetId(null); // Custom generated
    setVertexShader(data.vertexShader);
    setFragmentShader(data.fragmentShader);
    setCustomUniforms(
      data.uniforms.map(u => ({ name: u.name, type: u.type, value: u.defaultValue }))
    );
    // Default screenspace/raymarching unless 3D properties exist
    if (data.vertexShader.includes('u_viewMatrix')) {
      setIsScreenSpaceMode(false);
    } else {
      setIsScreenSpaceMode(true);
    }
  };

  // Uniform modifications
  const handleUpdateUniform = (name: string, value: number[]) => {
    setCustomUniforms(prev =>
      prev.map(u => (u.name === name ? { ...u, value } : u))
    );
  };

  const handleAddUniform = (newU: Omit<UniformValue, 'value'> & { defaultValue: number[] }) => {
    setCustomUniforms(prev => [
      ...prev,
      { name: newU.name, type: newU.type, value: newU.defaultValue }
    ]);
  };

  const handleDeleteUniform = (name: string) => {
    setCustomUniforms(prev => prev.filter(u => u.name !== name));
  };

  // Hierarchy Node modifications
  const handleAddObject = (type: WebGLObject['type']) => {
    const newId = (objects.length + 1).toString();
    const newObj: WebGLObject = {
      id: newId,
      name: `Procedural ${type} ${newId}`,
      type,
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      color: [Math.random(), Math.random(), Math.random()],
      visible: true
    };
    setObjects(prev => [...prev, newObj]);
    setSelectedObjectId(newId);
  };

  const handleDeleteObject = (id: string) => {
    setObjects(prev => prev.filter(obj => obj.id !== id));
    if (selectedObjectId === id) setSelectedObjectId(null);
  };

  const handleDuplicateObject = (id: string) => {
    const target = objects.find(o => o.id === id);
    if (!target) return;
    const newId = (Math.max(...objects.map(o => parseInt(o.id) || 0)) + 1).toString();
    const dupe: WebGLObject = {
      ...target,
      id: newId,
      name: `${target.name} (Copy)`,
      position: [target.position[0] + 0.5, target.position[1], target.position[2] + 0.5]
    };
    setObjects(prev => [...prev, dupe]);
    setSelectedObjectId(newId);
  };

  const handleUpdateObject = (id: string, updates: Partial<WebGLObject>) => {
    setObjects(prev =>
      prev.map(obj => (obj.id === id ? { ...obj, ...updates } : obj))
    );
  };

  // Capture helpers
  const triggerSnapshot = () => {
    if (canvasRef.current) {
      const data = canvasRef.current.takeSnapshot();
      if (data) {
        setSnapshotData(data);
        // Direct download trigger
        const a = document.createElement('a');
        a.href = data;
        a.download = `aethergl-capture-${Date.now()}.png`;
        a.click();
        
        setTimeout(() => setSnapshotData(null), 3000);
      }
    }
  };

  const toggleRecording = async () => {
    const engine = canvasRef.current;
    if (!engine) return;

    if (engine.isRecording) {
      const videoBlob = await engine.stopRecording();
      if (videoBlob) {
        setRecordingBlob(videoBlob);
        
        // Auto trigger download for ease
        const url = URL.createObjectURL(videoBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `aethergl-loop-${Date.now()}.webm`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } else {
      engine.startRecording();
    }
  };

  // Count registered bilateral meets for our passport badge
  const completedMeetsCount = existingMeets.filter(m => m.players.includes('fluidmotiontv')).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#08090d] text-gray-200 selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* 
        ZONE 1: Header Top Bar (Strict Three-Zone Contract)
        [Brand title] - [4-6 text nav links] - [Export primary action]
      */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#1f212a] bg-[#0c0d12]/90 backdrop-blur-md sticky top-0 z-40">
        {/* Zone 1: Brand title, single element */}
        <a href="/" className="text-base font-extrabold tracking-tight font-sans text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 shrink-0">
          AetherGL Studio
        </a>

        {/* Zone 2: Navigation Links (unboxed, hover underlines) */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider font-mono text-gray-400">
          <button 
            onClick={() => { setIsScreenSpaceMode(false); setActivePresetId(null); }} 
            className={`hover:text-cyan-400 transition-all focus:outline-none ${!isScreenSpaceMode ? 'text-cyan-400 underline underline-offset-4' : ''}`}
          >
            Scene Editor
          </button>
          <button 
            onClick={() => { setIsScreenSpaceMode(true); }} 
            className={`hover:text-cyan-400 transition-all focus:outline-none ${isScreenSpaceMode ? 'text-cyan-400 underline underline-offset-4' : ''}`}
          >
            Shader Forge
          </button>
          <button 
            onClick={() => { setRightTab('ai'); }} 
            className={`hover:text-cyan-400 transition-all focus:outline-none ${rightTab === 'ai' ? 'text-cyan-400 underline underline-offset-4' : ''}`}
          >
            AI Assistant
          </button>
          <a href="#presets" onClick={() => setLeftTab('presets')} className="hover:text-cyan-400 transition-all">
            Presets
          </a>
        </nav>

        {/* Zone 3: Primary action button and Identity Badge */}
        <div className="flex items-center gap-3">
          <IdentityBadge
            signatureHash="ae_f1a8e2"
            layerCount={layers.length}
            completedMeetsCount={completedMeetsCount}
            completedCertificatesCount={completedCertificates.length}
          />
          <button
            onClick={() => setIsExportOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-[11px] rounded-lg shadow-md hover:shadow-cyan-500/20 transition-all flex items-center gap-2 font-mono"
          >
            <Download className="w-3.5 h-3.5" />
            EXPORT HTML
          </button>
        </div>
      </header>

      {/* Main Studio Core Workspace (3 columns setup) */}
      <main className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-5 p-5 max-w-[1720px] mx-auto w-full">
        
        {/* COLUMN 1: Scene Hierarchy, Parameters & Presets (Left: 3 cols) */}
        <div className="xl:col-span-3 flex flex-col gap-4 h-[calc(100vh-120px)] overflow-hidden">
          
          {/* Left panel Tab Segmented Controller */}
          <div className="flex flex-wrap p-1 bg-[#12131a] border border-[#1f212a] rounded-lg gap-1">
            <button
              onClick={() => setLeftTab('wall')}
              className={`flex-1 py-1.5 px-1 text-[9px] font-bold font-mono uppercase rounded transition-all ${
                leftTab === 'wall' ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/20 shadow' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Wall
            </button>
            <button
              onClick={() => setLeftTab('audio')}
              className={`flex-1 py-1.5 px-1 text-[9px] font-bold font-mono uppercase rounded transition-all ${
                leftTab === 'audio' ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/20 shadow' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Audio
            </button>
            <button
              onClick={() => setLeftTab('layers')}
              className={`flex-1 py-1.5 px-1 text-[9px] font-bold font-mono uppercase rounded transition-all ${
                leftTab === 'layers' ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/20 shadow' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Stacks
            </button>
            <button
              onClick={() => setLeftTab('collab')}
              className={`flex-1 py-1.5 px-1 text-[9px] font-bold font-mono uppercase rounded transition-all ${
                leftTab === 'collab' ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/20 shadow' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Collab
            </button>
            <button
              onClick={() => setLeftTab('presets')}
              className={`flex-1 py-1.5 px-1 text-[9px] font-bold font-mono uppercase rounded transition-all ${
                leftTab === 'presets' ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/20 shadow' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Presets
            </button>
            <button
              onClick={() => setLeftTab('uniforms')}
              className={`flex-1 py-1.5 px-1 text-[9px] font-bold font-mono uppercase rounded transition-all ${
                leftTab === 'uniforms' ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/20 shadow' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Custom
            </button>
            <button
              onClick={() => setLeftTab('postprocessing')}
              className={`flex-1 py-1.5 px-1 text-[9px] font-bold font-mono uppercase rounded transition-all ${
                leftTab === 'postprocessing' ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/20 shadow' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Post-FX
            </button>
          </div>

          <div className="flex-1 overflow-hidden">
            {leftTab === 'wall' && (
              <ArtistWall
                onHarvestLayer={(layer) => {
                  if (layers.length < 4) {
                    setLayers(prev => [...prev, layer]);
                    setSelectedLayerId(layer.id);
                    setFragmentShader(layer.fragmentShader);
                    setIsScreenSpaceMode(false); // templates load best in 3D Concentric mode
                  }
                }}
                onRecordMeet={handleRecordMeet}
                existingMeets={existingMeets}
                bass={audioLevels.bass}
                mids={audioLevels.mids}
                onLoadHeatmapShader={handleLoadHeatmapShader}
              />
            )}
            {leftTab === 'presets' && (
              <PresetsLibrary
                onSelectPreset={applyPreset}
                activePresetId={activePresetId}
              />
            )}
            {leftTab === 'uniforms' && (
              <UniformsList
                uniforms={customUniforms}
                onUpdateUniform={handleUpdateUniform}
                onAddUniform={handleAddUniform}
                onDeleteUniform={handleDeleteUniform}
              />
            )}
            {leftTab === 'audio' && (
              <AudioPanel
                audioEngine={audioEngineRef.current}
                onTrackChange={() => {}}
                bassLevel={audioLevels.bass}
                midsLevel={audioLevels.mids}
                trebleLevel={audioLevels.treble}
                frequencyData={audioLevels.freqData}
              />
            )}
            {leftTab === 'layers' && (
              <LayerManager
                layers={layers}
                selectedLayerId={selectedLayerId}
                onSelectLayer={handleSelectLayer}
                onUpdateLayer={handleUpdateLayer}
                onAddLayer={handleAddLayer}
                onRemoveLayer={handleRemoveLayer}
                onLoadTemplate={handleLoadTemplate}
              />
            )}
            {leftTab === 'collab' && (
              <CollabTerminal
                layers={layers}
                onImportLayer={(l: CollabLayer) => {
                  if (layers.length < 4) {
                    setLayers(prev => [...prev, l]);
                    setSelectedLayerId(l.id);
                    setFragmentShader(l.fragmentShader);
                  }
                }}
                onSignOffComposition={handleSignOffComposition}
                completedCertificates={completedCertificates}
                existingMeets={existingMeets}
                onRecordMeet={handleRecordMeet}
              />
            )}
            {leftTab === 'hierarchy' && (
              <Hierarchy
                objects={objects}
                selectedId={selectedObjectId}
                onSelect={setSelectedObjectId}
                onAddObject={handleAddObject}
                onDeleteObject={handleDeleteObject}
                onDuplicateObject={handleDuplicateObject}
                onUpdateObject={handleUpdateObject}
                onReorder={setObjects}
              />
            )}
            {leftTab === 'postprocessing' && (
              <PostProcessingPanel
                config={postProcessing}
                onChange={(updates) => setPostProcessing(prev => ({ ...prev, ...updates }))}
              />
            )}
          </div>
        </div>

        {/* COLUMN 2: Real-time WebGL Canvas & Output (Middle: 5 cols) */}
        <div className="xl:col-span-5 flex flex-col gap-4 h-[calc(100vh-120px)] overflow-hidden">
          
          {/* Main WebGL canvas wrapper */}
          <div className="flex-1 min-h-[300px] relative">
            <WebGLCanvas
              ref={canvasRef}
              objects={isScreenSpaceMode ? objects : renderObjects}
              vertexShaderSource={vertexShader}
              fragmentShaderSource={fragmentShader}
              customUniforms={customUniforms}
              isScreenSpaceMode={isScreenSpaceMode}
              selectedObjectId={selectedObjectId}
              onCompileStatus={setCompileStatus}
              onFPSUpdate={setFps}
              audioEngine={audioEngineRef.current}
              postProcessing={postProcessing}
            />

            {/* Float WebGL HUD Indicators overlay */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              {/* FPS Indicator */}
              <div className="bg-[#0b0c10]/95 border border-[#1f212a] backdrop-blur px-2.5 py-1 rounded shadow-md text-[10px] font-mono text-cyan-400 flex items-center gap-1.5 select-none font-semibold">
                <Monitor className="w-3.5 h-3.5 text-cyan-400" />
                <span className="tabular-nums">{fps}</span> FPS
              </div>
            </div>

            {/* Capturing Float tools overlay */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-[#0e0f14]/90 border border-[#1f212a] p-1.5 rounded-lg backdrop-blur shadow-lg">
              <button
                onClick={triggerSnapshot}
                className="p-1.5 hover:bg-white/5 text-gray-400 hover:text-white rounded transition-colors"
                title="Capture high-res PNG Snapshot"
              >
                <Camera className="w-4 h-4 text-cyan-400" />
              </button>
              
              <div className="w-px h-4 bg-[#1f212a]"></div>
              
              <button
                onClick={toggleRecording}
                className={`p-1.5 rounded transition-all flex items-center gap-1.5 text-xs font-mono font-bold ${
                  canvasRef.current?.isRecording 
                    ? 'bg-red-500/20 border border-red-500/30 text-red-400' 
                    : 'hover:bg-white/5 text-gray-400 hover:text-white'
                }`}
                title={canvasRef.current?.isRecording ? 'Stop rendering record' : 'Start loop capture (WebM)'}
              >
                {canvasRef.current?.isRecording ? (
                  <>
                    <Square className="w-4 h-4 fill-red-400 text-red-400 animate-pulse" />
                    <span className="text-[10px] text-red-400 shrink-0">STOP</span>
                  </>
                ) : (
                  <>
                    <Video className="w-4 h-4 text-cyan-400" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Console / Compilation status log */}
          <div className="bg-[#111218] border border-[#1f212a] rounded-xl p-4 flex flex-col gap-2 shadow-inner h-36 font-mono select-none">
            <div className="flex items-center justify-between border-b border-[#1f212a]/60 pb-1.5">
              <div className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  AetherGL Engine Console
                </span>
              </div>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                compileStatus.success ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}>
                {compileStatus.success ? 'LINKAGE SUCCESSFUL' : 'COMPILER ERROR'}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto text-[11px] leading-relaxed text-gray-500 scrollbar-thin">
              {compileStatus.success ? (
                <div className="space-y-1">
                  <p className="text-emerald-400 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    Vertex & Fragment GLSL compiling linked successfully.
                  </p>
                  <p className="text-gray-500 font-mono text-[10px]">
                    Active mode: {isScreenSpaceMode ? 'Screen-Space (Quad Raymarching)' : '3D Geometry Scene Hierarchy'}<br />
                    Attributes mapped: a_position, a_normal, a_texcoord<br />
                    Active shaders bound: {vertexShader.length + fragmentShader.length} byte buffers.
                  </p>
                </div>
              ) : (
                <div className="text-red-400 space-y-1.5">
                  {compileStatus.vertexError && (
                    <p className="whitespace-pre-wrap"><span className="font-bold font-mono">Vertex Shader:</span> {compileStatus.vertexError}</p>
                  )}
                  {compileStatus.fragmentError && (
                    <p className="whitespace-pre-wrap"><span className="font-bold font-mono">Fragment Shader:</span> {compileStatus.fragmentError}</p>
                  )}
                  {compileStatus.linkError && (
                    <p className="whitespace-pre-wrap"><span className="font-bold font-mono">Program Linker:</span> {compileStatus.linkError}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* COLUMN 3: Shaders Code Editor & AI Panel (Right: 4 cols) */}
        <div className="xl:col-span-4 flex flex-col gap-4 h-[calc(100vh-120px)] overflow-hidden">
          
          {/* Left panel Tab Segmented Controller */}
          <div className="flex p-1 bg-[#12131a] border border-[#1f212a] rounded-lg shrink-0">
            <button
              onClick={() => setRightTab('editor')}
              className={`flex-1 py-1.5 text-[10px] font-bold font-mono uppercase rounded-md transition-all ${
                rightTab === 'editor' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              GLSL Shader Editor
            </button>
            <button
              onClick={() => setRightTab('ai')}
              className={`flex-1 py-1.5 text-[10px] font-bold font-mono uppercase rounded-md transition-all ${
                rightTab === 'ai' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              AI Shader Assistant
            </button>
          </div>

          <div className="flex-1 overflow-hidden">
            {rightTab === 'editor' ? (
              <div className="flex flex-col h-full gap-4">
                {/* Vertex vs Fragment subsegment controls */}
                <div className="flex bg-[#0b0c10] p-1 border border-[#1f212a] rounded-lg">
                  <button
                    onClick={() => setEditorShaderTab('vertex')}
                    className={`flex-1 py-1.5 text-[10px] font-bold font-mono uppercase rounded transition-all ${
                      editorShaderTab === 'vertex' ? 'bg-[#171822] text-cyan-400 shadow-sm border border-[#232635]' : 'text-gray-500 hover:text-gray-400'
                    }`}
                  >
                    Vertex Shader (Geometry)
                  </button>
                  <button
                    onClick={() => setEditorShaderTab('fragment')}
                    className={`flex-1 py-1.5 text-[10px] font-bold font-mono uppercase rounded transition-all ${
                      editorShaderTab === 'fragment' ? 'bg-[#171822] text-purple-400 shadow-sm border border-[#232635]' : 'text-gray-500 hover:text-gray-400'
                    }`}
                  >
                    Fragment Shader (Pixel)
                  </button>
                </div>

                <div className="flex-1 overflow-hidden">
                  {editorShaderTab === 'vertex' ? (
                    <CodeEditor
                      title="Vertex Source Buffer"
                      type="vertex"
                      value={vertexShader}
                      onChange={setVertexShader}
                      error={compileStatus.vertexError}
                      onCompile={() => {}}
                    />
                  ) : (
                    <CodeEditor
                      title="Fragment Source Buffer"
                      type="fragment"
                      value={fragmentShader}
                      onChange={setFragmentShader}
                      error={compileStatus.fragmentError}
                      onCompile={() => {}}
                    />
                  )}
                </div>
              </div>
            ) : (
              <AiAssistant
                currentVertex={vertexShader}
                currentFragment={fragmentShader}
                currentUniforms={customUniforms}
                onApplyGeneratedShader={applyGeneratedShader}
              />
            )}
          </div>
        </div>

      </main>

      {/* Export modalities Modal */}
      {isExportOpen && (
        <ExportModal
          onClose={() => setIsExportOpen(false)}
          objects={objects}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          customUniforms={customUniforms}
          isScreenSpaceMode={isScreenSpaceMode}
        />
      )}
    </div>
  );
}
