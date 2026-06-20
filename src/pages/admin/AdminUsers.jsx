import React, { useEffect, useState } from "react";
import { Shield, ShieldOff, User, Search } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { base44 } from "@/api/base44Client";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    Promise.all([
      base44.entities.User.list("-created_date", 100),
      base44.auth.me(),
    ]).then(([u, me]) => {
      setUsers(u);
      setCurrentUser(me);
    }).finally(() => setLoading(false));
  }, []);

  const toggleAdmin = async (user) => {
    if (user.id === currentUser?.id) return; // ne lehessen magát eltávolítani
    const newRole = user.role === "admin" ? "user" : "admin";
    setUpdating(user.id);
    await base44.entities.User.update(user.id, { role: newRole });
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, role: newRole } : u));
    setUpdating(null);
  };

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    return !q || u.full_name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">Felhasználók</h1>
          <p className="font-body text-muted-foreground mt-1">Admin jogok kezelése</p>
        </div>

        <div className="relative max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Keresés név, email..."
            className="w-full pl-9 pr-4 py-2.5 bg-card border border-border rounded-sm font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none"
          />
        </div>

        <div className="bg-card border border-border rounded-sm overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-14 bg-secondary rounded animate-pulse" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground font-body text-sm">Nincs találat.</div>
          ) : (
            <div className="divide-y divide-border">
              {filtered.map((u) => {
                const isAdmin = u.role === "admin";
                const isSelf = u.id === currentUser?.id;
                return (
                  <div key={u.id} className="flex items-center gap-4 p-4 hover:bg-secondary/20 transition-colors">
                    <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-body text-sm font-medium text-foreground truncate">{u.full_name || "–"}</p>
                        {isSelf && <span className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded font-body">Te</span>}
                      </div>
                      <p className="font-body text-xs text-muted-foreground truncate">{u.email}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-1 rounded-sm font-body font-medium ${isAdmin ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}>
                        {isAdmin ? "Admin" : "Felhasználó"}
                      </span>
                      <button
                        onClick={() => toggleAdmin(u)}
                        disabled={isSelf || updating === u.id}
                        title={isSelf ? "Saját jogot nem módosíthatsz" : isAdmin ? "Admin jog elvétele" : "Admin jog adása"}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-body font-medium border transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                          isAdmin
                            ? "border-red-400/30 text-red-400 hover:bg-red-400/10"
                            : "border-primary/30 text-primary hover:bg-primary/10"
                        }`}
                      >
                        {updating === u.id ? (
                          <div className="w-3 h-3 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                        ) : isAdmin ? (
                          <ShieldOff className="w-3.5 h-3.5" />
                        ) : (
                          <Shield className="w-3.5 h-3.5" />
                        )}
                        {isAdmin ? "Elvétel" : "Admin"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-secondary/30 border border-border rounded-sm p-4">
          <p className="font-body text-xs text-muted-foreground">
            <span className="text-foreground font-medium">Megjegyzés:</span> Az admin jogú felhasználók hozzáférnek az admin felülethez. Saját jogodat nem módosíthatod.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}