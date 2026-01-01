import { useEffect, useState } from "react";
import { getMyInvoices } from "../services/invoiceService";
import InvoicePreviewModal from "../components/InvoicePreviewModal";

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await getMyInvoices();
    setInvoices(res); // ✅ FIX HERE
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Invoices</h2>

      <div className="bg-white rounded shadow">
        <table className="w-full">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Invoice #</th>
              <th>Booking</th>
              <th>Amount</th>
              <th>Issue Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {invoices.map((inv) => (
              <tr key={inv._id} className="border-t">
                <td className="p-3">{inv.invoiceNumber}</td>
                <td>{inv.booking?.spaceId?.name || "N/A"}</td>
<td>₹{inv.totalAmount}</td>
                <td>{new Date(inv.issueDate).toLocaleDateString()}</td>
                <td>
                  <span className="px-2 py-1 rounded bg-green-100 text-green-700">
                    {inv.status}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => setSelected(inv._id)}
                    className="text-blue-600"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <InvoicePreviewModal
          invoiceId={selected}
          close={() => setSelected(null)}
        />
      )}
    </div>
  );
}
