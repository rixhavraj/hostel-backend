import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  capacity: { type: Number, default: 1 },
  availableBeds: { type: Number, default: 0 },
  images: [String],
  tag: { type: String, default: "" },
  description: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.model("Room", roomSchema);