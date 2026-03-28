import "dotenv/config";
import express, { json, urlencoded } from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import adminRoutes from "./routes/admin.js";
import contactRoutes from "./routes/contactRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";

const server = express();
connectDB();

server.use(cors({
    origin: [
        process.env.CORS_ORIGIN_URL_backend,
        process.env.CORS_ORIGIN_URL_frontend,
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
server.use(json({ limit: "20mb" }));
server.use(urlencoded({ extended: true, limit: "20mb" }));

server.use("/api/auth", authRoutes);
server.use("/api/bookings", bookingRoutes);
server.use("/api/rooms", roomRoutes);
server.use("/api/admin", adminRoutes);
server.use("/api/contact", contactRoutes);
server.use("/api/gallery", galleryRoutes);
server.use("/api/settings", settingsRoutes);

// CORS is already configured above


server.get("/health", (req, res) => res.json({ status: "ok" }));

server.use((err, req, res, next) => {
    console.error(err.stack || err);
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Something went wrong! Internal Server Error";
    res.status(status).json({ error: message });
});

const port = process.env.PORT || 8000;
server.listen(port, () => console.log("Server running at", port));
