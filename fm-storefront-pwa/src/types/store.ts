export type CameraViewMode = 'doorway' | 'overview' | 'tier1' | 'tier2' | 'tier3' | 'aquarium' | 'horizon' | 'wave';

export interface AudioReactiveData {
  bass: number; // 0.0 - 1.0 (sub-bass / kick)
  mid: number;  // 0.0 - 1.0 (melodic synth / mids)
  high: number; // 0.0 - 1.0 (hi-hats / shimmer)
  rawLevel: number; // 0.0 - 1.0 (overall rms/peak)
}

export interface TierItem {
  id: 'tier1' | 'tier2' | 'tier3';
  name: string;
  shortTitle: string;
  tagline: string;
  price: number;
  originalPrice: number;
  highlight: string;
  accentColor: string; // hex
  glowColor: string; // rgba
  coverImage: string;
  pagesCount: number;
  readTime: string;
  format: string;
  deliverables: string[];
  keyTopics: string[];
  threePosition: [number, number, number]; // x, y, z
}

export interface OrderState {
  orderId: string;
  amount: number;
  itemName: string;
  customerEmail?: string;
  downloadToken?: string;
  completedAt?: string;
  downloadUrl?: string;
}

export interface RadioStation {
  id: string;
  title: string;
  genre: string;
  bpm: number;
  description: string;
}

export type { LightingPresetId } from '../data/lightingPresets';

