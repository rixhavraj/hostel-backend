const mongoose = require("mongoose");

const userSchema= new mongoose.Schema({
    email:{type:String, require:true, unique:true},
    password:{type:String, require:true},
});

module.exports = mongoose.model("User", userSchema);

/*
User.js (The Admin Blueprint)
Purpose: Defines what an "Admin User" looks like so you can log in.

Line 1: const mongoose = ...

Imports the Mongoose tool.

Line 3: const userSchema = new mongoose.Schema({

Creates a new "Plan" or "Blueprint."

Line 4: email: { type: String, required: true, unique: true }

type: String: It must be text.

required: true: You cannot create a user without an email.

unique: true: No two users can have the same email. This prevents duplicate accounts.

Line 5: password: { type: String, required: true }

Must be text and is mandatory. (Remember: this will store the hashed version, not plain text).

Line 8: module.exports = mongoose.model("User", userSchema);

This creates the table (Collection) named "users" in MongoDB and exports it so authRoutes.js can use it to check logins.
*/