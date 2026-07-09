# Docker Deployment

## Prerequisites

- Docker Engine 24+
- Docker Compose v2+

## Building the Image

```bash
# Build the frontend image
docker build -t stock-market-dashboard/frontend .

# Build the backend image
docker build -t stock-market-dashboard/financial-api ./financial-api

# Build both with Docker Compose
docker compose build
```

## Running with Docker Compose

```bash
# Create .env file from example
cp .env.example .env
# Edit .env and set BRAPI_TOKEN

# Start all services
docker compose up -d

# View logs
docker compose logs -f

# Stop all services
docker compose down
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| BACKEND_API_BASE_URL | http://financial-api:8000/api | Backend API URL |
| AWESOME_API_BASE_URL | https://economia.awesomeapi.com.br/json | AwesomeAPI base URL |
| BCB_API_BASE_URL | https://api.bcb.gov.br | BCB API base URL |
| MARKET_REFRESH_INTERVAL_MS | 3000 | Market data refresh interval |
| MACROECONOMIC_REFRESH_INTERVAL_MS | 21600000 | Macro data refresh interval |
| BRAPI_TOKEN | (required) | Brapi API token |

## Health Checks

```bash
# Check frontend health
curl http://localhost:8080/health

# Check API health
curl http://localhost:8000/health

# Check provider health
curl http://localhost:8000/api/market/providers/health
```
