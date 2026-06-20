import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Scissors, Star, Clock, Phone, ChevronRight, Calendar, Image, MapPin } from "lucide-react";
import Navbar from "@/components/barbershop/Navbar";
import Footer from "@/components/barbershop/Footer";
import HeroSection from "@/components/barbershop/HeroSection";
import { base44 } from "@/api/base44Client";

const HERO_IMAGE = "https://media.base44.com/images/public/6a33a305cfe51c59e5d1a397/710d4171a_generated_a50d095b.png";

const DEFAULTS = {
  hero_title: "WestSide Barbershop Gyöngyös",
  hero_subtitle: "Profi vágások, precíz átmenetek, extra vagányság.",
  phone: "+36 30 388 5043",
  address: "Török Ignác utca 2, Gyöngyös",
  hours_weekday: "10:00 – 18:00",
  hours_saturday: "10:00 – 15:30",
  facebook_url: "https://www.facebook.com/",
  instagram_url: "https://www.instagram.com/",
};

const GALLERY_PREVIEWS = [
  "https://media.base44.com/images/public/6a33a305cfe51c59e5d1a397/c56ca53b3_generated_98cbb3b3.png",
  "https://media.base44.com/images/public/6a33a305cfe51c59e5d1a397/9f922f07d_generated_8a79fa81.png",
  "https://media.base44.com/images/public/6a33a305cfe51c59e5d1a397/a8699792d_generated_52286c11.png",
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.65, delay },
});

const stagger = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { staggerChildren: 0.12 },
};

const staggerItem = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.55 },
};

export default function Home() {
  const [settings, setSettings] = useState(DEFAULTS);
  const [services, setServices] = useState([]);

  useEffect(() => {
    Promise.all([
      base44.entities.SiteSettings.list("key", 100),
      base44.entities.Service.filter({ active: true }, "sort_order", 6),
    ]).then(([siteData, svcData]) => {
      if (siteData.length) {
        const m = { ...DEFAULTS };
        siteData.forEach(s => { m[s.key] = s.value; });
        setSettings(m);
      }
      setServices(svcData);
    }).catch(() => {});
  }, []);

  const highlights = [
    { icon: Star, label: "Prémium élmény", desc: "Minőségi termékek, profi kiszolgálás" },
    { icon: Clock, label: "Rugalmas időpontok", desc: `H–P: ${settings.hours_weekday}, Szo: ${settings.hours_saturday}` },
    { icon: Phone, label: "Közvetlen elérés", desc: settings.phone },
    { icon: MapPin, label: "Helyszín", desc: settings.address },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <HeroSection heroImage={HERO_IMAGE} title={settings.hero_title} subtitle={settings.hero_subtitle} />

      {/* Highlights strip */}
      <motion.section
        {...stagger}
        className="bg-card border-y border-border py-10 sm:py-12"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((h) => (
            <motion.div key={h.label} variants={staggerItem} className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-sm bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <h.icon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-body text-sm font-semibold text-foreground">{h.label}</p>
                <p className="font-body text-xs text-muted-foreground mt-0.5">{h.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Services preview */}
      <section className="py-20 sm:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="h-px w-10 bg-primary/40" />
              <Scissors className="w-4 h-4 text-primary" />
              <div className="h-px w-10 bg-primary/40" />
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3">Szolgáltatásaink</h2>
            <p className="font-body text-muted-foreground max-w-lg mx-auto">Válassz prémium szolgáltatásaink közül.</p>
          </motion.div>

          <motion.div {...stagger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {(services.length ? services : Array.from({ length: 3 })).map((s, i) => (
              <motion.div
                key={i}
                variants={staggerItem}
                className="group bg-card border border-border rounded-sm p-5 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                {s ? (
                  <>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-display text-base font-semibold text-foreground group-hover:text-primary transition-colors">{s.name}</h3>
                      {s.price && <span className="font-body text-sm font-bold text-primary whitespace-nowrap ml-2">{s.price}</span>}
                    </div>
                    <p className="font-body text-xs text-muted-foreground leading-relaxed">{s.description}</p>
                  </>
                ) : (
                  <div className="animate-pulse space-y-2">
                    <div className="h-4 bg-secondary rounded w-3/4" />
                    <div className="h-3 bg-secondary rounded w-full" />
                    <div className="h-3 bg-secondary rounded w-2/3" />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>

          <motion.div {...fadeUp(0.2)} className="text-center">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-6 py-3 border border-primary/30 text-primary font-body font-medium text-sm tracking-wide uppercase rounded-sm hover:bg-primary/10 transition-all duration-300"
            >
              Összes szolgáltatás <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Booking CTA */}
      <motion.section
        {...fadeUp()}
        className="py-20 sm:py-24 bg-secondary/40"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-6"
          >
            <Calendar className="w-7 h-7 text-primary" />
          </motion.div>
          <motion.h2 {...fadeUp(0.1)} className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Foglalj időpontot most
          </motion.h2>
          <motion.p {...fadeUp(0.2)} className="font-body text-muted-foreground max-w-xl mx-auto mb-8">
            Online foglalj néhány kattintással, vagy keress minket telefonon.
          </motion.p>
          <motion.div {...fadeUp(0.3)} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/booking"
              className="px-8 py-4 bg-primary text-primary-foreground font-body font-semibold text-sm tracking-wide uppercase rounded-sm hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
            >
              Online foglalás
            </Link>
            <a
              href={`tel:${settings.phone?.replace(/\s/g, "")}`}
              className="px-8 py-4 border border-border text-foreground font-body font-medium text-sm tracking-wide uppercase rounded-sm hover:border-primary/40 hover:text-primary transition-all duration-300"
            >
              Telefonos foglalás
            </a>
          </motion.div>
        </div>
      </motion.section>

      {/* Gallery preview */}
      <section className="py-20 sm:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="h-px w-10 bg-primary/40" />
              <Image className="w-4 h-4 text-primary" />
              <div className="h-px w-10 bg-primary/40" />
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3">Galéria</h2>
            <p className="font-body text-muted-foreground max-w-lg mx-auto">Tekintsd meg munkáinkat.</p>
          </motion.div>

          <motion.div {...stagger} className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
            {GALLERY_PREVIEWS.map((img, i) => (
              <motion.div
                key={i}
                variants={{
                  initial: { opacity: 0, scale: 0.9 },
                  whileInView: { opacity: 1, scale: 1 },
                  transition: { duration: 0.5, delay: i * 0.1 },
                }}
                className="group relative rounded-sm overflow-hidden aspect-[4/3]"
              >
                <img src={img} alt={`Galéria ${i + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-500" />
              </motion.div>
            ))}
          </motion.div>

          <motion.div {...fadeUp(0.2)} className="text-center">
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 px-6 py-3 border border-primary/30 text-primary font-body font-medium text-sm tracking-wide uppercase rounded-sm hover:bg-primary/10 transition-all duration-300"
            >
              Teljes galéria <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer settings={settings} />
    </div>
  );
}