import mongoose from "mongoose";

const sensorSchema = new mongoose.Schema({
  station: String,
  pollutant: String,
  value: Number,
  lastUpdate: String
}, { timestamps: true });   // MUST BE HERE

export default mongoose.model("SensorData", sensorSchema);