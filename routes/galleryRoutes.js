const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const Gallery = require("../models/Gallery");
const { auth } = require("../middleware/authMiddleware");
const router = express.Router();

// Cloudinary config (reuse from env)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "rph-hostel/gallery",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});
const upload = multer({ storage });

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

module.exports = router;
