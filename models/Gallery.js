import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema({
  url: { type: String, required: true },
  caption: { type: String, default: "" },
  publicId: { type: String, default: "" }, // Cloudinary public_id for deletion
}, { timestamps: true });

export default mongoose.model("Gallery", gallerySchema);
