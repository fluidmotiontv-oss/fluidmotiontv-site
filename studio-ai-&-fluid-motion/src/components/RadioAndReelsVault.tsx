import React, { useState } from 'react';
import { Radio, Disc, FolderGit2, Play, Pause, Coins, Music, Film, Check, ExternalLink } from 'lucide-react';
import { RadioSubmission } from '../types';

interface RadioAndReelsVaultProps {
  onEarnHarmony: (amount: number, desc: string) => void;
}

export const RadioAndReelsVault: React.FC<RadioAndReelsVaultProps> = ({ onEarnHarmony }) => {
  const [nowPlayingId, setNowPlayingId] = useState<string>('rad-1');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const [submissions] = useState<RadioSubmission[]>([
    { id: 'rad-1', trackName: 'Port Waikato Sunset Dub', artistName: 'Aroha (Coastal Beats)', bpm: 82, genre: 'Dub / Reggae', status: 'Now Playing', submittedAt: 'D9-H12 (11:14 AM)', harmonyEarned: 150 },
    { id: 'rad-2', trackName: 'Pee Dub Point Break Trip-Hop', artistName: 'Kai (Pee Dub Shredder)', bpm: 94, genre: 'Trip-Hop', status: 'Queued', submittedAt: 'D9-H14 (01:22 PM)', harmonyEarned: 120 },
    { id: 'rad-3', trackName: 'Campground Fire Funky House', artistName: 'Campground Crew', bpm: 122, genre: 'Funky House', status: 'Queued', submittedAt: 'D9-H16 (03:10 PM)', harmonyEarned: 200 }
  ]);

  const [albums] = useState([
    { id: 'alb-1', title: 'Sovereign Surf Sessions Vol. 1', artist: 'Pee Dub Collective', tracksCount: 8, bpmRange: '78-124 BPM', priceHarmony: 150, sales: 42, coverTheme: 'Sunset Barrel' },
    { id: 'alb-2', title: 'Dragon 9 Apex Echoes', artist: 'Aroha & Friends', tracksCount: 6, bpmRange: '80-95 BPM', priceHarmony: 120, sales: 29, coverTheme: 'Vector Waveform' }
  ]);

  const crewAssets = [
    { name: 'kai_peedub_barrel_4k.mp4', folder: '/assets/crew/', size: '420 MB', type: 'Video Raw' },
    { name: 'aroha_dub_stems_master.wav', folder: '/assets/crew/', size: '180 MB', type: 'Audio Stems' },
    { name: 'sunset_point_reel_stage.kdenlive', folder: '/assets/reels/', size: '12 MB', type: 'Kdenlive Project' },
    { name: 'campground_jam_session.ardour', folder: '/assets/reels/', size: '24 MB', type: 'Ardour Session' }
  ];

  const togglePlayTrack = (id: string) => {
    if (nowPlayingId === id) {
      setIsPlaying(!isPlaying);
    } else {
      setNowPlayingId(id);
      setIsPlaying(true);
    }
  };

  return (
    <div className="space-y-6 text-[#e0e0e0]">
      {/* Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111] border-l-4 border-[#F27D26] border-y border-r border-[#333] p-5">
        <div>
          <h2 className="text-xl font-black italic uppercase tracking-tight text-[#e0e0e0] flex items-center gap-2">
            <Radio className="w-6 h-6 text-[#00E5FF]" />
            24/7 Port Waikato Radio & Crew Reels Vault
          </h2>
          <p className="text-xs font-mono opacity-60 uppercase tracking-wider mt-1">
            STREAM COMMUNITY RADIO QUEUE (`/radio/`), PURCHASE ALBUMS, AND STAGE MEDIA FOR KDENLIVE & ARDOUR.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#050505] border border-[#333] px-3.5 py-2 text-xs font-mono font-bold text-[#00FF88] uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-[#00FF88] animate-ping inline-block" />
          <span>Live Broadcast Active</span>
        </div>
      </div>

      {/* Radio Queue Player Workbench */}
      <div className="bg-[#111] border border-[#333] p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[#333] pb-3">
          <h3 className="font-black italic text-sm text-[#e0e0e0] uppercase flex items-center gap-2 tracking-wider">
            <Radio className="w-4 h-4 text-[#00E5FF]" />
            Live Radio Queue (`radio_submissions.json`)
          </h3>
          <span className="text-xs font-mono text-[#888] uppercase">Triage Buffer Active</span>
        </div>

        <div className="space-y-2.5">
          {submissions.map((sub) => {
            const isCurrent = nowPlayingId === sub.id;
            const isTrackPlaying = isCurrent && isPlaying;

            return (
              <div
                key={sub.id}
                className={`p-4 border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                  isCurrent
                    ? 'bg-[#050505] border-[#F27D26]'
                    : 'bg-[#050505] border-[#333] text-[#aaa] hover:border-[#444]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => togglePlayTrack(sub.id)}
                    className={`w-10 h-10 border flex items-center justify-center font-bold transition-all shrink-0 ${
                      isTrackPlaying
                        ? 'bg-[#FFD700] text-black border-[#FFD700]'
                        : 'bg-[#F27D26] hover:bg-[#ff8a38] text-black border-[#F27D26]'
                    }`}
                  >
                    {isTrackPlaying ? <Pause className="w-5 h-5 text-black" /> : <Play className="w-5 h-5 ml-0.5 text-black" />}
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-[#e0e0e0] text-sm uppercase font-mono">{sub.trackName}</h4>
                      {sub.status === 'Now Playing' && (
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-[#00FF88] text-black font-black border border-[#00FF88]">
                          Now Playing
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-mono text-[#888] uppercase mt-0.5">
                      By {sub.artistName} • {sub.bpm} BPM • {sub.genre}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono text-[#888] self-end sm:self-auto">
                  <span>{sub.submittedAt}</span>
                  <span className="text-[#FFD700] font-bold flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5 text-[#FFD700]" />
                    +{sub.harmonyEarned}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Registered Albums & Media Vault Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Registered Albums Catalog */}
        <div className="bg-[#111] border border-[#333] p-5 space-y-4">
          <h3 className="font-black italic text-sm text-[#e0e0e0] uppercase flex items-center gap-2 border-b border-[#333] pb-3 tracking-wider">
            <Disc className="w-4 h-4 text-[#FFD700]" />
            Registered Albums Shop Catalog (`registered_albums.json`)
          </h3>

          <div className="space-y-3">
            {albums.map((alb) => (
              <div
                key={alb.id}
                className="bg-[#050505] p-4 border border-[#333] flex items-center justify-between gap-4 font-mono"
              >
                <div>
                  <h4 className="font-bold text-[#e0e0e0] text-sm uppercase">{alb.title}</h4>
                  <p className="text-xs text-[#888] uppercase">By {alb.artist} • {alb.tracksCount} Tracks</p>
                  <span className="text-[10px] text-[#00E5FF] font-bold uppercase mt-1 inline-block">{alb.bpmRange}</span>
                </div>

                <div className="text-right">
                  <div className="text-[#FFD700] font-bold text-sm mb-1">{alb.priceHarmony} Harmony</div>
                  <button
                    onClick={() => onEarnHarmony(0, `Supported album ${alb.title}`)}
                    className="px-3 py-1.5 bg-[#F27D26] hover:bg-[#ff8a38] text-black font-black uppercase text-xs border border-[#F27D26]"
                  >
                    Support Album
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Crew Media Vault & Reels Stager */}
        <div className="bg-[#111] border border-[#333] p-5 space-y-4">
          <h3 className="font-black italic text-sm text-[#e0e0e0] uppercase flex items-center gap-2 border-b border-[#333] pb-3 tracking-wider">
            <FolderGit2 className="w-4 h-4 text-[#00E5FF]" />
            Crew Vault & Reels Stager (`/assets/crew/`, `/assets/reels/`)
          </h3>

          <div className="space-y-2.5">
            {crewAssets.map((asset, idx) => (
              <div
                key={idx}
                className="bg-[#050505] p-3 border border-[#333] flex items-center justify-between text-xs font-mono"
              >
                <div className="flex items-center gap-2.5">
                  <Film className="w-4 h-4 text-[#00E5FF]" />
                  <div>
                    <div className="font-bold text-[#e0e0e0]">{asset.name}</div>
                    <div className="text-[10px] text-[#888] uppercase">{asset.folder} • {asset.type}</div>
                  </div>
                </div>

                <span className="text-[#888] text-[11px]">{asset.size}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

