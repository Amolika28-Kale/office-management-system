import { useEffect, useState } from "react";
import { 
  LucideArrowUpRight, 
  LucideDownload, 
  LucideSearch, 
  LucideFilter, 
  LucideUser, 
  LucideCircleDollarSign,
  LucideLoader2
} from "lucide-react";
import { fetchPayments } from "../../services/adminPaymentService";

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const res = await fetchPayments();
      setPayments(res.data.data || []);
    } catch (err) {
      console.error("Error loading payments", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter(p => 
    p.user?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER & ACTIONS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Revenue Tracker</h1>
          <p className="text-slate-500 font-medium">Monitor and manage all system-wide transactions</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-slate-200">
          <LucideDownload size={18} />
          Export Report
        </button>
      </div>

     

      {/* SEARCH & FILTERS */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative w-full sm:w-96">
          <LucideSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search by customer name..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 text-slate-600 font-bold text-sm hover:bg-slate-50 px-4 py-2 rounded-lg transition-colors">
          <LucideFilter size={18} />
          Filters
        </button>
      </div>

      {/* DATA TABLE / MOBILE CARDS */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-20 flex justify-center"><LucideLoader2 className="animate-spin text-indigo-600" size={40} /></div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-[11px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                    <th className="px-8 py-5">Customer</th>
                    <th className="px-8 py-5">Amount</th>
                    <th className="px-8 py-5">Status</th>
                    <th className="px-8 py-5">Method</th>
                    <th className="px-8 py-5 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredPayments.map(p => (
                    <tr key={p._id} className="group hover:bg-indigo-50/30 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                            {p.user?.name?.charAt(0)}
                          </div>
                          <span className="font-bold text-slate-800">{p.user?.name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 font-black text-slate-900">₹{p.amount?.toLocaleString()}</td>
                      <td className="px-8 py-5">
                        <StatusPill status={p.status} />
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter bg-slate-100 px-2 py-1 rounded">
                          {p.method}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right text-slate-500 text-sm font-medium">
                        {new Date(p.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-slate-100">
              {filteredPayments.map(p => (
                <div key={p._id} className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                        {p.user?.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{p.user?.name}</p>
                        <p className="text-xs text-slate-400">{new Date(p.createdAt).toDateString()}</p>
                      </div>
                    </div>
                    <StatusPill status={p.status} />
                  </div>
                  <div className="flex justify-between items-end pt-2">
                    <div>
                      <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Amount Paid</p>
                      <p className="text-xl font-black text-slate-900">₹{p.amount}</p>
                    </div>
                    <span className="text-xs font-bold text-slate-500 italic">{p.method}</span>
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

const AdminStatCard = ({ title, value, growth, color = "emerald" }) => {
  const colors = {
    emerald: "text-emerald-600 bg-emerald-50",
    amber: "text-amber-600 bg-amber-50",
    indigo: "text-indigo-600 bg-indigo-50",
  };
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
      <p className="text-sm font-bold text-slate-500 mb-2">{title}</p>
      <div className="flex items-end justify-between">
        <h3 className="text-3xl font-black text-slate-900 leading-none">{value}</h3>
        {growth && (
          <span className={`text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1 ${colors.emerald}`}>
            <LucideArrowUpRight size={14} /> {growth}
          </span>
        )}
      </div>
    </div>
  );
};

const StatusPill = ({ status }) => (
  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
    status === "paid" 
    ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
    : "bg-amber-50 text-amber-600 border-amber-100"
  }`}>
    {status}
  </span>
);