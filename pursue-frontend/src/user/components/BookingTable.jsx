export default function BookingTable({ bookings, onEdit, onDelete }) {
  if (!bookings.length) {
    return (
      <p className="text-center text-gray-500 mt-10">
        No bookings found
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border rounded-lg">
        <thead className="bg-gray-100 text-sm">
          <tr>
            <th className="p-3 text-left">Space</th>
            <th className="p-3 text-left">Type</th>
            <th className="p-3 text-left">From</th>
            <th className="p-3 text-left">To</th>
            <th className="p-3 text-left">Plan</th>
            <th className="p-3 text-left">Amount</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Payment</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {bookings.map((b) => (
            <tr key={b._id} className="border-t text-sm">
              <td className="p-3">{b.spaceId?.name}</td>
              <td className="p-3 capitalize">{b.spaceId?.type}</td>
              <td className="p-3">
                {new Date(b.fromDate).toLocaleDateString()}
              </td>
              <td className="p-3">
                {new Date(b.toDate).toLocaleDateString()}
              </td>
              <td className="p-3">{b.planType}</td>
              <td className="p-3">₹{b.totalAmount}</td>

              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    b.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {b.status}
                </span>
              </td>

              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    b.paymentStatus === "paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {b.paymentStatus}
                </span>
              </td>

              <td className="p-3 flex gap-2">
                <button
                  onClick={() => onEdit(b)}
                  className="text-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(b._id)}
                  className="text-red-600"
                >
                  Cancel
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
