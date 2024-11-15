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
  describe("register new user testing", () => {
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
            picture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
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
    test("POST new user 201: the password is stored as a secured hash", () => {
      return request(app)
        .post("/api/users")
        .send({ name: "Jeff B", email: "jeffyB@amazon.com", password: "hello", age: 54 })
        .expect(201)
        .then(({ body }) => {
          expect(body.user.password).not.toBe("hello");
        });
    });
    test("POST new user 201: adding a user generates a jwt for authentication", () => {
      return request(app)
        .post("/api/users")
        .send({ name: "Jeff B", email: "jeffyB@amazon.com", password: "hello", age: 54 })
        .expect(201)
        .then(({ body }) => {
          expect(typeof body.user.token).toBe("string");
        });
    });
    test("POST new user 200: if the user tries to register with an existing email they will be informed", () => {
      return request(app)
        .post("/api/users")
        .send({ name: "will", email: "willfossard@outlook.com", password: "hello", age: 54 })
        .expect(200)
        .then(({ body }) => {
          expect(body.message).toBe("A user already exists with that email address. Please log in or try again");
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
    test("POST new user 400: responds with a bad request error if required information is the wrong data type", () => {
      return request(app)
        .post("/api/users")
        .send({ name: {}, email: "jeffyB@amazon.com", password: "hello", age: 54 })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Bad Request: Incorrect datatype provided");
        });
    });
  });
  describe.only("sign in and authorise user testing", () => {
    test("POST login 201: returns the user object that has just signed in if email and password are correct", () => {
      return request(app)
        .post("/api/users/login")
        .send({ email: "willfossard@outlook.com", password: "password123" })
        .expect(201)
        .then(({ body }) => {
          expect(body.user).toMatchObject({
            _id: expect.any(String),
            name: "will fossard",
            email: "willfossard@outlook.com",
            password: expect.any(String),
            picture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
            token: expect.any(String),
          });
        });
    });
    test("POST login 201: any additional information is ignored in a post request", () => {
      return request(app)
        .post("/api/users/login")
        .send({ email: "willfossard@outlook.com", password: "password123", age: 99 })
        .expect(201)
        .then(({ body }) => {
          expect(body.user.hasOwnProperty("age")).toBe(false);
        });
    });
    test("POST login 401: responds with an unauthorised message if the user attempts to log in and does not match valid email address", () => {
      return request(app)
        .post("/api/users/login")
        .send({ email: "invalidemail@invalidemail.com", password: "password" })
        .expect(401)
        .then(({ body }) => {
          expect(body.message).toBe("Invalid email address or password");
        });
    });
    test("POST login 401: responds with an unauthorised message if the user attempts to log in and provides an incorrect pasword", () => {
      return request(app)
        .post("/api/users/login")
        .send({ email: "willfossard@outlook.com", password: "wrongPassword" })
        .expect(401)
        .then(({ body }) => {
          expect(body.message).toBe("Invalid email address or password");
        });
    });
    test("Post login 400: responds with a bad request message if all the data is not provided in the login", () => {
      return request(app)
        .post("/api/users/login")
        .send({ email: "willfossard@outlook.com" })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Both email and password are required");
        });
    });
  });
});
