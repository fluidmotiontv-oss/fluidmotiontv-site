import React, { useState } from 'react';
import { Users, Globe, Sparkles, Plus, Award, UserCheck, Flame, Zap, Grid, Heart, Shield, Radio, CheckCircle } from 'lucide-react';
import { CollabLayer } from '../utils/collab';

interface ArtistNode {
  username: string;
  hash: string;
  preferredMesh: 'torus' | 'sphere' | 'cube' | 'cylinder' | 'plane';
  color: string;
  collabsCount: number;
  joinedDate: string;
  quote: string;
  layerData: Omit<CollabLayer, 'id'>;
  x: number; // Coords for network map
  y: number;
}

interface ArtistWallProps {
  onHarvestLayer: (layer: CollabLayer) => void;
  onRecordMeet: (p1: string, p2: string) => void;
  existingMeets: { players: string[] }[];
  bass: number;
  mids: number;
  onLoadHeatmapShader?: (title: string, optionsWeights: [number, number, number]) => void;
}

interface Survey {
  id: string;
  title: string;
  question: string;
  options: string[];
}

const SURVEYS: Survey[] = [
  {
    id: 'focus',
    title: 'Aesthetic Direction',
    question: 'What is the sovereign developer focus for the future?',
    options: ['Raymarching SDFs', '3D Vertex Waves', 'Procedural Synths'],
  },
  {
    id: 'somatic',
    title: 'Somatic awakening core',
    question: 'Which PM2 boot phase is most critical for cyber-dragon ignition?',
    options: ['Phase 1: Clock Heartbeat', 'Phase 3: Immune Shield', 'Phase 4: Dynamic Cortex'],
  },
  {
    id: 'sovereign',
    title: 'Digital Sovereignty',
    question: 'What is the ultimate medium of collaborative memory?',
    options: ['Bilateral Signed Stacks', 'Sovereign Passports', 'Fluid Motion TV Nodes'],
  }
];

