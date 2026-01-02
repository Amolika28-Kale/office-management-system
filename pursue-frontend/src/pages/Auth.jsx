import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LucideMail, 
  LucideLock, 
  LucideUser, 
  LucideBuilding2, 
  LucideArrowRight,
  LucideCheckCircle2,
  LucideLoader2 
} from "lucide-react";
import { login, register } from "../services/authService";

export default function Auth() {
  const [activeTab, setActiveTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      data.role === "admin" 
        ? navigate("/admin/dashboard", { replace: true }) 
        : navigate("/user", { replace: true });
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      alert("Registration successful. Please login.");
      setActiveTab("login");
      setForm({ name: "", email: "", password: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 overflow-hidden font-sans">
      {/* LEFT SIDE: BRANDING (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-violet-700 opacity-90" />
        {/* Abstract decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/20 rounded-full -ml-20 -mb-20 blur-3xl" />
        
        <div className="relative z-10 p-12 text-white max-w-lg">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
              <LucideBuilding2 size={32} />
            </div>
            <h1 className="text-3xl font-black tracking-tight uppercase">Pursue</h1>
          </div>
          <h2 className="text-5xl font-extrabold leading-tight mb-6 tracking-tighter">
            Elevate Your <br /> Workspace Experience.
          </h2>
          <div className="space-y-4">
            <FeatureItem text="Seamless Space Booking" />
            <FeatureItem text="Instant Invoice Generation" />
            <FeatureItem text="Secure Payment Processing" />
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          {/* Mobile Logo */}
          <div className="flex flex-col items-center mb-8 lg:hidden">
            <div className="bg-indigo-600 text-white p-4 rounded-3xl shadow-xl shadow-indigo-100 mb-4">
              <LucideBuilding2 size={32} />
            </div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Pursue Co-working Space</h2>
            <span className="text-slate-500 mt-2">Office Management System</span>
          </div>

          <div className="text-center mb-10 hidden lg:block">
            <h3 className="text-3xl font-black text-slate-800">Welcome Back</h3>
            <p className="text-slate-500 mt-2">Please enter your details to continue</p>
          </div>

          {/* Tab Switcher */}
          <div className="flex p-1 bg-slate-100 rounded-2xl mb-8 border border-slate-200">
            <TabButton 
              active={activeTab === "login"} 
              onClick={() => setActiveTab("login")} 
              label="Sign In" 
            />
            <TabButton 
              active={activeTab === "register"} 
              onClick={() => setActiveTab("register")} 
              label="Register" 
            />
          </div>

          {/* Form */}
          <form onSubmit={activeTab === "login" ? handleLogin : handleRegister} className="space-y-5">
            {activeTab === "register" && (
              <InputGroup 
                label="Full Name" 
                icon={<LucideUser size={18} />} 
                name="name" 
                value={form.name} 
                onChange={handleChange} 
                placeholder="John Doe"
              />
            )}
            
            <InputGroup 
              label="Email Address" 
              icon={<LucideMail size={18} />} 
              type="email" 
              name="email" 
              value={form.email} 
              onChange={handleChange} 
              placeholder="name@company.com"
            />

            <InputGroup 
              label="Password" 
              icon={<LucideLock size={18} />} 
              type="password" 
              name="password" 
              value={form.password} 
              onChange={handleChange} 
              placeholder="••••••••"
            />

            <button
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-100 active:scale-[0.98] flex items-center justify-center gap-3 disabled:bg-indigo-400 mt-8"
            >
              {loading ? (
                <LucideLoader2 className="animate-spin" size={20} />
              ) : (
                <>
                  {activeTab === "login" ? "Sign In" : "Create Account"}
                  <LucideArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-10">
            By continuing, you agree to our <span className="text-slate-600 font-bold hover:underline cursor-pointer">Terms of Service</span>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ================= HELPER COMPONENTS ================= */

const FeatureItem = ({ text }) => (
  <div className="flex items-center gap-3 text-white/80">
    <LucideCheckCircle2 size={20} className="text-emerald-400 shrink-0" />
    <span className="font-medium">{text}</span>
  </div>
);

const TabButton = ({ active, onClick, label }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-1/2 py-2.5 rounded-xl text-sm font-bold transition-all ${
      active ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
    }`}
  >
    {label}
  </button>
);

const InputGroup = ({ label, icon, type = "text", name, value, onChange, placeholder }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">{label}</label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
        {icon}
      </div>
      <input
        type={type}
        name={name}
        value={value}
        required
        placeholder={placeholder}
        onChange={onChange}
        className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300 font-medium"
      />
    </div>
  </div>
);