import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Scissors, Award, Clock, Users } from "lucide-react";

const highlights = [
  { icon: Scissors, label: "Precíz munkavégzés", desc: "Minden vágás tökéletesre csiszolva" },
  { icon: Award, label: "Prémium élmény", desc: "Minőségi termékek és profi kiszolgálás" },
  { icon: Clock, label: "Rugalmas időpontok", desc: "Hétfőtől szombatig várunk" },
  { icon: Users, label: "Elégedett vendégek", desc: "Visszatérő, lojális ügyfélkör" },
];

export default function AboutSection({ aboutImage, aboutText }) {
  return (
    <section id="about" className="py-20 sm:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="relative">
              <img
                src={aboutImage}
                alt="WestSide Barbershop barber"
                className="w-full max-w-md mx-auto lg:mx-0 rounded-sm object-cover aspect-[3/4]"
              />
              <div className="absolute inset-0 rounded-sm ring-1 ring-primary/20" />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border-r-2 border-b-2 border-primary/40 rounded-br-sm" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="h-px w-10 bg-primary/40" />
              <Scissors className="w-4 h-4 text-primary" />
              <div className="h-px w-10 bg-primary/40" />
            </div>

            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
              Rólunk
            </h2>

            <p className="font-body text-muted-foreground leading-relaxed mb-4">
              {aboutText || "A WestSide Barbershop Gyöngyös célja, hogy minden vendég friss, magabiztos és stílusos külsővel távozzon. Precíz átmenetek, modern frizurák, szakálligazítás és prémium barber élmény egy helyen."}
            </p>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
              className="grid grid-cols-2 gap-4 mt-8"
            >
              {highlights.map((h) => (
                <motion.div
                  key={h.label}
                  variants={{ hidden: { opacity: 0, scale: 0.85 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.45 } } }}
                  className="group p-4 bg-card border border-border rounded-sm hover:border-primary/30 transition-colors duration-300"
                >
                  <h.icon className="w-5 h-5 text-primary mb-2 group-hover:scale-110 transition-transform" />
                  <h4 className="font-body text-sm font-semibold text-foreground mb-1">{h.label}</h4>
                  <p className="font-body text-xs text-muted-foreground">{h.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}