import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import path from "path";

async function testUpload() {
  try {
    // 1. Log in to get token
    const loginRes = await axios.post("http://localhost:5000/api/auth/login", {
      email: "admin@hostel.com",
      password: "admin123"
    });
    const token = loginRes.data.token;
    console.log("Logged in gracefully, acquired token:", token.substring(0, 10) + "...");

    // 2. Prepare FormData
    const formData = new FormData();
    formData.append("caption", "My Automagical Test Photo");
    
    // Find a sample image
    const imagePath = path.join(process.cwd(), "package.json"); // well, package.json is not an image. Let's create a dummy image or buffer.
    
    // Let's create a dummy file just to see if multer handles it properly (Cloudinary might reject invalid imgs though)
    // I am passing the generated image from C:\Users\rixha\.gemini\antigravity\brain\b9ef8463-cdff-4be1-bebe-d9f66fa781eb\test_gallery_photo_1774897698237.png
    const imgFile = "C:\\Users\\rixha\\.gemini\\antigravity\\brain\\b9ef8463-cdff-4be1-bebe-d9f66fa781eb\\test_gallery_photo_1774897698237.png";
    formData.append("image", fs.createReadStream(imgFile));

    console.log("Attempting upload to Cloudinary via backend...");
    const uploadRes = await axios.post("http://localhost:5000/api/gallery", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        ...formData.getHeaders()
      }
    });

    console.log("Upload SUCCESS! Cloudinary response:");
    console.log(uploadRes.data);
  } catch (err) {
    if (err.response) {
      console.error("Upload failed with data:", err.response.data);
    } else {
      console.error("Upload failed:", err.message);
    }
  }
}

testUpload();
