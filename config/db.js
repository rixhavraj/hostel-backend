// backend/config/db.js
import { connect } from "mongoose";

export async function connectDB() {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error("MONGO_URI missing in .env");

    await connect(uri, {});

    console.log("MongoDB Atlas connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
}


/*
This file is the Database Connector. Its only job is to dial the "phone number" of your MongoDB database and establish a connection so your app can save and retrieve data.

Here is the line-by-line breakdown:

Part 1: Bringing in the Tool (Line 2)
Line 2: import mongoose from "mongoose";

Mongoose is the library (tool) that lets Node.js talk to MongoDB easily. Without this, you would have to write raw, complex database code.

Part 2: Defining the Action (Line 4)
Line 4: export const connectDB = async () => {

We create a function called connectDB.

async: Connecting to a database over the internet takes time (milliseconds or seconds). We use async so the code knows to wait for the connection to finish before moving on.

Part 3: The "Try" Block (Lines 5–12)
We try to connect. If it works, great. If not, we catch the error.

Line 6: const uri = process.env.MONGO_URI;

The Address: This looks inside your hidden .env file to find the address of your database (the one that starts with mongodb+srv://...).

Security Note: We never write the actual password here. We always use process.env to keep it safe.

Line 7: if (!uri) throw new Error(...)

The Safety Check: This asks: "Did the developer forget to put the link in the .env file?"

If the answer is yes, it crashes the app immediately with a clear error message ("MONGO_URI missing") instead of letting it run broken.

Line 9: await mongoose.connect(uri, { });

The Dialing: This is the line that actually calls MongoDB.

await: The code pauses here. It will not print "Connected" until the connection is actually secure.

{ }: These are the options. Since you removed the old, deprecated options (like useNewParser), this is now empty, which is perfect for modern Mongoose.

Line 12: console.log("MongoDB Atlas connected");

Success: If line 9 didn't crash, this prints a message to your terminal so you know everything is working.

Part 4: The "Catch" Block (Lines 13–16)
This runs ONLY if the connection fails (e.g., bad password, no internet).

Line 14: console.error("MongoDB connection error:", err);

It prints the exact reason why it failed (e.g., "bad auth," "network timeout") to help you debug.

Line 15: process.exit(1);

The Emergency Stop: This command kills the server immediately.

1: This is a code that tells the computer "The program crashed because of an error."

Why kill it? If the database isn't connected, your API cannot save bookings or log users in. There is no point in keeping the server running if it can't do its job.

Part 5: Exporting (Line 19)
Line 19: 

This sends this function over to server.js, where you call it using connectDB() when the app starts.
*/