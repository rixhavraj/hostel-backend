import express from "express";
import multer from "multer";
import { cloudinary, createStorage } from "../config/cloudinary.js";
import Room from "../models/Room.js";
import { auth } from "../middleware/authMiddleware.js";
const router = express.Router();
const upload = multer({ storage: createStorage("rooms") });

// GET all rooms — PUBLIC (so frontend Home/Rooms page can fetch without auth)
router.get("/", async (req, res) => {
  try {
    res.json(await Room.find().sort({ createdAt: -1 }));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create room — Admin only
router.post("/", auth, async (req, res) => {
  try {
    const room = await Room.create(req.body);
    res.json(room);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH update room — Admin only
router.patch("/:id", auth, async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!room) return res.status(404).json({ error: "Room not found" });
    res.json(room);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE room — Admin only
router.delete("/:id", auth, async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.json({ message: "Room deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST upload image for a room — Admin only
router.post("/:id/upload-image", auth, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Image file is required" });
    }

    const imageUrl = req.file.path;
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      { $push: { images: imageUrl } },
      { new: true }
    );
    res.json({ url: imageUrl, room });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE an image from a room — Admin only
router.delete("/:id/image", auth, async (req, res) => {
  try {
    const { imageUrl } = req.body;
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      { $pull: { images: imageUrl } },
      { new: true }
    );
    res.json(room);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
