/**
 * HoloCraft 3D - High-Performance 2D Canvas Holographic 3D Viewport
 * Projects 3D Point Clouds, Meshes, and 4-Way Pyramid Projections smoothly at 60 FPS without WebGL context limits.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  RotateCw, 
  Layers, 
  Eye, 
  Maximize2, 
  Camera, 
  Sparkles, 
  Box, 
  Grid, 
  Zap, 
  Volume2, 
  VolumeX,
  Compass
} from 'lucide-react';
import { ProcessedDepthData } from '../utils/depthEstimator';
import { HologramParameters, ViewportMode, HologramColorTheme } from '../types/hologram';
import { hologramSound } from '../audio/HologramSoundEngine';

interface Hologram3DViewportProps {
  depthData: ProcessedDepthData | null;
  params: HologramParameters;
  onUpdateParams: (newParams: Partial<HologramParameters>) => void;
  activeMode: ViewportMode;
  onSelectMode: (mode: ViewportMode) => void;
  isCapturing: boolean;
}

export const Hologram3DViewport: React.FC<Hologram3DViewportProps> = ({
  depthData,
  params,
  onUpdateParams,
  activeMode,
  onSelectMode,
  isCapturing,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Interaction & Orbit state
  const isDraggingRef = useRef<boolean>(false);
  const previousMousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const rotationRef = useRef<{ x: number; y: number }>({ x: 0.2, y: 0.0 });
  const targetRotationRef = useRef<{ x: number; y: number }>({ x: 0.2, y: 0.0 });
  const zoomRef = useRef<number>(1.0);
  const targetZoomRef = useRef<number>(1.0);

  const [fps, setFps] = useState<number>(60);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(true);
  const fpsFrameCountRef = useRef<number>(0);
  const fpsLastTimeRef = useRef<number>(performance.now());

  // Helper color map
  const getThemeColorRgb = (theme: HologramColorTheme): [number, number, number] => {
    switch (theme) {
      case 'matrix_emerald': return [16, 185, 129];
      case 'solar_gold': return [245, 158, 11];
      case 'coronal_magenta': return [236, 72, 153];
      case 'quantum_violet': return [168, 85, 247];
      case 'full_rgb': return [255, 255, 255];
      case 'cyan_neon':
      default:
        return [6, 182, 212];
    }
  };

  // Main 2D Canvas Projection & Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    let width = container.clientWidth || 800;
    let height = container.clientHeight || 600;

    const resize = () => {
      if (container) {
        width = container.clientWidth;
        height = container.clientHeight;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        ctx.scale(dpr, dpr);
      }
    };
    resize();
    window.addEventListener('resize', resize);

    let time = 0;

    const render = () => {
      const now = performance.now();
      fpsFrameCountRef.current++;
      if (now - fpsLastTimeRef.current >= 1000) {
        setFps(fpsFrameCountRef.current);
        fpsFrameCountRef.current = 0;
        fpsLastTimeRef.current = now;
      }

      time += 0.016;

      // Auto-rotation
      if (params.autoRotate && !isDraggingRef.current) {
        targetRotationRef.current.y += 0.012 * params.rotationSpeed;
      }

      // Smooth lerp
      rotationRef.current.x += (targetRotationRef.current.x - rotationRef.current.x) * 0.1;
      rotationRef.current.y += (targetRotationRef.current.y - rotationRef.current.y) * 0.1;
      zoomRef.current += (targetZoomRef.current - zoomRef.current) * 0.1;

      // Clear stage
      ctx.fillStyle = '#020408';
      ctx.fillRect(0, 0, width, height);

      // Draw background cyber grid
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.08)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      const offsetX = (width / 2) % gridSize;
      const offsetY = (height / 2) % gridSize;
      for (let x = offsetX; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = offsetY; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const centerX = width / 2;
      const centerY = height / 2 + 30;
      const scale = Math.min(width, height) * 0.38 * zoomRef.current;
      const [rCol, gCol, bCol] = getThemeColorRgb(params.colorTheme);

      // Draw Hologram Stage Base Pedestal if in projector or standard mode
      if (activeMode === 'projector' || activeMode === 'pointcloud' || activeMode === 'mesh') {
        ctx.save();
        ctx.strokeStyle = `rgba(${rCol}, ${gCol}, ${bCol}, 0.35)`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY + 140, scale * 1.2, scale * 0.35, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Volumetric upward light rays
        const rayGrad = ctx.createLinearGradient(centerX, centerY + 140, centerX, centerY - 100);
        rayGrad.addColorStop(0, `rgba(${rCol}, ${gCol}, ${bCol}, 0.15)`);
        rayGrad.addColorStop(1, `rgba(${rCol}, ${gCol}, ${bCol}, 0)`);
        ctx.fillStyle = rayGrad;
        ctx.beginPath();
        ctx.moveTo(centerX - scale * 1.2, centerY + 140);
        ctx.lineTo(centerX - scale * 0.4, centerY - 80);
        ctx.lineTo(centerX + scale * 0.4, centerY - 80);
        ctx.lineTo(centerX + scale * 1.2, centerY + 140);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      // Render 3D Point Cloud or Mesh if depthData available
      if (depthData) {
        const { positions, colors, pointCount } = depthData;
        const cosX = Math.cos(rotationRef.current.x);
        const sinX = Math.sin(rotationRef.current.x);
        const cosY = Math.cos(rotationRef.current.y);
        const sinY = Math.sin(rotationRef.current.y);

        const projectedPoints: { x: number; y: number; z: number; r: number; g: number; b: number }[] = [];

        for (let i = 0; i < pointCount; i++) {
          let x = positions[i * 3];
          let y = positions[i * 3 + 1];
          let z = positions[i * 3 + 2] * params.displacementScale;

          // 1. Rotate around X axis (pitch)
          let y1 = y * cosX - z * sinX;
          let z1 = y * sinX + z * cosX;

          // 2. Rotate around Y axis (yaw)
          let x2 = x * cosY + z1 * sinY;
          let z2 = -x * sinY + z1 * cosY;

          // Perspective division
          const perspective = 3.5 / (3.5 + z2);
          const screenX = centerX + x2 * scale * perspective;
          const screenY = centerY - y1 * scale * perspective;

          // Color calculation
          let pr = colors[i * 3] * 255;
          let pg = colors[i * 3 + 1] * 255;
          let pb = colors[i * 3 + 2] * 255;

          if (params.colorTheme !== 'full_rgb') {
            pr = rCol;
            pg = gCol;
            pb = bCol;
          }

          projectedPoints.push({ x: screenX, y: screenY, z: z2, r: pr, g: pg, b: pb });
        }

        // Sort by depth (painter's algorithm)
        projectedPoints.sort((a, b) => a.z - b.z);

        // Draw points / mesh
        ctx.save();
        if (activeMode === 'mesh' || params.wireframeOnly) {
          // Draw wireframe grid lines
          ctx.lineWidth = 1;
          const gridW = depthData.width;
          const gridH = depthData.height;

          for (let y = 0; y < gridH - 1; y += 2) {
            for (let x = 0; x < gridW - 1; x += 2) {
              const idx1 = y * gridW + x;
              const idx2 = y * gridW + (x + 2);
              const idx3 = (y + 2) * gridW + x;

              if (idx1 < projectedPoints.length && idx2 < projectedPoints.length) {
                const p1 = projectedPoints[idx1];
                const p2 = projectedPoints[idx2];
                const p3 = projectedPoints[idx3];

                const depthAlpha = Math.max(0.15, Math.min(0.85, (p1.z + 1.5) * 0.4));
                ctx.strokeStyle = `rgba(${rCol}, ${gCol}, ${bCol}, ${depthAlpha})`;
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                if (p3) ctx.lineTo(p3.x, p3.y);
                ctx.stroke();
              }
            }
          }
        } else if (activeMode === 'pyramid4') {
          // Render 4-Way Pyramid Hologram Layout
          const pSize = Math.max(1, params.particleSize * 0.75);
          const qSize = width * 0.22;
          const qCenterOffsets = [
            { x: centerX, y: centerY - width * 0.24 }, // Top (North)
            { x: centerX, y: centerY + width * 0.24 }, // Bottom (South)
            { x: centerX - width * 0.24, y: centerY }, // Left (West)
            { x: centerX + width * 0.24, y: centerY }, // Right (East)
          ];

          qCenterOffsets.forEach((quad, qIdx) => {
            ctx.save();
            ctx.beginPath();
            ctx.arc(quad.x, quad.y, qSize, 0, Math.PI * 2);
            ctx.clip();

            projectedPoints.forEach((pt) => {
              // Offset points into quadrant
              const qx = quad.x + (pt.x - centerX) * 0.45;
              const qy = quad.y + (pt.y - centerY) * 0.45;
              const alpha = Math.max(0.2, Math.min(1.0, (pt.z + 1.2) * 0.5));
              ctx.fillStyle = `rgba(${pt.r}, ${pt.g}, ${pt.b}, ${alpha})`;
              ctx.fillRect(qx - pSize / 2, qy - pSize / 2, pSize, pSize);
            });

            // Draw quadrant divider frame
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(quad.x - qSize, quad.y - qSize, qSize * 2, qSize * 2);
            ctx.restore();
          });
        } else {
          // Standard Point Cloud Render
          const pSize = Math.max(1.2, params.particleSize);
          projectedPoints.forEach((pt) => {
            const alpha = Math.max(0.25, Math.min(1.0, (pt.z + 1.2) * 0.5));
            ctx.fillStyle = `rgba(${pt.r}, ${pt.g}, ${pt.b}, ${alpha})`;
            ctx.fillRect(pt.x - pSize / 2, pt.y - pSize / 2, pSize, pSize);
          });
        }
        ctx.restore();
      }

      // Draw scanlines overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
      for (let y = 0; y < height; y += 4) {
        ctx.fillRect(0, y, width, 2);
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [depthData, activeMode, params]);

  // Pointer drag events for orbit
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    hologramSound.triggerLaserScanSound();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;

    targetRotationRef.current.y += deltaX * 0.008;
    targetRotationRef.current.x = Math.max(-1.2, Math.min(1.2, targetRotationRef.current.x + deltaY * 0.008));

    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomDelta = e.deltaY * 0.0015;
    targetZoomRef.current = Math.max(0.6, Math.min(2.5, targetZoomRef.current + zoomDelta));
  };

  const handleResetCamera = () => {
    targetRotationRef.current = { x: 0.2, y: 0.0 };
    targetZoomRef.current = 1.0;
    hologramSound.triggerLaserScanSound();
  };

  const handleToggleSound = () => {
    const muted = hologramSound.toggleMute();
    setIsAudioMuted(muted);
  };

  const handleCaptureSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `holocraft3d_render_${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
    hologramSound.triggerHologramCaptureChime();
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[480px] bg-[#020408] rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex flex-col group select-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onWheel={handleWheel}
    >
      {/* 2D High-Performance Hologram Canvas (Zero WebGL Context Limits) */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-grab active:cursor-grabbing touch-none"
      />

      {/* Top Hologram HUD Bar */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-20">
        <div className="flex items-center gap-2.5 bg-slate-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/15 shadow-xl pointer-events-auto">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#22d3ee]" />
          <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
            HOLOGRAM VIEWPORT
          </span>
          <span className="text-slate-500 font-mono text-xs">|</span>
          <span className="text-[11px] font-mono text-slate-300 tabular-nums">
            {depthData ? `${depthData.pointCount.toLocaleString()} VTX` : 'STANDBY'}
          </span>
          <span className="text-slate-500 font-mono text-xs">|</span>
          <span className="text-[11px] font-mono text-slate-400 tabular-nums">
            {fps} FPS
          </span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={handleToggleSound}
            className={`p-2 rounded-xl text-xs font-mono transition-all border ${
              !isAudioMuted
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                : 'bg-slate-950/80 backdrop-blur-md text-slate-400 border-white/10 hover:text-white'
            }`}
            title="Toggle 432 Hz Pythagorean Hologram Carrier Tone"
          >
            {!isAudioMuted ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={handleResetCamera}
            className="p-2 rounded-xl bg-slate-950/80 backdrop-blur-md text-slate-400 border border-white/10 hover:text-white transition-colors"
            title="Reset Camera Orientation"
          >
            <Compass className="w-4 h-4" />
          </button>

          <button
            onClick={handleCaptureSnapshot}
            className="p-2 rounded-xl bg-slate-950/80 backdrop-blur-md text-slate-400 border border-white/10 hover:text-white transition-colors"
            title="Snapshot Viewport (PNG)"
          >
            <Camera className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>

      {/* Floating Mode Switcher (Bottom-Center) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-950/90 backdrop-blur-xl border border-white/15 p-1.5 rounded-2xl shadow-2xl z-20 flex items-center gap-1">
        {[
          { id: 'pointcloud', label: 'Point Cloud', icon: Sparkles },
          { id: 'mesh', label: '3D Hologram Mesh', icon: Box },
          { id: 'projector', label: 'Laser Stage', icon: Zap },
          { id: 'pyramid4', label: 'Pyramid 4-Way', icon: Layers },
          { id: 'anaglyph', label: '3D Anaglyph', icon: Eye },
        ].map((m) => {
          const Icon = m.icon;
          const isActive = activeMode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => {
                onSelectMode(m.id as ViewportMode);
                hologramSound.triggerLaserScanSound();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium font-mono flex items-center gap-1.5 transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{m.label}</span>
            </button>
          );
        })}
      </div>

      {/* Helper Interaction Cue */}
      <div className="absolute bottom-4 left-4 pointer-events-none text-[10px] font-mono text-slate-500 hidden md:flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/60" />
        <span>Drag to orbit   Scroll to zoom   Auto-Rotate: {params.autoRotate ? 'ON' : 'OFF'}</span>
      </div>

      {/* Pyramid Glass Projector Notice if in pyramid4 mode */}
      {activeMode === 'pyramid4' && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-slate-950/95 border border-cyan-400/40 p-3 rounded-xl text-xs text-cyan-200 font-mono text-center shadow-2xl max-w-md z-30">
          <p className="font-bold text-white mb-0.5">PEPPER'S GHOST 4-WAY PROJECTION</p>
          <p className="text-[11px] text-slate-300">
            Place a transparent plastic or glass hologram pyramid upside down in the exact center of this screen for full 3D floating hologram illusion!
          </p>
        </div>
      )}
    </div>
  );
};
