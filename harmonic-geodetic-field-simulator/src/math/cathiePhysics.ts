/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GeodeticNode, HarmonicCalculationResult, SimulationParameters } from '../types/harmonics';

// Fundamental physical & geodetic constants
export const PHI = 1.618033988749895; // Golden Ratio
export const PI = Math.PI;
export const EULER = Math.E;

// Cathie Geometric Grid Constants
export const CIRCLE_ARC_MINUTES = 21600; // 360 degrees * 60 minutes
export const EARTH_HARMONIC_RADIUS_NM = 21600 / (2 * Math.PI); // ~3437.74677 nautical miles
export const STANDARD_SECONDS_PER_DAY = 86400; // 24 * 60 * 60
export const CATHIE_GRID_RATIO = 9 / 8; // 9 grid hours per 8 standard hours
export const GRID_SECONDS_PER_DAY = STANDARD_SECONDS_PER_DAY * CATHIE_GRID_RATIO; // 97,200 grid seconds
export const THEORETICAL_MAX_LIGHT_GRID = 144000; // 144,000 nautical miles / grid second (unhindered harmonic vacuum)
export const OBSERVED_LIGHT_GRID_SURFACE = 143795.77; // Earth sea-level gravitational well light speed in nm/grid-sec
export const METERS_PER_NAUTICAL_MILE = 1852; // International standard nautical mile in meters

// Maxwellian physical constants (SI)
export const EPSILON_0 = 8.8541878128e-12; // Farad / meter
export const MU_0 = 1.25663706212e-6; // Henry / meter
export const C_SI_VACUUM = 299792458; // m/s

/**
 * Key historical planetary nodes identified by Captain Bruce Cathie and Becker-Hagens
 */
