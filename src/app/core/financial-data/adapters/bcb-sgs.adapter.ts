import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppConfigService } from '../../config/app-config.service';
import { MacroeconomicProvider } from '../contracts/macroeconomic-provider.interface';
import { MacroeconomicIndicator, MacroeconomicIndicatorType } from '../models/macroeconomic-indicator.model';
import { BcbSgsResponseItem, mapBcbSgsResponse } from '../mappers/bcb-sgs.mapper';

@Injectable({ providedIn: 'root' })
export class BcbSgsAdapter implements MacroeconomicProvider {
  private readonly http = inject(HttpClient);
  private readonly config = inject(AppConfigService);

  fetch(request: { type: MacroeconomicIndicatorType; seriesCode: number }): Observable<MacroeconomicIndicator> {
    return this.getSeries(request.type, request.seriesCode);
  }

  getSeries(type: MacroeconomicIndicatorType, seriesCode: number): Observable<MacroeconomicIndicator> {
    const endpoint = seriesCode === 11 ? 'selic' : 'ipca';
    const url = `${this.config.getConfig().backendApiBaseUrl}/market/macroeconomic/${endpoint}`;
    return this.http.get<BcbSgsResponseItem[]>(url).pipe(
      map(items => mapBcbSgsResponse(type, seriesCode, items))
    );
  }
}
