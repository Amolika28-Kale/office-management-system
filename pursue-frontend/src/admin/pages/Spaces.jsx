import { useEffect, useState } from "react";
import {
  fetchSpaces,
  deleteSpace,
  toggleSpaceStatus,
} from "../../services/spaceService";
import { useNavigate } from "react-router-dom";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

const FILTERS = [
  { label: "All", value: "" },
  { label: "Desk", value: "desk" },
  { label: "Cabins", value: "cabin" },
  { label: "Conference", value: "conference" },
  { label: "Utility", value: "utility" },
];

export default function Spaces() {
  const [spaces, setSpaces] = useState([]);
  const [activeFilter, setActiveFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const navigate = useNavigate();

  const loadSpaces = async () => {
    const res = await fetchSpaces({
      type: activeFilter || undefined,
      page,
      limit: 10,
    });

    setSpaces(res.data.data);
    setPages(res.data.pagination.pages);
  };

  useEffect(() => {
    setPage(1);
  }, [activeFilter]);

  useEffect(() => {
    loadSpaces();
  }, [page, activeFilter]);

  const handleDelete = async (id) => {
    if (confirm("Delete this space?")) {
      await deleteSpace(id);
      loadSpaces();
    }
  };

  const handleToggle = async (id) => {
    await toggleSpaceStatus(id);
    loadSpaces();
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Space Management
          </h1>
          <p className="text-sm text-gray-500">
            Desks, cabins & conference rooms
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/spaces/add")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow"
        >
          <PlusIcon className="w-5 h-5" />
          Add Space
        </button>
      </div>

      {/* FILTERS */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition
              ${
                activeFilter === f.value
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th>Type</th>
              <th>Capacity</th>
              <th>Price</th>
              <th>Status</th>
              <th className="text-right pr-6">Actions</th>
            </tr>
          </thead>

          <tbody>
            {spaces.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-400">
                  No spaces found
                </td>
              </tr>
            ) : (
              spaces.map((s) => (
                <tr
                  key={s._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-4 font-medium">{s.name}</td>
                  <td className="capitalize">{s.type}</td>
                  <td>{s.capacity || "-"}</td>
                  <td>₹{s.price}</td>
                  <td>
                    <StatusBadge active={s.isActive} />
                  </td>
                  <td className="text-right pr-6 space-x-3">
                    <IconButton onClick={() => navigate(`/admin/spaces/edit/${s._id}`)}>
                      <PencilIcon />
                    </IconButton>
                    <IconButton onClick={() => handleToggle(s._id)}>
                      <ArrowPathIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(s._id)} danger>
                      <TrashIcon />
                    </IconButton>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {spaces.map((s) => (
          <div
            key={s._id}
            className="bg-white rounded-xl shadow p-4 space-y-2"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">{s.name}</h3>
              <StatusBadge active={s.isActive} />
            </div>

            <p className="text-sm text-gray-500 capitalize">{s.type}</p>

            <div className="flex justify-between text-sm">
              <span>Capacity: {s.capacity || "-"}</span>
              <span className="font-medium">₹{s.price}</span>
            </div>

            <div className="flex justify-end gap-4 pt-2">
              <button
                onClick={() => navigate(`/admin/spaces/edit/${s._id}`)}
                className="text-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleToggle(s._id)}
                className="text-yellow-600"
              >
                Toggle
              </button>
              <button
                onClick={() => handleDelete(s._id)}
                className="text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      {pages > 1 && (
        <div className="flex justify-center gap-2 pt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Prev
          </button>

          {[...Array(pages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded border ${
                page === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-white"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={page === pages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------- UI HELPERS ---------- */

function StatusBadge({ active }) {
  return active ? (
    <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
      Active
    </span>
  ) : (
    <span className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-700">
      Inactive
    </span>
  );
}

function IconButton({ children, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded hover:bg-gray-100 transition ${
        danger ? "text-red-600" : "text-gray-600"
      }`}
    >
      <span className="w-5 h-5 inline-block">{children}</span>
    </button>
  );
}
