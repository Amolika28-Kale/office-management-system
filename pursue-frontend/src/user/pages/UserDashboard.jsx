import { useEffect, useState } from "react";
import { LucideCalendar, LucideCreditCard, LucideClock, LucideLayout, LucidePlusCircle } from "lucide-react";
import { getDashboardStats, getActiveBookings } from "../../user/services/dashboardService";
import BookingModal from "../components/BookingModal";

export default function UserDashboard() {
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
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
    setLoading(true);
    try {
      const [statsRes, bookingsRes] = await Promise.all([
        getDashboardStats(),
        getActiveBookings()
      ]);
      setStats(statsRes);
      setBookings(bookingsRes);
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Dashboard</h2>
          <p className="text-gray-500 mt-1">Welcome back! Here is your workspace overview.</p>
        </div>
        <button 
          onClick={() => openBooking("Cabin")}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-md active:scale-95"
        >
          <LucidePlusCircle size={20} />
          New Booking
        </button>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active" value={stats.activeBookings} icon={<LucideCalendar />} color="indigo" />
        <StatCard title="Total Spent" value={`₹${stats.totalSpent}`} icon={<LucideCreditCard />} color="emerald" />
        <StatCard title="Hours" value={stats.hoursBooked} icon={<LucideClock />} color="violet" />
        <StatCard title="Upcoming" value={stats.upcomingBookings} icon={<LucideLayout />} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* BOOKINGS LIST */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800">My Active Bookings</h3>
            <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded">Live Updates</span>
          </div>
          
          <div className="p-6">
            {bookings.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-400">No active bookings found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((b) => (
                  <BookingCard
                    key={b._id}
                    title={b.spaceId?.name}
                    date={`${new Date(b.startDate).toLocaleDateString()} - ${new Date(b.endDate).toLocaleDateString()}`}
                    plan={`${b.plan} • ₹${b.amount}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-5">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-3">
              <ActionButton label="Book a Cabin" theme="blue" onClick={() => openBooking("Cabin")} />
              <ActionButton label="Book a Desk" theme="purple" onClick={() => openBooking("Desk")} />
              <ActionButton label="Conference Room" theme="orange" onClick={() => openBooking("Conference")} />
              <button className="w-full mt-2 py-3 text-sm text-gray-500 font-medium hover:text-indigo-600 transition-colors">
                View All History →
              </button>
            </div>
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

/* ================= ENHANCED COMPONENTS ================= */

const StatCard = ({ title, value, icon, color }) => {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
    violet: "bg-violet-50 text-violet-600",
    amber: "bg-amber-50 text-amber-600",
  };
  
  return (
    <div className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-xl transition-transform group-hover:scale-110 ${colors[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const BookingCard = ({ title, date, plan }) => (
  <div className="group flex items-center justify-between p-4 border border-gray-50 rounded-xl hover:bg-gray-50 transition-colors">
    <div className="flex flex-col">
      <p className="font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">{title}</p>
      <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
        <LucideCalendar size={14} /> {date}
      </div>
      <p className="text-xs font-semibold text-gray-400 uppercase mt-2 tracking-wider">{plan}</p>
    </div>
    <div className="flex flex-col items-end gap-2">
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
        ● Active
      </span>
    </div>
  </div>
);

const ActionButton = ({ label, theme, onClick }) => {
  const themes = {
    blue: "bg-blue-600 hover:bg-blue-700 shadow-blue-100",
    purple: "bg-purple-600 hover:bg-purple-700 shadow-purple-100",
    orange: "bg-orange-500 hover:bg-orange-600 shadow-orange-100",
  };

  return (
    <button
      onClick={onClick}
      className={`w-full py-3 px-4 text-white rounded-xl font-bold text-sm transition-all shadow-lg hover:-translate-y-0.5 active:translate-y-0 ${themes[theme]}`}
    >
      {label}
    </button>
  );
};

const DashboardSkeleton = () => (
  <div className="max-w-7xl mx-auto p-8 animate-pulse space-y-8">
    <div className="h-10 w-48 bg-gray-200 rounded"></div>
    <div className="grid grid-cols-4 gap-6">
      {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-gray-200 rounded-2xl"></div>)}
    </div>
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 h-64 bg-gray-200 rounded-2xl"></div>
      <div className="h-64 bg-gray-200 rounded-2xl"></div>
    </div>
  </div>
);