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

  /* ================= HEADER ================= */
  doc
    .fontSize(20)
    .font("Helvetica-Bold")
    .text("INVOICE", 50, 50);

  doc
    .fontSize(10)
    .font("Helvetica")
    .text("Pursue Co-working Space", 350, 50, { align: "right" })
    .text("Mumbai, Maharashtra", { align: "right" })
    .text("GST: 27AABCU9603R1ZM", { align: "right" });

  doc.moveDown(2);

  /* ================= INVOICE INFO ================= */
  doc
    .fontSize(10)
    .text(`Invoice #: ${invoice.invoiceNumber}`)
    .text(
      `Date: ${invoice.issueDate.toLocaleDateString("en-IN")}`
    );

  doc.moveDown();

  /* ================= BILL TO ================= */
  doc.font("Helvetica-Bold").text("Bill To:");
  doc.font("Helvetica");
  doc.text(invoice.user.name);
  doc.text(invoice.user.email);

  doc.moveDown(2);

  /* ================= TABLE HEADER ================= */
  const tableTop = doc.y;
  const descX = 50;
  const periodX = 300;
  const amountX = 450;

  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .text("Description", descX, tableTop)
    .text("Period", periodX, tableTop)
    .text("Amount", amountX, tableTop, { align: "right" });

  doc.moveDown();
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();

  /* ================= TABLE ROWS ================= */
  doc.font("Helvetica").fontSize(10);

  const startDate = invoice.booking?.startDate
    ? new Date(invoice.booking.startDate).toLocaleDateString("en-IN")
    : "-";

  const endDate = invoice.booking?.endDate
    ? new Date(invoice.booking.endDate).toLocaleDateString("en-IN")
    : "-";

  doc.moveDown(0.8);
  doc
    .text(
      `${invoice.booking.spaceId.name} – Monthly Rent`,
      descX
    )
    .text(`${startDate} - ${endDate}`, periodX)
    .text(`₹${invoice.amount}`, amountX, doc.y, {
      align: "right",
    });

  doc.moveDown();
  doc
    .text("GST (18%)", descX)
    .text("-", periodX)
    .text(`₹${invoice.gst}`, amountX, doc.y, {
      align: "right",
    });

  doc.moveDown(2);

  /* ================= TOTALS ================= */
  const totalsX = 350;

  doc
    .font("Helvetica")
    .text("Subtotal:", totalsX)
    .text(`₹${invoice.amount}`, 500, doc.y - 12, {
      align: "right",
    });

  doc.moveDown(0.5);
  doc
    .text("Tax:", totalsX)
    .text(`₹${invoice.gst}`, 500, doc.y - 12, {
      align: "right",
    });

  doc.moveDown(0.8);
  doc.font("Helvetica-Bold");
  doc
    .text("Total:", totalsX)
    .text(`₹${invoice.totalAmount}`, 500, doc.y - 12, {
      align: "right",
    });

  doc.moveDown(3);

  /* ================= FOOTER ================= */
  doc
    .font("Helvetica")
    .fontSize(10)
    .text(
      "Thank you for choosing Pursue Co-Working Space",
      { align: "center" }
    );

  doc.end();
};
