import { useEffect, useState } from "react";
import {
  fetchSpaces,
  deleteSpace,
  toggleSpaceStatus,
} from "../../services/spaceService";
import { useNavigate } from "react-router-dom";

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
    setPage(1); // reset page when filter changes
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
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Spaces</h1>
          <p className="text-gray-500">Manage desks, cabins & rooms</p>
        </div>
        <button
          onClick={() => navigate("/admin/spaces/add")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          + Add Space
        </button>
      </div>

      {/* FILTERS */}
      <div className="flex gap-3 mb-5">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium border ${
              activeFilter === f.value
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
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
                <td colSpan="6" className="p-6 text-center text-gray-500">
                  No spaces found
                </td>
              </tr>
            ) : (
              spaces.map((s) => (
                <tr key={s._id} className="border-t hover:bg-gray-50">
                  <td className="p-4">{s.name}</td>
                  <td className="capitalize">{s.type}</td>
                  <td>{s.capacity || "-"}</td>
                  <td>₹{s.price}</td>
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        s.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {s.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="text-right pr-6 space-x-3">
                    <button
                      onClick={() =>
                        navigate(`/admin/spaces/edit/${s._id}`)
                      }
                    >
                      ✏️
                    </button>
                    <button onClick={() => handleToggle(s._id)}>🔄</button>
                    <button onClick={() => handleDelete(s._id)}>🗑️</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* PAGINATION */}
        {pages > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t">
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
    </div>
  );
}
