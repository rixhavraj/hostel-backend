import "dotenv/config";
import express, { json, urlencoded } from "express";
import cors from "cors";
import {connectDB} from "./config/db.js";

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
        "https://hostel-frontend-phi.vercel.app",
        "https://web-production-33dfa.up.railway.app",
        "http://localhost:5173",
        "http://localhost:5000"
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


const port = process.env.PORT || 5000;
server.listen(port, () => console.log("Server running at", port));
