import { useEffect, useState } from "react";
import { 
  LucideX, 
  LucideShieldCheck, 
  LucideReceipt, 
  LucideCreditCard, 
  LucideLoader2,
  LucideChevronRight 
} from "lucide-react";
import { createStripePaymentIntent, confirmStripePayment } from "../../user/services/paymentService";
import { getMyBookings } from "../../user/services/bookingService";

export default function MakePaymentModal({ close }) {
  const [bookings, setBookings] = useState([]);
  const [bookingId, setBookingId] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setFetchLoading(true);
      const data = await getMyBookings();
      // Filter for unpaid bookings only to make the UI cleaner
      const unpaid = (Array.isArray(data) ? data : []).filter(b => b.paymentStatus !== 'paid');
      setBookings(unpaid);
    } catch (err) {
      console.error("Booking fetch error:", err);
    } finally {
      setFetchLoading(false);
    }
  };

  const selectedBooking = bookings.find((b) => b._id === bookingId);
  const subtotal = selectedBooking?.totalAmount || 0;
  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  const submit = async () => {
    if (!bookingId) return;
    try {
      setLoading(true);
      const res = await createStripePaymentIntent({ bookingId });
      await confirmStripePayment(res.data.paymentId);
      close();
    } catch (err) {
      console.error(err);
      alert("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <LucideCreditCard size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Secure Checkout</h3>
          </div>
          <button onClick={close} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
            <LucideX size={20} />
          </button>
        </div>

        <div className="p-6">
          {/* BOOKING SELECTION */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <LucideReceipt size={14} /> 1. Select Outstanding Booking
            </label>
            
            <div className="max-h-[180px] overflow-y-auto pr-1 space-y-2 custom-scrollbar">
              {fetchLoading ? (
                <div className="py-4 text-center text-slate-400 text-sm animate-pulse">Fetching your bookings...</div>
              ) : bookings.length === 0 ? (
                <div className="py-4 text-center text-slate-400 text-sm border-2 border-dashed rounded-xl">No pending payments found</div>
              ) : (
                bookings.map((b) => (
                  <button
                    key={b._id}
                    onClick={() => setBookingId(b._id)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                      bookingId === b._id 
                      ? "border-emerald-500 bg-emerald-50/50 shadow-sm" 
                      : "border-slate-100 hover:border-slate-200 bg-white"
                    }`}
                  >
                    <div className="text-left">
                      <p className={`font-bold text-sm ${bookingId === b._id ? 'text-emerald-700' : 'text-slate-700'}`}>
                        {b.spaceId?.name || "Workspace"}
                      </p>
                      <p className="text-xs text-slate-500 font-medium capitalize">{b.planType} Plan</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900 text-sm">₹{b.totalAmount}</span>
                      <LucideChevronRight size={16} className={bookingId === b._id ? 'text-emerald-500' : 'text-slate-300'} />
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* SUMMARY SECTION */}
          <div className={`mt-6 transition-all duration-500 ${selectedBooking ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Payment Summary</h4>
              <div className="space-y-3 text-sm font-medium text-slate-600">
                <div className="flex justify-between">
                  <span>Base Amount</span>
                  <span className="text-slate-900 font-bold">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>GST (18%)</span>
                  <span>₹{gst.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="h-px bg-slate-200 my-2" />
                <div className="flex justify-between items-end">
                  <span className="text-slate-900 font-black text-base">Grand Total</span>
                  <span className="text-emerald-600 font-black text-xl leading-none">
                    ₹{total.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </div>
              </div>
            </div>

            {/* SECURITY BADGE */}
            <div className="flex items-center justify-center gap-2 mt-4 text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
              <LucideShieldCheck size={14} className="text-emerald-500" />
              Encrypted 256-bit Secure Payment via Stripe
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex gap-3">
          <button 
            onClick={close} 
            className="flex-1 py-3 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={loading || !bookingId}
            onClick={submit}
            className="flex-[2] bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <LucideLoader2 className="animate-spin" size={18} />
                Processing...
              </>
            ) : (
              `Pay ₹${total.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}