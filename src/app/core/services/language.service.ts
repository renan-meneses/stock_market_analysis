import { Injectable, inject } from '@angular/core';
import { SupportedLanguage, LANGUAGE_STORAGE_KEY } from '../models/data-status.model';
import { TranslationService } from './translation.service';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly translationService = inject(TranslationService);
  private readonly defaultLanguage: SupportedLanguage = 'en';

  initialize(): void {
    const saved = this.readStoredLanguage();
    const lang = saved ?? this.defaultLanguage;
    this.setLanguage(lang, false);
  }

  setLanguage(language: SupportedLanguage, persist = true): void {
    if (persist) {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    }
    this.translationService.setActiveLang(language);
  }

  private readStoredLanguage(): SupportedLanguage | null {
    try {
      const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (stored === 'en' || stored === 'pt' || stored === 'es') return stored;
      return null;
    } catch {
      return null;
    }
  }
}
