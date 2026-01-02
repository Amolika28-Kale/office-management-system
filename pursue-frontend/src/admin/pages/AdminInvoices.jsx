import { useEffect, useState } from "react";
import {
  LucideFileText,
  LucideDownload,
  LucideEye,
  LucideSearch,
} from "lucide-react";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";

import { fetchInvoices } from "../../services/adminInvoiceService";

export default function AdminInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewInvoice, setViewInvoice] = useState(null);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const res = await fetchInvoices();
      setInvoices(res.data.data || []);
    } catch (err) {
      console.error("Error fetching invoices", err);
    } finally {
      setLoading(false);
    }
  };

  /* SEARCH */
  const filteredInvoices = invoices.filter((inv) => {
    const q = search.toLowerCase();
    return (
      inv.invoiceNumber?.toLowerCase().includes(q) ||
      inv.user?.name?.toLowerCase().includes(q) ||
      inv.status?.toLowerCase().includes(q) ||
      String(inv.amount || "").includes(q)
    );
  });

  /* VIEW (MODAL) */
  const handleView = (invoice) => {
    setViewInvoice(invoice);
  };

  /* DOWNLOAD PDF (FRONTEND ONLY) */
  const handleDownload = (inv) => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("INVOICE", 20, 20);

    doc.setFontSize(12);
    doc.text(`Invoice #: ${inv.invoiceNumber}`, 20, 40);
    doc.text(`Customer: ${inv.user?.name}`, 20, 50);
    doc.text(`Amount: ₹${inv.amount}`, 20, 60);
    doc.text(`Status: ${inv.status}`, 20, 70);
    doc.text(
      `Date: ${new Date(inv.createdAt).toDateString()}`,
      20,
      80
    );

    doc.save(`Invoice-${inv.invoiceNumber}.pdf`);
  };

  /* GENERATE NEW → EXCEL (FRONTEND ONLY) */
  const handleGenerateNew = () => {
    if (!invoices.length) return;

    const data = invoices.map((inv, index) => ({
      "Sr No": index + 1,
      "Invoice #": inv.invoiceNumber,
      "Customer": inv.user?.name,
      "Amount (₹)": inv.amount,
      "Status": inv.status,
      "Date": new Date(inv.createdAt).toLocaleDateString("en-IN"),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Invoices");

    XLSX.writeFile(workbook, "invoices-report.xlsx");
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-black">Invoice Management</h1>
        <p className="text-slate-500">
          Review, track, and issue billing documents
        </p>
      </div>

      {/* SEARCH + GENERATE */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <LucideSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search invoice, customer, amount..."
            className="w-full pl-10 pr-4 py-3 border rounded-2xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button
          onClick={handleGenerateNew}
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex gap-2"
        >
          <LucideFileText size={18} />
          Generate New
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl border overflow-hidden">
        {loading ? (
          <div className="p-20 text-center">Loading...</div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 text-xs uppercase">
              <tr>
                <th className="p-4">Invoice #</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((inv) => (
                <tr key={inv._id} className="border-t">
                  <td className="p-4 font-bold text-indigo-600">
                    #{inv.invoiceNumber}
                  </td>
                  <td className="p-4">{inv.user?.name}</td>
                  <td className="p-4 font-bold">₹{inv.amount}</td>
                  <td className="p-4">
                    <StatusBadge status={inv.status || "sent"} />
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <IconButton
                        icon={<LucideEye size={16} />}
                        color="blue"
                        onClick={() => handleView(inv)}
                      />
                      <IconButton
                        icon={<LucideDownload size={16} />}
                        color="slate"
                        onClick={() => handleDownload(inv)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* VIEW MODAL */}
      {viewInvoice && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 space-y-4">
            <h2 className="text-xl font-black">
              Invoice #{viewInvoice.invoiceNumber}
            </h2>

            <div className="text-sm space-y-2">
              <p><b>Customer:</b> {viewInvoice.user?.name}</p>
              <p><b>Amount:</b> ₹{viewInvoice.amount}</p>
              <p><b>Status:</b> {viewInvoice.status}</p>
              <p>
                <b>Date:</b>{" "}
                {new Date(viewInvoice.createdAt).toDateString()}
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setViewInvoice(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* HELPERS */

const StatusBadge = ({ status }) => (
  <span
    className={`px-3 py-1 rounded-full text-xs font-bold ${
      status === "paid"
        ? "bg-emerald-50 text-emerald-600"
        : "bg-amber-50 text-amber-600"
    }`}
  >
    {status}
  </span>
);

const IconButton = ({ icon, color, onClick }) => {
  const colors = {
    blue: "text-blue-600 hover:bg-blue-50",
    slate: "text-slate-500 hover:bg-slate-100",
  };

  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-xl transition ${colors[color]}`}
    >
      {icon}
    </button>
  );
};
