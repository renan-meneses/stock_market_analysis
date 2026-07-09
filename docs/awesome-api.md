# AwesomeAPI Integration

## Overview

AwesomeAPI provides free currency exchange rates and Bitcoin prices quoted in Brazilian Reais (BRL).

## Base URL

```
https://economia.awesomeapi.com.br/json
```

## Endpoint

```
GET /last/USD-BRL,EUR-BRL,BTC-BRL
```

## Required Assets

| Pair | Description |
|------|-------------|
| USD/BRL | US Dollar to Brazilian Real |
| EUR/BRL | Euro to Brazilian Real |
| BTC/BRL | Bitcoin to Brazilian Real |

## Response Mapping

Raw AwesomeAPI fields are mapped to normalized ExchangeRate models:

| AwesomeAPI Field | Normalized Field |
|-----------------|-----------------|
| code | symbol |
| name | displayName |
| bid | bid |
| ask | ask |
| high | high |
| low | low |
| varBid | absoluteChange |
| pctChange | percentageChange |
| create_date | providerTimestamp |

## Configuration

No authentication is required for AwesomeAPI. The base URL can be configured through:
- Runtime config file: `assets/config/app-config.json`
- Environment variable: `AWESOME_API_BASE_URL`
