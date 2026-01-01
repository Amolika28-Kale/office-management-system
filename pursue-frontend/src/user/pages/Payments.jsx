import { useEffect, useState } from "react";
import {
  getUserPayments,
  getPaymentStats,
} from "../../user/services/paymentService";
import MakePaymentModal from "../components/MakePaymentModal";

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    pending: 0,
    completed: 0,
    failed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const paymentsRes = await getUserPayments();
      const statsRes = await getPaymentStats();

      setPayments(paymentsRes?.data?.data || []);
      setStats(statsRes?.data?.data || {});
    } catch (err) {
      console.error("Failed to load payments", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Payments</h2>
          <p className="text-gray-500 text-sm">
            Manage all payment transactions
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Make Payment
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Stat title="Total Revenue" value={`₹${stats.totalRevenue}`} />
        <Stat title="Pending" value={stats.pending} />
        <Stat title="Completed" value={stats.completed} />
        <Stat title="Failed" value={stats.failed} />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Booking</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Method</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-500">
                  Loading payments...
                </td>
              </tr>
            )}

            {!loading && payments.length === 0 && (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-500">
                  No payments found
                </td>
              </tr>
            )}

            {!loading &&
              payments.map((p) => (
                <tr key={p._id} className="border-t">
                  <td className="p-3">
                    <p className="font-medium">
                      {p.booking?.space?.name || "N/A"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {p.booking?.space?.type}
                    </p>
                  </td>

                  <td>₹{p.totalAmount}</td>
                  <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td>{p.method}</td>
                  <td>
                    <StatusBadge status={p.status} />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {open && (
        <MakePaymentModal
          close={() => {
            setOpen(false);
            loadData();
          }}
        />
      )}
    </div>
  );
}

/* -------------------- UI COMPONENTS -------------------- */

const Stat = ({ title, value }) => (
  <div className="bg-white p-4 rounded shadow">
    <p className="text-sm text-gray-500">{title}</p>
    <h3 className="text-xl font-bold mt-1">{value}</h3>
  </div>
);

const StatusBadge = ({ status }) => {
  const base = "px-2 py-1 rounded text-xs font-medium";

  if (status === "completed")
    return <span className={`${base} bg-green-100 text-green-700`}>Completed</span>;
  if (status === "pending")
    return <span className={`${base} bg-yellow-100 text-yellow-700`}>Pending</span>;
  if (status === "failed")
    return <span className={`${base} bg-red-100 text-red-700`}>Failed</span>;

  return <span className={`${base} bg-gray-200 text-gray-700`}>{status}</span>;
};
