import "dotenv/config";
import { cloudinary } from "./config/cloudinary.js";

async function testUpload() {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      throw new Error("Missing Cloudinary env vars. Check CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.");
    }

    const res = await cloudinary.uploader.upload("https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png", {
      folder: "rph-hostel/test"
    });
    console.log("Upload Success:", res.secure_url);
  } catch (error) {
    console.error("Upload Error:", error);
  }
}

testUpload();
