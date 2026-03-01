import express from "express";
import Data from "../models/Data.js";   // make sure path matches your project

const router = express.Router();

/* 🔥 GET latest data */
router.get("/", async (req, res) => {
  try {
    const data = await Data.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* 🔥 GET history for a station (FIXED VERSION) */
router.get("/history/:station", async (req, res) => {
  try {
    const stationName = decodeURIComponent(req.params.station);

    const history = await Data.find({
      station: { $regex: stationName, $options: "i" }  // ✅ partial + case insensitive
    }).sort({ createdAt: 1 });

    res.json(history);
  } catch (err) {
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
    res.status(400).json({ error: err.message });
  }
});

export default router;