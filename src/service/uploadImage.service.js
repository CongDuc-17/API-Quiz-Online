import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

export async function uploadAvatar(filePath) {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });

    const uploadResult = await cloudinary.uploader.upload(filePath, {
      folder: "uploaded_avatars",
      resource_type: "image",
    });

    return uploadResult.secure_url; // Trả về URL của ảnh đã upload
  } catch (error) {
    console.error("Lỗi upload avatar:", error);
    return null;
  }
}
