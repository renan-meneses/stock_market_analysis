function timeoutMiddleware(ms = 10000) {
  return (req, res, next) => {
    const timer = setTimeout(() => {
      res.status(504).json({
        code: 'GATEWAY_TIMEOUT',
        message: 'The request timed out.',
        correlationId: req.correlationId,
        timestamp: new Date().toISOString(),
      });
    }, ms);
    res.on('finish', () => clearTimeout(timer));
    next();
  };
}

module.exports = { timeoutMiddleware };