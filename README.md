# API Testing Suite

A REST API testing project implementing automated tests with Node.js and a portable **Postman Collection v2.1.0**.

This project tests core HTTP operations (`GET`, `POST`, `PUT`, `DELETE`), response status codes, header validation, response body assertions, required fields, negative inputs, and token authentication against the public practice [DummyJSON API](https://dummyjson.com).

---

## 🎯 Test Objectives & Scope

The test suite covers key API testing fundamentals:

1. **Status Codes:** Validates expected HTTP status codes (`200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`).
2. **Response Body Validation:** Asserts returned JSON data structures, property types, and echoed values.
3. **Headers Validation:** Verifies transport headers including `Content-Type: application/json`.
4. **Required Fields:** Checks presence of resource properties (`id`, `email`, `firstName`, `lastName`), and generated IDs.
5. **Invalid Input & Error Handling:** Validates error responses for non-existent resource IDs (`404`) and missing required parameters (`400`).
6. **Authentication Flow:** Validates login token return on success (`200 OK` with `accessToken`) and missing credential validation (`400 Bad Request`).

---

## 📁 Repository Structure

```text
api-testing/
│
├── README.md                          # Project documentation and test reporting
├── package.json                       # Test runner scripts and project configuration
│
├── tests/                             # Automated test suites (Node.js test runner)
│   ├── helpers/
│   │   └── api-client.js              # Reusable API request helper
│   ├── get-users/
│   │   └── get-users.test.js          # GET list, single user, 404 negative, and auth tests
│   ├── create-user/
│   │   └── create-user.test.js        # POST user creation and header tests
│   ├── update-user/
│   │   └── update-user.test.js        # PUT and partial update tests
│   └── delete-user/
│       └── delete-user.test.js        # DELETE resource and status assertions
│
└── postman/
    └── collection.json                # Postman Collection v2.1.0 with embedded test scripts
```

---

## 🧪 Test Matrix

| Test ID | Module | Endpoint | Method | Expected Status | Description / Assertions |
|:---|:---|:---|:---:|:---:|:---|
| **TC-API-GET-001** | Get Users | `/users?limit=10&skip=0` | `GET` | `200 OK` | Verifies pagination metadata (`total`, `skip`, `limit`), array presence, and user item schema (`id`, `email`, `firstName`, `lastName`). |
| **TC-API-GET-002** | Get Users | `/users/1` | `GET` | `200 OK` | Retrieves single user details and asserts returned ID matches requested parameter `1`. |
| **TC-API-GET-003** | Get Users | `/users/9999` | `GET` | `404 Not Found` | Negative test; invalid user ID returns HTTP 404 with error message. |
| **TC-API-GET-004** | Auth | `/auth/login` | `POST` | `200 OK` | Valid login credentials return an authorization `accessToken`. |
| **TC-API-GET-005** | Auth (Negative) | `/auth/login` | `POST` | `400 Bad Request` | Missing password returns error message. |
| **TC-API-POST-001** | Create User | `/users/add` | `POST` | `201 Created` | Creates new user, asserts echoed attributes, and verifies generated numeric `id`. |
| **TC-API-POST-002** | Create User | `/users/add` | `POST` | `201 Created` | Handles boundary/special characters in payload string. |
| **TC-API-POST-003** | Headers | `/users/add` | `POST` | `201 Created` | Asserts `Content-Type` response header includes `application/json`. |
| **TC-API-PUT-001** | Update User | `/users/1` | `PUT` | `200 OK` | Updates user details and asserts returned updated fields. |
| **TC-API-PUT-002** | Update User | `/users/1` | `PUT` | `200 OK` | Partially updates user single attribute and asserts returned value. |
| **TC-API-PUT-003** | Update User | `/users/1` | `PUT` | `200 OK` | Handles empty update payload gracefully. |
| **TC-API-DEL-001** | Delete User | `/users/1` | `DELETE` | `200 OK` | Deletes existing user and asserts `isDeleted` flag is true. |
| **TC-API-DEL-002** | Delete User | `/users/2` | `DELETE` | `200 OK` | Verifies response headers include `Content-Type: application/json`. |
| **TC-API-DEL-003** | Delete User | `/users/99999` | `DELETE` | `404 Not Found` | Negative test: deleting non-existent ID returns 404. |

---

## 🚀 Running Automated Tests

The tests are implemented with the built-in Node.js test runner (`node:test` & `node:assert`), requiring no third-party test framework installations.

### Prerequisites
- Node.js (v18.0 or higher, v22 recommended)

### Commands

```bash
# Run all 14 API tests across the 4 suites
npm test

# Run individual test suites
npm run test:get      # GET users and Auth tests
npm run test:create   # POST Create User tests
npm run test:update   # PUT tests
npm run test:delete   # DELETE tests
```

---

## 📮 Running the Postman Collection

### Option A: Postman Desktop / Web
1. Open **Postman**.
2. Click **Import** and select [`postman/collection.json`](./postman/collection.json).
3. Use the **Collection Runner** to execute all requests and view assertion results.

### Option B: Command Line (Newman)
```bash
# Install Newman if not already installed
npm install -g newman

# Execute the collection
newman run postman/collection.json
```
