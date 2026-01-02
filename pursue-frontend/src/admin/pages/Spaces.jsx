import { useEffect, useState, cloneElement } from "react";
import { fetchSpaces, deleteSpace, toggleSpaceStatus } from "../../services/spaceService";
import { useNavigate } from "react-router-dom";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowsRightLeftIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

/* ---------------- FILTERS ---------------- */
const FILTERS = [
  { label: "All Spaces", value: "" },
  { label: "Hot Desks", value: "desk" },
  { label: "Private Cabins", value: "cabin" },
  { label: "Meeting Rooms", value: "conference" },
];

/* ---------------- DEBOUNCE HOOK ---------------- */
function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

/* ---------------- MAIN COMPONENT ---------------- */
export default function Spaces() {
  const navigate = useNavigate();

  const [spaces, setSpaces] = useState([]);
  const [activeFilter, setActiveFilter] = useState("");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const loadSpaces = async () => {
    try {
      const res = await fetchSpaces({
        type: activeFilter || undefined,
        search: debouncedSearch || undefined,
        page,
        limit: 10,
      });

      setSpaces(res.data.data);
      setPages(res.data.pagination.pages);
    } catch (err) {
      console.error("Failed to fetch spaces", err);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [activeFilter, debouncedSearch]);

  useEffect(() => {
    loadSpaces();
  }, [page, activeFilter, debouncedSearch]);

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

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900">Space Management</h1>
          <p className="text-slate-500 font-medium mt-1">
            Configure and monitor your coworking inventory.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Quick find..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-indigo-50 outline-none w-64"
            />
          </div>

          <button
            onClick={() => navigate("/admin/spaces/add")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl flex items-center gap-2 shadow-lg font-bold"
          >
            <PlusIcon className="w-5 h-5 stroke-[3]" />
            Add Space
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold border ${
              activeFilter === f.value
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* TABLE */}
    {/* TABLE – Desktop */}
<div className="hidden md:block bg-white rounded-[2rem] border shadow-sm overflow-hidden">
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr className="border-b">
          <th className="p-6 text-xs font-black text-slate-400">SPACE</th>
          <th className="p-6 text-xs font-black text-slate-400">TYPE</th>
          <th className="p-6 text-xs font-black text-slate-400">PRICE</th>
          <th className="p-6 text-xs font-black text-slate-400 text-center">STATUS</th>
          <th className="p-6 text-xs font-black text-slate-400 text-right">ACTIONS</th>
        </tr>
      </thead>
      <tbody className="divide-y">
        {spaces.map((s) => (
          <tr key={s._id} className="hover:bg-slate-50">
            <td className="p-6 font-bold">{s.name}</td>
            <td className="p-6 capitalize">{s.type}</td>
            <td className="p-6 font-black">₹{s.price}/hr</td>
            <td className="p-6 text-center">
              <StatusBadge active={s.isActive} />
            </td>
            <td className="p-6 flex justify-end gap-2">
              <ActionBtn icon={<PencilIcon />} onClick={() => navigate(`/admin/spaces/edit/${s._id}`)} />
              <ActionBtn icon={<ArrowsRightLeftIcon />} color="amber" onClick={() => handleToggle(s._id)} />
              <ActionBtn icon={<TrashIcon />} color="red" onClick={() => handleDelete(s._id)} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

{/* MOBILE VIEW */}
<div className="md:hidden space-y-4">
  {spaces.length === 0 ? (
    <p className="text-center text-slate-400 py-20">No spaces found</p>
  ) : (
    spaces.map((s) => (
      <div
        key={s._id}
        className="bg-white rounded-2xl border p-4 shadow-sm space-y-3"
      >
        <div className="flex justify-between items-start">
          <h3 className="font-black text-lg">{s.name}</h3>
          <StatusBadge active={s.isActive} />
        </div>

        <p className="text-sm capitalize text-slate-500">
          {s.type} • Capacity {s.capacity || 0}
        </p>

        <p className="font-black text-indigo-600">₹{s.price}/hr</p>

        <div className="flex justify-end gap-3 pt-2">
          <ActionBtn icon={<PencilIcon />} onClick={() => navigate(`/admin/spaces/edit/${s._id}`)} />
          <ActionBtn icon={<ArrowsRightLeftIcon />} color="amber" onClick={() => handleToggle(s._id)} />
          <ActionBtn icon={<TrashIcon />} color="red" onClick={() => handleDelete(s._id)} />
        </div>
      </div>
    ))
  )}
</div>


      {/* PAGINATION */}
      {pages > 1 && (
        <div className="flex justify-center gap-2">
          <PaginationBtn label="Prev" disabled={page === 1} onClick={() => setPage(page - 1)} />
          {[...Array(pages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-10 h-10 rounded-xl font-bold ${
                page === i + 1 ? "bg-indigo-600 text-white" : "bg-white"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <PaginationBtn label="Next" disabled={page === pages} onClick={() => setPage(page + 1)} />
        </div>
      )}
    </div>
  );
}

/* ---------------- HELPERS ---------------- */
function StatusBadge({ active }) {
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-black ${
      active ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
    }`}>
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function ActionBtn({ icon, label, onClick, color = "slate" }) {
  const styles = {
    slate: "hover:text-indigo-600",
    amber: "hover:text-amber-600",
    red: "hover:text-red-600",
  };

  return (
    <button onClick={onClick} className={`p-2 ${styles[color]}`}>
      {cloneElement(icon, { className: "w-5 h-5" })}
    </button>
  );
}

function PaginationBtn({ label, onClick, disabled }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="px-4 py-2 border rounded-xl disabled:opacity-30"
    >
      {label}
    </button>
  );
}
