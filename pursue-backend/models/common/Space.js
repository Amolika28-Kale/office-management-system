const mongoose = require("mongoose");

const spaceSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["desk", "cabin", "conference", "utility"],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    // Space model
branchId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Branch",
  required: true
},

    capacity: Number,
    price: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    description: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Space", spaceSchema);
