/**
 * HoloCraft 3D - Curated Camera Sample Assets
 * Ready-to-use high-quality captures for 3D hologram asset generation
 */

import { CameraSnapshot } from '../types/hologram';

// Helper to generate futuristic cyber/organic canvas samples
export function generateSampleDataUrl(
  type: 'cyber_dragon' | 'scifi_drone' | 'quantum_crystal' | 'oceanic_wave' | 'human_cyborg' | 'hologram_matrix'
): string {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 480;
  const ctx = canvas.getContext('2d')!;

  const w = canvas.width;
  const h = canvas.height;
  const cx = w / 2;
  const cy = h / 2;

  // Background deep space gradient
  const bgGrad = ctx.createRadialGradient(cx, cy, 50, cx, cy, w * 0.7);
  bgGrad.addColorStop(0, '#0a1424');
  bgGrad.addColorStop(1, '#020408');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // Background grid
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
  ctx.lineWidth = 1;
  for (let x = 0; x < w; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y < h; y += 32) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  if (type === 'cyber_dragon') {
    // 1. Cyber Dragon Crest with 3D horns and glowing eyes
    const grad = ctx.createLinearGradient(cx - 150, cy - 150, cx + 150, cy + 150);
    grad.addColorStop(0, '#06b6d4');
    grad.addColorStop(0.5, '#10b981');
    grad.addColorStop(1, '#f59e0b');

    ctx.fillStyle = grad;
    ctx.beginPath();
    // Dragon head silhouette with layered scales
    ctx.moveTo(cx, cy - 140);
    ctx.bezierCurveTo(cx + 80, cy - 120, cx + 140, cy - 40, cx + 110, cy + 50);
    ctx.bezierCurveTo(cx + 130, cy + 90, cx + 60, cy + 140, cx, cy + 160);
    ctx.bezierCurveTo(cx - 60, cy + 140, cx - 130, cy + 90, cx - 110, cy + 50);
    ctx.bezierCurveTo(cx - 140, cy - 40, cx - 80, cy - 120, cx, cy - 140);
    ctx.fill();

    // Horns
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.moveTo(cx - 40, cy - 110);
    ctx.quadraticCurveTo(cx - 120, cy - 180, cx - 180, cy - 160);
    ctx.moveTo(cx + 40, cy - 110);
    ctx.quadraticCurveTo(cx + 120, cy - 180, cx + 180, cy - 160);
    ctx.stroke();

    // Dragon Eyes
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(cx - 45, cy - 10, 18, 10, -0.2, 0, Math.PI * 2);
    ctx.ellipse(cx + 45, cy - 10, 18, 10, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Scale patterns
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 2;
    for (let r = 20; r < 120; r += 20) {
      ctx.beginPath();
      ctx.arc(cx, cy + 30, r, 0.2, Math.PI - 0.2);
      ctx.stroke();
    }
  } else if (type === 'scifi_drone') {
    // 2. Sci-Fi Spherical Drone with glowing laser ring
    const droneGrad = ctx.createRadialGradient(cx - 30, cy - 30, 20, cx, cy, 120);
    droneGrad.addColorStop(0, '#f8fafc');
    droneGrad.addColorStop(0.4, '#38bdf8');
    droneGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = droneGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 110, 0, Math.PI * 2);
    ctx.fill();

    // Outer anti-gravity ring
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 160, 45, 0.2, 0, Math.PI * 2);
    ctx.stroke();

    // Core Camera Eye
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(cx, cy, 32, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx - 10, cy - 10, 10, 0, Math.PI * 2);
    ctx.fill();
  } else if (type === 'quantum_crystal') {
    // 3. Faceted Quartz Crystal Obelisk
    ctx.save();
    ctx.translate(cx, cy);
    const grad = ctx.createLinearGradient(-100, -150, 100, 150);
    grad.addColorStop(0, '#ec4899');
    grad.addColorStop(0.5, '#a855f7');
    grad.addColorStop(1, '#3b82f6');
    ctx.fillStyle = grad;

    ctx.beginPath();
    ctx.moveTo(0, -170);
    ctx.lineTo(80, -70);
    ctx.lineTo(90, 110);
    ctx.lineTo(0, 160);
    ctx.lineTo(-90, 110);
    ctx.lineTo(-80, -70);
    ctx.closePath();
    ctx.fill();

    // Crystal facet lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, -170); ctx.lineTo(0, 160);
    ctx.moveTo(0, -170); ctx.lineTo(35, 10); ctx.lineTo(0, 160);
    ctx.moveTo(0, -170); ctx.lineTo(-35, 10); ctx.lineTo(0, 160);
    ctx.moveTo(80, -70); ctx.lineTo(35, 10); ctx.lineTo(90, 110);
    ctx.moveTo(-80, -70); ctx.lineTo(-35, 10); ctx.lineTo(-90, 110);
    ctx.stroke();
    ctx.restore();
  } else if (type === 'oceanic_wave') {
    // 4. Fluid Motion 3D Cresting Surf Wave
    const waveGrad = ctx.createLinearGradient(0, cy - 120, 0, cy + 150);
    waveGrad.addColorStop(0, '#38bdf8');
    waveGrad.addColorStop(0.6, '#0369a1');
    waveGrad.addColorStop(1, '#082f49');
    ctx.fillStyle = waveGrad;

    ctx.beginPath();
    ctx.moveTo(0, cy + 150);
    ctx.lineTo(0, cy + 40);
    ctx.bezierCurveTo(cx * 0.4, cy + 20, cx * 0.7, cy - 130, cx + 40, cy - 130);
    ctx.bezierCurveTo(cx + 100, cy - 130, cx + 110, cy - 50, cx + 60, cy - 20);
    ctx.bezierCurveTo(cx + 120, cy + 40, cx * 1.5, cy + 80, w, cy + 60);
    ctx.lineTo(w, cy + 150);
    ctx.closePath();
    ctx.fill();

    // Wave foam crest
    ctx.fillStyle = '#f0fdf4';
    ctx.beginPath();
    ctx.arc(cx + 40, cy - 125, 22, 0, Math.PI * 2);
    ctx.arc(cx + 65, cy - 120, 18, 0, Math.PI * 2);
    ctx.arc(cx + 85, cy - 105, 15, 0, Math.PI * 2);
    ctx.arc(cx + 70, cy - 40, 16, 0, Math.PI * 2);
    ctx.fill();
  } else if (type === 'human_cyborg') {
    // 5. Humanoid Hologram Head
    ctx.fillStyle = '#06b6d4';
    ctx.beginPath();
    ctx.ellipse(cx, cy - 20, 85, 115, 0, 0, Math.PI * 2);
    ctx.fill();

    // Neck & Shoulders
    ctx.fillStyle = '#0e7490';
    ctx.beginPath();
    ctx.moveTo(cx - 40, cy + 85);
    ctx.lineTo(cx - 140, cy + 180);
    ctx.lineTo(cx + 140, cy + 180);
    ctx.lineTo(cx + 40, cy + 85);
    ctx.fill();

    // Face cyber visor
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(cx - 65, cy - 45, 130, 24);

    // Grid contour lines
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy - 135); ctx.lineTo(cx, cy + 95);
    ctx.moveTo(cx - 70, cy + 10); ctx.quadraticCurveTo(cx, cy + 35, cx + 70, cy + 10);
    ctx.stroke();
  } else {
    // 6. Holographic Quantum Matrix Core
    ctx.save();
    ctx.translate(cx, cy);
    ctx.fillStyle = '#10b981';
    for (let ring = 1; ring <= 4; ring++) {
      const radius = ring * 35;
      const nodes = ring * 6;
      ctx.strokeStyle = ring % 2 === 0 ? '#38bdf8' : '#10b981';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.stroke();

      for (let i = 0; i < nodes; i++) {
        const ang = (i * Math.PI * 2) / nodes;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(Math.cos(ang) * radius, Math.sin(ang) * radius, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  // Add scanlines overlay to give authentic capture feel
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  for (let y = 0; y < h; y += 4) {
    ctx.fillRect(0, y, w, 2);
  }

  return canvas.toDataURL('image/png');
}

export interface CuratedSample {
  id: string;
  name: string;
  category: string;
  description: string;
  theme: 'cyan_neon' | 'matrix_emerald' | 'solar_gold' | 'coronal_magenta' | 'quantum_violet' | 'full_rgb';
  displacement: number;
  type: 'cyber_dragon' | 'scifi_drone' | 'quantum_crystal' | 'oceanic_wave' | 'human_cyborg' | 'hologram_matrix';
}

export const CURATED_SAMPLES: CuratedSample[] = [
  {
    id: 'cyber_dragon_core',
    name: 'Cyber Dragon Sovereign',
    category: 'Creature / Mythic Tech',
    description: 'High-relief crest with contoured horns, glowing optical sensors, and scaled aerodynamic plates.',
    theme: 'solar_gold',
    displacement: 1.4,
    type: 'cyber_dragon'
  },
  {
    id: 'scifi_drone_orb',
    name: 'Orbital Recon Drone',
    category: 'Aerospace / Robotics',
    description: 'Spherical chassis with counter-rotating anti-gravity laser ring and focal sensor eye.',
    theme: 'cyan_neon',
    displacement: 1.2,
    type: 'scifi_drone'
  },
  {
    id: 'quantum_crystal_matrix',
    name: 'Quantum Prismatic Crystal',
    category: 'Mineral / Sacred Geometry',
    description: 'Faceted double-terminated quartz cluster dispersing light across chromatic spectrums.',
    theme: 'coronal_magenta',
    displacement: 1.6,
    type: 'quantum_crystal'
  },
  {
    id: 'oceanic_wave_swell',
    name: 'Fluid Motion Dawn Swell',
    category: 'Fluid Simulation',
    description: 'Curved hydraulic crest with aerated froth particles and deep oceanic caustics.',
    theme: 'cyan_neon',
    displacement: 1.3,
    type: 'oceanic_wave'
  },
  {
    id: 'human_cyborg_avatar',
    name: 'Neural Humanoid Avatar',
    category: 'Character / Biotech',
    description: 'Volumetric bust with cybernetic ocular visor and thoracic wireframe lattice.',
    theme: 'quantum_violet',
    displacement: 1.1,
    type: 'human_cyborg'
  },
  {
    id: 'hologram_matrix_chladni',
    name: 'Cymatics Core Node',
    category: 'Sacred Resonance',
    description: 'Concentric 432Hz nodal interference rings with radial orbital coordinates.',
    theme: 'matrix_emerald',
    displacement: 1.5,
    type: 'hologram_matrix'
  }
];
