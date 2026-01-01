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

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchDashboardStats().then(res => setStats(res.data.data));
    fetchDashboardAnalytics().then(res => setAnalytics(res.data));
  }, []);

  if (!stats || !analytics) return null;

  const chartData = analytics.monthlyBookings.map(m => ({
    month: new Date(2024, m._id - 1).toLocaleString("default", { month: "short" }),
    bookings: m.count,
    revenue: m.revenue,
  }));

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <Stat title="Total Users" value={stats.totalUsers} />
        <Stat title="Active Spaces" value={stats.activeSpaces} />
        <Stat title="Total Bookings" value={stats.totalBookings} />
        <Stat title="Pending Approvals" value={analytics.pendingBookings} />
      </div>

      {/* REVENUE */}
      <div className="bg-white p-6 rounded shadow">
        <h3 className="font-semibold text-lg mb-2">Total Revenue</h3>
        <p className="text-3xl font-bold text-green-600">
          ₹{analytics.totalRevenue.toLocaleString()}
        </p>
      </div>

      {/* CHART */}
      <div className="bg-white p-6 rounded shadow">
        <h3 className="font-semibold text-lg mb-4">
          Monthly Bookings
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="month" />
            <Tooltip />
            <Bar dataKey="bookings" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* RECENT BOOKINGS */}
      <div className="bg-white p-6 rounded shadow">
        <h3 className="font-semibold text-lg mb-4">
          Recent Activity
        </h3>
        <ul className="divide-y">
          {analytics.recentBookings.map(b => (
            <li key={b._id} className="py-3 flex justify-between">
              <div>
                <p className="font-medium">{b.userName}</p>
                <p className="text-sm text-gray-500">
                  {b.space?.name}
                </p>
              </div>
              <span className="text-sm">
                ₹{b.totalAmount}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* SIMPLE STAT */
function Stat({ title, value }) {
  return (
    <div className="bg-white rounded shadow p-5">
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}
