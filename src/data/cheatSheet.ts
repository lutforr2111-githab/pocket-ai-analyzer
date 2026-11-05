export interface CandlestickGuide {
  title: string;
  type: 'Bullish' | 'Bearish' | 'Neutral';
  successRate: string;
  binarySignalTip: string;
  description: string;
  svgIcon: string;
}

export const CANDLESTICK_GUIDES: CandlestickGuide[] = [
  {
    title: 'Bullish Hammer / Pin Bar',
    type: 'Bullish',
    successRate: '82-87%',
    binarySignalTip: 'Wait for candle to close at key support. Enter CALL on the open of the next candle with 1-2 min expiry.',
    description: 'Long lower shadow at least 2x the body size. Shows strong rejection of lower prices by buyers.',
    svgIcon: `<svg viewBox="0 0 60 70" width="40" height="46" fill="none"><line x1="30" y1="12" x2="30" y2="20" stroke="#00e5a0" stroke-width="2"/><rect x="22" y="20" width="16" height="14" fill="#00e5a0" rx="1"/><line x1="30" y1="34" x2="30" y2="64" stroke="#00e5a0" stroke-width="2.5"/></svg>`,
  },
  {
    title: 'Bullish Engulfing',
    type: 'Bullish',
    successRate: '79-84%',
    binarySignalTip: 'High probability when preceded by 3+ red candles touching the lower Bollinger Band or EMA 21.',
    description: 'A large green body completely covers/engulfs the previous small red candle body.',
    svgIcon: `<svg viewBox="0 0 70 70" width="46" height="46" fill="none"><rect x="14" y="28" width="12" height="18" fill="#ff4a68" rx="1"/><line x1="20" y1="20" x2="20" y2="52" stroke="#ff4a68" stroke-width="1.5"/><rect x="36" y="16" width="18" height="38" fill="#00e5a0" rx="1"/><line x1="45" y1="8" x2="45" y2="60" stroke="#00e5a0" stroke-width="2"/></svg>`,
  },
  {
    title: 'Bearish Shooting Star',
    type: 'Bearish',
    successRate: '81-86%',
    binarySignalTip: 'Look for this at resistance or upper Bollinger Band. Enter PUT on next candle open.',
    description: 'Small body near the bottom with a long upper wick showing aggressive selling rejection at highs.',
    svgIcon: `<svg viewBox="0 0 60 70" width="40" height="46" fill="none"><line x1="30" y1="8" x2="30" y2="38" stroke="#ff4a68" stroke-width="2.5"/><rect x="22" y="38" width="16" height="14" fill="#ff4a68" rx="1"/><line x1="30" y1="52" x2="30" y2="58" stroke="#ff4a68" stroke-width="2"/></svg>`,
  },
  {
    title: 'Bearish Engulfing',
    type: 'Bearish',
    successRate: '80-85%',
    binarySignalTip: 'Ideal entry when RSI is above 70 or diverging. Take 1-3 minute PUT trade.',
    description: 'A large red candle fully consumes the prior green candle, signaling seller takeover.',
    svgIcon: `<svg viewBox="0 0 70 70" width="46" height="46" fill="none"><rect x="14" y="24" width="12" height="20" fill="#00e5a0" rx="1"/><line x1="20" y1="16" x2="20" y2="50" stroke="#00e5a0" stroke-width="1.5"/><rect x="36" y="14" width="18" height="42" fill="#ff4a68" rx="1"/><line x1="45" y1="8" x2="45" y2="62" stroke="#ff4a68" stroke-width="2"/></svg>`,
  },
  {
    title: 'Morning Star Reversal',
    type: 'Bullish',
    successRate: '85-89%',
    binarySignalTip: '3-candle formation: Large red candle, small indecision star, followed by strong green candle closing above midpoint of candle 1.',
    description: 'Classic three-candle bottom reversal setup with very high win rate on 1m and 5m charts.',
    svgIcon: `<svg viewBox="0 0 90 70" width="60" height="46" fill="none"><rect x="10" y="16" width="14" height="34" fill="#ff4a68" rx="1"/><rect x="36" y="44" width="12" height="10" fill="#ffd166" rx="1"/><rect x="60" y="20" width="16" height="30" fill="#00e5a0" rx="1"/></svg>`,
  },
  {
    title: 'Doji / Spinning Top',
    type: 'Neutral',
    successRate: 'NO TRADE / Caution',
    binarySignalTip: 'Never enter on the Doji candle itself! Always wait for the breakout candle in either direction.',
    description: 'Open and close are virtually identical. Indicates complete market indecision and equilibrium.',
    svgIcon: `<svg viewBox="0 0 60 70" width="40" height="46" fill="none"><line x1="30" y1="10" x2="30" y2="60" stroke="#ffd166" stroke-width="2"/><line x1="18" y1="35" x2="42" y2="35" stroke="#ffd166" stroke-width="3"/></svg>`,
  },
];
