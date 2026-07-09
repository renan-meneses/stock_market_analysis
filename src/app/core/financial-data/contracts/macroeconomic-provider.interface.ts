import { FinancialDataProvider } from './financial-data-provider.interface';
import { MacroeconomicIndicator, MacroeconomicIndicatorType } from '../models/macroeconomic-indicator.model';

export interface MacroeconomicProviderRequest {
  type: MacroeconomicIndicatorType;
  seriesCode: number;
}

export interface MacroeconomicProvider extends FinancialDataProvider<MacroeconomicProviderRequest, MacroeconomicIndicator> {
  getSeries(type: MacroeconomicIndicatorType, seriesCode: number): Observable<MacroeconomicIndicator>;
}
import { Observable } from 'rxjs';
