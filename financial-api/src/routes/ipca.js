const express = require('express');
const router = express.Router();
const { providerFetch } = require('../services/provider-fetch');

const BCB_BASE = process.env.BCB_API_BASE_URL || 'https://api.bcb.gov.br';

router.get('/', async (req, res, next) => {
  try {
    const url = `${BCB_BASE}/dados/serie/bcdata.sgs.433/dados?formato=json`;
    const { response, elapsed } = await providerFetch(url, { timeout: 15000 });

    if (!response.ok) {
      return res.status(502).json({
        code: 'PROVIDER_ERROR',
        message: 'BCB SGS returned an error.',
        provider: 'BCB_SGS',
        correlationId: req.correlationId,
        timestamp: new Date().toISOString(),
      });
    }

    const data = await response.json();

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=3600');
    res.setHeader('X-Response-Time-Ms', elapsed);
    res.json(data);
  } catch (err) {
    if (err.name === 'AbortError') {
      return res.status(504).json({
        code: 'PROVIDER_TIMEOUT',
        message: 'BCB SGS request timed out.',
        provider: 'BCB_SGS',
        correlationId: req.correlationId,
        timestamp: new Date().toISOString(),
      });
    }
    next(err);
  }
});

module.exports = router;