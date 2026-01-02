import { useEffect, useState } from "react";
import { 
  LucideUser, LucideLayout, LucideArmchair, LucideUsers, 
  LucideCalendar, LucideCreditCard, LucideFileText, LucideArrowLeft 
} from "lucide-react";
import { createBooking } from "../../services/bookingService";
import { fetchUsers } from "../../services/userService";
import { fetchSpaces } from "../../services/spaceService";
import { useNavigate } from "react-router-dom";

const SPACE_TABS = [
  { label: "Cabins", value: "cabin", icon: <LucideLayout size={18} /> },
  { label: "Desks", value: "desk", icon: <LucideArmchair size={18} /> },
  { label: "Conference", value: "conference", icon: <LucideUsers size={18} /> },
  { label: "Utility", value: "utility", icon: <LucideFileText size={18} /> },
];

export default function CreateBooking() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [spaces, setSpaces] = useState([]);
  const [activeType, setActiveType] = useState("cabin");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers().then((res) => setUsers(res.data));
    fetchSpaces({ status: "active", limit: 200 }).then(
      (res) => setSpaces(res.data.data)
    );
  }, []);

  const [form, setForm] = useState({
    userId: "", userName: "", userEmail: "", space: "",
    startDate: "", endDate: "", totalAmount: "", notes: "",
  });

  const filteredSpaces = spaces.filter((s) => s.type === activeType && s.isActive);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleUserSelect = (e) => {
    const user = users.find((u) => u._id === e.target.value);
    if (user) {
      setForm({ ...form, userId: user._id, userName: user.name, userEmail: user.email });
    }
  };

  const handleTabChange = (type) => {
    setActiveType(type);
    setForm({ ...form, space: "" });
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createBooking(form);
      navigate("/admin/bookings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 animate-in fade-in duration-500">
      {/* HEADER */}
      <button 
        onClick={() => navigate("/admin/bookings")}
        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-sm mb-6 transition-colors"
      >
        <LucideArrowLeft size={16} /> Back to Bookings
      </button>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="p-6 md:p-10 border-b border-slate-50 bg-slate-50/30">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Create New Booking</h2>
          <p className="text-slate-500 font-medium">Configure reservation details for a workspace member.</p>
        </div>

        <form onSubmit={submit} className="p-6 md:p-10 space-y-8">
          
          {/* STEP 1: SELECT CATEGORY */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-indigo-500 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[10px]">1</span>
              Space Category
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {SPACE_TABS.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => handleTabChange(t.value)}
                  className={`flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                    activeType === t.value
                      ? "border-indigo-600 bg-indigo-50 text-indigo-600 shadow-inner"
                      : "border-slate-50 bg-white text-slate-400 hover:border-slate-200"
                  }`}
                >
                  {t.icon}
                  <span className="text-xs font-bold uppercase">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            
            {/* LEFT COLUMN: IDENTITIES */}
            <div className="space-y-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Customer & Resource</h3>
              
              <FormGroup label="Select Member" icon={<LucideUser size={18} />}>
                <select className="input-field" onChange={handleUserSelect} required>
                  <option value="">Choose a member...</option>
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                  ))}
                </select>
              </FormGroup>

              <FormGroup label={`Select ${activeType}`} icon={<LucideLayout size={18} />}>
                <select className="input-field" name="space" value={form.space} onChange={handleChange} required>
                  <option value="">Choose workspace...</option>
                  {filteredSpaces.map((s) => (
                    <option key={s._id} value={s._id}>{s.name} – ₹{s.price}</option>
                  ))}
                </select>
              </FormGroup>
            </div>

            {/* RIGHT COLUMN: DATES & FINANCE */}
            <div className="space-y-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Duration & Pricing</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <FormGroup label="Start Date" icon={<LucideCalendar size={18} />}>
                  <input type="date" name="startDate" className="input-field" onChange={handleChange} required />
                </FormGroup>
                <FormGroup label="End Date" icon={<LucideCalendar size={18} />}>
                  <input type="date" name="endDate" className="input-field" onChange={handleChange} required />
                </FormGroup>
              </div>

              <FormGroup label="Final Amount (INR)" icon={<LucideCreditCard size={18} />}>
                <input 
                  name="totalAmount" 
                  type="number" 
                  placeholder="0.00" 
                  className="input-field font-black text-lg" 
                  onChange={handleChange} 
                  required 
                />
              </FormGroup>
            </div>

            {/* FULL WIDTH: NOTES */}
            <div className="md:col-span-2 space-y-2">
              <FormGroup label="Administrative Notes" icon={<LucideFileText size={18} />}>
                <textarea 
                  name="notes" 
                  placeholder="Mention any specific requests or customizations..." 
                  rows={3} 
                  className="input-field resize-none" 
                  onChange={handleChange} 
                />
              </FormGroup>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-8 border-t border-slate-50">
            <button
              type="button"
              onClick={() => navigate("/admin/bookings")}
              className="px-8 py-3.5 text-slate-500 font-bold hover:text-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button 
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-3.5 rounded-2xl font-bold shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "Creating..." : "Confirm & Create Booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* HELPER COMPONENTS */
const FormGroup = ({ label, icon, children }) => (
  <div className="space-y-2 group">
    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 group-focus-within:text-indigo-600 transition-colors">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none">
        {icon}
      </div>
      {children}
    </div>
  </div>
);