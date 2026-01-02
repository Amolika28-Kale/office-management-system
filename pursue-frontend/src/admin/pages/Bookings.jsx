import { useEffect, useMemo, useState } from "react";
import {
  LucidePlus,
  LucideSearch,
  LucideEye,
  LucideCheck,
  LucidePlay,
  LucideCheckCircle2,
  LucideXCircle,
  LucideCalendar,
} from "lucide-react";
import {
  fetchBookings,
  cancelBooking,
  updateBookingStatus,
} from "../../services/bookingService";
import { useNavigate } from "react-router-dom";

/* ---------------- TABS ---------------- */
const TABS = [
  { label: "All Bookings", value: "all" },
  { label: "Cabins", value: "cabin" },
  { label: "Desks", value: "desk" },
  { label: "Conference Rooms", value: "conference" },
];

/* ---------------- DEBOUNCE HOOK ---------------- */
function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

/* ---------------- MAIN COMPONENT ---------------- */
export default function Bookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const [loading, setLoading] = useState(true);

  /* ---------- LOAD BOOKINGS ---------- */
  const loadBookings = async () => {
    setLoading(true);
    try {
      const res = await fetchBookings({ limit: 500 });
      setBookings(res.data.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  /* ---------- FILTER + SEARCH ---------- */
  const filteredBookings = useMemo(() => {
    const keyword = debouncedSearch.trim().toLowerCase();

    return bookings.filter((b) => {
      const matchesTab =
        activeTab === "all" || b.space?.type === activeTab;

      const matchesSearch =
        !keyword ||
        b.userName?.toLowerCase().includes(keyword) ||
        b.userEmail?.toLowerCase().includes(keyword) ||
        b.space?.name?.toLowerCase().includes(keyword);

      return matchesTab && matchesSearch;
    });
  }, [bookings, activeTab, debouncedSearch]);

  /* ---------- COUNTS ---------- */
  const countByType = (type) =>
    bookings.filter((b) => b.space?.type === type).length;

  /* ---------- ACTIONS ---------- */
  const updateStatus = async (id, status) => {
    await updateBookingStatus(id, { status });
    loadBookings();
  };

  const cancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    await cancelBooking(id);
    loadBookings();
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6 animate-in fade-in duration-500">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">
            Booking Management
          </h1>
          <p className="text-slate-500 font-medium">
            Review and process workspace reservations
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/bookings/add")}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg active:scale-95"
        >
          <LucidePlus size={20} />
          New Booking
        </button>
      </div>

      {/* TABS */}
      <div className="flex p-1 bg-slate-100 rounded-2xl w-fit overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setActiveTab(t.value)}
            className={`flex items-center gap-2 px-6 py-2.5 text-sm font-bold rounded-xl transition-all ${
              activeTab === t.value
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {t.label}
            {t.value !== "all" && (
              <span className="px-2 py-0.5 rounded-md text-[10px] bg-slate-200">
                {countByType(t.value)}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* SEARCH */}
      <div className="relative max-w-2xl">
        <LucideSearch
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by user, email or space name..."
          className="w-full pl-12 pr-4 py-3.5 border rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-20 flex justify-center">
            <div className="h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="p-20 text-center text-slate-400">
            No bookings found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-[11px] font-black uppercase text-slate-400 border-b">
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Space</th>
                  <th className="px-6 py-4">Dates</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredBookings.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="font-bold">{b.userName}</div>
                      <div className="text-xs text-slate-400">
                        {b.userEmail}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-bold">{b.space?.name}</div>
                      <div className="text-[10px] uppercase text-indigo-600 font-black">
                        {b.space?.type}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      <LucideCalendar size={14} className="inline mr-1" />
                      {new Date(b.startDate).toLocaleDateString("en-IN")} →
                      {new Date(b.endDate).toLocaleDateString("en-IN")}
                    </td>

                    <td className="px-6 py-4 font-black">
                      ₹{b.totalAmount.toLocaleString()}
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge status={b.status} />
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <ActionButton
                          icon={<LucideEye size={16} />}
                          onClick={() =>
                            navigate(`/admin/bookings/${b._id}`)
                          }
                          color="slate"
                        />
                        {b.status === "pending" && (
                          <ActionButton
                            icon={<LucideCheck size={16} />}
                            onClick={() =>
                              updateStatus(b._id, "approved")
                            }
                            color="blue"
                          />
                        )}
                        {b.status === "approved" && (
                          <ActionButton
                            icon={<LucidePlay size={16} />}
                            onClick={() =>
                              updateStatus(b._id, "active")
                            }
                            color="emerald"
                          />
                        )}
                        {b.status === "active" && (
                          <ActionButton
                            icon={<LucideCheckCircle2 size={16} />}
                            onClick={() =>
                              updateStatus(b._id, "completed")
                            }
                            color="indigo"
                          />
                        )}
                        {b.status !== "completed" &&
                          b.status !== "cancelled" && (
                            <ActionButton
                              icon={<LucideXCircle size={16} />}
                              onClick={() => cancel(b._id)}
                              color="rose"
                            />
                          )}
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

/* ---------------- UI COMPONENTS ---------------- */

const StatusBadge = ({ status }) => {
  const styles = {
    pending: "bg-amber-50 text-amber-700",
    approved: "bg-blue-50 text-blue-700",
    active: "bg-emerald-50 text-emerald-700",
    completed: "bg-slate-100 text-slate-600",
    cancelled: "bg-rose-50 text-rose-700",
  };
  return (
    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase ${styles[status]}`}>
      {status}
    </span>
  );
};

const ActionButton = ({ icon, onClick, color }) => {
  const colors = {
    slate: "hover:bg-slate-100 text-slate-500",
    blue: "hover:bg-blue-50 text-blue-600",
    emerald: "hover:bg-emerald-50 text-emerald-600",
    indigo: "hover:bg-indigo-50 text-indigo-600",
    rose: "hover:bg-rose-50 text-rose-600",
  };
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-lg transition-all ${colors[color]}`}
    >
      {icon}
    </button>
  );
};
