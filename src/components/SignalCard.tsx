import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  PauseCircle,
  Timer,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import { AnalysisResult } from '../types';
import { Language, TRANSLATIONS } from '../data/translations';

interface SignalCardProps {
  result: AnalysisResult | null;
  isAnalyzing: boolean;
  language: Language;
}

export const SignalCard: React.FC<SignalCardProps> = ({ result, isAnalyzing, language }) => {
  const t = TRANSLATIONS[language];

  if (isAnalyzing) {
    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 text-center shadow-xl relative overflow-hidden">
        <div className="flex flex-col items-center justify-center py-8">
          <div className="relative w-20 h-20 mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-slate-800 animate-ping opacity-25" />
            <div className="w-full h-full rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin flex items-center justify-center" />
            <div className="absolute inset-0 flex items-center justify-center text-xl">
              ⚡
            </div>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{t.analyzingButton}</h3>
          <p className="text-sm text-slate-400 max-w-sm">
            Evaluating candlestick wicks, EMA 9/21 crossovers, RSI divergence & support/resistance zones...
          </p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 text-center shadow-xl">
        <div className="py-6">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-500">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-400 mb-1">{t.waitingStatus}</h3>
          <p className="text-xs text-slate-500">{t.uploadPrompt}</p>
        </div>
      </div>
    );
  }

  const isUp = result.direction === 'UP';
  const isDown = result.direction === 'DOWN';
  const isWait = result.direction === 'NO TRADE';

  const themeConfig = isUp
    ? {
        border: 'border-emerald-500/40',
        bg: 'bg-emerald-950/20',
        glow: 'shadow-emerald-500/10',
        badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        text: 'text-emerald-400',
        signalText: t.directionUp,
        icon: TrendingUp,
      }
    : isDown
    ? {
        border: 'border-rose-500/40',
        bg: 'bg-rose-950/20',
        glow: 'shadow-rose-500/10',
        badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        text: 'text-rose-400',
        signalText: t.directionDown,
        icon: TrendingDown,
      }
    : {
        border: 'border-amber-500/40',
        bg: 'bg-amber-950/20',
        glow: 'shadow-amber-500/10',
        badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        text: 'text-amber-400',
        signalText: t.directionWait,
        icon: PauseCircle,
      };

  const IconComponent = themeConfig.icon;

  return (
    <div
      className={`border rounded-2xl p-6 shadow-2xl relative overflow-hidden transition-all duration-300 ${themeConfig.border} ${themeConfig.bg} ${themeConfig.glow}`}
    >
      {/* Background radial highlight */}
      <div
        className={`absolute -top-12 -right-12 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none ${
          isUp ? 'bg-emerald-400' : isDown ? 'bg-rose-500' : 'bg-amber-400'
        }`}
      />

      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
        {/* Left: Signal Badge */}
        <div className="flex-1 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
            <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
              {t.aiSignalTitle}
            </span>
            {result.detectedAsset && (
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                {result.detectedAsset}
              </span>
            )}
          </div>

          <div className="flex items-center justify-center lg:justify-start gap-3 my-2">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-lg ${
                isUp
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-emerald-500/40'
                  : isDown
                  ? 'bg-rose-500 text-white border-rose-400 shadow-rose-500/40'
                  : 'bg-amber-500 text-slate-950 border-amber-400 shadow-amber-500/40'
              }`}
            >
              <IconComponent className="w-7 h-7" />
            </div>

            <h2 className={`text-2xl sm:text-3xl font-black tracking-tight ${themeConfig.text}`}>
              {themeConfig.signalText}
            </h2>
          </div>

          <div className="text-xs text-slate-300 font-medium mt-1">
            {result.action && (
              <span className="mr-2 px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700 text-slate-200">
                Action: {result.action}
              </span>
            )}
            <span className="text-slate-400">
              Scan: {new Date(result.analyzedAt).toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Center: Confidence Gauge */}
        <div className="flex flex-col items-center justify-center px-6 py-3 bg-slate-950/70 border border-slate-800 rounded-xl min-w-[170px]">
          <span className="text-[11px] font-bold text-slate-400 mb-1">
            {t.confidenceLabel}
          </span>
          <div className="flex items-baseline gap-1">
            <span className={`text-4xl font-black ${themeConfig.text}`}>
              {Math.min(100, Math.max(0, result.confidence))}%
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full h-2 bg-slate-800 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                isUp ? 'bg-emerald-400' : isDown ? 'bg-rose-500' : 'bg-amber-400'
              }`}
              style={{ width: `${Math.min(100, Math.max(5, result.confidence))}%` }}
            />
          </div>
        </div>

        {/* Right: Expiry & Entry Timing */}
        <div className="flex-1 w-full lg:w-auto grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
            <div className="flex items-center gap-1.5 text-slate-400 font-bold mb-1">
              <Timer className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.recommendedExpiration}</span>
            </div>
            <p className="font-semibold text-white">
              {result.expiration || '1 Minute'}
            </p>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
            <div className="flex items-center gap-1.5 text-slate-400 font-bold mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
              <span>{t.entryTimingLabel}</span>
            </div>
            <p className="font-semibold text-white line-clamp-2">
              {result.entryTiming || 'Enter on candle open'}
            </p>
          </div>
        </div>
      </div>

      {/* Invalidation condition if available */}
      {result.invalidation && (
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-start gap-2 text-xs text-slate-400">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-300">{t.invalidationLabel}: </strong>
            <span>{result.invalidation}</span>
          </div>
        </div>
      )}
    </div>
  );
};
