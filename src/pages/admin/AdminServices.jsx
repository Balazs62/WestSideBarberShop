import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Check, GripVertical, Eye, EyeOff } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { base44 } from "@/api/base44Client";

const EMPTY = { name: "", price: "", description: "", barber: "Mindkettő", duration_minutes: 45, active: true, sort_order: 0 };

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | "create" | service obj
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = () => {
    base44.entities.Service.list("sort_order", 100).then(setServices).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openCreate = () => { setForm({ ...EMPTY, sort_order: services.length + 1 }); setModal("create"); };
  const openEdit = (s) => { setForm({ ...s }); setModal(s); };

  const save = async () => {
    setSaving(true);
    if (modal === "create") {
      await base44.entities.Service.create(form);
    } else {
      await base44.entities.Service.update(modal.id, form);
    }
    await load();
    setModal(null);
    setSaving(false);
  };

  const toggle = async (s) => {
    await base44.entities.Service.update(s.id, { active: !s.active });
    setServices((prev) => prev.map((x) => x.id === s.id ? { ...x, active: !x.active } : x));
  };

  const del = async (id) => {
    if (!confirm("Biztosan törlöd ezt a szolgáltatást?")) return;
    await base44.entities.Service.delete(id);
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">Szolgáltatások</h1>
            <p className="font-body text-muted-foreground mt-1">{services.length} szolgáltatás</p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground font-body font-semibold text-sm rounded-sm hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Új szolgáltatás
          </button>
        </div>

        <div className="bg-card border border-border rounded-sm overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-14 bg-secondary rounded animate-pulse" />)}</div>
          ) : (
            <div className="divide-y divide-border">
              {services.map((s) => (
                <div key={s.id} className={`flex items-center gap-3 p-4 hover:bg-secondary/20 transition-colors ${!s.active ? "opacity-50" : ""}`}>
                  <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-body text-sm font-semibold text-foreground">{s.name}</p>
                      {s.barber && s.barber !== "Mindkettő" && (
                        <span className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded font-body">{s.barber}</span>
                      )}
                      {!s.active && <span className="text-xs px-1.5 py-0.5 bg-secondary text-muted-foreground rounded font-body">Inaktív</span>}
                    </div>
                    <p className="font-body text-xs text-muted-foreground truncate">{s.description}</p>
                  </div>
                  <div className="hidden sm:block text-right mr-2">
                    <p className="font-body text-sm font-semibold text-primary">{s.price || "–"}</p>
                    {s.duration_minutes && <p className="font-body text-xs text-muted-foreground">{s.duration_minutes} perc</p>}
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => toggle(s)} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors">
                      {s.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button onClick={() => openEdit(s)} className="p-1.5 text-muted-foreground hover:text-primary transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => del(s.id)} className="p-1.5 text-muted-foreground hover:text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {modal !== null && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-sm w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-display text-lg font-semibold text-foreground">
                {modal === "create" ? "Új szolgáltatás" : "Szerkesztés"}
              </h2>
              <button onClick={() => setModal(null)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {[
                { key: "name", label: "Név *", type: "text", placeholder: "Pl. Átmenetes hajvágás" },
                { key: "price", label: "Ár", type: "text", placeholder: "Pl. 5 500 Ft" },
              ].map(({ key, label, type, placeholder }) => (
                <div key={key}>
                  <label className="font-body text-sm text-muted-foreground mb-1 block">{label}</label>
                  <input
                    type={type}
                    value={form[key]}
                    onChange={(e) => setForm(f => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full px-3 py-2.5 bg-secondary border border-border rounded-sm font-body text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              ))}
              <div>
                <label className="font-body text-sm text-muted-foreground mb-1 block">Leírás</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2.5 bg-secondary border border-border rounded-sm font-body text-sm text-foreground focus:border-primary focus:outline-none resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-sm text-muted-foreground mb-1 block">Barber</label>
                  <select
                    value={form.barber}
                    onChange={(e) => setForm(f => ({ ...f, barber: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-secondary border border-border rounded-sm font-body text-sm text-foreground focus:border-primary focus:outline-none"
                  >
                    <option>Mindkettő</option>
                    <option>Tamás</option>
                    <option>Béci</option>
                  </select>
                </div>
                <div>
                  <label className="font-body text-sm text-muted-foreground mb-1 block">Időtartam (perc)</label>
                  <input
                    type="number"
                    value={form.duration_minutes}
                    onChange={(e) => setForm(f => ({ ...f, duration_minutes: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2.5 bg-secondary border border-border rounded-sm font-body text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setForm(f => ({ ...f, active: !f.active }))}
                  className={`w-10 h-5 rounded-full transition-colors relative ${form.active ? "bg-primary" : "bg-secondary"}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.active ? "translate-x-5" : "translate-x-0.5"}`} />
                </button>
                <label className="font-body text-sm text-muted-foreground">Aktív (megjelenik a weboldalon)</label>
              </div>
            </div>
            <div className="p-5 border-t border-border flex justify-end gap-3">
              <button onClick={() => setModal(null)} className="px-4 py-2 border border-border rounded-sm font-body text-sm text-muted-foreground hover:text-foreground transition-colors">Mégsem</button>
              <button
                onClick={save}
                disabled={!form.name || saving}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-sm font-body text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                {saving ? <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : <Check className="w-4 h-4" />}
                Mentés
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}