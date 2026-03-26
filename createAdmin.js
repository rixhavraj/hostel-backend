require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User");

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected"))
  .catch(err => console.log(err));

async function createAdmin() {
  if (!process.env.ADMIN_PASSWORD || !process.env.ADMIN_EMAIL) {
    console.log("Missing env variables");
    process.exit(1);
  }

  const existing = await User.findOne({ role: "admin" });
  if (existing) {
    console.log("Admin already exists");
    process.exit();
  }

  const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

  await User.create({
    name: "Admin",
    email: process.env.ADMIN_EMAIL,
    password: hashed,
    role: "admin"
  });

  console.log("Admin created!");
  process.exit();
}

createAdmin();