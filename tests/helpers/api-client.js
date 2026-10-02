const BASE_URL = process.env.API_BASE_URL || 'https://dummyjson.com';

/**
 * Standard HTTP Request Helper for QA API Test Automation
 * Targets public training API: DummyJSON (https://dummyjson.com)
 */
async function request(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;

  return await fetch(url, {
    ...options,
    headers: {
      'User-Agent': 'QA-Test-Automation/1.0',
      ...options.headers,
    }
  });
}

module.exports = { request, BASE_URL };
