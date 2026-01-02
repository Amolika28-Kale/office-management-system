import { useEffect, useMemo, useState, cloneElement } from "react";
import { fetchUsers, fetchUserStats } from "../../services/userService";
import { useNavigate } from "react-router-dom";
import {
  Users as UsersIcon,
  UserCheck,
  UserPlus,
  Star,
  Search,
  Mail,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    members: 0,
    guests: 0,
    premium: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [usersRes, statsRes] = await Promise.all([
        fetchUsers(),
        fetchUserStats(),
      ]);
      setUsers(usersRes.data || []);
      setStats(statsRes.data || {});
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

  /* ---------------- SEARCH FILTER ---------------- */
  const filteredUsers = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();

    if (!keyword) return users;

    return users.filter((u) => {
      return (
        u.name?.toLowerCase().includes(keyword) ||
        u.email?.toLowerCase().includes(keyword)
      );
    });
  }, [users, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-700">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            User Management
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Monitor member activity and subscription levels.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 sm:min-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-indigo-50 outline-none"
            />
          </div>

          <button
            onClick={() => navigate("/admin/users/add")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-2xl flex items-center gap-2 shadow-lg font-bold whitespace-nowrap"
          >
            <UserPlus size={18} />
            Add User
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total" value={stats.total} icon={<UsersIcon />} color="indigo" />
        <StatCard title="Active" value={stats.members} icon={<UserCheck />} color="emerald" />
        <StatCard title="Guests" value={stats.guests} icon={<UserPlus />} color="amber" />
        <StatCard title="Premium" value={stats.premium} icon={<Star />} color="rose" />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-[2rem] border shadow-sm overflow-hidden">

        {/* DESKTOP */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 text-xs font-black text-slate-400 uppercase">
                <th className="p-6">User Profile</th>
                <th className="p-6">Membership</th>
                <th className="p-6">Plan</th>
                <th className="p-6 text-center">Status</th>
                <th className="p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-20 text-center text-slate-400">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-black uppercase">
                          {u.name?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold">{u.name}</p>
                          <div className="flex items-center gap-1 text-xs text-slate-400">
                            <Mail size={12} /> {u.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-6">
                      <span className="px-2 py-1 text-[10px] font-black rounded bg-slate-100">
                        {u.userType}
                      </span>
                    </td>

                    <td className="p-6 font-bold text-sm">
                      {u.plan || "Free Tier"}
                    </td>

                    <td className="p-6 text-center">
                      <span className="px-3 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-700">
                        {u.status}
                      </span>
                    </td>

                    <td className="p-6 flex justify-end gap-2">
                      <ActionBtn
                        icon={<Pencil />}
                        color="indigo"
                        onClick={() => navigate(`/admin/users/edit/${u._id}`)}
                      />
                      <ActionBtn
                        icon={<Trash2 />}
                        color="red"
                        onClick={() => deleteUser(u._id)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE */}
        <div className="md:hidden divide-y">
          {filteredUsers.map((u) => (
            <div key={u._id} className="p-6 space-y-3">
              <div className="flex justify-between">
                <div>
                  <p className="font-bold">{u.name}</p>
                  <p className="text-xs text-slate-400">{u.email}</p>
                </div>
                <MoreHorizontal />
              </div>
              <div className="flex gap-2">
                <button
                  className="flex-1 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold"
                  onClick={() => navigate(`/admin/users/edit/${u._id}`)}
                >
                  Edit
                </button>
                <button
                  className="flex-1 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-bold"
                  onClick={() => deleteUser(u._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- SUB COMPONENTS ---------------- */

function StatCard({ title, value, icon, color }) {
  const themes = {
    indigo: "bg-indigo-500 text-white",
    emerald: "bg-emerald-500 text-white",
    amber: "bg-amber-500 text-white",
    rose: "bg-rose-500 text-white",
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${themes[color]}`}>
        {cloneElement(icon, { size: 20 })}
      </div>
      <p className="text-xs font-bold text-slate-400 mt-4">{title}</p>
      <p className="text-2xl font-black">{value || 0}</p>
    </div>
  );
}

function ActionBtn({ icon, onClick, color }) {
  const colors = {
    indigo: "hover:bg-indigo-50 text-slate-400 hover:text-indigo-600",
    red: "hover:bg-red-50 text-slate-400 hover:text-red-600",
  };

  return (
    <button onClick={onClick} className={`p-2 rounded-xl ${colors[color]}`}>
      {cloneElement(icon, { size: 18 })}
    </button>
  );
}
