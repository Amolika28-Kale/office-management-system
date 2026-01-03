const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, // Kothrud, Deccan, PCMC
      trim: true,
    },
    city: {
      type: String,
      default: "Pune",
    },
    address: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Branch", branchSchema);
