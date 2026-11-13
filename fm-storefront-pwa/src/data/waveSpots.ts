import { WaveSpotPreset, WaveTelemetry, WaveDirection } from '../types/wave';

export const WAVE_SPOTS: WaveSpotPreset[] = [
  {
    id: 'teahupoo',
    name: "Teahupo'o",
    location: 'Tahiti, French Polynesia',
    direction: 'left',
    defaultHeightFt: 18,
    minHeightFt: 6,
    maxHeightFt: 30,
    periodSeconds: 17,
    reefDepthM: 1.8,
    reefType: 'Sub-surface Live Coral Shelf (Below Sea Level Drawdown)',
    description: 'The heaviest wave on Earth. Deep ocean swell surges out of a 300-meter abyss and unloads instantly onto a knife-edge barrier reef, sucking dry water from below sea level into a massive square cylinder.',
    hydrodynamicNotes: 'Extreme shoaling ratio (H/d > 1.2). The seabed gradient triggers instantaneous hydraulic folding where crest celerity exceeds 32 knots, compressing internal air pockets into an explosive supersonic spit.',
    colorScheme: {
      gridColor: '#00f0ff',
      lipColor: '#38bdf8',
      waterEmissive: '#0369a1'
    }
  },
  {
    id: 'cloudbreak',
    name: 'Cloudbreak',
    location: 'Tavarua Island, Fiji',
    direction: 'left',
    defaultHeightFt: 12,
    minHeightFt: 4,
    maxHeightFt: 22,
    periodSeconds: 16,
    reefDepthM: 2.6,
    reefType: 'Tiered Outer Barrier Reef (Shish-Kebab Sections)',
    description: 'A majestic multi-section freight-train left-hander breaking 3 miles off the Fijian coast. Known for high-speed open-ocean barrel cylinders that bend 180 degrees along the contour of the reef ledge.',
    hydrodynamicNotes: 'Refraction around the outer reef pass bends wavefronts by 28°, concentrating kinetic energy into a smooth continuous vortex tube with high laminar flow stability.',
    colorScheme: {
      gridColor: '#10b981',
      lipColor: '#34d399',
      waterEmissive: '#047857'
    }
  },
  {
    id: 'pipeline',
    name: 'Banzai Pipeline',
    location: 'North Shore, Oahu, Hawaii',
    direction: 'left',
    defaultHeightFt: 14,
    minHeightFt: 4,
    maxHeightFt: 24,
    periodSeconds: 15,
    reefDepthM: 2.2,
    reefType: 'Shallow Volcanic Cavern Ledge (First Reef)',
    description: 'The global benchmark for heavy tube-riding. Fast-moving Pacific groundswells strike underwater lava fingers, throwing an immense pitching lip over a hollow cavernous barrel.',
    hydrodynamicNotes: 'Lava shelf ridges create localized venturi acceleration, elevating peak crest velocity by 18% over ambient swell speed.',
    colorScheme: {
      gridColor: '#c084fc',
      lipColor: '#e879f9',
      waterEmissive: '#7e22ce'
    }
  },
  {
    id: 'shark-island',
    name: 'Shark Island',
    location: 'Cronulla, Sydney, Australia',
    direction: 'right',
    defaultHeightFt: 8,
    minHeightFt: 3,
    maxHeightFt: 16,
    periodSeconds: 14,
    reefDepthM: 1.5,
    reefType: 'Exposed Shallow Sandstone Reef Platform',
    description: 'Australia’s most notorious mutating right-hand slab. A vicious, warping ledge that surges over an uneven rock table, famous for radical steps, surges, and violent pitching barrels.',
    hydrodynamicNotes: 'Mutating backwash harmonics generate unpredictable step-ledges on the wave face, creating rapid vorticity oscillation and chaotic hydraulic shockwaves.',
    colorScheme: {
      gridColor: '#f59e0b',
      lipColor: '#fbbf24',
      waterEmissive: '#b45309'
    }
  },
  {
    id: 'kids-grommet',
    name: 'Grommet Bay (Kids & Beginners)',
    location: 'Calm Tropical Sandbar Lagoon',
    direction: 'left',
    defaultHeightFt: 2.5,
    minHeightFt: 1.5,
    maxHeightFt: 4.5,
    periodSeconds: 10,
    reefDepthM: 3.2,
    reefType: 'Soft Gentle Sloping Sandy Beach Bottom',
    description: 'A smooth, friendly waist-high wave for kids and beginners. Long, peeling turquoise wall with an easy forgiving shoulder, perfect for exploring fluid dynamics without the heavy wipeouts!',
    hydrodynamicNotes: 'Gentle bathymetric slope (1:30) produces spilling breaker dissipation with low energy transfer, ideal for observing clean linear wave theory and orbital water particle motion.',
    colorScheme: {
      gridColor: '#38bdf8',
      lipColor: '#67e8f9',
      waterEmissive: '#0284c7'
    }
  }
];

export function calculateWaveTelemetry(
  heightFt: number,
  spot: WaveSpotPreset,
  direction: WaveDirection
): WaveTelemetry {
  const heightM = heightFt * 0.3048;
  const g = 9.80665;
  const rho = 1025; // seawater density kg/m^3
  
  // Breaker depth: approximately d = H / 0.78 (McCowan breaker criterion) adjusted for reef steepness
  const reefFactor = spot.id === 'teahupoo' ? 0.95 : spot.id === 'kids-grommet' ? 0.65 : 0.78;
  const breakerDepthM = Math.max(0.8, heightM / reefFactor);

  // Shoaling index H / d
  const shoalingIndex = +(heightM / breakerDepthM).toFixed(2);

  // Shallow water celerity c = sqrt(g * d)
  const celerityMs = Math.sqrt(g * breakerDepthM);
  const celerityKnots = +(celerityMs * 1.94384).toFixed(1);
  const celerityKmh = +(celerityMs * 3.6).toFixed(1);

  // Hydrodynamic Energy Density: E = 1/8 * rho * g * H^2 (in kJ/m^2)
  const energyJoules = (1 / 8) * rho * g * Math.pow(heightM, 2);
  const energyDensityKjM2 = +(energyJoules / 1000).toFixed(1);

  // Vorticity / Curvature kappa ~ 2 * pi / wavelength or lip curl radius
  const curlRadius = Math.max(0.5, heightM * 0.45);
  const vorticityRadM = +(1 / curlRadius).toFixed(2);

  // Hydraulic barrel spit pressure (psi) scaled by height and energy
  const spitPressurePsi = +(2.5 + Math.pow(heightM, 1.4) * 1.8).toFixed(1);

  return {
    faceHeightFt: +heightFt.toFixed(1),
    faceHeightM: +heightM.toFixed(2),
    swellPeriod: spot.periodSeconds,
    breakerDepthM: +breakerDepthM.toFixed(2),
    shoalingIndex,
    celerityKnots,
    celerityKmh,
    energyDensityKjM2,
    vorticityRadM,
    spitPressurePsi
  };
}
