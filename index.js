"use strict";

import https from "node:https";
import { BillingLogixApiError } from "./lib/errors";

/**
 * BillingLogix API Options
 * @type {BillingLogixOptions}
 */
const defaultOptions = {
    /**
     * API version
     * @type {string}
     */
    version: "v1",

    /**
     * Request timeout in milliseconds
     * @type {number}
     */
    timeout: 10000,

    /**
     * Additional request headers
     * @type {{ [key: string]: string }}
     */
    headers: {},
};

/**
 * Create the BillingLogix API object.
 * @param {string} acccountSub - BillingLogix Account subdomain
 * @param {string} accessKey - API access key
 * @param {string} secretKey - API secret key
 * @param {BillingLogixOptions} options - Additional options
 * @returns {BillingLogix} - BillingLogix API object
 * @constructor - BillingLogix API constructor
 */
const BillingLogix = (acccountSub, accessKey, secretKey, options = {}) => {
    const regex = {
        acccountSub: /^(?![-])[a-z0-9-]+(?<![-])$/gm,
        accessKey: /^[a-zA-Z0-9]+$/,
        secretKey: /^[a-zA-Z0-9.]+$/,
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
        throw new BillingLogixApiError("Invalid options object: " + options);
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

    this.accessKey = accessKey;
    this.secretKey = secretKey;
    this.options = options;
    this.apiBaseUrl = `https://${acccountSub}.billinglogix.com/api/${options.version}`;
    this.apiHeaders = {
        "Content-Type": "application/json",
        ...options.headers,
    };
    this.apiTimeout = options.timeout;
};
