import supertest from "supertest";
import { app } from "../../app";

describe("GET /users - list all users", () => {
    it("Simple listing", (done) => {
        supertest(app)
                .get("/api/users")
                .set("Accept", "application/json")
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(200, done);
    });
});
