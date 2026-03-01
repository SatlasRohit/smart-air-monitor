import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import connectDB from "./config/db.js";
import dataRoutes from "./routes/dataRoutes.js";
import { initSocket } from "./socket.js";

dotenv.config();

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/data", dataRoutes);

const httpServer = createServer(app);
initSocket(httpServer);

httpServer.listen(5000, () =>
  console.log("🚀 Server running on port 5000")
);