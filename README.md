# billinglogix-api

BillingLogix API wrapper for the account APIs. This is designed to be a minimal client wrapper around the BillingLogix API to make it easier to make requests to the API.

There are only two small dependencies, `jsonwebtoken` and `node-fetch`, which are used to make signed requests and handle the API requests, respectively.

## Installation

```shell
$ npm i @billinglogix/billinglogix-api
```

## Quick Start

The module exports the client, `BillingLogixClient`, which is used to make requests to the BillingLogix API. It supports both callback and promise handling along with both CommonJS and ES6 module imports.

```javascript
// const BillingLogix = require("@billinglogix/billinglogix-api"); // CommonJS
import { BillingLogixClient } from "@billinglogix/billinglogix-api"; // ES6

const blxClient = new BillingLogixClient(ACCOUNT_SUB, ACCESS_KEY, SECRET_KEY);

// Callback style
blxClient.get("/accounts/members/:member_id", {}, function (err, result) {
    if (err) {
        // error handling
    } else {
        // success handling
    }
});

// Promise style
blxClient
    .get("/accounts/members/:member_id", {})
    .then(function (result) {
        // success handling
    })
    .catch(function (err) {
        // error handling
    });

// Using async/await
try {
    const result = await blxClient.get("/accounts/members/:member_id", {});

    // success handling
} catch (err) {
    // error handling
}
```

## Usage

For details on the possible calls, refer to the BillingLogix API documentation: [https://help.billinglogix.com](https://help.billinglogix.com)

### Promise and Callback Support

In all calls you can omit the callback, and a promise will be returned instead.

### Initialization

```javascript
import { BillingLogixClient } from "@billinglogix/billinglogix-api";

const blxClient = new BillingLogixClient(ACCOUNT_SUB, ACCESS_KEY, SECRET_KEY, {
    // Optional configuration
    version: "v1",
    timeout: 10000,
    headers: {
        "X-Custom-Header": "Custom Value",
    },
});
```

### Full Request Calls

```javascript
// Full request support - Promise
blxClient
    .request({
        method: "GET", // GET, POST, PUT, PATCH, DELETE
        path: "/accounts/members/:member_id",
        query: {
            test: "test-query-param",
        },
        body: {
            // POST/PUT/PATCH body
        },
        headers: {
            // Custom headers
        },
        timeout: 10000, // Override default timeout
    })
    .then(function (result) {
        // success handling
    })
    .catch(function (err) {
        // error handling
    });

// Full request support - Callback
blxClient.request(
    {
        method: "GET", // GET, POST, PUT, PATCH, DELETE
        path: "/accounts/members/:member_id",
        query: {
            test: "test-query-param",
        },
        body: {
            // POST/PUT/PATCH body
        },
        headers: {
            // Custom headers
        },
        timeout: 10000, // Override default timeout
    },
    function (err, result) {
        if (err) {
            // error handling
        } else {
            // success handling
        }
    }
);
```

### Specific Method Calls

For each request method type, functions exists to make common calls:

```javascript
blxClient.get(path, options, callback);
blxClient.post(path, body, options, callback);
blxClient.put(path, body, options, callback);
blxClient.patch(path, body, options, callback);
blxClient.delete(path, options, callback);
```

This allows shorthand forms like:

```javascript
blxClient
    .get("/accounts/members/:member_id")
    .then(function (results) {
        // success handling
    })
    .catch(function (err) {
        // error handling
    });

blxClient
    .post("/accounts/members", {
        email: "testme@test.com",
        fistName: "Test",
        lastName: "Me",
    })
    .then(function (results) {
        // success handling
    })
    .catch(function (err) {
        // error handling
    });
```
