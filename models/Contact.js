import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Contact", contactSchema);


/*
Contact.js (The Message Blueprint)
Purpose: Defines the "Contact Us" form submissions.

Lines 4-6: Stores the Name, Email, and Message.

Line 7: createdAt: { type: Date, default: Date.now }

This manually sets the date to "Right Now" (Date.now) whenever a message is saved. It works similarly to timestamps: true but gives you manual control over that specific field.
*/