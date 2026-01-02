import { useEffect, useState, cloneElement } from "react";
import { fetchUsers, fetchUserStats } from "../../services/userService";
import { useNavigate } from "react-router-dom";
import { 
  Users as UsersIcon, // Renamed to avoid conflict with component name
  UserCheck, 
  UserPlus, 
  Star, 
  Search, 
  Mail, 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  Filter 
} from "lucide-react";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ total: 0, members: 0, guests: 0, premium: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [usersRes, statsRes] = await Promise.all([fetchUsers(), fetchUserStats()]);
      setUsers(usersRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error("Failed to load users", err);
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      // await deleteUserService(id);
      loadData();
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">User Management</h1>
          <p className="text-slate-500 font-medium mt-1">Monitor member activity and subscription levels.</p>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 sm:min-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
            />
          </div>
          <button
            onClick={() => navigate("/admin/users/add")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-2xl flex items-center gap-2 shadow-lg shadow-indigo-100 transition-all active:scale-95 font-bold whitespace-nowrap"
          >
            <UserPlus size={18} />
            Add User
          </button>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard title="Total" value={stats.total} icon={<UsersIcon />} color="indigo" />
        <StatCard title="Active" value={stats.members} icon={<UserCheck />} color="emerald" />
        <StatCard title="Guests" value={stats.guests} icon={<UserPlus />} color="amber" />
        <StatCard title="Premium" value={stats.premium} icon={<Star />} color="rose" />
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-[2rem] border border-slate-200/60 shadow-sm overflow-hidden">
        {/* DESKTOP TABLE */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">User Profile</th>
                <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Membership</th>
                <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Plan Type</th>
                <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map(u => (
                <tr key={u._id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-sm uppercase">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 leading-none">{u.name}</p>
                        <div className="flex items-center gap-2 mt-1.5 text-slate-400">
                          <Mail size={12} />
                          <span className="text-xs font-medium">{u.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight ${
                      u.userType === 'member' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {u.userType}
                    </span>
                  </td>
                  <td className="p-6 font-bold text-slate-700 text-sm">
                    {u.plan || 'Free Tier'}
                  </td>
                  <td className="p-6 text-center">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-700">
                      <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
                      {u.status}
                    </span>
                  </td>
                  <td className="p-6">
                    <div className="flex justify-end gap-2">
                      <ActionBtn onClick={() => navigate(`/admin/users/edit/${u._id}`)} icon={<Pencil />} color="indigo" />
                      <ActionBtn onClick={() => deleteUser(u._id)} icon={<Trash2 />} color="red" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS VIEW */}
        <div className="md:hidden divide-y divide-slate-100">
          {users.map(u => (
            <div key={u._id} className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                   <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-500 uppercase">
                      {u.name.charAt(0)}
                   </div>
                   <div>
                     <p className="font-bold text-slate-800">{u.name}</p>
                     <p className="text-xs text-slate-400 font-medium truncate max-w-[150px]">{u.email}</p>
                   </div>
                </div>
                <MoreHorizontal className="text-slate-300" />
              </div>
              
              <div className="flex items-center justify-between pt-2">
                 <div className="flex gap-2">
                    <span className="text-[10px] font-black uppercase bg-slate-100 px-2 py-1 rounded-md text-slate-600">{u.userType}</span>
                    <span className="text-[10px] font-black uppercase bg-indigo-50 px-2 py-1 rounded-md text-indigo-600">{u.plan || 'N/A'}</span>
                 </div>
                 <span className="text-xs font-bold text-emerald-600">● {u.status}</span>
              </div>

              <div className="flex gap-2 pt-2">
                <button className="flex-1 py-2.5 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold" onClick={() => navigate(`/admin/users/edit/${u._id}`)}>Edit Profile</button>
                <button className="flex-1 py-2.5 bg-red-50 text-red-600 rounded-xl text-xs font-bold" onClick={() => deleteUser(u._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- SUB-COMPONENTS ---------- */

function StatCard({ title, value, icon, color }) {
  const themes = {
    indigo: "bg-indigo-500 shadow-indigo-200 text-white",
    emerald: "bg-emerald-500 shadow-emerald-200 text-white",
    amber: "bg-amber-500 shadow-amber-200 text-white",
    rose: "bg-rose-500 shadow-rose-200 text-white",
  };
  
  return (
    <div className="bg-white p-5 rounded-[1.5rem] border border-slate-100 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
      <div className="flex flex-col gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${themes[color]}`}>
          {cloneElement(icon, { size: 20 })}
        </div>
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</p>
          <p className="text-2xl font-black text-slate-900 mt-0.5">{value || 0}</p>
        </div>
      </div>
    </div>
  );
}

function ActionBtn({ icon, onClick, color }) {
  const colors = {
    indigo: "hover:bg-indigo-50 text-slate-400 hover:text-indigo-600",
    red: "hover:bg-red-50 text-slate-400 hover:text-red-600"
  };
  return (
    <button onClick={onClick} className={`p-2 rounded-xl transition-all ${colors[color]}`}>
      {cloneElement(icon, { size: 18 })}
    </button>
  );
}