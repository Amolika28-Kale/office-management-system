const PDFDocument = require("pdfkit");

module.exports = (invoice) => {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));

    doc.fontSize(20).text("Pursue Co-Working Space", { align: "center" });
    doc.moveDown();

    doc.fontSize(12).text(`Invoice #: ${invoice.invoiceNumber}`);
    doc.text(`Customer: ${invoice.user.name}`);
    doc.text(`Email: ${invoice.user.email}`);
    doc.text(`Date: ${new Date(invoice.createdAt).toLocaleDateString()}`);

    doc.moveDown();
    doc.fontSize(14).text("Invoice Details", { underline: true });
    doc.moveDown(0.5);

    doc.fontSize(12).text(`Amount: ₹${invoice.amount}`);
    doc.text(`Status: ${invoice.status}`);

    doc.end();
  });
};
