export type ViewportMode = 
  | 'pointcloud' 
  | 'mesh' 
  | 'pyramid4' 
  | 'anaglyph' 
  | 'projector' 
  | 'depthmap';

export type HologramColorTheme = 
  | 'cyan_neon' 
  | 'matrix_emerald' 
  | 'solar_gold' 
  | 'coronal_magenta' 
  | 'quantum_violet' 
  | 'full_rgb';

export type CameraFilterMode = 
  | 'normal' 
  | 'hologram_edge' 
  | 'thermal_depth' 
  | 'cyber_neon' 
  | 'quantum_lidar' 
  | 'matrix_green';

export interface HologramParameters {
  pointDensity: number; // 50 to 250 (grid density)
  displacementScale: number; // 0.1 to 3.0
  particleSize: number; // 1 to 10
  scanlineSpeed: number; // 0.1 to 5.0
  scanlineDensity: number; // 5 to 50
  flickerIntensity: number; // 0.0 to 1.0
  bloomGlow: number; // 0.2 to 3.0
  colorTheme: HologramColorTheme;
  customColorHex: string;
  wireframeOnly: boolean;
  autoRotate: boolean;
  rotationSpeed: number;
  noiseTurbulence: number;
  laserBeamIntensity: number;
  fresnelPower: number;
  depthInvert: boolean;
  depthThreshold: number; // 0.0 to 1.0 (filter background)
}

export interface CameraSnapshot {
  id: string;
  title: string;
  timestamp: string;
  dataUrl: string;
  width: number;
  height: number;
  depthMapDataUrl?: string;
  normalMapDataUrl?: string;
  aiAnalysis?: Ai3DAnalysis;
}

export interface Ai3DAnalysis {
  objectName: string;
  category: string;
  estimatedDimensions: {
    widthCm: number;
    heightCm: number;
    depthCm: number;
  };
  structuralSummary: string;
  suggestedTheme: HologramColorTheme;
  recommendedDisplacement: number;
  suggestedShaderLogic: string;
  features: string[];
}

export interface ExportManifest {
  assetId: string;
  name: string;
  createdAt: string;
  hologramFormatVersion: string;
  vertexCount: number;
  faceCount: number;
  colorTheme: string;
  suggestedProjectionType: string;
  audioResonanceHz: number;
  files: {
    pointCloudPly: string;
    meshObj: string;
    printStl: string;
    glslShader: string;
    pyramidRender: string;
  };
}
