import { useEffect, useState } from "react";
import { 
  LucideUser, LucideShieldCheck, LucideMail, LucidePhone, 
  LucideBuilding, LucideSave, LucideLock, LucideLoader2,
  LucideChevronRight, LucideCamera
} from "lucide-react";
import { getMyProfile, updateMyProfile, changePassword } from "../services/userService";

export default function UserSettings() {
  const [profile, setProfile] = useState(null);
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" });
  const [loading, setLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile"); // 'profile' or 'security'

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await getMyProfile();
      setProfile(res.data);
    } catch (err) {
      console.error("Failed to load profile", err);
    }
  };

  const handleProfileChange = (e) =>
    setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateMyProfile(profile);
      // Replace with a Toast notification in real apps
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPassLoading(true);
    try {
      await changePassword(passwords);
      setPasswords({ currentPassword: "", newPassword: "" });
    } finally {
      setPassLoading(false);
    }
  };

  if (!profile) return <SettingsSkeleton />;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Settings</h2>
        <p className="text-slate-500 font-medium">Manage your personal information and account security.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* SIDEBAR NAVIGATION */}
        <aside className="lg:w-72 flex flex-col gap-2">
          <NavButton 
            active={activeTab === 'profile'} 
            onClick={() => setActiveTab('profile')}
            icon={<LucideUser size={18} />}
            label="Personal Information"
            description="Name, contact and work details"
          />
          <NavButton 
            active={activeTab === 'security'} 
            onClick={() => setActiveTab('security')}
            icon={<LucideShieldCheck size={18} />}
            label="Security"
            description="Password and authentication"
          />
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1">
          {activeTab === 'profile' ? (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              
              {/* AVATAR UPLOAD SECTION */}
              <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm flex flex-col md:flex-row items-center gap-8">
                <div className="relative group">
                  <div className="h-28 w-28 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-indigo-200">
                    {profile.name?.charAt(0)}
                  </div>
                  <button className="absolute -bottom-2 -right-2 p-2 bg-white rounded-xl shadow-lg border border-slate-100 text-slate-600 hover:text-indigo-600 transition-colors">
                    <LucideCamera size={18} />
                  </button>
                </div>
                <div className="text-center md:text-left">
                  <h4 className="text-xl font-bold text-slate-800">Your Photo</h4>
                  <p className="text-slate-500 text-sm mt-1">This will be displayed on your profile and bookings.</p>
                  <div className="mt-4 flex gap-3">
                    <button className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-all">Upload New</button>
                    <button className="px-4 py-2 bg-slate-50 text-slate-500 text-xs font-bold rounded-lg hover:bg-slate-100 transition-all">Remove</button>
                  </div>
                </div>
              </div>

              {/* FORM */}
              <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <InputGroup icon={<LucideUser size={18}/>} label="Full Name" name="name" value={profile.name} onChange={handleProfileChange} />
                    <InputGroup icon={<LucideMail size={18}/>} label="Email Address" name="email" value={profile.email} disabled />
                    <InputGroup icon={<LucidePhone size={18}/>} label="Phone Number" name="phone" value={profile.phone || ""} onChange={handleProfileChange} placeholder="+91 00000 00000" />
                    <InputGroup icon={<LucideBuilding size={18}/>} label="Company Name" name="company" value={profile.company || ""} onChange={handleProfileChange} placeholder="Enter company" />
                  </div>
                  
                  <div className="flex justify-end pt-6 border-t border-slate-50">
                    <button 
                      onClick={handleProfileSubmit}
                      disabled={loading}
                      className="w-full md:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-2xl font-black transition-all shadow-xl shadow-indigo-100 active:scale-95 disabled:opacity-50"
                    >
                      {loading ? <LucideLoader2 className="animate-spin" size={20} /> : <LucideSave size={20} />}
                      Save Profile Changes
                    </button>
                  </div>
                </div>
              </section>
            </div>
          ) : (
            <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden animate-in slide-in-from-right-4 duration-300">
              <div className="p-8 space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Change Password</h3>
                  <p className="text-slate-500 text-sm mt-1">Update your password to keep your account secure.</p>
                </div>

                <div className="max-w-md space-y-6">
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
                
                <div className="flex justify-end pt-6 border-t border-slate-50">
                  <button 
                    onClick={handlePasswordSubmit}
                    disabled={passLoading}
                    className="w-full md:w-auto flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white px-10 py-4 rounded-2xl font-black transition-all shadow-xl shadow-slate-200 active:scale-95 disabled:opacity-50"
                  >
                    {passLoading ? <LucideLoader2 className="animate-spin" size={20} /> : <LucideShieldCheck size={20} />}
                    Update Security
                  </button>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

/* SUB-COMPONENTS */

const NavButton = ({ active, onClick, icon, label, description }) => (
  <button 
    onClick={onClick}
    className={`flex items-center justify-between p-4 rounded-2xl transition-all text-left border ${
      active 
      ? 'bg-white border-slate-200 shadow-xl shadow-slate-200/50 text-indigo-600' 
      : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-700'
    }`}
  >
    <div className="flex items-center gap-4">
      <div className={`p-2 rounded-xl ${active ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-bold">{label}</p>
        <p className={`text-[11px] font-medium mt-0.5 ${active ? 'text-indigo-400' : 'text-slate-400'}`}>{description}</p>
      </div>
    </div>
    {active && <LucideChevronRight size={16} />}
  </button>
);

const InputGroup = ({ label, icon, type = "text", name, value, onChange, disabled, placeholder }) => (
  <div className="space-y-2">
    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">{label}</label>
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
        className={`w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none transition-all font-bold text-slate-700
          ${disabled ? 'opacity-60 cursor-not-allowed bg-slate-100 text-slate-400' : 'focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white'}
        `}
      />
    </div>
  </div>
);

const SettingsSkeleton = () => (
  <div className="max-w-6xl mx-auto p-8 space-y-8 animate-pulse">
    <div className="h-10 w-48 bg-slate-200 rounded-lg" />
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="lg:w-72 space-y-4">
        <div className="h-16 bg-slate-100 rounded-2xl" />
        <div className="h-16 bg-slate-100 rounded-2xl" />
      </div>
      <div className="flex-1 space-y-6">
        <div className="h-32 bg-slate-100 rounded-[2rem]" />
        <div className="h-96 bg-slate-100 rounded-[2rem]" />
      </div>
    </div>
  </div>
);