import { useEffect, useState } from "react";
import { fetchLeads } from "../../services/leadService";
import AddLeadModal from "./AddLeadModal";

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [tab, setTab] = useState("new");
  const [open, setOpen] = useState(false);

  const loadLeads = async () => {
    const res = await fetchLeads({ status: tab });
    setLeads(res.data.data);
  };

  useEffect(() => {
    loadLeads();
  }, [tab]);

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">CRM & Lead Management</h1>
          <p className="text-gray-500">
            Track and manage leads, inquiries, and follow-ups
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Lead
        </button>
      </div>

      {/* TABS */}
      <div className="flex gap-6 border-b mb-4">
        {["new", "contacted", "interested", "converted"].map((s) => (
          <button
            key={s}
            onClick={() => setTab(s)}
            className={`pb-2 capitalize ${
              tab === s ? "border-b-2 border-blue-600 text-blue-600" : ""
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div className="bg-white rounded shadow">
        <table className="w-full">
          <thead className="border-b">
            <tr className="text-left">
              <th className="p-3">Name</th>
              <th>Contact</th>
              <th>Source</th>
              <th>Interest</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((l) => (
              <tr key={l._id} className="border-b">
                <td className="p-3">{l.name}</td>
                <td>
                  {l.email}
                  <br />
                  {l.phone}
                </td>
                <td>{l.source}</td>
                <td>{l.interestedIn}</td>
                <td>
                  <span className="px-2 py-1 rounded bg-blue-100 text-blue-700">
                    {l.status}
                  </span>
                </td>
                <td>
                  {new Date(l.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && <AddLeadModal onClose={() => setOpen(false)} onSuccess={loadLeads} />}
    </div>
  );
}
