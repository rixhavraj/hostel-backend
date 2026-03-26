require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const roomRoutes = require("./routes/roomRoutes");
const adminRoutes = require("./routes/admin");
const contactRoutes = require("./routes/contactRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const settingsRoutes = require("./routes/settingsRoutes");

const server = express();
connectDB();

server.use(cors());
server.use(express.json({ limit: "20mb" }));
server.use(express.urlencoded({ extended: true, limit: "20mb" }));

server.use("/api/auth", authRoutes);
server.use("/api/bookings", bookingRoutes);
server.use("/api/rooms", roomRoutes);
server.use("/api/admin", adminRoutes);
server.use("/api/contact", contactRoutes);
server.use("/api/gallery", galleryRoutes);
server.use("/api/settings", settingsRoutes);

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Server running at http://localhost:${port}`));
