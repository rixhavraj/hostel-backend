import express from "express";
import { auth } from "../middleware/authMiddleware.js";
import Booking from "../models/Booking.js";
import Room from "../models/Room.js";

const router = express.Router();

// ADMIN DASHBOARD SUMMARY
router.get("/stats", auth, async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const newBookings = await Booking.countDocuments({ status: "New" });
    const confirmedBookings = await Booking.countDocuments({ status: "Confirmed" });

    const rooms = await Room.find();
    const availableRooms = rooms.length;

    res.json({
      totalBookings,
      newBookings,
      confirmedBookings,
      availableRooms
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// BOOKINGS LIST
router.get("/bookings", auth, async (req, res) => {
  try {
    const data = await Booking.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ROOMS LIST
router.get("/rooms", auth, async (req, res) => {
  try {
    const data = await Room.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
