import { BillingLogixClient } from "../src/index.js";
import { BillingLogixApiError } from "../src/lib/errors.js";
import { expect } from "chai";
import { v4 as uuidv4 } from "uuid";

import dotenv from "dotenv";
dotenv.config();

const auth = {
    sub: process.env.ACCOUNT_SUB,
    key: process.env.ACCESS_KEY,
    secret: process.env.SECRET_KEY,
};
const clientOptions = {
    debug: process.env.DEBUG === "true",
};

/**
 * Logger Helper
 */
const logger = {
    debug: (...args) => {
        if (clientOptions.debug) {
            console.debug(...args);
        }
    },
};

describe("Initialization", () => {
    it("should fail for no auth", () => {
        expect(() => {
            const blx = new BillingLogixClient(null, null, null);
        }).to.throw(BillingLogixApiError);
    });

    it("should fail for invalid api key and secret", () => {
        expect(() => {
            const blx = new BillingLogixClient(auth.sub);
        }).to.throw(BillingLogixApiError);
    });

    it("should fail for invalid api secret", () => {
        expect(() => {
            const blx = new BillingLogixClient(auth.sub, auth.key);
        }).to.throw(BillingLogixApiError);
    });

    it("should work for all valid auth", () => {
        const blx = new BillingLogixClient(auth.sub, auth.key, auth.secret);
        expect(blx).to.be.an.instanceof(BillingLogixClient);
    });

    it("should fail for invalid sub", () => {
        expect(() => {
            const blx = new BillingLogixClient(
                "-invalid-sub-",
                auth.key,
                auth.secret
            );
        }).to.throw(BillingLogixApiError);
    });

    it("should fail for invalid key", () => {
        expect(() => {
            const blx = new BillingLogixClient(
                auth.sub,
                "-invalid-key-",
                auth.secret
            );
        }).to.throw(BillingLogixApiError);
    });

    it("should fail for invalid secret", () => {
        expect(() => {
            const blx = new BillingLogixClient(
                auth.sub,
                auth.key,
                "-invalid#!~secret-"
            );
        }).to.throw(BillingLogixApiError);
    });

    it("should fail for invalid options", () => {
        expect(() => {
            const blx = new BillingLogixClient(
                auth.sub,
                auth.key,
                auth.secret,
                "Invalid Options"
            );
        }).to.throw(BillingLogixApiError);
    });

    it("should work for valid options", () => {
        const blx = new BillingLogixClient(auth.sub, auth.key, auth.secret, {
            debug: true,
        });
        expect(blx).to.be.an.instanceof(BillingLogixClient);
    });

    it("should fail for invalid option version", () => {
        expect(() => {
            const blx = new BillingLogixClient(
                auth.sub,
                auth.key,
                auth.secret,
                {
                    version: "bad-version",
                }
            );
        }).to.throw(BillingLogixApiError);
    });

    it("should work for valid option version", () => {
        const blx = new BillingLogixClient(auth.sub, auth.key, auth.secret, {
            version: "v1",
        });
        expect(blx).to.be.an.instanceof(BillingLogixClient);
    });

    it("should fail for invalid option timeout", () => {
        expect(() => {
            const blx = new BillingLogixClient(
                auth.sub,
                auth.key,
                auth.secret,
                {
                    timeout: "bad-timeout",
                }
            );
        }).to.throw(BillingLogixApiError);
    });

    it("should work for valid option timeout", () => {
        const blx = new BillingLogixClient(auth.sub, auth.key, auth.secret, {
            timeout: 10000,
        });
        expect(blx).to.be.an.instanceof(BillingLogixClient);
    });

    it("should fail for invalid option timeout - too low", () => {
        expect(() => {
            const blx = new BillingLogixClient(
                auth.sub,
                auth.key,
                auth.secret,
                {
                    timeout: 500,
                }
            );
        }).to.throw(BillingLogixApiError);
    });

    it("should fail for invalid option timeout - too high", () => {
        expect(() => {
            const blx = new BillingLogixClient(
                auth.sub,
                auth.key,
                auth.secret,
                {
                    timeout: 60001,
                }
            );
        }).to.throw(BillingLogixApiError);
    });

    it("should work for valid option timeout - at max", () => {
        const blx = new BillingLogixClient(auth.sub, auth.key, auth.secret, {
            timeout: 60000,
        });
        expect(blx).to.be.an.instanceof(BillingLogixClient);
    });

    it("should work for valid option timeout - at min", () => {
        const blx = new BillingLogixClient(auth.sub, auth.key, auth.secret, {
            timeout: 1000,
        });
        expect(blx).to.be.an.instanceof(BillingLogixClient);
    });

    it("should fail for invalid headers", () => {
        expect(() => {
            const blx = new BillingLogixClient(
                auth.sub,
                auth.key,
                auth.secret,
                {
                    headers: "Invalid Headers",
                }
            );
        }).to.throw(BillingLogixApiError);
    });

    it("should work for valid headers", () => {
        const blx = new BillingLogixClient(auth.sub, auth.key, auth.secret, {
            headers: {
                "X-Test-Header": "Test",
            },
        });
        expect(blx).to.be.an.instanceof(BillingLogixClient);
    });

    it("should fail for invalid headers - bad value 1", () => {
        expect(() => {
            const blx = new BillingLogixClient(
                auth.sub,
                auth.key,
                auth.secret,
                {
                    headers: {
                        "X-Test-Header": "Test",
                        "X-Test-Header2": ["Test"],
                    },
                }
            );
        }).to.throw(BillingLogixApiError);
    });

    it("should fail for invalid headers - bad value 2", () => {
        expect(() => {
            const blx = new BillingLogixClient(
                auth.sub,
                auth.key,
                auth.secret,
                {
                    headers: {
                        "X-Test-Header": "Test",
                        "X-Test-Header2": {
                            "key": "value",
                        },
                    },
                }
            );
        }).to.throw(BillingLogixApiError);
    });

    it("should work for multiple valid headers", () => {
        const blx = new BillingLogixClient(auth.sub, auth.key, auth.secret, {
            headers: {
                "X-Test-Header": "Test",
                "X-Test-Header2": "Test2",
                "X-Test-Header3": "Test3",
            },
        });
        expect(blx).to.be.an.instanceof(BillingLogixClient);
    });

    it("should work for all valid options", () => {
        const blx = new BillingLogixClient(auth.sub, auth.key, auth.secret, {
            debug: true,
            version: "v1",
            timeout: 10000,
            headers: {
                "X-Test-Header": "Test",
                "X-Test-Header2": "Test2",
                "X-Test-Header3": "Test3",
            },
        });
        expect(blx).to.be.an.instanceof(BillingLogixClient);
    });
});

