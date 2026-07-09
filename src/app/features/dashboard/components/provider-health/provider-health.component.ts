import { Component, input } from '@angular/core';
import { NgClass } from '@angular/common';
import { ProviderHealth } from '../../../../core/financial-data/models/provider-health.model';

@Component({
  selector: 'app-provider-health',
  standalone: true,
  imports: [NgClass],
  template: `
    <div class="provider-health">
      <h3>Provider Status</h3>
      <div class="providers">
        @for (p of providers(); track p.provider) {
          <div class="provider-item" [ngClass]="p.status.toLowerCase()">
            <span class="provider-name">{{ p.provider }}</span>
            <span class="status-badge" [ngClass]="p.status.toLowerCase()">{{ p.status }}</span>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .provider-health { background: var(--card-bg, #fff); border: 1px solid var(--border-color, #e0e0e0); border-radius: 12px; padding: 1.25rem; }
    .provider-health h3 { margin: 0 0 1rem; font-size: 1rem; font-weight: 600; color: var(--text-primary, #1a1a2e); }
    .providers { display: flex; flex-direction: column; gap: 0.5rem; }
    .provider-item { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0.75rem; border-radius: 8px; background: var(--bg-subtle, #f9fafb); }
    .provider-name { font-size: 0.9rem; font-weight: 500; color: var(--text-primary, #1a1a2e); }
    .status-badge { font-size: 0.75rem; font-weight: 600; padding: 0.2rem 0.5rem; border-radius: 4px; }
    .status-badge.available { background: #dcfce7; color: #16a34a; }
    .status-badge.delayed { background: #fef3c7; color: #d97706; }
    .status-badge.rate_limited { background: #fef3c7; color: #d97706; }
    .status-badge.unavailable { background: #fce4ec; color: #dc2626; }
    .status-badge.unknown { background: #f3f4f6; color: #6b7280; }
  `]
})
export class ProviderHealthComponent {
  readonly providers = input.required<ProviderHealth[]>();
}
