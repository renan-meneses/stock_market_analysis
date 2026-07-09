export type BrazilianAssetType = 'STOCK' | 'FII' | 'ETF' | 'BDR' | 'INDEX' | 'UNKNOWN';

export interface BrazilianMarketAsset {
  ticker: string;
  name: string;
  shortName?: string;
  assetType: BrazilianAssetType;
  currency: string;
  exchange: string;
  currentPrice: number;
  previousClose?: number;
  openPrice?: number;
  dayHigh?: number;
  dayLow?: number;
  change?: number;
  changePercent?: number;
  volume?: number;
  averageVolume?: number;
  marketCap?: number;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
  earningsPerShare?: number;
  priceEarningsRatio?: number;
  logoUrl?: string;
  providerTimestamp?: string;
  synchronizedAt: string;
}
