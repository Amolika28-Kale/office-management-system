import { useEffect, useState } from "react";
import { 
  LucideFileText, 
  LucideDownload, 
  LucideEye, 
  LucideSearch, 
  LucideMail,
  LucideTrendingUp,
  LucideClock,
  LucideCheckCircle
} from "lucide-react";
import { fetchInvoices } from "../../services/adminInvoiceService";

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

  const filteredInvoices = invoices.filter(inv => 
    inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
    inv.user?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER & METRICS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Invoice Management</h1>
          <p className="text-slate-500 font-medium">Review, track, and issue billing documents</p>
        </div>
        
      </div>

      {/* FILTERS */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <LucideSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search by Invoice # or Customer..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 transition-all active:scale-95">
          <LucideFileText size={18} />
          Generate New
        </button>
      </div>

      {/* CONTENT TABLE */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-20 flex justify-center"><div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full"></div></div>
        ) : (
          <>
            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-[11px] font-black uppercase tracking-widest text-slate-400">
                    <th className="px-8 py-5">Invoice #</th>
                    <th className="px-8 py-5">Customer</th>
                    <th className="px-8 py-5">Amount</th>
                    <th className="px-8 py-5">Status</th>
                    <th className="px-8 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredInvoices.map(inv => (
                    <tr key={inv._id} className="group hover:bg-slate-50/80 transition-colors">
                      <td className="px-8 py-5 font-bold text-indigo-600">#{inv.invoiceNumber}</td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold uppercase">
                            {inv.user?.name?.substring(0,2)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800 leading-none">{inv.user?.name}</p>
                            <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-tighter">
                               {new Date(inv.issuedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <p className="text-sm font-black text-slate-900">₹{inv.amount?.toLocaleString()}</p>
                      </td>
                      <td className="px-8 py-5">
                        <StatusBadge status={inv.status || 'sent'} />
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <IconButton icon={<LucideEye size={16} />} color="blue" />
                          <IconButton icon={<LucideDownload size={16} />} color="slate" />
                          <IconButton icon={<LucideMail size={16} />} color="indigo" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className="md:hidden divide-y divide-slate-50">
              {filteredInvoices.map(inv => (
                <div key={inv._id} className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-black text-indigo-600 uppercase tracking-widest">#{inv.invoiceNumber}</p>
                      <h4 className="font-bold text-slate-900 mt-1">{inv.user?.name}</h4>
                    </div>
                    <StatusBadge status={inv.status || 'sent'} />
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Total Amount</p>
                      <p className="text-lg font-black text-slate-900">₹{inv.amount}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 bg-slate-100 text-slate-600 rounded-lg"><LucideEye size={18}/></button>
                      <button className="p-2 bg-indigo-600 text-white rounded-lg"><LucideDownload size={18}/></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* HELPER COMPONENTS */

const MetricBadge = ({ icon, label, value, color }) => {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
    rose: "bg-rose-50 text-rose-600",
  };
  return (
    <div className={`flex items-center gap-3 px-4 py-2 rounded-2xl border border-white/50 shadow-sm ${colors[color]}`}>
      <span className="p-1.5 bg-white/60 rounded-lg shadow-sm">{icon}</span>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest leading-none opacity-70">{label}</p>
        <p className="text-sm font-black mt-0.5">{value}</p>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const isPaid = status === 'paid';
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
      isPaid ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
    }`}>
      {status}
    </span>
  );
};

const IconButton = ({ icon, color }) => {
  const colors = {
    blue: "text-blue-600 hover:bg-blue-50",
    indigo: "text-indigo-600 hover:bg-indigo-50",
    slate: "text-slate-500 hover:bg-slate-100",
  };
  return (
    <button className={`p-2 rounded-xl transition-colors ${colors[color]}`}>
      {icon}
    </button>
  );
};