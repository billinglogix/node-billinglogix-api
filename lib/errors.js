/**
 * BillingLogix API Error
 * @extends {Error} - Error class
 * @param {string} message - Error message
 * @param {object} data - Additional error data
 */
class BillingLogixApiError extends Error {
    constructor(message, data) {
        super(message);
        this.name = this.constructor.name;
        if (typeof data !== "undefined") {
            this.data = data;
        }
    }
}

/**
 * Convert error to JSON
 * @param {boolean} stack - Include stack trace
 * @returns {BillingLogixApiErrorJSON} - JSON object with error properties
 */
BillingLogixApiError.prototype.toJSON = function (stack = false) {
    const stackTrace = stack === true ? { stack: this.stack } : {};
    if (typeof this.data === "undefined") {
        return {
            name: this.name,
            message: this.message,
            ...stackTrace,
        };
    } else {
        return {
            name: this.name,
            message: this.message,
            data: this.data,
            ...stackTrace,
        };
    }
};

export { BillingLogixApiError };
