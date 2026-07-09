import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Subscription, interval, startWith } from 'rxjs';
import { FinancialDashboardService } from '../../../core/financial-data/services/financial-dashboard.service';
import { CurrencyCardComponent } from '../components/currency-card/currency-card.component';
import { AssetCardComponent } from '../components/asset-card/asset-card.component';
import { MacroCardComponent } from '../components/macro-card/macro-card.component';
import { ProviderHealthComponent } from '../components/provider-health/provider-health.component';
import { DataStatusComponent } from '../../../shared/components/data-status/data-status.component';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    AsyncPipe, DatePipe,
    CurrencyCardComponent, AssetCardComponent, MacroCardComponent,
    ProviderHealthComponent, DataStatusComponent, TranslatePipe,
  ],
  template: `
    <div class="dashboard">
      <section class="currencies-section">
        <div class="section-header">
          <h2>{{ 'dashboard.currencies' | translate }}</h2>
          <app-data-status
            [status]="dashboardService.currenciesStatus().status"
            [retryable]="true"
            [retryInProgress]="dashboardService.currenciesStatus().isUpdating"
            (retry)="dashboardService.refreshCurrencies()"
          />
        </div>
        <div class="card-grid">
          @for (c of dashboardService.currenciesStatus().data; track c.symbol) {
            <app-currency-card [rate]="c"></app-currency-card>
          }
        </div>
      </section>

      <section class="assets-section">
        <div class="section-header">
          <h2>{{ 'dashboard.assets' | translate }}</h2>
          <app-data-status
            [status]="dashboardService.assetsStatus().status"
            [retryable]="true"
            [retryInProgress]="dashboardService.assetsStatus().isUpdating"
            (retry)="dashboardService.refreshAssets()"
          />
        </div>
        <div class="card-grid">
          @for (a of dashboardService.assetsStatus().data; track a.ticker) {
            <app-asset-card [asset]="a"></app-asset-card>
          }
        </div>
      </section>

      <section class="macroeconomic-section">
        <h2>{{ 'dashboard.macroeconomic' | translate }}</h2>
        <div class="macro-grid">
          <div class="macro-card-wrapper">
            <div class="section-header">
              <h3>{{ 'macro.selic' | translate }}</h3>
              <app-data-status
                [status]="dashboardService.selicStatus().status"
                [retryable]="true"
                [retryInProgress]="dashboardService.selicStatus().isUpdating"
                (retry)="dashboardService.refreshSelic()"
              />
            </div>
            <app-macro-card
              [indicator]="dashboardService.selicStatus().data ?? fallbackSelic()"
              [status]="dashboardService.selicStatus().status"
            />
          </div>
          <div class="macro-card-wrapper">
            <div class="section-header">
              <h3>{{ 'macro.ipca' | translate }}</h3>
              <app-data-status
                [status]="dashboardService.ipcaStatus().status"
                [retryable]="true"
                [retryInProgress]="dashboardService.ipcaStatus().isUpdating"
                (retry)="dashboardService.refreshIpca()"
              />
            </div>
            <app-macro-card
              [indicator]="dashboardService.ipcaStatus().data ?? fallbackIpca()"
              [status]="dashboardService.ipcaStatus().status"
            />
          </div>
        </div>
      </section>

      <section class="provider-section">
        <app-provider-health [providers]="providerHealth()" />
      </section>
    </div>
  `,
  styles: [`
    .dashboard { padding: 1.5rem; max-width: 1400px; margin: 0 auto; }
    section { margin-bottom: 2rem; }
    .section-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; flex-wrap: wrap; }
    .section-header h2, .section-header h3 { margin: 0; font-size: 1.15rem; font-weight: 600; color: var(--text-primary, #1a1a2e); }
    .macroeconomic-section > h2 { margin: 0 0 1rem 0; font-size: 1.15rem; font-weight: 600; color: var(--text-primary, #1a1a2e); }
    .section-header h3 { font-size: 1rem; }
    .card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1rem; }
    .macro-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(450px, 1fr)); gap: 1.5rem; }
    .macro-card-wrapper { display: flex; flex-direction: column; gap: 0.75rem; }
    .provider-section { margin-bottom: 1.5rem; max-width: 400px; }
    @media (max-width: 640px) {
      .dashboard { padding: 1rem; }
      .card-grid { grid-template-columns: 1fr; }
      .macro-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class DashboardPageComponent implements OnInit, OnDestroy {
  protected readonly dashboardService = inject(FinancialDashboardService);
  private pollingSub?: Subscription;

  protected readonly providerHealth = signal([
    { provider: 'AWESOME_API' as const, status: 'AVAILABLE' as const, lastSuccessAt: new Date().toISOString() },
    { provider: 'BRAPI' as const, status: 'AVAILABLE' as const, lastSuccessAt: new Date().toISOString() },
    { provider: 'BCB_SGS' as const, status: 'AVAILABLE' as const, lastSuccessAt: new Date().toISOString() },
  ]);

  protected readonly fallbackSelic = signal({
    type: 'SELIC' as const,
    name: 'Selic',
    seriesCode: 11,
    latestValue: 13.75,
    previousValue: 14.25,
    absoluteChange: -0.50,
    percentageChange: -3.51,
    referenceDate: '2026-06-01',
    history: [
      { date: '2025-01-01', value: 12.25 },
      { date: '2025-04-01', value: 14.25 },
      { date: '2025-07-01', value: 14.25 },
      { date: '2025-10-01', value: 13.25 },
      { date: '2026-01-01', value: 14.25 },
      { date: '2026-04-01', value: 14.00 },
      { date: '2026-06-01', value: 13.75 },
    ],
    synchronizedAt: new Date().toISOString(),
  });

  protected readonly fallbackIpca = signal({
    type: 'IPCA' as const,
    name: 'IPCA',
    seriesCode: 433,
    latestValue: 0.44,
    previousValue: 0.42,
    absoluteChange: 0.02,
    percentageChange: 4.76,
    referenceDate: '2026-06-01',
    history: [
      { date: '2025-01-01', value: 0.16 },
      { date: '2025-04-01', value: 0.61 },
      { date: '2025-07-01', value: 0.12 },
      { date: '2025-10-01', value: 0.45 },
      { date: '2026-01-01', value: 0.28 },
      { date: '2026-04-01', value: 0.38 },
      { date: '2026-06-01', value: 0.44 },
    ],
    synchronizedAt: new Date().toISOString(),
  });

  ngOnInit(): void {
    this.dashboardService.refreshAll();
    this.pollingSub = interval(3000).pipe(startWith(0)).subscribe(() => {
      this.dashboardService.refreshCurrencies();
      this.dashboardService.refreshAssets();
    });
  }

  ngOnDestroy(): void {
    this.pollingSub?.unsubscribe();
  }
}
