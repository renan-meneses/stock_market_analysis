import { FinancialDataProvider } from './financial-data-provider.interface';
import { ExchangeRate } from '../models/exchange-rate.model';

export type CurrencyProviderRequest = void;

export interface CurrencyProvider extends FinancialDataProvider<CurrencyProviderRequest, ExchangeRate[]> {
  getLatestRates(): Observable<ExchangeRate[]>;
}
import { Observable } from 'rxjs';
