import supertest from "supertest";
import { app } from "../../app";

describe("GET /user - list all users", () => {
    it("Get all users", (done) => {
        supertest(app)
                .get("/api/user")
                .set("Accept", "application/json")
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(200, done);
    });
    it("Get one user", (done) => {
        supertest(app)
            .get("/api/user/1")
            .set("Accept", "application/json")
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(200, done);
    });
});

describe("PUT /user - Add new user", () => {
    it("Add single user", (done) => {
        supertest(app)
            .put("/api/user")
            .send({email: "new-user@gmail.com", firstName: "user", lastName: "User"})
            .set("Accept", "application/json")
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect({id: 3})
            .expect(200, done);
    });
});

describe("DELETE /user - Delete existing user", () => {
    it("Delete single user", (done) => {
        supertest(app)
            .delete("/api/user/2")
            .set("Accept", "application/json")
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect({id: 2})
            .expect(200, done);
    });
    it("Try to Delete non existing user", (done) => {
        supertest(app)
            .delete("/api/user/-1")
            .set("Accept", "application/json")
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect({})
            .expect(200, done);
    });
});

describe("POST /user - Edit existing user's data", () => {
    it("Edit all info", (done) => {
        supertest(app)
            .post("/api/user/2")
            .send({email: "changed-email@gmail.com", firstName: "Changed-name", lastName: "Changed-last"})
            .set("Accept", "application/json")
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect({email: "changed-email@gmail.com", firstName: "Changed-name", id: 2, lastName: "Changed-last"})
            .expect(200, done);
    });
    it("Edit one property", (done) => {
        supertest(app)
            .post("/api/user/1")
            .send({email: "changed-email@gmail.com"})
            .set("Accept", "application/json")
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect({ email: "changed-email@gmail.com", firstName: "John",  id: 1, lastName: "Doe" })
            .expect(200, done);
    });
});
