const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");
const { auth } = require("../middleware/authMiddleware");

// User submits contact form
router.post("/", async (req, res) => {
    try {
        const contact = await Contact.create(req.body);
        res.json({ success: true, contact });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin fetches contact messages
router.get("/", auth, async (req, res) => {
    try {
        const messages = await Contact.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin deletes a message
router.delete("/:id", auth, async (req, res) => {
    try {
        await Contact.findByIdAndDelete(req.params.id);
        res.json({ message: "Message deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
