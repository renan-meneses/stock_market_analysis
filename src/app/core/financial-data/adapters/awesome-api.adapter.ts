import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppConfigService } from '../../config/app-config.service';
import { CurrencyProvider } from '../contracts/currency-provider.interface';
import { ExchangeRate } from '../models/exchange-rate.model';
import { AwesomeApiResponse, mapAwesomeApiResponse } from '../mappers/awesome-api.mapper';

@Injectable({ providedIn: 'root' })
export class AwesomeApiAdapter implements CurrencyProvider {
  private readonly http = inject(HttpClient);
  private readonly config = inject(AppConfigService);

  fetch(): Observable<ExchangeRate[]> {
    return this.getLatestRates();
  }

  getLatestRates(): Observable<ExchangeRate[]> {
    const url = `${this.config.getConfig().backendApiBaseUrl}/market/currencies`;
    return this.http.get<AwesomeApiResponse>(url).pipe(
      map(response => mapAwesomeApiResponse(response))
    );
  }
}
