const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const { seed } = require("../db/seed");
const { usersModel } = require("../models/user-model");

beforeEach(() => seed());

afterAll(() => {
  mongoose.connection.close();
});

describe("back end testing", () => {
  describe("user testing", () => {
    test("POST new user 201: responds with a the user that was just created", () => {
      return request(app)
        .post("/api/users")
        .send({ name: "Jeff B", email: "jeffyB@amazon.com", password: "hello" })
        .expect(201)
        .then(({ body }) => {
          expect(body.user).toMatchObject({
            _id: expect.any(String),
            name: "Jeff B",
            email: "jeffyB@amazon.com",
            password: expect.any(String),
          });
        });
    });
    test("POST new user 201: the post request ignores any additional information", () => {
      return request(app)
        .post("/api/users")
        .send({ name: "Jeff B", email: "jeffyB@amazon.com", password: "hello", age: 54 })
        .expect(201)
        .then(({ body }) => {
          expect(body.user).toMatchObject({
            _id: expect.any(String),
            name: "Jeff B",
            email: "jeffyB@amazon.com",
            password: expect.any(String),
          });
          expect(body.user.hasOwnProperty("age")).toBe(false);
        });
    });
    test("POST new user 400: responds with a bad request error if missing required information", () => {
      return request(app)
        .post("/api/users")
        .send({ name: "Jeff", password: "hello" })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Bad Request: name, email and password are all required");
        });
    });
  });
});
