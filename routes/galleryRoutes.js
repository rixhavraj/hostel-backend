import express from "express";
import multer from "multer";
import { cloudinary, createStorage } from "../config/cloudinary.js";
import Gallery from "../models/Gallery.js";
import { auth } from "../middleware/authMiddleware.js";
const router = express.Router();
const upload = multer({ storage: createStorage("gallery") });

// GET all gallery images — PUBLIC
router.get("/", async (req, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST upload new gallery image — Admin only
router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    const { caption } = req.body;
    const img = await Gallery.create({
      url: req.file.path,
      publicId: req.file.filename,
      caption: caption || "",
    });
    res.json(img);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE gallery image — Admin only
router.delete("/:id", auth, async (req, res) => {
  try {
    const img = await Gallery.findById(req.params.id);
    if (!img) return res.status(404).json({ error: "Image not found" });

    // Delete from Cloudinary
    if (img.publicId) {
      await cloudinary.uploader.destroy(img.publicId);
    }

    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: "Image deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