export const GEODETIC_NODES: GeodeticNode[] = [
  {
    id: 'node-1',
    name: 'Auckland / Pukekohe Nexus',
    latitude: -37.20,
    longitude: 174.90,
    arcMinuteLat: -37.20 * 60,
    arcMinuteLon: 174.90 * 60,
    harmonicFrequency: 144.0,
    description: 'Initial harmonic origin where Bruce Cathie first charted repetitive UAP track lines and radar cross-intersections in 1965.',
    gridSignificance: 'Primary New Zealand harmonic baseline; corresponds to 2160 / 15 harmonic fraction.',
    polyhedronType: 'harmonic_nexus',
    fieldDensityMultiplier: 1.042,
  },
  {
    id: 'node-2',
    name: 'Great Pyramid of Giza',
    latitude: 29.9792,
    longitude: 31.1342,
    arcMinuteLat: 29.9792 * 60,
    arcMinuteLon: 31.1342 * 60,
    harmonicFrequency: 432.0,
    description: 'Geodetic center of Earth landmass. Latitude 29.9792458° aligns with speed of light integer c = 299,792,458 m/s.',
    gridSignificance: 'Global prime meridional node; major vertex of the planetary cuboctahedron/icosahedron matrix.',
    polyhedronType: 'cuboctahedron',
    fieldDensityMultiplier: 1.085,
  },
  {
    id: 'node-3',
    name: 'Bermuda Triangle Vertex',
    latitude: 25.00,
    longitude: -71.00,
    arcMinuteLat: 25.00 * 60,
    arcMinuteLon: -71.00 * 60,
    harmonicFrequency: 288.0,
    description: 'Western Atlantic nodal intersection known for electromagnetic anomalies, compass deviations, and gravitational shear.',
    gridSignificance: 'Octave harmonic double of 144 (144 * 2 = 288). Transverse magnetic vortex intersection.',
    polyhedronType: 'icosahedron',
    fieldDensityMultiplier: 1.120,
  },
  {
    id: 'node-4',
    name: 'Dragons Triangle (Sea of Japan)',
    latitude: 25.00,
    longitude: 137.00,
    arcMinuteLat: 25.00 * 60,
    arcMinuteLon: 137.00 * 60,
    harmonicFrequency: 288.0,
    description: 'Pacific antipode vertex directly reciprocal to the Bermuda Triangle node.',
    gridSignificance: 'Major geometric counterpart creating the bipolar toroidal harmonic loop of the mid-latitudes.',
    polyhedronType: 'icosahedron',
    fieldDensityMultiplier: 1.118,
  },
  {
    id: 'node-5',
    name: 'Stonehenge / Avebury Node',
    latitude: 51.1789,
    longitude: -1.8262,
    arcMinuteLat: 51.1789 * 60,
    arcMinuteLon: -1.8262 * 60,
    harmonicFrequency: 216.0,
    description: 'Megalithic standing stone complex located at geometric latitude ratio (51.84° / 360° circle fraction).',
    gridSignificance: 'Harmonic 216 Nexus (2160 = Moon diameter / precession decade). High electrostatic standing wave field.',
    polyhedronType: 'cuboctahedron',
    fieldDensityMultiplier: 1.065,
  },
  {
    id: 'node-6',
    name: 'Nazca Plateau Geometric Center',
    latitude: -14.73,
    longitude: -75.13,
    arcMinuteLat: -14.73 * 60,
    arcMinuteLon: -75.13 * 60,
    harmonicFrequency: 144.0,
    description: 'Gigantic geometric geoglyphs and radial ray tracks laid out as resonant antenna arrays on crystalline pampas.',
    gridSignificance: 'Harmonic 144 ground wave transducer; connects directly via great circle to Giza and Easter Island.',
    polyhedronType: 'dodecahedron',
    fieldDensityMultiplier: 1.050,
  },
  {
    id: 'node-7',
    name: 'Easter Island (Rapa Nui)',
    latitude: -27.1127,
    longitude: -109.3497,
    arcMinuteLat: -27.1127 * 60,
    arcMinuteLon: -109.3497 * 60,
    harmonicFrequency: 360.0,
    description: 'Isolated Pacific volcanic island with megalithic Moai aligned to magnetic and solstitial grid vectors.',
    gridSignificance: 'Equi-harmonic distance node on the circum-terrestrial megalithic great circle.',
    polyhedronType: 'dodecahedron',
    fieldDensityMultiplier: 1.075,
  },
  {
    id: 'node-8',
    name: 'Mount Kailash / Tibetan Axis',
    latitude: 31.067,
    longitude: 81.312,
    arcMinuteLat: 31.067 * 60,
    arcMinuteLon: 81.312 * 60,
    harmonicFrequency: 576.0,
    description: 'Pyramidal continental peak acting as the primary geophysical harmonic resonator of the Asian landmass.',
    gridSignificance: 'Harmonic 576 (144 * 4). Primary telluric current junction between Siberian and Indian plates.',
    polyhedronType: 'cuboctahedron',
    fieldDensityMultiplier: 1.140,
  },
  {
    id: 'node-9',
    name: 'Tunguska Anomaly Epicenter',
    latitude: 60.917,
    longitude: 101.95,
    arcMinuteLat: 60.917 * 60,
    arcMinuteLon: 101.95 * 60,
    harmonicFrequency: 695.0,
    description: 'Site of the 1908 atmospheric explosion. Corresponds to Cathies harmonic 695 gravitational release node.',
    gridSignificance: 'Theoretical zero-point phase reversal node where telluric grid lines intersected cosmic influx.',
    polyhedronType: 'icosahedron',
    fieldDensityMultiplier: 1.155,
  },
  {
    id: 'node-10',
    name: 'North Geomagnetic Polar Anchor',
    latitude: 86.50,
    longitude: 162.00,
    arcMinuteLat: 86.50 * 60,
    arcMinuteLon: 162.00 * 60,
    harmonicFrequency: 144.0,
    description: 'Topological convergence point for all longitudinal geodetic meridians and magnetic flux lines.',
    gridSignificance: 'Primary axis of rotation for the cuboctahedral grid frame; sets planetary grid second boundary.',
    polyhedronType: 'harmonic_nexus',
    fieldDensityMultiplier: 1.180,
  },
];

/**
 * Calculates Cathie's Mass from light speed c:
 * m = c + sqrt(1 / c)
 */
export function calculateCathieMass(c: number): number {
  if (c <= 0) return 0;
  return c + Math.sqrt(1 / c);
}

/**
 * Calculates Cathie's Unified Field Energy:
 * E = [c + sqrt(1 / c)] * c^2 = c^3 + c^(3/2)
 */
