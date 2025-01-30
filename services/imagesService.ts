import Cloudinary from "@/firebase/Cloudinary";
import axios from "axios";

export const uploadImage = async (
  folder: string,
  url: string
): Promise<string> => {
  try {
    const cloudinaryUrl = await Cloudinary.getCloudinaryUrl();

    if (!cloudinaryUrl) return "";

    const formData = new FormData();

    formData.append("file", {
      uri: url,
      type: "image/jpeg",
      name: url.split("/").pop() || "image.jpeg",
    } as any);

    formData.append("upload_preset", "images");
    formData.append("folder", folder);

    const response = await axios.post(cloudinaryUrl, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (!response || !response?.data) return "";

    return response.data.secure_url;
  } catch (error) {
    console.log("Error while upload an image: ", error);
    return "";
  }
};
