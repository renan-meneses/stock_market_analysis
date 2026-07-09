import { Injectable, inject, signal } from '@angular/core';
import { Observable, of, catchError, map } from 'rxjs';
import { FinancialDataRepository } from '../repositories/financial-data.repository';
import { FinancialDashboardData } from '../models/financial-dashboard-data.model';
import { ExchangeRate } from '../models/exchange-rate.model';
import { BrazilianMarketAsset } from '../models/brazilian-market-asset.model';
import { MacroeconomicIndicator } from '../models/macroeconomic-indicator.model';
import { ChartViewModel, DataStatus, MARKET_CACHE_KEYS } from '../../../core/models/data-status.model';
import { LastKnownDataStoreService } from '../../../core/services/last-known-data-store.service';

@Injectable({ providedIn: 'root' })
export class FinancialDashboardService {
  private readonly repository = inject(FinancialDataRepository);
  private readonly store = inject(LastKnownDataStoreService);

  readonly currenciesStatus = signal<ChartViewModel<ExchangeRate[]>>({
    data: [], status: 'LOADING', isUpdating: false,
  });
  readonly assetsStatus = signal<ChartViewModel<BrazilianMarketAsset[]>>({
    data: [], status: 'LOADING', isUpdating: false,
  });
  readonly selicStatus = signal<ChartViewModel<MacroeconomicIndicator | null>>({
    data: null, status: 'LOADING', isUpdating: false,
  });
  readonly ipcaStatus = signal<ChartViewModel<MacroeconomicIndicator | null>>({
    data: null, status: 'LOADING', isUpdating: false,
  });

  readonly dashboardData$: Observable<FinancialDashboardData>;

  constructor() {
    this.loadInitialFromCache();
    this.dashboardData$ = of({} as FinancialDashboardData);
  }

  private loadInitialFromCache(): void {
    const cachedCurrencies = this.store.get<ExchangeRate[]>(MARKET_CACHE_KEYS.currencies);
    if (cachedCurrencies?.length) {
      this.currenciesStatus.set({ data: cachedCurrencies, status: 'STALE', isUpdating: false, message: 'Showing cached data' });
    }
    const cachedAssets = this.store.get<BrazilianMarketAsset[]>(MARKET_CACHE_KEYS.b3Assets);
    if (cachedAssets?.length) {
      this.assetsStatus.set({ data: cachedAssets, status: 'STALE', isUpdating: false, message: 'Showing cached data' });
    }
    const cachedSelic = this.store.get<MacroeconomicIndicator>(MARKET_CACHE_KEYS.selic);
    if (cachedSelic?.latestValue != null) {
      this.selicStatus.set({ data: cachedSelic, status: 'STALE', isUpdating: false, message: 'Showing cached data' });
    }
    const cachedIpca = this.store.get<MacroeconomicIndicator>(MARKET_CACHE_KEYS.ipca);
    if (cachedIpca?.latestValue != null) {
      this.ipcaStatus.set({ data: cachedIpca, status: 'STALE', isUpdating: false, message: 'Showing cached data' });
    }
  }

  refreshCurrencies(): void {
    this.currenciesStatus.update(s => ({ ...s, isUpdating: true }));
    this.repository.getCurrencies().pipe(
      map(data => {
        if (data?.length) {
          this.store.set(MARKET_CACHE_KEYS.currencies, data);
          this.currenciesStatus.set({
            data, status: 'LIVE', isUpdating: false,
            lastSuccessfulUpdate: new Date().toISOString(),
          });
        }
      }),
      catchError(() => {
        this.currenciesStatus.update(s => ({
          ...s, isUpdating: false,
          status: (s.data?.length ? 'STALE' : 'FALLBACK') as DataStatus,
          message: 'Live data is temporarily unavailable',
        }));
        return of(null);
      })
    ).subscribe();
  }

  refreshAssets(): void {
    this.assetsStatus.update(s => ({ ...s, isUpdating: true }));
    this.repository.getBrazilianAssets().pipe(
      map(data => {
        if (data?.length) {
          this.store.set(MARKET_CACHE_KEYS.b3Assets, data);
          this.assetsStatus.set({
            data, status: 'LIVE', isUpdating: false,
            lastSuccessfulUpdate: new Date().toISOString(),
          });
        }
      }),
      catchError(() => {
        this.assetsStatus.update(s => ({
          ...s, isUpdating: false,
          status: (s.data?.length ? 'STALE' : 'FALLBACK') as DataStatus,
          message: 'Live data is temporarily unavailable',
        }));
        return of(null);
      })
    ).subscribe();
  }

  refreshSelic(): void {
    this.selicStatus.update(s => ({ ...s, isUpdating: true }));
    this.repository.getSelic().pipe(
      map(data => {
        if (data?.latestValue != null) {
          this.store.set(MARKET_CACHE_KEYS.selic, data);
          this.selicStatus.set({
            data, status: 'LIVE', isUpdating: false,
            lastSuccessfulUpdate: new Date().toISOString(),
          });
        }
      }),
      catchError(() => {
        this.selicStatus.update(s => ({
          ...s, isUpdating: false,
          status: (s.data?.latestValue != null ? 'STALE' : 'FALLBACK') as DataStatus,
          message: 'Live data is temporarily unavailable',
        }));
        return of(null);
      })
    ).subscribe();
  }

  refreshIpca(): void {
    this.ipcaStatus.update(s => ({ ...s, isUpdating: true }));
    this.repository.getIpca().pipe(
      map(data => {
        if (data?.latestValue != null) {
          this.store.set(MARKET_CACHE_KEYS.ipca, data);
          this.ipcaStatus.set({
            data, status: 'LIVE', isUpdating: false,
            lastSuccessfulUpdate: new Date().toISOString(),
          });
        }
      }),
      catchError(() => {
        this.ipcaStatus.update(s => ({
          ...s, isUpdating: false,
          status: (s.data?.latestValue != null ? 'STALE' : 'FALLBACK') as DataStatus,
          message: 'Live data is temporarily unavailable',
        }));
        return of(null);
      })
    ).subscribe();
  }

  refreshAll(): void {
    this.refreshCurrencies();
    this.refreshAssets();
    this.refreshSelic();
    this.refreshIpca();
  }
}
