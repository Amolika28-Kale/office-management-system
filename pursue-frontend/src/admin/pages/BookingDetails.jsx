import { useEffect, useState } from "react";
import {
  getBookingById,
  updateBookingStatus,
  cancelBooking,
} from "../../services/bookingService";
import { useParams, useNavigate } from "react-router-dom";

export default function BookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getBookingById(id).then(res => setBooking(res.data.data));
  }, [id]);

  if (!booking) return null;

  const updateStatus = async (data) => {
    setLoading(true);
    await updateBookingStatus(id, data);
    const res = await getBookingById(id);
    setBooking(res.data.data);
    setLoading(false);
  };

  const handleCancel = async () => {
    if (!confirm("Cancel this booking?")) return;
    await cancelBooking(id);
    navigate("/admin/bookings");
  };

  return (
    <div className="max-w-4xl bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-6">Booking Details</h2>

      {/* INFO */}
      <div className="grid grid-cols-2 gap-4 text-sm mb-6">
        <p><b>User:</b> {booking.userName}</p>
        <p><b>Email:</b> {booking.userEmail}</p>

  <p><b>Space:</b> {booking.spaceId?.name}</p>
<p><b>Type:</b> {booking.spaceId?.type}</p>

        <p><b>Amount:</b> ₹{booking.totalAmount}</p>
        <p>
          <b>Status:</b>{" "}
          <span className={`px-2 py-1 rounded text-xs
            ${booking.status === "pending" && "bg-yellow-100 text-yellow-700"}
            ${booking.status === "approved" && "bg-blue-100 text-blue-700"}
            ${booking.status === "active" && "bg-green-100 text-green-700"}
            ${booking.status === "completed" && "bg-gray-200 text-gray-700"}
            ${booking.status === "cancelled" && "bg-red-100 text-red-700"}
          `}>
            {booking.status}
          </span>
        </p>

        <p>
          <b>Payment:</b>{" "}
          <span className={`px-2 py-1 rounded text-xs
            ${booking.paymentStatus === "pending" && "bg-yellow-100 text-yellow-700"}
            ${booking.paymentStatus === "paid" && "bg-green-100 text-green-700"}
            ${booking.paymentStatus === "failed" && "bg-red-100 text-red-700"}
          `}>
            {booking.paymentStatus}
          </span>
        </p>

        <p className="col-span-2">
          <b>Dates:</b>{" "}
         {new Date(booking.fromDate).toLocaleDateString()} – 
{new Date(booking.toDate).toLocaleDateString()}
        </p>

        {booking.notes && (
          <p className="col-span-2">
            <b>Notes:</b> {booking.notes}
          </p>
        )}
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-3">
        <button
          onClick={() => navigate("/admin/bookings")}
          className="border px-4 py-2 rounded"
        >
          Back
        </button>

        {booking.status === "pending" && (
          <button
            disabled={loading}
            onClick={() => updateStatus({ status: "approved" })}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Approve
          </button>
        )}

        {booking.status === "approved" && (
          <button
            disabled={loading}
            onClick={() => updateStatus({ status: "active", paymentStatus: "paid" })}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Mark Active
          </button>
        )}

        {booking.status === "active" && (
          <button
            disabled={loading}
            onClick={() => updateStatus({ status: "completed" })}
            className="bg-gray-700 text-white px-4 py-2 rounded"
          >
            Complete
          </button>
        )}

        {booking.status !== "cancelled" && booking.status !== "completed" && (
          <button
            onClick={handleCancel}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
