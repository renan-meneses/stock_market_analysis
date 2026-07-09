const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'financial-api',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

module.exports = router;