import { useState } from "react";
import { createLead } from "../../services/leadService";

export default function AddLeadModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    source: "website",
    interestedIn: "desk",
    status: "new",
    notes: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    await createLead(form);
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <form
        onSubmit={submit}
        className="bg-white w-[500px] p-6 rounded"
      >
        <h2 className="text-lg font-bold mb-4">Add New Lead</h2>

        <div className="grid grid-cols-2 gap-4">
          <input name="name" placeholder="Full Name" className="input" onChange={handleChange} />
          <input name="email" placeholder="Email" className="input" onChange={handleChange} />
          <input name="phone" placeholder="Phone" className="input" onChange={handleChange} />

          <select name="source" className="input" onChange={handleChange}>
            <option value="website">Website</option>
            <option value="walk-in">Walk-in</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="call">Call</option>
            <option value="referral">Referral</option>
          </select>

          <select name="interestedIn" className="input" onChange={handleChange}>
            <option value="desk">Desk</option>
            <option value="cabin">Cabin</option>
            <option value="conference">Conference</option>
            <option value="virtual">Virtual</option>
          </select>

          <select name="status" className="input" onChange={handleChange}>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="interested">Interested</option>
            <option value="converted">Converted</option>
          </select>
        </div>

        <textarea
          name="notes"
          placeholder="Notes"
          className="input mt-4"
          onChange={handleChange}
        />

        <div className="flex justify-end gap-3 mt-6">
          <button type="button" onClick={onClose} className="border px-4 py-2 rounded">
            Cancel
          </button>
          <button className="bg-blue-600 text-white px-6 py-2 rounded">
            Add Lead
          </button>
        </div>
      </form>
    </div>
  );
}
