export function getSender(loggedInUser, users) {
  if (!loggedInUser || !users || users.length === 0) return;
  const userNotLoggedIn = users.filter((user) => {
    if (user._id !== loggedInUser._id) {
      return user;
    }
  });
  return userNotLoggedIn[0].name;
}

export function getSenderFullDetails(loggedInUser, users) {
  if (!loggedInUser || users.length === 0) return {};
  const userNotLoggedIn = users.filter((user) => {
    if (user._id !== loggedInUser._id) {
      return user;
    }
  });
  return userNotLoggedIn[0];
}

export function isSameSender(messages, message, index, user_id) {
  if (messages.length === 0) return false;
  return (
    index < messages.length - 1 &&
    (messages[index + 1].sender._id !== message.sender._id || messages[index + 1].sender._id === undefined) &&
    messages[index].sender._id !== user_id
  );
}

export function isLastMessageOfUser(messages, index, user_id) {
  if (index === messages.length - 1 && messages[messages.length - 1].sender._id !== user_id && messages[messages.length - 1].sender._id) {
    return true;
  } else {
    return false;
  }
}

export function isFirstMessageOfUser(messages, index, user_id) {
  if (messages.length === 0) return false;
  if ((index === 0 || messages[index].sender._id !== messages[index - 1].sender._id) && messages[index].sender._id !== user_id) {
    return true;
  } else {
    return false;
  }
}

export function getTimeFromMessage(createdAt) {
  return createdAt.slice(11, 16);
}

export function returnDate(date) {
  const dateToday = new Date();
  const dateYesterday = new Date(dateToday);
  dateYesterday.setDate(dateYesterday.getDate() - 1);

  const dateLastWeek = new Date(dateToday);
  dateLastWeek.setDate(dateLastWeek.getDate() - 7);
  const newDate = new Date(date);

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  if (dateToday.getDate() === newDate.getDate() && dateToday.getMonth() === newDate.getMonth() && dateToday.getFullYear() === newDate.getFullYear()) {
    return "Today";
  } else if (dateYesterday <= newDate) {
    return "Yesterday";
  } else if (dateLastWeek <= newDate) {
    return days[newDate.getDay()];
  } else {
    return `${days[newDate.getDay()]}, ${newDate.getDate()} ${months[newDate.getMonth()]} ${newDate.getFullYear()}`;
  }
}

export function hasDateChanged(messages, index, date) {
  if (index === 0) return true;
  const latestMessageDate = new Date(date);
  const lastMessageDate = new Date(messages[index - 1].createdAt);

  if (
    latestMessageDate.getDate() === lastMessageDate.getDate() &&
    latestMessageDate.getMonth() === lastMessageDate.getMonth() &&
    latestMessageDate.getFullYear() === lastMessageDate.getFullYear()
  ) {
    return false;
  }
  return true;
}

// had to remove export before functions and add the bit below to test. note quite sure how to have both modules and the legacy require in a react file?
// module.exports = {
//   getSender,
//   getSenderFullDetails,
//   isSameSender,
//   isLastMessageOfUser,
//   isFirstMessageOfUser,
//   getTimeFromMessage,
//   returnDate,
//   hasDateChanged,
// };
