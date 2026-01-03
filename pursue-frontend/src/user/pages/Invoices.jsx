import { useEffect, useState } from "react";
import {
  LucideFileText,
  LucideDownload,
  LucideEye,
  LucideSearch,
  LucideFilter,
} from "lucide-react";
import { downloadInvoicePDF, getMyInvoices } from "../services/invoiceService";
import InvoicePreviewModal from "../components/InvoicePreviewModal";

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const res = await getMyInvoices();
      setInvoices(res || []);
    } catch (err) {
      console.error("Failed to load invoices", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (invoice) => {
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

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.booking?.spaceId?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900">Invoices</h2>
          <p className="text-slate-500 mt-1 font-medium">
            Access and download your billing history
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <LucideSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search Invoice #..."
              className="pl-10 pr-4 py-2 border rounded-xl text-sm w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button className="p-2 border rounded-xl">
            <LucideFilter size={20} />
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-6 py-4 text-left">Invoice</th>
              <th className="px-6 py-4 hidden md:table-cell">Date</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <SkeletonRows />
            ) : filteredInvoices.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-16 text-center text-slate-400">
                  No invoices found
                </td>
              </tr>
            ) : (
              filteredInvoices.map((inv) => (
                <tr key={inv._id} className="border-t hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <p className="font-bold">{inv.invoiceNumber}</p>
                    <p className="text-xs text-slate-500">
                      {inv.booking?.spaceId?.name || "Workspace"}
                    </p>
                  </td>

                  <td className="px-6 py-4 hidden md:table-cell">
                    {new Date(inv.issueDate).toLocaleDateString("en-IN")}
                  </td>

                  <td className="px-6 py-4 font-bold">
                    ₹{inv.totalAmount.toLocaleString()}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        inv.status === "paid"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <button
                      onClick={() => setSelected(inv._id)}
                      className="px-3 py-1 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                    >
                      <LucideEye size={16} />
                    </button>

                    <button
                      onClick={() => handleDownload(inv)}
                      className="px-3 py-1 hover:bg-slate-100 rounded-lg"
                    >
                      <LucideDownload size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <InvoicePreviewModal
          invoiceId={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

const SkeletonRows = () => (
  <>
    {[1, 2, 3].map((i) => (
      <tr key={i} className="animate-pulse">
        <td className="px-6 py-6 bg-slate-100"></td>
        <td className="px-6 py-6 bg-slate-100 hidden md:table-cell"></td>
        <td className="px-6 py-6 bg-slate-100"></td>
        <td className="px-6 py-6 bg-slate-100"></td>
        <td className="px-6 py-6 bg-slate-100"></td>
      </tr>
    ))}
  </>
);
