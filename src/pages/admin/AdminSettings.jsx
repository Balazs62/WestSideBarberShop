import React, { useEffect, useState } from "react";
import { Save, Check } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { base44 } from "@/api/base44Client";

export default function AdminSettings() {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [values, setValues] = useState({});

  const load = async () => {
    const data = await base44.entities.SiteSettings.list("key", 100);
    setSettings(data);
    const vals = {};
    data.forEach(s => { vals[s.id] = s.value; });
    setValues(vals);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    setSaving(true);
    await Promise.all(
      settings.map(s => base44.entities.SiteSettings.update(s.id, { value: values[s.id] ?? s.value }))
    );
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const groupedSettings = [
    {
      title: "Hero szekció",
      keys: ["hero_title", "hero_subtitle"],
    },
    {
      title: "Rólunk",
      keys: ["about_text"],
    },
    {
      title: "Elérhetőségek",
      keys: ["phone", "address"],
    },
    {
      title: "Nyitvatartás",
      keys: ["hours_weekday", "hours_saturday"],
    },
    {
      title: "Közösségi média",
      keys: ["facebook_url", "instagram_url"],
    },
  ];

  const getById = (key) => settings.find(s => s.key === key);

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">Beállítások</h1>
            <p className="font-body text-muted-foreground mt-1">Oldal tartalmának szerkesztése</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground font-body font-semibold text-sm rounded-sm hover:bg-primary/90 disabled:opacity-50 transition-all"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : saved ? (
              <Check className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saved ? "Mentve!" : "Mentés"}
          </button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-16 bg-card border border-border rounded-sm animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {groupedSettings.map((group) => (
              <div key={group.title} className="bg-card border border-border rounded-sm overflow-hidden">
                <div className="px-5 py-3 border-b border-border bg-secondary/30">
                  <h3 className="font-body text-sm font-semibold text-foreground">{group.title}</h3>
                </div>
                <div className="p-5 space-y-4">
                  {group.keys.map((key) => {
                    const s = getById(key);
                    if (!s) return null;
                    const isLong = key === "about_text";
                    return (
                      <div key={key}>
                        <label className="font-body text-xs text-muted-foreground mb-1.5 block">{s.label}</label>
                        {isLong ? (
                          <textarea
                            value={values[s.id] ?? s.value}
                            onChange={(e) => setValues(v => ({ ...v, [s.id]: e.target.value }))}
                            rows={4}
                            className="w-full px-3 py-2.5 bg-secondary border border-border rounded-sm font-body text-sm text-foreground focus:border-primary focus:outline-none resize-none"
                          />
                        ) : (
                          <input
                            type="text"
                            value={values[s.id] ?? s.value}
                            onChange={(e) => setValues(v => ({ ...v, [s.id]: e.target.value }))}
                            className="w-full px-3 py-2.5 bg-secondary border border-border rounded-sm font-body text-sm text-foreground focus:border-primary focus:outline-none"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}