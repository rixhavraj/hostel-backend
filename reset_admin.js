import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

async function resetAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const hashed = await bcrypt.hash("admin123", 10);
        await User.updateOne({ email: "admin@hostel.com" }, { password: hashed });
        console.log("PASSWORD_RESET_SUCCESS");
        process.exit(0);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}
resetAdmin();
