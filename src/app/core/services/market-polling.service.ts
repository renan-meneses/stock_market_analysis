import { Injectable, inject } from '@angular/core';
import { interval, Observable, Subject } from 'rxjs';
import { switchMap, startWith } from 'rxjs/operators';
import { AppConfigService } from '../config/app-config.service';
import { FinancialDashboardService } from '../financial-data/services/financial-dashboard.service';

@Injectable({ providedIn: 'root' })
export class MarketPollingService {
  private readonly config = inject(AppConfigService);
  private readonly dashboardService = inject(FinancialDashboardService);

  private marketIntervalMs = this.config.getConfig().marketRefreshIntervalMs;
  private macroIntervalMs = this.config.getConfig().macroeconomicRefreshIntervalMs;

  startMarketPolling(): Observable<void> {
    return interval(this.marketIntervalMs).pipe(
      startWith(0),
      switchMap(() => {
        this.dashboardService.refreshAll();
        return new Subject<void>();
      })
    );
  }
}
