import mongoose from "mongoose";

const sensorDataSchema = new mongoose.Schema(
  {
    station: { type: String, required: true },
    pollutant: { type: String, required: true },
    value: { type: Number },
    lastUpdate: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model("SensorData", sensorDataSchema);