import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUserById, updateUser } from "../../services/userService";

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);

  useEffect(() => {
    getUserById(id).then(res => setForm(res.data));
  }, [id]);

  if (!form) return null;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateUser(id, form);
    navigate("/admin/users");
  };

  return (
    <div className="max-w-3xl bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-6">Update User</h2>

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

        <div className="col-span-2 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/admin/users")}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button className="px-6 py-2 bg-blue-600 text-white rounded">
            Update User
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