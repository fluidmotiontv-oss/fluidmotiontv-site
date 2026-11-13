export type WaveDirection = 'left' | 'right';
export type WaveCameraAngle = 'gantry' | 'barrel' | 'shoulder';

export interface WaveSpotPreset {
  id: string;
  name: string;
  location: string;
  direction: WaveDirection;
  defaultHeightFt: number; // in feet (e.g. 2.5, 8, 12, 22)
  minHeightFt: number;
  maxHeightFt: number;
  periodSeconds: number; // swell period in seconds
  reefDepthM: number; // depth at reef ledge in meters
  reefType: string;
  description: string;
  hydrodynamicNotes: string;
  colorScheme: {
    gridColor: string;
    lipColor: string;
    waterEmissive: string;
  };
}

export interface WaveTelemetry {
  faceHeightFt: number;
  faceHeightM: number;
  swellPeriod: number;
  breakerDepthM: number;
  shoalingIndex: number; // H / d
  celerityKnots: number; // wave speed c = sqrt(g * d)
  celerityKmh: number;
  energyDensityKjM2: number; // E = 1/8 * rho * g * H^2
  vorticityRadM: number;
  spitPressurePsi: number;
}
