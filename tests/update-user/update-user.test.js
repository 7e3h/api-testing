const { describe, it } = require('node:test');
const assert = require('node:assert');
const { request } = require('../helpers/api-client');

describe('PUT & PATCH /users/:id - Update User Test Suite', () => {

  it('TC-API-PUT-001: Should update user details via PUT with 200 OK and updated fields', async () => {
    const userId = 1;
    const payload = {
      firstName: 'Emily-Updated',
      lastName: 'Johnson-Lead'
    };

    const response = await request(`/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    // 1. Status Code Validation
    assert.strictEqual(response.status, 200, 'Expected HTTP 200 OK');

    // 2. Header Validation
    const contentType = response.headers.get('content-type');
    assert.ok(contentType && contentType.includes('application/json'), 'Content-Type must be application/json');

    // 3. Response Body Validation
    const body = await response.json();
    assert.strictEqual(body.firstName, payload.firstName, 'Updated firstName must match payload');
    assert.strictEqual(body.lastName, payload.lastName, 'Updated lastName must match payload');
  });

  it('TC-API-PUT-002: Should partially update user single attribute with 200 OK', async () => {
    const userId = 1;
    const payload = {
      age: 32
    };

    const response = await request(`/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    assert.strictEqual(response.status, 200, 'Expected HTTP 200 OK');
    const body = await response.json();
    assert.strictEqual(body.age, payload.age, 'Updated age should match payload');
  });

  it('TC-API-PUT-003: Should handle update with empty payload (boundary / invalid input)', async () => {
    const userId = 1;
    const response = await request(`/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });

    assert.strictEqual(response.status, 200);
    const body = await response.json();
    assert.strictEqual(body.id, userId);
  });

});
