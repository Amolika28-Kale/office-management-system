const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      select: false, // important
    },

    phone: String,

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },

    userType: {
      type: String,
      enum: ["Member", "Guest"],
      default: "Guest",
    },

    plan: {
      type: String,
      enum: ["Premium", "Standard", "Day Pass"],
      default: "Standard",
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    // 🔐 Verification
    isVerified: {
      type: Boolean,
      default: false,
    },

    // 📄 Compliance
    companyName: String,
    gstNumber: String,
    address: String,

    // 🧾 Tracking
    notes: String,

    lastLogin: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
