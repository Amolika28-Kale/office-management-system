import { useEffect, useState } from "react";
import { 
  LucideCreditCard, 
  LucideCheckCircle, 
  LucideClock, 
  LucideAlertCircle, 
  LucidePlus,
  LucideArrowRight
} from "lucide-react";
import { getUserPayments, getPaymentStats } from "../../user/services/paymentService";
import MakePaymentModal from "../components/MakePaymentModal";

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    pending: 0,
    completed: 0,
    failed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [paymentsRes, statsRes] = await Promise.all([
        getUserPayments(),
        getPaymentStats()
      ]);

      setPayments(paymentsRes?.data?.data || []);
      setStats(statsRes?.data?.data || {});
    } catch (err) {
      console.error("Failed to load payments", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Payments</h2>
          <p className="text-gray-500 mt-1 font-medium">Manage and track your financial transactions</p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-100 active:scale-95"
        >
          <LucidePlus size={20} />
          Make Payment
        </button>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Paid" 
          value={`₹${stats.totalRevenue}`} 
          icon={<LucideCreditCard />} 
          color="blue" 
        />
        <StatCard 
          title="Pending" 
          value={stats.pending} 
          icon={<LucideClock />} 
          color="amber" 
        />
        <StatCard 
          title="Completed" 
          value={stats.completed} 
          icon={<LucideCheckCircle />} 
          color="emerald" 
        />
        <StatCard 
          title="Failed" 
          value={stats.failed} 
          icon={<LucideAlertCircle />} 
          color="red" 
        />
      </div>

      {/* TRANSACTIONS TABLE */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">Recent Transactions</h3>
          <button className="text-sm text-indigo-600 font-semibold hover:underline flex items-center gap-1">
            Download All <LucideArrowRight size={14} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-xs font-bold text-gray-400 uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">Booking Info</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4 hidden md:table-cell">Date</th>
                <th className="px-6 py-4 hidden lg:table-cell">Method</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <TableSkeleton rows={5} />
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <LucideCreditCard size={40} className="text-gray-200" />
                      <p className="text-gray-400 font-medium">No payments found in your history.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                          {p.booking?.space?.name || "Workspace Fee"}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">{p.booking?.space?.type || 'Standard'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">₹{p.totalAmount}</td>
                    <td className="px-6 py-4 hidden md:table-cell text-sm text-gray-600">
                      {new Date(p.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell text-sm text-gray-500 italic">
                      {p.method}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <StatusBadge status={p.status} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {open && (
        <MakePaymentModal
          close={() => {
            setOpen(false);
            loadData();
          }}
        />
      )}
    </div>
  );
}

/* -------------------- REFINED UI COMPONENTS -------------------- */

const StatCard = ({ title, value, icon, color }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-600",
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${colors[color]}`}>
          {icon}
        </div>
        <span className="text-xs font-bold text-gray-400 uppercase tracking-tight">Real-time</span>
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-500">{title}</p>
        <h3 className="text-2xl font-black text-gray-900 mt-1">{value}</h3>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const styles = {
    completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
    pending: "bg-amber-100 text-amber-700 border-amber-200",
    failed: "bg-red-100 text-red-700 border-red-200",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${styles[status] || "bg-gray-100 text-gray-700"}`}>
      {status}
    </span>
  );
};

const TableSkeleton = ({ rows }) => (
  <>
    {[...Array(rows)].map((_, i) => (
      <tr key={i} className="animate-pulse">
        <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-3/4"></div></td>
        <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-1/2"></div></td>
        <td className="px-6 py-4 hidden md:table-cell"><div className="h-4 bg-gray-100 rounded w-1/2"></div></td>
        <td className="px-6 py-4 hidden lg:table-cell"><div className="h-4 bg-gray-100 rounded w-1/3"></div></td>
        <td className="px-6 py-4"><div className="h-6 bg-gray-100 rounded-full w-20 mx-auto"></div></td>
      </tr>
    ))}
  </>
);