import { useEffect, useState } from "react";
import { getInventory, deleteInventory } from "../../services/inventoryService";
import { useNavigate } from "react-router-dom";
import {
  CubeIcon,
  ExclamationTriangleIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

export default function InventoryList() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");

  const fetchInventory = async () => {
    const res = await getInventory();
    setItems(res.data.data);
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this item?")) return;
    await deleteInventory(id);
    fetchInventory();
  };

  const totalValue = items.reduce((a, b) => a + b.totalValue, 0);
  const lowStock = items.filter(i => i.quantity <= i.minStock);

  const categories = ["All", ...new Set(items.map(i => i.category))];

  const filteredItems =
    activeCategory === "All"
      ? items
      : items.filter(i => i.category === activeCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Inventory Management</h1>
          <p className="text-gray-500 text-sm">
            Track and manage all office inventory
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/inventory/add")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow"
        >
          <PlusIcon className="w-5 h-5" />
          Add Item
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Items" value={items.length} color="blue" />
        <StatCard
          title="Total Value"
          value={`₹${totalValue.toLocaleString()}`}
          color="green"
        />
        <StatCard title="Low Stock Items" value={lowStock.length} color="yellow" />
        <StatCard
          title="Categories"
          value={categories.length - 1}
          color="purple"
        />
      </div>

      {/* Alert */}
      {lowStock.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
          <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600" />
          <p className="text-sm text-yellow-800">
            {lowStock.length} items are running low on stock. Consider restocking.
          </p>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex gap-3 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full border text-sm font-medium
              ${
                activeCategory === cat
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search */}
      <input
        placeholder="Search inventory..."
        className="w-full border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
      />

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-4 text-left">Item Name</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Min Stock</th>
              <th>Location</th>
              <th>Unit Price</th>
              <th>Total Value</th>
              <th>Status</th>
              <th className="text-right pr-6">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredItems.map(item => (
              <tr key={item._id} className="border-t hover:bg-gray-50">
                <td className="p-4 font-medium">{item.itemName}</td>
                <td>{item.category}</td>
                <td>{item.quantity}</td>
                <td>{item.minStock}</td>
                <td>{item.location}</td>
                <td>₹{item.unitPrice.toLocaleString()}</td>
                <td>₹{item.totalValue.toLocaleString()}</td>
                <td>
                  {item.quantity <= item.minStock ? (
                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs">
                      Low Stock
                    </span>
                  ) : (
                    <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs">
                      In Stock
                    </span>
                  )}
                </td>
                <td className="text-right pr-6 space-x-4">
                  <button
                    onClick={() =>
                      navigate(`/admin/inventory/edit/${item._id}`)
                    }
                    className="text-blue-600 font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="text-red-600 font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {filteredItems.length === 0 && (
              <tr>
                <td colSpan="9" className="text-center py-10 text-gray-400">
                  No inventory items found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- Stat Card ---------- */
function StatCard({ title, value, color }) {
  const colors = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    yellow: "bg-yellow-100 text-yellow-600",
    purple: "bg-purple-100 text-purple-600",
  };

  return (
    <div className="bg-white rounded-xl shadow p-5 flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xl font-semibold mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-lg ${colors[color]}`}>
        <CubeIcon className="w-6 h-6" />
      </div>
    </div>
  );
}
