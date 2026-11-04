import React from 'react';
import { X, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { CANDLESTICK_GUIDES } from '../data/cheatSheet';
import { Language, TRANSLATIONS } from '../data/translations';

interface PatternGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const PatternGuideModal: React.FC<PatternGuideModalProps> = ({ isOpen, onClose, language }) => {
  const t = TRANSLATIONS[language];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {t.cheatSheetTab}
              </h3>
              <p className="text-xs text-slate-400">
                High Win-Rate Pocket Option Price Action Candlestick Setups
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CANDLESTICK_GUIDES.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/90 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0"
                        dangerouslySetInnerHTML={{ __html: item.svgIcon }}
                      />
                      <div>
                        <h4 className="text-sm font-bold text-white">
                          {item.title}
                        </h4>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                            item.type === 'Bullish'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : item.type === 'Bearish'
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {item.type} • Win Est: {item.successRate}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 mb-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-800/60 bg-slate-900/40 rounded-lg p-2.5 text-[11px] text-emerald-300/90 flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Pocket Option Tip: </strong>
                    {item.pocketOptionTip}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong>Timing Rule: </strong>
              Always synchronize your trade click with the start of the new candle at <strong>00 seconds</strong>. Avoid entering when more than 15 seconds have passed on a 1-minute candle.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
