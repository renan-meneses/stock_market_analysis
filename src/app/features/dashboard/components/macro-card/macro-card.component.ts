import { Component, input, AfterViewInit, ElementRef, viewChild, effect, inject } from '@angular/core';
import { NgClass, DatePipe } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { MacroeconomicIndicator } from '../../../../core/financial-data/models/macroeconomic-indicator.model';
import { DataStatus } from '../../../../core/models/data-status.model';
import { ThemeService } from '../../../../core/services/theme.service';

Chart.register(...registerables);

@Component({
  selector: 'app-macro-card',
  standalone: true,
  imports: [NgClass, DatePipe],
  template: `
    <div class="macro-card">
      <div class="card-body">
        <div class="current-value">
          <span class="label">Current</span>
          <span class="value">{{ indicator().latestValue }}</span>
          @if (indicator().percentageChange !== null) {
            <span class="change" [ngClass]="{ 'up': (indicator().percentageChange ?? 0) >= 0, 'down': (indicator().percentageChange ?? 0) < 0 }">
              {{ (indicator().percentageChange ?? 0) >= 0 ? '+' : '' }}{{ indicator().percentageChange?.toFixed(2) }}%
            </span>
          }
        </div>
        <div class="reference-date">
          {{ indicator().name }} - Reference: {{ indicator().referenceDate }}
        </div>
        <div class="chart-container">
          <canvas #chartCanvas></canvas>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .macro-card {
      background: var(--card-bg, #fff);
      border: 1px solid var(--border-color, #e0e0e0);
      border-radius: 12px;
      padding: 1.25rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }
    .current-value { display: flex; align-items: baseline; gap: 0.75rem; margin-bottom: 0.25rem; }
    .current-value .label { font-size: 0.85rem; color: var(--text-secondary, #6b7280); }
    .current-value .value { font-size: 2rem; font-weight: 700; color: var(--text-primary, #1a1a2e); }
    .change { font-size: 0.9rem; font-weight: 600; }
    .change.up { color: #16a34a; }
    .change.down { color: #dc2626; }
    .reference-date { font-size: 0.8rem; color: var(--text-secondary, #9ca3af); margin-bottom: 1rem; }
    .chart-container { position: relative; height: 250px; }
  `]
})
export class MacroCardComponent implements AfterViewInit {
  readonly indicator = input.required<MacroeconomicIndicator>();
  readonly status = input<DataStatus>('LIVE');
  private readonly themeService = inject(ThemeService);

  readonly chartCanvas = viewChild<ElementRef<HTMLCanvasElement>>('chartCanvas');
  private chart?: Chart;

  constructor() {
    effect(() => {
      this.indicator();
      if (this.chart) {
        this.updateChart();
      }
    });
    effect(() => {
      this.themeService.resolvedTheme();
      if (this.chart) {
        this.updateChartTheme();
      }
    });
  }

  ngAfterViewInit(): void {
    this.initChart();
  }

  private initChart(): void {
    const canvas = this.chartCanvas()?.nativeElement;
    if (!canvas) return;
    const data = this.indicator();
    const isDark = this.themeService.resolvedTheme() === 'dark';
    const history = this.sanitizeSeries(data.history);

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: history.map(p => p.date),
        datasets: [{
          label: data.name,
          data: history.map(p => p.value),
          borderColor: '#818cf8',
          backgroundColor: isDark ? 'rgba(129, 140, 248, 0.15)' : 'rgba(79, 70, 229, 0.1)',
          fill: true,
          tension: 0.3,
          pointRadius: 0,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: isDark ? '#1e293b' : '#ffffff',
            titleColor: isDark ? '#e2e8f0' : '#1a1a2e',
            bodyColor: isDark ? '#94a3b8' : '#6b7280',
            borderColor: isDark ? '#334155' : '#e5e7eb',
            borderWidth: 1,
          },
        },
        scales: {
          x: {
            display: true,
            ticks: { maxTicksLimit: 10, color: isDark ? '#94a3b8' : '#6b7280' },
            grid: { display: false },
          },
          y: {
            display: true,
            ticks: { color: isDark ? '#94a3b8' : '#6b7280' },
            grid: { color: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' },
          },
        },
      },
    };
    this.chart = new Chart(canvas, config);
  }

  private updateChart(): void {
    if (!this.chart) return;
    const data = this.indicator();
    const history = this.sanitizeSeries(data.history);
    this.chart.data.labels = history.map(p => p.date);
    this.chart.data.datasets[0].data = history.map(p => p.value);
    this.chart.data.datasets[0].label = data.name;
    this.chart.update('none');
  }

  private updateChartTheme(): void {
    if (!this.chart) return;
    const isDark = this.themeService.resolvedTheme() === 'dark';
    const borderColor = isDark ? 'rgba(129, 140, 248, 0.15)' : 'rgba(79, 70, 229, 0.1)';
    if (this.chart.data.datasets[0]) {
      this.chart.data.datasets[0].backgroundColor = borderColor;
    }
    const opts = this.chart.options as unknown as Record<string, unknown>;
    const scales = opts['scales'] as Record<string, unknown> | undefined;
    if (scales?.['x']) (scales['x'] as Record<string, unknown>)['ticks'] = { ...(scales['x'] as Record<string, unknown>)['ticks'] as Record<string, unknown>, color: isDark ? '#94a3b8' : '#6b7280' };
    if (scales?.['y']) {
      (scales['y'] as Record<string, unknown>)['ticks'] = { ...(scales['y'] as Record<string, unknown>)['ticks'] as Record<string, unknown>, color: isDark ? '#94a3b8' : '#6b7280' };
      (scales['y'] as Record<string, unknown>)['grid'] = { ...(scales['y'] as Record<string, unknown>)['grid'] as Record<string, unknown>, color: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' };
    }
    const plugins = opts['plugins'] as Record<string, unknown> | undefined;
    if (plugins?.['tooltip']) {
      const tooltip = plugins['tooltip'] as Record<string, unknown>;
      tooltip['backgroundColor'] = isDark ? '#1e293b' : '#ffffff';
      tooltip['titleColor'] = isDark ? '#e2e8f0' : '#1a1a2e';
      tooltip['bodyColor'] = isDark ? '#94a3b8' : '#6b7280';
      tooltip['borderColor'] = isDark ? '#334155' : '#e5e7eb';
    }
    this.chart.update('none');
  }

  private sanitizeSeries(points: MacroeconomicIndicator['history']): MacroeconomicIndicator['history'] {
    return (points || []).filter(p =>
      Number.isFinite(p.value) && Boolean(p.date)
    );
  }
}
