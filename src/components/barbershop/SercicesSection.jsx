import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Scissors } from "lucide-react";
import ServiceCard from "./ServiceCard";
import { base44 } from "@/api/base44Client";

const fallbackServices = [
  { id: "1", name: "Átmenetes hajvágás", price: "5 500 Ft", description: "Precíz átmenetes hajvágás, tökéletes vonalvezetéssel és modern stílussal." },
  { id: "2", name: "Haj + szakáll vágás", price: "7 500 Ft", description: "Komplett átalakítás: hajvágás és szakáll formázás egy ülésben." },
  { id: "3", name: "Hajvágás egyhosszra + szakáll", price: "", description: "Egyhosszú hajvágás professzionális szakáll igazítással kombinálva." },
  { id: "4", name: "Szakállvágás, átmenet + kontúrozás", price: "", description: "Részletes szakállformázás precíz átmenettel és éles kontúrozással." },
  { id: "5", name: "Gyerek hajvágás (9 éves korig)", price: "", description: "Barátságos környezetben, 9 éves korig. Türelmes, profi kiszolgálás." },
  { id: "6", name: "Hajvágás egyhosszra", price: "", description: "Klasszikus egyhosszú hajvágás, tiszta és letisztult végeredménnyel." },
  { id: "7", name: "Hajvágás – Béci", price: "6 000 Ft", description: "Személyre szabott hajvágás Béci kezei által, modern technikákkal." },
  { id: "8", name: "Prémium hajvágás – Béci", price: "7 500 Ft", description: "Hajmosással és fejmasszázzsal kiegészített prémium hajvágás élmény." },
  { id: "9", name: "Hajvágás + szakáll – Béci", price: "8 000 Ft", description: "Hajvágás és szakáll igazítás egyben, Béci precíz munkájával." },
  { id: "10", name: "Prémium haj + szakáll – Béci", price: "10 000 Ft", description: "Teljes prémium csomag: hajvágás, szakáll igazítás, hajmosás, fejmasszázs." },
  { id: "11", name: "Haj + szakáll + festés – Béci", price: "10 000 Ft", description: "Komplett csomag szakáll festéssel a tökéletes megjelenésért." },
  { id: "12", name: "Exkluzív csomag – Béci", price: "25 000 Ft", description: "A legteljesebb élmény: arckezelés, arcmasszázs, és prémium barber szolgáltatás." },
];

export default function ServicesSection({ onBookService }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Service.filter({ active: true }, "sort_order", 50)
      .then((data) => setServices(data.length ? data : fallbackServices))
      .catch(() => setServices(fallbackServices))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="services" className="py-20 sm:py-28 bg-background">
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
            Szolgáltatásaink
          </h2>
          <p className="font-body text-muted-foreground max-w-xl mx-auto">
            Válassz prémium szolgáltatásaink közül és foglalj időpontot még ma.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-sm p-6 animate-pulse">
                <div className="h-5 bg-secondary rounded mb-3 w-3/4" />
                <div className="h-4 bg-secondary rounded mb-2 w-full" />
                <div className="h-4 bg-secondary rounded mb-5 w-2/3" />
                <div className="h-9 bg-secondary rounded" />
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {services.map((service, index) => (
              <motion.div
                key={service.id || service.name}
                variants={{ hidden: { opacity: 0, y: 40, scale: 0.96 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } } }}
              >
                <ServiceCard service={service} index={index} onBook={onBookService} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}