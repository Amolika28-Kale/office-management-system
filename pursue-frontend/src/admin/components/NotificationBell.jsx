import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchNotifications, markRead } from "../services/notificationService";

export default function NotificationBell() {
  const [list, setList] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const data = await fetchNotifications();
    setList(data);
  };

  const unread = list.filter(n => !n.isRead).length;

  return (
    <div className="relative">
      <Bell />
      {unread > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
          {unread}
        </span>
      )}
    </div>
  );
}
