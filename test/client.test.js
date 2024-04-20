const BillingLogixClient = require("../src/index");
const { BillingLogixApiError } = require("../src/lib/errors");

require("dotenv").config();
const auth = {
    sub: process.env.ACCOUNT_SUB,
    key: process.env.ACCESS_KEY,
    secret: process.env.SECRET_KEY,
};
console.log("Auth Details", auth);

describe("Initialization", () => {
    it("should fail for no auth", function () {
        expect(function () {
            const blx = new BillingLogixClient(null, null, null);
        }).toThrow(BillingLogixApiError);
    });

    it("should fail for invalid api key and secret", function () {
        expect(function () {
            const blx = new BillingLogixClient(auth.sub);
        }).toThrow(BillingLogixApiError);
    });

    it("should fail for invalid api secret", function () {
        expect(function () {
            const blx = new BillingLogixClient(auth.sub, auth.key);
        }).toThrow(BillingLogixApiError);
    });

    it("should work for all valid auth", function () {
        const blx = new BillingLogixClient(auth.sub, auth.key, auth.secret);
        expect(blx).toBeInstanceOf(BillingLogixClient);
    });
});

describe("BillingLogixClient", () => {
    let client;

    beforeEach(() => {
        client = new BillingLogixClient(
            process.env.ACCOUNT_SUB,
            process.env.ACCESS_KEY,
            process.env.SECRET_KEY
        );
    });

    describe("request", () => {
        it("should make a request", (done) => {
            const request = client.request(
                {
                    path: "/tags",
                    method: "get",
                },
                (error, data) => {
                    expect(error).toBeNull();
                    expect(data).toEqual({ message: "test" });
                    done();
                }
            );

            request.write(JSON.stringify({ message: "test" }));
            request.end();
        });
    });
});