describe("BillingLogixClient - Callbacks", () => {
    let client;

    beforeEach(() => {
        client = new BillingLogixClient(
            auth.sub,
            auth.key,
            auth.secret,
            clientOptions
        );
    });

    describe("Callback - Requests", () => {
        it("callback: should make a request", (done) => {
            const request = client.request(
                {
                    path: "/tags",
                    method: "get",
                },
                (error, data) => {
                    logger.debug("callback request done", error, data?.length);
                    expect(error).to.equal(null);
                    expect(data).to.have.length.greaterThan(0);
                    done();
                }
            );
            expect(request).to.be.equal(undefined);
        });

        it("callback: should fail with invalid options", (done) => {
            const request = client.request("invalid_options", (error, data) => {
                logger.debug(
                    "invalid options: callback request done",
                    error?.message,
                    data
                );
                expect(error).to.be.an.instanceof(BillingLogixApiError);
                expect(data).to.equal(undefined);
                done();
            });
            expect(request).to.be.equal(undefined);
        });

        it("callback: should fail with invalid options: method", (done) => {
            const request = client.request(
                {
                    path: "/tags",
                    method: "invalid",
                },
                (error, data) => {
                    logger.debug(
                        "invalid options: callback request done",
                        error?.message,
                        data
                    );
                    expect(error).to.be.an.instanceof(BillingLogixApiError);
                    expect(data).to.equal(undefined);
                    done();
                }
            );
            expect(request).to.be.equal(undefined);
        });

        it("callback: should fail with invalid options: path empty", (done) => {
            const request = client.request(
                {
                    path: "",
                    method: "get",
                },
                (error, data) => {
                    logger.debug(
                        "invalid options: callback request done",
                        error?.message,
                        data
                    );
                    expect(error).to.be.an.instanceof(BillingLogixApiError);
                    expect(data).to.equal(undefined);
                    done();
                }
            );
            expect(request).to.be.equal(undefined);
        });

        it("callback: should fail with invalid options: path null", (done) => {
            const request = client.request(
                {
                    path: null,
                    method: "get",
                },
                (error, data) => {
                    logger.debug(
                        "invalid options: callback request done",
                        error?.message,
                        data
                    );
                    expect(error).to.be.an.instanceof(BillingLogixApiError);
                    expect(data).to.equal(undefined);
                    done();
                }
            );
            expect(request).to.be.equal(undefined);
        });

        it("callback: should fail with invalid options: path undefined", (done) => {
            const request = client.request(
                {
                    method: "get",
                },
                (error, data) => {
                    logger.debug(
                        "invalid options: callback request done",
                        error?.message,
                        data
                    );
                    expect(error).to.be.an.instanceof(BillingLogixApiError);
                    expect(data).to.equal(undefined);
                    done();
                }
            );
            expect(request).to.be.equal(undefined);
        });

        it("callback: should fail with invalid options: path only /", (done) => {
            const request = client.request(
                {
                    path: "/",
                    method: "get",
                },
                (error, data) => {
                    logger.debug(
                        "invalid options: callback request done",
                        error?.message,
                        data
                    );
                    expect(error).to.be.an.instanceof(BillingLogixApiError);
                    expect(data).to.equal(undefined);
                    done();
                }
            );
            expect(request).to.be.equal(undefined);
        });

        it("callback: should fail with invalid options: timeout invalid", (done) => {
            const request = client.request(
                {
                    path: "/tags",
                    method: "get",
                    timeout: "invalid",
                },
                (error, data) => {
                    logger.debug(
                        "invalid options: callback request done",
                        error?.message,
                        data
                    );
                    expect(error).to.be.an.instanceof(BillingLogixApiError);
                    expect(data).to.equal(undefined);
                    done();
                }
            );
            expect(request).to.be.equal(undefined);
        });

        it("callback: should fail with invalid options: timeout too low", (done) => {
            const request = client.request(
                {
                    path: "/tags",
                    method: "get",
                    timeout: 500,
                },
                (error, data) => {
                    logger.debug(
                        "invalid options: callback request done",
                        error?.message,
                        data
                    );
                    expect(error).to.be.an.instanceof(BillingLogixApiError);
                    expect(data).to.equal(undefined);
                    done();
                }
            );
            expect(request).to.be.equal(undefined);
        });

        it("callback: should fail with invalid options: timeout too high", (done) => {
            const request = client.request(
                {
                    path: "/tags",
                    method: "get",
                    timeout: 60001,
                },
                (error, data) => {
                    logger.debug(
                        "invalid options: callback request done",
                        error?.message,
                        data
                    );
                    expect(error).to.be.an.instanceof(BillingLogixApiError);
                    expect(data).to.equal(undefined);
                    done();
                }
            );
            expect(request).to.be.equal(undefined);
        });

        it("callback: should fail with invalid options: query invalid", (done) => {
            const request = client.request(
                {
                    path: "/tags",
                    method: "get",
                    query: "invalid",
                },
                (error, data) => {
                    logger.debug(
                        "invalid options: callback request done",
                        error?.message,
                        data
                    );
                    expect(error).to.be.an.instanceof(BillingLogixApiError);
                    expect(data).to.equal(undefined);
                    done();
                }
            );
            expect(request).to.be.equal(undefined);
        });

        it("callback: should succeed with all options", (done) => {
            const request = client.request(
                {
                    path: "/tags",
                    method: "get",
                    query: {
                        limit: 1,
                    },
                    timeout: 10000,
                },
                (error, data) => {
                    logger.debug(
                        "all options: callback request done",
                        error,
                        data?.length
                    );
                    expect(error).to.equal(null);
                    expect(data).to.have.length.greaterThan(0);
                    // expect(data).to.have.length.equal(1);
                    done();
                }
            );
            expect(request).to.be.equal(undefined);
        });
    });
});

