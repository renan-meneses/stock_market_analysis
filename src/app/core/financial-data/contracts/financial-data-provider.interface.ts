import { Observable } from 'rxjs';

export interface FinancialDataProvider<TRequest, TResponse> {
  fetch(request: TRequest): Observable<TResponse>;
}
