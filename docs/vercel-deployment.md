# Vercel Deployment

## Overview

The application can be deployed to Vercel with:
- Angular frontend served from Vercel Edge Network
- Serverless functions for API proxy

## Setting Up

1. Install Vercel CLI: `npm i -g vercel`
2. Link project: `vercel link`
3. Set environment variables in Vercel dashboard:
   - `BRAPI_TOKEN` (server-side, private)
   - `MARKET_REFRESH_INTERVAL_MS` (optional)
   - `MACROECONOMIC_REFRESH_INTERVAL_MS` (optional)

## Environment Variables

### Private (Server-side)
- `BRAPI_TOKEN`: Your Brapi API token

### Optional
- `MARKET_REFRESH_INTERVAL_MS`: Default 3000
- `MACROECONOMIC_REFRESH_INTERVAL_MS`: Default 21600000

**Important**: Never prefix BRAPI_TOKEN with `NEXT_PUBLIC_` or `VITE_` or any convention that exposes it to client code.

## Deploying

```bash
# Production deployment
vercel --prod

# Preview deployment
vercel
```

## Deploying via GitHub Actions

Required repository secrets:
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## Custom Domain

1. Go to Vercel Dashboard > Project > Domains
2. Add your domain
3. Configure DNS records as instructed by Vercel
4. TLS certificate is automatically provisioned

## Environments

- **Production**: Deployed from `main` branch
- **Preview**: Deployed from pull requests
- **Development**: Local `ng serve`
