import axios from "axios";

const cloudinaryImageUploadApi = axios.create({
  baseURL: "https://api.cloudinary.com/v1_1/dubtm2mub/image",
});

console.log(process.env.VITE_API_URL);

const jiffyApi = axios.create({
  baseURL: process.env.VITE_API_URL,
});

export function uploadImageToCloudinary(formData) {
  return cloudinaryImageUploadApi.post("/upload", formData).then(({ data }) => {
    return data;
  });
}

export function signUpUser(name, email, password, picture) {
  return jiffyApi.post("/users", picture === "" ? { name, email, password } : { name, email, password, picture }).then(({ data }) => {
    return data;
  });
}

export function logUserIn(email, password) {
  return jiffyApi.post("/users/login", { email, password }).then(({ data }) => {
    return data;
  });
}

export function searchForUser(search, authorisation) {
  return jiffyApi.get(`/users?search=${search}`, authorisation).then(({ data }) => {
    return data;
  });
}

export function accessChat(user_id, authorisation) {
  return jiffyApi.post(`/chats`, { user_id }, authorisation).then(({ data }) => {
    return data;
  });
}

export function getAllChatsForLoggedInUser(authorisation) {
  return jiffyApi.get("/chats", authorisation).then(({ data }) => {
    return data;
  });
}

export function createNewGroupChat(groupName, users, authorisation) {
  return jiffyApi.post("/chats/groups", { group_name: groupName, users }, authorisation).then(({ data }) => {
    return data;
  });
}

export function updateGroupChatName(group_id, groupName, authorisation) {
  return jiffyApi.patch("/chats/groups", { group_id, group_name: groupName }, authorisation).then(({ data }) => {
    return data;
  });
}

export function addUserToExistinGroupChat(group_chat_id, user_to_add, authorisation) {
  return jiffyApi.patch("/chats/groups/add", { group_chat_id, user_to_add }, authorisation).then(({ data }) => {
    return data;
  });
}

export function removeUserFromExistingGroupChat(group_chat_id, user_to_remove, authorisation) {
  return jiffyApi.patch("/chats/groups/remove", { group_chat_id, user_to_remove }, authorisation).then(({ data }) => {
    return data;
  });
}

export function sendNewMessage(chat_id, message, authorisation) {
  return jiffyApi.post("/messages", { chat_id, message }, authorisation).then(({ data }) => {
    return data;
  });
}

export function getAllMessagesForChat(chat_id, authorisation) {
  return jiffyApi.get(`messages/${chat_id}`, authorisation).then(({ data }) => {
    return data;
  });
}
