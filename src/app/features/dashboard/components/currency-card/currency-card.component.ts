import { Component, input } from '@angular/core';
import { NgClass, DatePipe } from '@angular/common';
import { ExchangeRate } from '../../../../core/financial-data/models/exchange-rate.model';
import { formatBRL, formatPercentage } from '../../../../core/utils/format-currency';

@Component({
  selector: 'app-currency-card',
  standalone: true,
  imports: [NgClass, DatePipe],
  template: `
    <div class="currency-card" [ngClass]="{ 'positive': rate().percentageChange >= 0, 'negative': rate().percentageChange < 0 }">
      <div class="card-header">
        <h3>{{ rate().displayName }}</h3>
        <span class="symbol">{{ rate().symbol }}</span>
      </div>
      <div class="card-body">
        <div class="price-row">
          <span class="label">Bid</span>
          <span class="value">{{ formatBRL(rate().bid) }}</span>
        </div>
        <div class="price-row">
          <span class="label">Ask</span>
          <span class="value">{{ formatBRL(rate().ask) }}</span>
        </div>
        <div class="price-row">
          <span class="label">High</span>
          <span class="value">{{ formatBRL(rate().high) }}</span>
        </div>
        <div class="price-row">
          <span class="label">Low</span>
          <span class="value">{{ formatBRL(rate().low) }}</span>
        </div>
        <div class="price-row variation">
          <span class="label">Variation</span>
          <span class="value" [ngClass]="{ 'up': rate().percentageChange >= 0, 'down': rate().percentageChange < 0 }">
            <span class="arrow">{{ rate().percentageChange >= 0 ? '▲' : '▼' }}</span>
            {{ formatPercentage(rate().percentageChange) }}
          </span>
        </div>
      </div>
      <div class="card-footer">
        <span class="timestamp">Updated: {{ rate().synchronizedAt | date:'medium' }}</span>
      </div>
    </div>
  `,
  styles: [`
    .currency-card {
      background: var(--card-bg, #fff);
      border: 1px solid var(--border-color, #e0e0e0);
      border-radius: 12px;
      padding: 1.25rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .currency-card:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,0.1); }
    .currency-card.positive { border-left: 4px solid #16a34a; }
    .currency-card.negative { border-left: 4px solid #dc2626; }
    .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    .card-header h3 { margin: 0; font-size: 1.1rem; font-weight: 600; color: var(--text-primary, #1a1a2e); }
    .symbol { font-size: 0.8rem; color: var(--text-secondary, #6b7280); background: var(--tag-bg, #f3f4f6); padding: 0.2rem 0.5rem; border-radius: 4px; }
    .card-body { display: flex; flex-direction: column; gap: 0.5rem; }
    .price-row { display: flex; justify-content: space-between; align-items: center; }
    .label { font-size: 0.85rem; color: var(--text-secondary, #6b7280); }
    .value { font-size: 0.95rem; font-weight: 500; color: var(--text-primary, #1a1a2e); }
    .variation .value.up { color: #16a34a; }
    .variation .value.down { color: #dc2626; }
    .arrow { margin-right: 0.25rem; }
    .card-footer { margin-top: 1rem; padding-top: 0.75rem; border-top: 1px solid var(--border-color, #e0e0e0); }
    .timestamp { font-size: 0.75rem; color: var(--text-secondary, #9ca3af); }
  `]
})
export class CurrencyCardComponent {
  readonly rate = input.required<ExchangeRate>();
  protected readonly formatBRL = formatBRL;
  protected readonly formatPercentage = formatPercentage;
}