const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
    },

    source: {
      type: String,
      enum: ["website", "walk-in", "whatsapp", "call", "referral", "other"],
      default: "website",
    },

    interestedIn: {
      type: String,
      enum: ["desk", "cabin", "conference", "virtual"],
    },

    status: {
      type: String,
      enum: [
        "new",
        "contacted",
        "interested",
        "converted",
        "closed",
        "lost",
      ],
      default: "new",
    },

    followUpDate: {
      type: Date,
    },

    notes: {
      type: String,
    },

    assignedTo: {
      type: String, // Admin name or id (simple CRM)
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lead", leadSchema);
