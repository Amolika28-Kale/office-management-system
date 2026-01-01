import { useEffect, useState } from "react";
import {
  getDashboardStats,
  getActiveBookings,
} from "../../user/services/dashboardService";
import BookingModal from "../components/BookingModal";
export default function UserDashboard() {
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
const [showBookingModal, setShowBookingModal] = useState(false);
const [bookingType, setBookingType] = useState("Cabin");

  useEffect(() => {
    loadDashboard();
  }, []);
const openBooking = (type) => {
  setBookingType(type);
  setShowBookingModal(true);
};

  const loadDashboard = async () => {
    const statsRes = await getDashboardStats();
    const bookingsRes = await getActiveBookings();

    setStats(statsRes);
    setBookings(bookingsRes);
  };

  if (!stats) return null;

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold">My Dashboard</h2>
        <p className="text-gray-500">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Active Bookings"
          value={stats.activeBookings}
          color="bg-blue-500"
          icon="📅"
        />
        <StatCard
          title="Total Spent"
          value={`₹${stats.totalSpent}`}
          color="bg-green-500"
          icon="💰"
        />
        <StatCard
          title="Hours Booked"
          value={stats.hoursBooked}
          color="bg-purple-500"
          icon="⏰"
        />
        <StatCard
          title="Upcoming"
          value={stats.upcomingBookings}
          color="bg-orange-500"
          icon="🧾"
        />
      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* BOOKINGS */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold mb-4">My Active Bookings</h3>

          {bookings.length === 0 && (
            <p className="text-gray-500">No active bookings</p>
          )}

          {bookings.map((b) => (
            <BookingCard
              key={b._id}
              title={b.spaceId?.name}
              date={`${new Date(b.startDate).toDateString()} - ${new Date(
                b.endDate
              ).toDateString()}`}
              plan={`${b.plan} - ₹${b.amount}`}
            />
          ))}
        </div>

  {/* ACTIONS */}
<div className="bg-white rounded-xl shadow p-6">
  <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>

  <div className="space-y-4">
    <ActionButton
      label="Book a Cabin"
      color="bg-blue-600"
      onClick={() => openBooking("Cabin")}
    />

    <ActionButton
      label="Book a Desk"
      color="bg-purple-600"
      onClick={() => openBooking("Desk")}
    />

    <ActionButton
      label="Book Conference Room"
      color="bg-orange-500"
      onClick={() => openBooking("Conference")}
    />

    <button className="w-full py-3 border rounded-lg font-medium hover:bg-gray-50">
      View All Bookings
    </button>
  </div>
</div>

      </div>
      {showBookingModal && (
        <BookingModal
          defaultType={bookingType} 
          onClose={() => setShowBookingModal(false)}
          onSuccess={() => {
            setShowBookingModal(false);
            loadDashboard();
          }}
        />
      )}
    </div>
    
  );
}


/* ================= COMPONENTS ================= */

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-xl shadow p-5 flex justify-between items-center">
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-xl font-bold mt-1">{value}</p>
    </div>
    <div
      className={`h-12 w-12 ${color} text-white rounded-xl flex items-center justify-center text-xl`}
    >
      {icon}
    </div>
  </div>
);

const BookingCard = ({ title, date, plan }) => (
  <div className="border rounded-xl p-4 mb-4 flex justify-between items-start">
    <div>
      <p className="font-semibold">{title}</p>
      <p className="text-sm text-gray-500">{date}</p>
      <p className="text-sm mt-1">{plan}</p>
    </div>
    <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-600">
      Active
    </span>
  </div>
);

const ActionButton = ({ label, color, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full py-3 text-white rounded-lg font-semibold ${color}`}
  >
    {label}
  </button>
);

