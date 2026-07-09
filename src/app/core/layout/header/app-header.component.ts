import { Component } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { ThemeSelectorComponent } from './theme-selector/theme-selector.component';
import { LanguageSelectorComponent } from './language-selector/language-selector.component';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [UpperCasePipe, ThemeSelectorComponent, LanguageSelectorComponent, TranslatePipe],
  template: `
    <header class="app-header">
      <div class="header-left">
        <span class="logo">📊</span>
        <span class="app-name">{{ 'dashboard.title' | translate }}</span>
      </div>
      <div class="header-right">
        <div class="connection-status">
          <span class="status-dot"></span>
        </div>
        <app-language-selector />
        <app-theme-selector />
      </div>
    </header>
  `,
  styles: [`
    .app-header {
      position: sticky;
      top: 0;
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: var(--header-height, 64px);
      padding: 0 1.5rem;
      background: var(--header-bg, #fff);
      border-bottom: 1px solid var(--header-border, #e4e7ec);
      backdrop-filter: blur(8px);
    }
    .header-left { display: flex; align-items: center; gap: 0.75rem; }
    .logo { font-size: 1.5rem; line-height: 1; }
    .app-name { font-size: 1rem; font-weight: 700; color: var(--header-text, #1a1a2e); }
    .header-right { display: flex; align-items: center; gap: 0.5rem; }
    .connection-status { display: flex; align-items: center; padding: 0 0.25rem; }
    .status-dot { width: 8px; height: 8px; border-radius: 50%; background: #16a34a; display: block; }
    @media (max-width: 640px) {
      .app-header { padding: 0 0.75rem; }
      .app-name { display: none; }
    }
  `]
})
export class AppHeaderComponent {}
