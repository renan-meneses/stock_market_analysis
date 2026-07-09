import { ExchangeRate } from './exchange-rate.model';
import { BrazilianMarketAsset } from './brazilian-market-asset.model';
import { MacroeconomicIndicator } from './macroeconomic-indicator.model';
import { ProviderHealth } from './provider-health.model';

export interface FinancialDashboardData {
  currencies: ExchangeRate[];
  brazilianAssets: BrazilianMarketAsset[];
  macroeconomicIndicators: MacroeconomicIndicator[];
  updatedAt: string;
  providers: ProviderHealth[];
}
