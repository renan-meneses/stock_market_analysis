const express = require('express');
const router = express.Router();
const { providerFetch } = require('../services/provider-fetch');

const AWESOME_API_BASE = process.env.AWESOME_API_BASE_URL || 'https://economia.awesomeapi.com.br/json';

router.get('/', async (req, res, next) => {
  try {
    const url = `${AWESOME_API_BASE}/last/USD-BRL,EUR-BRL,BTC-BRL`;
    const { response, elapsed } = await providerFetch(url);

    if (!response.ok) {
      return res.status(502).json({
        code: 'PROVIDER_ERROR',
        message: 'AwesomeAPI returned an error.',
        provider: 'AWESOME_API',
        correlationId: req.correlationId,
        timestamp: new Date().toISOString(),
      });
    }

    const data = await response.json();

    res.setHeader('Cache-Control', 's-maxage=3, stale-while-revalidate=10');
    res.setHeader('X-Response-Time-Ms', elapsed);
    res.json(data);
  } catch (err) {
    if (err.name === 'AbortError') {
      return res.status(504).json({
        code: 'PROVIDER_TIMEOUT',
        message: 'AwesomeAPI request timed out.',
        provider: 'AWESOME_API',
        correlationId: req.correlationId,
        timestamp: new Date().toISOString(),
      });
    }
    next(err);
  }
});

module.exports = router;