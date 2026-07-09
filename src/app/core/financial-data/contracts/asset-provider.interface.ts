import { FinancialDataProvider } from './financial-data-provider.interface';
import { BrazilianMarketAsset } from '../models/brazilian-market-asset.model';

export interface AssetProviderRequest {
  tickers: string[];
}

export interface AssetProvider extends FinancialDataProvider<AssetProviderRequest, BrazilianMarketAsset[]> {
  getAssets(tickers: string[]): Observable<BrazilianMarketAsset[]>;
}
import { Observable } from 'rxjs';
