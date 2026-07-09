const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { v4: uuidv4 } = require('uuid');

const currenciesRoute = require('./routes/currencies');
const b3QuotesRoute = require('./routes/b3-quotes');
const selicRoute = require('./routes/selic');
const ipcaRoute = require('./routes/ipca');
const healthRoute = require('./routes/health');
const providersHealthRoute = require('./routes/providers-health');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET'],
  allowedHeaders: ['Content-Type', 'X-Correlation-ID'],
}));
app.use(morgan(':method :url :status :response-time ms - :req[x-correlation-id]'));
app.use(express.json());

app.use((req, res, next) => {
  req.correlationId = req.headers['x-correlation-id'] || uuidv4();
  res.setHeader('X-Correlation-ID', req.correlationId);
  next();
});

app.use('/health', healthRoute);
app.use('/ready', healthRoute);
app.use('/api/market/currencies', currenciesRoute);
app.use('/api/market/b3/quotes', b3QuotesRoute);
app.use('/api/market/macroeconomic/selic', selicRoute);
app.use('/api/market/macroeconomic/ipca', ipcaRoute);
app.use('/api/market/providers/health', providersHealthRoute);

app.use((err, req, res, next) => {
  console.error(JSON.stringify({
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method,
    correlationId: req.correlationId,
    error: err.message,
    statusCode: err.statusCode || 500,
  }));
  res.status(err.statusCode || 500).json({
    code: 'INTERNAL_ERROR',
    message: 'An internal error occurred.',
    correlationId: req.correlationId,
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`Financial API listening on port ${PORT}`);
  console.log(`Redis URL: ${process.env.REDIS_URL || 'not configured'}`);
});