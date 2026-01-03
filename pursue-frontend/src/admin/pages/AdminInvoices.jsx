import { useEffect, useState } from "react";
import {
  LucideFileText,
  LucideDownload,
  LucideEye,
  LucideSearch,
} from "lucide-react";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import "jspdf-autotable";
import { fetchInvoices } from "../../services/adminInvoiceService";
import InvoicePreviewModal from "../components/InvoicePreviewModal";
import autoTable from "jspdf-autotable";

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
                        onClick={() => downloadPDF(inv)}
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
  <InvoicePreviewModal
    invoice={viewInvoice}
    onClose={() => setViewInvoice(null)}
  />
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
