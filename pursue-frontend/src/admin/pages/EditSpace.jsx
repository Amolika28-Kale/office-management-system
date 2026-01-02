import { useEffect, useState } from "react";
import { getSpaceById, updateSpace } from "../../services/spaceService";
import { useNavigate, useParams } from "react-router-dom";
import {
  BuildingOffice2Icon,
  CurrencyRupeeIcon,
  UsersIcon,
  SquaresPlusIcon,
} from "@heroicons/react/24/outline";

export default function EditSpace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSpaceById(id).then((res) => {
      setForm(res.data);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <p className="p-6 text-gray-500">Loading...</p>;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateSpace(id, form);
    navigate("/admin/spaces");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 flex justify-center">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6 sm:p-8">

        {/* HEADER */}
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Edit Space
          </h2>
          <p className="text-sm text-gray-500">
            Update details for this space
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-5"
        >
          {/* NAME */}
          <FormField label="Space Name" icon={<BuildingOffice2Icon />}>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="form-input"
              required
            />
          </FormField>

          {/* TYPE */}
          <FormField label="Space Type" icon={<SquaresPlusIcon />}>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="form-input"
            >
              <option value="desk">Desk</option>
              <option value="cabin">Cabin</option>
              <option value="conference">Conference</option>
              <option value="utility">Utility</option>
            </select>
          </FormField>

          {/* CAPACITY */}
          <FormField label="Capacity" icon={<UsersIcon />}>
            <input
              name="capacity"
              type="number"
              value={form.capacity || ""}
              onChange={handleChange}
              className="form-input"
            />
          </FormField>

          {/* PRICE */}
          <FormField label="Price (₹)" icon={<CurrencyRupeeIcon />}>
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              className="form-input"
              required
            />
          </FormField>

          {/* DESCRIPTION */}
          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-gray-600 mb-1 block">
              Description
            </label>
            <textarea
              name="description"
              value={form.description || ""}
              onChange={handleChange}
              rows={4}
              className="form-input resize-none"
            />
          </div>

          {/* ACTIONS */}
          <div className="sm:col-span-2 flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate("/admin/spaces")}
              className="px-5 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow"
            >
              Update Space
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ---------- Reusable Field ---------- */

function FormField({ label, icon, children }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
        <span className="w-4 h-4 text-gray-400">{icon}</span>
        {label}
      </label>
      {children}
    </div>
  );
}
