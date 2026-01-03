import { useEffect, useState } from "react";
import { createBranch, getBranchById, updateBranch } from "../../services/branchServices";
import { useNavigate, useParams } from "react-router-dom";

export default function BranchForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    city: "Pune",
    address: "",
    isActive: true,
  });

  useEffect(() => {
    if (id) load();
  }, [id]);

  const load = async () => {
    const res = await getBranchById(id);
    setForm(res);
  };

  const submit = async (e) => {
    e.preventDefault();
    id ? await updateBranch(id, form) : await createBranch(form);
    navigate("/admin/branches");
  };

  return (
    <div className="max-w-xl p-6">
      <h2 className="text-xl font-bold mb-4">
        {id ? "Edit Branch" : "Add Branch"}
      </h2>

      <form onSubmit={submit} className="space-y-4">
        <input
          placeholder="Branch Name"
          className="w-full border p-3 rounded"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <input
          placeholder="City"
          className="w-full border p-3 rounded"
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
        />

        <textarea
          placeholder="Address"
          className="w-full border p-3 rounded"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) =>
              setForm({ ...form, isActive: e.target.checked })
            }
          />
          Active
        </label>
<button className="bg-black text-white px-6 py-2 rounded">
          Cancel
        </button>
        <button className="bg-black text-white px-6 py-2 rounded">
          Save
        </button>
      </form>
    </div>
  );
}
