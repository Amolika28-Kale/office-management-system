const Invoice = require("../../models/user/Invoice");
const PDFDocument = require("pdfkit");
exports.getMyInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ user: req.user.id })
      .populate({
        path: "booking",
        populate: { path: "spaceId", select: "name type" },
      })
      .sort({ createdAt: -1 });

    // ✅ RETURN ARRAY DIRECTLY
    res.json(invoices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch invoices" });
  }
};

exports.getInvoiceById = async (req, res) => {
  const invoice = await Invoice.findOne({
    _id: req.params.id,
    user: req.user.id,
  })
    .populate("payment")
    .populate({
      path: "booking",
      populate: { path: "spaceId", select: "name type" },
    });

  if (!invoice) {
    return res.status(404).json({ message: "Invoice not found" });
  }

  res.json(invoice);
};
exports.downloadInvoicePDF = async (req, res) => {
  const invoice = await Invoice.findById(req.params.id)
    .populate("user", "name email")
    .populate({
      path: "booking",
      populate: { path: "spaceId", select: "name" },
    });

  if (!invoice) {
    return res.status(404).json({ message: "Invoice not found" });
  }

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${invoice.invoiceNumber}.pdf`
  );

  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(res);

  // 🔹 HEADER
  doc.fontSize(20).text("Pursue Co-Working Space", { align: "center" });
  doc.moveDown();
  doc.fontSize(14).text("INVOICE", { align: "center" });

  doc.moveDown(2);

  // 🔹 INVOICE INFO
  doc.fontSize(10);
  doc.text(`Invoice #: ${invoice.invoiceNumber}`);
  doc.text(`Issue Date: ${invoice.issueDate.toDateString()}`);
  doc.text(`Status: ${invoice.status}`);

  doc.moveDown();

  // 🔹 BILL TO
  doc.text("Bill To:", { underline: true });
  doc.text(invoice.user.name);
  doc.text(invoice.user.email);

  doc.moveDown();

  // 🔹 TABLE
  doc.fontSize(12).text("Description", 50, doc.y, { continued: true });
  doc.text("Amount", 400);

  doc.moveDown();

  doc.fontSize(10);
  doc.text(
    `${invoice.booking.spaceId.name} – Monthly Rent`,
    50,
    doc.y,
    { continued: true }
  );
  doc.text(`₹${invoice.amount}`, 400);

  doc.moveDown();
  doc.text("GST (18%)", 50, doc.y, { continued: true });
  doc.text(`₹${invoice.gst}`, 400);

  doc.moveDown();
  doc.fontSize(12);
  doc.text("Total", 50, doc.y, { continued: true });
  doc.text(`₹${invoice.totalAmount}`, 400);

  doc.end();
};