export type DataStatus = 'LOADING' | 'LIVE' | 'UPDATING' | 'STALE' | 'FALLBACK' | 'ERROR';

export interface ChartViewModel<T> {
  data: T;
  status: DataStatus;
  isUpdating: boolean;
  lastSuccessfulUpdate?: string;
  message?: string;
}

export const MARKET_CACHE_KEYS = {
  currencies: 'market.currencies',
  b3Assets: 'market.b3-assets',
  assetHistory: 'market.asset-history',
  selic: 'market.selic',
  ipca: 'market.ipca',
} as const;

export const THEME_STORAGE_KEY = 'financial-dashboard.theme';
export const LANGUAGE_STORAGE_KEY = 'financial-dashboard.language';

export type AppTheme = 'dark' | 'light' | 'system';
export type SupportedLanguage = 'en' | 'pt' | 'es';
