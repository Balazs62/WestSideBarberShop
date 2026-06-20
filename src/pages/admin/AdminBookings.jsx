import React, { useEffect, useState } from "react";
import { CheckCircle, Clock, XCircle, Search, Filter, Phone, Mail, MessageSquare, Trash2, ChevronDown } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { base44 } from "@/api/base44Client";

const STATUS = {
  pending: { label: "Függőben", color: "text-yellow-500", bg: "bg-yellow-500/10", icon: Clock },
  confirmed: { label: "Visszaigazolva", color: "text-green-500", bg: "bg-green-500/10", icon: CheckCircle },
  cancelled: { label: "Lemondva", color: "text-red-500", bg: "bg-red-500/10", icon: XCircle },
};

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterBarber, setFilterBarber] = useState("all");
  const [expanded, setExpanded] = useState(null);
  const [updating, setUpdating] = useState(null);

  const load = () => {
    setLoading(true);
    base44.entities.Booking.list("-date", 200)
      .then(setBookings)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = bookings.filter((b) => {
    const q = search.toLowerCase();
    const matchSearch = !q || b.client_name?.toLowerCase().includes(q) || b.phone?.includes(q) || b.service?.toLowerCase().includes(q);
    const matchStatus = filterStatus === "all" || b.status === filterStatus;
    const matchBarber = filterBarber === "all" || b.barber === filterBarber;
    return matchSearch && matchStatus && matchBarber;
  });

  const updateStatus = async (id, status) => {
    setUpdating(id);
    await base44.entities.Booking.update(id, { status });
    setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status } : b));
    setUpdating(null);
  };

  const deleteBooking = async (id) => {
    if (!confirm("Biztosan törlöd ezt a foglalást?")) return;
    await base44.entities.Booking.delete(id);
    setBookings((prev) => prev.filter((b) => b.id !== id));
    if (expanded === id) setExpanded(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">Foglalások</h1>
            <p className="font-body text-muted-foreground mt-1">{filtered.length} foglalás</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Keresés név, telefon, szolgáltatás..."
              className="w-full pl-9 pr-4 py-2.5 bg-card border border-border rounded-sm font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none min-h-[44px]"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2.5 bg-card border border-border rounded-sm font-body text-sm text-foreground focus:border-primary focus:outline-none min-h-[44px]"
          >
            <option value="all">Minden státusz</option>
            <option value="pending">Függőben</option>
            <option value="confirmed">Visszaigazolva</option>
            <option value="cancelled">Lemondva</option>
          </select>
          <select
            value={filterBarber}
            onChange={(e) => setFilterBarber(e.target.value)}
            className="px-3 py-2.5 bg-card border border-border rounded-sm font-body text-sm text-foreground focus:border-primary focus:outline-none min-h-[44px]"
          >
            <option value="all">Minden barber</option>
            <option value="Tamás">Tamás</option>
            <option value="Béci">Béci</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-sm overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-14 bg-secondary rounded animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <p className="font-body text-muted-foreground">Nem található foglalás.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filtered.map((b) => {
                const cfg = STATUS[b.status] || STATUS.pending;
                const isExpanded = expanded === b.id;
                return (
                  <div key={b.id} className="hover:bg-secondary/20 transition-colors">
                    <div
                      className="flex items-center gap-3 p-3 sm:p-4 cursor-pointer"
                      onClick={() => setExpanded(isExpanded ? null : b.id)}
                    >
                      <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4">
                        <div>
                          <p className="font-body text-sm font-semibold text-foreground">{b.client_name}</p>
                          <p className="font-body text-xs text-muted-foreground">{b.phone}</p>
                        </div>
                        <div className="hidden sm:block">
                          <p className="font-body text-sm text-foreground truncate">{b.service}</p>
                          <p className="font-body text-xs text-muted-foreground">{b.barber}</p>
                        </div>
                        <div className="hidden sm:block">
                          <p className="font-body text-sm text-foreground">{b.date}</p>
                          <p className="font-body text-xs text-muted-foreground">{b.time}</p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-sm text-xs font-body font-medium whitespace-nowrap ${cfg.bg} ${cfg.color}`}>
                        <cfg.icon className="w-3 h-3" />
                        <span className="hidden sm:inline">{cfg.label}</span>
                      </span>
                      <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                    </div>

                    {isExpanded && (
                      <div className="px-3 sm:px-4 pb-4 pt-0 border-t border-border bg-secondary/10">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                          <div className="space-y-2 text-sm font-body">
                            <p><span className="text-muted-foreground">Szolgáltatás:</span> <span className="text-foreground">{b.service}</span></p>
                            <p><span className="text-muted-foreground">Barber:</span> <span className="text-foreground">{b.barber}</span></p>
                            <p><span className="text-muted-foreground">Dátum:</span> <span className="text-foreground">{b.date} {b.time}</span></p>
                            {b.email && <p className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-muted-foreground" /> <a href={`mailto:${b.email}`} className="text-primary hover:underline">{b.email}</a></p>}
                            {b.phone && <p className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-muted-foreground" /> <a href={`tel:${b.phone}`} className="text-primary hover:underline">{b.phone}</a></p>}
                            {b.notes && <p className="flex items-start gap-1"><MessageSquare className="w-3.5 h-3.5 text-muted-foreground mt-0.5" /> <span className="text-foreground">{b.notes}</span></p>}
                          </div>
                          <div className="space-y-2">
                            <p className="font-body text-xs text-muted-foreground uppercase tracking-wide mb-3">Státusz módosítása</p>
                            <div className="flex flex-wrap gap-2">
                              {Object.entries(STATUS).map(([key, val]) => (
                                <button
                                  key={key}
                                  disabled={b.status === key || updating === b.id}
                                  onClick={() => updateStatus(b.id, key)}
                                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-body font-medium transition-all min-h-[36px] ${
                                    b.status === key
                                      ? `${val.bg} ${val.color} border border-current/20`
                                      : "border border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                                  } disabled:opacity-50`}
                                >
                                  <val.icon className="w-3 h-3" />
                                  {val.label}
                                </button>
                              ))}
                            </div>
                            <button
                              onClick={() => deleteBooking(b.id)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-body font-medium text-red-400 border border-red-400/20 hover:bg-red-400/10 transition-colors mt-2 min-h-[36px]"
                            >
                              <Trash2 className="w-3 h-3" />
                              Törlés
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}