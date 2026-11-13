import React, { useState, useEffect } from 'react';
import { 
  Sparkles, ShieldCheck, Share2, Clipboard, Download, Users, 
  UserPlus, Lock, Unlock, CheckCircle2, AlertCircle, FileCode, Check, Award 
} from 'lucide-react';
import { 
  CollabLayer, CollabCertificate, PlayerAchievement, 
  generateVisualHash, verifyThreePlayerCollab, evaluateLayer4Unlock 
} from '../utils/collab';

interface CollabTerminalProps {
  layers: CollabLayer[];
  onImportLayer: (layer: CollabLayer) => void;
  onSignOffComposition: (certificate: CollabCertificate) => void;
  completedCertificates: CollabCertificate[];
  existingMeets: { players: string[] }[];
  onRecordMeet: (player1: string, player2: string) => void;
}

export default function CollabTerminal({
  layers,
  onImportLayer,
  onSignOffComposition,
  completedCertificates,
  existingMeets,
  onRecordMeet,
}: CollabTerminalProps) {
  // Swapping states
  const [ticketString, setTicketString] = useState('');
  const [importError, setImportError] = useState('');
  const [copied, setCopied] = useState(false);
  const [generatedTicket, setGeneratedTicket] = useState('');

  // Sign-off / bilateral protocol simulation
  const [playerMeets, setPlayerMeets] = useState<string>('fluidmotiontv');
  const [newMeetPartner, setNewMeetPartner] = useState('cyberdragon');

  // Layer 4 Achievements progression state (New Player progress stats)
  const [achievementState, setAchievementState] = useState<PlayerAchievement>({
    creatorName: 'new_player_4',
    individualMeetsCount: 1, // Start with partial achievements so they can complete them interactively!
    twopPlayerCompositionsCount: 1,
    threePlayerCompositionsCount: 0,
    unlockedLayer4: false,
  });

  // Calculate unlock status of Layer 4
  const layer4Progress = evaluateLayer4Unlock(achievementState);

  // Generate serialized Ticket of active Layer 1 (if exists) or create a fresh custom ticket
  const handleGenerateMyTicket = () => {
    const defaultLayer: CollabLayer = layers[0] || {
      id: `layer-${Date.now()}`,
      name: 'Pulsar Core Sphere',
      creator: 'fluidmotiontv',
      meshType: 'sphere',
      fragmentShader: `precision mediump float;
varying vec2 v_texcoord;
uniform float u_time;
uniform float u_bass;
void main() {
  vec2 uv = v_texcoord - 0.5;
  float d = length(uv) - (0.2 + u_bass * 0.15);
  vec3 color = mix(vec3(0.0, 0.8, 1.0), vec3(1.0, 0.0, 0.8), sin(u_time) * 0.5 + 0.5);
  gl_FragColor = vec4(color / max(0.01, d * 5.0), 1.0);
}`,
      synthTrackId: 'synthwave',
      rotationSpeed: 1.2,
      pulseRange: 0.8,
      baseColor: [0.0, 0.8, 1.0],
      signatureHash: 'sig_fmtv_0x23f',
    };

    const serialized = btoa(JSON.stringify(defaultLayer));
    setGeneratedTicket(serialized);
  };

  const copyTicket = () => {
    navigator.clipboard.writeText(generatedTicket);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    setImportError('');
    if (!ticketString.trim()) return;

    try {
      const decoded = JSON.parse(atob(ticketString.trim()));
      
      // Structure validation
      if (!decoded.creator || !decoded.fragmentShader || !decoded.meshType) {
        throw new Error('Ticket structure is missing valid parameters.');
      }

      onImportLayer({
        ...decoded,
        id: `collab-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      });

      // Record meet with this creator
      onRecordMeet('fluidmotiontv', decoded.creator);
      
      setTicketString('');
      // Trigger achievements progression bump!
      setAchievementState(prev => ({
        ...prev,
        individualMeetsCount: Math.min(3, prev.individualMeetsCount + 1),
        twopPlayerCompositionsCount: Math.min(2, prev.twopPlayerCompositionsCount + 1)
      }));

    } catch (err: any) {
      console.error(err);
      setImportError('Invalid or corrupted collaboration ticket string.');
    }
  };

  // Simulating meets between specific creators
  const handleTriggerMeetSimulation = () => {
    if (playerMeets && newMeetPartner && playerMeets !== newMeetPartner) {
      onRecordMeet(playerMeets, newMeetPartner);
    }
  };

  // Resolve 3P Bilateral Triangle checks
  const verifyTriangle = () => {
    if (layers.length < 3) return { success: false, missingPairs: [] };
    const p1 = layers[0].creator;
    const p2 = layers[1].creator;
    const p3 = layers[2].creator;
    return verifyThreePlayerCollab(p1, p2, p3, existingMeets);
  };

  const triangleStatus = verifyTriangle();
  const is3PReady = layers.length === 3 && triangleStatus.success;

  const handle3PSignOff = () => {
    if (!is3PReady) return;
    
    const creatorsList = layers.slice(0, 3).map(l => l.creator);
    const stampSeed = generateVisualHash(creatorsList);

    const certificate: CollabCertificate = {
      id: `cert-${Date.now()}`,
      title: 'Digital Nebula Collaborative Masterpiece',
      timestamp: new Date().toLocaleDateString(),
      creators: creatorsList,
      layers: [...layers.slice(0, 3)],
      type: '3P',
      isSigned: true,
      visualStampHash: stampSeed,
    };

    onSignOffComposition(certificate);
    
    // Bump achievements
    setAchievementState(prev => ({
      ...prev,
      threePlayerCompositionsCount: Math.min(2, prev.threePlayerCompositionsCount + 1)
    }));
  };

  return (
    <div className="flex flex-col h-full bg-[#111218] border border-[#1f212a] rounded-xl overflow-hidden shadow-2xl">
      {/* Title */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0e0f14] border-b border-[#1f212a]">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-emerald-400" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-300 font-mono">
            Collaboration Hub
          </h2>
        </div>
      </div>

      {/* Roster of active Creators in Composition */}
      <div className="p-3 border-b border-[#1f212a] bg-[#14151e]/40 font-mono text-[10px]">
        <span className="text-gray-500 font-semibold uppercase block mb-1.5 flex items-center gap-1">
          <Users className="w-3.5 h-3.5 text-cyan-400" /> active collaborators:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {layers.length === 0 ? (
            <span className="text-gray-500 italic py-1">No collaborators active in this composition.</span>
          ) : (
            layers.map((l, i) => (
              <span key={l.id} className="px-2 py-0.5 bg-[#171822] border border-[#232635] text-cyan-300 rounded font-semibold">
                @{l.creator} (Layer {i + 1})
              </span>
            ))
          )}
        </div>
      </div>

      {/* Swapping deck: generate ticket / paste ticket */}
      <div className="p-4 border-b border-[#1f212a] bg-[#12131a] space-y-4">
        {/* Generate ticket */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono text-gray-500 font-semibold uppercase block">
            Generate My Layer Ticket
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleGenerateMyTicket}
              className="px-3.5 py-1.5 bg-[#171822] hover:bg-[#232635] text-[11px] text-cyan-400 font-mono font-bold rounded border border-[#232635] hover:border-cyan-500/30 flex-1 transition-all"
            >
              🚀 ENCODE LAYER TICKET
            </button>
            {generatedTicket && (
              <button
                onClick={copyTicket}
                className="px-3 py-1.5 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded text-[11px] font-mono font-bold flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Clipboard className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            )}
          </div>
          {generatedTicket && (
            <p className="text-[9px] font-mono text-gray-600 break-all select-all line-clamp-1 border border-[#1f212a] p-1 rounded bg-[#0b0c10]">
              {generatedTicket}
            </p>
          )}
        </div>

        {/* Paste collaborator's ticket */}
        <form onSubmit={handleImport} className="space-y-1.5">
          <span className="text-[10px] font-mono text-gray-500 font-semibold uppercase block">
            Import Collaborator Ticket
          </span>
          <div className="flex gap-1.5">
            <input
              type="text"
              placeholder="Paste Layer Ticket Base64 code..."
              value={ticketString}
              onChange={(e) => setTicketString(e.target.value)}
              className="flex-1 bg-[#0b0c10] border border-[#232635] focus:border-cyan-500/50 rounded px-2.5 py-1 text-xs font-mono focus:outline-none text-white placeholder-gray-600"
            />
            <button
              type="submit"
              className="px-3 py-1 bg-cyan-500 text-black hover:bg-cyan-400 font-bold rounded text-xs shrink-0 font-mono transition-colors"
            >
              MERGE
            </button>
          </div>
          {importError && <p className="text-[9px] text-red-400 font-mono">{importError}</p>}
        </form>
      </div>

      {/* Meets Recorder Simulator */}
      <div className="p-3 border-b border-[#1f212a] bg-[#14151e]/20 flex flex-col gap-2 font-mono text-[10px]">
        <div className="flex justify-between items-center">
          <span className="text-gray-500 font-semibold uppercase flex items-center gap-1">
            <UserPlus className="w-3.5 h-3.5 text-cyan-400" /> Physical Meet Register
          </span>
          <span className="text-gray-500 tabular-nums font-bold bg-black/40 px-1.5 py-0.5 rounded">
            {existingMeets.length} Total Meets
          </span>
        </div>
        
        <div className="flex gap-1.5">
          <select
            value={playerMeets}
            onChange={(e) => setPlayerMeets(e.target.value)}
            className="flex-1 bg-[#0b0c10] border border-[#232635] text-white focus:outline-none rounded px-2 py-1 text-xs focus:text-cyan-300"
          >
            <option value="fluidmotiontv">@fluidmotiontv</option>
            <option value="cyberdragon">@cyberdragon</option>
            <option value="neon_spectre">@neon_spectre</option>
            <option value="new_player_4">@new_player_4</option>
          </select>
          <span className="text-gray-600 font-bold self-center">⟷</span>
          <select
            value={newMeetPartner}
            onChange={(e) => setNewMeetPartner(e.target.value)}
            className="flex-1 bg-[#0b0c10] border border-[#232635] text-white focus:outline-none rounded px-2 py-1 text-xs focus:text-cyan-300"
          >
            <option value="cyberdragon">@cyberdragon</option>
            <option value="neon_spectre">@neon_spectre</option>
            <option value="new_player_4">@new_player_4</option>
            <option value="fluidmotiontv">@fluidmotiontv</option>
          </select>
          <button
            onClick={handleTriggerMeetSimulation}
            className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 rounded text-[10px] font-bold"
          >
            REGISTER MEET
          </button>
        </div>
      </div>

      {/* 3P Bilateral Sign-off checklist */}
      {layers.length === 3 && (
        <div className="p-4 border-b border-[#1f212a] bg-cyan-950/5 space-y-3 font-mono text-[11px]">
          <span className="font-bold text-white uppercase text-[10px] tracking-wider block flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-cyan-400" /> 3P Bilateral Protocol Validator
          </span>
          <p className="text-[10px] text-gray-400 leading-normal">
            For a composition of three, verified physical meets must have occurred between all three combinations before signing off!
          </p>

          <div className="space-y-1.5 text-[10px]">
            {[
              [`@${layers[0].creator}`, `@${layers[1].creator}`, 0],
              [`@${layers[1].creator}`, `@${layers[2].creator}`, 1],
              [`@${layers[0].creator}`, `@${layers[2].creator}`, 2],
            ].map(([p1, p2, idx]: any, i) => {
              const creator1 = layers[i % 3].creator;
              const creator2 = layers[(i+1) % 3].creator;
              const pairMatched = existingMeets.some(meet => 
                meet.players.includes(creator1) && meet.players.includes(creator2)
              );
              return (
                <div key={i} className="flex justify-between items-center bg-[#0b0c10] px-2.5 py-1.5 rounded border border-[#1f212a]">
                  <span className="text-gray-400">{p1} ⟷ {p2} meet</span>
                  <span className={`font-bold uppercase text-[9px] px-1.5 py-0.2 rounded ${
                    pairMatched ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10 animate-pulse'
                  }`}>
                    {pairMatched ? '✓ VERIFIED' : '✗ MISSING'}
                  </span>
                </div>
              );
            })}
          </div>

          <button
            onClick={handle3PSignOff}
            disabled={!is3PReady}
            className={`w-full py-2.5 font-bold rounded-lg text-xs tracking-wider flex items-center justify-center gap-2 border transition-all ${
              is3PReady
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black border-transparent shadow shadow-emerald-500/20'
                : 'bg-[#171822] text-gray-500 border-[#232635] cursor-not-allowed'
            }`}
          >
            <ShieldCheck className="w-4 h-4 shrink-0" />
            {is3PReady ? 'SIGN OFF MULTI-PLAYER COMPOSITION' : 'PENDING BILATERAL MEETS'}
          </button>
        </div>
      )}

      {/* Layer 4 Achievement lock panel */}
      <div className="p-4 bg-[#0e0f14]/80 flex-1 space-y-3 overflow-y-auto">
        <div className="flex items-center justify-between border-b border-[#1f212a] pb-1.5 font-mono">
          <span className="text-[10px] font-bold uppercase text-gray-400 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-cyan-400 animate-pulse" /> Layer 4 Achievement Lock
          </span>
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 ${
            layer4Progress.eligible ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-500 animate-pulse'
          }`}>
            {layer4Progress.eligible ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
            {layer4Progress.eligible ? 'UNLOCKED' : 'LOCKED'}
          </span>
        </div>

        <p className="text-[10px] text-gray-500 leading-normal font-sans">
          To merge Layer 4 (the 4th player), the joining player must complete these strict community achievements:
        </p>

        <div className="space-y-2.5 font-mono text-[10px]">
          {/* Req 1: 3 Meets */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-400">1. Individual Swapping Meets</span>
              <span className={layer4Progress.requirements.individualMeets.met ? 'text-emerald-400 font-bold' : 'text-gray-500'}>
                {layer4Progress.requirements.individualMeets.current} / 3 Completed
              </span>
            </div>
            <div className="w-full h-1 bg-black/60 rounded overflow-hidden">
              <div
                className="h-full bg-cyan-400"
                style={{ width: `${Math.min(100, (layer4Progress.requirements.individualMeets.current / 3) * 100)}%` }}
              />
            </div>
          </div>

          {/* Req 2: 2 2P Shaders */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-400">2. Two-Player (2P) Shaders compiled</span>
              <span className={layer4Progress.requirements.twoPlayerCompositions.met ? 'text-emerald-400 font-bold' : 'text-gray-500'}>
                {layer4Progress.requirements.twoPlayerCompositions.current} / 2 Completed
              </span>
            </div>
            <div className="w-full h-1 bg-black/60 rounded overflow-hidden">
              <div
                className="h-full bg-cyan-400"
                style={{ width: `${Math.min(100, (layer4Progress.requirements.twoPlayerCompositions.current / 2) * 100)}%` }}
              />
            </div>
          </div>

          {/* Req 3: 2 3P Shaders */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-400">3. Three-Player (3P) Shaders signed</span>
              <span className={layer4Progress.requirements.threePlayerCompositions.met ? 'text-emerald-400 font-bold' : 'text-gray-500'}>
                {layer4Progress.requirements.threePlayerCompositions.current} / 2 Completed
              </span>
            </div>
            <div className="w-full h-1 bg-black/60 rounded overflow-hidden">
              <div
                className="h-full bg-cyan-400"
                style={{ width: `${Math.min(100, (layer4Progress.requirements.threePlayerCompositions.current / 2) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Quick Simulation controllers to bypass locks */}
        {!layer4Progress.eligible && (
          <div className="pt-2 border-t border-[#1f212a]/40 space-y-1.5">
            <span className="text-[8px] font-mono text-gray-500 uppercase block font-semibold">Simulate Player Achievements (Unlock Layer 4)</span>
            <div className="grid grid-cols-3 gap-1 text-[9px] font-mono">
              <button
                onClick={() => setAchievementState(prev => ({ ...prev, individualMeetsCount: 3 }))}
                className="py-1 bg-[#171822] hover:bg-white/5 border border-[#232635] text-cyan-400 rounded font-semibold"
              >
                + Meets
              </button>
              <button
                onClick={() => setAchievementState(prev => ({ ...prev, twopPlayerCompositionsCount: 2 }))}
                className="py-1 bg-[#171822] hover:bg-white/5 border border-[#232635] text-cyan-400 rounded font-semibold"
              >
                + 2P Shaders
              </button>
              <button
                onClick={() => setAchievementState(prev => ({ ...prev, threePlayerCompositionsCount: 2 }))}
                className="py-1 bg-[#171822] hover:bg-white/5 border border-[#232635] text-cyan-400 rounded font-semibold"
              >
                + 3P Shaders
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
