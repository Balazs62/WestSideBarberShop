import React, { useEffect, useState } from "react";
import { Plus, Trash2, Eye, EyeOff, Upload, X, Check } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { base44 } from "@/api/base44Client";

const CATEGORIES = ["hajvágás", "szakáll", "belső tér", "hangulat"];

export default function AdminGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ image_url: "", caption: "", category: "hangulat", sort_order: 0, active: true });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = () => {
    base44.entities.GalleryImage.list("sort_order", 100).then(setImages).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setForm(f => ({ ...f, image_url: file_url }));
    setUploading(false);
  };

  const save = async () => {
    if (!form.image_url) return;
    setSaving(true);
    await base44.entities.GalleryImage.create({ ...form, sort_order: images.length + 1 });
    await load();
    setModal(false);
    setForm({ image_url: "", caption: "", category: "hangulat", sort_order: 0, active: true });
    setSaving(false);
  };

  const toggle = async (img) => {
    await base44.entities.GalleryImage.update(img.id, { active: !img.active });
    setImages(prev => prev.map(x => x.id === img.id ? { ...x, active: !x.active } : x));
  };

  const del = async (id) => {
    if (!confirm("Biztosan törlöd ezt a képet?")) return;
    await base44.entities.GalleryImage.delete(id);
    setImages(prev => prev.filter(x => x.id !== id));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">Galéria</h1>
            <p className="font-body text-muted-foreground mt-1">{images.length} kép</p>
          </div>
          <button
            onClick={() => setModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground font-body font-semibold text-sm rounded-sm hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Kép hozzáadása
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] bg-secondary rounded-sm animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((img) => (
              <div key={img.id} className={`group relative rounded-sm overflow-hidden border border-border ${!img.active ? "opacity-50" : ""}`}>
                <img
                  src={img.image_url}
                  alt={img.caption || "Galéria kép"}
                  className="w-full aspect-[4/3] object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => toggle(img)}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-sm text-white transition-colors"
                    title={img.active ? "Elrejtés" : "Megjelenítés"}
                  >
                    {img.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => del(img.id)}
                    className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-sm text-red-300 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {img.caption && (
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                    <p className="font-body text-xs text-white truncate">{img.caption}</p>
                  </div>
                )}
                {!img.active && (
                  <div className="absolute top-2 right-2 bg-black/60 rounded px-1.5 py-0.5">
                    <p className="font-body text-xs text-white/70">Rejtett</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-sm w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-display text-lg font-semibold text-foreground">Kép hozzáadása</h2>
              <button onClick={() => setModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {/* Upload */}
              <div>
                <label className="font-body text-sm text-muted-foreground mb-2 block">Kép feltöltése</label>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-sm cursor-pointer hover:border-primary/40 transition-colors relative overflow-hidden">
                  {form.image_url ? (
                    <img src={form.image_url} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                  ) : uploading ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                      <span className="font-body text-sm">Feltöltés...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Upload className="w-6 h-6" />
                      <span className="font-body text-sm">Kattints a feltöltéshez</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleFile} className="sr-only" />
                </label>
                {form.image_url && (
                  <button onClick={() => setForm(f => ({ ...f, image_url: "" }))} className="mt-1 text-xs text-red-400 font-body hover:underline">Kép törlése</button>
                )}
              </div>

              <div>
                <label className="font-body text-sm text-muted-foreground mb-1 block">Felirat (opcionális)</label>
                <input
                  value={form.caption}
                  onChange={(e) => setForm(f => ({ ...f, caption: e.target.value }))}
                  placeholder="Pl. Precíz fade hajvágás"
                  className="w-full px-3 py-2.5 bg-secondary border border-border rounded-sm font-body text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="font-body text-sm text-muted-foreground mb-1 block">Kategória</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-secondary border border-border rounded-sm font-body text-sm text-foreground focus:border-primary focus:outline-none"
                >
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="p-5 border-t border-border flex justify-end gap-3">
              <button onClick={() => setModal(false)} className="px-4 py-2 border border-border rounded-sm font-body text-sm text-muted-foreground hover:text-foreground transition-colors">Mégsem</button>
              <button
                onClick={save}
                disabled={!form.image_url || saving}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-sm font-body text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                {saving ? <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : <Check className="w-4 h-4" />}
                Hozzáadás
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}