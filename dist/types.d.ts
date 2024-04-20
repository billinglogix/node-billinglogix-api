/**
 * Typescript type definitions for BillingLogix API
 * @module billinglogix-api
 * @license MIT
 * @version 1.0.0
 * @since 1.0.0
 * @description A simple BillingLogix API client for Node.js
 * @repository https://github.com/billinglogix/node-billinglogix-api
 */
/**
 * Request headers
 */
export type Headers = {
    [key: string]: string;
};
/**
 * BillingLogix API Config Options
 */
export type BillingLogixOptions = {
    /**
     * API version
     */
    version: "v1";
    /**
     * Request timeout in milliseconds
     * @constraint [1000-60000]
     */
    timeout: number;
    /**
     * Additional request headers
     */
    headers: Headers;
};
/**
 * BillingLogix API Client
 */
export type BillingLogixClient = {};
/**
 * BillingLogix API Error
 */
export type BillingLogixApiError = {
    name: string;
    message: string;
    data?: any;
    stack?: any;
};
