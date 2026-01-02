import { useEffect, useState } from "react";
import { 
  LucideUser, 
  LucideShieldCheck, 
  LucideMail, 
  LucidePhone, 
  LucideBuilding, 
  LucideSave,
  LucideLock,
  LucideLoader2
} from "lucide-react";
import { getMyProfile, updateMyProfile, changePassword } from "../services/userService";

export default function UserSettings() {
  const [profile, setProfile] = useState(null);
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" });
  const [loading, setLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const res = await getMyProfile();
    setProfile(res.data);
  };

  const handleProfileChange = (e) =>
    setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateMyProfile(profile);
      alert("Profile updated successfully!");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPassLoading(true);
    try {
      await changePassword(passwords);
      alert("Password updated successfully!");
      setPasswords({ currentPassword: "", newPassword: "" });
    } finally {
      setPassLoading(false);
    }
  };

  if (!profile) return <div className="p-10 text-center animate-pulse text-gray-400">Loading settings...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Account Settings</h2>
          <p className="text-slate-500 font-medium">Manage your profile, company details, and security.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COL: PROFILE PREVIEW */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 text-center shadow-sm">
            <div className="relative inline-block">
              <div className="h-24 w-24 bg-indigo-100 rounded-full mx-auto flex items-center justify-center text-indigo-600 text-3xl font-bold border-4 border-white shadow-md">
                {profile.name?.charAt(0)}
              </div>
              <div className="absolute bottom-0 right-0 h-6 w-6 bg-emerald-500 border-4 border-white rounded-full"></div>
            </div>
            <h3 className="mt-4 font-bold text-slate-800 text-lg">{profile.name}</h3>
            <p className="text-sm text-slate-500">{profile.email}</p>
            <div className="mt-6 pt-6 border-t border-slate-50 flex flex-col gap-2">
               <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">Member Status</span>
               <span className="inline-flex items-center justify-center px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold">Premium User</span>
            </div>
          </div>
        </div>

        {/* RIGHT COL: FORMS */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* PROFILE INFO FORM */}
          <section className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex items-center gap-3">
              <LucideUser className="text-indigo-600" size={20} />
              <h3 className="font-bold text-slate-800">Profile Information</h3>
            </div>
            
            <form onSubmit={handleProfileSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup icon={<LucideUser size={18}/>} label="Full Name" name="name" value={profile.name} onChange={handleProfileChange} />
                <InputGroup icon={<LucideMail size={18}/>} label="Email Address" name="email" value={profile.email} disabled />
                <InputGroup icon={<LucidePhone size={18}/>} label="Phone Number" name="phone" value={profile.phone || ""} onChange={handleProfileChange} placeholder="+91 00000 00000" />
                <InputGroup icon={<LucideBuilding size={18}/>} label="Company Name" name="company" value={profile.company || ""} onChange={handleProfileChange} placeholder="Enter company" />
              </div>
              
              <div className="flex justify-end pt-4 border-t border-slate-50">
                <button 
                  disabled={loading}
                  className="w-full md:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-100 active:scale-95 disabled:opacity-50"
                >
                  {loading ? <LucideLoader2 className="animate-spin" size={20} /> : <LucideSave size={20} />}
                  Save Changes
                </button>
              </div>
            </form>
          </section>

          {/* SECURITY FORM */}
          <section className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex items-center gap-3">
              <LucideShieldCheck className="text-rose-500" size={20} />
              <h3 className="font-bold text-slate-800">Security & Password</h3>
            </div>
            
            <form onSubmit={handlePasswordSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup 
                  type="password" 
                  icon={<LucideLock size={18}/>} 
                  label="Current Password" 
                  value={passwords.currentPassword} 
                  onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})} 
                />
                <InputGroup 
                  type="password" 
                  icon={<LucideLock size={18}/>} 
                  label="New Password" 
                  value={passwords.newPassword} 
                  onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})} 
                />
              </div>
              
              <div className="flex justify-end pt-4 border-t border-slate-50">
                <button 
                  disabled={passLoading}
                  className="w-full md:w-auto flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-slate-200 active:scale-95 disabled:opacity-50"
                >
                  {passLoading ? <LucideLoader2 className="animate-spin" size={20} /> : <LucideShieldCheck size={20} />}
                  Update Password
                </button>
              </div>
            </form>
          </section>

        </div>
      </div>
    </div>
  );
}

/* HELPER COMPONENT FOR INPUTS */
const InputGroup = ({ label, icon, type = "text", name, value, onChange, disabled, placeholder }) => (
  <div className="space-y-1.5">
    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">{label}</label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
        {icon}
      </div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className={`w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none transition-all font-medium text-slate-700
          ${disabled ? 'opacity-60 cursor-not-allowed bg-slate-100' : 'focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white'}
        `}
      />
    </div>
  </div>
);