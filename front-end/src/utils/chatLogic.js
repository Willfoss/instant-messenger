export function getSender(loggedInUser, users) {
  if (!loggedInUser || users.length === 0) return {};
  const userNotLoggedIn = users.filter((user) => {
    if (user._id !== loggedInUser._id) {
      return user;
    }
  });
  return userNotLoggedIn[0].name;
}
