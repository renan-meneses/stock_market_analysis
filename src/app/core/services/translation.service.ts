import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SupportedLanguage } from '../models/data-status.model';

type Translations = Record<string, string | Record<string, unknown>>;

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private readonly http = inject(HttpClient);
  private cache = new Map<SupportedLanguage, Translations>();
  readonly currentLang = signal<SupportedLanguage>('en');
  readonly translations = signal<Translations>({});
  private loaded = false;

  load(lang: SupportedLanguage): Promise<void> {
    if (this.cache.has(lang)) {
      this.translations.set(this.cache.get(lang)!);
      this.currentLang.set(lang);
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      this.http.get<Translations>(`i18n/${lang}.json`).subscribe({
        next: (data) => {
          this.cache.set(lang, data);
          this.translations.set(data);
          this.currentLang.set(lang);
          resolve();
        },
        error: () => {
          resolve();
        },
      });
    });
  }

  setActiveLang(lang: SupportedLanguage): void {
    this.load(lang);
  }

  translate(key: string, params?: Record<string, string>): string {
    const parts = key.split('.');
    let value: unknown = this.translations();
    for (const part of parts) {
      if (value && typeof value === 'object') {
        value = (value as Record<string, unknown>)[part];
      } else {
        return key;
      }
    }
    if (typeof value !== 'string') return key;
    if (params) {
      return Object.entries(params).reduce(
        (acc, [k, v]) => acc.replace(`{{${k}}}`, v),
        value
      );
    }
    return value;
  }
}
