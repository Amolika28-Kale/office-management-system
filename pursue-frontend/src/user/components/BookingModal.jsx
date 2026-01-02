import { useEffect, useState } from "react";
import { LucideX, LucideArmchair, LucideLayout, LucideUsers, LucideLoader2 } from "lucide-react";
import { createBooking, updateBooking } from "../services/bookingService";
import { fetchSpaces } from "../../user/services/spaceService";

export default function BookingModal({ booking, onClose, onSuccess, defaultType }) {
  const [spaces, setSpaces] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    spaceType: booking?.spaceId?.type || defaultType || "Cabin",
    spaceId: booking?.spaceId?._id || "",
    fromDate: booking?.fromDate?.slice(0, 10) || "",
    toDate: booking?.toDate?.slice(0, 10) || "",
    planType: booking?.planType || "Monthly",
    notes: booking?.notes || "",
  });

  useEffect(() => {
    loadSpaces(form.spaceType);
  }, [form.spaceType]);

  const loadSpaces = async (type) => {
    try {
      const res = await fetchSpaces({ type: type.toLowerCase() });
      setSpaces(res.data);
    } catch (err) {
      console.error("Failed to load spaces", err);
      setSpaces([]);
    }
  };

  const handleSubmit = async () => {
    if (!form.spaceId || !form.fromDate || !form.toDate) {
      alert("Please fill in the required fields.");
      return;
    }

    setIsSubmitting(true);
    const payload = {
      spaceId: form.spaceId,
      fromDate: new Date(form.fromDate).toISOString(),
      toDate: new Date(form.toDate).toISOString(),
      planType: form.planType,
      notes: form.notes,
    };

    try {
      booking
        ? await updateBooking(booking._id, payload)
        : await createBooking(payload);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Submission failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-xl font-bold text-gray-800">
            {booking ? "Edit Your Booking" : "Reserve a Space"}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
            <LucideX size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto custom-scrollbar">
          
          {/* SPACE TYPE SELECTOR */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 block">
              1. Select Category
            </label>
            <div className="grid grid-cols-3 gap-3">
              <TypeCard 
                label="Cabin" 
                icon={<LucideLayout size={18} />} 
                active={form.spaceType === "Cabin"} 
                onClick={() => setForm({ ...form, spaceType: "Cabin", spaceId: "" })} 
              />
              <TypeCard 
                label="Desk" 
                icon={<LucideArmchair size={18} />} 
                active={form.spaceType === "Desk"} 
                onClick={() => setForm({ ...form, spaceType: "Desk", spaceId: "" })} 
              />
              <TypeCard 
                label="Conference" 
                icon={<LucideUsers size={18} />} 
                active={form.spaceType === "Conference"} 
                onClick={() => setForm({ ...form, spaceType: "Conference", spaceId: "" })} 
              />
            </div>
          </div>

          {/* SPACE DROPDOWN */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Specific Space</label>
            <select
              className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all appearance-none"
              value={form.spaceId}
              onChange={(e) => setForm({ ...form, spaceId: e.target.value })}
            >
              <option value="">Choose a {form.spaceType}...</option>
              {spaces.map((s) => (
                <option key={s._id} value={s._id}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* DATES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">From Date</label>
              <input
                type="date"
                className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none"
                value={form.fromDate}
                onChange={(e) => setForm({ ...form, fromDate: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">To Date</label>
              <input
                type="date"
                className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none"
                value={form.toDate}
                onChange={(e) => setForm({ ...form, toDate: e.target.value })}
              />
            </div>
          </div>

          {/* PLAN TYPE */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Subscription Plan</label>
            <div className="flex gap-2">
              {["Daily", "Weekly", "Monthly"].map((plan) => (
                <button
                  key={plan}
                  type="button"
                  onClick={() => setForm({ ...form, planType: plan })}
                  className={`flex-1 py-2 text-sm rounded-lg font-medium border transition-all ${
                    form.planType === plan 
                    ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100" 
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {plan}
                </button>
              ))}
            </div>
          </div>

          {/* NOTES */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Notes (Optional)</label>
            <textarea
              className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none resize-none"
              placeholder="Any special requirements?"
              rows={2}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button 
            onClick={onClose} 
            className="px-5 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-100 transition-all active:scale-95 min-w-[140px]"
          >
            {isSubmitting ? (
              <LucideLoader2 className="animate-spin" size={18} />
            ) : (
              booking ? "Update" : "Confirm Booking"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* HELPER COMPONENT */
const TypeCard = ({ label, icon, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
      active 
      ? "border-blue-600 bg-blue-50 text-blue-600 shadow-inner" 
      : "border-gray-100 bg-white text-gray-400 hover:border-gray-200 hover:bg-gray-50"
    }`}
  >
    {icon}
    <span className="text-xs font-bold uppercase tracking-tighter">{label}</span>
  </button>
);