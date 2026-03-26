import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  announcement: { type: String, default: "" },
  showAnnouncement: { type: Boolean, default: false },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Settings", settingsSchema);
