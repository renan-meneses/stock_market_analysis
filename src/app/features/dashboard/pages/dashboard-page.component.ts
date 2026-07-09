import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Subscription, interval, startWith } from 'rxjs';
import { FinancialDashboardService } from '../../../core/financial-data/services/financial-dashboard.service';
import { CurrencyCardComponent } from '../components/currency-card/currency-card.component';
import { AssetCardComponent } from '../components/asset-card/asset-card.component';
import { MacroCardComponent } from '../components/macro-card/macro-card.component';
import { ProviderHealthComponent } from '../components/provider-health/provider-health.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    AsyncPipe, DatePipe,
    CurrencyCardComponent, AssetCardComponent, MacroCardComponent, ProviderHealthComponent,
  ],
  template: `
    <div class="dashboard">
      <header class="dashboard-header">
        <h1>Financial Dashboard</h1>
        <div class="controls">
          <button class="refresh-btn" (click)="refresh()">
            Refresh Now
          </button>
          @if (dashboardService.dashboardData$ | async; as data) {
            <span class="last-update">
              Updated: {{ data.updatedAt | date:'medium' }}
            </span>
          }
        </div>
      </header>

      <section class="provider-section">
        @if (dashboardService.dashboardData$ | async; as data) {
          <app-provider-health [providers]="data.providers"></app-provider-health>
        }
      </section>

      <section class="currencies-section">
        <h2>Currencies & Bitcoin</h2>
        @if (dashboardService.currenciesLoading()) {
          <div class="loading-indicator">Loading currencies...</div>
        }
        @if (dashboardService.currenciesError(); as err) {
          <div class="error-indicator">Error: {{ err }}</div>
        }
        @if (dashboardService.dashboardData$ | async; as data) {
          <div class="card-grid">
            @for (c of data.currencies; track c.symbol) {
              <app-currency-card [rate]="c"></app-currency-card>
            }
          </div>
        }
      </section>

      <section class="assets-section">
        <h2>B3 Stocks & FIIs</h2>
        @if (dashboardService.assetsLoading()) {
          <div class="loading-indicator">Loading assets...</div>
        }
        @if (dashboardService.assetsError(); as err) {
          <div class="error-indicator">Error: {{ err }}</div>
        }
        @if (dashboardService.dashboardData$ | async; as data) {
          <div class="card-grid">
            @for (a of data.brazilianAssets; track a.ticker) {
              <app-asset-card [asset]="a"></app-asset-card>
            }
          </div>
        }
      </section>

      <section class="macroeconomic-section">
        <h2>Macroeconomic Indicators</h2>
        <div class="macro-grid">
          @if (dashboardService.selicLoading()) { <div class="macro-loading">Loading Selic...</div> }
          @if (dashboardService.selicError(); as err) { <div class="macro-error">Selic Error: {{ err }}</div> }
          @if (dashboardService.ipcaLoading()) { <div class="macro-loading">Loading IPCA...</div> }
          @if (dashboardService.ipcaError(); as err) { <div class="macro-error">IPCA Error: {{ err }}</div> }
        </div>
        @if (dashboardService.dashboardData$ | async; as data) {
          <div class="card-grid">
            @for (m of data.macroeconomicIndicators; track m.seriesCode) {
              <app-macro-card [indicator]="m"></app-macro-card>
            }
          </div>
        }
      </section>
    </div>
  `,
  styles: [`
    .dashboard { padding: 1.5rem; max-width: 1400px; margin: 0 auto; }
    .dashboard-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .dashboard-header h1 { margin: 0; font-size: 1.5rem; font-weight: 700; color: var(--text-primary, #1a1a2e); }
    .controls { display: flex; align-items: center; gap: 1rem; }
    .refresh-btn { background: var(--primary, #4f46e5); color: #fff; border: none; padding: 0.5rem 1rem; border-radius: 8px; font-size: 0.85rem; cursor: pointer; transition: background 0.2s; }
    .refresh-btn:hover { background: var(--primary-dark, #4338ca); }
    .last-update { font-size: 0.8rem; color: var(--text-secondary, #6b7280); }
    section { margin-bottom: 2rem; }
    section h2 { font-size: 1.2rem; font-weight: 600; color: var(--text-primary, #1a1a2e); margin: 0 0 1rem; }
    .card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1rem; }
    .macro-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 1rem; }
    .loading-indicator, .macro-loading { padding: 0.75rem; background: #f0f9ff; border-radius: 8px; color: #0369a1; font-size: 0.9rem; margin-bottom: 0.5rem; }
    .error-indicator, .macro-error { padding: 0.75rem; background: #fce4ec; border-radius: 8px; color: #c62828; font-size: 0.9rem; margin-bottom: 0.5rem; }
    .provider-section { margin-bottom: 1.5rem; max-width: 400px; }
  `]
})
export class DashboardPageComponent implements OnInit, OnDestroy {
  protected readonly dashboardService = inject(FinancialDashboardService);
  private pollingSub?: Subscription;

  ngOnInit(): void {
    this.dashboardService.refresh();
    this.pollingSub = interval(3000).pipe(startWith(0)).subscribe(() => {
      this.dashboardService.refresh();
    });
  }

  ngOnDestroy(): void {
    this.pollingSub?.unsubscribe();
  }

  refresh(): void {
    this.dashboardService.refresh();
  }
}
