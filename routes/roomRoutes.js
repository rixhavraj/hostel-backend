import express from "express";
import multer from "multer";
import { cloudinary, createStorage } from "../config/cloudinary.js";
import Room from "../models/Room.js";
import { auth } from "../middleware/authMiddleware.js";
const router = express.Router();
const upload = multer({ storage: createStorage("rooms") });

const extractPublicIdFromUrl = (imageUrl) => {
  if (!imageUrl) return null;

  try {
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split("/").filter(Boolean);
    const uploadIndex = pathParts.indexOf("upload");
    if (uploadIndex === -1) return null;

    const afterUpload = pathParts.slice(uploadIndex + 1);
    const versionIndex = afterUpload.findIndex((part) => /^v\d+$/.test(part));
    const publicIdParts = versionIndex >= 0 ? afterUpload.slice(versionIndex + 1) : afterUpload;
    if (!publicIdParts.length) return null;

    const joined = publicIdParts.join("/");
    return joined.replace(/\.[^/.]+$/, "");
  } catch {
    return null;
  }
};

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
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ error: "Room not found" });

    // Best-effort cloud cleanup for all room images.
    for (const imageUrl of room.images || []) {
      const publicId = extractPublicIdFromUrl(imageUrl);
      if (!publicId) continue;
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (cloudErr) {
        console.warn("Cloudinary cleanup failed for room delete:", cloudErr.message);
      }
    }

    await room.deleteOne();
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
    const imageUrl = req.body?.imageUrl || req.query?.imageUrl;
    if (!imageUrl) {
      return res.status(400).json({ error: "imageUrl is required" });
    }

    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ error: "Room not found" });

    const originalCount = room.images?.length || 0;
    room.images = (room.images || []).filter((img) => img !== imageUrl);
    if (room.images.length === originalCount) {
      return res.status(404).json({ error: "Image not found in room" });
    }

    const publicId = extractPublicIdFromUrl(imageUrl);
    if (publicId) {
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (cloudErr) {
        console.warn("Cloudinary image delete failed:", cloudErr.message);
      }
    }

    await room.save();
    res.json(room);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
