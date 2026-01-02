import { useEffect, useState } from "react";
import { 
  LucideCalendar, LucideCreditCard, LucideClock, 
  LucideLayout, LucidePlusCircle, LucideArrowRight, 
  LucideMapPin, LucideInbox 
} from "lucide-react";
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
    <div className="min-h-screen bg-[#F8FAFC] pb-12">
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">
              Dashboard
            </h2>
            <p className="text-slate-500 font-medium mt-1">
              Manage your workspace and upcoming reservations.
            </p>
          </div>
          <button 
            onClick={() => openBooking("Cabin")}
            className="group flex items-center justify-center gap-2 bg-slate-900 hover:bg-indigo-600 text-white px-6 py-3 rounded-2xl transition-all duration-300 shadow-xl shadow-indigo-100 active:scale-95"
          >
            <LucidePlusCircle size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            <span className="font-bold">New Booking</span>
          </button>
        </header>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Active Bookings" value={stats?.activeBookings} icon={<LucideCalendar />} color="indigo" />
          <StatCard title="Investment" value={`₹${stats?.totalSpent}`} icon={<LucideCreditCard />} color="emerald" />
          <StatCard title="Usage Hours" value={stats?.hoursBooked} icon={<LucideClock />} color="violet" />
          <StatCard title="Upcoming" value={stats?.upcomingBookings} icon={<LucideLayout />} color="amber" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* BOOKINGS LIST */}
          <div className="lg:col-span-2 bg-white rounded-[2rem] shadow-sm border border-slate-200/60 overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white/50 backdrop-blur-sm sticky top-0 z-10">
              <div>
                <h3 className="text-xl font-bold text-slate-800">Active Bookings</h3>
                <p className="text-xs text-slate-400 font-medium">Your current scheduled spaces</p>
              </div>
              <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-pulse" />
                Live
              </span>
            </div>
            
            <div className="p-8">
              {bookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <LucideInbox className="text-slate-300" size={32} />
                  </div>
                  <p className="text-slate-500 font-medium">No active bookings found.</p>
                  <button onClick={() => openBooking("Cabin")} className="mt-2 text-indigo-600 font-bold hover:underline">Book your first spot</button>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((b) => (
                    <BookingCard
                      key={b._id}
                      title={b.spaceId?.name}
                      date={`${new Date(b.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} - ${new Date(b.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`}
                      plan={b.plan}
                      price={`₹${b.amount}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="space-y-6">
            <div className="bg-slate-900 rounded-[2rem] shadow-2xl p-8 text-white relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-colors" />
              <h3 className="text-xl font-bold mb-6 relative z-10">Quick Actions</h3>
              <div className="space-y-3 relative z-10">
                <ActionButton label="Book a Cabin" variant="glass" onClick={() => openBooking("Cabin")} />
                <ActionButton label="Reserve a Desk" variant="glass" onClick={() => openBooking("Desk")} />
                <ActionButton label="Conference Room" variant="glass" onClick={() => openBooking("Conference")} />
                
                <button className="w-full mt-4 flex items-center justify-center gap-2 py-2 text-sm text-slate-400 font-semibold hover:text-white transition-colors">
                  View Booking History <LucideArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* UPGRADE CARD */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-[2rem] p-6">
               <h4 className="text-indigo-900 font-bold mb-1 tracking-tight">Premium Member</h4>
               <p className="text-indigo-700/70 text-sm leading-snug">You have priority access to all conference rooms this month.</p>
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
    </div>
  );
}

/* ================= REFINED SUB-COMPONENTS ================= */

const StatCard = ({ title, value, icon, color }) => {
  const themes = {
    indigo: "bg-indigo-500 shadow-indigo-200 text-white",
    emerald: "bg-emerald-500 shadow-emerald-200 text-white",
    violet: "bg-violet-500 shadow-violet-200 text-white",
    amber: "bg-amber-500 shadow-amber-200 text-white",
  };
  
  return (
    <div className="group bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex flex-col gap-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${themes[color]}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-black text-slate-900 mt-1">{value || 0}</p>
        </div>
      </div>
    </div>
  );
};

const BookingCard = ({ title, date, plan, price }) => (
  <div className="group flex items-center justify-between p-5 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all duration-300">
    <div className="flex gap-4 items-center">
      <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
        <LucideMapPin size={20} />
      </div>
      <div>
        <p className="font-bold text-slate-800 text-lg leading-tight">{title}</p>
        <div className="flex flex-wrap items-center gap-3 mt-1">
          <span className="flex items-center gap-1 text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
            <LucideCalendar size={12} /> {date}
          </span>
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-tight">{plan}</span>
        </div>
      </div>
    </div>
    <div className="text-right hidden sm:block">
      <p className="text-lg font-black text-slate-900">{price}</p>
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 mt-1">
        <span className="w-1 h-1 bg-emerald-600 rounded-full" /> CONFIRMED
      </span>
    </div>
  </div>
);

const ActionButton = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full py-3.5 px-4 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-xl font-bold text-sm transition-all backdrop-blur-md flex items-center justify-between group"
  >
    {label}
    <LucidePlusCircle size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
  </button>
);

const DashboardSkeleton = () => (
  <div className="max-w-7xl mx-auto p-8 animate-pulse space-y-8">
    <div className="space-y-2">
      <div className="h-10 w-48 bg-slate-200 rounded-xl"></div>
      <div className="h-4 w-64 bg-slate-100 rounded-xl"></div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-200 rounded-[1.5rem]"></div>)}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 h-96 bg-slate-200 rounded-[2rem]"></div>
      <div className="h-96 bg-slate-200 rounded-[2rem]"></div>
    </div>
  </div>
);