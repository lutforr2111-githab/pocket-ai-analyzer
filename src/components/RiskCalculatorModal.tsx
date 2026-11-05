import React, { useState } from 'react';
import { X, ShieldAlert, DollarSign, Percent, AlertOctagon, CheckCircle2 } from 'lucide-react';
import { Language, TRANSLATIONS } from '../data/translations';

interface RiskCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const RiskCalculatorModal: React.FC<RiskCalculatorModalProps> = ({ isOpen, onClose, language }) => {
  const t = TRANSLATIONS[language];
  const [balance, setBalance] = useState<number>(100);
  const [riskPercent, setRiskPercent] = useState<number>(2);

  if (!isOpen) return null;

  const tradeSize = (balance * (riskPercent / 100)).toFixed(2);
  const maxConsecutiveLosses = Math.floor(100 / (riskPercent || 1));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {t.riskCalculatorTab}
              </h3>
              <p className="text-xs text-slate-400">
                Binary Options Capital Preservation & Stake Sizing
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

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Inputs */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              {t.balance}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <DollarSign className="w-4 h-4" />
              </div>
              <input
                type="number"
                min="10"
                max="100000"
                value={balance}
                onChange={(e) => setBalance(Math.max(1, Number(e.target.value) || 0))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-300">
                {t.riskPercent}
              </label>
              <span className="text-xs font-bold text-emerald-400">{riskPercent}%</span>
            </div>
            <div className="grid grid-cols-4 gap-2 mb-2">
              {[1, 2, 3, 5].map((pct) => (
                <button
                  key={pct}
                  onClick={() => setRiskPercent(pct)}
                  className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                    riskPercent === pct
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {pct}% {pct <= 2 ? '(Safe)' : pct === 3 ? '(Mod)' : '(Agg)'}
                </button>
              ))}
            </div>
          </div>

          {/* Results Summary Card */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">
                {t.calculatedStake}:
              </span>
              <span className="text-2xl font-black text-emerald-400 font-mono">
                ${tradeSize}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">
                {t.maxConsecutiveLosses}:
              </span>
              <span className="font-bold text-white font-mono">
                ~{maxConsecutiveLosses} Trades
              </span>
            </div>
          </div>

          {/* Golden Rules */}
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-200 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-rose-300">
              <AlertOctagon className="w-4 h-4" />
              <span>Martingale Warning (Never Multi-step Martingale!)</span>
            </div>
            <p className="text-[11px] text-rose-200/90 leading-relaxed">
              Doubling down on consecutive losses in Binary Options is the #1 reason traders lose accounts. Stick to fixed 1-2% stakes per signal. If you lose 3 trades in a row, take a break!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
