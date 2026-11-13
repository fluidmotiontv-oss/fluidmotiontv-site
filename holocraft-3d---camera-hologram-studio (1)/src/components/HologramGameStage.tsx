/**
 * HoloCraft 3D - Interactive Cyber Hologram Game Stage
 * An arcade mini-game where users tap/click glowing floating hologram crystals in 3D space to score points.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Zap, Trophy, RefreshCw, Play, X, Sparkles, Award } from 'lucide-react';
import { hologramSound } from '../audio/HologramSoundEngine';

interface HologramGameStageProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CrystalNode {
  id: number;
  x: number;
  y: number;
  z: number;
  size: number;
  color: string;
  speed: number;
  points: number;
}

export const HologramGameStage: React.FC<HologramGameStageProps> = ({ isOpen, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(1420);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const crystalsRef = useRef<CrystalNode[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.parentElement?.clientWidth || 800;
    let height = canvas.parentElement?.clientHeight || 500;
    canvas.width = width;
    canvas.height = height;

    // Initialize random crystal nodes
    const initialCrystals: CrystalNode[] = [];
    for (let i = 0; i < 12; i++) {
      initialCrystals.push({
        id: Math.random(),
        x: Math.random() * (width - 100) + 50,
        y: Math.random() * (height - 100) + 50,
        z: Math.random() * 2 + 0.5,
        size: Math.random() * 20 + 15,
        color: ['#06b6d4', '#10b981', '#f59e0b', '#ec4899'][Math.floor(Math.random() * 4)],
        speed: Math.random() * 1.5 + 0.8,
        points: Math.floor(Math.random() * 50) + 25,
      });
    }
    crystalsRef.current = initialCrystals;

    let animId: number;
    let time = 0;

    const render = () => {
      ctx.fillStyle = '#03060c';
      ctx.fillRect(0, 0, width, height);

      time += 0.02;

      // Draw cyber background grid
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.12)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Update and draw crystals
      crystalsRef.current.forEach((c) => {
        c.y -= c.speed;
        if (c.y < -30) {
          c.y = height + 30;
          c.x = Math.random() * (width - 100) + 50;
        }

        const pulse = 1 + Math.sin(time * 4 + c.id * 10) * 0.15;
        const curSize = c.size * pulse;

        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(time + c.id);

        // Glowing crystal polygon
        ctx.fillStyle = c.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = c.color;
        ctx.beginPath();
        ctx.moveTo(0, -curSize);
        ctx.lineTo(curSize * 0.7, 0);
        ctx.lineTo(0, curSize);
        ctx.lineTo(-curSize * 0.7, 0);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isOpen]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    let hit = false;
    crystalsRef.current.forEach((c) => {
      const dist = Math.hypot(clickX - c.x, clickY - c.y);
      if (dist < c.size * 1.5) {
        hit = true;
        setScore((prev) => {
          const next = prev + c.points;
          if (next > highScore) setHighScore(next);
          return next;
        });
        hologramSound.triggerHologramCaptureChime();
        // Respawn crystal
        c.y = canvas.height + 40;
        c.x = Math.random() * (canvas.width - 100) + 50;
      }
    });

    if (hit) {
      hologramSound.triggerLaserScanSound();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg font-mono">
      <div className="relative w-full max-w-4xl bg-slate-950 border border-cyan-500/40 rounded-3xl flex flex-col shadow-2xl overflow-hidden h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-400/30">
              <Zap className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white uppercase tracking-wider">
                CYBER HOLOGRAM CRYSTAL ARCADE (GL GAME)
              </h2>
              <p className="text-xs text-slate-400">
                Click/Tap floating harmonic crystals to absorb energy and boost somatic yield
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-xl border border-white/10 text-xs">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="text-slate-400">SCORE:</span>
              <span className="text-cyan-400 font-bold tabular-nums">{score}</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400">HIGH:</span>
              <span className="text-amber-400 font-bold tabular-nums">{highScore}</span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Canvas Game Stage */}
        <div className="relative flex-1 bg-black overflow-hidden cursor-crosshair">
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            className="w-full h-full block"
          />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none text-xs text-slate-400 bg-slate-950/80 backdrop-blur px-4 py-1.5 rounded-full border border-white/10">
            TAP / CLICK CRYSTALS TO ABSORB ENERGY & SCORE POINTS
          </div>
        </div>
      </div>
    </div>
  );
};
