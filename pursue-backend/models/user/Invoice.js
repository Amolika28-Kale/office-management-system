const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
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
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },
    invoiceNumber: String,
    amount: Number,
    gst: Number,
    totalAmount: Number,
    status: {
      type: String,
      enum: ["Paid", "Unpaid"],
      default: "Unpaid",
    },
    issueDate: Date,
    dueDate: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invoice", invoiceSchema);
