# Banco Central do Brasil SGS Integration

## Overview

The BCB SGS (Sistema Gerenciador de Séries Temporais) provides Brazilian macroeconomic time series data.

## Base URL

```
https://api.bcb.gov.br
```

## Endpoint Format

```
GET /dados/serie/bcdata.sgs.{seriesCode}/dados?formato=json
```

## Required Series

| Indicator | SGS Code | Description |
|-----------|---------|-------------|
| Selic | 11 | Base interest rate (annualized, % p.a.) |
| IPCA | 433 | Broad consumer price index (monthly, %) |

## Refresh Strategy

Macroeconomic indicators change less frequently than asset prices:
- Initial load: On application startup
- Refresh: Every 6-24 hours (configurable)
- Historical chart: Loaded on demand and cached

## Response Mapping

| BCB Field | Normalized Field |
|-----------|-----------------|
| data (DD/MM/YYYY) | date (ISO format) |
| valor | value |
