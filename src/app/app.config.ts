import { ApplicationConfig, provideZoneChangeDetection, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { AppConfigService } from './core/config/app-config.service';
import { ThemeService } from './core/services/theme.service';
import { LanguageService } from './core/services/language.service';
import { correlationIdInterceptor } from './core/interceptors/correlation-id.interceptor';
import { lastValueFrom } from 'rxjs';

function initializeApp(config: AppConfigService, theme: ThemeService, language: LanguageService) {
  return async () => {
    await lastValueFrom(config.load());
    theme.initialize();
    language.initialize();
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([correlationIdInterceptor])),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppConfigService, ThemeService, LanguageService],
      multi: true,
    },
  ],
};