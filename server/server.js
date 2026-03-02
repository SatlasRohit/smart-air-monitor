import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import dataRoutes from "./routes/dataRoutes.js";
import { initSocket } from "./socket.js";
import { startSimulator } from "../Simulator/deviceSimulator.js";

// 🔥 Load .env ONLY in development
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/data", dataRoutes);

// ===== Serve Frontend (Vite Build) =====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files
app.use(express.static(path.join(__dirname, "../dist")));

// React Router support
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

// ===== Create HTTP Server (for Socket.io) =====
const httpServer = createServer(app);
initSocket(httpServer);

// 🔥 Use Azure dynamic PORT (DO NOT fallback to 5000)
const PORT = process.env.PORT;

console.log("ENV PORT:", PORT);

if (!PORT) {
  console.error("❌ PORT not defined! Azure should set it.");
  process.exit(1);
}

// 🔥 Important: Bind to 0.0.0.0 for Azure Linux
httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});