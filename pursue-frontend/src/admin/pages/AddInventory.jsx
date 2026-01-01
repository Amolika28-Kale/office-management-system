import { useState } from "react";
import { createInventory } from "../../services/inventoryService";
import { useNavigate } from "react-router-dom";

export default function AddInventory() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    itemName: "",
    category: "Furniture",
    quantity: 0,
    minStock: 0,
    unitPrice: 0,
    location: "",
    notes: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createInventory(form);
    navigate("/admin/inventory");
  };

  return (
    <div className="max-w-2xl bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Add Inventory Item</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Item name"
          className="input"
          value={form.itemName}
          onChange={(e) => setForm({ ...form, itemName: e.target.value })}
          required
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
            placeholder="Quantity"
            className="input"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          />
          <input
            type="number"
            placeholder="Min Stock"
            className="input"
            value={form.minStock}
            onChange={(e) => setForm({ ...form, minStock: e.target.value })}
          />
          <input
            type="number"
            placeholder="Unit Price"
            className="input"
            value={form.unitPrice}
            onChange={(e) => setForm({ ...form, unitPrice: e.target.value })}
          />
        </div>

        <input
          placeholder="Location"
          className="input"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />

        <textarea
          placeholder="Notes"
          className="input h-24"
          value={form.notes}
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
            Add Item
          </button>
        </div>
      </form>
    </div>
  );
}
