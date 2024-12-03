import axios from "axios";

const cloudinaryImageUploadApi = axios.create({
  baseURL: "https://api.cloudinary.com/v1_1/dubtm2mub/image",
});

const jiffyApi = axios.create({
  baseURL: "http://localhost:9000/api",
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
    console.log(data);
    return data;
  });
}
