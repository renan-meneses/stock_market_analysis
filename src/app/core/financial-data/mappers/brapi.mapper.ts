import { BrazilianMarketAsset, BrazilianAssetType } from '../models/brazilian-market-asset.model';

export interface BrapiQuoteItem {
  symbol: string;
  shortName?: string;
  longName?: string;
  type?: string;
  currency?: string;
  exchange?: string;
  regularMarketPrice?: number;
  regularMarketPreviousClose?: number;
  regularMarketOpen?: number;
  regularMarketDayHigh?: number;
  regularMarketDayLow?: number;
  regularMarketChange?: number;
  regularMarketChangePercent?: number;
  regularMarketVolume?: number;
  averageDailyVolume3Month?: number;
  marketCap?: number;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
  earningsPerShare?: number;
  priceEarningsRatio?: number;
  logourl?: string;
  updatedAt?: string;
}

export interface BrapiQuoteResponse {
  results?: BrapiQuoteItem[];
}

function mapAssetType(rawType?: string): BrazilianAssetType {
  if (!rawType) return 'UNKNOWN';
  const t = rawType.toUpperCase();
  if (t.includes('FII') || t.includes('FUND') || t.includes('REAL_ESTATE')) return 'FII';
  if (t.includes('ETF')) return 'ETF';
  if (t.includes('BDR')) return 'BDR';
  if (t.includes('INDEX')) return 'INDEX';
  if (t.includes('STOCK') || t.includes('SHARE') || t.includes('COMMON')) return 'STOCK';
  return 'UNKNOWN';
}

export function mapBrapiResponse(response: BrapiQuoteResponse): BrazilianMarketAsset[] {
  const now = new Date().toISOString();
  if (!response.results) return [];
  return response.results.map(item => ({
    ticker: item.symbol || '',
    name: item.longName || item.shortName || item.symbol || '',
    shortName: item.shortName,
    assetType: mapAssetType(item.type || item.symbol),
    currency: item.currency || 'BRL',
    exchange: item.exchange || 'B3',
    currentPrice: item.regularMarketPrice || 0,
    previousClose: item.regularMarketPreviousClose,
    openPrice: item.regularMarketOpen,
    dayHigh: item.regularMarketDayHigh,
    dayLow: item.regularMarketDayLow,
    change: item.regularMarketChange,
    changePercent: item.regularMarketChangePercent,
    volume: item.regularMarketVolume,
    averageVolume: item.averageDailyVolume3Month,
    marketCap: item.marketCap,
    fiftyTwoWeekHigh: item.fiftyTwoWeekHigh,
    fiftyTwoWeekLow: item.fiftyTwoWeekLow,
    earningsPerShare: item.earningsPerShare,
    priceEarningsRatio: item.priceEarningsRatio,
    logoUrl: item.logourl,
    providerTimestamp: item.updatedAt,
    synchronizedAt: now,
  }));
}
