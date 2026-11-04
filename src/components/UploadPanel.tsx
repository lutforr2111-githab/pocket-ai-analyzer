import React, { useRef, useState, useEffect } from 'react';
import {
  UploadCloud,
  Clipboard,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Crosshair,
  Trash2,
  Zap,
  TrendingUp,
  Image as ImageIcon,
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../data/translations';
import { SAMPLE_CHART_PRESETS } from '../data/sampleCharts';
import { SampleChartPreset } from '../types';

interface UploadPanelProps {
  language: Language;
  timeframe: string;
  setTimeframe: (val: string) => void;
  market: string;
  setMarket: (val: string) => void;
  strategy: string;
  setStrategy: (val: string) => void;
  imageData: string | null;
  setImageData: (val: string | null) => void;
  isAnalyzing: boolean;
  onAnalyze: () => void;
}

export const UploadPanel: React.FC<UploadPanelProps> = ({
  language,
  timeframe,
  setTimeframe,
  market,
  setMarket,
  strategy,
  setStrategy,
  imageData,
  setImageData,
  isAnalyzing,
  onAnalyze,
}) => {
  const t = TRANSLATIONS[language];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showCrosshair, setShowCrosshair] = useState<boolean>(false);
  const [crosshairPos, setCrosshairPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  // Global paste handler
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) {
            handleFileUpload(file);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const handleFileUpload = (file: File) => {
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      alert(language === 'bn' ? 'অনুগ্রহ করে PNG, JPG অথবা WEBP ফাইল আপলোড করুন।' : 'Please upload a PNG, JPG, or WEBP image.');
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      alert(language === 'bn' ? 'ফাইলের আকার ২৫ মেগাবাইটের কম হতে হবে।' : 'Image size must be smaller than 25MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImageData(result);
      setZoomLevel(1);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const loadSample = (preset: SampleChartPreset) => {
    setImageData(preset.imageDataUrl);
    setTimeframe(preset.timeframe);
    setMarket(preset.market);
    setZoomLevel(1);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setCrosshairPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-2xl relative overflow-hidden">
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Selectors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        {/* Timeframe */}
        <div>
          <label className="block text-xs font-bold tracking-wider text-slate-400 mb-2">
            {t.timeframe}
          </label>
          <div className="relative">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-700 hover:border-slate-600 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer font-medium"
            >
              <option value="1 minute">1 Minute (M1 Scalp)</option>
              <option value="2 minutes">2 Minutes (M2)</option>
              <option value="3 minutes">3 Minutes (M3 Swing)</option>
              <option value="5 minutes">5 Minutes (M5 Trend)</option>
              <option value="15 minutes">15 Minutes (M15 Structure)</option>
            </select>
          </div>
        </div>

        {/* Market Type */}
        <div>
          <label className="block text-xs font-bold tracking-wider text-slate-400 mb-2">
            {t.marketType}
          </label>
          <div className="relative">
            <select
              value={market}
              onChange={(e) => setMarket(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-700 hover:border-slate-600 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer font-medium"
            >
              <option value="Real Market">Real Market (Forex & Pairs)</option>
              <option value="OTC Market">Pocket Option OTC Market</option>
              <option value="Crypto Pairs">Crypto OTC / Live (BTC, ETH)</option>
              <option value="Commodities">Commodities & Indices</option>
            </select>
          </div>
        </div>

        {/* Strategy Focus */}
        <div>
          <label className="block text-xs font-bold tracking-wider text-slate-400 mb-2">
            {t.analysisStrategy}
          </label>
          <div className="relative">
            <select
              value={strategy}
              onChange={(e) => setStrategy(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-700 hover:border-slate-600 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer font-medium"
            >
              <option value="Scalping (1-3 min)">Pocket Option Scalping (1-3 min)</option>
              <option value="Support/Resistance Bounce">Support & Resistance Reversals</option>
              <option value="Trend Continuation">EMA Trend Continuation</option>
              <option value="Breakout Momentum">High-Momentum Breakout</option>
            </select>
          </div>
        </div>
      </div>

      {/* Preset sample charts for instant testing */}
      <div className="mb-5 bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
            {t.trySampleCharts}
          </span>
          <span className="text-[11px] text-slate-400 font-medium">Click to load instantly</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {SAMPLE_CHART_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => loadSample(preset)}
              className="text-left p-2 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 transition-all text-xs group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {preset.pair}
                </span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                    preset.expectedDirection === 'UP'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : preset.expectedDirection === 'DOWN'
                      ? 'bg-rose-500/20 text-rose-400'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}
                >
                  {preset.expectedDirection}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-1">
                {preset.name}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Upload & Dropzone */}
      <div className="mb-5">
        <label className="block text-xs font-bold tracking-wider text-slate-400 mb-2">
          {t.uploadTitle}
        </label>

        {!imageData ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border-2 border-dashed rounded-xl p-8 md:p-10 text-center cursor-pointer transition-all ${
              isDragOver
                ? 'border-emerald-400 bg-emerald-500/10 scale-[1.01]'
                : 'border-slate-700/80 hover:border-emerald-500/60 bg-slate-950/40 hover:bg-slate-950/70'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
            />
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-emerald-400">
              <UploadCloud className="w-7 h-7" />
            </div>
            <p className="text-sm md:text-base font-bold text-white mb-1">
              {t.uploadInstruction}
            </p>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              {t.uploadSupportText}
            </p>
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/70 text-slate-300 text-xs font-medium">
              <Clipboard className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tip: Take a screenshot (Win+Shift+S or PrtSc) and press <strong>Ctrl+V</strong></span>
            </div>
          </div>
        ) : (
          <div className="relative border border-slate-700/80 rounded-xl overflow-hidden bg-slate-950">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                <ImageIcon className="w-4 h-4 text-emerald-400" />
                <span>Chart Preview ({zoomLevel.toFixed(1)}x)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setShowCrosshair(!showCrosshair)}
                  className={`p-1.5 rounded hover:bg-slate-800 transition-colors cursor-pointer ${
                    showCrosshair ? 'text-emerald-400 bg-slate-800' : 'text-slate-400'
                  }`}
                  title={t.crosshairToggle}
                >
                  <Crosshair className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.25))}
                  className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  title={t.zoomIn}
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoomLevel((z) => Math.max(0.75, z - 0.25))}
                  className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  title={t.zoomOut}
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoomLevel(1)}
                  className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  title={t.resetZoom}
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <div className="h-4 w-px bg-slate-700 mx-1" />
                <button
                  onClick={() => setImageData(null)}
                  className="p-1.5 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  title={t.clearChart}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Image Canvas with Zoom & Crosshair */}
            <div
              ref={containerRef}
              onMouseMove={handleMouseMove}
              className="relative max-h-[440px] overflow-auto p-2 flex items-center justify-center bg-slate-950 cursor-crosshair select-none"
            >
              <img
                src={imageData}
                alt="Pocket Option Chart"
                style={{
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: 'center center',
                  transition: 'transform 0.15s ease-out',
                }}
                className="max-h-[400px] w-auto max-w-full object-contain rounded"
              />

              {/* Crosshair Overlay */}
              {showCrosshair && (
                <>
                  <div
                    className="absolute top-0 bottom-0 border-l border-emerald-400/60 pointer-events-none"
                    style={{ left: `${crosshairPos.x}px` }}
                  />
                  <div
                    className="absolute left-0 right-0 border-t border-emerald-400/60 pointer-events-none"
                    style={{ top: `${crosshairPos.y}px` }}
                  />
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Big Action Button */}
      <button
        onClick={onAnalyze}
        disabled={!imageData || isAnalyzing}
        className={`w-full py-4 px-6 rounded-xl font-black text-base tracking-wider transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer shadow-lg ${
          !imageData
            ? 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-60'
            : isAnalyzing
            ? 'bg-emerald-600 text-white animate-pulse cursor-wait'
            : 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 hover:shadow-emerald-500/30 hover:scale-[1.01] active:scale-[0.99]'
        }`}
      >
        <Zap className={`w-5 h-5 ${isAnalyzing ? 'animate-spin' : 'fill-slate-950'}`} />
        <span>{isAnalyzing ? t.analyzingButton : t.analyzeButton}</span>
      </button>
    </div>
  );
};
