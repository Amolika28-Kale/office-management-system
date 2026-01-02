import { LucideEdit3, LucideTrash2, LucideMapPin } from "lucide-react";

export default function BookingTable({ bookings, onEdit, onDelete }) {
  if (!bookings.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-gray-400 font-medium">No bookings match your criteria.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400 font-semibold">
            <th className="px-6 py-4">Space Details</th>
            <th className="px-6 py-4 hidden md:table-cell">Duration</th>
            <th className="px-6 py-4 hidden lg:table-cell">Plan & Amount</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-50">
          {bookings.map((b) => (
            <tr key={b._id} className="group hover:bg-gray-50/50 transition-colors">
              {/* SPACE INFO */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <LucideMapPin size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">{b.spaceId?.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{b.spaceId?.type}</p>
                  </div>
                </div>
              </td>

              {/* DATES */}
              <td className="px-6 py-4 hidden md:table-cell">
                <div className="text-sm text-gray-700 font-medium">
                  {new Date(b.fromDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                  <span className="mx-2 text-gray-300">→</span>
                  {new Date(b.toDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                </div>
                <p className="text-[10px] text-gray-400 uppercase mt-0.5">Reservation Period</p>
              </td>

              {/* PLAN & AMOUNT */}
              <td className="px-6 py-4 hidden lg:table-cell">
                <p className="text-sm font-semibold text-gray-800">₹{b.totalAmount}</p>
                <p className="text-xs text-gray-500">{b.planType}</p>
              </td>

              {/* STATUS & PAYMENT */}
              <td className="px-6 py-4">
                <div className="flex flex-col gap-1.5">
                  <StatusBadge status={b.status} />
                  <PaymentBadge status={b.paymentStatus} />
                </div>
              </td>

              {/* ACTIONS */}
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEdit(b)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit Booking"
                  >
                    <LucideEdit3 size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(b._id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Cancel Booking"
                  >
                    <LucideTrash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ================= SUB-COMPONENTS ================= */

const StatusBadge = ({ status }) => {
  const styles = {
    completed: "bg-emerald-50 text-emerald-700 border-emerald-100",
    confirmed: "bg-blue-50 text-blue-700 border-blue-100",
    pending: "bg-amber-50 text-amber-700 border-amber-100",
    cancelled: "bg-red-50 text-red-700 border-red-100",
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border tracking-tight ${styles[status] || styles.pending}`}>
      {status}
    </span>
  );
};

const PaymentBadge = ({ status }) => {
    const isPaid = status === "paid";
    return (
        <div className="flex items-center gap-1.5">
            <div className={`h-1.5 w-1.5 rounded-full ${isPaid ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-[11px] font-medium text-gray-500 capitalize">{status}</span>
        </div>
    );
};