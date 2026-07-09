import { Component, input } from '@angular/core';
import { NgClass, DatePipe, UpperCasePipe, DecimalPipe } from '@angular/common';
import { BrazilianMarketAsset } from '../../../../core/financial-data/models/brazilian-market-asset.model';
import { formatBRL, formatPercentage } from '../../../../core/utils/format-currency';

@Component({
  selector: 'app-asset-card',
  standalone: true,
  imports: [NgClass, DatePipe, UpperCasePipe, DecimalPipe],
  template: `
    <div class="asset-card" [ngClass]="{ 'positive': (asset().changePercent ?? 0) >= 0, 'negative': (asset().changePercent ?? 0) < 0 }">
      <div class="card-header">
        <div class="asset-info">
          @if (asset().logoUrl) {
            <img [src]="asset().logoUrl" [alt]="asset().ticker" class="logo" />
          } @else {
            <div class="ticker-badge">{{ asset().ticker | uppercase }}</div>
          }
          <div class="names">
            <h4>{{ asset().ticker | uppercase }}</h4>
            <span class="short-name">{{ asset().shortName || asset().name }}</span>
          </div>
        </div>
        <span class="asset-type-badge" [ngClass]="asset().assetType.toLowerCase()">{{ asset().assetType }}</span>
      </div>
      <div class="card-body">
        <div class="price-row main">
          <span class="label">Price</span>
          <span class="value">{{ formatBRL(asset().currentPrice) }}</span>
        </div>
        <div class="price-row">
          <span class="label">Change</span>
          <span class="value" [ngClass]="{ 'up': (asset().changePercent ?? 0) >= 0, 'down': (asset().changePercent ?? 0) < 0 }">
            <span class="arrow">{{ (asset().changePercent ?? 0) >= 0 ? '▲' : '▼' }}</span>
            {{ formatPercentage(asset().changePercent ?? 0) }}
          </span>
        </div>
        <div class="price-row">
          <span class="label">Volume</span>
          <span class="value">{{ (asset().volume ?? 0) | number }}</span>
        </div>
        @if (asset().marketCap) {
          <div class="price-row">
            <span class="label">Market Cap</span>
            <span class="value">{{ (asset().marketCap ?? 0) | number }}</span>
          </div>
        }
      </div>
      <div class="card-footer">
        @if (asset().providerTimestamp) {
          <span class="timestamp">Provider: {{ asset().providerTimestamp | date:'medium' }}</span>
        }
      </div>
    </div>
  `,
  styles: [`
    .asset-card {
      background: var(--card-bg, #fff);
      border: 1px solid var(--border-color, #e0e0e0);
      border-radius: 12px;
      padding: 1.25rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
      transition: transform 0.2s;
    }
    .asset-card:hover { transform: translateY(-2px); }
    .asset-card.positive { border-left: 4px solid #16a34a; }
    .asset-card.negative { border-left: 4px solid #dc2626; }
    .card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; }
    .asset-info { display: flex; align-items: center; gap: 0.75rem; }
    .logo { width: 40px; height: 40px; border-radius: 8px; object-fit: contain; }
    .ticker-badge { width: 40px; height: 40px; border-radius: 8px; background: var(--primary-light, #e0e7ff); color: var(--primary, #4f46e5); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.75rem; }
    .names h4 { margin: 0; font-size: 1rem; font-weight: 600; color: var(--text-primary, #1a1a2e); }
    .short-name { font-size: 0.8rem; color: var(--text-secondary, #6b7280); display: block; max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .asset-type-badge { font-size: 0.7rem; padding: 0.2rem 0.5rem; border-radius: 4px; font-weight: 500; }
    .asset-type-badge.stock { background: #dbeafe; color: #2563eb; }
    .asset-type-badge.fii { background: #dcfce7; color: #16a34a; }
    .asset-type-badge.etf { background: #fef3c7; color: #d97706; }
    .asset-type-badge.bdr { background: #f3e8ff; color: #9333ea; }
    .card-body { display: flex; flex-direction: column; gap: 0.4rem; }
    .price-row { display: flex; justify-content: space-between; align-items: center; }
    .label { font-size: 0.85rem; color: var(--text-secondary, #6b7280); }
    .value { font-size: 0.95rem; font-weight: 500; color: var(--text-primary, #1a1a2e); }
    .main .value { font-size: 1.2rem; font-weight: 700; color: var(--text-primary, #1a1a2e); }
    .value.up { color: #16a34a; }
    .value.down { color: #dc2626; }
    .arrow { margin-right: 0.25rem; }
    .card-footer { margin-top: 0.75rem; padding-top: 0.5rem; border-top: 1px solid var(--border-color, #e0e0e0); }
    .timestamp { font-size: 0.7rem; color: var(--text-secondary, #9ca3af); }
  `]
})
export class AssetCardComponent {
  readonly asset = input.required<BrazilianMarketAsset>();
  protected readonly formatBRL = formatBRL;
  protected readonly formatPercentage = formatPercentage;
}
