import { useEffect, useState } from "react";
import { getSpaceById, updateSpace } from "../../services/spaceService";
import { useNavigate, useParams } from "react-router-dom";

export default function EditSpace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);

  useEffect(() => {
    getSpaceById(id).then(res => setForm(res.data));
  }, [id]);

  if (!form) return null;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateSpace(id, form);
    navigate("/admin/spaces");
  };

  return (
    <div className="max-w-3xl bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-6">Edit Space</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <input className="input" name="name" value={form.name} onChange={handleChange} />
        <select className="input" name="type" value={form.type} onChange={handleChange}>
          <option value="desk">Desk</option>
          <option value="cabin">Cabin</option>
          <option value="conference">Conference</option>
          <option value="utility">Utility</option>
        </select>

        <input className="input" name="capacity" value={form.capacity || ""} onChange={handleChange} />
        <input className="input" name="price" value={form.price} onChange={handleChange} />

        <textarea className="input col-span-2" name="description" value={form.description || ""} onChange={handleChange} />

        <div className="col-span-2 flex justify-end gap-3">
          <button type="button" onClick={() => navigate("/admin/spaces")} className="border px-4 py-2 rounded">
            Cancel
          </button>
          <button className="bg-blue-600 text-white px-6 py-2 rounded">
            Update Space
          </button>
        </div>
      </form>
    </div>
  );
}
