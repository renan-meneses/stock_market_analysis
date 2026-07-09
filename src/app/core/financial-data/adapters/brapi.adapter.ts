import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppConfigService } from '../../config/app-config.service';
import { AssetProvider } from '../contracts/asset-provider.interface';
import { BrazilianMarketAsset } from '../models/brazilian-market-asset.model';
import { BrapiQuoteResponse, mapBrapiResponse } from '../mappers/brapi.mapper';

@Injectable({ providedIn: 'root' })
export class BrapiAdapter implements AssetProvider {
  private readonly http = inject(HttpClient);
  private readonly config = inject(AppConfigService);

  fetch(request: { tickers: string[] }): Observable<BrazilianMarketAsset[]> {
    return this.getAssets(request.tickers);
  }

  getAssets(tickers: string[]): Observable<BrazilianMarketAsset[]> {
    const normalized = tickers.map(t => t.trim().toUpperCase()).filter(Boolean);
    const path = normalized.join(',');
    const url = `${this.config.getConfig().backendApiBaseUrl}/market/b3/quotes/${path}`;
    return this.http.get<BrapiQuoteResponse>(url).pipe(
      map(response => mapBrapiResponse(response))
    );
  }
}
