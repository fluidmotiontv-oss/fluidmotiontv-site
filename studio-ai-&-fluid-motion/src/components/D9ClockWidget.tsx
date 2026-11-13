import React from 'react';
import { Clock, Sun, Moon, ShieldCheck, Flame, Info, CheckCircle2, Tv } from 'lucide-react';
import { D9ClockState } from '../types';

interface D9ClockWidgetProps {
  d9State: D9ClockState;
  onOpenPremiereStage?: () => void;
}

export const D9ClockWidget: React.FC<D9ClockWidgetProps> = ({ d9State, onOpenPremiereStage }) => {
  // Operational Hours 1 to 26
  const hoursArray = Array.from({ length: 26 }, (_, i) => i + 1);

  return (
    <div className="bg-[#111] border-l-4 border-[#F27D26] border-y border-r border-[#333] p-5 text-[#e0e0e0] relative overflow-hidden shadow-2xl">
      {/* Clock Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#333] pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black italic tracking-tight text-[#e0e0e0] flex items-center gap-2 uppercase">
              <Clock className="w-5 h-5 text-[#F27D26]" />
              Dragon 9 Temporal Engine
            </h2>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 bg-[#00FF88] text-black">
              ZERO DRIFT
            </span>
          </div>
          <p className="text-xs font-mono opacity-60 uppercase tracking-wider mt-1">
            1,440 SOLAR MINS = 26 OPERATIONAL HOURS (54M) + 2 APEX WEDGES (18M)
          </p>
        </div>

        {/* Live Status Indicators & Premiere Stage Trigger */}
        <div className="flex flex-wrap items-center gap-4">
          {onOpenPremiereStage && (
            <button
              onClick={onOpenPremiereStage}
              className={`px-3.5 py-1.5 font-mono text-xs font-black uppercase flex items-center gap-2 transition-all shadow-md cursor-pointer ${
                d9State.isApexWedge
                  ? 'bg-[#FFD700] hover:bg-[#ffe142] text-black shadow-[0_0_20px_rgba(255,215,0,0.5)] animate-pulse'
                  : 'bg-[#1a1a1a] hover:bg-[#252525] text-[#FFD700] border border-[#FFD700]'
              }`}
              title="Launch Node Premiere Stage Modal"
            >
              <Tv className="w-4 h-4 text-current" />
              <span>Premiere Stage</span>
            </button>
          )}

          <div className="text-right">
            <div className="text-[10px] uppercase font-mono opacity-50">Standard Solar Time</div>
            <div className="text-sm font-bold text-[#FFD700] font-mono">{d9State.solarTimeStr}</div>
          </div>

          <div className="h-8 w-px bg-[#333] hidden sm:block" />

          <div className="text-left hidden sm:block">
            <div className="text-[10px] uppercase font-mono opacity-50">Mesh Node Anchor</div>
            <div className="text-xs font-mono font-bold text-[#00E5FF] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00E5FF]" />
              AS65001_CLOCK
            </div>
          </div>
        </div>
      </div>

      {/* Main Clock Banner / Alert */}
      {d9State.isApexWedge ? (
        <div className="bg-[#FFD700]/10 border-2 border-[#FFD700] p-4 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#FFD700] text-black flex items-center justify-center font-black text-2xl shrink-0 shadow-lg">
              <Flame className="w-7 h-7 text-black animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black italic text-[#FFD700] uppercase tracking-wider text-sm">
                  Apex Wedge Active ({d9State.apexType} Pause)
                </span>
                <span className="text-xs bg-[#FFD700] text-black px-2 py-0.5 font-mono font-bold">
                  Minute {d9State.apexMinuteElapsed} / 18
                </span>
              </div>
              <p className="text-xs font-mono opacity-90 mt-1 text-[#e0e0e0]">
                18-Minute Community Pause & Staging Window for Big-Screen Premieres, Radio Submissions, and Artwork Showcase at Port Waikato.
              </p>
            </div>
          </div>

          {onOpenPremiereStage && (
            <button
              onClick={onOpenPremiereStage}
              className="px-5 py-2.5 bg-[#FFD700] hover:bg-[#ffe142] text-black font-black uppercase text-xs tracking-wider transition-all shadow-[0_0_20px_rgba(255,215,0,0.6)] flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <Tv className="w-4 h-4 text-black" />
              <span>ENTER PREMIERE STAGE</span>
            </button>
          )}
        </div>
      ) : (
        <div className="bg-[#0a0a0a] border border-[#333] p-4 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 border border-[#F27D26] bg-[#1a1a1a] flex items-center justify-center text-[#F27D26] font-mono font-black text-xl">
              {d9State.d9Hour}
            </div>
            <div>
              <div className="text-sm font-bold text-[#e0e0e0] flex items-center gap-2 font-mono uppercase">
                <span>Operational Hour {d9State.d9Hour} / 26</span>
                {d9State.is13thTransition && (
                  <span className="text-[10px] bg-[#00E5FF] text-black font-black px-2 py-0.5 uppercase tracking-wider">
                    13th Hour Transition
                  </span>
                )}
              </div>
              <p className="text-xs font-mono opacity-60">
                Minute {d9State.hourMinute} of 54 • Active Content Creation & Beat Synthesis Block
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#111] px-3.5 py-2 border border-[#333] font-mono text-xs text-[#e0e0e0]">
            <Sun className="w-4 h-4 text-[#F27D26] animate-spin-slow" />
            <span className="opacity-60 uppercase text-[10px]">Next Apex Wedge in:</span>
            <strong className="text-[#00E5FF] font-bold text-sm">{d9State.minutesToNextApex} MINS</strong>
          </div>
        </div>
      )}

      {/* 26 Operational Hours Visual Track */}
      <div>
        <div className="flex items-center justify-between text-xs font-mono opacity-60 mb-2 uppercase tracking-wider">
          <span className="font-bold text-[#e0e0e0]">26 Operational Hours (54m Each) Grid</span>
          <span>1,404 Operational Minutes</span>
        </div>

        <div className="grid grid-cols-13 gap-1.5 sm:gap-2">
          {hoursArray.map((hour) => {
            const isCurrent = d9State.d9Hour === hour && !d9State.isApexWedge;
            const isPassed = d9State.d9Hour > hour;
            const isMiddayWedgeBorder = hour === 13;
            const isMidnightWedgeBorder = hour === 26;

            return (
              <div
                key={hour}
                className={`relative p-2 text-center transition-all border ${
                  isCurrent
                    ? 'bg-[#F27D26] border-[#F27D26] text-black font-black shadow-lg shadow-[#F27D26]/20'
                    : isPassed
                    ? 'bg-[#0a0a0a] border-[#222] text-[#555]'
                    : 'bg-[#1a1a1a] border-[#333] text-[#aaa]'
                }`}
              >
                <div className="text-[9px] font-mono uppercase opacity-60">H</div>
                <div className="text-xs font-mono font-bold">{hour}</div>

                {isMiddayWedgeBorder && (
                  <div className="absolute -right-1.5 top-0 bottom-0 w-1 bg-[#F27D26]" title="Midday Apex Wedge (18m)" />
                )}
                {isMidnightWedgeBorder && (
                  <div className="absolute -right-1.5 top-0 bottom-0 w-1 bg-[#F27D26]" title="Midnight Apex Wedge (18m)" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Temporal Formula Footer */}
      <div className="mt-4 pt-3 border-t border-[#333] flex flex-wrap items-center justify-between text-[11px] font-mono opacity-70 gap-2 uppercase tracking-wider">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-[#00E5FF] inline-block" />
            26H x 54m = 1,404m
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-[#F27D26] inline-block" />
            2 Wedges x 18m = 36m
          </span>
          <span className="flex items-center gap-1.5 font-bold text-[#00FF88]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#00FF88]" />
            Total = 1,440 Solar Minutes
          </span>
        </div>

        <div className="flex items-center gap-2 text-[#888]">
          <Info className="w-3.5 h-3.5 text-[#F27D26]" />
          <span>Port Waikato ISP AS65001</span>
        </div>
      </div>
    </div>
  );
};

