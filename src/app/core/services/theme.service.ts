import { Injectable, signal, effect } from '@angular/core';
import { AppTheme, THEME_STORAGE_KEY } from '../models/data-status.model';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly defaultTheme: AppTheme = 'dark';
  readonly currentTheme = signal<AppTheme>(this.defaultTheme);
  readonly resolvedTheme = signal<'dark' | 'light'>('dark');

  constructor() {
    effect(() => {
      const theme = this.currentTheme();
      const resolved = theme === 'system'
        ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        : theme;
      this.resolvedTheme.set(resolved);
      document.documentElement.setAttribute('data-theme', resolved);
    }, { allowSignalWrites: true });
  }

  initialize(): void {
    const saved = this.readStoredTheme();
    this.currentTheme.set(saved ?? this.defaultTheme);
  }

  setTheme(theme: AppTheme): void {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    this.currentTheme.set(theme);
  }

  private readStoredTheme(): AppTheme | null {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === 'dark' || stored === 'light' || stored === 'system') return stored;
      return null;
    } catch {
      return null;
    }
  }
}