describe("BillingLogixClient - Promises", () => {
    let client;

    beforeEach(() => {
        client = new BillingLogixClient(
            auth.sub,
            auth.key,
            auth.secret,
            clientOptions
        );
    });

    describe("Promises - Request", () => {
        it("promise: should make a request", async () => {
            const data = await client.request({
                path: "/tags",
                method: "get",
            });
            expect(data).to.have.length.greaterThan(0);
        });

        it("promise: should fail with invalid options", async () => {
            try {
                const data = await client.request("invalid_options");
            } catch (error) {
                logger.debug("invalid options error", error);
                expect(error).to.be.an.instanceof(BillingLogixApiError);
            }
        });

        it("promise: should fail with invalid options: method", async () => {
            try {
                const data = await client.request({
                    path: "/tags",
                    method: "invalid",
                });
            } catch (error) {
                logger.debug("invalid options error", error);
                expect(error).to.be.an.instanceof(BillingLogixApiError);
            }
        });

        it("promise: should fail with invalid options: path empty", async () => {
            try {
                const data = await client.request({
                    path: "",
                    method: "get",
                });
            } catch (error) {
                logger.debug("invalid options error", error);
                expect(error).to.be.an.instanceof(BillingLogixApiError);
            }
        });

        it("promise: should fail with invalid options: path null", async () => {
            try {
                const data = await client.request({
                    path: null,
                    method: "get",
                });
            } catch (error) {
                logger.debug("invalid options error", error);
                expect(error).to.be.an.instanceof(BillingLogixApiError);
            }
        });

        it("promise: should fail with invalid options: path undefined", async () => {
            try {
                const data = await client.request({
                    method: "get",
                });
            } catch (error) {
                logger.debug("invalid options error", error);
                expect(error).to.be.an.instanceof(BillingLogixApiError);
            }
        });

        it("promise: should fail with invalid options: path only /", async () => {
            try {
                const data = await client.request({
                    path: "/",
                    method: "get",
                });
            } catch (error) {
                logger.debug("invalid options error", error);
                expect(error).to.be.an.instanceof(BillingLogixApiError);
            }
        });

        it("promise: should fail with invalid options: timeout invalid", async () => {
            try {
                const data = await client.request({
                    path: "/tags",
                    method: "get",
                    timeout: "invalid",
                });
            } catch (error) {
                logger.debug("invalid options error", error);
                expect(error).to.be.an.instanceof(BillingLogixApiError);
            }
        });

        it("promise: should fail with invalid options: timeout too low", async () => {
            try {
                const data = await client.request({
                    path: "/tags",
                    method: "get",
                    timeout: 500,
                });
            } catch (error) {
                logger.debug("invalid options error", error);
                expect(error).to.be.an.instanceof(BillingLogixApiError);
            }
        });

        it("promise: should fail with invalid options: timeout too high", async () => {
            try {
                const data = await client.request({
                    path: "/tags",
                    method: "get",
                    timeout: 60001,
                });
            } catch (error) {
                logger.debug("invalid options error", error);
                expect(error).to.be.an.instanceof(BillingLogixApiError);
            }
        });

        it("promise: should fail with invalid options: query invalid", async () => {
            try {
                const data = await client.request({
                    path: "/tags",
                    method: "get",
                    query: "invalid",
                });
            } catch (error) {
                logger.debug("invalid options error", error);
                expect(error).to.be.an.instanceof(BillingLogixApiError);
            }
        });

        it("promise: should succeed with all options", async () => {
            const data = await client.request({
                path: "/tags",
                method: "get",
                query: {
                    limit: 1,
                },
                timeout: 10000,
            });
            expect(data).to.have.length.greaterThan(0);
            // expect(data).to.have.length.equal(1);
        });
    });
});