export function calculateCathieEnergy(c: number): number {
  if (c <= 0) return 0;
  const m = calculateCathieMass(c);
  return m * Math.pow(c, 2);
}

/**
 * Computes complete harmonic breakdown based on simulation parameters
 */
export function computeHarmonicPhysics(params: SimulationParameters): HarmonicCalculationResult {
  const standardSecondsPerDay = STANDARD_SECONDS_PER_DAY;
  const gridSecondsPerDay = standardSecondsPerDay * params.gridTimeRatio;
  const gridSecondToStandardSecRatio = 1 / params.gridTimeRatio; // 8 / 9 = 0.888888...

  // Geometric modulation factor
  let modulationFactor = 1.0;
  if (params.harmonicModulation === 'phi') {
    // phi reduction: (1 / phi^exponent)
    modulationFactor = 1 / Math.pow(PHI, params.phiExponent);
  } else if (params.harmonicModulation === 'pi') {
    modulationFactor = 1 / Math.pow(PI / 3, params.phiExponent);
  } else if (params.harmonicModulation === 'euler') {
    modulationFactor = 1 / Math.pow(EULER / 2, params.phiExponent);
  } else if (params.harmonicModulation === 'octave') {
    modulationFactor = Math.pow(0.5, params.phiExponent);
  }

  // Base theoretical unhindered speed of light in grid
  const cTheoreticalGrid = params.baseLightSpeedGrid;

  // Local effective speed of light inside the planetary gravity well:
  // Deceleration caused by local grid density and geometric modulation
  // Earth sea-level ratio is typically 143,795.77 / 144,000 = 0.99858
  const gravitationalAttenuation = (1 - (params.localGravityDensity - 1.0) * 0.0035);
  const cLocalEffectiveGrid = cTheoreticalGrid * modulationFactor * gravitationalAttenuation;

  // Equivalent standard metrics:
  // Convert nautical miles per grid second to meters per standard second:
  // c_m_per_s = c_grid * (1852 meters / nm) / (grid_sec_in_std_sec)
  const gridSecInStdSec = gridSecondToStandardSecRatio;
  const cStandardEquivalentMs = (cLocalEffectiveGrid * METERS_PER_NAUTICAL_MILE) / gridSecInStdSec;
  const cApparentNauticalPerStdSec = cLocalEffectiveGrid / gridSecInStdSec;

  // Cathie Mass & Energy
  // In Cathie's normalized grid harmonics, c is evaluated either directly as grid velocity
  // or as normalized harmonic base (e.g. 144.0 or raw 144,000).
  // We evaluate the normalized base: c_norm = cLocalEffectiveGrid / 1000 for readable floating scales,
  // or raw cLocalEffectiveGrid. We provide rigorous scaled metrics:
  const cHarmonicScale = cLocalEffectiveGrid / 1000; // e.g. 144.0
  const cathieMass = calculateCathieMass(cHarmonicScale);
  const cathieEnergy = calculateCathieEnergy(cHarmonicScale);

  // Einstein comparison (standard E = m0 * c^2 with m0 = 1.0 normalized)
  const einsteinEnergyStandard = Math.pow(cHarmonicScale, 2);

  // Reciprocal gravity: g_harm is inversely proportional to c_local
  // As c_local drops, local field compression and gravitational gradient spike
  const reciprocalGravityHarmonic = 1 / (cLocalEffectiveGrid / THEORETICAL_MAX_LIGHT_GRID);

  // Gravitational refraction index: n = c0 / c_local
  const gravitationalRefractionIndex = THEORETICAL_MAX_LIGHT_GRID / cLocalEffectiveGrid;

  // Phase velocity vs Group velocity in anomalous dispersion at grid nodes:
  // v_phase * v_group = c0^2 -> if v_group decelerates, v_phase accelerates towards infinity
  const vGroup = cLocalEffectiveGrid;
  const phaseDisplacementVelocity = Math.pow(THEORETICAL_MAX_LIGHT_GRID, 2) / Math.max(vGroup, 1);

  // Zero-time potential score (0 to 100%)
  // Measures proximity to node resonance where delta_g -> 0 and v_phase -> infinity
  const nodeResonanceCloseness = Math.abs(cLocalEffectiveGrid - THEORETICAL_MAX_LIGHT_GRID) / THEORETICAL_MAX_LIGHT_GRID;
  const zeroTimePotentialScore = Math.min(100, Math.max(0, (1 - nodeResonanceCloseness * 150) * 100 * (params.localGravityDensity)));

  // Maxwellian Energy Density:
  // u = 1/2 * (epsilon_0 * E^2 + (1/mu_0) * B^2)
  // For a plane harmonic EM field at frequency f:
  const omega = 2 * Math.PI * (params.frequencyCarrierKhz * 1000);
  const characteristicElectricField = 377; // V/m (wave impedance of free space)
  const magneticField = characteristicElectricField / cStandardEquivalentMs;
  const maxwellEnergyDensityJoulesPerM3 = 0.5 * (
    EPSILON_0 * Math.pow(characteristicElectricField, 2) +
    (1 / MU_0) * Math.pow(magneticField, 2)
  );

  // Poynting vector magnitude: S = (E * B) / mu_0 = E^2 / (c * mu_0)
  const poyntingVectorMagnitude = (characteristicElectricField * magneticField) / MU_0;

  // Standing wave wavelength: lambda = 21,600 / n
  // Cathie fundamental octave: n = 150 gives lambda = 144 nautical miles!
  const harmonicOctaveNumber = 150;
  const standingWaveWavelengthNm = CIRCLE_ARC_MINUTES / harmonicOctaveNumber; // 144 nm

  return {
    standardSecondsPerDay,
    gridSecondsPerDay,
    gridSecondToStandardSecRatio,
    cTheoreticalGrid,
    cLocalEffectiveGrid,
    cStandardEquivalentMs,
    cApparentNauticalPerStdSec,
    cathieMass,
    cathieEnergy,
    einsteinEnergyStandard,
    reciprocalGravityHarmonic,
    gravitationalRefractionIndex,
    phaseDisplacementVelocity,
    zeroTimePotentialScore,
    maxwellEnergyDensityJoulesPerM3,
    poyntingVectorMagnitude,
    standingWaveWavelengthNm,
    harmonicOctaveNumber,
  };
}

