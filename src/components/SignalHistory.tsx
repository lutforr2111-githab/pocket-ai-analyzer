import React from 'react';
import { History, Trash2, CheckCircle, XCircle, MinusCircle, Award } from 'lucide-react';
import { AnalysisHistoryItem } from '../types';
import { Language, TRANSLATIONS } from '../data/translations';

interface SignalHistoryProps {
  history: AnalysisHistoryItem[];
  onClearHistory: () => void;
  onUpdateOutcome: (id: string, outcome: 'win' | 'loss' | 'tie' | 'skipped') => void;
  onSelectHistoryItem: (item: AnalysisHistoryItem) => void;
  language: Language;
}

export const SignalHistory: React.FC<SignalHistoryProps> = ({
  history,
  onClearHistory,
  onUpdateOutcome,
  onSelectHistoryItem,
  language,
}) => {
  const t = TRANSLATIONS[language];

  const totalDecided = history.filter((h) => h.outcome === 'win' || h.outcome === 'loss').length;
  const totalWins = history.filter((h) => h.outcome === 'win').length;
  const winRate = totalDecided > 0 ? Math.round((totalWins / totalDecided) * 100) : null;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-bold text-white">{t.signalHistory}</h3>
          <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-slate-800 text-slate-300 border border-slate-700">
            {history.length}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {winRate !== null && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 font-bold">
              <Award className="w-3.5 h-3.5" />
              <span>Session Win Rate: {winRate}% ({totalWins}/{totalDecided})</span>
            </div>
          )}

          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              className="text-xs text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t.clearHistory}</span>
            </button>
          )}
        </div>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-6 text-xs text-slate-500">
          {t.noHistory}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
          {history.map((item) => {
            const isUp = item.direction === 'UP';
            const isDown = item.direction === 'DOWN';

            return (
              <div
                key={item.id}
                className="p-3 bg-slate-950/70 border border-slate-800/90 hover:border-slate-700 rounded-xl flex items-center justify-between gap-3 text-xs transition-all"
              >
                <div
                  onClick={() => onSelectHistoryItem(item)}
                  className="flex items-center gap-3 cursor-pointer flex-1 overflow-hidden"
                >
                  <img
                    src={item.thumbnail}
                    alt="Thumbnail"
                    className="w-12 h-10 object-cover rounded bg-slate-900 border border-slate-800 shrink-0"
                  />
                  <div className="overflow-hidden">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white truncate">{item.asset}</span>
                      <span
                        className={`font-black text-[10px] px-1.5 py-0.2 rounded ${
                          isUp
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : isDown
                            ? 'bg-rose-500/20 text-rose-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        {item.direction}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <span>{item.confidence}% conf</span>
                      <span>•</span>
                      <span>{item.timeframe}</span>
                    </div>
                  </div>
                </div>

                {/* Outcome tracker buttons */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => onUpdateOutcome(item.id, 'win')}
                    className={`p-1.5 rounded transition-all cursor-pointer ${
                      item.outcome === 'win'
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'text-slate-500 hover:text-emerald-400 hover:bg-slate-900'
                    }`}
                    title={t.markWin}
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onUpdateOutcome(item.id, 'loss')}
                    className={`p-1.5 rounded transition-all cursor-pointer ${
                      item.outcome === 'loss'
                        ? 'bg-rose-500 text-white font-bold'
                        : 'text-slate-500 hover:text-rose-400 hover:bg-slate-900'
                    }`}
                    title={t.markLoss}
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onUpdateOutcome(item.id, 'skipped')}
                    className={`p-1.5 rounded transition-all cursor-pointer ${
                      item.outcome === 'skipped'
                        ? 'bg-slate-700 text-slate-200 font-bold'
                        : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900'
                    }`}
                    title={t.markSkip}
                  >
                    <MinusCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
