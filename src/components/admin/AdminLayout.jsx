import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, Calendar, Scissors, Image, Settings, Users,
  LogOut, Menu, X, ChevronRight, Scissors as ScissorsIcon
} from "lucide-react";
import { base44 } from "@/api/base44Client";

const navItems = [
  { label: "Áttekintés", path: "/admin", icon: LayoutDashboard },
  { label: "Foglalások", path: "/admin/bookings", icon: Calendar },
  { label: "Szolgáltatások", path: "/admin/services", icon: Scissors },
  { label: "Galéria", path: "/admin/gallery", icon: Image },
  { label: "Felhasználók", path: "/admin/users", icon: Users },
  { label: "Beállítások", path: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => base44.auth.logout("/");

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-display text-lg font-bold text-primary">WESTSIDE</p>
              <p className="font-body text-xs text-muted-foreground tracking-widest uppercase">Admin</p>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-muted-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-sm font-body text-sm transition-colors ${
                  active
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {item.label}
                {active && <ChevronRight className="w-3 h-3 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 rounded-sm font-body text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <ScissorsIcon className="w-4 h-4" />
            Vissza a weboldalra
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-sm font-body text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors w-full"
          >
            <LogOut className="w-4 h-4" />
            Kilépés
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 bg-card/80 backdrop-blur border-b border-border px-4 sm:px-6 h-14 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-muted-foreground">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <nav className="flex text-xs text-muted-foreground font-body">
              <span>Admin</span>
              <ChevronRight className="w-3.5 h-3.5 mx-1 mt-0.5" />
              <span className="text-foreground">
                {navItems.find(n => n.path === location.pathname)?.label || "Oldal"}
              </span>
            </nav>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}