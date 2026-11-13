import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, ShieldCheck, Waves, RefreshCw, ThumbsUp } from 'lucide-react';
import { ChatMessage } from '../types';

interface StudioAIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onSendBeatIdea?: (bpm: number, genre: string) => void;
  onSendVectorPrompt?: (prompt: string) => void;
}

export const StudioAIAssistant: React.FC<StudioAIAssistantProps> = ({
  isOpen,
  onClose,
  onSendBeatIdea,
  onSendVectorPrompt
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: "Kia ora! Stoke level high! 🌊 I'm Studio AI, your creative surf & media mentor here at Port Waikato (Pee Dub). Ready to turn ocean sessions, campground jams, and nature vibes into vector art, beats, or digital comics? What vibe are you feeling today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const promptChips = [
    "Ask Frostbite for surf XA-stretches & superfoods 🥶🏄‍♂️",
    "Lay down an 82 BPM Dub / Reggae beat idea 🥁",
    "Vectorize a surfboard breaking through an ocean barrel 🏄",
    "Help me write a 4-panel comic about Pee Dub sunset 🌅",
    "Explain how my 90% creator earnings work 🪙"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query })
      });

      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || "Stoke level high! Keep creating rad vibes. Catch you on the next set. 🤙",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        pgFiltered: data.pgFiltered,
        filterNotice: data.filterNotice
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: "Looks like a heavy wave rolled through the line! Let's shake it off and try that idea again. Catch you on the next set. 🤙",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm font-mono">
      <div className="w-full max-w-lg bg-[#050505] border-l-4 border-[#F27D26] text-[#e0e0e0] flex flex-col h-full shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Assistant Header */}
        <div className="p-4 bg-[#111] border-b border-[#333] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#F27D26] border border-[#F27D26] flex items-center justify-center text-black font-black">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <div>
              <h3 className="font-black italic uppercase text-[#e0e0e0] flex items-center gap-2">
                Studio AI Mentor
                <span className="text-[10px] bg-[#050505] text-[#00E5FF] border border-[#333] px-2 py-0.5 uppercase">
                  Pee Dub Node
                </span>
              </h3>
              <p className="text-xs opacity-60 uppercase">Zero Technical Jargon • Surf Mentor Mode</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#aaa] hover:text-[#e0e0e0] hover:bg-[#222] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PG Guardrail Notice */}
        <div className="bg-[#050505] px-4 py-2 border-b border-[#333] flex items-center justify-between text-xs font-mono">
          <span className="flex items-center gap-1.5 text-[#00FF88] font-bold uppercase">
            <ShieldCheck className="w-3.5 h-3.5" />
            PG Surf Slang Guardrail Active
          </span>
          <span className="text-[#888] text-[10px] uppercase">AS65001 Mesh Tunnel</span>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3.5 text-xs font-mono leading-relaxed border ${
                    isUser
                      ? 'bg-[#F27D26] text-black border-[#F27D26] font-bold'
                      : 'bg-[#111] text-[#e0e0e0] border-[#333]'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {msg.filterNotice && (
                    <div className="mt-2 text-[10px] bg-[#050505] text-[#FFD700] border border-[#FFD700] p-1.5 uppercase flex items-center gap-1">
                      <Waves className="w-3 h-3 text-[#FFD700] shrink-0" />
                      <span>{msg.filterNotice}</span>
                    </div>
                  )}
                </div>

                <span className="text-[10px] text-[#888] mt-1 px-1 font-mono uppercase">
                  {msg.timestamp}
                </span>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs font-mono text-[#00E5FF] bg-[#111] p-3 border border-[#333] w-fit">
              <RefreshCw className="w-4 h-4 animate-spin text-[#00E5FF]" />
              <span>Studio AI is catching the wave response...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompt Suggestion Chips */}
        <div className="p-3 bg-[#050505] border-t border-[#333] flex flex-wrap gap-1.5 font-mono">
          {promptChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(chip)}
              disabled={isLoading}
              className="text-[10px] bg-[#111] hover:bg-[#F27D26] hover:text-black text-[#aaa] border border-[#333] px-2.5 py-1 uppercase transition-all text-left"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-[#111] border-t border-[#333] flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Studio AI for beat vibes, vector ideas, comic panels..."
            className="flex-1 bg-[#050505] border border-[#333] text-[#e0e0e0] placeholder-[#555] px-4 py-2.5 text-xs font-mono focus:outline-none focus:border-[#F27D26] transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2.5 bg-[#F27D26] hover:bg-[#ff8a38] disabled:opacity-50 text-black font-bold transition-all border border-[#F27D26]"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

