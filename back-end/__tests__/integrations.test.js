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
            email: "jeffyb@amazon.com",
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
            email: "jeffyb@amazon.com",
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
  describe("access to chats and one on one chat testing", () => {
    let jwt = "";
    let chatHazelUserId = "";
    let chatFosterUserId = "";
    let chatBobUserId = "";

    //log user in
    beforeEach(() => {
      return request(app)
        .post("/api/users/login")
        .send({ email: "willfossard@outlook.com", password: "password123" })
        .then(({ body }) => {
          jwt = body.user.token;
          loggedInUserId = body.user._id;
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
    //get will foster before every test
    beforeEach(() => {
      return request(app)
        .get("/api/users?search=foster")
        .set({ authorization: `Bearer ${jwt}` })
        .then(({ body }) => {
          chatFosterUserId = body.users[0]._id;
        });
    });

    beforeEach(() => {
      return request(app)
        .get("/api/users?search=bob")
        .set({ authorization: `Bearer ${jwt}` })
        .then(({ body }) => {
          chatBobUserId = body.users[0]._id;
        });
    });

    //create a pre-existing chat before every test
    beforeEach(() => {
      return request(app)
        .post("/api/chats")
        .send({ user_id: chatHazelUserId })
        .set({ authorization: `Bearer ${jwt}` })
        .then(({ body }) => {
          chat1_id = body.chat._id;
        });
    });

    //create a second pre-exisitng chat before every test
    beforeEach(() => {
      return request(app)
        .post("/api/chats")
        .send({ user_id: chatFosterUserId })
        .set({ authorization: `Bearer ${jwt}` })
        .then(({ body }) => {
          chat2_id = body.chat._id;
        });
    });

    describe("get access to chat testing", () => {
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
      test("POST chat 401: returns an unauthorised message if no user logged in", () => {
        return request(app)
          .post("/api/chats")
          .send({})
          .expect(401)
          .then(({ body }) => {
            expect(body.message).toBe("User not authorised");
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

    describe("GET all chats for user with chats testing", () => {
      test("GET chats 200: responds with all chats for a user", () => {
        return request(app)
          .get("/api/chats")
          .set({ authorization: `Bearer ${jwt}` })
          .expect(200)
          .then(({ body }) => {
            expect(body.chats.length).toBe(2);
            body.chats.forEach((chat) => {
              expect(chat).toMatchObject({
                _id: expect.any(String),
                chatName: "sender",
                isGroupChat: false,
                users: [
                  {
                    _id: loggedInUserId,
                    name: "will fossard",
                    email: "willfossard@outlook.com",
                    picture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                  },
                  {
                    _id: expect.any(String),
                    name: expect.any(String),
                    email: expect.any(String),
                    picture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                  },
                ],
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
              });
            });
          });
      });

      test("GET chat 401: returns unauthorised message if user is not logged in", () => {
        return request(app)
          .get("/api/chats")
          .expect(401)
          .then(({ body }) => {
            expect(body.message).toBe("User not authorised");
          });
      });
    });

    describe("GET all chats for user with no chats testing", () => {
      beforeEach(() => {
        return request(app)
          .post("/api/users/login")
          .send({ email: "bob_marley@outlook.com", password: "password234" })
          .then(({ body }) => {
            jwt = body.user.token;
            loggedInUserId = body.user._id;
          });
      });
      test("GET chat 200: returns an empty array if user exists but no chats exist", () => {
        return request(app)
          .get("/api/chats")
          .set({ authorization: `Bearer ${jwt}` })
          .expect(200)
          .then(({ body }) => {
            expect(body.chats.length).toBe(0);
            expect(body.chats).toEqual([]);
          });
      });
    });
    describe("POST new message to one-on-one chat testing", () => {
      beforeEach(() => {
        return request(app)
          .post("/api/users/login")
          .send({ email: "willfossard@outlook.com", password: "password123" })
          .then(({ body }) => {
            jwt = body.user.token;
            loggedInUserId = body.user._id;
          });
      });

      beforeEach(() => {
        return request(app)
          .post("/api/chats")
          .send({ user_id: chatHazelUserId })
          .set({ authorization: `Bearer ${jwt}` })
          .then(({ body }) => {
            chat1_id = body.chat._id;
          });
      });

      test("POST message 201: responds with the message object that was just posted", () => {
        return request(app)
          .post("/api/messages")
          .send({ message: "hey there", chat_id: chat1_id })
          .set({ authorization: `Bearer ${jwt}` })
          .expect(201)
          .then(({ body }) => {
            expect(body.message).toMatchObject({
              sender: {
                name: "will fossard",
                picture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
              },
              content: "hey there",
              chat: {
                _id: chat1_id,
                chatName: expect.any(String),
                isGroupChat: expect.any(Boolean),
                users: [
                  { name: "will fossard", email: "willfossard@outlook.com", picture: expect.any(String) },
                  { name: "will hazel", email: "hazel@email.com", picture: expect.any(String) },
                ],
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
              },
              _id: expect.any(String),
            });
          });
      });
      test("POST message 201: ignores any extra information sent in the request", () => {
        return request(app)
          .post("/api/messages")
          .send({ message: "hey there", chat_id: chat1_id, name: "bob" })
          .set({ authorization: `Bearer ${jwt}` })
          .expect(201)
          .then(({ body }) => {
            expect(body.message.hasOwnProperty("name")).toBe(false);
          });
      });
      test("POST message 201: updates the chats latest", () => {
        return request(app)
          .post("/api/messages")
          .send({ message: "hey there", chat_id: chat1_id })
          .set({ authorization: `Bearer ${jwt}` })
          .expect(201)
          .then(({ body }) => {
            return request(app)
              .get("/api/chats")
              .set({ authorization: `Bearer ${jwt}` })
              .expect(200);
          })
          .then(({ body }) => {
            expect(body.chats.length).toBe(2);

            expect(body.chats[0].latestMessage).toMatchObject({
              sender: {
                _id: loggedInUserId,
                email: "willfossard@outlook.com",
                name: "will fossard",
                picture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
              },
              content: "hey there",
              chat: expect.any(String),
              _id: expect.any(String),
            });
          });
      });
      test("POST message 400: sends a bad request if required information is missing from the body", () => {
        return request(app)
          .post("/api/messages")
          .send({ message: "hey there" })
          .set({ authorization: `Bearer ${jwt}` })
          .expect(400)
          .then(({ body }) => {
            expect(body.message.hasOwnProperty("name")).toBe(false);
          });
      });
      test("POST message 401: returns an unauthorised message if no user is not authorised to view the content", () => {
        return request(app)
          .post("/api/messages")
          .send({ message: "hey there", chat_id: chat1_id })
          .expect(401)
          .then(({ body }) => {
            expect(body.message).toBe("User not authorised");
          });
      });
    });
  });

  describe("group chats and messages testing", () => {
    let jwt = "";
    let chatBobUserId = "";
    let chatHazelUserId = "";
    let chatFosterUserId = "";
    let groupChatId = "";
    let singleChatId = "";
    let groupChatId2 = "";

    //log user in
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

    //get will foster before every test
    beforeEach(() => {
      return request(app)
        .get("/api/users?search=foster")
        .set({ authorization: `Bearer ${jwt}` })
        .then(({ body }) => {
          chatFosterUserId = body.users[0]._id;
        });
    });

    //create group before testing (this was added after testing the create a group testing)
    beforeEach(() => {
      return request(app)
        .post("/api/chats/groups")
        .send({ group_name: "test-group", users: [chatFosterUserId, chatBobUserId] })
        .set({ authorization: `Bearer ${jwt}` })
        .then(({ body }) => {
          groupChatId = body.groupChat._id;
        });
    });

    //create a one on one chat
    beforeEach(() => {
      return request(app)
        .post("/api/chats")
        .send({ user_id: chatFosterUserId })
        .set({ authorization: `Bearer ${jwt}` })
        .then(({ body }) => {
          singleChatId = body.chat._id;
        });
    });
    //create a second group chat with 4 members in it
    beforeEach(() => {
      return request(app)
        .post("/api/chats/groups")
        .send({ group_name: "test-group", users: [chatFosterUserId, chatBobUserId, chatHazelUserId] })
        .set({ authorization: `Bearer ${jwt}` })
        .then(({ body }) => {
          groupChatId2 = body.groupChat._id;
        });
    });
    describe("POST new group", () => {
      test("POST group 201: responds with the newly created group", () => {
        return request(app)
          .post("/api/chats/groups")
          .send({ group_name: "test-group", users: [chatHazelUserId, chatBobUserId] })
          .set({ authorization: `Bearer ${jwt}` })
          .expect(201)
          .then(({ body }) => {
            expect(body.groupChat).toMatchObject({
              chatName: "test-group",
              isGroupChat: true,
              users: [
                {
                  _id: chatHazelUserId,
                  name: "will hazel",
                  email: "hazel@email.com",
                  picture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                  createdAt: expect.any(String),
                  updatedAt: expect.any(String),
                },
                {
                  _id: chatBobUserId,
                  name: "bob marley",
                  email: "bob_marley@outlook.com",
                  picture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                  createdAt: expect.any(String),
                  updatedAt: expect.any(String),
                },
                {
                  _id: loggedInUserId,
                  name: "will fossard",
                  email: "willfossard@outlook.com",
                  picture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                  createdAt: expect.any(String),
                  updatedAt: expect.any(String),
                },
              ],
              groupAdmin: {
                _id: loggedInUserId,
                name: "will fossard",
                email: "willfossard@outlook.com",
                picture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
              },
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            });
          });
      });
      test("POST group 201: responds with the newly created group even if all the users already exist in a group with the same name", () => {
        return request(app)
          .post("/api/chats/groups")
          .send({ group_name: "test-group", users: [chatFosterUserId, chatBobUserId] })
          .set({ authorization: `Bearer ${jwt}` })
          .expect(201)
          .then(({ body }) => {
            expect(body.groupChat).toMatchObject({
              chatName: "test-group",
              isGroupChat: true,
              users: [
                {
                  _id: chatFosterUserId,
                  name: "will foster",
                  email: "willfoster@email.com",
                  picture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                  createdAt: expect.any(String),
                  updatedAt: expect.any(String),
                },
                {
                  _id: chatBobUserId,
                  name: "bob marley",
                  email: "bob_marley@outlook.com",
                  picture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                  createdAt: expect.any(String),
                  updatedAt: expect.any(String),
                },
                {
                  _id: loggedInUserId,
                  name: "will fossard",
                  email: "willfossard@outlook.com",
                  picture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                  createdAt: expect.any(String),
                  updatedAt: expect.any(String),
                },
              ],
              groupAdmin: {
                _id: loggedInUserId,
                name: "will fossard",
                email: "willfossard@outlook.com",
                picture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
              },
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            });
          });
      });

      test("POST groupchat 201: ignores any additional information sent in the post request", () => {
        return request(app)
          .post("/api/chats/groups")
          .send({
            group_name: "test-group",
            users: [chatHazelUserId, chatBobUserId],
            group_image: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
          })
          .set({ authorization: `Bearer ${jwt}` })
          .expect(201)
          .then(({ body }) => {
            expect(body.groupChat.hasOwnProperty("group-image")).toBe(false);
          });
      });
      test("POST groupchat 201: ignores any additional information sent in the post request", () => {
        return request(app)
          .post("/api/chats/groups")
          .send({
            group_name: "test-group",
            users: [chatHazelUserId, chatBobUserId],
            group_image: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
          })
          .set({ authorization: `Bearer ${jwt}` })
          .expect(201)
          .then(({ body }) => {
            expect(body.groupChat.hasOwnProperty("group-image")).toBe(false);
          });
      });
      test("POST groupchat 400: returns a bad request if missing a field in the post request", () => {
        return request(app)
          .post("/api/chats/groups")
          .send({
            group_name: "test-group",
          })
          .set({ authorization: `Bearer ${jwt}` })
          .expect(400)
          .then(({ body }) => {
            expect(body.message).toBe("All fields must be filled in");
          });
      });

      test("POST groupchat 400: returns a bad request group chat is attempted to be made with 2 users or less", () => {
        return request(app)
          .post("/api/chats/groups")
          .send({
            group_name: "test-group",
            users: [chatHazelUserId],
          })
          .set({ authorization: `Bearer ${jwt}` })
          .expect(400)
          .then(({ body }) => {
            expect(body.message).toBe("More than two users are required to create a group chat");
          });
      });
    });
    describe("PATCH groupname testing", () => {
      test("PATCH groupname 200: responds with the updated chat object upon successfull patch request", () => {
        return request(app)
          .patch("/api/chats/groups")
          .send({ group_id: groupChatId, group_name: "renaming-test" })
          .set({ authorization: `Bearer ${jwt}` })
          .expect(200)
          .then(({ body }) => {
            expect(body.groupChat).toMatchObject({
              chatName: "renaming-test",
              isGroupChat: true,
              users: [
                {
                  _id: chatFosterUserId,
                  name: "will foster",
                  email: "willfoster@email.com",
                  picture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                  createdAt: expect.any(String),
                  updatedAt: expect.any(String),
                },
                {
                  _id: chatBobUserId,
                  name: "bob marley",
                  email: "bob_marley@outlook.com",
                  picture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                  createdAt: expect.any(String),
                  updatedAt: expect.any(String),
                },
                {
                  _id: loggedInUserId,
                  name: "will fossard",
                  email: "willfossard@outlook.com",
                  picture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                  createdAt: expect.any(String),
                  updatedAt: expect.any(String),
                },
              ],
              groupAdmin: {
                _id: loggedInUserId,
                name: "will fossard",
                email: "willfossard@outlook.com",
                picture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
              },
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            });
          });
      });
      test("PATCH groupname 200: ignores any addition information put in the patch request", () => {
        return request(app)
          .patch("/api/chats/groups")
          .send({ group_id: groupChatId, group_name: "renaming-test", group_slug: "HEY" })
          .set({ authorization: `Bearer ${jwt}` })
          .expect(200)
          .then(({ body }) => {
            expect(body.groupChat).toMatchObject({
              chatName: "renaming-test",
              isGroupChat: true,
              users: [
                {
                  _id: chatFosterUserId,
                  name: "will foster",
                  email: "willfoster@email.com",
                  picture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                  createdAt: expect.any(String),
                  updatedAt: expect.any(String),
                },
                {
                  _id: chatBobUserId,
                  name: "bob marley",
                  email: "bob_marley@outlook.com",
                  picture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                  createdAt: expect.any(String),
                  updatedAt: expect.any(String),
                },
                {
                  _id: loggedInUserId,
                  name: "will fossard",
                  email: "willfossard@outlook.com",
                  picture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                  createdAt: expect.any(String),
                  updatedAt: expect.any(String),
                },
              ],
              groupAdmin: {
                _id: loggedInUserId,
                name: "will fossard",
                email: "willfossard@outlook.com",
                picture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
              },
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            });
            expect(body.groupChat.hasOwnProperty("group_slug")).toBe(false);
          });
      });
      test("PATCH groupname 401: cannot create group chat if user is not authorised", () => {
        return request(app)
          .patch("/api/chats/groups")
          .send({ group_id: groupChatId, group_name: "renaming-test" })
          .expect(401)
          .then(({ body }) => {
            expect(body.message).toBe("User not authorised");
          });
      });
      test("PATCH groupname 400: cannot modify chat name if chat is not a group chat", () => {
        return request(app)
          .patch("/api/chats/groups")
          .send({ group_id: singleChatId, group_name: "renaming-test" })
          .set({ authorization: `Bearer ${jwt}` })
          .expect(400)
          .then(({ body }) => {
            expect(body.message).toBe("Only a group chat can be renamed");
          });
      });
      test("PATCH groupname 400: returns bad request if information is missing from the request", () => {
        return request(app)
          .patch("/api/chats/groups")
          .send({ group_id: groupChatId })
          .set({ authorization: `Bearer ${jwt}` })
          .expect(400)
          .then(({ body }) => {
            expect(body.message).toBe("A group name and group id must be included");
          });
      });
      test("PATCH groupname 404: returns not found if no chat exists by that id yet", () => {
        return request(app)
          .patch("/api/chats/groups")
          .send({ group_id: "673c9f36eb8b08d1a8f58657", group_name: "renaming-test" })
          .set({ authorization: `Bearer ${jwt}` })
          .expect(404)
          .then(({ body }) => {
            expect(body.message).toBe("This group chat does not exist");
          });
      });
    });
    describe("PATCH add user to existing group testing", () => {
      test("PATCH add user to group chat 200: returns the updated group object when a new use is added", () => {
        return request(app)
          .patch("/api/chats/groups/add")
          .send({ group_chat_id: groupChatId, user_to_add: chatHazelUserId })
          .set({ authorization: `Bearer ${jwt}` })
          .expect(200)
          .then(({ body }) => {
            expect(body.groupChat.users.length).toBe(4);
            expect(body.groupChat).toMatchObject({
              chatName: "test-group",
              isGroupChat: true,
              users: [
                {
                  _id: chatFosterUserId,
                  name: "will foster",
                  email: "willfoster@email.com",
                  picture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                  createdAt: expect.any(String),
                  updatedAt: expect.any(String),
                },
                {
                  _id: chatBobUserId,
                  name: "bob marley",
                  email: "bob_marley@outlook.com",
                  picture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                  createdAt: expect.any(String),
                  updatedAt: expect.any(String),
                },
                {
                  _id: loggedInUserId,
                  name: "will fossard",
                  email: "willfossard@outlook.com",
                  picture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                  createdAt: expect.any(String),
                  updatedAt: expect.any(String),
                },
                {
                  _id: chatHazelUserId,
                  name: "will hazel",
                  email: "hazel@email.com",
                  picture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                  createdAt: expect.any(String),
                  updatedAt: expect.any(String),
                },
              ],
              groupAdmin: {
                _id: loggedInUserId,
                name: "will fossard",
                email: "willfossard@outlook.com",
                picture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
              },
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            });
          });
      });
      test("PATCH add user to group chat 200: ignores additional information sent in the reqest", () => {
        return request(app)
          .patch("/api/chats/groups/add")
          .send({ group_chat_id: groupChatId, user_to_add: chatHazelUserId, group_slug: "HEY" })
          .set({ authorization: `Bearer ${jwt}` })
          .expect(200)
          .then(({ body }) => {
            expect(body.groupChat).toMatchObject({
              chatName: "test-group",
              isGroupChat: true,
              users: [
                {
                  _id: chatFosterUserId,
                  name: "will foster",
                  email: "willfoster@email.com",
                  picture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                  createdAt: expect.any(String),
                  updatedAt: expect.any(String),
                },
                {
                  _id: chatBobUserId,
                  name: "bob marley",
                  email: "bob_marley@outlook.com",
                  picture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                  createdAt: expect.any(String),
                  updatedAt: expect.any(String),
                },
                {
                  _id: loggedInUserId,
                  name: "will fossard",
                  email: "willfossard@outlook.com",
                  picture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                  createdAt: expect.any(String),
                  updatedAt: expect.any(String),
                },
                {
                  _id: chatHazelUserId,
                  name: "will hazel",
                  email: "hazel@email.com",
                  picture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                  createdAt: expect.any(String),
                  updatedAt: expect.any(String),
                },
              ],
              groupAdmin: {
                _id: loggedInUserId,
                name: "will fossard",
                email: "willfossard@outlook.com",
                picture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
              },
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            });
            expect(body.groupChat.hasOwnProperty("group_slug")).toBe(false);
          });
      });
      test("PATCH add user to group chat 401: cannot manipulate group chat members chat if user is not authorised", () => {
        return request(app)
          .patch("/api/chats/groups/add")
          .send({ group_chat_id: groupChatId, user_to_add: chatHazelUserId })
          .expect(401)
          .then(({ body }) => {
            expect(body.message).toBe("User not authorised");
          });
      });
      test("PATCH add user to group chat 400: cannot modify group members if chat is not a group chat", () => {
        return request(app)
          .patch("/api/chats/groups/add")
          .send({ group_chat_id: singleChatId, user_to_add: chatHazelUserId })
          .set({ authorization: `Bearer ${jwt}` })
          .expect(400)
          .then(({ body }) => {
            expect(body.message).toBe("Only a group chat can add users");
          });
      });
      test("PATCH add user to group chat 400: returns bad request if information is missing from the request", () => {
        return request(app)
          .patch("/api/chats/groups/add")
          .send({ group_chat_id: groupChatId })
          .set({ authorization: `Bearer ${jwt}` })
          .expect(400)
          .then(({ body }) => {
            expect(body.message).toBe("Must provide both users to add and the chat id");
          });
      });
      test("PATCH add user to group chat 404: returns not found if no chat exists by that id yet", () => {
        return request(app)
          .patch("/api/chats/groups/add")
          .send({ group_chat_id: "673c9f36eb8b08d1a8f58650", user_to_add: chatHazelUserId })
          .set({ authorization: `Bearer ${jwt}` })
          .expect(404)
          .then(({ body }) => {
            expect(body.message).toBe("This group chat does not exist");
          });
      });
    });

    //+++++++++++++++++++++++++++++++++++++++++++
    describe("PATCH remove user from existing group chat", () => {
      test("PATCH remove user from group chat 200: returns the updated group object when a user is deleted from a group chat", () => {
        return request(app)
          .patch("/api/chats/groups/remove")
          .send({ group_chat_id: groupChatId2, user_to_remove: chatHazelUserId })
          .set({ authorization: `Bearer ${jwt}` })
          .expect(200)
          .then(({ body }) => {
            expect(body.groupChat.users.length).toBe(3);
            expect(body.groupChat).toMatchObject({
              chatName: "test-group",
              isGroupChat: true,
              users: [
                {
                  _id: chatFosterUserId,
                  name: "will foster",
                  email: "willfoster@email.com",
                  picture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                  createdAt: expect.any(String),
                  updatedAt: expect.any(String),
                },
                {
                  _id: chatBobUserId,
                  name: "bob marley",
                  email: "bob_marley@outlook.com",
                  picture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                  createdAt: expect.any(String),
                  updatedAt: expect.any(String),
                },
                {
                  _id: loggedInUserId,
                  name: "will fossard",
                  email: "willfossard@outlook.com",
                  picture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                  createdAt: expect.any(String),
                  updatedAt: expect.any(String),
                },
              ],
              groupAdmin: {
                _id: loggedInUserId,
                name: "will fossard",
                email: "willfossard@outlook.com",
                picture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
              },
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            });
          });
      });
      test("PATCH remove user from group chat 200: ignores any additional information sent in the request", () => {
        return request(app)
          .patch("/api/chats/groups/remove")
          .send({ group_chat_id: groupChatId2, user_to_remove: chatHazelUserId, group_slug: "HEY" })
          .set({ authorization: `Bearer ${jwt}` })
          .expect(200)
          .then(({ body }) => {
            expect(body.groupChat.users.length).toBe(3);
            expect(body.groupChat).toMatchObject({
              chatName: "test-group",
              isGroupChat: true,
              users: [
                {
                  _id: chatFosterUserId,
                  name: "will foster",
                  email: "willfoster@email.com",
                  picture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                  createdAt: expect.any(String),
                  updatedAt: expect.any(String),
                },
                {
                  _id: chatBobUserId,
                  name: "bob marley",
                  email: "bob_marley@outlook.com",
                  picture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                  createdAt: expect.any(String),
                  updatedAt: expect.any(String),
                },
                {
                  _id: loggedInUserId,
                  name: "will fossard",
                  email: "willfossard@outlook.com",
                  picture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                  createdAt: expect.any(String),
                  updatedAt: expect.any(String),
                },
              ],
              groupAdmin: {
                _id: loggedInUserId,
                name: "will fossard",
                email: "willfossard@outlook.com",
                picture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
              },
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            });
            expect(body.groupChat.hasOwnProperty("group_slug")).toBe(false);
          });
      });
      test("PATCH remove user from group chat 401: cannot manipulate group chat members if user is not authorised", () => {
        return request(app)
          .patch("/api/chats/groups/remove")
          .send({ group_chat_id: groupChatId, user_to_remove: chatHazelUserId })
          .expect(401)
          .then(({ body }) => {
            expect(body.message).toBe("User not authorised");
          });
      });
      test("PATCH remove user from group chat 400: cannot modify group members if chat is not a group chat", () => {
        return request(app)
          .patch("/api/chats/groups/remove")
          .send({ group_chat_id: singleChatId, user_to_remove: chatHazelUserId })
          .set({ authorization: `Bearer ${jwt}` })
          .expect(400)
          .then(({ body }) => {
            expect(body.message).toBe("Only a group chat can remove users");
          });
      });
      test("PATCH emove user from group chat 400: returns bad request if information is missing from the request", () => {
        return request(app)
          .patch("/api/chats/groups/remove")
          .send({ group_chat_id: groupChatId2 })
          .set({ authorization: `Bearer ${jwt}` })
          .expect(400)
          .then(({ body }) => {
            expect(body.message).toBe("Must provide both user to remove and the chat id");
          });
      });
      test("PATCH groupname 404: returns not found if no chat exists by that id yet", () => {
        return request(app)
          .patch("/api/chats/groups/remove")
          .send({ group_chat_id: "673c9f36eb8b08d1a8f58650", user_to_remove: chatHazelUserId })
          .set({ authorization: `Bearer ${jwt}` })
          .expect(404)
          .then(({ body }) => {
            expect(body.message).toBe("This group chat does not exist");
          });
      });
    });
    describe("POST new message to group chat testing", () => {
      test("POST message 201: responds with the message object that was just posted", () => {
        return request(app)
          .post("/api/messages")
          .send({ message: "hey there", chat_id: groupChatId })
          .set({ authorization: `Bearer ${jwt}` })
          .expect(201)
          .then(({ body }) => {
            expect(body.message).toMatchObject({
              sender: {
                name: "will fossard",
                picture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
              },
              content: "hey there",
              chat: {
                _id: groupChatId,
                chatName: expect.any(String),
                isGroupChat: expect.any(Boolean),
                users: [
                  { name: "will foster", email: "willfoster@email.com", picture: expect.any(String) },
                  { name: "bob marley", email: "bob_marley@outlook.com", picture: expect.any(String) },
                  { name: "will fossard", email: "willfossard@outlook.com", picture: expect.any(String) },
                ],
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
              },
              _id: expect.any(String),
            });
          });
      });
      test("POST message 201: ignores any extra information sent in the request", () => {
        return request(app)
          .post("/api/messages")
          .send({ message: "hey there", chat_id: groupChatId, name: "bob" })
          .set({ authorization: `Bearer ${jwt}` })
          .expect(201)
          .then(({ body }) => {
            expect(body.message.hasOwnProperty("name")).toBe(false);
          });
      });
      test("POST message 201: updates the chats latest", () => {
        return request(app)
          .post("/api/messages")
          .send({ message: "hey there", chat_id: groupChatId })
          .set({ authorization: `Bearer ${jwt}` })
          .expect(201)
          .then(({ body }) => {
            return request(app)
              .get("/api/chats")
              .set({ authorization: `Bearer ${jwt}` })
              .expect(200);
          })
          .then(({ body }) => {
            expect(body.chats.length).toBe(3);
            expect(body.chats[0].latestMessage).toMatchObject({
              sender: {
                _id: loggedInUserId,
                email: "willfossard@outlook.com",
                name: "will fossard",
                picture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
              },
              content: "hey there",
              chat: expect.any(String),
              _id: expect.any(String),
            });
          });
      });
      test("POST message 400: sends a bad request if required information is missing from the body", () => {
        return request(app)
          .post("/api/messages")
          .send({ message: "hey there" })
          .set({ authorization: `Bearer ${jwt}` })
          .expect(400)
          .then(({ body }) => {
            expect(body.message.hasOwnProperty("name")).toBe(false);
          });
      });
      test("POST message 401: returns an unauthorised message if no user is not authorised to view the content", () => {
        return request(app)
          .post("/api/messages")
          .send({ message: "hey there", chat_id: groupChatId })
          .expect(401)
          .then(({ body }) => {
            expect(body.message).toBe("User not authorised");
          });
      });
    });
    describe("GET messages by chat_id testing", () => {
      let loggedInUserId2 = "";
      let loggedInUserId3 = "";
      let messageId1 = "";
      let messageId2 = "";
      let messageId3 = "";
      //create some messages in a chat
      beforeEach(() => {
        return request(app)
          .post("/api/messages")
          .send({ message: "what's up guys?", chat_id: groupChatId })
          .set({ authorization: `Bearer ${jwt}` })
          .then(({ body }) => {
            messageId1 = body.message._id;
          });
      });
      //deeper describe block to allow for another user to post
      describe("GET messages by chat_id testing. separate block to allow a message post from a second user", () => {
        //log in second user
        beforeEach(() => {
          return request(app)
            .post("/api/users/login")
            .send({ email: "bob_marley@outlook.com", password: "password234" })
            .then(({ body }) => {
              jwt = body.user.token;
              loggedInUserId2 = body.user._id;
            });
        });
        //create messages from second user
        beforeEach(() => {
          return request(app)
            .post("/api/messages")
            .send({ message: "not much, you?", chat_id: groupChatId })
            .set({ authorization: `Bearer ${jwt}` })
            .then(({ body }) => {
              messageId2 = body.message._id;
            });
        });
        describe("GET messages by chat_id testing. separate block to allow a message post from a third user", () => {
          //log in third user
          beforeEach(() => {
            return request(app)
              .post("/api/users/login")
              .send({ email: "willfoster@email.com", password: "password123" })
              .then(({ body }) => {
                jwt = body.user.token;
                loggedInUserId3 = body.user._id;
              });
          });
          //create messages from third user
          beforeEach(() => {
            return request(app)
              .post("/api/messages")
              .send({ message: "yeah all good buddy", chat_id: groupChatId })
              .set({ authorization: `Bearer ${jwt}` })
              .then(({ body }) => {
                messageId3 = body.message._id;
              });
          });

          test("GET messages by chat_id 200: returns all messages in a given chat id", () => {
            return request(app)
              .get(`/api/messages/${groupChatId}`)
              .set({ authorization: `Bearer ${jwt}` })
              .expect(200)
              .then(({ body }) => {
                expect(body.messages.length).toBe(3);
                expect(body.messages[0]).toMatchObject({
                  _id: messageId1,
                  sender: {
                    name: "will fossard",
                    email: "willfossard@outlook.com",
                    picture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                  },
                  content: "what's up guys?",
                  chat: {
                    _id: groupChatId,
                    chatName: "test-group",
                    isGroupChat: true,
                    users: [loggedInUserId3, loggedInUserId2, loggedInUserId],
                    groupAdmin: loggedInUserId,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                    latestMessage: messageId3,
                  },
                  createdAt: expect.any(String),
                  updatedAt: expect.any(String),
                });
                expect(body.messages[1]).toMatchObject({
                  _id: messageId2,
                  sender: {
                    name: "bob marley",
                    email: "bob_marley@outlook.com",
                    picture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                  },
                  content: "not much, you?",
                  chat: {
                    _id: groupChatId,
                    chatName: "test-group",
                    isGroupChat: true,
                    users: [loggedInUserId3, loggedInUserId2, loggedInUserId],
                    groupAdmin: loggedInUserId,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                    latestMessage: messageId3,
                  },
                  createdAt: expect.any(String),
                  updatedAt: expect.any(String),
                  createdAt: expect.any(String),
                  updatedAt: expect.any(String),
                });
                expect(body.messages[2]).toMatchObject({
                  _id: messageId3,
                  sender: {
                    name: "will foster",
                    email: "willfoster@email.com",
                    picture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                  },
                  content: "yeah all good buddy",
                  chat: {
                    _id: groupChatId,
                    chatName: "test-group",
                    isGroupChat: true,
                    users: [loggedInUserId3, loggedInUserId2, loggedInUserId],
                    groupAdmin: loggedInUserId,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                    latestMessage: messageId3,
                  },
                  createdAt: expect.any(String),
                  updatedAt: expect.any(String),
                  createdAt: expect.any(String),
                  updatedAt: expect.any(String),
                });
              });
          });
          test("GET messages by chat_id 200: returns all messages in a given chat id", () => {
            return request(app)
              .get(`/api/messages/${groupChatId}`)
              .expect(401)
              .then(({ body }) => {
                expect(body.message).toBe("User not authorised");
              });
          });
        });
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
