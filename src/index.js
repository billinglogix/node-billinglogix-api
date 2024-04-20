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

const https = require("node:https");
const { BillingLogixApiError } = require("./lib/errors");
const jwt = require("jsonwebtoken");

/**
 * BillingLogix API Options
 * @type {import("./types").BillingLogixOptions}
 */
const defaultOptions = {
    version: "v1",
    timeout: 10000,
    headers: {},
};

/**
 * BillingLogix API Client
 * @class
 */
class BillingLogixClient {
    #accessKey;
    #secretKey;
    #options;
    #apiBaseUrl;
    #apiHeaders;
    #apiTimeout;

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
                "Missing or invalid account subdomain: " + acccountSub
            );
        }
        if (typeof accessKey !== "string" || !regex.accessKey.test(accessKey)) {
            throw new BillingLogixApiError(
                "Missing or invalid access key: " + accessKey
            );
        }
        if (typeof secretKey !== "string" || !regex.secretKey.test(secretKey)) {
            throw new BillingLogixApiError(
                "Missing or invalid secret key: " + secretKey
            );
        }

        if (typeof options !== "object") {
            throw new BillingLogixApiError(
                "Invalid options object: " + options
            );
        }
        options = { ...defaultOptions, ...options };
        if (typeof options.version !== "string") {
            throw new BillingLogixApiError(
                "Invalid API version: " + options.version
            );
        } else if (options.version !== "v1") {
            throw new BillingLogixApiError(
                "Unsupported API version: " + options.version
            );
        }

        if (typeof options.timeout !== "number") {
            throw new BillingLogixApiError(
                "Invalid request timeout: " + options.timeout
            );
        } else if (options.timeout < 1000 || options.timeout > 60000) {
            throw new BillingLogixApiError(
                "Unsupported request timeout: " + options.timeout
            );
        }

        if (typeof options.headers !== "object") {
            throw new BillingLogixApiError(
                "Invalid additional request headers: " + options.headers
            );
        } else {
            for (const key in options.headers) {
                if (
                    typeof key !== "string" ||
                    typeof options.headers[key] !== "string"
                ) {
                    throw new BillingLogixApiError(
                        "Invalid request header value: " + options.headers[key]
                    );
                }
            }
        }

        this.#accessKey = accessKey;
        this.#secretKey = secretKey;
        this.#options = options;
        this.#apiBaseUrl = `https://${acccountSub}.billinglogix.com/api/${options.version}`;
        this.#apiHeaders = {
            "Content-Type": "application/json",
            ...options.headers,
        };
        this.#apiTimeout = options.timeout;
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
        const promise = new Promise((resolve, reject) => {
            const requestOptions = this.#includeApiJwt({
                ...options,
                headers: {
                    ...options.headers,
                    ...this.#apiHeaders,
                },
                timeout: options.timeout || this.#apiTimeout,
            });

            const request = https.request(
                this.#apiBaseUrl + requestOptions.path,
                requestOptions,
                (response) => {
                    let data = "";
                    response.on("data", (chunk) => {
                        data += chunk;
                    });
                    response.on("end", () => {
                        if (
                            response.statusCode >= 200 &&
                            response.statusCode < 300
                        ) {
                            resolve(JSON.parse(data));
                        } else {
                            reject(new BillingLogixApiError(data));
                        }
                    });
                }
            );

            request.on("error", (error) => {
                reject(new BillingLogixApiError(error));
            });

            request.end();

            return resolve(request);
        });

        if (done) {
            promise
                .then(function (result) {
                    done(null, result);
                })
                .catch(function (err) {
                    done(err);
                });
            return undefined;
        }

        return promise;
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

module.exports = exports = BillingLogixClient;
