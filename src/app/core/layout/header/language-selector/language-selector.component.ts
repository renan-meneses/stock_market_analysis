import { Component, inject } from '@angular/core';
import { LanguageService } from '../../../services/language.service';
import { TranslationService } from '../../../services/translation.service';
import { SupportedLanguage } from '../../../models/data-status.model';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  template: `
    <select
      class="lang-select"
      [value]="translationService.currentLang()"
      (change)="onChange($event)"
      [attr.aria-label]="'Select language'"
    >
      @for (option of options; track option.code) {
        <option [value]="option.code">{{ option.label }}</option>
      }
    </select>
  `,
  styles: [`
    .lang-select {
      background: transparent;
      border: 1px solid var(--header-border, #e4e7ec);
      border-radius: 8px;
      padding: 0.35rem 0.5rem;
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--header-text, #344054);
      cursor: pointer;
      min-height: 44px;
      min-width: 44px;
      transition: background 0.2s;
      outline: none;
    }
    .lang-select:hover { background: var(--header-hover, #f2f4f7); }
  `]
})
export class LanguageSelectorComponent {
  protected readonly languageService = inject(LanguageService);
  protected readonly translationService = inject(TranslationService);

  protected readonly options: { code: SupportedLanguage; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'pt', label: 'Português' },
    { code: 'es', label: 'Español' },
  ];

  onChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.languageService.setLanguage(select.value as SupportedLanguage);
  }
}
