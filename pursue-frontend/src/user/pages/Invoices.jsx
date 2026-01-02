import { useEffect, useState } from "react";
import { 
  LucideFileText, 
  LucideDownload, 
  LucideEye, 
  LucideSearch, 
  LucideFilter,
  LucideArrowUpDown
} from "lucide-react";
import { getMyInvoices } from "../services/invoiceService";
import InvoicePreviewModal from "../components/InvoicePreviewModal";

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
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

  const filteredInvoices = invoices.filter(inv => 
    inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
    inv.booking?.spaceId?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6 animate-in fade-in duration-500">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Invoices</h2>
          <p className="text-slate-500 mt-1 font-medium">Access and download your billing history</p>
        </div>

        <div className="flex items-center gap-3">
           <div className="relative">
              <LucideSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text"
                placeholder="Search Invoice #..."
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none w-full md:w-64"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
           </div>
           <button className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors">
             <LucideFilter size={20} />
           </button>
        </div>
      </div>

      {/* INVOICE LIST */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-slate-50/50 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-4 border-b border-slate-100">Invoice Details</th>
                <th className="px-6 py-4 border-b border-slate-100 hidden md:table-cell">Issue Date</th>
                <th className="px-6 py-4 border-b border-slate-100">Amount</th>
                <th className="px-6 py-4 border-b border-slate-100 text-center">Status</th>
                <th className="px-6 py-4 border-b border-slate-100 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <SkeletonRows />
              ) : filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-20 text-center">
                    <LucideFileText className="mx-auto text-slate-200 mb-4" size={48} />
                    <p className="text-slate-400 font-medium">No invoices found</p>
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv._id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center shrink-0">
                          <LucideFileText size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 uppercase text-sm">{inv.invoiceNumber}</p>
                          <p className="text-xs text-slate-500">{inv.booking?.spaceId?.name || "Workspace Service"}</p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 hidden md:table-cell">
                      <p className="text-sm text-slate-600 font-medium">
                        {new Date(inv.issueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm font-black text-slate-900">₹{inv.totalAmount.toLocaleString()}</p>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                         <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${
                           inv.status === 'paid' 
                           ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                           : 'bg-amber-50 text-amber-600 border-amber-100'
                         }`}>
                           {inv.status}
                         </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setSelected(inv._id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          <LucideEye size={14} />
                          <span className="hidden sm:inline">View</span>
                        </button>
                        <button
                          className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <LucideDownload size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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

/* SKELETON LOADER */
const SkeletonRows = () => (
  <>
    {[1, 2, 3].map((i) => (
      <tr key={i} className="animate-pulse">
        <td className="px-6 py-6"><div className="h-4 bg-slate-100 rounded w-3/4"></div></td>
        <td className="px-6 py-6 hidden md:table-cell"><div className="h-4 bg-slate-100 rounded w-1/2"></div></td>
        <td className="px-6 py-6"><div className="h-4 bg-slate-100 rounded w-1/4"></div></td>
        <td className="px-6 py-6"><div className="h-6 bg-slate-100 rounded-full w-16 mx-auto"></div></td>
        <td className="px-6 py-6"><div className="h-4 bg-slate-100 rounded w-1/4 ml-auto"></div></td>
      </tr>
    ))}
  </>
);