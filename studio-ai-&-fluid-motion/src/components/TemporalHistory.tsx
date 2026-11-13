import React, { useState } from 'react';
import {
  History,
  Sparkles,
  Clock,
  Zap,
  CheckCircle2,
  Filter,
  Plus,
  Flame,
  Star,
  Search,
  Share2,
  Calendar,
  ChevronRight,
  TrendingUp,
  Coins,
  ShieldCheck,
  Award
} from 'lucide-react';
import { D9ClockState } from '../types';
import { formatD9Time } from '../lib/dragon9Clock';

export interface TemporalEvent {
  id: string;
  title: string;
  category: 'APEX_WEDGE' | 'MILESTONE' | 'CREATIVE_DROP' | 'SOVEREIGN_SPLIT' | 'QUEST_COMPLETED';
  d9Hour: number;
  solarTimeStr: string;
  timestamp: string;
  description: string;
  harmonyAmount?: number;
  apexType?: 'Midday' | 'Midnight' | '13th Transition' | null;
  isStarred?: boolean;
  tags: string[];
}

interface TemporalHistoryProps {
  d9State: D9ClockState;
  onEarnHarmony?: (amount: number, description: string) => void;
  onNavigateTab?: (tab: string) => void;
}

const INITIAL_TEMPORAL_EVENTS: TemporalEvent[] = [
  {
    id: 'evt-01',
    title: 'Midday Apex Wedge Reached',
    category: 'APEX_WEDGE',
    d9Hour: 13,
    solarTimeStr: 'Hour 13:00 • Midday Apex Wedge',
    timestamp: '2026-08-02 12:00 PM Solar',
    description: 'Entered the 18-minute Midday Apex Wedge. High solar energy state unlocked +25 Harmony Notes bonus.',
    harmonyAmount: 25,
    apexType: 'Midday',
    isStarred: true,
    tags: ['#ApexWedge', '#Midday', '#SolarPeak'],
  },
  {
    id: 'evt-02',
    title: 'Port Waikato Vector Badge Export',
    category: 'CREATIVE_DROP',
    d9Hour: 8,
    solarTimeStr: 'Hour 08:34',
    timestamp: '2026-08-02 08:34 AM Solar',
    description: 'Exported 1:1 SVG Vector Sticker "Sunset Surfboard Shield" to AS65001 Mesh Node feed.',
    harmonyAmount: 15,
    apexType: null,
    isStarred: false,
    tags: ['#VectorStudio', '#SVG', '#SovereignBadge'],
  },
  {
    id: 'evt-03',
    title: '82 BPM Dub Track Submitted to Radio',
    category: 'CREATIVE_DROP',
    d9Hour: 18,
    solarTimeStr: 'Hour 18:12',
    timestamp: '2026-08-01 06:12 PM Solar',
    description: '16-step dub sequencer beat with analog tape delay broadcasted live across Port Waikato Node.',
    harmonyAmount: 20,
    apexType: null,
    isStarred: true,
    tags: ['#RadioVault', '#DubBeat', '#82BPM'],
  },
  {
    id: 'evt-04',
    title: 'Midnight Apex Wedge Transition',
    category: 'APEX_WEDGE',
    d9Hour: 26,
    solarTimeStr: 'Hour 26:00 • Midnight Apex Wedge',
    timestamp: '2026-08-01 12:00 AM Solar',
    description: 'Completed full 1,440-minute D9 Solar Cycle. 90% Sovereign creator split disbursed.',
    harmonyAmount: 50,
    apexType: 'Midnight',
    isStarred: true,
    tags: ['#ApexMidnight', '#D9Cycle', '#SovereignSplit'],
  },
  {
    id: 'evt-05',
    title: 'Surf XA-Stretch & Hydration Quest',
    category: 'QUEST_COMPLETED',
    d9Hour: 5,
    solarTimeStr: 'Hour 05:15',
    timestamp: '2026-08-01 05:15 AM Solar',
    description: 'Completed 60s Pop-Up Hip Flexor Unshackler with Frostbite AI Buddy.',
    harmonyAmount: 10,
    apexType: null,
    isStarred: false,
    tags: ['#Frostbite', '#XAStretch', '#PreSurf'],
  }
];

