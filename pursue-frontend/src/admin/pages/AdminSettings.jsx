import { useEffect, useState } from "react";
import { 
  LucideUser, LucideLock, LucideBuilding, 
  LucideSave, LucideShieldCheck, LucideInfo 
} from "lucide-react";
import {
  getAdminProfile,
  updateAdminProfile,
  getAdminSettings,
  updateAdminSettings,
  changeAdminPassword
} from "../../services/adminSettingsService";

export default function AdminSettings() {
  const [profile, setProfile] = useState({});
  const [settings, setSettings] = useState({});
  const [passwords, setPasswords] = useState({});
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const profileRes = await getAdminProfile();
      const settingsRes = await getAdminSettings();
      setProfile(profileRes.data || {});
      setSettings(settingsRes.data || {});
    } catch (err) {
      console.error("Error loading settings", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 animate-in fade-in duration-700">
      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Settings</h1>
        <p className="text-slate-500 mt-2 font-medium">Manage your account preferences and system configuration.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* SIDE NAVIGATION */}
        <aside className="lg:w-64 flex flex-col gap-2">
          <TabButton 
            active={activeTab === "profile"} 
            onClick={() => setActiveTab("profile")}
            icon={<LucideUser size={18} />} 
            label="Admin Profile" 
          />
          <TabButton 
            active={activeTab === "security"} 
            onClick={() => setActiveTab("security")}
            icon={<LucideLock size={18} />} 
            label="Security" 
          />
          <TabButton 
            active={activeTab === "company"} 
            onClick={() => setActiveTab("company")}
            icon={<LucideBuilding size={18} />} 
            label="Company & Invoice" 
          />
        </aside>

        {/* CONTENT AREA */}
        <main className="flex-1 bg-white rounded-[2rem] border border-slate-200/60 shadow-sm p-8">
          
          {activeTab === "profile" && (
            <section className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <SectionHeader title="Profile Information" description="Update your personal details and contact email." />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Full Name" value={profile.name} placeholder="John Doe"
                  onChange={v => setProfile({ ...profile, name: v })} />
                <Input label="Email Address" value={profile.email} placeholder="admin@company.com"
                  onChange={v => setProfile({ ...profile, email: v })} />
              </div>
              <SaveButton onClick={() => updateAdminProfile(profile)} />
            </section>
          )}

          {activeTab === "security" && (
            <section className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <SectionHeader title="Password & Security" description="Ensure your account is using a long, random password to stay secure." />
              <div className="max-w-md space-y-6">
                <Input label="Current Password" type="password"
                  onChange={v => setPasswords({ ...passwords, currentPassword: v })} />
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3">
                  <LucideInfo className="text-amber-600 shrink-0" size={20} />
                  <p className="text-xs text-amber-800 leading-relaxed">
                    Password must be at least 8 characters long and include a mix of letters, numbers, and symbols.
                  </p>
                </div>
                <Input label="New Password" type="password"
                  onChange={v => setPasswords({ ...passwords, newPassword: v })} />
              </div>
              <button 
                onClick={() => changeAdminPassword(passwords)}
                className="px-6 py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-600 hover:text-white transition-all active:scale-95"
              >
                Update Password
              </button>
            </section>
          )}

          {activeTab === "company" && (
            <section className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <SectionHeader title="Billing Configuration" description="These details will appear on all generated customer invoices." />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Legal Company Name" value={settings.companyName}
                  onChange={v => setSettings({ ...settings, companyName: v })} />
                <Input label="GST Percentage (%)" value={settings.gstPercentage} type="number"
                  onChange={v => setSettings({ ...settings, gstPercentage: v })} />
                <Input label="Invoice Prefix" value={settings.invoicePrefix} placeholder="INV-"
                  onChange={v => setSettings({ ...settings, invoicePrefix: v })} />
              </div>
              <SaveButton onClick={() => updateAdminSettings(settings)} />
            </section>
          )}

        </main>
      </div>
    </div>
  );
}

/* ------------------ REFINED SUB-COMPONENTS ------------------ */

const SectionHeader = ({ title, description }) => (
  <div className="mb-8 border-b border-slate-100 pb-6">
    <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
    <p className="text-slate-500 text-sm mt-1 font-medium">{description}</p>
  </div>
);

const TabButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all ${
      active 
      ? "bg-slate-900 text-white shadow-lg shadow-slate-200" 
      : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
    }`}
  >
    {icon}
    {label}
  </button>
);

const Input = ({ label, value, onChange, type = "text", placeholder }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-bold text-slate-700 ml-1">{label}</label>
    <input
      type={type}
      value={value || ""}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
    />
  </div>
);

const SaveButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-100 active:scale-95"
  >
    <LucideSave size={18} />
    Save Changes
  </button>
);