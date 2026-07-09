import { Injectable, inject, signal } from '@angular/core';
import { Observable, forkJoin, of, Subject } from 'rxjs';
import { map, catchError, switchMap, startWith, tap, shareReplay } from 'rxjs/operators';
import { FinancialDataRepository } from '../repositories/financial-data.repository';
import { FinancialDashboardData } from '../models/financial-dashboard-data.model';
import { ExchangeRate } from '../models/exchange-rate.model';
import { BrazilianMarketAsset } from '../models/brazilian-market-asset.model';
import { MacroeconomicIndicator } from '../models/macroeconomic-indicator.model';
import { ProviderHealth } from '../models/provider-health.model';

@Injectable({ providedIn: 'root' })
export class FinancialDashboardService {
  private readonly repository = inject(FinancialDataRepository);

  readonly currenciesLoading = signal(true);
  readonly assetsLoading = signal(true);
  readonly selicLoading = signal(true);
  readonly ipcaLoading = signal(true);

  readonly currenciesError = signal<string | null>(null);
  readonly assetsError = signal<string | null>(null);
  readonly selicError = signal<string | null>(null);
  readonly ipcaError = signal<string | null>(null);

  private refreshTrigger = new Subject<void>();

  readonly dashboardData$: Observable<FinancialDashboardData> = this.refreshTrigger.pipe(
    startWith(undefined as void),
    switchMap(() => forkJoin({
      currencies: this.repository.getCurrencies().pipe(
        tap({ next: () => { this.currenciesLoading.set(false); this.currenciesError.set(null); }, error: (e) => { this.currenciesLoading.set(false); this.currenciesError.set(e?.message || 'Error'); } }),
        catchError(err => { this.currenciesLoading.set(false); this.currenciesError.set(err?.message || 'Error'); return of([] as ExchangeRate[]); })
      ),
      brazilianAssets: this.repository.getBrazilianAssets().pipe(
        tap({ next: () => { this.assetsLoading.set(false); this.assetsError.set(null); }, error: (e) => { this.assetsLoading.set(false); this.assetsError.set(e?.message || 'Error'); } }),
        catchError(err => { this.assetsLoading.set(false); this.assetsError.set(err?.message || 'Error'); return of([] as BrazilianMarketAsset[]); })
      ),
      selic: this.repository.getSelic().pipe(
        tap({ next: () => { this.selicLoading.set(false); this.selicError.set(null); }, error: (e) => { this.selicLoading.set(false); this.selicError.set(e?.message || 'Error'); } }),
        catchError(err => { this.selicLoading.set(false); this.selicError.set(err?.message || 'Error'); return of({} as MacroeconomicIndicator); })
      ),
      ipca: this.repository.getIpca().pipe(
        tap({ next: () => { this.ipcaLoading.set(false); this.ipcaError.set(null); }, error: (e) => { this.ipcaLoading.set(false); this.ipcaError.set(e?.message || 'Error'); } }),
        catchError(err => { this.ipcaLoading.set(false); this.ipcaError.set(err?.message || 'Error'); return of({} as MacroeconomicIndicator); })
      ),
    })),
    map(({ currencies, brazilianAssets, selic, ipca }) => {
      const providers: ProviderHealth[] = [
        { provider: 'AWESOME_API', status: currencies.length > 0 ? 'AVAILABLE' : 'UNAVAILABLE', lastSuccessAt: new Date().toISOString() },
        { provider: 'BRAPI', status: brazilianAssets.length > 0 ? 'AVAILABLE' : 'UNAVAILABLE', lastSuccessAt: new Date().toISOString() },
        { provider: 'BCB_SGS', status: selic?.latestValue != null ? 'AVAILABLE' : 'UNAVAILABLE', lastSuccessAt: new Date().toISOString() },
      ];
      const indicators: MacroeconomicIndicator[] = [];
      if (selic?.latestValue != null) indicators.push(selic);
      if (ipca?.latestValue != null) indicators.push(ipca);
      return {
        currencies,
        brazilianAssets,
        macroeconomicIndicators: indicators,
        updatedAt: new Date().toISOString(),
        providers,
      };
    }),
    shareReplay(1)
  );

  refresh(): void {
    this.currenciesLoading.set(true);
    this.assetsLoading.set(true);
    this.selicLoading.set(true);
    this.ipcaLoading.set(true);
    this.refreshTrigger.next();
  }
}