/**
 * Pre-formatted Python simulation script that users can run or download
 */
export function generatePythonSimulationCode(params: SimulationParameters): string {
  return `#!/usr/bin/env python3
"""
================================================================================
CAPTAIN BRUCE CATHIE HARMONIC UNIFIED FIELD & GEODETIC LATTICE SIMULATION
Mathematical Framework: Geometric Electromagnetism & Variable Light Speed (c)
================================================================================
Author: Theoretical Harmonic Physics Engine
References:
  - Bruce Cathie, "Harmonic 33" (1968)
  - Bruce Cathie, "Harmonic 695" (1971)
  - Bruce Cathie, "The Harmonic Conquest of Space" (1977)
  - Bruce Cathie, "The Energy Grid: Harmonic 695" (1990)
"""

import math
from typing import Dict, Any

# ==========================================
# 1. GEODETIC & HARMONIC GRID CONSTANTS
# ==========================================
CIRCLE_ARC_MINUTES: float = 21600.0          # 360 deg * 60 arc-min (Nautical circumference)
EARTH_RADIUS_NM: float = 21600.0 / (2.0 * math.pi)  # ~3437.74677 nautical miles
STANDARD_SECONDS_DAY: float = 86400.0       # 24 * 60 * 60 standard civil seconds
GRID_RATIO: float = ${params.gridTimeRatio.toFixed(6)}                  # 9/8 ratio = 1.125 (9 grid hours per 8 civil hours)
GRID_SECONDS_DAY: float = STANDARD_SECONDS_DAY * GRID_RATIO  # 97,200 grid seconds / day
GRID_SEC_TO_STD_SEC: float = 1.0 / GRID_RATIO        # 8/9 = 0.888888... standard seconds per grid second

# Fundamental Light Speed Harmonics
C_THEORETICAL_GRID: float = ${params.baseLightSpeedGrid.toFixed(1)}    # 144,000 nautical miles / grid second (Harmonic 144)
METERS_PER_NAUTICAL_MILE: float = 1852.0     # International SI conversion

# Geometric Ratios
PHI: float = 1.618033988749895               # Golden Ratio
PI: float = math.pi

# Maxwellian Electrodynamic Constants (SI)
EPSILON_0: float = 8.8541878128e-12          # Vacuum permittivity (F/m)
MU_0: float = 1.25663706212e-6               # Vacuum permeability (H/m)
Z_0: float = math.sqrt(MU_0 / EPSILON_0)     # Wave impedance of free space (~376.73 Ohms)


# ==========================================
# 2. CATHIE'S UNIFIED FIELD EQUATIONS
# ==========================================
def calculate_cathie_mass(c_harmonic: float) -> float:
    """
    Computes Cathie's Mass Formulation derived from light-speed harmonics:
      m = c + sqrt(1 / c) = c + c^(-0.5)
    
    Physical Interpretation:
      Mass is not an immutable substance, but a standing wave impedance
      resulting from the spatial compression and deceleration of light.
    """
    if c_harmonic <= 0:
        raise ValueError("Light speed harmonic must be positive.")
    return c_harmonic + math.sqrt(1.0 / c_harmonic)


def calculate_cathie_energy(c_harmonic: float) -> float:
    """
    Substitutes Cathie's Mass into Einstein's Mass-Energy Framework (E = mc^2):
      E = [c + sqrt(1 / c)] * c^2
        = c^3 + c^(1.5) = c^3 + sqrt(c^3)
    
    Reveals:
      - Cubic term (c^3): Volumetric geometric resonance of the space-time cell.
      - Fractional term (c^1.5): Topological half-spin electromagnetic phase coupling.
    """
    m = calculate_cathie_mass(c_harmonic)
    return m * (c_harmonic ** 2)


# ==========================================
# 3. HARMONIC GRID SIMULATION ENGINE
# ==========================================
def run_cathie_simulation(
    base_c_grid: float = ${params.baseLightSpeedGrid.toFixed(1)},
    modulation_mode: str = "${params.harmonicModulation}",
    phi_exponent: float = ${params.phiExponent.toFixed(4)},
    local_gravity_density: float = ${params.localGravityDensity.toFixed(4)},
    carrier_freq_khz: float = ${params.frequencyCarrierKhz.toFixed(1)}
) -> Dict[str, Any]:
    """
    Executes a complete harmonic calculation across grid coordinates.
    """
    # 1. Geometric modulation factor (phi, pi, octave)
    if modulation_mode == "phi":
        mod_factor = 1.0 / (PHI ** phi_exponent)
    elif modulation_mode == "pi":
        mod_factor = 1.0 / ((PI / 3.0) ** phi_exponent)
    elif modulation_mode == "octave":
        mod_factor = 0.5 ** phi_exponent
    else:
        mod_factor = 1.0

    # 2. Planetary well attenuation
    # In Earth's gravitational well, speed of light decelerates from 144,000 to ~143,795.77 nm/grid-sec
    gravity_attenuation = 1.0 - (local_gravity_density - 1.0) * 0.0035
    c_local_grid = base_c_grid * mod_factor * gravity_attenuation

    # 3. Conversion to standard SI metrics (m/s)
    # c_si = (c_local_grid * 1852 meters) / (GRID_SEC_TO_STD_SEC seconds)
    c_si_equivalent = (c_local_grid * METERS_PER_NAUTICAL_MILE) / GRID_SEC_TO_STD_SEC

    # 4. Cathie Normalized Harmonic Base (c / 1000 for standard 144 octave)
    c_norm = c_local_grid / 1000.0
    mass_cathie = calculate_cathie_mass(c_norm)
    energy_cathie = calculate_cathie_energy(c_norm)
    einstein_ref = c_norm ** 2  # E0 / m0

    # 5. Gravity and Light Speed Reciprocals
    # g_harmonic is inversely proportional to c_apparent
    g_reciprocal = 1.0 / (c_local_grid / C_THEORETICAL_GRID)
    refraction_index_n = C_THEORETICAL_GRID / c_local_grid

    # Phase velocity in anomalous dispersion: v_p * v_g = c0^2
    v_phase = (C_THEORETICAL_GRID ** 2) / max(c_local_grid, 1.0)

    # Zero-time potential score (anti-gravity nodal decoupling threshold)
    delta_c = abs(c_local_grid - C_THEORETICAL_GRID) / C_THEORETICAL_GRID
    zero_time_score = max(0.0, min(100.0, (1.0 - delta_c * 150.0) * 100.0 * local_gravity_density))

    # 6. Maxwellian Energy Density
    # u_EM = 0.5 * (epsilon_0 * E^2 + (1 / mu_0) * B^2)
    e_field = Z_0  # 376.73 V/m normalized characteristic intensity
    b_field = e_field / c_si_equivalent
    u_maxwell = 0.5 * (EPSILON_0 * (e_field ** 2) + (1.0 / MU_0) * (b_field ** 2))
    poynting_s = (e_field * b_field) / MU_0

    # 7. Resonant standing wave harmonics
    # Standing wave harmonic 150: lambda = 21,600 / 150 = 144 nautical miles
    standing_wave_nm = CIRCLE_ARC_MINUTES / 150.0

    return {
        "c_theoretical_grid_nm_s": C_THEORETICAL_GRID,
        "c_local_effective_grid_nm_s": c_local_grid,
        "c_standard_equivalent_m_s": c_si_equivalent,
        "cathie_mass_harmonic": mass_cathie,
        "cathie_energy_unified": energy_cathie,
        "einstein_ref_energy": einstein_ref,
        "reciprocal_gravity_ratio": g_reciprocal,
        "gravitational_refraction_n": refraction_index_n,
        "phase_velocity_nm_s": v_phase,
        "zero_time_score_pct": zero_time_score,
        "maxwell_energy_density_j_m3": u_maxwell,
        "poynting_vector_w_m2": poynting_s,
        "standing_wave_wavelength_nm": standing_wave_nm,
    }


# ==========================================
# 4. EXECUTION & REPORTING
# ==========================================
if __name__ == "__main__":
    print("=" * 76)
    print("CAPTAIN BRUCE CATHIE - HARMONIC GEODETIC UNIFIED FIELD ANALYSIS")
    print("=" * 76)
    
    results = run_cathie_simulation()
    
    print(f"Planetary Circumference     : {CIRCLE_ARC_MINUTES:,.1f} arc-minutes (nautical miles)")
    print(f"Grid Time Conversion       : 86,400 std s -> {GRID_SECONDS_DAY:,.1f} grid s/day (Ratio 9/8)")
    print(f"Theoretical Light Speed c0  : {results['c_theoretical_grid_nm_s']:,.2f} nm/grid-sec (Harmonic 144)")
    print(f"Local Effective Light Speed : {results['c_local_effective_grid_nm_s']:,.2f} nm/grid-sec")
    print(f"SI Equivalent Velocity c    : {results['c_standard_equivalent_m_s']:,.2f} m/s")
    print("-" * 76)
    print("CATHIE UNIFIED FIELD EQUATION: E = [c + sqrt(1/c)] * c^2 = c^3 + c^1.5")
    print(f"  Normalized Harmonic c     : {results['c_local_effective_grid_nm_s'] / 1000.0:.4f}")
    print(f"  Cathie Mass m             : {results['cathie_mass_harmonic']:.6f} harmonic mass units")
    print(f"  Harmonic Unified Energy E : {results['cathie_energy_unified']:,.4f} harmonic units")
    print(f"  Einstein Standard E0      : {results['einstein_ref_energy']:,.4f} (m0=1)")
    print("-" * 76)
    print("GRAVITATIONAL RECIPROCALS & NODE DISPLACEMENT:")
    print(f"  Reciprocal Gravity Index  : {results['reciprocal_gravity_ratio']:.6f}")
    print(f"  Gravitational Index (n)   : {results['gravitational_refraction_n']:.6f}")
    print(f"  Anomalous Phase Velocity  : {results['phase_velocity_nm_s']:,.2f} nm/grid-sec")
    print(f"  Zero-Time Coherence Score : {results['zero_time_score_pct']:.2f}%")
    print("-" * 76)
    print("MAXWELLIAN WAVE COUPLING:")
    print(f"  Energy Density u_EM       : {results['maxwell_energy_density_j_m3']:.6e} J/m^3")
    print(f"  Poynting Vector Magnitude : {results['poynting_vector_w_m2']:.4f} W/m^2")
    print(f"  Resonant Standing Wave    : {results['standing_wave_wavelength_nm']:.2f} nautical miles")
    print("=" * 76)
`;
}
