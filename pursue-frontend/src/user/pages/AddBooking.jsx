import { useState } from "react";
import { createBooking } from "../../user/services/bookingService";
import { useNavigate } from "react-router-dom";

export default function AddBooking() {
  const [form, setForm] = useState({
    spaceId: "",
    fromDate: "",
    toDate: ""
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createBooking(form);
    navigate("/user/bookings");
  };

  return (
    <div className="max-w-lg bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">New Booking</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Space ID"
          className="w-full border p-2 rounded"
          onChange={(e) =>
            setForm({ ...form, spaceId: e.target.value })
          }
        />

        <input
          type="date"
          className="w-full border p-2 rounded"
          onChange={(e) =>
            setForm({ ...form, fromDate: e.target.value })
          }
        />

        <input
          type="date"
          className="w-full border p-2 rounded"
          onChange={(e) =>
            setForm({ ...form, toDate: e.target.value })
          }
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Submit Booking
        </button>
      </form>
    </div>
  );
}