describe("BillingLogixClient - Promises - Invalid Account", () => {
    describe("Promises - Request", () => {
        it("promise: should fail for invalid account", async () => {
            try {
                const client = new BillingLogixClient(
                    "no-sub",
                    "NOKEY",
                    "NOSECRET",
                    clientOptions
                );
                const data = await client.request({
                    path: "/tags",
                    method: "get",
                });
            } catch (error) {
                // logger.debug("invalid account error", error);
                expect(error).to.be.an.instanceof(Object);
                expect(error.message).to.equal("Forbidden");
            }
        });

        it("promise: should fail for invalid auth key", async () => {
            try {
                const client = new BillingLogixClient(
                    auth.sub,
                    "NOKEY",
                    "NOSECRET",
                    clientOptions
                );
                const data = await client.request({
                    path: "/tags",
                    method: "get",
                });
            } catch (error) {
                // logger.debug("invalid auth key error", error);
                expect(error).to.be.an.instanceof(Object);
                expect(error.statusCode).to.equal(401);
                expect(error.statusMessage).to.equal("Unauthorized");
                expect(error.data).to.be.an.instanceof(Object);
                expect(error.data.error).to.be.an.instanceof(Object);
                expect(error.data.error.name).to.equal("AuthenticationError");
            }
        });

        it("promise: should fail for invalid auth secret", async () => {
            try {
                const client = new BillingLogixClient(
                    auth.sub,
                    auth.key,
                    "NOSECRET",
                    clientOptions
                );
                const data = await client.request({
                    path: "/tags",
                    method: "get",
                });
            } catch (error) {
                // logger.debug("invalid auth secret error", error);
                expect(error).to.be.an.instanceof(Object);
                expect(error.statusCode).to.equal(401);
                expect(error.statusMessage).to.equal("Unauthorized");
                expect(error.data).to.be.an.instanceof(Object);
                expect(error.data.error).to.be.an.instanceof(Object);
                expect(error.data.error.name).to.equal("AuthenticationError");
            }
        });
    });
});

