import React, { useState } from 'react';
import { Coins, Heart, Shield, Percent, ArrowUpRight, CheckCircle, Wallet, Layers, Users } from 'lucide-react';
import { ArtistLedger } from '../types';

interface SovereignEconomyProps {
  harmonyNotes: number;
  shavings: number;
}

export const SovereignEconomy: React.FC<SovereignEconomyProps> = ({ harmonyNotes, shavings }) => {
  const [simAmount, setSimAmount] = useState(1000);

  const [artistLedgers] = useState<ArtistLedger[]>([
    { id: 'art-1', artistName: 'Kai (Pee Dub Shredder)', harmonyNotes: 3400, shavings: 120, totalEarned: 3777, splitCreator: 3400, splitCommunity: 340, splitVoid: 37 },
    { id: 'art-2', artistName: 'Aroha (Coastal Beats)', harmonyNotes: 4800, shavings: 250, totalEarned: 5333, splitCreator: 4800, splitCommunity: 480, splitVoid: 53 },
    { id: 'art-3', artistName: 'Tane (Vector Wave)', harmonyNotes: 2100, shavings: 90, totalEarned: 2333, splitCreator: 2100, splitCommunity: 210, splitVoid: 23 },
    { id: 'art-4', artistName: 'Campground Crew', harmonyNotes: 3950, shavings: 180, totalEarned: 4388, splitCreator: 3950, splitCommunity: 395, splitVoid: 43 }
  ]);

  const creatorSplit = Math.round(simAmount * 0.90);
  const communitySplit = Math.round(simAmount * 0.09);
  const voidSplit = Math.round(simAmount * 0.01);

  return (
    <div className="space-y-6 text-[#e0e0e0]">
      {/* Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111] border-l-4 border-[#F27D26] border-y border-r border-[#333] p-5">
        <div>
          <h2 className="text-xl font-black italic uppercase tracking-tight text-[#e0e0e0] flex items-center gap-2">
            <Coins className="w-6 h-6 text-[#FFD700]" />
            Sovereign Economic Model (90 / 9 / 1 Split)
          </h2>
          <p className="text-xs font-mono opacity-60 uppercase tracking-wider mt-1">
            DIRECT 90% PAYOUTS TO CREATORS, 9% REINVESTED INTO LOCAL CAMPGROUND GEAR, 1% ECOSYSTEM VOID.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#050505] border border-[#333] px-3.5 py-2 text-xs font-mono font-bold text-[#FFD700] uppercase tracking-wider">
          <span>Your Balance: <strong>{harmonyNotes} Harmony</strong></span>
        </div>
      </div>

      {/* 3 Pillar Split Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 90% Creator */}
        <div className="bg-[#111] border-2 border-[#00FF88] p-5 space-y-3 relative overflow-hidden shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-3xl font-black text-[#00FF88] font-mono">90%</span>
            <div className="w-10 h-10 bg-[#050505] border border-[#00FF88] flex items-center justify-center text-[#00FF88]">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="font-bold text-[#e0e0e0] text-sm uppercase font-mono">Direct Creator Earnings</h3>
            <p className="text-xs font-mono text-[#aaa] mt-1">
              Sent directly to the content author, beat producer, or vector artist with zero delay.
            </p>
          </div>
          <div className="text-[11px] font-mono text-[#00FF88] bg-[#050505] p-2 border border-[#333] uppercase">
            For every 1,000 Harmony → 900 Harmony
          </div>
        </div>

        {/* 9% Community Fund */}
        <div className="bg-[#111] border-2 border-[#00E5FF] p-5 space-y-3 relative overflow-hidden shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-3xl font-black text-[#00E5FF] font-mono">9%</span>
            <div className="w-10 h-10 bg-[#050505] border border-[#00E5FF] flex items-center justify-center text-[#00E5FF]">
              <Heart className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="font-bold text-[#e0e0e0] text-sm uppercase font-mono">Community Campground Fund</h3>
            <p className="text-xs font-mono text-[#aaa] mt-1">
              Reinvested directly into local Port Waikato campground surf boards, wetsuits, and studio gear.
            </p>
          </div>
          <div className="text-[11px] font-mono text-[#00E5FF] bg-[#050505] p-2 border border-[#333] uppercase">
            Current Fund: $1,282.50 NZD
          </div>
        </div>

        {/* 1% Ecosystem Void */}
        <div className="bg-[#111] border-2 border-[#333] p-5 space-y-3 relative overflow-hidden shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-3xl font-black text-[#aaa] font-mono">1%</span>
            <div className="w-10 h-10 bg-[#050505] border border-[#333] flex items-center justify-center text-[#aaa]">
              <Shield className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="font-bold text-[#e0e0e0] text-sm uppercase font-mono">Ecosystem Void</h3>
            <p className="text-xs font-mono text-[#aaa] mt-1">
              Sovereign protocol maintenance, network tunnel security, and platform sustainability.
            </p>
          </div>
          <div className="text-[11px] font-mono text-[#888] bg-[#050505] p-2 border border-[#333] uppercase">
            AS65001 Mesh Sustainability
          </div>
        </div>
      </div>

      {/* Interactive Revenue Split Simulator */}
      <div className="bg-[#111] border border-[#333] p-5 space-y-5">
        <div className="flex items-center justify-between border-b border-[#333] pb-3">
          <div>
            <h3 className="font-black italic text-sm text-[#e0e0e0] uppercase flex items-center gap-2 tracking-wider">
              <Percent className="w-4 h-4 text-[#FFD700]" />
              Interactive Revenue Split Simulator
            </h3>
            <p className="text-xs font-mono opacity-60 uppercase tracking-wider">
              TEST HOW CUSTOM HARMONY NOTES SALES SPLIT ACROSS THE PROTOCOL.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6 bg-[#050505] p-4 border border-[#333]">
          <div className="w-full sm:w-1/3">
            <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-[#aaa] mb-1">
              Input Harmony Notes Amount
            </label>
            <input
              type="number"
              value={simAmount}
              onChange={(e) => setSimAmount(Number(e.target.value) || 0)}
              className="w-full bg-[#111] border border-[#333] p-3 text-lg font-mono font-bold text-[#00E5FF] focus:outline-none focus:border-[#F27D26]"
            />
          </div>

          <div className="flex-1 w-full grid grid-cols-3 gap-3 text-center text-xs font-mono">
            <div className="bg-[#111] p-3 border border-[#00FF88]">
              <div className="text-[#888] uppercase text-[10px]">Creator (90%)</div>
              <div className="text-lg font-bold text-[#00FF88] mt-0.5">{creatorSplit.toLocaleString()}</div>
            </div>

            <div className="bg-[#111] p-3 border border-[#00E5FF]">
              <div className="text-[#888] uppercase text-[10px]">Campground (9%)</div>
              <div className="text-lg font-bold text-[#00E5FF] mt-0.5">{communitySplit.toLocaleString()}</div>
            </div>

            <div className="bg-[#111] p-3 border border-[#333]">
              <div className="text-[#888] uppercase text-[10px]">Void (1%)</div>
              <div className="text-lg font-bold text-[#aaa] mt-0.5">{voidSplit.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Artist Ledgers Table */}
      <div className="bg-[#111] border border-[#333] p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-black italic text-sm text-[#e0e0e0] uppercase flex items-center gap-2 tracking-wider">
              <Users className="w-4 h-4 text-[#00E5FF]" />
              Port Waikato Crew Ledgers (`artist_ledgers.json`)
            </h3>
            <p className="text-xs font-mono opacity-60 uppercase tracking-wider">
              PERSISTENT STATE VAULT FOR CREW EARNINGS, HARMONY NOTES, AND SHAVINGS.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono text-[#e0e0e0]">
            <thead className="bg-[#050505] text-[#888] uppercase text-[10px] border-b border-[#333]">
              <tr>
                <th className="p-3">Artist / Crew</th>
                <th className="p-3">Harmony Balance</th>
                <th className="p-3">Shavings</th>
                <th className="p-3">Total Lifetime</th>
                <th className="p-3">Campground Fund (9%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222]">
              {artistLedgers.map((art) => (
                <tr key={art.id} className="hover:bg-[#1a1a1a]">
                  <td className="p-3 font-bold text-[#e0e0e0] uppercase">{art.artistName}</td>
                  <td className="p-3 text-[#FFD700] font-bold">{art.harmonyNotes} Notes</td>
                  <td className="p-3 text-[#00FF88]">{art.shavings}</td>
                  <td className="p-3 text-[#aaa]">{art.totalEarned} Notes</td>
                  <td className="p-3 text-[#00E5FF]">+{art.splitCommunity} Notes</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

