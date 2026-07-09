import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap, shareReplay } from 'rxjs/operators';

export interface AppRuntimeConfig {
  backendApiBaseUrl: string;
  awesomeApiBaseUrl: string;
  bcbApiBaseUrl: string;
  marketRefreshIntervalMs: number;
  macroeconomicRefreshIntervalMs: number;
  requestTimeoutMs: number;
  enableMockApi: boolean;
}

const DEFAULT_CONFIG: AppRuntimeConfig = {
  backendApiBaseUrl: '/api',
  awesomeApiBaseUrl: 'https://economia.awesomeapi.com.br/json',
  bcbApiBaseUrl: 'https://api.bcb.gov.br',
  marketRefreshIntervalMs: 3000,
  macroeconomicRefreshIntervalMs: 21_600_000,
  requestTimeoutMs: 10000,
  enableMockApi: false,
};

@Injectable({ providedIn: 'root' })
export class AppConfigService {
  private readonly http = inject(HttpClient);
  private config: AppRuntimeConfig = DEFAULT_CONFIG;
  private config$?: Observable<AppRuntimeConfig>;

  load(): Observable<AppRuntimeConfig> {
    if (!this.config$) {
      this.config$ = this.http.get<AppRuntimeConfig>('assets/config/app-config.json').pipe(
        tap(c => { this.config = { ...DEFAULT_CONFIG, ...c }; }),
        catchError(() => {
          this.config = DEFAULT_CONFIG;
          return of(DEFAULT_CONFIG);
        }),
        shareReplay(1)
      );
    }
    return this.config$;
  }

  getConfig(): AppRuntimeConfig {
    return this.config;
  }
}
