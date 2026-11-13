import React, { useState, useRef } from 'react';
import { Image as ImageIcon, Sparkles, Download, Layers, Palette, Ratio, ShoppingBag, Coins, Check, Waves, Share2, Upload, Trash2, CheckCircle2, FileImage, Plus, FolderPlus, Zap } from 'lucide-react';

interface VectorArtStudioProps {
  onEarnHarmony: (amount: number, desc: string) => void;
}

interface BatchImageItem {
  id: string;
  name: string;
  size: string;
  previewUrl?: string;
  vectorized: boolean;
  aspectRatio: '1:1' | '9:16';
  stickerTitle: string;
  colorPalette: string[];
  beachTag: string;
}

export const VectorArtStudio: React.FC<VectorArtStudioProps> = ({ onEarnHarmony }) => {
  const [prompt, setPrompt] = useState('A surfboard breaking through a sunset ocean barrel at Port Waikato point break');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '9:16'>('1:1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activePalette, setActivePalette] = useState(['#0284c7', '#f97316', '#10b981', '#0f172a', '#f8fafc']);
  const [stickerTitle, setStickerTitle] = useState('Pee Dub Point Barrel');
  const [stickerStyle, setStickerStyle] = useState('Bold 4px vector contour, vibrant coastal fills');
  const [beachTag, setBeachTag] = useState('Stoke High! 🌊');
  const [borderGlow, setBorderGlow] = useState(true);
  const [hasCreated, setHasCreated] = useState(false);
  const [isSharedToStream, setIsSharedToStream] = useState(false);

  // Multi-Image Batch State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>('demo-1');
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);

  const [batchItems, setBatchItems] = useState<BatchImageItem[]>([
    {
      id: 'demo-1',
      name: 'port_waikato_point_break.jpg',
      size: '2.4 MB',
      vectorized: true,
      aspectRatio: '1:1',
      stickerTitle: 'Pee Dub Point Barrel',
      colorPalette: ['#0284c7', '#f97316', '#10b981', '#0f172a', '#ffffff'],
      beachTag: 'Stoke High! 🌊',
    },
    {
      id: 'demo-2',
      name: 'campground_sunset_dune.png',
      size: '1.8 MB',
      vectorized: false,
      aspectRatio: '9:16',
      stickerTitle: 'Sunset Dune AR Lens',
      colorPalette: ['#1e293b', '#38bdf8', '#fbbf24', '#f43f5e', '#ffffff'],
      beachTag: 'Sunset Magic ✨',
    },
    {
      id: 'demo-3',
      name: 'black_sand_surfboard.jpg',
      size: '3.1 MB',
      vectorized: false,
      aspectRatio: '1:1',
      stickerTitle: 'Black Sand Shredder',
      colorPalette: ['#84cc16', '#06b6d4', '#3b82f6', '#0284c7', '#ffffff'],
      beachTag: 'Point Shred 🏄',
    },
  ]);

  const presetPalettes = [
    { name: 'Pee Dub Sunset', colors: ['#0284c7', '#f97316', '#10b981', '#0f172a', '#ffffff'] },
    { name: 'Black Sand Point', colors: ['#1e293b', '#38bdf8', '#fbbf24', '#f43f5e', '#ffffff'] },
    { name: 'Surf Lime & Cyan', colors: ['#84cc16', '#06b6d4', '#3b82f6', '#0284c7', '#ffffff'] },
    { name: 'Neon Twilight', colors: ['#d946ef', '#8b5cf6', '#06b6d4', '#0f172a', '#ffffff'] },
  ];

  const galleryItems = [
    { id: 'vec-1', title: 'Port Waikato Barrel Sticker', artist: 'Tane (Vector Wave)', type: 'Vector Art (1:1)', priceHarmony: 30, sales: 88, rating: 4.9 },
    { id: 'vec-2', title: 'Coastal Sunset 9:16 AR Lens', artist: 'Kai (Pee Dub Shredder)', type: 'AR Overlay (9:16)', priceHarmony: 45, sales: 64, rating: 5.0 },
    { id: 'vec-3', title: 'Campground Fire Vibes', artist: 'Aroha (Coastal Beats)', type: 'Vector Art (1:1)', priceHarmony: 35, sales: 42, rating: 4.8 },
  ];

  // Multiple File Selection Handler
  const handleMultipleImageUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newItems: BatchImageItem[] = Array.from(files).map((file, idx) => {
      const url = URL.createObjectURL(file);
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      const formattedTitle = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);

      return {
        id: `uploaded-${Date.now()}-${idx}`,
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        previewUrl: url,
        vectorized: false,
        aspectRatio: '1:1',
        stickerTitle: formattedTitle,
        colorPalette: presetPalettes[idx % presetPalettes.length].colors,
        beachTag: 'Coastal Session 🌊',
      };
    });

    setBatchItems((prev) => [...prev, ...newItems]);
    if (newItems.length > 0) {
      setSelectedBatchId(newItems[0].id);
      setStickerTitle(newItems[0].stickerTitle);
      setActivePalette(newItems[0].colorPalette);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files) {
      handleMultipleImageUpload(e.dataTransfer.files);
    }
  };

  const handleRemoveBatchItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBatchItems((prev) => {
      const filtered = prev.filter((item) => item.id !== id);
      if (selectedBatchId === id && filtered.length > 0) {
        setSelectedBatchId(filtered[0].id);
        setStickerTitle(filtered[0].stickerTitle);
      }
      return filtered;
    });
  };

  const handleSelectBatchItem = (item: BatchImageItem) => {
    setSelectedBatchId(item.id);
    setStickerTitle(item.stickerTitle);
    setAspectRatio(item.aspectRatio);
    setActivePalette(item.colorPalette);
    setBeachTag(item.beachTag);
  };

  const handleBatchVectorizeAll = () => {
    const unvectorizedCount = batchItems.filter((i) => !i.vectorized).length;
    if (unvectorizedCount === 0) return;

    setIsBatchProcessing(true);

    setTimeout(() => {
      setBatchItems((prev) =>
        prev.map((item) => ({
          ...item,
          vectorized: true,
        }))
      );
      setIsBatchProcessing(false);

      const earnedAmount = unvectorizedCount * 120;
      onEarnHarmony(
        earnedAmount,
        `Batch Vectorized ${unvectorizedCount} Coastal Images (+${earnedAmount} Harmony Notes)`
      );
    }, 1200);
  };

  const handleGenerateVector = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/vectorize-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userPrompt: prompt, aspectRatio }),
      });
      const data = await res.json();

      if (data.title) setStickerTitle(data.title);
      if (data.colorPalette && Array.isArray(data.colorPalette)) setActivePalette(data.colorPalette);
      if (data.stickerStyle) setStickerStyle(data.stickerStyle);
      if (data.beachSlangTag) setBeachTag(data.beachSlangTag);

      if (!hasCreated) {
        onEarnHarmony(120, 'Created Vector Art Sticker');
        setHasCreated(true);
      }
    } catch (err) {
      console.error('Vector AI error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadSVG = () => {
    const svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 ${aspectRatio === '1:1' ? '500' : '888'}" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${activePalette[0]}" />
      <stop offset="50%" stop-color="${activePalette[1]}" />
      <stop offset="100%" stop-color="${activePalette[2]}" />
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <rect width="100%" height="100%" fill="${activePalette[3]}" rx="32" />

  <path d="M 50 ${aspectRatio === '1:1' ? '250' : '444'} Q 250 50 450 ${aspectRatio === '1:1' ? '250' : '444'} T 50 ${aspectRatio === '1:1' ? '250' : '444'}" fill="url(#bgGrad)" filter="url(#glow)" />
  <circle cx="250" cy="${aspectRatio === '1:1' ? '250' : '444'}" r="120" fill="none" stroke="${activePalette[4]}" stroke-width="8" />

  <ellipse cx="250" cy="${aspectRatio === '1:1' ? '250' : '444'}" rx="30" ry="140" fill="${activePalette[1]}" stroke="${activePalette[4]}" stroke-width="6" transform="rotate(-25 250 ${aspectRatio === '1:1' ? '250' : '444'})" />

  <text x="250" y="${aspectRatio === '1:1' ? '420' : '800'}" text-anchor="middle" fill="${activePalette[4]}" font-family="sans-serif" font-weight="bold" font-size="24">${stickerTitle}</text>
  <text x="250" y="${aspectRatio === '1:1' ? '450' : '830'}" text-anchor="middle" fill="${activePalette[1]}" font-family="sans-serif" font-size="16">${beachTag}</text>
</svg>
    `;

    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${stickerTitle.toLowerCase().replace(/\s+/g, '_')}_vector.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShareToStream = () => {
    setIsSharedToStream(true);
    onEarnHarmony(50, `Shared Vector Artwork "${stickerTitle}" to Port Waikato Node Stream`);
  };

  const activeBatchItem = batchItems.find((i) => i.id === selectedBatchId);
  const unvectorizedCount = batchItems.filter((i) => !i.vectorized).length;

  return (
    <div className="space-y-6 text-[#e0e0e0]">
      {/* Module Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111] border-l-4 border-[#F27D26] border-y border-r border-[#333] p-5">
        <div>
          <h2 className="text-xl font-black italic uppercase tracking-tight text-[#e0e0e0] flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-[#F27D26]" />
            Batch Vector Art & Sticker Studio
          </h2>
          <p className="text-xs font-mono opacity-60 uppercase tracking-wider mt-1">
            SELECT MULTIPLE PHOTOS AT ONCE. EXTRACT 1:1 STICKERS OR 9:16 AR OVERLAYS IN BATCH. EXPORT CLEAN SVGS.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#00FF88] text-black font-mono font-bold text-xs px-3.5 py-2 uppercase tracking-wider">
          <Coins className="w-4 h-4 text-black" />
          <span>EARN +120 HARMONY NOTES PER CREATION</span>
        </div>
      </div>

      {/* Multi-Image Upload & Batch Queue Workbench */}
      <div className="bg-[#111] border border-[#333] p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#333] pb-3 font-mono">
          <div>
            <h3 className="font-black italic uppercase text-sm text-[#e0e0e0] flex items-center gap-2 tracking-wider">
              <FolderPlus className="w-4.5 h-4.5 text-[#F27D26]" />
              Multi-Image Batch Upload Queue
            </h3>
            <p className="text-xs text-[#888] uppercase mt-0.5">
              Select multiple surf session photos or drop files below to vectorize as a batch.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {unvectorizedCount > 0 && (
              <button
                onClick={handleBatchVectorizeAll}
                disabled={isBatchProcessing}
                className="px-4 py-2 bg-[#00FF88] hover:bg-[#33ff9f] text-black font-black uppercase text-xs transition-all shadow-md flex items-center gap-1.5 border border-[#00FF88]"
              >
                <Zap className="w-4 h-4 text-black fill-black" />
                <span>
                  {isBatchProcessing
                    ? 'Processing Batch...'
                    : `Vectorize All (${unvectorizedCount} Left)`}
                </span>
              </button>
            )}

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-[#F27D26] hover:bg-[#ff8a38] text-black font-black uppercase text-xs transition-all shadow-md flex items-center gap-1.5 border border-[#F27D26]"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Multiple Images</span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => handleMultipleImageUpload(e.target.files)}
            />
          </div>
        </div>

        {/* Drag and Drop Dropzone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed p-6 text-center transition-all cursor-pointer font-mono ${
            isDragOver
              ? 'border-[#00FF88] bg-[#00FF88]/10'
              : 'border-[#333] hover:border-[#F27D26] bg-[#050505]'
          }`}
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <Upload className={`w-8 h-8 ${isDragOver ? 'text-[#00FF88]' : 'text-[#F27D26]'}`} />
            <div className="text-xs font-bold uppercase text-[#e0e0e0]">
              Drag & Drop Multiple Coastal Photos or Click to Browse
            </div>
            <p className="text-[10px] text-[#888] uppercase">
              Supports PNG, JPG, WEBP • Upload full photo shoots or artwork folders at once
            </p>
          </div>
        </div>

        {/* Uploaded Batch Thumbnails Grid */}
        {batchItems.length > 0 && (
          <div className="space-y-2 font-mono">
            <div className="flex justify-between items-center text-[10px] text-[#888] uppercase font-bold">
              <span>Batch Queue ({batchItems.length} Images Loaded)</span>
              <span>Click any image to preview & edit vector properties</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {batchItems.map((item) => {
                const isSelected = item.id === selectedBatchId;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectBatchItem(item)}
                    className={`relative p-2.5 border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#1a1a1a] border-[#F27D26] shadow-md shadow-[#F27D26]/10'
                        : 'bg-[#050505] border-[#222] hover:border-[#444]'
                    }`}
                  >
                    {/* Thumbnail representation */}
                    <div className="w-full h-20 bg-[#111] border border-[#333] flex items-center justify-center overflow-hidden relative mb-2">
                      {item.previewUrl ? (
                        <img
                          src={item.previewUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FileImage className="w-8 h-8 text-[#555]" />
                      )}

                      {/* Vectorized badge */}
                      {item.vectorized ? (
                        <span className="absolute top-1 left-1 bg-[#00FF88] text-black text-[9px] font-black px-1.5 py-0.5 uppercase flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" />
                          SVG
                        </span>
                      ) : (
                        <span className="absolute top-1 left-1 bg-[#222] text-[#aaa] border border-[#333] text-[9px] font-bold px-1.5 py-0.5 uppercase">
                          RAW
                        </span>
                      )}

                      {/* Remove button */}
                      <button
                        onClick={(e) => handleRemoveBatchItem(item.id, e)}
                        className="absolute top-1 right-1 bg-black/80 hover:bg-red-900 text-[#aaa] hover:text-white p-1 transition-colors"
                        title="Remove from batch"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="space-y-1">
                      <div className="text-xs font-bold text-[#e0e0e0] truncate uppercase">
                        {item.stickerTitle}
                      </div>
                      <div className="flex justify-between text-[9px] text-[#777]">
                        <span>{item.aspectRatio}</span>
                        <span>{item.size}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Main Creation Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Controls & Prompting */}
        <div className="lg:col-span-5 bg-[#111] border border-[#333] p-5 space-y-5">
          <h3 className="font-black italic uppercase text-sm text-[#e0e0e0] flex items-center gap-2 tracking-wider">
            <Sparkles className="w-4 h-4 text-[#F27D26]" />
            AI Vector Prompt & Aspect Ratio
          </h3>

          <div>
            <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-[#aaa] mb-1.5">
              Describe surf session or vector sticker idea
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              placeholder="e.g. Glowing neon sea turtle riding a turquoise wave at sunset..."
              className="w-full bg-[#050505] border border-[#333] p-3 text-sm font-mono text-[#e0e0e0] placeholder-[#555] focus:outline-none focus:border-[#F27D26] transition-colors"
            />
          </div>

          {/* Aspect Ratio Selection */}
          <div>
            <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-[#aaa] mb-2 flex items-center gap-1">
              <Ratio className="w-3.5 h-3.5 text-[#00E5FF]" />
              Target Aspect Ratio
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAspectRatio('1:1')}
                className={`p-3 border text-xs font-mono font-bold uppercase tracking-wider flex flex-col items-center gap-1.5 transition-all ${
                  aspectRatio === '1:1'
                    ? 'bg-[#F27D26] text-black border-[#F27D26]'
                    : 'bg-[#050505] border-[#333] text-[#aaa] hover:text-[#e0e0e0]'
                }`}
              >
                <div className="w-5 h-5 border-2 border-current" />
                <span>1:1 Square Sticker</span>
              </button>

              <button
                type="button"
                onClick={() => setAspectRatio('9:16')}
                className={`p-3 border text-xs font-mono font-bold uppercase tracking-wider flex flex-col items-center gap-1.5 transition-all ${
                  aspectRatio === '9:16'
                    ? 'bg-[#F27D26] text-black border-[#F27D26]'
                    : 'bg-[#050505] border-[#333] text-[#aaa] hover:text-[#e0e0e0]'
                }`}
              >
                <div className="w-4 h-6 border-2 border-current" />
                <span>9:16 AR Lens</span>
              </button>
            </div>
          </div>

          {/* Preset Color Palettes */}
          <div>
            <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-[#aaa] mb-2 flex items-center gap-1">
              <Palette className="w-3.5 h-3.5 text-[#FFD700]" />
              Coastal Color Palette
            </label>
            <div className="space-y-2">
              {presetPalettes.map((pal, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActivePalette(pal.colors)}
                  className={`w-full p-2.5 border flex items-center justify-between text-xs font-mono transition-all ${
                    JSON.stringify(activePalette) === JSON.stringify(pal.colors)
                      ? 'bg-[#1a1a1a] border-[#00E5FF] text-[#00E5FF]'
                      : 'bg-[#050505] border-[#333] text-[#aaa] hover:text-[#e0e0e0]'
                  }`}
                >
                  <span className="font-bold uppercase">{pal.name}</span>
                  <div className="flex items-center gap-1">
                    {pal.colors.map((c, cIdx) => (
                      <span
                        key={cIdx}
                        className="w-3.5 h-3.5 border border-[#000]"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Sticker Contour Options */}
          <div className="flex items-center justify-between bg-[#050505] p-3 border border-[#333] text-xs font-mono">
            <span className="text-[#aaa] uppercase text-[11px]">Vector Contour Outline</span>
            <button
              type="button"
              onClick={() => setBorderGlow(!borderGlow)}
              className={`px-3 py-1 text-[10px] font-black uppercase border ${
                borderGlow ? 'bg-[#00FF88] text-black border-[#00FF88]' : 'bg-[#222] text-[#888] border-[#333]'
              }`}
            >
              {borderGlow ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>

          {/* Action Button */}
          <button
            onClick={handleGenerateVector}
            disabled={isGenerating}
            className="w-full py-3 bg-[#F27D26] hover:bg-[#ff8a38] text-black font-black italic uppercase tracking-wider text-sm transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-black" />
            <span>{isGenerating ? 'Synthesizing Vector...' : 'Generate AI Vector Art'}</span>
          </button>
        </div>

        {/* Right Column: Live Vector Preview & SVG Canvas */}
        <div className="lg:col-span-7 bg-[#111] border border-[#333] p-5 flex flex-col items-center justify-between space-y-4">
          <div className="w-full flex items-center justify-between text-xs font-mono border-b border-[#333] pb-3">
            <span className="font-bold text-[#e0e0e0] flex items-center gap-1.5 uppercase">
              <Layers className="w-4 h-4 text-[#00E5FF]" />
              Live Vector Canvas ({aspectRatio})
            </span>
            <span className="text-[#00FF88] uppercase text-[10px]">
              {activeBatchItem ? `Active: ${activeBatchItem.name}` : stickerStyle}
            </span>
          </div>

          {/* Interactive SVG Renderer */}
          <div className="w-full flex items-center justify-center py-4">
            <div
              className={`relative bg-[#050505] border-2 border-[#333] p-6 flex flex-col items-center justify-center transition-all ${
                aspectRatio === '1:1' ? 'w-80 h-80' : 'w-64 h-96'
              } ${borderGlow ? 'border-[#00E5FF]' : ''}`}
            >
              <svg
                className="w-full h-full"
                viewBox={`0 0 500 ${aspectRatio === '1:1' ? '500' : '888'}`}
                fill="none"
              >
                <rect width="100%" height="100%" fill={activePalette[3]} />
                <path
                  d={`M 40 ${aspectRatio === '1:1' ? '250' : '444'} Q 250 80 460 ${aspectRatio === '1:1' ? '250' : '444'} T 40 ${aspectRatio === '1:1' ? '250' : '444'}`}
                  fill={activePalette[0]}
                  stroke={activePalette[4]}
                  strokeWidth="8"
                />
                <circle cx="250" cy={aspectRatio === '1:1' ? '250' : '444'} r="90" fill="none" stroke={activePalette[2]} strokeWidth="6" strokeDasharray="12 12" />
                <ellipse
                  cx="250"
                  cy={aspectRatio === '1:1' ? '250' : '444'}
                  rx="28"
                  ry="130"
                  fill={activePalette[1]}
                  stroke={activePalette[4]}
                  strokeWidth="6"
                  transform={`rotate(-25 250 ${aspectRatio === '1:1' ? '250' : '444'})`}
                />
                <text
                  x="250"
                  y={aspectRatio === '1:1' ? '410' : '800'}
                  textAnchor="middle"
                  fill={activePalette[4]}
                  fontWeight="bold"
                  fontSize="24"
                  fontFamily="sans-serif"
                >
                  {stickerTitle}
                </text>
                <text
                  x="250"
                  y={aspectRatio === '1:1' ? '440' : '830'}
                  textAnchor="middle"
                  fill={activePalette[1]}
                  fontSize="16"
                  fontFamily="sans-serif"
                >
                  {beachTag}
                </text>
              </svg>

              <div className="absolute top-3 right-3 bg-[#111] text-[#00E5FF] text-[10px] font-mono px-2 py-0.5 border border-[#333] font-bold uppercase">
                {aspectRatio} • SVG
              </div>
            </div>
          </div>

          {/* Export / Download Actions */}
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#333]">
            <div className="text-xs font-mono text-[#888]">
              TITLE: <strong className="text-[#e0e0e0]">{stickerTitle}</strong>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShareToStream}
                disabled={isSharedToStream}
                className={`px-4 py-2 font-black italic uppercase tracking-wider text-xs transition-all flex items-center gap-2 border ${
                  isSharedToStream
                    ? 'bg-[#00FF88] text-black border-[#00FF88]'
                    : 'bg-[#F27D26] hover:bg-[#ff8a38] text-black border-[#F27D26]'
                }`}
              >
                {isSharedToStream ? (
                  <>
                    <Check className="w-4 h-4 text-black" />
                    <span>Shared to Stream (+50)</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    <span>Share to Community Stream</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDownloadSVG}
                className="px-5 py-2 bg-[#00E5FF] hover:bg-[#33ebff] text-black font-black italic uppercase tracking-wider text-xs transition-all shadow-md flex items-center gap-2 border border-[#00E5FF]"
              >
                <Download className="w-4 h-4" />
                <span>Export Clean SVG</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Community Vector Sales & Gallery */}
      <div className="bg-[#111] border border-[#333] p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-black italic text-sm text-[#e0e0e0] uppercase flex items-center gap-2 tracking-wider">
              <ShoppingBag className="w-4 h-4 text-[#FFD700]" />
              Registered Artwork Sales & Community Catalog
            </h3>
            <p className="text-xs font-mono opacity-60 uppercase tracking-wider">
              DIRECT EARNINGS TO CREATORS WITH 90/9/1 SOVEREIGN SPLIT (`artwork_sales.json`).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              className="bg-[#050505] border border-[#333] p-4 flex flex-col justify-between space-y-3 hover:border-[#F27D26] transition-all"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-[#888] mb-1">
                  <span className="text-[10px] bg-[#111] px-2 py-0.5 text-[#00E5FF] border border-[#333] uppercase font-bold">
                    {item.type}
                  </span>
                  <span>⭐ {item.rating}</span>
                </div>
                <h4 className="font-bold text-[#e0e0e0] text-sm uppercase">{item.title}</h4>
                <p className="text-xs font-mono opacity-60">By {item.artist}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#222] text-xs">
                <span className="text-[#FFD700] font-mono font-bold flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5" />
                  {item.priceHarmony} Harmony
                </span>
                <span className="text-[#888] font-mono text-[11px]">{item.sales} sold</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


