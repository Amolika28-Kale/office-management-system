const Payment = require("../../models/user/Payment");

exports.getAllPayments = async (req, res) => {
  const payments = await Payment.find()
    .populate("user", "name email")
    .populate("booking")
    .sort({ createdAt: -1 });

  res.json({ data: payments });
};
