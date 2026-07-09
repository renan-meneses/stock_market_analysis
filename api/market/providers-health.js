const fetch = require('node-fetch');

const AWESOME_API_BASE = process.env.AWESOME_API_BASE_URL || 'https://economia.awesomeapi.com.br/json';
const BCB_BASE = process.env.BCB_API_BASE_URL || 'https://api.bcb.gov.br';

async function checkProvider(name, url, timeoutMs = 5000) {
  const start = Date.now();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    return {
      provider: name,
      status: response.ok ? 'AVAILABLE' : 'UNAVAILABLE',
      responseTimeMs: Date.now() - start,
      lastCheckAt: new Date().toISOString(),
    };
  } catch (err) {
    return {
      provider: name,
      status: 'UNAVAILABLE',
      responseTimeMs: Date.now() - start,
      lastCheckAt: new Date().toISOString(),
      message: err.message,
    };
  }
}

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({
      code: 'METHOD_NOT_ALLOWED',
      message: 'Method not allowed.',
      timestamp: new Date().toISOString(),
    });
  }

  try {
    const results = await Promise.allSettled([
      checkProvider('AWESOME_API', `${AWESOME_API_BASE}/last/USD-BRL`),
      checkProvider('BCB_SGS', `${BCB_BASE}/dados/serie/bcdata.sgs.11/dados?formato=json&quantidade=1`),
    ]);

    const providers = results
      .filter(r => r.status === 'fulfilled')
      .map(r => r.value);

    if (process.env.BRAPI_TOKEN) {
      providers.push({
        provider: 'BRAPI',
        status: 'AVAILABLE',
        message: 'Token configured',
        lastCheckAt: new Date().toISOString(),
      });
    } else {
      providers.push({
        provider: 'BRAPI',
        status: 'UNAVAILABLE',
        message: 'Token not configured',
        lastCheckAt: new Date().toISOString(),
      });
    }

    res.json({ providers, timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({
      code: 'INTERNAL_ERROR',
      message: 'Health check failed.',
      timestamp: new Date().toISOString(),
    });
  }
};
