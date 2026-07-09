export type ProviderStatus = 'AVAILABLE' | 'DELAYED' | 'RATE_LIMITED' | 'UNAVAILABLE' | 'UNKNOWN';

export interface ProviderHealth {
  provider: 'AWESOME_API' | 'BRAPI' | 'BCB_SGS';
  status: ProviderStatus;
  lastSuccessAt?: string;
  lastFailureAt?: string;
  responseTimeMs?: number;
  message?: string;
}
