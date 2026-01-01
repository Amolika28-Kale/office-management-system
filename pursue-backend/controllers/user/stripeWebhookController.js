const Booking = require("../../models/common/Booking");
const Invoice = require("../../models/user/Invoice");
const Payment = require("../../models/user/Payment");

exports.handleStripeWebhook = async (event) => {
if (event.type === "payment_intent.succeeded") {
  const intent = event.data.object;

  const payment = await Payment.findOne({
    stripePaymentIntentId: intent.id,
  });

  if (!payment) return;

  payment.status = "completed";
  await payment.save();

  // 🔥 CREATE INVOICE
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
}
};
