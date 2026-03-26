const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    name: String,
    email: String,
    mobile: String,
    roomType: String,
    moveInDate: String,
    status: { type: String, default: "new" },
    notes: String
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);


/*
Booking.js (The Reservation Blueprint)
Purpose: Defines what happens when a student books a room.

Lines 4-7: Standard text fields for Name, Mobile, Room Type, and Date.

Line 8: status: { type: String, default: "new" }

default: "new": This is a smart feature. When a user submits the form, they don't pick a status. The database automatically sets it to "new". Later, you (the Admin) can change this to "Confirmed" or "Rejected".

Line 10: { timestamps: true }

The Magic Line: You don't see fields for "Created At" or "Updated At" here, but this line tells Mongoose to automatically add two invisible clocks to every booking:

createdAt: When the booking happened.

updatedAt: The last time you changed it.
*/