const {
  getSender,
  getSenderFullDetails,
  isSameSender,
  isLastMessageOfUser,
  isFirstMessageOfUser,
  getTimeFromMessage,
  returnDate,
  hasDateChanged,
} = require("../chatLogic");

describe("getSender testing", () => {
  test("returns an empty object when passed an empty array and empty object", () => {
    expect(getSender({}, [])).toEqual({});
  });
  test("returns the user name who is not logged in", () => {
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

describe("getSenderFullDetails testing", () => {
  test("returns an empty object when passed an empty array and empty object", () => {
    expect(getSenderFullDetails({}, [])).toEqual({});
  });
  test("returns the full user who is not logged in", () => {
    const loggedInUser = {
      _id: 123,
      name: "bob",
      email: "bob_marley@outlook.com",
      picture: "some picture url",
    };

    const usersArray = [
      { _id: 123, name: "bob", email: "bob_marley@outlook.com", picture: "some picture url" },
      { _id: 789, name: "will", email: "willfossard@outlook.com", picture: "another picture url" },
    ];

    const expectedResult = { _id: 789, name: "will", email: "willfossard@outlook.com", picture: "another picture url" };

    expect(getSenderFullDetails(loggedInUser, usersArray)).toEqual(expectedResult);
  });
  test("original object / array is not mutated during function exection", () => {
    const loggedInUser = {
      _id: 123,
      name: "bob",
      email: "bob_marley@outlook.com",
      picture: "some picture url",
    };

    const usersArray = [
      { _id: 123, name: "bob", email: "bob_marley@outlook.com", picture: "some picture url" },
      { _id: 789, name: "will", email: "willfossard@outlook.com", picture: "another picture url" },
    ];

    const loggedInUserCopy = {
      _id: 123,
      name: "bob",
      email: "bob_marley@outlook.com",
      picture: "some picture url",
    };

    const usersArrayCopy = [
      { _id: 123, name: "bob", email: "bob_marley@outlook.com", picture: "some picture url" },
      { _id: 789, name: "will", email: "willfossard@outlook.com", picture: "another picture url" },
    ];

    getSenderFullDetails(loggedInUser, usersArray);

    expect(loggedInUser).toEqual(loggedInUserCopy);
    expect(usersArrayCopy).toEqual(usersArrayCopy);
  });
});

describe("isSameSender testing", () => {
  test("returns false if no messages in array", () => {
    expect(isSameSender([], "", 0, 123)).toBe(false);
  });
  test("returns true is message is by same sender", () => {
    const messages = [
      { sender: { _id: 123 }, content: "hello there", chat: { _id: 234 } },
      { sender: { _id: 123 }, content: "how are you?", chat: { _id: 234 } },
      { sender: { _id: 123 }, content: "how was your holiday?", chat: { _id: 234 } },
      { sender: { _id: 345 }, content: "???", chat: { _id: 234 } },
    ];
    const message = { sender: { _id: 123 }, content: "???", chat: { _id: 234 } };
    loggedInUserId = 789;
    index = 2;

    expect(isSameSender(messages, message, index, loggedInUserId)).toBe(true);
  });
  test("returns false is message is by different sender", () => {
    const messages = [
      { sender: { _id: 123 }, content: "hello there", chat: { _id: 234 } },
      { sender: { _id: 235 }, content: "hi mate", chat: { _id: 234 } },
      { sender: { _id: 235 }, content: "hi mate", chat: { _id: 234 } },
      { sender: { _id: 123 }, content: "yeaaah", chat: { _id: 234 } },
    ];
    const message = { sender: { _id: 235 }, content: "hi mate", chat: { _id: 234 } };
    loggedInUserId = 789;
    index = 1;

    expect(isSameSender(messages, message, index, loggedInUserId)).toBe(false);
  });

  test("messages array or message object are no mutated", () => {
    const messages = [
      { sender: { _id: 123 }, content: "hello there", chat: { _id: 234 } },
      { sender: { _id: 235 }, content: "hi mate", chat: { _id: 234 } },
      { sender: { _id: 123 }, content: "yeaaah", chat: { _id: 234 } },
    ];
    const message = { sender: { _id: 235 }, content: "hi mate", chat: { _id: 234 } };
    loggedInUserId = 789;
    index = 1;

    const messagesCopy = [
      { sender: { _id: 123 }, content: "hello there", chat: { _id: 234 } },
      { sender: { _id: 235 }, content: "hi mate", chat: { _id: 234 } },
      { sender: { _id: 123 }, content: "yeaaah", chat: { _id: 234 } },
    ];
    const messageCopy = { sender: { _id: 235 }, content: "hi mate", chat: { _id: 234 } };

    isSameSender(messages, message, index, loggedInUserId);

    expect(messages).toEqual(messagesCopy);
    expect(message).toEqual(messageCopy);
  });
});

describe("isLastMessageOfUser testing", () => {
  test("returns false if passed an empty array", () => {
    expect(isLastMessageOfUser([], 0, 123)).toBe(false);
  });
  test("returns true is message is last message by user", () => {
    const messages = [
      { sender: { _id: 123 }, content: "hello there", chat: { _id: 234 } },
      { sender: { _id: 123 }, content: "how are you?", chat: { _id: 234 } },
      { sender: { _id: 123 }, content: "how was your holiday?", chat: { _id: 234 } },
      { sender: { _id: 123 }, content: "???", chat: { _id: 234 } },
    ];
    loggedInUserId = 789;
    index = 3;

    expect(isLastMessageOfUser(messages, index, loggedInUserId)).toBe(true);
  });
  test("returns false is message is not the last message by user", () => {
    const messages = [
      { sender: { _id: 123 }, content: "hello there", chat: { _id: 234 } },
      { sender: { _id: 123 }, content: "how are you?", chat: { _id: 234 } },
      { sender: { _id: 123 }, content: "how was your holiday?", chat: { _id: 234 } },
      { sender: { _id: 123 }, content: "???", chat: { _id: 234 } },
    ];
    loggedInUserId = 789;
    index = 2;

    expect(isLastMessageOfUser(messages, index, loggedInUserId)).toBe(false);
  });
  test("returns true is message is the last message by user and chat has more messages in it", () => {
    const messages = [
      { sender: { _id: 123 }, content: "hello there", chat: { _id: 234 } },
      { sender: { _id: 123 }, content: "how are you?", chat: { _id: 234 } },
      { sender: { _id: 345 }, content: "how was your holiday?", chat: { _id: 234 } },
      { sender: { _id: 345 }, content: "???", chat: { _id: 234 } },
    ];
    loggedInUserId = 789;
    index = 3;

    expect(isLastMessageOfUser(messages, index, loggedInUserId)).toBe(true);
  });
  test("messages array is not mutated during execution", () => {
    const messages = [
      { sender: { _id: 123 }, content: "hello there", chat: { _id: 234 } },
      { sender: { _id: 123 }, content: "how are you?", chat: { _id: 234 } },
      { sender: { _id: 345 }, content: "how was your holiday?", chat: { _id: 234 } },
      { sender: { _id: 345 }, content: "???", chat: { _id: 234 } },
    ];
    const messagesCopy = [
      { sender: { _id: 123 }, content: "hello there", chat: { _id: 234 } },
      { sender: { _id: 123 }, content: "how are you?", chat: { _id: 234 } },
      { sender: { _id: 345 }, content: "how was your holiday?", chat: { _id: 234 } },
      { sender: { _id: 345 }, content: "???", chat: { _id: 234 } },
    ];
    loggedInUserId = 789;
    isLastMessageOfUser(messages, 2, loggedInUserId);

    expect(messages).toEqual(messagesCopy);
  });
});

describe("isfirstMessageOfUser testing", () => {
  test("returns false if passed an empty array", () => {
    expect(isFirstMessageOfUser([], 0, 123)).toBe(false);
  });
  test("returns true is message is first message by user", () => {
    const messages = [
      { sender: { _id: 123 }, content: "hello there", chat: { _id: 234 } },
      { sender: { _id: 123 }, content: "how are you?", chat: { _id: 234 } },
      { sender: { _id: 123 }, content: "how was your holiday?", chat: { _id: 234 } },
      { sender: { _id: 123 }, content: "???", chat: { _id: 234 } },
    ];
    loggedInUserId = 789;
    index = 0;

    expect(isFirstMessageOfUser(messages, index, loggedInUserId)).toBe(true);
  });
  test("returns false is message is not the first message by user", () => {
    const messages = [
      { sender: { _id: 123 }, content: "hello there", chat: { _id: 234 } },
      { sender: { _id: 123 }, content: "how are you?", chat: { _id: 234 } },
      { sender: { _id: 123 }, content: "how was your holiday?", chat: { _id: 234 } },
      { sender: { _id: 123 }, content: "???", chat: { _id: 234 } },
    ];
    loggedInUserId = 789;
    index = 2;

    expect(isFirstMessageOfUser(messages, index, loggedInUserId)).toBe(false);
  });
  test("returns true is message is the first message by user and false if its not when the chat has more messages in it", () => {
    const messages = [
      { sender: { _id: 123 }, content: "hello there", chat: { _id: 234 } },
      { sender: { _id: 123 }, content: "how are you?", chat: { _id: 234 } },
      { sender: { _id: 345 }, content: "how was your holiday?", chat: { _id: 234 } },
      { sender: { _id: 345 }, content: "???", chat: { _id: 234 } },
    ];
    loggedInUserId = 789;

    expect(isFirstMessageOfUser(messages, 2, loggedInUserId)).toBe(true);
    expect(isFirstMessageOfUser(messages, 0, loggedInUserId)).toBe(true);
    expect(isFirstMessageOfUser(messages, 1, loggedInUserId)).toBe(false);
    expect(isFirstMessageOfUser(messages, 3, loggedInUserId)).toBe(false);
  });
  test("messages array is not mutated during execution", () => {
    const messages = [
      { sender: { _id: 123 }, content: "hello there", chat: { _id: 234 } },
      { sender: { _id: 123 }, content: "how are you?", chat: { _id: 234 } },
      { sender: { _id: 345 }, content: "how was your holiday?", chat: { _id: 234 } },
      { sender: { _id: 345 }, content: "???", chat: { _id: 234 } },
    ];
    const messagesCopy = [
      { sender: { _id: 123 }, content: "hello there", chat: { _id: 234 } },
      { sender: { _id: 123 }, content: "how are you?", chat: { _id: 234 } },
      { sender: { _id: 345 }, content: "how was your holiday?", chat: { _id: 234 } },
      { sender: { _id: 345 }, content: "???", chat: { _id: 234 } },
    ];
    loggedInUserId = 789;
    isFirstMessageOfUser(messages, 2, loggedInUserId);

    expect(messages).toEqual(messagesCopy);
  });
});

describe("getTimeFromMessage testing", () => {
  test("returns the time only when the weekday or month is a single digit", () => {
    const dateStringDay = "2024-12-06T21:26:17Z";
    const dateStringMonth = "2024-01-04T13:26:17Z";

    expect(getTimeFromMessage(dateStringDay)).toBe("21:26");
    expect(getTimeFromMessage(dateStringMonth)).toBe("13:26");
  });
  test("returns the time only when the weekday or month is a double digit", () => {
    const dateString = "2024-12-10T14:26:17Z";

    expect(getTimeFromMessage(dateString)).toBe("14:26");
  });
});

describe("returnDate testing", () => {
  test("if the date is todays date it returns today", () => {
    const todaysDate = new Date();

    expect(returnDate(todaysDate)).toBe("Today");
  });
  test("if the date is yesterday date it returns yesterday", () => {
    const todaysDate = new Date();
    let yesterdaysDate = new Date(todaysDate);
    yesterdaysDate.setDate(yesterdaysDate.getDate() - 1);

    expect(returnDate(yesterdaysDate)).toBe("Yesterday");
  });

  test("if the date is on a Friday within the last 7 days but not within the last 2 days it will return Friday", () => {
    const fridayDate = new Date("2024-12-06");
    expect(returnDate(fridayDate)).toBe("Friday");
  });
  test("if the date is 6 days ago it will show just the day", () => {
    const wednesdayDate = new Date("2024-12-04");
    expect(returnDate(wednesdayDate)).toBe("Wednesday");
  });
  test("if the date is on the same day but a week before the date today it will return the full day and date", () => {
    const date = new Date("2024-12-03");
    expect(returnDate(date)).toBe("Tuesday, 3 December 2024");
  });

  test("if the date is over a week older than the current date it will display the full day and date", () => {
    const date = new Date("2024-12-01");
    expect(returnDate(date)).toBe("Sunday, 1 December 2024");
  });
});

describe("hasDateChanged testing", () => {
  test("returns false if the date is the same", () => {
    const messages = [
      { sender: { _id: 123 }, content: "hello there", chat: { _id: 234 }, createdAt: "2024-12-06T21:26:17Z" },
      { sender: { _id: 123 }, content: "how are you?", chat: { _id: 234 }, createdAt: "2024-12-06T13:26:17Z" },
      { sender: { _id: 345 }, content: "how was your holiday?", chat: { _id: 234 }, createdAt: "2024-12-09T13:55:17Z" },
      { sender: { _id: 345 }, content: "???", chat: { _id: 234 }, createdAt: "2024-12-09T11:37:17Z" },
    ];

    expect(hasDateChanged(messages, 3, "2024-12-09T11:37:17Z")).toBe(false);
  });
  test("returns true if the date is the same", () => {
    const messages = [
      { sender: { _id: 123 }, content: "hello there", chat: { _id: 234 }, createdAt: "2024-12-06T21:26:17Z" },
      { sender: { _id: 123 }, content: "how are you?", chat: { _id: 234 }, createdAt: "2024-12-06T13:26:17Z" },
      { sender: { _id: 345 }, content: "how was your holiday?", chat: { _id: 234 }, createdAt: "2024-12-08T13:55:17Z" },
      { sender: { _id: 345 }, content: "???", chat: { _id: 234 }, createdAt: "2024-12-09T11:37:17Z" },
    ];

    expect(hasDateChanged(messages, 1, "2024-12-10T14:37:17Z")).toBe(true);
  });
});
