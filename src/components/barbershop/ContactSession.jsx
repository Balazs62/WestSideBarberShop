import React from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Clock, Scissors, Navigation } from "lucide-react";

export default function ContactSection({ settings = {} }) {
  const phone = settings.phone || "+36 30 388 5043";
  const address = settings.address || "Török Ignác utca 2, Gyöngyös";
  const hoursWeekday = settings.hours_weekday || "10:00 – 18:00";
  const hoursSaturday = settings.hours_saturday || "10:00 – 15:30";

  return (
    <section id="contact" className="py-20 sm:py-28 bg-background">
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
            Kapcsolat
          </h2>
          <p className="font-body text-muted-foreground max-w-xl mx-auto">
            Látogass el hozzánk, vagy keress minket bármilyen kérdéssel.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="flex items-start gap-4 p-5 bg-card border border-border rounded-sm hover:border-primary/30 transition-colors">
              <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-body text-sm font-semibold text-foreground mb-1">Cím</h4>
                <p className="font-body text-sm text-muted-foreground">{address}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 bg-card border border-border rounded-sm hover:border-primary/30 transition-colors">
              <Phone className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-body text-sm font-semibold text-foreground mb-1">Telefon</h4>
                <a href={`tel:${phone.replace(/\s/g, "")}`} className="font-body text-sm text-primary hover:underline">
                  {phone}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 bg-card border border-border rounded-sm hover:border-primary/30 transition-colors">
              <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-body text-sm font-semibold text-foreground mb-1">Nyitvatartás</h4>
                <div className="font-body text-sm text-muted-foreground space-y-1">
                  <div className="flex justify-between gap-6">
                    <span>Hétfő – Péntek</span>
                    <span className="text-foreground font-medium">{hoursWeekday}</span>
                  </div>
                  <div className="flex justify-between gap-6">
                    <span>Szombat</span>
                    <span className="text-foreground font-medium">{hoursSaturday}</span>
                  </div>
                  <div className="flex justify-between gap-6">
                    <span>Vasárnap</span>
                    <span className="text-destructive font-medium">Zárva</span>
                  </div>
                </div>
              </div>
            </div>

            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-body font-semibold text-sm uppercase tracking-wide rounded-sm hover:bg-primary/90 transition-all"
            >
              <Navigation className="w-4 h-4" />
              Útvonaltervezés
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-sm overflow-hidden border border-border h-80 lg:h-full min-h-[320px]"
          >
            <iframe
              title="WestSide Barbershop Gyöngyös térkép"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2661.0!2d19.9267!3d47.7849!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47406f2e7c29d3b5%3A0x58c2b4e8e25e4b4a!2sT%C3%B6r%C3%B6k+Ign%C3%A1c+u.+2%2C+Gy%C3%B6ngy%C3%B6s%2C+3200!5e0!3m2!1shu!2shu!4v1700000000000!5m2!1shu!2shu"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}