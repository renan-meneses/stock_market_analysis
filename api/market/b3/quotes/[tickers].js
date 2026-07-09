const fetch = require('node-fetch');

const BRAPI_BASE = 'https://brapi.dev/api/v2';
const TICKER_PATTERN = /^[A-Z0-9]{4,6}$/;

function sanitizeTickers(raw) {
  if (!raw) return [];
  return raw
    .split(/[,;\s]+/)
    .map(t => t.trim().toUpperCase())
    .filter(t => t.length > 0 && TICKER_PATTERN.test(t.replace(/\d+$/, '')));
}

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({
      code: 'METHOD_NOT_ALLOWED',
      message: 'Method not allowed.',
      timestamp: new Date().toISOString(),
    });
  }

  const correlationId = req.headers['x-correlation-id'] || `vercel-${Date.now()}`;

  try {
    const token = process.env.BRAPI_TOKEN;
    if (!token) {
      return res.status(500).json({
        code: 'BRAPI_TOKEN_NOT_CONFIGURED',
        message: 'The Brapi integration is not configured.',
        correlationId,
        timestamp: new Date().toISOString(),
      });
    }

    const rawTickers = req.query.tickers;
    const tickerValue = Array.isArray(rawTickers) ? rawTickers[0] : rawTickers;
    const tickers = sanitizeTickers(tickerValue);

    if (!tickers.length) {
      return res.status(400).json({
        code: 'INVALID_TICKERS',
        message: 'At least one valid ticker is required.',
        correlationId,
        timestamp: new Date().toISOString(),
      });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const url = `${BRAPI_BASE}/quote/${tickers.join(',')}?token=${encodeURIComponent(token)}`;
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeout);

    if (!response.ok) {
      return res.status(502).json({
        code: 'BRAPI_PROVIDER_ERROR',
        message: 'The market data provider returned an error.',
        provider: 'BRAPI',
        correlationId,
        timestamp: new Date().toISOString(),
      });
    }

    const data = await response.json();

    res.setHeader('Cache-Control', 's-maxage=3, stale-while-revalidate=10');
    res.setHeader('X-Correlation-ID', correlationId);
    res.json(data);
  } catch (err) {
    if (err.name === 'AbortError') {
      return res.status(504).json({
        code: 'PROVIDER_TIMEOUT',
        message: 'Brapi request timed out.',
        provider: 'BRAPI',
        correlationId,
        timestamp: new Date().toISOString(),
      });
    }
    console.error(JSON.stringify({
      timestamp: new Date().toISOString(),
      path: '/api/market/b3/quotes',
      correlationId,
      error: err.message,
    }));
    res.status(500).json({
      code: 'INTERNAL_ERROR',
      message: 'An internal error occurred.',
      correlationId,
      timestamp: new Date().toISOString(),
    });
  }
};