describe("BillingLogixClient - Callbacks - Methods", () => {
    let client;

    beforeEach(() => {
        client = new BillingLogixClient(
            auth.sub,
            auth.key,
            auth.secret,
            clientOptions
        );
    });

    it("callback: methods: should get all tags", (done) => {
        client.get("/tags", {}, (error, data) => {
            logger.debug("getTags done", error, data?.length);
            expect(error).to.equal(null);
            expect(data).to.have.length.greaterThan(0);
            done();
        });
    });

    it("callback: methods: should get all tags with query", (done) => {
        client.get("/tags", { query: { limit: 1 } }, (error, data) => {
            logger.debug("getTags done", error, data?.length);
            expect(error).to.equal(null);
            expect(data).to.have.length.greaterThan(0);
            // expect(data).to.have.length.equal(1);
            done();
        });
    });

    it("callback: methods: should get all tags with query and timeout", (done) => {
        client.get(
            "/tags",
            { query: { limit: 1 }, timeout: 10000 },
            (error, data) => {
                logger.debug("getTags done", error, data?.length);
                expect(error).to.equal(null);
                expect(data).to.have.length.greaterThan(0);
                // expect(data).to.have.length.equal(1);
                done();
            }
        );
    });

    it("callback: methods: should get a tag that doesn't exist", (done) => {
        client.get(`/tags/${uuidv4()}`, {}, (error, data) => {
            logger.debug("getTag done", error, data);
            expect(data).to.equal(undefined);
            expect(error).to.be.an.instanceof(Object);
            expect(error.statusCode).to.equal(404);
            expect(error.statusMessage).to.equal("Not Found");
            expect(error).to.be.an.instanceof(Object);
            expect(error.data).to.be.an.instanceof(Object);
            expect(error.data.error).to.be.an.instanceof(Object);
            expect(error.data.error.name).to.equal("NotFound");
            done();
        });
    });

    it("callback: methods: should update a tag that doesn't exist", (done) => {
        client.put(
            `/tags/${uuidv4()}`,
            { label: `Test Invalid Tag`, color: "#000000" },
            {},
            (error, data) => {
                logger.debug("updateTag done", error, data);
                expect(data).to.equal(undefined);
                expect(error).to.be.an.instanceof(Object);
                expect(error.statusCode).to.equal(404);
                expect(error.statusMessage).to.equal("Not Found");
                expect(error).to.be.an.instanceof(Object);
                expect(error.data).to.be.an.instanceof(Object);
                expect(error.data.error).to.be.an.instanceof(Object);
                expect(error.data.error.name).to.equal("NotFound");
                done();
            }
        );
    });

    it("callback: methods: should delete a tag that doesn't exist", (done) => {
        client.delete(`/tags/${uuidv4()}`, {}, (error, data) => {
            logger.debug("deleteTag done", error, data);
            expect(data).to.equal(undefined);
            expect(error).to.be.an.instanceof(Object);
            expect(error.statusCode).to.equal(404);
            expect(error.statusMessage).to.equal("Not Found");
            expect(error).to.be.an.instanceof(Object);
            expect(error.data).to.be.an.instanceof(Object);
            expect(error.data.error).to.be.an.instanceof(Object);
            expect(error.data.error.name).to.equal("NotFound");
            done();
        });
    });

    it("callback: methods: should create, update, and delete a tag", (done) => {
        const rand = uuidv4().split("-")[0];
        const tag = {
            name: `test-tag-${rand}`,
            label: `Test Tag ${rand}`,
            color: "#000000",
        };

        client.post("/tags", tag, {}, (error, data) => {
            logger.debug("createTag done", error, data);
            expect(error).to.equal(null);
            expect(data).to.be.an.instanceof(Object);
            expect(data.name).to.equal(tag.name);
            expect(data.label).to.equal(tag.label);
            expect(data.color).to.equal(tag.color);

            const tagId = data.id;
            const updateTag = {
                label: `Test Tag ${rand} 2`,
                color: "#000002",
            };

            client.put(`/tags/${tagId}`, updateTag, {}, (error, data) => {
                logger.debug("updateTag done", error, data);
                expect(error).to.equal(null);
                expect(data).to.be.an.instanceof(Object);
                expect(data.name).to.equal(tag.name);
                expect(data.label).to.equal(updateTag.label);
                expect(data.color).to.equal(updateTag.color);

                client.delete(`/tags/${tagId}`, {}, (error, data) => {
                    logger.debug("deleteTag done", error, data);
                    expect(error).to.equal(null);
                    expect(data).to.be.an.instanceof(Object);
                    expect(data.success).to.equal(true);
                    done();
                });
            });
        });
    });
});

