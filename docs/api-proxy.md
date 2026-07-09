# API Proxy

## Overview

The API proxy protects the Brapi token and normalizes responses from financial data providers.

## Proxy Routes

| Route | Provider | Description |
|-------|----------|-------------|
| GET /api/market/currencies | AwesomeAPI | Currency exchange rates |
| GET /api/market/b3/quotes/:tickers | Brapi | B3 stocks and FIIs |
| GET /api/market/macroeconomic/selic | BCB SGS | Selic rate |
| GET /api/market/macroeconomic/ipca | BCB SGS | IPCA inflation |
| GET /api/market/providers/health | All | Provider health check |

## Proxy Features

- Token injection (Brapi token appended server-side)
- Request timeout with AbortController
- Response caching headers
- Correlation ID propagation
- Structured logging
- Standard error contracts
- Ticker sanitization and validation

## Implementations

1. **Node.js/Express** (local development, Docker)
2. **Vercel Serverless Functions** (Vercel deployment)
3. **Kubernetes-hosted API** (Kubernetes deployment)

## Error Contract

```json
{
  "code": "ERROR_CODE",
  "message": "Human-readable error description",
  "provider": "PROVIDER_NAME",
  "correlationId": "uuid",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```
