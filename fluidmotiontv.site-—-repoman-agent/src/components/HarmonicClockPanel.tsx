import { useEffect, useRef, useState } from 'react';
import { Pause, Play, Volume2, VolumeX } from 'lucide-react';
import {
  PYTHAGOREAN_SCALE,
  PythagoreanInterval,
  computeDragonNonaryState,
  sampleHarmonicWave,
} from '../core/harmonicEngine';

export function HarmonicClockPanel() {
  const [selectedInterval, setSelectedInterval] = useState<PythagoreanInterval>(PYTHAGOREAN_SCALE[0]);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(false);
  const [nowMs, setNowMs] = useState<number>(() => Date.now());

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  // Respect prefers-reduced-motion on initial load
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setIsRunning(false);
    }
  }, []);

  // Synchronize Web Audio 432 Hz Pythagorean oscillator when explicitly enabled
  useEffect(() => {
    if (!audioEnabled) {
      if (gainRef.current && audioCtxRef.current) {
        const ctx = audioCtxRef.current;
        gainRef.current.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.04);
      }
      return;
    }

    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioCtx();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      void ctx.resume();
    }

    if (!oscRef.current || !gainRef.current) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(selectedInterval.frequencyHz, ctx.currentTime);
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      oscRef.current = osc;
      gainRef.current = gain;
    }

    oscRef.current.frequency.setTargetAtTime(selectedInterval.frequencyHz, ctx.currentTime, 0.03);
    gainRef.current.gain.setTargetAtTime(0.06, ctx.currentTime, 0.05);
  }, [audioEnabled, selectedInterval]);

  // Cleanup audio context on unmount
  useEffect(() => {
    return () => {
      if (oscRef.current) {
        try {
          oscRef.current.stop();
          oscRef.current.disconnect();
        } catch {
          // ignore cleanup error if already stopped
        }
      }
      if (audioCtxRef.current) {
        void audioCtxRef.current.close();
      }
    };
  }, []);

  // Dragon 9 Nonary Clock & liquid harmonic canvas loop
  useEffect(() => {
    let rafId = 0;

    const renderFrame = () => {
      const currentEpoch = Date.now();
      setNowMs(currentEpoch);

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const dpr = window.devicePixelRatio || 1;
          const width = canvas.clientWidth;
          const height = canvas.clientHeight;
          if (canvas.width !== Math.floor(width * dpr) || canvas.height !== Math.floor(height * dpr)) {
            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);
          }

          ctx.save();
          ctx.scale(dpr, dpr);

          // Deep slate instrument canvas
          ctx.fillStyle = '#0B1120';
          ctx.fillRect(0, 0, width, height);

          // Subtle 9-division nonary harmonic grid
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.12)';
          ctx.lineWidth = 1;
          for (let i = 1; i < 9; i++) {
            const gx = (width / 9) * i;
            ctx.beginPath();
            ctx.moveTo(gx, 0);
            ctx.lineTo(gx, height);
            ctx.stroke();
          }
          ctx.beginPath();
          ctx.moveTo(0, height / 2);
          ctx.lineTo(width, height / 2);
          ctx.stroke();

          const nonary = computeDragonNonaryState(currentEpoch);
          const timeSec = (currentEpoch % 100_000) / 1000;

          // Secondary harmonic envelope wave
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(20, 184, 166, 0.35)';
          ctx.lineWidth = 1.5;
          for (let px = 0; px <= width; px += 3) {
            const nx = px / width;
            const amp = sampleHarmonicWave(nx, timeSec * 0.5, PYTHAGOREAN_SCALE[4], nonary);
            const py = height / 2 + amp * (height * 0.28);
            if (px === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.stroke();

          // Primary Pythagorean standing liquid wave
          ctx.beginPath();
          ctx.strokeStyle = '#2DD4BF';
          ctx.lineWidth = 2.25;
          for (let px = 0; px <= width; px += 2) {
            const nx = px / width;
            const amp = sampleHarmonicWave(nx, timeSec, selectedInterval, nonary);
            const py = height / 2 + amp * (height * 0.36);
            if (px === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.stroke();

          ctx.restore();
        }
      }

      if (isRunning) {
        rafId = window.requestAnimationFrame(renderFrame);
      }
    };

    renderFrame();
    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [isRunning, selectedInterval]);

  const nonary = computeDragonNonaryState(nowMs);
  const utcIso = new Date(nowMs).toISOString().slice(11, 19);

  return (
    <section aria-labelledby="harmonic-clock-heading" className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="harmonic-clock-heading" className="text-xl font-semibold tracking-tight text-slate-900">
            01. Live 432 Hz Harmonic Portal &amp; Dragon 9 Nonary Clock
          </h2>
          <p className="mt-1 text-sm text-slate-600 max-w-2xl">
            Driven directly by the isolated <code className="text-xs font-mono text-slate-800">src/core/harmonicEngine.ts</code> module to verify clean domain-to-portal synchronization.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsRunning((prev) => !prev)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" aria-hidden="true" /> : <Play className="w-3.5 h-3.5" aria-hidden="true" />}
            <span>{isRunning ? 'Pause Wave' : 'Resume Wave'}</span>
          </button>

          <button
            type="button"
            onClick={() => setAudioEnabled((prev) => !prev)}
            className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              audioEnabled
                ? 'bg-teal-700 text-white border-teal-700 hover:bg-teal-800'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {audioEnabled ? <Volume2 className="w-3.5 h-3.5" aria-hidden="true" /> : <VolumeX className="w-3.5 h-3.5" aria-hidden="true" />}
            <span>{audioEnabled ? `Mute ${selectedInterval.frequencyHz} Hz` : 'Audio Preview'}</span>
          </button>
        </div>
      </div>

      {/* Single-elevation unified grid: Canvas + Nonary Clock Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col">
          <div className="px-5 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="font-medium text-slate-900">{selectedInterval.name}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{selectedInterval.frequencyHz} Hz</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">Ratio {selectedInterval.ratioLabel}</span>
            </div>
            <div className="text-xs font-mono tabular-nums text-slate-500">
              Sub-harmonic envelope {nonary.subHarmonicEnvelopeHz} Hz
            </div>
          </div>

          <div className="relative flex-1 min-h-[240px] bg-[#0B1120]">
            <canvas
              ref={canvasRef}
              aria-label="432 Hz Pythagorean liquid harmonic standing wave"
              className="w-full h-full min-h-[240px] block"
            />
          </div>

          {/* Interactive Pythagorean Scale Selector */}
          <div className="p-3 bg-slate-50 border-t border-slate-200">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1.5" role="group" aria-label="Pythagorean harmonic intervals">
              {PYTHAGOREAN_SCALE.map((interval) => {
                const active = interval.id === selectedInterval.id;
                return (
                  <button
                    key={interval.id}
                    type="button"
                    onClick={() => setSelectedInterval(interval)}
                    className={`px-2.5 py-2 rounded-md text-left transition-colors cursor-pointer ${
                      active
                        ? 'bg-slate-900 text-white'
                        : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-100/60'
                    }`}
                  >
                    <div className="text-[11px] font-mono tabular-nums font-semibold leading-tight">
                      {interval.ratioLabel}
                    </div>
                    <div className={`text-[11px] font-mono tabular-nums mt-0.5 ${active ? 'text-teal-300' : 'text-slate-500'}`}>
                      {interval.frequencyHz} Hz
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Dragon 9 Nonary Clock Telemetry Panel */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-medium text-slate-800">Dragon 9 Nonary Clock</span>
              <span className="font-mono tabular-nums">UTC {utcIso}</span>
            </div>

            <div className="mt-4 py-4 px-4 bg-[#0B1120] rounded-lg text-center">
              <div className="text-3xl font-mono font-semibold tracking-wider text-teal-300 tabular-nums">
                {nonary.formattedCode}
              </div>
              <div className="mt-1.5 text-xs font-mono text-slate-400">
                Sector · Nonad · Beat · Pulse
              </div>
            </div>

            <dl className="mt-5 divide-y divide-slate-100 text-sm">
              <div className="py-2.5 flex items-center justify-between">
                <dt className="text-slate-600">Nonary Sector (0–8)</dt>
                <dd className="font-mono tabular-nums font-medium text-slate-900">{nonary.sector} / 8</dd>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <dt className="text-slate-600">Sub-Nonad (0–80)</dt>
                <dd className="font-mono tabular-nums font-medium text-slate-900">{nonary.nonad} / 80</dd>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <dt className="text-slate-600">Micro-Beat (0–8)</dt>
                <dd className="font-mono tabular-nums font-medium text-slate-900">{nonary.beat} / 8</dd>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <dt className="text-slate-600">Harmonic Pulse (0–8)</dt>
                <dd className="font-mono tabular-nums font-medium text-slate-900">{nonary.pulse} / 8</dd>
              </div>
            </dl>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5">
              <span>Sector Completion</span>
              <span className="font-mono tabular-nums">{(nonary.sectorProgress * 100).toFixed(1)}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-sm overflow-hidden">
              <div
                className="h-full bg-teal-600 transition-[width] duration-150"
                style={{ width: `${Math.min(100, nonary.sectorProgress * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
