import React from "react";
import { motion } from "framer-motion";

export default function ServiceCard({ service, index, onBook }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group relative bg-card border border-border rounded-sm p-6 hover:border-primary/40 transition-all duration-500 hover:shadow-lg hover:shadow-primary/5"
    >
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="flex items-start justify-between mb-3">
        <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300 leading-snug pr-3">
          {service.name}
        </h3>
        {service.price && (
          <span className="font-display text-lg font-bold text-primary whitespace-nowrap">
            {service.price}
          </span>
        )}
      </div>

      <p className="font-body text-sm text-muted-foreground mb-5 leading-relaxed">
        {service.description}
      </p>

      <button
        onClick={() => onBook(service)}
        className="w-full py-2.5 border border-primary/30 text-primary text-sm font-body font-medium tracking-wide uppercase rounded-sm hover:bg-primary hover:text-primary-foreground transition-all duration-300"
      >
        Foglalás
      </button>
    </motion.div>
  );
}