import { useEffect, useState } from "react";
import { createBooking } from "../../services/bookingService";
import { fetchUsers } from "../../services/userService";
import { fetchSpaces } from "../../services/spaceService";
import { useNavigate } from "react-router-dom";

const SPACE_TABS = [
  { label: "Cabins", value: "cabin" },
  { label: "Desks", value: "desk" },
  { label: "Conference", value: "conference" },
  { label: "Utility", value: "utility" },
];

export default function CreateBooking() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [spaces, setSpaces] = useState([]);
  const [activeType, setActiveType] = useState("cabin");

  const [form, setForm] = useState({
    userId: "",
    userName: "",
    userEmail: "",
    space: "",
    startDate: "",
    endDate: "",
    totalAmount: "",
    notes: "",
  });

  /* FETCH USERS + SPACES */
  useEffect(() => {
    fetchUsers().then((res) => setUsers(res.data));
    fetchSpaces({ status: "active", limit: 200 }).then(
      (res) => setSpaces(res.data.data)
    );
  }, []);

  /* FILTERED SPACES */
  const filteredSpaces = spaces.filter(
    (s) => s.type === activeType && s.isActive
  );

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleUserSelect = (e) => {
    const user = users.find((u) => u._id === e.target.value);
    setForm({
      ...form,
      userId: user._id,
      userName: user.name,
      userEmail: user.email,
    });
  };

  const handleTabChange = (type) => {
    setActiveType(type);
    setForm({ ...form, space: "" }); // reset space
  };

  const submit = async (e) => {
    e.preventDefault();
    await createBooking(form);
    navigate("/admin/bookings");
  };

  return (
    <div className="max-w-4xl bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">Create Booking</h2>

      {/* SPACE TYPE TABS */}
      <div className="flex gap-3 mb-6">
        {SPACE_TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => handleTabChange(t.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium border ${
              activeType === t.value
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="grid grid-cols-2 gap-4">

        {/* USER */}
        <select
          className="border p-2 rounded"
          onChange={handleUserSelect}
          required
        >
          <option value="">Select User</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name} ({u.email})
            </option>
          ))}
        </select>

        {/* SPACE */}
        <select
          className="border p-2 rounded"
          name="space"
          value={form.space}
          onChange={handleChange}
          required
        >
          <option value="">Select {activeType}</option>
          {filteredSpaces.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name} – ₹{s.price}
            </option>
          ))}
        </select>

        {/* DATES */}
        <input
          type="date"
          name="startDate"
          className="border p-2 rounded"
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="endDate"
          className="border p-2 rounded"
          onChange={handleChange}
          required
        />

        {/* AMOUNT */}
        <input
          name="totalAmount"
          placeholder="Total Amount"
          className="border p-2 rounded"
          onChange={handleChange}
          required
        />

        {/* NOTES */}
        <textarea
          name="notes"
          placeholder="Notes"
          className="border p-2 rounded col-span-2"
          onChange={handleChange}
        />

        {/* ACTIONS */}
        <div className="col-span-2 flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={() => navigate("/admin/bookings")}
            className="border px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button className="bg-blue-600 text-white px-6 py-2 rounded">
            Create Booking
          </button>
        </div>
      </form>
    </div>
  );
}
