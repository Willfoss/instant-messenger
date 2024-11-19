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
    test("POST new user 409: if the user tries to register with an existing email they will be informed", () => {
      return request(app)
        .post("/api/users")
        .send({ name: "will", email: "willfossard@outlook.com", password: "hello", age: 54 })
        .expect(409)
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
  describe("sign in and authorise user testing", () => {
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
  describe("GET all users testing", () => {
    let jwt = "";
    beforeEach(() => {
      return request(app)
        .post("/api/users/login")
        .send({ email: "willfossard@outlook.com", password: "password123" })
        .then(({ body }) => {
          jwt = body.user.token;
        });
    });

    test("GET 200: returns an array of user objects but does not include the user that is logged in", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .set({ authorization: `Bearer ${jwt}` })
        .then(({ body }) => {
          expect(body.users.length).toBe(4);
          body.users.forEach((user) => {
            expect(user).toMatchObject({
              name: expect.any(String),
              email: expect.any(String),
              password: expect.any(String),
              picture: expect.any(String),
            });
            expect(user.email).not.toBe("willfossard@outlook.com");
          });
        });
    });
    test("QUERY search GET 200: returns all results that include the search term in the name or email", () => {
      const search = "will";
      const regex = /will/;
      return request(app)
        .get(`/api/users?search=${search}`)
        .set({ authorization: `Bearer ${jwt}` })
        .expect(200)
        .then(({ body }) => {
          expect(body.users.length).toBe(2);
          body.users.forEach((user) => {
            expect(user).toMatchObject({
              name: expect.any(String),
              email: expect.any(String),
              password: expect.any(String),
              picture: expect.any(String),
            });
            const matches = regex.test(user.name) === true || regex.test(user.email) === true ? true : false;
            expect(matches).toBe(true);
          });
        });
    });
    test("QUERY search GET 401: responds with unauthorised message if no user logged in trying to access api", () => {
      return request(app)
        .get("/api/users?search=jakob")
        .expect(401)
        .then(({ body }) => {
          expect(body.message).toBe("User not authorised");
        });
    });
    test("QUERY search GET 404: responds with a not found if search term does not exist in either the name or email", () => {
      return request(app)
        .get("/api/users?search=jakob")
        .set({ authorization: `Bearer ${jwt}` })
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("No Users Found");
        });
    });
  });

  describe.only("get access to chat testing", () => {
    let jwt = "";
    let chatBobUserId = "";
    let chatHazelUserId = "";

    beforeEach(() => {
      return request(app)
        .post("/api/users/login")
        .send({ email: "willfossard@outlook.com", password: "password123" })
        .then(({ body }) => {
          jwt = body.user.token;
          loggedInUserId = body.user._id;
        });
    });
    //get bob id before every test
    beforeEach(() => {
      return request(app)
        .get("/api/users?search=bob")
        .set({ authorization: `Bearer ${jwt}` })
        .then(({ body }) => {
          chatBobUserId = body.users[0]._id;
        });
    });
    //get will hazel before every test
    beforeEach(() => {
      return request(app)
        .get("/api/users?search=hazel")
        .set({ authorization: `Bearer ${jwt}` })
        .then(({ body }) => {
          chatHazelUserId = body.users[0]._id;
        });
    });

    //create a pre-existing chat before every test
    beforeEach(() => {
      return request(app)
        .post("/api/chats")
        .send({ user_id: chatHazelUserId })
        .set({ authorization: `Bearer ${jwt}` });
    });

    test("POST chat 201: creates a chat object if chat does not yet exist", () => {
      return request(app)
        .post("/api/chats")
        .send({ user_id: chatBobUserId })
        .set({ authorization: `Bearer ${jwt}` })
        .expect(201)
        .then(({ body }) => {
          expect(body.chat).toMatchObject({
            _id: expect.any(String),
            chatName: "sender",
            isGroupChat: false,
            users: [
              {
                _id: loggedInUserId,
                name: "will fossard",
                email: "willfossard@outlook.com",
                picture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                __v: 0,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
              },
              {
                _id: chatBobUserId,
                name: "bob marley",
                email: "bob_marley@outlook.com",
                picture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                __v: 0,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
              },
            ],
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          });
        });
    });
    test("POST chat 201: returns chat object if chat already exists", () => {
      return request(app)
        .post("/api/chats")
        .send({ user_id: chatHazelUserId })
        .set({ authorization: `Bearer ${jwt}` })
        .expect(201)
        .then(({ body }) => {
          expect(body.chat).toMatchObject({
            _id: expect.any(String),
            chatName: "sender",
            isGroupChat: false,
            users: [
              {
                _id: loggedInUserId,
                name: "will fossard",
                email: "willfossard@outlook.com",
                picture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                __v: 0,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
              },
              {
                _id: chatHazelUserId,
                name: "will hazel",
                email: "hazel@email.com",
                picture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                __v: 0,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
              },
            ],
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          });
        });
    });
    test("POST chat 400: returns a bad request if no id sent with the request", () => {
      return request(app)
        .post("/api/chats")
        .send({})
        .set({ authorization: `Bearer ${jwt}` })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("User ID not sent with request");
        });
    });
    test("POST chat 404: returns a not found if no user with that id exists", () => {
      return request(app)
        .post("/api/chats")
        .send({ user_id: "123456678" })
        .set({ authorization: `Bearer ${jwt}` })
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("No user found");
        });
    });
  });

  describe("invalid api path testing", () => {
    test("404 invalid api path: responds with a message informing the user that the api path is invalid", () => {
      return request(app)
        .get("/api/invalid-api-path")
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("This path does not exist");
        });
    });
  });
});
