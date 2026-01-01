import { useEffect, useState } from "react";
import {
  getInventoryById,
  updateInventory,
} from "../../services/inventoryService";
import { useNavigate, useParams } from "react-router-dom";

export default function EditInventory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);

  useEffect(() => {
    getInventoryById(id).then((res) => setForm(res.data.data));
  }, [id]);

  if (!form) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateInventory(id, form);
    navigate("/admin/inventory");
  };

  return (
    <div className="max-w-2xl bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Edit Inventory</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="input"
          value={form.itemName}
          onChange={(e) => setForm({ ...form, itemName: e.target.value })}
        />

        <select
          className="input"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          <option>Furniture</option>
          <option>Electronics</option>
          <option>Stationery</option>
          <option>Pantry</option>
          <option>Other</option>
        </select>

        <div className="grid grid-cols-3 gap-3">
          <input
            type="number"
            className="input"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          />
          <input
            type="number"
            className="input"
            value={form.minStock}
            onChange={(e) => setForm({ ...form, minStock: e.target.value })}
          />
          <input
            type="number"
            className="input"
            value={form.unitPrice}
            onChange={(e) => setForm({ ...form, unitPrice: e.target.value })}
          />
        </div>

        <input
          className="input"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />

        <textarea
          className="input h-24"
          value={form.notes || ""}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/admin/inventory")}
            className="border px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Update
          </button>
        </div>
      </form>
    </div>
  );
}
