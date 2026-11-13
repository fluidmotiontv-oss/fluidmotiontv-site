/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface GeodeticNode {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  arcMinuteLat: number; // minutes from equator
  arcMinuteLon: number; // minutes from prime meridian
  harmonicFrequency: number; // in Hz or harmonic unit
  description: string;
  gridSignificance: string;
  polyhedronType: 'cuboctahedron' | 'icosahedron' | 'dodecahedron' | 'harmonic_nexus';
  fieldDensityMultiplier: number;
}

export interface SimulationParameters {
  baseLightSpeedGrid: number; // default 144,000 nm/grid-sec
  harmonicModulation: 'phi' | 'pi' | 'euler' | 'none' | 'octave';
  phiExponent: number; // n in phi^n
  gridTimeRatio: number; // default 9/8 = 1.125
  planetaryRadiusNm: number; // default 3437.74677 nm (21600 / 2pi)
  localGravityDensity: number; // 0.8 to 1.5
  frequencyCarrierKhz: number; // carrier frequency in kHz
  resonanceCavityRadiusNm: number; // local cavity size
}

export interface HarmonicCalculationResult {
  // Conversions
  standardSecondsPerDay: number;
  gridSecondsPerDay: number;
  gridSecondToStandardSecRatio: number;
  
  // Light speed values
  cTheoreticalGrid: number; // 144,000
  cLocalEffectiveGrid: number; // adjusted for gravity well & geometry
  cStandardEquivalentMs: number; // equivalent m/s
  cApparentNauticalPerStdSec: number;
  
  // Cathie Equations
  cathieMass: number; // m = c + sqrt(1/c)
  cathieEnergy: number; // E = [c + sqrt(1/c)] * c^2 = c^3 + c^1.5
  einsteinEnergyStandard: number; // for comparison (arbitrary standard units)
  
  // Gravity & Wave Reciprocals
  reciprocalGravityHarmonic: number; // g_harm ~ 1 / c_local
  gravitationalRefractionIndex: number; // n = c0 / c_local
  phaseDisplacementVelocity: number; // v_phase = c0^2 / v_group
  zeroTimePotentialScore: number; // percentage index of zero-inertial condition
  
  // Maxwellian Wave & Energy Density
  maxwellEnergyDensityJoulesPerM3: number; // u = 1/2(eps0 E^2 + B^2/mu0)
  poyntingVectorMagnitude: number; // S = |E x B| / mu0
  standingWaveWavelengthNm: number; // lambda = 21,600 / n
  harmonicOctaveNumber: number;
}
