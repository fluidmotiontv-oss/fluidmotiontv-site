import React, { useState } from 'react';
import {
  FolderOpen,
  X,
  ChevronLeft,
  ChevronRight,
  GripVertical,
  ImageIcon,
  Music,
  MessageSquare,
  Sparkles,
  Play,
  Copy,
  Plus,
  Search,
  CheckCircle2,
  Tag,
  Zap,
  Layers,
  Filter,
  Film,
  Clock,
  Hash,
  Compass
} from 'lucide-react';

export interface QuickAsset {
  id: string;
  type: 'vector' | 'beat' | 'comic';
  title: string;
  category: string;
  previewUrl?: string;
  svgData?: string;
  bpm?: number;
  tags: string[];
  description: string;
  colorHex?: string;
  projectType?: 'Surf Movie' | 'Cyber Comic' | 'Radio Beats' | 'Sovereign Badges' | 'General';
  creativeSession?: 'Dawn Session' | 'Apex Hour' | 'Golden Hour' | 'Night Dub' | 'Mesh Hack';
}

interface QuickAssetDrawerProps {
  onInsertAsset?: (asset: QuickAsset) => void;
  onNavigateTab?: (tab: string) => void;
}

const DEFAULT_ASSETS: QuickAsset[] = [
  {
    id: 'sticker-01',
    type: 'vector',
    title: 'Port Waikato Sunset Wave',
    category: 'Stickers',
    colorHex: '#F27D26',
    projectType: 'Sovereign Badges',
    creativeSession: 'Golden Hour',
    tags: ['#Sunset', '#Wave', '#Vector', '#GoldenHour', '#SovereignBadges'],
    description: 'High-contrast 1:1 orange wave badge with cyber grid lines.',
    svgData: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="#050505" rx="16"/>
      <circle cx="50" cy="50" r="38" fill="none" stroke="#F27D26" stroke-width="3"/>
      <path d="M 20,60 Q 35,30 50,60 T 80,60" fill="none" stroke="#00E5FF" stroke-width="4"/>
      <circle cx="50" cy="35" r="8" fill="#F27D26"/>
    </svg>`,
  },
  {
    id: 'sticker-02',
    type: 'vector',
    title: 'Pee Dub Surfboard Shield',
    category: 'Stickers',
    colorHex: '#00E5FF',
    projectType: 'Sovereign Badges',
    creativeSession: 'Dawn Session',
    tags: ['#Surfboard', '#Shield', '#Cyan', '#DawnSession', '#AS65001'],
    description: 'Sovereign AS65001 mesh node surf emblem.',
    svgData: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="#050505" rx="16"/>
      <path d="M 50,15 L 80,30 L 80,70 L 50,88 L 20,70 L 20,30 Z" fill="none" stroke="#00E5FF" stroke-width="3"/>
      <path d="M 50,20 Q 60,50 50,80 Q 40,50 50,20" fill="#00FF88"/>
    </svg>`,
  },
  {
    id: 'sticker-03',
    type: 'vector',
    title: 'Dragon 9 Temporal Sol',
    category: 'Stickers',
    colorHex: '#00FF88',
    projectType: 'Surf Movie',
    creativeSession: 'Apex Hour',
    tags: ['#Sol', '#Dragon9', '#Neon', '#ApexHour', '#SurfMovie'],
    description: '26H solar cycle emblem with Apex Wedge indicators.',
    svgData: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="#050505" rx="16"/>
      <circle cx="50" cy="50" r="30" fill="none" stroke="#00FF88" stroke-width="4" stroke-dasharray="6,3"/>
      <polygon points="50,25 58,42 75,50 58,58 50,75 42,58 25,50 42,42" fill="#F27D26"/>
    </svg>`,
  },
  {
    id: 'sticker-04',
    type: 'vector',
    title: 'Sovereign 90/9/1 Badge',
    category: 'Stickers',
    colorHex: '#FFD700',
    projectType: 'Sovereign Badges',
    creativeSession: 'Apex Hour',
    tags: ['#Economy', '#Badge', '#Gold', '#ApexHour', '#SovereignBadges'],
    description: 'Creator sovereignty token badge.',
    svgData: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="#050505" rx="16"/>
      <circle cx="50" cy="50" r="35" fill="#111" stroke="#FFD700" stroke-width="3"/>
      <text x="50" y="58" font-size="22" font-weight="900" fill="#FFD700" text-anchor="middle" font-family="monospace">90%</text>
    </svg>`,
  },
  {
    id: 'beat-01',
    type: 'beat',
    title: '82 BPM Point Break Dub',
    category: 'Beats',
    bpm: 82,
    colorHex: '#00E5FF',
    projectType: 'Radio Beats',
    creativeSession: 'Night Dub',
    tags: ['#Dub', '#82BPM', '#Reggae', '#NightDub', '#RadioBeats'],
    description: 'Deep sub-bass, offbeat skank, and analog tape delay.',
  },
  {
    id: 'beat-02',
    type: 'beat',
    title: 'Sunset Coast Chillhop',
    category: 'Beats',
    bpm: 88,
    colorHex: '#F27D26',
    projectType: 'Radio Beats',
    creativeSession: 'Golden Hour',
    tags: ['#LoFi', '#88BPM', '#Sunset', '#GoldenHour', '#RadioBeats'],
    description: 'Mellow vinyl crackle, coastal synth chords, kick bounce.',
  },
  {
    id: 'beat-03',
    type: 'beat',
    title: 'AS65001 Mesh Cyber Grid',
    category: 'Beats',
    bpm: 95,
    colorHex: '#00FF88',
    projectType: 'Cyber Comic',
    creativeSession: 'Mesh Hack',
    tags: ['#Electro', '#95BPM', '#Mesh', '#MeshHack', '#CyberComic'],
    description: 'Driving 16-step synth bass with metallic hi-hat roll.',
  },
  {
    id: 'comic-01',
    type: 'comic',
    title: 'Pee Dub Point Break Sunset',
    category: 'Panels',
    colorHex: '#F27D26',
    projectType: 'Cyber Comic',
    creativeSession: 'Golden Hour',
    tags: ['#Comic', '#Sunset', '#Dialog', '#GoldenHour', '#CyberComic'],
    description: '4-panel story line: "Catching the 13th Solar Wave".',
  },
  {
    id: 'comic-02',
    type: 'comic',
    title: 'Frostbite Buddy Advice Callout',
    category: 'Panels',
    colorHex: '#00FF88',
    projectType: 'Surf Movie',
    creativeSession: 'Dawn Session',
    tags: ['#Frostbite', '#Callout', '#Stretches', '#DawnSession', '#SurfMovie'],
    description: 'Dialog box: "Stoke level high! Remember your 5-min hip opener."',
  }
];

