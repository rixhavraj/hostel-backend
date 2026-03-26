import "dotenv/config";
import mongoose from "mongoose";
import User from "./models/User.js";

async function checkAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const count = await User.countDocuments();
        console.log(`FOUND_USERS:${count}`);
        const users = await User.find({}, { email: 1 });
        console.log("USERS:", JSON.stringify(users));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
checkAdmin();
