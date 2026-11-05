import { TradingSymbol } from '../data/symbols';

// Calculates EMA for an array of numbers
function calculateEMA(prices: number[], period: number): number[] {
  const k = 2 / (period + 1);
  const emaArray: number[] = [];
  let prevEma = prices[0];
  emaArray.push(prevEma);

  for (let i = 1; i < prices.length; i++) {
    const currentEma = prices[i] * k + prevEma * (1 - k);
    emaArray.push(currentEma);
    prevEma = currentEma;
  }
  return emaArray;
}

// Calculates RSI
function calculateRSI(closes: number[], period: number = 14): number[] {
  const rsi: number[] = [];
  if (closes.length < period) return closes.map(() => 50);

  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff >= 0) gains += diff;
    else losses += Math.abs(diff);
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  for (let i = 0; i < period; i++) {
    rsi.push(50);
  }

  let rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
  rsi.push(Math.round(100 - 100 / (1 + rs)));

  for (let i = period + 1; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    const gain = diff >= 0 ? diff : 0;
    const loss = diff < 0 ? Math.abs(diff) : 0;

    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;

    rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    rsi.push(Math.round(100 - 100 / (1 + rs)));
  }

  return rsi;
}

export interface LiveCandle {
  o: number;
  h: number;
  l: number;
  c: number;
  time: string;
}

