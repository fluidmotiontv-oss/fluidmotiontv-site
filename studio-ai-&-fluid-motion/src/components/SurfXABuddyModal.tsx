import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Waves,
  Heart,
  Smile,
  Zap,
  Music,
  Wind,
  Sun,
  Compass,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  BookOpen,
  Award,
  ChevronRight,
  Send,
  Droplets,
  Flame,
  ShieldCheck,
  Activity,
  SmilePlus,
  Coffee,
  ListTodo
} from 'lucide-react';

interface SurfXABuddyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEarnHarmony?: (amount: number, desc: string) => void;
  onNavigateTab?: (tab: string) => void;
}

interface StretchItem {
  id: string;
  name: string;
  duration: number; // in seconds
  category: 'PRE_SURF' | 'POST_SURF' | 'DESK_RESET';
  targetArea: string;
  instruction: string;
  proTip: string;
}

const STRETCHES: StretchItem[] = [
  {
    id: 's1',
    name: 'Pop-Up Hip Flexor & Psoas Unshackler',
    duration: 45,
    category: 'PRE_SURF',
    targetArea: 'Hips & Psoas',
    instruction: 'Kneel on left knee, step right foot forward into a 90° lunge. Tuck pelvis under, shift hips slightly forward, reach left arm high.',
    proTip: 'Squeeze left glute to unlock deep hip flexors for faster pop-ups on fast hollow waves.',
  },
  {
    id: 's2',
    name: 'Paddler Thoracic Spine Rotator & Lats Opener',
    duration: 60,
    category: 'PRE_SURF',
    targetArea: 'Upper Back & Lats',
    instruction: 'Quadruped position, hand behind head. Rotate elbow up toward the sky opening chest, then thread through under opposite arm.',
    proTip: 'Eliminates shoulder fatigue during long paddle-outs through heavy Port Waikato white water.',
  },
  {
    id: 's3',
    name: 'Ankle Wave Agility & Calf Extension',
    duration: 45,
    category: 'PRE_SURF',
    targetArea: 'Ankles & Calves',
    instruction: 'Downward dog position, pedal heels slowly up and down. Hold left heel down, drive knee over toes without lifting heel.',
    proTip: 'Essential for deep bottom turns and reactive rail control on steep point break faces.',
  },
  {
    id: 's4',
    name: 'Cobra Lats Decompressor & Chest Opening',
    duration: 60,
    category: 'POST_SURF',
    targetArea: 'Lower Back & Chest',
    instruction: 'Lie prone, hands under shoulders. Inhale and gently lift chest while keeping hips grounded, looking forward gently.',
    proTip: 'Reverses arch-backed paddling posture and restores spinal alignment.',
  },
  {
    id: 's5',
    name: 'Glute Pigeon Pose & Sciatica Relief',
    duration: 60,
    category: 'POST_SURF',
    targetArea: 'Glutes & Outer Hips',
    instruction: 'Bring right knee forward behind right wrist, extend left leg straight back. Fold over front leg onto forearms if comfortable.',
    proTip: 'Releases hip tightness built up from sitting on board in the lineup waiting for sets.',
  },
];

const SUPERFOOD_RECIPES = [
  {
    id: 'sf1',
    title: 'Port Waikato Ocean Blue Spirulina Bowl',
    icon: '🥣',
    ingredients: ['1 tsp Blue Spirulina', '1 Frozen Banana', '1/2 cup Coconut Water', 'Toppings: Hemp seeds, Kiwi slices, Macadamia nuts'],
    benefits: 'High antioxidants, natural electrolyte recovery & reduced muscle inflammation.',
  },
  {
    id: 'sf2',
    title: 'Turmeric Ginger Barrel-Shot',
    icon: '🫚',
    ingredients: ['1 inch Fresh Turmeric', '1 inch Fresh Ginger', 'Lemon juice', 'Dash of Black Pepper', '1 tsp Raw Honey'],
    benefits: 'Potent natural anti-inflammatory that keeps joints supple for heavy paddle sessions.',
  },
  {
    id: 'sf3',
    title: 'Adaptogen Maca Pre-Surf Energy Elixir',
    icon: '⚡',
    ingredients: ['1 tsp Yellow Maca Powder', '1 cup Oat Milk', '1/2 tsp Cinnamon', '1 tsp Raw Cacao'],
    benefits: 'Sustained stamina & mental focus without coffee jitters in heavy surf.',
  },
];

