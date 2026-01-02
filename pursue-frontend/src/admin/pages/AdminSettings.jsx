import { useEffect, useState } from "react";
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

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setProfile((await getAdminProfile()).data);
    setSettings((await getAdminSettings()).data);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">

      <h1 className="text-3xl font-black">Admin Settings</h1>

      {/* PROFILE */}
      <Section title="Admin Profile">
        <Input label="Name" value={profile.name}
          onChange={v => setProfile({ ...profile, name: v })} />
        <Input label="Email" value={profile.email}
          onChange={v => setProfile({ ...profile, email: v })} />
        <button onClick={() => updateAdminProfile(profile)}
          className="btn-primary">Save Profile</button>
      </Section>

      {/* PASSWORD */}
      <Section title="Change Password">
        <Input label="Current Password" type="password"
          onChange={v => setPasswords({ ...passwords, currentPassword: v })} />
        <Input label="New Password" type="password"
          onChange={v => setPasswords({ ...passwords, newPassword: v })} />
        <button onClick={() => changeAdminPassword(passwords)}
          className="btn-danger">Update Password</button>
      </Section>

      {/* COMPANY SETTINGS */}
      <Section title="Company & Invoice Settings">
        <Input label="Company Name" value={settings.companyName}
          onChange={v => setSettings({ ...settings, companyName: v })} />
        <Input label="GST %" value={settings.gstPercentage}
          onChange={v => setSettings({ ...settings, gstPercentage: v })} />
        <Input label="Invoice Prefix" value={settings.invoicePrefix}
          onChange={v => setSettings({ ...settings, invoicePrefix: v })} />
        <button onClick={() => updateAdminSettings(settings)}
          className="btn-primary">Save Settings</button>
      </Section>

    </div>
  );
}

/* REUSABLE */
const Section = ({ title, children }) => (
  <div className="bg-white p-6 rounded-2xl shadow space-y-4">
    <h2 className="font-bold text-lg">{title}</h2>
    {children}
  </div>
);

const Input = ({ label, value, onChange, type = "text" }) => (
  <div>
    <label className="text-sm font-bold">{label}</label>
    <input
      type={type}
      value={value || ""}
      onChange={e => onChange(e.target.value)}
      className="w-full border rounded-lg p-2 mt-1"
    />
  </div>
);
