import Device from "../models/Device.js";

export const createDevice = async (req, res) => {
  const device = new Device(req.body);
  await device.save();
  res.status(201).json(device);
};

export const getDevices = async (req, res) => {
  const devices = await Device.find();
  res.json(devices);
};

export const getStationHistory = async (req, res) => {
  try {
    const station = decodeURIComponent(req.params.station);

    const history = await SensorData.find({ station })
      .sort({ createdAt: 1 });

    res.json(history);
  } catch (err) {
    console.error("History Error:", err);
    res.status(500).json({ error: err.message });
  }
};