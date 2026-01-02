import { useEffect, useState } from "react";
import {
  getMyProfile,
  updateMyProfile,
  changePassword,
} from "../services/userService";

export default function UserSettings() {
  const [profile, setProfile] = useState(null);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });

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
    await updateMyProfile(profile);
    alert("Profile updated successfully");
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    await changePassword(passwords);
    alert("Password changed successfully");
    setPasswords({ currentPassword: "", newPassword: "" });
  };

  if (!profile) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">

      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold">Account Settings</h2>
        <p className="text-gray-500">
          Manage your personal information & security
        </p>
      </div>

      {/* PROFILE */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="font-semibold text-lg mb-4">Profile Information</h3>

        <form
          onSubmit={handleProfileSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            className="input"
            name="name"
            value={profile.name}
            onChange={handleProfileChange}
            placeholder="Full Name"
          />

          <input
            className="input"
            name="email"
            value={profile.email}
            disabled
          />

          <input
            className="input"
            name="phone"
            value={profile.phone || ""}
            onChange={handleProfileChange}
            placeholder="Phone"
          />

          <input
            className="input"
            name="company"
            value={profile.company || ""}
            onChange={handleProfileChange}
            placeholder="Company"
          />

          <div className="md:col-span-2 flex justify-end">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg">
              Save Changes
            </button>
          </div>
        </form>
      </div>

      {/* PASSWORD */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="font-semibold text-lg mb-4">Change Password</h3>

        <form
          onSubmit={handlePasswordSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            type="password"
            placeholder="Current Password"
            className="input"
            value={passwords.currentPassword}
            onChange={(e) =>
              setPasswords({ ...passwords, currentPassword: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="New Password"
            className="input"
            value={passwords.newPassword}
            onChange={(e) =>
              setPasswords({ ...passwords, newPassword: e.target.value })
            }
          />

          <div className="md:col-span-2 flex justify-end">
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg">
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
