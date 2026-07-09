import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, of, timer } from 'rxjs';
import { catchError, shareReplay, retry, timeout } from 'rxjs/operators';
import { AppConfigService } from '../../config/app-config.service';
import { AwesomeApiAdapter } from '../adapters/awesome-api.adapter';
import { BrapiAdapter } from '../adapters/brapi.adapter';
import { BcbSgsAdapter } from '../adapters/bcb-sgs.adapter';
import { ExchangeRate } from '../models/exchange-rate.model';
import { BrazilianMarketAsset } from '../models/brazilian-market-asset.model';
import { MacroeconomicIndicator } from '../models/macroeconomic-indicator.model';
import { CACHE_POLICIES } from '../models/cache-policies';

@Injectable({ providedIn: 'root' })
export class FinancialDataRepository {
  private readonly awesomeApi = inject(AwesomeApiAdapter);
  private readonly brapi = inject(BrapiAdapter);
  private readonly bcbSgs = inject(BcbSgsAdapter);
  private readonly config = inject(AppConfigService);

  private currenciesCache$?: Observable<ExchangeRate[]>;
  private lastCurrenciesFetch = 0;

  private assetsCache$?: Observable<BrazilianMarketAsset[]>;
  private lastAssetsFetch = 0;

  private selicCache$?: Observable<MacroeconomicIndicator>;
  private lastSelicFetch = 0;

  private ipcaCache$?: Observable<MacroeconomicIndicator>;
  private lastIpcaFetch = 0;

  private readonly DEFAULT_TICKERS = ['PETR4', 'VALE3', 'ITUB4', 'BBDC4', 'BBAS3', 'WEGE3', 'MGLU3', 'HGLG11', 'KNRI11', 'MXRF11'];

  getCurrencies(): Observable<ExchangeRate[]> {
    const now = Date.now();
    if (!this.currenciesCache$ || now - this.lastCurrenciesFetch > CACHE_POLICIES.exchangeRates) {
      this.currenciesCache$ = this.awesomeApi.getLatestRates().pipe(
        timeout(this.config.getConfig().requestTimeoutMs),
        retry({ count: 2, delay: (_, i) => timer(Math.min(1000 * 2 ** i, 5000)) }),
        shareReplay(1)
      );
      this.lastCurrenciesFetch = now;
    }
    return this.currenciesCache$;
  }

  getBrazilianAssets(tickers?: string[]): Observable<BrazilianMarketAsset[]> {
    const now = Date.now();
    const target = tickers || this.DEFAULT_TICKERS;
    if (!this.assetsCache$ || now - this.lastAssetsFetch > CACHE_POLICIES.assetQuotes) {
      this.assetsCache$ = this.brapi.getAssets(target).pipe(
        timeout(this.config.getConfig().requestTimeoutMs),
        retry({ count: 2, delay: (_, i) => timer(Math.min(1000 * 2 ** i, 5000)) }),
        shareReplay(1)
      );
      this.lastAssetsFetch = now;
    }
    return this.assetsCache$;
  }

  getSelic(): Observable<MacroeconomicIndicator> {
    const now = Date.now();
    if (!this.selicCache$ || now - this.lastSelicFetch > CACHE_POLICIES.macroeconomicIndicators) {
      this.selicCache$ = this.bcbSgs.getSeries('SELIC', 11).pipe(
        timeout(this.config.getConfig().requestTimeoutMs),
        retry({ count: 2, delay: (_, i) => timer(Math.min(1000 * 2 ** i, 5000)) }),
        shareReplay(1)
      );
      this.lastSelicFetch = now;
    }
    return this.selicCache$;
  }

  getIpca(): Observable<MacroeconomicIndicator> {
    const now = Date.now();
    if (!this.ipcaCache$ || now - this.lastIpcaFetch > CACHE_POLICIES.macroeconomicIndicators) {
      this.ipcaCache$ = this.bcbSgs.getSeries('IPCA', 433).pipe(
        timeout(this.config.getConfig().requestTimeoutMs),
        retry({ count: 2, delay: (_, i) => timer(Math.min(1000 * 2 ** i, 5000)) }),
        shareReplay(1)
      );
      this.lastIpcaFetch = now;
    }
    return this.ipcaCache$;
  }

  getAll(): Observable<{ currencies: ExchangeRate[]; assets: BrazilianMarketAsset[]; selic: MacroeconomicIndicator; ipca: MacroeconomicIndicator }> {
    return forkJoin({
      currencies: this.getCurrencies().pipe(catchError(() => of([]))),
      assets: this.getBrazilianAssets().pipe(catchError(() => of([]))),
      selic: this.getSelic().pipe(catchError(() => of({} as MacroeconomicIndicator))),
      ipca: this.getIpca().pipe(catchError(() => of({} as MacroeconomicIndicator))),
    });
  }
}