describe("BillingLogixClient - Promises - Methods", () => {
    let client;

    beforeEach(() => {
        client = new BillingLogixClient(
            auth.sub,
            auth.key,
            auth.secret,
            clientOptions
        );
    });

    it("promise: methods: should get all tags", async () => {
        const data = await client.get("/tags", {});
        expect(data).to.have.length.greaterThan(0);
    });

    it("promise: methods: should get all tags with query", async () => {
        const data = await client.get("/tags", { query: { limit: 1 } });
        expect(data).to.have.length.greaterThan(0);
        // expect(data).to.have.length.equal(1);
    });

    it("promise: methods: should get all tags with query and timeout", async () => {
        const data = await client.get("/tags", {
            query: { limit: 1 },
            timeout: 10000,
        });
        expect(data).to.have.length.greaterThan(0);
        // expect(data).to.have.length.equal(1);
    });

    it("promise: methods: should get a tag that doesn't exist", async () => {
        try {
            const data = await client.get(`/tags/${uuidv4()}`, {});
        } catch (error) {
            logger.debug("getTag error", error);
            expect(error).to.be.an.instanceof(Object);
            expect(error.statusCode).to.equal(404);
            expect(error.statusMessage).to.equal("Not Found");
            expect(error).to.be.an.instanceof(Object);
            expect(error.data).to.be.an.instanceof(Object);
            expect(error.data.error).to.be.an.instanceof(Object);
            expect(error.data.error.name).to.equal("NotFound");
        }
    });

    it("promise: methods: should update a tag that doesn't exist", async () => {
        try {
            const data = await client.put(
                `/tags/${uuidv4()}`,
                { label: `Test Invalid Tag`, color: "#000000" },
                {}
            );
        } catch (error) {
            logger.debug("updateTag error", error);
            expect(error).to.be.an.instanceof(Object);
            expect(error.statusCode).to.equal(404);
            expect(error.statusMessage).to.equal("Not Found");
            expect(error).to.be.an.instanceof(Object);
            expect(error.data).to.be.an.instanceof(Object);
            expect(error.data.error).to.be.an.instanceof(Object);
            expect(error.data.error.name).to.equal("NotFound");
        }
    });

    it("promise: methods: should delete a tag that doesn't exist", async () => {
        try {
            const data = await client.delete(`/tags/${uuidv4()}`, {});
        } catch (error) {
            logger.debug("deleteTag error", error);
            expect(error).to.be.an.instanceof(Object);
            expect(error.statusCode).to.equal(404);
            expect(error.statusMessage).to.equal("Not Found");
            expect(error).to.be.an.instanceof(Object);
            expect(error.data).to.be.an.instanceof(Object);
            expect(error.data.error).to.be.an.instanceof(Object);
            expect(error.data.error.name).to.equal("NotFound");
        }
    });

    it("promise: methods: should create, update, and delete a tag", async () => {
        const rand = uuidv4().split("-")[0];
        const tag = {
            name: `test-tag-${rand}`,
            label: `Test Tag ${rand}`,
            color: "#000000",
        };

        const createTag = await client.post("/tags", tag, {});
        expect(createTag).to.be.an.instanceof(Object);
        expect(createTag.name).to.equal(tag.name);
        expect(createTag.label).to.equal(tag.label);
        expect(createTag.color).to.equal(tag.color);

        const tagId = createTag.id;
        const updateTag = {
            label: `Test Tag ${rand} 2`,
            color: "#000002",
        };

        const updateTagData = await client.put(`/tags/${tagId}`, updateTag, {});
        expect(updateTagData).to.be.an.instanceof(Object);
        expect(updateTagData.name).to.equal(tag.name);
        expect(updateTagData.label).to.equal(updateTag.label);
        expect(updateTagData.color).to.equal(updateTag.color);

        const deleteTagData = await client.delete(`/tags/${tagId}`, {});
        expect(deleteTagData).to.be.an.instanceof(Object);
        expect(deleteTagData.success).to.equal(true);
    });
});
