const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
  announcement: { type: String, default: "" },
  showAnnouncement: { type: Boolean, default: false },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Settings", settingsSchema);
