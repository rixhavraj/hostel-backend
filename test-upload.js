import "dotenv/config";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dummyPath = path.join(__dirname, "dummy.png");

// 1x1 transparent PNG so Cloudinary gets a real image file.
const tinyPngBase64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=";

const run = async () => {
    try {
        if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
            throw new Error("Missing ADMIN_EMAIL or ADMIN_PASSWORD in .env");
        }

        fs.writeFileSync(dummyPath, Buffer.from(tinyPngBase64, "base64"));

        // Get a fresh JWT first (no need to keep ADMIN_TOKEN in .env).
        const loginRes = await axios.post("http://localhost:5000/api/auth/login", {
                email: process.env.ADMIN_EMAIL,
                password: process.env.ADMIN_PASSWORD
            });

        const { token } = loginRes.data || {};
        if (!token) {
            throw new Error("Login succeeded but token was not returned");
        }

        const formData = new FormData();
        formData.append("image", fs.createReadStream(dummyPath), "dummy.png");
        formData.append("caption", "Test Caption");

        const res = await axios.post("http://localhost:5000/api/gallery", formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                ...formData.getHeaders(),
            }
        });

        console.log("Status:", res.status);
        console.log("Response:", res.data);
    } catch (e) {
        console.error("Error:", e);
    } finally {
        if (fs.existsSync(dummyPath)) fs.unlinkSync(dummyPath);
    }
};

run();
