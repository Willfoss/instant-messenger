const { getSender } = require("../chatLogic");

describe("getSender testing", () => {
  test("returns an empty object when passed an empty array and empty object", () => {
    expect(getSender({}, [])).toEqual({});
  });
  test("returns the user who is not logged in", () => {
    const loggedInUser = {
      _id: 123,
      name: "bob",
    };

    const usersArray = [
      { _id: 123, name: "bob" },
      { _id: 789, name: "will" },
    ];

    expect(getSender(loggedInUser, usersArray)).toBe("will");
  });
  test("original object / array is not mutated during function exection", () => {
    const loggedInUser = {
      _id: 123,
      name: "bob",
    };
    const usersArray = [
      { _id: 123, name: "bob" },
      { _id: 789, name: "will" },
    ];

    const loggedInUserCopy = {
      _id: 123,
      name: "bob",
    };
    const usersArrayCopy = [
      { _id: 123, name: "bob" },
      { _id: 789, name: "will" },
    ];

    getSender(loggedInUser, usersArray);

    expect(loggedInUser).toEqual(loggedInUserCopy);
    expect(usersArrayCopy).toEqual(usersArrayCopy);
  });
});
