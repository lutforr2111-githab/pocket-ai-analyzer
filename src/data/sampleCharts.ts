import { SampleChartPreset } from '../types';

// Helper to generate realistic high-resolution SVG candlestick charts encoded as Data URLs
function createChartSvgDataUrl(options: {
  pair: string;
  payout: string;
  timeframe: string;
  candles: Array<{ o: number; h: number; l: number; c: number }>;
  ema9: number[];
  ema21: number[];
  rsiValues: number[];
  supportLevel?: number;
  resistanceLevel?: number;
}): string {
  const width = 800;
  const height = 480;
  const chartHeight = 320;
  const rsiHeight = 110;
  const rsiTop = 350;

  // Find min and max for price scaling
  const allPrices = options.candles.flatMap((c) => [c.h, c.l]);
  if (options.supportLevel) allPrices.push(options.supportLevel);
  if (options.resistanceLevel) allPrices.push(options.resistanceLevel);
  const minPrice = Math.min(...allPrices) * 0.9992;
  const maxPrice = Math.max(...allPrices) * 1.0008;
  const priceRange = maxPrice - minPrice || 1;

  const getY = (price: number) => {
    return 40 + (1 - (price - minPrice) / priceRange) * (chartHeight - 60);
  };

  const candleCount = options.candles.length;
  const candleSpacing = (width - 120) / candleCount;
  const candleWidth = Math.max(8, candleSpacing * 0.65);

  let candleElements = '';
  options.candles.forEach((c, i) => {
    const x = 50 + i * candleSpacing + candleSpacing / 2;
    const yOpen = getY(c.o);
    const yClose = getY(c.c);
    const yHigh = getY(c.h);
    const yLow = getY(c.l);
    const isBullish = c.c >= c.o;
    const color = isBullish ? '#00e5a0' : '#ff4a68';

    const bodyY = Math.min(yOpen, yClose);
    const bodyHeight = Math.max(3, Math.abs(yOpen - yClose));

    // Wick
    candleElements += `<line x1="${x.toFixed(1)}" y1="${yHigh.toFixed(1)}" x2="${x.toFixed(1)}" y2="${yLow.toFixed(1)}" stroke="${color}" stroke-width="1.5" />`;
    // Body
    candleElements += `<rect x="${(x - candleWidth / 2).toFixed(1)}" y="${bodyY.toFixed(1)}" width="${candleWidth.toFixed(1)}" height="${bodyHeight.toFixed(1)}" fill="${color}" rx="1" />`;
  });

  // EMA lines
  let ema9Path = '';
  options.ema9.forEach((val, i) => {
    const x = 50 + i * candleSpacing + candleSpacing / 2;
    const y = getY(val);
    ema9Path += `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)} `;
  });

  let ema21Path = '';
  options.ema21.forEach((val, i) => {
    const x = 50 + i * candleSpacing + candleSpacing / 2;
    const y = getY(val);
    ema21Path += `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)} `;
  });

  // RSI Path
  const rsiGetY = (val: number) => {
    return rsiTop + (1 - val / 100) * (rsiHeight - 20);
  };
  let rsiPath = '';
  options.rsiValues.forEach((val, i) => {
    const x = 50 + i * candleSpacing + candleSpacing / 2;
    const y = rsiGetY(val);
    rsiPath += `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)} `;
  });

  const supportSvg = options.supportLevel
    ? `<line x1="40" y1="${getY(options.supportLevel).toFixed(1)}" x2="${width - 30}" y2="${getY(options.supportLevel).toFixed(1)}" stroke="#00e5a0" stroke-width="1.5" stroke-dasharray="4 4" opacity="0.8" />
       <text x="${width - 25}" y="${getY(options.supportLevel).toFixed(1)}" fill="#00e5a0" font-size="11" font-family="monospace">${options.supportLevel.toFixed(4)} S</text>`
    : '';

  const resistanceSvg = options.resistanceLevel
    ? `<line x1="40" y1="${getY(options.resistanceLevel).toFixed(1)}" x2="${width - 30}" y2="${getY(options.resistanceLevel).toFixed(1)}" stroke="#ff4a68" stroke-width="1.5" stroke-dasharray="4 4" opacity="0.8" />
       <text x="${width - 25}" y="${getY(options.resistanceLevel).toFixed(1)}" fill="#ff4a68" font-size="11" font-family="monospace">${options.resistanceLevel.toFixed(4)} R</text>`
    : '';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
    <rect width="${width}" height="${height}" fill="#080e1c" />
    
    <!-- Grid -->
    <line x1="40" y1="90" x2="${width - 30}" y2="90" stroke="#17243b" stroke-width="1" />
    <line x1="40" y1="160" x2="${width - 30}" y2="160" stroke="#17243b" stroke-width="1" />
    <line x1="40" y1="230" x2="${width - 30}" y2="230" stroke="#17243b" stroke-width="1" />
    <line x1="40" y1="300" x2="${width - 30}" y2="300" stroke="#17243b" stroke-width="1" />
    
    <!-- Top Bar / Asset Info -->
    <rect x="0" y="0" width="${width}" height="36" fill="#0d1728" />
    <circle cx="20" cy="18" r="6" fill="#00e5a0" />
    <text x="34" y="22" fill="#ffffff" font-size="14" font-weight="bold" font-family="sans-serif">${options.pair}</text>
    <rect x="130" y="8" width="60" height="20" rx="4" fill="#00e5a022" />
    <text x="142" y="22" fill="#00e5a0" font-size="12" font-weight="bold" font-family="sans-serif">${options.payout}</text>
    <text x="210" y="22" fill="#8ca0ba" font-size="12" font-family="sans-serif">M${options.timeframe} Candlestick Chart | Pocket Option Real Market</text>
    
    <!-- Price Scale Line -->
    <line x1="${width - 80}" y1="36" x2="${width - 80}" y2="330" stroke="#1c2d47" stroke-width="1" />
    <text x="${width - 70}" y="70" fill="#6d83a1" font-size="10" font-family="monospace">${maxPrice.toFixed(4)}</text>
    <text x="${width - 70}" y="190" fill="#6d83a1" font-size="10" font-family="monospace">${((maxPrice + minPrice) / 2).toFixed(4)}</text>
    <text x="${width - 70}" y="310" fill="#6d83a1" font-size="10" font-family="monospace">${minPrice.toFixed(4)}</text>

    <!-- Support and Resistance Lines -->
    ${supportSvg}
    ${resistanceSvg}

    <!-- Candlesticks -->
    ${candleElements}

    <!-- EMA Lines -->
    <path d="${ema9Path}" fill="none" stroke="#ffd166" stroke-width="2" />
    <path d="${ema21Path}" fill="none" stroke="#00b4d8" stroke-width="2" />

    <!-- EMA Legend -->
    <text x="50" y="55" fill="#ffd166" font-size="11" font-family="sans-serif" font-weight="bold">EMA(9)</text>
    <text x="110" y="55" fill="#00b4d8" font-size="11" font-family="sans-serif" font-weight="bold">EMA(21)</text>

    <!-- RSI Sub-window -->
    <rect x="0" y="335" width="${width}" height="145" fill="#0b1323" stroke="#1c2d47" stroke-width="1" />
    <text x="20" y="352" fill="#8ca0ba" font-size="11" font-family="sans-serif" font-weight="bold">RSI(14): ${options.rsiValues[options.rsiValues.length - 1]}</text>
    <line x1="40" y1="${rsiGetY(70).toFixed(1)}" x2="${width - 30}" y2="${rsiGetY(70).toFixed(1)}" stroke="#ff4a68" stroke-width="1" stroke-dasharray="3 3" opacity="0.7" />
    <text x="${width - 60}" y="${rsiGetY(70) + 4}" fill="#ff4a68" font-size="9" font-family="monospace">70 (OB)</text>
    <line x1="40" y1="${rsiGetY(50).toFixed(1)}" x2="${width - 30}" y2="${rsiGetY(50).toFixed(1)}" stroke="#3a4d6b" stroke-width="1" stroke-dasharray="2 2" />
    <line x1="40" y1="${rsiGetY(30).toFixed(1)}" x2="${width - 30}" y2="${rsiGetY(30).toFixed(1)}" stroke="#00e5a0" stroke-width="1" stroke-dasharray="3 3" opacity="0.7" />
    <text x="${width - 60}" y="${rsiGetY(30) + 4}" fill="#00e5a0" font-size="9" font-family="monospace">30 (OS)</text>
    <path d="${rsiPath}" fill="none" stroke="#a78bfa" stroke-width="2" />
  </svg>`;

  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

export const SAMPLE_CHART_PRESETS: SampleChartPreset[] = [
  {
    id: 'eurusd-bullish-pinbar',
    name: 'EUR/USD Bullish Pin Bar Bounce',
    pair: 'EUR/USD',
    payout: '92%',
    timeframe: '1 minute',
    market: 'Real Market',
    scenarioDescription: 'Hammer pin bar rejection right off strong key support level 1.0850. EMA 9 curling upward over EMA 21.',
    expectedDirection: 'UP',
    imageDataUrl: createChartSvgDataUrl({
      pair: 'EUR/USD (Real Market)',
      payout: '+92%',
      timeframe: '1',
      supportLevel: 1.0848,
      resistanceLevel: 1.0875,
      candles: [
        { o: 1.087, h: 1.0873, l: 1.0865, c: 1.0866 }, // red
        { o: 1.0866, h: 1.0868, l: 1.0861, c: 1.0862 }, // red
        { o: 1.0862, h: 1.0864, l: 1.0855, c: 1.0856 }, // red drop
        { o: 1.0856, h: 1.0858, l: 1.0851, c: 1.0852 }, // red to support
        { o: 1.0852, h: 1.0853, l: 1.0848, c: 1.0849 }, // touches support
        { o: 1.0849, h: 1.0856, l: 1.0847, c: 1.0855 }, // HAMMER / PIN BAR with long bottom wick
        { o: 1.0855, h: 1.0863, l: 1.0854, c: 1.0862 }, // Strong bullish candle confirming reversal!
      ],
      ema9: [1.0869, 1.0866, 1.0862, 1.0857, 1.0853, 1.0852, 1.0856],
      ema21: [1.0867, 1.0865, 1.0863, 1.086, 1.0857, 1.0855, 1.0854],
      rsiValues: [48, 42, 35, 31, 28, 38, 49],
    }),
  },
  {
    id: 'gbpusd-bearish-rejection',
    name: 'GBP/USD Bearish Shooting Star at Resistance',
    pair: 'GBP/USD',
    payout: '89%',
    timeframe: '1 minute',
    market: 'Real Market',
    scenarioDescription: 'Rejection wick at upper resistance level 1.2720, followed by strong bearish engulfing and EMA downward slope.',
    expectedDirection: 'DOWN',
    imageDataUrl: createChartSvgDataUrl({
      pair: 'GBP/USD (Real Market)',
      payout: '+89%',
      timeframe: '1',
      supportLevel: 1.268,
      resistanceLevel: 1.2722,
      candles: [
        { o: 1.269, h: 1.27, l: 1.2688, c: 1.2698 }, // green
        { o: 1.2698, h: 1.2708, l: 1.2696, c: 1.2706 }, // green
        { o: 1.2706, h: 1.2718, l: 1.2704, c: 1.2716 }, // green push
        { o: 1.2716, h: 1.2723, l: 1.2714, c: 1.272 }, // near resistance
        { o: 1.272, h: 1.2725, l: 1.271, c: 1.2712 }, // Shooting star with long upper rejection wick!
        { o: 1.2712, h: 1.2714, l: 1.2699, c: 1.2701 }, // Big Bearish Engulfing candle pushing down
      ],
      ema9: [1.2692, 1.2697, 1.2704, 1.2712, 1.2715, 1.271],
      ema21: [1.2689, 1.2693, 1.2698, 1.2703, 1.2707, 1.2708],
      rsiValues: [55, 62, 71, 74, 68, 54],
    }),
  },
  {
    id: 'usdjpy-choppy-doji',
    name: 'USD/JPY Choppy Range (No Trade / Wait)',
    pair: 'USD/JPY',
    payout: '85%',
    timeframe: '3 minutes',
    market: 'Real Market',
    scenarioDescription: 'Flat EMAs intertwined, alternating small candles and doji indecision inside tight chop. Ideal for NO TRADE capital preservation.',
    expectedDirection: 'NO TRADE',
    imageDataUrl: createChartSvgDataUrl({
      pair: 'USD/JPY (Real Market)',
      payout: '+85%',
      timeframe: '3',
      supportLevel: 151.2,
      resistanceLevel: 151.45,
      candles: [
        { o: 151.32, h: 151.37, l: 151.29, c: 151.34 },
        { o: 151.34, h: 151.39, l: 151.31, c: 151.33 },
        { o: 151.33, h: 151.36, l: 151.3, c: 151.34 },
        { o: 151.34, h: 151.38, l: 151.31, c: 151.32 }, // Doji
        { o: 151.32, h: 151.36, l: 151.3, c: 151.33 }, // Spinning top
        { o: 151.33, h: 151.37, l: 151.31, c: 151.34 }, // Indecision
      ],
      ema9: [151.33, 151.33, 151.34, 151.33, 151.33, 151.33],
      ema21: [151.33, 151.34, 151.33, 151.33, 151.34, 151.33],
      rsiValues: [50, 49, 51, 48, 50, 50],
    }),
  },
  {
    id: 'btc-otc-breakout',
    name: 'BTC/USD OTC High Momentum Breakout',
    pair: 'BTC/USD OTC',
    payout: '95%',
    timeframe: '5 minutes',
    market: 'OTC Market',
    scenarioDescription: 'Bullish breakout candle piercing horizontal resistance with wide body, RSI breaking above 60 with volume momentum.',
    expectedDirection: 'UP',
    imageDataUrl: createChartSvgDataUrl({
      pair: 'BTC/USD OTC (Pocket Option)',
      payout: '+95%',
      timeframe: '5',
      supportLevel: 88500,
      resistanceLevel: 89400,
      candles: [
        { o: 88600, h: 88900, l: 88550, c: 88850 },
        { o: 88850, h: 89100, l: 88800, c: 89050 },
        { o: 89050, h: 89250, l: 88980, c: 89200 },
        { o: 89200, h: 89420, l: 89150, c: 89380 }, // testing resistance
        { o: 89380, h: 89900, l: 89350, c: 89850 }, // Massive green breakout candle closing way above!
      ],
      ema9: [88650, 88850, 89050, 89250, 89550],
      ema21: [88500, 88650, 88800, 88950, 89150],
      rsiValues: [52, 57, 63, 67, 78],
    }),
  },
];
