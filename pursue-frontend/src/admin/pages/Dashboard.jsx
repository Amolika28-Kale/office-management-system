import { useEffect, useState } from "react";
import {
  fetchDashboardStats,
  fetchDashboardAnalytics,
} from "../../services/dashboardService";

import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  Users,
  Building2,
  CalendarCheck,
  Clock,
  IndianRupee,
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchDashboardStats().then((res) => setStats(res.data.data));
    fetchDashboardAnalytics().then((res) => setAnalytics(res.data));
  }, []);

  if (!stats || !analytics) return null;

  const chartData = analytics.monthlyBookings.map((m) => ({
    month: new Date(2024, m._id - 1).toLocaleString("default", {
      month: "short",
    }),
    bookings: m.count,
  }));

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          Admin Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Business overview & performance
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <Stat
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="from-blue-500 to-indigo-500"
        />
        <Stat
          title="Active Spaces"
          value={stats.activeSpaces}
          icon={Building2}
          color="from-purple-500 to-pink-500"
        />
        <Stat
          title="Total Bookings"
          value={stats.totalBookings}
          icon={CalendarCheck}
          color="from-green-500 to-emerald-500"
        />
        <Stat
          title="Pending Approvals"
          value={analytics.pendingBookings}
          icon={Clock}
          color="from-orange-500 to-amber-500"
        />
      </div>

      {/* REVENUE + CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* REVENUE */}
        <div className="bg-gradient-to-br from-green-600 to-emerald-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <IndianRupee />
            <h3 className="font-semibold">Total Revenue</h3>
          </div>
          <p className="text-3xl font-bold tracking-wide">
            ₹{analytics.totalRevenue.toLocaleString()}
          </p>
          <p className="text-sm text-white/80 mt-1">
            This year earnings
          </p>
        </div>

        {/* CHART */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow">
          <h3 className="font-semibold text-lg mb-4">
            Monthly Bookings
          </h3>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData}>
              <XAxis dataKey="month" />
              <Tooltip />
              <Bar
                dataKey="bookings"
                radius={[8, 8, 0, 0]}
                fill="#3b82f6"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* RECENT ACTIVITY */}
      <div className="bg-white rounded-xl p-6 shadow">
        <h3 className="font-semibold text-lg mb-4">
          Recent Activity
        </h3>

        <ul className="divide-y">
          {analytics.recentBookings.map((b) => (
            <li
              key={b._id}
              className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
            >
              <div>
                <p className="font-medium text-gray-800">
                  {b.userName}
                </p>
                <p className="text-sm text-gray-500">
                  {b.space?.name}
                </p>
              </div>

              <span className="font-semibold text-green-600">
                ₹{b.totalAmount}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* STAT CARD */
function Stat({ title, value, icon: Icon, color }) {
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-md transition p-5 flex items-center gap-4">
      <div
        className={`h-12 w-12 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${color}`}
      >
        <Icon size={22} />
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}
