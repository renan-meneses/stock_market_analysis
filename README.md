# Financial Dashboard

Angular SPA for Brazilian financial market data — currency rates, B3 stocks, FIIs, and macroeconomic indicators (Selic, IPCA).

## Data Providers

| Provider | Data | Auth | Frequency |
|----------|------|------|-----------|
| [AwesomeAPI](https://economia.awesomeapi.com.br) | USD/BRL, EUR/BRL, BTC/BRL | None | 3s |
| [Brapi](https://brapi.dev) | B3 stocks, FIIs | Token (server-side only) | 3s |
| [BCB SGS](https://www.bcb.gov.br) | Selic (code 11), IPCA (code 433) | None | 6-24h |

## Token Security

**The Brapi token must never reach the browser.** All Brapi requests are proxied through a backend server or serverless function that appends the token server-side.

```text
Angular SPA → Backend API / Serverless Proxy → Brapi API (with token)
```

### Obtaining a Brapi Token

1. Register at [brapi.dev](https://brapi.dev)
2. Generate an API key in your account dashboard
3. Set `BRAPI_TOKEN` in your environment (never in Angular source code)

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
ng serve

# Open http://localhost:4200
```

## Configuration

Runtime config is loaded from `public/assets/config/app-config.json`. No rebuild needed.

```json
{
  "backendApiBaseUrl": "/api",
  "awesomeApiBaseUrl": "https://economia.awesomeapi.com.br/json",
  "bcbApiBaseUrl": "https://api.bcb.gov.br",
  "marketRefreshIntervalMs": 3000,
  "macroeconomicRefreshIntervalMs": 21600000,
  "requestTimeoutMs": 10000,
  "enableMockApi": false
}
```

### .env.example

```dotenv
BRAPI_TOKEN=replace-with-your-private-token
BACKEND_API_BASE_URL=http://localhost:8000/api
AWESOME_API_BASE_URL=https://economia.awesomeapi.com.br/json
BCB_API_BASE_URL=https://api.bcb.gov.br
MARKET_REFRESH_INTERVAL_MS=3000
MACROECONOMIC_REFRESH_INTERVAL_MS=21600000
REQUEST_TIMEOUT_MS=10000
```

## Docker

```bash
cp .env.example .env
# Edit .env and set BRAPI_TOKEN

docker compose up -d
# Frontend at http://localhost:8080
# API at http://localhost:8000

docker compose down
```

## Kubernetes (Kustomize)

```bash
# Create the Brapi token secret
kubectl create secret generic financial-api-secrets \
  --namespace financial-dashboard \
  --from-literal=BRAPI_TOKEN=your-token

# Deploy
kubectl apply -k deploy/kubernetes/overlays/development
kubectl apply -k deploy/kubernetes/overlays/production
```

### Overlays

| Overlay | Replicas | Use |
|---------|----------|-----|
| `development` | 1 | Dev/test |
| `staging` | 2 | Pre-prod |
| `production` | 3 | Production |

## Helm

```bash
helm install financial-dashboard deploy/helm/financial-dashboard \
  --values deploy/helm/financial-dashboard/values-production.yaml
```

## Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Set environment variables in Vercel dashboard:
# - BRAPI_TOKEN (server-side, private)

# Deploy
vercel --prod
```

Serverless functions under `api/` proxy Brapi requests securely. See `vercel.json` for SPA rewrites and caching configuration.

## Vercel Environment Variables

| Variable | Visibility | Required |
|----------|-----------|----------|
| `BRAPI_TOKEN` | Server-side only | Yes |
| `MARKET_REFRESH_INTERVAL_MS` | Build-time | No |
| `MACROECONOMIC_REFRESH_INTERVAL_MS` | Build-time | No |

Never prefix `BRAPI_TOKEN` with `NEXT_PUBLIC_` or any client-exposed convention.

## Scripts

| Script | Purpose |
|--------|---------|
| `npm start` | Dev server |
| `npm run build:production` | Production build |
| `npm test` | Unit tests |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript validation |

## Health Checks

| Endpoint | Description |
|----------|-------------|
| `GET /health` | Server health |
| `GET /ready` | Readiness check |
| `GET /api/market/providers/health` | Provider status |

## Architecture

```
src/
├── app/
│   ├── core/
│   │   ├── config/              # Runtime configuration
│   │   ├── financial-data/
│   │   │   ├── contracts/       # Provider interfaces
│   │   │   ├── adapters/        # Provider implementations
│   │   │   ├── mappers/         # Response normalization
│   │   │   ├── models/          # Domain models
│   │   │   ├── repositories/    # Caching & deduplication
│   │   │   └── services/        # Dashboard aggregation
│   │   ├── interceptors/        # Correlation ID
│   │   └── utils/               # Formatters, sanitizers
│   └── features/dashboard/
│       ├── components/          # Currency, Asset, Macro, Health cards
│       └── pages/               # Dashboard page
├── i18n/                        # en, pt, es translations
```

## Documentation

See `docs/` for detailed guides:

- [Architecture](docs/architecture.md)
- [AwesomeAPI](docs/awesome-api.md)
- [Brapi](docs/brapi.md)
- [BCB SGS](docs/bcb-sgs.md)
- [API Proxy](docs/api-proxy.md)
- [Caching Strategy](docs/caching-strategy.md)
- [Security](docs/security.md)
- [Docker](docs/docker-deployment.md)
- [Kubernetes](docs/kubernetes-deployment.md)
- [Helm](docs/helm-deployment.md)
- [Vercel](docs/vercel-deployment.md)
- [CI/CD](docs/ci-cd.md)
- [Observability](docs/observability.md)
- [Troubleshooting](docs/troubleshooting.md)

## Troubleshooting

**CORS errors**: Run the backend proxy (`docker compose up`) and ensure `backendApiBaseUrl` points to it.

**Provider unavailable**: Check `GET /api/market/providers/health`. Each provider has an independent loading/error state — the dashboard works with partial data.

**Brapi auth failure**: Verify `BRAPI_TOKEN` is set in the environment, not in Angular code, and is still valid at brapi.dev.

## License

MIT
