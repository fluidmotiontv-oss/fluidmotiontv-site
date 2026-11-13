import React, { useState } from 'react';
import { Camera, Eye, Waves, Sparkles, Check, Coins, MapPin, Compass, ShieldCheck } from 'lucide-react';
import { BeachQuest } from '../types';

interface ARBeachOverlayProps {
  onEarnHarmony: (amount: number, desc: string) => void;
}

export const ARBeachOverlay: React.FC<ARBeachOverlayProps> = ({ onEarnHarmony }) => {
  const [opacity20, setOpacity20] = useState(true);
  const [selectedOverlay, setSelectedOverlay] = useState<'wave' | 'vector' | 'tide' | 'sunset'>('wave');

  const [quests, setQuests] = useState<BeachQuest[]>([
    {
      id: 'q-1',
      title: 'Morning Pee Dub Glassy Session',
      description: 'Capture or log a morning surf session at the Port Waikato point break before D9-H06.',
      category: 'Surf',
      rewardHarmony: 150,
      rewardShavings: 10,
      completed: false,
      location: 'Pee Dub Point Break'
    },
    {
      id: 'q-2',
      title: 'Sunset Reef Vector Capture',
      description: 'Create and export a vector sticker featuring the sunset over the black sand dunes.',
      category: 'Vector',
      rewardHarmony: 200,
      rewardShavings: 15,
      completed: false,
      location: 'Sunset Sand Dunes'
    },
    {
      id: 'q-3',
      title: 'Campground Beat Drop',
      description: 'Synthesize an 82 BPM Dub beat and queue it on the 24/7 Port Waikato Radio.',
      category: 'Beat',
      rewardHarmony: 180,
      rewardShavings: 12,
      completed: true,
      location: 'Port Waikato Campground'
    },
    {
      id: 'q-4',
      title: 'Eco Beach Clean & Shred',
      description: 'Participate in the community beach clean-up and share a photo with the 20% AR watermark.',
      category: 'Eco',
      rewardHarmony: 250,
      rewardShavings: 25,
      completed: false,
      location: 'Port Waikato Beach Line'
    }
  ]);

  const handleCompleteQuest = (questId: string) => {
    setQuests((prev) =>
      prev.map((q) => {
        if (q.id === questId && !q.completed) {
          onEarnHarmony(q.rewardHarmony, `Completed Coastal Quest: "${q.title}"`);
          return { ...q, completed: true };
        }
        return q;
      })
    );
  };

  return (
    <div className="space-y-6 text-[#e0e0e0]">
      {/* Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111] border-l-4 border-[#F27D26] border-y border-r border-[#333] p-5">
        <div>
          <h2 className="text-xl font-black italic uppercase tracking-tight text-[#e0e0e0] flex items-center gap-2">
            <Camera className="w-6 h-6 text-[#F27D26]" />
            AR Beach Overlay Protocol & Coastal Quests
          </h2>
          <p className="text-xs font-mono opacity-60 uppercase tracking-wider mt-1">
            20% OPACITY BEACH OVERLAYS FOR SURF PHOTOS, LIVE WAVE METRICS, AND OUTDOOR QUESTS.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#050505] border border-[#333] px-3.5 py-2 text-xs font-mono font-bold text-[#00E5FF] uppercase tracking-wider">
          <MapPin className="w-4 h-4 text-[#00E5FF]" />
          <span>Node: <strong>Port Waikato (Pee Dub)</strong></span>
        </div>
      </div>

      {/* AR Lens Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Lens Controls */}
        <div className="lg:col-span-5 bg-[#111] border border-[#333] p-5 space-y-5">
          <h3 className="font-black italic uppercase text-sm text-[#e0e0e0] flex items-center gap-2 tracking-wider">
            <Eye className="w-4 h-4 text-[#00E5FF]" />
            Community AR Overlay Selector
          </h3>

          <div className="space-y-2">
            <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-[#aaa]">
              Select Beach Overlay Type
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: 'wave', label: 'Wave Metrics', desc: 'Swell height & wind speed' },
                { id: 'vector', label: 'Vector Sticker', desc: 'Pee Dub barrel sticker' },
                { id: 'tide', label: 'Tide & Sun Chart', desc: 'Solar D9 clock readout' },
                { id: 'sunset', label: 'Twilight Filter', desc: 'Warm coastal gradient' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedOverlay(item.id as any)}
                  className={`p-3 border text-left text-xs font-mono transition-all ${
                    selectedOverlay === item.id
                      ? 'bg-[#F27D26] text-black border-[#F27D26]'
                      : 'bg-[#050505] border-[#333] text-[#aaa] hover:text-[#e0e0e0]'
                  }`}
                >
                  <div className="font-bold uppercase mb-0.5">{item.label}</div>
                  <div className="text-[10px] opacity-70">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Opacity Protocol Toggle */}
          <div className="bg-[#050505] p-4 border border-[#333] space-y-2 font-mono">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#e0e0e0] uppercase">20% Opacity Lock</span>
              <button
                type="button"
                onClick={() => setOpacity20(!opacity20)}
                className={`px-3 py-1 text-[10px] font-black uppercase border ${
                  opacity20 ? 'bg-[#00FF88] text-black border-[#00FF88]' : 'bg-[#222] text-[#888] border-[#333]'
                }`}
              >
                {opacity20 ? 'ACTIVE' : 'OFF'}
              </button>
            </div>
            <p className="text-[10px] text-[#888] uppercase">
              PROTOCOL: OVERLAYS DEFAULT TO 20% OPACITY TO KEEP NATURE FOOTAGE CLEAN AND UNCLUTTERED.
            </p>
          </div>
        </div>

        {/* Right Column: Live AR Lens Camera Frame */}
        <div className="lg:col-span-7 bg-[#111] border border-[#333] p-5 flex flex-col items-center justify-center">
          <div className="w-full max-w-md aspect-[9/16] bg-[#050505] border-2 border-[#333] relative overflow-hidden flex flex-col justify-between p-5">
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a192f] via-[#050505] to-[#2a1200] opacity-90" />

            {/* Top AR Overlay Header */}
            <div className="relative z-10 flex items-center justify-between text-xs text-[#e0e0e0] font-mono">
              <span className="bg-[#111] px-3 py-1 border border-[#333] text-[10px] font-bold flex items-center gap-1.5 uppercase">
                <Compass className="w-3.5 h-3.5 text-[#00E5FF]" />
                Pee Dub Node • 37.37° S
              </span>
              <span className="bg-[#00FF88] text-black font-bold border border-[#00FF88] px-2.5 py-0.5 text-[10px] uppercase">
                20% Opacity Active
              </span>
            </div>

            {/* Center AR Graphics Layer */}
            <div className={`relative z-10 transition-opacity ${opacity20 ? 'opacity-20' : 'opacity-100'}`}>
              {selectedOverlay === 'wave' && (
                <div className="bg-[#111] border-2 border-[#00E5FF] p-4 text-center space-y-1">
                  <div className="text-3xl font-black text-[#00E5FF] font-mono">2.4m @ 14s</div>
                  <div className="text-xs text-[#e0e0e0] font-mono font-bold uppercase tracking-wider">
                    Clean Offshore Wind • Port Waikato Point
                  </div>
                </div>
              )}

              {selectedOverlay === 'vector' && (
                <div className="text-center space-y-2">
                  <div className="w-32 h-32 mx-auto border-4 border-[#FFD700] bg-[#111] flex items-center justify-center font-black text-[#FFD700] text-lg font-mono">
                    🌊 PEE DUB
                  </div>
                  <div className="text-xs font-mono font-bold text-[#FFD700] bg-[#050505] px-3 py-1 border border-[#FFD700] inline-block uppercase">
                    Sovereign Vector Watermark
                  </div>
                </div>
              )}

              {selectedOverlay === 'tide' && (
                <div className="bg-[#111] p-4 border border-[#333] space-y-2 text-xs font-mono">
                  <div className="flex justify-between font-bold text-[#00E5FF] uppercase">
                    <span>High Tide: 02:14 PM</span>
                    <span>Low Tide: 08:30 PM</span>
                  </div>
                  <div className="w-full bg-[#050505] h-2 border border-[#333] overflow-hidden">
                    <div className="bg-[#00E5FF] h-full w-2/3" />
                  </div>
                </div>
              )}

              {selectedOverlay === 'sunset' && (
                <div className="p-4 bg-[#F27D26] text-black border border-[#F27D26] text-center font-black italic uppercase text-sm font-mono">
                  🌅 Twilight Coastal Glow
                </div>
              )}
            </div>

            {/* Bottom AR Overlay Footer */}
            <div className="relative z-10 flex items-center justify-between text-xs text-[#e0e0e0] bg-[#111] p-3 border border-[#333] font-mono">
              <div>
                <div className="font-bold uppercase">Port Waikato AR Lens</div>
                <div className="text-[10px] text-[#888] uppercase">D9 Protocol • Coastal Node</div>
              </div>
              <Sparkles className="w-4 h-4 text-[#00E5FF]" />
            </div>
          </div>
        </div>
      </div>

      {/* Coastal Quest Log */}
      <div className="bg-[#111] border border-[#333] p-5 space-y-4">
        <div>
          <h3 className="font-black italic text-sm text-[#e0e0e0] uppercase flex items-center gap-2 tracking-wider">
            <Compass className="w-4 h-4 text-[#FFD700]" />
            Coastal Quest Log & Harmony Rewards
          </h3>
          <p className="text-xs font-mono opacity-60 uppercase tracking-wider">
            COMPLETE LOCAL QUESTS AROUND PORT WAIKATO TO EARN HARMONY NOTES & SHAVINGS.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quests.map((q) => (
            <div
              key={q.id}
              className={`p-4 border flex flex-col justify-between space-y-3 transition-all ${
                q.completed
                  ? 'bg-[#050505] border-[#00FF88]'
                  : 'bg-[#050505] border-[#333] hover:border-[#F27D26]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-1">
                  <span className="font-bold text-[#00E5FF] text-[10px] bg-[#111] px-2 py-0.5 border border-[#333] uppercase">
                    {q.category} Quest
                  </span>
                  <span className="text-[#888] text-[11px] flex items-center gap-1 uppercase">
                    <MapPin className="w-3 h-3 text-[#666]" />
                    {q.location}
                  </span>
                </div>
                <h4 className="font-bold text-[#e0e0e0] text-sm uppercase">{q.title}</h4>
                <p className="text-xs font-mono text-[#aaa] mt-1">{q.description}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#222] text-xs font-mono">
                <div className="flex items-center gap-2 text-[#FFD700] font-bold">
                  <Coins className="w-3.5 h-3.5" />
                  <span>+{q.rewardHarmony} Harmony</span>
                  <span className="text-[#888] font-normal">({q.rewardShavings} Shavings)</span>
                </div>

                <button
                  onClick={() => handleCompleteQuest(q.id)}
                  disabled={q.completed}
                  className={`px-3 py-1.5 font-bold uppercase transition-all flex items-center gap-1 border text-xs ${
                    q.completed
                      ? 'bg-[#00FF88] text-black border-[#00FF88]'
                      : 'bg-[#00E5FF] hover:bg-[#33ebff] text-black border-[#00E5FF]'
                  }`}
                >
                  {q.completed ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-black" />
                      <span>Completed</span>
                    </>
                  ) : (
                    <span>Claim Quest Reward</span>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

