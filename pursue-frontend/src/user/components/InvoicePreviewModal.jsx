import { useEffect, useState } from "react";
import {
  getInvoiceById,
  downloadInvoicePDF,
} from "../services/invoiceService";

export default function InvoicePreviewModal({ invoiceId, onClose }) {
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    if (invoiceId) loadInvoice();
  }, [invoiceId]);

  const loadInvoice = async () => {
    const res = await getInvoiceById(invoiceId);
    setInvoice(res);
  };

  const handleDownload = async () => {
    const blob = await downloadInvoicePDF(invoice._id);
    const url = window.URL.createObjectURL(
      new Blob([blob], { type: "application/pdf" })
    );

    const link = document.createElement("a");
    link.href = url;
    link.download = `${invoice.invoiceNumber}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  if (!invoice) return null;

  const amount = Number(invoice.amount || 0);
  const gst = Number(invoice.gst || 0);
  const total = Number(invoice.totalAmount || amount + gst);

  const startDate = invoice.booking?.startDate
    ? new Date(invoice.booking.startDate).toLocaleDateString("en-IN")
    : "-";

  const endDate = invoice.booking?.endDate
    ? new Date(invoice.booking.endDate).toLocaleDateString("en-IN")
    : "-";

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-white w-[820px] max-h-[90vh] overflow-y-auto rounded-xl p-8 shadow-xl">

        {/* HEADER */}
        <div className="flex justify-between items-start mb-10">
          <div>
            <h1 className="text-2xl font-bold mb-2">INVOICE</h1>
             <button onClick={onClose}>
            <X className="text-gray-500" />
          </button>
            <p className="text-sm text-gray-600">
              Invoice #: {invoice.invoiceNumber}
            </p>
            <p className="text-sm text-gray-600">
              Date:{" "}
              {invoice.issueDate
                ? new Date(invoice.issueDate).toLocaleDateString("en-IN")
                : "-"}
            </p>
          </div>

          <div className="text-right text-sm">
            <p className="font-semibold">Pursue Co-working Space</p>
            <p>Mumbai, Maharashtra</p>
            <p>GST: 27AABCU9603R1ZM</p>
          </div>
        </div>

        {/* BILL TO */}
        <div className="mb-8 text-sm">
          <p className="font-semibold mb-1">Bill To:</p>
          <p>{invoice.user?.name || "-"}</p>
          <p>{invoice.user?.email || "-"}</p>
        </div>

        {/* TABLE */}
        <table className="w-full text-sm mb-8 border-collapse">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left p-3">Description</th>
              <th className="text-center p-3">Period</th>
              <th className="text-right p-3">Amount</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-b">
              <td className="p-3">
                {invoice.booking?.spaceId?.name || "Workspace"} – Monthly Rent
              </td>
              <td className="p-3 text-center">
                {startDate} - {endDate}
              </td>
              <td className="p-3 text-right">₹{amount}</td>
            </tr>

            <tr className="border-b">
              <td className="p-3">GST (18%)</td>
              <td className="p-3 text-center">-</td>
              <td className="p-3 text-right">₹{gst}</td>
            </tr>
          </tbody>
        </table>

        {/* TOTALS */}
        <div className="flex justify-end mb-8">
          <div className="w-64 text-sm space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{amount}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>₹{gst}</span>
            </div>
            <div className="flex justify-between font-bold text-base border-t pt-2">
              <span>Total:</span>
              <span>₹{total}</span>
            </div>
          </div>
        </div>

        {/* PAYMENT INFO */}
        <div className="bg-gray-50 rounded-lg p-4 text-sm mb-8">
          <p className="font-semibold mb-2">Payment Information</p>
          <p>Status: {invoice.status}</p>
          <p>Payment Method: {invoice.paymentMethod || "UPI"}</p>
          <p>Transaction ID: {invoice.transactionId || "-"}</p>
        </div>

        {/* FOOTER */}
        <p className="text-center text-sm text-gray-600 mb-8">
          Thank you for your business!
          <br />
          support@pursue.co
        </p>

        {/* ACTIONS */}
        <div className="flex justify-end gap-4">
          <button
            onClick={handleDownload}
            className="border px-6 py-2 rounded-lg hover:bg-gray-100"
          >
            Download PDF
          </button>

        </div>
      </div>
    </div>
  );
}
