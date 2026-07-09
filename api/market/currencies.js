const fetch = require('node-fetch');

const AWESOME_API_BASE = process.env.AWESOME_API_BASE_URL || 'https://economia.awesomeapi.com.br/json';

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
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const url = `${AWESOME_API_BASE}/last/USD-BRL,EUR-BRL,BTC-BRL`;
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeout);

    if (!response.ok) {
      return res.status(502).json({
        code: 'PROVIDER_ERROR',
        message: 'AwesomeAPI returned an error.',
        provider: 'AWESOME_API',
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
        message: 'AwesomeAPI request timed out.',
        provider: 'AWESOME_API',
        correlationId,
        timestamp: new Date().toISOString(),
      });
    }
    console.error(JSON.stringify({
      timestamp: new Date().toISOString(),
      path: '/api/market/currencies',
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
