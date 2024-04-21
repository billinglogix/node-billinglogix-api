"use strict";

/**
 * JavaScript BillingLogix API Client
 * @module billinglogix-api
 * @license MIT
 * @version 1.0.0
 * @since 1.0.0
 * @description A simple BillingLogix API client for Node.js
 * @repository https://github.com/billinglogix/node-billinglogix-api
 */

import { BillingLogixApiError } from "./lib/errors.js";
// import fetch from "node-fetch";
import jwt from "jsonwebtoken";

// load fetch with cjs friendly import
const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));

/**
 * Valid HTTP methods
 * @type {string[]}
 * @constant
 */
const validMethods = ["GET", "POST", "PUT", "PATCH", "DELETE"];

/**
 * BillingLogix API Options
 * @type {import("./index").BillingLogixOptions}
 * @constant
 */
const defaultOptions = {
    version: "v1",
    timeout: 10000,
    headers: {},
    debug: false,
};

/**
 * BillingLogix API Client
 * @type {import("./index").BillingLogixClient}
 * @class
 */
export class BillingLogixClient {
    #accessKey;
    #secretKey;
    #options;
    #apiBaseUrl;
    #apiHeaders;
    #apiTimeout;
    #debug;

    /**
     * Create the BillingLogix API Client.
     * @param {string} acccountSub - BillingLogix Account subdomain
     * @param {string} accessKey - API access key
     * @param {string} secretKey - API secret key
     * @param {import("./index").BillingLogixOptions} options - Additional options
     * @constructor - BillingLogix API constructor
     */
    constructor(acccountSub, accessKey, secretKey, options = {}) {
        const regex = {
            acccountSub: /^(?![-])[a-z0-9-]+(?<![-])$/gm,
            accessKey: /^[a-zA-Z0-9]+$/,
            secretKey: /^[a-zA-Z0-9_=\-\/]+$/,
        };
        if (
            typeof acccountSub !== "string" ||
            !regex.acccountSub.test(acccountSub)
        ) {
            throw new BillingLogixApiError(
                `Missing or invalid account subdomain: ${acccountSub}`
            );
        }
        if (typeof accessKey !== "string" || !regex.accessKey.test(accessKey)) {
            throw new BillingLogixApiError(
                `Missing or invalid access key: ${accessKey}`
            );
        }
        if (typeof secretKey !== "string" || !regex.secretKey.test(secretKey)) {
            throw new BillingLogixApiError(
                `Missing or invalid secret key: ${secretKey}`
            );
        }

        if (typeof options !== "object") {
            throw new BillingLogixApiError(
                `Invalid options object: ${typeof options}`,
                options
            );
        }
        options = { ...defaultOptions, ...options };

        if (typeof options.version !== "string") {
            throw new BillingLogixApiError(
                `Invalid API version: ${options.version}`
            );
        } else if (options.version !== "v1") {
            throw new BillingLogixApiError(
                `Unsupported API version: ${options.version}`
            );
        }

        if (typeof options.timeout !== "number") {
            throw new BillingLogixApiError(
                `Invalid request timeout: ${options.timeout}`
            );
        } else if (options.timeout < 1000 || options.timeout > 60000) {
            throw new BillingLogixApiError(
                `Unsupported request timeout: ${options.timeout}`
            );
        }

        if (typeof options.headers !== "object") {
            throw new BillingLogixApiError(
                `Invalid additional request headers: ${typeof options.headers}`,
                options.headers
            );
        } else {
            for (const key in options.headers) {
                if (typeof key !== "string") {
                    throw new BillingLogixApiError(
                        `Invalid request header key: ${key}`,
                        options.headers
                    );
                } else if (typeof options.headers[key] !== "string") {
                    throw new BillingLogixApiError(
                        `Invalid request header value: ${options.headers[key]}`,
                        options.headers
                    );
                }
            }
        }

        this.#options = options;
        this.#accessKey = accessKey;
        this.#secretKey = secretKey;
        this.#apiBaseUrl = `https://${acccountSub}.billinglogix.com/api/${options.version}`;
        this.#apiHeaders = {
            ...options.headers,
            "User-Agent": "BillingLogix API Client v1.0.0",
            "Content-Type": "application/json",
            "Accept": "application/json",
        };
        this.#apiTimeout = options.timeout;
        this.#debug = options.debug === true;
    }

    /**
     * Log debug messages
     * @param {string} message - Debug message
     * @returns {void}
     */
    #log() {
        if (this.#debug) {
            console.debug(...arguments);
        }
    }

    /**
     * Log error messages
     * @param {string} message - Debug message
     * @returns {void}
     */
    #error() {
        if (this.#debug) {
            console.error(...arguments);
        }
    }

    /**
     * Add the JWT to all outgoing API requests
     * @param {import("./index").BillingLogixClient} blxClient
     * @param {HttpRequest} request
     * @returns {HttpRequest}
     * @throws {BillingLogixApiError} - No Authentication Data
     */
    #includeApiJwt(request) {
        if (this.#accessKey && this.#secretKey) {
            request.headers["Authorization"] =
                "Bearer " +
                jwt.sign(
                    {
                        iss: this.#accessKey,
                        iat: new Date().getTime(), // time issued
                        exp: new Date().getTime() + 30000, // 30 seconds
                    },
                    this.#secretKey
                );
        } else {
            throw new BillingLogixApiError("No Authentication Data");
        }
        return request;
    }

    /**
     * Clean the input headers
     * @param {import("./index").Headers} headers - Request headers
     * @returns {import("./index").Headers} - Cleaned headers
     */
    #cleanHeaders(headers) {
        if (typeof headers !== "object") {
            return {};
        }
        const cleanHeaders = {};
        for (const [key, value] in headers) {
            if (typeof key !== "string" || typeof value !== "string") {
                this.#log("Invalid Header", key, value);
                continue;
            }
            cleanHeaders[key.trim()] = value.trim();
        }
        return cleanHeaders;
    }

    /**
     * Make an API request
     * @param {import("./index").BillingLogixRequestOptions} options - Request options
     * @param {Function | undefined} done - Callback function
     * @returns {Promise<any> | undefined} - Request promise or undefined if a callback is provided
     * @throws {BillingLogixApiError} - Invalid request
     */
    request(options, done) {
        this.#log("Request Options", options, done ? "Callback" : "Promise");

        // AbortController was added in node v14.17.0 globally; if not available, don't support timeouts
        const AbortController = globalThis.AbortController ?? undefined;
        const controller = AbortController ? new AbortController() : undefined;
        const timeout = AbortController
            ? setTimeout(() => {
                  controller.abort();
              }, this.#apiTimeout)
            : undefined;
        if (controller === undefined) {
            this.#log("AbortController", "Not Supported");
        }

        const requestPromise = new Promise((resolve, reject) => {
            if (typeof options !== "object") {
                this.#log("Invalid Request Options", options);
                throw new BillingLogixApiError(
                    "Invalid request options",
                    options
                );
            }
            if (!options?.method || typeof options.method !== "string") {
                this.#log("Invalid Request Method", options);
                throw new BillingLogixApiError(
                    "Invalid request method",
                    options
                );
            } else if (!validMethods.includes(options.method.toUpperCase())) {
                this.#log("Invalid Request Method Option", options);
                throw new BillingLogixApiError(
                    "Unsupported request method",
                    options
                );
            }

            if (
                !options?.path ||
                typeof options.path !== "string" ||
                options.path.trim().length === 0 ||
                options.path.trim() === "/"
            ) {
                this.#log("Invalid Request Path", options);
                throw new BillingLogixApiError("Invalid request path", options);
            }

            if (
                typeof options.timeout !== "undefined" &&
                typeof options.timeout !== "number"
            ) {
                this.#log("Invalid Request Timeout", options);
                throw new BillingLogixApiError(
                    "Invalid request timeout",
                    options
                );
            } else if (options.timeout < 1000 || options.timeout > 60000) {
                this.#log("Unsupported Request Timeout", options);
                throw new BillingLogixApiError(
                    "Unsupported request timeout",
                    options
                );
            }

            if (
                typeof options.query !== "undefined" &&
                typeof options.query !== "object"
            ) {
                this.#log("Invalid Request Query Params", options);
                throw new BillingLogixApiError(
                    "Invalid request query params",
                    options
                );
            }

            try {
                const queryString = options.query
                    ? `?${new URLSearchParams(options.query).toString()}`
                    : "";

                const requestOptions = this.#includeApiJwt({
                    method: options.method,
                    path: options.path,
                    headers: {
                        ...this.#cleanHeaders(options.headers),
                        ...this.#apiHeaders,
                    },
                    timeout: options.timeout || this.#apiTimeout,
                    body: options.body
                        ? typeof options.body === "string"
                            ? options.body
                            : JSON.stringify(options.body)
                        : null,
                    signal: controller ? controller.signal : null,
                });

                if (requestOptions.path.charAt(0) !== "/") {
                    requestOptions.path = `/${requestOptions.path}`;
                }

                this.#log("Fetch Options", {
                    method: requestOptions.method,
                    path: requestOptions.path,
                    query: queryString,
                });
                return fetch(
                    `${this.#apiBaseUrl}${requestOptions.path}${queryString}`,
                    requestOptions
                )
                    .then((response) => {
                        if (response.ok) {
                            response
                                .json()
                                .then((data) => {
                                    this.#log("Response Success");
                                    resolve(data);
                                })
                                .catch((err) => {
                                    this.#error("Response Parsing Error", err);
                                    reject(
                                        new BillingLogixApiError(
                                            "Error parsing response data",
                                            err
                                        )
                                    );
                                });
                        } else {
                            response
                                .json()
                                .then((data) => {
                                    this.#log("Response Error", data);
                                    reject(data);
                                })
                                .catch((err) => {
                                    this.#error(
                                        "Response Parsing Failure",
                                        err
                                    );
                                    reject(
                                        new BillingLogixApiError(
                                            "Error parsing request failure",
                                            err
                                        )
                                    );
                                });
                        }
                    })
                    .catch((err) => {
                        this.#error("Request Failure", err);
                        reject(
                            new BillingLogixApiError("Request Failure", err)
                        );
                    });
            } catch (err) {
                this.#error("Unexpected Error", err);
                reject(new BillingLogixApiError("Unexpected Error", err));
                throw err;
            }
        })
            .then((result) => {
                this.#log("Promise Success", result);
                if (timeout) {
                    clearTimeout(timeout);
                }

                if (done) {
                    this.#log("Promise Success", "Callback Success");
                    done(null, result);
                }

                return result;
            })
            .catch((err) => {
                this.#log("Promise Error", err);
                if (timeout) {
                    clearTimeout(timeout);
                }

                if (done) {
                    this.#log("Promise Error", "Callback Error");
                    done(err);
                }

                throw err;
            });

        if (done) {
            return undefined;
        }
        this.#log("Promise Returned", "No callback");
        return requestPromise;
    }

    /**
     * API GET request
     * @param {string} path - Request path
     * @param {import("./index").BillingLogixOptionalRequestOptions} options - Request options
     * @param {Function | undefined} done - Callback function
     * @returns {Promise<any> | undefined} - Request promise or undefined if a callback is provided
     * @throws {BillingLogixApiError} - Invalid request
     */
    get(path, options = {}, done) {
        return this.request(
            {
                ...options,
                path: path,
                method: "GET",
            },
            done
        );
    }

    /**
     * API POST request
     * @param {string} path - Request path
     * @param {any} body - Request body
     * @param {import("./index").BillingLogixOptionalRequestOptions} options - Request options
     * @param {Function | undefined} done - Callback function
     * @returns {Promise<any> | undefined} - Request promise or undefined if a callback is provided
     * @throws {BillingLogixApiError} - Invalid request
     */
    post(path, body, options = {}, done) {
        return this.request(
            {
                ...options,
                path: path,
                method: "POST",
                body: body,
            },
            done
        );
    }

    /**
     * API PUT request
     * @param {string} path - Request path
     * @param {any} body - Request body
     * @param {import("./index").BillingLogixOptionalRequestOptions} options - Request options
     * @param {Function | undefined} done - Callback function
     * @returns {Promise<any> | undefined} - Request promise or undefined if a callback is provided
     * @throws {BillingLogixApiError} - Invalid request
     */
    put(path, body, options = {}, done) {
        return this.request(
            {
                ...options,
                path: path,
                method: "PUT",
                body: body,
            },
            done
        );
    }

    /**
     * API PATCH request
     * @param {string} path - Request path
     * @param {any} body - Request body
     * @param {import("./index").BillingLogixOptionalRequestOptions} options - Request options
     * @param {Function | undefined} done - Callback function
     * @returns {Promise<any> | undefined} - Request promise or undefined if a callback is provided
     * @throws {BillingLogixApiError} - Invalid request
     */
    patch(path, body, options = {}, done) {
        return this.request(
            {
                ...options,
                path: path,
                method: "PATCH",
                body: body,
            },
            done
        );
    }

    /**
     * API DELETE request
     * @param {string} path - Request path
     * @param {import("./index").BillingLogixOptionalRequestOptions} options - Request options
     * @param {Function | undefined} done - Callback function
     * @returns {Promise<any> | undefined} - Request promise or undefined if a callback is provided
     * @throws {BillingLogixApiError} - Invalid request
     */
    delete(path, options = {}, done) {
        return this.request(
            {
                ...options,
                path: path,
                method: "DELETE",
            },
            done
        );
    }
}

export default BillingLogixClient;

export { BillingLogixApiError };
