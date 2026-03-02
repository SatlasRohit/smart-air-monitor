import express from "express";
import Data from "../models/SensorData.js";

const router = express.Router();

/* 🔥 GET latest data */
router.get("/", async (req, res) => {
  try {
    const data = await Data.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    console.error("Error fetching latest data:", err);
    res.status(500).json({ error: err.message });
  }
});

/* 🔥 GET history for a station */
router.get("/history/:station", async (req, res) => {
  try {
    const stationName = decodeURIComponent(req.params.station);

    const history = await Data.find({
      station: { $regex: stationName, $options: "i" }
    }).sort({ createdAt: 1 });

    res.json(history);
  } catch (err) {
    console.error("Error fetching history:", err);
    res.status(500).json({ error: err.message });
  }
});

/* 🔥 POST new data */
router.post("/", async (req, res) => {
  try {
    const newData = new Data(req.body);
    await newData.save();

    res.status(201).json(newData);
  } catch (err) {
    console.error("Error saving data:", err);
    res.status(400).json({ error: err.message });
  }
});

export default router;