const { describe, it } = require('node:test');
const assert = require('node:assert');
const { request } = require('../helpers/api-client');

describe('DELETE /users/:id - Delete User Test Suite', () => {

  it('TC-API-DEL-001: Should delete an existing user and return HTTP 200 with isDeleted flag', async () => {
    const userId = 1;
    const response = await request(`/users/${userId}`, {
      method: 'DELETE'
    });

    // 1. Status Code Validation
    assert.strictEqual(response.status, 200, 'Expected HTTP 200 OK');

    // 2. Response Body Validation
    const body = await response.json();
    assert.strictEqual(body.id, userId, 'Returned user ID should match');
    assert.strictEqual(body.isDeleted, true, 'isDeleted flag should be true');
    assert.ok(body.deletedOn, 'Response must include deletedOn timestamp');
  });

  it('TC-API-DEL-002: Should verify deletion response includes Content-Type header', async () => {
    const userId = 2;
    const response = await request(`/users/${userId}`, {
      method: 'DELETE'
    });

    assert.strictEqual(response.status, 200);
    const contentType = response.headers.get('content-type');
    assert.ok(contentType && contentType.includes('application/json'));
  });

  it('TC-API-DEL-003: Should handle deletion request for non-existent user ID (boundary case)', async () => {
    const nonExistentId = 99999;
    const response = await request(`/users/${nonExistentId}`, {
      method: 'DELETE'
    });

    // DummyJSON returns 404 for non-existent user deletion
    assert.strictEqual(response.status, 404, 'Expected HTTP 404 for deleting non-existent ID');
    const body = await response.json();
    assert.ok(body.message, 'Response should contain error message');
  });

});
