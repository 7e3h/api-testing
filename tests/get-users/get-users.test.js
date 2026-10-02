const { describe, it } = require('node:test');
const assert = require('node:assert');
const { request } = require('../helpers/api-client');

describe('GET /users - Retrieve Users Test Suite', () => {

  it('TC-API-GET-001: Should retrieve a paginated list of users with 200 OK and valid schema', async () => {
    const response = await request('/users?limit=10&skip=0');
    
    // 1. Status Code Validation
    assert.strictEqual(response.status, 200, 'Expected HTTP 200 OK');

    // 2. Headers Validation
    const contentType = response.headers.get('content-type');
    assert.ok(contentType && contentType.includes('application/json'), 'Content-Type should be application/json');

    // 3. Response Body & Required Fields Validation
    const body = await response.json();
    assert.strictEqual(typeof body.total, 'number', 'Field "total" must be a number');
    assert.strictEqual(typeof body.skip, 'number', 'Field "skip" must be a number');
    assert.strictEqual(typeof body.limit, 'number', 'Field "limit" must be a number');
    assert.ok(Array.isArray(body.users), 'Field "users" must be an array');
    assert.ok(body.users.length > 0, 'Users array should contain items');

    // 4. Validate item level schema for each user
    const firstUser = body.users[0];
    assert.ok(typeof firstUser.id === 'number', 'User "id" must be a number');
    assert.ok(typeof firstUser.email === 'string' && firstUser.email.includes('@'), 'User "email" must be valid');
    assert.ok(typeof firstUser.firstName === 'string' && firstUser.firstName.length > 0, 'User "firstName" is required');
    assert.ok(typeof firstUser.lastName === 'string' && firstUser.lastName.length > 0, 'User "lastName" is required');
  });

  it('TC-API-GET-002: Should retrieve single user details by ID with 200 OK', async () => {
    const targetUserId = 1;
    const response = await request(`/users/${targetUserId}`);

    assert.strictEqual(response.status, 200, 'Expected HTTP 200 OK');
    const body = await response.json();

    assert.strictEqual(body.id, targetUserId, 'User ID should match requested ID');
    assert.strictEqual(body.firstName, 'Emily');
    assert.strictEqual(body.gender, 'female');
    assert.ok(body.email.includes('@'), 'User should have a valid email');
  });

  it('TC-API-GET-003: Should return 404 Not Found when user ID does not exist (Negative Test)', async () => {
    const nonExistentId = 9999;
    const response = await request(`/users/${nonExistentId}`);

    // Status Code Validation
    assert.strictEqual(response.status, 404, 'Expected HTTP 404 Not Found for non-existent user');
    
    // Body should contain error message
    const body = await response.json();
    assert.ok(body.message, 'Response should contain error message on 404');
    assert.ok(body.message.includes('not found'), 'Message should indicate user not found');
  });

  it('TC-API-GET-004: Should authenticate and return token on valid login endpoint', async () => {
    const response = await request('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'emilys', password: 'emilyspass' })
    });

    assert.strictEqual(response.status, 200, 'Expected HTTP 200 OK');
    const body = await response.json();
    assert.ok(body.accessToken, 'Response should contain accessToken');
    assert.strictEqual(typeof body.accessToken, 'string');
    assert.strictEqual(body.username, 'emilys');
  });

  it('TC-API-GET-005: Should return 400 Bad Request when password is missing on login (Negative Test)', async () => {
    const response = await request('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'emilys' })
    });

    assert.strictEqual(response.status, 400, 'Expected HTTP 400 Bad Request');
    const body = await response.json();
    assert.ok(body.message, 'Expected error message indicating missing credentials');
  });

});
