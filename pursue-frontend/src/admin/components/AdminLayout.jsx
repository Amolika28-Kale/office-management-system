import { useState, useMemo, useRef, useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, CalendarCheck, Users, Boxes,
  CreditCard, FileText, Settings, LogOut,
  Building2, Menu, X, Search, Bell, UserCircle, ChevronRight
} from "lucide-react";

export default function AdminLayout() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  /* SEARCH STATE */
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  /* MENU CONFIG */
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

  /* FLATTEN MENU FOR SEARCH */
  const searchableItems = useMemo(() => {
    return menuGroups.flatMap(group =>
      group.items.map(item => ({
        ...item,
        group: group.title
      }))
    );
  }, []);

  /* SEARCH RESULTS */
  const results = useMemo(() => {
    if (!searchTerm) return [];
    const q = searchTerm.toLowerCase();
    return searchableItems.filter(
      item =>
        item.label.toLowerCase().includes(q) ||
        item.group.toLowerCase().includes(q)
    );
  }, [searchTerm, searchableItems]);

  /* CLOSE SEARCH ON OUTSIDE CLICK */
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (path) => {
    navigate(path);
    setSearchTerm("");
    setShowResults(false);
  };

  return (
    <div className="flex min-h-screen bg-[#FDFDFD]">

      {/* SIDEBAR */}
      <aside className={`fixed md:static z-50 w-72 bg-[#0F172A] text-slate-300 h-screen flex flex-col transition-all
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>

        {/* BRAND */}
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
            <Building2 size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Pursue</h2>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Admin</p>
          </div>
          <button onClick={() => setOpen(false)} className="md:hidden ml-auto">
            <X size={20} />
          </button>
        </div>

        {/* NAV */}
        <nav className="flex-1 px-4 overflow-y-auto">
          {menuGroups.map((group, i) => (
            <div key={i} className="mb-8">
              <p className="px-4 text-[10px] uppercase font-black text-slate-500 mb-4">
                {group.title}
              </p>
              {group.items.map(({ to, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-4 py-3 rounded-xl font-semibold
                    ${isActive ? "bg-indigo-600 text-white" : "hover:bg-slate-800"}`
                  }
                >
                  <div className="flex gap-3 items-center">
                    <Icon size={18} />
                    {label}
                  </div>
                  <ChevronRight size={14} className="opacity-40" />
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* LOGOUT */}
        <div className="p-4">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-400 hover:text-red-400"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <header className="h-20 bg-white border-b flex items-center px-6 gap-4">
          <button onClick={() => setOpen(true)} className="md:hidden">
            <Menu size={20} />
          </button>

          {/* 🔍 SEARCH */}
          <div ref={searchRef} className="relative w-full max-w-md">
            <div className="flex items-center gap-2 bg-slate-50 border px-4 py-2 rounded-2xl">
              <Search size={18} className="text-slate-400" />
              <input
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowResults(true);
                }}
                placeholder="Search pages..."
                className="bg-transparent outline-none w-full text-sm"
              />
            </div>

            {/* RESULTS */}
            {showResults && searchTerm && (
              <div className="absolute top-14 w-full bg-white border rounded-2xl shadow-xl z-50">
                {results.length ? (
                  results.map(item => (
                    <button
                      key={item.to}
                      onClick={() => handleSelect(item.to)}
                      className="w-full text-left px-4 py-3 hover:bg-slate-50"
                    >
                      <p className="font-bold text-sm">{item.label}</p>
                      <p className="text-xs text-slate-400">{item.group}</p>
                    </button>
                  ))
                ) : (
                  <p className="px-4 py-3 text-sm text-slate-400">
                    No results found
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="ml-auto flex items-center gap-4">
            <Bell size={20} />
            <UserCircle size={32} />
          </div>
        </header>

        <main className="flex-1 p-6 md:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
