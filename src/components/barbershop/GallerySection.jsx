import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scissors, X, ChevronLeft, ChevronRight } from "lucide-react";
import { base44 } from "@/api/base44Client";

const fallbackImages = [
  { image_url: "https://media.base44.com/images/public/6a33a305cfe51c59e5d1a397/c56ca53b3_generated_98cbb3b3.png", caption: "Precíz fade hajvágás" },
  { image_url: "https://media.base44.com/images/public/6a33a305cfe51c59e5d1a397/9f922f07d_generated_8a79fa81.png", caption: "Szakáll formázás és kontúr" },
  { image_url: "https://media.base44.com/images/public/6a33a305cfe51c59e5d1a397/a8699792d_generated_52286c11.png", caption: "Belső tér és hangulat" },
  { image_url: "https://media.base44.com/images/public/6a33a305cfe51c59e5d1a397/cdbcf50cd_generated_9f41e5ab.png", caption: "Prémium barber eszközök" },
  { image_url: "https://media.base44.com/images/public/6a33a305cfe51c59e5d1a397/d66d9ffd4_generated_2489de8c.png", caption: "Modern frizura stílus" },
  { image_url: "https://media.base44.com/images/public/6a33a305cfe51c59e5d1a397/745744569_generated_c763d130.png", caption: "Exkluzív barber élmény" },
];

export default function GallerySection() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    base44.entities.GalleryImage.filter({ active: true }, "sort_order", 50)
      .then((data) => setImages(data.length ? data : fallbackImages))
      .catch(() => setImages(fallbackImages))
      .finally(() => setLoading(false));
  }, []);

  const prev = () => setSelected((s) => (s > 0 ? s - 1 : images.length - 1));
  const next = () => setSelected((s) => (s < images.length - 1 ? s + 1 : 0));

  return (
    <section id="gallery" className="py-20 sm:py-28 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="h-px w-10 bg-primary/40" />
            <Scissors className="w-4 h-4 text-primary" />
            <div className="h-px w-10 bg-primary/40" />
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Galéria
          </h2>
          <p className="font-body text-muted-foreground max-w-xl mx-auto">
            Tekintsd meg munkáinkat és a barbershop hangulatát.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-sm aspect-[4/3] bg-secondary animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {images.map((img, i) => (
              <motion.button
                key={img.id || i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                onClick={() => setSelected(i)}
                className="group relative overflow-hidden rounded-sm aspect-[4/3]"
              >
                <img
                  src={img.image_url}
                  alt={img.caption || "Galéria kép"}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <p className="font-body text-xs sm:text-sm text-white font-medium">
                    {img.caption}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-white/70 hover:text-white">
              <X className="w-8 h-8" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2">
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2">
              <ChevronRight className="w-8 h-8" />
            </button>
            <motion.div
              key={selected}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="flex flex-col items-center gap-3"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[selected]?.image_url}
                alt={images[selected]?.caption}
                className="max-w-full max-h-[80vh] object-contain rounded-sm"
              />
              {images[selected]?.caption && (
                <p className="font-body text-sm text-white/70">{images[selected].caption}</p>
              )}
              <p className="font-body text-xs text-white/40">{selected + 1} / {images.length}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}