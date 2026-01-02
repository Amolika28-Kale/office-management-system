import { useEffect, useMemo, useState } from "react";
import { LucidePlus, LucideSearch, LucideCalendarDays, LucideFilter } from "lucide-react";
import BookingModal from "../components/BookingModal";
import BookingTable from "../components/BookingTable";
import { getMyBookings, deleteBooking } from "../services/bookingService";

const TABS = [
  { label: "All Bookings", value: "all" },
  { label: "Cabins", value: "cabin" },
  { label: "Desks", value: "desk" },
  { label: "Conference Rooms", value: "conference" },
];

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await getMyBookings();
      const data = Array.isArray(res) ? res : res?.data || [];
      setBookings(data);
    } catch (err) {
      console.error("Failed to load bookings", err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    await deleteBooking(id);
    fetchBookings();
  };

  const filteredBookings = useMemo(() => {
    if (!Array.isArray(bookings)) return [];
    return bookings.filter((b) => {
      const matchTab = activeTab === "all" || b.spaceId?.type?.toLowerCase() === activeTab;
      const matchSearch = b.spaceId?.name?.toLowerCase().includes(search.toLowerCase());
      return matchTab && matchSearch;
    });
  }, [bookings, activeTab, search]);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6 animate-in fade-in duration-500">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
            <LucideCalendarDays size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Bookings</h2>
            <p className="text-sm text-gray-500">Manage and track your workspace reservations</p>
          </div>
        </div>
        <button
          onClick={() => {
            setSelectedBooking(null);
            setOpen(true);
          }}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-blue-100 active:scale-95"
        >
          <LucidePlus size={20} />
          <span>New Booking</span>
        </button>
      </div>

      {/* FILTERS & SEARCH BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* TABS */}
        <div className="flex p-1 bg-gray-100/80 rounded-xl w-fit overflow-x-auto no-scrollbar">
          {TABS.map((t) => (
            <button
              key={t.value}
              onClick={() => setActiveTab(t.value)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                activeTab === t.value
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* SEARCH INPUT */}
        <div className="relative flex-1 md:max-w-xs">
          <LucideSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by space name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm"
          />
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-gray-500 font-medium">Loading your bookings...</p>
          </div>
        ) : filteredBookings.length > 0 ? (
          <div className="overflow-x-auto">
            <BookingTable
              bookings={filteredBookings}
              onEdit={(b) => {
                setSelectedBooking(b);
                setOpen(true);
              }}
              onDelete={handleDelete}
            />
          </div>
        ) : (
          <div className="p-16 text-center">
            <div className="inline-flex p-4 bg-gray-50 rounded-full text-gray-400 mb-4">
              <LucideFilter size={32} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">No bookings found</h3>
            <p className="text-gray-500 max-w-xs mx-auto mt-1">
              {search || activeTab !== 'all' 
                ? "We couldn't find any bookings matching your current filters."
                : "You haven't made any bookings yet."}
            </p>
          </div>
        )}
      </div>

      {/* MODAL */}
      {open && (
        <BookingModal
          booking={selectedBooking}
          onClose={() => setOpen(false)}
          onSuccess={fetchBookings}
        />
      )}
    </div>
  );
}