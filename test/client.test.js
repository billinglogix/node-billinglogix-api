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
console.debug("Auth Details", auth, clientOptions);

describe("Initialization", () => {
    it("should fail for no auth", function () {
        expect(function () {
            const blx = new BillingLogixClient(null, null, null);
        }).to.throw(BillingLogixApiError);
    });

    it("should fail for invalid api key and secret", function () {
        expect(function () {
            const blx = new BillingLogixClient(auth.sub);
        }).to.throw(BillingLogixApiError);
    });

    it("should fail for invalid api secret", function () {
        expect(function () {
            const blx = new BillingLogixClient(auth.sub, auth.key);
        }).to.throw(BillingLogixApiError);
    });

    it("should work for all valid auth", function () {
        const blx = new BillingLogixClient(auth.sub, auth.key, auth.secret);
        expect(blx).to.be.an.instanceof(BillingLogixClient);
    });
});

describe("BillingLogixClient", () => {
    let client;

    beforeEach(() => {
        client = new BillingLogixClient(
            process.env.ACCOUNT_SUB,
            process.env.ACCESS_KEY,
            process.env.SECRET_KEY,
            clientOptions
        );
    });

    describe("request", () => {
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

        it("promise: should make a request", async () => {
            const data = await client.request({
                path: "/tags",
                method: "get",
            });
            expect(data).to.have.length.greaterThan(0);
        });
    });
});
