#!/bin/sh

set -e

RUNTIME_CONFIG_FILE=/usr/share/nginx/html/assets/config/app-config.json

if [ ! -f "$RUNTIME_CONFIG_FILE" ]; then
  mkdir -p "$(dirname "$RUNTIME_CONFIG_FILE")"
fi

cat > "$RUNTIME_CONFIG_FILE" << EOF
{
  "backendApiBaseUrl": "${BACKEND_API_BASE_URL:-/api}",
  "awesomeApiBaseUrl": "${AWESOME_API_BASE_URL:-https://economia.awesomeapi.com.br/json}",
  "bcbApiBaseUrl": "${BCB_API_BASE_URL:-https://api.bcb.gov.br}",
  "marketRefreshIntervalMs": ${MARKET_REFRESH_INTERVAL_MS:-3000},
  "macroeconomicRefreshIntervalMs": ${MACROECONOMIC_REFRESH_INTERVAL_MS:-21600000},
  "requestTimeoutMs": ${REQUEST_TIMEOUT_MS:-10000},
  "enableMockApi": ${ENABLE_MOCK_API:-false}
}
EOF

echo "Generated runtime config at $RUNTIME_CONFIG_FILE"