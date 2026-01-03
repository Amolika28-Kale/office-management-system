const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    title: String,
    message: String,
    type: {
      type: String,
      enum: ["booking", "payment", "system"],
      default: "system",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    meta: Object,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
