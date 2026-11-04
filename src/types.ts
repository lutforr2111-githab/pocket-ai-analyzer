export type TradeDirection = 'UP' | 'DOWN' | 'NO TRADE';

export interface AnalysisResult {
  direction: TradeDirection;
  action: string;
  confidence: number;
  expiration: string;
  entryTiming: string;
  trend: string;
  ema: string;
  rsi: string;
  bollinger: string;
  levels: string;
  pattern: string;
  risk: string;
  invalidation?: string;
  reason: string;
  summaryBengali?: string;
  detectedAsset?: string;
  analyzedAt: string;
}

export interface AnalysisHistoryItem {
  id: string;
  timestamp: string;
  asset: string;
  timeframe: string;
  market: string;
  direction: TradeDirection;
  confidence: number;
  pattern: string;
  thumbnail: string;
  outcome?: 'win' | 'loss' | 'tie' | 'skipped';
}

export interface SampleChartPreset {
  id: string;
  name: string;
  pair: string;
  payout?: string;
  timeframe: string;
  market: string;
  scenarioDescription: string;
  expectedDirection: TradeDirection;
  imageDataUrl: string;
}
