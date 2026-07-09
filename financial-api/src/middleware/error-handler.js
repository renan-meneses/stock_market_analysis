class AppError extends Error {
  constructor(statusCode, code, message, provider) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.provider = provider;
  }
}

function errorHandler(err, req, res, next) {
  const correlationId = req.correlationId || 'unknown';
  console.error(JSON.stringify({
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method,
    correlationId,
    error: err.message,
    code: err.code || 'UNKNOWN',
    provider: err.provider,
    statusCode: err.statusCode || 500,
  }));
  res.status(err.statusCode || 500).json({
    code: err.code || 'INTERNAL_ERROR',
    message: err.message || 'An internal error occurred.',
    provider: err.provider,
    correlationId,
    timestamp: new Date().toISOString(),
  });
}

module.exports = { AppError, errorHandler };