const express = require("express");
const router = express.Router();
const Settings = require("../models/Settings");
const { auth } = require("../middleware/authMiddleware");

// Get settings (Public)
router.get("/", async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = await Settings.create({ announcement: "Welcome to RPH Hostel!", showAnnouncement: true });
        }
        res.json(settings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update settings (Admin only)
router.patch("/", auth, async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings(req.body);
        } else {
            Object.assign(settings, req.body);
            settings.updatedAt = Date.now();
        }
        await settings.save();
        res.json(settings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
