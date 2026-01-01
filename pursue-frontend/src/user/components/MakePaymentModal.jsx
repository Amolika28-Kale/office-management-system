import { useEffect, useState } from "react";
import {
  createStripePaymentIntent,
  confirmStripePayment,
} from "../../user/services/paymentService";
import { getMyBookings } from "../../user/services/bookingService";

export default function MakePaymentModal({ close }) {
  const [bookings, setBookings] = useState([]);
  const [bookingId, setBookingId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadBookings();
  }, []);

const loadBookings = async () => {
  try {
    const data = await getMyBookings(); // data is already ARRAY
    console.log("Bookings response:", data);

    setBookings(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error("Booking fetch error:", err);
  }
};




  const selectedBooking = bookings.find((b) => b._id === bookingId);
  const subtotal = selectedBooking?.totalAmount || 0;
  const gst = subtotal * 0.18;
  const total = subtotal + gst;

const submit = async () => {
  if (!bookingId) return alert("Select booking");

  try {
    setLoading(true);

    // 1️⃣ Create Stripe PaymentIntent
    const res = await createStripePaymentIntent({
      bookingId,
    });

    // 2️⃣ TEMP auto-confirm (test mode only)
    await confirmStripePayment(res.data.paymentId);

    close();
  } catch (err) {
    console.error(err);
    alert("Payment failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-[420px] rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4">Make Payment</h3>

        {/* BOOKING */}
        <label className="text-sm font-medium">Select Booking</label>
<select
  value={bookingId}
  onChange={(e) => setBookingId(e.target.value)}
  className="w-full border p-2 rounded mb-4 mt-1"
>
  <option value="">Select Booking</option>

  {bookings.map((b) => (
    <option key={b._id} value={b._id}>
      {b.spaceId?.name} – ₹{b.totalAmount}
    </option>
  ))}
</select>



        {/* SUMMARY */}
        {selectedBooking && (
          <div className="bg-gray-50 p-3 rounded mt-4 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>GST (18%)</span>
              <span>₹{gst.toFixed(0)}</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>₹{total.toFixed(0)}</span>
            </div>
          </div>
        )}

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={close} className="border px-4 py-2 rounded">
            Cancel
          </button>
          <button
            disabled={loading}
            onClick={submit}
            className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
