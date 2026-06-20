import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, Scissors, Clock, TrendingUp, ChevronRight, CheckCircle, AlertCircle, XCircle, LogOut, Users } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { getDatabase } from "@/data/mockDatabase";
import { authService } from "@/services/AuthService";

const statusConfig = {
  pending: { label: "Függőben", color: "text-yellow-500", bg: "bg-yellow-500/10", icon: Clock },
  confirmed: { label: "Visszaigazolva", color: "text-green-500", bg: "bg-green-500/10", icon: CheckCircle },
  cancelled: { label: "Lemondva", color: "text-red-500", bg: "bg-red-500/10", icon: XCircle },
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const db = getDatabase();
    setBookings(db.bookings || []);
    setServices(db.services || []);
    setUsers(db.users || []);
    setLoading(false);
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const pending = bookings.filter(b => b.status === "pending").length;
  const confirmed = bookings.filter(b => b.status === "confirmed").length;
  const today = new Date().toISOString().split("T")[0];
  const todayBookings = bookings.filter(b => b.date === today);

  const stats = [
    { label: "Összes foglalás", value: bookings.length, icon: Calendar, color: "text-primary" },
    { label: "Függőben lévő", value: pending, icon: Clock, color: "text-yellow-500" },
    { label: "Visszaigazolt", value: confirmed, icon: CheckCircle, color: "text-green-500" },
    { label: "Regisztrált felhasználók", value: users.length, icon: Users, color: "text-blue-400" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">Áttekintés</h1>
            <p className="font-body text-muted-foreground mt-1">WestSide Barbershop admin felület</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Kijelentkezés</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-sm p-3 sm:p-4 md:p-5">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <s.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${s.color}`} />
              </div>
              <p className={`font-display text-xl sm:text-2xl md:text-3xl font-bold ${s.color}`}>{loading ? "–" : s.value}</p>
              <p className="font-body text-[10px] sm:text-xs text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Recent bookings */}
        <div className="bg-card border border-border rounded-sm">
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border">
            <h2 className="font-display text-base sm:text-lg font-semibold text-foreground">Legújabb foglalások</h2>
            <Link to="/admin/bookings" className="flex items-center gap-1 text-xs text-primary font-body hover:underline">
              Összes <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {loading ? (
            <div className="p-4 sm:p-5 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-12 bg-secondary rounded animate-pulse" />
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="p-8 sm:p-10 text-center text-muted-foreground font-body text-sm">
              Még nincsenek foglalások.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {bookings.slice(0, 8).map((b) => {
                const cfg = statusConfig[b.status] || statusConfig.pending;
                return (
                  <div key={b.id} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-secondary/30 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm font-medium text-foreground truncate">{b.customerName}</p>
                      <p className="font-body text-xs text-muted-foreground truncate">{b.serviceName}</p>
                    </div>
                    <div className="hidden sm:block text-right">
                      <p className="font-body text-xs text-foreground">{b.date}</p>
                      <p className="font-body text-xs text-muted-foreground">{b.time} – {b.employeeName}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-sm text-xs font-body font-medium ${cfg.bg} ${cfg.color} whitespace-nowrap`}>
                      <cfg.icon className="w-3 h-3" />
                      <span className="hidden sm:inline">{cfg.label}</span>
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Today */}
        {todayBookings.length > 0 && (
          <div className="bg-card border border-primary/20 rounded-sm">
            <div className="p-5 border-b border-border">
              <h2 className="font-display text-lg font-semibold text-foreground">Mai program</h2>
            </div>
            <div className="divide-y divide-border">
              {todayBookings.sort((a, b) => a.time?.localeCompare(b.time)).map((b) => (
                <div key={b.id} className="flex items-center gap-4 p-4">
                  <div className="w-12 text-center">
                    <p className="font-body text-sm font-bold text-primary">{b.time}</p>
                  </div>
                  <div className="flex-1">
                    <p className="font-body text-sm font-medium text-foreground">{b.customerName}</p>
                    <p className="font-body text-xs text-muted-foreground">{b.serviceName}</p>
                  </div>
                  <p className="font-body text-xs text-muted-foreground">{b.employeeName}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}