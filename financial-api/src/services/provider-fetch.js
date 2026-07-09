const fetch = require('node-fetch');

async function providerFetch(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeout || 10000);

  const startTime = Date.now();
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        ...(options.headers || {}),
      },
    });
    const elapsed = Date.now() - startTime;
    return { response, elapsed, ok: response.ok, status: response.status };
  } catch (err) {
    const elapsed = Date.now() - startTime;
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = { providerFetch };