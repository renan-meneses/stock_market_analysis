# Brapi Integration

## Overview

Brapi provides Brazilian stock market (B3) and Real Estate Investment Fund (FII) data.

## Base URL

```
https://brapi.dev/api/v2
```

## Endpoint

```
GET /quote/{tickers}?token={BRAPI_TOKEN}
```

## Supported Assets

| Ticker | Type | Name |
|--------|------|------|
| PETR4 | STOCK | Petrobras |
| VALE3 | STOCK | Vale |
| ITUB4 | STOCK | Itaú Unibanco |
| BBDC4 | STOCK | Bradesco |
| BBAS3 | STOCK | Banco do Brasil |
| WEGE3 | STOCK | WEG |
| MGLU3 | STOCK | Magazine Luiza |
| HGLG11 | FII | CSHG Real Estate |
| KNRI11 | FII | Kinea Renda Imobiliária |
| MXRF11 | FII | Maxi Renda |

## Token Security (CRITICAL)

The Brapi token must NEVER be exposed to client-side code. The recommended architecture:

```
Angular Frontend --> Backend Proxy --> Brapi API (with token)
```

The token is appended by the backend proxy (Node.js/Express or Vercel serverless function) before forwarding the request to Brapi.

### Where NOT to store the token:
- Angular source files or environment files
- Browser local/session storage
- Public Docker images
- Kubernetes ConfigMaps
- Client-side Vercel environment variables
- GitHub repositories (use secrets)

### Where TO store the token:
- `.env` file (local development, excluded from Git)
- Kubernetes Secret (production)
- Vercel server-side environment variable (production)
- CI/CD secrets (GitHub Actions, etc.)
