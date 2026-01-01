import { useEffect, useState } from "react";
import { downloadInvoicePDF, getInvoiceById } from "../services/invoiceService";

export default function InvoicePreviewModal({ invoiceId, close }) {
  const [invoice, setInvoice] = useState(null);
const handleDownload = async () => {
  const blob = await downloadInvoicePDF(invoice._id);
  const url = window.URL.createObjectURL(new Blob([blob]));
  const link = document.createElement("a");

  link.href = url;
  link.download = `${invoice.invoiceNumber}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
};
  useEffect(() => {
    load();
  }, [invoiceId]);

  const load = async () => {
    const res = await getInvoiceById(invoiceId);
    setInvoice(res); // ✅ FIXED
  };

  if (!invoice) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-white w-[700px] max-h-[90vh] overflow-y-auto rounded p-6">
        <div className="flex justify-between mb-4">
          <h3 className="text-xl font-bold">INVOICE</h3>
          <button onClick={close}>✕</button>
        </div>

        <p className="text-sm text-gray-600">
          Invoice #: {invoice.invoiceNumber}
        </p>

        <hr className="my-4" />

        <div className="flex justify-between text-sm">
          <div>
            <p className="font-semibold">Bill To</p>
            <p>{invoice.user?.name}</p>
            <p>{invoice.user?.email}</p>
          </div>

          <div>
            <p>Issue Date: {new Date(invoice.issueDate).toDateString()}</p>
            <p>Status: {invoice.status}</p>
          </div>
        </div>

        <table className="w-full mt-6 text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Description</th>
              <th className="text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2">
                {invoice.booking?.spaceId?.name} – Monthly Rent
              </td>
              <td className="text-right">₹{invoice.amount}</td>
            </tr>
            <tr className="border-b">
              <td className="py-2">GST (18%)</td>
              <td className="text-right">₹{invoice.gst}</td>
            </tr>
          </tbody>
        </table>

        <div className="text-right mt-4 font-bold">
          Total: ₹{invoice.totalAmount}
        </div>

        <div className="flex justify-end gap-3 mt-6">
         <button
  onClick={handleDownload}
  className="border px-4 py-2 rounded"
>
  Download PDF
</button>

          {/* <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Send Email
          </button> */}
        </div>
      </div>
    </div>
  );
}
