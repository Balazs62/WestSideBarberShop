import React from "react";
import { motion } from "framer-motion";
import { Scissors, ArrowDown } from "lucide-react";

export default function HeroSection({ heroImage, title, subtitle }) {
  const scrollTo = (id) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const titleParts = title?.includes("Gyöngyös")
    ? [title.replace(" Gyöngyös", ""), "Gyöngyös"]
    : [title || "WestSide Barbershop", ""];

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="WestSide Barbershop belső tér"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6"
        >
          <div className="inline-flex items-center gap-3 mb-8">
            <div className="h-px w-8 sm:w-12 bg-primary/60" />
            <Scissors className="w-5 h-5 text-primary" />
            <span className="text-xs sm:text-sm tracking-[0.3em] uppercase text-primary font-body font-medium">
              Premium Barbershop
            </span>
            <Scissors className="w-5 h-5 text-primary rotate-180" />
            <div className="h-px w-8 sm:w-12 bg-primary/60" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
        >
          {titleParts[0]}
          {titleParts[1] && (
            <>
              <br />
              <span className="text-3xl sm:text-4xl md:text-5xl font-medium text-white/80">
                {titleParts[1]}
              </span>
            </>
          )}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="font-body text-base sm:text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          {subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={() => scrollTo("#booking")}
            className="px-8 py-4 bg-primary text-primary-foreground font-body font-semibold text-sm tracking-wide uppercase rounded-sm hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
          >
            Időpont foglalása
          </button>
          <button
            onClick={() => scrollTo("#services")}
            className="px-8 py-4 border border-white/30 text-white font-body font-medium text-sm tracking-wide uppercase rounded-sm hover:bg-white/10 hover:border-white/50 transition-all duration-300"
          >
            Szolgáltatások megtekintése
          </button>
        </motion.div>
      </div>

      <motion.button
        onClick={() => scrollTo("#services")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 hover:text-primary transition-colors"
      >
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
          <ArrowDown className="w-6 h-6" />
        </motion.div>
      </motion.button>
    </section>
  );
}