import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected"))
  .catch(err => console.log(err));

async function createAdmin() {
  if (!process.env.ADMIN_PASSWORD || !process.env.ADMIN_EMAIL) {
    console.log("Missing env variables");
    process.exit(1);
  }

  const existing = await User.findOne({ email: process.env.ADMIN_EMAIL });
  if (existing) {
    console.log("Admin already exists");
    process.exit();
  }

  const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

  await User.create({
    email: process.env.ADMIN_EMAIL,
    password: hashed,
  });

  console.log("Admin created!");
  process.exit();
}

createAdmin();