const SURF_JOKES = [
  "Why don't surfers ever get cold in winter? Because they wear wet-SUITS and stay FROSTBITE chill! ❄️🏄‍♂️",
  "What is a surfer's favorite kind of sandwich? Peanut butter and JELLYFISH! 🥪🪼",
  "Why did the wave break up with the shore? Because it felt like it was getting pushed around! 🌊💔",
  "How do waves greet each other at Port Waikato? They give each other a BIG HIGH TIDE FIVE! ✋🌊",
  "What did the board say to the wave? 'You crack me up!' 🏄‍♀️💥",
];

const LEGEND_WISDOM = [
  {
    author: 'Gerry Lopez (Mr. Pipeline)',
    quote: 'Surfing is as close as you can get to being in harmony with nature. You are riding energy created thousands of miles away.',
    tip: 'Mindful Breathing: When a heavy set comes, calm your heart rate first before paddling.',
  },
  {
    author: 'Duke Kahanamoku',
    quote: 'In the water, you are equal. Respect the ocean, respect every surfer, and share the wave with Aloha.',
    tip: 'Lineup Respect: Give a warm smile or wave to whoever is waiting inside.',
  },
  {
    author: 'Laird Hamilton',
    quote: 'Make sure your worst enemy doesn’t live between your two ears. Mind mobility is as critical as shoulder mobility.',
    tip: 'Mindful Wish: Visualize your entire drop and bottom turn before paddling into the set.',
  },
  {
    author: 'Kelly Slater',
    quote: 'Your body is your primary surfboard. If your hips and ankles don’t flex, your board won’t carve.',
    tip: 'XA-Stretch Tip: Perform 5 minutes of hip mobility every single morning before coffee.',
  },
];

