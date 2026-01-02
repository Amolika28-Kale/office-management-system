const Invoice = require("../../models/user/Invoice");

exports.getAllInvoices = async (req, res) => {
  const invoices = await Invoice.find()
    .populate("user", "name email")
    .populate({
      path: "payment",
      populate: { path: "booking" },
    })
    .sort({ createdAt: -1 });

  res.json({ data: invoices });
};
