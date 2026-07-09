# Financial Providers

The dashboard integrates three external financial data providers:

## Provider Overview

| Provider | Data Type | Update Frequency | Auth Required |
|----------|-----------|-----------------|---------------|
| AwesomeAPI | Currency rates | 3 seconds | No |
| Brapi | B3 stocks/FIIs | 3 seconds | Yes (token) |
| BCB SGS | Macroeconomic indicators | 6-24 hours | No |

## Provider Health

Each provider has an independent health status shown in the dashboard:

- AVAILABLE: Provider is responding
- DELAYED: Responses are slower than expected
- RATE_LIMITED: Provider has rate-limited the application
- UNAVAILABLE: Provider is not responding
- UNKNOWN: Status has not been checked

## Error Handling

Each provider has independent loading and error states. If one provider fails, the dashboard continues displaying data from the others. Exponential backoff with jitter is used for retries on transient errors.
