export type LightingPresetId = 
  | 'holographic-blue' 
  | 'deep-space-purple' 
  | 'neon-amber' 
  | 'emerald-matrix' 
  | 'crimson-overdrive';

export interface LightingPreset {
  id: LightingPresetId;
  name: string;
  tagline: string;
  tempLabel: string;
  colorTemp: string;
  accentHex: string;
  badgeClass: string;
  dotColor: string;
  // Three.js Light properties
  ambientColor: string;
  ambientIntensity: number;
  keyLightColor: string;
  keyLightIntensity: number;
  fillLightColor: string;
  fillLightIntensity: number;
  centerGlowColor: string;
  centerGlowIntensity: number;
  gridColor: string;
  gridSubColor: string;
  bgBaseColor: string;
  fogColor: string;
  sunColor: string;
  sunRingColor: string;
  exposure: number;
}

export const LIGHTING_PRESETS: Record<LightingPresetId, LightingPreset> = {
  'holographic-blue': {
    id: 'holographic-blue',
    name: 'Holographic Blue',
    tagline: 'Cool cyan, electric teal & arctic luminance',
    tempLabel: 'Cool Arctic',
    colorTemp: '8500K',
    accentHex: '#00f0ff',
    badgeClass: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    dotColor: '#00f0ff',
    ambientColor: '#0f172a',
    ambientIntensity: 2.0,
    keyLightColor: '#cffafe',
    keyLightIntensity: 2.6,
    fillLightColor: '#0284c7',
    fillLightIntensity: 1.8,
    centerGlowColor: '#00f0ff',
    centerGlowIntensity: 2.2,
    gridColor: '#00f0ff',
    gridSubColor: '#0f172a',
    bgBaseColor: '#020611',
    fogColor: '#020611',
    sunColor: '#ec4899',
    sunRingColor: '#f59e0b',
    exposure: 1.25
  },
  'deep-space-purple': {
    id: 'deep-space-purple',
    name: 'Deep Space Purple',
    tagline: 'Cosmic ultraviolet, rich violet & synthwave neon',
    tempLabel: 'Ultraviolet',
    colorTemp: 'UV Void',
    accentHex: '#c084fc',
    badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    dotColor: '#c084fc',
    ambientColor: '#1a0b2e',
    ambientIntensity: 2.2,
    keyLightColor: '#f3e8ff',
    keyLightIntensity: 2.8,
    fillLightColor: '#7e22ce',
    fillLightIntensity: 2.0,
    centerGlowColor: '#c084fc',
    centerGlowIntensity: 2.5,
    gridColor: '#a855f7',
    gridSubColor: '#1e0a38',
    bgBaseColor: '#080112',
    fogColor: '#080112',
    sunColor: '#f43f5e',
    sunRingColor: '#a855f7',
    exposure: 1.30
  },
  'neon-amber': {
    id: 'neon-amber',
    name: 'Neon Amber',
    tagline: 'Warm solar gold, molten brass & high-energy amber',
    tempLabel: 'Warm Solar',
    colorTemp: '3200K',
    accentHex: '#f59e0b',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    dotColor: '#f59e0b',
    ambientColor: '#271202',
    ambientIntensity: 2.2,
    keyLightColor: '#fef3c7',
    keyLightIntensity: 2.9,
    fillLightColor: '#d97706',
    fillLightIntensity: 2.2,
    centerGlowColor: '#f59e0b',
    centerGlowIntensity: 2.6,
    gridColor: '#f59e0b',
    gridSubColor: '#261203',
    bgBaseColor: '#120801',
    fogColor: '#120801',
    sunColor: '#fbbf24',
    sunRingColor: '#ea580c',
    exposure: 1.32
  },
  'emerald-matrix': {
    id: 'emerald-matrix',
    name: 'Emerald Matrix',
    tagline: 'Bioluminescent jade, cyber emerald & toxic lime glow',
    tempLabel: 'Bio-Jade',
    colorTemp: '5200K',
    accentHex: '#10b981',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    dotColor: '#10b981',
    ambientColor: '#031f13',
    ambientIntensity: 2.0,
    keyLightColor: '#d1fae5',
    keyLightIntensity: 2.7,
    fillLightColor: '#059669',
    fillLightIntensity: 2.0,
    centerGlowColor: '#10b981',
    centerGlowIntensity: 2.4,
    gridColor: '#10b981',
    gridSubColor: '#062819',
    bgBaseColor: '#011009',
    fogColor: '#011009',
    sunColor: '#34d399',
    sunRingColor: '#10b981',
    exposure: 1.26
  },
  'crimson-overdrive': {
    id: 'crimson-overdrive',
    name: 'Crimson Overdrive',
    tagline: 'High-octane scarlet, ruby laser & dark synth aggression',
    tempLabel: 'Laser Red',
    colorTemp: '2400K',
    accentHex: '#f43f5e',
    badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    dotColor: '#f43f5e',
    ambientColor: '#260408',
    ambientIntensity: 2.1,
    keyLightColor: '#ffe4e6',
    keyLightIntensity: 2.8,
    fillLightColor: '#e11d48',
    fillLightIntensity: 2.1,
    centerGlowColor: '#f43f5e',
    centerGlowIntensity: 2.5,
    gridColor: '#f43f5e',
    gridSubColor: '#280509',
    bgBaseColor: '#140205',
    fogColor: '#140205',
    sunColor: '#f43f5e',
    sunRingColor: '#fb7185',
    exposure: 1.30
  }
};

export const PRESET_ORDER: LightingPresetId[] = [
  'holographic-blue',
  'deep-space-purple',
  'neon-amber',
  'emerald-matrix',
  'crimson-overdrive'
];
