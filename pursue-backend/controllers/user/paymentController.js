const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Payment = require("../../models/user/Payment");
const Booking = require("../../models/common/Booking");
const Invoice = require("../../models/user/Invoice");

/* ===============================
   CREATE STRIPE PAYMENT INTENT
================================ */
// controllers/paymentController.js
exports.createStripePaymentIntent = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const gst = booking.totalAmount * 0.18;
    const total = booking.totalAmount + gst;

    const payment = await Payment.create({
      user: req.user.id,
      booking: bookingId,
      amount: booking.totalAmount,
      gst,
      totalAmount: total,
      method: "card", // ✅ MUST MATCH ENUM
      status: "pending",
    });

    res.json({
      paymentId: payment._id,
      amount: total,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Stripe payment failed" });
  }
};

/* ===============================
   CONFIRM STRIPE PAYMENT (DEV)
================================ */
exports.confirmStripePayment = async (req, res) => {
  try {
    const { paymentId } = req.body;

    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    payment.status = "completed";
    await payment.save();

    // ✅ CREATE INVOICE
    await Invoice.create({
      user: payment.user,
      booking: payment.booking,
      payment: payment._id,
      invoiceNumber: `INV-${new Date().getFullYear()}-${Date.now()}`,
      amount: payment.amount,
      gst: payment.gst,
      totalAmount: payment.totalAmount,
      status: "Paid",
      issueDate: new Date(),
      dueDate: new Date(),
    });

    res.json({
      success: true,
      message: "Payment confirmed & invoice generated",
    });
  } catch (error) {
    console.error("Confirm payment error:", error);
    res.status(500).json({ message: "Payment confirmation failed" });
  }
};

/* ===============================
   USER PAYMENTS LIST
================================ */
exports.getUserPayments = async (req, res) => {
  const payments = await Payment.find({ user: req.user.id })
    .populate({
      path: "booking",
      populate: { path: "spaceId", select: "name type" },
    })
    .sort({ createdAt: -1 });

  res.json({ success: true, data: payments });
};

/* ===============================
   PAYMENT STATS
================================ */
exports.paymentStats = async (req, res) => {
  const payments = await Payment.find({ user: req.user.id });

  const stats = {
    totalRevenue: payments
      .filter(p => p.status === "completed")
      .reduce((a, b) => a + b.totalAmount, 0),
    pending: payments.filter(p => p.status === "pending").length,
    completed: payments.filter(p => p.status === "completed").length,
    failed: payments.filter(p => p.status === "failed").length,
  };

  res.json({ success: true, data: stats });
};
