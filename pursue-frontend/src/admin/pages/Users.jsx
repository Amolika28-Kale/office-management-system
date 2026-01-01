import { useEffect, useState } from "react";
import { fetchUsers, fetchUserStats } from "../../services/userService";
import { useNavigate } from "react-router-dom";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
const navigate = useNavigate();

  useEffect(() => {
    fetchUsers().then(res => setUsers(res.data));
    fetchUserStats().then(res => setStats(res.data));
  }, []);

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-gray-500">Manage all users and members</p>
        </div>
       <button
  onClick={() => navigate("/admin/users/add")}
  className="bg-blue-600 text-white px-4 py-2 rounded"
>
  + Add User
</button>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Stat title="Total Users" value={stats.total} />
        <Stat title="Active Members" value={stats.members} />
        <Stat title="Guests" value={stats.guests} />
        <Stat title="Premium Plans" value={stats.premium} />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded shadow">
        <table className="w-full">
          <thead className="border-b">
            <tr className="text-left">
              <th className="p-3">Name</th>
              <th>Contact</th>
              <th>Type</th>
              <th>Plan</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} className="border-b">
                <td className="p-3">{u.name}</td>
                <td>{u.email}<br />{u.phone}</td>
                <td>{u.userType}</td>
                <td>{u.plan}</td>
                <td>
                  <span className="px-2 py-1 rounded bg-green-100 text-green-700">
                    {u.status}
                  </span>
                </td>
                <td className="flex gap-3">
  <button
    onClick={() => navigate(`/admin/users/edit/${u._id}`)}
    className="text-blue-600"
  >
    ✏️
  </button>
  <button
    onClick={() => deleteUser(u._id)}
    className="text-red-600"
  >
    🗑️
  </button>
</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const Stat = ({ title, value }) => (
  <div className="bg-white p-4 rounded shadow flex justify-between">
    <div>
      <p className="text-gray-500">{title}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  </div>
);
