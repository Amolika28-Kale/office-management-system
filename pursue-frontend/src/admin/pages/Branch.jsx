import { useEffect, useState } from "react";
import { fetchBranches, deleteBranch } from "../../services/branchServices";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash, MapPin, Building2, Loader2 } from "lucide-react";

export default function Branches() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchBranches();
      setBranches(res || []);
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("Are you sure you want to delete this branch? This action cannot be undone.")) return;
    await deleteBranch(id);
    load();
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Branches</h1>
          <p className="text-gray-500 mt-1">Manage your physical locations and their status.</p>
        </div>
        <button
          onClick={() => navigate("/admin/branches/new")}
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2.5 rounded-lg transition-all shadow-sm active:scale-95"
        >
          <Plus size={18} /> Add New Branch
        </button>
      </div>

      <hr className="border-gray-200" />

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Loader2 className="animate-spin mb-2" size={32} />
          <p>Loading branches...</p>
        </div>
      ) : branches.length === 0 ? (
        /* Empty State */
        <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <Building2 className="mx-auto text-gray-300 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900">No branches found</h3>
          <p className="text-gray-500">Get started by creating your first branch office.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Branch Name</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Location</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 text-center">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {branches.map((b) => (
                  <tr key={b._id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-800">{b.name}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={14} className="text-gray-400" />
                        {b.city}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <StatusBadge active={b.isActive} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ActionButton icon={<Pencil size={16} />} onClick={() => navigate(`/admin/branches/edit/${b._id}`)} color="blue" />
                        <ActionButton icon={<Trash size={16} />} onClick={() => remove(b._id)} color="red" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-gray-100">
            {branches.map((b) => (
              <div key={b._id} className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{b.name}</h3>
                    <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                      <MapPin size={14} /> {b.city}
                    </div>
                  </div>
                  <StatusBadge active={b.isActive} />
                </div>
                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={() => navigate(`/admin/branches/edit/${b._id}`)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border border-gray-200 text-gray-700 font-medium active:bg-gray-50"
                  >
                    <Pencil size={16} /> Edit
                  </button>
                  <button 
                    onClick={() => remove(b._id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border border-red-100 bg-red-50 text-red-600 font-medium active:bg-red-100"
                  >
                    <Trash size={16} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-components for cleaner code
function StatusBadge({ active }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${active ? "bg-green-500" : "bg-gray-400"}`}></span>
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function ActionButton({ icon, onClick, color }) {
  const colors = {
    blue: "hover:bg-blue-50 text-blue-600",
    red: "hover:bg-red-50 text-red-600"
  };
  return (
    <button onClick={onClick} className={`p-2 rounded-lg transition-colors ${colors[color]}`}>
      {icon}
    </button>
  );
}