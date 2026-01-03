import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, CalendarCheck, CreditCard, FileText, 
  Settings, LogOut, Menu, X, UserCircle, 
  ChevronRight, Compass, ShieldCheck
} from "lucide-react";
import { logout } from "../../services/authService";
import UserNotificationBell from "./UserNotificationBell";

export default function UserLayout() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuGroups = [
    {
      label: "Overview",
      items: [
        { name: "Dashboard", path: "/user", icon: LayoutDashboard },
        { name: "My Bookings", path: "/user/bookings", icon: CalendarCheck },
      ]
    },
    {
      label: "Account & Billing",
      items: [
        { name: "Payments", path: "/user/payments", icon: CreditCard },
        { name: "Invoices", path: "/user/invoices", icon: FileText },
      ]
    },
    {
      label: "Configuration",
      items: [
        { name: "Settings", path: "/user/settings", icon: Settings },
      ]
    }
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* MOBILE OVERLAY */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-all duration-300"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed lg:sticky top-0 z-50 h-screen w-72 bg-[#0F172A] text-slate-300 flex flex-col transition-all duration-300 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* BRAND LOGO */}
        <div className="p-8 mb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 flex items-center justify-center bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-500/20">
              <Compass size={22} className="animate-pulse-slow" />
            </div>
            <div>
              <p className="font-bold text-white tracking-tight leading-none text-xl">Pursue</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1 font-black">Member Portal</p>
            </div>
            <button onClick={() => setOpen(false)} className="lg:hidden ml-auto text-slate-400 p-1 hover:bg-slate-800 rounded-lg">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-4 space-y-8 overflow-y-auto custom-scrollbar">
          {menuGroups.map((group) => (
            <div key={group.label}>
              <p className="px-4 text-[10px] font-black uppercase tracking-widest text-slate-600 mb-4">
                {group.label}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    end
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `group flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200
                      ${isActive 
                        ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20" 
                        : "hover:bg-slate-800/50 hover:text-white"}`
                    }
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={19} className="opacity-80 group-hover:opacity-100" />
                      {item.name}
                    </div>
                    <ChevronRight size={14} className={`opacity-0 group-hover:opacity-40 transition-opacity`} />
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* FOOTER / LOGOUT */}
        <div className="p-4 mt-auto border-t border-slate-800/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
          >
            <LogOut size={19} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* GLASS HEADER */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-30 px-6 lg:px-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setOpen(true)}
              className="lg:hidden p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors"
            >
              <Menu size={20} />
            </button>
            
            <div className="hidden sm:block">
              <h2 className="text-sm font-bold text-slate-800 leading-none">Pursue Workspace</h2>
              {/* <div className="flex items-center gap-1.5 mt-1.5">
                <ShieldCheck size={12} className="text-emerald-500" />
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight"></span>
              </div> */}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* NOTIFICATIONS */}
            <UserNotificationBell />


            <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block" />

            {/* USER PROFILE */}
            <div className="flex items-center gap-3 pl-2 group cursor-pointer">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-slate-900 leading-none">Member User</p>
                <p className="text-[10px] text-indigo-600 font-black uppercase mt-1"></p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 group-hover:border-indigo-200 group-hover:bg-indigo-50 transition-all shadow-sm">
                <UserCircle size={24} />
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT AREA */}
        <main className="flex-1 p-4 sm:p-6 lg:p-10 max-w-[1600px] mx-auto w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
          <Outlet />
        </main>
      </div>
    </div>
  );
}