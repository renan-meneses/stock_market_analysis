import { Component, input, AfterViewInit, ElementRef, viewChild, effect } from '@angular/core';
import { NgClass, DatePipe } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { MacroeconomicIndicator } from '../../../../core/financial-data/models/macroeconomic-indicator.model';

Chart.register(...registerables);

@Component({
  selector: 'app-macro-card',
  standalone: true,
  imports: [NgClass, DatePipe],
  template: `
    <div class="macro-card">
      <div class="card-header">
        <h3>{{ indicator().name }}</h3>
        <span class="series-code">SGS {{ indicator().seriesCode }}</span>
      </div>
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
          Reference: {{ indicator().referenceDate }}
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
    .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    .card-header h3 { margin: 0; font-size: 1.1rem; font-weight: 600; color: var(--text-primary, #1a1a2e); }
    .series-code { font-size: 0.75rem; color: var(--text-secondary, #6b7280); background: var(--tag-bg, #f3f4f6); padding: 0.2rem 0.5rem; border-radius: 4px; }
    .current-value { display: flex; align-items: baseline; gap: 0.75rem; margin-bottom: 0.5rem; }
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
  readonly chartCanvas = viewChild<ElementRef<HTMLCanvasElement>>('chartCanvas');
  private chart?: Chart;

  constructor() {
    effect(() => {
      this.indicator();
      if (this.chart) {
        this.updateChart();
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
    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: data.history.map(p => p.date),
        datasets: [{
          label: data.name,
          data: data.history.map(p => p.value),
          borderColor: '#4f46e5',
          backgroundColor: 'rgba(79, 70, 229, 0.1)',
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
          },
        },
        scales: {
          x: {
            display: true,
            ticks: { maxTicksLimit: 10, color: '#6b7280' },
            grid: { display: false },
          },
          y: {
            display: true,
            ticks: { color: '#6b7280' },
            grid: { color: 'rgba(0,0,0,0.05)' },
          },
        },
      },
    };
    this.chart = new Chart(canvas, config);
  }

  private updateChart(): void {
    if (!this.chart) return;
    const data = this.indicator();
    this.chart.data.labels = data.history.map(p => p.date);
    this.chart.data.datasets[0].data = data.history.map(p => p.value);
    this.chart.data.datasets[0].label = data.name;
    this.chart.update();
  }
}
