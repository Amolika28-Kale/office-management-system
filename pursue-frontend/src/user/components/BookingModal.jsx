import { useEffect, useState } from "react";
import {
  LucideX,
  LucideArmchair,
  LucideLayout,
  LucideUsers,
  LucideLoader2,
} from "lucide-react";
import { createBooking, updateBooking } from "../services/bookingService";
import { fetchSpaces } from "../../user/services/spaceService";

export default function BookingModal({
  booking,
  onClose,
  onSuccess,
  defaultType,
}) {
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

  const isConference = form.spaceType === "Conference";

  /* ---------------- LOAD SPACES ---------------- */
  useEffect(() => {
    loadSpaces(form.spaceType);
  }, [form.spaceType]);

  const loadSpaces = async (type) => {
    try {
      const res = await fetchSpaces({ type: type.toLowerCase() });
      setSpaces(res.data || []);
    } catch (err) {
      console.error("Failed to load spaces", err);
      setSpaces([]);
    }
  };

  /* ---------------- CONFERENCE AUTO RULES ---------------- */
  useEffect(() => {
    if (isConference && form.fromDate) {
      setForm((prev) => ({
        ...prev,
        planType: "Daily",
        toDate: prev.fromDate,
      }));
    }
  }, [form.fromDate, isConference]);

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async () => {
    if (!form.spaceId || !form.fromDate) {
      alert("Please fill required fields");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      spaceId: form.spaceId,

      fromDate: isConference
        ? new Date(`${form.fromDate}T13:00:00`).toISOString()
        : new Date(form.fromDate).toISOString(),

      toDate: isConference
        ? new Date(`${form.fromDate}T14:00:00`).toISOString()
        : new Date(form.toDate).toISOString(),

      planType: isConference ? "Daily" : form.planType,
      notes: form.notes,
    };

    try {
      booking
        ? await updateBooking(booking._id, payload)
        : await createBooking(payload);

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Booking failed", err);
      alert(err.response?.data?.message || "Booking failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
        
        {/* HEADER */}
        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
          <h3 className="text-xl font-bold">
            {booking ? "Edit Booking" : "Book a Space"}
          </h3>
          <button onClick={onClose}>
            <LucideX />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-5">

          {/* SPACE TYPE */}
          <div>
            <label className="text-xs font-bold uppercase text-gray-500 mb-2 block">
              Select Space Type
            </label>
            <div className="grid grid-cols-3 gap-3">
              <TypeCard
                label="Cabin"
                icon={<LucideLayout />}
                active={form.spaceType === "Cabin"}
                onClick={() =>
                  setForm({
                    ...form,
                    spaceType: "Cabin",
                    spaceId: "",
                  })
                }
              />
              <TypeCard
                label="Desk"
                icon={<LucideArmchair />}
                active={form.spaceType === "Desk"}
                onClick={() =>
                  setForm({
                    ...form,
                    spaceType: "Desk",
                    spaceId: "",
                  })
                }
              />
              <TypeCard
                label="Conference"
                icon={<LucideUsers />}
                active={form.spaceType === "Conference"}
                onClick={() =>
                  setForm({
                    ...form,
                    spaceType: "Conference",
                    spaceId: "",
                    planType: "Daily",
                    toDate: form.fromDate,
                  })
                }
              />
            </div>
          </div>

          {/* SPACE */}
          <div>
            <label className="text-sm font-semibold">Space</label>
            <select
              className="w-full mt-1 p-3 border rounded-xl"
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
          </div>

          {/* DATES */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold">Date</label>
              <input
                type="date"
                className="w-full mt-1 p-3 border rounded-xl"
                value={form.fromDate}
                onChange={(e) =>
                  setForm({ ...form, fromDate: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-semibold">To</label>
              <input
                type="date"
                disabled={isConference}
                className="w-full mt-1 p-3 border rounded-xl disabled:bg-gray-100"
                value={form.toDate}
                onChange={(e) =>
                  setForm({ ...form, toDate: e.target.value })
                }
              />
            </div>
          </div>

          {/* PLAN */}
          <div>
            <label className="text-sm font-semibold">Plan</label>
            <div className="flex gap-2 mt-2">
              {["Daily", "Weekly", "Monthly"].map((plan) => {
                const disabled = isConference && plan !== "Daily";
                return (
                  <button
                    key={plan}
                    disabled={disabled}
                    onClick={() =>
                      setForm({ ...form, planType: plan })
                    }
                    className={`flex-1 py-2 rounded-lg border font-medium ${
                      form.planType === plan
                        ? "bg-blue-600 text-white"
                        : "bg-white"
                    } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
                  >
                    {plan}
                  </button>
                );
              })}
            </div>

            {isConference && (
              <p className="text-xs text-orange-600 mt-2 font-medium">
                ⏰ Conference booking is allowed only from 1:00 PM to 2:00 PM
              </p>
            )}
          </div>

          {/* NOTES */}
          <div>
            <label className="text-sm font-semibold">Notes</label>
            <textarea
              className="w-full mt-1 p-3 border rounded-xl"
              rows={2}
              value={form.notes}
              onChange={(e) =>
                setForm({ ...form, notes: e.target.value })
              }
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="font-semibold text-gray-500">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2"
          >
            {isSubmitting && <LucideLoader2 className="animate-spin" />}
            {booking ? "Update" : "Confirm Booking"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- TYPE CARD ---------------- */
const TypeCard = ({ label, icon, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition ${
      active
        ? "border-blue-600 bg-blue-50 text-blue-600"
        : "border-gray-200 text-gray-400"
    }`}
  >
    {icon}
    <span className="text-xs font-bold uppercase">{label}</span>
  </button>
);
