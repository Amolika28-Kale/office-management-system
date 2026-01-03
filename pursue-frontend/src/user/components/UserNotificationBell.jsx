import { Bell } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { fetchNotifications,markRead } from "../../services/notificationService";
import { useNavigate } from "react-router-dom";

export default function UserNotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const ref = useRef(null);
  const navigate = useNavigate();

  const load = async () => {
    const data = await fetchNotifications();
    setItems(data);
  };

  useEffect(() => {
    load();
    const timer = setInterval(load, 15000);
    return () => clearInterval(timer);
  }, []);

  /* CLOSE ON OUTSIDE CLICK */
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const unread = items.filter(i => !i.isRead).length;

  const handleClick = async (n) => {
    if (!n.isRead) await markRead(n._id);
    setOpen(false);

    if (n.meta?.bookingId) {
      navigate(`/user/bookings`);
    }
    if (n.meta?.invoiceId) {
      navigate(`/user/invoices`);
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl relative"
      >
        <Bell size={20} />
        {unread > 0 && (
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-indigo-600 rounded-full border-2 border-white shadow-sm" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl border shadow-xl z-50 overflow-hidden">
          <div className="px-4 py-3 font-bold text-sm border-b">
            Notifications
          </div>

          {items.length ? (
            items.slice(0, 8).map(n => (
              <button
                key={n._id}
                onClick={() => handleClick(n)}
                className={`w-full px-4 py-3 text-left border-b hover:bg-slate-50
                  ${!n.isRead ? "bg-indigo-50" : ""}`}
              >
                <p className="text-sm font-semibold">{n.title}</p>
                <p className="text-xs text-slate-500 mt-1">{n.message}</p>
                <p className="text-[10px] text-slate-400 mt-1">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </button>
            ))
          ) : (
            <p className="px-4 py-6 text-center text-sm text-slate-400">
              No notifications
            </p>
          )}
        </div>
      )}
    </div>
  );
}
