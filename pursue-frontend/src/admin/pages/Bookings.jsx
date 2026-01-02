import { useEffect, useMemo, useState } from "react";
import { 
  LucidePlus, LucideSearch, LucideEye, LucideCheck, 
  LucidePlay, LucideCheckCircle2, LucideXCircle, 
  LucideFilter, LucideCalendar 
} from "lucide-react";
import { fetchBookings, cancelBooking, updateBookingStatus } from "../../services/bookingService";
import { useNavigate } from "react-router-dom";

const TABS = [
  { label: "All Bookings", value: "all" },
  { label: "Cabins", value: "cabin" },
  { label: "Desks", value: "desk" },
  { label: "Conference Rooms", value: "conference" },
];

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const loadBookings = async () => {
    setLoading(true);
    try {
      const res = await fetchBookings({ limit: 200 });
      setBookings(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadBookings(); }, []);

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchTab = activeTab === "all" || b.space?.type === activeTab;
      const keyword = search.toLowerCase();
      const matchSearch = b.userName?.toLowerCase().includes(keyword) || b.space?.name?.toLowerCase().includes(keyword);
      return matchTab && matchSearch;
    });
  }, [bookings, activeTab, search]);

  const countByType = (type) => bookings.filter((b) => b.space?.type === type).length;

  const updateStatus = async (id, status) => {
    await updateBookingStatus(id, { status });
    loadBookings();
  };

  const cancel = async (id) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    await cancelBooking(id);
    loadBookings();
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Booking Management</h1>
          <p className="text-slate-500 font-medium">Review and process workspace reservations</p>
        </div>
        <button
          onClick={() => navigate("/admin/bookings/add")}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-100 active:scale-95"
        >
          <LucidePlus size={20} />
          New Booking
        </button>
      </div>

      {/* TABS & COUNTERS */}
      <div className="flex p-1 bg-slate-100 rounded-2xl w-fit overflow-x-auto no-scrollbar">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setActiveTab(t.value)}
            className={`flex items-center gap-2 px-6 py-2.5 text-sm font-bold rounded-xl transition-all whitespace-nowrap ${
              activeTab === t.value ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {t.label}
            {t.value !== "all" && (
              <span className={`px-2 py-0.5 rounded-md text-[10px] ${activeTab === t.value ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-200 text-slate-500'}`}>
                {countByType(t.value)}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* SEARCH BAR */}
      <div className="relative group max-w-2xl">
        <LucideSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
        <input
          placeholder="Search by user or space name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-sm"
        />
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-20 flex justify-center"><div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full"></div></div>
        ) : filteredBookings.length === 0 ? (
          <div className="p-20 text-center text-slate-400 font-medium">No reservations found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-[11px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Resource</th>
                  <th className="px-6 py-4">Dates</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredBookings.map((b) => (
                  <tr key={b._id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{b.userName}</div>
                      <div className="text-xs text-slate-400 font-medium">{b.userEmail}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-700">{b.space?.name}</div>
                      <div className="text-[10px] uppercase font-black text-indigo-500 tracking-tighter">{b.space?.type}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                        <LucideCalendar size={14} className="text-slate-300" />
                        {new Date(b.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                        <span className="text-slate-300">→</span>
                        {new Date(b.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-black text-slate-900">₹{b.totalAmount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={b.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ActionButton icon={<LucideEye size={16} />} onClick={() => navigate(`/admin/bookings/${b._id}`)} title="View" color="slate" />
                        {b.status === "pending" && <ActionButton icon={<LucideCheck size={16} />} onClick={() => updateStatus(b._id, "approved")} title="Approve" color="blue" />}
                        {b.status === "approved" && <ActionButton icon={<LucidePlay size={16} />} onClick={() => updateStatus(b._id, "active")} title="Activate" color="emerald" />}
                        {b.status === "active" && <ActionButton icon={<LucideCheckCircle2 size={16} />} onClick={() => updateStatus(b._id, "completed")} title="Complete" color="indigo" />}
                        {b.status !== "completed" && b.status !== "cancelled" && <ActionButton icon={<LucideXCircle size={16} />} onClick={() => cancel(b._id)} title="Cancel" color="rose" />}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* SUB-COMPONENTS */

const StatusBadge = ({ status }) => {
  const styles = {
    pending: "bg-amber-50 text-amber-700 border-amber-100",
    approved: "bg-blue-50 text-blue-700 border-blue-100",
    active: "bg-emerald-50 text-emerald-700 border-emerald-100",
    completed: "bg-slate-100 text-slate-600 border-slate-200",
    cancelled: "bg-rose-50 text-rose-700 border-rose-100",
  };
  return (
    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border ${styles[status]}`}>
      {status}
    </span>
  );
};

const ActionButton = ({ icon, onClick, title, color }) => {
  const colors = {
    slate: "text-slate-400 hover:bg-slate-100 hover:text-slate-600",
    blue: "text-blue-500 hover:bg-blue-50 hover:text-blue-600",
    emerald: "text-emerald-500 hover:bg-emerald-50 hover:text-emerald-600",
    indigo: "text-indigo-500 hover:bg-indigo-50 hover:text-indigo-600",
    rose: "text-rose-500 hover:bg-rose-50 hover:text-rose-600",
  };
  return (
    <button onClick={onClick} title={title} className={`p-2 rounded-lg transition-all ${colors[color]}`}>
      {icon}
    </button>
  );
};