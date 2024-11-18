import axios from "axios";

const cloudinaryImageUploadApi = axios.create({
  baseURL: "https://api.cloudinary.com/v1_1/dubtm2mub/image",
});

const jiffyApi = axios.create({
  baseURL: "/api",
});

export function uploadImageToCloudinary(formData) {
  return cloudinaryImageUploadApi.post("/upload", formData).then(({ data }) => {
    return data;
  });
}

export function signUpUser(name, email, password, picture) {
  return jiffy.post("/users", { name, email, password, picture }).then(({ data }) => {
    return data;
  });
}
