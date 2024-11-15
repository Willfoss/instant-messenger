import axios from "axios";

const cloudinaryImageUploadUrl = axios.create({
  baseURL: "https://api.cloudinary.com/v1_1/dubtm2mub/image",
});

export function uploadImageToCloudinary(formData) {
  return cloudinaryImageUploadUrl.post("/upload", formData).then(({ data }) => {
    return data;
  });
}
