const { describe, it } = require('node:test');
const assert = require('node:assert');
const { request } = require('../helpers/api-client');

describe('POST /users/add - Create User Test Suite', () => {

  it('TC-API-POST-001: Should create a user with 201 Created and return generated id', async () => {
    const payload = {
      firstName: 'Sarah',
      lastName: 'Connor',
      age: 29
    };

    const response = await request('/users/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    // 1. Status Code
    assert.strictEqual(response.status, 201, 'Expected HTTP 201 Created');

    // 2. Headers
    const contentType = response.headers.get('content-type');
    assert.ok(contentType && contentType.includes('application/json'), 'Content-Type must be application/json');

    // 3. Response Body & Required Fields
    const body = await response.json();
    assert.strictEqual(body.firstName, payload.firstName, 'firstName must match sent payload');
    assert.strictEqual(body.lastName, payload.lastName, 'lastName must match sent payload');
    assert.strictEqual(body.age, payload.age, 'age must match sent payload');
    
    // Required generated attributes
    assert.ok(typeof body.id === 'number', 'Response must generate a numeric "id"');
  });

  it('TC-API-POST-002: Should handle user creation with special characters and symbols in name', async () => {
    const payload = {
      firstName: "Jean-Luc & Co.",
      lastName: "O'Connor #1",
      age: 35
    };

    const response = await request('/users/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    assert.strictEqual(response.status, 201, 'Expected HTTP 201 Created');
    const body = await response.json();
    assert.strictEqual(body.firstName, payload.firstName);
    assert.strictEqual(body.lastName, payload.lastName);
  });

  it('TC-API-POST-003: Should verify response includes required Content-Type header', async () => {
    const payload = { firstName: 'Test', lastName: 'User', age: 25 };
    const response = await request('/users/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    assert.strictEqual(response.status, 201);
    const headers = response.headers;
    assert.ok(headers.has('content-type'), 'Header "content-type" must be present');
  });

});
