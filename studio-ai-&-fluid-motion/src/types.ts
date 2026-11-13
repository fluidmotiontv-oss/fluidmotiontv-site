export interface D9ClockState {
  solarTimeStr: string;
  solarMinutes: number;
  d9Hour: number; // 1..26
  hourMinute: number; // 0..53
  isApexWedge: boolean;
  apexType: 'Midday' | 'Midnight' | null;
  apexMinuteElapsed: number; // 0..18
  minutesToNextApex: number;
  is13thTransition: boolean;
}

export interface HarmonyTransaction {
  id: string;
  amount: number;
  type: 'EARNED' | 'REALLOCATED' | 'WITHDRAWN';
  description: string;
  timestamp: string;
  splitCreator: number;   // 90%
  splitCommunity: number; // 9%
  splitVoid: number;      // 1%
}

export interface ArtistLedger {
  id: string;
  artistName: string;
  harmonyNotes: number;
  shavings: number;
  totalEarned: number;
  splitCreator: number;
  splitCommunity: number;
  splitVoid: number;
}

export interface BeatTrack {
  id: string;
  title: string;
  genre: 'Dub / Reggae' | 'Trip-Hop' | 'Funky House';
  bpm: number;
  grid: boolean[][]; // 5 rows x 16 steps
  creator: string;
  createdAt: string;
  dubDelay: boolean;
  swing: number;
}

export interface VectorSticker {
  id: string;
  title: string;
  prompt: string;
  aspectRatio: '1:1' | '9:16';
  svgData?: string;
  colorPalette: string[];
  creator: string;
  priceHarmony: number;
  salesCount: number;
  beachSlangTag: string;
}

export interface ComicPanel {
  id: string;
  panelIndex: number;
  sceneDescription: string;
  dialogue: string;
  speaker: string;
  jewelTag: string;
  isPGFiltered?: boolean;
  durationSec?: number;
  cameraMotion?: string;
  soundCue?: string;
}

export interface ComicStrip {
  id: string;
  title: string;
  panels: ComicPanel[];
  stagedForApex: boolean;
  creator: string;
  createdAt: string;
}

export interface RadioSubmission {
  id: string;
  trackName: string;
  artistName: string;
  bpm: number;
  genre: string;
  status: 'Now Playing' | 'Queued' | 'Broadcasted';
  submittedAt: string;
  harmonyEarned: number;
}

export interface BeachQuest {
  id: string;
  title: string;
  description: string;
  category: 'Surf' | 'Beat' | 'Vector' | 'Eco';
  rewardHarmony: number;
  rewardShavings: number;
  completed: boolean;
  location: string;
}

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  category: 'Vector' | 'Beat' | 'Comic' | 'Radio' | 'Quest';
  rewardHarmony: number;
  rewardShavings: number;
  currentProgress: number;
  targetProgress: number;
  completed: boolean;
  claimed: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  pgFiltered?: boolean;
  filterNotice?: string | null;
}

export interface SurfTelemetry {
  waveHeight: number; // meters
  wavePeriod: number; // seconds
  waveDirection: number; // degrees
  windSpeed: number; // knots
  windDirection: number; // degrees
  temp: number; // celsius
  waterTemp: number; // celsius
  surfScore?: number; // 1-5
  isOffshore?: boolean;
  isLive?: boolean;
  lastUpdated?: string;
}

