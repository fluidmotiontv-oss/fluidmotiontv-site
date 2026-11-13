/**
 * HoloCraft 3D - Live Camera Capture & Filter Studio
 * Streams live webcam, applies real-time holographic shaders, and captures 3D depth snapshots
 */

import React, { useEffect, useRef, useState } from 'react';
import { 
  Camera, 
  SwitchCamera, 
  Upload, 
  Sparkles, 
  Layers, 
  Scan, 
  Sliders, 
  Image as ImageIcon,
  Check, 
  AlertCircle,
  Maximize2
} from 'lucide-react';
import { CameraFilterMode, CameraSnapshot } from '../types/hologram';
import { hologramSound } from '../audio/HologramSoundEngine';

interface CameraCaptureStudioProps {
  onCaptureImage: (snapshot: CameraSnapshot) => void;
  onOpenSamples: () => void;
  currentSnapshot: CameraSnapshot | null;
}

export const CameraCaptureStudio: React.FC<CameraCaptureStudioProps> = ({
  onCaptureImage,
  onOpenSamples,
  currentSnapshot,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('user');
  const [filterMode, setFilterMode] = useState<CameraFilterMode>('cyber_neon');
  const [resolutionMode, setResolutionMode] = useState<'1080p' | '720p' | '480p'>('1080p');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isFlashing, setIsFlashing] = useState<boolean>(false);

  // Start Camera Stream
  const startCamera = async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const resConstraints = {
        '1080p': { width: { ideal: 1920 }, height: { ideal: 1080 } },
        '720p': { width: { ideal: 1280 }, height: { ideal: 720 } },
        '480p': { width: { ideal: 640 }, height: { ideal: 480 } },
      }[resolutionMode];

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: cameraFacing,
          ...resConstraints,
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsStreaming(true);
      setErrorMessage(null);
    } catch (err: unknown) {
      console.warn('Camera access denied or unavailable:', err);
      setIsStreaming(false);
      setErrorMessage('Camera access unavailable. You can upload an image or select a curated 3D holographic sample.');
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsStreaming(false);
  };

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [cameraFacing, resolutionMode]);

  // Live video processing loop with real-time holographic canvas filters
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const render = () => {
      if (video.readyState >= 2) {
        const vw = video.videoWidth || 640;
        const vh = video.videoHeight || 480;

        if (canvas.width !== vw || canvas.height !== vh) {
          canvas.width = vw;
          canvas.height = vh;
        }

        ctx.drawImage(video, 0, 0, vw, vh);

        // Apply real-time Filter Effects
        if (filterMode !== 'normal') {
          const frame = ctx.getImageData(0, 0, vw, vh);
          const d = frame.data;
          const len = d.length;

          if (filterMode === 'hologram_edge') {
            // Neon cyan edge contour filter
            for (let i = 0; i < len; i += 4) {
              const lum = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
              d[i] = Math.min(255, lum * 0.2);
              d[i + 1] = Math.min(255, lum * 1.4);
              d[i + 2] = Math.min(255, lum * 1.8);
            }
          } else if (filterMode === 'thermal_depth') {
            // Thermal Depth Map gradient (Cyan -> Green -> Yellow -> Red)
            for (let i = 0; i < len; i += 4) {
              const lum = (0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]) / 255;
              d[i] = Math.round(Math.sin(lum * Math.PI) * 255);
              d[i + 1] = Math.round(Math.sin(lum * Math.PI * 0.5) * 255);
              d[i + 2] = Math.round(Math.cos(lum * Math.PI * 0.5) * 255);
            }
          } else if (filterMode === 'matrix_green') {
            // Matrix Terminal green phosphorus
            for (let i = 0; i < len; i += 4) {
              const lum = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
              d[i] = 10;
              d[i + 1] = Math.min(255, lum * 1.6);
              d[i + 2] = 40;
            }
          } else if (filterMode === 'quantum_lidar') {
            // Lidar Point dispersion rainbow
            for (let i = 0; i < len; i += 4) {
              const lum = (0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]) / 255;
              d[i] = Math.round((0.5 + 0.5 * Math.sin(lum * 12.0)) * 255);
              d[i + 1] = Math.round((0.5 + 0.5 * Math.cos(lum * 12.0)) * 255);
              d[i + 2] = Math.round(lum * 255);
            }
          } else if (filterMode === 'cyber_neon') {
            // Cyberpunk Golden-Cyan Hologram
            for (let i = 0; i < len; i += 4) {
              const lum = (0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]) / 255;
              if (lum > 0.5) {
                d[i] = Math.min(255, d[i] * 1.3);
                d[i + 1] = Math.min(255, d[i + 1] * 1.1);
                d[i + 2] = Math.min(255, d[i + 2] * 0.4);
              } else {
                d[i] = Math.min(255, d[i] * 0.3);
                d[i + 1] = Math.min(255, d[i + 1] * 1.2);
                d[i + 2] = Math.min(255, d[i + 2] * 1.6);
              }
            }
          }
          ctx.putImageData(frame, 0, 0);
        }
      }
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [filterMode, isStreaming]);

  // Trigger Snapshot
  const handleTakeSnapshot = () => {
    const canvas = canvasRef.current || videoRef.current;
    if (!canvas) return;

    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 200);

    hologramSound.triggerLaserScanSound();
    hologramSound.triggerHologramCaptureChime();

    // Create snapshot offscreen
    const offCanvas = document.createElement('canvas');
    if (canvas instanceof HTMLVideoElement) {
      offCanvas.width = canvas.videoWidth || 640;
      offCanvas.height = canvas.videoHeight || 480;
      const ctx = offCanvas.getContext('2d')!;
      ctx.drawImage(canvas, 0, 0);
    } else {
      offCanvas.width = canvas.width;
      offCanvas.height = canvas.height;
      const ctx = offCanvas.getContext('2d')!;
      ctx.drawImage(canvas, 0, 0);
    }

    const dataUrl = offCanvas.toDataURL('image/jpeg', 0.92);
    const snapshot: CameraSnapshot = {
      id: `snap_${Date.now()}`,
      title: `Camera Capture ${new Date().toLocaleTimeString()}`,
      timestamp: new Date().toISOString(),
      dataUrl,
      width: offCanvas.width,
      height: offCanvas.height,
    };

    onCaptureImage(snapshot);
  };

  // Upload Custom Image Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        hologramSound.triggerHologramCaptureChime();
        const snapshot: CameraSnapshot = {
          id: `upload_${Date.now()}`,
          title: file.name.replace(/\.[^/.]+$/, ''),
          timestamp: new Date().toISOString(),
          dataUrl,
          width: img.width,
          height: img.height,
        };
        onCaptureImage(snapshot);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl p-4 gap-3">
      {/* Header with Camera Status and Mode Selection */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-400/30 text-cyan-400">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold font-mono text-white tracking-wider uppercase">
              CAMERA CAPTURE ENGINE
            </h3>
            <span className="text-[10px] font-mono text-slate-400">
              {isStreaming ? 'Live Optical Sensor Connected' : 'Ready for Image Input'}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {/* Flip Camera */}
          <button
            onClick={() => setCameraFacing(f => f === 'user' ? 'environment' : 'user')}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-colors"
            title="Switch Front / Rear Camera"
          >
            <SwitchCamera className="w-3.5 h-3.5" />
          </button>

          {/* Sample Preset Browser */}
          <button
            onClick={onOpenSamples}
            className="px-2.5 py-1 text-xs font-mono font-semibold rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/30 text-cyan-300 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Samples</span>
          </button>

          {/* Upload Button */}
          <label className="px-2.5 py-1 text-xs font-mono rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span>Upload</span>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* Main Video / Filter Viewport */}
      <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden border border-white/10 flex items-center justify-center group">
        {/* Hidden video source */}
        <video
          ref={videoRef}
          playsInline
          muted
          className="hidden"
        />

        {/* Live Filter Processed Canvas */}
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover block"
        />

        {/* Shutter Flash Animation */}
        {isFlashing && (
          <div className="absolute inset-0 bg-white z-40 transition-opacity duration-200 pointer-events-none" />
        )}

        {/* Real-time Laser Target Reticle overlay */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {/* Outer Scanner Box */}
          <div className="w-48 h-48 sm:w-64 sm:h-64 border border-cyan-400/40 rounded-2xl relative">
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />

            {/* Scanning Laser Line */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-cyan-400 shadow-[0_0_12px_#22d3ee] animate-bounce" />

            {/* Center target cross */}
            <div className="absolute inset-0 flex items-center justify-center opacity-40">
              <div className="w-6 h-0.5 bg-cyan-400" />
              <div className="w-0.5 h-6 bg-cyan-400" />
            </div>
          </div>
        </div>

        {/* Capture Snapshot Trigger Button Overlay */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20">
          <button
            onClick={handleTakeSnapshot}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-bold font-mono text-xs shadow-[0_0_25px_rgba(34,211,238,0.5)] transition-all transform active:scale-95 flex items-center gap-2"
          >
            <Camera className="w-4 h-4" />
            <span>CAPTURE 3D HOLOGRAM</span>
          </button>
        </div>

        {/* Error Fallback Notice */}
        {errorMessage && (
          <div className="absolute inset-0 bg-slate-950/90 p-6 flex flex-col items-center justify-center text-center gap-3 z-30">
            <AlertCircle className="w-8 h-8 text-amber-400" />
            <p className="text-xs text-slate-300 font-mono max-w-xs">{errorMessage}</p>
            <div className="flex gap-2">
              <button
                onClick={onOpenSamples}
                className="px-3 py-1.5 bg-cyan-500 text-slate-950 font-mono font-bold text-xs rounded-lg"
              >
                Load Cyber Dragon Sample
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Real-time Camera Shader Filters Bar */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
          REAL-TIME OPTICAL FILTERS
        </span>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1">
          {[
            { id: 'cyber_neon', label: 'Cyber Neon' },
            { id: 'hologram_edge', label: 'Laser Edge' },
            { id: 'thermal_depth', label: 'Thermal Depth' },
            { id: 'quantum_lidar', label: 'Lidar Rainbow' },
            { id: 'matrix_green', label: 'Matrix Terminal' },
            { id: 'normal', label: 'Raw Optical' },
          ].map((f) => {
            const isActive = filterMode === f.id;
            return (
              <button
                key={f.id}
                onClick={() => {
                  setFilterMode(f.id as CameraFilterMode);
                  hologramSound.triggerLaserScanSound();
                }}
                className={`py-1 px-1.5 rounded-lg text-[10px] font-mono transition-all truncate border ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-sm font-semibold'
                    : 'bg-white/5 hover:bg-white/10 text-slate-400 border-white/5'
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
