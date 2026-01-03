import { useEffect, useState, useMemo, cloneElement } from "react";
import {
  AreaChart, Area, PieChart, Pie, Cell, Tooltip,
  ResponsiveContainer, CartesianGrid, XAxis, YAxis, Legend
} from "recharts";
import {
  IndianRupee, Clock, Building2, Layers, 
  Calendar, Filter, Zap, ArrowUpRight, LayoutDashboard,
  CheckCircle2, AlertCircle, MoreHorizontal
} from "lucide-react";
import { getUserDashboardAnalytics } from "../services/dashboardService";
import { fetchBranches } from "../../services/branchServices";

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];

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
    setBranches(res || []);
  };

  const loadAnalytics = async () => {
    const res = await getUserDashboardAnalytics({ branchId, spaceType, range });
    setAnalytics(res);
  };

  const totalSpacesUsed = useMemo(() => 
    analytics?.spacePie?.reduce((a, b) => a + b.value, 0) || 0
  , [analytics]);

  if (!analytics) return <DashboardSkeleton />;

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 space-y-8">
      
      {/* HEADER & FILTERS (Keep existing header code here) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-2">
            <LayoutDashboard className="text-indigo-600" /> My Insights
          </h1>
          <p className="text-slate-500 font-medium mt-1">Track your workspace productivity and spending.</p>
        </div>
        <div className="flex flex-wrap gap-2 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
          <FilterSelect icon={<Building2 size={14}/>} value={branchId} onChange={setBranchId}>
            <option value="">All Branches</option>
            {branches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
          </FilterSelect>
          <FilterSelect icon={<Layers size={14}/>} value={spaceType} onChange={setSpaceType}>
            <option value="">All Spaces</option>
            <option value="desk">Hot Desk</option>
            <option value="cabin">Private Cabin</option>
            <option value="conference">Conference</option>
          </FilterSelect>
          <FilterSelect icon={<Calendar size={14}/>} value={range} onChange={setRange}>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </FilterSelect>
        </div>
      </div>

      {/* STATS GRID (Keep existing stats code here) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Investment" value={`₹${analytics.totalSpent}`} icon={<IndianRupee />} color="indigo" trend="+12.5%" />
        <StatCard label="Time Utilized" value={`${analytics.hoursBooked}h`} icon={<Clock />} color="violet" trend="Active" />
        <StatCard label="Spaces Booked" value={totalSpacesUsed} icon={<Zap />} color="pink" trend="Total" />
        <StatCard label="Locations" value={analytics.branchPie.length} icon={<Building2 />} color="amber" trend="Network" />
      </div>

      {/* CHARTS SECTION (Keep existing charts code here) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
           {/* Area Chart Content */}
           <h3 className="text-xl font-bold text-slate-800 mb-8">Usage Analytics</h3>
           <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.usageTrend}>
                <defs>
                  <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="hours" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorUsage)" />
              </AreaChart>
            </ResponsiveContainer>
           </div>
        </div>
        <div className="lg:col-span-4 h-full">
           <ChartCard title="Space Preference">
             <PieChart>
               <Pie data={analytics.spacePie} innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                 {analytics.spacePie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} cornerRadius={8} />)}
               </Pie>
               <Tooltip />
               <Legend iconType="circle" />
             </PieChart>
           </ChartCard>
        </div>
      </div>

      {/* --- NEW: RECENT BOOKING PAYMENTS SECTION --- */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">Recent Payments</h3>
            <p className="text-sm text-slate-500 font-medium">History of your latest workspace bookings</p>
          </div>
          <button className="px-5 py-2 rounded-xl text-indigo-600 font-bold hover:bg-indigo-50 transition-colors">
            View All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Space / Branch</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Date & Time</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Amount</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {/* If analytics.recentPayments exists, map it here. Using dummy logic for UI demo */}
              {(analytics.recentBookings || []).slice(0, 5).map((booking, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        <Building2 size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{booking.spaceId?.name || "Premium Desk"}</p>
                        <p className="text-xs font-medium text-slate-400">Main Branch, Pune</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-sm font-bold text-slate-700">Oct 24, 2023</p>
                    <p className="text-xs text-slate-400 font-medium">10:00 AM - 04:00 PM</p>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className="font-black text-slate-900">₹{booking.totalAmount}</span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <StatusBadge status="paid" />
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors">
                      <MoreHorizontal size={20} />
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

// Sub-component for Cleaner Badge UI
function StatusBadge({ status }) {
  const styles = {
    paid: "bg-emerald-50 text-emerald-600 border-emerald-100",
    pending: "bg-amber-50 text-amber-600 border-amber-100",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${styles[status]}`}>
      {status === 'paid' ? <CheckCircle2 size={12}/> : <AlertCircle size={12}/>}
      {status.toUpperCase()}
    </span>
  );
}

/* --- (Keep existing FilterSelect, StatCard, ChartCard, DashboardSkeleton components here) --- */
function FilterSelect({ icon, children, value, onChange }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-50 rounded-xl transition-colors">
      <span className="text-slate-400">{icon}</span>
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="text-sm font-bold text-slate-700 outline-none bg-transparent cursor-pointer"
      >
        {children}
      </select>
    </div>
  );
}

function StatCard({ icon, label, value, color, trend }) {
  const colorMap = {
    indigo: "bg-indigo-50 text-indigo-600",
    violet: "bg-violet-50 text-violet-600",
    pink: "bg-pink-50 text-pink-600",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all group">
      <div className="flex justify-between items-start">
        <div className={`p-4 rounded-2xl group-hover:scale-110 transition-transform ${colorMap[color]}`}>
          {cloneElement(icon, { size: 24 })}
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">
          {trend}
        </span>
      </div>
      <div className="mt-6">
        <p className="text-sm font-bold text-slate-400 uppercase tracking-wide">{label}</p>
        <p className="text-3xl font-black text-slate-900 mt-1">{value}</p>
      </div>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 h-full min-h-[350px] flex flex-col">
      <h3 className="text-lg font-bold text-slate-800 mb-4 px-2">{title}</h3>
      <div className="flex-1 w-full h-full min-h-0">
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
      <div className="h-10 w-48 bg-slate-200 rounded-xl" />
      <div className="grid grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-white rounded-[2rem]" />)}
      </div>
      <div className="h-96 bg-white rounded-[2.5rem]" />
    </div>
  );
}