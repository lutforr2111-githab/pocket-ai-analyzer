export interface TradingSymbol {
  id: string;
  name: string;
  category: 'Forex' | 'Crypto' | 'Commodities';
  tradingViewSymbol: string;
  payout: string;
  basePrice: number;
}

export const POPULAR_SYMBOLS: TradingSymbol[] = [
  // Forex
  { id: 'EURUSD', name: 'EUR/USD', category: 'Forex', tradingViewSymbol: 'FX:EURUSD', payout: '92%', basePrice: 1.0855 },
  { id: 'GBPUSD', name: 'GBP/USD', category: 'Forex', tradingViewSymbol: 'FX:GBPUSD', payout: '89%', basePrice: 1.2715 },
  { id: 'USDJPY', name: 'USD/JPY', category: 'Forex', tradingViewSymbol: 'FX:USDJPY', payout: '87%', basePrice: 151.35 },
  { id: 'AUDUSD', name: 'AUD/USD', category: 'Forex', tradingViewSymbol: 'FX:AUDUSD', payout: '85%', basePrice: 0.654 },
  { id: 'USDCAD', name: 'USD/CAD', category: 'Forex', tradingViewSymbol: 'FX:USDCAD', payout: '86%', basePrice: 1.365 },
  { id: 'USDCHF', name: 'USD/CHF', category: 'Forex', tradingViewSymbol: 'FX:USDCHF', payout: '84%', basePrice: 0.887 },
  { id: 'EURJPY', name: 'EUR/JPY', category: 'Forex', tradingViewSymbol: 'FX:EURJPY', payout: '88%', basePrice: 164.25 },
  { id: 'GBPJPY', name: 'GBP/JPY', category: 'Forex', tradingViewSymbol: 'FX:GBPJPY', payout: '89%', basePrice: 192.45 },
  { id: 'EURGBP', name: 'EUR/GBP', category: 'Forex', tradingViewSymbol: 'FX:EURGBP', payout: '85%', basePrice: 0.854 },

  // Crypto
  { id: 'BTCUSDT', name: 'BTC/USDT', category: 'Crypto', tradingViewSymbol: 'BINANCE:BTCUSDT', payout: '95%', basePrice: 89450 },
  { id: 'ETHUSDT', name: 'ETH/USDT', category: 'Crypto', tradingViewSymbol: 'BINANCE:ETHUSDT', payout: '93%', basePrice: 3280 },
  { id: 'SOLUSDT', name: 'SOL/USDT', category: 'Crypto', tradingViewSymbol: 'BINANCE:SOLUSDT', payout: '91%', basePrice: 185 },

  // Commodities
  { id: 'XAUUSD', name: 'GOLD (XAU/USD)', category: 'Commodities', tradingViewSymbol: 'OANDA:XAUUSD', payout: '90%', basePrice: 2735 },
  { id: 'XAGUSD', name: 'SILVER (XAG/USD)', category: 'Commodities', tradingViewSymbol: 'TVC:SILVER', payout: '88%', basePrice: 32.5 },
  { id: 'USOIL', name: 'CRUDE OIL (USOIL)', category: 'Commodities', tradingViewSymbol: 'TVC:USOIL', payout: '86%', basePrice: 71.2 },
];
