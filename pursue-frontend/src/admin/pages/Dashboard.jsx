import { useEffect, useState, cloneElement, useMemo } from "react";
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

/* ---------------- CONSTANTS ---------------- */
const COLORS = ["#4f46e5", "#22c55e", "#f59e0b", "#ef4444"];
const YEARS = [2023, 2024, 2025];

const DEFAULT_ANALYTICS = {
  monthlyBookings: [],
  bookingsBySpace: [],
  revenueBySpace: [],
  recentBookings: [],
  occupancy: { cabins: 0, desks: 0, conference: 0 },
  totalRevenue: 0,
  previousRevenue: 0,
  pendingBookings: 0,
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(DEFAULT_ANALYTICS);
  const [year, setYear] = useState(new Date().getFullYear());
  const [spaceType, setSpaceType] = useState("all");

  /* LOAD DATA */
  useEffect(() => {
    loadDashboard();
  }, [year, spaceType]);

  /* AUTO REFRESH */
  useEffect(() => {
    const interval = setInterval(loadDashboard, 30000);
    return () => clearInterval(interval);
  }, [year, spaceType]);

  const loadDashboard = async () => {
    try {
      const [statsRes, analyticsRes] = await Promise.all([
        fetchDashboardStats(),
        fetchDashboardAnalytics({ year, spaceType }),
      ]);

      setStats(statsRes?.data?.data || {});
      setAnalytics({ ...DEFAULT_ANALYTICS, ...(analyticsRes?.data || {}) });
    } catch (e) {
      console.error("Dashboard load failed", e);
    }
  };

  /* GROWTH % */
  const growth = useMemo(() => {
    if (!analytics.previousRevenue) return 0;
    return (
      ((analytics.totalRevenue - analytics.previousRevenue) /
        analytics.previousRevenue) *
      100
    ).toFixed(1);
  }, [analytics]);

  /* MONTHLY BAR DATA */
  const chartData = useMemo(
    () =>
      analytics.monthlyBookings.map(m => ({
        month: new Date(year, m._id - 1).toLocaleString("default", { month: "short" }),
        bookings: m.count,
      })),
    [analytics, year]
  );

  if (!stats) return <DashboardSkeleton />;

  return (
    <div className="max-w-[1600px] mx-auto p-6 space-y-10">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">System Overview</h1>
          <p className="text-slate-500 font-medium">
            Pursue Co-Working Live Dashboard
          </p>
        </div>

        <div className="flex gap-3">
          <select value={year} onChange={e => setYear(e.target.value)}
            className="px-4 py-2 rounded-xl border font-bold">
            {YEARS.map(y => <option key={y}>{y}</option>)}
          </select>

          <select value={spaceType} onChange={e => setSpaceType(e.target.value)}
            className="px-4 py-2 rounded-xl border font-bold">
            <option value="all">All Spaces</option>
            <option value="cabin">Cabins</option>
            <option value="desk">Desks</option>
            <option value="conference">Conference</option>
          </select>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard title="Members" value={stats.totalUsers} icon={<Users />} color="indigo" />
        <StatCard title="Spaces" value={stats.activeSpaces} icon={<Building2 />} color="violet" />
        <StatCard title="Bookings" value={stats.totalBookings} icon={<CalendarCheck />} color="emerald" />
        <StatCard title="Pending" value={analytics.pendingBookings} icon={<Clock />} color="amber" />
      </div>

      {/* REVENUE + BAR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div className="bg-slate-900 rounded-[2rem] p-8 text-white">
          <p className="uppercase text-xs text-slate-400 font-bold">Annual Revenue</p>
          <h2 className="text-5xl font-black mt-4">
            ₹{analytics.totalRevenue.toLocaleString()}
          </h2>
          
         
        </div>

        <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 border">
          <h3 className="font-extrabold mb-6">Monthly Bookings</h3>
          <div className="h-[300px]">
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="bookings" radius={[6, 6, 0, 0]}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={i === chartData.length - 1 ? "#4f46e5" : "#e5e7eb"} />
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
            <Pie data={analytics.bookingsBySpace} dataKey="value" nameKey="name"
              innerRadius={50} outerRadius={90}>
              {analytics.bookingsBySpace.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ChartCard>

        <ChartCard title="Revenue Distribution">
          <PieChart>
            <Pie data={analytics.revenueBySpace} dataKey="value" nameKey="name" outerRadius={90}>
              {analytics.revenueBySpace.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={v => `₹${v.toLocaleString()}`} />
            <Legend />
          </PieChart>
        </ChartCard>

        <div className="bg-white rounded-[2rem] p-8 border space-y-6">
          <h3 className="font-extrabold">Space Utilization</h3>
          <UtilBar label="Cabins" value={analytics.occupancy.cabins} />
          <UtilBar label="Desks" value={analytics.occupancy.desks} />
          <UtilBar label="Conference" value={analytics.occupancy.conference} />
        </div>
      </div>

      {/* RECENT BOOKINGS */}
      <div className="bg-white rounded-[2rem] border">
        <div className="p-6 border-b font-extrabold">Recent Transactions</div>
        <table className="min-w-full text-sm">
          <tbody>
            {analytics.recentBookings.map(b => (
              <tr key={b._id} className="border-t hover:bg-slate-50">
                <td className="p-4 font-bold">{b.userName}</td>
                <td className="p-4">{b.spaceId?.name}</td>
                <td className="p-4 font-black">₹{b.totalAmount}</td>
                <td className="p-4 text-right"><MoreVertical /></td>
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
    <div className="bg-white rounded-[2rem] p-8 border h-[360px]">
      <h3 className="font-extrabold mb-4">{title}</h3>
      <ResponsiveContainer>{children}</ResponsiveContainer>
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
    <div className="bg-white p-6 rounded-[1.5rem] border">
      <div className={`p-3 w-fit rounded-xl text-white ${colors[color]}`}>
        {cloneElement(icon, { size: 22 })}
      </div>
      <p className="text-slate-400 mt-4 text-sm font-bold">{title}</p>
      <p className="text-3xl font-black">{value}</p>
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
      <div className="h-3 bg-slate-100 rounded-full">
        <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="p-8 animate-pulse space-y-6">
      <div className="h-10 w-48 bg-slate-200 rounded" />
      <div className="grid grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-28 bg-slate-200 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
