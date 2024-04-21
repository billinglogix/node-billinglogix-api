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
 * Query parameters
 */
export type QueryParams = {
    [key: string]: string | number | boolean;
};
export type CallbackFunction = (err: any, data: any) => void;
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
 * BillingLogix API Optional Request Options
 */
export type BillingLogixOptionalRequestOptions = {
    /**
     * Request headers
     */
    headers?: Headers;
    /**
     * Query parameters
     */
    query?: QueryParams;
    /**
     * Request timeout in milliseconds
     */
    timeout?: number;
};
/**
 * BillingLogix API Request Options
 */
export type BillingLogixRequestOptions = BillingLogixOptionalRequestOptions & {
    /**
     * Request method
     */
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    /**
     * Request path
     */
    path: string;
    /**
     * Request body
     */
    body?: any;
};
/**
 * BillingLogix API Client
 * @class
 * @property {Function} request - Send a request to the BillingLogix API
 * @property {Function} get - Send a GET request to the BillingLogix API
 * @property {Function} post - Send a POST request to the BillingLogix API
 * @property {Function} put - Send a PUT request to the BillingLogix API
 * @property {Function} patch - Send a PATCH request to the BillingLogix API
 * @property {Function} delete - Send a DELETE request to the BillingLogix API
 */
export type BillingLogixClient = {
    /**
     * Send a request to the BillingLogix API
     * @param {BillingLogixRequestOptions} options - Request options
     * @param {CallbackFunction} done - Callback function
     * @returns {Promise<any> | undefined} - Request promise or undefined if a callback is provided
     */
    request(options: BillingLogixRequestOptions, done?: CallbackFunction): Promise<any> | undefined;
    /**
     * Send a GET request to the BillingLogix API
     * @param {string} path - Request path
     * @param {BillingLogixOptionalRequestOptions} options - Request options
     * @param {CallbackFunction} done - Callback function
     * @returns {Promise<any> | undefined} - Request promise or undefined if a callback is provided
     */
    get(path: string, options?: BillingLogixOptionalRequestOptions, done?: CallbackFunction): Promise<any> | undefined;
    /**
     * Send a POST request to the BillingLogix API
     * @param {string} path - Request path
     * @param {any} body - Request body
     * @param {BillingLogixOptionalRequestOptions} options - Request options
     * @param {CallbackFunction} done - Callback function
     * @returns {Promise<any> | undefined} - Request promise or undefined if a callback is provided
     */
    post(path: string, body: any, options?: BillingLogixOptionalRequestOptions, done?: CallbackFunction): Promise<any> | undefined;
    /**
     * Send a PUT request to the BillingLogix API
     * @param {string} path - Request path
     * @param {any} body - Request body
     * @param {BillingLogixOptionalRequestOptions} options - Request options
     * @param {CallbackFunction} done - Callback function
     * @returns {Promise<any> | undefined} - Request promise or undefined if a callback is provided
     */
    put(path: string, body: any, options?: BillingLogixOptionalRequestOptions, done?: CallbackFunction): Promise<any> | undefined;
    /**
     * Send a PATCH request to the BillingLogix API
     * @param {string} path - Request path
     * @param {any} body - Request body
     * @param {BillingLogixOptionalRequestOptions} options - Request options
     * @param {CallbackFunction} done - Callback function
     * @returns {Promise<any> | undefined} - Request promise or undefined if a callback is provided
     */
    patch(path: string, body: any, options?: BillingLogixOptionalRequestOptions, done?: CallbackFunction): Promise<any> | undefined;
    /**
     * Send a DELETE request to the BillingLogix API
     * @param {string} path - Request path
     * @param {BillingLogixOptionalRequestOptions} options - Request options
     * @param {CallbackFunction} done - Callback function
     * @returns {Promise<any> | undefined} - Request promise or undefined if a callback is provided
     */
    delete(path: string, options?: BillingLogixOptionalRequestOptions, done?: CallbackFunction): Promise<any> | undefined;
};
/**
 * BillingLogix API Error
 */
export type BillingLogixApiError = {
    name: string;
    message: string;
    data?: any;
    stack?: any;
};
