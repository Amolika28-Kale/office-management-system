import { useState } from "react";
import { createSpace } from "../../services/spaceService";
import { useNavigate } from "react-router-dom";

export default function AddSpace() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    type: "desk",
    capacity: "",
    price: "",
    description: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createSpace(form);
    navigate("/admin/spaces");
  };

  return (
    <div className="max-w-3xl bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-6">Add Space</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <input className="input" name="name" placeholder="Name" onChange={handleChange} />

        <select className="input" name="type" onChange={handleChange}>
          <option value="desk">Desk</option>
          <option value="cabin">Cabin</option>
          <option value="conference">Conference</option>
          <option value="utility">Utility</option>
        </select>

        <input className="input" name="capacity" placeholder="Capacity" onChange={handleChange} />
        <input className="input" name="price" placeholder="Price" onChange={handleChange} />

        <textarea
          className="input col-span-2"
          name="description"
          placeholder="Description"
          onChange={handleChange}
        />

        <div className="col-span-2 flex justify-end gap-3">
          <button type="button" onClick={() => navigate("/admin/spaces")} className="border px-4 py-2 rounded">
            Cancel
          </button>
          <button className="bg-blue-600 text-white px-6 py-2 rounded">
            Save Space
          </button>
        </div>
      </form>
    </div>
  );
}
