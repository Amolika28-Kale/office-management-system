import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import {
  IndianRupee,
  Clock,
  Building2,
  Layers,
} from "lucide-react";
import { getUserDashboardAnalytics } from "../services/dashboardService";
import { fetchBranches } from "../../services/branchServices";

/* COLORS */
const COLORS = ["#111827", "#4b5563", "#9ca3af", "#d1d5db"];

export default function UserDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [branches, setBranches] = useState([]);

  const [branchId, setBranchId] = useState("");
  const [spaceType, setSpaceType] = useState("");
  const [range, setRange] = useState("7d");

  useEffect(() => {
    loadBranches();
  }, []);

  useEffect(() => {
    loadAnalytics();
  }, [branchId, spaceType, range]);

  const loadBranches = async () => {
    const res = await fetchBranches();
    setBranches(res);
  };

  const loadAnalytics = async () => {
    const res = await getUserDashboardAnalytics({
      branchId,
      spaceType,
      range,
    });
    setAnalytics(res);
  };

  if (!analytics) return null;

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-3">
        <select
          value={branchId}
          onChange={(e) => setBranchId(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">All Branches</option>
          {branches.map((b) => (
            <option key={b._id} value={b._id}>
              {b.name}
            </option>
          ))}
        </select>

        <select
          value={spaceType}
          onChange={(e) => setSpaceType(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">All Spaces</option>
          <option value="desk">Desk</option>
          <option value="cabin">Cabin</option>
          <option value="conference">Conference</option>
        </select>

        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
        </select>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          icon={<IndianRupee />}
          label="Total Spent"
          value={`₹ ${analytics.totalSpent}`}
        />
        <StatCard
          icon={<Clock />}
          label="Hours Booked"
          value={analytics.hoursBooked}
        />
        <StatCard
          icon={<Layers />}
          label="Spaces Used"
          value={analytics.spacePie.reduce((a, b) => a + b.value, 0)}
        />
        <StatCard
          icon={<Building2 />}
          label="Branches Used"
          value={analytics.branchPie.length}
        />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* USAGE TREND */}
        <div className="bg-white p-4 rounded shadow lg:col-span-2">
          <h2 className="font-semibold mb-3">Usage Trend (Hours)</h2>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={analytics.usageTrend}>
              <defs>
                <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#111827" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#111827" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="hours"
                stroke="#111827"
                fill="url(#colorUsage)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* SPACE PIE */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-3">Space Usage</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={analytics.spacePie}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
                label
              >
                {analytics.spacePie.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* BRANCH PIE */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-3">Branch-wise Usage</h2>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={analytics.branchPie}
              dataKey="value"
              nameKey="name"
              outerRadius={90}
              label
            >
              {analytics.branchPie.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ---------------- STAT CARD ---------------- */

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white rounded shadow p-4 flex items-center gap-4">
      <div className="p-3 bg-gray-100 rounded">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
}
