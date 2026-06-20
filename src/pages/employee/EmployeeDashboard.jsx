import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, CheckCircle, LogOut, User } from "lucide-react";
import { getDatabase } from "@/data/mockDatabase";
import { authService } from "@/services/AuthService";

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const db = getDatabase();
    const currentUser = authService.getCurrentUser();
    
    // Filter bookings for the current employee
    const employeeBookings = (db.bookings || []).filter(
      b => b.employeeId === currentUser?.id || b.employeeName === currentUser?.name
    );
    
    setBookings(employeeBookings);
    setLoading(false);
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const today = new Date().toISOString().split("T")[0];
  const todayBookings = bookings.filter(b => b.date === today);
  const upcomingBookings = bookings.filter(b => b.date >= today);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-xl font-bold text-foreground">Dolgozói Dashboard</h1>
              <p className="text-sm text-muted-foreground">WestSide Barbershop</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Kijelentkezés</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <p className="text-3xl font-bold text-foreground">{loading ? "–" : bookings.length}</p>
              <p className="text-sm text-muted-foreground">Összes foglalás</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-5 h-5 text-yellow-500" />
              </div>
              <p className="text-3xl font-bold text-foreground">{loading ? "–" : todayBookings.length}</p>
              <p className="text-sm text-muted-foreground">Mai foglalások</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-3xl font-bold text-foreground">{loading ? "–" : upcomingBookings.length}</p>
              <p className="text-sm text-muted-foreground">Közelgő foglalások</p>
            </div>
          </div>

          {/* Today's Schedule */}
          <div className="bg-card border border-border rounded-lg">
            <div className="p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Mai program</h2>
            </div>
            {loading ? (
              <div className="p-6 space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-12 bg-secondary rounded animate-pulse" />
                ))}
              </div>
            ) : todayBookings.length === 0 ? (
              <div className="p-10 text-center text-muted-foreground">
                Ma nincsenek foglalások.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {todayBookings.sort((a, b) => a.time?.localeCompare(b.time)).map((b) => (
                  <div key={b.id} className="flex items-center gap-4 p-4 hover:bg-secondary/30 transition-colors">
                    <div className="w-16 text-center">
                      <p className="text-lg font-bold text-primary">{b.time}</p>
                      <p className="text-xs text-muted-foreground">{b.duration} perc</p>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{b.customerName}</p>
                      <p className="text-xs text-muted-foreground">{b.serviceName}</p>
                      <p className="text-xs text-muted-foreground">{b.customerPhone}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                      b.status === "confirmed" 
                        ? "bg-green-500/10 text-green-500" 
                        : "bg-yellow-500/10 text-yellow-500"
                    }`}>
                      {b.status === "confirmed" ? "Visszaigazolva" : "Függőben"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Bookings */}
          <div className="bg-card border border-border rounded-lg">
            <div className="p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Közelgő foglalások</h2>
            </div>
            {loading ? (
              <div className="p-6 space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-12 bg-secondary rounded animate-pulse" />
                ))}
              </div>
            ) : upcomingBookings.length === 0 ? (
              <div className="p-10 text-center text-muted-foreground">
                Nincsenek közelgő foglalások.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {upcomingBookings.slice(0, 10).sort((a, b) => a.date?.localeCompare(b.date) || a.time?.localeCompare(b.time)).map((b) => (
                  <div key={b.id} className="flex items-center gap-4 p-4 hover:bg-secondary/30 transition-colors">
                    <div className="w-20 text-center">
                      <p className="text-sm font-bold text-primary">{b.date}</p>
                      <p className="text-xs text-muted-foreground">{b.time}</p>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{b.customerName}</p>
                      <p className="text-xs text-muted-foreground">{b.serviceName}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                      b.status === "confirmed" 
                        ? "bg-green-500/10 text-green-500" 
                        : "bg-yellow-500/10 text-yellow-500"
                    }`}>
                      {b.status === "confirmed" ? "Visszaigazolva" : "Függőben"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
