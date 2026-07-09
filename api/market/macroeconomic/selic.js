const fetch = require('node-fetch');

const BCB_BASE = process.env.BCB_API_BASE_URL || 'https://api.bcb.gov.br';

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
    const timeout = setTimeout(() => controller.abort(), 15000);

    const url = `${BCB_BASE}/dados/serie/bcdata.sgs.11/dados?formato=json`;
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeout);

    if (!response.ok) {
      return res.status(502).json({
        code: 'PROVIDER_ERROR',
        message: 'BCB SGS returned an error.',
        provider: 'BCB_SGS',
        correlationId,
        timestamp: new Date().toISOString(),
      });
    }

    const data = await response.json();

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=3600');
    res.setHeader('X-Correlation-ID', correlationId);
    res.json(data);
  } catch (err) {
    if (err.name === 'AbortError') {
      return res.status(504).json({
        code: 'PROVIDER_TIMEOUT',
        message: 'BCB SGS request timed out.',
        provider: 'BCB_SGS',
        correlationId,
        timestamp: new Date().toISOString(),
      });
    }
    console.error(JSON.stringify({
      timestamp: new Date().toISOString(),
      path: '/api/market/macroeconomic/selic',
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
