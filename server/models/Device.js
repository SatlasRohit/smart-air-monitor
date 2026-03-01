import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema({
  name: String,
  location: String,
  status: {
    type: String,
    default: "active"
  }
});

export default mongoose.model("Device", deviceSchema);