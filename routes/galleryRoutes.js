import express from "express";
import multer from "multer";
import { cloudinary, createStorage } from "../config/cloudinary.js";
import Gallery from "../models/Gallery.js";
import { auth } from "../middleware/authMiddleware.js";
const router = express.Router();
const upload = multer({
  storage: createStorage("gallery"),
});

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

const uploadGalleryImage = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (!err) return next();

    console.error("Gallery upload middleware error:", err);
    const status = err.name === "MulterError" ? 400 : 500;
    return res.status(status).json({ error: err.message || "Image upload failed" });
  });
};

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
router.post("/", auth, uploadGalleryImage, async (req, res) => {
  try {
    console.log("FILE:", req.file);
    console.log("BODY:", req.body);
    
    if (!req.file) {
      return res.status(400).json({ error: "Image file is required" });
    }

    const { caption } = req.body;
    const img = await Gallery.create({
      url: req.file.path,
      publicId: req.file.filename,
      caption: caption || "",
    });
    res.json(img);
  } catch (err) {
    console.log("Error uploading gallery image:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// DELETE gallery image — Admin only
router.delete("/:id", auth, async (req, res) => {
  try {
    const img = await Gallery.findById(req.params.id);
    if (!img) return res.status(404).json({ error: "Image not found" });

    const publicId = img.publicId || extractPublicIdFromUrl(img.url);

    // Best effort cloud cleanup; still remove DB entry even if cloud item is already missing.
    if (publicId) {
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (cloudErr) {
        console.warn("Cloudinary gallery delete failed:", cloudErr.message);
      }
    }

    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: "Image deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
