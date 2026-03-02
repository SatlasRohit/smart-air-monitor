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

// Load environment variables
dotenv.config();

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

// Serve static files from dist folder
app.use(express.static(path.join(__dirname, "../dist")));

// For React Router (SPA support)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

// ===== Create HTTP Server (for Socket.io) =====
const httpServer = createServer(app);
initSocket(httpServer);

// Use Azure dynamic port
const PORT = process.env.PORT;

if (!PORT) {
  console.error("PORT not defined by Azure!");
}

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});