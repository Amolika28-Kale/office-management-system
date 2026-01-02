import { useEffect, useState, cloneElement } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Cell,
  PieChart, Pie, Legend
} from "recharts";
import {
  Users, Building2, CalendarCheck, Clock,
  TrendingUp, MoreVertical
} from "lucide-react";
import {
  fetchDashboardStats,
  fetchDashboardAnalytics
} from "../../services/dashboardService";

/* ---------------- COLORS ---------------- */
const COLORS = ["#4f46e5", "#22c55e", "#f59e0b", "#ef4444"];

/* ---------------- DEFAULT ANALYTICS (CRASH SAFE) ---------------- */
const DEFAULT_ANALYTICS = {
  monthlyBookings: [],
  bookingsBySpace: [],
  revenueBySpace: [],
  recentBookings: [],
  occupancy: {
    cabins: 0,
    desks: 0,
    conference: 0,
  },
  totalRevenue: 0,
  pendingBookings: 0,
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(DEFAULT_ANALYTICS);

  useEffect(() => {
    const load = async () => {
      try {
        const [s, a] = await Promise.all([
          fetchDashboardStats(),
          fetchDashboardAnalytics(),
        ]);

        setStats(s?.data?.data || {});
        setAnalytics({ ...DEFAULT_ANALYTICS, ...(a?.data || {}) });
      } catch (err) {
        console.error("Dashboard load failed", err);
      }
    };
    load();
  }, []);

  if (!stats) return <DashboardSkeleton />;

  const chartData = (analytics.monthlyBookings || []).map((m) => ({
    month: new Date(2024, m._id - 1).toLocaleString("default", { month: "short" }),
    bookings: m.count || 0,
  }));

  return (
    <div className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8 space-y-10">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            System Overview
          </h1>
          <p className="text-slate-500 font-medium">
            Pursue Co-Working Live Dashboard
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border text-sm font-bold">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          Live Status
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard title="Members" value={stats.totalUsers || 0} icon={<Users />} color="indigo" />
        <StatCard title="Spaces" value={stats.activeSpaces || 0} icon={<Building2 />} color="violet" />
        <StatCard title="Bookings" value={stats.totalBookings || 0} icon={<CalendarCheck />} color="emerald" />
        <StatCard title="Pending" value={analytics.pendingBookings || 0} icon={<Clock />} color="amber" />
      </div>

      {/* REVENUE + BAR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* REVENUE */}
        <div className="bg-slate-900 rounded-[2rem] p-6 sm:p-8 text-white">
          <p className="uppercase text-xs text-slate-400 font-bold">
            Annual Revenue
          </p>
          <h2 className="text-3xl sm:text-5xl font-black mt-4">
            ₹{analytics.totalRevenue.toLocaleString()}
          </h2>
          <div className="mt-6 flex items-center gap-2 text-emerald-400 font-bold">
            <TrendingUp size={16} /> +24%
          </div>
          <button className="mt-8 w-full py-3 bg-white text-black rounded-xl font-black">
            Download Report
          </button>
        </div>

        {/* BAR CHART */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] p-6 sm:p-8 border">
          <h3 className="font-extrabold mb-4 sm:mb-6">
            Monthly Bookings
          </h3>
          <div className="h-[240px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="bookings" radius={[6, 6, 0, 0]}>
                  {chartData.map((_, i) => (
                    <Cell
                      key={i}
                      fill={i === chartData.length - 1 ? "#4f46e5" : "#e5e7eb"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* PIE + UTILIZATION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <ChartCard title="Bookings by Space">
          <PieChart>
            <Pie
              data={analytics.bookingsBySpace}
              dataKey="value"
              nameKey="name"
              innerRadius={50}
              outerRadius={90}
            >
              {(analytics.bookingsBySpace || []).map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ChartCard>

        <ChartCard title="Revenue Distribution">
          <PieChart>
            <Pie
              data={analytics.revenueBySpace}
              dataKey="value"
              nameKey="name"
              outerRadius={90}
            >
              {(analytics.revenueBySpace || []).map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
            <Legend />
          </PieChart>
        </ChartCard>

        <div className="bg-white rounded-[2rem] p-6 sm:p-8 border space-y-6">
          <h3 className="font-extrabold">Space Utilization</h3>
          <UtilBar label="Cabins" value={analytics.occupancy?.cabins || 0} />
          <UtilBar label="Desks" value={analytics.occupancy?.desks || 0} />
          <UtilBar label="Conference" value={analytics.occupancy?.conference || 0} />
        </div>
      </div>

      {/* RECENT BOOKINGS */}
      <div className="bg-white rounded-[2rem] border overflow-x-auto">
        <div className="p-6 border-b font-extrabold">
          Recent Transactions
        </div>
        <table className="min-w-full text-sm">
          <tbody>
            {(analytics.recentBookings || []).map((b) => (
              <tr key={b._id} className="border-t hover:bg-slate-50">
                <td className="p-4 font-bold">{b.userName}</td>
                <td className="p-4">{b.space?.name}</td>
                <td className="p-4 font-black">
                  ₹{b.totalAmount?.toLocaleString()}
                </td>
                <td className="p-4 text-right">
                  <MoreVertical />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function ChartCard({ title, children }) {
  return (
    <div className="bg-white rounded-[2rem] p-6 sm:p-8 border h-[320px] sm:h-[360px]">
      <h3 className="font-extrabold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  const colors = {
    indigo: "bg-indigo-600",
    violet: "bg-violet-600",
    emerald: "bg-emerald-600",
    amber: "bg-amber-600",
  };

  return (
    <div className="bg-white p-6 rounded-[1.5rem] border hover:shadow-lg transition">
      <div className={`p-3 w-fit rounded-xl text-white ${colors[color]}`}>
        {cloneElement(icon, { size: 22 })}
      </div>
      <p className="text-slate-400 mt-4 text-sm font-bold">{title}</p>
      <p className="text-2xl sm:text-3xl font-black">{value}</p>
    </div>
  );
}

function UtilBar({ label, value }) {
  return (
    <div>
      <div className="flex justify-between text-sm font-bold mb-1">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-600"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="p-8 animate-pulse space-y-6">
      <div className="h-10 w-48 bg-slate-200 rounded"></div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        {[1,2,3,4].map(i => (
          <div key={i} className="h-28 bg-slate-200 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
