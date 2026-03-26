import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "email and password required" });

    const admin = await User.findOne({ email });

    if (!admin)
      return res.status(400).json({ message: "User not found" });

    const match = await bcrypt.compare(password, admin.password);

    if (!match)
      return res.status(400).json({ message: "Incorrect password" });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET || "SECRET_KEY", {expiresIn:"7d"});

    res.json({ token });
  } catch (err) {
    console.log("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;



/*
This is the Login Logic for your backend. Think of this code as the security guard (bouncer) at the door of a club. It checks if a person is on the guest list and if they have the right password before letting them in.

Here is the line-by-line explanation:

Part 1: Gathering the Tools (Lines 1–6)
Before the code starts, it grabs the necessary tools (libraries) from your project.

Line 1: const express = ...

Imports Express, the framework used to build the server.

Line 2: const bcrypt = ...

Imports bcryptjs. This is a security tool. It is used to compare the "real" password (typed by the user) with the "encrypted" (hashed) password stored in your database.

Line 3: const jwt = ...

Imports JSON Web Token. This is the tool that generates a "digital ID card" (token) for the user after they successfully log in.

Line 4: const User = ...

Imports your User Model. This gives the code access to your database so it can look up user details.

Line 6: const router = ...

Creates a mini-router to handle different paths (like /login, /register, etc.).

Part 2: Opening the Door (Line 8)
Line 8: router.post("/login", async (req, res) => {

.post: We use POST because the user is sending sensitive data (password) to the server.

async: This tells JavaScript: "Hey, we are going to talk to a database inside this function, so please wait for those tasks to finish before moving on."

Part 3: The Check-In Process (Lines 10–21)
Now the actual logic begins inside the try block.

Line 10: const { email, password } = req.body;

This grabs the data the user typed in the frontend login form. It extracts the email and password.

Line 12–13: if (!email || !password) ...

The Blank Check: It checks if the user left the email or password fields empty. If they did, it immediately stops and sends an error ("Required").

Line 15: const admin = await User.findOne({ email });

The Guest List Search: The code goes to the database and searches for a user with that specific email address.

It uses await because searching the database takes a few milliseconds.

Line 16–17: if (!admin) ...

User Not Found: If the database says "I don't have anyone with this email," the code stops and sends a "User not found" error.

Line 19: const match = await bcrypt.compare(password, admin.password);

The Password Check: This is the most important security line.

It takes the plain text password (password) the user just typed.

It compares it with the encrypted password (admin.password) stored in the database.

Note: You cannot just use === because the database password is scrambled (hashed). bcrypt handles the math to see if they match.

Line 20–21: if (!match) ...

If the passwords do not match, it stops and sends an "Incorrect password" error.

Part 4: Giving the ID Card (Lines 23–25)
If the code reaches this point, the user is valid!

Line 23: const token = jwt.sign({ id: admin._id }, "SECRET_KEY");

Creating the Token: It creates a digital "Entry Pass" (Token).

It stamps the user's ID (admin._id) inside the token so the server knows who they are later.

"SECRET_KEY" is the digital signature used to seal the token.

Line 25: res.json({ token });

Success! The server sends the token back to the frontend (React). The frontend will save this token (usually in LocalStorage) to keep the user logged in.

Part 5: The Safety Net (Lines 26–29)
Line 26: } catch (err) {

If anything crashes (like the database connection fails), the code jumps here.

Line 28: res.status(500)...

It sends a generic "Server Error" message so the frontend knows something went wrong on the backend, without crashing the whole server.

Part 6: Exporting (Line 32)
Line 32: module.exports = router;

This packs up this whole file so server.js can use it.
*/