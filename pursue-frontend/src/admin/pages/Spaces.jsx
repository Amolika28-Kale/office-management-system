import { useEffect, useState } from "react";
import { fetchSpaces, deleteSpace, toggleSpaceStatus } from "../../services/spaceService";
import { useNavigate } from "react-router-dom";
import { 
  PlusIcon, PencilIcon, TrashIcon, ArrowsRightLeftIcon, 
  MagnifyingGlassIcon, UserGroupIcon, MapPinIcon 
} from "@heroicons/react/24/outline";

const FILTERS = [
  { label: "All Spaces", value: "" },
  { label: "Hot Desks", value: "desk" },
  { label: "Private Cabins", value: "cabin" },
  { label: "Meeting Rooms", value: "conference" },
];

export default function Spaces() {
  const [spaces, setSpaces] = useState([]);
  const [activeFilter, setActiveFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const navigate = useNavigate();

  const loadSpaces = async () => {
    try {
      const res = await fetchSpaces({
        type: activeFilter || undefined,
        page,
        limit: 10,
      });
      setSpaces(res.data.data);
      setPages(res.data.pagination.pages);
    } catch (err) {
      console.error("Failed to fetch spaces", err);
    }
  };

  useEffect(() => { setPage(1); }, [activeFilter]);
  useEffect(() => { loadSpaces(); }, [page, activeFilter]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure? This action cannot be undone.")) {
      await deleteSpace(id);
      loadSpaces();
    }
  };

  const handleToggle = async (id) => {
    await toggleSpaceStatus(id);
    loadSpaces();
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Space Management</h1>
          <p className="text-slate-500 font-medium mt-1">Configure and monitor your coworking inventory.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Quick find..." 
              className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-indigo-50 outline-none w-64 transition-all"
            />
          </div>
          <button
            onClick={() => navigate("/admin/spaces/add")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl flex items-center gap-2 shadow-lg shadow-indigo-100 transition-all active:scale-95 font-bold"
          >
            <PlusIcon className="w-5 h-5 stroke-[3]" />
            Add Space
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all border ${
              activeFilter === f.value
                ? "bg-slate-900 text-white border-slate-900 shadow-md"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Space Detail</th>
                <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Type & Capacity</th>
                <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Pricing</th>
                <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {spaces.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-20 text-center">
                    <div className="flex flex-col items-center opacity-40">
                      <MapPinIcon className="w-12 h-12 mb-2" />
                      <p className="font-bold">No spaces found in this category</p>
                    </div>
                  </td>
                </tr>
              ) : (
                spaces.map((s) => (
                  <tr key={s._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                          <MapPinIcon className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{s.name}</p>
                          <p className="text-xs text-slate-400 font-medium tracking-tight uppercase">ID: {s._id.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-bold text-slate-700 capitalize">{s.type}</span>
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <UserGroupIcon className="w-4 h-4" />
                          <span className="text-xs font-medium">Capacity: {s.capacity || "N/A"}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-lg font-black text-slate-900">
                      ₹{s.price}<span className="text-[10px] text-slate-400 font-bold">/hr</span>
                    </td>
                    <td className="p-6 text-center">
                      <StatusBadge active={s.isActive} />
                    </td>
                    <td className="p-6">
                      <div className="flex justify-end gap-2">
                        <ActionBtn onClick={() => navigate(`/admin/spaces/edit/${s._id}`)} icon={<PencilIcon />} label="Edit" />
                        <ActionBtn onClick={() => handleToggle(s._id)} icon={<ArrowsRightLeftIcon />} label="Toggle" color="amber" />
                        <ActionBtn onClick={() => handleDelete(s._id)} icon={<TrashIcon />} label="Delete" color="red" />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE GRID VIEW */}
        <div className="grid grid-cols-1 divide-y divide-slate-100 md:hidden">
          {spaces.map((s) => (
            <div key={s._id} className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">{s.name}</h3>
                  <p className="text-xs font-bold text-indigo-600 uppercase tracking-tighter">{s.type}</p>
                </div>
                <StatusBadge active={s.isActive} />
              </div>
              <div className="flex justify-between items-end">
                <div className="text-sm text-slate-500 font-medium">
                  Capacity: <span className="text-slate-900">{s.capacity || "0"}</span>
                </div>
                <div className="text-xl font-black text-slate-900">₹{s.price}</div>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => navigate(`/admin/spaces/edit/${s._id}`)} className="flex-1 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-600">Edit</button>
                <button onClick={() => handleToggle(s._id)} className="flex-1 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-600">Status</button>
                <button onClick={() => handleDelete(s._id)} className="flex-1 py-2 bg-red-50 rounded-xl text-xs font-bold text-red-600">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PAGINATION */}
      {pages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <PaginationBtn disabled={page === 1} onClick={() => setPage(page - 1)} label="Prev" />
          {[...Array(pages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                page === i + 1 ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "bg-white text-slate-500 hover:bg-slate-50"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <PaginationBtn disabled={page === pages} onClick={() => setPage(page + 1)} label="Next" />
        </div>
      )}
    </div>
  );
}

/* ---------- UI HELPERS ---------- */

function StatusBadge({ active }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tight ${
      active ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-emerald-600" : "bg-red-600"}`} />
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function ActionBtn({ icon, label, onClick, color = "slate" }) {
  const themes = {
    slate: "text-slate-400 hover:text-indigo-600 hover:bg-indigo-50",
    amber: "text-slate-400 hover:text-amber-600 hover:bg-amber-50",
    red: "text-slate-400 hover:text-red-600 hover:bg-red-50",
  };
  return (
    <button onClick={onClick} className={`p-2.5 rounded-xl transition-all relative group/btn ${themes[color]}`}>
      {cloneElement(icon, { className: "w-5 h-5" })}
      <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-bold">
        {label}
      </span>
    </button>
  );
}

function PaginationBtn({ disabled, onClick, label }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="px-4 py-2 bg-white text-slate-600 rounded-xl font-bold text-sm border border-slate-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
    >
      {label}
    </button>
  );
}

import { cloneElement } from "react";