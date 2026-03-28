import "dotenv/config";
import mongoose from "mongoose";
import User from "./models/User.js";
import { connectDB } from "./config/db.js";

const run = async () => {
    await connectDB();
    const users = await User.find({});
    users.forEach(u => console.log(u.email));
    mongoose.connection.close();
};
run();
