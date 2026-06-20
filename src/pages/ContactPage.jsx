import React, { useEffect, useState } from "react";
import Navbar from "@/components/barbershop/Navbar";
import Footer from "@/components/barbershop/Footer";
import ContactSession from "@/components/barbershop/ContactSession";
import { base44 } from "@/api/base44Client";

const DEFAULTS = { phone: "+36 30 388 5043", address: "Török Ignác utca 2, Gyöngyös", hours_weekday: "10:00 – 18:00", hours_saturday: "10:00 – 15:30" };

export default function ContactPage() {
  const [settings, setSettings] = useState(DEFAULTS);

  useEffect(() => {
    base44.entities.SiteSettings.list("key", 100)
      .then(data => {
        if (data.length) {
          const m = { ...DEFAULTS };
          data.forEach(s => { m[s.key] = s.value; });
          setSettings(m);
        }
      }).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-20">
        <ContactSession settings={settings} />
      </div>
      <Footer settings={settings} />
    </div>
  );
}