export default function ArtistWall({
  onHarvestLayer,
  onRecordMeet,
  existingMeets,
  bass,
  mids,
  onLoadHeatmapShader,
}: ArtistWallProps) {
  const [viewMode, setViewMode] = useState<'roster' | 'heatmap'>('heatmap');
  const [activeSurveyIdx, setActiveSurveyIdx] = useState(0);
  
  // Live survey database (persisted in state)
  const [surveyVotes, setSurveyVotes] = useState<Record<string, Record<string, number>>>({
    focus: {
      fluidmotiontv: 0,
      cyberdragon: 0,
      neon_spectre: 1,
      dinero9: 2,
      wave_sov: 0,
      sol_weaver: 1,
      fluidmotiontv_user: 0 // Active user
    },
    somatic: {
      fluidmotiontv: 2,
      cyberdragon: 2,
      neon_spectre: 0,
      dinero9: 1,
      wave_sov: 2,
      sol_weaver: 0,
      fluidmotiontv_user: 2
    },
    sovereign: {
      fluidmotiontv: 0,
      cyberdragon: 1,
      neon_spectre: 0,
      dinero9: 0,
      wave_sov: 1,
      sol_weaver: 1,
      fluidmotiontv_user: 0
    }
  });

  const activeSurvey = SURVEYS[activeSurveyIdx];

  // 6 Global Artist nodes representing the digital west side/wave movement
  const globalArtists: ArtistNode[] = [
    {
      username: 'fluidmotiontv',
      hash: 'ae_f1a8e2',
      preferredMesh: 'sphere',
      color: '#00f3ff',
      collabsCount: 5,
      joinedDate: 'Oct 2026',
      quote: 'Awakening the cyber dragon somatic heartbeat loop.',
      x: 35,
      y: 45,
      layerData: {
        name: 'Somatic Dragon Core',
        creator: 'fluidmotiontv',
        meshType: 'sphere',
        fragmentShader: `precision mediump float;
varying vec2 v_texcoord;
uniform float u_time;
uniform float u_bass;
void main() {
  vec2 uv = v_texcoord - 0.5;
  float dist = length(uv);
  float ripple = sin(dist * 20.0 - u_time * 8.0) * (0.02 + u_bass * 0.1);
  vec3 col = mix(vec3(0.0, 0.9, 1.0), vec3(0.1, 0.0, 0.8), dist + ripple);
  gl_FragColor = vec4(col / max(0.01, dist + ripple), 1.0);
}`,
        synthTrackId: 'synthwave',
        rotationSpeed: 1.5,
        pulseRange: 0.9,
        baseColor: [0.0, 0.9, 1.0],
        signatureHash: 'ae_f1a8e2',
      }
    },
    {
      username: 'cyberdragon',
      hash: 'ae_cd923f',
      preferredMesh: 'torus',
      color: '#ff0077',
      collabsCount: 4,
      joinedDate: 'Oct 2026',
      quote: 'Engaging dynamic cortex systems. Fluid motion is active.',
      x: 75,
      y: 35,
      layerData: {
        name: 'Cortex Torus Shell',
        creator: 'cyberdragon',
        meshType: 'torus',
        fragmentShader: `precision mediump float;
varying vec2 v_texcoord;
uniform float u_time;
uniform float u_bass;
void main() {
  vec2 uv = fract(v_texcoord * 8.0 - u_time * 0.5);
  float grid = step(0.1 + u_bass * 0.2, uv.x) * step(0.1 + u_bass * 0.2, uv.y);
  vec3 col = mix(vec3(1.0, 0.0, 0.5), vec3(0.0, 0.0, 0.0), grid);
  gl_FragColor = vec4(col, 1.0);
}`,
        synthTrackId: 'ambient',
        rotationSpeed: 0.8,
        pulseRange: 1.1,
        baseColor: [1.0, 0.0, 0.5],
        signatureHash: 'ae_cd923f',
      }
    },
    {
      username: 'neon_spectre',
      hash: 'ae_ns77b1',
      preferredMesh: 'cube',
      color: '#00ff66',
      collabsCount: 3,
      joinedDate: 'Nov 2026',
      quote: 'Slicing coordinates inside standard vector layers.',
      x: 22,
      y: 75,
      layerData: {
        name: 'Prism Space Mesh',
        creator: 'neon_spectre',
        meshType: 'cube',
        fragmentShader: `precision mediump float;
varying vec2 v_texcoord;
uniform float u_time;
uniform float u_mids;
void main() {
  vec3 col = vec3(v_texcoord.x, v_texcoord.y, sin(u_time) * 0.5 + 0.5);
  col += vec3(u_mids * 0.5);
  gl_FragColor = vec4(col, 1.0);
}`,
        synthTrackId: 'chiptune',
        rotationSpeed: 1.2,
        pulseRange: 0.6,
        baseColor: [0.0, 1.0, 0.4],
        signatureHash: 'ae_ns77b1',
      }
    },
    {
      username: 'dinero9',
      hash: 'ae_d99901',
      preferredMesh: 'cylinder',
      color: '#ffaa00',
      collabsCount: 7,
      joinedDate: 'Dec 2026',
      quote: 'Worldwide West Side Mexican Dinero9 digital wave sovereign.',
      x: 50,
      y: 80,
      layerData: {
        name: 'Dinero Sovereign Wave',
        creator: 'dinero9',
        meshType: 'cylinder',
        fragmentShader: `precision mediump float;
varying vec2 v_texcoord;
uniform float u_time;
uniform float u_bass;
void main() {
  float wave = sin(v_texcoord.x * 12.0 + u_time * 6.0) * (0.05 + u_bass * 0.1);
  float line = smoothstep(0.02, 0.0, abs(v_texcoord.y - 0.5 - wave));
  vec3 col = mix(vec3(0.02, 0.05, 0.08), vec3(1.0, 0.7, 0.0), line);
  gl_FragColor = vec4(col, 1.0);
}`,
        synthTrackId: 'synthwave',
        rotationSpeed: 0.5,
        pulseRange: 0.3,
        baseColor: [1.0, 0.7, 0.0],
        signatureHash: 'ae_d99901',
      }
    },
    {
      username: 'wave_sov',
      hash: 'ae_wv33a5',
      preferredMesh: 'plane',
      color: '#8800ff',
      collabsCount: 4,
      joinedDate: 'Jan 2027',
      quote: 'Digital sovereignty inside open-source wave buffers.',
      x: 80,
      y: 65,
      layerData: {
        name: 'Sovereign Buffer Height',
        creator: 'wave_sov',
        meshType: 'plane',
        fragmentShader: `precision mediump float;
varying vec2 v_texcoord;
uniform float u_time;
void main() {
  vec2 uv = fract(v_texcoord * 4.0);
  vec3 col = vec3(0.5 + 0.5 * cos(u_time+uv.xyx+vec3(0,2,4)));
  gl_FragColor = vec4(col, 1.0);
}`,
        synthTrackId: 'ambient',
        rotationSpeed: 0.2,
        pulseRange: 0.5,
        baseColor: [0.5, 0.0, 1.0],
        signatureHash: 'ae_wv33a5',
      }
    },
    {
      username: 'sol_weaver',
      hash: 'ae_sw50f9',
      preferredMesh: 'sphere',
      color: '#ffcc00',
      collabsCount: 2,
      joinedDate: 'Feb 2027',
      quote: 'Mapping solar flares to audio-reactive frequencies.',
      x: 18,
      y: 28,
      layerData: {
        name: 'Solar Flare Particle',
        creator: 'sol_weaver',
        meshType: 'sphere',
        fragmentShader: `precision mediump float;
varying vec2 v_texcoord;
uniform float u_time;
void main() {
  vec2 uv = v_texcoord - 0.5;
  float d = length(uv);
  gl_FragColor = vec4(vec3(0.1 / d) * vec3(1.0, 0.5, 0.1), 1.0);
}`,
        synthTrackId: 'chiptune',
        rotationSpeed: 1.1,
        pulseRange: 0.7,
        baseColor: [1.0, 0.5, 0.1],
        signatureHash: 'ae_sw50f9',
      }
    }
  ];

  // Recalculate survey stats dynamically
  const activeVotesObj = surveyVotes[activeSurvey.id] || {};
  const optionCounts = [0, 0, 0];
  
  // Aggregate artist pre-set votes + active user votes
  globalArtists.forEach(artist => {
    const artistVote = activeVotesObj[artist.username];
    if (artistVote !== undefined) {
      optionCounts[artistVote]++;
    }
  });
  // Add user vote (@fluidmotiontv's personal vote)
  const userVote = activeVotesObj['fluidmotiontv_user'];
  if (userVote !== undefined) {
    optionCounts[userVote]++;
  }

  const totalVotes = optionCounts.reduce((a, b) => a + b, 0);
  const optionPercentages = optionCounts.map(count => 
    totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0
  );

  const handleCastVote = (optIdx: number) => {
    setSurveyVotes(prev => ({
      ...prev,
      [activeSurvey.id]: {
        ...prev[activeSurvey.id],
        fluidmotiontv_user: optIdx
      }
    }));
  };

  const syncSurveyToWebGL = () => {
    if (!onLoadHeatmapShader) return;
    const weights: [number, number, number] = [
      optionCounts[0],
      optionCounts[1],
      optionCounts[2]
    ];
    onLoadHeatmapShader(activeSurvey.title + ' Heatmap', weights);
  };

  return (
    <div className="flex flex-col h-full bg-[#111218] border border-[#1f212a] rounded-xl overflow-hidden shadow-2xl">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0e0f14] border-b border-[#1f212a]">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-emerald-400 animate-spin" style={{ animationDuration: '12s' }} />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-300 font-mono">
            Sovereign West-Side Net
          </h2>
        </div>
        
        {/* Toggle between roster profiles and survey heatmap */}
        <div className="flex p-0.5 bg-black/40 border border-[#232635] rounded-md gap-0.5 select-none shrink-0">
          <button
            onClick={() => setViewMode('roster')}
            className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase transition-all ${
              viewMode === 'roster' ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-500 hover:text-gray-400'
            }`}
          >
            Artists
          </button>
          <button
            onClick={() => setViewMode('heatmap')}
            className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase transition-all ${
              viewMode === 'heatmap' ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-500 hover:text-gray-400'
            }`}
          >
            Live Heatmap
          </button>
        </div>
      </div>

      {/* Roster View */}
      {viewMode === 'roster' ? (
        <>
          <div className="p-3 border-b border-[#1f212a] bg-[#14151e]/40 text-[10px] font-mono text-gray-400 leading-normal flex items-start gap-2 select-none">
            <Sparkles className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
            <p>
              Welcome to the **Sovereign West-Side Digital Wave Movement**. Commune with other sovereign graphics artists, record collaboration meets, or harvest their custom shader layers.
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-[#12131a]">
            {globalArtists.map((artist) => {
              const alreadyMet = existingMeets.some(m => 
                m.players.includes('fluidmotiontv') && m.players.includes(artist.username)
              );

              // Audio-reactive visual pulse offsets
              const pulseScale = 1.0 + bass * 0.15;
              const rotationAngle = (mids * 45) % 360;

              return (
                <div
                  key={artist.username}
                  className="p-3.5 bg-[#171822]/60 border border-[#1f212a] hover:border-[#2b2e40] rounded-xl transition-all flex items-start gap-3.5 shadow-sm group"
                >
                  <div 
                    className="w-12 h-12 rounded-lg bg-black/40 border border-[#232635] flex items-center justify-center shrink-0 overflow-hidden relative"
                    style={{ borderColor: `${artist.color}30` }}
                  >
                    <svg
                      viewBox="0 0 100 100"
                      className="w-full h-full transition-transform duration-75"
                      style={{
                        transform: `scale(${pulseScale}) rotate(${rotationAngle}deg)`,
                      }}
                    >
                      <defs>
                        <linearGradient id={`grad-${artist.username}`} x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor={artist.color} />
                          <stop offset="100%" stopColor="#7a00ff" />
                        </linearGradient>
                      </defs>
                      
                      {artist.preferredMesh === 'sphere' && (
                        <circle cx="50" cy="50" r="30" fill={`url(#grad-${artist.username})`} opacity="0.85" />
                      )}
                      {artist.preferredMesh === 'torus' && (
                        <circle cx="50" cy="50" r="30" stroke={`url(#grad-${artist.username})`} strokeWidth="12" fill="none" opacity="0.85" />
                      )}
                      {artist.preferredMesh === 'cube' && (
                        <rect x="22" y="22" width="56" height="56" fill={`url(#grad-${artist.username})`} rx="8" opacity="0.85" />
                      )}
                      {artist.preferredMesh === 'cylinder' && (
                        <path d="M25,30 C25,20 75,20 75,30 L75,70 C75,80 25,80 25,70 Z" fill={`url(#grad-${artist.username})`} opacity="0.85" />
                      )}
                      {artist.preferredMesh === 'plane' && (
                        <rect x="15" y="15" width="70" height="70" fill={`url(#grad-${artist.username})`} rx="4" opacity="0.85" />
                      )}
                      
                      <circle cx="50" cy="50" r={35 + bass * 10} stroke={artist.color} strokeWidth="2" fill="none" opacity="0.4" />
                    </svg>

                    <span className="absolute bottom-0.5 right-1 text-[7px] text-gray-500 font-mono">
                      {artist.hash}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold font-mono text-white flex items-center gap-1">
                        @{artist.username}
                        {artist.username === 'dinero9' && <Flame className="w-3.5 h-3.5 text-yellow-500 animate-pulse" />}
                      </span>
                      
                      <span className="text-[8px] bg-black/40 text-gray-500 font-mono px-1.5 py-0.5 rounded">
                        Tier {artist.collabsCount >= 5 ? 'Sovereign' : 'Collector'}
                      </span>
                    </div>

                    <p className="text-[10px] text-gray-400 font-sans italic leading-tight mt-1 line-clamp-2">
                      &ldquo;{artist.quote}&rdquo;
                    </p>

                    <div className="mt-3.5 flex items-center justify-between gap-2 border-t border-[#1f212a]/30 pt-2.5">
                      <div className="text-[8px] font-mono text-gray-500 flex items-center gap-1">
                        <Award className="w-3 h-3 text-yellow-600" />
                        {artist.collabsCount} Signed Compositions
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onRecordMeet('fluidmotiontv', artist.username)}
                          className={`px-2 py-1 text-[9px] font-mono font-bold rounded flex items-center gap-1 transition-all ${
                            alreadyMet
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-[#171822] hover:bg-emerald-500/10 text-gray-400 hover:text-emerald-300 border border-[#232635] hover:border-emerald-500/30'
                          }`}
                        >
                          {alreadyMet ? <UserCheck className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                          {alreadyMet ? 'MET' : 'MEET'}
                        </button>

                        <button
                          onClick={() => {
                            onHarvestLayer({
                              ...artist.layerData,
                              id: `harvest-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`
                            });
                          }}
                          className="px-2 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 hover:text-cyan-200 rounded text-[9px] font-mono font-bold border border-cyan-500/20 hover:border-cyan-500/40 flex items-center gap-1 transition-all"
                        >
                          <Plus className="w-3 h-3" />
                          HARVEST
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* Global Survey Heatmap View */
        <div className="flex-1 flex flex-col overflow-hidden bg-[#12131a]">
          
          {/* Survey Selector Tabs */}
          <div className="grid grid-cols-3 gap-1 p-2 bg-[#0c0d12] border-b border-[#1f212a]">
            {SURVEYS.map((survey, sIdx) => (
              <button
                key={survey.id}
                onClick={() => setActiveSurveyIdx(sIdx)}
                className={`py-1 px-1.5 rounded text-[8px] font-mono font-bold uppercase tracking-tight text-center truncate border transition-all ${
                  activeSurveyIdx === sIdx
                    ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/20 shadow-sm'
                    : 'bg-[#171822] text-gray-500 border-transparent hover:text-gray-400'
                }`}
              >
                {survey.title}
              </button>
            ))}
          </div>

          <div className="p-3 border-b border-[#1f212a]/50 bg-[#14151e]/20 text-[10px] font-mono text-gray-500 leading-normal select-none flex items-start gap-1.5">
            <Radio className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5 animate-pulse" />
            <p>
              Displaying the active community heatmap response distribution mapping network node temperatures.
            </p>
          </div>

          {/* SVG Network Vector Heatmap */}
          <div className="h-44 shrink-0 bg-black/40 relative border-b border-[#1f212a]/60 overflow-hidden select-none">
            
            {/* Glowing grids */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,19,26,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(18,19,26,0.3)_1px,transparent_1px)] bg-[size:16px_16px] opacity-60"></div>
            
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Web line connections mapping network density */}
              <line x1="35" y1="45" x2="75" y2="35" stroke="rgba(0, 243, 255, 0.15)" strokeWidth="0.8" />
              <line x1="35" y1="45" x2="22" y2="75" stroke="rgba(0, 243, 255, 0.15)" strokeWidth="0.8" />
              <line x1="22" y1="75" x2="50" y2="80" stroke="rgba(0, 243, 255, 0.15)" strokeWidth="0.8" />
              <line x1="75" y1="35" x2="80" y2="65" stroke="rgba(0, 243, 255, 0.15)" strokeWidth="0.8" />
              <line x1="50" y1="80" x2="80" y2="65" stroke="rgba(0, 243, 255, 0.15)" strokeWidth="0.8" />
              <line x1="18" y1="28" x2="35" y2="45" stroke="rgba(0, 243, 255, 0.15)" strokeWidth="0.8" />
              <line x1="18" y1="28" x2="22" y2="75" stroke="rgba(0, 243, 255, 0.15)" strokeWidth="0.8" />

              {/* Render Nodes with Thermal Heat Signature rings */}
              {globalArtists.map((artist) => {
                const nodeVote = activeVotesObj[artist.username] ?? 0;
                
                // Color mapping representing option choices: 0=Blue, 1=Purple/Teal, 2=Yellow/Red
                const voteColors = ['#00f3ff', '#a855f7', '#f59e0b'];
                const color = voteColors[nodeVote] || '#c5c6c7';

                // Size scales with sub-band audio bass and option percentages
                const matchingPercentage = optionPercentages[nodeVote] || 33;
                const baseRadius = 3 + (matchingPercentage / 25);
                const activeRadius = baseRadius + (bass * 2.5);

                return (
                  <g key={artist.username} className="cursor-pointer group">
                    {/* Glowing outer aura heat ring */}
                    <circle
                      cx={artist.x}
                      cy={artist.y}
                      r={activeRadius * 2.2}
                      fill={color}
                      opacity={0.1 + mids * 0.15}
                      className="transition-all duration-300"
                    />
                    
                    {/* Core node */}
                    <circle
                      cx={artist.x}
                      cy={artist.y}
                      r={activeRadius}
                      fill={color}
                      opacity="0.85"
                      className="transition-all duration-100"
                    />

                    {/* Miniature center node dot */}
                    <circle cx={artist.x} cy={artist.y} r="1.5" fill="#fff" />

                    {/* Artist micro labels */}
                    <text
                      x={artist.x}
                      y={artist.y - activeRadius - 2.5}
                      fill="#8f93a2"
                      fontSize="4.5"
                      fontFamily="monospace"
                      textAnchor="middle"
                      className="font-bold select-none opacity-80 group-hover:opacity-100 pointer-events-none"
                    >
                      @{artist.username}
                    </text>
                  </g>
                );
              })}

              {/* User Active Node position (@fluidmotiontv user) */}
              <g>
                <circle cx="50" cy="50" r={4 + bass * 3} fill="#059669" opacity="0.8" />
                <circle cx="50" cy="50" r="1.8" fill="#ffffff" />
                <text x="50" y="44" fill="#10b981" fontSize="4.5" fontFamily="monospace" textAnchor="middle" className="font-extrabold select-none">
                  @You
                </text>
              </g>
            </svg>
          </div>

          {/* Interactive Live Survey Questions Panel */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            
            <div className="space-y-1.5 font-sans">
              <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest font-extrabold flex items-center gap-1">
                <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" /> Live Poll:
              </span>
              <h3 className="text-xs font-bold text-white font-mono leading-snug">
                {activeSurvey.question}
              </h3>
            </div>

            {/* Voting Options */}
            <div className="space-y-2 font-mono text-[11px]">
              {activeSurvey.options.map((option, optIdx) => {
                const hasVoted = activeVotesObj['fluidmotiontv_user'] === optIdx;
                const percentage = optionPercentages[optIdx];
                const voteCount = optionCounts[optIdx];

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleCastVote(optIdx)}
                    className={`w-full p-3 rounded-xl border text-left flex items-center justify-between gap-4 transition-all ${
                      hasVoted
                        ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                        : 'bg-[#171822]/60 border-[#1f212a] hover:border-[#232635] text-gray-300 hover:bg-[#1a1b28]/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${
                        optIdx === 0 ? 'bg-cyan-400' : optIdx === 1 ? 'bg-purple-400' : 'bg-amber-400'
                      }`}></span>
                      <span className="truncate font-semibold text-[10.5px]">{option}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 font-bold">
                      <span className="text-gray-500 text-[10px] tabular-nums font-semibold">({voteCount} votes)</span>
                      <span className="text-cyan-400 text-xs tabular-nums">{percentage}%</span>
                      {hasVoted && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Sync WebGL Shader button */}
            {onLoadHeatmapShader && (
              <div className="pt-3 border-t border-[#1f212a]/50">
                <button
                  onClick={syncSurveyToWebGL}
                  className="w-full py-2 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 hover:from-emerald-500/30 hover:to-cyan-500/30 text-cyan-300 hover:text-cyan-200 border border-cyan-500/30 hover:border-cyan-500/50 rounded-lg text-xs font-bold font-mono tracking-wide flex items-center justify-center gap-2 transition-all shadow-sm shadow-emerald-500/5"
                >
                  <Globe className="w-3.5 h-3.5 shrink-0" />
                  LOAD COMMUNITY HEATMAP SHADER
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
