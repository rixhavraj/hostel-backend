import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

const pass = process.env.ADMIN_PASSWORD;
const email = process.env.ADMIN_EMAIL;

async function resetAdmin() {
    try {
        if (!pass || !email) {
            throw new Error("ADMIN_EMAIL or ADMIN_PASSWORD missing in .env");
        }
        await mongoose.connect(process.env.MONGO_URI);
        const hashed = await bcrypt.hash(pass, 10);
        await User.updateOne({ email: email }, { password: hashed });
        console.log("PASSWORD_RESET_SUCCESS");
        process.exit(0);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}
resetAdmin();
