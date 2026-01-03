import { X, Download, Mail } from "lucide-react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";

export default function InvoicePreviewModal({ invoice, onClose }) {
  if (!invoice) return null;

  const subtotal = invoice.amount;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax;


const downloadPDF = (invoice) => {
  const doc = new jsPDF();

  /* SAFE DATA */
  const invoiceNo = invoice.invoiceNumber || "N/A";
  const invoiceDate = invoice.createdAt
    ? new Date(invoice.createdAt).toLocaleDateString("en-IN")
    : "-";

  const customerName = invoice.user?.name || "-";
  const customerEmail = invoice.user?.email || "-";

  const booking = invoice.payment?.booking;

  const spaceName = booking?.spaceName || "Workspace Rent";
  const period =
    booking?.fromDate && booking?.toDate
      ? `${new Date(booking.fromDate).toLocaleDateString(
          "en-IN"
        )} - ${new Date(booking.toDate).toLocaleDateString("en-IN")}`
      : "-";

  const subtotal = Number(invoice.amount || booking?.totalAmount || 0);
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + gst;

  /* HEADER */
  doc.setFontSize(18);
  doc.text("INVOICE", 14, 20);

  doc.setFontSize(11);
  doc.text(`Invoice #: ${invoiceNo}`, 14, 30);
  doc.text(`Date: ${invoiceDate}`, 14, 36);

  /* COMPANY INFO */
  doc.setFontSize(10);
  doc.text("Pursue Co-Working Space", 140, 20);
  doc.text("Mumbai, Maharashtra", 140, 26);
  doc.text("GST: 27AABCU9603R1ZM", 140, 32);

  /* BILL TO */
  doc.setFontSize(11);
  doc.text("Bill To:", 14, 50);
  doc.setFontSize(10);
  doc.text(customerName, 14, 56);
  doc.text(customerEmail, 14, 62);

  /* TABLE */
  autoTable(doc, {
    startY: 75,
    head: [["Description", "Period", "Amount"]],
    body: [
      [spaceName, period, `Rs. ${subtotal}`],
      ["GST (18%)", "-", `Rs. ${gst}`],
    ],
    styles: { fontSize: 10 },
    headStyles: {
      fillColor: [240, 240, 240],
      textColor: [0, 0, 0],
      fontStyle: "bold",
    },
    columnStyles: {
      2: { halign: "right" },
    },
  });

  /* TOTAL */
  const y = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(11);
  doc.text(`Total: Rs. ${total}`, 140, y);

  /* FOOTER */
  doc.setFontSize(10);
  doc.text(
    "Thank you for choosing Pursue Co-Working Space",
    14,
    y + 20
  );

  doc.save(`Invoice-${invoiceNo}.pdf`);
};



  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl overflow-y-auto max-h-[90vh]">
        
        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-lg font-bold">Invoice Preview</h2>
          <button onClick={onClose}>
            <X className="text-gray-500" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-8 space-y-8">
          
          {/* TOP INFO */}
          <div className="flex justify-between">
            <div>
              <h1 className="text-2xl font-black">INVOICE</h1>
              <p className="text-sm mt-2">
                <b>Invoice #:</b> {invoice.invoiceNumber}<br />
                <b>Date:</b>{" "}
                {new Date(invoice.createdAt).toLocaleDateString("en-IN")}
              </p>
            </div>

            <div className="text-sm text-right">
              <p className="font-bold">Pursue Co-working Space</p>
              <p>123 Business Avenue</p>
              <p>Mumbai, Maharashtra 400001</p>
              <p>GST: 27AABCU9603R1ZM</p>
            </div>
          </div>

          {/* BILL TO */}
          <div>
            <p className="font-semibold mb-1">Bill To:</p>
            <p>
              {invoice.user?.name}<br />
              {invoice.user?.email}
            </p>
          </div>

          {/* TABLE */}
          <table className="w-full border-t border-b">
            <thead className="bg-slate-50 text-sm">
              <tr>
                <th className="text-left p-3">Description</th>
                <th className="text-center p-3">Period</th>
                <th className="text-right p-3">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="p-3">
                  {invoice.payment?.booking?.spaceName || "Workspace Rent"}
                </td>
                <td className="text-center p-3">
                  {new Date(
                    invoice.payment?.booking?.fromDate
                  ).toLocaleDateString("en-IN")}{" "}
                  -{" "}
                  {new Date(
                    invoice.payment?.booking?.toDate
                  ).toLocaleDateString("en-IN")}
                </td>
                <td className="text-right p-3">₹{subtotal}</td>
              </tr>

              <tr>
                <td className="p-3">GST (18%)</td>
                <td className="text-center p-3">—</td>
                <td className="text-right p-3">₹{tax}</td>
              </tr>
            </tbody>
          </table>

          {/* TOTALS */}
          <div className="flex justify-end">
            <div className="w-64 text-sm space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>₹{tax}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span>₹{total}</span>
              </div>
            </div>
          </div>

          {/* PAYMENT INFO */}
          <div className="bg-slate-50 p-4 rounded-xl text-sm">
            <p className="font-semibold mb-2">Payment Information</p>
            <p>Status: <b className="text-emerald-600">Paid</b></p>
            <p>Method: {invoice.payment?.method || "UPI"}</p>
            <p>Transaction ID: {invoice.payment?.transactionId}</p>
          </div>

          {/* FOOTER */}
          <div className="text-center text-sm text-gray-500">
            <p>Thank you for your business!</p>
            <p>support@pursue.co</p>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-4 px-6 py-4 border-t">
          <button
            onClick={() => downloadPDF(invoice)}
            className="flex items-center gap-2 px-5 py-2 rounded-xl border font-semibold"
          >
            <Download size={18} /> Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}
