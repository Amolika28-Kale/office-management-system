import { useEffect, useState } from "react";
import { createBranch, getBranchById, updateBranch } from "../../services/branchServices";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Save, Building2, MapPin, AlignLeft, Loader2 } from "lucide-react";

export default function BranchForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
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
    setFetching(true);
    try {
      const res = await getBranchById(id);
      setForm(res);
    } finally {
      setFetching(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      id ? await updateBranch(id, form) : await createBranch(form);
      navigate("/admin/branches");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8">
      {/* Top Navigation */}
      <button
        onClick={() => navigate("/admin/branches")}
        className="flex items-center gap-1 text-gray-500 hover:text-gray-800 transition-colors mb-6 group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Back to Branches
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-2xl font-bold text-gray-900">
            {id ? "Edit Branch" : "Add New Branch"}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Enter the details of the physical office location below.
          </p>
        </div>

        <form onSubmit={submit} className="p-6 space-y-5">
          {/* Branch Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Building2 size={16} /> Branch Name
            </label>
            <input
              placeholder="e.g. Main Headquarters"
              className="w-full border border-gray-300 p-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          {/* City */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <MapPin size={16} /> City
            </label>
            <input
              placeholder="e.g. Mumbai"
              className="w-full border border-gray-300 p-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              required
            />
          </div>

          {/* Address */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <AlignLeft size={16} /> Full Address
            </label>
            <textarea
              rows={3}
              placeholder="Building name, Street, Area..."
              className="w-full border border-gray-300 p-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>

          {/* Status Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div>
              <p className="font-semibold text-gray-900">Branch Status</p>
              <p className="text-xs text-gray-500">Enable or disable this branch from the system.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => navigate("/admin/branches")}
              className="flex-1 px-6 py-3 rounded-lg border border-gray-300 font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold px-6 py-3 rounded-lg shadow-lg shadow-indigo-200 transition-all active:scale-[0.98]"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              {id ? "Update Branch" : "Save Branch"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}