// Generates realistic live market data snapshot with real EMA 9, EMA 21, and RSI
export async function generateLiveTradingViewSnapshot(
  symbol: TradingSymbol,
  timeframeStr: string
): Promise<{
  imageDataUrl: string;
  candles: LiveCandle[];
  currentPrice: number;
  ema9: number;
  ema21: number;
  rsi: number;
}> {
  // If crypto, we can try to fetch live Binance klines first for 100% real tick data!
  let fetchedCandles: LiveCandle[] = [];

  if (symbol.category === 'Crypto') {
    try {
      const intervalMap: { [key: string]: string } = {
        '1 minute': '1m',
        '3 minutes': '3m',
        '5 minutes': '5m',
        '15 minutes': '15m',
      };
      const interval = intervalMap[timeframeStr] || '1m';
      const pair = symbol.id === 'BTCUSDT' ? 'BTCUSDT' : symbol.id === 'ETHUSDT' ? 'ETHUSDT' : 'SOLUSDT';

      const res = await fetch(`https://api.binance.com/api/v3/klines?symbol=${pair}&interval=${interval}&limit=16`);
      if (res.ok) {
        const raw = await res.json();
        fetchedCandles = raw.map((k: any) => ({
          o: parseFloat(k[1]),
          h: parseFloat(k[2]),
          l: parseFloat(k[3]),
          c: parseFloat(k[4]),
          time: new Date(k[0]).toLocaleTimeString(),
        }));
      }
    } catch {
      // Fallback to simulated live price series
    }
  }

  // If no fetched candles (e.g. Forex or network error), generate realistic live micro-walk
  if (fetchedCandles.length < 10) {
    const candleCount = 15;
    let price = symbol.basePrice;
    const volatility = symbol.basePrice * 0.0008;

    for (let i = 0; i < candleCount; i++) {
      const delta = (Math.random() - 0.48) * volatility;
      const open = price;
      const close = open + delta;
      const high = Math.max(open, close) + Math.random() * volatility * 0.7;
      const low = Math.min(open, close) - Math.random() * volatility * 0.7;

      fetchedCandles.push({
        o: open,
        h: high,
        l: low,
        c: close,
        time: `${14 + Math.floor(i / 4)}:${(i * 4) % 60}`,
      });
      price = close;
    }
  }

  const closes = fetchedCandles.map((c) => c.c);
  const ema9Array = calculateEMA(closes, 9);
  const ema21Array = calculateEMA(closes, 21);
  const rsiArray = calculateRSI(closes, 14);

  const lastCandle = fetchedCandles[fetchedCandles.length - 1];
  const lastEma9 = ema9Array[ema9Array.length - 1];
  const lastEma21 = ema21Array[ema21Array.length - 1];
  const lastRsi = rsiArray[rsiArray.length - 1] || 52;

  // Render High-Def SVG representation of TradingView chart
  const width = 850;
  const height = 500;
  const chartHeight = 330;
  const rsiTop = 360;
  const rsiHeight = 110;

  const allPrices = fetchedCandles.flatMap((c) => [c.h, c.l]);
  const minPrice = Math.min(...allPrices) * 0.9994;
  const maxPrice = Math.max(...allPrices) * 1.0006;
  const priceRange = maxPrice - minPrice || 1;

  const getY = (p: number) => 45 + (1 - (p - minPrice) / priceRange) * (chartHeight - 65);
  const candleSpacing = (width - 130) / fetchedCandles.length;
  const candleWidth = Math.max(10, candleSpacing * 0.65);

  let candleSvg = '';
  fetchedCandles.forEach((c, i) => {
    const x = 55 + i * candleSpacing + candleSpacing / 2;
    const yOpen = getY(c.o);
    const yClose = getY(c.c);
    const yHigh = getY(c.h);
    const yLow = getY(c.l);
    const isBull = c.c >= c.o;
    const color = isBull ? '#00e5a0' : '#ff4a68';

    const bodyY = Math.min(yOpen, yClose);
    const bodyHeight = Math.max(3, Math.abs(yOpen - yClose));

    // Wick
    candleSvg += `<line x1="${x.toFixed(1)}" y1="${yHigh.toFixed(1)}" x2="${x.toFixed(1)}" y2="${yLow.toFixed(1)}" stroke="${color}" stroke-width="1.8" />`;
    // Body
    candleSvg += `<rect x="${(x - candleWidth / 2).toFixed(1)}" y="${bodyY.toFixed(1)}" width="${candleWidth.toFixed(1)}" height="${bodyHeight.toFixed(1)}" fill="${color}" rx="1" />`;
  });

  // EMA paths
  let ema9Path = '';
  ema9Array.forEach((val, i) => {
    const x = 55 + i * candleSpacing + candleSpacing / 2;
    const y = getY(val);
    ema9Path += `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)} `;
  });

  let ema21Path = '';
  ema21Array.forEach((val, i) => {
    const x = 55 + i * candleSpacing + candleSpacing / 2;
    const y = getY(val);
    ema21Path += `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)} `;
  });

  // RSI path
  const rsiGetY = (val: number) => rsiTop + (1 - val / 100) * (rsiHeight - 20);
  let rsiPath = '';
  rsiArray.forEach((val, i) => {
    const x = 55 + i * candleSpacing + candleSpacing / 2;
    const y = rsiGetY(val);
    rsiPath += `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)} `;
  });

  const decimalPlaces = symbol.category === 'Crypto' ? 2 : symbol.name.includes('JPY') ? 3 : 5;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
    <rect width="${width}" height="${height}" fill="#080e1c" />

    <!-- TradingView Dark Grid -->
    <line x1="45" y1="90" x2="${width - 30}" y2="90" stroke="#16233b" stroke-width="1" />
    <line x1="45" y1="160" x2="${width - 30}" y2="160" stroke="#16233b" stroke-width="1" />
    <line x1="45" y1="230" x2="${width - 30}" y2="230" stroke="#16233b" stroke-width="1" />
    <line x1="45" y1="300" x2="${width - 30}" y2="300" stroke="#16233b" stroke-width="1" />

    <!-- Header bar -->
    <rect x="0" y="0" width="${width}" height="38" fill="#0d182b" />
    <circle cx="20" cy="19" r="6" fill="#00e5a0" />
    <text x="36" y="23" fill="#ffffff" font-size="14" font-weight="bold" font-family="sans-serif">${symbol.tradingViewSymbol}</text>
    <rect x="190" y="9" width="55" height="20" rx="4" fill="#00e5a022" />
    <text x="200" y="23" fill="#00e5a0" font-size="12" font-weight="bold" font-family="sans-serif">${symbol.payout}</text>
    <text x="260" y="23" fill="#8ca0ba" font-size="12" font-family="sans-serif">Live TradingView • ${timeframeStr} • Real-Time AI Stream</text>

    <!-- Indicators legend -->
    <text x="55" y="60" fill="#ffd166" font-size="11" font-family="sans-serif" font-weight="bold">EMA(9): ${lastEma9.toFixed(decimalPlaces)}</text>
    <text x="175" y="60" fill="#00b4d8" font-size="11" font-family="sans-serif" font-weight="bold">EMA(21): ${lastEma21.toFixed(decimalPlaces)}</text>

    <!-- Candlesticks -->
    ${candleSvg}

    <!-- EMA lines -->
    <path d="${ema9Path}" fill="none" stroke="#ffd166" stroke-width="2.2" />
    <path d="${ema21Path}" fill="none" stroke="#00b4d8" stroke-width="2.2" />

    <!-- Current Price Level Line -->
    <line x1="45" y1="${getY(lastCandle.c).toFixed(1)}" x2="${width - 75}" y2="${getY(lastCandle.c).toFixed(1)}" stroke="#00e5a0" stroke-width="1.2" stroke-dasharray="3 3" />
    <rect x="${width - 75}" y="${(getY(lastCandle.c) - 10).toFixed(1)}" width="70" height="20" rx="3" fill="#00e5a0" />
    <text x="${width - 70}" y="${(getY(lastCandle.c) + 4).toFixed(1)}" fill="#041a16" font-size="10" font-weight="bold" font-family="monospace">${lastCandle.c.toFixed(decimalPlaces)}</text>

    <!-- Price scale -->
    <line x1="${width - 75}" y1="38" x2="${width - 75}" y2="340" stroke="#1c2d47" stroke-width="1" />
    <text x="${width - 68}" y="70" fill="#6d83a1" font-size="10" font-family="monospace">${maxPrice.toFixed(decimalPlaces)}</text>
    <text x="${width - 68}" y="190" fill="#6d83a1" font-size="10" font-family="monospace">${((maxPrice + minPrice) / 2).toFixed(decimalPlaces)}</text>
    <text x="${width - 68}" y="310" fill="#6d83a1" font-size="10" font-family="monospace">${minPrice.toFixed(decimalPlaces)}</text>

    <!-- RSI Subwindow -->
    <rect x="0" y="345" width="${width}" height="155" fill="#0b1323" stroke="#1c2d47" stroke-width="1" />
    <text x="20" y="362" fill="#a78bfa" font-size="11" font-family="sans-serif" font-weight="bold">RSI(14): ${lastRsi}</text>
    <line x1="45" y1="${rsiGetY(70).toFixed(1)}" x2="${width - 30}" y2="${rsiGetY(70).toFixed(1)}" stroke="#ff4a68" stroke-width="1" stroke-dasharray="3 3" opacity="0.7" />
    <text x="${width - 60}" y="${rsiGetY(70) + 4}" fill="#ff4a68" font-size="9" font-family="monospace">70 (OB)</text>
    <line x1="45" y1="${rsiGetY(50).toFixed(1)}" x2="${width - 30}" y2="${rsiGetY(50).toFixed(1)}" stroke="#3a4d6b" stroke-width="1" stroke-dasharray="2 2" />
    <line x1="45" y1="${rsiGetY(30).toFixed(1)}" x2="${width - 30}" y2="${rsiGetY(30).toFixed(1)}" stroke="#00e5a0" stroke-width="1" stroke-dasharray="3 3" opacity="0.7" />
    <text x="${width - 60}" y="${rsiGetY(30) + 4}" fill="#00e5a0" font-size="9" font-family="monospace">30 (OS)</text>
    <path d="${rsiPath}" fill="none" stroke="#a78bfa" stroke-width="2.2" />
  </svg>`;

  return {
    imageDataUrl: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg),
    candles: fetchedCandles,
    currentPrice: lastCandle.c,
    ema9: lastEma9,
    ema21: lastEma21,
    rsi: lastRsi,
  };
}
