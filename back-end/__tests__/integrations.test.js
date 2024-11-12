const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const { seed } = require("../db/seed");
const { usersModel } = require("../models/user-model");

beforeEach(() => seed());

afterAll(() => {
  mongoose.connection.close();
});

describe("test test", () => {
  test("blah", () => {
    return request(app)
      .post("/api/users")
      .send({ firstName: "Jeff", lastName: "bezos", email: "jeffyB@outlook.com", password: "hello" })
      .expect(201)
      .then(({ body }) => {
        console.log(body);
      });
    k;
  });
});
