import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarCheck,
  CreditCard,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { logout } from "../../services/authService";

export default function UserLayout() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menu = [
    { name: "Dashboard", path: "/user", icon: LayoutDashboard },
    { name: "My Bookings", path: "/user/bookings", icon: CalendarCheck },
    { name: "Payments", path: "/user/payments", icon: CreditCard },
    { name: "Invoices", path: "/user/invoices", icon: FileText },
    { name: "Settings", path: "/user/settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* MOBILE OVERLAY */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed lg:static z-50 lg:z-auto
        w-64 bg-white border-r px-6 py-6 flex flex-col
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* LOGO */}
        <div className="flex items-center gap-3 mb-10">
          <div className="h-11 w-11 flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow">
            P
          </div>
          <div>
            <p className="font-semibold text-gray-800">Pursue</p>
            <p className="text-xs text-gray-500">User Portal</p>
          </div>
        </div>

        {/* MENU */}
        <nav className="space-y-1 flex-1">
          {menu.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                end
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                  ${
                    isActive
                      ? "bg-blue-600 text-white shadow"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                <Icon size={18} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="mt-6 flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">
        {/* TOP BAR */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-3">
            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setOpen(true)}
              className="lg:hidden"
            >
              <Menu size={22} />
            </button>

            <div>
              <h1 className="text-lg font-semibold text-gray-800">
                Pursue Co-working Space
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">
                Office Management System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-600 hidden sm:block">
              Welcome, User
            </span>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
