import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { updateBooking } from "../../user/services/bookingService";

export default function EditBooking() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fromDate: "",
    toDate: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateBooking(id, form);
    navigate("/user/bookings");
  };

  return (
    <div className="max-w-lg bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Edit Booking</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
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

        <button className="bg-green-600 text-white px-4 py-2 rounded">
          Update Booking
        </button>
      </form>
    </div>
  );
}
