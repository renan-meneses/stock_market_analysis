export interface ExchangeRate {
  symbol: string;
  baseCurrency: string;
  quoteCurrency: string;
  displayName: string;
  bid: number;
  ask: number;
  high: number;
  low: number;
  absoluteChange: number;
  percentageChange: number;
  open?: number;
  previousClose?: number;
  providerTimestamp: string;
  synchronizedAt: string;
}
