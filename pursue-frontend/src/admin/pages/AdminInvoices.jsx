import { useEffect, useState } from "react";
import {
  LucideFileText,
  LucideDownload,
  LucideEye,
  LucideSearch,
  LucideMail
} from "lucide-react";

import {
  fetchInvoices,
  downloadInvoice,
  emailInvoice,
  generateNewInvoice
} from "../../services/adminInvoiceService";

export default function AdminInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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

  /* SEARCH (SAFE & ROBUST) */
  const filteredInvoices = invoices.filter((inv) => {
    const q = search.toLowerCase();
    return (
      inv.invoiceNumber?.toLowerCase().includes(q) ||
      inv.user?.name?.toLowerCase().includes(q) ||
      inv.status?.toLowerCase().includes(q) ||
      String(inv.amount || "").includes(q)
    );
  });

  /* ACTIONS */
  const handleView = (id) => {
    window.open(`/admin/invoices/${id}`, "_blank");
  };

  const handleDownload = async (inv) => {
    try {
      const res = await downloadInvoice(inv._id);
      const url = window.URL.createObjectURL(new Blob([res.data]));

      const link = document.createElement("a");
      link.href = url;
      link.download = `Invoice-${inv.invoiceNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  const handleEmail = async (id) => {
    try {
      await emailInvoice(id);
      alert("Invoice emailed successfully");
    } catch (err) {
      console.error("Email failed", err);
    }
  };

  const handleGenerateNew = async () => {
    try {
      const res = await generateNewInvoice();
      const url = window.URL.createObjectURL(new Blob([res.data]));

      const link = document.createElement("a");
      link.href = url;
      link.download = `New-Invoice-${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Generate invoice failed", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-black">Invoice Management</h1>
        <p className="text-slate-500">Review, track, and issue billing documents</p>
      </div>

      {/* SEARCH + GENERATE */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <LucideSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
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
                        onClick={() => handleView(inv._id)}
                      />
                      <IconButton
                        icon={<LucideDownload size={16} />}
                        color="slate"
                        onClick={() => handleDownload(inv)}
                      />
                      <IconButton
                        icon={<LucideMail size={16} />}
                        color="indigo"
                        onClick={() => handleEmail(inv._id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* HELPERS */

const StatusBadge = ({ status }) => (
  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
    status === "paid"
      ? "bg-emerald-50 text-emerald-600"
      : "bg-amber-50 text-amber-600"
  }`}>
    {status}
  </span>
);

const IconButton = ({ icon, color, onClick }) => {
  const colors = {
    blue: "text-blue-600 hover:bg-blue-50",
    indigo: "text-indigo-600 hover:bg-indigo-50",
    slate: "text-slate-500 hover:bg-slate-100",
  };

  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-xl ${colors[color]}`}
    >
      {icon}
    </button>
  );
};
