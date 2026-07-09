import { Component, inject } from '@angular/core';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-theme-selector',
  standalone: true,
  template: `
    <button
      class="theme-toggle"
      (click)="toggle()"
      [attr.aria-label]="'Toggle theme, currently ' + themeService.resolvedTheme()"
    >
      @if (themeService.resolvedTheme() === 'dark') {
        <span class="icon">🌙</span>
      } @else {
        <span class="icon">☀️</span>
      }
    </button>
  `,
  styles: [`
    .theme-toggle {
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 8px;
      font-size: 1.25rem;
      line-height: 1;
      min-width: 44px;
      min-height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--header-text, #344054);
      transition: background 0.2s;
    }
    .theme-toggle:hover { background: var(--header-hover, #f2f4f7); }
  `]
})
export class ThemeSelectorComponent {
  protected readonly themeService = inject(ThemeService);

  toggle(): void {
    const next = this.themeService.resolvedTheme() === 'dark' ? 'light' : 'dark';
    this.themeService.setTheme(next);
  }
}
