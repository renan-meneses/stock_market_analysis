import { Component, input, output } from '@angular/core';
import { NgClass } from '@angular/common';
import { DataStatus } from '../../../core/models/data-status.model';

@Component({
  selector: 'app-data-status',
  standalone: true,
  imports: [NgClass],
  template: `
    <div class="data-status" [ngClass]="status()">
      @if (status() === 'LIVE') {
        <span class="status-icon live-icon">●</span>
        <span class="status-text">Live</span>
      }
      @if (status() === 'UPDATING') {
        <span class="status-icon updating-icon">⟳</span>
        <span class="status-text">Updating</span>
      }
      @if (status() === 'STALE') {
        <span class="status-icon stale-icon">◐</span>
        <span class="status-text">Showing cached data</span>
        @if (lastUpdate()) {
          <span class="last-update">Last updated {{ lastUpdate() }}</span>
        }
        @if (retryable()) {
          <button class="retry-btn" [disabled]="retryInProgress()" (click)="retry.emit()">
            {{ retryInProgress() ? 'Retrying...' : 'Retry' }}
          </button>
        }
      }
      @if (status() === 'FALLBACK') {
        <span class="status-icon fallback-icon">◷</span>
        <span class="status-text">Showing sample data</span>
      }
      @if (status() === 'ERROR') {
        <span class="status-icon error-icon">▲</span>
        <span class="status-text">Live data unavailable</span>
        @if (retryable()) {
          <button class="retry-btn" [disabled]="retryInProgress()" (click)="retry.emit()">
            {{ retryInProgress() ? 'Retrying...' : 'Retry' }}
          </button>
        }
      }
      @if (status() === 'LOADING') {
        <span class="status-icon loading-icon">◌</span>
        <span class="status-text">Loading...</span>
      }
    </div>
  `,
  styles: [`
    .data-status {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.375rem 0.75rem;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 500;
      background: var(--status-bg, #f3f4f6);
      color: var(--status-text, #6b7280);
    }
    .data-status.live { background: var(--status-live-bg, #dcfce7); color: var(--status-live-text, #16a34a); }
    .data-status.updating { background: var(--status-updating-bg, #dbeafe); color: var(--status-updating-text, #2563eb); }
    .data-status.stale { background: var(--status-stale-bg, #fef3c7); color: var(--status-stale-text, #d97706); }
    .data-status.fallback { background: var(--status-fallback-bg, #f3e8ff); color: var(--status-fallback-text, #9333ea); }
    .data-status.error { background: var(--status-error-bg, #fce4ec); color: var(--status-error-text, #dc2626); }
    .data-status.loading { background: var(--status-loading-bg, #f0f9ff); color: var(--status-loading-text, #0369a1); }
    .status-icon { font-size: 0.875rem; line-height: 1; }
    .status-text { flex: 1; }
    .last-update { font-size: 0.7rem; opacity: 0.8; }
    .retry-btn { background: transparent; border: 1px solid currentColor; border-radius: 4px; padding: 0.125rem 0.5rem; font-size: 0.7rem; cursor: pointer; color: inherit; white-space: nowrap; }
    .retry-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .retry-btn:hover:not(:disabled) { background: rgba(0,0,0,0.05); }
  `]
})
export class DataStatusComponent {
  readonly status = input.required<DataStatus>();
  readonly lastUpdate = input<string>();
  readonly retryable = input(true);
  readonly retryInProgress = input(false);
  readonly retry = output<void>();
}
