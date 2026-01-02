const Invoice = require("../../models/user/Invoice");
const generateInvoicePDF = require("../../utils/generateInvoicePDF");

/* GET ALL INVOICES */
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

/* GET SINGLE INVOICE (VIEW) */
exports.getInvoiceById = async (req, res) => {
  const invoice = await Invoice.findById(req.params.id)
    .populate("user", "name email")
    .populate({
      path: "payment",
      populate: { path: "booking" },
    });

  if (!invoice) {
    return res.status(404).json({ message: "Invoice not found" });
  }

  res.json({ data: invoice });
};

/* DOWNLOAD INVOICE PDF */
exports.downloadInvoice = async (req, res) => {
  const invoice = await Invoice.findById(req.params.id)
    .populate("user")
    .populate({
      path: "payment",
      populate: { path: "booking" },
    });

  if (!invoice) {
    return res.status(404).json({ message: "Invoice not found" });
  }

  const pdfBuffer = await generateInvoicePDF(invoice);

  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename=Invoice-${invoice.invoiceNumber}.pdf`,
  });

  res.send(pdfBuffer);
};

/* GENERATE NEW INVOICE PDF */
exports.generateNewInvoice = async (req, res) => {
  // Example: generate latest invoice or empty template
  const invoice = await Invoice.findOne().sort({ createdAt: -1 })
    .populate("user")
    .populate({
      path: "payment",
      populate: { path: "booking" },
    });

  if (!invoice) {
    return res.status(404).json({ message: "No invoice found" });
  }

  const pdfBuffer = await generateInvoicePDF(invoice);

  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename=New-Invoice-${Date.now()}.pdf`,
  });

  res.send(pdfBuffer);
};
