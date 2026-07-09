const express = require('express');
const router = express.Router();
const { providerFetch } = require('../services/provider-fetch');

const AWESOME_API_BASE = process.env.AWESOME_API_BASE_URL || 'https://economia.awesomeapi.com.br/json';
const BCB_BASE = process.env.BCB_API_BASE_URL || 'https://api.bcb.gov.br';
const BRAPI_BASE = 'https://brapi.dev/api/v2';

async function checkProvider(name, url, timeout = 5000) {
  const start = Date.now();
  try {
    const { response } = await providerFetch(url, { timeout });
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

router.get('/', async (req, res, next) => {
  try {
    const results = await Promise.allSettled([
      checkProvider('AWESOME_API', `${AWESOME_API_BASE}/last/USD-BRL`),
      checkProvider('BCB_SGS', `${BCB_BASE}/dados/serie/bcdata.sgs.11/dados?formato=json&quantidade=1`),
    ]);

    const providers = results
      .filter(r => r.status === 'fulfilled')
      .map(r => r.value);

    const token = process.env.BRAPI_TOKEN;
    if (token) {
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
    next(err);
  }
});

module.exports = router;