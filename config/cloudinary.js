import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import "dotenv/config";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const createStorage = (folder) => new CloudinaryStorage({
  cloudinary,
  params: {
    folder: `rph-hostel/${folder}`,
    allowed_formats: ["jpg", "jpeg", "png", "webp", "jfif", "heic", "heif", "avif"],
  },
});

export { cloudinary, createStorage };
