import { useEffect, useState, cloneElement } from "react";
import { getInventory, deleteInventory } from "../../services/inventoryService";
import { useNavigate } from "react-router-dom";
import {
  CubeIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  BanknotesIcon,
  Square3Stack3DIcon,
  PencilSquareIcon,
  TrashIcon
} from "@heroicons/react/24/outline";

export default function InventoryList() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchInventory = async () => {
    try {
      const res = await getInventory();
      setItems(res.data.data);
    } catch (err) {
      console.error("Failed to load inventory", err);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this item?")) return;
    await deleteInventory(id);
    fetchInventory();
  };

  // Logic Calculations
  const totalValue = items.reduce((a, b) => a + b.totalValue, 0);
  const lowStock = items.filter(i => i.quantity <= i.minStock);
  const categories = ["All", ...new Set(items.map(i => i.category))];

  const filteredItems = items.filter(item => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const matchesSearch = item.itemName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
      
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Inventory Management</h1>
          <p className="text-slate-500 font-medium mt-1">Track asset values, stock levels, and office locations.</p>
        </div>

        <button
          onClick={() => navigate("/admin/inventory/add")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-indigo-100 transition-all active:scale-95 font-bold"
        >
          <PlusIcon className="w-5 h-5 stroke-[3]" />
          Add New Item
        </button>
      </div>

      {/* 2. STATS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard title="Total Items" value={items.length} icon={<CubeIcon />} color="indigo" />
        <StatCard title="Asset Value" value={`₹${totalValue.toLocaleString()}`} icon={<BanknotesIcon />} color="emerald" />
        <StatCard title="Low Stock" value={lowStock.length} icon={<ExclamationTriangleIcon />} color="amber" />
        <StatCard title="Categories" value={categories.length - 1} icon={<Square3Stack3DIcon />} color="purple" />
      </div>

      {/* 3. LOW STOCK ALERT */}
      {lowStock.length > 0 && (
        <div className="bg-amber-50 border border-amber-100 rounded-[1.5rem] p-4 flex items-center gap-4 animate-bounce-subtle">
          <div className="bg-amber-500 p-2 rounded-xl text-white">
            <ExclamationTriangleIcon className="w-5 h-5" />
          </div>
          <p className="text-sm text-amber-900 font-bold">
            Alert: {lowStock.length} items are below minimum stock levels. Restock required.
          </p>
        </div>
      )}

      {/* 4. MANAGEMENT BAR (Search & Filters) */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm">
        <div className="relative w-full md:w-96">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search assets by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-tight whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? "bg-slate-900 text-white shadow-lg shadow-slate-200"
                  : "bg-white text-slate-500 hover:bg-slate-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 5. TABLE SECTION (Desktop) & CARDS (Mobile) */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        {/* DESKTOP TABLE */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Asset Detail</th>
                <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Stock Info</th>
                <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Location</th>
                <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Pricing (Unit/Total)</th>
                <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map(item => (
                <tr key={item._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-6">
                    <p className="font-bold text-slate-800">{item.itemName}</p>
                    <p className="text-xs text-indigo-600 font-bold uppercase mt-1">{item.category}</p>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-black text-slate-900">{item.quantity}</span>
                      <span className="text-xs text-slate-400 font-medium">/ Min: {item.minStock}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <MapPinIcon className="w-4 h-4" />
                      <span className="text-sm font-medium">{item.location}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <p className="text-sm font-bold text-slate-900">₹{item.unitPrice.toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400 font-black uppercase">Value: ₹{item.totalValue.toLocaleString()}</p>
                  </td>
                  <td className="p-6 text-center">
                    <StatusBadge isLow={item.quantity <= item.minStock} />
                  </td>
                  <td className="p-6">
                    <div className="flex justify-end gap-2">
                      <ActionBtn onClick={() => navigate(`/admin/inventory/edit/${item._id}`)} icon={<PencilSquareIcon />} color="indigo" />
                      <ActionBtn onClick={() => handleDelete(item._id)} icon={<TrashIcon />} color="red" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE GRID VIEW */}
        <div className="grid grid-cols-1 divide-y divide-slate-100 lg:hidden">
          {filteredItems.map(item => (
            <div key={item._id} className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-slate-900">{item.itemName}</h3>
                  <p className="text-xs font-bold text-indigo-600 uppercase mt-0.5">{item.category}</p>
                </div>
                <StatusBadge isLow={item.quantity <= item.minStock} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded-xl text-center">
                  <p className="text-[10px] text-slate-400 font-black uppercase">Quantity</p>
                  <p className="text-lg font-black text-slate-900">{item.quantity}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl text-center">
                  <p className="text-[10px] text-slate-400 font-black uppercase">Asset Value</p>
                  <p className="text-lg font-black text-slate-900">₹{item.totalValue.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex justify-between items-center pt-2">
                <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold">
                  <MapPinIcon className="w-4 h-4" /> {item.location}
                </div>
                <div className="flex gap-3">
                   <button onClick={() => navigate(`/admin/inventory/edit/${item._id}`)} className="text-indigo-600 text-sm font-bold">Edit</button>
                   <button onClick={() => handleDelete(item._id)} className="text-red-500 text-sm font-bold">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- REFINED UI COMPONENTS ---------- */

function StatCard({ title, value, icon, color }) {
  const themes = {
    indigo: "bg-indigo-500 shadow-indigo-200 text-white",
    emerald: "bg-emerald-500 shadow-emerald-200 text-white",
    amber: "bg-amber-500 shadow-amber-200 text-white",
    purple: "bg-purple-500 shadow-purple-200 text-white",
  };

  return (
    <div className="bg-white p-5 rounded-[1.5rem] border border-slate-100 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
      <div className="flex flex-col gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${themes[color]}`}>
          {cloneElement(icon, { className: "w-5 h-5" })}
        </div>
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</p>
          <p className="text-2xl font-black text-slate-900 mt-0.5 tracking-tight">{value}</p>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ isLow }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tight ${
      isLow ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${isLow ? "bg-red-500 animate-pulse" : "bg-emerald-500"}`} />
      {isLow ? "Restock" : "Healthy"}
    </span>
  );
}

function ActionBtn({ icon, onClick, color }) {
  const colors = {
    indigo: "hover:bg-indigo-50 text-slate-400 hover:text-indigo-600",
    red: "hover:bg-red-50 text-slate-400 hover:text-red-600"
  };
  return (
    <button onClick={onClick} className={`p-2.5 rounded-xl transition-all ${colors[color]}`}>
      {cloneElement(icon, { className: "w-5 h-5" })}
    </button>
  );
}