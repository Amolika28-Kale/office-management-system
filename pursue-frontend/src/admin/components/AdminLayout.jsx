import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, CalendarCheck, Users, Boxes, 
  CreditCard, FileText, Settings, LogOut, 
  Building2, Menu, X, Search, Bell, UserCircle, ChevronRight
} from "lucide-react";

export default function AdminLayout() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Grouped Menu for better hierarchy
  const menuGroups = [
    {
      title: "Core",
      items: [
        { to: "/admin/dashboard", icon: LayoutDashboard, label: "Overview" },
        { to: "/admin/spaces", icon: Building2, label: "Space Management" },
      ]
    },
    {
      title: "Operations",
      items: [
        { to: "/admin/bookings", icon: CalendarCheck, label: "Reservations" },
        { to: "/admin/crm", icon: Users, label: "Leads & CRM" },
        { to: "/admin/users", icon: Users, label: "Member List" },
        { to: "/admin/inventory", icon: Boxes, label: "Inventory" },
      ]
    },
    {
      title: "Finance & Admin",
      items: [
        { to: "/admin/payments", icon: CreditCard, label: "Transactions" },
        { to: "/admin/invoices", icon: FileText, label: "Invoice History" },
        { to: "/admin/settings", icon: Settings, label: "Global Settings" },
      ]
    }
  ];

  return (
    <div className="flex min-h-screen bg-[#FDFDFD]">
      {/* OVERLAY (mobile) */}
      {open && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed md:static z-50 w-72 bg-[#0F172A] text-slate-300 h-screen flex flex-col transition-all duration-300 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* BRAND SECTION */}
        <div className="p-8 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
              <Building2 size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Pursue</h2>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">Admin</p>
            </div>
            <button onClick={() => setOpen(false)} className="md:hidden ml-auto text-slate-400">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-4 overflow-y-auto custom-scrollbar">
          {menuGroups.map((group, idx) => (
            <div key={idx} className="mb-8">
              <p className="px-4 text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">
                {group.title}
              </p>
              <div className="space-y-1">
                {group.items.map(({ to, icon: Icon, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `group flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200
                      ${isActive 
                        ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20" 
                        : "hover:bg-slate-800 hover:text-white"}`
                    }
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={19} className="opacity-80" />
                      {label}
                    </div>
                    <ChevronRight size={14} className="opacity-0 group-hover:opacity-40 transition-opacity" />
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* LOGOUT BUTTON */}
        <div className="p-4 mt-auto">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-bold text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
          >
            <LogOut size={19} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* TOP HEADER */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4 flex-1">
            <button onClick={() => setOpen(true)} className="md:hidden p-2 hover:bg-slate-100 rounded-lg">
              <Menu size={20} />
            </button>
            
            {/* SEARCH BAR */}
            <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-2xl w-full max-w-md focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
              <Search size={18} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="bg-transparent border-none outline-none text-sm text-slate-600 w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 ml-4">
            <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-xl relative transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="h-8 w-[1px] bg-slate-200 mx-2 hidden sm:block"></div>
            
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800 leading-none">Admin User</p>
                <p className="text-[10px] text-indigo-600 font-bold mt-1">Super Admin</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center text-slate-400 overflow-hidden">
                <UserCircle size={32} />
              </div>
            </div>
          </div>
        </header>

        {/* MAIN VIEWPORT */}
        <main className="flex-1 p-6 md:p-10 max-w-[1600px] mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}