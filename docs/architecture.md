# Architecture

## Overview

The Financial Dashboard is a single-page application (SPA) built with Angular that displays Brazilian financial market data from three providers:

- **AwesomeAPI**: Currency exchange rates (USD/BRL, EUR/BRL, BTC/BRL)
- **Brapi**: Brazilian stocks (B3) and Real Estate Investment Funds (FIIs)
- **Banco Central do Brasil SGS**: Macroeconomic indicators (Selic, IPCA)

## Architecture Diagram

```
Browser (Angular SPA)
  |
  +--> Nginx (static assets, SPA routing)
  |      |
  |      +--> /api/* --> Backend API / Serverless Proxy
  |                         |
  |                         +--> AwesomeAPI (currency rates)
  |                         +--> Brapi (B3 stocks/FIIs)
  |                         +--> BCB SGS (macro indicators)
  |
  +--> Direct to providers (AwesomeAPI, BCB SGS)
       (when no proxy is configured)
```

## Layer Architecture

### Presentation Layer
- Standalone Angular components
- Dashboard page with independent loading/error states per provider
- Chart.js for historical data visualization
- Responsive grid layout

### Data Access Layer
- **Contracts**: TypeScript interfaces defining provider contracts
- **Adapters**: Provider-specific implementations
- **Mappers**: Transform raw API responses to domain models
- **Repository**: Caching, deduplication, retry logic
- **Services**: Dashboard aggregation, polling

### Configuration
- Runtime configuration loaded from `assets/config/app-config.json`
- Environment variables override config at deployment time
- No rebuild required for configuration changes

## Security
- Brapi token never reaches the browser
- All token-protected requests go through a backend proxy
- Correlation IDs for request tracing
- Security headers configured in Nginx and Vercel
