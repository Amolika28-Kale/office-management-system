const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    amount: Number,
    gst: Number,
    totalAmount: Number,
  method: {
  type: String,
  enum: ["card", "upi", "bank_transfer"],
  required: true,
},

status: {
  type: String,
  enum: ["pending", "completed", "failed"],
  default: "pending",
},
stripePaymentIntentId: String,

  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
