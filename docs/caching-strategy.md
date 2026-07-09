# Caching Strategy

## Cache Policies

| Data Type | Cache Duration | Strategy |
|-----------|---------------|----------|
| Exchange rates | 3 seconds | Short-lived, frequent refresh |
| Asset quotes | 3 seconds | Short-lived, frequent refresh |
| Asset history | 5 minutes | On-demand, cached |
| Macro indicators | 6 hours | Infrequent refresh |
| Asset logos | 24 hours | Long-lived |

## Frontend Caching

- `shareReplay(1)` for request deduplication
- Time-based cache invalidation with configurable intervals
- Stale-while-revalidate: show cached data while fetching fresh data
- Cache is invalidated per provider independently

## Backend Caching

- HTTP `Cache-Control` headers:
  - Currency/B3 quotes: `s-maxage=3, stale-while-revalidate=10`
  - Macroeconomic data: `s-maxage=3600, stale-while-revalidate=3600`
  - Static assets: `public, immutable, max-age=31536000`
  - index.html: `no-cache, no-store, must-revalidate`

## Retry Strategy

- Exponential backoff: `min(1000 * 2^retryCount, 10000)` ms
- Maximum 3 retries for transient errors
- No retry for 4xx client errors (400, 401, 403, 404)
- Jitter applied to prevent retry storms
