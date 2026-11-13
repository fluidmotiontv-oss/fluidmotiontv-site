/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Compass, Atom, Orbit, Activity } from 'lucide-react';

export const TheoreticalTreatise: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'geodetic' | 'unified' | 'reciprocals' | 'maxwellian'>('geodetic');

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      {/* Tab Navigation */}
      <div className="flex border-b border-slate-800 bg-slate-950/80 px-4 py-2 gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('geodetic')}
          className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'geodetic'
              ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>1. The Geodetic / Grid Base</span>
        </button>

        <button
          onClick={() => setActiveTab('unified')}
          className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'unified'
              ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Atom className="w-3.5 h-3.5" />
          <span>2. Unified Field & Mass Equations</span>
        </button>

        <button
          onClick={() => setActiveTab('reciprocals')}
          className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'reciprocals'
              ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Orbit className="w-3.5 h-3.5" />
          <span>3. Gravity & Light Speed Reciprocals</span>
        </button>

        <button
          onClick={() => setActiveTab('maxwellian')}
          className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'maxwellian'
              ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>4. Maxwellian Energy Density & Waves</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="p-6 text-slate-300 leading-relaxed space-y-6 max-h-[640px] overflow-y-auto">
        {/* SECTION 1: THE GEODETIC/GRID BASE */}
        {activeTab === 'geodetic' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">Section 1.0</span>
              <h2 className="text-xl font-bold text-white mt-1">
                The Geodetic Harmonic Matrix & Geometric Space-Time Continuum
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Foundational principles of Captain Bruce Cathie&apos;s planetary lattice, the 21,600 arc-minute circle, and grid time.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                <div className="text-xs font-mono text-cyan-400 uppercase">Geometric Topology</div>
                <div className="text-base font-semibold text-white mt-1">The Interlocking Polyhedral Grid</div>
                <p className="text-xs text-slate-400 mt-2 leading-normal">
                  In Cathie&apos;s seminal treatises (<em>Harmonic 33</em>, <em>Harmonic 695</em>, <em>The Energy Grid</em>),
                  the planetary geosphere is encapsulated in two concentric, interlocking polyhedral wave matrices:
                  the <strong>24-edge Cuboctahedron (Vector Equilibrium)</strong> and the <strong>120-polytope / Icosa-Dodecahedron dual lattice</strong>.
                  Space-time is not a continuous, featureless vacuum; it is a quantized crystalline standing-wave medium.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                <div className="text-xs font-mono text-cyan-400 uppercase">Space-Time Nodal Regulation</div>
                <div className="text-base font-semibold text-white mt-1">Electromagnetic-Gravitational Junctions</div>
                <p className="text-xs text-slate-400 mt-2 leading-normal">
                  The vertices, edge intersections, and face centroids of this geometric lattice constitute <strong>geodetic nodes</strong>.
                  These nodes serve as resonant cavity junctions that regulate local permittivity (ε), permeability (μ),
                  and the coupling coefficient between the electromagnetic Poynting vector and the local gravitational gradient.
                </p>
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-5 space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-cyan-300 font-mono">
                The Geometric Arc-Minute Circle (21,600′) & Nautical Coordinates
              </h3>
              <p className="text-sm text-slate-300">
                Cathie demonstrated that terrestrial navigation units are not arbitrary human conventions, but reflect
                the intrinsic harmonic geometry of the planet:
              </p>
              
              <div className="bg-slate-900 border border-slate-800 rounded p-4 font-mono text-xs text-slate-200 space-y-2">
                <div className="text-cyan-400 font-bold">// Terrestrial Angular Circumference:</div>
                <div>C = 360° × 60 arc-minutes/degree = 21,600 arc-minutes (nautical miles)</div>
                <div className="pt-2 text-cyan-400 font-bold">// Planetary Radius in Geometric Units:</div>
                <div>R_earth = 21,600 / (2π) ≈ 3,437.74677 nautical miles</div>
                <div className="pt-2 text-cyan-400 font-bold">// Fundamental Octave Subdivision:</div>
                <div>21,600 / 150 = 144.0 nautical miles (Harmonic 144 wavelength)</div>
                <div>21,600 / 50  = 432.0 nautical miles (Harmonic 432 Great Pyramid base)</div>
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-5 space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-cyan-300 font-mono">
                Grid Seconds & The 8:9 Diurnal Harmonic Ratio
              </h3>
              <p className="text-sm text-slate-300">
                Civil time measures 1 solar rotation as 24 hours × 3600 seconds = <strong>86,400 standard seconds</strong>.
                Cathie recognized that for electromagnetic wave mechanics to integrate harmonically with the 21,600-mile circle,
                the diurnal cycle must be parsed in <strong>grid time</strong> based on a <strong>9:8 octave transposition</strong>:
              </p>

              <div className="bg-slate-900 border border-slate-800 rounded p-4 font-mono text-xs text-slate-200 space-y-2">
                <div>Standard Solar Day   : 86,400 civil seconds</div>
                <div>Harmonic Grid Ratio   : 9 / 8 = 1.125 (9 grid hours per 8 standard hours)</div>
                <div className="text-emerald-400 font-bold">Grid Seconds / Day    : 86,400 × (9/8) = 97,200 grid seconds</div>
                <div>Grid Second Duration  : 1 grid sec = 8/9 standard seconds = 0.888888... civil sec</div>
              </div>

              <div className="p-4 bg-cyan-950/20 border border-cyan-800/40 rounded-lg text-xs leading-relaxed">
                <span className="font-semibold text-cyan-300">Derivation of Light Speed (c = 144,000):</span> In standard SI units,
                the speed of light in vacuum is c ≈ 299,792,458 m/s. Converted to nautical miles (1 nm = 1,852 m),
                c ≈ 161,874.98 nm/std-sec. When transformed into <em>grid seconds</em> (1 grid-sec = 8/9 std-sec):
                <div className="font-mono text-cyan-200 text-sm mt-1">
                  c_grid = 161,874.98 × (8/9) ≈ 143,888.87 nautical miles / grid second
                </div>
                Cathie noted that outside Earth&apos;s gravitational well (at infinite harmonic potential), the unhindered velocity is
                exactly <strong>144,000 nautical miles per grid second</strong> (144 = 12², the 12th Fibonacci number).
                The difference between 144,000 and 143,795.77 is precisely the <em>gravitational index of refraction</em> (n_g) of the Earth&apos;s mass well.
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: CATHIE'S UNIFIED FIELD & MASS EQUATIONS */}
        {activeTab === 'unified' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">Section 2.0</span>
              <h2 className="text-xl font-bold text-white mt-1">
                Harmonic Unified Field & Alternative Mass Formulation
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Deconstructing {'m = c + √(1/c)'} and {'E = [c + √(1/c)] · c²'} under geometric variable light speed.
              </p>
            </div>

            <div className="bg-slate-950 border border-cyan-500/30 rounded-lg p-5">
              <div className="text-xs font-mono text-cyan-400 uppercase">Cathie&apos;s Fundamental Mass Formula</div>
              <div className="text-2xl font-mono font-bold text-white mt-1">
                m = c + √(1 / c) ≡ c + c⁻⁰·⁵
              </div>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Conventional physics treats mass (m) as an intrinsic scalar property of baryonic matter.
                Cathie asserts that mass is a <strong>standing wave phenomenon</strong> created by the spatial retardation
                and circular recirculation of light within the geodetic lattice.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200 font-mono">
                Mathematical Substitution into Einstein&apos;s Energy Metric
              </h3>
              <p className="text-sm text-slate-300">
                In Einstein&apos;s special relativity, mass-energy equivalence is expressed as E = m · c².
                Substituting Cathie&apos;s geometric mass formulation directly yields the <strong>Harmonic Unified Field Equation</strong>:
              </p>

              <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-slate-200 space-y-2">
                <div className="text-cyan-400">// Substitution Step:</div>
                <div className="text-base text-white">{'E = [c + √(1 / c)] · c²'}</div>
                <div className="text-cyan-400 pt-2">// Algebraic Expansion:</div>
                <div className="text-base text-emerald-400 font-bold">{'E = c³ + c¹·⁵ = c³ + √(c³)'}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                <div className="text-xs font-mono text-cyan-400 uppercase">{'Term 1: Cubic Spatial Density (c³)'}</div>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  The c³ component represents the <strong>three-dimensional spatial volumetric resonance</strong> of the continuum.
                  Because energy occupies 3 orthogonal spatial dimensions (x, y, z), the propagation field expands as a volumetric flux tensor.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                <div className="text-xs font-mono text-cyan-400 uppercase">{'Term 2: Reactive Wave Impedance (c¹·⁵)'}</div>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  The {'c¹·⁵ = √(c³)'} term represents the <strong>topological half-spin phase reflection</strong> of the medium.
                  It is the reciprocal reactive impedance that couples electromagnetic waves back into physical inertia (matter formation).
                </p>
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-5 space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-cyan-300 font-mono">
                Physical Interpretation: The Non-Constancy of c
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                In standard Einsteinian general relativity, the coordinate speed of light varies in a gravitational potential:
                {' c(r) = c₀ · (1 - 2GM / rc²)'}. Cathie advances this principle to its logical extreme:
              </p>
              <ul className="text-xs text-slate-400 space-y-2 list-disc pl-5">
                <li>
                  <strong className="text-slate-200">Variations in c are Accelerations:</strong> Changes in c across space-time coordinates
                  do not violate relativity; rather, a = -c · ∇c. Gravitational force is mathematically equivalent
                  to a refractive gradient in the local speed of light.
                </li>
                <li>
                  <strong className="text-slate-200">The Geometric Lattice Governs c:</strong> Proximity to geodetic grid nodes
                  modulates the local dielectric permittivity ε(r) and magnetic permeability μ(r).
                  At nodal junctions, c_local = 1/√(ε · μ) experiences steep geometric gradients.
                </li>
                <li>
                  <strong className="text-slate-200">Dynamic Mass Manifestation:</strong> When a matter packet enters an area of lower c,
                  the standing wave compresses and apparent inertial mass increases. Conversely, elevating c_local toward c₀ = 144,000
                  causes matter to shed inertial resistance.
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* SECTION 3: GRAVITY AND LIGHT SPEED RECIPROCALS */}
        {activeTab === 'reciprocals' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">Section 3.0</span>
              <h2 className="text-xl font-bold text-white mt-1">
                Gravity-Light Speed Reciprocity & Anti-Gravitational Propulsion
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Harmonic phase cancellation, nodal resonance manipulation, and zero-time geodesic displacement.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-lg p-5 space-y-3">
              <div className="text-xs font-mono text-cyan-400 uppercase">Harmonic Reciprocity Law</div>
              <div className="text-xl font-mono text-white">
                g_harmonic ∝ (1 / c_apparent)  ⟺  g · c = Constant
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Cathie observed that gravitational acceleration (g) and the apparent velocity of light (c) behave as harmonic reciprocals.
                When space-time field density increases (approaching a planetary core or dense mass concentration), c is decelerated
                by refractive dispersion, while the gravitational gradient g intensifies.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                <div className="text-xs font-mono text-amber-400 uppercase">Mass Manifestation via Grid Density</div>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  As local field density increases:
                  <br />
                  1. Phase velocity v_p and group velocity v_g diverge.
                  <br />
                  2. Light waves loop into closed circular geodetics, forming stable electromagnetic vortices (leptons and hadrons).
                  <br />
                  3. Inertial reaction force F = m · a becomes fully engaged.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                <div className="text-xs font-mono text-emerald-400 uppercase">Inertial Decoupling at Null Nodes</div>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  At the intersections of the cuboctahedral grid (Vector Equilibrium), the vector sum of all spatial forces cancels to zero:
                  <span className="block font-mono text-cyan-300 mt-1">∑ F_lattice = 0</span>
                  This creates local zones where gravitational stress tensors achieve geometric neutrality.
                </p>
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-5 space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-cyan-300 font-mono">
                Anti-Gravity Propulsion & Zero-Time Traversal Mechanism
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Cathie proposed that unidentified aerial phenomena (UAP) do not employ chemical or brute reaction thrusters.
                Instead, they utilize <strong>harmonic field generators</strong> phase-locked to the geodetic grid:
              </p>

              <div className="space-y-3 text-xs text-slate-400">
                <div className="bg-slate-900 border border-slate-800 rounded p-3">
                  <span className="font-semibold text-slate-200">1. Resonant Phase Nulling:</span> An on-board electromagnetic oscillator
                  radiates at harmonic multiples of 144, 216, or 432 kHz, matching the local spatial arc-minute wavelength (λ_n = 21,600 / n).
                  This induces destructive interference with the Earth&apos;s gravitational flux vector.
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded p-3">
                  <span className="font-semibold text-slate-200">2. Inversion of the Impedance Term √(1/c):</span> By applying a rotating
                  transverse magnetic field (E × B), the reactive term √(1/c) is shifted by 180° (π radians).
                  Effective mass collapses to zero (m → 0), liberating the craft from inertial resistance (G-forces vanish).
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded p-3">
                  <span className="font-semibold text-slate-200">3. Zero-Time Geodesic Translation:</span> In quantum wave mechanics,
                  as group velocity v_g → 0 and phase velocity v_p → ∞ (v_p · v_g = c²), the de Broglie wavelength expands
                  to encompass the entire geodetic baseline. The vehicle translates non-locally between adjacent grid nodes in zero coordinate time,
                  traversing the metric without crossing the intervening Euclidean space (ds² = 0).
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 4: MAXWELLIAN WAVE MECHANICS & SIMULATION */}
        {activeTab === 'maxwellian' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">Section 4.0</span>
              <h2 className="text-xl font-bold text-white mt-1">
                Maxwellian Wave Foundation, Stress Tensors & Simulation Logic
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Formalizing Cathie&apos;s lattice via Maxwell-Helmholtz cavity resonators, Poynting energy flux, and Python script design.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-lg p-5 space-y-3">
              <div className="text-xs font-mono text-cyan-400 uppercase">Electromagnetic Energy Density</div>
              <div className="text-lg font-mono text-white">
                u_EM = 0.5 · (ε₀ E² + B² / μ₀)  with  c = 1 / √(ε₀ μ₀)
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                In Maxwellian electrodynamics, energy density is localized in the electric and magnetic fields.
                When applied to Cathie&apos;s spherical geodetic grid, the Earth&apos;s atmosphere and ionosphere act as a
                <strong>spherical resonant cavity</strong> described by the vector Helmholtz wave equation:
                <span className="block font-mono text-cyan-300 mt-1">∇²E + k²E = 0  where  k = ω / c = 2π / λ</span>
              </p>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-5 space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-cyan-300 font-mono">
                Maxwell Stress-Energy Tensor & Curvature Coupling
              </h3>
              <p className="text-xs text-slate-300">
                The momentum and energy flux circulating within the geodetic grid are defined by the symmetric stress-energy tensor:
              </p>
              <div className="bg-slate-900 border border-slate-800 rounded p-3 font-mono text-xs text-slate-200">
                {'T^(μν) = (1 / μ₀) · [F^(μα) F^(ν)_α - 0.25 · η^(μν) F_(αβ) F^(αβ)]'}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Coupled to Einstein&apos;s field equation {'G_μν = (8πG / c⁴) · T_μν'}, variations in T_μν
                at harmonic nodes induce localized geometric curvature. When modulated by high-frequency harmonic electromagnetic standing waves,
                T₀₀ (energy density) can be balanced against T_ij (shear stress) to generate net propulsion without propellant mass expulsion.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-lg p-5 space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-cyan-300 font-mono">
                Programmatic Simulation Parameters & Script Architecture
              </h3>
              <p className="text-xs text-slate-300">
                The Python simulator implements the following sequence:
              </p>
              <ol className="text-xs text-slate-400 space-y-1.5 list-decimal pl-5">
                <li>Defines planetary circumference (21,600 arc-min) and grid time conversion (97,200 grid-sec/day).</li>
                <li>Applies geometric attenuation factor (φⁿ, π, or octave) to theoretical light speed c₀ = 144,000.</li>
                <li>Computes local effective speed of light (c_local) inside the gravitational well.</li>
                <li>Calculates Cathie mass {'m = c + √(1/c)'} and Unified Field energy {'E = m · c² = c³ + c¹·⁵'}.</li>
                <li>Evaluates reciprocal gravity {'g_harm ∝ 1/c'} and phase velocity {'v_p = c₀² / v_g'}.</li>
                <li>Computes Maxwellian energy density u_EM and Poynting vector magnitude S = |E × B| / μ₀.</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
