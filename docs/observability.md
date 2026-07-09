# Observability

## Frontend Monitoring

The dashboard tracks:
- API response times per provider
- Provider errors and failures
- Polling interval timing
- JavaScript runtime errors
- Route change performance
- Chart rendering errors
- Stale data duration
- User language preference
- Active theme (light/dark)

No sensitive information or credentials are sent to monitoring systems.

## Backend Logging

Structured JSON logs with:
- Timestamp
- Request path and method
- HTTP status code
- Provider name
- Response time (ms)
- Cache result (hit/miss)
- Correlation ID
- Error code (if applicable)

Never logged:
- Brapi token
- Authorization headers
- Full provider URLs containing tokens
- User-sensitive data

## Health Endpoints

| Endpoint | Description |
|----------|-------------|
| GET /health | Frontend/API health check |
| GET /ready | Readiness check |
| GET /api/market/providers/health | Provider-level health check |

## Metrics

- Provider availability rate
- Average response time per provider
- Cache hit ratio
- Error rate per endpoint
- Polling success rate
