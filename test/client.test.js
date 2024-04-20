import { BillingLogixClient } from "../src/index.js";
import { BillingLogixApiError } from "../src/lib/errors.js";
import { expect } from "chai";

import dotenv from "dotenv";
dotenv.config();

const auth = {
    sub: process.env.ACCOUNT_SUB,
    key: process.env.ACCESS_KEY,
    secret: process.env.SECRET_KEY,
};
const clientOptions = {
    debug: true,
};
// console.debug("Auth Details", auth, clientOptions);

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
                    console.log("callback request done", error, data?.length);
                    expect(error).to.equal(null);
                    expect(data).to.have.length.greaterThan(0);
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
