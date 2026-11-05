import React, { useEffect, useRef, useState } from 'react';
import {
  TrendingUp,
  Zap,
  Camera,
  Activity,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { POPULAR_SYMBOLS, TradingSymbol } from '../data/symbols';
import { Language, TRANSLATIONS } from '../data/translations';
import { generateLiveTradingViewSnapshot } from '../utils/liveChartCapture';

declare global {
  interface Window {
    TradingView?: any;
  }
}

interface TradingViewChartProps {
  language: Language;
  selectedSymbol: TradingSymbol;
  setSelectedSymbol: (symbol: TradingSymbol) => void;
  timeframe: string;
  setTimeframe: (tf: string) => void;
  isAnalyzing: boolean;
  onAnalyzeLive: (snapshotDataUrl: string, symbol: TradingSymbol) => void;
}

export const TradingViewChart: React.FC<TradingViewChartProps> = ({
  language,
  selectedSymbol,
  setSelectedSymbol,
  timeframe,
  setTimeframe,
  isAnalyzing,
  onAnalyzeLive,
}) => {
  const t = TRANSLATIONS[language];
  const containerRef = useRef<HTMLDivElement>(null);
  const [scriptLoaded, setScriptLoaded] = useState<boolean>(false);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);

  // Map timeframe string to TradingView interval format
  const getTvInterval = (tf: string): string => {
    if (tf.includes('1')) return '1';
    if (tf.includes('2')) return '2';
    if (tf.includes('3')) return '3';
    if (tf.includes('5')) return '5';
    if (tf.includes('15')) return '15';
    return '1';
  };

  // Load TradingView script once
  useEffect(() => {
    if (window.TradingView) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.id = 'tradingview-widget-script';
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.head.appendChild(script);

    return () => {
      // Keep script cached in head
    };
  }, []);

  // Initialize or re-create widget on symbol/timeframe change
  useEffect(() => {
    if (!scriptLoaded || !containerRef.current || !window.TradingView) return;

    // Clear previous widget
    containerRef.current.innerHTML = '';
    const widgetId = `tv_chart_${Date.now()}`;
    const widgetContainer = document.createElement('div');
    widgetContainer.id = widgetId;
    widgetContainer.style.width = '100%';
    widgetContainer.style.height = '100%';
    containerRef.current.appendChild(widgetContainer);

    try {
      new window.TradingView.widget({
        autosize: true,
        symbol: selectedSymbol.tradingViewSymbol,
        interval: getTvInterval(timeframe),
        timezone: 'Etc/UTC',
        theme: 'dark',
        style: '1', // Candlestick
        locale: 'en',
        toolbar_bg: '#080e1c',
        enable_publishing: false,
        hide_top_toolbar: false,
        hide_legend: false,
        save_image: true,
        container_id: widgetId,
        studies: [
          'Moving Average Exponential@tv-basicstudies',
          'Relative Strength Index@tv-basicstudies',
          'Bollinger Bands@tv-basicstudies',
        ],
        studies_overrides: {
          'moving average exponential.length': 9,
          'moving average exponential.color': '#ffd166',
        },
      });
    } catch (e) {
      console.warn('TradingView widget initialization notice:', e);
    }
  }, [scriptLoaded, selectedSymbol.id, timeframe]);

  // Handle 1-click live chart analysis
  const handleLiveAnalysisClick = async () => {
    setIsCapturing(true);
    try {
      // Capture live data & high-res chart snapshot
      const snapshot = await generateLiveTradingViewSnapshot(selectedSymbol, timeframe);
      onAnalyzeLive(snapshot.imageDataUrl, selectedSymbol);
    } catch (e) {
      console.error('Error generating live chart snapshot:', e);
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xl relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/3 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header & Selector Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 mb-4 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-black text-white tracking-wide">
                {t.tradingViewTitle}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {t.liveMarketFeed}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {t.tradingViewSubtitle}
            </p>
          </div>
        </div>

        {/* Symbol & Timeframe Controls */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          {/* Pair Select */}
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={selectedSymbol.id}
              onChange={(e) => {
                const found = POPULAR_SYMBOLS.find((s) => s.id === e.target.value);
                if (found) setSelectedSymbol(found);
              }}
              className="w-full bg-slate-950 border border-slate-700 hover:border-slate-600 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none cursor-pointer"
            >
              <optgroup label="Forex Pairs (Binary 85-92%)">
                {POPULAR_SYMBOLS.filter((s) => s.category === 'Forex').map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.payout})
                  </option>
                ))}
              </optgroup>
              <optgroup label="Crypto (91-95% Payout)">
                {POPULAR_SYMBOLS.filter((s) => s.category === 'Crypto').map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.payout})
                  </option>
                ))}
              </optgroup>
              <optgroup label="Commodities (Gold & Oil)">
                {POPULAR_SYMBOLS.filter((s) => s.category === 'Commodities').map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.payout})
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Timeframe Select */}
          <div className="relative">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="bg-slate-950 border border-slate-700 hover:border-slate-600 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none cursor-pointer"
            >
              <option value="1 minute">1m (Binary Scalp)</option>
              <option value="3 minutes">3m (Reversal)</option>
              <option value="5 minutes">5m (Trend)</option>
              <option value="15 minutes">15m (Structure)</option>
            </select>
          </div>

          {/* Payout Tag */}
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-black text-emerald-400">
            {selectedSymbol.payout} Payout
          </span>
        </div>
      </div>

      {/* TradingView Chart Frame */}
      <div className="relative w-full h-[450px] sm:h-[500px] rounded-xl overflow-hidden border border-slate-800 bg-[#080e1c]">
        <div ref={containerRef} className="w-full h-full" />
      </div>

      {/* Big Action Bar */}
      <div className="mt-4 pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Pro Tip */}
        <div className="text-xs text-slate-400 flex items-center gap-1.5 max-w-lg">
          <Camera className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{t.snapshotTip}</span>
        </div>

        {/* 1-Click Live Analysis Button */}
        <button
          onClick={handleLiveAnalysisClick}
          disabled={isAnalyzing || isCapturing}
          className={`w-full sm:w-auto px-6 py-3 rounded-xl font-black text-xs sm:text-sm tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
            isAnalyzing || isCapturing
              ? 'bg-emerald-600 text-white animate-pulse cursor-wait'
              : 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 hover:shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98]'
          }`}
        >
          <Zap className={`w-4 h-4 ${isAnalyzing || isCapturing ? 'animate-spin' : 'fill-slate-950'}`} />
          <span>
            {isAnalyzing || isCapturing
              ? t.analyzingLiveBtn
              : `${language === 'bn' ? '⚡ লাইভ ' + selectedSymbol.name + ' অ্যানালাইসিস করুন' : '⚡ ANALYZE LIVE ' + selectedSymbol.name + ' NOW'}`}
          </span>
        </button>
      </div>
    </div>
  );
};
