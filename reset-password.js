import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import { connectDB } from "./config/db.js";

const resetPassword = async () => {
    try {
        await connectDB();
        const email = process.env.ADMIN_EMAIL;
        const newPassword = process.env.ADMIN_PASSWORD; // keeping it exactly "admin" or "admin123"
        // Let's make it admin123 and tell the user!
        const hashedPassword = await bcrypt.hash("admin123", 10);
        
        const user = await User.findOneAndUpdate(
            { email },
            { password: hashedPassword },
            { new: true, upsert: true } // Creates it if it doesn't exist just in case
        );
        
        console.log("Successfully reset password");
    } catch (error) {
        console.error("Error resetting password:", error);
    } finally {
        mongoose.connection.close();
    }
};

resetPassword();
