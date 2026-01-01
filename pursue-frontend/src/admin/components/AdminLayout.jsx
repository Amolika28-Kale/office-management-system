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
  Space,
} from "lucide-react";

export default function AdminLayout() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r hidden md:flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-blue-600">
            Pursue
          </h2>
          <p className="text-sm text-gray-500">
            Admin Panel
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <SidebarLink to="/admin/dashboard" icon={<LayoutDashboard />} label="Dashboard" />
          <SidebarLink to="/admin/spaces" icon={<Space/>} label="Spaces"/>
          <SidebarLink to="/admin/bookings" icon={<CalendarCheck />} label="All Bookings" />
          <SidebarLink to="/admin/crm" icon={<Users />} label="CRM & Leads" />
          <SidebarLink to="/admin/users" icon={<Users />} label="Users" />
          <SidebarLink to="/admin/inventory" icon={<Boxes />} label="Inventory" />
          <SidebarLink to="/admin/payments" icon={<CreditCard />} label="Payments" />
          <SidebarLink to="/admin/invoices" icon={<FileText />} label="Invoices" />
          <SidebarLink to="/admin/settings" icon={<Settings />} label="Settings" />
        </nav>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-6">
          <div>
            <h1 className="font-semibold text-gray-800">
              Pursue Co-working Space
            </h1>
            <p className="text-sm text-gray-500">
              Office Management System
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">
              Welcome, Admin
            </span>
            <button
              onClick={logout}
              className="text-blue-600 hover:underline text-sm"
            >
              Logout
            </button>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

/* SIDEBAR LINK */
function SidebarLink({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition
        ${
          isActive
            ? "bg-blue-50 text-blue-600"
            : "text-gray-700 hover:bg-gray-100"
        }`
      }
    >
      {icon}
      {label}
    </NavLink>
  );
}
