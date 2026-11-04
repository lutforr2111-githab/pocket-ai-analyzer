import React, { useState } from 'react';
import {
  Activity,
  Layers,
  BarChart2,
  GitCommit,
  Shield,
  FileText,
  Copy,
  Check,
  Languages,
  Flame,
} from 'lucide-react';
import { AnalysisResult } from '../types';
import { Language, TRANSLATIONS } from '../data/translations';

interface TechnicalDetailsProps {
  result: AnalysisResult | null;
  language: Language;
}

export const TechnicalDetails: React.FC<TechnicalDetailsProps> = ({ result, language }) => {
  const t = TRANSLATIONS[language];
  const [copied, setCopied] = useState<boolean>(false);

  if (!result) {
    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-base font-bold text-slate-300 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-400" />
          <span>{t.techAnalysisTitle}</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs text-slate-500">
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">EMA 9 / EMA 21: Pending</div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">RSI / Oscillator: Pending</div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">Bollinger Bands: Pending</div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">Support & Resistance: Pending</div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">Candlestick Pattern: Pending</div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">Risk Assessment: Pending</div>
        </div>
      </div>
    );
  }

  const copyToClipboard = () => {
    const textToCopy = `⚡ POCKET OPTION AI TRADING SIGNAL ⚡
Direction: ${result.direction} (${result.action})
Confidence: ${result.confidence}%
Expiration: ${result.expiration}
Entry Timing: ${result.entryTiming}
Pattern: ${result.pattern}
Trend: ${result.trend}
EMA: ${result.ema}
RSI: ${result.rsi}
Support/Resistance: ${result.levels}
Risk: ${result.risk}
Rationale: ${result.reason}
${result.summaryBengali ? `\nবাংলা বিবরণ: ${result.summaryBengali}` : ''}
`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getRiskColor = (riskStr: string) => {
    const lower = riskStr.toLowerCase();
    if (lower.includes('low')) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (lower.includes('high')) return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
    return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      {/* Header bar with Copy button */}
      <div className="flex items-center justify-between gap-3 mb-5 border-b border-slate-800 pb-3">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-400" />
          <span>{t.techAnalysisTitle}</span>
        </h3>

        <button
          onClick={copyToClipboard}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
          <span>{copied ? t.copied : t.copySummary}</span>
        </button>
      </div>

      {/* Grid of Key Technical Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mb-6">
        {/* Trend */}
        <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-1.5">
            <Flame className="w-4 h-4 text-orange-400" />
            <span>{t.trendLabel}</span>
          </div>
          <p className="text-xs font-semibold text-slate-200">
            {result.trend || 'Unknown Trend'}
          </p>
        </div>

        {/* EMA 9 / 21 */}
        <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-1.5">
            <GitCommit className="w-4 h-4 text-cyan-400" />
            <span>{t.emaLabel}</span>
          </div>
          <p className="text-xs font-semibold text-slate-200">
            {result.ema || 'Neutral / Flat'}
          </p>
        </div>

        {/* RSI */}
        <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-1.5">
            <BarChart2 className="w-4 h-4 text-purple-400" />
            <span>{t.rsiLabel}</span>
          </div>
          <p className="text-xs font-semibold text-slate-200">
            {result.rsi || 'Neutral zone'}
          </p>
        </div>

        {/* Bollinger Bands */}
        <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-1.5">
            <Layers className="w-4 h-4 text-teal-400" />
            <span>{t.bollingerLabel}</span>
          </div>
          <p className="text-xs font-semibold text-slate-200">
            {result.bollinger || 'Normal volatility'}
          </p>
        </div>

        {/* Support & Resistance */}
        <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-1.5">
            <span className="text-sm">🧱</span>
            <span>{t.levelsLabel}</span>
          </div>
          <p className="text-xs font-semibold text-slate-200">
            {result.levels || 'Not clearly established'}
          </p>
        </div>

        {/* Candlestick Pattern */}
        <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-1.5">
            <span className="text-sm">🕯️</span>
            <span>{t.patternLabel}</span>
          </div>
          <p className="text-xs font-semibold text-emerald-400">
            {result.pattern || 'Standard Candles'}
          </p>
        </div>
      </div>

      {/* Risk Assessment Badge */}
      <div className="mb-5 p-3.5 rounded-xl border bg-slate-950/80 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-slate-400" />
          <span className="font-bold text-slate-300">{t.riskLabel}:</span>
          <span className={`px-2.5 py-0.5 rounded-full font-bold border text-[11px] ${getRiskColor(result.risk)}`}>
            {result.risk}
          </span>
        </div>
      </div>

      {/* Full AI Technical Rationale */}
      <div className="mb-5 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300 mb-2">
          <FileText className="w-4 h-4 text-emerald-400" />
          <span>{t.aiReasoningLabel}</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
          {result.reason}
        </p>
      </div>

      {/* Bengali Summary Card */}
      {result.summaryBengali && (
        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-2">
            <Languages className="w-4 h-4" />
            <span>{t.bengaliSummaryLabel}</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
            {result.summaryBengali}
          </p>
        </div>
      )}
    </div>
  );
};
