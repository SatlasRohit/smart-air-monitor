import mongoose from "mongoose";

const dataSchema = new mongoose.Schema(
  {
    station: String,
    pollutant: String,
    value: Number,
    lastUpdate: String
  },
  { timestamps: true }   // 🔥 VERY IMPORTANT
);

export default mongoose.model("Data", dataSchema);