import { useEffect, useState } from "react";
import { 
  LucideCalendar, LucideCreditCard, LucideClock, 
  LucideLayout, LucidePlusCircle, LucideArrowRight, 
  LucideMapPin, LucideInbox, LucideTrendingUp 
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend 
} from "recharts";
import { getDashboardStats, getActiveBookings } from "../../user/services/dashboardService";
import BookingModal from "../components/BookingModal";

// Dummy data for analytical visuals - Replace with API data if available
const USAGE_DATA = [
  { name: "Mon", hours: 4 }, { name: "Tue", hours: 7 },
  { name: "Wed", hours: 5 }, { name: "Thu", hours: 8 },
  { name: "Fri", hours: 6 }, { name: "Sat", hours: 9 },
  { name: "Sun", hours: 3 },
];

const PIE_DATA = [
  { name: "Cabins", value: 400 },
  { name: "Desks", value: 300 },
  { name: "Meeting Rooms", value: 200 },
];
const COLORS = ["#6366f1", "#10b981", "#f59e0b"];

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
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Dashboard</h2>
            <p className="text-slate-500 font-medium mt-1">Your workspace analytics and active bookings.</p>
          </div>
          <button 
            onClick={() => openBooking("Cabin")}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3.5 rounded-2xl transition-all shadow-xl shadow-indigo-100 active:scale-95"
          >
            <LucidePlusCircle size={20} />
            <span className="font-bold">New Booking</span>
          </button>
        </header>

        {/* STATS GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Active" value={stats?.activeBookings} icon={<LucideCalendar />} color="indigo" />
          <StatCard title="Spent" value={`₹${stats?.totalSpent}`} icon={<LucideCreditCard />} color="emerald" />
          <StatCard title="Hours" value={stats?.hoursBooked} icon={<LucideClock />} color="violet" />
          <StatCard title="Upcoming" value={stats?.upcomingBookings} icon={<LucideLayout />} color="amber" />
        </div>

        {/* ANALYTICS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AREA CHART */}
          <div className="lg:col-span-2 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800">Weekly Usage Trend</h3>
              <LucideTrendingUp className="text-emerald-500" size={20} />
            </div>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={USAGE_DATA}>
                  <defs>
                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis hide />
                  <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                  <Area type="monotone" dataKey="hours" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* PIE CHART */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Space Distribution</h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={PIE_DATA} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {PIE_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* BOOKINGS AND QUICK ACTIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-[2rem] shadow-sm border border-slate-200/60 overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white/50 backdrop-blur-sm sticky top-0 z-10">
              <h3 className="text-xl font-bold text-slate-800">Active Bookings</h3>
              <span className="text-[10px] uppercase tracking-widest font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full">Live Updates</span>
            </div>
            <div className="p-6 md:p-8">
              {bookings.length === 0 ? (
                <EmptyState openBooking={openBooking} />
              ) : (
                <div className="space-y-4">
                  {bookings.map((b) => (
                    <BookingCard key={b._id} b={b} />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-900 rounded-[2rem] shadow-2xl p-8 text-white relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-colors" />
              <h3 className="text-xl font-bold mb-6">Quick Actions</h3>
              <div className="space-y-3 relative z-10">
                <ActionBtn label="Book a Cabin" theme="blue" onClick={() => openBooking("Cabin")} />
                <ActionBtn label="Reserve a Desk" theme="purple" onClick={() => openBooking("Desk")} />
                <ActionBtn label="Conference Room" theme="orange" onClick={() => openBooking("Conference")} />
                <button className="w-full mt-4 flex items-center justify-center gap-2 py-2 text-sm text-slate-400 font-semibold hover:text-white transition-colors">
                  View History <LucideArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {showBookingModal && (
          <BookingModal
            defaultType={bookingType}
            onClose={() => setShowBookingModal(false)}
            onSuccess={() => { setShowBookingModal(false); loadDashboard(); }}
          />
        )}
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

const StatCard = ({ title, value, icon, color }) => {
  const themes = {
    indigo: "bg-indigo-500 shadow-indigo-100",
    emerald: "bg-emerald-500 shadow-emerald-100",
    violet: "bg-violet-500 shadow-violet-100",
    amber: "bg-amber-500 shadow-amber-100",
  };
  return (
    <div className="group bg-white p-4 md:p-6 rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex flex-col gap-3 md:gap-4">
        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center text-white ${themes[color]}`}>
          {icon}
        </div>
        <div>
          <p className="text-[10px] md:text-sm font-bold text-slate-400 uppercase tracking-wider">{title}</p>
          <p className="text-xl md:text-2xl font-black text-slate-900 leading-tight">{value || 0}</p>
        </div>
      </div>
    </div>
  );
};

const BookingCard = ({ b }) => (
  <div className="group flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all duration-300 gap-4">
    <div className="flex gap-4 items-center">
      <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
        <LucideMapPin size={20} />
      </div>
      <div>
        <p className="font-bold text-slate-800 text-lg leading-tight">{b.spaceId?.name}</p>
        <div className="flex flex-wrap items-center gap-2 mt-1">
          <span className="text-[10px] font-bold text-indigo-600 uppercase bg-indigo-50 px-2 py-0.5 rounded">{b.plan}</span>
          <span className="text-xs text-slate-500 font-medium">₹{b.amount}</span>
        </div>
      </div>
    </div>
    <div className="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-3 md:pt-0">
      <p className="text-sm font-bold text-slate-600">{new Date(b.startDate).toLocaleDateString()}</p>
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-700">
        <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-pulse" /> ACTIVE
      </span>
    </div>
  </div>
);

const EmptyState = ({ openBooking }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
      <LucideInbox size={32} />
    </div>
    <p className="text-slate-500 font-medium">No active bookings found.</p>
    <button onClick={() => openBooking("Cabin")} className="mt-2 text-indigo-600 font-bold hover:underline">Book a spot</button>
  </div>
);

const ActionBtn = ({ label, onClick }) => (
  <button onClick={onClick} className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-between group">
    {label}
    <LucideArrowRight size={16} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
  </button>
);

const DashboardSkeleton = () => (
  <div className="max-w-7xl mx-auto p-8 animate-pulse space-y-8">
    <div className="h-10 w-48 bg-slate-200 rounded-xl"></div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-slate-200 rounded-[1.5rem]"></div>)}
    </div>
    <div className="h-64 bg-slate-200 rounded-[2rem]"></div>
  </div>
);