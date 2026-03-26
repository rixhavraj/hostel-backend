const mongoose = require("mongoose");
const User = require("./models/User");
const bcrypt = require("bcrypt");

// 1. Load the environment variables
require("dotenv").config(); 

// 2. Use process.env to get the real URL
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected"))
  .catch(err => console.log(err));

async function admin2() {
     const hashed = await bcrypt.hash("Admin@123", 10);

    await User.create({
        name: "Admin",
        email: "admin@hostel.com",
        password: hashed,
        role: "admin"
    });

    console.log("Admin created!");
    process.exit();
}

admin2();