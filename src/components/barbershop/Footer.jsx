import React from "react";
import { Phone, MapPin, Instagram, Facebook } from "lucide-react";

export default function Footer({ settings = {} }) {
  const phone = settings.phone || "+36 30 388 5043";
  const address = settings.address || "Török Ignác utca 2, Gyöngyös";
  const hoursWeekday = settings.hours_weekday || "10:00 – 18:00";
  const hoursSaturday = settings.hours_saturday || "10:00 – 15:30";
  const facebookUrl = settings.facebook_url || "https://www.facebook.com/";
  const instagramUrl = settings.instagram_url || "https://www.instagram.com/";

  const scrollTo = (id) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="font-display text-xl font-bold text-primary mb-3">WESTSIDE</h3>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              Barbershop Gyöngyös – Profi vágások, precíz átmenetek, extra vagányság.
            </p>
          </div>

          <div>
            <h4 className="font-body text-xs font-semibold text-foreground uppercase tracking-widest mb-4">
              Navigáció
            </h4>
            <div className="space-y-2">
              {[
                { label: "Főoldal", href: "#hero" },
                { label: "Szolgáltatások", href: "#services" },
                { label: "Foglalás", href: "#booking" },
                { label: "Galéria", href: "#gallery" },
                { label: "Kapcsolat", href: "#contact" },
              ].map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="block font-body text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-body text-xs font-semibold text-foreground uppercase tracking-widest mb-4">
              Kapcsolat
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span className="font-body text-sm text-muted-foreground">{address}</span>
              </div>
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="font-body text-sm">{phone}</span>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-body text-xs font-semibold text-foreground uppercase tracking-widest mb-4">
              Nyitvatartás
            </h4>
            <div className="font-body text-sm text-muted-foreground space-y-1 mb-4">
              <p>H–P: {hoursWeekday}</p>
              <p>Szo: {hoursSaturday}</p>
              <p>V: Zárva</p>
            </div>
            <div className="flex gap-3">
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center border border-border rounded-sm text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center border border-border rounded-sm text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-body text-xs text-muted-foreground">
            © {new Date().getFullYear()} WestSide Barbershop Gyöngyös. Minden jog fenntartva.
          </p>
          <a
            href="https://pozsonyi-tamas-e-v.reservio.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-xs text-primary hover:underline"
          >
            Online foglalás – Reservio
          </a>
        </div>
      </div>
    </footer>
  );
}