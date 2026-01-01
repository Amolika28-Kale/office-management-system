import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../../services/userService";

export default function AddUser() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    userType: "Member",
    plan: "Standard",
    status: "Active",
    company: "",
    notes: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createUser(form);
    navigate("/admin/users");
  };

  return (
    <div className="max-w-3xl bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-6">Add New User</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <Input label="Full Name" name="name" value={form.name} onChange={handleChange} />
        <Input label="Email" name="email" value={form.email} onChange={handleChange} />
        <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} />

        <Select label="User Type" name="userType" value={form.userType} onChange={handleChange}
          options={["Member", "Guest"]} />

        <Select label="Plan" name="plan" value={form.plan} onChange={handleChange}
          options={["Standard", "Premium"]} />

        <Select label="Status" name="status" value={form.status} onChange={handleChange}
          options={["Active", "Inactive"]} />

        <Input
          label="Company (Optional)"
          name="company"
          value={form.company}
          onChange={handleChange}
          full
        />

        <textarea
          name="notes"
          placeholder="Notes"
          value={form.notes}
          onChange={handleChange}
          className="col-span-2 border rounded p-3"
        />

        <div className="col-span-2 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/admin/users")}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button className="px-6 py-2 bg-blue-600 text-white rounded">
            Add User
          </button>
        </div>
      </form>
    </div>
  );
}

/* Reusable components */
const Input = ({ label, full, ...props }) => (
  <div className={full ? "col-span-2" : ""}>
    <label className="text-sm text-gray-600">{label}</label>
    <input {...props} className="w-full border rounded p-2" />
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div>
    <label className="text-sm text-gray-600">{label}</label>
    <select {...props} className="w-full border rounded p-2">
      {options.map(o => (
        <option key={o}>{o}</option>
      ))}
    </select>
  </div>
);
