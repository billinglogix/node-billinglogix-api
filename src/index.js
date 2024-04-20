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
import fetch from "node-fetch";
import jwt from "jsonwebtoken";

/**
 * BillingLogix API Options
 * @type {import("./types").BillingLogixOptions}
 */
const defaultOptions = {
    version: "v1",
    timeout: 10000,
    headers: {},
    debug: false,
};

/**
 * BillingLogix API Client
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
     * @param {import("./types").BillingLogixOptions} options - Additional options
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
     * @param {import("./types").BillingLogixClient} blxClient
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

    request(options, done) {
        this.#log("Request Options", options, done ? "Callback" : "Promise");
        const requestPromise = new Promise((resolve, reject) => {
            try {
                const requestOptions = this.#includeApiJwt({
                    ...options,
                    headers: {
                        ...options.headers,
                        ...this.#apiHeaders,
                    },
                    timeout: options.timeout || this.#apiTimeout,
                });

                if (requestOptions.path.charAt(0) !== "/") {
                    requestOptions.path = `/${requestOptions.path}`;
                }

                this.#log("Fetch Options", {
                    path: requestOptions.path,
                    method: requestOptions.method,
                });
                fetch(
                    `${this.#apiBaseUrl}${requestOptions.path}`,
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
                                    // reject(
                                    //     new BillingLogixApiError(
                                    //         `Error: ${response.statusText}`,
                                    //         data
                                    //     )
                                    // );
                                })
                                .catch((err) => {
                                    this.#error("Response Failure", err);
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
            }
        });

        if (done) {
            requestPromise
                .then((result) => {
                    this.#log("Promise", "Done");
                    done(null, result);
                })
                .catch((err) => {
                    this.#log("Promise", "Error", result);
                    done(err);
                });
            return undefined;
        }
        this.#log("Promise Returned", "No callback");
        return requestPromise;
    }

    get(path, options = {}, done) {
        const requestOptions = {
            ...options,
            path: path,
            method: "get",
        };

        return this.request(options, done);
    }

    post(path, data, options = {}, done) {
        const requestOptions = {
            ...options,
            path: path,
            method: "post",
            data: data,
        };

        return this.request(options, done);
    }

    put(path, data, options = {}, done) {
        const requestOptions = {
            ...options,
            path: path,
            method: "put",
            data: data,
        };

        return this.request(options, done);
    }

    delete(path, options = {}, done) {
        const requestOptions = {
            ...options,
            path: path,
            method: "delete",
        };

        return this.request(options, done);
    }
}

export default BillingLogixClient;