const PROJECT_TYPES = [
  'ALL',
  'Surf Movie',
  'Cyber Comic',
  'Radio Beats',
  'Sovereign Badges',
];

const CREATIVE_SESSIONS = [
  'ALL',
  'Dawn Session',
  'Apex Hour',
  'Golden Hour',
  'Night Dub',
  'Mesh Hack',
];

export const QuickAssetDrawer: React.FC<QuickAssetDrawerProps> = ({
  onInsertAsset,
  onNavigateTab,
}) => {
  const [assets, setAssets] = useState<QuickAsset[]>(DEFAULT_ASSETS);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeTypeFilter, setActiveTypeFilter] = useState<'all' | 'vector' | 'beat' | 'comic'>('all');
  const [selectedProjectType, setSelectedProjectType] = useState<string>('ALL');
  const [selectedSession, setSelectedSession] = useState<string>('ALL');
  const [selectedTagFilter, setSelectedTagFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedAssetId, setCopiedAssetId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New Tag Form state per asset
  const [editingTagAssetId, setEditingTagAssetId] = useState<string | null>(null);
  const [newTagInput, setNewTagInput] = useState<string>('');

  // Add Custom Asset Modal State
  const [isCreatingAsset, setIsCreatingAsset] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newType, setNewType] = useState<QuickAsset['type']>('vector');
  const [newProjectType, setNewProjectType] = useState<NonNullable<QuickAsset['projectType']>>('Surf Movie');
  const [newSession, setNewSession] = useState<NonNullable<QuickAsset['creativeSession']>>('Dawn Session');
  const [newTagsStr, setNewTagsStr] = useState<string>('#PortWaikato, #CustomTag');
  const [newDesc, setNewDesc] = useState<string>('');

  // Extract unique popular tags across all assets
  const allPopularTags = Array.from(
    new Set(assets.flatMap((a) => a.tags))
  ).slice(0, 10);

  const filteredAssets = assets.filter((item) => {
    const matchesType = activeTypeFilter === 'all' || item.type === activeTypeFilter;
    const matchesProject = selectedProjectType === 'ALL' || item.projectType === selectedProjectType;
    const matchesSession = selectedSession === 'ALL' || item.creativeSession === selectedSession;
    const matchesTag = !selectedTagFilter || item.tags.some((t) => t.toLowerCase() === selectedTagFilter.toLowerCase());
    
    const matchesQuery =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.projectType && item.projectType.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.creativeSession && item.creativeSession.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesType && matchesProject && matchesSession && matchesTag && matchesQuery;
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleDragStart = (e: React.DragEvent, asset: QuickAsset) => {
    e.dataTransfer.setData('application/json', JSON.stringify(asset));
    e.dataTransfer.setData('text/plain', asset.title);
    e.dataTransfer.effectAllowed = 'copy';
    showToast(`Dragging "${asset.title}" — Drop into active Studio!`);
  };

  const handleCopySvg = (asset: QuickAsset) => {
    if (asset.svgData) {
      navigator.clipboard.writeText(asset.svgData);
      setCopiedAssetId(asset.id);
      showToast(`Copied SVG code for "${asset.title}"`);
      setTimeout(() => setCopiedAssetId(null), 2000);
    }
  };

  const handleInsert = (asset: QuickAsset) => {
    if (onInsertAsset) {
      onInsertAsset(asset);
    }
    if (asset.type === 'vector' && onNavigateTab) {
      onNavigateTab('vector');
    } else if (asset.type === 'beat' && onNavigateTab) {
      onNavigateTab('music');
    } else if (asset.type === 'comic' && onNavigateTab) {
      onNavigateTab('comic');
    }
    showToast(`Inserted "${asset.title}" into workspace!`);
  };

  // Add custom tag to an asset
  const handleAddTagToAsset = (assetId: string) => {
    if (!newTagInput.trim()) return;
    const formattedTag = newTagInput.startsWith('#') ? newTagInput.trim() : `#${newTagInput.trim()}`;

    setAssets((prev) =>
      prev.map((a) => {
        if (a.id === assetId) {
          if (a.tags.includes(formattedTag)) return a;
          return { ...a, tags: [...a.tags, formattedTag] };
        }
        return a;
      })
    );

    setNewTagInput('');
    setEditingTagAssetId(null);
    showToast(`Added tag "${formattedTag}" to asset!`);
  };

  // Create new Asset
  const handleCreateNewAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const parsedTags = newTagsStr
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
      .map((t) => (t.startsWith('#') ? t : `#${t}`));

    const created: QuickAsset = {
      id: `asset-${Date.now()}`,
      type: newType,
      title: newTitle.trim(),
      category: newType === 'vector' ? 'Stickers' : newType === 'beat' ? 'Beats' : 'Panels',
      projectType: newProjectType,
      creativeSession: newSession,
      tags: parsedTags.length > 0 ? parsedTags : ['#CustomSession'],
      description: newDesc.trim() || 'Custom creator asset saved to Quick Drawer.',
      colorHex: newType === 'vector' ? '#F27D26' : newType === 'beat' ? '#00FF88' : '#00E5FF',
      svgData:
        newType === 'vector'
          ? `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <rect width="100" height="100" fill="#050505" rx="16"/>
              <circle cx="50" cy="50" r="30" fill="none" stroke="#F27D26" stroke-width="4"/>
              <path d="M 30,50 L 70,50" stroke="#00E5FF" stroke-width="3"/>
            </svg>`
          : undefined,
    };

    setAssets((prev) => [created, ...prev]);
    setIsCreatingAsset(false);
    setNewTitle('');
    setNewDesc('');
    showToast(`Saved new asset "${created.title}" with custom tags!`);
  };

  // Play audio synthesize chime for beat preview
  const handlePlayBeatPreview = (asset: QuickAsset) => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      const playTone = (freq: number, time: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + time);
        gain.gain.setValueAtTime(0.3, ctx.currentTime + time);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + time + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + time);
        osc.stop(ctx.currentTime + time + duration);
      };

      playTone(130.81, 0, 0.25); // C3
      playTone(164.81, 0.2, 0.25); // E3
      playTone(196.00, 0.4, 0.35); // G3
      playTone(261.63, 0.6, 0.5); // C4

      showToast(`🔊 Playing preview for ${asset.title}`);
    } catch (err) {
      console.warn('Audio preview failed:', err);
    }
  };

  return (
    <>
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-20 right-6 z-50 bg-[#00E5FF] text-black font-mono font-black text-xs px-4 py-2 border-2 border-black shadow-xl animate-in slide-in-from-bottom-5 duration-200 flex items-center gap-2">
          <Zap className="w-4 h-4 fill-black" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Floating Side Drawer Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-28 right-0 z-40 bg-[#050505] border-l-2 border-y-2 border-[#00E5FF] hover:border-[#00FF88] text-[#00E5FF] hover:text-[#00FF88] font-mono font-black text-xs py-3 px-2 flex flex-col items-center gap-2 shadow-2xl transition-all cursor-pointer group hover:bg-[#0a1520]"
          title="Open Quick Asset Drawer (Drag-and-Drop Stickers & Beats)"
        >
          <FolderOpen className="w-5 h-5 text-[#00E5FF] group-hover:scale-110 transition-transform" />
          <span className="[writing-mode:vertical-lr] uppercase tracking-widest text-[10px]">
            QUICK ASSETS ({assets.length})
          </span>
          <ChevronLeft className="w-4 h-4 text-[#00FF88]" />
        </button>
      )}

      {/* Expanded Quick Asset Drawer */}
      {isOpen && (
        <div className="fixed top-16 right-0 bottom-0 z-40 w-80 sm:w-96 bg-[#050505] border-l-2 border-[#00E5FF] shadow-2xl font-mono text-[#e0e0e0] flex flex-col animate-in slide-in-from-right duration-200">
          
          {/* Drawer Header */}
          <div className="p-4 bg-[#0a1520] border-b border-[#00E5FF]/40 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <FolderOpen className="w-5 h-5 text-[#00E5FF]" />
              <div>
                <h3 className="font-black italic uppercase text-sm text-[#00E5FF] leading-none">
                  Quick Asset & Tag Vault
                </h3>
                <span className="text-[10px] text-[#888] uppercase">
                  Project & Session Tagging Active
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCreatingAsset(!isCreatingAsset)}
                className="px-2.5 py-1 bg-[#F27D26] hover:bg-[#ff8a38] text-black font-black uppercase text-[10px] flex items-center gap-1 transition-colors"
                title="Save & Tag New Asset"
              >
                <Plus className="w-3 h-3 text-black" />
                <span>Tag New</span>
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-[#aaa] hover:text-white bg-[#111] border border-[#333] hover:border-[#666] transition-colors"
                title="Close Drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Create & Tag New Asset Drawer */}
          {isCreatingAsset && (
            <form onSubmit={handleCreateNewAsset} className="p-3 bg-[#0c1a26] border-b-2 border-[#F27D26] space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-[10px] font-black uppercase text-[#F27D26]">
                <span className="flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-[#F27D26]" /> Create & Tag Asset
                </span>
                <button type="button" onClick={() => setIsCreatingAsset(false)} className="text-[#888] hover:text-white">
                  Cancel
                </button>
              </div>

              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Asset Title (e.g. 16-Step Bass Sticker)..."
                className="w-full bg-[#050505] border border-[#333] focus:border-[#F27D26] p-1.5 text-xs text-[#e0e0e0] focus:outline-none"
              />

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[9px] text-[#888] uppercase block">Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full bg-[#050505] border border-[#333] p-1 text-[10px] text-[#e0e0e0] uppercase focus:outline-none"
                  >
                    <option value="vector">Sticker</option>
                    <option value="beat">Beat</option>
                    <option value="comic">Panel</option>
                  </select>
                </div>

                <div>
                  <label className="text-[9px] text-[#888] uppercase block">Project Type</label>
                  <select
                    value={newProjectType}
                    onChange={(e) => setNewProjectType(e.target.value as any)}
                    className="w-full bg-[#050505] border border-[#333] p-1 text-[10px] text-[#e0e0e0] uppercase focus:outline-none"
                  >
                    {PROJECT_TYPES.filter((pt) => pt !== 'ALL').map((pt) => (
                      <option key={pt} value={pt}>{pt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[9px] text-[#888] uppercase block">Session</label>
                  <select
                    value={newSession}
                    onChange={(e) => setNewSession(e.target.value as any)}
                    className="w-full bg-[#050505] border border-[#333] p-1 text-[10px] text-[#e0e0e0] uppercase focus:outline-none"
                  >
                    {CREATIVE_SESSIONS.filter((cs) => cs !== 'ALL').map((cs) => (
                      <option key={cs} value={cs}>{cs}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[9px] text-[#888] uppercase block">Tags (comma separated)</label>
                <input
                  type="text"
                  value={newTagsStr}
                  onChange={(e) => setNewTagsStr(e.target.value)}
                  placeholder="#Tag1, #Tag2..."
                  className="w-full bg-[#050505] border border-[#333] focus:border-[#F27D26] p-1 text-xs text-[#00FF88] focus:outline-none font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-1.5 bg-[#F27D26] hover:bg-[#ff8a38] text-black font-black uppercase text-xs transition-colors"
              >
                Save & Tag Asset
              </button>
            </form>
          )}

          {/* Search & Comprehensive Tagging Filter Controls */}
          <div className="p-3 bg-[#111] border-b border-[#222] space-y-2.5 shrink-0">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#666] absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search stickers, beats, tags..."
                className="w-full bg-[#050505] border border-[#333] focus:border-[#00E5FF] text-xs text-[#e0e0e0] pl-8 pr-3 py-1.5 focus:outline-none"
              />
            </div>

            {/* Asset Type Filter Pills */}
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase overflow-x-auto pb-1">
              <button
                onClick={() => setActiveTypeFilter('all')}
                className={`px-2 py-0.5 border transition-all ${
                  activeTypeFilter === 'all'
                    ? 'bg-[#00E5FF] text-black border-[#00E5FF]'
                    : 'bg-[#050505] text-[#888] border-[#333] hover:border-[#666]'
                }`}
              >
                All ({assets.length})
              </button>
              <button
                onClick={() => setActiveTypeFilter('vector')}
                className={`px-2 py-0.5 border transition-all flex items-center gap-1 ${
                  activeTypeFilter === 'vector'
                    ? 'bg-[#F27D26] text-black border-[#F27D26]'
                    : 'bg-[#050505] text-[#888] border-[#333] hover:border-[#666]'
                }`}
              >
                <ImageIcon className="w-3 h-3" /> Stickers
              </button>
              <button
                onClick={() => setActiveTypeFilter('beat')}
                className={`px-2 py-0.5 border transition-all flex items-center gap-1 ${
                  activeTypeFilter === 'beat'
                    ? 'bg-[#00FF88] text-black border-[#00FF88]'
                    : 'bg-[#050505] text-[#888] border-[#333] hover:border-[#666]'
                }`}
              >
                <Music className="w-3 h-3" /> Beats
              </button>
              <button
                onClick={() => setActiveTypeFilter('comic')}
                className={`px-2 py-0.5 border transition-all flex items-center gap-1 ${
                  activeTypeFilter === 'comic'
                    ? 'bg-[#FFD700] text-black border-[#FFD700]'
                    : 'bg-[#050505] text-[#888] border-[#333] hover:border-[#666]'
                }`}
              >
                <MessageSquare className="w-3 h-3" /> Panels
              </button>
            </div>

            {/* Project Type Tag Filters */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[9px] font-bold uppercase text-[#888]">
                <span className="flex items-center gap-1">
                  <Film className="w-3 h-3 text-[#F27D26]" /> Project Type Filter:
                </span>
                {selectedProjectType !== 'ALL' && (
                  <button onClick={() => setSelectedProjectType('ALL')} className="text-[#00E5FF] hover:underline">
                    Reset
                  </button>
                )}
              </div>
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                {PROJECT_TYPES.map((pt) => (
                  <button
                    key={pt}
                    onClick={() => setSelectedProjectType(pt)}
                    className={`px-2 py-0.5 border text-[9px] font-bold uppercase shrink-0 transition-all ${
                      selectedProjectType === pt
                        ? 'bg-[#F27D26] text-black border-[#F27D26]'
                        : 'bg-[#050505] text-[#888] border-[#333] hover:text-[#e0e0e0]'
                    }`}
                  >
                    {pt === 'ALL' ? 'All Projects' : pt}
                  </button>
                ))}
              </div>
            </div>

            {/* Creative Session Tag Filters */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[9px] font-bold uppercase text-[#888]">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#00FF88]" /> Creative Session Filter:
                </span>
                {selectedSession !== 'ALL' && (
                  <button onClick={() => setSelectedSession('ALL')} className="text-[#00E5FF] hover:underline">
                    Reset
                  </button>
                )}
              </div>
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                {CREATIVE_SESSIONS.map((cs) => (
                  <button
                    key={cs}
                    onClick={() => setSelectedSession(cs)}
                    className={`px-2 py-0.5 border text-[9px] font-bold uppercase shrink-0 transition-all ${
                      selectedSession === cs
                        ? 'bg-[#00FF88] text-black border-[#00FF88]'
                        : 'bg-[#050505] text-[#888] border-[#333] hover:text-[#e0e0e0]'
                    }`}
                  >
                    {cs === 'ALL' ? 'All Sessions' : cs}
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Quick Tag Chips Bar */}
            <div className="pt-1 flex items-center gap-1 overflow-x-auto no-scrollbar">
              <span className="text-[9px] font-bold text-[#666] uppercase shrink-0 flex items-center gap-0.5">
                <Hash className="w-2.5 h-2.5" /> Tag:
              </span>
              {selectedTagFilter && (
                <button
                  onClick={() => setSelectedTagFilter(null)}
                  className="bg-[#00E5FF] text-black font-black text-[9px] px-1.5 py-0.2 shrink-0 uppercase"
                >
                  Clear {selectedTagFilter} ✕
                </button>
              )}
              {allPopularTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTagFilter(selectedTagFilter === tag ? null : tag)}
                  className={`text-[9px] font-mono px-1.5 py-0.2 border shrink-0 transition-colors ${
                    selectedTagFilter === tag
                      ? 'bg-[#00E5FF] text-black border-[#00E5FF] font-bold'
                      : 'bg-[#050505] text-[#777] border-[#222] hover:border-[#444] hover:text-[#e0e0e0]'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

          </div>

          {/* Asset Drag Instruction Banner */}
          <div className="bg-[#0a1520] border-b border-[#00E5FF]/20 px-4 py-2 text-[10px] text-[#00E5FF] flex items-center justify-between font-bold uppercase shrink-0">
            <span className="flex items-center gap-1">
              <GripVertical className="w-3.5 h-3.5 text-[#00E5FF]" /> Drag any item onto Studio
            </span>
            <span className="text-[#888] text-[9px]">Showing {filteredAssets.length} of {assets.length}</span>
          </div>

          {/* Scrollable Asset List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {filteredAssets.length === 0 ? (
              <div className="text-center py-10 space-y-2 text-[#666]">
                <Layers className="w-8 h-8 mx-auto text-[#444]" />
                <p className="text-xs uppercase font-bold">No tagged assets found</p>
                <p className="text-[10px] font-sans">Try resetting project, session or tag filters.</p>
                <button
                  onClick={() => {
                    setSelectedProjectType('ALL');
                    setSelectedSession('ALL');
                    setSelectedTagFilter(null);
                    setSearchQuery('');
                  }}
                  className="px-3 py-1 bg-[#111] border border-[#333] hover:border-[#00E5FF] text-[10px] text-[#00E5FF] uppercase font-mono mt-2"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              filteredAssets.map((asset) => (
                <div
                  key={asset.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, asset)}
                  className="bg-[#0a0a0a] border border-[#222] hover:border-[#00E5FF] p-3 space-y-2.5 transition-all group cursor-grab active:cursor-grabbing relative"
                >
                  {/* Top Bar with Icon & Title */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <GripVertical className="w-4 h-4 text-[#444] group-hover:text-[#00E5FF] transition-colors shrink-0" />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span
                            className="text-xs font-black uppercase"
                            style={{ color: asset.colorHex || '#00E5FF' }}
                          >
                            {asset.title}
                          </span>
                        </div>
                        <div className="text-[10px] text-[#888] uppercase flex items-center gap-1.5 flex-wrap pt-0.5">
                          <span>{asset.category}</span>
                          {asset.bpm && <span>• {asset.bpm} BPM</span>}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleInsert(asset)}
                      className="px-2 py-1 bg-[#111] hover:bg-[#00E5FF] hover:text-black border border-[#333] hover:border-[#00E5FF] text-[10px] font-bold uppercase transition-colors shrink-0 flex items-center gap-1"
                      title="Insert asset into workspace"
                    >
                      <Plus className="w-3 h-3" /> Insert
                    </button>
                  </div>

                  {/* Project Type & Creative Session Metadata Badges */}
                  <div className="flex items-center gap-1.5 flex-wrap text-[9px] font-bold uppercase">
                    {asset.projectType && (
                      <span className="bg-[#111] text-[#F27D26] border border-[#F27D26]/40 px-1.5 py-0.2">
                        📁 {asset.projectType}
                      </span>
                    )}
                    {asset.creativeSession && (
                      <span className="bg-[#111] text-[#00FF88] border border-[#00FF88]/40 px-1.5 py-0.2">
                        ⏱️ {asset.creativeSession}
                      </span>
                    )}
                  </div>

                  {/* SVG Vector Preview */}
                  {asset.type === 'vector' && asset.svgData && (
                    <div
                      className="w-full h-24 bg-[#050505] border border-[#222] flex items-center justify-center p-2 rounded"
                      dangerouslySetInnerHTML={{ __html: asset.svgData }}
                    />
                  )}

                  {/* Beat Rhythm Visual Bar */}
                  {asset.type === 'beat' && (
                    <div className="bg-[#111] border border-[#222] p-2 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {[0.8, 0.4, 1.0, 0.6, 0.9, 0.3, 0.7, 0.5, 1.0, 0.4].map((h, i) => (
                          <div
                            key={i}
                            className="w-1.5 bg-[#00FF88] rounded-full"
                            style={{ height: `${h * 18}px` }}
                          />
                        ))}
                      </div>

                      <button
                        onClick={() => handlePlayBeatPreview(asset)}
                        className="px-2 py-1 bg-[#00FF88] hover:bg-[#33ff99] text-black font-black text-[10px] uppercase flex items-center gap-1 transition-all"
                      >
                        <Play className="w-3 h-3 fill-black" /> Preview Tone
                      </button>
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-[11px] text-[#aaa] font-sans leading-tight">
                    {asset.description}
                  </p>

                  {/* Interactive Tags Row & Add Tag Action */}
                  <div className="space-y-1.5 pt-1 border-t border-[#1a1a1a]">
                    <div className="flex flex-wrap items-center gap-1">
                      {asset.tags.map((t, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedTagFilter(selectedTagFilter === t ? null : t)}
                          className={`text-[9px] font-mono px-1.5 py-0.2 border transition-colors ${
                            selectedTagFilter === t
                              ? 'bg-[#00E5FF] text-black border-[#00E5FF] font-bold'
                              : 'bg-[#111] text-[#00E5FF] border border-[#222] hover:border-[#00E5FF]'
                          }`}
                          title={`Filter by tag ${t}`}
                        >
                          {t}
                        </button>
                      ))}

                      {/* Add Tag Inline Control */}
                      {editingTagAssetId === asset.id ? (
                        <div className="flex items-center gap-1 mt-1 w-full">
                          <input
                            type="text"
                            value={newTagInput}
                            onChange={(e) => setNewTagInput(e.target.value)}
                            placeholder="#NewTag"
                            className="bg-[#050505] border border-[#F27D26] text-[10px] text-[#00FF88] px-1.5 py-0.5 focus:outline-none font-mono w-28"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleAddTagToAsset(asset.id);
                            }}
                          />
                          <button
                            onClick={() => handleAddTagToAsset(asset.id)}
                            className="bg-[#F27D26] text-black text-[9px] font-black px-2 py-0.5 uppercase"
                          >
                            Add
                          </button>
                          <button
                            onClick={() => setEditingTagAssetId(null)}
                            className="text-[#888] text-[9px] px-1"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setEditingTagAssetId(asset.id)}
                          className="bg-[#111] hover:bg-[#222] text-[#888] hover:text-[#e0e0e0] border border-[#333] text-[9px] font-mono px-1.5 py-0.2 flex items-center gap-0.5"
                          title="Add custom tag to this asset"
                        >
                          <Plus className="w-2.5 h-2.5" /> Tag
                        </button>
                      )}
                    </div>

                    {asset.type === 'vector' && asset.svgData && (
                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => handleCopySvg(asset)}
                          className="text-[9px] text-[#00E5FF] hover:underline flex items-center gap-1 uppercase font-bold"
                        >
                          {copiedAssetId === asset.id ? (
                            <CheckCircle2 className="w-3 h-3 text-[#00FF88]" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          <span>{copiedAssetId === asset.id ? 'Copied' : 'SVG Code'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Note */}
          <div className="p-3 bg-[#0a1520] border-t border-[#00E5FF]/30 text-[10px] text-[#aaa] font-sans flex items-center justify-between shrink-0">
            <span className="flex items-center gap-1 font-mono text-[#00E5FF]">
              <Sparkles className="w-3 h-3" /> Port Waikato Node Assets
            </span>
            <span className="font-mono text-[#888]">AS65001 Tag Vault</span>
          </div>

        </div>
      )}
    </>
  );
};

