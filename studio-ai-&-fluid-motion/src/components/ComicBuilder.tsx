import React, { useState } from 'react';
import { BookOpen, Sparkles, UserPlus, Flame, ShieldCheck, Coins, Check, MessageSquare, Share2, Camera, Clock, Volume2, Film } from 'lucide-react';
import { ComicPanel } from '../types';
import { ProjectTimeline, VersionItem } from './ProjectTimeline';

interface ComicBuilderProps {
  onEarnHarmony: (amount: number, desc: string) => void;
  onNavigateTab?: (tab: string) => void;
}

interface ComicSnapshot {
  comicTitle: string;
  themeInput: string;
  panels: ComicPanel[];
}

export const ComicBuilder: React.FC<ComicBuilderProps> = ({ onEarnHarmony, onNavigateTab }) => {
  const [comicTitle, setComicTitle] = useState('Tales from Pee Dub Point Break');
  const [themeInput, setThemeInput] = useState('First time catching the Port Waikato point break barrel');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isStagedForApex, setIsStagedForApex] = useState(false);
  const [isSharedToStream, setIsSharedToStream] = useState(false);

  const initialPanels: ComicPanel[] = [
    {
      id: 'p-1',
      panelIndex: 1,
      sceneDescription: 'Sun rising over Port Waikato sand dunes with mist',
      dialogue: 'Check that swell! Pure glass out there today!',
      speaker: 'Kai',
      jewelTag: '@Kai_Shredder',
      durationSec: 3,
      cameraMotion: 'Pan Right',
      soundCue: 'Ocean waves, seagull'
    },
    {
      id: 'p-2',
      panelIndex: 2,
      sceneDescription: 'Paddling out into the lineup past the black sand point',
      dialogue: 'Paddle hard! Here comes the set of the morning!',
      speaker: 'Aroha',
      jewelTag: '@Aroha_Beats',
      durationSec: 2,
      cameraMotion: 'Zoom In',
      soundCue: 'Paddling splashes'
    },
    {
      id: 'p-3',
      panelIndex: 3,
      sceneDescription: 'Dropping into a deep turquoise barrel with golden light',
      dialogue: 'Yewww! What a gnarly barrel ride!',
      speaker: 'Tane',
      jewelTag: '@Tane_Vector',
      durationSec: 4,
      cameraMotion: 'Slow Motion',
      soundCue: 'Heavy surf rumble'
    },
    {
      id: 'p-4',
      panelIndex: 4,
      sceneDescription: 'High-fiving on the beach near campground fire',
      dialogue: "Let's turn this ride into a beat and a comic panel!",
      speaker: 'Crew',
      jewelTag: '@Campground_Crew',
      durationSec: 3,
      cameraMotion: 'Static',
      soundCue: 'Campfire crackling'
    }
  ];

  const [panels, setPanels] = useState<ComicPanel[]>(initialPanels);

  // Version Timeline State
  const [versions, setVersions] = useState<VersionItem<ComicSnapshot>[]>([
    {
      id: 'ver-1',
      versionNumber: 1,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      label: 'Initial Storyboard Draft',
      details: '4-panel Port Waikato surf adventure intro',
      snapshot: {
        comicTitle: 'Tales from Pee Dub Point Break',
        themeInput: 'First time catching the Port Waikato point break barrel',
        panels: initialPanels,
      },
    },
  ]);
  const [currentVersionId, setCurrentVersionId] = useState<string>('ver-1');

  const handleSaveVersion = (label: string) => {
    const newVerId = `ver-${Date.now()}`;
    const newVerNum = versions.length + 1;
    const newVersion: VersionItem<ComicSnapshot> = {
      id: newVerId,
      versionNumber: newVerNum,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      label: label || `Comic Version ${newVerNum}`,
      details: `Title: "${comicTitle}" • ${panels.length} Panels`,
      snapshot: {
        comicTitle,
        themeInput,
        panels: JSON.parse(JSON.stringify(panels)),
      },
    };

    setVersions((prev) => [...prev, newVersion]);
    setCurrentVersionId(newVerId);
  };

  const handleRevertVersion = (ver: VersionItem<ComicSnapshot>) => {
    setComicTitle(ver.snapshot.comicTitle);
    setThemeInput(ver.snapshot.themeInput);
    setPanels(JSON.parse(JSON.stringify(ver.snapshot.panels)));
    setCurrentVersionId(ver.id);
  };

  const handleGenerateStory = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/comic-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: themeInput, panelCount: 4 })
      });

      const data = await res.json();
      let newTitle = comicTitle;
      if (data.storyTitle) {
        setComicTitle(data.storyTitle);
        newTitle = data.storyTitle;
      }
      let newPanels = panels;
      if (data.panels && Array.isArray(data.panels)) {
        newPanels = data.panels.map((p: any, idx: number) => ({
          id: `p-${Date.now()}-${idx}`,
          panelIndex: idx + 1,
          sceneDescription: p.sceneDescription || 'Coastal scene',
          dialogue: p.dialogue || 'Awesome wave!',
          speaker: p.speaker || 'Surfer',
          jewelTag: p.jewelTagSuggestion || '@PeeDub_Crew',
          durationSec: 3,
          cameraMotion: 'Static',
          soundCue: 'Ambient sound'
        }));
        setPanels(newPanels);
      }

      // Auto-save a version snapshot when AI story arc generated
      const autoVerId = `ver-${Date.now()}`;
      const autoVerNum = versions.length + 1;
      const autoVer: VersionItem<ComicSnapshot> = {
        id: autoVerId,
        versionNumber: autoVerNum,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        label: `AI Storyboard: ${newTitle.slice(0, 24)}...`,
        details: `Generated from theme: "${themeInput.slice(0, 30)}..."`,
        snapshot: {
          comicTitle: newTitle,
          themeInput,
          panels: newPanels,
        },
      };
      setVersions((prev) => [...prev, autoVer]);
      setCurrentVersionId(autoVerId);
    } catch (err) {
      console.error('Comic assistant error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const updatePanelDialogue = (idx: number, newDialogue: string) => {
    setPanels((prev) => {
      const updated = [...prev];

      let clean = newDialogue;
      let wasFiltered = false;
      const badWordsMap: Record<string, string> = {
        fuck: 'wipeout',
        shit: 'bogus-wave',
        bitch: 'barney',
        ass: 'fin-chop',
        damn: 'dang-set'
      };

      Object.keys(badWordsMap).forEach((word) => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        if (regex.test(clean)) {
          clean = clean.replace(regex, badWordsMap[word]);
          wasFiltered = true;
        }
      });

      updated[idx] = {
        ...updated[idx],
        dialogue: clean,
        isPGFiltered: wasFiltered
      };
      return updated;
    });
  };

  const updatePanelField = (idx: number, field: keyof ComicPanel, value: string | number) => {
    setPanels((prev) => {
      const updated = [...prev];
      updated[idx] = {
        ...updated[idx],
        [field]: value
      };
      return updated;
    });
  };

  const handleStageForApex = () => {
    if (!isStagedForApex) {
      setIsStagedForApex(true);
      onEarnHarmony(150, `Staged Comic "${comicTitle}" for Apex Wedge Premiere`);
    }
  };

  const handleShareToStream = () => {
    setIsSharedToStream(true);
    onEarnHarmony(50, `Shared Comic Strip "${comicTitle}" to Port Waikato Node Stream`);
  };

  return (
    <div className="space-y-6 text-[#e0e0e0]">
      {/* Module Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111] border-l-4 border-[#00E5FF] border-y border-r border-[#333] p-5">
        <div>
          <h2 className="text-xl font-black italic uppercase tracking-tight text-[#e0e0e0] flex items-center gap-2">
            <Film className="w-6 h-6 text-[#00E5FF]" />
            Storyboard & Video Gen Prep
          </h2>
          <p className="text-xs font-mono opacity-60 uppercase tracking-wider mt-1">
            COMPILE 4-PANEL COMICS INTO BROADCAST-READY MICRO MOVIE STORYBOARDS.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#050505] border border-[#333] px-3.5 py-2 text-xs font-mono font-bold text-[#00FF88] uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-[#00FF88]" />
          <span>PG Surf Filter Active</span>
        </div>
      </div>

      {/* Comic Storyboard Assistant Prompt Input */}
      <div className="bg-[#111] border border-[#333] p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1">
            <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-[#aaa] mb-1.5">
              Comic Story Concept / Theme
            </label>
            <input
              type="text"
              value={themeInput}
              onChange={(e) => setThemeInput(e.target.value)}
              placeholder="e.g. Night fishing at the river mouth with campfire tunes..."
              className="w-full bg-[#050505] border border-[#333] p-3 text-sm font-mono text-[#e0e0e0] placeholder-[#555] focus:outline-none focus:border-[#F27D26] transition-colors"
            />
          </div>

          <button
            onClick={handleGenerateStory}
            disabled={isGenerating}
            className="px-6 py-3 bg-[#F27D26] hover:bg-[#ff8a38] text-black font-black italic uppercase tracking-wider text-xs transition-all shadow-md flex items-center justify-center gap-2 shrink-0 self-end sm:self-auto"
          >
            <Sparkles className="w-4 h-4 text-black" />
            <span>{isGenerating ? 'Drafting Storyboard...' : 'Generate AI Story Arc'}</span>
          </button>
        </div>
      </div>

      {/* Visual Project Version Timeline */}
      <ProjectTimeline
        versions={versions}
        currentVersionId={currentVersionId}
        onSaveVersion={handleSaveVersion}
        onRevertVersion={handleRevertVersion}
        title="Comic Strip Version History & Timeline"
      />

      {/* 4-Panel Comic Grid Canvas */}
      <div className="bg-[#111] border border-[#333] p-5 space-y-5">
        <div className="flex items-center justify-between border-b border-[#333] pb-3">
          <input
            type="text"
            value={comicTitle}
            onChange={(e) => setComicTitle(e.target.value)}
            className="text-lg font-black italic uppercase tracking-wider bg-transparent text-[#e0e0e0] border-b border-[#444] focus:outline-none focus:border-[#F27D26] pb-1 font-mono"
          />
          <span className="text-xs text-[#888] font-mono uppercase font-bold">4-Panel Strip</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {panels.map((panel, idx) => (
            <div
              key={panel.id}
              className="bg-[#050505] border-2 border-[#333] p-4 flex flex-col justify-between space-y-3 relative group hover:border-[#00E5FF] transition-all"
            >
              {/* Panel Header */}
              <div className="flex items-center justify-between text-xs font-mono text-[#888]">
                <span className="font-bold text-[#00E5FF] bg-[#111] px-2 py-0.5 border border-[#333] uppercase">
                  Panel #{panel.panelIndex}
                </span>
                <span className="flex items-center gap-1 text-[#FFD700] font-bold uppercase">
                  <UserPlus className="w-3.5 h-3.5" />
                  Jewel Slot: <strong className="text-[#e0e0e0]">{panel.jewelTag}</strong>
                </span>
              </div>

              {/* Scene Illustration Box */}
              <div className="w-full h-40 bg-[#111] border border-[#333] flex flex-col items-center justify-center p-3 text-center relative overflow-hidden">
                <p className="text-xs font-mono text-[#aaa] italic max-w-xs">{panel.sceneDescription}</p>

                {/* Speech Bubble Overlay */}
                <div className="mt-3 bg-[#e0e0e0] text-black p-2.5 font-bold text-xs max-w-xs border-2 border-black relative">
                  <div className="text-[10px] text-[#F27D26] font-mono font-black uppercase mb-0.5">
                    {panel.speaker} says:
                  </div>
                  "{panel.dialogue}"
                  {panel.isPGFiltered && (
                    <span className="block text-[9px] text-[#00FF88] font-mono font-black uppercase mt-1">
                      ✨ Surf Slang Filtered
                    </span>
                  )}
                </div>
              </div>

              {/* Panel Controls */}
              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-[#aaa] mb-1.5">
                    Dialogue:
                  </label>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[#666] shrink-0" />
                    <input
                      type="text"
                      value={panel.dialogue}
                      onChange={(e) => updatePanelDialogue(idx, e.target.value)}
                      className="flex-1 bg-[#111] border border-[#333] p-2 text-xs font-mono text-[#e0e0e0] placeholder-[#555] focus:outline-none focus:border-[#F27D26]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-[#aaa] mb-1.5">
                      Camera Motion
                    </label>
                    <div className="flex items-center gap-2">
                      <Camera className="w-3.5 h-3.5 text-[#00E5FF] shrink-0" />
                      <select
                        value={panel.cameraMotion || 'Static'}
                        onChange={(e) => updatePanelField(idx, 'cameraMotion', e.target.value)}
                        className="flex-1 bg-[#111] border border-[#333] p-1.5 text-xs font-mono text-[#e0e0e0] focus:outline-none focus:border-[#00E5FF] appearance-none"
                      >
                        <option value="Static">Static</option>
                        <option value="Pan Right">Pan Right</option>
                        <option value="Pan Left">Pan Left</option>
                        <option value="Zoom In">Zoom In</option>
                        <option value="Zoom Out">Zoom Out</option>
                        <option value="Slow Motion">Slow Motion</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-[#aaa] mb-1.5">
                      Duration (Sec)
                    </label>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#00FF88] shrink-0" />
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={panel.durationSec || 3}
                        onChange={(e) => updatePanelField(idx, 'durationSec', parseInt(e.target.value) || 3)}
                        className="flex-1 bg-[#111] border border-[#333] p-1.5 text-xs font-mono text-[#e0e0e0] focus:outline-none focus:border-[#00FF88]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-[#aaa] mb-1.5">
                    Audio / Sound Cue
                  </label>
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-3.5 h-3.5 text-[#F27D26] shrink-0" />
                    <input
                      type="text"
                      value={panel.soundCue || ''}
                      onChange={(e) => updatePanelField(idx, 'soundCue', e.target.value)}
                      placeholder="e.g. Ocean waves..."
                      className="flex-1 bg-[#111] border border-[#333] p-1.5 text-xs font-mono text-[#e0e0e0] placeholder-[#555] focus:outline-none focus:border-[#F27D26]"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stage for Apex Wedge Premiere & Stream Share Buttons */}
        <div className="pt-4 border-t border-[#333] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs font-mono text-[#888] uppercase">
            COMPILE STORYBOARD TO MICRO MOVIE OR QUEUE FOR APEX PREMIERE.
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                onEarnHarmony(100, `Compiled Storyboard "${comicTitle}" into Video Generator`);
                if (onNavigateTab) onNavigateTab('movie');
              }}
              className="px-4 py-3 text-xs font-black italic uppercase tracking-wider transition-all border flex items-center gap-2 bg-[#00E5FF] hover:bg-[#33ebff] text-black border-[#00E5FF]"
            >
              <Film className="w-4 h-4" />
              <span>Send to Video Compiler (+100)</span>
            </button>

            <button
              onClick={handleStageForApex}
              disabled={isStagedForApex}
              className={`px-5 py-3 text-xs font-black italic uppercase tracking-wider transition-all border flex items-center gap-2 ${
                isStagedForApex
                  ? 'bg-[#00FF88] text-black border-[#00FF88]'
                  : 'bg-[#111] hover:bg-[#222] text-[#e0e0e0] border-[#333]'
              }`}
            >
              {isStagedForApex ? (
                <>
                  <Check className="w-4 h-4 text-black" />
                  <span>Staged for Apex (+150)</span>
                </>
              ) : (
                <>
                  <Flame className="w-4 h-4 text-[#F27D26]" />
                  <span>Stage for Apex Premiere (+150)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

