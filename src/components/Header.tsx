import React, { useState, useEffect } from 'react';
import { Activity, Globe, Volume2, VolumeX, ShieldAlert, Clock, Sparkles } from 'lucide-react';
import { Language, TRANSLATIONS } from '../data/translations';

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  voiceEnabled: boolean;
  setVoiceEnabled: (enabled: boolean) => void;
  onOpenCheatSheet: () => void;
  onOpenRiskCalc: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  setLanguage,
  voiceEnabled,
  setVoiceEnabled,
  onOpenCheatSheet,
  onOpenRiskCalc,
}) => {
  const t = TRANSLATIONS[language];
  const [currentUtc, setCurrentUtc] = useState<string>('');
  const [activeSessions, setActiveSessions] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentUtc(
        now.toUTCString().replace('GMT', 'UTC')
      );

      // Financial market sessions in UTC hours
      // London: 08:00 - 16:30 UTC
      // New York: 13:00 - 21:00 UTC
      // Tokyo: 00:00 - 09:00 UTC
      // Sydney: 21:00 - 06:00 UTC
      const hour = now.getUTCHours();
      setActiveSessions({
        london: hour >= 8 && hour < 17,
        newYork: hour >= 13 && hour < 21,
        tokyo: hour >= 0 && hour < 9,
        sydney: hour >= 21 || hour < 6,
      });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 transition-all">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <span className="text-xl">⚡</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-wider text-white flex items-center gap-1.5">
                POCKET OPTION <span className="text-emerald-400">AI</span>
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                V3.8 VISION
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              {t.subtitle}
            </p>
          </div>
        </div>

        {/* Market Sessions & Quick Tools */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
          {/* Active Sessions */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-900/90 rounded-lg border border-slate-800 text-slate-400">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px] font-mono text-slate-300">{currentUtc.split(' ').slice(4, 5).join('')} UTC</span>
            <div className="h-3 w-px bg-slate-800" />
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1 font-semibold ${activeSessions.london ? 'text-emerald-400' : 'text-slate-600'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${activeSessions.london ? 'bg-emerald-400' : 'bg-slate-700'}`} />
                {t.london}
              </span>
              <span className={`inline-flex items-center gap-1 font-semibold ${activeSessions.newYork ? 'text-emerald-400' : 'text-slate-600'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${activeSessions.newYork ? 'bg-emerald-400' : 'bg-slate-700'}`} />
                {t.newYork}
              </span>
              <span className={`inline-flex items-center gap-1 font-semibold ${activeSessions.tokyo ? 'text-emerald-400' : 'text-slate-600'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${activeSessions.tokyo ? 'bg-emerald-400' : 'bg-slate-700'}`} />
                {t.tokyo}
              </span>
            </div>
          </div>

          {/* Cheat Sheet & Risk Calc buttons */}
          <button
            onClick={onOpenCheatSheet}
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Candlestick Pattern Cheat Sheet"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-medium">{t.cheatSheetTab}</span>
          </button>

          <button
            onClick={onOpenRiskCalc}
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Money Management Calculator"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-medium">{t.riskCalculatorTab}</span>
          </button>

          {/* Voice Alert Toggle */}
          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
              voiceEnabled
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
            title={t.voiceSignal}
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Language Toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('bn')}
              className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                language === 'bn'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              বাংলা
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
