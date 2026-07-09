import { ExchangeRate } from '../models/exchange-rate.model';

export interface AwesomeApiItem {
  code: string;
  codein: string;
  name: string;
  high: string;
  low: string;
  varBid: string;
  pctChange: string;
  bid: string;
  ask: string;
  open?: string;
  timestamp?: string;
  create_date?: string;
}

export interface AwesomeApiResponse {
  [key: string]: AwesomeApiItem;
}

export function mapAwesomeApiResponse(response: AwesomeApiResponse): ExchangeRate[] {
  const now = new Date().toISOString();
  return Object.values(response).map(item => {
    const [baseCurrency, quoteCurrency] = item.code.split('/');
    const symbol = `${item.code}-${item.codein || 'BRL'}`;
    return {
      symbol,
      baseCurrency: baseCurrency || item.code,
      quoteCurrency: quoteCurrency || item.codein || 'BRL',
      displayName: item.name || item.code,
      bid: parseFloat(item.bid) || 0,
      ask: parseFloat(item.ask) || 0,
      high: parseFloat(item.high) || 0,
      low: parseFloat(item.low) || 0,
      absoluteChange: parseFloat(item.varBid) || 0,
      percentageChange: parseFloat(item.pctChange) || 0,
      open: item.open ? parseFloat(item.open) : undefined,
      providerTimestamp: item.create_date || new Date().toISOString(),
      synchronizedAt: now,
    };
  });
}
