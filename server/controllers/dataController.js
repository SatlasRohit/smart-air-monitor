import SensorData from "../models/SensorData.js";
import { io } from "../socket.js";

/* 🔥 Store every record (NO overwrite) */
export const addData = async (req, res) => {
  try {
    const newData = await SensorData.create(req.body);

    io.emit("newData", newData);

    res.json(newData);

  } catch (err) {
    console.error("Controller Error:", err);
    res.status(500).json({ error: err.message });
  }
};

/* 🔥 Get latest data (for dashboard cards) */
export const getData = async (req, res) => {
  try {

    // Get latest record per station + pollutant
    const data = await SensorData.aggregate([
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            station: "$station",
            pollutant: "$pollutant"
          },
          doc: { $first: "$$ROOT" }
        }
      },
      {
        $replaceRoot: { newRoot: "$doc" }
      }
    ]);

    res.json(data);

  } catch (err) {
    console.error("GetData Error:", err);
    res.status(500).json({ error: err.message });
  }
};

/* 🔥 Get timeline data for one station */
export const getStationHistory = async (req, res) => {
  const station = decodeURIComponent(req.params.station);

  const history = await SensorData.find({ station })
    .sort({ createdAt: 1 });

  res.json(history);
};