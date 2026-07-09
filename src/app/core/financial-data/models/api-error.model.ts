export interface ApiError {
  code: string;
  message: string;
  provider?: string;
  correlationId?: string;
  timestamp: string;
}
