import { useEffect, useState, cloneElement, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Cell,
  PieChart, Pie, Legend
} from "recharts";
import {
  Users, Building2, CalendarCheck, Clock,
  TrendingUp, MoreVertical, Search, Filter,
  ArrowUpRight, IndianRupee
} from "lucide-react";
import { fetchDashboardStats, fetchDashboardAnalytics } from "../../services/dashboardService";
import { fetchBranches } from "../../services/branchServices";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#f43f5e"];
const YEARS = [2023, 2024, 2025];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState({
    monthlyBookings: [],
    bookingsBySpace: [],
    revenueBySpace: [],
    recentBookings: [],
    occupancy: { cabins: 0, desks: 0, conference: 0 },
    totalRevenue: 0,
    previousRevenue: 0,
    pendingBookings: 0,
  });
  const [year, setYear] = useState(new Date().getFullYear());
  const [spaceType, setSpaceType] = useState("all");
  const [branches, setBranches] = useState([]);
  const [branchId, setBranchId] = useState("all");

  useEffect(() => {
    loadDashboard();
    const loadBranches = async () => {
      const res = await fetchBranches();
      setBranches(res || []);
    };
    loadBranches();
  }, [year, spaceType, branchId]);

  const loadDashboard = async () => {
    try {
      const [statsRes, analyticsRes] = await Promise.all([
        fetchDashboardStats(),
        fetchDashboardAnalytics({ year, spaceType, branchId }),
      ]);
      setStats(statsRes?.data?.data || {});
      setAnalytics(prev => ({ ...prev, ...(analyticsRes?.data || {}) }));
    } catch (e) {
      console.error("Dashboard load failed", e);
    }
  };

  const chartData = useMemo(() =>
    analytics.monthlyBookings.map(m => ({
      month: new Date(year, m._id - 1).toLocaleString("default", { month: "short" }),
      bookings: m.count,
    })), [analytics, year]
  );

  if (!stats) return <DashboardSkeleton />;

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-12">
      {/* TOP NAV / FILTERS */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 mb-8">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <div className="w-2 h-8 bg-indigo-600 rounded-full" />
              Executive Dashboard
            </h1>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 w-full md:w-auto">
            <FilterGroup icon={<Filter size={14} />}>
              <select value={year} onChange={e => setYear(e.target.value)} className="bg-transparent outline-none cursor-pointer">
                {YEARS.map(y => <option key={y}>{y}</option>)}
              </select>
              <select value={spaceType} onChange={e => setSpaceType(e.target.value)} className="bg-transparent outline-none cursor-pointer">
                <option value="all">All Spaces</option>
                <option value="cabin">Cabins</option>
                <option value="desk">Desks</option>
                <option value="conference">Conference</option>
              </select>
              <select value={branchId} onChange={e => setBranchId(e.target.value)} className="bg-transparent outline-none cursor-pointer max-w-[120px]">
                <option value="all">All Branches</option>
                {branches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
              </select>
            </FilterGroup>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 md:px-8 space-y-8">
        
        {/* PRIMARY METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Members" value={stats.totalUsers} icon={<Users />} trend="+12%" color="indigo" />
          <StatCard title="Active Spaces" value={stats.activeSpaces} icon={<Building2 />} trend="Live" color="violet" />
          <StatCard title="Bookings" value={stats.totalBookings} icon={<CalendarCheck />} trend="+5.4%" color="emerald" />
          <StatCard title="Pending" value={analytics.pendingBookings} icon={<Clock />} trend="Action Required" color="amber" />
        </div>

        {/* REVENUE OVERVIEW SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Revenue Dark Card */}
          <div className="lg:col-span-4 bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-200/50">
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                    <IndianRupee size={24} className="text-indigo-400" />
                  </div>
                  <span className="flex items-center gap-1 text-emerald-400 text-sm font-bold bg-emerald-400/10 px-3 py-1 rounded-full">
                    <TrendingUp size={14} /> 18.2%
                  </span>
                </div>
                <p className="text-slate-400 font-bold uppercase tracking-wider text-xs mt-6">Estimated Revenue</p>
                <h2 className="text-5xl font-black mt-2 tracking-tight">
                  ₹{analytics.totalRevenue.toLocaleString()}
                </h2>
              </div>
            
            </div>
            {/* Abstract Background element */}
            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl" />
          </div>

          {/* Monthly Growth Chart */}
          <div className="lg:col-span-8 bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-slate-800 tracking-tight">Monthly Performance</h3>
              <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                <span className="flex items-center gap-1"><div className="w-3 h-3 bg-indigo-600 rounded-full" /> This Year</span>
                <span className="flex items-center gap-1"><div className="w-3 h-3 bg-slate-200 rounded-full" /> Previous</span>
              </div>
            </div>
            <div className="h-[320px] w-full">
              <ResponsiveContainer>
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                  />
                  <Bar dataKey="bookings" radius={[8, 8, 8, 8]} barSize={32}>
                    {chartData.map((entry, i) => (
                      <Cell key={i} fill={i === chartData.length - 1 ? "#4f46e5" : "#e2e8f0"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* SECONDARY ANALYTICS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <ChartCard title="Space Distribution">
            <PieChart>
              <Pie data={analytics.bookingsBySpace} dataKey="value" nameKey="name" innerRadius={70} outerRadius={100} paddingAngle={5}>
                {analytics.bookingsBySpace.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} cornerRadius={10} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ChartCard>

          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
            <h3 className="text-xl font-black text-slate-800 tracking-tight mb-6">Space Utilization</h3>
            <div className="space-y-8">
              <UtilBar label="Private Cabins" value={analytics.occupancy.cabins} color="#6366f1" />
              <UtilBar label="Hot Desks" value={analytics.occupancy.desks} color="#10b981" />
              <UtilBar label="Conference Rooms" value={analytics.occupancy.conference} color="#f59e0b" />
            </div>
            <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <p className="text-xs text-slate-500 font-medium text-center">Data updates automatically every 30 seconds</p>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-800 tracking-tight">Recent Activity</h3>
              <button className="text-indigo-600 font-bold text-sm">View All</button>
            </div>
            <div className="flex-1 overflow-y-auto max-h-[350px]">
              {analytics.recentBookings.map((b, i) => (
                <div key={b._id} className={`p-4 flex items-center justify-between hover:bg-slate-50 transition-colors ${i !== 0 ? 'border-t border-slate-50' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                      {b.userName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{b.userName}</p>
                      <p className="text-xs text-slate-500">{b.spaceId?.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-slate-900 text-sm">₹{b.totalAmount}</p>
                    <p className="text-[10px] uppercase font-bold text-emerald-500">Completed</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- REUSABLE UI COMPONENTS ---------------- */

function FilterGroup({ icon, children }) {
  return (
    <div className="flex items-center gap-3 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-slate-600 text-sm font-bold">
      <div className="pl-2">{icon}</div>
      {children}
    </div>
  );
}

function StatCard({ title, value, icon, color, trend }) {
  const variants = {
    indigo: "bg-indigo-50 text-indigo-600",
    violet: "bg-violet-50 text-violet-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-2xl transition-transform group-hover:scale-110 ${variants[color]}`}>
          {cloneElement(icon, { size: 24 })}
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 px-2 py-1 rounded-md">{trend}</span>
      </div>
      <div className="mt-6">
        <p className="text-slate-500 text-sm font-bold uppercase tracking-wide">{title}</p>
        <p className="text-4xl font-black text-slate-900 mt-1">{value?.toLocaleString()}</p>
      </div>
    </div>
  );
}

function UtilBar({ label, value, color }) {
  return (
    <div>
      <div className="flex justify-between items-end mb-2">
        <span className="text-sm font-bold text-slate-700">{label}</span>
        <span className="text-lg font-black text-slate-900">{value}%</span>
      </div>
      <div className="h-4 bg-slate-100 rounded-full overflow-hidden p-1">
        <div 
          className="h-full rounded-full transition-all duration-1000 shadow-sm shadow-indigo-200" 
          style={{ width: `${value}%`, backgroundColor: color }} 
        />
      </div>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm h-[420px] flex flex-col">
      <h3 className="text-xl font-black text-slate-800 tracking-tight mb-4">{title}</h3>
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="p-8 animate-pulse space-y-8 bg-slate-50 min-h-screen">
      <div className="h-12 w-64 bg-slate-200 rounded-2xl" />
      <div className="grid grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-40 bg-white rounded-[2rem] border border-slate-200" />)}
      </div>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-4 h-80 bg-slate-900 rounded-[2.5rem]" />
        <div className="col-span-8 h-80 bg-white rounded-[2.5rem] border border-slate-200" />
      </div>
    </div>
  );
}