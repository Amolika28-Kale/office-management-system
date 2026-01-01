import { useEffect, useMemo, useState } from "react";
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

const fetchBookings = async () => {
  try {
    const res = await getMyBookings();
    const data = Array.isArray(res) ? res : res?.data || [];
    setBookings(data);
  } catch (err) {
    console.error("Failed to load bookings", err);
    setBookings([]);
  }
};

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    await deleteBooking(id);
    fetchBookings();
  };

  /* FILTER */
const filteredBookings = useMemo(() => {
  if (!Array.isArray(bookings)) return [];

  return bookings.filter((b) => {
    const matchTab =
      activeTab === "all" ||
      b.spaceId?.type === activeTab;

    const keyword = search.toLowerCase();
    const matchSearch =
      b.spaceId?.name?.toLowerCase().includes(keyword);

    return matchTab && matchSearch;
  });
  
}, [bookings, activeTab, search]);

useEffect(() => {
  console.log("Bookings UI:", filteredBookings);
}, [filteredBookings]);

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold">My Bookings</h2>
          <p className="text-gray-500">
            Manage and track all space bookings
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedBooking(null);
            setOpen(true);
          }}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium"
        >
          + New Booking
        </button>
      </div>

      {/* TABS */}
      <div className="flex gap-6 border-b mb-4 text-sm font-medium">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setActiveTab(t.value)}
            className={`pb-2 ${
              activeTab === t.value
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* SEARCH */}
      <input
        placeholder="Search bookings..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded px-4 py-2 mb-4 w-full"
      />

      {/* TABLE */}
      <BookingTable
        bookings={filteredBookings}
        onEdit={(b) => {
          setSelectedBooking(b);
          setOpen(true);
        }}
        onDelete={handleDelete}
      />

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