export const SurfXABuddyModal: React.FC<SurfXABuddyModalProps> = ({
  isOpen,
  onClose,
  onEarnHarmony,
  onNavigateTab,
}) => {
  const [activeTab, setActiveTab] = useState<'STRETCH' | 'SUPERFOODS' | 'BEATS_CARTOONS' | 'LEGENDS_WISH' | 'WEATHER' | 'CHAT'>('STRETCH');

  // Stretch Timer State
  const [activeStretchIdx, setActiveStretchIdx] = useState<number>(0);
  const [timerSeconds, setTimerSeconds] = useState<number>(STRETCHES[0].duration);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [completedStretches, setCompletedStretches] = useState<string[]>([]);

  // Box Breathing Trainer State
  const [breathPhase, setBreathPhase] = useState<'IN' | 'HOLD_IN' | 'OUT' | 'HOLD_OUT'>('IN');
  const [breathCount, setBreathCount] = useState<number>(4);
  const [isBreathingActive, setIsBreathingActive] = useState<boolean>(false);

  // Mindful Wish State
  const [userWish, setUserWish] = useState<string>('');
  const [wishesList, setWishesList] = useState<string[]>([
    "May the ocean grant clean glassy lines and safe landings for the entire campground crew at Pee Dub Point.",
    "May my shoulders feel light and weightless during long paddle-outs.",
    "May every wipeout be a gentle lesson in laughter and humility.",
  ]);

  // Cartoon & Joke State
  const [jokeIdx, setJokeIdx] = useState<number>(0);

  // Frostbite Chat State
  const [chatMessages, setChatMessages] = useState<{ sender: 'frostbite' | 'user'; text: string; time: string }[]>([
    {
      sender: 'frostbite',
      text: "Kia ora! Sub-Zero Stoke Level High! 🥶🏄‍♂️ I'm Frostbite, your Surf XA-Stretch AI Buddy & Coastal Guide. Need a pre-surf hip opener, superfood smoothie recipe, breathwork drill, or live weather check for Port Waikato?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [chatInput, setChatInput] = useState<string>('');

  // Stretch Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      const currentStretch = STRETCHES[activeStretchIdx];
      if (!completedStretches.includes(currentStretch.id)) {
        setCompletedStretches((prev) => [...prev, currentStretch.id]);
        if (onEarnHarmony) {
          onEarnHarmony(10, `Completed XA-Stretch: ${currentStretch.name}`);
        }
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds, activeStretchIdx, completedStretches, onEarnHarmony]);

  // Box Breathing Effect (4s - 4s - 4s - 4s)
  useEffect(() => {
    let interval: any = null;
    if (isBreathingActive) {
      interval = setInterval(() => {
        setBreathCount((prev) => {
          if (prev <= 1) {
            setBreathPhase((curr) => {
              if (curr === 'IN') return 'HOLD_IN';
              if (curr === 'HOLD_IN') return 'OUT';
              if (curr === 'OUT') return 'HOLD_OUT';
              return 'IN';
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBreathingActive]);

  if (!isOpen) return null;

  const currentStretch = STRETCHES[activeStretchIdx];

  const handleSelectStretch = (idx: number) => {
    setActiveStretchIdx(idx);
    setTimerSeconds(STRETCHES[idx].duration);
    setIsTimerRunning(false);
  };

  const handleAddWish = () => {
    if (!userWish.trim()) return;
    setWishesList((prev) => [userWish.trim(), ...prev]);
    if (onEarnHarmony) {
      onEarnHarmony(5, 'Sent Mindful Ocean Wish');
    }
    setUserWish('');
  };

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatMessages((prev) => [
      ...prev,
      { sender: 'user', text: userMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
    ]);
    setChatInput('');

    // Generate Frostbite AI Buddy Response based on prompt keywords
    setTimeout(() => {
      let reply = "Sub-Zero Stoke! 🥶 Remember to keep your shoulders relaxed, stay hydrated with coconut water, and catch the clean sunset wave set! 🤙";
      const queryLower = userMsg.toLowerCase();

      if (queryLower.includes('stretch') || queryLower.includes('hip') || queryLower.includes('shoulder')) {
        reply = "Flexibility is speed in the barrel! Try our 60s Pop-Up Hip Flexor Unshackler before heading out to the point break. Your pop-up will feel like lightning! ⚡🏄‍♂️";
      } else if (queryLower.includes('superfood') || queryLower.includes('food') || queryLower.includes('drink') || queryLower.includes('eat')) {
        reply = "Blend 1 tsp of Blue Spirulina with coconut water & frozen kiwi! High antioxidants keep your muscles supple and prevent post-surf cramps! 🥣🥑";
      } else if (queryLower.includes('weather') || queryLower.includes('wave') || queryLower.includes('swell') || queryLower.includes('wind')) {
        reply = "Port Waikato Swell: 2.4m @ 13s SSW with 12 knot ENE offshore winds! The point break is holding clean 4 to 6 ft faces right now! 🌅🌊";
      } else if (queryLower.includes('joke') || queryLower.includes('cartoon') || queryLower.includes('funny') || queryLower.includes('laugh')) {
        reply = SURF_JOKES[Math.floor(Math.random() * SURF_JOKES.length)];
      } else if (queryLower.includes('legend') || queryLower.includes('quote') || queryLower.includes('mind')) {
        reply = "Gerry Lopez says: 'Surfing is as close as you can get to being in harmony with nature.' Take 3 box breaths before paddling out! 🧘‍♂️✨";
      }

      setChatMessages((prev) => [
        ...prev,
        { sender: 'frostbite', text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      ]);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md font-mono p-3 sm:p-5 overflow-y-auto">
      <div className="w-full max-w-4xl bg-[#050505] border-2 border-[#00E5FF] text-[#e0e0e0] flex flex-col max-h-[92vh] shadow-2xl shadow-[#00E5FF]/20 animate-in zoom-in-95 duration-200">
        
        {/* Frostbite Header Banner */}
        <div className="p-4 bg-[#0a1520] border-b border-[#00E5FF]/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            {/* Frostbite Avatar Icon */}
            <div className="w-11 h-11 bg-[#00E5FF] border-2 border-[#00FF88] flex items-center justify-center text-black font-black text-xl shadow-md shadow-[#00E5FF]/50 shrink-0 relative">
              <span>🥶</span>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#00FF88] rounded-full animate-ping" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black italic uppercase text-base text-[#00E5FF] tracking-wider flex items-center gap-2">
                  Frostbite: Surf XA-Stretch AI Buddy
                </h3>
                <span className="bg-[#00FF88] text-black text-[9px] font-black uppercase px-2 py-0.5">
                  Sub-Zero Stoke
                </span>
              </div>
              <p className="text-xs text-[#aaa] uppercase tracking-wide">
                Mobility • Superfoods • Cartoons & Beats • Legend Tips • Weather Watch
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#aaa] hover:text-white bg-[#111] hover:bg-[#222] border border-[#333] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-[#111] border-b border-[#333] p-1.5 overflow-x-auto no-scrollbar text-xs font-bold uppercase shrink-0">
          {[
            { id: 'STRETCH', label: '🧘 XA-Stretch Guide', color: '#00E5FF' },
            { id: 'SUPERFOODS', label: '🥦 Superfoods & Laughs', color: '#00FF88' },
            { id: 'BEATS_CARTOONS', label: '🎶 Cartoons & Beats', color: '#F27D26' },
            { id: 'LEGENDS_WISH', label: '✨ Legend Tips & Wishes', color: '#FFD700' },
            { id: 'WEATHER', label: '🌤️ Weather Watch', color: '#00E5FF' },
            { id: 'CHAT', label: '💬 Talk to Frostbite', color: '#00FF88' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 border transition-all shrink-0 flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-[#050505] text-[#00E5FF] border-[#00E5FF] font-black shadow-sm'
                  : 'bg-[#111] text-[#888] border-transparent hover:text-[#e0e0e0] hover:border-[#333]'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Modal Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* TAB 1: XA-STRETCH & MOBILITY ROUTINES */}
          {activeTab === 'STRETCH' && (
            <div className="space-y-6">
              <div className="bg-[#0a1520] border border-[#00E5FF]/40 p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-[#00E5FF]" />
                    <h4 className="text-sm font-black uppercase text-[#00E5FF]">
                      Surf XA-Mobility & Warmup Routine
                    </h4>
                  </div>
                  <p className="text-xs text-[#aaa] font-sans">
                    Unshackle tight psoas, lats, and ankles to prevent wipeouts and maximize board control.
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-[#050505] border border-[#333] px-3 py-1.5 shrink-0 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-[#00FF88]" />
                  <span>
                    Completed: <strong className="text-[#00FF88]">{completedStretches.length}</strong> / {STRETCHES.length} Stretches
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Stretch List Selector */}
                <div className="lg:col-span-5 space-y-2.5">
                  <span className="text-xs font-bold text-[#888] uppercase">Select Routine Routine:</span>
                  {STRETCHES.map((st, idx) => {
                    const isSelected = idx === activeStretchIdx;
                    const isDone = completedStretches.includes(st.id);

                    return (
                      <div
                        key={st.id}
                        onClick={() => handleSelectStretch(idx)}
                        className={`p-3 border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#112233] border-[#00E5FF] shadow-md shadow-[#00E5FF]/20'
                            : isDone
                            ? 'bg-[#050505] border-[#00FF88] opacity-80'
                            : 'bg-[#050505] border-[#222] hover:border-[#444]'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-[10px]">
                            <span className="bg-[#111] text-[#00E5FF] px-1.5 py-0.2 border border-[#333] font-bold uppercase">
                              {st.category.replace('_', ' ')}
                            </span>
                            <span className="text-[#888]">{st.duration}s</span>
                          </div>
                          <h5 className="font-bold text-xs text-[#e0e0e0] uppercase">{st.name}</h5>
                        </div>

                        {isDone ? (
                          <CheckCircle2 className="w-5 h-5 text-[#00FF88] shrink-0" />
                        ) : (
                          <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-[#00E5FF]' : 'text-[#444]'}`} />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Active Stretch Display Card & Timer */}
                <div className="lg:col-span-7 bg-[#050505] border border-[#333] p-5 space-y-5 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center border-b border-[#222] pb-3">
                      <div>
                        <span className="text-[10px] text-[#00FF88] font-bold uppercase">Target: {currentStretch.targetArea}</span>
                        <h4 className="font-black text-base text-[#00E5FF] uppercase">{currentStretch.name}</h4>
                      </div>
                      <span className="bg-[#111] text-[#FFD700] border border-[#FFD700]/40 px-2.5 py-1 text-xs font-bold font-mono">
                        {currentStretch.duration}s Hold
                      </span>
                    </div>

                    <div className="bg-[#111] border border-[#222] p-3 text-xs text-[#e0e0e0] font-sans space-y-1.5">
                      <strong className="text-[#00E5FF] font-mono uppercase block text-[10px]">Step-by-step Execution:</strong>
                      <p>{currentStretch.instruction}</p>
                    </div>

                    <div className="bg-[#0a1520] border border-[#00E5FF]/30 p-3 text-xs text-[#00E5FF] italic flex items-start gap-2">
                      <Zap className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5" />
                      <div>
                        <strong className="not-italic uppercase font-mono block text-[10px] text-[#00E5FF]">Frostbite Pro Tip:</strong>
                        <span>{currentStretch.proTip}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stretch Timer Control */}
                  <div className="bg-[#111] border border-[#333] p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-full border-2 border-[#00E5FF] flex items-center justify-center font-black text-lg text-[#00E5FF] bg-[#050505] shadow-lg shadow-[#00E5FF]/20">
                        {timerSeconds}s
                      </div>
                      <div>
                        <div className="text-[10px] text-[#888] uppercase font-bold">Active Stretch Timer</div>
                        <div className="text-xs font-bold text-[#e0e0e0]">
                          {isTimerRunning ? 'Hold pose gently & breathe...' : 'Ready when you are!'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => setIsTimerRunning(!isTimerRunning)}
                        className={`flex-1 sm:flex-initial px-5 py-2.5 font-black uppercase text-xs flex items-center justify-center gap-2 transition-all border ${
                          isTimerRunning
                            ? 'bg-[#FFD700] text-black border-[#FFD700]'
                            : 'bg-[#00E5FF] hover:bg-[#33efff] text-black border-[#00E5FF]'
                        }`}
                      >
                        {isTimerRunning ? <Pause className="w-4 h-4 text-black" /> : <Play className="w-4 h-4 text-black" />}
                        <span>{isTimerRunning ? 'Pause Hold' : 'Start Stretch Hold'}</span>
                      </button>

                      <button
                        onClick={() => handleSelectStretch(activeStretchIdx)}
                        className="p-2.5 bg-[#222] hover:bg-[#333] text-[#aaa] border border-[#444]"
                        title="Reset Timer"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SUPERFOODS & LAUGHTER */}
          {activeTab === 'SUPERFOODS' && (
            <div className="space-y-6">
              {/* Superfood Recipes Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#333] pb-2">
                  <h4 className="font-black text-sm uppercase text-[#00FF88] flex items-center gap-2">
                    <span>🥦 Port Waikato Superfood & Recovery Fuel</span>
                  </h4>
                  <span className="text-[10px] text-[#888] uppercase font-mono">Anti-Inflammatory & Hydration</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {SUPERFOOD_RECIPES.map((recipe) => (
                    <div key={recipe.id} className="bg-[#050505] border border-[#222] hover:border-[#00FF88] p-4 space-y-3 transition-all flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="text-2xl">{recipe.icon}</div>
                        <h5 className="font-bold text-xs text-[#e0e0e0] uppercase">{recipe.title}</h5>
                        <ul className="text-[11px] text-[#aaa] font-sans space-y-1 list-disc pl-4">
                          {recipe.ingredients.map((ing, i) => (
                            <li key={i}>{ing}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-2 border-t border-[#222] text-[10px] text-[#00FF88] italic">
                        <strong>Benefit:</strong> {recipe.benefits}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Surf Cartoon & Laughter Generator */}
              <div className="bg-[#0a1520] border border-[#00E5FF]/40 p-5 space-y-4 font-mono">
                <div className="flex items-center justify-between border-b border-[#00E5FF]/30 pb-3">
                  <div className="flex items-center gap-2">
                    <SmilePlus className="w-5 h-5 text-[#FFD700]" />
                    <h4 className="font-black text-sm uppercase text-[#FFD700]">
                      Frostbite Surf Cartoons & Daily Giggles
                    </h4>
                  </div>
                  <button
                    onClick={() => setJokeIdx((prev) => (prev + 1) % SURF_JOKES.length)}
                    className="px-3 py-1 bg-[#222] hover:bg-[#333] text-[#00E5FF] border border-[#00E5FF]/40 text-xs font-bold uppercase transition-colors"
                  >
                    Next Joke / Cartoon Quip 🔄
                  </button>
                </div>

                <div className="bg-[#050505] border border-[#333] p-4 text-sm font-sans text-[#e0e0e0] italic text-center">
                  "{SURF_JOKES[jokeIdx]}"
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CARTOONS & BEATS */}
          {activeTab === 'BEATS_CARTOONS' && (
            <div className="space-y-6 font-mono">
              <div className="bg-[#050505] border border-[#333] p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-[#333] pb-3">
                  <div className="flex items-center gap-2">
                    <Music className="w-5 h-5 text-[#F27D26]" />
                    <h4 className="font-black text-sm uppercase text-[#F27D26]">
                      Stretch Rhythm Beats & Comic Inspiration
                    </h4>
                  </div>
                  {onNavigateTab && (
                    <button
                      onClick={() => {
                        onClose();
                        onNavigateTab('music');
                      }}
                      className="px-3 py-1.5 bg-[#F27D26] hover:bg-[#ff8a38] text-black font-black text-xs uppercase flex items-center gap-1 border border-[#F27D26]"
                    >
                      <span>Open Beats Studio</span>
                      <ChevronRight className="w-4 h-4 text-black" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#111] border border-[#222] p-4 space-y-2">
                    <span className="text-[10px] text-[#00E5FF] font-bold uppercase block">Recommended BPM</span>
                    <h5 className="font-bold text-xs text-[#e0e0e0]">82 BPM Port Waikato Dub Delay Beats</h5>
                    <p className="text-xs text-[#888] font-sans">
                      Slow rhythmic dub tempo ideal for syncopated breathing during 60-second stretch holds.
                    </p>
                  </div>

                  <div className="bg-[#111] border border-[#222] p-4 space-y-2">
                    <span className="text-[10px] text-[#00FF88] font-bold uppercase block">Comic Strip Prompt</span>
                    <h5 className="font-bold text-xs text-[#e0e0e0]">Tales of Frostbite at Point Break</h5>
                    <p className="text-xs text-[#888] font-sans">
                      Generate 4-panel comic strips about catching winter swells and sharing hot ginger tea at campground.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LEGENDS & MINDFUL WISHING */}
          {activeTab === 'LEGENDS_WISH' && (
            <div className="space-y-6 font-mono">
              {/* Legendary Surfer Wisdom */}
              <div className="space-y-3">
                <h4 className="font-black text-sm uppercase text-[#FFD700] flex items-center gap-2 border-b border-[#333] pb-2">
                  <Award className="w-5 h-5 text-[#FFD700]" />
                  <span>Wisdom & Cross Training Tips from Surfing Legends</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {LEGEND_WISDOM.map((leg, idx) => (
                    <div key={idx} className="bg-[#050505] border border-[#222] p-4 space-y-2 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <span className="text-xs font-black text-[#FFD700] uppercase block">{leg.author}</span>
                        <p className="text-xs text-[#aaa] font-sans italic">"{leg.quote}"</p>
                      </div>
                      <div className="pt-2 border-t border-[#222] text-[10px] text-[#00E5FF] uppercase font-bold">
                        💡 {leg.tip}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mindful Ocean Wishing Circle */}
              <div className="bg-[#0a1520] border border-[#00E5FF]/40 p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-[#00E5FF]/30 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#00E5FF]" />
                    <h4 className="font-black text-sm uppercase text-[#00E5FF]">
                      Mindful Ocean Wishing Circle
                    </h4>
                  </div>
                  <span className="text-[10px] text-[#00FF88] font-bold uppercase">+5 Harmony Notes Per Wish</span>
                </div>

                <div className="flex items-center gap-2 bg-[#050505] border border-[#333] p-2">
                  <input
                    type="text"
                    value={userWish}
                    onChange={(e) => setUserWish(e.target.value)}
                    placeholder="Send a positive intention to the ocean & lineup (e.g. Clean lines, safe rides...)"
                    className="flex-1 bg-transparent px-3 py-1.5 text-xs text-[#e0e0e0] placeholder-[#555] focus:outline-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddWish();
                    }}
                  />
                  <button
                    onClick={handleAddWish}
                    className="px-4 py-1.5 bg-[#00E5FF] hover:bg-[#33efff] text-black font-black uppercase text-xs transition-colors shrink-0 flex items-center gap-1"
                  >
                    <Send className="w-3.5 h-3.5 text-black" />
                    <span>Send Wish</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-36 overflow-y-auto pr-1 text-xs">
                  {wishesList.map((wish, idx) => (
                    <div key={idx} className="bg-[#050505] border border-[#222] p-2.5 text-[#aaa] font-sans flex items-start gap-2">
                      <Heart className="w-3.5 h-3.5 text-[#00FF88] shrink-0 mt-0.5" />
                      <span>{wish}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PORT WAIKATO WEATHER WATCH */}
          {activeTab === 'WEATHER' && (
            <div className="space-y-6 font-mono">
              <div className="bg-[#050505] border border-[#00E5FF] p-5 space-y-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#222] pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Wind className="w-5 h-5 text-[#00E5FF]" />
                      <h4 className="font-black text-base uppercase text-[#00E5FF]">
                        Port Waikato Weather & Swell Telemetry
                      </h4>
                    </div>
                    <p className="text-xs text-[#888] uppercase">Pee Dub Point Break • Live Conditions</p>
                  </div>

                  <span className="bg-[#00FF88] text-black font-black text-xs uppercase px-3 py-1">
                    Surf Score: 5/5 Stars ⭐ Glassy Lines
                  </span>
                </div>

                {/* Weather Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-[#111] border border-[#222] p-3 text-center space-y-1">
                    <div className="text-[10px] text-[#888] uppercase font-bold">Swell Height</div>
                    <div className="text-base font-black text-[#00E5FF]">2.4m @ 13s</div>
                    <div className="text-[9px] text-[#00FF88] uppercase">SSW Primary Groundswell</div>
                  </div>

                  <div className="bg-[#111] border border-[#222] p-3 text-center space-y-1">
                    <div className="text-[10px] text-[#888] uppercase font-bold">Wind Direction</div>
                    <div className="text-base font-black text-[#00FF88]">12 kts ENE</div>
                    <div className="text-[9px] text-[#00FF88] uppercase">Offshore Groomed</div>
                  </div>

                  <div className="bg-[#111] border border-[#222] p-3 text-center space-y-1">
                    <div className="text-[10px] text-[#888] uppercase font-bold">Tide Window</div>
                    <div className="text-base font-black text-[#FFD700]">Rising 11:42 AM</div>
                    <div className="text-[9px] text-[#888] uppercase">Low to Mid Tide Push</div>
                  </div>

                  <div className="bg-[#111] border border-[#222] p-3 text-center space-y-1">
                    <div className="text-[10px] text-[#888] uppercase font-bold">Water Temp & UV</div>
                    <div className="text-base font-black text-[#F27D26]">16°C • UV 6</div>
                    <div className="text-[9px] text-[#aaa] uppercase">3/2mm Steamer Wetsuit</div>
                  </div>
                </div>

                <div className="bg-[#0a1520] border border-[#00E5FF]/40 p-4 text-xs text-[#00E5FF] italic flex items-start gap-2">
                  <span>🥶</span>
                  <div>
                    <strong className="not-italic font-mono uppercase text-[#00E5FF] block">Frostbite's Lineup Summary:</strong>
                    <span>"Clean 4 to 6 ft sets coming off the point! Get your 5-minute hip stretch in right now, grab your blue spirulina shot, and enjoy the glassy barrel sections!"</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: CHAT DIRECTLY WITH FROSTBITE */}
          {activeTab === 'CHAT' && (
            <div className="space-y-4 font-mono flex flex-col h-[420px] bg-[#050505] border border-[#333] p-4">
              <div className="flex items-center gap-2 border-b border-[#333] pb-3">
                <span className="text-xl">🥶</span>
                <div>
                  <h4 className="font-black text-xs uppercase text-[#00E5FF]">Talk to Frostbite AI Buddy</h4>
                  <p className="text-[10px] text-[#888] uppercase">Mobility, Superfoods & Surf Coaching Companion</p>
                </div>
              </div>

              {/* Chat Scroll Feed */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs custom-scrollbar">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`max-w-[85%] p-3 border text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-[#00E5FF] text-black border-[#00E5FF] font-bold'
                          : 'bg-[#111] text-[#e0e0e0] border-[#333]'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>
                    <span className="text-[9px] text-[#666] mt-1">{msg.time}</span>
                  </div>
                ))}
              </div>

              {/* Input Form */}
              <div className="flex items-center gap-2 border-t border-[#333] pt-3">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask Frostbite about stretches, weather, superfoods..."
                  className="flex-1 bg-[#111] border border-[#333] text-[#e0e0e0] placeholder-[#555] px-3 py-2 text-xs focus:outline-none focus:border-[#00E5FF]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendChat();
                  }}
                />
                <button
                  onClick={handleSendChat}
                  className="px-4 py-2 bg-[#00E5FF] text-black font-black uppercase text-xs hover:bg-[#33efff] transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
