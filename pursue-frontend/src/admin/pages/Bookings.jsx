import { useEffect, useMemo, useState } from "react";
import {
  fetchBookings,
  cancelBooking,
  updateBookingStatus,
} from "../../services/bookingService";
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
    const res = await fetchBookings({ limit: 200 });
    setBookings(res.data.data);
    setLoading(false);
  };

  useEffect(() => {
    loadBookings();
  }, []);

  /* ================= FILTERED BOOKINGS ================= */
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchTab =
        activeTab === "all" || b.space?.type === activeTab;

      const keyword = search.toLowerCase();
      const matchSearch =
        b.userName?.toLowerCase().includes(keyword) ||
        b.space?.name?.toLowerCase().includes(keyword);

      return matchTab && matchSearch;
    });
  }, [bookings, activeTab, search]);

  /* ================= COUNTS ================= */
  const countByType = (type) =>
    bookings.filter((b) => b.space?.type === type).length;

  /* ================= ACTIONS ================= */
  const approveBooking = async (id) => {
    await updateBookingStatus(id, { status: "approved" });
    loadBookings();
  };

const markActive = async (id) => {
  await updateBookingStatus(id, { status: "active" });
  loadBookings();
};


  const completeBooking = async (id) => {
    await updateBookingStatus(id, { status: "completed" });
    loadBookings();
  };

  const cancel = async (id) => {
    if (!confirm("Cancel this booking?")) return;
    await cancelBooking(id);
    loadBookings();
  };

  /* ================= BADGES ================= */
  const statusBadge = (status) => {
    const map = {
      pending: "bg-yellow-100 text-yellow-700",
      approved: "bg-blue-100 text-blue-700",
      active: "bg-green-100 text-green-700",
      completed: "bg-gray-200 text-gray-700",
      cancelled: "bg-red-100 text-red-700",
    };
    return map[status];
  };

  const paymentBadge = (status) =>
    status === "paid"
      ? "bg-green-100 text-green-700"
      : "bg-yellow-100 text-yellow-700";

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">All Bookings</h1>
          <p className="text-gray-500">
            Manage and track all space bookings
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/bookings/add")}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          + New Booking
        </button>
      </div>

      {/* TABS */}
      <div className="flex gap-6 border-b mb-4">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setActiveTab(t.value)}
            className={`pb-2 text-sm font-medium ${
              activeTab === t.value
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
          >
            {t.label}
            {t.value !== "all" && (
              <span className="ml-1 text-gray-400">
                ({countByType(t.value)})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex gap-4 mb-4">
        <input
          placeholder="Search bookings..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-4 py-2 w-full"
        />
        <button className="border px-4 py-2 rounded flex items-center gap-2">
          🔍 Filter
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded shadow overflow-x-auto">
        {loading ? (
          <p className="p-6 text-gray-500">Loading bookings...</p>
        ) : filteredBookings.length === 0 ? (
          <p className="p-6 text-gray-500">No bookings found</p>
        ) : (
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr className="text-left text-sm">
                <th className="p-3">User</th>
                <th>Resource</th>
                <th>Dates</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((b, i) => (
                <tr
                  key={b._id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-3">
                    {b.userName}
                    <div className="text-xs text-gray-500">
                      {b.userEmail}
                    </div>
                  </td>

                  <td>
                    {b.space?.name}
                    <div className="text-xs text-gray-500 capitalize">
                      {b.space?.type}
                    </div>
                  </td>

                  <td className="text-sm">
                    {new Date(b.startDate).toLocaleDateString()} –{" "}
                    {new Date(b.endDate).toLocaleDateString()}
                  </td>

                  <td className="font-medium">
                    ₹{b.totalAmount}
                  </td>

                  <td>
                    <span
                      className={`px-2 py-1 rounded text-xs ${statusBadge(
                        b.status
                      )}`}
                    >
                      {b.status}
                    </span>
                  </td>

                  <td className="flex gap-3 p-3">
                    <button
                      title="View"
                      onClick={() =>
                        navigate(`/admin/bookings/${b._id}`)
                      }
                    >
                      👁️
                    </button>

                    {b.status === "pending" && (
                      <button
                        title="Approve"
                        onClick={() => approveBooking(b._id)}
                      >
                        ✅
                      </button>
                    )}

                    {b.status === "approved" && (
                      <button
                        title="Activate"
                        onClick={() => markActive(b._id)}
                      >
                        ▶️
                      </button>
                    )}

                    {b.status === "active" && (
                      <button
                        title="Complete"
                        onClick={() => completeBooking(b._id)}
                      >
                        ✔️
                      </button>
                    )}

                    {b.status !== "completed" &&
                      b.status !== "cancelled" && (
                        <button
                          title="Cancel"
                          onClick={() => cancel(b._id)}
                        >
                          ❌
                        </button>
                      )}
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
