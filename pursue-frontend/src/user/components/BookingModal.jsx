import { useEffect, useState } from "react";
import { createBooking, updateBooking } from "../services/bookingService";
import { fetchSpaces } from "../../user/services/spaceService";

export default function BookingModal({ booking, onClose, onSuccess, defaultType }) {
  const [spaces, setSpaces] = useState([]);

  const [form, setForm] = useState({
    spaceType: booking?.spaceId?.type || defaultType || "Cabin",
    spaceId: booking?.spaceId?._id || "",
    fromDate: booking?.fromDate?.slice(0, 10) || "",
    toDate: booking?.toDate?.slice(0, 10) || "",
    planType: booking?.planType || "Monthly",
    notes: booking?.notes || "",
  });

  /* LOAD SPACES BY TYPE */
  useEffect(() => {
    loadSpaces(form.spaceType);
  }, [form.spaceType]);

const loadSpaces = async (type) => {
  try {
    const res = await fetchSpaces({
      type: type.toLowerCase(),
    });
    setSpaces(res.data);
  } catch (err) {
    console.error("Failed to load spaces", err);
    setSpaces([]);
  }
};


  /* SUBMIT */
const handleSubmit = async () => {
  const payload = {
    spaceId: form.spaceId,
    fromDate: new Date(form.fromDate).toISOString(),
    toDate: new Date(form.toDate).toISOString(),
    planType: form.planType,
    notes: form.notes,
  };

  booking
    ? await updateBooking(booking._id, payload)
    : await createBooking(payload);

  onSuccess();
  onClose();
};


  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-lg rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">
          {booking ? "Update Booking" : "Create New Booking"}
        </h3>

        {/* BOOKING TYPE */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {["Cabin", "Desk", "Conference"].map((t) => (
            <button
              key={t}
              onClick={() =>
                setForm({ ...form, spaceType: t, spaceId: "" })
              }
              className={`border rounded-lg py-3 font-medium ${
                form.spaceType === t
                  ? "border-blue-600 bg-blue-50"
                  : ""
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* SELECT SPACE */}
        <select
          className="border w-full p-3 rounded-lg mb-4"
          value={form.spaceId}
          onChange={(e) =>
            setForm({ ...form, spaceId: e.target.value })
          }
        >
          <option value="">Select {form.spaceType}</option>
          {spaces.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>

        {/* DATES */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            type="date"
            className="border p-3 rounded-lg"
            value={form.fromDate}
            onChange={(e) =>
              setForm({ ...form, fromDate: e.target.value })
            }
          />
          <input
            type="date"
            className="border p-3 rounded-lg"
            value={form.toDate}
            onChange={(e) =>
              setForm({ ...form, toDate: e.target.value })
            }
          />
        </div>

        {/* PLAN TYPE */}
        <select
          className="border w-full p-3 rounded-lg mb-4"
          value={form.planType}
          onChange={(e) =>
            setForm({ ...form, planType: e.target.value })
          }
        >
          <option>Daily</option>
          <option>Weekly</option>
          <option>Monthly</option>
        </select>

        {/* NOTES */}
        <textarea
          className="border w-full p-3 rounded-lg mb-4"
          placeholder="Add any additional notes..."
          rows={3}
          value={form.notes}
          onChange={(e) =>
            setForm({ ...form, notes: e.target.value })
          }
        />

        {/* ACTIONS */}
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg"
          >
            Save Booking
          </button>
        </div>
      </div>
    </div>
  );
}
