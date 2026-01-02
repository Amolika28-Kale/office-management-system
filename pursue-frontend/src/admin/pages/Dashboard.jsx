import { useEffect, useState } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, CartesianGrid, Cell 
} from "recharts";
import { 
  Users, Building2, CalendarCheck, Clock, 
  IndianRupee, TrendingUp, ArrowUpRight, MoreVertical 
} from "lucide-react";
import { fetchDashboardStats, fetchDashboardAnalytics } from "../../services/dashboardService";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsRes, analyticsRes] = await Promise.all([
          fetchDashboardStats(),
          fetchDashboardAnalytics()
        ]);
        setStats(statsRes.data.data);
        setAnalytics(analyticsRes.data);
      } catch (err) {
        console.error("Dashboard failed to load", err);
      }
    };
    loadData();
  }, []);

  if (!stats || !analytics) return <DashboardSkeleton />;

  const chartData = analytics.monthlyBookings.map((m) => ({
    month: new Date(2024, m._id - 1).toLocaleString("default", { month: "short" }),
    bookings: m.count,
  }));

  return (
    <div className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-500">
      
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Overview</h1>
          <p className="text-slate-500 font-medium">Real-time performance metrics for Pursue.</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-2xl shadow-sm text-sm font-bold text-slate-600">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          Live System Status
        </div>
      </div>

      {/* QUICK STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard title="Total Members" value={stats.totalUsers} trend="+12%" icon={<Users />} color="indigo" />
        <StatCard title="Spaces Managed" value={stats.activeSpaces} trend="Stable" icon={<Building2 />} color="violet" />
        <StatCard title="Bookings" value={stats.totalBookings} trend="+18.4%" icon={<CalendarCheck />} color="emerald" />
        <StatCard title="Pending Review" value={analytics.pendingBookings} trend="Priority" icon={<Clock />} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* REVENUE INSIGHT */}
        <div className="relative overflow-hidden bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl">
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <div className="p-2 bg-white/10 rounded-lg"><IndianRupee size={20} /></div>
                <span className="font-bold uppercase tracking-widest text-xs">Annual Revenue</span>
              </div>
              <h2 className="text-5xl font-black mt-4 tracking-tighter">
                ₹{analytics.totalRevenue.toLocaleString()}
              </h2>
              <div className="mt-6 flex items-center gap-2 text-emerald-400 font-bold bg-emerald-400/10 w-fit px-3 py-1 rounded-full text-sm">
                <TrendingUp size={16} /> +24% vs last year
              </div>
            </div>
            <button className="mt-12 w-full py-4 bg-white text-slate-900 rounded-2xl font-black hover:bg-slate-100 transition-colors">
              Download Financial Report
            </button>
          </div>
          {/* Abstract background shape */}
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl" />
        </div>

        {/* ANALYTICS CHART */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-extrabold text-slate-800">Booking Velocity</h3>
            <select className="bg-slate-50 border-none text-xs font-bold text-slate-500 rounded-lg px-3 py-2 outline-none">
              <option>Last 6 Months</option>
              <option>Last 12 Months</option>
            </select>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} 
                  dy={10}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="bookings" radius={[6, 6, 0, 0]} barSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? '#4f46e5' : '#e2e8f0'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* RECENT ACTIVITY TABLE */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <h3 className="text-xl font-extrabold text-slate-800">Recent Transactions</h3>
          <button className="text-indigo-600 font-bold text-sm hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Customer</th>
                <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Space</th>
                <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Amount</th>
                <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {analytics.recentBookings.map((b) => (
                <tr key={b._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <p className="font-bold text-slate-800">{b.userName}</p>
                    <p className="text-xs text-slate-400 font-medium">Member ID: #{b._id.slice(-5)}</p>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-sm font-semibold text-slate-600">{b.space?.name}</span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-base font-black text-slate-900">₹{b.totalAmount.toLocaleString()}</span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-700">
                      SUCCESS
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* REFINED SUB-COMPONENTS */

function StatCard({ title, value, icon, color, trend }) {
  const colors = {
    indigo: "bg-indigo-600 shadow-indigo-100",
    violet: "bg-violet-600 shadow-violet-100",
    emerald: "bg-emerald-600 shadow-emerald-100",
    amber: "bg-amber-600 shadow-amber-100",
  };

  return (
    <div className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-2xl text-white ${colors[color]}`}>
          {cloneElement(icon, { size: 22 })}
        </div>
        <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${trend.includes('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'}`}>
          {trend}
        </span>
      </div>
      <div className="mt-4">
        <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{title}</p>
        <p className="text-3xl font-black text-slate-900 mt-1">{value}</p>
      </div>
    </div>
  );
}

// Minimal helper to clone icons with specific size
import { cloneElement } from "react";

function DashboardSkeleton() {
  return (
    <div className="p-8 animate-pulse space-y-8">
      <div className="h-12 w-64 bg-slate-200 rounded-xl"></div>
      <div className="grid grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-200 rounded-[1.5rem]"></div>)}
      </div>
      <div className="grid grid-cols-3 gap-8">
        <div className="h-64 bg-slate-200 rounded-[2rem]"></div>
        <div className="col-span-2 h-64 bg-slate-200 rounded-[2rem]"></div>
      </div>
    </div>
  );
}