export const TemporalHistory: React.FC<TemporalHistoryProps> = ({
  d9State,
  onEarnHarmony,
  onNavigateTab,
}) => {
  const [events, setEvents] = useState<TemporalEvent[]>(INITIAL_TEMPORAL_EVENTS);
  const [filterCategory, setFilterCategory] = useState<'ALL' | 'APEX_WEDGE' | 'MILESTONE' | 'CREATIVE_DROP' | 'SOVEREIGN_SPLIT' | 'QUEST_COMPLETED'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddingEvent, setIsAddingEvent] = useState<boolean>(false);

  // Form State
  const [newTitle, setNewTitle] = useState<string>('');
  const [newCategory, setNewCategory] = useState<TemporalEvent['category']>('MILESTONE');
  const [newDesc, setNewDesc] = useState<string>('');
  const [newHarmony, setNewHarmony] = useState<number>(10);

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newEvt: TemporalEvent = {
      id: `evt-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      d9Hour: d9State.d9Hour,
      solarTimeStr: formatD9Time(d9State),
      timestamp: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      description: newDesc.trim() || 'Custom creator milestone recorded in Dragon 9 ledger.',
      harmonyAmount: newHarmony,
      apexType: d9State.isApexWedge ? d9State.apexType : null,
      isStarred: false,
      tags: [`#Hour${d9State.d9Hour}`, `#${newCategory}`],
    };

    setEvents((prev) => [newEvt, ...prev]);
    if (onEarnHarmony && newHarmony > 0) {
      onEarnHarmony(newHarmony, `Logged Apex Milestone: ${newTitle.trim()}`);
    }

    setNewTitle('');
    setNewDesc('');
    setIsAddingEvent(false);
  };

  const toggleStar = (id: string) => {
    setEvents((prev) =>
      prev.map((evt) => (evt.id === id ? { ...evt, isStarred: !evt.isStarred } : evt))
    );
  };

  const filteredEvents = events.filter((evt) => {
    const matchesCat = filterCategory === 'ALL' || evt.category === filterCategory;
    const matchesSearch =
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      evt.solarTimeStr.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const totalApexCount = events.filter((e) => e.category === 'APEX_WEDGE' || e.apexType).length;
  const totalHarmonyLogged = events.reduce((acc, curr) => acc + (curr.harmonyAmount || 0), 0);

  return (
    <div className="bg-[#050505] border-2 border-[#F27D26] p-4 sm:p-6 space-y-6 text-[#e0e0e0] font-mono shadow-2xl">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#333] pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <History className="w-6 h-6 text-[#F27D26]" />
            <h2 className="text-lg font-black italic uppercase text-[#F27D26] tracking-wider">
              Dragon 9 Temporal History & Apex Ledger
            </h2>
            <span className="bg-[#111] text-[#00FF88] border border-[#00FF88]/40 px-2 py-0.5 text-[10px] font-bold uppercase">
              1,440-Min Cycle
            </span>
          </div>
          <p className="text-xs text-[#aaa] font-sans mt-1">
            Historical record of your 26-hour solar breakthroughs, Apex Wedges, and creator milestones.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsAddingEvent(!isAddingEvent)}
            className="px-4 py-2 bg-[#F27D26] hover:bg-[#ff8a38] text-black font-black uppercase text-xs flex items-center gap-1.5 transition-all shadow-md"
          >
            <Plus className="w-4 h-4 text-black" />
            <span>{isAddingEvent ? 'Close Form' : 'Log Apex Moment'}</span>
          </button>
        </div>
      </div>

      {/* D9 Cycle Stats Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#111] border border-[#222] p-4">
        <div className="space-y-1">
          <span className="text-[10px] text-[#888] uppercase font-bold block">Current D9 Time</span>
          <div className="text-base font-black text-[#00E5FF] flex items-center gap-1">
            <Clock className="w-4 h-4 text-[#00E5FF]" />
            <span>{formatD9Time(d9State)}</span>
          </div>
          <span className="text-[9px] text-[#00FF88] uppercase font-mono">
            {d9State.isApexWedge ? `🔥 APEX WEDGE ACTIVE` : `${d9State.minutesToNextApex}m to next Apex`}
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] text-[#888] uppercase font-bold block">Logged Apex Wedges</span>
          <div className="text-base font-black text-[#FFD700] flex items-center gap-1">
            <Flame className="w-4 h-4 text-[#FFD700]" />
            <span>{totalApexCount} Moments</span>
          </div>
          <span className="text-[9px] text-[#888] uppercase font-mono">Midday & Midnight Wedges</span>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] text-[#888] uppercase font-bold block">Harmony Notes Earned</span>
          <div className="text-base font-black text-[#00FF88] flex items-center gap-1">
            <Coins className="w-4 h-4 text-[#00FF88]" />
            <span>+{totalHarmonyLogged} Notes</span>
          </div>
          <span className="text-[9px] text-[#00FF88] uppercase font-mono">90% Creator Direct</span>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] text-[#888] uppercase font-bold block">Node Mesh Ledger</span>
          <div className="text-base font-black text-[#e0e0e0]">AS65001</div>
          <span className="text-[9px] text-[#aaa] uppercase font-mono">Port Waikato Primary</span>
        </div>
      </div>

      {/* Log Apex Moment Form Drawer */}
      {isAddingEvent && (
        <form onSubmit={handleAddEvent} className="bg-[#0a1520] border-2 border-[#F27D26] p-4 space-y-4 animate-in slide-in-from-top-3 duration-200">
          <div className="flex items-center justify-between border-b border-[#F27D26]/40 pb-2">
            <h3 className="font-black text-xs uppercase text-[#F27D26] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F27D26]" />
              <span>Record Breakthrough in D9 Temporal Ledger</span>
            </h3>
            <span className="text-[10px] text-[#00E5FF] font-mono">
              Auto-stamping D9 Hour {d9State.d9Hour}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <label className="text-[10px] text-[#aaa] uppercase font-bold block">Milestone / Breakthrough Title</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Mastered 16-step dub bass line, Completed Vector Badge..."
                className="w-full bg-[#050505] border border-[#333] focus:border-[#F27D26] p-2 text-xs text-[#e0e0e0] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-[#aaa] uppercase font-bold block">Event Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full bg-[#050505] border border-[#333] focus:border-[#F27D26] p-2 text-xs text-[#e0e0e0] focus:outline-none uppercase"
              >
                <option value="APEX_WEDGE">🔥 Apex Wedge Breakthrough</option>
                <option value="MILESTONE">🏆 Milestone Accomplished</option>
                <option value="CREATIVE_DROP">🎨 Creative Drop Export</option>
                <option value="SOVEREIGN_SPLIT">💰 Sovereign Harmony Split</option>
                <option value="QUEST_COMPLETED">🏄 Surf / Eco Quest</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-[#aaa] uppercase font-bold block">Breakthrough Description & Notes</label>
            <textarea
              rows={2}
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Describe the creative flow state, tools used, or surf session details..."
              className="w-full bg-[#050505] border border-[#333] focus:border-[#F27D26] p-2 text-xs text-[#e0e0e0] focus:outline-none font-sans"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#888] uppercase">Bonus Harmony:</span>
              <input
                type="number"
                min="0"
                max="100"
                value={newHarmony}
                onChange={(e) => setNewHarmony(Number(e.target.value))}
                className="w-20 bg-[#050505] border border-[#333] p-1 text-xs text-[#00FF88] font-bold text-center"
              />
              <span className="text-xs text-[#00FF88]">Notes</span>
            </div>

            <button
              type="submit"
              className="px-5 py-2 bg-[#F27D26] hover:bg-[#ff8a38] text-black font-black uppercase text-xs flex items-center gap-1.5 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4 text-black" />
              <span>Save to Ledger</span>
            </button>
          </div>
        </form>
      )}

      {/* Filters & Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#111] border border-[#222] p-3 text-xs">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar w-full sm:w-auto">
          {[
            { id: 'ALL', label: 'All Events' },
            { id: 'APEX_WEDGE', label: '🔥 Apex Wedges' },
            { id: 'MILESTONE', label: '🏆 Milestones' },
            { id: 'CREATIVE_DROP', label: '🎨 Drops' },
            { id: 'QUEST_COMPLETED', label: '🏄 Quests' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id as any)}
              className={`px-3 py-1.5 border transition-all text-[11px] font-bold uppercase shrink-0 ${
                filterCategory === cat.id
                  ? 'bg-[#F27D26] text-black border-[#F27D26]'
                  : 'bg-[#050505] text-[#888] border-[#333] hover:text-[#e0e0e0]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-[#666] absolute left-2.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events, hours, tags..."
            className="w-full bg-[#050505] border border-[#333] focus:border-[#F27D26] text-xs text-[#e0e0e0] pl-8 pr-3 py-1.5 focus:outline-none"
          />
        </div>
      </div>

      {/* Event Timeline Stream */}
      <div className="space-y-4 relative pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#333]">
        {filteredEvents.length === 0 ? (
          <div className="bg-[#0a0a0a] border border-[#222] p-8 text-center space-y-2 text-[#777]">
            <History className="w-8 h-8 mx-auto text-[#444]" />
            <p className="text-xs uppercase font-bold">No temporal records found</p>
            <p className="text-[10px] font-sans">Try resetting search query or log a new Apex moment above.</p>
          </div>
        ) : (
          filteredEvents.map((evt) => {
            const isApex = evt.category === 'APEX_WEDGE' || evt.apexType;

            return (
              <div key={evt.id} className="relative group">
                {/* Timeline Dot Icon */}
                <div
                  className={`absolute -left-6 top-3 w-5 h-5 rounded-full border flex items-center justify-center text-[9px] font-black z-10 ${
                    isApex
                      ? 'bg-[#F27D26] border-[#F27D26] text-black ring-2 ring-[#F27D26]/40 animate-pulse'
                      : 'bg-[#050505] border-[#555] text-[#888]'
                  }`}
                >
                  {isApex ? '🔥' : '📍'}
                </div>

                {/* Event Record Card */}
                <div
                  className={`p-4 border transition-all space-y-3 ${
                    isApex
                      ? 'bg-[#0a1218] border-[#F27D26] shadow-lg shadow-[#F27D26]/10'
                      : 'bg-[#0a0a0a] border-[#222] hover:border-[#444]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#222] pb-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="bg-[#111] text-[#00E5FF] border border-[#00E5FF]/40 px-2 py-0.5 text-[10px] font-bold uppercase">
                          {evt.solarTimeStr}
                        </span>

                        {evt.apexType && (
                          <span className="bg-[#F27D26] text-black font-black text-[10px] uppercase px-2 py-0.5">
                            {evt.apexType} Apex Wedge
                          </span>
                        )}

                        <span className="text-[10px] text-[#888] font-mono">
                          D9 Hour {evt.d9Hour} / 26
                        </span>
                      </div>

                      <h4 className="font-black text-sm uppercase text-[#e0e0e0] flex items-center gap-2 pt-0.5">
                        <span>{evt.title}</span>
                      </h4>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {evt.harmonyAmount && (
                        <span className="bg-[#00FF88]/10 text-[#00FF88] border border-[#00FF88]/40 px-2.5 py-1 text-xs font-bold font-mono">
                          +{evt.harmonyAmount} Harmony Notes
                        </span>
                      )}

                      <button
                        onClick={() => toggleStar(evt.id)}
                        className={`p-1.5 transition-colors ${
                          evt.isStarred ? 'text-[#FFD700]' : 'text-[#444] hover:text-[#888]'
                        }`}
                        title="Star / Bookmark Apex Moment"
                      >
                        <Star className={`w-4 h-4 ${evt.isStarred ? 'fill-[#FFD700]' : ''}`} />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-[#aaa] font-sans leading-relaxed">
                    {evt.description}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-[#1a1a1a] text-[10px] text-[#777]">
                    <div className="flex flex-wrap gap-1.5">
                      {evt.tags.map((t, i) => (
                        <span key={i} className="bg-[#111] text-[#00E5FF] px-1.5 py-0.2 border border-[#222]">
                          {t}
                        </span>
                      ))}
                    </div>

                    <span className="flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3 text-[#666]" /> {evt.timestamp}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Sovereign Split Footer Explanation */}
      <div className="bg-[#0a1520] border border-[#00E5FF]/40 p-4 text-xs font-sans text-[#aaa] flex items-start gap-3">
        <Award className="w-5 h-5 text-[#00E5FF] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-[#00E5FF] font-mono uppercase block text-[10px]">
            Dragon 9 Sovereign Ledger Protocol:
          </strong>
          <p>
            Every Apex breakthrough recorded on this timeline automatically computes a 90% direct creator allocation, 9% Port Waikato campground community fund, and 1% ecosystem void split across the AS65001 mesh node network.
          </p>
        </div>
      </div>
    </div>
  );
};
