import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { TradingViewChart } from './components/TradingViewChart';
import { UploadPanel } from './components/UploadPanel';
import { SignalCard } from './components/SignalCard';
import { TechnicalDetails } from './components/TechnicalDetails';
import { SignalHistory } from './components/SignalHistory';
import { PatternGuideModal } from './components/PatternGuideModal';
import { RiskCalculatorModal } from './components/RiskCalculatorModal';
import { AnalysisResult, AnalysisHistoryItem } from './types';
import { Language, TRANSLATIONS } from './data/translations';
import { POPULAR_SYMBOLS, TradingSymbol } from './data/symbols';
import { AlertCircle, LineChart, UploadCloud, Zap } from 'lucide-react';

export default function App() {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('po_lang');
    return (saved as Language) || 'en';
  });

  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(() => {
    return localStorage.getItem('po_voice') === 'true';
  });

  const [activeTab, setActiveTab] = useState<'tradingview' | 'upload'>('tradingview');
  const [selectedSymbol, setSelectedSymbol] = useState<TradingSymbol>(POPULAR_SYMBOLS[0]);
  const [timeframe, setTimeframe] = useState<string>('1 minute');
  const [market, setMarket] = useState<string>('Real Market');
  const [strategy, setStrategy] = useState<string>('Scalping (1-3 min)');
  const [imageData, setImageData] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const signalRef = useRef<HTMLDivElement>(null);

  const [history, setHistory] = useState<AnalysisHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('po_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [showPatternGuide, setShowPatternGuide] = useState<boolean>(false);
  const [showRiskCalc, setShowRiskCalc] = useState<boolean>(false);

  // Sync settings
  useEffect(() => {
    localStorage.setItem('po_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('po_voice', String(voiceEnabled));
  }, [voiceEnabled]);

  useEffect(() => {
    localStorage.setItem('po_history', JSON.stringify(history));
  }, [history]);

  // Voice announcement
  const announceSignal = (res: AnalysisResult) => {
    if (!voiceEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;

    try {
      window.speechSynthesis.cancel();
      let text = '';
      if (language === 'bn') {
        const dir = res.direction === 'UP' ? 'আপ কল বাই' : res.direction === 'DOWN' ? 'ডাউন পুট সেল' : 'নো ট্রেড অপেক্ষা করুন';
        text = `বাইনারি এআই সিগন্যাল: ${dir}। কনফিডেন্স ${res.confidence} শতাংশ।`;
      } else {
        const dir = res.direction === 'UP' ? 'CALL UP BUY' : res.direction === 'DOWN' ? 'PUT DOWN SELL' : 'NO TRADE WAIT';
        text = `BINARY AI SIGNAL: ${dir}. Confidence ${res.confidence} percent. Expiry: ${res.expiration}.`;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  };

  const executeAnalysis = async (imgToAnalyze: string, assetName?: string) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: imgToAnalyze,
          timeframe,
          market: assetName || market,
          mode: strategy,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      const data: AnalysisResult = await response.json();
      setResult(data);
      announceSignal(data);

      // Save to history
      const newHistoryItem: AnalysisHistoryItem = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        asset: data.detectedAsset || assetName || selectedSymbol.name,
        timeframe,
        market,
        direction: data.direction,
        confidence: data.confidence,
        pattern: data.pattern,
        thumbnail: imgToAnalyze,
      };

      setHistory((prev) => [newHistoryItem, ...prev.slice(0, 24)]);

      // Scroll smoothly to the signal
      setTimeout(() => {
        signalRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    } catch (err: any) {
      console.error('Analysis failed:', err);
      setError(
        err.message || 'An unexpected error occurred while analyzing the chart.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyze = () => {
    if (!imageData) return;
    executeAnalysis(imageData);
  };

  const handleAnalyzeLive = (snapshotDataUrl: string, symbol: TradingSymbol) => {
    setImageData(snapshotDataUrl);
    executeAnalysis(snapshotDataUrl, symbol.name);
  };

  const handleUpdateOutcome = (id: string, outcome: 'win' | 'loss' | 'tie' | 'skipped') => {
    setHistory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, outcome } : item))
    );
  };

  const handleClearHistory = () => {
    if (window.confirm(language === 'bn' ? 'আপনি কি সমস্ত হিস্ট্রি মুছে ফেলতে চান?' : 'Clear all analysis history?')) {
      setHistory([]);
    }
  };

  const handleSelectHistoryItem = (item: AnalysisHistoryItem) => {
    setImageData(item.thumbnail);
    setTimeframe(item.timeframe);
    setMarket(item.market);
    setActiveTab('upload');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const t = TRANSLATIONS[language];

  return (
    <div className="min-h-screen bg-[#080e1c] text-white selection:bg-emerald-500 selection:text-slate-950 font-sans">
      {/* Background radial gradient decor */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,229,160,0.06),rgba(255,255,255,0))] pointer-events-none" />

      {/* Top Header */}
      <Header
        language={language}
        setLanguage={setLanguage}
        voiceEnabled={voiceEnabled}
        setVoiceEnabled={setVoiceEnabled}
        onOpenCheatSheet={() => setShowPatternGuide(true)}
        onOpenRiskCalc={() => setShowRiskCalc(true)}
      />

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6 relative z-10">
        {/* Error notification banner */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-start justify-between gap-3 animate-in fade-in">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-rose-200">Analysis Error</p>
                <p className="mt-0.5">{error}</p>
              </div>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-slate-400 hover:text-white p-1 rounded cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* View Mode Navigation Tabs */}
        <div className="flex items-center justify-center sm:justify-start gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('tradingview')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'tradingview'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <LineChart className="w-4 h-4" />
            <span>{t.liveTradingViewTab}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-1" />
          </button>

          <button
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>{t.screenshotTab}</span>
          </button>
        </div>

        {/* Tab 1: Live TradingView Chart View */}
        {activeTab === 'tradingview' && (
          <TradingViewChart
            language={language}
            selectedSymbol={selectedSymbol}
            setSelectedSymbol={setSelectedSymbol}
            timeframe={timeframe}
            setTimeframe={setTimeframe}
            isAnalyzing={isAnalyzing}
            onAnalyzeLive={handleAnalyzeLive}
          />
        )}

        {/* Tab 2: Upload / Paste Screenshot View */}
        {activeTab === 'upload' && (
          <UploadPanel
            language={language}
            timeframe={timeframe}
            setTimeframe={setTimeframe}
            market={market}
            setMarket={setMarket}
            strategy={strategy}
            setStrategy={setStrategy}
            imageData={imageData}
            setImageData={(data) => {
              setImageData(data);
              if (!data) setResult(null);
            }}
            isAnalyzing={isAnalyzing}
            onAnalyze={handleAnalyze}
          />
        )}

        {/* AI Trading Signal Result Card */}
        <div ref={signalRef}>
          <SignalCard
            result={result}
            isAnalyzing={isAnalyzing}
            language={language}
          />
        </div>

        {/* Technical Breakdown Section */}
        <TechnicalDetails
          result={result}
          language={language}
        />

        {/* Signal History & Performance Tracker */}
        <SignalHistory
          history={history}
          onClearHistory={handleClearHistory}
          onUpdateOutcome={handleUpdateOutcome}
          onSelectHistoryItem={handleSelectHistoryItem}
          language={language}
        />

        {/* Disclaimer Note */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
          <p className="text-xs text-slate-400 leading-relaxed max-w-3xl mx-auto">
            {t.disclaimer}
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400">
            <span>⚡ Institutional Grade Price Action</span>
            <span>•</span>
            <span>📈 Real-time TradingView Candlestick Feeds</span>
            <span>•</span>
            <span>🕯️ EMA 9/21 Dynamic Cross Detection</span>
            <span>•</span>
            <span>🎯 00-Second Binary Candle Synchronization</span>
          </div>
        </div>
      </main>

      {/* Modals */}
      <PatternGuideModal
        isOpen={showPatternGuide}
        onClose={() => setShowPatternGuide(false)}
        language={language}
      />

      <RiskCalculatorModal
        isOpen={showRiskCalc}
        onClose={() => setShowRiskCalc(false)}
        language={language}
      />
    </div>
  );
}
