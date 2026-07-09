const express = require('express');
const router = express.Router();
const { providerFetch } = require('../services/provider-fetch');

const BRAPI_BASE = 'https://brapi.dev/api/v2';

const TICKER_PATTERN = /^[A-Z0-9]{4,6}$/;

function sanitizeTickers(raw) {
  if (!raw) return [];
  return raw
    .split(/[,;\s]+/)
    .map(t => t.trim().toUpperCase())
    .filter(t => t.length > 0 && TICKER_PATTERN.test(t.replace(/\d+$/, '')));
}

router.get('/:tickers', async (req, res, next) => {
  try {
    const token = process.env.BRAPI_TOKEN;
    if (!token) {
      return res.status(500).json({
        code: 'BRAPI_TOKEN_NOT_CONFIGURED',
        message: 'The Brapi integration is not configured.',
        correlationId: req.correlationId,
        timestamp: new Date().toISOString(),
      });
    }

    const tickers = sanitizeTickers(req.params.tickers);
    if (!tickers.length) {
      return res.status(400).json({
        code: 'INVALID_TICKERS',
        message: 'At least one valid ticker is required.',
        correlationId: req.correlationId,
        timestamp: new Date().toISOString(),
      });
    }

    const url = `${BRAPI_BASE}/quote/${tickers.join(',')}?token=${encodeURIComponent(token)}`;
    const { response, elapsed } = await providerFetch(url);

    if (!response.ok) {
      return res.status(502).json({
        code: 'BRAPI_PROVIDER_ERROR',
        message: 'The market data provider returned an error.',
        provider: 'BRAPI',
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
        message: 'Brapi request timed out.',
        provider: 'BRAPI',
        correlationId: req.correlationId,
        timestamp: new Date().toISOString(),
      });
    }
    next(err);
  }
});

module.exports = router;