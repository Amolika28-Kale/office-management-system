import { useEffect, useState } from "react";
import { fetchBranches, deleteBranch } from "../../services/branchServices";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash } from "lucide-react";

export default function Branches() {
  const [branches, setBranches] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await fetchBranches();
    setBranches(res);
  };

  const remove = async (id) => {
    if (!confirm("Delete this branch?")) return;
    await deleteBranch(id);
    load();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Branches</h1>
        <button
          onClick={() => navigate("/admin/branches/new")}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded"
        >
          <Plus size={16} /> Add Branch
        </button>
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3">City</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {branches.map(b => (
              <tr key={b._id} className="border-t">
                <td className="p-3 font-semibold">{b.name}</td>
                <td className="p-3 text-center">{b.city}</td>
                <td className="p-3 text-center">
                  {b.isActive ? "Active" : "Inactive"}
                </td>
                <td className="p-3 text-right flex justify-end gap-2">
                  <button
                    onClick={() => navigate(`/admin/branches/edit/${b._id}`)}
                    className="p-2 hover:bg-gray-100 rounded"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => remove(b._id)}
                    className="p-2 hover:bg-red-100 text-red-600 rounded"
                  >
                    <Trash size={16} />
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
