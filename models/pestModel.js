import mongoose from "mongoose";

const PestIndexSchema = new mongoose.Schema(
  {
    location: {
      name: String,
      lat: { type: Number, required: true },
      lon: { type: Number, required: true },
    },
    environment: {
      temperature: { type: Number, required: true },
      humidity: { type: Number, required: true },
      rainfall: { type: Number, required: true },
    },
    pests: [
      {
        name: { type: String, required: true },
        score: { type: Number, min: 0, max: 100, required: true },
        level: {
          type: String,
          enum: ["low", "moderate", "high", "very high"],
          required: true,
        },
      },
    ],
    PPI: { value: { type: Number, min: 0, max: 100, required: true } },
    level: {
      type: string,
      enum: ["low", "moderate", "high", "very high"],
      required: true,
    },
    trend: {
      type: String,
      enum: ["increasing", "decreasing", "stable"],
      default: "stable",
    },
  },
  { timestamps: true },
);

const PestIndex = mongoose.model("PestIndex", PestIndexSchema);

export default PestIndex;
