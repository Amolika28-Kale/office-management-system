import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  Boxes,
  CreditCard,
  FileText,
  Settings,
  LogOut,
  Building2,
  Menu,
  X,
} from "lucide-react";

export default function AdminLayout() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const menu = [
    { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/admin/spaces", icon: Building2, label: "Spaces" },
    { to: "/admin/bookings", icon: CalendarCheck, label: "All Bookings" },
    { to: "/admin/crm", icon: Users, label: "CRM & Leads" },
    { to: "/admin/users", icon: Users, label: "Users" },
    { to: "/admin/inventory", icon: Boxes, label: "Inventory" },
    { to: "/admin/payments", icon: CreditCard, label: "Payments" },
    { to: "/admin/invoices", icon: FileText, label: "Invoices" },
    { to: "/admin/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* OVERLAY (mobile) */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed md:static z-40 w-64 bg-white border-r flex flex-col
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* BRAND */}
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
              Pursue
            </h2>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="md:hidden text-gray-600"
          >
            <X />
          </button>
        </div>

        {/* MENU */}
        <nav className="flex-1 p-4 space-y-1">
          {menu.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition
                ${
                  isActive
                    ? "bg-blue-600 text-white shadow"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* LOGOUT */}
        <button
          onClick={logout}
          className="m-4 flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              className="md:hidden text-gray-600"
            >
              <Menu />
            </button>

            <div>
              <h1 className="font-semibold text-gray-800">
                Pursue Co-working Space
              </h1>
              <p className="text-xs text-gray-500">
                Office Management System
              </p>
            </div>
          </div>

          <span className="hidden sm:block text-sm text-gray-600">
            Welcome, Admin
          </span>
        </header>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
